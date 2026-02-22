import { ShoppingCart } from "lucide-react";
import BransjePage from "@/components/BransjePage";

const Varehandel = () => (
  <BransjePage
    href="/bransjer/varehandel"
    icon={ShoppingCart}
    name="Varehandel"
    tagline="Alltid kontroll på varene og pengene"
    intro="Butikk er mer enn salg — det handler om innkjøp, lager, svinn og marginer. Vi hjelper deg å forstå hva som faktisk lønner seg å selge, og gir deg et klart bilde av hvordan bedriften din går."
    body="I varehandel er det avgjørende å vite hva varene faktisk koster deg, holde styr på lageret og ha kontroll på pengeflyten — spesielt rundt innkjøp og sesonger. Vi hjelper deg med regnskap som gir deg innsikt du faktisk kan bruke, ikke bare tall som samler støv."
    deliverables={[
      "Oversikt over lagerverdier og varekostnad",
      "Analyse av marginer per produktkategori",
      "Kontroll på kassedifferanser",
      "MVA-rapportering og årsoppgjør",
      "Budsjettering for innkjøp og sesonger",
      "Registrering av svinn og avvik",
      "Automatisk henting av data fra bank",
      "Skattemelding og lønnskjøring",
    ]}
    challenges={[
      { title: "Vet du hvilke produkter som faktisk tjener penger?", desc: "Vi setter opp rapportering som viser deg hva som gir god margin og hva som spiser opp fortjenesten din." },
      { title: "Innkjøp og innbetaling kommer sjelden samtidig.", desc: "Du betaler for varene nå, men pengene fra kundene kommer senere. Uten god planlegging kan en god sesong paradoksalt nok skape problemer." },
      { title: "Kasseavvik er sjelden tilfeldige.", desc: "Regelmessige forskjeller i kassa tyder på noe. Vi hjelper deg å finne mønsteret og lage bedre rutiner." },
      { title: "Sesongene styrer alt.", desc: "Julehandel, sommerens lavtrafikk og kampanjer skaper svingninger i pengeflyten. Vi budsjetterer slik at du er forberedt." },
    ]}
    whyAvargo={[
      { num: "01", title: "Vi forstår butikkdrift.", desc: "Innkjøp, lager, marginer og svinn — vi rapporterer på det som faktisk betyr noe for deg som driver butikk." },
      { num: "02", title: "Kassesystem og nettbutikk kobles rett inn.", desc: "Salgsdata hentes automatisk inn i regnskapet. Ingen manuell overføring, ingen forsinkelse." },
      { num: "03", title: "Vi hjelper deg å vokse lønnsomst mulig.", desc: "Vi bokfører ikke bare — vi hjelper deg å forstå hvilke produkter og kanaler som gir best avkastning." },
    ]}
    relatedSlugs={[
      { label: "Nettbutikk & E-commerce", href: "/bransjer/nettbutikk" },
      { label: "Restaurant & Uteliv", href: "/bransjer/restaurant" },
    ]}
    ctaHeadline="Oversikt over hver krone inn og ut av butikken."
  />
);

export default Varehandel;
