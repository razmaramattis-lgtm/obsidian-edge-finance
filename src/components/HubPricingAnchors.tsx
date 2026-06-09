import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Users, Megaphone, Code2, type LucideIcon } from "lucide-react";
import { SECTIONS, type SectionId } from "@/contexts/SectionContext";
import { sectionPricingPlans } from "@/config/sectionPricing";

const icons: Record<SectionId, LucideIcon> = {
  regnskap: BookOpen,
  hr: Users,
  markedsforing: Megaphone,
  it: Code2,
};

const HubPricingAnchors = () => {
  const items = (Object.keys(SECTIONS) as SectionId[]).map((id) => {
    const plans = sectionPricingPlans[id];
    const cheapest = plans.reduce((a, b) => (a.price < b.price ? a : b));
    return { id, section: SECTIONS[id], plan: cheapest };
  });

  return (
    <section className="py-16 md:py-32 border-t border-border/10">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10 md:mb-16 max-w-2xl mx-auto"
        >
          <p className="text-[10px] md:text-xs tracking-[0.35em] uppercase text-primary/80 mb-4">
            Fast pris · Ingen overraskelser
          </p>
          <h2 className="text-2xl md:text-5xl font-bold leading-tight mb-3 md:mb-4">
            Priser som <span className="text-gradient-rose">gir mening</span>
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            Velg én avdeling eller kombiner flere. Du betaler én månedspris — alt inkludert.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 max-w-6xl mx-auto">
          {items.map(({ id, section, plan }, i) => {
            const Icon = icons[id];
            const accentHsl = `hsl(${section.accent.h} ${section.accent.s}% ${section.accent.l}%)`;
            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
              >
                <Link
                  to={`${section.basePath}/priser`}
                  className="group block h-full p-6 md:p-7 rounded-2xl border border-border/10 hover:border-border/30 transition-all duration-500 relative overflow-hidden"
                >
                  <div
                    className="absolute -top-16 -right-16 w-40 h-40 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-700 blur-3xl"
                    style={{ backgroundColor: accentHsl }}
                  />
                  <div className="relative">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-5 border"
                      style={{
                        backgroundColor: `hsl(${section.accent.h} ${section.accent.s}% ${section.accent.l}% / 0.08)`,
                        borderColor: `hsl(${section.accent.h} ${section.accent.s}% ${section.accent.l}% / 0.2)`,
                      }}
                    >
                      <Icon size={16} style={{ color: accentHsl }} strokeWidth={1.5} />
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">{section.shortName}</p>
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground/70 mb-2">
                      Fra
                    </p>
                    <div className="flex items-baseline gap-1 mb-3">
                      <span className="text-2xl md:text-3xl font-bold">
                        {plan.price.toLocaleString("no-NO")}
                      </span>
                      <span className="text-xs text-muted-foreground">kr{plan.price_suffix}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-5 line-clamp-2">
                      {plan.description}
                    </p>
                    <span
                      className="inline-flex items-center gap-1.5 text-xs font-semibold group-hover:gap-2.5 transition-all duration-300"
                      style={{ color: accentHsl }}
                    >
                      Se pakker <ArrowRight size={12} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <p className="text-center text-xs text-muted-foreground/70 mt-8 md:mt-10 italic">
          Kombinerer du flere avdelinger får du én faktura, ett kontaktpunkt og bedre totalpris.
        </p>
      </div>
    </section>
  );
};

export default HubPricingAnchors;
