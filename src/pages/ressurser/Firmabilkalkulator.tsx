import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, Car, Info, Wallet, Receipt, Building2, User, Calculator,
  TrendingUp, HelpCircle, CheckCircle2,
} from "lucide-react";

/**
 * Firmabilkalkulator — sjablongmetoden (Skatteetaten § 5-13, samme metode som BDO bruker).
 *
 * Grunnformel (inntektsåret 2026):
 *   Beregningsgrunnlag = Listepris (nybil inkl. mva. + ekstrautstyr) × reduksjonsfaktor
 *   Reduksjoner (multiplikative):
 *     - Bil eldre enn 3 år per 1.1. i inntektsåret       → × 0,75
 *     - Yrkeskjøring over 40 000 km i inntektsåret        → × 0,75
 *     (kombinasjon: 0,75 × 0,75 = 0,5625)
 *   Fra 2023 skattlegges elbil på lik linje med andre biler — ingen egen reduksjon.
 *
 *   Årlig skattbar fordel =
 *     30 %  × min(Grunnlag, TERSKEL)
 *   + 20 %  × maks(0, Grunnlag − TERSKEL)
 *
 *   Justeres forholdsmessig hvis bilen kun er disponert deler av året (måneder / 12).
 *
 *   Ansatt: fordelen legges til lønn og skattlegges med marginalskattesats.
 *   Arbeidsgiver: betaler arbeidsgiveravgift av fordelen.
 */

const TERSKEL_2026 = 351_700; // NOK — knekkpunkt 30/20 %
const NOK = new Intl.NumberFormat("nb-NO", { style: "currency", currency: "NOK", maximumFractionDigits: 0 });
const NUM = new Intl.NumberFormat("nb-NO", { maximumFractionDigits: 0 });

const Firmabilkalkulator = () => {
  const [listepris, setListepris] = useState<number>(550_000);
  const [ekstrautstyr, setEkstrautstyr] = useState<number>(0);
  const [eldreBil, setEldreBil] = useState<boolean>(false);
  const [hoyYrkeskjoring, setHoyYrkeskjoring] = useState<boolean>(false);
  const [manederIAr, setManederIAr] = useState<number>(12);
  const [marginalskatt, setMarginalskatt] = useState<number>(43.4); // vanlig trinnsats + trygdeavg. for lønn
  const [agaSats, setAgaSats] = useState<number>(14.1); // sone I
  const [egenbetaling, setEgenbetaling] = useState<number>(0); // årlig egenbetaling fra ansatt

  const r = useMemo(() => {
    const totalPris = Math.max(0, listepris) + Math.max(0, ekstrautstyr);

    // Reduksjoner
    let faktor = 1;
    if (eldreBil) faktor *= 0.75;
    if (hoyYrkeskjoring) faktor *= 0.75;

    const grunnlag = totalPris * faktor;

    const under = Math.min(grunnlag, TERSKEL_2026);
    const over = Math.max(0, grunnlag - TERSKEL_2026);

    const arligFordelFull = under * 0.30 + over * 0.20;

    // Deler av året
    const mnd = Math.min(12, Math.max(0, manederIAr));
    const arligFordel = Math.max(0, arligFordelFull * (mnd / 12) - Math.max(0, egenbetaling));

    const manedligFordel = arligFordel / 12;

    // Ansatt
    const arligSkattAnsatt = arligFordel * (marginalskatt / 100);
    const manedligSkattAnsatt = arligSkattAnsatt / 12;

    // Arbeidsgiver
    const arligAga = arligFordel * (agaSats / 100);

    return {
      totalPris,
      faktor,
      grunnlag,
      under,
      over,
      arligFordelFull,
      arligFordel,
      manedligFordel,
      arligSkattAnsatt,
      manedligSkattAnsatt,
      arligAga,
    };
  }, [listepris, ekstrautstyr, eldreBil, hoyYrkeskjoring, manederIAr, marginalskatt, agaSats, egenbetaling]);

  return (
    <>
      <Helmet>
        <title>Firmabilkalkulator 2026 — skatt og arbeidsgiveravgift | Avargo</title>
        <meta
          name="description"
          content="Beregn skatt på firmabil og arbeidsgiveravgift etter sjablongmetoden (§ 5-13). Se årlig og månedlig kostnad for både ansatt og arbeidsgiver — klart forklart."
        />
        <link rel="canonical" href="https://avargo.no/ressurser/firmabilkalkulator" />
      </Helmet>

      {/* Hero */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 ambient-glow opacity-30" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <Link
              to="/ressurser"
              className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors mb-6"
            >
              <ArrowLeft size={14} /> Tilbake til ressurser
            </Link>
            <span className="inline-block text-[10px] md:text-xs tracking-[0.35em] uppercase text-secondary mb-5 md:mb-6 font-semibold px-3.5 py-1.5 rounded-full border border-secondary/20 bg-secondary/5">
              Kalkulator · Inntektsåret 2026
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-7xl leading-[1.02] mb-6">
              Firmabilkalkulator — <span className="italic text-gradient-rose">enkelt forklart.</span>
            </h1>
            <p className="text-base md:text-xl text-muted-foreground font-light leading-relaxed">
              Se hva firmabilen faktisk koster den ansatte i skatt, og hva arbeidsgiveren må betale i arbeidsgiveravgift. Vi bruker Skatteetatens sjablongmetode (§ 5-13) — samme metode BDO og bransjen ellers.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6"><div className="line-accent" /></div>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-8 lg:gap-12">
            {/* ─── Input ─── */}
            <div className="glass rounded-3xl border border-border/20 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Car size={18} className="text-primary" strokeWidth={1.5} />
                </div>
                <div>
                  <h2 className="font-heading text-xl md:text-2xl">Om bilen</h2>
                  <p className="text-xs text-muted-foreground">Fyll ut, så oppdateres beregningen fortløpende.</p>
                </div>
              </div>

              <div className="space-y-5">
                <Field
                  label="Listepris som ny (inkl. mva.)"
                  hint="Bilens opprinnelige listepris fra importør. Finnes på fabrikantens/importørens prisliste."
                  suffix="kr"
                >
                  <NumberInput value={listepris} onChange={setListepris} step={10000} min={0} />
                </Field>

                <Field
                  label="Ekstrautstyr (inkl. mva.)"
                  hint="Fabrikkmontert ekstrautstyr og tilleggsutstyr som inngår i listeprisen. Vinterhjul kan holdes utenfor."
                  suffix="kr"
                >
                  <NumberInput value={ekstrautstyr} onChange={setEkstrautstyr} step={5000} min={0} />
                </Field>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Toggle
                    label="Bil eldre enn 3 år"
                    hint="Er bilen eldre enn 3 år per 1. januar i inntektsåret? Da reduseres grunnlaget til 75 %."
                    active={eldreBil}
                    onChange={setEldreBil}
                  />
                  <Toggle
                    label="Yrkeskjøring > 40 000 km"
                    hint="Ved dokumentert yrkeskjøring over 40 000 km reduseres grunnlaget til 75 %. Kan kombineres med «eldre bil»."
                    active={hoyYrkeskjoring}
                    onChange={setHoyYrkeskjoring}
                  />
                </div>

                <Field
                  label="Antall måneder bilen disponeres i året"
                  hint="Har ansatt hatt firmabil hele året skriver du 12. Ved oppstart/avslutning oppgi antall måneder."
                >
                  <NumberInput value={manederIAr} onChange={setManederIAr} min={0} max={12} step={1} />
                </Field>

                <Field
                  label="Egenbetaling fra ansatt (årlig)"
                  hint="Trekk fra netto lønn eller innbetaling til arbeidsgiver reduserer skattbar fordel krone for krone."
                  suffix="kr"
                >
                  <NumberInput value={egenbetaling} onChange={setEgenbetaling} min={0} step={1000} />
                </Field>
              </div>

              <div className="mt-8 pt-6 border-t border-border/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Calculator size={18} className="text-primary" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg">Skattesatser</h3>
                    <p className="text-xs text-muted-foreground">Juster hvis dine satser avviker fra standard.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field
                    label="Ansattes marginalskatt"
                    hint="Marginalskatten er skatten på siste inntektskrone. Typisk mellom 34 % og 47,4 % avhengig av inntekt (2026)."
                    suffix="%"
                  >
                    <NumberInput value={marginalskatt} onChange={setMarginalskatt} step={0.1} min={0} max={100} />
                  </Field>
                  <Field
                    label="Arbeidsgiveravgift"
                    hint="Sats varierer med sone: 14,1 % (sone I), 10,6 %, 6,4 %, 5,1 % eller 0 %. Standard er 14,1 %."
                    suffix="%"
                  >
                    <NumberInput value={agaSats} onChange={setAgaSats} step={0.1} min={0} max={20} />
                  </Field>
                </div>
              </div>
            </div>

            {/* ─── Resultat ─── */}
            <div className="space-y-5">
              {/* Headline card */}
              <motion.div
                key={r.arligFordel}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="glass rounded-3xl border border-primary/25 p-6 md:p-8 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />
                <div className="relative">
                  <div className="flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-secondary mb-3">
                    <TrendingUp size={12} /> Skattbar fordel
                  </div>
                  <p className="font-heading text-4xl md:text-5xl leading-none mb-2">
                    {NOK.format(r.arligFordel)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    per år · <span className="font-medium text-foreground/80">{NOK.format(r.manedligFordel)}</span> per måned
                  </p>
                  <p className="text-xs text-muted-foreground/70 mt-4 leading-relaxed">
                    Dette er beløpet som legges til den ansattes lønn på a-meldingen. Ansatt skattes av det, og arbeidsgiver betaler arbeidsgiveravgift av det.
                  </p>
                </div>
              </motion.div>

              {/* Two-column breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ResultCard
                  icon={User}
                  title="Ansatt betaler i skatt"
                  primary={NOK.format(r.arligSkattAnsatt)}
                  primaryLabel="per år"
                  secondary={`${NOK.format(r.manedligSkattAnsatt)} per måned`}
                  detail={`Med marginalskatt ${marginalskatt.toString().replace(".", ",")} %.`}
                />
                <ResultCard
                  icon={Building2}
                  title="Arbeidsgiver betaler i AGA"
                  primary={NOK.format(r.arligAga)}
                  primaryLabel="per år"
                  secondary={`Sats: ${agaSats.toString().replace(".", ",")} %`}
                  detail="Arbeidsgiveravgift på fordelen — kommer i tillegg til bilens driftskostnader."
                />
              </div>

              {/* Breakdown */}
              <div className="glass rounded-3xl border border-border/20 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center">
                    <Receipt size={16} className="text-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-heading text-lg">Slik regnet vi</h3>
                </div>

                <ol className="space-y-3 text-sm">
                  <BreakdownRow
                    label="Listepris + ekstrautstyr"
                    value={NOK.format(r.totalPris)}
                  />
                  {r.faktor < 1 && (
                    <BreakdownRow
                      label={`Reduksjonsfaktor (${(r.faktor * 100).toString().replace(".", ",")} %)`}
                      value={`× ${r.faktor.toString().replace(".", ",")}`}
                      subdued
                    />
                  )}
                  <BreakdownRow
                    label="Beregningsgrunnlag"
                    value={NOK.format(r.grunnlag)}
                    strong
                  />
                  <BreakdownRow
                    label={`30 % av grunnlag opp til ${NOK.format(TERSKEL_2026)}`}
                    value={NOK.format(r.under * 0.30)}
                  />
                  {r.over > 0 && (
                    <BreakdownRow
                      label={`20 % av grunnlag over ${NOK.format(TERSKEL_2026)}`}
                      value={NOK.format(r.over * 0.20)}
                    />
                  )}
                  {manederIAr < 12 && (
                    <BreakdownRow
                      label={`Forholdsmessig (${manederIAr}/12 måneder)`}
                      value={`× ${(manederIAr / 12).toFixed(2).replace(".", ",")}`}
                      subdued
                    />
                  )}
                  {egenbetaling > 0 && (
                    <BreakdownRow
                      label="Fratrukket egenbetaling"
                      value={`− ${NOK.format(egenbetaling)}`}
                      subdued
                    />
                  )}
                  <BreakdownRow
                    label="Skattbar fordel per år"
                    value={NOK.format(r.arligFordel)}
                    highlight
                  />
                </ol>
              </div>

              {/* Explainer */}
              <div className="glass rounded-3xl border border-border/20 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center">
                    <HelpCircle size={16} className="text-secondary" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-heading text-lg">Hva betyr dette i praksis?</h3>
                </div>
                <ul className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                  <li className="flex gap-2">
                    <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" strokeWidth={2} />
                    <span>Ansatt får <span className="font-medium text-foreground">{NOK.format(r.manedligFordel)}</span> lagt til brutto lønn hver måned — men får ikke pengene utbetalt. Det er kun grunnlaget for skattetrekk.</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" strokeWidth={2} />
                    <span>Netto blir ansattes lønn redusert med <span className="font-medium text-foreground">{NOK.format(r.manedligSkattAnsatt)}</span> i måneden.</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" strokeWidth={2} />
                    <span>Arbeidsgivers reelle merkostnad for firmabilordningen (utover selve bilen) er arbeidsgiveravgiften på <span className="font-medium text-foreground">{NOK.format(r.arligAga)}</span> per år.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info-seksjon */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Info size={18} className="text-primary" strokeWidth={1.5} />
              </div>
              <h2 className="font-heading text-2xl md:text-3xl">Om beregningen</h2>
            </div>

            <div className="space-y-6 text-sm md:text-base text-muted-foreground leading-relaxed">
              <p>
                Kalkulatoren bruker <span className="text-foreground font-medium">sjablongmetoden</span> i skatteloven § 5-13, som er den standardiserte modellen Skatteetaten, revisorer og regnskapsførere bruker for å beregne fordelen ved privat bruk av firmabil.
              </p>
              <div>
                <h3 className="font-heading text-lg text-foreground mb-2">Sjablongen</h3>
                <ul className="space-y-1.5 list-disc pl-5">
                  <li>30 % av beregningsgrunnlaget opp til <span className="text-foreground">{NOK.format(TERSKEL_2026)}</span></li>
                  <li>20 % av beregningsgrunnlaget som overstiger {NOK.format(TERSKEL_2026)}</li>
                </ul>
              </div>
              <div>
                <h3 className="font-heading text-lg text-foreground mb-2">Reduksjoner i grunnlaget</h3>
                <ul className="space-y-1.5 list-disc pl-5">
                  <li>Bil eldre enn 3 år per 1. januar → 75 % av listepris</li>
                  <li>Yrkeskjøring over 40 000 km i året → 75 % av listepris</li>
                  <li>Kombineres begge, blir grunnlaget 56,25 % av listepris</li>
                </ul>
              </div>
              <div>
                <h3 className="font-heading text-lg text-foreground mb-2">Elbil</h3>
                <p>
                  Fra 2023 skattlegges elbil på lik linje med andre biler som firmabil. Det er ingen egen elbil-reduksjon lenger.
                </p>
              </div>
              <p className="text-xs">
                Kalkulatoren gir et veiledende estimat. Ta kontakt med regnskapsfører for endelig vurdering — særlig ved sporadisk bruk, elektronisk kjørebok, yrkesbil med redusert privat bruk, eller ved bruk i deler av året.
              </p>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                to="/kontakt"
                className="inline-flex items-center justify-center gap-2 h-12 px-6 bg-primary text-primary-foreground rounded-2xl text-sm font-semibold glow-rose hover:scale-[1.02] transition-all"
              >
                Snakk med en regnskapsfører <Wallet size={14} />
              </Link>
              <Link
                to="/ressurser"
                className="inline-flex items-center justify-center gap-2 h-12 px-6 border border-border/30 rounded-2xl text-sm font-medium hover:border-primary/30 hover:bg-primary/5 transition-all"
              >
                Se flere ressurser
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

/* ─────────────────── UI helpers ─────────────────── */

const Field = ({
  label, hint, suffix, children,
}: { label: string; hint?: string; suffix?: string; children: React.ReactNode }) => (
  <label className="block">
    <div className="flex items-baseline justify-between mb-1.5">
      <span className="text-sm font-medium">{label}</span>
      {suffix && <span className="text-[10px] tracking-widest uppercase text-muted-foreground/60">{suffix}</span>}
    </div>
    {children}
    {hint && <p className="text-xs text-muted-foreground/70 mt-1.5 leading-relaxed">{hint}</p>}
  </label>
);

const NumberInput = ({
  value, onChange, min, max, step,
}: { value: number; onChange: (n: number) => void; min?: number; max?: number; step?: number }) => (
  <input
    type="number"
    inputMode="numeric"
    value={Number.isFinite(value) ? value : 0}
    onChange={(e) => {
      const n = parseFloat(e.target.value);
      onChange(Number.isFinite(n) ? n : 0);
    }}
    min={min}
    max={max}
    step={step}
    className="w-full h-11 rounded-xl border border-border/30 bg-muted/30 px-4 text-sm font-medium tabular-nums focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
  />
);

const Toggle = ({
  label, hint, active, onChange,
}: { label: string; hint?: string; active: boolean; onChange: (b: boolean) => void }) => (
  <button
    type="button"
    onClick={() => onChange(!active)}
    className={`text-left rounded-xl border px-4 py-3 transition-all ${
      active
        ? "bg-primary/10 border-primary/40"
        : "bg-muted/20 border-border/30 hover:border-primary/30"
    }`}
  >
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm font-medium">{label}</span>
      <span
        className={`w-9 h-5 rounded-full relative transition-colors shrink-0 ${
          active ? "bg-primary" : "bg-border/60"
        }`}
      >
        <span
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-background transition-all ${
            active ? "left-[18px]" : "left-0.5"
          }`}
        />
      </span>
    </div>
    {hint && <p className="text-[11px] text-muted-foreground/70 mt-1 leading-snug">{hint}</p>}
  </button>
);

const ResultCard = ({
  icon: Icon, title, primary, primaryLabel, secondary, detail,
}: {
  icon: React.ElementType;
  title: string;
  primary: string;
  primaryLabel: string;
  secondary: string;
  detail: string;
}) => (
  <div className="glass rounded-3xl border border-border/20 p-6">
    <div className="flex items-center gap-2 mb-3">
      <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center">
        <Icon size={14} className="text-primary" strokeWidth={1.5} />
      </div>
      <span className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground">{title}</span>
    </div>
    <p className="font-heading text-2xl md:text-3xl leading-none">{primary}</p>
    <p className="text-xs text-muted-foreground mt-1">{primaryLabel}</p>
    <p className="text-sm mt-3 font-medium">{secondary}</p>
    <p className="text-xs text-muted-foreground/70 mt-1 leading-relaxed">{detail}</p>
  </div>
);

const BreakdownRow = ({
  label, value, subdued, strong, highlight,
}: { label: string; value: string; subdued?: boolean; strong?: boolean; highlight?: boolean }) => (
  <li
    className={`flex items-center justify-between gap-4 py-2 ${
      highlight
        ? "border-t border-border/30 mt-2 pt-3 text-foreground font-semibold"
        : strong
        ? "text-foreground font-medium"
        : subdued
        ? "text-muted-foreground/70 text-xs"
        : "text-muted-foreground"
    }`}
  >
    <span>{label}</span>
    <span className={`tabular-nums ${highlight ? "text-primary" : ""}`}>{value}</span>
  </li>
);

export default Firmabilkalkulator;
