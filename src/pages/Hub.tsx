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
              className="group inline-flex items-center justify-center gap-2 px-5 py-2.5 text-[12.5px] font-medium rounded-full border border-primary bg-primary text-primary-foreground hover:bg-primary/90 tracking-wide transition-all duration-300"
            >
              Snakk med oss
              <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Hub;
