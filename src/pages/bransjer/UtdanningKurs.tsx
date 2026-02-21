import { GraduationCap } from "lucide-react";
import BransjePage from "@/components/BransjePage";

const UtdanningKurs = () => (
  <BransjePage
    icon={GraduationCap}
    name="Utdanning & Kurs"
    tagline="Du lærer bort — vi holder orden"
    intro="Kursarrangører, private skoler, e-læringsplattformer og undervisningsbyråer. Du deler kunnskap — vi sørger for at økonomien din er like solid som fagkunnskapen din."
    body="Utdanningsbransjen omfatter alt fra fysiske kurs og seminarer til digitale plattformer og coaching. Inntektene kan komme fra kursdeltakere, bedriftsavtaler, offentlige tilskudd eller abonnementer. MVA-reglene er spesielt relevante — undervisning kan være fritatt eller avgiftspliktig avhengig av type. Vi hjelper deg å navigere dette og maksimere lønnsomheten."
    deliverables={[
      "Kursregnskap per arrangement eller program",
      "MVA-vurdering (fritatt vs. avgiftspliktig undervisning)",
      "Honorar og fakturering til foredragsholdere",
      "Tilskudd og offentlig støtte",
      "Abonnementsinntekter og e-læring",
      "Lønnskjøring for deltids- og frilansundervisere",
      "Årsregnskap og skattemelding",
      "Rapportering per kursområde",
    ]}
    challenges={[
      { title: "MVA-fritaket for undervisning er komplekst.", desc: "Noe undervisning er MVA-fritatt, annet ikke. Vi vurderer din virksomhet og sikrer korrekt MVA-behandling." },
      { title: "Inntektene svinger med kurskalenderen.", desc: "Vi hjelper deg med likviditetsplanlegging som tar høyde for at inntektene kommer i puljer — ikke jevnt." },
      { title: "Mange underleverandører og foredragsholdere.", desc: "Honorarer, reisekostnader og fakturering til eksterne krever god oversikt. Vi holder orden." },
      { title: "Digital versus fysisk levering.", desc: "E-læring og fysiske kurs har ulike kostnadsstrukturer. Vi gir deg innsikt i lønnsomheten per kanal." },
    ]}
    whyAvargo={[
      { num: "01", title: "Lønnsomhet per kurs.", desc: "Vi setter opp rapportering som viser deg faktisk resultat per kurs, program eller arrangement." },
      { num: "02", title: "MVA-ekspertise.", desc: "Vi kjenner reglene for MVA-fritak i undervisning og sikrer at du verken betaler for mye eller for lite." },
      { num: "03", title: "Skalerbar økonomi.", desc: "Enten du holder 5 eller 500 kurs i året, tilpasser vi regnskapet til volumet ditt." },
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
