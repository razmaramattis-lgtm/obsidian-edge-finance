import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Check, X, Search, Handshake } from "lucide-react";

const BenefitApplicationsPanel = ({ onStatusChange }: { onStatusChange?: () => void }) => {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [noteId, setNoteId] = useState<string | null>(null);
  const [note, setNote] = useState("");

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("benefit_agreement_applications")
      .select("*, company:customer_companies(company_name, profile:profiles!customer_companies_profile_id_fkey(name, email))")
      .order("created_at", { ascending: false });
    setApplications(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id: string, status: string) => {
    const payload: any = { status };
    if (noteId === id && note.trim()) payload.admin_note = note.trim();
    await supabase.from("benefit_agreement_applications").update(payload).eq("id", id);

    // If approved, create a collaboration agreement from it
    if (status === "approved") {
      const app = applications.find(a => a.id === id);
      if (app) {
        await supabase.from("collaboration_agreements").insert({
          title: app.title,
          description: app.description || null,
          offering: app.offering || null,
          price: app.price || null,
          website: app.website || null,
          contact_name: app.contact_name || null,
          email: app.contact_email || null,
          phone: app.contact_phone || null,
          company: (app as any).company?.company_name || null,
          partner: (app as any).company?.company_name || null,
          logo_url: app.logo_url || null,
          target_audience: "all",
        });
        toast.success("Godkjent og lagt til som fordelsavtale!");
      }
    } else {
      toast.success(status === "rejected" ? "Søknad avslått" : "Status oppdatert");
    }
    setNoteId(null);
    setNote("");
    load();
    onStatusChange?.();
  };

  if (loading) return <div className="text-muted-foreground text-sm">Laster…</div>;

  const statusLabel = (s: string) => {
    if (s === "pending") return { text: "Venter", cls: "text-amber-600 bg-amber-500/10" };
    if (s === "approved") return { text: "Godkjent", cls: "text-emerald-600 bg-emerald-500/10" };
    if (s === "rejected") return { text: "Avslått", cls: "text-destructive bg-destructive/10" };
    return { text: s, cls: "text-muted-foreground bg-muted/30" };
  };

  const filtered = search.trim()
    ? applications.filter(a => a.title.toLowerCase().includes(search.toLowerCase()) || ((a as any).company?.company_name || "").toLowerCase().includes(search.toLowerCase()))
    : applications;

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">{applications.length} søknader ({applications.filter(a => a.status === "pending").length} venter)</p>

      {applications.length > 0 && (
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Søk…"
            className="w-full h-10 rounded-xl border border-border/30 bg-muted/30 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="glass rounded-2xl p-8 border border-border/20 text-center">
          <Handshake size={32} className="text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Ingen fordelsavtale-søknader.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(app => {
            const st = statusLabel(app.status);
            const comp = (app as any).company;
            return (
              <div key={app.id} className="glass rounded-2xl p-5 border border-border/20 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{app.title}</p>
                    <p className="text-xs text-muted-foreground">{comp?.company_name} · {comp?.profile?.name} · {comp?.profile?.email}</p>
                    {app.offering && <p className="text-xs text-foreground/80 mt-1">{app.offering}</p>}
                    {app.description && <p className="text-xs text-muted-foreground mt-1">{app.description}</p>}
                    {app.price && <p className="text-xs text-primary font-medium mt-1">{app.price}</p>}
                    {app.website && <a href={app.website} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline mt-1 inline-block">{app.website}</a>}
                    <p className="text-[10px] text-muted-foreground mt-1">{new Date(app.created_at).toLocaleDateString("no-NO")}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-medium shrink-0 ${st.cls}`}>{st.text}</span>
                </div>

                {app.status === "pending" && (
                  <div className="space-y-2">
                    {noteId === app.id ? (
                      <input value={note} onChange={e => setNote(e.target.value)} placeholder="Admin-notat (valgfritt)"
                        className="w-full h-9 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                    ) : (
                      <button onClick={() => setNoteId(app.id)} className="text-xs text-muted-foreground hover:text-foreground">+ Legg til notat</button>
                    )}
                    <div className="flex gap-2">
                      <button onClick={() => updateStatus(app.id, "approved")}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-600 rounded-xl text-xs hover:bg-emerald-500/20">
                        <Check size={13} /> Godkjenn
                      </button>
                      <button onClick={() => updateStatus(app.id, "rejected")}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-destructive/10 text-destructive rounded-xl text-xs hover:bg-destructive/20">
                        <X size={13} /> Avslå
                      </button>
                    </div>
                  </div>
                )}
                {app.admin_note && <p className="text-xs text-muted-foreground italic">Notat: {app.admin_note}</p>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BenefitApplicationsPanel;
