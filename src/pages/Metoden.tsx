import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  ArrowRight, TrendingUp, Users, BarChart3, Bot,
  CreditCard, Headphones, Code2, Megaphone, Shield
} from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

const team = [
  {
    icon: Headphones,
    role: "Regnskapsførere",
    desc: "Autoriserte regnskapsførere som kjenner din bransje ut og inn. Din dedikerte kontakt — alltid tilgjengelig, alltid oppdatert.",
  },
  {
    icon: Users,
    role: "HR-spesialister",
    desc: "Lønnskjøring, arbeidsrett, HMS og personaladministrasjon. Vi tar hele HR-byrden slik at du kan fokusere på menneskene, ikke papirene.",
  },
  {
    icon: Megaphone,
    role: "Markedsførere",
    desc: "Vekststrategi, merkevarebygging og digital tilstedeværelse. Vi ser helhetsbilde — fra årsresultat til markedsposisjon.",
  },
  {
    icon: Code2,
    role: "Utviklere",
    desc: "Systemintegrasjoner, automatisering og digitalisering av prosesser. Teknologi som gjør at selskapet ditt skalerer uten friksjon.",
  },
  {
    icon: Shield,
    role: "Strategiske rådgivere",
    desc: "Exit, fusjon, kapitalstruktur og vekstplan. Senioreksperter som har sett alt — og vet nøyaktig hva som skal til.",
  },
];

const steps = [
  {
    num: "I",
    phase: "Oppdagelse",
    duration: "Dag 1",
    title: "Vi lytter. Dypt.",
    desc: "Ingen standardisert pitch. Ingen salgsscript. Vi setter oss ned med deg og forstår selskapet ditt — historien, ambisjonene, smertepunktene. De fleste oppdager seks-sifrede muligheter allerede i dette møtet.",
    note: "45 minutter som kan forandre alt.",
  },
  {
    num: "II",
    phase: "Kartlegging",
    duration: "Dag 1–2",
    title: "Teamet ditt tar form.",
    desc: "Vi setter sammen et skreddersydd team basert på hva selskapet ditt trenger — ikke hva vi tilbyr som standard. Regnskapsfører, HR, markedsfører, utvikler. Eksakt det du trenger. Ikke mer. Ikke mindre.",
    note: "Én kontaktperson. Hele teamet bak.",
  },
  {
    num: "III",
    phase: "Integrasjon",
    duration: "Dag 2–3",
    title: "Alt kobles sammen.",
    desc: "90+ bankintegrasjoner aktiveres automatisk. Eksisterende systemer knyttes inn. Historiske data importeres og renskes. Du behøver ikke løfte en finger — vi tar over og gjør det ryddig fra bunnen av.",
    note: "Fullt operativt regnskap på 5 virkedager.",
  },
  {
    num: "IV",
    phase: "Innsikt",
    duration: "Dag 3–4",
    title: "AI ser det ingen andre ser.",
    desc: "Vår AI analyserer 1400+ parametere mot din unike situasjon. Skjulte fradrag. Fremtidige likviditetskriser. Strukturelle svakheter. Alt presenteres av din dedikerte rådgiver i et språk du forstår — ikke tall du må tyde alene.",
    note: "Kunnskap er makt. Vi gir deg begge deler.",
  },
  {
    num: "V",
    phase: "Kontroll",
    duration: "Dag 4–5",
    title: "Du ser alt. I sanntid.",
    desc: "Ditt personlige dashbord aktiveres. Likviditet, resultat, balanse og skatteposisjon — oppdatert minutt for minutt. Aldri vent til neste månedsrapport for å ta en avgjørelse. Informasjon når du trenger den.",
    note: "Beslutninger basert på fakta, ikke magefølelse.",
  },
  {
    num: "VI",
    phase: "Partnerskap",
    duration: "For alltid",
    title: "Overlat resten til oss.",
    desc: "Fra nå av ringer vi deg — ikke omvendt. Vi proaktivt varsler deg om muligheter, risikoer og strategiske valg. Du fokuserer på det du er best på. Vi tar alt det andre. Slik er det ment å fungere.",
    note: "Du bygger selskapet. Vi bygger fundamentet.",
  },
];

const StepCard = ({ step, index }: { step: typeof steps[0]; index: number }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const opacity = useTransform(scrollYProgress, [0, 0.6], [0.3, 1]);
  const y = useTransform(scrollYProgress, [0, 0.6], [40, 0]);

  return (
    <motion.div ref={ref} style={{ opacity, y }} className="relative">
      <div className="grid md:grid-cols-[1fr_80px_1fr] items-start gap-0">
        {/* Left — number & phase (alternating) */}
        {index % 2 === 0 ? (
          <>
            <div className="flex flex-col items-end text-right pr-10 pt-2 hidden md:flex">
              <span className="font-heading text-[80px] leading-none text-primary/8 select-none">{step.num}</span>
            </div>
            {/* Center spine node */}
            <div className="hidden md:flex flex-col items-center">
              <div className="w-px flex-1 bg-gradient-to-b from-transparent to-primary/20 min-h-8" />
              <div className="w-5 h-5 rounded-full border border-primary/40 bg-background flex items-center justify-center shrink-0 my-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              </div>
              <div className="w-px flex-1 bg-gradient-to-b from-primary/20 to-transparent min-h-8" />
            </div>
            <div className="pb-20 pl-0 md:pl-10">
              <ContentBlock step={step} />
            </div>
          </>
        ) : (
          <>
            <div className="pb-20 pr-0 md:pr-10 text-right">
              <ContentBlockRight step={step} />
            </div>
            <div className="hidden md:flex flex-col items-center">
              <div className="w-px flex-1 bg-gradient-to-b from-transparent to-primary/20 min-h-8" />
              <div className="w-5 h-5 rounded-full border border-primary/40 bg-background flex items-center justify-center shrink-0 my-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              </div>
              <div className="w-px flex-1 bg-gradient-to-b from-primary/20 to-transparent min-h-8" />
            </div>
            <div className="flex flex-col items-start pt-2 pl-10 hidden md:flex">
              <span className="font-heading text-[80px] leading-none text-primary/8 select-none">{step.num}</span>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

const ContentBlock = ({ step }: { step: typeof steps[0] }) => (
  <div className="group">
    <p className="text-[10px] tracking-[0.35em] uppercase text-secondary mb-3">{step.phase} · {step.duration}</p>
    <h3 className="font-heading text-3xl md:text-4xl mb-4 leading-snug">{step.title}</h3>
    <p className="text-muted-foreground font-light leading-relaxed text-[15px] mb-5 max-w-sm">{step.desc}</p>
    <p className="text-xs italic text-primary/60 font-light">{step.note}</p>
  </div>
);

const ContentBlockRight = ({ step }: { step: typeof steps[0] }) => (
  <div className="group flex flex-col items-start md:items-end">
    <p className="text-[10px] tracking-[0.35em] uppercase text-secondary mb-3">{step.phase} · {step.duration}</p>
    <h3 className="font-heading text-3xl md:text-4xl mb-4 leading-snug">{step.title}</h3>
    <p className="text-muted-foreground font-light leading-relaxed text-[15px] mb-5 max-w-sm">{step.desc}</p>
    <p className="text-xs italic text-primary/60 font-light">{step.note}</p>
  </div>
);

const Metoden = () => {
  return (
    <>
      {/* HERO — Cinematic opener */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 ambient-glow opacity-80" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `repeating-linear-gradient(0deg, hsl(15 55% 65% / 0.5) 0px, transparent 1px, transparent 80px),
                repeating-linear-gradient(90deg, hsl(15 55% 65% / 0.5) 0px, transparent 1px, transparent 80px)`,
            }}
          />
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl mx-auto"
          >
            <motion.p
              initial={{ opacity: 0, letterSpacing: "0.8em" }}
              animate={{ opacity: 1, letterSpacing: "0.4em" }}
              transition={{ delay: 0.4, duration: 1.4 }}
              className="text-[10px] tracking-[0.4em] uppercase text-secondary mb-12"
            >
              En reise. Ikke en tjeneste.
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="font-heading text-6xl md:text-8xl leading-[1.02] mb-10"
            >
              Overlat alt.
              <br />
              <span className="italic text-gradient-rose">Vi tar det derfra.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 1 }}
              className="text-lg text-muted-foreground font-light leading-relaxed max-w-2xl mx-auto mb-6"
            >
              Hos Avargo møter du ikke ett menneske — du møter et helt team. Regnskapsførere, HR-spesialister, markedsførere og utviklere som analyserer selskapet ditt og iverksetter det som trengs. Alt etter ditt behov. Skreddersydd. Sømløst.
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="text-sm text-primary/70 italic font-light mb-16"
            >
              Du trenger ikke tenke på noe annet enn å bygge selskapet ditt.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-5 justify-center"
            >
              <Link
                to="/kontakt"
                className="group inline-flex items-center gap-3 px-10 py-4 bg-primary text-primary-foreground text-sm font-medium tracking-wider rounded-full glow-rose hover:scale-[1.02] transition-all duration-500"
              >
                Start reisen
                <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
              </Link>
              <a
                href="#reisen"
                className="inline-flex items-center gap-2 px-10 py-4 text-sm text-foreground/50 tracking-wider rounded-full border border-border/20 hover:border-primary/20 hover:text-foreground transition-all duration-500"
              >
                Se hvordan det fungerer
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        >
          <span className="text-[9px] tracking-[0.3em] uppercase text-muted-foreground/30">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-primary/30 to-transparent" />
        </motion.div>
      </section>

      {/* TEAM — Who you're actually getting */}
      <section className="py-32 md:py-40 relative border-y border-border/10">
        <div className="absolute inset-0 ambient-glow opacity-30" />
        <div className="container mx-auto px-6 relative">
          <AnimatedSection>
            <div className="text-center max-w-2xl mx-auto mb-20">
              <p className="text-[10px] tracking-[0.4em] uppercase text-secondary mb-6">Ditt team</p>
              <h2 className="font-heading text-4xl md:text-6xl mb-6 leading-snug">
                Ikke én person.{" "}
                <span className="italic text-gradient-rose">Et helt hus.</span>
              </h2>
              <p className="text-muted-foreground font-light leading-relaxed">
                Når du velger Avargo, får du tilgang til et tverrfaglig team som jobber koordinert for selskapet ditt. Vi vurderer hva ditt selskap faktisk trenger — og setter inn riktig kompetanse.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-5 gap-4">
            {team.map((member, i) => (
              <AnimatedSection key={member.role} delay={i * 0.08}>
                <div className="group p-7 glass rounded-3xl card-lift h-full relative overflow-hidden text-center">
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/0 to-primary/3 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl" />
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-5">
                      <member.icon size={18} className="text-primary" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-heading text-lg mb-3">{member.role}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed font-light">{member.desc}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection delay={0.5}>
            <p className="text-center text-sm text-muted-foreground/40 italic font-light mt-10">
              Alle disipliner koordinert av én dedikert kontaktperson. Du slipper å snakke med fem ulike leverandører.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* JOURNEY — The actual steps */}
      <section id="reisen" className="py-32 md:py-48 relative overflow-hidden">
        <div className="absolute inset-0 ambient-glow opacity-20" />
        <div className="container mx-auto px-6 relative">
          <AnimatedSection>
            <div className="text-center mb-28">
              <p className="text-[10px] tracking-[0.4em] uppercase text-secondary mb-6">Reisen</p>
              <h2 className="font-heading text-4xl md:text-6xl mb-6 leading-snug">
                Seks faser.{" "}
                <span className="italic text-gradient-teal">Én destinasjon.</span>
              </h2>
              <p className="text-muted-foreground font-light max-w-xl mx-auto">
                Fra det første møtet til en permanent partner som proaktivt driver selskapet ditt fremover. Slik ser reisen ut.
              </p>
            </div>
          </AnimatedSection>

          {/* Timeline */}
          <div className="relative max-w-4xl mx-auto">
            {/* Spine line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/5 via-primary/20 to-primary/5 hidden md:block -translate-x-1/2" />

            {steps.map((step, i) => (
              <StepCard key={step.num} step={step} index={i} />
            ))}

            {/* End node */}
            <div className="hidden md:flex justify-center mb-8">
              <div className="w-8 h-8 rounded-full border border-primary/30 bg-background flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-primary/60" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CLOSING — The promise */}
      <section className="py-32 md:py-40 relative overflow-hidden border-t border-border/10">
        <div className="absolute inset-0 ambient-glow opacity-60" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, hsl(15 55% 65%) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="container mx-auto px-6 relative">
          <div className="max-w-3xl mx-auto text-center">
            <AnimatedSection>
              <p className="text-[10px] tracking-[0.4em] uppercase text-secondary mb-8">Løftet</p>
              <h2 className="font-heading text-5xl md:text-7xl leading-[1.02] mb-10">
                Du trenger ikke{" "}
                <span className="italic text-gradient-rose">noe mer.</span>
              </h2>
              <p className="text-muted-foreground text-lg font-light leading-relaxed mb-6 max-w-2xl mx-auto">
                Regnskap. HR. Markedsføring. Teknologi. Strategi. Alt samlet under ett tak, koordinert av et team som kjenner selskapet ditt like godt som du gjør selv. Du overlater. Vi leverer.
              </p>
              <p className="text-primary/70 italic font-light mb-16 text-sm">
                Ikke en regnskapsfører. Ikke et byrå. En partner for hele reisen.
              </p>

              <div className="flex flex-col sm:flex-row gap-5 justify-center">
                <Link
                  to="/kontakt"
                  className="group inline-flex items-center gap-3 px-12 py-5 bg-primary text-primary-foreground text-sm font-medium tracking-wider rounded-full glow-rose hover:scale-[1.02] transition-all duration-500"
                >
                  Overlat alt til oss
                  <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                </Link>
              </div>

              {/* Trust micro-signals */}
              <div className="mt-16 flex flex-wrap gap-10 justify-center">
                {["5 virkedager til fullt operativt regnskap", "Én kontaktperson. Helt team.", "Ingen bindingstid"].map((signal) => (
                  <div key={signal} className="flex items-center gap-2 text-xs text-muted-foreground/50 font-light">
                    <span className="w-1 h-1 rounded-full bg-primary/40 shrink-0" />
                    {signal}
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </>
  );
};

export default Metoden;
