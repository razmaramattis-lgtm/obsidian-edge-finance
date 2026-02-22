import { Plane } from "lucide-react";
import BransjePage from "@/components/BransjePage";

const ReiselivTurisme = () => (
  <BransjePage
    href="/bransjer/reiseliv"
    icon={Plane}
    name="Reiseliv & Turisme"
    tagline="Vi styrer økonomien — du skaper opplevelsene"
    intro="Hoteller, reisebyråer, aktivitetsselskaper og opplevelsestilbydere. Reiselivsbransjen er sesongavhengig og uforutsigbar. Vi gir deg den økonomiske stabiliteten som trengs for å klare lavsesongen og blomstre i høysesongen."
    body="Reiseliv har ekstreme sesongsvingninger — fra fullbooket sommer til rolige vintermåneder (eller omvendt for skisenter). Kostnadene er faste, men inntektene er alt annet enn det. Vi hjelper deg med sesongbudsjettering, valutahåndtering og oversikt over hva som faktisk lønner seg."
    deliverables={[
      "Sesongbudsjettering og planlegging av pengestrøm",
      "Oversikt over belegg og inntekter",
      "Riktig avgiftsbehandling for overnatting, servering og øvrige tjenester",
      "Håndtering av utenlandske gjester og valuta",
      "Lønnskjøring for sesongarbeidere",
      "Integrering med bookingsystemer",
      "Årsregnskap og skattemelding",
      "Søknad om støtte og tilskudd",
    ]}
    challenges={[
      { title: "Sesongsvingningene er brutale.", desc: "Vi lager planer som sikrer at du overlever lavsesongen med det du tjener i høysesongen." },
      { title: "Ulike tjenester har ulike avgiftssatser.", desc: "Overnatting, servering og andre tjenester behandles forskjellig. Vi sørger for at alt er riktig." },
      { title: "Mange sesongansatte krever ekstra oppfølging.", desc: "Korttidskontrakter, feriepenger og sluttoppgjør — vi tar oss av det." },
      { title: "Bookingplattformer tar sin andel.", desc: "Vi sørger for at provisjoner og inntekter bokføres riktig." },
    ]}
    whyAvargo={[
      { num: "01", title: "Vi rapporterer på det du faktisk trenger.", desc: "Belegg, inntekt per rom og lønnsomhet per tjeneste — tall som betyr noe for deg." },
      { num: "02", title: "Sesongplanlegging.", desc: "Vi bygger budsjetter som reflekterer din sesongprofil — slik at du aldri blir overrasket." },
      { num: "03", title: "Vi kjenner støtteordningene.", desc: "Det finnes tilskudd og støtte spesifikt for reiseliv. Vi hjelper deg med å utnytte dem." },
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
