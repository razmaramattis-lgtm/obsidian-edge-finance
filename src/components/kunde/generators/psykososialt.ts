import type { GeneratorConfig } from "./types";

const f = (v: any, fallback: string) => v || `<span class="merge-field">[${fallback}]</span>`;

export const psykososialtConfig: GeneratorConfig = {
  id: "psykososialt",
  title: "Psykososialt Arbeidsmiljø",
  subtitle: "Kartlegging, tiltaksplaner og oppfølging iht. 2026-krav (AMS)",
  documentCategory: "HR-Psykososialt",
  defaultValues: {
    companyName: "", ceoName: "", numEmployees: "",
    verneombud: "", hmsAnsvarlig: "",
    bhtProvider: "", bhtContact: "",
    surveyFrequency: "Årlig",
    surveyTool: "Spørreundersøkelse",
    followUpPerson: "Nærmeste leder",
    conflictMediator: "HR-ansvarlig",
    reportingPeriod: "Årlig",
    reportRecipient: "Styret/ledelsen",
    adoptedDate: "",
  },
  fieldGroups: [
    {
      title: "Bedrift og ansvarlige",
      fields: [
        { id: "companyName", label: "Bedriftsnavn", type: "text" },
        { id: "ceoName", label: "Daglig leder", type: "text" },
        { id: "numEmployees", label: "Antall ansatte", type: "number" },
        { id: "verneombud", label: "Verneombud", type: "text" },
        { id: "hmsAnsvarlig", label: "HMS-ansvarlig", type: "text" },
      ],
    },
    {
      title: "Bedriftshelsetjeneste",
      fields: [
        { id: "bhtProvider", label: "BHT-leverandør", type: "text", placeholder: "F.eks. Stamina, Avonova" },
        { id: "bhtContact", label: "BHT-kontaktperson", type: "text" },
      ],
    },
    {
      title: "Kartlegging og rapportering",
      fields: [
        { id: "surveyFrequency", label: "Kartleggingsfrekvens", type: "select", options: ["Årlig", "Halvårlig", "Kvartalsvis"] },
        { id: "surveyTool", label: "Kartleggingsverktøy", type: "text" },
        { id: "reportingPeriod", label: "Rapporteringsperiode", type: "select", options: ["Årlig", "Halvårlig"] },
        { id: "reportRecipient", label: "Rapportmottaker", type: "text" },
      ],
    },
    {
      title: "Oppfølging og konflikthåndtering",
      fields: [
        { id: "followUpPerson", label: "Oppfølgingsansvarlig", type: "text" },
        { id: "conflictMediator", label: "Konflikthåndterer", type: "text" },
        { id: "adoptedDate", label: "Vedtatt dato", type: "text" },
      ],
    },
  ],
  sections: [
    {
      id: "formaal",
      title: "Formål og lovkrav",
      content: (form) => `<h2>1. Formål og lovkrav</h2>
<p>Dette dokumentet beskriver ${f(form.companyName, "Bedriftsnavn")}s systematiske arbeid med psykososialt arbeidsmiljø, i henhold til:</p>
<ul>
<li><strong>Arbeidsmiljøloven § 4-3</strong> — Krav til det psykososiale arbeidsmiljøet</li>
<li><strong>Internkontrollforskriften</strong> — Systematisk HMS-arbeid</li>
<li><strong>2026-krav</strong> — Skjerpede krav til kartlegging, risikovurdering og handlingsplaner for psykososialt arbeidsmiljø</li>
</ul>
<h3>Formål</h3>
<p>Sikre at alle ansatte har et fullt forsvarlig psykososialt arbeidsmiljø der de kan trives, utvikle seg og yte sitt beste — uten risiko for fysisk eller psykisk helseskade.</p>
<h3>Ansvar</h3>
<ul>
<li><strong>Daglig leder:</strong> ${f(form.ceoName, "Daglig leder")} — overordnet ansvar</li>
<li><strong>HMS-ansvarlig:</strong> ${f(form.hmsAnsvarlig, "HMS")} — koordinering og oppfølging</li>
<li><strong>Verneombud:</strong> ${f(form.verneombud, "Verneombud")} — arbeidstakernes representant</li>
<li><strong>Alle ledere:</strong> Ansvar for eget team</li>
<li><strong>Alle ansatte:</strong> Bidra til godt arbeidsmiljø og melde fra om bekymringer</li>
</ul>`,
    },
    {
      id: "kartlegging",
      title: "Kartlegging av arbeidsmiljø",
      content: (form) => `<h2>2. Kartlegging av arbeidsmiljø</h2>
<p>Kartlegging av psykososialt arbeidsmiljø gjennomføres <strong>${f(form.surveyFrequency, "Frekvens")}</strong> med ${f(form.surveyTool, "Verktøy")}.</p>
<h3>Hva kartlegges</h3>
<ul>
<li>Arbeidsbelastning og stressnivå</li>
<li>Opplevelse av støtte fra leder og kollegaer</li>
<li>Grad av medvirkning og autonomi</li>
<li>Opplevelse av rettferdighet og likebehandling</li>
<li>Forekomst av konflikter, mobbing eller trakassering</li>
<li>Rolleklarhet og forventningsavklaring</li>
<li>Balanse mellom arbeid og fritid</li>
<li>Tilhørighet og sosialt fellesskap</li>
<li>Endringshåndtering og forutsigbarhet</li>
</ul>
<h3>Metoder</h3>
<ul>
<li>Anonyme spørreundersøkelser</li>
<li>Medarbeidersamtaler</li>
<li>Vernerunder med psykososialt fokus</li>
<li>Gruppediskusjoner og workshops</li>
<li>Sykefraværsstatistikk og trendanalyser</li>
</ul>
<h3>Resultatbehandling</h3>
<p>Resultater presenteres for ledelsen og AMU/verneombudet. Alle avdelinger får tilbakemelding på sine resultater. Tiltak planlegges og iverksettes basert på funn.</p>`,
    },
    {
      id: "risikofaktorer",
      title: "Risikofaktorer",
      content: (form) => `<h2>3. Risikofaktorer</h2>
<p>${f(form.companyName, "Bedriftsnavn")} vurderer systematisk følgende risikofaktorer for det psykososiale arbeidsmiljøet:</p>
<h3>Arbeidsrelaterte risikofaktorer</h3>
<table style="width:100%;border-collapse:collapse;margin:1em 0;font-size:0.9em;">
<tr style="border-bottom:2px solid #e5e7eb;"><td style="padding:6px;font-weight:bold;">Faktor</td><td style="padding:6px;font-weight:bold;">Beskrivelse</td><td style="padding:6px;font-weight:bold;">Tiltak</td></tr>
<tr style="border-bottom:1px solid #e5e7eb;"><td style="padding:6px;">Høy arbeidsbelastning</td><td style="padding:6px;">For mange oppgaver, tidspress, urealistiske forventninger</td><td style="padding:6px;">Prioritering, ressursvurdering, delegering</td></tr>
<tr style="border-bottom:1px solid #e5e7eb;"><td style="padding:6px;">Lav autonomi</td><td style="padding:6px;">Manglende innflytelse på egne arbeidsoppgaver</td><td style="padding:6px;">Økt medvirkning, dialog</td></tr>
<tr style="border-bottom:1px solid #e5e7eb;"><td style="padding:6px;">Rollekonflikt</td><td style="padding:6px;">Motstridende forventninger</td><td style="padding:6px;">Rolleklargjøring, tydelige mandater</td></tr>
<tr style="border-bottom:1px solid #e5e7eb;"><td style="padding:6px;">Manglende støtte</td><td style="padding:6px;">Fraværende ledelse, isolasjon</td><td style="padding:6px;">Ledertrening, mentoring</td></tr>
<tr style="border-bottom:1px solid #e5e7eb;"><td style="padding:6px;">Konflikter</td><td style="padding:6px;">Uløste konflikter mellom ansatte/avdelinger</td><td style="padding:6px;">Tidlig intervensjon, mekling</td></tr>
<tr><td style="padding:6px;">Endringsprosesser</td><td style="padding:6px;">Omorganisering, nedbemanning, nye systemer</td><td style="padding:6px;">God kommunikasjon, involvering</td></tr>
</table>`,
    },
    {
      id: "tiltaksplaner",
      title: "Tiltaksplaner",
      content: (form) => `<h2>4. Tiltaksplaner</h2>
<p>Basert på kartlegging og risikovurdering utarbeides konkrete tiltaksplaner.</p>
<h3>Struktur for tiltaksplan</h3>
<p>Hver tiltaksplan skal inneholde:</p>
<table style="width:100%;border-collapse:collapse;margin:1em 0;font-size:0.9em;">
<tr style="border-bottom:2px solid #e5e7eb;"><td style="padding:6px;font-weight:bold;">Element</td><td style="padding:6px;font-weight:bold;">Beskrivelse</td></tr>
<tr style="border-bottom:1px solid #e5e7eb;"><td style="padding:6px;">Identifisert utfordring</td><td style="padding:6px;">Hva er problemet? Basert på kartlegging.</td></tr>
<tr style="border-bottom:1px solid #e5e7eb;"><td style="padding:6px;">Mål</td><td style="padding:6px;">Hva vil vi oppnå? Målbart.</td></tr>
<tr style="border-bottom:1px solid #e5e7eb;"><td style="padding:6px;">Tiltak</td><td style="padding:6px;">Konkrete handlinger som skal gjennomføres</td></tr>
<tr style="border-bottom:1px solid #e5e7eb;"><td style="padding:6px;">Ansvarlig</td><td style="padding:6px;">Hvem gjennomfører tiltaket?</td></tr>
<tr style="border-bottom:1px solid #e5e7eb;"><td style="padding:6px;">Frist</td><td style="padding:6px;">Når skal tiltaket være gjennomført?</td></tr>
<tr><td style="padding:6px;">Evaluering</td><td style="padding:6px;">Hvordan måles effekten?</td></tr>
</table>
<h3>Eksempel på tiltak</h3>
<ul>
<li>Lederutviklingsprogram for relasjonsledelse</li>
<li>Innføring av regelmessige teamsamtaler</li>
<li>Tilrettelegging for fleksibel arbeidstid</li>
<li>Opplæring i konflikthåndtering for alle ledere</li>
<li>Etablering av mentorordning</li>
</ul>`,
    },
    {
      id: "forebygging",
      title: "Forebyggende rutiner",
      content: (form) => `<h2>5. Forebyggende rutiner</h2>
<h3>Daglige rutiner</h3>
<ul>
<li>Ledere er tilgjengelige og synlige</li>
<li>Åpen dør-policy for spørsmål og bekymringer</li>
<li>Anerkjennelse og tilbakemelding gis jevnlig</li>
</ul>
<h3>Periodiske rutiner</h3>
<ul>
<li><strong>Medarbeidersamtaler:</strong> Minimum to ganger per år</li>
<li><strong>Arbeidsmiljøkartlegging:</strong> ${f(form.surveyFrequency, "Frekvens")}</li>
<li><strong>Vernerunder:</strong> Halvårlig, med psykososialt fokus</li>
<li><strong>Teamsamlinger:</strong> For å styrke samhold og kommunikasjon</li>
</ul>
<h3>Strukturelle tiltak</h3>
<ul>
<li>Klare jobbeskrivelser og forventninger</li>
<li>Onboarding-program for nye ansatte</li>
<li>Kompetanseutvikling og karrieremuligheter</li>
<li>Rettferdig og transparent lønnspolitikk</li>
<li>Tilrettelegging for balanse mellom jobb og privatliv</li>
</ul>`,
    },
    {
      id: "hendelser",
      title: "Oppfølging ved uønskede hendelser",
      content: (form) => `<h2>6. Oppfølging ved uønskede hendelser</h2>
<h3>Mobbing og trakassering</h3>
<ol>
<li>Hendelsen meldes til ${f(form.followUpPerson, "Ansvarlig")} eller verneombud</li>
<li>Samtale med den som opplever seg utsatt — innen 3 virkedager</li>
<li>Kartlegging av situasjonen med alle involverte parter</li>
<li>Iverksetting av tiltak (omplassering, opplæring, mekling)</li>
<li>Oppfølging for å sikre at tiltakene virker</li>
<li>Dokumentasjon og eventuell varsling til Arbeidstilsynet</li>
</ol>
<h3>Alvorlige hendelser</h3>
<p>Ved alvorlige hendelser (trusler, vold, seksuell trakassering) iverksettes krisehåndtering:</p>
<ul>
<li>Umiddelbar sikring av den utsatte</li>
<li>Varsling til politi ved straffbare forhold</li>
<li>Bistand fra bedriftshelsetjenesten: ${f(form.bhtProvider, "BHT")} v/ ${f(form.bhtContact, "Kontakt")}</li>
<li>Oppfølgingssamtaler og eventuell profesjonell debriefing</li>
</ul>`,
    },
    {
      id: "samtaler",
      title: "Samtaler og oppfølging",
      content: (form) => `<h2>7. Samtaler og oppfølging</h2>
<h3>Medarbeidersamtaler</h3>
<p>Gjennomføres minimum to ganger årlig og dekker:</p>
<ul>
<li>Trivsel og arbeidsmiljø</li>
<li>Arbeidsbelastning og stressnivå</li>
<li>Samarbeid med kollegaer og leder</li>
<li>Kompetanseutvikling og karriereutvikling</li>
<li>Mål og forventninger</li>
<li>Balanse mellom arbeid og privatliv</li>
</ul>
<h3>Bekymringssamtaler</h3>
<p>Ledere skal initiere samtale ved tegn på mistrivsel:</p>
<ul>
<li>Endret atferd eller tilbaketrekking</li>
<li>Økt fravær eller hyppige korttidsfravær</li>
<li>Redusert produktivitet eller engasjement</li>
<li>Konflikter med kollegaer</li>
</ul>
<p>Samtalen er støttende — ikke konfronterende — og fokuserer på hva arbeidsgiver kan bidra med.</p>`,
    },
    {
      id: "konflikter",
      title: "Konflikthåndtering",
      content: (form) => `<h2>8. Konflikthåndtering</h2>
<p>Konflikter er en naturlig del av arbeidslivet, men skal håndteres tidlig og konstruktivt.</p>
<h3>Trinnvis modell</h3>
<ol>
<li><strong>Forebygging:</strong> Klare forventninger, god kommunikasjon, respektfull kultur</li>
<li><strong>Tidlig inngripen:</strong> Ledere adresserer gnisninger før de eskalerer</li>
<li><strong>Direkte dialog:</strong> Partene oppfordres til å snakke sammen med støtte fra leder</li>
<li><strong>Mekling:</strong> ${f(form.conflictMediator, "Konflikthåndterer")} fasiliterer strukturert dialog</li>
<li><strong>Formell behandling:</strong> Ved alvorlige konflikter involveres ekstern bistand</li>
</ol>
<h3>Konflikthåndtererens rolle</h3>
<ul>
<li>Nøytral og upartisk</li>
<li>Lytter til alle parter</li>
<li>Fasiliterer gjensidig forståelse</li>
<li>Hjelper partene å finne løsninger</li>
<li>Dokumenterer prosess og avtaler</li>
</ul>`,
    },
    {
      id: "maaling",
      title: "Måling og evaluering",
      content: (form) => `<h2>9. Måling og evaluering</h2>
<h3>Indikatorer</h3>
<p>${f(form.companyName, "Bedriftsnavn")} måler det psykososiale arbeidsmiljøet gjennom:</p>
<ul>
<li>Arbeidsmiljøundersøkelser (score og trender)</li>
<li>Sykefraværsstatistikk — totalt og korttidsfravær</li>
<li>Turnover-rate</li>
<li>Antall varslingssaker og konfliktsaker</li>
<li>Resultater fra medarbeidersamtaler</li>
<li>eNPS (Employee Net Promoter Score) dersom benyttet</li>
</ul>
<h3>Evaluering</h3>
<p>Resultatene evalueres ${f(form.reportingPeriod, "Periode")} av ${f(form.hmsAnsvarlig, "HMS-ansvarlig")} i samarbeid med verneombudet og presenteres for ${f(form.reportRecipient, "Mottaker")}.</p>
<h3>Benchmarking</h3>
<p>Resultater sammenlignes med bransjegjennomsnitt og egne resultater fra tidligere perioder for å identifisere trender og forbedringsområder.</p>`,
    },
    {
      id: "rapport",
      title: "Årlig AMS-rapport",
      content: (form) => `<h2>10. Årlig AMS-rapport</h2>
<p>I henhold til 2026-kravene utarbeider ${f(form.companyName, "Bedriftsnavn")} en årlig rapport om arbeidsmiljøstatus (AMS-rapport).</p>
<h3>Innhold i rapporten</h3>
<ol>
<li><strong>Sammendrag</strong> — Overordnet status for psykososialt arbeidsmiljø</li>
<li><strong>Kartleggingsresultater</strong> — Funn fra arbeidsmiljøundersøkelser og vernerunder</li>
<li><strong>Risikovurdering</strong> — Identifiserte risikofaktorer og vurdering</li>
<li><strong>Gjennomførte tiltak</strong> — Status på tiltaksplaner fra foregående periode</li>
<li><strong>Sykefraværsanalyse</strong> — Trender og mulige årsaker</li>
<li><strong>Hendelsesrapportering</strong> — Varslingssaker, konflikter, avvik</li>
<li><strong>Tiltaksplan neste periode</strong> — Nye tiltak basert på funn</li>
<li><strong>Konklusjon og anbefalinger</strong> — Til ledelsen/styret</li>
</ol>
<h3>Distribusjon</h3>
<p>Rapporten presenteres for ${f(form.reportRecipient, "Mottaker")} og gjøres tilgjengelig for:</p>
<ul>
<li>Ledelsen og styret</li>
<li>Verneombudet og AMU</li>
<li>Bedriftshelsetjenesten</li>
<li>Arbeidstilsynet ved forespørsel</li>
</ul>`,
    },
    {
      id: "ledelse",
      title: "Ledelsens ansvar",
      content: (form) => `<h2>11. Ledelsens ansvar</h2>
<p>Ledelsen i ${f(form.companyName, "Bedriftsnavn")} har det overordnede ansvaret for at det psykososiale arbeidsmiljøet er fullt forsvarlig.</p>
<h3>Lederes plikter</h3>
<ul>
<li>Aktivt arbeide for et godt og inkluderende arbeidsmiljø</li>
<li>Gjennomføre medarbeidersamtaler og oppfølgingssamtaler</li>
<li>Identifisere og håndtere risikofaktorer i eget team</li>
<li>Ta alle henvendelser om arbeidsmiljø på alvor</li>
<li>Melde fra om bekymringer til HMS-ansvarlig</li>
<li>Delta i lederopplæring om psykososialt arbeidsmiljø</li>
</ul>
<h3>Kompetansekrav</h3>
<p>Alle ledere skal gjennomgå opplæring i:</p>
<ul>
<li>Relasjonsledelse og kommunikasjon</li>
<li>Konflikthåndtering</li>
<li>Psykisk helse og førstehjelp</li>
<li>Forebygging av trakassering og diskriminering</li>
<li>Arbeidsmiljøloven og arbeidsgivers plikter</li>
</ul>
<h3>Konsekvenser</h3>
<p>Ledere som ikke ivaretar sitt ansvar for arbeidsmiljøet, vil bli fulgt opp gjennom samtale og eventuelt formelle tiltak. Alvorlig forsømmelse kan medføre omorganisering av lederansvar.</p>`,
    },
  ],
};
