// Full regnskapsanalyse for ett selskap – hentes on demand fra Brønnøysund:
//  - Regnskapsregisteret (https://data.brreg.no/regnskapsregisteret/regnskap/{orgnr}): alle publiserte årsregnskap
//  - Enhetsregisteret (https://data.brreg.no/enhetsregisteret/api/enheter/{orgnr}): ansatte, bransje, adresse, status
//  - Rolleregisteret: daglig leder, styreleder, regnskapsfører, revisor
// Returnerer alle år med nøkkeltall + beregnet lønnsomhetsanalyse.
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

async function getJson(url: string) {
  try {
    const res = await fetch(url, { headers: { Accept: "application/json", "User-Agent": UA } });
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}

const num = (v: unknown): number | null => (typeof v === "number" && isFinite(v) ? v : null);
const pct = (a: number | null, b: number | null) =>
  a !== null && b !== null && b !== 0 ? Math.round((a / b) * 1000) / 10 : null;

/* Mapper ett årsregnskap fra Regnskapsregisteret til flate nøkkeltall */
function mapAccount(a: any) {
  const res = a?.resultatregnskapResultat || {};
  const drift = res?.driftsresultat || {};
  const inntekt = drift?.driftsinntekter || {};
  const kostnad = drift?.driftskostnad || {};
  const fin = res?.finansresultat || {};
  const eg = a?.egenkapitalGjeld || {};
  const eiendeler = a?.eiendeler || {};

  const revenue = num(inntekt?.sumDriftsinntekter);
  const operating = num(drift?.driftsresultat);
  const equity = num(eg?.egenkapital?.sumEgenkapital);
  const debt = num(eg?.gjeldOversikt?.sumGjeld);
  const assets = num(eiendeler?.sumEiendeler) ?? num(eg?.sumEgenkapitalGjeld);
  const currentAssets = num(eiendeler?.omloepsmidler?.sumOmloepsmidler);
  const shortDebt = num(eg?.gjeldOversikt?.kortsiktigGjeld?.sumKortsiktigGjeld);

  return {
    year: Number(a?.regnskapsperiode?.fraDato?.slice(0, 4)) || null,
    from: a?.regnskapsperiode?.fraDato || null,
    to: a?.regnskapsperiode?.tilDato || null,
    currency: a?.valuta || "NOK",
    journal_number: a?.journalnr || null,
    accounting_type: a?.regnskapstype || null,
    plan: a?.oppstillingsplan || null,
    rules: a?.regnkapsprinsipper?.regnskapsregler || null,
    small_company: a?.regnkapsprinsipper?.smaaForetak ?? null,
    audited: a?.revisjon?.ikkeRevidertAarsregnskap === false ? true : a?.revisjon?.ikkeRevidertAarsregnskap === true ? false : null,
    audit_opted_out: a?.revisjon?.fravalgRevisjon ?? null,
    liquidation_accounts: a?.avviklingsregnskap ?? null,
    parent_company: a?.virksomhet?.morselskap ?? null,

    revenue,
    other_income: num(inntekt?.sumAnnenDriftsinntekt),
    operating_cost: num(kostnad?.sumDriftskostnad),
    payroll_cost: num(kostnad?.loennskostnad),
    operating_result: operating,
    financial_income: num(fin?.finansinntekt?.sumFinansinntekter),
    financial_cost: num(fin?.finanskostnad?.sumFinanskostnad),
    profit_before_tax: num(res?.ordinaertResultatFoerSkattekostnad),
    tax: num(res?.skattekostnad ?? res?.ordinaertResultatSkattekostnad),
    net_result: num(res?.aarsresultat),

    total_assets: assets,
    current_assets: currentAssets,
    fixed_assets: num(eiendeler?.anleggsmidler?.sumAnleggsmidler),
    equity,
    paid_in_equity: num(eg?.egenkapital?.innskuttEgenkapital?.sumInnskuttEgenkaptial),
    retained_equity: num(eg?.egenkapital?.opptjentEgenkapital?.sumOpptjentEgenkapital),
    total_debt: debt,
    short_term_debt: shortDebt,
    long_term_debt: num(eg?.gjeldOversikt?.langsiktigGjeld?.sumLangsiktigGjeld),

    // nøkkeltall
    operating_margin: pct(operating, revenue),
    net_margin: pct(num(res?.aarsresultat), revenue),
    equity_ratio: pct(equity, assets),
    liquidity_ratio: currentAssets !== null && shortDebt ? Math.round((currentAssets / shortDebt) * 100) / 100 : null,
    return_on_equity: pct(num(res?.aarsresultat), equity),
    return_on_assets: pct(operating, assets),
  };
}

type Year = ReturnType<typeof mapAccount>;

/* Enkel, forklarbar lønnsomhetsanalyse */
function analyse(years: Year[], employees: number | null) {
  if (!years.length) return null;
  const y = years[0];
  const prev = years[1];
  const growth = prev?.revenue && y.revenue !== null ? pct(y.revenue - prev.revenue, Math.abs(prev.revenue)) : null;
  const revenuePerEmployee = employees && y.revenue !== null ? Math.round(y.revenue / employees) : null;
  const payrollShare = pct(y.payroll_cost, y.revenue);
  const positiveYears = years.filter((x) => (x.net_result ?? 0) > 0).length;

  const flags: { level: "good" | "warn" | "bad"; text: string }[] = [];
  const add = (level: "good" | "warn" | "bad", text: string) => flags.push({ level, text });

  if (y.operating_margin !== null) {
    if (y.operating_margin >= 10) add("good", `Sterk driftsmargin på ${y.operating_margin} % – solid inntjening i driften.`);
    else if (y.operating_margin >= 3) add("warn", `Driftsmargin på ${y.operating_margin} % – akseptabelt, men tåler lite svikt.`);
    else add("bad", `Svak driftsmargin på ${y.operating_margin} % – driften tjener lite eller taper penger.`);
  }
  if (y.equity_ratio !== null) {
    if (y.equity_ratio >= 30) add("good", `Egenkapitalandel ${y.equity_ratio} % – god soliditet.`);
    else if (y.equity_ratio >= 15) add("warn", `Egenkapitalandel ${y.equity_ratio} % – middels soliditet.`);
    else add("bad", `Egenkapitalandel ${y.equity_ratio} % – lav soliditet og sårbar for tap.`);
  }
  if (y.liquidity_ratio !== null) {
    if (y.liquidity_ratio >= 1.5) add("good", `Likviditetsgrad ${y.liquidity_ratio} – god evne til å betale kortsiktig gjeld.`);
    else if (y.liquidity_ratio >= 1) add("warn", `Likviditetsgrad ${y.liquidity_ratio} – stram likviditet.`);
    else add("bad", `Likviditetsgrad ${y.liquidity_ratio} – kortsiktig gjeld er større enn omløpsmidlene.`);
  }
  if (growth !== null) {
    if (growth >= 10) add("good", `Omsetningen vokser ${growth} % fra ${prev!.year} til ${y.year}.`);
    else if (growth >= -5) add("warn", `Omsetningen er relativt flat (${growth} %) fra ${prev!.year} til ${y.year}.`);
    else add("bad", `Omsetningen faller ${Math.abs(growth)} % fra ${prev!.year} til ${y.year}.`);
  }
  if (payrollShare !== null) {
    if (payrollShare > 60) add("warn", `Lønnskostnader utgjør ${payrollShare} % av omsetningen – høy lønnsandel.`);
    else add("good", `Lønnskostnader utgjør ${payrollShare} % av omsetningen.`);
  }
  if ((y.equity ?? 0) < 0) add("bad", "Negativ egenkapital – selskapet har tapt hele aksjekapitalen.");

  // Score 0–100
  let score = 50;
  if (y.operating_margin !== null) score += Math.max(-20, Math.min(20, y.operating_margin));
  if (y.equity_ratio !== null) score += Math.max(-15, Math.min(15, (y.equity_ratio - 20) / 2));
  if (y.liquidity_ratio !== null) score += Math.max(-10, Math.min(10, (y.liquidity_ratio - 1) * 10));
  if (growth !== null) score += Math.max(-10, Math.min(10, growth / 3));
  if ((y.net_result ?? 0) < 0) score -= 10;
  score = Math.round(Math.max(0, Math.min(100, score)));

  const verdict =
    score >= 75 ? "Solid og lønnsomt selskap" :
    score >= 55 ? "Sunt selskap med forbedringspotensial" :
    score >= 35 ? "Blandet bilde – bør følges opp tett" :
    "Krevende økonomi – høy risiko";

  return {
    score,
    verdict,
    latest_year: y.year,
    revenue_growth: growth,
    revenue_per_employee: revenuePerEmployee,
    payroll_share: payrollShare,
    positive_years: positiveYears,
    years_available: years.length,
    flags,
  };
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

  const orgnr = String(body.orgnr || "").replace(/\D/g, "");
  const leadId = typeof body.leadId === "string" ? body.leadId : null;
  if (!/^\d{9}$/.test(orgnr)) return json({ error: "Ugyldig organisasjonsnummer" }, 400);

  const [accounts, unit, rolesRaw] = await Promise.all([
    getJson(`${REGN}/${orgnr}`),
    getJson(`${BRREG}/${orgnr}`),
    getJson(`${BRREG}/${orgnr}/roller`),
  ]);

  const years: Year[] = Array.isArray(accounts)
    ? accounts.map(mapAccount).filter((y) => y.year).sort((a, b) => (b.year || 0) - (a.year || 0))
    : [];

  let ceo: string | null = null, chair: string | null = null, accountant: string | null = null, auditor: string | null = null;
  for (const g of rolesRaw?.rollegrupper || []) {
    for (const r of g?.roller || []) {
      if (r?.fratraadt) continue;
      const name = r?.person
        ? [r.person?.navn?.fornavn, r.person?.navn?.mellomnavn, r.person?.navn?.etternavn].filter(Boolean).join(" ")
        : (Array.isArray(r?.enhet?.navn) ? r.enhet.navn.filter(Boolean).join(" ") : r?.enhet?.navn) || "";
      if (!name) continue;
      const kode = r?.type?.kode || g?.type?.kode || "";
      if (kode === "DAGL" && !ceo) ceo = name;
      if (kode === "LEDE" && !chair) chair = name;
      if (kode === "REGN" && !accountant) accountant = name;
      if (kode === "REVI" && !auditor) auditor = name;
    }
  }

  const company = unit
    ? {
        orgnr,
        name: unit?.navn ?? null,
        org_form: unit?.organisasjonsform?.kode ?? null,
        org_form_text: unit?.organisasjonsform?.beskrivelse ?? null,
        industry_code: unit?.naeringskode1?.kode ?? null,
        industry_text: unit?.naeringskode1?.beskrivelse ?? null,
        employees: typeof unit?.antallAnsatte === "number" ? unit.antallAnsatte : null,
        has_registered_employees: unit?.harRegistrertAntallAnsatte ?? null,
        registered_at: unit?.registreringsdatoEnhetsregisteret ?? null,
        founded_at: unit?.stiftelsesdato ?? null,
        vat_registered: unit?.registrertIMvaregisteret ?? null,
        bankrupt: unit?.konkurs ?? null,
        under_liquidation: unit?.underAvvikling ?? null,
        municipality: unit?.forretningsadresse?.kommune ?? null,
        address: [unit?.forretningsadresse?.adresse?.join(" "), unit?.forretningsadresse?.postnummer, unit?.forretningsadresse?.poststed]
          .filter(Boolean).join(", ") || null,
        website: unit?.hjemmeside ?? null,
        ceo, chair, accountant, auditor,
      }
    : { orgnr, ceo, chair, accountant, auditor, employees: null };

  const summary = analyse(years, (company as any).employees ?? null);

  // Lagre hovedtallene på leadet slik at lista er oppdatert
  if (leadId && years.length) {
    const y = years[0];
    await admin.from("crm_leads").update({
      fiscal_year: y.year,
      revenue: y.revenue,
      net_result: y.net_result,
      profit_before_tax: y.profit_before_tax,
      equity: y.equity,
      financials: years.slice(0, 10),
      financials_fetched_at: new Date().toISOString(),
      employees: (company as any).employees ?? undefined,
    }).eq("id", leadId);
  } else if (leadId) {
    await admin.from("crm_leads").update({ financials_fetched_at: new Date().toISOString() }).eq("id", leadId);
  }

  return json({ orgnr, company, years, summary, fetched_at: new Date().toISOString() });
});
