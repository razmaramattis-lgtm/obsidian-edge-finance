import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight, BookOpen, Users, CheckCircle2, Shield, Clock, Layers, BadgeCheck, HeartHandshake, TrendingUp, Wallet } from "lucide-react";
import { motion } from "framer-motion";
import { SECTION_LIST, type SectionId } from "@/contexts/SectionContext";
import SwitchCheckSection from "@/components/SwitchCheckSection";
import { useLang } from "@/contexts/LanguageContext";

import HubFAQ from "@/components/HubFAQ";
import heroBg from "@/assets/hero-bg.jpg";
import heroPortraitAsset from "@/assets/avargo-hero2.png.asset.json";
const heroPortrait = heroPortraitAsset.url;

import hubPartner from "@/assets/hub-partner.jpg";
import hubFastpris from "@/assets/hub-fastpris.jpg";
import hubTeam from "@/assets/hub-team.jpg";
import reviewer1 from "@/assets/reviewer-1.jpg";
import reviewer2 from "@/assets/reviewer-2.jpg";
import reviewer3 from "@/assets/reviewer-3.jpg";
import { Star } from "lucide-react";


const sectionIcons: Record<SectionId, React.ElementType> = {
  regnskap: BookOpen,
  hr: Users,
  markedsforing: BookOpen,
  it: BookOpen,
};

const Hub = () => {
  const sections = SECTION_LIST;
  const { t, lang } = useLang();

  return (
    <>
      <Helmet>
        <title>{t("seo.title")}</title>
        <meta name="description" content={t("seo.description")} />
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
                  {t("hero.eyebrow")}
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-[92px] leading-[0.95] tracking-tight mb-6 md:mb-8"
              >
                {t("hero.title.a")}
                <br />
                <span className="italic text-gradient-rose">{t("hero.title.b")}</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="text-base md:text-xl text-muted-foreground font-light leading-relaxed max-w-xl mb-8 md:mb-10"
              >
                {t("hero.body")}
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
                  {t("hero.cta.primary")} <ArrowRight size={12} />
                </Link>
                <Link
                  to="/tjenester"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-[12.5px] font-medium rounded-full border border-primary/20 bg-muted text-primary hover:bg-muted/80 tracking-wide transition-all duration-300"
                >
                  {t("hero.cta.secondary")}
                </Link>
              </motion.div>

              {/* Review preview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
                className="mt-5 flex items-center gap-3"
              >
                <div className="flex -space-x-2">
                  {[reviewer1, reviewer2, reviewer3].map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt=""
                      width={40}
                      height={40}
                      loading="lazy"
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-background"
                    />
                  ))}
                </div>
                <div className="leading-tight">
                  <div className="flex items-center gap-0.5 text-amber-500" aria-label="5 out of 5 stars">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={13} fill="currentColor" strokeWidth={0} />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {lang === "en" ? (
                      <>Trusted by <span className="font-semibold text-foreground">500+ businesses</span></>
                    ) : (
                      <>Betrodd av <span className="font-semibold text-foreground">500+ bedrifter</span></>
                    )}
                  </p>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="w-full lg:max-w-md lg:ml-auto"
            >
              {/* Animated portrait bubble with floating stat cards */}
              <div className="relative mx-auto aspect-square w-full max-w-[420px] animate-drift-x will-change-transform motion-reduce:animate-none">
                <div className="relative w-full h-full animate-drift-y will-change-transform motion-reduce:animate-none">
                  {/* Ambient glow */}
                  <div className="absolute inset-4 rounded-full bg-primary/20 blur-3xl -z-10" aria-hidden />

                  {/* Image with blob morph — clipped only on the image */}
                  <div
                    className="absolute inset-0 overflow-hidden animate-blob-morph motion-reduce:animate-none shadow-2xl shadow-primary/20"
                    style={{ borderRadius: "50%" }}
                  >
                    <img
                      src={heroPortrait}
                      alt={t("hero.title.a")}
                      className="w-full h-full object-cover"
                      width={1024}
                      height={1024}
                      fetchPriority="high"
                    />
                  </div>

                  {/* Stat card — top right */}
                  <div
                    className="absolute -top-2 -right-2 md:-right-6 flex items-center gap-3 rounded-2xl bg-card/95 backdrop-blur px-4 py-3 shadow-xl shadow-primary/10 border border-primary/10 animate-card-bob motion-reduce:animate-none"
                    style={{ animationDelay: "-2s" }}
                  >
                    <div className="w-9 h-9 rounded-xl bg-accent/40 flex items-center justify-center">
                      <Wallet size={16} className="text-primary" strokeWidth={2} />
                    </div>
                    <div className="leading-tight">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Skatt spart</p>
                      <p className="text-sm font-bold text-foreground">kr 127K</p>
                    </div>
                  </div>

                  {/* Stat card — bottom left */}
                  <div
                    className="absolute -bottom-2 -left-2 md:-left-6 flex items-center gap-3 rounded-2xl bg-card/95 backdrop-blur px-4 py-3 shadow-xl shadow-primary/10 border border-primary/10 animate-card-bob motion-reduce:animate-none"
                    style={{ animationDelay: "-4.5s" }}
                  >
                    <div className="w-9 h-9 rounded-xl bg-accent/40 flex items-center justify-center">
                      <TrendingUp size={16} className="text-primary" strokeWidth={2} />
                    </div>
                    <div className="leading-tight">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Vekst</p>
                      <p className="text-sm font-bold text-foreground">+42%</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>

          {/* Scroll incentive — centered relative to the full hero section */}
          <motion.div
            onClick={() => window.scrollTo({ top: window.innerHeight * 0.85, behavior: "smooth" })}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            role="button"
            tabIndex={0}
            aria-label={t("hero.scroll")}
            className="hidden md:flex flex-col items-center justify-center w-full mt-10 text-[10px] tracking-[0.25em] uppercase text-muted-foreground hover:text-primary transition-colors group cursor-pointer"
          >
            <span className="relative flex h-6 w-3.5 items-start justify-center rounded-full border border-primary/40 group-hover:border-primary transition-colors mb-2">
              <span className="mt-1 block h-1 w-1 rounded-full bg-primary animate-scroll-dot" />
            </span>
            <span className="font-semibold">{t("hero.scroll")}</span>
          </motion.div>
        </div>
      </section>

      {/* ═══ TRUST BAR ═══ */}
      <section className="relative -mt-8 md:-mt-14 z-20 pb-8 md:pb-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            {[
              { icon: Shield, label: t("trust.1.label"), sub: t("trust.1.sub") },
              { icon: Clock, label: t("trust.2.label"), sub: t("trust.2.sub") },
              { icon: CheckCircle2, label: t("trust.3.label"), sub: t("trust.3.sub") },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.12, duration: 0.6, ease: "easeOut" }}
                whileHover={{ y: -3 }}
                className="group flex items-center gap-3 rounded-full bg-card/95 backdrop-blur-sm shadow-lg shadow-primary/5 border border-border/60 pl-2 pr-5 py-2 hover:border-primary/30 hover:shadow-primary/10 transition-all duration-300"
              >
                <div className="w-9 h-9 rounded-full bg-accent/30 border border-accent/40 flex items-center justify-center shrink-0 group-hover:bg-primary/10 group-hover:border-primary/30 transition-colors">
                  <item.icon size={15} className="text-primary" strokeWidth={1.75} />
                </div>
                <div className="leading-tight">
                  <p className="text-[13px] font-semibold text-foreground">{item.label}</p>
                  <p className="text-[10.5px] text-muted-foreground font-medium">{item.sub}</p>
                </div>
              </motion.div>
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
              {t("value.title.a")} <span className="text-gradient-rose">Avargo</span>{t("value.title.b")}
            </h2>
            <p className="text-sm md:text-base text-muted-foreground">
              {t("value.sub")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: Layers,
                title: t("value.1.title"),
                desc: t("value.1.desc"),
                image: hubPartner,
              },
              {
                icon: BadgeCheck,
                title: t("value.2.title"),
                desc: t("value.2.desc"),
                image: hubFastpris,
              },
              {
                icon: HeartHandshake,
                title: t("value.3.title"),
                desc: t("value.3.desc"),
                image: hubTeam,
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.7, ease: "easeOut" }}
                whileHover={{ y: -6 }}
                className="group rounded-xl bg-background border border-border/20 shadow-sm hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-500 overflow-hidden"
              >
                <div className="aspect-[4/3] w-full overflow-hidden relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    width={1024}
                    height={768}
                    className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                    style={{ filter: "saturate(0.7) hue-rotate(-8deg) contrast(0.98)" }}
                  />
                  <div className="absolute inset-0 bg-primary/15 mix-blend-multiply pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-sage/10 pointer-events-none" />
                </div>
                <div className="p-6 md:p-8">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center mb-5 group-hover:bg-primary/15 transition-colors">
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
              {t("cta.title")}
            </h2>
            <p className="text-sm md:text-base text-muted-foreground mb-8 md:mb-12 max-w-md mx-auto">
              {t("cta.sub")}
            </p>
            <Link
              to="/kontakt"
              className="group inline-flex items-center gap-2 px-5 py-2.5 text-[12.5px] font-medium rounded-full border border-border text-foreground/85 hover:border-foreground hover:text-foreground tracking-wide transition-all duration-300"
            >
              {t("cta.button")}
              <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Hub;
