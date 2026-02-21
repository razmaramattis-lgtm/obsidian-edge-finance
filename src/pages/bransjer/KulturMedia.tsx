import { Film } from "lucide-react";
import BransjePage from "@/components/BransjePage";

const KulturMedia = () => (
  <BransjePage
    icon={Film}
    name="Kultur, Media & Underholdning"
    tagline="Kreativiteten er din — økonomien er vår"
    intro="Film, musikk, forlag, kunst og events. Kulturbransjen har uforutsigbare inntekter, prosjektbasert økonomi og komplekse rettighetsstrukturer. Vi gir deg den økonomiske roen du trenger for å skape."
    body="Kulturarbeidere og medieselskaper har ofte en blanding av prosjektinntekter, royalties, honorar og offentlige tilskudd. Inntektene kommer sjelden jevnt, men kostnadene gjør det. Vi hjelper deg med å navigere alt fra tilskuddssøknader til MVA-unntak for kunst og kultur — og med å holde likviditeten stabil mellom prosjektene."
    deliverables={[
      "Prosjektregnskap per produksjon eller utgivelse",
      "Royalty- og rettighetsinntekter",
      "Tilskuddssøknader (Kulturrådet, NFI, etc.)",
      "MVA-unntak for kunst og kultur",
      "Honorar og selvstendig næringsdrivende",
      "Likviditetsplanlegging mellom prosjekter",
      "Skattemelding og årsregnskap",
      "Rapportering til tilskuddsgivere",
    ]}
    challenges={[
      { title: "Inntektene er uforutsigbare.", desc: "Vi hjelper deg med likviditetsplanlegging som tar høyde for at inntektene kommer i bølger — slik at du alltid kan dekke faste kostnader." },
      { title: "Tilskudd og støtteordninger er komplekse.", desc: "Kulturrådet, NFI, regionale fond — vi hjelper deg med søknader, rapportering og regnskapskrav knyttet til offentlig støtte." },
      { title: "MVA i kulturbransjen er et minefelt.", desc: "Kunstnerisk virksomhet kan ha fritak, redusert sats eller full MVA avhengig av type. Vi sikrer korrekt behandling." },
      { title: "Mange samarbeidspartnere og underleverandører.", desc: "Kontrakter, honorarer og rettighetsavtaler krever god oversikt. Vi holder orden på hvem som skal ha hva — og når." },
    ]}
    whyAvargo={[
      { num: "01", title: "Prosjektøkonomi som gir oversikt.", desc: "Vi bryter ned økonomien per prosjekt, produksjon eller utgivelse — slik at du ser hva som lønner seg og hva som tapper ressurser." },
      { num: "02", title: "Tilskuddskompetanse.", desc: "Vi kjenner kravene fra Kulturrådet, NFI og andre tilskuddsgivere — og hjelper deg med rapportering som holder mål." },
      { num: "03", title: "Vi forstår den kreative hverdagen.", desc: "Du trenger en regnskapsfører som forstår at inntektene ikke kommer hver 14. dag — og planlegger deretter." },
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
