import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Download, Upload, FileText, CheckSquare, Square } from "lucide-react";
import { toast } from "sonner";

interface Resource {
  id: string;
  name: string;
  description: string;
  category: string;
  file_url: string;
  file_name: string;
  active: boolean;
}

const cats = ["Maler", "Kontrakter", "Budsjett", "Sjekklister", "Skjemaer", "Annet"];

const ResourcesPanel = () => {
  const [items, setItems] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", category: "Maler", active: true });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    const { data } = await supabase.from("resources").select("*").order("created_at", { ascending: false });
    setItems((data as Resource[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const upload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    setUploading(true);
    const path = `${Date.now()}-${selectedFile.name}`;
    const { data: ud, error } = await supabase.storage.from("resources").upload(path, selectedFile);
    if (!error && ud) {
      const { data: { publicUrl } } = supabase.storage.from("resources").getPublicUrl(path);
      await supabase.from("resources").insert([{ ...form, file_url: publicUrl, file_name: selectedFile.name }]);
      setShowForm(false); setSelectedFile(null);
      setForm({ name: "", description: "", category: "Maler", active: true });
      fetchData();
    }
    setUploading(false);
  };

  const del = async (item: Resource) => {
    if (!confirm("Slett ressurs?")) return;
    await supabase.from("resources").delete().eq("id", item.id);
    fetchData();
  };

  const bulkDelete = async () => {
    if (selected.size === 0) return;
    if (!confirm(`Slett ${selected.size} valgte ressurser?`)) return;
    setDeleting(true);
    for (const id of selected) {
      await supabase.from("resources").delete().eq("id", id);
    }
    setSelected(new Set());
    toast.success(`${selected.size} ressurser slettet`);
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
          <p className="text-muted-foreground text-sm">{items.length} maler/ressurser</p>
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
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm glow-rose hover:opacity-90">
            <Upload size={14} /> Last opp ressurs
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={upload} className="glass rounded-2xl p-5 border border-border/20 space-y-3">
          <h3 className="font-medium text-sm">Ny ressurs/mal</h3>
          <div onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-border/30 rounded-xl p-8 text-center cursor-pointer hover:border-primary/40 transition-colors">
            <FileText size={28} className="mx-auto text-muted-foreground mb-2" strokeWidth={1.5} />
            <p className="text-sm text-muted-foreground">{selectedFile ? selectedFile.name : "Klikk for å velge fil"}</p>
            <input ref={fileRef} type="file" className="hidden" onChange={e => setSelectedFile(e.target.files?.[0] || null)} />
          </div>
          <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Navn/tittel" required
            className="w-full h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
            className="w-full h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
            {cats.map(c => <option key={c}>{c}</option>)}
          </select>
          <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Beskrivelse"
            className="w-full h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
          <div className="flex gap-2">
            <button type="submit" disabled={uploading || !selectedFile} className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm hover:opacity-90 disabled:opacity-50">
              {uploading ? "Laster opp…" : "Last opp"}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl text-sm border border-border/30 hover:bg-muted/50">Avbryt</button>
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
              <FileText size={18} className="text-primary shrink-0" strokeWidth={1.5} />
              <div>
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.category} · {item.file_name}</p>
              </div>
            </div>
            <div className="flex gap-2">
              {item.file_url && <a href={item.file_url} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary"><Download size={14} /></a>}
              <button onClick={() => del(item)} className="text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResourcesPanel;
