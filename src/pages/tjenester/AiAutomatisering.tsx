import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Bot, ChevronRight, ArrowLeft, CheckCircle2, Cpu } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import ambientTexture3 from "@/assets/ambient-texture-3.jpg";

const deliverables = [
  "Prosessautomatisering og arbeidsflyt-design",
  "Systemintegrasjoner (CRM, ERP, regnskapssystem)",
  "AI-chatbot og kundeserviceautomatisering",
  "Automatisk leadoppfølging og e-postflyt",
  "Datadrevne beslutningssystemer",
  "Rapportautomatisering og dashbord",
  "Dokumenthåndtering og godkjenningsflyt",
  "Skreddersydde AI-løsninger etter behov",
];

const useCases = [
  { num: "01", title: "Gjør bort med manuell rapportering.", desc: "Automatisk datainnhenting, behandling og presentasjon — slik at ledelsesrapporter genereres uten at noen trenger å sette seg ned med Excel fredag ettermiddag." },
  { num: "02", title: "Kundeservice som aldri sover.", desc: "AI-chatbots som svarer på vanlige spørsmål, håndterer bookinger og eskalerer komplekse saker til riktig person — 24 timer i døgnet, uten lønnskostnad." },
  { num: "03", title: "Leads fulgt opp før konkurrenten rekker det.", desc: "Automatiske e-postsekvenser, SMS-varsler og CRM-oppdateringer som sørger for at ingen lead faller gjennom sprekkene — og at oppfølgingen skjer umiddelbart." },
  { num: "04", title: "Systemer som snakker med hverandre.", desc: "Nettbutikk, regnskapssystem, CRM og lagerstyring integrert slik at data flyter automatisk — uten manuell overføring, feil eller forsinkelser." },
];

const RelatedServices = [
  { label: "AI-drevet finansiell innsikt", href: "/tjenester/ai-innsikt" },
  { label: "Nettbutikk & e-handel", href: "/tjenester/nettbutikk" },
  { label: "Nettsider & digitale flater", href: "/tjenester/nettsider" },
];

const AiAutomatisering = () => (
  <>
    <section className="py-28 md:py-44 relative overflow-hidden">
      <img src={ambientTexture3} alt="" aria-hidden="true" loading="eager" className="absolute inset-0 w-full h-full object-cover opacity-[0.08] pointer-events-none select-none" />
      <div className="absolute inset-0 ambient-glow opacity-30" />
      <div className="container mx-auto px-4 md:px-6 relative">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} className="max-w-4xl">
          <Link to="/tjenester" className="inline-flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase text-muted-foreground/50 hover:text-foreground transition-colors mb-8 md:mb-12">
            <ArrowLeft size={12} /> Alle tjenester
          </Link>
          <p className="text-[10px] tracking-[0.45em] uppercase text-primary mb-5 md:mb-6">Avargo · Tjenester</p>
          <h1 className="font-heading text-5xl sm:text-6xl md:text-8xl leading-[1.02] mb-8 md:mb-10">
            AI & automatisering.{" "}
            <span className="italic text-gradient-teal">Teknologi som jobber mens du sover.</span>
          </h1>
          <p className="text-base md:text-xl text-muted-foreground font-light leading-relaxed max-w-2xl mb-10 md:mb-14">
            Intelligente arbeidsflyter og AI-drevne løsninger som eliminerer repetitive oppgaver, kobler systemene dine og skalerer kapasiteten uten proporsjonalt mer ressurser.
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
            <p className="text-[10px] tracking-[0.4em] uppercase text-secondary mb-5">Hva er inkludert</p>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-6 leading-snug">
              Skreddersydde{" "}
              <span className="italic text-gradient-teal">automatiseringsløsninger.</span>
            </h2>
            <p className="text-muted-foreground font-light leading-relaxed text-sm md:text-base">
              Vi kartlegger, designer og implementerer automatiseringsløsninger tilpasset selskapet ditt — fra enkle systemintegrasjoner til komplekse AI-drevne arbeidsflyter.
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
          <p className="text-[10px] tracking-[0.4em] uppercase text-secondary mb-5 md:mb-6">Bruksområder</p>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-14 md:mb-20 max-w-2xl leading-snug">Hva vi automatiserer — og hvorfor det lønner seg.</h2>
        </AnimatedSection>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
          {useCases.map((u, i) => (
            <AnimatedSection key={u.num} delay={i * 0.1}>
              <div className="p-8 md:p-10 glass rounded-3xl card-lift h-full">
                <span className="font-heading text-5xl text-primary/8">{u.num}</span>
                <h3 className="font-heading text-xl md:text-2xl mt-5 mb-3">{u.title}</h3>
                <p className="text-sm text-muted-foreground font-light leading-relaxed">{u.desc}</p>
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
            <Cpu size={18} className="text-primary" strokeWidth={1.5} />
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-5 leading-snug max-w-2xl mx-auto">
            Automatiser det som stjeler tiden din.
          </h2>
          <p className="text-muted-foreground font-light mb-10 max-w-md mx-auto text-sm">
            Book en gjennomgang. Vi kartlegger hvilke prosesser som kan automatiseres — og hva det betyr i faktisk timesparing og kostnadskutt.
          </p>
          <Link to="/kontakt" className="group inline-flex items-center gap-3 px-10 md:px-12 py-4 md:py-5 bg-primary text-primary-foreground text-sm font-medium tracking-wider rounded-full glow-rose hover:scale-[1.02] transition-all duration-500">
            Book en gjennomgang <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
          </Link>
        </AnimatedSection>
      </div>
    </section>
  </>
);

export default AiAutomatisering;
