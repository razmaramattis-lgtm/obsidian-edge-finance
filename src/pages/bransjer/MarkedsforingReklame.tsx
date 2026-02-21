import { Megaphone } from "lucide-react";
import BransjePage from "@/components/BransjePage";

const MarkedsforingReklame = () => (
  <BransjePage
    icon={Megaphone}
    name="Markedsføring & Reklame"
    tagline="Du bygger merkevarer — vi bygger bunnlinjen"
    intro="Reklamebyråer, digitalbyråer og markedsføringsselskaper lever av kreativitet og resultater. Vi gir deg prosjektregnskap og lønnsomhetsanalyser som gjør det mulig å skalere uten å miste kontroll."
    body="Markedsføringsbransjen er prosjektbasert med mange parallelle oppdrag, varierende honorarer og hyppig bruk av frilansere. Lønnsomheten per kunde kan variere enormt, men mange byråer mangler oversikt over hvem som faktisk tjener dem penger. Vi gir deg den oversikten — og hjelper deg med å bygge en bærekraftig forretningsmodell."
    deliverables={[
      "Prosjektregnskap per kunde og kampanje",
      "Timeregistrering og realisering",
      "Frilanserhonorarer og fakturering",
      "Media spend og gjennomfakturering",
      "Retainer- og prosjektbasert inntektsføring",
      "Lønnskjøring for fast og frilans",
      "Årsregnskap og skattemelding",
      "Kundelønnsomhetsanalyser",
    ]}
    challenges={[
      { title: "Kundelønnsomhet er den viktigste målingen.", desc: "Vi viser deg hvem som tjener deg penger og hvem som koster deg penger — slik at du kan ta bedre beslutninger." },
      { title: "Media spend roter til regnskapet.", desc: "Gjennomfakturering av annonsekostnader til kunder krever korrekt håndtering. Vi sikrer at det ikke blåser opp omsetningen." },
      { title: "Mange frilansere og underleverandører.", desc: "Grafikere, tekstforfattere, fotografer — vi håndterer alle faktura og sikrer at kostnadene fordeles riktig per prosjekt." },
      { title: "Retainer vs. prosjekt — ulik inntektsføring.", desc: "Vi setter opp regnskapet slik at det reflekterer din faktiske forretningsmodell — enten det er retainer, prosjekt eller en mix." },
    ]}
    whyAvargo={[
      { num: "01", title: "Kundelønnsomhet i fokus.", desc: "Vi gir deg rapporter som viser margin per kunde, per prosjekt og per team — slik at du kan optimalisere porteføljen." },
      { num: "02", title: "Vi forstår byrådrift.", desc: "Pitch-kostnader, scope creep og frilanserhonorarer — vi kjenner utfordringene og regnskapsfører deretter." },
      { num: "03", title: "Skaleringsklart regnskap.", desc: "Fra boutique-byrå til fullservice — vi tilpasser regnskapet til størrelsen og ambisjonene dine." },
    ]}
    relatedSlugs={[
      { label: "Tech & SaaS", href: "/bransjer/tech-saas" },
      { label: "Kultur, Media & Underholdning", href: "/bransjer/kultur" },
      { label: "Consulting & Rådgivning", href: "/bransjer/consulting" },
    ]}
    ctaHeadline="Bygg merkevarer — vi bygger det økonomiske fundamentet."
  />
);

export default MarkedsforingReklame;
