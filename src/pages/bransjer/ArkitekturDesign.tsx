import { Palette } from "lucide-react";
import BransjePage from "@/components/BransjePage";

const ArkitekturDesign = () => (
  <BransjePage
    href="/bransjer/arkitektur"
    icon={Palette}
    name="Arkitektur & Design"
    tagline="Du tegner fremtiden — vi holder orden bak kulissene"
    intro="Arkitektkontor, designbyråer og interiørarkitekter lever av kreativitet og prosjekter. Vi gir deg økonomisk oversikt per prosjekt — slik at kreativiteten alltid har et solid fundament."
    body="Arkitektur og design handler om prosjekter der timer, underleverandører og endringer underveis gjør det krevende å holde oversikt over hva du faktisk tjener. Vi hjelper deg med regnskap som viser den reelle lønnsomheten — og varsler deg før et prosjekt sklir ut økonomisk."
    deliverables={[
      "Regnskap per oppdrag og prosjektfase",
      "Kobling mellom timeregistrering og prosjekter",
      "Oppfølging av underleverandører og fakturering",
      "Prismodeller og honorarstruktur",
      "Avgiftsbehandling for tjenester i Norge og utlandet",
      "Lønnskjøring for ansatte og frilansere",
      "Årsregnskap og skattemelding",
      "Budsjettering og prognoser per prosjekt",
    ]}
    challenges={[
      { title: "Prosjekter kan vare lenge — og økonomien må følge med.", desc: "Vi setter opp regnskap som håndterer langsiktige prosjekter med fakturering underveis." },
      { title: "Timer er valutaen — men de er vanskelige å følge.", desc: "Vi kobler timeregistreringen din til prosjektregnskapet slik at du ser faktisk tidsbruk mot estimat." },
      { title: "Mange samarbeidspartnere per prosjekt.", desc: "Vi holder orden på alle kostnader — uansett hvor mange som er involvert." },
      { title: "Fastpris eller timepris — hva lønner seg?", desc: "Vi gir deg tallene som hjelper deg å velge riktig prismodell for ulike typer oppdrag." },
    ]}
    whyAvargo={[
      { num: "01", title: "Lønnsomhet per prosjekt — alltid oppdatert.", desc: "Vi viser deg hva du tjener per oppdrag, inkludert egne timer, samarbeidspartnere og uventede kostnader." },
      { num: "02", title: "Fleksibel fakturering.", desc: "Delfakturering, honorar eller etter medgått tid — vi tilpasser oss din måte å jobbe på." },
      { num: "03", title: "Vi forstår kreative bransjer.", desc: "Du vil ikke bruke tid på regnskap. Derfor gjør vi det så enkelt og automatisert som mulig for deg." },
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
