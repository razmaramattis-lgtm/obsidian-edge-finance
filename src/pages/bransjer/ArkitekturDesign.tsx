import { Palette } from "lucide-react";
import BransjePage from "@/components/BransjePage";

const ArkitekturDesign = () => (
  <BransjePage
    icon={Palette}
    name="Arkitektur & Design"
    tagline="Du tegner fremtiden — vi holder orden bak kulissene"
    intro="Arkitektkontor, designbyråer og interiørarkitekter lever av kreativitet og prosjekter. Vi gir deg økonomisk oversikt per prosjekt — slik at kreativiteten alltid har et solid fundament."
    body="Arkitektur og design er prosjektbaserte bransjer der timekostnader, underleverandører og endringskrav gjør det krevende å holde oversikt over lønnsomheten per oppdrag. Vi hjelper deg med prosjektregnskap som viser faktisk margin — og varsler deg før et prosjekt sklir ut økonomisk."
    deliverables={[
      "Prosjektregnskap per oppdrag og fase",
      "Timeregistrering koblet til prosjekter",
      "Underleverandørstyring og fakturering",
      "Honorarstruktur og prismodeller",
      "MVA på tjenester i Norge og utlandet",
      "Lønnskjøring for ansatte og frilansere",
      "Årsregnskap og skattemelding",
      "Budsjettering og prosjektprognoser",
    ]}
    challenges={[
      { title: "Prosjekter kan vare i måneder — eller år.", desc: "Vi setter opp regnskap som håndterer langsiktige prosjekter med delvis fakturering og inntektsføring over tid." },
      { title: "Timer er valutaen — men de er vanskelige å følge.", desc: "Vi kobler timeregistrering til prosjektregnskap slik at du ser faktisk timeforbruk vs. estimat i sanntid." },
      { title: "Mange underleverandører og samarbeid.", desc: "Modellmakere, visualiserere, ingeniører — vi holder orden på alle kostnader per prosjekt." },
      { title: "Honorar vs. fastpris — hva lønner seg?", desc: "Vi gir deg data som hjelper deg å velge riktig prismodell for ulike typer oppdrag." },
    ]}
    whyAvargo={[
      { num: "01", title: "Prosjektmargin i sanntid.", desc: "Vi gir deg løpende oversikt over lønnsomhet per prosjekt — inkludert egne timer, underleverandører og uforutsette kostnader." },
      { num: "02", title: "Fleksibel fakturering.", desc: "Delfakturering, honorar, fastpris eller etter medgått tid — vi tilpasser faktureringen til din forretningsmodell." },
      { num: "03", title: "Vi forstår kreative bransjer.", desc: "Vi vet at en arkitekt ikke vil bruke tid på regnskap. Derfor gjør vi det så enkelt og automatisert som mulig." },
    ]}
    relatedSlugs={[
      { label: "Bygg & Anlegg", href: "/bransjer/bygg-anlegg" },
      { label: "Consulting & Rådgivning", href: "/bransjer/consulting" },
      { label: "Kultur, Media & Underholdning", href: "/bransjer/kultur" },
    ]}
    ctaHeadline="Kreativitet fortjener et solid fundament — vi bygger det."
  />
);

export default ArkitekturDesign;
