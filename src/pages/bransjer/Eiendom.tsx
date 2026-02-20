import { Building2 } from "lucide-react";
import BransjePage from "@/components/BransjePage";

const Eiendom = () => (
  <BransjePage
    icon={Building2}
    name="Eiendom & Utvikling"
    tagline="Oversikt fra kjøp til salg"
    intro="Enten du eier én leilighet eller en hel portefølje av nærings- og boligeiendom, hjelper vi deg å ha full kontroll over hva du tjener, hva det koster — og hvordan du kan gjøre det smartere."
    body="Eiendomsbransjen kjennetegnes av komplekse transaksjonsstrukturer, skatteregler som avhenger av formål og eierstruktur, og behovet for nøyaktig prosjektøkonomi. Vi håndterer alt fra enkel utleieøkonomi til avansert konsernstruktur med holdingselskaper, SPV-er og utbyggingsprosjekter."
    deliverables={[
      "Løpende bokføring for utleievirksomhet",
      "Prosjektregnskap for utbyggingsprosjekter",
      "MVA på eiendom (justeringsregler)",
      "Skatt ved kjøp, salg og utleie",
      "Holdingstruktur og aksjonærrapportering",
      "Finansiell rapportering til långivere og investorer",
      "Avskrivning av eiendomsmasse",
      "Tomteselskaper og ANS/KS-regnskap",
    ]}
    challenges={[
      { title: "MVA-justeringsreglene er en felle for de fleste.", desc: "Feil håndtering av MVA ved kjøp, salg eller endret bruk av fast eiendom kan gi store etterberegninger. Vi kjenner justeringsreglene og sikrer compliance." },
      { title: "Skatten ved salg avhenger av strukturen.", desc: "Selger du aksjer eller eiendom? Skattekonsekvensene er fundamentalt forskjellige. Vi hjelper deg å strukturere riktig — lenge før et salg er aktuelt." },
      { title: "Prosjektøkonomi krever løpende oppfølging.", desc: "Koster et utbyggingsprosjekt det det skal? Vi setter opp prosjektregnskap som gir deg kontroll på budsjett, fakturering og fortjenesteprojeksjon i sanntid." },
      { title: "Porteføljestyring uten oversikt er risikofylt.", desc: "Vi gir deg et dashbord over hele eiendomsporteføljen — leieinntekter, driftskostnader, finansieringsgrad og nettoavkastning per eiendom." },
    ]}
    whyAvargo={[
      { num: "01", title: "Dyp eiendomsskattekunnskap.", desc: "Vi kjenner fritaksmetoden, gevinstbeskatning, utleierens fradragsrett og holdingstrukturenes skattefordeler. Det er ikke noe du trenger å lære oss." },
      { num: "02", title: "Skreddersydd for porteføljeeiere.", desc: "Fra én utleiebolig til 50 selskaper i et konsern — vi skalerer leveransen etter porteføljens kompleksitet." },
      { num: "03", title: "Sanntidsoversikt over hele porteføljen.", desc: "Se avkastning, likviditet og skatteposisjon per eiendom og per selskap — oppdatert i sanntid, uten å vente på kvartalsmøtet." },
    ]}
    relatedSlugs={[
      { label: "Holding & Investering", href: "/bransjer/holding" },
      { label: "Bygg & Anlegg", href: "/bransjer/bygg-anlegg" },
    ]}
    ctaHeadline="Full kontroll over porteføljen — fra kjøp til salg."
  />
);

export default Eiendom;
