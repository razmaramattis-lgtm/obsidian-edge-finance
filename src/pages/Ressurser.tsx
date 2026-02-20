import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, FileText, BookMarked, Newspaper } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

const categories = [
  {
    icon: FileText,
    label: "Blogg",
    desc: "Artikler om regnskap, skatt og økonomi skrevet av våre eksperter.",
    tag: "Kommer snart",
  },
  {
    icon: BookMarked,
    label: "Guider",
    desc: "Praktiske guider for bedriftseiere — fra skatteoptimalisering til holdingstruktur.",
    tag: "Kommer snart",
  },
  {
    icon: Newspaper,
    label: "Nyheter",
    desc: "Siste nytt om regelverksendringer, Avargo-nyheter og bransjeoppdateringer.",
    tag: "Kommer snart",
  },
];

const Ressurser = () => (
  <>
    <section className="py-28 md:py-44 relative overflow-hidden">
      <div className="absolute inset-0 ambient-glow opacity-30" />
      <div className="container mx-auto px-4 md:px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl"
        >
          <p className="text-[10px] tracking-[0.45em] uppercase text-secondary mb-5 md:mb-6">Avargo · Ressurser</p>
          <h1 className="font-heading text-5xl sm:text-6xl md:text-8xl leading-[1.02] mb-8 md:mb-10">
            Kunnskap som{" "}
            <span className="italic text-gradient-rose">gir deg et fortrinn.</span>
          </h1>
          <p className="text-base md:text-xl text-muted-foreground font-light leading-relaxed max-w-2xl mb-10 md:mb-14">
            Guider, artikler og nyheter om regnskap, skatt og økonomi — skrevet av folk som jobber med det hver dag.
          </p>
          <Link
            to="/kontakt"
            className="group inline-flex items-center gap-3 px-8 md:px-10 py-4 bg-primary text-primary-foreground text-sm font-medium tracking-wider rounded-full glow-rose hover:scale-[1.02] transition-all duration-500"
          >
            Snakk med oss direkte
            <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
          </Link>
        </motion.div>
      </div>
    </section>

    <div className="container mx-auto px-4 md:px-6"><div className="line-accent" /></div>

    <section className="py-24 md:py-40">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {categories.map((cat, i) => (
            <AnimatedSection key={cat.label} delay={i * 0.1}>
              <div className="p-8 md:p-10 glass rounded-3xl card-lift h-full relative">
                <div className="w-11 h-11 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                  <cat.icon size={18} className="text-primary" strokeWidth={1.5} />
                </div>
                <span className="inline-block text-[9px] tracking-[0.3em] uppercase text-secondary border border-secondary/20 rounded-full px-3 py-1 mb-4">{cat.tag}</span>
                <h3 className="font-heading text-2xl md:text-3xl mb-3">{cat.label}</h3>
                <p className="text-sm text-muted-foreground font-light leading-relaxed">{cat.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.4}>
          <div className="mt-10 md:mt-16 p-8 md:p-12 glass rounded-3xl text-center">
            <p className="font-heading text-2xl md:text-3xl mb-4">Vil du lære mer nå?</p>
            <p className="text-muted-foreground font-light text-sm md:text-base mb-8 max-w-lg mx-auto">
              Innholdet er under utvikling. I mellomtiden er det raskeste å få svar å ta kontakt direkte med en av våre eksperter.
            </p>
            <Link
              to="/kontakt"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground text-sm font-medium tracking-wider rounded-full glow-rose hover:scale-[1.02] transition-all duration-500"
            >
              Book en gratis samtale
              <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  </>
);

export default Ressurser;
