import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, LayoutTemplate, ChevronRight, ArrowLeft, CheckCircle2, Globe } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

const deliverables = [
  "Framer & custom nettsidebygging",
  "Nettside-redesign og migrering",
  "Responsivt design (mobil, nettbrett, PC)",
  "Landingssider og konverteringsoptimalisering",
  "CMS-integrasjon og innholdsstyring",
  "Hastighetsoptimalisering og Core Web Vitals",
  "SEO-struktur og teknisk fundament",
  "Løpende vedlikehold og oppdateringer",
];

const approach = [
  { num: "01", title: "Strategi før design.", desc: "Vi starter med hva nettsiden skal oppnå — ikke hvordan den skal se ut. Konverteringsmål, målgruppe og budskap definerer designet. Ikke omvendt." },
  { num: "02", title: "Designet for konvertering.", desc: "Vakre nettsider som ikke konverterer er kunst. Vi bygger for resultat: tydelige handlingsoppfordringer, optimalisert flyt og brukeropplevelse som fjerner friksjon." },
  { num: "03", title: "Teknisk fundament som holder.", desc: "Rask lastetid, ren kode og solid infrastruktur betyr at nettsiden din skalerer med selskapet — uten at du trenger å starte fra scratch om to år." },
  { num: "04", title: "Forankret i tallene.", desc: "Som en del av Avargo-familien vet vi hva som driver lønnsomheten. Markedsbudsjettet og nettsidens mål kobles direkte til de finansielle målene dine." },
];

const RelatedServices = [
  { label: "SEO & søkbarhet", href: "/tjenester/seo" },
  { label: "Meta-annonser", href: "/tjenester/meta-annonser" },
  { label: "Google Ads", href: "/tjenester/google-ads" },
];

const Nettsider = () => (
  <>
    <section className="py-28 md:py-44 relative overflow-hidden">
      <div className="absolute inset-0 ambient-glow opacity-30" />
      <div className="container mx-auto px-4 md:px-6 relative">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} className="max-w-4xl">
          <Link to="/tjenester" className="inline-flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase text-muted-foreground/50 hover:text-foreground transition-colors mb-8 md:mb-12">
            <ArrowLeft size={12} /> Alle tjenester
          </Link>
          <p className="text-[10px] tracking-[0.45em] uppercase text-primary mb-5 md:mb-6">Avargo · Tjenester</p>
          <h1 className="font-heading text-5xl sm:text-6xl md:text-8xl leading-[1.02] mb-8 md:mb-10">
            Nettsider som{" "}
            <span className="italic text-gradient-rose">faktisk konverterer.</span>
          </h1>
          <p className="text-base md:text-xl text-muted-foreground font-light leading-relaxed max-w-2xl mb-10 md:mb-14">
            Moderne, raske og strategisk bygget nettsider som kommuniserer merkevaren din med presisjon — og gjør det enkelt for kundene å ta neste steg.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/kontakt" className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 md:px-10 py-4 bg-primary text-primary-foreground text-sm font-medium tracking-wider rounded-full glow-rose hover:scale-[1.02] transition-all duration-500">
              Snakk med oss <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>
            <Link to="/tjenester/seo" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 md:px-10 py-4 text-sm text-foreground/50 tracking-wider rounded-full border border-border/20 hover:border-primary/20 hover:text-foreground transition-all duration-500">
              Se SEO-tjenester
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
            <p className="text-[10px] tracking-[0.4em] uppercase text-secondary mb-5">Hva er inkludert</p>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-6 leading-snug">
              Alt fra strategi til <span className="italic text-gradient-rose">lansering.</span>
            </h2>
            <p className="text-muted-foreground font-light leading-relaxed text-sm md:text-base">
              Vi leverer komplette nettsideprosjekter — fra innledende strategi og design til ferdig publisering og løpende vedlikehold. Ingen stress. Bare resultater.
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
          <p className="text-[10px] tracking-[0.4em] uppercase text-secondary mb-5 md:mb-6">Tilnærming</p>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-14 md:mb-20 max-w-2xl leading-snug">Slik bygger vi nettsider som lever.</h2>
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
            <Globe size={18} className="text-primary" strokeWidth={1.5} />
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-5 leading-snug max-w-2xl mx-auto">
            Klar for en nettside som faktisk jobber for deg?
          </h2>
          <p className="text-muted-foreground font-light mb-10 max-w-md mx-auto text-sm">
            Ta en uforpliktende samtale om hva selskapet ditt trenger — og hva vi kan levere.
          </p>
          <Link to="/kontakt" className="group inline-flex items-center gap-3 px-10 md:px-12 py-4 md:py-5 bg-primary text-primary-foreground text-sm font-medium tracking-wider rounded-full glow-rose hover:scale-[1.02] transition-all duration-500">
            Book en gjennomgang <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
          </Link>
        </AnimatedSection>
      </div>
    </section>
  </>
);

export default Nettsider;
