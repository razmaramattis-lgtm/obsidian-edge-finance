import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Plus, Trash2, Download, Upload, FileText, Edit2, Search, ChevronLeft, ChevronRight,
  BookOpen, Save, X, GripVertical, Eye
} from "lucide-react";
import RichTextEditor from "./RichTextEditor";
import DOMPurify from "dompurify";

// ── Types ──
interface HrResource {
  id: string;
  title: string;
  description: string;
  category: string;
  file_url: string;
  file_name: string;
}

interface HandbookChapter {
  id: string;
  title: string;
  content: string | null;
  sort_order: number;
}

// ── Constants ──
const DOC_CATS = ["Ansettelse", "Kontrakter", "Personalhåndbok", "Rutiner", "Opplæring", "Annet"];

type Tab = "handbook" | "documents";

const HrPanel = () => {
  const { isAdmin } = useAuth();
  const [tab, setTab] = useState<Tab>("handbook");

  return (
    <div className="space-y-5">
      {/* Tab bar */}
      <div className="flex gap-1 p-1 rounded-xl bg-muted/30 border border-border/10 w-fit">
        <button
          onClick={() => setTab("handbook")}
          className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
            tab === "handbook" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <BookOpen size={13} className="inline mr-1.5" />
          Personalhåndbok
        </button>
        <button
          onClick={() => setTab("documents")}
          className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
            tab === "documents" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <FileText size={13} className="inline mr-1.5" />
          HR-dokumenter
        </button>
      </div>

      {tab === "handbook" ? <HandbookTab isAdmin={isAdmin} /> : <DocumentsTab isAdmin={isAdmin} />}
    </div>
  );
};

// ══════════════════════════════════════
//  Personalhåndbok Tab
// ══════════════════════════════════════
const HandbookTab = ({ isAdmin }: { isAdmin: boolean }) => {
  const [chapters, setChapters] = useState<HandbookChapter[]>([]);
  const [active, setActive] = useState<HandbookChapter | null>(null);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);

  const fetchChapters = async () => {
    const { data } = await supabase
      .from("hr_handbook")
      .select("*")
      .order("sort_order")
      .order("created_at");
    const ch = (data as HandbookChapter[]) || [];
    setChapters(ch);
    if (ch.length > 0 && !active) setActive(ch[0]);
  };

  useEffect(() => { fetchChapters(); }, []);

  const filtered = chapters.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    (c.content || "").toLowerCase().includes(search.toLowerCase())
  );

  const saveChapter = async () => {
    if (!active) return;
    setSaving(true);
    await supabase
      .from("hr_handbook")
      .update({ title: editTitle, content: editContent } as any)
      .eq("id", active.id);
    setActive({ ...active, title: editTitle, content: editContent });
    setEditing(false);
    setSaving(false);
    fetchChapters();
  };

  const addChapter = async () => {
    if (!newTitle.trim()) return;
    const maxOrder = Math.max(0, ...chapters.map(c => c.sort_order));
    await supabase.from("hr_handbook").insert({ title: newTitle, sort_order: maxOrder + 1, content: "" } as any);
    setNewTitle("");
    setShowNew(false);
    fetchChapters();
  };

  const delChapter = async (ch: HandbookChapter) => {
    if (!confirm(`Slett kapittel "${ch.title}"?`)) return;
    await supabase.from("hr_handbook").delete().eq("id", ch.id);
    if (active?.id === ch.id) setActive(null);
    fetchChapters();
  };

  const activeIdx = chapters.findIndex(c => c.id === active?.id);
  const prev = activeIdx > 0 ? chapters[activeIdx - 1] : null;
  const next = activeIdx < chapters.length - 1 ? chapters[activeIdx + 1] : null;

  return (
    <div className="flex gap-5 h-[calc(100vh-14rem)]">
      {/* Sidebar */}
      <div className="w-56 shrink-0 flex flex-col glass rounded-2xl border border-border/20 overflow-hidden">
        <div className="p-3 border-b border-border/10">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Søk i håndbok…"
              className="w-full h-8 pl-8 pr-3 rounded-lg border border-border/20 bg-muted/20 text-xs focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {filtered.map((ch, i) => (
            <button
              key={ch.id}
              onClick={() => { setActive(ch); setEditing(false); setPreview(false); }}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all flex items-center gap-2 group ${
                active?.id === ch.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <span className="w-5 h-5 rounded-md bg-muted/50 flex items-center justify-center text-[10px] font-medium shrink-0">
                {i + 1}
              </span>
              <span className="truncate flex-1">{ch.title}</span>
              {isAdmin && (
                <button
                  onClick={e => { e.stopPropagation(); delChapter(ch); }}
                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                >
                  <Trash2 size={11} />
                </button>
              )}
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="text-[11px] text-muted-foreground text-center py-6">
              {search ? "Ingen treff" : "Ingen kapitler ennå"}
            </p>
          )}
        </div>

        {isAdmin && (
          <div className="p-3 border-t border-border/10">
            {showNew ? (
              <div className="space-y-2">
                <input
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && addChapter()}
                  placeholder="Kapitteltittel"
                  autoFocus
                  className="w-full h-8 rounded-lg border border-border/20 bg-muted/20 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/30"
                />
                <div className="flex gap-1.5">
                  <button onClick={addChapter} className="flex-1 h-7 bg-primary text-primary-foreground rounded-lg text-[11px] hover:opacity-90">Opprett</button>
                  <button onClick={() => { setShowNew(false); setNewTitle(""); }} className="h-7 px-2 rounded-lg border border-border/20 text-[11px] text-muted-foreground hover:text-foreground">Avbryt</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setShowNew(true)} className="w-full h-8 rounded-xl border border-dashed border-border/30 text-xs text-muted-foreground hover:text-foreground hover:border-primary/30 flex items-center justify-center gap-1.5 transition-all">
                <Plus size={12} /> Nytt kapittel
              </button>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col min-w-0 glass rounded-2xl border border-border/20 overflow-hidden">
        {active ? (
          <>
            {/* Chapter header */}
            <div className="px-5 py-3 border-b border-border/10 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Kapittel {activeIdx + 1}</p>
                {editing ? (
                  <input
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                    className="text-lg font-heading font-medium bg-transparent border-b border-primary/30 focus:outline-none mt-0.5 w-full"
                  />
                ) : (
                  <h2 className="text-lg font-heading font-medium mt-0.5">{active.title}</h2>
                )}
              </div>
              <div className="flex items-center gap-2">
                {isAdmin && !editing && (
                  <button
                    onClick={() => { setEditing(true); setEditContent(active.content || ""); setEditTitle(active.title); setPreview(false); }}
                    className="h-8 px-4 rounded-xl bg-primary/10 text-primary text-xs font-medium flex items-center gap-1.5 hover:bg-primary/20 transition-all"
                  >
                    <Edit2 size={12} /> Rediger
                  </button>
                )}
                {editing && (
                  <>
                    <button
                      onClick={() => setPreview(!preview)}
                      className={`h-8 px-3 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${
                        preview ? "bg-primary/10 text-primary" : "border border-border/20 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Eye size={12} /> Forhåndsvis
                    </button>
                    <button
                      onClick={saveChapter}
                      disabled={saving}
                      className="h-8 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-medium flex items-center gap-1.5 hover:opacity-90 disabled:opacity-50"
                    >
                      <Save size={12} /> {saving ? "Lagrer…" : "Lagre"}
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="h-8 w-8 rounded-xl border border-border/20 text-muted-foreground hover:text-foreground flex items-center justify-center"
                    >
                      <X size={14} />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Chapter content */}
            <div className="flex-1 overflow-y-auto">
              {editing && !preview ? (
                <RichTextEditor
                  content={editContent}
                  onChange={setEditContent}
                  placeholder="Skriv kapittelinnholdet her…"
                />
              ) : (
                <div className="p-6">
                  {(editing ? editContent : active.content) ? (
                    <div
                      className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-heading prose-img:rounded-xl prose-blockquote:border-l-primary/40 prose-blockquote:bg-muted/20 prose-blockquote:rounded-r-xl prose-a:text-primary"
                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(editing ? editContent : active.content || "") }}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground italic">Ingen innhold ennå. {isAdmin ? "Klikk \"Rediger\" for å legge til innhold." : ""}</p>
                  )}
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="px-5 py-3 border-t border-border/10 flex items-center justify-between">
              <button
                onClick={() => prev && setActive(prev)}
                disabled={!prev}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground disabled:opacity-30 transition-all"
              >
                <ChevronLeft size={14} />
                {prev?.title || "Forrige"}
              </button>
              <span className="text-[10px] text-muted-foreground">{activeIdx + 1} / {chapters.length}</span>
              <button
                onClick={() => next && setActive(next)}
                disabled={!next}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground disabled:opacity-30 transition-all"
              >
                {next?.title || "Neste"}
                <ChevronRight size={14} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
            <BookOpen size={40} strokeWidth={1} className="mb-3 opacity-20" />
            <p className="text-sm">Velg et kapittel for å lese</p>
            {isAdmin && chapters.length === 0 && (
              <p className="text-xs mt-1">Opprett ditt første kapittel i sidepanelet</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ══════════════════════════════════════
//  HR Documents Tab
// ══════════════════════════════════════
const DocumentsTab = ({ isAdmin }: { isAdmin: boolean }) => {
  const [items, setItems] = useState<HrResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<HrResource | null>(null);
  const [form, setForm] = useState({ title: "", description: "", category: "Ansettelse" });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchItems = async () => {
    const { data: all } = await supabase.from("internal_resources").select("*").order("created_at", { ascending: false });
    setItems((all as HrResource[])?.filter(r => DOC_CATS.includes(r.category)) || []);
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
      if (ud) fileData = { file_url: path, file_name: selectedFile.name };
    }
    if (editing) {
      await supabase.from("internal_resources").update({ ...form, ...fileData }).eq("id", editing.id);
    } else {
      await supabase.from("internal_resources").insert([{ ...form, ...fileData }]);
    }
    setShowForm(false); setEditing(null); setSelectedFile(null);
    setForm({ title: "", description: "", category: "Ansettelse" });
    fetchItems(); setUploading(false);
  };

  const del = async (id: string) => {
    if (!confirm("Slett HR-dokument?")) return;
    await supabase.from("internal_resources").delete().eq("id", id);
    fetchItems();
  };

  const filtered = items.filter(i =>
    i.title.toLowerCase().includes(search.toLowerCase()) ||
    (i.description || "").toLowerCase().includes(search.toLowerCase()) ||
    i.category.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = DOC_CATS.reduce((acc, cat) => {
    acc[cat] = filtered.filter(i => i.category === cat);
    return acc;
  }, {} as Record<string, HrResource[]>);

  if (loading) return <div className="text-muted-foreground text-sm">Laster…</div>;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-xs">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Søk i dokumenter…"
            className="w-full h-9 pl-8 pr-3 rounded-xl border border-border/20 bg-muted/20 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">{items.length} dokumenter</span>
          {isAdmin && (
            <button onClick={() => { setShowForm(true); setEditing(null); setForm({ title: "", description: "", category: "Ansettelse" }); }}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-xs hover:opacity-90">
              <Upload size={13} /> Last opp
            </button>
          )}
        </div>
      </div>

      {showForm && isAdmin && (
        <form onSubmit={save} className="glass rounded-2xl p-5 border border-border/20 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-sm">{editing ? "Rediger" : "Nytt"} HR-dokument</h3>
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="text-muted-foreground hover:text-foreground">
              <X size={16} />
            </button>
          </div>
          <div onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-border/30 rounded-xl p-6 text-center cursor-pointer hover:border-primary/40 transition-colors">
            <FileText size={24} className="mx-auto text-muted-foreground mb-2" strokeWidth={1.5} />
            <p className="text-xs text-muted-foreground">{selectedFile ? selectedFile.name : "Klikk for å velge fil"}</p>
            <input ref={fileRef} type="file" className="hidden" onChange={e => setSelectedFile(e.target.files?.[0] || null)} />
          </div>
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Tittel" required
            className="w-full h-9 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
            className="w-full h-9 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
            {DOC_CATS.map(c => <option key={c}>{c}</option>)}
          </select>
          <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Beskrivelse (valgfritt)"
            className="w-full h-9 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
          <div className="flex gap-2">
            <button type="submit" disabled={uploading || (!selectedFile && !editing)} className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-xs hover:opacity-90 disabled:opacity-50">
              {uploading ? "Lagrer…" : "Lagre"}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="px-4 py-2 rounded-xl text-xs border border-border/30 hover:bg-muted/50">Avbryt</button>
          </div>
        </form>
      )}

      <div className="space-y-5">
        {DOC_CATS.filter(cat => grouped[cat]?.length > 0).map(cat => (
          <div key={cat}>
            <h3 className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground/60 mb-2">{cat}</h3>
            <div className="space-y-1.5">
              {grouped[cat].map(item => (
                <div key={item.id} className="glass rounded-2xl px-5 py-3 border border-border/20 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText size={16} className="text-primary shrink-0" strokeWidth={1.5} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{item.title}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{item.file_name}{item.description ? ` · ${item.description}` : ""}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {item.file_url && (
                      <button onClick={async () => {
                        const { data } = await supabase.storage.from("internal-docs").createSignedUrl(item.file_url, 3600);
                        if (data?.signedUrl) window.open(data.signedUrl, "_blank");
                      }} className="text-muted-foreground hover:text-primary transition-colors">
                        <Download size={13} />
                      </button>
                    )}
                    {isAdmin && (
                      <>
                        <button onClick={() => { setEditing(item); setForm({ title: item.title, description: item.description || "", category: item.category }); setShowForm(true); }}
                          className="text-muted-foreground hover:text-foreground transition-colors"><Edit2 size={13} /></button>
                        <button onClick={() => del(item.id)} className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={13} /></button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">Ingen dokumenter funnet</p>
        )}
      </div>
    </div>
  );
};

export default HrPanel;
