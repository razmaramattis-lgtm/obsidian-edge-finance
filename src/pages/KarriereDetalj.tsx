import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Clock, Briefcase, Building2, Users, Globe, ArrowLeft, Send, Mail, Phone, User, X, ChevronRight, Monitor, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import DOMPurify from "dompurify";
import CvUpload from "@/components/CvUpload";
import KeywordGame from "@/components/karriere/KeywordGame";

// Category images
import regnskapImg from "@/assets/karriere-regnskap.jpg";
import personalImg from "@/assets/karriere-personal.jpg";
import markedImg from "@/assets/karriere-marked.jpg";
import itImg from "@/assets/karriere-it.jpg";
import openAppBg from "@/assets/karriere-open-application-bg.jpg";

const CATEGORY_IMAGES: Record<string, string> = {
  Regnskap: regnskapImg,
  Personal: personalImg,
  Marked: markedImg,
  IT: itImg,
};

interface JobListing {
  id: string;
  title: string;
  slug: string;
  category: string;
  location: string;
  employment_type: string;
  work_hours: string;
  work_language: string;
  work_location: string;
  num_positions: number;
  start_date: string;
  deadline: string | null;
  intro: string | null;
  description: string | null;
  qualifications: string | null;
  tasks: string | null;
  we_offer: string | null;
  about_company: string | null;
  contact_name: string | null;
  contact_title: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  images: string[] | null;
  highlights: string[] | null;
}

const KarriereDetalj = () => {
  const { slug } = useParams<{ slug: string }>();
  const [job, setJob] = useState<JobListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [appForm, setAppForm] = useState({ full_name: "", email: "", phone: "", date_of_birth: "", address: "", city: "", postal_code: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [cvFileName, setCvFileName] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const fetchJob = async () => {
      const { data } = await supabase
        .from("job_listings")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .eq("active", true)
        .single();
      setJob(data as JobListing | null);
      setLoading(false);
    };
    fetchJob();
  }, [slug]);

  const submitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job) return;
    if (!cvUrl) { toast.error("Last opp CV før du sender søknaden."); return; }
    if (!appForm.message.trim()) { toast.error("Skriv en søknadstekst."); return; }
    setSubmitting(true);
    const { error } = await supabase.from("job_applications").insert([{
      job_listing_id: job.id,
      full_name: appForm.full_name.trim(),
      email: appForm.email.trim(),
      phone: appForm.phone.trim(),
      date_of_birth: appForm.date_of_birth || null,
      address: appForm.address.trim() || null,
      city: appForm.city.trim() || null,
      postal_code: appForm.postal_code.trim() || null,
      message: appForm.message.trim() || null,
      cv_url: cvUrl,
      cv_file_name: cvFileName,
    }]);
    if (error) {
      toast.error("Kunne ikke sende søknad. Prøv igjen.");
    } else {
      setSubmitted(true);
      toast.success("Søknad sendt!");
      supabase.functions.invoke("notify", {
        body: {
          type: "job_application",
          data: {
            applicant_name: appForm.full_name.trim(),
            applicant_email: appForm.email.trim(),
            applicant_phone: appForm.phone.trim(),
            job_title: job.title,
            job_category: job.category,
            message: appForm.message.trim() || null,
            cv_url: cvUrl,
            cv_file_name: cvFileName,
          },
        },
      }).catch(() => {});
    }
    setSubmitting(false);
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Laster…</div>;
  if (!job) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
      <p className="text-lg text-muted-foreground">Stillingen ble ikke funnet</p>
      <Link to="/karriere" className="text-primary hover:underline text-sm">← Tilbake til ledige stillinger</Link>
    </div>
  );

  const heroImage = (job.images && job.images.length > 0) ? job.images[0] : CATEGORY_IMAGES[job.category] || openAppBg;

  const renderHtml = (html: string | null) => {
    if (!html) return null;
    return <div className="prose prose-sm max-w-none dark:prose-invert [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5 prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} />;
  };

  const metaBadges = [
    { icon: MapPin, label: job.location },
    { icon: Briefcase, label: job.employment_type },
    { icon: Clock, label: job.start_date },
    { icon: Monitor, label: job.work_location },
    { icon: Globe, label: job.work_language },
    { icon: Users, label: `${job.num_positions} stilling${job.num_positions > 1 ? "er" : ""}` },
  ];

  const sections = [
    { title: "Om stillingen", content: job.description, icon: "📋" },
    { title: "Arbeidsoppgaver", content: job.tasks, icon: "🎯" },
    { title: "Kvalifikasjoner", content: job.qualifications, icon: "✅" },
    { title: "Vi tilbyr", content: job.we_offer, icon: "🎁" },
    { title: "Om Avargo", content: job.about_company, icon: "🏢" },
  ].filter(s => s.content);

  return (
    <>
      <Helmet>
        <title>{job.title} | Jobb hos Avargo</title>
        <meta name="description" content={job.intro || `Se stillingen ${job.title} hos Avargo`} />
        <link rel="canonical" href={`https://avargo.no/karriere/${job.slug}`} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "JobPosting",
          "title": job.title,
          "description": job.intro || job.description || "",
          "datePosted": new Date().toISOString().split("T")[0],
          ...(job.deadline ? { "validThrough": job.deadline } : {}),
          "employmentType": job.employment_type?.includes("heltid") ? "FULL_TIME" : "OTHER",
          "jobLocation": {
            "@type": "Place",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": job.location?.includes("Skien") ? "Skien" : job.location,
              "addressCountry": "NO"
            }
          },
          "hiringOrganization": {
            "@type": "Organization",
            "name": "Avargo",
            "sameAs": "https://avargo.no",
            "logo": "https://avargo.no/logo.png"
          },
          "jobLocationType": job.work_location?.includes("Remote") ? "TELECOMMUTE" : undefined,
          "applicantLocationRequirements": job.work_location?.includes("Remote") ? { "@type": "Country", "name": "Norway" } : undefined,
        })}</script>
      </Helmet>

      {/* Fullwidth Hero */}
      <section className="relative h-[50vh] min-h-[400px] max-h-[550px] overflow-hidden">
        <img src={heroImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10 h-full flex flex-col justify-end pb-10 md:pb-14">
          <Link to="/karriere" className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors mb-6 w-fit">
            <ArrowLeft size={14} /> Alle stillinger
          </Link>
          
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-primary bg-primary/20 backdrop-blur-sm px-3 py-1 rounded-full border border-primary/30">{job.category}</span>
            {job.deadline && <span className="text-xs text-white/50 backdrop-blur-sm bg-white/5 px-3 py-1 rounded-full">Frist: {job.deadline}</span>}
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 max-w-3xl leading-tight">{job.title}</h1>
          <p className="text-white/50 text-sm flex items-center gap-1.5">
            <Building2 size={13} /> Avargo
          </p>
        </div>
      </section>

      {/* Meta badges strip */}
      <div className="border-b border-border/10 bg-muted/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-x-6 gap-y-2 py-4">
            {metaBadges.map((b, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                <b.icon size={14} className="text-primary/70" />
                <span>{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Single column content */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-3xl mx-auto">
          {/* Intro */}
          {job.intro && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="mb-12">
              <p className="text-lg md:text-xl leading-relaxed text-foreground/90 font-light">{job.intro}</p>
            </motion.div>
          )}

          {/* Keyword Game */}
          {job.highlights && job.highlights.length > 0 && (
            <KeywordGame keywords={job.highlights} />
          )}

          {/* Content sections */}
          {sections.map((section, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * (i + 1), duration: 0.5 }}
              className="mb-10">
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                <span className="text-lg">{section.icon}</span> {section.title}
              </h2>
              <div className="pl-0 md:pl-9">
                {renderHtml(section.content)}
              </div>
            </motion.div>
          ))}

          {/* Gallery */}
          {job.images && job.images.length > 1 && (
            <div className="mb-10">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-3">
                <span className="text-lg">📸</span> Fra arbeidsplassen
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {job.images.slice(1).map((img, i) => (
                  <img key={i} src={img} alt="" className="rounded-xl aspect-[4/3] object-cover w-full" />
                ))}
              </div>
            </div>
          )}

          {/* Contact */}
          {job.contact_name && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }}
              className="glass rounded-2xl border border-border/10 p-6 mb-10">
              <h3 className="text-sm font-semibold text-foreground mb-3">Spørsmål om stillingen?</h3>
              <div className="flex flex-wrap items-center gap-6">
                <div>
                  <p className="text-sm font-medium text-foreground">{job.contact_name}</p>
                  {job.contact_title && <p className="text-xs text-muted-foreground">{job.contact_title}</p>}
                </div>
                {job.contact_phone && (
                  <a href={`tel:${job.contact_phone.replace(/\s/g, "")}`} className="flex items-center gap-1.5 text-sm text-primary hover:underline">
                    <Phone size={13} /> {job.contact_phone}
                  </a>
                )}
                {job.contact_email && (
                  <a href={`mailto:${job.contact_email}`} className="flex items-center gap-1.5 text-sm text-primary hover:underline">
                    <Mail size={13} /> {job.contact_email}
                  </a>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Sticky bottom CTA bar */}
      <AnimatePresence>
        {!showForm && !submitted && (
          <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} transition={{ type: "spring", damping: 25 }}
            className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/10 bg-background/80 backdrop-blur-xl">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
              <div className="hidden md:block">
                <p className="text-sm font-medium text-foreground">{job.title}</p>
                <p className="text-xs text-muted-foreground">{job.location} · {job.employment_type}</p>
              </div>
              <button onClick={() => setShowForm(true)}
                className="w-full md:w-auto h-11 px-8 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                <Send size={14} /> Søk på stillingen <ChevronRight size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slide-in application form */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => !submitting && setShowForm(false)} />
            
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-background border-l border-border/10 shadow-2xl overflow-y-auto"
            >
              <div className="p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-foreground">Søk på stillingen</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">{job.title}</p>
                  </div>
                  <button onClick={() => !submitting && setShowForm(false)} className="w-8 h-8 rounded-full bg-muted/30 flex items-center justify-center hover:bg-muted/50 transition-colors">
                    <X size={16} className="text-muted-foreground" />
                  </button>
                </div>

                {submitted ? (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Send size={24} className="text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Søknad mottatt!</h3>
                    <p className="text-sm text-muted-foreground max-w-xs mx-auto">Vi gjennomgår søknaden din og tar kontakt. Lykke til!</p>
                    <button onClick={() => setShowForm(false)} className="mt-6 text-sm text-primary hover:underline">Lukk</button>
                  </motion.div>
                ) : (
                  <form ref={formRef} onSubmit={submitApplication} className="space-y-4">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Fullt navn *</label>
                      <div className="relative">
                        <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/40" />
                        <input value={appForm.full_name} onChange={e => setAppForm({ ...appForm, full_name: e.target.value })} required
                          placeholder="Ditt fulle navn" maxLength={100}
                          className="w-full h-11 pl-9 pr-3 rounded-xl border border-border/20 bg-muted/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">E-post *</label>
                      <div className="relative">
                        <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/40" />
                        <input type="email" value={appForm.email} onChange={e => setAppForm({ ...appForm, email: e.target.value })} required
                          placeholder="din@epost.no" maxLength={255}
                          className="w-full h-11 pl-9 pr-3 rounded-xl border border-border/20 bg-muted/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Telefon *</label>
                      <div className="relative">
                        <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/40" />
                        <input type="tel" value={appForm.phone} onChange={e => setAppForm({ ...appForm, phone: e.target.value })} required
                          placeholder="Telefonnummer" maxLength={20}
                          className="w-full h-11 pl-9 pr-3 rounded-xl border border-border/20 bg-muted/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Fødselsdato *</label>
                      <div className="relative">
                        <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/40" />
                        <input type="date" value={appForm.date_of_birth} onChange={e => setAppForm({ ...appForm, date_of_birth: e.target.value })} required
                          className="w-full h-11 pl-9 pr-3 rounded-xl border border-border/20 bg-muted/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Adresse *</label>
                      <div className="relative">
                        <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/40" />
                        <input value={appForm.address} onChange={e => setAppForm({ ...appForm, address: e.target.value })} required
                          placeholder="Gate og husnummer" maxLength={200}
                          className="w-full h-11 pl-9 pr-3 rounded-xl border border-border/20 bg-muted/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Postnummer *</label>
                        <input value={appForm.postal_code} onChange={e => setAppForm({ ...appForm, postal_code: e.target.value })} required
                          placeholder="0000" maxLength={10}
                          className="w-full h-11 px-3 rounded-xl border border-border/20 bg-muted/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Sted *</label>
                        <input value={appForm.city} onChange={e => setAppForm({ ...appForm, city: e.target.value })} required
                          placeholder="By / sted" maxLength={100}
                          className="w-full h-11 px-3 rounded-xl border border-border/20 bg-muted/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Last opp CV (PDF / Word) *</label>
                      <CvUpload
                        cvUrl={cvUrl}
                        cvFileName={cvFileName}
                        onUploaded={(url, name) => { setCvUrl(url); setCvFileName(name); }}
                        onRemove={() => { setCvUrl(null); setCvFileName(null); }}
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Søknadstekst *</label>
                      <textarea value={appForm.message} onChange={e => setAppForm({ ...appForm, message: e.target.value })} required
                        placeholder="Fortell litt om deg selv og hvorfor du søker…" rows={5} maxLength={2000}
                        className="w-full rounded-xl border border-border/20 bg-muted/10 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none transition-all" />
                    </div>

                    <button type="submit" disabled={submitting}
                      className="w-full h-12 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                      {submitting ? "Sender…" : <><Send size={14} /> Send søknad</>}
                    </button>

                    <p className="text-[11px] text-muted-foreground/50 text-center leading-relaxed">
                      Ved å sende inn samtykker du til at vi behandler søknaden din i henhold til vår personvernpolicy.
                    </p>
                  </form>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default KarriereDetalj;
