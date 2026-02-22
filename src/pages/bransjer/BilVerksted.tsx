import { Car } from "lucide-react";
import BransjePage from "@/components/BransjePage";

const BilVerksted = () => (
  <BransjePage
    icon={Car}
    name="Bil & Verksted"
    tagline="Du fikser bilene — vi fikser regnskapet"
    intro="Bilverksteder, dekkhotell, bilpleie og bilforhandlere. Bransjen har høy omsetning av deler, sesongtopper og krav til dokumentasjon. Vi gir deg regnskapet som holder orden."
    body="I bilbransjen handler lønnsomheten om å vite hva deler koster, hva en time skal koste og hva du faktisk sitter igjen med per jobb. Marginene varierer mye fra oppdrag til oppdrag. Vi hjelper deg å forstå hva som lønner seg — og hva som ikke gjør det."
    deliverables={[
      "Oversikt over deler og innkjøp",
      "Lønnsomhet per jobb",
      "Beregning av riktig timepris",
      "Dekkhotell og sesongbaserte tjenester",
      "Lønnskjøring for mekanikere og andre ansatte",
      "Avskrivning av verkstedutstyr",
      "MVA og skattemelding",
      "Årsregnskap",
    ]}
    challenges={[
      { title: "Deler og dekk binder opp mye penger.", desc: "Vi hjelper deg med å holde kontroll på lageret slik at du ikke binder mer kapital enn nødvendig." },
      { title: "Lønnsomheten varierer mye fra jobb til jobb.", desc: "Vi gir deg oversikt over hva du tjener per oppdrag — slik at du kan prise riktig og prioritere smartere." },
      { title: "Dekkskift-sesongen er hektisk.", desc: "Vi hjelper deg å planlegge bemanning og pengestrøm rundt sesongene." },
      { title: "Dokumentasjonskravene skal være i orden.", desc: "Vi sørger for at alt papirarbeid er på plass." },
    ]}
    whyAvargo={[
      { num: "01", title: "Margin per jobb.", desc: "Vi bryter ned økonomien per oppdrag — deler, timer og faste kostnader — slik at du ser hva som faktisk tjener penger." },
      { num: "02", title: "Kobling mot verkstedsystemet.", desc: "Vi integrerer med systemene dine for automatisk overføring av data." },
      { num: "03", title: "Riktig timepris.", desc: "Vi hjelper deg å beregne en timesats som dekker alle kostnader og gir en fornuftig fortjeneste." },
    ]}
    relatedSlugs={[
      { label: "Transport & Logistikk", href: "/bransjer/transport" },
      { label: "Håndverkere & Fagfolk", href: "/bransjer/handverkere" },
      { label: "Varehandel", href: "/bransjer/varehandel" },
    ]}
    ctaHeadline="Presis økonomi for en bransje som lever av presisjon."
  />
);

export default BilVerksted;
