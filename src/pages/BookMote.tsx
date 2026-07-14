import { useState, useEffect, useMemo, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, Users, ChevronLeft, ChevronRight, CheckCircle2, Calendar as CalIcon, Clock, ArrowRight, ShieldCheck, Search, Building2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format, addDays, startOfWeek, isBefore, isSameDay, startOfDay } from "date-fns";
import { nb } from "date-fns/locale";

interface Availability { profile_id: string; day_of_week: number; start_time: string; end_time: string; }
interface BlockedDate { profile_id: string; blocked_date: string; }
interface ExistingBooking { advisor_id: string; booking_date: string; booking_time: string; }
interface AdvisorInfo { id: string; name: string; }

type BrregEnhet = {
  organisasjonsnummer: string;
  navn: string;
  antallAnsatte?: number;
  organisasjonsform?: { beskrivelse?: string };
  forretningsadresse?: { adresse?: string[]; postnummer?: string; poststed?: string };
};


const services = [
  { id: "regnskap", label: "Regnskap & økonomi", desc: "Bokføring, årsregnskap, MVA, rådgivning", icon: Calculator, color: "from-rose-500/20 to-orange-500/10" },
  { id: "hr", label: "HR & personal", desc: "Ansettelse, lønn, personalhåndbok", icon: Users, color: "from-amber-500/20 to-yellow-500/10" },
] as const;

type ServiceId = "regnskap" | "hr";

const serviceQuiz: Record<ServiceId, {
  statusLabel: string;
  statusOptions: readonly string[];
  goalLabel: string;
  goals: readonly string[];
}> = {
  regnskap: {
    statusLabel: "Regnskapsfører i dag?",
    statusOptions: ["Ja", "Nei", "Vurderer bytte"],
    goalLabel: "Hva er hovedmålet med møtet?",
    goals: ["Bytte regnskapsfører", "Starte opp / nytt selskap", "Få konkret rådgivning", "Årsoppgjør / skatt", "Annet / utforske"],
  },
  hr: {
    statusLabel: "Hvordan håndterer dere HR i dag?",
    statusOptions: ["Internt", "Outsourcet", "Ikke etablert"],
    goalLabel: "Hva trenger du hjelp med?",
    goals: ["Ansette første medarbeider", "Personalhåndbok & rutiner", "Lønn & rapportering", "Arbeidsrett / oppsigelse", "Annet / utforske"],
  },
};

const sizes = ["Ingen ansatte", "1–5 ansatte", "6–20 ansatte", "20+ ansatte"] as const;


function generateSlots(startTime: string, endTime: string): string[] {
  const slots: string[] = [];
  const [sh, sm] = startTime.split(":").map(Number);
  const [eh, em] = endTime.split(":").map(Number);
  let m = sh * 60 + sm;
  const end = eh * 60 + em;
  while (m + 30 <= end) {
    slots.push(`${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`);
    m += 30;
  }
  return slots;
}

const STEPS = ["Tjeneste", "Situasjon", "Mål", "Tidspunkt", "Kontakt"] as const;

const BookMote = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [service, setService] = useState<ServiceId | null>(null);
  const [size, setSize] = useState<string | null>(null);
  const [currentStatus, setCurrentStatus] = useState<string | null>(null);
  const [goal, setGoal] = useState<string | null>(null);
  const [form, setForm] = useState({ firma: "", orgnr: "", navn: "", telefon: "", epost: "", melding: "" });
  const quiz = service ? serviceQuiz[service] : null;
  const pickService = (id: ServiceId) => {
    if (service !== id) { setCurrentStatus(null); setGoal(null); }
    setService(id);
  };

  // Brreg company search (step 1)
  const [companySearch, setCompanySearch] = useState("");
  const [searchResults, setSearchResults] = useState<BrregEnhet[]>([]);
  const [searching, setSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<BrregEnhet | null>(null);
  const [hasAccountant, setHasAccountant] = useState<null | boolean>(null);
  const [checkingAccountant, setCheckingAccountant] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);


  // Calendar
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedAdvisor, setSelectedAdvisor] = useState<string | null>(null);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [existingBookings, setExistingBookings] = useState<ExistingBooking[]>([]);
  const [advisors, setAdvisors] = useState<AdvisorInfo[]>([]);
  const [loadingCal, setLoadingCal] = useState(false);

  useEffect(() => {
    if (step !== 3 || availability.length > 0) return;
    setLoadingCal(true);
    (async () => {
      const [{ data: avail }, { data: blocked }, { data: bookings }, { data: profiles }] = await Promise.all([
        supabase.from("advisor_availability").select("profile_id, day_of_week, start_time, end_time").eq("active", true),
        supabase.from("advisor_blocked_dates").select("profile_id, blocked_date"),
        supabase.from("bookings").select("advisor_id, booking_date, booking_time, status").neq("status", "cancelled"),
        supabase.from("profiles").select("id, name"),
      ]);
      setAvailability((avail as Availability[]) || []);
      setBlockedDates((blocked as BlockedDate[]) || []);
      setExistingBookings(((bookings as any[]) || []).map(b => ({ advisor_id: b.advisor_id, booking_date: b.booking_date, booking_time: b.booking_time })));
      const ids = new Set((avail || []).map(a => a.profile_id));
      setAdvisors((profiles || []).filter(p => ids.has(p.id)));
      setLoadingCal(false);
    })();
  }, [step, availability.length]);

  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);

  // Brreg search debounce
  useEffect(() => {
    if (companySearch.length < 2 || (selectedCompany && companySearch === selectedCompany.navn)) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(async () => {
      setSearching(true);
      try {
        const isOrgNr = /^\d{9}$/.test(companySearch.trim());
        const url = isOrgNr
          ? `https://data.brreg.no/enhetsregisteret/api/enheter/${companySearch.trim()}`
          : `https://data.brreg.no/enhetsregisteret/api/enheter?navn=${encodeURIComponent(companySearch)}&size=8&fraAntallAnsatte=0`;
        const res = await fetch(url);
        if (!res.ok) { setSearchResults([]); setSearching(false); return; }
        const data = await res.json();
        if (isOrgNr) {
          setSearchResults(data?.organisasjonsnummer ? [data] : []);
          setShowDropdown(!!data?.organisasjonsnummer);
        } else {
          setSearchResults(data._embedded?.enheter || []);
          setShowDropdown((data._embedded?.enheter || []).length > 0);
        }
      } catch {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 350);
    return () => { if (searchTimeout.current) clearTimeout(searchTimeout.current); };
  }, [companySearch, selectedCompany]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setShowDropdown(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selectCompany = async (enhet: BrregEnhet) => {
    setSelectedCompany(enhet);
    setCompanySearch(enhet.navn);
    setShowDropdown(false);
    setForm(f => ({ ...f, firma: enhet.navn, orgnr: enhet.organisasjonsnummer }));
    // Auto-pick size from antallAnsatte
    const n = enhet.antallAnsatte ?? 0;
    if (n === 0) setSize("Ingen ansatte");
    else if (n <= 5) setSize("1–5 ansatte");
    else if (n <= 20) setSize("6–20 ansatte");
    else setSize("20+ ansatte");

    // Sjekk regnskapsfører via Brreg roller-API (kun relevant for regnskap-tjeneste)
    setHasAccountant(null);
    if (service === "regnskap") {
      setCheckingAccountant(true);
      try {
        const res = await fetch(`https://data.brreg.no/enhetsregisteret/api/enheter/${enhet.organisasjonsnummer}/roller`);
        if (res.ok) {
          const data = await res.json();
          const groups: any[] = data?.rollegrupper || [];
          const found = groups.some(g => {
            const kode = g?.type?.kode || "";
            if (kode === "REGN" || kode === "REGN_FORE") return true;
            return (g?.roller || []).some((r: any) => (r?.type?.kode || "").startsWith("REGN"));
          });
          setHasAccountant(found);
          setCurrentStatus(found ? "Ja" : "Nei");
        } else {
          setHasAccountant(false);
          setCurrentStatus("Nei");
        }
      } catch {
        setHasAccountant(null);
      } finally {
        setCheckingAccountant(false);
      }
    }
  };

  const clearCompany = () => {
    setSelectedCompany(null);
    setCompanySearch("");
    setForm(f => ({ ...f, firma: "", orgnr: "" }));
    setHasAccountant(null);
  };


  const getSlots = (date: Date) => {
    const dow = ((date.getDay() + 6) % 7) + 1;
    const dateStr = format(date, "yyyy-MM-dd");
    if (isBefore(date, startOfDay(new Date()))) return [];
    const dayAvail = availability.filter(a => a.day_of_week === dow);
    const blockedToday = new Set(blockedDates.filter(b => b.blocked_date === dateStr).map(b => b.profile_id));
    const slotMap = new Map<string, string[]>();
    for (const adv of dayAvail) {
      if (blockedToday.has(adv.profile_id)) continue;
      for (const slot of generateSlots(adv.start_time, adv.end_time)) {
        const taken = existingBookings.some(b => b.advisor_id === adv.profile_id && b.booking_date === dateStr && b.booking_time.slice(0, 5) === slot);
        if (!taken) {
          if (!slotMap.has(slot)) slotMap.set(slot, []);
          slotMap.get(slot)!.push(adv.profile_id);
        }
      }
    }
    return Array.from(slotMap.entries()).map(([time, advisorIds]) => ({ time, advisorIds })).sort((a, b) => a.time.localeCompare(b.time));
  };

  const slots = selectedDate ? getSlots(selectedDate) : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime || !selectedAdvisor) return;
    setSubmitting(true);
    const bookingDate = format(selectedDate, "yyyy-MM-dd");
    const meldingFull = [
      `Tjenesteområde: ${services.find(s => s.id === service)?.label}`,
      form.orgnr ? `Org.nr: ${form.orgnr}` : "",
      `Størrelse: ${size}`,
      `${quiz?.statusLabel || "Status i dag"} ${currentStatus}`,
      `Mål: ${goal}`,
      form.melding ? `\nMelding: ${form.melding}` : "",
    ].filter(Boolean).join("\n");

    const { error } = await supabase.from("bookings").insert({
      advisor_id: selectedAdvisor,
      customer_name: form.navn,
      customer_email: form.epost,
      customer_phone: form.telefon,
      company_name: form.firma,
      message: meldingFull,
      booking_date: bookingDate,
      booking_time: selectedTime,
      section: service,
    } as any);

    if (!error) {
      try {
        await supabase.functions.invoke("notify", {
          body: {
            type: "booking_notification",
            data: {
              advisor_id: selectedAdvisor,
              customer_name: form.navn,
              customer_email: form.epost,
              customer_phone: form.telefon,
              company_name: form.firma,
              booking_date: bookingDate,
              booking_time: selectedTime,
              message: meldingFull,
            },
          },
        });
      } catch (err) { console.error(err); }
      setSubmitted(true);
    }
    setSubmitting(false);
  };

  const canNext = () => {
    if (step === 0) return !!service;
    if (step === 1) return !!size && !!currentStatus;
    if (step === 2) return !!goal;
    if (step === 3) return !!selectedDate && !!selectedTime && !!selectedAdvisor;
    return true;
  };

  const inputClass = "w-full h-12 rounded-xl border border-border/30 bg-muted/30 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-muted-foreground/50";

  if (submitted) {
    return (
      <>
        <Helmet>
          <title>Møte bekreftet | Avargo</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <section className="min-h-[70vh] flex items-center justify-center px-4">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg w-full text-center glass rounded-3xl border border-border/20 p-10 space-y-5">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
              <CheckCircle2 size={28} className="text-primary" />
            </div>
            <h1 className="text-2xl font-semibold">Takk! Møtet er booket.</h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Vi har sendt en bekreftelse til <span className="text-foreground">{form.epost}</span>. Du får en kalenderinvitasjon med Teams-lenke i god tid før møtet {selectedDate && format(selectedDate, "d. MMMM", { locale: nb })} kl. {selectedTime}.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
              <Link to="/" className="px-5 py-2.5 rounded-full text-sm border border-border/30 hover:bg-muted/40 transition">Til forsiden</Link>
              <Link to="/ressurser" className="px-5 py-2.5 rounded-full text-sm bg-primary text-primary-foreground hover:opacity-90 transition">Utforsk ressurser</Link>
            </div>
          </motion.div>
        </section>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Book møte – uforpliktende rådgivning | Avargo</title>
        <meta name="description" content="Book et 30-minutters møte med en Avargo-rådgiver. Svar på fire korte spørsmål, så finner vi rett person og passende tid." />
        <link rel="canonical" href="https://www.avargo.no/book-mote" />
        <meta property="og:title" content="Book møte – Avargo" />
        <meta property="og:description" content="Uforpliktende 30-min rådgivning. Svar på fire korte spørsmål og velg tidspunkt." />
        <meta property="og:url" content="https://www.avargo.no/book-mote" />
      </Helmet>

      <section className="pt-28 pb-20 min-h-[80vh]">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Stepper */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              {STEPS.map((label, i) => (
                <div key={label} className="flex-1 flex items-center gap-2">
                  <div className={`flex-1 h-1 rounded-full transition-colors ${i <= step ? "bg-primary" : "bg-muted"}`} />
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
              <span>Steg {step + 1} av {STEPS.length}</span>
              <span className="text-foreground/80">{STEPS[step]}</span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.25 }}
              className="glass rounded-3xl border border-border/20 p-6 md:p-10"
            >
              {step === 0 && (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-widest text-primary">Spørsmål 1 av 4</p>
                    <h1 className="text-2xl md:text-3xl font-semibold">Hva trenger du hjelp med?</h1>
                    <p className="text-sm text-muted-foreground">Vi setter deg i kontakt med rett rådgiver.</p>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {services.map(s => {
                      const Icon = s.icon;
                      const active = service === s.id;
                      return (
                        <button key={s.id} onClick={() => pickService(s.id)}
                          className={`text-left p-5 rounded-2xl border transition-all ${active ? "border-primary bg-primary/5" : "border-border/20 hover:border-primary/40"}`}>
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} border border-border/20 flex items-center justify-center mb-3`}>
                            <Icon size={18} className="text-foreground" />
                          </div>
                          <p className="text-sm font-medium">{s.label}</p>
                          <p className="text-xs text-muted-foreground mt-1">{s.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-widest text-primary">Spørsmål 2 av 4</p>
                    <h1 className="text-2xl md:text-3xl font-semibold">Fortell litt om bedriften</h1>
                    <p className="text-sm text-muted-foreground">Søk opp bedriften så fyller vi inn det vi kan automatisk.</p>
                  </div>

                  {/* Brreg search */}
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Bedrift</p>
                    <div className="relative" ref={dropdownRef}>
                      <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                      <input
                        value={companySearch}
                        onChange={e => { setCompanySearch(e.target.value); if (selectedCompany) setSelectedCompany(null); }}
                        onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
                        placeholder="Søk firmanavn eller org.nr (9 siffer)…"
                        className={`${inputClass} pl-11 pr-10`}
                        autoComplete="off"
                      />
                      {searching && <Loader2 size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground animate-spin" />}
                      {!searching && selectedCompany && (
                        <button type="button" onClick={clearCompany} className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-muted-foreground hover:text-foreground px-2 py-1 rounded-md hover:bg-muted/40">
                          Endre
                        </button>
                      )}

                      <AnimatePresence>
                        {showDropdown && searchResults.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                            className="absolute z-20 left-0 right-0 mt-2 rounded-2xl border border-border/30 bg-card shadow-xl overflow-hidden max-h-72 overflow-y-auto"
                          >
                            {searchResults.map(enhet => (
                              <button
                                key={enhet.organisasjonsnummer}
                                type="button"
                                onClick={() => selectCompany(enhet)}
                                className="w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-muted/40 transition border-b border-border/10 last:border-0"
                              >
                                <Building2 size={15} className="text-primary shrink-0 mt-0.5" />
                                <div className="min-w-0">
                                  <p className="text-sm font-medium truncate">{enhet.navn}</p>
                                  <p className="text-[11px] text-muted-foreground">
                                    Org.nr {enhet.organisasjonsnummer}
                                    {enhet.organisasjonsform?.beskrivelse && ` · ${enhet.organisasjonsform.beskrivelse}`}
                                    {typeof enhet.antallAnsatte === "number" && ` · ${enhet.antallAnsatte} ansatte`}
                                  </p>
                                </div>
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {selectedCompany && (
                      <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 flex items-start gap-3">
                        <CheckCircle2 size={15} className="text-primary shrink-0 mt-0.5" />
                        <div className="text-xs">
                          <p className="font-medium text-foreground">{selectedCompany.navn}</p>
                          <p className="text-muted-foreground">
                            Org.nr {selectedCompany.organisasjonsnummer}
                            {selectedCompany.organisasjonsform?.beskrivelse && ` · ${selectedCompany.organisasjonsform.beskrivelse}`}
                            {typeof selectedCompany.antallAnsatte === "number" && ` · ${selectedCompany.antallAnsatte} ansatte`}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Størrelse</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {sizes.map(s => (
                        <button key={s} onClick={() => setSize(s)}
                          className={`p-3 rounded-xl border text-xs font-medium transition ${size === s ? "border-primary bg-primary/5" : "border-border/20 hover:border-primary/40"}`}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{quiz?.statusLabel}</p>
                    <div className={`grid gap-2 ${(quiz?.statusOptions.length || 3) > 3 ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-3"}`}>
                      {quiz?.statusOptions.map(o => (
                        <button key={o} onClick={() => setCurrentStatus(o)}
                          className={`p-3 rounded-xl border text-xs font-medium transition ${currentStatus === o ? "border-primary bg-primary/5" : "border-border/20 hover:border-primary/40"}`}>
                          {o}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}


              {step === 2 && (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-widest text-primary">Spørsmål 3 av 4</p>
                    <h1 className="text-2xl md:text-3xl font-semibold">{quiz?.goalLabel || "Hva er målet?"}</h1>
                    <p className="text-sm text-muted-foreground">Hjelper rådgiveren forberede seg.</p>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {quiz?.goals.map(g => (
                      <button key={g} onClick={() => setGoal(g)}
                        className={`text-left p-4 rounded-2xl border transition ${goal === g ? "border-primary bg-primary/5" : "border-border/20 hover:border-primary/40"}`}>
                        <p className="text-sm font-medium">{g}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-widest text-primary">Spørsmål 4 av 4</p>
                    <h1 className="text-2xl md:text-3xl font-semibold">Velg tidspunkt</h1>
                    <p className="text-sm text-muted-foreground">30 minutter på Teams – uforpliktende.</p>
                  </div>

                  {loadingCal ? (
                    <div className="text-center text-sm text-muted-foreground py-10">Laster ledige tider…</div>
                  ) : advisors.length === 0 ? (
                    <div className="text-center text-sm text-muted-foreground py-10">Ingen ledige tider akkurat nå. <Link to="/kontakt" className="text-primary underline">Send oss en melding</Link> så finner vi tid.</div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <button type="button" onClick={() => setWeekStart(addDays(weekStart, -7))} className="p-2 rounded-lg hover:bg-muted/40 transition" aria-label="Forrige uke">
                          <ChevronLeft size={16} />
                        </button>
                        <p className="text-xs text-muted-foreground">{format(weekDays[0], "d. MMM", { locale: nb })} – {format(weekDays[6], "d. MMM", { locale: nb })}</p>
                        <button type="button" onClick={() => setWeekStart(addDays(weekStart, 7))} className="p-2 rounded-lg hover:bg-muted/40 transition" aria-label="Neste uke">
                          <ChevronRight size={16} />
                        </button>
                      </div>

                      <div className="grid grid-cols-7 gap-1.5">
                        {weekDays.map(d => {
                          const hasSlots = getSlots(d).length > 0;
                          const isSel = selectedDate && isSameDay(d, selectedDate);
                          return (
                            <button key={d.toISOString()} type="button"
                              disabled={!hasSlots}
                              onClick={() => { setSelectedDate(d); setSelectedTime(null); setSelectedAdvisor(null); }}
                              className={`flex flex-col items-center py-3 rounded-xl border text-xs transition ${isSel ? "border-primary bg-primary/10" : hasSlots ? "border-border/20 hover:border-primary/40" : "border-border/10 opacity-30 cursor-not-allowed"}`}>
                              <span className="uppercase tracking-wider text-[10px] text-muted-foreground">{format(d, "EEE", { locale: nb })}</span>
                              <span className="text-base font-semibold">{format(d, "d")}</span>
                            </button>
                          );
                        })}
                      </div>

                      {selectedDate && (
                        <div className="space-y-2">
                          <p className="text-xs text-muted-foreground"><Clock size={12} className="inline mr-1" /> Ledige tider {format(selectedDate, "EEEE d. MMMM", { locale: nb })}</p>
                          {slots.length === 0 ? (
                            <p className="text-sm text-muted-foreground py-4 text-center">Ingen ledige tider denne dagen.</p>
                          ) : (
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                              {slots.map(s => {
                                const active = selectedTime === s.time;
                                return (
                                  <button key={s.time} type="button"
                                    onClick={() => { setSelectedTime(s.time); setSelectedAdvisor(s.advisorIds[0]); }}
                                    className={`p-2.5 rounded-lg border text-sm font-medium transition ${active ? "border-primary bg-primary text-primary-foreground" : "border-border/20 hover:border-primary/40"}`}>
                                    {s.time}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {step === 4 && (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-widest text-primary">Siste steg</p>
                    <h1 className="text-2xl md:text-3xl font-semibold">Dine kontaktdetaljer</h1>
                    <p className="text-sm text-muted-foreground">
                      <CalIcon size={12} className="inline mr-1" />
                      {selectedDate && format(selectedDate, "EEEE d. MMMM", { locale: nb })} kl. {selectedTime}
                    </p>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <input aria-label="Bedriftsnavn" required value={form.firma} onChange={e => setForm({ ...form, firma: e.target.value })} placeholder="Bedriftsnavn" className={inputClass} />
                    <input aria-label="Navn" required value={form.navn} onChange={e => setForm({ ...form, navn: e.target.value })} placeholder="Ditt navn" className={inputClass} />
                    <input aria-label="E-post" type="email" required value={form.epost} onChange={e => setForm({ ...form, epost: e.target.value })} placeholder="E-post" className={inputClass} />
                    <input aria-label="Telefon" required value={form.telefon} onChange={e => setForm({ ...form, telefon: e.target.value })} placeholder="Telefon" className={inputClass} />
                  </div>
                  <textarea aria-label="Melding" value={form.melding} onChange={e => setForm({ ...form, melding: e.target.value })} placeholder="Noe rådgiveren bør vite på forhånd? (valgfritt)" rows={3} className={`${inputClass} h-auto py-3`} />
                  <p className="flex items-center gap-2 text-[11px] text-muted-foreground"><ShieldCheck size={12} /> Vi behandler dine opplysninger trygt. Aldri spam.</p>
                  <button type="submit" disabled={submitting} className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2">
                    {submitting ? "Sender…" : <>Bekreft møte <ArrowRight size={16} /></>}
                  </button>
                </form>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Footer nav */}
          {step < 4 && (
            <div className="mt-6 flex items-center justify-between">
              <button onClick={() => step === 0 ? navigate(-1) : setStep(step - 1)}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition">
                <ChevronLeft size={16} /> {step === 0 ? "Avbryt" : "Tilbake"}
              </button>
              <button onClick={() => setStep(step + 1)} disabled={!canNext()}
                className="flex items-center gap-2 h-11 px-6 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition disabled:opacity-40">
                Neste <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default BookMote;
