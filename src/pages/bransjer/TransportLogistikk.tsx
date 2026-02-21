import { Truck } from "lucide-react";
import BransjePage from "@/components/BransjePage";

const TransportLogistikk = () => (
  <BransjePage
    icon={Truck}
    name="Transport & Logistikk"
    tagline="Vi holder oversikt mens du holder hjulene i gang"
    intro="Transport- og logistikkbransjen har komplekse kostnadsstrukturer med drivstoff, bompenger, vedlikehold og sjåførlønninger. Vi gir deg den økonomiske oversikten som trengs for å drive lønnsomt — mil etter mil."
    body="Enten du kjører tungtransport, budbil eller driver lagerlogistikk, krever bransjen din presis kostnadskontroll per tur, per bil og per sjåfør. Drivstoffkostnader svinger, forsikringspremier er høye, og regelverket rundt kjøre- og hviletid påvirker lønnskostnadene direkte. Vi hjelper deg å forstå den reelle lønnsomheten i driften — ikke bare omsetningen."
    deliverables={[
      "Kostnadskontroll per kjøretøy og rute",
      "Drivstoffregnskap og avgiftsoptimalisering",
      "Lønnskjøring med diett, overtid og utetillegg",
      "Bompenger og utenlandskjøring (MVA-refusjon)",
      "Avskrivning og leasing av kjøretøy",
      "Likviditetsplanlegging ved store investeringer",
      "Skattemelding og årsregnskap",
      "Rapportering til Statens vegvesen og løyvekrav",
    ]}
    challenges={[
      { title: "Drivstoff er den mest volatile kostnaden.", desc: "Vi setter opp rapportering som viser deg faktisk drivstoffkostnad per kilometer og per oppdrag — slik at du kan prise riktig og reagere tidlig." },
      { title: "Lønnskjøring er kompleks med skift og tillegg.", desc: "Diettgodtgjørelse, nattillegg, overtid og utetillegg krever korrekt beregning. Vi håndterer dette korrekt og effektivt." },
      { title: "Store investeringer krever god likviditetsplanlegging.", desc: "Nye kjøretøy og utstyr er kapitalkrevende. Vi hjelper deg med finansieringsvalg, avskrivninger og likviditetsprognoser." },
      { title: "MVA på tvers av landegrenser er krevende.", desc: "Grensekryssende transport har egne MVA-regler. Vi sikrer korrekt behandling og hjelper deg med refusjonskrav i utlandet." },
    ]}
    whyAvargo={[
      { num: "01", title: "Kostnad per kilometer — ikke bare totaltall.", desc: "Vi bryter ned økonomien din per kjøretøy, per rute og per sjåfør. Det gir deg beslutningsgrunnlag som faktisk betyr noe." },
      { num: "02", title: "Automatisert integrasjon med flåtesystemer.", desc: "Data fra bompengeselskaper, drivstoffkort og flåtestyring hentes inn automatisk. Du slipper manuell registrering." },
      { num: "03", title: "Vi forstår sesongsvingningene.", desc: "Transport er sesongavhengig. Vi hjelper deg med kontantstrømstyring og budsjettering som tar høyde for variasjonene." },
    ]}
    relatedSlugs={[
      { label: "Bygg & Anlegg", href: "/bransjer/bygg-anlegg" },
      { label: "Industri & Produksjon", href: "/bransjer/industri" },
      { label: "Varehandel", href: "/bransjer/varehandel" },
    ]}
    ctaHeadline="Presis økonomi gir deg kontroll på veien — vi leverer den."
  />
);

export default TransportLogistikk;
