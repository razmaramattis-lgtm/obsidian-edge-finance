// Full historical import of every AS and ENK from Brønnøysundregistrene.
// Walks the Enhetsregisteret API backwards in date windows, resumable and time-boxed:
// each invocation continues from the stored cursor until the whole register is covered.
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BRREG = "https://data.brreg.no/enhetsregisteret/api/enheter";
const ORG_FORMS = ["AS", "ENK"];
const OLDEST = "1900-01-01";
const TIME_BUDGET_MS = 60_000;
const WINDOW_DAYS = 10;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

const iso = (d: Date) => d.toISOString().slice(0, 10);

function categorize(registeredAt: string | null): string {
  if (registeredAt) {
    const days = (Date.now() - new Date(registeredAt).getTime()) / 86_400_000;
    if (days <= 60) return "ny_bedrift";
  }
  return "ingen_regnskapsforer";
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
    has_auditor: false,
    category: categorize(registered),
    source: "brreg_bulk",
    raw: e,
    synced_at: new Date().toISOString(),
  };
}

async function fetchPage(from: string, to: string, page: number) {
  const p = new URLSearchParams();
  p.set("fraRegistreringsdatoEnhetsregisteret", from);
  p.set("tilRegistreringsdatoEnhetsregisteret", to);
  p.set("size", "500");
  p.set("page", String(page));
  for (const f of ORG_FORMS) p.append("organisasjonsform", f);
  const res = await fetch(`${BRREG}?${p.toString()}`, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`Brreg svarte ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return await res.json();
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

  let { data: state } = await admin.from("crm_import_state").select("*").eq("id", 1).maybeSingle();

  if (body.action === "start") {
    await admin.from("crm_import_state").upsert({
      id: 1, status: "running", processed: 0, imported: 0, error_message: null,
      cursor_date: iso(new Date()), started_at: new Date().toISOString(), finished_at: null,
    });
    state = { ...(state || {}), status: "running", processed: 0, imported: 0, cursor_date: iso(new Date()) } as any;
  } else if (body.action === "stop") {
    await admin.from("crm_import_state").update({ status: "paused" }).eq("id", 1);
    return json({ stopped: true });
  } else if (!state || state.status !== "running") {
    return json({ skipped: true, status: state?.status ?? "idle" });
  }

  let cursor = (state?.cursor_date as string) || iso(new Date());
  let processed = Number(state?.processed || 0);
  let imported = Number(state?.imported || 0);
  const startedAt = Date.now();

  try {
    let done = false;

    while (Date.now() - startedAt < TIME_BUDGET_MS) {
      const to = cursor;
      const fromDate = new Date(new Date(to).getTime() - WINDOW_DAYS * 86_400_000);
      const from = iso(fromDate);
      let windowComplete = true;

      for (let page = 0; page < 20; page++) {
        const data = await fetchPage(from, to, page);
        const enheter = data?._embedded?.enheter || [];
        if (enheter.length) {
          const rows = Array.from(
            enheter.reduce((m: Map<string, any>, e: any) => (e?.organisasjonsnummer ? m.set(e.organisasjonsnummer, mapRow(e)) : m), new Map()).values(),
          );
          for (let i = 0; i < rows.length; i += 500) {
            const chunk = rows.slice(i, i + 500);
            // Only brand new companies are inserted – existing cards keep their
            // manual edits, category and contact status.
            const { error } = await admin.from("crm_leads").upsert(chunk, { onConflict: "orgnr", ignoreDuplicates: true });
            if (error) throw new Error(error.message || JSON.stringify(error));
          }
          processed += enheter.length;
          imported += rows.length;
          // Persist after every page so progress survives a hard shutdown.
          await admin.from("crm_import_state").update({
            processed, imported, last_run_at: new Date().toISOString(), error_message: null,
          }).eq("id", 1);
          console.log(`window ${from}..${to} page ${page}: +${enheter.length} (total ${processed})`);
        }
        const totalPages = data?.page?.totalPages ?? 1;
        if (page + 1 >= totalPages || enheter.length === 0) break;
        if (Date.now() - startedAt >= TIME_BUDGET_MS) { windowComplete = false; break; }
      }

      if (!windowComplete) break;

      cursor = iso(new Date(fromDate.getTime() - 86_400_000));
      await admin.from("crm_import_state").update({
        processed, imported, cursor_date: cursor, last_run_at: new Date().toISOString(), error_message: null,
      }).eq("id", 1);

      if (new Date(cursor) <= new Date(OLDEST)) { done = true; break; }
    }

    if (done) {
      await admin.from("crm_import_state").update({ status: "done", finished_at: new Date().toISOString() }).eq("id", 1);
    }

    await admin.from("crm_sync_log").insert({
      mode: "bulk_import", fetched: processed, inserted: imported, updated: 0,
      status: "ok", details: { cursor, done },
    });

    return json({ success: true, processed, imported, cursor, done });
  } catch (e) {
    const message = e instanceof Error ? e.message : JSON.stringify(e);
    await admin.from("crm_import_state").update({
      status: "error", error_message: message, processed, imported, cursor_date: cursor, last_run_at: new Date().toISOString(),
    }).eq("id", 1);
    await admin.from("crm_sync_log").insert({ mode: "bulk_import", fetched: processed, inserted: imported, updated: 0, status: "error", error_message: message });
    return json({ error: message }, 500);
  }
});
