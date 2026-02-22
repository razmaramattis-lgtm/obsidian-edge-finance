import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Download, Upload, FileSpreadsheet, Edit2, X, GripVertical, Globe, Lock, CheckSquare, Square, Users } from "lucide-react";
import { toast } from "sonner";

interface ArchiveFile {
  id: string;
  name: string;
  description: string;
  category: string;
  file_url: string;
  file_name: string;
  file_size: string;
  active: boolean;
  visibility: string;
}

interface ArchiveCategory {
  id: string;
  name: string;
  sort_order: number;
}

const ArchivePanel = () => {
  const [files, setFiles] = useState<ArchiveFile[]>([]);
  const [categories, setCategories] = useState<ArchiveCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showCatForm, setShowCatForm] = useState(false);
  const [editingCat, setEditingCat] = useState<ArchiveCategory | null>(null);
  const [catName, setCatName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", category: "", active: true, visibility: "public" });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchAll = async () => {
    const [{ data: cats }, { data: files }] = await Promise.all([
      supabase.from("archive_categories").select("*").order("sort_order"),
      supabase.from("archive_files").select("*").order("sort_order").order("created_at", { ascending: false }),
    ]);
    const c = (cats as ArchiveCategory[]) || [];
    setCategories(c);
    setFiles((files as ArchiveFile[]) || []);
    if (c.length > 0 && !form.category) setForm(f => ({ ...f, category: c[0].name }));
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const upload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    setUploading(true);
    const safeName = selectedFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const path = `${Date.now()}-${safeName}`;
    const { data: uploadData, error } = await supabase.storage.from("archive-files").upload(path, selectedFile);
    if (!error && uploadData) {
      const { data: { publicUrl } } = supabase.storage.from("archive-files").getPublicUrl(path);
      await supabase.from("archive_files").insert([{
        name: form.name, description: form.description, category: form.category,
        active: form.visibility === "public",
        visibility: form.visibility,
        file_url: publicUrl, file_name: selectedFile.name,
        file_size: `${(selectedFile.size / 1024).toFixed(0)} KB`,
      } as any]);
      setShowForm(false); setSelectedFile(null);
      setForm({ name: "", description: "", category: categories[0]?.name || "", active: true, visibility: "public" });
      fetchAll();
    }
    setUploading(false);
  };

  const del = async (file: ArchiveFile) => {
    if (!confirm("Slett fil?")) return;
    if (file.file_url) {
      const storagePath = file.file_url.split("/archive-files/")[1];
      if (storagePath) await supabase.storage.from("archive-files").remove([storagePath]);
    }
    await supabase.from("archive_files").delete().eq("id", file.id);
    fetchAll();
  };

  const bulkDelete = async () => {
    if (selected.size === 0) return;
    if (!confirm(`Slett ${selected.size} valgte filer?`)) return;
    setDeleting(true);
    const toDelete = files.filter(f => selected.has(f.id));
    const storagePaths = toDelete
      .filter(f => f.file_url)
      .map(f => f.file_url.split("/archive-files/")[1])
      .filter(Boolean);
    if (storagePaths.length) await supabase.storage.from("archive-files").remove(storagePaths);
    for (const id of selected) {
      await supabase.from("archive_files").delete().eq("id", id);
    }
    setSelected(new Set());
    toast.success(`${toDelete.length} filer slettet`);
    fetchAll();
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
    if (selected.size === files.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(files.map(f => f.id)));
    }
  };

  const cycleVisibility = async (file: ArchiveFile) => {
    const order = ["public", "customer", "internal"];
    const current = file.visibility || (file.active ? "public" : "internal");
    const next = order[(order.indexOf(current) + 1) % order.length];
    await supabase.from("archive_files").update({
      visibility: next,
      active: next === "public",
    } as any).eq("id", file.id);
    fetchAll();
  };

  const visLabel = (v: string) => {
    if (v === "public") return { text: "Offentlig", icon: Globe, cls: "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20" };
    if (v === "customer") return { text: "Kundeportal", icon: Users, cls: "bg-primary/10 text-primary hover:bg-primary/20" };
    return { text: "Kun intern", icon: Lock, cls: "bg-muted/50 text-muted-foreground hover:bg-muted" };
  };

  const saveCat = async () => {
    if (!catName.trim()) return;
    if (editingCat) {
      await supabase.from("archive_categories").update({ name: catName.trim() }).eq("id", editingCat.id);
    } else {
      await supabase.from("archive_categories").insert([{ name: catName.trim(), sort_order: categories.length }]);
    }
    setCatName(""); setEditingCat(null); setShowCatForm(false); fetchAll();
  };

  const delCat = async (cat: ArchiveCategory) => {
    if (!confirm(`Slett kategori "${cat.name}"?`)) return;
    await supabase.from("archive_categories").delete().eq("id", cat.id);
    fetchAll();
  };

  if (loading) return <div className="text-muted-foreground text-sm">Laster…</div>;

  const grouped = categories.reduce((acc, cat) => {
    acc[cat.name] = files.filter(f => f.category === cat.name);
    return acc;
  }, {} as Record<string, ArchiveFile[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <p className="text-muted-foreground text-sm">{files.length} filer i arkivet</p>
          {selected.size > 0 && (
            <button onClick={bulkDelete} disabled={deleting}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors disabled:opacity-50">
              <Trash2 size={13} /> Slett {selected.size} valgte
            </button>
          )}
        </div>
        <div className="flex gap-2">
          {files.length > 0 && (
            <button onClick={toggleAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs border border-border/30 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
              {selected.size === files.length ? <CheckSquare size={13} /> : <Square size={13} />}
              {selected.size === files.length ? "Fjern alle" : "Velg alle"}
            </button>
          )}
          <button onClick={() => setShowCatForm(!showCatForm)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm border border-border/30 hover:bg-muted/50">
            <Edit2 size={13} /> Kategorier
          </button>
          <button onClick={() => { setShowForm(true); setForm(f => ({ ...f, category: categories[0]?.name || "" })); }}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm glow-rose hover:opacity-90">
            <Upload size={14} /> Last opp fil
          </button>
        </div>
      </div>

      {showCatForm && (
        <div className="glass rounded-2xl p-5 border border-border/20 space-y-3">
          <h3 className="font-medium text-sm">Administrer kategorier</h3>
          <div className="space-y-1.5">
            {categories.map(cat => (
              <div key={cat.id} className="flex items-center gap-2 text-sm">
                <span className="flex-1 px-2 py-1.5 bg-muted/30 rounded-lg">{cat.name}</span>
                <button onClick={() => { setEditingCat(cat); setCatName(cat.name); }} className="text-muted-foreground hover:text-foreground"><Edit2 size={13} /></button>
                <button onClick={() => delCat(cat)} className="text-muted-foreground hover:text-destructive"><Trash2 size={13} /></button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={catName} onChange={e => setCatName(e.target.value)} placeholder={editingCat ? "Nytt navn" : "Ny kategori"}
              className="flex-1 h-9 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              onKeyDown={e => e.key === "Enter" && saveCat()} />
            <button onClick={saveCat} className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm hover:opacity-90">
              {editingCat ? "Oppdater" : "Legg til"}
            </button>
            {editingCat && <button onClick={() => { setEditingCat(null); setCatName(""); }} className="px-3 py-2 rounded-xl text-sm border border-border/30 hover:bg-muted/50">Avbryt</button>}
          </div>
        </div>
      )}

      {showForm && (
        <form onSubmit={upload} className="glass rounded-2xl p-5 border border-border/20 space-y-3">
          <h3 className="font-medium text-sm">Last opp fil til arkivet</h3>
          <div onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-border/30 rounded-xl p-8 text-center cursor-pointer hover:border-primary/40 transition-colors">
            <FileSpreadsheet size={28} className="mx-auto text-muted-foreground mb-2" strokeWidth={1.5} />
            <p className="text-sm text-muted-foreground">{selectedFile ? selectedFile.name : "Klikk for å velge fil"}</p>
            <input ref={fileRef} type="file" className="hidden" onChange={e => setSelectedFile(e.target.files?.[0] || null)} />
          </div>
          <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Filnavn/tittel" required
            className="w-full h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
            className="w-full h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
            {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
          <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Kort beskrivelse"
            className="w-full h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
          <select value={form.visibility} onChange={e => setForm({ ...form, visibility: e.target.value })}
            className="w-full h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
            <option value="public">🌐 Offentlig (alle kan se)</option>
            <option value="customer">👥 Kundeportal (kun innloggede kunder)</option>
            <option value="internal">🔒 Kun intern (ansatte)</option>
          </select>
          <div className="flex gap-2">
            <button type="submit" disabled={uploading || !selectedFile} className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm hover:opacity-90 disabled:opacity-50">
              {uploading ? "Laster opp…" : "Last opp"}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl text-sm border border-border/30 hover:bg-muted/50">Avbryt</button>
          </div>
        </form>
      )}

      <div className="space-y-6">
        {categories.filter(cat => grouped[cat.name]?.length > 0).map(cat => (
          <div key={cat.id}>
            <h3 className="text-xs tracking-widest uppercase text-muted-foreground mb-2">{cat.name}</h3>
            <div className="space-y-2">
              {grouped[cat.name].map(file => (
                <div key={file.id} className={`glass rounded-2xl px-5 py-4 border flex items-center justify-between gap-4 transition-colors ${
                  selected.has(file.id) ? "border-primary/40 bg-primary/5" : "border-border/20"
                }`}>
                  <div className="flex items-center gap-3">
                    <button onClick={() => toggleSelect(file.id)} className="text-muted-foreground hover:text-primary transition-colors shrink-0">
                      {selected.has(file.id) ? <CheckSquare size={16} className="text-primary" /> : <Square size={16} />}
                    </button>
                    <FileSpreadsheet size={18} className="text-primary shrink-0" strokeWidth={1.5} />
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{file.file_name} {file.file_size && `· ${file.file_size}`}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {(() => {
                      const v = visLabel(file.visibility || (file.active ? "public" : "internal"));
                      return (
                        <button onClick={() => cycleVisibility(file)}
                          className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium transition-colors ${v.cls}`}>
                          <v.icon size={11} />
                          {v.text}
                        </button>
                      );
                    })()}
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
