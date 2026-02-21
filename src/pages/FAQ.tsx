import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Search, ChevronDown } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

interface FAQItem {
  q: string;
  a: string;
}

interface FAQCategory {
  title: string;
  items: FAQItem[];
}

const categories: FAQCategory[] = [
  {
    title: "Regnskap & Regnskapsfører",
    items: [
      { q: "Hva koster en regnskapsfører?", a: "Hos Avargo starter prisene fra 1 499 kr/mnd for nyoppstartede selskaper. Alt er inkludert i fastprisen — bokføring, årsregnskap, skattemelding, MVA-rapportering og rådgivning. Du betaler aldri ekstra for telefoner, spørsmål eller rådgivning." },
      { q: "Hva gjør en regnskapsfører?", a: "En regnskapsfører håndterer den økonomiske administrasjonen i bedriften din: løpende bokføring av bilag, MVA-rapportering og innlevering, årsregnskap og næringsoppgave, skattemelding for selskap og eier, aksjonærregisteroppgave og proaktiv rådgivning. Hos Avargo får du én fast person som kjenner selskapet ditt og bransjen din." },
      { q: "Hvordan bytter jeg regnskapsfører?", a: "Å bytte regnskapsfører er enklere enn de fleste tror: 1) Ta kontakt med oss for en uforpliktende samtale. 2) Vi sender oppsigelsesbrev til din nåværende regnskapsfører. 3) Vi henter alle data og setter opp systemene. 4) Du får en dedikert regnskapsfører fra dag én. Hele prosessen tar vanligvis 2-4 uker, og vi håndterer alt det praktiske." },
      { q: "Trenger jeg en autorisert regnskapsfører?", a: "Ja, i Norge er det lovpålagt at regnskapsførere som tilbyr tjenester til andre må være autorisert av Finanstilsynet. Alle regnskapsførere hos Avargo er autoriserte og holder seg kontinuerlig oppdatert på gjeldende regelverk gjennom obligatorisk etterutdanning." },
      { q: "Hva er forskjellen mellom regnskapsfører og revisor?", a: "En regnskapsfører fører regnskapet ditt løpende gjennom året — bokføring, MVA, lønn og årsregnskap. En revisor kontrollerer regnskapet i etterkant og avgir en uavhengig beretning. De fleste små og mellomstore bedrifter trenger en regnskapsfører, men ikke nødvendigvis revisor. Revisjonsplikten gjelder først når to av tre vilkår er oppfylt: over 7 MNOK i driftsinntekter, over 27 MNOK i balansesum, eller gjennomsnittlig over 10 årsverk." },
      { q: "Hva er inkludert i regnskapstjenesten?", a: "Alt du trenger for et komplett regnskap: løpende bokføring av alle bilag, MVA-rapportering og innlevering, årsregnskap og næringsoppgave, skattemelding for selskap og eier, aksjonærregisteroppgave (RF-1086), bankintegrasjon og automatisert bilagsflyt, revisjonstøtte og dokumentasjonspakke, og proaktiv rådgivning — alltid inkludert." },
    ],
  },
  {
    title: "Skatteoptimalisering",
    items: [
      { q: "Hva er skatteoptimalisering?", a: "Skatteoptimalisering betyr å innrette selskapet ditt slik at du betaler riktig skatt — ikke mer enn nødvendig. Det handler om å utnytte lovlige fradrag, velge riktig selskapsstruktur og planlegge utbytte, lønn og investeringer strategisk. Avargo gjennomfører kvartalsvise skattegjennomganger for å sikre at du aldri går glipp av fradrag." },
      { q: "Hvilke fradrag kan bedriften min få?", a: "Vanlige fradrag inkluderer: kontorkostnader og utstyr, reise- og representasjonskostnader, forsikringer, fagforeningskontingent, pensjonssparing, avskrivning av driftsmidler, tap på fordringer og FoU-kostnader (SkatteFUNN). Avargo bruker AI til å identifisere fradrag du kanskje ikke visste om." },
      { q: "Når er fristen for skattemeldingen?", a: "For aksjeselskaper (AS) er fristen for skattemeldingen normalt 31. mai. For enkeltpersonforetak er fristen 30. april. MVA-rapportering har frist annenhver måned (10. i måneden etter termin). Avargo holder styr på alle frister og leverer alltid i tide." },
    ],
  },
  {
    title: "Lønn & HR",
    items: [
      { q: "Hva koster lønnskjøring?", a: "Hos Avargo er lønnskjøring inkludert i HR-pakken. Du betaler én fast månedspris som dekker lønnskjøring, A-melding, feriepengeavregning, skattetrekk, arbeidskontrakter og arbeidsrettslig rådgivning — uten skjulte tillegg." },
      { q: "Hva er A-melding?", a: "A-meldingen er en månedlig rapportering til Skatteetaten, NAV og SSB som inneholder opplysninger om lønn, skattetrekk, arbeidsgiveravgift og arbeidsforhold for alle ansatte. Fristen er den 5. i måneden etter utbetaling. Avargo håndterer A-meldingen automatisk som del av lønnskjøringen." },
      { q: "Trenger bedriften min HMS-dokumentasjon?", a: "Ja, alle norske bedrifter er pålagt å ha HMS-dokumentasjon og internkontroll etter internkontrollforskriften. Dette gjelder uansett størrelse på bedriften. Avargo hjelper deg med å opprette og vedlikeholde nødvendig HMS-dokumentasjon slik at bedriften alltid er compliant." },
      { q: "Hva bør en arbeidskontrakt inneholde?", a: "En arbeidskontrakt skal inneholde: partenes identitet, arbeidssted, stillingsbeskrivelse, tiltredelsestidspunkt, prøvetid, lønn og godtgjørelser, arbeidstid, ferie og feriepengerettigheter, oppsigelsesfrister og referanse til tariffavtale hvis aktuelt. Avargo lager profesjonelle arbeidskontrakter som oppfyller alle krav i arbeidsmiljøloven." },
    ],
  },
  {
    title: "CFO & Strategisk rådgivning",
    items: [
      { q: "Hva er CFO-as-a-Service?", a: "CFO-as-a-Service gir deg tilgang til strategisk finansiell ledelse fra senioreksperter — uten å ansette en CFO på heltid. Du får kapitalstrukturstrategi, investor-kommunikasjon, budsjettering, scenarioanalyse og beslutningsstøtte tilpasset din fase og ditt behov." },
      { q: "Når trenger man en CFO?", a: "Du trenger en CFO når selskapet står overfor strategiske veivalg: investeringsrunder, exit eller fusjon, kraftig vekst, behov for styrerettet rapportering, eller restrukturering. Med CFO-as-a-Service fra Avargo får du seniorkompetanse akkurat når det trengs." },
      { q: "Hva er forskjellen mellom regnskapsfører og CFO?", a: "En regnskapsfører håndterer den løpende økonomiske administrasjonen — bokføring, rapportering og compliance. En CFO jobber strategisk: kapitalstruktur, investorkommunikasjon, vekststrategi og beslutningsstøtte på ledernivå. Hos Avargo kan du få begge deler." },
    ],
  },
];

// Flatten all Q&A for JSON-LD
const allFaqs = categories.flatMap(c => c.items);

const FAQ = () => {
  const [search, setSearch] = useState("");
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const filtered = search.trim()
    ? categories.map(c => ({
        ...c,
        items: c.items.filter(
          i =>
            i.q.toLowerCase().includes(search.toLowerCase()) ||
            i.a.toLowerCase().includes(search.toLowerCase())
        ),
      })).filter(c => c.items.length > 0)
    : categories;

  return (
    <>
      <Helmet>
        <title>Vanlige spørsmål om regnskap og regnskapsfører | Avargo</title>
        <meta name="description" content="Svar på de vanligste spørsmålene om regnskapsfører, skatteoptimalisering, lønnskjøring, HMS og CFO-tjenester. Alt du trenger å vite før du velger regnskapsbyrå." />
        <link rel="canonical" href="https://avargo.no/faq" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": allFaqs.map(f => ({
            "@type": "Question",
            "name": f.q,
            "acceptedAnswer": { "@type": "Answer", "text": f.a },
          })),
        })}</script>
      </Helmet>

      {/* Hero */}
      <section className="py-28 md:py-40 relative overflow-hidden">
        <div className="absolute inset-0 ambient-glow opacity-30" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl mx-auto text-center"
          >
            <p className="text-[10px] tracking-[0.45em] uppercase text-primary mb-5">Ofte stilte spørsmål</p>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-7xl leading-[1.05] mb-6">
              Alt du lurer på om{" "}
              <span className="italic text-gradient-rose">regnskap.</span>
            </h1>
            <p className="text-muted-foreground font-light text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-10">
              Vi har samlet svar på de vanligste spørsmålene om regnskapsfører, skatt, lønn og rådgivning. Finner du ikke svaret ditt? Ta kontakt — vi hjelper gjerne.
            </p>
            <div className="relative max-w-md mx-auto">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
              <input
                type="text"
                placeholder="Søk i spørsmål…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-full bg-card/50 border border-border/20 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/40 transition-colors"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="pb-24 md:pb-40">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground text-sm">Ingen spørsmål matchet søket ditt.</p>
          )}
          {filtered.map((cat, ci) => (
            <AnimatedSection key={cat.title} delay={ci * 0.05}>
              <div className="mb-12">
                <h2 className="font-heading text-xl md:text-2xl mb-6 text-foreground/90">{cat.title}</h2>
                <div className="space-y-2">
                  {cat.items.map((item, ii) => {
                    const key = `${ci}-${ii}`;
                    const isOpen = openIndex === key;
                    return (
                      <div
                        key={key}
                        className="glass rounded-2xl border border-border/15 overflow-hidden"
                      >
                        <button
                          onClick={() => setOpenIndex(isOpen ? null : key)}
                          className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                        >
                          <span className="text-sm font-medium pr-4">{item.q}</span>
                          <ChevronDown
                            size={16}
                            className={`shrink-0 text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                          />
                        </button>
                        {isOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            transition={{ duration: 0.3 }}
                            className="px-6 pb-5"
                          >
                            <p className="text-sm text-muted-foreground font-light leading-relaxed">{item.a}</p>
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 border-t border-border/10 text-center relative">
        <div className="absolute inset-0 ambient-glow opacity-25" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <AnimatedSection>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl mb-5 leading-snug max-w-2xl mx-auto">
              Fant du ikke svaret ditt?
            </h2>
            <p className="text-muted-foreground font-light mb-10 max-w-md mx-auto text-sm">
              Ta kontakt med oss — vi svarer gjerne på alle spørsmål om regnskap, skatt og rådgivning.
            </p>
            <Link
              to="/kontakt"
              className="group inline-flex items-center gap-3 px-10 md:px-12 py-4 md:py-5 bg-primary text-primary-foreground text-sm font-medium tracking-wider rounded-full glow-rose hover:scale-[1.02] transition-all duration-500"
            >
              Kontakt oss
              <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
};

export default FAQ;
