import { Zap } from "lucide-react";
import BransjePage from "@/components/BransjePage";

const Handverkere = () => (
  <BransjePage
    icon={Zap}
    name="Håndverkere & Fagfolk"
    tagline="Fagmann på jobb, vi tar resten"
    intro="Enten du er elektriker, rørlegger, maler eller tømrer — vi vet at du vil bruke dagene ute hos kunder, ikke ved skrivebordet. Vi sørger for at alt det administrative er i orden mens du gjør jobben din."
    body="Håndverk er en bransje der du kan jobben din — men der papirarbeidet bare øker. Krav til sikkerhetskort, dokumentasjon, fakturering og godkjenninger gjør at det administrative kan ta mer tid enn det burde. Vi tar alt det fra deg."
    deliverables={[
      "Løpende bokføring og fakturering",
      "MVA-rapportering og årsoppgjør",
      "Lønnskjøring for ansatte og lærlinger",
      "Dokumentasjon for sikkerhet og internkontroll",
      "Godkjenningsdokumentasjon",
      "Avskrivning av maskiner og biler",
      "Reise- og diettgodtgjørelse",
      "Budsjettering for anbud og prosjekter",
    ]}
    challenges={[
      { title: "Mange fakturerer for sjelden — og det koster.", desc: "Å fakturere for sent skaper likviditetspress selv om ordrebøkene er fulle. Vi setter opp rutiner for jevn fakturering." },
      { title: "Avgiftsreglene mellom aktører i byggebransjen er strenge.", desc: "Vi sørger for at du alltid fakturerer riktig og unngår feil som kan gi deg problemer." },
      { title: "Lærlinger og godkjenninger krever dokumentasjon.", desc: "Kontrakter, fremdrift og tilskudd krever at alt er på plass. Vi holder orden for deg." },
      { title: "Biler og maskiner er store investeringer.", desc: "Hvordan du behandler de i regnskapet har stor innvirkning på skatten din. Vi sørger for at det gjøres mest mulig fordelaktig." },
    ]}
    whyAvargo={[
      { num: "01", title: "Vi kjenner kravene i bransjen.", desc: "Sikkerhetskort, godkjenninger og lærlingeordninger — vi vet hva som kreves og sørger for at alt er i orden." },
      { num: "02", title: "Jevn pengestrøm hele året.", desc: "Vi setter opp faktureringsrutiner som sikrer at du alltid kan betale lønningene — uansett sesong." },
      { num: "03", title: "Tilgjengelig når det passer deg.", desc: "Du er ute hos kunder hele dagen. Oss kan du ringe på vei til neste jobb og få svar med en gang." },
    ]}
    relatedSlugs={[
      { label: "Bygg & Anlegg", href: "/bransjer/bygg-anlegg" },
      { label: "Eiendom & Utvikling", href: "/bransjer/eiendom" },
    ]}
    ctaHeadline="Du bygger. Vi holder orden i papirene."
  />
);

export default Handverkere;
