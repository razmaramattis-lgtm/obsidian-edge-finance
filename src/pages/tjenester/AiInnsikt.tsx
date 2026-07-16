import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, ChevronRight, ArrowLeft, CheckCircle2, Zap } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import ambientTexture4 from "@/assets/ambient-texture-4.jpg";

const deliverables = [
  "Sanntids likviditets- og resultatdashbord",
  "Automatisk fradragsanalyse (AI-drevet)",
  "Skatteoptimaliseringsanbefalinger",
  "Risikovarsling ved avvik og trender",
  "Prognoser og scenariomodeller",
  "Kontantstrømprojeksjoner",
  "Bransjesammenligning og benchmarking",
  "Månedlig ledelsesinformasjon (MI-rapport)",
];

const features = [
  {
    num: "01",
    title: "Data i sanntid — ikke 30 dager for sent.",
    desc: "De fleste regnskapssystemer viser deg fortiden. Vår AI-plattform gir deg nåtiden: likviditet, resultat og skatteposisjon oppdatert i takt med faktiske transaksjoner.",
  },
  {
    num: "02",
    title: "Fradrag du ikke visste du hadde krav på.",
    desc: "AI-en scanner bilag, kontostruktur og skattelovgivning kontinuerlig — og identifiserer fradragsmuligheter som ellers ville gått ubemerket hen. Hvert kvartal.",
  },
  {
    num: "03",
    title: "Varsler før problemene oppstår.",
    desc: "Uvanlige transaksjonsmønstre, likviditetspress og avvik fra budsjett fanges opp og eskaleres til regnskapsføreren din — før det blir en krise.",
  },
  {
    num: "04",
    title: "Beslutningsstøtte, ikke bare rapporter.",
    desc: "Tallene presenteres i et format som gjør det enkelt å handle. Ikke regnskapsjargon — men innsikt som direkte kobler seg til beslutningene du tar i dag.",
  },
];

const RelatedServices = [
  { label: "Dedikert regnskapsfører", href: "/tjenester/regnskapsforer" },
  { label: "CFO-as-a-Service", href: "/tjenester/cfo" },
];

const AiInnsikt = () => (
  <>
    <Helmet>
      <title>AI-drevet finansiell innsikt og analyse | Avargo</title>
      <meta name="description" content="Sanntids finansiell analyse med AI. Automatisk fradragsanalyse, skatteoptimalisering og likviditetsdashbord for norske selskaper." />
      <link rel="canonical" href="https://avargo.no/tjenester/ai-innsikt" />
    </Helmet>
    <section className="py-28 md:py-44 relative overflow-hidden">
      <img src={ambientTexture4} alt="" aria-hidden="true" loading="eager" className="absolute inset-0 w-full h-full object-cover opacity-[0.08] pointer-events-none select-none" />
      <div className="absolute inset-0 ambient-glow opacity-30" />
      <div className="container mx-auto px-4 md:px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl"
        >
          <Link to="/tjenester" className="inline-flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase text-muted-foreground/50 hover:text-foreground transition-colors mb-8 md:mb-12">
            <ArrowLeft size={12} /> Alle tjenester
          </Link>
          <p className="text-[10px] tracking-[0.45em] uppercase text-primary mb-5 md:mb-6">Regnskap & Økonomi</p>
          <h1 className="font-heading text-5xl sm:text-6xl md:text-8xl leading-[1.02] mb-8 md:mb-10">
            Tallene i sanntid.{" "}
            <span className="italic text-gradient-teal">Innsikten umiddelbart.</span>
          </h1>
          <p className="text-base md:text-xl text-muted-foreground font-light leading-relaxed max-w-2xl mb-10 md:mb-14">
            AI-drevet finansiell analyse som gir deg full oversikt over selskapet ditt — uten at du trenger å gjøre noe som helst. Avvikene fanges. Mulighetene identifiseres. Du bestemmer.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/kontakt" className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 md:px-10 py-4 bg-primary text-primary-foreground text-sm font-medium tracking-wider rounded-full glow-rose hover:scale-[1.02] transition-all duration-500">
              Snakk med oss <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>
            <Link to="/priser" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 md:px-10 py-4 text-sm text-foreground/50 tracking-wider rounded-full border border-border/20 hover:border-primary/20 hover:text-foreground transition-all duration-500">
              Se priser
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
              Komplett finansiell{" "}
              <span className="italic text-gradient-teal">intelligens.</span>
            </h2>
            <p className="text-muted-foreground font-light leading-relaxed text-sm md:text-base">
              Vår AI-plattform er ikke et ekstra produkt — den er integrert i regnskapsleveransen og analyserer dataene dine kontinuerlig, automatisk og uten at du trenger å be om det.
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
          <p className="text-[10px] tracking-[0.4em] uppercase text-secondary mb-5 md:mb-6">Funksjonalitet</p>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-14 md:mb-20 max-w-2xl leading-snug">Hva AI-plattformen gjør for deg.</h2>
        </AnimatedSection>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
          {features.map((f, i) => (
            <AnimatedSection key={f.num} delay={i * 0.1}>
              <div className="p-8 md:p-10 glass rounded-3xl card-lift h-full">
                <span className="font-heading text-5xl text-primary/8">{f.num}</span>
                <h3 className="font-heading text-xl md:text-2xl mt-5 mb-3">{f.title}</h3>
                <p className="text-sm text-muted-foreground font-light leading-relaxed">{f.desc}</p>
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
            <Zap size={18} className="text-primary" strokeWidth={1.5} />
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-5 leading-snug max-w-2xl mx-auto">
            Se selskapet ditt i sanntid.
          </h2>
          <p className="text-muted-foreground font-light mb-10 max-w-md mx-auto text-sm">
            En gjennomgang er nok til å vise deg hva du mangler i dag — og hva du kan vinne ved å ha full oversikt.
          </p>
          <Link to="/kontakt" className="group inline-flex items-center gap-3 px-10 md:px-12 py-4 md:py-5 bg-primary text-primary-foreground text-sm font-medium tracking-wider rounded-full glow-rose hover:scale-[1.02] transition-all duration-500">
            Book en gjennomgang <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
          </Link>
        </AnimatedSection>
      </div>
    </section>
  </>
);

export default AiInnsikt;
