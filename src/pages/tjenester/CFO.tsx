import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ArrowRight, Briefcase, ChevronRight, ArrowLeft, CheckCircle2, TrendingUp } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import ambientTexture2 from "@/assets/ambient-texture-2.jpg";

const deliverables = [
  "Hjelp med budsjett og langsiktige planer",
  "Kommunikasjon med investorer og styret",
  "Planlegging ved salg eller sammenslåing",
  "Finne ut hva som lønner seg — og hva som ikke gjør det",
  "Lage økonomiske modeller og prognoser",
  "Rapporter til styret og eiere",
  "Vurdere risiko og sikre god kontroll",
  "Støtte når du skal ta store beslutninger",
];

const useCases = [
  {
    title: "Bedrifter som vokser raskt",
    desc: "Du trenger noen med tung økonomiforståelse, men har ikke behov for en heltidsansatt. Vi stiller opp med erfaring og kompetanse akkurat når du trenger det.",
  },
  {
    title: "Hente inn penger eller investorer",
    desc: "Vi hjelper deg med å forberede alt investorer trenger å se — tall, planer og dokumentasjon. Slik at du står sterkt når du møter dem.",
  },
  {
    title: "Selge eller slå sammen bedriften",
    desc: "Vi hjelper deg med å planlegge og gjennomføre prosessen — fra å finne ut hva bedriften er verdt til å forhandle avtalen.",
  },
  {
    title: "Store veivalg og vekstplaner",
    desc: "Hva bør vi satse på? Hva lønner seg? Vi gir deg et solid grunnlag for å ta de riktige beslutningene — basert på fakta, ikke magefølelse.",
  },
];

const RelatedServices = [
  { label: "Din egen regnskapsfører", href: "/tjenester/regnskapsforer" },
  { label: "Skatterådgivning", href: "/tjenester/skatteplanlegging" },
];

const CFO = () => (
  <>
    <Helmet>
      <title>Økonomisk rådgiver for bedrifter | Avargo</title>
      <meta name="description" content="Få tilgang til erfarne økonomiske rådgivere uten å ansette noen på heltid. Vi hjelper med budsjett, vekstplaner, investorer og store beslutninger." />
      <link rel="canonical" href="https://avargo.no/tjenester/cfo" />
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          { "@type": "Question", "name": "Hva er en økonomisk rådgiver?", "acceptedAnswer": { "@type": "Answer", "text": "En økonomisk rådgiver hjelper deg med de store økonomiske spørsmålene i bedriften — budsjett, vekstplaner, investorer og viktige beslutninger. Hos Avargo får du tilgang til erfarne rådgivere uten å ansette noen på heltid." }},
          { "@type": "Question", "name": "Når trenger bedriften min en økonomisk rådgiver?", "acceptedAnswer": { "@type": "Answer", "text": "Du trenger det når bedriften skal ta store steg — hente inn penger, vokse raskt, selge virksomheten eller rett og slett ta viktige valg om fremtiden. Vi hjelper deg å se klart og ta gode beslutninger." }},
          { "@type": "Question", "name": "Hva koster det?", "acceptedAnswer": { "@type": "Answer", "text": "Prisen avhenger av hvor mye hjelp du trenger — fra noen møter i kvartalet til tett oppfølging over tid. Ta kontakt, så finner vi ut hva som passer for deg." }}
        ]
      })}</script>
    </Helmet>
    <section className="py-28 md:py-44 relative overflow-hidden">
      <img src={ambientTexture2} alt="" aria-hidden="true" loading="eager" className="absolute inset-0 w-full h-full object-cover opacity-[0.08] pointer-events-none select-none" />
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
          <p className="text-[10px] tracking-[0.45em] uppercase text-secondary mb-5 md:mb-6">Regnskap & Økonomi</p>
          <h1 className="font-heading text-5xl sm:text-6xl md:text-8xl leading-[1.02] mb-8 md:mb-10">
            En rådgiver i ryggen.{" "}
            <span className="italic text-gradient-rose">Uten heltidsansettelsen.</span>
          </h1>
          <p className="text-base md:text-xl text-muted-foreground font-light leading-relaxed max-w-2xl mb-10 md:mb-14">
            Du får tilgang til en erfaren økonomisk rådgiver som hjelper deg med de store spørsmålene — budsjett, vekst, investorer og viktige veivalg. Uten at du trenger å ansette noen fast.
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
              Tung kompetanse.{" "}
              <span className="italic text-gradient-rose">Uten de store kostnadene.</span>
            </h2>
            <p className="text-muted-foreground font-light leading-relaxed text-sm md:text-base">
              Vi tilpasser oss behovet ditt — fra noen strategiske møter i kvartalet til tett oppfølging i en vekstfase. Du bestemmer omfanget.
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

    <section className="py-24 md:py-40 border-y border-border/10 relative">
      <div className="absolute inset-0 ambient-glow opacity-15" />
      <div className="container mx-auto px-4 md:px-6 relative">
        <AnimatedSection>
          <p className="text-[10px] tracking-[0.4em] uppercase text-secondary mb-5 md:mb-6">Når passer det?</p>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-14 md:mb-20 max-w-2xl leading-snug">
            Når trenger du egentlig en rådgiver?
          </h2>
        </AnimatedSection>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
          {useCases.map((u, i) => (
            <AnimatedSection key={u.title} delay={i * 0.1}>
              <div className="p-8 md:p-10 glass rounded-3xl card-lift h-full">
                <h3 className="font-heading text-xl md:text-2xl mb-3">{u.title}</h3>
                <p className="text-sm text-muted-foreground font-light leading-relaxed">{u.desc}</p>
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
            Klar for å ta neste steg?
          </h2>
          <p className="text-muted-foreground font-light mb-10 max-w-md mx-auto text-sm">
            Ta en uforpliktende prat om hva en rådgiver kan bety for bedriften din.
          </p>
          <Link to="/kontakt" className="group inline-flex items-center gap-3 px-10 md:px-12 py-4 md:py-5 bg-primary text-primary-foreground text-sm font-medium tracking-wider rounded-full glow-rose hover:scale-[1.02] transition-all duration-500">
            Book en samtale <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
          </Link>
        </AnimatedSection>
      </div>
    </section>
  </>
);

export default CFO;
