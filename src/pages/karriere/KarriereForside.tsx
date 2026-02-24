import { useState, useEffect, useRef, forwardRef } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, Sparkles, Users, Briefcase, Zap, Heart, ChevronRight, Monitor, Calculator, Megaphone } from "lucide-react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

import heroVideo from "@/assets/karriere-hero-video.mp4";
import heroImg from "@/assets/karriere-hero-futuristic.jpg";
import networkImg from "@/assets/karriere-network-glow.jpg";
import teamImg from "@/assets/karriere-team-meeting.jpg";
import cultureImg from "@/assets/karriere-culture.jpg";
import loungeImg from "@/assets/karriere-lounge.jpg";
import officeTechImg from "@/assets/karriere-office-tech.jpg";
import freelancerImg from "@/assets/karriere-freelancer.jpg";
import patternImg from "@/assets/karriere-pattern.jpg";
import regnskapImg from "@/assets/karriere-regnskap.jpg";
import personalImg from "@/assets/karriere-personal.jpg";
import markedImg from "@/assets/karriere-marked.jpg";
import itImg from "@/assets/karriere-it.jpg";

const DEPARTMENTS = [
  { name: "Regnskap", image: regnskapImg, path: "/karriere/fagomrader#regnskap", desc: "Fagmiljø i fronten av norsk regnskap og rådgivning.", icon: Calculator },
  { name: "Personal", image: personalImg, path: "/karriere/fagomrader#personal", desc: "HR med substans — bygg fremtidens arbeidsplass.", icon: Users },
  { name: "Marked", image: markedImg, path: "/karriere/fagomrader#marked", desc: "Strategi, kreativitet og datadrevet markedsføring.", icon: Megaphone },
  { name: "IT", image: itImg, path: "/karriere/fagomrader#it", desc: "Moderne stack, autonomi og rom for innovasjon.", icon: Monitor },
];

/* ── Animated counter ── */
const AnimatedCounter = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.max(1, Math.floor(value / 30));
    const interval = setInterval(() => {
      start += step;
      if (start >= value) { setDisplay(value); clearInterval(interval); }
      else setDisplay(start);
    }, 30);
    return () => clearInterval(interval);
  }, [inView, value]);

  return <span ref={ref}>{display}{suffix}</span>;
};

/* ── Horizontal scrolling image strip ── */
type ImageMarqueeProps = {
  images: { src: string; alt: string }[];
  reverse?: boolean;
};

const ImageMarquee = forwardRef<HTMLDivElement, ImageMarqueeProps>(({ images, reverse = false }, ref) => (
  <div ref={ref} className="overflow-hidden py-4">
    <motion.div
      className="flex gap-4"
      animate={{ x: reverse ? ["0%", "-50%"] : ["-50%", "0%"] }}
      transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
    >
      {[...images, ...images].map((img, i) => (
        <div key={i} className="shrink-0 w-72 md:w-96 h-48 md:h-64 rounded-2xl overflow-hidden">
          <img src={img.src} alt={img.alt} className="w-full h-full object-cover" loading="lazy" />
        </div>
      ))}
    </motion.div>
  </div>
));

ImageMarquee.displayName = "ImageMarquee";

const KarriereForside = () => {
  const [jobCount, setJobCount] = useState(0);
  const [deptCounts, setDeptCounts] = useState<Record<string, number>>({});
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  useEffect(() => {
    supabase
      .from("job_listings")
      .select("id, category")
      .eq("published", true)
      .eq("active", true)
      .then(({ data }) => {
        setJobCount(data?.length || 0);
        const counts: Record<string, number> = {};
        data?.forEach((j) => {
          const cat = (j.category || "").toLowerCase();
          counts[cat] = (counts[cat] || 0) + 1;
        });
        setDeptCounts(counts);
      });
  }, []);

  return (
    <>
      <Helmet>
        <title>Karriere hos Avargo | Jobb innen regnskap, HR, marked og IT</title>
        <meta name="description" content="Utforsk karrieremuligheter hos Avargo. Vi søker dyktige folk innen regnskap, personal, markedsføring og IT. Se ledige stillinger og send åpen søknad." />
        <link rel="canonical" href="https://avargo.no/karriere" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "EmployerAggregateRating",
          "itemReviewed": {
            "@type": "Organization",
            "name": "Avargo",
            "sameAs": "https://avargo.no"
          }
        })}</script>
      </Helmet>

      {/* ═══ HERO — Fullscreen video ═══ */}
      <section ref={heroRef} className="relative min-h-[85vh] md:min-h-screen overflow-hidden flex items-center">
        {/* Video background */}
        <div className="absolute inset-0">
          <video
            autoPlay muted loop playsInline
            poster={heroImg}
            className="w-full h-full object-cover"
          >
            <source src={heroVideo} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
        </div>

        {/* Animated grid overlay */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: "linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />

        {/* Floating particles - fewer on mobile */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: 2 + Math.random() * 4,
                height: 2 + Math.random() * 4,
                background: i % 3 === 0 ? "hsl(var(--primary) / 0.6)" : "hsl(var(--secondary) / 0.5)",
                left: `${10 + Math.random() * 80}%`,
                top: `${10 + Math.random() * 80}%`,
              }}
              animate={{
                y: [0, -60, 0],
                opacity: [0, 1, 0],
              }}
              transition={{ duration: 5 + Math.random() * 5, repeat: Infinity, delay: Math.random() * 4 }}
            />
          ))}
        </div>

        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="container mx-auto px-4 relative z-10 py-16 md:py-20">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-medium mb-8 backdrop-blur-sm cursor-pointer"
            >
              <Link to="/karriere/stillinger" className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
                {jobCount > 0 ? `${jobCount} ledige stillinger` : "Vi rekrutterer"}
              </Link>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-foreground mb-5 md:mb-6 leading-[1.05]">
              <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="block">
                Bygg karriere
              </motion.span>
              <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="block text-gradient-rose">
                hos Avargo
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-base md:text-xl text-muted-foreground leading-relaxed mb-8 md:mb-12 max-w-xl"
            >
              Fire fagmiljøer, én kultur. Bli en del av teamet som bygger fremtidens rådgivning.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/karriere/stillinger" className="group inline-flex items-center justify-center gap-3 h-12 md:h-14 px-6 md:px-8 bg-primary text-primary-foreground rounded-2xl text-sm font-semibold hover:shadow-2xl hover:shadow-primary/30 transition-all duration-500 relative overflow-hidden w-full sm:w-auto">
                <span className="absolute inset-0 bg-gradient-to-r from-primary via-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative z-10 flex items-center gap-2">Se stillinger <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></span>
              </Link>
              <Link to="/karriere/avargo-fri" className="inline-flex items-center justify-center gap-2 h-12 md:h-14 px-6 md:px-8 border border-border/20 text-foreground rounded-2xl text-sm font-medium hover:bg-muted/20 hover:border-primary/20 transition-all duration-500 backdrop-blur-sm w-full sm:w-auto">
                <Zap size={14} className="text-primary" /> Avargo Fri
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator - desktop only */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 hidden md:flex"
        >
          <span className="text-[9px] tracking-[0.3em] uppercase text-muted-foreground/40">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-5 h-8 rounded-full border border-muted-foreground/20 flex items-start justify-center p-1"
          >
            <motion.div className="w-1 h-2 rounded-full bg-primary/50" />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══ Stats — Animated counters ═══ */}
      <section className="py-12 md:py-16 relative">
        <div className="absolute inset-0 opacity-[0.06]">
          <img src={networkImg} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-background/85" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-4xl mx-auto">
            {[
              { icon: Briefcase, label: "Fagområder", value: 4, suffix: "" },
              { icon: Users, label: "Kontorer", value: 5, suffix: "" },
              { icon: Heart, label: "Overtid", value: 0, suffix: " t" },
              { icon: Zap, label: "Ledige stillinger", value: jobCount, suffix: "" },
            ].map((s, i) => {
              const inner = (
                <>
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2 md:mb-3 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-500">
                    <s.icon size={16} className="text-primary" />
                  </div>
                  <p className="text-2xl md:text-3xl font-bold text-foreground">
                    <AnimatedCounter value={s.value} suffix={s.suffix} />
                  </p>
                  <p className="text-[10px] md:text-[11px] text-muted-foreground mt-1 tracking-wide">{s.label}</p>
                </>
              );
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                >
                  {s.label === "Ledige stillinger" ? (
                    <Link to="/karriere/stillinger" className="glass rounded-2xl p-4 md:p-6 border border-border/10 text-center group hover:border-primary/20 transition-all duration-500 block cursor-pointer">
                      {inner}
                    </Link>
                  ) : (
                    <div className="glass rounded-2xl p-4 md:p-6 border border-border/10 text-center group hover:border-primary/20 transition-all duration-500">
                      {inner}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ Image marquee — Living visual strip ═══ */}
      <section className="py-4 md:py-8 overflow-hidden hidden md:block">
        <ImageMarquee images={[
          { src: teamImg, alt: "Team" },
          { src: cultureImg, alt: "Kultur" },
          { src: loungeImg, alt: "Lounge" },
          { src: officeTechImg, alt: "Teknologi" },
          { src: freelancerImg, alt: "Frilanser" },
        ]} />
      </section>

      {/* ═══ Departments — Immersive image grid ═══ */}
      <section className="py-16 md:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-[11px] tracking-[0.3em] uppercase text-primary/70 font-medium mb-3">Våre avdelinger</p>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-3 md:mb-4">Fire fagmiljøer, én kultur</h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto">Uansett om du brenner for tall, mennesker, merkevarer eller teknologi — hos Avargo finner du ditt team.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 max-w-6xl mx-auto">
            {DEPARTMENTS.map((dept, i) => {
              const Icon = dept.icon;
              const count = deptCounts[dept.name.toLowerCase()] || 0;
              return (
                <motion.div
                  key={dept.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.7 }}
                >
                  <Link to={dept.path} className="group relative block rounded-2xl md:rounded-3xl overflow-hidden aspect-[16/10]">
                    <motion.img
                      src={dept.image}
                      alt={dept.name}
                      className="absolute inset-0 w-full h-full object-cover"
                      whileHover={{ scale: 1.08 }}
                      transition={{ duration: 0.8 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-700" />

                    {/* Job count badge - visible on both mobile and desktop */}
                    <div className="absolute top-4 right-4 md:top-5 md:right-5 flex items-center gap-2">
                      {count > 0 && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/90 backdrop-blur-sm text-primary-foreground text-xs font-semibold shadow-lg">
                          <Briefcase size={11} />
                          {count} {count === 1 ? "stilling" : "stillinger"}
                        </div>
                      )}
                      <div className="w-10 h-10 rounded-xl glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                        <Icon size={16} className="text-primary" />
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-5 md:p-9">
                      <span className="text-[9px] md:text-[10px] tracking-[0.25em] uppercase font-semibold text-primary">{dept.name}</span>
                      <h3 className="text-lg md:text-2xl font-bold text-foreground mt-1 mb-1 md:mb-2">{dept.name}</h3>
                      <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{dept.desc}</p>
                      <div className="mt-3 md:mt-4 flex items-center gap-2 text-xs text-primary font-medium md:opacity-0 md:group-hover:opacity-100 md:translate-y-2 md:group-hover:translate-y-0 transition-all duration-500">
                        Utforsk <ArrowRight size={12} />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link to="/karriere/fagomrader" className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-medium">
              Se alle fagområder <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══ Culture — Full-width cinematic image with overlay ═══ */}
      <section className="relative h-[50vh] md:h-[70vh] overflow-hidden">
        <motion.img
          src={cultureImg}
          alt="Avargo kultur"
          className="w-full h-full object-cover"
          initial={{ scale: 1.1 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background/20" />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-center px-4"
          >
            <p className="text-[11px] tracking-[0.4em] uppercase text-primary/60 font-medium mb-4">Kultur</p>
            <h2 className="text-2xl md:text-6xl font-bold text-foreground max-w-3xl mx-auto leading-tight">
              En arbeidsplass der du faktisk <span className="text-gradient-teal">trives</span>
            </h2>
            <p className="text-muted-foreground mt-4 md:mt-6 max-w-xl mx-auto text-sm md:text-lg">Balanse, utvikling og fellesskap — strukturert inn i alt vi gjør.</p>
          </motion.div>
        </div>
      </section>

      {/* ═══ Why Avargo — Bento grid with images ═══ */}
      <section className="py-16 md:py-32 relative">
        <div className="absolute inset-0 opacity-[0.04]">
          <img src={patternImg} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <p className="text-[11px] tracking-[0.3em] uppercase text-primary/70 font-medium mb-3">Hvorfor Avargo</p>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground">En arbeidsplass som skiller seg ut</h2>
          </motion.div>

          {/* Bento-style grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5 max-w-6xl mx-auto">
            {/* Large card with image */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="md:col-span-2 md:row-span-2 rounded-3xl overflow-hidden relative group"
            >
              <img src={loungeImg} alt="Avargo lounge" className="w-full h-full object-cover min-h-[250px] md:min-h-[420px]" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-primary/20 backdrop-blur-sm flex items-center justify-center mb-3 md:mb-4">
                  <Heart size={16} className="text-primary" />
                </div>
                <h3 className="text-xl md:text-3xl font-bold text-foreground mb-2 md:mb-3">Ingen overtid — på ordentlig</h3>
                <p className="text-sm text-muted-foreground max-w-lg leading-relaxed hidden sm:block">Kvalitet skapes best i et bærekraftig tempo. Balanse er ikke en bonus — det er strukturert inn i driften.</p>
              </div>
            </motion.div>

            {[
              { title: "Moderne teknologi", desc: "Vi utvikler egne løsninger og tar i bruk verktøy som effektiviserer hverdagen." },
              { title: "Bransjens beste vilkår", desc: "Konkurransedyktig lønn, gode vilkår og tydelige utviklingsmuligheter." },
              { title: "Faglig utvikling", desc: "Kontinuerlig kompetanseheving gjennom kurs, sertifiseringer og sterkt fagmiljø." },
              { title: "Inkluderende kultur", desc: "En trygg arbeidsplass der du blir sett, hørt og får rom til å bidra." },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.6 }}
                className="glass rounded-2xl p-5 md:p-7 border border-border/10 hover:border-primary/20 transition-all duration-500 group"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-500">
                  <Sparkles size={14} className="text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Office tech — Full width image break ═══ */}
      <section className="relative h-[35vh] md:h-[50vh] overflow-hidden">
        <motion.img
          src={officeTechImg}
          alt="Avargo tech"
          className="w-full h-full object-cover"
          initial={{ scale: 1.1 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="max-w-lg"
            >
              <p className="text-[11px] tracking-[0.3em] uppercase text-secondary/70 font-medium mb-3">Teknologi</p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Verktøy som gjør en forskjell</h2>
              <p className="text-muted-foreground leading-relaxed">Vi bygger egne AI-drevne systemer som gjør hverdagen smartere for oss og kundene våre.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ Reverse image marquee ═══ */}
      <section className="py-4 md:py-8 overflow-hidden hidden md:block">
        <ImageMarquee
          reverse
          images={[
            { src: regnskapImg, alt: "Regnskap" },
            { src: personalImg, alt: "Personal" },
            { src: markedImg, alt: "Marked" },
            { src: itImg, alt: "IT" },
            { src: teamImg, alt: "Team" },
          ]}
        />
      </section>

      {/* ═══ Avargo Fri teaser ═══ */}
      <section className="relative py-16 md:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img src={freelancerImg} alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/70" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-secondary/30 bg-secondary/10 text-secondary text-xs font-medium mb-6">
                <Zap size={13} /> Ny modell
              </div>
              <h2 className="text-2xl md:text-5xl font-bold text-foreground mb-4 md:mb-5 leading-tight">
                Avargo <span className="text-gradient-teal">Fri</span>
              </h2>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-6 md:mb-8 max-w-lg">
                Jobb på dine premisser — som frilanser eller med prosjektbasert tilknytning.
              </p>
              <Link to="/karriere/avargo-fri" className="group inline-flex items-center gap-3 h-13 px-8 border border-secondary/30 text-foreground rounded-2xl text-sm font-medium hover:bg-secondary/10 hover:border-secondary/50 transition-all duration-500">
                Les mer om Avargo Fri <ArrowRight size={14} className="text-secondary group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ CTA — with network glow background ═══ */}
      <section className="py-16 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.15]">
          <img src={networkImg} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-background/80" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-6xl font-bold text-foreground mb-4 md:mb-6">Klar for neste steg?</h2>
            <p className="text-sm md:text-lg text-muted-foreground max-w-lg mx-auto mb-8 md:mb-10">Se våre ledige stillinger, eller send en åpen søknad.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
              <Link to="/karriere/stillinger" className="group inline-flex items-center justify-center gap-2 h-12 md:h-14 px-8 md:px-10 bg-primary text-primary-foreground rounded-2xl text-sm font-semibold hover:shadow-2xl hover:shadow-primary/30 transition-all duration-500 relative overflow-hidden">
                <span className="absolute inset-0 bg-gradient-to-r from-primary via-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative z-10 flex items-center gap-2">Se stillinger <ArrowRight size={14} /></span>
              </Link>
              <Link to="/karriere/stillinger#apen-soknad" className="inline-flex items-center justify-center gap-2 h-12 md:h-14 px-8 md:px-10 border border-border/20 text-foreground rounded-2xl text-sm font-medium hover:bg-muted/20 hover:border-primary/20 transition-all duration-500">
                Send åpen søknad
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default KarriereForside;
