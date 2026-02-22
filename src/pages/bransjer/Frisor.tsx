import { Users } from "lucide-react";
import BransjePage from "@/components/BransjePage";

const Frisor = () => (
  <BransjePage
    icon={Users}
    name="Frisør & Skjønnhet"
    tagline="Mer tid bak stolen, ikke ved skrivebordet"
    intro="Frisører og andre i skjønnhetsbransjen er eksperter på sitt håndverk — men trenger ikke å bli eksperter på regnskap. Det tar vi oss av, fra A til Å."
    body="Skjønnhetsbransjen har en blanding av ansatte og selvstendige som leier plass, produktsalg ved siden av tjenester, og ofte liten tid til å sette seg inn i regler. Vi håndterer hele kompleksiteten, slik at du kan bruke dagene dine på kunder — ikke papirarbeid."
    deliverables={[
      "Lønnskjøring for ansatte og frilansere",
      "Kontorleie og stolleie regnskap",
      "Riktig avgiftsbehandling av tjenester og produktsalg",
      "Håndtering av tips og skatteplikt",
      "Bokføring og integrering med kassesystem",
      "Dokumentasjon for arbeidsmiljø",
      "Skattemelding og årsregnskap",
      "Lønn og privatuttak for deg som driver alene",
    ]}
    challenges={[
      { title: "Leiemodellene i salongen er ikke alltid rett frem.", desc: "Skillelinjene mellom ansatt og selvstendig som leier plass har mye å si for hvordan lønn og avgifter behandles. Vi setter det opp riktig fra starten." },
      { title: "Tips skal med i regnskapet — de fleste gjør det feil.", desc: "Tips er skattepliktig og skal rapporteres. Vi sørger for at det gjøres riktig, slik at du slipper overraskelser." },
      { title: "Produktsalg og tjenester har ulike avgiftsregler.", desc: "Det du selger over disk og det du gjør bak stolen har forskjellige regler. Vi håndterer begge riktig — uten at det blir din hodepine." },
      { title: "Å vokse fra solo til team endrer alt.", desc: "Fra å drive alene til å ha ansatte og folk som leier plass endrer regnskapsbildet mye. Vi skalerer med deg." },
    ]}
    whyAvargo={[
      { num: "01", title: "Vi forstår hvordan salonger drives.", desc: "Stolleie, produktsalg og tjenester — vi kjenner de ulike måtene å drive på i skjønnhetsbransjen og håndterer dem riktig." },
      { num: "02", title: "Minimal tidsbruk for deg.", desc: "Vi setter opp alt slik at du bruker så lite tid som mulig på økonomi — og mest mulig tid på det du faktisk er god på." },
      { num: "03", title: "Fast pris uansett størrelse.", desc: "Enten du er alene eller har et team, vet du alltid hva du betaler. Ingen overraskelser." },
    ]}
    relatedSlugs={[
      { label: "Helse & Velvære", href: "/bransjer/helse" },
      { label: "Håndverkere & Fagfolk", href: "/bransjer/handverkere" },
    ]}
    ctaHeadline="Vi tar regnskapet. Du tar kunden."
  />
);

export default Frisor;
