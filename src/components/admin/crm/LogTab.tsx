import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, RefreshCw, Mail } from "lucide-react";

interface SyncRow { id: string; run_at: string; mode: string; fetched: number; inserted: number; updated: number; status: string; error_message: string | null }
interface MailRow { id: string; created_at: string; recipient_email: string; subject: string; status: string; automated: boolean; error_message: string | null }

const fmt = (d: string) => new Date(d).toLocaleString("nb-NO", { dateStyle: "short", timeStyle: "short" });

const LogTab = () => {
  const [syncs, setSyncs] = useState<SyncRow[]>([]);
  const [mails, setMails] = useState<MailRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [{ data: s }, { data: m }] = await Promise.all([
        supabase.from("crm_sync_log").select("*").order("run_at", { ascending: false }).limit(30),
        supabase.from("crm_email_events").select("*").order("created_at", { ascending: false }).limit(60),
      ]);
      setSyncs((s as SyncRow[]) || []);
      setMails((m as MailRow[]) || []);
      setLoading(false);
    })();
  }, []);

  if (loading) return <Card className="p-8 text-center"><Loader2 className="animate-spin mx-auto" size={18} /></Card>;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="p-4">
        <p className="text-sm font-medium flex items-center gap-2 mb-3"><RefreshCw size={14} />Synkroniseringer</p>
        {syncs.length === 0 ? <p className="text-xs text-muted-foreground">Ingen kjøringer enda.</p> : (
          <div className="divide-y divide-border/40">
            {syncs.map((r) => (
              <div key={r.id} className="py-2 text-xs">
                <div className="flex items-center gap-2">
                  <Badge variant={r.status === "error" ? "destructive" : "secondary"} className="text-[10px]">{r.status}</Badge>
                  <span className="text-muted-foreground">{fmt(r.run_at)}</span>
                  <span className="ml-auto text-muted-foreground">{r.mode}</span>
                </div>
                <p className="text-muted-foreground mt-1">{r.fetched} hentet · {r.inserted} nye · {r.updated} oppdatert</p>
                {r.error_message && <p className="text-destructive mt-1">{r.error_message}</p>}
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card className="p-4">
        <p className="text-sm font-medium flex items-center gap-2 mb-3"><Mail size={14} />Sendte e-poster</p>
        {mails.length === 0 ? <p className="text-xs text-muted-foreground">Ingen e-post sendt enda.</p> : (
          <div className="divide-y divide-border/40">
            {mails.map((r) => (
              <div key={r.id} className="py-2 text-xs">
                <div className="flex items-center gap-2">
                  <Badge variant={r.status === "failed" ? "destructive" : "secondary"} className="text-[10px]">{r.status}</Badge>
                  <span className="truncate">{r.recipient_email}</span>
                  {r.automated && <Badge variant="outline" className="text-[10px]">autopilot</Badge>}
                  <span className="ml-auto text-muted-foreground shrink-0">{fmt(r.created_at)}</span>
                </div>
                <p className="text-muted-foreground mt-1 truncate">{r.subject}</p>
                {r.error_message && <p className="text-destructive mt-1">{r.error_message}</p>}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default LogTab;
