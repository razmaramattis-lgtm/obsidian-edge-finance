import { Leaf } from "lucide-react";
import BransjePage from "@/components/BransjePage";

const EnergiMiljo = () => (
  <BransjePage
    icon={Leaf}
    name="Energi & Miljø"
    tagline="Bærekraftig økonomi for bærekraftige selskaper"
    intro="Solenergi, gjenvinning, avfallshåndtering og miljøteknologi. Du jobber med fremtidens løsninger — vi sørger for at økonomien holder tritt med ambisjonene."
    body="Energi- og miljøbransjen er i rask vekst, men er også kapitalintensiv og regulert. Investeringer i anlegg og teknologi er store, tilbakebetalingstiden kan være lang, og offentlige tilskudd og støtteordninger er ofte avgjørende for lønnsomheten. Vi hjelper deg med å navigere dette landskapet og bygge en bærekraftig økonomi."
    deliverables={[
      "Investeringsanalyser og payback-beregninger",
      "Enova-tilskudd og offentlig støtte",
      "Avskrivning av anlegg og utstyr",
      "Prosjektregnskap per installasjon",
      "MVA på energi og miljøtjenester",
      "ESG-rapportering og bærekraftsregnskap",
      "Årsregnskap og skattemelding",
      "Likviditetsstyring ved store investeringer",
    ]}
    challenges={[
      { title: "Store investeringer med lang tilbakebetalingstid.", desc: "Vi hjelper deg med investeringsanalyser, avskrivningsplaner og likviditetsprognoser som gir deg kontroll over den langsiktige økonomien." },
      { title: "Tilskudd og støtteordninger er avgjørende.", desc: "Enova, Innovasjon Norge og EU-midler — vi hjelper med søknader, rapportering og regnskapskrav for offentlig støtte." },
      { title: "Regulatoriske krav er i endring.", desc: "Miljøregelverket utvikler seg raskt. Vi holder oss oppdatert og sikrer at regnskapet ditt reflekterer gjeldende krav." },
      { title: "ESG-rapportering blir stadig viktigere.", desc: "Investorer og kunder krever bærekraftsrapportering. Vi hjelper deg med å bygge et grunnlag for ESG-rapportering i regnskapet." },
    ]}
    whyAvargo={[
      { num: "01", title: "Investeringsanalyse.", desc: "Vi hjelper deg med å vurdere lønnsomheten i prosjekter — inkludert tilskudd, avskrivninger og driftskostnader over tid." },
      { num: "02", title: "Tilskuddskompetanse.", desc: "Vi kjenner Enova, Innovasjon Norge og andre relevante støtteordninger — og hjelper deg med hele prosessen." },
      { num: "03", title: "Fremtidsrettet regnskap.", desc: "Vi bygger et regnskap som ikke bare rapporterer på fortiden, men gir deg grunnlag for å planlegge fremtiden." },
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
