import { useState, useEffect, useRef, useCallback } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, Building2, ArrowRight, ArrowLeft, CheckCircle2, Sparkles, Send, BarChart3, User, Mail, Phone, Rocket, PartyPopper, Zap, Heart, Trophy } from "lucide-react";
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

/* ────────── Fun option data ────────── */
const INTEREST_OPTIONS = [
  { value: "full_sale", label: "Selge hele byrået", emoji: "🏷️", sub: "Ny eier, ny start" },
  { value: "full_sale_stay", label: "Selge, men bli med videre", emoji: "🤝", sub: "Det beste fra to verdener" },
  { value: "partial", label: "Selge en del", emoji: "📊", sub: "Beholde litt, tjene litt" },
  { value: "partnership", label: "Samarbeid uten salg", emoji: "🔗", sub: "Sterkere sammen" },
  { value: "open", label: "Åpen for alt!", emoji: "💡", sub: "La oss utforske mulighetene" },
];

const REASON_OPTIONS = [
  { value: "retirement", label: "Tid for å nyte livet", emoji: "🌅", sub: "Pensjon eller nedtrapping" },
  { value: "growth", label: "Trenger boost for å vokse", emoji: "🚀", sub: "Ressurser og nettverk" },
  { value: "burnout", label: "Trenger avlastning", emoji: "⚡", sub: "Alt for mye på én skulder" },
  { value: "value", label: "Vil realisere verdier", emoji: "💰", sub: "Kapitalisere på innsatsen" },
  { value: "quality", label: "Gi kundene mer", emoji: "⭐", sub: "Bredere tilbud og bedre kvalitet" },
  { value: "succession", label: "Mangler etterfølger", emoji: "🔄", sub: "Hvem tar over stafettpinnen?" },
  { value: "other", label: "Noe helt annet", emoji: "💬", sub: "Vi er nysgjerrige!" },
];

const CUSTOMER_COUNT_OPTIONS = [
  { value: "1-20", label: "1–20 kunder", emoji: "🌱", sub: "Oversiktlig og personlig" },
  { value: "21-50", label: "21–50 kunder", emoji: "🌿", sub: "Fin portefølje" },
  { value: "51-100", label: "51–100 kunder", emoji: "🌳", sub: "Solid kundebase" },
  { value: "101-200", label: "101–200 kunder", emoji: "🏔️", sub: "Imponerende!" },
  { value: "200+", label: "Over 200 kunder", emoji: "🏆", sub: "Heftig maskineri" },
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
  { value: "solo", label: "Bare meg — one-man-show", emoji: "🦸" },
  { value: "2-5", label: "2–5 ansatte", emoji: "👥" },
  { value: "6-10", label: "6–10 ansatte", emoji: "🏢" },
  { value: "11-20", label: "11–20 ansatte", emoji: "🏗️" },
  { value: "20+", label: "Over 20 ansatte", emoji: "🏙️" },
];

const SERVICE_OPTIONS = [
  { value: "bookkeeping", label: "Løpende bokføring", emoji: "📖" },
  { value: "payroll", label: "Lønn & personal", emoji: "💵" },
  { value: "annual_accounts", label: "Årsregnskap", emoji: "📋" },
  { value: "tax", label: "Skatt & rådgivning", emoji: "🧾" },
  { value: "advisory", label: "CFO / økonomisk rådgivning", emoji: "📊" },
  { value: "invoicing", label: "Fakturering", emoji: "🧮" },
  { value: "audit", label: "Revisjon", emoji: "🔍" },
  { value: "other_services", label: "Andre ting", emoji: "✨" },
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
  { value: "other_system", label: "Noe annet", emoji: "🔧" },
];

const AUTHORIZED_OPTIONS = [
  { value: "yes", label: "Ja, vi er autorisert", emoji: "✅" },
  { value: "no", label: "Nei, ikke ennå", emoji: "❌" },
  { value: "unknown", label: "Vet ikke 🤷", emoji: "❓" },
];

const CHALLENGE_OPTIONS = [
  { value: "compliance", label: "Hvitvasking & compliance", emoji: "📋" },
  { value: "it", label: "Digitalisering & IT", emoji: "💻" },
  { value: "recruitment", label: "Vanskelig å rekruttere", emoji: "🔍" },
  { value: "profitability", label: "Lønnsomhet & prising", emoji: "📉" },
  { value: "capacity", label: "For mye å gjøre!", emoji: "⏰" },
  { value: "customer_churn", label: "Mister kunder", emoji: "📤" },
  { value: "quality_control", label: "Kvalitetskontroll", emoji: "✅" },
  { value: "none", label: "Alt er rosenrødt 👍", emoji: "🌹" },
];

const TIMELINE_OPTIONS = [
  { value: "asap", label: "Jo før jo heller!", emoji: "⚡", sub: "La oss kjøre på" },
  { value: "6months", label: "Innen et halvt år", emoji: "📅", sub: "Litt tid å forberede" },
  { value: "1year", label: "Innen et år", emoji: "🗓️", sub: "Planlegger fremover" },
  { value: "exploring", label: "Bare sniffer litt", emoji: "🔭", sub: "Ingen hastverk" },
];

function formatNOK(val: number | null | undefined): string {
  if (val == null) return "";
  const num = Math.round(Number(val));
  if (isNaN(num)) return "";
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1).replace(".", ",")} MNOK`;
  if (num >= 1_000) return `${Math.round(num / 1_000)} TNOK`;
  return `${num} NOK`;
}

/* ────────── Step headlines — conversational & fun ────────── */
const STEP_HEADLINES: { emoji: string; title: string; subtitle: string }[] = [
  { emoji: "🔍", title: "La oss starte med å finne byrået ditt", subtitle: "Søk på navn eller org.nr — vi gjør resten" },
  { emoji: "💭", title: "Hva drømmer du om?", subtitle: "Helt uforpliktende — vi bare utforsker" },
  { emoji: "🤔", title: "Hva driver tankene?", subtitle: "Det finnes ingen feil svar" },
  { emoji: "👥", title: "Hvor mange kunder har dere?", subtitle: "Omtrent er helt perfekt" },
  { emoji: "💰", title: "Hva omsetter byrået for?", subtitle: "Tall fra siste år — ca. er helt ok" },
  { emoji: "🦸", title: "Hvor mange er dere på laget?", subtitle: "Inkluder deg selv!" },
  { emoji: "🧰", title: "Hva leverer dere til kundene?", subtitle: "Velg alt som passer — trykk løs!" },
  { emoji: "💻", title: "Hvilket system er hjertet i driften?", subtitle: "Velg alle dere bruker" },
  { emoji: "🏅", title: "Er byrået autorisert?", subtitle: "Autorisert regnskapsførerselskap" },
  { emoji: "🎯", title: "Hva er den største utfordringen?", subtitle: "Velg det som treffer — eller alt er bra!" },
  { emoji: "⏰", title: "Hva er tidshorisonten din?", subtitle: "Helt frivillig tempo" },
  { emoji: "📬", title: "Nesten der! Hvem skal vi ringe?", subtitle: "100 % konfidensielt — vi lover" },
];

/* ────────── Main ────────── */
interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const KartleggingDialog = ({ open, onOpenChange }: Props) => {
  // Each step = one question
  // 0: company, 1: interest, 2: reason, 3: customers, 4: revenue, 5: employees,
  // 6: services, 7: systems, 8: authorized, 9: challenges, 10: timeline, 11: contact
  const TOTAL = 12;
  const [step, setStep] = useState(0);
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [interest, setInterest] = useState("");
  const [reason, setReason] = useState("");
  const [customerCount, setCustomerCount] = useState("");
  const [revenueRange, setRevenueRange] = useState("");
  const [employeeCount, setEmployeeCount] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [systems, setSystems] = useState<string[]>([]);
  const [authorized, setAuthorized] = useState("");
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
  }, []);

  const toggleMulti = (val: string, state: string[], setState: React.Dispatch<React.SetStateAction<string[]>>, exclusiveVal?: string) => {
    if (val === exclusiveVal) { setState([exclusiveVal]); return; }
    setState(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev.filter(v => v !== exclusiveVal), val]);
  };

  // Auto-advance on single-select
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

    const fullMessage = `[Samarbeid — Kartlegging]\n\nInteresse: ${label(INTEREST_OPTIONS, interest)}\nBakgrunn: ${label(REASON_OPTIONS, reason)}\n\nPORTEFØLJE:\nAntall kunder: ${label(CUSTOMER_COUNT_OPTIONS, customerCount)}\nOmsetning: ${label(REVENUE_OPTIONS, revenueRange)}\nAnsatte: ${label(EMPLOYEE_COUNT_OPTIONS, employeeCount)}\n\nDRIFT:\nTjenester: ${labels(SERVICE_OPTIONS, services)}\nAutorisert: ${authorized === "yes" ? "Ja" : authorized === "no" ? "Nei" : "Vet ikke"}\n\nSYSTEMER: ${labels(SYSTEM_OPTIONS, systems)}\n\nUtfordringer: ${labels(CHALLENGE_OPTIONS, challenges)}\nTidshorisont: ${label(TIMELINE_OPTIONS, timeline)}${company.daglig_leder ? `\nDaglig leder: ${company.daglig_leder}` : ""}${company.styreleder ? `\nStyreleder: ${company.styreleder}` : ""}${company.address ? `\nAdresse: ${company.address}` : ""}${company.num_employees ? `\nAnsatte (Brreg): ${company.num_employees}` : ""}${finSummary}${message ? `\n\nMelding:\n${message}` : ""}`;

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
      case 6: return services.length > 0;
      case 7: return systems.length > 0;
      case 8: return !!authorized;
      case 9: return challenges.length > 0;
      case 10: return !!timeline;
      case 11: return !!contactName.trim() && !!contactEmail.trim();
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

  // Fun encouragement messages
  const encouragement = [
    "", "", "", "Bra jobba! 💪", "Du er på god vei! 🎯", "Halvveis — nice! 🎉",
    "Snart i mål! 🏁", "Nesten ferdig! 🔥", "Siste stretch! 💫", "Awesome! 🚀", "Siste spørsmål nesten! ✨", "Siste steg! 🎊"
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
                <h3 className="text-2xl font-bold mb-2">Du er gull verdt!</h3>
                <p className="text-muted-foreground max-w-xs mx-auto mb-8">
                  Vi har fått alt vi trenger. Forvent en hyggelig telefon innen 48 timer — helt uforpliktende.
                </p>
                <button onClick={() => onOpenChange(false)} className="px-6 py-3 rounded-2xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
                  Supert, lukk 🙌
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
                          placeholder="Skriv firmanavn eller org.nr…" className={inputCls} autoFocus />
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
                {step === 6 && renderMulti(SERVICE_OPTIONS, services, v => toggleMulti(v, services, setServices))}
                {step === 7 && renderMulti(SYSTEM_OPTIONS, systems, v => toggleMulti(v, systems, setSystems))}
                {step === 8 && renderSingle(AUTHORIZED_OPTIONS, authorized, setAuthorized)}
                {step === 9 && renderMulti(CHALLENGE_OPTIONS, challenges, v => toggleMulti(v, challenges, setChallenges, "none"))}
                {step === 10 && renderSingle(TIMELINE_OPTIONS, timeline, setTimeline)}

                {/* Step 11: Contact */}
                {step === 11 && (
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

          {/* Navigation — minimal */}
          {!submitted && (
            <div className="flex items-center justify-between mt-6">
              {step > 0 ? (
                <button onClick={() => setStep(s => s - 1)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-xl hover:bg-muted/30">
                  <ArrowLeft size={14} /> Tilbake
                </button>
              ) : <div />}
              {/* Only show Next for multi-select steps and contact step */}
              {([6, 7, 9].includes(step) || step === 0 || step === 11) && (
                step === TOTAL - 1 ? (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleSubmit}
                    disabled={!canNext() || submitting}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-40 transition-all shadow-lg shadow-primary/20"
                  >
                    {submitting ? "Sender… ✨" : <>Send inn <Rocket size={15} /></>}
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
