import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, GraduationCap, CheckCircle2, Award, Users, BookOpen, Monitor, Zap } from "lucide-react";
import { Helmet } from "react-helmet-async";
import heroImg from "@/assets/kurs-hero.jpg";
import workshopImg from "@/assets/kurs-workshop.jpg";
import learningImg from "@/assets/kurs-learning.jpg";
import patternImg from "@/assets/kurs-pattern.jpg";

const KursOm = () => (
  <>
    <Helmet>
      <title>Om Avargo Kurs — Kompetanseheving for norsk næringsliv</title>
      <meta name="description" content="Avargo Kurs tilbyr 130+ spesialiserte kurs innen regnskap, HR, AI og markedsføring. Lær mer om vår filosofi og metode." />
    </Helmet>

    {/* Hero */}
    <section className="py-24 md:py-40 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.08]"><img src={heroImg} alt="" className="w-full h-full object-cover" /></div>
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 to-background" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-secondary/20 bg-secondary/5 text-secondary text-[10px] tracking-[0.3em] uppercase mb-8">
            <GraduationCap size={12} /> Om kursene
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-7xl leading-[1.02] mb-6">
            Kunnskap som <span className="italic text-gradient-rose">skaper verdi.</span>
          </h1>
          <p className="text-base md:text-xl text-muted-foreground font-light leading-relaxed max-w-xl">
            Avargo Kurs er bygget for å gi norske bedrifter og fagpersoner praktisk, oppdatert kompetanse — levert av bransjens beste.
          </p>
        </motion.div>
      </div>
    </section>

    <div className="container mx-auto px-4"><div className="line-accent" /></div>

    {/* Philosophy */}
    <section className="py-24 md:py-36">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <p className="text-[10px] tracking-[0.4em] uppercase text-secondary mb-5">Vår filosofi</p>
            <h2 className="font-heading text-3xl md:text-4xl mb-6">Lær ved å <span className="italic text-gradient-rose">gjøre.</span></h2>
            <p className="text-muted-foreground font-light leading-relaxed mb-6">
              Vi tror ikke på passiv læring. Alle kursene våre er bygget rundt praktiske øvelser, reelle caser og interaktive workshops — slik at du kan bruke kunnskapen fra dag én.
            </p>
            <p className="text-muted-foreground font-light leading-relaxed mb-8">
              Kursene utvikles og holdes av erfarne rådgivere som jobber med disse fagområdene daglig. Det betyr at du lærer fra folk som kjenner virkeligheten — ikke bare teorien.
            </p>
            <div className="space-y-3">
              {["Praktiske øvelser i hvert kurs", "Reelle caser fra norsk næringsliv", "Oppdatert med gjeldende regelverk", "Kursbevis ved gjennomføring"].map((item, i) => (
                <motion.div key={item} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-secondary shrink-0" />
                  <span className="text-sm">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="rounded-3xl overflow-hidden">
            <img src={workshopImg} alt="Workshop" className="w-full h-[450px] object-cover" />
          </motion.div>
        </div>
      </div>
    </section>

    {/* Image break */}
    <section className="relative h-[40vh] min-h-[250px] overflow-hidden">
      <img src={learningImg} alt="" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/20" />
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
          <p className="text-[10px] tracking-[0.4em] uppercase text-secondary mb-4">Alle nivåer</p>
          <h2 className="font-heading text-3xl md:text-5xl">Fra nybegynner til <span className="italic">ekspert.</span></h2>
        </motion.div>
      </div>
    </section>

    {/* Formats */}
    <section className="py-24 md:py-36">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <p className="text-[10px] tracking-[0.4em] uppercase text-secondary mb-5">Kursformater</p>
          <h2 className="font-heading text-3xl md:text-5xl">Tre måter å <span className="italic text-gradient-rose">lære på.</span></h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: BookOpen, title: "Minikurs", desc: "Korte, fokuserte kurs du kan ta på egen hånd. Perfekt for spesifikke emner." },
            { icon: Users, title: "Bedriftskurs", desc: "Skreddersydde opplegg for ditt team. Workshop-format med praktiske øvelser." },
            { icon: Monitor, title: "Digitale kurs", desc: "Live eller on-demand. Fleksibelt og tilgjengelig uansett hvor du er." },
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

    {/* CTA */}
    <section className="py-24 md:py-36 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-background to-primary/5" />
      <div className="absolute inset-0 opacity-[0.04]"><img src={patternImg} alt="" className="w-full h-full object-cover" /></div>
      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <Award size={32} className="text-secondary mx-auto mb-6" />
          <h2 className="font-heading text-3xl md:text-5xl mb-4">Utforsk <span className="italic text-gradient-rose">kurskatalogen.</span></h2>
          <p className="text-sm text-muted-foreground font-light max-w-md mx-auto mb-10">130+ kurs innen alle fagområder. Finn ditt neste steg.</p>
          <Link to="/kurs/katalog" className="group inline-flex items-center justify-center gap-3 px-12 py-4 bg-secondary text-secondary-foreground text-sm font-medium tracking-wider rounded-full hover:scale-[1.02] transition-all shadow-lg shadow-secondary/20">
            Se alle kurs <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  </>
);

export default KursOm;
