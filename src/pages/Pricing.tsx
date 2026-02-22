import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowRight, Check, MessageCircle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";
import { supabase } from "@/integrations/supabase/client";
import { Helmet } from "react-helmet-async";

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  price_suffix: string;
  description: string;
  features: string[];
  highlighted: boolean;
  active: boolean;
  sort_order: number;
}

const Pricing = () => {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      const { data } = await supabase
        .from("pricing_plans")
        .select("*")
        .eq("active", true)
        .order("sort_order");
      setPlans((data as PricingPlan[]) || []);
      setLoading(false);
    };
    fetchPlans();
  }, []);

  return (
    <>
      <Helmet>
        <title>Priser | Regnskap fra 1 499 kr/mnd — Avargo</title>
        <meta name="description" content="Fast pris, ingen overraskelser. Regnskapsfører, rådgivning og skatteoptimalisering — alt inkludert. Se våre pakker og kom i gang i dag." />
        <link rel="canonical" href="https://avargo.no/priser" />
      </Helmet>

      <section className="py-24 md:py-40 relative">
        <div className="absolute inset-0 ambient-glow opacity-40" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <AnimatedSection>
            <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
              <h1 className="font-heading text-4xl sm:text-5xl md:text-7xl mb-8 md:mb-10 leading-snug">
                Enkel pris.{" "}
                <span className="italic text-gradient-rose">Full kontroll.</span>
              </h1>
              <p className="text-foreground/70 font-light leading-relaxed max-w-lg mx-auto mb-5 md:mb-6 text-base md:text-lg">
                Hos Avargo betaler du én fast månedspris. Ingen tillegg for MVA-rapportering, lønnskjøring eller rådgivning. Alt er inkludert fra dag én.
              </p>
              <p className="text-sm text-primary italic font-light">
                Vi tror på forutsigbarhet — for deg og for oss.
              </p>
            </div>
          </AnimatedSection>

          {loading ? (
            <div className="text-center text-foreground/50 text-sm py-12">Laster prisplaner…</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 max-w-6xl mx-auto">
              {plans.map((plan, i) => (
                <AnimatedSection key={plan.id} delay={i * 0.15}>
                  <div
                    className={`relative p-8 md:p-10 rounded-3xl h-full flex flex-col card-lift ${
                      plan.highlighted
                        ? "glass glow-rose border-primary/25"
                        : "glass"
                    }`}
                  >
                    {plan.highlighted && (
                      <div className="absolute -top-3 left-8 md:left-10 px-4 py-1.5 bg-primary text-primary-foreground text-[10px] font-medium tracking-[0.2em] uppercase rounded-full">
                        Anbefalt
                      </div>
                    )}
                    <h3 className="font-heading text-2xl md:text-3xl mb-2">{plan.name}</h3>
                    <p className="text-sm text-foreground/60 font-light mb-6 md:mb-8">{plan.description}</p>
                    <div className="mb-6 md:mb-8">
                      <span className="text-sm text-foreground/50 font-light mr-1">Fra</span>
                      <span className="font-heading text-4xl md:text-5xl">{plan.price.toLocaleString("nb-NO")}</span>
                      <span className="text-foreground/50 text-sm"> kr{plan.price_suffix}</span>
                    </div>
                    <ul className="flex flex-col gap-3 mb-8 md:mb-10 flex-1">
                      {(plan.features || []).map((f) => (
                        <li key={f} className="flex items-start gap-3 text-sm text-foreground/70 font-light">
                          <Check size={14} className="text-secondary mt-0.5 shrink-0" strokeWidth={2} />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Link
                      to={`/kontakt?pakke=${encodeURIComponent(plan.name)}`}
                      className={`group w-full flex items-center justify-center gap-2 py-4 rounded-full text-sm font-medium tracking-wider transition-all duration-500 ${
                        plan.highlighted
                          ? "bg-primary text-primary-foreground hover:scale-[1.02] glow-rose"
                          : "border border-border/40 text-foreground/70 hover:border-primary/30 hover:text-foreground"
                      }`}
                    >
                      Få tilbud på {plan.name}
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          )}

          {/* Custom pricing CTA */}
          <AnimatedSection delay={0.5}>
            <div className="max-w-6xl mx-auto mt-16 md:mt-20">
              <motion.div
                className="relative overflow-hidden rounded-3xl glass border border-border/20"
                whileHover={{ scale: 1.005 }}
                transition={{ duration: 0.4 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="relative flex flex-col md:flex-row items-center gap-8 md:gap-12 p-8 md:p-12">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/15 to-secondary/15 border border-primary/20 flex items-center justify-center">
                      <Sparkles size={24} className="text-primary" strokeWidth={1.5} />
                    </div>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="font-heading text-2xl md:text-3xl mb-2">
                      Trenger du noe{" "}
                      <span className="italic text-gradient-rose">skreddersydd</span>?
                    </h3>
                    <p className="text-sm md:text-base text-foreground/60 font-light leading-relaxed max-w-lg">
                      Ikke alle selskaper passer inn i en ferdig pakke. Fortell oss om ditt behov, 
                      så setter vi sammen en løsning som passer deg — uten binding og med full transparens.
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <Link
                      to="/kontakt?pakke=Skreddersydd"
                      className="group inline-flex items-center gap-3 px-8 py-4 rounded-full border border-primary/30 text-foreground/80 hover:text-foreground hover:border-primary/60 hover:bg-primary/5 text-sm font-medium tracking-wider transition-all duration-500"
                    >
                      <MessageCircle size={15} className="text-primary" />
                      Ta kontakt
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-24 md:py-32 border-t border-border/15">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection>
            <div className="text-center max-w-2xl mx-auto mb-6">
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-5 md:mb-6">
                Hva skiller Avargo{" "}
                <span className="italic text-gradient-rose">fra resten</span>?
              </h2>
              <p className="text-foreground/60 font-light leading-relaxed max-w-lg mx-auto text-sm md:text-base">
                De fleste regnskapstilbydere gir deg enten en billig minimumsløsning eller en dyr helhetspakke. Vi gir deg alt du trenger — til en pris som gir mening.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto mt-12 md:mt-16">
            {[
              {
                name: "Billigalternativene",
                body: "Lav inngangsbillett og enkel bokføring. Men når selskapet vokser, kommer spørsmålene: Hvem følger opp? Hvem gir deg råd? Hvem tenker fremover?",
                us: "Hos Avargo er rådgivning, lønnskjøring og oppfølging inkludert — uansett pakke.",
                tag: "Helhet fra dag én.",
              },
              {
                name: "De store byråene",
                body: "Profesjonelle og etablerte. Men du blir én av mange kunder, og hvert spørsmål koster deg timepris.",
                us: "Hos oss betaler du fast pris og kan ringe regnskapsføreren din uten å tenke på timebudsjettet.",
                tag: "Relasjon foran ressursnummer.",
              },
              {
                name: "Gjør-det-selv-systemer",
                body: "Regnskapssystemer er gode verktøy, men de tar ikke ansvar. Du står alene med rapporter, frister og vurderinger.",
                us: "Med Avargo får du systemet, regnskapsføreren og strukturen — satt opp riktig og brukt riktig.",
                tag: "Teknologi med eierskap.",
              },
            ].map((comp, i) => (
              <AnimatedSection key={comp.name} delay={i * 0.1}>
                <div className="p-7 md:p-8 glass rounded-3xl card-lift text-left h-full flex flex-col">
                  <h3 className="font-heading text-xl md:text-2xl mb-4 md:mb-5">{comp.name}</h3>
                  <p className="text-sm text-foreground/55 font-light leading-relaxed mb-4 flex-1">{comp.body}</p>
                  <div className="h-px bg-border/20 my-4 md:my-5" />
                  <p className="text-sm text-foreground/80 font-light leading-relaxed mb-3">{comp.us}</p>
                  <p className="text-xs text-primary italic font-light">{comp.tag}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection delay={0.4}>
            <div className="max-w-xl mx-auto text-center mt-16 md:mt-20">
              <p className="text-foreground/60 font-light leading-relaxed mb-2 text-sm md:text-base">
                Å bytte regnskapsfører handler sjelden om pris.
                <br />Det handler om kontroll, tilgjengelighet og tillit.
              </p>
              <p className="text-foreground/50 italic font-light text-sm mb-8 md:mb-10">
                Når det først fungerer, blir du.
              </p>
              <Link
                to="/kontakt"
                className="group inline-flex items-center gap-3 px-8 md:px-10 py-4 bg-primary text-primary-foreground text-sm font-medium tracking-wider rounded-full glow-rose hover:scale-[1.02] transition-all duration-500"
              >
                Få et uforpliktende tilbud
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
