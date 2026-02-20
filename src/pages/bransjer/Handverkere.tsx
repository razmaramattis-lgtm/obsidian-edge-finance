import { Zap } from "lucide-react";
import BransjePage from "@/components/BransjePage";

const Handverkere = () => (
  <BransjePage
    icon={Zap}
    name="Håndverkere & Fagfolk"
    tagline="Fagmann på jobb, vi tar resten"
    intro="Enten du er elektriker, rørlegger, maler eller tømrer — vi vet at du vil bruke dagene ute hos kunder, ikke ved skrivebordet. Vi sørger for at alt det administrative er i orden mens du gjør jobben din."
    body="Håndverk er en bransje der fagekspertisen er udiskutabel — men der de administrative kravene stadig øker. Sentralt godkjenningskrav, HMS-kort, dokumentasjon av faglig ansvarlig, og krav til fakturainnhold gjør at det administrative kan ta mer tid enn det burde. Vi tar det fra deg."
    deliverables={[
      "Løpende bokføring og prosjektfakturering",
      "MVA-rapportering og årsoppgjør",
      "Lønnskjøring for fagarbeidere og lærlinger",
      "HMS-dokumentasjon og internkontroll",
      "Sentralt godkjenningsdokumentasjon",
      "Maskin- og kjøretøyavskrivninger",
      "Reise- og diettgodtgjørelse",
      "Anbud- og prosjektbudsjettering",
    ]}
    challenges={[
      { title: "Fakturering til riktig tid er kritisk for likviditeten.", desc: "Mange håndverkere fakturerer for sjelden eller for sent — noe som skaper likviditetspress selv om ordrereservene er fulle. Vi setter opp rutiner for løpende fakturering." },
      { title: "Moms på byggetjenester — reglene er strenge.", desc: "Omvendt avgiftsplikt mellom MVA-pliktige og krav til fakturakjøring stiller krav til korrekt MVA-behandling. Vi sikrer at du alltid fakturerer riktig." },
      { title: "Lærlingeordninger og faglige krav må dokumenteres.", desc: "Lærlingkontrakten, progresjonsmåling og tilskudd fra Vigo og Lånekassen krever dokumentasjon. Vi hjelper deg å holde orden på alle kravene." },
      { title: "Kjøretøy og maskiner er store investeringer som påvirker skatten.", desc: "Avskrivninger på firmabiler, spesialbiler og maskiner har stor innvirkning på skatteposisjonen. Vi optimaliserer avskrivningsplanen for deg." },
    ]}
    whyAvargo={[
      { num: "01", title: "Vi kjenner håndverkets bransjelogikk.", desc: "Fra sentralt godkjenningskrav til HMS-kort og lærlingeordninger — vi kjenner regelverket og sørger for at du alltid er i henhold til kravene." },
      { num: "02", title: "Fakturering og likviditet i fokus.", desc: "Vi setter opp faktureringsrutiner som sikrer jevn kontantstrøm — slik at du alltid kan betale lønningene i tide, uansett sesong." },
      { num: "03", title: "Tilgjengelig på telefon — som deg selv.", desc: "Du er ute hos kunder hele dagen. Oss kan du ringe på vei til neste jobb, og få svar umiddelbart. Ingen kø, ingen ventetid." },
    ]}
    relatedSlugs={[
      { label: "Bygg & Anlegg", href: "/bransjer/bygg-anlegg" },
      { label: "Eiendom & Utvikling", href: "/bransjer/eiendom" },
    ]}
    ctaHeadline="Du bygger. Vi holder orden i papirene."
  />
);

export default Handverkere;
