import { GraduationCap } from "lucide-react";
import BransjePage from "@/components/BransjePage";

const UtdanningKurs = () => (
  <BransjePage
    href="/bransjer/utdanning"
    icon={GraduationCap}
    name="Utdanning & Kurs"
    tagline="Du lærer bort — vi holder orden"
    intro="Kursarrangører, private skoler, nettbaserte plattformer og coaching. Du deler kunnskap — vi sørger for at økonomien din er like solid som det du kan."
    body="Utdanningsbransjen spenner fra fysiske kurs og seminarer til digitale plattformer og en-til-en-veiledning. Inntektene kan komme fra deltakere, bedriftsavtaler, offentlig støtte eller abonnementer. Det som gjør det ekstra viktig å ha oversikt er at noe undervisning har andre avgiftsregler enn vanlig tjenesteyting."
    deliverables={[
      "Regnskap per kurs, arrangement eller program",
      "Vurdering av avgiftsregler for undervisning",
      "Honorar og fakturering til foredragsholdere",
      "Offentlige tilskudd og støtte",
      "Abonnementsinntekter og nettbasert læring",
      "Lønnskjøring for deltids- og frilansundervisere",
      "Årsregnskap og skattemelding",
      "Rapportering per fagområde",
    ]}
    challenges={[
      { title: "Avgiftsreglene for undervisning er ikke rett frem.", desc: "Noen typer undervisning er fritatt for avgift, andre ikke. Vi vurderer hva som gjelder for deg og sørger for at det gjøres riktig." },
      { title: "Inntektene svinger med kurskalenderen.", desc: "Vi hjelper deg med planlegging som tar høyde for at pengene kommer i puljer — ikke jevnt gjennom året." },
      { title: "Mange eksterne foredragsholdere og underleverandører.", desc: "Honorarer, reisekostnader og fakturering til andre krever god oversikt. Vi holder orden." },
      { title: "Digital og fysisk levering har ulike kostnader.", desc: "Vi gir deg innsikt i hva som lønner seg best — nettbasert eller i klasserommet." },
    ]}
    whyAvargo={[
      { num: "01", title: "Lønnsomhet per kurs.", desc: "Vi viser deg hva du faktisk sitter igjen med per kurs, program eller arrangement." },
      { num: "02", title: "Vi kjenner avgiftsreglene.", desc: "Vi vet hva som gjelder for undervisning og sørger for at du verken betaler for mye eller for lite." },
      { num: "03", title: "Tilpasset ditt volum.", desc: "Enten du holder 5 eller 500 kurs i året, tilpasser vi oss." },
    ]}
    relatedSlugs={[
      { label: "Consulting & Rådgivning", href: "/bransjer/consulting" },
      { label: "Kultur, Media & Underholdning", href: "/bransjer/kultur" },
      { label: "Tech & SaaS", href: "/bransjer/tech-saas" },
    ]}
    ctaHeadline="Del kunnskapen din — vi tar eksamen i regnskapet."
  />
);

export default UtdanningKurs;
