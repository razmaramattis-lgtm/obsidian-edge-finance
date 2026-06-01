import { motion } from "framer-motion";
import { Check, X, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const traditional = [
  { label: "Regnskapsfører", color: "hsl(var(--muted-foreground))" },
  { label: "HR-konsulent", color: "hsl(var(--muted-foreground))" },
  { label: "Markedsbyrå", color: "hsl(var(--muted-foreground))" },
  { label: "IT-leverandør", color: "hsl(var(--muted-foreground))" },
];

const rows: { label: string; traditional: string; avargo: string }[] = [
  { label: "Antall leverandører", traditional: "4 separate avtaler", avargo: "1 partner" },
  { label: "Kontaktpersoner", traditional: "4–8 personer", avargo: "Ett dedikert team" },
  { label: "Fakturering", traditional: "4 fakturaer, ulike syklus", avargo: "Én månedlig faktura" },
  { label: "Prising", traditional: "Timepris + tillegg", avargo: "Fast pris, alt inkludert" },
  { label: "Responstid", traditional: "2–5 dager", avargo: "Innen 24 timer" },
  { label: "Datasiloer", traditional: "Spredt på 4 systemer", avargo: "Samlet i én portal" },
  { label: "Koordinering", traditional: "Du gjør det selv", avargo: "Vi koordinerer internt" },
];

const ComparisonSection = () => {
  return (
    <section className="py-16 md:py-32 border-t border-border/10">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto text-center mb-10 md:mb-16"
        >
          <p className="text-[10px] md:text-xs tracking-[0.35em] uppercase text-primary/80 mb-4 font-medium">
            Sammenligning
          </p>
          <h2 className="text-2xl md:text-5xl font-bold leading-tight mb-3 md:mb-4">
            Fra fire byråer til <span className="text-gradient-rose">én partner</span>
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            Slutt med å jonglere mellom leverandører. Se hva som faktisk endrer seg når alt samles under ett tak.
          </p>
        </motion.div>

        {/* Visual: 4 → 1 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto mb-12 md:mb-16"
        >
          <div className="flex items-center justify-center gap-4 md:gap-8">
            {/* Four boxes */}
            <div className="grid grid-cols-2 gap-2 md:gap-3">
              {traditional.map((t) => (
                <div
                  key={t.label}
                  className="px-3 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl border border-border/15 bg-muted/5 text-[10px] md:text-xs text-muted-foreground text-center min-w-[100px] md:min-w-[140px]"
                >
                  {t.label}
                </div>
              ))}
            </div>

            <ArrowRight className="text-primary shrink-0" size={28} strokeWidth={1.5} />

            {/* One box */}
            <div className="relative">
              <div className="absolute -inset-2 bg-primary/20 blur-2xl rounded-2xl" />
              <div className="relative px-6 md:px-10 py-6 md:py-10 rounded-2xl border border-primary/30 bg-primary/5 text-center">
                <p className="text-[10px] md:text-xs tracking-[0.25em] uppercase text-primary mb-2">Avargo</p>
                <p className="text-lg md:text-2xl font-bold">Ett tak</p>
                <p className="text-[10px] md:text-xs text-muted-foreground mt-1">Ett team</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="max-w-4xl mx-auto rounded-2xl md:rounded-3xl border border-border/15 overflow-hidden"
        >
          {/* Header */}
          <div className="grid grid-cols-[1.2fr_1fr_1fr] md:grid-cols-3 bg-muted/10 border-b border-border/10">
            <div className="px-3 md:px-6 py-3 md:py-5 text-[10px] md:text-xs uppercase tracking-wider text-muted-foreground font-medium">
              &nbsp;
            </div>
            <div className="px-3 md:px-6 py-3 md:py-5 text-[10px] md:text-xs uppercase tracking-wider text-muted-foreground font-medium text-center border-l border-border/10">
              Tradisjonelt
            </div>
            <div className="px-3 md:px-6 py-3 md:py-5 text-[10px] md:text-xs uppercase tracking-wider text-primary font-semibold text-center border-l border-border/10">
              Avargo
            </div>
          </div>

          {rows.map((row, i) => (
            <div
              key={row.label}
              className={`grid grid-cols-[1.2fr_1fr_1fr] md:grid-cols-3 ${
                i % 2 === 0 ? "bg-transparent" : "bg-muted/5"
              } border-b border-border/5 last:border-b-0`}
            >
              <div className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium text-foreground/90">
                {row.label}
              </div>
              <div className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-muted-foreground text-center border-l border-border/10 flex items-center justify-center gap-2">
                <X size={14} className="text-muted-foreground/50 shrink-0" />
                <span>{row.traditional}</span>
              </div>
              <div className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-foreground text-center border-l border-border/10 flex items-center justify-center gap-2">
                <Check size={14} className="text-primary shrink-0" />
                <span>{row.avargo}</span>
              </div>
            </div>
          ))}
        </motion.div>

        <div className="text-center mt-10 md:mt-14">
          <Link
            to="/kontakt"
            className="inline-flex items-center gap-2 h-11 md:h-12 px-6 md:px-8 bg-primary text-primary-foreground rounded-xl md:rounded-2xl text-sm font-semibold glow-rose hover:scale-[1.02] transition-all duration-300"
          >
            Få et uforpliktende tilbud
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
