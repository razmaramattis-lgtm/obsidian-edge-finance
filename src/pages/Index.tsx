import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight, TrendingUp, Shield, Zap, Globe, Building2, Briefcase, Landmark,
  Tractor, ShoppingCart, HardHat, Heart, Store, Users, BarChart3, Bot,
  FileCheck, CreditCard, Calculator, Clock, Lock, Headphones
} from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import heroBg from "@/assets/hero-bg.jpg";

const LiveCounter = () => {
  const [amount, setAmount] = useState(247832);
  useEffect(() => {
    const interval = setInterval(() => {
      setAmount((prev) => prev + Math.floor(Math.random() * 12 + 3));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2, duration: 0.8 }}
      className="inline-flex items-center gap-4 px-6 py-3 rounded-full glass"
    >
      <div className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
      <span className="text-xs tracking-widest uppercase text-muted-foreground">Tapte penger i dag</span>
      <span className="font-heading text-xl text-destructive tabular-nums">
        {amount.toLocaleString("no-NO")} kr
      </span>
    </motion.div>
  );
};

const Index = () => {
  const industries = [
    { icon: Globe, name: "Tech & SaaS", tagline: "Vi vokser i takt med deg", desc: "Teknologiselskaper beveger seg raskt, og det skal vi også. Vi forstår hvordan en startup fungerer — fra de første kundene til man begynner å tenke på vekst og investorer. Du bygger produktet, vi holder styr på alt rundt det." },
    { icon: Building2, name: "Eiendom & Utvikling", tagline: "Oversikt fra kjøp til salg", desc: "Enten du eier én leilighet eller en hel portefølje, hjelper vi deg å holde full kontroll. Vi sørger for at du til enhver tid vet hva du tjener, hva det koster, og hvordan du kan gjøre det smartere." },
    { icon: Landmark, name: "Holding & Investering", tagline: "Strukturen som beskytter deg", desc: "Mange som investerer i aksjer, eiendom eller andre selskaper oppdager fort at det fort blir komplisert å holde orden. Vi hjelper deg å bygge en ryddig og trygg struktur — slik at pengene dine er godt ivaretatt." },
    { icon: Briefcase, name: "Consulting & Rådgivning", desc: "Konsulenter jobber gjerne alene eller i små team, og hverdagen er full av prosjekter, kunder og fakturering. Vi tar oss av alt det administrative, slik at du kan bruke tiden din på det du faktisk er god på.", tagline: "Mer tid til det du er best på" },
    { icon: Tractor, name: "Landbruk", tagline: "Vi kjenner gårdens rytme", desc: "Landbruk er en bransje med sin helt egen hverdag — sesongsvingninger, dyr, maskiner og støtteordninger. Vi kjenner til hva som gjelder for bønder og sørger for at du aldri går glipp av det du har krav på." },
    { icon: ShoppingCart, name: "Varehandel", tagline: "Alltid kontroll på varene og pengene", desc: "Butikk er mer enn salg — det handler om innkjøp, lager, svinn og marginer. Vi hjelper deg å forstå hva som faktisk lønner seg å selge, og gir deg et klart bilde av hvordan bedriften din går." },
    { icon: HardHat, name: "Bygg & Anlegg", tagline: "Vi holder orden mens du bygger", desc: "Bygg- og anleggsbransjen er avhengig av at prosjekter går i pluss og at alt er på stell. Vi hjelper deg å ha god oversikt over hvert enkelt prosjekt, slik at du alltid vet om du tjener penger eller ikke." },
    { icon: Store, name: "Nettbutikk & E-commerce", tagline: "Skalér trygt — vi har ryggen din", desc: "Å drive nettbutikk kan vokse raskt, og det kan fort bli kaotisk. Vi hjelper deg å holde styr på inntekter, avgifter og kostnader — uansett om du selger til norske eller utenlandske kunder." },
    { icon: Heart, name: "Helse & Velvære", tagline: "Fokuser på menneskene du hjelper", desc: "Klinikker, treningssentre og helseforetak har nok å tenke på med kunder og pasienter. Vi ordner det økonomiske i bakgrunnen, slik at du kan gi full oppmerksomhet til dem du er der for." },
    { icon: TrendingUp, name: "Restaurant & Uteliv", tagline: "Vi hjelper deg å holde hjulene i gang", desc: "Restaurant og café er en bransje der marginene kan være tynne og hverdagen er hektisk. Vi gir deg god oversikt over driften, slik at du kan ta bedre beslutninger — og sove litt bedre om natten." },
    { icon: Users, name: "Frisør & Skjønnhet", tagline: "Mer tid bak stolen, ikke ved skrivebordet", desc: "Frisører og andre i skjønnhetsbransjen er eksperter på sitt håndverk — men trenger ikke å bli eksperter på regnskap. Det tar vi oss av, fra A til Å." },
    { icon: Zap, name: "Håndverkere & Fagfolk", tagline: "Fagmann på jobb, vi tar resten", desc: "Enten du er elektriker, rørlegger, maler eller tømrer — vi vet at du vil bruke dagene ute hos kunder, ikke ved skrivebordet. Vi sørger for at alt det administrative er i orden mens du gjør jobben din." },
  ];

  const services = [
    { icon: Users, title: "Dedikert regnskapsfører", desc: "Ingen chatbot. Ingen callsenter. Du får én fast regnskapsfører som kjenner selskapet ditt like godt som du gjør. Alltid tilgjengelig. Alltid oppdatert." },
    { icon: Bot, title: "AI som et verktøy for deg", desc: "Vi bruker AI til å forenkle og effektivisere prosessene rundt regnskap og økonomi — slik at hverdagen blir enklere for deg som kunde. Teknologien jobber i bakgrunnen, så du slipper å tenke på det." },
    { icon: FileCheck, title: "Komplett regnskapsføring", desc: "Bokføring, årsregnskap, skattemelding, aksjonærregisteroppgave og mva-rapportering — alt inkludert. De fleste konkurrenter har skjulte priser og tilleggskostnader du ikke ser før fakturaen kommer. Hos oss er alt i fastprisen fra dag én." },
    { icon: Calculator, title: "Lønn & HR", desc: "Full lønnskjøring, feriepengeberegning, A-melding og arbeidsgiveravgift. Andre regnskapssystemer tar ekstra for dette. Hos oss er det inkludert." },
    { icon: BarChart3, title: "Sanntidsdashbord", desc: "Se likviditet, resultat og balanse oppdatert i sanntid. Ikke vent til neste månedsrapport for å ta beslutninger — se alt akkurat nå." },
    { icon: Shield, title: "Skatteoptimalisering", desc: "Kvartalsvis gjennomgang av skatteposisjonen din. Vi finner fradragene du ikke visste eksisterte og strukturerer selskapet for minimal, lovlig skatt." },
    { icon: Lock, title: "Revisjonstøtte & compliance", desc: "Vi forbereder alt for revisor, håndterer Brønnøysund-rapportering og sikrer at selskapet ditt alltid er compliant. Spar titusener i revisjonskostnader." },
    { icon: Clock, title: "Frister? Vårt ansvar.", desc: "Aldri bekymre deg for mva-fristen, skattemeldingsfristen eller årsregnskapet igjen. Vi leverer alt — i tide, hver gang. Du sover godt om natten." },
    { icon: Headphones, title: "Rådgivning inkludert", desc: "Utbytte, kapitalforhøyelse, lån, fusjoner, fisjoner, exit — spør oss om hva som helst. Autorisert rådgivning er ikke et tillegg. Det er standard." },
  ];

  const testimonials = [
    {
      quote: "Vi byttet fra et tradisjonelt byrå. Etter tre måneder hadde Avargo spart oss 340 000 kr i skatt vi ikke visste vi betalte for mye av. Regnskapsføreren vår ringer oss med innsikt — vi trenger aldri ringe dem.",
      author: "CEO, Nordisk SaaS-selskap",
      metric: "340K",
      label: "spart i skatt",
    },
    {
      quote: "Likviditetsprediksjonen deres varslet oss om en krise 11 uker før den slo inn. Vi hadde tid til å handle. Konkurrenten vår gikk under i samme kvartal.",
      author: "CFO, Eiendomskonsern Oslo",
      metric: "11 uker",
      label: "tidlig varsling",
    },
    {
      quote: "Den forrige regnskapsføreren vår håndterte det billig, men da vi vokste trengte vi noen som faktisk forsto vekststrategi. Avargo erstattet tre leverandører med ett dashbord og én dedikert rådgiver.",
      author: "Grunnlegger, Tech-holding",
      metric: "3→1",
      label: "leverandører",
    },
    {
      quote: "Regnskapsføreren vår hos Avargo forstår landbruk. Han vet hva en kvote er, hva et jordbruksfradrag er, og hva sesongvariasjon gjør med likviditeten. Det er unikt.",
      author: "Eier, Gårdsbruk i Trøndelag",
      metric: "100%",
      label: "bransjekunnskap",
    },
  ];

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/70 to-background" />
          <div className="absolute inset-0 ambient-glow" />
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl mx-auto"
          >
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-xs tracking-[0.4em] uppercase text-muted-foreground mb-12"
            >
              AI-drevet regnskap · Dedikert regnskapsfører · Alle bransjer
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="font-heading text-6xl md:text-8xl leading-[1.05] mb-8"
            >
              Regnskapet ditt
              <br />
              <span className="text-gradient-rose italic">fortjener bedre.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="text-lg text-muted-foreground max-w-xl mx-auto mb-6 leading-relaxed font-light"
            >
              Andre gir deg et system og lar deg klare deg selv. Vi gir deg en dedikert, autorisert regnskapsfører — forsterket av AI som ser det ingen andre ser. Alt inkludert. Ingen overraskelser.
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.8 }}
              className="text-sm text-primary/80 italic mb-14 font-light"
            >
              Spørsmålet er ikke om du har råd til Avargo. Spørsmålet er om du har råd til å fortsette uten.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-16"
            >
              <Link
                to="/kontakt"
                className="group inline-flex items-center gap-3 px-10 py-4 bg-primary text-primary-foreground text-sm font-medium tracking-wider rounded-full glow-rose hover:scale-[1.02] transition-all duration-500"
              >
                Søk om klientstatus
                <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
              </Link>
              <Link
                to="/priser"
                className="inline-flex items-center gap-2 px-10 py-4 text-sm text-foreground/60 tracking-wider rounded-full border border-border/30 hover:border-primary/30 hover:text-foreground transition-all duration-500"
              >
                Se hva det gir tilbake
              </Link>
            </motion.div>

            <LiveCounter />
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="w-px h-12 bg-gradient-to-b from-primary/40 to-transparent" />
        </motion.div>
      </section>

      {/* THE HOOK */}
      <section className="py-32 md:py-40 relative">
        <div className="absolute inset-0 ambient-glow opacity-60" />
        <div className="container mx-auto px-6 relative">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-heading text-4xl md:text-6xl leading-snug mb-10">
                Hvert minutt du bruker på regnskap er et minutt du{" "}
                <span className="italic text-gradient-teal">ikke bruker på å bygge</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-xl mx-auto font-light mb-8">
                Andre ga deg et system og sa "lykke til". Noen ga deg en regnskapsfører til lav pris — men uten AI, uten strategi, uten alt du faktisk trenger. Hvem gir deg helheten?
              </p>
              <p className="text-primary/90 text-lg font-heading italic">
                Det gjør vi. Og bare vi.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <div className="container mx-auto px-6"><div className="line-accent" /></div>

      {/* SERVICES — what we actually do */}
      <section id="tjenester" className="py-32 md:py-40">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <p className="text-xs tracking-[0.4em] uppercase text-secondary mb-6">Alt inkludert</p>
            <h2 className="font-heading text-4xl md:text-6xl mb-8 max-w-4xl leading-snug">
              Andre selger deg deler.{" "}
              <span className="italic text-gradient-rose">Vi gir deg helheten.</span>
            </h2>
            <p className="text-muted-foreground text-lg font-light leading-relaxed max-w-2xl mb-6">
              Hos Avargo får du en dedikert, autorisert regnskapsfører som kjenner bransjen din — forsterket av AI-verktøy som oppdager muligheter og risiko du ikke ser selv. Dette er ikke et regnskapssystem. Det er en vekstpartner.
            </p>
            <p className="text-sm text-muted-foreground/60 font-light mb-20">
              Andre tilbyr regnskapsfører til lav pris, men mangler mva-rapportering, lønn, revisjonstøtte og kryptovaluta. Noen gir deg et verktøy — uten noen til å bruke det for deg. Hos Avargo er <em>alt</em> inkludert fra dag én.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-6">
            {services.map((srv, i) => (
              <AnimatedSection key={srv.title} delay={i * 0.06}>
                <div className="group p-8 glass rounded-3xl card-lift h-full relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="flex items-start gap-5">
                    <div className="p-3 bg-muted/50 rounded-2xl shrink-0">
                      <srv.icon size={20} className="text-primary" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="font-heading text-xl mb-2">{srv.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed font-light">{srv.desc}</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6"><div className="line-accent" /></div>

      {/* INDUSTRIES */}
      <section id="bransjer" className="py-32 md:py-40 relative">
        <div className="absolute inset-0 ambient-glow opacity-40" />
        <div className="container mx-auto px-6 relative">
          <AnimatedSection>
            <p className="text-xs tracking-[0.4em] uppercase text-secondary mb-6">Noen av våre spesialfelt</p>
            <h2 className="font-heading text-4xl md:text-6xl mb-6 max-w-4xl leading-snug">
              Vi kjenner bransjen din.{" "}
              <span className="italic text-gradient-rose">Ikke bare tallene.</span>
            </h2>
            <p className="text-muted-foreground text-lg font-light mb-6 max-w-2xl">
              Uansett hvilken bransje du er i, møter du noen hos oss som forstår hverdagen din — ikke bare tallene i regnskapet. Vi jobber med alt fra teknologiselskaper og bønder til frisører og håndverkere. Dette er noen av bransjene vi brenner for.
            </p>
            <p className="text-sm text-primary/70 italic font-light mb-20">
              Driver du i en bransje du ikke ser her? Ring oss — vi tilpasser oss raskt.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 xl:grid-cols-4 gap-6">
            {industries.map((ind, i) => (
              <AnimatedSection key={ind.name} delay={i * 0.05}>
                <div className="group p-8 glass rounded-3xl card-lift relative overflow-hidden h-full">
                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-secondary/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="p-3 bg-muted/50 rounded-2xl inline-block mb-5">
                    <ind.icon size={20} className="text-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-heading text-xl mb-1">{ind.name}</h3>
                  <p className="text-sm text-primary/70 italic mb-4">{ind.tagline}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed font-light">{ind.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection delay={0.5}>
            <div className="mt-12 p-8 glass rounded-3xl text-center">
              <p className="text-muted-foreground font-light">
                Er bransjen din ikke på listen? <span className="text-foreground">Vi tar på oss alle typer bedrifter.</span> Ta kontakt — vi setter oss raskt inn i din hverdag og tilpasser tjenesten til deg.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="py-32 md:py-40 border-y border-border/15">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <div className="text-center mb-20">
              <p className="text-xs tracking-[0.4em] uppercase text-secondary mb-6">Resultater</p>
              <h2 className="font-heading text-4xl md:text-6xl">
                De byttet. <span className="italic text-gradient-rose">De angrer ikke.</span>
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((t, i) => (
              <AnimatedSection key={i} delay={i * 0.12}>
                <div className="p-10 glass rounded-3xl h-full flex flex-col card-lift">
                  <div className="mb-6">
                    <span className="font-heading text-5xl text-gradient-rose">{t.metric}</span>
                    <p className="text-xs text-muted-foreground tracking-widest uppercase mt-1">{t.label}</p>
                  </div>
                  <p className="text-foreground/75 leading-relaxed mb-8 flex-1 font-light">"{t.quote}"</p>
                  <p className="text-xs text-muted-foreground tracking-wide">{t.author}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 md:py-40 relative">
        <div className="absolute inset-0 ambient-glow" />
        <div className="container mx-auto px-6 text-center relative">
          <AnimatedSection>
            <div className="max-w-2xl mx-auto">
              <p className="text-xs tracking-[0.4em] uppercase text-secondary mb-8">Gratis · Verdi 5 000 kr</p>
              <h2 className="font-heading text-4xl md:text-6xl mb-8 leading-snug">
                Hvor mye penger <span className="italic text-gradient-rose">blør selskapet ditt</span> akkurat nå?
              </h2>
              <p className="text-muted-foreground text-lg font-light mb-6 leading-relaxed max-w-lg mx-auto">
                Bestill en gratis finansiell helse-sjekk. Vi avdekker skjulte fradrag, ineffektive strukturer og tapte muligheter. De fleste klientene våre finner seks-sifrede besparelser.
              </p>
              <p className="text-sm text-primary/70 italic font-light mb-12">
                Helt uforpliktende. Men vanskelig å si nei etter du har sett tallene.
              </p>
              <Link
                to="/kontakt"
                className="group inline-flex items-center gap-3 px-12 py-5 bg-primary text-primary-foreground text-sm font-medium tracking-wider rounded-full glow-rose hover:scale-[1.02] transition-all duration-500"
              >
                Bestill gratis analyse
                <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
};

export default Index;
