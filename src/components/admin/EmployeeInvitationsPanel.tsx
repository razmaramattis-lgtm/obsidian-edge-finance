import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Check, X, Clock, UserPlus, Users } from "lucide-react";
import { toast } from "sonner";

const EmployeeInvitationsPanel = () => {
  const [invitations, setInvitations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await supabase
      .from("customer_employee_invitations")
      .select("*, company:customer_companies(company_name), inviter:profiles!customer_employee_invitations_invited_by_fkey(name, email)")
      .order("created_at", { ascending: false });
    setInvitations(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleApprove = async (id: string) => {
    await supabase.from("customer_employee_invitations").update({ status: "approved" }).eq("id", id);
    toast.success("Invitasjon godkjent");
    load();
  };

  const handleReject = async (id: string) => {
    await supabase.from("customer_employee_invitations").update({ status: "rejected" }).eq("id", id);
    toast.success("Invitasjon avslått");
    load();
  };

  if (loading) return <div className="text-muted-foreground text-sm">Laster…</div>;

  const pending = invitations.filter(i => i.status === "pending");
  const handled = invitations.filter(i => i.status !== "pending");

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-heading text-base mb-3 flex items-center gap-2">
          <Clock size={16} className="text-primary" />
          Ventende ansattinvitasjoner ({pending.length})
        </h3>
        {pending.length === 0 && (
          <div className="glass rounded-2xl p-6 border border-border/20 text-center">
            <UserPlus size={24} className="text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Ingen ventende invitasjoner</p>
          </div>
        )}
        {pending.map(inv => (
          <div key={inv.id} className="glass rounded-2xl p-5 border border-primary/20 mb-3 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Users size={16} className="text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{inv.employee_name}</p>
                <p className="text-xs text-muted-foreground">{inv.employee_email}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Selskap: <strong>{inv.company?.company_name}</strong> · Invitert av: {inv.inviter?.name || "Ukjent"}
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {new Date(inv.created_at).toLocaleDateString("no-NO", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleApprove(inv.id)}
                className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-xs hover:opacity-90">
                <Check size={13} /> Godkjenn
              </button>
              <button onClick={() => handleReject(inv.id)}
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
          {handled.map(inv => (
            <div key={inv.id} className="glass rounded-2xl px-5 py-3 border border-border/20 mb-2 flex items-center justify-between">
              <div>
                <p className="text-sm">{inv.employee_name} — {inv.employee_email}</p>
                <p className="text-[10px] text-muted-foreground">{inv.company?.company_name}</p>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                inv.status === "approved" ? "bg-emerald-500/10 text-emerald-600" : "bg-destructive/10 text-destructive"
              }`}>
                {inv.status === "approved" ? "Godkjent" : "Avslått"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployeeInvitationsPanel;
