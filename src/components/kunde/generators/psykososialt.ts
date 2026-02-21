import type { GeneratorConfig } from "./types";

const f = (v: any, fallback: string) => v || `<span class="merge-field">[${fallback}]</span>`;

export const psykososialtConfig: GeneratorConfig = {
  id: "psykososialt",
  title: "Psykososialt Arbeidsmiljø",
  subtitle: "Kartlegging, tiltaksplaner og oppfølging iht. 2026-krav (AMS)",
  documentCategory: "HR-Psykososialt",
  defaultValues: {
    companyName: "", ceoName: "", numEmployees: "",
    verneombud: "", hmsAnsvarlig: "", hrContact: "",
    amuExists: false, amuChair: "",
    bhtProvider: "", bhtContact: "", bhtPhone: "",
    bhtAgreementType: "Lovpålagt",
    surveyFrequency: "Årlig",
    surveyTool: "Spørreundersøkelse",
    surveyAnonymous: true,
    surveyProvider: "",
    followUpPerson: "Nærmeste leder",
    followUpDeadlineDays: "3",
    conflictMediator: "HR-ansvarlig",
    externalMediator: "",
    reportingPeriod: "Årlig",
    reportRecipient: "Styret/ledelsen",
    sickLeaveTarget: "",
    turnoverTarget: "",
    enpsTarget: "",
    medarbeidersamtaleFrequency: "2 ganger per år",
    bekymringssamtaleDeadline: "Innen 5 virkedager",
    leaderTrainingFrequency: "Årlig",
    leaderTrainingTopics: "Relasjonsledelse, konflikthåndtering, psykisk helse",
    wellbeingPrograms: "",
    ergonomicsPolicy: "Tilpasset arbeidsplass etter behov",
    workLifeBalance: "Fleksibel arbeidstid og mulighet for hjemmekontor",
    returnToWorkProgram: true,
    preventionBudget: "",
    adoptedDate: "",
    psychologicalSafetyMeasure: "",
    burnoutPrevention: "Regelmessig belastningsvurdering og arbeidsfordeling",
    digitalDisconnectPolicy: "Ikke forventet å svare på e-post etter kl. 18",
    inclusionProgram: "",
    diversityGoals: "",
    feedbackCulture: "360-graders tilbakemelding",
    teamBuildingFrequency: "Kvartalsvis",
    teamBuildingBudget: "",
    peerSupportProgram: false,
    eapProvider: "",
    eapPhone: "",
    crisisResponsePlan: true,
    debriefingProvider: "",
    changeManagementPolicy: "Involvering av ansatte i alle omstillingsprosesser",
    workloadAssessmentTool: "",
    roleExpectationDocument: true,
    appreciationProgram: "",
    annualSurveyMonth: "",
    pulsSurveyFrequency: "",
  },
  fieldGroups: [
    {
      title: "Bedrift og ansvarlige",
      fields: [
        { id: "companyName", label: "Bedriftsnavn", type: "text", helpText: "Offisielt firmanavn. Arbeidsgiver har plikt til å sikre et fullt forsvarlig psykososialt arbeidsmiljø (aml. § 4-3)." },
        { id: "ceoName", label: "Daglig leder", type: "text", helpText: "Daglig leder har det overordnede ansvaret for arbeidsmiljøet i virksomheten." },
        { id: "numEmployees", label: "Antall ansatte", type: "number", helpText: "Totalt antall ansatte. Påvirker krav til verneombud (10+), AMU (50+) og bedriftshelsetjeneste." },
        { id: "verneombud", label: "Verneombud", type: "text", helpText: "Verneombudet er arbeidstakernes representant i HMS-arbeid. Lovpålagt for bedrifter med 10+ ansatte." },
        { id: "hmsAnsvarlig", label: "HMS-ansvarlig", type: "text", helpText: "Person som koordinerer det systematiske HMS-arbeidet, inkludert psykososialt arbeidsmiljø." },
        { id: "hrContact", label: "HR-ansvarlig", type: "text", helpText: "HR-ansvarlig som håndterer personalrelaterte spørsmål, konflikter og oppfølgingssamtaler." },
        { id: "amuExists", label: "AMU etablert", type: "checkbox", helpText: "Arbeidsmiljøutvalg (AMU) er lovpålagt for bedrifter med 50+ ansatte. Kan opprettes frivillig ved færre ansatte." },
        { id: "amuChair", label: "AMU-leder", type: "text", helpText: "Leder av arbeidsmiljøutvalget. AMU-leder alternerer vanligvis mellom arbeidsgiver- og arbeidstakerrepresentant." },
      ],
    },
    {
      title: "Bedriftshelsetjeneste (BHT)",
      fields: [
        { id: "bhtProvider", label: "BHT-leverandør", type: "text", placeholder: "F.eks. Stamina, Avonova", helpText: "Bedriftshelsetjenesten bistår med kartlegging, risikovurdering og tiltak for arbeidsmiljøet. Lovpålagt for visse bransjer." },
        { id: "bhtContact", label: "BHT-kontaktperson", type: "text", helpText: "Hovedkontakt hos bedriftshelsetjenesten for psykososiale henvendelser." },
        { id: "bhtPhone", label: "BHT-telefon", type: "text", helpText: "Telefonnummer til bedriftshelsetjenesten for hastesaker." },
        { id: "bhtAgreementType", label: "BHT-avtale type", type: "select", options: ["Lovpålagt", "Frivillig", "Utvidet"], helpText: "Type BHT-avtale. Lovpålagt for bransjer i forskriften. Utvidet gir tilgang til flere tjenester." },
      ],
    },
    {
      title: "Kartlegging og metoder",
      fields: [
        { id: "surveyFrequency", label: "Kartleggingsfrekvens", type: "select", options: ["Årlig", "Halvårlig", "Kvartalsvis"], helpText: "Hvor ofte arbeidsmiljøkartlegging gjennomføres. 2026-kravene skjerper kravet til systematisk og jevnlig kartlegging." },
        { id: "surveyTool", label: "Kartleggingsverktøy", type: "text", helpText: "Verktøy eller metode brukt for kartlegging (f.eks. QPS Nordic, 10-faktor, egenutviklet spørreundersøkelse)." },
        { id: "surveyAnonymous", label: "Anonym kartlegging", type: "checkbox", helpText: "Om kartleggingen er anonym. Anonymitet gir normalt høyere svarprosent og mer ærlige svar." },
        { id: "surveyProvider", label: "Ekstern kartleggingspartner", type: "text", helpText: "Eventuell ekstern partner som gjennomfører kartleggingen (f.eks. BHT, konsulentfirma)." },
        { id: "reportingPeriod", label: "Rapporteringsperiode", type: "select", options: ["Årlig", "Halvårlig"], helpText: "Hvor ofte det utarbeides formell rapport om psykososialt arbeidsmiljø til ledelsen/styret." },
        { id: "reportRecipient", label: "Rapportmottaker", type: "text", helpText: "Hvem som mottar den formelle rapporten om psykososialt arbeidsmiljø." },
      ],
    },
    {
      title: "Oppfølging og samtaler",
      fields: [
        { id: "followUpPerson", label: "Oppfølgingsansvarlig", type: "text", helpText: "Person som er ansvarlig for oppfølging av enkeltsaker knyttet til arbeidsmiljø, trakassering eller konflikter." },
        { id: "followUpDeadlineDays", label: "Oppfølgingsfrist (virkedager)", type: "text", helpText: "Antall virkedager innen oppfølgingssamtale skal gjennomføres etter meldt hendelse." },
        { id: "medarbeidersamtaleFrequency", label: "Medarbeidersamtaler", type: "text", helpText: "Hvor ofte medarbeidersamtaler gjennomføres. Minimum to ganger per år anbefales. Dekker trivsel, mål og utvikling." },
        { id: "bekymringssamtaleDeadline", label: "Bekymringssamtale frist", type: "text", helpText: "Hvor raskt leder skal initiere samtale ved tegn på mistrivsel, økt fravær eller endret atferd." },
      ],
    },
    {
      title: "Konflikthåndtering",
      fields: [
        { id: "conflictMediator", label: "Intern konflikthåndterer", type: "text", helpText: "Person som fasiliterer konflikthåndtering internt. Bør ha opplæring i mekling og nøytral posisjon." },
        { id: "externalMediator", label: "Ekstern mekler/bistand", type: "text", helpText: "Ekstern part som kan bistå ved alvorlige konflikter (f.eks. BHT, advokat, organisasjonspsykolog)." },
      ],
    },
    {
      title: "Mål og indikatorer",
      fields: [
        { id: "sickLeaveTarget", label: "Sykefraværsmål (%)", type: "text", placeholder: "F.eks. Under 4%", helpText: "Bedriftens mål for totalt sykefravær. Gir referansepunkt for evaluering av arbeidsmiljøtiltak." },
        { id: "turnoverTarget", label: "Turnover-mål (%)", type: "text", placeholder: "F.eks. Under 10%", helpText: "Mål for årlig turnover. Høy turnover kan indikere arbeidsmiljøproblemer." },
        { id: "enpsTarget", label: "eNPS-mål", type: "text", placeholder: "F.eks. Over 30", helpText: "Mål for Employee Net Promoter Score. Måler i hvilken grad ansatte vil anbefale arbeidsplassen." },
      ],
    },
    {
      title: "Forebygging og tilrettelegging",
      fields: [
        { id: "leaderTrainingFrequency", label: "Lederopplæring frekvens", type: "select", options: ["Årlig", "Halvårlig", "Ved behov"], helpText: "Hvor ofte ledere gjennomgår opplæring i psykososialt arbeidsmiljø, konflikthåndtering og relasjonsledelse." },
        { id: "leaderTrainingTopics", label: "Lederopplæringstema", type: "text", helpText: "Temaer som dekkes i lederopplæringen. Bør inkludere relasjonsledelse, konflikthåndtering og psykisk førstehjelp." },
        { id: "wellbeingPrograms", label: "Trivselstiltak", type: "text", placeholder: "F.eks. Treningsabonnement, sosiale arrangementer", helpText: "Programmer og tiltak for å fremme trivsel og velvære blant ansatte." },
        { id: "ergonomicsPolicy", label: "Ergonomi-policy", type: "text", helpText: "Retningslinjer for ergonomisk tilrettelegging av arbeidsplass (hev-senk-pult, skjerm, stol etc.)." },
        { id: "workLifeBalance", label: "Balanse arbeid/fritid", type: "text", helpText: "Tiltak for å fremme god balanse mellom arbeid og privatliv (fleksitid, hjemmekontor, avspasering)." },
        { id: "returnToWorkProgram", label: "Tilbake-til-jobb program", type: "checkbox", helpText: "Om bedriften har et strukturert program for tilbakeføring etter langtidsfravær (gradert sykemelding, tilpassede oppgaver)." },
        { id: "preventionBudget", label: "Forebyggingsbudsjett", type: "text", placeholder: "F.eks. 5 000 kr/ansatt", helpText: "Årlig budsjett per ansatt til forebyggende arbeidsmiljøtiltak." },
        { id: "adoptedDate", label: "Vedtatt dato", type: "text", helpText: "Dato dokumentet ble vedtatt og trådte i kraft." },
      ],
    },
    {
      title: "Psykologisk trygghet og kultur",
      fields: [
        { id: "psychologicalSafetyMeasure", label: "Psykologisk trygghet tiltak", type: "text", placeholder: "F.eks. Åpne fora, feildelingskultur", helpText: "Tiltak for å fremme psykologisk trygghet — at ansatte tør si ifra, stille spørsmål og innrømme feil uten frykt for konsekvenser." },
        { id: "feedbackCulture", label: "Tilbakemeldingskultur", type: "text", helpText: "System for konstruktiv tilbakemelding (360-graders, peer feedback, løpende). God tilbakemeldingskultur forebygger konflikter." },
        { id: "inclusionProgram", label: "Inkluderingsprogram", type: "text", helpText: "Tiltak for inkludering av alle ansatte, uavhengig av bakgrunn, funksjonsnivå eller livssituasjon." },
        { id: "diversityGoals", label: "Mangfoldsmål", type: "text", helpText: "Konkrete mål for mangfold og likestilling i bedriften (kjønnsbalanse, alderssammensetning, kulturelt mangfold)." },
        { id: "appreciationProgram", label: "Anerkjennelsesprogram", type: "text", placeholder: "F.eks. Månedens ansatt, peer recognition", helpText: "Program for å anerkjenne og feire ansattes bidrag og prestasjoner. Viktig for motivasjon og tilhørighet." },
        { id: "burnoutPrevention", label: "Utbrenthet-forebygging", type: "text", helpText: "Spesifikke tiltak for å forebygge utbrenthet: belastningsvurdering, arbeidsfordeling, hvile- og restitusjonspolitikk." },
        { id: "digitalDisconnectPolicy", label: "Digital frakoblingspolicy", type: "text", helpText: "Retningslinjer for digital frakobling etter arbeidstid. Reduserer stress og fremmer work-life balance." },
      ],
    },
    {
      title: "Støtteordninger",
      fields: [
        { id: "eapProvider", label: "EAP-leverandør", type: "text", helpText: "Employee Assistance Program — ekstern og konfidensiell rådgivningstjeneste for ansatte (personlige, juridiske, økonomiske problemer)." },
        { id: "eapPhone", label: "EAP-telefon", type: "text", helpText: "Telefonnummer til EAP-tjenesten. Bør være tilgjengelig 24/7." },
        { id: "peerSupportProgram", label: "Kollegastøtteordning", type: "checkbox", helpText: "Om bedriften har trente kollegastøtter som kan gi første-linje psykisk hjelp og støtte." },
        { id: "crisisResponsePlan", label: "Kriseberedskapsplan", type: "checkbox", helpText: "Om bedriften har plan for krisehåndtering ved alvorlige hendelser som påvirker ansattes psykiske helse." },
        { id: "debriefingProvider", label: "Debriefing-leverandør", type: "text", helpText: "Ekstern leverandør for profesjonell debriefing etter kritiske hendelser (ulykker, ran, vold, dødsfall)." },
      ],
    },
    {
      title: "Teambygging og puls",
      fields: [
        { id: "teamBuildingFrequency", label: "Teambuilding frekvens", type: "select", options: ["Månedlig", "Kvartalsvis", "Halvårlig", "Årlig"], helpText: "Hvor ofte teambyggende aktiviteter gjennomføres for å styrke samhold og samarbeid." },
        { id: "teamBuildingBudget", label: "Teambuilding-budsjett", type: "text", placeholder: "F.eks. 3 000 kr/ansatt/år", helpText: "Årlig budsjett per ansatt til teambyggende aktiviteter." },
        { id: "pulsSurveyFrequency", label: "Pulsundersøkelser", type: "text", placeholder: "F.eks. Månedlig", helpText: "Hyppige, korte undersøkelser (5-10 spørsmål) for å fange opp arbeidsmiljøtrender mellom hovedkartlegginger." },
        { id: "annualSurveyMonth", label: "Hovedundersøkelse måned", type: "text", placeholder: "F.eks. September", helpText: "Måned for den årlige hovedkartleggingen av arbeidsmiljø. Bør unngå ferieperioder og hektiske perioder." },
        { id: "changeManagementPolicy", label: "Endringsledelse-policy", type: "text", helpText: "Retningslinjer for hvordan organisasjonsendringer kommuniseres og gjennomføres med hensyn til ansattes arbeidsmiljø." },
        { id: "workloadAssessmentTool", label: "Belastningsvurderingsverktøy", type: "text", helpText: "Verktøy eller metode for å vurdere og balansere arbeidsbelastning (kapasitetsplanlegging, ressursallokering)." },
        { id: "roleExpectationDocument", label: "Forventningsavklaring", type: "checkbox", helpText: "Om det utarbeides skriftlig forventningsavklaring mellom leder og ansatt om rolleinnhold, mål og ansvar." },
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
${form.hrContact ? `<li><strong>HR-ansvarlig:</strong> ${form.hrContact} — personalrelaterte saker</li>` : ""}
${form.amuExists ? `<li><strong>AMU-leder:</strong> ${f(form.amuChair, "AMU-leder")} — arbeidsmiljøutvalgets leder</li>` : ""}
<li><strong>Alle ledere:</strong> Ansvar for eget team</li>
<li><strong>Alle ansatte:</strong> Bidra til godt arbeidsmiljø og melde fra om bekymringer</li>
</ul>`,
    },
    {
      id: "kartlegging",
      title: "Kartlegging av arbeidsmiljø",
      content: (form) => `<h2>2. Kartlegging av arbeidsmiljø</h2>
<p>Kartlegging av psykososialt arbeidsmiljø gjennomføres <strong>${f(form.surveyFrequency, "Frekvens")}</strong> med ${f(form.surveyTool, "Verktøy")}${form.surveyAnonymous ? " (anonym)" : ""}.${form.surveyProvider ? ` Ekstern partner: <strong>${form.surveyProvider}</strong>.` : ""}</p>
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
<p>Resultater presenteres for ledelsen${form.amuExists ? " og AMU" : ""}/verneombudet. Alle avdelinger får tilbakemelding på sine resultater. Tiltak planlegges og iverksettes basert på funn.</p>`,
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
${form.wellbeingPrograms ? `<li>${form.wellbeingPrograms}</li>` : ""}
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
<li><strong>Medarbeidersamtaler:</strong> ${f(form.medarbeidersamtaleFrequency, "Frekvens")}</li>
<li><strong>Arbeidsmiljøkartlegging:</strong> ${f(form.surveyFrequency, "Frekvens")}</li>
<li><strong>Vernerunder:</strong> Halvårlig, med psykososialt fokus</li>
<li><strong>Teamsamlinger:</strong> For å styrke samhold og kommunikasjon</li>
<li><strong>Lederopplæring:</strong> ${f(form.leaderTrainingFrequency, "Frekvens")} — ${f(form.leaderTrainingTopics, "Tema")}</li>
</ul>
<h3>Strukturelle tiltak</h3>
<ul>
<li>Klare jobbeskrivelser og forventninger</li>
<li>Onboarding-program for nye ansatte</li>
<li>Kompetanseutvikling og karrieremuligheter</li>
<li>Rettferdig og transparent lønnspolitikk</li>
<li>Tilrettelegging: ${f(form.workLifeBalance, "Tiltak")}</li>
<li>Ergonomi: ${f(form.ergonomicsPolicy, "Policy")}</li>
${form.wellbeingPrograms ? `<li>Trivselstiltak: ${form.wellbeingPrograms}</li>` : ""}
${form.preventionBudget ? `<li>Forebyggingsbudsjett: ${form.preventionBudget} per ansatt</li>` : ""}
</ul>`,
    },
    {
      id: "hendelser",
      title: "Oppfølging ved uønskede hendelser",
      content: (form) => `<h2>6. Oppfølging ved uønskede hendelser</h2>
<h3>Mobbing og trakassering</h3>
<ol>
<li>Hendelsen meldes til ${f(form.followUpPerson, "Ansvarlig")} eller verneombud</li>
<li>Samtale med den som opplever seg utsatt — innen <strong>${f(form.followUpDeadlineDays, "3")} virkedager</strong></li>
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
<li>Bistand fra bedriftshelsetjenesten: ${f(form.bhtProvider, "BHT")} v/ ${f(form.bhtContact, "Kontakt")}${form.bhtPhone ? ` (tlf: ${form.bhtPhone})` : ""}</li>
<li>Oppfølgingssamtaler og eventuell profesjonell debriefing</li>
</ul>
${form.returnToWorkProgram ? `<h3>Tilbake-til-jobb</h3><p>Ved langtidsfravær som følge av arbeidsmiljørelaterte hendelser, tilbys et strukturert tilbake-til-jobb program med gradert oppstart og tilpassede oppgaver.</p>` : ""}`,
    },
    {
      id: "samtaler",
      title: "Samtaler og oppfølging",
      content: (form) => `<h2>7. Samtaler og oppfølging</h2>
<h3>Medarbeidersamtaler</h3>
<p>Gjennomføres ${f(form.medarbeidersamtaleFrequency, "frekvens")} og dekker:</p>
<ul>
<li>Trivsel og arbeidsmiljø</li>
<li>Arbeidsbelastning og stressnivå</li>
<li>Samarbeid med kollegaer og leder</li>
<li>Kompetanseutvikling og karriereutvikling</li>
<li>Mål og forventninger</li>
<li>Balanse mellom arbeid og privatliv</li>
</ul>
<h3>Bekymringssamtaler</h3>
<p>Ledere skal initiere samtale ${f(form.bekymringssamtaleDeadline, "frist")} ved tegn på mistrivsel:</p>
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
<li><strong>Formell behandling:</strong> ${form.externalMediator ? `Ekstern bistand via ${form.externalMediator}` : "Ved alvorlige konflikter involveres ekstern bistand"}</li>
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
<li>Sykefraværsstatistikk — totalt og korttidsfravær${form.sickLeaveTarget ? ` (mål: ${form.sickLeaveTarget})` : ""}</li>
<li>Turnover-rate${form.turnoverTarget ? ` (mål: ${form.turnoverTarget})` : ""}</li>
<li>Antall varslingssaker og konfliktsaker</li>
<li>Resultater fra medarbeidersamtaler</li>
<li>eNPS (Employee Net Promoter Score)${form.enpsTarget ? ` (mål: ${form.enpsTarget})` : ""}</li>
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
<li>Verneombudet${form.amuExists ? " og AMU" : ""}</li>
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
<p>Alle ledere gjennomgår opplæring ${f(form.leaderTrainingFrequency, "Frekvens").toLowerCase()} i:</p>
<ul>
${(form.leaderTrainingTopics || "Relasjonsledelse, konflikthåndtering, psykisk helse").split(",").map((t: string) => `<li>${t.trim()}</li>`).join("\n")}
<li>Forebygging av trakassering og diskriminering</li>
<li>Arbeidsmiljøloven og arbeidsgivers plikter</li>
</ul>
<h3>Konsekvenser</h3>
<p>Ledere som ikke ivaretar sitt ansvar for arbeidsmiljøet, vil bli fulgt opp gjennom samtale og eventuelt formelle tiltak. Alvorlig forsømmelse kan medføre omorganisering av lederansvar.</p>`,
    },
  ],
};
