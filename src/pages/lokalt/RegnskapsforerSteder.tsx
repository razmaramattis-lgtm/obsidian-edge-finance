import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { CITIES } from "@/data/cities";
import { MapPin, ArrowRight } from "lucide-react";

const RegnskapsforerSteder = () => {
  const title = "Regnskapsfører i Norge | Avargo dekker hele landet";
  const description = "Avargo er regnskapsbyrået for hele Norge — fra Skien og Oslo til Tromsø. Finn din by og få dedikert regnskapsfører med fast pris.";
  const url = "https://avargo.no/regnskapsforer-i";

  // Group by county
  const byCounty: Record<string, typeof CITIES> = {};
  CITIES.forEach((c) => {
    byCounty[c.county] = byCounty[c.county] || [];
    byCounty[c.county].push(c);
  });
  const counties = Object.keys(byCounty).sort();

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <section className="relative overflow-hidden border-b border-border/10 pt-12 md:pt-20 pb-16">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />
          <div className="container mx-auto px-5 md:px-6 relative max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-[11px] tracking-wider uppercase mb-6">
              <MapPin className="w-3 h-3" />
              Hele Norge
            </div>
            <h1 className="font-serif text-4xl md:text-6xl font-light text-foreground mb-6 leading-[1.05]">
              Regnskapsfører <span className="text-primary">der du er</span>
            </h1>
            <p className="text-lg md:text-xl text-foreground/65 font-light leading-relaxed max-w-2xl">
              Avargo er digitalt levert — du får dedikert regnskapsfører uavhengig av hvor i Norge du holder til. Velg byen din nedenfor for lokal informasjon, priser og tilbud.
            </p>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container mx-auto px-5 md:px-6 max-w-5xl">
            {counties.map((county) => (
              <div key={county} className="mb-14 last:mb-0">
                <h2 className="font-serif text-2xl md:text-3xl font-light text-foreground mb-6 pb-3 border-b border-border/15">
                  {county}
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {byCounty[county].map((city) => (
                    <Link
                      key={city.slug}
                      to={`/regnskapsforer-i/${city.slug}`}
                      className="group flex items-center justify-between gap-3 px-5 py-4 rounded-2xl border border-border/15 bg-card/20 hover:border-primary/40 hover:bg-card/50 transition-all"
                    >
                      <div>
                        <p className="font-serif text-lg text-foreground group-hover:text-primary transition-colors">
                          Regnskapsfører i {city.name}
                        </p>
                        <p className="text-[12px] text-foreground/45 mt-0.5">{city.region}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default RegnskapsforerSteder;
