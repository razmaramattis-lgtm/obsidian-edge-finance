import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Calculator,
  Building2,
  Users,
  FileText,
  Receipt,
  Shield,
  MessageCircle,
  Sparkles,
  Send,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";
import { Helmet } from "react-helmet-async";
import { useSection } from "@/contexts/SectionContext";
import { supabase } from "@/integrations/supabase/client";

// ── Pricing model ────────────────────────────────────────────
const BASE_PRICE = 1999;

const companyForms = [
  { key: "ENK", label: "ENK", desc: "Enkeltpersonforetak", addon: 0 },
  { key: "AS", label: "AS", desc: "Aksjeselskap", addon: 600 },
  { key: "DA", label: "DA", desc: "Delt ansvar", addon: 400 },
  { key: "ANS", label: "ANS", desc: "Ansvarlig selskap", addon: 400 },
];

const industries = [
  { key: "tjeneste", label: "Tjenesteyting", addon: 0 },
  { key: "varehandel", label: "Varehandel", addon: 400 },
  { key: "nettbutikk", label: "Nettbutikk", addon: 600 },
  { key: "bygg", label: "Bygg og anlegg", addon: 500 },
  { key: "industri", label: "Industri", addon: 600 },
  { key: "eiendom", label: "Eiendom", addon: 400 },
  { key: "it", label: "IT og teknologi", addon: 200 },
  { key: "bruktbil", label: "Bruktbil", addon: 800 },
  { key: "helse", label: "Helse", addon: 300 },
  { key: "restaurant", label: "Restaurant og kafé", addon: 700 },
  { key: "transport", label: "Transport", addon: 500 },
  { key: "annet", label: "Annet", addon: 200 },
];

const revenueTiers = [
  { key: "0", label: "0 – 500 000 kr", addon: 0 },
  { key: "1", label: "500 000 – 2 mill.", addon: 400 },
  { key: "2", label: "2 – 5 mill.", addon: 900 },
  { key: "3", label: "5 – 10 mill.", addon: 1500 },
  { key: "4", label: "10 mill.+", addon: 2500 },
];

const bilagTiers = [
  { key: "0", label: "0 – 20 bilag", addon: 0 },
  { key: "1", label: "21 – 50 bilag", addon: 500 },
  { key: "2", label: "51 – 100 bilag", addon: 1200 },
  { key: "3", label: "101 – 200 bilag", addon: 2000 },
  { key: "4", label: "200+ bilag", addon: 3000 },
];

const PER_PAYSLIP = 150;
const AARSOPPGJOR = 714;

const includedServices = [
  { icon: Receipt, title: "Daglig bokføring", description: "Automatisk bankintegrasjon, bilagsregistrering og månedlig avstemming — uten tillegg i timen." },
  { icon: FileText, title: "MVA & skatt", description: "MVA-melding, skatteberegning og oppfølging mot Skatteetaten og Brønnøysundregistrene." },
  { icon: Users, title: "Lønn & HR", description: "Lønnskjøring, a-melding, feriepenger og sykefraværsoppfølging for deg og dine ansatte." },
  { icon: Building2, title: "Årsregnskap", description: "Komplett årsavslutning, selvangivelse, næringsoppgave og offentlig rapportering." },
  { icon: Calculator, title: "Økonomisk oversikt", description: "Månedsrapporter, nøkkeltall og likviditetsstyring slik at du alltid vet hvor du står." },
  { icon: Shield, title: "Rådgivning & support", description: "Dedikert regnskapsfører, skatterådgivning og ubegrenset support — rask respons på hverdager." },
];

// ── Component ─────────────────────────────────────────────────
const Pricing = () => {
  const { isInSection, section } = useSection();
  const sectionPath = isInSection && section ? section.basePath : "";

  const [step, setStep] = useState(1);
  const [form, setForm] = useState<string | null>(null);
  const [industry, setIndustry] = useState<string>("");
  const [revenue, setRevenue] = useState<number>(0);
  const [bilag, setBilag] = useState<number>(0);
  const [payslips, setPayslips] = useState<number>(0);
  const [aarsoppgjor, setAarsoppgjor] = useState<boolean>(false);

  const price = useMemo(() => {
    let p = BASE_PRICE;
    p += companyForms.find((c) => c.key === form)?.addon ?? 0;
    p += industries.find((i) => i.key === industry)?.addon ?? 0;
    p += revenueTiers[revenue]?.addon ?? 0;
    p += bilagTiers[bilag]?.addon ?? 0;
    p += payslips * PER_PAYSLIP;
    if (aarsoppgjor) p += AARSOPPGJOR;
    return p;
  }, [form, industry, revenue, bilag, payslips, aarsoppgjor]);

  const canNext =
    (step === 1 && !!form) ||
    (step === 2 && !!industry) ||
    step === 3 ||
    step === 4 ||
    step === 5 ||
    step === 6;

  const goNext = () => setStep((s) => Math.min(6, s + 1));
  const goBack = () => setStep((s) => Math.max(1, s - 1));

  const pageTitle = "Priser | Fastpris fra 1 999 kr/mnd — Avargo";
  const pageDesc =
    "Fastpris på regnskap fra 1 999 kr/mnd hos Avargo. Ingen skjulte tillegg. Bokføring, MVA, lønn, årsregnskap og rådgivning — alt inkludert.";
  const pageUrl = `https://avargo.no${sectionPath}/priser`;

  const summaryParams = new URLSearchParams({
    selskapsform: form ?? "",
    bransje: industries.find((i) => i.key === industry)?.label ?? "",
    omsetning: revenueTiers[revenue]?.label ?? "",
    bilag: bilagTiers[bilag]?.label ?? "",
    lonn: String(payslips),
    aarsoppgjor: aarsoppgjor ? "Ja" : "Nei",
    estimat: String(price),
  }).toString();

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

      {/* ── Hero + calculator ─────────────────────────── */}
      <section className="pt-10 pb-20 md:pt-16 md:pb-28 relative overflow-hidden">
        <div className="absolute inset-0 ambient-glow opacity-60" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start max-w-7xl mx-auto">
            {/* Left: copy */}
            <AnimatedSection>
              <div className="max-w-xl lg:sticky lg:top-28">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/8 text-primary text-[11px] font-medium tracking-[0.15em] uppercase mb-6">
                  Priser
                </span>
                <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] mb-6">
                  Fastpris fra{" "}
                  <span className="italic text-gradient-rose">1 999 kr/mnd</span>
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
                    Fyll ut stegene, så får du et estimat tilpasset bedriften din. Vi kommer tilbake med et endelig, uforpliktende tilbud så snart vi har sett på oversikten.
                  </p>
                </div>
              </div>
            </AnimatedSection>

            {/* Right: calculator */}
            <AnimatedSection delay={0.15}>
              <motion.div
                className="relative rounded-[2rem] bg-card/90 backdrop-blur-xl border border-border/60 p-7 md:p-10 shadow-[0_24px_80px_-32px_hsl(20_14%_10%/_0.12)]"
                transition={{ duration: 0.4 }}
              >
                <div className="absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

                <div className="flex items-center justify-between mb-6">
                  <span className="text-[11px] tracking-[0.25em] uppercase text-foreground/50 font-medium">
                    Kalkulator
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/8 text-secondary text-[11px] font-medium">
                    <Sparkles size={12} />
                    Fastpris
                  </span>
                </div>

                <p className="text-foreground/60 text-sm mb-2">
                  {step === 1 ? "Prisene starter fra" : "Din pris så langt"}
                </p>
                <div className="font-heading text-4xl md:text-5xl text-foreground mb-8 flex items-baseline gap-3">
                  <motion.span
                    key={price}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                  >
                    {price.toLocaleString("nb-NO")}
                  </motion.span>
                  <span className="text-lg md:text-xl text-foreground/50 font-light">kr/mnd</span>
                </div>

                {/* Progress */}
                <div className="mb-8">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-foreground/80 font-medium">Steg {step} / 6</span>
                    <span className="text-foreground/50 text-xs">
                      {["Selskapsform", "Bransje", "Årlig omsetning", "Antall bilag", "Lønn & årsoppgjør", "Oppsummering"][step - 1]}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-border/40 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary to-rose-glow rounded-full"
                      animate={{ width: `${(step / 6) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.25 }}
                  >
                    {/* Step 1: company form */}
                    {step === 1 && (
                      <>
                        <p className="text-lg font-medium text-foreground mb-2">1. Velg selskapsform</p>
                        <p className="text-sm text-foreground/60 font-light mb-6">
                          Velg hvilken type selskap du har. Dette påvirker prisen og hvilke tjenester som er aktuelle for deg.
                        </p>
                        <div className="grid grid-cols-4 gap-3 mb-2">
                          {companyForms.map((f) => {
                            const active = form === f.key;
                            return (
                              <button
                                key={f.key}
                                type="button"
                                onClick={() => setForm(f.key)}
                                className={`flex flex-col items-center justify-center gap-1 py-4 rounded-2xl border transition-all duration-300 ${
                                  active
                                    ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                                    : "border-border/60 bg-card/50 hover:border-primary/30 hover:bg-primary/5"
                                }`}
                              >
                                <span className="text-sm font-semibold tracking-wide">{f.label}</span>
                              </button>
                            );
                          })}
                        </div>
                        {form && (
                          <p className="text-xs text-foreground/50 font-light mt-3">
                            {companyForms.find((c) => c.key === form)?.desc}
                          </p>
                        )}
                      </>
                    )}

                    {/* Step 2: industry */}
                    {step === 2 && (
                      <>
                        <p className="text-lg font-medium text-foreground mb-2">2. Velg bransje</p>
                        <p className="text-sm text-foreground/60 font-light mb-6">
                          Velg hvilken bransje virksomheten din tilhører. Dette hjelper oss å gi deg en mer nøyaktig pris.
                        </p>
                        <div className="grid grid-cols-2 gap-2.5">
                          {industries.map((it) => {
                            const active = industry === it.key;
                            return (
                              <button
                                key={it.key}
                                type="button"
                                onClick={() => setIndustry(it.key)}
                                className={`text-left px-4 py-3 rounded-xl border text-sm transition-all duration-300 ${
                                  active
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "border-border/60 bg-card/50 hover:border-primary/30 hover:bg-primary/5"
                                }`}
                              >
                                {it.label}
                              </button>
                            );
                          })}
                        </div>
                      </>
                    )}

                    {/* Step 3: revenue */}
                    {step === 3 && (
                      <>
                        <p className="text-lg font-medium text-foreground mb-2">3. Årlig omsetning</p>
                        <p className="text-sm text-foreground/60 font-light mb-6">
                          Velg hvor mye virksomheten din omsetter for i året. Dette påvirker prisen.
                        </p>
                        <div className="space-y-2.5">
                          {revenueTiers.map((t, i) => {
                            const active = revenue === i;
                            return (
                              <button
                                key={t.key}
                                type="button"
                                onClick={() => setRevenue(i)}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm transition-all duration-300 ${
                                  active
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "border-border/60 bg-card/50 hover:border-primary/30 hover:bg-primary/5"
                                }`}
                              >
                                <span>{t.label}</span>
                                {t.addon > 0 && (
                                  <span className={`text-xs ${active ? "text-primary-foreground/80" : "text-foreground/50"}`}>
                                    +{t.addon.toLocaleString("nb-NO")} kr
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </>
                    )}

                    {/* Step 4: bilag */}
                    {step === 4 && (
                      <>
                        <p className="text-lg font-medium text-foreground mb-2">4. Antall bilag per måned</p>
                        <p className="text-sm text-foreground/60 font-light mb-6">
                          Hvor mange bilag (fakturaer, kvitteringer, transaksjoner) har du per måned?
                        </p>
                        <div className="space-y-2.5">
                          {bilagTiers.map((t, i) => {
                            const active = bilag === i;
                            return (
                              <button
                                key={t.key}
                                type="button"
                                onClick={() => setBilag(i)}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm transition-all duration-300 ${
                                  active
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "border-border/60 bg-card/50 hover:border-primary/30 hover:bg-primary/5"
                                }`}
                              >
                                <span>{t.label}</span>
                                {t.addon > 0 && (
                                  <span className={`text-xs ${active ? "text-primary-foreground/80" : "text-foreground/50"}`}>
                                    +{t.addon.toLocaleString("nb-NO")} kr
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </>
                    )}

                    {/* Step 5: payroll + year-end */}
                    {step === 5 && (
                      <>
                        <p className="text-lg font-medium text-foreground mb-2">5. Lønn og årsoppgjør</p>
                        <p className="text-sm text-foreground/60 font-light mb-6">
                          Skriv inn hvor mange lønnsslipper du har per måned. Vi legger til {PER_PAYSLIP} kr per slipp.
                        </p>

                        <label className="text-xs uppercase tracking-[0.15em] text-foreground/50 font-medium">
                          Lønnsslipper per måned
                        </label>
                        <div className="flex items-center gap-3 mt-2 mb-6">
                          <button
                            type="button"
                            onClick={() => setPayslips((n) => Math.max(0, n - 1))}
                            className="w-11 h-11 rounded-full border border-border/60 bg-card/50 hover:border-primary/40 hover:bg-primary/5 flex items-center justify-center text-lg"
                          >
                            −
                          </button>
                          <input
                            type="number"
                            min={0}
                            value={payslips}
                            onChange={(e) => setPayslips(Math.max(0, Number(e.target.value) || 0))}
                            className="flex-1 text-center text-xl font-medium bg-card/50 border border-border/60 rounded-xl py-2.5 focus:outline-none focus:border-primary/50"
                          />
                          <button
                            type="button"
                            onClick={() => setPayslips((n) => n + 1)}
                            className="w-11 h-11 rounded-full border border-border/60 bg-card/50 hover:border-primary/40 hover:bg-primary/5 flex items-center justify-center text-lg"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => setAarsoppgjor((v) => !v)}
                          className={`w-full flex items-center justify-between px-4 py-4 rounded-xl border text-sm transition-all duration-300 ${
                            aarsoppgjor
                              ? "bg-primary text-primary-foreground border-primary"
                              : "border-border/60 bg-card/50 hover:border-primary/30 hover:bg-primary/5"
                          }`}
                        >
                          <span className="text-left">
                            Ja, inkluder årsoppgjør
                            <span className={`block text-xs mt-0.5 ${aarsoppgjor ? "text-primary-foreground/70" : "text-foreground/50"}`}>
                              Årsregnskap, næringsoppgave og skattemelding
                            </span>
                          </span>
                          <span className="text-xs shrink-0">+{AARSOPPGJOR} kr/mnd</span>
                        </button>
                      </>
                    )}

                    {/* Step 6: summary */}
                    {step === 6 && (
                      <>
                        <p className="text-lg font-medium text-foreground mb-2">6. Oppsummering</p>
                        <p className="text-sm text-foreground/60 font-light mb-6">
                          Sjekk over og send oss en henvendelse — vi kommer tilbake med et nøyaktig tilbud.
                        </p>

                        <dl className="rounded-2xl border border-border/50 bg-card/40 divide-y divide-border/40 text-sm mb-6">
                          {[
                            ["Selskapsform", form ?? "—"],
                            ["Bransje", industries.find((i) => i.key === industry)?.label ?? "—"],
                            ["Årlig omsetning", revenueTiers[revenue]?.label ?? "—"],
                            ["Bilag / mnd", bilagTiers[bilag]?.label ?? "—"],
                            ["Lønnsslipper / mnd", String(payslips)],
                            ["Årsoppgjør", aarsoppgjor ? "Ja" : "Nei"],
                          ].map(([k, v]) => (
                            <div key={k} className="flex items-center justify-between px-4 py-3">
                              <dt className="text-foreground/60 font-light">{k}</dt>
                              <dd className="font-medium text-foreground">{v}</dd>
                            </div>
                          ))}
                        </dl>

                        <div className="p-5 rounded-2xl bg-primary/8 border border-primary/20 mb-2">
                          <p className="text-xs uppercase tracking-[0.15em] text-primary/80 font-medium mb-1">
                            Ditt estimat
                          </p>
                          <p className="font-heading text-3xl md:text-4xl text-foreground">
                            {price.toLocaleString("nb-NO")} <span className="text-lg text-foreground/50 font-light">kr/mnd</span>
                          </p>
                          <p className="text-xs text-foreground/50 font-light mt-2">
                            Endelig tilbud justeres etter en kort gjennomgang.
                          </p>
                        </div>
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Nav */}
                <div className="flex items-center gap-3 mt-8">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={goBack}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-border/60 text-sm text-foreground/70 hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all"
                    >
                      <ArrowLeft size={14} />
                      Tilbake
                    </button>
                  )}
                  {step < 6 ? (
                    <button
                      type="button"
                      onClick={goNext}
                      disabled={!canNext}
                      className="group flex-1 inline-flex items-center justify-center gap-2 py-3.5 rounded-full bg-foreground text-background text-sm font-medium tracking-wider hover:bg-primary hover:text-primary-foreground transition-all duration-500 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-foreground disabled:hover:text-background"
                    >
                      Neste
                      <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  ) : (
                    <Link
                      to={`${sectionPath}/kontakt?${summaryParams}`}
                      className="group flex-1 inline-flex items-center justify-center gap-2 py-3.5 rounded-full bg-primary text-primary-foreground text-sm font-medium tracking-wider glow-rose hover:scale-[1.01] transition-all duration-500"
                    >
                      <Send size={14} />
                      Send oversikt
                    </Link>
                  )}
                </div>
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
