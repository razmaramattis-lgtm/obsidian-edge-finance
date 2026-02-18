import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

const plans = [
  {
    name: "Start",
    price: "9 900",
    period: "/mnd",
    desc: "Det første steget inn i en ny virkelighet.",
    features: [
      "Automatisert bokføring",
      "Månedlig rapportering",
      "Skatteoversikt",
      "E-post support",
    ],
    cta: "Velg Start",
    highlighted: false,
  },
  {
    name: "Grow",
    price: "24 900",
    period: "/mnd",
    desc: "For selskaper som har smaken på vekst.",
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
    desc: "Full kontroll. Total oversikt. Ingen kompromisser.",
    badge: "Anbefalt",
    features: [
      "Alt i Grow",
      "CFO-as-a-Service",
      "Prediktiv skattearkitektur",
      "Styrerom-rapportering",
      "M&A rådgivning",
      "Exit-planlegging",
      "Direktelinje 24/7",
      "Ubegrenset rådgivning",
    ],
    roi: "Gjennomsnittlig ROI: 340 %",
    cta: "Søk om Elite",
    highlighted: true,
  },
];

const Pricing = () => {
  return (
    <>
      <section className="py-36 md:py-44 relative">
        <div className="absolute inset-0 ambient-glow opacity-40" />
        <div className="container mx-auto px-6 relative">
          <AnimatedSection>
            <div className="text-center max-w-2xl mx-auto mb-24">
              <p className="text-xs tracking-[0.4em] uppercase text-secondary mb-6">Investering</p>
              <h1 className="font-heading text-5xl md:text-7xl mb-8 leading-snug">
                Hva er <span className="italic text-gradient-rose">kontroll</span> verdt?
              </h1>
              <p className="text-muted-foreground text-lg font-light">
                Vi viser deg ikke hva det koster. Vi viser deg hva det gir tilbake.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <AnimatedSection key={plan.name} delay={i * 0.15}>
                <div
                  className={`relative p-10 rounded-3xl h-full flex flex-col card-lift ${
                    plan.highlighted
                      ? "glass glow-rose border-primary/20"
                      : "glass"
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-3 left-10 px-4 py-1.5 bg-primary text-primary-foreground text-[10px] font-medium tracking-[0.2em] uppercase rounded-full">
                      {plan.badge}
                    </div>
                  )}
                  <h3 className="font-heading text-3xl mb-2">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground font-light mb-8">{plan.desc}</p>
                  <div className="mb-8">
                    <span className="font-heading text-5xl">{plan.price}</span>
                    <span className="text-muted-foreground text-sm ml-2">kr{plan.period}</span>
                  </div>
                  {plan.roi && (
                    <div className="px-4 py-2.5 rounded-2xl bg-primary/8 border border-primary/15 text-primary text-xs font-medium mb-8 text-center tracking-wider">
                      {plan.roi}
                    </div>
                  )}
                  <ul className="flex flex-col gap-3.5 mb-10 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm text-foreground/60 font-light">
                        <Check size={14} className="text-secondary mt-0.5 shrink-0" strokeWidth={2} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/kontakt"
                    className={`group w-full flex items-center justify-center gap-2 py-4 rounded-full text-sm font-medium tracking-wider transition-all duration-500 ${
                      plan.highlighted
                        ? "bg-primary text-primary-foreground hover:scale-[1.02] glow-rose"
                        : "border border-border/30 text-foreground/60 hover:border-primary/30 hover:text-foreground"
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

      <section className="py-32 border-t border-border/10">
        <div className="container mx-auto px-6 text-center">
          <AnimatedSection>
            <h2 className="font-heading text-3xl md:text-5xl mb-16">
              Hvorfor <span className="italic text-gradient-rose">de bytter</span> til oss
            </h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { name: "Sanna", them: "Fint for starten — du vokser forbi", us: "Arkitektene for neste fase" },
              { name: "Aider", them: "Du blir et nummer i systemet", us: "Personlig og dedikert" },
              { name: "Azets", them: "Tradisjonelt og timefokusert", us: "Resultater, ikke timer" },
            ].map((comp, i) => (
              <AnimatedSection key={comp.name} delay={i * 0.1}>
                <div className="p-8 glass rounded-3xl card-lift text-left">
                  <h3 className="font-heading text-xl text-muted-foreground/40 mb-4">{comp.name}</h3>
                  <p className="text-sm text-foreground/30 font-light mb-5">{comp.them}</p>
                  <div className="h-px bg-border/15 mb-5" />
                  <p className="text-sm text-primary font-medium">{comp.us}</p>
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
