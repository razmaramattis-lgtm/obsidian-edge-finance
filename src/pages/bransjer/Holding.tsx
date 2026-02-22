import { Landmark } from "lucide-react";
import BransjePage from "@/components/BransjePage";

const Holding = () => (
  <BransjePage
    href="/bransjer/holding"
    icon={Landmark}
    name="Holding & Investering"
    tagline="Strukturen som beskytter deg"
    intro="Mange som investerer i aksjer, eiendom eller andre selskaper oppdager fort at det blir komplisert å holde orden. Vi hjelper deg å bygge en ryddig og trygg struktur — slik at pengene dine er godt ivaretatt og skatten blir så lav som mulig."
    body="Et holdingselskap er et av de smarteste grepene for å beskytte verdier og betale riktig skatt — men det krever at noen holder orden. Vi tar oss av regnskapet for hele selskapsgruppen, sørger for at pengeflyten mellom selskapene er riktig, og at utbytte tas ut på den mest fordelaktige måten."
    deliverables={[
      "Regnskap for selskapsgruppen samlet",
      "Planlegging av utbytte og kapitalflyt",
      "Skattefritt utbytte mellom selskaper",
      "Riktig prising av tjenester mellom egne selskaper",
      "Omorganisering, sammenslåinger og oppdelinger",
      "Aksjonærregisteroppgave",
      "Kapitalforhøyelse og nye aksjer",
      "Klargjøring av tall ved kjøp og salg",
    ]}
    challenges={[
      { title: "Skattefritt utbytte forutsetter at strukturen er riktig.", desc: "Muligheten til å flytte penger mellom egne selskaper uten skatt gjelder bare hvis alt er satt opp korrekt. Én feil kan utløse full beskatning. Vi sørger for at det stemmer." },
      { title: "Prising mellom egne selskaper — feil her koster dyrt.", desc: "Når du handler mellom egne selskaper, skal prisene gjenspeile det som ville vært normalt mellom fremmede parter. Vi dokumenterer alt riktig." },
      { title: "Utbytte er mer enn bare å ta ut penger.", desc: "Tidspunkt, beløp og skatteposisjon påvirker hva du faktisk sitter igjen med. Vi planlegger dette løpende gjennom året." },
      { title: "Omorganisering kan spare deg for mye — hvis det gjøres riktig.", desc: "Å dele opp eller slå sammen selskaper er komplekst, men kan være veldig lønnsomt. Vi planlegger og gjennomfører det med minimal skatt." },
    ]}
    whyAvargo={[
      { num: "01", title: "Vi har gjort dette mange ganger.", desc: "Regnskap for selskapsgrupper og rapportering på tvers av selskaper er krevende. Vi kjenner fallgruvene." },
      { num: "02", title: "Skatteplanlegging som pågår hele tiden.", desc: "Vi gjennomgår strukturen og utbyttestrategien jevnlig — ikke bare når det er for sent å gjøre noe med det." },
      { num: "03", title: "Én person for hele gruppen.", desc: "Du slipper å koordinere mellom flere. Vi håndterer alle selskapene under én koordinert leveranse." },
    ]}
    relatedSlugs={[
      { label: "Tech & SaaS", href: "/bransjer/tech-saas" },
      { label: "Eiendom & Utvikling", href: "/bransjer/eiendom" },
    ]}
    ctaHeadline="Strukturen som beskytter formuen og minimerer skatten."
  />
);

export default Holding;
