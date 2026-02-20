import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight, TrendingUp, Users, BarChart3, Bot,
  CreditCard, Headphones
} from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

const Metoden = () => {
  const steps = [
    {
      icon: Headphones,
      num: "01",
      title: "Gratis finansiell helse-sjekk",
      duration: "Dag 1 · 45 min",
      desc: "Vi starter med en uforpliktende analyse av selskapet ditt. Ingen standardisert pitch — vi lytter. Vi avdekker skjulte fradrag, ineffektive strukturer og tapte muligheter. De fleste finner seks-sifrede besparelser allerede her.",
      bullets: ["Gjennomgang av nåværende regnskap og struktur", "Identifisering av umiddelbare skattebesparelser", "Kartlegging av bransje og vekstmål", "Presentasjon av skreddersydd tilbud"],
      side: "left",
    },
    {
      icon: Users,
      num: "02",
      title: "Du møter din dedikerte regnskapsfører",
      duration: "Dag 2 · 30 min",
      desc: "Ikke en chatbot. Ikke et callsenter. Du møter personen som skal kjenne selskapet ditt ut og inn — din faste kontakt, alltid. Vi matcher deg med en regnskapsfører som har dyp erfaring i akkurat din bransje.",
      bullets: ["Personlig introduksjonsmøte med din regnskapsfører", "Gjennomgang av dine mål og utfordringer", "Oppsett av kommunikasjonskanal og responstid", "Signering av klientavtale med full oversikt"],
      side: "right",
    },
    {
      icon: CreditCard,
      num: "03",
      title: "Bankintegrasjon og systemoppsett",
      duration: "Dag 2–3 · Automatisk",
      desc: "Vi kobler til alle norske banker og eksisterende systemer. Ingen manuell import. Ingen kopier-og-lim. Historiske transaksjoner importeres og kategoriseres automatisk av AI — validert av din regnskapsfører.",
      bullets: ["90+ bankintegrasjoner aktivert automatisk", "Import og kategorisering av historisk data", "Oppsett av mva-rapportering og lønnskjøring", "Integrasjon med eksisterende verktøy"],
      side: "left",
    },
    {
      icon: Bot,
      num: "04",
      title: "AI-analyse og skatteoptimalisering",
      duration: "Dag 3–4 · Kontinuerlig",
      desc: "AI-en vår analyserer 1400+ skatteparametere mot din unike situasjon. Den finner mønstre ingen revisor rekker å se manuelt. Din regnskapsfører presenterer funnene og dere bestemmer strategien sammen.",
      bullets: ["Full skatteanalyse med fradragsoptimalisering", "Likviditetsprediksjon 12 uker frem i tid", "Identifisering av strukturelle forbedringsmuligheter", "Første kvartalsplan for skatteposisjon"],
      side: "right",
    },
    {
      icon: BarChart3,
      num: "05",
      title: "Sanntidsdashbord — du ser alt",
      duration: "Dag 4–5 · Alltid oppdatert",
      desc: "Ditt personlige dashbord aktiveres. Du ser likviditet, resultat, balanse og skatteposisjon i sanntid. Ingen ventetid til neste månedsrapport. AI-en flagger avvik umiddelbart — din regnskapsfører forklarer og handler.",
      bullets: ["Live oversikt over likviditet og resultat", "Automatiske varsler ved avvik eller muligheter", "Månedlig strategimøte med din regnskapsfører", "Kvartalsvise skattegjennomganger inkludert"],
      side: "left",
    },
    {
      icon: TrendingUp,
      num: "06",
      title: "Vekstpartner — ikke bare regnskapsfører",
      duration: "Løpende · For alltid",
      desc: "Fra dag én er vi ikke en leverandør — vi er en strategisk partner. Din regnskapsfører proaktivt kontakter deg med innsikt, ikke bare svar. Vi vokser med deg: fra oppstart til exit, fra ENK til konsern.",
      bullets: ["Proaktiv rådgivning — vi ringer deg, ikke omvendt", "Løpende optimalisering av struktur og skatt", "Støtte ved vekst, fusjon, fisjon og exit", "Aldri bekymre deg for en frist igjen"],
      side: "right",
    },
  ];

  return (
    <>
      {/* HERO */}
      <section className="relative py-40 md:py-52 overflow-hidden">
        <div className="absolute inset-0 ambient-glow opacity-60" />
        <div className="container mx-auto px-6 relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl mx-auto"
          >
            <p className="text-xs tracking-[0.4em] uppercase text-secondary mb-8">Menneske + Maskin</p>
            <h1 className="font-heading text-5xl md:text-7xl leading-[1.05] mb-8">
              Fra første samtale til{" "}
              <span className="italic text-gradient-rose">full kontroll</span>
            </h1>
            <p className="text-lg text-muted-foreground font-light leading-relaxed max-w-xl mx-auto mb-6">
              Vi har gjort onboarding til en kunst. De fleste regnskapsbyrå kaster deg inn i et system og ber deg finne ut av det selv. Vi gjør det stikk motsatte.
            </p>
            <p className="text-sm text-primary/80 italic font-light">
              Gjennomsnittlig tid fra første møte til fullt operativt regnskap:{" "}
              <strong className="text-primary not-italic">5 virkedager.</strong>
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-6"><div className="line-accent" /></div>

      {/* STEPS */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <div className="relative">
            {/* Vertical connector */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/30 via-primary/10 to-transparent hidden md:block -translate-x-1/2" />

            {steps.map((step, i) => (
              <AnimatedSection key={step.num} delay={i * 0.1}>
                <div className={`relative flex flex-col md:flex-row gap-8 mb-16 items-start ${step.side === "right" ? "md:flex-row-reverse" : ""}`}>
                  {/* Step card */}
                  <div className="flex-1 group p-8 glass rounded-3xl card-lift relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="flex items-start gap-5 mb-6">
                      <div className="p-3 bg-muted/50 rounded-2xl shrink-0">
                        <step.icon size={20} className="text-primary" strokeWidth={1.5} />
                      </div>
                      <div>
                        <p className="text-xs tracking-widest text-primary/60 uppercase mb-1">{step.duration}</p>
                        <h3 className="font-heading text-2xl leading-snug">{step.title}</h3>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed font-light mb-6">{step.desc}</p>
                    <ul className="space-y-2">
                      {step.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-3 text-sm text-muted-foreground/80 font-light">
                          <span className="w-1 h-1 rounded-full bg-primary mt-2 shrink-0" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Center number bubble */}
                  <div className="hidden md:flex shrink-0 w-16 items-center justify-center">
                    <div className="w-12 h-12 rounded-full glass border border-primary/20 flex items-center justify-center z-10">
                      <span className="font-heading text-sm text-primary">{step.num}</span>
                    </div>
                  </div>

                  {/* Spacer */}
                  <div className="flex-1 hidden md:block" />
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Bottom CTA */}
          <AnimatedSection delay={0.6}>
            <div className="mt-4 p-10 glass rounded-3xl text-center">
              <p className="font-heading text-2xl md:text-3xl mb-4">
                Klar til å starte? <span className="italic text-gradient-rose">Det tar 45 minutter.</span>
              </p>
              <p className="text-muted-foreground font-light mb-8 max-w-lg mx-auto">
                Bestill din gratis helse-sjekk i dag. Ingen forpliktelser. Bare ren innsikt i hva selskapet ditt taper — og hva vi kan gjøre med det.
              </p>
              <Link
                to="/kontakt"
                className="group inline-flex items-center gap-3 px-10 py-4 bg-primary text-primary-foreground text-sm font-medium tracking-wider rounded-full glow-rose hover:scale-[1.02] transition-all duration-500"
              >
                Start onboarding
                <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
};

export default Metoden;
