import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, Calculator, Users, Megaphone, Monitor } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

import regnskapImg from "@/assets/karriere-regnskap.jpg";
import personalImg from "@/assets/karriere-personal.jpg";
import markedImg from "@/assets/karriere-marked.jpg";
import itImg from "@/assets/karriere-it.jpg";
import networkImg from "@/assets/karriere-network-glow.jpg";
import cultureImg from "@/assets/karriere-culture.jpg";
import officeTechImg from "@/assets/karriere-office-tech.jpg";

interface DeptInfo {
  id: string;
  name: string;
  image: string;
  icon: typeof Calculator;
  tagline: string;
  description: string;
  highlights: string[];
}

const DEPTS: DeptInfo[] = [
  {
    id: "regnskap", name: "Regnskap", image: regnskapImg, icon: Calculator, tagline: "Tall med mening",
    description: "Vår regnskapsavdeling kombinerer dyp fagkompetanse med moderne teknologi. Vi jobber tett med kundene og bruker egenutviklede systemer som gjør regnskapet smartere, raskere og mer verdiskapende. Her er du mer enn en bokfører — du er en strategisk rådgiver.",
    highlights: ["Statsautoriserte regnskapsførere", "Egne AI-drevne verktøy", "Bransjespesialisering", "Kontinuerlig faglig utvikling"],
  },
  {
    id: "personal", name: "Personal", image: personalImg, icon: Users, tagline: "Mennesker først",
    description: "Personalavdelingen vår leverer HR-tjenester med substans. Fra ansettelsesprosesser og arbeidsrett til personalhåndbøker og organisasjonsutvikling — vi hjelper bedrifter med å bygge gode arbeidsplasser. Her får du jobbe med det som betyr mest: menneskene.",
    highlights: ["Arbeidsrett og rådgivning", "Personaladministrasjon", "Organisasjonsutvikling", "Kurs og opplæring"],
  },
  {
    id: "marked", name: "Marked", image: markedImg, icon: Megaphone, tagline: "Vekst med retning",
    description: "Markedsavdelingen kombinerer strategi, kreativitet og datadrevet analyse. Vi bygger merkevarer, driver digital markedsføring og utvikler nettsider som konverterer. Her jobber du i skjæringspunktet mellom teknologi og kreativitet.",
    highlights: ["Digital strategi og SEO", "Annonsering (Google & Meta)", "Nettsider og nettbutikk", "Innholdsproduksjon"],
  },
  {
    id: "it", name: "IT", image: itImg, icon: Monitor, tagline: "Teknologi som leverer",
    description: "IT-avdelingen utvikler og drifter løsninger som gjør en reell forskjell for kundene våre. Fra interne systemer og automatisering til AI-drevne verktøy — vi bygger teknologien som driver Avargo fremover. Moderne stack, autonomi og rom for innovasjon.",
    highlights: ["Full-stack utvikling", "AI og automatisering", "Interne produkter", "DevOps og drift"],
  },
];

/* ── Parallax section image ── */
const ParallaxDivider = ({ src, alt }: { src: string; alt: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <div ref={ref} className="relative h-[35vh] md:h-[45vh] overflow-hidden">
      <motion.img src={src} alt={alt} style={{ y }} className="w-full h-[130%] object-cover absolute inset-0" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
    </div>
  );
};

const KarriereFagomrader = () => {
  const [jobCounts, setJobCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    supabase
      .from("job_listings")
      .select("category")
      .eq("published", true)
      .eq("active", true)
      .then(({ data }) => {
        const counts: Record<string, number> = {};
        (data || []).forEach(j => { counts[j.category] = (counts[j.category] || 0) + 1; });
        setJobCounts(counts);
      });
  }, []);

  return (
    <>
      <Helmet>
        <title>Fagområder | Karriere hos Avargo</title>
        <meta name="description" content="Utforsk våre fire fagmiljøer: Regnskap, Personal, Marked og IT. Finn avdelingen som passer deg best." />
        <link rel="canonical" href="https://avargo.no/karriere/fagomrader" />
      </Helmet>

      {/* Hero — compact on mobile */}
      <section className="relative py-10 md:py-36 overflow-hidden">
        <div className="absolute inset-0 hidden md:block">
          <img src={networkImg} alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-background/80" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-2xl md:text-7xl font-bold text-foreground mb-2 md:mb-5">Fagområder</h1>
            <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto">Fire spesialiseringer, én kultur.</p>
          </motion.div>
        </div>
      </section>

      {/* Department sections with visual dividers */}
      {DEPTS.map((dept, i) => {
        const Icon = dept.icon;
        const count = jobCounts[dept.name] || 0;
        const isEven = i % 2 === 0;

        return (
          <div key={dept.id}>
            {/* Parallax divider — desktop only */}
            {i > 0 && (
              <div className="hidden md:block">
                <ParallaxDivider
                  src={i === 1 ? cultureImg : i === 2 ? officeTechImg : networkImg}
                  alt="Visual break"
                />
              </div>
            )}

            <section id={dept.id} className="py-8 md:py-32 relative">
              <div className="container mx-auto px-4 relative z-10">
                <div className={`grid lg:grid-cols-2 gap-10 lg:gap-20 items-center max-w-6xl mx-auto ${!isEven ? "lg:grid-flow-dense" : ""}`}>
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className={!isEven ? "lg:col-start-2" : ""}
                  >
                    <div className="relative rounded-3xl overflow-hidden aspect-[16/10] group">
                      <motion.img
                        src={dept.image}
                        alt={dept.name}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.8 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-700" />
                      {count > 0 && (
                        <div className="absolute top-5 right-5 bg-primary text-primary-foreground text-xs font-bold px-4 py-2 rounded-xl shadow-lg shadow-primary/20">
                          {count} ledig{count > 1 ? "e" : ""} stilling{count > 1 ? "er" : ""}
                        </div>
                      )}
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: isEven ? 40 : -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.15 }}
                    className={!isEven ? "lg:col-start-1 lg:row-start-1" : ""}
                  >
                    <div className="flex items-center gap-4 mb-5">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Icon size={20} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] tracking-[0.25em] uppercase text-primary font-semibold">{dept.tagline}</p>
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground">{dept.name}</h2>
                      </div>
                    </div>

                    <p className="text-muted-foreground leading-relaxed mb-7">{dept.description}</p>

                    <ul className="space-y-3 mb-8">
                      {dept.highlights.map((h, j) => (
                        <motion.li
                          key={j}
                          initial={{ opacity: 0, x: -15 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3 + j * 0.08 }}
                          className="flex items-center gap-3 text-sm text-foreground"
                        >
                          <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                          {h}
                        </motion.li>
                      ))}
                    </ul>

                    <Link to={`/karriere/stillinger?avdeling=${dept.name}`}
                      className="group inline-flex items-center gap-2 text-sm text-primary font-medium hover:underline">
                      {count > 0 ? `Se ${count} stilling${count > 1 ? "er" : ""}` : "Se stillinger"}
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </motion.div>
                </div>
              </div>
            </section>
          </div>
        );
      })}
    </>
  );
};

export default KarriereFagomrader;
