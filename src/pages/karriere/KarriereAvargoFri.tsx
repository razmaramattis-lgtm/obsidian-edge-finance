import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Zap, Shield, Clock, Users, ArrowRight, Send, User, Mail, Phone, Linkedin, Globe, CheckCircle2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CvUpload from "@/components/CvUpload";

const DEPT_OPTIONS = ["Regnskap", "Personal", "Marked", "IT"];

const KarriereAvargoFri = () => {
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", linkedin_url: "", portfolio_url: "", preferred_category: "", message: "" });
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [cvFileName, setCvFileName] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const setField = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }));
  const inputClass = "w-full h-11 pl-10 pr-3 rounded-xl border border-border/20 bg-muted/10 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name.trim() || !form.email.trim() || !form.phone.trim()) return;
    setSubmitting(true);
    const { error } = await supabase.from("open_applications").insert([{
      full_name: form.full_name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      linkedin_url: form.linkedin_url.trim() || null,
      portfolio_url: form.portfolio_url.trim() || null,
      preferred_category: form.preferred_category || null,
      message: `[AVARGO FRI] ${form.message.trim()}`,
      cv_url: cvUrl,
      cv_file_name: cvFileName,
    }]);
    if (error) {
      const { toast } = await import("sonner");
      toast.error("Noe gikk galt. Prøv igjen.");
    } else {
      setSubmitted(true);
      supabase.functions.invoke("notify", {
        body: { type: "open_application", data: { applicant_name: form.full_name.trim(), applicant_email: form.email.trim(), applicant_phone: form.phone.trim(), linkedin_url: form.linkedin_url.trim() || null, portfolio_url: form.portfolio_url.trim() || null, preferred_category: form.preferred_category || null, message: `[AVARGO FRI] ${form.message.trim()}`, cv_url: cvUrl, cv_file_name: cvFileName } },
      }).catch(() => {});
    }
    setSubmitting(false);
  };

  return (
    <>
      <Helmet>
        <title>Avargo Fri | Frilans og fleksibelt samarbeid</title>
        <meta name="description" content="Bli en del av Avargo Fri — vår fleksible modell for frilansere og prosjektbaserte samarbeidspartnere innen regnskap, HR, marked og IT." />
      </Helmet>

      {/* Hero */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-medium mb-8">
              <Zap size={13} /> Ny modell
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Avargo <span className="text-primary">Fri</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10">
              En fleksibel samarbeidsmodell for deg som vil jobbe på dine premisser — enten som frilanser eller med prosjektbasert tilknytning. 
              Få tilgang til spennende oppdrag, et sterkt fagmiljø og infrastrukturen til et etablert selskap.
            </p>
          </motion.div>
        </div>
      </section>

      {/* What is Avargo Fri */}
      <section className="py-16 md:py-24 bg-muted/5">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
              <p className="text-[11px] tracking-[0.3em] uppercase text-primary/70 font-medium mb-3">To modeller</p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Velg det som passer deg</h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="glass rounded-2xl border border-border/10 p-8 hover:border-primary/20 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                  <Zap size={22} className="text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Frilansnettverk</h3>
                <p className="text-muted-foreground leading-relaxed mb-5">
                  Du driver ditt eget foretak og tar oppdrag gjennom Avargo. Vi kobler deg med kunder som trenger din kompetanse, 
                  og du bestemmer selv når og hvor mye du jobber.
                </p>
                <ul className="space-y-2">
                  {["Egne kunder via Avargo", "Fleksibel arbeidstid", "Faktuerer direkte", "Tilgang til fagmiljø og verktøy"].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                      <CheckCircle2 size={14} className="text-primary shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                className="glass rounded-2xl border border-border/10 p-8 hover:border-primary/20 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                  <Users size={22} className="text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Fleksibel tilknytning</h3>
                <p className="text-muted-foreground leading-relaxed mb-5">
                  En prosjektbasert ansettelsesform der du jobber med utvalgte oppdrag og kunder. Du får tilhørighet til teamet, 
                  men friheten til å styre egen hverdag.
                </p>
                <ul className="space-y-2">
                  {["Del av Avargo-teamet", "Velg egne prosjekter", "Sosiale og faglige goder", "Tydelige rammer og trygghet"].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                      <CheckCircle2 size={14} className="text-primary shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Hva du får</h2>
          </motion.div>
          <div className="grid md:grid-cols-4 gap-5 max-w-5xl mx-auto">
            {[
              { icon: Zap, title: "Spennende oppdrag", desc: "Tilgang til et bredt spekter av kunder og prosjekter." },
              { icon: Shield, title: "Sterk infrastruktur", desc: "Systemer, verktøy og støtte fra et etablert selskap." },
              { icon: Users, title: "Faglig fellesskap", desc: "Bli en del av et engasjert miljø med spesialister på tvers." },
              { icon: Clock, title: "Full fleksibilitet", desc: "Du bestemmer selv tempo, omfang og arbeidstid." },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="glass rounded-2xl p-6 border border-border/10 text-center hover:border-primary/20 transition-colors">
                <item.icon size={24} className="text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-2 text-sm">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Application form */}
      <section className="py-16 md:py-24 bg-muted/5">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-medium mb-4">
                <Sparkles size={13} /> Bli med
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Interessert?</h2>
              <p className="text-muted-foreground">Fortell oss litt om deg selv og hva du kan bidra med. Vi tar kontakt.</p>
            </motion.div>

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass rounded-2xl border border-border/10 p-10 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Sparkles size={24} className="text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Takk for interessen!</h3>
                  <p className="text-sm text-muted-foreground">Vi gjennomgår henvendelsen din og tar kontakt.</p>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={handleSubmit} className="glass rounded-2xl border border-border/10 p-6 md:p-8 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="relative">
                      <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/40" />
                      <input value={form.full_name} onChange={e => setField("full_name", e.target.value)} required placeholder="Fullt navn *" maxLength={100} className={inputClass} />
                    </div>
                    <div className="relative">
                      <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/40" />
                      <input type="email" value={form.email} onChange={e => setField("email", e.target.value)} required placeholder="E-post *" maxLength={255} className={inputClass} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="relative">
                      <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/40" />
                      <input type="tel" value={form.phone} onChange={e => setField("phone", e.target.value)} required placeholder="Telefon *" maxLength={20} className={inputClass} />
                    </div>
                    <div className="relative">
                      <Linkedin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/40" />
                      <input value={form.linkedin_url} onChange={e => setField("linkedin_url", e.target.value)} placeholder="LinkedIn-profil" maxLength={500} className={inputClass} />
                    </div>
                  </div>
                  <div className="relative">
                    <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/40" />
                    <input value={form.portfolio_url} onChange={e => setField("portfolio_url", e.target.value)} placeholder="Portefølje / nettside (valgfritt)" maxLength={500} className={inputClass} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Hvilken avdeling interesserer deg?</p>
                    <div className="flex flex-wrap gap-2">
                      {DEPT_OPTIONS.map(cat => (
                        <button key={cat} type="button" onClick={() => setField("preferred_category", form.preferred_category === cat ? "" : cat)}
                          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                            form.preferred_category === cat
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-muted/30 text-muted-foreground border-border/20 hover:bg-muted/50"
                          }`}>{cat}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Last opp CV (PDF / Word)</p>
                    <CvUpload cvUrl={cvUrl} cvFileName={cvFileName} onUploaded={(url, name) => { setCvUrl(url); setCvFileName(name); }} onRemove={() => { setCvUrl(null); setCvFileName(null); }} />
                  </div>
                  <textarea value={form.message} onChange={e => setField("message", e.target.value)} placeholder="Fortell oss om din erfaring, kompetanse og hva slags samarbeid du ser for deg…" rows={5} maxLength={3000}
                    className="w-full rounded-xl border border-border/20 bg-muted/10 px-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
                  <button type="submit" disabled={submitting}
                    className="w-full h-12 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                    {submitting ? "Sender…" : <><Send size={15} /> Send henvendelse</>}
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

export default KarriereAvargoFri;
