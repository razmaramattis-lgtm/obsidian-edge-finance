import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { Search, BookOpen, ChevronRight } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

interface AccountEntry {
  id: string;
  account_number: string;
  name: string;
  slug: string;
  description: string | null;
  examples: string | null;
  category_group: string | null;
  business_types: string[];
  mva_status: string;
}

const BUSINESS_TYPES = [
  { value: "AS", label: "AS / NUF" },
  { value: "ENK", label: "Enkeltpersonforetak" },
  { value: "Landbruk", label: "Landbruk" },
];

const Kontohjelp = () => {
  const [entries, setEntries] = useState<AccountEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [businessType, setBusinessType] = useState("AS");

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
    let result = entries.filter(e => e.business_types?.includes(businessType));
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(e =>
        e.account_number.includes(q) ||
        e.name.toLowerCase().includes(q) ||
        (e.description && e.description.toLowerCase().includes(q)) ||
        (e.examples && e.examples.toLowerCase().includes(q))
      );
    }
    return result;
  }, [entries, search, businessType]);

  const groups = useMemo(() => {
    const map = new Map<string, AccountEntry[]>();
    filtered.forEach(e => {
      const group = e.category_group || "Annet";
      if (!map.has(group)) map.set(group, []);
      map.get(group)!.push(e);
    });
    return Array.from(map.entries());
  }, [filtered]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Kontohjelp – Finn riktig regnskapskonto | Avargo",
    description: "Søk i norsk kontoplan og finn riktig konto for ditt regnskap. Veiledning for AS, ENK og landbruk.",
    url: "https://www.avargo.no/ressurser/kontohjelp",
    publisher: { "@type": "Organization", name: "Avargo" },
  };

  return (
    <>
      <Helmet>
        <title>Kontohjelp – Finn riktig regnskapskonto | Avargo</title>
        <meta name="description" content="Søk i norsk kontoplan og finn riktig konto for regnskapet ditt. Komplett veiledning for AS, ENK og landbruk med eksempler." />
        <link rel="canonical" href="https://www.avargo.no/ressurser/kontohjelp" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                <BookOpen size={14} /> Kontoplan & veiledning
              </div>
              <h1 className="text-4xl md:text-5xl font-bold">Kontohjelp</h1>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Søk etter en utgift, en konto eller et begrep – vi viser deg hvor det hører hjemme i regnskapet.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-24 space-y-8">
        {/* Filters */}
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="flex gap-2 justify-center flex-wrap">
            {BUSINESS_TYPES.map(t => (
              <button
                key={t.value}
                onClick={() => setBusinessType(t.value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  businessType === t.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Søk etter konto, utgift eller begrep..."
              className="w-full h-12 pl-11 pr-4 rounded-2xl border border-border/30 bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <p className="text-center text-xs text-muted-foreground">
            {filtered.length} kontoer funnet for {BUSINESS_TYPES.find(t => t.value === businessType)?.label}
          </p>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center text-muted-foreground text-sm py-12">Laster kontoplan…</div>
        ) : groups.length === 0 ? (
          <div className="text-center text-muted-foreground text-sm py-12">Ingen treff. Prøv et annet søkeord.</div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-8">
            {groups.map(([group, items]) => (
              <div key={group}>
                <h2 className="text-lg font-semibold mb-3 text-foreground/80">{group}</h2>
                <div className="space-y-2">
                  {items.map(item => (
                    <Link
                      key={item.id}
                      to={`/ressurser/kontohjelp/${item.slug}`}
                      className="glass rounded-2xl px-5 py-4 border border-border/20 flex items-center justify-between gap-4 hover:border-primary/30 transition-colors group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-1 rounded-lg shrink-0">
                          {item.account_number}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{item.name}</p>
                          {item.description && (
                            <p className="text-xs text-muted-foreground line-clamp-1">{item.description}</p>
                          )}
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-muted-foreground group-hover:text-primary shrink-0 transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default Kontohjelp;
