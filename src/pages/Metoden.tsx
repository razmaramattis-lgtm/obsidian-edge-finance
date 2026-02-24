import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  ArrowRight, TrendingUp, Users,
  Headphones, Code2, Megaphone, Shield, Phone
} from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { useSection } from "@/contexts/SectionContext";
import { sectionPageCopy, sectionMetodenTeam } from "@/config/sectionContent";
import metodenHero from "@/assets/metoden-hero.jpg";
import metodenTeam from "@/assets/metoden-team.jpg";
import metodenClosing from "@/assets/metoden-closing.jpg";

const team = [
  {
    icon: Headphones,
    role: "Regnskapsførere",
    desc: "Statsautoriserte regnskapsførere som kjenner din bransje ut og inn. Din dedikerte kontakt — med svar innen 24 timer.",
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
    desc: "Ingen standardisert pitch. Ingen salgsscript. Vi setter oss ned med deg og forstår selskapet ditt — historien, ambisjonene, smertepunktene.",
    note: "45 minutter som kan forandre alt.",
    side: "left",
  },
  {
    num: "II",
    phase: "Kartlegging",
    duration: "Dag 1–2",
    title: "Teamet ditt tar form.",
    desc: "Vi setter sammen et skreddersydd team basert på hva selskapet ditt trenger — ikke hva vi tilbyr som standard. Regnskapsfører, HR, markedsfører, utvikler. Eksakt det du trenger. Ikke mer. Ikke mindre.",
    note: "Én kontaktperson. Hele teamet bak.",
    side: "right",
  },
  {
    num: "III",
    phase: "Innsyn",
    duration: "Dag 3–5",
    title: "Du ser alt. I sanntid.",
    desc: "Din tilgang aktiveres. Likviditet, resultat, balanse og skatteposisjon — oppdatert minutt for minutt, alltid. Du sitter aldri i mørket. Tallene er der når du vil se dem — uten at du trenger å gjøre noe som helst.",
    note: "Full oversikt. Null innsats fra din side.",
    side: "left",
  },
  {
    num: "IV",
    phase: "Partnerskap",
    duration: "For alltid",
    title: "Vi ringer deg. Du kan ringe oss.",
    desc: "Vi kontakter deg proaktivt med innsikt, muligheter og varsler — du trenger aldri jage svar selv. Og når du har spørsmål, er vi bare ett anrop unna. Ingen venteliste. Ingen ekstra kostnad. Du er klient — og det merkes.",
    note: "Tilgjengelige. Alltid. Uten ekstra kostnad.",
    side: "right",
  },
];

const StepCard = ({ step, index }: { step: typeof steps[0]; index: number }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const opacity = useTransform(scrollYProgress, [0, 0.6], [0.2, 1]);
  const y = useTransform(scrollYProgress, [0, 0.6], [50, 0]);

  const isRight = index % 2 !== 0;

  return (
    <motion.div ref={ref} style={{ opacity, y }} className="relative mb-0">
      <div className="grid md:grid-cols-[1fr_80px_1fr] items-center gap-0 min-h-[260px]">
        {!isRight ? (
          <>
            {/* Left content */}
            <div className="pb-16 pr-0 md:pr-12 flex flex-col items-start">
              <ContentBlock step={step} align="left" />
            </div>
            {/* Spine */}
            <SpineNode />
            {/* Right empty */}
            <div className="hidden md:block" />
          </>
        ) : (
          <>
            {/* Left empty */}
            <div className="hidden md:block" />
            {/* Spine */}
            <SpineNode />
            {/* Right content */}
            <div className="pb-16 pl-0 md:pl-12 flex flex-col items-start md:items-end">
              <ContentBlock step={step} align="right" />
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

const SpineNode = () => (
  <div className="hidden md:flex flex-col items-center self-stretch">
    <div className="w-px flex-1 bg-gradient-to-b from-transparent to-primary/25" />
    <div className="w-6 h-6 rounded-full border border-primary/40 bg-background flex items-center justify-center shrink-0 my-3">
      <div className="w-2 h-2 rounded-full bg-primary/70" />
    </div>
    <div className="w-px flex-1 bg-gradient-to-b from-primary/25 to-transparent" />
  </div>
);

const ContentBlock = ({ step, align }: { step: typeof steps[0]; align: "left" | "right" }) => (
  <div className={`max-w-sm ${align === "right" ? "text-left md:text-right" : "text-left"}`}>
    <p className="text-[10px] tracking-[0.35em] uppercase text-secondary mb-3">{step.phase} · {step.duration}</p>
    <h3 className="font-heading text-3xl md:text-4xl mb-4 leading-snug">{step.title}</h3>
    <p className="text-muted-foreground font-light leading-relaxed text-[15px] mb-4">{step.desc}</p>
    <p className="text-xs italic text-primary/70 font-light">{step.note}</p>
  </div>
);

const Metoden = () => {
  const { section, isInSection } = useSection();
  const copy = isInSection && section ? sectionPageCopy[section.id].metoden : null;
  const highlightedRoles = isInSection && section ? sectionMetodenTeam[section.id] : null;
  const sectionPath = isInSection && section ? section.basePath : "";
  const visibleTeam = highlightedRoles ? team.filter(m => highlightedRoles.includes(m.role)) : team;

  return (
    <>
      <Helmet>
        <title>{copy ? `Metoden — ${section!.name} | Avargo` : "Metoden vår | Slik jobber Avargo med regnskap og rådgivning"}</title>
        <meta name="description" content={copy?.heroSub || "Les om Avargos unike metode: et tverrfaglig team av regnskapsførere, HR-spesialister, markedsførere og utviklere som jobber sammen for din vekst."} />
        <link rel="canonical" href={`https://avargo.no${sectionPath}/metoden`} />
      </Helmet>
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={metodenHero}
            alt="Avargo — en reise mot full kontroll"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/50 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-background/40" />
          <div className="absolute inset-0 ambient-glow opacity-40" />
        </div>

        <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
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
              className="text-[10px] tracking-[0.4em] uppercase text-secondary mb-8 md:mb-12"
            >
              Slik sikrer vi at du alltid har kontroll
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="font-heading text-5xl sm:text-6xl md:text-8xl leading-[1.02] mb-8 md:mb-10"
            >
              Overlat alt.
              <br />
              <span className="italic text-gradient-rose">Vi tar det derfra.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 1 }}
              className="text-base md:text-lg text-muted-foreground font-light leading-relaxed max-w-2xl mx-auto mb-5 md:mb-6"
            >
              {copy?.heroSub || "Hos Avargo får du ikke bare en regnskapsfører — du får et helt team med statsautoriserte regnskapsførere, HR-spesialister og rådgivere som jobber sammen for at du skal sove godt om natten. Vi tar oss av alt det du ikke har tid til."}
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="text-sm text-primary/70 italic font-light mb-12 md:mb-16"
            >
              {copy?.heroItalic || "Bygget for små og mellomstore bedrifter som ønsker trygghet — ikke bare tall."}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 md:gap-5 justify-center"
            >
              <Link
                to={`${sectionPath}/kontakt`}
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 md:px-10 py-4 bg-primary text-primary-foreground text-sm font-medium tracking-wider rounded-full glow-rose hover:scale-[1.02] transition-all duration-500"
              >
                Få et uforpliktende tilbud
                <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
              </Link>
              <a
                href="#reisen"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 md:px-10 py-4 text-sm text-foreground/70 tracking-wider rounded-full border border-border/30 hover:border-primary/20 hover:text-foreground transition-all duration-500"
              >
                Se hvordan det fungerer
              </a>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        >
          <span className="text-[9px] tracking-[0.3em] uppercase text-muted-foreground/30">Scroll</span>
          <div className="w-px h-8 md:h-10 bg-gradient-to-b from-primary/30 to-transparent" />
        </motion.div>
      </section>

      {/* TEAM — cinematic split */}
      <section className="relative border-y border-border/10 overflow-hidden">
        <div className="grid md:grid-cols-2 min-h-[500px] md:min-h-[600px]">
          {/* Image side */}
          <div className="relative overflow-hidden min-h-[280px] md:min-h-0">
            <img
              src={metodenTeam}
              alt="Teamet ditt hos Avargo"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/10 to-background/60 md:from-transparent md:to-background/80" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent md:hidden" />
          </div>

          {/* Content side */}
          <div className="flex flex-col justify-center py-14 md:py-20 px-6 md:px-16 relative">
            <div className="absolute inset-0 ambient-glow opacity-30" />
            <div className="relative z-10">
              <AnimatedSection>
                <p className="text-[10px] tracking-[0.4em] uppercase text-secondary mb-5 md:mb-6">Ditt team</p>
                <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-5 md:mb-6 leading-snug">
                  Ikke én person.{" "}
                  <span className="italic text-gradient-rose">Et helt hus.</span>
                </h2>
                <p className="text-muted-foreground font-light leading-relaxed mb-8 md:mb-10 max-w-md text-sm md:text-base">
                  Når du velger Avargo, får du tilgang til et tverrfaglig team som jobber koordinert rundt selskapet ditt. Vi vurderer hva du faktisk trenger — og setter inn riktig kompetanse.
                </p>

                <div className="flex flex-col gap-3 md:gap-4">
                  {visibleTeam.map((member, i) => (
                    <AnimatedSection key={member.role} delay={i * 0.07}>
                      <div className="flex items-start gap-3 md:gap-4 group">
                        <div className="w-7 h-7 md:w-8 md:h-8 rounded-xl bg-muted/60 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-primary/10 transition-colors duration-500">
                          <member.icon size={13} className="text-primary" strokeWidth={1.5} />
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-0.5">{member.role}</p>
                          <p className="text-xs text-muted-foreground font-light leading-relaxed">{member.desc}</p>
                        </div>
                      </div>
                    </AnimatedSection>
                  ))}
                </div>

                <p className="text-xs text-muted-foreground/50 italic font-light mt-7 md:mt-8">
                  Alle disipliner koordinert av én kontaktperson. Du slipper å snakke med fem leverandører.
                </p>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* JOURNEY — 4 steps */}
      <section id="reisen" className="py-24 md:py-48 relative overflow-hidden">
        <div className="absolute inset-0 ambient-glow opacity-20" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <AnimatedSection>
            <div className="text-center mb-20 md:mb-28">
              <p className="text-[10px] tracking-[0.4em] uppercase text-secondary mb-5 md:mb-6">Reisen</p>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-6xl mb-5 md:mb-6 leading-snug">
                Fire faser.{" "}
                <span className="italic text-gradient-teal">Én destinasjon.</span>
              </h2>
              <p className="text-muted-foreground font-light max-w-xl mx-auto text-sm md:text-base">
                Fra det første møtet til en permanent partner som proaktivt driver selskapet ditt fremover. Slik ser reisen ut.
              </p>
            </div>
          </AnimatedSection>

          <div className="relative max-w-4xl mx-auto">
            {/* Spine */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/5 via-primary/20 to-primary/5 hidden md:block -translate-x-1/2" />

            {steps.map((step, i) => (
              <StepCard key={step.num} step={step} index={i} />
            ))}

            {/* End node */}
            <div className="hidden md:flex justify-center mt-4 mb-8">
              <div className="w-8 h-8 rounded-full border border-primary/30 bg-background flex items-center justify-center">
                <TrendingUp size={14} className="text-primary/60" strokeWidth={1.5} />
              </div>
            </div>
          </div>

          {/* Always available callout */}
          <AnimatedSection delay={0.4}>
            <div className="max-w-2xl mx-auto mt-8">
              <div className="glass rounded-3xl p-6 md:p-8 flex flex-col sm:flex-row items-center gap-5 md:gap-6 text-center sm:text-left">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <Phone size={18} className="text-primary" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-heading text-lg md:text-xl mb-1.5 md:mb-2">Rask respons — hver gang.</p>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed">
                    Ring, send melding eller e-post — vi svarer innen 24 timer. Ingen timespris. Du er ikke et saksnummer — du er en partner vi bryr oss om.
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CLOSING — Velvet texture */}
      <section className="relative py-28 md:py-56 overflow-hidden border-t border-border/10">
        <div className="absolute inset-0">
          <img
            src={metodenClosing}
            alt=""
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/60 to-background" />
          <div className="absolute inset-0 ambient-glow opacity-50" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <AnimatedSection>
               <p className="text-[10px] tracking-[0.4em] uppercase text-secondary mb-6 md:mb-8">Vårt løfte til deg</p>
              <h2 className="font-heading text-4xl sm:text-5xl md:text-7xl leading-[1.02] mb-8 md:mb-10">
                Du skal aldri trenge å{" "}
                <span className="italic text-gradient-rose">bekymre deg.</span>
              </h2>
              <p className="text-muted-foreground text-base md:text-lg font-light leading-relaxed mb-5 md:mb-6 max-w-2xl mx-auto">
                {isInSection && section && section.id !== "regnskap"
                  ? `Alt du trenger — håndtert av dedikerte ${section.shortName.toLowerCase()}-spesialister som kjenner bedriften din. Du slipper å koordinere, følge opp eller bekymre deg. Vi tar alt.`
                  : "Regnskap, skattemelding, lønn og rådgivning — alt håndtert av statsautoriserte regnskapsførere som kjenner selskapet ditt. Du slipper å tenke på frister, rapporter eller papirarbeid. Vi tar alt."}
              </p>
              <p className="text-primary/70 italic font-light mb-12 md:mb-16 text-sm">
                Én fast kontaktperson. Hele teamet i ryggen. Ingen overraskelser.
              </p>

              <Link
                to={`${sectionPath}/kontakt`}
                className="group inline-flex items-center gap-3 px-10 md:px-12 py-4 md:py-5 bg-primary text-primary-foreground text-sm font-medium tracking-wider rounded-full glow-rose hover:scale-[1.02] transition-all duration-500"
              >
                {isInSection && section ? `Snakk med en ${section.shortName.toLowerCase()}-ekspert` : "Snakk med en regnskapsfører"}
                <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
              </Link>

              <div className="mt-12 md:mt-16 flex flex-wrap gap-6 md:gap-10 justify-center">
                {(isInSection && section && section.id !== "regnskap"
                  ? [`Dedikerte ${section.shortName.toLowerCase()}-spesialister`, "Svar innen 24 timer", "Ring oss når du vil — inkludert i prisen"]
                  : ["Statsautoriserte regnskapsførere", "Svar innen 24 timer", "Ring oss når du vil — inkludert i prisen"]
                ).map((signal) => (
                  <div key={signal} className="flex items-center gap-2 text-xs text-muted-foreground/60 font-light">
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

