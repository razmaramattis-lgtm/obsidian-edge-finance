import { Film } from "lucide-react";
import BransjePage from "@/components/BransjePage";

const KulturMedia = () => (
  <BransjePage
    icon={Film}
    name="Kultur, Media & Underholdning"
    tagline="Kreativiteten er din — økonomien er vår"
    intro="Film, musikk, forlag, kunst og events. Kulturbransjen har uforutsigbare inntekter, prosjektbasert økonomi og mange som jobber sammen på ulike måter. Vi gir deg den økonomiske roen du trenger for å skape."
    body="Mange i kulturbransjen har en blanding av prosjektinntekter, royalties, honorarer og offentlig støtte. Pengene kommer sjelden jevnt, men kostnadene gjør det. Vi hjelper deg med alt fra søknader om støtte til å holde oversikt over hva du faktisk tjener på hvert prosjekt."
    deliverables={[
      "Regnskap per produksjon, prosjekt eller utgivelse",
      "Håndtering av royalties og rettighetsinntekter",
      "Hjelp med søknader om offentlig støtte",
      "Avgiftsregler som gjelder for kunst og kultur",
      "Honorarer og fakturering til frilansere",
      "Planlegging av pengestrøm mellom prosjekter",
      "Skattemelding og årsregnskap",
      "Rapportering til de som gir deg støtte",
    ]}
    challenges={[
      { title: "Inntektene er uforutsigbare.", desc: "Vi hjelper deg med planlegging som tar høyde for at pengene kommer i bølger — slik at du alltid kan dekke de faste kostnadene." },
      { title: "Søknader om støtte er tidkrevende.", desc: "Det finnes mange støtteordninger, men alle har egne krav. Vi hjelper med søknader, rapportering og regnskapskrav." },
      { title: "Avgiftsreglene i kulturbransjen er sammensatte.", desc: "Noe kan være fritatt, noe har redusert sats, og noe har full avgift. Vi sørger for at alt behandles riktig." },
      { title: "Mange samarbeidspartnere betyr mye å holde styr på.", desc: "Kontrakter, honorarer og avtaler krever god oversikt. Vi holder orden på hvem som skal ha hva." },
    ]}
    whyAvargo={[
      { num: "01", title: "Prosjektøkonomi som gir oversikt.", desc: "Vi bryter ned økonomien per prosjekt eller utgivelse — slik at du ser hva som lønner seg." },
      { num: "02", title: "Vi kjenner støtteordningene.", desc: "Vi vet hva som kreves for å søke og rapportere — og hjelper deg gjennom hele prosessen." },
      { num: "03", title: "Vi forstår den kreative hverdagen.", desc: "Du trenger en regnskapsfører som skjønner at pengene ikke kommer hver 14. dag — og planlegger deretter." },
    ]}
    relatedSlugs={[
      { label: "Markedsføring & Reklame", href: "/bransjer/markedsforing" },
      { label: "Utdanning & Kurs", href: "/bransjer/utdanning" },
      { label: "Consulting & Rådgivning", href: "/bransjer/consulting" },
    ]}
    ctaHeadline="Skap fritt — vi holder orden på tallene."
  />
);

export default KulturMedia;
