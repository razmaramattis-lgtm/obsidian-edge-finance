import type { GeneratorConfig } from "./types";

const f = (v: any, fallback: string) => v || `<span class="merge-field">[${fallback}]</span>`;

export const digitalSikkerhetConfig: GeneratorConfig = {
  id: "digital-sikkerhet",
  title: "Digital Sikkerhet (DIGIS)",
  subtitle: "Sikkerhetsrutiner, passordpolicy, MFA og hendelseshåndtering",
  documentCategory: "HR-DIGIS",
  defaultValues: {
    companyName: "", ceoName: "",
    itContact: "", itEmail: "", itPhone: "",
    ciso: "",
    passwordMinLength: "12",
    passwordExpiry: "90 dager",
    passwordComplexity: "Store/små bokstaver, tall og spesialtegn",
    passwordManager: "Anbefalt",
    mfaRequired: true,
    mfaMethod: "Autentiseringsapp (Microsoft/Google Authenticator)",
    vpnProvider: "",
    vpnRequired: true,
    vpnSplitTunnel: false,
    antivirusSolution: "Microsoft Defender for Endpoint",
    edrSolution: "",
    firewallManaged: true,
    patchFrequency: "Automatisk, innen 72 timer",
    criticalPatchSLA: "24 timer",
    backupFrequency: "Daglig",
    backupRetention: "90 dager",
    backupLocation: "Geografisk adskilt",
    backupEncrypted: true,
    backupTestFrequency: "Kvartalsvis",
    incidentContact: "IT-ansvarlig",
    incidentEmail: "",
    incidentSeverityLevels: "3 (Kritisk, Høy, Normal)",
    ransomwarePolicy: "Ikke betal løsepenger — kontakt IT og politi",
    phishingTrainingFrequency: "Kvartalsvis",
    phishingSimulation: true,
    securityReviewFrequency: "Årlig",
    securityAwarenessOnboarding: true,
    classificationLevels: "Åpen, Intern, Konfidensielt, Strengt konfidensielt",
    usbPolicy: "Blokkert som standard",
    printPolicy: "Følg-meg-utskrift anbefalt",
    byodPolicy: "Krever godkjenning fra IT og overholdelse av sikkerhetskrav",
    cloudStorageApproved: "OneDrive/SharePoint (bedriftskonto)",
    shadowITPolicy: "Ikke tillatt — alle systemer skal godkjennes av IT",
    wifiGuestSeparation: true,
    adoptedDate: "",
  },
  fieldGroups: [
    {
      title: "Bedrift og IT-ansvarlig",
      fields: [
        { id: "companyName", label: "Bedriftsnavn", type: "text", helpText: "Offisielt firmanavn. Policyen gjelder for alle som benytter bedriftens IT-systemer." },
        { id: "ceoName", label: "Daglig leder", type: "text", helpText: "Daglig leder har det overordnede ansvaret for informasjonssikkerhet." },
        { id: "itContact", label: "IT-ansvarlig", type: "text", helpText: "Hovedkontaktperson for IT-relaterte spørsmål, hendelser og godkjenninger." },
        { id: "itEmail", label: "IT-support e-post", type: "text", helpText: "Dedikert e-postadresse for IT-henvendelser og rapportering av sikkerhetshendelser." },
        { id: "itPhone", label: "IT-support telefon", type: "text", helpText: "Telefonnummer til IT-support for hastesaker." },
        { id: "ciso", label: "Sikkerhetsansvarlig (CISO)", type: "text", helpText: "Dedikert sikkerhetsansvarlig (Chief Information Security Officer) dersom bedriften har dette. Ofte IT-ansvarlig i mindre bedrifter." },
      ],
    },
    {
      title: "Tilgang og autentisering",
      fields: [
        { id: "passwordMinLength", label: "Minimum passordlengde", type: "text", helpText: "Minimum antall tegn i passord. NIST anbefaler minimum 12 tegn, helst 14+. Lengde er viktigere enn kompleksitet." },
        { id: "passwordComplexity", label: "Passordkompleksitet", type: "text", helpText: "Krav til passordsammensetning. NIST anbefaler primært lengde, men mange organisasjoner krever også blandede tegn." },
        { id: "passwordExpiry", label: "Passordutløp", type: "text", helpText: "Hvor ofte passord må endres. NIST anbefaler nå å IKKE tvinge regelmessig bytte med mindre mistanke om kompromittering." },
        { id: "passwordManager", label: "Passordmanager", type: "select", options: ["Påkrevd", "Anbefalt", "Valgfritt"], helpText: "Bruk av passordmanager for å lagre og generere sterke, unike passord for alle kontoer." },
        { id: "mfaRequired", label: "MFA påkrevd", type: "checkbox", helpText: "Totrinnsverifisering (MFA/2FA) for alle bedriftskontoer. Sterkt anbefalt — forhindrer >99% av kontoovertak." },
        { id: "mfaMethod", label: "MFA-metode", type: "text", helpText: "Foretrukket MFA-metode. Autentiseringsapp (TOTP) er sikrere enn SMS. Hardware-nøkler (FIDO2) er best." },
      ],
    },
    {
      title: "Nettverk og endepunkt",
      fields: [
        { id: "vpnProvider", label: "VPN-løsning", type: "text", helpText: "Navn på VPN-løsningen som brukes for sikker tilkobling utenfor kontoret." },
        { id: "vpnRequired", label: "VPN påkrevd utenfor kontor", type: "checkbox", helpText: "Om VPN er obligatorisk ved tilgang til bedriftssystemer fra offentlige nettverk eller hjemmekontor." },
        { id: "vpnSplitTunnel", label: "Split-tunnel VPN", type: "checkbox", helpText: "Om VPN bruker split-tunnel (kun bedriftstrafikk via VPN) eller full tunnel (all trafikk). Full tunnel er sikrere." },
        { id: "antivirusSolution", label: "Endepunktsikkerhet", type: "text", helpText: "Antivirus/endepunktsbeskyttelse installert på alle enheter. Bør inkludere sanntidsbeskyttelse og automatisk oppdatering." },
        { id: "edrSolution", label: "EDR-løsning", type: "text", helpText: "Endpoint Detection and Response (EDR) for avansert trusselsdeteksjon. Gir dypere innsikt enn tradisjonelt antivirus." },
        { id: "firewallManaged", label: "Administrert brannmur", type: "checkbox", helpText: "Om bedriften har en administrert/managed brannmur med profesjonell overvåking." },
        { id: "patchFrequency", label: "Oppdateringsfrekvens", type: "text", helpText: "Hvor raskt sikkerhetsoppdateringer installeres. Automatisk innen 72 timer anbefales for de fleste." },
        { id: "criticalPatchSLA", label: "Kritiske oppdateringer SLA", type: "text", helpText: "Hvor raskt kritiske sikkerhetsoppdateringer (CVSS 9+) skal installeres. Anbefalt innen 24 timer." },
        { id: "wifiGuestSeparation", label: "Separert gjestenettverk", type: "checkbox", helpText: "Om gjestenettverket er adskilt fra bedriftens interne nettverk. Påkrevd for sikkerhet." },
      ],
    },
    {
      title: "Backup og gjenoppretting",
      fields: [
        { id: "backupFrequency", label: "Backup-frekvens", type: "text", helpText: "Hvor ofte backup kjøres. Daglig er minimum for forretningskritiske data. Vurder hyppigere for transaksjonsdata." },
        { id: "backupRetention", label: "Backup-oppbevaring", type: "text", helpText: "Hvor lenge backup lagres. Bør være lang nok til å oppdage kompromittering (90 dager+)." },
        { id: "backupLocation", label: "Backup-lokasjon", type: "text", helpText: "Hvor backup lagres. Bør være geografisk adskilt fra produksjonsdata for å beskytte mot lokale katastrofer." },
        { id: "backupEncrypted", label: "Kryptert backup", type: "checkbox", helpText: "Om backup er kryptert. Absolutt anbefalt — ukryptert backup er en sikkerhetsrisiko." },
        { id: "backupTestFrequency", label: "Backup-testing", type: "select", options: ["Månedlig", "Kvartalsvis", "Halvårlig", "Årlig"], helpText: "Hvor ofte backup testes ved faktisk gjenoppretting. En backup som ikke er testet er potensielt verdiløs." },
      ],
    },
    {
      title: "Hendelseshåndtering",
      fields: [
        { id: "incidentContact", label: "Hendelseskontakt", type: "text", helpText: "Hovedkontakt for rapportering av sikkerhetshendelser. Bør ha tilstrekkelig myndighet til å iverksette tiltak." },
        { id: "incidentEmail", label: "Hendelses-e-post", type: "text", helpText: "Dedikert e-postadresse for rapportering av sikkerhetshendelser." },
        { id: "incidentSeverityLevels", label: "Alvorlighetsnivåer", type: "text", helpText: "Antall og beskrivelse av alvorlighetsnivåer for sikkerhetshendelser. Typisk 3-4 nivåer." },
        { id: "ransomwarePolicy", label: "Ransomware-policy", type: "text", helpText: "Bedriftens policy ved ransomware-angrep. Myndigheter anbefaler å IKKE betale løsepenger." },
      ],
    },
    {
      title: "Opplæring og klassifisering",
      fields: [
        { id: "phishingTrainingFrequency", label: "Phishing-opplæring", type: "select", options: ["Månedlig", "Kvartalsvis", "Halvårlig", "Årlig"], helpText: "Hvor ofte ansatte gjennomgår opplæring i å gjenkjenne phishing. Kvartalsvis anbefales." },
        { id: "phishingSimulation", label: "Simulerte phishing-tester", type: "checkbox", helpText: "Om bedriften sender simulerte phishing-e-poster for å teste og trene ansatte. Svært effektivt." },
        { id: "securityAwarenessOnboarding", label: "Sikkerhetsopplæring ved ansettelse", type: "checkbox", helpText: "Om nye ansatte får dedikert sikkerhetsopplæring som del av onboarding." },
        { id: "securityReviewFrequency", label: "Sikkerhetsgjennomgang", type: "select", options: ["Kvartalsvis", "Halvårlig", "Årlig"], helpText: "Hvor ofte det gjennomføres en omfattende gjennomgang av sikkerhetspolicyer, tilganger og hendelser." },
        { id: "classificationLevels", label: "Informasjonsklassifisering", type: "text", helpText: "Nivåer for klassifisering av bedriftsinformasjon. Bestemmer håndtering, lagring og deling." },
      ],
    },
    {
      title: "Policy for utstyr og tjenester",
      fields: [
        { id: "usbPolicy", label: "USB/ekstern lagring", type: "text", helpText: "Policy for bruk av USB-enheter og ekstern lagring. Blokkering anbefales for å hindre datalekkasje og malware." },
        { id: "printPolicy", label: "Utskriftspolicy", type: "text", helpText: "Retningslinjer for utskrift av sensitiv informasjon. Følg-meg-utskrift forhindrer at dokumenter ligger i skriveren." },
        { id: "cloudStorageApproved", label: "Godkjent skylagring", type: "text", helpText: "Hvilke skylagringstjenester som er godkjent for bedriftsdata. Kun bedriftskontoer skal brukes." },
        { id: "shadowITPolicy", label: "Skygge-IT policy", type: "text", helpText: "Policy for uautorisert bruk av IT-tjenester (shadow IT). Alle systemer bør godkjennes av IT for sikkerhet og GDPR." },
        { id: "byodPolicy", label: "BYOD-policy (privat utstyr)", type: "text", helpText: "Retningslinjer for bruk av privateid utstyr til jobbrelaterte oppgaver. Krever ofte godkjenning og sikkerhetsoverholdelse." },
        { id: "adoptedDate", label: "Vedtatt dato", type: "text", helpText: "Dato sikkerhetspolicyen ble vedtatt og trådte i kraft." },
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
<p><strong>IT-ansvarlig:</strong> ${f(form.itContact, "IT-ansvarlig")} (${f(form.itEmail, "E-post")}${form.itPhone ? `, tlf: ${form.itPhone}` : ""})</p>
${form.ciso ? `<p><strong>Sikkerhetsansvarlig (CISO):</strong> ${form.ciso}</p>` : ""}
<p><strong>Overordnet ansvar:</strong> ${f(form.ceoName, "Daglig leder")}</p>
<p>Alle ansatte er ansvarlige for å følge denne policyen og melde fra om sikkerhetshendelser.</p>
<h3>Informasjonsklassifisering</h3>
<p>All bedriftsinformasjon klassifiseres i følgende nivåer: <strong>${f(form.classificationLevels, "Nivåer")}</strong>. Håndtering av informasjon skal tilpasses klassifiseringsnivået.</p>`,
    },
    {
      id: "passord",
      title: "Passordpolicy",
      content: (form) => `<h2>2. Passordpolicy</h2>
<h3>Krav til passord</h3>
<ul>
<li>Minimum <strong>${f(form.passwordMinLength, "Tegn")} tegn</strong></li>
<li>Kompleksitet: ${f(form.passwordComplexity, "Krav")}</li>
<li>Skal IKKE inneholde personlige opplysninger (navn, fødselsdato)</li>
<li>Skal være unikt — ikke gjenbrukes på tvers av tjenester</li>
<li>Endres etter <strong>${f(form.passwordExpiry, "Utløp")}</strong></li>
</ul>
<h3>Passordhåndtering</h3>
<ul>
<li>Passord skal aldri deles med andre, heller ikke IT-support</li>
<li>Passord skal ikke lagres i klartekst (notater, e-post, regneark)</li>
<li>Bruk av passordmanager er <strong>${f(form.passwordManager, "Anbefalt").toLowerCase()}</strong></li>
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
<p><strong>Foretrukket MFA-metode:</strong> ${f(form.mfaMethod, "Metode")}</p>
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
<p>Alle enheter brukt til arbeidsformål skal ha <strong>${f(form.antivirusSolution, "Løsning")}</strong> installert og aktivt.${form.edrSolution ? ` EDR-løsning: <strong>${form.edrSolution}</strong>.` : ""}</p>
<h3>Krav til enheter</h3>
<ul>
<li>Automatisk skjermlås etter 5 minutter uten aktivitet</li>
<li>Diskkryptering (BitLocker/FileVault) aktivert</li>
<li>Brannmur aktivert${form.firewallManaged ? " (administrert)" : ""}</li>
<li>Kun godkjent programvare installert</li>
<li>Automatiske oppdateringer aktivert</li>
<li>USB-enheter: <strong>${f(form.usbPolicy, "Blokkert som standard")}</strong></li>
</ul>
<h3>Mobile enheter</h3>
<ul>
<li>PIN/biometri påkrevd</li>
<li>Mulighet for fjernsletting ved tap/tyveri</li>
<li>Bedriftsdata skal lagres i sikre apper (ikke lokalt)</li>
</ul>
<h3>Utskrift</h3>
<p>${f(form.printPolicy, "Følg-meg-utskrift anbefalt")}. Sensitive dokumenter makuleres etter bruk.</p>`,
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
<p>Phishing-opplæring gjennomføres <strong>${f(form.phishingTrainingFrequency, "Frekvens").toLowerCase()}</strong>.${form.phishingSimulation ? " Simulerte phishing-tester sendes jevnlig for å trene ansatte." : ""}</p>`,
    },
    {
      id: "nettverk",
      title: "Nettverkssikkerhet",
      content: (form) => `<h2>6. Nettverkssikkerhet</h2>
<h3>VPN</h3>
<p>VPN er <strong>${form.vpnRequired ? "påkrevd" : "anbefalt"}</strong> ved bruk av offentlige nettverk og hjemmekontor.${form.vpnProvider ? ` Løsning: <strong>${form.vpnProvider}</strong>.` : ""}${form.vpnSplitTunnel ? " Split-tunnel er aktivert." : " Full tunnel brukes for maksimal sikkerhet."}</p>
<h3>Offentlige nettverk</h3>
<ul>
<li>Offentlig Wi-Fi (hoteller, kafeer, fly) skal IKKE brukes for sensitive arbeidsoppgaver uten VPN</li>
<li>Ikke koble til ukjente nettverk eller bruk deling av mobilt hotspot uten VPN</li>
</ul>
<h3>Nettverksregler</h3>
<ul>
<li>Kun godkjente enheter skal kobles til bedriftens interne nettverk</li>
<li>Gjestenettverket er ${form.wifiGuestSeparation ? "adskilt" : "tilgjengelig men bør adskilles"} fra bedriftens produksjonsnettverk</li>
<li>Nettverkstrafikk overvåkes for å oppdage unormal aktivitet</li>
</ul>
<h3>Skylagring</h3>
<p>Godkjent skylagring: <strong>${f(form.cloudStorageApproved, "Tjeneste")}</strong>. ${f(form.shadowITPolicy, "Skygge-IT er ikke tillatt")}.</p>`,
    },
    {
      id: "oppdateringer",
      title: "Sikkerhetsoppdateringer og backup",
      content: (form) => `<h2>7. Sikkerhetsoppdateringer og backup</h2>
<h3>Oppdateringer</h3>
<p>Sikkerhetsoppdateringer installeres <strong>${f(form.patchFrequency, "Frekvens")}</strong>. Kritiske oppdateringer (CVSS 9+) installeres innen <strong>${f(form.criticalPatchSLA, "24 timer")}</strong>.</p>
<ul>
<li>Operativsystem og nettleser: automatisk oppdatering</li>
<li>Bedriftsapplikasjoner: koordinert av IT</li>
<li>Tredjeparts programvare: sjekkes regelmessig</li>
</ul>
<h3>Backup</h3>
<ul>
<li>Backup gjennomføres <strong>${f(form.backupFrequency, "Frekvens")}</strong></li>
<li>Oppbevares i <strong>${f(form.backupRetention, "Tid")}</strong></li>
<li>Lokasjon: <strong>${f(form.backupLocation, "Lokasjon")}</strong></li>
<li>Backup testes <strong>${f(form.backupTestFrequency, "Frekvens").toLowerCase()}</strong> for å sikre gjenoppretting</li>
<li>${form.backupEncrypted ? "Kryptert lagring av backup" : "Backup bør krypteres"}</li>
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
<h3>Alvorlighetsnivåer</h3>
<p>Hendelser klassifiseres i <strong>${f(form.incidentSeverityLevels, "nivåer")}</strong>.</p>
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
<h3>Ransomware</h3>
<p><strong>${f(form.ransomwarePolicy, "Policy")}</strong></p>
<p>Dersom hendelsen involverer personopplysninger: se GDPR-rutiner for avvikshåndtering.</p>`,
    },
    {
      id: "opplaering",
      title: "Opplæring og bevisstgjøring",
      content: (form) => `<h2>9. Opplæring og bevisstgjøring</h2>
<h3>Obligatorisk opplæring</h3>
<p>Alle ansatte gjennomfører sikkerhetsopplæring:</p>
<ul>
<li><strong>Ved ansettelse:</strong> ${form.securityAwarenessOnboarding ? "Grunnleggende sikkerhetsopplæring inkl. passord, phishing, clean desk" : "Anbefalt sikkerhetsgjennomgang"}</li>
<li><strong>${f(form.phishingTrainingFrequency, "Frekvens")}:</strong> Oppdateringskurs og ${form.phishingSimulation ? "simulerte phishing-tester" : "gjennomgang av trusler"}</li>
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
<li>☐ Kun godkjente skylagringstjenester brukes</li>
</ul>
<h3>Sikkerhetsgjennomgang</h3>
<p>Omfattende sikkerhetsgjennomgang gjennomføres <strong>${f(form.securityReviewFrequency, "Frekvens").toLowerCase()}</strong> og inkluderer gjennomgang av policyer, tilganger, hendelser og ny trusselvurdering.</p>`,
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
<p>${f(form.byodPolicy, "Krever godkjenning fra IT og overholdelse av sikkerhetskrav")}.</p>`,
    },
  ],
};
