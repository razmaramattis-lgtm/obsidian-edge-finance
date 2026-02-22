import { Truck } from "lucide-react";
import BransjePage from "@/components/BransjePage";

const TransportLogistikk = () => (
  <BransjePage
    icon={Truck}
    name="Transport & Logistikk"
    tagline="Vi holder oversikt mens du holder hjulene i gang"
    intro="Transport og logistikk har mange kostnader som skal følges opp — drivstoff, bompenger, vedlikehold og lønn. Vi gir deg den oversikten som trengs for å drive lønnsomt, tur etter tur."
    body="Enten du kjører tungtransport, budbil eller driver lager, krever bransjen din at du vet hva det koster per tur, per bil og per sjåfør. Drivstoffprisene svinger, forsikringene er dyre, og reglene for kjøretid påvirker lønnskostnadene direkte. Vi hjelper deg å forstå hva du faktisk tjener — ikke bare hva du omsetter for."
    deliverables={[
      "Kostnadsoversikt per bil og rute",
      "Drivstoffkostnader og avgiftsoptimalisering",
      "Lønnskjøring med tillegg for diett, overtid og utetid",
      "Bompenger og avgiftsrefusjon ved kjøring i utlandet",
      "Avskrivning og leasing av kjøretøy",
      "Planlegging av pengestrøm ved store investeringer",
      "Skattemelding og årsregnskap",
      "Rapportering og løyvekrav",
    ]}
    challenges={[
      { title: "Drivstoff er den mest uforutsigbare kostnaden.", desc: "Vi gir deg oversikt over faktisk drivstoffkostnad per kilometer og per oppdrag — slik at du kan prise riktig og reagere tidlig." },
      { title: "Lønn med mange tillegg er krevende.", desc: "Diett, nattillegg, overtid og utetillegg skal beregnes riktig. Vi tar oss av det, raskt og korrekt." },
      { title: "Nye biler og utstyr binder opp mye penger.", desc: "Vi hjelper deg med å velge riktig finansiering og behandler det riktig i regnskapet." },
      { title: "Kjøring i utlandet har egne avgiftsregler.", desc: "Vi sørger for at alt behandles riktig og hjelper deg med å få tilbake avgifter du har krav på." },
    ]}
    whyAvargo={[
      { num: "01", title: "Kostnad per kilometer — ikke bare totaltall.", desc: "Vi bryter ned økonomien per bil, per rute og per sjåfør. Det gir deg et beslutningsgrunnlag som faktisk betyr noe." },
      { num: "02", title: "Data hentes inn automatisk.", desc: "Bompenger, drivstoffkort og andre systemer kobles rett inn. Du slipper å registrere noe manuelt." },
      { num: "03", title: "Vi forstår sesongene.", desc: "Transport varierer med årstidene. Vi hjelper med budsjett og pengestrøm som tar høyde for det." },
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
