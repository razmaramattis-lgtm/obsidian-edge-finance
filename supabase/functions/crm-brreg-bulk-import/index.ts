// Full historical import of every AS and ENK from Brønnøysundregistrene.
// Walks the Enhetsregisteret API backwards in date windows, resumable and time-boxed:
// each invocation continues from the stored cursor until the whole register is covered.
import { createClient } from "npm:@supabase/supabase-js@2";
import { isServiceRoleToken } from "../_shared/crm-auth.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BRREG = "https://data.brreg.no/enhetsregisteret/api/enheter";
// Fase 1: hent hele AS-registeret (ca. 431 000 selskaper). ENK hentes i en senere fase.
const ORG_FORMS = (Deno.env.get("CRM_IMPORT_ORG_FORMS") || "AS").split(",").map((s) => s.trim()).filter(Boolean);
const OLDEST = "1900-01-01";
const TIME_BUDGET_MS = 110_000;
const WINDOW_DAYS = 20;
const MAX_WINDOW_DAYS = 730;
const LOCK_MS = 150_000;



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
    raw: null,
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
  if (!isServiceRoleToken(token, serviceKey)) {
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
    // Fortsetter der importen sto sist – nullstiller BARE hvis man ber om det eksplisitt
    // (ellers begynner man forfra på dagens dato og henter de samme selskapene om igjen).
    const restart = body.restart === true || !state?.cursor_date;
    const cursor_date = restart ? iso(new Date()) : (state!.cursor_date as string);
    await admin.from("crm_import_state").upsert({
      id: 1, status: "running", error_message: null,
      processed: restart ? 0 : Number(state?.processed || 0),
      imported: restart ? 0 : Number(state?.imported || 0),
      cursor_date, started_at: new Date().toISOString(), finished_at: null,
    });
    state = { ...(state || {}), status: "running", cursor_date } as any;

  } else if (body.action === "stop") {
    await admin.from("crm_import_state").update({ status: "paused" }).eq("id", 1);
    return json({ stopped: true });
  } else if (body.action === "resume_from") {
    // Continue an interrupted import without losing the counters.
    await admin.from("crm_import_state").update({ status: "running", error_message: null }).eq("id", 1);
    state = { ...(state || {}), status: "running" } as any;
  } else if (!state || state.status !== "running") {
    return json({ skipped: true, status: state?.status ?? "idle" });
  }

  // Simple run lock so overlapping cron ticks don't fetch the same window twice.
  if (body.action !== "start" && state?.last_run_at && Date.now() - new Date(state.last_run_at as string).getTime() < LOCK_MS) {
    return json({ skipped: true, reason: "already_running" });
  }
  await admin.from("crm_import_state").update({ last_run_at: new Date().toISOString() }).eq("id", 1);

  let cursor = (state?.cursor_date as string) || iso(new Date());
  let processed = Number(state?.processed || 0);
  let imported = Number(state?.imported || 0);
  let windowDays = WINDOW_DAYS;
  const startedAt = Date.now();

  try {
    let done = false;

    while (Date.now() - startedAt < TIME_BUDGET_MS) {
      const to = cursor;
      const fromDate = new Date(new Date(to).getTime() - windowDays * 86_400_000);
      const from = iso(fromDate);
      let windowComplete = true;
      let windowCount = 0;
      let tooBig = false;

      for (let page = 0; page < 20; page++) {
        const data = await fetchPage(from, to, page);
        // Brreg gir maks 10 000 treff per søk. Er vinduet større må det deles,
        // ellers hopper vi over selskaper uten å merke det.
        if (page === 0 && (data?.page?.totalElements ?? 0) > 10_000 && windowDays > 1) {
          tooBig = true;
          break;
        }
        const enheter = data?._embedded?.enheter || [];
        if (enheter.length) {

          windowCount += enheter.length;
          const rows = Array.from(
            enheter.reduce((m: Map<string, any>, e: any) => (e?.organisasjonsnummer ? m.set(e.organisasjonsnummer, mapRow(e)) : m), new Map()).values(),
          )
            // Krav: kun selskaper med e-post i Brønnøysund importeres.
            .filter((r: any) => requireEmail === false || !!r.email);
          // Mindre bolker + retry: store bolker kan treffe databasens statement timeout.
          for (let i = 0; i < rows.length; i += 150) {
            const chunk = rows.slice(i, i + 150);
            // Only brand new companies are inserted – existing cards keep their
            // manual edits, category and contact status.
            let lastErr: string | null = null;
            for (let attempt = 0; attempt < 3; attempt++) {
              const { error } = await admin.from("crm_leads").upsert(chunk, { onConflict: "orgnr", ignoreDuplicates: true });
              if (!error) { lastErr = null; break; }
              lastErr = error.message || JSON.stringify(error);
              await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
            }
            if (lastErr) throw new Error(lastErr);
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

      if (tooBig) { windowDays = Math.max(1, Math.floor(windowDays / 3)); continue; }
      if (!windowComplete) break;

      // Adaptive window: sparse/empty periods (older years) are skipped much faster,
      // dense periods stay small so we never hit the API's 10 000-result page cap.
      if (windowCount === 0) windowDays = Math.min(MAX_WINDOW_DAYS, windowDays * 4);
      else if (windowCount < 1500) windowDays = Math.min(MAX_WINDOW_DAYS, Math.ceil(windowDays * 1.5));
      else if (windowCount > 6000) windowDays = Math.max(1, Math.floor(windowDays / 2));


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
    // Importen skal aldri stoppe helt av en midlertidig feil – vi beholder "running"
    // slik at neste kjøring (hvert minutt) fortsetter fra samme punkt.
    await admin.from("crm_import_state").update({
      status: "running", error_message: message, processed, imported, cursor_date: cursor,
      last_run_at: new Date(Date.now() - LOCK_MS).toISOString(),
    }).eq("id", 1);

    await admin.from("crm_sync_log").insert({ mode: "bulk_import", fetched: processed, inserted: imported, updated: 0, status: "error", error_message: message });
    return json({ error: message }, 500);
  }
});
