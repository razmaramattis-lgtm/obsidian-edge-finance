import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Zap, Shield, Clock, Users, ArrowRight, Send, User, Mail, Phone, Linkedin, Globe, CheckCircle2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CvUpload from "@/components/CvUpload";
import freelancerImg from "@/assets/karriere-freelancer.jpg";
import networkImg from "@/assets/karriere-abstract-network.jpg";
import patternImg from "@/assets/karriere-pattern.jpg";

const DEPT_OPTIONS = ["Regnskap", "Personal", "Marked", "IT"];

const KarriereAvargoFri = () => {
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", linkedin_url: "", portfolio_url: "", preferred_category: "", message: "" });
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [cvFileName, setCvFileName] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const setField = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }));
  const inputClass = "w-full h-12 pl-10 pr-3 rounded-xl border border-border/20 bg-muted/10 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-secondary/30 transition-all";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name.trim() || !form.email.trim() || !form.phone.trim()) return;
    setSubmitting(true);
    const { error } = await supabase.from("open_applications").insert([{
      full_name: form.full_name.trim(), email: form.email.trim(), phone: form.phone.trim(),
      linkedin_url: form.linkedin_url.trim() || null, portfolio_url: form.portfolio_url.trim() || null,
      preferred_category: form.preferred_category || null, message: `[AVARGO FRI] ${form.message.trim()}`,
      cv_url: cvUrl, cv_file_name: cvFileName,
    }]);
    if (error) { const { toast } = await import("sonner"); toast.error("Noe gikk galt. Prøv igjen."); }
    else {
      setSubmitted(true);
      supabase.functions.invoke("notify", { body: { type: "open_application", data: { applicant_name: form.full_name.trim(), applicant_email: form.email.trim(), message: `[AVARGO FRI] ${form.message.trim()}`, cv_url: cvUrl } } }).catch(() => {});
    }
    setSubmitting(false);
  };

  return (
    <>
      <Helmet>
        <title>Avargo Fri | Frilans og fleksibelt samarbeid</title>
        <meta name="description" content="Bli en del av Avargo Fri — vår fleksible modell for frilansere og prosjektbaserte samarbeidspartnere innen regnskap, HR, marked og IT." />
      </Helmet>

      {/* Hero — cinematic */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={freelancerImg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
        </div>

        {/* Animated grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "linear-gradient(hsl(var(--secondary) / 0.4) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--secondary) / 0.4) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }} />

        <div className="container mx-auto px-4 relative z-10 py-20">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-secondary/30 bg-secondary/10 text-secondary text-xs font-medium mb-8 backdrop-blur-sm"
            >
              <Zap size={13} /> Ny modell
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
              <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="block">Avargo</motion.span>
              <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="block text-gradient-teal">Fri</motion.span>
            </h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mb-10">
              En fleksibel samarbeidsmodell for deg som vil jobbe på dine premisser — enten som frilanser eller med prosjektbasert tilknytning.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Two models */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
              <p className="text-[11px] tracking-[0.3em] uppercase text-secondary/70 font-medium mb-3">To modeller</p>
              <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Velg det som passer deg</h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: Zap, title: "Frilansnettverk", color: "secondary",
                  desc: "Du driver ditt eget foretak og tar oppdrag gjennom Avargo. Vi kobler deg med kunder som trenger din kompetanse.",
                  items: ["Egne kunder via Avargo", "Fleksibel arbeidstid", "Faktuerer direkte", "Tilgang til fagmiljø og verktøy"],
                },
                {
                  icon: Users, title: "Fleksibel tilknytning", color: "primary",
                  desc: "En prosjektbasert ansettelsesform der du jobber med utvalgte oppdrag og kunder med tilhørighet til teamet.",
                  items: ["Del av Avargo-teamet", "Velg egne prosjekter", "Sosiale og faglige goder", "Tydelige rammer og trygghet"],
                },
              ].map((model, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.7 }}
                  className="glass rounded-3xl border border-border/10 p-8 md:p-10 hover:border-secondary/20 transition-all duration-500 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                    <model.icon size={24} className="text-secondary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">{model.title}</h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">{model.desc}</p>
                  <ul className="space-y-3">
                    {model.items.map((item, j) => (
                      <motion.li
                        key={j}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + j * 0.08 }}
                        className="flex items-center gap-3 text-sm text-foreground"
                      >
                        <CheckCircle2 size={15} className="text-secondary shrink-0" /> {item}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits with background */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]">
          <img src={networkImg} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-background/90" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Hva du får</h2>
          </motion.div>
          <div className="grid md:grid-cols-4 gap-5 max-w-5xl mx-auto">
            {[
              { icon: Zap, title: "Spennende oppdrag", desc: "Tilgang til et bredt spekter av kunder og prosjekter." },
              { icon: Shield, title: "Sterk infrastruktur", desc: "Systemer, verktøy og støtte fra et etablert selskap." },
              { icon: Users, title: "Faglig fellesskap", desc: "Bli en del av et engasjert miljø med spesialister." },
              { icon: Clock, title: "Full fleksibilitet", desc: "Du bestemmer selv tempo, omfang og arbeidstid." },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="glass rounded-2xl p-7 border border-border/10 text-center hover:border-secondary/20 transition-all duration-500 group"
              >
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500">
                  <item.icon size={22} className="text-secondary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Application form */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]">
          <img src={patternImg} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-secondary/30 bg-secondary/10 text-secondary text-xs font-medium mb-5">
                <Sparkles size={13} /> Bli med
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Interessert?</h2>
              <p className="text-muted-foreground">Fortell oss litt om deg selv og hva du kan bidra med.</p>
            </motion.div>

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass rounded-3xl border border-border/10 p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-5">
                    <Sparkles size={24} className="text-secondary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Takk for interessen!</h3>
                  <p className="text-sm text-muted-foreground">Vi gjennomgår henvendelsen din og tar kontakt.</p>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={handleSubmit} className="glass rounded-3xl border border-border/10 p-7 md:p-10 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="relative">
                      <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/40" />
                      <input value={form.full_name} onChange={e => setField("full_name", e.target.value)} required placeholder="Fullt navn *" maxLength={100} className={inputClass} />
                    </div>
                    <div className="relative">
                      <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/40" />
                      <input type="email" value={form.email} onChange={e => setField("email", e.target.value)} required placeholder="E-post *" maxLength={255} className={inputClass} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="relative">
                      <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/40" />
                      <input type="tel" value={form.phone} onChange={e => setField("phone", e.target.value)} required placeholder="Telefon *" maxLength={20} className={inputClass} />
                    </div>
                    <div className="relative">
                      <Linkedin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/40" />
                      <input value={form.linkedin_url} onChange={e => setField("linkedin_url", e.target.value)} placeholder="LinkedIn-profil" maxLength={500} className={inputClass} />
                    </div>
                  </div>
                  <div className="relative">
                    <Globe size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/40" />
                    <input value={form.portfolio_url} onChange={e => setField("portfolio_url", e.target.value)} placeholder="Portefølje / nettside" maxLength={500} className={inputClass} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Hvilken avdeling?</p>
                    <div className="flex flex-wrap gap-2">
                      {DEPT_OPTIONS.map(cat => (
                        <button key={cat} type="button" onClick={() => setField("preferred_category", form.preferred_category === cat ? "" : cat)}
                          className={`px-4 py-2 rounded-xl text-xs font-medium transition-all duration-300 border ${
                            form.preferred_category === cat
                              ? "bg-secondary text-secondary-foreground border-secondary shadow-md"
                              : "bg-muted/20 text-muted-foreground border-border/20 hover:bg-muted/40"
                          }`}>{cat}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Last opp CV (PDF / Word)</p>
                    <CvUpload cvUrl={cvUrl} cvFileName={cvFileName} onUploaded={(url, name) => { setCvUrl(url); setCvFileName(name); }} onRemove={() => { setCvUrl(null); setCvFileName(null); }} />
                  </div>
                  <textarea value={form.message} onChange={e => setField("message", e.target.value)} placeholder="Fortell oss om din erfaring og hva slags samarbeid du ser for deg…" rows={5} maxLength={3000}
                    className="w-full rounded-xl border border-border/20 bg-muted/10 px-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-secondary/30 resize-none" />
                  <button type="submit" disabled={submitting}
                    className="w-full h-13 bg-secondary text-secondary-foreground rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-secondary/20">
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
