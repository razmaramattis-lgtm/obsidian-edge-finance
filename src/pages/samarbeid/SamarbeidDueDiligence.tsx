import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, ChevronDown, ChevronRight, Shield, Building2, Users, Calculator, Monitor, FileText, Info, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

/* ────────── Types ────────── */
interface DDItem {
  id: string;
  title: string;
  description: string;
  importance: "critical" | "important" | "nice";
}

interface DDCategory {
  id: string;
  title: string;
  icon: any;
  description: string;
  items: DDItem[];
}

/* ────────── Tailored DD for accounting firm acquisitions ────────── */
const DD_CATEGORIES: DDCategory[] = [
  {
    id: "corporate",
    title: "Selskap & Eierskap",
    icon: Building2,
    description: "Selskapsdokumenter, eierforhold og organisering",
    items: [
      { id: "c1", title: "Firmaattest og vedtekter", description: "Oppdatert firmaattest og gjeldende vedtekter.", importance: "critical" },
      { id: "c2", title: "Aksjeeierbok", description: "Komplett aksjeeierbok med alle historiske endringer.", importance: "critical" },
      { id: "c3", title: "Aksjonæravtaler", description: "Eventuelle aksjonær- eller opsjonsavtaler.", importance: "critical" },
      { id: "c4", title: "Styreprotokoller (siste 3 år)", description: "Protokoller fra styre- og generalforsamlinger.", importance: "important" },
      { id: "c5", title: "Organisasjonskart", description: "Struktur, eventuelle datterselskaper og konsernforhold.", importance: "nice" },
    ],
  },
  {
    id: "financial",
    title: "Økonomi & Regnskap",
    icon: Calculator,
    description: "Regnskapstall, inntekter og økonomiske forpliktelser",
    items: [
      { id: "f1", title: "Årsregnskap (siste 3 år)", description: "Komplette årsregnskap med noter og revisjonsberetning.", importance: "critical" },
      { id: "f2", title: "Omsetning siste 12 mnd", description: "Oppdatert omsetningsrapport per måned.", importance: "critical" },
      { id: "f3", title: "Inntekt per kunde (topp 10)", description: "Inntektsfordeling og kundekonsentrasjonsrisiko.", importance: "critical" },
      { id: "f4", title: "Gjennomsnittlig kundeverdi", description: "Gjennomsnittlig årlig omsetning per kunde.", importance: "important" },
      { id: "f5", title: "Lønnskostnader og marginer", description: "Lønnskostnader, bruttomargin og dekningsgrad.", importance: "critical" },
      { id: "f6", title: "Utestående fordringer", description: "Aldersfordelt oversikt og tap på fordringer.", importance: "important" },
      { id: "f7", title: "Lån, kreditt og pantsettelser", description: "Oversikt over banklån, kassekreditt og garantier.", importance: "important" },
    ],
  },
  {
    id: "clients",
    title: "Kundeportefølje",
    icon: Users,
    description: "Kunder, kontrakter og kunderelasjoner",
    items: [
      { id: "k1", title: "Komplett kundeliste", description: "Alle aktive kunder med org.nr, bransje og tjenester levert.", importance: "critical" },
      { id: "k2", title: "Antall kunder", description: "Totalt antall aktive kunder, fordelt på tjenestetype.", importance: "critical" },
      { id: "k3", title: "Oppdragsavtaler", description: "Standard oppdragsavtaler og eventuelle spesialavtaler.", importance: "critical" },
      { id: "k4", title: "Oppsigelsesvilkår", description: "Oppsigelsesfrister og bindingstid i kundeavtaler.", importance: "important" },
      { id: "k5", title: "Kundetilfredshet", description: "Eventuelle kundeundersøkelser, tilbakemeldinger eller NPS.", importance: "nice" },
      { id: "k6", title: "Kundefrafall siste 2 år", description: "Antall tapte kunder og årsaker til frafall.", importance: "important" },
    ],
  },
  {
    id: "employees",
    title: "Ansatte & Kompetanse",
    icon: Users,
    description: "Medarbeidere, kompetanse og kontrakter",
    items: [
      { id: "e1", title: "Ansattoversikt", description: "Alle ansatte med rolle, ansiennitet, autorisasjon og kompetanse.", importance: "critical" },
      { id: "e2", title: "Autoriserte regnskapsførere", description: "Hvem har autorisasjon og status på denne.", importance: "critical" },
      { id: "e3", title: "Arbeidsavtaler", description: "Standardkontrakter og eventuelle tilleggsavtaler.", importance: "critical" },
      { id: "e4", title: "Konkurranseklausuler", description: "Eventuelle konkurranseforbud eller kundeklausuler hos ansatte.", importance: "important" },
      { id: "e5", title: "Lønnsnivå og goder", description: "Lønnsoversikt, bonus, pensjon (OTP) og andre goder.", importance: "important" },
      { id: "e6", title: "Sykefravær", description: "Sykefraværsstatistikk siste 2 år.", importance: "nice" },
    ],
  },
  {
    id: "compliance",
    title: "Autorisasjon & Compliance",
    icon: Shield,
    description: "Tilsynskrav, hvitvasking og kvalitetssikring",
    items: [
      { id: "co1", title: "Autorisasjonsbevis", description: "Byråets autorisasjon som regnskapsførerselskap fra Finanstilsynet.", importance: "critical" },
      { id: "co2", title: "Hvitvaskingsrutiner (AML)", description: "Risikovurdering, KYC-prosedyrer og kundekontroll.", importance: "critical" },
      { id: "co3", title: "Kvalitetskontroll (ISQM 1)", description: "Internkontrollsystem og kvalitetssikringsrutiner.", importance: "critical" },
      { id: "co4", title: "Tilsynsrapporter", description: "Rapporter eller merknader fra Finanstilsynet.", importance: "important" },
      { id: "co5", title: "GDPR og databehandleravtaler", description: "Personvernerklæring, behandlingsprotokoll og DPA-er.", importance: "important" },
    ],
  },
  {
    id: "it",
    title: "IT & Systemer",
    icon: Monitor,
    description: "Regnskapssystemer, IT-oppsett og lisenser",
    items: [
      { id: "it1", title: "Regnskapssystem", description: "Hvilket system brukes (Tripletex, Visma, Fiken, etc.) og antall lisenser.", importance: "critical" },
      { id: "it2", title: "Lønnssystem", description: "Lønnssystem, integrasjoner og antall lønnsslipp per måned.", importance: "important" },
      { id: "it3", title: "Andre systemer", description: "CRM, prosjektstyring, tidregistrering, dokumenthåndtering.", importance: "important" },
      { id: "it4", title: "Skyløsninger og backup", description: "Cloud-oppsett, fillagring, backup-rutiner.", importance: "important" },
      { id: "it5", title: "IT-sikkerhet", description: "Tilgangskontroll, tofaktorautentisering, brannmur.", importance: "nice" },
    ],
  },
  {
    id: "legal",
    title: "Juridisk",
    icon: FileText,
    description: "Avtaler, tvister og forsikring",
    items: [
      { id: "l1", title: "Leieavtale for lokaler", description: "Leiekontrakt med vilkår, løpetid og oppsigelsesfrister.", importance: "important" },
      { id: "l2", title: "Forsikringer", description: "Profesjonsansvar, bedriftsforsikring og cyber.", importance: "critical" },
      { id: "l3", title: "Pågående tvister", description: "Eventuelle klager, krav eller rettssaker.", importance: "critical" },
      { id: "l4", title: "Leverandøravtaler", description: "Bindende avtaler med programvareleverandører og andre.", importance: "important" },
      { id: "l5", title: "Domener og varemerker", description: "Nettside, domener, e-post og foretaksnavn.", importance: "nice" },
    ],
  },
];

const importanceBadge = (imp: DDItem["importance"]) => {
  switch (imp) {
    case "critical": return <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-destructive/10 text-destructive">Kritisk</span>;
    case "important": return <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-secondary/20 text-secondary-foreground">Viktig</span>;
    case "nice": return <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-primary/10 text-primary">Anbefalt</span>;
  }
};

/* ────────── Component ────────── */
const SamarbeidDueDiligence = () => {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set(["corporate"]));

  const toggleCheck = (id: string) => {
    setChecked(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  };
  const toggleCat = (id: string) => {
    setExpandedCats(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  };

  const totalItems = DD_CATEGORIES.reduce((sum, cat) => sum + cat.items.length, 0);
  const checkedCount = checked.size;
  const overallProgress = totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0;

  return (
    <>
      <Helmet>
        <title>Due Diligence for Regnskapsbyrå | Avargo</title>
        <meta name="description" content="Interaktiv due diligence sjekkliste skreddersydd for oppkjøp av regnskapsbyrå. Forbered deg på selskapsgjennomgangen med Avargo." />
      </Helmet>

      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-medium mb-6">
              <Shield size={13} /> Due Diligence — Regnskapsbyrå
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-5 leading-tight">
              Due Diligence<br /><span className="text-primary">Sjekkliste</span>
            </h1>
            <p className="text-muted-foreground md:text-lg leading-relaxed max-w-xl mx-auto">
              Skreddersydd for oppkjøp av regnskapsbyrå. Gå gjennom alle punktene for å sikre en trygg og ryddig prosess.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="pb-16 md:pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">

            {/* How it works */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="rounded-2xl border border-border/30 bg-muted/10 p-6 md:p-8 mb-12">
              <div className="flex items-start gap-4 mb-5">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Info size={18} className="text-primary" />
                </div>
                <div>
                  <h2 className="font-bold text-lg mb-1">Slik bruker du sjekklisten</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Gå gjennom punktene og kryss av etter hvert som du samler inn dokumentasjon. Fokuser på de kritiske punktene først. Alt merket «Anbefalt» er nice-to-have, men ikke avgjørende.
                  </p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { step: "01", title: "Send oss kartlegging", desc: "Fyll ut kartleggingsskjemaet med grunnleggende info om byrået ditt." },
                  { step: "02", title: "Samle dokumenter", desc: "Bruk sjekklisten under til å samle all relevant dokumentasjon." },
                  { step: "03", title: "Avargo vurderer", desc: "Vi gjennomgår alt og presenterer et tilbud med tydelige vilkår." },
                  { step: "04", title: "Vi går videre", desc: "Enighet om vilkår og vi starter prosessen med overgang sammen." },
                ].map(s => (
                  <div key={s.step} className="rounded-xl bg-background border border-border/30 p-4">
                    <span className="text-xs font-bold text-primary mb-1 block">{s.step}</span>
                    <p className="font-semibold text-sm mb-1">{s.title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Progress bar */}
            <div className="sticky top-20 md:top-[84px] z-30 bg-background/90 backdrop-blur-xl py-4 mb-8 border-b border-border/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Fremgang</span>
                <span className="text-sm text-muted-foreground">{checkedCount} av {totalItems} ({overallProgress} %)</span>
              </div>
              <div className="h-2 w-full bg-muted/30 rounded-full overflow-hidden">
                <motion.div className="h-full bg-primary rounded-full" animate={{ width: `${overallProgress}%` }} transition={{ duration: 0.4 }} />
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-4">
              {DD_CATEGORIES.map((cat, catIdx) => {
                const Icon = cat.icon;
                const expanded = expandedCats.has(cat.id);
                const catChecked = cat.items.filter(i => checked.has(i.id)).length;
                return (
                  <motion.div key={cat.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * catIdx }}
                    className="rounded-2xl border border-border/30 bg-background overflow-hidden">
                    <button onClick={() => toggleCat(cat.id)}
                      className="w-full flex items-center gap-4 p-5 text-left hover:bg-muted/20 transition-colors">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon size={18} className="text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm">{cat.title}</p>
                        <p className="text-xs text-muted-foreground">{cat.description}</p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs text-muted-foreground">{catChecked}/{cat.items.length}</span>
                        {expanded ? <ChevronDown size={16} className="text-muted-foreground" /> : <ChevronRight size={16} className="text-muted-foreground" />}
                      </div>
                    </button>
                    <AnimatePresence>
                      {expanded && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                          <div className="px-5 pb-5 space-y-1">
                            {cat.items.map(item => {
                              const isChecked = checked.has(item.id);
                              return (
                                <button key={item.id} onClick={() => toggleCheck(item.id)}
                                  className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all ${isChecked ? "bg-primary/5" : "hover:bg-muted/20"}`}>
                                  {isChecked ? <CheckCircle2 size={18} className="text-primary shrink-0 mt-0.5" /> : <Circle size={18} className="text-muted-foreground/40 shrink-0 mt-0.5" />}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className={`text-sm font-medium ${isChecked ? "line-through text-muted-foreground" : ""}`}>{item.title}</span>
                                      {importanceBadge(item.importance)}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.description}</p>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>

            {/* Tip */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="mt-10 rounded-2xl border border-primary/20 bg-primary/5 p-6">
              <div className="flex items-start gap-3">
                <Sparkles size={18} className="text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm mb-1">Tips fra Avargo</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Samle alle dokumentene i én digital mappe (et «datarom») før prosessen starter. Det sparer enormt med tid. Husk at kundeporteføljen og autorisasjonen er de viktigste verdi­driverne i et regnskapsbyrå.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="mt-10 text-center">
              <p className="text-muted-foreground text-sm mb-4">Klar for neste steg? Start en uforpliktende kartlegging.</p>
              <Link to="/samarbeid/soknad" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity shadow-xl shadow-primary/25">
                <Sparkles size={15} /> Start kartlegging
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SamarbeidDueDiligence;
