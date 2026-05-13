import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { getCityBySlug, CITIES } from "@/data/cities";
import { ArrowRight, MapPin, Phone, Clock, ShieldCheck, CheckCircle2, Building2 } from "lucide-react";
import CityContactForm from "@/components/lokalt/CityContactForm";

const RegnskapsforerCity = () => {
  const { city: slug } = useParams<{ city: string }>();
  const city = getCityBySlug(slug);

  if (!city) return <Navigate to="/regnskapsforer-i" replace />;

  const title = `Regnskapsfører i ${city.name} | Avargo — fast pris, dedikert kontaktperson`;
  const description = `Avargo er regnskapsbyrået for ${city.name}-bedrifter. Dedikert regnskapsfører, fast pris, full delegering. Svar innen 24 timer.`;
  const url = `https://avargo.no/regnskapsforer-i/${city.slug}`;

  const faq = [
    {
      q: `Hvor mye koster en regnskapsfører i ${city.name}?`,
      a: `Hos Avargo starter regnskap fra 1 590 kr/mnd for nye AS og enkeltpersonforetak i ${city.name}. Vi har fast pris uten skjulte tillegg — du vet alltid hva du betaler. Større selskaper får tilbud basert på antall bilag og tjenestebehov.`,
    },
    {
      q: `Trenger jeg lokal regnskapsfører i ${city.name}?`,
      a: `Nei. Moderne regnskapsføring foregår 100 % digitalt — du laster opp bilag fra mobilen, vi tar resten. Avargo har hovedkontor i Skien (Telemark), men leverer til hele Norge inkludert ${city.name}. Du får én dedikert kontaktperson som kjenner deg og bedriften din.`,
    },
    {
      q: `Hvor raskt svarer Avargo på henvendelser?`,
      a: `Vi garanterer svar innen 24 timer på alle henvendelser fra ${city.name}-kunder, hverdager. Eksisterende kunder har i tillegg ubegrenset gratis telefonsupport.`,
    },
    {
      q: `Kan jeg bytte til Avargo midt i året?`,
      a: `Ja. Vi tar over hele regnskapet ditt — også hvis du har et eksisterende byrå i ${city.name}. Vi henter inn data, gjør overgangen sømløs og du betaler ingenting før du er over hos oss.`,
    },
    {
      q: `Hvilke bransjer i ${city.name} jobber dere med?`,
      a: `Vi har spesialisert kompetanse på ${city.industries.join(", ").toLowerCase()} og en rekke andre bransjer. Vi jobber ikke med sport- eller fritidsklienter.`,
    },
  ];

  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "AccountingService",
    name: `Avargo — Regnskapsfører i ${city.name}`,
    description,
    url,
    image: "https://avargo.no/logo.png",
    telephone: "",
    email: "kontakt@avargo.no",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Oscars gate 2B",
      addressLocality: "Skien",
      postalCode: "3714",
      addressCountry: "NO",
    },
    areaServed: {
      "@type": "City",
      name: city.name,
      containedInPlace: { "@type": "AdministrativeArea", name: city.county },
    },
    serviceType: ["Regnskap", "Lønn", "Årsregnskap", "Skatteplanlegging", "CFO-tjenester"],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Hjem", item: "https://avargo.no/" },
      { "@type": "ListItem", position: 2, name: "Regnskapsfører i Norge", item: "https://avargo.no/regnskapsforer-i" },
      { "@type": "ListItem", position: 3, name: `${city.name}`, item: url },
    ],
  };

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(localBusinessJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border/10 pt-12 md:pt-20 pb-16 md:pb-24">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />
          <div className="container mx-auto px-5 md:px-6 relative">
            <nav className="flex items-center gap-2 text-[12px] text-foreground/40 mb-6">
              <Link to="/" className="hover:text-foreground/70">Hjem</Link>
              <span>/</span>
              <Link to="/regnskapsforer-i" className="hover:text-foreground/70">Steder</Link>
              <span>/</span>
              <span className="text-foreground/60">{city.name}</span>
            </nav>

            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-[11px] tracking-wider uppercase mb-6">
                <MapPin className="w-3 h-3" />
                {city.region} · {city.county}
              </div>

              <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-light leading-[1.05] text-foreground mb-6">
                Regnskapsfører<br />
                <span className="text-primary">i {city.name}</span>
              </h1>

              <p className="text-lg md:text-xl text-foreground/70 font-light leading-relaxed max-w-2xl mb-10">
                {city.intro}
              </p>

              <div className="flex flex-wrap gap-3">
                <Link to="/kontakt" className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-primary text-primary-foreground text-[14px] font-medium hover:scale-[1.02] transition-transform">
                  Få tilbud — svar innen 24 t
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link to="/priser" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-border/30 text-foreground/80 text-[14px] font-medium hover:bg-muted/30 transition-colors">
                  Se priser
                </Link>
              </div>

              {/* Trust bar */}
              <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl">
                {[
                  { icon: ShieldCheck, label: "Autorisert byrå" },
                  { icon: Clock, label: "24t responstid" },
                  { icon: CheckCircle2, label: "Fast pris" },
                  { icon: Phone, label: "Gratis support" },
                ].map((t) => (
                  <div key={t.label} className="flex items-center gap-2 text-[12px] text-foreground/55">
                    <t.icon className="w-4 h-4 text-primary/70" />
                    {t.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Why Avargo for this city */}
        <section className="py-16 md:py-24 border-b border-border/10">
          <div className="container mx-auto px-5 md:px-6">
            <div className="max-w-3xl mb-12">
              <p className="text-[11px] tracking-[0.3em] uppercase text-primary/70 mb-4">Hvorfor Avargo</p>
              <h2 className="font-serif text-3xl md:text-5xl font-light text-foreground mb-6">
                Et helt team — ikke bare én regnskapsfører
              </h2>
              <p className="text-foreground/65 font-light text-lg leading-relaxed">
                {city.name}-bedrifter trenger trygghet, ikke ferier som setter regnskapet på vent. Hos Avargo får du en dedikert kontaktperson, men hele teamet står bak — vi er aldri utilgjengelige fordi noen er borte.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Dedikert kontaktperson",
                  desc: `Du får én fast regnskapsfører som kjenner ${city.name}-bedriften din og bransjen. Ingen call center, ingen ticket-systemer.`,
                },
                {
                  title: "Fast pris fra 1 590 kr/mnd",
                  desc: "Du betaler ikke per spørsmål eller per minutt. Pakkene inkluderer alt du trenger — fra bilag til årsregnskap.",
                },
                {
                  title: "Full digital flyt",
                  desc: "Last opp bilag fra mobilen, signér digitalt, se økonomien i sanntid. Tripletex, Fiken, Conta — vi bruker det du allerede har.",
                },
                {
                  title: "Lokal bransjekompetanse",
                  desc: `Vi har erfaring med ${city.industries.slice(0, 3).join(", ").toLowerCase()} og andre nøkkelbransjer i ${city.region}.`,
                },
                {
                  title: "Strategisk rådgivning inkludert",
                  desc: "Vi gjør mer enn å bokføre. Du får løpende rådgivning om skatt, lønn, vekst og struktur — uten timepris.",
                },
                {
                  title: "Bytt regnskapsfører gratis",
                  desc: `Bytter du fra et eksisterende byrå i ${city.name}? Vi tar over hele regnskapet kostnadsfritt — du betaler ingenting før du er over.`,
                },
              ].map((item) => (
                <div key={item.title} className="p-6 rounded-2xl border border-border/15 bg-card/30 hover:border-primary/30 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-serif text-xl font-medium text-foreground mb-3">{item.title}</h3>
                  <p className="text-foreground/60 text-[14px] leading-relaxed font-light">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Local industries + nearby */}
        <section className="py-16 md:py-24 border-b border-border/10">
          <div className="container mx-auto px-5 md:px-6">
            <div className="grid md:grid-cols-2 gap-12 max-w-5xl">
              <div>
                <p className="text-[11px] tracking-[0.3em] uppercase text-primary/70 mb-4">Bransjer i {city.name}</p>
                <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground mb-6">
                  Vi kjenner næringslivet i {city.region}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {city.industries.map((ind) => (
                    <span key={ind} className="px-4 py-2 rounded-full bg-muted/40 border border-border/15 text-[13px] text-foreground/75">
                      {ind}
                    </span>
                  ))}
                </div>
              </div>

              {city.nearby && city.nearby.length > 0 && (
                <div>
                  <p className="text-[11px] tracking-[0.3em] uppercase text-primary/70 mb-4">Også i nærområdet</p>
                  <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground mb-6">
                    Vi dekker hele regionen
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {city.nearby.map((n) => {
                      const nearbyCity = CITIES.find((c) => c.name.toLowerCase() === n.toLowerCase());
                      return nearbyCity ? (
                        <Link
                          key={n}
                          to={`/regnskapsforer-i/${nearbyCity.slug}`}
                          className="px-4 py-2 rounded-full bg-primary/5 border border-primary/20 text-[13px] text-primary hover:bg-primary/10 transition-colors"
                        >
                          {n}
                        </Link>
                      ) : (
                        <span key={n} className="px-4 py-2 rounded-full bg-muted/40 border border-border/15 text-[13px] text-foreground/60">
                          {n}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 md:py-24 border-b border-border/10">
          <div className="container mx-auto px-5 md:px-6">
            <div className="max-w-3xl mx-auto">
              <p className="text-[11px] tracking-[0.3em] uppercase text-primary/70 mb-4">Vanlige spørsmål</p>
              <h2 className="font-serif text-3xl md:text-5xl font-light text-foreground mb-12">
                Regnskapsfører i {city.name} — hva lurer du på?
              </h2>
              <div className="space-y-4">
                {faq.map((f) => (
                  <details key={f.q} className="group rounded-2xl border border-border/15 bg-card/30 p-6">
                    <summary className="cursor-pointer flex items-center justify-between gap-4 font-serif text-lg text-foreground">
                      {f.q}
                      <ArrowRight className="w-4 h-4 text-primary group-open:rotate-90 transition-transform shrink-0" />
                    </summary>
                    <p className="mt-4 text-foreground/65 font-light leading-relaxed">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA — city-specific form */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-5 md:px-6">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="font-serif text-4xl md:text-5xl font-light text-foreground mb-5">
                  Klar for et regnskapsbyrå som faktisk svarer?
                </h2>
                <p className="text-foreground/65 font-light text-lg">
                  Send en uforpliktende henvendelse — vi gir tilbud innen 24 timer, fast pris og full oversikt før du bestemmer deg.
                </p>
              </div>

              <CityContactForm cityName={city.name} citySlug={city.slug} />

              <div className="mt-8 text-center inline-flex items-center gap-2 text-[13px] text-foreground/50 w-full justify-center">
                <Building2 className="w-4 h-4" />
                Avargo · Oscars gate 2B, 3714 Skien · kontakt@avargo.no
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default RegnskapsforerCity;
