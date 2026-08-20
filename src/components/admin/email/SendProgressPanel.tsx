import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { RefreshCw, Mail, CheckCircle2, Clock, AlertTriangle, Pause, Play, RotateCcw, ChevronDown } from "lucide-react";
import BatchErrorLog from "./BatchErrorLog";

type Batch = {
  batch_id: string;
  batch_label: string | null;
  started_at: string;
  total: number;
  sent: number;
  failed: number;
  pending: number;
  next_scheduled_at: string | null;
  last_scheduled_at: string | null;
  status: string | null;
  paused_seconds: number | null;
};

const fmtClock = (iso: string | null) =>
  iso ? new Date(iso).toLocaleTimeString("nb-NO", { hour: "2-digit", minute: "2-digit" }) : "–";

const fmtRemaining = (iso: string | null) => {
  if (!iso) return null;
  const ms = new Date(iso).getTime() - Date.now();
  if (ms <= 0) return "under utsending";
  const min = Math.round(ms / 60000);
  if (min < 60) return `ca. ${min} min igjen`;
  const h = Math.floor(min / 60);
  return `ca. ${h} t ${min % 60} min igjen`;
};

/** Viser fremdrift, pause/gjenoppta og feillogg for hver masseutsending. */
export default function SendProgressPanel({ limit = 5 }: { limit?: number }) {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [openLog, setOpenLog] = useState<string | null>(null);

  const load = async () => {
    const { data, error } = await supabase.rpc("email_batch_progress" as any, { _limit: limit });
    if (!error) setBatches(((data as unknown) as Batch[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 30000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit]);

  const togglePause = async (batchId: string, paused: boolean) => {
    setBusy(batchId);
    const { error } = await supabase.rpc("email_batch_set_paused" as any, {
      _batch_id: batchId,
      _paused: paused,
    });
    setBusy(null);
    if (error) {
      toast.error(error.message || "Kunne ikke endre status");
      return;
    }
    toast.success(paused ? "Utsending satt på pause – fremdriften er beholdt" : "Utsending gjenopptatt");
    load();
  };

  const retryFailed = async (batchId: string) => {
    setBusy(batchId);
    const { data, error } = await supabase.rpc("requeue_failed_batch" as any, {
      _batch_id: batchId,
      _limit: 500,
    });
    setBusy(null);
    if (error) {
      toast.error(error.message || "Kunne ikke starte nytt forsøk");
      return;
    }
    const count = Number(data ?? 0);
    toast[count > 0 ? "success" : "info"](
      count > 0 ? `${count} e-poster lagt i kø for nytt forsøk` : "Ingen e-poster klare for nytt forsøk ennå"
    );
    load();
  };

  if (loading || !batches.length) return null;

  return (
    <Card className="p-4 rounded-xl space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Mail className="h-4 w-4" /> Fremdrift masseutsending
        </h3>
        <Button variant="ghost" size="sm" onClick={load}>
          <RefreshCw className="h-3.5 w-3.5" />
        </Button>
      </div>

      {batches.map((b) => {
        const done = Number(b.sent) + Number(b.failed);
        const total = Number(b.total) || 1;
        const pct = Math.round((done / total) * 100);
        const eta = fmtRemaining(b.last_scheduled_at);
        const paused = b.status === "paused";
        const active = Number(b.pending) > 0;
        const isBusy = busy === b.batch_id;
        return (
          <div key={b.batch_id} className="space-y-2 border-t pt-3 first:border-t-0 first:pt-0">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-sm font-medium">
                {b.batch_label || "Utsending"}
                <span className="ml-2 text-xs text-muted-foreground">
                  startet {new Date(b.started_at).toLocaleString("nb-NO", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              <Badge variant={paused ? "outline" : active ? "default" : "secondary"}>
                {paused ? "Pauset" : active ? "Pågår" : "Fullført"}
              </Badge>
            </div>

            <Progress value={pct} className="h-2" />

            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1 text-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> {b.sent} sendt
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> {b.pending} gjenstår
              </span>
              {Number(b.failed) > 0 && (
                <span className="flex items-center gap-1 text-destructive">
                  <AlertTriangle className="h-3.5 w-3.5" /> {b.failed} feilet
                </span>
              )}
              <span>av {b.total} totalt ({pct}%)</span>
              {active && !paused && (
                <>
                  <span>neste kl. {fmtClock(b.next_scheduled_at)}</span>
                  <span>ferdig ca. kl. {fmtClock(b.last_scheduled_at)}{eta ? ` · ${eta}` : ""}</span>
                </>
              )}
              {paused && <span>Utsendingen står i kø og fortsetter der den slapp når du gjenopptar.</span>}
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              {active && (
                <Button
                  variant={paused ? "default" : "outline"}
                  size="sm"
                  disabled={isBusy}
                  onClick={() => togglePause(b.batch_id, !paused)}
                  className="gap-1.5"
                >
                  {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
                  {paused ? "Gjenoppta" : "Pause"}
                </Button>
              )}
              {Number(b.failed) > 0 && (
                <Button variant="outline" size="sm" disabled={isBusy} onClick={() => retryFailed(b.batch_id)} className="gap-1.5">
                  <RotateCcw className="h-3.5 w-3.5" /> Prøv feilede på nytt
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5"
                onClick={() => setOpenLog(openLog === b.batch_id ? null : b.batch_id)}
              >
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${openLog === b.batch_id ? "rotate-180" : ""}`} />
                Feillogg
              </Button>
            </div>

            {openLog === b.batch_id && <BatchErrorLog batchId={b.batch_id} />}
          </div>
        );
      })}
    </Card>
  );
}
