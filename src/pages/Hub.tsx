import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight, BookOpen, Users, Megaphone, Code2, CheckCircle2, Shield, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { SECTIONS, type SectionId } from "@/contexts/SectionContext";
import HeroQuickContact from "@/components/HeroQuickContact";
import heroBg from "@/assets/hero-bg.jpg";

const sectionIcons: Record<SectionId, React.ElementType> = {
  regnskap: BookOpen,
  hr: Users,
  markedsforing: Megaphone,
  it: Code2,
};

const Hub = () => {
  const sections = Object.values(SECTIONS);

  return (
    <>
      <Helmet>
        <title>Avargo | Regnskap, HR, markedsføring og IT for norske bedrifter</title>
        <meta name="description" content="Avargo samler regnskap, HR, markedsføring og IT under ett tak. Fast pris, dedikert team, ingen overraskelser. Få et uforpliktende tilbud i dag." />
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

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover opacity-35" width={1920} height={1080} fetchPriority="high" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/75 to-background/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
        </div>

        <div className="relative z-10 container mx-auto px-4 md:px-6 py-16 md:py-24">
          <div className="max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
              <p className="text-[10px] md:text-xs tracking-[0.35em] uppercase text-primary/80 mb-6 md:mb-8 font-medium">
                Regnskap · HR · Markedsføring · IT
              </p>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] mb-6 md:mb-8"
            >
              Alt din bedrift trenger.
              <br />
              <span className="text-gradient-rose">Under ett tak.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="text-sm md:text-lg text-muted-foreground leading-relaxed max-w-xl mb-8 md:mb-12"
            >
              Fire spesialiserte avdelinger. Ett koordinert team. Fast pris, ingen overraskelser — skreddersydd for små og mellomstore bedrifter i Norge.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col sm:flex-row gap-3 mb-6 md:mb-8"
            >
              <Link
                to="/kontakt"
                className="inline-flex items-center justify-center gap-2 h-12 md:h-14 px-6 md:px-8 bg-primary text-primary-foreground rounded-xl md:rounded-2xl text-sm font-semibold glow-rose hover:scale-[1.02] transition-all duration-300"
              >
                Få et uforpliktende tilbud <ArrowRight size={14} />
              </Link>
              <Link
                to="/regnskap"
                className="inline-flex items-center justify-center gap-2 h-12 md:h-14 px-6 md:px-8 border border-border/20 rounded-xl md:rounded-2xl text-sm font-medium hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
              >
                Se våre tjenester
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <HeroQuickContact source="hub-hero" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ TRUST BAR ═══ */}
      <section className="py-8 md:py-12 border-y border-border/10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { icon: Shield, label: "Godkjent regnskapsførerselskap", sub: "Finanstilsynet" },
              { icon: Clock, label: "Svar innen 24 timer", sub: "Garantert responstid" },
              { icon: CheckCircle2, label: "Fast pris — alt inkludert", sub: "Ingen skjulte kostnader" },
              { icon: Award, label: "ISO 27001-prinsipper", sub: "Trygg databehandling" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-2">
                <div className="w-9 h-9 rounded-xl bg-primary/8 flex items-center justify-center shrink-0">
                  <item.icon size={16} className="text-primary" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground/80 leading-tight">{item.label}</p>
                  <p className="text-[10px] text-muted-foreground">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ DEPARTMENTS ═══ */}
      <section className="py-16 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-10 md:mb-20"
          >
            <h2 className="text-2xl md:text-5xl lg:text-6xl font-bold leading-tight mb-3 md:mb-4">
              Velg det du trenger
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-lg mx-auto">
              Fire avdelinger, spesialisert på hvert sitt felt — eller kombiner dem til én sømløs løsning.
            </p>
          </motion.div>

          {/* Mobile: compact list */}
          <div className="md:hidden space-y-2 max-w-lg mx-auto">
            {sections.map((s) => {
              const Icon = sectionIcons[s.id];
              const accentHsl = `hsl(${s.accent.h} ${s.accent.s}% ${s.accent.l}%)`;
              return (
                <Link key={s.id} to={s.basePath} className="flex items-center gap-3 p-4 rounded-2xl border border-border/10 bg-muted/5 active:bg-muted/20 transition-colors group">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `hsl(${s.accent.h} ${s.accent.s}% ${s.accent.l}% / 0.1)` }}>
                    <Icon size={18} style={{ color: accentHsl }} strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{s.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{s.tagline}</p>
                  </div>
                  <ArrowRight size={14} className="text-muted-foreground shrink-0 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              );
            })}
          </div>

          {/* Desktop: 2x2 grid with hover reveal */}
          <div className="hidden md:grid grid-cols-2 gap-5 max-w-5xl mx-auto">
            {sections.map((s, i) => {
              const Icon = sectionIcons[s.id];
              const accentHsl = `hsl(${s.accent.h} ${s.accent.s}% ${s.accent.l}%)`;

              return (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.6 }}
                >
                  <Link
                    to={s.basePath}
                    className="group relative block rounded-3xl overflow-hidden border border-border/10 hover:border-border/25 transition-all duration-500"
                  >
                    {/* Hover glow */}
                    <div
                      className="absolute -top-20 -right-20 w-48 h-48 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-700 blur-3xl"
                      style={{ backgroundColor: accentHsl }}
                    />

                    <div className="relative p-8 lg:p-10">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 border transition-all duration-500"
                        style={{
                          backgroundColor: `hsl(${s.accent.h} ${s.accent.s}% ${s.accent.l}% / 0.08)`,
                          borderColor: `hsl(${s.accent.h} ${s.accent.s}% ${s.accent.l}% / 0.2)`,
                        }}
                      >
                        <Icon size={20} style={{ color: accentHsl }} strokeWidth={1.5} />
                      </div>

                      <h3 className="text-2xl lg:text-3xl font-bold mb-2">{s.name}</h3>
                      <p className="text-sm italic mb-4" style={{ color: accentHsl }}>{s.tagline}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-sm">
                        {s.description}
                      </p>

                      <span
                        className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider group-hover:gap-3 transition-all duration-300"
                        style={{ color: accentHsl }}
                      >
                        Gå til {s.shortName}
                        <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform duration-300" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ VALUE PROPOSITION ═══ */}
      <section className="py-16 md:py-32 border-t border-border/10">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto text-center mb-10 md:mb-16"
          >
            <h2 className="text-2xl md:text-5xl font-bold leading-tight mb-3 md:mb-4">
              Hvorfor velge <span className="text-gradient-rose">Avargo</span>?
            </h2>
            <p className="text-sm md:text-base text-muted-foreground">
              Vi gjør det enkelt å drive bedrift i Norge.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
            {[
              {
                title: "Én partner for alt",
                desc: "Slutt med å koordinere mellom regnskapsfører, markedsbyrå og IT-konsulent. Hos oss får du alt samlet.",
              },
              {
                title: "Fast pris, ingen overraskelser",
                desc: "Du vet nøyaktig hva du betaler. Rådgivning, rapportering og support er alltid inkludert.",
              },
              {
                title: "Dedikert team som kjenner deg",
                desc: "Du får faste kontaktpersoner som lærer bedriften din å kjenne — ikke en ny person hver gang.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="p-6 md:p-8 rounded-2xl border border-border/10 hover:border-primary/15 transition-all duration-500"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <h3 className="text-base font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-16 md:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/3 via-primary/5 to-transparent" />
        <div className="container mx-auto px-4 md:px-6 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-2xl md:text-5xl font-bold mb-3 md:mb-5 leading-tight max-w-2xl mx-auto">
              Klar for en enklere hverdag?
            </h2>
            <p className="text-sm md:text-base text-muted-foreground mb-8 md:mb-12 max-w-md mx-auto">
              Ta en uforpliktende prat — vi hjelper deg å finne riktig løsning.
            </p>
            <Link
              to="/kontakt"
              className="group inline-flex items-center gap-3 h-12 md:h-14 px-8 md:px-10 bg-primary text-primary-foreground text-sm font-semibold rounded-2xl glow-rose hover:scale-[1.02] transition-all duration-300"
            >
              Snakk med oss
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Hub;
