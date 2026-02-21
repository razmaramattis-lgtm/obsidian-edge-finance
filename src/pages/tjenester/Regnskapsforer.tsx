import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, ChevronRight, Phone, CheckCircle2, ArrowLeft } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import ambientTexture1 from "@/assets/ambient-texture-1.jpg";

const deliverables = [
  "Løpende bokføring av alle bilag",
  "MVA-rapportering og innlevering",
  "Årsregnskap og næringsoppgave",
  "Skattemelding for selskap og eier",
  "Aksjonærregisteroppgave (RF-1086)",
  "Bankintegrasjon og automatisert bilagsflyt",
  "Revisjonstøtte og dokumentasjonspakke",
  "Proaktiv rådgivning inkludert — alltid",
];

const why = [
  {
    num: "01",
    title: "Én person. Hele bildet.",
    desc: "Du slipper å forklare historien din på nytt hver gang. Regnskapsføreren din kjenner selskapet, bransjen og ambisjonene — og jobber med det som en integrert del av laget ditt.",
  },
  {
    num: "02",
    title: "Proaktiv, ikke reaktiv.",
    desc: "Vi venter ikke på at du skal stille spørsmål. Vi kontakter deg når vi ser muligheter, risiko eller fradrag du ikke hadde fanget opp selv. Det er forskjellen mellom en leverandør og en partner.",
  },
  {
    num: "03",
    title: "Alt inkludert. Ingen overraskelser.",
    desc: "Fastpris som dekker hele leveransen — fra bilag til årsregnskap. Rådgivning er en del av pakken, ikke et tillegg som tikker på timelisten.",
  },
  {
    num: "04",
    title: "Alltid tilgjengelig.",
    desc: "Ring, send melding eller still spørsmål. Det koster ingenting ekstra. Du er ikke et saksnummer — du er en klient vi bryr oss om.",
  },
];

const RelatedServices = [
  { label: "AI-drevet finansiell innsikt", href: "/tjenester/ai-innsikt" },
  { label: "CFO-as-a-Service", href: "/tjenester/cfo" },
  { label: "Lønn & HR", href: "/tjenester/hr-og-lonn" },
];

const Regnskapsforer = () => (
  <>
    <Helmet>
      <title>Dedikert regnskapsfører for din bedrift | Avargo</title>
      <meta name="description" content="Få en fast regnskapsfører som kjenner bransjen din. Løpende regnskap, skatteoptimalisering og rådgivning — fra 1 499 kr/mnd." />
      <link rel="canonical" href="https://avargo.no/tjenester/regnskapsforer" />
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          { "@type": "Question", "name": "Hva koster en regnskapsfører?", "acceptedAnswer": { "@type": "Answer", "text": "Hos Avargo starter prisene fra 1 499 kr/mnd for nyoppstartede selskaper. Alt er inkludert i fastprisen — bokføring, årsregnskap, skattemelding, MVA-rapportering og rådgivning. Ingen skjulte kostnader eller tillegg." }},
          { "@type": "Question", "name": "Hva gjør en regnskapsfører?", "acceptedAnswer": { "@type": "Answer", "text": "En regnskapsfører håndterer den økonomiske administrasjonen i bedriften din: løpende bokføring, MVA-rapportering, årsregnskap, skattemelding, aksjonærregisteroppgave og proaktiv rådgivning. Hos Avargo får du én fast person som kjenner selskapet ditt og bransjen din." }},
          { "@type": "Question", "name": "Hvordan bytte regnskapsfører?", "acceptedAnswer": { "@type": "Answer", "text": "Å bytte regnskapsfører er enkelt: 1) Ta kontakt med oss for en uforpliktende samtale. 2) Vi sender oppsigelsesbrev til din nåværende regnskapsfører. 3) Vi henter alle data og setter opp systemene. 4) Du får en dedikert regnskapsfører fra dag én. Hele prosessen tar vanligvis 2-4 uker." }},
          { "@type": "Question", "name": "Trenger jeg en autorisert regnskapsfører?", "acceptedAnswer": { "@type": "Answer", "text": "Ja, i Norge er det lovpålagt at regnskapsførere som tilbyr tjenester til andre må være autorisert av Finanstilsynet. Alle regnskapsførere hos Avargo er autoriserte og holder seg oppdatert på gjeldende regelverk." }},
          { "@type": "Question", "name": "Hva er forskjellen mellom regnskapsfører og revisor?", "acceptedAnswer": { "@type": "Answer", "text": "En regnskapsfører fører regnskapet ditt løpende gjennom året — bokføring, MVA, lønn og årsregnskap. En revisor kontrollerer regnskapet i etterkant. De fleste små og mellomstore bedrifter trenger en regnskapsfører, men ikke nødvendigvis revisor (revisjonsplikten gjelder først ved over 7 MNOK i omsetning)." }}
        ]
      })}</script>
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "Dedikert regnskapsfører",
        "provider": { "@type": "Organization", "name": "Avargo", "url": "https://avargo.no" },
        "description": "Få en fast regnskapsfører som kjenner bransjen din. Løpende regnskap, skatteoptimalisering og rådgivning.",
        "url": "https://avargo.no/tjenester/regnskapsforer",
        "areaServed": { "@type": "Country", "name": "Norway" },
        "offers": { "@type": "Offer", "price": "1499", "priceCurrency": "NOK", "description": "Fra 1 499 kr/mnd" }
      })}</script>
    </Helmet>
    {/* HERO */}
    <section className="py-28 md:py-44 relative overflow-hidden">
      <img src={ambientTexture1} alt="" aria-hidden="true" loading="eager" className="absolute inset-0 w-full h-full object-cover opacity-[0.08] pointer-events-none select-none" />
      <div className="absolute inset-0 ambient-glow opacity-30" />
      <div className="container mx-auto px-4 md:px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl"
        >
          <Link
            to="/tjenester"
            className="inline-flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase text-muted-foreground/50 hover:text-foreground transition-colors mb-8 md:mb-12"
          >
            <ArrowLeft size={12} /> Alle tjenester
          </Link>
          <p className="text-[10px] tracking-[0.45em] uppercase text-primary mb-5 md:mb-6">
            Regnskap & Økonomi
          </p>
          <h1 className="font-heading text-5xl sm:text-6xl md:text-8xl leading-[1.02] mb-8 md:mb-10">
            Din dedikerte{" "}
            <span className="italic text-gradient-rose">regnskapsfører.</span>
          </h1>
          <p className="text-base md:text-xl text-muted-foreground font-light leading-relaxed max-w-2xl mb-10 md:mb-14">
            Ikke en helpdesk. Ikke et saksbehandlingssystem. Et menneske som kjenner selskapet ditt, følger opp proaktivt — og som du faktisk kan ringe.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/kontakt"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 md:px-10 py-4 bg-primary text-primary-foreground text-sm font-medium tracking-wider rounded-full glow-rose hover:scale-[1.02] transition-all duration-500"
            >
              Kom i gang
              <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>
            <Link
              to="/priser"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 md:px-10 py-4 text-sm text-foreground/50 tracking-wider rounded-full border border-border/20 hover:border-primary/20 hover:text-foreground transition-all duration-500"
            >
              Se priser
            </Link>
          </div>
        </motion.div>
      </div>
    </section>

    <div className="container mx-auto px-4 md:px-6"><div className="line-accent" /></div>

    {/* What's included */}
    <section className="py-24 md:py-40">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-14 md:gap-24 items-start">
          <AnimatedSection>
            <p className="text-[10px] tracking-[0.4em] uppercase text-secondary mb-5">Hva er inkludert</p>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-6 leading-snug">
              Komplett regnskapsdekning —{" "}
              <span className="italic text-gradient-rose">ingenting utelatt.</span>
            </h2>
            <p className="text-muted-foreground font-light leading-relaxed text-sm md:text-base">
              Alt som kreves for et compliant, velorganisert og innsiktsfullt regnskap er inkludert i fastprisen. Ingen skjulte tillegg. Ingen overraskelser ved fakturering.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.15}>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {deliverables.map((d) => (
                <li key={d} className="flex items-start gap-3 text-sm font-light text-foreground/70">
                  <CheckCircle2 size={14} className="text-primary mt-0.5 shrink-0" strokeWidth={1.5} />
                  {d}
                </li>
              ))}
            </ul>
          </AnimatedSection>
        </div>
      </div>
    </section>

    {/* Why */}
    <section className="py-24 md:py-40 border-y border-border/10 relative">
      <div className="absolute inset-0 ambient-glow opacity-15" />
      <div className="container mx-auto px-4 md:px-6 relative">
        <AnimatedSection>
          <p className="text-[10px] tracking-[0.4em] uppercase text-secondary mb-5 md:mb-6">Hvorfor Avargo</p>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-14 md:mb-20 max-w-2xl leading-snug">
            Det du ikke får andre steder.
          </h2>
        </AnimatedSection>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
          {why.map((w, i) => (
            <AnimatedSection key={w.num} delay={i * 0.1}>
              <div className="p-8 md:p-10 glass rounded-3xl card-lift h-full">
                <span className="font-heading text-5xl text-primary/8">{w.num}</span>
                <h3 className="font-heading text-xl md:text-2xl mt-5 mb-3">{w.title}</h3>
                <p className="text-sm text-muted-foreground font-light leading-relaxed">{w.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>

    {/* Related */}
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <AnimatedSection>
          <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground/50 mb-8">Relaterte tjenester</p>
          <div className="flex flex-wrap gap-3">
            {RelatedServices.map((s) => (
              <Link
                key={s.href}
                to={s.href}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-[12px] tracking-wide text-muted-foreground border border-border/20 rounded-full hover:border-primary/30 hover:text-foreground transition-all duration-300"
              >
                {s.label}
                <ChevronRight size={11} className="text-primary/40" />
              </Link>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>

    {/* CTA */}
    <section className="py-24 md:py-32 border-t border-border/10 text-center relative">
      <div className="absolute inset-0 ambient-glow opacity-25" />
      <div className="container mx-auto px-4 md:px-6 relative">
        <AnimatedSection>
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-8">
            <Phone size={18} className="text-primary" strokeWidth={1.5} />
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-5 leading-snug max-w-2xl mx-auto">
            Regnskapsføreren din venter.
          </h2>
          <p className="text-muted-foreground font-light mb-10 max-w-md mx-auto text-sm">
            Dedikert. Autorisert. Spesialisert i din bransje. En samtale er nok til å komme i gang.
          </p>
          <Link
            to="/kontakt"
            className="group inline-flex items-center gap-3 px-10 md:px-12 py-4 md:py-5 bg-primary text-primary-foreground text-sm font-medium tracking-wider rounded-full glow-rose hover:scale-[1.02] transition-all duration-500"
          >
            Book en gjennomgang
            <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
          </Link>
        </AnimatedSection>
      </div>
    </section>
  </>
);

export default Regnskapsforer;
