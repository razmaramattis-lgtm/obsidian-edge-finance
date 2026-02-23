import type { SectionId } from "@/contexts/SectionContext";

/**
 * Industries to HIDE per section (they overlap with the section's own domain).
 * Key = section, value = industry slugs to exclude.
 */
export const hiddenIndustriesPerSection: Record<SectionId, string[]> = {
  regnskap: [],
  hr: ["bemanning"],
  markedsforing: ["markedsforing"],
  it: ["tech-saas"],
};

/* ─────────── Section-specific industry content ─────────── */

interface SectionBransjeOverride {
  deliverables: string[];
  intro: string;
  body: string;
}

/**
 * Default section-specific content templates.
 * Used when no industry-specific override exists.
 * `{name}` is replaced with the industry name at runtime.
 */
const regnskapDefaults: SectionBransjeOverride = {
  deliverables: [
    "Løpende bokføring og bilagsbehandling",
    "MVA-oppgjør og innrapportering",
    "Årsregnskap og skattemelding",
    "Lønnskjøring og A-melding",
    "Bransjespesifikk rapportering",
    "CFO-rådgivning og budsjett",
    "Skatteplanlegging og fradragsoptimalisering",
    "Fakturering og innkreving",
  ],
  intro: "Du driver bedriften — vi tar oss av tallene. Med en dedikert regnskapsfører som kjenner bransjen din, får du full kontroll på økonomi, skatt og rapportering.",
  body: "Hver bransje har egne økonomiske utfordringer — fra spesielle fradragsregler og MVA-satser til bransjespesifikke rapporteringskrav. Vi sørger for at regnskapet ditt er korrekt, optimalisert og levert i tide, slik at du kan fokusere på det du gjør best.",
};

const hrDefaults: SectionBransjeOverride = {
  deliverables: [
    "Lønnskjøring og personaladministrasjon",
    "Arbeidskontrakter tilpasset bransjen",
    "Personalhåndbok og retningslinjer",
    "HMS-dokumentasjon og oppfølging",
    "Arbeidsrett og compliance",
    "Sykefravær og oppfølgingsplaner",
    "Onboarding og offboarding",
    "Kompetanseutvikling og kursplan",
  ],
  intro: "Å være arbeidsgiver er krevende nok. Vi tar HR-byrden fra skuldrene dine — med lønn, kontrakter, HMS og arbeidsrett tilpasset din bransje.",
  body: "Arbeidsgiveransvaret er likt for alle, men utfordringene varierer enormt fra bransje til bransje. Turnus, sesongarbeidere, frilansere, HMS-krav og tariffavtaler — vi kjenner reglene som gjelder for din bransje og sørger for at du gjør alt riktig som arbeidsgiver.",
};

const markedsforingDefaults: SectionBransjeOverride = {
  deliverables: [
    "SEO og synlighet på Google",
    "Google Ads-kampanjer",
    "Meta/SoMe-annonsering",
    "Innholdsstrategi og content marketing",
    "Nettside optimalisert for konvertering",
    "Lokal synlighet og Google Business",
    "Bransjespesifikk annonsestrategi",
    "Analyse og rapportering av resultater",
  ],
  intro: "Kundene dine søker allerede etter det du tilbyr. Vi sørger for at de finner deg — med markedsføring tilpasset din bransje og ditt marked.",
  body: "Markedsføring som fungerer i én bransje fungerer sjelden i en annen. Vi forstår kjøpsreisen til kundene dine, vet hvilke kanaler som gir best avkastning og lager kampanjer som faktisk konverterer — basert på data, ikke gjetning.",
};

const itDefaults: SectionBransjeOverride = {
  deliverables: [
    "Skreddersydd nettside",
    "Booking- og bestillingssystem",
    "CRM og kundeoppfølging",
    "Internt dashboard og rapportering",
    "AI-chatbot for kundeservice",
    "Automatisering av arbeidsprosesser",
    "Integrasjon med eksisterende systemer",
    "Sikkerhet og vedlikehold",
  ],
  intro: "Teknologi skal gjøre hverdagen enklere — ikke vanskeligere. Vi bygger nettsider, systemer og automatiseringer tilpasset din bransje.",
  body: "Hver bransje har sine egne digitale behov — fra bookingsystemer og kundeportaler til lagerstyring og automatisert fakturering. Vi bygger løsninger som faktisk løser problemene dine, uten unødvendig kompleksitet.",
};

const sectionDefaults: Record<SectionId, SectionBransjeOverride> = {
  regnskap: regnskapDefaults,
  hr: hrDefaults,
  markedsforing: markedsforingDefaults,
  it: itDefaults,
};

/**
 * Industry-specific overrides per section.
 * Only fields that differ from the section default need to be specified.
 */
const industryOverrides: Record<SectionId, Record<string, Partial<SectionBransjeOverride>>> = {
  regnskap: {
    "tech-saas": {
      deliverables: ["MRR/ARR-rapportering og SaaS-metrikker", "Investorregnskap og cap table", "Skattefunn-søknader og dokumentasjon", "Opsjonsprogram og aksjebasert avlønning", "Internasjonale transaksjoner og valuta", "Løpende bokføring og MVA", "Årsregnskap og skattemelding", "CFO-rådgivning for vekstselskaper"],
      intro: "Fra pre-revenue til scale-up — vi forstår SaaS-økonomien. Investorrunder, MRR-rapportering og SkatteFUNN — alt håndtert av en regnskapsfører som kjenner tech.",
      body: "SaaS og tech-selskaper har en unik økonomi. Abonnementsbaserte inntekter, utsatt inntektsføring, SkatteFUNN og internasjonale transaksjoner krever en regnskapsfører som forstår modellen din — ikke bare tallene.",
    },
    eiendom: {
      deliverables: ["Porteføljerapportering per eiendom", "Skatteoptimalisering ved kjøp og salg", "MVA på utleie og utvikling", "Avskrivningsplaner og vedlikeholdsbudsjett", "Likviditetsstyring og kontantstrøm", "Årsregnskap og skattemelding", "Lønnsomhetsanalyse per prosjekt", "Konsernregnskap for eiendomsselskaper"],
    },
    holding: {
      deliverables: ["Konsernregnskap og konsolidering", "Utbyttestrategi og fritaksmetoden", "Kapitalforvaltning og investeringsregnskap", "Skatteplanlegging på tvers av selskaper", "Strukturering og omorganisering", "Årsregnskap og skattemelding per selskap", "Aksjonærlån og mellomværende", "Rapportering til styret"],
    },
    landbruk: {
      deliverables: ["Jordbruksfradrag og næringsinntekt", "Produksjonstilskudd og rapportering", "Avskrivning av driftsmidler og bygg", "Sesongbasert budsjett og likviditet", "MVA-oppgjør for primærnæring", "Årsregnskap og skattemelding", "Generasjonsskifte og overdragelse", "Investeringsstøtte og tilskudd"],
    },
    "bygg-anlegg": {
      deliverables: ["Prosjektregnskap per byggeprosjekt", "Anbudskalkylering og margin", "Underentreprenørhåndtering", "MVA på fast eiendom og anlegg", "Løpende bokføring og bilag", "Lønnskjøring og innleid arbeidskraft", "Årsregnskap og skattemelding", "Likviditetsstyring ved store prosjekter"],
    },
    nettbutikk: {
      deliverables: ["MVA på tvers av landegrenser (OSS/IOSS)", "Integrasjon med betalingsplattformer", "Varekost og marginanalyse", "Automatisert ordreøkonomi", "Periodisering av abonnement", "Årsregnskap og skattemelding", "Lagervurdering og svinn", "Tolldeklarering og import/eksport"],
    },
    restaurant: {
      deliverables: ["Daglig omsetningskontroll", "Varekostsanalyse og svinn", "Tipsrapportering og deling", "Sesongbasert budsjett", "MVA på mat og drikke", "Lønnskjøring med tillegg og turnus", "Årsregnskap og skattemelding", "Likviditetsstyring ved tynne marginer"],
    },
    frisor: {
      deliverables: ["Kontorleie og stolleie regnskap", "Inntektsrapportering per stylist", "Varekjøp og produktsalg", "Enkel bokføring og MVA", "Årsregnskap og skattemelding", "Skatteplanlegging for selvstendig næringsdrivende", "Fakturering og kundeoppfølging", "Budsjett og lønnsomhetsanalyse"],
    },
  },
  hr: {
    restaurant: {
      deliverables: ["Turnusplanlegging og vaktlister", "Lønnskjøring med kvelds- og helgetillegg", "Arbeidskontrakter for deltid og sesong", "HMS i serveringsbransjen", "Sykefraværsoppfølging", "Onboarding av sesongansatte", "Arbeidsrett og overtid", "Kompetansebevis og hygienekurs"],
      intro: "Restaurant og uteliv har høy turnover, skiftarbeid og strenge HMS-krav. Vi tar hele HR-byrden — fra turnusplanlegging til arbeidsrett.",
    },
    "bygg-anlegg": {
      deliverables: ["HMS og sikkerhet på byggeplass", "Arbeidskontrakter for prosjektansatte", "Lønnskjøring med overtid og tillegg", "Innleid arbeidskraft og bemanningskontroll", "Sertifikat- og kompetanseregister", "Sykefraværsoppfølging", "Verneombud og arbeidsmiljøutvalg", "Onboarding av nye fagarbeidere"],
      intro: "Byggebransjen har strenge HMS-krav, prosjektbaserte ansettelser og innleid arbeidskraft. Vi sørger for at du er trygg som arbeidsgiver.",
    },
    helse: {
      deliverables: ["Turnus og vaktplanlegging", "Lønnskjøring med helge- og nattillegg", "Arbeidskontrakter for helsepersonell", "HMS og smittevern", "Sykefraværsoppfølging og IA-avtale", "Rekruttering av spesialister", "Personalhåndbok tilpasset helsetjenester", "Kompetansekrav og autorisasjoner"],
      intro: "Helsesektoren har spesielle krav til turnus, autorisasjoner og smittevern. Vi tar HR-byrden slik at du kan fokusere på pasientene.",
    },
    renhold: {
      deliverables: ["Lønnskjøring for mange ansatte", "Arbeidskontrakter med varierende arbeidstid", "HMS og kjemikaliehåndtering", "Sykefraværsoppfølging", "Onboarding og språkopplæring", "Allmenngjorte tariffavtaler", "Overtid og reisetid", "Kompetansebevis og ID-kort"],
      intro: "Renholdsbransjen har mange ansatte, allmenngjorte tariffer og krevende HMS-regler. Vi holder orden på alt som arbeidsgiver.",
    },
    transport: {
      deliverables: ["Lønnskjøring med kjøre- og hviletid", "Arbeidskontrakter for sjåfører", "Yrkessjåførkompetanse og sertifikater", "HMS og kjøretøysikkerhet", "Sykefraværsoppfølging", "Arbeidstidsbestemmelser (EU-regler)", "Onboarding av nye sjåfører", "Overtid og diettgodtgjørelse"],
      intro: "Transportbransjen har spesielle arbeidstidsregler, sertifikatkrav og HMS-utfordringer. Vi sørger for at du er trygg som arbeidsgiver.",
    },
    frisor: {
      deliverables: ["Arbeidskontrakter for stolleie og fast ansatte", "Lønnskjøring og provisjon", "Personalhåndbok for salonger", "HMS og ergonomi", "Kjemikaliehåndtering og allergi", "Sykefraværsoppfølging", "Onboarding av nye stylister", "Kompetanseutvikling og kurs"],
      intro: "Frisørbransjen har en unik mix av fast ansatte og stolleiere. Vi sørger for riktige kontrakter og trygg drift.",
    },
    industri: {
      deliverables: ["HMS og sikkerhet i produksjon", "Lønnskjøring med skifttillegg", "Arbeidskontrakter for skiftarbeidere", "Verneombud og arbeidsmiljøutvalg", "Sykefraværsoppfølging og IA", "Kompetansekrav og sertifiseringer", "Onboarding med sikkerhetskurs", "Arbeidstidsordninger og turnus"],
    },
    handverkere: {
      deliverables: ["Arbeidskontrakter for fagarbeidere", "Lønnskjøring med reisetid og diett", "HMS på arbeidsplassen", "Sertifikat- og kompetanseregister", "Lærlingeordning og opplæring", "Sykefraværsoppfølging", "Personalhåndbok for håndverksbedrifter", "Arbeidstid og overtid"],
    },
  },
  markedsforing: {
    eiendom: {
      deliverables: ["Boligannonsering på Finn.no og SoMe", "Google Ads for eiendomsmegling", "SEO for prosjektsalg og utleie", "Visuell profil og prospektmateriale", "Drone- og videofoto for salg", "Lokal synlighet og Google Business", "Innholdsstrategi for eiendomssider", "Analyse og konverteringsoptimalisering"],
      intro: "Eiendomsbransjen handler om synlighet og tillit. Vi hjelper deg å nå riktig kjøper gjennom søk, annonser og visuelt innhold.",
    },
    restaurant: {
      deliverables: ["Google Business og lokale søk", "Instagram og Facebook-markedsføring", "Matfotografi og visuelt innhold", "Lokal SEO for restauranter", "Eventmarkedsføring og kampanjer", "Anmeldelseshåndtering og omdømme", "Menydesign og nettbestilling", "Sesongkampanjer og tilbud"],
      intro: "Restauranter lever av omtale, synlighet og gjester. Vi hjelper deg å fylle bordene med riktig markedsføring.",
    },
    nettbutikk: {
      deliverables: ["Google Shopping og produktannonsering", "SEO for produktsider", "Meta/SoMe-annonsering for e-handel", "E-postmarkedsføring og automatisering", "Konverteringsoptimalisering", "Remarketing og kundereise", "Innholdsstrategi og produktbeskrivelser", "Analyse og ROI-rapportering"],
      intro: "Nettbutikk handler om å konvertere besøkende til kunder. Vi lager kampanjer som selger — og måler alt ned til siste krone.",
    },
    helse: {
      deliverables: ["Lokal SEO for klinikker", "Google Ads for helserelaterte søk", "Innholdsstrategi og fagartikler", "Nettside optimalisert for booking", "SoMe-tilstedeværelse og troverdighet", "Omdømmehåndtering og anmeldelser", "Pasienthistorier og case studies", "Analyse og konverteringsoptimalisering"],
      intro: "Helsebransjen krever troverdig, faglig markedsføring. Vi hjelper deg å bli synlig uten å bryte tillit eller etiske retningslinjer.",
    },
    frisor: {
      deliverables: ["Instagram-markedsføring med visuelt innhold", "Lokal SEO og Google Business", "Bookingoptimalisering på nett", "Kampanjer for nye kunder", "Kundelojalitetsprogram", "Produktsalg og mersalg-strategi", "Omdømmehåndtering og anmeldelser", "Sesongkampanjer og tilbud"],
      intro: "Frisører lever av visuelt innhold og lokal synlighet. Vi hjelper deg å fylle timeboken med riktig markedsføring.",
    },
    consulting: {
      deliverables: ["LinkedIn-strategi og thought leadership", "SEO for konsulenttjenester", "Google Ads for B2B-leadgenerering", "Innholdsstrategi og fagartikler", "Nettside optimalisert for henvendelser", "E-postmarkedsføring og nurturing", "Webinarer og digital synlighet", "Analyse og leadkvalitet"],
      intro: "Konsulentbransjen selger kompetanse og tillit. Vi hjelper deg å bygge synlighet og troverdighet i riktige kanaler.",
    },
    sport: {
      deliverables: ["Lokal SEO for treningssentre", "Meta-annonsering for medlemsverving", "Google Ads for trenings- og aktivitetstilbud", "Instagram-markedsføring og treningsinnhold", "Kampanjer for sesongstart og nyårsforsetter", "Medlemslojalitet og retensjonsstrategier", "Nettside med booking og klasseoversikt", "Analyse og konverteringsoptimalisering"],
    },
    reiseliv: {
      deliverables: ["Google Ads for reisesøk", "SEO for destinasjoner og opplevelser", "Instagram og Pinterest-markedsføring", "Bookingoptimalisering", "Sesongkampanjer og pakkereiser", "Innholdsstrategi og reiseguider", "Anmeldelseshåndtering og TripAdvisor", "Konverteringsoptimalisering"],
    },
    varehandel: {
      deliverables: ["Google Shopping og produktannonsering", "Lokal SEO og Google Business", "Meta/SoMe-kampanjer for butikk", "Kampanjer for salg og sesong", "Kundelojalitetsprogram", "Innholdsstrategi og nyhetsbrev", "Nettside og nettbutikk", "Analyse og omsetningsrapportering"],
    },
  },
  it: {
    eiendom: {
      deliverables: ["Eiendomsportal og prosjektside", "Bookingsystem for visninger", "CRM for kundeoppfølging", "Internt dashboard for portefølje", "Automatisert prospektgenerering", "Integrasjon med Finn.no", "AI-chatbot for henvendelser", "Vedlikehold og sikkerhet"],
      intro: "Eiendomsbransjen trenger digitale verktøy for visninger, prospekter og kundeoppfølging. Vi bygger systemene som effektiviserer salg og utleie.",
    },
    restaurant: {
      deliverables: ["Nettside med meny og bestilling", "Bordbestillingssystem", "Digital meny og QR-bestilling", "Leveringsintegrasjon (Foodora/Wolt)", "Kundelojalitetsapp", "Internt system for vaktlister", "Automatisert varetelling", "POS-integrasjon"],
      intro: "Moderne restauranter trenger digitale bestillingssystemer, menyløsninger og intern effektivisering. Vi bygger det som sparer deg tid.",
    },
    helse: {
      deliverables: ["Nettside med timebestilling", "Pasientportal og kommunikasjon", "Digitale skjemaer og anamnese", "Automatisert påminnelse (SMS/e-post)", "Internt dashboard og rapportering", "Integrasjon med journalsystem", "AI-chatbot for pasienthenvendelser", "Sikkerhet og personvern"],
      intro: "Helsesektoren trenger sikre, brukervennlige digitale løsninger. Vi bygger bookingsystemer, pasientportaler og automatiseringer tilpasset klinikken din.",
    },
    "bygg-anlegg": {
      deliverables: ["Prosjektstyringsverktøy", "Digitale sjekklister og dokumentasjon", "Timeregistreringssystem", "Internt dashboard per prosjekt", "Automatisert fakturering", "BIM-integrasjon og filhåndtering", "AI-assistert kalkulering", "Mobiltilpassede byggeplassverktøy"],
      intro: "Byggebransjen trenger digitale verktøy for prosjektstyring, dokumentasjon og kommunikasjon. Vi bygger løsninger som fungerer fra kontoret til byggeplassen.",
    },
    consulting: {
      deliverables: ["Nettside med tjenestekatalog", "CRM og kundeoppfølging", "Timeregistrering og prosjektstyring", "Automatisert rapportgenerering", "Kundeportal med tilgang til leveranser", "AI-assistent for research", "Internt kunnskapssystem", "Integrasjon med fakturering"],
      intro: "Konsulentselskaper trenger smarte systemer for prosjekter, kunder og leveranser. Vi bygger verktøy som gjør deg mer effektiv.",
    },
    nettbutikk: {
      deliverables: ["Skreddersydd nettbutikk", "Betalingsintegrasjon (Vipps/Klarna)", "Lagerstyring og ordrehåndtering", "Automatisert fraktberegning", "Kundeportal og min side", "AI-drevet produktanbefaling", "Integrasjon med ERP/regnskap", "Ytelseoptimalisering og sikkerhet"],
      intro: "En nettbutikk som konverterer krever mer enn et pent design. Vi bygger hele den digitale infrastrukturen — fra bestilling til levering.",
    },
    handverkere: {
      deliverables: ["Nettside med tjenesteoversikt", "Bookingsystem for oppdrag", "Timeregistrering og kjørebok", "Digital tilbuds- og fakturagenerering", "Kundeportal med prosjektstatus", "Mobiltilpassede feltverktøy", "Bildedokumentasjon og rapportering", "Integrasjon med regnskap"],
    },
    transport: {
      deliverables: ["Flåtestyring og GPS-sporing", "Digital kjørebok og rapportering", "Ruteoptimalisering", "Kundeportal for sporing", "Automatisert dokumentasjon", "Integrasjon med tollsystemer", "Dashboard for driftsoversikt", "Mobilapp for sjåfører"],
    },
    industri: {
      deliverables: ["Produksjonsstyringssystem (MES)", "Lagerstyring og varetelling", "Kvalitetskontroll og rapportering", "Internt dashboard og KPI-er", "Automatisert ordrebehandling", "IoT-integrasjon og sensordata", "Vedlikeholdsplanlegging", "ERP-integrasjon"],
    },
    frisor: {
      deliverables: ["Bookingsystem for timebestilling", "Nettside med tjenester og priser", "Kundelojalitetsapp", "Automatiserte påminnelser (SMS)", "Kassasystem-integrasjon", "Digital markedsføring-verktøy", "Stolleie-administrasjon", "Produktsalg og nettbutikk"],
    },
  },
};

/**
 * Returns section-specific content for a given industry page.
 * Falls back to section defaults, then to null (use original content).
 */
export function getSectionBransjeContent(
  sectionId: SectionId,
  industryHref: string
): SectionBransjeOverride | null {
  const slug = industryHref.replace("/bransjer/", "");
  const defaults = sectionDefaults[sectionId];
  const overrides = industryOverrides[sectionId]?.[slug];

  if (!defaults) return null;

  return {
    deliverables: overrides?.deliverables || defaults.deliverables,
    intro: overrides?.intro || defaults.intro,
    body: overrides?.body || defaults.body,
  };
}
