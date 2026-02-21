import { Link } from "react-router-dom";
import { ArrowRight, Users, Bot, Shield, TrendingUp } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

const About = () => {
  return (
    <>
      <section className="py-24 md:py-40 relative">
        <div className="absolute inset-0 ambient-glow opacity-40" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <AnimatedSection>
            <div className="max-w-3xl">
              <p className="text-xs tracking-[0.4em] uppercase text-secondary mb-5 md:mb-6">Om Avargo</p>
              <h1 className="font-heading text-4xl sm:text-5xl md:text-7xl mb-8 md:mb-10 leading-snug">
                Vi bygde byrået vi selv{" "}
                <span className="italic text-gradient-rose">savnet da vi trengte det.</span>
              </h1>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-5 md:mb-6 font-light">
                De fleste regnskapsbyrå behandler deg som en mappe i et arkivskap. Noen forsto at du ville ha noe enklere. Andre ga deg verktøyet. Men ingen ga deg alt — en dedikert regnskapsfører som kjenner deg, forsterket av AI som gjør dere begge bedre.
              </p>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-5 md:mb-6 font-light">
                Avargo ble bygget av gründere som var lei av å vente 30 dager på en rapport som allerede var utdatert. Vi ville ha innsikt i sanntid. Vi ville ha en rådgiver som ringte oss med muligheter — ikke bare problemer. Vi ville ha noen som faktisk <em>brydde seg</em> om veksten vår.
              </p>
              <p className="text-base md:text-lg text-foreground/80 leading-relaxed font-light italic">
                Så vi bygde det. Og nå deler vi det med deg.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6"><div className="line-accent" /></div>

      {/* What makes us different */}
      <section className="py-24 md:py-40">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection>
            <p className="text-xs tracking-[0.4em] uppercase text-secondary mb-5 md:mb-6">Forskjellen</p>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-14 md:mb-20 max-w-3xl leading-snug">
              Hva gjør Avargo til noe <span className="italic text-gradient-rose">ingen andre er</span>?
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {[
              { icon: Users, num: "01", title: "Menneske først, alltid", desc: "Du får en navngitt, dedikert regnskapsfører. Ikke en tilfeldig person fra et team. Ikke en chatbot. Et menneske som lærer selskapet ditt, forstår drømmene dine, og jobber for deg som om det var sitt eget." },
              { icon: Bot, num: "02", title: "AI som stille superkraft", desc: "Regnskapsføreren din bruker AI-verktøy som skanner tusenvis av datapunkter hver dag. Resultatet? Fradrag du ikke visste om. Risiko du ikke hadde sett. Muligheter du ikke hadde oppdaget. AI-en gjør jobben — mennesket tar beslutningen." },
              { icon: Shield, num: "03", title: "Alt inkludert. Virkelig alt.", desc: "Bokføring, mva, lønn, årsregnskap, skattemelding, aksjonærregisteroppgave, bankintegrasjon, revisjonstøtte, rådgivning. Andre tar ekstra for halvparten av dette. Vi tar ingenting ekstra. Noensinne." },
              { icon: TrendingUp, num: "04", title: "Spesialisert i din bransje", desc: "Vi har dedikerte team for tech, eiendom, holding, landbruk, varehandel, bygg, e-commerce, helse og consulting. Din regnskapsfører forstår ikke bare tall — de forstår din virkelighet." },
            ].map((v, i) => (
              <AnimatedSection key={v.num} delay={i * 0.12}>
                <div className="p-8 md:p-10 glass rounded-3xl card-lift h-full">
                  <span className="font-heading text-5xl md:text-6xl text-primary/20">{v.num}</span>
                  <v.icon size={20} className="text-primary mt-3 mb-4 md:mt-4 md:mb-5" strokeWidth={1.5} />
                  <h3 className="font-heading text-xl md:text-2xl mb-3 md:mb-4">{v.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed font-light">{v.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6"><div className="line-accent" /></div>

      {/* Values */}
      <section className="py-24 md:py-40">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection>
            <p className="text-xs tracking-[0.4em] uppercase text-secondary mb-5 md:mb-6">Verdier</p>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-14 md:mb-20">Våre ufravikelige prinsipper</h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              { num: "01", title: "Ingen overraskelser", desc: "Fastpris. Ingen timefakturering. Ingen skjulte kostnader. Du vet alltid hva du betaler — og hva du får tilbake. Hos oss er rådgivning inkludert, ikke et tillegg." },
              { num: "02", title: "Proaktiv, aldri reaktiv", desc: "Regnskapsføreren din ringer deg med innsikt du ikke ba om. Vi venter ikke på problemer — vi finner muligheter. Forskjellen mellom å overleve og å dominere." },
              { num: "03", title: "Din vekst er vår målestokk", desc: "Vi måles ikke på antall bilag vi bokfører. Vi måles på hvor mye verdi vi skaper for deg. Hvis du ikke vokser, har vi ikke gjort jobben vår." },
            ].map((v, i) => (
              <AnimatedSection key={v.num} delay={i * 0.15}>
                <div className="p-8 md:p-10 glass rounded-3xl card-lift">
                  <span className="font-heading text-5xl md:text-6xl text-primary/20">{v.num}</span>
                  <h3 className="font-heading text-xl md:text-2xl mt-5 md:mt-6 mb-3 md:mb-4">{v.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed font-light">{v.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 border-t border-border/10 text-center relative">
        <div className="absolute inset-0 ambient-glow opacity-30" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <AnimatedSection>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-5 md:mb-6 leading-snug">
              Regnskapsføreren din venter på deg.
            </h2>
            <p className="text-muted-foreground font-light mb-8 md:mb-10 max-w-lg mx-auto text-sm md:text-base">
              Dedikert. Autorisert. Spesialisert i din bransje. Klar til å gjøre tallene dine til et våpen.
            </p>
            <Link
              to="/kontakt"
              className="group inline-flex items-center gap-3 px-10 md:px-12 py-4 md:py-5 bg-primary text-primary-foreground text-sm font-medium tracking-wider rounded-full glow-rose hover:scale-[1.02] transition-all duration-500"
            >
              Møt ditt team
              <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
};

export default About;
