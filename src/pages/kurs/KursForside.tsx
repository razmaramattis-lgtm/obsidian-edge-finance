import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { ArrowRight, BookOpen, Users, Award, Briefcase, GraduationCap, Building2, Zap, CheckCircle2 } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import heroImg from "@/assets/kurs-hero.jpg";
import workshopImg from "@/assets/kurs-workshop.jpg";
import learningImg from "@/assets/kurs-learning.jpg";
import patternImg from "@/assets/kurs-pattern.jpg";

/* ── Animated counter ── */
const AnimatedCounter = ({ target, suffix = "" }: { target: number; suffix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.max(1, Math.ceil(target / 40));
    const id = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(id); }
      else setVal(start);
    }, 30);
    return () => clearInterval(id);
  }, [inView, target]);
  return <span ref={ref}>{val}{suffix}</span>;
};

/* ── Floating particles ── */
const FloatingParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(15)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 rounded-full"
        style={{
          background: i % 3 === 0 ? "hsl(var(--secondary) / 0.5)" : i % 3 === 1 ? "hsl(var(--primary) / 0.3)" : "hsl(var(--foreground) / 0.1)",
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{ y: [0, -40, 0], opacity: [0, 0.7, 0], scale: [0.5, 1.5, 0.5] }}
        transition={{ duration: 5 + Math.random() * 5, repeat: Infinity, delay: Math.random() * 4, ease: "easeInOut" }}
      />
    ))}
  </div>
);

const categories = [
  { icon: BookOpen, title: "Regnskap & Økonomi", desc: "Bokføring, MVA, skatt, årsregnskap og lønn", color: "from-blue-500/20 to-indigo-500/20" },
  { icon: Users, title: "HR & Personal", desc: "Arbeidsrett, HMS, personalledelse og onboarding", color: "from-rose-500/20 to-pink-500/20" },
  { icon: Zap, title: "AI & Teknologi", desc: "Automatisering, integrasjon og digitale verktøy", color: "from-cyan-500/20 to-teal-500/20" },
  { icon: Briefcase, title: "Markedsføring", desc: "Digital strategi, nettside, sosiale medier og SEO", color: "from-amber-500/20 to-orange-500/20" },
  { icon: GraduationCap, title: "Ledelse & Strategi", desc: "Strategisk planlegging, økonomiledelse og vekst", color: "from-violet-500/20 to-purple-500/20" },
  { icon: Building2, title: "Selskapsrett", desc: "Organisering, fusjoner, stiftelse og styrearbeid", color: "from-slate-500/20 to-gray-500/20" },
];

const KursForside = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const [courseCount, setCourseCount] = useState(130);
  const [catCount, setCatCount] = useState(15);

  useEffect(() => {
    supabase.from("courses").select("id, category", { count: "exact" }).eq("active", true).then(({ count, data }) => {
      if (count) setCourseCount(count);
      if (data) setCatCount(new Set(data.map(d => d.category)).size);
    });
  }, []);

  return (
    <>
      <Helmet>
        <title>Avargo Kurs — Kompetanseheving for fremtiden</title>
        <meta name="description" content="Velg blant 130+ spesialiserte kurs innen regnskap, HR, AI, markedsføring og ledelse. Levert av Avargo." />
      </Helmet>

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative h-[90vh] min-h-[600px] flex items-center overflow-hidden">
        <motion.div style={{ scale: heroScale }} className="absolute inset-0">
          <img src={heroImg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
        </motion.div>
        <FloatingParticles />

        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-secondary/20 bg-secondary/5 text-secondary text-[10px] tracking-[0.3em] uppercase mb-8">
              <GraduationCap size={12} /> Avargo Kurs
            </motion.div>

            <h1 className="font-heading text-5xl sm:text-6xl md:text-8xl leading-[1.02] mb-8">
              Lær det du{" "}
              <span className="italic text-gradient-rose">trenger.</span>
            </h1>
            <p className="text-base md:text-xl text-muted-foreground font-light leading-relaxed max-w-xl mb-10">
              {courseCount}+ spesialiserte kurs innen regnskap, HR, AI, markedsføring og ledelse — fra korte minikurs til skreddersydde bedriftsprogram.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/kurs/katalog" className="group inline-flex items-center justify-center gap-3 px-10 py-4 bg-secondary text-secondary-foreground text-sm font-medium tracking-wider rounded-full hover:scale-[1.02] transition-all duration-500 shadow-lg shadow-secondary/20">
                Utforsk kurs
                <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
              </Link>
              <Link to="/kurs/bedriftskurs" className="group inline-flex items-center justify-center gap-3 px-10 py-4 border border-border/20 text-foreground text-sm font-medium tracking-wider rounded-full hover:border-secondary/30 hover:bg-secondary/5 transition-all duration-500">
                Bedriftskurs
                <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── STATS ── */}
      <section className="py-16 md:py-24 relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { val: courseCount, suffix: "+", label: "Tilgjengelige kurs" },
              { val: catCount, suffix: "", label: "Fagområder" },
              { val: 98, suffix: "%", label: "Anbefaler oss" },
              { val: 4, suffix: ".9/5", label: "Gj.snittlig rating" },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <p className="font-heading text-4xl md:text-5xl text-secondary mb-2">
                  {i === 3 ? "4.9/5" : <AnimatedCounter target={s.val} suffix={s.suffix} />}
                </p>
                <p className="text-xs text-muted-foreground tracking-wide uppercase">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4"><div className="line-accent" /></div>

      {/* ── CATEGORIES GRID ── */}
      <section className="py-24 md:py-40 relative">
        <FloatingParticles />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-[10px] tracking-[0.4em] uppercase text-secondary mb-5">Fagområder</p>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-6xl mb-6 leading-snug max-w-3xl">
              Kurs for <span className="italic text-gradient-rose">alle fagfelt.</span>
            </h2>
            <p className="text-sm md:text-lg text-muted-foreground font-light max-w-xl mb-14">
              Fra grunnleggende regnskapskurs til avansert AI og ledelse — vi dekker hele spekteret.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <motion.div
                  key={cat.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link
                    to="/kurs/katalog"
                    className="group block p-8 rounded-3xl border border-border/10 bg-muted/5 hover:bg-muted/15 hover:border-secondary/20 transition-all duration-500"
                  >
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} border border-border/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                      <Icon size={22} className="text-foreground/70" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-heading text-lg mb-2">{cat.title}</h3>
                    <p className="text-sm text-muted-foreground font-light leading-relaxed">{cat.desc}</p>
                    <div className="mt-4 flex items-center gap-2 text-xs text-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Se kurs <ArrowRight size={12} />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── IMAGE BREAK ── */}
      <section className="relative h-[50vh] min-h-[300px] overflow-hidden">
        <motion.div
          initial={{ scale: 1.1 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img src={workshopImg} alt="Workshop" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/20" />
        </motion.div>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
            <p className="text-[10px] tracking-[0.4em] uppercase text-secondary mb-4">Praktisk & interaktivt</p>
            <h2 className="font-heading text-3xl md:text-5xl">Læring som <span className="italic">fungerer.</span></h2>
          </motion.div>
        </div>
      </section>

      {/* ── WHY AVARGO KURS ── */}
      <section className="py-24 md:py-40 relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <p className="text-[10px] tracking-[0.4em] uppercase text-secondary mb-5">Hvorfor Avargo Kurs</p>
              <h2 className="font-heading text-3xl md:text-5xl mb-8 leading-snug">
                Kurs bygget av <span className="italic text-gradient-rose">eksperter.</span>
              </h2>
              <div className="space-y-6">
                {[
                  { title: "Praktisk fokus", desc: "Ingen teori i vakuum. Reelle eksempler og caser fra norsk næringsliv." },
                  { title: "Alltid oppdatert", desc: "Regelverket endres. Våre kurs er alltid oppdatert med gjeldende regler." },
                  { title: "Kursbevis inkludert", desc: "Dokumenter kompetansen. Alle kurs gir kursbevis ved gjennomføring." },
                  { title: "Tilpasset nivå", desc: "Fra nybegynner til avansert — kurset møter deg der du er." },
                ].map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-4"
                  >
                    <CheckCircle2 size={20} className="text-secondary mt-0.5 shrink-0" />
                    <div>
                      <h3 className="font-heading text-base mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground font-light">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="rounded-3xl overflow-hidden">
                <img src={learningImg} alt="Kursopplevelse" className="w-full h-[500px] object-cover" />
              </div>
              <div className="absolute -bottom-6 -left-6 glass rounded-2xl p-6 border border-border/20 max-w-[240px]">
                <p className="font-heading text-3xl text-secondary mb-1"><AnimatedCounter target={courseCount} suffix="+" /></p>
                <p className="text-xs text-muted-foreground">kurs tilgjengelig nå</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── AUDIENCE ── */}
      <section className="py-24 md:py-40 relative">
        <div className="absolute inset-0 opacity-[0.04]">
          <img src={patternImg} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <p className="text-[10px] tracking-[0.4em] uppercase text-secondary mb-5">Hvem passer kursene for?</p>
            <h2 className="font-heading text-3xl md:text-5xl mb-4">
              For <span className="italic text-gradient-rose">alle nivåer.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { icon: Building2, title: "Gründere & oppstartsbedrifter", desc: "Lær regnskapet fra dag én — unngå de vanligste feilene." },
              { icon: Users, title: "Daglige ledere & styremedlemmer", desc: "Forstå tallene og ta bedre beslutninger for bedriften." },
              { icon: Briefcase, title: "Økonomiansvarlige", desc: "Oppdater kunnskapen innen avanserte fagområder." },
              { icon: GraduationCap, title: "Studenter & karriereskiftere", desc: "Bygg en solid base med praktisk kompetanse fra dag én." },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="group p-8 rounded-3xl border border-border/10 bg-muted/5 hover:bg-muted/10 transition-all duration-500"
                >
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <Icon size={20} className="text-secondary" />
                  </div>
                  <h3 className="font-heading text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground font-light">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 md:py-40 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-background to-primary/5" />
        <FloatingParticles />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Award size={32} className="text-secondary mx-auto mb-6" />
            <h2 className="font-heading text-3xl md:text-6xl mb-6 leading-snug">
              Klar for å <span className="italic text-gradient-rose">lære?</span>
            </h2>
            <p className="text-muted-foreground font-light max-w-lg mx-auto mb-10">
              Utforsk kurskatalogen og finn det kurset som tar deg og teamet ditt til neste nivå.
            </p>
            <Link to="/kurs/katalog" className="group inline-flex items-center justify-center gap-3 px-12 py-4 bg-secondary text-secondary-foreground text-sm font-medium tracking-wider rounded-full hover:scale-[1.02] transition-all duration-500 shadow-lg shadow-secondary/20">
              Se alle kurs
              <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default KursForside;
