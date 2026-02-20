import { useState } from "react";
import { ArrowRight, Check, Shield } from "lucide-react";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";

const inputClass = "w-full bg-card/40 backdrop-blur-xl border border-border/20 rounded-2xl px-4 md:px-5 py-3.5 md:py-4 text-sm text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-primary/30 focus:shadow-lg focus:shadow-primary/5 transition-all duration-500 font-light";
const labelClass = "text-[10px] tracking-[0.25em] uppercase text-muted-foreground block mb-2";

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="py-24 md:py-40 relative">
      <div className="absolute inset-0 ambient-glow opacity-40" />
      <div className="container mx-auto px-4 md:px-6 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 md:gap-24 max-w-5xl mx-auto">
          {/* Left */}
          <AnimatedSection>
            <p className="text-xs tracking-[0.4em] uppercase text-secondary mb-5 md:mb-6">Søknad</p>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl mb-6 md:mb-8 leading-snug">
              De fleste betaler for mye og får for lite.{" "}
              <span className="italic text-gradient-rose">Du trenger ikke være en av dem.</span>
            </h1>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-5 md:mb-6 font-light">
              Vi tar ikke inn alle. Ikke fordi vi er arrogante — men fordi vi gir hver klient en dedikert regnskapsfører som investerer seg i ditt selskap. Det fungerer bare når vi har kapasitet til å gjøre det skikkelig.
            </p>
            <p className="text-sm text-primary/70 italic font-light mb-8 md:mb-10">
              Fyll ut skjemaet. Vi kontakter deg innen 24 timer med en uforpliktende vurdering.
            </p>

            <div className="space-y-3 md:space-y-4 mb-8 md:mb-10">
              {[
                "Dedikert regnskapsfører fra dag én",
                "AI-drevet innsikt inkludert",
                "Alt i én fast pris — ingen overraskelser",
                "Spesialisert i din bransje",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm text-foreground/60 font-light">
                  <Check size={14} className="text-secondary shrink-0" strokeWidth={2} />
                  {item}
                </div>
              ))}
            </div>

            <div className="space-y-3 text-sm text-muted-foreground/50 font-light">
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
                className="flex items-center justify-center h-full min-h-[400px]"
              >
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Shield size={24} className="text-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-heading text-3xl mb-4">Søknad mottatt</h3>
                  <p className="text-muted-foreground font-light leading-relaxed mb-4">
                    Vi gjennomgår søknaden din og kontakter deg innen 24 timer.
                  </p>
                  <p className="text-sm text-primary/70 italic font-light">
                    I mellomtiden taper din nåværende regnskapsfører deg penger. Bare så du vet.
                  </p>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
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
                  <label className={labelClass}>Bransje</label>
                  <select required className={inputClass}>
                    <option value="">Velg bransje</option>
                    <option>Tech & SaaS</option>
                    <option>Eiendom & Utvikling</option>
                    <option>Holding & Investering</option>
                    <option>Consulting & Rådgivning</option>
                    <option>Landbruk</option>
                    <option>Varehandel</option>
                    <option>Bygg & Anlegg</option>
                    <option>Nettbutikk & E-commerce</option>
                    <option>Helse & Velvære</option>
                    <option>Annet</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Omsetningsmål neste 12 mnd</label>
                  <select required className={inputClass}>
                    <option value="">Velg ambisjonsnivå</option>
                    <option>Under 5 millioner</option>
                    <option>5–10 millioner</option>
                    <option>10–50 millioner</option>
                    <option>50–100 millioner</option>
                    <option>Over 100 millioner</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Hva frustrerer deg mest med dagens regnskap?</label>
                  <textarea
                    required
                    rows={3}
                    className={`${inputClass} resize-none`}
                    placeholder="Venter for lenge? Betaler for mye skatt? Føler du mangler kontroll?"
                  />
                </div>
                <button
                  type="submit"
                  className="group w-full flex items-center justify-center gap-3 py-4 bg-primary text-primary-foreground text-sm font-medium tracking-wider rounded-full glow-rose hover:scale-[1.01] transition-all duration-500 mt-2"
                >
                  Send søknad
                  <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                </button>
                <p className="text-xs text-muted-foreground/40 text-center font-light">
                  Helt uforpliktende. Vi kontakter deg innen 24 timer.
                </p>
              </form>
            )}
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default Contact;
