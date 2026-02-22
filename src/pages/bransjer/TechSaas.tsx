import { Globe } from "lucide-react";
import BransjePage from "@/components/BransjePage";

const TechSaas = () => (
  <BransjePage
    icon={Globe}
    name="Tech & SaaS"
    tagline="Vi vokser i takt med deg"
    intro="Teknologiselskaper beveger seg raskt — og det skal vi også. Vi forstår hvordan en startup fungerer, fra de første kundene til du begynner å tenke på vekst, investorer og internasjonale markeder."
    body="Tech-selskaper har egne utfordringer i regnskapet: Hvordan skal utviklingskostnader behandles? Hva med inntekter fra abonnementer som løper over tid? Har du rett på skattefradrag for forskning og utvikling? Vi kjenner hele bildet — fra enkel bokføring for nyoppstartede til rapportering som investorer faktisk stoler på."
    deliverables={[
      "Løpende bokføring og MVA-rapportering",
      "Rapportering på løpende inntekter og veksttall",
      "Riktig behandling av utviklingskostnader i regnskapet",
      "Søknad om skattefradrag for forskning og utvikling",
      "Håndtering av aksjebasert avlønning til ansatte",
      "Klargjøring av tall for investorer og due diligence",
      "MVA ved salg til utenlandske kunder",
      "Skattemelding og aksjonærregisteroppgave",
    ]}
    challenges={[
      { title: "Abonnementsinntekter skal fordeles riktig over tid.", desc: "Når kunder betaler for et helt år av gangen, kan du ikke bare bokføre alt med en gang. Vi sørger for at det gjøres riktig fra dag én — det påvirker både resultat og skatt." },
      { title: "Du kan ha rett på hundretusener i skattefradrag.", desc: "Mange tech-selskaper kvalifiserer for offentlige støtteordninger uten å vite om det. Vi finner ut hva du har krav på og hjelper deg med hele søknadsprosessen." },
      { title: "Investorer forventer tall de kan stole på.", desc: "Styrereferater, eieroversikt, månedlige rapporter og prognoser — vi produserer dokumentasjonen som gjør investorsamtalen enkel og troverdig." },
      { title: "Salg til utlandet kan gi avgiftsplikter du ikke er klar over.", desc: "Selger du til kunder i andre land? Da kan det hende du har plikter du ikke vet om. Vi holder styr på reglene slik at du slipper å gjøre det." },
    ]}
    whyAvargo={[
      { num: "01", title: "Vi snakker samme språk som deg.", desc: "Du slipper å forklare forretningsmodellen din fra bunnen av. Vi forstår hvordan tech-selskaper fungerer og hva som er viktig for deg." },
      { num: "02", title: "Oppdatert oversikt — alltid.", desc: "Inntektsvekst, kontantbeholdning og skatteposisjon — tilgjengelig i sanntid, uten at du trenger å lage rapporter selv." },
      { num: "03", title: "Vokser med deg.", desc: "Fra du starter alene til du har et helt team — vi tilpasser det vi leverer etter hva du faktisk trenger akkurat nå." },
    ]}
    relatedSlugs={[
      { label: "Holding & Investering", href: "/bransjer/holding" },
      { label: "Consulting & Rådgivning", href: "/bransjer/consulting" },
    ]}
    ctaHeadline="Regnskapet ditt skal holde tritt med veksten."
  />
);

export default TechSaas;
