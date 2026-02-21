import type { GeneratorConfig } from "./types";

const f = (v: any, fallback: string) => v || `<span class="merge-field">[${fallback}]</span>`;

export const arbeidsreglementConfig: GeneratorConfig = {
  id: "arbeidsreglement",
  title: "Arbeidsreglement",
  subtitle: "Formelt arbeidsreglement forankret i arbeidsmiljøloven kap. 14",
  documentCategory: "HR-Arbeidsreglement",
  defaultValues: {
    companyName: "", orgNumber: "", ceoName: "", address: "",
    numEmployees: "", normalHours: "37.5",
    coreHoursStart: "09:00", coreHoursEnd: "15:00",
    lunchDuration: "30", lunchPaid: false,
    sickSelfDays: "3", noticePeriod: "3",
    probationMonths: "6",
    smokingPolicy: "Kun på anviste steder",
    alcoholPolicy: "Nulltoleranse i arbeidstiden",
    dressCode: "Passende for arbeidssituasjonen",
    sanctionContact: "Daglig leder",
    adoptedDate: "", adoptedBy: "Daglig leder",
    employeeRepresentative: "",
  },
  fieldGroups: [
    {
      title: "Bedriftsinformasjon",
      fields: [
        { id: "companyName", label: "Bedriftsnavn", type: "text", placeholder: "AS Eksempel" },
        { id: "orgNumber", label: "Org.nummer", type: "text" },
        { id: "ceoName", label: "Daglig leder", type: "text" },
        { id: "address", label: "Adresse", type: "text" },
        { id: "numEmployees", label: "Antall ansatte", type: "number" },
      ],
    },
    {
      title: "Arbeidstid",
      fields: [
        { id: "normalHours", label: "Ukentlig arbeidstid", type: "text" },
        { id: "coreHoursStart", label: "Kjernetid fra", type: "text" },
        { id: "coreHoursEnd", label: "Kjernetid til", type: "text" },
        { id: "lunchDuration", label: "Lunsjpause (min)", type: "text" },
        { id: "lunchPaid", label: "Betalt lunsj", type: "checkbox" },
      ],
    },
    {
      title: "Ansettelsesvilkår",
      fields: [
        { id: "probationMonths", label: "Prøvetid (måneder)", type: "text" },
        { id: "noticePeriod", label: "Oppsigelsestid (måneder)", type: "text" },
        { id: "sickSelfDays", label: "Egenmeldingsdager", type: "text" },
      ],
    },
    {
      title: "Ordensregler",
      fields: [
        { id: "smokingPolicy", label: "Røykepolicy", type: "text" },
        { id: "alcoholPolicy", label: "Rusmiddelpolicy", type: "text" },
        { id: "dressCode", label: "Kleskode", type: "text" },
      ],
    },
    {
      title: "Formelle forhold",
      fields: [
        { id: "sanctionContact", label: "Sanksjonskontakt", type: "text" },
        { id: "adoptedDate", label: "Vedtatt dato", type: "text", placeholder: "01.01.2026" },
        { id: "adoptedBy", label: "Vedtatt av", type: "text" },
        { id: "employeeRepresentative", label: "Tillitsvalgt/representant", type: "text" },
      ],
    },
  ],
  sections: [
    {
      id: "formaal",
      title: "Formål og virkeområde",
      content: (form) => `<h2>§ 1. Formål og virkeområde</h2>
<p>Dette arbeidsreglementet er fastsatt i henhold til arbeidsmiljøloven kapittel 14 og gjelder for alle ansatte i <strong>${f(form.companyName, "Bedriftsnavn")}</strong> (org.nr. ${f(form.orgNumber, "Org.nr.")}), med forretningsadresse ${f(form.address, "Adresse")}.</p>
<p>Reglementet gjelder uavhengig av stillingstype og stillingsbrøk, og supplerer den individuelle arbeidskontrakten. Ved motstrid gjelder arbeidskontrakten.</p>
<p>Reglementet er vedtatt ${f(form.adoptedDate, "Dato")} av ${f(form.adoptedBy, "Vedtatt av")}${form.employeeRepresentative ? ` i samarbeid med tillitsvalgt ${form.employeeRepresentative}` : ""}, og trer i kraft fra vedtaksdato.</p>`,
    },
    {
      id: "ansettelse",
      title: "Ansettelsesforhold",
      content: (form) => `<h2>§ 2. Ansettelsesforhold</h2>
<h3>2.1 Tilsetting</h3>
<p>Ansettelser foretas av ${f(form.ceoName, "Daglig leder")} eller den som er delegert myndighet. Alle ansatte skal ha skriftlig arbeidskontrakt som oppfyller kravene i aml. § 14-6.</p>
<h3>2.2 Prøvetid</h3>
<p>Prøvetiden er ${f(form.probationMonths, "Måneder")} måneder med 14 dagers gjensidig oppsigelsestid. Prøvetiden kan forlenges ved fravær som ikke skyldes arbeidsgiver.</p>
<h3>2.3 Oppsigelse</h3>
<p>Gjensidig oppsigelsestid er ${f(form.noticePeriod, "Måneder")} måneder, regnet fra den 1. i måneden etter at oppsigelsen ble mottatt. Oppsigelse skal være skriftlig.</p>
<h3>2.4 Avskjed</h3>
<p>Ved grovt pliktbrudd eller vesentlig mislighold kan arbeidsgiver gi avskjed med umiddelbar fratreden, jf. aml. § 15-14. Drøftingsmøte skal gjennomføres på forhånd.</p>`,
    },
    {
      id: "arbeidstid",
      title: "Arbeidstid og pauser",
      content: (form) => `<h2>§ 3. Arbeidstid og pauser</h2>
<h3>3.1 Alminnelig arbeidstid</h3>
<p>Den alminnelige arbeidstiden er <strong>${f(form.normalHours, "Timer")} timer per uke</strong>, fordelt på 5 arbeidsdager (mandag–fredag).</p>
<h3>3.2 Kjernetid</h3>
<p>Kjernetid er ${f(form.coreHoursStart, "Fra")}–${f(form.coreHoursEnd, "Til")}. Alle ansatte skal være tilgjengelige i kjernetiden med mindre annet er avtalt med nærmeste leder.</p>
<h3>3.3 Pauser</h3>
<p>Lunsjpause er ${f(form.lunchDuration, "Min")} minutter${form.lunchPaid ? " og er inkludert i arbeidstiden" : " og kommer i tillegg til arbeidstiden"}. Ved arbeidsdager over 8 timer har ansatte krav på minst 30 minutters pause.</p>
<h3>3.4 Overtid</h3>
<p>Overtid skal alltid godkjennes av leder på forhånd. Lovens grenser for overtid gjelder: maks 10 timer/7 dager, 25 timer/4 uker, 200 timer/52 uker. Overtidstillegg utbetales iht. lov/avtale.</p>
<h3>3.5 Tidsregistrering</h3>
<p>Alle ansatte plikter å registrere arbeidstid korrekt og daglig. Mangelfulle eller feilaktige registreringer kan få konsekvenser for lønnsutbetaling.</p>`,
    },
    {
      id: "fravaer",
      title: "Fravær og meldeplikt",
      content: (form) => `<h2>§ 4. Fravær og meldeplikt</h2>
<h3>4.1 Meldeplikt</h3>
<p>Alt fravær skal meldes til nærmeste leder så snart som mulig, og senest innen arbeidsdagens start. Ved planlagt fravær skal det søkes på forhånd.</p>
<h3>4.2 Egenmelding</h3>
<p>Egenmelding kan benyttes i inntil ${f(form.sickSelfDays, "Dager")} kalenderdager. Ansatte må ha arbeidet i minst 2 måneder for å benytte egenmelding.</p>
<h3>4.3 Sykemelding</h3>
<p>Ved fravær utover egenmeldingsperioden kreves sykemelding fra lege. Sykemeldingen leveres/registreres snarest mulig.</p>
<h3>4.4 Ulovlig fravær</h3>
<p>Fravær uten gyldig grunn eller uten at meldeplikt er overholdt, anses som ulovlig fravær. Dette kan medføre:</p>
<ul>
<li>Trekk i lønn for fraværsperioden</li>
<li>Skriftlig advarsel</li>
<li>Ved gjentakelse: oppsigelse</li>
</ul>
<h3>4.5 For sent fremmøte</h3>
<p>Gjentatt for sent fremmøte uten gyldig grunn anses som brudd på arbeidsreglementet og kan medføre advarsel.</p>`,
    },
    {
      id: "ordensregler",
      title: "Ordensregler og atferd",
      content: (form) => `<h2>§ 5. Ordensregler og atferd</h2>
<h3>5.1 Generelle ordensregler</h3>
<ul>
<li>Arbeidsplassen skal holdes ryddig og ordentlig</li>
<li>Adgangskort og nøkler er personlige og skal ikke lånes ut</li>
<li>Bedriftens utstyr og eiendeler skal behandles med forsiktighet</li>
<li>Ansatte skal opptre høflig og respektfullt overfor alle</li>
</ul>
<h3>5.2 Kleskode</h3>
<p>${f(form.dressCode, "Kleskode")}.</p>
<h3>5.3 Røyking</h3>
<p>${f(form.smokingPolicy, "Røykepolicy")}.</p>
<h3>5.4 Rusmidler</h3>
<p>${f(form.alcoholPolicy, "Rusmiddelpolicy")}. Ansatte skal ikke møte på jobb påvirket av alkohol eller andre rusmidler. Medisinbruk som kan påvirke arbeidsevnen skal meldes til leder.</p>
<h3>5.5 Atferd</h3>
<p>${f(form.companyName, "Bedriftsnavn")} har nulltoleranse for:</p>
<ul>
<li>Mobbing, trakassering og diskriminering</li>
<li>Trusler, vold eller truende adferd</li>
<li>Seksuell trakassering</li>
<li>Baksnakking eller ryktespredning</li>
</ul>`,
    },
    {
      id: "taushetsplikt",
      title: "Taushetsplikt",
      content: (form) => `<h2>§ 6. Taushetsplikt</h2>
<p>Alle ansatte har taushetsplikt om forretningshemmeligheter, kundeforhold, interne strategier, økonomiske forhold og annen konfidensiell informasjon som de blir kjent med gjennom sitt arbeid.</p>
<p>Taushetsplikten gjelder:</p>
<ul>
<li>Overfor utenforstående, herunder familie og venner</li>
<li>Overfor kollegaer som ikke har tjenstlig behov for informasjonen</li>
<li>I sosiale medier og offentlige sammenhenger</li>
<li>Også etter at arbeidsforholdet er avsluttet</li>
</ul>
<p>Brudd på taushetsplikten anses som grovt pliktbrudd og kan medføre avskjed og erstatningsansvar.</p>`,
    },
    {
      id: "it-bruk",
      title: "IT-bruk og utstyr",
      content: (form) => `<h2>§ 7. IT-bruk og utstyr</h2>
<p>IT-utstyr utlevert av ${f(form.companyName, "Bedriftsnavn")} er bedriftens eiendom.</p>
<h3>7.1 Regler</h3>
<ul>
<li>Utstyret skal primært benyttes til arbeidsrelaterte formål</li>
<li>Begrenset privat bruk tillates dersom det ikke går utover arbeidsoppgavene</li>
<li>Installasjon av programvare krever godkjenning fra IT-ansvarlig</li>
<li>Nedlasting av ulovlig, støtende eller skadelig innhold er strengt forbudt</li>
<li>Passord er personlige og skal ikke deles</li>
</ul>
<h3>7.2 E-post og kommunikasjon</h3>
<ul>
<li>Bedriftens e-post skal brukes profesjonelt</li>
<li>Sensitiv informasjon skal krypteres ved sending eksternt</li>
<li>Automatisk videresending til private e-postkontoer er ikke tillatt</li>
</ul>
<h3>7.3 Ved avslutning</h3>
<p>Alt IT-utstyr skal leveres tilbake siste arbeidsdag. Private filer fjernes i rimelig tid før fratredelse.</p>`,
    },
    {
      id: "sanksjoner",
      title: "Sanksjoner og disiplinære prosedyrer",
      content: (form) => `<h2>§ 8. Sanksjoner og disiplinære prosedyrer</h2>
<h3>8.1 Trinnvis tilnærming</h3>
<p>Brudd på arbeidsreglementet håndteres etter en trinnvis tilnærming:</p>
<ol>
<li><strong>Muntlig tilbakemelding</strong> — Ved mindre eller førstegangs brudd. Dokumenteres i personalmappen.</li>
<li><strong>Skriftlig advarsel</strong> — Ved gjentatte eller mer alvorlige brudd. Advarselen beskriver forholdet, forventet forbedring og konsekvenser ved nye brudd.</li>
<li><strong>Oppsigelse</strong> — Ved gjentatte brudd etter advarsel, eller ved alvorlige enkeltstående brudd. Drøftingsmøte (aml. § 15-1) gjennomføres først.</li>
<li><strong>Avskjed</strong> — Ved grovt pliktbrudd eller vesentlig mislighold, jf. aml. § 15-14. Medfører umiddelbar fratreden.</li>
</ol>
<h3>8.2 Rettssikkerhet</h3>
<ul>
<li>Ansatte har rett til å uttale seg før det treffes beslutning om formell reaksjon</li>
<li>Ansatte kan la seg bistå av tillitsvalgt eller annen rådgiver i alle trinn</li>
<li>Alle formelle reaksjoner dokumenteres skriftlig og oppbevares i personalmappen</li>
<li>Ansatte har rett til å gi skriftlig tilsvar som legges i mappen</li>
</ul>
<h3>8.3 Kontaktperson</h3>
<p>Spørsmål om disiplinære prosedyrer rettes til ${f(form.sanctionContact, "Kontaktperson")}.</p>`,
    },
    {
      id: "endringer",
      title: "Endring av reglementet",
      content: (form) => `<h2>§ 9. Endring av reglementet</h2>
<p>Endringer i arbeidsreglementet følger prosedyren i arbeidsmiljøloven § 14-17:</p>
<ol>
<li>Arbeidsgiver utarbeider forslag til endringer</li>
<li>Forslaget drøftes med tillitsvalgte/ansattrepresentanter</li>
<li>Endringene vedtas og kunngjøres for alle ansatte</li>
<li>Ansatte gis rimelig tid til å gjøre seg kjent med endringene</li>
</ol>
<p>Ved uenighet mellom arbeidsgiver og arbeidstakernes representanter, kan Arbeidstilsynet fastsette reglementet, jf. aml. § 14-18.</p>
<h3>Versjonskontroll</h3>
<p>Gjeldende versjon av arbeidsreglementet er alltid tilgjengelig i bedriftens dokumentarkiv. Tidligere versjoner arkiveres med dato.</p>`,
    },
    {
      id: "lovforankring",
      title: "Forankring i arbeidsmiljøloven",
      content: (form) => `<h2>§ 10. Forankring i arbeidsmiljøloven</h2>
<p>Dette arbeidsreglementet er utarbeidet i henhold til arbeidsmiljølovens kapittel 14 om arbeidsreglement. Følgende bestemmelser er særlig relevante:</p>
<ul>
<li><strong>§ 14-16</strong> — Plikt til å ha arbeidsreglement for virksomheter med minst 10 ansatte</li>
<li><strong>§ 14-17</strong> — Innholdet i reglementet og prosedyre for fastsettelse</li>
<li><strong>§ 14-18</strong> — Arbeidstilsynets rolle ved uenighet</li>
<li><strong>§ 14-19</strong> — Kunngjøring og ikrafttredelse</li>
<li><strong>§ 14-20</strong> — Bøter for overtredelse</li>
</ul>
<p>Arbeidsreglementet kan ikke inneholde bestemmelser som er i strid med lov eller tariffavtale.</p>
<hr />
<p><em>Vedtatt: ${f(form.adoptedDate, "Dato")}</em></p>
<p><em>Vedtatt av: ${f(form.adoptedBy, "Rolle")}</em></p>
${form.employeeRepresentative ? `<p><em>Tillitsvalgt/representant: ${form.employeeRepresentative}</em></p>` : ""}`,
    },
  ],
};
