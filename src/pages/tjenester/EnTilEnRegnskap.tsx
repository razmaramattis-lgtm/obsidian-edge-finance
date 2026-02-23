import { useState, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, ChevronDown, ChevronLeft, ChevronRight, Clock, CheckCircle2, Send, ShieldCheck, User, Phone, Mail, Building2, FileText } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { Link } from "react-router-dom";
import ambientTexture4 from "@/assets/ambient-texture-4.jpg";
import { supabase } from "@/integrations/supabase/client";
import { useSection } from "@/contexts/SectionContext";
import { format, addDays, startOfWeek, isBefore, isToday, isSameDay, startOfDay } from "date-fns";
import { nb } from "date-fns/locale";

interface Availability { profile_id: string; day_of_week: number; start_time: string; end_time: string; }
interface BlockedDate { profile_id: string; blocked_date: string; }
interface ExistingBooking { advisor_id: string; booking_date: string; booking_time: string; status: string; }
interface AdvisorInfo { id: string; name: string; }

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

const EnTilEnRegnskap = () => {
  const { section } = useSection();
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ firma: "", navn: "", telefon: "", epost: "", melding: "" });

  // Calendar state
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedAdvisor, setSelectedAdvisor] = useState<string | null>(null);

  // Data
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [existingBookings, setExistingBookings] = useState<ExistingBooking[]>([]);
  const [advisors, setAdvisors] = useState<AdvisorInfo[]>([]);
  const [calendarLoading, setCalendarLoading] = useState(true);

  useEffect(() => {
    const fetchCalendarData = async () => {
      const [{ data: avail }, { data: blocked }, { data: bookings }, { data: profiles }] = await Promise.all([
        supabase.from("advisor_availability").select("profile_id, day_of_week, start_time, end_time").eq("active", true),
        supabase.from("advisor_blocked_dates").select("profile_id, blocked_date"),
        supabase.from("bookings").select("advisor_id, booking_date, booking_time, status").neq("status", "cancelled"),
        supabase.from("profiles").select("id, name"),
      ]);
      setAvailability((avail as Availability[]) || []);
      setBlockedDates((blocked as BlockedDate[]) || []);
      setExistingBookings((bookings as ExistingBooking[]) || []);
      // Only show advisors that have availability set up
      const advisorIds = new Set((avail || []).map(a => a.profile_id));
      setAdvisors((profiles || []).filter(p => advisorIds.has(p.id)));
      setCalendarLoading(false);
    };
    fetchCalendarData();
  }, []);

  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);

  const getAvailableSlots = (date: Date) => {
    const dow = ((date.getDay() + 6) % 7) + 1; // Convert to 1=Mon matching DB
    const dateStr = format(date, "yyyy-MM-dd");
    const today = startOfDay(new Date());

    if (isBefore(date, today)) return [];

    // Find advisors available on this day who aren't blocked
    const dayAvail = availability.filter(a => a.day_of_week === dow);
    const blockedAdvisorsOnDate = new Set(blockedDates.filter(b => b.blocked_date === dateStr).map(b => b.profile_id));
    const availableAdvisors = dayAvail.filter(a => !blockedAdvisorsOnDate.has(a.profile_id));

    if (availableAdvisors.length === 0) return [];

    // Generate all possible slots across all available advisors
    const slotMap = new Map<string, string[]>(); // time -> advisor_ids
    for (const adv of availableAdvisors) {
      const slots = generateSlots(adv.start_time, adv.end_time);
      for (const slot of slots) {
        // Check if this advisor already has a booking at this time
        const isBooked = existingBookings.some(b =>
          b.advisor_id === adv.profile_id && b.booking_date === dateStr && b.booking_time.slice(0, 5) === slot
        );
        if (!isBooked) {
          if (!slotMap.has(slot)) slotMap.set(slot, []);
          slotMap.get(slot)!.push(adv.profile_id);
        }
      }
    }

    return Array.from(slotMap.entries()).map(([time, advisorIds]) => ({ time, advisorIds })).sort((a, b) => a.time.localeCompare(b.time));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime || !selectedAdvisor) return;
    setSubmitting(true);

    const bookingDate = format(selectedDate, "yyyy-MM-dd");
    const { error } = await supabase.from("bookings").insert({
      advisor_id: selectedAdvisor,
      customer_name: form.navn,
      customer_email: form.epost,
      customer_phone: form.telefon,
      company_name: form.firma,
      message: form.melding || null,
      booking_date: bookingDate,
      booking_time: selectedTime,
      section: section?.id || null,
    } as any);

    // Send booking notification email to advisor
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
              message: form.melding || null,
            },
          },
        });
      } catch (emailErr) {
        console.error("Email notification error:", emailErr);
      }
    }

    setSubmitting(false);
    if (!error) setSubmitted(true);
  };

  const inputClass = "w-full h-11 rounded-xl border border-border/30 bg-muted/30 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-muted-foreground/50";
  const labelClass = "text-xs font-medium text-muted-foreground mb-1 block";

  const selectedSlots = selectedDate ? getAvailableSlots(selectedDate) : [];

  return (
    <>
      <Helmet>
        <title>1-1 Regnskap – Personlig rådgivning | Avargo</title>
        <meta name="description" content="Book en personlig gjennomgang av regnskapet med en statsautorisert rådgiver. Få skreddersydd innsikt og konkrete anbefalinger for din bedrift." />
      </Helmet>

      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-background via-background to-muted/20">
        <img src={ambientTexture4} alt="" aria-hidden="true" loading="eager" className="absolute inset-0 w-full h-full object-cover opacity-[0.06] pointer-events-none select-none" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)", backgroundSize: "40px 40px" }} />
        <div className="container mx-auto px-6 py-24 text-center relative z-10">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-6">
              <ShieldCheck size={14} /> Statsautorisert rådgiver
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              1-1 <span className="text-primary">Regnskap</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Få en personlig gjennomgang av regnskapet ditt med en statsautorisert rådgiver. Konkret, skreddersydd og handlingsrettet.
            </p>
            <button
              onClick={() => {
                setShowForm(true);
                setTimeout(() => document.getElementById("booking-form")?.scrollIntoView({ behavior: "smooth" }), 100);
              }}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity glow-rose"
            >
              Book din time <ChevronDown size={16} />
            </button>
          </AnimatedSection>
        </div>
      </section>

      {/* Hva du får */}
      <section className="py-20 bg-muted/10">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Hva du får i en 1-1 gjennomgang</h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Calculator, title: "Regnskapsanalyse", desc: "Grundig gjennomgang av resultat, balanse og nøkkeltall – med forklaringer du faktisk forstår." },
              { icon: Clock, title: "Dedikert tid", desc: "En hel time kun for deg og din bedrift. Ingen hastverk, ingen standardsvar." },
              { icon: FileText, title: "Handlingsplan", desc: "Du får konkrete anbefalinger og neste steg du kan ta for å forbedre økonomien." },
            ].map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="glass rounded-2xl p-6 border border-border/20 text-center h-full">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="text-primary" size={22} />
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Hvem passer det for */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-3xl">
          <AnimatedSection>
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Hvem passer det for?</h2>
            <div className="space-y-4">
              {[
                "Gründere som vil forstå tallene bak virksomheten sin bedre",
                "Bedriftseiere som ønsker en second opinion på regnskapet",
                "Selskaper i vekst som trenger strategisk økonomisk rådgivning",
                "Deg som har spørsmål til årsoppgjøret eller skattemeldingen",
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="text-primary shrink-0 mt-0.5" size={18} />
                  <p className="text-muted-foreground">{text}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Booking section */}
      <section id="booking-form" className="py-20 bg-muted/10">
        <div className="container mx-auto px-6 max-w-3xl">
          <AnimatePresence mode="wait">
            {!showForm ? (
              <motion.div key="cta" initial={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                <AnimatedSection>
                  <h2 className="text-2xl font-bold mb-4">Klar for en gjennomgang?</h2>
                  <p className="text-muted-foreground mb-6">Velg en ledig tid i kalenderen under, fyll ut skjemaet – og du er klar.</p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity glow-rose"
                  >
                    Vis kalender <ChevronDown size={16} />
                  </button>
                </AnimatedSection>
              </motion.div>
            ) : !submitted ? (
              <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <h2 className="text-2xl font-bold mb-2 text-center">Velg tid og book</h2>
                <p className="text-muted-foreground text-sm text-center mb-8">Velg en ledig dag og tidspunkt, fyll inn dine opplysninger og send.</p>

                {calendarLoading ? (
                  <div className="text-center text-sm text-muted-foreground py-10">Laster kalender…</div>
                ) : (
                  <div className="space-y-6">
                    {/* Week navigation */}
                    <div className="flex items-center justify-between">
                      <button onClick={() => setWeekStart(addDays(weekStart, -7))} className="p-2 rounded-xl hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors">
                        <ChevronLeft size={18} />
                      </button>
                      <span className="text-sm font-medium">
                        {format(weekDays[0], "d. MMM", { locale: nb })} – {format(weekDays[6], "d. MMM yyyy", { locale: nb })}
                      </span>
                      <button onClick={() => setWeekStart(addDays(weekStart, 7))} className="p-2 rounded-xl hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors">
                        <ChevronRight size={18} />
                      </button>
                    </div>

                    {/* Day grid */}
                    <div className="grid grid-cols-7 gap-2">
                      {weekDays.map(day => {
                        const slots = getAvailableSlots(day);
                        const isSelected = selectedDate && isSameDay(day, selectedDate);
                        const isPast = isBefore(day, startOfDay(new Date())) && !isToday(day);
                        const hasSlots = slots.length > 0;

                        return (
                          <button
                            key={day.toISOString()}
                            disabled={isPast || !hasSlots}
                            onClick={() => { setSelectedDate(day); setSelectedTime(null); setSelectedAdvisor(null); }}
                            className={`flex flex-col items-center gap-1 py-3 rounded-xl text-sm transition-all ${
                              isSelected ? "bg-primary text-primary-foreground ring-2 ring-primary/30" :
                              isPast || !hasSlots ? "text-muted-foreground/30 cursor-not-allowed" :
                              "hover:bg-muted/50 text-foreground"
                            }`}
                          >
                            <span className="text-[10px] uppercase">{format(day, "EEE", { locale: nb })}</span>
                            <span className="text-lg font-semibold">{format(day, "d")}</span>
                            {hasSlots && !isPast && (
                              <span className={`text-[9px] ${isSelected ? "text-primary-foreground/70" : "text-primary"}`}>
                                {slots.length} ledig
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Time slots */}
                    {selectedDate && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">
                          Ledige tider {format(selectedDate, "EEEE d. MMMM", { locale: nb })}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {selectedSlots.map(slot => (
                            <button
                              key={slot.time}
                              onClick={() => {
                                setSelectedTime(slot.time);
                                // Auto-assign first available advisor
                                setSelectedAdvisor(slot.advisorIds[0]);
                              }}
                              className={`px-4 py-2 rounded-xl text-sm transition-all ${
                                selectedTime === slot.time
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted/50 hover:bg-muted text-foreground"
                              }`}
                            >
                              {slot.time}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Contact form - shown after time selection */}
                    {selectedTime && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 pt-4 border-t border-border/20">
                        <div className="glass rounded-2xl p-4 border border-primary/20 flex items-center gap-3">
                          <CheckCircle2 className="text-primary shrink-0" size={18} />
                          <p className="text-sm">
                            <span className="font-medium">{format(selectedDate!, "EEEE d. MMMM", { locale: nb })}</span> kl. <span className="font-medium">{selectedTime}</span>
                          </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                          <div>
                            <label className={labelClass}>Firmanavn</label>
                            <div className="relative">
                              <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/40" />
                              <input required value={form.firma} onChange={e => setForm({ ...form, firma: e.target.value })} placeholder="Ditt selskap AS" className={inputClass + " pl-10"} />
                            </div>
                          </div>
                          <div>
                            <label className={labelClass}>Ditt navn</label>
                            <div className="relative">
                              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/40" />
                              <input required value={form.navn} onChange={e => setForm({ ...form, navn: e.target.value })} placeholder="Ola Nordmann" className={inputClass + " pl-10"} />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className={labelClass}>Telefon</label>
                              <div className="relative">
                                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/40" />
                                <input required type="tel" value={form.telefon} onChange={e => setForm({ ...form, telefon: e.target.value })} placeholder="999 99 999" className={inputClass + " pl-10"} />
                              </div>
                            </div>
                            <div>
                              <label className={labelClass}>E-post</label>
                              <div className="relative">
                                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/40" />
                                <input required type="email" value={form.epost} onChange={e => setForm({ ...form, epost: e.target.value })} placeholder="ola@selskap.no" className={inputClass + " pl-10"} />
                              </div>
                            </div>
                          </div>
                          <div>
                            <label className={labelClass}>Hva gjelder henvendelsen?</label>
                            <textarea required value={form.melding} onChange={e => setForm({ ...form, melding: e.target.value })} placeholder="Beskriv kort hva du ønsker å gjennomgå…" rows={4}
                              className="w-full rounded-xl border border-border/30 bg-muted/30 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-muted-foreground/50 resize-none" />
                          </div>
                          <button type="submit" disabled={submitting}
                            className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity glow-rose flex items-center justify-center gap-2 disabled:opacity-50">
                            {submitting ? "Sender…" : "Book time"} <Send size={16} />
                          </button>
                        </form>
                      </motion.div>
                    )}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="text-primary" size={32} />
                </div>
                <h2 className="text-2xl font-bold mb-3">Timen er booket!</h2>
                <p className="text-muted-foreground mb-2">
                  {format(selectedDate!, "EEEE d. MMMM", { locale: nb })} kl. {selectedTime}
                </p>
                <div className="glass rounded-2xl p-5 border border-border/20 mt-6 text-left max-w-sm mx-auto">
                  <p className="text-sm font-medium mb-2">Viktig informasjon:</p>
                  <ul className="text-sm text-muted-foreground space-y-1.5">
                    <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-primary shrink-0 mt-0.5" /> Faktura utstedes når timen er bekreftet</li>
                    <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-primary shrink-0 mt-0.5" /> Betaling må være gjennomført før møtet</li>
                    <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-primary shrink-0 mt-0.5" /> Du mottar bekreftelse og Teams-lenke på e-post</li>
                  </ul>
                </div>
                <Link to="/tjenester" className="inline-block mt-8 text-sm text-primary hover:underline">← Tilbake til tjenester</Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </>
  );
};

export default EnTilEnRegnskap;
