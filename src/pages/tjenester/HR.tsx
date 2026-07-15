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

const engasjementer = [
  {
    title: "Midlertidig oppdrag",
    desc: "Interim HR-bistand i en periode — f.eks. ved sykefravær, permisjon eller når bedriften står midt i et prosjekt som krever ekstra kapasitet.",
  },
  {
    title: "Oppstartshjelp",
    desc: "Vi hjelper nystartede bedrifter å få HR-fundamentet på plass fra dag én — rutiner, kontrakter, personalhåndbok og et enkelt HR-system.",
  },
  {
    title: "Langsiktig bistand",
    desc: "Fast HR-støtte for bedrifter som ikke har egen HR-kompetanse internt. Vi fungerer som en trygg medspiller for ledelsen over tid.",
  },
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

    <section className="py-20 md:py-28 relative overflow-hidden bg-card">
      <img src={ambientTexture3} alt="" aria-hidden="true" loading="eager" className="absolute inset-0 w-full h-full object-cover opacity-[0.05] pointer-events-none select-none" />
      <div className="absolute inset-0 ambient-glow opacity-20" />
      <div className="container mx-auto px-4 md:px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl"
        >
          <Link to="/tjenester" className="inline-flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase text-muted-foreground/60 hover:text-foreground transition-colors mb-6 md:mb-8">
            <ArrowLeft size={12} /> Alle tjenester
          </Link>
          <p className="text-[10px] tracking-[0.45em] uppercase text-secondary mb-4">HR & Personal</p>
          <h1 className="font-heading text-5xl sm:text-6xl md:text-8xl leading-[1.02] mb-6 md:mb-8 text-foreground">
            Praktisk HR for små og mellomstore bedrifter.{" "}
            <span className="italic text-gradient-teal text-3xl sm:text-4xl md:text-5xl block mt-4 md:mt-6">Vi gjør det enkelt å være en god arbeidsgiver.</span>
          </h1>
          <p className="text-base md:text-xl text-muted-foreground font-light leading-relaxed max-w-2xl mb-8 md:mb-10">
            Vi hjelper deg med å etablere gode HR-rutiner, effektive personalprosesser og moderne HR-systemer — uten å overta rollen som advokat eller juridisk rådgiver.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/kontakt" className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 md:px-10 py-4 bg-primary text-primary-foreground text-sm font-medium tracking-wider rounded-full glow-rose hover:scale-[1.02] transition-all duration-500">
              Få et uforpliktende tilbud
              <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>
            <Link to="/priser" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 md:px-10 py-4 text-sm text-foreground/70 tracking-wider rounded-full border border-border/30 hover:border-primary/20 hover:text-foreground transition-all duration-500">
              Se priser
            </Link>
          </div>
        </motion.div>
      </div>
    </section>

    <section className="py-14 md:py-20 bg-card">
      <div className="container mx-auto px-4 md:px-6">
        <AnimatedSection>
          <p className="text-[10px] tracking-[0.4em] uppercase text-secondary mb-4">Etablering</p>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-5 leading-snug max-w-3xl text-foreground">
            Vi bygger HR-fundamentet i bedriften din.{" "}
            <span className="italic text-gradient-teal">Fra bunn av.</span>
          </h2>
          <p className="text-muted-foreground font-light leading-relaxed text-sm md:text-base max-w-2xl mb-8 md:mb-10">
            Vi kartlegger dagens rutiner og setter opp det du trenger for å drive personalarbeidet strukturert og trygt — tilpasset størrelsen på bedriften.
          </p>
        </AnimatedSection>
        <AnimatedSection delay={0.15}>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {etablering.map((d) => (
              <li key={d} className="flex items-start gap-3 text-sm font-light text-foreground/80">
                <CheckCircle2 size={14} className="text-foreground mt-0.5 shrink-0" strokeWidth={1.75} />
                {d}
              </li>
            ))}
          </ul>
        </AnimatedSection>
      </div>
    </section>

    <section className="py-14 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <AnimatedSection>
          <p className="text-[10px] tracking-[0.4em] uppercase text-secondary mb-4">Løpende lederstøtte</p>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-5 leading-snug max-w-3xl text-foreground">
            En trygg medspiller{" "}
            <span className="italic text-gradient-teal">når du trenger den.</span>
          </h2>
          <p className="text-muted-foreground font-light leading-relaxed text-sm md:text-base max-w-2xl mb-8 md:mb-10">
            Når fundamentet er på plass er vi tilgjengelige for sparring, veiledning og oppdatering av rutiner og systemer i det daglige.
          </p>
        </AnimatedSection>
        <AnimatedSection delay={0.15}>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {lopende.map((d) => (
              <li key={d} className="flex items-start gap-3 text-sm font-light text-foreground/80">
                <CheckCircle2 size={14} className="text-foreground mt-0.5 shrink-0" strokeWidth={1.75} />
                {d}
              </li>
            ))}
          </ul>
        </AnimatedSection>
      </div>
    </section>

    <section className="py-14 md:py-20 bg-card">
      <div className="container mx-auto px-4 md:px-6">
        <AnimatedSection>
          <p className="text-[10px] tracking-[0.4em] uppercase text-secondary mb-4">Slik jobber vi sammen</p>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-5 leading-snug max-w-3xl text-foreground">
            Fleksibel HR-bistand{" "}
            <span className="italic text-gradient-teal">tilpasset situasjonen din.</span>
          </h2>
          <p className="text-muted-foreground font-light leading-relaxed text-sm md:text-base max-w-2xl mb-8 md:mb-10">
            Vi tar både korte og lengre oppdrag — og hjelper deg der bedriften faktisk trenger det.
          </p>
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {engasjementer.map((e, i) => (
            <AnimatedSection key={e.title} delay={i * 0.1}>
              <div className="p-6 md:p-7 bg-background rounded-2xl border border-border/60 card-lift h-full">
                <h3 className="font-heading text-lg md:text-xl mb-2.5 text-foreground">{e.title}</h3>
                <p className="text-sm text-muted-foreground font-light leading-relaxed">{e.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>

    <section className="py-14 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <AnimatedSection>
          <p className="text-[10px] tracking-[0.4em] uppercase text-secondary mb-4">Nivåer</p>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-5 leading-snug max-w-3xl text-foreground">
            Tilpasset behovet ditt.{" "}
            <span className="italic text-gradient-teal">Liten eller medium.</span>
          </h2>
          <p className="text-muted-foreground font-light leading-relaxed text-sm md:text-base max-w-2xl mb-8 md:mb-10">
            Vi tilpasser omfanget etter størrelsen på bedriften. Trenger du kun det grunnleggende, eller ønsker du et komplett HR-system i bunn?
          </p>
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl">
          <AnimatedSection delay={0.1}>
            <div className="p-8 md:p-10 bg-card rounded-3xl border border-border/60 h-full">
              <p className="text-[10px] tracking-[0.4em] uppercase text-secondary mb-4">Liten</p>
              <h3 className="font-heading text-2xl md:text-3xl mb-4 text-foreground">Enkel HR-bistand</h3>
              <p className="text-sm text-muted-foreground font-light leading-relaxed mb-6">
                For små bedrifter som trenger et solid grunnlag — uten et eget HR-system.
              </p>
              <ul className="space-y-3">
                {[
                  "HR-kartlegging",
                  "Arbeidsavtaler",
                  "Personalhåndbok",
                  "Ferie- og fraværsrutiner",
                ].map((d) => (
                  <li key={d} className="flex items-start gap-3 text-sm font-light text-foreground/80">
                    <CheckCircle2 size={14} className="text-foreground mt-0.5 shrink-0" strokeWidth={1.75} />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <div className="p-8 md:p-10 bg-card rounded-3xl h-full border-2 border-primary/40 shadow-[0_18px_40px_-22px_hsl(20_10%_12%/0.14)]">
              <p className="text-[10px] tracking-[0.4em] uppercase text-primary mb-4">Medium</p>
              <h3 className="font-heading text-2xl md:text-3xl mb-4 text-foreground">Med HR-system og lederstøtte</h3>
              <p className="text-sm text-muted-foreground font-light leading-relaxed mb-6">
                For bedrifter som ønsker et HR-system i bunn og tettere oppfølging i det daglige.
              </p>
              <ul className="space-y-3">
                {[
                  "Alt i Liten",
                  "Etablering av HR-system (ekstern leverandør)",
                  "Tilpasning av innholdet til bedriften",
                  "Lederstøtte og veiledning",
                  "Onboarding- og offboarding-bistand",
                ].map((d) => (
                  <li key={d} className="flex items-start gap-3 text-sm font-light text-foreground/80">
                    <CheckCircle2 size={14} className="text-foreground mt-0.5 shrink-0" strokeWidth={1.75} />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>

    <section className="py-14 md:py-20 bg-card border-y border-border/40 relative">
      <div className="container mx-auto px-4 md:px-6 relative">
        <AnimatedSection>
          <p className="text-[10px] tracking-[0.4em] uppercase text-secondary mb-4">Hvorfor Avargo</p>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-10 md:mb-14 max-w-2xl leading-snug text-foreground">
            Praktisk hjelp der du trenger den.
          </h2>
        </AnimatedSection>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6 max-w-4xl">
          {pillars.map((p, i) => (
            <AnimatedSection key={p.title} delay={i * 0.1}>
              <div className="p-6 md:p-7 bg-background rounded-2xl border border-border/60 card-lift h-full">
                <h3 className="font-heading text-lg md:text-xl mb-2.5 text-foreground">{p.title}</h3>
                <p className="text-sm text-muted-foreground font-light leading-relaxed">{p.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>

    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-6">
        <AnimatedSection>
          <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground/60 mb-6">Relaterte tjenester</p>
          <div className="flex flex-wrap gap-3">
            {RelatedServices.map((s) => (
              <Link key={s.href} to={s.href} className="inline-flex items-center gap-2 px-5 py-2.5 text-[12px] tracking-wide text-foreground/70 border border-border/40 bg-card rounded-full hover:border-primary/30 hover:text-foreground transition-all duration-300">
                {s.label} <ChevronRight size={11} className="text-primary/60" />
              </Link>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>

    <section className="py-16 md:py-24 bg-card border-t border-border/40 text-center relative">
      <div className="container mx-auto px-4 md:px-6 relative">
        <AnimatedSection>
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
            <Shield size={18} className="text-primary" strokeWidth={1.5} />
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-4 leading-snug max-w-2xl mx-auto text-foreground">
            La oss gjøre HR enklere for deg.
          </h2>
          <p className="text-muted-foreground font-light mb-8 max-w-md mx-auto text-sm">
            En kort samtale er nok til å finne ut hvor vi best kan hjelpe bedriften din.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/kontakt" className="group inline-flex items-center justify-center gap-3 px-8 md:px-10 py-4 bg-primary text-primary-foreground text-sm font-medium tracking-wider rounded-full glow-rose hover:scale-[1.02] transition-all duration-500">
              Få et uforpliktende tilbud <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>
            <Link to="/tjenester" className="inline-flex items-center justify-center gap-2 px-8 md:px-10 py-4 text-sm text-foreground/70 tracking-wider rounded-full border border-border/30 hover:border-primary/20 hover:text-foreground transition-all duration-500">
              Se våre tjenester
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  </>
);

export default HR;
