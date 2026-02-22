import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function slugify(text: string): string {
  return text.toLowerCase()
    .replace(/æ/g, "ae").replace(/ø/g, "o").replace(/å/g, "a")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// Comprehensive Norwegian chart of accounts with ORIGINAL descriptions
// These are standard account numbers but with unique Avargo-written descriptions
const ACCOUNTS = [
  // 63 - Lokalkostnader
  { n: "6300", name: "Husleie og lokalkostnader", group: "63 Lokalkostnader", types: ["AS","ENK"], desc: "Bruk denne kontoen når bedriften betaler leie for kontorer, butikklokaler, lagre eller andre næringsbygg. Dersom leien dekker flere måneder, bør du fordele kostnaden jevnt utover perioden den gjelder for.", ex: "Kontorleie, butikkleie, lagerleie, garasjeleie, parkeringsplass, fellesutgifter i næringsbygg" },
  { n: "6320", name: "Kommunale avgifter og renovasjon", group: "63 Lokalkostnader", types: ["AS","ENK"], desc: "Her bokfører du kommunale avgifter som vann, kloakk og avfallshåndtering. Er lokalene leid ut, inngår dette gjerne i husleien.", ex: "Vann- og avløpsgebyr, renovasjon, avfallshåndtering" },
  { n: "6340", name: "Strøm og oppvarming", group: "63 Lokalkostnader", types: ["AS","ENK"], desc: "Bokfør strømregninger for kontor og forretningslokaler her. Strøm til produksjonsformål hører hjemme under produksjonskostnader.", ex: "Strømregning for kontorlokaler, fjernvarme, gasskostnader til oppvarming" },
  { n: "6360", name: "Rengjøring og renhold", group: "63 Lokalkostnader", types: ["AS","ENK"], desc: "Kostnader knyttet til rengjøring av bedriftens lokaler, enten gjennom innkjøp av vaskemidler eller faktura fra eksterne rengjøringsbyråer.", ex: "Vasketjenester, rengjøringsmidler, gulvmatter, desinfeksjonsprodukter" },
  { n: "6390", name: "Øvrige lokalkostnader", group: "63 Lokalkostnader", types: ["AS","ENK"], desc: "Diverse utgifter til lokaler som ikke passer i de øvrige kontoene i gruppen. Typisk småanskaffelser og vedlikeholdsartikler.", ex: "Dekorasjon, lyspærer, fasadeskilt, alarmsystem, røykvarslere, snørydding" },

  // 65 - Verktøy og driftsmateriale
  { n: "6500", name: "Elektrisk og motordrevet verktøy", group: "65 Verktøy og driftsmateriale", types: ["AS","ENK"], desc: "Anskaffelse av motordrevet verktøy som ikke skal balanseføres. Verktøy med innkjøpspris over 30 000 kr og levetid over tre år skal i stedet aktiveres i balansen.", ex: "Drill, vinkelsliper, sirkelsag, kompressor, sveiseapparat, motorsag" },
  { n: "6510", name: "Manuelt håndverktøy", group: "65 Verktøy og driftsmateriale", types: ["AS","ENK"], desc: "Innkjøp av håndverktøy til daglig bruk. Dersom det totale beløpet overstiger aktiveringsgrensen, skal det balanseføres.", ex: "Hammer, skrutrekker, tang, målebånd, vater, sag, skiftenøkkel" },
  { n: "6540", name: "Arbeidstøy og verneutstyr", group: "65 Verktøy og driftsmateriale", types: ["AS","ENK"], desc: "Innkjøp av klær og verneutstyr som kreves for arbeidet. Vanlig klær som også kan brukes privat dekkes ikke.", ex: "Vernesko, hjelm, vernehansker, arbeidsbekledning med logo, refleksvester" },
  { n: "6551", name: "Driftsmateriale", group: "65 Verktøy og driftsmateriale", types: ["AS","ENK"], desc: "Forbruksmateriell som brukes opp i den daglige driften og som ikke inngår i varelager.", ex: "Skruer, spiker, lim, tape, slipepapir, borr, sagblad" },
  { n: "6560", name: "Rekvisita og småanskaffelser", group: "65 Verktøy og driftsmateriale", types: ["AS","ENK"], desc: "Mindre anskaffelser til drift som møbler, interiør og utstyr under aktiveringsgrensen.", ex: "Kontorstoler, hyller, skrivebord, kaffemaskin, tavle, whiteboard" },

  // 66 - Vedlikehold
  { n: "6600", name: "Vedlikehold av bygninger", group: "66 Vedlikehold", types: ["AS","ENK"], desc: "Reparasjoner som setter bygget tilbake i opprinnelig stand. Oppgraderinger og påkostninger skal aktiveres i balansen.", ex: "Maling, vindusskift, dørbytte, taklekkasje-reparasjon" },
  { n: "6620", name: "Vedlikehold av maskiner og utstyr", group: "66 Vedlikehold", types: ["AS","ENK"], desc: "Service, reparasjon og vedlikehold av bedriftens maskiner og teknisk utstyr.", ex: "Service på produksjonsmaskiner, utskifting av slitedeler" },

  // 67 - Fremmed tjeneste
  { n: "6700", name: "Regnskaps- og revisjonskostnader", group: "67 Rådgivningstjenester", types: ["AS","ENK"], desc: "Fakturaer for regnskapsføring og revisjon. Abonnement på regnskapsprogramvare bør vurderes ført på egen konto.", ex: "Regnskapshonorar, revisjonshonorar, rådgivning fra regnskapsfører" },
  { n: "6720", name: "Juridisk og økonomisk bistand", group: "67 Rådgivningstjenester", types: ["AS","ENK"], desc: "Kostnader til advokater, konsulenter og annen ekstern rådgivning innen jus og økonomi.", ex: "Advokathonorar, konsulentoppdrag, juridisk rådgivning" },
  { n: "6790", name: "Andre eksterne tjenester", group: "67 Rådgivningstjenester", types: ["AS","ENK"], desc: "Innleide tjenester som ikke faller under regnskap, revisjon eller juridisk bistand.", ex: "IT-konsulent, designtjenester, markedskonsulent, vikarbyråfaktura" },

  // 68 - Kontorkostnader
  { n: "6800", name: "Kontorrekvisita", group: "68 Kontorkostnader", types: ["AS","ENK"], desc: "Forbruksmateriell til kontordriften. Produksjonsrelatert materiell hører ikke hjemme her.", ex: "Penner, papir, permer, konvolutter, blekk til skriver, notatblokker" },
  { n: "6810", name: "IT-utstyr og datakostnader", group: "68 Kontorkostnader", types: ["AS","ENK"], desc: "Maskinvare under aktiveringsgrensen på 30 000 kr. Programvareavgifter bør bokføres separat.", ex: "Tastatur, mus, hodetelefoner, skjerm, minnepinne, kabler" },
  { n: "6820", name: "Trykkeriarbeid og trykksaker", group: "68 Kontorkostnader", types: ["AS","ENK"], desc: "Produksjon av trykt materiale for bedriften.", ex: "Brosjyrer, visittkort, kataloger, plakater, flyers" },
  { n: "6860", name: "Kurs- og seminarutgifter", group: "68 Kontorkostnader", types: ["AS","ENK"], desc: "Kostnader til faglig påfyll gjennom kurs, seminarer og konferanser, inkludert leie av lokaler til slike formål.", ex: "Kursavgift, konferansebillett, kursmateriale, servering på fagdag" },

  // 69 - Kommunikasjon
  { n: "6900", name: "Telefoni og internett", group: "69 Kommunikasjon", types: ["AS","ENK"], desc: "Alle kostnader til elektronisk kommunikasjon. Har ansatte fri telefon, må den skattepliktige fordelen innrapporteres via lønn.", ex: "Mobilabonnement, bredbånd, fiberavtale, fasttelefon" },
  { n: "6940", name: "Frankering og forsendelse", group: "69 Kommunikasjon", types: ["AS","ENK"], desc: "Portokostand for brev og pakker fra bedriften. Fraktkostnader for varesalg føres gjerne på egne fraktkontoer.", ex: "Frimerker, pakkeforsendelser, Posten, Bring" },

  // 70 - Transportmidler
  { n: "7000", name: "Drivstoff til firmakjøretøy", group: "70 Transportkostnader", types: ["AS","ENK"], desc: "Drivstoffutgifter for bedriftens egne kjøretøy. For personbiler med hvite skilter gis det ikke MVA-fradrag; for varebiler med grønne skilter gis fullt fradrag.", ex: "Bensin, diesel, strøm til elbillading" },
  { n: "7020", name: "Service og vedlikehold av kjøretøy", group: "70 Transportkostnader", types: ["AS","ENK"], desc: "Reparasjoner, service og løpende vedlikehold av bedriftens kjøretøy.", ex: "EU-kontroll, dekkskift, oljeskift, verkstedregning, spylervæske" },
  { n: "7040", name: "Forsikring og avgifter på kjøretøy", group: "70 Transportkostnader", types: ["AS","ENK"], desc: "Forsikringspremier og offentlige avgifter knyttet til bedriftens transportmidler.", ex: "Bilforsikring, trafikkforsikringsavgift" },

  // 71 - Reisekostnader
  { n: "7100", name: "Kilometergodtgjørelse", group: "71 Reise og diett", types: ["AS","ENK"], desc: "Godtgjørelse til ansatte for bruk av privat bil i tjeneste, etter statens satser. Beløpet er oppgavepliktig og innrapporteres via a-melding.", ex: "Kjøregodtgjørelse etter statens satser" },
  { n: "7140", name: "Reiseutgifter i tjeneste", group: "71 Reise og diett", types: ["AS","ENK"], desc: "Jobberelaterte reiseutgifter som refunderes de ansatte eller betales direkte av bedriften. Reise til fast arbeidssted regnes normalt som privat.", ex: "Flybilletter, togbilletter, bompenger, parkeringsavgift, fergebillett" },
  { n: "7160", name: "Mat og drikke på tjenestereise", group: "71 Reise og diett", types: ["AS","ENK"], desc: "Faktiske utgifter til mat og drikke under arbeidsreiser. Merk at MVA-fradrag ikke gis selv om bedriften er avgiftspliktig.", ex: "Lunsj på kundemøte, middag under reise" },

  // 73 - Markedsføring
  { n: "7320", name: "Annonsering og reklame", group: "73 Markedsføring", types: ["AS","ENK"], desc: "Alle former for betalt markedsføring og annonsering for bedriften.", ex: "Google Ads, Facebook-annonser, avisannonser, plakater, sponsing" },
  { n: "7350", name: "Representasjon og kundepleie", group: "73 Markedsføring", types: ["AS","ENK"], desc: "Utgifter til bevertning og gaver i forbindelse med forretningsrelasjoner. Skattemessig fradrag har begrensninger.", ex: "Kundemiddager, representasjonsgaver, firmaarrangementer for kunder" },

  // 74 - Kontingenter og gaver
  { n: "7400", name: "Kontingenter og medlemskap", group: "74 Kontingenter", types: ["AS","ENK"], desc: "Årlige medlemsavgifter og kontingenter til bransjeforeninger og næringsorganisasjoner.", ex: "NHO-kontingent, bransjeavgift, fagforeningskontingent" },
  { n: "7420", name: "Firmarelaterte gaver", group: "74 Kontingenter", types: ["AS","ENK"], desc: "Gaver med tilknytning til virksomheten, enten til ansatte eller forretningsforbindelser. Vær oppmerksom på skattemessige begrensninger.", ex: "Julegaver til ansatte, blomster til samarbeidspartner" },

  // 75 - Forsikring
  { n: "7500", name: "Forsikringspremier", group: "75 Forsikring", types: ["AS","ENK"], desc: "Forsikringer som dekker bedriftens eiendeler, ansvar og drift. Bilforsikring hører hjemme under transportkontoer.", ex: "Innboforsikring næring, ansvarsforsikring, driftsavbruddsforsikring" },

  // 76 - Lisenser og patenter
  { n: "7600", name: "Lisens- og royaltykostnader", group: "76 Lisenser og patenter", types: ["AS","ENK"], desc: "Løpende avgifter for bruksrett til immaterielle verdier som programvare, patenter eller varemerker.", ex: "Programvarelisens, patentavgift, royalty-betalinger" },

  // 77 - Andre driftskostnader
  { n: "7700", name: "Diverse driftskostnader", group: "77 Andre driftskostnader", types: ["AS","ENK"], desc: "Driftskostnader som ikke passer naturlig under noen annen kontogruppe.", ex: "Bankgebyrer, inkassogebyr, offentlige gebyrer, bøter" },
  { n: "7770", name: "Bankkostnader og finansgebyrer", group: "77 Andre driftskostnader", types: ["AS","ENK"], desc: "Gebyrer fra bank og betalingsformidlere for kontohold og transaksjoner.", ex: "Transaksjonsgebyr, terminalkostnad, kortterminalgebyr, nettbankavgift" },

  // Balanse-kontoer (utvalg)
  { n: "1920", name: "Bankinnskudd", group: "19 Bankinnskudd", types: ["AS","ENK"], desc: "Saldo på bedriftens bankkontoer.", ex: "Driftskonto, sparekonto for bedriften" },
  { n: "1500", name: "Kundefordringer", group: "15 Kortsiktige fordringer", types: ["AS","ENK"], desc: "Utestående beløp fra kunder som ennå ikke er betalt.", ex: "Fakturert arbeid som venter på oppgjør" },
  { n: "2400", name: "Leverandørgjeld", group: "24 Leverandørgjeld", types: ["AS","ENK"], desc: "Ubetalte fakturaer fra leverandører.", ex: "Innkjøpsfakturaer som forfaller til betaling" },
  { n: "2000", name: "Aksjekapital / egenkapital", group: "20 Egenkapital", types: ["AS"], desc: "Selskapets bunnkapital som ble skutt inn ved stiftelse eller senere kapitalforhøyelser.", ex: "Stiftelseskapital, kapitalforhøyelse" },
  { n: "2930", name: "Skyldig lønn", group: "29 Annen kortsiktig gjeld", types: ["AS","ENK"], desc: "Opptjent lønn til ansatte som ennå ikke er utbetalt.", ex: "Lønnsgjeld per månedsslutt" },
  { n: "2941", name: "Feriepengeavsetning", group: "29 Annen kortsiktig gjeld", types: ["AS","ENK"], desc: "Opptjente feriepenger som bedriften skylder de ansatte.", ex: "Feriepenger opptjent i inneværende år" },

  // Salgsinntekter
  { n: "3000", name: "Varesalg med høy MVA-sats", group: "30 Salgsinntekter", types: ["AS","ENK"], desc: "Inntekter fra salg av varer med standard MVA-sats (25 %).", ex: "Produktsalg, varesalg" },
  { n: "3100", name: "Tjenestesalg med høy MVA-sats", group: "31 Tjenesteinntekter", types: ["AS","ENK"], desc: "Inntekter fra salg av tjenester med standard MVA-sats.", ex: "Konsulenttimer, rådgivningstjenester" },

  // Lønnskostnader
  { n: "5000", name: "Lønn til ansatte", group: "50 Lønn", types: ["AS","ENK"], desc: "Brutto lønn inkludert alle faste og variable tillegg til de ansatte.", ex: "Fastlønn, timelønn, overtidstillegg" },
  { n: "5400", name: "Arbeidsgiveravgift", group: "54 Arbeidsgiveravgift", types: ["AS","ENK"], desc: "Lovpålagt avgift som arbeidsgiver betaler til folketrygden basert på lønnsutbetalinger.", ex: "AGA beregnet av brutto lønn" },
  { n: "5900", name: "Andre personalkostnader", group: "59 Andre personalkostnader", types: ["AS","ENK"], desc: "Diverse personalrelaterte kostnader som ikke hører hjemme under lønn eller avgifter.", ex: "Firmafest, sosiale tiltak, kantinekostnader" },

  // MVA-kontoer
  { n: "2701", name: "Utgående MVA, høy sats", group: "27 Merverdiavgift", types: ["AS","ENK"], desc: "MVA du har lagt til på fakturaer til kundene dine. Dette beløpet skylder du staten.", ex: "25 % MVA på utgående faktura" },
  { n: "2711", name: "Inngående MVA, høy sats", group: "27 Merverdiavgift", types: ["AS","ENK"], desc: "MVA du har betalt på innkjøpsfakturaer og som du kan kreve tilbake fra staten.", ex: "25 % MVA på leverandørfaktura" },

  // Avskrivninger
  { n: "6000", name: "Avskrivning på varige driftsmidler", group: "60 Avskrivninger", types: ["AS","ENK"], desc: "Årlig verdinedgang på eiendeler som maskiner, kjøretøy og inventar. Beregnes etter saldometoden eller lineært.", ex: "Avskrivning bil, avskrivning kontormøbler" },

  // Finansposter
  { n: "8000", name: "Renteinntekter", group: "80 Finansinntekter", types: ["AS","ENK"], desc: "Renter opptjent på bankinnskudd og andre plasseringer.", ex: "Bankrente, avkastning på innskuddskonto" },
  { n: "8100", name: "Rentekostnader", group: "81 Finanskostnader", types: ["AS","ENK"], desc: "Renter på lån, kassekreditt og andre gjeldsforhold.", ex: "Lånerente, kassekredittrente" },
  { n: "8300", name: "Betalbar skatt", group: "83 Skattekostnad", types: ["AS"], desc: "Beregnet skatt på årets overskudd for aksjeselskap.", ex: "Selskapsskatt, 22 % av skattbart resultat" },
];

// Glossary terms with ORIGINAL descriptions (not copied from sources)
const GLOSSARY = [
  { term: "A-melding", desc: "Månedlig innrapportering til Skatteetaten, NAV og SSB som dekker lønn, arbeidsgiveravgift og skattetrekk for alle ansatte. Sendes elektronisk via Altinn innen den 5. i påfølgende måned." },
  { term: "Aksjekapital", desc: "Den grunnleggende eierkapitalen i et aksjeselskap. Minimum beløp er 30 000 kroner ved stiftelse. Aksjekapitalen er bundet og kan kun endres gjennom formelle vedtak i generalforsamlingen." },
  { term: "Aksjeselskap", desc: "En selskapsform der eierne (aksjonærene) ikke hefter personlig for selskapets forpliktelser utover sin innskutte kapital. Forkortes AS og er den vanligste selskapsformen for næringsvirksomhet i Norge." },
  { term: "Aktiva", desc: "Samlebetegnelse for alle verdier og eiendeler en bedrift eier, som vises på venstre side av balansen. Inkluderer alt fra kontanter og kundefordringer til bygninger og maskiner." },
  { term: "Anleggsmidler", desc: "Eiendeler beregnet for varig bruk i virksomheten, med forventet levetid over ett år. Eksempler er bygninger, maskiner og kjøretøy. Disse avskrives over levetiden." },
  { term: "Arbeidsgiveravgift", desc: "En lovpålagt avgift som arbeidsgiver betaler til folketrygden, beregnet som en prosent av brutto lønnsutbetalinger. Satsen varierer etter hvor bedriften holder til, fra 0 % i Nord-Troms til 14,1 % i sentrale strøk." },
  { term: "Avskrivning", desc: "Fordeling av kostnaden for en varig eiendel over dens forventede levetid. Reduserer den bokførte verdien gradvis og reflekterer verdiforringelse gjennom bruk og slitasje." },
  { term: "Avstemming", desc: "Kontroll der du sammenligner to uavhengige datakilder for å sjekke at tallene stemmer overens. Typisk eksempel er å sjekke at banksaldoen i regnskapet matcher kontoutskriften fra banken." },
  { term: "Balanse", desc: "En oppstilling som viser bedriftens finansielle stilling på et gitt tidspunkt. Venstre side viser hva bedriften eier (eiendeler), høyre side viser hvordan det er finansiert (gjeld og egenkapital)." },
  { term: "Bankavstemming", desc: "Prosessen der du sammenligner regnskapets bankbeholdning med den faktiske saldoen i banken for å avdekke eventuelle avvik eller manglende posteringer." },
  { term: "Bilag", desc: "Dokumentasjon som bekrefter en økonomisk hendelse. Kan være en faktura, kvittering, kontrakt eller bankutskrift. Alle bilag må oppbevares i minst fem år etter regnskapsårets slutt." },
  { term: "Bokføring", desc: "Den systematiske registreringen av alle økonomiske hendelser i virksomheten. Hver transaksjon føres med debet- og kreditbeløp i henhold til norsk kontoplan og bokføringslovens krav." },
  { term: "Bokføringsloven", desc: "Lovverket som regulerer hvordan næringsdrivende skal føre sine regnskap, oppbevare bilag og dokumentere transaksjoner. Gjelder for alle som driver næringsvirksomhet i Norge." },
  { term: "Brutto", desc: "Et beløp før fradrag av skatt, avgifter eller andre kostnader. Bruttolønn er for eksempel den totale lønnen før skattetrekk, mens bruttofortjeneste er salgsinntekt minus varekostnad." },
  { term: "Budsjett", desc: "En tallplan som anslår forventede inntekter og utgifter for en fremtidig periode. Brukes som styringsverktøy for å planlegge og kontrollere bedriftens økonomi." },
  { term: "Cash flow", desc: "Strømmen av penger inn og ut av bedriften over en periode. Positiv kontantstrøm betyr at det kommer inn mer penger enn det går ut, noe som er avgjørende for bedriftens overlevelsesevne." },
  { term: "Debet", desc: "Venstre side i en bokføringspost. Økning av eiendeler og kostnader føres i debet, mens økning av gjeld, egenkapital og inntekter føres i kredit." },
  { term: "Debitor", desc: "En person eller virksomhet som skylder penger til bedriften din. Kundene dine er dine debitorer så lenge de har ubetalte fakturaer." },
  { term: "Dekningsbidrag", desc: "Differansen mellom salgsinntekt og variable kostnader. Viser hvor mye hvert solgte produkt eller tjeneste bidrar til å dekke faste kostnader og eventuelt overskudd." },
  { term: "Depositum", desc: "Et sikkerhetsbeløp som betales forskuddsvis, typisk ved inngåelse av en leieavtale. Depositumbeløpet skal normalt tilbakebetales ved avtalens opphør." },
  { term: "Driftsinntekter", desc: "Inntekter som stammer fra virksomhetens ordinære drift, som salg av varer og tjenester. Skiller seg fra finansinntekter og ekstraordinære poster." },
  { term: "Driftskostnader", desc: "Alle kostnader knyttet til den daglige driften av virksomheten, inkludert lønn, husleie, materialer og avskrivninger. Trekkes fra driftsinntektene for å beregne driftsresultatet." },
  { term: "Driftsresultat", desc: "Forskjellen mellom driftsinntekter og driftskostnader. Viser hvor lønnsom kjernevirksomheten er, uavhengig av finansiering og skatt." },
  { term: "Egenkapital", desc: "Differansen mellom bedriftens eiendeler og gjeld. Representerer eiernes verdier i selskapet og er et viktig mål på økonomisk soliditet." },
  { term: "Faktura", desc: "Et betalingskrav fra selger til kjøper som dokumenterer et salg av varer eller tjenester. Må inneholde bestemte opplysninger som organisasjonsnummer, beløp, MVA og forfallsdato." },
  { term: "Feriepenger", desc: "Lovpålagt kompensasjon som erstatter ordinær lønn under ferie. Beregnes normalt som 10,2 % av feriepengegrunnlaget, eller 12 % for ansatte over 60 år." },
  { term: "Finansregnskap", desc: "Den offisielle delen av regnskapet som utarbeides for eksterne brukere som skattemyndigheter, kreditorer og investorer. Følger lovbestemte regler og standarder." },
  { term: "Fordring", desc: "Et krav på penger som bedriften har mot en annen part. Kundefordringer og lånefordringer er typiske eksempler." },
  { term: "Forskuddsskatt", desc: "Skatt som selvstendig næringsdrivende og aksjeselskaper betaler i løpet av inntektsåret basert på forventet overskudd. Betales i fire terminer." },
  { term: "Fradrag", desc: "Kostnader og utgifter som kan trekkes fra inntektene ved beregning av skattepliktig resultat. Bidrar til å redusere den skatten bedriften eller personen må betale." },
  { term: "Generalforsamling", desc: "Aksjeselskapets øverste beslutningsorgan der aksjonærene møtes for å fatte vedtak om utbytte, godkjenne regnskap, velge styre og andre viktige saker." },
  { term: "Gjeld", desc: "Pengemessige forpliktelser bedriften har overfor andre. Deles inn i kortsiktig gjeld (forfaller innen ett år) og langsiktig gjeld (lengre løpetid)." },
  { term: "God regnskapsskikk", desc: "Et sett med anerkjente normer og prinsipper for hvordan regnskap skal føres og presenteres. Fungerer som rettesnor der lovteksten ikke gir detaljerte svar." },
  { term: "Goodwill", desc: "Merverdien som betales ved kjøp av en virksomhet utover den bokførte verdien av eiendelene. Representerer immaterielle verdier som omdømme, kunderelasjoner og markedsposisjon." },
  { term: "Grunnbeløp", desc: "Et referansebeløp fastsatt av Stortinget som brukes til å beregne ytelser fra folketrygden, pensjoner og forsikringer. Justeres årlig etter lønnsveksten." },
  { term: "Holdingselskap", desc: "Et selskap hvis hovedformål er å eie aksjer i andre selskaper. Gir fordeler gjennom fritaksmetoden, som gjør at utbytte og gevinst mellom selskaper i stor grad er skattefritt." },
  { term: "Hovedbok", desc: "Den sentrale regnskapsboken der alle transaksjoner samles per konto. Gir en komplett oversikt over alle bevegelser på hver enkelt regnskapskonto gjennom året." },
  { term: "Inngående faktura", desc: "En faktura bedriften mottar fra en leverandør for varer eller tjenester som er kjøpt inn. Er grunnlaget for bokføring av kostnader og eventuelt MVA-fradrag." },
  { term: "Inkasso", desc: "Prosessen med å drive inn utestående fordringer som ikke er betalt innen forfallsdato. Inkassoselskaper kan engasjeres for å kreve inn gjelden på vegne av kreditor." },
  { term: "Kapital", desc: "Samlebetegnelse for de økonomiske midlene som er tilgjengelig for en virksomhet, enten i form av egenkapital (eiernes midler) eller fremmedkapital (lånte midler)." },
  { term: "Kassekreditt", desc: "En kredittramme i banken som lar bedriften trekke mer enn saldoen på kontoen, opp til en avtalt grense. Renter betales kun av det beløpet som faktisk er trukket." },
  { term: "Kontering", desc: "Handlingen å bestemme hvilken regnskapskonto en transaksjon skal føres på. Riktig kontering er avgjørende for å få et korrekt og oversiktlig regnskap." },
  { term: "Kredit", desc: "Høyre side i en bokføringspost. Økning av gjeld, egenkapital og inntekter føres i kredit, mens reduksjon av eiendeler føres på denne siden." },
  { term: "Kreditnota", desc: "Et dokument som utstedes for å korrigere eller kansellere en tidligere utstedt faktura, helt eller delvis. Brukes ved feilaktig fakturering, returer eller prisendringer." },
  { term: "Kreditor", desc: "En person eller virksomhet som bedriften skylder penger til. Leverandørene dine er dine kreditorer så lenge du har ubetalte fakturaer hos dem." },
  { term: "Kundefordring", desc: "Penger som kunder skylder bedriften for varer eller tjenester som er levert men ikke ennå betalt for. Vises som en eiendel i balansen." },
  { term: "Leverandørgjeld", desc: "Ubetalte fakturaer fra leverandører for varer og tjenester bedriften har mottatt. Vises som kortsiktig gjeld i balansen." },
  { term: "Likviditet", desc: "Bedriftens evne til å betale sine løpende forpliktelser etter hvert som de forfaller. God likviditet betyr at det alltid er nok penger tilgjengelig til å dekke utgiftene." },
  { term: "Lønn", desc: "Kompensasjon en arbeidsgiver betaler til en ansatt for utført arbeid. Brutto lønn er beløpet før skattetrekk, mens nettolønn er det den ansatte faktisk får utbetalt." },
  { term: "MVA (Merverdiavgift)", desc: "En avgift som legges på de fleste varer og tjenester i Norge. Standardsatsen er 25 %, med reduserte satser på 15 % for mat og 12 % for transport og overnatting." },
  { term: "MVA-melding", desc: "Periodisk rapport til Skatteetaten som viser differansen mellom utgående MVA (fra salg) og inngående MVA (fra innkjøp). Sendes vanligvis annenhver måned." },
  { term: "Netto", desc: "Et beløp etter at alle fradrag, skatter og avgifter er trukket fra. Nettolønn er det du faktisk får utbetalt, nettofortjeneste er det som gjenstår etter alle kostnader." },
  { term: "Noter", desc: "Tilleggsopplysninger som utdyper og forklarer tallene i årsregnskapet. Notene gir leseren viktig kontekst som ikke fremgår direkte av resultatregnskap og balanse." },
  { term: "Omløpsmidler", desc: "Eiendeler som forventes å bli omsatt til kontanter innen ett år, som varelager, kundefordringer og bankinnskudd. Står i motsetning til anleggsmidler." },
  { term: "Periodisering", desc: "Prinsippet om å fordele inntekter og kostnader til den regnskapsperioden de faktisk tilhører, uavhengig av når betalingen skjer. Sikrer et riktig bilde av periodens resultat." },
  { term: "Resultatregnskap", desc: "En oppstilling som viser bedriftens inntekter, kostnader og resultat over en bestemt periode, typisk et regnskapsår. Forteller om virksomheten har gått med overskudd eller underskudd." },
  { term: "Revisor", desc: "En uavhengig fagperson som gjennomgår og bekrefter riktigheten av et selskaps regnskap. Aksjeselskaper over visse terskler har revisjonsplikt." },
  { term: "Saldoavskrivning", desc: "En avskrivningsmetode der en fast prosentsats trekkes fra restverdien hvert år. Gir høyere avskrivninger i starten og avtakende beløp over tid." },
  { term: "Skattepliktig inntekt", desc: "Nettoinntekten som danner grunnlaget for beregning av inntektsskatt. Beregnes ved å trekke alle fradragsberettigede kostnader fra brutto inntekt." },
  { term: "Utgående faktura", desc: "En faktura bedriften sender til sine kunder som krav om betaling for leverte varer eller tjenester. Danner grunnlaget for inntektsføring i regnskapet." },
  { term: "Utbytte", desc: "Utdeling av overskudd fra et aksjeselskap til aksjonærene. Besluttes av generalforsamlingen og beskattes som kapitalinntekt hos mottakeren." },
  { term: "Varekostnad", desc: "Kostnadene knyttet til de varene som faktisk er solgt i perioden. Beregnes typisk som varelager ved periodens start pluss innkjøp minus varelager ved periodens slutt." },
  { term: "Årsoppgjør", desc: "Prosessen med å avslutte regnskapsåret og utarbeide årsregnskap. Inkluderer avstemminger, periodiseringer, avskrivninger og skatteberegning." },
  { term: "Årsregnskap", desc: "Den samlede økonomiske rapporteringen for et regnskapsår, bestående av resultatregnskap, balanse og noter. Pliktig for alle regnskapspliktige virksomheter." },
  { term: "Enkeltpersonforetak", desc: "En selskapsform der én person eier og driver virksomheten med fullt personlig ansvar for gjeld og forpliktelser. Enkel å starte, men innebærer ubegrenset personlig risiko." },
  { term: "Foretaksregisteret", desc: "Et offentlig register under Brønnøysundregistrene der alle norske selskaper med registreringsplikt er oppført med grunnleggende opplysninger om virksomheten." },
  { term: "Fritaksmetoden", desc: "En skatteregel som gjør at aksjeselskaper i hovedsak er fritatt for skatt på utbytte og gevinst fra aksjer i andre selskaper. Viktig for konsernstrukturer og holdingselskaper." },
  { term: "Kontantstrøm", desc: "Oversikt over faktiske inn- og utbetalinger i bedriften over en periode. Skiller seg fra resultatregnskapet ved at den kun viser reell pengebevegelse, ikke periodiserte poster." },
  { term: "Regnskapsloven", desc: "Den norske loven som regulerer hvem som er regnskapspliktig, hvordan årsregnskapet skal utarbeides og hvilke opplysninger det skal inneholde." },
  { term: "Regnskapsår", desc: "Den tolvmånedersperioden som regnskapet dekker. Følger normalt kalenderåret fra 1. januar til 31. desember, men avvikende regnskapsår kan godkjennes." },
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { type } = await req.json().catch(() => ({ type: "all" }));

    let accountsInserted = 0;
    let glossaryInserted = 0;

    if (type === "all" || type === "accounts") {
      const rows = ACCOUNTS.map(a => ({
        account_number: a.n,
        name: a.name,
        slug: slugify(`${a.n}-${a.name}`),
        description: a.desc,
        examples: a.ex,
        category_group: a.group,
        business_types: a.types,
        mva_status: "med_mva",
        active: true,
      }));

      for (const row of rows) {
        const { error } = await supabase
          .from("account_entries")
          .upsert(row, { onConflict: "slug" });
        if (!error) accountsInserted++;
      }
    }

    if (type === "all" || type === "glossary") {
      const rows = GLOSSARY.map(g => ({
        term: g.term,
        slug: slugify(g.term),
        description: g.desc,
        active: true,
      }));

      for (const row of rows) {
        const { error } = await supabase
          .from("glossary_terms")
          .upsert(row, { onConflict: "slug" });
        if (!error) glossaryInserted++;
      }
    }

    return new Response(
      JSON.stringify({ success: true, accountsInserted, glossaryInserted }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
