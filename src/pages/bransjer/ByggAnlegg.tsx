import { HardHat } from "lucide-react";
import BransjePage from "@/components/BransjePage";

const ByggAnlegg = () => (
  <BransjePage
    icon={HardHat}
    name="Bygg & Anlegg"
    tagline="Vi holder orden mens du bygger"
    intro="Bygg- og anleggsbransjen er avhengig av at prosjekter går i pluss og at alt er på stell. Vi hjelper deg å ha god oversikt over hvert enkelt prosjekt, slik at du alltid vet om du tjener penger eller ikke."
    body="Prosjektregnskap, fakturering etter fremdrift og krav til dokumentasjon gjør bygg til en av de mer komplekse bransjene regnskapsmessig. I tillegg er seriøsitetskravene i bransjen skjerpet kraftig — med krav til HMS-kort, registeroppføring og dokumentasjon av underleverandørers lønn og skatt."
    deliverables={[
      "Prosjektregnskap og fremdriftsfakturering",
      "Anbudskalkylering og prosjektbudsjettering",
      "Bilagskontroll og underleverandørdokumentasjon",
      "MVA i byggebransjen (særregler for omvendt avgiftsplikt)",
      "HMS-dokumentasjon og seriøsitetskrav",
      "Maskinavskrivninger og leasing",
      "Garantier og retensjoner",
      "Årsregnskap og skattemelding",
    ]}
    challenges={[
      { title: "Prosjektet ser lønnsomt ut — til det plutselig ikke gjør det.", desc: "Uten løpende prosjektregnskap oppdager du kostnadsoverskridelser for sent. Vi setter opp systemer som gir deg varsling i sanntid, ikke i etterkant." },
      { title: "Omvendt avgiftsplikt mellom MVA-pliktige er en vanlig feil.", desc: "Feil håndtering av omvendt avgiftsplikt mellom entreprenør og underentreprenør er en av de hyppigst korrigerte feilene i bransjen. Vi gjør det riktig." },
      { title: "Seriøsitetskrav og dokumentasjonskrav er blitt strengere.", desc: "Krav til HMS-kort, Skatteetatens transportregister, lønns- og arbeidsvilkår hos underleverandører — vi holder oversikt over hva som kreves og sikrer compliance." },
      { title: "Likviditet er kritisk i anleggsfasen.", desc: "Byggeprosjekter binder opp kapital lenge. Vi budsjetteterer kontantstrøm per prosjekt slik at du aldri havner i likviditetsklemme midt i et oppdrag." },
    ]}
    whyAvargo={[
      { num: "01", title: "Prosjektregnskap som faktisk gir innsikt.", desc: "Ikke bare kostnader — men margin, fremdrift og prognosert sluttresultat per prosjekt. Du vet alltid om du tjener penger." },
      { num: "02", title: "Compliance i en strengere bransje.", desc: "Vi holder deg oppdatert på seriøsitetskrav, underleverandøroppfølging og dokumentasjonskrav som er unike for bygg og anlegg." },
      { num: "03", title: "Erfaring med alle selskapsformer i bransjen.", desc: "Enkeltpersonforetak, AS, ANS og konsortier — vi kjenner regnskapsmodellene for alle vanlige konstruksjoner i bransjen." },
    ]}
    relatedSlugs={[
      { label: "Eiendom & Utvikling", href: "/bransjer/eiendom" },
      { label: "Håndverkere & Fagfolk", href: "/bransjer/handverkere" },
    ]}
    ctaHeadline="Prosjektene i pluss. Papirene i orden."
  />
);

export default ByggAnlegg;
