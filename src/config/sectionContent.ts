import type { SectionId } from "@/contexts/SectionContext";

/**
 * Maps SectionId → the category IDs in the Tjenester page `categories` array
 * that should be shown when inside that section.
 */
export const sectionCategoryIds: Record<SectionId, string[]> = {
  regnskap: ["regnskap"],
  hr: ["hr"],
  markedsforing: ["marked"],
  it: ["it"],
};

/**
 * Kurs items that are relevant per section (by href).
 * Bedriftskurs is always included.
 */
export const sectionKursHrefs: Record<SectionId, string[]> = {
  regnskap: ["/tjenester/kurs", "/tjenester/bedriftskurs"],
  hr: ["/tjenester/hr-kurs", "/tjenester/bedriftskurs"],
  markedsforing: ["/tjenester/bedriftskurs"],
  it: ["/tjenester/bedriftskurs"],
};

/**
 * Header tjenester groups that should be visible per section.
 * Maps section ID → group labels to show.
 */
export const sectionTjenesterGroups: Record<SectionId, string[]> = {
  regnskap: ["Regnskap & Økonomi", "Kurs & Opplæring"],
  hr: ["HR & Personal", "Kurs & Opplæring"],
  markedsforing: ["Markedsføring & Vekst"],
  it: ["IT & Utvikling"],
};

/**
 * Section-specific page copy overrides.
 */
export const sectionPageCopy: Record<SectionId, {
  tjenester: { tag: string; headline: string; sub: string; cta: string };
  bransjer: { tag: string; headline: string; sub: string; ctaButton: string; ctaHeadline: string };
  priser: { headline: string; sub: string; italic: string; comparison: string };
  kontakt: { tag: string; headline: string; sub: string; italic: string; bullets: string[] };
  omOss: { tag: string; headline: string; intro1: string; intro2: string; italic: string };
  metoden: { heroSub: string; heroItalic: string };
}> = {
  regnskap: {
    tjenester: {
      tag: "Avargo · Regnskap · Tjenester",
      headline: "Vi tar oss av tallene. Du tar deg av bedriften.",
      sub: "Regnskap, CFO-rådgivning, lønn og skatteoptimalisering — alt levert av din dedikerte regnskapsfører.",
      cta: "Strukturen som gir deg kontroll.",
    },
    bransjer: {
      tag: "Avargo · Regnskap · Bransjer",
      headline: "Vi kjenner bransjen din. Ikke bare tallene.",
      sub: "Uansett bransje — din regnskapsfører forstår hverdagen din, sesongsvingninger og bransjespesifikke skatteregler.",
      ctaButton: "Finn din regnskapsfører",
      ctaHeadline: "Finn en regnskapsfører som kjenner din verden.",
    },
    priser: {
      headline: "Enkel pris. Full kontroll.",
      sub: "Én fast månedspris for alt regnskap. Ingen tillegg for MVA, lønnskjøring eller rådgivning.",
      italic: "Vi tror på forutsigbarhet — for deg og for oss.",
      comparison: "De fleste regnskapstilbydere gir deg enten en billig minimumsløsning eller en dyr helhetspakke.",
    },
    kontakt: {
      tag: "Uforpliktende henvendelse",
      headline: "Fortell oss om selskapet ditt.",
      sub: "Du får en dedikert, statsautorisert regnskapsfører som investerer seg i selskapet ditt.",
      italic: "Ingen binding. Ingen forpliktelser. Bare en samtale.",
      bullets: ["Statsautorisert regnskapsfører fra dag én", "Alt inkludert i én fast pris", "Tilpasset din bransje og ditt selskap", "Svar innen 24 timer — alltid"],
    },
    omOss: {
      tag: "Om Avargo · Regnskap",
      headline: "Regnskapsførere som brant for å gjøre det bedre.",
      intro1: "Vi er statsautoriserte regnskapsførere som ble lei av å se bedriftseiere slite med dårlig oppfølging og skjulte kostnader.",
      intro2: "Derfor startet vi Avargo. Et regnskapsbyrå bygget for bedrifter som ønsker trygghet — ikke bare tall.",
      italic: "Vi bygde Avargo fordi vi som statsautoriserte regnskapsførere så hva markedet manglet.",
    },
    metoden: {
      heroSub: "Hos Avargo får du ikke bare en regnskapsfører — du får et helt team som jobber for at du skal ha full kontroll.",
      heroItalic: "Bygget for bedrifter som ønsker trygghet — ikke bare tall.",
    },
  },
  hr: {
    tjenester: {
      tag: "Avargo · HR · Tjenester",
      headline: "Alt du trenger for å ta godt vare på de ansatte.",
      sub: "Lønnskjøring, arbeidsrett, personalhåndbok og rekruttering — vi tar hele HR-byrden fra skuldrene dine.",
      cta: "Menneskene først. Alltid.",
    },
    bransjer: {
      tag: "Avargo · HR · Bransjer",
      headline: "HR-partner som forstår din bransje.",
      sub: "Arbeidsrett, lønn og personaladministrasjon tilpasset bransjens krav og utfordringer.",
      ctaButton: "Finn din HR-ekspert",
      ctaHeadline: "Finn en HR-partner som kjenner din bransje.",
    },
    priser: {
      headline: "HR til fast pris. Uten overraskelser.",
      sub: "Lønnskjøring, arbeidsrett, personalhåndbok og rekruttering — alt inkludert i én forutsigbar pris.",
      italic: "Trygg arbeidsgiver. Fornøyde ansatte.",
      comparison: "De fleste HR-leverandører fakturerer per oppgave. Vi inkluderer alt.",
    },
    kontakt: {
      tag: "HR-henvendelse",
      headline: "Fortell oss om bedriften og de ansatte.",
      sub: "Du får en dedikert HR-rådgiver som forstår arbeidsrett, lønn og personalledelse.",
      italic: "Vi tar HR-byrden — du tar vare på menneskene.",
      bullets: ["Spesialisert HR-rådgiver", "Lønnskjøring og arbeidsrett inkludert", "Personalhåndbok tilpasset din bedrift", "Svar innen 24 timer"],
    },
    omOss: {
      tag: "Om Avargo · HR",
      headline: "HR-spesialister som forstår norsk arbeidsliv.",
      intro1: "Vi så at småbedrifter slet med arbeidsrett, lønn og personaladministrasjon — uten noen å spørre.",
      intro2: "Avargo HR gir deg en dedikert rådgiver som tar hele HR-byrden, slik at du kan fokusere på menneskene.",
      italic: "Vi bygde HR-avdelingen fordi arbeidsgivere fortjener støtte — ikke bare systemer.",
    },
    metoden: {
      heroSub: "Hos Avargo får du en dedikert HR-rådgiver som tar seg av alt fra lønn til arbeidsrett — så du kan fokusere på teamet ditt.",
      heroItalic: "Bygget for arbeidsgivere som vil gjøre det riktig.",
    },
  },
  markedsforing: {
    tjenester: {
      tag: "Avargo · Markedsføring · Tjenester",
      headline: "Bli sett. Få flere kunder. Voks.",
      sub: "SEO, annonsering, nettbutikk og innholdsstrategi — markedsføring som gir målbare resultater.",
      cta: "Synlighet som selger.",
    },
    bransjer: {
      tag: "Avargo · Markedsføring · Bransjer",
      headline: "Markedsføring tilpasset din bransje.",
      sub: "Annonsering, SEO og vekststrategi skreddersydd for din bransjes utfordringer og muligheter.",
      ctaButton: "Finn din markedsfører",
      ctaHeadline: "Finn en vekstpartner som forstår din bransje.",
    },
    priser: {
      headline: "Markedsføring til fast pris.",
      sub: "SEO, annonsering og innholdsstrategi — alt inkludert i én forutsigbar månedspris.",
      italic: "Vekst skal ikke koste mer enn det smaker.",
      comparison: "De fleste byråer fakturerer timepris. Vi gir deg resultater til fast pris.",
    },
    kontakt: {
      tag: "Markedsførings-henvendelse",
      headline: "Fortell oss hva du selger og hvem du vil nå.",
      sub: "Vi setter sammen en vekststrategi som er koblet til de faktiske tallene dine.",
      italic: "Datadrevet markedsføring — ingen gjetning.",
      bullets: ["Dedikert markedsfører", "SEO, SoMe og Google Ads", "Resultater koblet til regnskap", "Svar innen 24 timer"],
    },
    omOss: {
      tag: "Om Avargo · Markedsføring",
      headline: "Markedsførere som måler alt — helt til bunnlinjen.",
      intro1: "Vi så at bedrifter kastet penger på markedsføring uten å vite hva som faktisk ga resultater.",
      intro2: "Avargo kobler markedsføringen direkte til regnskapet — så du ser nøyaktig hva hver krone gir tilbake.",
      italic: "Vi bygde markedsavdelingen fordi synlighet uten måling er bortkastede penger.",
    },
    metoden: {
      heroSub: "Hos Avargo får du en vekstpartner som kobler markedsføringen til de faktiske tallene — så du vet hva som fungerer.",
      heroItalic: "Bygget for bedrifter som vil vokse med kontroll.",
    },
  },
  it: {
    tjenester: {
      tag: "Avargo · IT · Tjenester",
      headline: "Teknologi som gjør hverdagen enklere.",
      sub: "Nettsider, chatboter, interne systemer og AI-automatisering — bygget for å spare deg tid og penger.",
      cta: "Teknologi som forenkler.",
    },
    bransjer: {
      tag: "Avargo · IT · Bransjer",
      headline: "IT-løsninger tilpasset din bransje.",
      sub: "Nettsider, systemer og automatisering skreddersydd for din bransjes behov og utfordringer.",
      ctaButton: "Finn din IT-partner",
      ctaHeadline: "Finn en IT-partner som forstår din bransje.",
    },
    priser: {
      headline: "IT og utvikling. Fast pris.",
      sub: "Nettsider, chatboter, systemer og AI-automatisering — forutsigbar pris, ingen timefakturering.",
      italic: "Teknologi skal være en investering, ikke en utgift.",
      comparison: "De fleste utviklere fakturerer timepris. Vi gir deg en fast pris for hele prosjektet.",
    },
    kontakt: {
      tag: "IT-henvendelse",
      headline: "Fortell oss hva du trenger digitalt.",
      sub: "Vi bygger nettsider, systemer og AI-løsninger tilpasset din bedrift.",
      italic: "Pragmatisk teknologi — bygget for verdi, ikke for fancy.",
      bullets: ["Skreddersydde nettsider", "AI og automatisering", "Interne systemer og dashboards", "Svar innen 24 timer"],
    },
    omOss: {
      tag: "Om Avargo · IT",
      headline: "Utviklere som bygger det som gir verdi.",
      intro1: "Vi så at bedrifter betalte overpris for teknologi som ikke løste de faktiske problemene deres.",
      intro2: "Avargo IT bygger pragmatiske løsninger — nettsider, systemer og automatisering som faktisk sparer tid og penger.",
      italic: "Vi bygde IT-avdelingen fordi teknologi skal forenkle — ikke komplisere.",
    },
    metoden: {
      heroSub: "Hos Avargo får du et utviklerteam som bygger teknologi tilpasset din bedrift — ikke hyllevare.",
      heroItalic: "Bygget for bedrifter som vil digitalisere med fornuft.",
    },
  },
};

/**
 * Section-specific Metoden team members to highlight
 */
export const sectionMetodenTeam: Record<SectionId, string[]> = {
  regnskap: ["Regnskapsførere", "Strategiske rådgivere"],
  hr: ["HR-spesialister", "Strategiske rådgivere"],
  markedsforing: ["Markedsførere", "Strategiske rådgivere"],
  it: ["Utviklere", "Strategiske rådgivere"],
};
