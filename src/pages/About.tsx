import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

const About = () => {
  return (
    <>
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <div className="max-w-3xl">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-4 block">Om oss</span>
              <h1 className="font-heading text-4xl md:text-6xl font-bold mb-8">
                Du trenger ikke en bokholder.{" "}
                <span className="text-gradient-gold">Du trenger en taktiker.</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Avargo ble født ut av frustrasjon over en støvete bransje. Vi er ikke her for å fylle ut skjemaer; vi er her for å være din finansielle arkitekt.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Vårt team består av eks-analytikere og serie-gründere. Vi ser tallene, men vi forstår businessen. Vi vet at regnskapet ditt ikke er et formål i seg selv — det er et verktøy for vekst.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <div className="container mx-auto px-6"><div className="line-accent" /></div>

      {/* Values */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-4 block">Verdier</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-16">Hvordan vi tenker</h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { num: "01", title: "Presisjon over alt", desc: "Vi gjettar ikke. Vi måler, analyserer og handler med kirurgisk nøyaktighet." },
              { num: "02", title: "Proaktiv, aldri reaktiv", desc: "Når du hører om problemet, har vi allerede løst det. Det er standarden vår." },
              { num: "03", title: "Vekst som filosofi", desc: "Hvert tall vi ser, ser vi gjennom linsen av 'Hvordan bygger dette verdi?'" },
            ].map((v, i) => (
              <AnimatedSection key={v.num} delay={i * 0.15}>
                <div className="p-8 bg-card border border-border/50 rounded">
                  <span className="font-heading text-4xl font-bold text-primary/20">{v.num}</span>
                  <h3 className="font-heading text-lg font-semibold mt-4 mb-3">{v.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-border/50 text-center">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6">
              Klar for å tenke <span className="text-gradient-gold">større</span>?
            </h2>
            <Link
              to="/kontakt"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-heading font-semibold text-sm uppercase tracking-wider rounded hover:opacity-90 transition-all glow-gold"
            >
              Ta kontakt
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
};

export default About;
