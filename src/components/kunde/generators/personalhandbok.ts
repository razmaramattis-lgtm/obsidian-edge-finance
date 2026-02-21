import type { GeneratorConfig } from "./types";

const f = (v: any, fallback: string) => v || `<span class="merge-field">[${fallback}]</span>`;

export const personalhandbokConfig: GeneratorConfig = {
  id: "personalhandbok",
  title: "Personalhåndbok",
  subtitle: "Komplett personalhåndbok med alle lovpålagte og anbefalte kapitler",
  documentCategory: "HR-Personalhåndbok",
  defaultValues: {
    companyName: "", orgNumber: "", ceoName: "", address: "",
    numEmployees: "", industry: "", companyPhone: "", companyEmail: "",
    founded: "", website: "",
    normalHours: "37.5", lunchDuration: "30", lunchPaid: false,
    coreHoursStart: "09:00", coreHoursEnd: "15:00",
    flexMax: "20", overtimeApproval: true,
    vacationDays: "25", vacationDeadline: "1. mars", vacationTransfer: "12",
    sickSelfDays: "3", sickSelfPeriods: "4", iaCompany: false,
    noticePeriod: "3", probationMonths: "6", probationNotice: "14",
    salaryDate: "15.", overtimeRate: "40", bonusScheme: false,
    pensionProvider: "", pensionPercent: "2", pensionMax: "12G",
    insuranceProvider: "", insuranceTypes: "Yrkesskadeforsikring, gruppelivsforsikring, reiseforsikring",
    travelPolicy: "Rimeligste reisemåte", travelExpenseDeadline: "30",
    dressCode: "Passende for arbeidssituasjonen",
    whistleblowerChannel: "Daglig leder",
    diversityStatement: true,
    itTools: "Microsoft 365", privateUsePolicy: "Begrenset privat bruk tillates",
    remotePolicy: "Inntil 2 dager per uke", remoteAgreement: true,
    parentalLeave: "I henhold til folketrygdloven",
    caregivingDays: "10",
    welfareLeave: "Begravelse, flytting, akutte familiehendelser",
    referencePolicy: "Kun med den ansattes samtykke",
    emailInspection: true,
    competenceBudget: "", competenceHours: "",
    socialEvents: "",
    exitChecklistDays: "14",
    nonCompete: false,
    employeeHandbookVersion: "1.0",
  },
  fieldGroups: [
    {
      title: "Bedriftsinformasjon",
      fields: [
        { id: "companyName", label: "Bedriftsnavn", type: "text", placeholder: "Avargo AS", helpText: "Det registrerte firmanavnet slik det står i Brønnøysundregistrene. Brukes som offisielt navn i hele dokumentet." },
        { id: "orgNumber", label: "Org.nummer", type: "text", placeholder: "999 999 999", helpText: "Organisasjonsnummeret til bedriften (9 siffer). Finnes på Brønnøysundregistrene." },
        { id: "ceoName", label: "Daglig leder", type: "text", placeholder: "Ola Nordmann", helpText: "Navnet på daglig leder som har overordnet ansvar for at personalhåndboken holdes oppdatert og etterleves." },
        { id: "address", label: "Forretningsadresse", type: "text", placeholder: "Storgata 1, 0001 Oslo", helpText: "Bedriftens offisielle forretningsadresse som registrert i Enhetsregisteret." },
        { id: "companyPhone", label: "Sentralbord", type: "text", placeholder: "+47 22 00 00 00", helpText: "Hovedtelefonnummeret til bedriften som ansatte og eksterne kan bruke." },
        { id: "companyEmail", label: "Kontakt-e-post", type: "text", placeholder: "post@bedrift.no", helpText: "Generell e-postadresse for henvendelser til bedriften." },
        { id: "numEmployees", label: "Antall ansatte", type: "number", placeholder: "10", helpText: "Totalt antall ansatte inkludert deltid. Påvirker lovkrav (f.eks. krav om verneombud ved 10+, AMU ved 50+)." },
        { id: "industry", label: "Bransje", type: "text", placeholder: "Konsulentvirksomhet", helpText: "Bransjen bedriften opererer i. Kan påvirke spesifikke krav til HMS, arbeidstid og tariffavtaler." },
        { id: "founded", label: "Stiftelsesår", type: "text", placeholder: "2020", helpText: "Året bedriften ble stiftet. Gir kontekst for bedriftens historie." },
        { id: "website", label: "Nettside", type: "text", placeholder: "www.bedrift.no", helpText: "Bedriftens offisielle nettside." },
      ],
    },
    {
      title: "Arbeidstid og fleksibilitet",
      fields: [
        { id: "normalHours", label: "Ukentlig arbeidstid (timer)", type: "text", helpText: "Normal ukentlig arbeidstid. Lovens maksimum er 40 timer (9 timer/dag). De fleste bruker 37,5 timer. Tariffavtale kan sette lavere grense." },
        { id: "coreHoursStart", label: "Kjernetid start", type: "text", helpText: "Tidspunktet kjernetiden begynner. I kjernetiden forventes alle ansatte å være tilgjengelige. Typisk 09:00 eller 10:00." },
        { id: "coreHoursEnd", label: "Kjernetid slutt", type: "text", helpText: "Tidspunktet kjernetiden slutter. Typisk 14:00 eller 15:00. Utenfor kjernetiden kan ansatte tilpasse arbeidstiden." },
        { id: "flexMax", label: "Maks fleksitidssaldo (±timer)", type: "text", helpText: "Hvor mange timer pluss/minus en ansatt kan ha i fleksitidssaldo. Vanlig å sette ±20 eller ±40 timer." },
        { id: "lunchDuration", label: "Lunsjpause (minutter)", type: "text", helpText: "Lengden på lunsjpausen i minutter. Lovens minimum er 30 min ved arbeidsdager over 5,5 timer." },
        { id: "lunchPaid", label: "Betalt lunsj", type: "checkbox", helpText: "Hvis avkrysset, er lunsjpausen inkludert i arbeidstiden og betalt. Ubetalt lunsj kommer i tillegg til arbeidstiden." },
        { id: "overtimeApproval", label: "Overtid krever forhåndsgodkjenning", type: "checkbox", helpText: "Om overtid må godkjennes av leder på forhånd. Anbefales for kontroll og lovkrav (maks 10t/7d, 25t/4u, 200t/52u)." },
      ],
    },
    {
      title: "Ferie og fravær",
      fields: [
        { id: "vacationDays", label: "Feriedager (virkedager)", type: "text", helpText: "Antall virkedager ferie per år. Lovens minimum er 25 virkedager (inkl. lørdager = 4 uker + 1 dag). Ansatte over 60 har krav på 31 dager (5 uker + 1 dag)." },
        { id: "vacationDeadline", label: "Frist ferieønsker", type: "text", helpText: "Siste dato for å melde ferieønsker til arbeidsgiver. Arbeidsgiver fastsetter ferie etter drøfting, men skal ta hensyn til ønsker." },
        { id: "vacationTransfer", label: "Maks overføring ferie (dager)", type: "text", helpText: "Hvor mange feriedager som kan overføres til neste år. Ferieloven tillater avtale om overføring av inntil 12 virkedager." },
        { id: "sickSelfDays", label: "Egenmeldingsdager", type: "text", helpText: "Antall kalenderdager egenmelding kan brukes per fraværsperiode. Standard er 3 dager, IA-bedrifter kan ha inntil 8 dager." },
        { id: "sickSelfPeriods", label: "Egenmeldingsperioder/12 mnd", type: "text", helpText: "Antall ganger egenmelding kan benyttes i løpet av 12 måneder. Standard er 4 perioder, IA-bedrifter kan ha inntil 24." },
        { id: "iaCompany", label: "IA-bedrift", type: "checkbox", helpText: "Om bedriften har IA-avtale (Inkluderende Arbeidsliv). IA-bedrifter har utvidet rett til egenmelding (inntil 8 dager/24 perioder)." },
        { id: "parentalLeave", label: "Foreldrepermisjon", type: "text", helpText: "Policy for foreldrepermisjon. Følger normalt folketrygdloven med 49 uker ved 100% eller 59 uker ved 80% dekning." },
        { id: "caregivingDays", label: "Omsorgsdager/år", type: "text", helpText: "Antall omsorgsdager per år for barn under 12 år. Lovens minimum er 10 dager (15 ved 3+ barn, 20/30 for aleneforeldre)." },
        { id: "welfareLeave", label: "Velferdspermisjon", type: "text", helpText: "Anledninger som gir rett til velferdspermisjon (kort fravær med/uten lønn). F.eks. begravelse, bryllup, flytting, barns første skoledag." },
      ],
    },
    {
      title: "Ansettelse og oppsigelse",
      fields: [
        { id: "probationMonths", label: "Prøvetid (måneder)", type: "text", helpText: "Lengden på prøvetiden. Maks 6 måneder iht. aml. § 15-6. Prøvetiden kan forlenges ved fravær som ikke skyldes arbeidsgiver." },
        { id: "probationNotice", label: "Oppsigelsestid i prøvetid (dager)", type: "text", helpText: "Oppsigelsestiden i prøvetiden. Lovens standard er 14 dager gjensidig, men kan avtales annerledes i kontrakten." },
        { id: "noticePeriod", label: "Oppsigelsestid etter prøvetid (mnd)", type: "text", helpText: "Gjensidig oppsigelsestid etter prøvetiden. Lovens minimum øker med ansiennitet: 1 mnd (<5 år), 2 mnd (5-10 år), 3 mnd (10+ år)." },
        { id: "exitChecklistDays", label: "Sluttrutiner (dager før fratredelse)", type: "text", helpText: "Hvor mange dager før fratredelse sluttrutiner skal starte (innlevering av utstyr, tilganger, overlevering, sluttsamtale)." },
        { id: "nonCompete", label: "Konkurranseklausul aktuelt", type: "checkbox", helpText: "Om bedriften benytter konkurranseklausuler for visse stillinger. Regulert av aml. kap. 14A med krav om kompensasjon." },
      ],
    },
    {
      title: "Lønn, pensjon og goder",
      fields: [
        { id: "salaryDate", label: "Lønningsdag", type: "text", helpText: "Datoen i måneden lønn utbetales. Vanligvis 12., 15. eller siste virkedag. Lønnsslipp skal være tilgjengelig på utbetalingsdagen." },
        { id: "overtimeRate", label: "Overtidstillegg (%)", type: "text", helpText: "Prosentsats for overtidstillegg utover normal timelønn. Lovens minimum er 40%. Mange har 50% eller 100% ved spesielle tidspunkt." },
        { id: "bonusScheme", label: "Bonusordning", type: "checkbox", helpText: "Om bedriften har en bonusordning for ansatte. Bonuskriterier bør være dokumentert og transparente." },
        { id: "pensionProvider", label: "Pensjonsleverandør", type: "text", placeholder: "Storebrand", helpText: "Navn på leverandør av obligatorisk tjenestepensjon (OTP). Alle bedrifter med ansatte plikter å ha OTP." },
        { id: "pensionPercent", label: "Pensjonsinnsk. (%)", type: "text", helpText: "Prosentsats for pensjonsinnskudd av lønn mellom 1G og 12G. Lovens minimum er 2%. Mange bedrifter tilbyr 5-7%." },
        { id: "pensionMax", label: "Pensjonstak", type: "text", helpText: "Øvre grense for pensjon (vanligvis 12G). Noen bedrifter inkluderer tillegg for lønn over 7,1G." },
        { id: "insuranceProvider", label: "Forsikringsselskap", type: "text", helpText: "Forsikringsselskapet bedriften benytter for personalforsikringer (yrkesskadeforsikring er lovpålagt)." },
        { id: "insuranceTypes", label: "Forsikringstyper", type: "text", helpText: "Liste over forsikringer bedriften tilbyr (yrkesskadeforsikring, gruppelivsforsikring, reiseforsikring, helseforsikring etc.)." },
        { id: "travelPolicy", label: "Reisepolicy", type: "text", helpText: "Retningslinjer for tjenestereiser (f.eks. rimeligste reisemåte, reiseklasse, diett). Utlegg refunderes mot kvittering." },
        { id: "travelExpenseDeadline", label: "Frist reiseregning (dager)", type: "text", helpText: "Antall dager etter reisen reiseregning må leveres. Vanlig er 30 dager." },
      ],
    },
    {
      title: "Kultur, IT og retningslinjer",
      fields: [
        { id: "dressCode", label: "Kleskode", type: "text", helpText: "Bedriftens retningslinjer for påkledning. Kan variere fra formell dress til casual. Bør tilpasses bransje og kundemøter." },
        { id: "remotePolicy", label: "Hjemmekontor-policy", type: "text", helpText: "Retningslinjer for hjemmekontor (f.eks. antall dager per uke). Hjemmekontor reguleres av forskrift om arbeid i arbeidstakers hjem." },
        { id: "remoteAgreement", label: "Krever hjemmekontoravtale", type: "checkbox", helpText: "Om det kreves skriftlig avtale for fast hjemmekontor (påkrevd av forskriften ved regelmessig hjemmekontor)." },
        { id: "itTools", label: "Digitale verktøy", type: "text", helpText: "Hovedverktøy bedriften bruker (f.eks. Microsoft 365, Google Workspace, Slack). Ansatte plikter å følge retningslinjer for hvert system." },
        { id: "privateUsePolicy", label: "Privat bruk av IT-utstyr", type: "text", helpText: "Retningslinjer for privat bruk av bedriftens IT-utstyr. Bør presisere hva som er akseptabelt og hva som ikke er tillatt." },
        { id: "emailInspection", label: "E-postkontroll regulert", type: "checkbox", helpText: "Om bedriften har rutiner for innsyn i e-post iht. forskrift om arbeidsgivers innsyn i e-postkasse. Krever saklig grunn." },
        { id: "whistleblowerChannel", label: "Varslingskontakt", type: "text", helpText: "Person eller instans ansatte kan varsle til om kritikkverdige forhold. Lovpålagt for bedrifter med 5+ ansatte." },
        { id: "diversityStatement", label: "Mangfoldserklæring", type: "checkbox", helpText: "Om håndboken skal inkludere en formell erklæring om mangfold, inkludering og ikke-diskriminering. Anbefalt for alle bedrifter." },
        { id: "competenceBudget", label: "Kompetansebudsjett/ansatt", type: "text", placeholder: "F.eks. 15 000 kr", helpText: "Årlig budsjett per ansatt til faglig utvikling, kurs og sertifiseringer." },
        { id: "competenceHours", label: "Kompetansetimer/år", type: "text", placeholder: "F.eks. 40 timer", helpText: "Antall timer per år avsatt til faglig utvikling i arbeidstiden." },
        { id: "socialEvents", label: "Sosiale arrangementer", type: "text", placeholder: "F.eks. Sommeravslutning, julebord", helpText: "Typiske sosiale arrangementer bedriften organiserer for å styrke felleskap og kultur." },
        { id: "referencePolicy", label: "Referansepolicy", type: "text", helpText: "Retningslinjer for utgivelse av referanser. Normalt gis referanser kun med den ansattes samtykke." },
      ],
    },
  ],
  sections: [
    {
      id: "intro",
      title: "Introduksjon og formål",
      content: (form) => `<h2>1. Introduksjon og formål</h2>
<p>Denne personalhåndboken gjelder for alle ansatte i <strong>${f(form.companyName, "Bedriftsnavn")}</strong> (org.nr. ${f(form.orgNumber, "Org.nr.")}), med forretningsadresse ${f(form.address, "Adresse")}.</p>
${form.companyPhone || form.companyEmail ? `<p>Kontakt: ${form.companyPhone ? form.companyPhone : ""}${form.companyPhone && form.companyEmail ? " / " : ""}${form.companyEmail ? form.companyEmail : ""}${form.website ? ` — ${form.website}` : ""}</p>` : ""}
<h3>Formål</h3>
<p>Håndboken skal:</p>
<ul>
<li>Gi en samlet oversikt over arbeidsvilkår, retningslinjer og rutiner</li>
<li>Sikre likebehandling og forutsigbarhet for alle ansatte</li>
<li>Tydeliggjøre gjensidige forventninger mellom arbeidsgiver og arbeidstaker</li>
<li>Være et levende dokument som oppdateres ved endringer i lov, tariffavtale eller interne forhold</li>
</ul>
<h3>Virkeområde</h3>
<p>Håndboken gjelder for alle ${f(form.numEmployees, "antall")} ansatte, uavhengig av stillingsbrøk, og supplerer den individuelle arbeidskontrakten. Ved motstrid mellom håndboken og arbeidskontrakten, gjelder arbeidskontrakten.</p>
<h3>Ansvar</h3>
<p>Daglig leder ${f(form.ceoName, "Daglig leder")} er ansvarlig for at håndboken holdes oppdatert. Alle ansatte plikter å gjøre seg kjent med innholdet.</p>
<p><em>Versjon: ${f(form.employeeHandbookVersion, "1.0")}</em></p>`,
    },
    {
      id: "ansettelse",
      title: "Arbeidsforhold og ansettelse",
      content: (form) => `<h2>2. Arbeidsforhold og ansettelse</h2>
<h3>Rekruttering</h3>
<p>${f(form.companyName, "Bedriftsnavn")} følger prinsippene om likestilling og ikke-diskriminering ved rekruttering, i tråd med likestillings- og diskrimineringsloven.</p>
${form.diversityStatement ? `<p>Vi er forpliktet til mangfold og inkludering, og vurderer alle kandidater uavhengig av kjønn, alder, etnisitet, religion, seksuell orientering eller funksjonsevne.</p>` : ""}
<h3>Arbeidskontrakt</h3>
<p>Alle ansatte skal ha skriftlig arbeidskontrakt senest 7 dager etter tiltredelse (fra 1. juli 2024). Kontrakten skal inneholde alle punkter nevnt i arbeidsmiljøloven § 14-6.</p>
<h3>Prøvetid</h3>
<p>Prøvetiden er ${f(form.probationMonths, "Prøvetid")} måneder, med ${f(form.probationNotice, "14")} dagers gjensidig oppsigelsestid i prøvetiden. Prøvetiden kan forlenges ved fravær som ikke skyldes arbeidsgiver.</p>
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
<p>Utenfor kjernetiden kan arbeidstiden tilpasses i dialog med nærmeste leder. Fleksitidssaldo skal ikke overstige ±${f(form.flexMax, "20")} timer.</p>
<h3>Pauser</h3>
<ul>
<li>Lunsjpause: ${f(form.lunchDuration, "Minutter")} minutter${form.lunchPaid ? " (betalt, inkludert i arbeidstiden)" : " (ubetalt, kommer i tillegg til arbeidstiden)"}</li>
<li>Ved arbeidsdager over 8 timer har ansatte krav på minst 30 minutters pause (aml. § 10-9)</li>
</ul>
<h3>Timeregistrering</h3>
<p>Alle ansatte plikter å registrere arbeidstid daglig i bedriftens system. Korrekt føring er den enkeltes ansvar og grunnlag for lønnsutbetaling.</p>
<h3>Overtid</h3>
<p>Overtid ${form.overtimeApproval ? "skal godkjennes av nærmeste leder på forhånd" : "skal registreres og rapporteres til nærmeste leder"}. Overtidstillegg er ${f(form.overtimeRate, "Prosent")}% i henhold til arbeidsmiljølovens minimumskrav. Maksimalt 10 timer overtid per 7 dager, 25 timer per 4 uker og 200 timer per 52 uker.</p>
<h3>Hjemmekontor</h3>
<p>${f(form.companyName, "Bedriftsnavn")} praktiserer følgende hjemmekontorpolicy: <strong>${f(form.remotePolicy, "Hjemmekontor-policy")}</strong>.${form.remoteAgreement ? " Skriftlig hjemmekontoravtale inngås i tråd med forskrift om arbeid i arbeidstakers hjem." : ""}</p>`,
    },
    {
      id: "ferie",
      title: "Ferie og fridager",
      content: (form) => `<h2>4. Ferie og fridager</h2>
<h3>Ferierettigheter</h3>
<p>Ansatte har rett til ${f(form.vacationDays, "Dager")} virkedager ferie per år i henhold til ferieloven. Ansatte over 60 år har krav på 6 ekstra virkedager (31 totalt). Arbeidsgiver plikter å sørge for at ferie avvikles.</p>
<h3>Ferieavvikling</h3>
<ul>
<li>Arbeidstaker kan kreve å avvikle tre uker sammenhengende ferie i hovedferieperioden (1. juni – 30. september)</li>
<li>Ferieønsker meldes innen <strong>${f(form.vacationDeadline, "Frist")}</strong></li>
<li>Arbeidsgiver fastsetter ferietidspunkt etter drøfting med den ansatte</li>
<li>Overføring av inntil ${f(form.vacationTransfer, "12")} virkedager ferie til neste år kan avtales skriftlig</li>
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
${form.bonusScheme ? `<h3>Bonusordning</h3><p>Bedriften har en bonusordning. Kriterier og utbetalingsmodell er beskrevet i egen bonusavtale.</p>` : ""}
<h3>Pensjon</h3>
<p>Obligatorisk tjenestepensjon (OTP) er ${f(form.pensionPercent, "Prosent")}% av lønn mellom 1G og ${f(form.pensionMax, "12G")}. Pensjonsleverandør: <strong>${f(form.pensionProvider, "Leverandør")}</strong>.</p>
<h3>Forsikringer</h3>
<p>Bedriften har følgende forsikringsordninger gjennom ${f(form.insuranceProvider, "Leverandør")}:</p>
<ul>
${(form.insuranceTypes || "Yrkesskadeforsikring, gruppelivsforsikring, reiseforsikring").split(",").map((t: string) => `<li>${t.trim()}</li>`).join("\n")}
</ul>
<h3>Utlegg og reiser</h3>
<p>Reisepolicy: <strong>${f(form.travelPolicy, "Reisepolicy")}</strong>. Utlegg refunderes mot kvittering. Diett følger statens satser. Reiseregning leveres innen ${f(form.travelExpenseDeadline, "30")} dager etter reisen.</p>`,
    },
    {
      id: "fravaer",
      title: "Fravær og permisjoner",
      content: (form) => `<h2>6. Fravær og permisjoner</h2>
<h3>Sykefravær</h3>
<ul>
<li><strong>Egenmelding:</strong> Inntil ${f(form.sickSelfDays, "Dager")} kalenderdager per gang, maks ${f(form.sickSelfPeriods, "Perioder")} perioder per 12 måneder${form.iaCompany ? " (IA-bedrift: utvidet rett)" : ""}</li>
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
<li><strong>Foreldrepermisjon:</strong> ${f(form.parentalLeave, "I henhold til folketrygdloven")}</li>
<li><strong>Omsorgspermisjon:</strong> ${f(form.caregivingDays, "10")} dager per år for barn under 12 år</li>
<li><strong>Velferdspermisjon:</strong> ${f(form.welfareLeave, "Begravelse, flytting, akutte familiehendelser")} — etter avtale med leder</li>
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
${form.emailInspection ? `<p>Arbeidsgiver kan kun gjennomføre innsyn i e-post og datalagring i tråd med forskrift om arbeidsgivers innsyn i e-postkasse. Innsyn krever saklig grunn og varsles den ansatte.</p>` : `<p>Bedriften gjennomfører normalt ikke innsyn i ansattes e-post. Ved behov følges forskrift om arbeidsgivers innsyn i e-postkasse.</p>`}
<h3>Referanser</h3>
<p>${f(form.referencePolicy, "Referansepolicy")}.</p>`,
    },
    {
      id: "it-sikkerhet",
      title: "IT-bruk og digital sikkerhet",
      content: (form) => `<h2>8. IT-bruk og digital sikkerhet</h2>
<h3>Bedriftens utstyr</h3>
<p>IT-utstyr fra ${f(form.companyName, "Bedriftsnavn")} er bedriftens eiendom og skal primært benyttes til arbeidsrelaterte formål. ${f(form.privateUsePolicy, "Begrenset privat bruk tillates")}.</p>
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
${form.competenceBudget || form.competenceHours ? `<h3>Kompetanseutvikling</h3><p>Bedriften tilbyr ${form.competenceBudget ? `et kompetansebudsjett på ${form.competenceBudget} per ansatt` : ""}${form.competenceBudget && form.competenceHours ? " og " : ""}${form.competenceHours ? `${form.competenceHours} timer per år til faglig utvikling` : ""}.</p>` : ""}
${form.socialEvents ? `<h3>Sosiale arrangementer</h3><p>Bedriften arrangerer jevnlig sosiale aktiviteter, herunder: ${form.socialEvents}.</p>` : ""}
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
<p>Gjensidig oppsigelsestid er <strong>${f(form.noticePeriod, "Måneder")} måneder</strong> med mindre annet er avtalt i arbeidskontrakten. I prøvetiden gjelder ${f(form.probationNotice, "14")} dagers gjensidig oppsigelsestid.</p>
<h3>Oppsigelsesprosess</h3>
<ul>
<li>Oppsigelse skal være skriftlig fra begge parter</li>
<li>Arbeidsgiver skal gjennomføre drøftingsmøte før beslutning om oppsigelse (aml. § 15-1)</li>
<li>Oppsigelsen skal oppfylle formkravene i arbeidsmiljøloven § 15-4</li>
</ul>
<h3>Sluttrutiner</h3>
<p>Sluttrutiner igangsettes ${f(form.exitChecklistDays, "14")} dager før fratredelse:</p>
<ol>
<li>Tilbakelevering av utstyr, nøkler og adgangskort</li>
<li>Deaktivering av IT-tilganger og e-postkonto</li>
<li>Sluttoppgjør inkludert feriepenger, overtid og eventuelle bonuser</li>
<li>Sluttsamtale med leder</li>
<li>Kompetanseoverføring og dokumentasjon</li>
</ol>
<h3>Sluttattest</h3>
<p>Alle ansatte har rett til skriftlig sluttattest som bekrefter stillingstype, arbeidsoppgaver og varighet av arbeidsforholdet.</p>
${form.nonCompete ? `<h3>Konkurranseklausuler</h3><p>Eventuelle konkurranseklausuler reguleres i egen avtale og følger arbeidsmiljølovens bestemmelser i kapittel 14A. Arbeidsgiver plikter å betale kompensasjon i karensperioden.</p>` : ""}`,
    },
  ],
};
