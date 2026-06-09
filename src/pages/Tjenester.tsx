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
  Monitor,
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
    tagColor: "text-[#e8b08a]",
    accent: "232 176 138",
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
      {
        icon: Monitor,
        href: "/tjenester/dashboard",
        title: "Avargo Dashboard",
        desc: "Et kommende verktøy på Avargo.no der du kan se økonomien din, laste ned rapporter og snakke direkte med regnskapsføreren — alt på ett sted. Kommer august 2026.",
        sub: [
          "Sanntidsoversikt over økonomi",
          "Rapporter og nøkkeltall",
          "Direkte kommunikasjon med rådgiver",
          "Dokumentdeling og signering",
          "Varsler og påminnelser",
          "Sikker innlogging og tilgangsstyring",
        ],
      },
    ],
  },
  {
    id: "hr",
    label: "HR & Personal",
    tag: "Menneskene i selskapet",
    tagColor: "text-[#f5c87a]",
    accent: "245 200 122",
    headline: "Alt du trenger for å ta godt vare på de ansatte.",
    intro:
      "Fra å finne riktig person til å sørge for at alt er på stell med kontrakter, lønn og arbeidsmiljø. Vi tar oss av papirarbeidet og reglene — du tar deg av menneskene.",
    services: [
      {
        icon: Users,
        href: "/tjenester/hr-og-lonn",
        title: "Lønn og personalarbeid",
        desc: "Vi kjører lønn, holder styr på feriepenger og sykepenger, og rapporterer til det offentlige. Alt stemmer — hver eneste måned.",
        sub: [
          "Lønnskjøring og innrapportering",
          "Arbeidskontrakter og personalregler",
          "Arbeidsmiljø og sikkerhetsdokumentasjon",
          "Oppfølging av sykefravær",
          "Personalhåndbok og retningslinjer",
          "Rådgivning i personalsaker",
        ],
      },
      {
        icon: UserPlus,
        href: "/tjenester/ansettelse",
        title: "Ansettelse og rekruttering",
        desc: "Vi hjelper deg med hele prosessen — fra å skrive stillingsannonsen til å lage kontrakt og gi den nye ansatte en god start. Så du finner riktig person uten å bruke unødvendig tid.",
        sub: [
          "Stillingsutlysning og kravspesifikasjon",
          "Screening og utvelgelse",
          "Arbeidskontrakter og betingelser",
          "Strukturert onboarding",
          "Prøvetidsoppfølging",
          "Lønnsforhandling og rådgivning",
        ],
      },
      {
        icon: FileText,
        href: "/tjenester/personalhandbok",
        title: "Personalhåndbok og regler",
        desc: "Vi lager en komplett håndbok med regler og retningslinjer for bedriften din — alt fra ferie til varsling. Så alle vet hva som gjelder.",
        sub: [
          "Tilpasset personalhåndbok",
          "Arbeidsreglement",
          "Varslingsrutiner",
          "Permisjonsregler og fravær",
          "IT- og sikkerhetspolicy",
          "Løpende oppdatering ved lovendringer",
        ],
      },
      {
        icon: Scale,
        href: "/tjenester/arbeidsrett",
        title: "Arbeidsrett og arbeidsmiljø",
        desc: "Som arbeidsgiver har du en del krav du må oppfylle. Vi hjelper deg med dokumentasjon, oppfølging av sykefravær og rådgivning når det blir vanskelig.",
        sub: [
          "HMS-dokumentasjon og internkontroll",
          "Risikovurdering av arbeidsmiljø",
          "Oppfølging av sykefravær",
          "Sluttavtaler og oppsigelser",
          "Varslingshåndtering",
          "Arbeidstidsordninger og unntak",
        ],
      },
    ],
  },
  {
    id: "marked",
    label: "Markedsføring & Vekst",
    tag: "Avargo · Markedsføring",
    tagColor: "text-[#c4a3f0]",
    accent: "196 163 240",
    headline: "Bli sett. Få flere kunder. Voks.",
    intro:
      "Vi hjelper deg å bli synlig på nett, få flere henvendelser og gjøre besøkende til betalende kunder. Alt henger sammen med tallene dine — så du vet at pengene brukes smart.",
    services: [
      {
        icon: Search,
        href: "/tjenester/seo",
        title: "Bli funnet på Google",
        desc: "Vi sørger for at bedriften din dukker opp når folk søker etter det du tilbyr. Uten at du betaler for hvert klikk — det handler om å bygge synlighet over tid.",
        sub: [
          "Teknisk søkemotoroptimalisering",
          "Søkeordanalyse for din bransje",
          "Innholdsproduksjon og -forbedring",
          "Lokal synlighet på Google",
          "Lenkebygging og troverdighet",
          "Månedlig rapport med resultater",
        ],
      },
      {
        icon: Megaphone,
        href: "/tjenester/meta-annonser",
        title: "Annonser på Facebook og Instagram",
        desc: "Vi lager og styrer annonser som treffer de riktige menneskene — de som faktisk er interessert i det du selger. Du får flere henvendelser og mer salg.",
        sub: [
          "Målgruppedefinisjon og segmentering",
          "Annonser med bilder, video eller karuseller",
          "A/B-testing av annonser",
          "Remarketing mot varme leads",
          "Oppsett av konverteringssporing",
          "Månedlig rapport med resultater",
        ],
      },
      {
        icon: Globe,
        href: "/tjenester/google-ads",
        title: "Annonser på Google",
        desc: "Vis deg øverst på Google akkurat når noen søker etter det du tilbyr. Vi styrer budsjettet og sørger for at hver krone gir mest mulig tilbake.",
        sub: [
          "Søkeannonser på Google",
          "Displayannonser på nettsider og apper",
          "Lokale annonser på Google Maps",
          "Søkeordanalyse og budstrategi",
          "Måling av faktiske resultater",
          "Månedlig rapport med anbefalinger",
        ],
      },
      {
        icon: ShoppingCart,
        href: "/tjenester/nettbutikk",
        title: "Nettbutikk",
        desc: "Vi bygger en nettbutikk som gjør det enkelt for kundene å handle hos deg. Fin å se på, enkel å bruke — og klar til å vokse med bedriften din.",
        sub: [
          "Nettbutikk med Shopify eller WooCommerce",
          "Produktsider tilpasset salg",
          "Enkel og trygg betalingsløsning",
          "Kobling mot lager og regnskapssystem",
          "Mobilvennlig design",
          "Automatiske e-poster ved avbrutte kjøp",
        ],
      },
    ],
  },
  {
    id: "it",
    label: "IT & Utvikling",
    tag: "Avargo · Teknologi",
    tagColor: "text-[#7dd3fc]",
    accent: "125 211 252",
    headline: "Teknologi som gjør hverdagen enklere.",
    intro:
      "Vi bygger nettsider, smarte verktøy og løsninger som sparer deg for tid. Enten du trenger en ny nettside, en chatbot som svarer kundene dine, eller et eget system for bedriften.",
    services: [
      {
        icon: Monitor,
        href: "/tjenester/nettsider",
        title: "Nettsider",
        desc: "Moderne nettsider som ser bra ut, laster raskt og gjør det enkelt for kundene dine å ta kontakt eller kjøpe. Vi bygger nettsider som faktisk gir resultater.",
        sub: [
          "Ny nettside fra bunnen av",
          "Fungerer på mobil, nettbrett og PC",
          "Sider som konverterer besøkende",
          "Enkelt å oppdatere innhold selv",
          "Bygget for å bli funnet på Google",
          "Løpende vedlikehold inkludert",
        ],
      },
      {
        icon: Bot,
        href: "/tjenester/chatbot",
        title: "Chatbot for kundeservice",
        desc: "En smart chatbot som svarer kundene dine hele døgnet. Den tar seg av de vanlige spørsmålene, slik at du og teamet ditt slipper — uten at kvaliteten lider.",
        sub: [
          "Skreddersydd AI-chatbot",
          "Trent på din bedrifts egne data",
          "Automatisk leadoppfølging",
          "Integrasjon med CRM og e-post",
          "Flerspråklig støtte",
          "Rapportering og løpende optimalisering",
        ],
      },
      {
        icon: Code,
        href: "/tjenester/internsystemer",
        title: "Egne systemer og verktøy",
        desc: "Vi bygger verktøy som erstatter manuelle oppgaver med smarte løsninger. Enten det er et eget dashboard, et bestillingssystem eller noe helt annet.",
        sub: [
          "Dashboards og rapporteringsverktøy",
          "Prosessautomatisering",
          "API-integrasjoner og dataflyt",
          "CRM og kundehåndtering",
          "Dokumenthåndtering",
          "Løpende vedlikehold og support",
        ],
      },
      {
        icon: Cpu,
        href: "/tjenester/ai-automatisering",
        title: "Automatisering og AI",
        desc: "Vi setter opp smarte løsninger som gjør de kjedelige oppgavene for deg — automatisk. Slik at du kan bruke tiden på det som faktisk betyr noe.",
        sub: [
          "Arbeidsflyter som kjører av seg selv",
          "Kobling mellom regnskap, nettbutikk og e-post",
          "Automatisk oppfølging av leads",
          "Rapporter som lages automatisk",
          "Dokumentsortering og godkjenning",
          "Egne AI-løsninger tilpasset bedriften",
        ],
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

            <div className={`grid grid-cols-1 ${cat.services.length === 1 ? "md:grid-cols-1 max-w-3xl" : "md:grid-cols-2"} gap-6 md:gap-8`}>
              {cat.services.map((service, i) => (
                 <AnimatedSection key={service.title} delay={i * 0.1}>
                  <Link
                    to={service.href}
                    className="relative block p-8 md:p-10 rounded-3xl h-full flex flex-col group border border-primary/15 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.22),hsl(var(--primary)/0.04)_45%,transparent_75%)] shadow-[0_20px_70px_-40px_hsl(var(--primary)/0.45),inset_0_1px_0_hsl(var(--primary)/0.08)] hover:border-primary/35 hover:bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.38),hsl(var(--primary)/0.14)_60%,hsl(var(--primary)/0.05)_100%)] hover:-translate-y-1.5 hover:shadow-[0_34px_110px_-28px_hsl(var(--primary)/0.7),inset_0_1px_0_hsl(var(--primary)/0.2)] transition-all duration-500"
                  >
                    <div className="w-11 h-11 md:w-12 md:h-12 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center mb-5 md:mb-6 group-hover:bg-primary/35 group-hover:border-primary/55 group-hover:scale-110 group-hover:shadow-[0_0_44px_hsl(var(--primary)/0.34)] transition-all duration-500">
                     <service.icon size={18} className="text-primary" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-heading text-xl md:text-2xl mb-3 md:mb-4">{service.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed font-light mb-6 md:mb-8">
                      {service.desc}
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-2.5 mb-6 md:mb-8 flex-1">
                      {service.sub.map((s) => (
                        <li key={s} className="flex items-start gap-2.5 text-[13px] text-foreground/80 font-light leading-snug">
                          <div className="w-1 h-1 rounded-full bg-primary/60 shrink-0 mt-[7px]" />
                          <span>{s}</span>
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
