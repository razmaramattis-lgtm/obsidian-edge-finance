import { TrendingUp } from "lucide-react";
import BransjePage from "@/components/BransjePage";

const Restaurant = () => (
  <BransjePage
    icon={TrendingUp}
    name="Restaurant & Uteliv"
    tagline="Vi hjelper deg å holde hjulene i gang"
    intro="Restaurant og café er en bransje der marginene kan være tynne og hverdagen er hektisk. Vi gir deg god oversikt over driften, slik at du kan ta bedre beslutninger — og sove litt bedre om natten."
    body="Restaurant er blant bransjene med høyest konkursrate i Norge — ofte ikke fordi konseptet er dårlig, men fordi den økonomiske styringen ikke holder tritt med driften. Vi hjelper deg å forstå hva maten koster deg, hva lønningene utgjør og hvor pengene faktisk forsvinner."
    deliverables={[
      "Løpende bokføring med integrering mot kassesystemet",
      "Oversikt over råvarekostnader og marginer",
      "Kontroll på lønnskostnader og bemanning",
      "Riktig avgiftsbehandling av mat og drikke",
      "Dokumentasjon for skjenkebevilling",
      "Sesongbudsjett og likviditetsstyring",
      "Skattemelding og årsregnskap",
    ]}
    challenges={[
      { title: "Hva maten faktisk koster deg er det viktigste tallet.", desc: "Vet du hva råvarene koster i forhold til det du selger for? Vi gir deg en ukentlig oversikt som svarer på det spørsmålet." },
      { title: "Avgiftene i bransjen er forskjellige for ulike ting.", desc: "Mat, drikke og take-away kan ha ulike avgiftssatser. Feil her er svært vanlig — vi sørger for at det gjøres riktig." },
      { title: "Lønnskostnadene er den største posten.", desc: "Kvelds- og helgetillegg, overtid og turnus gjør at lønnskjøringen er mer kompleks enn i de fleste andre bransjer. Vi tar oss av det." },
      { title: "Kontantsalg krever gode rutiner.", desc: "Kontantomsetning stiller egne krav til dokumentasjon og internkontroll. Vi hjelper deg å sette opp rutiner som fungerer." },
    ]}
    whyAvargo={[
      { num: "01", title: "Vi rapporterer på det som betyr noe for deg.", desc: "Råvarekostnad, lønnsandel og gjennomsnittlig salg — vi gir deg tallene som faktisk hjelper en restauranteier." },
      { num: "02", title: "Kassesystemet ditt kobles rett inn.", desc: "Salgsdata hentes automatisk inn i regnskapet. Du slipper å overføre noe manuelt." },
      { num: "03", title: "Vi varsler deg før det blir et problem.", desc: "Vi ser om det er press på pengene, identifiserer utfordringer med marginene og hjelper deg med sesongplanlegging — fordi vi vet at det ikke er rom for overraskelser." },
    ]}
    relatedSlugs={[
      { label: "Varehandel", href: "/bransjer/varehandel" },
      { label: "Frisør & Skjønnhet", href: "/bransjer/frisor" },
    ]}
    ctaHeadline="Tynne marginer krever presis oversikt — vi gir deg den."
  />
);

export default Restaurant;
