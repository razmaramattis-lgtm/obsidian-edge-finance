import { ShoppingCart } from "lucide-react";
import BransjePage from "@/components/BransjePage";

const Varehandel = () => (
  <BransjePage
    icon={ShoppingCart}
    name="Varehandel"
    tagline="Alltid kontroll på varene og pengene"
    intro="Butikk er mer enn salg — det handler om innkjøp, lager, svinn og marginer. Vi hjelper deg å forstå hva som faktisk lønner seg å selge, og gir deg et klart bilde av hvordan bedriften din går."
    body="Varehandel stiller særskilte krav til lagerregnskap, bruttomarginoppfølging og likviditetsstyring i forbindelse med innkjøpssykluser. Vi hjelper butikker og kjeder med å sette opp regnskapssystemer som faktisk gir innsikt — ikke bare tall du ikke forstår hva du skal gjøre med."
    deliverables={[
      "Lagerregnskap og varekostnad (COGS)",
      "Bruttomarginanalyse per kategori",
      "Kassedifferanser og internkontroll",
      "MVA-rapportering og årsoppgjør",
      "Innkjøpsbudsjettering og sesongplanlegging",
      "Svinnregistrering og avviksanalyse",
      "Bankintegrasjon og automatisert bilagsflyt",
      "Skattemelding og personallønnskjøring",
    ]}
    challenges={[
      { title: "Varekostnad og bruttomargin er nøkkelen.", desc: "Vet du hvilke produktkategorier som faktisk tjener penger, og hvilke som spiser marginen din? Vi setter opp rapportering som svarer på dette spørsmålet." },
      { title: "Lager- og kontantstrøm kolliderer.", desc: "Innkjøp skjer nå, betaling kommer senere. Uten god likviditetsstyring kan en sterk sesong paradoksalt nok skape likviditetskrise. Vi planlegger med deg." },
      { title: "Kasseavvik er et tegn på noe større.", desc: "Regelmessige kassedifferanser er sjelden tilfeldige. Vi hjelper deg å identifisere mønstre og sette opp rutiner som reduserer avvik og intern svinn." },
      { title: "Sesongvariasjon krever forutsigbar økonomi.", desc: "Julehandel, sommerens lavtrafikk og salgskampanjer skaper variabel kontantstrøm. Vi budsjetteterer sesongtilpasset slik at du aldri blir tatt på senga." },
    ]}
    whyAvargo={[
      { num: "01", title: "Vi forstår handelens logikk.", desc: "Innkjøp, lagerstyring, margin og svinn — vi kjenner bransjen og rapporterer på de målene som faktisk betyr noe for en varehandler." },
      { num: "02", title: "Integrasjon mot kassasystem og nettbutikk.", desc: "Salgsdata fra kassen og nettbutikken hentes automatisk inn i regnskapet. Ingen manuell overføring, ingen forsinkelse." },
      { num: "03", title: "Proaktiv rådgivning på vekst og marginoptimalisering.", desc: "Vi hjelper deg ikke bare med å bokføre — vi hjelper deg å forstå hvilke produkter og kanaler som vokser lønnsomheten din." },
    ]}
    relatedSlugs={[
      { label: "Nettbutikk & E-commerce", href: "/bransjer/nettbutikk" },
      { label: "Restaurant & Uteliv", href: "/bransjer/restaurant" },
    ]}
    ctaHeadline="Oversikt over hvert krone inn og ut av butikken."
  />
);

export default Varehandel;
