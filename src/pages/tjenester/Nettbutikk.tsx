import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingCart, ChevronRight, ArrowLeft, CheckCircle2, Package } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import ambientTexture3 from "@/assets/ambient-texture-3.jpg";

const deliverables = [
  "Nettbutikk med Shopify eller WooCommerce",
  "Produktsider som ser bra ut og selger",
  "Enkel og trygg betaling for kundene",
  "Kobling mot lager og regnskapssystem",
  "Raskt og godt på mobil",
  "Enkel navigasjon og søk etter produkter",
  "Automatiske e-poster til kunder som ikke fullførte kjøpet",
  "Oversikt over salg og bestillinger",
];

const approach = [
  { num: "01", title: "Bygget for å selge — ikke bare se bra ut.", desc: "En fin nettbutikk som ingen handler i er bortkastet. Vi bygger med fokus på at det skal være enkelt å finne, velge og betale for produktene dine." },
  { num: "02", title: "Alt henger sammen.", desc: "Nettbutikken kobles til lageret og regnskapet ditt. Når noen handler, oppdateres alt automatisk — ingen manuell jobb for deg." },
  { num: "03", title: "Klar til å vokse.", desc: "Om du selger 10 eller 10 000 produkter — nettbutikken skal fungere like bra. Vi bygger for at den skal holde, uansett hvor fort du vokser." },
  { num: "04", title: "Selger mens du sover.", desc: "Vi setter opp automatiske e-poster og anbefalinger som gjør at kundene handler mer — uten at du trenger å gjøre noe." },
];

const RelatedServices = [
  { label: "Annonser på Facebook og Instagram", href: "/tjenester/meta-annonser" },
  { label: "Annonser på Google", href: "/tjenester/google-ads" },
  { label: "Automatisering og AI", href: "/tjenester/ai-automatisering" },
];

const Nettbutikk = () => (
  <>
    <Helmet>
      <title>Nettbutikk for bedrifter | Avargo</title>
      <meta name="description" content="Vi bygger nettbutikker som gjør det enkelt for kundene å handle hos deg. Fin å se på, enkel å bruke — og klar til å vokse med bedriften din." />
      <link rel="canonical" href="https://avargo.no/tjenester/nettbutikk" />
    </Helmet>
    <section className="py-28 md:py-44 relative overflow-hidden">
      <img src={ambientTexture3} alt="" aria-hidden="true" loading="eager" className="absolute inset-0 w-full h-full object-cover opacity-[0.08] pointer-events-none select-none" />
      <div className="absolute inset-0 ambient-glow opacity-30" />
      <div className="container mx-auto px-4 md:px-6 relative">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} className="max-w-4xl">
          <Link to="/tjenester" className="inline-flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase text-muted-foreground/50 hover:text-foreground transition-colors mb-8 md:mb-12">
            <ArrowLeft size={12} /> Alle tjenester
          </Link>
          <p className="text-[10px] tracking-[0.45em] uppercase text-primary mb-5 md:mb-6">Markedsføring & Vekst</p>
          <h1 className="font-heading text-5xl sm:text-6xl md:text-8xl leading-[1.02] mb-8 md:mb-10">
            Nettbutikk{" "}
            <span className="italic text-gradient-rose">som faktisk selger.</span>
          </h1>
          <p className="text-base md:text-xl text-muted-foreground font-light leading-relaxed max-w-2xl mb-10 md:mb-14">
            Vi bygger en nettbutikk som gjør det enkelt for kundene å handle hos deg. Fin å se på, enkel å bruke — og klar til å vokse med bedriften din.
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
              En komplett nettbutikk —{" "}
              <span className="italic text-gradient-rose">klar til å ta imot bestillinger.</span>
            </h2>
            <p className="text-muted-foreground font-light leading-relaxed text-sm md:text-base">
              Vi lager hele nettbutikken for deg — design, produkter, betaling og frakt. Klar til å selge fra dag én.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.15}>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {deliverables.map((d) => (
                <li key={d} className="flex items-start gap-3 text-sm font-light text-foreground/70">
                  <CheckCircle2 size={14} className="text-primary mt-0.5 shrink-0" strokeWidth={1.5} />
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
          <p className="text-[10px] tracking-[0.4em] uppercase text-secondary mb-5 md:mb-6">Slik bygger vi</p>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-14 md:mb-20 max-w-2xl leading-snug">Nettbutikker som vokser med deg.</h2>
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
            <Package size={18} className="text-primary" strokeWidth={1.5} />
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-5 leading-snug max-w-2xl mx-auto">
            Klar til å selge på nett?
          </h2>
          <p className="text-muted-foreground font-light mb-10 max-w-md mx-auto text-sm">
            Ta en prat med oss — vi forteller deg hva vi kan bygge for bedriften din.
          </p>
          <Link to="/kontakt" className="group inline-flex items-center gap-3 px-10 md:px-12 py-4 md:py-5 bg-primary text-primary-foreground text-sm font-medium tracking-wider rounded-full glow-rose hover:scale-[1.02] transition-all duration-500">
            Book en samtale <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
          </Link>
        </AnimatedSection>
      </div>
    </section>
  </>
);

export default Nettbutikk;
