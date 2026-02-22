import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, BookMarked } from "lucide-react";

interface GlossaryTerm {
  id: string;
  term: string;
  slug: string;
  description: string | null;
}

const RegnskapsordDetalj = () => {
  const { slug } = useParams<{ slug: string }>();
  const [term, setTerm] = useState<GlossaryTerm | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!slug) return;
      const { data } = await supabase
        .from("glossary_terms")
        .select("*")
        .eq("slug", slug)
        .eq("active", true)
        .maybeSingle();
      setTerm(data as GlossaryTerm | null);
      setLoading(false);
    };
    load();
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground text-sm">Laster…</div>;
  if (!term) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-muted-foreground">Begrepet ble ikke funnet.</p>
      <Link to="/ressurser/regnskapsord" className="text-primary text-sm hover:underline">← Tilbake til regnskapsordbok</Link>
    </div>
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: term.term,
    description: term.description || `Forklaring av begrepet ${term.term} i regnskap og økonomi.`,
    url: `https://www.avargo.no/ressurser/regnskapsord/${term.slug}`,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      name: "Avargo Regnskapsordbok",
      url: "https://www.avargo.no/ressurser/regnskapsord",
    },
  };

  return (
    <>
      <Helmet>
        <title>{`${term.term} – Regnskapsordbok | Avargo`}</title>
        <meta name="description" content={term.description?.substring(0, 155) || `Hva betyr ${term.term}? Les en klar og enkel forklaring av begrepet.`} />
        <link rel="canonical" href={`https://www.avargo.no/ressurser/regnskapsord/${term.slug}`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <section className="pt-32 pb-24">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link to="/ressurser/regnskapsord" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
            <ArrowLeft size={16} /> Tilbake til regnskapsordbok
          </Link>

          <article className="glass rounded-3xl border border-border/20 p-8 md:p-12 space-y-6">
            <div className="flex items-center gap-3">
              <BookMarked size={20} className="text-primary shrink-0" />
              <h1 className="text-2xl md:text-3xl font-bold">{term.term}</h1>
            </div>

            {term.description && (
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{term.description}</p>
              </div>
            )}
          </article>
        </div>
      </section>
    </>
  );
};

export default RegnskapsordDetalj;
