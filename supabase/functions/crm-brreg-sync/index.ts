// Daily sync of companies from Brønnøysundregistrene (Enhetsregisteret) into the CRM.
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BRREG = "https://data.brreg.no/enhetsregisteret/api/enheter";
const MAX_ROLE_LOOKUPS = 250;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

interface Settings {
  lookback_days: number;
  municipality_numbers: string[];
  org_forms: string[];
  industry_prefixes: string[];
}

function iso(d: Date) {
  return d.toISOString().slice(0, 10);
}

function categorize(registeredAt: string | null, hasAccountant: boolean): string {
  if (registeredAt) {
    const days = (Date.now() - new Date(registeredAt).getTime()) / 86_400_000;
    if (days <= 60) return "ny_bedrift";
  }
  return hasAccountant ? "har_regnskapsforer" : "ingen_regnskapsforer";
}

async function fetchDetails(orgnr: string) {
  try {
    const res = await fetch(`${BRREG}/${orgnr}`, { headers: { Accept: "application/json" } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function fetchRoles(orgnr: string) {

  try {
    const res = await fetch(`${BRREG}/${orgnr}/roller`);
    if (!res.ok) return null;
    const data = await res.json();
    const groups = data?.rollegrupper || [];
    const roles: { type: string; name: string }[] = [];
    let accountant: string | null = null;
    let hasAuditor = false;
    let contact: string | null = null;

    for (const g of groups) {
      const type = g?.type?.kode || "";
      for (const r of g?.roller || []) {
        const name = r?.person
          ? [r.person?.navn?.fornavn, r.person?.navn?.mellomnavn, r.person?.navn?.etternavn].filter(Boolean).join(" ")
          : r?.enhet?.navn || "";
        if (!name) continue;
        roles.push({ type: r?.type?.kode || type, name });
        const kode = r?.type?.kode || type;
        if (kode === "REGN") accountant = name;
        if (kode === "REVI") hasAuditor = true;
        if (["DAGL", "INNH", "LEDE"].includes(kode) && !contact) contact = name;
      }
    }
    return { roles, accountant, hasAuditor, contact };
  } catch {
    return null;
  }
}

async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (i < items.length) {
        const idx = i++;
        out[idx] = await fn(items[idx]);
      }
    }),
  );
  return out;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const url = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const admin = createClient(url, serviceKey);

  const authHeader = req.headers.get("Authorization") || "";
  const token = authHeader.replace("Bearer ", "").trim();
  const internal = !!token && token === serviceKey;

  if (!internal) {
    if (!token) return json({ error: "Unauthorized" }, 401);
    const anon = createClient(url, anonKey);
    const { data: userData, error } = await anon.auth.getUser(token);
    if (error || !userData?.user) return json({ error: "Unauthorized" }, 401);
    const { data: isStaff } = await admin.rpc("is_employee_or_admin", { uid: userData.user.id });
    if (!isStaff) return json({ error: "Forbidden" }, 403);
  }

  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch { /* empty body = daily run */ }

  const { data: settings } = await admin
    .from("crm_automation_settings")
    .select("lookback_days, municipality_numbers, org_forms, industry_prefixes, sync_enabled")
    .eq("id", 1)
    .maybeSingle();

  const s: Settings = {
    lookback_days: (settings?.lookback_days as number) ?? 7,
    municipality_numbers: (settings?.municipality_numbers as string[]) ?? [],
    org_forms: (settings?.org_forms as string[]) ?? [],
    industry_prefixes: (settings?.industry_prefixes as string[]) ?? [],
  };

  const mode = (body.mode as string) || "daily";
  if (mode === "daily" && settings && settings.sync_enabled === false) {
    return json({ skipped: true, reason: "sync_disabled" });
  }

  // "backfill" = fortsett bakover i tid fra det eldste selskapet vi allerede har,
  // slik at hver kjøring legger til NYE selskaper i stedet for å hente samme vindu på nytt.
  let from = (body.from as string) || iso(new Date(Date.now() - s.lookback_days * 86_400_000));
  let to = (body.to as string) || iso(new Date());

  if (mode === "backfill" && !body.from) {
    const windowDays = Number(body.windowDays) || 60;
    const { data: oldest } = await admin
      .from("crm_leads")
      .select("registered_at")
      .not("registered_at", "is", null)
      .order("registered_at", { ascending: true })
      .limit(1)
      .maybeSingle();
    const end = oldest?.registered_at
      ? new Date(new Date(oldest.registered_at as string).getTime() - 86_400_000)
      : new Date();
    to = iso(end);
    from = iso(new Date(end.getTime() - windowDays * 86_400_000));
  }

  const municipalities = (body.municipalities as string[]) ?? s.municipality_numbers;
  const orgForms = (body.orgForms as string[]) ?? s.org_forms;
  const industryPrefixes = (body.industryPrefixes as string[]) ?? s.industry_prefixes;
  const maxPages = Math.min(Number(body.maxPages) || (mode === "backfill" ? 30 : 10), 30);

  let fetched = 0;
  let inserted = 0;
  let updated = 0;

  try {
    const collected: Record<string, unknown>[] = [];

    for (let page = 0; page < maxPages; page++) {
      const params = new URLSearchParams();
      params.set("fraRegistreringsdatoEnhetsregisteret", from);
      params.set("tilRegistreringsdatoEnhetsregisteret", to);
      params.set("size", "100");
      params.set("page", String(page));
      params.set("sort", "registreringsdatoEnhetsregisteret,DESC");
      for (const k of municipalities) params.append("kommunenummer", k);
      for (const f of orgForms) params.append("organisasjonsform", f);

      const res = await fetch(`${BRREG}?${params.toString()}`, { headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error(`Brreg svarte ${res.status}: ${await res.text()}`);
      const data = await res.json();
      const enheter = data?._embedded?.enheter || [];
      collected.push(...enheter);
      fetched += enheter.length;
      const totalPages = data?.page?.totalPages ?? 1;
      if (page + 1 >= totalPages || enheter.length === 0) break;
    }

    // Optional industry filtering (NACE prefix, e.g. "41" or "56.10")
    const filtered = industryPrefixes.length
      ? collected.filter((e: any) => {
        const code = e?.naeringskode1?.kode || "";
        return industryPrefixes.some((p) => code.startsWith(p));
      })
      : collected;

    // Which of these already exist? (existing leads are never wiped – manual edits win)
    const orgnrs = filtered.map((e: any) => e.organisasjonsnummer).filter(Boolean);
    const existing = new Set<string>();
    const existingRows = new Map<string, any>();
    for (let i = 0; i < orgnrs.length; i += 500) {
      const { data: rows } = await admin
        .from("crm_leads")
        .select("orgnr, email, phone, contact_name, website, category, manual_lock, email_source, email_verified")
        .in("orgnr", orgnrs.slice(i, i + 500));
      for (const r of rows || []) {
        existing.add(r.orgnr as string);
        existingRows.set(r.orgnr as string, r);
      }
    }

    // Role + contact-detail lookups for the newest entries first
    const needRoles = filtered.filter((e: any) => !existing.has(e.organisasjonsnummer)).slice(0, MAX_ROLE_LOOKUPS);
    const roleMap = new Map<string, Awaited<ReturnType<typeof fetchRoles>>>();
    const detailMap = new Map<string, any>();
    await mapLimit(needRoles, 5, async (e: any) => {
      const orgnr = e.organisasjonsnummer;
      const [r, d] = await Promise.all([fetchRoles(orgnr), fetchDetails(orgnr)]);
      if (r) roleMap.set(orgnr, r);
      if (d) detailMap.set(orgnr, d);
    });

    const rows = filtered.map((e: any) => {
      const roleInfo = roleMap.get(e.organisasjonsnummer);
      const detail = detailMap.get(e.organisasjonsnummer) || {};
      const registered = e.registreringsdatoEnhetsregisteret || null;
      const hasAccountant = !!roleInfo?.accountant;
      const addr = e.forretningsadresse || e.postadresse || detail.forretningsadresse || {};
      const website = (e.hjemmeside || detail.hjemmeside || "").trim() || null;
      const email = (e.epostadresse || detail.epostadresse || "").trim() || null;

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
        website,
        email,
        email_verified: !!email,
        phone: (e.telefon || e.mobil || detail.telefon || detail.mobil || "").trim() || null,
        contact_name: roleInfo?.contact || null,
        roles: roleInfo?.roles || [],
        has_accountant: hasAccountant,
        accountant_name: roleInfo?.accountant || null,
        has_auditor: !!roleInfo?.hasAuditor,
        category: categorize(registered, hasAccountant),
        source: "brreg",
        raw: e,
        synced_at: new Date().toISOString(),
      };
    });

    // Brreg pagination can return the same company twice; a single upsert
    // cannot touch the same conflict target twice -> dedupe by orgnr.
    const deduped = Array.from(
      rows.reduce((m, r) => (r.orgnr ? m.set(r.orgnr as string, r) : m), new Map<string, typeof rows[number]>()).values(),
    ).map((r: any) => {
      const prev = existingRows.get(r.orgnr);
      if (!prev) return r;
      // Never destroy data we already have: manual edits and enriched contact info win.
      const merged: any = { ...r };
      if (prev.manual_lock) {
        merged.email = prev.email;
        merged.phone = prev.phone;
        merged.contact_name = prev.contact_name;
        merged.website = prev.website;
      } else {
        merged.email = r.email ?? prev.email ?? null;
        merged.phone = r.phone ?? prev.phone ?? null;
        merged.contact_name = r.contact_name ?? prev.contact_name ?? null;
        merged.website = r.website ?? prev.website ?? null;
      }
      // må alltid være boolean (NOT NULL) – bulk upsert fyller manglende nøkler med null
      merged.email_verified = merged.email
        ? (prev.email === merged.email ? !!prev.email_verified : !!r.email_verified)
        : false;
      merged.email_source = prev.email_source ?? (merged.email ? "brreg" : null);
      merged.category = prev.category ?? r.category; // beholder manuell kategorisering
      return merged;
    });

    for (let i = 0; i < deduped.length; i += 200) {
      const chunk = deduped.slice(i, i + 200);
      const { error } = await admin.from("crm_leads").upsert(chunk, { onConflict: "orgnr", ignoreDuplicates: false });
      if (error) throw new Error(error.message || JSON.stringify(error));
      for (const r of chunk) existing.has(r.orgnr) ? updated++ : inserted++;
    }

    // Etterfyll roller (regnskapsfører/revisor/kontaktperson) på leads som mangler det.
    let rolesFilled = 0;
    const roleBudget = Math.min(Number(body.roleBudget) || 400, 1000);
    if (roleBudget > 0) {
      const { data: pending } = await admin
        .from("crm_leads")
        .select("id, orgnr, registered_at, category")
        .eq("roles", "[]")
        .order("registered_at", { ascending: false, nullsFirst: false })
        .limit(roleBudget);

      await mapLimit(pending || [], 5, async (lead: any) => {
        const info = await fetchRoles(lead.orgnr);
        if (!info) return;
        const hasAccountant = !!info.accountant;
        const patch: Record<string, unknown> = {
          roles: info.roles,
          has_accountant: hasAccountant,
          accountant_name: info.accountant,
          has_auditor: !!info.hasAuditor,
        };
        if (info.contact) patch.contact_name = info.contact;
        if (lead.category === "ukjent" || lead.category === "ingen_regnskapsforer" || lead.category === "har_regnskapsforer") {
          patch.category = categorize(lead.registered_at, hasAccountant);
        }
        const { error } = await admin.from("crm_leads").update(patch).eq("id", lead.id);
        if (!error) rolesFilled++;
      });
    }


    await admin.from("crm_automation_settings").update({ last_sync_at: new Date().toISOString() }).eq("id", 1);
    await admin.from("crm_sync_log").insert({
      mode,
      fetched,
      inserted,
      updated,
      status: "ok",
      details: { from, to, municipalities, orgForms, industryPrefixes },
    });

    return json({ success: true, fetched, inserted, updated, from, to });
  } catch (e) {
    const message = e instanceof Error ? e.message : typeof e === "string" ? e : JSON.stringify(e);
    await admin.from("crm_sync_log").insert({ mode, fetched, inserted, updated, status: "error", error_message: message });
    return json({ error: message }, 500);
  }
});
