import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, Calculator, Users, Megaphone, Monitor } from "lucide-react";
import { motion } from "framer-motion";

import regnskapImg from "@/assets/karriere-regnskap.jpg";
import personalImg from "@/assets/karriere-personal.jpg";
import markedImg from "@/assets/karriere-marked.jpg";
import itImg from "@/assets/karriere-it.jpg";

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
    id: "regnskap",
    name: "Regnskap",
    image: regnskapImg,
    icon: Calculator,
    tagline: "Tall med mening",
    description: "Vår regnskapsavdeling kombinerer dyp fagkompetanse med moderne teknologi. Vi jobber tett med kundene og bruker egenutviklede systemer som gjør regnskapet smartere, raskere og mer verdiskapende. Her er du mer enn en bokfører — du er en strategisk rådgiver.",
    highlights: ["Statsautoriserte regnskapsførere", "Egne AI-drevne verktøy", "Bransjespesialisering", "Kontinuerlig faglig utvikling"],
  },
  {
    id: "personal",
    name: "Personal",
    image: personalImg,
    icon: Users,
    tagline: "Mennesker først",
    description: "Personalavdelingen vår leverer HR-tjenester med substans. Fra ansettelsesprosesser og arbeidsrett til personalhåndbøker og organisasjonsutvikling — vi hjelper bedrifter med å bygge gode arbeidsplasser. Her får du jobbe med det som betyr mest: menneskene.",
    highlights: ["Arbeidsrett og rådgivning", "Personaladministrasjon", "Organisasjonsutvikling", "Kurs og opplæring"],
  },
  {
    id: "marked",
    name: "Marked",
    image: markedImg,
    icon: Megaphone,
    tagline: "Vekst med retning",
    description: "Markedsavdelingen kombinerer strategi, kreativitet og datadrevet analyse. Vi bygger merkevarer, driver digital markedsføring og utvikler nettsider som konverterer. Her jobber du i skjæringspunktet mellom teknologi og kreativitet.",
    highlights: ["Digital strategi og SEO", "Annonsering (Google & Meta)", "Nettsider og nettbutikk", "Innholdsproduksjon"],
  },
  {
    id: "it",
    name: "IT",
    image: itImg,
    icon: Monitor,
    tagline: "Teknologi som leverer",
    description: "IT-avdelingen utvikler og drifter løsninger som gjør en reell forskjell for kundene våre. Fra interne systemer og automatisering til AI-drevne verktøy — vi bygger teknologien som driver Avargo fremover. Moderne stack, autonomi og rom for innovasjon.",
    highlights: ["Full-stack utvikling", "AI og automatisering", "Interne produkter", "DevOps og drift"],
  },
];

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
        (data || []).forEach(j => {
          counts[j.category] = (counts[j.category] || 0) + 1;
        });
        setJobCounts(counts);
      });
  }, []);

  return (
    <>
      <Helmet>
        <title>Fagområder | Karriere hos Avargo</title>
        <meta name="description" content="Utforsk våre fire fagmiljøer: Regnskap, Personal, Marked og IT. Finn avdelingen som passer deg best." />
      </Helmet>

      {/* Hero */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-[11px] tracking-[0.3em] uppercase text-primary/70 font-medium mb-3">Fagområder</p>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Fire spesialiseringer, ett team</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Hver avdeling har sin unike identitet, men vi deler alle den samme kulturen — nysgjerrighet, kvalitet og omsorg.</p>
          </motion.div>
        </div>
      </section>

      {/* Department sections */}
      {DEPTS.map((dept, i) => {
        const Icon = dept.icon;
        const count = jobCounts[dept.name] || 0;
        const isEven = i % 2 === 0;

        return (
          <section key={dept.id} id={dept.id} className={`py-16 md:py-24 ${isEven ? "" : "bg-muted/5"}`}>
            <div className="container mx-auto px-4">
              <div className={`grid lg:grid-cols-2 gap-10 lg:gap-16 items-center max-w-6xl mx-auto ${!isEven ? "lg:grid-flow-dense" : ""}`}>
                <motion.div initial={{ opacity: 0, x: isEven ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
                  className={!isEven ? "lg:col-start-2" : ""}>
                  <div className="relative rounded-2xl overflow-hidden aspect-[16/10]">
                    <img src={dept.image} alt={dept.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    {count > 0 && (
                      <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-full">
                        {count} ledig{count > 1 ? "e" : ""} stilling{count > 1 ? "er" : ""}
                      </div>
                    )}
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: isEven ? 30 : -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
                  className={!isEven ? "lg:col-start-1 lg:row-start-1" : ""}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Icon size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] tracking-[0.2em] uppercase text-primary font-semibold">{dept.tagline}</p>
                      <h2 className="text-2xl md:text-3xl font-bold text-foreground">{dept.name}</h2>
                    </div>
                  </div>

                  <p className="text-muted-foreground leading-relaxed mb-6">{dept.description}</p>

                  <ul className="space-y-2.5 mb-8">
                    {dept.highlights.map((h, j) => (
                      <li key={j} className="flex items-center gap-2.5 text-sm text-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                        {h}
                      </li>
                    ))}
                  </ul>

                  <Link to={`/karriere/stillinger?avdeling=${dept.name}`}
                    className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:underline">
                    {count > 0 ? `Se ${count} stilling${count > 1 ? "er" : ""}` : "Se stillinger"} <ArrowRight size={14} />
                  </Link>
                </motion.div>
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
};

export default KarriereFagomrader;
