import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Edit2, Upload, FileText } from "lucide-react";

interface HmsDoc {
  id: string;
  title: string;
  content: string;
  file_url: string;
  file_name: string;
}

const HmsPanel = () => {
  const [docs, setDocs] = useState<HmsDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<HmsDoc | null>(null);
  const [form, setForm] = useState({ title: "", content: "" });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetch = async () => {
    const { data } = await supabase.from("hms_documents").select("*").order("sort_order").order("created_at");
    setDocs((data as HmsDoc[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    let fileData: { file_url?: string; file_name?: string } = {};

    if (selectedFile) {
      const path = `hms/${Date.now()}-${selectedFile.name}`;
      const { data: ud } = await supabase.storage.from("internal-docs").upload(path, selectedFile);
      if (ud) {
        const { data: { publicUrl } } = supabase.storage.from("internal-docs").getPublicUrl(path);
        fileData = { file_url: publicUrl, file_name: selectedFile.name };
      }
    }

    if (editing) {
      await supabase.from("hms_documents").update({ ...form, ...fileData }).eq("id", editing.id);
    } else {
      await supabase.from("hms_documents").insert([{ ...form, ...fileData }]);
    }
    setShowForm(false); setEditing(null); setSelectedFile(null);
    setForm({ title: "", content: "" });
    fetch();
    setUploading(false);
  };

  const del = async (doc: HmsDoc) => {
    if (!confirm("Slett HMS-dokument?")) return;
    await supabase.from("hms_documents").delete().eq("id", doc.id);
    fetch();
  };

  if (loading) return <div className="text-muted-foreground text-sm">Laster…</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">HMS-boken — synlig for alle ansatte</p>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm({ title: "", content: "" }); }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm glow-rose hover:opacity-90">
          <Plus size={14} /> Nytt HMS-kapittel
        </button>
      </div>

      {showForm && (
        <form onSubmit={save} className="glass rounded-2xl p-5 border border-border/20 space-y-3">
          <h3 className="font-medium text-sm">{editing ? "Rediger" : "Nytt HMS-kapittel"}</h3>
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Tittel" required
            className="w-full h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
          <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} placeholder="Innhold…" rows={5}
            className="w-full rounded-xl border border-border/30 bg-muted/30 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none" />
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

      <div className="space-y-3">
        {docs.map(doc => (
          <div key={doc.id} className="glass rounded-2xl p-5 border border-border/20">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-medium">{doc.title}</h3>
              <div className="flex gap-2">
                <button onClick={() => { setEditing(doc); setForm({ title: doc.title, content: doc.content || "" }); setShowForm(true); }}
                  className="text-muted-foreground hover:text-foreground"><Edit2 size={13} /></button>
                <button onClick={() => del(doc)} className="text-muted-foreground hover:text-destructive"><Trash2 size={13} /></button>
              </div>
            </div>
            {doc.content && <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{doc.content}</p>}
            {doc.file_name && (
              <a href={doc.file_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 mt-3 text-xs text-primary hover:underline">
                <FileText size={12} /> {doc.file_name}
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HmsPanel;
