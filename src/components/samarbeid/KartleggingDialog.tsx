import { useState, useEffect, useRef, useCallback } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, Building2, ArrowRight, ArrowLeft, CheckCircle2, Sparkles, Send, BarChart3, User, Mail, Phone, Users, Calculator, Monitor, Shield, Clock, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

/* ────────── types ────────── */
interface FetchedFinancials {
  regnskapsaar: string;
  sumDriftsinntekter: string;
  sumDriftskostnader: string;
  driftsresultat: string;
  aarsresultat: string;
  sumEiendeler: string;
  sumEgenkapital: string;
  sumGjeld: string;
}

interface CompanyData {
  org_number: string;
  company_name: string;
  org_form: string;
  address: string;
  stiftelsesdato: string;
  daglig_leder: string;
  styreleder: string;
  num_employees: string;
  website: string;
  financials: FetchedFinancials | null;
}

/* ────────── Option data ────────── */
const INTEREST_OPTIONS = [
  { value: "full_sale", label: "Selge hele byrået", emoji: "🏷️" },
  { value: "full_sale_stay", label: "Selge, men fortsette som ansatt", emoji: "🤝" },
  { value: "partial", label: "Selge en andel / delvis oppkjøp", emoji: "📊" },
  { value: "partnership", label: "Samarbeidsavtale uten salg", emoji: "🔗" },
  { value: "open", label: "Åpen for alt", emoji: "💡" },
];

const REASON_OPTIONS = [
  { value: "retirement", label: "Planlegger å trappe ned / pensjon", emoji: "🌅" },
  { value: "growth", label: "Trenger ressurser til vekst", emoji: "📈" },
  { value: "burnout", label: "Sliter med å holde tritt alene", emoji: "⚡" },
  { value: "value", label: "Ønsker å realisere verdier", emoji: "💰" },
  { value: "quality", label: "Vil gi kundene et bedre tilbud", emoji: "⭐" },
  { value: "succession", label: "Mangler etterfølger", emoji: "🔄" },
  { value: "other", label: "Annet", emoji: "💬" },
];

const SERVICE_OPTIONS = [
  { value: "bookkeeping", label: "Løpende bokføring", emoji: "📖" },
  { value: "payroll", label: "Lønn & personal", emoji: "💵" },
  { value: "annual_accounts", label: "Årsregnskap & årsoppgjør", emoji: "📋" },
  { value: "tax", label: "Skattemelding & rådgivning", emoji: "🧾" },
  { value: "advisory", label: "Økonomisk rådgivning / CFO", emoji: "📊" },
  { value: "invoicing", label: "Fakturering", emoji: "🧮" },
  { value: "audit", label: "Revisjon", emoji: "🔍" },
  { value: "other_services", label: "Andre tjenester", emoji: "➕" },
];

const SYSTEM_OPTIONS = [
  { value: "tripletex", label: "Tripletex" },
  { value: "visma", label: "Visma Business / eAccounting" },
  { value: "fiken", label: "Fiken" },
  { value: "xledger", label: "Xledger" },
  { value: "poweroffice", label: "PowerOffice GO" },
  { value: "unimicro", label: "Uni Micro" },
  { value: "duett", label: "Duett" },
  { value: "maestro", label: "Maestro" },
  { value: "other_system", label: "Annet" },
];

const CHALLENGE_OPTIONS = [
  { value: "compliance", label: "Hvitvasking & compliance", emoji: "📋" },
  { value: "it", label: "IT-systemer & digitalisering", emoji: "💻" },
  { value: "recruitment", label: "Vanskelig å rekruttere", emoji: "🔍" },
  { value: "profitability", label: "Lønnsomhet & prising", emoji: "📉" },
  { value: "capacity", label: "For mye å gjøre / kapasitet", emoji: "⏰" },
  { value: "customer_churn", label: "Mister kunder", emoji: "📤" },
  { value: "quality_control", label: "Kvalitetskontroll", emoji: "✅" },
  { value: "none", label: "Ingen spesielle utfordringer", emoji: "👍" },
];

const TIMELINE_OPTIONS = [
  { value: "asap", label: "Så snart som mulig", emoji: "⚡" },
  { value: "6months", label: "Innen 6 måneder", emoji: "📅" },
  { value: "1year", label: "Innen 1 år", emoji: "🗓️" },
  { value: "exploring", label: "Bare utforsker", emoji: "🔭" },
];

const CUSTOMER_COUNT_OPTIONS = [
  { value: "1-20", label: "1–20 kunder" },
  { value: "21-50", label: "21–50 kunder" },
  { value: "51-100", label: "51–100 kunder" },
  { value: "101-200", label: "101–200 kunder" },
  { value: "200+", label: "Over 200 kunder" },
];

const REVENUE_OPTIONS = [
  { value: "under_1m", label: "Under 1 MNOK" },
  { value: "1-3m", label: "1–3 MNOK" },
  { value: "3-5m", label: "3–5 MNOK" },
  { value: "5-10m", label: "5–10 MNOK" },
  { value: "10-20m", label: "10–20 MNOK" },
  { value: "20m+", label: "Over 20 MNOK" },
];

const EMPLOYEE_COUNT_OPTIONS = [
  { value: "solo", label: "Bare meg (solopraktiserende)" },
  { value: "2-5", label: "2–5 ansatte" },
  { value: "6-10", label: "6–10 ansatte" },
  { value: "11-20", label: "11–20 ansatte" },
  { value: "20+", label: "Over 20 ansatte" },
];

function formatNOK(val: number | null | undefined): string {
  if (val == null) return "";
  const num = Math.round(Number(val));
  if (isNaN(num)) return "";
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1).replace(".", ",")} MNOK`;
  if (num >= 1_000) return `${Math.round(num / 1_000)} TNOK`;
  return `${num} NOK`;
}

/* ────────── Steps ────────── */
const STEPS = [
  { id: "company", label: "Selskap", icon: Building2 },
  { id: "interest", label: "Interesse", icon: Sparkles },
  { id: "reason", label: "Bakgrunn", icon: Clock },
  { id: "portfolio", label: "Portefølje", icon: Users },
  { id: "operations", label: "Drift", icon: Calculator },
  { id: "systems", label: "Systemer", icon: Monitor },
  { id: "challenges", label: "Utfordringer", icon: Shield },
  { id: "timeline", label: "Tidshorisont", icon: Clock },
  { id: "contact", label: "Kontakt", icon: Mail },
];

const TOTAL_STEPS = STEPS.length;

/* ────────── Main ────────── */
interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const KartleggingDialog = ({ open, onOpenChange }: Props) => {
  const [step, setStep] = useState(0);
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [interest, setInterest] = useState("");
  const [reason, setReason] = useState("");
  const [customerCount, setCustomerCount] = useState("");
  const [revenueRange, setRevenueRange] = useState("");
  const [employeeCount, setEmployeeCount] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [systems, setSystems] = useState<string[]>([]);
  const [authorized, setAuthorized] = useState<string>("");
  const [challenges, setChallenges] = useState<string[]>([]);
  const [timeline, setTimeline] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Brreg search
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingDetails, setFetchingDetails] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Reset on close
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setStep(0); setCompany(null); setInterest(""); setReason("");
        setCustomerCount(""); setRevenueRange(""); setEmployeeCount("");
        setServices([]); setSystems([]); setAuthorized("");
        setChallenges([]); setTimeline("");
        setContactName(""); setContactEmail(""); setContactPhone("");
        setMessage(""); setSubmitted(false); setQuery(""); setResults([]);
      }, 300);
    }
  }, [open]);

  // Search Brreg
  useEffect(() => {
    if (query.length < 2) { setResults([]); return; }
    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const isOrgNr = /^\d{9}$/.test(query.trim());
        const url = isOrgNr
          ? `https://data.brreg.no/enhetsregisteret/api/enheter/${query.trim()}`
          : `https://data.brreg.no/enhetsregisteret/api/enheter?navn=${encodeURIComponent(query)}&size=6`;
        const res = await fetch(url);
        if (!res.ok) { setResults([]); setLoading(false); return; }
        const data = await res.json();
        setResults(isOrgNr && data?.organisasjonsnummer ? [data] : data?._embedded?.enheter || []);
      } catch { setResults([]); }
      setLoading(false);
    }, 400);
    return () => clearTimeout(timeout);
  }, [query]);

  const selectCompany = useCallback(async (enhet: any) => {
    setResults([]); setQuery(""); setFetchingDetails(true);
    const orgNr = enhet.organisasjonsnummer;
    const [rolleResult, regnskapResult] = await Promise.allSettled([
      fetch(`https://data.brreg.no/enhetsregisteret/api/enheter/${orgNr}/roller`).then(r => r.ok ? r.json() : null),
      fetch(`https://data.brreg.no/regnskapsregisteret/regnskap/${orgNr}`, { headers: { Accept: "application/json" } }).then(r => r.ok ? r.json() : null),
    ]);

    let dagligLeder = "", styreleder = "";
    try {
      const rolleData = rolleResult.status === "fulfilled" ? rolleResult.value : null;
      for (const g of (rolleData?.rollegrupper || [])) {
        if (g.type?.kode === "DAGL") { const p = g.roller?.[0]?.person; if (p) dagligLeder = `${p.navn?.fornavn || ""} ${p.navn?.etternavn || ""}`.trim(); }
        if (g.type?.kode === "LEDE") { const p = g.roller?.[0]?.person; if (p) styreleder = `${p.navn?.fornavn || ""} ${p.navn?.etternavn || ""}`.trim(); }
      }
    } catch {}

    let fin: FetchedFinancials | null = null;
    let numEmployees = enhet.antallAnsatte?.toString() || "";
    try {
      const regnskapData = regnskapResult.status === "fulfilled" ? regnskapResult.value : null;
      const entries = Array.isArray(regnskapData) ? regnskapData : [];
      const selskap = entries.find((r: any) => r.regnskapstype === "SELSKAP") || entries[0];
      if (selskap) {
        const dr = selskap?.resultatregnskapResultat?.driftsresultat;
        const ek = selskap?.egenkapitalGjeld;
        const bal = selskap?.eiendeler;
        fin = {
          regnskapsaar: selskap?.regnskapsperiode?.tilDato?.substring(0, 4) || "",
          sumDriftsinntekter: formatNOK(dr?.driftsinntekter?.sumDriftsinntekter),
          sumDriftskostnader: formatNOK(dr?.driftskostnad?.sumDriftskostnad),
          driftsresultat: formatNOK(dr?.driftsresultat),
          aarsresultat: formatNOK(selskap?.resultatregnskapResultat?.totalresultat ?? selskap?.resultatregnskapResultat?.aarsresultat),
          sumEiendeler: formatNOK(bal?.sumEiendeler),
          sumEgenkapital: formatNOK(ek?.egenkapital?.sumEgenkapital),
          sumGjeld: formatNOK(ek?.gjeldOversikt?.sumGjeld ?? ek?.gjeld?.sumGjeld),
        };
        if (!numEmployees && selskap?.virksomhet?.antallAnsatte) numEmployees = selskap.virksomhet.antallAnsatte.toString();
      }
    } catch {}

    const addr = enhet.forretningsadresse || enhet.postadresse;
    const addressStr = addr ? `${(addr.adresse || []).join(", ")}, ${addr.postnummer || ""} ${addr.poststed || ""}`.trim() : "";

    setCompany({
      org_number: orgNr, company_name: enhet.navn || "", org_form: enhet.organisasjonsform?.beskrivelse || "",
      address: addressStr, stiftelsesdato: enhet.stiftelsesdato || enhet.registreringsdatoEnhetsregisteret || "",
      daglig_leder: dagligLeder, styreleder, num_employees: numEmployees,
      website: enhet.hjemmeside || "", financials: fin,
    });
    setContactName(dagligLeder || "");
    setFetchingDetails(false);
    setStep(1);
  }, []);

  const toggleMulti = (val: string, state: string[], setState: React.Dispatch<React.SetStateAction<string[]>>, exclusiveVal?: string) => {
    if (val === exclusiveVal) { setState([exclusiveVal]); return; }
    setState(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev.filter(v => v !== exclusiveVal), val]);
  };

  const handleSubmit = async () => {
    if (!company || !contactEmail.trim() || !contactName.trim()) return;
    setSubmitting(true);

    const label = (opts: {value:string;label:string}[], val: string) => opts.find(o => o.value === val)?.label || val;
    const labels = (opts: {value:string;label:string}[], vals: string[]) => vals.map(v => label(opts, v)).join(", ");

    const finSummary = company.financials
      ? `\n\nRegnskap ${company.financials.regnskapsaar}:\nDriftsinntekter: ${company.financials.sumDriftsinntekter}\nDriftsresultat: ${company.financials.driftsresultat}\nÅrsresultat: ${company.financials.aarsresultat}\nEiendeler: ${company.financials.sumEiendeler}\nEgenkapital: ${company.financials.sumEgenkapital}\nGjeld: ${company.financials.sumGjeld}`
      : "";

    const fullMessage = `[Samarbeid — Kartlegging]\n\nInteresse: ${label(INTEREST_OPTIONS, interest)}\nBakgrunn: ${label(REASON_OPTIONS, reason)}\n\nPORTEFØLJE:\nAntall kunder: ${label(CUSTOMER_COUNT_OPTIONS, customerCount)}\nOmsetning: ${label(REVENUE_OPTIONS, revenueRange)}\nAnsatte: ${label(EMPLOYEE_COUNT_OPTIONS, employeeCount)}\n\nDRIFT:\nTjenester: ${labels(SERVICE_OPTIONS, services)}\nAutorisert: ${authorized === "yes" ? "Ja" : authorized === "no" ? "Nei" : "Vet ikke"}\n\nSYSTEMER: ${labels(SYSTEM_OPTIONS, systems)}\n\nUtfordringer: ${labels(CHALLENGE_OPTIONS, challenges)}\nTidshorisont: ${label(TIMELINE_OPTIONS, timeline)}${company.daglig_leder ? `\nDaglig leder: ${company.daglig_leder}` : ""}${company.styreleder ? `\nStyreleder: ${company.styreleder}` : ""}${company.address ? `\nAdresse: ${company.address}` : ""}${company.num_employees ? `\nAnsatte (Brreg): ${company.num_employees}` : ""}${finSummary}${message ? `\n\nMelding:\n${message}` : ""}`;

    try {
      await supabase.from("contact_submissions").insert([{
        org_number: company.org_number,
        company_name: company.company_name,
        contact_person: contactName.trim(),
        email: contactEmail.trim(),
        phone: contactPhone.trim() || null,
        message: fullMessage,
        section: "samarbeid",
      }]);
    } catch {}

    try {
      await supabase.functions.invoke("contact-submit", {
        body: {
          company_name: company.company_name, org_number: company.org_number,
          contact_person: contactName.trim(), email: contactEmail.trim(),
          phone: contactPhone.trim() || null, industry: company.org_form || null,
          message: fullMessage, section: "samarbeid",
        },
      });
    } catch (err) { console.error("Email sending failed:", err); }

    setSubmitted(true); setSubmitting(false);
  };

  const canNext = () => {
    switch (step) {
      case 0: return !!company;
      case 1: return !!interest;
      case 2: return !!reason;
      case 3: return !!customerCount && !!revenueRange;
      case 4: return services.length > 0 && !!employeeCount;
      case 5: return systems.length > 0;
      case 6: return challenges.length > 0;
      case 7: return !!timeline;
      case 8: return !!contactName.trim() && !!contactEmail.trim();
      default: return false;
    }
  };

  const progress = ((step + 1) / TOTAL_STEPS) * 100;

  const finRows = company?.financials ? [
    { label: "Driftsinntekter", value: company.financials.sumDriftsinntekter },
    { label: "Driftsresultat", value: company.financials.driftsresultat },
    { label: "Årsresultat", value: company.financials.aarsresultat },
    { label: "Eiendeler", value: company.financials.sumEiendeler },
    { label: "Egenkapital", value: company.financials.sumEgenkapital },
  ].filter(r => r.value) : [];

  const slideVariants = { enter: { opacity: 0, x: 40 }, center: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -40 } };

  const inputCls = "w-full h-12 pl-10 pr-4 rounded-xl border border-border bg-muted/30 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all";

  const renderSingleSelect = (options: {value:string;label:string;emoji?:string}[], value: string, setValue: (v:string)=>void) => (
    <div className="space-y-2">
      {options.map(opt => (
        <button key={opt.value} onClick={() => setValue(opt.value)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-medium border transition-all ${
            value === opt.value ? "border-primary bg-primary/10 text-foreground shadow-sm" : "border-border hover:border-primary/30 hover:bg-muted/30 text-foreground/80"
          }`}>
          {opt.emoji && <span className="text-lg">{opt.emoji}</span>}
          {opt.label}
          {value === opt.value && <CheckCircle2 size={16} className="ml-auto text-primary" />}
        </button>
      ))}
    </div>
  );

  const renderMultiSelect = (options: {value:string;label:string;emoji?:string}[], values: string[], toggle: (v:string)=>void) => (
    <div className="space-y-2">
      {options.map(opt => (
        <button key={opt.value} onClick={() => toggle(opt.value)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-medium border transition-all ${
            values.includes(opt.value) ? "border-primary bg-primary/10 text-foreground shadow-sm" : "border-border hover:border-primary/30 hover:bg-muted/30 text-foreground/80"
          }`}>
          {opt.emoji && <span className="text-lg">{opt.emoji}</span>}
          {opt.label}
          {values.includes(opt.value) && <CheckCircle2 size={16} className="ml-auto text-primary" />}
        </button>
      ))}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px] p-0 gap-0 bg-background border-border/20 overflow-hidden max-h-[90vh]">
        {!submitted && (
          <div className="h-1 w-full bg-muted/30">
            <motion.div className="h-full bg-primary" animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
          </div>
        )}

        <div className="p-6 md:p-8 overflow-y-auto max-h-[85vh]">
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                  <Sparkles size={32} className="text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Takk for kartleggingen!</h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto mb-6">
                  Vi gjennomgår informasjonen din og tar kontakt innen 48 timer for en konfidensiell samtale.
                </p>
                <button onClick={() => onOpenChange(false)} className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                  Lukk
                </button>
              </motion.div>
            ) : (
              <motion.div key={step} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>

                {/* Step 0: Company search */}
                {step === 0 && (
                  <div className="space-y-5">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Steg 1 av {TOTAL_STEPS}</p>
                      <h3 className="text-lg font-bold">Finn regnskapsbyrået ditt</h3>
                      <p className="text-sm text-muted-foreground mt-1">Søk på firmanavn eller org.nr — vi henter selskapsinfo automatisk.</p>
                    </div>
                    <div ref={dropdownRef} className="relative">
                      <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input value={query} onChange={e => setQuery(e.target.value)}
                          placeholder="Søk firmanavn eller org.nr…" className={inputCls} autoFocus />
                        {(loading || fetchingDetails) && <Loader2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground animate-spin" />}
                      </div>
                      {results.length > 0 && (
                        <div className="absolute z-50 left-0 right-0 mt-1 rounded-xl border border-border bg-popover shadow-2xl max-h-60 overflow-y-auto">
                          {results.map((enhet) => (
                            <button key={enhet.organisasjonsnummer} type="button" onClick={() => selectCompany(enhet)}
                              className="w-full text-left px-4 py-3 hover:bg-accent transition-colors border-b border-border/50 last:border-0">
                              <span className="text-sm font-medium">{enhet.navn}</span>
                              <span className="block text-xs text-muted-foreground">{enhet.organisasjonsnummer} · {enhet.organisasjonsform?.beskrivelse || ""}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    {company && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-muted/20 p-4 space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <Building2 size={18} className="text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{company.company_name}</p>
                            <p className="text-xs text-muted-foreground">{company.org_number} · {company.org_form}</p>
                            {company.address && <p className="text-xs text-muted-foreground mt-0.5">{company.address}</p>}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs">
                          {company.daglig_leder && <span className="px-2.5 py-1 rounded-md bg-muted/50">Daglig leder: {company.daglig_leder}</span>}
                          {company.styreleder && <span className="px-2.5 py-1 rounded-md bg-muted/50">Styreleder: {company.styreleder}</span>}
                          {company.num_employees && <span className="px-2.5 py-1 rounded-md bg-muted/50">{company.num_employees} ansatte</span>}
                          {company.stiftelsesdato && <span className="px-2.5 py-1 rounded-md bg-muted/50">Stiftet {company.stiftelsesdato}</span>}
                        </div>
                        {finRows.length > 0 && (
                          <div className="border-t border-border/50 pt-2 space-y-1">
                            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium flex items-center gap-1.5">
                              <BarChart3 size={11} /> Regnskap {company.financials?.regnskapsaar}
                            </p>
                            {finRows.map(r => (
                              <div key={r.label} className="flex justify-between text-xs">
                                <span className="text-muted-foreground">{r.label}</span>
                                <span className="font-medium">{r.value}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                )}

                {/* Step 1: Interest */}
                {step === 1 && (
                  <div className="space-y-5">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Steg 2 av {TOTAL_STEPS}</p>
                      <h3 className="text-lg font-bold">Hva er du interessert i?</h3>
                      <p className="text-sm text-muted-foreground mt-1">Ingenting er bindende — velg det som passer best.</p>
                    </div>
                    {renderSingleSelect(INTEREST_OPTIONS, interest, setInterest)}
                  </div>
                )}

                {/* Step 2: Reason */}
                {step === 2 && (
                  <div className="space-y-5">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Steg 3 av {TOTAL_STEPS}</p>
                      <h3 className="text-lg font-bold">Hva er bakgrunnen?</h3>
                      <p className="text-sm text-muted-foreground mt-1">Hjelper oss å forstå situasjonen din bedre.</p>
                    </div>
                    {renderSingleSelect(REASON_OPTIONS, reason, setReason)}
                  </div>
                )}

                {/* Step 3: Portfolio — customers + revenue */}
                {step === 3 && (
                  <div className="space-y-5">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Steg 4 av {TOTAL_STEPS}</p>
                      <h3 className="text-lg font-bold">Fortell om kundeporteføljen</h3>
                      <p className="text-sm text-muted-foreground mt-1">Omtrentlige tall er helt ok.</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Antall kunder</p>
                      {renderSingleSelect(CUSTOMER_COUNT_OPTIONS, customerCount, setCustomerCount)}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Omsetning siste år</p>
                      {renderSingleSelect(REVENUE_OPTIONS, revenueRange, setRevenueRange)}
                    </div>
                  </div>
                )}

                {/* Step 4: Operations — services + employees + authorized */}
                {step === 4 && (
                  <div className="space-y-5">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Steg 5 av {TOTAL_STEPS}</p>
                      <h3 className="text-lg font-bold">Hva tilbyr byrået?</h3>
                      <p className="text-sm text-muted-foreground mt-1">Velg tjenestene dere leverer og hvor mange dere er.</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Tjenester (velg flere)</p>
                      {renderMultiSelect(SERVICE_OPTIONS, services, v => toggleMulti(v, services, setServices))}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Antall ansatte</p>
                      {renderSingleSelect(EMPLOYEE_COUNT_OPTIONS, employeeCount, setEmployeeCount)}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Er byrået autorisert regnskapsfører?</p>
                      <div className="flex gap-2">
                        {[{ value: "yes", label: "Ja" }, { value: "no", label: "Nei" }, { value: "unknown", label: "Vet ikke" }].map(opt => (
                          <button key={opt.value} onClick={() => setAuthorized(opt.value)}
                            className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium border transition-all ${
                              authorized === opt.value ? "border-primary bg-primary/10" : "border-border hover:border-primary/30"
                            }`}>
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 5: Systems */}
                {step === 5 && (
                  <div className="space-y-5">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Steg 6 av {TOTAL_STEPS}</p>
                      <h3 className="text-lg font-bold">Hvilke systemer bruker dere?</h3>
                      <p className="text-sm text-muted-foreground mt-1">Velg regnskapssystem(er) — kan velge flere.</p>
                    </div>
                    {renderMultiSelect(SYSTEM_OPTIONS, systems, v => toggleMulti(v, systems, setSystems))}
                  </div>
                )}

                {/* Step 6: Challenges */}
                {step === 6 && (
                  <div className="space-y-5">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Steg 7 av {TOTAL_STEPS}</p>
                      <h3 className="text-lg font-bold">Hvilke utfordringer har dere?</h3>
                      <p className="text-sm text-muted-foreground mt-1">Velg én eller flere — dette hjelper oss tilpasse tilbudet.</p>
                    </div>
                    {renderMultiSelect(CHALLENGE_OPTIONS, challenges, v => toggleMulti(v, challenges, setChallenges, "none"))}
                  </div>
                )}

                {/* Step 7: Timeline */}
                {step === 7 && (
                  <div className="space-y-5">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Steg 8 av {TOTAL_STEPS}</p>
                      <h3 className="text-lg font-bold">Hva er tidshorisonten?</h3>
                      <p className="text-sm text-muted-foreground mt-1">Ingen bindende frister — bare en pekepinn.</p>
                    </div>
                    {renderSingleSelect(TIMELINE_OPTIONS, timeline, setTimeline)}
                  </div>
                )}

                {/* Step 8: Contact */}
                {step === 8 && (
                  <div className="space-y-5">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Steg 9 av {TOTAL_STEPS}</p>
                      <h3 className="text-lg font-bold">Hvem kan vi kontakte?</h3>
                      <p className="text-sm text-muted-foreground mt-1">All informasjon behandles 100 % konfidensielt.</p>
                    </div>
                    <div className="space-y-3">
                      <div className="relative">
                        <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input value={contactName} onChange={e => setContactName(e.target.value)} placeholder="Navn *" maxLength={100} className={inputCls} />
                      </div>
                      <div className="relative">
                        <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} placeholder="E-post *" maxLength={255} className={inputCls} />
                      </div>
                      <div className="relative">
                        <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input type="tel" value={contactPhone} onChange={e => setContactPhone(e.target.value)} placeholder="Telefon (valgfritt)" maxLength={20} className={inputCls} />
                      </div>
                      <textarea value={message} onChange={e => setMessage(e.target.value)}
                        placeholder="Er det noe annet du vil at vi skal vite? (valgfritt)"
                        rows={3} maxLength={5000}
                        className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none transition-all" />
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          {!submitted && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/30">
              {step > 0 ? (
                <button onClick={() => setStep(s => s - 1)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowLeft size={14} /> Tilbake
                </button>
              ) : <div />}
              {step < TOTAL_STEPS - 1 ? (
                <button onClick={() => setStep(s => s + 1)} disabled={!canNext()}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-40 transition-all">
                  Neste <ArrowRight size={14} />
                </button>
              ) : (
                <button onClick={handleSubmit} disabled={!canNext() || submitting}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-40 transition-all">
                  {submitting ? "Sender…" : <><Send size={14} /> Send kartlegging</>}
                </button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KartleggingDialog;
