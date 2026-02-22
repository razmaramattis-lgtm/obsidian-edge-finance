import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, BookOpen, Tag, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";

interface AccountEntry {
  id: string;
  account_number: string;
  name: string;
  slug: string;
  description: string | null;
  examples: string | null;
  category_group: string | null;
  tags: string[];
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
          <Link to="/ressurser/kontohjelp" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Tilbake til kontohjelp
          </Link>

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
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex gap-2 flex-wrap"
                >
                  <Tag size={14} className="text-muted-foreground/50 mt-0.5" />
                  {entry.tags.map(t => (
                    <span key={t} className="px-2.5 py-1 rounded-lg bg-muted/50 text-xs text-muted-foreground border border-border/10">
                      {t}
                    </span>
                  ))}
                </motion.div>
              )}

              {/* Description */}
              {entry.description && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-3"
                >
                  <h2 className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
                    <BookOpen size={15} className="text-primary" /> Slik bruker du denne kontoen
                  </h2>
                  <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line pl-6 border-l-2 border-primary/20">
                    {entry.description}
                  </div>
                </motion.div>
              )}

              {/* Examples */}
              {entry.examples && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-3"
                >
                  <h2 className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
                    <Lightbulb size={15} className="text-primary" /> Eksempler
                  </h2>
                  <div className="bg-muted/30 rounded-2xl p-5 border border-border/10">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {entry.examples}
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default KontohjelpDetalj;
