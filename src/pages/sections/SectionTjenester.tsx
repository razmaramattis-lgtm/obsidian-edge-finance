import { Link, useParams, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { SECTIONS, type SectionId } from "@/contexts/SectionContext";

/**
 * Maps section IDs to the service routes that belong to that section.
 * Each section shows only its own services.
 */
const sectionServices: Record<SectionId, {
  headline: string;
  intro: string;
  services: { title: string; desc: string; href: string }[];
}> = {
  regnskap: {
    headline: "Vi tar oss av tallene. Du tar deg av bedriften.",
    intro: "Godt regnskap handler om å vite hvordan bedriften din faktisk gjør det.",
    services: [
      { title: "Din egen regnskapsfører", desc: "Én fast person som kjenner bedriften din — alltid tilgjengelig.", href: "/tjenester/regnskapsforer" },
      { title: "Lønnskjøring", desc: "Lønn, feriepenger, sykepenger og all innrapportering.", href: "/tjenester/lonn" },
      { title: "Årsregnskap & skattemelding", desc: "Alt levert innen fristen — uten stress.", href: "/tjenester/arsregnskap" },
      { title: "CFO-rådgivning", desc: "Budsjett, vekstplaner og strategisk økonomisk rådgivning.", href: "/tjenester/cfo" },
      { title: "Fakturering & innkreving", desc: "Vi sender fakturaer og følger opp betaling.", href: "/tjenester/fakturering" },
      { title: "Skatteplanlegging", desc: "Betal riktig skatt — ikke for mye.", href: "/tjenester/skatteplanlegging" },
      { title: "1-1 Regnskapsgjennomgang", desc: "Personlig møte med gjennomgang av tallene dine.", href: "/tjenester/1-1-regnskap" },
      { title: "Avargo Dashboard", desc: "Se økonomien din, rapporter og snakk med rådgiveren.", href: "/tjenester/dashboard" },
    ],
  },
  hr: {
    headline: "Alt du trenger for å ta godt vare på de ansatte.",
    intro: "Fra å finne riktig person til å sørge for at alt er på stell med kontrakter, lønn og arbeidsmiljø.",
    services: [
      { title: "Lønn & HR-administrasjon", desc: "Full lønnskjøring og personaladministrasjon.", href: "/tjenester/hr-og-lonn" },
      { title: "Ansettelse & rekruttering", desc: "Fra stillingsannonse til signert kontrakt.", href: "/tjenester/ansettelse" },
      { title: "Personalhåndbok", desc: "Komplett håndbok med regler og retningslinjer.", href: "/tjenester/personalhandbok" },
      { title: "Arbeidsrett & HMS", desc: "Dokumentasjon, oppfølging og rådgivning.", href: "/tjenester/arbeidsrett" },
    ],
  },
  markedsforing: {
    headline: "Bli sett. Få flere kunder. Voks.",
    intro: "Vi hjelper deg å bli synlig på nett og gjøre besøkende til betalende kunder.",
    services: [
      { title: "SEO & søkbarhet", desc: "Bli funnet på Google uten å betale for hvert klikk.", href: "/tjenester/seo" },
      { title: "Meta-annonser", desc: "Facebook og Instagram-annonser som treffer.", href: "/tjenester/meta-annonser" },
      { title: "Google Ads", desc: "Vis deg øverst når noen søker etter det du tilbyr.", href: "/tjenester/google-ads" },
      { title: "Nettbutikk", desc: "Moderne nettbutikk som gjør det enkelt å handle.", href: "/tjenester/nettbutikk" },
    ],
  },
  it: {
    headline: "Teknologi som gjør hverdagen enklere.",
    intro: "Vi bygger nettsider, smarte verktøy og løsninger som sparer deg for tid.",
    services: [
      { title: "Skreddersydde nettsider", desc: "Moderne nettsider som gir resultater.", href: "/tjenester/nettsider" },
      { title: "AI-chatbot & kundeservice", desc: "Smart chatbot som svarer kundene hele døgnet.", href: "/tjenester/chatbot" },
      { title: "Interne systemer", desc: "Dashboards og verktøy tilpasset din bedrift.", href: "/tjenester/internsystemer" },
      { title: "AI & automatisering", desc: "Smarte løsninger som gjør oppgavene for deg.", href: "/tjenester/ai-automatisering" },
    ],
  },
};

const SectionTjenester = () => {
  const { sectionId } = useParams<{ sectionId: string }>();
  const section = sectionId ? SECTIONS[sectionId as SectionId] : null;

  if (!section) return <Navigate to="/" replace />;

  const content = sectionServices[section.id];

  return (
    <>
      <Helmet>
        <title>Tjenester — {section.name} | Avargo</title>
        <meta name="description" content={`${content.headline} ${content.intro}`} />
        <link rel="canonical" href={`https://avargo.no${section.basePath}/tjenester`} />
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
              Avargo · {section.shortName} · Tjenester
            </p>
            <h1 className="font-heading text-5xl sm:text-6xl md:text-8xl leading-[1.02] mb-8 md:mb-10">
              {content.headline}
            </h1>
            <p className="text-base md:text-xl text-muted-foreground font-light leading-relaxed max-w-2xl mb-10 md:mb-14">
              {content.intro}
            </p>
            <Link
              to="/kontakt"
              className="group inline-flex items-center gap-3 px-8 md:px-10 py-4 bg-primary text-primary-foreground text-sm font-medium tracking-wider rounded-full glow-rose hover:scale-[1.02] transition-all duration-500"
            >
              Få et uforpliktende tilbud
              <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6"><div className="line-accent" /></div>

      {/* SERVICES LIST */}
      <section className="py-24 md:py-40">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {content.services.map((service, i) => (
              <AnimatedSection key={service.title} delay={i * 0.08}>
                <Link
                  to={service.href}
                  className="block p-8 md:p-10 glass rounded-3xl card-lift h-full group"
                >
                  <h3 className="font-heading text-xl md:text-2xl mb-3 group-hover:text-primary transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed mb-6">
                    {service.desc}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-[12px] text-primary tracking-wider">
                    Les mer <ChevronRight size={11} className="group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </Link>
              </AnimatedSection>
            ))}
          </div>
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
              Ta en uforpliktende prat — vi forteller deg hva som passer for din bedrift.
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

export default SectionTjenester;
