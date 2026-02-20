import { Globe } from "lucide-react";
import BransjePage from "@/components/BransjePage";

const TechSaas = () => (
  <BransjePage
    icon={Globe}
    name="Tech & SaaS"
    tagline="Vi vokser i takt med deg"
    intro="Teknologiselskaper beveger seg raskt — og det skal vi også. Vi forstår hvordan en startup fungerer, fra de første kundene til du begynner å tenke på vekst, investorer og internasjonale markeder."
    body="Tech-selskaper har egne regnskapsmessige utfordringer: aktivering av utviklingskostnader, inntektsføring av abonnementer (ASC 606 / IFRS 15), R&D-fradrag og EMI-opsjoner for ansatte. Vi kjenner hele spekteret — fra enkel bokføring for nyoppstartede til kompleks konsernrapportering for scaleups som forbereder seg på en investeringsrunde."
    deliverables={[
      "Løpende bokføring og MVA-rapportering",
      "MRR/ARR-rapportering og SaaS-metrikker",
      "Aktivering av utviklingskostnader (IAS 38)",
      "R&D-fradrag og Skattefunn-søknad",
      "Opsjonsbasert avlønning (EMI/Warrant)",
      "Investorpakke og due diligence-støtte",
      "Internasjonalt MVA (EU VAT, OSS)",
      "Skattemelding og aksjonærregisteroppgave",
    ]}
    challenges={[
      { title: "Inntektsføring av abonnement er ikke trivielt.", desc: "SaaS-inntekter skal periodiseres korrekt over abonnementsperioden. Feil her påvirker resultat, skatt og investorrapportering. Vi sikrer at det gjøres riktig fra dag én." },
      { title: "Skattefunn kan gi deg hundretusener tilbake.", desc: "Mange tech-selskaper kvalifiserer for Skattefunn, men søker aldri. Vi identifiserer aktiviteter som kvalifiserer og håndterer hele søknadsprosessen." },
      { title: "Investorer krever presis finansiell rapportering.", desc: "Styrekonklusjoner, cap table, månedlige MI-pakker og prognoser — vi produserer dokumentasjonen som gjør investordialogen smidig og troverdig." },
      { title: "Internasjonal ekspansjon skaper MVA-kaos.", desc: "Selger du til kunder i EU? Da har du MVA-plikter du kanskje ikke er klar over. Vi sørger for compliance på tvers av landegrenser fra dag én." },
    ]}
    whyAvargo={[
      { num: "01", title: "Regnskapsfører som forstår produktet ditt.", desc: "Du slipper å forklare hva SaaS er, hva churn betyr, eller hvorfor utviklingskostnader skal aktiveres. Vi vet det allerede." },
      { num: "02", title: "AI-drevet innsikt i sanntid.", desc: "MRR-trend, likviditetsposisjon og skatteposisjon — tilgjengelig i sanntid, alltid oppdatert, uten at du trenger å lage rapporter selv." },
      { num: "03", title: "Skalerer med deg.", desc: "Fra bootstrapped til Series A — vi tilpasser leveransen etter hva selskapet ditt faktisk trenger i den fasen det er i." },
    ]}
    quote={{ text: "Vi byttet fra et tradisjonelt byrå. Etter tre måneder hadde Avargo spart oss 340 000 kr i skatt vi ikke visste vi betalte for mye av.", author: "CEO, Nordisk SaaS-selskap" }}
    relatedSlugs={[
      { label: "Holding & Investering", href: "/bransjer/holding" },
      { label: "Consulting & Rådgivning", href: "/bransjer/consulting" },
    ]}
    ctaHeadline="Regnskapet ditt skal holde tritt med veksten."
  />
);

export default TechSaas;
