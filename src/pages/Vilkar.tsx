import { Helmet } from "react-helmet-async";
import AnimatedSection from "@/components/AnimatedSection";

const Vilkar = () => (
  <>
    <Helmet>
      <title>Vilkår for bruk | Avargo</title>
      <meta name="description" content="Les Avargos vilkår for bruk av nettsiden og våre tjenester." />
      <link rel="canonical" href="https://avargo.no/vilkar" />
    </Helmet>

    <section className="py-24 md:py-40">
      <div className="container mx-auto px-4 md:px-6">
        <AnimatedSection>
          <div className="max-w-3xl mx-auto">
            <p className="text-[10px] tracking-[0.4em] uppercase text-secondary mb-5">Juridisk</p>
            <h1 className="font-heading text-4xl md:text-6xl mb-8">Vilkår for bruk</h1>
            <p className="text-sm text-muted-foreground mb-12">Sist oppdatert: 22. februar 2026</p>

            <div className="prose prose-invert max-w-none space-y-8 text-foreground/80 font-light leading-relaxed text-[15px]">
              <section>
                <h2 className="font-heading text-xl md:text-2xl text-foreground mb-3">1. Generelt</h2>
                <p>Disse vilkårene gjelder for bruk av nettsiden avargo.no og tjenestene som tilbys av Avargo AS (heretter «Avargo»), Oscars gate 2B, 3714 Skien.</p>
                <p>Ved å bruke nettsiden og/eller bestille tjenester fra Avargo, aksepterer du disse vilkårene.</p>
              </section>

              <section>
                <h2 className="font-heading text-xl md:text-2xl text-foreground mb-3">2. Tjenestene</h2>
                <p>Avargo tilbyr regnskaps-, HR-, rådgivnings- og markedsføringstjenester til små og mellomstore bedrifter i Norge. Omfanget av tjenestene reguleres av den individuelle avtalen mellom Avargo og kunden.</p>
                <p>Avargo forbeholder seg retten til å endre eller oppdatere tjenestene uten forvarsel, forutsatt at det ikke vesentlig påvirker eksisterende kundeavtaler.</p>
              </section>

              <section>
                <h2 className="font-heading text-xl md:text-2xl text-foreground mb-3">3. Priser og betaling</h2>
                <p>Priser for tjenestene fremgår av den individuelle avtalen eller gjeldende prisliste på avargo.no. Alle priser er oppgitt eksklusiv merverdiavgift med mindre annet er angitt.</p>
                <p>Fakturering skjer månedlig med 14 dagers betalingsfrist. Ved forsinket betaling påløper forsinkelsesrente i henhold til forsinkelsesrenteloven.</p>
              </section>

              <section>
                <h2 className="font-heading text-xl md:text-2xl text-foreground mb-3">4. Kundens ansvar</h2>
                <p>Kunden er ansvarlig for å:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Levere korrekte og fullstendige opplysninger til Avargo</li>
                  <li>Overholde frister for innsending av dokumentasjon og bilag</li>
                  <li>Informere Avargo om endringer som kan påvirke tjenesteleveransen</li>
                  <li>Sørge for at tilgang til kundeportalen holdes konfidensiell</li>
                </ul>
              </section>

              <section>
                <h2 className="font-heading text-xl md:text-2xl text-foreground mb-3">5. Avargos ansvar</h2>
                <p>Avargo forplikter seg til å utføre tjenestene med profesjonell aktsomhet og i samsvar med gjeldende lover og regler, herunder god regnskapsskikk.</p>
                <p>Avargo er ikke ansvarlig for tap som skyldes uriktige eller mangelfulle opplysninger fra kunden, force majeure, eller forhold utenfor Avargos kontroll.</p>
              </section>

              <section>
                <h2 className="font-heading text-xl md:text-2xl text-foreground mb-3">6. Taushetsplikt</h2>
                <p>Avargo og alle ansatte er underlagt taushetsplikt i henhold til regnskapsførerforskriften. All informasjon vi mottar fra kunden behandles konfidensielt og deles ikke med tredjeparter uten kundens samtykke, med mindre vi er lovpålagt å gjøre det.</p>
              </section>

              <section>
                <h2 className="font-heading text-xl md:text-2xl text-foreground mb-3">7. Immaterielle rettigheter</h2>
                <p>Alt innhold på avargo.no, inkludert tekst, design, logoer, bilder og kode, er Avargos eiendom og beskyttet av åndsverkloven. Uautorisert kopiering eller gjenbruk er ikke tillatt.</p>
              </section>

              <section>
                <h2 className="font-heading text-xl md:text-2xl text-foreground mb-3">8. Oppsigelse</h2>
                <p>Begge parter kan si opp avtalen med 30 dagers skriftlig varsel. Ved oppsigelse vil Avargo fullføre påbegynt arbeid og overlevere all dokumentasjon til kunden eller ny regnskapsfører.</p>
                <p>Kunden er ansvarlig for betaling av tjenester levert frem til oppsigelsestidspunktet.</p>
              </section>

              <section>
                <h2 className="font-heading text-xl md:text-2xl text-foreground mb-3">9. Ansvarsfraskrivelse</h2>
                <p>Informasjonen på avargo.no, inkludert bloggartikler, guider og verktøy, er ment som generell veiledning og utgjør ikke juridisk, skattemessig eller økonomisk rådgivning. For spesifikke spørsmål bør du kontakte din regnskapsfører hos Avargo.</p>
              </section>

              <section>
                <h2 className="font-heading text-xl md:text-2xl text-foreground mb-3">10. Tvister</h2>
                <p>Disse vilkårene reguleres av norsk lov. Eventuelle tvister som ikke kan løses i minnelighet, skal avgjøres ved Telemark tingrett.</p>
              </section>

              <section>
                <h2 className="font-heading text-xl md:text-2xl text-foreground mb-3">11. Kontakt</h2>
                <p>For spørsmål om disse vilkårene, kontakt oss på firmapost@avargo.no.</p>
              </section>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  </>
);

export default Vilkar;
