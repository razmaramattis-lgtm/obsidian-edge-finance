import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { Briefcase, MapPin, Clock, ArrowRight, Search, Building2 } from "lucide-react";
import { motion } from "framer-motion";

interface JobListing {
  id: string;
  title: string;
  slug: string;
  category: string;
  location: string;
  employment_type: string;
  work_location: string;
  start_date: string;
  deadline: string | null;
  intro: string | null;
  created_at: string;
}

const CATEGORIES = ["Alle", "Regnskap", "Personal", "Marked", "IT"];

const Karriere = () => {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCat, setActiveCat] = useState("Alle");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("job_listings")
        .select("id, title, slug, category, location, employment_type, work_location, start_date, deadline, intro, created_at")
        .eq("published", true)
        .eq("active", true)
        .order("created_at", { ascending: false });
      setJobs((data as JobListing[]) || []);
      setLoading(false);
    };
    fetch();
  }, []);

  const filtered = jobs.filter(j => {
    const matchCat = activeCat === "Alle" || j.category === activeCat;
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) || j.location.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <>
      <Helmet>
        <title>Jobb hos oss | Avargo</title>
        <meta name="description" content="Se ledige stillinger hos Avargo. Vi søker alltid etter flinke folk innen regnskap, HR, markedsføring og IT." />
      </Helmet>

      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-medium mb-6">
              <Briefcase size={13} /> Karriere hos Avargo
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
              Bli en del av<br />
              <span className="text-primary">fremtidens rådgivning</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
              Vi bygger Norges mest moderne rådgivningsmiljø. Hos oss får du jobbe med spennende kunder, 
              moderne teknologi og et team som setter kvalitet og utvikling i sentrum.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-3xl">
            {[
              { label: "Kontorer", value: "5" },
              { label: "Ingen overtid", value: "0 timer" },
              { label: "Fagområder", value: "4" },
              { label: "Ledige stillinger", value: String(jobs.length) },
            ].map((s, i) => (
              <div key={i} className="glass rounded-2xl p-4 border border-border/10 text-center">
                <p className="text-2xl font-bold text-primary">{s.value}</p>
                <p className="text-[11px] text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Filters + Listings */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setActiveCat(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    activeCat === cat ? "bg-primary text-primary-foreground shadow-md" : "bg-muted/40 text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  }`}>{cat}</button>
              ))}
            </div>
            <div className="relative w-full md:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Søk i stillinger…"
                className="w-full h-10 pl-9 pr-3 rounded-xl border border-border/20 bg-muted/20 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-16 text-muted-foreground">Laster stillinger…</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <Building2 size={48} className="mx-auto text-muted-foreground/30 mb-4" strokeWidth={1} />
              <p className="text-lg font-medium text-foreground mb-2">Ingen ledige stillinger akkurat nå</p>
              <p className="text-sm text-muted-foreground">Vi er alltid på utkikk etter flinke folk. Send oss en åpen søknad!</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filtered.map((job, i) => (
                <motion.div key={job.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.4 }}>
                  <Link to={`/karriere/${job.slug}`}
                    className="group block glass rounded-2xl border border-border/15 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                    <div className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="text-[10px] tracking-[0.2em] uppercase font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">{job.category}</span>
                          {job.deadline && <span className="text-[10px] text-muted-foreground">Frist: {job.deadline}</span>}
                        </div>
                        <h2 className="text-lg md:text-xl font-semibold text-foreground group-hover:text-primary transition-colors mb-2">{job.title}</h2>
                        {job.intro && <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{job.intro}</p>}
                        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1.5"><MapPin size={12} /> {job.location}</span>
                          <span className="flex items-center gap-1.5"><Briefcase size={12} /> {job.employment_type}</span>
                          <span className="flex items-center gap-1.5"><Clock size={12} /> {job.start_date}</span>
                        </div>
                      </div>
                      <div className="shrink-0">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground flex items-center justify-center transition-all duration-300">
                          <ArrowRight size={16} />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why work here */}
      <section className="py-16 md:py-24 bg-muted/20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Hvorfor jobbe hos oss?</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { title: "Ingen overtid", desc: "Vi mener kvalitet skapes best i et bærekraftig arbeidstempo. Hos oss er balanse ikke et slagord, men en strukturert del av driften." },
              { title: "Moderne teknologi", desc: "Vi utvikler og drifter egne løsninger, og tar i bruk moderne verktøy som effektiviserer hverdagen og øker kvaliteten." },
              { title: "Bransjens beste vilkår", desc: "Konkurransedyktig lønn, gode arbeidsvilkår og tydelige utviklingsmuligheter — både faglig og karrieremessig." },
              { title: "Inkluderende kultur", desc: "Vi bygger en trygg arbeidsplass der man blir sett, hørt og får rom til å bidra med autonomi og støtte." },
              { title: "Faglig utvikling", desc: "Kontinuerlig kompetanseheving gjennom kurs, sertifiseringer og et sterkt internt fagmiljø." },
              { title: "Spennende samarbeid", desc: "Du jobber tett med solide kunder og innovative leverandører, som gir faglig variasjon og muligheter." },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
                className="glass rounded-2xl p-6 border border-border/10">
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Karriere;
