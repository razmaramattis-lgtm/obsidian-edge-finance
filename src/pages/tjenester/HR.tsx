import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, ArrowLeft, CheckCircle2, Shield } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import ambientTexture3 from "@/assets/ambient-texture-3.jpg";

const etablering = [
  "Kartlegging av dagens HR-rutiner",
  "Etablering av personalmapper",
  "Oppsett av HR-system",
  "Standard arbeidsavtaler",
  "Personalhåndbok",
  "Rutiner for ferie",
  "Rutiner for sykefravær",
  "Rutiner for onboarding",
  "Rutiner for offboarding",
  "Ansvarsfordeling mellom leder og HR",
];

const lopende = [
  "Lederstøtte",
  "Sparring rundt personalsaker",
  "Hjelp med dokumentasjon",
  "Veiledning om ferie",
  "Veiledning om feriepenger",
  "Veiledning om overtid",
  "Veiledning om permisjoner",
  "Veiledning ved sykefravær",
  "Oppdatering av personalhåndbok",
  "Oppdatering av HR-system",
];

const pillars = [
  {
    title: "Praktisk HR — ikke juridisk rådgivning.",
    desc: "Vi hjelper deg med rutinene, systemene og dokumentene du trenger for å være en god arbeidsgiver. Vi tar ikke rollen som advokat.",
  },
  {
    title: "Tilpasset små og mellomstore bedrifter.",
    desc: "Enkle, tydelige HR-rutiner som passer størrelsen på bedriften din — uten unødvendig byråkrati eller kompliserte systemer.",
  },
  {
    title: "Moderne HR-system i bunn.",
    desc: "Vi setter opp et HR-system slik at personalmapper, ferie, sykefravær og dokumenter er samlet på ett sted.",
  },
  {
    title: "Lederstøtte når du trenger det.",
    desc: "Ring oss for sparring rundt personalsaker, veiledning om ferie, overtid, permisjoner eller sykefravær. Vi er en trygg medspiller for lederen.",
  },
];

const RelatedServices = [
  { label: "Din egen regnskapsfører", href: "/tjenester/regnskapsforer" },
  { label: "Økonomisk rådgiver", href: "/tjenester/cfo" },
];

const HR = () => (
  <>
    <Helmet>
      <title>Praktisk HR-bistand for små og mellomstore bedrifter | Avargo</title>
      <meta name="description" content="Vi hjelper SMB med å etablere gode HR-rutiner, moderne HR-system og trygg lederstøtte — praktisk hjelp, ikke juridisk rådgivning." />
      <link rel="canonical" href="https://avargo.no/tjenester/hr-og-lonn" />
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          { "@type": "Question", "name": "Hva slags HR-bistand tilbyr Avargo?", "acceptedAnswer": { "@type": "Answer", "text": "Vi tilbyr praktisk HR-bistand til små og mellomstore bedrifter: etablering av HR-rutiner, personalmapper, oppsett av HR-system som Huma HR, standard arbeidsavtaler, personalhåndbok og rutiner for ferie, sykefravær, onboarding og offboarding." }},
          { "@type": "Question", "name": "Gir Avargo juridisk rådgivning?", "acceptedAnswer": { "@type": "Answer", "text": "Nei. Vi hjelper deg med praktisk HR-arbeid og lederstøtte, men vi tar ikke rollen som advokat eller juridisk rådgiver. I saker som krever juridisk vurdering henviser vi videre til advokat." }},
          { "@type": "Question", "name": "Hvilket HR-system bruker dere?", "acceptedAnswer": { "@type": "Answer", "text": "Vi setter typisk opp Huma HR, men kan også bistå med andre moderne HR-systemer tilpasset behovet til bedriften." }},
          { "@type": "Question", "name": "Hva er lederstøtte?", "acceptedAnswer": { "@type": "Answer", "text": "Lederstøtte er sparring rundt personalsaker, veiledning om ferie, feriepenger, overtid, permisjoner og sykefravær, samt hjelp med dokumentasjon og oppdatering av personalhåndbok og HR-system." }}
        ]
      })}</script>
    </Helmet>
    <section className="py-28 md:py-44 relative overflow-hidden">
      <img src={ambientTexture3} alt="" aria-hidden="true" loading="eager" className="absolute inset-0 w-full h-full object-cover opacity-[0.08] pointer-events-none select-none" />
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
          <p className="text-[10px] tracking-[0.45em] uppercase text-secondary mb-5 md:mb-6">HR & Personal</p>
          <h1 className="font-heading text-5xl sm:text-6xl md:text-8xl leading-[1.02] mb-8 md:mb-10">
            Praktisk HR for små og mellomstore bedrifter.{" "}
            <span className="italic text-gradient-teal text-3xl sm:text-4xl md:text-5xl block mt-4 md:mt-6">Vi gjør det enkelt å være en god arbeidsgiver.</span>
          </h1>
          <p className="text-base md:text-xl text-muted-foreground font-light leading-relaxed max-w-2xl mb-10 md:mb-14">
            Vi hjelper deg med å etablere gode HR-rutiner, effektive personalprosesser og moderne HR-systemer — uten å overta rollen som advokat eller juridisk rådgiver.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/kontakt" className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 md:px-10 py-4 bg-primary text-primary-foreground text-sm font-medium tracking-wider rounded-full glow-rose hover:scale-[1.02] transition-all duration-500">
              Kom i gang <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
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
        <AnimatedSection>
          <p className="text-[10px] tracking-[0.4em] uppercase text-secondary mb-5">Etablering</p>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-6 leading-snug max-w-3xl">
            Vi bygger HR-fundamentet i bedriften din.{" "}
            <span className="italic text-gradient-teal">Fra bunn av.</span>
          </h2>
          <p className="text-muted-foreground font-light leading-relaxed text-sm md:text-base max-w-2xl mb-12 md:mb-16">
            Vi kartlegger dagens rutiner og setter opp det du trenger for å drive personalarbeidet strukturert og trygt — tilpasset størrelsen på bedriften.
          </p>
        </AnimatedSection>
        <AnimatedSection delay={0.15}>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {etablering.map((d) => (
              <li key={d} className="flex items-start gap-3 text-sm font-light text-foreground/70">
                <CheckCircle2 size={14} className="text-secondary mt-0.5 shrink-0" strokeWidth={1.5} />
                {d}
              </li>
            ))}
          </ul>
        </AnimatedSection>
      </div>
    </section>

    <section className="py-24 md:py-40 bg-muted/20">
      <div className="container mx-auto px-4 md:px-6">
        <AnimatedSection>
          <p className="text-[10px] tracking-[0.4em] uppercase text-secondary mb-5">Løpende lederstøtte</p>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-6 leading-snug max-w-3xl">
            En trygg medspiller{" "}
            <span className="italic text-gradient-teal">når du trenger den.</span>
          </h2>
          <p className="text-muted-foreground font-light leading-relaxed text-sm md:text-base max-w-2xl mb-12 md:mb-16">
            Når fundamentet er på plass er vi tilgjengelige for sparring, veiledning og oppdatering av rutiner og systemer i det daglige.
          </p>
        </AnimatedSection>
        <AnimatedSection delay={0.15}>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {lopende.map((d) => (
              <li key={d} className="flex items-start gap-3 text-sm font-light text-foreground/70">
                <CheckCircle2 size={14} className="text-secondary mt-0.5 shrink-0" strokeWidth={1.5} />
                {d}
              </li>
            ))}
          </ul>
        </AnimatedSection>
      </div>
    </section>

    <section className="py-24 md:py-40 border-y border-border/10 relative">
      <div className="absolute inset-0 ambient-glow opacity-15" />
      <div className="container mx-auto px-4 md:px-6 relative">
        <AnimatedSection>
          <p className="text-[10px] tracking-[0.4em] uppercase text-secondary mb-5 md:mb-6">Hvorfor Avargo</p>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-14 md:mb-20 max-w-2xl leading-snug">
            Praktisk hjelp der du trenger den.
          </h2>
        </AnimatedSection>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6 max-w-4xl">
          {pillars.map((p, i) => (
            <AnimatedSection key={p.title} delay={i * 0.1}>
              <div className="p-6 md:p-7 glass rounded-2xl card-lift h-full">
                <h3 className="font-heading text-lg md:text-xl mb-2.5">{p.title}</h3>
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
            <Shield size={18} className="text-primary" strokeWidth={1.5} />
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-5 leading-snug max-w-2xl mx-auto">
            La oss gjøre HR enklere for deg.
          </h2>
          <p className="text-muted-foreground font-light mb-10 max-w-md mx-auto text-sm">
            En kort samtale er nok til å finne ut hvor vi best kan hjelpe bedriften din.
          </p>
          <Link to="/kontakt" className="group inline-flex items-center gap-3 px-10 md:px-12 py-4 md:py-5 bg-primary text-primary-foreground text-sm font-medium tracking-wider rounded-full glow-rose hover:scale-[1.02] transition-all duration-500">
            Book en samtale <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
          </Link>
        </AnimatedSection>
      </div>
    </section>
  </>
);

export default HR;
