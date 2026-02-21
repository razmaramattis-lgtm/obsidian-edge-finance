import { Link } from "react-router-dom";
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
        desc: "Du får én navngitt regnskapsfører som kjenner selskapet ditt ut og inn. Ingen saksbehandlere. Ingen ventelinjer. Et menneske som proaktivt følger opp, stiller de riktige spørsmålene — og som du faktisk kan ringe.",
        sub: ["Løpende bokføring & MVA", "Årsregnskap & skattemelding", "Aksjonærregisteroppgave", "Revisjonstøtte & dokumentasjon"],
      },
      {
        icon: BookOpen,
        href: "/tjenester/kurs",
        title: "Regnskapskurs",
        desc: "Praktiske kurs i bokføring, MVA, skattemelding og årsregnskap — levert av autoriserte regnskapsførere. Fra grunnkurs til skreddersydde bedriftspakker.",
        sub: ["Bokføring & bilagshåndtering", "MVA-loven i praksis", "Skattemelding & årsregnskap", "System & internkontroll"],
      },
    ],
  },
  {
    id: "cfo",
    label: "CFO-as-a-Service",
    tag: "Strategisk lag",
    tagColor: "text-secondary",
    headline: "Strategisk finansiell lederskap — uten heltidsansettelsen.",
    intro:
      "Mange vekstselskaper trenger en CFO, men ikke nødvendigvis på fulltid. Vår CFO-tjeneste gir deg senioreksperts perspektiv på kapitalstruktur, vekstfinansiering og strategiske veivalg — til en brøkdel av kostnaden.",
    services: [
      {
        icon: Briefcase,
        href: "/tjenester/cfo",
        title: "CFO-as-a-Service",
        desc: "En erfaren finansiell leder som deltar i strategimøter, investordialog og styrearbeid. Vi hjelper deg å navigere vekst, exit, fusjon eller refinansiering med presisjon og innsikt som gjør forskjellen.",
        sub: ["Kapitalstruktur & finansieringsstrategi", "Investor- og styrekommunikasjon", "Exit- og fusjonsplanlegging", "Budsjettering & scenarioanalyse"],
      },
    ],
  },
  {
    id: "hr",
    label: "HR & Personal",
    tag: "Menneskene i selskapet",
    tagColor: "text-secondary",
    headline: "HR uten friksjon. Personaladministrasjon uten papirveldet.",
    intro:
      "Fra lønnskjøring til arbeidsrett — HR er mer enn administrasjon. Vi tar ansvar for prosessene slik at du kan fokusere på menneskene, kulturen og veksten.",
    services: [
      {
        icon: Users,
        href: "/tjenester/hr-og-lonn",
        title: "Lønn & HR-administrasjon",
        desc: "Presis lønnskjøring, arbeidskontrakter, HMS-dokumentasjon og personaloppfølging. Vi sørger for at selskapet ditt alltid er compliant — og at dine ansatte opplever en profesjonell arbeidsgiver.",
        sub: ["Lønnskjøring & A-melding", "Arbeidskontrakter & personalreglement", "HMS & internkontroll", "Onboarding & offboarding"],
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
      "Avargo tilbyr full-spektrum digital markedsføring som kobler din finansielle strategi direkte til vekstmålene. Ikke kampanjer i vakuum — men markedsføring forankret i tallene.",
    services: [
      {
        icon: LayoutTemplate,
        href: "/tjenester/nettsider",
        title: "Nettsider & digitale flater",
        desc: "Moderne, konverteringsoptimaliserte nettsider og nettbutikker som kommuniserer merkevaren din presist — og som gjør det enkelt for kundene å ta neste steg. Bygget for hastighet, skalerbarhet og resultat.",
        sub: ["Framer & custom nettside", "Nettside-redesign", "Nettbutikker & e-handel", "Landingssider & konverteringsoptimalisering"],
      },
      {
        icon: Search,
        href: "/tjenester/seo",
        title: "SEO & søkbarhet",
        desc: "Strategisk søkemotoroptimalisering som bygger langsiktig organisk synlighet. Vi kombinerer teknisk SEO, innholdsstrategi og lokal tilstedeværelse — slik at kundene finner deg når behovet oppstår.",
        sub: ["Teknisk SEO & sidestruktur", "Google Min Bedrift-optimalisering", "AI-assistert innholdsproduksjon", "Konkurrentanalyse & søkeordstrategi"],
      },
      {
        icon: Megaphone,
        href: "/tjenester/meta-annonser",
        title: "Meta-annonser (Facebook & Instagram)",
        desc: "Presisjonsrettede kampanjer på Meta-plattformene som genererer kvalifiserte leads og salg — ikke bare rekkevidde. Vi styrer budsjett, målgrupper og kreativt innhold basert på kontinuerlig dataanalyse.",
        sub: ["Kampanjestrategi & målgruppebygging", "Annonseproduksjon & A/B-testing", "Retargeting & lookalike-målgrupper", "Konverteringssporing & ROAS-optimalisering"],
      },
      {
        icon: Globe,
        href: "/tjenester/google-ads",
        title: "Google Ads & søkeannonsering",
        desc: "Møt kunden i kjøpsøyeblikket med presisjonsstyrt søkeannonsering. Vi strukturerer kampanjer, byr strategisk og optimaliserer kontinuerlig — slik at hver krone gir maksimal avkastning.",
        sub: ["Søke- og displaykampanjer", "Performance Max", "Lokal annonsering", "Budsjettoptimalisering & rapportering"],
      },
      {
        icon: ShoppingCart,
        href: "/tjenester/nettbutikk",
        title: "Nettbutikk & e-handel",
        desc: "En nettbutikk som ikke bare ser bra ut, men som konverterer besøkende til kunder. Vi designer, bygger og optimaliserer e-handelssystemer som er klare til å skalere.",
        sub: ["Shopify & WooCommerce", "Produktpresentasjon & UX", "Betalingsløsninger & integrasjoner", "Lager- og ordrestyring"],
      },
      {
        icon: Bot,
        href: "/tjenester/ai-automatisering",
        title: "AI & automatisering",
        desc: "Intelligente arbeidsflyter og AI-drevne løsninger som eliminerer repetitive oppgaver og skalerer kapasiteten din uten proporsjonalt mer ressurser. Teknologi som jobber mens du sover.",
        sub: ["Prosessautomatisering & integrasjoner", "AI-chatbot & kundeservice", "Automatisk leadoppfølging", "Datadrevne beslutningssystemer"],
      },
    ],
  },
];

const Tjenester = () => {
  return (
    <>
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
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 md:px-10 py-4 text-sm text-foreground/50 tracking-wider rounded-full border border-border/20 hover:border-primary/20 hover:text-foreground transition-all duration-500"
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
                        <li key={item} className="flex items-center gap-2.5 text-xs text-muted-foreground/60 font-light">
                          <ChevronRight size={11} className="text-primary/40 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center gap-2 text-[11px] tracking-widest uppercase text-primary/50 group-hover:text-primary transition-colors duration-300 mt-auto">
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
                className="inline-flex items-center justify-center gap-2 px-10 md:px-12 py-4 md:py-5 text-sm text-foreground/50 tracking-wider rounded-full border border-border/20 hover:border-primary/20 hover:text-foreground transition-all duration-500"
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
