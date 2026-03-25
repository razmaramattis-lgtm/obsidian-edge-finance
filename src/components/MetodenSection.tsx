import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight, TrendingUp, Users,
  Headphones, Code2, Megaphone, Shield, Phone, type LucideIcon
} from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import metodenTeam from "@/assets/metoden-team.jpg";

export interface MetodenTeamMember {
  icon: LucideIcon;
  role: string;
  desc: string;
}

export interface MetodenStep {
  num: string;
  phase: string;
  duration: string;
  title: string;
  desc: string;
  note: string;
}

export interface MetodenOverrides {
  teamIntro?: { tag?: string; headline?: React.ReactNode; sub?: string; footnote?: string };
  team?: MetodenTeamMember[];
  journeyIntro?: { tag?: string; headline?: React.ReactNode; sub?: string };
  steps?: MetodenStep[];
  ctaBox?: { title?: string; desc?: string };
}

const defaultTeam: MetodenTeamMember[] = [
  { icon: Headphones, role: "Regnskapsførere", desc: "Statsautoriserte regnskapsførere som kjenner din bransje ut og inn. Din dedikerte kontakt — med svar innen 24 timer." },
  { icon: Users, role: "HR-spesialister", desc: "Lønnskjøring, arbeidsrett, HMS og personaladministrasjon. Vi tar hele HR-byrden slik at du kan fokusere på menneskene, ikke papirene." },
  { icon: Megaphone, role: "Markedsførere", desc: "Vekststrategi, merkevarebygging og digital tilstedeværelse. Vi ser helhetsbilde — fra årsresultat til markedsposisjon." },
  { icon: Code2, role: "Utviklere", desc: "Systemintegrasjoner, automatisering og digitalisering av prosesser. Teknologi som gjør at selskapet ditt skalerer uten friksjon." },
  { icon: Shield, role: "Strategiske rådgivere", desc: "Exit, fusjon, kapitalstruktur og vekstplan. Senioreksperter som har sett alt — og vet nøyaktig hva som skal til." },
];

const defaultSteps: MetodenStep[] = [
  { num: "I", phase: "Oppdagelse", duration: "Dag 1", title: "Vi lytter. Dypt.", desc: "Ingen standardisert pitch. Ingen salgsscript. Vi setter oss ned med deg og forstår selskapet ditt — historien, ambisjonene, smertepunktene.", note: "45 minutter som kan forandre alt." },
  { num: "II", phase: "Kartlegging", duration: "Dag 1–2", title: "Teamet ditt tar form.", desc: "Vi setter sammen et skreddersydd team basert på hva selskapet ditt trenger — ikke hva vi tilbyr som standard. Regnskapsfører, HR, markedsfører, utvikler. Eksakt det du trenger.", note: "Én kontaktperson. Hele teamet bak." },
  { num: "III", phase: "Innsyn", duration: "Dag 3–5", title: "Du ser alt. I sanntid.", desc: "Din tilgang aktiveres. Likviditet, resultat, balanse og skatteposisjon — oppdatert minutt for minutt, alltid.", note: "Full oversikt. Null innsats fra din side." },
  { num: "IV", phase: "Partnerskap", duration: "For alltid", title: "Vi ringer deg. Du kan ringe oss.", desc: "Vi kontakter deg proaktivt med innsikt, muligheter og varsler — du trenger aldri jage svar selv.", note: "Tilgjengelige. Alltid. Uten ekstra kostnad." },
];

const StepCard = ({ step, index }: { step: MetodenStep; index: number }) => {
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
            <div className="pb-16 pr-0 md:pr-12 flex flex-col items-start">
              <ContentBlock step={step} align="left" />
            </div>
            <SpineNode />
            <div className="hidden md:block" />
          </>
        ) : (
          <>
            <div className="hidden md:block" />
            <SpineNode />
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

const ContentBlock = ({ step, align }: { step: MetodenStep; align: "left" | "right" }) => (
  <div className={`max-w-sm ${align === "right" ? "text-left md:text-right" : "text-left"}`}>
    <p className="text-[10px] tracking-[0.35em] uppercase text-secondary mb-3">{step.phase} · {step.duration}</p>
    <h3 className="font-heading text-3xl md:text-4xl mb-4 leading-snug">{step.title}</h3>
    <p className="text-muted-foreground font-light leading-relaxed text-[15px] mb-4">{step.desc}</p>
    <p className="text-xs italic text-primary/70 font-light">{step.note}</p>
  </div>
);

const MetodenSection = ({ overrides }: { overrides?: MetodenOverrides }) => {
  const team = overrides?.team ?? defaultTeam;
  const steps = overrides?.steps ?? defaultSteps;
  const ti = overrides?.teamIntro ?? {};
  const ji = overrides?.journeyIntro ?? {};
  const cta = overrides?.ctaBox ?? {};

  return (
    <>
      {/* TEAM — cinematic split */}
      <section id="metoden" className="relative border-y border-border/10 overflow-hidden">
        <div className="grid md:grid-cols-2 min-h-[500px] md:min-h-[600px]">
          <div className="relative overflow-hidden min-h-[280px] md:min-h-0">
            <img src={metodenTeam} alt="Teamet ditt hos Avargo" className="w-full h-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/10 to-background/60 md:from-transparent md:to-background/80" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent md:hidden" />
          </div>

          <div className="flex flex-col justify-center py-14 md:py-20 px-6 md:px-16 relative">
            <div className="absolute inset-0 ambient-glow opacity-30" />
            <div className="relative z-10">
              <AnimatedSection>
                <p className="text-[10px] tracking-[0.4em] uppercase text-secondary mb-5 md:mb-6">{ti.tag ?? "Slik jobber vi"}</p>
                <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-5 md:mb-6 leading-snug">
                  {ti.headline ?? <>Ikke én person.{" "}<span className="italic text-gradient-rose">Et helt hus.</span></>}
                </h2>
                <p className="text-muted-foreground font-light leading-relaxed mb-8 md:mb-10 max-w-md text-sm md:text-base">
                  {ti.sub ?? "Når du velger Avargo, får du tilgang til et tverrfaglig team som jobber koordinert rundt selskapet ditt. Vi vurderer hva du faktisk trenger — og setter inn riktig kompetanse."}
                </p>

                <div className="flex flex-col gap-3 md:gap-4">
                  {team.map((member, i) => (
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
                  {ti.footnote ?? "Alle disipliner koordinert av én kontaktperson. Du slipper å snakke med fem leverandører."}
                </p>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* JOURNEY — 4 steps */}
      <section className="py-24 md:py-48 relative overflow-hidden">
        <div className="absolute inset-0 ambient-glow opacity-20" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <AnimatedSection>
            <div className="text-center mb-20 md:mb-28">
              <p className="text-[10px] tracking-[0.4em] uppercase text-secondary mb-5 md:mb-6">{ji.tag ?? "Reisen"}</p>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-6xl mb-5 md:mb-6 leading-snug">
                {ji.headline ?? <>Fire faser.{" "}<span className="italic text-gradient-teal">Én destinasjon.</span></>}
              </h2>
              <p className="text-muted-foreground font-light max-w-xl mx-auto text-sm md:text-base">
                {ji.sub ?? "Fra det første møtet til en permanent partner som proaktivt driver selskapet ditt fremover. Slik ser reisen ut."}
              </p>
            </div>
          </AnimatedSection>

          <div className="relative max-w-4xl mx-auto">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/5 via-primary/20 to-primary/5 hidden md:block -translate-x-1/2" />
            {steps.map((step, i) => (
              <StepCard key={step.num} step={step} index={i} />
            ))}
            <div className="hidden md:flex justify-center mt-4 mb-8">
              <div className="w-8 h-8 rounded-full border border-primary/30 bg-background flex items-center justify-center">
                <TrendingUp size={14} className="text-primary/60" strokeWidth={1.5} />
              </div>
            </div>
          </div>

          <AnimatedSection delay={0.4}>
            <div className="max-w-2xl mx-auto mt-8">
              <div className="glass rounded-3xl p-6 md:p-8 flex flex-col sm:flex-row items-center gap-5 md:gap-6 text-center sm:text-left">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <Phone size={18} className="text-primary" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-heading text-lg md:text-xl mb-1.5 md:mb-2">{cta.title ?? "Rask respons — hver gang."}</p>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed">
                    {cta.desc ?? "Ring, send melding eller e-post — vi svarer innen 24 timer. Ingen timespris. Du er ikke et saksnummer — du er en partner vi bryr oss om."}
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
};

export default MetodenSection;
