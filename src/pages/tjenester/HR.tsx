import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ArrowRight, Users, ChevronRight, ArrowLeft, CheckCircle2, Shield } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import ambientTexture3 from "@/assets/ambient-texture-3.jpg";

const deliverables = [
  "Lønnskjøring og innrapportering",
  "Feriepenger og skattetrekk",
  "Arbeidskontrakter og personalregler",
  "Arbeidsmiljø og sikkerhetsdokumentasjon",
  "God oppstart og avslutning for ansatte",
  "Oppfølging av sykefravær",
  "Personalhåndbok og retningslinjer",
  "Rådgivning i personalsaker",
];

const pillars = [
  {
    num: "01",
    title: "Alt på riktig side av loven.",
    desc: "Regler for arbeidsgivere endrer seg ofte. Vi holder oss oppdatert — slik at du slipper å bekymre deg for om bedriften din gjør alt riktig.",
  },
  {
    num: "02",
    title: "En arbeidsplass folk vil jobbe i.",
    desc: "Gode rutiner, klare kontrakter og en ordentlig oppstart for nye ansatte sender et tydelig signal: dette er et bra sted å jobbe.",
  },
  {
    num: "03",
    title: "Lønn uten hodepine.",
    desc: "Lønnskjøring, feriepenger og innrapportering — alt håndtert nøyaktig og til rett tid. Du slipper å ha hodet i regneark mens du prøver å drive bedriften.",
  },
  {
    num: "04",
    title: "Rådgivning er inkludert.",
    desc: "Lurer du på noe om oppsigelse, ansettelse, sykefravær eller noe annet? Ring oss. Det er det vi er her for — og det koster ingenting ekstra.",
  },
];

const RelatedServices = [
  { label: "Din egen regnskapsfører", href: "/tjenester/regnskapsforer" },
  { label: "Økonomisk rådgiver", href: "/tjenester/cfo" },
];

const HR = () => (
  <>
    <Helmet>
      <title>Lønn og personalarbeid for bedrifter | Avargo</title>
      <meta name="description" content="Vi tar oss av lønn, kontrakter, arbeidsmiljø og rådgivning — slik at du kan fokusere på menneskene i bedriften din." />
      <link rel="canonical" href="https://avargo.no/tjenester/hr-og-lonn" />
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          { "@type": "Question", "name": "Hva koster lønnskjøring?", "acceptedAnswer": { "@type": "Answer", "text": "Hos Avargo er lønnskjøring inkludert i HR-pakken. Du betaler én fast månedspris som dekker lønnskjøring, A-melding, feriepengeavregning, skattetrekk, arbeidskontrakter og arbeidsrettslig rådgivning — uten skjulte tillegg." }},
          { "@type": "Question", "name": "Hva er A-melding?", "acceptedAnswer": { "@type": "Answer", "text": "A-meldingen er en månedlig rapportering til Skatteetaten, NAV og SSB som inneholder opplysninger om lønn, skattetrekk, arbeidsgiveravgift og arbeidsforhold. Avargo håndterer A-meldingen automatisk som del av lønnskjøringen." }},
          { "@type": "Question", "name": "Trenger bedriften min HMS-dokumentasjon?", "acceptedAnswer": { "@type": "Answer", "text": "Ja, alle norske bedrifter er pålagt å ha HMS-dokumentasjon og internkontroll. Avargo hjelper deg med å opprette og vedlikeholde nødvendig HMS-dokumentasjon slik at bedriften alltid er compliant." }},
          { "@type": "Question", "name": "Hva bør en arbeidskontrakt inneholde?", "acceptedAnswer": { "@type": "Answer", "text": "En arbeidskontrakt skal inneholde: partenes identitet, arbeidssted, stillingsbeskrivelse, tiltredelsestidspunkt, prøvetid, lønn, arbeidstid, ferie og oppsigelsesfrister. Avargo lager profesjonelle arbeidskontrakter som oppfyller alle krav i arbeidsmiljøloven." }}
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
            Vi tar oss av personalarbeidet.{" "}
            <span className="italic text-gradient-teal">Du tar deg av folka.</span>
          </h1>
          <p className="text-base md:text-xl text-muted-foreground font-light leading-relaxed max-w-2xl mb-10 md:mb-14">
            Lønn, kontrakter, arbeidsmiljø og rådgivning — vi tar hele HR-jobben slik at du kan fokusere på menneskene og bedriften din.
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
        <div className="grid md:grid-cols-2 gap-14 md:gap-24 items-start">
          <AnimatedSection>
            <p className="text-[10px] tracking-[0.4em] uppercase text-secondary mb-5">Hva du får</p>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-6 leading-snug">
              Alt du trenger som arbeidsgiver.{" "}
              <span className="italic text-gradient-teal">På ett sted.</span>
            </h2>
            <p className="text-muted-foreground font-light leading-relaxed text-sm md:text-base">
              Fra lønnskjøring til rådgivning i vanskelige saker — vi tar oss av hele personaladministrasjonen slik at du alltid følger reglene og de ansatte har det bra.
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
          <p className="text-[10px] tracking-[0.4em] uppercase text-secondary mb-5 md:mb-6">Hvorfor det betyr noe</p>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-14 md:mb-20 max-w-2xl leading-snug">
            Viktigere enn de fleste tror.
          </h2>
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
            <Shield size={18} className="text-primary" strokeWidth={1.5} />
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-5 leading-snug max-w-2xl mx-auto">
            La de ansatte trives. Vi tar resten.
          </h2>
          <p className="text-muted-foreground font-light mb-10 max-w-md mx-auto text-sm">
            En samtale er nok til å finne ut hva vi kan hjelpe deg med.
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
