import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Search, ChevronRight, ArrowLeft, CheckCircle2, TrendingUp } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

const deliverables = [
  "Teknisk SEO-analyse og utbedring",
  "Søkeordstrategi og konkurrentanalyse",
  "On-page optimalisering",
  "Google Min Bedrift-optimalisering",
  "Lokal SEO for geografiske markeder",
  "AI-assistert innholdsproduksjon",
  "Lenkestrategi og autoritetbygging",
  "Månedlig rangerings- og trafikrapport",
];

const pillars = [
  { num: "01", title: "Teknisk fundament først.", desc: "Crawlabilitet, sidestruktur, Core Web Vitals og indeksering. Uten et solid teknisk fundament hjelper ikke innhold. Vi starter alltid her." },
  { num: "02", title: "Innhold Google belønner.", desc: "Søkeordrettet innhold som svarer på det brukerne faktisk søker etter — og som plasserer selskapet ditt som autoriteten i din bransje." },
  { num: "03", title: "Lokal synlighet.", desc: "Google Min Bedrift, lokale søkefraser og geografisk målrettet innhold gjør at du dominerer i ditt marked — ikke bare nasjonalt." },
  { num: "04", title: "Langsiktig investering.", desc: "SEO er ikke en kampanje. Det er en investering som vokser over tid. Vi bygger organisk trafikk som ikke forsvinner når du slutter å betale for klikk." },
];

const RelatedServices = [
  { label: "Nettsider & digitale flater", href: "/tjenester/nettsider" },
  { label: "Google Ads", href: "/tjenester/google-ads" },
  { label: "AI & automatisering", href: "/tjenester/ai-automatisering" },
];

const SEO = () => (
  <>
    <section className="py-28 md:py-44 relative overflow-hidden">
      <div className="absolute inset-0 ambient-glow opacity-30" />
      <div className="container mx-auto px-4 md:px-6 relative">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} className="max-w-4xl">
          <Link to="/tjenester" className="inline-flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase text-muted-foreground/50 hover:text-foreground transition-colors mb-8 md:mb-12">
            <ArrowLeft size={12} /> Alle tjenester
          </Link>
          <p className="text-[10px] tracking-[0.45em] uppercase text-primary mb-5 md:mb-6">FX Media × Avargo</p>
          <h1 className="font-heading text-5xl sm:text-6xl md:text-8xl leading-[1.02] mb-8 md:mb-10">
            Synlig på Google.{" "}
            <span className="italic text-gradient-teal">Organisk og varig.</span>
          </h1>
          <p className="text-base md:text-xl text-muted-foreground font-light leading-relaxed max-w-2xl mb-10 md:mb-14">
            Strategisk søkemotoroptimalisering som bygger langsiktig synlighet — slik at kundene finner deg i det øyeblikket behovet oppstår, uten at du betaler for hvert klikk.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/kontakt" className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 md:px-10 py-4 bg-primary text-primary-foreground text-sm font-medium tracking-wider rounded-full glow-rose hover:scale-[1.02] transition-all duration-500">
              Snakk med oss <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>

    <div className="container mx-auto px-4 md:px-6"><div className="line-accent" /></div>

    <section className="py-24 md:py-40">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-14 md:gap-24 items-start">
          <AnimatedSection>
            <p className="text-[10px] tracking-[0.4em] uppercase text-secondary mb-5">Hva er inkludert</p>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-6 leading-snug">
              Komplett SEO —{" "}
              <span className="italic text-gradient-teal">teknisk og innholdsmessig.</span>
            </h2>
            <p className="text-muted-foreground font-light leading-relaxed text-sm md:text-base">
              Vi kombinerer teknisk SEO, innholdsstrategi og lokal tilstedeværelse i en koordinert leveranse som gir resultater som varer.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.15}>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {deliverables.map((d) => (
                <li key={d} className="flex items-start gap-3 text-sm font-light text-foreground/70">
                  <CheckCircle2 size={14} className="text-secondary mt-0.5 shrink-0" strokeWidth={1.5} />
                  {d}
                </li>
              ))}
            </ul>
          </AnimatedSection>
        </div>
      </div>
    </section>

    <section className="py-24 md:py-40 border-y border-border/10 relative">
      <div className="absolute inset-0 ambient-glow opacity-15" />
      <div className="container mx-auto px-4 md:px-6 relative">
        <AnimatedSection>
          <p className="text-[10px] tracking-[0.4em] uppercase text-secondary mb-5 md:mb-6">Metodikk</p>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-14 md:mb-20 max-w-2xl leading-snug">Fire pilarer for varig synlighet.</h2>
        </AnimatedSection>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
          {pillars.map((p, i) => (
            <AnimatedSection key={p.num} delay={i * 0.1}>
              <div className="p-8 md:p-10 glass rounded-3xl card-lift h-full">
                <span className="font-heading text-5xl text-primary/8">{p.num}</span>
                <h3 className="font-heading text-xl md:text-2xl mt-5 mb-3">{p.title}</h3>
                <p className="text-sm text-muted-foreground font-light leading-relaxed">{p.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>

    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <AnimatedSection>
          <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground/50 mb-8">Relaterte tjenester</p>
          <div className="flex flex-wrap gap-3">
            {RelatedServices.map((s) => (
              <Link key={s.href} to={s.href} className="inline-flex items-center gap-2 px-5 py-2.5 text-[12px] tracking-wide text-muted-foreground border border-border/20 rounded-full hover:border-primary/30 hover:text-foreground transition-all duration-300">
                {s.label} <ChevronRight size={11} className="text-primary/40" />
              </Link>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>

    <section className="py-24 md:py-32 border-t border-border/10 text-center relative">
      <div className="absolute inset-0 ambient-glow opacity-25" />
      <div className="container mx-auto px-4 md:px-6 relative">
        <AnimatedSection>
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-8">
            <TrendingUp size={18} className="text-primary" strokeWidth={1.5} />
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-5 leading-snug max-w-2xl mx-auto">
            La kundene finne deg — uten å betale for hvert klikk.
          </h2>
          <p className="text-muted-foreground font-light mb-10 max-w-md mx-auto text-sm">
            Book en SEO-gjennomgang og få konkret innsikt i hva som kreves for å klatre på Google i din bransje.
          </p>
          <Link to="/kontakt" className="group inline-flex items-center gap-3 px-10 md:px-12 py-4 md:py-5 bg-primary text-primary-foreground text-sm font-medium tracking-wider rounded-full glow-rose hover:scale-[1.02] transition-all duration-500">
            Book en gjennomgang <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
          </Link>
        </AnimatedSection>
      </div>
    </section>
  </>
);

export default SEO;
