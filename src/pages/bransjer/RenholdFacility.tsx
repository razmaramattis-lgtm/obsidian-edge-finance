import { Sparkles } from "lucide-react";
import BransjePage from "@/components/BransjePage";

const RenholdFacility = () => (
  <BransjePage
    icon={Sparkles}
    name="Renhold & Facility"
    tagline="Rene tall for ren drift"
    intro="Renholdsbransjen preges av mange ansatte, mange oppdrag og stramme marginer. Vi gir deg oversikt over lønnsomheten per kontrakt og kontroll på lønnskostnadene — slik at du kan vokse trygt."
    body="Enten du driver renholdsselskap, vaktmestertjenester eller facility management, er det personalintensivt og kontraktbasert. Lønnskostnaden er den klart største posten, og riktig prising av kontrakter er avgjørende. Vi hjelper deg med å forstå faktisk timekostnad, dekningsbidrag per kontrakt og kontroll på arbeidstidsregistrering."
    deliverables={[
      "Lønnskjøring med overtid, helg og kveldstillegg",
      "Lønnsomhetsanalyse per kontrakt og oppdragsgiver",
      "Fakturering og kontraktsoppfølging",
      "A-melding og innberetning",
      "HMS-dokumentasjon og internkontroll",
      "MVA og skattemelding",
      "Årsregnskap og perioderegnskap",
      "Budsjettering og likviditetsstyring",
    ]}
    challenges={[
      { title: "Mange ansatte betyr kompleks lønnskjøring.", desc: "Deltid, overtid, vikarer og tillegg gjør lønn til den mest krevende prosessen. Vi håndterer alt korrekt og effektivt." },
      { title: "Marginer er tynne — prising er alt.", desc: "Vi hjelper deg å beregne faktisk timekostnad inkludert sosiale kostnader, fravær og administrasjon — slik at du aldri priser under kost." },
      { title: "Mange kontrakter krever individuell oppfølging.", desc: "Vi setter opp rapportering per kontrakt slik at du ser hvilke oppdrag som er lønnsomme og hvilke som tapper deg." },
      { title: "Dokumentasjonskravene er strenge.", desc: "HMS, internkontroll og arbeidstidsregistrering er lovpålagt. Vi hjelper deg med å holde orden og unngå sanksjoner." },
    ]}
    whyAvargo={[
      { num: "01", title: "Lønnsomhet per kontrakt.", desc: "Vi gir deg innsikt i dekningsbidrag per oppdrag — ikke bare totaltall. Det gjør at du kan forhandle bedre og si nei til ulønnsomme kontrakter." },
      { num: "02", title: "Effektiv lønnskjøring.", desc: "Vi håndterer lønn for mange ansatte raskt og korrekt — med alle tillegg, fradrag og innberetninger på plass." },
      { num: "03", title: "Vekststøtte.", desc: "Når du vokser fra 5 til 50 ansatte, endres kravene. Vi skalerer med deg og sikrer at administrasjonen holder tritt." },
    ]}
    relatedSlugs={[
      { label: "Bemanning & Rekruttering", href: "/bransjer/bemanning" },
      { label: "Håndverkere & Fagfolk", href: "/bransjer/handverkere" },
      { label: "Eiendom & Utvikling", href: "/bransjer/eiendom" },
    ]}
    ctaHeadline="Stramme marginer krever presis styring — vi gir deg den."
  />
);

export default RenholdFacility;
