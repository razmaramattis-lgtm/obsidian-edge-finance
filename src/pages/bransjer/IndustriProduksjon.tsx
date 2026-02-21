import { Factory } from "lucide-react";
import BransjePage from "@/components/BransjePage";

const IndustriProduksjon = () => (
  <BransjePage
    icon={Factory}
    name="Industri & Produksjon"
    tagline="Orden i regnskapet gir orden i produksjonen"
    intro="Produksjonsbedrifter har sammensatte kostnadsbilder med råvarer, maskinpark, lager og arbeidskraft. Vi gir deg kostnadskontroll som gjør det mulig å prise riktig og produsere lønnsomt."
    body="Industri og produksjon stiller krav til nøyaktig varekostberegning, lagerstyring og investeringsplanlegging. Enten du produserer mat, mekaniske deler eller møbler, handler lønnsomhet om å forstå kostprisen per enhet — og å holde den under kontroll. Vi hjelper deg med alt fra kalkulasjonsmodeller til SkatteFUNN-søknader."
    deliverables={[
      "Varekostberegning og kalkulasjonsmodeller",
      "Lagervurdering etter god regnskapsskikk",
      "Avskrivning av maskiner og produksjonsutstyr",
      "SkatteFUNN og innovasjonsstøtte",
      "Lønn med skift, overtid og akkord",
      "Kostnadsfordelingsanalyser",
      "Årsregnskap og skattemelding",
      "Rapportering til tollmyndighetene ved import/eksport",
    ]}
    challenges={[
      { title: "Kostpris per enhet er nøkkelen til lønnsomhet.", desc: "Vi setter opp kalkyler som inkluderer direkte og indirekte kostnader — slik at du alltid vet hva det faktisk koster å produsere." },
      { title: "Lagerverdien påvirker resultatet direkte.", desc: "Korrekt lagervurdering er kritisk for regnskapet. Vi sikrer at lageret verdsettes riktig — og at svinn fanges opp." },
      { title: "Investering i maskinpark binder kapital.", desc: "Vi hjelper deg med avskrivningsplaner, leasingvurderinger og investeringsanalyser som gir deg best mulig skatteeffekt." },
      { title: "Toll og avgifter ved import/eksport.", desc: "Import av råvarer og eksport av ferdige produkter har egne avgiftsregler. Vi sikrer korrekt tolldokumentasjon og MVA-behandling." },
    ]}
    whyAvargo={[
      { num: "01", title: "Vi forstår produksjonskalkylene.", desc: "Direkte materialer, direkte lønn og indirekte kostnader — vi setter opp kostnadsmodeller som gir deg full oversikt." },
      { num: "02", title: "SkatteFUNN og tilskudd.", desc: "Produksjonsbedrifter har ofte rett på offentlige tilskudd og skattefradrag for utvikling. Vi hjelper deg med søknader og dokumentasjon." },
      { num: "03", title: "Rapporter som produksjonsledere forstår.", desc: "Vi leverer nøkkeltall tilpasset produksjonsbransjen — ikke generiske regnskapsrapporter." },
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
