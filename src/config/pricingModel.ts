// Prismodellen for fastpriskalkulatoren.
//
// Alle satser, trinn og valg kalkulatoren bruker står her, så en ny
// prismodell kan legges inn på ett sted uten å røre selve kalkulatoren.
// Alle beløp er kroner per måned eks. mva.

export const BASE_PRICE = 1950;

export const companyForms = [
  { key: "AS", label: "AS", desc: "Aksjeselskap", addon: 0 },
  { key: "ENK", label: "ENK", desc: "Enkeltpersonforetak", addon: 0 },
];

export const industries = [
  { key: "tjeneste", label: "Tjenesteyting" },
  { key: "varehandel", label: "Varehandel" },
  { key: "nettbutikk", label: "Nettbutikk" },
  { key: "bygg", label: "Bygg og anlegg" },
  { key: "industri", label: "Industri" },
  { key: "eiendom", label: "Eiendom" },
  { key: "it", label: "IT og teknologi" },
  { key: "bruktbil", label: "Bruktbil" },
  { key: "helse", label: "Helse" },
  { key: "restaurant", label: "Restaurant og kafé" },
  { key: "transport", label: "Transport" },
  { key: "kultur", label: "Kultur og media" },
  { key: "utdanning", label: "Utdanning og kurs" },
  { key: "annet", label: "Annet" },
];

// Omsetning velges med en glidebryter. Over REVENUE_MAX gis et skreddersydd tilbud.
export const REVENUE_MIN = 0;
export const REVENUE_MAX = 5_000_000;
export const REVENUE_STEP = 100_000;
export const REVENUE_CUSTOM = REVENUE_MAX + REVENUE_STEP; // 5,1 mill. = flagg for skreddersydd tilbud

/** Tillegg etter årlig omsetning (teller bare opp til REVENUE_MAX). */
export const priceFromRevenue = (nok: number) => {
  const v = Math.min(nok, REVENUE_MAX);
  if (v <= 500_000) return 0;
  if (v <= 2_000_000) return 400;
  if (v <= 3_500_000) return 900;
  return 1400;
};

export const bilagTiers = [
  { key: "0", label: "0 – 20 bilag", addon: 0 },
  { key: "1", label: "21 – 50 bilag", addon: 500 },
  { key: "2", label: "51 – 100 bilag", addon: 1200 },
  { key: "3", label: "101 – 200 bilag", addon: 2000 },
  { key: "4", label: "200+ bilag", addon: 3000 },
];

export const PAYROLL_ADDON = 100;
/** Flere ansatte enn dette gir et skreddersydd tilbud. */
export const PAYROLL_EMPLOYEE_LIMIT = 5;
export const AARSOPPGJOR = 714;

export interface PriceInputs {
  revenue: number;
  bilagIndex: number;
  employees: number;
  aarsoppgjor: boolean;
}

/** Den nøyaktige månedsprisen. Lagres alltid på henvendelsen, uansett hva kunden ser. */
export const estimateMonthlyPrice = ({ revenue, bilagIndex, employees, aarsoppgjor }: PriceInputs) => {
  let p = BASE_PRICE;
  p += priceFromRevenue(revenue);
  p += bilagTiers[bilagIndex]?.addon ?? 0;
  if (employees > 0 && employees <= PAYROLL_EMPLOYEE_LIMIT) p += PAYROLL_ADDON;
  if (aarsoppgjor) p += AARSOPPGJOR;
  return p;
};

export const needsCustomOffer = ({ revenue, employees }: Pick<PriceInputs, "revenue" | "employees">) =>
  revenue >= REVENUE_CUSTOM || employees > PAYROLL_EMPLOYEE_LIMIT;

// ── Hvordan prisen vises for kunden ─────────────────────────
//
// "exact": nøyaktig pris, f.eks. «3 664 kr/mnd».
// "range": et intervall rundt prisen, f.eks. «3 500 – 4 500 kr/mnd».
// "from":  bare en startpris, f.eks. «fra 3 500 kr/mnd».
// Henvendelsen får alltid den nøyaktige prisen, slik at tilbudet kan følges opp.
export type PriceDisplayMode = "exact" | "range" | "from";
export const PRICE_DISPLAY: PriceDisplayMode = "exact";

/** Prisen avrundes ned til nærmeste trinn før intervallet regnes ut. */
export const PRICE_ROUND_TO = 500;
/** Bredden på intervallet i modusen "range". */
export const PRICE_RANGE_WIDTH = 1000;

const kr = (n: number) => n.toLocaleString("nb-NO");

export const priceForDisplay = (price: number, mode: PriceDisplayMode = PRICE_DISPLAY) => {
  const low = Math.max(PRICE_ROUND_TO, Math.floor(price / PRICE_ROUND_TO) * PRICE_ROUND_TO);
  if (mode === "range") return { amount: `${kr(low)} – ${kr(low + PRICE_RANGE_WIDTH)}`, prefix: "", isEstimate: true };
  if (mode === "from") return { amount: kr(low), prefix: "fra ", isEstimate: true };
  return { amount: kr(price), prefix: "", isEstimate: false };
};
