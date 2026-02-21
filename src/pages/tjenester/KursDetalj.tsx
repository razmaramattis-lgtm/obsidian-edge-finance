import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  ArrowLeft, ArrowRight, CheckCircle2, Clock, GraduationCap,
  Users, Phone, X, BookOpen, Target, Award
} from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { supabase } from "@/integrations/supabase/client";
import DOMPurify from "dompurify";

interface CourseDetail {
  id: string;
  name: string;
  description: string | null;
  long_description: string | null;
  category: string;
  slug: string;
  highlights: string[] | null;
  target_audience: string | null;
  duration: string | null;
  meta_title: string | null;
  meta_description: string | null;
}

const KursDetalj = () => {
  const { slug } = useParams<{ slug: string }>();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      const { data } = await supabase
        .from("courses")
        .select("id, name, description, long_description, category, slug, highlights, target_audience, duration, meta_title, meta_description")
        .eq("slug", slug)
        .eq("active", true)
        .single();
      setCourse(data as CourseDetail | null);
      setLoading(false);
    };
    if (slug) fetchCourse();
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await supabase.functions.invoke("contact-submit", {
        body: {
          company_name: `Kursbestilling: ${course.name}`,
          contact_person: form.name,
          email: form.email,
          phone: form.phone,
          message: `Bestilling av kurs: ${course.name} (${course.category})`,
          package: "Kursbestilling",
        },
      });
    } catch (err) {
      console.error("Submit error:", err);
    }
    setSending(false);
    setSubmitted(true);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-muted-foreground text-sm">Laster kurs…</div>
    </div>
  );

  if (!course) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <GraduationCap size={40} className="text-muted-foreground/30" />
      <p className="text-muted-foreground">Kurset ble ikke funnet.</p>
      <Link to="/tjenester/kurs" className="text-sm text-primary hover:underline">← Tilbake til alle kurs</Link>
    </div>
  );

  const highlights = Array.isArray(course.highlights) ? course.highlights : [];

  return (
    <>
      <Helmet>
        <title>{course.meta_title || `${course.name} | Avargo Kurs`}</title>
        <meta name="description" content={course.meta_description || course.description || `Kurs i ${course.name} fra Avargo.`} />
      </Helmet>

      {/* Hero */}
      <section className="py-28 md:py-40 relative overflow-hidden">
        <div className="absolute inset-0 ambient-glow opacity-30" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl"
          >
            <Link to="/tjenester/kurs" className="inline-flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase text-muted-foreground/50 hover:text-foreground transition-colors mb-8">
              <ArrowLeft size={12} /> Alle kurs
            </Link>
            <p className="text-[10px] tracking-[0.45em] uppercase text-primary mb-5">{course.category}</p>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-7xl leading-[1.05] mb-8">
              {course.name}
            </h1>
            {course.description && (
              <p className="text-base md:text-xl text-muted-foreground font-light leading-relaxed max-w-2xl mb-10">
                {course.description}
              </p>
            )}
            <div className="flex flex-wrap gap-4 items-center mb-10">
              {course.duration && (
                <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock size={14} className="text-primary" /> {course.duration}
                </span>
              )}
              <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <Award size={14} className="text-primary" /> Kursbevis inkludert
              </span>
            </div>
            <button
              onClick={() => setShowBooking(true)}
              className="group inline-flex items-center gap-3 px-10 py-4 bg-primary text-primary-foreground text-sm font-medium tracking-wider rounded-full glow-rose hover:scale-[1.02] transition-all duration-500"
            >
              Bestill kurs
              <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
            </button>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6"><div className="line-accent" /></div>

      {/* Hva vi kan gjøre for deg */}
      {highlights.length > 0 && (
        <section className="py-24 md:py-40">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-14 md:gap-24 items-start">
              <AnimatedSection>
                <p className="text-[10px] tracking-[0.4em] uppercase text-secondary mb-5">Hva vi kan gjøre for deg</p>
                <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-6 leading-snug">
                  Konkret verdi — <span className="italic text-gradient-rose">ikke bare teori.</span>
                </h2>
                <p className="text-muted-foreground font-light leading-relaxed text-sm md:text-base">
                  Etter dette kurset sitter du igjen med praktisk kunnskap du kan bruke i hverdagen – enten du er gründer, økonomiansvarlig eller daglig leder.
                </p>
              </AnimatedSection>
              <AnimatedSection delay={0.15}>
                <ul className="space-y-3">
                  {highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-4 p-4 glass rounded-2xl border border-border/10">
                      <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <CheckCircle2 size={14} className="text-primary" />
                      </div>
                      <span className="text-sm font-light text-foreground/80 pt-1">{h}</span>
                    </li>
                  ))}
                </ul>
              </AnimatedSection>
            </div>
          </div>
        </section>
      )}

      {/* Omfattende innhold */}
      {course.long_description && (
        <>
          <div className="container mx-auto px-4 md:px-6"><div className="line-accent" /></div>
          <section className="py-24 md:py-40">
            <div className="container mx-auto px-4 md:px-6 max-w-3xl">
              <AnimatedSection>
                <p className="text-[10px] tracking-[0.4em] uppercase text-secondary mb-5">Om kurset</p>
                <div
                  className="prose prose-invert prose-sm md:prose-base max-w-none font-light leading-relaxed
                    prose-headings:font-heading prose-headings:text-foreground
                    prose-p:text-muted-foreground prose-li:text-muted-foreground
                    prose-strong:text-foreground prose-a:text-primary"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(course.long_description) }}
                />
              </AnimatedSection>
            </div>
          </section>
        </>
      )}

      {/* Hvem passer kurset for */}
      {course.target_audience && (
        <>
          <div className="container mx-auto px-4 md:px-6"><div className="line-accent" /></div>
          <section className="py-24 md:py-40 relative">
            <div className="absolute inset-0 ambient-glow opacity-15" />
            <div className="container mx-auto px-4 md:px-6 max-w-3xl relative">
              <AnimatedSection>
                <p className="text-[10px] tracking-[0.4em] uppercase text-secondary mb-5">Hvem passer kurset for</p>
                <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-8 leading-snug">
                  Er dette <span className="italic text-gradient-rose">riktig for deg?</span>
                </h2>
                <div
                  className="prose prose-invert prose-sm md:prose-base max-w-none font-light
                    prose-p:text-muted-foreground prose-li:text-muted-foreground
                    prose-strong:text-foreground"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(course.target_audience) }}
                />
              </AnimatedSection>
            </div>
          </section>
        </>
      )}

      {/* CTA */}
      <section className="py-24 md:py-32 border-t border-border/10 text-center relative">
        <div className="absolute inset-0 ambient-glow opacity-25" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <AnimatedSection>
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-8">
              <GraduationCap size={18} className="text-primary" strokeWidth={1.5} />
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-5 leading-snug max-w-2xl mx-auto">
              Klar for å booke?
            </h2>
            <p className="text-muted-foreground font-light mb-10 max-w-md mx-auto text-sm">
              Bestill kurset direkte og vi kontakter deg innen 24 timer.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setShowBooking(true)}
                className="group inline-flex items-center gap-3 px-10 py-4 bg-primary text-primary-foreground text-sm font-medium tracking-wider rounded-full glow-rose hover:scale-[1.02] transition-all duration-500"
              >
                Bestill kurs
                <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
              </button>
              <Link to="/tjenester/kurs" className="inline-flex items-center gap-2 px-8 py-4 text-sm text-foreground/50 tracking-wider rounded-full border border-border/20 hover:border-primary/20 hover:text-foreground transition-all">
                <BookOpen size={14} /> Se alle kurs
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Booking Modal */}
      {showBooking && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setShowBooking(false)}
        >
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-lg glass rounded-3xl border border-border/20 p-8 md:p-10"
            onClick={e => e.stopPropagation()}
          >
            <button onClick={() => setShowBooking(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X size={18} />
            </button>
            {submitted ? (
              <div className="text-center py-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={24} className="text-primary" />
                </div>
                <h3 className="font-heading text-2xl mb-2">Bestilling mottatt!</h3>
                <p className="text-sm text-muted-foreground font-light mb-2">Vi kontakter deg innen 24 timer for å avtale tid.</p>
                <p className="text-xs text-muted-foreground">Kurs: <span className="text-foreground">{course.name}</span></p>
                <button onClick={() => setShowBooking(false)} className="mt-6 px-6 py-2.5 bg-primary text-primary-foreground rounded-full text-sm hover:opacity-90">Lukk</button>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <p className="text-[9px] tracking-[0.4em] uppercase text-primary mb-2">Bestill kurs</p>
                  <h3 className="font-heading text-xl md:text-2xl mb-1">{course.name}</h3>
                  <p className="text-xs text-muted-foreground">{course.category}</p>
                </div>
                <div className="line-accent mb-6" />
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">Fullt navn *</label>
                    <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="Ola Nordmann"
                      className="w-full h-11 rounded-xl border border-border/30 bg-muted/20 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">Telefon *</label>
                    <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required type="tel" placeholder="+47 XXX XX XXX"
                      className="w-full h-11 rounded-xl border border-border/30 bg-muted/20 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">E-post *</label>
                    <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required type="email" placeholder="ola@firma.no"
                      className="w-full h-11 rounded-xl border border-border/30 bg-muted/20 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                  </div>
                  <div className="glass rounded-xl p-3 border border-border/10">
                    <p className="text-xs text-muted-foreground font-light">
                      <span className="text-foreground font-medium">Valgt kurs:</span> {course.name}
                    </p>
                  </div>
                  <button type="submit" disabled={sending}
                    className="w-full py-3.5 bg-primary text-primary-foreground rounded-full text-sm font-medium tracking-wider glow-rose hover:scale-[1.01] transition-all disabled:opacity-50">
                    {sending ? "Sender bestilling…" : "Bestill kurs"}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default KursDetalj;
