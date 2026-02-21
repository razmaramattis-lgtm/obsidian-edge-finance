import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

type CompanyType = "as" | "enk" | "arbeidsgiver";
type Category = "mva" | "skatt" | "arbeidsgiver" | "tredjepartsopplysninger" | "saravgift" | "regnskap";

interface DeadlineTemplate {
  day: number;
  months: number[]; // empty = every month
  title: string;
  url: string;
  description?: string;
  types: CompanyType[];
  category: Category;
}

// Complete deadlines from Skatteetaten – 96 treff
// https://www.skatteetaten.no/bedrift-og-organisasjon/starte-og-drive/frister-gebyrer-og-tilleggsskatt/frister-og-oppgaver/
const TEMPLATES: DeadlineTemplate[] = [
  // =====================================================
  // ARBEIDSGIVER – A-melding, arbeidsgiveravgift, trekk
  // =====================================================
  {
    day: 5, months: [],
    title: "A-melding – frist for levering",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/arbeidsgiver/a-meldingen/",
    description: "Rapporter lønn, arbeidsgiveravgift og forskuddstrekk for forrige måned",
    types: ["arbeidsgiver"], category: "arbeidsgiver",
  },
  {
    day: 15, months: [0, 2, 4, 6, 8, 10],
    title: "A-meldingen (arbeidsgiveravgift og finansskatt) – frist for betaling",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/arbeidsgiver/a-meldingen/frister-og-betaling-i-a-meldingen/",
    description: "Frist for betaling av arbeidsgiveravgift",
    types: ["arbeidsgiver"], category: "arbeidsgiver",
  },
  {
    day: 15, months: [0, 2, 4, 6, 8, 10],
    title: "Forskuddstrekk – frist for betaling",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/arbeidsgiver/forskuddstrekk/",
    description: "Betal forskuddstrekk for forrige termin",
    types: ["arbeidsgiver"], category: "arbeidsgiver",
  },

  // =====================================================
  // MVA – Merverdiavgift
  // =====================================================
  {
    day: 10, months: [1, 3, 5, 7, 9, 11],
    title: "Mva-melding – frist for levering og betaling",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/avgifter/mva/mva-melding/",
    description: "Lever mva-melding og betal skyldig merverdiavgift",
    types: ["as", "enk"], category: "mva",
  },
  {
    day: 10, months: [1, 4, 7, 10],
    title: "Mva-melding for omvendt avgiftsplikt – frist for levering",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/avgifter/mva/mva-melding/",
    description: "Lever mva-melding for omvendt avgiftsplikt (kvartalsvis)",
    types: ["as", "enk"], category: "mva",
  },
  {
    day: 10, months: [2],
    title: "Mva-melding for små virksomheter med årstermin – frist for levering og betaling",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/avgifter/mva/mva-melding/",
    description: "Små virksomheter kan søke om å rapportere mva en gang i året",
    types: ["as", "enk"], category: "mva",
  },
  {
    day: 10, months: [3],
    title: "Mva-melding for primærnæring – frist for levering og betaling",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/avgifter/mva/mva-melding/",
    description: "Lever mva-melding for primærnæring (årlig)",
    types: ["enk"], category: "mva",
  },
  {
    day: 10, months: [1, 3, 5, 7, 9, 11],
    title: "Merverdiavgift, kompensasjonsmelding – frist for levering",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/avgifter/mva/kompensasjonsmelding/",
    description: "Skattemelding for merverdiavgiftskompensasjon",
    types: ["as"], category: "mva",
  },
  {
    day: 20, months: [3, 6, 9, 0],
    title: "Mva-melding for VOEC – frist for levering og betaling",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/avgifter/mva/utland/e-handel-voec/mva-melding/",
    description: "Mva-melding for VOEC-registrerte virksomheter (kvartalsvis)",
    types: ["as"], category: "mva",
  },

  // =====================================================
  // SKATT – Forskuddsskatt, skattemelding, skatteoppgjør
  // =====================================================
  {
    day: 15, months: [2, 5, 8, 11],
    title: "Forskuddsskatt for enkeltpersonforetak – frist for betaling",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/skatt/forskuddsskatt/forskuddsskatt-for-enkeltpersonforetak/",
    description: "Betal forskuddsskatt for inneværende termin",
    types: ["enk"], category: "skatt",
  },
  {
    day: 15, months: [1, 3, 8, 10],
    title: "Forskuddsskatt for upersonlige skattytere – frist for betaling",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/skatt/forskuddsskatt/forskuddsskatt-for-aksjeselskap-og-andre/",
    description: "Betal forskuddsskatt for aksjeselskap og andre upersonlige skattytere",
    types: ["as"], category: "skatt",
  },
  {
    day: 31, months: [4],
    title: "Skattemelding for formues- og inntektsskatt – personlig næringsdrivende – frist for levering",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/skatt/skattemelding-naringsdrivende/enk/",
    description: "Lever skattemeldingen for enkeltpersonforetak",
    types: ["enk"], category: "skatt",
  },
  {
    day: 31, months: [4],
    title: "Skattemelding for formues- og inntektsskatt – aksjeselskaper mv – frist for levering",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/skatt/skattemelding-naringsdrivende/selskap/",
    description: "Lever skattemeldingen for aksjeselskap (RF-1028)",
    types: ["as"], category: "skatt",
  },
  {
    day: 31, months: [4],
    title: "Selskapsmelding for selskap med deltakerfastsetting – frist for levering",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/skatt/skattemelding-naringsdrivende/selskap/",
    description: "Selskapsmelding for selskap med deltakerfastsetting (SDF)",
    types: ["as"], category: "skatt",
  },
  {
    day: 31, months: [4],
    title: "Skatteoppgjøret – frist for å unngå rentetillegg på restskatt",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/skatt/skatteoppgjor/restskatt/",
    description: "Betal restskatt innen fristen for å unngå rentetillegg",
    types: ["as", "enk"], category: "skatt",
  },
  {
    day: 31, months: [4],
    title: "Frist for varslingsplikten gjennom skattemeldingen for land-for-land-rapport",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/skatt/skattemelding-naringsdrivende/fradrag/utland-store-selskaper-og-konsern/internprising/land-for-land-rapportering/",
    description: "Foretak i konsern med plikt til å levere land-for-land-rapport",
    types: ["as"], category: "skatt",
  },
  {
    day: 18, months: [2],
    title: "Skatteoppgjør – første pulje for ENK er klar",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/skatt/skatteoppgjor/",
    description: "Etterskuddspliktige (AS) vil ikke få skatteoppgjøret før 30. november",
    types: ["enk"], category: "skatt",
  },
  {
    day: 30, months: [3],
    title: "Skattemelding for selskap som omfattes av petroleumsskatteloven § 1 – frist for levering",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/rapportering-og-bransjer/bransjer-med-egne-regler/oljeskatt/skattemelding-og-skatteoppgjor/",
    description: "Petroleumsselskaper har egen frist",
    types: ["as"], category: "skatt",
  },
  {
    day: 1, months: [5],
    title: "Skattemelding – frist for regnskapsfører/revisor å søke om utsatt leveringsfrist for næringsdrivende",
    url: "https://www.skatteetaten.no/skjema/utsatt-frist-for-levering-av-skattemeldingen-for-klienter/",
    description: "Regnskapsfører og revisor kan søke om utsatt frist",
    types: ["as", "enk"], category: "skatt",
  },
  {
    day: 1, months: [5],
    title: "Skattemelding – frist for å søke om utsatt levering for næringsdrivende",
    url: "https://www.skatteetaten.no/person/skatt/skattemelding/utsattfrist/",
    description: "Næringsdrivende kan søke om utsatt frist selv",
    types: ["as", "enk"], category: "skatt",
  },

  // =====================================================
  // REGNSKAP – Årsoppgaver, aksjonærregister
  // =====================================================
  {
    day: 31, months: [0],
    title: "Aksjonærregisteroppgave – frist for levering",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/skatt/aksjonarregisteroppgaven/",
    description: "Rapporter endringer i aksjekapital, utbytte og aksjonærer",
    types: ["as"], category: "regnskap",
  },
  {
    day: 31, months: [6],
    title: "Årsregnskap – frist for innsending til Regnskapsregisteret",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/starte-og-drive/arsregnskap/",
    description: "Send inn godkjent årsregnskap til Brønnøysundregistrene",
    types: ["as"], category: "regnskap",
  },
  {
    day: 30, months: [3],
    title: "Utsatt leveringsfrist – frist for regnskapsfører/revisor å søke",
    url: "https://www.skatteetaten.no/skjema/utsatt-frist-for-levering-av-skattemeldingen-for-klienter/",
    description: "Regnskapsfører og revisor kan søke om utsatt frist for sine klienter",
    types: ["as", "enk"], category: "regnskap",
  },
  {
    day: 30, months: [5],
    title: "Melding for suppleringsskatt (GIR)",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/rapportering-og-bransjer/suppleringsskatt-gammel/",
    description: "Melding for suppleringsskatt",
    types: ["as"], category: "regnskap",
  },
  {
    day: 30, months: [5],
    title: "Notifikasjon for suppleringsskatt",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/rapportering-og-bransjer/suppleringsskatt-gammel/",
    description: "Notifikasjon for suppleringsskatt",
    types: ["as"], category: "regnskap",
  },
  {
    day: 31, months: [6],
    title: "Skattemelding for suppleringsskatt",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/rapportering-og-bransjer/suppleringsskatt-gammel/",
    description: "Skattemelding for suppleringsskatt",
    types: ["as"], category: "regnskap",
  },

  // =====================================================
  // SÆRAVGIFT
  // =====================================================
  {
    day: 18, months: [],
    title: "Særavgiftsmelding – leveringsfrist",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/avgifter/saravgifter/rapportere/saravgiftsmelding/",
    description: "Fristen for å rapportere og betale særavgift er den 18. hver måned (eller påfølgende virkedag). Noen særavgifter rapporterer hvert kvartal.",
    types: ["as", "enk"], category: "saravgift",
  },

  // =====================================================
  // TREDJEPARTSOPPLYSNINGER – Innlevering (februar)
  // =====================================================
  {
    day: 9, months: [1],
    title: "Skattepliktig kundeutbytte – frist for levering av tredjepartsopplysninger",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/rapportering-og-bransjer/tredjepartsopplysninger/bank-finans-og-forsikring/skattepliktig-kundeutbytte/",
    description: "Rapporter skattepliktig kundeutbytte",
    types: ["as"], category: "tredjepartsopplysninger",
  },
  {
    day: 10, months: [1],
    title: "Internasjonal rapportering CRS/FATCA – frist for levering",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/rapportering-og-bransjer/tredjepartsopplysninger/bank-finans-og-forsikring/internasjonal-rapportering/",
    description: "Rapporter internasjonal rapportering CRS/FATCA",
    types: ["as"], category: "tredjepartsopplysninger",
  },
  {
    day: 10, months: [1],
    title: "Aksjesparekonto – frist for levering av tredjepartsopplysninger",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/rapportering-og-bransjer/tredjepartsopplysninger/bank-finans-og-forsikring/aksjesparekonto/",
    description: "Rapporter tredjepartsopplysninger for aksjesparekonto",
    types: ["as"], category: "tredjepartsopplysninger",
  },
  {
    day: 10, months: [1],
    title: "Finansprodukter – frist for levering av tredjepartsopplysninger",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/rapportering-og-bransjer/tredjepartsopplysninger/bank-finans-og-forsikring/finansprodukter/",
    description: "Rapporter tredjepartsopplysninger for finansprodukter",
    types: ["as"], category: "tredjepartsopplysninger",
  },
  {
    day: 10, months: [1],
    title: "Fondskonto – frist for levering av tredjepartsopplysninger",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/rapportering-og-bransjer/tredjepartsopplysninger/bank-finans-og-forsikring/fondskonto/",
    description: "Rapporter tredjepartsopplysninger for fondskonto",
    types: ["as"], category: "tredjepartsopplysninger",
  },
  {
    day: 10, months: [1],
    title: "Verdipapirfond – frist for levering av tredjepartsopplysninger",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/rapportering-og-bransjer/tredjepartsopplysninger/bank-finans-og-forsikring/verdipapirfond/",
    description: "Rapporter tredjepartsopplysninger for verdipapirfond",
    types: ["as"], category: "tredjepartsopplysninger",
  },
  {
    day: 15, months: [1],
    title: "Tredjepartsopplysninger – frist for å sende årsoppgave til den skattepliktige",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/rapportering-og-bransjer/tredjepartsopplysninger/",
    description: "Send årsoppgave til den skattepliktige innen fristen",
    types: ["as"], category: "tredjepartsopplysninger",
  },
  {
    day: 15, months: [1],
    title: "Betalinger til selvstendig næringsdrivende – frist for levering av tredjepartsopplysninger",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/rapportering-og-bransjer/tredjepartsopplysninger/andre-bransjer/betalinger-til-s-n/",
    description: "Rapporter betalinger til selvstendig næringsdrivende",
    types: ["as"], category: "tredjepartsopplysninger",
  },
  {
    day: 15, months: [1],
    title: "Godtgjøring til opphaver til åndsverk – frist for levering av tredjepartsopplysninger",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/rapportering-og-bransjer/tredjepartsopplysninger/andre-bransjer/godtgjoring-til-opphaver-til-andsverk/",
    description: "Rapporter godtgjøring til opphaver til åndsverk",
    types: ["as"], category: "tredjepartsopplysninger",
  },
  {
    day: 20, months: [1],
    title: "Boligselskap – frist for å korrigere feil i innsendte tredjepartsopplysninger",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/rapportering-og-bransjer/tredjepartsopplysninger/eiendom-og-bolig/boligselskap/",
    description: "Korriger eventuelle feil i tredjepartsopplysninger for boligselskap",
    types: ["as"], category: "tredjepartsopplysninger",
  },
  {
    day: 20, months: [1],
    title: "VPS – frist for rapportering av transaksjonsoppgaver",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/rapportering-og-bransjer/tredjepartsopplysninger/bank-finans-og-forsikring/finansielle-instrumenter/",
    description: "VPS rapportering av transaksjonsoppgaver",
    types: ["as"], category: "tredjepartsopplysninger",
  },

  // =====================================================
  // TREDJEPARTSOPPLYSNINGER – Korrigering (1. mars)
  // =====================================================
  {
    day: 1, months: [2],
    title: "Tilskudd til vitenskapelig forskning eller yrkesopplæring – frist for å korrigere feil",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/rapportering-og-bransjer/tredjepartsopplysninger/gaver-og-tilskudd/tilskudd-til-forskning-eller-yrkesopplaring/",
    description: "Korriger feil i innsendte tredjepartsopplysninger",
    types: ["as"], category: "tredjepartsopplysninger",
  },
  {
    day: 1, months: [2],
    title: "Underholdsbidrag – frist for å korrigere feil i innsendte tredjepartsopplysninger",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/rapportering-og-bransjer/tredjepartsopplysninger/offentlig-myndighet/underholdsbidrag/",
    description: "Korriger feil i tredjepartsopplysninger om underholdsbidrag",
    types: ["as"], category: "tredjepartsopplysninger",
  },
  {
    day: 1, months: [2],
    title: "Individuelle pensjonsordninger – frist for å korrigere feil",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/rapportering-og-bransjer/tredjepartsopplysninger/bank-finans-og-forsikring/individuelle-pensjonsordninger/",
    description: "Korriger feil i tredjepartsopplysninger for individuelle pensjonsordninger",
    types: ["as"], category: "tredjepartsopplysninger",
  },
  {
    day: 1, months: [2],
    title: "Innskudd, utlån og renter mv. – frist for å korrigere feil",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/rapportering-og-bransjer/tredjepartsopplysninger/bank-finans-og-forsikring/innskudd-utlan-og-renter-mv/",
    description: "Korriger feil i tredjepartsopplysninger for innskudd, utlån og renter",
    types: ["as"], category: "tredjepartsopplysninger",
  },
  {
    day: 1, months: [2],
    title: "Skadeforsikring – frist for å korrigere feil",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/rapportering-og-bransjer/tredjepartsopplysninger/bank-finans-og-forsikring/skadeforsikring/",
    description: "Korriger feil i tredjepartsopplysninger for skadeforsikring",
    types: ["as"], category: "tredjepartsopplysninger",
  },
  {
    day: 1, months: [2],
    title: "Fondskonto – frist for å korrigere feil",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/rapportering-og-bransjer/tredjepartsopplysninger/bank-finans-og-forsikring/fondskonto/",
    description: "Korriger feil i tredjepartsopplysninger for fondskonto",
    types: ["as"], category: "tredjepartsopplysninger",
  },
  {
    day: 1, months: [2],
    title: "Godtgjøring til opphaver til åndsverk – frist for å korrigere feil",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/rapportering-og-bransjer/tredjepartsopplysninger/andre-bransjer/godtgjoring-til-opphaver-til-andsverk/",
    description: "Korriger feil i tredjepartsopplysninger for åndsverk",
    types: ["as"], category: "tredjepartsopplysninger",
  },
  {
    day: 1, months: [2],
    title: "Livsforsikring – frist for å korrigere feil",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/rapportering-og-bransjer/tredjepartsopplysninger/bank-finans-og-forsikring/livsforsikring/",
    description: "Korriger feil i tredjepartsopplysninger for livsforsikring",
    types: ["as"], category: "tredjepartsopplysninger",
  },
  {
    day: 1, months: [2],
    title: "Verdipapirfond – frist for å korrigere feil",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/rapportering-og-bransjer/tredjepartsopplysninger/bank-finans-og-forsikring/verdipapirfond/",
    description: "Korriger feil i tredjepartsopplysninger for verdipapirfond",
    types: ["as"], category: "tredjepartsopplysninger",
  },
  {
    day: 1, months: [2],
    title: "Boligsameier – frist for å korrigere feil",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/rapportering-og-bransjer/tredjepartsopplysninger/eiendom-og-bolig/boligsameie/",
    description: "Korriger feil i tredjepartsopplysninger for boligsameier",
    types: ["as"], category: "tredjepartsopplysninger",
  },
  {
    day: 1, months: [2],
    title: "Finansprodukter – frist for å korrigere feil",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/rapportering-og-bransjer/tredjepartsopplysninger/bank-finans-og-forsikring/finansprodukter/",
    description: "Korriger feil i tredjepartsopplysninger for finansprodukter",
    types: ["as"], category: "tredjepartsopplysninger",
  },
  {
    day: 1, months: [2],
    title: "Pass og stell av barn – frist for å korrigere feil",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/rapportering-og-bransjer/tredjepartsopplysninger/andre-bransjer/pass-og-stell-av-barn/",
    description: "Korriger feil i tredjepartsopplysninger for pass og stell av barn",
    types: ["as"], category: "tredjepartsopplysninger",
  },
  {
    day: 1, months: [2],
    title: "Boligsparing for ungdom (BSU) – frist for å korrigere feil",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/rapportering-og-bransjer/tredjepartsopplysninger/bank-finans-og-forsikring/bsu/",
    description: "Korriger feil i tredjepartsopplysninger for BSU",
    types: ["as"], category: "tredjepartsopplysninger",
  },
  {
    day: 1, months: [2],
    title: "Fagforeningskontingent – frist for å korrigere feil",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/rapportering-og-bransjer/tredjepartsopplysninger/andre-bransjer/fagforeningskontingent/",
    description: "Korriger feil i tredjepartsopplysninger for fagforeningskontingent",
    types: ["as"], category: "tredjepartsopplysninger",
  },
  {
    day: 1, months: [2],
    title: "Gaver til visse frivillige organisasjoner og tros-/livssynssamfunn – frist for å korrigere feil",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/rapportering-og-bransjer/tredjepartsopplysninger/gaver-og-tilskudd/gaver-til-organisasjoner/",
    description: "Korriger feil i tredjepartsopplysninger for gaver til organisasjoner",
    types: ["as"], category: "tredjepartsopplysninger",
  },
  {
    day: 1, months: [2],
    title: "Utleie av fast eiendom fra formidlingsselskaper – frist for å korrigere feil",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/rapportering-og-bransjer/tredjepartsopplysninger/eiendom-og-bolig/formidlingstjenester-eiendomsutleie/",
    description: "Korriger feil i tredjepartsopplysninger for eiendomsutleie",
    types: ["as"], category: "tredjepartsopplysninger",
  },
  {
    day: 1, months: [2],
    title: "Aksjesparekonto – frist for å korrigere feil",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/rapportering-og-bransjer/tredjepartsopplysninger/bank-finans-og-forsikring/aksjesparekonto/",
    description: "Korriger feil i tredjepartsopplysninger for aksjesparekonto",
    types: ["as"], category: "tredjepartsopplysninger",
  },
];

function generateDeadlines(monthsAhead: number = 12) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const deadlines: {
    date: string;
    day: number;
    month: string;
    year: number;
    title: string;
    url: string;
    description?: string;
    types: CompanyType[];
    category: Category;
  }[] = [];

  const monthNames = [
    "januar", "februar", "mars", "april", "mai", "juni",
    "juli", "august", "september", "oktober", "november", "desember",
  ];

  for (let offset = 0; offset <= monthsAhead; offset++) {
    const targetDate = new Date(today.getFullYear(), today.getMonth() + offset, 1);
    const m = targetDate.getMonth();
    const y = targetDate.getFullYear();

    for (const tmpl of TEMPLATES) {
      if (tmpl.months.length > 0 && !tmpl.months.includes(m)) continue;

      const lastDay = new Date(y, m + 1, 0).getDate();
      const day = Math.min(tmpl.day, lastDay);
      const d = new Date(y, m, day);

      if (d < today) continue;

      deadlines.push({
        date: d.toISOString().split("T")[0],
        day,
        month: monthNames[m],
        year: y,
        title: tmpl.title,
        url: tmpl.url,
        types: tmpl.types,
        category: tmpl.category,
        ...(tmpl.description ? { description: tmpl.description } : {}),
      });
    }
  }

  deadlines.sort((a, b) => a.date.localeCompare(b.date) || a.title.localeCompare(b.title));
  const seen = new Set<string>();
  return deadlines.filter(d => {
    const key = `${d.date}|${d.title}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const limit = body.limit || 10;
    const filterTypes: string[] = body.types || [];
    const filterCategories: string[] = body.categories || [];
    const allDeadlines = body.all === true;

    let deadlines = generateDeadlines(allDeadlines ? 12 : 6);

    if (filterTypes.length > 0) {
      deadlines = deadlines.filter(d =>
        d.types.some((t: string) => filterTypes.includes(t))
      );
    }

    if (filterCategories.length > 0) {
      deadlines = deadlines.filter(d => filterCategories.includes(d.category));
    }

    return new Response(JSON.stringify({
      deadlines: allDeadlines ? deadlines : deadlines.slice(0, limit),
      total: deadlines.length,
      availableTypes: ["as", "enk", "arbeidsgiver"],
      availableCategories: ["mva", "skatt", "arbeidsgiver", "tredjepartsopplysninger", "saravgift", "regnskap"],
      lastUpdated: new Date().toISOString(),
      source: "skatteetaten.no",
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({
      error: e instanceof Error ? e.message : "Unknown error",
      deadlines: [],
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});