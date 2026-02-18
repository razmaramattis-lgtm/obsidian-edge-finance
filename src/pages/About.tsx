import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

const About = () => {
  return (
    <>
      <section className="py-32 md:py-40 relative">
        <div className="absolute inset-0 dreamy-bg opacity-40" />
        <div className="container mx-auto px-6 relative">
          <AnimatedSection>
            <div className="max-w-2xl">
              <p className="text-[11px] uppercase tracking-[0.3em] text-accent/70 mb-4">Om oss</p>
              <h1 className="font-heading text-4xl md:text-5xl font-medium mb-8 leading-snug">
                Du trenger ikke en bokholder.{" "}
                <span className="text-gradient-gold italic">Du trenger en drømmepartner.</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Avargo ble født ut av en visjon om at tall skal inspirere — ikke bare rapporteres. Vi er din finansielle arkitekt, her for å bygge veien til dit du vil.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Vårt team består av eks-analytikere og serie-gründere som forstår at regnskapet ditt er et verktøy for vekst — ikke et formål i seg selv.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <div className="container mx-auto px-6"><div className="line-accent" /></div>

      {/* Values */}
      <section className="py-32 md:py-40">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <p className="text-[11px] uppercase tracking-[0.3em] text-accent/70 mb-4">Verdier</p>
            <h2 className="font-heading text-3xl md:text-4xl font-medium mb-20">Hvordan vi tenker</h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { num: "01", title: "Presisjon med varme", desc: "Vi måler, analyserer og handler med nøyaktighet — men aldri uten å lytte til menneskene bak tallene." },
              { num: "02", title: "Alltid et steg foran", desc: "Når du hører om utfordringen, har vi allerede funnet muligheten. Det er vår standard." },
              { num: "03", title: "Vekst som eventyr", desc: "Hvert tall vi ser, ser vi gjennom linsen av 'Hvor langt kan dette ta deg?'" },
            ].map((v, i) => (
              <AnimatedSection key={v.num} delay={i * 0.15}>
                <div className="p-8 bg-card/50 border border-border/30 rounded-2xl card-hover">
                  <span className="font-heading text-5xl font-medium text-accent/10">{v.num}</span>
                  <h3 className="font-heading text-xl font-medium mt-6 mb-3">{v.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 border-t border-border/15 text-center relative">
        <div className="absolute inset-0 dreamy-bg opacity-30" />
        <div className="container mx-auto px-6 relative">
          <AnimatedSection>
            <h2 className="font-heading text-3xl md:text-4xl font-medium mb-8">
              Klar for å drømme <span className="text-gradient-gold italic">større</span>?
            </h2>
            <Link
              to="/kontakt"
              className="group inline-flex items-center gap-3 px-10 py-4 bg-primary text-primary-foreground font-medium text-sm tracking-wide rounded-full hover:shadow-lg hover:shadow-primary/20 transition-all duration-500"
            >
              Start samtalen
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
};

export default About;
