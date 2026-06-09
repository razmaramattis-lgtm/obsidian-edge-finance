import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Helmet } from "react-helmet-async";

const faqs = [
  {
    q: "Hva koster det å bruke Avargo?",
    a: "Vi har faste månedspriser fra 1 499 kr for regnskap, og egne pakker for HR, markedsføring og IT. Alt er inkludert i prisen — ingen timefakturering eller skjulte tillegg. Kombinerer du flere avdelinger får du bedre totalpris.",
  },
  {
    q: "Må jeg binde meg?",
    a: "Nei. Vi har ingen lange bindingstider. Du kan oppgradere, nedgradere eller avslutte med én måneds varsel. Vi tror på å beholde deg gjennom kvalitet — ikke kontrakter.",
  },
  {
    q: "Hvor raskt svarer dere?",
    a: "Vi garanterer svar innen 24 timer på alle henvendelser — i praksis er det ofte raskere. Du får en dedikert kontaktperson som kjenner bedriften din.",
  },
  {
    q: "Kan jeg bare bruke én avdeling?",
    a: "Ja. Du velger fritt hvilke avdelinger du trenger — regnskap, HR, markedsføring eller IT. Mange starter med én og legger til flere etter hvert som behovet vokser.",
  },
  {
    q: "Hvordan bytter jeg fra dagens leverandør?",
    a: "Vi tar hele jobben. Vi henter ut data, koordinerer med din nåværende leverandør og setter opp alt — uten avbrudd i driften. Du trenger ikke gjøre noe.",
  },
  {
    q: "Hvilke selskaper passer for Avargo?",
    a: "Vi jobber primært med små og mellomstore bedrifter i Norge — fra nyetablerte AS til selskaper i sterk vekst. Vi tar ikke kunder innen sport og fritid.",
  },
];

const HubFAQ = () => {
  return (
    <section className="py-16 md:py-32 border-t border-border/10">
      <Helmet>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faqs.map(f => ({
            "@type": "Question",
            "name": f.q,
            "acceptedAnswer": { "@type": "Answer", "text": f.a }
          }))
        })}</script>
      </Helmet>

      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-[1fr_1.5fr] gap-10 md:gap-16 max-w-6xl mx-auto items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:sticky md:top-28"
          >
            <p className="text-[10px] md:text-xs tracking-[0.35em] uppercase text-primary/80 mb-4">
              Vanlige spørsmål
            </p>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4 md:mb-6">
              Det folk lurer på <span className="text-gradient-rose">før de bytter</span>
            </h2>
            <p className="text-sm md:text-base text-muted-foreground mb-6 leading-relaxed">
              Får du ikke svar her? Ta en uforpliktende prat — vi svarer ærlig, også på det vanskelige.
            </p>
            <Link
              to="/faq"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all"
            >
              Se alle 120+ spørsmål <ArrowRight size={14} />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`item-${i}`}
                  className="border border-border/10 rounded-2xl px-5 md:px-6 bg-muted/5 hover:bg-muted/10 transition-colors"
                >
                  <AccordionTrigger className="text-sm md:text-base font-semibold text-left hover:no-underline py-5">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HubFAQ;
