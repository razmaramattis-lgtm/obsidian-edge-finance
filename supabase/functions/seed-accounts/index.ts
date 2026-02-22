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
  // ===== KLASSE 1: EIENDELER =====

  // 10 – Immaterielle eiendeler
  { n: "1000", name: "Utvikling, ervervet", group: "10 Immaterielle eiendeler", types: ["AS","ENK"], desc: "Denne kontoen brukes når bedriften har kjøpt utviklingsprosjekter fra en ekstern part. Det kan dreie seg om programvare, teknologiplattformer eller andre immaterielle verdier som oppfyller kravene til aktivering i balansen. For at en kjøpt utviklingseiendel skal kunne balanseføres, må den ha en identifiserbar fremtidig økonomisk nytte for virksomheten.\n\nNår du aktiverer en slik eiendel, avskrives den over forventet økonomisk levetid. Typisk levetid varierer fra tre til ti år, avhengig av type eiendel. Det er viktig å skille mellom ervervet og egenutviklet forskning og utvikling, da de har ulike regnskapsmessige regler.\n\nHusk at forskning aldri kan aktiveres – kun utvikling som oppfyller spesifikke kriterier kan balanseføres. Ved eventuell nedskriving må du vurdere gjenvinnbart beløp mot bokført verdi.", ex: "Oppkjøpt teknologiplattform, ervervet programvareprosjekt, kjøpt patent, lisensrettigheter", tags: ["utvikling","programvare","patent","immaterielle","forskning","FoU","teknologi","oppkjøp"] },
  { n: "1005", name: "Utvikling, egenutviklet", group: "10 Immaterielle eiendeler", types: ["AS","ENK"], desc: "Her fører du kostnader knyttet til utvikling av egne immaterielle eiendeler som oppfyller strenge krav til balanseføring. For å kunne aktivere egenutviklede eiendeler må du dokumentere teknisk gjennomførbarhet, intensjon om fullføring, evne til å bruke eller selge resultatet, og sannsynlig fremtidig inntjening.\n\nDette betyr at tidlige forskningsfaser alltid kostnadsføres direkte. Først når prosjektet har passert fra forskning til utvikling, og de nevnte kriteriene er oppfylt, kan kostnadene balanseføres. Avskrivning starter når eiendelen tas i bruk.\n\nVanlige eksempler inkluderer egenutviklet programvare, apper og digitale tjenester. Dokumentasjonskravet er strengt, og du bør føre prosjektregnskap som skiller forsknings- og utviklingsfasen.", ex: "Egenutviklet app, intern programvare, FoU-prosjekt, digital plattform", tags: ["utvikling","app","programvare","FoU","forskning","egenutviklet","intern","koding"] },
  { n: "1070", name: "Utsatt skattefordel", group: "10 Immaterielle eiendeler", types: ["AS"], desc: "Utsatt skattefordel er en balansepost som oppstår når det er midlertidige forskjeller mellom regnskapsmessige og skattemessige verdier, og disse forskjellene vil føre til lavere skatt i fremtiden. Det vanligste tilfellet er fremførbart underskudd.\n\nNår et selskap har gått med underskudd ett år, kan dette underskuddet fremføres og trekkes fra mot fremtidig skattbart overskudd. Den skattemessige verdien av dette fremførbare underskuddet vises som en eiendel i balansen.\n\nDet er viktig å vurdere sannsynligheten for at selskapet faktisk vil ha tilstrekkelig skattbart overskudd til å utnytte fordelen. Hvis ikke, skal utsatt skattefordel nedskrives eller ikke innregnes.", ex: "Fremførbart underskudd, midlertidige forskjeller, skattekredit", tags: ["skatt","skattefordel","underskudd","fremførbart","utsatt","balanse"] },
  { n: "1080", name: "Goodwill", group: "10 Immaterielle eiendeler", types: ["AS"], desc: "Goodwill representerer merverdien du betaler ved oppkjøp av en virksomhet utover den bokførte verdien av identifiserbare eiendeler og gjeld. Denne merverdien reflekterer verdien av kundeforhold, merkevare, markedsposisjon og andre ikke-materielle faktorer.\n\nGoodwill oppstår utelukkende ved virksomhetsoverdragelser og kan ikke opparbeides internt. Skattemessig tilhører goodwill saldogruppe b med en avskrivningssats på 20 prosent. Regnskapsmessig avskrives den over forventet økonomisk levetid, normalt fem til ti år.\n\nDersom goodwill-verdien ikke lenger kan forsvares, for eksempel ved tap av nøkkelkunder eller markedsandeler, skal det foretas nedskrivning.", ex: "Oppkjøpspremie, virksomhetsoverdragelse, merverdi ved oppkjøp", tags: ["goodwill","oppkjøp","merverdi","virksomhet","saldogruppe","oppkjøpspremie"] },

  // 11 – Tomter, bygninger og annen fast eiendom
  { n: "1100", name: "Forretningsbygg", group: "11 Tomter og bygninger", types: ["AS","ENK","Landbruk"], desc: "Næringsbygg som kontor, butikk eller produksjonslokaler eid av virksomheten. Tilhører saldogruppe i og avskrives med inntil 2 % årlig.", ex: "Kontorbygg, butikklokale, fabrikk" },
  { n: "1120", name: "Bygningsmessige anlegg", group: "11 Tomter og bygninger", types: ["AS","ENK","Landbruk"], desc: "Faste installasjoner og konstruksjoner knyttet til bygninger, som parkeringsplasser, gjerder og dreneringssystemer.", ex: "Parkeringsplass, gjerde, vei på tomt" },
  { n: "1130", name: "Anlegg under utførelse", group: "11 Tomter og bygninger", types: ["AS","ENK","Landbruk"], desc: "Byggeprosjekter som er påbegynt men ikke ferdigstilt. Avskrives ikke før anlegget tas i bruk.", ex: "Nybygg under oppføring, tilbygg under arbeid" },
  { n: "1190", name: "Andre anleggsmidler", group: "11 Tomter og bygninger", types: ["AS","ENK"], desc: "Fast eiendom og anleggsmidler som ikke passer i andre underkontoer i klasse 11.", ex: "Tomt, grunnarealer, festetomter" },

  // 12 – Transportmidler, inventar, maskiner
  { n: "1200", name: "Maskiner og anlegg", group: "12 Maskiner og inventar", types: ["AS","ENK","Landbruk"], desc: "Større produksjonsutstyr og maskiner som brukes i kjernevirksomheten. Tilhører saldogruppe d med avskrivningssats 20 %.", ex: "CNC-maskin, trykkpresse, bakemaskin, industrirobot" },
  { n: "1210", name: "Maskiner og anlegg under utførelse", group: "12 Maskiner og inventar", types: ["AS","ENK","Landbruk"], desc: "Maskiner som er bestilt eller under installering, men ennå ikke tatt i bruk. Avskrives først fra ibruktakelse.", ex: "Maskin under montering, bestilt produksjonslinje" },
  { n: "1230", name: "Personbiler og stasjonsvogner", group: "12 Maskiner og inventar", types: ["AS","ENK"], desc: "Kjøretøy registrert som personbil og eid av bedriften. Begrenset MVA-fradrag. Privatbruk utløser fordelsbeskatning.", ex: "Firmabil, stasjonsvogn, elbil" },
  { n: "1235", name: "Varebiler", group: "12 Maskiner og inventar", types: ["AS","ENK"], desc: "Kjøretøy registrert som varebil klasse 2 med fullt MVA-fradrag. Må oppfylle kravene til varebilregistrering.", ex: "Varebil, kassebil, servicebil" },
  { n: "1249", name: "Andre transportmidler", group: "12 Maskiner og inventar", types: ["AS","ENK","Landbruk"], desc: "Transportmidler utover person- og varebiler, som lastebiler, tilhengere og båter.", ex: "Lastebil, tilhenger, båt, snøscooter" },
  { n: "1250", name: "Inventar og verktøy", group: "12 Maskiner og inventar", types: ["AS","ENK"], desc: "Møbler, innredning og utstyr med verdi over aktiveringsgrensen. Tilhører saldogruppe d.", ex: "Kontormøbler, butikkinventar, hyllesystem" },
  { n: "1270", name: "Verktøy", group: "12 Maskiner og inventar", types: ["AS","ENK","Landbruk"], desc: "Varig verktøy med anskaffelseskost over grensen for direkte kostnadsføring.", ex: "Spesialverktøy, verkstedinnredning" },
  { n: "1280", name: "Kontormaskiner", group: "12 Maskiner og inventar", types: ["AS","ENK"], desc: "Kopimaskiner, printere og annet kontorteknisk utstyr som aktiveres. Tilhører saldogruppe a med 30 % sats.", ex: "Storformatskriver, kopimaskin, frankeringsmaskin" },
  { n: "1290", name: "Andre driftsmidler", group: "12 Maskiner og inventar", types: ["AS","ENK","Landbruk"], desc: "Varige driftsmidler som ikke naturlig hører hjemme i andre underkontoer.", ex: "Alarmsystem, skilting, spesialutstyr" },

  // 13 – Finansielle anleggsmidler
  { n: "1320", name: "Lån til selskap i samme konsern", group: "13 Finansielle anleggsmidler", types: ["AS"], desc: "Langsiktige utlån fra morselskap til datterselskap eller mellom søsterselskaper. Må dokumenteres med låneavtale og markedsmessig rente.", ex: "Konserninternt lån, morselskapslån" },
  { n: "1370", name: "Fordringer på personlige eiere", group: "13 Finansielle anleggsmidler", types: ["AS"], desc: "Lån gitt fra selskapet til personlige aksjonærer. Skattemessig behandles slike lån strengt og kan bli ansett som utbytte.", ex: "Aksjonærlån, eierlån" },
  { n: "1380", name: "Fordringer på ansatte", group: "13 Finansielle anleggsmidler", types: ["AS","ENK"], desc: "Langsiktige lån og fordringer på bedriftens ansatte som ikke forfaller innen ett år.", ex: "Boliglån til ansatt, forskuddslån" },
  { n: "1384", name: "Fordringer på daglig leder", group: "13 Finansielle anleggsmidler", types: ["AS"], desc: "Utlån til daglig leder som skal spesifiseres separat i noter til årsregnskapet.", ex: "Lån til daglig leder" },
  { n: "1395", name: "Depositum og leietakerinnskudd", group: "13 Finansielle anleggsmidler", types: ["AS","ENK"], desc: "Innbetalte depositum ved leie av lokaler eller annet utstyr. Tilbakebetales ved avtalens slutt.", ex: "Husleiedepositum, garantikonto" },
  { n: "1399", name: "Andre fordringer", group: "13 Finansielle anleggsmidler", types: ["AS","ENK"], desc: "Langsiktige fordringer som ikke passer i andre underkontoer i gruppen.", ex: "Andre langsiktige utlån" },

  // 14 – Varelager og forskudd til leverandører
  { n: "1400", name: "Råvarer", group: "14 Varelager", types: ["AS","ENK","Landbruk"], desc: "Materialer på lager som skal brukes i egen produksjon. Verdsettes til laveste av anskaffelseskost og virkelig verdi.", ex: "Trelast, metall, stoff, ingredienser" },
  { n: "1460", name: "Innkjøpte varer for videresalg", group: "14 Varelager", types: ["AS","ENK"], desc: "Handelsvarer på lager som er kjøpt inn for å selges videre uten vesentlig bearbeiding.", ex: "Butikkvarer, grossistvarer, nettbutikklager" },
  { n: "1480", name: "Forskuddsbetaling til leverandører", group: "14 Varelager", types: ["AS","ENK"], desc: "Forhåndsbetaling på varer eller prosjekter som ennå ikke er levert. Omklassifiseres ved mottak.", ex: "Forskudd på vareleveranse, depositum på bestilling" },

  // 15 – Kortsiktige fordringer
  { n: "1500", name: "Kundefordringer", group: "15 Kortsiktige fordringer", types: ["AS","ENK","Landbruk"], desc: "Utestående krav mot kunder for leverte varer eller tjenester. Vises som eiendel i balansen og følges opp med aldersfordelt saldoliste.", ex: "Ubetalt faktura, utestående kundesaldo" },
  { n: "1509", name: "Ikke reskontroførte kundefordringer", group: "15 Kortsiktige fordringer", types: ["AS","ENK"], desc: "Kundefordringer som ikke er registrert i kundereskontroen, for eksempel manuelle korrigeringer.", ex: "Manuell kreditnota, korrigering utenfor reskontro" },
  { n: "1530", name: "Opptjent ikke fakturert driftsinntekt", group: "15 Kortsiktige fordringer", types: ["AS","ENK"], desc: "Inntekter som er opptjent men ennå ikke fakturert ved periodeslutt. Periodiseres for korrekt resultat.", ex: "Pågående konsulentprosjekt, akkumulerte timer" },
  { n: "1550", name: "Kundefordringer konsern", group: "15 Kortsiktige fordringer", types: ["AS"], desc: "Utestående fordringer mot selskaper i samme konsern. Skal spesifiseres separat.", ex: "Faktura til datterselskap, konsernintern fordring" },
  { n: "1560", name: "Andre fordringer konsern", group: "15 Kortsiktige fordringer", types: ["AS"], desc: "Mellomværende med konsernselskaper utover rene kundefordringer.", ex: "Konsernbidrag, mellomregning konsern" },
  { n: "1570", name: "Reiseforskudd", group: "15 Kortsiktige fordringer", types: ["AS","ENK"], desc: "Forskudd utbetalt til ansatte for dekning av reiseutgifter som ennå ikke er gjort opp.", ex: "Kontantforskudd til tjenestereise" },
  { n: "1571", name: "Lønnsforskudd", group: "15 Kortsiktige fordringer", types: ["AS","ENK"], desc: "Forskudd på lønn utbetalt til ansatte før ordinær lønnskjøring.", ex: "Ekstra utbetaling, a konto lønn" },
  { n: "1572", name: "Andre kortsiktige lån til ansatte", group: "15 Kortsiktige fordringer", types: ["AS","ENK"], desc: "Kortsiktige utlån til ansatte utover reise- og lønnsforskudd.", ex: "Kortsiktig lån til ansatt" },
  { n: "1574", name: "Kortsiktig lån aksjonær/deltaker", group: "15 Kortsiktige fordringer", types: ["AS"], desc: "Kortsiktige utlån til aksjonærer. Kan skattemessig bli behandlet som utbytte dersom ikke tilbakebetalt.", ex: "Midlertidig lån til aksjonær" },
  { n: "1576", name: "Kortsiktige fordringer eiere/styremedlemmer", group: "15 Kortsiktige fordringer", types: ["AS"], desc: "Utlegg og fordringer mot eiere og styremedlemmer som forfaller innen ett år.", ex: "Utlegg for styreleder, fordring på eier" },
  { n: "1579", name: "Andre kortsiktige fordringer", group: "15 Kortsiktige fordringer", types: ["AS","ENK"], desc: "Diverse kortsiktige fordringer som ikke hører hjemme i andre underkontoer.", ex: "Forsikringsoppgjør, diverse tilgodehavende" },
  { n: "1580", name: "Avsetning tap på kundefordringer", group: "15 Kortsiktige fordringer", types: ["AS","ENK"], desc: "Estimert tap på kundefordringer der det er sannsynlig at betaling uteblir. Reduserer balanseført verdi av fordringene.", ex: "Tapsavsetning, konstatert tap" },
  { n: "1585", name: "Avsetning tap på andre fordringer", group: "15 Kortsiktige fordringer", types: ["AS","ENK"], desc: "Estimert tap på andre fordringer enn kundefordringer.", ex: "Nedskrivning ansattlån, tapsavsetning diverse" },

  // 16 – MVA og offentlige tilskudd
  { n: "1670", name: "Krav på offentlige tilskudd", group: "16 Offentlige tilskudd", types: ["AS","ENK","Landbruk"], desc: "Tilskudd fra stat eller kommune som er innvilget men ennå ikke utbetalt.", ex: "Innvilget SkatteFUNN, tilsagn fra Innovasjon Norge" },

  // 17 – Forskuddsbetalt kostnad
  { n: "1700", name: "Forskuddsbetalt leiekostnad", group: "17 Forskuddsbetalte kostnader", types: ["AS","ENK"], desc: "Husleie eller annen leie betalt på forskudd som gjelder fremtidige perioder. Periodiseres over leieperioden.", ex: "Forhåndsbetalt kontorleie, forskuddsbetalt lagerleie" },
  { n: "1710", name: "Forskuddsbetalt rentekostnad", group: "17 Forskuddsbetalte kostnader", types: ["AS","ENK"], desc: "Renter på lån som er betalt forskuddsvis og gjelder kommende perioder.", ex: "Forhåndsbetalt lånerente" },
  { n: "1740", name: "Forskuddsbetalt ikke påløpt lønn", group: "17 Forskuddsbetalte kostnader", types: ["AS","ENK"], desc: "Lønnskostnader utbetalt før de er opptjent av den ansatte.", ex: "Lønnsforskudd, sign-on bonus" },
  { n: "1749", name: "Andre forskuddsbetalte kostnader", group: "17 Forskuddsbetalte kostnader", types: ["AS","ENK"], desc: "Diverse forhåndsbetalinger som dekker fremtidige perioder og må periodiseres.", ex: "Forskuddsbetalt forsikring, abonnement betalt årlig" },
  { n: "1750", name: "Påløpt leieinntekt", group: "17 Forskuddsbetalte kostnader", types: ["AS","ENK"], desc: "Leieinntekter som er opptjent men ennå ikke fakturert eller mottatt.", ex: "Opptjent husleie, ikke fakturert leie" },
  { n: "1760", name: "Påløpt ikke forfalt renteinntekt", group: "17 Forskuddsbetalte kostnader", types: ["AS","ENK"], desc: "Renter som er opptjent men ikke forfalt til betaling ved periodeslutt.", ex: "Opptjent bankrente, akkumulert utlånsrente" },
  { n: "1770", name: "Andre periodiseringer", group: "17 Forskuddsbetalte kostnader", types: ["AS","ENK"], desc: "Andre poster som må periodiseres for korrekt resultatmåling.", ex: "Diverse periodiseringer, avgrensningsposter" },

  // 18 – Kortsiktige finansinvesteringer
  { n: "1800", name: "Aksjer i konsernselskap", group: "18 Finansinvesteringer", types: ["AS"], desc: "Kortsiktige aksjeinvesteringer i selskaper innenfor samme konsern.", ex: "Aksjer i datterselskap holdt for salg" },
  { n: "1810", name: "Børsnoterte aksjer", group: "18 Finansinvesteringer", types: ["AS","ENK"], desc: "Investeringer i aksjer notert på børs. Verdsettes til markedsverdi ved årsslutt.", ex: "Aksjeportefølje, børsaksjer" },
  { n: "1820", name: "Andre aksjer", group: "18 Finansinvesteringer", types: ["AS","ENK"], desc: "Investeringer i aksjer som ikke er børsnoterte.", ex: "Unoterte aksjer, aksjer i oppstartsselskaper" },
  { n: "1830", name: "Markedsbaserte obligasjoner", group: "18 Finansinvesteringer", types: ["AS"], desc: "Obligasjoner som omsettes på regulert marked og verdsettes til markedspris.", ex: "Statsobligasjoner, selskapsobligasjoner" },
  { n: "1840", name: "Andre obligasjoner", group: "18 Finansinvesteringer", types: ["AS"], desc: "Obligasjoner som ikke omsettes på regulert marked.", ex: "Private obligasjoner, unoterte gjeldsbrev" },
  { n: "1850", name: "Markedsbaserte sertifikater", group: "18 Finansinvesteringer", types: ["AS"], desc: "Kortsiktige rentepapirer med løpetid under ett år som handles på regulert marked.", ex: "Statssertifikater, banksertifikater" },
  { n: "1870", name: "Markedsbaserte opsjoner", group: "18 Finansinvesteringer", types: ["AS"], desc: "Opsjonskontrakter som omsettes på børs og verdsettes til markedsverdi.", ex: "Kjøpsopsjoner, salgsopsjoner" },

  // 19 – Kontanter og bankinnskudd
  { n: "1900", name: "Kontanter", group: "19 Kontanter og bank", types: ["AS","ENK","Landbruk"], desc: "Fysiske penger i bedriftens kasse. Skal telles og avstemmes regelmessig mot kassebok.", ex: "Vekslepenger i kassa, kontantsalg" },
  { n: "1905", name: "Kontanter Euro", group: "19 Kontanter og bank", types: ["AS","ENK"], desc: "Fysiske kontanter i euro som holdes i bedriftens valutakasse.", ex: "Eurokasse, vekslepenger i euro" },
  { n: "1908", name: "Kontanter annen valuta", group: "19 Kontanter og bank", types: ["AS","ENK"], desc: "Fysiske kontanter i andre utenlandske valutaer enn euro.", ex: "Dollar, svenske kroner, pund" },
  { n: "1920", name: "Bankinnskudd", group: "19 Kontanter og bank", types: ["AS","ENK","Landbruk"], desc: "Saldo på bedriftens primære driftskonto i banken. Avstemmes månedlig mot kontoutskrift.", ex: "Driftskonto, brukskonto" },
  { n: "1921", name: "Bankinnskudd 2", group: "19 Kontanter og bank", types: ["AS","ENK"], desc: "Saldo på bedriftens sekundære bankkonto, for eksempel en sparekonto eller ekstra driftskonto.", ex: "Sparekonto, høyrentekonto, prosjektkonto" },
  { n: "1940", name: "Bankinnskudd utland", group: "19 Kontanter og bank", types: ["AS","ENK"], desc: "Innskudd på bankkontoer i utenlandske banker. Omregnes til norske kroner ved periodeavslutning.", ex: "Valutakonto, utenlandsk driftskonto" },
  { n: "1950", name: "Bankinnskudd for skattetrekk", group: "19 Kontanter og bank", types: ["AS","ENK"], desc: "Lovpålagt egen bankkonto der forskuddstrekk fra ansattes lønn oppbevares til innbetaling til Skatteetaten.", ex: "Skattetrekkskonto" },

  // ===== KLASSE 2: EGENKAPITAL OG GJELD =====

  // 20 – Egenkapital
  { n: "2000", name: "Egenkapital bundet", group: "20 Egenkapital", types: ["AS"], desc: "Den registrerte aksjekapitalen i selskapet. Minimum 30 000 kroner. Kan kun endres gjennom formelle selskapsrettslige vedtak.", ex: "Aksjekapital, selskapskapital" },
  { n: "2010", name: "Egne aksjer", group: "20 Egenkapital", types: ["AS"], desc: "Aksjer selskapet har kjøpt tilbake i eget selskap. Reduserer egenkapitalen og har strenge regler for hvor mye som kan eies.", ex: "Tilbakekjøpte aksjer" },
  { n: "2020", name: "Overkurs", group: "20 Egenkapital", types: ["AS"], desc: "Beløp aksjonærer har innbetalt utover pålydende verdi per aksje ved emisjoner eller stiftelse.", ex: "Overkursfond, emisjonspremie" },
  { n: "2030", name: "Annen innskutt egenkapital", group: "20 Egenkapital", types: ["AS"], desc: "Innskudd fra eiere utover aksjekapital og overkurs som ikke er lån.", ex: "Kapitalinnskudd, uformell egenkapital" },
  { n: "2050", name: "Annen egenkapital", group: "20 Egenkapital", types: ["AS","ENK"], desc: "Opptjent egenkapital som ikke er bundet, inkludert tilbakeholdt overskudd fra tidligere regnskapsår.", ex: "Opptjent overskudd, balansert resultat" },
  { n: "2052", name: "Ikke fradragsberettigede kontingenter/gaver", group: "20 Egenkapital", types: ["ENK"], desc: "Privatuttak for kontingenter og gaver som ikke gir skattemessig fradrag i enkeltpersonforetak.", ex: "Politisk kontingent, ikke-fradragsberettiget gave" },
  { n: "2060", name: "Privatuttak", group: "20 Egenkapital", types: ["ENK"], desc: "Penger eller verdier eier tar ut fra enkeltpersonforetaket til privat bruk. Reduserer egenkapitalen.", ex: "Kontantuttak, overføring til privat konto" },
  { n: "2064", name: "Uttak varer og tjenester", group: "20 Egenkapital", types: ["ENK"], desc: "Privat bruk av bedriftens varer eller tjenester. Skal verdsettes til markedspris og avgiftsberegnes.", ex: "Privat bruk av handelsvarer, eget forbruk" },
  { n: "2068", name: "Private kostnader elektronisk kommunikasjon", group: "20 Egenkapital", types: ["ENK"], desc: "Den private andelen av mobiltelefon og bredbånd som eier bruker. Skal skilles fra driftskostnad.", ex: "Privat mobilbruk, privat bredbånd" },
  { n: "2072", name: "Skatter", group: "20 Egenkapital", types: ["ENK"], desc: "Eiers private skatter betalt fra virksomhetens konto. Bokføres som privatuttak, ikke som bedriftskostnad.", ex: "Forskuddsskatt ENK, restskatt" },
  { n: "2075", name: "Privat bruk av næringsbil", group: "20 Egenkapital", types: ["ENK"], desc: "Beregnet privat fordel ved bruk av bedriftens kjøretøy til private formål.", ex: "Privatkjøring med firmabil" },
  { n: "2077", name: "Premie egen syke- og ulykkesforsikring", group: "20 Egenkapital", types: ["ENK"], desc: "Forsikringspremier for eiers personlige helse- og ulykkesforsikring betalt av foretaket.", ex: "Sykeforsikring for selvstendig næringsdrivende" },
  { n: "2078", name: "Premie tilleggstrygd sykepenger", group: "20 Egenkapital", types: ["ENK"], desc: "Frivillig tilleggstrygd som gir selvstendig næringsdrivende bedre sykepengedekning fra NAV.", ex: "Tilleggsforsikring for sykepenger" },
  { n: "2080", name: "Udekket tap", group: "20 Egenkapital", types: ["AS","ENK"], desc: "Akkumulerte underskudd som overstiger annen egenkapital. Kan utløse handleplikt for styret i aksjeselskaper.", ex: "Akkumulert underskudd, negativ egenkapital" },

  // 21 – Avsetning for forpliktelser
  { n: "2100", name: "Pensjonsforpliktelser", group: "21 Avsetninger", types: ["AS"], desc: "Selskapets forpliktelse til å betale fremtidig pensjon til ansatte under ytelsesbaserte ordninger.", ex: "Ytelsesbasert pensjon, pensjonsgjeld" },
  { n: "2120", name: "Utsatt skatt", group: "21 Avsetninger", types: ["AS"], desc: "Skatteforpliktelse som oppstår fra midlertidige forskjeller mellom regnskapsmessige og skattemessige verdier.", ex: "Utsatt skatteforpliktelse" },
  { n: "2160", name: "Uopptjent inntekt", group: "21 Avsetninger", types: ["AS","ENK"], desc: "Innbetalinger mottatt for tjenester eller varer som ennå ikke er levert. Inntektsføres etterhvert som levering skjer.", ex: "Forhåndsbetalt abonnement, forskuddsbetalt service" },
  { n: "2180", name: "Andre avsetninger for forpliktelser", group: "21 Avsetninger", types: ["AS","ENK"], desc: "Avsetninger for forpliktelser som ikke hører hjemme i andre underkontoer.", ex: "Garantiavsetning, miljøforpliktelse, rettslig tvist" },

  // 22 – Annen langsiktig gjeld
  { n: "2220", name: "Gjeld til kredittinstitusjoner", group: "22 Langsiktig gjeld", types: ["AS","ENK","Landbruk"], desc: "Langsiktige lån fra banker og finansieringsinstitusjoner med mer enn ett år til forfall.", ex: "Banklån, nedbetalingslån" },
  { n: "2240", name: "Pantelån", group: "22 Langsiktig gjeld", types: ["AS","ENK","Landbruk"], desc: "Lån sikret med pant i bedriftens eiendeler, typisk fast eiendom eller driftsløsøre.", ex: "Eiendomslån, pantesikret lån" },
  { n: "2250", name: "Gjeld til ansatte", group: "22 Langsiktig gjeld", types: ["AS","ENK"], desc: "Langsiktige lån mottatt fra ansatte i bedriften. Må dokumenteres med låneavtale.", ex: "Ansattlån til bedriften" },
  { n: "2255", name: "Gjeld til eiere", group: "22 Langsiktig gjeld", types: ["AS"], desc: "Langsiktige lån fra aksjonærer til selskapet. Krever skriftlig avtale med markedsmessig rente.", ex: "Eierlån, aksjonærlån til selskapet" },
  { n: "2260", name: "Gjeld til selskap i samme konsern", group: "22 Langsiktig gjeld", types: ["AS"], desc: "Langsiktige lån mellom konsernselskaper som skal spesifiseres i noter.", ex: "Konsernlån, konsernintern gjeld" },
  { n: "2290", name: "Annen langsiktig gjeld", group: "22 Langsiktig gjeld", types: ["AS","ENK"], desc: "Langsiktige forpliktelser som ikke dekkes av andre underkontoer i klasse 22.", ex: "Finansiell leasing, ansvarlig lån, obligasjonslån" },

  // 23 – Kortsiktige lån og kassekreditt
  { n: "2300", name: "Konvertible lån kortsiktig", group: "23 Kortsiktig gjeld kreditt", types: ["AS"], desc: "Lån som kan konverteres til aksjer innen kort tid.", ex: "Konvertibelt lån med forfallsdato under ett år" },
  { n: "2320", name: "Obligasjonslån kortsiktig", group: "23 Kortsiktig gjeld kreditt", types: ["AS"], desc: "Obligasjonslån som forfaller innen ett år eller kortsiktig del av langsiktig obligasjonslån.", ex: "Obligasjon med kort løpetid" },
  { n: "2360", name: "Byggelån", group: "23 Kortsiktig gjeld kreditt", types: ["AS","ENK"], desc: "Midlertidig finansiering av byggeprosjekter som normalt konverteres til langsiktig lån ved ferdigstillelse.", ex: "Byggelån for nybygg" },
  { n: "2380", name: "Kassekreditt", group: "23 Kortsiktig gjeld kreditt", types: ["AS","ENK"], desc: "En kredittramme i banken som lar bedriften trekke konto i minus opp til avtalt grense. Renter beregnes av benyttet beløp.", ex: "Kassekredittlimit, trekkrettighet" },
  { n: "2390", name: "Annen gjeld til kredittinstitusjon", group: "23 Kortsiktig gjeld kreditt", types: ["AS","ENK"], desc: "Kortsiktig gjeld til banker og finansinstitusjoner utover kassekreditt.", ex: "Kortsiktig driftslån, factoring" },

  // 24 – Leverandørgjeld
  { n: "2400", name: "Leverandørgjeld", group: "24 Leverandørgjeld", types: ["AS","ENK","Landbruk"], desc: "Ubetalte fakturaer for varer og tjenester mottatt fra leverandører. Følges opp med leverandørreskontro.", ex: "Varekjøp, tjenestefakturaer" },
  { n: "2460", name: "Leverandørgjeld konsern", group: "24 Leverandørgjeld", types: ["AS"], desc: "Ubetalte fakturaer til selskaper innenfor samme konsern. Spesifiseres separat i noter.", ex: "Konsernintern faktura, mellomregning" },

  // 25 – Betalbar skatt
  { n: "2500", name: "Betalbar skatt, ikke utlignet", group: "25 Betalbar skatt", types: ["AS"], desc: "Beregnet skattekostnad for inneværende år som ennå ikke er formelt utlignet av skattemyndighetene.", ex: "Avsatt skatt, skatteforpliktelse" },
  { n: "2510", name: "Betalbar skatt, utlignet", group: "25 Betalbar skatt", types: ["AS"], desc: "Skatt som er utlignet av skattemyndighetene basert på innsendt skattemelding.", ex: "Utlignet selskapsskatt" },
  { n: "2540", name: "Forhåndsskatt", group: "25 Betalbar skatt", types: ["AS"], desc: "Forskuddsskatt innbetalt av aksjeselskapet i løpet av inntektsåret.", ex: "Terminvis forskuddsskatt" },

  // 26 – Skattetrekk og andre trekk
  { n: "2600", name: "Forskuddstrekk", group: "26 Skattetrekk", types: ["AS","ENK"], desc: "Skatt trukket fra ansattes lønn som oppbevares på skattetrekkskonto frem til innbetaling annenhver måned.", ex: "Lønnstrekk, skattetrekk" },
  { n: "2610", name: "Påleggstrekk", group: "26 Skattetrekk", types: ["AS","ENK"], desc: "Trekk i lønn pålagt av Skatteetaten for å dekke ansattes skatterestanser.", ex: "Påleggstrekk fra kemner" },
  { n: "2620", name: "Bidragstrekk", group: "26 Skattetrekk", types: ["AS","ENK"], desc: "Trekk i lønn pålagt for barnebidrag eller andre underholdsbidrag.", ex: "Bidragstrekk fra NAV" },
  { n: "2630", name: "Trygdetrekk", group: "26 Skattetrekk", types: ["AS","ENK"], desc: "Historisk konto for trygdeavgifter trukket fra ansattes lønn. Mindre brukt etter nyere regelverk.", ex: "Trygdeavgiftstrekk" },
  { n: "2640", name: "Forsikringstrekk", group: "26 Skattetrekk", types: ["AS","ENK"], desc: "Trekk i lønn for ansattes andel av forsikringspremier avtalt mellom arbeidsgiver og ansatt.", ex: "Trekk for helseforsikring, pensjonsinnskudd" },
  { n: "2650", name: "Trukket fagforeningskontingent", group: "26 Skattetrekk", types: ["AS","ENK"], desc: "Fagforeningskontingent trukket fra ansattes lønn og videresendt til fagforeningen.", ex: "LO-kontingent, fagforeningsavgift" },
  { n: "2690", name: "Andre trekk", group: "26 Skattetrekk", types: ["AS","ENK"], desc: "Diverse lønnstrekk som ikke passer i andre underkontoer.", ex: "Trekk for kantine, parkeringsleie" },

  // 27 – Skyldige offentlige avgifter
  { n: "2700", name: "Utgående mva høy sats", group: "27 Merverdiavgift", types: ["AS","ENK"], desc: "MVA beregnet med 25 % sats på salg av varer og tjenester. Skylder du staten ved neste terminoppgjør.", ex: "25 % MVA på utgående faktura" },
  { n: "2701", name: "Utgående mva middels sats", group: "27 Merverdiavgift", types: ["AS","ENK"], desc: "MVA beregnet med 15 % sats, hovedsakelig på salg av næringsmidler.", ex: "15 % MVA på matvaresalg" },
  { n: "2702", name: "Utgående mva lav sats", group: "27 Merverdiavgift", types: ["AS","ENK"], desc: "MVA beregnet med 12 % sats på persontransport, overnatting, kino og NRK-lisens.", ex: "12 % MVA på hotell, kinobillett" },
  { n: "2703", name: "Utgående mva kjøp tjenester utland, høy sats", group: "27 Merverdiavgift", types: ["AS","ENK"], desc: "Snudd avregning av MVA ved kjøp av tjenester fra utlandet med 25 % sats.", ex: "Google Ads, Facebook-annonser, utenlandsk konsulent" },
  { n: "2704", name: "Utgående mva kjøp tjenester utland, lav sats", group: "27 Merverdiavgift", types: ["AS","ENK"], desc: "Snudd avregning av MVA ved kjøp av tjenester fra utlandet med lav sats.", ex: "Utenlandsk streaming, digitale tjenester lav sats" },
  { n: "2705", name: "Utgående mva innførsel, høy sats", group: "27 Merverdiavgift", types: ["AS","ENK"], desc: "MVA beregnet ved innførsel av varer til Norge med 25 % sats.", ex: "Importmoms på varer" },
  { n: "2706", name: "Utgående mva innførsel, middels sats", group: "27 Merverdiavgift", types: ["AS","ENK"], desc: "MVA beregnet ved innførsel av matvarer med 15 % sats.", ex: "Importmoms på næringsmidler" },
  { n: "2707", name: "Utgående mva klimakvoter og gull", group: "27 Merverdiavgift", types: ["AS"], desc: "Utgående MVA ved kjøp av klimakvoter og investeringsgull med omvendt avgiftsplikt.", ex: "Klimakvoter, gullhandel" },
  { n: "2710", name: "Inngående mva høy sats", group: "27 Merverdiavgift", types: ["AS","ENK"], desc: "MVA betalt med 25 % sats på innkjøpsfakturaer som kan kreves fradrag for i MVA-oppgjøret.", ex: "Fradrag på leverandørfaktura" },
  { n: "2711", name: "Inngående mva middels sats", group: "27 Merverdiavgift", types: ["AS","ENK"], desc: "MVA-fradrag med 15 % sats på innkjøp av næringsmidler til virksomheten.", ex: "MVA-fradrag matkjøp til kantine" },
  { n: "2712", name: "Inngående mva lav sats", group: "27 Merverdiavgift", types: ["AS","ENK"], desc: "MVA-fradrag med 12 % sats på relevante innkjøp.", ex: "MVA-fradrag overnatting, persontransport" },
  { n: "2713", name: "Inngående mva innførsel, høy sats", group: "27 Merverdiavgift", types: ["AS","ENK"], desc: "Fradrag for importmoms beregnet med 25 % sats ved vareinnførsel.", ex: "MVA-fradrag på importerte varer" },
  { n: "2714", name: "Inngående mva innførsel, middels sats", group: "27 Merverdiavgift", types: ["AS","ENK"], desc: "Fradrag for importmoms med 15 % sats på importerte næringsmidler.", ex: "MVA-fradrag importerte matvarer" },
  { n: "2740", name: "Oppgjørskonto merverdiavgift", group: "27 Merverdiavgift", types: ["AS","ENK"], desc: "Mellomkonto brukt ved MVA-oppgjør for å samle netto skyldig eller tilgode MVA.", ex: "MVA-oppgjør, terminoppgjør" },
  { n: "2741", name: "Inngående mva kjøp varer utland (1)", group: "27 Merverdiavgift", types: ["AS","ENK"], desc: "Fradrag for MVA beregnet ved kjøp av varer fra utlandet, første underkonto.", ex: "Importmoms varer" },
  { n: "2742", name: "Inngående mva kjøp varer utland (2)", group: "27 Merverdiavgift", types: ["AS","ENK"], desc: "Andre underkonto for MVA-fradrag ved import av varer.", ex: "Importmoms varer, supplerende konto" },
  { n: "2745", name: "Grunnlag utgående mva kjøp tjenester utland", group: "27 Merverdiavgift", types: ["AS","ENK"], desc: "Grunnlagsbeløp for beregning av snudd avregning ved kjøp av tjenester fra utlandet.", ex: "Fakturabeløp utenlandsk tjeneste" },
  { n: "2746", name: "Motkonto grunnlag kjøp tjenester utland", group: "27 Merverdiavgift", types: ["AS","ENK"], desc: "Motkonto som nuller ut grunnlaget for snudd avregning, slik at det ikke påvirker resultatet.", ex: "Motkonto snudd avregning" },
  { n: "2761", name: "Grunnlag innførsel varer høy sats", group: "27 Merverdiavgift", types: ["AS","ENK"], desc: "Tollverdi og grunnlag for beregning av importmoms med 25 % sats.", ex: "Grunnlag importmoms 25 %" },
  { n: "2762", name: "Motkonto innførsel varer høy sats", group: "27 Merverdiavgift", types: ["AS","ENK"], desc: "Motkonto som nuller ut grunnlaget for importmoms med høy sats.", ex: "Motkonto importgrunnlag" },
  { n: "2763", name: "Grunnlag innførsel varer middels sats", group: "27 Merverdiavgift", types: ["AS","ENK"], desc: "Grunnlag for beregning av importmoms med 15 % sats på næringsmidler.", ex: "Grunnlag importmoms matvarer" },
  { n: "2764", name: "Motkonto innførsel varer middels sats", group: "27 Merverdiavgift", types: ["AS","ENK"], desc: "Motkonto som nuller ut grunnlaget for importmoms med middels sats.", ex: "Motkonto importgrunnlag matvarer" },
  { n: "2765", name: "Grunnlag innførsel varer ingen mva", group: "27 Merverdiavgift", types: ["AS","ENK"], desc: "Tollverdi for importerte varer som er fritatt for merverdiavgift.", ex: "Avgiftsfri import, fritak" },
  { n: "2766", name: "Motkonto innførsel varer ingen mva", group: "27 Merverdiavgift", types: ["AS","ENK"], desc: "Motkonto for importerte varer uten MVA.", ex: "Motkonto avgiftsfri import" },
  { n: "2770", name: "Skyldig arbeidsgiveravgift", group: "27 Offentlige avgifter", types: ["AS","ENK"], desc: "Arbeidsgiveravgift som er beregnet på lønnskjøring men ikke ennå innbetalt til Skatteetaten.", ex: "Påløpt AGA, terminforfall" },
  { n: "2780", name: "Avsatt arbeidsgiveravgift påløpt lønn", group: "27 Offentlige avgifter", types: ["AS","ENK"], desc: "Arbeidsgiveravgift beregnet på påløpt men ikke utbetalt lønn ved periodeslutt.", ex: "AGA på opptjent ikke utbetalt lønn" },
  { n: "2785", name: "Påløpt arbeidsgiveravgift ferielønn", group: "27 Offentlige avgifter", types: ["AS","ENK"], desc: "Arbeidsgiveravgift beregnet på opptjente feriepenger som utbetales neste år.", ex: "AGA på feriepengeforpliktelse" },
  { n: "2790", name: "Andre offentlige avgifter", group: "27 Offentlige avgifter", types: ["AS","ENK"], desc: "Øvrige avgifter til offentlige myndigheter som ikke dekkes av andre kontoer.", ex: "Finansskatt, særavgifter" },

  // 28 – Utbytte
  { n: "2800", name: "Avsatt ordinært utbytte", group: "28 Utbytte", types: ["AS"], desc: "Utbytte vedtatt av generalforsamlingen som ennå ikke er utbetalt til aksjonærene.", ex: "Vedtatt utbytte, utbyttegjeld" },

  // 29 – Annen kortsiktig gjeld
  { n: "2900", name: "Forskudd fra kunder", group: "29 Annen kortsiktig gjeld", types: ["AS","ENK"], desc: "Innbetalinger fra kunder for varer eller tjenester som ennå ikke er levert. Inntektsføres ved levering.", ex: "Depositum, forhåndsbetaling, gavekort" },
  { n: "2903", name: "Forskudd kunder tilgodelapp", group: "29 Annen kortsiktig gjeld", types: ["AS","ENK"], desc: "Utstedte tilgodelapper og gavekort som representerer en forpliktelse til fremtidig leveranse.", ex: "Tilgodelapp, ubrukt gavekort" },
  { n: "2910", name: "Gjeld til ansatte", group: "29 Annen kortsiktig gjeld", types: ["AS","ENK"], desc: "Beløp bedriften skylder ansatte utover lønn, for eksempel utleggsrefusjoner og reiseoppgjør.", ex: "Utleggsrefusjon, reiseoppgjør" },
  { n: "2920", name: "Gjeld til konsernselskap kortsiktig", group: "29 Annen kortsiktig gjeld", types: ["AS"], desc: "Kortsiktig gjeld til selskaper i samme konsern.", ex: "Konsernintern mellomregning, kortsiktig konsernlån" },
  { n: "2930", name: "Skyldig lønn", group: "29 Annen kortsiktig gjeld", types: ["AS","ENK"], desc: "Opptjent lønn til ansatte som ennå ikke er utbetalt ved periodeslutt.", ex: "Lønnsgjeld, påløpt lønn" },
  { n: "2940", name: "Skyldige feriepenger", group: "29 Annen kortsiktig gjeld", types: ["AS","ENK"], desc: "Feriepenger opptjent av ansatte i inneværende år som utbetales neste sommer.", ex: "Feriepengeforpliktelse, avsetning feriepenger" },
  { n: "2965", name: "Forskuddsbetalt inntekt", group: "29 Annen kortsiktig gjeld", types: ["AS","ENK"], desc: "Inntekter mottatt forskuddsvis for tjenester som leveres i fremtidige perioder.", ex: "Forhåndsbetalt abonnement, forskuddsfaktura" },
  { n: "2970", name: "Uopptjent inntekt", group: "29 Annen kortsiktig gjeld", types: ["AS","ENK"], desc: "Innbetalinger for ytelser som ennå ikke er levert. Inntektsføres løpende ved levering.", ex: "Periodisert abonnementsinntekt" },
  { n: "2980", name: "Avsetning styrehonorar", group: "29 Annen kortsiktig gjeld", types: ["AS"], desc: "Avsatt forpliktelse for styrehonorar som er vedtatt men ikke utbetalt.", ex: "Påløpt styregodtgjørelse" },
  { n: "2982", name: "Avsetning revisjonshonorar", group: "29 Annen kortsiktig gjeld", types: ["AS"], desc: "Avsatt forpliktelse for revisjonshonorar som er påløpt men ikke fakturert.", ex: "Påløpt revisorhonorar" },
  { n: "2983", name: "Avsetning regnskapshonorar", group: "29 Annen kortsiktig gjeld", types: ["AS","ENK"], desc: "Avsatt forpliktelse for regnskapsførerens honorar som er påløpt men ikke fakturert.", ex: "Påløpt regnskapshonorar" },
  { n: "2989", name: "Avsetning andre forpliktelser", group: "29 Annen kortsiktig gjeld", types: ["AS","ENK"], desc: "Avsetninger for diverse kortsiktige forpliktelser som ikke dekkes av andre kontoer.", ex: "Avsatt for garantiarbeid, diverse avsetninger" },
  { n: "2990", name: "Annen kortsiktig gjeld", group: "29 Annen kortsiktig gjeld", types: ["AS","ENK"], desc: "Diverse kortsiktig gjeld som ikke passer i andre underkontoer.", ex: "Mellomværende, avrundingsdifferanser" },

  // ===== KLASSE 3: SALGSINNTEKTER =====

  // 30 – Salgsinntekt avgiftspliktig
  { n: "3000", name: "Salgsinntekt avgiftspliktig", group: "30 Salgsinntekt avgiftspliktig", types: ["AS","ENK","Landbruk"], desc: "Hovedkonto for salgsinntekter med standard MVA-sats på 25 %. Brukes for det meste av vare- og tjenestesalg innenlands.", ex: "Butikksalg, nettbutikksalg, grossistsalg" },
  { n: "3001", name: "Salgsinntekt avgiftspliktig middels sats", group: "30 Salgsinntekt avgiftspliktig", types: ["AS","ENK","Landbruk"], desc: "Salgsinntekter med redusert MVA-sats på 15 %, hovedsakelig næringsmidler.", ex: "Matvaresalg, serveringsvirksomhet" },
  { n: "3002", name: "Salgsinntekt avgiftspliktig lav sats", group: "30 Salgsinntekt avgiftspliktig", types: ["AS","ENK"], desc: "Salgsinntekter med lav MVA-sats på 12 % for persontransport, kino, overnatting og idrettsarrangementer.", ex: "Billettsalg, hotellovernatting, kinobillett" },
  { n: "3010", name: "Salgsinntekt varer avgiftspliktig", group: "30 Salgsinntekt avgiftspliktig", types: ["AS","ENK","Landbruk"], desc: "Spesifikk konto for varesalg med MVA. Brukes dersom bedriften ønsker å skille vare- og tjenesteinntekter.", ex: "Varesalg i butikk, produktsalg" },
  { n: "3011", name: "Salgsinntekt avgiftspliktig råfisk", group: "30 Salgsinntekt avgiftspliktig", types: ["AS","ENK"], desc: "Salgsinntekter fra førstehåndssalg av råfisk underlagt Råfiskloven.", ex: "Fiskesalg, torskesalg" },
  { n: "3020", name: "Salgsinntekt tjenester avgiftspliktig", group: "30 Salgsinntekt avgiftspliktig", types: ["AS","ENK"], desc: "Inntekter fra salg av tjenester med MVA. Skiller tjenesteinntekter fra varesalg.", ex: "Konsulenttimer, reparasjonstjenester, rådgivning" },
  { n: "3030", name: "Salgsinntekt handelsvarer avgiftspliktig", group: "30 Salgsinntekt avgiftspliktig", types: ["AS","ENK"], desc: "Inntekter fra salg av varer kjøpt for videresalg uten vesentlig bearbeiding.", ex: "Videresalg av importvarer, grossisthandel" },
  { n: "3035", name: "Salgsinntekt handelsvarer avgiftspliktig (2)", group: "30 Salgsinntekt avgiftspliktig", types: ["AS","ENK"], desc: "Ekstra underkonto for handelsvarer dersom bedriften trenger ytterligere inndeling.", ex: "Spesifikk varekategori" },
  { n: "3040", name: "Salgsinntekt varer avgiftspliktig (2)", group: "30 Salgsinntekt avgiftspliktig", types: ["AS","ENK","Landbruk"], desc: "Tilleggskonto for varesalg ved behov for ytterligere segmentering av inntektene.", ex: "Sekundært varesalg" },
  { n: "3050", name: "Salgsinntekt tjenester avgiftspliktig (2)", group: "30 Salgsinntekt avgiftspliktig", types: ["AS","ENK"], desc: "Tilleggskonto for tjenestesalg ved behov for ytterligere segmentering.", ex: "Sekundære tjenesteinntekter" },
  { n: "3059", name: "Opptjent ikke fakturert inntekt", group: "30 Salgsinntekt avgiftspliktig", types: ["AS","ENK"], desc: "Inntekter som er opptjent i perioden men ennå ikke fakturert. Periodiseres for korrekt resultat.", ex: "Pågående prosjekt, timer ikke fakturert" },
  { n: "3060", name: "Uttak av varer/tjenester", group: "30 Salgsinntekt avgiftspliktig", types: ["AS","ENK"], desc: "Privat bruk av bedriftens varer eller tjenester av eier eller ansatte. Skal avgiftsberegnes som vanlig salg.", ex: "Eiers uttak av varer, privat bruk av tjenester" },
  { n: "3061", name: "Uttak av varer/tjenester middels sats", group: "30 Salgsinntekt avgiftspliktig", types: ["AS","ENK"], desc: "Uttak av varer eller tjenester som avgiftsberegnes med middels sats.", ex: "Uttak av matvarer til eget bruk" },
  { n: "3062", name: "Uttak av varer/tjenester lav sats", group: "30 Salgsinntekt avgiftspliktig", types: ["AS","ENK"], desc: "Uttak som avgiftsberegnes med lav sats.", ex: "Privat bruk av transporttjenester" },
  { n: "3063", name: "Motkonto uttak av varer/tjenester", group: "30 Salgsinntekt avgiftspliktig", types: ["AS","ENK"], desc: "Motkonto som brukes for å nullstille resultateffekten av uttaksbokføringen.", ex: "Motkonto for uttak" },
  { n: "3070", name: "Uttak av tjenester avgiftspliktig", group: "30 Salgsinntekt avgiftspliktig", types: ["AS","ENK"], desc: "Eget arbeid på eiendom eller for privat formål som må avgiftsberegnes.", ex: "Eget arbeid på bolig, privat bruk av bedriftens tjenester" },
  { n: "3071", name: "Uttak av tjenester avgiftspliktig høy sats", group: "30 Salgsinntekt avgiftspliktig", types: ["AS","ENK"], desc: "Uttak av tjenester som avgiftsberegnes med standard 25 % sats.", ex: "Eget byggearbeid, privat bruk av konsulenttjenester" },
  { n: "3074", name: "Uttak av tjenester avgiftspliktig lav sats", group: "30 Salgsinntekt avgiftspliktig", types: ["AS","ENK"], desc: "Uttak av tjenester som avgiftsberegnes med lav 12 % sats.", ex: "Privat bruk av transporttjenester" },
  { n: "3080", name: "Rabatt og annen salgsinntektsreduksjon", group: "30 Salgsinntekt avgiftspliktig", types: ["AS","ENK"], desc: "Prisavslag, returer og reklamasjoner som reduserer brutto salgsinntekt.", ex: "Kvantumsrabatt, kampanjerabatt, retur" },
  { n: "3090", name: "Opptjent ikke fakturert inntekt (alt)", group: "30 Salgsinntekt avgiftspliktig", types: ["AS","ENK"], desc: "Alternativ periodiseringskonto for opptjente inntekter som ikke er fakturert.", ex: "Periodisert inntekt" },
  { n: "3092", name: "Motkonto salgsinntekt avgiftspliktig", group: "30 Salgsinntekt avgiftspliktig", types: ["AS","ENK"], desc: "Motkonto brukt for interne avstemminger og korreksjoner av avgiftspliktig inntekt.", ex: "Avrunding, korreksjon" },
  { n: "3094", name: "Motkonto salgsinntekt middels sats", group: "30 Salgsinntekt avgiftspliktig", types: ["AS","ENK"], desc: "Motkonto for avstemming av inntekter med middels MVA-sats.", ex: "Korreksjon middels sats" },
  { n: "3095", name: "Motkonto salgsinntekt høy sats", group: "30 Salgsinntekt avgiftspliktig", types: ["AS","ENK"], desc: "Motkonto for avstemming av inntekter med høy MVA-sats.", ex: "Korreksjon høy sats" },

  // 31 – Salgsinntekt avgiftsfri
  { n: "3100", name: "Salgsinntekt avgiftsfri", group: "31 Salgsinntekt avgiftsfri", types: ["AS","ENK"], desc: "Inntekter fra salg av varer og tjenester som er unntatt merverdiavgift etter merverdiavgiftsloven.", ex: "Helsetjenester, undervisning, finanstjenester" },
  { n: "3107", name: "Salgsinntekt utførsel avgiftsfri", group: "31 Salgsinntekt avgiftsfri", types: ["AS","ENK"], desc: "Eksportsalg av varer og tjenester som er fritatt for MVA med nullsats.", ex: "Eksport til EU, varesalg til utlandet" },
  { n: "3108", name: "Salgsinntekt gull og klimakvoter avgiftsfri", group: "31 Salgsinntekt avgiftsfri", types: ["AS"], desc: "Salg av investeringsgull og klimakvoter som er fritatt fra avgiftsplikt.", ex: "Gullhandel, kvoteomsetning" },
  { n: "3110", name: "Salgsinntekt varer innenlands", group: "31 Salgsinntekt avgiftsfri", types: ["AS","ENK"], desc: "Avgiftsfritt varesalg innenlands, for eksempel brukte varer solgt uten MVA.", ex: "Salg av brukte eiendeler" },
  { n: "3120", name: "Salgsinntekt tjenester innenlands", group: "31 Salgsinntekt avgiftsfri", types: ["AS","ENK"], desc: "Avgiftsfrie tjenesteinntekter i Norge, typisk innen helse, utdanning og kultur.", ex: "Legetjenester, kursvirksomhet" },
  { n: "3125", name: "Salgsinntekt tjenester utførsel", group: "31 Salgsinntekt avgiftsfri", types: ["AS","ENK"], desc: "Tjenesteinntekter fra oppdrag utenfor Norge med nullsats for MVA.", ex: "Konsulentoppdrag i utlandet" },
  { n: "3160", name: "Uttak av varer/tjenester avgiftsfri", group: "31 Salgsinntekt avgiftsfri", types: ["AS","ENK"], desc: "Privat bruk av varer eller tjenester som i utgangspunktet er avgiftsfrie.", ex: "Eget bruk av avgiftsfrie produkter" },
  { n: "3170", name: "Uttak av tjenester avgiftsfritt", group: "31 Salgsinntekt avgiftsfri", types: ["AS","ENK"], desc: "Privat bruk av tjenester som er unntatt merverdiavgift.", ex: "Privat bruk av undervisningstjenester" },
  { n: "3180", name: "Rabatt og salgsinntektsreduksjon avgiftsfri", group: "31 Salgsinntekt avgiftsfri", types: ["AS","ENK"], desc: "Prisavslag og returer knyttet til avgiftsfrie salg.", ex: "Rabatt på avgiftsfrie varer" },
  { n: "3190", name: "Opptjent ikke fakturert inntekt avgiftsfri", group: "31 Salgsinntekt avgiftsfri", types: ["AS","ENK"], desc: "Periodisering av opptjente avgiftsfrie inntekter.", ex: "Påløpt avgiftsfri tjenesteinntekt" },
  { n: "3195", name: "Motkonto salgsinntekt avgiftsfri", group: "31 Salgsinntekt avgiftsfri", types: ["AS","ENK"], desc: "Motkonto for avstemming av avgiftsfrie inntekter.", ex: "Korreksjon avgiftsfri inntekt" },
  { n: "3197", name: "Motkonto salgsinntekt utførsel avgiftsfri", group: "31 Salgsinntekt avgiftsfri", types: ["AS","ENK"], desc: "Motkonto for eksportinntekter fritatt fra avgift.", ex: "Motkonto eksportinntekt" },
  { n: "3198", name: "Motkonto salgsinntekt gull/klimakvoter", group: "31 Salgsinntekt avgiftsfri", types: ["AS"], desc: "Motkonto for inntekter fra salg av gull og klimakvoter.", ex: "Motkonto gullomsetning" },

  // 32 – Salgsinntekt utenfor avgiftsområdet
  { n: "3200", name: "Salgsinntekt utenfor avgiftsområdet", group: "32 Utenfor avgiftsområdet", types: ["AS","ENK"], desc: "Inntekter fra aktiviteter som faller helt utenfor merverdiavgiftslovens virkeområde.", ex: "Utleieinntekt bolig, salg av fast eiendom" },
  { n: "3210", name: "Salgsinntekt egentilvirkede varer utenfor avgiftsområdet", group: "32 Utenfor avgiftsområdet", types: ["AS","ENK"], desc: "Salg av egenproduserte varer som faller utenfor MVA-området.", ex: "Salg av egenkunst, håndverk utenfor MVA" },
  { n: "3220", name: "Salgsinntekt tjenester utenfor avgiftsområdet", group: "32 Utenfor avgiftsområdet", types: ["AS","ENK"], desc: "Tjenesteinntekter som faller utenfor MVA-lovens virkeområde.", ex: "Utleietjenester utenfor MVA" },
  { n: "3260", name: "Uttak av varer/tjenester utenfor avgiftsområdet", group: "32 Utenfor avgiftsområdet", types: ["AS","ENK"], desc: "Privat bruk av varer eller tjenester som faller utenfor MVA-området.", ex: "Eget bruk av utleietjenester" },
  { n: "3280", name: "Rabatter utenfor avgiftsområdet", group: "32 Utenfor avgiftsområdet", types: ["AS","ENK"], desc: "Prisavslag og returer knyttet til salg utenfor avgiftsområdet.", ex: "Rabatt på boligutleie" },
  { n: "3290", name: "Opptjent ikke fakturert inntekt utenfor MVA", group: "32 Utenfor avgiftsområdet", types: ["AS","ENK"], desc: "Periodisering av opptjente inntekter utenfor avgiftsområdet.", ex: "Påløpt utleieinntekt" },
  { n: "3295", name: "Motkonto utenfor avgiftsområdet", group: "32 Utenfor avgiftsområdet", types: ["AS","ENK"], desc: "Motkonto for avstemming av inntekter utenfor MVA-området.", ex: "Korreksjon avgiftsfri utleie" },

  // 33 – Offentlig avgift vedrørende omsetning
  { n: "3300", name: "Spesiell offentlig avgift for tilvirkede/solgte varer", group: "33 Offentlige avgifter omsetning", types: ["AS","ENK"], desc: "Særavgifter knyttet til produksjon og salg av bestemte varer, som sukkeravgift og alkoholavgift.", ex: "Sukkeravgift, alkoholavgift, tobakksavgift" },

  // 34 – Offentlig tilskudd/refusjon
  { n: "3400", name: "Spesielt offentlig tilskudd for varer", group: "34 Offentlige tilskudd", types: ["AS","ENK","Landbruk"], desc: "Målrettede tilskudd fra stat eller kommune knyttet til produksjon eller salg av bestemte varer.", ex: "Produksjonstilskudd, arealtilskudd" },
  { n: "3440", name: "Spesielt offentlig tilskudd for tjenester", group: "34 Offentlige tilskudd", types: ["AS","ENK"], desc: "Offentlige tilskudd rettet mot bestemte tjenesteområder.", ex: "Kulturtilskudd, transporttilskudd" },

  // 36 – Leieinntekt
  { n: "3600", name: "Leieinntekt fast eiendom avgiftspliktig", group: "36 Leieinntekter", types: ["AS","ENK","Landbruk"], desc: "Leieinntekter fra utleie av næringseiendom der utleier er frivillig registrert i MVA-registeret.", ex: "Utleie av kontorlokaler, lagerlokaler" },
  { n: "3605", name: "Leieinntekt fast eiendom utenfor avgiftsområdet", group: "36 Leieinntekter", types: ["AS","ENK"], desc: "Utleieinntekter fra eiendom som ikke er registrert for MVA, typisk boligutleie.", ex: "Boligutleie, fritidseiendom" },
  { n: "3610", name: "Leieinntekt driftsmidler avgiftspliktig", group: "36 Leieinntekter", types: ["AS","ENK"], desc: "Inntekter fra utleie av maskiner, kjøretøy og annet utstyr med MVA.", ex: "Maskinutleie, bilutleie" },
  { n: "3615", name: "Leieinntekt driftsmidler avgiftsfri", group: "36 Leieinntekter", types: ["AS","ENK"], desc: "Utleieinntekter fra driftsmidler som er fritatt for MVA.", ex: "Avgiftsfri utstyrsleie" },
  { n: "3620", name: "Annen leieinntekt", group: "36 Leieinntekter", types: ["AS","ENK","Landbruk"], desc: "Leieinntekter som ikke passer i andre underkontoer.", ex: "Utleie av parkeringsplass, garasje" },
  { n: "3690", name: "Opptjent ikke fakturert leieinntekt", group: "36 Leieinntekter", types: ["AS","ENK"], desc: "Periodisering av leieinntekter som er opptjent men ennå ikke fakturert.", ex: "Påløpt husleie" },

  // 37 – Provisjonsinntekt
  { n: "3700", name: "Provisjonsinntekt avgiftspliktig", group: "37 Provisjonsinntekter", types: ["AS","ENK"], desc: "Provisjoner og formidlingsgodtgjørelser mottatt for å selge andres produkter eller tjenester.", ex: "Agentprovisjon, meglergodtgjørelse" },
  { n: "3701", name: "Provisjonsinntekt avgiftspliktig høy sats", group: "37 Provisjonsinntekter", types: ["AS","ENK"], desc: "Provisjonsinntekter med standard MVA-sats på 25 %.", ex: "Salgsprovisjon med MVA" },
  { n: "3705", name: "Provisjonsinntekt avgiftsfri", group: "37 Provisjonsinntekter", types: ["AS","ENK"], desc: "Provisjoner som er fritatt for MVA, typisk innen forsikring og finans.", ex: "Forsikringsprovisjon, finansformidling" },
  { n: "3710", name: "Provisjonsinntekt utenfor avgiftsområdet", group: "37 Provisjonsinntekter", types: ["AS","ENK"], desc: "Provisjoner fra aktiviteter som faller utenfor MVA-lovens virkeområde.", ex: "Eiendomsmegling utenfor MVA" },
  { n: "3790", name: "Opptjent ikke fakturert provisjon", group: "37 Provisjonsinntekter", types: ["AS","ENK"], desc: "Provisjonsinntekter som er opptjent men ennå ikke fakturert ved periodeslutt.", ex: "Påløpt meglergodtgjørelse" },

  // 38 – Gevinst ved avgang av anleggsmidler
  { n: "3800", name: "Salgssum anleggsmidler avgiftspliktig", group: "38 Gevinst anleggsmidler", types: ["AS","ENK"], desc: "Salgsvederlag ved avhending av driftsmidler som er avgiftspliktige. Gevinst eller tap beregnes mot bokført verdi.", ex: "Salg av maskiner, salg av varebil" },
  { n: "3805", name: "Salgssum anleggsmidler avgiftsfri", group: "38 Gevinst anleggsmidler", types: ["AS","ENK"], desc: "Salgsvederlag ved salg av driftsmidler som er fritatt for MVA.", ex: "Salg av personbil, avgiftsfritt utstyr" },
  { n: "3807", name: "Salgssum anleggsmidler utenfor avgiftsområdet", group: "38 Gevinst anleggsmidler", types: ["AS","ENK"], desc: "Salgsvederlag for driftsmidler der salget faller utenfor MVA-lovens virkeområde.", ex: "Salg av eiendom" },
  { n: "3809", name: "Motkonto balanseverdi solgte anleggsmidler", group: "38 Gevinst anleggsmidler", types: ["AS","ENK"], desc: "Motkonto som føres med bokført verdi av solgte driftsmidler for å beregne gevinst eller tap.", ex: "Nedskriving av solgt eiendel" },
  { n: "3850", name: "Verdiendringer investeringseiendommer", group: "38 Gevinst anleggsmidler", types: ["AS"], desc: "Oppskrivning eller nedskrivning av investeringseiendom ved bruk av virkelig verdi.", ex: "Verdistigning næringseiendommer" },
  { n: "3870", name: "Verdiendringer biologiske eiendeler", group: "38 Gevinst anleggsmidler", types: ["Landbruk"], desc: "Verdiendringer på levende dyr og planter vurdert til virkelig verdi.", ex: "Verdiendring husdyrbesetning, stående skog" },

  // 39 – Annen driftsrelatert inntekt
  { n: "3900", name: "Annen driftsrelatert inntekt", group: "39 Andre driftsinntekter", types: ["AS","ENK","Landbruk"], desc: "Diverse driftsinntekter som ikke stammer fra ordinært salg av varer eller tjenester.", ex: "Sponsorinntekter, erstatningsoppgjør, diverse inntekter" },
  { n: "3910", name: "Porto pliktig ved salg", group: "39 Andre driftsinntekter", types: ["AS","ENK"], desc: "Porto og frakttillegg som faktureres kunder og som er avgiftspliktige.", ex: "Frakttillegg på faktura" },
  { n: "3950", name: "Ekspedisjonsgebyr fritt", group: "39 Andre driftsinntekter", types: ["AS","ENK"], desc: "Ekspedisjons- og behandlingsgebyr som faktureres kunder uten MVA.", ex: "Gebyr for ordrebehandling" },
  { n: "3960", name: "Porto fritt ved salg", group: "39 Andre driftsinntekter", types: ["AS","ENK"], desc: "Portotillegg på faktura som ikke er avgiftspliktig.", ex: "Avgiftsfri fraktkostnad på faktura" },
  { n: "3990", name: "Annen driftsrelatert inntekt skattefri", group: "39 Andre driftsinntekter", types: ["AS","ENK"], desc: "Driftsinntekter som er fritatt fra inntektsbeskatning.", ex: "Skattefri gevinst, fritak etter særregler" },

  // ===== KLASSE 4: VAREKOSTNAD =====

  // 40 – Forbruk av råvarer
  { n: "4000", name: "Innkjøp av råvarer og halvfabrikater", group: "40 Råvarekostnad", types: ["AS","ENK","Landbruk"], desc: "Materialer som går direkte inn i bedriftens produksjon av ferdigvarer.", ex: "Trelast, metall, stoff, ingredienser" },
  { n: "4060", name: "Frakt toll og spedisjon råvarer", group: "40 Råvarekostnad", types: ["AS","ENK"], desc: "Transport- og tollkostnader ved import og frakt av råvarer til produksjon.", ex: "Fraktkostnad på råvarer, toll ved import" },
  { n: "4070", name: "Innkjøpsprisreduksjon råvarer", group: "40 Råvarekostnad", types: ["AS","ENK"], desc: "Rabatter og prisavslag mottatt fra leverandører av råvarer. Reduserer varekostnaden.", ex: "Kvantumsrabatt, årsbonus fra leverandør" },
  { n: "4090", name: "Beholdningsendring råvarer", group: "40 Råvarekostnad", types: ["AS","ENK","Landbruk"], desc: "Justering for endring i lagerbeholdning av råvarer mellom periodens start og slutt.", ex: "Varetelling råvarer, lagerendring" },

  // 41 – Forbruk av varer under tilvirkning
  { n: "4100", name: "Innkjøp av varer under tilvirkning", group: "41 Varer under tilvirkning", types: ["AS","ENK","Landbruk"], desc: "Halvferdige produkter og komponenter som er i en mellomfase av produksjonen.", ex: "Halvfabrikata, delmonterte produkter" },
  { n: "4160", name: "Frakt toll og spedisjon tilvirkning", group: "41 Varer under tilvirkning", types: ["AS","ENK"], desc: "Fraktkostnader knyttet til transport av varer i tilvirkning.", ex: "Frakt mellom produksjonssteder" },
  { n: "4170", name: "Innkjøpsprisreduksjon tilvirkning", group: "41 Varer under tilvirkning", types: ["AS","ENK"], desc: "Rabatter på innkjøp av halvferdige varer.", ex: "Leverandørrabatt på halvfabrikata" },
  { n: "4190", name: "Beholdningsendring under arbeid", group: "41 Varer under tilvirkning", types: ["AS","ENK"], desc: "Endring i verdien av varer under tilvirkning mellom periodeslutt.", ex: "Lagerverdi halvferdige produkter" },

  // 42 – Forbruk av ferdig tilvirkede varer
  { n: "4200", name: "Innkjøp ferdig egentilvirkede varer", group: "42 Ferdig tilvirkede varer", types: ["AS","ENK"], desc: "Innkjøp av ferdigproduserte varer med høy MVA-sats. Brukes ved supplering av egenproduksjon med innkjøpte ferdigvarer.", ex: "Supplementvarer, ferdige produkter" },
  { n: "4260", name: "Frakt toll og spedisjon ferdigvarer", group: "42 Ferdig tilvirkede varer", types: ["AS","ENK"], desc: "Fraktkostnader knyttet til transport av ferdig tilvirkede varer.", ex: "Frakt av ferdigvarer til lager" },
  { n: "4270", name: "Innkjøpsprisreduksjon avgiftspliktig", group: "42 Ferdig tilvirkede varer", types: ["AS","ENK"], desc: "Rabatter mottatt på innkjøp av avgiftspliktige ferdigvarer.", ex: "Volumrabatt, kampanjerabatt fra leverandør" },
  { n: "4290", name: "Beholdningsendring ferdigvarer", group: "42 Ferdig tilvirkede varer", types: ["AS","ENK"], desc: "Endring i lagerbeholdning av ferdig tilvirkede varer.", ex: "Varetelling ferdigvarer" },

  // 43 – Forbruk av innkjøpte varer for videresalg
  { n: "4300", name: "Innkjøp varer for videresalg høy sats", group: "43 Varer for videresalg", types: ["AS","ENK"], desc: "Innkjøp av handelsvarer for videresalg med standard 25 % MVA-sats.", ex: "Grossistinnkjøp, innkjøp til butikk" },
  { n: "4301", name: "Innkjøp varer for videresalg middels sats", group: "43 Varer for videresalg", types: ["AS","ENK"], desc: "Innkjøp av matvarer for videresalg med redusert 15 % MVA-sats.", ex: "Dagligvareinnkjøp, næringsmidler" },
  { n: "4360", name: "Frakt toll og spedisjon videresalg", group: "43 Varer for videresalg", types: ["AS","ENK"], desc: "Fraktkostnader knyttet til innkjøp av varer for videresalg.", ex: "Frakt fra grossist, tollgebyr" },
  { n: "4370", name: "Innkjøpsprisreduksjon videresalg", group: "43 Varer for videresalg", types: ["AS","ENK"], desc: "Rabatter og prisavslag fra leverandører av handelsvarer.", ex: "Årsbonus, etterbetaling, kampanjerabatt" },
  { n: "4380", name: "Grunnlag merverdiavgift ved innførsel", group: "43 Varer for videresalg", types: ["AS","ENK"], desc: "Tollverdi som danner grunnlag for beregning av importmoms på varer for videresalg.", ex: "Importverdi, tollverdi" },
  { n: "4390", name: "Beholdningsendring videresalg", group: "43 Varer for videresalg", types: ["AS","ENK"], desc: "Endring i lagerbeholdning av varer for videresalg.", ex: "Varetelling handelsvarer" },

  // 44 – Innkjøp varer utland
  { n: "4400", name: "Innkjøp av varer for videresalg utland", group: "44 Varer utland", types: ["AS","ENK"], desc: "Varekjøp fra utenlandske leverandører for videresalg. Importmoms beregnes ved grensepassering eller via snudd avregning.", ex: "Import fra Kina, EU-import, grossistimport" },

  // 45 – Fremmedytelse og underentreprise
  { n: "4500", name: "Fremmedytelser og underentrepriser", group: "45 Fremmedytelser", types: ["AS","ENK"], desc: "Kostnader for arbeid utført av underentreprenører og underleverandører som en del av bedriftens leveranse.", ex: "UE-kostnad, underleverandørarbeid" },
  { n: "4520", name: "Underentreprenører opplysningspliktige", group: "45 Fremmedytelser", types: ["AS","ENK"], desc: "Betalinger til underentreprenører som er opplysningspliktige i a-meldingen.", ex: "Innrapportert UE-arbeid" },
  { n: "4590", name: "Beholdningsendring fremmedytelser", group: "45 Fremmedytelser", types: ["AS","ENK"], desc: "Endring i verdien av pågående arbeid utført av underentreprenører.", ex: "Pågående UE-prosjekt" },
  { n: "4598", name: "Motkonto interne avvik", group: "45 Fremmedytelser", types: ["AS","ENK"], desc: "Motkonto for interne prisavvik og kostnadsforskjeller.", ex: "Avviksrapportering, internkostnad" },
  { n: "4599", name: "Annen konto for avvik/avrunding", group: "45 Fremmedytelser", types: ["AS","ENK"], desc: "Diverse avvik og avrundingsdifferanser i varekostnaden.", ex: "Øredifferanser, avrunding" },

  // ===== KLASSE 5: LØNNSKOSTNADER =====

  // 50 – Lønn til ansatte
  { n: "5000", name: "Lønn til ansatte", group: "50 Lønn", types: ["AS","ENK"], desc: "Brutto fastlønn, timelønn og alle faste tillegg til bedriftens ansatte. Hovedkontoen for lønnskostnader.", ex: "Månedslønn, timelønn, overtid" },
  { n: "5020", name: "Feriepenger", group: "50 Lønn", types: ["AS","ENK"], desc: "Kostnadsføring av opptjente feriepenger i perioden. Normalt 10,2 % av feriepengegrunnlaget, 12 % for ansatte over 60.", ex: "Avsetning feriepenger, feriepengeutbetaling" },
  { n: "5090", name: "Påløpt ikke utbetalt lønn", group: "50 Lønn", types: ["AS","ENK"], desc: "Lønn som er opptjent i perioden men ennå ikke utbetalt. Periodiseres for korrekt kostnadsføring.", ex: "Opptjent lønn, periodisering" },
  { n: "5095", name: "Periodisering av lønn", group: "50 Lønn", types: ["AS","ENK"], desc: "Justering av lønnskostnader mellom perioder for å matche korrekt regnskapsperiode.", ex: "Avgrensning lønn, periodisering" },
  { n: "5096", name: "Periodisering av feriepenger", group: "50 Lønn", types: ["AS","ENK"], desc: "Periodisering av feriepengekostnaden for å fordele den riktig over regnskapsperiodene.", ex: "Avgrensning feriepenger" },
  { n: "5099", name: "Andre lønnsperiodiseringer", group: "50 Lønn", types: ["AS","ENK"], desc: "Diverse periodiseringsposter knyttet til lønnskostnader som ikke dekkes av andre kontoer.", ex: "Bonusavsetning, periodisert overtid" },

  // 52 – Fordel i arbeidsforhold
  { n: "5200", name: "Fri bil", group: "52 Naturalytelser", types: ["AS","ENK"], desc: "Skattepliktig fordel for ansatte som disponerer firmabil til privat bruk. Beregnes etter faste regler basert på listepris.", ex: "Firmabilordning, privatkjøring" },
  { n: "5210", name: "Fri telefon", group: "52 Naturalytelser", types: ["AS","ENK"], desc: "Skattepliktig fordel når arbeidsgiver dekker ansattes elektroniske kommunikasjon. Fast sjablong brukes for beskatning.", ex: "Dekket mobilabonnement, bedriftsmobil" },
  { n: "5220", name: "Fri avis", group: "52 Naturalytelser", types: ["AS","ENK"], desc: "Skattepliktig fordel dersom avisabonnement dekkes av arbeidsgiver uten at det er nødvendig for arbeidet.", ex: "Avisabonnement dekket av arbeidsgiver" },
  { n: "5230", name: "Fri kost losji og bolig", group: "52 Naturalytelser", types: ["AS","ENK","Landbruk"], desc: "Skattepliktig fordel når arbeidsgiver gir gratis mat, overnatting eller bolig til ansatte.", ex: "Personalbolig, fri kantine, losji" },
  { n: "5240", name: "Rentefordel", group: "52 Naturalytelser", types: ["AS"], desc: "Skattepliktig fordel når ansatte får lån fra arbeidsgiver til rente under normrenten fastsatt av Skatteetaten.", ex: "Rimelig boliglån fra arbeidsgiver" },
  { n: "5251", name: "Gruppelivsforsikring opplysningspliktig", group: "52 Naturalytelser", types: ["AS","ENK"], desc: "Arbeidsgiveravgiftspliktig gruppelivsforsikring for ansatte som overstiger fribeløpsgrensene.", ex: "Gruppelivsforsikring utover fritak" },
  { n: "5252", name: "Ulykkesforsikring opplysningspliktig", group: "52 Naturalytelser", types: ["AS","ENK"], desc: "Ulykkesforsikring for ansatte som er arbeidsgiveravgiftspliktig og opplysningspliktig.", ex: "Fritidsulykkeforsikring" },
  { n: "5280", name: "Annen fordel i arbeidsforhold", group: "52 Naturalytelser", types: ["AS","ENK"], desc: "Øvrige skattepliktige fordeler til ansatte som ikke dekkes av andre underkontoer.", ex: "Treningsavtale, personalrabatt utover fritak" },
  { n: "5281", name: "Annen fordel opplysningspliktig ikke AGA", group: "52 Naturalytelser", types: ["AS","ENK"], desc: "Fordeler som er opplysningspliktige men ikke grunnlag for arbeidsgiveravgift.", ex: "Skattefri gave, jubileumsgave innenfor grenser" },
  { n: "5290", name: "Motkonto for gruppe 52", group: "52 Naturalytelser", types: ["AS","ENK"], desc: "Motkonto som brukes for å nullstille resultateffekten av naturalytelser der de bokføres et annet sted.", ex: "Motkonto naturalytelser" },

  // 53 – Annen oppgavepliktig godtgjørelse
  { n: "5330", name: "Godtgjørelse til styre og bedriftsforsamling", group: "53 Oppgavepliktig godtgjørelse", types: ["AS"], desc: "Honorar til styremedlemmer og bedriftsforsamling. Behandles som lønn og er trekkpliktig.", ex: "Styrehonorar, møtegodtgjørelse" },
  { n: "5390", name: "Annen oppgavepliktig godtgjørelse", group: "53 Oppgavepliktig godtgjørelse", types: ["AS","ENK"], desc: "Andre godtgjørelser som er trekkpliktige og opplysningspliktige.", ex: "Konsulenthonorar til privatperson" },
  { n: "5395", name: "Annen oppgavepliktig godtgjørelse trekkfri", group: "53 Oppgavepliktig godtgjørelse", types: ["AS","ENK"], desc: "Godtgjørelser som er opplysningspliktige men trekkfrie.", ex: "Trekkfrie utbetalinger" },

  // 54 – Arbeidsgiveravgift og pensjonskostnad
  { n: "5400", name: "Arbeidsgiveravgift", group: "54 Arbeidsgiveravgift", types: ["AS","ENK"], desc: "Lovpålagt avgift beregnet av brutto lønnsutbetalinger. Satsen varierer etter geografisk sone, fra 0 % til 14,1 %.", ex: "AGA, arbeidsgiveravgift av lønn" },
  { n: "5401", name: "Arbeidsgiveravgift av opptjente feriepenger", group: "54 Arbeidsgiveravgift", types: ["AS","ENK"], desc: "AGA beregnet av den periodiserte feriepengekostnaden for å matche kostnadsperioden.", ex: "AGA på feriepengeavsetning" },
  { n: "5405", name: "Arbeidsgiveravgift av andre påløpte lønnskostnader", group: "54 Arbeidsgiveravgift", types: ["AS","ENK"], desc: "AGA beregnet på andre påløpte lønnsforpliktelser som bonuser og tillegg.", ex: "AGA på bonus, AGA på tillegg" },
  { n: "5420", name: "Innberetningspliktig pensjonskostnad", group: "54 Arbeidsgiveravgift", types: ["AS","ENK"], desc: "Bedriftens pensjonskostnader som er innberetningspliktige, typisk OTP og andre pensjonsordninger.", ex: "OTP-premie, pensjonsinnskudd" },
  { n: "5430", name: "Finansskatt av lønn", group: "54 Arbeidsgiveravgift", types: ["AS"], desc: "Ekstra arbeidsgiveravgift (5 %) for finansforetak beregnet av lønnsgrunnlaget.", ex: "Finansskatt, ekstra AGA for banker" },
  { n: "5431", name: "Finansskatt av påløpt ferielønn", group: "54 Arbeidsgiveravgift", types: ["AS"], desc: "Finansskatt beregnet av periodiserte feriepenger for ansatte i finansforetak.", ex: "Finansskatt på feriepengeavsetning" },
  { n: "5495", name: "Periodisering av arbeidsgiveravgift", group: "54 Arbeidsgiveravgift", types: ["AS","ENK"], desc: "Periodisering av AGA mellom regnskapsperioder for å matche lønnskostnaden.", ex: "Avgrensning AGA" },
  { n: "5496", name: "Periodisering av AGA opptjente feriepenger", group: "54 Arbeidsgiveravgift", types: ["AS","ENK"], desc: "Periodisering av AGA-kostnad knyttet til feriepengeavsetningen.", ex: "AGA-avgrensning feriepenger" },

  // 55 – Sosiale kostnader
  { n: "5500", name: "Annen kostnadsgodtgjørelse", group: "55 Sosiale kostnader", types: ["AS","ENK"], desc: "Diverse kostnadsgodtgjørelser til ansatte som er opplysningspliktige.", ex: "Bilgodtgjørelse, verktøygodtgjørelse" },
  { n: "5510", name: "Trekkpliktig del reise", group: "55 Sosiale kostnader", types: ["AS","ENK"], desc: "Den trekkpliktige delen av reisegodtgjørelse som overstiger statens satser.", ex: "Overskytende diettsats, trekkpliktig reise" },

  // 56 – Arbeidsgodtgjørelse til eiere
  { n: "5600", name: "Arbeidsgodtgjørelse til eiere i ANS o.l.", group: "56 Eiergodtgjørelse", types: ["ENK"], desc: "Godtgjørelse for eiers arbeidsinnsats i ansvarlige selskaper og enkeltpersonforetak. Behandles ikke som lønn men som næringsinntekt.", ex: "Arbeidsvederlag ANS, arbeidsgodtgjørelse DA" },

  // 57 – Offentlig tilskudd vedrørende arbeidskraft
  { n: "5700", name: "Lærlingtilskudd", group: "57 Lønnstilskudd", types: ["AS","ENK"], desc: "Tilskudd mottatt fra fylkeskommunen for å ha lærlinger i bedriften. Reduserer netto lønnskostnad.", ex: "Lærlingtilskudd, basistilskudd" },
  { n: "5720", name: "Annet lønnstilskudd", group: "57 Lønnstilskudd", types: ["AS","ENK"], desc: "Andre offentlige tilskudd som reduserer bedriftens lønnskostnader.", ex: "Inkluderingstilskudd, lønnstilskudd fra NAV" },

  // 58 – Offentlig refusjon vedrørende arbeidskraft
  { n: "5800", name: "Refusjon av sykepenger", group: "58 Refusjoner", types: ["AS","ENK"], desc: "Tilbakebetaling fra NAV for sykepenger som bedriften har forskuttert i arbeidsgiverperioden på 16 dager.", ex: "Sykelønnsrefusjon, NAV-refusjon" },
  { n: "5820", name: "Refusjon av arbeidsgiveravgift", group: "58 Refusjoner", types: ["AS","ENK"], desc: "Tilbakebetaling av arbeidsgiveravgift knyttet til refunderte lønnskostnader.", ex: "AGA-refusjon på sykepenger" },

  // 59 – Annen personalkostnad
  { n: "5900", name: "Gaver til ansatte fradragsberettigede", group: "59 Andre personalkostnader", types: ["AS","ENK"], desc: "Gaver til ansatte som er skattefrie for mottaker og fradragsberettigede for arbeidsgiver innenfor gjeldende beløpsgrenser.", ex: "Julegave til ansatt, jubileumsgave" },
  { n: "5905", name: "Gaver til ansatte ikke fradragsberettigede", group: "59 Andre personalkostnader", types: ["AS","ENK"], desc: "Gaver til ansatte som overstiger beløpsgrensene for skattefritak og dermed ikke gir fradrag.", ex: "Verdifull gave, overskytende beløp" },
  { n: "5910", name: "Kantinekostnader", group: "59 Andre personalkostnader", types: ["AS","ENK"], desc: "Kostnader til drift av bedriftskantine eller kjøp av kantinetjenester.", ex: "Kantineleverandør, kantinevarer, kaffeavtale" },
  { n: "5912", name: "Middag ved overtid", group: "59 Andre personalkostnader", types: ["AS","ENK"], desc: "Mat til ansatte som jobber overtid. Inntil et visst beløp per person er dette skattefritt.", ex: "Overtidsmat, pizza ved kveldsarbeid" },
  { n: "5920", name: "Yrkesskadeforsikring", group: "59 Andre personalkostnader", types: ["AS","ENK"], desc: "Lovpålagt forsikring som dekker ansatte ved yrkesskader og yrkessykdommer.", ex: "Yrkesskadeforsikringspremie" },
  { n: "5930", name: "Andre forsikringer ansatte", group: "59 Andre personalkostnader", types: ["AS","ENK"], desc: "Forsikringspremier for ansatte utover lovpålagte ordninger.", ex: "Reiseforsikring, helseforsikring, behandlingsforsikring" },
  { n: "5945", name: "Pensjonsforsikring for ansatte", group: "59 Andre personalkostnader", types: ["AS","ENK"], desc: "Premie til tjenestepensjonsordning for ansatte, inkludert OTP og eventuelle tilleggsordninger.", ex: "OTP-premie, innskuddspensjon, ytelsespensjon" },
  { n: "5990", name: "Annen personalkostnad", group: "59 Andre personalkostnader", types: ["AS","ENK"], desc: "Diverse personalrelaterte kostnader som ikke passer i andre kontoer i klasse 59.", ex: "Rekruttering, bedriftshelsetjeneste, firmafest, teambuilding" },

  // ===== KLASSE 6: AVSKRIVNINGER OG DRIFTSKOSTNADER =====

  // 60 – Avskrivninger
  { n: "6000", name: "Avskrivninger bygninger og fast eiendom", group: "60 Avskrivninger", types: ["AS","ENK","Landbruk"], desc: "Årlig verdiforringelse av bygninger og fast eiendom. Saldogruppe i avskrives med inntil 2 %.", ex: "Avskrivning kontorbygg, avskrivning lagerbygg" },
  { n: "6010", name: "Avskrivninger på transportmidler", group: "60 Avskrivninger", types: ["AS","ENK","Landbruk"], desc: "Årlig avskrivning av bedriftens kjøretøy. Personbiler i saldogruppe d med 20 % sats.", ex: "Avskrivning firmabil, avskrivning varebil" },
  { n: "6015", name: "Avskrivning på maskiner", group: "60 Avskrivninger", types: ["AS","ENK","Landbruk"], desc: "Årlig verdiforringelse av maskiner og produksjonsutstyr. Saldogruppe d med 20 % sats.", ex: "Avskrivning produksjonsmaskin" },
  { n: "6017", name: "Avskrivning på inventar", group: "60 Avskrivninger", types: ["AS","ENK"], desc: "Årlig avskrivning av kontormøbler, innredning og annet inventar.", ex: "Avskrivning kontormøbler, butikkinventar" },
  { n: "6020", name: "Avskrivninger immaterielle eiendeler", group: "60 Avskrivninger", types: ["AS","ENK"], desc: "Planmessig avskrivning av immaterielle verdier som goodwill, patenter og lisensrettigheter.", ex: "Avskrivning goodwill, avskrivning patent" },
  { n: "6050", name: "Nedskrivning varige driftsmidler/immaterielle", group: "60 Avskrivninger", types: ["AS","ENK"], desc: "Ekstraordinær verdireduksjon når virkelig verdi er varig lavere enn bokført verdi.", ex: "Nedskrivning maskin, nedskrivning goodwill" },

  // 61 – Frakt og transportkostnad ved salg
  { n: "6100", name: "Frakt transport og forsikring", group: "61 Frakt ved salg", types: ["AS","ENK"], desc: "Alle fraktkostnader knyttet til levering av solgte varer til kunder.", ex: "Bring, Posten, DHL, kurertjeneste" },
  { n: "6110", name: "Toll og spedisjonskostnader", group: "61 Frakt ved salg", types: ["AS","ENK"], desc: "Tollgebyr og spedisjonskostnader ved eksport av varer til kunder i utlandet.", ex: "Eksporttoll, speditør, fortolling" },

  // 62 – Energi, brensel og vann vedrørende produksjon
  { n: "6200", name: "Elektrisitet", group: "62 Energi produksjon", types: ["AS","ENK","Landbruk"], desc: "Strømkostnader knyttet til produksjon og drift. Inkluderer både forbruk og nettleie.", ex: "Strømfaktura, nettleie, kraftavtale" },
  { n: "6210", name: "Gass", group: "62 Energi produksjon", types: ["AS","ENK","Landbruk"], desc: "Kostnader for gass brukt i produksjon eller oppvarming.", ex: "Naturgass, propan, LPG" },
  { n: "6220", name: "Fyringsolje", group: "62 Energi produksjon", types: ["AS","ENK","Landbruk"], desc: "Kostnader for fyringsolje til oppvarming av produksjonslokaler.", ex: "Fyringsolje, parafin" },
  { n: "6230", name: "Kull og koks", group: "62 Energi produksjon", types: ["AS","ENK"], desc: "Kostnader for kull og koks brukt som brensel i produksjonen.", ex: "Industrielt kull, koks" },
  { n: "6240", name: "Ved", group: "62 Energi produksjon", types: ["ENK","Landbruk"], desc: "Kostnader for ved brukt til oppvarming i virksomhetens lokaler.", ex: "Fyringsved, pellets" },
  { n: "6250", name: "Bensin og dieselolje", group: "62 Energi produksjon", types: ["AS","ENK","Landbruk"], desc: "Drivstoff brukt i produksjonsrelatert maskineri, ikke transportmidler.", ex: "Diesel til aggregat, bensin til motor" },
  { n: "6260", name: "Vann", group: "62 Energi produksjon", types: ["AS","ENK","Landbruk"], desc: "Vannkostnader knyttet til produksjons- og næringsvirksomhet.", ex: "Vannforbruk, vanngebyr" },
  { n: "6290", name: "Annen brensel", group: "62 Energi produksjon", types: ["AS","ENK","Landbruk"], desc: "Andre energibærere som ikke dekkes av øvrige underkontoer.", ex: "Biodiesel, bioetanol, hydrogen" },

  // 63 – Kostnad lokaler
  { n: "6300", name: "Leie lokaler", group: "63 Lokalkostnader", types: ["AS","ENK"], desc: "Husleie for kontor, butikk, lager eller andre lokaler bedriften leier. Ofte den største driftskostnaden for tjenestevirksomheter.", ex: "Kontorleie, butikkleie, lagerleie" },
  { n: "6320", name: "Renovasjon, vann, avløp mv.", group: "63 Lokalkostnader", types: ["AS","ENK"], desc: "Kommunale avgifter knyttet til bedriftens lokaler. Inkluderer renovasjon, vann og avløp.", ex: "Renovasjonsgebyr, vanngebyr, avløpsavgift" },
  { n: "6340", name: "Lys varme", group: "63 Lokalkostnader", types: ["AS","ENK"], desc: "Strøm og oppvarming spesifikt knyttet til bedriftens lokaler. Skilles fra produksjonsenergi.", ex: "Strøm kontor, fjernvarme, klimaanlegg" },
  { n: "6360", name: "Renhold", group: "63 Lokalkostnader", types: ["AS","ENK"], desc: "Vaskekostnader for bedriftens lokaler, enten innkjøpte vaskemidler eller faktura fra rengjøringsfirma.", ex: "Rengjøringsbyrå, vaskemidler, vinduspuss" },
  { n: "6390", name: "Annen kostnad lokaler", group: "63 Lokalkostnader", types: ["AS","ENK"], desc: "Diverse utgifter til lokaler som ikke dekkes av andre kontoer i gruppen.", ex: "Alarm, skilt, dekorasjon, snømåking, heis" },

  // 64 – Leie maskiner, inventar
  { n: "6400", name: "Leie maskiner", group: "64 Leie maskiner/inventar", types: ["AS","ENK","Landbruk"], desc: "Operasjonell leie av maskiner og produksjonsutstyr som bedriften ikke eier.", ex: "Maskinleie, utstyrsleie, korttidsleasing" },
  { n: "6410", name: "Leie inventar", group: "64 Leie maskiner/inventar", types: ["AS","ENK"], desc: "Leie av kontormøbler, innredning og annet inventar.", ex: "Møbelleie, inventarleie" },
  { n: "6420", name: "Leie datasystemer", group: "64 Leie maskiner/inventar", types: ["AS","ENK"], desc: "Abonnement og leie av IT-systemer, skytjenester og programvareplattformer.", ex: "SaaS-abonnement, skylagring, ERP-system" },
  { n: "6430", name: "Leie andre kontormaskiner", group: "64 Leie maskiner/inventar", types: ["AS","ENK"], desc: "Leie av kopimaskiner, printere og annet kontorteknisk utstyr.", ex: "Kopimaskinleie, skriveravtale" },
  { n: "6440", name: "Leie transportmidler", group: "64 Leie maskiner/inventar", types: ["AS","ENK"], desc: "Operasjonell leasing og korttidsleie av kjøretøy bedriften ikke eier.", ex: "Billeasing, korttidsleie varebil" },
  { n: "6490", name: "Annen leiekostnad", group: "64 Leie maskiner/inventar", types: ["AS","ENK"], desc: "Diverse leiekostnader for utstyr som ikke passer i andre underkontoer.", ex: "Containerleie, stillasleie" },

  // 65 – Verktøy, inventar, driftsmateriell (ikke aktiveres)
  { n: "6500", name: "Motordrevet verktøy", group: "65 Verktøy og driftsmateriell", types: ["AS","ENK","Landbruk"], desc: "Elektrisk og motordrevet verktøy med verdi under aktiveringsgrensen som kostnadsføres direkte.", ex: "Drill, vinkelsliper, motorsag, kompressor" },
  { n: "6510", name: "Håndverktøy", group: "65 Verktøy og driftsmateriell", types: ["AS","ENK","Landbruk"], desc: "Manuelt verktøy som kostnadsføres direkte ved anskaffelse.", ex: "Skrutrekkere, hammer, tang, målebånd" },
  { n: "6520", name: "Hjelpeverktøy", group: "65 Verktøy og driftsmateriell", types: ["AS","ENK"], desc: "Diverse hjelpeutstyr og tilbehør til verktøy.", ex: "Bor, sagblader, slipeskiver" },
  { n: "6530", name: "Spesialverktøy", group: "65 Verktøy og driftsmateriell", types: ["AS","ENK"], desc: "Verktøy laget eller tilpasset for spesifikke oppgaver.", ex: "Tilpasset verktøy, jigg, mal" },
  { n: "6540", name: "Inventar", group: "65 Verktøy og driftsmateriell", types: ["AS","ENK"], desc: "Møbler og innredning med verdi under aktiveringsgrensen.", ex: "Kontorstoler, hyller, bokhylle" },
  { n: "6550", name: "Driftsmaterialer", group: "65 Verktøy og driftsmateriell", types: ["AS","ENK","Landbruk"], desc: "Forbruksmateriell som brukes i den daglige driften uten å inngå i sluttproduktet.", ex: "Emballasje, pakkmateriale, tape" },
  { n: "6551", name: "Datautstyr", group: "65 Verktøy og driftsmateriell", types: ["AS","ENK"], desc: "IT-maskinvare under aktiveringsgrensen som kostnadsføres direkte.", ex: "PC, nettbrett, tastatur, skjerm, headset" },
  { n: "6552", name: "Programvare anskaffelse", group: "65 Verktøy og driftsmateriell", types: ["AS","ENK"], desc: "Engangslisenser og programvare under aktiveringsgrensen som kostnadsføres direkte.", ex: "Engangslisens, programvare, app" },
  { n: "6560", name: "Rekvisita", group: "65 Verktøy og driftsmateriell", types: ["AS","ENK"], desc: "Diverse småanskaffelser og forbruksartikler til driften.", ex: "Kaffemaskin, whiteboard, oppbevaringsbokser" },
  { n: "6570", name: "Arbeidsklær og verneutstyr", group: "65 Verktøy og driftsmateriell", types: ["AS","ENK","Landbruk"], desc: "Påkrevd arbeidstøy og personlig verneutstyr som arbeidsgiver er forpliktet til å skaffe.", ex: "Vernesko, hjelm, vernehansker, refleksvest" },
  { n: "6590", name: "Annet driftsmateriell", group: "65 Verktøy og driftsmateriell", types: ["AS","ENK"], desc: "Diverse driftsmateriell som ikke dekkes av andre underkontoer.", ex: "Rengjøringsmateriell, lyspærer, batterier" },

  // 66 – Reparasjon og vedlikehold
  { n: "6600", name: "Reparasjon og vedlikehold bygninger", group: "66 Vedlikehold", types: ["AS","ENK","Landbruk"], desc: "Kostnader for å bringe bygninger tilbake til opprinnelig stand uten å tilføre ny verdi. Påkostning aktiveres.", ex: "Maling, vindusskift, rørleggerjobb" },
  { n: "6620", name: "Reparasjon og vedlikehold utstyr", group: "66 Vedlikehold", types: ["AS","ENK","Landbruk"], desc: "Service og reparasjon av maskiner, verktøy og teknisk utstyr.", ex: "Maskinservice, slitedeler, reparasjon" },
  { n: "6690", name: "Reparasjon og vedlikehold annet", group: "66 Vedlikehold", types: ["AS","ENK"], desc: "Vedlikeholdskostnader for eiendeler som ikke dekkes av andre underkontoer.", ex: "IT-reparasjon, kontormaskinservice" },

  // 67 – Fremmed tjeneste
  { n: "6700", name: "Revisjons- og regnskapshonorarer", group: "67 Rådgivning", types: ["AS","ENK"], desc: "Samlet konto for honorar til ekstern regnskapsfører og revisor.", ex: "Regnskapsføring og revisjon" },
  { n: "6701", name: "Revisjonshonorar", group: "67 Rådgivning", types: ["AS"], desc: "Honorar spesifikt til revisor for lovpålagt revisjon av årsregnskapet.", ex: "Årsrevisjon, revisjon" },
  { n: "6702", name: "Honorar rådgivning revisjon", group: "67 Rådgivning", types: ["AS"], desc: "Honorar til revisor for rådgivningstjenester utover den lovpålagte revisjonen.", ex: "Skattemessig rådgivning fra revisor" },
  { n: "6705", name: "Regnskapshonorar", group: "67 Rådgivning", types: ["AS","ENK"], desc: "Honorar til autorisert regnskapsfører for løpende regnskapsføring og årsoppgjør.", ex: "Månedlig regnskapspakke, årsoppgjørsarbeid" },
  { n: "6720", name: "Honorar økonomisk og juridisk bistand", group: "67 Rådgivning", types: ["AS","ENK"], desc: "Honorar til advokater og økonomiske rådgivere for bistand i forretningssaker.", ex: "Advokathonorar, skattejuridisk rådgivning" },
  { n: "6725", name: "Honorar juridisk bistand fradragsberettiget", group: "67 Rådgivning", types: ["AS","ENK"], desc: "Juridisk bistand som har direkte tilknytning til inntektsskapende aktivitet og gir skattemessig fradrag.", ex: "Kontraktsadvokat, forretningsjuridisk bistand" },
  { n: "6726", name: "Honorar juridisk bistand ikke fradragsberettiget", group: "67 Rådgivning", types: ["AS","ENK"], desc: "Juridisk bistand som ikke gir skattemessig fradrag, for eksempel i private tvister.", ex: "Privat rettssak, arvetvist" },
  { n: "6790", name: "Annen fremmed tjeneste", group: "67 Rådgivning", types: ["AS","ENK"], desc: "Ekstern rådgivning og konsulenttjenester som ikke er regnskap, revisjon eller jus.", ex: "IT-konsulent, markedsrådgiver, rekrutteringsbyrå" },

  // 68 – Kontorkostnad
  { n: "6800", name: "Kontorrekvisita", group: "68 Kontorkostnader", types: ["AS","ENK"], desc: "Forbruksmateriell til kontordriften som papir, penner og permer.", ex: "Papir, penner, permer, blekk, toner" },
  { n: "6810", name: "Datakostnad", group: "68 Kontorkostnader", types: ["AS","ENK"], desc: "IT-relaterte forbrukskostnader under aktiveringsgrensen. Ikke abonnement.", ex: "USB-minne, kabler, adapter" },
  { n: "6820", name: "Trykksaker", group: "68 Kontorkostnader", types: ["AS","ENK"], desc: "Produksjon av trykt materiale for intern og ekstern bruk.", ex: "Visittkort, brosjyrer, flyere" },
  { n: "6840", name: "Aviser tidsskrifter", group: "68 Kontorkostnader", types: ["AS","ENK"], desc: "Abonnement og innkjøp av aviser, fagblader og tidsskrifter.", ex: "Fagblad, bransjeavis, e-tidsskrift" },
  { n: "6860", name: "Møter kurs", group: "68 Kontorkostnader", types: ["AS","ENK"], desc: "Deltakeravgifter og kostnader ved faglige kurs, konferanser og seminarer.", ex: "Kursavgift, konferansebillett, webinar" },
  { n: "6890", name: "Annen kontorkostnad", group: "68 Kontorkostnader", types: ["AS","ENK"], desc: "Diverse kontorkostnader som ikke dekkes av andre underkontoer.", ex: "Postboksleie, nøkkelkopi, kontorplanter" },

  // 69 – Telefon og porto
  { n: "6900", name: "Telefon", group: "69 Kommunikasjon", types: ["AS","ENK"], desc: "Alle kostnader til telefoni og mobilkommunikasjon for bedriften.", ex: "Mobilabonnement, fasttelefon, IP-telefoni" },
  { n: "6940", name: "Porto", group: "69 Kommunikasjon", types: ["AS","ENK"], desc: "Portokostnader for brev og pakker sendt fra bedriften.", ex: "Frimerker, Bring-pakker, postforsendelser" },

  // ===== KLASSE 7: ANDRE DRIFTSKOSTNADER =====

  // 70 – Kostnad transportmidler
  { n: "7000", name: "Drivstoff transportmidler", group: "70 Transportkostnader", types: ["AS","ENK","Landbruk"], desc: "Bensin, diesel eller strøm til bedriftens egne kjøretøy registrert som firmaets transportmidler.", ex: "Bensin, diesel, elbillading" },
  { n: "7020", name: "Vedlikehold transportmidler", group: "70 Transportkostnader", types: ["AS","ENK","Landbruk"], desc: "Service, reparasjoner og dekkskift for bedriftens kjøretøy.", ex: "EU-kontroll, dekkskift, oljeskift, verksted" },
  { n: "7040", name: "Forsikring og avgifter transportmidler", group: "70 Transportkostnader", types: ["AS","ENK","Landbruk"], desc: "Forsikringspremier og offentlige avgifter for kjøretøy, inkludert trafikkforsikringsavgift.", ex: "Bilforsikring, årsavgift, bompengeavtale" },
  { n: "7080", name: "Bilkostnader, bruk av privat bil i næring", group: "70 Transportkostnader", types: ["ENK"], desc: "Kostnader knyttet til bruk av eiers private bil i næringen i enkeltpersonforetak.", ex: "Drivstoff privat bil i næring, vedlikehold" },
  { n: "7090", name: "Annen kostnad transportmidler", group: "70 Transportkostnader", types: ["AS","ENK"], desc: "Diverse transportkostnader som ikke dekkes av andre underkontoer.", ex: "Parkering, bompenger, ferge" },
  { n: "7098", name: "Privat bruk av elektronisk kommunikasjon", group: "70 Privatkostnad", types: ["ENK"], desc: "Motkonto for å skille ut privat bruk av bedriftens mobiltelefon og bredbånd.", ex: "Privatandel telefon, privatandel internett" },
  { n: "7099", name: "Privat bruk av næringsbil", group: "70 Privatkostnad", types: ["ENK"], desc: "Motkonto for å skille ut privat bruk av næringsbil i enkeltpersonforetak.", ex: "Privatandel bilkostnader" },

  // 71 – Kostnad reise, diett, bil
  { n: "7100", name: "Bilgodtgjørelse oppgavepliktig", group: "71 Reise og diett", types: ["AS","ENK"], desc: "Kilometergodtgjørelse til ansatte som bruker egen bil i jobbsammenheng, etter statens satser.", ex: "Kjøregodtgjørelse, km-godtgjørelse" },
  { n: "7130", name: "Reisekostnader oppgavepliktig", group: "71 Reise og diett", types: ["AS","ENK"], desc: "Reisekostnader til ansatte som er trekkpliktige og innberetningspliktige.", ex: "Trekkpliktig reisegodtgjørelse" },
  { n: "7140", name: "Reisekostnader ikke oppgavepliktig", group: "71 Reise og diett", types: ["AS","ENK"], desc: "Faktiske reiseutgifter mot bilag som flybilletter og togbilletter. Ikke oppgavepliktige.", ex: "Flybillett, togbillett, fergereise, taxi" },
  { n: "7150", name: "Diettkostnader oppgavepliktig", group: "71 Reise og diett", types: ["AS","ENK"], desc: "Diettgodtgjørelse ved tjenestereiser som er trekkpliktig og innberetningspliktig.", ex: "Diettsats over statens satser" },
  { n: "7160", name: "Diettkostnader ikke oppgavepliktig", group: "71 Reise og diett", types: ["AS","ENK"], desc: "Diettutbetalinger innenfor statens satser som ikke er trekkpliktige.", ex: "Diett etter satser, nattillegg" },
  { n: "7190", name: "Annen kostnadsgodtgjørelse", group: "71 Reise og diett", types: ["AS","ENK"], desc: "Diverse kostnadsgodtgjørelser til ansatte som ikke dekkes av andre kontoer.", ex: "Verktøygodtgjørelse, uniformsgodtgjørelse" },

  // 72 – Provisjonskostnad
  { n: "7200", name: "Provisjonskostnader oppgavepliktig", group: "72 Provisjonskostnad", types: ["AS","ENK"], desc: "Provisjoner betalt til eksterne agenter og formidlere som er oppgavepliktige.", ex: "Salgsprovisjon til agent, meglerprovisjon" },
  { n: "7210", name: "Provisjonskostnader ikke oppgavepliktig", group: "72 Provisjonskostnad", types: ["AS","ENK"], desc: "Provisjoner betalt som ikke er oppgavepliktige, typisk til selskaper.", ex: "Provisjon til selskap, nettverksprovisjon" },

  // 73 – Salgs- og reklamekostnader
  { n: "7300", name: "Salgskostnader", group: "73 Salg og reklame", types: ["AS","ENK"], desc: "Kostnader direkte knyttet til salgsarbeidet som ikke er lønn eller provisjon.", ex: "Salgsprøver, demonstrasjonsmateriale, messestand" },
  { n: "7320", name: "Reklamekostnad", group: "73 Salg og reklame", types: ["AS","ENK"], desc: "Alle former for betalt markedsføring og annonsering.", ex: "Google Ads, Meta-annonser, avisannonse, plakater" },
  { n: "7350", name: "Representasjon fradragsberettiget", group: "73 Salg og reklame", types: ["AS","ENK"], desc: "Bevertning av kunder og forretningsforbindelser som gir skattemessig fradrag. Merk: MVA-fradrag gis ikke.", ex: "Kundemiddag, forretningslunsj" },
  { n: "7360", name: "Representasjon ikke fradragsberettiget", group: "73 Salg og reklame", types: ["AS","ENK"], desc: "Bevertning som overstiger beløpsgrensene for fradrag, eller som ikke oppfyller kravene.", ex: "Overdådig kundemiddag, privat representasjon" },
  { n: "7390", name: "Annen salgskostnad", group: "73 Salg og reklame", types: ["AS","ENK"], desc: "Diverse salgskostnader som ikke passer i andre underkontoer.", ex: "Sponsoravtale, markedsundersøkelse, salgsmateriell" },

  // 74 – Kontingent og gave
  { n: "7400", name: "Kontingenter fradragsberettiget", group: "74 Kontingenter og gaver", types: ["AS","ENK","Landbruk"], desc: "Årlig medlemsavgift til næringsforeninger og arbeidsgiverorganisasjoner som gir skattemessig fradrag.", ex: "NHO, Virke, Regnskap Norge" },
  { n: "7410", name: "Kontingenter ikke fradrag", group: "74 Kontingenter og gaver", types: ["AS","ENK"], desc: "Medlemskontingenter som ikke gir skattemessig fradrag.", ex: "Politisk kontingent, sosial forening" },
  { n: "7420", name: "Gaver fradragsberettiget", group: "74 Kontingenter og gaver", types: ["AS","ENK"], desc: "Gaver til veldedige organisasjoner som gir skattemessig fradrag opp til gjeldende beløpsgrense.", ex: "Gave til Røde Kors, Leger uten grenser" },
  { n: "7430", name: "Gaver ikke fradrag", group: "74 Kontingenter og gaver", types: ["AS","ENK"], desc: "Gaver som ikke oppfyller kravene til skattemessig fradrag.", ex: "Gave til uregistrert organisasjon, sponsorgave" },

  // 75 – Forsikringspremie
  { n: "7500", name: "Forsikringspremier", group: "75 Forsikring", types: ["AS","ENK","Landbruk"], desc: "Forsikring for bedriftens eiendeler, ansvar og driftsavbrudd. Bilforsikring føres under konto 7040.", ex: "Innboforsikring, ansvarsforsikring, avbruddsforsikring" },
  { n: "7550", name: "Garantikostnader", group: "75 Forsikring", types: ["AS","ENK"], desc: "Kostnader knyttet til garantiarbeid og reklamasjoner på leverte produkter.", ex: "Garantireparasjon, reklamasjonskostnad" },
  { n: "7560", name: "Servicekostnader", group: "75 Forsikring", types: ["AS","ENK"], desc: "Kostnader til service og ettermarkedstjenester overfor kunder.", ex: "Servicebesøk, oppfølging etter salg" },

  // 76 – Lisens og patentkostnad
  { n: "7600", name: "Lisensavgifter og royalties", group: "76 Lisenser", types: ["AS","ENK"], desc: "Løpende avgifter for bruk av andres immaterielle rettigheter som programvare, patenter og merkevarer.", ex: "Programvarelisens, royalty-betaling, merkevarelisensiering" },
  { n: "7610", name: "Patentkostnader ved egne patenter", group: "76 Lisenser", types: ["AS","ENK"], desc: "Kostnader for å registrere, opprettholde og forsvare egne patenter.", ex: "Patentregistrering, patentsøknad, patentadvokat" },
  { n: "7620", name: "Kostnader ved varemerker etc.", group: "76 Lisenser", types: ["AS","ENK"], desc: "Registrerings- og vedlikeholdskostnader for varemerker og designrettigheter.", ex: "Varemerkeregistrering, domenefornyelse" },
  { n: "7630", name: "Kontroll-, prøve- og stempelavgifter", group: "76 Lisenser", types: ["AS","ENK"], desc: "Avgifter for offentlige kontroller, godkjenninger og sertifiseringer.", ex: "Mattilsynet-kontroll, CE-merking, ISO-sertifisering" },

  // 77 – Annen kostnad
  { n: "7700", name: "Styre- og bedriftsforsamlinger", group: "77 Andre kostnader", types: ["AS"], desc: "Kostnader knyttet til avholdelse av styremøter og bedriftsforsamlinger utover selve honoraret.", ex: "Møterom, forpleining styremøte, reise for styremedlemmer" },
  { n: "7710", name: "Generalforsamling", group: "77 Andre kostnader", types: ["AS"], desc: "Kostnader ved avholdelse av ordinær og ekstraordinær generalforsamling.", ex: "Lokale, innkalling, advokat-bistand" },
  { n: "7730", name: "Kostnader ved egne aksjer", group: "77 Andre kostnader", types: ["AS"], desc: "Transaksjonskostnader ved kjøp og salg av egne aksjer.", ex: "Meglerhonorar for tilbakekjøp" },
  { n: "7740", name: "Øredifferanser", group: "77 Andre kostnader", types: ["AS","ENK"], desc: "Avrundingsdifferanser som oppstår ved bokføring og som ikke kan plasseres annet sted.", ex: "Øreavrunding, avrundingsdifferanse" },
  { n: "7750", name: "Eiendoms- og festeavgifter", group: "77 Andre kostnader", types: ["AS","ENK","Landbruk"], desc: "Avgifter knyttet til eiendomsrett og tomtefeste.", ex: "Festeavgift, eiendomsavgift" },
  { n: "7770", name: "Bank og kortgebyrer", group: "77 Andre kostnader", types: ["AS","ENK"], desc: "Gebyrer for kontohold, betalingsformidling, korttransaksjoner og terminalleie.", ex: "Kontoholdsgebyr, kortgebyr, terminalleie" },
  { n: "7790", name: "Annen kostnad fradragsberettiget", group: "77 Andre kostnader", types: ["AS","ENK"], desc: "Diverse driftskostnader som gir skattemessig fradrag men ikke passer annet sted.", ex: "Brønnøysundgebyr, diverse kostnader" },
  { n: "7791", name: "Annen kostnad ikke fradragsberettiget", group: "77 Andre kostnader", types: ["AS","ENK"], desc: "Kostnader som ikke gir skattemessig fradrag.", ex: "Parkeringsbot, tvangsmulkt, forelegg" },

  // 78 – Tap o.l.
  { n: "7800", name: "Tap ved salg av anleggsmidler", group: "78 Tap", types: ["AS","ENK"], desc: "Tap som oppstår når anleggsmidler selges for mindre enn bokført verdi.", ex: "Tap på solgt maskin, tap ved salg av bil" },
  { n: "7820", name: "Innkommet tidligere nedskrevne fordringer", group: "78 Tap", types: ["AS","ENK"], desc: "Betalinger mottatt for fordringer som tidligere er avskrevet som tap. Reduserer tapskostnaden.", ex: "Uventet innbetaling fra konkursbo" },
  { n: "7830", name: "Konstaterte tap på fordringer", group: "78 Tap", types: ["AS","ENK"], desc: "Endelig konstaterte tap på kundefordringer der det er klart at betaling ikke vil komme.", ex: "Konkurs hos kunde, uerholdelig fordring" },
  { n: "7860", name: "Tap på kontrakter", group: "78 Tap", types: ["AS","ENK"], desc: "Tap som oppstår når kontraktsforpliktelser ikke kan oppfylles uten tap.", ex: "Prosjekttap, tapskontrakt" },

  // 79 – Periodiseringskonto
  { n: "7900", name: "Beholdningsendringer", group: "79 Periodiseringer", types: ["AS","ENK","Landbruk"], desc: "Samlet konto for endringer i varelager og beholdninger som påvirker periodens resultat.", ex: "Lageroppgjør, beholdningsjustering" },

  // ===== KLASSE 8: FINANSPOSTER, SKATT, RESULTAT =====

  // 80 – Finansinntekt
  { n: "8000", name: "Inntekt på investering i datterselskap", group: "80 Finansinntekter", types: ["AS"], desc: "Utbytte og avkastning mottatt fra datterselskaper eid av morselskapet.", ex: "Konsernbidrag, utbytte fra datter" },
  { n: "8010", name: "Inntekt på investering i konsernselskap", group: "80 Finansinntekter", types: ["AS"], desc: "Inntekter fra investeringer i andre foretak innenfor samme konsernstruktur.", ex: "Utbytte fra søsterselskap" },
  { n: "8020", name: "Inntekt på investering i tilknyttet selskap", group: "80 Finansinntekter", types: ["AS"], desc: "Avkastning fra investeringer i tilknyttede selskaper der eierandelen gir betydelig innflytelse.", ex: "Utbytte fra tilknyttet selskap" },
  { n: "8030", name: "Renteinntekter konsern", group: "80 Finansinntekter", types: ["AS"], desc: "Renteinntekter på utlån til selskaper innenfor samme konsern.", ex: "Rente på konsernlån" },
  { n: "8040", name: "Renteinntekt tilbakebetalt skatt", group: "80 Finansinntekter", types: ["AS","ENK"], desc: "Renter mottatt fra skattemyndighetene ved tilbakebetaling av for mye innbetalt skatt.", ex: "Rentegodtgjørelse fra Skatteetaten" },
  { n: "8050", name: "Annen renteinntekt", group: "80 Finansinntekter", types: ["AS","ENK","Landbruk"], desc: "Renteinntekter fra bankinnskudd, utlån og andre rentebærende plasseringer.", ex: "Bankrente, rente høyrentekonto" },
  { n: "8060", name: "Valutagevinst (Agio)", group: "80 Finansinntekter", types: ["AS","ENK"], desc: "Gevinst som oppstår ved gunstig valutakursendring på fordringer eller gjeld i utenlandsk valuta.", ex: "Kursgevinst på kundefordring i euro" },
  { n: "8070", name: "Annen finansinntekt", group: "80 Finansinntekter", types: ["AS","ENK"], desc: "Finansielle inntekter som ikke passer i andre underkontoer.", ex: "Gevinst på verdipapir, utbytte fra aksjer" },
  { n: "8071", name: "Aksjeutbytte fra norske foretak", group: "80 Finansinntekter", types: ["AS"], desc: "Utbytte mottatt fra aksjer i andre norske aksjeselskaper. Kan være skattefritt under fritaksmetoden.", ex: "Utbytte fra aksjeportefølje" },

  // 81 – Finanskostnad
  { n: "8130", name: "Rentekostnader konsern", group: "81 Finanskostnader", types: ["AS"], desc: "Renter betalt på lån fra selskaper i samme konsern.", ex: "Rente på konsernlån fra morselskap" },
  { n: "8140", name: "Rentekostnad fastsatt skatt ikke fradrag", group: "81 Finanskostnader", types: ["AS","ENK"], desc: "Renter på skyldig skatt som ikke gir skattemessig fradrag.", ex: "Forsinkelsesrente skatt, morarente skatteoppgjør" },
  { n: "8150", name: "Rentekostnader kredittinstitusjoner", group: "81 Finanskostnader", types: ["AS","ENK","Landbruk"], desc: "Renter betalt på lån og kassekreditt hos banker og finansinstitusjoner.", ex: "Lånerente, kassekredittrente" },
  { n: "8160", name: "Valutatap (Disagio)", group: "81 Finanskostnader", types: ["AS","ENK"], desc: "Tap som oppstår ved ugunstig valutakursendring på fordringer eller gjeld i fremmed valuta.", ex: "Kurstap på leverandørgjeld i dollar" },
  { n: "8170", name: "Annen finanskostnad", group: "81 Finanskostnader", types: ["AS","ENK"], desc: "Diverse finansielle kostnader som ikke dekkes av andre underkontoer.", ex: "Tap på verdipapir, emisjonskostnader" },

  // 83 – Skattekostnad
  { n: "8300", name: "Betalbar skatt", group: "83 Skattekostnad", types: ["AS"], desc: "Beregnet inntektsskatt på årets skattepliktige resultat for aksjeselskaper, normalt 22 %.", ex: "Selskapsskatt, inntektsskatt AS" },
  { n: "8320", name: "Endring utsatt skatt/skattefordel", group: "83 Skattekostnad", types: ["AS"], desc: "Endring i utsatt skatt eller utsatt skattefordel som skyldes midlertidige forskjeller mellom regnskap og skatt.", ex: "Periodisering skatteforpliktelse" },

  // 84 – Ekstraordinær inntekt
  { n: "8490", name: "Ekstraordinær inntekt", group: "84 Ekstraordinære poster", types: ["AS","ENK"], desc: "Inntekter som er uvanlige og som ikke forventes å gjenta seg regelmessig.", ex: "Erstatningsoppgjør, engangsgevinst" },

  // 85 – Ekstraordinær kostnad
  { n: "8590", name: "Annen ekstraordinær kostnad", group: "85 Ekstraordinære poster", types: ["AS","ENK"], desc: "Kostnader som er uvanlige og som ikke forventes å gjenta seg.", ex: "Brannkostnad, naturkatastrofe" },

  // 86 – Skattekostnad ekstraordinært
  { n: "8600", name: "Betalbar skatt ekstraordinært", group: "86 Skatt ekstraordinært", types: ["AS"], desc: "Skatt beregnet på ekstraordinært resultat.", ex: "Skatt på ekstraordinær inntekt" },
  { n: "8620", name: "Endring utsatt skatt ekstraordinært", group: "86 Skatt ekstraordinært", types: ["AS"], desc: "Endring i utsatt skatt som skyldes ekstraordinære poster.", ex: "Skatteeffekt ekstraordinært resultat" },

  // 88 – Årsresultat
  { n: "8800", name: "Årsresultat", group: "88 Årsresultat", types: ["AS","ENK","Landbruk"], desc: "Det endelige resultatet etter alle inntekter, kostnader, finansposter og skatt. Viser om bedriften gikk med overskudd eller underskudd.", ex: "Overskudd, underskudd, nettoresultat" },

  // 89 – Overføringer og disponeringer
  { n: "8910", name: "Overføringer felleseid andelskapital", group: "89 Disponeringer", types: ["AS"], desc: "Overføring av resultat til felleseid andelskapital i samvirkeforetak.", ex: "Andelskapital samvirke" },
  { n: "8920", name: "Avsatt ordinært utbytte", group: "89 Disponeringer", types: ["AS"], desc: "Del av årsresultatet som er vedtatt utdelt som utbytte til aksjonærene.", ex: "Vedtatt utbytte, utbyttevedtak" },
  { n: "8960", name: "Overføringer annen egenkapital", group: "89 Disponeringer", types: ["AS","ENK"], desc: "Del av årsresultatet som overføres til annen egenkapital og beholdes i selskapet.", ex: "Tilbakeholdt overskudd, overført til EK" },
  { n: "8990", name: "Udekket tap", group: "89 Disponeringer", types: ["AS","ENK"], desc: "Årets underskudd som overføres til udekket tap i balansen når selskapet ikke har tilstrekkelig egenkapital.", ex: "Underskudd overført til tap" },
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

    const { type, batch } = await req.json().catch(() => ({ type: "all", batch: undefined }));
    const batchSize = 50;

    let accountsInserted = 0;
    let glossaryInserted = 0;

    if (type === "all" || type === "accounts") {
      const allRows = ACCOUNTS.map(a => ({
        account_number: a.n,
        name: a.name,
        slug: slugify(`${a.n}-${a.name}`),
        description: a.desc,
        examples: a.ex,
        category_group: a.group,
        business_types: a.types,
        tags: a.tags || [],
        mva_status: "med_mva",
        active: true,
      }));

      // If batch is specified, only process that slice
      const start = batch !== undefined ? batch * batchSize : 0;
      const end = batch !== undefined ? start + batchSize : allRows.length;
      const rows = allRows.slice(start, end);
      const totalBatches = Math.ceil(allRows.length / batchSize);

      for (const row of rows) {
        const { error } = await supabase
          .from("account_entries")
          .upsert(row, { onConflict: "slug" });
        if (!error) accountsInserted++;
      }

      if (batch !== undefined) {
        return new Response(
          JSON.stringify({ success: true, accountsInserted, batch, totalBatches, batchRange: `${start}-${end}` }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
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
