import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Calculator, Building2, Users, FileText, Receipt, Shield, MessageCircle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";
import { Helmet } from "react-helmet-async";
import { useSection } from "@/contexts/SectionContext";

const companyForms = [
  { key: "ENK", label: "ENK", desc: "Enkeltpersonforetak" },
  { key: "AS", label: "AS", desc: "Aksjeselskap" },
  { key: "DA", label: "DA", desc: "Delt ansvar" },
  { key: "ANS", label: "ANS", desc: "Ansvarlig selskap" },
];

const includedServices = [
  {
    icon: Receipt,
    title: "Daglig bokføring",
    description: "Automatisk bankintegrasjon, bilagsregistrering og månedlig avstemming — uten tillegg i timen.",
  },
  {
    icon: FileText,
    title: "MVA & skatt",
    description: "MVA-melding, skatteberegning og oppfølging mot Skatteetaten og Brønnøysundregistrene.",
  },
  {
    icon: Users,
    title: "Lønn & HR",
    description: "Lønnskjøring, a-melding, feriepenger og sykefraværsoppfølging for deg og dine ansatte.",
  },
  {
    icon: Building2,
    title: "Årsregnskap",
    description: "Komplett årsavslutning, selvangivelse, næringsoppgave og offentlig rapportering.",
  },
  {
    icon: Calculator,
    title: "Økonomisk oversikt",
    description: "Månedsrapporter, nøkkeltall og likviditetsstyring slik at du alltid vet hvor du står.",
  },
  {
    icon: Shield,
    title: "Rådgivning & support",
    description: "Dedikert regnskapsfører, skatterådgivning og ubegrenset support — svar innen 24 timer.",
  },
];

const Pricing = () => {
  const [selectedForm, setSelectedForm] = useState<string | null>(null);
  const [hoverForm, setHoverForm] = useState<string | null>(null);
  const { isInSection, section } = useSection();
  const sectionPath = isInSection && section ? section.basePath : "";

  // Subtle entrance animation for the price
  const [displayedPrice, setDisplayedPrice] = useState(0);
  useEffect(() => {
    const target = 1999;
    const duration = 1200;
    const start = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayedPrice(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, []);

  const pageTitle = "Priser | Fastpris fra 1 999 kr/mnd — Avargo";
  const pageDesc = "Fastpris på regnskap fra 1 999 kr/mnd hos Avargo. Ingen skjulte tillegg. Bokføring, MVA, lønn, årsregnskap og rådgivning — alt inkludert.";
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
      </Helmet>

      {/* ── Hero: price + calculator ───────────────────── */}
      <section className="pt-10 pb-20 md:pt-16 md:pb-32 relative overflow-hidden">
        <div className="absolute inset-0 ambient-glow opacity-60" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-7xl mx-auto">
            {/* Left: copy */}
            <AnimatedSection>
              <div className="max-w-xl">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/8 text-primary text-[11px] font-medium tracking-[0.15em] uppercase mb-6">
                  Priser
                </span>
                <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] mb-6">
                  Fastpris fra <span className="italic text-gradient-rose">{displayedPrice.toLocaleString("nb-NO")} kr/mnd</span>
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
                    Fyll ut selskapsformen til høyre, så får du et estimat tilpasset bedriften din. Vi kommer tilbake med et endelig, uforpliktende tilbud så snart vi har sett på oversikten.
                  </p>
                </div>
              </div>
            </AnimatedSection>

            {/* Right: calculator card */}
            <AnimatedSection delay={0.15}>
              <motion.div
                className="relative rounded-[2rem] bg-card/90 backdrop-blur-xl border border-border/60 p-7 md:p-10 shadow-[0_24px_80px_-32px_hsl(20_14%_10%/_0.12)]"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.4 }}
              >
                <div className="absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

                <div className="flex items-center justify-between mb-6">
                  <span className="text-[11px] tracking-[0.25em] uppercase text-foreground/50 font-medium">Kalkulator</span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/8 text-secondary text-[11px] font-medium">
                    <Sparkles size={12} />
                    Fastpris
                  </span>
                </div>

                <p className="text-foreground/60 text-sm mb-2">Prisene starter fra</p>
                <div className="font-heading text-4xl md:text-5xl text-foreground mb-8">
                  {displayedPrice.toLocaleString("nb-NO")} kr/mnd
                </div>

                <div className="mb-8">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-foreground/80 font-medium">Steg 1 / 2</span>
                    <span className="text-foreground/50 text-xs">Velg selskapsform</span>
                  </div>
                  <div className="h-1.5 w-full bg-border/40 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary to-rose-glow rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: "50%" }}
                      transition={{ duration: 1, delay: 0.3 }}
                    />
                  </div>
                </div>

                <p className="text-lg font-medium text-foreground mb-4">1. Velg selskapsform</p>
                <p className="text-sm text-foreground/60 font-light mb-6">
                  Velg hvilken type selskap du har. Dette påvirker prisen og hvilke tjenester som er aktuelle for deg.
                </p>

                <div className="grid grid-cols-4 gap-3 mb-8">
                  {companyForms.map((form) => {
                    const active = selectedForm === form.key;
                    const hovered = hoverForm === form.key;
                    return (
                      <button
                        key={form.key}
                        type="button"
                        onClick={() => setSelectedForm(form.key)}
                        onMouseEnter={() => setHoverForm(form.key)}
                        onMouseLeave={() => setHoverForm(null)}
                        className={`relative flex flex-col items-center justify-center gap-1 py-4 rounded-2xl border transition-all duration-300 ${
                          active
                            ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                            : hovered
                              ? "border-primary/40 bg-primary/5"
                              : "border-border/60 bg-card/50 hover:border-primary/30"
                        }`}
                      >
                        <span className="text-sm font-semibold tracking-wide">{form.label}</span>
                      </button>
                    );
                  })}
                </div>

                <Link
                  to={selectedForm ? `${sectionPath}/kontakt?selskapsform=${selectedForm}` : `${sectionPath}/kontakt`}
                  className="group w-full inline-flex items-center justify-center gap-2 py-4 rounded-full bg-foreground text-background text-sm font-medium tracking-wider hover:bg-primary hover:text-primary-foreground transition-all duration-500"
                >
                  {selectedForm ? "Få tilbud for " + selectedForm : "Neste"}
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
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
                    "Årsregnskap og selvangivelse",
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
