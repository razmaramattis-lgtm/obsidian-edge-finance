import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Plus, Trash2, Edit2, Pin, Eye, EyeOff, ExternalLink, Share2,
  Image as ImageIcon, X, ArrowLeft, Search, Filter, MonitorPlay,
  CheckSquare, Square
} from "lucide-react";
import DOMPurify from "dompurify";
import RichTextEditor from "./RichTextEditor";
import SeoChecker from "./SeoChecker";
import { toast } from "sonner";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  published: boolean;
  pinned: boolean;
  image_url: string | null;
  tags: string[];
  meta_title: string;
  meta_description: string;
  created_at: string;
}

const generateSlug = (title: string) =>
  title.toLowerCase().replace(/[^a-z0-9æøåÆØÅ\s-]/gi, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");

const CATEGORIES = ["Blogg", "Nyheter", "Guide"];

const BlogPanel = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [showSeo, setShowSeo] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft">("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState({
    title: "", slug: "", excerpt: "", content: "", category: "Nyheter",
    published: false, pinned: false, image_url: "", tags: [] as string[],
    meta_title: "", meta_description: "",
  });

  const fetchPosts = async () => {
    const { data } = await supabase.from("blog_posts").select("*").order("pinned", { ascending: false }).order("created_at", { ascending: false });
    setPosts((data as BlogPost[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  const resetForm = () => {
    setForm({ title: "", slug: "", excerpt: "", content: "", category: "Nyheter", published: false, pinned: false, image_url: "", tags: [], meta_title: "", meta_description: "" });
    setEditing(null);
    setShowEditor(false);
    setShowSeo(false);
    setTagInput("");
  };

  const save = async () => {
    const payload = { ...form, slug: form.slug || generateSlug(form.title) };
    if (editing) {
      await supabase.from("blog_posts").update(payload).eq("id", editing.id);
    } else {
      await supabase.from("blog_posts").insert([payload]);
    }
    resetForm();
    fetchPosts();
  };

  const del = async (id: string) => {
    if (!confirm("Slett innlegg?")) return;
    await supabase.from("blog_posts").delete().eq("id", id);
    fetchPosts();
  };

  const bulkDelete = async () => {
    if (selected.size === 0) return;
    if (!confirm(`Slett ${selected.size} valgte innlegg?`)) return;
    setDeleting(true);
    for (const id of selected) {
      await supabase.from("blog_posts").delete().eq("id", id);
    }
    setSelected(new Set());
    toast.success(`${selected.size} innlegg slettet`);
    fetchPosts();
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
    setSelected(selected.size === filteredPosts.length ? new Set() : new Set(filteredPosts.map(p => p.id)));
  };

  const togglePublish = async (post: BlogPost) => {
    await supabase.from("blog_posts").update({ published: !post.published }).eq("id", post.id);
    fetchPosts();
  };

  const togglePin = async (post: BlogPost) => {
    await supabase.from("blog_posts").update({ pinned: !post.pinned }).eq("id", post.id);
    fetchPosts();
  };

  const startEdit = (post: BlogPost) => {
    setEditing(post);
    setForm({
      title: post.title, slug: post.slug || "", excerpt: post.excerpt || "", content: post.content || "",
      category: post.category || "Nyheter", published: post.published, pinned: post.pinned,
      image_url: post.image_url || "", tags: post.tags || [],
      meta_title: post.meta_title || "", meta_description: post.meta_description || "",
    });
    setShowEditor(true);
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) setForm({ ...form, tags: [...form.tags, t] });
    setTagInput("");
  };

  const removeTag = (t: string) => setForm({ ...form, tags: form.tags.filter(x => x !== t) });

  const handleImageUpload = useCallback(async (): Promise<string | null> => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    return new Promise(resolve => {
      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file) return resolve(null);
        const ext = file.name.split(".").pop();
        const path = `blog/${Date.now()}.${ext}`;
        const { error } = await supabase.storage.from("resources").upload(path, file);
        if (error) { alert("Feil ved opplasting: " + error.message); return resolve(null); }
        const { data } = supabase.storage.from("resources").getPublicUrl(path);
        resolve(data.publicUrl);
      };
      input.click();
    });
  }, []);

  const uploadFeaturedImage = async () => {
    const url = await handleImageUpload();
    if (url) setForm({ ...form, image_url: url });
  };

  const postUrl = (slug: string) => `https://avargo.no/nyhet/${slug}`;
  const fbShare = (slug: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl(slug))}`;

  const filteredPosts = posts.filter(p => {
    const matchesSearch = !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || (filterStatus === "published" ? p.published : !p.published);
    return matchesSearch && matchesFilter;
  });

  const publishedCount = posts.filter(p => p.published).length;
  const draftCount = posts.filter(p => !p.published).length;

  if (loading) return <div className="text-muted-foreground text-sm">Laster…</div>;

  // WordPress-style fullscreen editor
  if (showEditor) {
    return (
      <div className="space-y-0">
        {/* Editor Header */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={resetForm} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={15} /> Tilbake til innlegg
          </button>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowPreview(!showPreview)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm border transition-colors ${showPreview ? "bg-secondary/20 text-secondary border-secondary/30" : "border-border/30 hover:bg-muted/50"}`}>
              <MonitorPlay size={14} /> {showPreview ? "Rediger" : "Forhåndsvis"}
            </button>
            <button onClick={() => { setForm({ ...form, published: false }); save(); }}
              className="px-4 py-2 rounded-xl text-sm border border-border/30 hover:bg-muted/50 transition-colors">
              Lagre utkast
            </button>
            <button onClick={() => { setForm({ ...form, published: true }); save(); }}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm hover:opacity-90 transition-all">
              {editing?.published ? "Oppdater" : "Publiser"}
            </button>
          </div>
        </div>

        {/* Preview Mode */}
        {showPreview ? (
          <div className="glass rounded-2xl border border-border/20 p-6 md:p-10 max-w-3xl mx-auto">
            {form.image_url && (
              <img src={form.image_url} alt={form.title} className="w-full aspect-video object-cover rounded-2xl mb-6 border border-border/20" />
            )}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[9px] tracking-widest uppercase text-primary border border-primary/30 px-2.5 py-0.5 rounded-full">{form.category}</span>
              {form.pinned && <span className="text-[9px] text-secondary">📌 Festet</span>}
              <span className={`text-[9px] px-2 py-0.5 rounded-full ${form.published ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
                {form.published ? "Publisert" : "Utkast"}
              </span>
            </div>
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl leading-tight mb-4">
              {form.title || <span className="text-muted-foreground/30">Ingen tittel</span>}
            </h1>
            {form.excerpt && <p className="text-lg text-muted-foreground font-light leading-relaxed mb-6">{form.excerpt}</p>}
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-border/20">
              <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-medium">A</div>
              <div>
                <p className="text-sm font-medium">Avargo</p>
                <p className="text-xs text-muted-foreground">Forhåndsvisning</p>
              </div>
            </div>
            <div className="article-content"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(form.content || "<p class='text-muted-foreground/30'>Ingen innhold ennå…</p>") }} />
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-8 pt-6 border-t border-border/20">
                {form.tags.map(t => <span key={t} className="text-[10px] px-2.5 py-1 rounded-lg border border-border/20 text-muted-foreground">{t}</span>)}
              </div>
            )}
          </div>
        ) : (

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
          {/* Main Editor Area */}
          <div className="space-y-4">
            <input value={form.title} onChange={e => {
              const title = e.target.value;
              setForm({ ...form, title, slug: editing ? form.slug : generateSlug(title) });
            }} placeholder="Skriv tittel her…"
              className="w-full text-2xl md:text-3xl font-heading bg-transparent border-0 border-b-2 border-border/20 pb-3 focus:outline-none focus:border-primary/40 transition-colors placeholder:text-muted-foreground/30" />
            <textarea value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })}
              placeholder="Kort sammendrag som vises i listingen og i søkeresultater…"
              rows={2}
              className="w-full rounded-xl border border-border/30 bg-muted/20 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none font-light" />
            <RichTextEditor content={form.content} onChange={content => setForm(f => ({ ...f, content }))} onImageUpload={handleImageUpload} />
          </div>

          {/* Settings Sidebar */}
          <div className="space-y-4">
            <div className="glass rounded-2xl p-4 border border-border/20 space-y-3">
              <h4 className="text-xs tracking-widest uppercase text-muted-foreground">Status</h4>
              <div className="flex flex-wrap gap-2">
                <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                  <input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} className="rounded" />
                  Publisert
                </label>
                <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                  <input type="checkbox" checked={form.pinned} onChange={e => setForm({ ...form, pinned: e.target.checked })} className="rounded" />
                  📌 Festet
                </label>
              </div>
            </div>
            <div className="glass rounded-2xl p-4 border border-border/20 space-y-2">
              <h4 className="text-xs tracking-widest uppercase text-muted-foreground">Kategori</h4>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full h-9 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="glass rounded-2xl p-4 border border-border/20 space-y-2">
              <h4 className="text-xs tracking-widest uppercase text-muted-foreground">Fremhevet bilde</h4>
              {form.image_url ? (
                <div className="relative group">
                  <img src={form.image_url} alt="Preview" className="w-full aspect-video object-cover rounded-xl border border-border/20" />
                  <button onClick={() => setForm({ ...form, image_url: "" })}
                    className="absolute top-2 right-2 w-6 h-6 bg-background/80 backdrop-blur text-foreground rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <button onClick={uploadFeaturedImage}
                  className="w-full flex flex-col items-center gap-2 py-6 rounded-xl border border-dashed border-border/40 text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors">
                  <ImageIcon size={20} strokeWidth={1.5} />
                  <span className="text-xs">Last opp bilde</span>
                </button>
              )}
            </div>
            <div className="glass rounded-2xl p-4 border border-border/20 space-y-2">
              <h4 className="text-xs tracking-widest uppercase text-muted-foreground">Permalink</h4>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-muted-foreground shrink-0">/nyhet/</span>
                <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="slug"
                  className="flex-1 h-8 rounded-lg border border-border/30 bg-muted/30 px-2 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-primary/40" />
              </div>
            </div>
            <div className="glass rounded-2xl p-4 border border-border/20 space-y-2">
              <h4 className="text-xs tracking-widest uppercase text-muted-foreground">Tagger</h4>
              <div className="flex items-center gap-2">
                <input value={tagInput} onChange={e => setTagInput(e.target.value)} placeholder="Legg til…"
                  onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                  className="flex-1 h-8 rounded-lg border border-border/30 bg-muted/30 px-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary/40" />
                <button onClick={addTag} className="px-2 py-1 rounded-lg bg-muted/50 text-xs hover:bg-muted transition-colors">+</button>
              </div>
              {form.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {form.tags.map(t => (
                    <span key={t} className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md bg-secondary/10 text-secondary border border-secondary/20">
                      {t} <button onClick={() => removeTag(t)} className="hover:text-destructive">×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="glass rounded-2xl p-4 border border-border/20 space-y-2">
              <button onClick={() => setShowSeo(!showSeo)} className="flex items-center justify-between w-full">
                <h4 className="text-xs tracking-widest uppercase text-muted-foreground">SEO</h4>
                <span className="text-xs text-primary">{showSeo ? "Skjul" : "Vis"}</span>
              </button>
              {showSeo && (
                <div className="space-y-2 pt-2">
                  <input value={form.meta_title} onChange={e => setForm({ ...form, meta_title: e.target.value })} placeholder="SEO-tittel (maks 60 tegn)"
                    className="w-full h-8 rounded-lg border border-border/30 bg-muted/30 px-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary/40" />
                  <textarea value={form.meta_description} onChange={e => setForm({ ...form, meta_description: e.target.value })} placeholder="SEO-beskrivelse (maks 160 tegn)" rows={2}
                    className="w-full rounded-lg border border-border/30 bg-muted/30 px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary/40 resize-none" />
                  <SeoChecker title={form.title} metaTitle={form.meta_title} metaDescription={form.meta_description}
                    excerpt={form.excerpt} content={form.content} slug={form.slug} imageUrl={form.image_url} tags={form.tags} />
                </div>
              )}
            </div>
          </div>
        </div>
        )}
      </div>
    );
  }

  // WordPress-style post list
  return (
    <div className="space-y-4">
      {/* Header toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <button onClick={() => setFilterStatus("all")}
            className={`text-sm transition-colors ${filterStatus === "all" ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"}`}>
            Alle ({posts.length})
          </button>
          <span className="text-border">|</span>
          <button onClick={() => setFilterStatus("published")}
            className={`text-sm transition-colors ${filterStatus === "published" ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"}`}>
            Publisert ({publishedCount})
          </button>
          <span className="text-border">|</span>
          <button onClick={() => setFilterStatus("draft")}
            className={`text-sm transition-colors ${filterStatus === "draft" ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"}`}>
            Utkast ({draftCount})
          </button>
          {selected.size > 0 && (
            <>
              <span className="text-border">|</span>
              <button onClick={bulkDelete} disabled={deleting}
                className="flex items-center gap-1.5 text-sm text-destructive hover:text-destructive/80 transition-colors disabled:opacity-50">
                <Trash2 size={13} /> Slett {selected.size} valgte
              </button>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          {filteredPosts.length > 0 && (
            <button onClick={toggleAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs border border-border/30 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
              {selected.size === filteredPosts.length ? <CheckSquare size={13} /> : <Square size={13} />}
              {selected.size === filteredPosts.length ? "Fjern alle" : "Velg alle"}
            </button>
          )}
          <button onClick={() => { resetForm(); setShowEditor(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm glow-rose hover:opacity-90 transition-all">
            <Plus size={14} /> Nytt innlegg
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Søk i innlegg…"
          className="w-full h-9 rounded-xl border border-border/30 bg-muted/30 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
      </div>

      {/* Posts table */}
      <div className="glass rounded-2xl border border-border/20 overflow-hidden">
        {/* Table header */}
        <div className="hidden md:grid md:grid-cols-[32px_1fr_100px_100px_120px_100px] gap-3 px-5 py-3 border-b border-border/10 text-[10px] tracking-widest uppercase text-muted-foreground/60">
          <span></span>
          <span>Tittel</span>
          <span>Kategori</span>
          <span>Status</span>
          <span>Dato</span>
          <span className="text-right">Handlinger</span>
        </div>

        {/* Table rows */}
        <div className="divide-y divide-border/10">
          {filteredPosts.map(post => (
            <div key={post.id} className={`grid grid-cols-1 md:grid-cols-[32px_1fr_100px_100px_120px_100px] gap-2 md:gap-3 px-5 py-3 hover:bg-muted/20 transition-colors group ${
              selected.has(post.id) ? "bg-primary/5" : ""
            }`}>
              {/* Checkbox */}
              <div className="hidden md:flex items-center">
                <button onClick={() => toggleSelect(post.id)} className="text-muted-foreground hover:text-primary transition-colors">
                  {selected.has(post.id) ? <CheckSquare size={15} className="text-primary" /> : <Square size={15} />}
                </button>
              </div>

              {/* Title */}
              <div className="flex items-center gap-3 min-w-0">
                {post.image_url && <img src={post.image_url} alt="" className="w-10 h-7 object-cover rounded-lg shrink-0 hidden sm:block" />}
                <div className="min-w-0">
                  <button onClick={() => startEdit(post)} className="text-sm font-medium text-left hover:text-primary transition-colors truncate block w-full">
                    {post.title}
                  </button>
                  <p className="text-[10px] text-muted-foreground/50 font-mono truncate">/nyhet/{post.slug}</p>
                  {post.pinned && <Pin size={10} className="text-secondary inline-block ml-1" />}
                </div>
              </div>

              {/* Category */}
              <div className="flex items-center">
                <span className="text-[9px] tracking-widest uppercase text-primary border border-primary/30 px-2 py-0.5 rounded-full">{post.category}</span>
              </div>

              {/* Status */}
              <div className="flex items-center">
                {post.published ? (
                  <span className="flex items-center gap-1 text-[10px] text-primary"><Eye size={11} /> Publisert</span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground"><EyeOff size={11} /> Utkast</span>
                )}
              </div>

              {/* Date */}
              <div className="flex items-center text-xs text-muted-foreground">
                {new Date(post.created_at).toLocaleDateString("nb-NO", { day: "numeric", month: "short", year: "numeric" })}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-1">
                <button onClick={() => togglePin(post)} title={post.pinned ? "Løsne" : "Fest"}
                  className={`p-1.5 rounded-lg transition-colors ${post.pinned ? "text-secondary bg-secondary/10" : "text-muted-foreground hover:bg-muted/50"}`}>
                  <Pin size={12} />
                </button>
                <button onClick={() => togglePublish(post)}
                  className={`p-1.5 rounded-lg transition-colors ${post.published ? "text-primary" : "text-muted-foreground hover:bg-muted/50"}`}>
                  {post.published ? <Eye size={12} /> : <EyeOff size={12} />}
                </button>
                {post.published && post.slug && (
                  <a href={`/nyhet/${post.slug}`} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg text-muted-foreground hover:text-primary transition-colors">
                    <ExternalLink size={12} />
                  </a>
                )}
                <button onClick={() => startEdit(post)} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors"><Edit2 size={12} /></button>
                <button onClick={() => del(post.id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={12} /></button>
              </div>
            </div>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">Ingen innlegg funnet.</div>
        )}
      </div>
    </div>
  );
};

export default BlogPanel;