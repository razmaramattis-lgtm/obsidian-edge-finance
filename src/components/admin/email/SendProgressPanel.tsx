import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, Mail, CheckCircle2, Clock, AlertTriangle } from "lucide-react";

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

/** Viser fremdrift (sendt / gjenstående / estimert tid) for hver masseutsending. */
export default function SendProgressPanel({ limit = 5 }: { limit?: number }) {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);

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
        const active = Number(b.pending) > 0;
        return (
          <div key={b.batch_id} className="space-y-2 border-t pt-3 first:border-t-0 first:pt-0">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-sm font-medium">
                {b.batch_label || "Utsending"}
                <span className="ml-2 text-xs text-muted-foreground">
                  startet {new Date(b.started_at).toLocaleString("nb-NO", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              <Badge variant={active ? "default" : "secondary"}>{active ? "Pågår" : "Fullført"}</Badge>
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
              {active && (
                <>
                  <span>neste kl. {fmtClock(b.next_scheduled_at)}</span>
                  <span>ferdig ca. kl. {fmtClock(b.last_scheduled_at)}{eta ? ` · ${eta}` : ""}</span>
                </>
              )}
            </div>
          </div>
        );
      })}
    </Card>
  );
}
