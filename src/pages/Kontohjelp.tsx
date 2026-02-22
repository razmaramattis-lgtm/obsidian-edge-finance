import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { Search, BookOpen, ChevronRight, Sparkles, Hash, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";

interface AccountEntry {
  id: string;
  account_number: string;
  name: string;
  slug: string;
  description: string | null;
  examples: string | null;
  category_group: string | null;
  tags: string[];
  mva_status: string;
}

const POPULAR_SEARCHES = [
  "husleie", "strøm", "utlegg", "mobiltelefon", "lønn", "feriepenger",
  "drivstoff", "forsikring", "regnskap", "reklame", "kurs", "varekjøp",
  "kontorrekvisita", "vatter", "kontorutstyr", "revisor",
];

const CLASS_LABELS: Record<string, string> = {
  "1": "Eiendeler",
  "2": "Egenkapital og gjeld",
  "3": "Salgsinntekter",
  "4": "Varekostnad",
  "5": "Lønnskostnader",
  "6": "Avskrivninger og driftskostnader",
  "7": "Andre driftskostnader",
  "8": "Finansposter og resultat",
};

const Kontohjelp = () => {
  const [entries, setEntries] = useState<AccountEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeClass, setActiveClass] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("account_entries")
        .select("*")
        .eq("active", true)
        .order("account_number", { ascending: true });
      setEntries((data as AccountEntry[]) || []);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    let result = entries;
    if (activeClass) {
      result = result.filter(e => e.account_number.startsWith(activeClass));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(e =>
        e.account_number.includes(q) ||
        e.name.toLowerCase().includes(q) ||
        (e.description && e.description.toLowerCase().includes(q)) ||
        (e.examples && e.examples.toLowerCase().includes(q)) ||
        (e.tags && e.tags.some(t => t.toLowerCase().includes(q)))
      );
    }
    return result;
  }, [entries, search, activeClass]);

  const groups = useMemo(() => {
    const map = new Map<string, AccountEntry[]>();
    filtered.forEach(e => {
      const group = e.category_group || "Annet";
      if (!map.has(group)) map.set(group, []);
      map.get(group)!.push(e);
    });
    return Array.from(map.entries());
  }, [filtered]);

  const classCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const cls of Object.keys(CLASS_LABELS)) {
      counts[cls] = entries.filter(e => e.account_number.startsWith(cls)).length;
    }
    return counts;
  }, [entries]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Kontohjelp – Finn riktig regnskapskonto | Avargo",
    description: "Søk i norsk kontoplan og finn riktig konto for ditt regnskap.",
    url: "https://www.avargo.no/ressurser/kontohjelp",
    publisher: { "@type": "Organization", name: "Avargo" },
  };

  return (
    <>
      <Helmet>
        <title>Kontohjelp – Finn riktig regnskapskonto | Avargo</title>
        <meta name="description" content="Søk i norsk kontoplan og finn riktig konto for regnskapet ditt. Komplett veiledning med eksempler og søkbare tags." />
        <link rel="canonical" href="https://www.avargo.no/ressurser/kontohjelp" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-primary/2 to-transparent" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto text-center space-y-5">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20"
              >
                <BookOpen size={14} /> Norsk kontoplan
              </motion.div>
              <h1 className="text-4xl md:text-6xl font-heading leading-tight">
                Finn riktig <span className="text-gradient-rose italic">konto</span>
              </h1>
              <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto font-light">
                Søk etter en utgift, et begrep eller et kontonummer — vi viser deg hvor det hører hjemme i regnskapet.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-24 space-y-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Search */}
          <AnimatedSection delay={0.1}>
            <div className="relative group">
              <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); setActiveClass(null); }}
                placeholder="Søk etter konto, utgift eller begrep..."
                className="w-full h-16 pl-14 pr-12 rounded-2xl border border-border/30 bg-card text-base focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/30 shadow-lg shadow-primary/5 transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </AnimatedSection>

          {/* Popular searches */}
          <AnimatePresence>
            {!search && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2 flex-wrap justify-center"
              >
                <span className="text-xs text-muted-foreground flex items-center gap-1"><Sparkles size={12} /> Populære:</span>
                {POPULAR_SEARCHES.map(s => (
                  <button
                    key={s}
                    onClick={() => { setSearch(s); setActiveClass(null); }}
                    className="px-3 py-1.5 rounded-full bg-muted/50 text-xs text-muted-foreground hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20 transition-all duration-200"
                  >
                    {s}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Class navigation */}
          <AnimatedSection delay={0.2}>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
              {Object.entries(CLASS_LABELS).map(([cls, label]) => (
                <motion.button
                  key={cls}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { setActiveClass(activeClass === cls ? null : cls); setSearch(""); }}
                  className={`flex flex-col items-center gap-1 px-2 py-3 rounded-2xl text-center transition-all duration-200 border ${
                    activeClass === cls
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 border-primary"
                      : "bg-card border-border/20 text-muted-foreground hover:border-primary/30 hover:shadow-md"
                  }`}
                >
                  <span className="text-xl font-heading leading-none">{cls}</span>
                  <span className="text-[9px] leading-tight line-clamp-2 font-light">{label}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${activeClass === cls ? "bg-primary-foreground/20" : "bg-muted/50"}`}>
                    {classCounts[cls] || 0}
                  </span>
                </motion.button>
              ))}
            </div>
          </AnimatedSection>

          {/* Result count */}
          <motion.p
            key={`${search}-${activeClass}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-xs text-muted-foreground"
          >
            {filtered.length} kontoer {search ? `for «${search}»` : activeClass ? `i klasse ${activeClass}` : "totalt"}
          </motion.p>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="flex items-center gap-3 text-muted-foreground text-sm">
              <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              Laster kontoplan…
            </div>
          </div>
        ) : groups.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 space-y-3"
          >
            <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto">
              <Search size={24} className="text-muted-foreground/40" />
            </div>
            <p className="text-muted-foreground text-sm">Ingen treff. Prøv et annet søkeord eller velg en kontoklasse.</p>
            {search && (
              <button onClick={() => setSearch("")} className="text-primary text-sm hover:underline">Nullstill søk</button>
            )}
          </motion.div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-10">
            {groups.map(([group, items], gi) => (
              <motion.div
                key={group}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: gi * 0.05 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Hash size={14} className="text-primary" />
                  </div>
                  <h2 className="text-lg font-heading text-foreground/90">{group}</h2>
                  <span className="text-[10px] text-muted-foreground/50 bg-muted/50 px-2 py-0.5 rounded-full">{items.length}</span>
                </div>
                <div className="space-y-2">
                  {items.map((item, i) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.02 }}
                    >
                      <Link
                        to={`/ressurser/kontohjelp/${item.slug}`}
                        className="group glass rounded-2xl px-5 py-4 border border-border/20 flex items-center justify-between gap-4 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <span className="text-sm font-mono bg-gradient-to-br from-primary/15 to-primary/5 text-primary px-3 py-1.5 rounded-xl shrink-0 border border-primary/10 font-semibold">
                            {item.account_number}
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm font-medium group-hover:text-primary transition-colors">{item.name}</p>
                            {item.description && (
                              <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5 font-light">{item.description}</p>
                            )}
                            {item.tags && item.tags.length > 0 && (
                              <div className="flex gap-1 mt-1.5 flex-wrap">
                                {item.tags.slice(0, 4).map(tag => (
                                  <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded-md bg-muted/60 text-muted-foreground/70">
                                    {tag}
                                  </span>
                                ))}
                                {item.tags.length > 4 && (
                                  <span className="text-[9px] text-muted-foreground/40">+{item.tags.length - 4}</span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 shrink-0 transition-all duration-200" />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default Kontohjelp;
