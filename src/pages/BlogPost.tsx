import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Tag, Share2, Pin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Helmet } from "react-helmet-async";

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

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    supabase.from("blog_posts").select("*").eq("slug", slug).eq("published", true).single()
      .then(({ data }) => { setPost(data as Post | null); setLoading(false); });
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-muted-foreground text-sm">Laster…</p></div>;
  if (!post) return <div className="min-h-screen flex items-center justify-center flex-col gap-4"><p className="text-muted-foreground">Artikkelen ble ikke funnet.</p><Link to="/nyheter" className="text-primary text-sm hover:underline">← Tilbake til nyheter</Link></div>;

  const formatDate = (d: string) => new Date(d).toLocaleDateString("nb-NO", { year: "numeric", month: "long", day: "numeric" });
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
      </Helmet>

      <article className="py-28 md:py-40">
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

            <div className="flex items-center gap-4 text-xs text-muted-foreground/60 mb-8">
              <span className="flex items-center gap-1"><Calendar size={12} /> {formatDate(post.created_at)}</span>
            </div>

            {post.image_url && (
              <div className="rounded-2xl overflow-hidden mb-10">
                <img src={post.image_url} alt={post.title} className="w-full h-auto" />
              </div>
            )}

            <div className="prose prose-lg dark:prose-invert max-w-none mb-12" dangerouslySetInnerHTML={{ __html: post.content || "" }} />

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
    </>
  );
};

export default BlogPost;
