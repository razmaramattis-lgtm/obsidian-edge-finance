import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { Briefcase, MapPin, Clock, ArrowRight, Search, Building2, Send, Sparkles, User, Mail, Phone, Linkedin, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CvUpload from "@/components/CvUpload";
import networkImg from "@/assets/karriere-network-glow.jpg";
import cultureImg from "@/assets/karriere-culture.jpg";
import patternImg from "@/assets/karriere-pattern.jpg";

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

const KarriereStillinger = () => {
  const [searchParams] = useSearchParams();
  const initialCat = searchParams.get("avdeling") || "Alle";

  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCat, setActiveCat] = useState(CATEGORIES.includes(initialCat) ? initialCat : "Alle");
  const [search, setSearch] = useState("");

  const [openForm, setOpenForm] = useState({ full_name: "", email: "", phone: "", linkedin_url: "", portfolio_url: "", preferred_category: "", message: "" });
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [cvFileName, setCvFileName] = useState<string | null>(null);
  const [openSubmitting, setOpenSubmitting] = useState(false);
  const [openSubmitted, setOpenSubmitted] = useState(false);

  useEffect(() => {
    supabase
      .from("job_listings")
      .select("id, title, slug, category, location, employment_type, work_location, start_date, deadline, intro, created_at")
      .eq("published", true)
      .eq("active", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setJobs((data as JobListing[]) || []);
        setLoading(false);
      });
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
      full_name: openForm.full_name.trim(), email: openForm.email.trim(), phone: openForm.phone.trim(),
      linkedin_url: openForm.linkedin_url.trim() || null, portfolio_url: openForm.portfolio_url.trim() || null,
      preferred_category: openForm.preferred_category || null, message: openForm.message.trim() || null,
      cv_url: cvUrl, cv_file_name: cvFileName,
    }]);
    if (error) { const { toast } = await import("sonner"); toast.error("Noe gikk galt. Prøv igjen."); }
    else {
      setOpenSubmitted(true);
      supabase.functions.invoke("notify", { body: { type: "open_application", data: { applicant_name: openForm.full_name.trim(), applicant_email: openForm.email.trim(), applicant_phone: openForm.phone.trim(), cv_url: cvUrl } } }).catch(() => {});
    }
    setOpenSubmitting(false);
  };

  const setField = (key: string, val: string) => setOpenForm(prev => ({ ...prev, [key]: val }));
  const inputClass = "w-full h-12 pl-10 pr-3 rounded-xl border border-border/20 bg-muted/10 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all";

  return (
    <>
      <Helmet>
        <title>Ledige stillinger | Karriere hos Avargo</title>
        <meta name="description" content="Se alle ledige stillinger hos Avargo innen regnskap, personal, markedsføring og IT." />
        <link rel="canonical" href="https://avargo.no/karriere/stillinger" />
      </Helmet>

      {/* Hero with cinematic image */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img src={cultureImg} alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-background/80" />
        </div>
        <div className="absolute inset-0 opacity-[0.06]">
          <img src={networkImg} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-12">
            <h1 className="text-4xl md:text-7xl font-bold text-foreground mb-4">Ledige stillinger</h1>
            <p className="text-lg text-muted-foreground">Finn din neste mulighet hos oss</p>
          </motion.div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10 max-w-4xl mx-auto">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setActiveCat(cat)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                    activeCat === cat ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground border border-border/10"
                  }`}>{cat}</button>
              ))}
            </div>
            <div className="relative w-full md:w-72">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Søk i stillinger…"
                className="w-full h-11 pl-10 pr-3 rounded-xl border border-border/20 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
            </div>
          </div>
        </div>
      </section>

      {/* Listings */}
      <section className="pb-16 md:pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {loading ? (
              <div className="text-center py-20">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full mx-auto mb-4" />
                <p className="text-muted-foreground">Laster stillinger…</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <Building2 size={56} className="mx-auto text-muted-foreground/20 mb-5" strokeWidth={1} />
                <p className="text-xl font-medium text-foreground mb-2">Ingen stillinger funnet</p>
                <p className="text-sm text-muted-foreground">Prøv å endre filter, eller send en åpen søknad nedenfor.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filtered.map((job, i) => (
                  <motion.div key={job.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06, duration: 0.5 }}>
                    <Link to={`/karriere/${job.slug}`}
                      className="group block glass rounded-2xl border border-border/10 hover:border-primary/25 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5">
                      <div className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <span className="text-[10px] tracking-[0.2em] uppercase font-medium text-primary bg-primary/10 px-3 py-1 rounded-lg">{job.category}</span>
                            {job.deadline && <span className="text-[10px] text-muted-foreground">Frist: {job.deadline}</span>}
                          </div>
                          <h2 className="text-lg md:text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300 mb-2">{job.title}</h2>
                          {job.intro && <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{job.intro}</p>}
                          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1.5"><MapPin size={12} /> {job.location}</span>
                            <span className="flex items-center gap-1.5"><Briefcase size={12} /> {job.employment_type}</span>
                            <span className="flex items-center gap-1.5"><Clock size={12} /> {job.start_date}</span>
                          </div>
                        </div>
                        <div className="shrink-0">
                          <div className="w-11 h-11 rounded-xl bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground flex items-center justify-center transition-all duration-500 group-hover:shadow-lg group-hover:shadow-primary/20">
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

      {/* Open Application */}
      <section className="py-20 md:py-28 relative overflow-hidden" id="apen-soknad">
        <div className="absolute inset-0 opacity-[0.04]">
          <img src={patternImg} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-medium mb-5">
                <Sparkles size={13} /> Åpen søknad
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Fant du ikke drømmejobben?</h2>
              <p className="text-muted-foreground">Fortell oss hvem du er — vi matcher deg med riktig stilling.</p>
            </motion.div>

            <AnimatePresence mode="wait">
              {openSubmitted ? (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass rounded-3xl border border-border/10 p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                    <Sparkles size={24} className="text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Søknaden er sendt!</h3>
                  <p className="text-sm text-muted-foreground">Takk for interessen. Vi gjennomgår søknaden din og tar kontakt.</p>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={submitOpenApplication} className="glass rounded-3xl border border-border/10 p-7 md:p-10 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="relative">
                      <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/40" />
                      <input value={openForm.full_name} onChange={e => setField("full_name", e.target.value)} required placeholder="Fullt navn *" maxLength={100} className={inputClass} />
                    </div>
                    <div className="relative">
                      <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/40" />
                      <input type="email" value={openForm.email} onChange={e => setField("email", e.target.value)} required placeholder="E-post *" maxLength={255} className={inputClass} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="relative">
                      <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/40" />
                      <input type="tel" value={openForm.phone} onChange={e => setField("phone", e.target.value)} required placeholder="Telefon *" maxLength={20} className={inputClass} />
                    </div>
                    <div className="relative">
                      <Linkedin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/40" />
                      <input value={openForm.linkedin_url} onChange={e => setField("linkedin_url", e.target.value)} placeholder="LinkedIn-profil" maxLength={500} className={inputClass} />
                    </div>
                  </div>
                  <div className="relative">
                    <Globe size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/40" />
                    <input value={openForm.portfolio_url} onChange={e => setField("portfolio_url", e.target.value)} placeholder="Portefølje / nettside (valgfritt)" maxLength={500} className={inputClass} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Hvilken avdeling interesserer deg?</p>
                    <div className="flex flex-wrap gap-2">
                      {DEPT_OPTIONS.map(cat => (
                        <button key={cat} type="button" onClick={() => setField("preferred_category", openForm.preferred_category === cat ? "" : cat)}
                          className={`px-4 py-2 rounded-xl text-xs font-medium transition-all duration-300 border ${
                            openForm.preferred_category === cat
                              ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                              : "bg-muted/20 text-muted-foreground border-border/20 hover:bg-muted/40"
                          }`}>{cat}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Last opp CV (PDF / Word)</p>
                    <CvUpload cvUrl={cvUrl} cvFileName={cvFileName} onUploaded={(url, name) => { setCvUrl(url); setCvFileName(name); }} onRemove={() => { setCvUrl(null); setCvFileName(null); }} />
                  </div>
                  <textarea value={openForm.message} onChange={e => setField("message", e.target.value)} placeholder="Kort om deg selv og din motivasjon…" rows={4} maxLength={3000}
                    className="w-full rounded-xl border border-border/20 bg-muted/10 px-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
                  <button type="submit" disabled={openSubmitting}
                    className="w-full h-13 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                    {openSubmitting ? "Sender…" : <><Send size={15} /> Send åpen søknad</>}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </>
  );
};

export default KarriereStillinger;
