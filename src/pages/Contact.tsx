import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";

const inputClass = "w-full bg-card/40 backdrop-blur-xl border border-border/20 rounded-2xl px-5 py-4 text-sm text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-primary/30 focus:shadow-lg focus:shadow-primary/5 transition-all duration-500 font-light";
const labelClass = "text-[10px] tracking-[0.25em] uppercase text-muted-foreground block mb-2.5";

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="py-36 md:py-44 relative">
      <div className="absolute inset-0 ambient-glow opacity-40" />
      <div className="container mx-auto px-6 relative">
        <div className="grid md:grid-cols-2 gap-24 max-w-5xl mx-auto">
          {/* Left */}
          <AnimatedSection>
            <p className="text-xs tracking-[0.4em] uppercase text-secondary mb-6">Neste steg</p>
            <h1 className="font-heading text-5xl md:text-6xl mb-8 leading-snug">
              Fortell oss om{" "}
              <span className="italic text-gradient-rose">ambisjonene dine</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed mb-12 font-light">
              Vi tar ikke inn alle. Fyll ut skjemaet så vurderer vi om det er en match — fordi den rette partneren gjør alt forskjellen.
            </p>
            <div className="space-y-4 text-sm text-muted-foreground/50 font-light">
              <div className="flex items-center gap-3">
                <div className="w-1 h-1 rounded-full bg-primary/40" />
                <span>Oslo, Norge</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1 h-1 rounded-full bg-primary/40" />
                <span>post@avargo.no</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1 h-1 rounded-full bg-primary/40" />
                <span>+47 22 00 00 00</span>
              </div>
            </div>
          </AnimatedSection>

          {/* Right - Form */}
          <AnimatedSection delay={0.2}>
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="flex items-center justify-center h-full"
              >
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Check size={24} className="text-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-heading text-3xl mb-4">Mottatt</h3>
                  <p className="text-muted-foreground font-light leading-relaxed">
                    Vi ser frem til å bli kjent med deg.<br />Forvent svar innen 24 timer.
                  </p>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className={labelClass}>Navn</label>
                  <input required type="text" className={inputClass} placeholder="Ditt fulle navn" />
                </div>
                <div>
                  <label className={labelClass}>E-post</label>
                  <input required type="email" className={inputClass} placeholder="din@epost.no" />
                </div>
                <div>
                  <label className={labelClass}>Selskap</label>
                  <input required type="text" className={inputClass} placeholder="Selskapets navn" />
                </div>
                <div>
                  <label className={labelClass}>Hvor vil du være om 12 måneder?</label>
                  <select required className={inputClass}>
                    <option value="">Velg ambisjonsnivå</option>
                    <option>Under 10 millioner</option>
                    <option>10–50 millioner</option>
                    <option>50–100 millioner</option>
                    <option>Over 100 millioner</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Hva holder deg tilbake?</label>
                  <textarea
                    required
                    rows={4}
                    className={`${inputClass} resize-none`}
                    placeholder="Fortell oss om din største utfordring..."
                  />
                </div>
                <button
                  type="submit"
                  className="group w-full flex items-center justify-center gap-3 py-4 bg-primary text-primary-foreground text-sm font-medium tracking-wider rounded-full glow-rose hover:scale-[1.01] transition-all duration-500 mt-2"
                >
                  Send søknad
                  <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                </button>
              </form>
            )}
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default Contact;
