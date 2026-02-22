import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Check, X, Clock, Building2, UserPlus } from "lucide-react";
import { toast } from "sonner";

const AdvisorRequestsPanel = ({ onStatusChange }: { onStatusChange?: () => void }) => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [advisors, setAdvisors] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<Record<string, { primary: string; backup: string }>>({});

  const load = async () => {
    const [reqRes, advRes] = await Promise.all([
      supabase
        .from("advisor_requests")
        .select("*, company:customer_companies(id, company_name, primary_advisor_id, backup_advisor_id, profile:profiles!customer_companies_profile_id_fkey(name, email))")
        .order("created_at", { ascending: false }),
      supabase.from("profiles").select("id, name").in("role", ["admin", "employee"]),
    ]);
    setRequests((reqRes.data as any[]) || []);
    setAdvisors((advRes.data as any[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleApprove = async (req: any) => {
    const assign = assignments[req.id];
    if (assign?.primary || assign?.backup) {
      await supabase.from("customer_companies").update({
        primary_advisor_id: assign.primary || null,
        backup_advisor_id: assign.backup || null,
      }).eq("id", req.company_id);
    }
    await supabase.from("advisor_requests").update({ status: "approved" }).eq("id", req.id);
    toast.success("Godkjent og rådgiver tildelt");
    load();
    onStatusChange?.();
  };

  const handleReject = async (id: string) => {
    await supabase.from("advisor_requests").update({ status: "rejected" }).eq("id", id);
    toast.success("Avslått");
    load();
    onStatusChange?.();
  };

  if (loading) return <div className="text-muted-foreground text-sm">Laster…</div>;

  const pending = requests.filter(r => r.status === "pending");
  const handled = requests.filter(r => r.status !== "pending");
  const inputCls = "w-full h-9 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40";

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-heading text-base mb-3 flex items-center gap-2">
          <Clock size={16} className="text-primary" />
          Ventende forespørsler ({pending.length})
        </h3>
        {pending.length === 0 && (
          <div className="glass rounded-2xl p-6 border border-border/20 text-center">
            <UserPlus size={24} className="text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Ingen ventende rådgiverforespørsler</p>
          </div>
        )}
        {pending.map(r => (
          <div key={r.id} className="glass rounded-2xl p-5 border border-primary/20 mb-3 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Building2 size={16} className="text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{r.company?.company_name}</p>
                <p className="text-xs text-muted-foreground">{r.company?.profile?.name} · {r.company?.profile?.email}</p>
                {r.message && <p className="text-xs mt-1 text-foreground/80">«{r.message}»</p>}
                <p className="text-[10px] text-muted-foreground mt-1">
                  {new Date(r.created_at).toLocaleDateString("no-NO", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Oppdragsansvarlig</label>
                <select
                  value={assignments[r.id]?.primary || ""}
                  onChange={e => setAssignments({ ...assignments, [r.id]: { ...assignments[r.id], primary: e.target.value, backup: assignments[r.id]?.backup || "" } })}
                  className={inputCls}
                >
                  <option value="">— Velg —</option>
                  {advisors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Reserve</label>
                <select
                  value={assignments[r.id]?.backup || ""}
                  onChange={e => setAssignments({ ...assignments, [r.id]: { ...assignments[r.id], backup: e.target.value, primary: assignments[r.id]?.primary || "" } })}
                  className={inputCls}
                >
                  <option value="">— Velg —</option>
                  {advisors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => handleApprove(r)}
                className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-xs hover:opacity-90">
                <Check size={13} /> Godkjenn & tildel
              </button>
              <button onClick={() => handleReject(r.id)}
                className="flex items-center gap-1.5 px-4 py-2 border border-destructive/30 text-destructive rounded-xl text-xs hover:bg-destructive/10">
                <X size={13} /> Avslå
              </button>
            </div>
          </div>
        ))}
      </div>

      {handled.length > 0 && (
        <div>
          <h3 className="font-heading text-base mb-3 text-muted-foreground">Behandlet ({handled.length})</h3>
          {handled.map(r => (
            <div key={r.id} className="glass rounded-2xl px-5 py-3 border border-border/20 mb-2 flex items-center justify-between">
              <div>
                <p className="text-sm">{r.company?.company_name}</p>
                <p className="text-[10px] text-muted-foreground">{r.company?.profile?.name}</p>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                r.status === "approved" ? "bg-emerald-500/10 text-emerald-600" : "bg-destructive/10 text-destructive"
              }`}>
                {r.status === "approved" ? "Godkjent" : "Avslått"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdvisorRequestsPanel;
