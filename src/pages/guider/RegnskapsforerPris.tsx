import GuideTemplate from "@/components/guider/GuideTemplate";

const RegnskapsforerPris = () => (
  <GuideTemplate
    slug="regnskapsforer-pris"
    title="Hva koster en regnskapsfører? Komplett prisguide 2026"
    metaTitle="Regnskapsfører pris 2026 — komplett guide til kostnader | Avargo"
    metaDescription="Hva koster en regnskapsfører i Norge? Vi viser fastpris, timepris, hva som inkluderes og hvordan du sammenligner riktig — uten skjulte tillegg."
    intro="Regnskapsfører-priser i Norge varierer fra 800 kr/mnd for små enkeltpersonforetak til 25 000+ kr/mnd for større AS. Her er hva du faktisk betaler for — og hvordan du unngår overraskelser."
    sections={[
      {
        heading: "Hva koster en regnskapsfører i 2026?",
        body: (
          <>
            <p>Prisen avhenger av tre faktorer: <strong>antall bilag, selskapsform og hvor mye du delegerer</strong>. Et grovt prisbilde for 2026:</p>
            <ul>
              <li><strong>Enkeltpersonforetak (ENK)</strong> med få bilag: 800–1 800 kr/mnd</li>
              <li><strong>Lite AS</strong> (under 100 bilag/mnd): 1 500–3 500 kr/mnd</li>
              <li><strong>Mellomstort AS</strong> (100–500 bilag/mnd): 4 000–9 000 kr/mnd</li>
              <li><strong>Større AS</strong> med lønn for ansatte: 10 000–25 000+ kr/mnd</li>
            </ul>
            <p>Hos Avargo starter vi på <strong>1 590 kr/mnd</strong> for nye AS — fast pris, ingen skjulte tillegg.</p>
          </>
        ),
      },
      {
        heading: "Fastpris vs timepris — hva bør du velge?",
        body: (
          <>
            <p><strong>Fastpris</strong> er det mest forutsigbare og det moderne byråer tilbyr. Du vet eksakt hva du betaler, og du kan ringe regnskapsføreren uten å se på klokka.</p>
            <p><strong>Timepris</strong> ligger typisk mellom 950 og 1 700 kr/time. Brukes ofte av tradisjonelle byråer og kan eksplodere når du trenger hjelp mest.</p>
            <p>Vår klare anbefaling: <strong>velg fastpris</strong>. Du unngår overraskelser og får et byrå som er motivert for effektivitet.</p>
          </>
        ),
      },
      {
        heading: "Hva inkluderer prisen vanligvis?",
        body: (
          <>
            <p>En typisk fastpris-pakke fra et seriøst byrå inkluderer:</p>
            <ul>
              <li>Bokføring av alle bilag</li>
              <li>MVA-rapportering (annen hver måned)</li>
              <li>Avstemming av bank, kunder og leverandører</li>
              <li>Lønnskjøring for ansatte (ofte tillegg)</li>
              <li>Årsregnskap og skattemelding</li>
              <li>Løpende rådgivning og spørsmål</li>
            </ul>
            <p>Pass på <strong>"alt-inkludert"-fellen</strong>: noen byråer markedsfører lav pris, men tar ekstra for årsregnskap, lønn, eller "ekstra spørsmål". Be alltid om totalpris over 12 måneder.</p>
          </>
        ),
      },
      {
        heading: "Slik sammenligner du tilbud riktig",
        body: (
          <>
            <p>Sjekkliste når du henter inn 3 tilbud:</p>
            <ul>
              <li>Er <strong>årsregnskap og skattemelding</strong> inkludert?</li>
              <li>Hva koster <strong>lønnskjøring</strong> per ansatt?</li>
              <li>Hvor mange bilag er inkludert i grunnprisen?</li>
              <li>Er <strong>spørsmål og rådgivning</strong> inkludert, eller faktureres per minutt?</li>
              <li>Hvilket regnskapssystem bruker de? (Tripletex, Fiken, Conta — du bør eie dataene)</li>
              <li>Hvor lang er <strong>oppsigelsestiden</strong>?</li>
            </ul>
            <p>Avargos prinsipp: én pakke, én pris, ingen tillegg. Du eier alle dine egne data — også hvis du bytter byrå.</p>
          </>
        ),
      },
    ]}
    faq={[
      { q: "Hva er den billigste regnskapsføreren i Norge?", a: "Den billigste er ikke nødvendigvis den beste. For ENK med veldig få bilag finnes løsninger fra rundt 800 kr/mnd, men de mangler ofte rådgivning. Hos Avargo starter fastpris på 1 590 kr/mnd og inkluderer dedikert kontaktperson, rådgivning og full delegering." },
      { q: "Hvor mye koster lønnskjøring per ansatt?", a: "Typisk 100–250 kr per lønnsslipp. Avargo inkluderer lønnskjøring i bedriftspakkene uten ekstra tillegg per ansatt opp til et visst antall." },
      { q: "Hva koster årsregnskap og skattemelding?", a: "Hos tradisjonelle byråer koster årsoppgjør 8 000–25 000 kr ekstra. Hos Avargo er det inkludert i den månedlige fastprisen — du betaler aldri for årsregnskapet separat." },
      { q: "Kan jeg gjøre regnskapet selv og spare penger?", a: "Ja — for ENK med svært få transaksjoner. Men feil i MVA, lønn eller årsregnskap koster typisk mer enn et byrå. For AS er regnskapsfører i praksis nødvendig fra dag én." },
      { q: "Hvor mye sparer jeg på å bytte til et digitalt byrå?", a: "Tradisjonelle byråer som fakturerer per time ligger ofte 30–50 % høyere enn moderne fastprisbyråer. Bedrifter som bytter til Avargo sparer typisk 25–40 % og får i tillegg bedre oppfølging." },
    ]}
  />
);

export default RegnskapsforerPris;
