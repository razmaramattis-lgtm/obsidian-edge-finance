import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Check, X, Clock, Building2, Handshake } from "lucide-react";
import { toast } from "sonner";

interface PartnerRequest {
  id: string;
  agreement_id: string;
  company_id: string;
  status: string;
  message: string | null;
  admin_note: string;
  created_at: string;
  agreement?: { title: string; company: string | null };
  company?: { company_name: string };
}

const PartnerRequestsPanel = ({ onStatusChange }: { onStatusChange?: () => void }) => {
  const [requests, setRequests] = useState<PartnerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [noteInputs, setNoteInputs] = useState<Record<string, string>>({});

  const load = async () => {
    const { data } = await supabase
      .from("partnership_requests")
      .select("*, agreement:collaboration_agreements(title, company), company:customer_companies(company_name)")
      .order("created_at", { ascending: false });
    setRequests((data as any[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const note = noteInputs[id] || null;
    await supabase.from("partnership_requests").update({ status, admin_note: note }).eq("id", id);
    toast.success(status === "approved" ? "Godkjent" : "Avslått");
    load();
    onStatusChange?.();
  };

  if (loading) return <div className="text-muted-foreground text-sm">Laster…</div>;

  const pending = requests.filter(r => r.status === "pending");
  const handled = requests.filter(r => r.status !== "pending");

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-heading text-base mb-3 flex items-center gap-2">
          <Clock size={16} className="text-primary" />
          Ventende forespørsler ({pending.length})
        </h3>
        {pending.length === 0 && (
          <div className="glass rounded-2xl p-6 border border-border/20 text-center">
            <Handshake size={24} className="text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Ingen ventende forespørsler</p>
          </div>
        )}
        {pending.map(r => (
          <div key={r.id} className="glass rounded-2xl p-5 border border-primary/20 mb-3 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Building2 size={16} className="text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{(r as any).company?.company_name}</p>
                <p className="text-xs text-muted-foreground">ønsker: <span className="text-foreground font-medium">{(r as any).agreement?.title}</span></p>
                {(r as any).agreement?.company && <p className="text-[10px] text-muted-foreground">fra {(r as any).agreement.company}</p>}
                {r.message && <p className="text-xs mt-1 text-foreground/80">«{r.message}»</p>}
                <p className="text-[10px] text-muted-foreground mt-1">{new Date(r.created_at).toLocaleDateString("no-NO", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
              </div>
            </div>
            <input
              value={noteInputs[r.id] || ""}
              onChange={e => setNoteInputs({ ...noteInputs, [r.id]: e.target.value })}
              placeholder="Notat til kunden (valgfritt)"
              className="w-full h-9 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <div className="flex gap-2">
              <button onClick={() => updateStatus(r.id, "approved")}
                className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-xs hover:opacity-90">
                <Check size={13} /> Godkjenn
              </button>
              <button onClick={() => updateStatus(r.id, "rejected")}
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
                <p className="text-sm">{(r as any).company?.company_name} → {(r as any).agreement?.title}</p>
                {r.admin_note && <p className="text-[10px] text-muted-foreground">Notat: {r.admin_note}</p>}
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

export default PartnerRequestsPanel;
