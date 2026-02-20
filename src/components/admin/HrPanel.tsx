import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Download, Upload, FileText, Edit2 } from "lucide-react";

interface HrResource {
  id: string;
  title: string;
  description: string;
  category: string;
  file_url: string;
  file_name: string;
}

const cats = ["Ansettelse", "Kontrakter", "Personalhåndbok", "Rutiner", "Opplæring", "Annet"];

const HrPanel = () => {
  const [items, setItems] = useState<HrResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<HrResource | null>(null);
  const [form, setForm] = useState({ title: "", description: "", category: "Ansettelse" });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchItems = async () => {
    const { data } = await supabase.from("internal_resources").select("*").eq("category", form.category).order("created_at", { ascending: false });
    // Fetch all and filter HR categories client-side
    const { data: all } = await supabase.from("internal_resources").select("*").order("created_at", { ascending: false });
    setItems((all as HrResource[])?.filter(r => cats.includes(r.category)) || []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    let fileData: { file_url?: string; file_name?: string } = {};

    if (selectedFile) {
      const path = `hr/${Date.now()}-${selectedFile.name}`;
      const { data: ud } = await supabase.storage.from("internal-docs").upload(path, selectedFile);
      if (ud) {
        fileData = { file_url: path, file_name: selectedFile.name };
      }
    }

    if (editing) {
      await supabase.from("internal_resources").update({ ...form, ...fileData }).eq("id", editing.id);
    } else {
      await supabase.from("internal_resources").insert([{ ...form, ...fileData }]);
    }
    setShowForm(false); setEditing(null); setSelectedFile(null);
    setForm({ title: "", description: "", category: "Ansettelse" });
    fetchItems();
    setUploading(false);
  };

  const del = async (id: string) => {
    if (!confirm("Slett HR-dokument?")) return;
    await supabase.from("internal_resources").delete().eq("id", id);
    fetchItems();
  };

  const grouped = cats.reduce((acc, cat) => {
    acc[cat] = items.filter(i => i.category === cat);
    return acc;
  }, {} as Record<string, HrResource[]>);

  if (loading) return <div className="text-muted-foreground text-sm">Laster…</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{items.length} HR-dokumenter</p>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm({ title: "", description: "", category: "Ansettelse" }); }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm glow-rose hover:opacity-90">
          <Upload size={14} /> Last opp dokument
        </button>
      </div>

      {showForm && (
        <form onSubmit={save} className="glass rounded-2xl p-5 border border-border/20 space-y-3">
          <h3 className="font-medium text-sm">{editing ? "Rediger" : "Nytt"} HR-dokument</h3>
          <div onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-border/30 rounded-xl p-8 text-center cursor-pointer hover:border-primary/40 transition-colors">
            <FileText size={28} className="mx-auto text-muted-foreground mb-2" strokeWidth={1.5} />
            <p className="text-sm text-muted-foreground">{selectedFile ? selectedFile.name : "Klikk for å velge fil (PDF, Excel, Word, etc.)"}</p>
            <input ref={fileRef} type="file" className="hidden" onChange={e => setSelectedFile(e.target.files?.[0] || null)} />
          </div>
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Tittel" required
            className="w-full h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
            className="w-full h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
            {cats.map(c => <option key={c}>{c}</option>)}
          </select>
          <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Beskrivelse (valgfritt)"
            className="w-full h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
          <div className="flex gap-2">
            <button type="submit" disabled={uploading || (!selectedFile && !editing)} className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm hover:opacity-90 disabled:opacity-50">
              {uploading ? "Lagrer…" : "Lagre"}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="px-4 py-2 rounded-xl text-sm border border-border/30 hover:bg-muted/50">Avbryt</button>
          </div>
        </form>
      )}

      <div className="space-y-6">
        {cats.filter(cat => grouped[cat]?.length > 0).map(cat => (
          <div key={cat}>
            <h3 className="text-xs tracking-widest uppercase text-muted-foreground mb-2">{cat}</h3>
            <div className="space-y-2">
              {grouped[cat].map(item => (
                <div key={item.id} className="glass rounded-2xl px-5 py-4 border border-border/20 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <FileText size={18} className="text-primary shrink-0" strokeWidth={1.5} />
                    <div>
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.file_name}{item.description ? ` · ${item.description}` : ""}</p>
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
        ))}
      </div>
    </div>
  );
};

export default HrPanel;
