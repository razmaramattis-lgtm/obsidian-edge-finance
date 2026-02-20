import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Edit2, Pin, Eye, EyeOff, ExternalLink, Share2, Image as ImageIcon } from "lucide-react";
import RichTextEditor from "./RichTextEditor";
import SeoChecker from "./SeoChecker";

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
  const [tagInput, setTagInput] = useState("");
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
  const liShare = (slug: string) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl(slug))}`;

  if (loading) return <div className="text-muted-foreground text-sm">Laster…</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">{posts.length} innlegg</p>
        <button onClick={() => { resetForm(); setShowEditor(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm glow-rose hover:opacity-90 transition-all">
          <Plus size={14} /> Nytt innlegg
        </button>
      </div>

      {showEditor && (
        <div className="glass rounded-2xl p-5 border border-border/20 space-y-4">
          <h3 className="font-medium text-sm">{editing ? "Rediger innlegg" : "Nytt innlegg"}</h3>

          {/* Title */}
          <input value={form.title} onChange={e => {
            const title = e.target.value;
            setForm({ ...form, title, slug: editing ? form.slug : generateSlug(title) });
          }} placeholder="Tittel"
            className="w-full h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />

          {/* Slug */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground shrink-0">avargo.no/nyhet/</span>
            <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="permalink-slug"
              className="flex-1 h-9 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 font-mono" />
          </div>

          {/* Category & checkboxes */}
          <div className="flex flex-wrap items-center gap-3">
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
              className="h-9 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
            <label className="flex items-center gap-1.5 text-xs cursor-pointer">
              <input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} className="rounded" />
              Publiser
            </label>
            <label className="flex items-center gap-1.5 text-xs cursor-pointer">
              <input type="checkbox" checked={form.pinned} onChange={e => setForm({ ...form, pinned: e.target.checked })} className="rounded" />
              📌 Fest øverst
            </label>
          </div>

          {/* Excerpt */}
          <input value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} placeholder="Kort sammendrag (vises i listingen)"
            className="w-full h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />

          {/* Featured Image */}
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground font-medium">Fremhevet bilde</label>
            <div className="flex items-center gap-3">
              {form.image_url ? (
                <div className="relative group">
                  <img src={form.image_url} alt="Preview" className="h-20 w-32 object-cover rounded-xl border border-border/20" />
                  <button onClick={() => setForm({ ...form, image_url: "" })} className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                </div>
              ) : (
                <button onClick={uploadFeaturedImage} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-border/40 text-xs text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors">
                  <ImageIcon size={14} /> Last opp bilde
                </button>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground font-medium">Tagger (for søk og filtrering)</label>
            <div className="flex items-center gap-2">
              <input value={tagInput} onChange={e => setTagInput(e.target.value)} placeholder="Legg til tagg…"
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                className="flex-1 h-9 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
              <button onClick={addTag} className="px-3 py-1.5 rounded-xl bg-muted/50 text-xs hover:bg-muted transition-colors">+</button>
            </div>
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {form.tags.map(t => (
                  <span key={t} className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg bg-secondary/10 text-secondary border border-secondary/20">
                    {t}
                    <button onClick={() => removeTag(t)} className="hover:text-destructive">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Rich Text Content */}
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground font-medium">Innhold</label>
            <RichTextEditor content={form.content} onChange={content => setForm(f => ({ ...f, content }))} onImageUpload={handleImageUpload} />
          </div>

          {/* SEO fields */}
          <button onClick={() => setShowSeo(!showSeo)} className="text-xs text-primary hover:underline">
            {showSeo ? "Skjul SEO-innstillinger" : "Vis SEO-innstillinger"}
          </button>

          {showSeo && (
            <div className="space-y-3 pl-3 border-l-2 border-primary/20">
              <input value={form.meta_title} onChange={e => setForm({ ...form, meta_title: e.target.value })} placeholder="SEO-tittel (maks 60 tegn)"
                className="w-full h-9 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
              <textarea value={form.meta_description} onChange={e => setForm({ ...form, meta_description: e.target.value })} placeholder="SEO-beskrivelse (maks 160 tegn)" rows={2}
                className="w-full rounded-xl border border-border/30 bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none" />
              <SeoChecker title={form.title} metaTitle={form.meta_title} metaDescription={form.meta_description}
                excerpt={form.excerpt} content={form.content} slug={form.slug} imageUrl={form.image_url} tags={form.tags} />
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button onClick={save} className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm hover:opacity-90">Lagre</button>
            <button onClick={resetForm} className="px-4 py-2 rounded-xl text-sm border border-border/30 hover:bg-muted/50">Avbryt</button>
          </div>
        </div>
      )}

      {/* Posts list */}
      <div className="space-y-2">
        {posts.map(post => (
          <div key={post.id} className="glass rounded-2xl px-5 py-4 border border-border/20 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {post.image_url && <img src={post.image_url} alt="" className="w-12 h-8 object-cover rounded-lg shrink-0" />}
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[9px] tracking-widest uppercase text-primary border border-primary/30 px-2 py-0.5 rounded-full">{post.category}</span>
                  {!post.published && <span className="text-[9px] tracking-widest uppercase text-muted-foreground border border-border/30 px-2 py-0.5 rounded-full">Utkast</span>}
                  {post.pinned && <Pin size={11} className="text-secondary" />}
                </div>
                <p className="text-sm font-medium truncate">{post.title}</p>
                <p className="text-[10px] text-muted-foreground/60 font-mono truncate">/nyhet/{post.slug}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button onClick={() => togglePin(post)} title={post.pinned ? "Løsne" : "Fest"} className={`p-1.5 rounded-lg transition-colors ${post.pinned ? "text-secondary bg-secondary/10" : "text-muted-foreground hover:bg-muted/50"}`}>
                <Pin size={13} />
              </button>
              <button onClick={() => togglePublish(post)} className={`text-xs px-2.5 py-1.5 rounded-lg border transition-colors ${post.published ? "text-primary border-primary/30 bg-primary/10" : "text-muted-foreground border-border/30 hover:bg-muted/50"}`}>
                {post.published ? <Eye size={13} /> : <EyeOff size={13} />}
              </button>
              {post.published && post.slug && (
                <>
                  <a href={fbShare(post.slug)} target="_blank" rel="noreferrer" title="Del på Facebook" className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted/50 transition-colors">
                    <Share2 size={13} />
                  </a>
                  <a href={`/nyhet/${post.slug}`} target="_blank" rel="noreferrer" title="Vis innlegget" className="p-1.5 rounded-lg text-muted-foreground hover:text-primary transition-colors">
                    <ExternalLink size={13} />
                  </a>
                </>
              )}
              <button onClick={() => startEdit(post)} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors"><Edit2 size={13} /></button>
              <button onClick={() => del(post.id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={13} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogPanel;
