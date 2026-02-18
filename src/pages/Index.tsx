import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Shield, Zap, BarChart3, Building2, Briefcase, Globe, Landmark } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import heroBg from "@/assets/hero-bg.jpg";

// Live loss counter
const LiveCounter = () => {
  const [amount, setAmount] = useState(247832);
  useEffect(() => {
    const interval = setInterval(() => {
      setAmount((prev) => prev + Math.floor(Math.random() * 12 + 3));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="inline-flex items-center gap-3 px-5 py-3 rounded bg-card border border-destructive/30">
      <span className="text-xs uppercase tracking-widest text-destructive font-semibold">Tapt i dag av norske SMB</span>
      <span className="font-heading text-xl font-bold text-destructive tabular-nums">
        kr {amount.toLocaleString("no-NO")}
      </span>
    </div>
  );
};

const Index = () => {
  const industries = [
    { icon: Globe, name: "Tech & SaaS", desc: "Skalering fra Series A til børsnotering" },
    { icon: Building2, name: "Eiendom", desc: "Porteføljeoptimalisering og skattestrategi" },
    { icon: Landmark, name: "Holding", desc: "Konsernstruktur og utbytteplanlegging" },
    { icon: Briefcase, name: "High-End Consulting", desc: "Internasjonal fakturering og compliance" },
  ];

  const testimonials = [
    {
      quote: "Etter tre måneder med Avargo økte vi driftsmarginen med 14% bare ved å optimalisere kostnadsstrukturen de avdekket.",
      name: "CEO",
      company: "Nordisk SaaS-selskap, 45M ARR",
    },
    {
      quote: "De forutså en likviditetskrise vi ikke engang visste var i emning. Det reddet Q4 for oss.",
      name: "CFO",
      company: "Eiendomskonsern, Oslo",
    },
    {
      quote: "Avargo erstattet tre leverandører. Ett dashbord, null overraskelser.",
      name: "Grunnlegger",
      company: "Tech-holdingselskap",
    },
  ];

  const partners = ["DNB", "Visma", "Tripletex", "Skatteetaten", "Brønnøysund", "Nets"];

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        </div>
        <div className="absolute inset-0 grid-overlay opacity-30" />

        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="font-heading text-5xl md:text-7xl font-bold leading-[1.05] mb-6">
              Stopp å telle penger.{" "}
              <span className="text-gradient-gold">Begynn å tjene dem.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              De fleste regnskapsførere ser i bakspeilet. Avargo er frontruta di. Vi automatiserer fortiden din så du kan eie fremtiden.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link
                to="/kontakt"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-heading font-semibold text-sm uppercase tracking-wider rounded hover:opacity-90 transition-all glow-gold"
              >
                Søk om medlemskap
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/priser"
                className="inline-flex items-center gap-2 px-8 py-4 border border-border text-foreground font-heading font-semibold text-sm uppercase tracking-wider rounded hover:border-primary/50 transition-colors"
              >
                Se priser
              </Link>
            </div>

            <LiveCounter />
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="w-5 h-8 rounded-full border-2 border-muted-foreground/40 flex items-start justify-center p-1">
            <div className="w-1 h-2 rounded-full bg-primary" />
          </div>
        </motion.div>
      </section>

      {/* AUTHORITY LOGOS */}
      <section className="py-12 border-y border-border/50">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            {partners.map((p) => (
              <span key={p} className="text-sm font-heading font-medium tracking-widest uppercase text-muted-foreground/50">
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* METHOD */}
      <section id="metoden" className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <div className="max-w-3xl">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-4 block">Metoden</span>
              <h2 className="font-heading text-3xl md:text-5xl font-bold mb-6">
                Vi ser ikke hva som <span className="text-gradient-gold">skjedde</span>. Vi ser hva som{" "}
                <span className="text-gradient-blue">kommer</span>.
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Vi bruker AI-drevet prediksjon for å forutse likviditetskriser tre måneder før de skjer. Mens konkurrentene våre sender deg en PDF i etterkant, gir vi deg retningen i sanntid.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6 mt-16">
            {[
              { icon: Zap, title: "Sanntidsinnsikt", desc: "Dashbordet ditt oppdateres live. Aldri vent på en rapport igjen." },
              { icon: Shield, title: "Prediktiv skatt", desc: "AI analyserer 1400+ parametere for å minimere skattetrykket ditt — lovlig." },
              { icon: TrendingUp, title: "Vekstarkitektur", desc: "Vi strukturerer selskapet ditt for neste fase. Ikke bare neste kvartal." },
            ].map((item, i) => (
              <AnimatedSection key={item.title} delay={i * 0.15}>
                <div className="group p-8 bg-card border border-border/50 rounded hover:border-primary/30 transition-all duration-500 h-full">
                  <item.icon size={28} className="text-primary mb-5" />
                  <h3 className="font-heading text-lg font-semibold mb-3">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6"><div className="line-accent" /></div>

      {/* INDUSTRIES */}
      <section id="bransjer" className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-4 block">Bransjer</span>
            <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4 max-w-3xl">
              Vi jobber ikke med hvem som helst.
            </h2>
            <p className="text-muted-foreground text-lg mb-16 max-w-2xl">
              Avargo er skreddersydd for selskaper som skal skalere forbi 10, 50 og 100 millioner.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-6">
            {industries.map((ind, i) => (
              <AnimatedSection key={ind.name} delay={i * 0.1}>
                <div className="group flex items-start gap-5 p-8 bg-card border border-border/50 rounded hover:border-primary/30 transition-all duration-500">
                  <div className="p-3 bg-muted rounded">
                    <ind.icon size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-semibold mb-2">{ind.name}</h3>
                    <p className="text-sm text-muted-foreground">{ind.desc}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="py-24 md:py-32 bg-card">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-4 block">Resultater</span>
            <h2 className="font-heading text-3xl md:text-5xl font-bold mb-16">Tall snakker høyere enn løfter.</h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <AnimatedSection key={i} delay={i * 0.15}>
                <div className="p-8 border border-border/50 rounded h-full flex flex-col">
                  <p className="text-foreground/90 leading-relaxed mb-6 flex-1">"{t.quote}"</p>
                  <div className="border-t border-border/50 pt-4">
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.company}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* FREE HEALTH CHECK CTA */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6 text-center">
          <AnimatedSection>
            <div className="max-w-2xl mx-auto">
              <span className="inline-block px-4 py-1 rounded text-xs font-semibold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 mb-6">
                Verdi: 5 000 kr — Gratis
              </span>
              <h2 className="font-heading text-3xl md:text-5xl font-bold mb-6">
                Finansiell Helse-sjekk
              </h2>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                Få en komplett analyse av selskapets finansielle tilstand. Se hva du taper — og hva du kan tjene. Helt uforpliktende.
              </p>
              <Link
                to="/kontakt"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-heading font-semibold text-sm uppercase tracking-wider rounded hover:opacity-90 transition-all glow-gold"
              >
                Bestill gratis helse-sjekk
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
};

export default Index;
