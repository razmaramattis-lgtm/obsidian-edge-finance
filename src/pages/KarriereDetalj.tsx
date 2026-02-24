import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Clock, Briefcase, Building2, Users, Globe, ArrowLeft, Send, Mail, Phone, User } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import DOMPurify from "dompurify";

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
}

const KarriereDetalj = () => {
  const { slug } = useParams<{ slug: string }>();
  const [job, setJob] = useState<JobListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [appForm, setAppForm] = useState({ full_name: "", email: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const fetch = async () => {
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
    fetch();
  }, [slug]);

  const submitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job) return;
    setSubmitting(true);
    const { error } = await supabase.from("job_applications").insert([{
      job_listing_id: job.id,
      full_name: appForm.full_name.trim(),
      email: appForm.email.trim(),
      phone: appForm.phone.trim(),
      message: appForm.message.trim() || null,
    }]);
    if (error) {
      toast.error("Kunne ikke sende søknad. Prøv igjen.");
    } else {
      setSubmitted(true);
      toast.success("Søknad sendt!");
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

  const renderHtml = (html: string | null) => {
    if (!html) return null;
    return <div className="prose prose-sm max-w-none dark:prose-invert [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} />;
  };

  const metaFields = [
    { label: "Stillingstittel", value: job.title },
    { label: "Oppstart", value: job.start_date },
    { label: "Type ansettelse", value: job.employment_type },
    { label: "Arbeidstid", value: job.work_hours },
    { label: "Arbeidsspråk", value: job.work_language },
    { label: "Antall stillinger", value: String(job.num_positions) },
    { label: "Arbeidssted", value: job.work_location },
  ];

  return (
    <>
      <Helmet>
        <title>{job.title} | Jobb hos Avargo</title>
        <meta name="description" content={job.intro || `Se stillingen ${job.title} hos Avargo`} />
      </Helmet>

      <div className="pt-28 pb-20">
        <div className="container mx-auto px-4">
          {/* Back link */}
          <Link to="/karriere" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft size={14} /> Alle ledige stillinger
          </Link>

          <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
            {/* Main content */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              {/* Title block */}
              <div className="mb-8">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="text-[10px] tracking-[0.2em] uppercase font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">{job.category}</span>
                  {job.deadline && <span className="text-xs text-muted-foreground">Søknadsfrist: {job.deadline}</span>}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">{job.title}</h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Building2 size={14} /> <span className="font-medium text-foreground">Avargo</span>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5"><MapPin size={14} /> {job.location}</span>
                </div>
              </div>

              {/* Intro */}
              {job.intro && (
                <div className="glass rounded-2xl p-6 border border-border/10 mb-6">
                  <p className="text-base leading-relaxed text-foreground/90">{job.intro}</p>
                </div>
              )}

              {/* Meta grid */}
              <div className="glass rounded-2xl border border-border/10 p-6 mb-8">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {metaFields.map((f, i) => (
                    <div key={i}>
                      <p className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground/60 mb-0.5">{f.label}</p>
                      <p className="text-sm font-medium text-foreground">{f.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Content sections */}
              {job.description && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2"><Users size={18} className="text-primary" /> Hva vi ser etter</h2>
                  {renderHtml(job.description)}
                </div>
              )}

              {job.tasks && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2"><Briefcase size={18} className="text-primary" /> Arbeidsoppgaver</h2>
                  {renderHtml(job.tasks)}
                </div>
              )}

              {job.qualifications && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2"><Globe size={18} className="text-primary" /> Kvalifikasjoner</h2>
                  {renderHtml(job.qualifications)}
                </div>
              )}

              {job.we_offer && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-foreground mb-4">Vi tilbyr</h2>
                  {renderHtml(job.we_offer)}
                </div>
              )}

              {job.about_company && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-foreground mb-4">Om Avargo</h2>
                  {renderHtml(job.about_company)}
                </div>
              )}
            </motion.div>

            {/* Sidebar */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}
              className="lg:sticky lg:top-28 space-y-5">
              
              {/* Application form */}
              <div className="glass rounded-2xl border border-border/15 p-6">
                <h3 className="text-lg font-bold text-foreground mb-1">Søk på stillingen</h3>
                <p className="text-xs text-muted-foreground mb-5">Fyll ut skjemaet under, så tar vi kontakt med deg.</p>

                {submitted ? (
                  <div className="text-center py-8">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                      <Send size={20} className="text-primary" />
                    </div>
                    <p className="font-semibold text-foreground mb-1">Søknad mottatt!</p>
                    <p className="text-xs text-muted-foreground">Vi gjennomgår søknaden din og tar kontakt.</p>
                  </div>
                ) : (
                  <form ref={formRef} onSubmit={submitApplication} className="space-y-3">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Fullt navn *</label>
                      <div className="relative">
                        <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
                        <input value={appForm.full_name} onChange={e => setAppForm({ ...appForm, full_name: e.target.value })} required
                          placeholder="Ditt fulle navn" maxLength={100}
                          className="w-full h-10 pl-9 pr-3 rounded-xl border border-border/20 bg-muted/20 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">E-post *</label>
                      <div className="relative">
                        <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
                        <input type="email" value={appForm.email} onChange={e => setAppForm({ ...appForm, email: e.target.value })} required
                          placeholder="din@epost.no" maxLength={255}
                          className="w-full h-10 pl-9 pr-3 rounded-xl border border-border/20 bg-muted/20 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Telefon *</label>
                      <div className="relative">
                        <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
                        <input type="tel" value={appForm.phone} onChange={e => setAppForm({ ...appForm, phone: e.target.value })} required
                          placeholder="Telefonnummer" maxLength={20}
                          className="w-full h-10 pl-9 pr-3 rounded-xl border border-border/20 bg-muted/20 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Melding</label>
                      <textarea value={appForm.message} onChange={e => setAppForm({ ...appForm, message: e.target.value })}
                        placeholder="Fortell litt om deg selv og hvorfor du søker…" rows={4} maxLength={2000}
                        className="w-full rounded-xl border border-border/20 bg-muted/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
                    </div>
                    <button type="submit" disabled={submitting}
                      className="w-full h-11 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2">
                      {submitting ? "Sender…" : <><Send size={14} /> Send søknad</>}
                    </button>
                  </form>
                )}
              </div>

              {/* Contact info */}
              {job.contact_name && (
                <div className="glass rounded-2xl border border-border/15 p-6">
                  <h3 className="text-sm font-semibold text-foreground mb-3">Spørsmål om stillingen?</h3>
                  <div className="space-y-2">
                    <p className="text-sm"><span className="font-medium">{job.contact_name}</span></p>
                    {job.contact_title && <p className="text-xs text-muted-foreground">{job.contact_title}</p>}
                    {job.contact_phone && (
                      <a href={`tel:${job.contact_phone.replace(/\s/g, "")}`} className="flex items-center gap-2 text-sm text-primary hover:underline">
                        <Phone size={13} /> {job.contact_phone}
                      </a>
                    )}
                    {job.contact_email && (
                      <a href={`mailto:${job.contact_email}`} className="flex items-center gap-2 text-sm text-primary hover:underline">
                        <Mail size={13} /> {job.contact_email}
                      </a>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default KarriereDetalj;
