import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, TrendingUp, Shield, Zap, Globe, Building2, Briefcase, Landmark,
  Tractor, ShoppingCart, HardHat, Heart, Store, Users, BarChart3, Bot,
  FileCheck, CreditCard, Calculator, Clock, Lock, Headphones,
  LayoutTemplate, Search, Megaphone, CheckCircle2, ChevronLeft, ChevronRight
} from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import TaxDeadlineWidget from "@/components/TaxDeadlineWidget";
import heroBg from "@/assets/hero-bg.jpg";
import serviceBg1 from "@/assets/service-bg-1.jpg";
import serviceBg2 from "@/assets/service-bg-2.jpg";
import serviceBg3 from "@/assets/service-bg-3.jpg";
import serviceBg4 from "@/assets/service-bg-4.jpg";
import serviceBg5 from "@/assets/service-bg-5.jpg";

const Index = () => {
  const industries = [
    { icon: Globe, name: "Tech & SaaS", slug: "tech-saas", tagline: "Vi vokser i takt med deg", desc: "Startups og tech-selskaper trenger en regnskapsfører som forstår vekst, investorer og SaaS-modeller. Det gjør vi." },
    { icon: Building2, name: "Eiendom & Utvikling", slug: "eiendom", tagline: "Oversikt fra kjøp til salg", desc: "Full kontroll over eiendomsporteføljen din — hva du tjener, hva det koster og hvordan du kan gjøre det smartere." },
    { icon: Landmark, name: "Holding & Investering", slug: "holding", tagline: "Strukturen som beskytter deg", desc: "Vi hjelper deg å bygge en ryddig og trygg struktur for aksjer, eiendom og andre investeringer." },
    { icon: Briefcase, name: "Consulting & Rådgivning", slug: "consulting", desc: "Vi tar oss av det administrative, slik at du kan bruke tiden din på det du faktisk er god på.", tagline: "Mer tid til det du er best på" },
    { icon: Tractor, name: "Landbruk", slug: "landbruk", tagline: "Vi kjenner gårdens rytme", desc: "Sesongsvingninger, støtteordninger og maskinpark — vi sørger for at du aldri går glipp av det du har krav på." },
    { icon: ShoppingCart, name: "Varehandel", slug: "varehandel", tagline: "Kontroll på varene og pengene", desc: "Vi hjelper deg å forstå hva som lønner seg å selge og gir deg et klart bilde av driften." },
    { icon: HardHat, name: "Bygg & Anlegg", slug: "bygg-anlegg", tagline: "Vi holder orden mens du bygger", desc: "God oversikt over hvert prosjekt, slik at du alltid vet om du tjener penger." },
    { icon: Store, name: "Nettbutikk & E-commerce", slug: "nettbutikk", tagline: "Skalér trygt", desc: "Styr på inntekter, avgifter og kostnader — uansett om du selger til Norge eller utlandet." },
    { icon: Heart, name: "Helse & Velvære", slug: "helse", tagline: "Fokuser på menneskene", desc: "Vi ordner det økonomiske i bakgrunnen mens du gir full oppmerksomhet til dem du er der for." },
    { icon: TrendingUp, name: "Restaurant & Uteliv", slug: "restaurant", tagline: "Hjulene i gang", desc: "God oversikt over driften slik at du kan ta bedre beslutninger og sove litt bedre om natten." },
    { icon: Users, name: "Frisør & Skjønnhet", slug: "frisor", tagline: "Mer tid bak stolen", desc: "Du er ekspert på ditt håndverk — vi tar oss av regnskapet fra A til Å." },
    { icon: Zap, name: "Håndverkere & Fagfolk", slug: "handverkere", tagline: "Fagmann på jobb, vi tar resten", desc: "Vi sørger for at alt det administrative er i orden mens du gjør jobben din." },
  ];

  // Show 3 industries at a time, rotating every 10 seconds
  const [industryPage, setIndustryPage] = useState(0);
  const industriesPerPage = 3;
  const totalPages = Math.ceil(industries.length / industriesPerPage);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setIndustryPage((prev) => (prev + 1) % totalPages);
    }, 10000);
    return () => clearInterval(timer);
  }, [totalPages]);

  const visibleIndustries = industries.slice(
    industryPage * industriesPerPage,
    industryPage * industriesPerPage + industriesPerPage
  );

  const serviceBgs = [serviceBg1, serviceBg2, serviceBg3, serviceBg4, serviceBg5, serviceBg1, serviceBg2, serviceBg3, serviceBg4];
  const services = [
    { icon: Users, title: "Dedikert regnskapsfører", desc: "Du får én fast person som kjenner selskapet ditt godt. Alltid tilgjengelig, alltid oppdatert — ingen ventelinjer eller chatboter.", href: "/tjenester/regnskapsforer" },
    { icon: Calculator, title: "Lønn & HR", desc: "Full lønnskjøring, feriepenger, A-melding og arbeidsgiveravgift. Alt er inkludert i fastprisen — uten skjulte kostnader.", href: "/tjenester/hr" },
    { icon: LayoutTemplate, title: "Nettsider & markedsføring", desc: "Moderne nettsider, SEO, Google Ads og sosiale medier — alt koblet til de faktiske tallene dine for smartere vekst.", href: "/tjenester/nettsider" },
    { icon: Bot, title: "AI-drevet innsikt", desc: "Vi bruker AI til å oppdage fradrag, risiko og muligheter du ikke ser selv — slik at du alltid ligger et steg foran.", href: "/tjenester/ai-innsikt" },
    { icon: FileCheck, title: "Alt inkludert i regnskapet", desc: "Bokføring, årsregnskap, skattemelding, MVA-rapportering og aksjonærregisteroppgave. Hos oss er ingenting «ekstra».", href: "/tjenester/en-til-en-regnskap" },
    { icon: Shield, title: "Skatteoptimalisering", desc: "Kvartalsvis gjennomgang av skatteposisjonen din. Vi finner fradragene du ikke visste om og strukturerer selskapet smart.", href: "/tjenester/cfo" },
    { icon: Search, title: "SEO & søkbarhet", desc: "Bli synlig på Google med strategisk søkemotoroptimalisering som bygger langsiktig organisk trafikk til bedriften din.", href: "/tjenester/seo" },
    { icon: Headphones, title: "Rådgivning inkludert", desc: "Utbytte, kapitalforhøyelse, fusjoner — spør oss om hva som helst. Rådgivning er standard hos Avargo, ikke et tillegg.", href: "/tjenester/cfo" },
    { icon: Clock, title: "Frister? Vårt ansvar.", desc: "MVA-frist, skattemelding, årsregnskap — vi leverer alt i tide, hver gang. Du trenger aldri bekymre deg for en frist igjen.", href: "/tjenester/regnskapsforer" },
  ];

  // Services carousel — one at a time
  const [activeService, setActiveService] = useState(0);
  const [serviceAutoplay, setServiceAutoplay] = useState(true);

  useEffect(() => {
    if (!serviceAutoplay) return;
    const timer = setInterval(() => {
      setActiveService((prev) => (prev + 1) % services.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [serviceAutoplay, services.length]);

  const goToService = useCallback((index: number) => {
    setActiveService(index);
    setServiceAutoplay(false);
    // Resume autoplay after 15s of inactivity
    setTimeout(() => setServiceAutoplay(true), 15000);
  }, []);

  const nextService = useCallback(() => {
    goToService((activeService + 1) % services.length);
  }, [activeService, services.length, goToService]);

  const prevService = useCallback(() => {
    goToService((activeService - 1 + services.length) % services.length);
  }, [activeService, services.length, goToService]);

  const current = services[activeService];
  const CurrentIcon = current.icon;

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="Avargo kontorlandskap" className="w-full h-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/70 to-background" />
          <div className="absolute inset-0 ambient-glow" />
        </div>

        <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
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
              className="text-[11px] md:text-xs tracking-[0.3em] md:tracking-[0.4em] uppercase text-foreground/60 mb-8 md:mb-12"
            >
              Regnskap · Rådgivning · Markedsføring · Alt i ett
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="font-heading text-5xl sm:text-6xl md:text-8xl leading-[1.05] mb-6 md:mb-8"
            >
              Regnskapet ditt
              <br />
              <span className="text-gradient-rose italic">fortjener bedre.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="text-base md:text-lg text-foreground/70 max-w-xl mx-auto mb-5 md:mb-6 leading-relaxed font-light"
            >
              Du får en fast, autorisert regnskapsfører som kjenner selskapet ditt — forsterket av AI som ser det ingen andre ser. Regnskap, rådgivning og markedsføring. Alt inkludert. Ingen overraskelser.
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.8 }}
              className="text-sm text-primary italic mb-10 md:mb-14 font-light"
            >
              Fra 1 499 kr/mnd for nyoppstartede selskaper.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-5 mb-12 md:mb-16"
            >
              <Link
                to="/kontakt"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 md:px-10 py-4 bg-primary text-primary-foreground text-sm font-medium tracking-wider rounded-full glow-rose hover:scale-[1.02] transition-all duration-500"
              >
                Kom i gang
                <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
              </Link>
              <Link
                to="/priser"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 md:px-10 py-4 text-sm text-foreground/80 tracking-wider rounded-full border border-border/40 hover:border-primary/30 hover:text-foreground transition-all duration-500"
              >
                Se prisene
              </Link>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="absolute bottom-8 md:bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="w-px h-10 md:h-12 bg-gradient-to-b from-primary/40 to-transparent" />
        </motion.div>
      </section>

      {/* MARQUEE BANDS */}
      <div className="relative py-8 md:py-10 border-y border-border/15 overflow-hidden select-none">
        <div className="absolute inset-0 ambient-glow opacity-30" />
        <div className="relative flex overflow-hidden mb-4 md:mb-5">
          <div className="flex shrink-0 animate-marquee gap-10 md:gap-12 pr-10 md:pr-12">
            {[...services, ...services].map((s, i) => (
              <div key={i} className="flex items-center gap-2 md:gap-3 whitespace-nowrap">
                <s.icon size={12} className="text-primary/60 shrink-0" strokeWidth={1.5} />
                <span className="text-[10px] md:text-[11px] tracking-[0.2em] md:tracking-[0.25em] uppercase text-foreground/60 font-light">{s.title}</span>
                <span className="text-primary/30 mx-2 md:mx-3">·</span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative flex overflow-hidden">
          <div className="flex shrink-0 animate-marquee-reverse gap-10 md:gap-12 pr-10 md:pr-12">
            {[...industries, ...industries].map((ind, i) => (
              <div key={i} className="flex items-center gap-2 md:gap-3 whitespace-nowrap">
                <ind.icon size={12} className="text-secondary/60 shrink-0" strokeWidth={1.5} />
                <span className="text-[10px] md:text-[11px] tracking-[0.2em] md:tracking-[0.25em] uppercase text-foreground/60 font-light">{ind.name}</span>
                <span className="text-secondary/30 mx-2 md:mx-3">·</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* THE HOOK */}
      <section className="py-24 md:py-40 relative">
        <div className="absolute inset-0 ambient-glow opacity-60" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-heading text-3xl sm:text-4xl md:text-6xl leading-snug mb-8 md:mb-10">
                Hvert minutt du bruker på regnskap er et minutt du{" "}
                <span className="italic text-gradient-teal">ikke bruker på å bygge</span>
              </h2>
              <p className="text-foreground/70 text-base md:text-lg leading-relaxed max-w-xl mx-auto font-light mb-6 md:mb-8">
                De fleste bedriftseiere bruker timer hver uke på fakturering, bilag og oppfølging — tid som burde gått til kunder, salg og utvikling. Med Avargo slipper du alt det.
              </p>
              <p className="text-primary text-lg font-heading italic">
                Vi tar regnskapet. Du tar veksten.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6"><div className="line-accent" /></div>

      {/* SERVICES — immersive fullwidth carousel */}
      <section id="tjenester" className="relative overflow-hidden">
        {/* Background image with crossfade */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`bg-${activeService}`}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <img
              src={serviceBgs[activeService]}
              alt=""
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/80" />

        {/* Click zones — left half prev, right half next (invisible) */}
        <div
          className="absolute inset-y-0 left-0 w-1/2 z-20 cursor-w-resize"
          onClick={prevService}
        />
        <div
          className="absolute inset-y-0 right-0 w-1/2 z-20 cursor-e-resize"
          onClick={nextService}
        />

        <div className="relative z-10 py-24 md:py-40">
          <div className="container mx-auto px-4 md:px-6">
            <AnimatedSection>
              <p className="text-xs tracking-[0.4em] uppercase text-secondary mb-5 md:mb-6">Alt inkludert</p>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-6xl mb-6 md:mb-8 max-w-4xl leading-snug">
                Én fast pris.{" "}
                <span className="italic text-gradient-rose">Alt du trenger.</span>
              </h2>
            </AnimatedSection>

            {/* Active service content */}
            <div className="max-w-2xl relative z-30 pointer-events-none">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeService}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-4 bg-primary/15 backdrop-blur-sm rounded-2xl border border-primary/10">
                      <CurrentIcon size={28} className="text-primary" strokeWidth={1.5} />
                    </div>
                    <span className="font-heading text-6xl md:text-7xl text-primary/15 select-none">
                      {String(activeService + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="font-heading text-3xl md:text-5xl mb-4 md:mb-6">
                    {current.title}
                  </h3>

                  <p className="text-foreground/80 text-base md:text-lg leading-relaxed font-light mb-8 md:mb-10 max-w-lg">
                    {current.desc}
                  </p>

                  <Link
                    to={current.href}
                    className="pointer-events-auto group inline-flex items-center gap-3 px-8 py-3.5 bg-primary/10 backdrop-blur-sm border border-primary/20 text-primary text-sm tracking-wider rounded-full hover:bg-primary/20 transition-all duration-500"
                  >
                    Les mer
                    <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Minimal progress dots at bottom */}
            <div className="flex items-center gap-1.5 mt-16 md:mt-20">
              {services.map((_, i) => (
                <div
                  key={i}
                  className={`rounded-full transition-all duration-500 ${
                    i === activeService
                      ? "w-8 h-1.5 bg-primary"
                      : "w-1.5 h-1.5 bg-foreground/20"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-border/10 z-30">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-rose-glow"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: serviceAutoplay ? 5 : 0, ease: "linear" }}
            key={`progress-${activeService}-${serviceAutoplay}`}
          />
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6"><div className="line-accent" /></div>

      {/* INDUSTRIES — rotating 3 at a time */}
      <section id="bransjer" className="py-24 md:py-40 relative">
        <div className="absolute inset-0 ambient-glow opacity-40" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <AnimatedSection>
            <p className="text-xs tracking-[0.4em] uppercase text-secondary mb-5 md:mb-6">Bransjer vi dekker</p>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-6xl mb-5 md:mb-6 max-w-4xl leading-snug">
              Vi kjenner bransjen din.{" "}
              <span className="italic text-gradient-rose">Ikke bare tallene.</span>
            </h2>
            <p className="text-foreground/70 text-base md:text-lg font-light mb-4 md:mb-6 max-w-2xl">
              Uansett hva du driver med, møter du en regnskapsfører hos oss som forstår hverdagen din — ikke bare tallene i regnskapet.
            </p>
            <p className="text-sm text-primary/80 italic font-light mb-14 md:mb-20">
              Vi dekker over 25 bransjer. Her er noen av dem.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 min-h-[320px]">
            <AnimatePresence mode="wait">
              {visibleIndustries.map((ind) => (
                <motion.div
                  key={ind.slug + industryPage}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <Link to={`/bransjer/${ind.slug}`} className="group p-6 md:p-8 glass rounded-3xl card-lift relative overflow-hidden h-full block">
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-secondary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="p-2.5 md:p-3 bg-primary/10 rounded-2xl inline-block mb-4 md:mb-5">
                      <ind.icon size={18} className="text-primary" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-heading text-lg md:text-xl mb-1">{ind.name}</h3>
                    <p className="text-sm text-primary/80 italic mb-3">{ind.tagline}</p>
                    <p className="text-sm text-foreground/60 leading-relaxed font-light">{ind.desc}</p>
                    <div className="flex items-center gap-2 text-[11px] tracking-widest uppercase text-primary/70 group-hover:text-primary transition-colors duration-300 mt-4">
                      Les mer <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Page dots */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setIndustryPage(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${i === industryPage ? "bg-primary w-6" : "bg-foreground/20 hover:bg-foreground/40"}`}
              />
            ))}
          </div>

          <AnimatedSection delay={0.3}>
            <div className="mt-8 text-center">
              <Link to="/bransjer" className="text-sm text-primary hover:text-primary/80 transition-colors font-light">
                Se alle {industries.length}+ bransjer vi dekker →
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6"><div className="line-accent" /></div>

      {/* SKATTEFRISTER */}
      <section className="py-24 md:py-40 relative">
        <div className="absolute inset-0 ambient-glow opacity-30" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <AnimatedSection>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 md:gap-12 items-start">
              <div className="lg:col-span-2">
                <p className="text-xs tracking-[0.4em] uppercase text-secondary mb-5 md:mb-6">Alltid oppdatert</p>
                <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-4 md:mb-6 leading-snug">
                  Kommende <span className="italic text-gradient-rose">skattefrister</span>
                </h2>
                <p className="text-foreground/60 text-sm md:text-base font-light leading-relaxed mb-4">
                  Hold deg oppdatert på de viktigste fristene fra Skatteetaten. Vi henter dem automatisk, så du aldri går glipp av en frist.
                </p>
                <p className="text-xs text-primary/80 italic font-light">
                  Kilde: skatteetaten.no — oppdateres i sanntid.
                </p>
              </div>
              <div className="lg:col-span-3">
                <TaxDeadlineWidget limit={6} />
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6"><div className="line-accent" /></div>

      {/* CONVICTION SECTION */}
      <section className="py-24 md:py-40 border-y border-border/15">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection>
            <div className="text-center mb-14 md:mb-20">
              <p className="text-xs tracking-[0.4em] uppercase text-secondary mb-5 md:mb-6">Hvorfor Avargo</p>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-6xl max-w-3xl mx-auto leading-snug">
                De fleste betaler for mye.{" "}
                <span className="italic text-gradient-rose">Og får for lite tilbake.</span>
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {[
              {
                metric: "100%",
                label: "fastpris — ingen tillegg",
                text: "Hos oss er bokføring, MVA, lønn, årsregnskap, skattemelding og rådgivning inkludert i én fast månedspris. Ingen timefakturering. Ingen overraskelser. Du vet alltid hva det koster.",
              },
              {
                metric: "1 person",
                label: "din dedikerte regnskapsfører",
                text: "Du slipper callsenter og tilfeldige saksbehandlere. Du får én navngitt regnskapsfører som lærer seg selskapet ditt, bransjen din og målene dine — og som du kan ringe direkte.",
              },
              {
                metric: "AI-drevet",
                label: "innsikt i sanntid",
                text: "Regnskapsføreren din bruker AI-verktøy som scanner tusenvis av datapunkter. Resultatet? Fradrag du ikke visste om, risiko du ikke hadde sett, og muligheter du ikke hadde oppdaget.",
              },
              {
                metric: "24 timer",
                label: "responstid, alltid",
                text: "Når du sender en melding eller ringer, svarer vi innen 24 timer. Alltid. Fordi god rådgivning handler om tilgjengelighet — ikke bare kompetanse.",
              },
            ].map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.12}>
                <div className="p-8 md:p-10 glass rounded-3xl h-full flex flex-col card-lift">
                  <div className="mb-5 md:mb-6">
                    <span className="font-heading text-4xl md:text-5xl text-gradient-rose">{item.metric}</span>
                    <p className="text-xs text-foreground/50 tracking-widest uppercase mt-1">{item.label}</p>
                  </div>
                  <p className="text-foreground/70 leading-relaxed flex-1 font-light text-sm md:text-base">{item.text}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-40 relative">
        <div className="absolute inset-0 ambient-glow" />
        <div className="container mx-auto px-4 md:px-6 text-center relative">
          <AnimatedSection>
            <div className="max-w-2xl mx-auto">
              <p className="text-xs tracking-[0.4em] uppercase text-secondary mb-6 md:mb-8">Gratis gjennomgang</p>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-6xl mb-6 md:mb-8 leading-snug">
                Betaler du for mye <span className="italic text-gradient-rose">uten å vite det?</span>
              </h2>
              <p className="text-foreground/70 text-base md:text-lg font-light mb-5 md:mb-6 leading-relaxed max-w-lg mx-auto">
                Vi gjennomgår regnskapet ditt gratis og viser deg konkret hva du kan spare — på skatt, kostnader og tid. Helt uforpliktende.
              </p>
              <p className="text-sm text-primary italic font-light mb-10 md:mb-12">
                Én samtale. Konkrete tall. Ingen forpliktelser.
              </p>
              <Link
                to="/kontakt"
                className="group inline-flex items-center gap-3 px-10 md:px-12 py-4 md:py-5 bg-primary text-primary-foreground text-sm font-medium tracking-wider rounded-full glow-rose hover:scale-[1.02] transition-all duration-500"
              >
                Bestill gratis gjennomgang
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
