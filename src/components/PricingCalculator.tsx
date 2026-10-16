import { useState, useMemo, useId, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft, Sparkles, Send, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSection } from "@/contexts/SectionContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

const PAYROLL_ADDON = 100;
const PAYROLL_EMPLOYEE_LIMIT = 5;
const AARSOPPGJOR = 714;

const PricingCalculator = ({ embedded = false }: { embedded?: boolean }) => {
  const id = useId();
  const { isInSection, section } = useSection();
  const sectionPath = isInSection && section ? section.basePath : "";
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<string | null>(null);
  const [industry, setIndustry] = useState<string>("");
  const [revenue, setRevenue] = useState<number>(500_000); // NOK
  const [bilag, setBilag] = useState<number>(0);
  const [payslips, setPayslips] = useState<number>(0);
  const [aarsoppgjor, setAarsoppgjor] = useState<boolean>(false);

  // Contact fields (step 1)
  const [contactCompany, setContactCompany] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const leadIdRef = useRef<Promise<string | null> | null>(null);

  const isCustomOffer = revenue >= REVENUE_CUSTOM || payslips > PAYROLL_EMPLOYEE_LIMIT;

  const revenueLabel = useMemo(() => {
    if (revenue >= REVENUE_CUSTOM) return "5 mill.+ (skreddersydd tilbud)";
    return `${revenue.toLocaleString("nb-NO")} kr`;
  }, [revenue]);

  const price = useMemo(() => {
    let p = BASE_PRICE;
    p += priceFromRevenue(revenue);
    p += bilagTiers[bilag]?.addon ?? 0;
    if (payslips > 0 && payslips <= PAYROLL_EMPLOYEE_LIMIT) p += PAYROLL_ADDON;
    if (aarsoppgjor) p += AARSOPPGJOR;
    return p;
  }, [revenue, bilag, payslips, aarsoppgjor]);

  const contactValid =
    contactCompany.trim().length > 1 &&
    contactPhone.trim().length > 3 &&
    /^\S+@\S+\.\S+$/.test(contactEmail.trim());

  const canNext =
    (step === 1 && contactValid) ||
    (step === 2 && !!form) ||
    (step === 3 && !!industry) ||
    step === 4 ||
    step === 5 ||
    step === 6;

  const goNext = () => setStep((s) => Math.min(7, s + 1));

  const pagePath = typeof window !== "undefined" ? window.location.pathname : "";

  const contactBody = () => ({
    contact_person: contactCompany.trim().slice(0, 160),
    company_name: contactCompany.trim().slice(0, 160),
    email: contactEmail.trim().toLowerCase().slice(0, 255),
    phone: contactPhone.trim().slice(0, 40),
    referrer: typeof document !== "undefined" ? document.referrer.slice(0, 500) : null,
  });

  // Saves the lead as soon as contact details are entered, so it is kept even
  // if the visitor stops here. The returned id lets the later summary update
  // the same inquiry instead of creating a second one.
  const startLead = () => {
    if (!contactValid) return;
    if (!leadIdRef.current) {
      leadIdRef.current = supabase.functions
        .invoke("contact-submit", {
          body: {
            ...contactBody(),
            source: `pricing-calculator-start:${pagePath}`,
            message: "Startet priskalkulator (har ikke sett prisen ennå)",
          },
        })
        .then(({ data, error }) => {
          if (error) throw error;
          return (data?.submission_id as string | undefined) ?? null;
        })
        .catch((e) => {
          console.error(e);
          return null;
        });
    }
    goNext();
  };
  const goBack = () => setStep((s) => Math.max(1, s - 1));

  const buildSummary = (heading: string) => {
    const summaryLines = [
      `Selskapsform: ${form ?? "—"}`,
      `Bransje: ${industries.find((i) => i.key === industry)?.label ?? "—"}`,
      `Årlig omsetning: ${revenueLabel}`,
      `Bilag/mnd: ${bilagTiers[bilag]?.label ?? "—"}`,
      `Antall ansatte: ${payslips}`,
      `Årsoppgjør: ${aarsoppgjor ? "Ja" : "Nei"}`,
      `${isCustomOffer ? `Kunde ønsker skreddersydd tilbud (${[revenue >= REVENUE_CUSTOM ? "omsetning > 5 mill." : "", payslips > PAYROLL_EMPLOYEE_LIMIT ? "flere enn 5 ansatte" : ""].filter(Boolean).join(", ")})` : `Pris vist til kunden: ${price.toLocaleString("nb-NO")} kr/mnd eks. mva`}`,
    ].join("\n");
    return `${heading}\n\n${summaryLines}\n\nKundens melding:\n${contactMessage.trim() || "(Ingen melding)"}`;
  };

  const sendSummary = async (source: string, heading: string) => {
    // Wait briefly for the step 1 save. If it is slow or failed, send anyway as
    // a new inquiry rather than leaving the visitor waiting.
    const submissionId = leadIdRef.current
      ? await Promise.race([
          leadIdRef.current,
          new Promise<null>((resolve) => setTimeout(() => resolve(null), 4000)),
        ])
      : null;
    const { data, error } = await supabase.functions.invoke("contact-submit", {
      body: {
        ...contactBody(),
        submission_id: submissionId,
        source: `${source}:${pagePath}`,
        message: buildSummary(heading).slice(0, 2000),
      },
    });
    if (error) throw error;
    if (data?.submission_id) leadIdRef.current = Promise.resolve(data.submission_id as string);
  };

  // Step 6 → 7: the visitor now sees the price. Store the full answers and the
  // price on the lead right away, whether or not they press "Send forespørsel".
  const showPrice = () => {
    goNext();
    sendSummary("pricing-calculator-price", "Kunden har sett prisen i kalkulatoren").catch((e) => console.error(e));
  };

  const submitOffer = async () => {
    if (submitting) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await sendSummary("pricing-calculator", "Kunden ber om gjennomgang av tilbudet");
      setSubmitted(true);
    } catch (e) {
      console.error(e);
      setSubmitError("Noe gikk galt. Prøv igjen eller send e-post til kontakt@avargo.no");
    } finally {
      setSubmitting(false);
    }
  };

  return (
              <motion.div
                className={cn("relative rounded-[2rem] bg-card/90 backdrop-blur-xl border border-border/60 p-7 md:p-10 shadow-lg", embedded && "rounded-none border-0 bg-transparent p-0 md:p-0 shadow-none")}
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

                <div className="font-heading text-3xl md:text-4xl text-foreground mb-8">
                  Finn din fastpris
                </div>

                {/* Progress */}
                <div className="mb-8">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-foreground/80 font-medium">Steg {step} / 7</span>
                    <span className="text-foreground/50 text-xs">
                      {["Kontaktinfo", "Selskapsform", "Bransje", "Årlig omsetning", "Antall bilag", "Lønn & årsoppgjør", "Din pris"][step - 1]}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-border/40 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary to-rose-glow rounded-full"
                      animate={{ width: `${(step / 7) * 100}%` }}
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
                    {/* Step 1: contact info */}
                    {step === 1 && (
                      <>
                        <p className="text-lg font-medium text-foreground mb-2">1. Beregn din fastpris</p>
                        <p className="text-sm text-foreground/60 font-light mb-6">
                          Fyll inn kontaktinfo, så beregner vi prisen din med en gang – helt uforpliktende.
                        </p>
                        <div className="space-y-3">
                          <div>
                            <label htmlFor={`${id}-contactCompany`} className="text-xs uppercase tracking-[0.15em] text-foreground/50 font-medium">
                              Firmanavn *
                            </label>
                            <input
                              id={`${id}-contactCompany`}
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
                              <label htmlFor={`${id}-contactPhone`} className="text-xs uppercase tracking-[0.15em] text-foreground/50 font-medium">
                                Telefon *
                              </label>
                              <input
                                id={`${id}-contactPhone`}
                                type="tel"
                                value={contactPhone}
                                onChange={(e) => setContactPhone(e.target.value)}
                                maxLength={40}
                                placeholder="+47 ..."
                                className="mt-1.5 w-full px-4 py-3 text-sm rounded-xl bg-background/60 border border-border/50 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary/60 transition-colors"
                              />
                            </div>
                            <div>
                              <label htmlFor={`${id}-contactEmail`} className="text-xs uppercase tracking-[0.15em] text-foreground/50 font-medium">
                                E-post *
                              </label>
                              <input
                                id={`${id}-contactEmail`}
                                type="email"
                                value={contactEmail}
                                onChange={(e) => setContactEmail(e.target.value)}
                                maxLength={255}
                                placeholder="deg@firma.no"
                                className="mt-1.5 w-full px-4 py-3 text-sm rounded-xl bg-background/60 border border-border/50 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary/60 transition-colors"
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Step 2: company form */}
                    {step === 2 && (
                      <>
                        <p className="text-lg font-medium text-foreground mb-2">2. Velg selskapsform</p>
                        <p className="text-sm text-foreground/60 font-light mb-6">
                          Velg hvilken type selskap du har. Dette påvirker prisen og hvilke tjenester som er aktuelle for deg.
                        </p>
                        <div className="grid grid-cols-2 gap-3 mb-2">
                          {companyForms.map((f) => {
                            const active = form === f.key;
                            return (
                              <Button
                                key={f.key}
                                variant="ghost"
                                type="button"
                                onClick={() => setForm(f.key)}
                                className={`flex flex-col items-center justify-center gap-1 py-4 rounded-2xl border transition-all duration-300 ${
                                  active
                                    ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                                    : "border-border/60 bg-card/50 hover:border-primary/30 hover:bg-primary/5"
                                }`}
                              >
                                <span className="text-sm font-semibold tracking-wide">{f.label}</span>
                              </Button>
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
                    {step === 3 && (
                      <>
                        <p className="text-lg font-medium text-foreground mb-2">3. Velg bransje</p>
                        <p className="text-sm text-foreground/60 font-light mb-6">
                          Velg hvilken bransje virksomheten din tilhører. Dette hjelper oss å tilpasse tilbudet.
                        </p>
                        <label htmlFor={`${id}-industry`} className="text-xs uppercase tracking-[0.15em] text-foreground/50 font-medium">
                          Bransje
                        </label>
                        <select
                          id={`${id}-industry`}
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
                    {step === 4 && (
                      <>
                        <p className="text-lg font-medium text-foreground mb-2">4. Årlig omsetning</p>
                        <p className="text-sm text-foreground/60 font-light mb-6">
                          Dra prikken frem eller tilbake for å angi omtrentlig årlig omsetning.
                        </p>

                        <div className="flex items-baseline justify-between mb-3">
                          <span className="text-xs uppercase tracking-[0.15em] text-foreground/50 font-medium">
                            Omsetning
                          </span>
                          <span className="font-heading text-2xl text-foreground">
                            {revenue >= REVENUE_CUSTOM ? "5 mill.+" : `${(revenue / 1_000_000).toLocaleString("nb-NO", { maximumFractionDigits: 1 })} mill.`}
                          </span>
                        </div>

                        <input
                          id={`${id}-revenue`}
                          type="range"
                          min={REVENUE_MIN}
                          max={REVENUE_CUSTOM}
                          step={REVENUE_STEP}
                          value={revenue}
                          onChange={(e) => setRevenue(Number(e.target.value))}
                          aria-label="Årlig omsetning"
                          className="w-full accent-primary cursor-pointer"
                        />
                        <div className="flex justify-between text-[11px] text-foreground/50 font-light mt-2">
                          <span>0 kr</span>
                          <span>2,5 mill.</span>
                          <span>5 mill.+</span>
                        </div>

                        {revenue >= REVENUE_CUSTOM && (
                          <div className="mt-6 p-4 rounded-2xl bg-primary/8 border border-primary/25">
                            <p className="text-sm text-foreground leading-relaxed">
                              Omsetning over 5 mill. gir stor variasjon i behov. Trykk deg videre — så gir vi deg et <span className="font-medium">skreddersydd tilbud</span> basert på hva du faktisk trenger.
                            </p>
                          </div>
                        )}
                      </>
                    )}

                    {/* Step 4: bilag */}
                    {step === 5 && (
                      <>
                        <p className="text-lg font-medium text-foreground mb-2">5. Antall bilag per måned</p>
                        <p className="text-sm text-foreground/60 font-light mb-6">
                          Hvor mange bilag (fakturaer, kvitteringer, transaksjoner) har du per måned?
                        </p>
                        <div className="space-y-2.5">
                          {bilagTiers.map((t, i) => {
                            const active = bilag === i;
                            return (
                              <Button
                                key={t.key}
                                variant="ghost"
                                type="button"
                                onClick={() => setBilag(i)}
                                className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all duration-300 ${
                                  active
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "border-border/60 bg-card/50 hover:border-primary/30 hover:bg-primary/5"
                                }`}
                              >
                                {t.label}
                              </Button>
                            );
                          })}
                        </div>
                      </>
                    )}

                    {/* Step 5: payroll + year-end */}
                    {step === 6 && (
                      <>
                        <p className="text-lg font-medium text-foreground mb-2">6. Lønn og årsoppgjør</p>
                        <p className="text-sm text-foreground/60 font-light mb-6">
                          Hvor mange ansatte skal vi kjøre lønn for, og skal årsoppgjøret være inkludert?
                        </p>

                        <label htmlFor={`${id}-payslips`} className="text-xs uppercase tracking-[0.15em] text-foreground/50 font-medium">
                          Antall ansatte
                        </label>
                        <div className="flex items-center gap-3 mt-2 mb-6">
                          <Button
                            variant="ghost"
                                type="button"
                            onClick={() => setPayslips((n) => Math.max(0, n - 1))}
                            aria-label="Reduser antall ansatte"
                            className="w-11 h-11 rounded-full border border-border/60 bg-card/50 hover:border-primary/40 hover:bg-primary/5 flex items-center justify-center text-lg"
                          >
                            −
                          </Button>
                          <input
                            id={`${id}-payslips`}
                            type="number"
                            min={0}
                            step={1}
                            value={payslips}
                            onChange={(e) => setPayslips(Math.max(0, Math.floor(Number(e.target.value) || 0)))}
                            aria-label="Antall ansatte"
                            className="min-w-0 flex-1 text-center text-xl font-medium bg-card/50 border border-border/60 rounded-xl py-2.5 focus:outline-none focus:border-primary/50"
                          />
                          <Button
                            variant="ghost"
                                type="button"
                            onClick={() => setPayslips((n) => n + 1)}
                            aria-label="Øk antall ansatte"
                            className="w-11 h-11 rounded-full border border-border/60 bg-card/50 hover:border-primary/40 hover:bg-primary/5 flex items-center justify-center text-lg"
                          >
                            +
                          </Button>
                        </div>

                        <p className="text-xs uppercase tracking-[0.15em] text-foreground/50 font-medium mb-2">
                          Skal årsoppgjør inkluderes?
                        </p>
                        <div className="grid grid-cols-2 gap-2.5">
                          <Button
                            variant="ghost"
                                type="button"
                            onClick={() => setAarsoppgjor(true)}
                            className={`px-4 py-4 rounded-xl border text-sm transition-all duration-300 ${
                              aarsoppgjor
                                ? "bg-primary text-primary-foreground border-primary"
                                : "border-border/60 bg-card/50 hover:border-primary/30 hover:bg-primary/5"
                            }`}
                          >
                            Ja
                          </Button>
                          <Button
                            variant="ghost"
                                type="button"
                            onClick={() => setAarsoppgjor(false)}
                            className={`px-4 py-4 rounded-xl border text-sm transition-all duration-300 ${
                              !aarsoppgjor
                                ? "bg-primary text-primary-foreground border-primary"
                                : "border-border/60 bg-card/50 hover:border-primary/30 hover:bg-primary/5"
                            }`}
                          >
                            Nei
                          </Button>
                        </div>
                        <p className="text-xs text-foreground/50 font-light mt-3">
                          Årsregnskap, næringsoppgave og skattemelding.
                        </p>
                      </>
                    )}

                    {/* Step 7: price + summary */}
                    {step === 7 && !submitted && (
                      <>
                        <p className="text-lg font-medium text-foreground mb-4">7. Din pris</p>
                        <div className="p-5 rounded-2xl bg-primary/8 border border-primary/20 mb-5">
                          <p className="text-xs uppercase tracking-[0.15em] text-primary/80 font-medium mb-1">
                            {isCustomOffer ? "Skreddersydd tilbud" : "Din fastpris"}
                          </p>
                          {isCustomOffer ? (
                            <p className="font-heading text-3xl md:text-4xl text-foreground">Tilpasset tilbud</p>
                          ) : (
                            <motion.p
                              initial={{ opacity: 0, y: -6 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.35 }}
                              className="font-heading text-4xl md:text-5xl text-foreground"
                            >
                              {price.toLocaleString("nb-NO")}{" "}
                              <span className="text-lg md:text-xl text-foreground/50 font-light">kr/mnd (eks. mva)</span>
                            </motion.p>
                          )}
                        </div>

                        <dl className="rounded-2xl border border-border/50 bg-card/40 divide-y divide-border/40 text-sm mb-5">
                          {[
                            ["Firmanavn", contactCompany.trim() || "—"],
                            ["Selskapsform", form ?? "—"],
                            ["Bransje", industries.find((i) => i.key === industry)?.label ?? "—"],
                            ["Årlig omsetning", revenueLabel],
                            ["Bilag / mnd", bilagTiers[bilag]?.label ?? "—"],
                            ["Antall ansatte", String(payslips)],
                            ["Årsoppgjør", aarsoppgjor ? "Ja" : "Nei"],
                          ].map(([k, v]) => (
                            <div key={k} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
                              <dt className="text-foreground/60 font-light">{k}</dt>
                              <dd className="font-medium text-foreground">{v}</dd>
                            </div>
                          ))}
                        </dl>

                        <p className="text-sm text-foreground/60 font-light mb-5 leading-relaxed">
                          Vi tar kontakt for å gå gjennom tilbudet. Prisen kan justeres ned etter en gjennomgang ved onboarding.
                        </p>

                        <div className="space-y-3">
                          <div>
                            <label htmlFor={`${id}-contactMessage`} className="text-xs uppercase tracking-[0.15em] text-foreground/50 font-medium">
                              Melding (valgfri)
                            </label>
                            <textarea
                              id={`${id}-contactMessage`}
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

                    {step === 7 && submitted && (
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
                          <p className="text-foreground/60 font-light mb-1">
                            {isCustomOffer ? "Ditt tilbud" : "Ditt midlertidige estimat"}
                          </p>
                          {isCustomOffer ? (
                            <p className="font-heading text-2xl text-foreground">Skreddersydd tilbud</p>
                          ) : (
                            <p className="font-heading text-2xl text-foreground">
                              {price.toLocaleString("nb-NO")}{" "}
                              <span className="text-base text-foreground/50 font-light">kr/mnd</span>
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Nav */}
                <div className="flex items-center gap-3 mt-8">
                  {step > 1 && !submitted && (
                    <Button
                      variant="ghost"
                                type="button"
                      onClick={goBack}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-border/60 text-sm text-foreground/70 hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all"
                    >
                      <ArrowLeft size={14} />
                      Tilbake
                    </Button>
                  )}
                  {step < 7 ? (
                    <Button
                      variant="ghost"
                                type="button"
                      onClick={step === 1 ? startLead : step === 6 ? showPrice : goNext}
                      disabled={!canNext}
                      className="group flex-1 inline-flex items-center justify-center gap-2 py-3.5 rounded-full bg-foreground text-background text-sm font-medium tracking-wider hover:bg-primary hover:text-primary-foreground transition-all duration-500 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-foreground disabled:hover:text-background"
                    >
                      {step === 1 ? "Beregn din pris nå" : step === 6 ? "Beregn din pris" : "Neste"}
                      <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                    </Button>
                  ) : !submitted ? (
                    <Button
                      variant="ghost"
                                type="button"
                      onClick={submitOffer}
                      disabled={submitting}
                      className="group flex-1 inline-flex items-center justify-center gap-2 py-3.5 rounded-full bg-primary text-primary-foreground text-sm font-medium tracking-wider glow-rose hover:scale-[1.01] transition-all duration-500 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      <Send size={14} />
                      {submitting ? "Sender …" : "Send forespørsel"}
                    </Button>
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
  );
};

export default PricingCalculator;
