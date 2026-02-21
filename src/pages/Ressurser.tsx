import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight, Search, FileText, BookMarked, Newspaper, Archive,
  Download, FileSpreadsheet, Clock, Pin, Tag, Filter
} from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import TaxDeadlineWidget from "@/components/TaxDeadlineWidget";
import { supabase } from "@/integrations/supabase/client";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  image_url: string | null;
  tags: string[];
  pinned: boolean;
  published: boolean;
  created_at: string;
}

interface ArchiveFile {
  id: string;
  name: string;
  description: string;
  category: string;
  file_url: string;
  file_name: string;
  file_size: string;
}

interface ArchiveCategory {
  id: string;
  name: string;
  sort_order: number;
}

const TABS = [
  { key: "alle", label: "Alle", icon: Filter },
  { key: "nyheter", label: "Nyheter", icon: Newspaper },
  { key: "blogg", label: "Blogg", icon: FileText },
  { key: "guider", label: "Guider", icon: BookMarked },
  { key: "arkiv", label: "Arkiv", icon: Archive },
] as const;

type TabKey = typeof TABS[number]["key"];

const estimateReadTime = (content: string) => {
  const words = (content || "").replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
};

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("nb-NO", { year: "numeric", month: "long", day: "numeric" });

const Ressurser = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get("tab") as TabKey) || "alle";

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [archiveFiles, setArchiveFiles] = useState<ArchiveFile[]>([]);
  const [categories, setCategories] = useState<ArchiveCategory[]>([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);

  useEffect(() => {
    Promise.all([
      supabase
        .from("blog_posts")
        .select("id,title,slug,excerpt,content,category,image_url,tags,pinned,published,created_at")
        .eq("published", true)
        .order("pinned", { ascending: false })
        .order("created_at", { ascending: false }),
      supabase.from("archive_categories").select("*").order("sort_order"),
      supabase.from("archive_files").select("*").eq("active", true).order("sort_order"),
    ]).then(([{ data: blogData }, { data: cats }, { data: files }]) => {
      setPosts((blogData as BlogPost[]) || []);
      setCategories((cats as ArchiveCategory[]) || []);
      setArchiveFiles((files as ArchiveFile[]) || []);
    });
  }, []);

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    setSearchParams(tab === "alle" ? {} : { tab });
  };

  // Filter blog posts by category type
  const NYHETER_CATEGORIES = ["Nyheter", "Regnskap", "Skatt"];
  const nyheter = posts.filter(p => NYHETER_CATEGORIES.includes(p.category));
  const blogg = posts.filter(p => p.category === "Blogg");
  const guider = posts.filter(p => p.category === "Guide");

  // Search across everything
  const q = search.toLowerCase();
  const matchPost = (p: BlogPost) =>
    !q ||
    p.title.toLowerCase().includes(q) ||
    (p.excerpt || "").toLowerCase().includes(q) ||
    (p.tags || []).some(t => t.toLowerCase().includes(q));

  const matchFile = (f: ArchiveFile) =>
    !q ||
    f.name.toLowerCase().includes(q) ||
    (f.description || "").toLowerCase().includes(q) ||
    (f.category || "").toLowerCase().includes(q);

  const filteredNyheter = nyheter.filter(matchPost);
  const filteredBlogg = blogg.filter(matchPost);
  const filteredGuider = guider.filter(matchPost);
  const filteredArchive = archiveFiles.filter(matchFile);

  // Grouped archive
  const grouped = categories.reduce((acc, cat) => {
    const catFiles = filteredArchive.filter(f => f.category === cat.name);
    if (catFiles.length > 0) acc[cat.name] = catFiles;
    return acc;
  }, {} as Record<string, ArchiveFile[]>);

  // What to show based on active tab
  const showNyheter = activeTab === "alle" || activeTab === "nyheter";
  const showBlogg = activeTab === "alle" || activeTab === "blogg";
  const showGuider = activeTab === "alle" || activeTab === "guider";
  const showArkiv = activeTab === "alle" || activeTab === "arkiv";

  const totalResults =
    (showNyheter ? filteredNyheter.length : 0) +
    (showBlogg ? filteredBlogg.length : 0) +
    (showGuider ? filteredGuider.length : 0) +
    (showArkiv ? filteredArchive.length : 0);

  return (
    <>
      <Helmet>
        <title>Ressurser | Fagartikler, maler og verktøy for bedrifter — Avargo</title>
        <meta name="description" content="Gratis ressurser fra Avargo: fagartikler om regnskap og skatt, nedlastbare maler, skattekalender og nyttige verktøy for norske bedrifter." />
        <link rel="canonical" href="https://avargo.no/ressurser" />
      </Helmet>
      {/* Hero */}
      <section className="py-28 md:py-44 relative overflow-hidden">
        <div className="absolute inset-0 ambient-glow opacity-30" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl"
          >
            <p className="text-[10px] tracking-[0.45em] uppercase text-secondary mb-5 md:mb-6">
              Avargo · Ressurser
            </p>
            <h1 className="font-heading text-5xl sm:text-6xl md:text-8xl leading-[1.02] mb-8 md:mb-10">
              Kunnskap som <span className="italic text-gradient-rose">gir deg et fortrinn.</span>
            </h1>
            <p className="text-base md:text-xl text-muted-foreground font-light leading-relaxed max-w-2xl">
              Nyheter, artikler, guider og nedlastbare maler — alt samlet på ett sted.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6">
        <div className="line-accent" />
      </div>

      {/* Search + Tabs */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection>
            {/* Search bar */}
            <div className="relative max-w-xl mb-8">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Søk i alle ressurser — artikler, guider, maler…"
                className="w-full h-12 rounded-2xl border border-border/30 bg-muted/30 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
              />
              {search && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground/60">
                  {totalResults} treff
                </span>
              )}
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2">
              {TABS.map(tab => {
                const count =
                  tab.key === "alle"
                    ? filteredNyheter.length + filteredBlogg.length + filteredGuider.length + filteredArchive.length
                    : tab.key === "nyheter"
                    ? filteredNyheter.length
                    : tab.key === "blogg"
                    ? filteredBlogg.length
                    : tab.key === "guider"
                    ? filteredGuider.length
                    : filteredArchive.length;

                return (
                  <button
                    key={tab.key}
                    onClick={() => handleTabChange(tab.key)}
                    className={`flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase px-4 py-2 rounded-full border transition-all ${
                      activeTab === tab.key
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border/30 text-muted-foreground hover:border-primary/30"
                    }`}
                  >
                    <tab.icon size={13} />
                    {tab.label}
                    <span className="text-[9px] opacity-60">({count})</span>
                  </button>
                );
              })}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Content sections */}
      <section className="pb-16 md:pb-24">
        <div className="container mx-auto px-4 md:px-6 space-y-16">
          {/* Nyheter */}
          {showNyheter && filteredNyheter.length > 0 && (
            <PostSection title="Nyheter" icon={Newspaper} posts={filteredNyheter} />
          )}

          {/* Blogg */}
          {showBlogg && filteredBlogg.length > 0 && (
            <PostSection title="Blogg" icon={FileText} posts={filteredBlogg} />
          )}

          {/* Guider */}
          {showGuider && filteredGuider.length > 0 && (
            <PostSection title="Guider" icon={BookMarked} posts={filteredGuider} />
          )}

          {/* Arkiv */}
          {showArkiv && Object.keys(grouped).length > 0 && (
            <AnimatedSection>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Archive size={18} className="text-primary" strokeWidth={1.5} />
                </div>
                <div>
                  <h2 className="font-heading text-2xl md:text-3xl">Arkiv</h2>
                  <p className="text-xs text-muted-foreground font-light">Skjemaer, maler og verktøy til fri nedlasting</p>
                </div>
              </div>
              <div className="space-y-6">
                {Object.entries(grouped).map(([cat, files]) => (
                  <div key={cat}>
                    <h3 className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-3">{cat}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {files.map(file => (
                        <a
                          key={file.id}
                          href={file.file_url}
                          target="_blank"
                          rel="noreferrer"
                          className="glass rounded-2xl p-5 border border-border/20 card-lift flex items-start gap-3 group hover:border-primary/30 transition-all"
                        >
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                            <FileSpreadsheet size={18} className="text-primary" strokeWidth={1.5} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium group-hover:text-primary transition-colors">{file.name}</p>
                            {file.description && (
                              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{file.description}</p>
                            )}
                            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground/60">
                              <Download size={11} />
                              <span>{file.file_name}</span>
                              {file.file_size && <span>· {file.file_size}</span>}
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          )}

          {/* Empty state */}
          {totalResults === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-sm mb-1">Ingen ressurser funnet.</p>
              {search && (
                <button onClick={() => setSearch("")} className="text-primary text-xs hover:underline">
                  Nullstill søk
                </button>
              )}
            </div>
          )}

          {/* Skattekalender CTA */}
          <AnimatedSection className="mt-16">
            <Link
              to="/ressurser/skattekalender"
              className="glass rounded-2xl border border-border/20 p-6 flex items-center justify-between gap-4 hover:border-primary/30 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Clock size={22} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-sm group-hover:text-primary transition-colors">Skattekalender</h3>
                  <p className="text-xs text-muted-foreground/60 mt-0.5">Se alle frister for AS, ENK og arbeidsgivere i en visuell kalender</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-muted-foreground/30 group-hover:text-primary shrink-0 transition-colors" />
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
};

/* ---- Sub-component: section of blog posts ---- */
const PostSection = ({
  title,
  icon: Icon,
  posts,
}: {
  title: string;
  icon: React.ElementType;
  posts: BlogPost[];
}) => {
  // Show first post as featured if it's pinned
  const featured = posts[0]?.pinned ? posts[0] : null;
  const grid = featured ? posts.slice(1) : posts;

  return (
    <AnimatedSection>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Icon size={18} className="text-primary" strokeWidth={1.5} />
        </div>
        <h2 className="font-heading text-2xl md:text-3xl">{title}</h2>
      </div>

      {/* Featured pinned post */}
      {featured && (
        <Link to={`/nyhet/${featured.slug}`} className="block mb-6 group">
          <div className="glass rounded-3xl overflow-hidden border border-border/20 card-lift">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {featured.image_url && (
                <div className="aspect-[16/10] lg:aspect-auto overflow-hidden relative">
                  <img src={featured.image_url} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-background/80" />
                </div>
              )}
              <div className={`p-8 md:p-10 flex flex-col justify-center ${!featured.image_url ? "lg:col-span-2" : ""}`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[9px] tracking-widest uppercase text-primary border border-primary/30 px-2.5 py-0.5 rounded-full">{featured.category}</span>
                  <span className="flex items-center gap-1 text-[9px] text-secondary"><Pin size={10} /> Festet</span>
                </div>
                <h3 className="font-heading text-2xl md:text-3xl lg:text-4xl leading-tight mb-3 group-hover:text-primary transition-colors">{featured.title}</h3>
                {featured.excerpt && <p className="text-sm text-muted-foreground font-light line-clamp-2 mb-4">{featured.excerpt}</p>}
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground/60">
                  <span className="font-medium text-foreground/70">Avargo</span>
                  <span>·</span>
                  <span>{formatDate(featured.created_at)}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1"><Clock size={10} /> {estimateReadTime(featured.content || "")} min</span>
                  <ArrowRight size={14} className="text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all ml-auto" />
                </div>
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {grid.map(post => (
          <Link key={post.id} to={`/nyhet/${post.slug}`} className="glass rounded-2xl overflow-hidden border border-border/20 card-lift group block h-full">
            {post.image_url && (
              <div className="aspect-[16/9] overflow-hidden relative">
                <img src={post.image_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
              </div>
            )}
            <div className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[9px] tracking-widest uppercase text-primary border border-primary/30 px-2 py-0.5 rounded-full">{post.category}</span>
                {post.pinned && <Pin size={10} className="text-secondary" />}
              </div>
              <h3 className="font-heading text-lg mb-2 group-hover:text-primary transition-colors leading-tight">{post.title}</h3>
              {post.excerpt && <p className="text-xs text-muted-foreground font-light line-clamp-2 mb-3">{post.excerpt}</p>}
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground/60">
                <span>{formatDate(post.created_at)}</span>
                <span>·</span>
                <span className="flex items-center gap-1"><Clock size={10} /> {estimateReadTime(post.content || "")} min</span>
                <ArrowRight size={12} className="text-primary opacity-0 group-hover:opacity-100 transition-all ml-auto" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </AnimatedSection>
  );
};

export default Ressurser;
