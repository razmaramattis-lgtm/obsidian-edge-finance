import { useState } from "react";
import { ArrowRight, Send, Sparkles } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

const inputClass = "w-full bg-card/50 backdrop-blur-sm border border-border/30 rounded-xl px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/30 focus:shadow-lg focus:shadow-primary/5 transition-all duration-500";
const labelClass = "text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground block mb-2";

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="py-32 md:py-40 relative">
      <div className="absolute inset-0 dreamy-bg opacity-40" />
      <div className="container mx-auto px-6 relative">
        <div className="grid md:grid-cols-2 gap-20 max-w-5xl mx-auto">
          {/* Left */}
          <AnimatedSection>
            <p className="text-[11px] uppercase tracking-[0.3em] text-accent/70 mb-4">Kontakt oss</p>
            <h1 className="font-heading text-4xl md:text-5xl font-medium mb-6 leading-snug">
              La oss skape noe{" "}
              <span className="text-gradient-gold italic">ekstraordinært</span> sammen
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed mb-10">
              Fortell oss om drømmene dine for selskapet — vi finner ut hvordan vi kan hjelpe deg dit.
            </p>
            <div className="space-y-3 text-sm text-muted-foreground/60">
              <p>✦ Oslo, Norge</p>
              <p>✦ post@avargo.no</p>
              <p>✦ +47 22 00 00 00</p>
            </div>
          </AnimatedSection>

          {/* Right - Form */}
          <AnimatedSection delay={0.2}>
            {submitted ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles size={22} className="text-primary" />
                  </div>
                  <h3 className="font-heading text-2xl font-medium mb-3">Mottatt!</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">Vi gleder oss til å bli kjent med deg — forvent svar innen 24 timer.</p>
                </div>
              </div>
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
                  <label className={labelClass}>Hvor ser du selskapet om 12 mnd?</label>
                  <select required className={inputClass}>
                    <option value="">Velg ambisjonsnivå...</option>
                    <option>Under 10 millioner</option>
                    <option>10–50 millioner</option>
                    <option>50–100 millioner</option>
                    <option>Over 100 millioner — vi drømmer stort</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Hva holder deg tilbake i dag?</label>
                  <textarea
                    required
                    rows={4}
                    className={`${inputClass} resize-none`}
                    placeholder="Fortell oss om din største utfordring..."
                  />
                </div>
                <button
                  type="submit"
                  className="group w-full flex items-center justify-center gap-2 py-4 bg-primary text-primary-foreground font-medium text-sm tracking-wide rounded-full hover:shadow-lg hover:shadow-primary/20 transition-all duration-500"
                >
                  Send henvendelse
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
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
