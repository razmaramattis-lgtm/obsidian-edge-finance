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
  LayoutTemplate,
  Briefcase,
  ChevronRight,
  UserPlus,
  FileText,
  Scale,
  Code,
  Monitor,
  Cpu,
  Lightbulb,
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
    headline: "Vi tar oss av tallene. Du tar deg av bedriften.",
    intro:
      "Godt regnskap handler ikke bare om å følge regler — det handler om å vite hvordan bedriften din faktisk gjør det. Vi gir deg en egen regnskapsfører som kjenner deg og bedriften din, og som sørger for at alt er i orden — hele året.",
    services: [
      {
        icon: BookOpen,
        href: "/tjenester/regnskapsforer",
        title: "Din egen regnskapsfører",
        desc: "Du får én fast person som tar seg av regnskapet ditt. Ingen køer, ingen nye ansikter hver gang. En person som kjenner bedriften din og følger opp uten at du trenger å be om det.",
        sub: ["Bokføring og moms", "Kvitteringer og bilag", "Aksjonæroppgaver", "Hjelp ved revisjon"],
      },
      {
        icon: Receipt,
        href: "/tjenester/lonn",
        title: "Lønnskjøring",
        desc: "Vi sørger for at de ansatte får lønnen sin til rett tid, hver eneste måned. Feriepenger, sykepenger og alt som skal rapporteres til det offentlige — vi tar det.",
        sub: ["Lønn og innrapportering", "Feriepenger og sykepenger", "Reiseregninger og utlegg", "Rapportering til NAV og Skatteetaten"],
      },
      {
        icon: PieChart,
        href: "/tjenester/arsregnskap",
        title: "Årsoppgjør og skattemelding",
        desc: "Vi gjør ferdig årsregnskapet og skattemeldingen for deg — uten stress. Alt leveres innen fristen, slik at du slipper å tenke på det.",
        sub: ["Ferdig årsregnskap", "Skattemelding for selskapet", "Skattemelding for deg som eier", "All dokumentasjon på plass"],
      },
      {
        icon: Briefcase,
        href: "/tjenester/cfo",
        title: "Økonomisk rådgiver",
        desc: "En erfaren rådgiver som hjelper deg med de store beslutningene — budsjett, vekstplaner, investorer og hva du bør gjøre videre. Uten at du trenger å ansette noen på heltid.",
        sub: ["Hjelp med budsjett og planer", "Snakke med investorer og styret", "Finne ut hva som lønner seg", "Planlegge salg eller sammenslåing"],
      },
      {
        icon: Receipt,
        href: "/tjenester/fakturering",
        title: "Fakturering og oppfølging",
        desc: "Vi sender ut fakturaene dine, følger opp de som ikke betaler, og sørger for at pengene faktisk kommer inn på konto. Du slipper å mase på kundene dine.",
        sub: ["Sending av fakturaer", "Purringer og påminnelser", "Oversikt over hva som er utestående", "Kobling mot regnskapet"],
      },
      {
        icon: TrendingUp,
        href: "/tjenester/skatteplanlegging",
        title: "Skatterådgivning",
        desc: "Vi hjelper deg å betale riktig skatt — ikke for mye, ikke for lite. Vi ser på helheten gjennom hele året, ikke bare når skattemeldingen skal inn.",
        sub: ["Lønn eller utbytte — hva lønner seg?", "Finne fradrag du har krav på", "Strukturere selskapet smart", "Planlegge formue og verdier"],
      },
      {
        icon: BarChart3,
        href: "/tjenester/1-1-regnskap",
        title: "Personlig regnskapsgjennomgang",
        desc: "Book et møte med en rådgiver som går gjennom tallene dine sammen med deg. Du får konkrete tips og en plan for hva du bør gjøre videre.",
        sub: ["Gjennomgang av regnskapet", "Se hva du tjener og hva du bruker", "Tips for å betale mindre skatt", "Plan for neste steg"],
      },
      {
        icon: Monitor,
        href: "/tjenester/dashboard",
        title: "Avargo Dashboard",
        desc: "Et kommende verktøy på Avargo.no der du kan se økonomien din, laste ned rapporter og snakke direkte med regnskapsføreren — alt på ett sted. Kommer august 2026.",
        sub: ["Se økonomien i sanntid", "Rapporter og nøkkeltall", "Snakke direkte med rådgiveren din", "Dele og signere dokumenter"],
      },
    ],
  },
  {
    id: "hr",
    label: "HR & Personal",
    tag: "Menneskene i selskapet",
    tagColor: "text-secondary",
    headline: "Alt du trenger for å ta godt vare på de ansatte.",
    intro:
      "Fra å finne riktig person til å sørge for at alt er på stell med kontrakter, lønn og arbeidsmiljø. Vi tar oss av papirarbeidet og reglene — du tar deg av menneskene.",
    services: [
      {
        icon: Users,
        href: "/tjenester/hr-og-lonn",
        title: "Lønn og personalarbeid",
        desc: "Vi kjører lønn, holder styr på feriepenger og sykepenger, og rapporterer til det offentlige. Alt stemmer — hver eneste måned.",
        sub: ["Lønnskjøring og innrapportering", "Feriepenger og sykepenger", "Reiseregninger og utlegg", "Rapportering til NAV og Skatteetaten"],
      },
      {
        icon: UserPlus,
        href: "/tjenester/ansettelse",
        title: "Ansettelse og rekruttering",
        desc: "Vi hjelper deg med hele prosessen — fra å skrive stillingsannonsen til å lage kontrakt og gi den nye ansatte en god start. Så du finner riktig person uten å bruke unødvendig tid.",
        sub: ["Stillingsannonse og utvelgelse", "Arbeidskontrakt og vilkår", "God oppstart for nye ansatte", "Oppfølging i prøvetiden"],
      },
      {
        icon: FileText,
        href: "/tjenester/personalhandbok",
        title: "Personalhåndbok og regler",
        desc: "Vi lager en komplett håndbok med regler og retningslinjer for bedriften din — alt fra ferie til varsling. Så alle vet hva som gjelder.",
        sub: ["Tilpasset personalhåndbok", "Regler for arbeidsplassen", "Rutiner for varsling", "Permisjoner og fravær"],
      },
      {
        icon: Scale,
        href: "/tjenester/arbeidsrett",
        title: "Arbeidsrett og arbeidsmiljø",
        desc: "Som arbeidsgiver har du en del krav du må oppfylle. Vi hjelper deg med dokumentasjon, oppfølging av sykefravær og rådgivning når det blir vanskelig.",
        sub: ["Arbeidsmiljø og sikkerhet", "Oppfølging av sykefravær", "Oppsigelser og sluttavtaler", "Rådgivning i vanskelige saker"],
      },
    ],
  },
  {
    id: "marked",
    label: "Markedsføring & Vekst",
    tag: "Avargo · Markedsføring",
    tagColor: "text-primary",
    headline: "Bli sett. Få flere kunder. Voks.",
    intro:
      "Vi hjelper deg å bli synlig på nett, få flere henvendelser og gjøre besøkende til betalende kunder. Alt henger sammen med tallene dine — så du vet at pengene brukes smart.",
    services: [
      {
        icon: Search,
        href: "/tjenester/seo",
        title: "Bli funnet på Google",
        desc: "Vi sørger for at bedriften din dukker opp når folk søker etter det du tilbyr. Uten at du betaler for hvert klikk — det handler om å bygge synlighet over tid.",
        sub: ["Gjøre nettsiden søkevennlig", "Bli synlig lokalt på Google", "Skrive innhold folk søker etter", "Se hva konkurrentene gjør"],
      },
      {
        icon: Megaphone,
        href: "/tjenester/meta-annonser",
        title: "Annonser på Facebook og Instagram",
        desc: "Vi lager og styrer annonser som treffer de riktige menneskene — de som faktisk er interessert i det du selger. Du får flere henvendelser og mer salg.",
        sub: ["Finne riktig målgruppe", "Lage annonser som fungerer", "Vise annonser til folk som allerede har vist interesse", "Måle hva som gir best resultat"],
      },
      {
        icon: Globe,
        href: "/tjenester/google-ads",
        title: "Annonser på Google",
        desc: "Vis deg øverst på Google akkurat når noen søker etter det du tilbyr. Vi styrer budsjettet og sørger for at hver krone gir mest mulig tilbake.",
        sub: ["Søkeannonser", "Annonser som vises flere steder", "Lokale annonser", "Holde styr på budsjettet"],
      },
      {
        icon: ShoppingCart,
        href: "/tjenester/nettbutikk",
        title: "Nettbutikk",
        desc: "Vi bygger en nettbutikk som gjør det enkelt for kundene å handle hos deg. Fin å se på, enkel å bruke — og klar til å vokse med bedriften din.",
        sub: ["Shopify og WooCommerce", "Produktsider som selger", "Betaling og frakt", "Lager og ordrehåndtering"],
      },
    ],
  },
  {
    id: "it",
    label: "IT & Utvikling",
    tag: "Avargo · Teknologi",
    tagColor: "text-secondary",
    headline: "Teknologi som gjør hverdagen enklere.",
    intro:
      "Vi bygger nettsider, smarte verktøy og løsninger som sparer deg for tid. Enten du trenger en ny nettside, en chatbot som svarer kundene dine, eller et eget system for bedriften.",
    services: [
      {
        icon: Monitor,
        href: "/tjenester/nettsider",
        title: "Nettsider",
        desc: "Moderne nettsider som ser bra ut, laster raskt og gjør det enkelt for kundene dine å ta kontakt eller kjøpe. Vi bygger nettsider som faktisk gir resultater.",
        sub: ["Ny nettside fra bunnen av", "Oppgradering av gammel nettside", "Sider som gir flere kunder", "Fungerer perfekt på mobil"],
      },
      {
        icon: Bot,
        href: "/tjenester/chatbot",
        title: "Chatbot for kundeservice",
        desc: "En smart chatbot som svarer kundene dine hele døgnet. Den tar seg av de vanlige spørsmålene, slik at du og teamet ditt slipper — uten at kvaliteten lider.",
        sub: ["Chatbot tilpasset din bedrift", "Følger opp interesserte kunder", "Kobles til e-post og andre verktøy", "Kundene finner svar selv"],
      },
      {
        icon: Code,
        href: "/tjenester/internsystemer",
        title: "Egne systemer og verktøy",
        desc: "Vi bygger verktøy som erstatter manuelle oppgaver med smarte løsninger. Enten det er et eget dashboard, et bestillingssystem eller noe helt annet.",
        sub: ["Oversiktlige dashboards", "Automatisering av oppgaver", "Koble sammen systemene dine", "Brukertilgang og sikkerhet"],
      },
      {
        icon: Cpu,
        href: "/tjenester/ai-automatisering",
        title: "Automatisering og AI",
        desc: "Vi setter opp smarte løsninger som gjør de kjedelige oppgavene for deg — automatisk. Slik at du kan bruke tiden på det som faktisk betyr noe.",
        sub: ["Automatisere oppgaver som tar tid", "Smarte systemer som tar beslutninger", "Håndtere dokumenter med AI", "Tilpassede AI-løsninger"],
      },
    ],
  },
];

const Tjenester = () => {
  const { section, isInSection } = useSection();

  // Filter categories based on active section
  const visibleCategories = (() => {
    if (!isInSection || !section) return categories;

    const allowedIds = sectionCategoryIds[section.id];

    return categories
      .filter((cat) => allowedIds.includes(cat.id));
  })();

  const copy = isInSection && section ? sectionPageCopy[section.id].tjenester : null;
  const sectionPath = isInSection && section ? section.basePath : "";

  return (
    <>
      <Helmet>
        <title>{copy ? `Tjenester — ${section!.name} | Avargo` : "Tjenester | Regnskap, rådgivning & marked — Avargo"}</title>
        <meta name="description" content={copy?.sub || "Utforsk Avargos tjenester: dedikert regnskapsfører, CFO-rådgivning, HR, SEO, Google Ads, nettsider og AI-automatisering for norske bedrifter."} />
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
              {copy?.headline || <>Alt du trenger.{" "}<span className="italic text-gradient-rose">Samlet på ett sted.</span></>}
            </h1>
            <p className="text-base md:text-xl text-muted-foreground font-light leading-relaxed max-w-2xl mb-5 md:mb-6">
              {copy?.sub || "Regnskap, CFO-rådgivning, HR og fullskala digital markedsføring — koordinert av ett team, levert under ett tak. Du fokuserer på å bygge. Vi tar resten."}
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
                className="shrink-0 px-4 py-1.5 text-[11px] tracking-widest uppercase text-muted-foreground hover:text-foreground hover:bg-muted/40 rounded-full transition-all duration-300"
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
              <div className="max-w-2xl mb-14 md:mb-20">
                <div className="flex items-center gap-3 mb-5 md:mb-6">
                  <span className={`text-[10px] tracking-[0.4em] uppercase ${cat.tagColor}`}>{cat.tag}</span>
                  <span className="text-border/40">·</span>
                  <span className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground/70">{cat.label}</span>
                </div>
                <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-5 md:mb-6 leading-snug">
                  {cat.headline}
                </h2>
                <p className="text-muted-foreground font-light leading-relaxed text-sm md:text-base">
                  {cat.intro}
                </p>
              </div>
            </AnimatedSection>

            <div className={`grid grid-cols-1 ${cat.services.length === 1 ? "md:grid-cols-1 max-w-3xl" : cat.services.length === 2 ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3"} gap-6 md:gap-8`}>
              {cat.services.map((service, i) => (
                 <AnimatedSection key={service.title} delay={i * 0.1}>
                  <Link to={service.href} className="block p-8 md:p-10 rounded-3xl h-full flex flex-col group bg-primary/15 border-2 border-primary/45 shadow-[0_26px_90px_-34px_hsl(var(--primary)/0.55),inset_0_1px_0_hsl(var(--primary)/0.18)] hover:bg-primary/20 hover:border-primary/70 hover:-translate-y-1.5 hover:shadow-[0_34px_110px_-28px_hsl(var(--primary)/0.75),0_0_0_1px_hsl(var(--primary)/0.18),inset_0_1px_0_hsl(var(--primary)/0.24)] transition-all duration-500">
                    <div className="w-11 h-11 md:w-12 md:h-12 rounded-2xl bg-primary/35 border border-primary/60 shadow-[0_0_30px_hsl(var(--primary)/0.22)] flex items-center justify-center mb-5 md:mb-6 group-hover:bg-primary/45 group-hover:scale-110 group-hover:shadow-[0_0_44px_hsl(var(--primary)/0.34)] transition-all duration-500">
                     <service.icon size={18} className="text-primary" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-heading text-xl md:text-2xl mb-3 md:mb-4">{service.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed font-light mb-6 md:mb-8 flex-1">
                      {service.desc}
                    </p>
                    <ul className="space-y-2 mb-6 md:mb-8">
                      {service.sub.map((s) => (
                        <li key={s} className="flex items-center gap-2.5 text-[13px] text-foreground/75 font-light">
                          <div className="w-1 h-1 rounded-full bg-primary/50 shrink-0" />
                          {s}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto flex items-center gap-2 text-[11px] tracking-widest uppercase text-primary/80 group-hover:text-primary transition-colors duration-300">
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
