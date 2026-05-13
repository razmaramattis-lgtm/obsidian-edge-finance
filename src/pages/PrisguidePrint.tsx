import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { Printer, Check } from "lucide-react";

interface Plan {
  id: string;
  name: string;
  price: number;
  price_suffix: string;
  description: string;
  features: string[];
  highlighted: boolean;
  section: string | null;
}

const sections = [
  { id: "regnskap", label: "Regnskap & økonomi" },
  { id: "hr", label: "Personal & HR" },
  { id: "marked", label: "Marked & vekst" },
  { id: "it", label: "IT & utvikling" },
];

const PrisguidePrint = () => {
  const [plans, setPlans] = useState<Plan[]>([]);

  useEffect(() => {
    supabase.from("pricing_plans").select("*").eq("active", true).order("sort_order").then(({ data }) => {
      setPlans((data as Plan[]) || []);
    });
  }, []);

  return (
    <>
      <Helmet>
        <title>Avargo Prisguide 2026</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="min-h-screen bg-white text-black p-8 md:p-12 print:p-0">
        <style>{`@media print { @page { margin: 1.5cm; } .no-print { display: none !important; } }`}</style>

        <div className="max-w-4xl mx-auto">
          <header className="mb-10 pb-6 border-b border-black/10">
            <p className="text-xs uppercase tracking-[0.3em] text-black/50">Avargo · Prisguide 2026</p>
            <h1 className="text-4xl md:text-5xl mt-3 font-light" style={{ fontFamily: "Cormorant Garamond, serif" }}>
              Komplett prisoversikt
            </h1>
            <p className="text-sm text-black/60 mt-2 max-w-xl">
              Fast pris. Ingen skjulte tillegg. Alle pakker inkluderer dedikert rådgiver, ubegrenset support og full digital flyt.
            </p>
            <button
              onClick={() => window.print()}
              className="no-print mt-4 inline-flex items-center gap-2 px-4 py-2 bg-black text-white text-xs rounded-full"
            >
              <Printer size={12} /> Skriv ut / lagre som PDF
            </button>
          </header>

          {sections.map((sec) => {
            const sectionPlans = plans.filter((p) => p.section === sec.id);
            if (!sectionPlans.length) return null;
            return (
              <section key={sec.id} className="mb-10 break-inside-avoid">
                <h2 className="text-2xl mb-4 font-light border-b border-black/10 pb-2" style={{ fontFamily: "Cormorant Garamond, serif" }}>
                  {sec.label}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sectionPlans.map((p) => (
                    <div key={p.id} className={`border rounded-2xl p-5 ${p.highlighted ? "border-black bg-black/5" : "border-black/15"}`}>
                      <div className="flex items-baseline justify-between mb-1">
                        <h3 className="text-lg font-medium">{p.name}</h3>
                        {p.highlighted && <span className="text-[9px] uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded-full">Anbefalt</span>}
                      </div>
                      <p className="text-xs text-black/60 mb-3">{p.description}</p>
                      <p className="mb-3"><span className="text-xs text-black/50">Fra </span><span className="text-2xl font-medium">{p.price.toLocaleString("nb-NO")}</span><span className="text-xs text-black/50"> kr{p.price_suffix}</span></p>
                      <ul className="space-y-1.5">
                        {(p.features || []).slice(0, 8).map((f) => (
                          <li key={f} className="flex items-start gap-2 text-xs text-black/75">
                            <Check size={11} className="mt-0.5 shrink-0" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}

          <footer className="mt-12 pt-6 border-t border-black/10 text-xs text-black/50">
            <p><strong className="text-black/70">Avargo</strong> · Oscars gate 2B, 3714 Skien · kontakt@avargo.no · avargo.no</p>
            <p className="mt-1">Prisguide oppdatert {new Date().toLocaleDateString("nb-NO")}. Forbehold om endringer.</p>
          </footer>
        </div>
      </div>
    </>
  );
};

export default PrisguidePrint;
