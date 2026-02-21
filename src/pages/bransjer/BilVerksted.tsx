import { Car } from "lucide-react";
import BransjePage from "@/components/BransjePage";

const BilVerksted = () => (
  <BransjePage
    icon={Car}
    name="Bil & Verksted"
    tagline="Du fikser bilene — vi fikser regnskapet"
    intro="Bilverksteder, dekkhotell, bilpleie og bilforhandlere. Bransjen har høy omsetningshastighet på deler, sesongtopper og krav til dokumentasjon. Vi gir deg regnskapet som holder orden."
    body="Bil og verksted er en bransje der varelager, timesatser og deleinnkjøp utgjør kjernen av økonomien. Marginene varierer enormt fra jobb til jobb — et oljeskift gir andre marginer enn en motoroverhaling. Vi hjelper deg med å forstå lønnsomheten per arbeidsordre og per mekaniker, og med å holde kontroll på varelager og innkjøp."
    deliverables={[
      "Varelager og deleinnkjøpsoppfølging",
      "Lønnsomhetsanalyse per arbeidsordre",
      "Timesatskalkyle og prisoppsett",
      "Dekkhotell og sesongbaserte tjenester",
      "Lønnskjøring for mekanikere og servicerådgivere",
      "Avskrivning av verkstedutstyr",
      "MVA og skattemelding",
      "Årsregnskap og perioderegnskap",
    ]}
    challenges={[
      { title: "Varelageret binder mye kapital.", desc: "Deler, dekk og olje — vi hjelper deg med lagerstyring og innkjøpsoptimalisering slik at du ikke binder mer kapital enn nødvendig." },
      { title: "Lønnsomheten varierer enormt per jobb.", desc: "Vi gir deg oversikt over margin per arbeidsordre — slik at du kan prise riktig og prioritere de mest lønnsomme jobbene." },
      { title: "Sesongtopper krever planlegging.", desc: "Dekkskift vår og høst er hektisk. Vi hjelper deg med å planlegge bemanning og likviditet rundt sesongene." },
      { title: "Dokumentasjonskrav ved EU-kontroll.", desc: "Verksteder som utfører EU-kontroll har egne dokumentasjonskrav. Vi sikrer at alt er i orden." },
    ]}
    whyAvargo={[
      { num: "01", title: "Margin per arbeidsordre.", desc: "Vi bryter ned økonomien per jobb — deler, timer og overhead — slik at du ser hva som faktisk tjener penger." },
      { num: "02", title: "Verkstedsystemintegrasjon.", desc: "Vi integrerer med verkstedsystemer for automatisk overføring av faktura- og lagerdata." },
      { num: "03", title: "Timesatskalkyle.", desc: "Vi hjelper deg med å beregne riktig timesats som dekker alle kostnader og gir en fornuftig margin." },
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
