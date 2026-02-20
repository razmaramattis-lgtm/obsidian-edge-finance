import { TrendingUp } from "lucide-react";
import BransjePage from "@/components/BransjePage";

const Restaurant = () => (
  <BransjePage
    icon={TrendingUp}
    name="Restaurant & Uteliv"
    tagline="Vi hjelper deg å holde hjulene i gang"
    intro="Restaurant og café er en bransje der marginene kan være tynne og hverdagen er hektisk. Vi gir deg god oversikt over driften, slik at du kan ta bedre beslutninger — og sove litt bedre om natten."
    body="Restaurant er blant bransjene med høyest konkursrate i Norge — ofte ikke fordi konseptet er dårlig, men fordi den finansielle styringen ikke holder tritt med driften. Vi hjelper restauratører å forstå dekningsbidrag, food cost og lønnskostnadsandel på et nivå som faktisk gjør det mulig å ta riktige beslutninger."
    deliverables={[
      "Løpende bokføring med kassaintegrasjon",
      "Food cost og dekningsbidragsanalyse",
      "Lønnskostnadsandel og bemanningsbudsjettering",
      "MVA på mat og drikke (ulike satser)",
      "Alkoholbevilling og dokumentasjonskrav",
      "Serveringsattest og næringsdokumentasjon",
      "Sesongbudsjettering og likviditetsstyring",
      "Skattemelding og årsregnskap",
    ]}
    challenges={[
      { title: "Food cost er den viktigste marginmåleren — og den mest oversette.", desc: "Vet du hvilken food cost-prosent du faktisk har, og hva den bør være for at restauranten din er lønnsom? Vi setter opp rapportering som svarer på dette ukentlig." },
      { title: "MVA-satsene i bransjen er en jungel.", desc: "Servering har 15 % MVA, take-away kan ha 15 % eller 25 %, alkohol har 25 %. Feil MVA-behandling er en av de hyppigste feilene i bransjen — og vi unngår dem." },
      { title: "Lønnskostnadene er den største enkeltposten.", desc: "Kveldsarbeid, helgetillegg, overtid og turnus gjør lønnskjøringen kompleks. Vi håndterer lønn korrekt og hjelper deg å budsjettetere bemanningen fornuftig." },
      { title: "Kontantomsetning og kasseavvik er en risiko.", desc: "Kontantomsetning i restaurant stiller særlige krav til kassedokumentasjon og intern kontroll. Vi hjelper deg å sette opp rutiner som reduserer risiko og sikrer dokumentasjon." },
    ]}
    whyAvargo={[
      { num: "01", title: "Vi kjenner restaurantens nøkkeltall.", desc: "Food cost, prime cost, RevPAC og gjennomsnittlig bonnstørrelse — vi rapporterer på de tallene som betyr noe for en restauranteier." },
      { num: "02", title: "Kassaintegrasjon som fungerer.", desc: "Data fra kassasystemet (Lightspeed, iZettle, Trivec etc.) hentes automatisk inn. Du slipper å overføre salgsdata manuelt." },
      { num: "03", title: "Proaktiv rådgivning i en tøff bransje.", desc: "Vi varsler deg ved likviditetspress, identifiserer marginutfordringer og hjelper deg med sesongplanlegging — fordi vi vet at restaurantmarginer ikke har rom for overraskelser." },
    ]}
    relatedSlugs={[
      { label: "Varehandel", href: "/bransjer/varehandel" },
      { label: "Frisør & Skjønnhet", href: "/bransjer/frisor" },
    ]}
    ctaHeadline="Tynne marginer krever presis oversikt — vi gir deg den."
  />
);

export default Restaurant;
