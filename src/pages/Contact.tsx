import { useState } from "react";
import { ArrowRight, Send } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

const inputClass = "w-full bg-card border border-border/40 rounded-md px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/40 transition-colors";
const labelClass = "text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground block mb-2";

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="py-28 md:py-36">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-20 max-w-5xl mx-auto">
          {/* Left */}
          <AnimatedSection>
            <p className="text-[11px] uppercase tracking-[0.3em] text-primary/80 mb-4">Søknad</p>
            <h1 className="font-heading text-4xl md:text-5xl font-semibold mb-6 leading-snug">
              Er du klar for neste nivå, eller trives du på{" "}
              <span className="text-gradient-gold italic">stedet hvil</span>?
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed mb-10">
              Vi tar ikke inn hvem som helst. Fyll ut søknaden, så vurderer vi om det er en match.
            </p>
            <div className="space-y-3 text-sm text-muted-foreground/70">
              <p>Oslo, Norge</p>
              <p>post@avargo.no</p>
              <p>+47 22 00 00 00</p>
            </div>
          </AnimatedSection>

          {/* Right - Form */}
          <AnimatedSection delay={0.2}>
            {submitted ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <Send size={20} className="text-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-heading text-2xl font-semibold mb-3">Søknad mottatt</h3>
                  <p className="text-muted-foreground text-sm">Vi vurderer din henvendelse og tar kontakt innen 24 timer.</p>
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
                  <label className={labelClass}>Omsetningsmål neste 12 mnd</label>
                  <select required className={inputClass}>
                    <option value="">Velg...</option>
                    <option>Under 10 millioner</option>
                    <option>10–50 millioner</option>
                    <option>50–100 millioner</option>
                    <option>Over 100 millioner</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Største flaskehals i dag</label>
                  <textarea
                    required
                    rows={4}
                    className={`${inputClass} resize-none`}
                    placeholder="Beskriv din største utfordring..."
                  />
                </div>
                <button
                  type="submit"
                  className="group w-full flex items-center justify-center gap-2 py-4 bg-primary text-primary-foreground font-medium text-sm tracking-wide rounded-md hover:opacity-90 transition-all glow-gold"
                >
                  Send søknad
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
