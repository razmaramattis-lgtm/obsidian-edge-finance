import { UserPlus } from "lucide-react";
import BransjePage from "@/components/BransjePage";

const BemanningRekruttering = () => (
  <BransjePage
    icon={UserPlus}
    name="Bemanning & Rekruttering"
    tagline="Du finner folkene — vi ordner tallene"
    intro="Bemanningsbyråer og rekrutteringsselskaper håndterer mange ansatte, mange kunder og stramme marginer. Vi gir deg kontroll over hva du faktisk tjener per person og per oppdrag."
    body="I bemanningsbransjen jobber de ansatte dine hos andre. Det betyr mange ulike lønnssatser, fakturering basert på timer og marginer som varierer fra kontrakt til kontrakt. Vi hjelper deg å holde oversikt over hva du faktisk sitter igjen med per person og per kunde."
    deliverables={[
      "Lønnskjøring med ulike satser per oppdrag",
      "Oversikt over lønnsomhet per kontrakt og kunde",
      "Fakturering basert på timeregistrering",
      "Innrapportering til myndighetene",
      "Beregning av alle arbeidsgiverkostnader",
      "Oppfølging av kontrakter og marginer",
      "Årsregnskap og skattemelding",
      "Planlegging av pengestrøm ved vekst",
    ]}
    challenges={[
      { title: "Mange ansatte med ulike avtaler.", desc: "Ulike satser, tillegg og bonus gjør at lønnskjøringen krever presisjon. Vi tar oss av det." },
      { title: "Hva du faktisk tjener per person er nøkkeltallet.", desc: "Vi gir deg oversikt over hva du sitter igjen med per utleid person — etter alle kostnader." },
      { title: "Du betaler lønn før du mottar betaling.", desc: "Vi hjelper deg med å planlegge pengeflyten og finne gode løsninger for finansiering." },
      { title: "Reglene for utleie av arbeidskraft er strenge.", desc: "Likebehandlingsregler og dokumentasjonskrav — vi hjelper deg å holde deg innenfor lovverket." },
    ]}
    whyAvargo={[
      { num: "01", title: "Margin per person.", desc: "Vi viser deg hva du faktisk tjener per utleid person — slik at du kan optimalisere satsene og porteføljen." },
      { num: "02", title: "Effektiv lønnskjøring i stort volum.", desc: "Enten du har 20 eller 200 utleide, kjører vi lønn korrekt og effektivt." },
      { num: "03", title: "Støtte i vekstfasen.", desc: "Vi hjelper deg med pengestrøm og finansiering — slik at vekst ikke knekker kontantstrømmen." },
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
