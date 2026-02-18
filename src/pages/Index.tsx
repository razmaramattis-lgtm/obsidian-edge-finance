import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Shield, Zap, Globe, Building2, Briefcase, Landmark } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import heroBg from "@/assets/hero-bg.jpg";

const LiveCounter = () => {
  const [amount, setAmount] = useState(247832);
  useEffect(() => {
    const interval = setInterval(() => {
      setAmount((prev) => prev + Math.floor(Math.random() * 12 + 3));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2, duration: 0.8 }}
      className="inline-flex items-center gap-4 px-6 py-3 rounded-full glass"
    >
      <div className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
      <span className="text-xs tracking-widest uppercase text-muted-foreground">Tapt i dag</span>
      <span className="font-heading text-xl text-destructive tabular-nums">
        {amount.toLocaleString("no-NO")} kr
      </span>
    </motion.div>
  );
};

const Index = () => {
  const industries = [
    { icon: Globe, name: "Tech & SaaS", tagline: "Regnskap i samme tempo som koden din", desc: "Live-tracking av MRR, Burn-rate og Churn. Din CFO-as-a-service fra dag én." },
    { icon: Building2, name: "Eiendom", tagline: "Vi maksimerer din kvadratmeter-yield", desc: "Full kontroll på mva-justeringsregler og bankklar rapportering." },
    { icon: Landmark, name: "Holding", tagline: "Beskytt formuen mot lekkasje", desc: "Strategisk utbytteplanlegging og konsernbidrag-optimalisering." },
    { icon: Briefcase, name: "Consulting", tagline: "Internasjonal presisjon", desc: "Compliance, skatteoptimalisering og fakturering over landegrenser." },
  ];

  const testimonials = [
    {
      quote: "Etter tre måneder økte vi driftsmarginen med 14 %. Bare ved å følge Avargos anbefalinger.",
      author: "CEO, Nordisk SaaS-selskap",
      metric: "+14%",
      label: "driftsmargin",
    },
    {
      quote: "De forutså en likviditetskrise vi ikke visste var i emning. Det reddet fjerde kvartal.",
      author: "CFO, Eiendomskonsern Oslo",
      metric: "Q4",
      label: "reddet",
    },
    {
      quote: "Ett dashbord erstattet tre leverandører. Null overraskelser. Full kontroll.",
      author: "Grunnlegger, Tech-holding",
      metric: "3→1",
      label: "leverandører",
    },
  ];

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/70 to-background" />
          <div className="absolute inset-0 ambient-glow" />
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl mx-auto"
          >
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-xs tracking-[0.4em] uppercase text-muted-foreground mb-12"
            >
              Precision in motion
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="font-heading text-6xl md:text-8xl leading-[1.05] mb-8"
            >
              Slutt å telle.
              <br />
              <span className="text-gradient-rose italic">Begynn å bygge.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="text-lg text-muted-foreground max-w-lg mx-auto mb-14 leading-relaxed font-light"
            >
              Andre ser bakover. Vi tegner kartet fremover. Avargo gjør tallene dine til et konkurransefortrinn.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-16"
            >
              <Link
                to="/kontakt"
                className="group inline-flex items-center gap-3 px-10 py-4 bg-primary text-primary-foreground text-sm font-medium tracking-wider rounded-full glow-rose hover:scale-[1.02] transition-all duration-500"
              >
                Søk om klientstatus
                <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
              </Link>
              <Link
                to="/priser"
                className="inline-flex items-center gap-2 px-10 py-4 text-sm text-foreground/60 tracking-wider rounded-full border border-border/30 hover:border-primary/30 hover:text-foreground transition-all duration-500"
              >
                Se hva det gir tilbake
              </Link>
            </motion.div>

            <LiveCounter />
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="w-px h-12 bg-gradient-to-b from-primary/40 to-transparent" />
        </motion.div>
      </section>

      {/* THE HOOK — emotional */}
      <section className="py-36 md:py-44 relative">
        <div className="absolute inset-0 ambient-glow opacity-60" />
        <div className="container mx-auto px-6 relative">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-heading text-4xl md:text-6xl leading-snug mb-10">
                Hvorfor betale noen for å fortelle deg{" "}
                <span className="italic text-gradient-teal">hva som allerede skjedde</span>?
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-xl mx-auto font-light">
                Vi gir deg innsikten som forteller deg hva du skal gjøre neste uke, neste måned, neste år. Vi er ikke en kostnad — vi er motoren i veksten din.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <div className="container mx-auto px-6"><div className="line-accent" /></div>

      {/* METHOD */}
      <section id="metoden" className="py-36 md:py-44">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <p className="text-xs tracking-[0.4em] uppercase text-secondary mb-6">Metoden</p>
            <h2 className="font-heading text-4xl md:text-6xl mb-8 max-w-3xl leading-snug">
              Tre steg til{" "}
              <span className="italic text-gradient-rose">total kontroll</span>
            </h2>
            <p className="text-muted-foreground text-lg font-light leading-relaxed max-w-xl mb-20">
              AI-drevet prediksjon som ser det du ikke kan se. Vi gir deg retningen — alltid.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: "Se alt. Live.", desc: "Dashbordet ditt oppdateres i sanntid. Aldri vent på en rapport igjen.", num: "01" },
              { icon: Shield, title: "Spar mer. Lovlig.", desc: "AI analyserer 1400+ parametere for å minimere skattetrykket ditt.", num: "02" },
              { icon: TrendingUp, title: "Voks raskere.", desc: "Vi strukturerer selskapet ditt for neste fase — ikke bare neste kvartal.", num: "03" },
            ].map((item, i) => (
              <AnimatedSection key={item.title} delay={i * 0.15}>
                <div className="group p-10 glass rounded-3xl card-lift h-full relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <span className="font-heading text-6xl text-primary/8">{item.num}</span>
                  <item.icon size={22} className="text-primary mt-4 mb-6" strokeWidth={1.5} />
                  <h3 className="font-heading text-2xl mb-4">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed font-light">{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6"><div className="line-accent" /></div>

      {/* INDUSTRIES */}
      <section id="bransjer" className="py-36 md:py-44 relative">
        <div className="absolute inset-0 ambient-glow opacity-40" />
        <div className="container mx-auto px-6 relative">
          <AnimatedSection>
            <p className="text-xs tracking-[0.4em] uppercase text-secondary mb-6">Bransjer</p>
            <h2 className="font-heading text-4xl md:text-6xl mb-6 max-w-3xl leading-snug">
              For de som <span className="italic text-gradient-rose">nekter å stå stille</span>
            </h2>
            <p className="text-muted-foreground text-lg font-light mb-20 max-w-xl">
              Vi velger klientene våre med omhu. Avargo er for selskaper som tenker 10x.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-6">
            {industries.map((ind, i) => (
              <AnimatedSection key={ind.name} delay={i * 0.1}>
                <div className="group p-10 glass rounded-3xl card-lift relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-secondary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="flex items-start gap-6">
                    <div className="p-3 bg-muted/50 rounded-2xl shrink-0">
                      <ind.icon size={20} className="text-primary" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="font-heading text-2xl mb-1">{ind.name}</h3>
                      <p className="text-sm text-primary/80 italic mb-3">{ind.tagline}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed font-light">{ind.desc}</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="py-36 md:py-44 border-y border-border/15">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <div className="text-center mb-20">
              <p className="text-xs tracking-[0.4em] uppercase text-secondary mb-6">Resultater</p>
              <h2 className="font-heading text-4xl md:text-6xl">
                Tallene <span className="italic text-gradient-rose">lyver ikke</span>
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <AnimatedSection key={i} delay={i * 0.15}>
                <div className="p-10 glass rounded-3xl h-full flex flex-col card-lift">
                  <div className="mb-6">
                    <span className="font-heading text-5xl text-gradient-rose">{t.metric}</span>
                    <p className="text-xs text-muted-foreground tracking-widest uppercase mt-1">{t.label}</p>
                  </div>
                  <p className="text-foreground/75 leading-relaxed mb-8 flex-1 font-light">"{t.quote}"</p>
                  <p className="text-xs text-muted-foreground tracking-wide">{t.author}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-36 md:py-44 relative">
        <div className="absolute inset-0 ambient-glow" />
        <div className="container mx-auto px-6 text-center relative">
          <AnimatedSection>
            <div className="max-w-2xl mx-auto">
              <p className="text-xs tracking-[0.4em] uppercase text-secondary mb-8">Gratis · Verdi 5 000 kr</p>
              <h2 className="font-heading text-4xl md:text-6xl mb-8 leading-snug">
                Klar for å se hva du{" "}
                <span className="italic text-gradient-rose">egentlig kan tjene</span>?
              </h2>
              <p className="text-muted-foreground text-lg font-light mb-12 leading-relaxed max-w-lg mx-auto">
                Bestill en finansiell helse-sjekk. Vi avdekker mulighetene du ikke visste du hadde — helt uforpliktende.
              </p>
              <Link
                to="/kontakt"
                className="group inline-flex items-center gap-3 px-12 py-5 bg-primary text-primary-foreground text-sm font-medium tracking-wider rounded-full glow-rose hover:scale-[1.02] transition-all duration-500"
              >
                Bestill gratis analyse
                <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
};

export default Index;
