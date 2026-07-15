import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight, BookOpen, Users, CheckCircle2, Shield, Clock, Layers, BadgeCheck, HeartHandshake } from "lucide-react";
import { motion } from "framer-motion";
import { SECTION_LIST, type SectionId } from "@/contexts/SectionContext";
import HeroQuickContact from "@/components/HeroQuickContact";
import SwitchCheckSection from "@/components/SwitchCheckSection";

import HubFAQ from "@/components/HubFAQ";
import heroBg from "@/assets/hero-bg.jpg";
import hubPartner from "@/assets/hub-partner.jpg";
import hubFastpris from "@/assets/hub-fastpris.jpg";
import hubTeam from "@/assets/hub-team.jpg";

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
        <meta name="description" content="Autorisert regnskapsbyrå med dedikert regnskapsfører, fast månedspris og rask respons på hverdager. Bytt regnskapsfører uten friksjon — vi tar hele overføringen." />
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
                <span className="inline-block text-[10px] md:text-xs tracking-[0.35em] uppercase text-secondary mb-6 md:mb-8 font-semibold px-3.5 py-1.5 rounded-full border border-background/70 bg-secondary/5">
                  Autorisert regnskapsbyrå
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-[92px] leading-[0.95] tracking-tight mb-6 md:mb-8"
              >
                Regnskap som
                <br />
                <span className="italic text-gradient-rose">frigjør tid.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="text-base md:text-xl text-muted-foreground font-light leading-relaxed max-w-xl mb-8 md:mb-10"
              >
                Vi er regnskapsbyrået for gründere og daglige ledere som vil vokse — ikke drukne i bilag. Dedikert autorisert regnskapsfører, fast månedspris uten overraskelser, og reell rådgivning når du trenger den. Vi tar hele byttet fra din nåværende regnskapsfører.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <Link
                  to="/kontakt"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-[12.5px] font-medium rounded-full border border-primary bg-primary text-primary-foreground hover:bg-primary/90 tracking-wide transition-all duration-300"
                >
                  Få et uforpliktende tilbud <ArrowRight size={12} />
                </Link>
                <Link
                  to="/tjenester"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-[12.5px] font-medium rounded-full border border-primary/20 bg-muted text-primary hover:bg-muted/80 tracking-wide transition-all duration-300"
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
      <section className="py-8 md:py-12 bg-secondary border-y border-accent/20">

        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            {[
              { icon: Shield, label: "Godkjent regnskapsførerselskap", sub: "Finanstilsynet" },
              { icon: Clock, label: "Rask respons", sub: "Vi vet tiden din er verdifull" },
              { icon: CheckCircle2, label: "Fast pris — alt inkludert", sub: "Ingen skjulte kostnader" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-2">
                <div className="w-9 h-9 rounded-xl bg-accent/25 border border-accent/30 flex items-center justify-center shrink-0">
                  <item.icon size={16} className="text-accent" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-secondary-foreground leading-tight">{item.label}</p>
                  <p className="text-[10px] text-muted font-medium">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SWITCH CHECK ═══ */}
      <SwitchCheckSection />




      {/* ═══ VALUE PROPOSITION ═══ */}
      <section className="py-16 md:py-32 relative bg-card">
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
                image: hubPartner,
              },
              {
                icon: BadgeCheck,
                title: "Fast pris, ingen overraskelser",
                desc: "Du vet nøyaktig hva du betaler hver måned. Rådgivning, rapportering og support er alltid inkludert.",
                image: hubFastpris,
              },
              {
                icon: HeartHandshake,
                title: "Dedikert team som kjenner deg",
                desc: "Du får faste kontaktpersoner som lærer bedriften din å kjenne — ikke en ny saksbehandler hver gang.",
                image: hubTeam,
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="rounded-xl bg-background border border-border/20 shadow-sm hover:border-primary/20 hover:shadow-md transition-all duration-500 overflow-hidden"
              >
                <div className="aspect-[4/3] w-full overflow-hidden relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    width={1024}
                    height={768}
                    className="w-full h-full object-cover"
                    style={{ filter: "saturate(0.7) hue-rotate(-8deg) contrast(0.98)" }}
                  />
                  <div className="absolute inset-0 bg-primary/15 mix-blend-multiply pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-sage/10 pointer-events-none" />
                </div>
                <div className="p-6 md:p-8">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center mb-5">
                    <item.icon size={18} className="text-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-base font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}

      <HubFAQ />



      {/* Fade band: cream → white (soft) */}
      <div aria-hidden className="h-20 md:h-28 w-full bg-gradient-to-b from-background to-card" />

      {/* ═══ CTA ═══ */}
      <section className="py-16 md:py-32 bg-card">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-2xl md:text-5xl font-bold mb-3 md:mb-5 leading-tight max-w-2xl mx-auto">
              Klar for en enklere hverdag?
            </h2>
            <p className="text-sm md:text-base text-muted-foreground mb-8 md:mb-12 max-w-md mx-auto">
              Ta en uforpliktende prat — vi hjelper deg å finne riktig løsning.
            </p>
            <Link
              to="/kontakt"
              className="group inline-flex items-center gap-2 px-5 py-2.5 text-[12.5px] font-medium rounded-full border border-border text-foreground/85 hover:border-foreground hover:text-foreground tracking-wide transition-all duration-300"
            >
              Snakk med oss
              <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Fade band: white → cream (soft) back to page background */}
      <div aria-hidden className="h-20 md:h-28 w-full bg-gradient-to-b from-card to-background" />
    </>
  );
};

export default Hub;
