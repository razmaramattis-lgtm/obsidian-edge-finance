import { UserPlus } from "lucide-react";
import BransjePage from "@/components/BransjePage";

const BemanningRekruttering = () => (
  <BransjePage
    icon={UserPlus}
    name="Bemanning & Rekruttering"
    tagline="Du finner folkene — vi ordner tallene"
    intro="Bemanningsbyråer og rekrutteringsselskaper håndterer mange ansatte, mange kunder og stramme marginer. Vi gir deg økonomisk kontroll per oppdrag og per utleid ressurs."
    body="Bemanningsbransjen er unik fordi dine ansatte jobber hos andre. Det betyr kompleks lønnskjøring med ulike satser per oppdrag, fakturering basert på timer, og marginer som varierer fra kontrakt til kontrakt. Vi hjelper deg med å holde oversikt over faktisk lønnsomhet per utleid person og per kunde — og med å sikre at lønnskjøringen alltid er korrekt."
    deliverables={[
      "Lønnskjøring for innleide med ulike satser",
      "Lønnsomhetsanalyse per kontrakt og kunde",
      "Fakturering basert på timeregistrering",
      "A-melding og innberetning",
      "Arbeidsgiveravgift og sosiale kostnader",
      "Kontraktsoppfølging og marginstyring",
      "Årsregnskap og skattemelding",
      "Likviditetsplanlegging ved vekst",
    ]}
    challenges={[
      { title: "Mange ansatte med ulike lønnsvilkår.", desc: "Ulike satser per oppdrag, overtid, tillegg og bonus gjør lønnskjøringen svært kompleks. Vi håndterer det med presisjon." },
      { title: "Marginen per person er nøkkeltallet.", desc: "Vi gir deg rapportering som viser faktisk margin per utleid ressurs — inkludert alle sosiale kostnader." },
      { title: "Likviditeten presses ved vekst.", desc: "Du betaler lønn før du mottar betaling fra kunden. Vi hjelper med likviditetsprognose og finansieringsløsninger." },
      { title: "Regelverket for utleie er strengt.", desc: "Likebehandlingsregler, innleieregler og dokumentasjonskrav — vi hjelper deg å holde deg innenfor lovverket." },
    ]}
    whyAvargo={[
      { num: "01", title: "Margin per hode.", desc: "Vi rapporterer på faktisk lønnsomhet per utleid person — slik at du kan optimalisere kundeporteføljen og satsene dine." },
      { num: "02", title: "Effektiv lønnskjøring i volum.", desc: "Enten du har 20 eller 200 utleide, kjører vi lønn korrekt og effektivt med alle tillegg og innberetninger." },
      { num: "03", title: "Vekststøtte.", desc: "Vi hjelper deg med likviditetsplanlegging, factoring-vurderinger og finansiering — slik at vekst ikke knekker kontantstrømmen." },
    ]}
    relatedSlugs={[
      { label: "Renhold & Facility", href: "/bransjer/renhold" },
      { label: "Bygg & Anlegg", href: "/bransjer/bygg-anlegg" },
      { label: "Transport & Logistikk", href: "/bransjer/transport" },
    ]}
    ctaHeadline="Mange ansatte, mange kunder — én oversiktlig økonomi."
  />
);

export default BemanningRekruttering;
