import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Edit2, Check, X, Eye, EyeOff } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  published: boolean;
  created_at: string;
}

const BlogPanel = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ title: "", excerpt: "", content: "", category: "Blogg", published: false });

  const fetch = async () => {
    const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
    setPosts((data as BlogPost[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const save = async () => {
    if (editing) {
      await supabase.from("blog_posts").update(form).eq("id", editing.id);
    } else {
      await supabase.from("blog_posts").insert([form]);
    }
    setEditing(null); setShowNew(false);
    setForm({ title: "", excerpt: "", content: "", category: "Blogg", published: false });
    fetch();
  };

  const del = async (id: string) => {
    if (!confirm("Slett innlegg?")) return;
    await supabase.from("blog_posts").delete().eq("id", id);
    fetch();
  };

  const togglePublish = async (post: BlogPost) => {
    await supabase.from("blog_posts").update({ published: !post.published }).eq("id", post.id);
    fetch();
  };

  const startEdit = (post: BlogPost) => {
    setEditing(post);
    setForm({ title: post.title, excerpt: post.excerpt || "", content: post.content || "", category: post.category, published: post.published });
    setShowNew(true);
  };

  if (loading) return <div className="text-muted-foreground text-sm">Laster…</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">{posts.length} innlegg</p>
        <button onClick={() => { setShowNew(true); setEditing(null); setForm({ title: "", excerpt: "", content: "", category: "Blogg", published: false }); }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm glow-rose hover:opacity-90 transition-all">
          <Plus size={14} /> Nytt innlegg
        </button>
      </div>

      {showNew && (
        <div className="glass rounded-2xl p-5 border border-border/20 space-y-3">
          <h3 className="font-medium text-sm">{editing ? "Rediger innlegg" : "Nytt innlegg"}</h3>
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Tittel"
            className="w-full h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
            className="h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
            {["Blogg", "Nyheter", "Guide"].map(c => <option key={c}>{c}</option>)}
          </select>
          <input value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} placeholder="Kort sammendrag"
            className="w-full h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
          <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} placeholder="Innhold…" rows={6}
            className="w-full rounded-xl border border-border/30 bg-muted/30 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none" />
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} className="rounded" />
            Publiser umiddelbart
          </label>
          <div className="flex gap-2">
            <button onClick={save} className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm hover:opacity-90">Lagre</button>
            <button onClick={() => { setShowNew(false); setEditing(null); }} className="px-4 py-2 rounded-xl text-sm border border-border/30 hover:bg-muted/50">Avbryt</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {posts.map(post => (
          <div key={post.id} className="glass rounded-2xl px-5 py-4 border border-border/20 flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[9px] tracking-widest uppercase text-primary border border-primary/30 px-2 py-0.5 rounded-full">{post.category}</span>
                {!post.published && <span className="text-[9px] tracking-widest uppercase text-muted-foreground border border-border/30 px-2 py-0.5 rounded-full">Utkast</span>}
              </div>
              <p className="text-sm font-medium truncate">{post.title}</p>
              <p className="text-xs text-muted-foreground truncate">{post.excerpt}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => togglePublish(post)} className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${post.published ? "text-primary border-primary/30 bg-primary/10" : "text-muted-foreground border-border/30 hover:bg-muted/50"}`}>
                {post.published ? "Publisert" : "Publiser"}
              </button>
              <button onClick={() => startEdit(post)} className="text-muted-foreground hover:text-foreground"><Edit2 size={14} /></button>
              <button onClick={() => del(post.id)} className="text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogPanel;
