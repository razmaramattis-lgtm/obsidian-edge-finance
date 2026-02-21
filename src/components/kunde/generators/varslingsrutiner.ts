import type { GeneratorConfig } from "./types";

const f = (v: any, fallback: string) => v || `<span class="merge-field">[${fallback}]</span>`;

export const varslingsrutinerConfig: GeneratorConfig = {
  id: "varslingsrutiner",
  title: "Varslingsrutiner",
  subtitle: "Fullstendige varslingsrutiner iht. arbeidsmiljøloven kap. 2A",
  documentCategory: "HR-Varslingsrutiner",
  defaultValues: {
    companyName: "", orgNumber: "", ceoName: "",
    numEmployees: "",
    whistleblowerContact: "Daglig leder",
    whistleblowerEmail: "",
    whistleblowerPhone: "",
    externalChannel: "",
    verneombud: "",
    hrContact: "",
    ackDeadlineDays: "3",
    investigationDeadlineDays: "30",
    escalationContact: "Styreleder",
    adoptedDate: "",
  },
  fieldGroups: [
    {
      title: "Bedriftsinformasjon",
      fields: [
        { id: "companyName", label: "Bedriftsnavn", type: "text" },
        { id: "orgNumber", label: "Org.nummer", type: "text" },
        { id: "ceoName", label: "Daglig leder", type: "text" },
        { id: "numEmployees", label: "Antall ansatte", type: "number" },
      ],
    },
    {
      title: "Varslingskontakter",
      fields: [
        { id: "whistleblowerContact", label: "Intern varslingskontakt", type: "text" },
        { id: "whistleblowerEmail", label: "Varslings-e-post", type: "text", placeholder: "varsling@bedrift.no" },
        { id: "whistleblowerPhone", label: "Varslingstelefon", type: "text" },
        { id: "verneombud", label: "Verneombud", type: "text" },
        { id: "hrContact", label: "HR-ansvarlig", type: "text" },
        { id: "escalationContact", label: "Eskaleringskontakt", type: "text", helpText: "Ved varsling om daglig leder" },
      ],
    },
    {
      title: "Frister og prosess",
      fields: [
        { id: "ackDeadlineDays", label: "Bekreftelsesfrist (dager)", type: "text" },
        { id: "investigationDeadlineDays", label: "Undersøkelsesfrist (dager)", type: "text" },
        { id: "externalChannel", label: "Eksternt varslingsverktøy", type: "text", placeholder: "F.eks. Whistlelink, BDO varsling" },
        { id: "adoptedDate", label: "Vedtatt dato", type: "text" },
      ],
    },
  ],
  sections: [
    {
      id: "innledning",
      title: "Innledning og formål",
      content: (form) => `<h2>1. Innledning og formål</h2>
<p>Disse varslingsrutinene gjelder for alle ansatte, innleide, konsulenter og andre som utfører arbeid for <strong>${f(form.companyName, "Bedriftsnavn")}</strong> (org.nr. ${f(form.orgNumber, "Org.nr.")}).</p>
<h3>Lovgrunnlag</h3>
<p>Rutinene er utarbeidet i henhold til arbeidsmiljøloven kapittel 2A (varsling) og gjelder fra ${f(form.adoptedDate, "Dato")}. Virksomheter med minst 5 ansatte plikter å ha skriftlige varslingsrutiner.</p>
<h3>Formål</h3>
<p>Rutinene skal:</p>
<ul>
<li>Sikre at kritikkverdige forhold avdekkes og håndteres forsvarlig</li>
<li>Oppmuntre til åpenhet og et godt ytringsklima</li>
<li>Beskytte varslere mot gjengjeldelse</li>
<li>Gi klare retningslinjer for hvordan varsling skal skje</li>
<li>Sikre forutsigbar og rettferdig behandling av alle involverte parter</li>
</ul>`,
    },
    {
      id: "kritikkverdige",
      title: "Kritikkverdige forhold",
      content: (form) => `<h2>2. Hva er kritikkverdige forhold?</h2>
<p>Kritikkverdige forhold er forhold som er i strid med:</p>
<ul>
<li><strong>Lover og forskrifter</strong> — brudd på arbeidsmiljølov, skattelov, regnskapslov, osv.</li>
<li><strong>Interne retningslinjer</strong> — brudd på bedriftens reglement, prosedyrer eller etiske retningslinjer</li>
<li><strong>Alminnelig oppfatning</strong> — forhold som strider mot det som er alminnelig akseptert i samfunnet</li>
</ul>
<h3>Eksempler</h3>
<ul>
<li>Fare for liv, helse eller sikkerhet</li>
<li>Korrupsjon, underslag eller økonomisk kriminalitet</li>
<li>Miljøkriminalitet eller fare for ytre miljø</li>
<li>Trakassering, mobbing eller diskriminering</li>
<li>Uforsvarlig arbeidsmiljø</li>
<li>Maktmisbruk eller myndighetsmisbruk</li>
<li>Brudd på personvern (GDPR)</li>
<li>Svindel, bedrageri eller manipulering av regnskap</li>
</ul>
<h3>Hva er IKKE varsling?</h3>
<p>Følgende er normalt ikke å anse som varsling:</p>
<ul>
<li>Misnøye med egen lønn, arbeidsoppgaver eller arbeidstid</li>
<li>Personlige konflikter mellom kollegaer</li>
<li>Faglig uenighet om beslutninger</li>
<li>Klager som kun gjelder eget arbeidsforhold</li>
</ul>`,
    },
    {
      id: "hvem-kan-varsle",
      title: "Hvem kan varsle",
      content: (form) => `<h2>3. Hvem kan varsle?</h2>
<p>Følgende personer har rett til å varsle om kritikkverdige forhold i ${f(form.companyName, "Bedriftsnavn")}:</p>
<ul>
<li>Alle fast ansatte, uavhengig av stillingsbrøk</li>
<li>Midlertidig ansatte og vikarer</li>
<li>Innleide arbeidstakere</li>
<li>Konsulenter og selvstendig næringsdrivende som utfører arbeid for bedriften</li>
<li>Søkere til stillinger</li>
<li>Tidligere ansatte (om forhold fra ansettelsesperioden)</li>
<li>Styremedlemmer og eiere</li>
</ul>
<p>Alle som varsler i tråd med disse rutinene, er beskyttet mot gjengjeldelse.</p>`,
    },
    {
      id: "kanaler",
      title: "Varslingskanaler",
      content: (form) => `<h2>4. Varslingskanaler</h2>
<h3>4.1 Intern varsling</h3>
<p>${f(form.companyName, "Bedriftsnavn")} har følgende interne varslingskanaler:</p>
<table style="width:100%;border-collapse:collapse;margin:1em 0;">
<tr style="border-bottom:1px solid #e5e7eb;"><td style="padding:8px;font-weight:bold;">Kanal</td><td style="padding:8px;font-weight:bold;">Kontakt</td><td style="padding:8px;font-weight:bold;">Når</td></tr>
<tr style="border-bottom:1px solid #e5e7eb;"><td style="padding:8px;">Nærmeste leder</td><td style="padding:8px;">—</td><td style="padding:8px;">Førstevalg for de fleste saker</td></tr>
<tr style="border-bottom:1px solid #e5e7eb;"><td style="padding:8px;">Varslingskontakt</td><td style="padding:8px;">${f(form.whistleblowerContact, "Kontakt")}</td><td style="padding:8px;">Når saken gjelder nærmeste leder</td></tr>
<tr style="border-bottom:1px solid #e5e7eb;"><td style="padding:8px;">Verneombud</td><td style="padding:8px;">${f(form.verneombud, "Verneombud")}</td><td style="padding:8px;">HMS-relaterte forhold</td></tr>
<tr style="border-bottom:1px solid #e5e7eb;"><td style="padding:8px;">HR-ansvarlig</td><td style="padding:8px;">${f(form.hrContact, "HR")}</td><td style="padding:8px;">Personalrelaterte saker</td></tr>
<tr><td style="padding:8px;">Eskaleringskontakt</td><td style="padding:8px;">${f(form.escalationContact, "Eskalering")}</td><td style="padding:8px;">Når saken gjelder daglig leder</td></tr>
</table>
${form.whistleblowerEmail ? `<p><strong>Varslings-e-post:</strong> ${form.whistleblowerEmail}</p>` : ""}
${form.whistleblowerPhone ? `<p><strong>Varslingstelefon:</strong> ${form.whistleblowerPhone}</p>` : ""}
${form.externalChannel ? `<h3>4.2 Eksternt varslingsverktøy</h3><p>Bedriften benytter <strong>${form.externalChannel}</strong> som eksternt, uavhengig varslingsverktøy for å sikre anonymitet og uavhengig behandling.</p>` : ""}
<h3>4.${form.externalChannel ? "3" : "2"} Anonym varsling</h3>
<p>Det er mulig å varsle anonymt. Merk at anonym varsling kan gjøre det vanskeligere å undersøke saken og gi tilbakemelding. Anonyme varsler tas likevel på alvor.</p>`,
    },
    {
      id: "fremgangsmaate",
      title: "Fremgangsmåte for varsling",
      content: (form) => `<h2>5. Fremgangsmåte for varsling</h2>
<h3>5.1 Skriftlig varsling</h3>
<p>Varsling bør fortrinnsvis skje skriftlig for å sikre dokumentasjon. Et varsel bør inneholde:</p>
<ul>
<li>Beskrivelse av det kritikkverdige forholdet — hva har skjedd?</li>
<li>Når og hvor skjedde det?</li>
<li>Hvem er involvert?</li>
<li>Eventuelle vitner</li>
<li>Dokumentasjon (e-poster, bilder, etc.) dersom tilgjengelig</li>
<li>Om du ønsker å være anonym</li>
</ul>
<h3>5.2 Muntlig varsling</h3>
<p>Det er også mulig å varsle muntlig. Mottaker skal da dokumentere varselet skriftlig og bekrefte innholdet med varsleren.</p>
<h3>5.3 Varslingsskjema</h3>
<p>Det anbefales å bruke bedriftens varslingsskjema som sikrer at all nødvendig informasjon inkluderes. Skjemaet er tilgjengelig via varslingskanalen.</p>`,
    },
    {
      id: "behandling",
      title: "Mottak og behandling",
      content: (form) => `<h2>6. Mottak, dokumentasjon og oppfølging</h2>
<h3>6.1 Mottak</h3>
<p>Mottaker av et varsel skal:</p>
<ol>
<li>Bekrefte mottak skriftlig innen <strong>${f(form.ackDeadlineDays, "Dager")} virkedager</strong></li>
<li>Vurdere om varselet gjelder et kritikkverdig forhold etter loven</li>
<li>Vurdere habilitet — er mottaker inhabil skal saken videresendes</li>
<li>Opprette sak i varslingssystemet</li>
</ol>
<h3>6.2 Undersøkelse</h3>
<p>Undersøkelsen skal:</p>
<ul>
<li>Iverksettes uten ugrunnet opphold</li>
<li>Gjennomføres av en upartisk person som ikke er involvert i forholdet</li>
<li>Gi den/de det varsles om mulighet til å uttale seg (kontradiksjon)</li>
<li>Dokumenteres grundig</li>
<li>Ferdigstilles innen <strong>${f(form.investigationDeadlineDays, "Dager")} virkedager</strong> (kan forlenges ved komplekse saker)</li>
</ul>
<h3>6.3 Konklusjon og tiltak</h3>
<ul>
<li>Varsleren informeres om utfallet av behandlingen</li>
<li>Den det er varslet om, informeres om konklusjonen</li>
<li>Nødvendige tiltak iverksettes</li>
<li>Saken lukkes og arkiveres forsvarlig</li>
</ul>
<h3>6.4 Dokumentasjon og logg</h3>
<p>Alle varslingssaker dokumenteres med:</p>
<ul>
<li>Dato og tidspunkt for mottak</li>
<li>Beskrivelse av forholdet</li>
<li>Tiltak iverksatt</li>
<li>Kommunikasjon med involverte parter</li>
<li>Konklusjon og begrunnelse</li>
</ul>
<p>Dokumentasjonen oppbevares konfidensielt og i tråd med personvernregelverket.</p>`,
    },
    {
      id: "vern",
      title: "Whistleblower-beskyttelse",
      content: (form) => `<h2>7. Vern mot gjengjeldelse</h2>
<p>Det er forbudt å gjengjelde mot arbeidstaker som varsler i samsvar med arbeidsmiljøloven § 2A-4.</p>
<h3>Hva er gjengjeldelse?</h3>
<p>Gjengjeldelse er enhver ugunstig handling, praksis eller unnlatelse som er en følge av eller reaksjon på varsling:</p>
<ul>
<li>Oppsigelse, suspensjon eller avskjed</li>
<li>Omplassering, degradering eller endring av arbeidsoppgaver</li>
<li>Trusler, trakassering eller forskjellsbehandling</li>
<li>Sosial ekskludering eller utfrysing</li>
<li>Muntlige eller skriftlige advarsler uten saklig grunnlag</li>
<li>Negative endringer i lønn, arbeidstid eller andre arbeidsvilkår</li>
<li>Manglende forfremmelse eller forbigåelse</li>
</ul>
<h3>${f(form.companyName, "Bedriftsnavn")}s forpliktelse</h3>
<p>Ledelsen skal:</p>
<ul>
<li>Aktivt forebygge gjengjeldelse mot varslere</li>
<li>Følge opp varslerens arbeidsmiljø under og etter behandlingen</li>
<li>Iverksette tiltak dersom gjengjeldelse oppdages</li>
</ul>
<p><strong>Brudd på gjengjeldelsesvernet kan medføre erstatnings- og oppreisningsansvar for bedriften.</strong></p>`,
    },
    {
      id: "ekstern",
      title: "Ekstern varsling og eskalering",
      content: (form) => `<h2>8. Ekstern varsling og eskaleringsprosedyrer</h2>
<h3>8.1 Varsling til tilsynsmyndigheter</h3>
<p>Ansatte har <strong>alltid</strong> rett til å varsle eksternt til offentlige tilsynsmyndigheter:</p>
<ul>
<li><strong>Arbeidstilsynet</strong> — arbeidsmiljø, HMS, arbeidsvilkår</li>
<li><strong>Datatilsynet</strong> — personvern og GDPR</li>
<li><strong>Økokrim</strong> — økonomisk kriminalitet</li>
<li><strong>Konkurransetilsynet</strong> — konkurranselovbrudd</li>
<li><strong>Likestillings- og diskrimineringsombudet</strong> — diskriminering</li>
<li><strong>Miljødirektoratet</strong> — miljøkriminalitet</li>
</ul>
<h3>8.2 Varsling til media/offentligheten</h3>
<p>Varsling til media eller offentligheten kan være lovlig dersom:</p>
<ol>
<li>Varsleren har grunn til å tro at det foreligger kritikkverdige forhold</li>
<li>Intern varsling ikke har ført frem, eller det er grunn til å tro at intern varsling ikke er hensiktsmessig</li>
<li>Varslingsinteressen klart veier tyngre enn arbeidsgivers interesse i at det ikke varsles</li>
</ol>
<h3>8.3 Eskaleringsprosedyrer</h3>
<p>Dersom varselet ikke behandles tilfredsstillende internt:</p>
<ol>
<li><strong>Første eskalering:</strong> Kontakt ${f(form.escalationContact, "Eskaleringskontakt")}</li>
<li><strong>Andre eskalering:</strong> Ekstern varsling til tilsynsmyndighet</li>
<li><strong>Tredje eskalering:</strong> Juridisk bistand (bedriften dekker kostnader ved berettiget varsling)</li>
</ol>`,
    },
  ],
};
