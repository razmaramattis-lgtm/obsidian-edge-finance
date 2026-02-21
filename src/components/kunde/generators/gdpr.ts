import type { GeneratorConfig } from "./types";

const f = (v: any, fallback: string) => v || `<span class="merge-field">[${fallback}]</span>`;

export const gdprConfig: GeneratorConfig = {
  id: "gdpr",
  title: "GDPR & Personvern",
  subtitle: "Internkontroll, behandlingsoversikt og rutiner for personopplysninger",
  documentCategory: "HR-GDPR",
  defaultValues: {
    companyName: "", orgNumber: "", ceoName: "",
    dpoName: "", dpoEmail: "", dpoPhone: "",
    dataProcessors: "Visma, Tripletex",
    legalBasis: "Avtale, samtykke, berettiget interesse, rettslig forpliktelse",
    retentionPeriodEmployees: "5 år etter avsluttet arbeidsforhold",
    retentionPeriodCustomers: "5 år etter siste transaksjon",
    retentionPeriodMarketing: "Til samtykke trekkes tilbake",
    breachContact: "Daglig leder",
    breachNotifyHours: "72",
    securityMeasures: "Kryptering, tilgangsstyring, 2FA, logging",
    adoptedDate: "",
  },
  fieldGroups: [
    {
      title: "Bedriftsinformasjon",
      fields: [
        { id: "companyName", label: "Bedriftsnavn", type: "text" },
        { id: "orgNumber", label: "Org.nummer", type: "text" },
        { id: "ceoName", label: "Daglig leder", type: "text" },
      ],
    },
    {
      title: "Personvernombud",
      description: "Kun påkrevd for offentlige virksomheter og visse private",
      fields: [
        { id: "dpoName", label: "Personvernombud (navn)", type: "text", placeholder: "Valgfritt" },
        { id: "dpoEmail", label: "E-post personvernombud", type: "text" },
        { id: "dpoPhone", label: "Telefon personvernombud", type: "text" },
      ],
    },
    {
      title: "Behandling og lagring",
      fields: [
        { id: "dataProcessors", label: "Databehandlere", type: "text", helpText: "Kommaseparert liste over leverandører som behandler data" },
        { id: "retentionPeriodEmployees", label: "Lagringstid ansattdata", type: "text" },
        { id: "retentionPeriodCustomers", label: "Lagringstid kundedata", type: "text" },
        { id: "retentionPeriodMarketing", label: "Lagringstid markedsføring", type: "text" },
      ],
    },
    {
      title: "Sikkerhet og brudd",
      fields: [
        { id: "securityMeasures", label: "Sikkerhetstiltak", type: "text" },
        { id: "breachContact", label: "Kontaktperson ved brudd", type: "text" },
        { id: "breachNotifyHours", label: "Varslingsfrist Datatilsynet (timer)", type: "text" },
        { id: "adoptedDate", label: "Vedtatt dato", type: "text" },
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
<p><strong>Behandlingsansvarlig:</strong> ${f(form.companyName, "Bedriftsnavn")} v/ ${f(form.ceoName, "Daglig leder")}</p>
${form.dpoName ? `<p><strong>Personvernombud:</strong> ${form.dpoName} (${form.dpoEmail || "—"})</p>` : ""}`,
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
<tr><td style="padding:6px;">Bilde/video</td><td style="padding:6px;">Intranett, nettsider</td><td style="padding:6px;">Samtykke</td><td style="padding:6px;">Til samtykke trekkes</td></tr>
</table>
<h3>Kundeopplysninger</h3>
<table style="width:100%;border-collapse:collapse;margin:1em 0;font-size:0.9em;">
<tr style="border-bottom:2px solid #e5e7eb;"><td style="padding:6px;font-weight:bold;">Kategori</td><td style="padding:6px;font-weight:bold;">Formål</td><td style="padding:6px;font-weight:bold;">Grunnlag</td><td style="padding:6px;font-weight:bold;">Lagringstid</td></tr>
<tr style="border-bottom:1px solid #e5e7eb;"><td style="padding:6px;">Kontaktinfo</td><td style="padding:6px;">Kundeforhold</td><td style="padding:6px;">Avtale</td><td style="padding:6px;">${f(form.retentionPeriodCustomers, "Tid")}</td></tr>
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
<p>Henvendelser om rettigheter rettes til ${f(form.dpoName || form.ceoName, "Kontaktperson")} og besvares innen <strong>30 dager</strong>.</p>`,
    },
    {
      id: "databehandleravtaler",
      title: "Databehandleravtaler",
      content: (form) => `<h2>5. Databehandleravtaler</h2>
<p>${f(form.companyName, "Bedriftsnavn")} har inngått databehandleravtaler med alle leverandører som behandler personopplysninger på vegne av bedriften, jf. GDPR art. 28.</p>
<h3>Oversikt over databehandlere</h3>
<p><strong>Nåværende databehandlere:</strong> ${f(form.dataProcessors, "Leverandører")}</p>
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
<p>Personopplysninger overføres ikke utenfor EØS uten at tilstrekkelig beskyttelsesnivå er sikret (f.eks. gjennom EUs standardkontrakter eller adekvansbeslutning).</p>`,
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
<li>Årlig gjennomgang og oppdatering</li>
</ol>
<h3>Risikovurdering (DPIA)</h3>
<p>Personvernkonsekvensvurdering (DPIA) gjennomføres:</p>
<ul>
<li>Ved innføring av nye systemer eller behandlingsaktiviteter</li>
<li>Ved vesentlig endring av eksisterende behandling</li>
<li>Når behandlingen innebærer høy risiko for de registrerte</li>
<li>Minimum årlig for eksisterende behandlingsaktiviteter med særlige kategorier av data</li>
</ul>`,
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
<li><strong>Oppdage og melde:</strong> Alle ansatte plikter å melde brudd umiddelbart til ${f(form.breachContact, "Kontaktperson")}</li>
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
</ul>`,
    },
  ],
};
