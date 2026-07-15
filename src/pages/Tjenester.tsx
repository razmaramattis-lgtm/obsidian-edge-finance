import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Users,
  TrendingUp,
  Globe,
  Search,
  Megaphone,
  ShoppingCart,
  Bot,
  Briefcase,
  ChevronRight,
  UserPlus,
  FileText,
  Scale,
  Code,
  Cpu,
  BarChart3,
  Receipt,
  PieChart,
} from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { useSection } from "@/contexts/SectionContext";
import { sectionCategoryIds, sectionPageCopy } from "@/config/sectionContent";

const categories = [
  {
    id: "regnskap",
    label: "Regnskap & Økonomi",
    tag: "Kjerneleveranse",
    tagColor: "text-primary",
    accent: "48 166 132",
    headline: "Vi tar oss av tallene. Du tar deg av bedriften.",
    intro:
      "Godt regnskap handler ikke bare om å følge regler — det handler om å vite hvordan bedriften din faktisk gjør det. Vi gir deg en egen regnskapsfører som kjenner deg og bedriften din, og som sørger for at alt er i orden — hele året.",
    services: [
      {
        icon: BookOpen,
        href: "/tjenester/regnskapsforer",
        title: "Din egen regnskapsfører",
        desc: "Du får én fast person som tar seg av regnskapet ditt. Ingen køer, ingen nye ansikter hver gang. En person som kjenner bedriften din og følger opp uten at du trenger å be om det.",
        sub: [
          "Løpende bokføring av alle bilag",
          "MVA-rapportering og innlevering",
          "Årsregnskap og næringsoppgave",
          "Skattemelding for selskap og eier",
          "Aksjonærregisteroppgave (RF-1086)",
          "Bankintegrasjon og automatisert bilagsflyt",
        ],
      },
      {
        icon: Receipt,
        href: "/tjenester/lonn",
        title: "Lønnskjøring",
        desc: "Vi sørger for at de ansatte får lønnen sin til rett tid, hver eneste måned. Feriepenger, sykepenger og alt som skal rapporteres til det offentlige — vi tar det.",
        sub: [
          "Lønnskjøring hver måned",
          "A-melding til Skatteetaten",
          "Feriepenger og feriepengeberegning",
          "Sykepenger og refusjoner fra NAV",
          "Reiseregninger og utlegg",
          "Årsavslutning og lønnsoppsummering",
        ],
      },
      {
        icon: PieChart,
        href: "/tjenester/arsregnskap",
        title: "Årsoppgjør og skattemelding",
        desc: "Vi gjør ferdig årsregnskapet og skattemeldingen for deg — uten stress. Alt leveres innen fristen, slik at du slipper å tenke på det.",
        sub: [
          "Komplett årsregnskap",
          "Skattemelding for selskap",
          "Skattemelding for eiere",
          "Aksjonærregisteroppgave",
          "Avstemming av balanseposter",
          "Revisjonstøtte ved behov",
        ],
      },
      {
        icon: Briefcase,
        href: "/tjenester/cfo",
        title: "Økonomisk rådgiver",
        desc: "En erfaren rådgiver som hjelper deg med de store beslutningene — budsjett, vekstplaner, investorer og hva du bør gjøre videre. Uten at du trenger å ansette noen på heltid.",
        sub: [
          "Budsjett og langsiktige planer",
          "Kommunikasjon med investorer og styret",
          "Økonomiske modeller og prognoser",
          "Rapporter til styret og eiere",
          "Vurdering av risiko og internkontroll",
          "Støtte ved store beslutninger",
        ],
      },
      {
        icon: Receipt,
        href: "/tjenester/fakturering",
        title: "Fakturering og oppfølging",
        desc: "Vi sender ut fakturaene dine, følger opp de som ikke betaler, og sørger for at pengene faktisk kommer inn på konto. Du slipper å mase på kundene dine.",
        sub: [
          "Utgående fakturering",
          "Automatiske purringer",
          "Aldersfordeling og oppfølging",
          "Integrasjon med regnskapssystem",
          "Kredittvurdering av nye kunder",
          "Rapportering på utestående",
        ],
      },
      {
        icon: TrendingUp,
        href: "/tjenester/skatteplanlegging",
        title: "Skatterådgivning",
        desc: "Vi hjelper deg å betale riktig skatt — ikke for mye, ikke for lite. Vi ser på helheten gjennom hele året, ikke bare når skattemeldingen skal inn.",
        sub: [
          "Lønn vs. utbytte-vurdering",
          "Fradragsoptimalisering",
          "Selskapsstrukturering",
          "Planlegging av utbyttepolitikk",
          "Generasjonsskifte og eierbytte",
          "Løpende skatterådgivning",
        ],
      },
      {
        icon: BarChart3,
        href: "/tjenester/1-1-regnskap",
        title: "Personlig regnskapsgjennomgang",
        desc: "Book et møte med en rådgiver som går gjennom tallene dine sammen med deg. Du får konkrete tips og en plan for hva du bør gjøre videre.",
        sub: [
          "Gjennomgang av resultat, balanse og nøkkeltall",
          "En hel time dedikert til din bedrift",
          "Konkrete anbefalinger og handlingsplan",
          "Second opinion på regnskapet",
          "Gjennomgang av årsoppgjør og skattemelding",
          "Strategisk økonomisk rådgivning",
        ],
      },
    ],
  },
  {
    id: "hr",
    label: "HR & Personal",
    tag: "Menneskene i selskapet",
    tagColor: "text-accent-foreground",
    accent: "245 200 122",
    headline: "Alt du trenger for å ta godt vare på de ansatte.",
    intro:
      "Fra å finne riktig person til å sørge for at alt er på stell med kontrakter, lønn og arbeidsmiljø. Vi tar oss av papirarbeidet og reglene — du tar deg av menneskene.",
    services: [
      {
        icon: Users,
        href: "/tjenester/hr-og-lonn",
        title: "Praktisk HR-bistand",
        desc: "Vi hjelper deg med å etablere gode HR-rutiner og trygg lederstøtte i det daglige — tilpasset små og mellomstore bedrifter.",
        sub: [
          "Kartlegging av dagens HR-rutiner",
          "Arbeidsavtaler og personalhåndbok",
          "Rutiner for ferie og sykefravær",
          "Onboarding og offboarding",
          "Sparring i personalsaker",
          "Oppdatering av rutiner og dokumenter",
        ],
      },
      {
        icon: UserPlus,
        href: "/tjenester/hr-og-lonn",
        title: "Ansettelse og rekruttering",
        desc: "Vi bistår med utforming av arbeidskontrakt og tekst til stillingsannonse, slik at du får et ryddig grunnlag når du skal ansette.",
        sub: [
          "Utforming av stillingsannonse",
          "Utforming av arbeidskontrakt",
        ],
      },
      {
        icon: FileText,
        href: "/tjenester/hr-og-lonn",
        title: "Personalhåndbok og rutiner",
        desc: "Vi setter opp en enkel og tydelig personalhåndbok med de rutinene bedriften trenger — uten unødvendig byråkrati.",
        sub: [
          "Tilpasset personalhåndbok",
          "Rutiner for ferie og fravær",
          "Rutiner for onboarding og offboarding",
          "Ansvarsfordeling leder og HR",
          "Løpende oppdatering av innhold",
        ],
      },
      {
        icon: Scale,
        href: "/tjenester/hr-og-lonn",
        title: "Lederstøtte og veiledning",
        desc: "En trygg medspiller når du står i personalsaker og trenger sparring, veiledning eller hjelp med dokumentasjon.",
        sub: [
          "Sparring rundt personalsaker",
          "Veiledning om ferie og feriepenger",
          "Veiledning om overtid og permisjoner",
          "Veiledning ved sykefravær",
          "Hjelp med dokumentasjon",
        ],
      },
    ],
  },
];

const Tjenester = () => {
  const { section, isInSection } = useSection();

  // Hide marketing & IT categories globally; filter further by section when active
  const HIDDEN_CATEGORY_IDS = ["marked", "it"];
  const visibleCategories = (() => {
    const base = categories.filter((cat) => !HIDDEN_CATEGORY_IDS.includes(cat.id));
    if (!isInSection || !section) return base;
    const allowedIds = sectionCategoryIds[section.id];
    return base.filter((cat) => allowedIds.includes(cat.id));
  })();

  const copy = isInSection && section ? sectionPageCopy[section.id].tjenester : null;
  const sectionPath = isInSection && section ? section.basePath : "";

  return (
    <>
      <Helmet>
        <title>{copy ? `Tjenester — ${section!.name} | Avargo` : "Tjenester | Regnskap, CFO-rådgivning & HR — Avargo"}</title>
        <meta name="description" content={copy?.sub || "Utforsk Avargos tjenester: dedikert regnskapsfører, CFO-rådgivning og HR for norske bedrifter. En økonomisk støttespiller som lar deg fokusere på det du kan best."} />
        <link rel="canonical" href={`https://avargo.no${sectionPath}/tjenester`} />
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
            <p className="text-[10px] tracking-[0.45em] uppercase text-secondary mb-6 md:mb-8">
              {copy?.tag || "Avargo · Tjenester"}
            </p>
            <h1 className="font-heading text-5xl sm:text-6xl md:text-8xl leading-[1.02] mb-8 md:mb-10">
              {copy?.headline || <>En pålitelig rådgiver{" "}<span className="italic text-gradient-rose">ved din side.</span></>}
            </h1>
            <p className="text-base md:text-xl text-muted-foreground font-light leading-relaxed max-w-2xl mb-5 md:mb-6">
              {copy?.sub || "Regnskap, CFO-rådgivning og HR — levert av ett dedikert team som investerer seg i bedriften din. Du fokuserer på det du kan best. Vi sørger for at resten er i orden."}
            </p>
            <p className="text-sm text-primary/80 italic font-light mb-10 md:mb-14">
              {copy?.cta || "Strukturen som gjør vekst mulig."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to={`${sectionPath}/kontakt`}
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 md:px-10 py-4 bg-primary text-primary-foreground text-sm font-medium tracking-wider rounded-full glow-rose hover:scale-[1.02] transition-all duration-500"
              >
                Få et uforpliktende tilbud
                <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
              </Link>
              <Link
                to={`${sectionPath}/priser`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 md:px-10 py-4 text-sm text-foreground/70 tracking-wider rounded-full border border-border/30 hover:border-primary/20 hover:text-foreground transition-all duration-500"
              >
                Se priser
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick nav anchors */}
      <div className="sticky top-[64px] md:top-[72px] z-40 bg-background/80 backdrop-blur-xl border-b border-border/10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
            {visibleCategories.map((cat) => (
              <a
                key={cat.id}
                href={`#${cat.id}`}
                className="shrink-0 px-4 py-1.5 text-[11px] tracking-widest uppercase rounded-full transition-all duration-300 border"
                style={{ color: `rgb(${cat.accent})`, borderColor: `rgb(${cat.accent} / 0.25)` }}
              >
                {cat.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Service categories */}
      {visibleCategories.map((cat, catIdx) => (
        <section
          key={cat.id}
          id={cat.id}
          className={`py-24 md:py-40 relative ${catIdx % 2 !== 0 ? "border-y border-border/10" : ""}`}
        >
          {catIdx % 2 !== 0 && <div className="absolute inset-0 ambient-glow opacity-15" />}
          <div className="container mx-auto px-4 md:px-6 relative">
            <AnimatedSection>
              <div className="mb-14 md:mb-20">
                {/* Big colored category banner */}
                <div
                  className="flex items-center gap-5 md:gap-7 mb-8 md:mb-10 pb-6 md:pb-8 border-b"
                  style={{ borderColor: `rgb(${cat.accent} / 0.25)` }}
                >
                  <div
                    className="h-12 md:h-16 w-1.5 rounded-full"
                    style={{ background: `rgb(${cat.accent})`, boxShadow: `0 0 24px rgb(${cat.accent} / 0.6)` }}
                  />
                  <div className="flex-1">
                    <p
                      className="text-[10px] md:text-[11px] tracking-[0.4em] uppercase mb-2 md:mb-3"
                      style={{ color: `rgb(${cat.accent})` }}
                    >
                      {cat.tag}
                    </p>
                    <h2
                      className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05]"
                      style={{ color: `rgb(${cat.accent})` }}
                    >
                      {cat.label}
                    </h2>
                  </div>
                </div>
                <div className="max-w-2xl">
                  <h3 className="font-heading text-2xl sm:text-3xl md:text-4xl mb-4 md:mb-5 leading-snug text-foreground">
                    {cat.headline}
                  </h3>
                  <p className="text-muted-foreground font-light leading-relaxed text-sm md:text-base">
                    {cat.intro}
                  </p>
                </div>
              </div>
            </AnimatedSection>

            <div className={`grid grid-cols-1 ${cat.services.length === 1 ? "md:grid-cols-1 max-w-3xl" : "md:grid-cols-2"} gap-6 md:gap-8`}>
              {cat.services.map((service, i) => (
                 <AnimatedSection key={service.title} delay={i * 0.1}>
                  <Link
                    to={service.href}
                    className="relative block p-8 md:p-10 rounded-3xl h-full flex flex-col group border transition-all duration-500"
                    style={{
                      borderColor: `rgb(${cat.accent} / 0.18)`,
                      backgroundImage: `radial-gradient(circle at top left, rgb(${cat.accent} / 0.22), rgb(${cat.accent} / 0.04) 45%, transparent 75%)`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = `rgb(${cat.accent} / 0.4)`;
                      e.currentTarget.style.backgroundImage = `radial-gradient(circle at center, rgb(${cat.accent} / 0.35) 0%, rgb(${cat.accent} / 0.18) 55%, rgb(${cat.accent} / 0.06) 100%)`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = `rgb(${cat.accent} / 0.18)`;
                      e.currentTarget.style.backgroundImage = `radial-gradient(circle at top left, rgb(${cat.accent} / 0.22), rgb(${cat.accent} / 0.04) 45%, transparent 75%)`;
                    }}
                  >
                    <div
                      className="w-11 h-11 md:w-12 md:h-12 rounded-2xl border flex items-center justify-center mb-5 md:mb-6 transition-all duration-500"
                      style={{
                        backgroundColor: `rgb(${cat.accent} / 0.22)`,
                        borderColor: `rgb(${cat.accent} / 0.4)`,
                      }}
                    >
                     <service.icon size={18} style={{ color: `rgb(${cat.accent})` }} strokeWidth={1.5} />
                    </div>
                    <h3 className="font-heading text-xl md:text-2xl mb-3 md:mb-4">{service.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed font-light mb-6 md:mb-8">
                      {service.desc}
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-2.5 mb-6 md:mb-8 flex-1">
                      {service.sub.map((s) => (
                        <li key={s} className="flex items-start gap-2.5 text-[13px] text-foreground/80 font-light leading-snug">
                          <div className="w-1 h-1 rounded-full shrink-0 mt-[7px]" style={{ backgroundColor: `rgb(${cat.accent} / 0.7)` }} />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto flex items-center gap-2 text-[11px] tracking-widest uppercase transition-colors duration-300" style={{ color: `rgb(${cat.accent} / 0.9)` }}>
                      Les mer <ChevronRight size={11} className="group-hover:translate-x-0.5 transition-transform duration-300" />

                    </div>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="py-24 md:py-40 text-center relative">
        <div className="absolute inset-0 ambient-glow opacity-25" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <AnimatedSection>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-6xl mb-5 md:mb-6 leading-snug max-w-3xl mx-auto">
              Klar for å komme i gang?
            </h2>
            <p className="text-muted-foreground font-light mb-10 md:mb-14 max-w-lg mx-auto text-sm md:text-base">
              Én samtale er nok. Vi forteller deg hva som passer for din bedrift — helt uforpliktende.
            </p>
            <Link
              to={`${sectionPath}/kontakt`}
              className="group inline-flex items-center gap-3 px-10 md:px-12 py-4 md:py-5 bg-primary text-primary-foreground text-sm font-medium tracking-wider rounded-full glow-rose hover:scale-[1.02] transition-all duration-500"
            >
              Book en samtale
              <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
};

export default Tjenester;
