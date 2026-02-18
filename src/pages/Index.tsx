import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Shield, Zap, Globe, Building2, Briefcase, Landmark, Sparkles } from "lucide-react";
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5, duration: 1 }}
      className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-card/60 backdrop-blur-lg border border-destructive/15"
    >
      <div className="w-2 h-2 rounded-full bg-destructive/70 animate-pulse" />
      <span className="text-[11px] uppercase tracking-[0.2em] text-foreground/50">Tapt i dag av norske SMB</span>
      <span className="font-heading text-lg text-destructive/80 tabular-nums">
        kr {amount.toLocaleString("no-NO")}
      </span>
    </motion.div>
  );
};

const Index = () => {
  const industries = [
    { icon: Globe, name: "Tech & SaaS", desc: "Regnskap i samme tempo som koden din. Live-tracking av MRR, Burn-rate og Churn.", color: "from-cobalt/10 to-transparent" },
    { icon: Building2, name: "Eiendom & Utvikling", desc: "Full kontroll på mva-justeringsregler og bankklar rapportering som sikrer din neste finansiering.", color: "from-primary/10 to-transparent" },
    { icon: Landmark, name: "Holding & Investering", desc: "Strategisk utbytteplanlegging og konsernbidrag-optimalisering. Beskytt formuen.", color: "from-violet/10 to-transparent" },
    { icon: Briefcase, name: "High-End Consulting", desc: "Internasjonal fakturering, compliance og skatteoptimalisering for rådgiverselskaper.", color: "from-cobalt/10 to-transparent" },
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

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/70 to-background" />
          <div className="absolute inset-0 dreamy-bg" />
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 backdrop-blur-lg border border-border/30 mb-10"
            >
              <Sparkles size={14} className="text-primary" />
              <span className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">Beyond Accounting</span>
            </motion.div>

            <h1 className="font-heading text-5xl md:text-7xl font-semibold leading-[1.1] mb-8">
              Slutt å telle penger.{" "}
              <span className="text-gradient-gold italic block mt-2">Begynn å drømme større.</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-12 leading-relaxed">
              De fleste regnskapsførere ser i bakspeilet. Vi tegner kartet til dit du skal. Avargo automatiserer fortiden din — så du kan forme fremtiden.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link
                to="/kontakt"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-medium text-sm tracking-wide rounded-full hover:shadow-lg hover:shadow-primary/20 transition-all duration-500"
              >
                Begynn reisen
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/priser"
                className="inline-flex items-center gap-2 px-8 py-4 border border-border/40 text-foreground/70 text-sm tracking-wide rounded-full hover:border-primary/30 hover:text-foreground transition-all duration-500"
              >
                Utforsk priser
              </Link>
            </div>

            <LiveCounter />
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <div className="w-5 h-9 rounded-full border border-muted-foreground/20 flex items-start justify-center p-2">
            <motion.div 
              animate={{ y: [0, 6, 0], opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="w-0.5 h-1.5 rounded-full bg-primary/60" 
            />
          </div>
        </motion.div>
      </section>

      {/* THE WHY — emotional hook */}
      <section className="py-32 md:py-40 relative">
        <div className="absolute inset-0 dreamy-bg opacity-50" />
        <div className="container mx-auto px-6 relative">
          <AnimatedSection>
            <div className="max-w-2xl mx-auto text-center">
              <p className="text-[11px] uppercase tracking-[0.3em] text-accent/70 mb-8">Tenk deg at…</p>
              <h2 className="font-heading text-3xl md:text-5xl font-medium mb-8 leading-snug">
                Hva om regnskapet ditt ikke bare fortalte deg{" "}
                <span className="italic text-gradient-violet">hva som skjedde</span> — men viste deg{" "}
                <span className="italic text-gradient-gold">hva som venter?</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-lg mx-auto">
                Hos Avargo ser vi fremover. Vi gir deg dataene som forteller deg hva du skal gjøre i morgen — ikke hva som gikk galt i går.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <div className="container mx-auto px-6"><div className="line-accent" /></div>

      {/* METHOD */}
      <section id="metoden" className="py-32 md:py-40">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <div className="max-w-3xl mb-20">
              <p className="text-[11px] uppercase tracking-[0.3em] text-accent/70 mb-4">Metoden</p>
              <h2 className="font-heading text-3xl md:text-5xl font-medium mb-8 leading-snug">
                Tre steg til{" "}
                <span className="italic text-gradient-gold">finansiell klarhet</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
                AI-drevet prediksjon som forutser utfordringer før de oppstår. Vi gir deg retningen — i sanntid.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Zap, title: "Sanntidsinnsikt", desc: "Dashbordet ditt oppdateres live. Aldri vent på en rapport igjen.", num: "01" },
              { icon: Shield, title: "Prediktiv skatt", desc: "AI analyserer 1400+ parametere for å minimere skattetrykket ditt — lovlig.", num: "02" },
              { icon: TrendingUp, title: "Vekstarkitektur", desc: "Vi strukturerer selskapet ditt for neste fase. Ikke bare neste kvartal.", num: "03" },
            ].map((item, i) => (
              <AnimatedSection key={item.title} delay={i * 0.15}>
                <div className="group p-8 bg-card/50 backdrop-blur-sm border border-border/30 rounded-2xl card-hover h-full relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="relative">
                    <span className="font-heading text-5xl font-medium text-accent/10">{item.num}</span>
                    <item.icon size={22} className="text-primary mt-4 mb-5" strokeWidth={1.5} />
                    <h3 className="font-heading text-xl font-medium mb-3">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6"><div className="line-accent" /></div>

      {/* INDUSTRIES */}
      <section id="bransjer" className="py-32 md:py-40 relative">
        <div className="absolute inset-0 dreamy-bg opacity-30" />
        <div className="container mx-auto px-6 relative">
          <AnimatedSection>
            <p className="text-[11px] uppercase tracking-[0.3em] text-accent/70 mb-4">Bransjer</p>
            <h2 className="font-heading text-3xl md:text-5xl font-medium mb-4 max-w-3xl leading-snug">
              Skreddersydd for de som{" "}
              <span className="italic text-gradient-gold">tenker stort</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-20 max-w-2xl">
              Vi velger våre klienter med omhu — for selskaper som skal skalere forbi 10, 50 og 100 millioner.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-6">
            {industries.map((ind, i) => (
              <AnimatedSection key={ind.name} delay={i * 0.1}>
                <div className={`group flex items-start gap-6 p-8 bg-card/50 backdrop-blur-sm border border-border/30 rounded-2xl card-hover relative overflow-hidden`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${ind.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                  <div className="relative p-3 bg-muted/40 rounded-xl shrink-0">
                    <ind.icon size={20} className="text-primary" strokeWidth={1.5} />
                  </div>
                  <div className="relative">
                    <h3 className="font-heading text-xl font-medium mb-2">{ind.name}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{ind.desc}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="py-32 md:py-40 border-y border-border/20">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <div className="text-center mb-20">
              <p className="text-[11px] uppercase tracking-[0.3em] text-accent/70 mb-4">Resultater</p>
              <h2 className="font-heading text-3xl md:text-5xl font-medium">
                Historier som <span className="italic text-gradient-gold">inspirerer</span>
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <AnimatedSection key={i} delay={i * 0.15}>
                <div className="p-8 bg-card/50 backdrop-blur-sm border border-border/30 rounded-2xl h-full flex flex-col card-hover">
                  <div className="text-3xl text-primary/30 font-heading mb-4">"</div>
                  <p className="text-foreground/80 leading-relaxed mb-8 flex-1">{t.quote}</p>
                  <div className="border-t border-border/20 pt-5">
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
      <section className="py-32 md:py-40 relative">
        <div className="absolute inset-0 dreamy-bg" />
        <div className="container mx-auto px-6 text-center relative">
          <AnimatedSection>
            <div className="max-w-2xl mx-auto">
              <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-[11px] font-medium tracking-[0.15em] uppercase bg-primary/10 text-primary border border-primary/15 mb-10">
                <Sparkles size={12} />
                Verdi: 5 000 kr — Gratis for deg
              </span>
              <h2 className="font-heading text-3xl md:text-5xl font-medium mb-6 leading-snug">
                Din <span className="italic text-gradient-gold">finansielle helse-sjekk</span> venter
              </h2>
              <p className="text-muted-foreground text-lg mb-12 leading-relaxed">
                Få en komplett analyse av selskapets finansielle tilstand. Se muligheter du ikke visste eksisterte — helt uforpliktende.
              </p>
              <Link
                to="/kontakt"
                className="group inline-flex items-center gap-3 px-10 py-4 bg-primary text-primary-foreground font-medium text-sm tracking-wide rounded-full hover:shadow-lg hover:shadow-primary/20 transition-all duration-500"
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
