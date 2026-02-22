import { Factory } from "lucide-react";
import BransjePage from "@/components/BransjePage";

const IndustriProduksjon = () => (
  <BransjePage
    icon={Factory}
    name="Industri & Produksjon"
    tagline="Orden i regnskapet gir orden i produksjonen"
    intro="Produksjonsbedrifter har sammensatte kostnader med råvarer, maskinpark, lager og arbeidskraft. Vi gir deg oversikten som gjør det mulig å prise riktig og produsere lønnsomt."
    body="Enten du lager mat, mekaniske deler eller møbler — det som avgjør lønnsomheten er om du vet hva det faktisk koster å produsere. Vi hjelper deg med å forstå kostnaden per enhet, holde kontroll på lageret og utnytte støtteordninger du kanskje ikke vet om."
    deliverables={[
      "Beregning av hva det koster å produsere per enhet",
      "Riktig verdsetting av varer på lager",
      "Avskrivning av maskiner og produksjonsutstyr",
      "Søknad om støtte til forskning og utvikling",
      "Lønnskjøring med skift, overtid og akkord",
      "Analyse av hvordan kostnadene fordeler seg",
      "Årsregnskap og skattemelding",
      "Toll og avgifter ved import og eksport",
    ]}
    challenges={[
      { title: "Vet du hva det faktisk koster å produsere?", desc: "Vi setter opp beregninger som inkluderer alle kostnadene — ikke bare de åpenbare. Slik at du alltid priser riktig." },
      { title: "Verdien av det som ligger på lager påvirker resultatet direkte.", desc: "Riktig lagervurdering er viktig for regnskapet. Vi sørger for at det gjøres korrekt — og at svinn fanges opp." },
      { title: "Maskiner og utstyr binder opp mye kapital.", desc: "Vi hjelper deg å velge hvordan det behandles i regnskapet slik at du får best mulig skatteeffekt." },
      { title: "Import og eksport har egne regler.", desc: "Vi sørger for at all dokumentasjon er i orden og at avgiftene behandles riktig." },
    ]}
    whyAvargo={[
      { num: "01", title: "Vi forstår produksjonsøkonomi.", desc: "Råvarer, arbeidskraft og faste kostnader — vi setter opp oversikter som gir deg full kontroll." },
      { num: "02", title: "Vi finner støtteordninger for deg.", desc: "Produksjonsbedrifter har ofte rett på offentlig støtte for utvikling. Vi hjelper deg med søknader og dokumentasjon." },
      { num: "03", title: "Rapporter som gir mening for deg.", desc: "Vi leverer tall tilpasset det du driver med — ikke generiske regnskapsrapporter som ingen forstår." },
    ]}
    relatedSlugs={[
      { label: "Bygg & Anlegg", href: "/bransjer/bygg-anlegg" },
      { label: "Transport & Logistikk", href: "/bransjer/transport" },
      { label: "Energi & Miljø", href: "/bransjer/energi" },
    ]}
    ctaHeadline="Presis kostnadskontroll gjør deg konkurransedyktig — vi gir deg den."
  />
);

export default IndustriProduksjon;
