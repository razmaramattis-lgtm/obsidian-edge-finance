import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit2, Trash2, Search, CheckSquare, Square } from "lucide-react";
import { toast } from "sonner";

interface AccountEntry {
  id: string;
  account_number: string;
  name: string;
  slug: string;
  description: string | null;
  examples: string | null;
  category_group: string | null;
  business_types: string[];
  mva_status: string;
  active: boolean;
}

const slugify = (text: string) =>
  text.toLowerCase().replace(/æ/g, "ae").replace(/ø/g, "o").replace(/å/g, "a").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const AccountEntriesPanel = () => {
  const [items, setItems] = useState<AccountEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<AccountEntry | null>(null);
  const [form, setForm] = useState({
    account_number: "", name: "", slug: "", description: "", examples: "",
    category_group: "", business_types: ["AS"] as string[], mva_status: "med_mva", active: true,
  });
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);

  const fetchData = async () => {
    const { data } = await supabase.from("account_entries").select("*").order("account_number", { ascending: true });
    setItems((data as AccountEntry[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = form.slug || slugify(`${form.account_number}-${form.name}`);
    const payload = { ...form, slug };
    if (editing) {
      await supabase.from("account_entries").update(payload).eq("id", editing.id);
      toast.success("Konto oppdatert");
    } else {
      await supabase.from("account_entries").insert([payload]);
      toast.success("Konto lagt til");
    }
    setShowForm(false); setEditing(null);
    setForm({ account_number: "", name: "", slug: "", description: "", examples: "", category_group: "", business_types: ["AS"], mva_status: "med_mva", active: true });
    fetchData();
  };

  const del = async (id: string) => {
    if (!confirm("Slett denne kontoen?")) return;
    await supabase.from("account_entries").delete().eq("id", id);
    fetchData();
  };

  const bulkDelete = async () => {
    if (selected.size === 0) return;
    if (!confirm(`Slett ${selected.size} kontoer?`)) return;
    setDeleting(true);
    for (const id of selected) await supabase.from("account_entries").delete().eq("id", id);
    toast.success(`${selected.size} kontoer slettet`);
    setSelected(new Set());
    fetchData();
    setDeleting(false);
  };

  const toggleBizType = (t: string) => {
    setForm(prev => ({
      ...prev,
      business_types: prev.business_types.includes(t)
        ? prev.business_types.filter(x => x !== t)
        : [...prev.business_types, t],
    }));
  };

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => setSelected(selected.size === filteredItems.length ? new Set() : new Set(filteredItems.map(i => i.id)));

  const filteredItems = items.filter(i => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return i.account_number.includes(q) || i.name.toLowerCase().includes(q);
  });

  if (loading) return <div className="text-muted-foreground text-sm">Laster…</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <p className="text-muted-foreground text-sm">{items.length} kontoer</p>
          {selected.size > 0 && (
            <button onClick={bulkDelete} disabled={deleting}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors disabled:opacity-50">
              <Trash2 size={13} /> Slett {selected.size}
            </button>
          )}
        </div>
        <div className="flex gap-2">
          {filteredItems.length > 0 && (
            <button onClick={toggleAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs border border-border/30 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
              {selected.size === filteredItems.length ? <CheckSquare size={13} /> : <Square size={13} />}
              {selected.size === filteredItems.length ? "Fjern alle" : "Velg alle"}
            </button>
          )}
          <button onClick={() => { setShowForm(true); setEditing(null); setForm({ account_number: "", name: "", slug: "", description: "", examples: "", category_group: "", business_types: ["AS"], mva_status: "med_mva", active: true }); }}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm glow-rose hover:opacity-90">
            <Plus size={14} /> Ny konto
          </button>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Søk kontonr. eller navn…"
          className="w-full h-9 pl-9 pr-3 rounded-xl border border-border/30 bg-muted/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
      </div>

      {showForm && (
        <form onSubmit={save} className="glass rounded-2xl p-5 border border-border/20 space-y-3">
          <h3 className="font-medium text-sm">{editing ? "Rediger konto" : "Ny konto"}</h3>
          <div className="grid grid-cols-2 gap-3">
            <input value={form.account_number} onChange={e => setForm({ ...form, account_number: e.target.value })} placeholder="Kontonummer" required
              className="h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Navn" required
              className="h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
          </div>
          <input value={form.category_group} onChange={e => setForm({ ...form, category_group: e.target.value })} placeholder="Kontogruppe (feks 65 Verktøy)"
            className="w-full h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Beskrivelse / veiledning" rows={4}
            className="w-full rounded-xl border border-border/30 bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
          <input value={form.examples} onChange={e => setForm({ ...form, examples: e.target.value })} placeholder="Eksempler (kommaseparert)"
            className="w-full h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
          <div className="flex gap-2 flex-wrap">
            {["AS", "ENK", "Landbruk"].map(t => (
              <button type="button" key={t} onClick={() => toggleBizType(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${form.business_types.includes(t) ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground"}`}>
                {t}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm hover:opacity-90">Lagre</button>
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="px-4 py-2 rounded-xl text-sm border border-border/30 hover:bg-muted/50">Avbryt</button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {filteredItems.map(item => (
          <div key={item.id} className={`glass rounded-2xl px-5 py-3 border flex items-center justify-between gap-4 transition-colors ${selected.has(item.id) ? "border-primary/40 bg-primary/5" : "border-border/20"}`}>
            <div className="flex items-center gap-3">
              <button onClick={() => toggleSelect(item.id)} className="text-muted-foreground hover:text-primary shrink-0">
                {selected.has(item.id) ? <CheckSquare size={16} className="text-primary" /> : <Square size={16} />}
              </button>
              <span className="text-xs font-mono bg-primary/10 text-primary px-1.5 py-0.5 rounded">{item.account_number}</span>
              <p className="text-sm font-medium">{item.name}</p>
              {!item.active && <span className="text-[10px] bg-muted text-muted-foreground px-1.5 rounded">Inaktiv</span>}
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setEditing(item); setForm({ account_number: item.account_number, name: item.name, slug: item.slug, description: item.description || "", examples: item.examples || "", category_group: item.category_group || "", business_types: item.business_types || ["AS"], mva_status: item.mva_status, active: item.active }); setShowForm(true); }}
                className="text-muted-foreground hover:text-foreground"><Edit2 size={14} /></button>
              <button onClick={() => del(item.id)} className="text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountEntriesPanel;
