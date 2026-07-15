import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { Search, BookMarked, ChevronRight } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { GLOSSARY_CATEGORIES, getCategory, type GlossaryCategory } from "@/lib/glossaryCategories";

interface GlossaryTerm {
  id: string;
  term: string;
  slug: string;
  description: string | null;
  category: GlossaryCategory;
}

const Regnskapsord = () => {
  const [terms, setTerms] = useState<GlossaryTerm[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState<GlossaryCategory | "all">("all");

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("glossary_terms")
        .select("*")
        .eq("active", true)
        .order("term", { ascending: true });
      setTerms((data as GlossaryTerm[]) || []);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    let list = terms;
    if (activeCat !== "all") list = list.filter((t) => t.category === activeCat);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.term.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q))
      );
    }
    return list;
  }, [terms, search, activeCat]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: terms.length };
    GLOSSARY_CATEGORIES.forEach((cat) => {
      c[cat.key] = terms.filter((t) => t.category === cat.key).length;
    });
    return c;
  }, [terms]);

  const grouped = useMemo(() => {
    const map = new Map<string, GlossaryTerm[]>();
    filtered.forEach((t) => {
      const letter = t.term.charAt(0).toUpperCase();
      if (!map.has(letter)) map.set(letter, []);
      map.get(letter)!.push(t);
    });
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0], "nb"));
  }, [filtered]);

  const letters = useMemo(() => grouped.map(([l]) => l), [grouped]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Fagordbok – Regnskap, HR, Marked & IT | Avargo",
    description:
      "Komplett ordbok med begreper innen regnskap, HR, digital markedsføring og IT — forklart på enkel norsk.",
    url: "https://www.avargo.no/ressurser/regnskapsord",
    publisher: { "@type": "Organization", name: "Avargo" },
  };

  return (
    <>
      <Helmet>
        <title>Fagordbok – Regnskap, HR, Marked & IT | Avargo</title>
        <meta
          name="description"
          content="Komplett ordbok med begreper innen regnskap, HR, markedsføring og IT. Søk og lær — forklart på enkel norsk."
        />
        <link rel="canonical" href="https://www.avargo.no/ressurser/regnskapsord" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                <BookMarked size={14} /> Fagordbok
              </div>
              <h1 className="text-4xl md:text-5xl font-bold">Avargos fagordbok</h1>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Forklaringer på begreper innen regnskap, HR, markedsføring og IT — alt på ett sted.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-24 space-y-8">
        <div className="max-w-3xl mx-auto space-y-5">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Søk etter et begrep..."
              className="w-full h-12 pl-11 pr-4 rounded-xl border border-border/30 bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          {/* Category filter chips */}
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setActiveCat("all")}
              className={`px-4 h-9 rounded-full border text-xs font-medium transition-colors ${
                activeCat === "all"
                  ? "bg-primary/15 border-primary/40 text-primary"
                  : "border-border/30 text-muted-foreground hover:bg-muted/50"
              }`}
            >
              Alle <span className="opacity-60 ml-1">{counts.all}</span>
            </button>
            {GLOSSARY_CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCat(cat.key)}
                className={`px-4 h-9 rounded-full border text-xs font-medium transition-colors inline-flex items-center gap-2 ${
                  activeCat === cat.key ? cat.chipActive : cat.chip
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${cat.dot}`} />
                {cat.label} <span className="opacity-60">{counts[cat.key] || 0}</span>
              </button>
            ))}
          </div>

          {/* Letter nav */}
          {letters.length > 0 && (
            <div className="flex flex-wrap gap-1 justify-center">
              {letters.map((l) => (
                <a
                  key={l}
                  href={`#letter-${l}`}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  {l}
                </a>
              ))}
            </div>
          )}

          <p className="text-center text-xs text-muted-foreground">{filtered.length} begreper</p>
        </div>

        {loading ? (
          <div className="text-center text-muted-foreground text-sm py-12">Laster ordbok…</div>
        ) : grouped.length === 0 ? (
          <div className="text-center text-muted-foreground text-sm py-12">
            Ingen treff. Prøv et annet søkeord eller en annen kategori.
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-8">
            {grouped.map(([letter, items]) => (
              <div key={letter} id={`letter-${letter}`}>
                <h2 className="text-2xl font-bold text-primary mb-3">{letter}</h2>
                <div className="space-y-2">
                  {items.map((item) => {
                    const cat = getCategory(item.category);
                    return (
                      <Link
                        key={item.id}
                        to={`/ressurser/regnskapsord/${item.slug}`}
                        className="glass rounded-xl px-5 py-4 border border-border/20 flex items-center justify-between gap-4 hover:border-primary/30 transition-colors group"
                      >
                        <div className="min-w-0 flex items-center gap-3">
                          <span className={`w-2 h-2 rounded-full shrink-0 ${cat.dot}`} title={cat.label} />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm font-medium">{item.term}</p>
                              <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${cat.badge}`}>
                                {cat.short}
                              </span>
                            </div>
                            {item.description && (
                              <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{item.description}</p>
                            )}
                          </div>
                        </div>
                        <ChevronRight
                          size={16}
                          className="text-muted-foreground group-hover:text-primary shrink-0 transition-colors"
                        />
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default Regnskapsord;
