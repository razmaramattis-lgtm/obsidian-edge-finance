import { Link } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, ArrowLeft, CheckCircle2, ChevronRight, Phone,
  BookOpen, GraduationCap, Award, Users, Clock,
  FileText, Calculator, Scale, Receipt, Landmark, Building2,
  Shield, BarChart3, Briefcase, Target, Zap,
  ChevronDown, X, Search, Filter
} from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { Helmet } from "react-helmet-async";

/* ───────── Kategorier ───────── */
const categories = [
  { id: "alle", label: "Alle kurs", icon: BookOpen },
  { id: "bokforing", label: "Bokføring", icon: BookOpen },
  { id: "mva", label: "MVA", icon: Receipt },
  { id: "skatt", label: "Skatt & Skattelov", icon: Scale },
  { id: "arsregnskap", label: "Årsregnskap", icon: FileText },
  { id: "lonn", label: "Lønn & Personal", icon: Calculator },
  { id: "system", label: "System & Rutiner", icon: Landmark },
  { id: "selskapsrett", label: "Selskapsrett", icon: Building2 },
  { id: "analyse", label: "Analyse & Rapportering", icon: BarChart3 },
];

/* ───────── 100+ minikurs ───────── */
const allCourses = [
  // Bokføring
  { id: 1, name: "Innføring i bokføringsloven", cat: "bokforing" },
  { id: 2, name: "Kontoplan NS 4102 – oppbygging", cat: "bokforing" },
  { id: 3, name: "Bilagshåndtering og dokumentasjonskrav", cat: "bokforing" },
  { id: 4, name: "Kassasystem og kontantsalg", cat: "bokforing" },
  { id: 5, name: "Oppbevaringsplikten (5 år)", cat: "bokforing" },
  { id: 6, name: "Spesifikasjoner og pliktig rapportering", cat: "bokforing" },
  { id: 7, name: "Åpnings- og avslutningsbalanse", cat: "bokforing" },
  { id: 8, name: "Kontoavstemminger", cat: "bokforing" },
  { id: 9, name: "Prosjektregnskap", cat: "bokforing" },
  { id: 10, name: "Valutabokføring", cat: "bokforing" },
  { id: 11, name: "Konsernbokføring grunnleggende", cat: "bokforing" },
  { id: 12, name: "Anleggsmiddelregister", cat: "bokforing" },
  { id: 13, name: "Varelager og varetelling", cat: "bokforing" },
  { id: 14, name: "Kundefordringer og aldersfordeling", cat: "bokforing" },
  { id: 15, name: "Leverandørgjeld og betalingsrutiner", cat: "bokforing" },
  { id: 16, name: "Bankavstemminger i praksis", cat: "bokforing" },
  { id: 17, name: "Periodisering av inntekter og kostnader", cat: "bokforing" },

  // MVA
  { id: 18, name: "MVA-registrering og grenser", cat: "mva" },
  { id: 19, name: "Utgående vs. inngående MVA", cat: "mva" },
  { id: 20, name: "Fradragsrett og begrensninger", cat: "mva" },
  { id: 21, name: "MVA ved import", cat: "mva" },
  { id: 22, name: "MVA ved eksport", cat: "mva" },
  { id: 23, name: "Omvendt avgiftsplikt", cat: "mva" },
  { id: 24, name: "MVA-meldingen – termin og innlevering", cat: "mva" },
  { id: 25, name: "Justeringsregler for kapitalvarer", cat: "mva" },
  { id: 26, name: "Unntatte omsetninger", cat: "mva" },
  { id: 27, name: "Fritatte omsetninger", cat: "mva" },
  { id: 28, name: "MVA-kompensasjon for kommuner", cat: "mva" },
  { id: 29, name: "MVA på fast eiendom", cat: "mva" },
  { id: 30, name: "MVA ved utleie av næringslokaler", cat: "mva" },
  { id: 31, name: "Fellesregistrering MVA", cat: "mva" },
  { id: 32, name: "MVA ved kjøp av tjenester fra utlandet", cat: "mva" },
  { id: 33, name: "Korrigering av MVA-feil", cat: "mva" },
  { id: 34, name: "MVA-representant for utenlandske selskaper", cat: "mva" },

  // Skatt
  { id: 35, name: "Skatteplikt for AS", cat: "skatt" },
  { id: 36, name: "Skatteplikt for ENK", cat: "skatt" },
  { id: 37, name: "Alminnelig inntekt vs. personinntekt", cat: "skatt" },
  { id: 38, name: "Foretaksmodellen", cat: "skatt" },
  { id: 39, name: "Aksjonærmodellen", cat: "skatt" },
  { id: 40, name: "Utbytte og utbytteskatt", cat: "skatt" },
  { id: 41, name: "Fradragsberettigede kostnader", cat: "skatt" },
  { id: 42, name: "Skattemessige avskrivninger (saldogrupper)", cat: "skatt" },
  { id: 43, name: "Skattemelding for selskap (RF-1028)", cat: "skatt" },
  { id: 44, name: "Forskuddsskatt og terminskatt", cat: "skatt" },
  { id: 45, name: "Skatteplanlegging for eier", cat: "skatt" },
  { id: 46, name: "Aksjonærregisteroppgaven (RF-1086)", cat: "skatt" },
  { id: 47, name: "Skatt ved salg av aksjer", cat: "skatt" },
  { id: 48, name: "Skatt ved salg av eiendom", cat: "skatt" },
  { id: 49, name: "Skatt ved omdanning ENK til AS", cat: "skatt" },
  { id: 50, name: "Skattefri omorganisering (fisjon/fusjon)", cat: "skatt" },
  { id: 51, name: "Formuesskatt og verdsettelse", cat: "skatt" },
  { id: 52, name: "Skattemessig underskudd – fremføring", cat: "skatt" },
  { id: 53, name: "Kildeskatt på utbytte til utlandet", cat: "skatt" },
  { id: 54, name: "Transfer pricing – grunnleggende", cat: "skatt" },
  { id: 55, name: "Skatteetaten – klage og endring", cat: "skatt" },

  // Årsregnskap
  { id: 56, name: "Regnskapslovens krav", cat: "arsregnskap" },
  { id: 57, name: "Resultatregnskap – oppstilling", cat: "arsregnskap" },
  { id: 58, name: "Balanse – eiendeler, gjeld og EK", cat: "arsregnskap" },
  { id: 59, name: "Notekrav for små foretak", cat: "arsregnskap" },
  { id: 60, name: "Kontantstrømoppstilling", cat: "arsregnskap" },
  { id: 61, name: "Årsberetning (når påkrevet)", cat: "arsregnskap" },
  { id: 62, name: "Revisjon vs. fravalg av revisjon", cat: "arsregnskap" },
  { id: 63, name: "Innsending til Regnskapsregisteret", cat: "arsregnskap" },
  { id: 64, name: "Konsernregnskap – grunnleggende", cat: "arsregnskap" },
  { id: 65, name: "Nedskrivning av eiendeler", cat: "arsregnskap" },
  { id: 66, name: "Avsetninger og betingede forpliktelser", cat: "arsregnskap" },
  { id: 67, name: "Hendelser etter balansedagen", cat: "arsregnskap" },
  { id: 68, name: "Regnskapsmessig vs. skattemessig verdi", cat: "arsregnskap" },
  { id: 69, name: "Utsatt skatt / skattefordel", cat: "arsregnskap" },
  { id: 70, name: "Egenkapitaltransaksjoner", cat: "arsregnskap" },

  // Lønn & Personal
  { id: 71, name: "A-meldingen – rapportering", cat: "lonn" },
  { id: 72, name: "Feriepengeavsetning og -utbetaling", cat: "lonn" },
  { id: 73, name: "Arbeidsgiveravgift (diff. satser)", cat: "lonn" },
  { id: 74, name: "Naturalytelser og fordelsbeskatning", cat: "lonn" },
  { id: 75, name: "Sykepenger og refusjonsordninger", cat: "lonn" },
  { id: 76, name: "OTP – obligatorisk tjenestepensjon", cat: "lonn" },
  { id: 77, name: "Firmabil – beregning og rapportering", cat: "lonn" },
  { id: 78, name: "Elektronisk kommunikasjon (telefon)", cat: "lonn" },
  { id: 79, name: "Reiseregning og diett", cat: "lonn" },
  { id: 80, name: "Overtid og tillegg", cat: "lonn" },
  { id: 81, name: "Sluttvederlag og oppsigelse", cat: "lonn" },
  { id: 82, name: "Arbeidsmiljølovens krav", cat: "lonn" },
  { id: 83, name: "Permisjoner og permisjonstyper", cat: "lonn" },
  { id: 84, name: "Innleid arbeidskraft – regler", cat: "lonn" },
  { id: 85, name: "Utenlandsk arbeidskraft – skatt og rapportering", cat: "lonn" },
  { id: 86, name: "Styrehonorar og godtgjørelser", cat: "lonn" },
  { id: 87, name: "Aksjer og opsjoner til ansatte", cat: "lonn" },

  // System & Rutiner
  { id: 88, name: "Tripletex – grunnkurs", cat: "system" },
  { id: 89, name: "Tripletex – avansert", cat: "system" },
  { id: 90, name: "Fiken – grunnkurs", cat: "system" },
  { id: 91, name: "Fiken – avansert", cat: "system" },
  { id: 92, name: "Visma eAccounting – grunnkurs", cat: "system" },
  { id: 93, name: "Visma Business – grunnkurs", cat: "system" },
  { id: 94, name: "Bankintegrasjon og autobank", cat: "system" },
  { id: 95, name: "Fakturering og purrerutiner", cat: "system" },
  { id: 96, name: "Internkontrollrutiner", cat: "system" },
  { id: 97, name: "Periodeavslutning (måned/kvartal)", cat: "system" },
  { id: 98, name: "Avstemming av bank, MVA og lønn", cat: "system" },
  { id: 99, name: "GDPR og personvern i regnskapet", cat: "system" },
  { id: 100, name: "Sikkerhetskopi og oppbevaring", cat: "system" },
  { id: 101, name: "EHF-faktura og Peppol", cat: "system" },
  { id: 102, name: "Automatisering av bilagsflyt", cat: "system" },
  { id: 103, name: "Integrasjon med nettbutikk", cat: "system" },

  // Selskapsrett
  { id: 104, name: "Stiftelse av AS", cat: "selskapsrett" },
  { id: 105, name: "Aksjonæravtale – innhold og fallgruver", cat: "selskapsrett" },
  { id: 106, name: "Styrets plikter og ansvar", cat: "selskapsrett" },
  { id: 107, name: "Generalforsamling – gjennomføring", cat: "selskapsrett" },
  { id: 108, name: "Kapitalforhøyelse og -nedsettelse", cat: "selskapsrett" },
  { id: 109, name: "Fusjon i praksis", cat: "selskapsrett" },
  { id: 110, name: "Fisjon i praksis", cat: "selskapsrett" },
  { id: 111, name: "Omdanning ENK til AS", cat: "selskapsrett" },
  { id: 112, name: "Avvikling og sletting av selskap", cat: "selskapsrett" },
  { id: 113, name: "Holdingselskap – struktur og fordeler", cat: "selskapsrett" },
  { id: 114, name: "Konsernstruktur – oppbygging", cat: "selskapsrett" },
  { id: 115, name: "Nærstående transaksjoner", cat: "selskapsrett" },
  { id: 116, name: "Handleplikt ved tap av EK", cat: "selskapsrett" },

  // Analyse & Rapportering
  { id: 117, name: "Nøkkeltallsanalyse – grunnleggende", cat: "analyse" },
  { id: 118, name: "Likviditetsbudsjettering", cat: "analyse" },
  { id: 119, name: "Resultatbudsjettering", cat: "analyse" },
  { id: 120, name: "Break-even-analyse", cat: "analyse" },
  { id: 121, name: "Dekningsbidragsanalyse", cat: "analyse" },
  { id: 122, name: "Kontantstrømanalyse", cat: "analyse" },
  { id: 123, name: "Benchmarking mot bransje", cat: "analyse" },
  { id: 124, name: "KPI-er for økonomi", cat: "analyse" },
  { id: 125, name: "Månedsrapportering til styre", cat: "analyse" },
  { id: 126, name: "Dashboard og visualisering", cat: "analyse" },
  { id: 127, name: "Prognoser og scenarioanalyse", cat: "analyse" },
  { id: 128, name: "Investeringsanalyse (NPV/IRR)", cat: "analyse" },
  { id: 129, name: "Due diligence – finansiell", cat: "analyse" },
  { id: 130, name: "Verdsettelse av virksomhet", cat: "analyse" },
];

/* ───────── Hvem passer kursene for ───────── */
const audiences = [
  { icon: Building2, title: "Gründere & Oppstartsbedrifter", desc: "Lær regnskapet fra dag én. Forstå hva du må levere, når det skal leveres — og hvordan du unngår de vanligste feilene." },
  { icon: Users, title: "Daglige ledere & Styremedlemmer", desc: "Forstå tallene i selskapet ditt. Ta bedre beslutninger basert på resultatregnskap, likviditet og skatteposisjon." },
  { icon: Briefcase, title: "Økonomiansvarlige & Regnskapsmedarbeidere", desc: "Oppdater kunnskapen. Lær avanserte emner som periodisering, konsernregnskap og skatteoptimalisering." },
  { icon: GraduationCap, title: "Studenter & Karriereskiftere", desc: "Bygg en solid base. Kursbevis fra Avargo gir et fortrinn i arbeidsmarkedet og praktisk kompetanse fra dag én." },
];

const stats = [
  { value: "130+", label: "Tilgjengelige kurs" },
  { value: "500,-", label: "Per kurs" },
  { value: "98%", label: "Anbefaler oss" },
  { value: "4.9/5", label: "Gjennomsnittlig rating" },
];

const RelatedServices = [
  { label: "Dedikert regnskapsfører", href: "/tjenester/regnskapsforer" },
  { label: "CFO-as-a-Service", href: "/tjenester/cfo" },
  { label: "AI-drevet finansiell innsikt", href: "/tjenester/ai-innsikt" },
  { label: "Lønn & HR", href: "/tjenester/hr-og-lonn" },
];

/* ───────── Bestillingsskjema modal ───────── */
const BookingModal = ({ course, onClose }: { course: typeof allCourses[0] | null; onClose: () => void }) => {
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  if (!course) return null;

  const catLabel = categories.find(c => c.id === course.cat)?.label || course.cat;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    // Simulate sending — replace with real endpoint later
    await new Promise(r => setTimeout(r, 800));
    setSending(false);
    setSubmitted(true);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-lg glass rounded-3xl border border-border/20 p-8 md:p-10"
          onClick={e => e.stopPropagation()}
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors">
            <X size={18} />
          </button>

          {submitted ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={24} className="text-primary" />
              </div>
              <h3 className="font-heading text-2xl mb-2">Bestilling mottatt!</h3>
              <p className="text-sm text-muted-foreground font-light mb-2">Vi kontakter deg innen 24 timer for å avtale tid.</p>
              <p className="text-xs text-muted-foreground">Kurs: <span className="text-foreground">{course.name}</span></p>
              <button onClick={onClose} className="mt-6 px-6 py-2.5 bg-primary text-primary-foreground rounded-full text-sm hover:opacity-90 transition-opacity">Lukk</button>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-[9px] tracking-[0.4em] uppercase text-primary mb-2">Bestill kurs</p>
                <h3 className="font-heading text-xl md:text-2xl mb-1">{course.name}</h3>
                <p className="text-xs text-muted-foreground">{catLabel}</p>
                <div className="flex items-baseline gap-1 mt-3">
                  <span className="font-heading text-2xl text-primary">500,-</span>
                  <span className="text-xs text-muted-foreground">per deltaker</span>
                </div>
              </div>

              <div className="line-accent mb-6" />

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Fullt navn *</label>
                  <input
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    required
                    placeholder="Ola Nordmann"
                    className="w-full h-11 rounded-xl border border-border/30 bg-muted/20 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Telefon *</label>
                  <input
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    required
                    type="tel"
                    placeholder="+47 XXX XX XXX"
                    className="w-full h-11 rounded-xl border border-border/30 bg-muted/20 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">E-post *</label>
                  <input
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    required
                    type="email"
                    placeholder="ola@firma.no"
                    className="w-full h-11 rounded-xl border border-border/30 bg-muted/20 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                  />
                </div>

                <div className="glass rounded-xl p-3 border border-border/10">
                  <p className="text-xs text-muted-foreground font-light">
                    <span className="text-foreground font-medium">Valgt kurs:</span> {course.name} — <span className="text-primary font-medium">kr 500,-</span>
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full py-3.5 bg-primary text-primary-foreground rounded-full text-sm font-medium tracking-wider glow-rose hover:scale-[1.01] transition-all duration-300 disabled:opacity-50"
                >
                  {sending ? "Sender bestilling…" : "Bestill kurs — 500,-"}
                </button>
              </form>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ───────── Hovedkomponent ───────── */
const Kurs = () => {
  const [activeCat, setActiveCat] = useState("alle");
  const [search, setSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<typeof allCourses[0] | null>(null);

  const filtered = allCourses.filter(c => {
    const matchCat = activeCat === "alle" || c.cat === activeCat;
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <>
      <Helmet>
        <title>Regnskapskurs — 130+ kurs fra kr 500,- | Avargo</title>
        <meta name="description" content="Velg blant 130+ spesialiserte regnskapskurs. Bokføring, MVA, skatt, årsregnskap, lønn, systemer og mer. Kun kr 500,- per kurs." />
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
              130+ kurs.{" "}
              <span className="italic text-gradient-rose">Én pris.</span>
            </h1>
            <p className="text-base md:text-xl text-muted-foreground font-light leading-relaxed max-w-2xl mb-10 md:mb-14">
              Velg akkurat det kurset du trenger — fra bokføring og MVA til skattelov og systemopplæring. Alle kurs koster <span className="text-primary font-medium">kr 500,-</span> per deltaker.
            </p>
            <a href="#kurs" className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 md:px-10 py-4 bg-primary text-primary-foreground text-sm font-medium tracking-wider rounded-full glow-rose hover:scale-[1.02] transition-all duration-500">
              Se alle kurs
              <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
            </a>
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

      {/* Kurskatalog */}
      <section id="kurs" className="py-24 md:py-40 scroll-mt-20">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection>
            <p className="text-[10px] tracking-[0.4em] uppercase text-secondary mb-5">Kurskatalog</p>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-5 leading-snug max-w-3xl">
              Finn kurset <span className="italic text-gradient-rose">du trenger.</span>
            </h2>
            <p className="text-sm md:text-base text-muted-foreground font-light max-w-xl mb-10">
              Filtrer etter kategori eller søk direkte. Klikk på et kurs for å bestille.
            </p>
          </AnimatedSection>

          {/* Filter & Søk */}
          <div className="mb-8 space-y-4">
            <div className="relative max-w-md">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Søk etter kurs…"
                className="w-full h-11 rounded-full border border-border/20 bg-muted/20 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCat(cat.id)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs tracking-wide transition-all duration-300 ${
                    activeCat === cat.id
                      ? "bg-primary text-primary-foreground"
                      : "border border-border/20 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                  }`}
                >
                  <cat.icon size={12} />
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Resultater */}
          <p className="text-xs text-muted-foreground mb-4">{filtered.length} kurs funnet</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((course, i) => {
              const catInfo = categories.find(c => c.id === course.cat);
              const CatIcon = catInfo?.icon || BookOpen;
              return (
                <motion.button
                  key={course.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(i * 0.02, 0.4) }}
                  onClick={() => setSelectedCourse(course)}
                  className="group text-left glass rounded-2xl px-5 py-4 border border-border/20 hover:border-primary/30 transition-all duration-300 flex items-center gap-4"
                >
                  <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <CatIcon size={14} className="text-primary" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">{course.name}</p>
                    <p className="text-[10px] text-muted-foreground">{catInfo?.label}</p>
                  </div>
                  <span className="text-xs text-primary font-medium shrink-0">500,-</span>
                </motion.button>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <Filter size={28} className="mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-sm text-muted-foreground">Ingen kurs funnet. Prøv et annet søk eller kategori.</p>
            </div>
          )}
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6"><div className="line-accent" /></div>

      {/* Hvem passer kursene for */}
      <section className="py-24 md:py-40 relative">
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
              Velg blant 130+ kurs og bestill direkte. Kun kr 500,- per kurs, per deltaker.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#kurs" className="group inline-flex items-center gap-3 px-10 md:px-12 py-4 md:py-5 bg-primary text-primary-foreground text-sm font-medium tracking-wider rounded-full glow-rose hover:scale-[1.02] transition-all duration-500">
                Se alle kurs
                <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
              </a>
              <a href="tel:+4712345678" className="inline-flex items-center gap-2 px-8 py-4 text-sm text-foreground/50 tracking-wider rounded-full border border-border/20 hover:border-primary/20 hover:text-foreground transition-all">
                <Phone size={14} /> Ring oss direkte
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Booking Modal */}
      {selectedCourse && <BookingModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />}
    </>
  );
};

export default Kurs;
