import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Calculator,
  Building2,
  Users,
  FileText,
  Receipt,
  Shield,
  MessageCircle,
} from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { Helmet } from "react-helmet-async";
import { useSection } from "@/contexts/SectionContext";
import PricingCalculator from "@/components/PricingCalculator";

const includedServices = [
  { icon: Receipt, title: "Daglig bokføring", description: "Automatisk bankintegrasjon, bilagsregistrering og månedlig avstemming — uten tillegg i timen." },
  { icon: FileText, title: "MVA & skatt", description: "MVA-melding, skatteberegning og oppfølging mot Skatteetaten og Brønnøysundregistrene." },
  { icon: Users, title: "Lønn & HR", description: "Lønnskjøring, a-melding, feriepenger og sykefraværsoppfølging for deg og dine ansatte." },
  { icon: Building2, title: "Årsregnskap", description: "Komplett årsavslutning, skattemelding, næringsoppgave og offentlig rapportering." },
  { icon: Calculator, title: "Økonomisk oversikt", description: "Månedsrapporter, nøkkeltall og likviditetsstyring slik at du alltid vet hvor du står." },
  { icon: Shield, title: "Rådgivning & support", description: "Dedikert regnskapsfører, skatterådgivning og ubegrenset support — rask respons på hverdager." },
];

// ── Component ─────────────────────────────────────────────────
// Spørsmål og svar godkjent i «Avargo.no – tekstutkast» (okt. 2026). Vises på siden
// og i de strukturerte dataene, slik at de to alltid er like.
const PRICING_FAQ = [
  {
    q: "Hva koster en regnskapsfører for et lite AS?",
    a: "Hos Avargo starter fast månedspris på 1 950 kr eks. mva for et lite AS. Prisen øker med omsetning, antall bilag og ansatte. Kalkulatoren gir deg et estimat for ditt selskap.",
  },
  {
    q: "Hva er inkludert i månedsprisen?",
    a: "Løpende bokføring, avstemming, MVA-meldinger og rådgivning på telefon og e-post. Lønn og årsoppgjør.",
  },
  {
    q: "Hvorfor fast pris i stedet for timepris?",
    a: "Med fast pris vet du hva regnskapet koster hver måned, og du kan ringe med spørsmål uten å tenke på klokka. For arbeid utenfor avtalen bruker vi timepris, og du får beskjed før vi starter.",
  },
  {
    q: "Hva hvis bedriften vokser?",
    a: "Vi går gjennom prisen sammen med deg hvis volumet endrer seg mye, for eksempel ved flere ansatte eller mange flere bilag. Du får aldri en ny pris uten å ha fått beskjed først.",
  },
  {
    q: "Er det bindingstid?",
    a: "Avtales dersom det er hensiktsmessig, men benyttes ikke alltid.",
  },
];

const Pricing = () => {
  const { isInSection, section } = useSection();
  const sectionPath = isInSection && section ? section.basePath : "";

  const pageTitle = "Priser | Fastpris fra 1 950 kr/mnd — Avargo";
  const pageDesc =
    "Fastpris på regnskap fra 1 950 kr/mnd hos Avargo. Ingen skjulte tillegg. Bokføring, MVA, lønn, årsregnskap og rådgivning — alt inkludert.";
  const pageUrl = `https://avargo.no${sectionPath}/priser`;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Regnskapsføring til fast månedspris",
          "serviceType": "Regnskapsføring",
          "provider": { "@type": "AccountingService", "name": "Avargo Regnskap AS", "url": "https://avargo.no/", "telephone": "+4798642391", "email": "kontakt@avargo.no" },
          "areaServed": { "@type": "Country", "name": "Norge" },
          "url": "https://avargo.no/priser",
          "offers": {
            "@type": "AggregateOffer",
            "priceCurrency": "NOK",
            "lowPrice": "1950",
            "highPrice": "9950",
            "offerCount": "4",
            "availability": "https://schema.org/InStock",
            "url": "https://avargo.no/priser",
            "priceSpecification": {
              "@type": "UnitPriceSpecification",
              "priceCurrency": "NOK",
              "price": "1950",
              "unitCode": "MON",
              "billingIncrement": 1,
              "description": "Fast månedspris fra 1 950 kr. Bokføring, MVA, årsregnskap og rådgivning inkludert."
            }
          }
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": PRICING_FAQ.map((f) => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } }))
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Hjem", "item": "https://avargo.no/" },
            { "@type": "ListItem", "position": 2, "name": "Priser", "item": "https://avargo.no/priser" }
          ]
        })}</script>

      </Helmet>

      {/* ── Hero + calculator ─────────────────────────── */}
      <section className="pt-10 pb-20 md:pt-16 md:pb-28 relative overflow-hidden">
        <div className="absolute inset-0 ambient-glow opacity-60" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start max-w-7xl mx-auto">
            {/* Left: copy */}
            <AnimatedSection>
              <div className="lg:sticky lg:top-28">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/8 text-primary text-[11px] font-medium tracking-[0.15em] uppercase mb-6">
                  Priser
                </span>
                <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1] mb-6 overflow-visible">
                  Fastpris fra{" "}
                  <span className="italic text-gradient-rose pr-3">1 950 kr/mnd</span>
                </h1>
                <p className="text-xl md:text-2xl text-foreground/80 font-light leading-relaxed mb-6">
                  Forutsigbare kostnader – uten skjulte tillegg.
                </p>
                <p className="text-foreground/60 font-light leading-relaxed mb-10 max-w-md">
                  Hos Avargo betaler du én fast månedspris. Ingen timepriser, ingen overraskelser og ingen ekstra fakturaer for MVA, lønn eller rådgivning. Alt du trenger innen regnskap er inkludert fra dag én.
                </p>

                <div className="p-6 md:p-8 rounded-3xl bg-card/60 border border-border/40">
                  <h2 className="font-heading text-2xl md:text-3xl mb-3 flex items-center gap-3">
                    <Calculator size={26} className="text-primary" />
                    Prisvurderingskalkulator
                  </h2>
                  <p className="text-foreground/60 font-light leading-relaxed text-sm md:text-base">
                    Fyll ut stegene, så får du et estimat tilpasset bedriften din. Vi kommer tilbake med et endelig, uforpliktende tilbud så snart vi har sett på oversikten.
                  </p>
                </div>
              </div>
            </AnimatedSection>

            {/* Right: calculator */}
            <AnimatedSection delay={0.15}>
              <PricingCalculator />
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ── What's included ────────────────────────────── */}
      <section className="py-20 md:py-32 border-t border-border/30 bg-muted/20">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection>
            <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary/8 text-secondary text-[11px] font-medium tracking-[0.15em] uppercase mb-6">
                Inkludert i fastprisen
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-5">
                Alt innen regnskap — <span className="italic text-gradient-rose">i én pris</span>
              </h2>
              <p className="text-foreground/60 font-light leading-relaxed">
                Ingen moduler å kjøpe til, ingen timepriser og ingen skjulte gebyrer. Dette følger med uansett pakke.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            {includedServices.map((service, i) => (
              <AnimatedSection key={service.title} delay={i * 0.08}>
                <div className="group h-full p-7 md:p-8 rounded-3xl bg-card/70 border border-border/40 card-lift">
                  <div className="w-12 h-12 rounded-2xl bg-primary/8 border border-primary/15 flex items-center justify-center mb-5 group-hover:bg-primary/12 transition-colors">
                    <service.icon size={22} className="text-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-heading text-xl md:text-2xl mb-3">{service.title}</h3>
                  <p className="text-sm text-foreground/60 font-light leading-relaxed">{service.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection delay={0.4}>
            <div className="max-w-3xl mx-auto mt-16 md:mt-20">
              <div className="p-6 md:p-8 rounded-3xl bg-card/60 border border-border/40">
                <h3 className="font-heading text-2xl mb-5">Detaljert oversikt over det som er inkludert</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                  {[
                    "Daglig bokføring og bilagsregistrering",
                    "Bank- og kredittkortavstemming",
                    "Kunde- og leverandørgjeld",
                    "Fakturering og purring",
                    "MVA-beregning og MVA-melding",
                    "Lønnskjøring og a-melding",
                    "Feriepenger og sykefraværsoppfølging",
                    "Årsregnskap og skattemelding",
                    "Næringsoppgave og offentlig rapportering",
                    "Månedsrapporter og nøkkeltall",
                    "Skatterådgivning og planlegging",
                    "Dedikert regnskapsfører",
                    "Ubegrenset support på telefon og e-post",
                    "Tilgang til kundeportalen",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3 text-sm text-foreground/70 font-light">
                      <Check size={16} className="text-secondary mt-0.5 shrink-0" strokeWidth={2} />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.5}>
            <div className="max-w-4xl mx-auto mt-20 md:mt-28">
              <div className="text-center mb-12">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/8 text-primary text-[11px] font-medium tracking-[0.15em] uppercase mb-5">
                  Hvorfor velge oss
                </span>
                <h3 className="font-heading text-3xl sm:text-4xl mb-4">
                  Avargo vs. <span className="italic text-gradient-rose">tradisjonelle regnskapsbyråer</span>
                </h3>
                <p className="text-foreground/60 font-light leading-relaxed max-w-2xl mx-auto">
                  Vi har bygget et regnskapsbyrå for små og mellomstore bedrifter som er lei av uforutsigbare regninger og treg respons.
                </p>
              </div>

              <div className="rounded-3xl border border-border/40 bg-card/60 overflow-hidden">
                <div className="hidden sm:grid grid-cols-3 gap-4 px-6 py-4 bg-primary/5 border-b border-border/40 text-xs uppercase tracking-[0.15em] text-foreground/50 font-medium">
                  <span></span>
                  <span className="text-center text-primary">Avargo</span>
                  <span className="text-center">Tradisjonelt byrå</span>
                </div>
                <div className="divide-y divide-border/40">
                  {[
                    ["Prising", "Fast månedspris – ingen tillegg", "Timepriser og tillegg for MVA, lønn og årsoppgjør"],
                    ["Rådgivning", "Inkludert – fast pris", "Ofte fakturert separat per time"],
                    ["Support", "Ubegrenset telefon og e-post", "Begrenset eller timebasert"],
                    ["Respons", "Rask respons på hverdager", "Dager, noen ganger uker"],
                    ["Oversikt", "Månedsrapporter og nøkkeltall", "Som regel kun årsregnskap"],
                    ["Digital tilgang", "Egen kundeportal", "E-post og papirbasert"],
                    ["Bytte", "Vi tar oss av overgangen", "Kunden står ofte alene"],
                  ].map(([label, avargo, traditional]) => (
                    <div key={label} className="grid grid-cols-1 sm:grid-cols-3 gap-2 px-6 py-4 items-center">
                      <span className="text-sm font-medium text-foreground/80 sm:font-normal">{label}</span>
                      <div className="flex items-start gap-3 text-sm text-foreground/70 font-light sm:text-center sm:justify-center">
                        <Check size={16} className="text-secondary mt-0.5 shrink-0 sm:hidden" strokeWidth={2} />
                        <span className="text-foreground">{avargo}</span>
                      </div>
                      <div className="flex items-start gap-3 text-sm text-foreground/50 font-light sm:text-center sm:justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-foreground/30 mt-2 shrink-0 sm:hidden" />
                        <span>{traditional}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Spørsmål og svar ─────────────────────────────── */}
      <section className="py-20 md:py-28 border-t border-border/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <p className="text-[11px] tracking-[0.3em] uppercase text-primary/70 mb-4">Vanlige spørsmål</p>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-10">Spørsmål om pris</h2>
            <div className="space-y-4">
              {PRICING_FAQ.map((f) => (
                <details key={f.q} className="group rounded-2xl border border-border/30 bg-card/30 p-6">
                  <summary className="cursor-pointer flex items-center justify-between gap-4 font-heading text-lg text-foreground">
                    {f.q}
                    <ArrowRight size={16} className="text-primary group-open:rotate-90 transition-transform shrink-0" />
                  </summary>
                  <p className="mt-4 text-foreground/65 font-light leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
            <p className="mt-8 text-foreground/65 font-light">
              Vurderer du å bytte fra en annen regnskapsfører?{" "}
              <Link to="/bytte-regnskapsforer" className="text-primary hover:underline">Slik går byttet til</Link>.
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────── */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative">
          <AnimatedSection>
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-6">
                Klar for <span className="italic text-gradient-rose">forutsigbart regnskap</span>?
              </h2>
              <p className="text-foreground/60 font-light leading-relaxed max-w-xl mx-auto mb-10">
                Få et uforpliktende tilbud, eller book en gratis gjennomgang av dagens regnskapssituasjon.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to={`${sectionPath}/kontakt`}
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground text-sm font-medium tracking-wider rounded-full glow-rose hover:scale-[1.02] transition-all duration-500"
                >
                  Bli kunde
                  <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                </Link>
                <Link
                  to={`${sectionPath}/book-mote`}
                  className="group inline-flex items-center gap-3 px-8 py-4 border border-border/60 text-foreground/80 hover:text-foreground hover:border-primary/40 hover:bg-primary/5 text-sm font-medium tracking-wider rounded-full transition-all duration-500"
                >
                  <MessageCircle size={15} className="text-primary" />
                  Book møte
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
};

export default Pricing;
