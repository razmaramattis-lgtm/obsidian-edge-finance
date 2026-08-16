export interface CrmLead {
  id: string;
  orgnr: string;
  name: string;
  org_form: string | null;
  org_form_text: string | null;
  industry_code: string | null;
  industry_text: string | null;
  municipality: string | null;
  municipality_number: string | null;
  postal_code: string | null;
  postal_area: string | null;
  address: string | null;
  registered_at: string | null;
  employees: number | null;
  website: string | null;
  email: string | null;
  email_verified: boolean;
  phone: string | null;
  contact_name: string | null;
  roles: { type: string; name: string }[] | null;
  has_accountant: boolean;
  accountant_name: string | null;
  has_auditor: boolean;
  category: string;
  status: string;
  notes: string | null;
  last_emailed_at: string | null;
  email_count: number;
  unsubscribed: boolean;
  contacted_at?: string | null;
  email_source?: string | null;
  enriched_at?: string | null;
  enrich_status?: string | null;
  manual_lock?: boolean;
}

export interface CrmTemplate {
  id: string;
  name: string;
  category: string;
  subject: string;
  body_html: string;
  reason?: string | null;
  is_default: boolean;
  active: boolean;
}

export const CATEGORIES: { id: string; label: string; hint: string; color: string }[] = [
  { id: "ny_bedrift", label: "Nyetablert (< 2 mnd)", hint: "Gratulerer med etableringen – selg inn regnskap fra dag én", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  { id: "har_regnskapsforer", label: "Har regnskapsfører", hint: "Byttekandidat – fokus på pris, service og fast kontaktperson", color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  { id: "ingen_regnskapsforer", label: "Uten regnskapsfører", hint: "Gjør trolig regnskapet selv – fokus på tidsbesparelse", color: "bg-sky-500/10 text-sky-600 border-sky-500/20" },
  { id: "ukjent", label: "Ukjent", hint: "Ikke kategorisert enda", color: "bg-muted text-muted-foreground border-border" },
];

export const STATUSES = [
  { id: "ny", label: "Ny" },
  { id: "kontaktet", label: "Kontaktet" },
  { id: "interessert", label: "Interessert" },
  { id: "kunde", label: "Kunde" },
  { id: "ikke_aktuell", label: "Ikke aktuell" },
];

export const TEMPLATE_CATEGORIES: { id: string; label: string; hint: string; color: string }[] = [
  ...CATEGORIES.filter((c) => c.id !== "ukjent"),
  { id: "oppfolging", label: "Oppfølging", hint: "Sendes etter en tidligere e-post uten svar", color: "bg-violet-500/10 text-violet-600 border-violet-500/20" },
  { id: "lokal", label: "Lokal / nærområde", hint: "Geografisk vinkling – bruk {{ kommune }} aktivt", color: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20" },
  { id: "generell", label: "Generell", hint: "Passer alle kategorier", color: "bg-muted text-muted-foreground border-border" },
  { id: "ukjent", label: "Ukjent", hint: "Ikke kategorisert enda", color: "bg-muted text-muted-foreground border-border" },
];

export const categoryMeta = (id: string) =>
  TEMPLATE_CATEGORIES.find((c) => c.id === id) || CATEGORIES[3];

/* ── Næringsgrupper (SN2007 hovedområder) ── */
export const INDUSTRY_GROUPS: { id: string; label: string; prefixes: string[] }[] = [
  { id: "jordbruk", label: "Jordbruk, skogbruk og fiske", prefixes: ["01", "02", "03"] },
  { id: "industri", label: "Industri og produksjon", prefixes: ["10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31","32","33"] },
  { id: "bygg", label: "Bygg og anlegg", prefixes: ["41", "42", "43"] },
  { id: "handel", label: "Varehandel og verksted", prefixes: ["45", "46", "47"] },
  { id: "transport", label: "Transport og lagring", prefixes: ["49", "50", "51", "52", "53"] },
  { id: "servering", label: "Overnatting og servering", prefixes: ["55", "56"] },
  { id: "it", label: "IT, media og kommunikasjon", prefixes: ["58", "59", "60", "61", "62", "63"] },
  { id: "finans", label: "Finans og forsikring", prefixes: ["64", "65", "66"] },
  { id: "eiendom", label: "Eiendom", prefixes: ["68"] },
  { id: "tjenester", label: "Faglig og teknisk tjenesteyting", prefixes: ["69", "70", "71", "72", "73", "74", "75"] },
  { id: "forretning", label: "Forretningsmessig tjenesteyting", prefixes: ["77", "78", "79", "80", "81", "82"] },
  { id: "offentlig", label: "Offentlig, undervisning og helse", prefixes: ["84", "85", "86", "87", "88"] },
  { id: "kultur", label: "Kultur, underholdning og fritid", prefixes: ["90", "91", "92", "93"] },
  { id: "personlig", label: "Personlig tjenesteyting", prefixes: ["94", "95", "96"] },
];

export const ORG_FORMS = ["AS", "ENK", "ASA", "ANS", "DA", "NUF", "SA", "BA", "STI", "FLI", "KS", "BRL", "ESEK"];

export const EMPLOYEE_BANDS: { id: string; label: string; min: number | null; max: number | null }[] = [
  { id: "0", label: "0 ansatte", min: 0, max: 0 },
  { id: "1-4", label: "1–4", min: 1, max: 4 },
  { id: "5-9", label: "5–9", min: 5, max: 9 },
  { id: "10-19", label: "10–19", min: 10, max: 19 },
  { id: "20-49", label: "20–49", min: 20, max: 49 },
  { id: "50+", label: "50+", min: 50, max: null },
];
