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
      { q: "Hva er forskjellen mellom regnskap og bokføring?", a: "Bokføring er den daglige registreringen av økonomiske transaksjoner — bilag, fakturaer og betalinger. Regnskap er det overordnede begrepet som inkluderer bokføring, men også årsregnskap, skattemelding, MVA-rapportering og finansiell analyse. En regnskapsfører hos Avargo håndterer begge deler." },
      { q: "Kan jeg føre regnskapet selv?", a: "Ja, du kan føre regnskapet selv dersom du har kompetansen. Men mange bedriftseiere bruker timer hver uke på bilag og rapportering — tid som kunne gått til salg og utvikling. Med en regnskapsfører fra Avargo får du garantert kvalitet, overholdelse av frister og proaktiv rådgivning som ofte sparer deg for langt mer enn det koster." },
      { q: "Hva er et årsregnskap?", a: "Et årsregnskap er en lovpålagt økonomisk rapport som viser selskapets finansielle stilling ved årsslutt. Det består av resultatregnskap (inntekter og kostnader), balanse (eiendeler, gjeld og egenkapital) og noter. Alle aksjeselskaper i Norge er pliktige til å utarbeide og sende inn årsregnskap til Brønnøysundregistrene innen 31. juli." },
      { q: "Hva er bilagshåndtering?", a: "Bilagshåndtering er prosessen med å samle inn, sortere, registrere og arkivere alle økonomiske dokumenter — fakturaer, kvitteringer, bankbilag og kontraktsbilag. God bilagshåndtering er grunnlaget for et korrekt regnskap. Avargo tilbyr automatisert bilagsflyt med bankintegrasjon slik at prosessen blir enkel og feilfri." },
      { q: "Hva er regnskapsplikt?", a: "Regnskapsplikt betyr at virksomheten er lovpålagt å føre regnskap etter regnskapsloven. I Norge gjelder regnskapsplikten for alle aksjeselskaper (AS og ASA), samt enkeltpersonforetak og ansvarlige selskaper med over 7 MNOK i omsetning eller mer enn 5 ansatte. Avargo sørger for at du alltid oppfyller regnskapsplikten." },
      { q: "Hva er en næringsoppgave?", a: "Næringsoppgaven er et vedlegg til skattemeldingen som gir en detaljert oversikt over virksomhetens inntekter, kostnader, eiendeler og gjeld. Den brukes av Skatteetaten for å beregne riktig skatt. Avargo utarbeider næringsoppgaven som en del av den årlige leveransen." },
    ],
  },
  {
    title: "Skatteoptimalisering",
    items: [
      { q: "Hva er skatteoptimalisering?", a: "Skatteoptimalisering betyr å innrette selskapet ditt slik at du betaler riktig skatt — ikke mer enn nødvendig. Det handler om å utnytte lovlige fradrag, velge riktig selskapsstruktur og planlegge utbytte, lønn og investeringer strategisk. Avargo gjennomfører kvartalsvise skattegjennomganger for å sikre at du aldri går glipp av fradrag." },
      { q: "Hvilke fradrag kan bedriften min få?", a: "Vanlige fradrag inkluderer: kontorkostnader og utstyr, reise- og representasjonskostnader, forsikringer, fagforeningskontingent, pensjonssparing, avskrivning av driftsmidler, tap på fordringer og FoU-kostnader (SkatteFUNN). Avargo bruker AI til å identifisere fradrag du kanskje ikke visste om." },
      { q: "Når er fristen for skattemeldingen?", a: "For aksjeselskaper (AS) er fristen for skattemeldingen normalt 31. mai. For enkeltpersonforetak er fristen 30. april. MVA-rapportering har frist annenhver måned (10. i måneden etter termin). Avargo holder styr på alle frister og leverer alltid i tide." },
      { q: "Hva er forskjellen mellom lønn og utbytte?", a: "Lønn er skattepliktig inntekt som belastes med inntektsskatt (opptil 47,4 %) og arbeidsgiveravgift (14,1 %). Utbytte beskattes etter aksjonærmodellen med en effektiv skattesats på ca. 37,84 %. Den optimale fordelingen avhenger av selskapets situasjon, din personlige økonomi og fremtidige planer. Avargo hjelper deg med å finne den mest skatteeffektive kombinasjonen." },
      { q: "Hva er skjermingsfradrag?", a: "Skjermingsfradraget er et fradrag på utbytte fra aksjeselskaper som reduserer skattepliktig utbytte. Fradraget beregnes basert på aksjenes inngangsverdi multiplisert med en skjermingsrente fastsatt av Skatteetaten. Ubenyttet skjermingsfradrag kan fremføres til senere år. Avargo sørger for at du utnytter skjermingsfradraget fullt ut." },
      { q: "Hva er forskjellen mellom AS og ENK skattemessig?", a: "I et aksjeselskap (AS) beskattes overskuddet med 22 % selskapsskatt, og utbytte beskattes i tillegg hos eier. I et enkeltpersonforetak (ENK) beskattes overskuddet direkte som personinntekt med marginalskatt opptil 47,4 %. AS gir bedre muligheter for skatteplanlegging, men ENK har enklere administrasjon. Avargo hjelper deg med å velge riktig selskapsform." },
      { q: "Hva er MVA-plikt og når inntrer den?", a: "Merverdiavgift (MVA) er en avgift på omsetning av varer og tjenester. Du blir MVA-pliktig når omsetningen overstiger 50 000 kr i løpet av en 12-månedersperiode. Etter registrering i Merverdiavgiftsregisteret må du kreve inn 25 % MVA (15 % på mat, 12 % på transport og kultur) og rapportere annenhver måned. Avargo håndterer MVA-rapporteringen automatisk." },
      { q: "Kan jeg trekke fra hjemmekontor på skatten?", a: "Ja, dersom du bruker en del av boligen din fast og regelmessig til inntektsgivende arbeid, kan du kreve fradrag for hjemmekontor. Du kan enten bruke standardfradrag (kr 1 850 per år) eller faktiske kostnader (andel av husleie, strøm, forsikring basert på areal). Avargo vurderer hvilken metode som gir deg best fradrag." },
      { q: "Hva er SkatteFUNN?", a: "SkatteFUNN er en offentlig støtteordning som gir skattefradrag for bedrifter som driver med forskning og utvikling (FoU). Du kan få 19 % skattefradrag for FoU-kostnader opptil 25 MNOK per år. Ordningen gjelder for alle norske bedrifter, uavhengig av størrelse og bransje. Avargo hjelper deg med søknaden og dokumentasjonen." },
    ],
  },
  {
    title: "Lønn & HR",
    items: [
      { q: "Hva koster lønnskjøring?", a: "Hos Avargo er lønnskjøring inkludert i HR-pakken. Du betaler én fast månedspris som dekker lønnskjøring, A-melding, feriepengeavregning, skattetrekk, arbeidskontrakter og arbeidsrettslig rådgivning — uten skjulte tillegg." },
      { q: "Hva er A-melding?", a: "A-meldingen er en månedlig rapportering til Skatteetaten, NAV og SSB som inneholder opplysninger om lønn, skattetrekk, arbeidsgiveravgift og arbeidsforhold for alle ansatte. Fristen er den 5. i måneden etter utbetaling. Avargo håndterer A-meldingen automatisk som del av lønnskjøringen." },
      { q: "Trenger bedriften min HMS-dokumentasjon?", a: "Ja, alle norske bedrifter er pålagt å ha HMS-dokumentasjon og internkontroll etter internkontrollforskriften. Dette gjelder uansett størrelse på bedriften. Avargo hjelper deg med å opprette og vedlikeholde nødvendig HMS-dokumentasjon slik at bedriften alltid er compliant." },
      { q: "Hva bør en arbeidskontrakt inneholde?", a: "En arbeidskontrakt skal inneholde: partenes identitet, arbeidssted, stillingsbeskrivelse, tiltredelsestidspunkt, prøvetid, lønn og godtgjørelser, arbeidstid, ferie og feriepengerettigheter, oppsigelsesfrister og referanse til tariffavtale hvis aktuelt. Avargo lager profesjonelle arbeidskontrakter som oppfyller alle krav i arbeidsmiljøloven." },
      { q: "Hva er arbeidsgiveravgift?", a: "Arbeidsgiveravgift er en avgift arbeidsgivere betaler til staten basert på lønnskostnader. Satsen varierer etter sone — fra 0 % i Nord-Troms og Finnmark (sone 5) til 14,1 % i sentrale strøk (sone 1). Avgiften beregnes av brutto lønn, feriepenger, naturalytelser og pensjonsinnskudd. Avargo beregner og rapporterer arbeidsgiveravgiften automatisk." },
      { q: "Hvordan beregnes feriepenger?", a: "Feriepenger beregnes som en prosentsats av feriepengegrunnlaget — normalt 10,2 % (12 % for arbeidstakere over 60 år). Grunnlaget er brutto lønn fra foregående kalenderår, minus utbetalte feriepenger. Feriepengene utbetales normalt i juni. Avargo håndterer feriepengeavregningen som del av lønnskjøringen." },
      { q: "Hva er OTP (obligatorisk tjenestepensjon)?", a: "Obligatorisk tjenestepensjon (OTP) krever at alle bedrifter med minst én ansatt (utover eier) sparer minimum 2 % av lønn mellom 1G og 12G til pensjon. Avargo hjelper deg med å velge riktig pensjonsordning og sørger for at innbetalingene skjer korrekt og i tide." },
      { q: "Hva er sykefraværsoppfølging?", a: "Som arbeidsgiver har du plikt til å følge opp sykemeldte ansatte. Du skal ha samtale innen 4 uker, utarbeide oppfølgingsplan og delta i dialogmøter med NAV. Arbeidsgiveren dekker sykepenger de første 16 dagene (arbeidsgiverperioden). Avargo hjelper deg med dokumentasjon og oppfølgingsprosessen." },
      { q: "Hva er prøvetid og hvilke regler gjelder?", a: "Prøvetid kan avtales for inntil 6 måneder og gir arbeidsgiver en kortere oppsigelsesfrist (14 dager) og mulighet til å si opp basert på manglende tilpasning, faglig dyktighet eller pålitelighet. Prøvetiden må avtales skriftlig i arbeidskontrakten. Avargo sørger for at prøvetidsklausulen er juridisk korrekt." },
    ],
  },
  {
    title: "Selskapsrett & Stiftelse",
    items: [
      { q: "Hvordan stifter jeg et aksjeselskap (AS)?", a: "For å stifte et AS trenger du: 1) Minimum 30 000 kr i aksjekapital. 2) Stiftelsesdokument med vedtekter. 3) Registrering i Foretaksregisteret via Altinn. Hele prosessen kan gjøres digitalt og tar vanligvis 1-3 virkedager. Avargo hjelper deg med all dokumentasjon og registrering." },
      { q: "Hva er forskjellen mellom AS og ENK?", a: "I et AS har du begrenset personlig ansvar — du risikerer bare aksjekapitalen. I et ENK hefter du personlig med hele din formue. AS gir bedre skatteplanlegging og er mer profesjonelt overfor kunder og leverandører. ENK er enklere å administrere og har lavere oppstartskostnader. Avargo hjelper deg med å velge riktig." },
      { q: "Hva er aksjekapital?", a: "Aksjekapital er det beløpet eierne skyter inn når selskapet stiftes. Minimumskravet for et AS i Norge er 30 000 kr. Aksjekapitalen kan brukes til drift av selskapet, men den representerer eiernes innskudd og eierandel. Avargo hjelper med kapitalforhøyelser og emisjoner ved behov." },
      { q: "Hva er et holdingselskap?", a: "Et holdingselskap er et aksjeselskap som eier aksjer i andre selskaper. Fordelen er fritaksmetoden — utbytte og gevinst fra datterselskaper er tilnærmet skattefritt i holdingselskapet. Dette gir fleksibilitet til å reinvestere, ta utbytte gradvis eller selge skatteeffektivt. Avargo hjelper deg med å strukturere holdingselskapet optimalt." },
      { q: "Hva er fritaksmetoden?", a: "Fritaksmetoden innebærer at aksjeselskaper er fritatt for skatt på utbytte og aksjegevinster fra andre norske og EØS-selskaper (med unntak av 3 % av utbytte som inntektsføres). Dette gjør holdingstrukturer svært skatteeffektive. Avargo hjelper deg med å utnytte fritaksmetoden i din selskapsstruktur." },
      { q: "Når bør jeg gå fra ENK til AS?", a: "Du bør vurdere å gå fra ENK til AS når: omsetningen overstiger 500 000-700 000 kr, du trenger begrenset personlig ansvar, du vil optimalisere fordelingen mellom lønn og utbytte, du planlegger å ta inn investorer, eller du vil ansette. Avargo hjelper med omdanningen og sikrer at overgangen skjer skattefritt." },
    ],
  },
  {
    title: "CFO & Strategisk rådgivning",
    items: [
      { q: "Hva er CFO-as-a-Service?", a: "CFO-as-a-Service gir deg tilgang til strategisk finansiell ledelse fra senioreksperter — uten å ansette en CFO på heltid. Du får kapitalstrukturstrategi, investor-kommunikasjon, budsjettering, scenarioanalyse og beslutningsstøtte tilpasset din fase og ditt behov." },
      { q: "Når trenger man en CFO?", a: "Du trenger en CFO når selskapet står overfor strategiske veivalg: investeringsrunder, exit eller fusjon, kraftig vekst, behov for styrerettet rapportering, eller restrukturering. Med CFO-as-a-Service fra Avargo får du seniorkompetanse akkurat når det trengs." },
      { q: "Hva er forskjellen mellom regnskapsfører og CFO?", a: "En regnskapsfører håndterer den løpende økonomiske administrasjonen — bokføring, rapportering og compliance. En CFO jobber strategisk: kapitalstruktur, investorkommunikasjon, vekststrategi og beslutningsstøtte på ledernivå. Hos Avargo kan du få begge deler." },
      { q: "Hva er budsjettering og prognoser?", a: "Budsjettering er prosessen med å planlegge selskapets inntekter og kostnader for en kommende periode. Prognoser oppdaterer budsjettet basert på faktiske tall og trender. Sammen gir de ledelsen kontroll og grunnlag for informerte beslutninger. Avargo bygger skreddersydde budsjett- og prognosemodeller for din virksomhet." },
      { q: "Hva er due diligence?", a: "Due diligence er en grundig gjennomgang av et selskaps finansielle, juridiske og operasjonelle forhold — typisk før en investering, fusjon eller oppkjøp. Prosessen avdekker risikoer, verifiserer verdier og gir grunnlag for forhandlinger. Avargo bistår med finansiell due diligence og forberedelse." },
    ],
  },
  {
    title: "Digitale tjenester & Markedsføring",
    items: [
      { q: "Trenger bedriften min en nettside?", a: "Ja — i 2026 er en profesjonell nettside grunnlaget for din digitale tilstedeværelse. 87 % av norske forbrukere søker på nett før de kontakter en bedrift. En god nettside bygger tillit, genererer leads og jobber for deg 24/7. Avargo bygger moderne, raske nettsider optimalisert for søkemotorer." },
      { q: "Hva er SEO og hvorfor er det viktig?", a: "SEO (søkemotoroptimalisering) er prosessen med å gjøre nettsiden din synlig i Google og andre søkemotorer. God SEO betyr at potensielle kunder finner deg når de søker etter tjenester du tilbyr. Det er langsiktig, kostnadseffektiv markedsføring som bygger organisk trafikk over tid. Avargo tilbyr strategisk SEO som del av vekstpakken." },
      { q: "Hva er Google Ads og hva koster det?", a: "Google Ads er betalt annonsering i Googles søkeresultater. Du betaler per klikk (PPC), og prisen varierer etter konkurranse på søkeordene — typisk 5-50 kr per klikk for norske bedrifter. Med riktig strategi kan Google Ads gi umiddelbar trafikk og leads. Avargo håndterer hele annonsestrategien og optimaliseringen." },
      { q: "Hva er forskjellen mellom SEO og Google Ads?", a: "SEO gir langsiktig organisk synlighet uten løpende annonsekostnader, men tar tid å bygge opp (3-6 måneder). Google Ads gir umiddelbar synlighet, men koster per klikk og stopper når budsjettet er brukt. Den beste strategien kombinerer begge deler — Avargo hjelper deg med å finne riktig balanse." },
      { q: "Bør bedriften min annonsere på Facebook og Instagram?", a: "Meta-annonser (Facebook/Instagram) er svært effektive for merkevarebygging, retargeting og leadgenerering. Plattformene har avanserte målrettingsmuligheter basert på demografi, interesser og adferd. Avargo bygger og optimaliserer Meta-kampanjer som gir målbar avkastning." },
    ],
  },
  {
    title: "AI & Teknologi i regnskap",
    items: [
      { q: "Hvordan bruker Avargo AI i regnskap?", a: "Avargo bruker kunstig intelligens til å automatisere bilagshåndtering, identifisere skattefradrag du ellers ville gått glipp av, oppdage avvik og risiko i sanntid, og gi proaktive anbefalinger. AI-en analyserer tusenvis av transaksjoner og benchmarker mot bransjedata — slik at du alltid ligger et steg foran." },
      { q: "Er det trygt å bruke AI i regnskapet?", a: "Ja. Hos Avargo er AI et verktøy som forsterker regnskapsførerens kompetanse — den erstatter ikke den menneskelige kontrollen. All AI-analyse kvalitetssikres av autoriserte regnskapsførere. Data er kryptert og behandles i henhold til GDPR og norsk personvernlovgivning." },
      { q: "Hva er automatisert bilagshåndtering?", a: "Automatisert bilagshåndtering betyr at fakturaer, kvitteringer og bankbilag behandles digitalt — uten manuell inntasting. Systemet leser, kategoriserer og bokfører bilag automatisk gjennom OCR-teknologi og AI. Dette reduserer feil, sparer tid og gir deg sanntidsoversikt over økonomien." },
      { q: "Kan AI erstatte regnskapsføreren?", a: "Nei — AI er et kraftig verktøy, men det erstatter ikke den menneskelige vurderingen, erfaringen og relasjonen som en god regnskapsfører gir. AI håndterer det repetitive og analytiske, mens regnskapsføreren gir strategisk rådgivning, tolker komplekse situasjoner og er din sparringspartner. Hos Avargo får du det beste av begge verdener." },
    ],
  },
  {
    title: "Bransje & Spesialisering",
    items: [
      { q: "Har Avargo erfaring med min bransje?", a: "Avargo betjener over 25 ulike bransjer — fra tech og SaaS til bygg og anlegg, restaurant, eiendom, helse og landbruk. Hver bransje har dedikerte regnskapsførere med spesialkompetanse innen bransjespesifikke regler, fradrag og rapporteringskrav. Se vår bransjeoversikt for detaljert informasjon." },
      { q: "Hva er bransjespesifikt regnskap?", a: "Bransjespesifikt regnskap betyr at regnskapsføreren forstår de unike økonomiske forholdene i din bransje — enten det er prosjektregnskap i bygg, varelager i varehandel, tipsregler i restaurant eller investoravtaler i tech. Avargo matcher deg med en regnskapsfører som har dyp bransjeerfaring." },
      { q: "Tilbyr Avargo regnskapstjenester for oppstartsbedrifter?", a: "Ja, Avargo har en egen pakke for nyoppstartede selskaper fra 1 499 kr/mnd. Den inkluderer alt du trenger for å komme i gang: stiftelseshjelp, bokføring, MVA-registrering, skattemelding og rådgivning. Vi forstår startup-dynamikken og hjelper deg med å bygge en solid økonomisk plattform fra dag én." },
      { q: "Kan Avargo hjelpe med internasjonale selskaper?", a: "Ja, Avargo bistår selskaper med internasjonal virksomhet — inkludert MVA ved grensekryssende handel, transfer pricing, utenlandske ansatte og filialer. Vi samarbeider med partnere i flere land for å sikre compliance på tvers av jurisdiksjoner." },
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
