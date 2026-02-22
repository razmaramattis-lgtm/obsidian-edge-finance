import { Leaf } from "lucide-react";
import BransjePage from "@/components/BransjePage";

const EnergiMiljo = () => (
  <BransjePage
    href="/bransjer/energi"
    icon={Leaf}
    name="Energi & Miljø"
    tagline="Bærekraftig økonomi for bærekraftige selskaper"
    intro="Solenergi, gjenvinning, avfallshåndtering og miljøteknologi. Du jobber med fremtidens løsninger — vi sørger for at økonomien holder tritt med ambisjonene."
    body="Energi- og miljøbransjen vokser raskt, men krever store investeringer og det tar tid før pengene kommer tilbake. Offentlig støtte og tilskudd er ofte avgjørende for å lykkes. Vi hjelper deg å holde styr på alt dette og bygge en økonomi som er like bærekraftig som det du gjør."
    deliverables={[
      "Analyse av investeringer og tilbakebetalingstid",
      "Søknad om offentlig støtte og tilskudd",
      "Avskrivning av anlegg og utstyr",
      "Regnskap per prosjekt eller installasjon",
      "Avgiftsbehandling for energi og miljøtjenester",
      "Bærekraftsrapportering",
      "Årsregnskap og skattemelding",
      "Planlegging av pengestrøm ved store investeringer",
    ]}
    challenges={[
      { title: "Store investeringer med lang tilbakebetalingstid.", desc: "Vi hjelper deg med analyser og planer som gir deg kontroll over den langsiktige økonomien." },
      { title: "Støtte og tilskudd er avgjørende — men krevende.", desc: "Det finnes mange muligheter for støtte, men alle har egne krav. Vi hjelper med hele prosessen." },
      { title: "Regelverket er i stadig endring.", desc: "Vi holder oss oppdatert og sørger for at regnskapet ditt alltid reflekterer gjeldende regler." },
      { title: "Investorer og kunder forventer bærekraftsrapportering.", desc: "Vi hjelper deg med å legge grunnlaget for den rapporteringen som forventes." },
    ]}
    whyAvargo={[
      { num: "01", title: "Investeringsanalyse.", desc: "Vi hjelper deg å vurdere lønnsomheten i prosjekter — inkludert støtte, avskrivninger og driftskostnader over tid." },
      { num: "02", title: "Vi kjenner støtteordningene.", desc: "Offentlige tilskudd og støtte — vi vet hva som finnes og hjelper deg gjennom hele prosessen." },
      { num: "03", title: "Fremtidsrettet regnskap.", desc: "Vi bygger et regnskap som ikke bare ser bakover, men som gir deg grunnlag for å planlegge fremover." },
    ]}
    relatedSlugs={[
      { label: "Industri & Produksjon", href: "/bransjer/industri" },
      { label: "Bygg & Anlegg", href: "/bransjer/bygg-anlegg" },
      { label: "Tech & SaaS", href: "/bransjer/tech-saas" },
    ]}
    ctaHeadline="Bærekraftige ambisjoner fortjener bærekraftig økonomi."
  />
);

export default EnergiMiljo;
