import { useState, useEffect, useRef, useCallback } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, Building2, ArrowRight, ArrowLeft, CheckCircle2, User, Mail, Phone, Rocket } from "lucide-react";
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
  { value: "full_sale", label: "Selge hele byrået", emoji: "🏷️", sub: "Ny eier, ny start" },
  { value: "full_sale_stay", label: "Selge, men bli med videre", emoji: "🤝", sub: "Det beste fra to verdener" },
  { value: "partial", label: "Selge en andel", emoji: "📊", sub: "Beholde kontroll, hente kapital" },
  { value: "partnership", label: "Strategisk samarbeid", emoji: "🔗", sub: "Sterkere sammen — uten salg" },
  { value: "open", label: "Åpen for dialog", emoji: "💡", sub: "La oss utforske mulighetene" },
];

const REASON_OPTIONS = [
  { value: "retirement", label: "Planlegger nedtrapping", emoji: "🌅", sub: "Pensjon eller generasjonsskifte" },
  { value: "growth", label: "Vil vokse raskere", emoji: "🚀", sub: "Trenger ressurser og nettverk" },
  { value: "burnout", label: "Trenger avlastning", emoji: "⚡", sub: "For mye ansvar på få skuldre" },
  { value: "value", label: "Realisere verdier", emoji: "💰", sub: "Kapitalisere på det dere har bygget" },
  { value: "quality", label: "Løfte kvaliteten", emoji: "⭐", sub: "Bredere tilbud til kundene" },
  { value: "succession", label: "Mangler etterfølger", emoji: "🔄", sub: "Hvem overtar stafettpinnen?" },
  { value: "other", label: "Noe annet", emoji: "💬", sub: "Fortell oss gjerne mer" },
];

const CUSTOMER_COUNT_OPTIONS = [
  { value: "1-20", label: "1–20 kunder", emoji: "🌱", sub: "Kompakt og personlig" },
  { value: "21-50", label: "21–50 kunder", emoji: "🌿", sub: "Fin portefølje" },
  { value: "51-100", label: "51–100 kunder", emoji: "🌳", sub: "Solid kundebase" },
  { value: "101-200", label: "101–200 kunder", emoji: "🏔️", sub: "Imponerende volum" },
  { value: "200+", label: "Over 200 kunder", emoji: "🏆", sub: "Stor operasjon" },
];

const REVENUE_OPTIONS = [
  { value: "under_1m", label: "Under 1 MNOK", emoji: "🌱" },
  { value: "1-3m", label: "1–3 MNOK", emoji: "📈" },
  { value: "3-5m", label: "3–5 MNOK", emoji: "🔥" },
  { value: "5-10m", label: "5–10 MNOK", emoji: "💪" },
  { value: "10-20m", label: "10–20 MNOK", emoji: "🚀" },
  { value: "20m+", label: "Over 20 MNOK", emoji: "🏆" },
];

const EMPLOYEE_COUNT_OPTIONS = [
  { value: "solo", label: "Bare meg", emoji: "🦸" },
  { value: "2-5", label: "2–5 ansatte", emoji: "👥" },
  { value: "6-10", label: "6–10 ansatte", emoji: "🏢" },
  { value: "11-20", label: "11–20 ansatte", emoji: "🏗️" },
  { value: "20+", label: "Over 20 ansatte", emoji: "🏙️" },
];

const SYSTEM_OPTIONS = [
  { value: "tripletex", label: "Tripletex", emoji: "🟢" },
  { value: "visma", label: "Visma", emoji: "🔵" },
  { value: "fiken", label: "Fiken", emoji: "🟡" },
  { value: "xledger", label: "Xledger", emoji: "🟣" },
  { value: "poweroffice", label: "PowerOffice GO", emoji: "🟠" },
  { value: "unimicro", label: "Uni Micro", emoji: "⚪" },
  { value: "duett", label: "Duett", emoji: "🔴" },
  { value: "maestro", label: "Maestro", emoji: "🟤" },
  { value: "other_system", label: "Annet system", emoji: "🔧" },
];

const CHALLENGE_OPTIONS = [
  { value: "compliance", label: "Regulatorisk kompleksitet", emoji: "📋" },
  { value: "it", label: "Digitalisering", emoji: "💻" },
  { value: "recruitment", label: "Rekruttering", emoji: "🔍" },
  { value: "profitability", label: "Lønnsomhet", emoji: "📉" },
  { value: "capacity", label: "Kapasitetsutfordringer", emoji: "⏰" },
  { value: "customer_churn", label: "Kundefrafall", emoji: "📤" },
  { value: "quality_control", label: "Kvalitetssikring", emoji: "✅" },
  { value: "none", label: "Ingen vesentlige utfordringer", emoji: "🌹" },
];

const TIMELINE_OPTIONS = [
  { value: "asap", label: "Så snart som mulig", emoji: "⚡", sub: "Klar for å ta neste steg" },
  { value: "6months", label: "Innen 6 måneder", emoji: "📅", sub: "Tid til forberedelser" },
  { value: "1year", label: "Innen 12 måneder", emoji: "🗓️", sub: "Langsiktig planlegging" },
  { value: "exploring", label: "Utforsker mulighetene", emoji: "🔭", sub: "Ingen hastverk — bare nysgjerrig" },
];

function formatNOK(val: number | null | undefined): string {
  if (val == null) return "";
  const num = Math.round(Number(val));
  if (isNaN(num)) return "";
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1).replace(".", ",")} MNOK`;
  if (num >= 1_000) return `${Math.round(num / 1_000)} TNOK`;
  return `${num} NOK`;
}

/* ────────── Step headlines ────────── */
// Steps: 0=company, 1=interest, 2=reason, 3=customers, 4=revenue, 5=employees, 6=systems, 7=challenges, 8=timeline, 9=contact
const STEP_HEADLINES: { emoji: string; title: string; subtitle: string }[] = [
  { emoji: "🔍", title: "La oss starte med å finne byrået ditt", subtitle: "Søk på navn eller organisasjonsnummer" },
  { emoji: "💭", title: "Hva tenker du om veien videre?", subtitle: "Helt uforpliktende — vi utforsker sammen" },
  { emoji: "🤔", title: "Hva motiverer deg?", subtitle: "Det finnes ingen feil svar her" },
  { emoji: "👥", title: "Hvor mange kunder har dere?", subtitle: "Et omtrentlig tall holder fint" },
  { emoji: "💰", title: "Hva omsetter byrået for?", subtitle: "Basert på siste regnskapsår" },
  { emoji: "🦸", title: "Hvor mange er dere på laget?", subtitle: "Inkludert deg selv" },
  { emoji: "💻", title: "Hvilke systemer bruker dere?", subtitle: "Velg alle som er relevante" },
  { emoji: "🎯", title: "Hva er den største utfordringen?", subtitle: "Velg det som treffer best" },
  { emoji: "⏰", title: "Hva er tidshorisonten?", subtitle: "Vi tilpasser oss ditt tempo" },
  { emoji: "📬", title: "Hvem skal vi ta kontakt med?", subtitle: "Alt behandles konfidensielt" },
];

/* ────────── Main ────────── */
interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const KartleggingDialog = ({ open, onOpenChange }: Props) => {
  const TOTAL = 10;
  const [step, setStep] = useState(0);
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [interest, setInterest] = useState("");
  const [reason, setReason] = useState("");
  const [customerCount, setCustomerCount] = useState("");
  const [revenueRange, setRevenueRange] = useState("");
  const [employeeCount, setEmployeeCount] = useState("");
  const [systems, setSystems] = useState<string[]>([]);
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

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setStep(0); setCompany(null); setInterest(""); setReason("");
        setCustomerCount(""); setRevenueRange(""); setEmployeeCount("");
        setSystems([]); setChallenges([]); setTimeline("");
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
  }, []);

  const toggleMulti = (val: string, state: string[], setState: React.Dispatch<React.SetStateAction<string[]>>, exclusiveVal?: string) => {
    if (val === exclusiveVal) { setState([exclusiveVal]); return; }
    setState(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev.filter(v => v !== exclusiveVal), val]);
  };

  const selectAndAdvance = (val: string, setter: (v: string) => void) => {
    setter(val);
    setTimeout(() => setStep(s => s + 1), 350);
  };

  const handleSubmit = async () => {
    if (!company || !contactEmail.trim() || !contactName.trim()) return;
    setSubmitting(true);

    const label = (opts: {value:string;label:string}[], val: string) => opts.find(o => o.value === val)?.label || val;
    const labels = (opts: {value:string;label:string}[], vals: string[]) => vals.map(v => label(opts, v)).join(", ");

    const finSummary = company.financials
      ? `\n\nRegnskap ${company.financials.regnskapsaar}:\nDriftsinntekter: ${company.financials.sumDriftsinntekter}\nDriftsresultat: ${company.financials.driftsresultat}\nÅrsresultat: ${company.financials.aarsresultat}\nEiendeler: ${company.financials.sumEiendeler}\nEgenkapital: ${company.financials.sumEgenkapital}\nGjeld: ${company.financials.sumGjeld}`
      : "";

    const fullMessage = `[Samarbeid — Kartlegging]\n\nInteresse: ${label(INTEREST_OPTIONS, interest)}\nBakgrunn: ${label(REASON_OPTIONS, reason)}\n\nPORTEFØLJE:\nAntall kunder: ${label(CUSTOMER_COUNT_OPTIONS, customerCount)}\nOmsetning: ${label(REVENUE_OPTIONS, revenueRange)}\nAnsatte: ${label(EMPLOYEE_COUNT_OPTIONS, employeeCount)}\n\nSYSTEMER: ${labels(SYSTEM_OPTIONS, systems)}\n\nUtfordringer: ${labels(CHALLENGE_OPTIONS, challenges)}\nTidshorisont: ${label(TIMELINE_OPTIONS, timeline)}${company.daglig_leder ? `\nDaglig leder: ${company.daglig_leder}` : ""}${company.styreleder ? `\nStyreleder: ${company.styreleder}` : ""}${company.address ? `\nAdresse: ${company.address}` : ""}${company.num_employees ? `\nAnsatte (Brreg): ${company.num_employees}` : ""}${finSummary}${message ? `\n\nMelding:\n${message}` : ""}`;

    try {
      await supabase.from("contact_submissions").insert([{
        org_number: company.org_number, company_name: company.company_name,
        contact_person: contactName.trim(), email: contactEmail.trim(),
        phone: contactPhone.trim() || null, message: fullMessage, section: "samarbeid",
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
      case 3: return !!customerCount;
      case 4: return !!revenueRange;
      case 5: return !!employeeCount;
      case 6: return systems.length > 0;
      case 7: return challenges.length > 0;
      case 8: return !!timeline;
      case 9: return !!contactName.trim() && !!contactEmail.trim();
      default: return false;
    }
  };

  const finRows = company?.financials ? [
    { label: "Driftsinntekter", value: company.financials.sumDriftsinntekter },
    { label: "Driftsresultat", value: company.financials.driftsresultat },
    { label: "Årsresultat", value: company.financials.aarsresultat },
  ].filter(r => r.value) : [];

  const slideVariants = {
    enter: { opacity: 0, y: 20, scale: 0.98 },
    center: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.98 },
  };

  const inputCls = "w-full h-12 pl-10 pr-4 rounded-xl border border-border bg-muted/30 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all";

  const renderOptionCard = (opt: { value: string; label: string; emoji?: string; sub?: string }, selected: boolean, onClick: () => void) => (
    <motion.button
      key={opt.value}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left transition-all border-2 ${
        selected
          ? "border-primary bg-primary/10 shadow-lg shadow-primary/10"
          : "border-transparent bg-muted/20 hover:bg-muted/40"
      }`}
    >
      {opt.emoji && <span className="text-xl">{opt.emoji}</span>}
      <div className="flex-1 min-w-0">
        <span className={`text-sm font-semibold ${selected ? "text-foreground" : "text-foreground/80"}`}>{opt.label}</span>
        {opt.sub && <span className="block text-xs text-muted-foreground mt-0.5">{opt.sub}</span>}
      </div>
      {selected && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500 }}>
          <CheckCircle2 size={20} className="text-primary" />
        </motion.div>
      )}
    </motion.button>
  );

  const renderSingle = (options: { value: string; label: string; emoji?: string; sub?: string }[], value: string, setter: (v: string) => void) => (
    <div className="space-y-2">
      {options.map(opt => renderOptionCard(opt, value === opt.value, () => selectAndAdvance(opt.value, setter)))}
    </div>
  );

  const renderMulti = (options: { value: string; label: string; emoji?: string; sub?: string }[], values: string[], toggle: (v: string) => void) => (
    <div className="space-y-2">
      {options.map(opt => renderOptionCard(opt, values.includes(opt.value), () => toggle(opt.value)))}
    </div>
  );

  const headline = STEP_HEADLINES[step] || STEP_HEADLINES[0];

  const encouragement = [
    "", "", "", "", "Du er på god vei 🎯", "",
    "Nesten i mål 🏁", "", "Siste spørsmål! ✨", ""
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 gap-0 bg-background border-border/20 overflow-hidden max-h-[90vh] rounded-3xl">
        <div className="p-6 md:p-8 overflow-y-auto max-h-[85vh]">
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring" }} className="text-center py-10">
                <motion.div
                  initial={{ rotate: -10, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                  className="text-6xl mb-4"
                >
                  🎉
                </motion.div>
                <h3 className="text-2xl font-bold mb-2">Tusen takk!</h3>
                <p className="text-muted-foreground max-w-xs mx-auto mb-8">
                  Vi har mottatt kartleggingen din og tar kontakt innen 48 timer for en uforpliktende samtale.
                </p>
                <button onClick={() => onOpenChange(false)} className="px-6 py-3 rounded-2xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
                  Lukk
                </button>
              </motion.div>
            ) : (
              <motion.div key={step} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
                {/* Header */}
                <div className="text-center mb-6">
                  <motion.span
                    key={`emoji-${step}`}
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 400 }}
                    className="text-4xl block mb-3"
                  >
                    {headline.emoji}
                  </motion.span>
                  <h3 className="text-xl font-bold mb-1">{headline.title}</h3>
                  <p className="text-sm text-muted-foreground">{headline.subtitle}</p>
                  {encouragement[step] && (
                    <motion.p initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-primary font-medium mt-2">
                      {encouragement[step]}
                    </motion.p>
                  )}
                </div>

                {/* Step 0: Company search */}
                {step === 0 && (
                  <div className="space-y-4">
                    <div ref={dropdownRef} className="relative">
                      <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input value={query} onChange={e => setQuery(e.target.value)}
                          placeholder="Firmanavn eller org.nr…" className={inputCls} autoFocus />
                        {(loading || fetchingDetails) && <Loader2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground animate-spin" />}
                      </div>
                      {results.length > 0 && (
                        <div className="absolute z-50 left-0 right-0 mt-1 rounded-2xl border border-border bg-popover shadow-2xl max-h-60 overflow-y-auto">
                          {results.map(enhet => (
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
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-primary/20 bg-primary/5 p-4 space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Building2 size={18} className="text-primary" />
                          </div>
                          <div>
                            <p className="font-bold text-sm">{company.company_name}</p>
                            <p className="text-xs text-muted-foreground">{company.org_number} · {company.org_form}</p>
                          </div>
                        </div>
                        {finRows.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-1">
                            {finRows.map(r => (
                              <span key={r.label} className="text-xs px-2.5 py-1 rounded-lg bg-background border border-border/50">
                                {r.label}: <strong>{r.value}</strong>
                              </span>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                )}

                {step === 1 && renderSingle(INTEREST_OPTIONS, interest, setInterest)}
                {step === 2 && renderSingle(REASON_OPTIONS, reason, setReason)}
                {step === 3 && renderSingle(CUSTOMER_COUNT_OPTIONS, customerCount, setCustomerCount)}
                {step === 4 && renderSingle(REVENUE_OPTIONS, revenueRange, setRevenueRange)}
                {step === 5 && renderSingle(EMPLOYEE_COUNT_OPTIONS, employeeCount, setEmployeeCount)}
                {step === 6 && renderMulti(SYSTEM_OPTIONS, systems, v => toggleMulti(v, systems, setSystems))}
                {step === 7 && renderMulti(CHALLENGE_OPTIONS, challenges, v => toggleMulti(v, challenges, setChallenges, "none"))}
                {step === 8 && renderSingle(TIMELINE_OPTIONS, timeline, setTimeline)}

                {/* Step 9: Contact */}
                {step === 9 && (
                  <div className="space-y-3">
                    <div className="relative">
                      <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input value={contactName} onChange={e => setContactName(e.target.value)} placeholder="Ditt navn *" maxLength={100} className={inputCls} autoFocus />
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
                      placeholder="Noe du vil legge til? (helt valgfritt)"
                      rows={3} maxLength={5000}
                      className="w-full rounded-2xl border border-border bg-muted/30 px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none transition-all" />
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          {!submitted && (
            <div className="flex items-center justify-between mt-6">
              {step > 0 ? (
                <button onClick={() => setStep(s => s - 1)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-xl hover:bg-muted/30">
                  <ArrowLeft size={14} /> Tilbake
                </button>
              ) : <div />}
              {([6, 7].includes(step) || step === 0 || step === 9) && (
                step === TOTAL - 1 ? (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleSubmit}
                    disabled={!canNext() || submitting}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-40 transition-all shadow-lg shadow-primary/20"
                  >
                    {submitting ? "Sender…" : <>Send inn <Rocket size={15} /></>}
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setStep(s => s + 1)}
                    disabled={!canNext()}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-40 transition-all"
                  >
                    Neste <ArrowRight size={14} />
                  </motion.button>
                )
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KartleggingDialog;
