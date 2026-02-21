import type { GeneratorConfig } from "./types";

const f = (v: any, fallback: string) => v || `<span class="merge-field">[${fallback}]</span>`;

export const digitalSikkerhetConfig: GeneratorConfig = {
  id: "digital-sikkerhet",
  title: "Digital Sikkerhet (DIGIS)",
  subtitle: "Sikkerhetsrutiner, passordpolicy, MFA og hendelseshåndtering",
  documentCategory: "HR-DIGIS",
  defaultValues: {
    companyName: "", ceoName: "",
    itContact: "", itEmail: "",
    passwordMinLength: "12",
    passwordExpiry: "90 dager",
    mfaRequired: true,
    vpnProvider: "",
    vpnRequired: true,
    antivirusSolution: "Microsoft Defender for Endpoint",
    patchFrequency: "Automatisk, innen 72 timer",
    backupFrequency: "Daglig",
    backupRetention: "90 dager",
    incidentContact: "IT-ansvarlig",
    incidentEmail: "",
    phishingTrainingFrequency: "Kvartalsvis",
    securityReviewFrequency: "Årlig",
    adoptedDate: "",
  },
  fieldGroups: [
    {
      title: "Bedrift og IT-ansvarlig",
      fields: [
        { id: "companyName", label: "Bedriftsnavn", type: "text" },
        { id: "ceoName", label: "Daglig leder", type: "text" },
        { id: "itContact", label: "IT-ansvarlig", type: "text" },
        { id: "itEmail", label: "IT-support e-post", type: "text" },
      ],
    },
    {
      title: "Tilgang og autentisering",
      fields: [
        { id: "passwordMinLength", label: "Minimum passordlengde", type: "text" },
        { id: "passwordExpiry", label: "Passordutløp", type: "text" },
        { id: "mfaRequired", label: "MFA påkrevd", type: "checkbox", helpText: "Totrinnsverifisering for alle kontoer" },
      ],
    },
    {
      title: "Nettverk og endepunkt",
      fields: [
        { id: "vpnProvider", label: "VPN-løsning", type: "text" },
        { id: "vpnRequired", label: "VPN påkrevd utenfor kontor", type: "checkbox" },
        { id: "antivirusSolution", label: "Endepunktsikkerhet", type: "text" },
        { id: "patchFrequency", label: "Oppdateringsfrekvens", type: "text" },
      ],
    },
    {
      title: "Backup og hendelser",
      fields: [
        { id: "backupFrequency", label: "Backup-frekvens", type: "text" },
        { id: "backupRetention", label: "Backup-oppbevaring", type: "text" },
        { id: "incidentContact", label: "Hendelseskontakt", type: "text" },
        { id: "incidentEmail", label: "Hendelses-e-post", type: "text" },
        { id: "phishingTrainingFrequency", label: "Phishing-opplæring", type: "text" },
        { id: "securityReviewFrequency", label: "Sikkerhetsgjennomgang", type: "text" },
        { id: "adoptedDate", label: "Vedtatt dato", type: "text" },
      ],
    },
  ],
  sections: [
    {
      id: "policy",
      title: "Sikkerhetspolicy og formål",
      content: (form) => `<h2>1. Sikkerhetspolicy og formål</h2>
<p>Denne sikkerhetspolicyen gjelder for alle ansatte, innleide og konsulenter i <strong>${f(form.companyName, "Bedriftsnavn")}</strong> som benytter bedriftens IT-systemer og digitale ressurser.</p>
<h3>Formål</h3>
<ul>
<li>Beskytte bedriftens data, systemer og infrastruktur mot uautorisert tilgang og cybertrusler</li>
<li>Sikre konfidensialitet, integritet og tilgjengelighet av informasjon</li>
<li>Oppfylle regulatoriske krav (GDPR, sikkerhetsloven m.fl.)</li>
<li>Skape en sikkerhetsbevisst kultur</li>
</ul>
<h3>Ansvar</h3>
<p><strong>IT-ansvarlig:</strong> ${f(form.itContact, "IT-ansvarlig")} (${f(form.itEmail, "E-post")})</p>
<p><strong>Overordnet ansvar:</strong> ${f(form.ceoName, "Daglig leder")}</p>
<p>Alle ansatte er ansvarlige for å følge denne policyen og melde fra om sikkerhetshendelser.</p>`,
    },
    {
      id: "passord",
      title: "Passordpolicy",
      content: (form) => `<h2>2. Passordpolicy</h2>
<h3>Krav til passord</h3>
<ul>
<li>Minimum <strong>${f(form.passwordMinLength, "Tegn")} tegn</strong></li>
<li>Skal inneholde store bokstaver, små bokstaver, tall og spesialtegn</li>
<li>Skal IKKE inneholde personlige opplysninger (navn, fødselsdato)</li>
<li>Skal være unikt — ikke gjenbrukes på tvers av tjenester</li>
<li>Endres etter <strong>${f(form.passwordExpiry, "Utløp")}</strong></li>
</ul>
<h3>Passordhåndtering</h3>
<ul>
<li>Passord skal aldri deles med andre, heller ikke IT-support</li>
<li>Passord skal ikke lagres i klartekst (notater, e-post, regneark)</li>
<li>Bruk av godkjent passordmanager anbefales sterkt</li>
<li>Ved mistanke om kompromittert passord: bytt umiddelbart og varsle IT</li>
</ul>`,
    },
    {
      id: "mfa",
      title: "MFA og tilgangsstyring",
      content: (form) => `<h2>3. MFA og tilgangsstyring</h2>
<h3>Totrinnsverifisering (MFA)</h3>
<p>MFA er <strong>${form.mfaRequired ? "påkrevd" : "anbefalt"}</strong> for alle bedriftssystemer, inkludert:</p>
<ul>
<li>E-post og kalender</li>
<li>Skylagring og dokumentsystemer</li>
<li>VPN-tilgang</li>
<li>Admin-paneler og sensitive systemer</li>
<li>Fjernskrivebordsløsninger</li>
</ul>
<h3>Tilgangsstyring</h3>
<ul>
<li><strong>Minste privilegium:</strong> Ansatte gis kun tilgang til systemer og data som er nødvendig for arbeidsoppgavene</li>
<li><strong>Rollebasert tilgang:</strong> Tilganger tildeles basert på rolle/stilling</li>
<li><strong>Gjennomgang:</strong> Tilganger gjennomgås kvartalsvis og ved endring av rolle</li>
<li><strong>Deaktivering:</strong> Tilganger deaktiveres umiddelbart ved opphør av arbeidsforhold</li>
</ul>`,
    },
    {
      id: "endepunkt",
      title: "Endepunktsikkerhet",
      content: (form) => `<h2>4. Endepunktsikkerhet</h2>
<h3>Antivirusløsning</h3>
<p>Alle enheter brukt til arbeidsformål skal ha <strong>${f(form.antivirusSolution, "Løsning")}</strong> installert og aktivt.</p>
<h3>Krav til enheter</h3>
<ul>
<li>Automatisk skjermlås etter 5 minutter uten aktivitet</li>
<li>Diskkryptering (BitLocker/FileVault) aktivert</li>
<li>Brannmur aktivert</li>
<li>Kun godkjent programvare installert</li>
<li>Automatiske oppdateringer aktivert</li>
</ul>
<h3>Mobile enheter</h3>
<ul>
<li>PIN/biometri påkrevd</li>
<li>Mulighet for fjernsletting ved tap/tyveri</li>
<li>Bedriftsdata skal lagres i sikre apper (ikke lokalt)</li>
</ul>`,
    },
    {
      id: "epost-phishing",
      title: "E-post og phishing",
      content: (form) => `<h2>5. E-post og phishing</h2>
<h3>E-postsikkerhet</h3>
<ul>
<li>Klikk aldri på lenker eller vedlegg i mistenkelige e-poster</li>
<li>Verifiser avsenderadressen — ikke stol kun på visningsnavnet</li>
<li>Bruk BCC ved masseutsendelser for å beskytte mottakerlister</li>
<li>Sensitiv informasjon skal krypteres ved sending eksternt</li>
</ul>
<h3>Kjenne igjen phishing</h3>
<ul>
<li>Hastepregede meldinger ("din konto stenges!")</li>
<li>Dårlig grammatikk eller uvanlig formatering</li>
<li>Forespørsler om passord, betalingsinformasjon eller persondata</li>
<li>Lenker som ikke matcher den oppgitte adressen</li>
</ul>
<h3>Rapportering</h3>
<p>Mistenkelige e-poster rapporteres til ${f(form.itContact, "IT-ansvarlig")} (${f(form.itEmail, "E-post")}). Ved klikk på mistenkelig lenke: varsle IT umiddelbart, endre passord og kjør sikkerhetssjekk.</p>
<h3>Opplæring</h3>
<p>Phishing-opplæring og simulerte tester gjennomføres <strong>${f(form.phishingTrainingFrequency, "Frekvens")}</strong>.</p>`,
    },
    {
      id: "nettverk",
      title: "Nettverkssikkerhet",
      content: (form) => `<h2>6. Nettverkssikkerhet</h2>
<h3>VPN</h3>
<p>VPN er <strong>${form.vpnRequired ? "påkrevd" : "anbefalt"}</strong> ved bruk av offentlige nettverk og hjemmekontor.${form.vpnProvider ? ` Løsning: <strong>${form.vpnProvider}</strong>.` : ""}</p>
<h3>Offentlige nettverk</h3>
<ul>
<li>Offentlig Wi-Fi (hoteller, kafeer, fly) skal IKKE brukes for sensitive arbeidsoppgaver uten VPN</li>
<li>Ikke koble til ukjente nettverk eller bruk deling av mobilt hotspot uten VPN</li>
</ul>
<h3>Nettverksregler</h3>
<ul>
<li>Kun godkjente enheter skal kobles til bedriftens interne nettverk</li>
<li>Gjestenettverket er adskilt fra bedriftens produksjonsnettverk</li>
<li>Nettverkstrafikk overvåkes for å oppdage unormal aktivitet</li>
</ul>`,
    },
    {
      id: "oppdateringer",
      title: "Sikkerhetsoppdateringer",
      content: (form) => `<h2>7. Sikkerhetsoppdateringer og backup</h2>
<h3>Oppdateringer</h3>
<p>Sikkerhetsoppdateringer installeres <strong>${f(form.patchFrequency, "Frekvens")}</strong>. Kritiske oppdateringer prioriteres umiddelbart.</p>
<ul>
<li>Operativsystem og nettleser: automatisk oppdatering</li>
<li>Bedriftsapplikasjoner: koordinert av IT</li>
<li>Tredjeparts programvare: sjekkes regelmessig</li>
</ul>
<h3>Backup</h3>
<ul>
<li>Backup gjennomføres <strong>${f(form.backupFrequency, "Frekvens")}</strong></li>
<li>Oppbevares i <strong>${f(form.backupRetention, "Tid")}</strong></li>
<li>Backup testes regelmessig for å sikre gjenoppretting</li>
<li>Kryptert lagring av backup</li>
<li>Geografisk adskilt fra produksjonsdata</li>
</ul>`,
    },
    {
      id: "hendelser",
      title: "Hendelseshåndtering",
      content: (form) => `<h2>8. Hendelseshåndtering</h2>
<h3>Hva er en sikkerhetshendelse?</h3>
<ul>
<li>Uautorisert tilgang til systemer eller data</li>
<li>Malware-infeksjon eller ransomware</li>
<li>Tap eller tyveri av utstyr med bedriftsdata</li>
<li>Phishing-angrep som har ført til kompromittering</li>
<li>DDoS-angrep eller systemnedetid</li>
</ul>
<h3>Prosedyre</h3>
<ol>
<li><strong>Oppdage og melde:</strong> Varsle ${f(form.incidentContact, "Kontaktperson")} (${f(form.incidentEmail, "E-post")}) umiddelbart</li>
<li><strong>Isolere:</strong> Koble kompromitterte enheter fra nettverket</li>
<li><strong>Vurdere:</strong> Omfang, alvorlighetsgrad og konsekvenser</li>
<li><strong>Begrense:</strong> Iverksett tiltak for å stoppe/begrense skaden</li>
<li><strong>Gjenopprette:</strong> Gjenopprett systemer fra backup om nødvendig</li>
<li><strong>Dokumentere:</strong> Full hendelseslogg med tidslinje</li>
<li><strong>Evaluere:</strong> Gjennomfør «lessons learned» og oppdater rutiner</li>
</ol>
<p>Dersom hendelsen involverer personopplysninger: se GDPR-rutiner for avvikshåndtering.</p>`,
    },
    {
      id: "opplaering",
      title: "Opplæring og bevisstgjøring",
      content: (form) => `<h2>9. Opplæring og bevisstgjøring</h2>
<h3>Obligatorisk opplæring</h3>
<p>Alle ansatte gjennomfører sikkerhetsopplæring:</p>
<ul>
<li><strong>Ved ansettelse:</strong> Grunnleggende sikkerhetsopplæring inkl. passord, phishing, clean desk</li>
<li><strong>${f(form.phishingTrainingFrequency, "Frekvens")}:</strong> Oppdateringskurs og simulerte phishing-tester</li>
<li><strong>Ved ny trussel:</strong> Ad-hoc informasjon ved aktuelle trusler</li>
</ul>
<h3>Sjekkliste for ansatte</h3>
<ul>
<li>☐ Sterke, unike passord på alle kontoer</li>
<li>☐ MFA aktivert</li>
<li>☐ Skjerm låses ved fravær</li>
<li>☐ Mistenkelige e-poster rapporteres</li>
<li>☐ VPN brukes utenfor kontoret</li>
<li>☐ Sensitiv informasjon deles ikke på usikre kanaler</li>
<li>☐ Clean desk ved arbeidsdagens slutt</li>
</ul>
<h3>Sikkerhetsgjennomgang</h3>
<p>Omfattende sikkerhetsgjennomgang gjennomføres <strong>${f(form.securityReviewFrequency, "Frekvens")}</strong> og inkluderer gjennomgang av policyer, tilganger, hendelser og ny trusselvurdering.</p>`,
    },
    {
      id: "hjemmekontor",
      title: "Hjemmekontor og fjernarbeid",
      content: (form) => `<h2>10. Hjemmekontor og fjernarbeid</h2>
<h3>Sikkerhetskrav ved fjernarbeid</h3>
<ul>
<li>VPN ${form.vpnRequired ? "påkrevd" : "anbefalt"} ved tilkobling til bedriftssystemer</li>
<li>Arbeid på offentlige steder: skjermbeskyttelse og oppmerksomhet</li>
<li>Bedriftens utstyr skal ikke brukes av familiemedlemmer</li>
<li>Utskrifter med sensitiv informasjon makuleres</li>
<li>Konfidensiell informasjon skal ikke diskuteres på offentlige steder</li>
</ul>
<h3>Privat utstyr (BYOD)</h3>
<p>Bruk av privat utstyr for arbeidsformål krever godkjenning fra IT-ansvarlig og overholdelse av sikkerhetskravene i denne policyen.</p>`,
    },
  ],
};
