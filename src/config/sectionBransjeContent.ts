import type { SectionId } from "@/contexts/SectionContext";

/**
 * Industries to HIDE per section (they overlap with the section's own domain).
 * Key = section, value = industry slugs to exclude.
 */
export const hiddenIndustriesPerSection: Record<SectionId, string[]> = {
  regnskap: [],
  hr: [
    "bemanning", "landbruk", "nettbutikk", "arkitektur", "markedsforing",
    "energi", "kultur", "reiseliv", "bil",
  ],
  markedsforing: [
    "markedsforing", "holding", "landbruk", "juridisk",
    "energi", "industri", "transport", "bemanning",
  ],
  it: [
    "tech-saas", "holding", "landbruk", "juridisk",
    "bemanning", "bil", "energi", "renhold",
  ],
};

/* ─────────── Section-specific industry content ─────────── */

interface SectionBransjeOverride {
  deliverables: string[];
  intro: string;
  body: string;
}

/* ============================
   REGNSKAP — all 25 industries
   ============================ */
const regnskapOverrides: Record<string, SectionBransjeOverride> = {
  "tech-saas": {
    deliverables: ["MRR/ARR-rapportering og SaaS-metrikker", "Investorregnskap og cap table", "SkatteFUNN-søknader og dokumentasjon", "Opsjonsprogram og aksjebasert avlønning", "Internasjonale transaksjoner og valuta", "Løpende bokføring og MVA", "Årsregnskap og skattemelding", "CFO-rådgivning for vekstselskaper"],
    intro: "Fra pre-revenue til scale-up — vi forstår SaaS-økonomien. Investorrunder, MRR-rapportering og SkatteFUNN — alt håndtert av en regnskapsfører som kjenner tech.",
    body: "SaaS og tech-selskaper har en unik økonomi. Abonnementsbaserte inntekter, utsatt inntektsføring, SkatteFUNN og internasjonale transaksjoner krever en regnskapsfører som forstår modellen din — ikke bare tallene.",
  },
  eiendom: {
    deliverables: ["Porteføljerapportering per eiendom", "Skatteoptimalisering ved kjøp og salg", "MVA på utleie og utvikling", "Avskrivningsplaner og vedlikeholdsbudsjett", "Likviditetsstyring og kontantstrøm", "Årsregnskap og skattemelding", "Lønnsomhetsanalyse per prosjekt", "Konsernregnskap for eiendomsselskaper"],
    intro: "Eiendom er kapitalintensivt — og skattemessig komplisert. Vi gir deg full kontroll på porteføljen, avskrivninger og optimalisering ved kjøp og salg.",
    body: "Eiendomsbransjen krever detaljert rapportering per eiendom, korrekt avskrivning og strategisk skatteplanlegging. Vi sørger for at du har full oversikt — enten du har én eller hundre eiendommer.",
  },
  holding: {
    deliverables: ["Konsernregnskap og konsolidering", "Utbyttestrategi og fritaksmetoden", "Kapitalforvaltning og investeringsregnskap", "Skatteplanlegging på tvers av selskaper", "Strukturering og omorganisering", "Årsregnskap og skattemelding per selskap", "Aksjonærlån og mellomværende", "Rapportering til styret"],
    intro: "Holdingselskaper krever presisjon i konsolidering, utbytteplanlegging og skatteoptimalisering på tvers av selskaper. Vi tar hele den økonomiske byrden.",
    body: "Med flere selskaper i porteføljen er korrekt konsolidering, mellomregnskaper og utbyttestrategi avgjørende. Vi sørger for at strukturen din er optimal og at du utnytter fritaksmetoden korrekt.",
  },
  consulting: {
    deliverables: ["Prosjektøkonomi og lønnsomhet per oppdrag", "Timebasert fakturering og inntektsføring", "Skatteplanlegging for konsulenter", "MVA-oppgjør og innrapportering", "Løpende bokføring og bilag", "Årsregnskap og skattemelding", "CFO-rådgivning og budsjett", "Utbyttestrategi og selskapsoptimalisering"],
    intro: "Konsulenter og rådgivere trenger presis prosjektøkonomi og smart skatteplanlegging. Vi sørger for at du fakturerer riktig og beholder mest mulig.",
    body: "Konsulentbransjen handler om å selge timer og kompetanse. Vi hjelper deg med prosjektøkonomi, inntektsføring og skatteoptimalisering — slik at bunnlinjen reflekterer innsatsen din.",
  },
  landbruk: {
    deliverables: ["Jordbruksfradrag og næringsinntekt", "Produksjonstilskudd og rapportering", "Avskrivning av driftsmidler og bygg", "Sesongbasert budsjett og likviditet", "MVA-oppgjør for primærnæring", "Årsregnskap og skattemelding", "Generasjonsskifte og overdragelse", "Investeringsstøtte og tilskudd"],
    intro: "Landbruket har egne skatteregler, tilskuddsordninger og sesongbasert økonomi. Vi kjenner regelverket og hjelper deg å utnytte alle fradrag.",
    body: "Primærnæringen har spesielle fradragsregler, avskrivningsregler for driftsbygninger og sesongbasert likviditet. Vi sørger for at du utnytter alle ordninger og leverer riktig rapportering.",
  },
  varehandel: {
    deliverables: ["Varekostanalyse og marginrapportering", "Lagervurdering og svinn", "MVA-oppgjør for varehandel", "Innkjøpsoptimalisering og kontantstrøm", "Løpende bokføring og bilag", "Årsregnskap og skattemelding", "Franchiserapportering", "Budsjett og sesongplanlegging"],
    intro: "Varehandel handler om marginer, lager og kontantstrøm. Vi gir deg oversikten som gjør at du kjøper smartere og selger mer lønnsomt.",
    body: "I varehandelen er presise varekostberegninger, lagervurderinger og sesongbudsjetter avgjørende for lønnsomheten. Vi sørger for at tallene gir deg innsikten du trenger for å ta bedre beslutninger.",
  },
  "bygg-anlegg": {
    deliverables: ["Prosjektregnskap per byggeprosjekt", "Anbudskalkylering og margin", "Underentreprenørhåndtering", "MVA på fast eiendom og anlegg", "Løpende bokføring og bilag", "Lønnskjøring og innleid arbeidskraft", "Årsregnskap og skattemelding", "Likviditetsstyring ved store prosjekter"],
    intro: "Byggebransjen krever prosjektregnskap, presise anbudskalkyler og korrekt MVA-håndtering. Vi holder orden mens du bygger.",
    body: "Store prosjekter, underentreprenører og forskuddsfakturering gjør byggebransjens økonomi kompleks. Vi gir deg prosjektoversikt, marginkontroll og sikrer at likviditeten holder gjennom hele prosjektet.",
  },
  nettbutikk: {
    deliverables: ["MVA på tvers av landegrenser (OSS/IOSS)", "Integrasjon med betalingsplattformer", "Varekost og marginanalyse", "Automatisert ordreøkonomi", "Periodisering av abonnement", "Årsregnskap og skattemelding", "Lagervurdering og svinn", "Tolldeklarering og import/eksport"],
    intro: "Nettbutikker med internasjonal omsetning har komplekse MVA-regler. Vi holder oversikten — fra OSS-rapportering til varekostanalyse.",
    body: "E-handel betyr internasjonale transaksjoner, ulike MVA-satser, betalingsplattformer og automatisert ordreøkonomi. Vi sørger for at alt er korrekt rapportert — uansett hvor kundene dine er.",
  },
  helse: {
    deliverables: ["MVA-fritak og delt virksomhet", "Pasientinntekter og oppgjør", "Tilskudd og refusjonsordninger", "Løpende bokføring og bilag", "Årsregnskap og skattemelding", "Lønnskjøring for klinikk", "Skatteplanlegging for helsepersonell", "Budsjett og likviditetsstyring"],
    intro: "Helsebransjen har spesielle MVA-regler, refusjonsordninger og tilskudd. Vi gir deg riktig regnskap tilpasset klinikken din.",
    body: "Helseforetak har ofte delt virksomhet med ulike MVA-satser, refusjoner fra HELFO og tilskudd som krever korrekt rapportering. Vi sørger for at alt er riktig — så du kan fokusere på pasientene.",
  },
  restaurant: {
    deliverables: ["Daglig omsetningskontroll", "Varekostsanalyse og svinn", "Tipsrapportering og deling", "Sesongbasert budsjett", "MVA på mat og drikke", "Lønnskjøring med tillegg og turnus", "Årsregnskap og skattemelding", "Likviditetsstyring ved tynne marginer"],
    intro: "Restaurantbransjen har tynne marginer, hektisk drift og komplekse MVA-regler. Vi gir deg daglig kontroll og presis rapportering.",
    body: "Med ulike MVA-satser på mat, alkohol og take-away, pluss turnus, tips og sesongsvingninger — er presist regnskap helt avgjørende for lønnsomheten din.",
  },
  frisor: {
    deliverables: ["Kontorleie og stolleie regnskap", "Inntektsrapportering per stylist", "Varekjøp og produktsalg", "Enkel bokføring og MVA", "Årsregnskap og skattemelding", "Skatteplanlegging for selvstendig næringsdrivende", "Fakturering og kundeoppfølging", "Budsjett og lønnsomhetsanalyse"],
    intro: "Frisører trenger enkelt og oversiktlig regnskap — enten du leier stol eller driver egen salong. Vi tar tallene, du tar kundene.",
    body: "Stolleie, produktsalg og provisjon gjør frisørbransjens økonomi spesiell. Vi sørger for korrekt rapportering og hjelper deg å optimalisere skatten — uansett om du er solo eller team.",
  },
  handverkere: {
    deliverables: ["Prosjektregnskap per oppdrag", "Timepris og kalkylering", "Kjøregodtgjørelse og diett", "Verktøy- og materialkjøp", "MVA-oppgjør og innrapportering", "Løpende bokføring og bilag", "Årsregnskap og skattemelding", "Skatteplanlegging for håndverkere"],
    intro: "Håndverkere trenger presist prosjektregnskap og enkel fakturering. Vi holder orden — du holder hendene i arbeid.",
    body: "Elektrikere, rørleggere, malere og tømrere har alle unike utfordringer med materialinnkjøp, timepris og kjøregodtgjørelse. Vi gir deg oversikt per oppdrag og sørger for at skatten er optimalisert.",
  },
  transport: {
    deliverables: ["Drivstoffkostnader og kjøretøyøkonomi", "MVA på transport og frakt", "Bompenger og avgifter", "Sjåførlønn og diett", "Flåteøkonomi per kjøretøy", "Løpende bokføring og bilag", "Årsregnskap og skattemelding", "Likviditetsstyring og kontantstrøm"],
    intro: "Transportbransjen har store driftskostnader og kompleks økonomi. Vi gir deg oversikt per kjøretøy, rute og sjåfør.",
    body: "Drivstoff, bompenger, sjåførlønn og vedlikehold — transportbransjens kostnader er mange og spredt. Vi sørger for at du har full kontroll og optimaliserer fradragene dine.",
  },
  industri: {
    deliverables: ["Varekostberegning og produksjonsregnskap", "Lagerstyring og verdsetting", "SkatteFUNN og FoU-dokumentasjon", "Avskrivning av maskiner og utstyr", "MVA-oppgjør for industri", "Løpende bokføring og bilag", "Årsregnskap og skattemelding", "Eksport og toll"],
    intro: "Industri og produksjon krever presis varekostberegning, lagerstyring og avskrivningsplaner. Vi gir deg oversikten produksjonen din fortjener.",
    body: "Produksjonsbedrifter har komplekse verdikjeder, maskinpark som skal avskrives og ofte SkatteFUNN-prosjekter. Vi sørger for at alt er korrekt dokumentert og rapportert.",
  },
  renhold: {
    deliverables: ["Kontraktsøkonomi per oppdrag", "Mange ansatte og lønnskjøring", "MVA-oppgjør og innrapportering", "Margin per kontrakt", "Løpende bokføring og bilag", "Årsregnskap og skattemelding", "Likviditetsstyring med mange kunder", "Fakturering og innkreving"],
    intro: "Renholdsbransjen har mange ansatte, stramme marginer og månedlige kontrakter. Vi gir deg kontroll per oppdrag og per ansatt.",
    body: "Med mange kunder, ulike kontraktsstørrelser og høyt antall ansatte er presis fakturering og lønnskjøring avgjørende. Vi sørger for at du har oversikt og margin på hver kontrakt.",
  },
  kultur: {
    deliverables: ["Prosjektbasert økonomi", "Tilskudd og støtteordninger", "Royalties og rettigheter", "Frilanserhonorarer og oppgjør", "MVA for kultur og media", "Løpende bokføring og bilag", "Årsregnskap og skattemelding", "Sesongbasert budsjett"],
    intro: "Kulturbransjen har prosjektbasert økonomi, tilskudd og rettigheter som krever spesialkompetanse. Vi tar tallene — du tar det kreative.",
    body: "Film, musikk, teater og media har alle en prosjektbasert økonomi med tilskudd, royalties og frilansere. Vi forstår finansieringen og sørger for korrekt rapportering til alle instanser.",
  },
  utdanning: {
    deliverables: ["Kursavgifter og MVA-fritak", "Tilskudd og støtteordninger", "Prosjektbasert økonomi", "Frilanserhonorarer og forelesere", "Løpende bokføring og bilag", "Årsregnskap og skattemelding", "Deltakeroppfølging og fakturering", "Budsjett per kurs"],
    intro: "Utdanning og kurs har spesielle MVA-regler og tilskuddsordninger. Vi sørger for korrekt behandling og rapportering.",
    body: "Kursarrangører og e-læringsplattformer må navigere komplekse MVA-fritaksregler, tilskudd og prosjektbasert økonomi. Vi holder orden — du holder undervisningen.",
  },
  juridisk: {
    deliverables: ["Klientmidler og klientkonto", "Timeregistrering og fakturering", "Partnerkompensasjon og overskuddsdeling", "MVA-oppgjør for advokater", "Løpende bokføring og bilag", "Årsregnskap og skattemelding", "Skatteplanlegging for partnere", "Rapportering til Tilsynsrådet"],
    intro: "Advokatfirmaer har strenge krav til klientmidler, timeregistrering og rapportering. Vi tar regnskapet — du tar sakene.",
    body: "Advokatbransjen krever presis håndtering av klientmidler, korrekt timeregistrering og partnerkompensasjon. Vi sikrer compliance og optimal skattebehandling.",
  },
  arkitektur: {
    deliverables: ["Prosjektregnskap per oppdrag", "Timeregnskap og honorarfordeling", "Frilanserhonorarer og underleverandører", "MVA-oppgjør for kreative bransjer", "Løpende bokføring og bilag", "Årsregnskap og skattemelding", "Lønnsomhetsanalyse per prosjekt", "Budsjett og likviditetsstyring"],
    intro: "Arkitekter og designere lever av prosjekter med varierende lønnsomhet. Vi gir deg kontroll på timer, honorarer og bunnlinjen.",
    body: "Prosjektbasert økonomi med underleverandører, faser og honorarer som strekker seg over tid — vi sørger for at du har oversikt over lønnsomheten i hvert oppdrag.",
  },
  markedsforing: {
    deliverables: ["Kundelønnsomhet per prosjekt", "Mediaspend og gjennomfakturering", "Frilanserhonorarer og underleverandører", "MVA-oppgjør for byrå", "Løpende bokføring og bilag", "Årsregnskap og skattemelding", "Prosjektøkonomi og marginstyring", "Budsjett og likviditetsstyring"],
    intro: "Markedsføring- og reklamebyråer har kompleks prosjektøkonomi med mediaspend, frilansere og gjennomfakturering. Vi holder orden på tallene.",
    body: "Byråer fakturerer timer, mediaspend og underleverandører — ofte i kombinasjon. Vi gir deg oversikt over reell kundelønnsomhet og sørger for korrekt MVA-behandling.",
  },
  bemanning: {
    deliverables: ["Margin per utleid person", "Kompleks lønnskjøring", "Fakturering per oppdrag og kunde", "MVA-oppgjør og innrapportering", "Løpende bokføring og bilag", "Årsregnskap og skattemelding", "Likviditetsstyring ved vekst", "Kontrakts- og marginkontroll"],
    intro: "Bemanningsbyråer har kompleks lønnskjøring, marginberegning per person og høy omsetningshastighet. Vi gir deg oversikten du trenger.",
    body: "Margin per utleid person, forskjellige timesatser og mange kontrakter gjør bemanningsbransjens økonomi krevende. Vi sørger for at du har kontroll og lønnsomhet i hvert oppdrag.",
  },
  reiseliv: {
    deliverables: ["Sesongbasert budsjett og likviditet", "Ulike MVA-satser (overnatting, mat, aktiviteter)", "Bookingplattform-integrasjoner", "Valutahåndtering", "Løpende bokføring og bilag", "Årsregnskap og skattemelding", "Tilskudd og støtteordninger", "Lønnskjøring for sesongansatte"],
    intro: "Reiselivsbransjen har sesongsvingninger, ulike MVA-satser og bookingplattformer. Vi gir deg kontroll året rundt.",
    body: "Overnatting, mat og opplevelser har alle ulike MVA-satser. Sesongbasert drift krever smart likviditetsstyring og budsjett. Vi sørger for at økonomien holder — hele året.",
  },
  bil: {
    deliverables: ["Arbeidsordreanalyse og timesatskalkyle", "Varelager og deler", "MVA på bruktbilsalg (bruktmomsordning)", "Garantiavsetninger", "Løpende bokføring og bilag", "Årsregnskap og skattemelding", "Verkstedøkonomi per bil", "Fakturering og innkreving"],
    intro: "Bilbransjen har spesielle regler for bruktmoms, garantiavsetninger og verkstedøkonomi. Vi holder orden — du fikser bilene.",
    body: "Verksteder og bilforhandlere har en unik økonomi med delerlager, bruktmomsordning og garantiavsetninger. Vi sørger for korrekt behandling og gir deg oversikt per arbeidsordre.",
  },
  energi: {
    deliverables: ["Investeringsanalyser og prosjektøkonomi", "Enova-tilskudd og dokumentasjon", "ESG-rapportering", "Avskrivning av anlegg og utstyr", "MVA-oppgjør for energi", "Løpende bokføring og bilag", "Årsregnskap og skattemelding", "SkatteFUNN og FoU-støtte"],
    intro: "Energi- og miljøselskaper har store investeringer, tilskuddsordninger og ESG-krav. Vi gir deg kontroll på tallene som driver bærekraftig vekst.",
    body: "Fornybar energi, energieffektivisering og miljøteknologi krever presis prosjektøkonomi, Enova-rapportering og ESG-compliance. Vi sørger for at alt er dokumentert og rapportert korrekt.",
  },
};

/* ============================
   HR — all industries (excl. bemanning)
   ============================ */
const hrOverrides: Record<string, SectionBransjeOverride> = {
  "tech-saas": {
    deliverables: ["Arbeidskontrakter for utviklere og tech-ansatte", "Opsjonsprogrammer og aksjeincentiver", "Fleksibel arbeidstid og hjemmekontor-policy", "Onboarding av remote-ansatte", "Lønnskjøring med naturalytelser", "Personalhåndbok for tech-selskaper", "Kompetanseutvikling og fagdager", "Arbeidsrett ved internasjonale ansettelser"],
    intro: "Tech-selskaper har unike HR-utfordringer — fra opsjoner og remote-arbeid til internasjonale ansettelser. Vi tar hele HR-byrden.",
    body: "I tech-bransjen er konkurranseevne om talent, fleksibel arbeidstid og aksjebasert avlønning normen. Vi sørger for at kontrakter, opsjoner og arbeidsvilkår er korrekte og konkurransedyktige.",
  },
  eiendom: {
    deliverables: ["Arbeidskontrakter for meglere og forvaltere", "Provisjonsmodeller og lønnskjøring", "Personalhåndbok for eiendomsforetak", "HMS for eiendomsdrift", "Sykefraværsoppfølging", "Onboarding av nye medarbeidere", "Arbeidstid og fleksibilitet", "Kompetanseutvikling og sertifiseringer"],
    intro: "Eiendomsbransjen har provisjonsbasert avlønning, meglerkrav og variert arbeidstid. Vi sørger for riktige kontrakter og trygg drift.",
    body: "Meglere, forvaltere og driftsansatte har ulike behov — fra provisjonsmodeller til HMS i eiendomsdrift. Vi tilpasser HR-opplegget til din bedrift.",
  },
  holding: {
    deliverables: ["Styremedlemmer og styrehonorar", "Arbeidskontrakter for konsernledelse", "Personalhåndbok på tvers av selskaper", "Lønnskjøring for holdingansatte", "HMS-ansvar i konsernstruktur", "Organisasjonskart og roller", "Compliance og varslingsrutiner", "Kompetanseutvikling for ledere"],
    intro: "Holdingselskaper har ansvar på tvers av selskaper. Vi sørger for at HR-strukturen er korrekt — fra styrehonorar til varslingsrutiner.",
    body: "Konsernledelse, styremedlemmer og ansatte i ulike datterselskaper — vi hjelper deg med å holde orden på alle arbeidsforhold og sørge for compliance.",
  },
  consulting: {
    deliverables: ["Arbeidskontrakter for konsulenter", "Kompetanseutvikling og fagdager", "Fleksibel arbeidstid og reisetid", "Lønnskjøring med bonus og incentiver", "Personalhåndbok for konsulentfirmaer", "HMS og ergonomi (kontorarbeid)", "Onboarding av nye konsulenter", "Rekruttering og employer branding"],
    intro: "Konsulentselskaper kjemper om de beste hodene. Vi hjelper deg med kontrakter, kompetanseutvikling og en arbeidsgiverprofil som tiltrekker talent.",
    body: "Konsulentbransjen har høy mobilitet blant ansatte, komplekse bonusmodeller og behov for kontinuerlig kompetanseutvikling. Vi tar HR-byrden så du kan fokusere på leveransene.",
  },
  landbruk: {
    deliverables: ["Arbeidskontrakter for sesongarbeidere", "Utenlandsk arbeidskraft og dokumentasjon", "HMS på gårdsbruk", "Lønnskjøring med naturalytelser", "Sykefraværsoppfølging", "Bolig for ansatte og pendlere", "Arbeidsrett for primærnæring", "Kompetansekrav og sertifikater"],
    intro: "Landbruket har sesongarbeidere, utenlandsk arbeidskraft og spesielle HMS-krav. Vi sørger for at alt er i orden som arbeidsgiver.",
    body: "Gårdsbruk og landbruk har ulike ansettelsesforhold gjennom sesongen, ofte med utenlandsk arbeidskraft som krever spesiell dokumentasjon. Vi håndterer alt.",
  },
  varehandel: {
    deliverables: ["Arbeidskontrakter for deltid og heltid", "Turnusplanlegging og vaktlister", "Lønnskjøring med kvelds- og helgetillegg", "Personalhåndbok for butikk", "HMS i butikkdrift", "Sykefraværsoppfølging", "Onboarding av butikkmedarbeidere", "Opplæring og kompetanseutvikling"],
    intro: "Varehandelen har mange deltidsansatte, turnus og sesongsvingninger. Vi tar HR-byrden — fra kontrakter til opplæring.",
    body: "Butikker og kjeder har ofte mange deltidsansatte, varierende vaktlister og behov for rask onboarding. Vi sørger for riktige kontrakter og at du følger arbeidsmiljøloven.",
  },
  "bygg-anlegg": {
    deliverables: ["HMS og sikkerhet på byggeplass", "Arbeidskontrakter for prosjektansatte", "Lønnskjøring med overtid og tillegg", "Innleid arbeidskraft og bemanningskontroll", "Sertifikat- og kompetanseregister", "Sykefraværsoppfølging", "Verneombud og arbeidsmiljøutvalg", "Onboarding av nye fagarbeidere"],
    intro: "Byggebransjen har strenge HMS-krav, prosjektbaserte ansettelser og innleid arbeidskraft. Vi sørger for at du er trygg som arbeidsgiver.",
    body: "Byggeplasser krever strenge sikkerhetsrutiner, dokumenterte sertifikater og korrekt håndtering av innleid arbeidskraft. Vi tar hele HR-byrden fra sikkerhet til kontrakter.",
  },
  nettbutikk: {
    deliverables: ["Arbeidskontrakter for lager og kundeservice", "Fleksibel arbeidstid og remote-policy", "Lønnskjøring for sesongtopper", "Personalhåndbok for e-handel", "HMS for lager og kontor", "Sykefraværsoppfølging", "Onboarding av sesongansatte", "Kompetanseutvikling i digital handel"],
    intro: "Nettbutikker har sesongtopper, lager- og kundeserviceansatte med ulike behov. Vi tilpasser HR-opplegget etter din virkelighet.",
    body: "E-handelsselskaper ansetter ofte sesongarbeidere for toppperioder og har ansatte på lager, kundeservice og digitalt. Vi sørger for riktige kontrakter for alle roller.",
  },
  helse: {
    deliverables: ["Turnus og vaktplanlegging", "Lønnskjøring med helge- og nattillegg", "Arbeidskontrakter for helsepersonell", "HMS og smittevern", "Sykefraværsoppfølging og IA-avtale", "Rekruttering av spesialister", "Personalhåndbok tilpasset helsetjenester", "Kompetansekrav og autorisasjoner"],
    intro: "Helsesektoren har spesielle krav til turnus, autorisasjoner og smittevern. Vi tar HR-byrden slik at du kan fokusere på pasientene.",
    body: "Helsepersonell krever spesifikke autorisasjoner, kompleks turnusplanlegging og grundig HMS-oppfølging. Vi sørger for at alt er på plass — så du kan gi best mulig omsorg.",
  },
  restaurant: {
    deliverables: ["Turnusplanlegging og vaktlister", "Lønnskjøring med kvelds- og helgetillegg", "Arbeidskontrakter for deltid og sesong", "HMS i serveringsbransjen", "Sykefraværsoppfølging", "Onboarding av sesongansatte", "Arbeidsrett og overtid", "Kompetansebevis og hygienekurs"],
    intro: "Restaurant og uteliv har høy turnover, skiftarbeid og strenge HMS-krav. Vi tar hele HR-byrden — fra turnusplanlegging til arbeidsrett.",
    body: "Restaurantbransjen har høy turnover, mange deltidsansatte og strenge krav til hygiene og arbeidsforhold. Vi hjelper deg med alt fra vaktlister til HMS-dokumentasjon.",
  },
  frisor: {
    deliverables: ["Arbeidskontrakter for stolleie og fast ansatte", "Lønnskjøring og provisjon", "Personalhåndbok for salonger", "HMS og ergonomi", "Kjemikaliehåndtering og allergi", "Sykefraværsoppfølging", "Onboarding av nye stylister", "Kompetanseutvikling og kurs"],
    intro: "Frisørbransjen har en unik mix av fast ansatte og stolleiere. Vi sørger for riktige kontrakter og trygg drift.",
    body: "Salonger har ofte en blanding av fast ansatte, stolleiere og lærlinger — alle med ulike kontraktsbehov. Vi sørger for riktig arbeidsforhold, HMS og ergonomi for alle.",
  },
  handverkere: {
    deliverables: ["Arbeidskontrakter for fagarbeidere", "Lønnskjøring med reisetid og diett", "HMS på arbeidsplassen", "Sertifikat- og kompetanseregister", "Lærlingeordning og opplæring", "Sykefraværsoppfølging", "Personalhåndbok for håndverksbedrifter", "Arbeidstid og overtid"],
    intro: "Håndverksbedrifter har fagarbeidere med spesielle kompetansekrav, reisevirksomhet og HMS-utfordringer. Vi holder orden på alt.",
    body: "Fagarbeidere ute hos kunder betyr reisetid, diett, overtid og sertifikatkrav. Vi sørger for at kontrakter, lønn og HMS er korrekt — og at du er en trygg arbeidsgiver.",
  },
  transport: {
    deliverables: ["Lønnskjøring med kjøre- og hviletid", "Arbeidskontrakter for sjåfører", "Yrkessjåførkompetanse og sertifikater", "HMS og kjøretøysikkerhet", "Sykefraværsoppfølging", "Arbeidstidsbestemmelser (EU-regler)", "Onboarding av nye sjåfører", "Overtid og diettgodtgjørelse"],
    intro: "Transportbransjen har spesielle arbeidstidsregler, sertifikatkrav og HMS-utfordringer. Vi sørger for at du er trygg som arbeidsgiver.",
    body: "Kjøre- og hviletidsregler, yrkessjåførkompetanse og EU-regler for arbeidstid gjør transportbransjens HR-arbeid komplisert. Vi tar hele byrden.",
  },
  industri: {
    deliverables: ["HMS og sikkerhet i produksjon", "Lønnskjøring med skifttillegg", "Arbeidskontrakter for skiftarbeidere", "Verneombud og arbeidsmiljøutvalg", "Sykefraværsoppfølging og IA", "Kompetansekrav og sertifiseringer", "Onboarding med sikkerhetskurs", "Arbeidstidsordninger og turnus"],
    intro: "Industri og produksjon har strenge HMS-krav, skiftarbeid og sertifiseringsbehov. Vi sørger for trygge arbeidsforhold.",
    body: "Skiftarbeid, verneombud, arbeidsmiljøutvalg og strenge sikkerhetskrav — produksjonsbedrifter har et omfattende HR-ansvar. Vi tar hele byrden.",
  },
  renhold: {
    deliverables: ["Lønnskjøring for mange ansatte", "Arbeidskontrakter med varierende arbeidstid", "HMS og kjemikaliehåndtering", "Sykefraværsoppfølging", "Onboarding og språkopplæring", "Allmenngjorte tariffavtaler", "Overtid og reisetid", "Kompetansebevis og ID-kort"],
    intro: "Renholdsbransjen har mange ansatte, allmenngjorte tariffer og krevende HMS-regler. Vi holder orden på alt som arbeidsgiver.",
    body: "Med mange ansatte, ulike arbeidssteder og strenge krav til kjemikaliehåndtering og ID-kort er HR i renhold en stor oppgave. Vi gjør den enkel.",
  },
  kultur: {
    deliverables: ["Frilanskontrakter og engasjementsavtaler", "Lønnskjøring for prosjektansatte", "Arbeidsrett for korttidsengasjementer", "HMS for scenekunst og media", "Rettigheter og avgifter (TONO, GRAMO)", "Onboarding av freelancere", "Personalhåndbok for kulturorganisasjoner", "Kompetanseutvikling og workshops"],
    intro: "Kulturbransjen bruker frilansere, prosjektansatte og korttidsengasjementer. Vi sørger for riktige kontrakter og oppgjør.",
    body: "Film, teater, musikk og media har en unik arbeidsgivervirkelighet med frilansere, rettigheter og kortvarige engasjementer. Vi tar alt det administrative.",
  },
  sport: {
    deliverables: ["Arbeidskontrakter for PT-er og instruktører", "Provisjonsmodeller og lønnskjøring", "HMS for treningssentre", "Sykefraværsoppfølging", "Onboarding av nye instruktører", "Personalhåndbok for treningsbransjen", "Vaktlister og turnusplanlegging", "Kompetansekrav og sertifiseringer"],
    intro: "Treningssentre og idrettsorganisasjoner har instruktører, PT-er og provisjonsbasert avlønning. Vi holder orden på alt.",
    body: "PT-kontrakter, provisjon, gruppetrening og sesongansatte — treningsbransjen har mange ulike roller. Vi sørger for riktige kontrakter og HMS for alle.",
  },
  utdanning: {
    deliverables: ["Arbeidskontrakter for lærere og kursholdere", "Frilanserhonorarer og gjestforelesere", "Lønnskjøring med ulike stillingsprosenter", "Personalhåndbok for utdanning", "HMS for undervisningslokaler", "Sykefraværsoppfølging", "Onboarding av nye lærere", "Kompetanseutvikling og videreutdanning"],
    intro: "Utdanningsinstitusjoner har faste og timelærere, frilansere og komplekse stillingsbrøker. Vi tar HR-byrden.",
    body: "Skoler og kursarrangører har en blanding av faste ansatte, timebetalte lærere og gjestforelesere. Vi sørger for riktige kontrakter og at du overholder lovkravene.",
  },
  juridisk: {
    deliverables: ["Arbeidskontrakter for advokater og jurister", "Partnerkompensasjon og overskuddsdeling", "Lønnskjøring med bonus", "Personalhåndbok for advokatfirmaer", "HMS for kontorarbeid", "Sykefraværsoppfølging", "Onboarding av nye advokater", "Etikk og varslingsrutiner"],
    intro: "Advokatfirmaer har partnerstrukturer, bonusmodeller og strenge etiske krav. Vi tar HR — du tar sakene.",
    body: "Partnerkompensasjon, bonus for assosierte advokater og strenge krav til etikk og taushetsplikt gjør HR i advokatbransjen spesiell. Vi sørger for at alt er korrekt.",
  },
  arkitektur: {
    deliverables: ["Arbeidskontrakter for arkitekter og designere", "Fleksibel arbeidstid og prosjektperioder", "Lønnskjøring med overtid", "Personalhåndbok for kreative bransjer", "HMS og ergonomi", "Sykefraværsoppfølging", "Onboarding av nye medarbeidere", "Kompetanseutvikling og faglig oppdatering"],
    intro: "Arkitektkontorer har prosjektbasert arbeid, fleksibel arbeidstid og høye krav til faglig utvikling. Vi tar HR-byrden.",
    body: "Arkitekter og designere jobber prosjektbasert med perioder av høy belastning. Vi sørger for at kontrakter, arbeidstid og kompetanseutvikling er på plass.",
  },
  markedsforing: {
    deliverables: ["Arbeidskontrakter for kreative og strategiske roller", "Frilanserhåndtering og underleverandører", "Lønnskjøring med bonus og incentiver", "Personalhåndbok for byråer", "HMS og ergonomi (kontorarbeid)", "Sykefraværsoppfølging", "Onboarding av nye medarbeidere", "Employer branding og rekruttering"],
    intro: "Markedsføringsbyråer har kreative team, frilansere og høy turnover. Vi sørger for riktige kontrakter og en attraktiv arbeidsplass.",
    body: "Byråer ansetter kreative, strateger og frilansere — ofte med bonusordninger og fleksible arbeidsformer. Vi tar HR-byrden slik at du kan fokusere på kreativiteten.",
  },
  reiseliv: {
    deliverables: ["Arbeidskontrakter for sesongansatte", "Turnusplanlegging og vaktlister", "Lønnskjøring med tillegg", "HMS for overnatting og opplevelser", "Sykefraværsoppfølging", "Onboarding av sesongarbeidere", "Utenlandsk arbeidskraft og dokumentasjon", "Språkopplæring og kundeservice"],
    intro: "Reiselivsbransjen har sesongarbeidere, turnus og utenlandsk arbeidskraft. Vi sørger for at du er trygg som arbeidsgiver.",
    body: "Hoteller, turistaktiviteter og reisearrangører ansetter mange sesongarbeidere med ulik bakgrunn. Vi håndterer kontrakter, lønn og HMS tilpasset din virkelighet.",
  },
  bil: {
    deliverables: ["Arbeidskontrakter for mekanikere og selgere", "Lønnskjøring med provisjon og tillegg", "HMS for verksteder", "Sertifikat- og kompetanseregister", "Sykefraværsoppfølging", "Onboarding av nye medarbeidere", "Personalhåndbok for bilbransjen", "Lærlingeordning"],
    intro: "Bilbransjen har mekanikere, selgere og lærlinger med ulike avtaler. Vi sørger for riktige kontrakter og trygg drift.",
    body: "Verksteder og bilforhandlere har en blanding av mekanikere på fast lønn og selgere med provisjon. Vi tilpasser HR-opplegget til din virkelighet.",
  },
  energi: {
    deliverables: ["Arbeidskontrakter for ingeniører og teknikere", "HMS for energianlegg", "Sertifikat- og kompetanseregister", "Lønnskjøring med beredskap og tillegg", "Sykefraværsoppfølging", "Onboarding med sikkerhetskurs", "Personalhåndbok for energisektoren", "Kompetanseutvikling og faglig oppdatering"],
    intro: "Energisektoren har strenge sikkerhetskrav, beredskapsordninger og spesialisert personell. Vi tar hele HR-byrden.",
    body: "Energi- og miljøselskaper har høyt kvalifiserte ansatte, strenge HMS-krav og beredskapsvakter. Vi sørger for at alt er korrekt dokumentert og at du er en trygg arbeidsgiver.",
  },
};

/* ============================
   MARKEDSFØRING — all industries (excl. markedsforing)
   ============================ */
const markedsforingOverrides: Record<string, SectionBransjeOverride> = {
  "tech-saas": {
    deliverables: ["Product-led growth og freemium-strategi", "Google Ads for SaaS og B2B", "SEO for produktsider og dokumentasjon", "LinkedIn B2B-kampanjer", "Content marketing og thought leadership", "E-postmarkedsføring og onboarding-flows", "Konverteringsoptimalisering", "Analyse og attribution"],
    intro: "Tech-selskaper trenger vekststrategi — fra product-led growth til B2B-leadgenerering. Vi bygger kampanjer som skalerer med deg.",
    body: "SaaS-markedsføring handler om å drive signups, redusere churn og skalere pipeline. Vi forstår funnel-tenking, attribution og vekstmetrikker — og lager kampanjer som driver målbare resultater.",
  },
  eiendom: {
    deliverables: ["Boligannonsering på Finn.no og SoMe", "Google Ads for eiendomsmegling", "SEO for prosjektsalg og utleie", "Visuell profil og prospektmateriale", "Drone- og videofoto for salg", "Lokal synlighet og Google Business", "Innholdsstrategi for eiendomssider", "Analyse og konverteringsoptimalisering"],
    intro: "Eiendomsbransjen handler om synlighet og tillit. Vi hjelper deg å nå riktig kjøper gjennom søk, annonser og visuelt innhold.",
    body: "Eiendomsmarkedsføring krever visuelt sterkt innhold, lokal SEO og målrettet annonsering. Vi sørger for at dine eiendommer skiller seg ut og tiltrekker riktige kjøpere.",
  },
  holding: {
    deliverables: ["Corporate branding og posisjonering", "Nettside med porteføljeoversikt", "Investorkommunikasjon", "LinkedIn-strategi", "Årsrapport og visuell identitet", "PR og medierelasjon", "SEO for corporate sider", "Analyse og synlighetsrapportering"],
    intro: "Holdingselskaper trenger troverdig posisjonering og profesjonell investorkommunikasjon. Vi bygger synligheten som reflekterer verdiene.",
    body: "Corporate branding for holdingselskaper handler om troverdighet, profesjonalitet og tydelig kommunikasjon med investorer og partnere.",
  },
  consulting: {
    deliverables: ["LinkedIn-strategi og thought leadership", "SEO for konsulenttjenester", "Google Ads for B2B-leadgenerering", "Innholdsstrategi og fagartikler", "Nettside optimalisert for henvendelser", "E-postmarkedsføring og nurturing", "Webinarer og digital synlighet", "Analyse og leadkvalitet"],
    intro: "Konsulentbransjen selger kompetanse og tillit. Vi hjelper deg å bygge synlighet og troverdighet i riktige kanaler.",
    body: "Konsulenter trenger synlighet som bygger tillit — fagartikler, LinkedIn-strategi og målrettet B2B-annonsering som genererer kvalifiserte leads.",
  },
  landbruk: {
    deliverables: ["Lokal SEO og Google Business", "Nettside for gårdsutsalg og opplevelser", "SoMe-markedsføring for lokalmat", "Sesongkampanjer og arrangementer", "E-postmarkedsføring til faste kunder", "Foto og video av gårdsdriften", "Annonsering på relevante plattformer", "Omdømmehåndtering"],
    intro: "Gårdsutsalg, matopplevelser og direktesalg — vi hjelper deg å nå kundene som setter pris på lokale kvalitetsprodukter.",
    body: "Landbruket selger stadig mer direkte til forbrukere gjennom gårdsutsalg, REKO-ringer og opplevelser. Vi hjelper deg å bygge synlighet og tiltrekke riktige kunder.",
  },
  varehandel: {
    deliverables: ["Google Shopping og produktannonsering", "Lokal SEO og Google Business", "Meta/SoMe-kampanjer for butikk", "Kampanjer for salg og sesong", "Kundelojalitetsprogram", "Innholdsstrategi og nyhetsbrev", "Nettside og nettbutikk", "Analyse og omsetningsrapportering"],
    intro: "Varehandelen lever av synlighet, trafikk og lojalitet. Vi hjelper deg å trekke kunder inn — fysisk og digitalt.",
    body: "Butikker og kjeder trenger lokal synlighet, sesongkampanjer og lojale kunder. Vi bygger strategien som driver trafikk og omsetning.",
  },
  "bygg-anlegg": {
    deliverables: ["Lokal SEO for entreprenører", "Google Ads for byggetjenester", "Nettside med prosjektportefølje", "Referansecases og kundehistorier", "LinkedIn for B2B og anbud", "Google Business-optimalisering", "Anmeldelseshåndtering", "Analyse og leadgenerering"],
    intro: "Byggebransjen lever av rykte og lokale oppdrag. Vi hjelper deg å bli synlig for riktige kunder — og vinne flere anbud.",
    body: "Entreprenører og byggefirmaer trenger lokal synlighet, sterke referanser og en profesjonell nettside. Vi bygger strategien som fyller ordreboken.",
  },
  nettbutikk: {
    deliverables: ["Google Shopping og produktannonsering", "SEO for produktsider", "Meta/SoMe-annonsering for e-handel", "E-postmarkedsføring og automatisering", "Konverteringsoptimalisering", "Remarketing og kundereise", "Innholdsstrategi og produktbeskrivelser", "Analyse og ROI-rapportering"],
    intro: "Nettbutikk handler om å konvertere besøkende til kunder. Vi lager kampanjer som selger — og måler alt ned til siste krone.",
    body: "E-handel krever datadrevet markedsføring — fra produktannonsering og SEO til remarketing og e-postautomatisering. Vi optimaliserer hele kundereisen.",
  },
  helse: {
    deliverables: ["Lokal SEO for klinikker", "Google Ads for helserelaterte søk", "Innholdsstrategi og fagartikler", "Nettside optimalisert for booking", "SoMe-tilstedeværelse og troverdighet", "Omdømmehåndtering og anmeldelser", "Pasienthistorier og case studies", "Analyse og konverteringsoptimalisering"],
    intro: "Helsebransjen krever troverdig, faglig markedsføring. Vi hjelper deg å bli synlig uten å bryte tillit eller etiske retningslinjer.",
    body: "Klinikker og helseforetak trenger synlighet bygget på faglig troverdighet — ikke overpromises. Vi lager strategier som bygger tillit og trekker riktige pasienter.",
  },
  restaurant: {
    deliverables: ["Google Business og lokale søk", "Instagram og Facebook-markedsføring", "Matfotografi og visuelt innhold", "Lokal SEO for restauranter", "Eventmarkedsføring og kampanjer", "Anmeldelseshåndtering og omdømme", "Menydesign og nettbestilling", "Sesongkampanjer og tilbud"],
    intro: "Restauranter lever av omtale, synlighet og gjester. Vi hjelper deg å fylle bordene med riktig markedsføring.",
    body: "Mat selger visuelt — Instagram, Google-anmeldelser og lokal SEO er nøklene til fulle bord. Vi bygger strategien som gjør restauranten din til et førsteval.",
  },
  frisor: {
    deliverables: ["Instagram-markedsføring med visuelt innhold", "Lokal SEO og Google Business", "Bookingoptimalisering på nett", "Kampanjer for nye kunder", "Kundelojalitetsprogram", "Produktsalg og mersalg-strategi", "Omdømmehåndtering og anmeldelser", "Sesongkampanjer og tilbud"],
    intro: "Frisører lever av visuelt innhold og lokal synlighet. Vi hjelper deg å fylle timeboken med riktig markedsføring.",
    body: "Før/etter-bilder, Instagram og Google-anmeldelser er nøklene for salonger. Vi bygger strategien som tiltrekker nye kunder og holder de faste lojale.",
  },
  handverkere: {
    deliverables: ["Lokal SEO for håndverkere", "Google Ads for lokale tjenester", "Nettside med referanser og tjenesteoversikt", "Google Business-optimalisering", "Anmeldelseshåndtering", "SoMe-markedsføring med prosjektbilder", "Kampanjer for sesong", "Analyse og leadgenerering"],
    intro: "Håndverkere lever av rykte og lokale oppdrag. Vi sørger for at du dukker opp når kundene søker — og at referansene dine gjør jobben.",
    body: "Elektrikere, rørleggere og malere — kundene dine søker lokalt. Vi bygger lokal synlighet med sterke anmeldelser og en profesjonell nettside.",
  },
  transport: {
    deliverables: ["SEO for transporttjenester", "Google Ads for frakt og logistikk", "Nettside med tjenesteoversikt", "LinkedIn for B2B-kunder", "Lokal synlighet for varetransport", "Referansecases og kundecases", "E-postmarkedsføring til bedriftskunder", "Analyse og leadgenerering"],
    intro: "Transportselskaper trenger synlighet mot bedriftskunder. Vi bygger strategien som fyller lasteplanene.",
    body: "Transport og logistikk selger til andre bedrifter — det krever B2B-fokusert markedsføring med LinkedIn, SEO og målrettet annonsering.",
  },
  industri: {
    deliverables: ["SEO for industriprodukter", "LinkedIn for B2B-markedsføring", "Google Ads for industrielle løsninger", "Nettside med produktkatalog", "Fagartikler og teknisk innhold", "Messer og events-markedsføring", "E-postmarkedsføring til innkjøpere", "Analyse og leadgenerering"],
    intro: "Industribedrifter trenger B2B-markedsføring som når innkjøpere og beslutningstakere. Vi bygger synligheten som driver ordrer.",
    body: "Industriell markedsføring handler om teknisk troverdighet, produktdokumentasjon og målrettet B2B-annonsering. Vi lager strategien som når riktige beslutningstakere.",
  },
  renhold: {
    deliverables: ["Lokal SEO for renholdstjenester", "Google Ads for bedriftsrenhold", "Nettside med tjenester og priser", "Google Business-optimalisering", "Anmeldelseshåndtering og omdømme", "LinkedIn for B2B-kunder", "Kampanjer for nye kontrakter", "Analyse og leadgenerering"],
    intro: "Renholdsselskaper trenger synlighet mot bedriftskunder og borettslag. Vi bygger strategien som fyller kontraktsboken.",
    body: "Renhold selger til bedrifter, borettslag og privatpersoner — det krever lokal synlighet, gode anmeldelser og en profesjonell nettside.",
  },
  kultur: {
    deliverables: ["SoMe-markedsføring for events og produksjoner", "Billettsalg og konverteringsoptimalisering", "PR og mediekontakt", "Innholdsstrategi og storytelling", "Nettside for produksjoner og artister", "E-postmarkedsføring og nyhetsbrev", "Video og kreativt innhold", "Analyse og publikumsutvikling"],
    intro: "Kulturbransjen trenger synlighet som fyller saler og skjermer. Vi bygger kampanjer som når riktig publikum.",
    body: "Film, teater, musikk og festivaler — alle lever av oppmerksomhet og engasjement. Vi bygger kampanjer som driver billettsalg og bygger lojale fans.",
  },
  sport: {
    deliverables: ["Lokal SEO for treningssentre", "Meta-annonsering for medlemsverving", "Google Ads for trenings- og aktivitetstilbud", "Instagram-markedsføring og treningsinnhold", "Kampanjer for sesongstart og nyårsforsetter", "Medlemslojalitet og retensjonsstrategier", "Nettside med booking og klasseoversikt", "Analyse og konverteringsoptimalisering"],
    intro: "Treningssentre lever av medlemmer. Vi hjelper deg med markedsføring som verve nye og holder de eksisterende lojale.",
    body: "Treningsbransjen har tydelige sesongtopper — nyttår, vår og høst. Vi lager kampanjer som treffer på riktig tidspunkt og driver innmeldinger.",
  },
  utdanning: {
    deliverables: ["SEO for kurs og utdanningstilbud", "Google Ads for kursmarkedsføring", "SoMe-annonsering for målgrupper", "E-postmarkedsføring og påmelding", "Nettside med kurstilbud og booking", "Innholdsstrategi og fagartikler", "Webinar-markedsføring", "Analyse og konverteringsoptimalisering"],
    intro: "Kursarrangører og utdanningstilbydere trenger synlighet som driver påmeldinger. Vi lager kampanjer som fyller kursene.",
    body: "Utdanning og kurs selges online — gode landingssider, målrettet annonsering og automatiserte påminnelser er nøklene til fulle kurslister.",
  },
  juridisk: {
    deliverables: ["SEO for juridiske tjenester", "Google Ads for advokater", "LinkedIn-strategi for faglig profil", "Innholdsstrategi med fagartikler", "Nettside optimalisert for henvendelser", "Omdømmehåndtering og anmeldelser", "E-postmarkedsføring til bedriftskunder", "Analyse og leadgenerering"],
    intro: "Advokatfirmaer trenger synlighet bygget på faglig troverdighet. Vi hjelper deg å bli funnet av riktige klienter.",
    body: "Juridisk markedsføring handler om tillit og fagkompetanse. Fagartikler, case studies og målrettet annonsering bygger klientporteføljen din.",
  },
  arkitektur: {
    deliverables: ["Portfolio-nettside med prosjekter", "Instagram og Pinterest-markedsføring", "SEO for arkitekt- og designtjenester", "PR og medieeksponering", "Innholdsstrategi og prosjekthistorier", "LinkedIn for B2B-posisjonering", "Google Ads for arkitekttjenester", "Analyse og synlighetsrapportering"],
    intro: "Arkitekter og designere selger med visuelt innhold. Vi bygger synligheten som viser frem arbeidet ditt til riktige oppdragsgivere.",
    body: "Arkitektur- og designbransjen er visuell — portfolio, Instagram og PR er nøklene til nye oppdrag. Vi bygger strategien som viser frem prosjektene dine.",
  },
  bemanning: {
    deliverables: ["SEO for bemanningstjenester", "Google Ads for vikarbyrå og rekruttering", "LinkedIn-strategi for kandidater og kunder", "Employer branding og rekrutteringsinnhold", "Nettside med stillingsutlysninger", "SoMe-annonsering for kandidater", "E-postmarkedsføring til bedriftskunder", "Analyse og leadgenerering"],
    intro: "Bemanningsbyråer trenger synlighet mot både kandidater og oppdragsgivere. Vi bygger strategien som tiltrekker begge sider.",
    body: "Bemanning handler om å matche kandidater med bedrifter. Markedsføringen må treffe begge målgrupper — med riktig budskap i riktige kanaler.",
  },
  reiseliv: {
    deliverables: ["Google Ads for reisesøk", "SEO for destinasjoner og opplevelser", "Instagram og Pinterest-markedsføring", "Bookingoptimalisering", "Sesongkampanjer og pakkereiser", "Innholdsstrategi og reiseguider", "Anmeldelseshåndtering og TripAdvisor", "Konverteringsoptimalisering"],
    intro: "Reiselivsbransjen lever av drømmer og opplevelser. Vi bygger markedsføring som inspirerer — og konverterer til bookinger.",
    body: "Reiseliv selger opplevelser — det krever visuelt sterkt innhold, sesongkampanjer og synlighet på Google og sosiale medier. Vi driver bookinger hele året.",
  },
  bil: {
    deliverables: ["Lokal SEO for bilverksted og -forhandler", "Google Ads for reparasjoner og salg", "Nettside med tjenester og bruktbiler", "Google Business-optimalisering", "SoMe-markedsføring med kundehistorier", "Anmeldelseshåndtering", "Kampanjer for sesong (vinterdekk, EU-kontroll)", "Analyse og konverteringsoptimalisering"],
    intro: "Bilbransjen trenger lokal synlighet og tillit. Vi sørger for at verkstedet eller forhandleren din er førstevalet i området.",
    body: "Bilverksteder og -forhandlere lever av lokale kunder. Gode anmeldelser, lokal SEO og sesongkampanjer er nøklene til fulle verksteder og bilsalg.",
  },
  energi: {
    deliverables: ["SEO for energiløsninger", "Google Ads for bærekraftige tjenester", "LinkedIn for B2B-posisjonering", "Innholdsstrategi og ESG-kommunikasjon", "Nettside med løsningskatalog", "PR og medieeksponering", "SoMe-kampanjer for bærekraft", "Analyse og leadgenerering"],
    intro: "Energi- og miljøselskaper trenger kommunikasjon som bygger tillit og driver salg av bærekraftige løsninger.",
    body: "Bærekraft selger — men det krever troverdig kommunikasjon. Vi bygger markedsstrategien som posisjonerer deg som en pålitelig partner for grønn omstilling.",
  },
};

/* ============================
   IT — all industries (excl. tech-saas)
   ============================ */
const itOverrides: Record<string, SectionBransjeOverride> = {
  eiendom: {
    deliverables: ["Eiendomsportal og prosjektside", "Bookingsystem for visninger", "CRM for kundeoppfølging", "Internt dashboard for portefølje", "Automatisert prospektgenerering", "Integrasjon med Finn.no", "AI-chatbot for henvendelser", "Vedlikehold og sikkerhet"],
    intro: "Eiendomsbransjen trenger digitale verktøy for visninger, prospekter og kundeoppfølging. Vi bygger systemene som effektiviserer salg og utleie.",
    body: "Visningspåmelding, prospekter og kundekommunikasjon — alt kan digitaliseres og automatiseres. Vi bygger verktøyene som gjør eiendomsdriften enklere.",
  },
  holding: {
    deliverables: ["Porteføljedashboard for holdingselskaper", "Rapporteringssystem for datterselskaper", "Investorportal", "Automatisert konsolidering", "Dokumenthåndteringssystem", "Styreportal og møteadministrasjon", "Integrasjon med regnskap", "Sikkerhet og tilgangsstyring"],
    intro: "Holdingselskaper trenger oversikt over porteføljen og effektiv rapportering. Vi bygger dashboards og systemer som gir full kontroll.",
    body: "Med flere selskaper trenger du sentrale systemer for rapportering, styrekommunikasjon og dokumenthåndtering. Vi bygger verktøyene som gir oversikten.",
  },
  consulting: {
    deliverables: ["Nettside med tjenestekatalog", "CRM og kundeoppfølging", "Timeregistrering og prosjektstyring", "Automatisert rapportgenerering", "Kundeportal med tilgang til leveranser", "AI-assistent for research", "Internt kunnskapssystem", "Integrasjon med fakturering"],
    intro: "Konsulentselskaper trenger smarte systemer for prosjekter, kunder og leveranser. Vi bygger verktøy som gjør deg mer effektiv.",
    body: "Prosjektstyring, timeregistrering og kundekommunikasjon — alt kan samles i ett system. Vi bygger løsningene som gjør konsulentarbeidet mer effektivt.",
  },
  landbruk: {
    deliverables: ["Nettside for gårdsutsalg", "Bestillingssystem for REKO-ring", "Produksjonsstyring og sporbarhet", "Værdata og avlingsprognose", "Automatisert tilskuddsrapportering", "Mobilapp for gårdsdrift", "IoT-integrasjon for fjøs og drivhus", "Nettbutikk for lokalmat"],
    intro: "Moderne landbruk trenger digitale verktøy for produksjon, sporbarhet og direktesalg. Vi bygger løsningene som effektiviserer gårdsdriften.",
    body: "Fra IoT-sensorer i fjøset til nettbutikk for lokalmat — digitalisering gir landbruket nye muligheter. Vi bygger verktøyene som passer din gård.",
  },
  varehandel: {
    deliverables: ["Nettbutikk med fysisk butikk-integrasjon", "Kassasystem og POS-integrasjon", "Lagerstyring og varetelling", "Kundelojalitetssystem", "CRM for kundekommunikasjon", "Automatisert bestilling og innkjøp", "Dashboard for salgsrapportering", "Mobilapp for kunder"],
    intro: "Varehandelen trenger sømløs integrasjon mellom butikk og nett. Vi bygger systemene som gir deg full kontroll.",
    body: "Omnikanalhandel krever systemer som snakker sammen — POS, nettbutikk, lager og kundedata. Vi bygger integrasjonene som gjør hverdagen enklere.",
  },
  "bygg-anlegg": {
    deliverables: ["Prosjektstyringsverktøy", "Digitale sjekklister og dokumentasjon", "Timeregistreringssystem", "Internt dashboard per prosjekt", "Automatisert fakturering", "BIM-integrasjon og filhåndtering", "AI-assistert kalkulering", "Mobiltilpassede byggeplassverktøy"],
    intro: "Byggebransjen trenger digitale verktøy for prosjektstyring, dokumentasjon og kommunikasjon. Vi bygger løsninger som fungerer fra kontoret til byggeplassen.",
    body: "Digitale sjekklister, timeregistrering og prosjektdashboards — byggebransjen trenger verktøy som fungerer med hansker på. Vi bygger dem.",
  },
  nettbutikk: {
    deliverables: ["Skreddersydd nettbutikk", "Betalingsintegrasjon (Vipps/Klarna)", "Lagerstyring og ordrehåndtering", "Automatisert fraktberegning", "Kundeportal og min side", "AI-drevet produktanbefaling", "Integrasjon med ERP/regnskap", "Ytelseoptimalisering og sikkerhet"],
    intro: "En nettbutikk som konverterer krever mer enn et pent design. Vi bygger hele den digitale infrastrukturen — fra bestilling til levering.",
    body: "Betaling, lager, frakt og kundedata — en nettbutikk har mange bevegelige deler. Vi bygger og integrerer alt slik at du kan fokusere på å selge.",
  },
  helse: {
    deliverables: ["Nettside med timebestilling", "Pasientportal og kommunikasjon", "Digitale skjemaer og anamnese", "Automatisert påminnelse (SMS/e-post)", "Internt dashboard og rapportering", "Integrasjon med journalsystem", "AI-chatbot for pasienthenvendelser", "Sikkerhet og personvern"],
    intro: "Helsesektoren trenger sikre, brukervennlige digitale løsninger. Vi bygger bookingsystemer, pasientportaler og automatiseringer tilpasset klinikken din.",
    body: "Pasientdata krever strenge sikkerhetskrav. Vi bygger digitale løsninger som er brukervennlige, sikre og integrert med dine eksisterende systemer.",
  },
  restaurant: {
    deliverables: ["Nettside med meny og bestilling", "Bordbestillingssystem", "Digital meny og QR-bestilling", "Leveringsintegrasjon (Foodora/Wolt)", "Kundelojalitetsapp", "Internt system for vaktlister", "Automatisert varetelling", "POS-integrasjon"],
    intro: "Moderne restauranter trenger digitale bestillingssystemer, menyløsninger og intern effektivisering. Vi bygger det som sparer deg tid.",
    body: "QR-bestilling, bordreservasjon og leveringsintegrasjon — digitale løsninger gjør restaurantdriften mer effektiv. Vi bygger verktøyene som gjester og ansatte setter pris på.",
  },
  frisor: {
    deliverables: ["Bookingsystem for timebestilling", "Nettside med tjenester og priser", "Kundelojalitetsapp", "Automatiserte påminnelser (SMS)", "Kassasystem-integrasjon", "Digital markedsføring-verktøy", "Stolleie-administrasjon", "Produktsalg og nettbutikk"],
    intro: "Salonger trenger enkel booking, påminnelser og kundelojalitet. Vi bygger verktøyene som fyller timeboken.",
    body: "Timebestilling, SMS-påminnelser og kundelojalitet — digitale verktøy gjør salongdriften enklere. Vi bygger løsningene som passer din salong.",
  },
  handverkere: {
    deliverables: ["Nettside med tjenesteoversikt", "Bookingsystem for oppdrag", "Timeregistrering og kjørebok", "Digital tilbuds- og fakturagenerering", "Kundeportal med prosjektstatus", "Mobiltilpassede feltverktøy", "Bildedokumentasjon og rapportering", "Integrasjon med regnskap"],
    intro: "Håndverkere trenger digitale verktøy som fungerer i felten. Vi bygger systemer for tilbud, booking og dokumentasjon.",
    body: "Fra digital tilbudsgenerering til bildedokumentasjon på mobil — vi bygger verktøyene som gjør hverdagen enklere for håndverkere ute hos kunder.",
  },
  transport: {
    deliverables: ["Flåtestyring og GPS-sporing", "Digital kjørebok og rapportering", "Ruteoptimalisering", "Kundeportal for sporing", "Automatisert dokumentasjon", "Integrasjon med tollsystemer", "Dashboard for driftsoversikt", "Mobilapp for sjåfører"],
    intro: "Transportselskaper trenger digital flåtestyring, ruteoptimalisering og sanntidssporing. Vi bygger systemene som gir full kontroll.",
    body: "GPS-sporing, ruteplanlegging og digital dokumentasjon — transport trenger systemer som gir oversikt over hele flåten. Vi bygger dem.",
  },
  industri: {
    deliverables: ["Produksjonsstyringssystem (MES)", "Lagerstyring og varetelling", "Kvalitetskontroll og rapportering", "Internt dashboard og KPI-er", "Automatisert ordrebehandling", "IoT-integrasjon og sensordata", "Vedlikeholdsplanlegging", "ERP-integrasjon"],
    intro: "Produksjonsbedrifter trenger digitale systemer for styring, kvalitetskontroll og automatisering. Vi bygger løsningene som effektiviserer produksjonen.",
    body: "MES, lagerstyring og IoT-integrasjon — moderne produksjon krever digitale systemer som snakker sammen. Vi bygger og integrerer det du trenger.",
  },
  renhold: {
    deliverables: ["Oppdragsstyring og kundeportal", "Timeregistrering for ansatte", "Mobil innsjekking og utsjekking", "Dashboard for driftsoversikt", "Automatisert fakturering", "Kvalitetskontroll og sjekklister", "Integrasjon med regnskap", "Kjørerute-optimalisering"],
    intro: "Renholdsbedrifter trenger digitale systemer for oppdragsstyring, timeregistrering og fakturering. Vi bygger verktøyene som gir kontroll.",
    body: "Med mange ansatte og mange oppdragssteder trenger renholdsselskaper effektive systemer for innsjekking, tidssporing og kvalitetskontroll.",
  },
  kultur: {
    deliverables: ["Nettside for produksjoner og artister", "Billettsystem og booking", "Streaming-plattform", "CRM for publikum og fans", "Nyhetsbrev og e-postautomatisering", "SoMe-integrasjoner", "Innholdshåndteringssystem", "Mobilapp for events"],
    intro: "Kulturbransjen trenger digitale verktøy for billettsalg, streaming og publikumskommunikasjon. Vi bygger plattformene som gir opplevelsene dine rekkevidde.",
    body: "Billettsystem, streaming og fanbase-kommunikasjon — digitale verktøy er avgjørende for kulturproduksjoner. Vi bygger løsningene som treffer publikum.",
  },
  sport: {
    deliverables: ["Bookingsystem for klasser og PT", "Nettside med timeoversikt", "Medlemsportal og app", "Automatisert betalingsoppfølging", "Tilgangskontroll og innsjekking", "Treningsprogram og logging", "Dashboard for medlemsstatistikk", "Integrasjon med betalingssystemer"],
    intro: "Treningssentre trenger booking, medlemsportal og tilgangskontroll. Vi bygger systemene som gjør driften effektiv.",
    body: "Timebestilling, medlemsadministrasjon og tilgangskontroll — digitale løsninger gjør treningssenteret mer effektivt. Vi bygger det som passer din virksomhet.",
  },
  utdanning: {
    deliverables: ["E-læringsplattform (LMS)", "Nettside med kurstilbud og booking", "Betalings- og faktureringsintegrasjon", "Digital kursevaluering", "Sertifikatgenerering", "Videostreaming for undervisning", "Dashboard for kursadministrasjon", "Integrasjon med påmeldingssystemer"],
    intro: "Kursarrangører trenger digitale plattformer for undervisning, påmelding og sertifisering. Vi bygger LMS-et og verktøyene du trenger.",
    body: "E-læring, webinarer og fysiske kurs — alt trenger digitale systemer for påmelding, betaling og oppfølging. Vi bygger plattformen som gir best læringsopplevelse.",
  },
  juridisk: {
    deliverables: ["Nettside med tjenester og fagområder", "Klientsikkert kommunikasjonssystem", "Timeregistrering og saksstyring", "Dokumenthåndtering og arkiv", "AI-assistent for juridisk research", "Kundeportal med saksoversikt", "Integrasjon med fakturering", "Sikkerhet og kryptering"],
    intro: "Advokatfirmaer trenger sikre systemer for saksstyring, klientkommunikasjon og dokumenthåndtering. Vi bygger det med fokus på sikkerhet.",
    body: "Juridisk arbeid krever streng konfidensialitet. Vi bygger sikre systemer for saksstyring, dokumenthåndtering og klientkommunikasjon — med kryptering og tilgangskontroll.",
  },
  arkitektur: {
    deliverables: ["Portfolio-nettside med prosjektgalleri", "Prosjektstyringsverktøy", "Fildelingsplattform for tegninger", "CRM for kundeoppfølging", "3D-visualisering og presentasjon", "Integrasjon med CAD/BIM", "Internt dashboard", "Kundeportal med prosjektstatus"],
    intro: "Arkitektkontorer trenger digitale verktøy for prosjektstyring, presentasjon og kundesamarbeid. Vi bygger plattformene som viser frem arbeidet ditt.",
    body: "3D-visualiseringer, tegningsarkiv og kundeportaler — arkitektbransjen trenger digitale verktøy som matcher det kreative arbeidet. Vi bygger dem.",
  },
  markedsforing: {
    deliverables: ["Dashboard for kampanjeresultater", "Automatisert rapportgenerering", "CRM og leadhåndtering", "Prosjektstyringsverktøy for byråer", "Nettside med casestudier", "Integrasjon med annonseplattformer", "AI-assistent for innholdsproduksjon", "Kundeportal med resultater"],
    intro: "Markedsføringsbyråer trenger dashboards, automatisering og CRM. Vi bygger verktøyene som gjør byråarbeidet mer effektivt.",
    body: "Rapportering, prosjektstyring og kundeportaler — byråer trenger interne systemer som sparer tid og gir kundene transparens. Vi bygger det.",
  },
  bemanning: {
    deliverables: ["Kandidatdatabase og matching", "Oppdragsstyring og kontrakthåndtering", "Timeregistreringssystem", "Kundeportal for oppdragsgivere", "Automatisert fakturering", "Dashboard for margin og lønnsomhet", "Integrasjon med lønnskjøring", "Mobilapp for vikarer"],
    intro: "Bemanningsbyråer trenger systemer for kandidater, oppdrag og fakturering. Vi bygger plattformen som effektiviserer matchen.",
    body: "Kandidatmatching, timeregistrering og kontrakthåndtering — bemanningsbransjen trenger digitale systemer som skalerer med veksten. Vi bygger dem.",
  },
  reiseliv: {
    deliverables: ["Bookingplattform for opplevelser", "Nettside med reiseguider og pakker", "Betalingsintegrasjon og fakturering", "CRM for gjester og kunder", "Automatisert kommunikasjon (SMS/e-post)", "Dashboard for belegg og inntekt", "Integrasjon med OTA-er (Booking.com, Airbnb)", "Mobilapp for gjester"],
    intro: "Reiselivsbedrifter trenger bookingsystemer, gjestekommunikasjon og OTA-integrasjon. Vi bygger de digitale verktøyene som driver bookinger.",
    body: "Hoteller, aktivitetsarrangører og reisebyråer trenger sømløse bookingløsninger og gjestekommunikasjon. Vi bygger systemene som gir bedre opplevelser.",
  },
  bil: {
    deliverables: ["Nettside med bruktbiler og tjenester", "Bookingsystem for verksted", "CRM for kundeoppfølging", "Digital arbeidsordre og dokumentasjon", "Lagerstyring for deler", "Integrasjon med bilregisteret", "Dashboard for verkstedøkonomi", "Automatiserte servicepåminnelser"],
    intro: "Bilverksteder og -forhandlere trenger digitale systemer for booking, arbeidsordre og kundeoppfølging. Vi bygger verktøyene.",
    body: "Digital arbeidsordre, servicepåminnelser og bruktbilvisning — bilbransjen trenger effektive systemer. Vi bygger løsningene som gir full kontroll.",
  },
  energi: {
    deliverables: ["Dashboard for energiproduksjon og forbruk", "IoT-integrasjon og sensorovervåking", "Kundeportal for energitjenester", "Rapporteringssystem for ESG", "Prosjektstyringsverktøy", "Automatisert Enova-rapportering", "Nettside med løsningskatalog", "AI-drevet energioptimalisering"],
    intro: "Energi- og miljøselskaper trenger dashboards, IoT-integrasjon og rapporteringssystemer. Vi bygger teknologien som driver bærekraftig drift.",
    body: "Energiproduksjon, IoT-sensorer og ESG-rapportering — energisektoren trenger avanserte digitale systemer. Vi bygger og integrerer verktøyene som gir full innsikt.",
  },
};

/**
 * Returns section-specific content for a given industry page.
 * Falls back to null (use original content) if no match.
 */
export function getSectionBransjeContent(
  sectionId: SectionId,
  industryHref: string
): SectionBransjeOverride | null {
  const slug = industryHref.replace("/bransjer/", "");

  const overrideMap: Record<SectionId, Record<string, SectionBransjeOverride>> = {
    regnskap: regnskapOverrides,
    hr: hrOverrides,
    markedsforing: markedsforingOverrides,
    it: itOverrides,
  };

  return overrideMap[sectionId]?.[slug] || null;
}
