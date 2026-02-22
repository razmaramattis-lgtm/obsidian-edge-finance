import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ArrowRight, Globe, ChevronRight, ArrowLeft, CheckCircle2, Search } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import ambientTexture1 from "@/assets/ambient-texture-1.jpg";

const deliverables = [
  "Annonser som vises når folk søker på Google",
  "Annonser på nettsider og i apper",
  "Kampanjer som vises flere steder automatisk",
  "Lokale annonser på Google Maps",
  "Finne de beste søkeordene å annonsere på",
  "Styre budsjettet slik at du får mest igjen",
  "Måle hva som faktisk gir resultater",
  "Månedlig rapport med tall og anbefalinger",
];

const approach = [
  { num: "01", title: "Vi er der kunden søker.", desc: "Når noen googler det du tilbyr, dukker du opp øverst. Vi sørger for at annonsene treffer folk akkurat når de leter etter det du selger." },
  { num: "02", title: "Vi kutter det som ikke fungerer.", desc: "Like viktig som å vise annonser til de riktige, er å slutte å vise dem til de gale. Vi fjerner søkeord som sløser bort budsjettet ditt." },
  { num: "03", title: "Vi forbedrer hele tiden.", desc: "Google Ads krever oppfølging. Vi justerer og forbedrer annonsene løpende — ikke bare én gang i måneden." },
  { num: "04", title: "Vi måler hva som gir penger inn.", desc: "Det handler ikke om klikk — det handler om kunder. Vi ser på hva som faktisk gir deg mer omsetning og justerer deretter." },
];

const RelatedServices = [
  { label: "Annonser på Facebook og Instagram", href: "/tjenester/meta-annonser" },
  { label: "Bli funnet på Google", href: "/tjenester/seo" },
  { label: "Nettsider", href: "/tjenester/nettsider" },
];

const GoogleAds = () => (
  <>
    <Helmet>
      <title>Annonser på Google | Google Ads for bedrifter | Avargo</title>
      <meta name="description" content="Vis bedriften din øverst på Google når kundene søker. Vi styrer annonsene og budsjettet — du tar imot kundene." />
      <link rel="canonical" href="https://avargo.no/tjenester/google-ads" />
    </Helmet>
    <section className="py-28 md:py-44 relative overflow-hidden">
      <img src={ambientTexture1} alt="" aria-hidden="true" loading="eager" className="absolute inset-0 w-full h-full object-cover opacity-[0.08] pointer-events-none select-none" />
      <div className="absolute inset-0 ambient-glow opacity-30" />
      <div className="container mx-auto px-4 md:px-6 relative">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} className="max-w-4xl">
          <Link to="/tjenester" className="inline-flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase text-muted-foreground/50 hover:text-foreground transition-colors mb-8 md:mb-12">
            <ArrowLeft size={12} /> Alle tjenester
          </Link>
          <p className="text-[10px] tracking-[0.45em] uppercase text-primary mb-5 md:mb-6">Markedsføring & Vekst</p>
          <h1 className="font-heading text-5xl sm:text-6xl md:text-8xl leading-[1.02] mb-8 md:mb-10">
            Vis deg øverst på Google.{" "}
            <span className="italic text-gradient-teal">Akkurat når kunden søker.</span>
          </h1>
          <p className="text-base md:text-xl text-muted-foreground font-light leading-relaxed max-w-2xl mb-10 md:mb-14">
            Når noen søker etter det du tilbyr på Google, dukker du opp først. Vi styrer annonsene og budsjettet — slik at hver krone gir mest mulig tilbake.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/kontakt" className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 md:px-10 py-4 bg-primary text-primary-foreground text-sm font-medium tracking-wider rounded-full glow-rose hover:scale-[1.02] transition-all duration-500">
              Snakk med oss <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>

    <div className="container mx-auto px-4 md:px-6"><div className="line-accent" /></div>

    <section className="py-24 md:py-40">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-14 md:gap-24 items-start">
          <AnimatedSection>
            <p className="text-[10px] tracking-[0.4em] uppercase text-secondary mb-5">Hva du får</p>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-6 leading-snug">
              Vi tar oss av alt —{" "}
              <span className="italic text-gradient-teal">du tar imot kundene.</span>
            </h2>
            <p className="text-muted-foreground font-light leading-relaxed text-sm md:text-base">
              Vi setter opp annonsene, velger de riktige søkeordene, styrer budsjettet og forbedrer resultatene — slik at du kan fokusere på å drive bedriften.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.15}>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {deliverables.map((d) => (
                <li key={d} className="flex items-start gap-3 text-sm font-light text-foreground/70">
                  <CheckCircle2 size={14} className="text-secondary mt-0.5 shrink-0" strokeWidth={1.5} />
                  {d}
                </li>
              ))}
            </ul>
          </AnimatedSection>
        </div>
      </div>
    </section>

    <section className="py-24 md:py-40 border-y border-border/10 relative">
      <div className="absolute inset-0 ambient-glow opacity-15" />
      <div className="container mx-auto px-4 md:px-6 relative">
        <AnimatedSection>
          <p className="text-[10px] tracking-[0.4em] uppercase text-secondary mb-5 md:mb-6">Slik jobber vi</p>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-14 md:mb-20 max-w-2xl leading-snug">Slik bruker vi budsjettet ditt smart.</h2>
        </AnimatedSection>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
          {approach.map((a, i) => (
            <AnimatedSection key={a.num} delay={i * 0.1}>
              <div className="p-8 md:p-10 glass rounded-3xl card-lift h-full">
                <span className="font-heading text-5xl text-primary/8">{a.num}</span>
                <h3 className="font-heading text-xl md:text-2xl mt-5 mb-3">{a.title}</h3>
                <p className="text-sm text-muted-foreground font-light leading-relaxed">{a.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>

    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <AnimatedSection>
          <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground/50 mb-8">Relaterte tjenester</p>
          <div className="flex flex-wrap gap-3">
            {RelatedServices.map((s) => (
              <Link key={s.href} to={s.href} className="inline-flex items-center gap-2 px-5 py-2.5 text-[12px] tracking-wide text-muted-foreground border border-border/20 rounded-full hover:border-primary/30 hover:text-foreground transition-all duration-300">
                {s.label} <ChevronRight size={11} className="text-primary/40" />
              </Link>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>

    <section className="py-24 md:py-32 border-t border-border/10 text-center relative">
      <div className="absolute inset-0 ambient-glow opacity-25" />
      <div className="container mx-auto px-4 md:px-6 relative">
        <AnimatedSection>
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-8">
            <Search size={18} className="text-primary" strokeWidth={1.5} />
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-5 leading-snug max-w-2xl mx-auto">
            Klar for å bli sett av de som leter etter deg?
          </h2>
          <p className="text-muted-foreground font-light mb-10 max-w-md mx-auto text-sm">
            Vi ser på hva som er mulig i din bransje — og viser deg hva annonsene kan gi.
          </p>
          <Link to="/kontakt" className="group inline-flex items-center gap-3 px-10 md:px-12 py-4 md:py-5 bg-primary text-primary-foreground text-sm font-medium tracking-wider rounded-full glow-rose hover:scale-[1.02] transition-all duration-500">
            Book en samtale <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
          </Link>
        </AnimatedSection>
      </div>
    </section>
  </>
);

export default GoogleAds;
