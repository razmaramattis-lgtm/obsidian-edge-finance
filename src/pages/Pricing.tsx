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
const BASE_PRICE = 1950;

const companyForms = [
  { key: "AS", label: "AS", desc: "Aksjeselskap", addon: 0 },
  { key: "ENK", label: "ENK", desc: "Enkeltpersonforetak", addon: 0 },
];

const industries = [
  { key: "tjeneste", label: "Tjenesteyting" },
  { key: "varehandel", label: "Varehandel" },
  { key: "nettbutikk", label: "Nettbutikk" },
  { key: "bygg", label: "Bygg og anlegg" },
  { key: "industri", label: "Industri" },
  { key: "eiendom", label: "Eiendom" },
  { key: "it", label: "IT og teknologi" },
  { key: "bruktbil", label: "Bruktbil" },
  { key: "helse", label: "Helse" },
  { key: "restaurant", label: "Restaurant og kafé" },
  { key: "transport", label: "Transport" },
  { key: "landbruk", label: "Landbruk" },
  { key: "kultur", label: "Kultur og media" },
  { key: "utdanning", label: "Utdanning og kurs" },
  { key: "annet", label: "Annet" },
];

// Revenue as a continuous slider. Values in NOK. > 5 000 000 triggers "custom offer" flow.
const REVENUE_MIN = 0;
const REVENUE_MAX = 5_000_000;
const REVENUE_STEP = 100_000;
const REVENUE_CUSTOM = REVENUE_MAX + REVENUE_STEP; // 5,1 mill = custom-tilbud flagg

// Continuous pricing based on revenue (only counts up to 5 mill.)
const priceFromRevenue = (nok: number) => {
  const v = Math.min(nok, REVENUE_MAX);
  if (v <= 500_000) return 0;
  if (v <= 2_000_000) return 400;
  if (v <= 3_500_000) return 900;
  return 1400;
};

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
  const [revenue, setRevenue] = useState<number>(500_000); // NOK
  const [bilag, setBilag] = useState<number>(0);
  const [payslips, setPayslips] = useState<number>(0);
  const [aarsoppgjor, setAarsoppgjor] = useState<boolean>(false);

  // Step 6 form fields
  const [contactCompany, setContactCompany] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isCustomOffer = revenue >= REVENUE_CUSTOM;

  const revenueLabel = useMemo(() => {
    if (isCustomOffer) return "5 mill.+ (skreddersydd tilbud)";
    return `${revenue.toLocaleString("nb-NO")} kr`;
  }, [revenue, isCustomOffer]);

  const price = useMemo(() => {
    let p = BASE_PRICE;
    p += priceFromRevenue(revenue);
    p += bilagTiers[bilag]?.addon ?? 0;
    p += payslips * PER_PAYSLIP;
    if (aarsoppgjor) p += AARSOPPGJOR;
    return p;
  }, [revenue, bilag, payslips, aarsoppgjor]);

  const contactValid =
    contactCompany.trim().length > 1 &&
    contactPhone.trim().length > 3 &&
    /^\S+@\S+\.\S+$/.test(contactEmail.trim());

  const canNext =
    (step === 1 && !!form) ||
    (step === 2 && !!industry) ||
    step === 3 ||
    step === 4 ||
    step === 5;

  const goNext = () => setStep((s) => Math.min(6, s + 1));
  const goBack = () => setStep((s) => Math.max(1, s - 1));

  const pageTitle = "Priser | Fastpris fra 1 950 kr/mnd — Avargo";
  const pageDesc =
    "Fastpris på regnskap fra 1 950 kr/mnd hos Avargo. Ingen skjulte tillegg. Bokføring, MVA, lønn, årsregnskap og rådgivning — alt inkludert.";
  const pageUrl = `https://avargo.no${sectionPath}/priser`;

  const submitOffer = async () => {
    if (!contactValid || submitting) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const summaryLines = [
        `Selskapsform: ${form ?? "—"}`,
        `Bransje: ${industries.find((i) => i.key === industry)?.label ?? "—"}`,
        `Årlig omsetning: ${revenueLabel}`,
        `Bilag/mnd: ${bilagTiers[bilag]?.label ?? "—"}`,
        `Lønnsslipper/mnd: ${payslips}`,
        `Årsoppgjør: ${aarsoppgjor ? "Ja" : "Nei"}`,
        `${isCustomOffer ? "Kunde ønsker skreddersydd tilbud (omsetning > 5 mill.)" : `Estimert fastpris: ${price.toLocaleString("nb-NO")} kr/mnd`}`,
      ].join("\n");
      const fullMessage =
        `Prisforespørsel fra prisvurderingskalkulator\n\n${summaryLines}\n\n` +
        `Kundens melding:\n${contactMessage.trim() || "(Ingen melding)"}`;
      const { error } = await supabase.functions.invoke("contact-submit", {
        body: {
          contact_person: contactCompany.trim().slice(0, 160),
          company_name: contactCompany.trim().slice(0, 160),
          email: contactEmail.trim().toLowerCase().slice(0, 255),
          phone: contactPhone.trim().slice(0, 40),
          source: `pricing-calculator:${typeof window !== "undefined" ? window.location.pathname : ""}`,
          referrer: typeof document !== "undefined" ? document.referrer.slice(0, 500) : null,
          message: fullMessage.slice(0, 2000),
        },
      });
      if (error) throw error;
      setSubmitted(true);
    } catch (e) {
      console.error(e);
      setSubmitError("Noe gikk galt. Prøv igjen eller send e-post til kontakt@avargo.no");
    } finally {
      setSubmitting(false);
    }
  };

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
                  <span className="italic text-gradient-rose">1 950 kr/mnd</span>
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
                  {isCustomOffer ? "Skreddersydd tilbud" : step === 1 ? "Prisene starter fra" : "Din pris så langt"}
                </p>
                {isCustomOffer ? (
                  <div className="font-heading text-3xl md:text-4xl text-foreground mb-8">
                    Tilpasset tilbud
                  </div>
                ) : (
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
                )}

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

                    {/* Step 2: industry (dropdown) */}
                    {step === 2 && (
                      <>
                        <p className="text-lg font-medium text-foreground mb-2">2. Velg bransje</p>
                        <p className="text-sm text-foreground/60 font-light mb-6">
                          Velg hvilken bransje virksomheten din tilhører. Dette hjelper oss å tilpasse tilbudet.
                        </p>
                        <label className="text-xs uppercase tracking-[0.15em] text-foreground/50 font-medium">
                          Bransje
                        </label>
                        <select
                          value={industry}
                          onChange={(e) => setIndustry(e.target.value)}
                          className="mt-1.5 w-full px-4 py-3 text-sm rounded-xl bg-background/60 border border-border/50 text-foreground focus:outline-none focus:border-primary/60 transition-colors"
                        >
                          <option value="">Velg bransje …</option>
                          {industries.map((it) => (
                            <option key={it.key} value={it.key}>
                              {it.label}
                            </option>
                          ))}
                        </select>
                      </>
                    )}

                    {/* Step 3: revenue slider */}
                    {step === 3 && (
                      <>
                        <p className="text-lg font-medium text-foreground mb-2">3. Årlig omsetning</p>
                        <p className="text-sm text-foreground/60 font-light mb-6">
                          Dra prikken frem eller tilbake for å angi omtrentlig årlig omsetning.
                        </p>

                        <div className="flex items-baseline justify-between mb-3">
                          <span className="text-xs uppercase tracking-[0.15em] text-foreground/50 font-medium">
                            Omsetning
                          </span>
                          <span className="font-heading text-2xl text-foreground">
                            {isCustomOffer ? "5 mill.+" : `${(revenue / 1_000_000).toLocaleString("nb-NO", { maximumFractionDigits: 1 })} mill.`}
                          </span>
                        </div>

                        <input
                          type="range"
                          min={REVENUE_MIN}
                          max={REVENUE_CUSTOM}
                          step={REVENUE_STEP}
                          value={revenue}
                          onChange={(e) => setRevenue(Number(e.target.value))}
                          className="w-full accent-primary cursor-pointer"
                        />
                        <div className="flex justify-between text-[11px] text-foreground/50 font-light mt-2">
                          <span>0 kr</span>
                          <span>2,5 mill.</span>
                          <span>5 mill.+</span>
                        </div>

                        {isCustomOffer && (
                          <div className="mt-6 p-4 rounded-2xl bg-primary/8 border border-primary/25">
                            <p className="text-sm text-foreground leading-relaxed">
                              Omsetning over 5 mill. gir stor variasjon i behov. Trykk deg videre — så gir vi deg et <span className="font-medium">skreddersydd tilbud</span> basert på hva du faktisk trenger.
                            </p>
                          </div>
                        )}
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
                                className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all duration-300 ${
                                  active
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "border-border/60 bg-card/50 hover:border-primary/30 hover:bg-primary/5"
                                }`}
                              >
                                {t.label}
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
                          Hvor mange lønnsslipper kjører du per måned, og skal årsoppgjøret være inkludert?
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

                        <p className="text-xs uppercase tracking-[0.15em] text-foreground/50 font-medium mb-2">
                          Skal årsoppgjør inkluderes?
                        </p>
                        <div className="grid grid-cols-2 gap-2.5">
                          <button
                            type="button"
                            onClick={() => setAarsoppgjor(true)}
                            className={`px-4 py-4 rounded-xl border text-sm transition-all duration-300 ${
                              aarsoppgjor
                                ? "bg-primary text-primary-foreground border-primary"
                                : "border-border/60 bg-card/50 hover:border-primary/30 hover:bg-primary/5"
                            }`}
                          >
                            Ja
                          </button>
                          <button
                            type="button"
                            onClick={() => setAarsoppgjor(false)}
                            className={`px-4 py-4 rounded-xl border text-sm transition-all duration-300 ${
                              !aarsoppgjor
                                ? "bg-primary text-primary-foreground border-primary"
                                : "border-border/60 bg-card/50 hover:border-primary/30 hover:bg-primary/5"
                            }`}
                          >
                            Nei
                          </button>
                        </div>
                        <p className="text-xs text-foreground/50 font-light mt-3">
                          Årsregnskap, næringsoppgave og skattemelding.
                        </p>
                      </>
                    )}

                    {/* Step 6: summary + kontaktskjema */}
                    {step === 6 && !submitted && (
                      <>
                        <p className="text-lg font-medium text-foreground mb-2">6. Oppsummering</p>
                        <p className="text-sm text-foreground/60 font-light mb-6">
                          Fyll inn kontaktinfo, så sender vi deg et <span className="text-foreground">bekreftet, midlertidig tilbud</span> direkte fra Avargo. Prisen kan justeres <span className="text-foreground">ned</span> etter en gjennomgang ved onboarding.
                        </p>

                        <dl className="rounded-2xl border border-border/50 bg-card/40 divide-y divide-border/40 text-sm mb-5">
                          {[
                            ["Selskapsform", form ?? "—"],
                            ["Bransje", industries.find((i) => i.key === industry)?.label ?? "—"],
                            ["Årlig omsetning", revenueLabel],
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

                        <div className="p-5 rounded-2xl bg-primary/8 border border-primary/20 mb-6">
                          <p className="text-xs uppercase tracking-[0.15em] text-primary/80 font-medium mb-1">
                            {isCustomOffer ? "Skreddersydd tilbud" : "Midlertidig estimat"}
                          </p>
                          {isCustomOffer ? (
                            <p className="font-heading text-2xl md:text-3xl text-foreground">
                              Tilpasset tilbud
                            </p>
                          ) : (
                            <p className="font-heading text-3xl md:text-4xl text-foreground">
                              {price.toLocaleString("nb-NO")}{" "}
                              <span className="text-lg text-foreground/50 font-light">kr/mnd</span>
                            </p>
                          )}
                          <p className="text-xs text-foreground/60 font-light mt-2 leading-relaxed">
                            Endelig tilbud sendes fra <span className="text-foreground">kontakt@avargo.no</span> og kan justeres ned ved onboarding.
                          </p>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <label className="text-xs uppercase tracking-[0.15em] text-foreground/50 font-medium">
                              Firmanavn *
                            </label>
                            <input
                              type="text"
                              value={contactCompany}
                              onChange={(e) => setContactCompany(e.target.value)}
                              maxLength={160}
                              placeholder="F.eks. Bakeri AS"
                              className="mt-1.5 w-full px-4 py-3 text-sm rounded-xl bg-background/60 border border-border/50 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary/60 transition-colors"
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="text-xs uppercase tracking-[0.15em] text-foreground/50 font-medium">
                                Telefon *
                              </label>
                              <input
                                type="tel"
                                value={contactPhone}
                                onChange={(e) => setContactPhone(e.target.value)}
                                maxLength={40}
                                placeholder="+47 ..."
                                className="mt-1.5 w-full px-4 py-3 text-sm rounded-xl bg-background/60 border border-border/50 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary/60 transition-colors"
                              />
                            </div>
                            <div>
                              <label className="text-xs uppercase tracking-[0.15em] text-foreground/50 font-medium">
                                E-post *
                              </label>
                              <input
                                type="email"
                                value={contactEmail}
                                onChange={(e) => setContactEmail(e.target.value)}
                                maxLength={255}
                                placeholder="deg@firma.no"
                                className="mt-1.5 w-full px-4 py-3 text-sm rounded-xl bg-background/60 border border-border/50 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary/60 transition-colors"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-xs uppercase tracking-[0.15em] text-foreground/50 font-medium">
                              Melding (valgfri)
                            </label>
                            <textarea
                              value={contactMessage}
                              onChange={(e) => setContactMessage(e.target.value)}
                              maxLength={1000}
                              rows={3}
                              placeholder="Kort om selskapet, når du ønsker å bytte, eller spørsmål du lurer på …"
                              className="mt-1.5 w-full px-4 py-3 text-sm rounded-xl bg-background/60 border border-border/50 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary/60 transition-colors resize-none"
                            />
                          </div>
                        </div>

                        {submitError && (
                          <p className="mt-3 text-xs text-destructive">{submitError}</p>
                        )}
                      </>
                    )}

                    {step === 6 && submitted && (
                      <div className="py-4">
                        <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/25 flex items-center justify-center mb-5">
                          <CheckCircle2 size={26} className="text-primary" strokeWidth={1.5} />
                        </div>
                        <p className="font-heading text-2xl md:text-3xl mb-3">
                          Takk! Vi har mottatt forespørselen din.
                        </p>
                        <p className="text-sm text-foreground/70 font-light leading-relaxed mb-4">
                          Vi sender et <span className="text-foreground">bekreftet, midlertidig tilbud</span> til <span className="text-foreground">{contactEmail}</span> direkte fra <span className="text-foreground">kontakt@avargo.no</span>. Under onboardingen ser vi over volum og omfang sammen med deg, og prisen kan justeres <span className="text-foreground">ned</span> hvis det er grunnlag for det.
                        </p>
                        <div className="p-4 rounded-2xl border border-border/50 bg-card/40 text-sm">
                          <p className="text-foreground/60 font-light mb-1">Ditt midlertidige estimat</p>
                          <p className="font-heading text-2xl text-foreground">
                            {price.toLocaleString("nb-NO")}{" "}
                            <span className="text-base text-foreground/50 font-light">kr/mnd</span>
                          </p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Nav */}
                <div className="flex items-center gap-3 mt-8">
                  {step > 1 && !submitted && (
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
                  ) : !submitted ? (
                    <button
                      type="button"
                      onClick={submitOffer}
                      disabled={!contactValid || submitting}
                      className="group flex-1 inline-flex items-center justify-center gap-2 py-3.5 rounded-full bg-primary text-primary-foreground text-sm font-medium tracking-wider glow-rose hover:scale-[1.01] transition-all duration-500 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      <Send size={14} />
                      {submitting ? "Sender …" : "Send forespørsel"}
                    </button>
                  ) : (
                    <Link
                      to={`${sectionPath}/`}
                      className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 rounded-full border border-border/60 text-sm text-foreground/70 hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all"
                    >
                      Til forsiden
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
