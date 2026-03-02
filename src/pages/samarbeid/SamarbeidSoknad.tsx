import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Sparkles, CheckCircle2, Shield, Clock, Users } from "lucide-react";
import KartleggingDialog from "@/components/samarbeid/KartleggingDialog";

const SamarbeidSoknad = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  // Auto-open dialog on mount
  useEffect(() => {
    const timer = setTimeout(() => setDialogOpen(true), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Helmet>
        <title>Kartlegging | Avargo Samarbeid</title>
        <meta name="description" content="Start en uforpliktende kartlegging for samarbeid med Avargo. Det tar bare noen minutter." />
      </Helmet>

      <section className="relative py-20 md:py-28 overflow-hidden min-h-[80vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-medium mb-6">
              <Shield size={13} /> Konfidensielt & uforpliktende
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-5 leading-tight">
              Start din<br /><span className="text-primary">kartlegging</span>
            </h1>
            <p className="text-muted-foreground md:text-lg leading-relaxed max-w-md mx-auto mb-10">
              En rask og uforpliktende prosess som tar under 3 minutter. Vi tar kontakt for en konfidensiell samtale.
            </p>

            <button
              onClick={() => setDialogOpen(true)}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity shadow-xl shadow-primary/25 mb-12"
            >
              <Sparkles size={16} /> Start kartlegging
            </button>

            <div className="grid sm:grid-cols-3 gap-4 text-left max-w-lg mx-auto">
              {[
                { icon: Shield, title: "100 % konfidensielt", desc: "Ingen informasjon deles videre uten avtale." },
                { icon: Clock, title: "Under 3 minutter", desc: "Rask prosess med enkle spørsmål." },
                { icon: Users, title: "Svar innen 48 timer", desc: "Vi tar kontakt for en uforpliktende samtale." },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 rounded-xl border border-border/30 bg-muted/10 p-4">
                  <item.icon size={16} className="text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm mb-0.5">{item.title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <KartleggingDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
};

export default SamarbeidSoknad;
