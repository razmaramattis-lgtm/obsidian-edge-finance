import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Database, Plus, Pencil, Trash2, Save, X, Search, FileText } from "lucide-react";
import { toast } from "sonner";
import RichTextEditor from "./RichTextEditor";

interface Material {
  id: string;
  title: string;
  content: string | null;
  category: string | null;
  active: boolean;
  sort_order: number;
  created_at: string;
}

const categories = ["Generelt", "Prosedyrer", "Retningslinjer", "FAQ", "Produktinfo", "Annet"];

const DataCenterPanel = () => {
  const [items, setItems] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Material | null>(null);
  const [form, setForm] = useState({ title: "", content: "", category: "Generelt" });

  const fetchItems = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("knowledge_materials")
      .select("*")
      .order("sort_order")
      .order("created_at", { ascending: false });
    setItems((data as any[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    if (editing) {
      const { error } = await supabase
        .from("knowledge_materials")
        .update({ title: form.title, content: form.content, category: form.category } as any)
        .eq("id", editing.id);
      if (error) { toast.error("Feil ved oppdatering"); return; }
      toast.success("Materiale oppdatert");
    } else {
      const { error } = await supabase
        .from("knowledge_materials")
        .insert({ title: form.title, content: form.content, category: form.category } as any);
      if (error) { toast.error("Feil ved opprettelse"); return; }
      toast.success("Materiale lagt til");
    }
    setForm({ title: "", content: "", category: "Generelt" });
    setShowForm(false);
    setEditing(null);
    fetchItems();
  };

  const del = async (id: string) => {
    if (!confirm("Slett dette materialet?")) return;
    await supabase.from("knowledge_materials").delete().eq("id", id);
    toast.success("Slettet");
    fetchItems();
  };

  const startEdit = (item: Material) => {
    setEditing(item);
    setForm({ title: item.title, content: item.content || "", category: item.category || "Generelt" });
    setShowForm(true);
  };

  const filtered = items.filter(i =>
    i.title.toLowerCase().includes(search.toLowerCase()) ||
    (i.category || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Database size={18} className="text-primary" strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-sm font-medium">Datasenter</p>
          <p className="text-[10px] text-muted-foreground">Legg inn materiale som AI-oppslagsverket kan søke i</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Søk i materialer…"
            className="w-full h-9 pl-9 pr-3 rounded-xl border border-border/20 bg-muted/20 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <button
          onClick={() => { setShowForm(true); setEditing(null); setForm({ title: "", content: "", category: "Generelt" }); }}
          className="h-9 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-medium flex items-center gap-1.5 hover:opacity-90 transition-all"
        >
          <Plus size={14} /> Nytt materiale
        </button>
      </div>

      {showForm && (
        <form onSubmit={save} className="glass rounded-2xl border border-border/20 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">{editing ? "Rediger materiale" : "Nytt materiale"}</p>
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="text-muted-foreground hover:text-foreground">
              <X size={16} />
            </button>
          </div>
          <input
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            placeholder="Tittel"
            className="w-full h-10 rounded-xl border border-border/20 bg-muted/20 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            required
          />
          <select
            value={form.category}
            onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            className="w-full h-10 rounded-xl border border-border/20 bg-muted/20 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <RichTextEditor
            content={form.content}
            onChange={html => setForm(f => ({ ...f, content: html }))}
            placeholder="Skriv innholdet her…"
          />
          <button type="submit" className="h-9 px-5 rounded-xl bg-primary text-primary-foreground text-xs font-medium flex items-center gap-1.5 hover:opacity-90">
            <Save size={14} /> {editing ? "Oppdater" : "Lagre"}
          </button>
        </form>
      )}

      {loading ? (
        <div className="text-center py-12 text-sm text-muted-foreground">Laster…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <FileText size={36} className="mx-auto text-muted-foreground/20 mb-3" />
          <p className="text-sm text-muted-foreground">Ingen materialer enda. Legg til innhold som chatboten kan bruke.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(item => (
            <div key={item.id} className="glass rounded-xl border border-border/10 p-4 flex items-start gap-3 group">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <FileText size={14} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.title}</p>
                <p className="text-[10px] text-muted-foreground">{item.category} · {new Date(item.created_at).toLocaleDateString("nb-NO")}</p>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => startEdit(item)} className="w-7 h-7 rounded-lg hover:bg-muted/50 flex items-center justify-center">
                  <Pencil size={12} className="text-muted-foreground" />
                </button>
                <button onClick={() => del(item.id)} className="w-7 h-7 rounded-lg hover:bg-destructive/10 flex items-center justify-center">
                  <Trash2 size={12} className="text-destructive" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DataCenterPanel;
