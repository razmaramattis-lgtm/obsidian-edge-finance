import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, Car, Info, Wallet, Receipt, Building2, User, Calculator,
  TrendingUp, HelpCircle, CheckCircle2,
} from "lucide-react";

/**
 * Firmabilkalkulator — sjablongmetoden (skatteloven § 5-13).
 * Kalibrert mot BDOs kalkulator for inntektsåret 2026.
 *
 *   Grunnlag = (listepris + ekstrautstyr) × reduksjoner
 *   Reduksjoner (multiplikative):
 *     - Bil eldre enn 3 år per 1.1.        → × 0,75
 *     - Yrkeskjøring > 40 000 km            → × 0,75
 *     - Varebil klasse 2 (sjablong):         fradrag = min(50 % av listepris, 150 000 kr)
 *
 *   Årlig fordel =
 *      30 % × min(Grunnlag, TERSKEL)
 *    + 20 % × maks(0, Grunnlag − TERSKEL)
 *   Justert for antall måneder / 12, minus årlig egenbetaling.
 *
 *   Skatt for ansatt: alminnelig inntekt 22 % + trygdeavgift lønn 7,6 % +
 *   trinnskatt basert på bruttoinntekt (splittes over trinn hvis fordelen krysser en trinn-grense).
 *   Finnmark/Nord-Troms: trinn 3 er 2 prosentpoeng lavere.
 *
 *   Arbeidsgiveravgift beregnes med sone-sats. Finnmark/Nord-Troms (sone V) = 0 %.
 *
 *   "Skatt fordelt i lønn" bruker BDOs metode: årlig skatt / 10,5 mnd
 *   (én måneds ferieavvikling + halv skatt i desember).
 */

const TERSKEL_2026 = 370_300; // knekkpunkt 30 % / 20 % — BDO 2026

// Trinnskatt 2026 (BDO-prognose). Tuples: [nedre grense, sats]
const TRINN = [
  { fra: 0,         sats: 0.000 },
  { fra: 226_400,   sats: 0.017 },
  { fra: 306_050,   sats: 0.040 },
  { fra: 697_150,   sats: 0.137 }, // Finnmark: 0.117
  { fra: 942_400,   sats: 0.168 },
  { fra: 1_410_750, sats: 0.178 },
];
const ALMINNELIG = 0.22;
const TRYGDEAVGIFT = 0.076;

const NOK = new Intl.NumberFormat("nb-NO", { style: "currency", currency: "NOK", maximumFractionDigits: 0 });

/** Beregn skatt-økning ved å legge `fordel` oppå `brutto`, med trinnskatt-tabellen. */
function skattOkning(brutto: number, fordel: number, finnmark: boolean): number {
  const trinn = TRINN.map((t, i) =>
    i === 3 && finnmark ? { ...t, sats: t.sats - 0.02 } : t
  );
  // Trinnskatt-økning: splitt fordelen over de aktuelle trinnene
  let trinnOkning = 0;
  const start = brutto;
  const slutt = brutto + fordel;
  for (let i = 0; i < trinn.length; i++) {
    const fra = trinn[i].fra;
    const til = i < trinn.length - 1 ? trinn[i + 1].fra : Infinity;
    const overlap = Math.max(0, Math.min(slutt, til) - Math.max(start, fra));
    trinnOkning += overlap * trinn[i].sats;
  }
  return fordel * (ALMINNELIG + TRYGDEAVGIFT) + trinnOkning;
}

const Firmabilkalkulator = () => {
  const [bruttoinntekt, setBruttoinntekt] = useState<number>(800_000);
  const [listepris, setListepris] = useState<number>(550_000);
  const [ekstrautstyr, setEkstrautstyr] = useState<number>(0);
  const [manederIAr, setManederIAr] = useState<number>(12);
  const [eldreBil, setEldreBil] = useState<boolean>(false);
  const [hoyYrkeskjoring, setHoyYrkeskjoring] = useState<boolean>(false);
  const [varebilKlasse2, setVarebilKlasse2] = useState<boolean>(false);
  const [finnmark, setFinnmark] = useState<boolean>(false);
  const [egenbetaling, setEgenbetaling] = useState<number>(0);
  const [agaSats, setAgaSats] = useState<number>(14.1);

  const r = useMemo(() => {
    const totalPris = Math.max(0, listepris) + Math.max(0, ekstrautstyr);

    // Varebil klasse 2: fradrag først, deretter øvrige reduksjoner
    const varebilFradrag = varebilKlasse2 ? Math.min(totalPris * 0.5, 150_000) : 0;
    const etterVarebil = totalPris - varebilFradrag;

    let faktor = 1;
    if (eldreBil) faktor *= 0.75;
    if (hoyYrkeskjoring) faktor *= 0.75;

    const grunnlag = etterVarebil * faktor;

    const under = Math.min(grunnlag, TERSKEL_2026);
    const over = Math.max(0, grunnlag - TERSKEL_2026);

    const fordelFull = under * 0.30 + over * 0.20;

    const mnd = Math.min(12, Math.max(0, manederIAr));
    const arligFordel = Math.max(0, fordelFull * (mnd / 12) - Math.max(0, egenbetaling));
    const manedligFordel = arligFordel / 12;

    // Skatt for ansatt (trinnskatt + alminnelig + trygdeavg.)
    const arligSkattAnsatt = skattOkning(Math.max(0, bruttoinntekt), arligFordel, finnmark);
    const skattPer10_5 = arligSkattAnsatt / 10.5;

    // Effektiv marginalskatt for visning
    const marginalPst = arligFordel > 0 ? (arligSkattAnsatt / arligFordel) * 100 : 0;

    // Arbeidsgiveravgift — Finnmark/Nord-Troms sone V = 0 %
    const effAga = finnmark ? 0 : agaSats;
    const arligAga = arligFordel * (effAga / 100);

    return {
      totalPris, varebilFradrag, etterVarebil, faktor, grunnlag,
      under, over, fordelFull, arligFordel, manedligFordel,
      arligSkattAnsatt, skattPer10_5, marginalPst, arligAga, effAga,
    };
  }, [bruttoinntekt, listepris, ekstrautstyr, manederIAr, eldreBil, hoyYrkeskjoring, varebilKlasse2, finnmark, egenbetaling, agaSats]);

  return (
    <>
      <Helmet>
        <title>Firmabilkalkulator 2026 — skatt og arbeidsgiveravgift | Avargo</title>
        <meta
          name="description"
          content="Beregn skatt på firmabil og arbeidsgiveravgift etter sjablongmetoden (§ 5-13) for inntektsåret 2026. Ser du hva firmabilen faktisk koster på lønnsslippen."
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
            <Link to="/ressurser" className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors mb-6">
              <ArrowLeft size={14} /> Tilbake til ressurser
            </Link>
            <span className="inline-block text-[10px] md:text-xs tracking-[0.35em] uppercase text-secondary mb-5 md:mb-6 font-semibold px-3.5 py-1.5 rounded-full border border-secondary/20 bg-secondary/5">
              Kalkulator · Inntektsåret 2026
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-7xl leading-[1.02] mb-6">
              Firmabilkalkulator — <span className="italic text-gradient-rose">enkelt forklart.</span>
            </h1>
            <p className="text-base md:text-xl text-muted-foreground font-light leading-relaxed">
              Se hva firmabilen faktisk koster ansatte i skatt og arbeidsgiver i arbeidsgiveravgift. Bygget på Skatteetatens sjablongmetode (§ 5-13) og kalibrert mot BDOs kalkulator for 2026.
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
                  <h2 className="font-heading text-xl md:text-2xl">Fyll inn</h2>
                  <p className="text-xs text-muted-foreground">Alle beløp er i kroner. Beregningen oppdateres automatisk.</p>
                </div>
              </div>

              <div className="space-y-5">
                <Field
                  label="Din bruttoinntekt i inntektsåret"
                  hint="Total lønnsinntekt før skatt. Brukes til å finne riktig marginalskatt (trinnskatt)."
                  suffix="kr"
                >
                  <NumberInput value={bruttoinntekt} onChange={setBruttoinntekt} step={50000} min={0} />
                </Field>

                <Field
                  label="Bilpris (listepris + ekstrautstyr, inkl. mva.)"
                  hint="Statens listepris som ny. Se skatteetaten.no/satser/bilpriser-listepris-som-ny."
                  suffix="kr"
                >
                  <NumberInput value={listepris} onChange={setListepris} step={10000} min={0} />
                </Field>

                <Field
                  label="Ekstrautstyr som ikke inngår i listepris"
                  hint="Fabrikk- eller ettermontert utstyr som skal legges til grunnlaget. La stå på 0 hvis alt allerede er inkludert over."
                  suffix="kr"
                >
                  <NumberInput value={ekstrautstyr} onChange={setEkstrautstyr} step={5000} min={0} />
                </Field>

                <Field
                  label="Antall måneder bilen står til disposisjon"
                  hint="Avrundes oppover til hel måned. Bytter du bil i løpet av året skal fordelen fordeles etter hele kalendermåneder."
                >
                  <NumberInput value={manederIAr} onChange={setManederIAr} min={0} max={12} step={1} />
                </Field>

                <Field
                  label="Egenbetaling fra ansatt (årlig)"
                  hint="Trekk fra netto lønn eller innbetalinger fra ansatt reduserer skattbar fordel krone for krone."
                  suffix="kr"
                >
                  <NumberInput value={egenbetaling} onChange={setEgenbetaling} min={0} step={1000} />
                </Field>
              </div>

              <div className="mt-6 pt-6 border-t border-border/20">
                <h3 className="text-sm font-semibold mb-3">Huk av for følgende forhold</h3>
                <div className="grid grid-cols-1 gap-2.5">
                  <Toggle
                    label="Bilen er eldre enn 3 år ved inngangen til skatteåret"
                    hint="Grunnlaget reduseres til 75 %."
                    active={eldreBil}
                    onChange={setEldreBil}
                  />
                  <Toggle
                    label="Yrkeskjøring over 40 000 km"
                    hint="Dokumentert yrkeskjøring over 40 000 km — grunnlaget reduseres til 75 %."
                    active={hoyYrkeskjoring}
                    onChange={setHoyYrkeskjoring}
                  />
                  <Toggle
                    label="Bilen er varebil klasse 2"
                    hint="Særskilt sjablongfradrag: 50 % av listepris, oppad begrenset til 150 000 kr."
                    active={varebilKlasse2}
                    onChange={setVarebilKlasse2}
                  />
                  <Toggle
                    label="Bor i Finnmark eller Nord-Troms"
                    hint="Trinn 3 er 2 prosentpoeng lavere, og arbeidsgiveravgiften er 0 % (sone V)."
                    active={finnmark}
                    onChange={setFinnmark}
                  />
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border/20">
                <div className="flex items-center gap-3 mb-3">
                  <Calculator size={16} className="text-primary" strokeWidth={1.5} />
                  <h3 className="text-sm font-semibold">Arbeidsgiveravgift</h3>
                </div>
                <Field
                  label="AGA-sats"
                  hint="14,1 % (sone I) er standard. Finnmark/Nord-Troms overstyres automatisk til 0 %."
                  suffix="%"
                >
                  <NumberInput value={agaSats} onChange={setAgaSats} step={0.1} min={0} max={20} />
                </Field>
              </div>
            </div>

            {/* ─── Resultat ─── */}
            <div className="space-y-5">
              {/* Headline */}
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
                    <TrendingUp size={12} /> Skattbar fordel (inntektstillegg)
                  </div>
                  <p className="font-heading text-4xl md:text-5xl leading-none mb-2">
                    {NOK.format(r.arligFordel)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    per år · <span className="font-medium text-foreground/80">{NOK.format(r.manedligFordel)}</span> per måned
                  </p>
                  <p className="text-xs text-muted-foreground/70 mt-4 leading-relaxed">
                    Dette er beløpet som legges til lønn på a-meldingen. Ansatt skattes av det; arbeidsgiver betaler AGA av det.
                  </p>
                </div>
              </motion.div>

              {/* Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ResultCard
                  icon={User}
                  title="Skatt for ansatt"
                  primary={NOK.format(r.arligSkattAnsatt)}
                  primaryLabel={`per år · marginal ~${r.marginalPst.toFixed(1).replace(".", ",")} %`}
                  secondary={`${NOK.format(r.skattPer10_5)} per lønnsslipp`}
                  detail="Fordelt over 10,5 mnd (én måneds ferieavvikling + halv skatt i desember) — samme metode som BDO."
                />
                <ResultCard
                  icon={Building2}
                  title="Arbeidsgiveravgift"
                  primary={NOK.format(r.arligAga)}
                  primaryLabel={`per år · sats ${r.effAga.toString().replace(".", ",")} %`}
                  secondary={finnmark ? "Sone V — 0 % AGA" : "Sone I — standard"}
                  detail="AGA beregnes på fordelen som legges til lønn. Kommer i tillegg til bilens driftskostnader."
                />
              </div>

              {/* Nedbryting */}
              <div className="glass rounded-3xl border border-border/20 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center">
                    <Receipt size={16} className="text-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-heading text-lg">Slik regnet vi</h3>
                </div>

                <ol className="space-y-1 text-sm">
                  <BreakdownRow label="Listepris + ekstrautstyr" value={NOK.format(r.totalPris)} />
                  {r.varebilFradrag > 0 && (
                    <BreakdownRow label="Sjablongfradrag varebil klasse 2" value={`− ${NOK.format(r.varebilFradrag)}`} subdued />
                  )}
                  {r.faktor < 1 && (
                    <BreakdownRow label={`Reduksjonsfaktor (${(r.faktor * 100).toString().replace(".", ",")} %)`} value={`× ${r.faktor.toString().replace(".", ",")}`} subdued />
                  )}
                  <BreakdownRow label="Beregningsgrunnlag" value={NOK.format(r.grunnlag)} strong />
                  <BreakdownRow label={`30 % opp til ${NOK.format(TERSKEL_2026)}`} value={NOK.format(r.under * 0.30)} />
                  {r.over > 0 && (
                    <BreakdownRow label={`20 % over ${NOK.format(TERSKEL_2026)}`} value={NOK.format(r.over * 0.20)} />
                  )}
                  {manederIAr < 12 && (
                    <BreakdownRow label={`Forholdsmessig (${manederIAr}/12 måneder)`} value={`× ${(manederIAr / 12).toFixed(2).replace(".", ",")}`} subdued />
                  )}
                  {egenbetaling > 0 && (
                    <BreakdownRow label="Fratrukket egenbetaling" value={`− ${NOK.format(egenbetaling)}`} subdued />
                  )}
                  <BreakdownRow label="Skattbar fordel per år" value={NOK.format(r.arligFordel)} highlight />
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
                    <span>Ansatt får <span className="font-medium text-foreground">{NOK.format(r.manedligFordel)}</span> lagt til brutto lønn i måneden — men får ikke pengene utbetalt. Det er kun grunnlaget for skattetrekk.</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" strokeWidth={2} />
                    <span>Netto blir ansattes lønnsslipp <span className="font-medium text-foreground">{NOK.format(r.skattPer10_5)}</span> lavere hver måned (fordelt over 10,5 måneder).</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" strokeWidth={2} />
                    <span>Arbeidsgivers merkostnad i arbeidsgiveravgift: <span className="font-medium text-foreground">{NOK.format(r.arligAga)}</span> per år.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info */}
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
                Kalkulatoren bruker <span className="text-foreground font-medium">sjablongmetoden</span> i skatteloven § 5-13, som er den standardiserte modellen Skatteetaten, revisorer og regnskapsførere bruker for privat bruk av firmabil.
              </p>
              <div>
                <h3 className="font-heading text-lg text-foreground mb-2">Sjablong 2026</h3>
                <ul className="space-y-1.5 list-disc pl-5">
                  <li>30 % av beregningsgrunnlaget opp til <span className="text-foreground">{NOK.format(TERSKEL_2026)}</span></li>
                  <li>20 % av grunnlaget som overstiger {NOK.format(TERSKEL_2026)}</li>
                </ul>
              </div>
              <div>
                <h3 className="font-heading text-lg text-foreground mb-2">Reduksjoner</h3>
                <ul className="space-y-1.5 list-disc pl-5">
                  <li>Bil eldre enn 3 år per 1. januar → 75 %</li>
                  <li>Yrkeskjøring over 40 000 km i året → 75 % (kombinasjon: 56,25 %)</li>
                  <li>Varebil klasse 2: sjablongfradrag på 50 % av listepris, maks 150 000 kr</li>
                </ul>
              </div>
              <div>
                <h3 className="font-heading text-lg text-foreground mb-2">Skatt for ansatt</h3>
                <p>Alminnelig inntekt 22 % + trygdeavgift lønn 7,6 % + trinnskatt fra bruttoinntekt. Finnmark/Nord-Troms har 2 prosentpoeng lavere trinn 3 og 0 % arbeidsgiveravgift.</p>
              </div>
              <div>
                <h3 className="font-heading text-lg text-foreground mb-2">Elbil</h3>
                <p>Fra 2023 skattlegges elbil på lik linje med andre biler som firmabil — ingen egen elbil-reduksjon.</p>
              </div>
              <p className="text-xs">Kalkulatoren gir et veiledende estimat. Ta kontakt for endelig vurdering — særlig ved sporadisk bruk, elektronisk kjørebok eller yrkesbil med redusert privat bruk.</p>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link to="/kontakt" className="inline-flex items-center justify-center gap-2 h-12 px-6 bg-primary text-primary-foreground rounded-2xl text-sm font-semibold glow-rose hover:scale-[1.02] transition-all">
                Snakk med en regnskapsfører <Wallet size={14} />
              </Link>
              <Link to="/ressurser" className="inline-flex items-center justify-center gap-2 h-12 px-6 border border-border/30 rounded-2xl text-sm font-medium hover:border-primary/30 hover:bg-primary/5 transition-all">
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

const Field = ({ label, hint, suffix, children }: { label: string; hint?: string; suffix?: string; children: React.ReactNode }) => (
  <label className="block">
    <div className="flex items-baseline justify-between mb-1.5">
      <span className="text-sm font-medium">{label}</span>
      {suffix && <span className="text-[10px] tracking-widest uppercase text-muted-foreground/60">{suffix}</span>}
    </div>
    {children}
    {hint && <p className="text-xs text-muted-foreground/70 mt-1.5 leading-relaxed">{hint}</p>}
  </label>
);

const NumberInput = ({ value, onChange, min, max, step }: { value: number; onChange: (n: number) => void; min?: number; max?: number; step?: number }) => (
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

const Toggle = ({ label, hint, active, onChange }: { label: string; hint?: string; active: boolean; onChange: (b: boolean) => void }) => (
  <button
    type="button"
    onClick={() => onChange(!active)}
    className={`text-left rounded-xl border px-4 py-3 transition-all ${
      active ? "bg-primary/10 border-primary/40" : "bg-muted/20 border-border/30 hover:border-primary/30"
    }`}
  >
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm font-medium">{label}</span>
      <span className={`w-9 h-5 rounded-full relative transition-colors shrink-0 ${active ? "bg-primary" : "bg-border/60"}`}>
        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-background transition-all ${active ? "left-[18px]" : "left-0.5"}`} />
      </span>
    </div>
    {hint && <p className="text-[11px] text-muted-foreground/70 mt-1 leading-snug">{hint}</p>}
  </button>
);

const ResultCard = ({ icon: Icon, title, primary, primaryLabel, secondary, detail }: {
  icon: React.ElementType; title: string; primary: string; primaryLabel: string; secondary: string; detail: string;
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

const BreakdownRow = ({ label, value, subdued, strong, highlight }: {
  label: string; value: string; subdued?: boolean; strong?: boolean; highlight?: boolean;
}) => (
  <li className={`flex items-center justify-between gap-4 py-2 ${
    highlight ? "border-t border-border/30 mt-2 pt-3 text-foreground font-semibold"
      : strong ? "text-foreground font-medium"
      : subdued ? "text-muted-foreground/70 text-xs"
      : "text-muted-foreground"
  }`}>
    <span>{label}</span>
    <span className={`tabular-nums ${highlight ? "text-primary" : ""}`}>{value}</span>
  </li>
);

export default Firmabilkalkulator;
