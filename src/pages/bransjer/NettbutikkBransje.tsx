import { Store } from "lucide-react";
import BransjePage from "@/components/BransjePage";

const NettbutikkBransje = () => (
  <BransjePage
    href="/bransjer/nettbutikk"
    icon={Store}
    name="Nettbutikk & E-commerce"
    tagline="Skalér trygt — vi har ryggen din"
    intro="Å drive nettbutikk kan vokse raskt, og det kan fort bli kaotisk. Vi hjelper deg å holde styr på inntekter, avgifter og kostnader — uansett om du selger til norske eller utenlandske kunder."
    body="Nettbutikk krever at du holder styr på avgifter som kan variere fra land til land, at betalingsløsningene kobles riktig inn, og at du faktisk vet hva du sitter igjen med etter frakt og returer. Vi sørger for at alt er på stell — slik at du kan fokusere på å selge."
    deliverables={[
      "Avgifter ved salg til Norge og utlandet",
      "Integrering med Shopify, WooCommerce og betalingsløsninger",
      "Oversikt over lagerverdier og varekostnad",
      "Riktig håndtering av returer og kreditering",
      "Frakt, toll og import",
      "Kobling mot Stripe, Vipps og andre betalingsløsninger",
      "Analyse av marginer per produktkategori",
      "Skattemelding og årsregnskap",
    ]}
    challenges={[
      { title: "Selger du til utlandet? Da gjelder egne avgiftsregler.", desc: "Over en viss grense har du plikt til å registrere deg for avgifter i andre land. Vi sørger for at du er registrert og rapporterer riktig." },
      { title: "Returer spiser marginen uten at du merker det.", desc: "En høy returandel endrer lønnsomhetsbildet dramatisk. Vi viser deg den reelle marginen etter returer og frakt." },
      { title: "Data fra ulike systemer skal inn i regnskapet.", desc: "Butikkplattform, betalingsløsning og bank sender data i ulike formater. Vi automatiserer alt slik at regnskapet alltid er oppdatert." },
      { title: "Vekst uten kontroll på pengene er et sjansespill.", desc: "Du bestiller varer lenge før kundene betaler. Vi planlegger pengestrømmen og varsler ved risiko." },
    ]}
    whyAvargo={[
      { num: "01", title: "Vi forstår netthandel.", desc: "Avgifter på tvers av landegrenser, plattformintegrasjoner og automatisering — vi kjenner utfordringene og løser dem." },
      { num: "02", title: "Alt hentes inn automatisk.", desc: "Ordre, betalinger og avregninger kobles automatisk til regnskapet. Du slipper å gjøre noe manuelt." },
      { num: "03", title: "Vokser med deg.", desc: "Fra noen titalls ordre til tusenvis i måneden — vi setter opp systemer som tåler veksten." },
    ]}
    relatedSlugs={[
      { label: "Varehandel", href: "/bransjer/varehandel" },
      { label: "Tech & SaaS", href: "/bransjer/tech-saas" },
    ]}
    ctaHeadline="Vekst uten å miste kontrollen på tallene."
  />
);

export default NettbutikkBransje;
