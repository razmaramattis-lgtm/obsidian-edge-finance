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
      { q: "Hva er periodisering i regnskap?", a: "Periodisering betyr å føre inntekter og kostnader i den perioden de tilhører, uavhengig av når betalingen skjer. For eksempel skal en faktura for januar-arbeid inntektsføres i januar, selv om betalingen kommer i februar. Korrekt periodisering gir et rettvisende bilde av selskapets økonomi." },
      { q: "Hva er kontoplan og hvordan velger jeg riktig?", a: "En kontoplan er en strukturert oversikt over alle kontoer som brukes i regnskapet. I Norge bruker de fleste Norsk Standard kontoplan (NS 4102). Riktig kontoplan sikrer korrekt rapportering til myndighetene og gir god oversikt over inntekter, kostnader og balanseposter. Avargo setter opp kontoplanen tilpasset din bransje." },
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
      { q: "Hva er forskuddsskatt for selskaper?", a: "Forskuddsskatt er forhåndsberegnet skatt som selskaper betaler i løpet av inntektsåret, basert på forventet overskudd. AS betaler forskuddsskatt i to terminer (15. februar og 15. april året etter inntektsåret). Avargo beregner og varsler deg om forskuddsskatten slik at du unngår renter og tilleggsskatt." },
      { q: "Hva er fordelingsfradrag og reisefradrag?", a: "Reisefradrag gir rett til fradrag for reisekostnader mellom hjem og arbeid over 14 000 kr per år. For selvstendig næringsdrivende kan reisekostnader i forbindelse med næringsvirksomhet føres som fradrag i næringsoppgaven. Avargo sørger for at du utnytter alle relevante reise- og kostnadsfradrag." },
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
      { q: "Hva er reglene for overtid?", a: "Overtid er arbeid utover avtalt arbeidstid og lovens normalarbeidstid (9 timer per dag / 40 timer per uke). Arbeidsgiver skal betale minst 40 % overtidstillegg. Det er grenser for hvor mye overtid som kan pålegges: maks 10 timer per uke, 25 timer per måned og 200 timer per år. Avargo sørger for korrekt overtidsberegning i lønnskjøringen." },
      { q: "Hvordan håndterer jeg oppsigelser korrekt?", a: "Oppsigelser må oppfylle strenge krav i arbeidsmiljøloven: det må foreligge saklig grunn, oppsigelsen skal være skriftlig med lovpålagt innhold, og arbeidsgiver må gjennomføre drøftingsmøte før beslutning. Oppsigelsesfristen er minst én måned. Avargo bistår med korrekt prosess og dokumentasjon for å unngå tvister." },
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
      { q: "Hva er aksjonæravtale og trenger jeg det?", a: "En aksjonæravtale regulerer forholdet mellom eierne i et selskap — stemmerett, utbyttepolitikk, forkjøpsrett, konkurranseforbud og konflikthåndtering. Den er ikke lovpålagt, men sterkt anbefalt når selskapet har flere eiere. Avargo bistår med utarbeidelse av aksjonæravtaler i samarbeid med juridisk partner." },
      { q: "Hva er styrets ansvar i et AS?", a: "Styret har overordnet ansvar for forvaltningen av selskapet og skal sørge for forsvarlig organisering, føre tilsyn med daglig leder, og fastsette budsjett og strategi. Styremedlemmer kan holdes personlig ansvarlige ved grov uaktsomhet. Avargo leverer styrerettet rapportering som gir styret grunnlag for gode beslutninger." },
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
      { q: "Hva er KPI-er og hvorfor bør jeg følge dem?", a: "KPI-er (Key Performance Indicators) er nøkkeltall som måler bedriftens ytelse mot definerte mål — f.eks. bruttomargin, kundetilfangstkostnad, churn rate eller EBITDA-margin. Avargo setter opp skreddersydde KPI-dashboards som gir deg sanntidsoversikt over det som betyr noe for din virksomhet." },
      { q: "Hva er cashflow-styring?", a: "Cashflow-styring handler om å sikre at selskapet alltid har tilstrekkelig likviditet til å dekke løpende forpliktelser. Det inkluderer innbetalingskontroll, utbetalingsplanlegging, kredittidsstyring og likviditetsprognoser. Dårlig cashflow er den vanligste årsaken til at ellers lønnsomme bedrifter går konkurs. Avargo gir deg full kontroll på likviditeten." },
    ],
  },
  {
    title: "Valg av regnskapssystem",
    items: [
      { q: "Hvilket regnskapsprogram bør jeg velge?", a: "Valget avhenger av bedriftens størrelse, bransje og behov. Populære systemer i Norge inkluderer Tripletex, Fiken, Visma eAccounting, PowerOffice Go og Xledger. Avargo er systemuavhengig og jobber med alle ledende plattformer. Vi anbefaler system basert på dine spesifikke behov." },
      { q: "Hva er Tripletex og hvem passer det for?", a: "Tripletex er Norges mest brukte skybaserte regnskapssystem. Det passer for små og mellomstore bedrifter og tilbyr moduler for regnskap, fakturering, lønn, prosjektstyring og tidsregistrering. Avargo har bred erfaring med Tripletex og kan hjelpe med oppsett, integrasjoner og opplæring." },
      { q: "Hva er Fiken og hvem passer det for?", a: "Fiken er et brukervennlig regnskapssystem designet for enkeltpersonforetak og små aksjeselskaper. Det har automatisk bokføring, fakturering, bankintegrasjon og MVA-rapportering. Fiken egner seg best for bedrifter med enkle regnskapsbehov og begrenset antall transaksjoner." },
      { q: "Hva er Visma eAccounting?", a: "Visma eAccounting er et skybasert regnskapssystem fra Visma som passer for små og mellomstore bedrifter. Det tilbyr fakturering, bilagsregistrering, bank- og betalingsintegrasjon, MVA-rapportering og enkel rapportering. Systemet integrerer godt med andre Visma-produkter som Visma Lønn og Visma Expense." },
      { q: "Hva er PowerOffice Go?", a: "PowerOffice Go er et norskutviklet skybasert ERP-system som kombinerer regnskap, fakturering, lønn, tidsregistrering og prosjektstyring i én plattform. Det passer for bedrifter som ønsker et alt-i-ett-system med gode API-muligheter og integrasjoner." },
      { q: "Hva er Xledger?", a: "Xledger er et avansert skybasert ERP- og regnskapssystem designet for mellomstore og større bedrifter. Det tilbyr automatisert bokføring, konsolidering, budsjett, prosjektstyring og avansert rapportering. Xledger egner seg for bedrifter med komplekse regnskapsbehov på tvers av selskaper og avdelinger." },
      { q: "Kan jeg bytte regnskapssystem?", a: "Ja, det er mulig å bytte regnskapssystem. Prosessen innebærer eksport av historiske data, mapping av kontoplan, import til nytt system og kvalitetskontroll. Avargo har erfaring med migrering mellom alle ledende systemer og sørger for en sømløs overgang uten tap av data." },
      { q: "Hva bør jeg se etter i et regnskapssystem?", a: "Viktige kriterier inkluderer: skybasert tilgang, bankintegrasjon, automatisk bilagslesing (OCR), MVA- og rapporteringsstøtte, fakturering, lønnsmodul, API og integrasjonsmuligheter, brukervennlighet, pris og skalerbarhet. Avargo hjelper deg med å evaluere og velge riktig system." },
      { q: "Er skybasert regnskap trygt?", a: "Ja, ledende skybaserte regnskapssystemer bruker bankgrad kryptering, flerfaktorautentisering, automatisk backup og følger GDPR. Skybaserte løsninger er generelt sikrere enn lokale installasjoner fordi leverandørene investerer tungt i sikkerhet og oppdateringer. Avargo velger kun systemer med dokumentert høy sikkerhet." },
    ],
  },
  {
    title: "Integrasjoner & Automatisering",
    items: [
      { q: "Hva er bankintegrasjon i regnskap?", a: "Bankintegrasjon kobler regnskapssystemet direkte til bedriftens bankkonto. Transaksjoner hentes automatisk, matches mot fakturaer og bokføres — uten manuell inntasting. Dette sparer tid, reduserer feil og gir sanntidsoversikt over kontantstrømmen. Avargo setter opp bankintegrasjon som en del av onboarding." },
      { q: "Hva er EHF-faktura?", a: "EHF (Elektronisk Handelsformat) er Norges standard for elektronisk fakturering. Alle leverandører til offentlig sektor er pålagt å sende EHF-fakturaer. Formatet sikrer automatisk mottak, validering og bokføring hos mottaker. Avargo setter opp EHF-sending og -mottak i regnskapssystemet ditt." },
      { q: "Hva er OCR i bilagshåndtering?", a: "OCR (Optical Character Recognition) er teknologi som leser og tolker tekst fra bilder av dokumenter — kvitteringer, fakturaer og bankbilag. I regnskap brukes OCR til å automatisere bilagsregistrering: systemet leser beløp, dato, leverandør og kontonummer automatisk. Avargo bruker AI-forsterket OCR for høyere nøyaktighet." },
      { q: "Kan regnskapssystemet integreres med nettbutikken?", a: "Ja, de fleste regnskapssystemer kan integreres med nettbutikkplattformer som Shopify, WooCommerce og Magento. Integrasjonen synkroniserer ordrer, betalinger og varelagerbevegelser automatisk til regnskapet. Avargo setter opp og vedlikeholder integrasjonene slik at du slipper manuell dobbeltregistrering." },
      { q: "Hva er API-integrasjon?", a: "API (Application Programming Interface) er et teknisk grensesnitt som lar ulike systemer kommunisere og dele data automatisk. I regnskap brukes API-er til å koble sammen regnskapssystem, bank, faktureringsplattform, lønnssystem og CRM. Avargo har teknisk kompetanse til å sette opp skreddersydde API-integrasjoner." },
      { q: "Kan jeg automatisere fakturering?", a: "Ja, med riktig system kan du sette opp automatisk fakturering for gjentakende kunder — abonnementer, fastprisavtaler og løpende tjenester. Fakturaer genereres, sendes og bokføres automatisk. Avargo hjelper med å sette opp automatisert fakturering i ditt regnskapssystem." },
      { q: "Hva er Zapier og kan det brukes med regnskap?", a: "Zapier er en automatiseringsplattform som kobler sammen over 5 000 apper uten koding. I regnskap kan Zapier brukes til å automatisere bilagsflyt fra e-post, synkronisere kundedata mellom CRM og regnskap, eller varsle ved forfalte fakturaer. Avargo hjelper med å sette opp smarte automatiseringer." },
      { q: "Hva er peppol-nettverket?", a: "Peppol er et internasjonalt nettverk for elektronisk utveksling av forretningsdokumenter — primært e-fakturaer. Norge bruker Peppol som standard for elektronisk fakturering til offentlig sektor. Alle selskaper som fakturerer det offentlige må være tilknyttet Peppol. Avargo sørger for at du er korrekt registrert og sender via Peppol." },
      { q: "Hvordan integrerer jeg betalingsløsning med regnskapet?", a: "Betalingsløsninger som Vipps, Klarna, Stripe og Nets kan integreres direkte med regnskapssystemet. Transaksjoner overføres automatisk, inkludert gebyr-avregning og valutaomregning. Avargo setter opp integrasjonen slik at alle betalinger bokføres korrekt uten manuelt arbeid." },
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
      { q: "Hva er konverteringsoptimalisering?", a: "Konverteringsoptimalisering (CRO) handler om å øke andelen besøkende som utfører en ønsket handling — f.eks. fyller ut et kontaktskjema, bestiller en demo eller kjøper et produkt. Det innebærer A/B-testing, analyse av brukeradferd og optimalisering av landingssider. Avargo jobber datadrevet med CRO for å maksimere avkastningen på markedsføring." },
      { q: "Hva er innholdsmarkedsføring?", a: "Innholdsmarkedsføring er en strategi der du skaper og distribuerer verdifullt innhold — artikler, guider, videoer — for å tiltrekke og engasjere potensielle kunder. Det bygger tillit, forbedrer SEO og posisjonerer deg som ekspert. Avargo hjelper bedrifter med innholdsstrategi som driver trafikk og leads." },
    ],
  },
  {
    title: "AI & Teknologi i regnskap",
    items: [
      { q: "Hvordan bruker Avargo AI i regnskap?", a: "Avargo bruker kunstig intelligens til å automatisere bilagshåndtering, identifisere skattefradrag du ellers ville gått glipp av, oppdage avvik og risiko i sanntid, og gi proaktive anbefalinger. AI-en analyserer tusenvis av transaksjoner og benchmarker mot bransjedata — slik at du alltid ligger et steg foran." },
      { q: "Er det trygt å bruke AI i regnskapet?", a: "Ja. Hos Avargo er AI et verktøy som forsterker regnskapsførerens kompetanse — den erstatter ikke den menneskelige kontrollen. All AI-analyse kvalitetssikres av autoriserte regnskapsførere. Data er kryptert og behandles i henhold til GDPR og norsk personvernlovgivning." },
      { q: "Hva er automatisert bilagshåndtering?", a: "Automatisert bilagshåndtering betyr at fakturaer, kvitteringer og bankbilag behandles digitalt — uten manuell inntasting. Systemet leser, kategoriserer og bokfører bilag automatisk gjennom OCR-teknologi og AI. Dette reduserer feil, sparer tid og gir deg sanntidsoversikt over økonomien." },
      { q: "Kan AI erstatte regnskapsføreren?", a: "Nei — AI er et kraftig verktøy, men det erstatter ikke den menneskelige vurderingen, erfaringen og relasjonen som en god regnskapsfører gir. AI håndterer det repetitive og analytiske, mens regnskapsføreren gir strategisk rådgivning, tolker komplekse situasjoner og er din sparringspartner. Hos Avargo får du det beste av begge verdener." },
      { q: "Hva er maskinlæring i regnskap?", a: "Maskinlæring er en gren av AI der systemer lærer fra historiske data og forbedrer seg over tid. I regnskap brukes det til å predikere kontokategorier for bilag, oppdage uvanlige transaksjoner, forutsi cashflow og identifisere risiko. Avargos AI-motor blir smartere jo mer den brukes." },
      { q: "Hva er robotic process automation (RPA) i regnskap?", a: "RPA bruker programvareroboter til å utføre repetitive, regelbaserte oppgaver — som å hente bankutskrifter, sende purringer, generere rapporter og sjekke datakvalitet. I regnskap kan RPA spare hundrevis av timer per år. Avargo bruker RPA-elementer for å eliminere manuelt arbeid og øke nøyaktigheten." },
    ],
  },
  {
    title: "Bransje & Spesialisering",
    items: [
      { q: "Har Avargo erfaring med min bransje?", a: "Avargo betjener over 25 ulike bransjer — fra tech og SaaS til bygg og anlegg, restaurant, eiendom, helse og landbruk. Hver bransje har dedikerte regnskapsførere med spesialkompetanse innen bransjespesifikke regler, fradrag og rapporteringskrav. Se vår bransjeoversikt for detaljert informasjon." },
      { q: "Hva er bransjespesifikt regnskap?", a: "Bransjespesifikt regnskap betyr at regnskapsføreren forstår de unike økonomiske forholdene i din bransje — enten det er prosjektregnskap i bygg, varelager i varehandel, tipsregler i restaurant eller investoravtaler i tech. Avargo matcher deg med en regnskapsfører som har dyp bransjeerfaring." },
      { q: "Tilbyr Avargo regnskapstjenester for oppstartsbedrifter?", a: "Ja, Avargo har en egen pakke for nyoppstartede selskaper fra 1 499 kr/mnd. Den inkluderer alt du trenger for å komme i gang: stiftelseshjelp, bokføring, MVA-registrering, skattemelding og rådgivning. Vi forstår startup-dynamikken og hjelper deg med å bygge en solid økonomisk plattform fra dag én." },
      { q: "Kan Avargo hjelpe med internasjonale selskaper?", a: "Ja, Avargo bistår selskaper med internasjonal virksomhet — inkludert MVA ved grensekryssende handel, transfer pricing, utenlandske ansatte og filialer. Vi samarbeider med partnere i flere land for å sikre compliance på tvers av jurisdiksjoner." },
      { q: "Hva er prosjektregnskap?", a: "Prosjektregnskap er en metode for å spore inntekter, kostnader og lønnsomhet per prosjekt — vanlig i bygg og anlegg, konsulentbransjen og IT. Det gir oversikt over prosjektmarginer, timeforbruk og materialkostnader. Avargo setter opp prosjektregnskapsstrukturer tilpasset din virksomhet." },
      { q: "Hva er spesielt med restaurantregnskap?", a: "Restaurantregnskap har egne regler for tips, kontantsalg, kasseapparat, varekostnad og allergenhåndtering. MVA-satsene varierer (15 % på mat til medbringing, 25 % på servering). Avargo har dedikerte regnskapsførere med restaurantbransjekunnskap som sikrer korrekt bokføring og rapportering." },
      { q: "Hva er eiendomsregnskap?", a: "Eiendomsregnskap dekker bokføring av leieinntekter, vedlikeholdskostnader, avskrivninger, eiendomsskatt og forvaltning av flere eiendommer eller utleieenheter. For selskaper med mange eiendommer er korrekt periodisering og skattemessig behandling avgjørende. Avargo har spesialkompetanse på eiendomsbransjen." },
    ],
  },
  {
    title: "MVA & Avgifter",
    items: [
      { q: "Hva er MVA-kompensasjon?", a: "MVA-kompensasjon er en ordning der visse virksomheter — som ideelle organisasjoner og kommunale enheter — kan få refundert MVA på sine innkjøp. Ordningen er regulert av kompensasjonsloven. Avargo hjelper berettigede organisasjoner med å søke om og dokumentere MVA-kompensasjon." },
      { q: "Hva er omvendt avgiftsplikt?", a: "Omvendt avgiftsplikt (reverse charge) betyr at det er kjøperen, ikke selgeren, som beregner og rapporterer MVA. Dette gjelder ved import av tjenester fra utlandet og ved kjøp av klimakvoter. Avargo sørger for korrekt håndtering av omvendt avgiftsplikt i regnskapet." },
      { q: "Hva er frivillig MVA-registrering?", a: "Frivillig MVA-registrering lar bedrifter som normalt er unntatt MVA-plikt (f.eks. utleie av fast eiendom) registrere seg frivillig for å få fradrag for inngående MVA. Dette er vanlig for eiendomsselskaper som leier ut til MVA-pliktige leietakere. Avargo vurderer om frivillig registrering er lønnsomt for deg." },
      { q: "Hva er MVA-satser i Norge?", a: "Norge har tre MVA-satser: 25 % (generell sats for de fleste varer og tjenester), 15 % (matvarer), og 12 % (persontransport, kino, museer, fornøyelsesparker og overnatting). Enkelte tjenester er fritatt for MVA, som helsetjenester, undervisning og finansielle tjenester." },
      { q: "Hva er tolldeklarasjon og importavgifter?", a: "Ved import av varer til Norge skal det leveres tolldeklarasjon til Tolletaten. Du betaler importavgifter som inkluderer toll og importmoms (MVA). Satsene varierer etter varetype og opprinnelsesland. Avargo hjelper med korrekt tollbehandling og bokføring av importtransaksjoner." },
      { q: "Hva er særavgifter?", a: "Særavgifter er avgifter på spesielle varer som alkohol, tobakk, sukker, drivstoff, strøm og CO₂-utslipp. Bedrifter som produserer eller importerer slike varer må registrere seg hos Skatteetaten og rapportere særavgifter. Avargo har erfaring med særavgiftsrapportering for relevante bransjer." },
    ],
  },
  {
    title: "Personvern & Compliance",
    items: [
      { q: "Hva er GDPR og gjelder det min bedrift?", a: "GDPR (General Data Protection Regulation / personvernforordningen) gjelder alle bedrifter som behandler personopplysninger om personer i EU/EØS — uansett størrelse. Du må ha behandlingsgrunnlag, personvernerklæring, databehandleravtaler og rutiner for innsyn og sletting. Avargo sørger for at regnskapsdata behandles i henhold til GDPR." },
      { q: "Hva er en databehandleravtale?", a: "En databehandleravtale regulerer forholdet mellom en virksomhet (behandlingsansvarlig) og en leverandør som behandler personopplysninger på vegne av virksomheten (databehandler). Alle regnskapskunder hos Avargo har en slik avtale som sikrer at data behandles trygt og lovlig." },
      { q: "Hva er bokføringsloven og oppbevaringsplikten?", a: "Bokføringsloven krever at alle bokføringspliktige virksomheter oppbevarer regnskapsmateriale i minst 5 år etter regnskapsårets slutt. Primærdokumentasjon (fakturaer, bankbilag) og sekundærdokumentasjon (kontrakter, korrespondanse) skal lagres sikkert og være tilgjengelig for kontroll. Avargo håndterer arkivering i henhold til loven." },
      { q: "Hva er internkontroll?", a: "Internkontroll er systematiske tiltak for å sikre at virksomheten oppfyller krav i lover og forskrifter — særlig HMS, personvern og regelverk for den aktuelle bransjen. Internkontrollforskriften pålegger alle norske virksomheter å ha et dokumentert system. Avargo tilbyr oppsett og vedlikehold av internkontrollsystem." },
      { q: "Hva er hvitvaskingsloven og hvem gjelder den?", a: "Hvitvaskingsloven pålegger rapporteringspliktige (bl.a. regnskapsførere, revisorer, banker og advokater) å gjennomføre kundekontroll, overvåke transaksjoner og rapportere mistenkelige forhold til Økokrim. Avargo gjennomfører lovpålagt kundekontroll (KYC) som del av onboarding-prosessen." },
    ],
  },
  {
    title: "Fakturering & Inkasso",
    items: [
      { q: "Hva skal en faktura inneholde?", a: "En gyldig faktura i Norge skal inneholde: selgers navn, adresse og organisasjonsnummer, kjøpers navn og adresse, fakturanummer, dato, beskrivelse av varen/tjenesten, beløp ekskl. og inkl. MVA, MVA-beløp spesifisert per sats, betalingsfrist og kontonummer. Avargo sørger for at alle fakturaer oppfyller kravene i bokføringsloven." },
      { q: "Hva er kreditnota?", a: "En kreditnota er et dokument som korrigerer eller kansellerer en tidligere utstedt faktura — helt eller delvis. Den brukes ved feil på faktura, returer, prisavslag eller kansellerte ordre. Kreditnotaen skal referere til original faktura og bokføres som en reduksjon av omsetning." },
      { q: "Når kan jeg sende inkassovarsel?", a: "Du kan sende inkassovarsel tidligst 14 dager etter forfall på fakturaen, eller 14 dager etter at purring med 14 dagers betalingsfrist er sendt. Inkassovarselet må oppfylle kravene i inkassoloven, inkludert minimum 14 dagers betalingsfrist. Avargo har integrasjon med inkassopartner for automatisert purring og inkasso." },
      { q: "Hva er forfallsdato og betalingsbetingelser?", a: "Forfallsdato er den siste dagen kunden kan betale uten forsinkelsesgebyr. Vanlige betalingsbetingelser i Norge er 14 eller 30 dager. Du kan avtale egne betingelser med kunden. Ved forsinket betaling har du krav på forsinkelsesrente fastsatt av Finansdepartementet. Avargo automatiserer purring og oppfølging av utestående fakturaer." },
      { q: "Hva er e-faktura til privatpersoner?", a: "E-faktura (eFaktura) er en elektronisk faktura sendt direkte til kundens nettbank. Kunden godkjenner og betaler i nettbanken uten å taste inn KID-nummer. For å sende eFaktura må du registrere deg hos Mastercard Payment Services. Avargo hjelper med oppsett av eFaktura og automatisk distribusjon." },
    ],
  },
  {
    title: "Oppstart & Gründer",
    items: [
      { q: "Hva trenger jeg for å starte bedrift i Norge?", a: "For å starte bedrift trenger du: en forretningsidé, valg av selskapsform (ENK eller AS), registrering i Brønnøysundregistrene, åpning av bedriftskonto, eventuell MVA-registrering og regnskapsfører. Avargo har en komplett oppstartspakke som inkluderer alt — fra stiftelse til løpende regnskap." },
      { q: "Hva koster det å starte et AS?", a: "Kostnader for å starte et AS inkluderer: 30 000 kr i aksjekapital (som blir selskapets midler), ca. 5 570 kr i registreringsgebyr til Brønnøysundregistrene, og eventuelt honorar til advokat/regnskapsfører for stiftelsesdokumenter. Avargo hjelper med stiftelsen til en fast pris." },
      { q: "Hva er Innovasjon Norge og kan de hjelpe meg?", a: "Innovasjon Norge er en statlig aktør som tilbyr finansiering (lån, tilskudd), rådgivning og nettverk for bedrifter med vekstpotensial. De tilbyr oppstartslån, innovasjonslån, markedsavklaringstilskudd og mentorprogrammer. Avargo hjelper deg med søknader og utarbeidelse av forretningsplan." },
      { q: "Hva er etablererstøtte?", a: "Etablererstøtte er offentlige tilskudd og veiledningsprogrammer for gründere. Kommuner og fylkeskommuner tilbyr ofte kurs, mentorordninger og tilskudd. I tillegg finnes nasjonale ordninger gjennom Innovasjon Norge, Forskningsrådet og SIVA. Avargo kjenner de relevante ordningene og hjelper med søknader." },
      { q: "Hva er forretningsplan og trenger jeg det?", a: "En forretningsplan beskriver forretningsideen, markedet, konkurrenter, strategi, organisasjon og økonomi. Den er nødvendig for å søke finansiering, men er også et verdifullt styringsverktøy. Avargo bistår med utarbeidelse av forretningsplan med vekt på den finansielle delen — budsjett, likviditetsprognose og break-even-analyse." },
      { q: "Bør jeg velge ENK eller AS som gründer?", a: "Det avhenger av risiko, inntektsnivå og planer. AS anbefales dersom du forventer omsetning over 500 000 kr, ønsker begrenset ansvar, planlegger å ta inn partnere/investorer eller ansette. ENK passer dersom risikoen er lav og inntektene moderate. Avargo gir deg en konkret anbefaling basert på din situasjon." },
      { q: "Hva er MVA-registrering og når må jeg registrere meg?", a: "Du må registrere deg i Merverdiavgiftsregisteret når omsetningen de siste 12 månedene overstiger 50 000 kr. Registreringen gjøres via Altinn. Etter registrering må du beregne og kreve inn MVA, og rapportere annenhver måned. Du kan også forhåndsregistrere deg dersom du har store oppstartsinvesteringer." },
    ],
  },
  {
    title: "Rapportering & Frister",
    items: [
      { q: "Hva er de viktigste regnskapsfristene?", a: "Viktige frister i Norge: A-melding den 5. i hver måned, MVA-rapportering annenhver måned (10. i måneden etter termin), forskuddsskatt 15. februar og 15. april, skattemelding for AS 31. mai, skattemelding for ENK 30. april, årsregnskap til Brønnøysund 31. juli. Avargo holder styr på alle frister." },
      { q: "Hva skjer om jeg leverer for sent?", a: "Forsinkede leveranser kan medføre tvangsmulkt, forsinkelsesgebyr og tilleggsskatt. For MVA-rapportering kan Skatteetaten ilegge tvangsmulkt på opptil 1/4 av avgiftsbeløpet. For forsinket årsregnskap kan Brønnøysundregistrene ilegge tvangsoppløsning. Avargo leverer alltid i tide." },
      { q: "Hva er skattemelding for selskaper?", a: "Skattemeldingen for selskaper er en årlig innrapportering til Skatteetaten som inneholder næringsoppgaven (RF-1167), selskapets skattbare inntekt, eierskapsopplysninger, aksjonærregisteroppgave og evt. andre vedlegg. Fristen er 31. mai. Avargo utarbeider skattemeldingen og leverer den elektronisk via Altinn." },
      { q: "Hva er aksjonærregisteroppgaven (RF-1086)?", a: "Aksjonærregisteroppgaven rapporterer endringer i aksjekapital, eierskap og aksjeutbytte i løpet av året. Den leveres til Skatteetaten innen 31. januar. Opplysningene brukes til å beregne skjermingsfradrag og dokumentere aksjeeiernes skatteposisjon. Avargo utarbeider og leverer RF-1086 som del av standardleveransen." },
      { q: "Hva er Altinn og hvordan brukes det?", a: "Altinn er Norges digitale plattform for innrapportering til offentlige myndigheter. Gjennom Altinn leverer du MVA-rapporter, skattemeldinger, A-meldinger, årsregnskap og andre pliktige skjemaer. Du logger inn med BankID. Avargo har fullmakt til å levere på vegne av kundene sine via Altinn." },
      { q: "Hva er termin og terminoppgjør?", a: "En termin er en rapporteringsperiode for MVA — i Norge normalt 2 måneder (6 terminer per år). Terminoppgjøret innebærer å beregne differansen mellom utgående og inngående MVA for perioden og rapportere til Skatteetaten. Overskytende MVA utbetales, underskudd innbetales. Avargo håndterer terminoppgjør automatisk." },
    ],
  },
  {
    title: "Finans & Investering",
    items: [
      { q: "Hva er kapitalforhøyelse?", a: "Kapitalforhøyelse er en økning av aksjekapitalen i et AS — enten ved nytegning (nye aksjer) eller fondsemisjon (overføring fra egenkapital). Det brukes til å hente inn mer kapital fra eksisterende eller nye aksjonærer. Prosessen krever generalforsamlingsvedtak og registrering i Foretaksregisteret. Avargo håndterer den regnskapsmessige og dokumentasjonsmessige siden." },
      { q: "Hva er emisjon?", a: "Emisjon er utstedelse av nye aksjer i et selskap for å hente inn kapital. Rettet emisjon rettes mot bestemte investorer, mens fortrinnsrettsemisjon gir eksisterende aksjonærer rett til å tegne nye aksjer. Emisjonens vilkår fastsettes av generalforsamlingen. Avargo bistår med verdsettelse, dokumentasjon og regnskapsmessig behandling." },
      { q: "Hva er selskapsvurdering/verdivurdering?", a: "Verdivurdering er en estimering av selskapets verdi — brukt ved salg, investering, fusjon eller skattemessige formål. Vanlige metoder inkluderer kontantstrømanalyse (DCF), multippelmetoder (P/E, EV/EBITDA), og substansverdi. Avargo tilbyr finansiell verdivurdering som del av CFO-tjenestene." },
      { q: "Hva er konsolidert regnskap?", a: "Konsolidert regnskap (konsernregnskap) er et samlet regnskap for et morselskap og dets datterselskaper, presentert som om de var én økonomisk enhet. Konsernregnskap eliminerer interne transaksjoner og fordringer. Det er pålagt for selskaper som kontrollerer ett eller flere datterselskaper. Avargo har erfaring med konsernkonsolidering." },
      { q: "Hva er EBITDA?", a: "EBITDA står for Earnings Before Interest, Taxes, Depreciation and Amortization — resultat før renter, skatt, avskrivninger og amortiseringer. Det er et mye brukt nøkkeltall for å sammenligne lønnsomhet mellom selskaper uavhengig av kapitalstruktur og avskrivningspolicy. Avargo beregner og rapporterer EBITDA som del av finansiell rapportering." },
      { q: "Hva er likviditetsbudsjett?", a: "Et likviditetsbudsjett viser forventede inn- og utbetalinger over en periode — typisk 12 måneder. Det avdekker om og når selskapet kan få likviditetsproblemer, og gir grunnlag for tiltak som kassakreditt, betalingsutsettelse eller kapitalinnhenting. Avargo utarbeider likviditetsprognoser som del av CFO-tjenestene." },
    ],
  },
  {
    title: "Avslutning & Avvikling",
    items: [
      { q: "Hvordan legger jeg ned et aksjeselskap?", a: "Nedleggelse av AS skjer enten gjennom frivillig avvikling (generalforsamlingsvedtak, avviklingsstyre, kreditorvarsel, sluttoppgjør) eller tvangsoppløsning. Frivillig avvikling tar normalt 3-6 måneder og krever kunngjøring med 6 ukers kreditorfrist. Avargo håndterer avviklingsregnskap, skattemelding og sluttoppgjør." },
      { q: "Hva er fusjon og fisjon?", a: "Fusjon er sammenslåing av to eller flere selskaper til ett. Fisjon er oppdeling av et selskap i to eller flere. Begge prosessene kan gjennomføres skattefritt dersom reglene i aksjeloven og skatteloven følges. Avargo bistår med planlegging, regnskapsmessig behandling og dokumentasjon." },
      { q: "Hva skjer med skatten ved salg av selskap?", a: "Ved salg av aksjer i et AS betaler selgende aksjonær (privatperson) skatt på gevinsten med en effektiv sats på ca. 37,84 % etter oppjustering. Dersom selger er et holdingselskap, er gevinsten tilnærmet skattefri under fritaksmetoden. Avargo hjelper med å strukturere salget på den mest skatteeffektive måten." },
      { q: "Hva er generasjonsskifte i bedriften?", a: "Generasjonsskifte innebærer overdragelse av bedriften til neste generasjon — gjennom gave, salg eller arv. Det krever skatteplanlegging, verdivurdering og eventuelt aksjonæravtale. Avargo hjelper med å planlegge generasjonsskiftet slik at overføringen skjer smidig og skatteeffektivt." },
    ],
  },
];

// Flatten all Q&A for JSON-LD
const allFaqs = categories.flatMap(c => c.items);

const FAQ = () => {
  const [search, setSearch] = useState("");
  const [openCats, setOpenCats] = useState<Set<number>>(new Set());
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const toggleCat = (i: number) => {
    setOpenCats(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  };

  const isSearching = search.trim().length > 0;

  const filtered = isSearching
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
        <title>Vanlige spørsmål om regnskap, skatt og regnskapsfører | Avargo</title>
        <meta name="description" content="Over 100 svar på spørsmål om regnskapsfører, skatteoptimalisering, lønnskjøring, MVA, selskapsrett, regnskapssystemer, integrasjoner, fakturering og mer. Alt du trenger å vite." />
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
              Over {allFaqs.length} svar på spørsmål om regnskapsfører, skatt, lønn, systemer, integrasjoner og rådgivning. Søk eller bla gjennom kategoriene nedenfor.
            </p>
            <div className="relative max-w-md mx-auto">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
              <input
                type="text"
                placeholder="Søk blant alle spørsmål…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-full bg-card/50 border border-border/20 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/40 transition-colors"
              />
            </div>
            {!isSearching && (
              <p className="text-muted-foreground/50 text-xs mt-4">Klikk på en kategori for å åpne, eller bruk søkefeltet for å finne svar.</p>
            )}
          </motion.div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="pb-24 md:pb-40">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground text-sm">Ingen spørsmål matchet søket ditt.</p>
          )}
          {filtered.map((cat, ci) => {
            const originalCatIndex = categories.findIndex(c => c.title === cat.title);
            const isCatOpen = isSearching || openCats.has(originalCatIndex);
            return (
              <AnimatedSection key={cat.title} delay={ci * 0.03}>
                <div className="mb-6">
                  <button
                    onClick={() => !isSearching && toggleCat(originalCatIndex)}
                    className="w-full flex items-center justify-between gap-4 py-4 px-2 text-left group"
                  >
                    <h2 className="font-heading text-xl md:text-2xl text-foreground/90 group-hover:text-primary transition-colors">
                      {cat.title}
                      <span className="ml-3 text-xs font-normal text-muted-foreground/60">({cat.items.length})</span>
                    </h2>
                    {!isSearching && (
                      <ChevronDown
                        size={18}
                        className={`shrink-0 text-muted-foreground transition-transform duration-300 ${isCatOpen ? "rotate-180" : ""}`}
                      />
                    )}
                  </button>

                  {/* Always render content in DOM for SEO/AI crawlability, but visually hide when collapsed */}
                  <div
                    className={isCatOpen ? "space-y-2" : "sr-only"}
                    aria-hidden={!isCatOpen}
                  >
                    {cat.items.map((item, ii) => {
                      const key = `${originalCatIndex}-${ii}`;
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
            );
          })}
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
               En av våre statsautoriserte regnskapsførere svarer deg innen 24 timer. Helt uforpliktende.
             </p>
             <Link
               to="/kontakt"
               className="group inline-flex items-center gap-3 px-10 md:px-12 py-4 md:py-5 bg-primary text-primary-foreground text-sm font-medium tracking-wider rounded-full glow-rose hover:scale-[1.02] transition-all duration-500"
             >
               Snakk med en regnskapsfører
              <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
};

export default FAQ;
