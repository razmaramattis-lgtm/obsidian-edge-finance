import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Edit2, Download, CheckSquare, Square } from "lucide-react";
import { toast } from "sonner";

interface InternalResource {
  id: string;
  title: string;
  description: string;
  category: string;
  file_url: string;
  file_name: string;
}

const cats = ["Generelt", "Onboarding", "Prosedyrer", "Opplæring", "Rapporter", "Annet"];

const InternalResourcesPanel = () => {
  const [items, setItems] = useState<InternalResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<InternalResource | null>(null);
  const [form, setForm] = useState({ title: "", description: "", category: "Generelt" });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    const { data } = await supabase.from("internal_resources").select("*").order("created_at", { ascending: false });
    setItems((data as InternalResource[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    let fileData: { file_url?: string; file_name?: string } = {};
    if (selectedFile) {
      const path = `internal/${Date.now()}-${selectedFile.name}`;
      const { data: ud } = await supabase.storage.from("internal-docs").upload(path, selectedFile);
      if (ud) fileData = { file_url: path, file_name: selectedFile.name };
    }
    if (editing) {
      await supabase.from("internal_resources").update({ ...form, ...fileData }).eq("id", editing.id);
    } else {
      await supabase.from("internal_resources").insert([{ ...form, ...fileData }]);
    }
    setShowForm(false); setEditing(null); setSelectedFile(null);
    setForm({ title: "", description: "", category: "Generelt" });
    fetchData();
    setUploading(false);
  };

  const del = async (id: string) => {
    if (!confirm("Slett ressurs?")) return;
    await supabase.from("internal_resources").delete().eq("id", id);
    fetchData();
  };

  const bulkDelete = async () => {
    if (selected.size === 0) return;
    if (!confirm(`Slett ${selected.size} valgte ressurser?`)) return;
    setDeleting(true);
    for (const id of selected) {
      await supabase.from("internal_resources").delete().eq("id", id);
    }
    toast.success(`${selected.size} ressurser slettet`);
    setSelected(new Set());
    fetchData();
    setDeleting(false);
  };

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    setSelected(selected.size === items.length ? new Set() : new Set(items.map(i => i.id)));
  };

  if (loading) return <div className="text-muted-foreground text-sm">Laster…</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <p className="text-sm text-muted-foreground">Interne ressurser — for alle ansatte</p>
          {selected.size > 0 && (
            <button onClick={bulkDelete} disabled={deleting}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors disabled:opacity-50">
              <Trash2 size={13} /> Slett {selected.size} valgte
            </button>
          )}
        </div>
        <div className="flex gap-2">
          {items.length > 0 && (
            <button onClick={toggleAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs border border-border/30 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
              {selected.size === items.length ? <CheckSquare size={13} /> : <Square size={13} />}
              {selected.size === items.length ? "Fjern alle" : "Velg alle"}
            </button>
          )}
          <button onClick={() => { setShowForm(true); setEditing(null); setForm({ title: "", description: "", category: "Generelt" }); }}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm glow-rose hover:opacity-90">
            <Plus size={14} /> Legg til
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={save} className="glass rounded-2xl p-5 border border-border/20 space-y-3">
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Tittel" required
            className="w-full h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
            className="w-full h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
            {cats.map(c => <option key={c}>{c}</option>)}
          </select>
          <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Beskrivelse"
            className="w-full h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
          <div onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-border/30 rounded-xl p-4 text-center cursor-pointer hover:border-primary/40 transition-colors">
            <p className="text-xs text-muted-foreground">{selectedFile ? selectedFile.name : "Vedlegg (valgfritt)"}</p>
            <input ref={fileRef} type="file" className="hidden" onChange={e => setSelectedFile(e.target.files?.[0] || null)} />
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={uploading} className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm hover:opacity-90 disabled:opacity-50">
              {uploading ? "Lagrer…" : "Lagre"}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="px-4 py-2 rounded-xl text-sm border border-border/30 hover:bg-muted/50">Avbryt</button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {items.map(item => (
          <div key={item.id} className={`glass rounded-2xl px-5 py-4 border flex items-center justify-between gap-4 transition-colors ${
            selected.has(item.id) ? "border-primary/40 bg-primary/5" : "border-border/20"
          }`}>
            <div className="flex items-center gap-3">
              <button onClick={() => toggleSelect(item.id)} className="text-muted-foreground hover:text-primary transition-colors shrink-0">
                {selected.has(item.id) ? <CheckSquare size={16} className="text-primary" /> : <Square size={16} />}
              </button>
              <div>
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.category}{item.description ? ` · ${item.description}` : ""}</p>
              </div>
            </div>
            <div className="flex gap-2">
              {item.file_url && <button onClick={async () => { const { data } = await supabase.storage.from("internal-docs").createSignedUrl(item.file_url, 3600); if (data?.signedUrl) window.open(data.signedUrl, "_blank"); }} className="text-muted-foreground hover:text-primary"><Download size={14} /></button>}
              <button onClick={() => { setEditing(item); setForm({ title: item.title, description: item.description || "", category: item.category }); setShowForm(true); }}
                className="text-muted-foreground hover:text-foreground"><Edit2 size={14} /></button>
              <button onClick={() => del(item.id)} className="text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InternalResourcesPanel;
