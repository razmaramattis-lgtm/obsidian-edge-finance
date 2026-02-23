import { Link, useParams, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, BookOpen, Users, Megaphone, Code2 } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { SECTIONS, SECTION_LIST, type SectionId } from "@/contexts/SectionContext";

const sectionContent: Record<SectionId, {
  hero: { headline: React.ReactNode; sub: string };
  features: { title: string; desc: string }[];
  why: { title: string; desc: string }[];
}> = {
  regnskap: {
    hero: {
      headline: <>Regnskapet ditt, <span className="italic text-gradient-rose">i trygge hender.</span></>,
      sub: "Dedikert statsautorisert regnskapsfører, skatteoptimalisering og full oversikt — alt inkludert i fast pris.",
    },
    features: [
      { title: "Én fast regnskapsfører", desc: "Du får én person som kjenner bedriften din ut og inn." },
      { title: "Alt inkludert", desc: "Bokføring, MVA, lønn, årsregnskap og skattemelding — ingen tillegg." },
      { title: "Proaktiv rådgivning", desc: "Vi venter ikke til du spør. Vi ser mulighetene og forteller deg." },
      { title: "Alltid tilgjengelig", desc: "Ring, send melding eller book et møte — vi er der når du trenger oss." },
    ],
    why: [
      { title: "Statsautoriserte", desc: "Alle våre regnskapsførere er godkjent av Finanstilsynet." },
      { title: "Fast pris", desc: "Ingen overraskelser. Du vet hva det koster fra dag én." },
      { title: "Ingen bindingstid", desc: "Vi beholder deg gjennom kvalitet, ikke kontrakter." },
    ],
  },
  hr: {
    hero: {
      headline: <>Menneskene dine, <span className="italic text-gradient-rose">vårt ansvar.</span></>,
      sub: "Lønnskjøring, arbeidsrett, personalhåndbok og rekruttering — vi tar hele HR-byrden slik at du kan fokusere på teamet.",
    },
    features: [
      { title: "Full lønnskjøring", desc: "Lønn, feriepenger, sykepenger og innrapportering — alt på plass." },
      { title: "Personalhåndbok", desc: "Komplett håndbok tilpasset din bedrift, klar til bruk." },
      { title: "Arbeidsrett & HMS", desc: "Vi hjelper deg med reglene, dokumentasjonen og oppfølgingen." },
      { title: "Rekruttering", desc: "Fra stillingsannonse til signert kontrakt — vi tar hele prosessen." },
    ],
    why: [
      { title: "Spesialiserte", desc: "HR-spesialister som kjenner norsk arbeidsrett." },
      { title: "Alt på ett sted", desc: "Lønn, kontrakter, HMS og rådgivning i én løsning." },
      { title: "Trygg oppfølging", desc: "Vi er der for vanskelige samtaler og kompliserte saker." },
    ],
  },
  markedsforing: {
    hero: {
      headline: <>Bli sett. Få flere kunder. <span className="italic text-gradient-rose">Voks.</span></>,
      sub: "SEO, annonsering, nettbutikk og innholdsstrategi — markedsføring som er koblet til de faktiske tallene dine.",
    },
    features: [
      { title: "SEO & søkbarhet", desc: "Bli funnet når kundene dine søker etter det du tilbyr." },
      { title: "Meta & Google Ads", desc: "Annonser som treffer riktig — med full kontroll på budsjettet." },
      { title: "Nettbutikk", desc: "Moderne butikk som selger — med betaling, frakt og lager." },
      { title: "Datadrevet", desc: "Alt er koblet til regnskapet, så du ser hva som gir resultater." },
    ],
    why: [
      { title: "Helhetlig", desc: "Markedsføringen henger sammen med økonomien din." },
      { title: "Målbart", desc: "Du ser nøyaktig hva som fungerer og hva som ikke gjør det." },
      { title: "Skalerbart", desc: "Start smått, skaler opp når resultatene kommer." },
    ],
  },
  it: {
    hero: {
      headline: <>Teknologi som gjør hverdagen <span className="italic text-gradient-rose">enklere.</span></>,
      sub: "Nettsider, chatboter, interne systemer og AI-automatisering — bygget for å spare deg tid og penger.",
    },
    features: [
      { title: "Skreddersydde nettsider", desc: "Moderne, raske nettsider som gir resultater." },
      { title: "AI & automatisering", desc: "La maskiner gjøre de kjedelige oppgavene for deg." },
      { title: "Chatbot", desc: "Kundeservice 24/7 — uten at du trenger å ansette flere." },
      { title: "Interne systemer", desc: "Dashboards og verktøy tilpasset akkurat din bedrift." },
    ],
    why: [
      { title: "Pragmatisk", desc: "Vi bygger det som gir verdi, ikke det som er fancy." },
      { title: "Vedlikeholdt", desc: "Vi holder systemene oppdatert og sikre over tid." },
      { title: "Integrert", desc: "Alt snakker sammen med resten av virksomheten." },
    ],
  },
};

const SectionHome = () => {
  const { sectionId } = useParams<{ sectionId: string }>();
  const section = sectionId ? SECTIONS[sectionId as SectionId] : null;

  if (!section) return <Navigate to="/" replace />;

  const content = sectionContent[section.id];
  const otherSections = SECTION_LIST.filter((s) => s.id !== section.id);

  return (
    <>
      <Helmet>
        <title>{section.name} | Avargo</title>
        <meta name="description" content={section.description} />
        <link rel="canonical" href={`https://avargo.no${section.basePath}`} />
      </Helmet>

      {/* HERO */}
      <section className="py-28 md:py-44 relative overflow-hidden">
        <div className="absolute inset-0 ambient-glow opacity-30" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl"
          >
            <p className="text-[10px] tracking-[0.45em] uppercase text-primary mb-5 md:mb-6">
              Avargo · {section.shortName}
            </p>
            <h1 className="font-heading text-5xl sm:text-6xl md:text-8xl leading-[1.02] mb-8 md:mb-10">
              {content.hero.headline}
            </h1>
            <p className="text-base md:text-xl text-muted-foreground font-light leading-relaxed max-w-2xl mb-10 md:mb-14">
              {content.hero.sub}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/kontakt"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 md:px-10 py-4 bg-primary text-primary-foreground text-sm font-medium tracking-wider rounded-full glow-rose hover:scale-[1.02] transition-all duration-500"
              >
                Snakk med oss <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
              </Link>
              <Link
                to={`${section.basePath}/tjenester`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 md:px-10 py-4 text-sm text-foreground/70 tracking-wider rounded-full border border-border/30 hover:border-primary/20 hover:text-foreground transition-all duration-500"
              >
                Se tjenester
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6"><div className="line-accent" /></div>

      {/* FEATURES */}
      <section className="py-24 md:py-40">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection>
            <p className="text-[10px] tracking-[0.4em] uppercase text-primary/60 mb-5">Hva du får</p>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-14 md:mb-20 max-w-2xl leading-snug">
              Alt du trenger — <span className="italic text-gradient-rose">ingenting du ikke trenger.</span>
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            {content.features.map((f, i) => (
              <AnimatedSection key={f.title} delay={i * 0.1}>
                <div className="p-8 md:p-10 glass rounded-3xl card-lift h-full">
                  <CheckCircle2 size={18} className="text-primary mb-4" strokeWidth={1.5} />
                  <h3 className="font-heading text-xl md:text-2xl mb-3">{f.title}</h3>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed">{f.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="py-24 md:py-40 border-y border-border/10 relative">
        <div className="absolute inset-0 ambient-glow opacity-15" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <AnimatedSection>
            <p className="text-[10px] tracking-[0.4em] uppercase text-primary/60 mb-5">Hvorfor Avargo</p>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-14 md:mb-20 max-w-2xl leading-snug">
              Det som gjør forskjellen.
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {content.why.map((w, i) => (
              <AnimatedSection key={w.title} delay={i * 0.1}>
                <div className="p-8 glass rounded-3xl h-full">
                  <h3 className="font-heading text-xl mb-3">{w.title}</h3>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed">{w.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* OTHER SECTIONS */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection>
            <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground/50 mb-8">Utforsk også</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {otherSections.map((s) => (
                <Link
                  key={s.id}
                  to={s.basePath}
                  className="flex items-center gap-3 px-6 py-5 glass rounded-2xl card-lift group"
                >
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center border transition-colors duration-300"
                    style={{
                      backgroundColor: `hsl(${s.accent.h} ${s.accent.s}% ${s.accent.l}% / 0.1)`,
                      borderColor: `hsl(${s.accent.h} ${s.accent.s}% ${s.accent.l}% / 0.2)`,
                    }}
                  >
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: `hsl(${s.accent.h} ${s.accent.s}% ${s.accent.l}%)` }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{s.shortName}</p>
                    <p className="text-xs text-muted-foreground">{s.tagline}</p>
                  </div>
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
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-5 leading-snug max-w-2xl mx-auto">
              Klar for å komme i gang?
            </h2>
            <p className="text-muted-foreground font-light mb-10 max-w-md mx-auto text-sm">
              Ta en uforpliktende prat — vi hjelper deg videre.
            </p>
            <Link
              to="/kontakt"
              className="group inline-flex items-center gap-3 px-10 md:px-12 py-4 md:py-5 bg-primary text-primary-foreground text-sm font-medium tracking-wider rounded-full glow-rose hover:scale-[1.02] transition-all duration-500"
            >
              Book en samtale <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
};

export default SectionHome;
