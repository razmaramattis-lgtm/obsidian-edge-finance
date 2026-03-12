import { Helmet } from "react-helmet-async";
import AnimatedSection from "@/components/AnimatedSection";

const Personvern = () => (
  <>
    <Helmet>
      <title>Personvernerklæring | Avargo</title>
      <meta name="description" content="Les Avargos personvernerklæring. Vi beskriver hvordan vi samler inn, bruker og beskytter dine personopplysninger." />
      <link rel="canonical" href="https://avargo.no/personvern" />
    </Helmet>

    <section className="py-24 md:py-40">
      <div className="container mx-auto px-4 md:px-6">
        <AnimatedSection>
          <div className="max-w-3xl mx-auto">
            <p className="text-[10px] tracking-[0.4em] uppercase text-secondary mb-5">Juridisk</p>
            <h1 className="font-heading text-4xl md:text-6xl mb-8">Personvernerklæring</h1>
            <p className="text-sm text-muted-foreground mb-12">Sist oppdatert: 22. februar 2026</p>

            <div className="prose prose-invert max-w-none space-y-8 text-foreground/80 font-light leading-relaxed text-[15px]">
              <section>
                <h2 className="font-heading text-xl md:text-2xl text-foreground mb-3">1. Behandlingsansvarlig</h2>
                <p>Avargo AS (org.nr. under registrering) er behandlingsansvarlig for personopplysninger som samles inn via denne nettsiden og våre tjenester.</p>
                <p>Kontakt: kontakt@avargo.no | Oscars gate 2B, 3714 Skien</p>
              </section>

              <section>
                <h2 className="font-heading text-xl md:text-2xl text-foreground mb-3">2. Hvilke opplysninger vi samler inn</h2>
                <p>Vi samler inn følgende personopplysninger:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Kontaktinformasjon:</strong> Navn, e-postadresse, telefonnummer og bedriftsnavn som du oppgir i kontaktskjemaet.</li>
                  <li><strong>Organisasjonsdata:</strong> Organisasjonsnummer og bransje som hentes fra Brønnøysundregistrene for å forenkle skjemautfyllingen.</li>
                  <li><strong>Brukerdata:</strong> Informasjon du oppgir som kunde, inkludert regnskapsdata, dokumenter og ansattopplysninger.</li>
                  <li><strong>Tekniske data:</strong> IP-adresse, nettlesertype og besøksstatistikk for å forbedre nettsiden.</li>
                </ul>
              </section>

              <section>
                <h2 className="font-heading text-xl md:text-2xl text-foreground mb-3">3. Formål med behandlingen</h2>
                <p>Vi bruker personopplysningene dine til å:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Besvare henvendelser og gi deg tilbud på våre tjenester</li>
                  <li>Levere regnskaps-, HR- og rådgivningstjenester du har bestilt</li>
                  <li>Administrere kundeforholdet, inkludert fakturering og kommunikasjon</li>
                  <li>Forbedre nettsiden og brukeropplevelsen</li>
                  <li>Oppfylle lovpålagte krav, herunder bokføringsloven og regnskapslovgivningen</li>
                </ul>
              </section>

              <section>
                <h2 className="font-heading text-xl md:text-2xl text-foreground mb-3">4. Rettslig grunnlag</h2>
                <p>Behandlingen av personopplysninger er basert på:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Samtykke:</strong> Når du sender inn et kontaktskjema eller registrerer deg som kunde.</li>
                  <li><strong>Avtale:</strong> For å oppfylle tjenestene vi leverer til deg som kunde.</li>
                  <li><strong>Rettslig forpliktelse:</strong> For å oppfylle krav i bokføringsloven, regnskapsloven og skattelovgivningen.</li>
                  <li><strong>Berettiget interesse:</strong> For å forbedre våre tjenester og nettside.</li>
                </ul>
              </section>

              <section>
                <h2 className="font-heading text-xl md:text-2xl text-foreground mb-3">5. Deling av opplysninger</h2>
                <p>Vi deler ikke personopplysninger med tredjeparter, med unntak av:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Offentlige myndigheter når vi er lovpålagt (f.eks. Skatteetaten, Brønnøysundregistrene)</li>
                  <li>Underleverandører som bistår med IT-drift og sikkerhet, underlagt databehandleravtaler</li>
                </ul>
                <p>Vi selger aldri dine personopplysninger til tredjeparter.</p>
              </section>

              <section>
                <h2 className="font-heading text-xl md:text-2xl text-foreground mb-3">6. Lagring og sikkerhet</h2>
                <p>Personopplysninger lagres så lenge det er nødvendig for formålet de ble samlet inn for, eller så lenge vi er lovpålagt å oppbevare dem. Regnskapsdata lagres i minimum 5 år i henhold til bokføringsloven.</p>
                <p>Vi bruker kryptert lagring og tilgangskontroller for å beskytte dine opplysninger.</p>
              </section>

              <section>
                <h2 className="font-heading text-xl md:text-2xl text-foreground mb-3">7. Dine rettigheter</h2>
                <p>Du har rett til å:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Be om innsyn i hvilke opplysninger vi har om deg</li>
                  <li>Be om retting av uriktige opplysninger</li>
                  <li>Be om sletting av opplysninger (med forbehold om lovpålagt oppbevaring)</li>
                  <li>Protestere mot behandling basert på berettiget interesse</li>
                  <li>Be om dataportabilitet</li>
                </ul>
                <p>Kontakt oss på kontakt@avargo.no for å utøve dine rettigheter.</p>
              </section>

              <section>
                <h2 className="font-heading text-xl md:text-2xl text-foreground mb-3">8. Informasjonskapsler</h2>
                <p>Nettsiden bruker nødvendige informasjonskapsler for å sikre funksjonalitet. Vi bruker ingen sporings- eller markedsføringskapsler uten ditt samtykke.</p>
              </section>

              <section>
                <h2 className="font-heading text-xl md:text-2xl text-foreground mb-3">9. Klagerett</h2>
                <p>Dersom du mener at vår behandling av personopplysninger strider mot personvernlovgivningen, kan du klage til Datatilsynet (datatilsynet.no).</p>
              </section>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  </>
);

export default Personvern;
