import type { GeneratorConfig } from "./types";

const f = (v: any, fallback: string) => v || `<span class="merge-field">[${fallback}]</span>`;

export const personalhandbokConfig: GeneratorConfig = {
  id: "personalhandbok",
  title: "Personalhåndbok",
  subtitle: "Komplett personalhåndbok med alle lovpålagte og anbefalte kapitler",
  documentCategory: "HR-Personalhåndbok",
  defaultValues: {
    companyName: "", orgNumber: "", ceoName: "", address: "",
    numEmployees: "", industry: "",
    normalHours: "37.5", lunchDuration: "30", lunchPaid: false,
    coreHoursStart: "09:00", coreHoursEnd: "15:00",
    vacationDays: "25", vacationDeadline: "1. mars",
    sickSelfDays: "3", sickSelfPeriods: "4",
    noticePeriod: "3", probationMonths: "6",
    salaryDate: "15.", overtimeRate: "40",
    pensionProvider: "", pensionPercent: "2",
    insuranceProvider: "",
    travelPolicy: "Rimeligste reisemåte",
    dressCode: "Passende for arbeidssituasjonen",
    whistleblowerChannel: "Daglig leder",
    diversityStatement: true,
    itTools: "Microsoft 365",
    remotePolicy: "Inntil 2 dager per uke",
  },
  fieldGroups: [
    {
      title: "Bedriftsinformasjon",
      fields: [
        { id: "companyName", label: "Bedriftsnavn", type: "text", placeholder: "Avargo AS" },
        { id: "orgNumber", label: "Org.nummer", type: "text", placeholder: "999 999 999" },
        { id: "ceoName", label: "Daglig leder", type: "text", placeholder: "Ola Nordmann" },
        { id: "address", label: "Adresse", type: "text", placeholder: "Storgata 1, 0001 Oslo" },
        { id: "numEmployees", label: "Antall ansatte", type: "number", placeholder: "10" },
        { id: "industry", label: "Bransje", type: "text", placeholder: "Konsulentvirksomhet" },
      ],
    },
    {
      title: "Arbeidstid og ferie",
      fields: [
        { id: "normalHours", label: "Ukentlig arbeidstid (timer)", type: "text" },
        { id: "coreHoursStart", label: "Kjernetid start", type: "text" },
        { id: "coreHoursEnd", label: "Kjernetid slutt", type: "text" },
        { id: "lunchDuration", label: "Lunsjpause (min)", type: "text" },
        { id: "lunchPaid", label: "Betalt lunsj", type: "checkbox", helpText: "Lunsjpausen er betalt" },
        { id: "vacationDays", label: "Feriedager", type: "text" },
        { id: "vacationDeadline", label: "Frist ferieønsker", type: "text" },
      ],
    },
    {
      title: "Fravær og oppsigelse",
      fields: [
        { id: "sickSelfDays", label: "Egenmeldingsdager", type: "text" },
        { id: "sickSelfPeriods", label: "Egenmeldingsperioder/12 mnd", type: "text" },
        { id: "noticePeriod", label: "Oppsigelsestid (måneder)", type: "text" },
        { id: "probationMonths", label: "Prøvetid (måneder)", type: "text" },
      ],
    },
    {
      title: "Lønn og goder",
      fields: [
        { id: "salaryDate", label: "Lønningsdag", type: "text" },
        { id: "overtimeRate", label: "Overtidstillegg (%)", type: "text" },
        { id: "pensionProvider", label: "Pensjonsleverandør", type: "text", placeholder: "Storebrand" },
        { id: "pensionPercent", label: "Pensjon (%)", type: "text" },
        { id: "insuranceProvider", label: "Forsikringsleverandør", type: "text" },
      ],
    },
    {
      title: "Kultur og retningslinjer",
      fields: [
        { id: "dressCode", label: "Kleskode", type: "text" },
        { id: "travelPolicy", label: "Reisepolicy", type: "text" },
        { id: "remotePolicy", label: "Hjemmekontor-policy", type: "text" },
        { id: "itTools", label: "Digitale verktøy", type: "text" },
        { id: "whistleblowerChannel", label: "Varslingskontakt", type: "text" },
        { id: "diversityStatement", label: "Mangfoldserklæring", type: "checkbox", helpText: "Inkluder mangfolds- og inkluderingserklæring" },
      ],
    },
  ],
  sections: [
    {
      id: "intro",
      title: "Introduksjon og formål",
      content: (form) => `<h2>1. Introduksjon og formål</h2>
<p>Denne personalhåndboken gjelder for alle ansatte i <strong>${f(form.companyName, "Bedriftsnavn")}</strong> (org.nr. ${f(form.orgNumber, "Org.nr.")}) og er ment som et oppslagsverk for rettigheter, plikter og rutiner som gjelder i arbeidsforholdet.</p>
<h3>Formål</h3>
<p>Håndboken skal:</p>
<ul>
<li>Gi en samlet oversikt over arbeidsvilkår, retningslinjer og rutiner</li>
<li>Sikre likebehandling og forutsigbarhet for alle ansatte</li>
<li>Tydeliggjøre gjensidige forventninger mellom arbeidsgiver og arbeidstaker</li>
<li>Være et levende dokument som oppdateres ved endringer i lov, tariffavtale eller interne forhold</li>
</ul>
<h3>Virkeområde</h3>
<p>Håndboken gjelder for alle ansatte, uavhengig av stillingsbrøk, og supplerer den individuelle arbeidskontrakten. Ved motstrid mellom håndboken og arbeidskontrakten, gjelder arbeidskontrakten.</p>
<h3>Ansvar</h3>
<p>Daglig leder ${f(form.ceoName, "Daglig leder")} er ansvarlig for at håndboken holdes oppdatert. Alle ansatte plikter å gjøre seg kjent med innholdet.</p>`,
    },
    {
      id: "ansettelse",
      title: "Arbeidsforhold og ansettelse",
      content: (form) => `<h2>2. Arbeidsforhold og ansettelse</h2>
<h3>Rekruttering</h3>
<p>${f(form.companyName, "Bedriftsnavn")} følger prinsippene om likestilling og ikke-diskriminering ved rekruttering, i tråd med likestillings- og diskrimineringsloven.</p>
<h3>Arbeidskontrakt</h3>
<p>Alle ansatte skal ha skriftlig arbeidskontrakt senest 7 dager etter tiltredelse (fra 1. juli 2024). Kontrakten skal inneholde alle punkter nevnt i arbeidsmiljøloven § 14-6.</p>
<h3>Prøvetid</h3>
<p>Prøvetiden er ${f(form.probationMonths, "Prøvetid")} måneder, med gjensidig oppsigelsestid på 14 dager i prøvetiden med mindre annet er avtalt.</p>
<h3>Stillingskategorier</h3>
<ul>
<li><strong>Fast ansatt</strong> — Hovedregel. Rett til fast ansettelse etter arbeidsmiljøloven.</li>
<li><strong>Midlertidig ansatt</strong> — Kun ved lovlig grunnlag (vikariat, prosjekt, sesong).</li>
<li><strong>Deltidsansatt</strong> — Samme rettigheter forholdsmessig som heltidsansatte.</li>
</ul>
<h3>Onboarding</h3>
<p>Nye ansatte gjennomgår et strukturert onboarding-program som inkluderer:</p>
<ol>
<li>Gjennomgang av personalhåndbok og arbeidsreglement</li>
<li>Presentasjon av kollegaer og organisasjon</li>
<li>Opplæring i IT-systemer og sikkerhet</li>
<li>HMS-gjennomgang</li>
<li>Oppfølgingssamtaler i prøvetiden</li>
</ol>`,
    },
    {
      id: "arbeidstid",
      title: "Arbeidstid og timeregistrering",
      content: (form) => `<h2>3. Arbeidstid og timeregistrering</h2>
<h3>Alminnelig arbeidstid</h3>
<p>Normal arbeidstid er <strong>${f(form.normalHours, "Timer")} timer per uke</strong>. Kjernetid er ${f(form.coreHoursStart, "Start")}–${f(form.coreHoursEnd, "Slutt")}, der alle ansatte forventes å være tilgjengelige.</p>
<h3>Fleksitid</h3>
<p>Utenfor kjernetiden kan arbeidstiden tilpasses i dialog med nærmeste leder. Fleksitidssaldo skal ikke overstige ±20 timer.</p>
<h3>Pauser</h3>
<ul>
<li>Lunsjpause: ${f(form.lunchDuration, "Minutter")} minutter${form.lunchPaid ? " (betalt, inkludert i arbeidstiden)" : " (ubetalt, kommer i tillegg til arbeidstiden)"}</li>
<li>Ved arbeidsdager over 8 timer har ansatte krav på minst 30 minutters pause (aml. § 10-9)</li>
</ul>
<h3>Timeregistrering</h3>
<p>Alle ansatte plikter å registrere arbeidstid daglig i bedriftens system. Korrekt føring er den enkeltes ansvar og grunnlag for lønnsutbetaling.</p>
<h3>Overtid</h3>
<p>Overtid skal godkjennes av nærmeste leder på forhånd. Overtidstillegg er ${f(form.overtimeRate, "Prosent")}% i henhold til arbeidsmiljølovens minimumskrav. Maksimalt 10 timer overtid per 7 dager og 25 timer per 4 uker.</p>
<h3>Hjemmekontor</h3>
<p>${f(form.companyName, "Bedriftsnavn")} praktiserer følgende hjemmekontorpolicy: <strong>${f(form.remotePolicy, "Hjemmekontor-policy")}</strong>. Hjemmekontoravtale inngås i tråd med forskrift om arbeid i arbeidstakers hjem.</p>`,
    },
    {
      id: "ferie",
      title: "Ferie og fridager",
      content: (form) => `<h2>4. Ferie og fridager</h2>
<h3>Ferierettigheter</h3>
<p>Ansatte har rett til ${f(form.vacationDays, "Dager")} virkedager ferie per år i henhold til ferieloven (25 virkedager = 5 uker for ansatte over 60 år). Arbeidsgiver plikter å sørge for at ferie avvikles.</p>
<h3>Ferieavvikling</h3>
<ul>
<li>Arbeidstaker kan kreve å avvikle tre uker sammenhengende ferie i hovedferieperioden (1. juni – 30. september)</li>
<li>Ferieønsker meldes innen <strong>${f(form.vacationDeadline, "Frist")}</strong></li>
<li>Arbeidsgiver fastsetter ferietidspunkt etter drøfting med den ansatte</li>
<li>Overføring av inntil 12 virkedager ferie til neste år kan avtales skriftlig</li>
</ul>
<h3>Feriepenger</h3>
<p>Feriepenger beregnes med 10,2% av feriepengegrunnlaget (12% for ansatte over 60 år). Feriepenger utbetales ved ferieavvikling, normalt i juni.</p>
<h3>Offentlige helligdager</h3>
<p>Alle offentlige helligdager er fridager med lønn. Arbeid på helligdager kompenseres med overtidstillegg og avspasering.</p>`,
    },
    {
      id: "lonn",
      title: "Lønn og godtgjørelser",
      content: (form) => `<h2>5. Lønn og godtgjørelser</h2>
<h3>Lønnsutbetaling</h3>
<p>Lønn utbetales den <strong>${f(form.salaryDate, "Dato")} hver måned</strong>. Lønnsslipp gjøres tilgjengelig elektronisk senest på utbetalingsdagen.</p>
<h3>Lønnsfastsettelse</h3>
<p>Lønn fastsettes individuelt basert på stilling, kompetanse, ansvar og markedsforhold. Årlig lønnssamtale gjennomføres i forbindelse med medarbeidersamtalen.</p>
<h3>Pensjon</h3>
<p>Obligatorisk tjenestepensjon (OTP) er ${f(form.pensionPercent, "Prosent")}% av lønn mellom 1G og 12G. Pensjonsleverandør: <strong>${f(form.pensionProvider, "Leverandør")}</strong>.</p>
<h3>Forsikringer</h3>
<p>Bedriften har følgende forsikringsordninger gjennom ${f(form.insuranceProvider, "Leverandør")}:</p>
<ul>
<li>Yrkesskadeforsikring (lovpålagt)</li>
<li>Gruppelivsforsikring</li>
<li>Reiseforsikring (tjenestereiser)</li>
</ul>
<h3>Utlegg og reiser</h3>
<p>Reisepolicy: <strong>${f(form.travelPolicy, "Reisepolicy")}</strong>. Utlegg refunderes mot kvittering. Diett følger statens satser. Reiseregning leveres innen 30 dager etter reisen.</p>`,
    },
    {
      id: "fravaer",
      title: "Fravær og permisjoner",
      content: (form) => `<h2>6. Fravær og permisjoner</h2>
<h3>Sykefravær</h3>
<ul>
<li><strong>Egenmelding:</strong> Inntil ${f(form.sickSelfDays, "Dager")} kalenderdager per gang, maks ${f(form.sickSelfPeriods, "Perioder")} perioder per 12 måneder (IA-bedrift: inntil 8/24)</li>
<li><strong>Sykemelding:</strong> Kreves fra lege ved fravær utover egenmeldingsperioden</li>
<li>Alt fravær skal meldes til nærmeste leder så tidlig som mulig, senest innen arbeidsdagens start</li>
</ul>
<h3>Sykefraværsoppfølging</h3>
<p>${f(form.companyName, "Bedriftsnavn")} følger arbeidsmiljølovens krav til oppfølging:</p>
<ol>
<li><strong>Innen 4 uker:</strong> Oppfølgingsplan utarbeides i samarbeid med den ansatte</li>
<li><strong>Innen 7 uker:</strong> Dialogmøte 1 med arbeidsgiver (og lege ved behov)</li>
<li><strong>Innen 26 uker:</strong> Dialogmøte 2 med NAV</li>
</ol>
<h3>Lovfestede permisjoner</h3>
<ul>
<li><strong>Foreldrepermisjon:</strong> I henhold til folketrygdloven</li>
<li><strong>Omsorgspermisjon:</strong> 10 dager per år for barn under 12 år</li>
<li><strong>Velferdspermisjon:</strong> Ved begravelse, flytting, akutte familiehendelser — etter avtale med leder</li>
<li><strong>Militærtjeneste:</strong> Permisjon med lønn i henhold til lov</li>
</ul>
<h3>Øvrig fravær</h3>
<p>Fravær utover lovfestede permisjoner krever skriftlig søknad og godkjenning fra nærmeste leder.</p>`,
    },
    {
      id: "taushetsplikt",
      title: "Taushetsplikt og personvern",
      content: (form) => `<h2>7. Taushetsplikt og personvern</h2>
<h3>Taushetsplikt</h3>
<p>Alle ansatte har taushetsplikt om forretningshemmeligheter, kundeforhold, interne forhold og annen konfidensiell informasjon. Taushetsplikten gjelder også etter arbeidsforholdets opphør.</p>
<h3>Personvern</h3>
<p>${f(form.companyName, "Bedriftsnavn")} behandler personopplysninger om ansatte i samsvar med personopplysningsloven og GDPR. Ansatte har rett til:</p>
<ul>
<li>Innsyn i egne personopplysninger</li>
<li>Retting av feilaktige opplysninger</li>
<li>Sletting av opplysninger som ikke lenger er nødvendige</li>
<li>Informasjon om hvilke opplysninger som behandles og formålet</li>
</ul>
<h3>E-postkontroll og innsyn</h3>
<p>Arbeidsgiver kan kun gjennomføre innsyn i e-post og datalagring i tråd med forskrift om arbeidsgivers innsyn i e-postkasse. Innsyn krever saklig grunn og varsles den ansatte.</p>
<h3>Referanser</h3>
<p>Ansatte bestemmer selv om tidligere arbeidsgiver kan kontaktes som referanse. Referanser gis kun med den ansattes samtykke.</p>`,
    },
    {
      id: "it-sikkerhet",
      title: "IT-bruk og digital sikkerhet",
      content: (form) => `<h2>8. IT-bruk og digital sikkerhet</h2>
<h3>Bedriftens utstyr</h3>
<p>IT-utstyr fra ${f(form.companyName, "Bedriftsnavn")} er bedriftens eiendom og skal primært benyttes til arbeidsrelaterte formål. Begrenset privat bruk tillates.</p>
<h3>Digitale verktøy</h3>
<p>Følgende verktøy benyttes: <strong>${f(form.itTools, "Verktøy")}</strong>. Ansatte plikter å følge retningslinjene for hvert system.</p>
<h3>Sikkerhetskrav</h3>
<ul>
<li>Totrinnsverifisering (2FA) er påkrevd for alle bedriftssystemer</li>
<li>Passord skal være minimum 12 tegn og unike</li>
<li>Passord skal ikke deles med andre eller gjenbrukes</li>
<li>Skjermene skal låses ved fravær fra arbeidsplassen</li>
<li>Mistenkelige e-poster rapporteres umiddelbart</li>
</ul>
<h3>Privat bruk</h3>
<ul>
<li>Nedlasting av ulovlig innhold er strengt forbudt</li>
<li>Installasjon av programvare krever godkjenning</li>
<li>Automatisk videresending av bedrifts-e-post er ikke tillatt</li>
</ul>
<h3>Ved avslutning</h3>
<p>Alt IT-utstyr leveres tilbake ved opphør av arbeidsforholdet. Private filer fjernes i rimelig tid før fratredelse.</p>`,
    },
    {
      id: "psykososialt",
      title: "Psykososialt arbeidsmiljø",
      content: (form) => `<h2>9. Psykososialt arbeidsmiljø</h2>
<p>${f(form.companyName, "Bedriftsnavn")} er forpliktet til å sikre et trygt og helsefremmende psykososialt arbeidsmiljø, i tråd med arbeidsmiljøloven § 4-3 og skjerpede krav fra 2026.</p>
<h3>Nulltoleranse</h3>
<p>Bedriften har nulltoleranse for:</p>
<ul>
<li>Mobbing og trakassering</li>
<li>Seksuell trakassering</li>
<li>Diskriminering basert på kjønn, alder, etnisitet, religion, seksuell orientering eller funksjonsevne</li>
<li>Sosial ekskludering</li>
</ul>
<h3>Forebygging</h3>
<ul>
<li>Årlig kartlegging av psykososialt arbeidsmiljø</li>
<li>Regelmessige medarbeidersamtaler</li>
<li>Tilrettelegging ved behov</li>
<li>Åpen og trygg kommunikasjonskultur</li>
</ul>
<h3>Håndtering</h3>
<p>Ved opplevd trakassering eller konflikter, ta kontakt med nærmeste leder, verneombud eller ${f(form.whistleblowerChannel, "Varslingskontakt")}. Alle henvendelser behandles konfidensielt.</p>`,
    },
    {
      id: "varsling-konflikter",
      title: "Avvik, varsling og konflikthåndtering",
      content: (form) => `<h2>10. Avvik, varsling og konflikthåndtering</h2>
<h3>Varsling</h3>
<p>Ansatte har rett og plikt til å varsle om kritikkverdige forhold, jf. arbeidsmiljøloven kapittel 2A. Varsling kan gjøres til:</p>
<ul>
<li>Nærmeste leder</li>
<li>Verneombud</li>
<li>${f(form.whistleblowerChannel, "Varslingskontakt")}</li>
<li>Eksternt til tilsynsmyndigheter (alltid lovlig)</li>
</ul>
<p>Det er forbudt å gjengjelde mot ansatte som varsler i tråd med rutinene.</p>
<h3>Konflikthåndtering</h3>
<ol>
<li><strong>Direkte dialog</strong> — Partene oppfordres til å løse konflikten seg imellom</li>
<li><strong>Bistand fra leder</strong> — Nærmeste leder fasiliterer dialog</li>
<li><strong>Formell behandling</strong> — HR/ledelsen involveres ved behov</li>
<li><strong>Ekstern bistand</strong> — Bedriftshelsetjeneste eller mekler ved behov</li>
</ol>
<h3>Avvikshåndtering</h3>
<p>Alle avvik fra rutiner, nestenulykker og farlige forhold skal rapporteres umiddelbart til nærmeste leder og registreres i avvikssystemet.</p>`,
    },
    {
      id: "oppsigelse",
      title: "Oppsigelse og avslutning",
      content: (form) => `<h2>11. Oppsigelse og avslutning</h2>
<h3>Oppsigelsestid</h3>
<p>Gjensidig oppsigelsestid er <strong>${f(form.noticePeriod, "Måneder")} måneder</strong> med mindre annet er avtalt i arbeidskontrakten. I prøvetiden gjelder 14 dagers gjensidig oppsigelsestid.</p>
<h3>Oppsigelsesprosess</h3>
<ul>
<li>Oppsigelse skal være skriftlig fra begge parter</li>
<li>Arbeidsgiver skal gjennomføre drøftingsmøte før beslutning om oppsigelse (aml. § 15-1)</li>
<li>Oppsigelsen skal oppfylle formkravene i arbeidsmiljøloven § 15-4</li>
</ul>
<h3>Sluttrutiner</h3>
<ol>
<li>Tilbakelevering av utstyr, nøkler og adgangskort</li>
<li>Deaktivering av IT-tilganger og e-postkonto</li>
<li>Sluttoppgjør inkludert feriepenger, overtid og eventuelle bonuser</li>
<li>Sluttsamtale med leder</li>
<li>Kompetanseoverføring og dokumentasjon</li>
</ol>
<h3>Sluttattest</h3>
<p>Alle ansatte har rett til skriftlig sluttattest som bekrefter stillingstype, arbeidsoppgaver og varighet av arbeidsforholdet.</p>
<h3>Konkurranseklausuler</h3>
<p>Eventuelle konkurranseklausuler reguleres i egen avtale og følger arbeidsmiljølovens bestemmelser i kapittel 14A.</p>`,
    },
  ],
};
