import { Scale } from "lucide-react";
import BransjePage from "@/components/BransjePage";

const JuridiskAdvokat = () => (
  <BransjePage
    icon={Scale}
    name="Juridisk & Advokat"
    tagline="Du håndterer juss — vi håndterer regnskapet"
    intro="Advokatfirmaer og juridiske rådgivere har strenge krav til klientmidler, timeføring og fakturering. Vi gir deg et regnskap som er like presist som dine juridiske argumenter."
    body="Advokatbransjen har unike krav til regnskapsføring — spesielt rundt håndtering av klientmidler, som krever egne kontoer og streng dokumentasjon. I tillegg er timebasert fakturering normen, noe som gjør det viktig å koble timeregistrering til regnskap. Vi forstår disse kravene og leverer et regnskap som tilfredsstiller Tilsynsrådet for advokatvirksomhet."
    deliverables={[
      "Klientmiddelregnskap etter advokatforskriften",
      "Timeregistrering koblet til fakturering",
      "Partnerlønninger og overskuddsdeling",
      "MVA på juridiske tjenester",
      "Rapportering per saksområde og partner",
      "Lønnskjøring for ansatte advokater og fullmektiger",
      "Årsregnskap og skattemelding",
      "Rapportering til Tilsynsrådet",
    ]}
    challenges={[
      { title: "Klientmidler krever streng kontroll.", desc: "Penger som tilhører klienter skal holdes adskilt fra firmaets midler. Vi setter opp et klientmiddelregnskap som tilfredsstiller alle krav." },
      { title: "Timebasert fakturering er kjernen i inntektene.", desc: "Vi integrerer timeregistreringssystemet med regnskapet slik at du får full oversikt over fakturerbar tid og realisering." },
      { title: "Partnere har ulike kompensasjonsmodeller.", desc: "Fast lønn, overskuddsdeling eller en kombinasjon — vi håndterer det sømløst." },
      { title: "Rapportering til Tilsynsrådet.", desc: "Årlig rapportering til Tilsynsrådet stiller krav til regnskapets innhold. Vi sikrer at alt er på plass." },
    ]}
    whyAvargo={[
      { num: "01", title: "Klientmiddelkompetanse.", desc: "Vi har erfaring med advokatforskriftens krav til klientmidler og sikrer at du alltid er compliant." },
      { num: "02", title: "Realiseringsgrad og lønnsomhet.", desc: "Vi rapporterer på fakturerbar tid vs. brukt tid, realisering per sak og lønnsomhet per partner." },
      { num: "03", title: "Diskresjon og presisjon.", desc: "Vi forstår at advokatbransjen krever konfidensialitet og nøyaktighet. Regnskapet vårt reflekterer dette." },
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
