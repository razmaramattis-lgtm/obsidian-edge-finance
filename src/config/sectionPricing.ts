import type { SectionId } from "@/contexts/SectionContext";

export interface SectionPricingPlan {
  id: string;
  name: string;
  price: number;
  price_suffix: string;
  description: string;
  features: string[];
  highlighted: boolean;
}

export interface SectionPricingCopy {
  headline: string;
  sub: string;
  italic: string;
  comparison: string;
  roleLabel: string;
  comparisons: { name: string; body: string; us: string; tag: string }[];
  bottomText: string;
  bottomItalic: string;
}

const regnskapPlans: SectionPricingPlan[] = [
  {
    id: "r-start",
    name: "Start",
    price: 1499,
    price_suffix: "/mnd",
    description: "For nyetablerte selskaper eller selskaper med litt vekst.",
    features: [
      "Statsautorisert regnskapsfører",
      "Bokføring",
      "MVA-rapportering",
      "Årsregnskap",
      "Skattemelding",
      "Regnskapssystemkostnad inkludert",
    ],
    highlighted: false,
  },
  {
    id: "r-basis",
    name: "Basis",
    price: 4500,
    price_suffix: "/mnd",
    description: "For selskaper som vil ha kontroll og struktur fra dag én.",
    features: [
      "Løpende bokføring og bankavstemming",
      "MVA-rapportering",
      "Årsregnskap og skattemelding",
      "Aksjonærregisteroppgave",
      "Lønn for inntil 5 ansatte",
      "Månedlig standard rapportpakke",
      "Rådgivning",
    ],
    highlighted: false,
  },
  {
    id: "r-vekst",
    name: "Vekst",
    price: 6000,
    price_suffix: "/mnd",
    description: "For selskaper i vekst som trenger en strategisk partner.",
    features: [
      "Alt i Basis, pluss:",
      "Lønn for opptil 10 ansatte",
      "Kvartalsvis gjennomgang",
      "Likviditetsoversikt og prognose",
      "Skatteoptimalisering og strukturvurdering",
      "Gratis oppsett av integrasjonsløsninger",
      "SEO-støtte for din bedrift",
    ],
    highlighted: false,
  },
  {
    id: "r-pro",
    name: "Pro",
    price: 8000,
    price_suffix: "/mnd",
    description: "For selskaper som vil ha total oversikt. Din finansielle partner.",
    features: [
      "Alt i Vekst, pluss:",
      "Månedlig rapportering",
      "Budsjett",
      "CFO-løsning",
      "Oppsett av nettside",
      "SOME-annonsering",
      "Integrasjon av e-postsystem mot SOME og andre kanaler",
    ],
    highlighted: true,
  },
];

const hrPlans: SectionPricingPlan[] = [
  {
    id: "h-start",
    name: "Start",
    price: 2990,
    price_suffix: "/mnd",
    description: "For bedrifter med opptil 5 ansatte som trenger grunnleggende HR-støtte.",
    features: [
      "Dedikert HR-rådgiver",
      "Lønnskjøring for inntil 5 ansatte",
      "Standard arbeidskontrakter",
      "Personalhåndbok (mal)",
      "HMS-dokumentasjon (mal)",
      "E-post og telefonstøtte",
    ],
    highlighted: false,
  },
  {
    id: "h-basis",
    name: "Basis",
    price: 5500,
    price_suffix: "/mnd",
    description: "For bedrifter som vil ha trygg personaladministrasjon fra dag én.",
    features: [
      "Lønnskjøring for inntil 10 ansatte",
      "Skreddersydde arbeidskontrakter",
      "Personalhåndbok tilpasset bedriften",
      "HMS-dokumentasjon og oppfølging",
      "Sykefraværsoppfølging",
      "Onboarding-prosess",
      "Arbeidsrett-rådgivning",
    ],
    highlighted: false,
  },
  {
    id: "h-vekst",
    name: "Vekst",
    price: 8500,
    price_suffix: "/mnd",
    description: "For bedrifter i vekst som trenger en komplett HR-partner.",
    features: [
      "Alt i Basis, pluss:",
      "Lønnskjøring for opptil 25 ansatte",
      "Rekrutteringsstøtte",
      "Kompetanseutvikling og kursplan",
      "Kvartalsvis HR-gjennomgang",
      "Varslingsrutiner og compliance",
      "Medarbeidersamtaler (mal og oppfølging)",
    ],
    highlighted: false,
  },
  {
    id: "h-pro",
    name: "Pro",
    price: 12000,
    price_suffix: "/mnd",
    description: "For bedrifter som vil ha en komplett HR-avdeling uten å ansette.",
    features: [
      "Alt i Vekst, pluss:",
      "Ubegrenset antall ansatte",
      "Månedlig HR-rapportering",
      "Organisasjonsutvikling",
      "Lederutvikling og coaching",
      "Employer branding-strategi",
      "Dedikert HR-team",
    ],
    highlighted: true,
  },
];

const markedsforingPlans: SectionPricingPlan[] = [
  {
    id: "m-start",
    name: "Start",
    price: 4990,
    price_suffix: "/mnd",
    description: "For bedrifter som vil bli synlige på nett — uten å bruke en formue.",
    features: [
      "Dedikert markedsfører",
      "Google Business-optimalisering",
      "Grunnleggende SEO-oppsett",
      "Månedlig synlighetsrapport",
      "Råd om innholdsstrategi",
      "E-post og telefonstøtte",
    ],
    highlighted: false,
  },
  {
    id: "m-basis",
    name: "Basis",
    price: 8500,
    price_suffix: "/mnd",
    description: "For bedrifter som vil ha løpende markedsføring med målbare resultater.",
    features: [
      "SEO og innholdsoptimalisering",
      "Google Ads-kampanjer (oppsett + styring)",
      "Meta/SoMe-annonsering",
      "Månedlig resultatrapport",
      "Konverteringsoptimalisering",
      "Innholdsproduksjon (2 poster/mnd)",
      "Rådgivning og strategi",
    ],
    highlighted: false,
  },
  {
    id: "m-vekst",
    name: "Vekst",
    price: 14000,
    price_suffix: "/mnd",
    description: "For bedrifter som vil skalere veksten med datadrevet markedsføring.",
    features: [
      "Alt i Basis, pluss:",
      "Avansert SEO og linkbygging",
      "Remarketing og kundereise",
      "E-postmarkedsføring og automatisering",
      "Innholdsproduksjon (4 poster/mnd)",
      "Kvartalsvis strategigjennomgang",
      "A/B-testing og optimalisering",
    ],
    highlighted: false,
  },
  {
    id: "m-pro",
    name: "Pro",
    price: 22000,
    price_suffix: "/mnd",
    description: "For bedrifter som vil ha et komplett markedsføringsteam.",
    features: [
      "Alt i Vekst, pluss:",
      "Dedikert markedsføringsteam",
      "Fullskala innholdsproduksjon",
      "Video og kreativt innhold",
      "PR og medieeksponering",
      "LinkedIn-strategi og thought leadership",
      "Månedlig ROI-rapportering koblet til regnskap",
    ],
    highlighted: true,
  },
];

const itPlans: SectionPricingPlan[] = [
  {
    id: "i-start",
    name: "Nettside",
    price: 14900,
    price_suffix: " (engangspris)",
    description: "En profesjonell nettside som representerer bedriften din.",
    features: [
      "Dedikert utvikler",
      "Skreddersydd design",
      "Responsiv for mobil og desktop",
      "SEO-grunnoppsett",
      "Kontaktskjema og integrasjoner",
      "3 måneder gratis vedlikehold",
    ],
    highlighted: false,
  },
  {
    id: "i-basis",
    name: "Digital Pakke",
    price: 6500,
    price_suffix: "/mnd",
    description: "Løpende IT-støtte og digitale verktøy for bedriften din.",
    features: [
      "Nettside med vedlikehold",
      "Booking- eller bestillingssystem",
      "E-postoppsett og automatisering",
      "CRM-oppsett og kundeoppfølging",
      "Sikkerhet og backup",
      "Teknisk support",
      "Månedlig statusrapport",
    ],
    highlighted: false,
  },
  {
    id: "i-vekst",
    name: "Vekst",
    price: 12000,
    price_suffix: "/mnd",
    description: "Skreddersydde systemer og automatisering som sparer deg tid.",
    features: [
      "Alt i Digital Pakke, pluss:",
      "Internt dashboard og rapportering",
      "AI-chatbot for kundeservice",
      "Prosessautomatisering",
      "Integrasjon med regnskap og systemer",
      "Kvartalsvis teknologigjennomgang",
      "Prioritert support",
    ],
    highlighted: false,
  },
  {
    id: "i-pro",
    name: "Enterprise",
    price: 22000,
    price_suffix: "/mnd",
    description: "Et dedikert utviklerteam som bygger og drifter alt digitalt for deg.",
    features: [
      "Alt i Vekst, pluss:",
      "Dedikert utviklerteam",
      "Skreddersydde interne systemer",
      "AI og maskinlæring-løsninger",
      "Full integrasjon med alle systemer",
      "24/7 overvåking og support",
      "Månedlig strategirapport",
    ],
    highlighted: true,
  },
];

const regnskapCopy: SectionPricingCopy = {
  headline: "Enkel pris. Full kontroll.",
  sub: "Hos Avargo betaler du én fast månedspris. Ingen tillegg for MVA-rapportering, lønnskjøring eller rådgivning. Alt er inkludert fra dag én.",
  italic: "Vi tror på forutsigbarhet — for deg og for oss.",
  comparison: "De fleste regnskapstilbydere gir deg enten en billig minimumsløsning eller en dyr helhetspakke. Vi gir deg alt du trenger — til en pris som gir mening.",
  roleLabel: "statsautorisert regnskapsfører",
  comparisons: [
    { name: "Billigalternativene", body: "Lav inngangsbillett og enkel løsning. Men når selskapet vokser, kommer spørsmålene — hvem følger opp?", us: "Hos Avargo er rådgivning og oppfølging inkludert — uansett pakke.", tag: "Helhet fra dag én." },
    { name: "De store byråene", body: "Profesjonelle og etablerte. Men du blir én av mange kunder, og hvert spørsmål koster.", us: "Hos oss betaler du fast pris og kan ta kontakt uten å tenke på timebudsjettet.", tag: "Relasjon foran ressursnummer." },
    { name: "Gjør-det-selv-systemer", body: "Gode verktøy, men de tar ikke ansvar. Du står alene med rapporter, frister og vurderinger.", us: "Med Avargo får du systemet, eksperten og strukturen — satt opp riktig.", tag: "Teknologi med eierskap." },
  ],
  bottomText: "Å bytte leverandør handler sjelden om pris.\nDet handler om kontroll, tilgjengelighet og tillit.",
  bottomItalic: "Når det først fungerer, blir du.",
};

const hrCopy: SectionPricingCopy = {
  headline: "HR til fast pris. Uten overraskelser.",
  sub: "Lønnskjøring, arbeidsrett, personalhåndbok og rekruttering — alt inkludert i én forutsigbar pris. Du vet hva det koster å ha trygg HR.",
  italic: "Trygg arbeidsgiver. Fornøyde ansatte.",
  comparison: "De fleste HR-leverandører fakturerer per oppgave eller per ansatt. Vi inkluderer alt — så du slipper å telle.",
  roleLabel: "HR-rådgiver",
  comparisons: [
    { name: "Frilans HR-konsulenter", body: "Kompetente, men dyre per time. Og ingen er der når du trenger dem mellom oppdragene.", us: "Hos Avargo har du en fast HR-rådgiver som kjenner bedriften din — hele tiden.", tag: "Alltid tilgjengelig." },
    { name: "HR-systemer", body: "Digitale verktøy gir deg maler og prosesser. Men hvem svarer når du står i en vanskelig personalsak?", us: "Med Avargo får du både systemet og eksperten — som kjenner arbeidsretten.", tag: "Menneske + system." },
    { name: "Gjøre det selv", body: "Du kan Google arbeidsmiljøloven. Men feil kan koste deg hundretusener i arbeidstvister.", us: "Vi tar ansvaret — så du slipper risikoen.", tag: "Trygghet fremfor gjetning." },
  ],
  bottomText: "Å være en god arbeidsgiver skal ikke kreve at du er HR-ekspert.\nDet krever bare riktig partner.",
  bottomItalic: "Når HR fungerer, merker ingen det. Og det er poenget.",
};

const markedsforingCopy: SectionPricingCopy = {
  headline: "Markedsføring til fast pris.",
  sub: "SEO, annonsering og innholdsstrategi — alt inkludert i én forutsigbar månedspris. Ingen timefakturering. Bare resultater.",
  italic: "Vekst skal ikke koste mer enn det smaker.",
  comparison: "De fleste byråer fakturerer timepris og kjører opp regningen. Vi gir deg resultater til fast pris — med full transparens.",
  roleLabel: "markedsfører",
  comparisons: [
    { name: "Timebaserte byråer", body: "Kreative og dyktige, men budsjettet løper fort. Og du aner ikke hva som faktisk gir resultater.", us: "Hos Avargo betaler du fast pris og ser nøyaktig hva hver krone gir tilbake.", tag: "ROI i fokus." },
    { name: "Frilansere", body: "Billig og fleksibelt, men du må koordinere alt selv — og kvaliteten varierer.", us: "Med Avargo får du et team med strateg, designer og spesialist — til én fast pris.", tag: "Team, ikke solo." },
    { name: "Gjøre det selv", body: "Du kan booste poster på Facebook. Men uten strategi og måling er det bortkastede penger.", us: "Vi kobler markedsføringen til regnskapet — så du ser hva som faktisk fungerer.", tag: "Data, ikke gjetning." },
  ],
  bottomText: "Synlighet uten strategi er bortkastede penger.\nStrategi uten måling er gjetning.",
  bottomItalic: "Vi leverer begge deler.",
};

const itCopy: SectionPricingCopy = {
  headline: "IT og utvikling. Fast pris.",
  sub: "Nettsider, systemer, chatboter og AI-automatisering — forutsigbar pris uten timefakturering. Du vet hva du betaler.",
  italic: "Teknologi skal være en investering, ikke en utgift.",
  comparison: "De fleste utviklere fakturerer timepris og prosjektene vokser. Vi gir deg en fast pris — og leverer det vi lover.",
  roleLabel: "IT-rådgiver",
  comparisons: [
    { name: "Freelance-utviklere", body: "Ofte dyktige, men prosjekter uten struktur vokser i omfang og pris. Og hvem drifter etterpå?", us: "Hos Avargo får du utvikling, drift og support — alt inkludert.", tag: "Fra prosjekt til partner." },
    { name: "Store IT-selskaper", body: "Profesjonelle, men dyre. Du betaler for overhead, ikke bare kode.", us: "Vi er pragmatiske — du betaler for løsningen, ikke for konsulentpyramiden.", tag: "Verdi foran faktura." },
    { name: "Hyllevare og SaaS-verktøy", body: "Billig per måned, men du tilpasser deg systemet — ikke omvendt.", us: "Vi bygger skreddersydde løsninger som passer din bedrift — ikke en generisk mal.", tag: "Bygget for deg." },
  ],
  bottomText: "Teknologi som ikke løser et reelt problem er bare støy.\nVi bygger det som gir verdi.",
  bottomItalic: "Pragmatisk teknologi — bygget for din bedrift.",
};

export const sectionPricingPlans: Record<SectionId, SectionPricingPlan[]> = {
  regnskap: regnskapPlans,
  hr: hrPlans,
  markedsforing: markedsforingPlans,
  it: itPlans,
};

export const sectionPricingCopy: Record<SectionId, SectionPricingCopy> = {
  regnskap: regnskapCopy,
  hr: hrCopy,
  markedsforing: markedsforingCopy,
  it: itCopy,
};
