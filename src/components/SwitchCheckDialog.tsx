import { useState, useMemo } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ArrowRight, ArrowLeft, AlertTriangle, CheckCircle2, TrendingUp, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Option = { label: string; score: number; tag: string };
type Question = { key: string; text: string; options: Option[] };

// Scoring: higher = more reason to switch. Positive answers give 0 points
// (positive tilbakemeldinger vektlegges ikke). Max 125, normalized to /100.
const QUESTIONS: Question[] = [
  {
    key: "frustrasjon",
    text: "Hva frustrerer deg mest med regnskapsføringen din i dag?",
    options: [
      { label: "Sen eller dårlig respons", score: 25, tag: "respons" },
      { label: "Uklare eller uventede priser", score: 25, tag: "pris" },
      { label: "For lite proaktiv rådgivning", score: 25, tag: "rådgivning" },
      { label: "Tungvint systemflyt", score: 25, tag: "system" },
      { label: "Ingenting – alt fungerer godt", score: 0, tag: "ok" },
    ],
  },
  {
    key: "respons",
    text: "Får du svar når du trenger det?",
    options: [
      { label: "Nei, sjelden", score: 25, tag: "respons" },
      { label: "Av og til, men ikke alltid", score: 18, tag: "respons" },
      { label: "Som regel ja", score: 6, tag: "respons" },
      { label: "Ja, alltid og raskt", score: 0, tag: "respons" },
    ],
  },
  {
    key: "forstaelse",
    text: "Føler du at regnskapsføreren forstår bedriften din?",
    options: [
      { label: "Nei", score: 25, tag: "forståelse" },
      { label: "Sånn passe", score: 18, tag: "forståelse" },
      { label: "Ganske godt", score: 6, tag: "forståelse" },
      { label: "Veldig godt", score: 0, tag: "forståelse" },
    ],
  },
  {
    key: "raadgivning",
    text: "Får du rådgivning utover ren bokføring?",
    options: [
      { label: "Nei, kun bokføring", score: 25, tag: "rådgivning" },
      { label: "Veldig sjelden", score: 18, tag: "rådgivning" },
      { label: "Ja, av og til", score: 6, tag: "rådgivning" },
      { label: "Ja, regelmessig", score: 0, tag: "rådgivning" },
    ],
  },
  {
    key: "pris",
    text: "Er prisen forutsigbar?",
    options: [
      { label: "Nei, mye overraskelser", score: 25, tag: "pris" },
      { label: "Sånn passe", score: 18, tag: "pris" },
      { label: "Som regel", score: 6, tag: "pris" },
      { label: "Ja, helt forutsigbar", score: 0, tag: "pris" },
    ],
  },
];

const RECOMMENDATIONS: Record<string, { title: string; body: string }> = {
  respons: {
    title: "Krev tydelig responsløfte",
    body: "En regnskapsfører bør svare deg innen 24 timer på hverdager. Be om et skriftlig SLA før du signerer en ny avtale.",
  },
  pris: {
    title: "Be om fastpris eller pristak",
    body: "Uventede timer er den vanligste kilden til frustrasjon. Få et månedlig fastprisforslag basert på faktisk volum – ikke estimert timepris.",
  },
  rådgivning: {
    title: "Sikre proaktiv rådgivning",
    body: "Du bør ha faste rådgivningsmøter (kvartalsvis eller oftere) der tall og drift kobles sammen. Spør konkret hva som er inkludert.",
  },
  system: {
    title: "Rydd i systemflyten",
    body: "En moderne regnskapsfører setter opp automatisk bilagsflyt, bank- og lønnsintegrasjon. Be om en systemgjennomgang før bytte.",
  },
  forståelse: {
    title: "Velg en bransjekjent rådgiver",
    body: "Bytt til en regnskapsfører som kjenner din bransje. Be om referanser fra tilsvarende selskaper i første møte.",
  },
  ok: {
    title: "Behold det som fungerer",
    body: "Basert på svarene virker det som du har et godt oppsett. Vi anbefaler at du fortsetter med din nåværende leverandør.",
  },
};

const verdictFor = (score: number) => {
  if (score <= 20) return { level: "ok", title: "Alt ser bra ut", desc: "Regnskapsføreren din leverer det du trenger. Ingen umiddelbar grunn til å bytte.", icon: CheckCircle2, tone: "text-emerald-500" };
  if (score <= 45) return { level: "utforsk", title: "Det kan være lurt å utforske alternativer", desc: "Det er noen svake punkter. Undersøk om en annen regnskapsfører kan dekke behovene dine bedre.", icon: AlertTriangle, tone: "text-amber-500" };
  if (score <= 70) return { level: "vurder", title: "Du bør vurdere et bytte", desc: "Flere kritiske områder svikter. Et bytte vil trolig gi bedre drift, tydeligere pris og mer rådgivning.", icon: TrendingUp, tone: "text-orange-500" };
  return { level: "bytt", title: "Tydelig behov for bytte", desc: "Regnskapsføringen din holder deg tilbake. Vi anbefaler at du starter en byttedialog nå.", icon: AlertTriangle, tone: "text-primary" };
};

type Props = { open: boolean; onOpenChange: (v: boolean) => void };

const SwitchCheckDialog = ({ open, onOpenChange }: Props) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const total = QUESTIONS.length;
  const q = QUESTIONS[step];
  const selectedIdx = answers[step];

  const { score, verdict, topTag } = useMemo(() => {
    let s = 0;
    const tagScore: Record<string, number> = {};
    QUESTIONS.forEach((qq, i) => {
      const ai = answers[i];
      if (ai == null) return;
      const opt = qq.options[ai];
      s += opt.score;
      tagScore[opt.tag] = (tagScore[opt.tag] || 0) + opt.score;
    });
    const normalized = Math.round((s / 125) * 100);
    const top = Object.entries(tagScore).sort((a, b) => b[1] - a[1])[0]?.[0] || "ok";
    return { score: normalized, verdict: verdictFor(normalized), topTag: top };
  }, [answers]);

  const reset = () => {
    setStep(0); setAnswers({}); setShowResult(false);
    setName(""); setCompany(""); setEmail(""); setPhone("");
    setBusy(false); setSent(false); setErr(null);
  };

  const close = () => { onOpenChange(false); setTimeout(reset, 300); };

  const next = () => {
    if (selectedIdx == null) return;
    if (step < total - 1) setStep(step + 1);
    else setShowResult(true);
  };

  const submitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setBusy(true); setErr(null);
    try {
      const summary = QUESTIONS.map((qq, i) => {
        const ai = answers[i];
        return `${qq.text} → ${ai != null ? qq.options[ai].label : "—"}`;
      }).join("\n");
      const rec = RECOMMENDATIONS[topTag] || RECOMMENDATIONS.ok;
      const { error } = await supabase.functions.invoke("contact-submit", {
        body: {
          contact_person: name.trim().slice(0, 120),
          company_name: company.trim().slice(0, 160) || null,
          email: email.trim().toLowerCase().slice(0, 255),
          phone: phone.trim().slice(0, 40) || null,
          source: `bytte-sjekk:${verdict.level}:${score}`,
          referrer: typeof document !== "undefined" ? document.referrer.slice(0, 500) : null,
          message: `Bytte-sjekk resultat: ${score}/100 – ${verdict.title}\nAnbefaling: ${rec.title}\n\n${summary}`.slice(0, 2000),
        },
      });
      if (error) throw error;
      setSent(true);
    } catch (e2) {
      console.error(e2);
      setErr("Noe gikk galt. Prøv igjen eller send e-post til kontakt@avargo.no");
    } finally {
      setBusy(false);
    }
  };

  const rec = RECOMMENDATIONS[topTag] || RECOMMENDATIONS.ok;
  const progress = showResult ? 100 : Math.round(((step) / total) * 100);

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) close(); else onOpenChange(v); }}>
      <DialogContent className="max-w-lg p-0 gap-0 border-border/20 bg-background">
        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-muted-foreground">
              {showResult ? "Resultat" : `Spørsmål ${step + 1} av ${total}`}
            </span>
            {!showResult && <span className="text-xs font-medium text-muted-foreground">{Math.round(((step + (selectedIdx != null ? 1 : 0)) / total) * 100)}%</span>}
          </div>
          {!showResult && (
            <div className="h-1 w-full rounded-full bg-muted/40 overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${Math.round(((step + (selectedIdx != null ? 1 : 0)) / total) * 100)}%` }}
              />
            </div>
          )}
        </div>

        {/* Body */}
        {!showResult ? (
          <div className="px-6 pb-6">
            <h3 className="text-lg md:text-xl font-semibold text-foreground mb-5 leading-snug">
              {q.text}
            </h3>
            <div className="space-y-2.5">
              {q.options.map((opt, i) => {
                const active = selectedIdx === i;
                return (
                  <button
                    key={i}
                    onClick={() => setAnswers({ ...answers, [step]: i })}
                    className={`w-full text-left px-4 py-3.5 rounded-xl border transition-all flex items-center gap-3 ${
                      active
                        ? "border-primary bg-primary/5 text-foreground"
                        : "border-border/20 hover:border-border/40 text-foreground/80"
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
                        active ? "border-primary" : "border-border/40"
                      }`}
                    >
                      {active && <span className="w-2 h-2 rounded-full bg-primary" />}
                    </span>
                    <span className="text-sm">{opt.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between mt-6">
              <button
                onClick={() => setStep(Math.max(0, step - 1))}
                disabled={step === 0}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border/20 text-sm font-medium hover:border-border/40 transition-colors disabled:opacity-40 disabled:pointer-events-none"
              >
                <ArrowLeft size={14} /> Tilbake
              </button>
              <button
                onClick={next}
                disabled={selectedIdx == null}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:scale-[1.02] transition-all disabled:opacity-40 disabled:pointer-events-none glow-rose"
              >
                {step === total - 1 ? "Se resultat" : "Neste"} <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ) : (
          <div className="px-6 pb-6">
            <div className="text-center mb-5">
              <div className={`inline-flex w-14 h-14 rounded-full bg-primary/10 items-center justify-center mb-4 ${verdict.tone}`}>
                <verdict.icon size={26} strokeWidth={1.75} />
              </div>
              <div className="text-4xl md:text-5xl font-bold text-foreground mb-1">
                {score}<span className="text-xl text-muted-foreground font-medium">/100</span>
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-foreground mb-1.5">{verdict.title}</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">{verdict.desc}</p>
            </div>

            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 md:p-5 mb-5">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Sparkles size={16} className="text-primary" strokeWidth={1.75} />
                </div>
                <div>
                  <p className="text-xs font-medium text-primary uppercase tracking-wide mb-1">Vår anbefaling</p>
                  <p className="text-sm font-semibold text-foreground mb-1">{rec.title}</p>
                  <p className="text-sm text-foreground/75 leading-relaxed">{rec.body}</p>
                </div>
              </div>
            </div>

            {sent ? (
              <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5 text-center">
                <CheckCircle2 className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium text-foreground">Takk! Vi tar kontakt innen 24 timer.</p>
                <p className="text-xs text-muted-foreground mt-1">Vi har fått resultatet og ringer for en uforpliktende prat.</p>
              </div>
            ) : (
              <form onSubmit={submitLead} className="rounded-2xl border border-border/15 bg-muted/20 p-4 md:p-5 space-y-3">
                <div>
                  <p className="text-sm font-semibold text-foreground mb-0.5">Vil du at vi tar kontakt?</p>
                  <p className="text-xs text-muted-foreground">Legg igjen kontaktinfo, så tar vi en prat om resultatet ditt.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <label className="block">
                    <span className="text-xs font-medium text-foreground/80">Navn *</span>
                    <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Ditt navn"
                      className="mt-1 w-full h-10 px-3 rounded-lg border border-border/20 bg-background text-sm focus:border-primary/50 focus:outline-none" />
                  </label>
                  <label className="block">
                    <span className="text-xs font-medium text-foreground/80">Bedrift</span>
                    <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Firmanavn eller org.nr."
                      className="mt-1 w-full h-10 px-3 rounded-lg border border-border/20 bg-background text-sm focus:border-primary/50 focus:outline-none" />
                  </label>
                  <label className="block">
                    <span className="text-xs font-medium text-foreground/80">E-post *</span>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="din@epost.no"
                      className="mt-1 w-full h-10 px-3 rounded-lg border border-border/20 bg-background text-sm focus:border-primary/50 focus:outline-none" />
                  </label>
                  <label className="block">
                    <span className="text-xs font-medium text-foreground/80">Telefon</span>
                    <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="12345678"
                      className="mt-1 w-full h-10 px-3 rounded-lg border border-border/20 bg-background text-sm focus:border-primary/50 focus:outline-none" />
                  </label>
                </div>
                {err && <p className="text-xs text-destructive">{err}</p>}
                <button type="submit" disabled={busy || !name.trim() || !email.trim()}
                  className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:scale-[1.01] transition-all disabled:opacity-50 disabled:pointer-events-none glow-rose">
                  {busy ? "Sender…" : "Send inn"} <ArrowRight size={14} />
                </button>
              </form>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SwitchCheckDialog;
