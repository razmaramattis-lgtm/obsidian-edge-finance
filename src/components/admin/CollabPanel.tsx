import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Edit2, Download } from "lucide-react";

interface Agreement {
  id: string;
  title: string;
  description: string;
  partner: string;
  file_url: string;
  file_name: string;
}

const CollabPanel = () => {
  const [items, setItems] = useState<Agreement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Agreement | null>(null);
  const [form, setForm] = useState({ title: "", description: "", partner: "" });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetch = async () => {
    const { data } = await supabase.from("collaboration_agreements").select("*").order("created_at", { ascending: false });
    setItems((data as Agreement[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    let fileData: { file_url?: string; file_name?: string } = {};

    if (selectedFile) {
      const path = `collab/${Date.now()}-${selectedFile.name}`;
      const { data: ud } = await supabase.storage.from("internal-docs").upload(path, selectedFile);
      if (ud) {
        const { data: { publicUrl } } = supabase.storage.from("internal-docs").getPublicUrl(path);
        fileData = { file_url: publicUrl, file_name: selectedFile.name };
      }
    }

    if (editing) {
      await supabase.from("collaboration_agreements").update({ ...form, ...fileData }).eq("id", editing.id);
    } else {
      await supabase.from("collaboration_agreements").insert([{ ...form, ...fileData }]);
    }
    setShowForm(false); setEditing(null); setSelectedFile(null);
    setForm({ title: "", description: "", partner: "" });
    fetch();
    setUploading(false);
  };

  const del = async (id: string) => {
    if (!confirm("Slett samarbeidsavtale?")) return;
    await supabase.from("collaboration_agreements").delete().eq("id", id);
    fetch();
  };

  if (loading) return <div className="text-muted-foreground text-sm">Laster…</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{items.length} samarbeidsavtaler</p>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm({ title: "", description: "", partner: "" }); }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm glow-rose hover:opacity-90">
          <Plus size={14} /> Ny avtale
        </button>
      </div>

      {showForm && (
        <form onSubmit={save} className="glass rounded-2xl p-5 border border-border/20 space-y-3">
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Avtalenavn" required
            className="w-full h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
          <input value={form.partner} onChange={e => setForm({ ...form, partner: e.target.value })} placeholder="Partner/motpart"
            className="w-full h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
          <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Beskrivelse"
            className="w-full h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
          <div onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-border/30 rounded-xl p-4 text-center cursor-pointer hover:border-primary/40 transition-colors">
            <p className="text-xs text-muted-foreground">{selectedFile ? selectedFile.name : "Last opp avtaledokument (PDF, Word…)"}</p>
            <input ref={fileRef} type="file" className="hidden" onChange={e => setSelectedFile(e.target.files?.[0] || null)} accept=".pdf,.doc,.docx" />
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
          <div key={item.id} className="glass rounded-2xl px-5 py-4 border border-border/20 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">{item.title}</p>
              {item.partner && <p className="text-xs text-muted-foreground">Partner: {item.partner}</p>}
              {item.description && <p className="text-xs text-muted-foreground">{item.description}</p>}
            </div>
            <div className="flex gap-2">
              {item.file_url && <a href={item.file_url} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary"><Download size={14} /></a>}
              <button onClick={() => { setEditing(item); setForm({ title: item.title, description: item.description || "", partner: item.partner || "" }); setShowForm(true); }}
                className="text-muted-foreground hover:text-foreground"><Edit2 size={14} /></button>
              <button onClick={() => del(item.id)} className="text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollabPanel;
