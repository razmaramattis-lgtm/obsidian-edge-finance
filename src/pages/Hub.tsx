import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight, BookOpen, Users, Megaphone, Code2 } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { AppDownloadPusher } from "@/components/AppDownloadPusher";
import { SECTIONS, type SectionId } from "@/contexts/SectionContext";
import heroBg from "@/assets/hero-bg.jpg";

const sectionIcons: Record<SectionId, React.ElementType> = {
  regnskap: BookOpen,
  hr: Users,
  markedsforing: Megaphone,
  it: Code2,
};

const sectionExtras: Record<SectionId, { bullets: string[] }> = {
  regnskap: {
    bullets: ["Dedikert regnskapsfører", "Skatteoptimalisering", "Årsregnskap & MVA", "CFO-rådgivning"],
  },
  hr: {
    bullets: ["Lønnskjøring", "Personalhåndbok", "Arbeidsrett & HMS", "Rekruttering"],
  },
  markedsforing: {
    bullets: ["SEO & Google Ads", "Sosiale medier-annonser", "Nettbutikk", "Innholdsstrategi"],
  },
  it: {
    bullets: ["Skreddersydde nettsider", "AI & automatisering", "Chatboter", "Interne systemer"],
  },
};

const Hub = () => {
  const sections = Object.values(SECTIONS);

  return (
    <>
      <Helmet>
        <title>Avargo | Regnskap, HR, markedsføring og IT for bedrifter</title>
        <meta name="description" content="Avargo samler regnskap, HR, markedsføring og IT under ett tak. Velg det du trenger — vi tar resten." />
        <link rel="canonical" href="https://avargo.no" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AccountingService",
          "name": "Avargo",
          "url": "https://avargo.no",
          "logo": "https://avargo.no/logo.png",
          "image": "https://avargo.no/og-image.jpg",
          "description": "Avargo samler regnskap, HR, markedsføring og IT under ett tak for små og mellomstore bedrifter i Norge.",
          "address": { "@type": "PostalAddress", "addressLocality": "Oslo", "addressCountry": "NO" },
          "areaServed": { "@type": "Country", "name": "Norway" },
          "priceRange": "$$",
          "sameAs": [],
          "serviceType": ["Regnskap", "HR", "Markedsføring", "IT"],
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Tjenester",
            "itemListElement": [
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Dedikert regnskapsfører" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "HR og lønnskjøring" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Markedsføring og SEO" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "IT og utvikling" } }
            ]
          }
        })}</script>
      </Helmet>

      {/* HERO */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover opacity-40" width={1920} height={1080} fetchPriority="high" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/70 to-background" />
          <div className="absolute inset-0 ambient-glow" />
        </div>

        <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <p className="hero-fade hero-delay-1 text-[11px] md:text-xs tracking-[0.3em] md:tracking-[0.4em] uppercase text-foreground/60 mb-8 md:mb-12">
              Alt din bedrift trenger — på ett sted
            </p>
            <h1 className="hero-fade hero-delay-2 font-heading text-5xl sm:text-6xl md:text-8xl leading-[1.02] mb-8 md:mb-10">
              Fire avdelinger.{" "}
              <span className="italic text-gradient-rose">Ett team.</span>
            </h1>
            <p className="hero-fade hero-delay-3 text-base md:text-xl text-foreground/70 font-light leading-relaxed max-w-2xl mx-auto mb-4">
              Regnskap, HR, markedsføring og IT — koordinert av ett team som kjenner bedriften din. Velg det du trenger, eller ta alt.
            </p>
            <p className="hero-fade hero-delay-4 text-sm text-primary/50 italic font-light mb-12 md:mb-16">
              Bygget for små og mellomstore bedrifter som fortjener mer.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION CARDS */}
      <section className="py-20 md:py-32 relative">
        <div className="absolute inset-0 ambient-glow opacity-20" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <AnimatedSection>
            <div className="text-center mb-16 md:mb-24">
              <p className="text-[10px] tracking-[0.45em] uppercase text-foreground/50 mb-5">Velg ditt område</p>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-6xl leading-snug max-w-3xl mx-auto">
                Hva trenger bedriften din <span className="italic text-gradient-rose">akkurat nå</span>?
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
            {sections.map((s, i) => {
              const Icon = sectionIcons[s.id];
              const extras = sectionExtras[s.id];
              const accentHsl = `hsl(${s.accent.h} ${s.accent.s}% ${s.accent.l}%)`;
              const accentBg = `hsl(${s.accent.h} ${s.accent.s}% ${s.accent.l}% / 0.08)`;
              const accentBorder = `hsl(${s.accent.h} ${s.accent.s}% ${s.accent.l}% / 0.2)`;
              const glowShadow = `0 8px 60px -12px hsl(${s.accent.h} ${s.accent.s}% ${s.accent.l}% / 0.2)`;

              return (
                <AnimatedSection key={s.id} delay={i * 0.1}>
                  <Link
                    to={s.basePath}
                    className="block p-8 md:p-10 glass rounded-3xl card-lift h-full group relative overflow-hidden"
                  >
                    {/* Ambient glow */}
                    <div
                      className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-700 blur-3xl"
                      style={{ backgroundColor: accentHsl }}
                    />

                    <div className="relative">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 border transition-all duration-500"
                        style={{ backgroundColor: accentBg, borderColor: accentBorder }}
                      >
                        <Icon size={20} style={{ color: accentHsl }} strokeWidth={1.5} />
                      </div>

                      <h3 className="font-heading text-2xl md:text-3xl mb-2">{s.name}</h3>
                      <p className="text-sm italic mb-4" style={{ color: accentHsl }}>{s.tagline}</p>
                      <p className="text-sm text-muted-foreground font-light leading-relaxed mb-6">
                        {s.description}
                      </p>

                      <ul className="space-y-2 mb-8">
                        {extras.bullets.map((b) => (
                          <li key={b} className="flex items-center gap-2.5 text-sm text-foreground/60 font-light">
                            <div className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: accentHsl }} />
                            {b}
                          </li>
                        ))}
                      </ul>

                      <div
                        className="inline-flex items-center gap-2 px-5 py-2.5 text-[12px] font-medium tracking-wider rounded-full transition-all duration-500 group-hover:scale-[1.02]"
                        style={{
                          backgroundColor: accentHsl,
                          color: "#0d0c0a",
                          boxShadow: glowShadow,
                        }}
                      >
                        Utforsk {s.shortName}
                        <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </Link>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* APP DOWNLOAD PUSHER */}
      <section className="py-12 md:py-16 relative">
        <div className="container mx-auto px-4 md:px-6">
          <AppDownloadPusher />
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="py-24 md:py-32 border-t border-border/10 text-center relative">
        <div className="absolute inset-0 ambient-glow opacity-25" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <AnimatedSection>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-5 leading-snug max-w-2xl mx-auto">
              Usikker på hva du trenger?
            </h2>
            <p className="text-muted-foreground font-light mb-10 max-w-md mx-auto text-sm">
              Ta en uforpliktende prat — vi hjelper deg å finne riktig løsning.
            </p>
            <Link
              to="/kontakt"
              className="group inline-flex items-center gap-3 px-10 md:px-12 py-4 md:py-5 bg-primary text-primary-foreground text-sm font-medium tracking-wider rounded-full glow-rose hover:scale-[1.02] transition-all duration-500"
            >
              Snakk med oss
              <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
};

export default Hub;
