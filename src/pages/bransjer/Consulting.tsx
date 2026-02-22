import { Briefcase } from "lucide-react";
import BransjePage from "@/components/BransjePage";

const Consulting = () => (
  <BransjePage
    href="/bransjer/consulting"
    icon={Briefcase}
    name="Consulting & Rådgivning"
    tagline="Mer tid til det du er best på"
    intro="Konsulenter jobber gjerne alene eller i små team, og hverdagen er full av prosjekter, kunder og fakturering. Vi tar oss av alt det administrative, slik at du kan bruke tiden din på det du faktisk er god på."
    body="Som konsulent ser det kanskje enkelt ut på overflaten, men det skjuler seg mye å holde styr på — hvordan inntekter fra ulike prosjekter skal bokføres, hva som lønner seg å ta ut som lønn kontra utbytte, og om du kanskje burde ha et holdingselskap. Vi hjelper deg å se mulighetene."
    deliverables={[
      "Løpende bokføring og fakturahåndtering",
      "Riktig bokføring av prosjektinntekter",
      "MVA-rapportering og årsoppgjør",
      "Planlegging av lønn og utbytte",
      "Vurdering av selskapsstruktur",
      "Pensjonsordninger tilpasset deg",
      "Reise- og diettgodtgjørelse",
      "Skatteoptimalisering gjennom hele året",
    ]}
    challenges={[
      { title: "Lønn kontra utbytte — ikke så enkelt som det høres ut.", desc: "Balansen mellom hva du tar ut som lønn og hva du tar som utbytte har stor innvirkning på total skatt. Riktig planlegging kan spare deg for mye hvert år." },
      { title: "Fakturering og bokføring kan komme ut av takt.", desc: "Prosjekter som går over flere måneder, forskuddsbetaling og variabel fakturering — vi sørger for at alt havner i riktig periode." },
      { title: "Pensjon er undervurdert av mange som driver for seg selv.", desc: "Du har andre pensjonsregler enn vanlige ansatte. Vi hjelper deg å velge riktig ordning og få mest mulig igjen." },
      { title: "Et holdingselskap kan spare deg for mye.", desc: "Mange konsulenter driver gjennom ett selskap uten å vite at en annen struktur kan være mye smartere. Vi vurderer hva som er best for deg." },
    ]}
    whyAvargo={[
      { num: "01", title: "Vi forstår hverdagen din.", desc: "Variabel inntekt, prosjektbasert fakturering og behovet for å ha penger i reserve — vi kjenner mønsteret og planlegger deretter." },
      { num: "02", title: "Skatteplanlegging gjennom hele året.", desc: "Ikke bare ved skattemeldingen. Vi følger opp jevnlig og gjør grep når det har mest effekt." },
      { num: "03", title: "Alltid tilgjengelig for raske spørsmål.", desc: "Som konsulent tar du ofte beslutninger raskt. Du skal kunne ringe oss og få svar med en gang." },
    ]}
    relatedSlugs={[
      { label: "Tech & SaaS", href: "/bransjer/tech-saas" },
      { label: "Holding & Investering", href: "/bransjer/holding" },
    ]}
    ctaHeadline="Fokuser på kundene dine. Vi tar resten."
  />
);

export default Consulting;
