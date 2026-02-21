import { Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight, ArrowLeft, CheckCircle2, ChevronRight, Phone,
  BookOpen, GraduationCap, Award, Users, Clock, Calendar,
  FileText, Calculator, Scale, Receipt, Landmark, Building2,
  Shield, BarChart3, Briefcase, Target, Zap, Star,
  ChevronDown
} from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { Helmet } from "react-helmet-async";

/* ───────── Kurspakker ───────── */
const packages = [
  {
    id: "grunnkurs",
    name: "Grunnkurs",
    subtitle: "For deg som starter fra scratch",
    price: "4 900",
    suffix: "per deltaker",
    duration: "3 dager (18 timer)",
    format: "Fysisk eller digitalt",
    maxParticipants: "12 deltakere",
    highlighted: false,
    features: [
      "Innføring i bokføringsloven",
      "Bilagshåndtering og kontoplan",
      "Grunnleggende MVA-forståelse",
      "Enkel resultat- og balanseforståelse",
      "Intro til regnskapssystemer",
      "Kursmateriell inkludert",
      "Kursbevis ved fullført kurs",
    ],
  },
  {
    id: "fagkurs",
    name: "Fagkurs",
    subtitle: "For de som vil mestre detaljene",
    price: "8 900",
    suffix: "per deltaker",
    duration: "5 dager (30 timer)",
    format: "Fysisk eller digitalt",
    maxParticipants: "10 deltakere",
    highlighted: true,
    features: [
      "Alt i Grunnkurs +",
      "Avansert MVA (import/export, omvendt avgiftsplikt)",
      "Skattemelding for AS og ENK",
      "Årsregnskap — oppstilling og noter",
      "Aksjonærregisteroppgaven (RF-1086)",
      "Periodisering og avskrivninger",
      "Skatteplanlegging for eier",
      "Lønn, feriepenger og arbeidsgiveravgift",
      "Praktiske caser og oppgaver",
      "1-til-1 oppfølgingstime etter kurset",
    ],
  },
  {
    id: "bedriftspakke",
    name: "Bedriftspakke",
    subtitle: "Skreddersydd for hele teamet",
    price: "Fra 24 900",
    suffix: "per bedrift",
    duration: "Tilpasset (2–5 dager)",
    format: "På lokasjon eller digitalt",
    maxParticipants: "Opp til 20 deltakere",
    highlighted: false,
    features: [
      "Alt i Fagkurs +",
      "Tilpasset innhold for din bransje",
      "Gjennomgang av bedriftens regnskap",
      "System-spesifikk opplæring (Tripletex, Fiken, Visma)",
      "Internkontroll og rutinebygging",
      "HMS-dokumentasjon knyttet til økonomi",
      "Kvartalsvis oppfølgingsmøte (12 mnd)",
      "Dedikert kursansvarlig",
      "Sertifikat for alle deltakere",
    ],
  },
];

/* ───────── Kursmoduler ───────── */
const modules = [
  {
    icon: BookOpen,
    category: "Bokføring",
    title: "Bokføringsloven & bilagshåndtering",
    topics: [
      "Bokføringslovens krav og plikter",
      "Kontoplan (NS 4102) — oppbygging og tilpasning",
      "Bilagsbehandling: krav til dokumentasjon",
      "Kassasystem og kontantsalg",
      "Oppbevaringsplikten (5 år)",
      "Spesifikasjoner og pliktig rapportering",
    ],
  },
  {
    icon: Receipt,
    category: "MVA",
    title: "Merverdiavgiftsloven i praksis",
    topics: [
      "MVA-registrering og grenser",
      "Utgående vs. inngående MVA",
      "Fradragsrett og begrensninger",
      "MVA ved import og eksport",
      "Omvendt avgiftsplikt",
      "MVA-meldingen — termin og innlevering",
      "Justeringsregler for kapitalvarer",
      "Unntatte og fritatte omsetninger",
    ],
  },
  {
    icon: Scale,
    category: "Skattelov",
    title: "Skatteloven for næringsdrivende",
    topics: [
      "Skatteplikt for AS og ENK",
      "Alminnelig inntekt vs. personinntekt",
      "Foretaksmodellen og aksjonærmodellen",
      "Utbytte og utbytteskatt",
      "Fradragsberettigede kostnader",
      "Skattemessige avskrivninger (saldogrupper)",
      "Skattemelding for selskap (RF-1028)",
      "Forskuddsskatt og terminskatt",
    ],
  },
  {
    icon: FileText,
    category: "Årsregnskap",
    title: "Årsregnskap & rapportering",
    topics: [
      "Regnskapslovens krav",
      "Resultatregnskap — oppstilling",
      "Balanse — eiendeler, gjeld og egenkapital",
      "Notekrav for små foretak",
      "Kontantstrømoppstilling",
      "Årsberetning (når påkrevet)",
      "Revisjon vs. fravalg av revisjon",
      "Innsending til Regnskapsregisteret",
    ],
  },
  {
    icon: Calculator,
    category: "Lønn & Personal",
    title: "Lønn, feriepenger & arbeidsgiveravgift",
    topics: [
      "A-meldingen — rapportering til myndighetene",
      "Feriepengeavsetning og -utbetaling",
      "Arbeidsgiveravgift (differensierte satser)",
      "Naturalytelser og fordelsbeskatning",
      "Sykepenger og refusjonsordninger",
      "OTP — obligatorisk tjenestepensjon",
      "Firmabil, telefon og andre frynsegoder",
    ],
  },
  {
    icon: Landmark,
    category: "System & Internkontroll",
    title: "Regnskapssystem & rutiner",
    topics: [
      "Valg av regnskapssystem (Tripletex, Fiken, Visma)",
      "Bankintegrasjon og automatisering",
      "Fakturering og purrerutiner",
      "Internkontrollrutiner",
      "Periodeavslutning (måned/kvartal)",
      "Avstemming av bank, MVA og lønn",
      "GDPR og personvern i regnskapet",
      "Sikkerhetskopi og oppbevaring",
    ],
  },
];

/* ───────── Hvem passer kursene for ───────── */
const audiences = [
  {
    icon: Building2,
    title: "Gründere & Oppstartsbedrifter",
    desc: "Lær regnskapet fra dag én. Forstå hva du må levere, når det skal leveres — og hvordan du unngår de vanligste feilene.",
  },
  {
    icon: Users,
    title: "Daglige ledere & Styremedlemmer",
    desc: "Forstå tallene i selskapet ditt. Ta bedre beslutninger basert på resultatregnskap, likviditet og skatteposisjon.",
  },
  {
    icon: Briefcase,
    title: "Økonomiansvarlige & Regnskapsmedarbeidere",
    desc: "Oppdater kunnskapen. Lær avanserte emner som periodisering, konsernregnskap og skatteoptimalisering.",
  },
  {
    icon: GraduationCap,
    title: "Studenter & Karriereskiftere",
    desc: "Bygg en solid base. Kursbevis fra Avargo gir et fortrinn i arbeidsmarkedet og praktisk kompetanse fra dag én.",
  },
];

/* ───────── Statistikk ───────── */
const stats = [
  { value: "500+", label: "Kursdeltakere" },
  { value: "98%", label: "Anbefaler kurset" },
  { value: "4.9/5", label: "Gjennomsnittlig rating" },
  { value: "12+", label: "Bransjer dekket" },
];

const RelatedServices = [
  { label: "Dedikert regnskapsfører", href: "/tjenester/regnskapsforer" },
  { label: "CFO-as-a-Service", href: "/tjenester/cfo" },
  { label: "AI-drevet finansiell innsikt", href: "/tjenester/ai-innsikt" },
  { label: "Lønn & HR", href: "/tjenester/hr-og-lonn" },
];

const Kurs = () => {
  const [expandedModule, setExpandedModule] = useState<number | null>(null);

  return (
    <>
      <Helmet>
        <title>Regnskapskurs — Bokføring, MVA, Skatt & Årsregnskap | Avargo</title>
        <meta name="description" content="Praktiske regnskapskurs for bedriftseiere og økonomiansvarlige. Lær bokføring, MVA, skattemelding, årsregnskap og systembruk. Grunnkurs, fagkurs og bedriftspakke." />
      </Helmet>

      {/* HERO */}
      <section className="py-28 md:py-44 relative overflow-hidden">
        <div className="absolute inset-0 ambient-glow opacity-30" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl"
          >
            <Link to="/tjenester" className="inline-flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase text-muted-foreground/50 hover:text-foreground transition-colors mb-8 md:mb-12">
              <ArrowLeft size={12} /> Alle tjenester
            </Link>
            <p className="text-[10px] tracking-[0.45em] uppercase text-primary mb-5 md:mb-6">Regnskap & Økonomi · Kurs</p>
            <h1 className="font-heading text-5xl sm:text-6xl md:text-8xl leading-[1.02] mb-8 md:mb-10">
              Regnskapskurs som{" "}
              <span className="italic text-gradient-rose">faktisk gir mening.</span>
            </h1>
            <p className="text-base md:text-xl text-muted-foreground font-light leading-relaxed max-w-2xl mb-10 md:mb-14">
              Praktisk, relevant og rett på sak. Lær bokføring, MVA, skattemelding, årsregnskap og systemer — levert av autoriserte regnskapsførere som jobber med dette hver dag.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#pakker" className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 md:px-10 py-4 bg-primary text-primary-foreground text-sm font-medium tracking-wider rounded-full glow-rose hover:scale-[1.02] transition-all duration-500">
                Se kurspakker
                <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
              </a>
              <Link to="/kontakt" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 md:px-10 py-4 text-sm text-foreground/50 tracking-wider rounded-full border border-border/20 hover:border-primary/20 hover:text-foreground transition-all duration-500">
                Bestill bedriftskurs
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6"><div className="line-accent" /></div>

      {/* Stats */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <AnimatedSection key={s.label} delay={i * 0.08}>
                <div className="text-center">
                  <p className="font-heading text-3xl md:text-4xl text-primary mb-1">{s.value}</p>
                  <p className="text-xs text-muted-foreground tracking-wide uppercase">{s.label}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6"><div className="line-accent" /></div>

      {/* Kurspakker */}
      <section id="pakker" className="py-24 md:py-40 scroll-mt-20">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection>
            <p className="text-[10px] tracking-[0.4em] uppercase text-secondary mb-5">Velg ditt nivå</p>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-5 leading-snug max-w-2xl">
              Tre pakker — <span className="italic text-gradient-rose">ett mål.</span>
            </h2>
            <p className="text-sm md:text-base text-muted-foreground font-light max-w-xl mb-14 md:mb-20">
              Uansett om du starter fra null eller ønsker å spisse eksisterende kompetanse — vi har et kurs som passer.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {packages.map((pkg, i) => (
              <AnimatedSection key={pkg.id} delay={i * 0.1}>
                <div className={`relative p-8 md:p-10 glass rounded-3xl card-lift h-full flex flex-col ${
                  pkg.highlighted ? "border-2 border-primary/40 ring-1 ring-primary/10" : "border border-border/20"
                }`}>
                  {pkg.highlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1 text-[9px] tracking-widest uppercase bg-primary text-primary-foreground px-4 py-1 rounded-full">
                        <Star size={10} /> Mest populær
                      </span>
                    </div>
                  )}

                  <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-2">{pkg.subtitle}</p>
                  <h3 className="font-heading text-2xl md:text-3xl mb-1">{pkg.name}</h3>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="font-heading text-3xl md:text-4xl text-primary">{pkg.price},-</span>
                    <span className="text-xs text-muted-foreground">{pkg.suffix}</span>
                  </div>

                  <div className="space-y-2 mb-6 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2"><Clock size={12} className="text-primary/60" /> {pkg.duration}</div>
                    <div className="flex items-center gap-2"><Calendar size={12} className="text-primary/60" /> {pkg.format}</div>
                    <div className="flex items-center gap-2"><Users size={12} className="text-primary/60" /> {pkg.maxParticipants}</div>
                  </div>

                  <div className="line-accent mb-6" />

                  <ul className="space-y-2.5 mb-8 flex-1">
                    {pkg.features.map(f => (
                      <li key={f} className="flex items-start gap-2.5 text-sm font-light text-foreground/70">
                        <CheckCircle2 size={13} className="text-primary mt-0.5 shrink-0" strokeWidth={1.5} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/kontakt"
                    className={`group w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-medium tracking-wider rounded-full transition-all duration-500 ${
                      pkg.highlighted
                        ? "bg-primary text-primary-foreground glow-rose hover:scale-[1.02]"
                        : "border border-border/30 text-foreground/70 hover:border-primary/30 hover:text-foreground"
                    }`}
                  >
                    {pkg.id === "bedriftspakke" ? "Få tilbud" : "Meld deg på"}
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6"><div className="line-accent" /></div>

      {/* Kursinnhold / Moduler */}
      <section className="py-24 md:py-40">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection>
            <p className="text-[10px] tracking-[0.4em] uppercase text-secondary mb-5">Kursinnhold</p>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-5 leading-snug max-w-3xl">
              Dypt, grundig og <span className="italic text-gradient-rose">praktisk anvendbart.</span>
            </h2>
            <p className="text-sm md:text-base text-muted-foreground font-light max-w-xl mb-14 md:mb-20">
              Hvert emne dekkes med teori, lovverk og praktiske øvelser. Du lærer ikke bare hva — men hvorfor og hvordan.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {modules.map((mod, i) => (
              <AnimatedSection key={mod.category} delay={i * 0.06}>
                <div className="glass rounded-2xl border border-border/20 overflow-hidden">
                  <button
                    onClick={() => setExpandedModule(expandedModule === i ? null : i)}
                    className="w-full flex items-center gap-4 p-6 text-left hover:bg-muted/10 transition-colors"
                  >
                    <div className="w-11 h-11 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                      <mod.icon size={18} className="text-primary" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] tracking-widest uppercase text-primary/60 mb-0.5">{mod.category}</p>
                      <h3 className="font-heading text-lg md:text-xl">{mod.title}</h3>
                    </div>
                    <ChevronDown size={16} className={`text-muted-foreground transition-transform duration-300 ${expandedModule === i ? "rotate-180" : ""}`} />
                  </button>

                  {expandedModule === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-6"
                    >
                      <div className="pt-2 border-t border-border/10">
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                          {mod.topics.map(t => (
                            <li key={t} className="flex items-start gap-2 text-sm font-light text-foreground/70">
                              <CheckCircle2 size={12} className="text-primary/60 mt-0.5 shrink-0" strokeWidth={1.5} />
                              {t}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Hvem passer kursene for */}
      <section className="py-24 md:py-40 border-y border-border/10 relative">
        <div className="absolute inset-0 ambient-glow opacity-15" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <AnimatedSection>
            <p className="text-[10px] tracking-[0.4em] uppercase text-secondary mb-5 md:mb-6">Hvem passer kursene for</p>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-14 md:mb-20 max-w-2xl leading-snug">
              Uansett hvor du er i <span className="italic text-gradient-rose">reisen.</span>
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            {audiences.map((a, i) => (
              <AnimatedSection key={a.title} delay={i * 0.1}>
                <div className="p-8 md:p-10 glass rounded-3xl card-lift h-full">
                  <div className="w-11 h-11 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                    <a.icon size={18} className="text-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-heading text-xl md:text-2xl mb-3">{a.title}</h3>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed">{a.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Hva gjør kursene unike */}
      <section className="py-24 md:py-40">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-14 md:gap-24 items-start">
            <AnimatedSection>
              <p className="text-[10px] tracking-[0.4em] uppercase text-secondary mb-5">Hvorfor Avargo-kurs</p>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-6 leading-snug">
                Ikke teori på PowerPoint — <span className="italic text-gradient-rose">praksis som sitter.</span>
              </h2>
              <p className="text-muted-foreground font-light leading-relaxed text-sm md:text-base">
                Våre kursholdere er autoriserte regnskapsførere som jobber med dette hver eneste dag. Ingen akademisk avstand — men direkte, anvendbar kunnskap hentet fra reell praksis.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.15}>
              <ul className="space-y-4">
                {[
                  { icon: Target, text: "Praktiske caser hentet fra norsk næringsliv" },
                  { icon: Shield, text: "Oppdatert etter siste lovendringer (2024/2025)" },
                  { icon: Award, text: "Kursbevis anerkjent av bransjen" },
                  { icon: Zap, text: "Små grupper — personlig oppfølging" },
                  { icon: BarChart3, text: "Fra teori til implementering i eget selskap" },
                  { icon: Users, text: "Nettverksbygging med andre næringsdrivende" },
                ].map(item => (
                  <li key={item.text} className="flex items-start gap-4 p-4 glass rounded-2xl border border-border/10">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <item.icon size={16} className="text-primary" strokeWidth={1.5} />
                    </div>
                    <span className="text-sm font-light text-foreground/80 pt-1.5">{item.text}</span>
                  </li>
                ))}
              </ul>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="py-20 md:py-28 border-t border-border/10">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection>
            <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground/50 mb-8">Relaterte tjenester</p>
            <div className="flex flex-wrap gap-3">
              {RelatedServices.map(s => (
                <Link key={s.href} to={s.href} className="inline-flex items-center gap-2 px-5 py-2.5 text-[12px] tracking-wide text-muted-foreground border border-border/20 rounded-full hover:border-primary/30 hover:text-foreground transition-all duration-300">
                  {s.label}
                  <ChevronRight size={11} className="text-primary/40" />
                </Link>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 border-t border-border/10 text-center relative">
        <div className="absolute inset-0 ambient-glow opacity-25" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <AnimatedSection>
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-8">
              <GraduationCap size={18} className="text-primary" strokeWidth={1.5} />
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-5 leading-snug max-w-2xl mx-auto">
              Klar for å ta kontroll over tallene?
            </h2>
            <p className="text-muted-foreground font-light mb-10 max-w-md mx-auto text-sm">
              Meld deg på neste kurs eller bestill en skreddersydd pakke for bedriften din. Ingen forpliktelser — bare en uforpliktende prat.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/kontakt" className="group inline-flex items-center gap-3 px-10 md:px-12 py-4 md:py-5 bg-primary text-primary-foreground text-sm font-medium tracking-wider rounded-full glow-rose hover:scale-[1.02] transition-all duration-500">
                Meld deg på kurs
                <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
              </Link>
              <a href="tel:+4712345678" className="inline-flex items-center gap-2 px-8 py-4 text-sm text-foreground/50 tracking-wider rounded-full border border-border/20 hover:border-primary/20 hover:text-foreground transition-all">
                <Phone size={14} /> Ring oss direkte
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
};

export default Kurs;
