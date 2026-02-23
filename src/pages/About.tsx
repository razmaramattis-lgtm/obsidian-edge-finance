import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight, Handshake, Sparkles, Crown, Gem } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { useSection } from "@/contexts/SectionContext";
import { sectionPageCopy } from "@/config/sectionContent";

const About = () => {
  const { section, isInSection } = useSection();
  const copy = isInSection && section ? sectionPageCopy[section.id].omOss : null;
  const sectionPath = isInSection && section ? section.basePath : "";

  return (
    <>
      <Helmet>
        <title>{copy ? `Om oss — ${section!.name} | Avargo` : "Om Avargo | Regnskapsbyrå for små og mellomstore bedrifter"}</title>
        <meta name="description" content={copy?.intro1 || "Møt Avargo — regnskapsbyrået med statsautoriserte regnskapsførere som gir små og mellomstore bedrifter trygghet, oversikt og rom til å vokse."} />
        <link rel="canonical" href={`https://avargo.no${sectionPath}/om-oss`} />
      </Helmet>
      <section className="py-24 md:py-40 relative">
        <div className="absolute inset-0 ambient-glow opacity-40" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <AnimatedSection>
            <div className="max-w-3xl">
              <p className="text-xs tracking-[0.4em] uppercase text-secondary mb-5 md:mb-6">{copy?.tag || "Om Avargo"}</p>
              <h1 className="font-heading text-4xl sm:text-5xl md:text-7xl mb-8 md:mb-10 leading-snug">
                {copy?.headline || <>Regnskapsførere som brant for å{" "}<span className="italic text-gradient-rose">gjøre det bedre.</span></>}
              </h1>
              <p className="text-base md:text-lg text-foreground/70 leading-relaxed mb-5 md:mb-6 font-light">
                {copy?.intro1 || "Vi er statsautoriserte regnskapsførere som ble lei av å se bedriftseiere slite med dårlig oppfølging, skjulte kostnader og regnskapsførere som aldri tok telefonen. Vi visste at det gikk an å gjøre det bedre — mer tilgjengelig, mer proaktivt og mer forståelig."}
              </p>
              <p className="text-base md:text-lg text-foreground/70 leading-relaxed mb-5 md:mb-6 font-light">
                {copy?.intro2 || "Derfor startet vi Avargo. Et regnskapsbyrå bygget for små og mellomstore bedrifter som ønsker trygghet — ikke bare tall. Der du får én fast regnskapsfører som faktisk kjenner selskapet ditt, og et helt team som jobber for at du skal ha full kontroll."}
              </p>
              <p className="text-base md:text-lg text-foreground/80 leading-relaxed font-light italic">
                {copy?.italic || "Vi bygde Avargo fordi vi som statsautoriserte regnskapsførere så hva markedet manglet — og bestemte oss for å gjøre noe med det."}
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
              { icon: Handshake, num: "01", title: "Menneske først, alltid", desc: "Du får en navngitt ekspert som lærer selskapet ditt å kjenne. Ingen callsenter — et menneske som jobber for deg." },
              { icon: Sparkles, num: "02", title: "Teknologi som stille superkraft", desc: "Smarte verktøy som gjennomgår tusenvis av datapunkter. Du får innsikt du ikke visste om og muligheter du ikke hadde oppdaget." },
              { icon: Gem, num: "03", title: "Alt inkludert — virkelig alt", desc: "Ingen tillegg, ingen overraskelser. Alt du trenger er inkludert fra dag én." },
              { icon: Crown, num: "04", title: "Vi kjenner bransjen din", desc: "Erfaring med over 25 bransjer. Din rådgiver forstår hverdagen din, ikke bare tallene." },
            ].map((v, i) => (
              <AnimatedSection key={v.num} delay={i * 0.12}>
                <div className="group p-8 md:p-10 glass rounded-3xl card-lift h-full relative overflow-hidden">
                  <div className="absolute -top-8 -right-8 w-28 h-28 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-700" />
                  <div className="relative">
                    <span className="font-heading text-5xl md:text-6xl text-primary/15">{v.num}</span>
                    <div className="p-2.5 bg-gradient-to-br from-primary/15 to-primary/5 rounded-xl inline-block mt-3 mb-4 md:mt-4 md:mb-5">
                      <v.icon size={20} className="text-primary" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-heading text-xl md:text-2xl mb-3 md:mb-4">{v.title}</h3>
                    <p className="text-sm text-foreground/60 leading-relaxed font-light">{v.desc}</p>
                  </div>
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
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-14 md:mb-20">Slik jobber vi — hver dag</h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              { num: "01", title: "Ingen overraskelser", desc: "Fast pris. Ingen timefakturering. Ingen skjulte kostnader." },
              { num: "02", title: "Vi tar initiativ", desc: "Vi venter ikke på at du skal oppdage problemet. Vi kontakter deg med muligheter og forslag." },
              { num: "03", title: "Din vekst er målet vårt", desc: "Vi måles ikke på volum. Vi måles på hvor mye verdi vi skaper for deg." },
            ].map((v, i) => (
              <AnimatedSection key={v.num} delay={i * 0.15}>
                <div className="p-8 md:p-10 glass rounded-3xl card-lift">
                  <span className="font-heading text-5xl md:text-6xl text-primary/25">{v.num}</span>
                  <h3 className="font-heading text-xl md:text-2xl mt-5 md:mt-6 mb-3 md:mb-4">{v.title}</h3>
                  <p className="text-sm text-foreground/60 leading-relaxed font-light">{v.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 border-t border-border/15 text-center relative">
        <div className="absolute inset-0 ambient-glow opacity-30" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <AnimatedSection>
             <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-5 md:mb-6 leading-snug">
               Klar for en partner som{" "}
               <span className="italic text-gradient-rose">faktisk bryr seg</span>?
             </h2>
             <p className="text-foreground/60 font-light mb-8 md:mb-10 max-w-lg mx-auto text-sm md:text-base">
               Dedikert. Klar fra dag én. Vi kontakter deg innen 24 timer.
             </p>
             <Link
               to={`${sectionPath}/kontakt`}
               className="group inline-flex items-center gap-3 px-10 md:px-12 py-4 md:py-5 bg-primary text-primary-foreground text-sm font-medium tracking-wider rounded-full glow-rose hover:scale-[1.02] transition-all duration-500"
             >
               Få et uforpliktende tilbud
               <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
             </Link>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
};

export default About;
