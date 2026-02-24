import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, Sparkles, Users, Briefcase, Zap, Heart, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

import regnskapImg from "@/assets/karriere-regnskap.jpg";
import personalImg from "@/assets/karriere-personal.jpg";
import markedImg from "@/assets/karriere-marked.jpg";
import itImg from "@/assets/karriere-it.jpg";
import openAppBg from "@/assets/karriere-open-application-bg.jpg";

const DEPARTMENTS = [
  { name: "Regnskap", image: regnskapImg, path: "/karriere/fagomrader#regnskap", desc: "Fagmiljø i fronten av norsk regnskap og rådgivning." },
  { name: "Personal", image: personalImg, path: "/karriere/fagomrader#personal", desc: "HR med substans — bygg fremtidens arbeidsplass." },
  { name: "Marked", image: markedImg, path: "/karriere/fagomrader#marked", desc: "Strategi, kreativitet og datadrevet markedsføring." },
  { name: "IT", image: itImg, path: "/karriere/fagomrader#it", desc: "Moderne stack, autonomi og rom for innovasjon." },
];

const KarriereForside = () => {
  const [jobCount, setJobCount] = useState(0);

  useEffect(() => {
    supabase
      .from("job_listings")
      .select("id", { count: "exact", head: true })
      .eq("published", true)
      .eq("active", true)
      .then(({ count }) => setJobCount(count || 0));
  }, []);

  return (
    <>
      <Helmet>
        <title>Karriere hos Avargo | Jobb innen regnskap, HR, marked og IT</title>
        <meta name="description" content="Utforsk karrieremuligheter hos Avargo. Vi søker dyktige folk innen regnskap, personal, markedsføring og IT. Se ledige stillinger og send åpen søknad." />
      </Helmet>

      {/* Hero */}
      <section className="relative min-h-[85vh] overflow-hidden flex items-center">
        <div className="absolute inset-0">
          <img src={openAppBg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        <div className="container mx-auto px-4 relative z-10 py-20">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-medium mb-8 backdrop-blur-sm">
              <Sparkles size={13} /> {jobCount > 0 ? `${jobCount} ledige stillinger` : "Vi rekrutterer"}
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[1.1]">
              Bygg karriere<br />hos Avargo
            </h1>
            <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-10 max-w-lg">
              Fire fagmiljøer, én kultur. Bli en del av teamet som bygger fremtidens rådgivning — med teknologi, innsikt og menneskelig nærhet.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/karriere/stillinger" className="inline-flex items-center gap-2 h-13 px-8 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-primary/30">
                Se stillinger <ArrowRight size={15} />
              </Link>
              <Link to="/karriere/avargo-fri" className="inline-flex items-center gap-2 h-13 px-8 border border-white/20 text-white rounded-xl text-sm font-medium hover:bg-white/10 transition-all backdrop-blur-sm">
                Avargo Fri <ChevronRight size={14} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-b border-border/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { icon: Briefcase, label: "Fagområder", value: "4" },
              { icon: Users, label: "Kontorer", value: "5" },
              { icon: Heart, label: "Overtid", value: "0 t" },
              { icon: Zap, label: "Ledige stillinger", value: String(jobCount) },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="glass rounded-2xl p-5 border border-border/10 text-center">
                <s.icon size={18} className="text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-[11px] text-muted-foreground mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Departments preview */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <p className="text-[11px] tracking-[0.3em] uppercase text-primary/70 font-medium mb-3">Våre avdelinger</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Fire fagmiljøer, én kultur</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Uansett om du brenner for tall, mennesker, merkevarer eller teknologi — hos Avargo finner du ditt team.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto">
            {DEPARTMENTS.map((dept, i) => (
              <motion.div key={dept.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}>
                <Link to={dept.path} className="group relative block rounded-2xl overflow-hidden aspect-[16/10]">
                  <img src={dept.image} alt={dept.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-primary">{dept.name}</span>
                    <h3 className="text-xl md:text-2xl font-bold text-white mt-1 mb-2">{dept.name}</h3>
                    <p className="text-sm text-white/60 leading-relaxed">{dept.desc}</p>
                    <div className="mt-3 flex items-center gap-1.5 text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Utforsk <ArrowRight size={12} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/karriere/fagomrader" className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-medium">
              Se alle fagområder <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Avargo */}
      <section className="py-16 md:py-24 bg-muted/5">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <p className="text-[11px] tracking-[0.3em] uppercase text-primary/70 font-medium mb-3">Hvorfor Avargo</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">En arbeidsplass som skiller seg ut</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {[
              { title: "Ingen overtid", desc: "Kvalitet skapes best i et bærekraftig tempo. Balanse er en strukturert del av driften." },
              { title: "Moderne teknologi", desc: "Vi utvikler egne løsninger og tar i bruk moderne verktøy som effektiviserer hverdagen." },
              { title: "Bransjens beste vilkår", desc: "Konkurransedyktig lønn, gode vilkår og tydelige utviklingsmuligheter." },
              { title: "Inkluderende kultur", desc: "En trygg arbeidsplass der man blir sett, hørt og får rom til å bidra." },
              { title: "Faglig utvikling", desc: "Kontinuerlig kompetanseheving gjennom kurs, sertifiseringer og sterkt fagmiljø." },
              { title: "Spennende samarbeid", desc: "Tett med solide kunder og innovative partnere for faglig variasjon." },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="glass rounded-2xl p-6 border border-border/10 hover:border-primary/20 transition-colors duration-300">
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-5">Klar for neste steg?</h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-8">Se våre ledige stillinger, eller send en åpen søknad — vi er alltid på utkikk etter flinke folk.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/karriere/stillinger" className="inline-flex items-center gap-2 h-12 px-8 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-primary/20">
                Se stillinger <ArrowRight size={14} />
              </Link>
              <Link to="/karriere/stillinger#apen-soknad" className="inline-flex items-center gap-2 h-12 px-8 border border-border/20 text-foreground rounded-xl text-sm font-medium hover:bg-muted/30 transition-all">
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
