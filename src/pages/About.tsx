import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight, Users, Bot, Shield, TrendingUp, Rocket, CheckCircle2, Handshake, Sparkles, Crown, Gem } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

const starterPakker = [
  {
    name: "Oppstart",
    price: "1 499",
    desc: "For nyoppstartede selskaper som trenger orden fra dag én.",
    features: ["Bokføring", "MVA-rapportering", "Årsregnskap", "Skattemelding", "Kvartalsvis rådgivning"],
    highlighted: false,
  },
  {
    name: "Vekst",
    price: "3 499",
    desc: "For selskaper i vekst som trenger mer oppfølging og innsikt.",
    features: ["Alt i Oppstart", "Dedikert regnskapsfører", "Lønnskjøring", "Månedlig resultatrapport", "Skatteoptimalisering"],
    highlighted: true,
  },
  {
    name: "Kun rådgivning",
    price: "999",
    desc: "For deg som har regnskap, men trenger noen å sparre med.",
    features: ["Månedlig rådgivningstime", "Skattegjennomgang", "Selskapsstruktur-rådgivning", "Tilgang til Avargo-nettverk"],
    highlighted: false,
  },
];

const About = () => {
  const navigate = useNavigate();

  const handlePackageClick = (packageName: string) => {
    navigate(`/kontakt?pakke=${encodeURIComponent(packageName)}`);
  };

  return (
    <>
      <Helmet>
        <title>Om Avargo | Regnskapsbyrå med AI-drevet rådgivning</title>
        <meta name="description" content="Møt Avargo — regnskapsbyrået som kombinerer autoriserte regnskapsførere, HR-spesialister og teknologi for å gi deg full kontroll over økonomi og vekst." />
        <link rel="canonical" href="https://avargo.no/om-oss" />
      </Helmet>
      <section className="py-24 md:py-40 relative">
        <div className="absolute inset-0 ambient-glow opacity-40" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <AnimatedSection>
            <div className="max-w-3xl">
              <p className="text-xs tracking-[0.4em] uppercase text-secondary mb-5 md:mb-6">Om Avargo</p>
              <h1 className="font-heading text-4xl sm:text-5xl md:text-7xl mb-8 md:mb-10 leading-snug">
                Regnskapsførere som brant for å{" "}
                <span className="italic text-gradient-rose">gjøre det bedre.</span>
              </h1>
              <p className="text-base md:text-lg text-foreground/70 leading-relaxed mb-5 md:mb-6 font-light">
                Vi er autoriserte regnskapsførere som ble lei av å se bedriftseiere slite med dårlig oppfølging, skjulte kostnader og regnskapsførere som aldri tok telefonen. Vi visste at det gikk an å gjøre det bedre — mer tilgjengelig, mer proaktivt og mer forståelig.
              </p>
              <p className="text-base md:text-lg text-foreground/70 leading-relaxed mb-5 md:mb-6 font-light">
                Derfor startet vi Avargo. Et regnskapsbyrå bygget rundt mennesker, ikke systemer. Der du får én fast regnskapsfører som faktisk kjenner selskapet ditt, forsterket av AI-verktøy som gjør at vi oppdager ting andre overser.
              </p>
              <p className="text-base md:text-lg text-foreground/80 leading-relaxed font-light italic">
                Vi startet Avargo fordi vi som autoriserte regnskapsførere så hva markedet manglet — og bygde det selv.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6"><div className="line-accent" /></div>

      {/* Nystartet firma — pakker */}
      <section className="py-24 md:py-40 relative">
        <div className="absolute inset-0 ambient-glow opacity-30" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <AnimatedSection>
            <div className="text-center max-w-2xl mx-auto mb-14 md:mb-20">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <Rocket size={14} className="text-primary" />
                <span className="text-xs text-primary tracking-wide font-medium">Nystartet selskap?</span>
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-5 md:mb-6 leading-snug">
                Kom i gang fra{" "}
                <span className="italic text-gradient-rose">1 499 kr/mnd</span>
              </h2>
              <p className="text-foreground/70 font-light leading-relaxed text-sm md:text-base">
                Du trenger ikke et stort byrå for å komme i gang. Velg pakken som passer deg — og bytt opp etterhvert som selskapet vokser. Alle priser er faste og uten skjulte kostnader.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
            {starterPakker.map((pkg, i) => (
              <AnimatedSection key={pkg.name} delay={i * 0.12}>
                <div
                  onClick={() => handlePackageClick(pkg.name)}
                  className={`relative p-8 md:p-10 rounded-3xl h-full flex flex-col card-lift cursor-pointer ${
                    pkg.highlighted ? "glass glow-rose border-primary/25" : "glass"
                  }`}
                >
                  {pkg.highlighted && (
                    <div className="absolute -top-3 left-8 md:left-10 px-4 py-1.5 bg-primary text-primary-foreground text-[10px] font-medium tracking-[0.2em] uppercase rounded-full">
                      Mest valgt
                    </div>
                  )}
                  <h3 className="font-heading text-2xl md:text-3xl mb-2">{pkg.name}</h3>
                  <p className="text-sm text-foreground/60 font-light mb-6">{pkg.desc}</p>
                  <div className="mb-6">
                    <span className="text-sm text-foreground/50 font-light mr-1">Fra</span>
                    <span className="font-heading text-4xl md:text-5xl">{pkg.price}</span>
                    <span className="text-foreground/50 text-sm"> kr/mnd</span>
                  </div>
                  <ul className="flex flex-col gap-3 mb-8 flex-1">
                    {pkg.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm text-foreground/70 font-light">
                        <CheckCircle2 size={14} className="text-secondary mt-0.5 shrink-0" strokeWidth={2} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className={`group w-full flex items-center justify-center gap-2 py-4 rounded-full text-sm font-medium tracking-wider transition-all duration-500 ${
                    pkg.highlighted
                      ? "bg-primary text-primary-foreground hover:scale-[1.02] glow-rose"
                      : "border border-border/40 text-foreground/70 hover:border-primary/30 hover:text-foreground"
                  }`}>
                    Velg {pkg.name}
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
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
              { icon: Handshake, num: "01", title: "Menneske først, alltid", desc: "Du får en navngitt, dedikert regnskapsfører som lærer selskapet ditt å kjenne. Ingen callsenter, ingen chatbot — et menneske som jobber for deg som om det var sitt eget selskap." },
              { icon: Sparkles, num: "02", title: "AI som stille superkraft", desc: "Regnskapsføreren din bruker AI-verktøy som gjennomgår tusenvis av datapunkter. Du får fradrag du ikke visste om, risiko du ikke hadde sett, og muligheter du ikke hadde oppdaget." },
              { icon: Gem, num: "03", title: "Alt inkludert — virkelig alt", desc: "Bokføring, MVA, lønn, årsregnskap, skattemelding, aksjonærregisteroppgave, revisjonstøtte og rådgivning. Andre tar ekstra for halvparten. Vi tar ingenting ekstra." },
              { icon: Crown, num: "04", title: "Vi kjenner bransjen din", desc: "Vi har erfaring med over 25 bransjer — fra tech og eiendom til bygg, restaurant og helse. Din regnskapsfører forstår hverdagen din, ikke bare tallene." },
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
              { num: "01", title: "Ingen overraskelser", desc: "Fast pris. Ingen timefakturering. Ingen skjulte kostnader. Du vet alltid hva du betaler — og hva du får tilbake." },
              { num: "02", title: "Vi ringer deg først", desc: "Vi venter ikke på at du skal oppdage problemet. Vi ringer deg med muligheter, advarsler og forslag — før du trenger å spørre." },
              { num: "03", title: "Din vekst er målet vårt", desc: "Vi måles ikke på antall bilag. Vi måles på hvor mye verdi vi skaper for deg. Hvis du ikke vokser, har vi ikke gjort jobben vår." },
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
              Klar til å gjøre regnskapet til en{" "}
              <span className="italic text-gradient-rose">styrke</span>?
            </h2>
            <p className="text-foreground/60 font-light mb-8 md:mb-10 max-w-lg mx-auto text-sm md:text-base">
              Dedikert. Autorisert. Klar til å hjelpe deg fra dag én.
            </p>
            <Link
              to="/kontakt"
              className="group inline-flex items-center gap-3 px-10 md:px-12 py-4 md:py-5 bg-primary text-primary-foreground text-sm font-medium tracking-wider rounded-full glow-rose hover:scale-[1.02] transition-all duration-500"
            >
              Kom i gang
              <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
};

export default About;
