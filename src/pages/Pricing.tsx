import { Link } from "react-router-dom";
import { ArrowRight, Check, Star } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

const plans = [
  {
    name: "Basic",
    price: "9 900",
    period: "/mnd",
    desc: "For selskaper som starter digitaliseringen",
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
    name: "Growth",
    price: "24 900",
    period: "/mnd",
    desc: "For selskaper i vekstfasen",
    features: [
      "Alt i Basic",
      "AI-drevet likviditetsprediksjon",
      "Kvartalsvis skatteoptimalisering",
      "Dedikert rådgiver",
      "Sanntidsdashbord",
      "Prioritert support",
    ],
    cta: "Velg Growth",
    highlighted: false,
  },
  {
    name: "Avargo Elite",
    price: "59 900",
    period: "/mnd",
    desc: "Full styringsplattform for ambisiøse selskaper",
    badge: "Mest populær",
    features: [
      "Alt i Growth",
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
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <div className="text-center max-w-3xl mx-auto mb-20">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-4 block">Priser</span>
              <h1 className="font-heading text-4xl md:text-6xl font-bold mb-6">
                Invester i <span className="text-gradient-gold">kontroll</span>
              </h1>
              <p className="text-muted-foreground text-lg">
                Vi viser deg ikke hva det koster. Vi viser deg hva det gir tilbake.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {plans.map((plan, i) => (
              <AnimatedSection key={plan.name} delay={i * 0.15}>
                <div
                  className={`relative p-8 rounded border h-full flex flex-col ${
                    plan.highlighted
                      ? "bg-card border-primary/50 glow-gold"
                      : "bg-card border-border/50"
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-3 left-8 flex items-center gap-1 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded">
                      <Star size={12} />
                      {plan.badge}
                    </div>
                  )}
                  <h3 className="font-heading text-lg font-semibold mb-2">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mb-6">{plan.desc}</p>
                  <div className="mb-6">
                    <span className="font-heading text-4xl font-bold">kr {plan.price}</span>
                    <span className="text-muted-foreground text-sm">{plan.period}</span>
                  </div>
                  {plan.roi && (
                    <div className="px-3 py-2 rounded bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-6 text-center">
                      {plan.roi}
                    </div>
                  )}
                  <ul className="flex flex-col gap-3 mb-8 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-foreground/80">
                        <Check size={16} className="text-primary mt-0.5 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/kontakt"
                    className={`group w-full flex items-center justify-center gap-2 py-3 rounded text-sm font-semibold uppercase tracking-wider transition-all ${
                      plan.highlighted
                        ? "bg-primary text-primary-foreground hover:opacity-90"
                        : "border border-border text-foreground hover:border-primary/50"
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
      <section className="py-24 border-t border-border/50">
        <div className="container mx-auto px-6 text-center">
          <AnimatedSection>
            <h2 className="font-heading text-2xl md:text-4xl font-bold mb-12">Hvorfor ikke de andre?</h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { name: "Sanna", weakness: "For enkle", avargo: "For de som vil opp og frem" },
              { name: "Aider", weakness: "For corporate", avargo: "Personlig og aggressivt vekstorientert" },
              { name: "Azets", weakness: "For trege", avargo: "Sanntid og tech-native" },
            ].map((comp, i) => (
              <AnimatedSection key={comp.name} delay={i * 0.1}>
                <div className="p-6 bg-card border border-border/50 rounded">
                  <h3 className="font-heading font-semibold text-muted-foreground mb-2">{comp.name}</h3>
                  <p className="text-sm text-destructive mb-3">{comp.weakness}</p>
                  <div className="h-px bg-border/50 mb-3" />
                  <p className="text-sm text-primary font-medium">Avargo: {comp.avargo}</p>
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
