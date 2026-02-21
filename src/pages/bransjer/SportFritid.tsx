import { Dumbbell } from "lucide-react";
import BransjePage from "@/components/BransjePage";

const SportFritid = () => (
  <BransjePage
    icon={Dumbbell}
    name="Sport & Fritid"
    tagline="Fokus på trening — vi tar tallene"
    intro="Treningssentre, idrettsklubber, sportsutstyr og friluftsaktiviteter. Bransjen lever av abonnementer, medlemskap og sesongsalg. Vi gir deg økonomisk oversikt som lar deg fokusere på det du elsker."
    body="Sport- og fritidsbransjen har ofte en kombinasjon av medlemsinntekter, PT-timer, varesalg og arrangementer. Kontantstrømmen varierer med sesonger — januar er boom, sommeren er stille. Vi hjelper deg med å forstå medlemsøkonomi, churn-rate og faktisk lønnsomhet per tjeneste."
    deliverables={[
      "Medlems- og abonnementsstyring",
      "PT-timer og tjenesteinntekter",
      "Varelager og utstyrssalg",
      "Lønnskjøring for deltidsansatte og instruktører",
      "MVA på trening vs. varesalg",
      "Sesongbudsjettering",
      "Årsregnskap og skattemelding",
      "Tilskudd og momskompensasjon for frivillige",
    ]}
    challenges={[
      { title: "Medlemsinntektene varierer gjennom året.", desc: "Januar er toppsesongen, men de faste kostnadene løper hele året. Vi planlegger likviditeten slik at du aldri blir tatt på sengen." },
      { title: "Mange deltidsansatte og frilansere.", desc: "Instruktører, PT-er og sesongarbeidere gjør lønnskjøringen kompleks. Vi håndterer det effektivt og korrekt." },
      { title: "MVA-satsene er ulike for tjenester og varer.", desc: "Treningstimer og varesalg har ulik MVA-behandling. Vi sikrer at alt bokføres riktig." },
      { title: "Investeringer i utstyr og lokaler.", desc: "Treningsutstyr og lokaleinnredning er kapitalkrevende. Vi hjelper med avskrivninger og finansieringsvalg." },
    ]}
    whyAvargo={[
      { num: "01", title: "Medlemsøkonomi i fokus.", desc: "Vi rapporterer på nøkkeltall som churn-rate, inntekt per medlem og kostnad per kvadratmeter — tall som betyr noe for deg." },
      { num: "02", title: "Sesongplanlegging.", desc: "Vi hjelper deg med budsjett og likviditet som tar høyde for at januar og september er annerledes enn juni." },
      { num: "03", title: "Momskompensasjon for frivillige.", desc: "Idrettsklubber og frivillige organisasjoner kan ha rett på momskompensasjon. Vi hjelper med søknaden." },
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
