// Full company enrichment for CRM leads:
//  - Enhetsregisteret: name, org form, industry, address, phone, e-mail, website
//  - Rolleregisteret: daglig leder, styreleder, eiere/roller, regnskapsfører, revisor
//  - Regnskapsregisteret: last available annual accounts (revenue, results, equity ...)
//  - Web scan: e-mail, phone, social profiles and a short description from the website
import { createClient } from "npm:@supabase/supabase-js@2";
import { isServiceRoleToken } from "../_shared/crm-auth.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { ...corsHeaders, "Content-Type": "application/json" } });

const UA = "Mozilla/5.0 (compatible; AvargoCRM/1.0; +https://avargo.no)";
const BRREG = "https://data.brreg.no/enhetsregisteret/api/enheter";
const REGN = "https://data.brreg.no/regnskapsregisteret/regnskap";
const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const PHONE_RE = /(?:\+47[\s-]?)?(?:\d{2}[\s-]?){3}\d{2}|\+47\d{8}/g;
const BAD_EMAIL = /(sentry|wixpress|example\.|\.png|\.jpg|\.jpeg|\.gif|\.webp|\.svg|domain\.com|email\.com|yourdomain)/i;
const PATHS = ["", "/kontakt", "/kontakt-oss", "/contact", "/om-oss"];

async function grab(url: string, ms = 8000): Promise<string | null> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "text/html,application/json" }, signal: ctrl.signal, redirect: "follow" });
    if (!res.ok) return null;
    return (await res.text()).slice(0, 400_000);
  } catch {
    return null;
  } finally { clearTimeout(t); }
}

async function getJson(url: string) {
  try {
    const res = await fetch(url, { headers: { Accept: "application/json", "User-Agent": UA } });
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}

function num(v: unknown): number | null {
  return typeof v === "number" && isFinite(v) ? v : null;
}

/* ── Regnskapsregisteret ── */
function mapAccount(a: any) {
  const res = a?.resultatregnskapResultat || {};
  const drift = res?.driftsresultat || {};
  const inntekt = drift?.driftsinntekter || {};
  const eg = a?.egenkapitalGjeld || {};
  return {
    year: Number(a?.regnskapsperiode?.fraDato?.slice(0, 4)) || null,
    to: a?.regnskapsperiode?.tilDato || null,
    currency: a?.valuta || "NOK",
    revenue: num(inntekt?.sumDriftsinntekter),
    operating_result: num(drift?.driftsresultat),
    profit_before_tax: num(res?.ordinaertResultatFoerSkattekostnad),
    net_result: num(res?.aarsresultat),
    equity: num(eg?.egenkapital?.sumEgenkapital),
    total_assets: num(a?.eiendeler?.sumEiendeler),
    total_debt: num(eg?.gjeldOversikt?.sumGjeld),
  };
}

async function fetchFinancials(orgnr: string) {
  const data = await getJson(`${REGN}/${orgnr}`);
  if (!Array.isArray(data) || !data.length) return null;
  const years = data.map(mapAccount).filter((y) => y.year).sort((a, b) => (b.year || 0) - (a.year || 0));
  if (!years.length) return null;
  return years.slice(0, 5);
}

/* ── Roller ── */
async function fetchRoles(orgnr: string) {
  const data = await getJson(`${BRREG}/${orgnr}/roller`);
  if (!data) return null;
  const roles: { type: string; name: string }[] = [];
  const owners: { type: string; name: string }[] = [];
  let accountant: string | null = null, auditor = false, ceo: string | null = null, chair: string | null = null;
  for (const g of data?.rollegrupper || []) {
    const gtype = g?.type?.kode || "";
    for (const r of g?.roller || []) {
      if (r?.fratraadt) continue;
      const name = r?.person
        ? [r.person?.navn?.fornavn, r.person?.navn?.mellomnavn, r.person?.navn?.etternavn].filter(Boolean).join(" ")
        : r?.enhet?.navn || "";
      if (!name) continue;
      const kode = r?.type?.kode || gtype;
      roles.push({ type: r?.type?.beskrivelse || kode, name });
      if (kode === "REGN") accountant = name;
      if (kode === "REVI") auditor = true;
      if (kode === "DAGL" && !ceo) ceo = name;
      if (kode === "LEDE" && !chair) chair = name;
      if (["INNH", "DTPR", "KOMP", "MEDL", "LEDE"].includes(kode)) owners.push({ type: r?.type?.beskrivelse || kode, name });
    }
  }
  return { roles, owners, accountant, auditor, ceo, chair };
}

/* ── Nettskanning ── */
function pickEmails(html: string, domain?: string | null) {
  const decoded = html.replace(/&#64;|\(at\)|\[at\]/gi, "@").replace(/&amp;/g, "&");
  const out = new Set<string>();
  for (const m of decoded.match(EMAIL_RE) || []) {
    const e = m.toLowerCase().replace(/\.$/, "");
    if (BAD_EMAIL.test(e) || e.length > 90) continue;
    out.add(e);
  }
  const score = (e: string) => (domain && e.endsWith(`@${domain}`) ? 10 : 0) +
    (/^(post|kontakt|hei|info|firmapost|mail)@/.test(e) ? 5 : 0) -
    (/^(noreply|no-reply|support|webmaster|abuse|privacy)@/.test(e) ? 5 : 0);
  return Array.from(out).sort((a, b) => score(b) - score(a));
}

function pickSocial(html: string) {
  const links: Record<string, string> = {};
  const patterns: [string, RegExp][] = [
    ["facebook", /https?:\/\/(?:www\.)?facebook\.com\/[A-Za-z0-9._\-/%]+/i],
    ["instagram", /https?:\/\/(?:www\.)?instagram\.com\/[A-Za-z0-9._\-/%]+/i],
    ["linkedin", /https?:\/\/(?:[a-z]{2}\.)?linkedin\.com\/(?:company|in)\/[A-Za-z0-9._\-/%]+/i],
    ["youtube", /https?:\/\/(?:www\.)?youtube\.com\/[A-Za-z0-9._\-/@%]+/i],
    ["tiktok", /https?:\/\/(?:www\.)?tiktok\.com\/@[A-Za-z0-9._\-]+/i],
  ];
  for (const [k, re] of patterns) {
    const m = html.match(re);
    if (m) links[k] = m[0].replace(/["'<>].*$/, "");
  }
  return Object.keys(links).length ? links : null;
}

function pickDescription(html: string) {
  const m = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']{20,400})["']/i)
    || html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']{20,400})["']/i);
  return m ? m[1].replace(/\s+/g, " ").trim() : null;
}

function normalizeUrl(raw: string) {
  const u = raw.trim().replace(/\s+/g, "");
  if (!u) return null;
  return u.startsWith("http") ? u : `https://${u}`;
}

async function scanWeb(website: string | null) {
  if (!website) return { status: "ingen_nettside" as const, email: null, phone: null, social: null, summary: null, website: null };
  const url = normalizeUrl(website);
  let host = "";
  try { host = new URL(url!).hostname.replace(/^www\./, ""); } catch { return { status: "ugyldig_nettside" as const, email: null, phone: null, social: null, summary: null, website: null }; }
  const base = url!.replace(/\/+$/, "");
  let email: string | null = null, phone: string | null = null, summary: string | null = null;
  let social: Record<string, string> | null = null;
  for (const p of PATHS) {
    const html = await grab(base + p);
    if (!html) continue;
    if (!email) email = pickEmails(html, host)[0] || null;
    if (!social) social = pickSocial(html);
    if (!summary) summary = pickDescription(html);
    if (!phone) {
      const m = html.match(PHONE_RE);
      const cand = (m || []).map((x) => x.replace(/[\s-]/g, "")).find((x) => /^(\+47)?[2-9]\d{7}$/.test(x));
      if (cand) phone = cand.startsWith("+47") ? cand.slice(3) : cand;
    }
    if (email && social && summary && phone) break;
  }
  return { status: email || phone || social ? "funnet" : "ikke_funnet", email, phone, social, summary, website: base };
}

async function mapLimit<T, R>(items: T[], limit: number, fn: (i: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let i = 0;
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (i < items.length) { const idx = i++; out[idx] = await fn(items[idx]); }
  }));
  return out;
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
  try { body = await req.json(); } catch { /* ignore */ }

  const leadIds = (body.leadIds as string[]) || [];
  const limit = Math.min(Number(body.limit) || 25, 60);
  const skipWeb = body.skipWeb === true;

  const cols = "id, orgnr, name, website, email, phone, contact_name, manual_lock";
  let q = leadIds.length
    ? admin.from("crm_leads").select(cols).in("id", leadIds).limit(Math.max(limit, leadIds.length))
    : admin.from("crm_leads").select(cols).is("financials_fetched_at", null).order("registered_at", { ascending: false, nullsFirst: false }).limit(limit);

  const { data: leads, error } = await q;
  if (error) return json({ error: error.message }, 500);
  if (!leads?.length) return json({ processed: 0, withFinancials: 0, message: "Ingen selskaper å berike" });

  let withFinancials = 0, withEmail = 0, withOwner = 0;

  await mapLimit(leads as any[], 4, async (l: any) => {
    const [enhet, roleInfo, fin] = await Promise.all([
      getJson(`${BRREG}/${l.orgnr}`),
      fetchRoles(l.orgnr),
      fetchFinancials(l.orgnr),
    ]);

    const patch: Record<string, unknown> = { scanned_at: new Date().toISOString() };

    if (enhet) {
      const addr = enhet.forretningsadresse || enhet.postadresse || {};
      patch.name = enhet.navn || l.name;
      patch.org_form = enhet.organisasjonsform?.kode ?? null;
      patch.org_form_text = enhet.organisasjonsform?.beskrivelse ?? null;
      patch.industry_code = enhet.naeringskode1?.kode ?? null;
      patch.industry_text = enhet.naeringskode1?.beskrivelse ?? null;
      patch.municipality = addr.kommune ?? null;
      patch.municipality_number = addr.kommunenummer ?? null;
      patch.postal_code = addr.postnummer ?? null;
      patch.postal_area = addr.poststed ?? null;
      patch.address = Array.isArray(addr.adresse) ? addr.adresse.filter(Boolean).join(", ") : null;
      patch.registered_at = enhet.registreringsdatoEnhetsregisteret ?? null;
      if (typeof enhet.antallAnsatte === "number") patch.employees = enhet.antallAnsatte;
      if (!l.manual_lock) {
        const brregEmail = (enhet.epostadresse || "").trim();
        const brregPhone = (enhet.telefon || enhet.mobil || "").trim();
        const site = (enhet.hjemmeside || "").trim();
        if (!l.email && brregEmail) { patch.email = brregEmail; patch.email_source = "brreg"; patch.email_verified = true; }
        if (!l.phone && brregPhone) patch.phone = brregPhone;
        if (!l.website && site) patch.website = site;
      }
    }

    if (roleInfo) {
      patch.roles = roleInfo.roles;
      patch.owners = roleInfo.owners;
      patch.ceo_name = roleInfo.ceo;
      patch.chair_name = roleInfo.chair;
      patch.has_accountant = !!roleInfo.accountant;
      patch.accountant_name = roleInfo.accountant;
      patch.has_auditor = roleInfo.auditor;
      const contact = roleInfo.ceo || roleInfo.chair || roleInfo.owners[0]?.name || null;
      if (contact && !l.manual_lock) { patch.contact_name = contact; withOwner++; }
    }

    if (fin?.length) {
      const last = fin[0];
      patch.financials = fin;
      patch.fiscal_year = last.year;
      patch.revenue = last.revenue;
      patch.operating_result = last.operating_result;
      patch.profit_before_tax = last.profit_before_tax;
      patch.net_result = last.net_result;
      patch.equity = last.equity;
      patch.total_assets = last.total_assets;
      patch.total_debt = last.total_debt;
      patch.currency = last.currency;
      withFinancials++;
    }
    patch.financials_fetched_at = new Date().toISOString();

    if (!skipWeb) {
      const site = (patch.website as string) || l.website || null;
      const web = await scanWeb(site);
      patch.scan_status = web.status;
      if (web.website && !l.website) patch.website = web.website;
      if (!l.manual_lock) {
        if (!l.email && !patch.email && web.email) { patch.email = web.email; patch.email_source = "web"; patch.email_verified = false; }
        if (!l.phone && !patch.phone && web.phone) patch.phone = web.phone;
      }
      if (web.social) patch.social_links = web.social;
      if (web.summary) patch.company_summary = web.summary;
      if (patch.email) withEmail++;
    }

    await admin.from("crm_leads").update(patch).eq("id", l.id);
  });

  return json({ processed: leads.length, withFinancials, withEmail, withOwner });
});
