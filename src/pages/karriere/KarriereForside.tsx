import { useState, useEffect, useRef, forwardRef } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, Sparkles, Users, Briefcase, Zap, Heart, Monitor, Calculator, Megaphone } from "lucide-react";
import { motion } from "framer-motion";

import heroImg from "@/assets/karriere-hero-futuristic.jpg";
import networkImg from "@/assets/karriere-network-glow.jpg";
import teamImg from "@/assets/karriere-team-meeting.jpg";
import cultureImg from "@/assets/karriere-culture.jpg";
import loungeImg from "@/assets/karriere-lounge.jpg";
import officeTechImg from "@/assets/karriere-office-tech.jpg";
import freelancerImg from "@/assets/karriere-freelancer.jpg";
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

/* ── Horizontal scrolling image strip (desktop only) ── */
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
        <div key={i} className="shrink-0 w-96 h-64 rounded-2xl overflow-hidden">
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
          "itemReviewed": { "@type": "Organization", "name": "Avargo", "sameAs": "https://avargo.no" }
        })}</script>
      </Helmet>

      {/* ═══ HERO — Compact on mobile, cinematic on desktop ═══ */}
      <section className="relative min-h-[60vh] md:min-h-screen overflow-hidden flex items-center">
        <div className="absolute inset-0">
          <img src={heroImg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
        </div>

        <div className="container mx-auto px-4 relative z-10 py-12 md:py-20">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-3xl">
            {jobCount > 0 && (
              <Link to="/karriere/stillinger" className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-medium mb-5 md:mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
                {jobCount} ledige stillinger
              </Link>
            )}

            <h1 className="text-3xl md:text-7xl lg:text-8xl font-bold text-foreground mb-3 md:mb-6 leading-[1.1]">
              Bygg karriere<br />
              <span className="text-gradient-rose">hos Avargo</span>
            </h1>

            <p className="text-sm md:text-xl text-muted-foreground leading-relaxed mb-6 md:mb-12 max-w-xl">
              Fire fagmiljøer, én kultur. Bli en del av teamet som bygger fremtidens rådgivning.
            </p>

            <div className="flex gap-3">
              <Link to="/karriere/stillinger" className="inline-flex items-center justify-center gap-2 h-11 md:h-14 px-5 md:px-8 bg-primary text-primary-foreground rounded-xl md:rounded-2xl text-sm font-semibold transition-all">
                Se stillinger <ArrowRight size={14} />
              </Link>
              <Link to="/karriere/avargo-fri" className="inline-flex items-center justify-center gap-2 h-11 md:h-14 px-5 md:px-8 border border-border/20 text-foreground rounded-xl md:rounded-2xl text-sm font-medium transition-all">
                <Zap size={14} className="text-primary" /> Avargo Fri
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ Quick stats — minimal on mobile ═══ */}
      <section className="py-6 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-4 gap-2 md:gap-4 max-w-4xl mx-auto">
            {[
              { label: "Fagområder", value: "4" },
              { label: "Kontorer", value: "5" },
              { label: "Overtid", value: "0 t" },
              { label: "Stillinger", value: String(jobCount), link: "/karriere/stillinger" },
            ].map((s, i) => {
              const inner = (
                <>
                  <p className="text-xl md:text-3xl font-bold text-foreground">{s.value}</p>
                  <p className="text-[9px] md:text-[11px] text-muted-foreground mt-0.5">{s.label}</p>
                </>
              );
              return (
                <div key={i} className="rounded-xl md:rounded-2xl border border-border/10 p-3 md:p-6 text-center bg-muted/5">
                  {s.link ? <Link to={s.link} className="block">{inner}</Link> : inner}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ Departments — Simple list on mobile, image grid on desktop ═══ */}
      <section className="py-8 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6 md:mb-16">
            <h2 className="text-xl md:text-5xl font-bold text-foreground mb-1 md:mb-4">Våre fagmiljøer</h2>
            <p className="text-xs md:text-base text-muted-foreground">Finn avdelingen som passer deg.</p>
          </div>

          {/* Mobile: compact list */}
          <div className="md:hidden space-y-2 max-w-lg mx-auto">
            {DEPARTMENTS.map((dept) => {
              const Icon = dept.icon;
              const count = deptCounts[dept.name.toLowerCase()] || 0;
              return (
                <Link key={dept.name} to={dept.path} className="flex items-center gap-3 p-3.5 rounded-xl border border-border/10 bg-muted/5 active:bg-muted/20 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{dept.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{dept.desc}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {count > 0 && (
                      <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-md">{count}</span>
                    )}
                    <ArrowRight size={14} className="text-muted-foreground" />
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Desktop: image grid */}
          <div className="hidden md:grid grid-cols-2 gap-6 max-w-6xl mx-auto">
            {DEPARTMENTS.map((dept, i) => {
              const Icon = dept.icon;
              const count = deptCounts[dept.name.toLowerCase()] || 0;
              return (
                <motion.div key={dept.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12, duration: 0.7 }}>
                  <Link to={dept.path} className="group relative block rounded-3xl overflow-hidden aspect-[16/10]">
                    <motion.img src={dept.image} alt={dept.name} className="absolute inset-0 w-full h-full object-cover" whileHover={{ scale: 1.08 }} transition={{ duration: 0.8 }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                    {count > 0 && (
                      <div className="absolute top-5 right-5 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/90 backdrop-blur-sm text-primary-foreground text-xs font-semibold shadow-lg">
                        <Briefcase size={11} /> {count} {count === 1 ? "stilling" : "stillinger"}
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-9">
                      <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-primary">{dept.name}</span>
                      <h3 className="text-2xl font-bold text-foreground mt-1 mb-2">{dept.name}</h3>
                      <p className="text-sm text-muted-foreground">{dept.desc}</p>
                      <div className="mt-4 flex items-center gap-2 text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-all duration-500">
                        Utforsk <ArrowRight size={12} />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ Image marquee — desktop only ═══ */}
      <section className="py-8 overflow-hidden hidden md:block">
        <ImageMarquee images={[
          { src: teamImg, alt: "Team" },
          { src: cultureImg, alt: "Kultur" },
          { src: loungeImg, alt: "Lounge" },
          { src: officeTechImg, alt: "Teknologi" },
        ]} />
      </section>

      {/* ═══ Why Avargo — simple list on mobile ═══ */}
      <section className="py-8 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6 md:mb-14">
            <h2 className="text-xl md:text-5xl font-bold text-foreground mb-1 md:mb-3">Hvorfor Avargo</h2>
          </div>

          {/* Mobile: ultra-compact list */}
          <div className="md:hidden space-y-2 max-w-lg mx-auto">
            {[
              { title: "Null overtid", desc: "Balanse er strukturert inn i driften" },
              { title: "Moderne teknologi", desc: "Egne AI-drevne verktøy" },
              { title: "Gode vilkår", desc: "Konkurransedyktig lønn og utvikling" },
              { title: "Inkluderende kultur", desc: "Bli sett, hørt og få rom til å bidra" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl border border-border/10 bg-muted/5">
                <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: bento grid */}
          <div className="hidden md:grid grid-cols-3 gap-5 max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="col-span-2 row-span-2 rounded-3xl overflow-hidden relative group">
              <img src={loungeImg} alt="Avargo lounge" className="w-full h-full object-cover min-h-[420px]" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-12">
                <div className="w-10 h-10 rounded-xl bg-primary/20 backdrop-blur-sm flex items-center justify-center mb-4">
                  <Heart size={16} className="text-primary" />
                </div>
                <h3 className="text-3xl font-bold text-foreground mb-3">Ingen overtid — på ordentlig</h3>
                <p className="text-sm text-muted-foreground max-w-lg leading-relaxed">Kvalitet skapes best i et bærekraftig tempo.</p>
              </div>
            </motion.div>
            {[
              { title: "Moderne teknologi", desc: "Egne AI-drevne verktøy som effektiviserer hverdagen." },
              { title: "Bransjens beste vilkår", desc: "Konkurransedyktig lønn og tydelige utviklingsmuligheter." },
              { title: "Faglig utvikling", desc: "Kurs, sertifiseringer og sterkt fagmiljø." },
              { title: "Inkluderende kultur", desc: "En trygg arbeidsplass der du blir sett og hørt." },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.6 }} className="glass rounded-2xl p-7 border border-border/10 hover:border-primary/20 transition-all duration-500">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mb-4"><Sparkles size={14} className="text-primary" /></div>
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Culture image — desktop only ═══ */}
      <section className="relative h-[70vh] overflow-hidden hidden md:block">
        <motion.img src={cultureImg} alt="Avargo kultur" className="w-full h-full object-cover" initial={{ scale: 1.1 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.5 }} />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background/20" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4">
            <h2 className="text-6xl font-bold text-foreground max-w-3xl mx-auto leading-tight">
              En arbeidsplass der du faktisk <span className="text-gradient-teal">trives</span>
            </h2>
          </div>
        </div>
      </section>

      {/* ═══ Avargo Fri teaser — compact on mobile ═══ */}
      <section className="py-8 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 hidden md:block">
          <img src={freelancerImg} alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/70" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto md:mx-0">
            <div className="p-4 md:p-0 rounded-xl md:rounded-none border border-border/10 md:border-0 bg-muted/5 md:bg-transparent">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-secondary/30 bg-secondary/10 text-secondary text-xs font-medium mb-3 md:mb-6">
                <Zap size={12} /> Frilansmodell
              </div>
              <h2 className="text-lg md:text-5xl font-bold text-foreground mb-2 md:mb-5">
                Avargo <span className="text-gradient-teal">Fri</span>
              </h2>
              <p className="text-xs md:text-base text-muted-foreground mb-4 md:mb-8">
                Jobb på dine premisser — som frilanser eller med prosjektbasert tilknytning.
              </p>
              <Link to="/karriere/avargo-fri" className="inline-flex items-center gap-2 text-sm text-secondary font-medium">
                Les mer <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-10 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-xl md:text-6xl font-bold text-foreground mb-3 md:mb-6">Klar for neste steg?</h2>
          <p className="text-xs md:text-lg text-muted-foreground max-w-lg mx-auto mb-5 md:mb-10">Se våre ledige stillinger, eller send en åpen søknad.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link to="/karriere/stillinger" className="inline-flex items-center justify-center gap-2 h-11 md:h-14 px-6 md:px-10 bg-primary text-primary-foreground rounded-xl md:rounded-2xl text-sm font-semibold transition-all">
              Se stillinger <ArrowRight size={14} />
            </Link>
            <Link to="/karriere/stillinger#apen-soknad" className="inline-flex items-center justify-center gap-2 h-11 md:h-14 px-6 md:px-10 border border-border/20 text-foreground rounded-xl md:rounded-2xl text-sm font-medium transition-all">
              Åpen søknad
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default KarriereForside;
