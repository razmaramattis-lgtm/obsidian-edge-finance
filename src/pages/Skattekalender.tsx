import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  CalendarClock, ExternalLink, ChevronLeft, ChevronRight,
  AlertTriangle, RefreshCw, Filter, Building2, User, Users,
  Receipt, Landmark, FileText, Shield, ArrowRight
} from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { supabase } from "@/integrations/supabase/client";

type CompanyType = "as" | "enk" | "arbeidsgiver";
type Category = "mva" | "skatt" | "arbeidsgiver" | "tredjepartsopplysninger" | "saravgift" | "regnskap";

const TYPE_META: Record<CompanyType, { label: string; icon: typeof Building2 }> = {
  as: { label: "AS", icon: Building2 },
  enk: { label: "ENK", icon: User },
  arbeidsgiver: { label: "Arbeidsgiver", icon: Users },
};

const CAT_META: Record<Category, { label: string; icon: typeof Receipt; color: string }> = {
  mva: { label: "MVA", icon: Receipt, color: "text-teal-400" },
  skatt: { label: "Skatt", icon: Landmark, color: "text-primary" },
  arbeidsgiver: { label: "Arbeidsgiver", icon: Users, color: "text-blue-400" },
  tredjepartsopplysninger: { label: "Tredjepartsopplysninger", icon: FileText, color: "text-amber-400" },
  saravgift: { label: "Særavgift", icon: Shield, color: "text-purple-400" },
  regnskap: { label: "Regnskap", icon: FileText, color: "text-emerald-400" },
};

interface Deadline {
  date: string;
  day: number;
  month: string;
  year: number;
  title: string;
  url: string;
  description?: string;
  types: CompanyType[];
  category: Category;
}

const MONTH_NAMES = [
  "Januar", "Februar", "Mars", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Desember",
];

const DAY_NAMES = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];

const daysUntil = (dateStr: string) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(dateStr + "T00:00:00");
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
};

const Skattekalender = () => {
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTypes, setActiveTypes] = useState<CompanyType[]>([]);
  const [activeCategories, setActiveCategories] = useState<Category[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const now = new Date();
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [viewYear, setViewYear] = useState(now.getFullYear());

  const toggleType = (type: CompanyType) =>
    setActiveTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);

  const toggleCategory = (cat: Category) =>
    setActiveCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);

  const fetchDeadlines = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("tax-deadlines", {
        body: { all: true, types: activeTypes, categories: activeCategories },
      });
      if (fnError) throw new Error(fnError.message);
      setDeadlines(data?.deadlines || []);
    } catch {
      setError("Kunne ikke hente frister");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDeadlines(); }, [activeTypes, activeCategories]);

  // Group deadlines by date
  const deadlinesByDate = useMemo(() => {
    const map: Record<string, Deadline[]> = {};
    deadlines.forEach(d => {
      if (!map[d.date]) map[d.date] = [];
      map[d.date].push(d);
    });
    return map;
  }, [deadlines]);

  // Deadlines for current view month
  const monthDeadlines = useMemo(() =>
    deadlines.filter(d => {
      const dt = new Date(d.date + "T00:00:00");
      return dt.getMonth() === viewMonth && dt.getFullYear() === viewYear;
    }),
    [deadlines, viewMonth, viewYear]
  );

  // Calendar grid
  const calendarDays = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1);
    let startDow = firstDay.getDay(); // 0=Sun
    startDow = startDow === 0 ? 6 : startDow - 1; // convert to Mon=0

    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const cells: (number | null)[] = [];

    for (let i = 0; i < startDow; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);

    return cells;
  }, [viewMonth, viewYear]);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };
  const goToday = () => { setViewMonth(now.getMonth()); setViewYear(now.getFullYear()); };

  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
  };

  const getDateStr = (day: number) => {
    const m = String(viewMonth + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    return `${viewYear}-${m}-${d}`;
  };

  // Selected day deadlines
  const selectedDeadlines = selectedDate ? (deadlinesByDate[selectedDate] || []) : [];

  return (
    <>
      <Helmet>
        <title>Skatteetatens kalender – Alle frister for næringsdrivende</title>
        <meta name="description" content="Komplett oversikt over skattefrister, mva-frister og innleveringsfrister for AS, ENK og arbeidsgivere. Alltid oppdatert fra Skatteetaten." />
      </Helmet>

      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-secondary/5 rounded-full blur-[100px]" />

        <div className="container mx-auto px-6 relative">
          <AnimatedSection>
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 mb-4">
                <CalendarClock size={18} className="text-primary" />
                <span className="text-xs tracking-[0.2em] uppercase text-primary font-medium">Skatteetatens kalender</span>
              </div>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-[1.1] mb-4">
                Aldri gå glipp av en <span className="text-primary">frist</span>
              </h1>
              <p className="text-muted-foreground text-sm md:text-base max-w-xl leading-relaxed">
                Komplett oversikt over alle frister fra Skatteetaten – for aksjeselskap, enkeltpersonforetak og arbeidsgivere.
                Filtrer på din selskapstype og se kun det som er relevant for deg.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Main content */}
      <section className="pb-24">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-[1fr_380px] gap-8">

            {/* Left – Calendar */}
            <AnimatedSection delay={0.1}>
              <div className="glass rounded-3xl border border-border/20 p-6 md:p-8">
                {/* Month nav */}
                <div className="flex items-center justify-between mb-6">
                  <button onClick={prevMonth} className="p-2 rounded-xl hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground">
                    <ChevronLeft size={18} />
                  </button>
                  <div className="text-center">
                    <h2 className="font-display text-xl font-medium">
                      {MONTH_NAMES[viewMonth]} {viewYear}
                    </h2>
                    <button onClick={goToday} className="text-[10px] tracking-wider uppercase text-primary/60 hover:text-primary transition-colors mt-0.5">
                      I dag
                    </button>
                  </div>
                  <button onClick={nextMonth} className="p-2 rounded-xl hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground">
                    <ChevronRight size={18} />
                  </button>
                </div>

                {/* Day headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {DAY_NAMES.map(d => (
                    <div key={d} className="text-center text-[10px] tracking-wider uppercase text-muted-foreground/50 py-1">
                      {d}
                    </div>
                  ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, i) => {
                    if (day === null) return <div key={`empty-${i}`} />;

                    const dateStr = getDateStr(day);
                    const dayDeadlines = deadlinesByDate[dateStr] || [];
                    const hasDeadlines = dayDeadlines.length > 0;
                    const today = isToday(day);
                    const isSelected = selectedDate === dateStr;
                    const hasUrgent = dayDeadlines.some(d => daysUntil(d.date) <= 7 && daysUntil(d.date) >= 0);
                    const isPast = daysUntil(dateStr) < 0;

                    return (
                      <motion.button
                        key={dateStr}
                        onClick={() => hasDeadlines ? setSelectedDate(isSelected ? null : dateStr) : null}
                        whileHover={hasDeadlines ? { scale: 1.08 } : {}}
                        whileTap={hasDeadlines ? { scale: 0.95 } : {}}
                        className={`
                          relative aspect-square rounded-xl flex flex-col items-center justify-center transition-all
                          ${hasDeadlines ? "cursor-pointer" : "cursor-default"}
                          ${isSelected ? "bg-primary/20 border-primary/40 border ring-1 ring-primary/20" : ""}
                          ${today && !isSelected ? "border border-primary/30" : ""}
                          ${hasUrgent && !isSelected ? "bg-destructive/10" : ""}
                          ${hasDeadlines && !isSelected && !hasUrgent ? "bg-muted/30 hover:bg-muted/60" : ""}
                          ${isPast ? "opacity-40" : ""}
                        `}
                      >
                        <span className={`text-sm font-medium leading-none ${today ? "text-primary" : ""} ${isSelected ? "text-primary" : ""}`}>
                          {day}
                        </span>
                        {hasDeadlines && (
                          <div className="flex gap-0.5 mt-1">
                            {dayDeadlines.slice(0, 3).map((_, idx) => (
                              <div
                                key={idx}
                                className={`w-1 h-1 rounded-full ${hasUrgent ? "bg-destructive" : "bg-primary/60"}`}
                              />
                            ))}
                            {dayDeadlines.length > 3 && (
                              <span className="text-[7px] text-muted-foreground/60 leading-none ml-0.5">+</span>
                            )}
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Selected date details */}
                <AnimatePresence mode="wait">
                  {selectedDate && selectedDeadlines.length > 0 && (
                    <motion.div
                      key={selectedDate}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-6 pt-6 border-t border-border/20 space-y-2 overflow-hidden"
                    >
                      <p className="text-xs text-muted-foreground mb-3">
                        {selectedDeadlines.length} frist{selectedDeadlines.length !== 1 ? "er" : ""} den{" "}
                        <span className="text-foreground font-medium">
                          {new Date(selectedDate + "T00:00:00").toLocaleDateString("nb-NO", { day: "numeric", month: "long" })}
                        </span>
                      </p>
                      {selectedDeadlines.map((d, idx) => {
                        const CatIcon = CAT_META[d.category]?.icon || FileText;
                        return (
                          <motion.a
                            key={idx}
                            href={d.url}
                            target="_blank"
                            rel="noreferrer"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="flex items-start gap-3 rounded-xl px-4 py-3 hover:bg-muted/40 transition-all group"
                          >
                            <div className={`mt-0.5 ${CAT_META[d.category]?.color || "text-primary"}`}>
                              <CatIcon size={14} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium leading-snug group-hover:text-primary transition-colors">{d.title}</p>
                              {d.description && (
                                <p className="text-[10px] text-muted-foreground/60 mt-0.5 line-clamp-2">{d.description}</p>
                              )}
                              <div className="flex gap-1.5 mt-1.5">
                                {d.types.map(t => (
                                  <span key={t} className="text-[8px] px-1.5 py-0.5 rounded-full bg-muted/50 text-muted-foreground">
                                    {TYPE_META[t].label}
                                  </span>
                                ))}
                                <span className={`text-[8px] px-1.5 py-0.5 rounded-full bg-muted/50 ${CAT_META[d.category]?.color || ""}`}>
                                  {CAT_META[d.category]?.label}
                                </span>
                              </div>
                            </div>
                            <ExternalLink size={11} className="text-muted-foreground/30 group-hover:text-primary shrink-0 mt-1 transition-colors" />
                          </motion.a>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Legend */}
                <div className="mt-6 pt-4 border-t border-border/10 flex flex-wrap gap-4 text-[9px] text-muted-foreground/50">
                  <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-primary/60" /> Frist</div>
                  <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-destructive" /> Haster (&lt;7 dager)</div>
                  <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded border border-primary/30" /> I dag</div>
                </div>
              </div>
            </AnimatedSection>

            {/* Right sidebar */}
            <div className="space-y-6">
              {/* Filters */}
              <AnimatedSection delay={0.2}>
                <div className="glass rounded-2xl border border-border/20 p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Filter size={13} className="text-primary" />
                    <h3 className="text-xs font-medium tracking-wider uppercase">Filtre</h3>
                  </div>

                  <p className="text-[10px] text-muted-foreground/60 mb-2 uppercase tracking-wider">Selskapstype</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {(Object.keys(TYPE_META) as CompanyType[]).map(type => {
                      const meta = TYPE_META[type];
                      const Icon = meta.icon;
                      const active = activeTypes.includes(type);
                      return (
                        <button
                          key={type}
                          onClick={() => toggleType(type)}
                          className={`flex items-center gap-1.5 text-[10px] px-3 py-1.5 rounded-full border transition-all ${
                            active
                              ? "bg-primary/15 border-primary/30 text-primary font-medium"
                              : "bg-muted/20 border-border/20 text-muted-foreground hover:border-primary/20"
                          }`}
                        >
                          <Icon size={10} />
                          {meta.label}
                        </button>
                      );
                    })}
                  </div>

                  <p className="text-[10px] text-muted-foreground/60 mb-2 uppercase tracking-wider">Kategori</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(Object.keys(CAT_META) as Category[]).map(cat => {
                      const meta = CAT_META[cat];
                      const active = activeCategories.includes(cat);
                      return (
                        <button
                          key={cat}
                          onClick={() => toggleCategory(cat)}
                          className={`text-[10px] px-3 py-1.5 rounded-full border transition-all ${
                            active
                              ? "bg-primary/15 border-primary/30 text-primary font-medium"
                              : "bg-muted/20 border-border/20 text-muted-foreground hover:border-primary/20"
                          }`}
                        >
                          {meta.label}
                        </button>
                      );
                    })}
                  </div>

                  {(activeTypes.length > 0 || activeCategories.length > 0) && (
                    <button
                      onClick={() => { setActiveTypes([]); setActiveCategories([]); }}
                      className="mt-3 text-[10px] text-primary/60 hover:text-primary transition-colors"
                    >
                      Nullstill filtre
                    </button>
                  )}
                </div>
              </AnimatedSection>

              {/* Upcoming list */}
              <AnimatedSection delay={0.3}>
                <div className="glass rounded-2xl border border-border/20 p-5">
                  <h3 className="text-xs font-medium tracking-wider uppercase mb-4 flex items-center gap-2">
                    <CalendarClock size={13} className="text-primary" />
                    Kommende frister
                  </h3>

                  {loading ? (
                    <div className="space-y-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="h-12 bg-muted/30 rounded-xl animate-pulse" />
                      ))}
                    </div>
                  ) : error ? (
                    <div className="flex items-center gap-2 text-muted-foreground text-xs">
                      <AlertTriangle size={14} />
                      <span>{error}</span>
                      <button onClick={fetchDeadlines} className="ml-auto text-primary"><RefreshCw size={13} /></button>
                    </div>
                  ) : (
                    <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
                      {monthDeadlines.length === 0 ? (
                        <p className="text-xs text-muted-foreground/60 text-center py-4">Ingen frister denne måneden</p>
                      ) : monthDeadlines.map((d, i) => {
                        const days = daysUntil(d.date);
                        const isUrgent = days >= 0 && days <= 7;

                        return (
                          <motion.a
                            key={`${d.date}-${i}`}
                            href={d.url}
                            target="_blank"
                            rel="noreferrer"
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.03 }}
                            onMouseEnter={() => setSelectedDate(d.date)}
                            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 group hover:bg-muted/40 transition-all ${
                              isUrgent ? "border border-destructive/20 bg-destructive/5" : ""
                            }`}
                          >
                            <div className={`w-9 h-9 rounded-lg flex flex-col items-center justify-center shrink-0 ${
                              isUrgent ? "bg-destructive/15 text-destructive" : "bg-muted/50 text-muted-foreground"
                            }`}>
                              <span className="text-xs font-bold leading-none">{d.day}</span>
                              <span className="text-[7px] uppercase tracking-wider leading-none mt-0.5">
                                {d.month.substring(0, 3)}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[11px] leading-snug line-clamp-1 group-hover:text-primary transition-colors">
                                {d.title}
                              </p>
                              <p className={`text-[9px] mt-0.5 ${isUrgent ? "text-destructive font-medium" : "text-muted-foreground/50"}`}>
                                {days === 0 ? "I dag!" : days === 1 ? "I morgen" : days < 0 ? "Passert" : `om ${days} dager`}
                              </p>
                            </div>
                            <ArrowRight size={10} className="text-muted-foreground/20 group-hover:text-primary shrink-0 transition-colors" />
                          </motion.a>
                        );
                      })}
                    </div>
                  )}
                </div>
              </AnimatedSection>

              {/* Source */}
              <AnimatedSection delay={0.4}>
                <a
                  href="https://www.skatteetaten.no/bedrift-og-organisasjon/starte-og-drive/frister-gebyrer-og-tilleggsskatt/frister-og-oppgaver/"
                  target="_blank"
                  rel="noreferrer"
                  className="glass rounded-2xl border border-border/20 p-4 flex items-center gap-3 hover:border-primary/20 transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <ExternalLink size={14} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-[11px] font-medium group-hover:text-primary transition-colors">Skatteetaten.no</p>
                    <p className="text-[9px] text-muted-foreground/50">Kilde for alle frister og oppgaver</p>
                  </div>
                </a>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Skattekalender;
