import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Search, ChevronDown } from "lucide-react";
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
      { q: "Hva gjør en regnskapsfører?", a: "En regnskapsfører håndterer den økonomiske administrasjonen i bedriften din: løpende bokføring, MVA-rapportering, årsregnskap og næringsoppgave, skattemelding, aksjonærregisteroppgave og proaktiv rådgivning. Hos Avargo får du én fast person som kjenner selskapet og bransjen din." },
      { q: "Hvordan bytter jeg regnskapsfører?", a: "1) Ta kontakt med oss for en uforpliktende samtale. 2) Vi sender oppsigelsesbrev til din nåværende regnskapsfører. 3) Vi henter alle data og setter opp systemene. 4) Du får en dedikert regnskapsfører fra dag én. Prosessen tar 2–4 uker, og vi håndterer alt det praktiske." },
      { q: "Trenger jeg en autorisert regnskapsfører?", a: "I Norge er det lovpålagt at regnskapsførere som fører regnskap for andre er autorisert av Finanstilsynet. Alle regnskapsførere hos Avargo er autoriserte og oppdaterte gjennom obligatorisk etterutdanning." },
      { q: "Hva er forskjellen mellom regnskapsfører og revisor?", a: "Regnskapsføreren fører regnskapet ditt løpende — bokføring, MVA, lønn og årsregnskap. Revisoren kontrollerer regnskapet i etterkant og avgir en uavhengig beretning. De fleste SMB trenger regnskapsfører, men ikke nødvendigvis revisor." },
      { q: "Når har et AS revisjonsplikt?", a: "Revisjonsplikt inntrer når to av tre vilkår er oppfylt: driftsinntekter over 7 MNOK, balansesum over 27 MNOK, eller gjennomsnittlig over 10 årsverk. Under grensene kan generalforsamlingen fravelge revisjon." },
      { q: "Hva er inkludert i regnskapstjenesten hos Avargo?", a: "Løpende bokføring, MVA-rapportering, årsregnskap og næringsoppgave, skattemelding for selskap og eier, aksjonærregisteroppgave (RF-1086), bankintegrasjon, revisjonstøtte og proaktiv rådgivning — alt til fast pris." },
      { q: "Hva er forskjellen mellom regnskap og bokføring?", a: "Bokføring er den daglige registreringen av transaksjoner. Regnskap er det overordnede begrepet som også inkluderer årsregnskap, skattemelding, MVA-rapportering og finansiell analyse." },
      { q: "Kan jeg føre regnskapet selv?", a: "Ja, dersom du har kompetansen. Men mange bruker timer hver uke på bilag og rapportering — tid som kunne gått til drift og salg. En regnskapsfører gir kvalitet, frister og rådgivning som ofte sparer mer enn kostnaden." },
      { q: "Hva er et årsregnskap?", a: "En lovpålagt rapport som viser selskapets finansielle stilling ved årsslutt: resultatregnskap, balanse og noter. Alle AS må levere årsregnskap til Regnskapsregisteret innen 31. juli." },
      { q: "Hva er bilagshåndtering?", a: "Prosessen med å samle inn, registrere og arkivere alle økonomiske dokumenter — fakturaer, kvitteringer, bankbilag og kontrakter. Grunnlaget for et korrekt regnskap." },
      { q: "Hva er regnskapsplikt?", a: "Plikten til å føre regnskap etter regnskapsloven. Gjelder alle AS/ASA, samt ENK og ANS med over 20 MNOK i eiendeler eller over 20 årsverk." },
      { q: "Hva er en næringsoppgave?", a: "Vedlegg til skattemeldingen som gir detaljert oversikt over inntekter, kostnader, eiendeler og gjeld. Grunnlag for beregning av skatt." },
      { q: "Hva er periodisering?", a: "Å føre inntekter og kostnader i den perioden de tilhører, uavhengig av betalingsdato. En faktura for januar-arbeid inntektsføres i januar selv om betalingen kommer senere." },
      { q: "Hva er kontoplan?", a: "En strukturert oversikt over alle regnskapskontoene. De fleste i Norge bruker Norsk Standard kontoplan (NS 4102). Riktig kontoplan sikrer korrekt rapportering." },
      { q: "Hvor ofte får jeg regnskapsrapporter?", a: "Hos Avargo får du månedlig resultat og balanse som standard, samt sanntidsinnsikt i portalen. Kvartalsvise strategimøter er inkludert." },
      { q: "Hvem eier regnskapet mitt?", a: "Du eier alltid regnskapsdataene selv. Ved oppsigelse får du full eksport av alle bilag, hovedbok og rapporter." },
      { q: "Hva er en hovedbok?", a: "Oversikten over alle bokførte transaksjoner sortert per konto. Grunnlaget for resultatregnskap og balanse." },
      { q: "Hva er balansen?", a: "Balansen viser selskapets eiendeler, gjeld og egenkapital på et gitt tidspunkt. Eiendeler = gjeld + egenkapital." },
      { q: "Hva er resultatregnskapet?", a: "Rapport som viser inntekter og kostnader over en periode, og selskapets resultat (over-/underskudd)." },
      { q: "Hva er egenkapital?", a: "Differansen mellom selskapets eiendeler og gjeld — det som tilhører eierne. Består av innskutt egenkapital (aksjekapital, overkurs) og opptjent egenkapital." },
      { q: "Hva er avskrivning?", a: "Kostnadsføring av driftsmidler over levetid. Et bygg avskrives f.eks. lineært, mens maskiner ofte saldoavskrives (skattemessig) med 20 %." },
      { q: "Hva er nedskrivning?", a: "Reduksjon av bokført verdi når virkelig verdi er varig lavere enn kostpris. Skjer f.eks. ved tap på fordringer eller verdifall på anleggsmidler." },
      { q: "Hva koster det å skifte regnskapsfører midt i året?", a: "Hos Avargo koster overgangen ingenting ekstra. Vi tar over historikken, kvalitetssikrer inngående balanse og fortsetter fra der du står." },
      { q: "Får jeg en fast kontaktperson?", a: "Ja. Hver kunde får én dedikert regnskapsfører som kjenner bedriften. Ved fravær har vi en fast backup slik at du aldri står uten støtte." },
    ],
  },
  {
    title: "Bokføring & Bilag",
    items: [
      { q: "Hvor lenge må jeg oppbevare bilag?", a: "Primærdokumentasjon som fakturaer og bankbilag skal oppbevares i 5 år etter regnskapsårets slutt. Enkelte bransjer har lengre krav (f.eks. bygg: 10 år for prosjektdokumentasjon)." },
      { q: "Kan jeg oppbevare bilag digitalt?", a: "Ja. Elektronisk oppbevaring er tillatt så lenge bilagene er sikret mot endring og kan hentes ut i lesbar form i hele oppbevaringsperioden." },
      { q: "Hva er et gyldig bilag?", a: "Et bilag må inneholde: dato, beløp, beskrivelse, partenes navn/orgnr, MVA-spesifikasjon og bilagsnummer. Kvitteringer på under 40 000 kr kan mangle kjøpers navn." },
      { q: "Hva er kontering?", a: "Å tildele riktig konto og MVA-kode til en transaksjon i regnskapet. Grunnlaget for korrekt rapportering." },
      { q: "Hva gjør jeg hvis jeg mister et bilag?", a: "Ta kontakt med leverandøren for kopi. Manglende bilag kan gi fradragsnekt for MVA og kostnad. Ved kortbetaling kan bankutskrift være sekundær dokumentasjon, men ikke tilstrekkelig alene." },
      { q: "Kan jeg bokføre kontanter?", a: "Ja, men kontantsalg over 40 000 kr per betaling er ulovlig for næringsdrivende. Kasseapparat med kassaregisterlov gjelder for kontantsalg." },
      { q: "Hva er inngående og utgående MVA?", a: "Utgående MVA er avgiften du krever inn på salg. Inngående MVA er den du betaler ved kjøp og får fradrag for. Differansen betales til (eller refunderes av) Skatteetaten." },
      { q: "Hva er bilagsnummer?", a: "Et unikt løpenummer som identifiserer hvert bilag. Skal være fortløpende uten hull for å sikre sporbarhet." },
      { q: "Hva er dobbelt bokføring?", a: "Prinsippet om at hver transaksjon påvirker minst to kontoer (debet og kredit) med like beløp. Sikrer at balansen alltid går opp." },
      { q: "Hva er debet og kredit?", a: "Debet er venstre side av kontoen (økning av eiendel/kostnad), kredit er høyre side (økning av gjeld/inntekt/EK). Sum debet skal alltid = sum kredit." },
      { q: "Hva er avstemming?", a: "Kontroll av at regnskapstall stemmer med eksterne kilder — bank, kunder, leverandører, MVA og lønn. Utføres månedlig hos Avargo." },
      { q: "Hva er en bilagsjournal?", a: "En kronologisk oversikt over alle bokførte bilag med dato, tekst, kontoer og beløp. Utgangspunktet for kontroll og revisjon." },
      { q: "Kan jeg fradragsføre bevertning?", a: "Bevertning i næring er delvis fradragsberettiget: 469 kr per person per anledning (2026-satser), forutsatt at det er saklig sammenheng med drift og dokumentert." },
      { q: "Hvordan bokfører jeg bilkostnader?", a: "Firmabil: alle kostnader føres i selskapet, men bruker beskattes for fordel. Privatbil i næring: kilometergodtgjørelse etter statens satser (3,50 kr/km fra 2026)." },
      { q: "Hva er varekost?", a: "Kostnaden for varer solgt i perioden. Beregnes som inngående lager + kjøp − utgående lager. Direkte knyttet til omsetningen." },
      { q: "Hva er varelager?", a: "Beholdning av varer for salg, råvarer og varer under tilvirkning. Verdsettes til laveste av kostpris og virkelig verdi ved årsslutt." },
      { q: "Hvordan telle varelageret?", a: "Fysisk telling ved regnskapsårets slutt (eller løpende med perpetuelt system). Dokumenteres med tellelister signert av teller og kontrollør." },
      { q: "Hva er en åpningsbalanse?", a: "Balansen ved oppstart eller ved overgang til ny regnskapsfører. Grunnlaget for videre bokføring." },
      { q: "Kan jeg bokføre fakturaer i utenlandsk valuta?", a: "Ja. Beløp omregnes til NOK etter dagskursen på fakturadato. Valutagevinster/-tap ved betaling føres på egen konto." },
      { q: "Hva er en purregebyr?", a: "Gebyr ved forsinket betaling — inntil 1/10 av inkassosalæret (85 kr i 2026). Skal varsles i faktura eller ved første purring." },
    ],
  },
  {
    title: "MVA & Avgifter",
    items: [
      { q: "Når er jeg MVA-pliktig?", a: "Når avgiftspliktig omsetning overstiger 50 000 kr i løpet av en 12-månedersperiode. Registrering skjer via Samordnet registermelding i Altinn." },
      { q: "Hva er MVA-satsene i Norge?", a: "25 % (generell), 15 % (matvarer), 12 % (persontransport, overnatting, kino, museer). Enkelte tjenester er fritatt (helse, undervisning, finans)." },
      { q: "Hvor ofte skal MVA rapporteres?", a: "Standard er to måneder per termin (6 terminer/år). Små virksomheter (under 1 MNOK) kan søke om årlig oppgave. Fristen er 1 måned og 10 dager etter terminslutt." },
      { q: "Hva er omvendt avgiftsplikt?", a: "Kjøper — ikke selger — beregner og rapporterer MVA. Gjelder ved kjøp av tjenester fra utlandet og enkelte innenlandske ytelser (klimakvoter, gull)." },
      { q: "Hva er frivillig MVA-registrering?", a: "Bedrifter som normalt er unntatt (f.eks. utleie av fast eiendom) kan registrere seg frivillig for å få fradrag for inngående MVA. Vanlig for næringseiendom." },
      { q: "Hva er MVA-kompensasjon?", a: "Kommuner, fylkeskommuner og enkelte ideelle organisasjoner kan få refundert MVA på innkjøp gjennom MVA-kompensasjonsordningen." },
      { q: "Hvordan behandles MVA ved eksport?", a: "Eksport av varer og tjenester ut av MVA-området er fritatt for utgående MVA (0-sats), men gir fortsatt fradrag for inngående MVA. Dokumentasjon på utførsel er påkrevd." },
      { q: "Hva er importmoms?", a: "MVA som beregnes ved innførsel av varer. MVA-registrerte beregner og rapporterer selv i mva-meldingen (utsatt avregning)." },
      { q: "Kan jeg få fradrag for MVA på bil?", a: "Personbiler: som hovedregel nei. Varebiler klasse 2 og lastebiler: ja, forutsatt bruk i avgiftspliktig virksomhet. Regelverket er strengt — spør regnskapsfører før kjøp." },
      { q: "Hva er tolldeklarasjon?", a: "Innmelding av varer ved import/eksport til Tolletaten. TVINN eller Tolldeklarasjonssystemet brukes. Ved import beregnes toll og importmoms." },
      { q: "Hva er særavgifter?", a: "Avgifter på spesifikke varer: alkohol, tobakk, sukker, drivstoff, elektrisk kraft og CO₂. Rapporteres månedlig i Særavgiftsmelding." },
      { q: "Hva skjer hvis jeg leverer MVA-melding for sent?", a: "Skatteetaten kan ilegge tvangsmulkt (1 rettsgebyr per dag, maks 50 rettsgebyr). I tillegg kan det bli tilleggsavgift ved feil eller manglende betaling." },
      { q: "Hva er null-oppgave?", a: "MVA-melding uten aktivitet. Skal likevel leveres innen fristen så lenge selskapet er MVA-registrert." },
      { q: "Kan jeg slette meg fra MVA-registeret?", a: "Ja, dersom omsetningen har vært under 50 000 kr i minst 12 måneder, eller ved opphør av virksomhet. Sletting skjer via Samordnet registermelding." },
      { q: "Hva er justering av inngående MVA?", a: "Ved endret bruk av kapitalvarer (typisk fast eiendom) må inngående MVA justeres over 10 år. Aktuelt ved salg, utleie eller bruksomlegging." },
      { q: "MVA på bevertning — kan jeg fradragsføre?", a: "Nei, bevertning gir ikke rett til fradrag for inngående MVA, med unntak for kantine og kurs/konferanser med enkel servering." },
      { q: "Hva er finansiell aktivitet og MVA?", a: "Finansielle tjenester (lån, forsikring, aksjemegling) er unntatt fra MVA. Det gir ikke rett til fradrag for inngående MVA på tilhørende kostnader." },
    ],
  },
  {
    title: "Skatt & Skatteoptimalisering",
    items: [
      { q: "Hva er skattesatsen for AS?", a: "Selskapsskatten på overskudd er 22 % (2026). Utbytte til personlig aksjonær beskattes i tillegg med effektivt 37,84 % etter oppjustering." },
      { q: "Når er fristen for skattemeldingen?", a: "AS: 31. mai. Enkeltpersonforetak (ENK): 31. mai (30. april for personer uten næring). MVA: 1 mnd + 10 dager etter terminslutt. A-melding: 5. i hver måned." },
      { q: "Hva er skjermingsfradrag?", a: "Et skattefradrag på utbytte fra aksjer, beregnet som inngangsverdi × skjermingsrente. Reduserer effektiv skatt på utbytte. Ubenyttet fradrag kan fremføres." },
      { q: "Hva er forskjellen mellom lønn og utbytte?", a: "Lønn: skattlegges progressivt (opptil 47,4 %) + arbeidsgiveravgift (14,1 %), men gir trygderettigheter. Utbytte: 37,84 % effektiv skatt, ingen AGA, men bygger ikke pensjon eller sykepenger." },
      { q: "Hva er forskuddsskatt?", a: "Skatt AS betaler i to terminer (15. februar og 15. april året etter inntektsåret) basert på fjorårets grunnlag. Kan justeres opp/ned via egen søknad." },
      { q: "Hva er SkatteFUNN?", a: "Skattefradrag for forsknings- og utviklingsprosjekter. 19 % fradrag av godkjente FoU-kostnader opptil 25 MNOK per år. Krever forhåndsgodkjenning fra Forskningsrådet." },
      { q: "Hvilke fradrag kan et AS få?", a: "Kostnader til inntekts ervervelse: lønn, husleie, forsikring, avskrivninger, reise, kompetanseheving, forsikringer, tap på fordringer, FoU (SkatteFUNN), pensjon m.m." },
      { q: "Kan jeg fradragsføre hjemmekontor?", a: "AS: leieavtale med eier på markedsvilkår gir fradrag i selskapet. ENK: standardfradrag 1 850 kr/år eller faktisk andel av bokostnader. Ansatt i eget AS: ikke standard, men mulig med bruksavtale." },
      { q: "Hva er personinntekt for eier av ENK?", a: "Beregnet næringsinntekt som beskattes som lønn (trinnskatt + trygdeavgift 11,4 %). Grunnlag for sykepenger og pensjon." },
      { q: "Hva er aksjonærmodellen?", a: "Modell for beskatning av utbytte og aksjegevinst hos personlige aksjonærer. Innebærer 37,84 % effektiv skatt etter skjermingsfradrag og oppjustering." },
      { q: "Hva er fritaksmetoden?", a: "Regel som gjør utbytte og aksjegevinst mellom AS tilnærmet skattefritt (3 % skattlegges). Grunnlaget for holdingstrukturer i Norge." },
      { q: "Bør jeg ha holdingselskap?", a: "Holdingselskap gir skattefri utbyttebehandling mellom selskapene, fleksibilitet ved reinvestering og enklere generasjonsskifte. Anbefales ofte når selskapet går med overskudd." },
      { q: "Hva er trinnskatt?", a: "Progressiv skatt på personinntekt med 5 trinn (fra 1,7 % til 17,7 % i 2026). Kommer i tillegg til alminnelig skatt på 22 %." },
      { q: "Hva er arbeidsgiveravgift?", a: "Avgift arbeidsgiver betaler av lønn — 14,1 % i sone 1. Reduseres i distriktssoner (helt ned til 0 % i tiltakssonen)." },
      { q: "Hva er trygdeavgift?", a: "Avgift lønnstakere og næringsdrivende betaler for trygderettigheter: 7,8 % (lønn), 11,4 % (næring), 5,1 % (pensjon)." },
      { q: "Hvordan reduserer jeg skatten lovlig?", a: "Utnytt fradrag (pensjon, FoU, hjemmekontor), balansér lønn/utbytte, invester i driftsmidler, bruk holdingstruktur, avsett til pensjon. Skatteplanlegging er lovlig — skatteunndragelse er ikke." },
      { q: "Hva er aksjesparekonto (ASK)?", a: "Personlig konto for aksjer og fond der du kan bytte investeringer skattefritt. Skatt beregnes først ved uttak over innskutt beløp." },
      { q: "Hva er formuesskatt?", a: "Skatt på nettoformue over bunnfradrag (1,76 MNOK i 2026, dobbelt for ektefeller). Sats: 1,0 % stat + 0,7 % kommune. Arbeidende kapital rabatteres." },
      { q: "Hva er utbytteskatt?", a: "Skatt på utbytte fra AS til personlig aksjonær: 37,84 % effektivt (22 % × oppjusteringsfaktor 1,72) etter skjermingsfradrag." },
      { q: "Hva er aksjonærregisteroppgaven (RF-1086)?", a: "Årlig oppgave til Skatteetaten som viser eierstruktur, kapitalendringer og utbytte. Frist 31. januar. Skal leveres av alle AS." },
      { q: "Hva er restskatt og tilleggsforskudd?", a: "Restskatt: skatt som ikke er dekket av forskudd. Tilleggsforskudd: frivillig innbetaling innen 31. mai for å unngå rentetillegg." },
      { q: "Hva er skatteklasse?", a: "Skatteklassene 1 og 2 er avskaffet fra 2018. I dag beregnes skatten individuelt for alle personer." },
      { q: "Hva skjer ved bokettersyn?", a: "Skatteetaten kontrollerer regnskapet. Du plikter å fremlegge dokumentasjon og gi opplysninger. Avargo bistår i hele prosessen — fra korrespondanse til møter." },
      { q: "Hva er tilleggsskatt?", a: "Straff for uriktige/ufullstendige opplysninger til Skatteetaten. Sats 20 % (standard) eller 40–60 % ved grov uaktsomhet/forsett. Kan påklages." },
      { q: "Hva er koordineringsregler?", a: "Regler som forhindrer dobbeltbeskatning ved grensekryssende inntekt — skatteavtaler og fradrag for skatt betalt i utlandet." },
    ],
  },
  {
    title: "Lønn & A-melding",
    items: [
      { q: "Når skal lønn utbetales?", a: "Vanligvis månedlig med utbetaling siste virkedag i måneden, i tråd med arbeidsavtale og tariffavtale. Utbetalingsdato skal være fast og forutsigbar." },
      { q: "Hva er A-melding?", a: "Månedlig rapportering til NAV, SSB og Skatteetaten om lønn, arbeidsforhold og skattetrekk. Frist er 5. i måneden etter lønnskjøring." },
      { q: "Hva er skattetrekk?", a: "Forskuddstrekk arbeidsgiver holder tilbake fra lønn og betaler til Skatteetaten. Skjer etter skattekort hentet elektronisk fra Skatteetaten." },
      { q: "Hva er skattekort?", a: "Elektronisk dokument som viser hvor mye arbeidsgiver skal trekke i skatt. Hentes automatisk fra Skatteetaten. Frikort utstedes ved lav forventet inntekt." },
      { q: "Hva er feriepenger?", a: "Opptjenes med 10,2 % av bruttolønn (12 % med 5 uker ferie). Utbetales året etter — normalt i juni. Ansatte over 60 år får 2,5 % tillegg." },
      { q: "Hva er arbeidsgiveravgift?", a: "Arbeidsgiveravgiften er 14,1 % i sone 1 (Oslo/øst) og lavere i distriktene. Beregnes av all bruttolønn inkl. feriepenger og naturalytelser." },
      { q: "Hvordan beregnes overtid?", a: "Overtidstillegg er minst 40 % av ordinær timelønn. Kan avtales tatt ut som avspasering, men tillegget skal alltid utbetales som lønn." },
      { q: "Hva er minstelønn i Norge?", a: "Norge har ikke generell minstelønn, men allmenngjorte tariffavtaler gjelder i bransjer som bygg, renhold, hotell/restaurant, godstransport, elektro og fiskeindustri." },
      { q: "Hva er lønnsslipp?", a: "Skriftlig oversikt over lønnsutbetaling: bruttolønn, trekk, feriepenger, arbeidsgivers kostnader og netto utbetaling. Skal gis for hver lønnskjøring." },
      { q: "Hva er naturalytelse?", a: "Ikke-kontant fordel: firmabil, elektronisk kommunikasjon, forsikring, treningsmedlemsskap, gaver. Skattlegges normalt som lønn hos mottaker." },
      { q: "Hvordan beskattes firmabil?", a: "Sjablongmetoden: 30 % av bilens listepris opp til 351 700 kr + 20 % av overskytende. Blir del av skattepliktig lønn." },
      { q: "Er treningsmedlemskap skattepliktig?", a: "Ja, som hovedregel. Unntak gjelder trening i arbeidsgivers lokaler, eller ved dokumentert forebyggende helsetiltak for hele bedriften." },
      { q: "Kan bedriften dekke telefon skattefritt?", a: "Nei. Elektronisk kommunikasjon dekket av arbeidsgiver gir 4 392 kr/år skattepliktig fordel — uavhengig av faktisk kostnad (2026)." },
      { q: "Hva er reisegodtgjørelse?", a: "Skattefri kompensasjon etter statens satser: 3,50 kr/km privatbil, diett 400 kr/døgn (uten overnatting) osv. Beløp over satsene beskattes som lønn." },
      { q: "Hva er skattefri gave?", a: "Arbeidsgiver kan gi ansatte gaver skattefritt inntil 5 000 kr/år (2026), forutsatt at gaven ikke er kontanter eller gavekort som kan veksles inn." },
      { q: "Hva er OTP?", a: "Obligatorisk tjenestepensjon. Alle bedrifter med ansatte skal ha OTP med minst 2 % innskudd av lønn mellom 1 og 12 G." },
      { q: "Hva er lønnsopplysningsplikt?", a: "Arbeidsgivers plikt til å rapportere all lønn, godtgjørelse og fradrag korrekt i A-meldingen. Feil kan gi tilleggsavgift." },
      { q: "Kan jeg betale lønn kontant?", a: "Nei, som hovedregel skal lønn utbetales til bankkonto. Kontantlønn over 10 000 kr per måned gir tap av fradragsrett hos arbeidsgiver." },
      { q: "Hva er OTP-plikt for eier uten ansatte?", a: "AS uten andre ansatte har som hovedregel ikke OTP-plikt for eneste eier/daglig leder, men frivillig ordning anbefales." },
      { q: "Hva er trekkfri diett?", a: "Diettgodtgjørelse etter statens satser er skattefri: 400 kr (uten overnatting), 634 kr (hybel/brakke), 940 kr (hotell). Krever dokumentasjon på formål og reise." },
      { q: "Hva er sykepenger fra arbeidsgiver?", a: "Arbeidsgiver betaler sykepenger de første 16 kalenderdagene (arbeidsgiverperioden). Deretter overtar NAV. Krever egenmelding eller sykmelding." },
      { q: "Hva er permitteringslønn?", a: "Arbeidsgiver betaler lønn de første 15 arbeidsdagene ved permittering (2026). Deretter kan ansatt søke dagpenger fra NAV." },
      { q: "Hva er obligatorisk yrkesskadeforsikring?", a: "Alle arbeidsgivere med ansatte plikter å tegne yrkesskadeforsikring. Dekker skader og yrkessykdom. Manglende forsikring gir personlig ansvar." },
      { q: "Kan jeg gi rentefritt lån til ansatt?", a: "Ja, men rentefordel opp til normrentesats (5,25 % i 2026) beskattes som lønn hos ansatt. Lån under 3/5 G er unntatt hvis kort løpetid (<1 år)." },
      { q: "Hva er sluttvederlag?", a: "Kompensasjon ved oppsigelse — kan være skattefritt inntil 1,5 G ved oppsigelse fra arbeidsgivers side og alder over 50 år (særregler)." },
    ],
  },
  {
    title: "Arbeidsavtaler & Ansettelse",
    items: [
      { q: "Må jeg ha skriftlig arbeidsavtale?", a: "Ja. Arbeidsmiljøloven krever skriftlig avtale for alle arbeidsforhold. Ved varighet over 1 måned skal avtalen inngås senest 1 måned etter oppstart." },
      { q: "Hva skal en arbeidsavtale inneholde?", a: "Partenes identitet, arbeidssted, stillingstittel og arbeidsoppgaver, oppstartsdato, prøvetid, lønn og godtgjørelser, arbeidstid, ferie, oppsigelsesfrist og tariffavtale." },
      { q: "Hva er prøvetid?", a: "Prøveperiode med kortere oppsigelsesfrist (14 dager), maks 6 måneder. Må avtales skriftlig i arbeidsavtalen for å være gyldig." },
      { q: "Kan jeg ansette midlertidig?", a: "Ja, ved vikariat, prosjekter, sesongarbeid eller når arbeidet er av midlertidig karakter. Generell adgang til midlertidig ansettelse ble avskaffet i 2022." },
      { q: "Hvor lenge kan midlertidig ansettelse vare?", a: "Ved vikariat: så lenge behovet er reelt. Ved midlertidig karakter: opptil 3–4 år, deretter automatisk fast ansettelse (fireårsregelen)." },
      { q: "Hva er innleie fra bemanningsbyrå?", a: "Bruk av arbeidstakere fra bemanningsforetak. Strengt regulert siden 2023 — kun tillatt ved vikariat, mellom bedrifter i konsern eller etter tariffavtale." },
      { q: "Hva er fortrinnsrett?", a: "Rett for tidligere ansatte til å bli foretrukket ved nyansettelse i samme stilling innen 12 måneder. Gjelder ved nedbemanning og etter midlertidig ansettelse." },
      { q: "Hva er drøftingsplikt?", a: "Arbeidsgivers plikt til å drøfte visse beslutninger med tillitsvalgt eller ansatt — f.eks. før oppsigelse, ved omorganisering eller nedbemanning." },
      { q: "Kan arbeidsavtalen endres ensidig?", a: "Nei. Vesentlige endringer i arbeidsforhold (lønn, stilling, arbeidssted) krever enighet eller endringsoppsigelse med varsel." },
      { q: "Hva er styringsrett?", a: "Arbeidsgivers rett til å lede, fordele og kontrollere arbeidet innenfor rammen av arbeidsavtalen og loven. Kan ikke brukes til vesentlige endringer." },
      { q: "Hva er en tariffavtale?", a: "Kollektiv avtale mellom arbeidsgiver(-forening) og fagforening om lønn og arbeidsvilkår. Kan være direkte avtale eller allmenngjort etter loven." },
      { q: "Må jeg ha tariffavtale?", a: "Nei, tariffavtale er frivillig. Men i allmenngjorte bransjer (bygg, renhold, hotell m.fl.) gjelder minstelønn og vilkår uansett." },
      { q: "Kan jeg ha karantene i arbeidsavtalen?", a: "Ja, konkurranseklausul kan avtales men er sterkt begrenset: maks 1 år, må ha «særlig grunn», og arbeidsgiver må betale full lønnskompensasjon i perioden." },
      { q: "Hva er en kundeklausul?", a: "Avtale som forbyr ansatt å ta med seg kunder etter avslutning. Gjelder maks 1 år, må være skriftlig og begrunnet i særlig behov." },
      { q: "Hva er lærlingkontrakt?", a: "Avtale mellom lærling og lærebedrift om opplæring frem til fagbrev. Skal godkjennes av fylkeskommunen. Egen lønnstabell etter progresjon." },
      { q: "Hva er en frilanser?", a: "Person som utfører oppdrag uten å være ansatt eller selvstendig næringsdrivende — f.eks. artister, tolker. Beskattes som lønnstaker uten arbeidsgiveravgiftsplikt for oppdragsgiver." },
      { q: "Hva er forskjellen mellom oppdragsgiver og arbeidsgiver?", a: "Arbeidsgiver: ansettelsesforhold med styringsrett og trekk-/AGA-plikt. Oppdragsgiver: kjøper tjenester fra selvstendig næringsdrivende — som fakturerer med MVA." },
      { q: "Kan jeg ansette utenlandske arbeidere?", a: "EØS-borgere: fritt, men registreres i Folkeregisteret. Ikke-EØS: krever oppholdstillatelse med rett til arbeid. Arbeidsgiver må rapportere til Skatteetaten." },
      { q: "Hva er A1-attest?", a: "Bekreftelse fra opprinnelseslandet på at arbeidstaker er trygdedekket der ved utsending til Norge. Fritar for norsk trygdeavgift." },
      { q: "Hva må jeg gjøre ved nyansettelse?", a: "Skriftlig arbeidsavtale, meld arbeidsforhold i A-melding, sett opp OTP og yrkesskadeforsikring, registrer i lønnssystem og hent skattekort." },
    ],
  },
  {
    title: "Sykefravær & Permisjon",
    items: [
      { q: "Hva er arbeidsgiverperioden?", a: "De første 16 kalenderdagene av sykefravær der arbeidsgiver betaler sykepenger. Deretter overtar NAV frem til 52 uker." },
      { q: "Hva er egenmelding?", a: "Ansatt kan melde seg syk uten sykmelding i inntil 3 kalenderdager om gangen, maks 4 ganger på 12 måneder. IA-bedrifter: 8 dager, 24 ganger." },
      { q: "Hvor mye får ansatt i sykepenger?", a: "100 % av lønn opp til 6 G (711 720 kr i 2026). Lønn over 6 G dekkes ikke av NAV, men mange arbeidsgivere kompenserer full lønn." },
      { q: "Hvor lenge kan man være sykmeldt?", a: "Maks 52 uker i løpet av 3 år. Deretter kreves arbeidsavklaringspenger (AAP) fra NAV." },
      { q: "Hva er sykefraværsoppfølging?", a: "Arbeidsgivers lovpålagte plan for oppfølging: samtale innen 4 uker, oppfølgingsplan, dialogmøte 1 (7 uker) og 2 (26 uker) med NAV." },
      { q: "Hva er foreldrepenger?", a: "Stønad fra NAV ved fødsel og adopsjon: 49 uker med 100 % eller 59 uker med 80 % lønn. Krever opptjening (6 av 10 siste måneder)." },
      { q: "Hvordan fordeles foreldrepermisjonen?", a: "Mødrekvote: 15 uker (100 %) / 19 (80 %). Fedrekvote: samme. Fellesperiode: 16/18 uker. 3 uker før fødsel er forbeholdt mor." },
      { q: "Hva er svangerskapspermisjon?", a: "12 ukers permisjon før termin — 3 uker er forbeholdt mor. Foreldrepenger utbetales fra 3 uker før termin." },
      { q: "Hva er omsorgspermisjon?", a: "Far/medmor har rett til 2 uker permisjon rundt fødsel — normalt ulønnet, men mange arbeidsgivere gir lønn (avtale/tariff)." },
      { q: "Hva er sykt barn-dager?", a: "10 dager/år per forelder (15 fra 3 barn, 20 fra 4). Alenemor/-far: dobbelt. Gjelder til barnet fyller 12 år (18 år ved kronisk syke)." },
      { q: "Hva er velferdspermisjon?", a: "Kortvarig permisjon ved uforutsette hendelser (dødsfall, alvorlig sykdom hos nære, flytting). Vanligvis lønnet i inntil 1–2 dager, jf. tariff." },
      { q: "Hva er utdanningspermisjon?", a: "Etter 3 års ansettelse har ansatt rett til opptil 3 års ulønnet permisjon for utdanning som er yrkes-/næringsrelevant." },
      { q: "Kan sykefravær føre til oppsigelse?", a: "I de første 12 måneders sykdom er ansatt vernet mot oppsigelse begrunnet i sykdom. Etter det kan oppsigelse vurderes, men saklig grunn kreves." },
      { q: "Hva er tilrettelegging?", a: "Arbeidsgivers plikt til å tilpasse arbeidet ved redusert funksjonsevne — arbeidsoppgaver, tempo, utstyr, arbeidstid. Skal vurderes ved sykefravær." },
      { q: "Hva er IA-avtale?", a: "Inkluderende arbeidsliv — avtale mellom arbeidsgiver, ansatte og NAV. Gir utvidet rett til egenmelding og tettere NAV-oppfølging." },
    ],
  },
  {
    title: "Ferie & Feriepenger",
    items: [
      { q: "Hvor mange feriedager har jeg krav på?", a: "Ferieloven: 25 virkedager (4 uker + 1 dag). De fleste tariffavtaler gir 30 virkedager (5 uker). Regnes lørdag som virkedag." },
      { q: "Når kan jeg ta ferie?", a: "Hovedferie (3 uker) i perioden 1. juni – 30. september. Arbeidsgiver fastsetter tidspunkt, men skal drøfte med ansatt senest 2 måneder før." },
      { q: "Hva er feriepengegrunnlaget?", a: "Sum av all lønn og trekkpliktige ytelser opptjent året før ferieåret (opptjeningsåret). Feriepenger, sluttvederlag og enkelte ytelser telles ikke med." },
      { q: "Hvor mye er feriepenger?", a: "10,2 % (4 uker + 1 dag) eller 12 % (5 uker) av feriepengegrunnlaget. Ansatte over 60 år: +2,3/2,5 %." },
      { q: "Når utbetales feriepenger?", a: "Normalt siste vanlige lønning før ferien, ofte i juni. Ved fratreden: siste lønning. Kan avtales månedlig utbetaling." },
      { q: "Kan feriepenger utbetales i stedet for ferie?", a: "Nei. Ferien skal tas ut som fri. Unntak: opptil 2 uker kan overføres til neste ferieår etter skriftlig avtale." },
      { q: "Hva skjer med ubrukt ferie?", a: "Ubrukt ferie kan overføres til neste år etter avtale, ellers har ansatt krav på økonomisk kompensasjon dersom arbeidsgiver ikke sørget for at ferie ble tatt." },
      { q: "Kan jeg tvinge ansatt til å ta ferie?", a: "Ja, arbeidsgiver fastsetter feriedatoer. Ansatt har rett til 3 uker sammenhengende i hovedferieperioden og 1 uke sammenhengende ellers." },
      { q: "Kan ferie tas ut ved sykdom?", a: "Blir ansatt syk før ferien, kan hele ferien utsettes med legeerklæring. Ved sykdom under ferie: utsettes for de dagene som ikke ble avviklet, med legeerklæring." },
      { q: "Har jeg krav på ferie første året?", a: "Ja, men uten opptjente feriepenger (med mindre du hadde inntekt året før). Ansatt kan da søke om utsettelse eller motta 4 uker uten lønn." },
      { q: "Hva er ferieåret vs. opptjeningsåret?", a: "Opptjeningsåret: kalenderåret hvor feriepenger opptjenes. Ferieåret: året etter, hvor ferien avvikles og feriepenger utbetales." },
      { q: "Feriepenger ved oppsigelse?", a: "Alle opptjente feriepenger — også for inneværende års opptjening — utbetales på siste lønning. Skattlegges som ordinær lønn." },
      { q: "Feriepenger av sykepenger?", a: "Ja, arbeidsgivers sykepenger de første 16 dagene gir feriepengeopptjening. Sykepenger fra NAV: begrenset til første 48 dager per opptjeningsår." },
    ],
  },
  {
    title: "Pensjon & Forsikring",
    items: [
      { q: "Hva er OTP?", a: "Obligatorisk tjenestepensjon. Alle arbeidsgivere med minst én ansatt i minst 75 % stilling må ha en tjenestepensjonsordning. Minimum 2 % av lønn mellom 1 og 12 G." },
      { q: "Hva er innskuddspensjon?", a: "Vanligste OTP-form. Arbeidsgiver betaler inn en prosentandel av lønnen. Sluttbeløpet avhenger av innskudd og avkastning." },
      { q: "Hva er ytelsespensjon?", a: "Pensjonsordning som garanterer en bestemt utbetaling ved pensjonsalder (typisk 66 % av sluttlønn). Sjeldnere i dag pga. kostnad og risiko for arbeidsgiver." },
      { q: "Hva er AFP?", a: "Avtalefestet pensjon. Livslang tilleggspensjon for ansatte i tariffbundne bedrifter. Krever kvalifikasjon (7 av 9 år i tariffbedrift ved 62 år)." },
      { q: "Må jeg tegne yrkesskadeforsikring?", a: "Ja. Alle arbeidsgivere med ansatte plikter å tegne yrkesskadeforsikring. Uten forsikring: arbeidsgiver personlig ansvarlig for skader." },
      { q: "Hva dekker yrkesskadeforsikring?", a: "Skader og sykdom pådratt i arbeid: medisinsk behandling, tap av inntekt, varig mén, dødsfallserstatning. Utbetales av forsikringsselskap." },
      { q: "Er behandlingsforsikring skattepliktig?", a: "Ja, som hovedregel skattepliktig fordel med mindre den er en del av bedriftshelsetjeneste eller retter seg mot bestemte yrkesrelaterte lidelser." },
      { q: "Hva er sykelønnsforsikring?", a: "Frivillig forsikring som dekker arbeidsgivers kostnader ved langvarig sykefravær utover arbeidsgiverperioden — særlig relevant for lønn over 6 G." },
      { q: "Kan jeg spare i egen pensjon (IPS)?", a: "Ja, individuell pensjonssparing gir skattefradrag opp til 15 000 kr/år. Utbetales tidligst fra 62 år og beskattes som pensjon." },
      { q: "Hva er pensjonsopptjening?", a: "Fra 2010 tjener alle nordmenn pensjonspoeng basert på inntekt (opp til 7,1 G). Utbetales fra Folketrygden fra 62 år." },
      { q: "Hva er 1 G?", a: "Grunnbeløpet i folketrygden — 118 620 kr fra mai 2025. Justeres årlig 1. mai og brukes i beregning av trygdeytelser og pensjon." },
    ],
  },
  {
    title: "Oppsigelse & Avvikling av arbeidsforhold",
    items: [
      { q: "Hva er saklig grunn for oppsigelse?", a: "Oppsigelse fra arbeidsgiver må ha saklig grunn i virksomhetens, arbeidsgivers eller arbeidstakers forhold. Vurderingen omfatter forholdsmessighet og alternativer." },
      { q: "Hva er oppsigelsestid?", a: "Standard etter arbeidsmiljøloven: 1 mnd. Etter 5 år: 2 mnd. Etter 10 år: 3 mnd. Over 50 år og 10 år ansiennitet: 4–6 mnd. Prøvetid: 14 dager." },
      { q: "Hvordan sier jeg opp en ansatt?", a: "Skriftlig oppsigelse, drøftingsmøte i forkant, saklig grunn dokumentert. Oppsigelsen skal inneholde informasjon om rett til å kreve forhandling og reise søksmål." },
      { q: "Hva er avskjed?", a: "Umiddelbar avslutning uten oppsigelsestid — kun ved grovt mislighold (tyveri, vold, grov illojalitet). Strengt lovregulert og krever solid dokumentasjon." },
      { q: "Hva er suspensjon?", a: "Midlertidig fritakelse for arbeidsplikten (med lønn) mens saken utredes. Skal være begrunnet og tidsbegrenset, normalt inntil 3 måneder." },
      { q: "Har ansatt krav på attest?", a: "Ja. Alle ansatte har krav på skriftlig attest ved fratreden. Skal minst inneholde stilling, ansettelsesperiode og arbeidsområde." },
      { q: "Hva er sluttavtale?", a: "Avtale mellom arbeidsgiver og ansatt om avslutning — ofte mot fratredelsesvederlag. Anbefales å inngå med juridisk bistand." },
      { q: "Hva er nedbemanning?", a: "Oppsigelse pga. driftsinnskrenking. Krever: dokumentert behov, saklig utvelgelseskrets og -kriterier, drøfting med tillitsvalgte, individuell drøftingssamtale." },
      { q: "Hva er utvelgelseskriterier ved nedbemanning?", a: "Vanlig: ansiennitet, kompetanse, sosiale forhold. Ansiennitetsprinsippet står sterkt i tariffbedrifter (LO/NHO)." },
      { q: "Kan gravid sies opp?", a: "Nei, gravide er sterkt vernet. Oppsigelse i graviditet, foreldrepermisjon eller opp til 12 mnd etter fødsel må begrunnes med at grunnen ikke skyldes graviditeten/permisjonen." },
      { q: "Hva er permittering?", a: "Midlertidig fritak fra arbeidsplikten pga. mangel på arbeid. Krever saklig grunn og skriftlig varsel med minst 14 dagers varsel (2 dager ved uforutsett)." },
      { q: "Hvor lenge kan man permittere?", a: "Arbeidsgiverperiode: 15 dager (2026). Deretter kan permittering vare inntil 26 uker i løpet av 18 måneder uten lønnsplikt." },
      { q: "Kan ansatt si opp under prøvetid?", a: "Ja, med 14 dagers oppsigelsestid (eller kortere om avtalt). Arbeidsgiver kan si opp ved manglende tilpasning, faglig dyktighet eller pålitelighet." },
      { q: "Hva er stillingsvern?", a: "Ansattes rett til ikke å bli oppsagt uten saklig grunn. Grunnleggende prinsipp i arbeidsretten. Brudd gir rett til å stå i stilling og eventuelt erstatning." },
      { q: "Kan ansatt jobbe hos konkurrent etter oppsigelse?", a: "Ja, med mindre gyldig konkurranseklausul er inngått. Klausulen kan gjelde maks 1 år og krever full lønnskompensasjon." },
    ],
  },
  {
    title: "HMS & Arbeidsmiljø",
    items: [
      { q: "Hva er HMS?", a: "Helse, miljø og sikkerhet. Systematisk arbeid for å sikre trygge arbeidsforhold og forhindre skader. Regulert av arbeidsmiljøloven og internkontrollforskriften." },
      { q: "Hva er internkontroll?", a: "Systematiske tiltak for å oppfylle krav i HMS-lovgivning: kartlegging, tiltak, oppfølging og dokumentasjon. Alle norske virksomheter må ha et internkontrollsystem." },
      { q: "Må vi ha verneombud?", a: "Ja, alle bedrifter med minst 5 ansatte skal ha verneombud. Ved færre kan det avtales at ordningen ikke gjelder. Bedrifter over 50 ansatte: arbeidsmiljøutvalg." },
      { q: "Hva er en risikovurdering?", a: "Systematisk gjennomgang av arbeidsplassen for å identifisere farer og vurdere risiko. Lovpålagt og skal oppdateres jevnlig og ved endringer." },
      { q: "Hva er bedriftshelsetjeneste?", a: "Godkjent tjeneste som bistår arbeidsgiver med HMS. Obligatorisk i utvalgte bransjer (bygg, industri, helse, jordbruk m.fl.)." },
      { q: "Hva er en HMS-håndbok?", a: "Dokumentasjon av HMS-arbeidet: rutiner, ansvar, risikovurderinger og avvikssystem. Skal være tilgjengelig for alle ansatte." },
      { q: "Hva gjør jeg ved arbeidsulykke?", a: "Yt førstehjelp, sikre stedet, meld til NAV (skademelding) og Arbeidstilsynet ved alvorlige skader. Dokumenter og gjennomgå for forebygging." },
      { q: "Hva er varsling?", a: "Ansattes rett til å varsle om kritikkverdige forhold. Arbeidsmiljøloven verner mot gjengjeldelse. Bedrifter med >5 ansatte skal ha varslingsrutiner." },
      { q: "Hva er trakassering på jobb?", a: "Uønsket adferd som krenker verdighet og skaper et truende, fiendtlig eller nedverdigende arbeidsmiljø. Arbeidsgiver har handleplikt ved varsel." },
      { q: "Hvor mange timer kan jeg jobbe per uke?", a: "Alminnelig arbeidstid: 9 t/dag og 40 t/uke. Tariffavtaler har ofte 37,5 t/uke. Overtid: maks 200 t/år (avtalefestet unntak: 400 t)." },
      { q: "Har jeg krav på pause?", a: "Ja, minst 30 min pause hvis arbeidsdagen er over 5,5 t. Pauser regnes normalt ikke som arbeidstid med mindre du ikke fritt kan forlate arbeidsstedet." },
      { q: "Hva er nattarbeid?", a: "Arbeid mellom kl. 21 og 06. Kun tillatt når arbeidets art gjør det nødvendig. Egne krav til helsekontroll og maksimal arbeidstid." },
    ],
  },
  {
    title: "Årsregnskap & Rapportering",
    items: [
      { q: "Når skal årsregnskapet leveres?", a: "Innen 31. juli året etter regnskapsåret, til Regnskapsregisteret i Brønnøysund. Elektronisk levering via Altinn." },
      { q: "Hva består årsregnskapet av?", a: "Resultatregnskap, balanse, kontantstrømoppstilling (for større selskaper), noter og årsberetning (for større enn små)." },
      { q: "Hva er en «liten virksomhet»?", a: "Regnskapsloven: ikke over to av tre grenser — salgsinntekter 70 MNOK, balansesum 35 MNOK, gjennomsnittlig 50 årsverk. Da gjelder forenklede regler." },
      { q: "Trenger jeg årsberetning?", a: "Kun store og mellomstore selskaper. Små virksomheter er fritatt (fra 2018), men noten om fortsatt drift skal fortsatt fremgå i regnskapet." },
      { q: "Hva er noter i regnskapet?", a: "Tilleggsinformasjon som utdyper postene i resultat og balanse — regnskapsprinsipper, avskrivning, lån, egenkapitalbevegelse, lønn til ledelse m.m." },
      { q: "Hva er tvangsmulkt fra Brønnøysund?", a: "Sanksjon ved forsinket årsregnskap. 1 rettsgebyr/dag i 8 uker, deretter dobbelt. Etter 6 mnd forsinkelse: tvangsoppløsning av selskapet." },
      { q: "Hvem har innsyn i årsregnskapet?", a: "Alle. Årsregnskap er offentlig og tilgjengelig via proff.no, purehelp.no eller Brønnøysundregistrene." },
      { q: "Kan jeg endre et innlevert årsregnskap?", a: "Ja, ved feil kan omgjort årsregnskap leveres inntil neste årsregnskap. Ved vesentlige feil kreves generalforsamlingsvedtak." },
      { q: "Hva er A-melding-frist?", a: "Månedlig, senest 5. i måneden etter lønnskjøring. Skal inneholde all lønnsutbetaling, skattetrekk og arbeidsgiveravgift." },
      { q: "Hva er terminvis rapportering?", a: "MVA rapporteres normalt hver 2. måned (6 terminer/år). Frist: 1 måned og 10 dager etter terminslutt." },
      { q: "Hva er RF-1086?", a: "Aksjonærregisteroppgaven. Rapporterer eiere, aksjekapitalendringer og utbytte. Frist 31. januar. Grunnlag for skjermingsfradrag." },
      { q: "Hva er tredjepartsopplysninger?", a: "Innmelding av opplysninger til Skatteetaten om andre — f.eks. renter til bank, kjøp/salg av aksjer, utbetalinger til frilansere. Skjer i A-melding og separate skjemaer." },
      { q: "Hva er offentlig regnskap?", a: "Årsregnskap som er levert til Regnskapsregisteret og gjort tilgjengelig for allmennheten. Grunnlaget for kredittvurdering og analyse." },
    ],
  },
  {
    title: "CFO & Strategisk rådgivning",
    items: [
      { q: "Hva er CFO-as-a-Service?", a: "Strategisk finansiell ledelse fra senioreksperter — uten å ansette en CFO på heltid. Kapitalstruktur, investor-kommunikasjon, budsjett, scenarioanalyse og beslutningsstøtte." },
      { q: "Når trenger man en CFO?", a: "Ved investeringsrunder, exit, fusjon, kraftig vekst, styrerettet rapportering eller restrukturering. CFO-as-a-Service gir seniorkompetanse akkurat når det trengs." },
      { q: "Regnskapsfører vs. CFO — hva er forskjellen?", a: "Regnskapsfører håndterer løpende bokføring, rapportering og compliance. CFO jobber strategisk med kapital, styring og beslutninger på ledernivå." },
      { q: "Hva er budsjett og prognose?", a: "Budsjett: plan for inntekter og kostnader. Prognose: løpende oppdatering basert på faktiske tall og markedsutvikling. Grunnlag for styring." },
      { q: "Hva er KPI-rapportering?", a: "Målestokk for bedriftens ytelse: bruttomargin, kundeanskaffelseskostnad, churn, EBITDA. Skreddersydde dashboards gir sanntidsoversikt." },
      { q: "Hva er cashflow-styring?", a: "Sikring av tilstrekkelig likviditet: innbetalingskontroll, utbetalingsplanlegging, kredittidsstyring og prognoser." },
      { q: "Hva er due diligence?", a: "Grundig gjennomgang av selskapets finansielle, juridiske og operasjonelle forhold — typisk ved kjøp/salg/investering. Avdekker risiko og grunnlag for forhandling." },
      { q: "Hva er verdivurdering?", a: "Estimering av selskapets verdi ved salg, investering eller skatteformål. Metoder: DCF, multipler (P/E, EV/EBITDA), substansverdi." },
      { q: "Hva er styrerapportering?", a: "Månedlig/kvartalsvis rapport som gir styret grunnlag for beslutninger: økonomi, drift, KPI, risiko og status på strategiske initiativ." },
    ],
  },
  {
    title: "Valg av regnskapssystem",
    items: [
      { q: "Hvilket regnskapsprogram bør jeg velge?", a: "Avhenger av størrelse, bransje og behov. Vanlige valg: Tripletex, Fiken, Visma eAccounting, PowerOffice Go, Xledger. Avargo er systemuavhengig." },
      { q: "Hva er Tripletex?", a: "Norges mest brukte skybaserte system for SMB. Regnskap, fakturering, lønn, prosjekt og tid i én løsning. Sterk API-støtte." },
      { q: "Hva er Fiken?", a: "Enkelt regnskapssystem for ENK og små AS. Automatisk bokføring, bankintegrasjon og MVA-rapportering. Passer bedrifter med begrenset volum." },
      { q: "Hva er PowerOffice Go?", a: "Norskutviklet ERP med regnskap, fakturering, lønn, tid og prosjekt. Passer for voksende bedrifter med behov for full plattform." },
      { q: "Hva er Xledger?", a: "Skybasert ERP for mellomstore og større. Automatisert bokføring, konsolidering, budsjett og avansert rapportering på tvers av selskaper." },
      { q: "Hva er Visma eAccounting?", a: "Skybasert Visma-system for SMB. Fakturering, bilagsregistrering, bankintegrasjon og god integrasjon med Visma Lønn og Expense." },
      { q: "Kan jeg bytte regnskapssystem?", a: "Ja. Prosessen omfatter eksport, kontoplanmapping, import og kvalitetskontroll. Avargo migrerer sømløst mellom alle ledende systemer." },
      { q: "Hva bør jeg se etter i et regnskapssystem?", a: "Skybasert tilgang, bankintegrasjon, OCR, MVA-støtte, fakturering, lønn, API, brukervennlighet, pris og skalerbarhet." },
      { q: "Er skybasert regnskap trygt?", a: "Ja. Ledende systemer bruker bankgrad kryptering, MFA, automatisk backup og følger GDPR. Ofte sikrere enn lokale installasjoner." },
    ],
  },
  {
    title: "Integrasjoner & Automatisering",
    items: [
      { q: "Hva er bankintegrasjon?", a: "Direktekobling mellom regnskapssystem og bankkonto. Transaksjoner hentes automatisk og matches mot fakturaer — sanntidsoversikt uten manuell inntasting." },
      { q: "Hva er EHF-faktura?", a: "Elektronisk Handelsformat — Norges standard for e-faktura. Obligatorisk til offentlig sektor. Automatisk mottak og bokføring." },
      { q: "Hva er OCR-fakturaflyt?", a: "Optical Character Recognition leser fakturaer og kvitteringer og legger dem klar til bokføring — beløp, dato, leverandør og kontonummer identifiseres automatisk." },
      { q: "Kan regnskapet integreres med nettbutikk?", a: "Ja. Shopify, WooCommerce, Magento og andre kan synkronisere ordrer, betalinger og varelager direkte til regnskapet." },
      { q: "Hva er API-integrasjon?", a: "Teknisk grensesnitt som lar systemer utveksle data automatisk — CRM, faktureringsplattform, lønn, kassesystem og regnskap." },
      { q: "Kan jeg automatisere fakturering?", a: "Ja. Gjentakende fakturaer, abonnementer og fastprisavtaler kan settes opp med automatisk generering, sending og bokføring." },
      { q: "Hva er Peppol?", a: "Internasjonalt nettverk for e-fakturering. Standard for offentlig sektor i Norge og økende bruk mellom private virksomheter." },
      { q: "Kan Vipps/Stripe/Klarna kobles til regnskapet?", a: "Ja. Betalingsløsninger integreres slik at transaksjoner, gebyrer og valutaomregning bokføres automatisk." },
    ],
  },
  {
    title: "Fakturering & Inkasso",
    items: [
      { q: "Hva skal en gyldig faktura inneholde?", a: "Selgers navn/adresse/orgnr med MVA-tillegg, kjøpers navn/adresse, fakturanummer, dato, beskrivelse, beløp eks./inkl. MVA, MVA per sats, forfallsdato og kontonummer." },
      { q: "Hva er KID-nummer?", a: "Kunde-ID-nummer som identifiserer fakturaen ved betaling. Sikrer automatisk avstemming mellom innbetaling og faktura." },
      { q: "Når kan jeg sende purring?", a: "Tidligst 14 dager etter forfall. Purringen skal gi minst 14 dagers ny frist. Purregebyr maks 1/10 av inkassosalæret (85 kr i 2026)." },
      { q: "Når kan jeg sende inkassovarsel?", a: "Tidligst 14 dager etter forfall (eller etter purring med 14 dagers frist). Skal oppfylle inkassolovens krav og gi minst 14 dagers betalingsfrist." },
      { q: "Hva er en kreditnota?", a: "Dokument som korrigerer eller kansellerer en tidligere faktura — helt eller delvis. Skal referere til originalfaktura og bokføres som reduksjon av omsetning." },
      { q: "Hva er forsinkelsesrente?", a: "Rente ved forsinket betaling. Sats: 11,25 % (per 2026, fastsettes halvårlig). Kan kreves fra første dag etter forfall uten særskilt avtale." },
      { q: "Kan jeg fakturere før arbeidet er utført?", a: "Ja, som forskuddsfaktura. MVA må da bokføres på fakturadato. Tjenester som skjer over tid kan periodiseres i regnskapet." },
      { q: "Hva er eFaktura til privatpersoner?", a: "Elektronisk faktura direkte i kundens nettbank. Krever avtale med Mastercard Payment Services eller lignende leverandør." },
      { q: "Hva er avtalegiro?", a: "Fast trekkavtale mellom kunde og virksomhet — trekk skjer automatisk fra kundens konto på forfallsdato." },
      { q: "Kan jeg fakturere uten MVA?", a: "Ja, dersom du ikke er MVA-registrert (omsetning under 50 000 kr), eller ved fritatte tjenester (helse, undervisning, finans)." },
    ],
  },
  {
    title: "Oppstart & Gründer",
    items: [
      { q: "Hvordan starter jeg et AS?", a: "Utarbeid stiftelsesdokument, sett inn aksjekapital (min 30 000 kr) på bedriftskonto, registrer i Foretaksregisteret via Altinn. Avargo håndterer hele prosessen." },
      { q: "Hva koster det å starte et AS?", a: "Aksjekapital 30 000 kr (blir selskapets midler), registreringsgebyr ca. 5 570 kr, eventuelle honorar. Avargo tilbyr stiftelse til fast pris." },
      { q: "Bør jeg velge ENK eller AS?", a: "AS: ved forventet omsetning > 500 000 kr, ønske om ansvarsbegrensning, ansatte eller investorer. ENK: enkel drift, lav risiko, moderate inntekter." },
      { q: "Hva er personlig ansvar i ENK?", a: "Eier hefter personlig og ubegrenset for gjeld og forpliktelser. Ved konkurs kan private eiendeler tas beslag i." },
      { q: "Hva er ansvarsbegrensning i AS?", a: "Aksjonærer hefter kun med innskutt aksjekapital. Personlig formue er beskyttet — unntatt ved styrets uaktsomhet eller ulovlig utbytte." },
      { q: "Hva er Innovasjon Norge?", a: "Statlig aktør som tilbyr finansiering, tilskudd og rådgivning til bedrifter med vekstpotensial. Vurder oppstartslån, innovasjonstilskudd og mentorprogram." },
      { q: "Hva er forretningsplan?", a: "Beskrivelse av forretningsidé, marked, konkurrenter, strategi, organisasjon og økonomi. Nødvendig ved finansiering, verdifullt som styringsverktøy." },
      { q: "Trenger jeg bedriftskonto?", a: "Ja, obligatorisk for AS. For ENK: sterkt anbefalt for å skille privat og forretning, forenkler bokføring og skattekontroll." },
      { q: "Når må jeg MVA-registrere meg?", a: "Når avgiftspliktig omsetning overstiger 50 000 kr i løpet av 12 måneder. Kan også forhåndsregistreres ved store startinvesteringer." },
      { q: "Hva er stiftelsesutgifter?", a: "Kostnader ved opprettelse av selskapet: registrering, notarialbekreftelse, honorar, første regnskapsføring. Fradragsberettiget i selskapet." },
    ],
  },
  {
    title: "Selskapsform & Selskapsrett",
    items: [
      { q: "Hvilke selskapsformer finnes i Norge?", a: "AS, ASA, ENK, ANS, DA, SA, NUF, Stiftelse, IKS. Mest brukt: AS (60 %) og ENK (35 %)." },
      { q: "Hva er et AS?", a: "Aksjeselskap — egen juridisk person med begrenset ansvar. Min. 30 000 kr i aksjekapital. Passer for de fleste bedrifter." },
      { q: "Hva er et ASA?", a: "Allmennaksjeselskap — for børsnotering og selskaper med mange aksjonærer. Min. 1 MNOK i aksjekapital og strengere krav." },
      { q: "Hva er et ANS?", a: "Ansvarlig selskap — deltakerne hefter solidarisk og ubegrenset for gjelden. Krever minst to eiere. Skattlegges hos deltakerne." },
      { q: "Hva er et DA?", a: "Selskap med delt ansvar — hver deltaker hefter for sin andel av gjelden (f.eks. 50/50). Ellers likt ANS." },
      { q: "Hva er en generalforsamling?", a: "AS-eiernes øverste myndighet. Vedtar årsregnskap, velger styre, endrer vedtekter, beslutter utbytte. Ordinær holdes innen 6 mnd etter regnskapsårets slutt." },
      { q: "Hva er styrets ansvar?", a: "Overordnet forvaltning, tilsyn med daglig leder, budsjett, strategi. Personlig erstatningsansvar ved grov uaktsomhet." },
      { q: "Hvor mange styremedlemmer må et AS ha?", a: "Minst 1. Styret må ha minst 3 medlemmer hvis selskapet har mer enn 3 MNOK i aksjekapital." },
      { q: "Hva er en aksjonæravtale?", a: "Frivillig avtale mellom aksjonærer som regulerer eierskifte, forkjøpsrett, stemmegivning, utbytte og konfliktløsning. Sterkt anbefalt ved flere eiere." },
      { q: "Hva er kapitalforhøyelse?", a: "Økning av aksjekapital — via nytegning (nye aksjer) eller fondsemisjon (fra fri egenkapital). Krever generalforsamlingsvedtak." },
      { q: "Hva er emisjon?", a: "Utstedelse av nye aksjer — enten rettet (bestemte investorer) eller med fortrinnsrett (eksisterende eiere)." },
      { q: "Hva er utbytte?", a: "Utdeling fra AS til aksjonærer av opptjent egenkapital. Krever generalforsamlingsvedtak og at selskapet har fri egenkapital." },
      { q: "Hva er en fusjon?", a: "Sammenslåing av to eller flere selskaper. Kan gjennomføres skattefritt etter fusjonsreglene i aksje- og skatteloven." },
      { q: "Hva er en fisjon?", a: "Oppdeling av et selskap i to eller flere selskaper — kan være skattefritt etter fisjonsreglene." },
      { q: "Kan jeg ha holdingselskap over AS?", a: "Ja, holdingselskap-struktur gir skattefri overføring av utbytte mellom AS-ene og fleksibilitet for reinvestering. Vanlig ved lønnsomme selskaper." },
    ],
  },
  {
    title: "Finans & Investering",
    items: [
      { q: "Hva er EBITDA?", a: "Earnings Before Interest, Taxes, Depreciation and Amortization. Resultat før finansposter og av-/nedskrivninger. Sammenligner drift på tvers av selskaper." },
      { q: "Hva er EBIT?", a: "Earnings Before Interest and Tax — driftsresultatet før finansposter og skatt. Måler operativ inntjening." },
      { q: "Hva er kontantstrømanalyse (DCF)?", a: "Verdivurderingsmetode basert på nåverdien av forventet fremtidig kontantstrøm. Standard ved verdsettelse av selskaper." },
      { q: "Hva er likviditetsbudsjett?", a: "Prognose over inn- og utbetalinger over 12 måneder. Avdekker fremtidige likviditetsutfordringer." },
      { q: "Hva er soliditet?", a: "Egenkapital i forhold til totalkapital. Måler selskapets evne til å tåle tap. Kredittvurderes ofte som > 30 % = god." },
      { q: "Hva er kassakreditt?", a: "Bankkreditt som gir tilgang til likviditet ved behov. Renter betales kun av benyttet beløp. Fleksibel finansiering av arbeidskapital." },
      { q: "Hva er factoring?", a: "Salg av kundefordringer til finansieringsselskap. Gir umiddelbar likviditet, men reduserer margin. Kan være med eller uten regress." },
      { q: "Hva er leasing?", a: "Langsiktig leieavtale for driftsmidler. Operasjonell leasing: leiekostnad. Finansiell leasing: aktiveres i balansen." },
      { q: "Hva er konsolidert regnskap?", a: "Konsernregnskap som samler morselskap og datterselskaper som én økonomisk enhet. Interne transaksjoner elimineres." },
      { q: "Hva er goodwill?", a: "Merverdi ved oppkjøp utover netto identifiserbare eiendeler. Testes årlig for verdifall, avskrives ikke lineært etter IFRS." },
    ],
  },
  {
    title: "Avslutning & Avvikling",
    items: [
      { q: "Hvordan legger jeg ned et AS?", a: "Frivillig avvikling: generalforsamlingsvedtak, avviklingsstyre, kreditorvarsel (6 uker), sluttoppgjør og sletting. Tar 3–6 måneder." },
      { q: "Hva er avviklingsregnskap?", a: "Sluttregnskapet ved avvikling. Viser realisering av eiendeler, oppgjør av gjeld og fordeling til aksjonærer." },
      { q: "Hva er tvangsoppløsning?", a: "Sletting av selskap fra Foretaksregisteret ved brudd på lovkrav — f.eks. manglende årsregnskap i 6 mnd. Kan gjenopprettes ved retting." },
      { q: "Hva skjer ved konkurs?", a: "Bostyrer overtar forvaltningen, realiserer eiendeler og fordeler til kreditorer etter prioritet. Selskapet oppløses etter avslutning." },
      { q: "Hva er personlig konkurs?", a: "Konkurs for enkeltperson (typisk ENK-eier). Krever åpning ved tingretten. Etter avslutning gjenstår gjeld i inntil 3 år før gjeldsordning kan søkes." },
      { q: "Hva skjer med skatten ved salg av AS?", a: "Personlig aksjonær: 37,84 % effektiv gevinstskatt. Holdingselskap: tilnærmet skattefritt under fritaksmetoden." },
      { q: "Hva er generasjonsskifte?", a: "Overdragelse til neste generasjon gjennom gave, salg eller arv. Krever verdivurdering, aksjonæravtale og skatteplanlegging." },
      { q: "Kan jeg legge selskapet «i dvale»?", a: "Ja, selskapet kan være aktivt uten drift, men må fortsatt levere årsregnskap, skattemelding og A-melding (om aktuelt) — ellers risiko for tvangsoppløsning." },
    ],
  },
  {
    title: "Personvern & Compliance",
    items: [
      { q: "Hva er GDPR?", a: "EUs personvernforordning. Regulerer behandling av personopplysninger. Krever rettslig grunnlag, personvernerklæring, databehandleravtaler og rutiner for innsyn/sletting." },
      { q: "Hva er en databehandleravtale?", a: "Kontrakt mellom behandlingsansvarlig og databehandler som regulerer behandling av personopplysninger. Obligatorisk etter GDPR art. 28." },
      { q: "Hva er bokføringsloven?", a: "Norsk lov som stiller krav til bokføring, dokumentasjon og oppbevaring. Gjelder alle bokføringspliktige — 5 års oppbevaring som hovedregel." },
      { q: "Hva er hvitvaskingsloven?", a: "Krever rapporteringspliktige (bl.a. regnskapsførere) å gjennomføre kundekontroll (KYC), overvåke transaksjoner og rapportere mistenkelige forhold til Økokrim." },
      { q: "Hva er reell rettighetshaver?", a: "Fysisk person som eier eller kontrollerer selskapet — direkte eller indirekte. Skal identifiseres og registreres etter hvitvaskingsloven." },
      { q: "Hva er KYC?", a: "Know Your Customer. Kundeidentifikasjon som del av hvitvaskingsregelverket. Utføres ved oppstart og løpende gjennom kundeforholdet." },
      { q: "Kan personopplysninger lagres i skyen?", a: "Ja, forutsatt at leverandøren tilbyr tilstrekkelige garantier og databehandleravtale er inngått. Overføring utenfor EØS krever spesielle grunnlag." },
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
        <title>Vanlige spørsmål om regnskap og HR | Avargo</title>
        <meta name="description" content={`Over ${allFaqs.length} svar om regnskap, skatt, lønn, HR, MVA, arbeidsrett og selskapsrett. Alt du trenger å vite — samlet på ett sted.`} />
        <link rel="canonical" href="https://avargo.no/faq" />
        <meta property="og:title" content="Vanlige spørsmål om regnskap og HR | Avargo" />
        <meta property="og:description" content={`Over ${allFaqs.length} svar om regnskap, skatt, lønn, HR og selskapsrett — samlet på ett sted.`} />
        <meta property="og:url" content="https://avargo.no/faq" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Vanlige spørsmål om regnskap og HR | Avargo" />
        <meta name="twitter:description" content={`Over ${allFaqs.length} svar om regnskap, skatt, lønn, HR og selskapsrett — samlet på ett sted.`} />
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
              <span className="italic text-gradient-rose">regnskap og HR.</span>
            </h1>
            <p className="text-muted-foreground font-light text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-10">
              Over {allFaqs.length} svar på spørsmål om regnskap, skatt, lønn, HR, arbeidsrett, selskapsrett og rådgivning. Søk eller bla gjennom kategoriene nedenfor.
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
                            className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left group"
                          >
                            <h3 className="font-heading text-base md:text-lg text-foreground/90 group-hover:text-primary transition-colors">
                              {item.q}
                            </h3>
                            <ChevronDown
                              size={16}
                              className={`shrink-0 text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                            />
                          </button>
                          <div
                            className={`grid transition-all duration-500 ease-out ${
                              isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                            }`}
                          >
                            <div className="overflow-hidden">
                              <p className="px-5 md:px-6 pb-5 md:pb-6 text-muted-foreground text-sm md:text-base font-light leading-relaxed">
                                {item.a}
                              </p>
                            </div>
                          </div>
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
    </>
  );
};

export default FAQ;
