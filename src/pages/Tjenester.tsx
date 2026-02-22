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

const categories = [
  {
    id: "regnskap",
    label: "Regnskap & Økonomi",
    tag: "Kjerneleveranse",
    tagColor: "text-primary",
    headline: "Dedikert regnskapsfører. Komplett økonomisk ryggrad.",
    intro:
      "Et velsmurt regnskap er ikke et kostnadssenter — det er et strategisk fundament. Vi kombinerer autoriserte regnskapsførere med sanntids AI-analyse, slik at du alltid vet nøyaktig hvor selskapet ditt står og hvilken retning det beveger seg i.",
    services: [
      {
        icon: BookOpen,
        href: "/tjenester/regnskapsforer",
        title: "Dedikert regnskapsfører",
        desc: "Du får én navngitt regnskapsfører som kjenner selskapet ditt ut og inn. Ingen saksbehandlere. Ingen ventelinjer. Et menneske som proaktivt følger opp og stiller de riktige spørsmålene.",
        sub: ["Løpende bokføring & MVA", "Årsregnskap & skattemelding", "Aksjonærregisteroppgave", "Revisjonstøtte & dokumentasjon"],
      },
      {
        icon: Briefcase,
        href: "/tjenester/cfo",
        title: "CFO-as-a-Service",
        desc: "En erfaren finansiell leder som deltar i strategimøter, investordialog og styrearbeid. Vi hjelper deg å navigere vekst, exit, fusjon eller refinansiering med presisjon.",
        sub: ["Kapitalstruktur & finansieringsstrategi", "Investor- og styrekommunikasjon", "Budsjettering & scenarioanalyse", "Exit- og fusjonsplanlegging"],
      },
      {
        icon: Receipt,
        href: "/tjenester/kurs",
        title: "Regnskapskurs",
        desc: "Praktiske kurs i bokføring, MVA, skattemelding og årsregnskap — levert av autoriserte regnskapsførere. Fra grunnkurs til skreddersydde bedriftspakker.",
        sub: ["Bokføring & bilagshåndtering", "MVA-loven i praksis", "Skattemelding & årsregnskap", "System & internkontroll"],
      },
      {
        icon: PieChart,
        href: "/tjenester/1-1-regnskap",
        title: "1-1 Regnskap",
        desc: "Book en personlig gjennomgang av regnskapet med en statsautorisert rådgiver. Skreddersydd innsikt, konkrete anbefalinger og handlingsplan for din bedrift.",
        sub: ["Personlig regnskapsgjennomgang", "Resultat- og balanseanalyse", "Skatteoptimalisering", "Handlingsplan & neste steg"],
      },
      {
        icon: BarChart3,
        href: "/tjenester/ai-innsikt",
        title: "AI-drevet økonomisk innsikt",
        desc: "Sanntidsanalyse av regnskapet ditt med AI som oppdager trender, avvik og muligheter — slik at du alltid ligger et steg foran.",
        sub: ["Automatiske rapporter & varsler", "Avviks- og trendanalyse", "Cashflow-prognoser", "Benchmarking mot bransjen"],
      },
    ],
  },
  {
    id: "hr",
    label: "HR & Personal",
    tag: "Menneskene i selskapet",
    tagColor: "text-secondary",
    headline: "Alt du trenger for å være en god arbeidsgiver.",
    intro:
      "Fra å ansette riktig person til å bygge en arbeidsplass folk ønsker å bli værende i. Vi tar ansvaret for prosessene, dokumentasjonen og regelverket — slik at du kan fokusere på menneskene.",
    services: [
      {
        icon: Users,
        href: "/tjenester/hr-og-lonn",
        title: "Lønn & HR-administrasjon",
        desc: "Presis lønnskjøring, feriepenger, sykepenger og rapportering til myndighetene. Vi sørger for at alt stemmer — hver eneste måned.",
        sub: ["Lønnskjøring & A-melding", "Feriepenger & sykepengeregler", "Reiseregninger & utlegg", "Rapportering til NAV & Skatteetaten"],
      },
      {
        icon: UserPlus,
        href: "/tjenester/hr-og-lonn",
        title: "Ansettelse & rekruttering",
        desc: "Vi hjelper deg med hele prosessen — fra utlysning og utvelgelse til arbeidskontrakt og onboarding. Slik at du finner riktig person uten å bruke mer tid enn nødvendig.",
        sub: ["Stillingsutlysning & utvelgelse", "Arbeidskontrakter & betingelser", "Strukturert onboarding", "Prøvetidsoppfølging"],
      },
      {
        icon: FileText,
        href: "/tjenester/hr-og-lonn",
        title: "Personalhåndbok & reglementer",
        desc: "En komplett og oppdatert personalhåndbok som dekker alt fra arbeidsreglement til feriepolitikk. Vi sørger for at din bedrift har dokumentasjonen på plass.",
        sub: ["Tilpasset personalhåndbok", "Arbeidsreglement", "Varslingrutiner & etiske retningslinjer", "Permisjoner & fravær"],
      },
      {
        icon: Scale,
        href: "/tjenester/hr-og-lonn",
        title: "Arbeidsrett & HMS",
        desc: "Arbeidsmiljøloven stiller krav. Vi sørger for at du oppfyller dem — fra HMS-dokumentasjon og internkontroll til rådgivning i vanskelige personalsaker.",
        sub: ["HMS & internkontroll", "Oppfølging av sykefravær", "Sluttavtaler & oppsigelser", "Rådgivning i personalsaker"],
      },
    ],
  },
  {
    id: "marked",
    label: "Markedsføring & Vekst",
    tag: "Avargo · Markedsføring",
    tagColor: "text-primary",
    headline: "Synlighet. Trafikk. Konvertering.",
    intro:
      "Full-spektrum digital markedsføring som kobler din finansielle strategi direkte til vekstmålene. Ikke kampanjer i vakuum — men markedsføring forankret i tallene.",
    services: [
      {
        icon: Search,
        href: "/tjenester/seo",
        title: "SEO & søkbarhet",
        desc: "Strategisk søkemotoroptimalisering som bygger langsiktig organisk synlighet. Vi kombinerer teknisk SEO, innholdsstrategi og lokal tilstedeværelse.",
        sub: ["Teknisk SEO & sidestruktur", "Google Min Bedrift-optimalisering", "AI-assistert innholdsproduksjon", "Konkurrentanalyse & søkeordstrategi"],
      },
      {
        icon: Megaphone,
        href: "/tjenester/meta-annonser",
        title: "Meta-annonser (Facebook & Instagram)",
        desc: "Presisjonsrettede kampanjer som genererer kvalifiserte leads og salg. Vi styrer budsjett, målgrupper og kreativt innhold basert på data.",
        sub: ["Kampanjestrategi & målgruppebygging", "Annonseproduksjon & A/B-testing", "Retargeting & lookalike-målgrupper", "Konverteringssporing & ROAS-optimalisering"],
      },
      {
        icon: Globe,
        href: "/tjenester/google-ads",
        title: "Google Ads & søkeannonsering",
        desc: "Møt kunden i kjøpsøyeblikket med presisjonsstyrt søkeannonsering. Vi optimaliserer kontinuerlig for at hver krone gir maksimal avkastning.",
        sub: ["Søke- og displaykampanjer", "Performance Max", "Lokal annonsering", "Budsjettoptimalisering & rapportering"],
      },
      {
        icon: ShoppingCart,
        href: "/tjenester/nettbutikk",
        title: "Nettbutikk & e-handel",
        desc: "En nettbutikk som konverterer besøkende til kunder. Vi designer, bygger og optimaliserer e-handelssystemer som er klare til å skalere.",
        sub: ["Shopify & WooCommerce", "Produktpresentasjon & UX", "Betalingsløsninger & integrasjoner", "Lager- og ordrestyring"],
      },
    ],
  },
  {
    id: "it",
    label: "IT & Utvikling",
    tag: "Avargo · Teknologi",
    tagColor: "text-secondary",
    headline: "Teknologi som jobber for deg — ikke mot deg.",
    intro:
      "Skreddersydde digitale løsninger som forenkler hverdagen, effektiviserer prosesser og gir deg et forsprang. Fra nettsider til interne systemer og AI-drevne verktøy.",
    services: [
      {
        icon: Monitor,
        href: "/tjenester/nettsider",
        title: "Skreddersydde nettsider",
        desc: "Moderne, konverteringsoptimaliserte nettsider som kommuniserer merkevaren din presist og gjør det enkelt for kundene å ta neste steg. Bygget for hastighet og resultat.",
        sub: ["Framer & custom nettside", "Nettside-redesign & modernisering", "Landingssider & konverteringsoptimalisering", "Responsivt & mobiltilpasset design"],
      },
      {
        icon: Bot,
        href: "/tjenester/ai-automatisering",
        title: "AI-chatbot & kundeservice",
        desc: "Intelligente chatboter som svarer kundene dine døgnet rundt, kvalifiserer leads og avlaster teamet ditt — uten at kvaliteten lider.",
        sub: ["Skreddersydd AI-chatbot", "Automatisk leadoppfølging", "Integrasjon med CRM & e-post", "Kunnskapsbase & selvbetjening"],
      },
      {
        icon: Code,
        href: "/tjenester/ai-automatisering",
        title: "Interne systemer & integrasjoner",
        desc: "Skreddersydde internsystemer som erstatter manuelle prosesser med smarte løsninger. Vi bygger det du trenger — ingenting mer, ingenting mindre.",
        sub: ["Dashboards & rapporteringsverktøy", "Prosessautomatisering", "API-integrasjoner & dataflyt", "Brukeradministrasjon & tilgangsstyring"],
      },
      {
        icon: Cpu,
        href: "/tjenester/ai-automatisering",
        title: "AI & automatisering",
        desc: "Intelligente arbeidsflyter som eliminerer repetitive oppgaver og skalerer kapasiteten din. Teknologi som jobber mens du sover.",
        sub: ["Prosessautomatisering & workflows", "Datadrevne beslutningssystemer", "Dokumenthåndtering med AI", "Tilpassede AI-løsninger"],
      },
    ],
  },
];

const Tjenester = () => {
  return (
    <>
      <Helmet>
        <title>Tjenester | Regnskap, rådgivning og digital markedsføring — Avargo</title>
        <meta name="description" content="Utforsk Avargos tjenester: dedikert regnskapsfører, CFO-rådgivning, HR, SEO, Google Ads, nettsider og AI-automatisering for norske bedrifter." />
        <link rel="canonical" href="https://avargo.no/tjenester" />
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
              Avargo · Tjenester
            </p>
            <h1 className="font-heading text-5xl sm:text-6xl md:text-8xl leading-[1.02] mb-8 md:mb-10">
              Alt du trenger.{" "}
              <span className="italic text-gradient-rose">Samlet på ett sted.</span>
            </h1>
            <p className="text-base md:text-xl text-muted-foreground font-light leading-relaxed max-w-2xl mb-5 md:mb-6">
              Regnskap, CFO-rådgivning, HR og fullskala digital markedsføring — koordinert av ett team, levert under ett tak. Du fokuserer på å bygge. Vi tar resten.
            </p>
            <p className="text-sm text-primary/60 italic font-light mb-10 md:mb-14">
              Strukturen som gjør vekst mulig.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/kontakt"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 md:px-10 py-4 bg-primary text-primary-foreground text-sm font-medium tracking-wider rounded-full glow-rose hover:scale-[1.02] transition-all duration-500"
              >
                Snakk med oss
                <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
              </Link>
              <Link
                to="/priser"
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
            {categories.map((cat) => (
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
      {categories.map((cat, catIdx) => (
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
                  <span className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground/40">{cat.label}</span>
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
                  <Link to={service.href} className="block p-8 md:p-10 glass rounded-3xl card-lift h-full flex flex-col group">
                    <div className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-primary/8 border border-primary/15 flex items-center justify-center mb-5 md:mb-6 group-hover:bg-primary/15 transition-colors duration-500">
                      <service.icon size={17} className="text-primary" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-heading text-xl md:text-2xl mb-3 md:mb-4">{service.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed font-light mb-6 md:mb-8 flex-1">
                      {service.desc}
                    </p>
                    <ul className="flex flex-col gap-2 mb-6">
                      {service.sub.map((item) => (
                        <li key={item} className="flex items-center gap-2.5 text-xs text-muted-foreground/80 font-light">
                          <ChevronRight size={11} className="text-primary/40 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center gap-2 text-[11px] tracking-widest uppercase text-primary/70 group-hover:text-primary transition-colors duration-300 mt-auto">
                      Les mer <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      ))}

      <div className="container mx-auto px-4 md:px-6"><div className="line-accent" /></div>

      {/* Marketing callout */}
      <AnimatedSection>
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4 md:px-6">
            <div className="glass rounded-3xl p-8 md:p-14 flex flex-col md:flex-row gap-8 md:gap-14 items-start md:items-center">
              <div className="flex-1">
                <p className="text-[10px] tracking-[0.4em] uppercase text-primary mb-4 md:mb-5">Avargo · Helhetlig</p>
                <h3 className="font-heading text-2xl sm:text-3xl md:text-4xl mb-4 md:mb-5 leading-snug">
                  Markedsføring og regnskap —{" "}
                  <span className="italic text-gradient-rose">endelig i samme samtale.</span>
                </h3>
                <p className="text-sm text-muted-foreground font-light leading-relaxed max-w-xl">
                  Markedsføring er en integrert del av Avargo. Det betyr at markedsbudsjett, ROAS-kalkuleringer og vekststrategi alltid vurderes i lys av de faktiske tallene — ikke i isolasjon. En helhetlig tilnærming som gjør at pengene jobber smartere.
                </p>
              </div>
              <div className="shrink-0">
                <Link
                  to="/kontakt"
                  className="group inline-flex items-center gap-3 px-8 md:px-10 py-4 bg-primary text-primary-foreground text-sm font-medium tracking-wider rounded-full glow-rose hover:scale-[1.02] transition-all duration-500 whitespace-nowrap"
                >
                  Snakk med oss
                  <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* CTA */}
      <section className="py-24 md:py-40 border-t border-border/10 text-center relative">
        <div className="absolute inset-0 ambient-glow opacity-30" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <AnimatedSection>
            <p className="text-[10px] tracking-[0.45em] uppercase text-secondary mb-6 md:mb-8">Kom i gang</p>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-6xl mb-5 md:mb-6 leading-snug max-w-3xl mx-auto">
              Ikke alle tjenestene passer alle.{" "}
              <span className="italic text-gradient-rose">La oss finne din kombinasjon.</span>
            </h2>
            <p className="text-muted-foreground font-light mb-10 md:mb-14 max-w-lg mx-auto text-sm md:text-base">
              Vi setter opp det du trenger — og ingenting mer. En samtale er nok til å finne ut hva som skaper mest verdi for deg.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/kontakt"
                className="group inline-flex items-center justify-center gap-3 px-10 md:px-12 py-4 md:py-5 bg-primary text-primary-foreground text-sm font-medium tracking-wider rounded-full glow-rose hover:scale-[1.02] transition-all duration-500"
              >
                Book en gjennomgang
                <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
              </Link>
              <Link
                to="/priser"
                className="inline-flex items-center justify-center gap-2 px-10 md:px-12 py-4 md:py-5 text-sm text-foreground/70 tracking-wider rounded-full border border-border/30 hover:border-primary/20 hover:text-foreground transition-all duration-500"
              >
                Se prisene
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
};

export default Tjenester;
