import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, BookOpen } from "lucide-react";

interface AccountEntry {
  id: string;
  account_number: string;
  name: string;
  slug: string;
  description: string | null;
  examples: string | null;
  category_group: string | null;
  business_types: string[];
}

const KontohjelpDetalj = () => {
  const { slug } = useParams<{ slug: string }>();
  const [entry, setEntry] = useState<AccountEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!slug) return;
      const { data } = await supabase
        .from("account_entries")
        .select("*")
        .eq("slug", slug)
        .eq("active", true)
        .maybeSingle();
      setEntry(data as AccountEntry | null);
      setLoading(false);
    };
    load();
  }, [slug]);

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
        <div className="container mx-auto px-4 max-w-3xl">
          <Link to="/ressurser/kontohjelp" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
            <ArrowLeft size={16} /> Tilbake til kontohjelp
          </Link>

          <div className="glass rounded-3xl border border-border/20 p-8 md:p-12 space-y-6">
            <div className="flex items-start gap-4">
              <span className="text-lg font-mono bg-primary/10 text-primary px-3 py-1.5 rounded-xl shrink-0">
                {entry.account_number}
              </span>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">{entry.name}</h1>
                {entry.category_group && (
                  <p className="text-sm text-muted-foreground mt-1">{entry.category_group}</p>
                )}
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              {entry.business_types?.map(t => (
                <span key={t} className="px-2 py-0.5 rounded-full bg-muted text-xs text-muted-foreground">
                  {t === "AS" ? "AS / NUF" : t === "ENK" ? "Enkeltpersonforetak" : t}
                </span>
              ))}
            </div>

            {entry.description && (
              <div className="space-y-2">
                <h2 className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
                  <BookOpen size={14} /> Slik bruker du denne kontoen
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {entry.description}
                </p>
              </div>
            )}

            {entry.examples && (
              <div className="space-y-2">
                <h2 className="text-sm font-semibold text-foreground/80">Eksempler</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {entry.examples}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default KontohjelpDetalj;
