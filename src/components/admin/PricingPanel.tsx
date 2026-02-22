import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Edit2 } from "lucide-react";

interface Plan {
  id: string;
  name: string;
  price: number;
  price_suffix: string;
  description: string;
  features: string[];
  highlighted: boolean;
  active: boolean;
  sort_order: number;
}

const PricingPanel = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Plan | null>(null);
  const [form, setForm] = useState({ name: "", price: 0, price_suffix: "/mnd", description: "", features: "", highlighted: false, active: true, sort_order: 0 });

  const fetch = async () => {
    const { data } = await supabase.from("pricing_plans").select("*").order("sort_order");
    setPlans((data as Plan[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const save = async () => {
    const payload = { ...form, price: Number(form.price), sort_order: Number(form.sort_order), features: form.features.split("\n").filter(Boolean) };
    if (editing) {
      await supabase.from("pricing_plans").update(payload).eq("id", editing.id);
    } else {
      await supabase.from("pricing_plans").insert([payload]);
    }
    setShowForm(false); setEditing(null);
    setForm({ name: "", price: 0, price_suffix: "/mnd", description: "", features: "", highlighted: false, active: true, sort_order: 0 });
    fetch();
  };

  const del = async (id: string) => {
    if (!confirm("Slett prisplan?")) return;
    await supabase.from("pricing_plans").delete().eq("id", id);
    fetch();
  };

  const startEdit = (plan: Plan) => {
    document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' });
    setEditing(plan);
    setForm({ name: plan.name, price: plan.price, price_suffix: plan.price_suffix, description: plan.description || "", features: (plan.features || []).join("\n"), highlighted: plan.highlighted, active: plan.active, sort_order: plan.sort_order || 0 });
    setShowForm(true);
  };

  if (loading) return <div className="text-muted-foreground text-sm">Laster…</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">{plans.length} prisplaner</p>
        <button onClick={() => { setShowForm(true); setEditing(null); }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm glow-rose hover:opacity-90">
          <Plus size={14} /> Ny prisplan
        </button>
      </div>

      {showForm && (
        <div className="glass rounded-2xl p-5 border border-border/20 space-y-3">
          <h3 className="font-medium text-sm">{editing ? "Rediger prisplan" : "Ny prisplan"}</h3>
          <div className="grid grid-cols-2 gap-3">
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Plannavn"
              className="h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
            <div className="flex gap-2">
              <input value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} placeholder="Pris" type="number"
                className="h-10 flex-1 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
              <input value={form.price_suffix} onChange={e => setForm({ ...form, price_suffix: e.target.value })} placeholder="/mnd"
                className="h-10 w-16 rounded-xl border border-border/30 bg-muted/30 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
            </div>
          </div>
          <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Beskrivelse"
            className="w-full h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
          <textarea value={form.features} onChange={e => setForm({ ...form, features: e.target.value })} placeholder="Funksjoner (én per linje)" rows={4}
            className="w-full rounded-xl border border-border/30 bg-muted/30 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none" />
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={form.highlighted} onChange={e => setForm({ ...form, highlighted: e.target.checked })} />
            Fremhevet (anbefalt)
          </label>
          <div className="flex items-center gap-3">
            <label className="text-sm text-muted-foreground">Sortering</label>
            <input value={form.sort_order} onChange={e => setForm({ ...form, sort_order: Number(e.target.value) })} type="number"
              className="h-10 w-20 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
            <span className="text-xs text-muted-foreground/60">Lavere = vises først</span>
          </div>
          <div className="flex gap-2">
            <button onClick={save} className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm hover:opacity-90">Lagre</button>
            <button onClick={() => { setShowForm(false); setEditing(null); }} className="px-4 py-2 rounded-xl text-sm border border-border/30 hover:bg-muted/50">Avbryt</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plans.map(plan => (
          <div key={plan.id} className={`glass rounded-2xl p-5 border ${plan.highlighted ? "border-primary/40" : "border-border/20"}`}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-medium">{plan.name}</p>
                <p className="text-2xl font-heading mt-1">{plan.price.toLocaleString("nb-NO")} kr<span className="text-sm text-muted-foreground font-sans">{plan.price_suffix}</span></p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => startEdit(plan)} className="text-muted-foreground hover:text-foreground"><Edit2 size={13} /></button>
                <button onClick={() => del(plan.id)} className="text-muted-foreground hover:text-destructive"><Trash2 size={13} /></button>
              </div>
            </div>
            {plan.highlighted && <span className="text-[9px] tracking-widest uppercase text-primary border border-primary/30 px-2 py-0.5 rounded-full">Anbefalt</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingPanel;
