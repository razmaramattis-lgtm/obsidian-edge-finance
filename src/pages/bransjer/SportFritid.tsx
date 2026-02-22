import { Dumbbell } from "lucide-react";
import BransjePage from "@/components/BransjePage";

const SportFritid = () => (
  <BransjePage
    icon={Dumbbell}
    name="Sport & Fritid"
    tagline="Fokus på trening — vi tar tallene"
    intro="Treningssentre, idrettsklubber, sportsutstyr og friluftsaktiviteter. Bransjen lever av abonnementer, medlemskap og sesongsalg. Vi gir deg den oversikten som lar deg fokusere på det du elsker."
    body="Sport- og fritidsbransjen har ofte en blanding av abonnementsinntekter, personlige timer, varesalg og arrangementer. Pengeflyten varierer med sesongen — januar er boom, sommeren er stille. Vi hjelper deg å forstå hva du tjener per tjeneste og per medlem."
    deliverables={[
      "Oversikt over medlemsinntekter og abonnementer",
      "Personlige timer og tjenesteinntekter",
      "Varelager og utstyrssalg",
      "Lønnskjøring for deltidsansatte og instruktører",
      "Riktig avgiftsbehandling av trening vs. varesalg",
      "Sesongbudsjettering",
      "Årsregnskap og skattemelding",
      "Støtteordninger og avgiftskompensasjon for frivillige",
    ]}
    challenges={[
      { title: "Medlemstallene svinger gjennom året.", desc: "Januar er topp, men de faste kostnadene løper hele tiden. Vi planlegger slik at du er forberedt på lavsesongen." },
      { title: "Mange jobber deltid eller som frilansere.", desc: "Instruktører, trenere og sesongansatte gjør at lønnskjøringen krever litt ekstra. Vi tar oss av det." },
      { title: "Trening og varesalg har ulike avgiftsregler.", desc: "Vi sørger for at alt bokføres riktig uten at du trenger å tenke på det." },
      { title: "Utstyr og lokaler koster mye.", desc: "Vi hjelper med å behandle investeringene riktig i regnskapet slik at du får mest mulig igjen." },
    ]}
    whyAvargo={[
      { num: "01", title: "Vi gir deg tallene som betyr noe.", desc: "Hvor mange som slutter, hva du tjener per medlem og hva det koster per kvadratmeter — tall som faktisk hjelper deg." },
      { num: "02", title: "Sesongplanlegging.", desc: "Vi bygger budsjetter som reflekterer at januar og september er annerledes enn juni." },
      { num: "03", title: "Støtteordninger for frivillige.", desc: "Idrettsklubber og frivillige kan ha rett på avgiftskompensasjon. Vi hjelper med søknaden." },
    ]}
    relatedSlugs={[
      { label: "Helse & Velvære", href: "/bransjer/helse" },
      { label: "Frisør & Skjønnhet", href: "/bransjer/frisor" },
      { label: "Reiseliv & Turisme", href: "/bransjer/reiseliv" },
    ]}
    ctaHeadline="Hold fokus på treningen — vi tar de tunge løftene i regnskapet."
  />
);

export default SportFritid;
