import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ArrowRight, Megaphone, ChevronRight, ArrowLeft, CheckCircle2, Target } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import ambientTexture4 from "@/assets/ambient-texture-4.jpg";

const deliverables = [
  "Finne ut hvem annonsene skal vises til",
  "Lage annonser med bilder, video eller karuseller",
  "Teste ulike annonser for å finne den beste",
  "Vise annonser til folk som allerede har vist interesse",
  "Sette opp måling av resultater",
  "Styre budsjettet slik at pengene brukes smart",
  "Forbedre annonsene løpende",
  "Månedlig rapport med hva som fungerer",
];

const approach = [
  { num: "01", title: "Vi finner de riktige menneskene.", desc: "Vi bruker data til å finne folk som faktisk er interessert i det du tilbyr — basert på hva de liker, hva de gjør på nett og hvem som ligner på dine beste kunder." },
  { num: "02", title: "Annonser som fanger oppmerksomhet.", desc: "Folk scroller fort. Annonsene må stoppe dem. Vi lager innhold som fanger blikket, forteller hva du tilbyr og får folk til å ta kontakt." },
  { num: "03", title: "Vi tester og forbedrer hele tiden.", desc: "Vi prøver ulike versjoner av annonsene og bruker mer penger på det som fungerer best. Slik får du mest mulig igjen for budsjettet." },
  { num: "04", title: "Vi ser på hva som faktisk gir penger inn.", desc: "Det handler ikke om likes og visninger — det handler om at annonsene gir deg flere kunder og mer salg. Det er det vi måler." },
];

const RelatedServices = [
  { label: "Annonser på Google", href: "/tjenester/google-ads" },
  { label: "Nettsider", href: "/tjenester/nettsider" },
  { label: "Bli funnet på Google", href: "/tjenester/seo" },
];

const MetaAnnonser = () => (
  <>
    <Helmet>
      <title>Annonser på Facebook og Instagram | Avargo</title>
      <meta name="description" content="Vi lager og styrer annonser på Facebook og Instagram som gir deg flere kunder. Du bestemmer budsjettet — vi sørger for at pengene brukes smart." />
      <link rel="canonical" href="https://avargo.no/tjenester/meta-annonser" />
    </Helmet>
    <section className="py-28 md:py-44 relative overflow-hidden">
      <img src={ambientTexture4} alt="" aria-hidden="true" loading="eager" className="absolute inset-0 w-full h-full object-cover opacity-[0.08] pointer-events-none select-none" />
      <div className="absolute inset-0 ambient-glow opacity-30" />
      <div className="container mx-auto px-4 md:px-6 relative">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} className="max-w-4xl">
          <Link to="/tjenester" className="inline-flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase text-muted-foreground/50 hover:text-foreground transition-colors mb-8 md:mb-12">
            <ArrowLeft size={12} /> Alle tjenester
          </Link>
          <p className="text-[10px] tracking-[0.45em] uppercase text-primary mb-5 md:mb-6">Markedsføring & Vekst</p>
          <h1 className="font-heading text-5xl sm:text-6xl md:text-8xl leading-[1.02] mb-8 md:mb-10">
            Annonser på Facebook og Instagram.{" "}
            <span className="italic text-gradient-rose">Som faktisk gir resultater.</span>
          </h1>
          <p className="text-base md:text-xl text-muted-foreground font-light leading-relaxed max-w-2xl mb-10 md:mb-14">
            Vi lager annonser som treffer de riktige menneskene — de som faktisk er interessert i det du selger. Du får flere henvendelser, flere kunder og mer salg.
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
              <span className="italic text-gradient-rose">du godkjenner.</span>
            </h2>
            <p className="text-muted-foreground font-light leading-relaxed text-sm md:text-base">
              Vi finner ut hvem annonsene skal vises til, lager innholdet, styrer budsjettet og forbedrer resultatene. Du trenger bare å si ja.
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
          <p className="text-[10px] tracking-[0.4em] uppercase text-secondary mb-5 md:mb-6">Slik jobber vi</p>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-14 md:mb-20 max-w-2xl leading-snug">Annonser som gir mer igjen enn de koster.</h2>
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
            <Target size={18} className="text-primary" strokeWidth={1.5} />
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-5 leading-snug max-w-2xl mx-auto">
            Klar for annonser som faktisk gir kunder?
          </h2>
          <p className="text-muted-foreground font-light mb-10 max-w-md mx-auto text-sm">
            Ta en prat med oss — vi viser deg hva vi kan gjøre med budsjettet ditt.
          </p>
          <Link to="/kontakt" className="group inline-flex items-center gap-3 px-10 md:px-12 py-4 md:py-5 bg-primary text-primary-foreground text-sm font-medium tracking-wider rounded-full glow-rose hover:scale-[1.02] transition-all duration-500">
            Book en samtale <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
          </Link>
        </AnimatedSection>
      </div>
    </section>
  </>
);

export default MetaAnnonser;
