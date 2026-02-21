import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, CheckCircle2, ChevronRight } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { LucideIcon } from "lucide-react";
import ambientTexture1 from "@/assets/ambient-texture-1.jpg";
import ambientTexture4 from "@/assets/ambient-texture-4.jpg";

interface BransjePageProps {
  icon: LucideIcon;
  name: string;
  tagline: string;
  intro: string;
  body: string;
  deliverables: string[];
  challenges: { title: string; desc: string }[];
  whyAvargo: { num: string; title: string; desc: string }[];
  quote?: { text: string; author: string };
  relatedSlugs: { label: string; href: string }[];
  ctaHeadline: string;
}

const BransjePage = ({
  icon: Icon,
  name,
  tagline,
  intro,
  body,
  deliverables,
  challenges,
  whyAvargo,
  quote,
  relatedSlugs,
  ctaHeadline,
}: BransjePageProps) => (
  <>
    <Helmet>
      <title>Regnskapsfører for {name} | Avargo</title>
      <meta name="description" content={intro.length > 160 ? intro.slice(0, 157) + "..." : intro} />
      <link rel="canonical" href={`https://avargo.no/bransjer/${name.toLowerCase().replace(/[æ]/g, "ae").replace(/[ø]/g, "o").replace(/[å]/g, "a").replace(/\s*&\s*/g, "-").replace(/\s+/g, "-")}`} />
    </Helmet>
    {/* HERO */}
    <section className="py-28 md:py-44 relative overflow-hidden">
      <img src={ambientTexture1} alt="" aria-hidden="true" loading="eager" className="absolute inset-0 w-full h-full object-cover opacity-[0.08] pointer-events-none select-none" />
      <div className="absolute inset-0 ambient-glow opacity-30" />
      <div className="container mx-auto px-4 md:px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl"
        >
          <Link
            to="/bransjer"
            className="inline-flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase text-muted-foreground/70 hover:text-foreground transition-colors mb-8 md:mb-12"
          >
            <ArrowLeft size={12} /> Alle bransjer
          </Link>
          <div className="flex items-center gap-4 mb-5 md:mb-6">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Icon size={17} className="text-primary" strokeWidth={1.5} />
            </div>
            <p className="text-[10px] tracking-[0.45em] uppercase text-secondary">{name}</p>
          </div>
          <h1 className="font-heading text-5xl sm:text-6xl md:text-8xl leading-[1.02] mb-6 md:mb-8">
            {tagline.split(" ").slice(0, Math.ceil(tagline.split(" ").length / 2)).join(" ")}{" "}
            <span className="italic text-gradient-rose">
              {tagline.split(" ").slice(Math.ceil(tagline.split(" ").length / 2)).join(" ")}
            </span>
          </h1>
          <p className="text-base md:text-xl text-muted-foreground font-light leading-relaxed max-w-2xl mb-10 md:mb-14">
            {intro}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/kontakt"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 md:px-10 py-4 bg-primary text-primary-foreground text-sm font-medium tracking-wider rounded-full glow-rose hover:scale-[1.02] transition-all duration-500"
            >
              Snakk med en {name}-ekspert
              <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>
            <Link
              to="/priser"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 md:px-10 py-4 text-sm text-foreground/70 tracking-wider rounded-full border border-border/30 hover:border-primary/20 hover:text-foreground transition-all duration-500"
            >
              Se priser
            </Link>
          </div>
        </motion.div>
      </div>
    </section>

    <div className="container mx-auto px-4 md:px-6"><div className="line-accent" /></div>

    {/* BODY + DELIVERABLES */}
    <section className="py-24 md:py-40">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-14 md:gap-24 items-start">
          <AnimatedSection>
            <p className="text-[10px] tracking-[0.4em] uppercase text-secondary mb-5">Hverdagen din</p>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-6 leading-snug">
              Vi forstår{" "}
              <span className="italic text-gradient-rose">din bransje.</span>
            </h2>
            <p className="text-muted-foreground font-light leading-relaxed text-sm md:text-base">
              {body}
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.15}>
            <p className="text-[10px] tracking-[0.4em] uppercase text-secondary mb-6">Hva vi dekker for deg</p>
            <ul className="flex flex-col gap-3">
              {deliverables.map((d) => (
                <li key={d} className="flex items-start gap-3 text-sm font-light text-foreground/80">
                  <CheckCircle2 size={14} className="text-primary mt-0.5 shrink-0" strokeWidth={1.5} />
                  {d}
                </li>
              ))}
            </ul>
          </AnimatedSection>
        </div>
      </div>
    </section>

    {/* CHALLENGES */}
    <section className="py-24 md:py-40 border-y border-border/10 relative">
      <img src={ambientTexture4} alt="" aria-hidden="true" loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-[0.06] pointer-events-none select-none" />
      <div className="absolute inset-0 ambient-glow opacity-15" />
      <div className="container mx-auto px-4 md:px-6 relative">
        <AnimatedSection>
          <p className="text-[10px] tracking-[0.4em] uppercase text-secondary mb-5 md:mb-6">Utfordringene vi løser</p>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-14 md:mb-20 max-w-2xl leading-snug">
            Det som holder deg oppe om natten — vi fikser det.
          </h2>
        </AnimatedSection>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
          {challenges.map((c, i) => (
            <AnimatedSection key={c.title} delay={i * 0.1}>
              <div className="p-8 md:p-10 glass rounded-3xl card-lift h-full">
                <h3 className="font-heading text-xl md:text-2xl mb-3">{c.title}</h3>
                <p className="text-sm text-muted-foreground font-light leading-relaxed">{c.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>

    {/* WHY AVARGO */}
    <section className="py-24 md:py-40">
      <div className="container mx-auto px-4 md:px-6">
        <AnimatedSection>
          <p className="text-[10px] tracking-[0.4em] uppercase text-secondary mb-5 md:mb-6">Hvorfor Avargo</p>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-14 md:mb-20 max-w-2xl leading-snug">
            Det du ikke får andre steder.
          </h2>
        </AnimatedSection>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
          {whyAvargo.map((w, i) => (
            <AnimatedSection key={w.num} delay={i * 0.1}>
              <div className="p-8 md:p-10 glass rounded-3xl card-lift h-full">
                <span className="font-heading text-5xl text-primary/20">{w.num}</span>
                <h3 className="font-heading text-xl md:text-2xl mt-5 mb-3">{w.title}</h3>
                <p className="text-sm text-muted-foreground font-light leading-relaxed">{w.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>


    {/* RELATED */}
    {relatedSlugs.length > 0 && (
      <section className="py-16 md:py-20 border-t border-border/10">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection>
            <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground/70 mb-8">Relaterte bransjer</p>
            <div className="flex flex-wrap gap-3">
              {relatedSlugs.map((s) => (
                <Link
                  key={s.href}
                  to={s.href}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-[12px] tracking-wide text-muted-foreground border border-border/20 rounded-full hover:border-primary/30 hover:text-foreground transition-all duration-300"
                >
                  {s.label} <ChevronRight size={11} className="text-primary/40" />
                </Link>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>
    )}

    {/* CTA */}
    <section className="py-24 md:py-32 border-t border-border/10 text-center relative">
      <div className="absolute inset-0 ambient-glow opacity-25" />
      <div className="container mx-auto px-4 md:px-6 relative">
        <AnimatedSection>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-5 leading-snug max-w-2xl mx-auto">
            {ctaHeadline}
          </h2>
          <p className="text-muted-foreground font-light mb-10 max-w-md mx-auto text-sm">
            En samtale er nok. Vi setter deg i kontakt med en regnskapsfører som kjenner din bransje — og kan starte umiddelbart.
          </p>
          <Link
            to="/kontakt"
            className="group inline-flex items-center gap-3 px-10 md:px-12 py-4 md:py-5 bg-primary text-primary-foreground text-sm font-medium tracking-wider rounded-full glow-rose hover:scale-[1.02] transition-all duration-500"
          >
            Book en gjennomgang
            <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
          </Link>
        </AnimatedSection>
      </div>
    </section>
  </>
);

export default BransjePage;
