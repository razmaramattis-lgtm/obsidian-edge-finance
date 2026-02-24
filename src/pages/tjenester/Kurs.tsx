import { Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, ArrowLeft, CheckCircle2, ChevronRight, Phone,
  BookOpen, GraduationCap, Award, Users, Clock,
  FileText, Calculator, Scale, Receipt, Landmark, Building2,
  Shield, BarChart3, Briefcase, Target, Zap,
  ChevronDown, X, Search, Filter, Brain, Cpu, Globe, ShoppingCart,
  Megaphone, Wrench, TrendingUp, Lightbulb, HeartHandshake
} from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import ambientTexture1 from "@/assets/ambient-texture-1.jpg";
import { useSection } from "@/contexts/SectionContext";
import { sectionKursCategories } from "@/config/sectionContent";

/* ───────── Kategori-ikoner ───────── */
const categoryConfig: Record<string, { icon: React.ElementType; color: string }> = {
  "Bokføring": { icon: BookOpen, color: "from-blue-500/20 to-indigo-500/20" },
  "MVA": { icon: Receipt, color: "from-emerald-500/20 to-teal-500/20" },
  "Skatt & Skattelov": { icon: Scale, color: "from-amber-500/20 to-orange-500/20" },
  "Årsregnskap": { icon: FileText, color: "from-violet-500/20 to-purple-500/20" },
  "Lønn & Personal": { icon: Calculator, color: "from-pink-500/20 to-rose-500/20" },
  "HR & Personal": { icon: HeartHandshake, color: "from-rose-500/20 to-pink-500/20" },
  "HMS": { icon: Shield, color: "from-red-500/20 to-orange-500/20" },
  "Markedsføring": { icon: Megaphone, color: "from-fuchsia-500/20 to-pink-500/20" },
  "AI & Automatisering": { icon: Brain, color: "from-cyan-500/20 to-blue-500/20" },
  "Integrasjon & Teknologi": { icon: Cpu, color: "from-sky-500/20 to-indigo-500/20" },
  "Nettside & Web": { icon: Globe, color: "from-teal-500/20 to-emerald-500/20" },
  "Nettbutikk & E-handel": { icon: ShoppingCart, color: "from-orange-500/20 to-amber-500/20" },
  "Selskapsrett": { icon: Building2, color: "from-slate-500/20 to-gray-500/20" },
  "Analyse & Rapportering": { icon: BarChart3, color: "from-indigo-500/20 to-violet-500/20" },
  "Ledelse & Strategi": { icon: Lightbulb, color: "from-yellow-500/20 to-amber-500/20" },
};

interface Course {
  id: string;
  name: string;
  description: string | null;
  category: string;
  slug: string | null;
  coming_soon: boolean;
  has_certificate: boolean;
}

/* ───────── Hvem passer kursene for ───────── */
const audiences = [
  { icon: Building2, title: "Gründere & Oppstartsbedrifter", desc: "Lær regnskapet fra dag én. Forstå hva du må levere, når det skal leveres — og hvordan du unngår de vanligste feilene." },
  { icon: Users, title: "Daglige ledere & Styremedlemmer", desc: "Forstå tallene i selskapet ditt. Ta bedre beslutninger basert på resultatregnskap, likviditet og skatteposisjon." },
  { icon: Briefcase, title: "Økonomiansvarlige & Regnskapsmedarbeidere", desc: "Oppdater kunnskapen. Lær avanserte emner som periodisering, konsernregnskap og skatteoptimalisering." },
  { icon: GraduationCap, title: "Studenter & Karriereskiftere", desc: "Bygg en solid base. Kursbevis fra Avargo gir et fortrinn i arbeidsmarkedet og praktisk kompetanse fra dag én." },
];

const RelatedServices = [
  { label: "Dedikert regnskapsfører", href: "/tjenester/regnskapsforer" },
  { label: "CFO-as-a-Service", href: "/tjenester/cfo" },
  { label: "AI-drevet finansiell innsikt", href: "/tjenester/ai-innsikt" },
  { label: "Lønn & HR", href: "/tjenester/hr-og-lonn" },
];

/* ───────── Bestillingsskjema modal ───────── */
const BookingModal = ({ course, onClose }: { course: Course | null; onClose: () => void }) => {
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  if (!course) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await supabase.functions.invoke("contact-submit", {
        body: {
          company_name: `Kursbestilling: ${course.name}`,
          contact_person: form.name,
          email: form.email,
          phone: form.phone,
          message: `Bestilling av kurs: ${course.name} (${course.category})`,
          package: "Kursbestilling",
        },
      });
    } catch (err) {
      console.error("Submit error:", err);
    }
    setSending(false);
    setSubmitted(true);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-lg glass rounded-3xl border border-border/20 p-8 md:p-10"
          onClick={e => e.stopPropagation()}
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors">
            <X size={18} />
          </button>

          {submitted ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={24} className="text-primary" />
              </div>
              <h3 className="font-heading text-2xl mb-2">Bestilling mottatt!</h3>
              <p className="text-sm text-muted-foreground font-light mb-2">Vi kontakter deg innen 24 timer for å avtale tid.</p>
              <p className="text-xs text-muted-foreground">Kurs: <span className="text-foreground">{course.name}</span></p>
              <button onClick={onClose} className="mt-6 px-6 py-2.5 bg-primary text-primary-foreground rounded-full text-sm hover:opacity-90 transition-opacity">Lukk</button>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-[9px] tracking-[0.4em] uppercase text-primary mb-2">Bestill kurs</p>
                <h3 className="font-heading text-xl md:text-2xl mb-1">{course.name}</h3>
                <p className="text-xs text-muted-foreground">{course.category}</p>
                {course.description && <p className="text-sm text-muted-foreground mt-3 font-light leading-relaxed">{course.description}</p>}
              </div>

              <div className="line-accent mb-6" />

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Fullt navn *</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="Ola Nordmann"
                    className="w-full h-11 rounded-xl border border-border/30 bg-muted/20 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Telefon *</label>
                  <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required type="tel" placeholder="+47 XXX XX XXX"
                    className="w-full h-11 rounded-xl border border-border/30 bg-muted/20 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">E-post *</label>
                  <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required type="email" placeholder="ola@firma.no"
                    className="w-full h-11 rounded-xl border border-border/30 bg-muted/20 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all" />
                </div>

                <div className="glass rounded-xl p-3 border border-border/10">
                  <p className="text-xs text-muted-foreground font-light">
                    <span className="text-foreground font-medium">Valgt kurs:</span> {course.name}
                  </p>
                </div>

                <button type="submit" disabled={sending}
                  className="w-full py-3.5 bg-primary text-primary-foreground rounded-full text-sm font-medium tracking-wider glow-rose hover:scale-[1.01] transition-all duration-300 disabled:opacity-50">
                  {sending ? "Sender bestilling…" : "Bestill kurs"}
                </button>
              </form>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ───────── Hovedkomponent ───────── */
const Kurs = () => {
  const [activeCat, setActiveCat] = useState("alle");
  const [search, setSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { section, isInSection } = useSection();

  useEffect(() => {
    const fetchCourses = async () => {
      const { data } = await supabase.from("courses").select("id, name, description, category, slug, coming_soon, has_certificate").eq("active", true).order("category").order("sort_order");
      setCourses((data as Course[]) || []);
      setLoading(false);
    };
    fetchCourses();
  }, []);

  // Filter courses by section categories
  const sectionCourses = useMemo(() => {
    if (!isInSection || !section) return courses;
    const allowed = sectionKursCategories[section.id];
    if (!allowed) return courses;
    return courses.filter(c => allowed.includes(c.category));
  }, [courses, isInSection, section]);

  const allCategories = [...new Set(sectionCourses.map(c => c.category))];
  const categoryButtons = [
    { id: "alle", label: "Alle kurs", icon: BookOpen },
    ...allCategories.map(cat => ({
      id: cat,
      label: cat,
      icon: categoryConfig[cat]?.icon || BookOpen,
    })),
  ];

  const filtered = sectionCourses.filter(c => {
    const matchCat = activeCat === "alle" || c.category === activeCat;
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.description || "").toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  // Group by category for display
  const groupedFiltered = filtered.reduce((acc, c) => {
    if (!acc[c.category]) acc[c.category] = [];
    acc[c.category].push(c);
    return acc;
  }, {} as Record<string, Course[]>);

  const stats = [
    { value: `${sectionCourses.length}+`, label: "Tilgjengelige kurs" },
    { value: `${allCategories.length}`, label: "Fagområder" },
    { value: "98%", label: "Anbefaler oss" },
    { value: "4.9/5", label: "Gjennomsnittlig rating" },
  ];

  return (
    <>
      <Helmet>
        <title>{`Kurs — ${sectionCourses.length}+ spesialiserte kurs | Avargo`}</title>
        <meta name="description" content={`Velg blant ${sectionCourses.length}+ spesialiserte kurs innen regnskap, HR, AI, markedsføring og mer.`} />
      </Helmet>

      {/* HERO */}
      <section className="py-28 md:py-44 relative overflow-hidden">
        <img src={ambientTexture1} alt="" aria-hidden="true" loading="eager" className="absolute inset-0 w-full h-full object-cover opacity-[0.08] pointer-events-none select-none" />
        <div className="absolute inset-0 ambient-glow opacity-30" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl"
          >
            <p className="text-[10px] tracking-[0.45em] uppercase text-primary mb-5 md:mb-6">Avargo Akademi · Kurs</p>
            <h1 className="font-heading text-5xl sm:text-6xl md:text-8xl leading-[1.02] mb-8 md:mb-10">
              {sectionCourses.length}+ kurs.{" "}
              <span className="italic text-gradient-rose">Alle fagfelt.</span>
            </h1>
            <p className="text-base md:text-xl text-muted-foreground font-light leading-relaxed max-w-2xl mb-10 md:mb-14">
              Fra regnskap og skatt til AI, markedsføring og ledelse — velg akkurat det kurset du trenger for å ta neste steg.
            </p>
            <a href="#kurs" className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 md:px-10 py-4 bg-primary text-primary-foreground text-sm font-medium tracking-wider rounded-full glow-rose hover:scale-[1.02] transition-all duration-500">
              Se alle kurs
              <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
            </a>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6"><div className="line-accent" /></div>

      {/* Stats */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <AnimatedSection key={s.label} delay={i * 0.08}>
                <div className="text-center">
                  <p className="font-heading text-3xl md:text-4xl text-primary mb-1">{s.value}</p>
                  <p className="text-xs text-muted-foreground tracking-wide uppercase">{s.label}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6"><div className="line-accent" /></div>

      {/* Kurskatalog */}
      <section id="kurs" className="py-24 md:py-40 scroll-mt-20">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection>
            <p className="text-[10px] tracking-[0.4em] uppercase text-secondary mb-5">Kurskatalog</p>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-5 leading-snug max-w-3xl">
              Finn kurset <span className="italic text-gradient-rose">du trenger.</span>
            </h2>
            <p className="text-sm md:text-base text-muted-foreground font-light max-w-xl mb-10">
              Filtrer etter kategori eller søk direkte. Klikk på et kurs for å bestille.
            </p>
          </AnimatedSection>

          {/* Filter & Søk */}
          <div className="mb-8 space-y-4">
            <div className="relative max-w-md">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Søk etter kurs…"
                className="w-full h-11 rounded-full border border-border/20 bg-muted/20 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categoryButtons.map(cat => {
                const CatIcon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCat(cat.id)}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs tracking-wide transition-all duration-300 ${
                      activeCat === cat.id
                        ? "bg-primary text-primary-foreground"
                        : "border border-border/20 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                    }`}
                  >
                    <CatIcon size={12} />
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Resultater */}
          <p className="text-xs text-muted-foreground mb-6">{filtered.length} kurs funnet</p>

          {loading ? (
            <div className="text-center py-16 text-muted-foreground text-sm">Laster kurs…</div>
          ) : activeCat === "alle" ? (
            // Grouped view
            <div className="space-y-10">
              {Object.entries(groupedFiltered).map(([cat, items]) => {
                const conf = categoryConfig[cat] || { icon: BookOpen, color: "from-primary/20 to-primary/10" };
                const CatIcon = conf.icon;
                return (
                  <div key={cat}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${conf.color} border border-border/20 flex items-center justify-center`}>
                        <CatIcon size={16} className="text-foreground/70" strokeWidth={1.5} />
                      </div>
                      <div>
                        <h3 className="text-sm font-heading">{cat}</h3>
                        <p className="text-[10px] text-muted-foreground">{items.length} kurs</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {items.map((course, i) => (
                        <motion.div
                          key={course.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: Math.min(i * 0.02, 0.3) }}
                        >
                          <Link
                            to={course.slug ? `/akademi/kurs/${course.slug}` : "#"}
                            onClick={e => { if (!course.slug) { e.preventDefault(); setSelectedCourse(course); } }}
                            className="group block text-left glass rounded-2xl p-5 border border-border/20 hover:border-primary/30 transition-all duration-300 h-full"
                          >
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <p className="text-sm font-medium group-hover:text-primary transition-colors">{course.name}</p>
                              {course.coming_soon && (
                                <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/20 font-medium">Kommer snart</span>
                              )}
                              {course.has_certificate && (
                                <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 font-medium">Kursbevis</span>
                              )}
                            </div>
                            {course.description && (
                              <p className="text-xs text-muted-foreground font-light leading-relaxed line-clamp-2">{course.description}</p>
                            )}
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // Flat view for single category
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filtered.map((course, i) => {
                const conf = categoryConfig[course.category] || { icon: BookOpen, color: "from-primary/20 to-primary/10" };
                const CatIcon = conf.icon;
                return (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: Math.min(i * 0.02, 0.4) }}
                  >
                    <Link
                      to={course.slug ? `/akademi/kurs/${course.slug}` : "#"}
                      onClick={e => { if (!course.slug) { e.preventDefault(); setSelectedCourse(course); } }}
                      className="group block text-left glass rounded-2xl p-5 border border-border/20 hover:border-primary/30 transition-all duration-300 h-full"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${conf.color} border border-border/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                          <CatIcon size={14} className="text-foreground/70" strokeWidth={1.5} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <p className="text-sm font-medium group-hover:text-primary transition-colors">{course.name}</p>
                            {course.coming_soon && (
                              <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/20 font-medium">Kommer snart</span>
                            )}
                            {course.has_certificate && (
                              <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 font-medium">Kursbevis</span>
                            )}
                          </div>
                          {course.description && (
                            <p className="text-xs text-muted-foreground font-light leading-relaxed line-clamp-2">{course.description}</p>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}

          {filtered.length === 0 && !loading && (
            <div className="text-center py-16">
              <Filter size={28} className="mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-sm text-muted-foreground">Ingen kurs funnet. Prøv et annet søk eller kategori.</p>
            </div>
          )}
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6"><div className="line-accent" /></div>

      {/* Hvem passer kursene for */}
      <section className="py-24 md:py-40 relative">
        <div className="absolute inset-0 ambient-glow opacity-15" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <AnimatedSection>
            <p className="text-[10px] tracking-[0.4em] uppercase text-secondary mb-5 md:mb-6">Hvem passer kursene for</p>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-14 md:mb-20 max-w-2xl leading-snug">
              Uansett hvor du er i <span className="italic text-gradient-rose">reisen.</span>
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            {audiences.map((a, i) => (
              <AnimatedSection key={a.title} delay={i * 0.1}>
                <div className="p-8 md:p-10 glass rounded-3xl card-lift h-full">
                  <div className="w-11 h-11 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                    <a.icon size={18} className="text-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-heading text-xl md:text-2xl mb-3">{a.title}</h3>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed">{a.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Hva gjør kursene unike */}
      <section className="py-24 md:py-40">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-14 md:gap-24 items-start">
            <AnimatedSection>
              <p className="text-[10px] tracking-[0.4em] uppercase text-secondary mb-5">Hvorfor Avargo-kurs</p>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-6 leading-snug">
                Ikke teori på PowerPoint — <span className="italic text-gradient-rose">praksis som sitter.</span>
              </h2>
              <p className="text-muted-foreground font-light leading-relaxed text-sm md:text-base">
                Våre kursholdere er spesialister som jobber med dette hver eneste dag. Ingen akademisk avstand — men direkte, anvendbar kunnskap hentet fra reell praksis.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.15}>
              <ul className="space-y-4">
                {[
                  { icon: Target, text: "Praktiske caser hentet fra norsk næringsliv" },
                  { icon: Shield, text: "Oppdatert etter siste lovendringer" },
                  { icon: Award, text: "Kursbevis anerkjent av bransjen" },
                  { icon: Zap, text: "Små grupper — personlig oppfølging" },
                  { icon: BarChart3, text: "Fra teori til implementering i eget selskap" },
                  { icon: Users, text: "Nettverksbygging med andre næringsdrivende" },
                ].map(item => (
                  <li key={item.text} className="flex items-start gap-4 p-4 glass rounded-2xl border border-border/10">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <item.icon size={16} className="text-primary" strokeWidth={1.5} />
                    </div>
                    <span className="text-sm font-light text-foreground/80 pt-1.5">{item.text}</span>
                  </li>
                ))}
              </ul>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="py-20 md:py-28 border-t border-border/10">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection>
            <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground/50 mb-8">Relaterte tjenester</p>
            <div className="flex flex-wrap gap-3">
              {RelatedServices.map(s => (
                <Link key={s.href} to={s.href} className="inline-flex items-center gap-2 px-5 py-2.5 text-[12px] tracking-wide text-muted-foreground border border-border/20 rounded-full hover:border-primary/30 hover:text-foreground transition-all duration-300">
                  {s.label}
                  <ChevronRight size={11} className="text-primary/40" />
                </Link>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 border-t border-border/10 text-center relative">
        <div className="absolute inset-0 ambient-glow opacity-25" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <AnimatedSection>
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-8">
              <GraduationCap size={18} className="text-primary" strokeWidth={1.5} />
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-5 leading-snug max-w-2xl mx-auto">
              Klar for å ta kontroll?
            </h2>
            <p className="text-muted-foreground font-light mb-10 max-w-md mx-auto text-sm">
              Velg blant {courses.length}+ kurs og bestill direkte.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#kurs" className="group inline-flex items-center gap-3 px-10 md:px-12 py-4 md:py-5 bg-primary text-primary-foreground text-sm font-medium tracking-wider rounded-full glow-rose hover:scale-[1.02] transition-all duration-500">
                Se alle kurs
                <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
              </a>
              <a href="tel:+4712345678" className="inline-flex items-center gap-2 px-8 py-4 text-sm text-foreground/50 tracking-wider rounded-full border border-border/20 hover:border-primary/20 hover:text-foreground transition-all">
                <Phone size={14} /> Ring oss direkte
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Booking Modal */}
      {selectedCourse && <BookingModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />}
    </>
  );
};

export default Kurs;
