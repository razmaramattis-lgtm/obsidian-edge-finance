import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Calculator, Users, TrendingUp, Clock, Calendar, DollarSign,
  ChevronDown, ChevronUp, Info, ExternalLink
} from "lucide-react";

/* ─── Constants ─── */
const AGI_SONER = [
  { label: "Sone 1 (14,1%) – Oslo, Bergen, Trondheim m.fl.", rate: 0.141 },
  { label: "Sone 1a (10,6%) – Sone 1a-kommuner", rate: 0.106 },
  { label: "Sone 2 (10,6%) – Innlandet, Vestland m.fl.", rate: 0.106 },
  { label: "Sone 3 (6,4%) – Troms, deler av Nordland", rate: 0.064 },
  { label: "Sone 4 (5,1%) – Finnmark, Nord-Troms", rate: 0.051 },
  { label: "Sone 4a (7,9%) – Spesielle kommuner", rate: 0.079 },
  { label: "Sone 5 (0,0%) – Fritak-sone", rate: 0 },
];

const FERIE_OPTIONS = [
  { label: "4 uker + 1 dag (10,2%)", weeks: 4, rate: 0.102 },
  { label: "5 uker (12,0%)", weeks: 5, rate: 0.12 },
];

const FORSIKRING_OPTIONS = [
  { id: "yrkesskadeforsikring", label: "Yrkesskadeforsikring", options: [
    { label: "Kontor/lett arbeid", cost: 674 },
    { label: "Lett manuelt arbeid", cost: 1800 },
    { label: "Tungt/risikofylt arbeid", cost: 4200 },
  ]},
];

const ARBEIDSTIMER_PER_AAR = 1695;

/* ─── Component ─── */
const AnsettelsesKalkulator = () => {
  const [bruttolonn, setBruttolonn] = useState(600000);
  const [lonnType, setLonnType] = useState<"aar" | "mnd">("aar");
  const [ferieIdx, setFerieIdx] = useState(1); // default 5 uker
  const [over60, setOver60] = useState(false);
  const [agiIdx, setAgiIdx] = useState(0);
  const [pensjonProsent, setPensjonProsent] = useState(2);
  const [forsikringType, setForsikringType] = useState(0); // kontor
  const [inkluderSykefravaer, setInkluderSykefravaer] = useState(false);
  const [sykefravaerProsent, setSykefravaerProsent] = useState(4);
  const [inkluderAndre, setInkluderAndre] = useState(false);
  const [andreKostnader, setAndreKostnader] = useState(0);
  const [activeTab, setActiveTab] = useState<"totalkostnad" | "timesats" | "offentlig">("totalkostnad");
  const [showSammenligning, setShowSammenligning] = useState(false);

  const arslonn = lonnType === "aar" ? bruttolonn : bruttolonn * 12;

  const results = useMemo(() => {
    const ferieRate = FERIE_OPTIONS[ferieIdx].rate + (over60 ? 0.024 : 0);
    const feriepenger = arslonn * ferieRate;
    const agiRate = AGI_SONER[agiIdx].rate;
    const agi = (arslonn + feriepenger) * agiRate;
    const pensjon = arslonn * (pensjonProsent / 100);
    const forsikring = FORSIKRING_OPTIONS[0].options[forsikringType].cost;
    const sykefravaerKostnad = inkluderSykefravaer ? arslonn * (sykefravaerProsent / 100) * 0.16 : 0;
    const andreKost = inkluderAndre ? andreKostnader : 0;

    const totalkostnad = arslonn + feriepenger + agi + pensjon + forsikring + sykefravaerKostnad + andreKost;
    const paaslag = ((totalkostnad - arslonn) / arslonn) * 100;
    const timekostnad = totalkostnad / ARBEIDSTIMER_PER_AAR;
    const maanedskostnad = totalkostnad / 12;

    // SkatteFUNN: 1,2‰ av årslønn, maks 700 kr/t
    const skattefunnTimesats = Math.min(arslonn * 0.0012, 700);
    const skattefunnFradrag = Math.min(skattefunnTimesats * 1850, 25000000) * 0.19;

    // Forskningsrådet: lav 0,8‰, høy 1,1‰, maks 1100
    const forskLav = Math.min(arslonn * 0.0008, 1100);
    const forskHoy = Math.min(arslonn * 0.0011, 1100);

    // Innovasjon Norge: 1,2‰, maks 700
    const innovasjonTimesats = Math.min(arslonn * 0.0012, 700);

    return {
      arslonn, feriepenger, ferieRate, agi, agiRate, pensjon, forsikring,
      sykefravaerKostnad, andreKost, totalkostnad, paaslag, timekostnad,
      maanedskostnad, skattefunnTimesats, skattefunnFradrag, forskLav,
      forskHoy, innovasjonTimesats,
    };
  }, [arslonn, ferieIdx, over60, agiIdx, pensjonProsent, forsikringType, inkluderSykefravaer, sykefravaerProsent, inkluderAndre, andreKostnader]);

  const fmt = (n: number) => Math.round(n).toLocaleString("no-NO");

  const kostnadsfordeling = [
    { label: "Bruttolønn", value: results.arslonn, color: "bg-primary" },
    { label: "Feriepenger", value: results.feriepenger, color: "bg-blue-500" },
    { label: "Arbeidsgiveravgift", value: results.agi, color: "bg-amber-500" },
    { label: "Pensjon", value: results.pensjon, color: "bg-emerald-500" },
    { label: "Forsikring", value: results.forsikring, color: "bg-purple-500" },
    ...(results.sykefravaerKostnad > 0 ? [{ label: "Sykefravær", value: results.sykefravaerKostnad, color: "bg-red-400" }] : []),
    ...(results.andreKost > 0 ? [{ label: "Andre kostnader", value: results.andreKost, color: "bg-gray-400" }] : []),
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="font-heading text-2xl flex items-center gap-2">
          <Calculator size={22} className="text-primary" /> Ansettelseskalkulator
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Beregn den faktiske totalkostnaden ved å ansette. Inkluderer feriepenger, arbeidsgiveravgift, pensjon og timesatser.
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(["totalkostnad", "timesats", "offentlig"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-sm transition-all ${
              activeTab === tab ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted/50"
            }`}
          >
            {tab === "totalkostnad" ? "Totalkostnad" : tab === "timesats" ? "Timesats" : "Offentlig støtte"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Inputs */}
        <div className="lg:col-span-3 space-y-4">
          {/* Grunnleggende */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl border border-border/20 p-5 space-y-4">
            <h3 className="font-heading text-base">Grunnleggende informasjon</h3>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Bruttolønn</label>
              <div className="relative">
                <input
                  type="number"
                  value={bruttolonn || ""}
                  onChange={e => setBruttolonn(Number(e.target.value))}
                  className="w-full rounded-xl border border-border/30 bg-background/50 px-4 py-2.5 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">kr</span>
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Lønn oppgitt som</label>
              <div className="flex gap-2">
                {(["aar", "mnd"] as const).map(t => (
                  <button key={t} onClick={() => setLonnType(t)}
                    className={`flex-1 py-2 rounded-xl text-xs transition-all ${
                      lonnType === t ? "bg-primary/10 text-primary border border-primary/20" : "border border-border/20 text-muted-foreground hover:bg-muted/50"
                    }`}>
                    {t === "aar" ? "Årslønn" : "Månedslønn"}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Ferieordning */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="glass rounded-2xl border border-border/20 p-5 space-y-4">
            <h3 className="font-heading text-base">Ferieordning</h3>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Antall ferieuker</label>
              <select value={ferieIdx} onChange={e => setFerieIdx(Number(e.target.value))}
                className="w-full rounded-xl border border-border/30 bg-background/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                {FERIE_OPTIONS.map((opt, i) => <option key={i} value={i}>{opt.label}</option>)}
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={over60} onChange={e => setOver60(e.target.checked)}
                className="rounded border-border/40 text-primary focus:ring-primary/20" />
              <span>Ansatt over 60 år?</span>
              <span className="text-[10px] text-muted-foreground ml-1">(+1 ekstra ferieuke)</span>
            </label>
          </motion.div>

          {/* Arbeidsgiveravgift */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="glass rounded-2xl border border-border/20 p-5 space-y-4">
            <h3 className="font-heading text-base">Arbeidsgiveravgift</h3>
            <select value={agiIdx} onChange={e => setAgiIdx(Number(e.target.value))}
              className="w-full rounded-xl border border-border/30 bg-background/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
              {AGI_SONER.map((s, i) => <option key={i} value={i}>{s.label}</option>)}
            </select>
          </motion.div>

          {/* Pensjon */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="glass rounded-2xl border border-border/20 p-5 space-y-4">
            <h3 className="font-heading text-base">Pensjon</h3>
            <div>
              <label className="text-xs text-muted-foreground block mb-2">Pensjonssats: {pensjonProsent}%</label>
              <input type="range" min={2} max={7} step={0.5} value={pensjonProsent}
                onChange={e => setPensjonProsent(Number(e.target.value))}
                className="w-full accent-primary" />
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                <span>2%</span><span>7%</span>
              </div>
            </div>
          </motion.div>

          {/* Forsikringer */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="glass rounded-2xl border border-border/20 p-5 space-y-4">
            <h3 className="font-heading text-base">Forsikringer</h3>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Yrkesskadeforsikring</label>
              <select value={forsikringType} onChange={e => setForsikringType(Number(e.target.value))}
                className="w-full rounded-xl border border-border/30 bg-background/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                {FORSIKRING_OPTIONS[0].options.map((opt, i) => (
                  <option key={i} value={i}>{opt.label} ({fmt(opt.cost)} kr/år)</option>
                ))}
              </select>
            </div>
          </motion.div>

          {/* Valgfrie tillegg */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="glass rounded-2xl border border-border/20 p-5 space-y-4">
            <h3 className="font-heading text-base">Valgfrie tillegg</h3>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={inkluderSykefravaer} onChange={e => setInkluderSykefravaer(e.target.checked)}
                className="rounded border-border/40 text-primary focus:ring-primary/20" />
              Inkluder estimert sykefravær
            </label>
            {inkluderSykefravaer && (
              <div className="ml-6">
                <label className="text-xs text-muted-foreground block mb-1">Forventet sykefravær: {sykefravaerProsent}%</label>
                <input type="range" min={1} max={10} step={0.5} value={sykefravaerProsent}
                  onChange={e => setSykefravaerProsent(Number(e.target.value))}
                  className="w-full accent-primary" />
              </div>
            )}
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={inkluderAndre} onChange={e => setInkluderAndre(e.target.checked)}
                className="rounded border-border/40 text-primary focus:ring-primary/20" />
              Inkluder andre personalkostnader
            </label>
            {inkluderAndre && (
              <div className="ml-6">
                <label className="text-xs text-muted-foreground block mb-1">Beløp per år</label>
                <div className="relative">
                  <input type="number" value={andreKostnader || ""} onChange={e => setAndreKostnader(Number(e.target.value))}
                    className="w-full rounded-xl border border-border/30 bg-background/50 px-4 py-2.5 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">kr</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Right: Results */}
        <div className="lg:col-span-2 space-y-4">
          {activeTab === "totalkostnad" && (
            <>
              {/* Big number */}
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="glass rounded-2xl border border-primary/20 p-6 text-center bg-primary/5">
                <p className="text-xs text-muted-foreground mb-1">Totalkostnad per år</p>
                <p className="font-heading text-3xl text-primary">{fmt(results.totalkostnad)} kr</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Per måned: <strong>{fmt(results.maanedskostnad)} kr</strong>
                  <span className="mx-2">·</span>
                  Per time ({ARBEIDSTIMER_PER_AAR} t): <strong>{fmt(results.timekostnad)} kr</strong>
                </p>
              </motion.div>

              {/* Quick stats */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: TrendingUp, label: "Påslag på lønn", value: `${results.paaslag.toFixed(1)}%` },
                  { icon: Clock, label: "Timekostnad", value: `${fmt(results.timekostnad)} kr` },
                  { icon: Calendar, label: "Månedskostnad", value: `${fmt(results.maanedskostnad)} kr` },
                  { icon: DollarSign, label: "Feriepenger", value: `${fmt(results.feriepenger)} kr` },
                ].map((s, i) => (
                  <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className="glass rounded-xl border border-border/20 p-4 text-center">
                    <s.icon size={16} className="text-primary mx-auto mb-1" />
                    <p className="text-[10px] text-muted-foreground">{s.label}</p>
                    <p className="font-heading text-sm mt-0.5">{s.value}</p>
                  </motion.div>
                ))}
              </div>

              {/* Cost bar */}
              <div className="glass rounded-2xl border border-border/20 p-5 space-y-3">
                <h4 className="font-heading text-sm">Kostnadsfordeling</h4>
                <div className="flex rounded-full h-3 overflow-hidden">
                  {kostnadsfordeling.map(k => (
                    <div key={k.label} className={`${k.color}`} style={{ width: `${(k.value / results.totalkostnad) * 100}%` }} />
                  ))}
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  {kostnadsfordeling.map(k => (
                    <div key={k.label} className="flex items-center gap-1.5 text-[10px]">
                      <div className={`w-2 h-2 rounded-full ${k.color}`} />
                      <span className="text-muted-foreground">{k.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detailed */}
              <div className="glass rounded-2xl border border-border/20 p-5 space-y-2">
                <h4 className="font-heading text-sm">Detaljert oversikt</h4>
                {kostnadsfordeling.map(k => (
                  <div key={k.label} className="flex justify-between items-center text-sm py-1.5 border-b border-border/10 last:border-0">
                    <span className="text-muted-foreground">{k.label}{k.label === "Feriepenger" ? ` (${(results.ferieRate * 100).toFixed(1)}%)` : ""}{k.label === "Arbeidsgiveravgift" ? ` (${(results.agiRate * 100).toFixed(1)}%)` : ""}</span>
                    <div className="text-right">
                      <span className="font-medium">{fmt(k.value)} kr</span>
                      <span className="text-[10px] text-muted-foreground ml-1">({((k.value / results.totalkostnad) * 100).toFixed(1)}%)</span>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between items-center text-sm pt-2 font-medium border-t border-border/30">
                  <span>Sum</span>
                  <span>{fmt(results.totalkostnad)} kr</span>
                </div>
              </div>

              {/* Sammenligning */}
              <button onClick={() => setShowSammenligning(!showSammenligning)}
                className="w-full glass rounded-2xl border border-border/20 p-4 text-sm flex items-center justify-between hover:bg-muted/30 transition-all">
                <span className="flex items-center gap-2"><Users size={14} className="text-primary" /> Sammenligning: Ansatt vs. konsulent</span>
                {showSammenligning ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {showSammenligning && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                  className="glass rounded-2xl border border-border/20 p-5 space-y-3">
                  {(() => {
                    const konsulentTimepris = results.timekostnad * 1.8;
                    const konsulentAarlig = konsulentTimepris * ARBEIDSTIMER_PER_AAR;
                    return (
                      <>
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div>
                            <p className="text-[10px] text-muted-foreground mb-1">Ansatt (total)</p>
                            <p className="font-heading text-lg">{fmt(results.totalkostnad)} kr</p>
                            <p className="text-[10px] text-muted-foreground">{fmt(results.timekostnad)} kr/t</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-muted-foreground mb-1">Konsulent (est.)</p>
                            <p className="font-heading text-lg">{fmt(konsulentAarlig)} kr</p>
                            <p className="text-[10px] text-muted-foreground">{fmt(konsulentTimepris)} kr/t</p>
                          </div>
                        </div>
                        <p className="text-[10px] text-muted-foreground text-center">
                          Estimert konsulentpris: ~1,8x timekostnad ansatt. Faktisk pris varierer.
                        </p>
                      </>
                    );
                  })()}
                </motion.div>
              )}
            </>
          )}

          {activeTab === "timesats" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl border border-border/20 p-5 space-y-4">
              <h4 className="font-heading text-base">Timesatser</h4>
              <p className="text-xs text-muted-foreground">
                For en ansatt med <strong>{fmt(results.arslonn)} kr</strong> i årslønn:
              </p>
              <div className="space-y-3">
                {[
                  { label: "Faktisk timekostnad", value: `${fmt(results.timekostnad)} kr/t`, desc: `Totalkostnad / ${ARBEIDSTIMER_PER_AAR} timer` },
                  { label: "SkatteFUNN-sats", value: `${fmt(results.skattefunnTimesats)} kr/t`, desc: "1,2‰ av årslønn, maks 700 kr/t" },
                  { label: "Forskningsrådet (lav)", value: `${fmt(results.forskLav)} kr/t`, desc: "0,8‰ av årslønn, maks 1 100 kr/t" },
                  { label: "Forskningsrådet (høy)", value: `${fmt(results.forskHoy)} kr/t`, desc: "1,1‰ av årslønn, maks 1 100 kr/t" },
                  { label: "Innovasjon Norge", value: `${fmt(results.innovasjonTimesats)} kr/t`, desc: "1,2‰ av årslønn, maks 700 kr/t" },
                ].map(item => (
                  <div key={item.label} className="rounded-xl border border-border/20 p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{item.label}</span>
                      <span className="font-heading text-sm text-primary">{item.value}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "offentlig" && (
            <div className="space-y-4">
              {/* SkatteFUNN */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="glass rounded-2xl border border-border/20 p-5 space-y-3">
                <h4 className="font-heading text-base">SkatteFUNN</h4>
                <p className="text-xs text-muted-foreground">19% skattefradrag på FoU-kostnader</p>
                <div className="rounded-xl bg-primary/5 border border-primary/20 p-4 text-center">
                  <p className="text-xs text-muted-foreground">Beregnet timesats</p>
                  <p className="font-heading text-2xl text-primary">{fmt(results.skattefunnTimesats)} kr/t</p>
                  <p className="text-[10px] text-muted-foreground">Maks tillatt: 700 kr/time</p>
                </div>
                <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Beregningsfaktor: 1,2‰ av årslønn</li>
                  <li>Maks 700 kr/time</li>
                  <li>Maks 1 850 timer per person per år</li>
                  <li>Maks 25 MNOK i årlig kostnadsgrunnlag</li>
                </ul>
                <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-center">
                  <p className="text-xs text-muted-foreground">Potensielt skattefradrag:</p>
                  <p className="font-heading text-lg text-emerald-600">{fmt(results.skattefunnFradrag)} kr</p>
                  <p className="text-[10px] text-muted-foreground">Ved 1 850 timer</p>
                </div>
                <a href="https://www.forskningsradet.no/skattefunn/" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-primary hover:underline">
                  Les mer om SkatteFUNN <ExternalLink size={10} />
                </a>
              </motion.div>

              {/* Forskningsrådet */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                className="glass rounded-2xl border border-border/20 p-5 space-y-3">
                <h4 className="font-heading text-base">Forskningsrådet</h4>
                <p className="text-xs text-muted-foreground">Innovasjonsprosjekter i næringslivet</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-border/20 p-3 text-center">
                    <p className="text-[10px] text-muted-foreground">Lav overhead (0,8‰)</p>
                    <p className="font-heading text-lg text-primary">{fmt(results.forskLav)} kr/t</p>
                  </div>
                  <div className="rounded-xl border border-border/20 p-3 text-center">
                    <p className="text-[10px] text-muted-foreground">Høy overhead (1,1‰)</p>
                    <p className="font-heading text-lg text-primary">{fmt(results.forskHoy)} kr/t</p>
                  </div>
                </div>
                <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Maks 1 100 kr/time</li>
                  <li>Maks 1 850 timer per person/år</li>
                </ul>
                <a href="https://www.forskningsradet.no/sok-om-finansiering/budsjett/budsjettering-av-personalkostnader/" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-primary hover:underline">
                  Les mer om beregning <ExternalLink size={10} />
                </a>
              </motion.div>

              {/* Innovasjon Norge */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="glass rounded-2xl border border-border/20 p-5 space-y-3">
                <h4 className="font-heading text-base">Innovasjon Norge</h4>
                <p className="text-xs text-muted-foreground">Tilskudd og lån til innovasjon</p>
                <div className="rounded-xl bg-primary/5 border border-primary/20 p-4 text-center">
                  <p className="text-xs text-muted-foreground">Beregnet timesats</p>
                  <p className="font-heading text-2xl text-primary">{fmt(results.innovasjonTimesats)} kr/t</p>
                  <p className="text-[10px] text-muted-foreground">Maks 700 kr/time</p>
                </div>
                <a href="https://www.innovasjonnorge.no/artikkel/godkjente-timesatser" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-primary hover:underline">
                  Les mer hos Innovasjon Norge <ExternalLink size={10} />
                </a>
              </motion.div>

              {/* Viktig info */}
              <div className="glass rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-2">
                <h4 className="font-heading text-sm flex items-center gap-2"><Info size={14} className="text-amber-500" /> Viktig om timesatser</h4>
                <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Timesatsene er veiledende. Din bedrift må dokumentere faktiske kostnader.</li>
                  <li>Arbeid må loggføres med signerte timelister.</li>
                  <li>Ved revisjon må kostnadene kunne gjenfinnes i bedriftens regnskap.</li>
                  <li>Maks timesats og timetall gjelder per person på tvers av alle prosjekter.</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnsettelsesKalkulator;
