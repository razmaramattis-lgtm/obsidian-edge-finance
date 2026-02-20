import { Heart } from "lucide-react";
import BransjePage from "@/components/BransjePage";

const Helse = () => (
  <BransjePage
    icon={Heart}
    name="Helse & Velvære"
    tagline="Fokuser på menneskene du hjelper"
    intro="Klinikker, treningssentre og helseforetak har nok å tenke på med kunder og pasienter. Vi ordner det økonomiske i bakgrunnen, slik at du kan gi full oppmerksomhet til dem du er der for."
    body="Helsesektoren kjennetegnes av et unikt MVA-regime der mange helsetjenester er fritatt, kombinert med strenge krav til pasientjournaler, personvern og GDPR. I tillegg er driftsmodellene varierte — fra soloterapeuter til større klinikker med ansatte og leiekontrakter."
    deliverables={[
      "MVA-fritak for helsetjenester (mva-loven § 3-2)",
      "Lønnskjøring for helsepersonell",
      "Fakturering mot HELFO og private betalere",
      "Arbeidsgiverperiode ved sykefravær",
      "GDPR-compliant journalhåndtering",
      "Leiekontrakter og lokalkostnader",
      "Pensjon og forsikringer for ansatte",
      "Skattemelding og årsregnskap",
    ]}
    challenges={[
      { title: "MVA-fritak for helsetjenester er ikke selvforklarende.", desc: "Ikke alle tjenester som utføres av helsepersonell er MVA-fritatt. Grensedragningen er kompleks, og feil kan utløse etterberegning. Vi kjenner regelverket." },
      { title: "HELFO-refusjon krever riktig koding og dokumentasjon.", desc: "Feil takst, feil diagnose eller manglende dokumentasjon fører til avvist krav. Vi hjelper deg å sette opp systemer som sikrer korrekt og fullstendig fakturering." },
      { title: "Ansatte helsepersonell har særskilte arbeidsvilkår.", desc: "Vaktordninger, overtid, tillegg for ubekvem arbeidstid og kompetansekrav gjør lønnskjøring i helsesektoren mer kompleks enn i de fleste andre bransjer." },
      { title: "Investeringer i medisinsk utstyr avskrives annerledes.", desc: "Kostbart medisinsk utstyr har egne avskrivningsregler og finansieringsalternativer. Vi hjelper deg å velge riktig avskrivningsplan og finansieringsmodell." },
    ]}
    whyAvargo={[
      { num: "01", title: "Vi kjenner helsesektorens særregler.", desc: "MVA-fritak, HELFO-fakturering og bransjens lønnsstrukturer er ikke ukjent for oss. Du trenger ikke forklare bransjen." },
      { num: "02", title: "Fokus på drift — ikke administrasjon.", desc: "Vi automatiserer og forenkler slik at du bruker minst mulig tid på økonomi og mest mulig tid på pasientene dine." },
      { num: "03", title: "Skreddersydd for alle størrelser.", desc: "Fra soloterapeutens enkle regnskap til en flerlege-klinikk med ansatte og leiekontrakter — vi tilpasser leveransen til din virkelighet." },
    ]}
    relatedSlugs={[
      { label: "Frisør & Skjønnhet", href: "/bransjer/frisor" },
      { label: "Consulting & Rådgivning", href: "/bransjer/consulting" },
    ]}
    ctaHeadline="La oss ta det administrative. Du fokuserer på pasientene."
  />
);

export default Helse;
