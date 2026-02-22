import { HardHat } from "lucide-react";
import BransjePage from "@/components/BransjePage";

const ByggAnlegg = () => (
  <BransjePage
    href="/bransjer/bygg-anlegg"
    icon={HardHat}
    name="Bygg & Anlegg"
    tagline="Vi holder orden mens du bygger"
    intro="Bygg- og anleggsbransjen er avhengig av at prosjekter går i pluss og at alt er på stell. Vi hjelper deg å ha god oversikt over hvert enkelt prosjekt, slik at du alltid vet om du tjener penger eller ikke."
    body="I byggebransjen skal regnskapet følge hvert prosjekt, fakturering skjer etter fremdrift, og det stilles stadig strengere krav til dokumentasjon. Vi holder orden på alt det administrative — slik at du kan konsentrere deg om det som skjer på byggeplassen."
    deliverables={[
      "Regnskap per prosjekt med løpende oppfølging",
      "Fakturering basert på fremdrift",
      "Kontroll på kostnader og underleverandører",
      "Riktig håndtering av avgifter mellom entreprenører",
      "Dokumentasjon og sikkerhetskrav",
      "Avskrivning av maskiner og kjøretøy",
      "Håndtering av garantier og tilbakeholdte beløp",
      "Årsregnskap og skattemelding",
    ]}
    challenges={[
      { title: "Prosjektet ser lønnsomt ut — til det plutselig ikke gjør det.", desc: "Uten løpende oversikt over kostnadene oppdager du overskridelser for sent. Vi gir deg varsling underveis, ikke i etterkant." },
      { title: "Avgifter mellom byggeaktører er en vanlig feilkilde.", desc: "Reglene for hvordan avgifter skal håndteres mellom entreprenører og underentreprenører er strenge. Vi gjør det riktig fra starten." },
      { title: "Dokumentasjonskravene i bransjen har blitt strengere.", desc: "Sikkerhetskort, registreringer og dokumentasjon av underleverandører — vi holder oversikt over hva som kreves og sørger for at alt er i orden." },
      { title: "Byggeprosjekter binder opp penger lenge.", desc: "Vi planlegger pengestrømmen per prosjekt slik at du ikke havner i klemme midt i et oppdrag." },
    ]}
    whyAvargo={[
      { num: "01", title: "Prosjektregnskap som gir ekte innsikt.", desc: "Ikke bare kostnader — men fortjeneste, fremdrift og forventet sluttresultat per prosjekt. Du vet alltid hvor du står." },
      { num: "02", title: "Alt på stell i en strengere bransje.", desc: "Vi holder deg oppdatert på alle krav til dokumentasjon og oppfølging som gjelder spesifikt for bygg og anlegg." },
      { num: "03", title: "Erfaring med alle typer selskaper i bransjen.", desc: "Enkeltpersonforetak, aksjeselskap og samarbeidsformer — vi kjenner regnskapsmodellene for alle vanlige måter å organisere seg på." },
    ]}
    relatedSlugs={[
      { label: "Eiendom & Utvikling", href: "/bransjer/eiendom" },
      { label: "Håndverkere & Fagfolk", href: "/bransjer/handverkere" },
    ]}
    ctaHeadline="Prosjektene i pluss. Papirene i orden."
  />
);

export default ByggAnlegg;
