// Full import of every AS and ENK from Brønnøysundregistrene's bulk download.
// Runs time-boxed and resumable: each invocation continues where the last stopped.
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const DOWNLOAD_URL = "https://data.brreg.no/enhetsregisteret/api/enheter/lastned";
const ORG_FORMS = ["AS", "ENK"];
const TIME_BUDGET_MS = 220_000;
const BATCH = 500;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

function categorize(registeredAt: string | null, hasAccountant: boolean): string {
  if (registeredAt) {
    const days = (Date.now() - new Date(registeredAt).getTime()) / 86_400_000;
    if (days <= 60) return "ny_bedrift";
  }
  return hasAccountant ? "har_regnskapsforer" : "ingen_regnskapsforer";
}

function mapRow(e: any) {
  const addr = e.forretningsadresse || e.postadresse || {};
  const registered = e.registreringsdatoEnhetsregisteret || null;
  const email = (e.epostadresse || "").trim() || null;
  return {
    orgnr: e.organisasjonsnummer,
    name: e.navn,
    org_form: e.organisasjonsform?.kode || null,
    org_form_text: e.organisasjonsform?.beskrivelse || null,
    industry_code: e.naeringskode1?.kode || null,
    industry_text: e.naeringskode1?.beskrivelse || null,
    municipality: addr.kommune || null,
    municipality_number: addr.kommunenummer || null,
    postal_code: addr.postnummer || null,
    postal_area: addr.poststed || null,
    address: Array.isArray(addr.adresse) ? addr.adresse.filter(Boolean).join(", ") : null,
    registered_at: registered,
    founded_at: e.stiftelsesdato || null,
    employees: typeof e.antallAnsatte === "number" ? e.antallAnsatte : null,
    website: (e.hjemmeside || "").trim() || null,
    email,
    email_verified: !!email,
    email_source: email ? "brreg" : null,
    phone: (e.telefon || e.mobil || "").trim() || null,
    roles: [],
    has_accountant: false,
    has_auditor: !!e.registrertIForetaksregisteret && false,
    category: categorize(registered, false),
    source: "brreg_bulk",
    raw: e,
    synced_at: new Date().toISOString(),
  };
}

/** Peek the first bytes so we can gunzip only when the payload really is gzipped. */
async function openStream(): Promise<ReadableStream<Uint8Array>> {
  const res = await fetch(DOWNLOAD_URL, {
    headers: { Accept: "application/vnd.brreg.enhetsregisteret.enhet.v2+gzip" },
  });
  if (!res.ok || !res.body) throw new Error(`Brreg lastned svarte ${res.status}`);
  const reader = res.body.getReader();
  const first = await reader.read();
  const head = first.value ?? new Uint8Array();
  const gzipped = head.length > 1 && head[0] === 0x1f && head[1] === 0x8b;
  const raw = new ReadableStream<Uint8Array>({
    start(c) {
      if (head.length) c.enqueue(head);
      if (first.done) c.close();
    },
    async pull(c) {
      const { done, value } = await reader.read();
      if (done) c.close();
      else if (value) c.enqueue(value);
    },
    cancel() { reader.cancel(); },
  });
  return gzipped ? raw.pipeThrough(new DecompressionStream("gzip")) : raw;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const url = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const admin = createClient(url, serviceKey);

  const token = (req.headers.get("Authorization") || "").replace("Bearer ", "").trim();
  if (token !== serviceKey) {
    if (!token) return json({ error: "Unauthorized" }, 401);
    const anon = createClient(url, anonKey);
    const { data: userData, error } = await anon.auth.getUser(token);
    if (error || !userData?.user) return json({ error: "Unauthorized" }, 401);
    const { data: isStaff } = await admin.rpc("is_employee_or_admin", { uid: userData.user.id });
    if (!isStaff) return json({ error: "Forbidden" }, 403);
  }

  let body: Record<string, unknown> = {};
  try { body = await req.json(); } catch { /* cron */ }

  const { data: state } = await admin.from("crm_import_state").select("*").eq("id", 1).maybeSingle();

  if (body.action === "start") {
    await admin.from("crm_import_state").upsert({ id: 1, status: "running", processed: 0, imported: 0, error_message: null, started_at: new Date().toISOString(), finished_at: null });
  } else if (body.action === "stop") {
    await admin.from("crm_import_state").update({ status: "paused" }).eq("id", 1);
    return json({ stopped: true });
  } else if (!state || state.status !== "running") {
    return json({ skipped: true, status: state?.status ?? "idle" });
  }

  const startSkip = body.action === "start" ? 0 : Number(state?.processed || 0);
  let processed = startSkip;
  let imported = Number((body.action === "start" ? 0 : state?.imported) || 0);
  const startedAt = Date.now();

  try {
    const stream = await openStream();
    const reader = stream.pipeThrough(new TextDecoderStream()).getReader();

    let buf = "";
    let depth = 0, start = -1, inStr = false, esc = false;
    let seen = 0;
    let batch: Record<string, unknown>[] = [];
    let finished = false;
    let timedOut = false;

    const flush = async () => {
      if (!batch.length) return;
      // Bulk import only adds companies that are not already in the CRM –
      // existing cards (with manual edits, status, category) are never touched.
      const { error } = await admin.from("crm_leads").upsert(batch, { onConflict: "orgnr", ignoreDuplicates: true });
      if (error) throw new Error(error.message || JSON.stringify(error));
      imported += batch.length;
      batch = [];
    };

    outer:
    while (true) {
      const { done, value } = await reader.read();
      if (done) { finished = true; break; }
      buf += value;

      for (let i = 0; i < buf.length; i++) {
        const ch = buf[i];
        if (inStr) {
          if (esc) esc = false;
          else if (ch === "\\") esc = true;
          else if (ch === '"') inStr = false;
          continue;
        }
        if (ch === '"') { inStr = true; continue; }
        if (ch === "{") { if (depth === 0) start = i; depth++; continue; }
        if (ch === "}") {
          depth--;
          if (depth === 0 && start >= 0) {
            seen++;
            if (seen > startSkip) {
              const chunk = buf.slice(start, i + 1);
              try {
                const e = JSON.parse(chunk);
                const kode = e?.organisasjonsform?.kode;
                if (ORG_FORMS.includes(kode) && e?.organisasjonsnummer) batch.push(mapRow(e));
              } catch { /* ignore malformed entry */ }
              processed = seen;
              if (batch.length >= BATCH) {
                buf = buf.slice(i + 1); i = -1; start = -1;
                await flush();
                if (Date.now() - startedAt > TIME_BUDGET_MS) { timedOut = true; break outer; }
                continue;
              }
            } else {
              processed = seen;
            }
            start = -1;
          }
        }
      }
      // keep only the tail of an unfinished object
      if (depth > 0 && start >= 0) { buf = buf.slice(start); start = 0; }
      else { buf = ""; start = -1; }

      if (Date.now() - startedAt > TIME_BUDGET_MS) { timedOut = true; break; }
    }

    await flush();
    try { await reader.cancel(); } catch { /* noop */ }

    const done = finished && !timedOut;
    await admin.from("crm_import_state").update({
      processed,
      imported,
      status: done ? "done" : "running",
      last_run_at: new Date().toISOString(),
      finished_at: done ? new Date().toISOString() : null,
      error_message: null,
    }).eq("id", 1);

    await admin.from("crm_sync_log").insert({
      mode: "bulk_import",
      fetched: processed - startSkip,
      inserted: imported,
      updated: 0,
      status: "ok",
      details: { processed, done },
    });

    return json({ success: true, processed, imported, done });
  } catch (e) {
    const message = e instanceof Error ? e.message : JSON.stringify(e);
    await admin.from("crm_import_state").update({ status: "error", error_message: message, processed, last_run_at: new Date().toISOString() }).eq("id", 1);
    await admin.from("crm_sync_log").insert({ mode: "bulk_import", fetched: 0, inserted: 0, updated: 0, status: "error", error_message: message });
    return json({ error: message }, 500);
  }
});
