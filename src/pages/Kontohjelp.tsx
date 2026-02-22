import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { Search, BookOpen, ChevronRight, Sparkles, Hash, X, AlertTriangle, Send, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";

interface AccountEntry {
  id: string;
  account_number: string;
  name: string;
  slug: string;
  description: string | null;
  examples: string[];
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

  const [showAll, setShowAll] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackSending, setFeedbackSending] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);

  // Reset showAll and feedback form whenever search changes
  useEffect(() => {
    setShowAll(false);
    setShowFeedback(false);
    setFeedbackSent(false);
    setFeedbackMessage("");
  }, [search]);

  const submitFeedback = async () => {
    if (feedbackSending || !search.trim()) return;
    setFeedbackSending(true);
    const topResult = filtered[0] || null;
    try {
      await supabase.from("account_feedback" as any).insert([{
        search_term: search.trim(),
        top_result_account: topResult?.account_number || null,
        top_result_name: topResult?.name || null,
        message: feedbackMessage.trim() || null,
      }]);
      // Also notify admin via email
      await supabase.functions.invoke("notify", {
        body: {
          type: "account_feedback",
          data: {
            search_term: search.trim(),
            top_result_account: topResult?.account_number || null,
            top_result_name: topResult?.name || null,
            message: feedbackMessage.trim() || null,
          },
        },
      });
      setFeedbackSent(true);
      setShowFeedback(false);
    } catch {
      // silently fail
    }
    setFeedbackSending(false);
  };

  const isResultAccount = (num: string) => {
    const n = parseInt(num, 10);
    return n >= 3000 && n <= 8999;
  };

  const filtered = useMemo(() => {
    let result = entries;
    if (activeClass) {
      result = result.filter(e => e.account_number.startsWith(activeClass));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      const scored = entries
        .map(e => {
          let score = 0;
          const nameL = e.name.toLowerCase();
          const numL = e.account_number;
          if (numL === q) score += 100;
          else if (numL.startsWith(q)) score += 60;
          else if (numL.includes(q)) score += 30;
          if (nameL === q) score += 90;
          else if (nameL.startsWith(q)) score += 50;
          else if (nameL.includes(q)) score += 25;
          if (e.tags?.some(t => t.toLowerCase() === q)) score += 40;
          else if (e.tags?.some(t => t.toLowerCase().includes(q))) score += 15;
          if (e.examples?.some(ex => ex.toLowerCase().includes(q))) score += 10;
          if (e.description?.toLowerCase().includes(q)) score += 5;
          // Boost result accounts (3000-8999) over balance accounts
          if (score > 0 && isResultAccount(e.account_number)) score += 20;
          return { entry: e, score };
        })
        .filter(s => s.score > 0)
        .sort((a, b) => b.score - a.score);
      result = scored.map(s => s.entry);
      if (activeClass) {
        result = result.filter(e => e.account_number.startsWith(activeClass));
      }
    } else if (!activeClass) {
      // Default view: show result accounts (3-8) before balance accounts (1-2)
      result = [
        ...result.filter(e => isResultAccount(e.account_number)),
        ...result.filter(e => !isResultAccount(e.account_number)),
      ];
    }
    return result;
  }, [entries, search, activeClass]);

  const isSearching = search.trim().length > 0;
  const displayedResults = isSearching && !showAll ? filtered.slice(0, 1) : filtered;
  const hasMore = isSearching && filtered.length > 1;

  const groups = useMemo(() => {
    const map = new Map<string, AccountEntry[]>();
    displayedResults.forEach(e => {
      const group = e.category_group || "Annet";
      if (!map.has(group)) map.set(group, []);
      map.get(group)!.push(e);
    });
    return Array.from(map.entries());
  }, [displayedResults]);

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
                onChange={e => { setSearch(e.target.value); setActiveClass(null); setShowAll(false); }}
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
            key={`${search}-${activeClass}-${showAll}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-xs text-muted-foreground"
          >
            {isSearching && !showAll
              ? `Viser beste treff av ${filtered.length} kontoer for «${search}»`
              : `${filtered.length} kontoer ${search ? `for «${search}»` : activeClass ? `i klasse ${activeClass}` : "totalt"}`}
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
                {!(isSearching && !showAll) && (
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Hash size={14} className="text-primary" />
                    </div>
                    <h2 className="text-lg font-heading text-foreground/90">{group}</h2>
                    <span className="text-[10px] text-muted-foreground/50 bg-muted/50 px-2 py-0.5 rounded-full">{items.length}</span>
                  </div>
                )}
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
                            {isSearching && item.tags && item.tags.length > 0 && (
                              <div className="flex gap-1 mt-1.5 flex-wrap">
                                {item.tags.slice(0, 6).map(tag => (
                                  <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded-md bg-muted/60 text-muted-foreground/70">
                                    {tag}
                                  </span>
                                ))}
                                {item.tags.length > 6 && (
                                  <span className="text-[9px] text-muted-foreground/40">+{item.tags.length - 6}</span>
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
            {hasMore && !showAll && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center pt-6"
              >
                <button
                  onClick={() => setShowAll(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-muted/50 text-sm text-muted-foreground hover:bg-primary/10 hover:text-primary border border-border/30 hover:border-primary/20 transition-all duration-200"
                >
                  Vis alle {filtered.length} treff
                  <ChevronRight size={14} />
                </button>
              </motion.div>
            )}

            {/* Feedback section - show when searching */}
            {isSearching && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center pt-8 space-y-3"
              >
                {feedbackSent ? (
                  <div className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500/10 text-emerald-600 text-sm border border-emerald-500/20">
                    <CheckCircle size={16} />
                    Takk for tilbakemeldingen! Vi ser på det.
                  </div>
                ) : !showFeedback ? (
                  <button
                    onClick={() => setShowFeedback(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs text-muted-foreground hover:text-primary hover:bg-primary/5 border border-border/20 hover:border-primary/20 transition-all duration-200"
                  >
                    <AlertTriangle size={13} />
                    Fant du ikke riktig konto? Meld fra her
                  </button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-lg mx-auto glass rounded-2xl p-5 border border-primary/20 space-y-3 text-left"
                  >
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <AlertTriangle size={14} className="text-primary" />
                      Meld manglende konto
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p><span className="font-medium text-foreground/80">Søkeord:</span> {search}</p>
                      {filtered[0] && (
                        <p><span className="font-medium text-foreground/80">Beste treff:</span> {filtered[0].account_number} – {filtered[0].name}</p>
                      )}
                    </div>
                    <textarea
                      value={feedbackMessage}
                      onChange={e => setFeedbackMessage(e.target.value)}
                      placeholder="Beskriv hva du lette etter (valgfritt)…"
                      rows={2}
                      className="w-full rounded-xl border border-border/30 bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => setShowFeedback(false)}
                        className="px-4 py-2 rounded-xl text-xs border border-border/30 hover:bg-muted/50 transition-colors"
                      >
                        Avbryt
                      </button>
                      <button
                        onClick={submitFeedback}
                        disabled={feedbackSending}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-xs hover:opacity-90 disabled:opacity-50 transition-all"
                      >
                        <Send size={12} />
                        {feedbackSending ? "Sender…" : "Send tilbakemelding"}
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </div>
        )}
      </section>
    </>
  );
};

export default Kontohjelp;
