import { Plane } from "lucide-react";
import BransjePage from "@/components/BransjePage";

const ReiselivTurisme = () => (
  <BransjePage
    icon={Plane}
    name="Reiseliv & Turisme"
    tagline="Vi styrer økonomien — du skaper opplevelsene"
    intro="Hoteller, reisebyråer, aktivitetsselskaper og opplevelsestilbydere. Reiselivsbransjen er sesongavhengig og valutautsatt. Vi gir deg den økonomiske stabiliteten som trengs for å overleve lavsesongen og blomstre i høysesongen."
    body="Reiselivsbransjen har ekstreme sesongsvingninger — fra fullbookede somre til tomme vintre (eller omvendt for skisenter). Kostnadene er faste, men inntektene er alt annet enn det. Vi hjelper deg med sesongbudsjettering, valutahåndtering og lønnsomhetsanalyser per produkt og kanal."
    deliverables={[
      "Sesongbudsjettering og likviditetsplanlegging",
      "Beleggs- og inntektsanalyser",
      "MVA på overnatting (12 %) vs. andre tjenester",
      "Valutahåndtering og utenlandske gjester",
      "Lønnskjøring med sesongarbeidere",
      "Bookingsystem-integrasjon",
      "Årsregnskap og skattemelding",
      "Tilskudd og støtteordninger for reiseliv",
    ]}
    challenges={[
      { title: "Sesongsvingningene er brutale.", desc: "Vi lager likviditetsplaner som sikrer at du overlever lavsesongen med de inntektene du tjener i høysesongen." },
      { title: "MVA-satsene varierer.", desc: "Overnatting (12 %), servering (15 %) og andre tjenester (25 %) — vi sikrer korrekt MVA på alle dine inntektsstrømmer." },
      { title: "Mange sesongarbeidere.", desc: "Ansettelse og lønn for sesongansatte krever korrekt håndtering av korttidskontrakter, feriepenger og sluttoppgjør." },
      { title: "Bookingplattformer tar sin andel.", desc: "Booking.com, Airbnb og andre plattformer har ulike provisjonsmodeller. Vi sørger for korrekt inntektsføring og provisjonsbehandling." },
    ]}
    whyAvargo={[
      { num: "01", title: "RevPAR og belegg.", desc: "Vi rapporterer på nøkkeltall som reiselivsbransjen faktisk bruker — ikke generiske regnskapsrapporter." },
      { num: "02", title: "Sesongplanlegging.", desc: "Vi bygger budsjetter og prognoser som reflekterer din sesongprofil — slik at du aldri blir overrasket." },
      { num: "03", title: "Tilskuddskompetanse.", desc: "Innovasjon Norge, regionale fond og støtteordninger for reiseliv — vi hjelper deg med å utnytte mulighetene." },
    ]}
    relatedSlugs={[
      { label: "Restaurant & Uteliv", href: "/bransjer/restaurant" },
      { label: "Sport & Fritid", href: "/bransjer/sport" },
      { label: "Kultur, Media & Underholdning", href: "/bransjer/kultur" },
    ]}
    ctaHeadline="Sesongvariasjoner krever solid planlegging — vi leverer den."
  />
);

export default ReiselivTurisme;
