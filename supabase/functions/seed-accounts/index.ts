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

const ACCOUNTS = [
  // 10 - Immaterielle eiendeler
  { n: "1000", name: "Forskning og utvikling", group: "10 Immaterielle eiendeler", types: ["AS","ENK"], desc: "Kostnader til utvikling av nye produkter eller tjenester som kan balanseføres når visse kriterier er oppfylt. Forskning kostnadsføres løpende.", ex: "Produktutvikling, prototyping, testfaser" },
  { n: "1020", name: "Konsesjoner og rettigheter", group: "10 Immaterielle eiendeler", types: ["AS","ENK"], desc: "Ervervede rettigheter som gir virksomheten enerett til å utøve en bestemt aktivitet eller bruke en bestemt ressurs.", ex: "Drosjeløyve, fiskekvote, utvinningsrett" },
  { n: "1030", name: "Patenter og lisensrettigheter", group: "10 Immaterielle eiendeler", types: ["AS","ENK"], desc: "Ervervede patenter og lisenser som gir eksklusiv bruksrett til en oppfinnelse eller teknologi.", ex: "Patent på oppfinnelse, produksjonslisens" },
  { n: "1080", name: "Goodwill", group: "10 Immaterielle eiendeler", types: ["AS"], desc: "Merverdi betalt ved oppkjøp av en virksomhet utover bokført verdi av identifiserbare eiendeler. Avskrives normalt over fem til ti år.", ex: "Oppkjøpspremie, virksomhetsoverdragelse" },

  // 12 - Bygninger og tomter
  { n: "1200", name: "Tomter og grunnarealer", group: "12 Bygninger og tomter", types: ["AS","ENK","Landbruk"], desc: "Grunn og arealer eid av virksomheten. Tomter avskrives ikke, med mindre det foreligger verdiforringelse.", ex: "Næringstomt, industritomt, jordbruksareal" },
  { n: "1210", name: "Bygninger og fast eiendom", group: "12 Bygninger og tomter", types: ["AS","ENK","Landbruk"], desc: "Næringsbygg som kontorlokaler, fabrikker og lager i bedriftens eie. Avskrives over forventet levetid.", ex: "Kontorbygg, lagerbygg, produksjonshall, driftsbygning" },
  { n: "1250", name: "Boliger og fritidseiendommer", group: "12 Bygninger og tomter", types: ["AS","ENK","Landbruk"], desc: "Eiendommer anskaffet for utleie eller som personalbolig. Avskrives etter saldometoden.", ex: "Utleiebolig, ansattbolig, hytte for ansatte" },

  // 13 - Maskiner og transportmidler
  { n: "1200", name: "Maskiner og produksjonsutstyr", group: "12 Maskiner", types: ["AS","ENK","Landbruk"], desc: "Større produksjonsutstyr og maskiner som brukes i kjernevirksomheten og som har en levetid på over tre år.", ex: "CNC-maskin, trykkpresse, bakemaskin, industrirobot" },
  { n: "1240", name: "Personbiler og kjøretøy", group: "12 Transportmidler", types: ["AS","ENK"], desc: "Kjøretøy eid av bedriften. Personbiler avskrives lineært eller etter saldometoden i saldogruppe d.", ex: "Firmabil, varebil, lastebil, elbil" },
  { n: "1250", name: "Landbruksmaskiner", group: "12 Maskiner", types: ["Landbruk"], desc: "Maskiner og utstyr som brukes spesifikt i landbruksdrift. Avskrives etter saldometoden.", ex: "Traktor, plog, såmaskin, fôrmaskin, slåmaskin" },

  // 14 - Inventar og utstyr
  { n: "1400", name: "Kontormøbler og inventar", group: "14 Inventar", types: ["AS","ENK"], desc: "Innredning og møbler til bedriftens lokaler med innkjøpspris over aktiveringsgrensen.", ex: "Kontorpult, kontorstol, resepsjonsmøbler, hyller" },
  { n: "1420", name: "Datautstyr og servere", group: "14 IT-utstyr", types: ["AS","ENK"], desc: "IT-maskinvare som datamaskiner, servere og nettverksutstyr med verdi over aktiveringsgrensen.", ex: "Server, PC-er, nettverksutstyr, skjermløsninger" },

  // 15 - Kortsiktige fordringer
  { n: "1500", name: "Kundefordringer", group: "15 Kortsiktige fordringer", types: ["AS","ENK","Landbruk"], desc: "Utestående krav mot kunder for varer eller tjenester som er levert men ikke betalt. Vises som en eiendel i balansen.", ex: "Ubetalt faktura, utestående kundesaldo" },
  { n: "1530", name: "Opptjent, ikke fakturert inntekt", group: "15 Kortsiktige fordringer", types: ["AS","ENK"], desc: "Inntekter som er opptjent men ennå ikke fakturert ved periodeslutt. Periodiseres for å gi et riktig bilde.", ex: "Påbegynt konsulentarbeid, pågående prosjekt" },
  { n: "1570", name: "Andre kortsiktige fordringer", group: "15 Kortsiktige fordringer", types: ["AS","ENK"], desc: "Diverse fordringer som ikke passer i andre kategorier, for eksempel forskuddsbetalinger og depositum.", ex: "Husleiedepositum, forskuddsbetalt forsikring" },
  { n: "1580", name: "Avsetning for tap på fordringer", group: "15 Kortsiktige fordringer", types: ["AS","ENK"], desc: "En estimert nedskrivning av kundefordringer der det er sannsynlig at betaling ikke vil komme. Reduserer verdien av utestående fordringer.", ex: "Tapsavsetning på tvilsomme kunder" },

  // 17 - Forskuddsbetalt
  { n: "1700", name: "Forskuddsbetalt leie", group: "17 Forskuddsbetalte kostnader", types: ["AS","ENK"], desc: "Husleie eller annen leie som er betalt på forskudd men gjelder fremtidige perioder.", ex: "Forhåndsbetalt kontorleie for neste kvartal" },
  { n: "1710", name: "Forskuddsbetalt forsikring", group: "17 Forskuddsbetalte kostnader", types: ["AS","ENK"], desc: "Forsikringspremier som dekker fremtidige perioder og må periodiseres.", ex: "Årlig forsikringspremie betalt i januar" },
  { n: "1750", name: "Påløpt inntekt", group: "17 Forskuddsbetalte kostnader", types: ["AS","ENK"], desc: "Inntekter som er opptjent i perioden men ennå ikke fakturert eller mottatt.", ex: "Opptjente renter på bankinnskudd" },

  // 19 - Bankinnskudd
  { n: "1900", name: "Kontanter og småkasse", group: "19 Bankinnskudd", types: ["AS","ENK"], desc: "Fysiske kontanter i bedriftens kasse. Bør telles og avstemmes regelmessig.", ex: "Vekslepenger, kontantsalg" },
  { n: "1920", name: "Bankinnskudd driftskonto", group: "19 Bankinnskudd", types: ["AS","ENK","Landbruk"], desc: "Saldo på bedriftens primære bankkonto som brukes til daglig drift.", ex: "Driftskonto, brukskonto" },
  { n: "1950", name: "Skattetrekkskonto", group: "19 Bankinnskudd", types: ["AS","ENK"], desc: "Egen bankkonto der forskuddstrekk til skatt for ansatte oppbevares frem til innbetaling til Skatteetaten.", ex: "Skattetrekk, forskuddstrekk" },

  // 20 - Egenkapital
  { n: "2000", name: "Aksjekapital", group: "20 Egenkapital", types: ["AS"], desc: "Den registrerte grunnkapitalen i aksjeselskapet. Minimum 30 000 kroner ved stiftelse.", ex: "Stiftelseskapital, kapitalforhøyelse" },
  { n: "2020", name: "Overkursfond", group: "20 Egenkapital", types: ["AS"], desc: "Beløp innbetalt utover pålydende verdi per aksje ved emisjoner.", ex: "Overkurs ved emisjon" },
  { n: "2050", name: "Annen egenkapital", group: "20 Egenkapital", types: ["AS","ENK"], desc: "Opptjent egenkapital som ikke er bundet, inkludert tilbakeholdt overskudd fra tidligere år.", ex: "Opptjent egenkapital, balansert resultat" },
  { n: "2080", name: "Udekket tap", group: "20 Egenkapital", types: ["AS","ENK"], desc: "Akkumulerte underskudd som overstiger annen egenkapital. Kan gi handleplikt for styret.", ex: "Akkumulert underskudd" },

  // 22 - Langsiktig gjeld
  { n: "2200", name: "Pantelån og langsiktige lån", group: "22 Langsiktig gjeld", types: ["AS","ENK","Landbruk"], desc: "Lån med pant i bedriftens eiendeler og løpetid over ett år. Deles inn i en kortsiktig del (neste års avdrag) og langsiktig del.", ex: "Banklån med pant i eiendom, billån" },
  { n: "2250", name: "Lån fra aksjonærer", group: "22 Langsiktig gjeld", types: ["AS"], desc: "Lån gitt fra eierne til selskapet. Må dokumenteres med låneavtale og markedsmessig rente for å unngå skattemessige konsekvenser.", ex: "Aksjonærlån, eierfinansiering" },
  { n: "2290", name: "Annen langsiktig gjeld", group: "22 Langsiktig gjeld", types: ["AS","ENK"], desc: "Langsiktige forpliktelser som ikke passer i andre underkategorier.", ex: "Leasing, finansiell leasing, ansvarlig lån" },

  // 24 - Leverandørgjeld
  { n: "2400", name: "Leverandørgjeld", group: "24 Leverandørgjeld", types: ["AS","ENK","Landbruk"], desc: "Ubetalte fakturaer fra leverandører for varer og tjenester bedriften har mottatt.", ex: "Varekjøp, tjenestefakturaer, innkjøpsfakturaer" },

  // 26 - Skattetrekk og offentlige avgifter
  { n: "2600", name: "Forskuddstrekk", group: "26 Skattetrekk", types: ["AS","ENK"], desc: "Skatt trukket fra ansattes lønn som oppbevares på skattetrekkskonto inntil innbetaling.", ex: "Lønnstrekk, skattetrekk" },
  { n: "2610", name: "Påleggstrekk og utleggstrekk", group: "26 Skattetrekk", types: ["AS","ENK"], desc: "Trekk i lønn pålagt av myndigheter for å dekke ansattes gjeld, som barnebidrag eller skatterestanser.", ex: "Utleggstrekk fra namsmannen, bidragstrekk" },
  { n: "2620", name: "Trygdeavgift opphørte ordninger", group: "26 Skattetrekk", types: ["AS","ENK"], desc: "Historisk konto for trygdeavgifter som ikke lenger er aktuelle.", ex: "Tidligere trygdeavgiftsposter" },
  { n: "2770", name: "Skyldig arbeidsgiveravgift", group: "27 Offentlige avgifter", types: ["AS","ENK"], desc: "Arbeidsgiveravgift som er beregnet men ikke ennå innbetalt til Skatteetaten.", ex: "AGA til termin" },
  { n: "2780", name: "Skyldig MVA ved terminoppgjør", group: "27 Offentlige avgifter", types: ["AS","ENK"], desc: "Netto merverdiavgift som skylder staten etter at inngående MVA er fratrukket utgående.", ex: "MVA-oppgjør, termin-MVA" },

  // 27 - MVA
  { n: "2700", name: "Utgående MVA, høy sats (25 %)", group: "27 Merverdiavgift", types: ["AS","ENK"], desc: "MVA bedriften har beregnet på sine salgsfakturaer med standardsats. Beløpet skylder du staten.", ex: "25 % MVA på utgående fakturaer" },
  { n: "2701", name: "Utgående MVA, middels sats (15 %)", group: "27 Merverdiavgift", types: ["AS","ENK"], desc: "MVA beregnet på salg av matvarer med redusert sats.", ex: "15 % MVA på matvaresalg" },
  { n: "2702", name: "Utgående MVA, lav sats (12 %)", group: "27 Merverdiavgift", types: ["AS","ENK"], desc: "MVA beregnet på tjenester med lav sats, som persontransport, overnatting og kulturarrangementer.", ex: "12 % MVA på hotellovernatting, kinobillett" },
  { n: "2710", name: "Inngående MVA, høy sats (25 %)", group: "27 Merverdiavgift", types: ["AS","ENK"], desc: "MVA betalt på innkjøpsfakturaer som kan kreves fradrag for i MVA-oppgjøret.", ex: "25 % MVA på leverandørfaktura" },
  { n: "2711", name: "Inngående MVA, middels sats (15 %)", group: "27 Merverdiavgift", types: ["AS","ENK"], desc: "MVA-fradrag på innkjøp av matvarer med redusert sats.", ex: "15 % MVA på matkjøp til kantine" },

  // 29 - Annen kortsiktig gjeld
  { n: "2900", name: "Forskudd fra kunder", group: "29 Annen kortsiktig gjeld", types: ["AS","ENK"], desc: "Innbetalinger mottatt fra kunder for varer eller tjenester som ennå ikke er levert. Inntektsføres først ved levering.", ex: "Depositum på bestilling, forhåndsbetaling" },
  { n: "2910", name: "Gjeld til ansatte og eiere", group: "29 Annen kortsiktig gjeld", types: ["AS","ENK"], desc: "Beløp som bedriften skylder ansatte eller eiere utover ordinær lønn.", ex: "Reiseforskudd, utleggsrefusjon" },
  { n: "2920", name: "Skyldig lønn", group: "29 Annen kortsiktig gjeld", types: ["AS","ENK"], desc: "Opptjent lønn til ansatte som ennå ikke er utbetalt på balansetidspunktet.", ex: "Lønnsgjeld ved månedsslutt" },
  { n: "2940", name: "Skyldige feriepenger", group: "29 Annen kortsiktig gjeld", types: ["AS","ENK"], desc: "Feriepenger opptjent av ansatte i inneværende år som skal utbetales neste år.", ex: "Feriepengeavsetning" },
  { n: "2960", name: "Påløpte kostnader", group: "29 Annen kortsiktig gjeld", types: ["AS","ENK"], desc: "Kostnader som er påløpt i perioden men ennå ikke fakturert eller betalt. Periodiseres for å gi korrekt resultat.", ex: "Påløpt strøm, påløpt revisjon, påløpte renter" },
  { n: "2990", name: "Annen kortsiktig gjeld", group: "29 Annen kortsiktig gjeld", types: ["AS","ENK"], desc: "Diverse kortsiktig gjeld som ikke passer i andre underkategorier.", ex: "Mellomværende, avsetninger" },

  // 30 - Salgsinntekter
  { n: "3000", name: "Varesalg innenlands, høy MVA", group: "30 Salgsinntekter", types: ["AS","ENK","Landbruk"], desc: "Inntekter fra salg av fysiske varer til norske kunder med standard MVA-sats på 25 prosent.", ex: "Butikksalg, nettbutikksalg, grossistsalg" },
  { n: "3010", name: "Varesalg innenlands, middels MVA", group: "30 Salgsinntekter", types: ["AS","ENK","Landbruk"], desc: "Inntekter fra salg av matvarer med redusert MVA-sats på 15 prosent.", ex: "Dagligvaresalg, salg av næringsmidler" },
  { n: "3020", name: "Varesalg innenlands, lav MVA", group: "30 Salgsinntekter", types: ["AS","ENK"], desc: "Inntekter fra salg med lav MVA-sats på 12 prosent.", ex: "Billettsalg, transporttjenester" },
  { n: "3060", name: "Uttak av varer", group: "30 Salgsinntekter", types: ["AS","ENK"], desc: "Verdi av varer som eier eller ansatte tar ut til privat bruk. Skal avgiftsberegnes og inntektsføres.", ex: "Eiers uttak av handelsvarer, ansattes gratisprodukt" },
  { n: "3080", name: "Rabatter og returvarer", group: "30 Salgsinntekter", types: ["AS","ENK"], desc: "Avslag på pris og verdien av varer som returneres av kunder. Bokføres som fradrag i salgsinntektene.", ex: "Kvantumsrabatt, kampanjerabatt, reklamasjon" },
  { n: "3100", name: "Tjenestesalg innenlands, høy MVA", group: "31 Tjenesteinntekter", types: ["AS","ENK"], desc: "Inntekter fra salg av tjenester til norske kunder med standard MVA-sats.", ex: "Konsulenttimer, rådgivning, reparasjonstjenester" },
  { n: "3200", name: "Eksportsalg av varer", group: "32 Eksportinntekter", types: ["AS","ENK"], desc: "Salg av varer til kunder utenfor Norge. Eksportsalg er fritatt for MVA (nullsats).", ex: "Varesalg til utlandet, grensehandel" },
  { n: "3250", name: "Eksportsalg av tjenester", group: "32 Eksportinntekter", types: ["AS","ENK"], desc: "Salg av tjenester til kunder i utlandet. Tjenestesalg ut av Norge er MVA-fritt.", ex: "Konsulentoppdrag i utlandet, fjernleverbare tjenester" },
  { n: "3400", name: "Offentlige tilskudd og refusjoner", group: "34 Offentlige tilskudd", types: ["AS","ENK","Landbruk"], desc: "Tilskudd, støtte og refusjoner mottatt fra offentlige myndigheter.", ex: "SkatteFUNN, Innovasjon Norge-tilskudd, produksjonstilskudd" },
  { n: "3600", name: "Leieinntekter", group: "36 Leieinntekter", types: ["AS","ENK","Landbruk"], desc: "Inntekter fra utleie av fast eiendom, maskiner eller annet utstyr eid av bedriften.", ex: "Utleie av lokaler, maskinleie" },
  { n: "3900", name: "Andre driftsinntekter", group: "39 Andre driftsinntekter", types: ["AS","ENK","Landbruk"], desc: "Inntekter som ikke stammer fra ordinært salg av varer eller tjenester.", ex: "Provisjonsinntekter, gevinst ved salg av driftsmidler, sponsorinntekter" },

  // 40-41 - Varekostnad
  { n: "4000", name: "Varekjøp for videresalg", group: "40 Varekostnad", types: ["AS","ENK","Landbruk"], desc: "Innkjøp av varer som bedriften skal selge videre til sine kunder.", ex: "Innkjøp av handelsvarer, grossistinnkjøp" },
  { n: "4100", name: "Råvarer og halvfabrikata", group: "41 Råvarer", types: ["AS","ENK","Landbruk"], desc: "Materialer som inngår i bedriftens egen produksjon av ferdigvarer.", ex: "Produksjonsråvarer, komponentinnkjøp, emballasje" },
  { n: "4200", name: "Innkjøp av underentreprenør", group: "42 Fremmedtjenester", types: ["AS","ENK"], desc: "Kostnader for arbeid utført av underentreprenører og underleverandører.", ex: "UE-kostnader, underleverandørarbeid, innleid arbeidskraft" },
  { n: "4300", name: "Innleid arbeidskraft", group: "43 Innleid arbeidskraft", types: ["AS","ENK"], desc: "Kostnader for arbeidskraft leid inn gjennom vikarbyråer eller bemanningsselskaper.", ex: "Vikarbyråfaktura, bemanningskostnad" },
  { n: "4500", name: "Frakt og transport ved varekjøp", group: "45 Fraktkostnader", types: ["AS","ENK","Landbruk"], desc: "Transportkostnader knyttet til innkjøp av varer, som frakt fra leverandør til bedriften.", ex: "Fraktkostnad på innkjøp, tollgebyr, spedisjonskostnad" },
  { n: "4900", name: "Endring i varelager", group: "49 Varelagerendring", types: ["AS","ENK","Landbruk"], desc: "Justering av varelagerets verdi mellom periodens begynnelse og slutt. Positiv endring reduserer kostnaden.", ex: "Varetelling, lageroppgjør" },

  // 50-59 - Lønnskostnader
  { n: "5000", name: "Fastlønn til ansatte", group: "50 Lønn", types: ["AS","ENK"], desc: "Brutto fastlønn til bedriftens ansatte, inkludert alle faste tillegg.", ex: "Månedslønn, fastlønn, uregelmessige tillegg" },
  { n: "5010", name: "Timelønn", group: "50 Lønn", types: ["AS","ENK"], desc: "Lønn basert på faktisk arbeidede timer, typisk for deltidsansatte eller timebaserte stillinger.", ex: "Timebasert lønn, ringevikar, ekstrahjelp" },
  { n: "5020", name: "Overtidsgodtgjørelse", group: "50 Lønn", types: ["AS","ENK"], desc: "Lønn for arbeid utover normal arbeidstid, med pålagt overtidstillegg.", ex: "Overtidsbetaling, helgetillegg, kveldstillegg" },
  { n: "5030", name: "Bonus og provisjon", group: "50 Lønn", types: ["AS","ENK"], desc: "Resultatbasert lønn, bonuser og provisjonsbetalinger til ansatte.", ex: "Salgsprovisjon, årsbonus, prestasjonsbonus" },
  { n: "5060", name: "Feriepengekostnad", group: "50 Lønn", types: ["AS","ENK"], desc: "Den periodiserte kostnaden for feriepenger opptjent av ansatte i regnskapsperioden.", ex: "Avsetning feriepenger, periodisering feriepengeforpliktelse" },
  { n: "5080", name: "Styrehonorar", group: "50 Lønn", types: ["AS"], desc: "Godtgjørelse utbetalt til styremedlemmer for deres arbeid. Behandles som lønn og er trekkpliktig.", ex: "Honorar til styreleder, styregodtgjørelse" },
  { n: "5090", name: "Annen oppgavepliktig godtgjørelse", group: "50 Lønn", types: ["AS","ENK"], desc: "Ytelser til ansatte som er innberetningspliktige men ikke ordinær lønn.", ex: "Fri telefon, elektronisk kommunikasjon, andre naturalytelser" },
  { n: "5200", name: "Fri bil", group: "52 Naturalytelser", types: ["AS","ENK"], desc: "Skattepliktig fordel for ansatte som disponerer firmabil til privat bruk. Beregnes etter faste regler.", ex: "Firmabilordning, privat bruk av firmabil" },
  { n: "5210", name: "Fri kost og losji", group: "52 Naturalytelser", types: ["AS","ENK","Landbruk"], desc: "Skattepliktig verdi av gratis mat og bolig som ytes til ansatte.", ex: "Kantinesubsidiering, personalbolig, kost på arbeidsplass" },
  { n: "5290", name: "Andre skattepliktige naturalytelser", group: "52 Naturalytelser", types: ["AS","ENK"], desc: "Øvrige fordeler til ansatte som må innrapporteres og beskattes.", ex: "Avis, treningsavtale, forsikring utover lovkrav" },
  { n: "5300", name: "Pensjonskostnad OTP", group: "53 Pensjonskostnad", types: ["AS","ENK"], desc: "Bedriftens innbetalinger til obligatorisk tjenestepensjon (OTP) for ansatte. Lovpålagt minstebeløp.", ex: "Pensjonspremie, OTP-innbetaling" },
  { n: "5320", name: "Pensjonskostnad utover OTP", group: "53 Pensjonskostnad", types: ["AS"], desc: "Frivillige pensjonsinnbetalinger utover lovpålagt minimum.", ex: "Tilleggspensjon, innskuddspensjon utover minstekrav" },
  { n: "5400", name: "Arbeidsgiveravgift av lønn", group: "54 Arbeidsgiveravgift", types: ["AS","ENK"], desc: "Lovpålagt avgift til folketrygden beregnet av brutto lønn og andre ytelser. Satsen avhenger av bedriftens geografiske sone.", ex: "AGA sone 1 (14,1 %), AGA sone 4 (5,1 %)" },
  { n: "5420", name: "Arbeidsgiveravgift av pensjon", group: "54 Arbeidsgiveravgift", types: ["AS","ENK"], desc: "Arbeidsgiveravgift beregnet av bedriftens pensjonsinnbetalinger.", ex: "AGA på OTP-premie" },
  { n: "5800", name: "Refusjon sykepenger", group: "58 Refusjoner", types: ["AS","ENK"], desc: "Tilbakebetaling fra NAV for sykepenger som bedriften har forskuttert i arbeidsgiverperioden.", ex: "Sykelønnsrefusjon, refusjon fra NAV" },
  { n: "5820", name: "Refusjon foreldrepenger", group: "58 Refusjoner", types: ["AS","ENK"], desc: "Tilbakebetaling fra NAV for foreldrepenger som bedriften har utbetalt.", ex: "Foreldrepengerefusjon" },
  { n: "5900", name: "Personalforsikringer", group: "59 Andre personalkostnader", types: ["AS","ENK"], desc: "Forsikringspremier som dekker ansatte, utover lovpålagte ordninger.", ex: "Yrkesskadeforsikring, gruppelivsforsikring, reiseforsikring" },
  { n: "5910", name: "Firmafest og sosiale tiltak", group: "59 Andre personalkostnader", types: ["AS","ENK"], desc: "Utgifter til sosiale arrangementer for ansatte. Det gis ikke MVA-fradrag.", ex: "Julebord, sommerfest, teambuilding, firmatur" },
  { n: "5920", name: "Annen personalkostnad", group: "59 Andre personalkostnader", types: ["AS","ENK"], desc: "Diverse personalrelaterte kostnader som ikke hører hjemme i andre kategorier.", ex: "Rekrutteringskostnad, stillingsannonse, bedriftshelsetjeneste" },

  // 60 - Avskrivninger
  { n: "6000", name: "Avskrivning på varige driftsmidler", group: "60 Avskrivninger", types: ["AS","ENK","Landbruk"], desc: "Årlig kostnadsføring av verdiforringelse på eiendeler som bygninger, maskiner og kjøretøy.", ex: "Saldoavskrivning bil, lineær avskrivning bygg" },
  { n: "6050", name: "Nedskrivning av anleggsmidler", group: "60 Avskrivninger", types: ["AS","ENK"], desc: "Ekstraordinær verdireduksjon når en eiendel har falt i verdi utover normal avskrivning.", ex: "Nedskrivning maskin, nedskrivning goodwill" },

  // 61 - Frakt og transport
  { n: "6100", name: "Frakt ved varesalg", group: "61 Frakt og transport", types: ["AS","ENK"], desc: "Fraktkostnader for å sende solgte varer til kunder.", ex: "Posten, Bring, transportør, kurertjeneste" },
  { n: "6110", name: "Toll og spedisjon", group: "61 Frakt og transport", types: ["AS","ENK"], desc: "Tollgebyr og spedisjonskostnader ved import og eksport av varer.", ex: "Importtoll, speditørfaktura, fortolling" },

  // 62 - Energi, brensel, vann
  { n: "6200", name: "Strøm og elektrisitet", group: "62 Energi", types: ["AS","ENK","Landbruk"], desc: "Strømkostnader til drift av næringslokaler og produksjon.", ex: "Strømfaktura, nettleie, kraftavtale" },
  { n: "6210", name: "Fyringsolje og gass", group: "62 Energi", types: ["AS","ENK","Landbruk"], desc: "Kostnader til oppvarming av lokaler med olje, gass eller andre brensel.", ex: "Fyringsolje, propan, pellets" },
  { n: "6220", name: "Vann og avløp", group: "62 Energi", types: ["AS","ENK","Landbruk"], desc: "Kommunale avgifter for vann og avløp til næringseiendommen.", ex: "Vanngebyr, avløpsgebyr" },

  // 63 - Lokalkostnader
  { n: "6300", name: "Husleie for næringslokaler", group: "63 Lokalkostnader", types: ["AS","ENK"], desc: "Leie for kontor, butikk, lager eller andre lokaler bedriften benytter.", ex: "Kontorleie, butikkleie, lagerleie" },
  { n: "6320", name: "Kommunale avgifter", group: "63 Lokalkostnader", types: ["AS","ENK"], desc: "Renovasjon, eiendomsskatt og øvrige kommunale kostnader knyttet til næringsbygg.", ex: "Renovasjonsgebyr, eiendomsskatt" },
  { n: "6340", name: "Energi til lokaler", group: "63 Lokalkostnader", types: ["AS","ENK"], desc: "Strøm og oppvarmingskostnader spesifikt knyttet til bedriftens lokaler.", ex: "Strøm kontor, fjernvarme, klimaanlegg" },
  { n: "6360", name: "Renhold av lokaler", group: "63 Lokalkostnader", types: ["AS","ENK"], desc: "Vaskekostnader for bedriftens lokaler, enten egne innkjøp eller faktura fra rengjøringsfirma.", ex: "Rengjøringstjeneste, vaskemidler" },
  { n: "6390", name: "Annen lokalkostnad", group: "63 Lokalkostnader", types: ["AS","ENK"], desc: "Diverse utgifter til lokaler som ikke dekkes av andre kontoer i gruppen.", ex: "Alarm, skilt, dekorasjon, snømåking" },

  // 64 - Leie av maskiner/inventar
  { n: "6400", name: "Leie av maskiner og utstyr", group: "64 Leie av maskiner", types: ["AS","ENK","Landbruk"], desc: "Operasjonell leie av maskiner og utstyr som ikke eies av bedriften.", ex: "Maskinleie, utstyrsleie, korttidsleasing" },
  { n: "6440", name: "Leie av datautstyr og programvare", group: "64 Leie av maskiner", types: ["AS","ENK"], desc: "Abonnement og leie for IT-utstyr, skytjenester og programvare.", ex: "SaaS-abonnement, skylagring, Microsoft 365, programvarelisens" },

  // 65 - Verktøy
  { n: "6500", name: "Elektroverktøy og motordrevne redskap", group: "65 Verktøy", types: ["AS","ENK","Landbruk"], desc: "Innkjøp av elektrisk og motordrevet verktøy under aktiveringsgrensen.", ex: "Drill, vinkelsliper, motorsag, kompressor" },
  { n: "6540", name: "Arbeidsklær og verneutstyr", group: "65 Verktøy", types: ["AS","ENK","Landbruk"], desc: "Påkrevd arbeidstøy og personlig verneutstyr til ansatte.", ex: "Vernesko, hjelm, vernehansker, refleksvest" },
  { n: "6560", name: "Småanskaffelser og rekvisita", group: "65 Verktøy", types: ["AS","ENK"], desc: "Mindre innkjøp til drift under aktiveringsgrensen.", ex: "Kaffemaskin, whiteboard, hyller, kontorstoler" },

  // 66 - Vedlikehold
  { n: "6600", name: "Vedlikehold av bygninger", group: "66 Vedlikehold", types: ["AS","ENK","Landbruk"], desc: "Reparasjoner som bringer bygget tilbake til opprinnelig stand uten å tilføre ny verdi.", ex: "Maling, vindusskift, rørleggerjobb" },
  { n: "6620", name: "Vedlikehold av maskiner", group: "66 Vedlikehold", types: ["AS","ENK","Landbruk"], desc: "Service og reparasjon av bedriftens maskiner og teknisk utstyr.", ex: "Maskinservice, slitedeler, smøring" },
  { n: "6640", name: "Vedlikehold av kontormaskiner", group: "66 Vedlikehold", types: ["AS","ENK"], desc: "Reparasjon og service av kontorteknisk utstyr som kopimaskiner og printere.", ex: "Skriverservice, tonerbytte" },

  // 67 - Rådgivningstjenester
  { n: "6700", name: "Regnskaps- og revisjonshonorar", group: "67 Rådgivning", types: ["AS","ENK"], desc: "Honorar til ekstern regnskapsfører og revisor for lovpålagte og avtalte tjenester.", ex: "Regnskapsføring, årsoppgjørshonorar, revisjonshonorar" },
  { n: "6720", name: "Juridisk bistand", group: "67 Rådgivning", types: ["AS","ENK"], desc: "Honorar til advokater og juridiske rådgivere for kontraktsarbeid, tvister og annen juridisk hjelp.", ex: "Advokathonorar, kontraktsgjennomgang" },
  { n: "6790", name: "Andre konsulenttjenester", group: "67 Rådgivning", types: ["AS","ENK"], desc: "Ekstern rådgivning og konsulenttjenester som faller utenfor regnskap, revisjon og jus.", ex: "IT-konsulent, markedsrådgiver, strategikonsulent" },

  // 68 - Kontorkostnader
  { n: "6800", name: "Kontorrekvisita", group: "68 Kontorkostnader", types: ["AS","ENK"], desc: "Forbruksmateriell til kontordriften.", ex: "Papir, penner, permer, blekk, toner" },
  { n: "6810", name: "Datakostnader under aktiveringsgrensen", group: "68 Kontorkostnader", types: ["AS","ENK"], desc: "IT-maskinvare med verdi under 30 000 kr som kostnadsføres direkte.", ex: "Tastatur, mus, skjerm, headset" },
  { n: "6820", name: "Trykksaker og kopieringskostnader", group: "68 Kontorkostnader", types: ["AS","ENK"], desc: "Produksjon av trykt materiale og kostnader til kopiering.", ex: "Visittkort, brosjyrer, kopiering" },
  { n: "6840", name: "Aviser, tidsskrifter og fagbøker", group: "68 Kontorkostnader", types: ["AS","ENK"], desc: "Abonnement og innkjøp av faglitteratur og nyhetsstoff.", ex: "Fagblad, bransjeavis, Norsk Lovtidend, e-bok" },
  { n: "6860", name: "Kurs og konferanser", group: "68 Kontorkostnader", types: ["AS","ENK"], desc: "Deltakeravgifter og kostnader for faglig oppdatering gjennom kurs og konferanser.", ex: "Kursavgift, konferansebillett, kursmateriale" },

  // 69 - Kommunikasjon
  { n: "6900", name: "Telefon og mobilabonnement", group: "69 Kommunikasjon", types: ["AS","ENK"], desc: "Alle kostnader til telefoni og mobilkommunikasjon for bedriften.", ex: "Mobilabonnement, fasttelefon, IP-telefoni" },
  { n: "6910", name: "Internett og bredbånd", group: "69 Kommunikasjon", types: ["AS","ENK"], desc: "Abonnement for internettilgang til bedriftens lokaler.", ex: "Fiberavtale, bredbånd, 5G-bedriftsabonnement" },
  { n: "6940", name: "Porto og forsendelser", group: "69 Kommunikasjon", types: ["AS","ENK"], desc: "Portokostnader for brev og pakker som sendes fra bedriften.", ex: "Frimerker, Bring-pakker, Posten" },

  // 70 - Transportkostnader
  { n: "7000", name: "Drivstoff firmakjøretøy", group: "70 Transport", types: ["AS","ENK","Landbruk"], desc: "Bensin, diesel eller strøm til bedriftens egne kjøretøy.", ex: "Bensin, diesel, elbillading" },
  { n: "7020", name: "Vedlikehold av kjøretøy", group: "70 Transport", types: ["AS","ENK","Landbruk"], desc: "Service, reparasjoner og dekkskift for bedriftens kjøretøy.", ex: "EU-kontroll, dekkskift, oljeskift, verkstedregning" },
  { n: "7040", name: "Forsikring kjøretøy", group: "70 Transport", types: ["AS","ENK","Landbruk"], desc: "Forsikringspremier og trafikkforsikringsavgift for bedriftens kjøretøy.", ex: "Bilforsikring, kasko, ansvarsforsikring bil" },
  { n: "7080", name: "Bompenger og parkering", group: "70 Transport", types: ["AS","ENK"], desc: "Bom- og parkeringsutgifter ved bruk av bedriftens kjøretøy i tjeneste.", ex: "AutoPASS, parkeringsautomat, bomavgift" },
  { n: "7090", name: "Leie av transportmidler", group: "70 Transport", types: ["AS","ENK"], desc: "Leasing og korttidsleie av kjøretøy som bedriften ikke eier.", ex: "Billeasing, korttidsbilleie, varebilleie" },

  // 71 - Reise og diett
  { n: "7100", name: "Bilgodtgjørelse etter statens satser", group: "71 Reise og diett", types: ["AS","ENK"], desc: "Kilometergodtgjørelse til ansatte som bruker egen bil i jobbsammenheng.", ex: "Kjøregodtgjørelse, km-godtgjørelse" },
  { n: "7130", name: "Reisekost og diett", group: "71 Reise og diett", types: ["AS","ENK"], desc: "Diettgodtgjørelse ved tjenestereiser over en viss varighet og avstand.", ex: "Diett etter statens satser, nattillegg" },
  { n: "7140", name: "Reisekostnader – transport", group: "71 Reise og diett", types: ["AS","ENK"], desc: "Faktiske reiseutgifter ved jobbreise, som fly, tog og ferge.", ex: "Flybillett, togbillett, fergereise, taxi" },
  { n: "7160", name: "Bevertning på tjenestereise", group: "71 Reise og diett", types: ["AS","ENK"], desc: "Mat og drikke under arbeidsreiser. MVA-fradrag gis ikke.", ex: "Lunsj under kundebesøk, middag på forretningsreise" },
  { n: "7170", name: "Hotellovernatting", group: "71 Reise og diett", types: ["AS","ENK"], desc: "Overnattingskostnader under tjenestereiser.", ex: "Hotellopphold, Airbnb i jobbsammenheng" },

  // 73 - Salgs- og markedsføringskostnader
  { n: "7300", name: "Salgskostnader", group: "73 Salg og markedsføring", types: ["AS","ENK"], desc: "Kostnader direkte knyttet til salgsarbeidet som ikke er lønn.", ex: "Salgsprøver, demonstrasjonsmateriale, messestand" },
  { n: "7320", name: "Annonsering og reklame", group: "73 Salg og markedsføring", types: ["AS","ENK"], desc: "Betalt markedsføring gjennom alle kanaler.", ex: "Google Ads, Meta-annonser, avisannonse, TV-reklame" },
  { n: "7330", name: "Nettside og digitale kanaler", group: "73 Salg og markedsføring", types: ["AS","ENK"], desc: "Kostnader knyttet til drift av bedriftens nettside og sosiale medier.", ex: "Webhotell, domene, SEO-tjenester, innholdsproduksjon" },
  { n: "7350", name: "Representasjon", group: "73 Salg og markedsføring", types: ["AS","ENK"], desc: "Bevertning og underholdning av kunder og forretningsforbindelser. Begrenset fradragsrett.", ex: "Kundemiddag, representasjonsgave" },

  // 74 - Kontingenter og gaver
  { n: "7400", name: "Kontingenter og medlemsavgifter", group: "74 Kontingenter", types: ["AS","ENK","Landbruk"], desc: "Årlig avgift til bransjeforeninger, arbeidsgiverorganisasjoner og faglige fellesskap.", ex: "NHO, Virke, fagforeningskontingent" },
  { n: "7420", name: "Gaver til forretningsforbindelser", group: "74 Kontingenter", types: ["AS","ENK"], desc: "Gaver i forretningssammenheng med begrenset skattemessig fradrag.", ex: "Julegaver til kunder, blomster" },
  { n: "7430", name: "Gaver til ansatte", group: "74 Kontingenter", types: ["AS","ENK"], desc: "Gaver til ansatte som kan være skattefrie innenfor visse grenser.", ex: "Jubileumsgave, julegave til ansatt, oppmerksomhet" },

  // 75 - Forsikring
  { n: "7500", name: "Næringsforsikring", group: "75 Forsikring", types: ["AS","ENK","Landbruk"], desc: "Forsikring for bedriftens eiendeler, ansvar og driftsavbrudd. Bilforsikring føres separat.", ex: "Innboforsikring, ansvarsforsikring, avbruddsforsikring" },
  { n: "7510", name: "Garantiforsikring og kausjonsforsikring", group: "75 Forsikring", types: ["AS","ENK"], desc: "Forsikring som sikrer oppfyllelse av kontrakter og garantier.", ex: "Garanti i entreprise, bankgaranti" },

  // 76 - Lisenser
  { n: "7600", name: "Lisenser og royalties", group: "76 Lisenser", types: ["AS","ENK"], desc: "Løpende avgifter for bruk av immaterielle rettigheter.", ex: "Programvarelisens, patentavgift, royalty" },

  // 77 - Andre driftskostnader
  { n: "7700", name: "Tap på fordringer", group: "77 Andre driftskostnader", types: ["AS","ENK"], desc: "Konstaterte tap på kundefordringer der betaling ikke kan forventes.", ex: "Konkurs hos kunde, uerholdelig fordring" },
  { n: "7710", name: "Innkomne betalinger på tidligere tap", group: "77 Andre driftskostnader", types: ["AS","ENK"], desc: "Betalinger mottatt for fordringer som tidligere er tapsført.", ex: "Uventet innbetaling, dividende fra konkursbo" },
  { n: "7750", name: "Bankgebyrer", group: "77 Andre driftskostnader", types: ["AS","ENK"], desc: "Gebyrer for kontohold, transaksjoner og betalingsformidling.", ex: "Kontoholdsgebyr, betalingsgebyr, kort-terminalleie" },
  { n: "7770", name: "Andre gebyrer og avgifter", group: "77 Andre driftskostnader", types: ["AS","ENK"], desc: "Offentlige gebyrer, lisensavgifter og diverse kostnader.", ex: "Brønnøysundgebyr, Norid-avgift, parkeringsbot" },
  { n: "7790", name: "Diverse driftskostnader", group: "77 Andre driftskostnader", types: ["AS","ENK"], desc: "Kostnader som ikke naturlig hører hjemme under noen annen kontogruppe.", ex: "Blomster til kontoret, kaffebønner, drikkevann" },

  // 80-89 - Finansposter
  { n: "8000", name: "Renteinntekter fra bankinnskudd", group: "80 Finansinntekter", types: ["AS","ENK","Landbruk"], desc: "Opptjente renter på bedriftens bankinnskudd.", ex: "Rente driftskonto, rente høyrentekonto" },
  { n: "8020", name: "Renteinntekter fra kunder", group: "80 Finansinntekter", types: ["AS","ENK"], desc: "Forsinkelsesrenter og morarenter fakturert til kunder ved for sen betaling.", ex: "Morarente, purregebyr-rente" },
  { n: "8050", name: "Andre finansinntekter", group: "80 Finansinntekter", types: ["AS","ENK"], desc: "Finansielle inntekter som ikke er renter, for eksempel valutagevinst.", ex: "Valutagevinst, gevinst verdipapir" },
  { n: "8060", name: "Utbytte fra aksjer og andeler", group: "80 Finansinntekter", types: ["AS"], desc: "Mottatt utbytte fra aksjer og eierandeler i andre selskaper.", ex: "Aksjeutbytte, utbytteinntekt" },
  { n: "8100", name: "Rentekostnader på banklån", group: "81 Finanskostnader", types: ["AS","ENK","Landbruk"], desc: "Renter betalt til banken på lån og kassekreditt.", ex: "Lånerente, kassekredittrente, avdragsrente" },
  { n: "8150", name: "Andre finanskostnader", group: "81 Finanskostnader", types: ["AS","ENK"], desc: "Finansielle kostnader utover vanlige renter.", ex: "Valutatap, disagio, tap på verdipapir" },
  { n: "8300", name: "Betalbar inntektsskatt", group: "83 Skattekostnad", types: ["AS"], desc: "Beregnet skatt på årets skattepliktige overskudd for aksjeselskap (22 %).", ex: "Selskapsskatt, inntektsskatt AS" },
  { n: "8320", name: "Endring utsatt skatt", group: "83 Skattekostnad", types: ["AS"], desc: "Endring i utsatt skatt eller utsatt skattefordel som følge av midlertidige forskjeller.", ex: "Periodisering av skatteforpliktelse" },
  { n: "8800", name: "Årsresultat", group: "88 Årsresultat", types: ["AS","ENK","Landbruk"], desc: "Det endelige resultatet etter alle inntekter, kostnader, finansposter og skatt er trukket fra.", ex: "Overskudd, underskudd, nettoresultat" },
  { n: "8900", name: "Overføringer og disponeringer", group: "89 Disponeringer", types: ["AS"], desc: "Besluttet disponering av årsresultatet, typisk avsatt utbytte eller overført til annen egenkapital.", ex: "Avsatt utbytte, overført til egenkapital" },

  // Landbruksspesifikke kontoer
  { n: "3010", name: "Salg av landbruksprodukter", group: "30 Landbruksinntekter", types: ["Landbruk"], desc: "Inntekter fra salg av egenproduserte jordbruksvarer.", ex: "Kornsalg, melkeleveranse, kjøttsalg" },
  { n: "3400", name: "Produksjonstilskudd jordbruk", group: "34 Tilskudd", types: ["Landbruk"], desc: "Offentlige tilskudd mottatt for jordbruksproduksjon.", ex: "Arealtilskudd, husdyrtilskudd, kulturlandskapstillegg" },
  { n: "3410", name: "Avløsertilskudd", group: "34 Tilskudd", types: ["Landbruk"], desc: "Tilskudd til dekning av kostnader ved bruk av avløser i jordbruket.", ex: "Avløserordning ferie og fritid" },
  { n: "4100", name: "Innkjøp av såvarer og frø", group: "41 Landbrukskostnader", types: ["Landbruk"], desc: "Kostnader til såkorn, frø og plantemateriale for jordbruksproduksjon.", ex: "Såkorn, settepoteter, grasfrø" },
  { n: "4120", name: "Gjødsel og plantevernmidler", group: "41 Landbrukskostnader", types: ["Landbruk"], desc: "Innkjøp av gjødsel, kalk og plantevernmidler til jordbruksdrift.", ex: "Kunstgjødsel, husdyrgjødsel, sprøytemiddel" },
  { n: "4130", name: "Kraftfôr og fôrmidler", group: "41 Landbrukskostnader", types: ["Landbruk"], desc: "Innkjøp av fôr til husdyr på gården.", ex: "Kraftfôr, mineralblanding, fôrtilskudd" },
  { n: "4140", name: "Veterinærkostnader", group: "41 Landbrukskostnader", types: ["Landbruk"], desc: "Kostnader til veterinærtjenester for gårdens husdyr.", ex: "Veterinærbesøk, medisinering, inseminering" },
];

const GLOSSARY = [
  // A
  { term: "A-melding", desc: "Månedlig innrapportering til Skatteetaten, NAV og SSB som dekker lønn, arbeidsgiveravgift og skattetrekk for alle ansatte. Sendes elektronisk via Altinn innen den 5. i påfølgende måned." },
  { term: "Aksjekapital", desc: "Den grunnleggende eierkapitalen i et aksjeselskap. Minimum beløp er 30 000 kroner ved stiftelse. Aksjekapitalen er bundet og kan kun endres gjennom formelle vedtak i generalforsamlingen." },
  { term: "Aksjeselskap (AS)", desc: "En selskapsform der eierne ikke hefter personlig for selskapets forpliktelser utover innskutt kapital. Den vanligste selskapsformen for næringsvirksomhet i Norge." },
  { term: "Aktiva", desc: "Samlebetegnelse for alle verdier og eiendeler en bedrift eier, som vises på venstre side av balansen. Inkluderer alt fra kontanter og kundefordringer til bygninger og maskiner." },
  { term: "Aktivering", desc: "Å balanseføre en kostnad som en eiendel i stedet for å kostnadsføre den direkte. Gjøres når anskaffelsen har en verdi over aktiveringsgrensen og levetid over tre år." },
  { term: "Aktiveringsgrense", desc: "Beløpsgrensen som avgjør om en anskaffelse skal balanseføres eller kostnadsføres direkte. I Norge er grensen 30 000 kroner eksklusiv MVA for saldoavskrivning." },
  { term: "Altinn", desc: "Norges digitale plattform for dialog mellom næringsliv og offentlige myndigheter. Brukes til å sende inn a-meldinger, skattemeldinger, MVA-meldinger og årsregnskap." },
  { term: "Anleggsmidler", desc: "Eiendeler beregnet for varig bruk i virksomheten, med forventet levetid over ett år. Eksempler er bygninger, maskiner og kjøretøy. Avskrives over levetiden." },
  { term: "Arbeidsgiveravgift (AGA)", desc: "En lovpålagt avgift arbeidsgiver betaler til folketrygden, beregnet som en prosent av brutto lønnsutbetalinger. Satsen varierer fra 0 % i Nord-Troms til 14,1 % i sentrale strøk." },
  { term: "Avanse", desc: "Forskjellen mellom innkjøpspris og salgspris på en vare. Uttrykkes ofte som en prosent av innkjøpsprisen og er et viktig nøkkeltall for handelsbedrifter." },
  { term: "Avskrivning", desc: "Fordeling av kostnaden for en varig eiendel over dens forventede levetid. Reduserer bokført verdi gradvis og reflekterer verdiforringelse gjennom bruk og slitasje." },
  { term: "Avstemming", desc: "Kontroll der du sammenligner to uavhengige datakilder for å sjekke at tallene stemmer. Typisk eksempel er å sjekke at banksaldoen i regnskapet matcher kontoutskriften." },

  // B
  { term: "Balanse", desc: "En oppstilling som viser bedriftens finansielle stilling på et gitt tidspunkt. Venstre side viser eiendeler, høyre side viser hvordan det er finansiert gjennom gjeld og egenkapital." },
  { term: "Balanseføring", desc: "Å registrere en verdi som en eiendel eller forpliktelse i balansen, i motsetning til å kostnadsføre den direkte i resultatregnskapet." },
  { term: "Bankavstemming", desc: "Prosessen der du sammenligner regnskapets bankbeholdning med den faktiske saldoen i banken for å avdekke avvik eller manglende posteringer." },
  { term: "Bilag", desc: "Dokumentasjon som bekrefter en økonomisk hendelse. Kan være en faktura, kvittering, kontrakt eller bankutskrift. Alle bilag må oppbevares i minst fem år." },
  { term: "Bokføring", desc: "Den systematiske registreringen av alle økonomiske hendelser i virksomheten. Hver transaksjon føres med debet- og kreditbeløp i henhold til norsk kontoplan." },
  { term: "Bokføringsloven", desc: "Lovverket som regulerer hvordan næringsdrivende skal føre regnskap, oppbevare bilag og dokumentere transaksjoner. Gjelder for alle som driver næringsvirksomhet i Norge." },
  { term: "Brutto", desc: "Et beløp før fradrag av skatt, avgifter eller andre kostnader. Bruttolønn er lønnen før skattetrekk, bruttofortjeneste er salgsinntekt minus varekostnad." },
  { term: "Budsjett", desc: "En tallplan som anslår forventede inntekter og utgifter for en fremtidig periode. Brukes som styringsverktøy for å planlegge og kontrollere bedriftens økonomi." },

  // C-D
  { term: "Cash flow", desc: "Strømmen av penger inn og ut av bedriften over en periode. Positiv kontantstrøm betyr at det kommer inn mer penger enn det går ut." },
  { term: "Dagbok", desc: "En kronologisk oversikt over alle regnskapstransaksjoner i den rekkefølgen de oppstår. Utgjør grunnlaget for videre bokføring i hovedboken." },
  { term: "Debet", desc: "Venstre side i en bokføringspost. Økning av eiendeler og kostnader føres i debet, mens økning av gjeld, egenkapital og inntekter føres i kredit." },
  { term: "Debitor", desc: "En person eller virksomhet som skylder bedriften penger. Kundene dine er debitorer så lenge de har ubetalte fakturaer." },
  { term: "Dekningsbidrag", desc: "Differansen mellom salgsinntekt og variable kostnader. Viser hvor mye hvert solgt produkt bidrar til å dekke faste kostnader og eventuelt overskudd." },
  { term: "Delingsmodellen", desc: "Skatteregler for enkeltpersonforetak som skiller mellom arbeidsinntekt og kapitalinntekt for å sikre at begge beskattes korrekt." },
  { term: "Depositum", desc: "Et sikkerhetsbeløp som betales forskuddsvis, typisk ved inngåelse av en leieavtale. Skal tilbakebetales ved avtalens opphør." },
  { term: "Driftsinntekter", desc: "Inntekter fra virksomhetens kjerneaktiviteter, som salg av varer og tjenester. Skiller seg fra finansinntekter og ekstraordinære poster." },
  { term: "Driftskostnader", desc: "Alle kostnader knyttet til den daglige driften, inkludert lønn, husleie, materialer og avskrivninger." },
  { term: "Driftsresultat", desc: "Forskjellen mellom driftsinntekter og driftskostnader. Viser kjernevirksomhetens lønnsomhet uavhengig av finansiering og skatt." },

  // E
  { term: "Egenkapital", desc: "Differansen mellom bedriftens eiendeler og gjeld. Representerer eiernes verdier i selskapet og er et viktig mål på økonomisk soliditet." },
  { term: "Emisjon", desc: "Utstedelse av nye aksjer i et aksjeselskap for å hente inn mer kapital. Kan rettes mot eksisterende aksjonærer eller nye investorer." },
  { term: "Enkeltpersonforetak (ENK)", desc: "En selskapsform der én person eier og driver virksomheten med fullt personlig ansvar for gjeld og forpliktelser. Enkel å starte, men innebærer ubegrenset risiko." },

  // F
  { term: "Faktura", desc: "Et betalingskrav fra selger til kjøper som dokumenterer et salg. Må inneholde opplysninger som organisasjonsnummer, beløp, MVA og forfallsdato." },
  { term: "Feriepenger", desc: "Lovpålagt kompensasjon som erstatter lønn under ferie. Beregnes normalt som 10,2 % av feriepengegrunnlaget, eller 12 % for ansatte over 60 år." },
  { term: "Finansregnskap", desc: "Den offisielle delen av regnskapet som utarbeides for eksterne brukere som skattemyndigheter, kreditorer og investorer." },
  { term: "Fordring", desc: "Et krav på penger som bedriften har mot en annen part. Kundefordringer og lånefordringer er typiske eksempler." },
  { term: "Foretaksregisteret", desc: "Et offentlig register under Brønnøysundregistrene der norske selskaper med registreringsplikt er oppført med grunnleggende opplysninger." },
  { term: "Forskuddsskatt", desc: "Skatt som selvstendige næringsdrivende og aksjeselskaper betaler i løpet av inntektsåret basert på forventet overskudd. Betales i fire terminer." },
  { term: "Fradrag", desc: "Kostnader som kan trekkes fra inntektene ved beregning av skattepliktig resultat. Bidrar til å redusere skattebelastningen." },
  { term: "Fritaksmetoden", desc: "En skatteregel som fritar aksjeselskaper for skatt på utbytte og gevinst fra aksjer i andre selskaper. Viktig for konsernstrukturer og holdingselskaper." },

  // G
  { term: "Generalforsamling", desc: "Aksjeselskapets øverste beslutningsorgan der aksjonærene møtes for å fatte vedtak om utbytte, godkjenne regnskap og velge styre." },
  { term: "Gjeld", desc: "Pengemessige forpliktelser bedriften har overfor andre. Deles i kortsiktig gjeld (forfaller innen ett år) og langsiktig gjeld." },
  { term: "God regnskapsskikk (GRS)", desc: "Anerkjente normer og prinsipper for regnskapsføring og rapportering. Fungerer som rettesnor der lovteksten ikke gir detaljerte svar." },
  { term: "Goodwill", desc: "Merverdi betalt ved oppkjøp av en virksomhet utover bokført verdi. Representerer omdømme, kunderelasjoner og markedsposisjon." },
  { term: "Grunnbeløpet (G)", desc: "Et referansebeløp fastsatt av Stortinget som brukes til å beregne ytelser fra folketrygden, pensjoner og forsikringer. Justeres årlig." },

  // H
  { term: "Handleplikt", desc: "Styrets lovpålagte plikt til å handle når egenkapitalen i et aksjeselskap er blitt uforsvarlig lav eller under halvparten av aksjekapitalen." },
  { term: "Holdingselskap", desc: "Et selskap hvis hovedformål er å eie aksjer i andre selskaper. Gir fordeler gjennom fritaksmetoden for utbytte mellom selskaper." },
  { term: "Hovedbok", desc: "Den sentrale regnskapsboken der alle transaksjoner samles per konto. Gir komplett oversikt over alle bevegelser på hver regnskapskonto." },

  // I
  { term: "IFRS", desc: "International Financial Reporting Standards – internasjonale regnskapsstandarder som børsnoterte selskaper i Norge er pålagt å følge." },
  { term: "Inngående faktura", desc: "En faktura bedriften mottar fra en leverandør. Grunnlaget for bokføring av kostnader og eventuelt MVA-fradrag." },
  { term: "Inkasso", desc: "Prosessen med å drive inn utestående fordringer som ikke er betalt innen forfallsdato. Kan utføres internt eller via inkassoselskaper." },
  { term: "Internregnskap", desc: "Regnskapsinformasjon beregnet for intern bruk i bedriften, til styring og beslutningstaking. Underlagt færre formelle krav enn finansregnskapet." },

  // K
  { term: "Kapital", desc: "Samlebetegnelse for de økonomiske midlene som er tilgjengelig for en virksomhet, enten egenkapital eller fremmedkapital." },
  { term: "Kassekreditt", desc: "En kredittramme som lar bedriften trekke mer enn saldoen på kontoen, opp til en avtalt grense. Renter betales kun av trukket beløp." },
  { term: "Kontering", desc: "Handlingen å bestemme hvilken regnskapskonto en transaksjon skal føres på. Riktig kontering er avgjørende for et korrekt regnskap." },
  { term: "Kontoplan", desc: "Et organisert system av nummererte kontoer som brukes til å klassifisere alle økonomiske hendelser i regnskapet. NS 4102 er standarden i Norge." },
  { term: "Kontantprinsippet", desc: "En regnskapsmetode der inntekter og kostnader registreres først når betaling faktisk skjer, i motsetning til periodiseringsprinsippet." },
  { term: "Kredit", desc: "Høyre side i en bokføringspost. Økning av gjeld, egenkapital og inntekter føres i kredit. Motparten til debet." },
  { term: "Kreditnota", desc: "Et dokument som korrigerer eller kansellerer en tidligere utstedt faktura. Brukes ved feilaktig fakturering, returer eller prisendringer." },
  { term: "Kreditor", desc: "En person eller virksomhet som bedriften skylder penger til. Leverandørene er dine kreditorer så lenge du har ubetalte fakturaer." },
  { term: "Kundefordring", desc: "Penger kunder skylder bedriften for leverte varer eller tjenester som ennå ikke er betalt. Vises som eiendel i balansen." },

  // L
  { term: "Leverandørgjeld", desc: "Ubetalte fakturaer fra leverandører for mottatte varer og tjenester. Vises som kortsiktig gjeld i balansen." },
  { term: "Likviditet", desc: "Bedriftens evne til å betale sine løpende forpliktelser etter hvert som de forfaller. God likviditet betyr nok penger til å dekke utgiftene." },
  { term: "Likviditetsbudsjett", desc: "En fremtidsplan som viser forventede inn- og utbetalinger periode for periode. Avdekker om bedriften vil ha nok penger til å betale sine regninger." },
  { term: "Lineær avskrivning", desc: "En avskrivningsmetode der eiendelen avskrives med like store beløp hvert år over levetiden." },
  { term: "Lønn", desc: "Kompensasjon arbeidsgiver betaler til ansatte for utført arbeid. Brutto lønn er beløpet før skattetrekk, nettolønn er det som utbetales." },

  // M
  { term: "MVA (Merverdiavgift)", desc: "En avgift som legges på de fleste varer og tjenester. Standardsats 25 %, redusert sats 15 % for mat og 12 % for transport og overnatting." },
  { term: "MVA-melding", desc: "Periodisk rapport til Skatteetaten som viser differansen mellom utgående og inngående MVA. Sendes vanligvis annenhver måned." },
  { term: "MVA-registrering", desc: "Påmelding i Merverdiavgiftsregisteret som er påkrevd når omsetningen overstiger 50 000 kroner i løpet av en tolvmånedersperiode." },
  { term: "Morarente", desc: "Forsinkelsesrente som beregnes når en faktura ikke betales innen forfallsdato. Satsen fastsettes av Finansdepartementet hvert halvår." },

  // N
  { term: "Nedskrivning", desc: "Ekstraordinær reduksjon av en eiendels bokførte verdi når virkelig verdi er varig lavere enn balanseført beløp." },
  { term: "Netto", desc: "Et beløp etter at alle fradrag, skatter og avgifter er trukket fra. Nettolønn er det du faktisk får utbetalt." },
  { term: "Norsk Standard Kontoplan (NS 4102)", desc: "Den offisielle standarden for kontonummerering i norsk regnskap. Deler kontoene inn i klasser fra 1 til 8." },
  { term: "Noter", desc: "Tilleggsopplysninger som utdyper og forklarer tallene i årsregnskapet. Gir viktig kontekst utover resultatregnskap og balanse." },

  // O
  { term: "Obligatorisk tjenestepensjon (OTP)", desc: "Lovpålagt pensjonsordning der arbeidsgiver må spare minimum 2 % av lønn mellom 1 G og 12 G for ansatte." },
  { term: "Omløpsmidler", desc: "Eiendeler som forventes omsatt til kontanter innen ett år, som varelager, kundefordringer og bankinnskudd." },
  { term: "Opptjeningsprinsippet", desc: "Et regnskapsprinsipp som sier at inntekter skal bokføres i den perioden de er opptjent, uavhengig av når betaling mottas." },
  { term: "Overkursfond", desc: "Beløp innbetalt utover pålydende verdi per aksje ved emisjoner. En del av selskapets egenkapital." },

  // P
  { term: "Passiva", desc: "Høyre side av balansen som viser hvordan bedriftens eiendeler er finansiert, fordelt på egenkapital og gjeld." },
  { term: "Periodisering", desc: "Prinsippet om å fordele inntekter og kostnader til riktig regnskapsperiode, uavhengig av betalingstidspunkt." },
  { term: "Privatuttak", desc: "Penger eller verdier som eier av enkeltpersonforetak tar ut fra virksomheten til privat bruk. Reduserer egenkapitalen." },
  { term: "Prokura", desc: "En fullmakt som gir en person rett til å handle på vegne av et selskap i alle saker, med noen unntak som fast eiendom." },
  { term: "Purring", desc: "En påminnelse om betaling sendt til en kunde som ikke har betalt innen forfallsdato. Purregebyr kan legges til." },

  // R
  { term: "Regnskapsloven", desc: "Norsk lov som regulerer hvem som er regnskapspliktig, hvordan årsregnskap skal utarbeides og hvilke opplysninger det skal inneholde." },
  { term: "Regnskapsår", desc: "Tolvmånedersperioden regnskapet dekker. Følger normalt kalenderåret, men avvikende regnskapsår kan godkjennes." },
  { term: "Regnskapspliktig", desc: "En virksomhet som er pålagt å utarbeide årsregnskap etter regnskapsloven. Alle aksjeselskaper er regnskapspliktige." },
  { term: "Resultatregnskap", desc: "En oppstilling som viser bedriftens inntekter, kostnader og resultat over en bestemt periode. Forteller om overskudd eller underskudd." },
  { term: "Revisjon", desc: "En uavhengig gjennomgang og bekreftelse av et selskaps regnskap utført av en autorisert revisor." },
  { term: "Revisor", desc: "En uavhengig fagperson som gjennomgår og bekrefter riktigheten av et selskaps regnskap. Aksjeselskaper over visse terskler har revisjonsplikt." },

  // S
  { term: "Saldoavskrivning", desc: "Avskrivningsmetode der en fast prosentsats trekkes fra restverdien hvert år. Gir høyere avskrivninger i starten." },
  { term: "Saldogrupper", desc: "Skattemessige kategorier som driftsmidler plasseres i for å bestemme avskrivningssats. Norge har saldogruppe a til j." },
  { term: "Sammenstillingsprinsippet", desc: "Regnskapsprinsipp som sier at kostnader skal bokføres i samme periode som de tilhørende inntektene de bidrar til å skape." },
  { term: "Skattemelding", desc: "Den årlige oppgaven til Skatteetaten der virksomheten rapporterer inntekter, kostnader og formue for beregning av skatt." },
  { term: "Skattepliktig inntekt", desc: "Nettoinntekten som danner grunnlag for beregning av inntektsskatt. Beregnes ved å trekke fradragsberettigede kostnader fra brutto inntekt." },
  { term: "Soliditet", desc: "Et mål på bedriftens evne til å tåle tap og motstå økonomiske nedgangsperioder. Måles gjerne som egenkapitalandel." },
  { term: "Styre", desc: "Det valgte organet som leder aksjeselskapet mellom generalforsamlingene. Har ansvar for strategi, kontroll og ledelse." },

  // T
  { term: "Tilskudd", desc: "Offentlige eller private økonomiske bidrag til virksomheten, for eksempel fra Innovasjon Norge, SkatteFUNN eller kommunale støtteordninger." },
  { term: "Trekkpliktig", desc: "Et beløp som arbeidsgiver er forpliktet til å trekke forskuddsskatt fra før utbetaling til mottaker." },
  { term: "Trinnskatt", desc: "En progressiv skatt på personinntekt som øker trinnvis med høyere inntektsnivå. Erstatter den tidligere toppskatten." },

  // U
  { term: "Utgående faktura", desc: "En faktura bedriften sender til sine kunder. Danner grunnlaget for inntektsføring og beregning av utgående MVA." },
  { term: "Utbytte", desc: "Utdeling av overskudd fra et aksjeselskap til aksjonærene. Besluttes av generalforsamlingen og beskattes som kapitalinntekt." },
  { term: "Utsatt skatt", desc: "Skatteforpliktelse som oppstår på grunn av midlertidige forskjeller mellom regnskapsmessig og skattemessig behandling av poster." },

  // V
  { term: "Varekostnad", desc: "Kostnadene knyttet til de varene som er solgt i perioden. Beregnes som IB varelager pluss innkjøp minus UB varelager." },
  { term: "Varelager", desc: "Fysiske varer som bedriften har på lager for salg eller videre bearbeiding. Vises som omløpsmiddel i balansen." },
  { term: "Vareopptelling", desc: "Fysisk telling av alle varer på lager for å kontrollere lagerverdien og avdekke eventuelle avvik mot regnskapet." },

  // Å
  { term: "Årsoppgjør", desc: "Prosessen med å avslutte regnskapsåret og utarbeide årsregnskap. Inkluderer avstemminger, periodiseringer og skatteberegning." },
  { term: "Årsregnskap", desc: "Den samlede økonomiske rapporteringen for et regnskapsår, bestående av resultatregnskap, balanse og noter." },
  { term: "Årsberetning", desc: "En rapport fra styret som følger årsregnskapet og beskriver selskapets utvikling, risiko, arbeidsmiljø og fremtidsutsikter." },
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
