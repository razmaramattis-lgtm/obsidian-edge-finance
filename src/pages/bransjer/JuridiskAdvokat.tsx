import { Scale } from "lucide-react";
import BransjePage from "@/components/BransjePage";

const JuridiskAdvokat = () => (
  <BransjePage
    icon={Scale}
    name="Juridisk & Advokat"
    tagline="Du håndterer juss — vi håndterer regnskapet"
    intro="Advokatfirmaer har egne krav til hvordan penger håndteres — spesielt klientenes penger. Vi gir deg et regnskap som er like presist og ryddig som arbeidet du selv gjør."
    body="Advokater håndterer ofte klienters penger som skal holdes helt adskilt fra firmaets egne midler. I tillegg er det vanlig å fakturere basert på timer, og mange firmaer har partnere med ulike lønnsmodeller. Vi forstår disse behovene og leverer et regnskap som oppfyller alle kravene — uten at du trenger å tenke på det."
    deliverables={[
      "Regnskap for klientmidler som holdes adskilt",
      "Kobling mellom timeregistrering og fakturering",
      "Lønn og overskuddsdeling for partnere",
      "MVA på juridiske tjenester",
      "Rapportering per saksområde og partner",
      "Lønnskjøring for ansatte",
      "Årsregnskap og skattemelding",
      "Rapportering til tilsynsmyndigheter",
    ]}
    challenges={[
      { title: "Klientenes penger krever streng kontroll.", desc: "Penger som tilhører klienter skal aldri blandes med firmaets egne. Vi setter opp alt slik at det er ryddig og i tråd med alle krav." },
      { title: "Timer er kjernen i inntektene.", desc: "Vi kobler timeregistreringen din med regnskapet slik at du alltid ser hvor mye tid som er fakturert og hva som gjenstår." },
      { title: "Partnere har ulike avtaler.", desc: "Fast lønn, overskuddsdeling eller en kombinasjon — vi håndterer det sømløst uansett modell." },
      { title: "Årlig rapportering til tilsynet.", desc: "Det er krav til hva regnskapet skal inneholde for tilsynet. Vi sørger for at alt er på plass." },
    ]}
    whyAvargo={[
      { num: "01", title: "Vi kjenner kravene.", desc: "Håndtering av klientmidler og de spesielle reglene for advokatfirmaer er noe vi har god erfaring med." },
      { num: "02", title: "Oversikt over lønnsomheten.", desc: "Vi viser deg hva du faktisk tjener per sak og per partner — slik at du kan ta bedre beslutninger." },
      { num: "03", title: "Grundighet og diskresjon.", desc: "Vi forstår at bransjen din krever nøyaktighet og fortrolighet. Regnskapet vårt reflekterer det." },
    ]}
    relatedSlugs={[
      { label: "Consulting & Rådgivning", href: "/bransjer/consulting" },
      { label: "Eiendom & Utvikling", href: "/bransjer/eiendom" },
      { label: "Holding & Investering", href: "/bransjer/holding" },
    ]}
    ctaHeadline="Presist regnskap for en bransje som krever presisjon."
  />
);

export default JuridiskAdvokat;
