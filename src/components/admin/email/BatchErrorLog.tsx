import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

type ErrorRow = {
  recipient_email: string;
  status: string;
  error_message: string | null;
  attempts: number;
  last_attempt_at: string;
};

const statusLabel: Record<string, string> = {
  failed: "Feilet (prøver igjen)",
  dlq: "Endelig feilet",
  bounced: "Avvist av mottaker",
  rate_limited: "Ratebegrenset",
  suppressed: "Blokkert (avmeldt)",
  retried: "Sendt til nytt forsøk",
};

const statusVariant = (s: string) =>
  s === "dlq" || s === "bounced" ? "destructive" : s === "retried" ? "default" : "secondary";

/** Detaljert feillogg per mottaker for én masseutsending. */
export default function BatchErrorLog({ batchId }: { batchId: string }) {
  const [rows, setRows] = useState<ErrorRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    supabase
      .rpc("email_batch_errors" as any, { _batch_id: batchId, _limit: 200 })
      .then(({ data }) => {
        if (!active) return;
        setRows(((data as unknown) as ErrorRow[]) || []);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [batchId]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-3 text-xs text-muted-foreground">
        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Henter feillogg...
      </div>
    );
  }

  if (!rows.length) {
    return <p className="py-3 text-xs text-muted-foreground">Ingen feil registrert i denne utsendingen.</p>;
  }

  return (
    <div className="max-h-72 overflow-y-auto rounded-lg border">
      <table className="w-full text-xs">
        <thead className="sticky top-0 bg-muted/70 text-left">
          <tr>
            <th className="px-3 py-2 font-medium">Mottaker</th>
            <th className="px-3 py-2 font-medium">Status</th>
            <th className="px-3 py-2 font-medium">Forsøk</th>
            <th className="px-3 py-2 font-medium">Sist</th>
            <th className="px-3 py-2 font-medium">Feilmelding</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.recipient_email} className="border-t align-top">
              <td className="px-3 py-2 break-all">{r.recipient_email}</td>
              <td className="px-3 py-2">
                <Badge variant={statusVariant(r.status) as any} className="whitespace-nowrap">
                  {statusLabel[r.status] || r.status}
                </Badge>
              </td>
              <td className="px-3 py-2">{r.attempts}</td>
              <td className="px-3 py-2 whitespace-nowrap">
                {new Date(r.last_attempt_at).toLocaleString("nb-NO", {
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </td>
              <td className="px-3 py-2 text-muted-foreground break-all">{r.error_message || "–"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
