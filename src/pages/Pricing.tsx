import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

const plans = [
  {
    name: "Start",
    price: "9 900",
    period: "/mnd",
    desc: "For selskaper som starter digitaliseringen.",
    features: [
      "Automatisert bokføring",
      "Månedlig rapportering",
      "Skatteoversikt",
      "E-post support",
    ],
    cta: "Kom i gang",
    highlighted: false,
  },
  {
    name: "Grow",
    price: "24 900",
    period: "/mnd",
    desc: "For selskaper i vekstfasen.",
    features: [
      "Alt i Start",
      "AI-drevet likviditetsprediksjon",
      "Kvartalsvis skatteoptimalisering",
      "Dedikert rådgiver",
      "Sanntidsdashbord",
      "Prioritert support",
    ],
    cta: "Velg Grow",
    highlighted: false,
  },
  {
    name: "Avargo Elite",
    price: "59 900",
    period: "/mnd",
    desc: "Full styringsplattform for ambisiøse selskaper.",
    badge: "Anbefalt",
    features: [
      "Alt i Grow",
      "CFO-as-a-Service",
      "Prediktiv skattearkitektur",
      "Styrerom-rapportering",
      "M&A rådgivning",
      "Exit-planlegging",
      "Direktelinje 24/7",
      "Ubegrenset rådgivningstimer",
    ],
    roi: "Gjennomsnittlig ROI: 340%",
    cta: "Søk om Elite",
    highlighted: true,
  },
];

const Pricing = () => {
  return (
    <>
      <section className="py-28 md:py-36">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <div className="text-center max-w-2xl mx-auto mb-20">
              <p className="text-[11px] uppercase tracking-[0.3em] text-primary/80 mb-4">Priser</p>
              <h1 className="font-heading text-4xl md:text-5xl font-semibold mb-6 leading-snug">
                Invester i <span className="text-gradient-gold italic">kontroll</span>
              </h1>
              <p className="text-muted-foreground text-lg">
                Vi viser deg ikke hva det koster. Vi viser deg hva det gir tilbake.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-px bg-border/30 rounded-md overflow-hidden max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <AnimatedSection key={plan.name} delay={i * 0.12}>
                <div
                  className={`relative p-10 h-full flex flex-col ${
                    plan.highlighted
                      ? "bg-card"
                      : "bg-card"
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-0 right-8 px-3 py-1.5 bg-primary text-primary-foreground text-[10px] font-medium tracking-wider uppercase rounded-b-md">
                      {plan.badge}
                    </div>
                  )}
                  <h3 className="font-heading text-xl font-semibold mb-2">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mb-8">{plan.desc}</p>
                  <div className="mb-8">
                    <span className="font-heading text-4xl font-semibold">kr {plan.price}</span>
                    <span className="text-muted-foreground text-sm ml-1">{plan.period}</span>
                  </div>
                  {plan.roi && (
                    <div className="px-3 py-2 rounded-md bg-primary/8 border border-primary/15 text-primary text-[11px] font-medium mb-8 text-center tracking-wide">
                      {plan.roi}
                    </div>
                  )}
                  <ul className="flex flex-col gap-3 mb-10 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-foreground/75">
                        <Check size={14} className="text-primary mt-0.5 shrink-0" strokeWidth={2} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/kontakt"
                    className={`group w-full flex items-center justify-center gap-2 py-3.5 rounded-md text-sm font-medium tracking-wide transition-all ${
                      plan.highlighted
                        ? "bg-primary text-primary-foreground hover:opacity-90 glow-gold"
                        : "border border-border/60 text-foreground/80 hover:border-primary/40 hover:text-foreground"
                    }`}
                  >
                    {plan.cta}
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-28 border-t border-border/20">
        <div className="container mx-auto px-6 text-center">
          <AnimatedSection>
            <h2 className="font-heading text-2xl md:text-4xl font-semibold mb-16">Hvorfor ikke de andre?</h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-px bg-border/30 rounded-md overflow-hidden max-w-4xl mx-auto">
            {[
              { name: "Sanna", weakness: "For enkle — du vokser fra dem", avargo: "Arkitektene for din neste fase" },
              { name: "Aider", weakness: "For store — du blir et nummer", avargo: "Personlig og aggressivt vekstorientert" },
              { name: "Azets", weakness: "For trege — timefokusert", avargo: "Betal for resultater, ikke timer" },
            ].map((comp, i) => (
              <AnimatedSection key={comp.name} delay={i * 0.08}>
                <div className="p-8 bg-card">
                  <h3 className="font-heading text-lg font-semibold text-muted-foreground/60 mb-3">{comp.name}</h3>
                  <p className="text-sm text-destructive/80 mb-4">{comp.weakness}</p>
                  <div className="h-px bg-border/30 mb-4" />
                  <p className="text-sm text-primary font-medium">{comp.avargo}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Pricing;
