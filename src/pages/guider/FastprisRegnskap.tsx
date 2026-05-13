import GuideTemplate from "@/components/guider/GuideTemplate";

const FastprisRegnskap = () => (
  <GuideTemplate
    slug="fastpris-regnskap"
    title="Fastpris regnskap — slik fungerer det (og hvorfor det lønner seg)"
    metaTitle="Fastpris regnskap — full prisoversikt uten overraskelser | Avargo"
    metaDescription="Fastpris regnskap gir deg forutsigbare kostnader uten timepris-overraskelser. Slik fungerer modellen, hva som inkluderes og hva du bør passe på."
    intro="Fastpris regnskap betyr at du betaler ett fast beløp per måned for alt regnskap, uten timefakturering. Det er den moderne måten å levere regnskap på — men det er fallgruver."
    sections={[
      {
        heading: "Hva er fastpris regnskap?",
        body: (
          <>
            <p>Fastpris regnskap er en abonnementsmodell der du betaler et avtalt beløp per måned, uavhengig av hvor mange spørsmål du stiller eller hvor mye rådgivning du får.</p>
            <p>Modellen erstatter den tradisjonelle <strong>timepris-modellen</strong>, der du blir fakturert for hver minutt regnskapsføreren bruker. Resultatet av timepris er ofte at bedrifter unngår å ringe — og dermed mister verdifull rådgivning.</p>
            <p>Fastpris fjerner barrieren mellom deg og regnskapsføreren.</p>
          </>
        ),
      },
      {
        heading: "Hva inkluderer en god fastpris-pakke?",
        body: (
          <>
            <p>En komplett fastpris-pakke skal inkludere:</p>
            <ul>
              <li>Bokføring av alle bilag (digital innsending)</li>
              <li>MVA-rapportering hver to måned</li>
              <li>Bankavstemming, kunde- og leverandørreskontro</li>
              <li>Årsregnskap og skattemelding (uten ekstra fakturering)</li>
              <li>Lønnskjøring for ansatte</li>
              <li>Løpende rådgivning og spørsmål</li>
              <li>Dedikert kontaktperson</li>
              <li>Tilgang til moderne regnskapssystem (Tripletex, Fiken, Conta)</li>
            </ul>
            <p>Hvis et tilbud kaller seg "fastpris" men har 5 ekstra fakturalinjer — det er ikke ekte fastpris.</p>
          </>
        ),
      },
      {
        heading: "Fordeler med fastpris-modellen",
        body: (
          <>
            <ul>
              <li><strong>Forutsigbarhet.</strong> Du vet eksakt hva du betaler hver måned. Lett å budsjettere.</li>
              <li><strong>Ingen frykt for å ringe.</strong> Du tør spørre om småting — og får bedre råd.</li>
              <li><strong>Byrået er motivert for effektivitet.</strong> De tjener på å automatisere, ikke på å bruke tid.</li>
              <li><strong>Rettferdig prising.</strong> Pakken matcher faktisk volum, ikke tilfeldig timeforbruk.</li>
              <li><strong>Færre overraskelser.</strong> Ingen 50 000 kr-faktura for "ekstra arbeid med årsregnskapet".</li>
            </ul>
          </>
        ),
      },
      {
        heading: "Fallgruver — hva du må passe på",
        body: (
          <>
            <p>Ikke alle fastpris-tilbud er like. Vanlige fallgruver:</p>
            <ul>
              <li><strong>"Fastpris" som egentlig er "intropris".</strong> Lav pris første 6 måneder, deretter fordobling.</li>
              <li><strong>Bilags-tak.</strong> "Fastpris inkluderer 50 bilag/mnd" — over det faktureres du per bilag.</li>
              <li><strong>Årsregnskap som tillegg.</strong> 8 000–25 000 kr ekstra på toppen.</li>
              <li><strong>Spørsmål faktureres separat.</strong> "Strategisk rådgivning" på timepris.</li>
              <li><strong>Lang bindingstid.</strong> 12–24 måneder — vanskelig å bytte hvis det ikke fungerer.</li>
            </ul>
            <p>Avargos prinsipp: én pris, alt inkludert, ingen bindingstid utover 1 måneds oppsigelse.</p>
          </>
        ),
      },
    ]}
    faq={[
      { q: "Hva koster fastpris regnskap?", a: "Hos Avargo starter fastpris på 1 590 kr/mnd for nye AS og enkeltpersonforetak. Større bedrifter får tilbud basert på volum — alltid med fast pris, aldri timer." },
      { q: "Lønner fastpris seg for små bedrifter?", a: "Ja, særlig for små bedrifter. Du får forutsigbare kostnader fra dag én og slipper å frykte spørsmål du burde ha stilt." },
      { q: "Er fastpris dyrere enn timepris?", a: "Som regel ikke. Tradisjonelle timepris-byråer havner ofte høyere når du regner inn ekstra fakturering for spørsmål, årsregnskap og rådgivning." },
      { q: "Hva hvis jeg vokser mye?", a: "Da justeres pakken — men alltid på fastpris. Du forhandler én gang i året, ikke hver måned." },
      { q: "Kan jeg avslutte fastpris-avtalen?", a: "Hos Avargo er oppsigelsestid 1 måned. Vi vil ikke holde noen fast — vi vil at du skal bli fordi vi leverer verdi." },
    ]}
  />
);

export default FastprisRegnskap;
