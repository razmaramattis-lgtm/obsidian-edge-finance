import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Tag, Share2, Pin, Clock, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Helmet } from "react-helmet-async";
import DOMPurify from "dompurify";
import AnimatedSection from "@/components/AnimatedSection";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  image_url: string | null;
  tags: string[];
  pinned: boolean;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
}

const estimateReadTime = (content: string) => {
  const words = (content || "").replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    supabase.from("blog_posts").select("*").eq("slug", slug).eq("published", true).single()
      .then(({ data }) => {
        const p = data as Post | null;
        setPost(p);
        setLoading(false);

        // Fetch related posts by tags or category
        if (p) {
          supabase.from("blog_posts")
            .select("id,title,slug,excerpt,content,category,image_url,tags,pinned,created_at")
            .eq("published", true)
            .neq("id", p.id)
            .order("created_at", { ascending: false })
            .limit(20)
            .then(({ data: allPosts }) => {
              if (!allPosts) return;
              const scored = (allPosts as Post[]).map(rp => {
                let score = 0;
                if (rp.category === p.category) score += 2;
                const sharedTags = (rp.tags || []).filter(t => (p.tags || []).includes(t));
                score += sharedTags.length;
                return { ...rp, score };
              }).filter(rp => rp.score > 0).sort((a, b) => b.score - a.score).slice(0, 3);
              setRelatedPosts(scored);
            });
        }
      });
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-muted-foreground text-sm">Laster…</p></div>;
  if (!post) return <div className="min-h-screen flex items-center justify-center flex-col gap-4"><p className="text-muted-foreground">Artikkelen ble ikke funnet.</p><Link to="/nyheter" className="text-primary text-sm hover:underline">← Tilbake til nyheter</Link></div>;

  const formatDate = (d: string) => new Date(d).toLocaleDateString("nb-NO", { year: "numeric", month: "long", day: "numeric" });
  const readTime = estimateReadTime(post.content || "");
  const postUrl = `https://avargo.no/nyhet/${post.slug}`;
  const fbShare = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;
  const liShare = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`;

  return (
    <>
      <Helmet>
        <title>{post.meta_title || post.title} | Avargo</title>
        <meta name="description" content={post.meta_description || post.excerpt || ""} />
        <meta property="og:title" content={post.meta_title || post.title} />
        <meta property="og:description" content={post.meta_description || post.excerpt || ""} />
        {post.image_url && <meta property="og:image" content={post.image_url} />}
        <meta property="og:url" content={postUrl} />
        <meta property="og:type" content="article" />
        <link rel="canonical" href={postUrl} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.excerpt || "",
          image: post.image_url || undefined,
          datePublished: post.created_at,
          dateModified: post.updated_at,
          author: { "@type": "Organization", name: "Avargo" },
          publisher: { "@type": "Organization", name: "Avargo" },
        })}</script>
      </Helmet>

      {/* Hero Image */}
      {post.image_url && (
        <div className="relative w-full h-[40vh] md:h-[55vh] overflow-hidden">
          <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>
      )}

      <article className={`${post.image_url ? "pt-0 -mt-24 relative" : "pt-28 md:pt-40"} pb-16 md:pb-24`}>
        <div className="container mx-auto px-4 md:px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-3xl mx-auto">
            <Link to="/nyheter" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
              <ArrowLeft size={14} /> Tilbake til nyheter
            </Link>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] tracking-widest uppercase text-primary border border-primary/30 px-2.5 py-0.5 rounded-full">{post.category}</span>
              {post.pinned && <span className="flex items-center gap-1 text-[10px] text-secondary"><Pin size={10} /> Festet</span>}
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl leading-[1.05] mb-6">{post.title}</h1>

            {post.excerpt && <p className="text-lg text-muted-foreground font-light leading-relaxed mb-6">{post.excerpt}</p>}

            {/* Author & Meta Row */}
            <div className="flex flex-wrap items-center gap-4 mb-10 pb-8 border-b border-border/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-medium">A</div>
                <div>
                  <p className="text-sm font-medium">Avargo</p>
                  <p className="text-xs text-muted-foreground">{formatDate(post.created_at)}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
                <Clock size={13} />
                <span>{readTime} min lesetid</span>
              </div>
            </div>

            {/* Article Content */}
            <div className="prose prose-lg dark:prose-invert max-w-none mb-12
              prose-headings:font-heading prose-headings:tracking-tight
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-2xl prose-img:border prose-img:border-border/20
              prose-blockquote:border-l-primary/40 prose-blockquote:bg-muted/20 prose-blockquote:rounded-r-xl prose-blockquote:py-1 prose-blockquote:px-6"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content || "") }} />

            {/* Tags */}
            {(post.tags || []).length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-8 pt-6 border-t border-border/20">
                <Tag size={14} className="text-muted-foreground" />
                {post.tags.map(t => (
                  <Link key={t} to={`/nyheter?tag=${encodeURIComponent(t)}`} className="text-[10px] px-2.5 py-1 rounded-lg border border-border/20 text-muted-foreground hover:border-primary/30 hover:text-primary transition-colors">
                    {t}
                  </Link>
                ))}
              </div>
            )}

            {/* Share */}
            <div className="flex items-center gap-3 pt-6 border-t border-border/20">
              <span className="text-xs text-muted-foreground flex items-center gap-1.5"><Share2 size={13} /> Del:</span>
              <a href={fbShare} target="_blank" rel="noreferrer" className="text-xs px-3 py-1.5 rounded-lg border border-border/30 text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors">
                Facebook
              </a>
              <a href={liShare} target="_blank" rel="noreferrer" className="text-xs px-3 py-1.5 rounded-lg border border-border/30 text-muted-foreground hover:border-secondary/40 hover:text-secondary transition-colors">
                LinkedIn
              </a>
            </div>
          </motion.div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 md:py-24 border-t border-border/10">
          <div className="container mx-auto px-4 md:px-6">
            <AnimatedSection>
              <h2 className="font-heading text-2xl md:text-3xl mb-8">Relaterte artikler</h2>
            </AnimatedSection>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((rp, i) => (
                <AnimatedSection key={rp.id} delay={i * 0.08}>
                  <Link to={`/nyhet/${rp.slug}`} className="glass rounded-2xl overflow-hidden border border-border/20 card-lift group block h-full">
                    {rp.image_url && (
                      <div className="aspect-[16/9] overflow-hidden relative">
                        <img src={rp.image_url} alt={rp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
                      </div>
                    )}
                    <div className="p-5">
                      <span className="text-[9px] tracking-widest uppercase text-primary">{rp.category}</span>
                      <h3 className="font-heading text-lg mt-1 mb-2 group-hover:text-primary transition-colors leading-tight">{rp.title}</h3>
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground/60">
                        <span>{formatDate(rp.created_at)}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1"><Clock size={10} /> {estimateReadTime(rp.content || "")} min</span>
                        <ArrowRight size={12} className="text-primary opacity-0 group-hover:opacity-100 transition-all ml-auto" />
                      </div>
                    </div>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default BlogPost;
