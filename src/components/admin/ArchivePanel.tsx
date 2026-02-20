import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Download, Upload, FileSpreadsheet } from "lucide-react";

interface ArchiveFile {
  id: string;
  name: string;
  description: string;
  category: string;
  file_url: string;
  file_name: string;
  file_size: string;
  active: boolean;
}

const categories = ["Generelt", "Avstemminger", "Bil & Kjøretøy", "Investeringsanalyse", "Skatt & MVA", "HMS", "Regnskap"];

const ArchivePanel = () => {
  const [files, setFiles] = useState<ArchiveFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", category: "Generelt", active: true });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetch = async () => {
    const { data } = await supabase.from("archive_files").select("*").order("sort_order").order("created_at", { ascending: false });
    setFiles((data as ArchiveFile[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const upload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    setUploading(true);

    const ext = selectedFile.name.split(".").pop();
    const path = `${Date.now()}-${selectedFile.name}`;

    const { data: uploadData, error } = await supabase.storage.from("archive-files").upload(path, selectedFile);

    if (!error && uploadData) {
      const { data: { publicUrl } } = supabase.storage.from("archive-files").getPublicUrl(path);
      await supabase.from("archive_files").insert([{
        ...form,
        file_url: publicUrl,
        file_name: selectedFile.name,
        file_size: `${(selectedFile.size / 1024).toFixed(0)} KB`,
      }]);
      setShowForm(false);
      setSelectedFile(null);
      setForm({ name: "", description: "", category: "Generelt", active: true });
      fetch();
    }
    setUploading(false);
  };

  const del = async (file: ArchiveFile) => {
    if (!confirm("Slett fil?")) return;
    if (file.file_name) {
      await supabase.storage.from("archive-files").remove([file.file_url.split("/archive-files/")[1]]);
    }
    await supabase.from("archive_files").delete().eq("id", file.id);
    fetch();
  };

  if (loading) return <div className="text-muted-foreground text-sm">Laster…</div>;

  const grouped = categories.reduce((acc, cat) => {
    acc[cat] = files.filter(f => f.category === cat);
    return acc;
  }, {} as Record<string, ArchiveFile[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">{files.length} filer i arkivet</p>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm glow-rose hover:opacity-90">
          <Upload size={14} /> Last opp fil
        </button>
      </div>

      {showForm && (
        <form onSubmit={upload} className="glass rounded-2xl p-5 border border-border/20 space-y-3">
          <h3 className="font-medium text-sm">Last opp fil til arkivet</h3>
          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-border/30 rounded-xl p-8 text-center cursor-pointer hover:border-primary/40 transition-colors"
          >
            <FileSpreadsheet size={28} className="mx-auto text-muted-foreground mb-2" strokeWidth={1.5} />
            <p className="text-sm text-muted-foreground">{selectedFile ? selectedFile.name : "Klikk for å velge fil (PDF, Excel, Word, bilder, etc.)"}</p>
            <input ref={fileRef} type="file" className="hidden" onChange={e => setSelectedFile(e.target.files?.[0] || null)} />
          </div>
          <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Filnavn/tittel" required
            className="w-full h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
            className="w-full h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
          <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Kort beskrivelse (valgfritt)"
            className="w-full h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
          <div className="flex gap-2">
            <button type="submit" disabled={uploading || !selectedFile} className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm hover:opacity-90 disabled:opacity-50">
              {uploading ? "Laster opp…" : "Last opp"}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl text-sm border border-border/30 hover:bg-muted/50">Avbryt</button>
          </div>
        </form>
      )}

      <div className="space-y-6">
        {categories.filter(cat => grouped[cat]?.length > 0).map(cat => (
          <div key={cat}>
            <h3 className="text-xs tracking-widest uppercase text-muted-foreground mb-2">{cat}</h3>
            <div className="space-y-2">
              {grouped[cat].map(file => (
                <div key={file.id} className="glass rounded-2xl px-5 py-4 border border-border/20 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <FileSpreadsheet size={18} className="text-primary shrink-0" strokeWidth={1.5} />
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{file.file_name} {file.file_size && `· ${file.file_size}`}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {file.file_url && (
                      <a href={file.file_url} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                        <Download size={14} />
                      </a>
                    )}
                    <button onClick={() => del(file)} className="text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
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

export default ArchivePanel;
