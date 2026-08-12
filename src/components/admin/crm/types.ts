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

export const categoryMeta = (id: string) => CATEGORIES.find((c) => c.id === id) || CATEGORIES[3];
