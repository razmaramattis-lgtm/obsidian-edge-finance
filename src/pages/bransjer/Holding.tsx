import { Landmark } from "lucide-react";
import BransjePage from "@/components/BransjePage";

const Holding = () => (
  <BransjePage
    icon={Landmark}
    name="Holding & Investering"
    tagline="Strukturen som beskytter deg"
    intro="Mange som investerer i aksjer, eiendom eller andre selskaper oppdager fort at det fort blir komplisert å holde orden. Vi hjelper deg å bygge en ryddig og trygg struktur — slik at pengene dine er godt ivaretatt og skattemessig optimalisert."
    body="Holdingstrukturer er et av de kraftigste verktøyene for skattemessig optimalisering og formuesbeskyttelse i Norge — men de krever presis forvaltning. Vi håndterer konsernregnskap, internprising, utbyttepolitikk og kapitalflyt på tvers av selskaper, og sørger for at strukturen faktisk leverer verdiene den er satt opp for å gi."
    deliverables={[
      "Konsernregnskap og elimineringer",
      "Utbyttepolitikk og kapitalflyt",
      "Skattefri utbytte (fritaksmetoden)",
      "Internprising og dokumentasjonskrav",
      "Fisjoner, fusjoner og omstrukturering",
      "Aksjonærregisteroppgave (RF-1086)",
      "Kapitalforhøyelse og emisjoner",
      "Due diligence og transaksjonsstøtte",
    ]}
    challenges={[
      { title: "Fritaksmetoden fungerer kun hvis strukturen er riktig.", desc: "Skattefritak på utbytte og gevinst mellom selskaper forutsetter korrekt eierstruktur. En feil i strukturen kan utløse full beskatning. Vi sørger for at det er på stell." },
      { title: "Internprising — feil her koster dyrt.", desc: "Transaksjoner mellom konsernselskaper skal skje på armlengdes vilkår og dokumenteres grundig. Manglende dokumentasjon gir risiko for etterberegning fra skattemyndighetene." },
      { title: "Utbyttebeslutningen er mer kompleks enn den ser ut.", desc: "Tidspunkt, beløp, mottaker og skatteposisjon påvirker nettobeløpet du sitter igjen med. Vi optimaliserer utbyttestrategien løpende." },
      { title: "Omstrukturering er komplisert — men lønnsomt hvis gjort riktig.", desc: "Fisjon, fusjon, aksjesalg eller virksomhetsoverdragelse — vi planlegger og gjennomfører transaksjoner med minimal skattebelastning og full juridisk trygghet." },
    ]}
    whyAvargo={[
      { num: "01", title: "Konsernkompetanse fra dag én.", desc: "Konsernregnskap, elimineringer og internrapportering er komplekst. Vi har gjort dette hundrevis av ganger og kjenner fallgruvene." },
      { num: "02", title: "Skatteoptimalisering som en kontinuerlig prosess.", desc: "Vi gjennomgår kapitalstruktur og utbyttestrategi kvartalsvis — ikke bare når det er for sent å gjøre noe med det." },
      { num: "03", title: "Én kontaktperson for hele konsernet.", desc: "Du slipper å koordinere mellom fem ulike regnskapsbyråer. Vi håndterer alle selskapene under én koordinert leveranse." },
    ]}
    relatedSlugs={[
      { label: "Tech & SaaS", href: "/bransjer/tech-saas" },
      { label: "Eiendom & Utvikling", href: "/bransjer/eiendom" },
    ]}
    ctaHeadline="Strukturen som beskytter formuen og minimerer skatten."
  />
);

export default Holding;
