import GuideTemplate from "@/components/guider/GuideTemplate";

const BytteRegnskapsforer = () => (
  <GuideTemplate
    slug="bytte-regnskapsforer"
    title="Bytte regnskapsfører — komplett guide (uten kostnad)"
    metaTitle="Bytte regnskapsfører — slik gjør du det enkelt | Avargo"
    metaDescription="Vurderer du å bytte regnskapsfører? Slik bytter du trygt og kostnadsfritt — sjekkliste, tidslinje og hva du skal kreve fra det gamle byrået."
    intro="Det er enklere å bytte regnskapsfører enn de fleste tror — og det koster deg ingenting hos et seriøst byrå. Her er en komplett guide til hvordan du gjør det smertefritt."
    sections={[
      {
        heading: "Når bør du bytte regnskapsfører?",
        body: (
          <>
            <p>Vanlige grunner til å bytte:</p>
            <ul>
              <li><strong>Du får ikke svar.</strong> Spørsmål blir liggende i dagevis eller uker.</li>
              <li><strong>Uoversiktlige fakturaer.</strong> Du forstår ikke hva du betaler for hver måned.</li>
              <li><strong>Ingen rådgivning.</strong> Regnskapet bokføres, men du får aldri innsikt eller anbefalinger.</li>
              <li><strong>Utdatert teknologi.</strong> Bilag på papir, manuell innsending, ingen sanntidsoversikt.</li>
              <li><strong>Stadig nye kontaktpersoner.</strong> Du må forklare bedriften din på nytt hvert kvartal.</li>
              <li><strong>Skjulte tillegg.</strong> Årsregnskap, lønn og spørsmål faktureres separat med høy timepris.</li>
            </ul>
            <p>Hvis du nikker til to eller flere — det er på tide å vurdere et bytte.</p>
          </>
        ),
      },
      {
        heading: "Når på året er det best å bytte?",
        body: (
          <>
            <p>Den enkle sannheten: <strong>du kan bytte når som helst</strong>. Et profesjonelt byrå tar over data midt i året uten at du mister noe.</p>
            <p>Optimalt sett bytter du:</p>
            <ul>
              <li><strong>Etter årsregnskapet</strong> (typisk april–juni) — rene tall fra dag én.</li>
              <li><strong>Ved nytt regnskapsår</strong> (januar) — naturlig overgang.</li>
              <li><strong>Når frustrasjonen er stor nok</strong> — ikke vent på den "perfekte" datoen.</li>
            </ul>
            <p>Avargo tar over hele regnskapet ditt kostnadsfritt og håndterer all kommunikasjon med det gamle byrået.</p>
          </>
        ),
      },
      {
        heading: "Slik bytter du steg for steg",
        body: (
          <>
            <ol className="list-decimal pl-6 space-y-2">
              <li><strong>Si opp eksisterende avtale skriftlig.</strong> Sjekk oppsigelsestiden — typisk 1–3 måneder.</li>
              <li><strong>Be om kopi av alle dine data:</strong> hovedbok, bilag, lønnsdata, åpne poster, MVA-rapporter.</li>
              <li><strong>Velg nytt byrå.</strong> Hent inn 2–3 tilbud og sammenlign på totalpris (ikke månedspris alene).</li>
              <li><strong>Signér ny avtale.</strong> Det nye byrået sender oppdragsbrev og fullmakter.</li>
              <li><strong>Overføring.</strong> Det nye byrået henter data fra Altinn, regnskapssystemet og det gamle byrået.</li>
              <li><strong>Onboarding.</strong> Du får en gjennomgang av rutiner, system og kontaktperson.</li>
            </ol>
            <p>Hele prosessen tar typisk 2–6 uker. Hos Avargo håndterer vi alle stegene for deg.</p>
          </>
        ),
      },
      {
        heading: "Hva har du krav på fra det gamle byrået?",
        body: (
          <>
            <p>Etter regnskapsloven har du <strong>full eiendomsrett til alle dine data</strong>. Det gamle byrået må utlevere:</p>
            <ul>
              <li>Hovedbok og kontoutskrifter for alle år</li>
              <li>Alle originale bilag (digitalt eller papir)</li>
              <li>Lønnsdata og A-meldinger</li>
              <li>Innsendte MVA-rapporter</li>
              <li>Årsregnskap og skattemeldinger</li>
              <li>Tilgang til regnskapssystemet (du eier lisensen, ikke byrået)</li>
            </ul>
            <p>Hvis et byrå nekter eller tar betalt for å utlevere dine data — kontakt Regnskap Norge eller Finanstilsynet. Det er ikke lovlig.</p>
          </>
        ),
      },
    ]}
    faq={[
      { q: "Koster det noe å bytte regnskapsfører?", a: "Hos Avargo er overgangen 100 % gratis — du betaler ingenting før du faktisk er kunde hos oss. Det gamle byrået kan ikke ta gebyr for å utlevere dine egne data." },
      { q: "Hva er oppsigelsestiden hos regnskapsbyrå?", a: "Vanligvis 1–3 måneder, men sjekk oppdragsavtalen din. Noen byråer har 6 måneder — det er en advarsel i seg selv." },
      { q: "Mister jeg historikk hvis jeg bytter?", a: "Nei. All historikk overføres til det nye byrået. Du eier dataene dine, ikke byrået." },
      { q: "Hvor lang tid tar et bytte?", a: "Selve overgangen tar 2–6 uker. Den lengste delen er oppsigelsesperioden hos det gamle byrået." },
      { q: "Kan jeg bytte midt i et regnskapsår?", a: "Ja, helt uproblematisk. Et profesjonelt byrå tar over data fra hvor som helst i året og fører videre." },
    ]}
  />
);

export default BytteRegnskapsforer;
