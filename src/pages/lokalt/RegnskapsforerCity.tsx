import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { getCityBySlug, CITIES, sharedCityFaq } from "@/data/cities";
import { ArrowRight, MapPin, ShieldCheck, CheckCircle2, BadgeCheck, Layers, Building2 } from "lucide-react";
import CityContactForm from "@/components/lokalt/CityContactForm";

/** The shared answer ends with this sentence; it becomes a link to the switching page. */
const SWITCH_SENTENCE = "Les mer på siden om å bytte regnskapsfører.";

const RegnskapsforerCity = () => {
  const { city: slug } = useParams<{ city: string }>();
  const city = getCityBySlug(slug);

  // Cities outside the core area no longer have their own page.
  if (!city) return <Navigate to="/regnskapsforer-i" replace />;

  const where = `${city.prep} ${city.name}`;
  const title = `Regnskapsfører ${where} – fast månedspris | Avargo`;
  const description = `Statsautorisert regnskapsfører for små og mellomstore bedrifter ${where}. Fast pris fra 1 950 kr/mnd. Fiken, Tripletex og andre systemer.`;
  const url = `https://avargo.no/regnskapsforer-i/${city.slug}`;

  const faq = [...city.localFaq, ...sharedCityFaq(city)];
  const neighbours = city.nearby
    .map((s) => CITIES.find((c) => c.slug === s))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "AccountingService",
    "@id": `${url}#service`,
    name: `Avargo – Regnskapsfører ${where}`,
    description,
    url,
    image: "https://avargo.no/og-avargo.jpg",
    email: "kontakt@avargo.no",
    telephone: "+4798642391",
    priceRange: "$$",
    parentOrganization: { "@id": "https://avargo.no/#organization" },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Lillestrøm",
      addressRegion: "Akershus",
      addressCountry: "NO",
    },
    areaServed: {
      "@type": "City",
      name: city.name,
      containedInPlace: { "@type": "AdministrativeArea", name: city.county },
    },
    serviceType: ["Regnskap", "Lønn", "MVA", "Årsregnskap", "Skattemelding"],
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
      { "@type": "ListItem", position: 2, name: "Områder", item: "https://avargo.no/regnskapsforer-i" },
      { "@type": "ListItem", position: 3, name: city.name, item: url },
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
        {/* 1–2. Overskrift og ingress */}
        <section className="relative overflow-hidden border-b border-border/10 pt-12 md:pt-20 pb-16 md:pb-24">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />
          <div className="container mx-auto px-5 md:px-6 relative">
            <nav className="flex items-center gap-2 text-[12px] text-foreground/40 mb-6" aria-label="Brødsmuler">
              <Link to="/" className="hover:text-foreground/70">Hjem</Link>
              <span>/</span>
              <Link to="/regnskapsforer-i" className="hover:text-foreground/70">Områder</Link>
              <span>/</span>
              <span className="text-foreground/60">{city.name}</span>
            </nav>

            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-[11px] tracking-wider uppercase mb-6">
                <MapPin className="w-3 h-3" />
                {city.region === city.county ? city.county : `${city.region} · ${city.county}`}
              </div>

              <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-light leading-[1.05] text-foreground mb-6">
                Regnskapsfører<br />
                <span className="text-primary">{where}</span>
              </h1>

              <p className="text-lg md:text-xl text-foreground/70 font-light leading-relaxed max-w-2xl mb-10">
                {city.intro}
              </p>

              <div className="flex flex-wrap gap-3">
                <Link to="/priser" className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-primary text-primary-foreground text-[14px] font-medium hover:scale-[1.02] transition-transform">
                  Se hva det koster for deg
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link to="/kontakt" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-border/30 text-foreground/80 text-[14px] font-medium hover:bg-muted/30 transition-colors">
                  Ta kontakt
                </Link>
              </div>

              <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl">
                {[
                  { icon: ShieldCheck, label: "Godkjent av Finanstilsynet" },
                  { icon: BadgeCheck, label: "Statsautorisert regnskapsfører" },
                  { icon: CheckCircle2, label: "Fast månedspris" },
                  { icon: Layers, label: "Fiken, Tripletex, Conta" },
                ].map((t) => (
                  <div key={t.label} className="flex items-center gap-2 text-[12px] text-foreground/55">
                    <t.icon className="w-4 h-4 text-primary/70 shrink-0" />
                    {t.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 3–4. Næringslivet og hvem vi hjelper */}
        <section className="py-16 md:py-24 border-b border-border/10">
          <div className="container mx-auto px-5 md:px-6">
            <div className="grid md:grid-cols-2 gap-12 max-w-5xl">
              <div>
                <p className="text-[11px] tracking-[0.3em] uppercase text-primary/70 mb-4">Lokalt næringsliv</p>
                <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground mb-6">
                  Næringslivet {where}
                </h2>
                <p className="text-foreground/65 font-light text-lg leading-relaxed">{city.business}</p>
              </div>
              <div>
                <p className="text-[11px] tracking-[0.3em] uppercase text-primary/70 mb-4">Kundene våre</p>
                <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground mb-6">
                  Hvem vi hjelper {where}
                </h2>
                <ul className="space-y-3">
                  {city.helps.map((h) => (
                    <li key={h} className="flex gap-3 text-foreground/75 font-light leading-relaxed">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>
                {city.helpsNote && <p className="mt-5 text-foreground/65 font-light">{city.helpsNote}</p>}
              </div>
            </div>
          </div>
        </section>

        {/* 5–6. Møter og samarbeid + knapp til kalkulatoren */}
        <section className="py-16 md:py-24 border-b border-border/10">
          <div className="container mx-auto px-5 md:px-6">
            <div className="max-w-3xl">
              <p className="text-[11px] tracking-[0.3em] uppercase text-primary/70 mb-4">Samarbeid</p>
              <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground mb-6">Møter og samarbeid</h2>
              <p className="text-foreground/65 font-light text-lg leading-relaxed mb-10">{city.meeting}</p>
              <div className="p-6 md:p-8 rounded-2xl border border-primary/20 bg-primary/5">
                <p className="font-serif text-2xl text-foreground mb-2">Fast månedspris fra 1 950 kr</p>
                <p className="text-foreground/65 font-light mb-5">
                  Prisen avhenger av selskapsform, omsetning, antall bilag og om du har ansatte. Kalkulatoren gir deg et estimat på et par minutter.
                </p>
                <Link to="/priser" className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground text-[14px] font-medium hover:scale-[1.02] transition-transform">
                  Beregn din pris
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Spørsmål og svar */}
        <section className="py-16 md:py-24 border-b border-border/10">
          <div className="container mx-auto px-5 md:px-6">
            <div className="max-w-3xl mx-auto">
              <p className="text-[11px] tracking-[0.3em] uppercase text-primary/70 mb-4">Vanlige spørsmål</p>
              <h2 className="font-serif text-3xl md:text-5xl font-light text-foreground mb-12">
                Regnskapsfører {where} – spørsmål og svar
              </h2>
              <div className="space-y-4">
                {faq.map((f) => (
                  <details key={f.q} className="group rounded-2xl border border-border/15 bg-card/30 p-6">
                    <summary className="cursor-pointer flex items-center justify-between gap-4 font-serif text-lg text-foreground">
                      {f.q}
                      <ArrowRight className="w-4 h-4 text-primary group-open:rotate-90 transition-transform shrink-0" />
                    </summary>
                    <p className="mt-4 text-foreground/65 font-light leading-relaxed">
                      {f.a.endsWith(SWITCH_SENTENCE) ? (
                        <>
                          {f.a.slice(0, -SWITCH_SENTENCE.length)}
                          <Link to="/bytte-regnskapsforer" className="text-primary hover:underline">
                            {SWITCH_SENTENCE}
                          </Link>
                        </>
                      ) : (
                        f.a
                      )}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 8. Lenker til nabobyer og bytte-siden */}
        <section className="py-16 md:py-20 border-b border-border/10">
          <div className="container mx-auto px-5 md:px-6">
            <div className="max-w-3xl">
              <p className="text-[11px] tracking-[0.3em] uppercase text-primary/70 mb-4">Også i nærområdet</p>
              <div className="flex flex-wrap gap-2 mb-8">
                {neighbours.map((n) => (
                  <Link
                    key={n.slug}
                    to={`/regnskapsforer-i/${n.slug}`}
                    className="px-4 py-2 rounded-full bg-primary/5 border border-primary/20 text-[13px] text-primary hover:bg-primary/10 transition-colors"
                  >
                    Regnskapsfører {n.prep} {n.name}
                  </Link>
                ))}
              </div>
              <Link to="/bytte-regnskapsforer" className="inline-flex items-center gap-2 text-primary text-[14px] hover:underline">
                Vurderer du å bytte regnskapsfører? Slik går det til <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Kontaktskjema */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-5 md:px-6">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="font-serif text-4xl md:text-5xl font-light text-foreground mb-5">
                  Få et fastpristilbud
                </h2>
                <p className="text-foreground/65 font-light text-lg">
                  Send en uforpliktende henvendelse, så tar vi kontakt med et tilbud med fast månedspris.
                </p>
              </div>

              <CityContactForm cityName={city.name} citySlug={city.slug} />

              <div className="mt-8 text-center inline-flex items-center gap-2 text-[13px] text-foreground/50 w-full justify-center">
                <Building2 className="w-4 h-4" />
                Avargo Regnskap AS · Lillestrøm · kontakt@avargo.no
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default RegnskapsforerCity;
