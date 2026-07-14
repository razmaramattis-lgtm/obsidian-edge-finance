import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight, BookOpen, Users, CheckCircle2, Shield, Clock, Layers, BadgeCheck, HeartHandshake } from "lucide-react";
import { motion } from "framer-motion";
import { SECTION_LIST, type SectionId } from "@/contexts/SectionContext";
import HeroQuickContact from "@/components/HeroQuickContact";
import ComparisonSection from "@/components/ComparisonSection";
import MetodenSection from "@/components/MetodenSection";
import HubFAQ from "@/components/HubFAQ";
import heroBg from "@/assets/hero-bg.jpg";

const sectionIcons: Record<SectionId, React.ElementType> = {
  regnskap: BookOpen,
  hr: Users,
  markedsforing: BookOpen,
  it: BookOpen,
};

const Hub = () => {
  const sections = SECTION_LIST;

  return (
    <>
      <Helmet>
        <title>Regnskapsfører for små og mellomstore bedrifter | Avargo</title>
        <meta name="description" content="Autorisert regnskapsbyrå med dedikert regnskapsfører, fast månedspris og svar innen 24 timer. Bytt regnskapsfører uten friksjon — vi tar hele overføringen." />
        <link rel="canonical" href="https://avargo.no" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AccountingService",
          "name": "Avargo",
          "url": "https://avargo.no",
          "logo": "https://avargo.no/logo.png",
          "image": "https://avargo.no/og-image.jpg",
          "description": "Avargo samler regnskap og HR under ett tak for små og mellomstore bedrifter i Norge.",
          "address": { "@type": "PostalAddress", "addressLocality": "Oslo", "addressCountry": "NO" },
          "areaServed": { "@type": "Country", "name": "Norway" },
          "priceRange": "$$",
          "sameAs": [],
          "serviceType": ["Regnskap", "HR"],
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Tjenester",
            "itemListElement": [
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Dedikert regnskapsfører" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "HR og lønnskjøring" } }
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
          <div className="grid lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-16 items-center">
            <div className="max-w-2xl">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
                <p className="text-[10px] md:text-xs tracking-[0.35em] uppercase text-primary/80 mb-6 md:mb-8 font-semibold">
                  Autorisert regnskapsbyrå · Etablert i Norge
                </p>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-[92px] leading-[0.95] tracking-tight mb-6 md:mb-8"
              >
                Regnskapet ditt,
                <br />
                <span className="italic text-gradient-rose">i trygge hender.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="text-base md:text-xl text-muted-foreground font-light leading-relaxed max-w-xl mb-8 md:mb-10"
              >
                Autorisert regnskapsbyrå bygget for ambisiøse små og mellomstore bedrifter. Dedikert regnskapsfører, fast månedspris og svar innen 24 timer — så du kan bruke tiden på å drive bedriften videre.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <Link
                  to="/kontakt"
                  className="inline-flex items-center justify-center gap-2 h-12 md:h-14 px-6 md:px-8 bg-primary text-primary-foreground rounded-xl md:rounded-2xl text-sm font-semibold glow-rose hover:scale-[1.02] transition-all duration-300"
                >
                  Få et uforpliktende tilbud <ArrowRight size={14} />
                </Link>
                <Link
                  to="/tjenester"
                  className="inline-flex items-center justify-center gap-2 h-12 md:h-14 px-6 md:px-8 border border-border/20 rounded-xl md:rounded-2xl text-sm font-medium hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
                >
                  Se våre tjenester
                </Link>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="w-full lg:max-w-md lg:ml-auto"
            >
              <HeroQuickContact source="hub-hero" />
            </motion.div>
          </div>
        </div>

      </section>

      {/* ═══ TRUST BAR ═══ */}
      <section className="py-8 md:py-12 bg-primary">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            {[
              { icon: Shield, label: "Godkjent regnskapsførerselskap", sub: "Finanstilsynet" },
              { icon: Clock, label: "Svar innen 24 timer", sub: "Garantert responstid" },
              { icon: CheckCircle2, label: "Fast pris — alt inkludert", sub: "Ingen skjulte kostnader" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-2">
                <div className="w-9 h-9 rounded-xl bg-primary-foreground/10 flex items-center justify-center shrink-0">
                  <item.icon size={16} className="text-primary-foreground" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-primary-foreground leading-tight">{item.label}</p>
                  <p className="text-[10px] text-primary-foreground/70">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ DEPARTMENTS ═══ */}
      <section className="py-16 md:py-32 relative">
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
              To spesialiserte avdelinger — hver for seg, eller kombinert til én sømløs løsning med felles team.
            </p>
          </motion.div>

          {/* Mobile: compact list */}
          <div className="md:hidden space-y-2 max-w-lg mx-auto">
            {sections.map((s) => {
              const Icon = sectionIcons[s.id];
              const accentHsl = `hsl(${s.accent.h} ${s.accent.s}% ${s.accent.l}%)`;
              return (
                <Link key={s.id} to={s.basePath} className="flex items-center gap-3 p-4 rounded-2xl border border-border/20 bg-card active:bg-muted/20 transition-colors group">
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
                    className="group relative block rounded-3xl overflow-hidden border border-border/20 bg-card hover:border-border/40 transition-all duration-500"
                  >
                    {/* subtle top sheen */}
                    <div
                      className="absolute inset-x-0 top-0 h-px opacity-30"
                      style={{ backgroundColor: accentHsl }}
                    />
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
      <section className="py-16 md:py-32 relative">
        <div className="container mx-auto px-4 md:px-6 relative">

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
                icon: Layers,
                title: "Én partner for regnskap og HR",
                desc: "Slutt med å koordinere mellom regnskapsfører og HR-konsulent. Ett team, én kontaktperson, én faktura.",
              },
              {
                icon: BadgeCheck,
                title: "Fast pris, ingen overraskelser",
                desc: "Du vet nøyaktig hva du betaler hver måned. Rådgivning, rapportering og support er alltid inkludert.",
              },
              {
                icon: HeartHandshake,
                title: "Dedikert team som kjenner deg",
                desc: "Du får faste kontaktpersoner som lærer bedriften din å kjenne — ikke en ny saksbehandler hver gang.",
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
                <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center mb-5">
                  <item.icon size={18} className="text-primary" strokeWidth={1.5} />
                </div>
                <h3 className="text-base font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ COMPARISON ═══ */}
      <ComparisonSection />

      {/* ═══ METODEN ═══ */}
      <MetodenSection />

      {/* ═══ FAQ ═══ */}
      <HubFAQ />



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
