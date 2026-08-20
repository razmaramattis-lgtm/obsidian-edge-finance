import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle2, Clock, Database, Loader2, PauseCircle, PlayCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface ImportState {
  status: string;
  processed: number | null;
  imported: number | null;
  error_message: string | null;
  started_at: string | null;
  last_run_at: string | null;
  finished_at: string | null;
  cursor_date: string | null;
}

interface SyncErrorRow {
  id: string;
  run_at: string;
  mode: string | null;
  status: string;
  error_message: string | null;
}

const FLOOR_YEAR = 1900;
const nb = (n: number | null | undefined) => Number(n || 0).toLocaleString("nb-NO");
const fmt = (d?: string | null) =>
  d ? new Date(d).toLocaleString("nb-NO", { dateStyle: "short", timeStyle: "short" }) : "–";

const since = (d?: string | null) => {
  if (!d) return "–";
  const mins = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
  if (mins < 1) return "nå nettopp";
  if (mins < 60) return `for ${mins} min siden`;
  const h = Math.floor(mins / 60);
  if (h < 24) return `for ${h} t siden`;
  return `for ${Math.floor(h / 24)} d siden`;
};

const statusMeta = (s?: string) => {
  switch (s) {
    case "running": return { label: "Kjører", cls: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30" };
    case "done": return { label: "Fullført", cls: "bg-primary/15 text-primary border-primary/30" };
    case "error": return { label: "Feilet", cls: "bg-destructive/15 text-destructive border-destructive/30" };
    case "stopped":
    case "paused": return { label: "På pause", cls: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30" };
    default: return { label: s || "Ikke startet", cls: "bg-muted text-muted-foreground border-border" };
  }
};

const ImportStatusPanel = ({ onChanged }: { onChanged?: () => void }) => {
  const [state, setState] = useState<ImportState | null>(null);
  const [errors, setErrors] = useState<SyncErrorRow[]>([]);
  const [totalLeads, setTotalLeads] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const [{ data: st }, { data: errs }, { data: statRow }] = await Promise.all([
      supabase.from("crm_import_state" as any).select("*").eq("id", 1).maybeSingle(),
      supabase.from("crm_sync_log").select("id,run_at,mode,status,error_message")
        .neq("status", "ok").order("run_at", { ascending: false }).limit(5),
      // Eksakt total fra hurtigbuffer – estimatet fra PostgREST blir feil pga. RLS-filteret
      supabase.from("crm_stats_cache").select("value").eq("key", "total").maybeSingle(),
    ]);
    setState((st as unknown as ImportState) || null);
    setErrors((errs as unknown as SyncErrorRow[]) || []);
    setTotalLeads(statRow ? Number((statRow as any).value) : null);

    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(load, 20000);
    return () => clearInterval(t);
  }, [load]);

  const control = async (action: "start" | "stop") => {
    setBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke("crm-brreg-bulk-import", { body: { action } });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      toast.success(action === "start" ? "Full import startet – fortsetter automatisk" : "Full import satt på pause");
      await load();
      onChanged?.();
    } catch (e: any) {
      toast.error(e.message || "Kunne ikke endre importen");
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-3 flex items-center gap-2 text-xs text-muted-foreground">
        <Loader2 size={14} className="animate-spin" /> Henter importstatus …
      </Card>
    );
  }

  const running = state?.status === "running";
  const meta = statusMeta(state?.status);

  // Importen går bakover i tid fra i dag til FLOOR_YEAR – cursor_date viser hvor langt den har kommet.
  const now = new Date();
  const floor = new Date(`${FLOOR_YEAR}-01-01`);
  const cursor = state?.cursor_date ? new Date(state.cursor_date) : null;
  const span = now.getTime() - floor.getTime();
  const donePct = cursor ? Math.min(100, Math.max(0, ((now.getTime() - cursor.getTime()) / span) * 100)) : 0;
  const remainingYears = cursor ? Math.max(0, cursor.getFullYear() - FLOOR_YEAR) : null;

  return (
    <Card className="p-3 space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Database size={15} className="text-primary" />
        <p className="text-xs font-semibold">Bulkimport fra Enhetsregisteret</p>
        <Badge variant="outline" className={`text-[10px] ${meta.cls}`}>
          {running && <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-current animate-pulse" />}
          {meta.label}
        </Badge>
        <div className="flex-1" />
        <Button size="sm" variant="ghost" className="h-8 text-xs" onClick={load} aria-label="Oppdater importstatus">
          <RefreshCw size={13} className="mr-1.5" />Oppdater
        </Button>
        <Button size="sm" variant={running ? "outline" : "default"} className="h-8 text-xs" disabled={busy}
          onClick={() => control(running ? "stop" : "start")}>
          {busy ? <Loader2 size={13} className="mr-1.5 animate-spin" />
            : running ? <PauseCircle size={13} className="mr-1.5" /> : <PlayCircle size={13} className="mr-1.5" />}
          {running ? "Pause import" : "Start import"}
        </Button>
      </div>

      <div className="space-y-1.5">
        <Progress value={donePct} className="h-2" />
        <div className="flex flex-wrap justify-between gap-2 text-[11px] text-muted-foreground">
          <span>
            Kommet til <b className="text-foreground">
              {cursor ? cursor.toLocaleDateString("nb-NO", { dateStyle: "medium" }) : "ikke startet"}
            </b> · {donePct.toFixed(1)} % av tidslinjen ferdig
          </span>
          <span>
            Gjenstår: <b className="text-foreground">
              {remainingYears === null ? "–" : `${cursor!.getFullYear()} → ${FLOOR_YEAR} (ca. ${remainingYears} år)`}
            </b>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {[
          { label: "Selskaper i basen", value: nb(totalLeads) },
          { label: "Enheter lest", value: nb(state?.processed) },
          { label: "Nye lagret", value: nb(state?.imported) },
          { label: "Startet", value: fmt(state?.started_at) },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border/70 bg-muted/30 px-2.5 py-2">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{s.label}</p>
            <p className="text-sm font-semibold text-foreground truncate">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <Clock size={11} />Siste vellykkede kjøring: <b className="text-foreground">{fmt(state?.last_run_at)}</b> ({since(state?.last_run_at)})
        </span>
        {state?.finished_at && (
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 size={11} />Fullført {fmt(state.finished_at)}
          </span>
        )}
      </div>

      {state?.error_message && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-2.5 py-2 text-[11px] text-destructive flex gap-1.5">
          <AlertTriangle size={12} className="mt-0.5 shrink-0" />
          <span className="break-words">Siste importfeil: {state.error_message}</span>
        </div>
      )}

      {errors.length > 0 && (
        <div className="rounded-xl border border-border/70 p-2.5">
          <p className="text-[11px] font-semibold mb-1.5 flex items-center gap-1">
            <AlertTriangle size={11} className="text-amber-500" />Siste feilhendelser
          </p>
          <ul className="space-y-1">
            {errors.map((e) => (
              <li key={e.id} className="text-[11px] text-muted-foreground flex flex-wrap gap-x-2">
                <span className="text-foreground">{fmt(e.run_at)}</span>
                <span className="uppercase">{e.mode || "sync"}</span>
                <span className="break-words">{e.error_message || e.status}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
};

export default ImportStatusPanel;
