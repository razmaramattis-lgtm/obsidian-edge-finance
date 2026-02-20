import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Edit2 } from "lucide-react";

interface Service {
  id: string;
  title: string;
  description: string;
  group_name: string;
  href: string;
  active: boolean;
}

const ServicesPanel = () => {
  const [items, setItems] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState({ title: "", description: "", group_name: "Regnskap & Økonomi", href: "", active: true });

  const fetch = async () => {
    const { data } = await supabase.from("services").select("*").order("sort_order");
    setItems((data as Service[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const save = async () => {
    if (editing) {
      await supabase.from("services").update(form).eq("id", editing.id);
    } else {
      await supabase.from("services").insert([form]);
    }
    setShowForm(false); setEditing(null);
    setForm({ title: "", description: "", group_name: "Regnskap & Økonomi", href: "", active: true });
    fetch();
  };

  const del = async (id: string) => {
    if (!confirm("Slett tjeneste?")) return;
    await supabase.from("services").delete().eq("id", id);
    fetch();
  };

  const startEdit = (item: Service) => {
    setEditing(item);
    setForm({ title: item.title, description: item.description || "", group_name: item.group_name, href: item.href || "", active: item.active });
    setShowForm(true);
  };

  if (loading) return <div className="text-muted-foreground text-sm">Laster…</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">{items.length} tjenester</p>
        <button onClick={() => { setShowForm(true); setEditing(null); }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm glow-rose hover:opacity-90">
          <Plus size={14} /> Ny tjeneste
        </button>
      </div>

      {showForm && (
        <div className="glass rounded-2xl p-5 border border-border/20 space-y-3">
          <h3 className="font-medium text-sm">{editing ? "Rediger tjeneste" : "Ny tjeneste"}</h3>
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Tittel"
            className="w-full h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
          <select value={form.group_name} onChange={e => setForm({ ...form, group_name: e.target.value })}
            className="w-full h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
            <option>Regnskap & Økonomi</option>
            <option>Markedsføring & Vekst</option>
          </select>
          <input value={form.href} onChange={e => setForm({ ...form, href: e.target.value })} placeholder="/tjenester/navn"
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
              <p className="text-xs text-muted-foreground">{item.group_name}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(item)} className="text-muted-foreground hover:text-foreground"><Edit2 size={14} /></button>
              <button onClick={() => del(item.id)} className="text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesPanel;
