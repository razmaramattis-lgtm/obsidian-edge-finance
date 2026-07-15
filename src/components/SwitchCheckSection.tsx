import { useState } from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight, Sparkles, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import SwitchCheckDialog from "./SwitchCheckDialog";
import switchCheckImageAsset from "@/assets/switch-check.png.asset.json";
const switchCheckImage = switchCheckImageAsset.url;

const benefits = [
  "Få en tydelig plan for overtagelse og ansvar",
  "Avklar behov for system, rapportering og rådgivning",
  "Sikre god flyt uten stopp i drift og frister",
];

const SwitchCheckSection = () => {
  const [open, setOpen] = useState(false);
  return (
    <section className="py-16 md:py-32 border-t border-border/10 bg-gradient-to-br from-background via-muted/25 to-background">
      <SwitchCheckDialog open={open} onOpenChange={setOpen} />
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block text-[10px] md:text-xs tracking-[0.35em] uppercase text-secondary mb-5 md:mb-6 font-semibold px-3.5 py-1.5 rounded-full border border-secondary/20 bg-secondary/5">
              Bytte regnskapsfører
            </span>

            <h2 className="font-heading text-3xl md:text-5xl lg:text-6xl leading-[1.15] tracking-tight mb-4 md:mb-6">
              Er vi <span className="italic text-gradient-rose inline-block pr-2 pb-1">riktig for deg?</span>
            </h2>

            <p className="text-base md:text-lg text-muted-foreground font-light leading-relaxed max-w-xl mb-6 md:mb-8">
              Riktig regnskapsfører er et viktig valg. Svar på fem korte spørsmål, så får du en personlig vurdering — og ærlig beskjed hvis vi ikke passer.
            </p>

            <ul className="space-y-3 md:space-y-4 mb-8 md:mb-10">
              {benefits.map((benefit, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={11} className="text-primary" strokeWidth={2.5} />
                  </div>
                  <span className="text-sm md:text-base text-foreground/90">{benefit}</span>
                </motion.li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-[12.5px] font-medium rounded-full border border-primary bg-primary text-primary-foreground hover:bg-primary/90 tracking-wide transition-all duration-300"
              >
                Ta sjekken
                <ArrowRight size={12} />
              </button>
              <Link
                to="/tjenester"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-[12.5px] font-medium rounded-full border border-border text-foreground/85 hover:border-foreground hover:text-foreground tracking-wide transition-all duration-300"
              >
                Slik bytter du regnskapsfører
              </Link>
            </div>
          </motion.div>

          {/* Visual — editorial photograph */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative"
          >
            <div className="relative aspect-[4/3] md:aspect-[16/12] rounded-3xl overflow-hidden border border-border/15 bg-gradient-to-br from-muted/30 via-card to-muted/20">
              <img
                src={switchCheckImage}
                alt="Rådgiver gjennomgår regnskapet for en bedrift"
                width={1200}
                height={912}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Dark gradient overlay for readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
              {/* Ambient glows */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl mix-blend-screen" />


              {/* Floating quiz card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="absolute bottom-5 left-5 right-5 md:bottom-8 md:left-8 md:right-8 bg-sage/95 backdrop-blur-sm border border-primary/15 rounded-2xl p-4 md:p-5 flex items-center gap-4 shadow-lg shadow-primary/10"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center shrink-0">
                  <Sparkles size={18} className="text-primary" strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base md:text-lg font-semibold text-primary">5 spørsmål</p>
                  <div className="flex items-center gap-1.5 text-xs md:text-sm text-primary/75">
                    <Clock size={12} strokeWidth={1.5} />
                    <span>ca. 60 sekunder</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SwitchCheckSection;
