import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Plus, Handshake, Search, Building2 } from "lucide-react";

const inputCls = "w-full h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40";

const BenefitApplicationPanel = () => {
  const { profile } = useAuth();
  const [company, setCompany] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    title: "", description: "", offering: "", price: "", website: "",
    contact_name: "", contact_email: "", contact_phone: "",
  });

  const load = useCallback(async () => {
    const { data: comp } = await supabase.from("customer_companies").select("*").limit(1).maybeSingle();
    setCompany(comp);
    if (comp) {
      const { data } = await supabase.from("benefit_agreement_applications").select("*").eq("company_id", comp.id).order("created_at", { ascending: false });
      setApplications(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !form.title.trim()) return;
    setSubmitting(true);
    const { error } = await supabase.from("benefit_agreement_applications").insert({
      company_id: company.id,
      title: form.title.trim(),
      description: form.description || null,
      offering: form.offering || null,
      price: form.price || null,
      website: form.website || null,
      contact_name: form.contact_name || profile?.name || null,
      contact_email: form.contact_email || profile?.email || null,
      contact_phone: form.contact_phone || null,
    } as any);
    if (error) { toast.error("Kunne ikke sende søknad"); }
    else {
      try {
        await supabase.functions.invoke("notify", {
          body: {
            type: "employee_invitation",
            data: {
              company_name: company.company_name,
              employee_name: form.title,
              employee_email: `Fordelsavtale-søknad fra ${company.company_name}: ${form.description || form.offering || "Ingen beskrivelse"}`,
              invited_by_name: profile?.name || "Kunde",
            },
          },
        });
      } catch {}
      toast.success("Søknad sendt! Admin vil vurdere den.");
      setForm({ title: "", description: "", offering: "", price: "", website: "", contact_name: "", contact_email: "", contact_phone: "" });
      setShowForm(false);
      load();
    }
    setSubmitting(false);
  };

  if (loading) return <div className="text-muted-foreground text-sm">Laster…</div>;

  const statusLabel = (s: string) => {
    if (s === "pending") return { text: "Under vurdering", cls: "text-amber-600 bg-amber-500/10" };
    if (s === "approved") return { text: "Godkjent", cls: "text-emerald-600 bg-emerald-500/10" };
    if (s === "rejected") return { text: "Avslått", cls: "text-destructive bg-destructive/10" };
    return { text: s, cls: "text-muted-foreground bg-muted/30" };
  };

  const filtered = search.trim()
    ? applications.filter(a => a.title.toLowerCase().includes(search.toLowerCase()) || (a.description || "").toLowerCase().includes(search.toLowerCase()))
    : applications;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-xl">Søk om fordelsavtale</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Tilby dine produkter eller tjenester som fordelsavtale for andre kunder hos Avargo.</p>
        </div>
        <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-1.5 px-4 py-2 text-xs rounded-xl bg-primary text-primary-foreground hover:opacity-90">
          <Plus size={14} /> Ny søknad
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="glass rounded-2xl p-5 border border-border/20 space-y-3">
          <h3 className="font-medium text-sm">Ny fordelsavtale-søknad</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div><label className="text-xs text-muted-foreground mb-1 block">Tittel *</label><input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required className={inputCls} placeholder="F.eks. 20% rabatt på kontormøbler" /></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Pris/vilkår</label><input value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} className={inputCls} placeholder="F.eks. 20% rabatt" /></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Nettside</label><input value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} className={inputCls} placeholder="https://" /></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Kontaktperson</label><input value={form.contact_name} onChange={e => setForm(f => ({ ...f, contact_name: e.target.value }))} className={inputCls} /></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">E-post</label><input type="email" value={form.contact_email} onChange={e => setForm(f => ({ ...f, contact_email: e.target.value }))} className={inputCls} /></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Telefon</label><input value={form.contact_phone} onChange={e => setForm(f => ({ ...f, contact_phone: e.target.value }))} className={inputCls} /></div>
          </div>
          <div><label className="text-xs text-muted-foreground mb-1 block">Hva tilbyr dere?</label>
            <textarea value={form.offering} onChange={e => setForm(f => ({ ...f, offering: e.target.value }))} rows={2} className="w-full rounded-xl border border-border/30 bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none" placeholder="Beskriv tilbudet kort" />
          </div>
          <div><label className="text-xs text-muted-foreground mb-1 block">Utfyllende beskrivelse</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className="w-full rounded-xl border border-border/30 bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none" />
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={submitting} className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm hover:opacity-90 disabled:opacity-50">
              {submitting ? "Sender…" : "Send søknad"}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-border/30 rounded-xl text-sm hover:bg-muted/50">Avbryt</button>
          </div>
        </form>
      )}

      {applications.length > 0 && (
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Søk i dine søknader…" className="w-full h-10 rounded-xl border border-border/30 bg-muted/30 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
        </div>
      )}

      <p className="text-sm text-muted-foreground">{filtered.length} søknader</p>

      {filtered.length === 0 ? (
        <div className="glass rounded-2xl p-8 border border-border/20 text-center">
          <Handshake size={32} className="text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Ingen søknader ennå. Send inn en søknad for å tilby dine tjenester som fordelsavtale.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(app => {
            const st = statusLabel(app.status);
            return (
              <div key={app.id} className="glass rounded-2xl px-5 py-4 border border-border/20">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{app.title}</p>
                    {app.offering && <p className="text-xs text-foreground/80 mt-0.5">{app.offering}</p>}
                    {app.price && <p className="text-xs text-primary font-medium mt-1">{app.price}</p>}
                    <p className="text-[10px] text-muted-foreground mt-1">{new Date(app.created_at).toLocaleDateString("no-NO")}</p>
                    {app.admin_note && <p className="text-xs text-muted-foreground mt-2 italic">Admin: {app.admin_note}</p>}
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-medium shrink-0 ${st.cls}`}>{st.text}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BenefitApplicationPanel;
