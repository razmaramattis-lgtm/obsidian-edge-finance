import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, ChevronDown, ChevronRight, Shield, FileText, Scale, Building2, Users, Calculator, Landmark, Globe, Lock, AlertTriangle, Info, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

/* ────────── DD Categories & Items ────────── */
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

const DD_CATEGORIES: DDCategory[] = [
  {
    id: "corporate",
    title: "Selskapsstruktur",
    icon: Building2,
    description: "Grunnleggende dokumenter og selskapsinformasjon",
    items: [
      { id: "c1", title: "Firmaattest og vedtekter", description: "Oppdatert firmaattest fra Brønnøysund og gjeldende vedtekter for selskapet.", importance: "critical" },
      { id: "c2", title: "Aksjonæravtaler", description: "Eventuelle aksjonæravtaler, eieravtaler eller opsjonsavtaler.", importance: "critical" },
      { id: "c3", title: "Aksjeeierbok", description: "Komplett og oppdatert aksjeeierbok med oversikt over alle eiere.", importance: "critical" },
      { id: "c4", title: "Styreprotokoller (siste 3 år)", description: "Protokoller fra styremøter og generalforsamlinger.", importance: "important" },
      { id: "c5", title: "Organisasjonskart", description: "Oversikt over selskapsstruktur, eventuelle datterselskaper og tilknyttede selskaper.", importance: "important" },
      { id: "c6", title: "Fullmakter", description: "Oversikt over prokura, signaturrett og andre fullmakter.", importance: "important" },
    ],
  },
  {
    id: "financial",
    title: "Økonomi & Regnskap",
    icon: Calculator,
    description: "Regnskapstall, budsjetter og økonomiske forpliktelser",
    items: [
      { id: "f1", title: "Årsregnskap (siste 3 år)", description: "Komplette årsregnskap inkludert noter, revisjonsberetning og styrets årsberetning.", importance: "critical" },
      { id: "f2", title: "Saldobalanse (siste periode)", description: "Oppdatert saldobalanse med hovedbok og kontospesifikasjon.", importance: "critical" },
      { id: "f3", title: "Kundeportefølje og inntektsfordeling", description: "Oversikt over kunder, omsetning per kunde og kundekonsentrasjonsrisiko.", importance: "critical" },
      { id: "f4", title: "Budsjett og prognoser", description: "Budsjett for inneværende og neste år, inkludert underliggende forutsetninger.", importance: "important" },
      { id: "f5", title: "Banklån og kredittavtaler", description: "Oversikt over alle lån, kassekreditter, garantier og pantsettelser.", importance: "critical" },
      { id: "f6", title: "MVA-oppgaver", description: "MVA-oppgaver for siste 2 år og eventuelle korreksjoner.", importance: "important" },
      { id: "f7", title: "Skattemeldinger", description: "Skattemeldinger for selskapet og eventuelle eiere for siste 3 år.", importance: "important" },
      { id: "f8", title: "Goodwill-beregning", description: "Vurdering av merverdi, kundeporteføljens levetid og normalisert inntjening.", importance: "nice" },
    ],
  },
  {
    id: "legal",
    title: "Juridisk",
    icon: Scale,
    description: "Avtaler, tvister og juridiske forpliktelser",
    items: [
      { id: "l1", title: "Vesentlige avtaler", description: "Alle kontrakter med kunder, leverandører, utleier og partnere med årlig verdi over 100 000 kr.", importance: "critical" },
      { id: "l2", title: "Leieavtaler", description: "Leiekontrakt for lokaler inkludert vilkår, løpetid og oppsigelsesfrister.", importance: "important" },
      { id: "l3", title: "Forsikringspoliser", description: "Oversikt over alle forsikringer — ansvar, eiendom, nøkkelperson, cyber.", importance: "important" },
      { id: "l4", title: "Pågående tvister", description: "Oversikt over eventuelle tvister, klager eller rettssaker.", importance: "critical" },
      { id: "l5", title: "Immaterielle rettigheter", description: "Domener, varemerker, lisenser og opphavsrettigheter.", importance: "important" },
      { id: "l6", title: "GDPR/Personvern", description: "Personvernerklæring, databehandleravtaler og behandlingsprotokoll.", importance: "important" },
    ],
  },
  {
    id: "employees",
    title: "Ansatte & HR",
    icon: Users,
    description: "Personalforhold, kontrakter og organisering",
    items: [
      { id: "e1", title: "Ansattoversikt", description: "Komplett oversikt over alle ansatte med rolle, ansiennitet, kompetanse og lønnsnivå.", importance: "critical" },
      { id: "e2", title: "Arbeidsavtaler", description: "Standard arbeidskontrakter og eventuelle tilleggsavtaler.", importance: "critical" },
      { id: "e3", title: "Personalhåndbok", description: "Gjeldende personalhåndbok med regler, retningslinjer og rutiner.", importance: "important" },
      { id: "e4", title: "Bonus- og insentivordninger", description: "Eventuelle bonusavtaler, provisjonsordninger eller aksjeprogram.", importance: "important" },
      { id: "e5", title: "Pensjon og forsikring", description: "OTP-avtale, personforsikringer og andre goder.", importance: "important" },
      { id: "e6", title: "Sykefravær og HMS", description: "Sykefraværsstatistikk og HMS-dokumentasjon.", importance: "nice" },
    ],
  },
  {
    id: "compliance",
    title: "Compliance & Internkontroll",
    icon: Shield,
    description: "Hvitvaskingsrutiner, kvalitetskontroll og tilsyn",
    items: [
      { id: "co1", title: "Hvitvaskingsrutiner", description: "AML-prosedyrer, risikovurdering og KYC-dokumentasjon for kunder.", importance: "critical" },
      { id: "co2", title: "Autorisasjon/godkjenning", description: "Autorisasjonsbevis for regnskapsførere, eventuelle betingelser eller merknader.", importance: "critical" },
      { id: "co3", title: "Kvalitetskontroll", description: "Internkontrollrutiner, kvalitetssikring og eventuelle avvik.", importance: "important" },
      { id: "co4", title: "Tilsynsrapporter", description: "Rapporter fra Finanstilsynet eller andre tilsynsmyndigheter.", importance: "important" },
      { id: "co5", title: "IT-sikkerhet", description: "Sikkerhetspolicyer, tilgangskontroll og backup-rutiner.", importance: "important" },
    ],
  },
  {
    id: "it",
    title: "IT & Systemer",
    icon: Globe,
    description: "Programvare, systemer og digital infrastruktur",
    items: [
      { id: "it1", title: "Regnskapssystem", description: "Oversikt over regnskapssystem, lisenser og antall brukere.", importance: "critical" },
      { id: "it2", title: "Andre systemer", description: "CRM, HRM, prosjektstyring, tidregistrering og øvrig programvare.", importance: "important" },
      { id: "it3", title: "Nettside og domener", description: "Domener, hosting, e-posttjenester og digitale kanaler.", importance: "nice" },
      { id: "it4", title: "Datalagring og skyløsninger", description: "Cloud-tjenester, fillagring og tilgangsstyring.", importance: "important" },
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
    setChecked(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleCat = (id: string) => {
    setExpandedCats(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const totalItems = DD_CATEGORIES.reduce((sum, cat) => sum + cat.items.length, 0);
  const checkedCount = checked.size;
  const overallProgress = totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0;

  return (
    <>
      <Helmet>
        <title>Due Diligence Sjekkliste | Avargo Samarbeid</title>
        <meta name="description" content="Forbered deg til en selskapsgjennomgang med Avargos interaktive due diligence sjekkliste. Få oversikt over alt som trengs — fra selskapsstruktur til compliance." />
      </Helmet>

      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-medium mb-6">
              <Shield size={13} /> Due Diligence
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-5 leading-tight">
              Din Due Diligence<br /><span className="text-primary">Sjekkliste</span>
            </h1>
            <p className="text-muted-foreground md:text-lg leading-relaxed max-w-xl mx-auto">
              Unngå overraskelser og forsinkelser ved en selskapsgjennomgang. Bruk sjekklisten til å forberede alt som trengs — enten du selger, kjøper eller bare vil ha orden i sakene.
            </p>
          </motion.div>
        </div>
      </section>

      {/* How Avargo works section */}
      <section className="pb-16 md:pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="rounded-2xl border border-border/30 bg-muted/10 p-6 md:p-8 mb-12">
              <div className="flex items-start gap-4 mb-5">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Info size={18} className="text-primary" />
                </div>
                <div>
                  <h2 className="font-bold text-lg mb-1">Slik fungerer Avargos due diligence</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Når vi vurderer et samarbeid eller oppkjøp, gjennomfører vi en grundig selskapsgjennomgang for å sikre at begge parter har full transparens. Prosessen er konfidensiell og tilpasset hvert enkelt tilfelle.
                  </p>
                </div>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { step: "01", title: "Kartlegging", desc: "Vi innhenter grunnleggende informasjon og gjør et første utvalg." },
                  { step: "02", title: "Dokumentgjennomgang", desc: "Vi ber om relevante dokumenter fra sjekklisten under." },
                  { step: "03", title: "Vurdering & tilbud", desc: "Vi gjennomgår alt og legger frem et tilbud med tydelige vilkår." },
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
                <span className="text-sm text-muted-foreground">{checkedCount} av {totalItems} punkter ({overallProgress} %)</span>
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
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden">
                          <div className="px-5 pb-5 space-y-1">
                            {cat.items.map(item => {
                              const isChecked = checked.has(item.id);
                              return (
                                <button key={item.id} onClick={() => toggleCheck(item.id)}
                                  className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all ${
                                    isChecked ? "bg-primary/5" : "hover:bg-muted/20"
                                  }`}>
                                  {isChecked
                                    ? <CheckCircle2 size={18} className="text-primary shrink-0 mt-0.5" />
                                    : <Circle size={18} className="text-muted-foreground/40 shrink-0 mt-0.5" />
                                  }
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
                    Ha alltid disse dokumentene oppdatert i et digitalt arkiv — det sparer mye tid og penger ved en selskapsgjennomgang. Besvar gjerne alle punktene i en egen rapport med underliggende dokumentasjon. Dette kalles «Vendor's Due Diligence» og gir deg et forhandlingsfortrinn.
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
