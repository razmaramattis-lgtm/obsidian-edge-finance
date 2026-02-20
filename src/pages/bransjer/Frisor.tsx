import { Users } from "lucide-react";
import BransjePage from "@/components/BransjePage";

const Frisor = () => (
  <BransjePage
    icon={Users}
    name="Frisør & Skjønnhet"
    tagline="Mer tid bak stolen, ikke ved skrivebordet"
    intro="Frisører og andre i skjønnhetsbransjen er eksperter på sitt håndverk — men trenger ikke å bli eksperter på regnskap. Det tar vi oss av, fra A til Å."
    body="Skjønnhetsbransjen er preget av blanding av ansatte og selvstendig næringsdrivende (kabinleie/stolleie), produktsalg ved siden av tjenesteyting, og ofte liten tid til å sette seg inn i regnskapsregler. Vi håndterer hele kompleksiteten, slik at du kan bruke dagene dine på kunder — ikke skrivebordsarbeid."
    deliverables={[
      "Lønnskjøring for ansatte og frilansere",
      "Kabinleie og stolleie-regnskap",
      "Produktsalg og MVA (tjeneste vs. vare)",
      "Tips-håndtering og skatteplikt",
      "Bokføring og kasseintegrasjon",
      "HMS og arbeidsmiljødokumentasjon",
      "Skattemelding og årsregnskap",
      "Privatuttak og lønn for enkeltpersonforetak",
    ]}
    challenges={[
      { title: "Kabinleie og stolleie er ikke ansettelse — men det er komplekst.", desc: "Skillelinjene mellom ansatt, oppdragstaker og kabinleiende er kritisk for korrekt lønns- og MVA-behandling. Vi setter opp strukturen riktig fra starten." },
      { title: "Tips er skattepliktig — men behandles feil av de fleste.", desc: "Tips skal med i lønnen og rapporteres til skattemyndighetene. Vi sikrer korrekt behandling slik at du ikke risikerer etterberegning ved bokettersyn." },
      { title: "Blanding av produkt- og tjenestesalg skaper MVA-kompleksitet.", desc: "Hårbehandling og hårproduktene du selger i butikken har ulike MVA-regler. Vi håndterer begge riktig — uten at det blir din hodepine." },
      { title: "Vekst fra solo til team krever system.", desc: "Fra å drive alene til å ha tre ansatte og to kabinleiere endrer regnskapsbildet dramatisk. Vi skalerer leveransen i takt med selskapet ditt." },
    ]}
    whyAvargo={[
      { num: "01", title: "Vi forstår bransjemodellen.", desc: "Kabinleie, stolleie, produktsalg og tjenesteyting — vi kjenner de ulike forretningsmodellene i skjønnhetsbransjen og håndterer dem korrekt." },
      { num: "02", title: "Minimal tidsbruk for deg.", desc: "Vi setter opp automatiserte løsninger som gjør at du bruker så lite tid som mulig på økonomi — og mest mulig tid på det du faktisk er god på." },
      { num: "03", title: "Fast pris uansett størrelse.", desc: "Enten du er alene eller har et team, vet du alltid hva du betaler. Ingen overraskelser, ingen timefakturering." },
    ]}
    relatedSlugs={[
      { label: "Helse & Velvære", href: "/bransjer/helse" },
      { label: "Håndverkere & Fagfolk", href: "/bransjer/handverkere" },
    ]}
    ctaHeadline="Vi tar regnskapet. Du tar kunden."
  />
);

export default Frisor;
