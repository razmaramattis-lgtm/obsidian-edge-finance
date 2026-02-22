import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Search, Trash2, Check, AlertTriangle, ExternalLink } from "lucide-react";

const AccountFeedbackPanel = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await supabase
      .from("account_feedback" as any)
      .select("*")
      .order("created_at", { ascending: false });
    setItems((data as any[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const markHandled = async (id: string) => {
    await supabase.from("account_feedback" as any).update({ status: "handled" }).eq("id", id);
    toast.success("Markert som behandlet");
    load();
  };

  const del = async (id: string) => {
    await supabase.from("account_feedback" as any).delete().eq("id", id);
    toast.success("Slettet");
    load();
  };

  if (loading) return <div className="text-muted-foreground text-sm">Laster…</div>;

  const pending = items.filter(i => i.status === "new");
  const handled = items.filter(i => i.status !== "new");

  const statusCls = (s: string) =>
    s === "new" ? "text-amber-600 bg-amber-500/10" : "text-emerald-600 bg-emerald-500/10";

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        {items.length} tilbakemeldinger ({pending.length} ubehandlet)
      </p>

      {pending.length === 0 && handled.length === 0 && (
        <div className="glass rounded-2xl p-8 border border-border/20 text-center">
          <AlertTriangle size={32} className="text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Ingen tilbakemeldinger ennå.</p>
        </div>
      )}

      {pending.length > 0 && (
        <div>
          <h3 className="font-heading text-base mb-3 flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-500" />
            Ubehandlet ({pending.length})
          </h3>
          <div className="space-y-2">
            {pending.map(item => (
              <div key={item.id} className="glass rounded-2xl p-5 border border-primary/20 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <Search size={13} className="text-primary shrink-0" />
                      <p className="text-sm font-medium">Søkeord: «{item.search_term}»</p>
                    </div>
                    {item.top_result_account && (
                      <p className="text-xs text-muted-foreground">
                        Beste treff: <span className="font-mono text-foreground/80">{item.top_result_account}</span> – {item.top_result_name}
                      </p>
                    )}
                    {item.message && (
                      <p className="text-xs text-foreground/80 mt-1">«{item.message}»</p>
                    )}
                    <p className="text-[10px] text-muted-foreground">
                      {new Date(item.created_at).toLocaleDateString("no-NO", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium shrink-0 ${statusCls(item.status)}`}>
                    {item.status === "new" ? "Ny" : "Behandlet"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => markHandled(item.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-600 rounded-xl text-xs hover:bg-emerald-500/20"
                  >
                    <Check size={13} /> Behandlet
                  </button>
                  <button
                    onClick={() => del(item.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-destructive/10 text-destructive rounded-xl text-xs hover:bg-destructive/20"
                  >
                    <Trash2 size={13} /> Slett
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {handled.length > 0 && (
        <div>
          <h3 className="font-heading text-base mb-3 text-muted-foreground">Behandlet ({handled.length})</h3>
          <div className="space-y-2">
            {handled.map(item => (
              <div key={item.id} className="glass rounded-2xl px-5 py-3 border border-border/20 flex items-center justify-between">
                <div>
                  <p className="text-sm">«{item.search_term}»</p>
                  {item.top_result_account && (
                    <p className="text-[10px] text-muted-foreground">{item.top_result_account} – {item.top_result_name}</p>
                  )}
                </div>
                <button onClick={() => del(item.id)} className="text-muted-foreground/40 hover:text-destructive transition-colors">
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountFeedbackPanel;
