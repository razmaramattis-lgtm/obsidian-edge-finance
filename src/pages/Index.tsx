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
    <div className="inline-flex items-center gap-4 px-6 py-3 rounded-md bg-card/80 border border-destructive/20 backdrop-blur-sm">
      <span className="text-[10px] uppercase tracking-[0.2em] text-destructive/80 font-medium">Tapt i dag av norske SMB</span>
      <span className="font-heading text-xl font-semibold text-destructive tabular-nums">
        kr {amount.toLocaleString("no-NO")}
      </span>
    </div>
  );
};

const Index = () => {
  const industries = [
    { icon: Globe, name: "Tech & SaaS", desc: "Regnskap i samme tempo som koden din. Live-tracking av MRR, Burn-rate og Churn." },
    { icon: Building2, name: "Eiendom & Utvikling", desc: "Full kontroll på mva-justeringsregler og bankklar rapportering som sikrer din neste finansiering." },
    { icon: Landmark, name: "Holding & Investering", desc: "Strategisk utbytteplanlegging og konsernbidrag-optimalisering. Beskytt formuen." },
    { icon: Briefcase, name: "High-End Consulting", desc: "Internasjonal fakturering, compliance og skatteoptimalisering for rådgiverselskaper." },
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
          <img src={heroBg} alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/85 to-background" />
        </div>
        <div className="absolute inset-0 grid-overlay opacity-20" />

        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-3xl mx-auto"
          >
            <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground mb-8">Beyond Accounting. Precision in Motion.</p>
            
            <h1 className="font-heading text-5xl md:text-7xl font-semibold leading-[1.08] mb-8 tracking-tight">
              Slutt å telle penger.{" "}
              <span className="text-gradient-gold italic">Begynn å tjene dem.</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
              De fleste regnskapsførere ser i bakspeilet. Avargo er frontruta di. Vi automatiserer fortiden din så du kan eie fremtiden.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
              <Link
                to="/kontakt"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-medium text-sm tracking-wide rounded-md hover:opacity-90 transition-all glow-gold"
              >
                Søk om klientstatus
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/priser"
                className="inline-flex items-center gap-2 px-8 py-4 border border-border/60 text-foreground/80 text-sm tracking-wide rounded-md hover:border-primary/40 hover:text-foreground transition-all"
              >
                Se priser
              </Link>
            </div>

            <LiveCounter />
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <div className="w-5 h-8 rounded-full border border-muted-foreground/30 flex items-start justify-center p-1.5">
            <div className="w-0.5 h-1.5 rounded-full bg-primary/70" />
          </div>
        </motion.div>
      </section>


      {/* THE WHY */}
      <section className="py-28 md:py-36">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <div className="max-w-2xl mx-auto text-center">
              <p className="text-[11px] uppercase tracking-[0.3em] text-primary/80 mb-6">Hvorfor Avargo</p>
              <h2 className="font-heading text-3xl md:text-4xl font-semibold mb-8 leading-snug italic">
                "Hvorfor betale noen for å fortelle deg hva som skjedde i forrige måned?"
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Hos Avargo gir vi deg dataene som forteller deg hva du skal gjøre <em>neste</em> måned. Vi er ikke en kostnad i regnskapet ditt — vi er motoren i din vekst.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <div className="container mx-auto px-6"><div className="line-accent" /></div>

      {/* METHOD */}
      <section id="metoden" className="py-28 md:py-36">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <div className="max-w-3xl">
              <p className="text-[11px] uppercase tracking-[0.3em] text-primary/80 mb-4">Metoden</p>
              <h2 className="font-heading text-3xl md:text-5xl font-semibold mb-8 leading-snug">
                Vi ser ikke hva som <span className="text-gradient-gold italic">skjedde</span>. Vi ser hva som{" "}
                <span className="text-gradient-cobalt italic">kommer</span>.
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
                AI-drevet prediksjon som forutser likviditetskriser tre måneder før de skjer. Mens konkurrentene sender deg en PDF i etterkant, gir vi deg retningen i sanntid.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-px mt-20 bg-border/30 rounded-md overflow-hidden">
            {[
              { icon: Zap, title: "Sanntidsinnsikt", desc: "Dashbordet ditt oppdateres live. Aldri vent på en rapport igjen." },
              { icon: Shield, title: "Prediktiv skatt", desc: "AI analyserer 1400+ parametere for å minimere skattetrykket ditt — lovlig." },
              { icon: TrendingUp, title: "Vekstarkitektur", desc: "Vi strukturerer selskapet ditt for neste fase. Ikke bare neste kvartal." },
            ].map((item, i) => (
              <AnimatedSection key={item.title} delay={i * 0.12}>
                <div className="p-10 bg-card h-full group hover:bg-muted/50 transition-colors duration-500">
                  <item.icon size={22} className="text-primary mb-6" strokeWidth={1.5} />
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
      <section id="bransjer" className="py-28 md:py-36">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <p className="text-[11px] uppercase tracking-[0.3em] text-primary/80 mb-4">Bransjer</p>
            <h2 className="font-heading text-3xl md:text-5xl font-semibold mb-4 max-w-3xl leading-snug">
              Vi jobber ikke med hvem som helst.
            </h2>
            <p className="text-muted-foreground text-lg mb-20 max-w-2xl">
              Avargo er skreddersydd for selskaper som skal skalere forbi 10, 50 og 100 millioner.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-px bg-border/30 rounded-md overflow-hidden">
            {industries.map((ind, i) => (
              <AnimatedSection key={ind.name} delay={i * 0.08}>
                <div className="group flex items-start gap-6 p-10 bg-card hover:bg-muted/50 transition-colors duration-500">
                  <div className="p-3 bg-muted/60 rounded-md shrink-0">
                    <ind.icon size={20} className="text-primary" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-semibold mb-2">{ind.name}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{ind.desc}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="py-28 md:py-36 border-y border-border/30">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <p className="text-[11px] uppercase tracking-[0.3em] text-primary/80 mb-4">Resultater</p>
            <h2 className="font-heading text-3xl md:text-5xl font-semibold mb-20">Tall snakker høyere enn løfter.</h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-px bg-border/30 rounded-md overflow-hidden">
            {testimonials.map((t, i) => (
              <AnimatedSection key={i} delay={i * 0.12}>
                <div className="p-10 bg-card h-full flex flex-col">
                  <p className="text-foreground/85 leading-relaxed mb-8 flex-1 text-[15px]">"{t.quote}"</p>
                  <div className="border-t border-border/30 pt-5">
                    <p className="text-sm font-medium">{t.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{t.company}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* FREE HEALTH CHECK CTA */}
      <section className="py-28 md:py-36">
        <div className="container mx-auto px-6 text-center">
          <AnimatedSection>
            <div className="max-w-2xl mx-auto">
              <span className="inline-block px-4 py-1.5 rounded-md text-[10px] font-medium uppercase tracking-[0.2em] bg-primary/10 text-primary border border-primary/15 mb-8">
                Verdi: 5 000 kr — Gratis
              </span>
              <h2 className="font-heading text-3xl md:text-5xl font-semibold mb-6 leading-snug">
                Finansiell <span className="italic text-gradient-gold">Helse-sjekk</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
                Få en komplett analyse av selskapets finansielle tilstand. Se hva du taper — og hva du kan tjene. Helt uforpliktende.
              </p>
              <Link
                to="/kontakt"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-medium text-sm tracking-wide rounded-md hover:opacity-90 transition-all glow-gold"
              >
                Bestill gratis helse-sjekk
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
};

export default Index;
