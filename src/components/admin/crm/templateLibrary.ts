/* Ferdige e-postmaler – settes inn som redigerbare byggeklosser. */
import { DEFAULT_DESIGN, newBlock, type EmailBlock } from "./blocks";

const b = (type: Parameters<typeof newBlock>[0], patch: Partial<EmailBlock> = {}): EmailBlock => ({
  ...newBlock(type),
  ...patch,
});

export interface LibraryTemplate {
  name: string;
  category: string;
  subject: string;
  preheader: string;
  reason: string;
  blocks: EmailBlock[];
}

const CTA = (text = "Book en uforpliktende prat") => b("button", { text, url: "https://avargo.no/book-mote" });

export const TEMPLATE_LIBRARY: LibraryTemplate[] = [
  {
    name: "Nyetablert – velkommen",
    category: "ny_bedrift",
    subject: "Gratulerer med {{ firma }} – her er regnskapshjelpen dere trenger",
    preheader: "Fast pris, fast rådgiver og full oversikt fra dag én.",
    reason: "Du får denne e-posten fordi {{ firma }} nylig ble registrert i Brønnøysundregistrene med offentlig kontaktinformasjon.",
    blocks: [
      b("heading", { text: "Gratulerer med {{ firma }}!" }),
      b("text", { text: "Hei!\n\nVi så at {{ firma }} nylig ble registrert i Enhetsregisteret. Det er en stor dag – og samtidig starten på en del papirarbeid som må på plass fra første bilag." }),
      b("text", { text: "Vi i Avargo Regnskap hjelper små og mellomstore bedrifter med regnskap, lønn og rapportering til fast pris, uten bindingstid." }),
      b("bullets", { items: ["Fast rådgiver du kan ringe direkte", "Fast månedspris – ingen overraskelser", "Vi tar oss av MVA, lønn og frister", "Gratis oppstartsmøte"] }),
      CTA("Book gratis oppstartsmøte"),
      b("text", { text: "Bare svar på denne e-posten hvis du heller vil at vi ringer deg." }),
    ],
  },
  {
    name: "Oppfølging 1 – ingen svar",
    category: "oppfolging",
    subject: "Rakk du å se e-posten om regnskap for {{ firma }}?",
    preheader: "En kort oppfølging – vi tar gjerne en prat når det passer.",
    reason: "Du får denne oppfølgingen fordi vi tidligere sendte deg informasjon om regnskapstjenester og ikke har hørt fra deg.",
    blocks: [
      b("heading", { text: "En liten oppfølging", size: "md" }),
      b("text", { text: "Hei!\n\nJeg sendte en e-post til {{ firma }} for en liten stund siden om regnskap til fast pris. Hverdagen er travel, så jeg tenkte den kanskje forsvant i innboksen." }),
      b("highlight", { text: "Vi tilbyr en gratis gjennomgang av regnskapet deres – helt uforpliktende, og du får en konkret pris på 15 minutter." }),
      CTA("Finn et tidspunkt som passer"),
      b("text", { text: "Er det ikke aktuelt nå? Svar gjerne «ikke aktuelt», så lar vi dere være i fred." }),
    ],
  },
  {
    name: "Oppfølging 2 – siste påminnelse",
    category: "oppfolging",
    subject: "Siste henvendelse til {{ firma }}",
    preheader: "Vi lukker saken hvis vi ikke hører fra deg.",
    reason: "Dette er vår siste henvendelse til {{ firma }} med mindre du svarer.",
    blocks: [
      b("heading", { text: "Skal vi legge saken bort?", size: "md" }),
      b("text", { text: "Hei!\n\nJeg har sendt et par e-poster om regnskapstjenester til {{ firma }}. Har jeg ikke hørt fra deg innen en uke, lar vi det ligge – da slipper du flere henvendelser fra oss." }),
      b("text", { text: "Skulle det bli aktuelt senere, er det bare å svare på denne e-posten. Vi tar en prat når det passer deg." }),
      CTA("Ta en prat likevel"),
    ],
  },
  {
    name: "Lokalt – regnskapsfører i {{ kommune }}",
    category: "lokal",
    subject: "Regnskapsfører i {{ kommune }} – med fast pris",
    preheader: "Lokal rådgiver som kjenner bedriftene i området.",
    reason: "Du får denne e-posten fordi {{ firma }} er registrert i {{ kommune }} med offentlig kontaktinformasjon i Enhetsregisteret.",
    blocks: [
      b("heading", { text: "Trenger {{ firma }} en regnskapsfører i {{ kommune }}?" }),
      b("text", { text: "Hei!\n\nVi jobber med flere bedrifter i {{ kommune }} og området rundt, og har ledig kapasitet til noen nye kunder nå." }),
      b("bullets", { items: ["Fast kontaktperson – ikke et kundesenter", "Digitalt regnskap, men med folk du kan møte", "Fast månedspris tilpasset størrelsen på {{ firma }}", "Vi overtar dialogen med dagens regnskapsfører"] }),
      CTA("Book et møte"),
      b("text", { text: "Vi kan også ta en kaffe hos dere hvis det er enklere." }),
    ],
  },
  {
    name: "Lokalt – nabobedrifter i samme bransje",
    category: "lokal",
    subject: "Vi hjelper flere {{ bransje }}-bedrifter i {{ kommune }}",
    preheader: "Bransjekunnskap og lokal tilstedeværelse.",
    reason: "Du får denne e-posten fordi {{ firma }} er registrert i {{ kommune }} innen {{ bransje }}.",
    blocks: [
      b("heading", { text: "Regnskap for {{ bransje }} i {{ kommune }}" }),
      b("text", { text: "Hei!\n\nVi fører regnskap for flere bedrifter innen {{ bransje }} i nærområdet, og kjenner både kostnadsbildet og de typiske fallgruvene i bransjen." }),
      b("highlight", { text: "Kort oppsummert: riktig MVA-behandling, kontroll på lønn og timer, og en pris du vet på forhånd." }),
      CTA("Få et pristilbud"),
    ],
  },
  {
    name: "Byttekandidat – prissjekk",
    category: "har_regnskapsforer",
    subject: "Betaler {{ firma }} for mye for regnskapet?",
    preheader: "Gratis prissjekk – du får svar samme uke.",
    reason: "Du får denne e-posten fordi {{ firma }} er registrert i Enhetsregisteret med offentlig kontaktinformasjon.",
    blocks: [
      b("heading", { text: "Gratis prissjekk på regnskapet" }),
      b("text", { text: "Hei!\n\nMange bedrifter betaler timepris uten å vite hva de faktisk får. Vi tilbyr en gratis gjennomgang der du får en konkret fastpris for {{ firma }}." }),
      b("bullets", { items: ["Du sender siste faktura fra dagens regnskapsfører", "Vi regner på hva samme jobb koster hos oss", "Du får svar innen 24 timer – uten forpliktelser"] }),
      CTA("Send inn for prissjekk"),
      b("text", { text: "Er dere fornøyd med {{ regnskapsforer }} i dag, er det helt greit – da vet dere i hvert fall at prisen er riktig." }),
    ],
  },
  {
    name: "Byttekandidat – enkelt å bytte",
    category: "har_regnskapsforer",
    subject: "Å bytte regnskapsfører tar 20 minutter",
    preheader: "Vi ordner overføring og oppsigelse for deg.",
    reason: "Du får denne e-posten fordi {{ firma }} er registrert i Enhetsregisteret med offentlig kontaktinformasjon.",
    blocks: [
      b("heading", { text: "Bytte er enklere enn du tror" }),
      b("text", { text: "Hei!\n\nDen vanligste grunnen til at bedrifter blir værende hos feil regnskapsfører er at de tror bytte er komplisert. Det er det ikke." }),
      b("bullets", { items: ["Vi sender oppsigelse til {{ regnskapsforer }}", "Vi henter ut historikk og bilag", "Vi setter opp systemet og kjører parallelt første måned", "Du gjør: signerer én fullmakt"] }),
      CTA("Start byttet"),
    ],
  },
  {
    name: "Uten regnskapsfører – gjør du det selv?",
    category: "ingen_regnskapsforer",
    subject: "Bruker du kveldene på regnskapet i {{ firma }}?",
    preheader: "Vi tar papirarbeidet – du tar kundene.",
    reason: "Du får denne e-posten fordi {{ firma }} er registrert i Enhetsregisteret uten registrert regnskapsfører.",
    blocks: [
      b("heading", { text: "Gi bort regnskapet – behold kontrollen" }),
      b("text", { text: "Hei!\n\nVi ser at {{ firma }} ikke har registrert regnskapsfører. Mange gjør jobben selv, og det fungerer helt til frister, MVA og lønn begynner å stjele kveldene." }),
      b("highlight", { text: "Snittkunden vår sparer 6–10 timer i måneden på å sette bort regnskapet." }),
      CTA("Se hva det koster for {{ firma }}"),
    ],
  },
  {
    name: "Bransjetilpasset – {{ bransje }}",
    category: "generell",
    subject: "Regnskap tilpasset {{ bransje }}",
    preheader: "Vi kjenner tallene i bransjen din.",
    reason: "Du får denne e-posten fordi {{ firma }} er registrert innen {{ bransje }} i Enhetsregisteret.",
    blocks: [
      b("heading", { text: "Regnskap for {{ bransje }}" }),
      b("text", { text: "Hei!\n\nRegnskap er ikke likt for alle bransjer. Innen {{ bransje }} handler det ofte om prosjektøkonomi, timer og riktig MVA-behandling." }),
      b("bullets", { items: ["Prosjekt- og avdelingsregnskap", "Time- og lønnsflyt uten dobbeltarbeid", "Månedsrapport du faktisk forstår"] }),
      CTA(),
    ],
  },
  {
    name: "Fristpåminnelse – MVA og årsoppgjør",
    category: "generell",
    subject: "Frister som gjelder {{ firma }} i år",
    preheader: "Kort oversikt over MVA, skattemelding og årsregnskap.",
    reason: "Du får denne e-posten fordi {{ firma }} er registrert i Enhetsregisteret med offentlig kontaktinformasjon.",
    blocks: [
      b("heading", { text: "Har dere kontroll på fristene?" }),
      b("text", { text: "Hei!\n\nHer er de viktigste fristene for et {{ selskapsform }} som {{ firma }}:" }),
      b("bullets", { items: ["MVA-melding annenhver måned", "A-melding den 5. hver måned", "Skattemelding for næringsdrivende", "Årsregnskap og innsending til Regnskapsregisteret"] }),
      b("text", { text: "Vil dere ha fristene automatisk håndtert, tar vi gjerne en prat." }),
      CTA("Sett opp en gjennomgang"),
    ],
  },
  {
    name: "Kort møtebooking",
    category: "generell",
    subject: "15 minutter om regnskapet i {{ firma }}?",
    preheader: "Kort prat, konkret pris.",
    reason: "Du får denne e-posten fordi {{ firma }} er registrert i Enhetsregisteret med offentlig kontaktinformasjon.",
    blocks: [
      b("text", { text: "Hei!\n\nKort spørsmål: har dere 15 minutter til en prat om regnskapet i {{ firma }}? Du får en konkret fastpris, og så bestemmer du selv." }),
      CTA("Velg tidspunkt"),
      b("text", { text: "Hilsen – og god arbeidsuke!" }),
    ],
  },
  {
    name: "Krysssalg – lønn og HR",
    category: "generell",
    subject: "Lønn og personal for {{ firma }} – uten hodebry",
    preheader: "Lønnskjøring, A-melding og arbeidsavtaler samlet ett sted.",
    reason: "Du får denne e-posten fordi {{ firma }} er registrert med ansatte i Enhetsregisteret.",
    blocks: [
      b("heading", { text: "Lønn, A-melding og personal" }),
      b("text", { text: "Hei!\n\nMed {{ ansatte }} ansatte i {{ firma }} går det fort mye tid til lønnskjøring, feriepenger og arbeidsavtaler." }),
      b("bullets", { items: ["Lønnskjøring og A-melding hver måned", "Arbeidsavtaler og personalhåndbok", "Sykefravær, ferie og permisjoner", "Fast pris per ansatt"] }),
      CTA("Book HR-prat"),
    ],
  },
  {
    name: "Reaktivering – tidligere kontakt",
    category: "oppfolging",
    subject: "Er regnskap fortsatt aktuelt for {{ firma }}?",
    preheader: "Vi tar gjerne opp tråden igjen.",
    reason: "Du får denne e-posten fordi vi har vært i kontakt med {{ firma }} tidligere.",
    blocks: [
      b("heading", { text: "Skal vi ta opp tråden?", size: "md" }),
      b("text", { text: "Hei!\n\nVi snakket om regnskap for {{ firma }} for en stund siden. Situasjonen endrer seg fort, så jeg tenkte å høre om det er blitt mer aktuelt nå." }),
      CTA("Ta en ny prat"),
    ],
  },
];

export const LIBRARY_DESIGN = DEFAULT_DESIGN;
