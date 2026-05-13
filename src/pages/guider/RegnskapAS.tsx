import GuideTemplate from "@/components/guider/GuideTemplate";

const RegnskapAS = () => (
  <GuideTemplate
    slug="regnskap-for-as"
    title="Regnskap for AS — alt du må vite (2026)"
    metaTitle="Regnskap for AS 2026 — komplett guide og krav | Avargo"
    metaDescription="Trenger AS regnskapsfører? Hva er kravene, hva koster det og hvordan setter du opp regnskapet riktig fra dag én? Komplett guide for aksjeselskap."
    intro="Aksjeselskap (AS) har strengere regnskapskrav enn enkeltpersonforetak. Du må føre regnskap, levere årsregnskap og innen visse grenser ha autorisert regnskapsfører. Her er alt du trenger å vite."
    sections={[
      {
        heading: "Må AS ha regnskapsfører?",
        body: (
          <>
            <p>Korte svaret: <strong>nei, ikke etter loven</strong>. Lange svaret: <strong>i praksis ja</strong>.</p>
            <p>AS er pålagt å føre regnskap etter <strong>regnskapsloven</strong> og levere årsregnskap til Brønnøysundregistrene. Du kan teknisk gjøre dette selv, men:</p>
            <ul>
              <li>Reglene er kompliserte og endres ofte</li>
              <li>Feil i MVA og lønn kan utløse store sanksjoner</li>
              <li>Årsregnskap krever fagkunnskap</li>
              <li>Banker og investorer forventer profesjonelt regnskap</li>
            </ul>
            <p>Praktisk talt alle AS bruker regnskapsfører fra dag én. Kostnaden er marginal sammenlignet med risikoen.</p>
          </>
        ),
      },
      {
        heading: "Hva koster regnskap for AS?",
        body: (
          <>
            <p>Typiske månedspriser for AS i 2026:</p>
            <ul>
              <li><strong>Lite/oppstart-AS</strong> (få bilag, ingen ansatte): 1 500–3 500 kr/mnd</li>
              <li><strong>Mellomstort AS</strong> (100–500 bilag, 1–5 ansatte): 4 000–9 000 kr/mnd</li>
              <li><strong>Større AS</strong> (500+ bilag, 6+ ansatte): 10 000–25 000+ kr/mnd</li>
            </ul>
            <p>Hos Avargo starter prisen for AS på <strong>1 590 kr/mnd</strong> — fastpris, alt inkludert, inkludert årsregnskap.</p>
          </>
        ),
      },
      {
        heading: "Hvilke regnskapsplikter har et AS?",
        body: (
          <>
            <ul>
              <li><strong>Bokføringsplikt</strong> — alle transaksjoner må føres løpende</li>
              <li><strong>Bilagsplikt</strong> — alle bilag må oppbevares i 5 år</li>
              <li><strong>MVA-rapportering</strong> — hver to måned dersom omsetning over 50 000 kr</li>
              <li><strong>A-melding</strong> — månedlig dersom du har ansatte</li>
              <li><strong>Årsregnskap</strong> — leveres innen 31. juli</li>
              <li><strong>Skattemelding</strong> — leveres innen 31. mai</li>
              <li><strong>Aksjonærregisteroppgave</strong> — innen 31. januar</li>
              <li><strong>Generalforsamling</strong> — innen 30. juni</li>
            </ul>
            <p>En regnskapsfører holder alle disse fristene for deg automatisk.</p>
          </>
        ),
      },
      {
        heading: "Slik setter du opp regnskap for AS fra dag én",
        body: (
          <>
            <ol className="list-decimal pl-6 space-y-2">
              <li><strong>Registrer AS i Brønnøysund.</strong> Innskudd minst 30 000 kr i aksjekapital.</li>
              <li><strong>Åpne firmakonto i bank.</strong> Holde firmaøkonomi adskilt fra privat.</li>
              <li><strong>Velg regnskapssystem.</strong> Tripletex, Fiken eller Conta er de tre store.</li>
              <li><strong>MVA-registrer ved 50 000 kr omsetning.</strong> Registrer i god tid.</li>
              <li><strong>Engasjer regnskapsfører.</strong> Få oppdragsavtale og fullmakter på plass.</li>
              <li><strong>Sett opp digital bilagsrutine.</strong> Foto og opplasting fra mobilen — ingen papir.</li>
              <li><strong>Etabler lønnsrutiner</strong> hvis du har ansatte (inkludert deg selv).</li>
            </ol>
            <p>Avargo håndterer steg 4–7 for deg, slik at du kan fokusere på bedriften.</p>
          </>
        ),
      },
      {
        heading: "Vanlige feil oppstartsbedrifter gjør",
        body: (
          <>
            <ul>
              <li><strong>Blander privat og firma</strong> — bruker firmakortet til privat handel</li>
              <li><strong>Glemmer MVA-registrering</strong> — får etterskudd og bot</li>
              <li><strong>Manglende dokumentasjon</strong> — fradrag avvises ved bokettersyn</li>
              <li><strong>Tar utbytte uten formell prosess</strong> — kan bli omklassifisert til lønn</li>
              <li><strong>Venter med regnskapsfører</strong> — opphoper bilagskaos i 6 måneder</li>
            </ul>
            <p>Få regnskap på plass fra dag én — det er den billigste forsikringen du kan ta.</p>
          </>
        ),
      },
    ]}
    faq={[
      { q: "Kan jeg føre regnskap selv for AS?", a: "Ja, men det er sjelden lønnsomt. Reglene er kompliserte, fristene er mange, og bot for feil overstiger raskt sparte regnskapskostnader. De fleste AS bruker regnskapsfører." },
      { q: "Når må AS ha autorisert regnskapsfører?", a: "Ikke pålagt etter loven for vanlige AS. Men hvis du leverer regnskap til andre — eller vil ha trygghet — bør byrået du bruker være autorisert av Finanstilsynet." },
      { q: "Hvor mye koster årsregnskap for AS?", a: "Hos tradisjonelle byråer 8 000–25 000 kr ekstra. Hos Avargo er årsregnskap inkludert i den månedlige fastprisen — du betaler aldri separat." },
      { q: "Hva skjer hvis jeg ikke leverer årsregnskap i tide?", a: "Tvangsmulkt fra Brønnøysundregistrene starter på 1 729 kr og kan øke daglig. Etter to år uten innlevering kan selskapet tvangsoppløses." },
      { q: "Trenger AS revisor?", a: "Ikke for de fleste mindre AS. Du kan velge bort revisor hvis omsetning under 7 mill, balanse under 27 mill og under 10 ansatte. Regnskapsfører er fortsatt anbefalt." },
    ]}
  />
);

export default RegnskapAS;
