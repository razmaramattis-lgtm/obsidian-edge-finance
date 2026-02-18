import { useState } from "react";
import { ArrowRight, Send } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="py-24 md:py-32">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 max-w-5xl mx-auto">
          {/* Left */}
          <AnimatedSection>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-4 block">Kontakt</span>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6">
              Er du klar for neste nivå, eller trives du på{" "}
              <span className="text-gradient-gold">stedet hvil</span>?
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Vi tar ikke inn hvem som helst. Fyll ut skjemaet, så vurderer vi om det er en match. Det handler like mye om at vi passer for deg, som at du passer for oss.
            </p>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>📍 Oslo, Norge</p>
              <p>✉️ post@avargo.no</p>
              <p>📞 +47 22 00 00 00</p>
            </div>
          </AnimatedSection>

          {/* Right - Form */}
          <AnimatedSection delay={0.2}>
            {submitted ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <Send size={24} className="text-primary" />
                  </div>
                  <h3 className="font-heading text-2xl font-bold mb-3">Søknad mottatt</h3>
                  <p className="text-muted-foreground">Vi vurderer din henvendelse og tar kontakt innen 24 timer.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
                    Navn
                  </label>
                  <input
                    required
                    type="text"
                    className="w-full bg-card border border-border/50 rounded px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-colors"
                    placeholder="Ditt fulle navn"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
                    E-post
                  </label>
                  <input
                    required
                    type="email"
                    className="w-full bg-card border border-border/50 rounded px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-colors"
                    placeholder="din@epost.no"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
                    Selskap
                  </label>
                  <input
                    required
                    type="text"
                    className="w-full bg-card border border-border/50 rounded px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-colors"
                    placeholder="Selskapets navn"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
                    Hva er ditt omsetningsmål for de neste 12 månedene?
                  </label>
                  <select
                    required
                    className="w-full bg-card border border-border/50 rounded px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                  >
                    <option value="">Velg...</option>
                    <option>Under 10 millioner</option>
                    <option>10–50 millioner</option>
                    <option>50–100 millioner</option>
                    <option>Over 100 millioner</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
                    Hva er din største flaskehals i dag?
                  </label>
                  <textarea
                    required
                    rows={4}
                    className="w-full bg-card border border-border/50 rounded px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-colors resize-none"
                    placeholder="Beskriv din største utfordring..."
                  />
                </div>
                <button
                  type="submit"
                  className="group w-full flex items-center justify-center gap-2 py-4 bg-primary text-primary-foreground font-heading font-semibold text-sm uppercase tracking-wider rounded hover:opacity-90 transition-all glow-gold"
                >
                  Send søknad
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
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
