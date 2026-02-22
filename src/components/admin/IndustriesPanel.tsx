import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Edit2 } from "lucide-react";

interface Industry {
  id: string;
  title: string;
  description: string;
  href: string;
  active: boolean;
}

const IndustriesPanel = () => {
  const [items, setItems] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Industry | null>(null);
  const [form, setForm] = useState({ title: "", description: "", href: "", active: true });

  const fetch = async () => {
    const { data } = await supabase.from("industries").select("*").order("sort_order");
    setItems((data as Industry[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const save = async () => {
    if (editing) {
      await supabase.from("industries").update(form).eq("id", editing.id);
    } else {
      await supabase.from("industries").insert([form]);
    }
    setShowForm(false); setEditing(null);
    setForm({ title: "", description: "", href: "", active: true });
    fetch();
  };

  const del = async (id: string) => {
    if (!confirm("Slett bransje?")) return;
    await supabase.from("industries").delete().eq("id", id);
    fetch();
  };

  if (loading) return <div className="text-muted-foreground text-sm">Laster…</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">{items.length} bransjer</p>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm({ title: "", description: "", href: "", active: true }); }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm glow-rose hover:opacity-90">
          <Plus size={14} /> Ny bransje
        </button>
      </div>

      {showForm && (
        <div className="glass rounded-2xl p-5 border border-border/20 space-y-3">
          <h3 className="font-medium text-sm">{editing ? "Rediger bransje" : "Ny bransje"}</h3>
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Bransjenavn"
            className="w-full h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
          <input value={form.href} onChange={e => setForm({ ...form, href: e.target.value })} placeholder="/bransjer/navn"
            className="w-full h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Beskrivelse" rows={3}
            className="w-full rounded-xl border border-border/30 bg-muted/30 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none" />
          <div className="flex gap-2">
            <button onClick={save} className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm hover:opacity-90">Lagre</button>
            <button onClick={() => { setShowForm(false); setEditing(null); }} className="px-4 py-2 rounded-xl text-sm border border-border/30 hover:bg-muted/50">Avbryt</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {items.map(item => (
          <div key={item.id} className="glass rounded-2xl px-5 py-4 border border-border/20 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">{item.title}</p>
              {item.href && <p className="text-xs text-muted-foreground">{item.href}</p>}
            </div>
            <div className="flex gap-2">
              <button onClick={() => { document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' }); setEditing(item); setForm({ title: item.title, description: item.description || "", href: item.href || "", active: item.active }); setShowForm(true); }}
                className="text-muted-foreground hover:text-foreground"><Edit2 size={14} /></button>
              <button onClick={() => del(item.id)} className="text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IndustriesPanel;
