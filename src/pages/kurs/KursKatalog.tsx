import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, CheckCircle2, X, Search,
  BookOpen, GraduationCap, Award, Users, Clock,
  FileText, Calculator, Scale, Receipt, Building2,
  Shield, BarChart3, Briefcase, Zap,
  Brain, Cpu, Globe, ShoppingCart,
  Megaphone, Lightbulb, HeartHandshake
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import heroImg from "@/assets/kurs-hero.jpg";

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

/* ── Bestillingsskjema modal ── */
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
    } catch (err) { console.error(err); }
    setSending(false);
    setSubmitted(true);
  };

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="relative w-full max-w-lg glass rounded-3xl border border-border/20 p-8 md:p-10" onClick={e => e.stopPropagation()}>
          <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"><X size={18} /></button>
          {submitted ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-center mx-auto mb-6"><CheckCircle2 size={24} className="text-secondary" /></div>
              <h3 className="font-heading text-2xl mb-2">Bestilling mottatt!</h3>
              <p className="text-sm text-muted-foreground font-light mb-2">Vi kontakter deg innen 24 timer.</p>
              <button onClick={onClose} className="mt-6 px-6 py-2.5 bg-secondary text-secondary-foreground rounded-full text-sm hover:opacity-90 transition-opacity">Lukk</button>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-[9px] tracking-[0.4em] uppercase text-secondary mb-2">Bestill kurs</p>
                <h3 className="font-heading text-xl md:text-2xl mb-1">{course.name}</h3>
                <p className="text-xs text-muted-foreground">{course.category}</p>
              </div>
              <div className="line-accent mb-6" />
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Fullt navn *</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="Ola Nordmann" className="w-full h-11 rounded-xl border border-border/30 bg-muted/20 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40 transition-all" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Telefon *</label>
                  <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required type="tel" placeholder="+47 XXX XX XXX" className="w-full h-11 rounded-xl border border-border/30 bg-muted/20 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40 transition-all" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">E-post *</label>
                  <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required type="email" placeholder="ola@firma.no" className="w-full h-11 rounded-xl border border-border/30 bg-muted/20 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40 transition-all" />
                </div>
                <button type="submit" disabled={sending} className="w-full py-3.5 bg-secondary text-secondary-foreground rounded-full text-sm font-medium tracking-wider hover:scale-[1.01] transition-all duration-300 disabled:opacity-50">
                  {sending ? "Sender…" : "Bestill kurs"}
                </button>
              </form>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const KursKatalog = () => {
  const [activeCat, setActiveCat] = useState("alle");
  const [search, setSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("courses").select("id, name, description, category, slug, coming_soon, has_certificate").eq("active", true).order("category").order("sort_order").then(({ data }) => {
      setCourses((data as Course[]) || []);
      setLoading(false);
    });
  }, []);

  const allCategories = [...new Set(courses.map(c => c.category))];
  const categoryButtons = [
    { id: "alle", label: "Alle kurs", icon: BookOpen },
    ...allCategories.map(cat => ({ id: cat, label: cat, icon: categoryConfig[cat]?.icon || BookOpen })),
  ];

  const filtered = courses.filter(c => {
    const matchCat = activeCat === "alle" || c.category === activeCat;
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || (c.description || "").toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const grouped = filtered.reduce((acc, c) => {
    if (!acc[c.category]) acc[c.category] = [];
    acc[c.category].push(c);
    return acc;
  }, {} as Record<string, Course[]>);

  return (
    <>
      <Helmet>
        <title>Kurskatalog — {courses.length}+ kurs | Avargo Kurs</title>
        <meta name="description" content={`Velg blant ${courses.length}+ spesialiserte kurs innen regnskap, HR, AI og markedsføring.`} />
      </Helmet>

      {/* Hero */}
      <section className="py-24 md:py-36 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]"><img src={heroImg} alt="" className="w-full h-full object-cover" /></div>
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <p className="text-[10px] tracking-[0.45em] uppercase text-secondary mb-5">Kurskatalog</p>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-7xl leading-[1.02] mb-6">
              {courses.length}+ kurs. <span className="italic text-gradient-rose">Alle fagfelt.</span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground font-light max-w-2xl">
              Filtrer etter kategori eller søk direkte. Klikk på et kurs for å bestille.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Catalog */}
      <section className="pb-24 md:pb-40">
        <div className="container mx-auto px-4">
          <div className="mb-8 space-y-4">
            <div className="relative max-w-md">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Søk etter kurs…" className="w-full h-11 rounded-full border border-border/20 bg-muted/20 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 transition-all" />
            </div>
            <div className="flex flex-wrap gap-2">
              {categoryButtons.map(cat => {
                const CatIcon = cat.icon;
                return (
                  <button key={cat.id} onClick={() => setActiveCat(cat.id)} className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs tracking-wide transition-all duration-300 ${activeCat === cat.id ? "bg-secondary text-secondary-foreground" : "border border-border/20 text-muted-foreground hover:border-secondary/30 hover:text-foreground"}`}>
                    <CatIcon size={12} />{cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          <p className="text-xs text-muted-foreground mb-6">{filtered.length} kurs funnet</p>

          {loading ? (
            <div className="text-center py-16 text-muted-foreground text-sm">Laster kurs…</div>
          ) : activeCat === "alle" ? (
            <div className="space-y-10">
              {Object.entries(grouped).map(([cat, items]) => {
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
                      {items.map((course) => (
                        <motion.div key={course.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                          <button onClick={() => !course.coming_soon && setSelectedCourse(course)} className={`w-full text-left group p-5 rounded-2xl border border-border/10 bg-muted/5 hover:bg-muted/15 hover:border-secondary/20 transition-all duration-300 ${course.coming_soon ? "opacity-60" : ""}`}>
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <h4 className="text-sm font-medium leading-snug">{course.name}</h4>
                              <div className="flex gap-1.5 shrink-0">
                                {course.has_certificate && <Award size={13} className="text-secondary" />}
                                {course.coming_soon && <Clock size={13} className="text-muted-foreground" />}
                              </div>
                            </div>
                            {course.description && <p className="text-xs text-muted-foreground font-light line-clamp-2">{course.description}</p>}
                            {!course.coming_soon && (
                              <div className="mt-3 flex items-center gap-1.5 text-[11px] text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                                Bestill <ArrowRight size={10} />
                              </div>
                            )}
                            {course.coming_soon && <p className="mt-3 text-[10px] text-muted-foreground italic">Kommer snart</p>}
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filtered.map((course) => (
                <motion.div key={course.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <button onClick={() => !course.coming_soon && setSelectedCourse(course)} className={`w-full text-left group p-5 rounded-2xl border border-border/10 bg-muted/5 hover:bg-muted/15 hover:border-secondary/20 transition-all duration-300 ${course.coming_soon ? "opacity-60" : ""}`}>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="text-sm font-medium leading-snug">{course.name}</h4>
                      <div className="flex gap-1.5 shrink-0">
                        {course.has_certificate && <Award size={13} className="text-secondary" />}
                        {course.coming_soon && <Clock size={13} className="text-muted-foreground" />}
                      </div>
                    </div>
                    {course.description && <p className="text-xs text-muted-foreground font-light line-clamp-2">{course.description}</p>}
                    {!course.coming_soon && (
                      <div className="mt-3 flex items-center gap-1.5 text-[11px] text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                        Bestill <ArrowRight size={10} />
                      </div>
                    )}
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <BookingModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />
    </>
  );
};

export default KursKatalog;
