import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Helmet } from "react-helmet-async";
import { useLang } from "@/contexts/LanguageContext";

const HubFAQ = () => {
  const { t } = useLang();
  const faqs = [
    { q: t("faq.q1"), a: t("faq.a1") },
    { q: t("faq.q2"), a: t("faq.a2") },
    { q: t("faq.q3"), a: t("faq.a3") },
    { q: t("faq.q4"), a: t("faq.a4") },
    { q: t("faq.q5"), a: t("faq.a5") },
    { q: t("faq.q6"), a: t("faq.a6") },
  ];

  return (
    <section className="py-16 md:py-32 border-t border-border/10 bg-background">
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
              {t("faq.eyebrow")}
            </p>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4 md:mb-6">
              {t("faq.title.a")} <span className="text-gradient-rose">{t("faq.title.b")}</span>
            </h2>
            <p className="text-sm md:text-base text-muted-foreground mb-6 leading-relaxed">
              {t("faq.body")}
            </p>
            <Link
              to="/faq"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all"
            >
              {t("faq.link")} <ArrowRight size={14} />
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
                  className="border border-primary/15 rounded-xl px-5 md:px-6 bg-card shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
                >
                  <AccordionTrigger className="text-sm md:text-base font-semibold text-foreground text-left hover:no-underline py-5">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-foreground/75 leading-relaxed pb-5">
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
