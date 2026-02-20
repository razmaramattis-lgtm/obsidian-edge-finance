import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Search, Tag, Pin } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { supabase } from "@/integrations/supabase/client";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  image_url: string | null;
  tags: string[];
  pinned: boolean;
  published: boolean;
  created_at: string;
}

const BlogListing = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    supabase.from("blog_posts").select("id,title,slug,excerpt,category,image_url,tags,pinned,published,created_at")
      .eq("published", true).order("pinned", { ascending: false }).order("created_at", { ascending: false })
      .then(({ data }) => setPosts((data as BlogPost[]) || []));
  }, []);

  const allTags = Array.from(new Set(posts.flatMap(p => p.tags || [])));
  const allCategories = Array.from(new Set(posts.map(p => p.category).filter(Boolean)));

  const filtered = posts.filter(p => {
    const matchesSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || (p.excerpt || "").toLowerCase().includes(search.toLowerCase()) || (p.tags || []).some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchesTag = !activeTag || (p.tags || []).includes(activeTag);
    const matchesCat = !activeCategory || p.category === activeCategory;
    return matchesSearch && matchesTag && matchesCat;
  });

  const formatDate = (d: string) => new Date(d).toLocaleDateString("nb-NO", { year: "numeric", month: "long", day: "numeric" });

  return (
    <>
      <section className="py-28 md:py-44 relative overflow-hidden">
        <div className="absolute inset-0 ambient-glow opacity-30" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} className="max-w-4xl">
            <p className="text-[10px] tracking-[0.45em] uppercase text-secondary mb-5 md:mb-6">Avargo · Nyheter</p>
            <h1 className="font-heading text-5xl sm:text-6xl md:text-8xl leading-[1.02] mb-8 md:mb-10">
              Nyheter & <span className="italic text-gradient-rose">innsikt.</span>
            </h1>
            <p className="text-base md:text-xl text-muted-foreground font-light leading-relaxed max-w-2xl">
              Artikler, guider og oppdateringer fra Avargo-teamet.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6"><div className="line-accent" /></div>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          {/* Search & Filters */}
          <AnimatedSection>
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1 max-w-md">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Søk i artikler og tagger…"
                  className="w-full h-10 rounded-xl border border-border/30 bg-muted/30 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
              </div>
            </div>

            {allCategories.length > 1 && (
              <div className="flex flex-wrap gap-2 mb-4">
                <button onClick={() => setActiveCategory(null)}
                  className={`text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 rounded-full border transition-colors ${!activeCategory ? "bg-primary text-primary-foreground border-primary" : "border-border/30 text-muted-foreground hover:border-primary/30"}`}>
                  Alle
                </button>
                {allCategories.map(c => (
                  <button key={c} onClick={() => setActiveCategory(activeCategory === c ? null : c)}
                    className={`text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 rounded-full border transition-colors ${activeCategory === c ? "bg-primary text-primary-foreground border-primary" : "border-border/30 text-muted-foreground hover:border-primary/30"}`}>
                    {c}
                  </button>
                ))}
              </div>
            )}

            {allTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-8">
                {allTags.map(t => (
                  <button key={t} onClick={() => setActiveTag(activeTag === t ? null : t)}
                    className={`flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-lg border transition-colors ${activeTag === t ? "bg-secondary/20 text-secondary border-secondary/30" : "border-border/20 text-muted-foreground hover:border-secondary/20"}`}>
                    <Tag size={10} /> {t}
                  </button>
                ))}
              </div>
            )}
          </AnimatedSection>

          {/* Post grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post, i) => (
              <AnimatedSection key={post.id} delay={i * 0.05}>
                <Link to={`/nyhet/${post.slug}`} className="glass rounded-2xl overflow-hidden border border-border/20 card-lift group block h-full">
                  {post.image_url && (
                    <div className="aspect-[16/9] overflow-hidden">
                      <img src={post.image_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="p-5 md:p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[9px] tracking-widest uppercase text-primary border border-primary/30 px-2 py-0.5 rounded-full">{post.category}</span>
                      {post.pinned && <Pin size={11} className="text-secondary" />}
                    </div>
                    <h3 className="font-heading text-lg md:text-xl mb-2 group-hover:text-primary transition-colors">{post.title}</h3>
                    {post.excerpt && <p className="text-sm text-muted-foreground font-light line-clamp-2 mb-3">{post.excerpt}</p>}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground/60">{formatDate(post.created_at)}</span>
                      <ArrowRight size={14} className="text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                    {(post.tags || []).length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {post.tags.slice(0, 3).map(t => (
                          <span key={t} className="text-[9px] px-2 py-0.5 rounded-md bg-muted/50 text-muted-foreground">{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-sm">Ingen artikler funnet.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default BlogListing;
