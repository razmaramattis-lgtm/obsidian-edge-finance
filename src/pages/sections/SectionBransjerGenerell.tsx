import { Helmet } from "react-helmet-async";
import { Link, useParams, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight, CheckCircle2, Users, TrendingUp, Zap, Shield,
  Lightbulb, BarChart3, Handshake, Clock,
} from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { SECTIONS, type SectionId } from "@/contexts/SectionContext";
import heroImg from "@/assets/bransje-generell-hero.jpg";
import teamImg from "@/assets/bransje-generell-team.jpg";
import processImg from "@/assets/bransje-generell-process.jpg";

/* ─── Section-specific content ─── */
interface GenerellContent {
  metaTitle: string;
  metaDesc: string;
  tag: string;
  headline: string;
  headlineItalic: string;
  intro: string;
  introSub: string;
  whyTag: string;
  whyHeadline: string;
  whyItalic: string;
  whyPoints: { icon: React.ElementType; title: string; desc: string }[];
  howTag: string;
  howHeadline: string;
  howItalic: string;
  howSteps: { num: string; title: string; desc: string }[];
  deliverTag: string;
  deliverHeadline: string;
  deliverItalic: string;
  deliverables: string[];
  ctaHeadline: string;
  ctaItalic: string;
  ctaSub: string;
  ctaButton: string;
}

const content: Record<Exclude<SectionId, "regnskap">, GenerellContent> = {
  hr: {
    metaTitle: "HR & Personal for alle bransjer | Avargo",
    metaDesc: "Uansett bransje — vi tar hele HR-byrden. Lønn, arbeidsrett, personalhåndbok og rekruttering tilpasset din bedrift.",
    tag: "Avargo · HR · Alle bransjer",
    headline: "Vi tar HR-byrden — ",
    headlineItalic: "uansett bransje.",
    intro: "Arbeidsgiverens hverdag er den samme uansett om du driver restaurant, konsulentfirma eller produksjon — det handler om mennesker. Vi leverer HR-tjenester som er tilpasset din bedrifts størrelse, behov og bransje.",
    introSub: "Du slipper å ha en egen HR-avdeling. Vi er den.",
    whyTag: "Hvorfor velge oss",
    whyHeadline: "En komplett HR-partner som ",
    whyItalic: "vokser med deg.",
    whyPoints: [
      { icon: Users, title: "Dedikert HR-rådgiver", desc: "Du får én kontaktperson som kjenner bedriften din, de ansatte og regelverket som gjelder." },
      { icon: Shield, title: "Alltid compliant", desc: "Arbeidsrett endrer seg — vi sørger for at kontrakter, rutiner og oppsigelser alltid er korrekte." },
      { icon: Lightbulb, title: "Proaktiv rådgivning", desc: "Vi venter ikke på problemer. Vi identifiserer risiko og muligheter før de oppstår." },
      { icon: Clock, title: "Spar tid, hver uke", desc: "Lønnskjøring, feriepenger, sykemelding — alt håndtert automatisk og presist." },
    ],
    howTag: "Slik jobber vi",
    howHeadline: "Fra første kontakt til ",
    howItalic: "full HR-dekning.",
    howSteps: [
      { num: "01", title: "Kartlegging", desc: "Vi gjennomgår bedriften din, ansattforhold, kontrakter og rutiner — og identifiserer hva som mangler." },
      { num: "02", title: "Oppsett", desc: "Vi setter opp personalhåndbok, kontrakter, HMS-rutiner og lønnskjøring tilpasset din bedrift." },
      { num: "03", title: "Løpende drift", desc: "Vi kjører lønn, håndterer sykefravær, ansettelser og oppsigelser — løpende og proaktivt." },
      { num: "04", title: "Strategisk støtte", desc: "Kvartalsvis gjennomgang, oppdatering av rutiner og rådgivning ved vekst og endring." },
    ],
    deliverTag: "Hva du får",
    deliverHeadline: "Alt du trenger som ",
    deliverItalic: "arbeidsgiver.",
    deliverables: [
      "Lønnskjøring og feriepenger",
      "Arbeidskontrakter og oppsigelser",
      "Personalhåndbok tilpasset bedriften",
      "HMS-rutiner og dokumentasjon",
      "Sykefraværsoppfølging og dialog med NAV",
      "Rekrutteringsstøtte og onboarding",
      "Arbeidsmiljøkartlegging",
      "Varslingsrutiner og internkontroll",
      "Kompetanseutvikling og kursplanlegging",
      "Kvartalsvis HR-gjennomgang",
    ],
    ctaHeadline: "Klar for en enklere hverdag som ",
    ctaItalic: "arbeidsgiver?",
    ctaSub: "Én samtale er alt som skal til for å starte. Gratis og uforpliktende.",
    ctaButton: "Book en HR-gjennomgang",
  },
  markedsforing: {
    metaTitle: "Markedsføring for alle bransjer | Avargo",
    metaDesc: "Uansett bransje — vi bygger synlighet som gir resultater. SEO, annonsering, innholdsstrategi og nettbutikk.",
    tag: "Avargo · Markedsføring · Alle bransjer",
    headline: "Synlighet som selger — ",
    headlineItalic: "uansett bransje.",
    intro: "Enten du selger til privatpersoner eller bedrifter, lokalt eller nasjonalt — markedsføring handler om å bli funnet av de riktige kundene. Vi bygger vekststrategier som er tilpasset din bedrifts mål og budsjett.",
    introSub: "Datadrevet markedsføring — koblet direkte til bunnlinjen.",
    whyTag: "Hvorfor velge oss",
    whyHeadline: "En vekstpartner som ",
    whyItalic: "måler alt.",
    whyPoints: [
      { icon: TrendingUp, title: "Resultater du kan måle", desc: "Ingen gjetning. Vi kobler markedsføringen til de faktiske tallene — leads, salg og ROI." },
      { icon: BarChart3, title: "Strategi + eksekusjon", desc: "Vi lager planen og gjennomfører den — SEO, annonsering, innhold og kampanjer." },
      { icon: Zap, title: "Rask oppstart", desc: "Ingen måneder med planlegging. Vi starter med det som gir raskest effekt og bygger derfra." },
      { icon: Handshake, title: "Koblet til regnskapet", desc: "Som del av Avargo kan vi koble markedsføringen direkte til de økonomiske resultatene." },
    ],
    howTag: "Slik jobber vi",
    howHeadline: "Fra analyse til ",
    howItalic: "målbare resultater.",
    howSteps: [
      { num: "01", title: "Analyse", desc: "Vi kartlegger markedet ditt, konkurrentene og mulighetene — digitalt og lokalt." },
      { num: "02", title: "Strategi", desc: "Vi bygger en vekstplan med tydelige mål, kanaler og budsjetter tilpasset din bedrift." },
      { num: "03", title: "Eksekusjon", desc: "Vi setter opp og kjører SEO, annonser, innhold og kampanjer — kontinuerlig optimalisert." },
      { num: "04", title: "Rapportering", desc: "Månedlig gjennomgang med tydelige tall — hva fungerer, hva justeres, hva er ROI." },
    ],
    deliverTag: "Hva du får",
    deliverHeadline: "Komplett markedsføring — ",
    deliverItalic: "ingen hull.",
    deliverables: [
      "SEO og synlighet i Google",
      "Google Ads og Meta-annonser",
      "Innholdsstrategi og tekstproduksjon",
      "Sosiale medier og community",
      "Nettside og konverteringsoptimalisering",
      "E-postmarkedsføring og nyhetsbrev",
      "Lokal SEO og Google Business",
      "Merkevarestrategi og visuell profil",
      "Analyse og ROI-rapportering",
      "Nettbutikk og produktannonsering",
    ],
    ctaHeadline: "Klar for å bli mer ",
    ctaItalic: "synlig?",
    ctaSub: "Én samtale gir deg en konkret vekstplan. Gratis og uforpliktende.",
    ctaButton: "Book en markedsgjennomgang",
  },
  it: {
    metaTitle: "IT & Utvikling for alle bransjer | Avargo",
    metaDesc: "Uansett bransje — vi bygger nettsider, systemer og AI-automatisering som gjør hverdagen enklere.",
    tag: "Avargo · IT · Alle bransjer",
    headline: "Teknologi som forenkler — ",
    headlineItalic: "uansett bransje.",
    intro: "Digitale verktøy er ikke reservert for tech-selskaper. Vi bygger nettsider, interne systemer og automatiseringer som gjør hverdagen enklere for bedrifter i alle bransjer — tilpasset ditt behov og budsjett.",
    introSub: "Pragmatisk teknologi — bygget for verdi, ikke for fancy.",
    whyTag: "Hvorfor velge oss",
    whyHeadline: "IT-partner som bygger det ",
    whyItalic: "du faktisk trenger.",
    whyPoints: [
      { icon: Zap, title: "Pragmatisk tilnærming", desc: "Vi bygger det som gir verdi — ikke det som er trendy. Hver løsning har en tydelig business case." },
      { icon: Shield, title: "Sikkerhet og drift", desc: "Vi bygger med sikkerhet i bunn og tar ansvar for at systemene fungerer over tid." },
      { icon: Lightbulb, title: "AI og automatisering", desc: "Vi bruker kunstig intelligens der det gir mening — chatboter, dataanalyse og automatiserte prosesser." },
      { icon: Handshake, title: "Helhetlig forståelse", desc: "Som del av Avargo forstår vi forretningen din — ikke bare teknologien." },
    ],
    howTag: "Slik jobber vi",
    howHeadline: "Fra behov til ",
    howItalic: "ferdig løsning.",
    howSteps: [
      { num: "01", title: "Behovsanalyse", desc: "Vi kartlegger hva du trenger, hva du har i dag og hvor det er mest å hente på digitalisering." },
      { num: "02", title: "Design og prototyp", desc: "Vi lager skisser og prototyper slik at du ser løsningen før vi bygger den." },
      { num: "03", title: "Utvikling", desc: "Vi bygger løsningen med moderne teknologi — raskt, sikkert og skalerbart." },
      { num: "04", title: "Drift og videreutvikling", desc: "Vi drifter, vedlikeholder og videreutvikler — løsningen vokser med bedriften din." },
    ],
    deliverTag: "Hva du får",
    deliverHeadline: "Digitale løsninger som ",
    deliverItalic: "gir verdi.",
    deliverables: [
      "Profesjonelle nettsider",
      "Nettbutikk og e-handel",
      "AI-chatboter og kundeservice",
      "Interne dashboards og rapportering",
      "Automatisering av manuelle prosesser",
      "CRM og kundestyring",
      "Integrasjoner mellom systemer",
      "Booking- og bestillingssystemer",
      "Sikkerhet, personvern og GDPR",
      "Løpende drift og support",
    ],
    ctaHeadline: "Klar for å digitalisere ",
    ctaItalic: "smartere?",
    ctaSub: "Én samtale gir deg en konkret plan for hva som gir mest verdi. Gratis og uforpliktende.",
    ctaButton: "Book en IT-gjennomgang",
  },
};

const SectionBransjerGenerell = () => {
  const { sectionId } = useParams<{ sectionId: string }>();
  const section = sectionId ? SECTIONS[sectionId as SectionId] : null;

  if (!section || section.id === "regnskap") {
    return <Navigate to="/bransjer" replace />;
  }

  const c = content[section.id as Exclude<SectionId, "regnskap">];
  const sp = (path: string) => `${section.basePath}${path}`;

  return (
    <>
      <Helmet>
        <title>{c.metaTitle}</title>
        <meta name="description" content={c.metaDesc} />
        <link rel="canonical" href={`https://avargo.no${sp("/bransjer/alle")}`} />
      </Helmet>

      {/* HERO */}
      <section className="py-28 md:py-44 relative overflow-hidden">
        <img src={heroImg} alt="" aria-hidden="true" loading="eager" className="absolute inset-0 w-full h-full object-cover opacity-[0.12] pointer-events-none select-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} className="max-w-4xl">
            <p className="text-[10px] tracking-[0.45em] uppercase text-secondary mb-5 md:mb-6">{c.tag}</p>
            <h1 className="font-heading text-5xl sm:text-6xl md:text-8xl leading-[1.02] mb-8 md:mb-10">
              {c.headline}<span className="italic text-gradient-rose">{c.headlineItalic}</span>
            </h1>
            <p className="text-base md:text-xl text-muted-foreground font-light leading-relaxed max-w-2xl mb-4">{c.intro}</p>
            <p className="text-sm text-primary/60 italic font-light mb-10 md:mb-14">{c.introSub}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to={sp("/kontakt")} className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 md:px-10 py-4 bg-primary text-primary-foreground text-sm font-medium tracking-wider rounded-full glow-rose hover:scale-[1.02] transition-all duration-500">
                {c.ctaButton}
                <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
              </Link>
              <Link to={sp("/bransjer")} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 md:px-10 py-4 text-sm text-foreground/70 tracking-wider rounded-full border border-border/30 hover:border-primary/20 hover:text-foreground transition-all duration-500">
                Se bransjeoversikt
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6"><div className="line-accent" /></div>

      {/* WHY US */}
      <section className="py-24 md:py-40">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection>
            <p className="text-[10px] tracking-[0.4em] uppercase text-secondary mb-5 md:mb-6">{c.whyTag}</p>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-14 md:mb-20 max-w-3xl leading-snug">
              {c.whyHeadline}<span className="italic text-gradient-teal">{c.whyItalic}</span>
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {c.whyPoints.map((p, i) => (
              <AnimatedSection key={p.title} delay={i * 0.1}>
                <div className="p-8 md:p-10 glass rounded-3xl card-lift h-full flex gap-5">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary/15 to-secondary/10 flex items-center justify-center shrink-0">
                    <p.icon size={18} className="text-primary" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-heading text-xl md:text-2xl mb-2">{p.title}</h3>
                    <p className="text-sm text-muted-foreground font-light leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* IMAGE BREAK */}
      <section className="py-0 relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="rounded-3xl overflow-hidden relative h-[300px] md:h-[450px]">
            <img src={teamImg} alt="Teamet i Avargo samarbeider" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
          </div>
        </div>
      </section>

      {/* HOW WE WORK */}
      <section className="py-24 md:py-40">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection>
            <p className="text-[10px] tracking-[0.4em] uppercase text-secondary mb-5 md:mb-6">{c.howTag}</p>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-14 md:mb-20 max-w-2xl leading-snug">
              {c.howHeadline}<span className="italic text-gradient-rose">{c.howItalic}</span>
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {c.howSteps.map((s, i) => (
              <AnimatedSection key={s.num} delay={i * 0.1}>
                <div className="p-8 md:p-10 glass rounded-3xl card-lift h-full">
                  <span className="font-heading text-5xl text-primary/20">{s.num}</span>
                  <h3 className="font-heading text-xl md:text-2xl mt-5 mb-3">{s.title}</h3>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed">{s.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* DELIVERABLES */}
      <section className="py-24 md:py-40 border-y border-border/10 relative">
        <div className="absolute inset-0 ambient-glow opacity-15" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
            <AnimatedSection>
              <p className="text-[10px] tracking-[0.4em] uppercase text-secondary mb-5 md:mb-6">{c.deliverTag}</p>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-5 leading-snug">
                {c.deliverHeadline}<span className="italic text-gradient-teal">{c.deliverItalic}</span>
              </h2>
              <div className="grid grid-cols-1 gap-3 mt-10">
                {c.deliverables.map((d) => (
                  <div key={d} className="flex items-start gap-3">
                    <CheckCircle2 size={16} className="text-primary mt-0.5 shrink-0" strokeWidth={1.5} />
                    <span className="text-sm text-muted-foreground font-light">{d}</span>
                  </div>
                ))}
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <div className="rounded-3xl overflow-hidden h-[350px] md:h-[500px]">
                <img src={processImg} alt="Avargo prosess og verktøy" loading="lazy" className="w-full h-full object-cover" />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-40 text-center relative">
        <div className="absolute inset-0 ambient-glow opacity-25" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <AnimatedSection>
            <p className="text-[10px] tracking-[0.45em] uppercase text-secondary mb-6 md:mb-8">Kom i gang</p>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-6xl mb-5 md:mb-6 leading-snug max-w-3xl mx-auto">
              {c.ctaHeadline}<span className="italic text-gradient-rose">{c.ctaItalic}</span>
            </h2>
            <p className="text-muted-foreground font-light mb-10 md:mb-14 max-w-lg mx-auto text-sm md:text-base">{c.ctaSub}</p>
            <Link to={sp("/kontakt")} className="group inline-flex items-center gap-3 px-10 md:px-12 py-4 md:py-5 bg-primary text-primary-foreground text-sm font-medium tracking-wider rounded-full glow-rose hover:scale-[1.02] transition-all duration-500">
              {c.ctaButton}
              <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
};

export default SectionBransjerGenerell;
