import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

const plans = [
  {
    name: "Start",
    price: "9 900",
    period: "/mnd",
    desc: "Alt Sanna tilbyr — pluss mva, lønn og AI-innsikt. Fra dag én.",
    features: [
      "Dedikert autorisert regnskapsfører",
      "AI-drevet bokføring og kontroll",
      "Årsregnskap, skattemelding og aksjonærregisteroppgave",
      "Mva-rapportering inkludert",
      "90+ bankintegrasjoner",
      "E-post & chat support",
    ],
    cta: "Velg Start",
    highlighted: false,
    compare: "Sanna: 3 990 kr/år — men uten mva, lønn og AI",
  },
  {
    name: "Grow",
    price: "24 900",
    period: "/mnd",
    desc: "For selskaper som har smaken på vekst og trenger en strategisk partner.",
    features: [
      "Alt i Start",
      "AI-drevet likviditetsprediksjon",
      "Kvartalsvis skatteoptimalisering",
      "Full lønnskjøring og HR-admin",
      "Sanntidsdashbord med AI-varsler",
      "Dedikert bransjerådgiver",
      "Revisjonstøtte inkludert",
      "Prioritert support",
    ],
    cta: "Velg Grow",
    highlighted: false,
  },
  {
    name: "Elite",
    price: "59 900",
    period: "/mnd",
    desc: "Full kontroll. Total oversikt. Ditt finansielle A-team — alltid tilgjengelig.",
    badge: "Anbefalt",
    features: [
      "Alt i Grow",
      "CFO-as-a-Service",
      "Prediktiv skattearkitektur",
      "Styrerom-rapportering",
      "M&A rådgivning",
      "Exit-planlegging",
      "Kryptovaluta-regnskap",
      "Direktelinje 24/7 til ditt team",
      "Ubegrenset rådgivningstimer",
    ],
    roi: "Gjennomsnittlig ROI: 340 %",
    cta: "Søk om Elite",
    highlighted: true,
  },
];

const Pricing = () => {
  return (
    <>
      <section className="py-32 md:py-40 relative">
        <div className="absolute inset-0 ambient-glow opacity-40" />
        <div className="container mx-auto px-6 relative">
          <AnimatedSection>
            <div className="text-center max-w-2xl mx-auto mb-8">
              <p className="text-xs tracking-[0.4em] uppercase text-secondary mb-6">Investering</p>
              <h1 className="font-heading text-5xl md:text-7xl mb-8 leading-snug">
                Hva er <span className="italic text-gradient-rose">kontroll</span> verdt for deg?
              </h1>
              <p className="text-muted-foreground text-lg font-light mb-4">
                Vi viser deg ikke hva det koster. Vi viser deg hva du taper ved å la være.
              </p>
              <p className="text-sm text-primary/70 italic font-light">
                Gjennomsnittlig besparelse for nye klienter: 180 000 kr i første halvår.
              </p>
            </div>
          </AnimatedSection>

          {/* Comparison callout */}
          <AnimatedSection delay={0.2}>
            <div className="max-w-3xl mx-auto mb-20 p-6 glass rounded-3xl text-center">
              <p className="text-sm text-muted-foreground font-light leading-relaxed">
                <span className="text-foreground font-normal">Sanna</span> gir deg regnskapsfører til 3 990 kr/år — men mangler mva-rapportering, lønn, revisjonstøtte og AI. <span className="text-foreground font-normal">Fiken</span> og <span className="text-foreground font-normal">Tripletex</span> gir deg et system uten noen til å bruke det. <span className="text-primary font-medium">Avargo gir deg alt. Alltid.</span>
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
                  <div className="mb-6">
                    <span className="font-heading text-5xl">{plan.price}</span>
                    <span className="text-muted-foreground text-sm ml-2">kr{plan.period}</span>
                  </div>
                  {plan.compare && (
                    <p className="text-xs text-muted-foreground/50 italic mb-6 font-light">{plan.compare}</p>
                  )}
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
            <h2 className="font-heading text-3xl md:text-5xl mb-6">
              Hvorfor <span className="italic text-gradient-rose">klientene våre aldri går tilbake</span>
            </h2>
            <p className="text-muted-foreground font-light mb-16 max-w-lg mx-auto">
              De som bytter til Avargo blir. Her er hva de byttet fra — og hvorfor de aldri ser seg tilbake.
            </p>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { name: "Sanna", them: "Billig for holdingselskaper, men mangler mva, lønn og strategisk dybde. Perfekt start — men du vokser forbi.", us: "Alt Sanna tilbyr + alt de mangler" },
              { name: "Aider / Azets", them: "Store maskinerier der du er et kundenummer. Timefakturering som straffer deg for å stille spørsmål.", us: "Fast pris. Ubegrenset rådgivning." },
              { name: "Fiken / Tripletex", them: "Regnskapssystem uten regnskapsfører. Du gjør jobben selv — og risikerer feil som koster deg dyrt.", us: "System + regnskapsfører + AI. Alt inkludert." },
            ].map((comp, i) => (
              <AnimatedSection key={comp.name} delay={i * 0.1}>
                <div className="p-8 glass rounded-3xl card-lift text-left h-full">
                  <h3 className="font-heading text-xl text-muted-foreground/40 mb-4">{comp.name}</h3>
                  <p className="text-sm text-foreground/30 font-light mb-5 leading-relaxed">{comp.them}</p>
                  <div className="h-px bg-border/15 mb-5" />
                  <p className="text-sm text-primary font-medium leading-relaxed">{comp.us}</p>
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
