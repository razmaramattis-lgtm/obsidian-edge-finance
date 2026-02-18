import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

const About = () => {
  return (
    <>
      <section className="py-36 md:py-44 relative">
        <div className="absolute inset-0 ambient-glow opacity-40" />
        <div className="container mx-auto px-6 relative">
          <AnimatedSection>
            <div className="max-w-2xl">
              <p className="text-xs tracking-[0.4em] uppercase text-secondary mb-6">Om oss</p>
              <h1 className="font-heading text-5xl md:text-7xl mb-10 leading-snug">
                Du trenger ikke en bokholder.{" "}
                <span className="italic text-gradient-rose">Du trenger en strateg.</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6 font-light">
                Avargo eksisterer fordi regnskap fortjener noe bedre. Vi ser ikke tall — vi ser muligheter, risiko og veien videre.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed font-light">
                Teamet vårt er bygget av eks-analytikere og gründere som vet at hvert tall forteller en historie. Vi leser den historien bedre enn noen andre.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <div className="container mx-auto px-6"><div className="line-accent" /></div>

      <section className="py-36 md:py-44">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <p className="text-xs tracking-[0.4em] uppercase text-secondary mb-6">Verdier</p>
            <h2 className="font-heading text-4xl md:text-5xl mb-20">Våre prinsipper</h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: "01", title: "Presisjon med omtanke", desc: "Vi måler og analyserer med kirurgisk nøyaktighet — men aldri uten å forstå mennesket bak tallene." },
              { num: "02", title: "Alltid foran deg", desc: "Når du hører om utfordringen, har vi allerede funnet løsningen. Det er standardkravet vårt." },
              { num: "03", title: "Vekst som livsstil", desc: "Vi ser hvert eneste tall gjennom én linse: Hvordan bygger dette mest mulig verdi for deg?" },
            ].map((v, i) => (
              <AnimatedSection key={v.num} delay={i * 0.15}>
                <div className="p-10 glass rounded-3xl card-lift">
                  <span className="font-heading text-6xl text-primary/8">{v.num}</span>
                  <h3 className="font-heading text-2xl mt-6 mb-4">{v.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed font-light">{v.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 border-t border-border/10 text-center relative">
        <div className="absolute inset-0 ambient-glow opacity-30" />
        <div className="container mx-auto px-6 relative">
          <AnimatedSection>
            <h2 className="font-heading text-4xl md:text-5xl mb-10">
              Klar for <span className="italic text-gradient-rose">noe bedre</span>?
            </h2>
            <Link
              to="/kontakt"
              className="group inline-flex items-center gap-3 px-12 py-5 bg-primary text-primary-foreground text-sm font-medium tracking-wider rounded-full glow-rose hover:scale-[1.02] transition-all duration-500"
            >
              La oss snakke
              <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
};

export default About;
