import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, ChevronDown, Clock, CheckCircle2, Send, ShieldCheck, User, Phone, Mail, Building2, FileText } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { Link } from "react-router-dom";

const EnTilEnRegnskap = () => {
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ firma: "", navn: "", telefon: "", epost: "", melding: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputClass = "w-full h-11 rounded-xl border border-border/30 bg-muted/30 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-muted-foreground/50";
  const labelClass = "text-xs font-medium text-muted-foreground mb-1 block";

  return (
    <>
      <Helmet>
        <title>1-1 Regnskap – Personlig rådgivning | Avargo</title>
        <meta name="description" content="Book en personlig gjennomgang av regnskapet med en statsautorisert rådgiver. Få skreddersydd innsikt og konkrete anbefalinger for din bedrift." />
      </Helmet>

      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-background via-background to-muted/20">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)", backgroundSize: "40px 40px" }} />
        <div className="container mx-auto px-6 py-24 text-center relative z-10">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-6">
              <ShieldCheck size={14} /> Statsautorisert rådgiver
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              1-1 <span className="text-primary">Regnskap</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Få en personlig gjennomgang av regnskapet ditt med en statsautorisert rådgiver. Konkret, skreddersydd og handlingsrettet.
            </p>
            <button
              onClick={() => {
                setShowForm(true);
                setTimeout(() => document.getElementById("booking-form")?.scrollIntoView({ behavior: "smooth" }), 100);
              }}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity glow-rose"
            >
              Book din time <ChevronDown size={16} />
            </button>
          </AnimatedSection>
        </div>
      </section>

      {/* Hva du får */}
      <section className="py-20 bg-muted/10">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Hva du får i en 1-1 gjennomgang</h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Calculator, title: "Regnskapsanalyse", desc: "Grundig gjennomgang av resultat, balanse og nøkkeltall – med forklaringer du faktisk forstår." },
              { icon: Clock, title: "Dedikert tid", desc: "En hel time kun for deg og din bedrift. Ingen hastverk, ingen standardsvar." },
              { icon: FileText, title: "Handlingsplan", desc: "Du får konkrete anbefalinger og neste steg du kan ta for å forbedre økonomien." },
            ].map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="glass rounded-2xl p-6 border border-border/20 text-center h-full">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="text-primary" size={22} />
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Hvem passer det for */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-3xl">
          <AnimatedSection>
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Hvem passer det for?</h2>
            <div className="space-y-4">
              {[
                "Gründere som vil forstå tallene bak virksomheten sin bedre",
                "Bedriftseiere som ønsker en second opinion på regnskapet",
                "Selskaper i vekst som trenger strategisk økonomisk rådgivning",
                "Deg som har spørsmål til årsoppgjøret eller skattemeldingen",
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="text-primary shrink-0 mt-0.5" size={18} />
                  <p className="text-muted-foreground">{text}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Kontaktskjema (skjult til klikk) */}
      <section id="booking-form" className="py-20 bg-muted/10">
        <div className="container mx-auto px-6 max-w-xl">
          <AnimatePresence>
            {!showForm ? (
              <motion.div key="cta" initial={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                <AnimatedSection>
                  <h2 className="text-2xl font-bold mb-4">Klar for en gjennomgang?</h2>
                  <p className="text-muted-foreground mb-6">Klikk under for å sende oss en forespørsel, så tar vi kontakt for å avtale tid.</p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity glow-rose"
                  >
                    Send forespørsel <Send size={16} />
                  </button>
                </AnimatedSection>
              </motion.div>
            ) : !submitted ? (
              <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <h2 className="text-2xl font-bold mb-2 text-center">Book 1-1 regnskap</h2>
                <p className="text-muted-foreground text-sm text-center mb-8">Fyll ut skjemaet så kontakter vi deg for å avtale tidspunkt.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className={labelClass}>Firmanavn</label>
                    <div className="relative">
                      <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/40" />
                      <input required value={form.firma} onChange={e => setForm({ ...form, firma: e.target.value })} placeholder="Ditt selskap AS" className={inputClass + " pl-10"} />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Ditt navn</label>
                    <div className="relative">
                      <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/40" />
                      <input required value={form.navn} onChange={e => setForm({ ...form, navn: e.target.value })} placeholder="Ola Nordmann" className={inputClass + " pl-10"} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Telefon</label>
                      <div className="relative">
                        <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/40" />
                        <input required type="tel" value={form.telefon} onChange={e => setForm({ ...form, telefon: e.target.value })} placeholder="999 99 999" className={inputClass + " pl-10"} />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>E-post</label>
                      <div className="relative">
                        <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/40" />
                        <input required type="email" value={form.epost} onChange={e => setForm({ ...form, epost: e.target.value })} placeholder="ola@selskap.no" className={inputClass + " pl-10"} />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Hva gjelder henvendelsen?</label>
                    <textarea required value={form.melding} onChange={e => setForm({ ...form, melding: e.target.value })} placeholder="Beskriv kort hva du ønsker å gjennomgå…" rows={4}
                      className="w-full rounded-xl border border-border/30 bg-muted/30 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-muted-foreground/50 resize-none" />
                  </div>
                  <button type="submit" className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity glow-rose flex items-center justify-center gap-2">
                    Send forespørsel <Send size={16} />
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="text-primary" size={32} />
                </div>
                <h2 className="text-2xl font-bold mb-3">Forespørsel mottatt!</h2>
                <p className="text-muted-foreground mb-2">Vi kontakter deg snart for å avtale tidspunkt.</p>
                <div className="glass rounded-2xl p-5 border border-border/20 mt-6 text-left max-w-sm mx-auto">
                  <p className="text-sm font-medium mb-2">Viktig informasjon:</p>
                  <ul className="text-sm text-muted-foreground space-y-1.5">
                    <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-primary shrink-0 mt-0.5" /> Faktura utstedes når timen er bekreftet</li>
                    <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-primary shrink-0 mt-0.5" /> Betaling må være gjennomført før møtet</li>
                    <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-primary shrink-0 mt-0.5" /> Du mottar bekreftelse på e-post</li>
                  </ul>
                </div>
                <Link to="/tjenester" className="inline-block mt-8 text-sm text-primary hover:underline">← Tilbake til tjenester</Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </>
  );
};

export default EnTilEnRegnskap;
