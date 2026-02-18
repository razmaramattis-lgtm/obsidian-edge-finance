import { Link } from "react-router-dom";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

const plans = [
  {
    name: "Start",
    price: "9 900",
    period: "/mnd",
    desc: "Et trygt første steg inn i fremtidens regnskap.",
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
    desc: "For selskaper som er klare til å akselerere.",
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
    name: "Elite",
    price: "59 900",
    period: "/mnd",
    desc: "Den komplette plattformen for visionære ledere.",
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
      <section className="py-32 md:py-40 relative">
        <div className="absolute inset-0 dreamy-bg opacity-40" />
        <div className="container mx-auto px-6 relative">
          <AnimatedSection>
            <div className="text-center max-w-2xl mx-auto mb-20">
              <p className="text-[11px] uppercase tracking-[0.3em] text-accent/70 mb-4">Priser</p>
              <h1 className="font-heading text-4xl md:text-5xl font-medium mb-6 leading-snug">
                En investering i{" "}
                <span className="text-gradient-gold italic">fremtiden din</span>
              </h1>
              <p className="text-muted-foreground text-lg">
                Vi viser deg ikke hva det koster. Vi viser deg hva det gir tilbake.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <AnimatedSection key={plan.name} delay={i * 0.15}>
                <div
                  className={`relative p-8 rounded-2xl border h-full flex flex-col card-hover ${
                    plan.highlighted
                      ? "bg-card/80 border-primary/30 glow-gold backdrop-blur-sm"
                      : "bg-card/50 border-border/30 backdrop-blur-sm"
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-3 left-8 flex items-center gap-1.5 px-4 py-1.5 bg-primary text-primary-foreground text-[10px] font-medium tracking-wider uppercase rounded-full">
                      <Sparkles size={10} />
                      {plan.badge}
                    </div>
                  )}
                  <h3 className="font-heading text-2xl font-medium mb-2">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mb-8">{plan.desc}</p>
                  <div className="mb-8">
                    <span className="font-heading text-4xl font-medium">kr {plan.price}</span>
                    <span className="text-muted-foreground text-sm ml-1">{plan.period}</span>
                  </div>
                  {plan.roi && (
                    <div className="px-4 py-2.5 rounded-xl bg-primary/8 border border-primary/15 text-primary text-[11px] font-medium mb-8 text-center tracking-wide">
                      ✦ {plan.roi}
                    </div>
                  )}
                  <ul className="flex flex-col gap-3 mb-10 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-foreground/70">
                        <Check size={14} className="text-primary mt-0.5 shrink-0" strokeWidth={2} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/kontakt"
                    className={`group w-full flex items-center justify-center gap-2 py-3.5 rounded-full text-sm font-medium tracking-wide transition-all duration-500 ${
                      plan.highlighted
                        ? "bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/20"
                        : "border border-border/40 text-foreground/70 hover:border-primary/30 hover:text-foreground"
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
      <section className="py-28 border-t border-border/15">
        <div className="container mx-auto px-6 text-center">
          <AnimatedSection>
            <h2 className="font-heading text-2xl md:text-4xl font-medium mb-16">
              Hvorfor velge <span className="italic text-gradient-gold">Avargo</span>?
            </h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { name: "Sanna", weakness: "Bra start — men du vokser fra dem", avargo: "Arkitektene for din neste fase" },
              { name: "Aider", weakness: "Store — du kan bli et nummer", avargo: "Personlig og dedikert til din vekst" },
              { name: "Azets", weakness: "Tradisjonelle — timefokusert", avargo: "Betal for resultater, ikke timer" },
            ].map((comp, i) => (
              <AnimatedSection key={comp.name} delay={i * 0.1}>
                <div className="p-8 bg-card/50 border border-border/30 rounded-2xl card-hover">
                  <h3 className="font-heading text-lg font-medium text-muted-foreground/50 mb-3">{comp.name}</h3>
                  <p className="text-sm text-foreground/40 mb-4">{comp.weakness}</p>
                  <div className="h-px bg-border/20 mb-4" />
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
