import { Megaphone } from "lucide-react";
import BransjePage from "@/components/BransjePage";

const MarkedsforingReklame = () => (
  <BransjePage
    href="/bransjer/markedsforing"
    icon={Megaphone}
    name="Markedsføring & Reklame"
    tagline="Du bygger merkevarer — vi bygger bunnlinjen"
    intro="Reklamebyråer, digitalbyråer og markedsføringsselskaper lever av kreativitet og resultater. Vi gir deg oversikt per kunde og per prosjekt som gjør det mulig å vokse uten å miste kontroll."
    body="Markedsføringsbransjen kjører mange prosjekter parallelt, med varierende honorarer og mange frilansere. Lønnsomheten per kunde kan variere enormt, men mange byråer mangler oversikt over hvem som faktisk tjener dem penger. Vi gir deg den innsikten."
    deliverables={[
      "Regnskap per kunde og kampanje",
      "Oversikt over timer og hva som faktisk faktureres",
      "Honorarer og fakturering til frilansere",
      "Annonsekostnader og viderefakturering",
      "Riktig bokføring av faste avtaler og prosjekter",
      "Lønnskjøring for ansatte og frilansere",
      "Årsregnskap og skattemelding",
      "Analyse av hva du tjener per kunde",
    ]}
    challenges={[
      { title: "Vet du hvem som tjener deg penger?", desc: "Vi viser deg hvilke kunder som gir god margin og hvem som koster deg mer enn de betaler." },
      { title: "Annonsekostnader kan rote til tallene.", desc: "Når du legger ut for annonsering og fakturerer videre, må det håndteres riktig. Vi sørger for at det ikke blåser opp omsetningen din kunstig." },
      { title: "Mange frilansere og underleverandører.", desc: "Vi holder styr på alle faktura og fordeler kostnadene riktig per prosjekt." },
      { title: "Faste avtaler og prosjekter krever ulik behandling.", desc: "Vi setter opp regnskapet slik at det reflekterer hvordan du faktisk driver — uansett modell." },
    ]}
    whyAvargo={[
      { num: "01", title: "Kundelønnsomhet i fokus.", desc: "Vi viser deg margin per kunde, per prosjekt og per team — slik at du kan ta bedre beslutninger." },
      { num: "02", title: "Vi forstår byrådrift.", desc: "Uforutsette kostnader, endringer underveis og frilanserhonorarer — vi kjenner utfordringene." },
      { num: "03", title: "Klart for vekst.", desc: "Fra lite byrå til fullservice — vi tilpasser regnskapet til størrelsen og ambisjonene dine." },
    ]}
    relatedSlugs={[
      { label: "Tech & SaaS", href: "/bransjer/tech-saas" },
      { label: "Kultur, Media & Underholdning", href: "/bransjer/kultur" },
      { label: "Consulting & Rådgivning", href: "/bransjer/consulting" },
    ]}
    ctaHeadline="Bygg merkevarer — vi bygger det økonomiske fundamentet."
  />
);

export default MarkedsforingReklame;
