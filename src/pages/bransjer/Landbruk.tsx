import { Tractor } from "lucide-react";
import BransjePage from "@/components/BransjePage";

const Landbruk = () => (
  <BransjePage
    icon={Tractor}
    name="Landbruk"
    tagline="Vi kjenner gårdens rytme"
    intro="Landbruk er en bransje med sin helt egen hverdag — sesongsvingninger, dyr, maskiner og støtteordninger. Vi kjenner til hva som gjelder for bønder og sørger for at du aldri går glipp av det du har krav på."
    body="Landbruksøkonomi er unikt komplekst: jordbruksfradrag, produksjonstilskudd, skogbruksbeskatning, driftsplan og tilskuddsordninger fra Landbruksdirektoratet. I tillegg er sesongbasert kontantstrøm en utfordring som krever presis planlegging gjennom hele året. Vår regnskapsfører kjenner disse reglene — du slipper å lære dem selv."
    deliverables={[
      "Jordbruksfradrag og næringsinntekt",
      "Produksjonstilskudd og RMP-tilskudd",
      "Skogbruksregnskap og tilvekstberegning",
      "MVA i landbruk (særregler)",
      "Maskin- og driftskapital",
      "Budsjettering for sesongbasert kontantstrøm",
      "Generasjonsskifte og overdragelse",
      "SAK-oppgaver og ligningsdokumenter",
    ]}
    challenges={[
      { title: "Jordbruksfradraget utnyttes sjelden fullt ut.", desc: "Maksimalt jordbruksfradrag er 190 400 kr — men mange bønder benytter ikke hele beløpet fordi regnskapet ikke er satt opp riktig. Vi sørger for at du tar ut det du har krav på." },
      { title: "Sesongbasert kontantstrøm krever presis planlegging.", desc: "Store inntekter på høst og store utgifter på vår. Uten god budsjettering kan likviditeten bli presset akkurat når det er minst rom for det." },
      { title: "Generasjonsskifte i landbruk er komplekst.", desc: "Overdragelse av gårdsbruk har egne skatteregler for arv, gavesalg og odelsrett. Vi planlegger generasjonsskiftet slik at skattebelastningen minimeres for alle parter." },
      { title: "Tilskuddsordninger er mange og krevende.", desc: "Produksjonstilskudd, regionalt miljøprogram (RMP), velferdsordninger og investeringstilskudd — vi holder oversikt over søknadsfrister og dokumentasjonskrav." },
    ]}
    whyAvargo={[
      { num: "01", title: "Regnskapsfører med landbruksbakgrunn.", desc: "Vi kjenner terminologien, regelverket og hverdagen på gården. Du slipper å bruke møtetid på å forklare hva en kvote eller et SAK-krav er." },
      { num: "02", title: "Maksimale fradrag — alltid.", desc: "Jordbruksfradrag, maskinutgifter, driftsutgifter og investeringsavskrivninger optimaliseres løpende gjennom året — ikke bare ved årsoppgjøret." },
      { num: "03", title: "Planlegging over generasjoner.", desc: "Vi tenker langsiktig. Generasjonsskifte, strukturvalg og skatteoptimalisering planlegges i god tid — ikke i siste liten." },
    ]}
    quote={{ text: "Regnskapsføreren vår hos Avargo forstår landbruk. Han vet hva en kvote er, hva et jordbruksfradrag er, og hva sesongvariasjon gjør med likviditeten. Det er unikt.", author: "Eier, Gårdsbruk i Trøndelag" }}
    relatedSlugs={[
      { label: "Varehandel", href: "/bransjer/varehandel" },
      { label: "Eiendom & Utvikling", href: "/bransjer/eiendom" },
    ]}
    ctaHeadline="En regnskapsfører som kjenner gårdens rytme."
  />
);

export default Landbruk;
