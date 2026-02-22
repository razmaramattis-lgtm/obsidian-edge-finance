import { Sparkles } from "lucide-react";
import BransjePage from "@/components/BransjePage";

const RenholdFacility = () => (
  <BransjePage
    icon={Sparkles}
    name="Renhold & Facility"
    tagline="Rene tall for ren drift"
    intro="Renholdsbransjen har mange ansatte, mange oppdrag og stramme marginer. Vi gir deg oversikt over lønnsomheten per kontrakt og kontroll på lønnskostnadene — slik at du kan vokse trygt."
    body="Enten du driver renholdsselskap, vaktmestertjenester eller andre driftstjenester, er det personalintensivt og kontraktbasert. Lønnskostnadene er den klart største posten, og riktig prising av kontrakter er avgjørende. Vi hjelper deg å forstå hva en time faktisk koster deg og hva du tjener per kontrakt."
    deliverables={[
      "Lønnskjøring med alle tillegg for kveld, helg og overtid",
      "Oversikt over lønnsomhet per kontrakt og oppdragsgiver",
      "Fakturering og oppfølging av kontrakter",
      "Innrapportering til myndighetene",
      "Dokumentasjon for sikkerhet og internkontroll",
      "MVA og skattemelding",
      "Årsregnskap",
      "Budsjett og likviditetsplanlegging",
    ]}
    challenges={[
      { title: "Mange ansatte betyr mye å holde styr på.", desc: "Deltid, overtid, vikarer og tillegg gjør lønn til den mest krevende prosessen. Vi tar oss av alt." },
      { title: "Marginene er tynne — riktig prising er alt.", desc: "Vi hjelper deg å beregne hva en time faktisk koster deg — inkludert alt som følger med — slik at du aldri priser under kost." },
      { title: "Ulike kontrakter krever individuell oppfølging.", desc: "Vi viser deg hvilke oppdrag som er lønnsomme og hvilke som tapper deg." },
      { title: "Kravene til dokumentasjon er strenge.", desc: "Sikkerhet, internkontroll og arbeidstid er lovpålagt. Vi hjelper deg å holde orden og unngå problemer." },
    ]}
    whyAvargo={[
      { num: "01", title: "Lønnsomhet per kontrakt.", desc: "Vi gir deg oversikt over hva du faktisk tjener per oppdrag — ikke bare totaltall. Det hjelper deg å forhandle bedre." },
      { num: "02", title: "Effektiv lønnskjøring.", desc: "Vi kjører lønn for mange ansatte raskt og korrekt — med alle tillegg og innberetninger på plass." },
      { num: "03", title: "Vi vokser med deg.", desc: "Når du går fra 5 til 50 ansatte, endres kravene. Vi tilpasser oss og sørger for at administrasjonen holder tritt." },
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
