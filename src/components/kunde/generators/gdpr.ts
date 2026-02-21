import type { GeneratorConfig } from "./types";

const f = (v: any, fallback: string) => v || `<span class="merge-field">[${fallback}]</span>`;

export const gdprConfig: GeneratorConfig = {
  id: "gdpr",
  title: "GDPR & Personvern",
  subtitle: "Internkontroll, behandlingsoversikt og rutiner for personopplysninger",
  documentCategory: "HR-GDPR",
  defaultValues: {
    companyName: "", orgNumber: "", ceoName: "", address: "",
    dpoName: "", dpoEmail: "", dpoPhone: "",
    dpoRequired: false,
    dataProcessors: "Visma, Tripletex",
    subProcessorsApproval: "Forhåndsgodkjenning kreves",
    legalBasis: "Avtale, samtykke, berettiget interesse, rettslig forpliktelse",
    retentionPeriodEmployees: "5 år etter avsluttet arbeidsforhold",
    retentionPeriodCustomers: "5 år etter siste transaksjon",
    retentionPeriodMarketing: "Til samtykke trekkes tilbake",
    retentionPeriodAccounting: "5 år (bokføringsloven)",
    retentionPeriodCVs: "6 måneder etter avsluttet rekruttering",
    thirdCountryTransfer: false,
    thirdCountryBasis: "EUs standardkontrakter (SCC)",
    breachContact: "Daglig leder",
    breachNotifyHours: "72",
    breachTeam: "",
    dpiaFrequency: "Ved nye systemer og årlig for høyrisiko",
    securityMeasures: "Kryptering, tilgangsstyring, 2FA, logging",
    physicalSecurity: "Låste kontorer, makulering av dokumenter, adgangskontroll",
    auditFrequency: "Årlig",
    privacyTrainingFrequency: "Årlig",
    dataSubjectResponseDays: "30",
    consentManagementTool: "",
    cookiePolicy: true,
    adoptedDate: "",
  },
  fieldGroups: [
    {
      title: "Bedriftsinformasjon",
      fields: [
        { id: "companyName", label: "Bedriftsnavn", type: "text", helpText: "Offisielt firmanavn. Er behandlingsansvarlig for alle personopplysninger bedriften samler inn." },
        { id: "orgNumber", label: "Org.nummer", type: "text", helpText: "9-sifret organisasjonsnummer." },
        { id: "ceoName", label: "Daglig leder", type: "text", helpText: "Daglig leder har det overordnede ansvaret for at GDPR etterleves i virksomheten." },
        { id: "address", label: "Forretningsadresse", type: "text", helpText: "Offisiell forretningsadresse som angis i personvernerklæringen." },
      ],
    },
    {
      title: "Personvernombud (DPO)",
      description: "Påkrevd for offentlige virksomheter, bedrifter som behandler særlige kategorier i stor skala, eller systematisk overvåking",
      fields: [
        { id: "dpoRequired", label: "Personvernombud påkrevd", type: "checkbox", helpText: "Bedrifter som behandler sensitive data i stor skala, utfører systematisk overvåking, eller er offentlige, plikter å ha personvernombud (GDPR art. 37)." },
        { id: "dpoName", label: "Personvernombud (navn)", type: "text", placeholder: "Valgfritt", helpText: "Navn på bedriftens personvernombud (DPO). Kan være intern ansatt eller ekstern konsulent." },
        { id: "dpoEmail", label: "E-post personvernombud", type: "text", helpText: "Dedikert e-postadresse for personvernhenvendelser. Bør være enkel å finne for registrerte." },
        { id: "dpoPhone", label: "Telefon personvernombud", type: "text", helpText: "Telefonnummer til personvernombudet for hastesaker." },
      ],
    },
    {
      title: "Behandling og lagring",
      fields: [
        { id: "legalBasis", label: "Behandlingsgrunnlag", type: "text", helpText: "De rettsgrunnlagene bedriften benytter for behandling av personopplysninger (GDPR art. 6): avtale, samtykke, berettiget interesse, rettslig forpliktelse, allmennhetens interesse eller vitale interesser." },
        { id: "dataProcessors", label: "Databehandlere", type: "text", helpText: "Kommaseparert liste over leverandører som behandler personopplysninger på vegne av bedriften. Alle skal ha databehandleravtale (GDPR art. 28)." },
        { id: "subProcessorsApproval", label: "Underdatabehandlere", type: "text", helpText: "Krav til godkjenning av underdatabehandlere. Vanlig å kreve forhåndsgodkjenning eller generell godkjenning med varslingsrett." },
        { id: "retentionPeriodEmployees", label: "Lagringstid ansattdata", type: "text", helpText: "Hvor lenge personopplysninger om ansatte lagres etter avsluttet arbeidsforhold. Typisk 5 år pga. foreldelsesfrister." },
        { id: "retentionPeriodCustomers", label: "Lagringstid kundedata", type: "text", helpText: "Hvor lenge kundedata lagres etter siste transaksjon. Må balansere forretningsbehov mot dataminimering." },
        { id: "retentionPeriodMarketing", label: "Lagringstid markedsføring", type: "text", helpText: "Lagringstid for data brukt til markedsføring. Ved samtykke: til samtykke trekkes tilbake." },
        { id: "retentionPeriodAccounting", label: "Lagringstid regnskapsdata", type: "text", helpText: "Bokføringsloven krever oppbevaring av regnskapsmateriale i 5 år. Noen dokumenter krever 10 år." },
        { id: "retentionPeriodCVs", label: "Lagringstid søknader/CV-er", type: "text", helpText: "Hvor lenge CVer og søknader lagres etter avsluttet rekrutteringsprosess. Typisk 6 måneder med mindre samtykke gis." },
      ],
    },
    {
      title: "Overføring og tredjeland",
      fields: [
        { id: "thirdCountryTransfer", label: "Overføring utenfor EØS", type: "checkbox", helpText: "Om personopplysninger overføres til land utenfor EØS. Krever ekstra beskyttelsestiltak (GDPR kap. V)." },
        { id: "thirdCountryBasis", label: "Overføringsgrunnlag", type: "text", helpText: "Grunnlag for eventuell overføring utenfor EØS: EUs standardkontrakter (SCC), adekvansbeslutning, eller bindende virksomhetsregler (BCR)." },
      ],
    },
    {
      title: "Sikkerhet og avvikshåndtering",
      fields: [
        { id: "securityMeasures", label: "Tekniske sikkerhetstiltak", type: "text", helpText: "Tekniske tiltak for å beskytte personopplysninger: kryptering, 2FA, tilgangsstyring, logging, brannmur, endepunktsikkerhet." },
        { id: "physicalSecurity", label: "Fysiske sikkerhetstiltak", type: "text", helpText: "Fysiske tiltak: låste kontorer, makulering, adgangskontroll, sikker avhending av lagringsmedier." },
        { id: "breachContact", label: "Kontaktperson ved brudd", type: "text", helpText: "Person som varsles først ved brudd på personopplysningssikkerheten. Skal iverksette vurdering og eventuell varsling." },
        { id: "breachTeam", label: "Beredskapsteam", type: "text", helpText: "Team eller personer som involveres ved alvorlige sikkerhetsbrudd (IT, juridisk, kommunikasjon, ledelse)." },
        { id: "breachNotifyHours", label: "Varslingsfrist Datatilsynet (timer)", type: "text", helpText: "GDPR art. 33 krever varsling til Datatilsynet innen 72 timer dersom bruddet medfører risiko for de registrerte." },
        { id: "dpiaFrequency", label: "DPIA-frekvens", type: "text", helpText: "Hvor ofte personvernkonsekvensvurdering (DPIA) gjennomføres. Påkrevd ved nye systemer og høyrisiko-behandling (GDPR art. 35)." },
        { id: "auditFrequency", label: "Internrevisjon frekvens", type: "select", options: ["Årlig", "Halvårlig", "Kvartalsvis"], helpText: "Hvor ofte det gjennomføres internrevisjon av personvernpraksisen for å sikre etterlevelse." },
        { id: "privacyTrainingFrequency", label: "Personvernopplæring", type: "select", options: ["Årlig", "Halvårlig", "Ved ansettelse", "Ved behov"], helpText: "Hvor ofte ansatte får opplæring i GDPR og personvern. Anbefales minimum årlig." },
        { id: "dataSubjectResponseDays", label: "Svarfrist innsynskrav (dager)", type: "text", helpText: "Antall dager for å besvare henvendelser fra registrerte (innsyn, retting, sletting). GDPR krever svar innen 30 dager." },
        { id: "consentManagementTool", label: "Samtykkehåndteringsverktøy", type: "text", helpText: "Eventuelt verktøy for å håndtere og dokumentere samtykker (f.eks. Cookiebot, OneTrust, egenutviklet)." },
        { id: "cookiePolicy", label: "Cookie-policy på nettside", type: "checkbox", helpText: "Om bedriften har implementert cookie-banner og cookie-policy på nettsiden iht. ekomloven og GDPR." },
        { id: "adoptedDate", label: "Vedtatt dato", type: "text", helpText: "Dato GDPR-rutinene ble vedtatt og trådte i kraft." },
      ],
    },
  ],
  sections: [
    {
      id: "innledning",
      title: "Innledning og formål",
      content: (form) => `<h2>1. Innledning og formål</h2>
<p>Dette dokumentet beskriver ${f(form.companyName, "Bedriftsnavn")}s rutiner for behandling av personopplysninger i henhold til personopplysningsloven og EUs personvernforordning (GDPR).</p>
<h3>Formål</h3>
<p>Sikre at all behandling av personopplysninger skjer lovlig, rettferdig og transparent, og at de registrertes rettigheter ivaretas.</p>
<h3>Virkeområde</h3>
<p>Gjelder for all behandling av personopplysninger om ansatte, kunder, leverandører, partnere og andre som bedriften har kontakt med.</p>
<h3>Ansvarlig</h3>
<p><strong>Behandlingsansvarlig:</strong> ${f(form.companyName, "Bedriftsnavn")} v/ ${f(form.ceoName, "Daglig leder")}, ${f(form.address, "Adresse")}</p>
${form.dpoName ? `<p><strong>Personvernombud:</strong> ${form.dpoName} (${form.dpoEmail || "—"}${form.dpoPhone ? `, tlf: ${form.dpoPhone}` : ""})</p>` : form.dpoRequired ? `<p><strong>Merk:</strong> Bedriften plikter å utpeke et personvernombud.</p>` : ""}`,
    },
    {
      id: "prinsipper",
      title: "Behandlingsgrunnlag og prinsipper",
      content: (form) => `<h2>2. Behandlingsgrunnlag og prinsipper</h2>
<h3>Grunnleggende prinsipper (GDPR art. 5)</h3>
<ol>
<li><strong>Lovlighet, rettferdighet og åpenhet</strong> — Behandling skal ha gyldig rettsgrunnlag og den registrerte skal informeres</li>
<li><strong>Formålsbegrensning</strong> — Data samles inn for spesifikke, uttrykkelig angitte formål</li>
<li><strong>Dataminimering</strong> — Kun nødvendige opplysninger samles inn</li>
<li><strong>Riktighet</strong> — Opplysninger skal holdes oppdaterte og korrekte</li>
<li><strong>Lagringsbegrensning</strong> — Data slettes når formålet er oppfylt</li>
<li><strong>Integritet og konfidensialitet</strong> — Tilstrekkelig sikkerhet mot uautorisert tilgang</li>
<li><strong>Ansvarlighet</strong> — Bedriften skal kunne dokumentere etterlevelse</li>
</ol>
<h3>Behandlingsgrunnlag (GDPR art. 6)</h3>
<p>${f(form.companyName, "Bedriftsnavn")} benytter følgende behandlingsgrunnlag: <strong>${f(form.legalBasis, "Grunnlag")}</strong></p>`,
    },
    {
      id: "behandlingsregister",
      title: "Behandlingsoversikt",
      content: (form) => `<h2>3. Behandlingsoversikt (register)</h2>
<p>I henhold til GDPR art. 30 fører ${f(form.companyName, "Bedriftsnavn")} register over all behandling av personopplysninger.</p>
<h3>Ansatteopplysninger</h3>
<table style="width:100%;border-collapse:collapse;margin:1em 0;font-size:0.9em;">
<tr style="border-bottom:2px solid #e5e7eb;"><td style="padding:6px;font-weight:bold;">Kategori</td><td style="padding:6px;font-weight:bold;">Formål</td><td style="padding:6px;font-weight:bold;">Grunnlag</td><td style="padding:6px;font-weight:bold;">Lagringstid</td></tr>
<tr style="border-bottom:1px solid #e5e7eb;"><td style="padding:6px;">Navn, adresse, fødselsnr.</td><td style="padding:6px;">Lønnskjøring, rapportering</td><td style="padding:6px;">Rettslig forpliktelse</td><td style="padding:6px;">${f(form.retentionPeriodEmployees, "Tid")}</td></tr>
<tr style="border-bottom:1px solid #e5e7eb;"><td style="padding:6px;">Kontaktopplysninger</td><td style="padding:6px;">Kommunikasjon</td><td style="padding:6px;">Avtale</td><td style="padding:6px;">Aktiv ansettelse + 6 mnd</td></tr>
<tr style="border-bottom:1px solid #e5e7eb;"><td style="padding:6px;">Helseopplysninger</td><td style="padding:6px;">Sykefraværsoppfølging</td><td style="padding:6px;">Rettslig forpliktelse</td><td style="padding:6px;">I henhold til arkivloven</td></tr>
<tr style="border-bottom:1px solid #e5e7eb;"><td style="padding:6px;">Bilde/video</td><td style="padding:6px;">Intranett, nettsider</td><td style="padding:6px;">Samtykke</td><td style="padding:6px;">Til samtykke trekkes</td></tr>
<tr><td style="padding:6px;">CV-er og søknader</td><td style="padding:6px;">Rekruttering</td><td style="padding:6px;">Samtykke/berettiget interesse</td><td style="padding:6px;">${f(form.retentionPeriodCVs, "6 mnd")}</td></tr>
</table>
<h3>Kundeopplysninger</h3>
<table style="width:100%;border-collapse:collapse;margin:1em 0;font-size:0.9em;">
<tr style="border-bottom:2px solid #e5e7eb;"><td style="padding:6px;font-weight:bold;">Kategori</td><td style="padding:6px;font-weight:bold;">Formål</td><td style="padding:6px;font-weight:bold;">Grunnlag</td><td style="padding:6px;font-weight:bold;">Lagringstid</td></tr>
<tr style="border-bottom:1px solid #e5e7eb;"><td style="padding:6px;">Kontaktinfo</td><td style="padding:6px;">Kundeforhold</td><td style="padding:6px;">Avtale</td><td style="padding:6px;">${f(form.retentionPeriodCustomers, "Tid")}</td></tr>
<tr style="border-bottom:1px solid #e5e7eb;"><td style="padding:6px;">Regnskapsdata</td><td style="padding:6px;">Bokføring</td><td style="padding:6px;">Rettslig forpliktelse</td><td style="padding:6px;">${f(form.retentionPeriodAccounting, "5 år")}</td></tr>
<tr><td style="padding:6px;">E-post, preferanser</td><td style="padding:6px;">Markedsføring</td><td style="padding:6px;">Samtykke</td><td style="padding:6px;">${f(form.retentionPeriodMarketing, "Tid")}</td></tr>
</table>`,
    },
    {
      id: "rettigheter",
      title: "De registrertes rettigheter",
      content: (form) => `<h2>4. De registrertes rettigheter</h2>
<p>Registrerte (ansatte, kunder m.fl.) har følgende rettigheter i henhold til GDPR:</p>
<ul>
<li><strong>Rett til informasjon</strong> (art. 13-14) — Informasjon om hvilke opplysninger som behandles og hvorfor</li>
<li><strong>Rett til innsyn</strong> (art. 15) — Kopi av egne personopplysninger</li>
<li><strong>Rett til retting</strong> (art. 16) — Korrigering av uriktige opplysninger</li>
<li><strong>Rett til sletting</strong> (art. 17) — "Retten til å bli glemt" når behandlingsgrunnlaget bortfaller</li>
<li><strong>Rett til begrensning</strong> (art. 18) — Midlertidig stopp av behandling</li>
<li><strong>Rett til dataportabilitet</strong> (art. 20) — Utlevering av data i maskinlesbart format</li>
<li><strong>Rett til å protestere</strong> (art. 21) — Motsette seg behandling basert på berettiget interesse</li>
<li><strong>Rett til å trekke samtykke</strong> — Når som helst, uten at det påvirker lovligheten av tidligere behandling</li>
</ul>
<h3>Håndtering av henvendelser</h3>
<p>Henvendelser om rettigheter rettes til ${f(form.dpoName || form.ceoName, "Kontaktperson")}${form.dpoEmail ? ` (${form.dpoEmail})` : ""} og besvares innen <strong>${f(form.dataSubjectResponseDays, "30")} dager</strong>.</p>`,
    },
    {
      id: "databehandleravtaler",
      title: "Databehandleravtaler",
      content: (form) => `<h2>5. Databehandleravtaler</h2>
<p>${f(form.companyName, "Bedriftsnavn")} har inngått databehandleravtaler med alle leverandører som behandler personopplysninger på vegne av bedriften, jf. GDPR art. 28.</p>
<h3>Oversikt over databehandlere</h3>
<p><strong>Nåværende databehandlere:</strong> ${f(form.dataProcessors, "Leverandører")}</p>
<h3>Underdatabehandlere</h3>
<p>${f(form.subProcessorsApproval, "Forhåndsgodkjenning kreves")}.</p>
<h3>Krav til databehandleravtalen</h3>
<p>Databehandleravtalen skal regulere:</p>
<ul>
<li>Formålet med behandlingen</li>
<li>Typen personopplysninger og kategorier av registrerte</li>
<li>Behandlingens varighet</li>
<li>Sikkerhetstiltak</li>
<li>Bruk av underdatabehandlere</li>
<li>Bistandsplikt ved innsynsforespørsler</li>
<li>Sletting eller tilbakelevering ved avtalens opphør</li>
<li>Revisjon og kontrollrett</li>
</ul>
<h3>Overføring til tredjeland</h3>
${form.thirdCountryTransfer ? `<p>Personopplysninger overføres til land utenfor EØS. Overføringsgrunnlag: <strong>${f(form.thirdCountryBasis, "Grunnlag")}</strong>. Tilstrekkelig beskyttelsesnivå er sikret.</p>` : `<p>Personopplysninger overføres ikke utenfor EØS uten at tilstrekkelig beskyttelsesnivå er sikret (f.eks. gjennom EUs standardkontrakter eller adekvansbeslutning).</p>`}`,
    },
    {
      id: "internkontroll",
      title: "Internkontroll og risikovurdering",
      content: (form) => `<h2>6. Internkontroll og risikovurdering</h2>
<h3>Internkontroll</h3>
<p>${f(form.companyName, "Bedriftsnavn")} har etablert et internkontrollsystem for personvern som inkluderer:</p>
<ol>
<li>Oversikt over all behandling (behandlingsregister)</li>
<li>Risikovurdering av behandlingsaktiviteter</li>
<li>Dokumenterte rutiner for å ivareta de registrertes rettigheter</li>
<li>Rutiner for avvikshåndtering</li>
<li>Internrevisjon gjennomføres <strong>${f(form.auditFrequency, "Årlig").toLowerCase()}</strong></li>
</ol>
<h3>Risikovurdering (DPIA)</h3>
<p>Personvernkonsekvensvurdering (DPIA) gjennomføres: <strong>${f(form.dpiaFrequency, "Ved nye systemer")}</strong>.</p>
<ul>
<li>Ved innføring av nye systemer eller behandlingsaktiviteter</li>
<li>Ved vesentlig endring av eksisterende behandling</li>
<li>Når behandlingen innebærer høy risiko for de registrerte</li>
<li>Minimum årlig for eksisterende behandlingsaktiviteter med særlige kategorier av data</li>
</ul>
<h3>Opplæring</h3>
<p>Alle ansatte gjennomgår personvernopplæring <strong>${f(form.privacyTrainingFrequency, "Årlig").toLowerCase()}</strong>.</p>`,
    },
    {
      id: "sikkerhet",
      title: "Sikkerhetstiltak",
      content: (form) => `<h2>7. Sikkerhetstiltak</h2>
<p>${f(form.companyName, "Bedriftsnavn")} har implementert følgende sikkerhetstiltak for å beskytte personopplysninger:</p>
<h3>Tekniske tiltak</h3>
<ul>
<li>${f(form.securityMeasures, "Sikkerhetstiltak")}</li>
<li>Brannmur og nettverkssikkerhet</li>
<li>Regelmessig sikkerhetskopiering</li>
<li>Endepunktsikkerhet (antivirus, EDR)</li>
<li>Automatiske sikkerhetsoppdateringer</li>
</ul>
<h3>Fysiske tiltak</h3>
<ul>
<li>${f(form.physicalSecurity, "Fysiske tiltak")}</li>
</ul>
<h3>Organisatoriske tiltak</h3>
<ul>
<li>Tilgangsstyring basert på «need-to-know»-prinsippet</li>
<li>Opplæring av alle ansatte i personvern og datasikkerhet</li>
<li>Taushetserklæring for alle ansatte</li>
<li>Rutiner for sikker sletting av data</li>
<li>Clean desk-policy</li>
</ul>`,
    },
    {
      id: "avvik",
      title: "Avvikshåndtering ved brudd",
      content: (form) => `<h2>8. Avvikshåndtering ved brudd på personopplysningssikkerheten</h2>
<h3>Hva er et brudd?</h3>
<p>Et brudd på personopplysningssikkerheten er enhver hendelse som fører til uautorisert tilgang til, endring, tap eller ødeleggelse av personopplysninger.</p>
<h3>Eksempler</h3>
<ul>
<li>E-post med personopplysninger sendt til feil mottaker</li>
<li>Hacking eller datainnbrudd</li>
<li>Tap av USB/PC med personopplysninger</li>
<li>Uautorisert innsyn i personalmapper</li>
<li>Ransomware-angrep</li>
</ul>
<h3>Prosedyre</h3>
<ol>
<li><strong>Oppdage og melde:</strong> Alle ansatte plikter å melde brudd umiddelbart til ${f(form.breachContact, "Kontaktperson")}${form.breachTeam ? ` og beredskapsteamet (${form.breachTeam})` : ""}</li>
<li><strong>Vurdere:</strong> Alvorlighetsgrad og risiko for de registrerte vurderes</li>
<li><strong>Varsle Datatilsynet:</strong> Innen <strong>${f(form.breachNotifyHours, "Timer")} timer</strong> dersom bruddet sannsynligvis medfører risiko for fysiske personers rettigheter (GDPR art. 33)</li>
<li><strong>Varsle de registrerte:</strong> Dersom bruddet sannsynligvis medfører <em>høy</em> risiko (GDPR art. 34)</li>
<li><strong>Dokumentere:</strong> Alle brudd dokumenteres uavhengig av varsling, inkludert tiltak iverksatt</li>
<li><strong>Evaluere:</strong> Gjennomgå rutiner og tiltak for å forhindre gjentakelse</li>
</ol>`,
    },
    {
      id: "samtykke",
      title: "Samtykke og informasjonsplikt",
      content: (form) => `<h2>9. Samtykke og informasjonsplikt</h2>
<h3>Krav til gyldig samtykke</h3>
<p>Når samtykke benyttes som behandlingsgrunnlag, skal det være:</p>
<ul>
<li><strong>Frivillig</strong> — Ingen negative konsekvenser ved å nekte</li>
<li><strong>Spesifikt</strong> — Knyttet til konkret formål</li>
<li><strong>Informert</strong> — Den registrerte har fått tilstrekkelig informasjon</li>
<li><strong>Utvetydig</strong> — Aktiv handling (ikke forhåndsavkryssede bokser)</li>
<li><strong>Dokumenterbart</strong> — Bedriften kan bevise at samtykke er gitt</li>
</ul>
${form.consentManagementTool ? `<p>Samtykker håndteres og dokumenteres via <strong>${form.consentManagementTool}</strong>.</p>` : ""}
<h3>Informasjonsplikt</h3>
<p>Ved innsamling av personopplysninger skal de registrerte informeres om:</p>
<ul>
<li>Hvem som er behandlingsansvarlig</li>
<li>Formålet med behandlingen og behandlingsgrunnlaget</li>
<li>Hvilke kategorier av opplysninger som samles inn</li>
<li>Eventuelle mottakere av opplysningene</li>
<li>Lagringstid</li>
<li>Rettigheter (innsyn, retting, sletting, etc.)</li>
<li>Retten til å klage til Datatilsynet</li>
</ul>
${form.cookiePolicy ? `<h3>Informasjonskapsler (cookies)</h3><p>Bedriftens nettside har implementert cookie-banner og cookie-policy i henhold til ekomloven og GDPR. Brukere gis mulighet til å akseptere, avvise eller tilpasse bruk av informasjonskapsler.</p>` : ""}`,
    },
  ],
};
