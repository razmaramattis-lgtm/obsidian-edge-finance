import { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, BookOpen, Tag, Lightbulb, Search, X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AccountEntry {
  id: string;
  account_number: string;
  name: string;
  slug: string;
  description: string | null;
  examples: string[];
  category_group: string | null;
  tags: string[];
  related_accounts: string[];
}

const KontohjelpDetalj = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [entry, setEntry] = useState<AccountEntry | null>(null);
  const [allEntries, setAllEntries] = useState<AccountEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [{ data: current }, { data: all }] = await Promise.all([
        supabase.from("account_entries").select("*").eq("slug", slug!).eq("active", true).maybeSingle(),
        supabase.from("account_entries").select("*").eq("active", true).order("account_number", { ascending: true }),
      ]);
      setEntry(current as AccountEntry | null);
      setAllEntries((all as AccountEntry[]) || []);
      setLoading(false);
    };
    if (slug) load();
  }, [slug]);

  // Search results
  const searchResults = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return allEntries
      .map(e => {
        let score = 0;
        if (e.account_number === q) score += 100;
        else if (e.account_number.startsWith(q)) score += 60;
        else if (e.account_number.includes(q)) score += 30;
        if (e.name.toLowerCase() === q) score += 90;
        else if (e.name.toLowerCase().startsWith(q)) score += 50;
        else if (e.name.toLowerCase().includes(q)) score += 25;
        if (e.tags?.some(t => t.toLowerCase() === q)) score += 40;
        else if (e.tags?.some(t => t.toLowerCase().includes(q))) score += 15;
        if (e.examples?.some(ex => ex.toLowerCase().includes(q))) score += 10;
        if (e.description?.toLowerCase().includes(q)) score += 5;
        return { entry: e, score };
      })
      .filter(s => s.score > 0 && s.entry.slug !== slug)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map(s => s.entry);
  }, [search, allEntries, slug]);

  // Related accounts: same category_group or overlapping tags
  const related = useMemo(() => {
    if (!entry) return [];
    // Prioritize manually set related accounts
    const manual = (entry.related_accounts || [])
      .map(acc => allEntries.find(e => e.account_number === acc))
      .filter(Boolean) as AccountEntry[];
    if (manual.length > 0) return manual;
    // Fallback: auto-calculate from shared category/tags
    return allEntries
      .filter(e => e.id !== entry.id)
      .map(e => {
        let score = 0;
        if (entry.category_group && e.category_group === entry.category_group) score += 3;
        const sharedTags = (entry.tags || []).filter(t => (e.tags || []).includes(t));
        score += sharedTags.length;
        return { entry: e, score };
      })
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(s => s.entry);
  }, [entry, allEntries]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground text-sm">Laster…</div>;
  if (!entry) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-muted-foreground">Kontoen ble ikke funnet.</p>
      <Link to="/ressurser/kontohjelp" className="text-primary text-sm hover:underline">← Tilbake til kontohjelp</Link>
    </div>
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `Konto ${entry.account_number} – ${entry.name}`,
    description: entry.description || `Veiledning for konto ${entry.account_number} i norsk kontoplan.`,
    url: `https://www.avargo.no/ressurser/kontohjelp/${entry.slug}`,
    publisher: { "@type": "Organization", name: "Avargo" },
  };

  return (
    <>
      <Helmet>
        <title>{`Konto ${entry.account_number} – ${entry.name} | Avargo`}</title>
        <meta name="description" content={entry.description || `Veiledning for konto ${entry.account_number} – ${entry.name}. Lær hvor du fører denne utgiften i regnskapet.`} />
        <link rel="canonical" href={`https://www.avargo.no/ressurser/kontohjelp/${entry.slug}`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <section className="pt-32 pb-24">
        <div className="container mx-auto px-4 max-w-3xl space-y-6">
          <Link to="/ressurser/kontohjelp" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Tilbake til kontohjelp
          </Link>

          {/* Inline search */}
          <div className="relative group">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Søk etter en annen konto…"
              className="w-full h-12 pl-12 pr-10 rounded-2xl border border-border/30 bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/30 shadow-sm transition-all"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                <X size={16} />
              </button>
            )}
            <AnimatePresence>
              {searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute left-0 right-0 top-full mt-2 z-50 glass rounded-2xl border border-border/20 shadow-xl overflow-hidden"
                >
                  {searchResults.map(r => (
                    <Link
                      key={r.id}
                      to={`/ressurser/kontohjelp/${r.slug}`}
                      onClick={() => setSearch("")}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-primary/5 transition-colors border-b border-border/10 last:border-0"
                    >
                      <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-0.5 rounded-lg shrink-0">{r.account_number}</span>
                      <span className="text-sm truncate">{r.name}</span>
                      <ChevronRight size={14} className="text-muted-foreground/30 ml-auto shrink-0" />
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Main content card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass rounded-3xl border border-border/20 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-8 md:p-10 border-b border-border/10">
              <div className="flex items-start gap-5">
                <span className="text-2xl font-mono bg-primary/15 text-primary px-4 py-2 rounded-2xl shrink-0 border border-primary/20 font-bold">
                  {entry.account_number}
                </span>
                <div>
                  <h1 className="text-2xl md:text-3xl font-heading">{entry.name}</h1>
                  {entry.category_group && (
                    <p className="text-sm text-muted-foreground mt-1 font-light">{entry.category_group}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="p-8 md:p-10 space-y-8">
              {/* Tags */}
              {entry.tags && entry.tags.length > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex gap-2 flex-wrap">
                  <Tag size={14} className="text-muted-foreground/50 mt-0.5" />
                  {entry.tags.map(t => (
                    <span key={t} className="px-2.5 py-1 rounded-lg bg-muted/50 text-xs text-muted-foreground border border-border/10">{t}</span>
                  ))}
                </motion.div>
              )}

              {/* Description */}
              {entry.description && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-3">
                  <h2 className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
                    <BookOpen size={15} className="text-primary" /> Slik bruker du denne kontoen
                  </h2>
                  <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line pl-6 border-l-2 border-primary/20">
                    {entry.description}
                  </div>
                </motion.div>
              )}

              {/* Examples */}
              {entry.examples && entry.examples.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="space-y-3">
                  <h2 className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
                    <Lightbulb size={15} className="text-primary" /> Eksempler
                  </h2>
                  <div className="bg-muted/30 rounded-2xl p-5 border border-border/10 space-y-2">
                    {entry.examples.map((ex, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <span className="text-primary/60 font-mono text-xs mt-0.5 shrink-0">{i + 1}.</span>
                        <span className="leading-relaxed">{ex}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Related accounts */}
          {related.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-4"
            >
              <h2 className="text-sm font-semibold text-foreground/80">Relaterte kontoer</h2>
              <div className="grid gap-2">
                {related.map(r => (
                  <Link
                    key={r.id}
                    to={`/ressurser/kontohjelp/${r.slug}`}
                    className="group glass rounded-2xl px-5 py-3.5 border border-border/20 flex items-center justify-between gap-4 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xs font-mono bg-primary/10 text-primary px-2.5 py-1 rounded-xl shrink-0 border border-primary/10 font-semibold">
                        {r.account_number}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium group-hover:text-primary transition-colors truncate">{r.name}</p>
                        {r.category_group && (
                          <p className="text-[10px] text-muted-foreground/60 font-light">{r.category_group}</p>
                        )}
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 shrink-0 transition-all duration-200" />
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
};

export default KontohjelpDetalj;
