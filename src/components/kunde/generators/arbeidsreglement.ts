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
    overtimeMax7: "10", overtimeMax4w: "25", overtimeMax52w: "200",
    sickSelfDays: "3", noticePeriod: "3",
    probationMonths: "6", probationNotice: "14",
    smokingPolicy: "Kun på anviste steder",
    alcoholPolicy: "Nulltoleranse i arbeidstiden",
    drugTestPolicy: false,
    dressCode: "Passende for arbeidssituasjonen",
    cleanDeskPolicy: true,
    accessCardPolicy: "Personlig — skal ikke lånes ut",
    idBadgeRequired: false,
    sanctionContact: "Daglig leder",
    adoptedDate: "", adoptedBy: "Daglig leder",
    employeeRepresentative: "",
    previousVersion: "",
    effectiveDate: "",
    distributionMethod: "E-post og dokumentarkiv",
    aiPolicy: "Kun godkjente AI-verktøy med bedriftskonto",
    socialMediaPolicy: "Unngå konfidensiell informasjon — følg sunn fornuft",
    sideJobPolicy: "Tillatt etter skriftlig godkjenning",
    giftPolicy: "Maks verdi 500 kr — skal meldes til leder",
    flexitimeBalance: "±20 timer",
    officeHoursStart: "07:00",
    officeHoursEnd: "18:00",
    nightWorkPolicy: "Ikke tillatt uten særskilt avtale",
    sundayWorkPolicy: "Kun ved spesielle behov med forhåndsgodkjenning",
    travelTimeCompensation: "Reisetid utover normal arbeidstid kompenseres etter avtale",
    standbyPolicy: "Beredskapsvakt kompenseres med 1/5 av normal timelønn",
    phoneUsePolicy: "Begrenset privat bruk i arbeidstiden",
    parkingPolicy: "Parkering tilgjengelig for ansatte",
    personalPropertyPolicy: "Bedriften er ikke ansvarlig for private eiendeler",
    environmentalRules: "Kildesortering og energisparing er obligatorisk",
    visitorPolicy: "Besøkende registreres i resepsjonen og følges av ansatt",
    petPolicy: "Husdyr tillates ikke på arbeidsplassen med mindre avtalt",
  },
  fieldGroups: [
    {
      title: "Bedriftsinformasjon",
      fields: [
        { id: "companyName", label: "Bedriftsnavn", type: "text", placeholder: "AS Eksempel", helpText: "Offisielt firmanavn som registrert i Brønnøysundregistrene." },
        { id: "orgNumber", label: "Org.nummer", type: "text", helpText: "9-sifret organisasjonsnummer fra Enhetsregisteret." },
        { id: "ceoName", label: "Daglig leder", type: "text", helpText: "Navn på daglig leder som har delegert ansvar for at reglementet overholdes." },
        { id: "address", label: "Forretningsadresse", type: "text", helpText: "Offisiell forretningsadresse. Viktig for å angi reglementets virkeområde." },
        { id: "numEmployees", label: "Antall ansatte", type: "number", helpText: "Bedrifter med 10+ ansatte er lovpålagt å ha arbeidsreglement (aml. § 14-16)." },
      ],
    },
    {
      title: "Arbeidstid og overtid",
      fields: [
        { id: "normalHours", label: "Ukentlig arbeidstid", type: "text", helpText: "Normal ukentlig arbeidstid i timer. Lovens maksimum er 40 timer. Vanligst er 37,5 timer." },
        { id: "coreHoursStart", label: "Kjernetid fra", type: "text", helpText: "Start på kjernetid der alle ansatte skal være tilgjengelige." },
        { id: "coreHoursEnd", label: "Kjernetid til", type: "text", helpText: "Slutt på kjernetid. Utenfor kjernetiden gjelder fleksitid." },
        { id: "lunchDuration", label: "Lunsjpause (min)", type: "text", helpText: "Pausens lengde i minutter. Lovens minimum er 30 minutter ved arbeidsdager over 5,5 timer." },
        { id: "lunchPaid", label: "Betalt lunsj", type: "checkbox", helpText: "Om lunsjpausen er inkludert i arbeidstiden (betalt) eller kommer i tillegg (ubetalt)." },
        { id: "overtimeMax7", label: "Maks overtid/7 dager", type: "text", helpText: "Lovens grense for overtid per 7 dager. Standard er 10 timer (aml. § 10-6)." },
        { id: "overtimeMax4w", label: "Maks overtid/4 uker", type: "text", helpText: "Lovens grense for overtid per 4 uker. Standard er 25 timer." },
        { id: "overtimeMax52w", label: "Maks overtid/52 uker", type: "text", helpText: "Lovens grense for overtid per 52 uker. Standard er 200 timer, kan utvides til 300 ved avtale med tillitsvalgt." },
      ],
    },
    {
      title: "Ansettelsesvilkår",
      fields: [
        { id: "probationMonths", label: "Prøvetid (måneder)", type: "text", helpText: "Lengden på prøvetiden. Maks 6 måneder iht. aml. § 15-6." },
        { id: "probationNotice", label: "Oppsigelse i prøvetid (dager)", type: "text", helpText: "Oppsigelsestid i prøvetiden. Lovens standard er 14 dager gjensidig." },
        { id: "noticePeriod", label: "Oppsigelsestid (måneder)", type: "text", helpText: "Gjensidig oppsigelsestid etter prøvetiden. Regnes fra den 1. i måneden etter mottak av oppsigelse." },
        { id: "sickSelfDays", label: "Egenmeldingsdager", type: "text", helpText: "Antall kalenderdager egenmelding per fraværsperiode. Standard 3 dager, IA-bedrifter inntil 8." },
        { id: "sideJobPolicy", label: "Bierverv-policy", type: "text", helpText: "Retningslinjer for om ansatte kan ha bierverv/sidejobber. Vanlig å kreve forhåndsgodkjenning for å unngå interessekonflikt." },
      ],
    },
    {
      title: "Ordensregler og atferd",
      fields: [
        { id: "smokingPolicy", label: "Røykepolicy", type: "text", helpText: "Regler for røyking/snusing på arbeidsplassen. Må overholde røykeloven. Angi anviste steder." },
        { id: "alcoholPolicy", label: "Rusmiddelpolicy", type: "text", helpText: "Bedriftens policy for alkohol og rusmidler. Nulltoleranse i arbeidstiden er vanligst. Vurder policy for representasjon." },
        { id: "drugTestPolicy", label: "Rusmiddeltesting", type: "checkbox", helpText: "Om bedriften har rett til rusmiddeltesting. Krever saklig grunn og hjemmel (f.eks. sikkerhetsrelaterte stillinger)." },
        { id: "dressCode", label: "Kleskode", type: "text", helpText: "Krav til påkledning. Bør være tydelig og tilpasset bransje og eventuelle kundekontakter." },
        { id: "cleanDeskPolicy", label: "Clean desk-policy", type: "checkbox", helpText: "Om ansatte skal rydde pulten ved arbeidsdagens slutt. Viktig for sikkerhet og profesjonelt miljø." },
        { id: "accessCardPolicy", label: "Adgangskort-regler", type: "text", helpText: "Regler for bruk av adgangskort/nøkler. Normalt personlig og skal ikke utlånes." },
        { id: "idBadgeRequired", label: "ID-brikke synlig", type: "checkbox", helpText: "Om ansatte må bære synlig ID-brikke på arbeidsplassen. Relevant for sikkerhetsmessige årsaker." },
        { id: "giftPolicy", label: "Policy for gaver/representasjon", type: "text", helpText: "Maks verdi for gaver fra/til kunder/leverandører og krav om rapportering. Viktig for anti-korrupsjon." },
      ],
    },
    {
      title: "Digitale retningslinjer",
      fields: [
        { id: "aiPolicy", label: "AI-bruk retningslinjer", type: "text", helpText: "Retningslinjer for bruk av kunstig intelligens i arbeidet. Viktig å avklare hvilke verktøy som er godkjent og hva slags data som kan brukes." },
        { id: "socialMediaPolicy", label: "Sosiale medier-policy", type: "text", helpText: "Retningslinjer for hva ansatte kan dele om bedriften i sosiale medier. Vern om forretningshemmeligheter og bedriftens omdømme." },
        { id: "phoneUsePolicy", label: "Privat mobilbruk", type: "text", helpText: "Retningslinjer for bruk av privat mobiltelefon i arbeidstiden. Overdreven bruk kan påvirke produktivitet og sikkerhet." },
      ],
    },
    {
      title: "Arbeidstidsordninger (utvidet)",
      fields: [
        { id: "flexitimeBalance", label: "Fleksitidssaldo maks", type: "text", helpText: "Maksimal pluss/minus-saldo for fleksitid. Vanlig er ±20 eller ±40 timer." },
        { id: "officeHoursStart", label: "Kontortid åpner", type: "text", helpText: "Tidspunktet kontoret åpner for arbeid. Ansatte kan ikke arbeide før dette uten avtale." },
        { id: "officeHoursEnd", label: "Kontortid stenger", type: "text", helpText: "Tidspunktet kontoret stenger. Arbeid etter dette krever forhåndsgodkjenning." },
        { id: "nightWorkPolicy", label: "Nattarbeid-policy", type: "text", helpText: "Regler for nattarbeid (kl. 21–06). Nattarbeid er kun tillatt når arbeidets art gjør det nødvendig (aml. § 10-11)." },
        { id: "sundayWorkPolicy", label: "Søndagsarbeid-policy", type: "text", helpText: "Regler for søn- og helgedagsarbeid. Kun tillatt når arbeidets art gjør det nødvendig (aml. § 10-10)." },
        { id: "travelTimeCompensation", label: "Reisetidskompensasjon", type: "text", helpText: "Hvordan reisetid utover normal pendletid kompenseres. Ikke lovpålagt, men vanlig å regulere." },
        { id: "standbyPolicy", label: "Beredskapsvakt", type: "text", helpText: "Kompensasjon og regler for beredskapsvakt/tilkallingsordning. Passiv beredskapsvakt teller som 1/5 arbeidstid." },
      ],
    },
    {
      title: "Lokaler og miljø",
      fields: [
        { id: "parkingPolicy", label: "Parkering", type: "text", helpText: "Parkeringsordning for ansatte. Spesifiser om det er gratis, avgiftsbelagt eller begrenset antall plasser." },
        { id: "visitorPolicy", label: "Besøkspolicy", type: "text", helpText: "Regler for besøkende til arbeidsplassen. Registrering, følge og sikkerhetssjekk." },
        { id: "personalPropertyPolicy", label: "Personlige eiendeler", type: "text", helpText: "Ansvarsforhold for private eiendeler på arbeidsplassen. Bedriften er normalt ikke erstatningsansvarlig." },
        { id: "environmentalRules", label: "Miljøregler", type: "text", helpText: "Regler for kildesortering, energisparing og bærekraft på arbeidsplassen." },
        { id: "petPolicy", label: "Husdyr-policy", type: "text", helpText: "Om husdyr tillates på arbeidsplassen. Hensyn til allergier og arbeidsmiljø." },
      ],
    },
    {
      title: "Formelle forhold",
      fields: [
        { id: "sanctionContact", label: "Sanksjonskontakt", type: "text", helpText: "Person spørsmål om disiplinære prosedyrer rettes til. Vanligvis daglig leder, HR-sjef eller juridisk ansvarlig." },
        { id: "adoptedDate", label: "Vedtatt dato", type: "text", placeholder: "01.01.2026", helpText: "Dato reglementet ble vedtatt. Reglementet trer i kraft fra denne datoen." },
        { id: "effectiveDate", label: "Ikrafttredelsesdato", type: "text", helpText: "Dato reglementet trer i kraft fra, dersom annet enn vedtaksdato. Ansatte skal varsles i rimelig tid." },
        { id: "adoptedBy", label: "Vedtatt av", type: "text", helpText: "Rolle/person som har vedtatt reglementet (normalt daglig leder eller styret)." },
        { id: "employeeRepresentative", label: "Tillitsvalgt/representant", type: "text", helpText: "Navn på tillitsvalgt eller ansattrepresentant som har drøftet reglementet. Påkrevd ved drøfting jf. aml. § 14-17." },
        { id: "previousVersion", label: "Erstatter versjon", type: "text", helpText: "Referanse til forrige versjon av reglementet (dato eller versjonsnummer)." },
        { id: "distributionMethod", label: "Kunngjøringsmetode", type: "text", helpText: "Hvordan reglementet gjøres kjent for ansatte (e-post, intranett, oppslag). Krav om kunngjøring jf. aml. § 14-19." },
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
<p>Reglementet er vedtatt ${f(form.adoptedDate, "Dato")} av ${f(form.adoptedBy, "Vedtatt av")}${form.employeeRepresentative ? ` i samarbeid med tillitsvalgt ${form.employeeRepresentative}` : ""}, og trer i kraft fra ${form.effectiveDate || form.adoptedDate || "vedtaksdato"}.${form.previousVersion ? ` Erstatter versjon ${form.previousVersion}.` : ""}</p>
<p>Kunngjort via: ${f(form.distributionMethod, "Metode")}.</p>`,
    },
    {
      id: "ansettelse",
      title: "Ansettelsesforhold",
      content: (form) => `<h2>§ 2. Ansettelsesforhold</h2>
<h3>2.1 Tilsetting</h3>
<p>Ansettelser foretas av ${f(form.ceoName, "Daglig leder")} eller den som er delegert myndighet. Alle ansatte skal ha skriftlig arbeidskontrakt som oppfyller kravene i aml. § 14-6.</p>
<h3>2.2 Prøvetid</h3>
<p>Prøvetiden er ${f(form.probationMonths, "Måneder")} måneder med ${f(form.probationNotice, "14")} dagers gjensidig oppsigelsestid. Prøvetiden kan forlenges ved fravær som ikke skyldes arbeidsgiver.</p>
<h3>2.3 Oppsigelse</h3>
<p>Gjensidig oppsigelsestid er ${f(form.noticePeriod, "Måneder")} måneder, regnet fra den 1. i måneden etter at oppsigelsen ble mottatt. Oppsigelse skal være skriftlig.</p>
<h3>2.4 Avskjed</h3>
<p>Ved grovt pliktbrudd eller vesentlig mislighold kan arbeidsgiver gi avskjed med umiddelbar fratreden, jf. aml. § 15-14. Drøftingsmøte skal gjennomføres på forhånd.</p>
<h3>2.5 Bierverv</h3>
<p>${f(form.sideJobPolicy, "Tillatt etter skriftlig godkjenning")}. Bierverv som kan medføre interessekonflikt eller påvirke arbeidsytelsen negativt, vil normalt ikke bli godkjent.</p>`,
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
<p>Overtid skal alltid godkjennes av leder på forhånd. Lovens grenser for overtid gjelder: maks ${f(form.overtimeMax7, "10")} timer/7 dager, ${f(form.overtimeMax4w, "25")} timer/4 uker, ${f(form.overtimeMax52w, "200")} timer/52 uker. Overtidstillegg utbetales iht. lov/avtale.</p>
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
<li>Arbeidsplassen skal holdes ryddig og ordentlig${form.cleanDeskPolicy ? " — clean desk-policy gjelder ved arbeidsdagens slutt" : ""}</li>
<li>Adgangskort og nøkler: ${f(form.accessCardPolicy, "Personlig — skal ikke lånes ut")}</li>
${form.idBadgeRequired ? "<li>ID-brikke skal bæres synlig på arbeidsplassen</li>" : ""}
<li>Bedriftens utstyr og eiendeler skal behandles med forsiktighet</li>
<li>Ansatte skal opptre høflig og respektfullt overfor alle</li>
</ul>
<h3>5.2 Kleskode</h3>
<p>${f(form.dressCode, "Kleskode")}.</p>
<h3>5.3 Røyking</h3>
<p>${f(form.smokingPolicy, "Røykepolicy")}.</p>
<h3>5.4 Rusmidler</h3>
<p>${f(form.alcoholPolicy, "Rusmiddelpolicy")}. Ansatte skal ikke møte på jobb påvirket av alkohol eller andre rusmidler. Medisinbruk som kan påvirke arbeidsevnen skal meldes til leder.${form.drugTestPolicy ? " Bedriften forbeholder seg retten til rusmiddeltesting i henhold til gjeldende regelverk." : ""}</p>
<h3>5.5 Gaver og representasjon</h3>
<p>${f(form.giftPolicy, "Maks verdi 500 kr — skal meldes til leder")}. Gaver skal ikke påvirke beslutninger eller skape interessekonflikter.</p>
<h3>5.6 Atferd</h3>
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
      title: "IT-bruk, AI og sosiale medier",
      content: (form) => `<h2>§ 7. IT-bruk, AI og sosiale medier</h2>
<p>IT-utstyr utlevert av ${f(form.companyName, "Bedriftsnavn")} er bedriftens eiendom.</p>
<h3>7.1 Regler</h3>
<ul>
<li>Utstyret skal primært benyttes til arbeidsrelaterte formål</li>
<li>Begrenset privat bruk tillates dersom det ikke går utover arbeidsoppgavene</li>
<li>Installasjon av programvare krever godkjenning fra IT-ansvarlig</li>
<li>Nedlasting av ulovlig, støtende eller skadelig innhold er strengt forbudt</li>
<li>Passord er personlige og skal ikke deles</li>
</ul>
<h3>7.2 Bruk av kunstig intelligens (AI)</h3>
<p>${f(form.aiPolicy, "Kun godkjente AI-verktøy med bedriftskonto")}. Konfidensiell bedriftsinformasjon, personopplysninger og kundedata skal ikke mates inn i AI-verktøy uten forhåndsgodkjenning.</p>
<h3>7.3 Sosiale medier</h3>
<p>${f(form.socialMediaPolicy, "Retningslinjer")}. Ansatte er selv ansvarlige for publiseringer i sosiale medier, også på fritiden. Konfidensielt materiale skal aldri deles.</p>
<h3>7.4 E-post og kommunikasjon</h3>
<ul>
<li>Bedriftens e-post skal brukes profesjonelt</li>
<li>Sensitiv informasjon skal krypteres ved sending eksternt</li>
<li>Automatisk videresending til private e-postkontoer er ikke tillatt</li>
</ul>
<h3>7.5 Ved avslutning</h3>
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
${form.employeeRepresentative ? `<p><em>Tillitsvalgt/representant: ${form.employeeRepresentative}</em></p>` : ""}
${form.previousVersion ? `<p><em>Erstatter: ${form.previousVersion}</em></p>` : ""}`,
    },
  ],
};
