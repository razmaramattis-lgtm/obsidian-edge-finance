import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, RefreshCw, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Users, Building2 } from "lucide-react";
import { toast } from "sonner";

type Flag = { level: "good" | "warn" | "bad"; text: string };

type YearRow = {
  year: number | null; from: string | null; to: string | null; currency: string;
  accounting_type: string | null; plan: string | null; rules: string | null;
  small_company: boolean | null; audited: boolean | null; audit_opted_out: boolean | null;
  revenue: number | null; other_income: number | null; operating_cost: number | null; payroll_cost: number | null;
  operating_result: number | null; financial_income: number | null; financial_cost: number | null;
  profit_before_tax: number | null; tax: number | null; net_result: number | null;
  total_assets: number | null; current_assets: number | null; fixed_assets: number | null;
  equity: number | null; paid_in_equity: number | null; retained_equity: number | null;
  total_debt: number | null; short_term_debt: number | null; long_term_debt: number | null;
  operating_margin: number | null; net_margin: number | null; equity_ratio: number | null;
  liquidity_ratio: number | null; return_on_equity: number | null; return_on_assets: number | null;
};

type Result = {
  company: Record<string, any>;
  years: YearRow[];
  summary: {
    score: number; verdict: string; latest_year: number | null; revenue_growth: number | null;
    revenue_per_employee: number | null; payroll_share: number | null;
    positive_years: number; years_available: number; flags: Flag[];
  } | null;
  fetched_at: string;
};

const nok = (v: number | null | undefined) =>
  typeof v === "number" ? new Intl.NumberFormat("nb-NO", { maximumFractionDigits: 0 }).format(v) : "–";
const pctText = (v: number | null | undefined) => (typeof v === "number" ? `${v.toLocaleString("nb-NO")} %` : "–");

const ROWS: { label: string; key: keyof YearRow; kind?: "pct" | "ratio" }[] = [
  { label: "Driftsinntekter", key: "revenue" },
  { label: "Annen driftsinntekt", key: "other_income" },
  { label: "Driftskostnader", key: "operating_cost" },
  { label: "Lønnskostnad", key: "payroll_cost" },
  { label: "Driftsresultat", key: "operating_result" },
  { label: "Finansinntekter", key: "financial_income" },
  { label: "Finanskostnader", key: "financial_cost" },
  { label: "Resultat før skatt", key: "profit_before_tax" },
  { label: "Årsresultat", key: "net_result" },
  { label: "Sum eiendeler", key: "total_assets" },
  { label: "Omløpsmidler", key: "current_assets" },
  { label: "Anleggsmidler", key: "fixed_assets" },
  { label: "Egenkapital", key: "equity" },
  { label: "Innskutt egenkapital", key: "paid_in_equity" },
  { label: "Opptjent egenkapital", key: "retained_equity" },
  { label: "Sum gjeld", key: "total_debt" },
  { label: "Kortsiktig gjeld", key: "short_term_debt" },
  { label: "Langsiktig gjeld", key: "long_term_debt" },
  { label: "Driftsmargin", key: "operating_margin", kind: "pct" },
  { label: "Resultatgrad", key: "net_margin", kind: "pct" },
  { label: "Egenkapitalandel", key: "equity_ratio", kind: "pct" },
  { label: "Likviditetsgrad 1", key: "liquidity_ratio", kind: "ratio" },
  { label: "Egenkapitalrentabilitet", key: "return_on_equity", kind: "pct" },
  { label: "Totalrentabilitet", key: "return_on_assets", kind: "pct" },
];

export default function FinancialsDialog({
  open, onOpenChange, orgnr, leadId, name, onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  orgnr: string;
  leadId?: string;
  name?: string;
  onSaved?: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Result | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data: res, error } = await supabase.functions.invoke("crm-financials", { body: { orgnr, leadId } });
      if (error) throw error;
      if ((res as any)?.error) throw new Error((res as any).error);
      setData(res as Result);
      onSaved?.();
    } catch (e: any) {
      toast.error(e.message || "Kunne ikke hente regnskapstall");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) { setData(null); load(); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, orgnr]);

  const s = data?.summary;
  const c = data?.company;
  const scoreColor = !s ? "" : s.score >= 75 ? "text-emerald-600 dark:text-emerald-400"
    : s.score >= 55 ? "text-primary" : s.score >= 35 ? "text-amber-600 dark:text-amber-400" : "text-destructive";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[88vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <TrendingUp size={16} className="text-primary" />
            Regnskap og lønnsomhet – {name || c?.name || orgnr}
          </DialogTitle>
        </DialogHeader>

        {loading && !data ? (
          <div className="py-16 text-center text-sm text-muted-foreground">
            <Loader2 className="animate-spin mx-auto mb-2" size={18} />
            Henter fra Brønnøysundregistrene …
          </div>
        ) : !data ? (
          <div className="py-10 text-center text-sm text-muted-foreground">Ingen data.</div>
        ) : (
          <div className="space-y-5">
            {/* selskapsfakta */}
            <div className="grid sm:grid-cols-3 gap-2 text-xs">
              <div className="rounded-xl border border-border/60 p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-muted-foreground"><Building2 size={12} />Selskap</div>
                <div className="font-medium">{c?.name || "–"}</div>
                <div className="text-muted-foreground">{c?.orgnr} · {c?.org_form_text || c?.org_form || "–"}</div>
                <div className="text-muted-foreground">{c?.industry_text || "Ukjent bransje"}</div>
                <div className="text-muted-foreground">{c?.address || "–"}</div>
              </div>
              <div className="rounded-xl border border-border/60 p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-muted-foreground"><Users size={12} />Ansatte og roller</div>
                <div className="font-medium">{typeof c?.employees === "number" ? `${c.employees} ansatte` : "Ansatte ikke registrert"}</div>
                <div className="text-muted-foreground">Daglig leder: {c?.ceo || "–"}</div>
                <div className="text-muted-foreground">Styreleder: {c?.chair || "–"}</div>
                <div className="text-muted-foreground">Regnskapsfører: {c?.accountant || "Ingen registrert"}</div>
                <div className="text-muted-foreground">Revisor: {c?.auditor || "Ingen registrert"}</div>
              </div>
              <div className="rounded-xl border border-border/60 p-3 space-y-1">
                <div className="text-muted-foreground">Registrert / stiftet</div>
                <div className="font-medium">{c?.registered_at || "–"}{c?.founded_at ? ` · stiftet ${c.founded_at}` : ""}</div>
                <div className="text-muted-foreground">MVA-registrert: {c?.vat_registered ? "ja" : "nei"}</div>
                {(c?.bankrupt || c?.under_liquidation) && (
                  <Badge variant="outline" className="text-[10px] text-destructive border-destructive/40">
                    {c?.bankrupt ? "Konkurs" : "Under avvikling"}
                  </Badge>
                )}
                {c?.website && <div className="truncate"><a className="text-primary" href={c.website.startsWith("http") ? c.website : `https://${c.website}`} target="_blank" rel="noreferrer">{c.website}</a></div>}
              </div>
            </div>

            {/* analyse */}
            {s ? (
              <div className="rounded-xl border border-border/60 p-4">
                <div className="flex flex-wrap items-center gap-4">
                  <div>
                    <div className={`text-3xl font-semibold ${scoreColor}`}>{s.score}<span className="text-base text-muted-foreground">/100</span></div>
                    <div className="text-xs text-muted-foreground">Lønnsomhetsscore</div>
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium">{s.verdict}</div>
                    <div className="text-xs text-muted-foreground">
                      Basert på {s.years_available} regnskapsår (siste: {s.latest_year ?? "–"}) · {s.positive_years} år med overskudd
                    </div>
                  </div>
                  <div className="ml-auto grid grid-cols-3 gap-4 text-xs">
                    <div>
                      <div className="text-muted-foreground">Omsetningsvekst</div>
                      <div className={`font-medium ${(s.revenue_growth ?? 0) < 0 ? "text-destructive" : ""}`}>{pctText(s.revenue_growth)}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Oms. pr. ansatt</div>
                      <div className="font-medium">{s.revenue_per_employee ? `${nok(s.revenue_per_employee)} kr` : "–"}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Lønnsandel</div>
                      <div className="font-medium">{pctText(s.payroll_share)}</div>
                    </div>
                  </div>
                </div>
                <ul className="mt-3 space-y-1.5">
                  {s.flags.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs">
                      {f.level === "good" ? <CheckCircle2 size={13} className="mt-px text-emerald-600 dark:text-emerald-400 shrink-0" />
                        : f.level === "warn" ? <AlertTriangle size={13} className="mt-px text-amber-600 dark:text-amber-400 shrink-0" />
                        : <TrendingDown size={13} className="mt-px text-destructive shrink-0" />}
                      <span>{f.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border/60 p-4 text-sm text-muted-foreground">
                Ingen årsregnskap er publisert i Regnskapsregisteret for dette selskapet (typisk for enkeltpersonforetak og helt nystartede selskaper).
              </div>
            )}

            {/* alle år */}
            {!!data.years.length && (
              <div className="overflow-x-auto rounded-xl border border-border/60">
                <table className="w-full text-xs">
                  <thead className="bg-muted/40 text-muted-foreground">
                    <tr>
                      <th className="text-left font-medium px-3 py-2">Tall i {data.years[0].currency}</th>
                      {data.years.map((y) => (
                        <th key={y.year} className="text-right font-medium px-3 py-2 whitespace-nowrap">
                          {y.year}
                          <div className="text-[9px] font-normal">{y.from?.slice(5)} – {y.to?.slice(5)}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {ROWS.map((r) => (
                      <tr key={r.key as string} className="hover:bg-muted/20">
                        <td className="px-3 py-1.5 text-muted-foreground whitespace-nowrap">{r.label}</td>
                        {data.years.map((y) => {
                          const v = y[r.key] as number | null;
                          const neg = typeof v === "number" && v < 0;
                          return (
                            <td key={y.year} className={`px-3 py-1.5 text-right tabular-nums ${neg ? "text-destructive" : ""}`}>
                              {r.kind === "pct" ? pctText(v) : r.kind === "ratio" ? (typeof v === "number" ? v.toLocaleString("nb-NO") : "–") : nok(v)}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                    <tr className="bg-muted/20">
                      <td className="px-3 py-1.5 text-muted-foreground">Revidert / regnskapsregler</td>
                      {data.years.map((y) => (
                        <td key={y.year} className="px-3 py-1.5 text-right text-[10px] text-muted-foreground">
                          {y.audited === null ? "–" : y.audited ? "revidert" : "ikke revidert"}
                          {y.rules ? ` · ${y.rules}` : ""}{y.small_company ? " · små foretak" : ""}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground">
                Kilde: Regnskapsregisteret og Enhetsregisteret · hentet {new Date(data.fetched_at).toLocaleString("nb-NO")}
              </span>
              <Button size="sm" variant="outline" onClick={load} disabled={loading}>
                {loading ? <Loader2 size={14} className="mr-1.5 animate-spin" /> : <RefreshCw size={14} className="mr-1.5" />}
                Oppdater
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
