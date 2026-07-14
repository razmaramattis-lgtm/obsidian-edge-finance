// Datamodell for protokoll- og generalforsamlingsgeneratoren.
// Én sentral selskapsprofil deles på tvers av alle dokumenter i pakken.

export interface Person {
  navn: string;
  rolle?: string;
  epost?: string;
  telefon?: string;
  deltok?: boolean;
}

export interface Aksjonaer {
  navn: string;
  antall_aksjer: number;
  andel_prosent?: number;
  representant_fullmektig?: string;
}

export interface CompanyProfile {
  selskap: {
    navn: string;
    orgnummer: string;
    adresse: string;
    postnummer: string;
    poststed: string;
    stiftelsesdato: string;
    regnskapsaar: string;
  };
  styre: {
    styreleder: Person;
    styremedlemmer: Person[];
    varamedlemmer: Person[];
  };
  daglig_leder: Person;
  revisor: {
    har_revisor: boolean;
    navn: string;
    orgnummer: string;
  };
  aksjonaerer: Aksjonaer[];
  moteinfo: {
    dato: string;
    klokkeslett: string;
    sted_eller_moteform: string;
    motenr: string;
  };
  regnskap: {
    arstall: string;
    arets_resultat: number;
    utbytte: number;
    overforing_annen_egenkapital: number;
    har_arsberetning: boolean;
  };
}

export const emptyProfile = (): CompanyProfile => ({
  selskap: { navn: "", orgnummer: "", adresse: "", postnummer: "", poststed: "", stiftelsesdato: "", regnskapsaar: "" },
  styre: {
    styreleder: { navn: "", epost: "", telefon: "" },
    styremedlemmer: [],
    varamedlemmer: [],
  },
  daglig_leder: { navn: "", epost: "", telefon: "" },
  revisor: { har_revisor: false, navn: "", orgnummer: "" },
  aksjonaerer: [],
  moteinfo: { dato: "", klokkeslett: "", sted_eller_moteform: "", motenr: "" },
  regnskap: { arstall: new Date().getFullYear().toString(), arets_resultat: 0, utbytte: 0, overforing_annen_egenkapital: 0, har_arsberetning: false },
});

// -------- Dokumenttyper --------

export type DocumentType =
  | "styremoteprotokoll"
  | "innkalling_styremote"
  | "gf_forenklet"
  | "innkalling_gf"
  | "gf_alminnelige_regler";

export const documentTypes: { id: DocumentType; navn: string; kort: string }[] = [
  { id: "styremoteprotokoll", navn: "Styremøteprotokoll", kort: "Protokoll fra styremøte etter aksjeloven § 6-29." },
  { id: "innkalling_styremote", navn: "Innkalling til styremøte", kort: "Formell innkalling til styremøte med saksliste." },
  { id: "gf_forenklet", navn: "Ordinær generalforsamling (forenklet)", kort: "Protokoll etter forenklede regler i aksjeloven § 5-7." },
  { id: "gf_alminnelige_regler", navn: "Ordinær generalforsamling (alminnelig)", kort: "Protokoll etter aksjeloven §§ 5-8 og 5-9." },
  { id: "innkalling_gf", navn: "Innkalling til generalforsamling", kort: "Innkalling med saksliste og påmeldingsfrist." },
];

// -------- Sak-moduler (gjenbrukbare byggeklosser) --------

export type SakModulId =
  | "valg_revisor"
  | "styreendring"
  | "disponering_arsresultat"
  | "konsernbidrag"
  | "lan_selskap_aksjonaer"
  | "valg_daglig_leder"
  | "utbytte_ekstraordinaert"
  | "vedtektsendring"
  | "kapitalendring"
  | "fritekst_sak";

export interface SakModulDef {
  id: SakModulId;
  tittel: string;
  beskrivelse: string;
  felt: { key: string; label: string; type: "text" | "number" | "date" | "bool" | "textarea" }[];
}

export const sakModuler: SakModulDef[] = [
  {
    id: "valg_revisor",
    tittel: "Valg av revisor",
    beskrivelse: "Valg eller fravalg av revisor etter aksjeloven § 7-6.",
    felt: [
      { key: "har_revisor", label: "Skal selskapet ha revisor?", type: "bool" },
      { key: "revisor_navn", label: "Navn på revisor / revisjonsselskap", type: "text" },
      { key: "revisor_orgnr", label: "Org.nr revisor", type: "text" },
      { key: "tiltredelsesdato", label: "Tiltredelsesdato", type: "date" },
      { key: "godtgjorelse", label: "Godtgjørelse (fritekst)", type: "text" },
    ],
  },
  {
    id: "styreendring",
    tittel: "Endring i styresammensetning",
    beskrivelse: "Uttredende og inntredende styremedlemmer.",
    felt: [
      { key: "navn_uttredende", label: "Uttredende (navn)", type: "text" },
      { key: "navn_inntredende", label: "Inntredende (navn)", type: "text" },
      { key: "rolle_inntredende", label: "Rolle (leder/nestleder/medlem/vara)", type: "text" },
      { key: "dato_endring", label: "Dato for endring", type: "date" },
      { key: "meld_brreg", label: "Meldes til Foretaksregisteret?", type: "bool" },
    ],
  },
  {
    id: "disponering_arsresultat",
    tittel: "Disponering av årsresultat",
    beskrivelse: "Vedtak om utbytte og overføring til annen egenkapital.",
    felt: [
      { key: "arets_resultat", label: "Årets resultat (kr)", type: "number" },
      { key: "utbytte", label: "Utbytte (kr)", type: "number" },
      { key: "overforing", label: "Overføring til annen egenkapital (kr)", type: "number" },
      { key: "fritekst", label: "Ev. tilleggstekst", type: "textarea" },
    ],
  },
  {
    id: "konsernbidrag",
    tittel: "Konsernbidrag",
    beskrivelse: "Konsernbidrag etter aksjeloven § 8-5.",
    felt: [
      { key: "giver_navn", label: "Giverselskap", type: "text" },
      { key: "giver_orgnr", label: "Org.nr giver", type: "text" },
      { key: "mottaker_navn", label: "Mottakerselskap", type: "text" },
      { key: "mottaker_orgnr", label: "Org.nr mottaker", type: "text" },
      { key: "belop", label: "Beløp (kr)", type: "number" },
      { key: "skattemessig_virkning", label: "Med skattemessig virkning?", type: "bool" },
      { key: "regnskapsar", label: "Regnskapsår", type: "text" },
    ],
  },
  {
    id: "lan_selskap_aksjonaer",
    tittel: "Lån til/fra selskap",
    beskrivelse: "Lån mellom selskap og aksjonær, jf. § 8-7.",
    felt: [
      { key: "langiver", label: "Långiver", type: "text" },
      { key: "lantaker", label: "Låntaker", type: "text" },
      { key: "belop", label: "Beløp (kr)", type: "number" },
      { key: "rentesats", label: "Rentesats (%)", type: "number" },
      { key: "forfallsdato", label: "Forfallsdato", type: "date" },
      { key: "sikkerhet", label: "Sikkerhet", type: "text" },
    ],
  },
  {
    id: "valg_daglig_leder",
    tittel: "Valg av daglig leder",
    beskrivelse: "Utnevnelse av ny daglig leder.",
    felt: [
      { key: "navn", label: "Navn", type: "text" },
      { key: "tiltredelsesdato", label: "Tiltredelsesdato", type: "date" },
      { key: "fratredende", label: "Fratredende daglig leder", type: "text" },
    ],
  },
  {
    id: "utbytte_ekstraordinaert",
    tittel: "Utbytte (ekstraordinært / tilleggsutbytte)",
    beskrivelse: "Utbytte utover ordinært årsutbytte, jf. § 8-2.",
    felt: [
      { key: "belop", label: "Beløp (kr)", type: "number" },
      { key: "utdelingsdato", label: "Utdelingsdato", type: "date" },
      { key: "grunnlag", label: "Grunnlag (siste årsregnskap / mellombalanse)", type: "text" },
    ],
  },
  {
    id: "vedtektsendring",
    tittel: "Vedtektsendring",
    beskrivelse: "Endring av selskapets vedtekter.",
    felt: [
      { key: "paragraf", label: "Paragraf", type: "text" },
      { key: "gammel_ordlyd", label: "Gammel ordlyd", type: "textarea" },
      { key: "ny_ordlyd", label: "Ny ordlyd", type: "textarea" },
      { key: "begrunnelse", label: "Begrunnelse", type: "textarea" },
    ],
  },
  {
    id: "kapitalendring",
    tittel: "Kapitalforhøyelse / -nedsettelse",
    beskrivelse: "Endring av selskapets aksjekapital.",
    felt: [
      { key: "belop", label: "Beløp (kr)", type: "number" },
      { key: "antall_aksjer", label: "Antall nye aksjer", type: "number" },
      { key: "tegningskurs", label: "Tegningskurs (kr)", type: "number" },
      { key: "tegner", label: "Hvem tegner", type: "text" },
      { key: "innbetalingsform", label: "Innbetalingsform", type: "text" },
    ],
  },
  {
    id: "fritekst_sak",
    tittel: "Annen sak (fritekst)",
    beskrivelse: "Fri sak med egen overskrift og vedtak.",
    felt: [
      { key: "overskrift", label: "Overskrift", type: "text" },
      { key: "beskrivelse", label: "Beskrivelse", type: "textarea" },
      { key: "vedtak", label: "Vedtak", type: "textarea" },
    ],
  },
];

export interface SakModulValg {
  id: SakModulId;
  data: Record<string, string | number | boolean>;
}

export interface DocumentState {
  type: DocumentType;
  answers: Record<string, string | number | boolean>;
  sub_sections: SakModulValg[];
}

export const emptyDocument = (type: DocumentType): DocumentState => ({
  type,
  answers: {},
  sub_sections: [],
});
