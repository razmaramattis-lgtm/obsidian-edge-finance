import { Briefcase } from "lucide-react";
import BransjePage from "@/components/BransjePage";

const Consulting = () => (
  <BransjePage
    icon={Briefcase}
    name="Consulting & Rådgivning"
    tagline="Mer tid til det du er best på"
    intro="Konsulenter jobber gjerne alene eller i små team, og hverdagen er full av prosjekter, kunder og fakturering. Vi tar oss av alt det administrative, slik at du kan bruke tiden din på det du faktisk er god på."
    body="Konsulentvirksomhet er ofte enkel på overflaten, men skjuler kompleksitet i prosjektbasert inntektsføring, timefakturering, selskapsstruktur og skatteplanlegging. Mange konsulenter lar store skattefordeler gå fra seg fordi de ikke har noen til å hjelpe dem se mulighetene — det gjør vi."
    deliverables={[
      "Løpende bokføring og fakturahåndtering",
      "Prosjektbasert inntektsføring",
      "MVA-rapportering og årsoppgjør",
      "Utbytte- og lønnsplanlegging",
      "Holdingstruktur for formuesbeskyttelse",
      "Pensjonsordninger for selvstendig næringsdrivende",
      "Reise- og diettgodtgjørelse",
      "Skatteoptimalisering løpende gjennom året",
    ]}
    challenges={[
      { title: "Optimal lønn vs. utbytte — ikke så enkelt som det høres ut.", desc: "Balansen mellom lønn og utbytte har stor innvirkning på total skatt. For en konsulent som fakturerer høyt, kan riktig planlegging spare hundretusener hvert år." },
      { title: "Fakturering og inntektsføring ut av synk.", desc: "Prosjekter som løper over periodegrenser, forskuddsbetaling og variabel fakturering skaper utfordringer for korrekt inntektsføring. Vi håndterer det riktig." },
      { title: "Pensjon er undervurdert av de fleste selvstendige.", desc: "Selvstendig næringsdrivende og AS-eiere har andre pensjonsregler enn ansatte. Vi hjelper deg å velge riktig ordning og trekke maksimalt fradrag." },
      { title: "Holdingselskapet kan spare deg for mye skatt.", desc: "Mange konsulenter driver gjennom ett selskap uten å tenke på holdingstruktur. Vi vurderer om en holding-struktur er riktig for deg — og setter det opp om det er det." },
    ]}
    whyAvargo={[
      { num: "01", title: "Vi forstår konsulentens økonomi.", desc: "Variabel inntekt, prosjektbasert fakturering og behovet for likviditetsreserve — vi kjenner mønsteret og planlegger deretter." },
      { num: "02", title: "Skatteoptimalisering gjennom hele året.", desc: "Ikke bare ved skattemeldingen. Vi gjennomgår skatteposisjonen kvartalsvis og iverksetter tiltak i riktig tidspunkt." },
      { num: "03", title: "Alltid tilgjengelig for raske spørsmål.", desc: "En konsulent har ofte rask beslutningshorisont. Du skal kunne ringe oss og få svar umiddelbart — ikke vente på neste møte." },
    ]}
    relatedSlugs={[
      { label: "Tech & SaaS", href: "/bransjer/tech-saas" },
      { label: "Holding & Investering", href: "/bransjer/holding" },
    ]}
    ctaHeadline="Fokuser på kundene dine. Vi tar resten."
  />
);

export default Consulting;
