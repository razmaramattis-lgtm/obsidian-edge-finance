import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { Briefcase, MapPin, Clock, ArrowRight, Search, Building2, Send, Sparkles, User, Mail, Phone, Linkedin, Globe, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CvUpload from "@/components/CvUpload";

// Area images
import regnskapImg from "@/assets/karriere-regnskap.jpg";
import personalImg from "@/assets/karriere-personal.jpg";
import markedImg from "@/assets/karriere-marked.jpg";
import itImg from "@/assets/karriere-it.jpg";
import openAppBg from "@/assets/karriere-open-application-bg.jpg";

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
const DEPT_OPTIONS = ["Regnskap", "Personal", "Marked", "IT"];

const DEPARTMENTS = [
  { name: "Regnskap", image: regnskapImg, desc: "Fagmiljø i fronten av norsk regnskap og rådgivning. Moderne verktøy, ambisiøst team og kunder som utfordrer." },
  { name: "Personal", image: personalImg, desc: "HR med substans. Bygg fremtidens arbeidsplass gjennom rådgivning, systemer og menneskelig innsikt." },
  { name: "Marked", image: markedImg, desc: "Strategi, kreativitet og analyse i harmoni. Hjelp norske bedrifter å vokse med datadrevet markedsføring." },
  { name: "IT", image: itImg, desc: "Utvikle og drifte løsninger som gjør en reell forskjell. Moderne stack, autonomi og rom for innovasjon." },
];

const Karriere = () => {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCat, setActiveCat] = useState("Alle");
  const [search, setSearch] = useState("");

  // Open application form state
  const [openForm, setOpenForm] = useState({
    full_name: "", email: "", phone: "",
    linkedin_url: "", portfolio_url: "",
    preferred_category: "",
    message: "",
  });
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [cvFileName, setCvFileName] = useState<string | null>(null);
  const [openSubmitting, setOpenSubmitting] = useState(false);
  const [openSubmitted, setOpenSubmitted] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      const { data } = await supabase
        .from("job_listings")
        .select("id, title, slug, category, location, employment_type, work_location, start_date, deadline, intro, created_at")
        .eq("published", true)
        .eq("active", true)
        .order("created_at", { ascending: false });
      setJobs((data as JobListing[]) || []);
      setLoading(false);
    };
    fetchJobs();
  }, []);

  const filtered = jobs.filter(j => {
    const matchCat = activeCat === "Alle" || j.category === activeCat;
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) || j.location.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const submitOpenApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!openForm.full_name.trim() || !openForm.email.trim() || !openForm.phone.trim()) return;
    setOpenSubmitting(true);
    const { error } = await supabase.from("open_applications").insert([{
      full_name: openForm.full_name.trim(),
      email: openForm.email.trim(),
      phone: openForm.phone.trim(),
      linkedin_url: openForm.linkedin_url.trim() || null,
      portfolio_url: openForm.portfolio_url.trim() || null,
      preferred_category: openForm.preferred_category || null,
      message: openForm.message.trim() || null,
      cv_url: cvUrl,
      cv_file_name: cvFileName,
    }]);
    if (error) {
      const { toast } = await import("sonner");
      toast.error("Noe gikk galt. Prøv igjen.");
    } else {
      setOpenSubmitted(true);
      supabase.functions.invoke("notify", {
        body: {
          type: "open_application",
          data: {
            applicant_name: openForm.full_name.trim(),
            applicant_email: openForm.email.trim(),
            applicant_phone: openForm.phone.trim(),
            linkedin_url: openForm.linkedin_url.trim() || null,
            portfolio_url: openForm.portfolio_url.trim() || null,
            preferred_category: openForm.preferred_category || null,
            message: openForm.message.trim() || null,
            cv_url: cvUrl,
            cv_file_name: cvFileName,
          },
        },
      }).catch(() => {});
    }
    setOpenSubmitting(false);
  };

  const setField = (key: string, val: string) => setOpenForm(prev => ({ ...prev, [key]: val }));
  const inputClass = "w-full h-11 pl-10 pr-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all";

  return (
    <>
      <Helmet>
        <title>Jobb hos oss | Avargo</title>
        <meta name="description" content="Se ledige stillinger hos Avargo. Vi søker alltid etter flinke folk innen regnskap, HR, markedsføring og IT." />
      </Helmet>

      {/* Open Application — immersive hero */}
      <section className="relative min-h-[700px] overflow-hidden">
        <div className="absolute inset-0">
          <img src={openAppBg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>

        <div className="container mx-auto px-4 relative z-10 py-20 md:py-28">
          <div className="grid lg:grid-cols-[1fr_440px] gap-12 lg:gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-medium mb-6 backdrop-blur-sm">
                <Sparkles size={13} /> Åpen søknad
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-5 leading-tight">
                Fant du ikke<br />drømmejobben?
              </h2>
              <p className="text-lg text-white/70 max-w-md leading-relaxed mb-8">
                Vi er alltid på utkikk etter dyktige mennesker som vil være med å bygge fremtidens rådgivning. 
                Fortell oss hvem du er — det tar under 2 minutter.
              </p>
              <div className="space-y-3">
                {[
                  "Superenkelt — bare fyll ut og send",
                  "Legg ved CV eller LinkedIn-profil",
                  "Vi matcher deg med riktig stilling",
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-3 text-white/80">
                    <CheckCircle2 size={16} className="text-primary shrink-0" />
                    <span className="text-sm">{text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.7 }}>
              <AnimatePresence mode="wait">
                {openSubmitted ? (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} 
                    className="rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl p-8 text-center">
                    <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-5">
                      <Sparkles size={32} className="text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Søknaden er sendt!</h3>
                    <p className="text-sm text-white/60 max-w-xs mx-auto">Takk for interessen. Vi gjennomgår søknaden din og tar kontakt dersom vi har en passende stilling.</p>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={submitOpenApplication}
                    className="rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl p-6 md:p-8 space-y-4">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-0.5">Søk åpent hos Avargo</h3>
                      <p className="text-xs text-white/50">Fyll ut det du kan — resten ordner vi.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="relative">
                        <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                        <input value={openForm.full_name} onChange={e => setField("full_name", e.target.value)} required
                          placeholder="Fullt navn *" maxLength={100} className={inputClass} />
                      </div>
                      <div className="relative">
                        <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                        <input type="email" value={openForm.email} onChange={e => setField("email", e.target.value)} required
                          placeholder="E-post *" maxLength={255} className={inputClass} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="relative">
                        <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                        <input type="tel" value={openForm.phone} onChange={e => setField("phone", e.target.value)} required
                          placeholder="Telefon *" maxLength={20} className={inputClass} />
                      </div>
                      <div className="relative">
                        <Linkedin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                        <input value={openForm.linkedin_url} onChange={e => setField("linkedin_url", e.target.value)}
                          placeholder="LinkedIn-profil" maxLength={500} className={inputClass} />
                      </div>
                    </div>

                    <div className="relative">
                      <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                      <input value={openForm.portfolio_url} onChange={e => setField("portfolio_url", e.target.value)}
                        placeholder="Portefølje / nettside (valgfritt)" maxLength={500} className={inputClass} />
                    </div>

                    <div>
                      <p className="text-xs text-white/50 mb-2">Hvilken avdeling interesserer deg?</p>
                      <div className="flex flex-wrap gap-2">
                        {DEPT_OPTIONS.map(cat => (
                          <button key={cat} type="button" onClick={() => setField("preferred_category", openForm.preferred_category === cat ? "" : cat)}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                              openForm.preferred_category === cat
                                ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                                : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white"
                            }`}>{cat}</button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-white/50 mb-2">Last opp CV (PDF / Word)</p>
                      <CvUpload
                        cvUrl={cvUrl}
                        cvFileName={cvFileName}
                        onUploaded={(url, name) => { setCvUrl(url); setCvFileName(name); }}
                        onRemove={() => { setCvUrl(null); setCvFileName(null); }}
                      />
                    </div>

                    <textarea value={openForm.message} onChange={e => setField("message", e.target.value)}
                      placeholder="Kort om deg selv, din motivasjon og hva du kan bidra med…"
                      rows={3} maxLength={3000}
                      className="w-full rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />

                    <button type="submit" disabled={openSubmitting}
                      className="w-full h-12 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/30">
                      {openSubmitting ? "Sender…" : <><Send size={15} /> Send åpen søknad</>}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="py-10 md:py-14 border-b border-border/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { label: "Kontorer", value: "5" },
              { label: "Ingen overtid", value: "0 timer" },
              { label: "Fagområder", value: "4" },
              { label: "Ledige stillinger", value: String(jobs.length) },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5 }}
                className="glass rounded-2xl p-5 border border-border/10 text-center">
                <p className="text-2xl font-bold text-primary">{s.value}</p>
                <p className="text-[11px] text-muted-foreground mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Departments — immersive cards */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <p className="text-[11px] tracking-[0.3em] uppercase text-primary/70 font-medium mb-3">Våre avdelinger</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Fire fagmiljøer, én kultur</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Uansett om du brenner for tall, mennesker, merkevarer eller teknologi — hos Avargo finner du et team som deler ditt engasjement.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto">
            {DEPARTMENTS.map((dept, i) => (
              <motion.div key={dept.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="group relative rounded-2xl overflow-hidden aspect-[16/10] cursor-pointer"
                onClick={() => setActiveCat(dept.name)}
              >
                <img src={dept.image} alt={dept.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-primary">{dept.name}</span>
                  <h3 className="text-xl md:text-2xl font-bold text-white mt-1 mb-2">{dept.name}</h3>
                  <p className="text-sm text-white/60 leading-relaxed max-w-md">{dept.desc}</p>
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Se stillinger <ArrowRight size={12} />
                  </div>
                </div>
                {/* Count badge */}
                {jobs.filter(j => j.category === dept.name).length > 0 && (
                  <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs font-bold px-2.5 py-1 rounded-full">
                    {jobs.filter(j => j.category === dept.name).length} ledig{jobs.filter(j => j.category === dept.name).length > 1 ? "e" : ""}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Filters + Listings */}
      <section className="py-16 md:py-24 bg-muted/5" id="stillinger">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Ledige stillinger</h2>
            <p className="text-muted-foreground">Finn din neste mulighet hos oss</p>
          </motion.div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 max-w-4xl mx-auto">
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
                className="w-full h-10 pl-9 pr-3 rounded-xl border border-border/20 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
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
        </div>
      </section>

      {/* Why work here */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <p className="text-[11px] tracking-[0.3em] uppercase text-primary/70 font-medium mb-3">Hvorfor Avargo</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">En arbeidsplass som skiller seg ut</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {[
              { title: "Ingen overtid", desc: "Vi mener kvalitet skapes best i et bærekraftig arbeidstempo. Hos oss er balanse ikke et slagord, men en strukturert del av driften." },
              { title: "Moderne teknologi", desc: "Vi utvikler og drifter egne løsninger, og tar i bruk moderne verktøy som effektiviserer hverdagen og øker kvaliteten." },
              { title: "Bransjens beste vilkår", desc: "Konkurransedyktig lønn, gode arbeidsvilkår og tydelige utviklingsmuligheter — både faglig og karrieremessig." },
              { title: "Inkluderende kultur", desc: "Vi bygger en trygg arbeidsplass der man blir sett, hørt og får rom til å bidra med autonomi og støtte." },
              { title: "Faglig utvikling", desc: "Kontinuerlig kompetanseheving gjennom kurs, sertifiseringer og et sterkt internt fagmiljø." },
              { title: "Spennende samarbeid", desc: "Du jobber tett med solide kunder og innovative leverandører, som gir faglig variasjon og muligheter." },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5 }}
                className="glass rounded-2xl p-6 border border-border/10 hover:border-primary/20 transition-colors duration-300">
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Avargo — closing CTA */}
      <section className="py-16 md:py-24 bg-muted/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <p className="text-[11px] tracking-[0.3em] uppercase text-primary/70 font-medium mb-3">Om Avargo</p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Fremtidens rådgivning starter her</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Avargo er et moderne, fremtidsrettet rådgivningsbyrå som kombinerer sterkt fagmiljø, teknologisk nyskaping 
                og en kultur der folk får blomstre. Vi dekker fire fagområder — regnskap, personal, markedsføring og IT — 
                og utvikler egne løsninger som gir smartere arbeidsflyt og økt kundeverdi.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Hos oss finner du et mangfold av spesialister som samarbeider på tvers av fagfelt. Det betyr varierte oppgaver, 
                spennende kunder og muligheten til å fordype deg i det du brenner mest for.
              </p>
              <Link to="/kontakt" className="inline-flex items-center gap-2 h-12 px-8 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-primary/20">
                Ta kontakt <ArrowRight size={14} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Karriere;
