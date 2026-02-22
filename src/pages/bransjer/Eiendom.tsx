import { Building2 } from "lucide-react";
import BransjePage from "@/components/BransjePage";

const Eiendom = () => (
  <BransjePage
    icon={Building2}
    name="Eiendom & Utvikling"
    tagline="Oversikt fra kjøp til salg"
    intro="Enten du eier én leilighet eller en hel portefølje av eiendommer, hjelper vi deg å ha full kontroll over hva du tjener, hva det koster — og hvordan du kan gjøre det smartere."
    body="Eiendom har sine egne regler for skatt og avgifter som avhenger av hva du bruker eiendommen til og hvordan du eier den. Vi håndterer alt fra enkel utleieøkonomi til avansert struktur med flere selskaper og utbyggingsprosjekter."
    deliverables={[
      "Løpende bokføring for utleie",
      "Regnskap per utbyggingsprosjekt",
      "Riktig avgiftsbehandling ved kjøp, salg og utleie",
      "Skatteplanlegging rundt eiendomstransaksjoner",
      "Selskapsstruktur og rapportering til eiere",
      "Rapportering til banker og investorer",
      "Riktig behandling av verdifall på eiendommer",
      "Årsregnskap og skattemelding",
    ]}
    challenges={[
      { title: "Avgiftsreglene ved eiendom er en vanlig felle.", desc: "Feil håndtering av avgifter ved kjøp, salg eller endret bruk kan gi store etterberegninger. Vi kjenner reglene og holder deg trygg." },
      { title: "Skatten ved salg avhenger av hvordan du eier.", desc: "Selger du aksjer eller eiendom? Konsekvensene er helt forskjellige. Vi hjelper deg å tenke riktig — lenge før et salg er aktuelt." },
      { title: "Utbyggingsprosjekter krever løpende oppfølging.", desc: "Koster prosjektet det det skal? Vi gir deg kontroll på budsjett og fremdrift underveis, ikke bare i etterkant." },
      { title: "Mange eiendommer uten oversikt er risikofylt.", desc: "Vi gir deg et samlet bilde — leieinntekter, driftskostnader, gjeld og avkastning per eiendom." },
    ]}
    whyAvargo={[
      { num: "01", title: "Vi kjenner skattereglene for eiendom godt.", desc: "Hvordan du eier, hvem som eier og hva du gjør med eiendommen — alt påvirker skatten. Vi vet hva som gjelder." },
      { num: "02", title: "Tilpasset for deg som eier mye.", desc: "Fra én utleiebolig til mange selskaper — vi tilpasser det vi leverer etter hvor komplekst det er." },
      { num: "03", title: "Oversikt i sanntid.", desc: "Se avkastning, likviditet og skatteposisjon per eiendom — oppdatert hele tiden, uten å vente på et møte." },
    ]}
    relatedSlugs={[
      { label: "Holding & Investering", href: "/bransjer/holding" },
      { label: "Bygg & Anlegg", href: "/bransjer/bygg-anlegg" },
    ]}
    ctaHeadline="Full kontroll over porteføljen — fra kjøp til salg."
  />
);

export default Eiendom;
