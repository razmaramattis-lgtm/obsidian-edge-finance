import { Store } from "lucide-react";
import BransjePage from "@/components/BransjePage";

const NettbutikkBransje = () => (
  <BransjePage
    icon={Store}
    name="Nettbutikk & E-commerce"
    tagline="Skalér trygt — vi har ryggen din"
    intro="Å drive nettbutikk kan vokse raskt, og det kan fort bli kaotisk. Vi hjelper deg å holde styr på inntekter, avgifter og kostnader — uansett om du selger til norske eller utenlandske kunder."
    body="E-handel krever spesialkunnskap om MVA på tvers av landegrenser, integrasjon av betalingsplattformer, lagerstyring og automatisert ordreøkonomi. Mange nettbutikkeiere oppdager for sent at de har MVA-plikter i utlandet, eller at marginalene er dårligere enn antatt fordi fraktkostnader og returer ikke er korrekt innkalkulert."
    deliverables={[
      "Norsk og internasjonal MVA (OSS-regelverket)",
      "Integrasjon mot Shopify, WooCommerce, Klarna",
      "Lagerregnskap og varekostnad",
      "Returhåndtering og kreditnotaer",
      "Fraktkostnader og toll for importvarer",
      "Betalingsplattformer (Stripe, Vipps, PayPal)",
      "Marginanalyse per produktkategori",
      "Skattemelding og årsregnskap",
    ]}
    challenges={[
      { title: "EU-MVA (OSS) er obligatorisk over 10 000 EUR.", desc: "Selger du til EU-kunder for mer enn 10 000 EUR per år, har du MVA-registreringsplikt i EU. Vi sørger for at du er registrert og rapporterer korrekt." },
      { title: "Returer spiser marginen uten at du merker det.", desc: "En returandel på 20 % endrer bruttomarginbildet dramatisk. Vi setter opp rapportering som viser reell margin etter returer og fraktkostnader." },
      { title: "Integrasjoner mellom plattformer er en datakildekacofoni.", desc: "Shopify, Klarna, Stripe og Vipps sender data i ulike formater. Vi automatiserer dataflyten slik at regnskapet alltid er oppdatert uten manuell behandling." },
      { title: "Vekst uten likviditetsstyring er et sjansespill.", desc: "Bestilling av varer i god tid og betaling fra kunder med forsinkelse skaper gap. Vi budsjetteterer kontantstrøm og varsler ved likviditetsrisiko." },
    ]}
    whyAvargo={[
      { num: "01", title: "E-handelsspesialister.", desc: "Vi forstår nettbutikkens økonomi — MVA på tvers av landegrenser, plattformintegrasjoner og automatisering av ordreøkonomien." },
      { num: "02", title: "Automatisert bilagsflyt fra alle plattformer.", desc: "Shopify-ordre, Stripe-betaling og Klarna-avregning hentes automatisk inn. Du slipper å laste ned og laste opp data manuelt." },
      { num: "03", title: "Skalerer med deg.", desc: "Fra 100 til 100 000 ordre per måned — vi setter opp systemer som håndterer veksten uten at regnskapet kollapser." },
    ]}
    relatedSlugs={[
      { label: "Varehandel", href: "/bransjer/varehandel" },
      { label: "Tech & SaaS", href: "/bransjer/tech-saas" },
    ]}
    ctaHeadline="Vekst uten å miste kontrollen på tallene."
  />
);

export default NettbutikkBransje;
