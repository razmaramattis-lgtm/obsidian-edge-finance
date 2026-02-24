import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, CheckCircle2, Users, Monitor, MapPin, Award, Briefcase } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import workshopImg from "@/assets/kurs-workshop.jpg";
import patternImg from "@/assets/kurs-pattern.jpg";

const deliverables = [
  "Tilpasset innhold & varighet",
  "Workshop-format",
  "Oppfølging & materiell",
  "Sertifisering & dokumentasjon",
  "Fysisk eller digital levering",
  "Inntil 20 deltakere per kurs",
  "Evaluering & tilbakemelding",
  "Tilgang til kursplattform",
];

const whyItems = [
  { num: "01", title: "Helt skreddersydd.", desc: "Vi lager kurset fra grunnen av basert på ditt teams behov, bransje og kompetansenivå." },
  { num: "02", title: "Praktisk og interaktivt.", desc: "Workshop-format med øvelser, diskusjoner og caser. Deltakerne lærer ved å gjøre." },
  { num: "03", title: "Fleksibel levering.", desc: "Fysisk på ditt kontor, digitalt via Teams, eller hybrid. Vi tilpasser oss din hverdag." },
  { num: "04", title: "Oppfølging inkludert.", desc: "Kurset slutter ikke når dagen er over. Vi følger opp med materiell og spørsmålsrunder." },
];

const KursBedrift = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await supabase.functions.invoke("contact-submit", {
        body: { company_name: "Bedriftskurs-forespørsel", contact_person: form.name, email: form.email, phone: form.phone, message: form.message, package: "Bedriftskurs" },
      });
    } catch (err) { console.error(err); }
    setSending(false);
    setSubmitted(true);
  };

  return (
    <>
      <Helmet>
        <title>Skreddersydde bedriftskurs | Avargo Kurs</title>
        <meta name="description" content="Vi skreddersyr kursopplegg til ditt team — økonomiforståelse, compliance eller digitale verktøy. Levert fysisk eller digitalt." />
      </Helmet>

      {/* Hero */}
      <section ref={heroRef} className="relative h-[70vh] min-h-[500px] flex items-center overflow-hidden">
        <motion.div style={{ scale: heroScale }} className="absolute inset-0">
          <img src={workshopImg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </motion.div>
        <div className="relative z-10 container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="max-w-2xl">
            <p className="text-[10px] tracking-[0.45em] uppercase text-secondary mb-5">Bedriftskurs</p>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-7xl leading-[1.02] mb-6">
              Kurs tilpasset <span className="italic text-gradient-rose">ditt team.</span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground font-light max-w-xl">
              Vi skreddersyr kursopplegg til ditt team — enten det handler om økonomiforståelse, compliance eller digitale verktøy.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Deliverables */}
      <section className="py-24 md:py-36">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <p className="text-[10px] tracking-[0.4em] uppercase text-secondary mb-5">Hva du får</p>
              <h2 className="font-heading text-3xl md:text-5xl mb-8">Alt <span className="italic text-gradient-rose">inkludert.</span></h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {deliverables.map((d, i) => (
                  <motion.div key={d} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3 p-4 rounded-xl border border-border/10 bg-muted/5">
                    <CheckCircle2 size={16} className="text-secondary shrink-0" />
                    <span className="text-sm">{d}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <p className="text-[10px] tracking-[0.4em] uppercase text-secondary mb-5">Hvorfor Avargo</p>
              {whyItems.map((item, i) => (
                <motion.div key={item.num} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="flex gap-5">
                  <span className="text-3xl font-heading text-secondary/30">{item.num}</span>
                  <div>
                    <h3 className="font-heading text-base mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground font-light">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Formats */}
      <section className="py-24 md:py-36 relative">
        <div className="absolute inset-0 opacity-[0.04]"><img src={patternImg} alt="" className="w-full h-full object-cover" /></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <p className="text-[10px] tracking-[0.4em] uppercase text-secondary mb-5">Leveringsformat</p>
            <h2 className="font-heading text-3xl md:text-5xl">Velg formatet som <span className="italic text-gradient-rose">passer.</span></h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: MapPin, title: "Fysisk", desc: "Vi kommer til dere. Kurs på deres kontor eller et sted dere velger." },
              { icon: Monitor, title: "Digitalt", desc: "Live kurs via Teams eller Zoom. Like interaktivt som fysisk." },
              { icon: Users, title: "Hybrid", desc: "Kombiner fysisk og digitalt. Perfekt for distribuerte team." },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="group p-8 rounded-3xl border border-border/10 bg-muted/5 hover:bg-muted/10 hover:border-secondary/20 transition-all duration-500 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <Icon size={22} className="text-secondary" />
                  </div>
                  <h3 className="font-heading text-lg mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground font-light">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact form */}
      <section className="py-24 md:py-36">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
              <p className="text-[10px] tracking-[0.4em] uppercase text-secondary mb-5">Ta kontakt</p>
              <h2 className="font-heading text-3xl md:text-4xl mb-4">Hva trenger <span className="italic text-gradient-rose">teamet ditt?</span></h2>
              <p className="text-sm text-muted-foreground font-light">Vi designer kurset sammen — helt tilpasset dere.</p>
            </motion.div>

            {submitted ? (
              <div className="text-center glass rounded-3xl p-10 border border-border/20">
                <CheckCircle2 size={32} className="text-secondary mx-auto mb-4" />
                <h3 className="font-heading text-2xl mb-2">Takk for henvendelsen!</h3>
                <p className="text-sm text-muted-foreground">Vi kontakter deg innen 24 timer for å diskutere kurset.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="glass rounded-3xl p-8 md:p-10 border border-border/20 space-y-5">
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Kontaktperson *</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="Ola Nordmann" className="w-full h-11 rounded-xl border border-border/30 bg-muted/20 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40 transition-all" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">E-post *</label>
                    <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required type="email" placeholder="ola@firma.no" className="w-full h-11 rounded-xl border border-border/30 bg-muted/20 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40 transition-all" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">Telefon</label>
                    <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} type="tel" placeholder="+47 XXX XX XXX" className="w-full h-11 rounded-xl border border-border/30 bg-muted/20 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40 transition-all" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Hva ønsker dere kurs i?</label>
                  <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={4} placeholder="Fortell oss om teamet og hva dere ønsker å lære…" className="w-full rounded-xl border border-border/30 bg-muted/20 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40 transition-all resize-none" />
                </div>
                <button type="submit" disabled={sending} className="w-full py-3.5 bg-secondary text-secondary-foreground rounded-full text-sm font-medium tracking-wider hover:scale-[1.01] transition-all duration-300 disabled:opacity-50">
                  {sending ? "Sender…" : "Send forespørsel"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default KursBedrift;
