import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

const plans = [
  {
    name: "Basis",
    price: "4 500",
    period: " kr/mnd",
    desc: "For selskaper som vil ha kontroll og struktur fra dag én.",
    features: [
      "Løpende bokføring og bankavstemming",
      "MVA-rapportering",
      "Årsregnskap og skattemelding",
      "Aksjonærregisteroppgave",
      "Lønn for inntil 5 ansatte",
      "Månedlig standard rapportpakke",
      "Rådgivning",
      "Regnskapsystemkostnad inkludert",
    ],
    cta: "Velg Basis",
    highlighted: false,
  },
  {
    name: "Vekst",
    price: "6 000",
    period: " kr/mnd",
    desc: "For selskaper i vekst som trenger en strategisk partner.",
    inherits: "Alt i Basis, pluss:",
    features: [
      "Lønn for opptil 10 ansatte",
      "Kvartalsvis gjennomgang",
      "Likviditetsoversikt og prognose",
      "Skatteoptimalisering og strukturvurdering",
      "Gratis oppsett av integrasjonsløsninger",
      "SEO-støtte for din bedrift",
      "Hjelp med styreromsrapportering",
      "Kontrakter og HR-støtte",
      "Prioritert rådgivning",
      "Integrasjoner mot bank og fakturasystem",
    ],
    cta: "Velg Vekst",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "8 000",
    period: " kr/mnd",
    desc: "For selskaper som vil ha total oversikt. Din finansielle partner.",
    badge: "Anbefalt",
    inherits: "Alt i Vekst, pluss:",
    features: [
      "Månedlig rapportering",
      "Budsjett",
      "CFO-løsning",
      "Oppsett av nettside",
      "SOME-annonsering",
      "Integrasjon av e-postsystem mot SOME og andre kanaler",
    ],
    cta: "Velg Pro",
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
            <div className="text-center max-w-2xl mx-auto mb-20">
              <h1 className="font-heading text-5xl md:text-7xl mb-10 leading-snug">
                Hva er manglende <span className="italic text-gradient-rose">kontroll</span> egentlig verdt?
              </h1>
              <p className="text-muted-foreground font-light leading-relaxed max-w-lg mx-auto mb-6">
                Skattesmeller. Feil rapportering. Timer brukt på oppgaver som aldri burde vært dine. Det er ikke regningen som tar deg — det er det du ikke ser.
              </p>
              <p className="text-sm text-primary/70 italic font-light">
                Spørsmålet er ikke hva det koster — men om du har råd til å drive uten kontroll.
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
                    <span className="text-sm text-muted-foreground font-light mr-1">Fra</span>
                    <span className="font-heading text-5xl">{plan.price}</span>
                    <span className="text-muted-foreground text-sm">{plan.period}</span>
                  </div>
                  {('inherits' in plan && plan.inherits) && (
                    <p className="text-xs text-primary/80 font-medium tracking-wide mb-4">{plan.inherits}</p>
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
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <div className="text-center max-w-2xl mx-auto mb-6">
              <h2 className="font-heading text-3xl md:text-5xl mb-6">
                Hvorfor klientene våre{" "}
                <span className="italic text-gradient-rose">ikke går tilbake</span>
              </h2>
              <p className="text-muted-foreground font-light leading-relaxed max-w-lg mx-auto">
                Når struktur først sitter, rådgivningen er tilgjengelig og tallene faktisk brukes — da føles det rart å gå tilbake til noe mindre.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-16">
            {[
              {
                name: "Billigalternativene",
                body: "Lav inngangsbillett. Begrenset leveranse. Passer når selskapet er lite og behovet er enkelt.\n\nMen etter hvert kommer spørsmålene: Hvem følger opp? Hvem utfordrer tallene? Hvem tenker fremover?",
                us: "Ikke bare minimumskravene. Struktur, rådgivning og utvikling i samme leveranse.",
                tag: "Ikke bare regnskap. Helhet.",
              },
              {
                name: "De store byråene",
                body: "Profesjonelle. Etablerte. Effektive.\n\nMen du blir én av mange. Timefakturering gjør at hvert spørsmål føles som en kostnad.",
                us: "Fast pris. Rådgivning inkludert. Du løfter telefonen uten å tenke på timebudsjettet.",
                tag: "Relasjon før ressursnummer.",
              },
              {
                name: "Regnskapssystemer",
                body: "Teknologi er kraftfullt. Men systemer tar ikke ansvar.\n\nNår du står alene med rapporter, frister og vurderinger, bærer du risikoen selv.",
                us: "Systemet. Regnskapsføreren. Strukturen. Alt satt opp riktig — og brukt riktig.",
                tag: "Teknologi med eierskap.",
              },
            ].map((comp, i) => (
              <AnimatedSection key={comp.name} delay={i * 0.1}>
                <div className="p-8 glass rounded-3xl card-lift text-left h-full flex flex-col">
                  <h3 className="font-heading text-2xl mb-5">{comp.name}</h3>
                  <div className="flex-1">
                    {comp.body.split("\n\n").map((para, j) => (
                      <p key={j} className="text-sm text-foreground/35 font-light leading-relaxed mb-3">{para}</p>
                    ))}
                  </div>
                  <div className="h-px bg-border/15 my-5" />
                  <p className="text-sm text-foreground/70 font-light leading-relaxed mb-3">{comp.us}</p>
                  <p className="text-xs text-primary/70 italic font-light">{comp.tag}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Closing */}
          <AnimatedSection delay={0.4}>
            <div className="max-w-xl mx-auto text-center mt-20">
              <p className="text-muted-foreground font-light leading-relaxed mb-2">
                Å bytte regnskapsfører handler sjelden om pris.
                <br />Det handler om kontroll, tilgjengelighet og tillit.
              </p>
              <p className="text-foreground/50 italic font-light text-sm mb-10">
                Når det først fungerer, blir du.
              </p>
              <Link
                to="/kontakt"
                className="group inline-flex items-center gap-3 px-10 py-4 bg-primary text-primary-foreground text-sm font-medium tracking-wider rounded-full glow-rose hover:scale-[1.02] transition-all duration-500"
              >
                Book en gjennomgang
                <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
};

export default Pricing;
