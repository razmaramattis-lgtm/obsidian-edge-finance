import { Tractor } from "lucide-react";
import BransjePage from "@/components/BransjePage";

const Landbruk = () => (
  <BransjePage
    href="/bransjer/landbruk"
    icon={Tractor}
    name="Landbruk"
    tagline="Vi kjenner gårdens rytme"
    intro="Landbruk er en bransje med sin helt egen hverdag — sesongsvingninger, dyr, maskiner og støtteordninger. Vi kjenner til hva som gjelder og sørger for at du aldri går glipp av det du har krav på."
    body="Økonomi i landbruket er sammensatt: det finnes egne fradrag, en rekke tilskuddsordninger og spesielle skatteregler for skogbruk. I tillegg gjør sesongene at pengene kommer ujevnt gjennom året. Vi holder styr på alt dette — slik at du kan bruke tiden din på gården."
    deliverables={[
      "Fradrag som gjelder spesifikt for landbruk",
      "Søknad om produksjonstilskudd og andre støtteordninger",
      "Regnskap for skogbruk",
      "Avgiftsregler som gjelder for bønder",
      "Maskiner og utstyr i regnskapet",
      "Planlegging av pengestrøm gjennom sesongen",
      "Generasjonsskifte og overdragelse av gård",
      "Skattemelding og årsregnskap",
    ]}
    challenges={[
      { title: "Mange bønder utnytter ikke fradragene sine fullt ut.", desc: "Det finnes fradrag som er laget spesielt for landbruk, men som mange ikke benytter fordi regnskapet ikke er satt opp for det. Vi sørger for at du tar ut alt du har krav på." },
      { title: "Pengene kommer ujevnt gjennom året.", desc: "Store inntekter på høsten og store utgifter om våren. Uten god planlegging kan det bli trangt akkurat når du trenger det minst." },
      { title: "Å overføre gården til neste generasjon er komplekst.", desc: "Det finnes egne regler for overdragelse av gårdsbruk. Vi planlegger slik at skattebelastningen blir minst mulig for alle parter." },
      { title: "Det er mange støtteordninger — og mange søknadsfrister.", desc: "Produksjonstilskudd, miljøstøtte og investeringstilskudd — vi holder oversikt over frister og dokumentasjonskrav for deg." },
    ]}
    whyAvargo={[
      { num: "01", title: "Vi kjenner hverdagen din.", desc: "Vi forstår hvordan et gårdsbruk fungerer økonomisk — du trenger ikke bruke tid på å forklare." },
      { num: "02", title: "Maksimale fradrag — alltid.", desc: "Fradrag, avskrivninger og tilskudd følges opp løpende gjennom hele året — ikke bare ved årsoppgjøret." },
      { num: "03", title: "Vi tenker langsiktig.", desc: "Generasjonsskifte, strukturvalg og skatteoptimalisering planlegges i god tid — ikke i siste liten." },
    ]}
    relatedSlugs={[
      { label: "Varehandel", href: "/bransjer/varehandel" },
      { label: "Eiendom & Utvikling", href: "/bransjer/eiendom" },
    ]}
    ctaHeadline="En regnskapsfører som kjenner gårdens rytme."
  />
);

export default Landbruk;
