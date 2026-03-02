import { useState, useEffect, useRef, useCallback } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, Building2, ArrowRight, ArrowLeft, CheckCircle2, Sparkles, Send, BarChart3, User, Mail, Phone } from "lucide-react";
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

const INTEREST_OPTIONS = [
  { value: "full_sale", label: "Selge hele selskapet", emoji: "🏷️" },
  { value: "full_sale_stay", label: "Selge, men fortsette som ansatt", emoji: "🤝" },
  { value: "partial", label: "Selge en andel", emoji: "📊" },
  { value: "partnership", label: "Samarbeidsavtale", emoji: "🔗" },
  { value: "open", label: "Åpen for alt", emoji: "💡" },
];

const REASON_OPTIONS = [
  { value: "retirement", label: "Planlegger å trappe ned / pensjon", emoji: "🌅" },
  { value: "growth", label: "Trenger ressurser til vekst", emoji: "📈" },
  { value: "burnout", label: "Sliter med å holde tritt alene", emoji: "⚡" },
  { value: "value", label: "Ønsker å realisere verdier", emoji: "💰" },
  { value: "quality", label: "Vil gi kundene et bedre tilbud", emoji: "⭐" },
  { value: "other", label: "Annet", emoji: "💬" },
];

const CHALLENGE_OPTIONS = [
  { value: "compliance", label: "Hvitvasking & compliance", emoji: "📋" },
  { value: "it", label: "IT-systemer & digitalisering", emoji: "💻" },
  { value: "hr", label: "HR & personaladministrasjon", emoji: "👥" },
  { value: "marketing", label: "Markedsføring & synlighet", emoji: "📣" },
  { value: "recruitment", label: "Vanskelig å rekruttere", emoji: "🔍" },
  { value: "profitability", label: "Lønnsomhet & prising", emoji: "📉" },
  { value: "none", label: "Ingen spesielle utfordringer", emoji: "✅" },
];

const TIMELINE_OPTIONS = [
  { value: "asap", label: "Så snart som mulig", emoji: "⚡" },
  { value: "6months", label: "Innen 6 måneder", emoji: "📅" },
  { value: "1year", label: "Innen 1 år", emoji: "🗓️" },
  { value: "exploring", label: "Bare utforsker", emoji: "🔭" },
];

function formatNOK(val: number | null | undefined): string {
  if (val == null) return "";
  const num = Math.round(Number(val));
  if (isNaN(num)) return "";
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1).replace(".", ",")} MNOK`;
  if (num >= 1_000) return `${Math.round(num / 1_000)} TNOK`;
  return `${num} NOK`;
}

/* ────────── main ────────── */
interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TOTAL_STEPS = 6; // company, interest, reason, challenges, timeline, contact

const KartleggingDialog = ({ open, onOpenChange }: Props) => {
  const [step, setStep] = useState(0);
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [interest, setInterest] = useState("");
  const [reason, setReason] = useState("");
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

  // Reset when closed
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setStep(0);
        setCompany(null);
        setInterest("");
        setReason("");
        setChallenges([]);
        setTimeline("");
        setContactName("");
        setContactEmail("");
        setContactPhone("");
        setMessage("");
        setSubmitted(false);
        setQuery("");
        setResults([]);
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
    setResults([]);
    setQuery("");
    setFetchingDetails(true);

    const orgNr = enhet.organisasjonsnummer;
    const [rolleResult, regnskapResult] = await Promise.allSettled([
      fetch(`https://data.brreg.no/enhetsregisteret/api/enheter/${orgNr}/roller`).then(r => r.ok ? r.json() : null),
      fetch(`https://data.brreg.no/regnskapsregisteret/regnskap/${orgNr}`, { headers: { Accept: "application/json" } }).then(r => r.ok ? r.json() : null),
    ]);

    let dagligLeder = "";
    let styreleder = "";
    try {
      const rolleData = rolleResult.status === "fulfilled" ? rolleResult.value : null;
      for (const g of (rolleData?.rollegrupper || [])) {
        if (g.type?.kode === "DAGL") {
          const p = g.roller?.[0]?.person;
          if (p) dagligLeder = `${p.navn?.fornavn || ""} ${p.navn?.etternavn || ""}`.trim();
        }
        if (g.type?.kode === "LEDE") {
          const p = g.roller?.[0]?.person;
          if (p) styreleder = `${p.navn?.fornavn || ""} ${p.navn?.etternavn || ""}`.trim();
        }
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

    const data: CompanyData = {
      org_number: orgNr,
      company_name: enhet.navn || "",
      org_form: enhet.organisasjonsform?.beskrivelse || "",
      address: addressStr,
      stiftelsesdato: enhet.stiftelsesdato || enhet.registreringsdatoEnhetsregisteret || "",
      daglig_leder: dagligLeder,
      styreleder: styreleder,
      num_employees: numEmployees,
      website: enhet.hjemmeside || "",
      financials: fin,
    };

    setCompany(data);
    setContactName(dagligLeder || "");
    setFetchingDetails(false);
    setStep(1);
  }, []);

  const toggleChallenge = (val: string) => {
    if (val === "none") { setChallenges(["none"]); return; }
    setChallenges(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev.filter(v => v !== "none"), val]);
  };

  const handleSubmit = async () => {
    if (!company || !contactEmail.trim() || !contactName.trim()) return;
    setSubmitting(true);

    const interestLabel = INTEREST_OPTIONS.find(i => i.value === interest)?.label || interest;
    const reasonLabel = REASON_OPTIONS.find(r => r.value === reason)?.label || reason;
    const challengeLabels = challenges.map(c => CHALLENGE_OPTIONS.find(o => o.value === c)?.label || c).join(", ");
    const timelineLabel = TIMELINE_OPTIONS.find(t => t.value === timeline)?.label || timeline;

    const finSummary = company.financials
      ? `\n\nRegnskap ${company.financials.regnskapsaar}:\nDriftsinntekter: ${company.financials.sumDriftsinntekter}\nDriftsresultat: ${company.financials.driftsresultat}\nÅrsresultat: ${company.financials.aarsresultat}\nEiendeler: ${company.financials.sumEiendeler}\nEgenkapital: ${company.financials.sumEgenkapital}\nGjeld: ${company.financials.sumGjeld}`
      : "";

    const fullMessage = `[Samarbeid — Kartlegging]\n\nInteresse: ${interestLabel}\nBakgrunn: ${reasonLabel}\nUtfordringer: ${challengeLabels}\nTidshorisont: ${timelineLabel}${company.daglig_leder ? `\nDaglig leder: ${company.daglig_leder}` : ""}${company.styreleder ? `\nStyreleder: ${company.styreleder}` : ""}${company.address ? `\nAdresse: ${company.address}` : ""}${company.num_employees ? `\nAnsatte: ${company.num_employees}` : ""}${finSummary}${message ? `\n\nMelding:\n${message}` : ""}`;

    // Save to DB
    try {
      await supabase.from("samarbeid_applications").insert([{
        org_number: company.org_number,
        company_name: company.company_name,
        contact_name: contactName.trim(),
        contact_email: contactEmail.trim(),
        contact_phone: contactPhone.trim() || null,
        website: company.website || null,
        num_employees: company.num_employees ? parseInt(company.num_employees) : null,
        annual_revenue: company.financials?.sumDriftsinntekter || null,
        interest_type: interest || "open",
        message: fullMessage,
      }]);
    } catch {}

    // Send email
    try {
      await supabase.functions.invoke("contact-submit", {
        body: {
          company_name: company.company_name,
          org_number: company.org_number,
          contact_person: contactName.trim(),
          email: contactEmail.trim(),
          phone: contactPhone.trim() || null,
          industry: company.org_form || null,
          message: fullMessage,
          section: "samarbeid",
        },
      });
    } catch (err) {
      console.error("Email sending failed:", err);
    }

    setSubmitted(true);
    setSubmitting(false);
  };

  const canNext = () => {
    switch (step) {
      case 0: return !!company;
      case 1: return !!interest;
      case 2: return !!reason;
      case 3: return challenges.length > 0;
      case 4: return !!timeline;
      case 5: return !!contactName.trim() && !!contactEmail.trim();
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
    { label: "Gjeld", value: company.financials.sumGjeld },
  ].filter(r => r.value) : [];

  const slideVariants = {
    enter: { opacity: 0, x: 40 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px] p-0 gap-0 bg-background border-border/20 overflow-hidden max-h-[90vh]">
        {/* Progress bar */}
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
                      <h3 className="text-lg font-bold">Finn selskapet ditt</h3>
                      <p className="text-sm text-muted-foreground mt-1">Søk på firmanavn eller organisasjonsnummer — vi henter all info automatisk.</p>
                    </div>
                    <div ref={dropdownRef} className="relative">
                      <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                          value={query}
                          onChange={e => setQuery(e.target.value)}
                          placeholder="Søk firmanavn eller org.nr…"
                          className="w-full h-12 pl-10 pr-4 rounded-xl border border-border bg-muted/30 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                          autoFocus
                        />
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

                    {/* Show selected company */}
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

                {/* Step 1: Interest type */}
                {step === 1 && (
                  <div className="space-y-5">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Steg 2 av {TOTAL_STEPS}</p>
                      <h3 className="text-lg font-bold">Hva er du interessert i?</h3>
                      <p className="text-sm text-muted-foreground mt-1">Velg det alternativet som passer best — ingenting er bindende.</p>
                    </div>
                    <div className="space-y-2">
                      {INTEREST_OPTIONS.map(opt => (
                        <button key={opt.value} onClick={() => setInterest(opt.value)}
                          className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left text-sm font-medium border transition-all ${
                            interest === opt.value
                              ? "border-primary bg-primary/10 text-foreground shadow-sm"
                              : "border-border hover:border-primary/30 hover:bg-muted/30 text-foreground/80"
                          }`}>
                          <span className="text-lg">{opt.emoji}</span>
                          {opt.label}
                          {interest === opt.value && <CheckCircle2 size={16} className="ml-auto text-primary" />}
                        </button>
                      ))}
                    </div>
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
                    <div className="space-y-2">
                      {REASON_OPTIONS.map(opt => (
                        <button key={opt.value} onClick={() => setReason(opt.value)}
                          className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left text-sm font-medium border transition-all ${
                            reason === opt.value
                              ? "border-primary bg-primary/10 text-foreground shadow-sm"
                              : "border-border hover:border-primary/30 hover:bg-muted/30 text-foreground/80"
                          }`}>
                          <span className="text-lg">{opt.emoji}</span>
                          {opt.label}
                          {reason === opt.value && <CheckCircle2 size={16} className="ml-auto text-primary" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 3: Challenges */}
                {step === 3 && (
                  <div className="space-y-5">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Steg 4 av {TOTAL_STEPS}</p>
                      <h3 className="text-lg font-bold">Hvilke utfordringer har dere?</h3>
                      <p className="text-sm text-muted-foreground mt-1">Velg én eller flere — dette hjelper oss å tilpasse tilbudet.</p>
                    </div>
                    <div className="space-y-2">
                      {CHALLENGE_OPTIONS.map(opt => (
                        <button key={opt.value} onClick={() => toggleChallenge(opt.value)}
                          className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left text-sm font-medium border transition-all ${
                            challenges.includes(opt.value)
                              ? "border-primary bg-primary/10 text-foreground shadow-sm"
                              : "border-border hover:border-primary/30 hover:bg-muted/30 text-foreground/80"
                          }`}>
                          <span className="text-lg">{opt.emoji}</span>
                          {opt.label}
                          {challenges.includes(opt.value) && <CheckCircle2 size={16} className="ml-auto text-primary" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 4: Timeline */}
                {step === 4 && (
                  <div className="space-y-5">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Steg 5 av {TOTAL_STEPS}</p>
                      <h3 className="text-lg font-bold">Hva er tidshorisonten?</h3>
                      <p className="text-sm text-muted-foreground mt-1">Ingen bindende frister — bare en pekepinn.</p>
                    </div>
                    <div className="space-y-2">
                      {TIMELINE_OPTIONS.map(opt => (
                        <button key={opt.value} onClick={() => setTimeline(opt.value)}
                          className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left text-sm font-medium border transition-all ${
                            timeline === opt.value
                              ? "border-primary bg-primary/10 text-foreground shadow-sm"
                              : "border-border hover:border-primary/30 hover:bg-muted/30 text-foreground/80"
                          }`}>
                          <span className="text-lg">{opt.emoji}</span>
                          {opt.label}
                          {timeline === opt.value && <CheckCircle2 size={16} className="ml-auto text-primary" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 5: Contact details */}
                {step === 5 && (
                  <div className="space-y-5">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Steg 6 av {TOTAL_STEPS}</p>
                      <h3 className="text-lg font-bold">Hvem kan vi kontakte?</h3>
                      <p className="text-sm text-muted-foreground mt-1">All informasjon behandles 100 % konfidensielt.</p>
                    </div>
                    <div className="space-y-3">
                      <div className="relative">
                        <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input value={contactName} onChange={e => setContactName(e.target.value)}
                          placeholder="Navn *" maxLength={100}
                          className="w-full h-12 pl-10 pr-4 rounded-xl border border-border bg-muted/30 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
                      </div>
                      <div className="relative">
                        <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)}
                          placeholder="E-post *" maxLength={255}
                          className="w-full h-12 pl-10 pr-4 rounded-xl border border-border bg-muted/30 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
                      </div>
                      <div className="relative">
                        <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input type="tel" value={contactPhone} onChange={e => setContactPhone(e.target.value)}
                          placeholder="Telefon (valgfritt)" maxLength={20}
                          className="w-full h-12 pl-10 pr-4 rounded-xl border border-border bg-muted/30 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
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

          {/* Navigation buttons */}
          {!submitted && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/30">
              {step > 0 ? (
                <button onClick={() => setStep(s => s - 1)}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
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
