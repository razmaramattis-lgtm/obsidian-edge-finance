import { Heart } from "lucide-react";
import BransjePage from "@/components/BransjePage";

const Helse = () => (
  <BransjePage
    href="/bransjer/helse"
    icon={Heart}
    name="Helse & Velvære"
    tagline="Fokuser på menneskene du hjelper"
    intro="Klinikker, treningssentre og helseforetak har nok å tenke på med kunder og pasienter. Vi ordner det økonomiske i bakgrunnen, slik at du kan gi full oppmerksomhet til dem du er der for."
    body="Helsebransjen har egne regler for hva som er avgiftsfritt og ikke, strenge krav til personvern, og driftsmodeller som varierer enormt — fra en som jobber alene til større klinikker med mange ansatte og leiekontrakter. Vi tar oss av alt det økonomiske, slik at du slipper å bruke tid på det."
    deliverables={[
      "Riktig håndtering av avgiftsfritak for helsetjenester",
      "Lønnskjøring for alle typer ansatte",
      "Fakturering mot det offentlige og private betalere",
      "Håndtering av sykefravær og arbeidsgiverperiode",
      "Oversikt over leiekontrakter og lokalkostnader",
      "Pensjon og forsikringer for ansatte",
      "Skattemelding og årsregnskap",
    ]}
    challenges={[
      { title: "Ikke alle helsetjenester er avgiftsfrie.", desc: "Det er ikke alltid opplagt hva som er fritatt for avgift og hva som ikke er det. Feil her kan koste deg dyrt i etterkant. Vi kjenner reglene og sørger for at alt er riktig." },
      { title: "Refusjoner fra det offentlige krever nøyaktighet.", desc: "Feil i dokumentasjonen kan føre til at du ikke får pengene du har krav på. Vi hjelper deg å sette opp gode rutiner for dette." },
      { title: "Lønn i helsebransjen har mange tillegg.", desc: "Vaktordninger, kvelds- og helgetillegg og kompetansekrav gjør at lønnskjøring krever mer enn vanlig. Vi håndterer det for deg." },
      { title: "Utstyr og inventar skal behandles riktig i regnskapet.", desc: "Stort utstyr har egne regler for hvordan det føres i regnskapet. Vi hjelper deg å velge riktig fremgangsmåte." },
    ]}
    whyAvargo={[
      { num: "01", title: "Vi kjenner reglene som gjelder for deg.", desc: "Avgiftsfritak, offentlige refusjoner og lønnsstrukturene i helsebransjen er noe vi har jobbet med mange ganger. Du slipper å forklare." },
      { num: "02", title: "Minst mulig tid på administrasjon.", desc: "Vi setter opp alt slik at du bruker så lite tid som mulig på økonomi — og mest mulig tid på dem du er der for." },
      { num: "03", title: "Tilpasset din størrelse.", desc: "Enten du jobber alene eller driver en klinikk med mange ansatte — vi tilpasser det vi leverer til din hverdag." },
    ]}
    relatedSlugs={[
      { label: "Frisør & Skjønnhet", href: "/bransjer/frisor" },
      { label: "Consulting & Rådgivning", href: "/bransjer/consulting" },
    ]}
    ctaHeadline="La oss ta det administrative. Du fokuserer på pasientene."
  />
);

export default Helse;
