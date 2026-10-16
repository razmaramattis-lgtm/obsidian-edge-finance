import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight, CheckCircle2 } from "lucide-react";

// Tekst godkjent i «Avargo.no – tekstutkast: lokale sider og bytte regnskapsfører» (okt. 2026).

const URL = "https://avargo.no/bytte-regnskapsforer";
const TITLE = "Bytte regnskapsfører – slik går det til, og hva det koster | Avargo";
const DESCRIPTION =
  "Vil du bytte regnskapsfører? Vi tar kontakt med forrige regnskapsfører, henter historikken og tar over uten opphold. Fast månedspris. Fiken, Tripletex og andre systemer.";

const STEPS = [
  { t: "Kort samtale.", d: "Vi går gjennom selskapet, volumet og hva du trenger hjelp til. Du får et tilbud med fast månedspris." },
  { t: "Avtale og oppstart.", d: "Vi signerer oppdragsavtale, gjennomfører kundekontroll og avtaler hvilken dato vi tar over fra." },
  {
    t: "Kontakt med forrige regnskapsfører.",
    d: "Vi tar kontakt med din nåværende regnskapsfører, slik god regnskapsføringsskikk krever, og avtaler overlevering av bilag, avstemminger og åpne saker.",
  },
  { t: "Tilganger.", d: "Vi registreres som regnskapsfører for selskapet og får tilgang i Altinn og regnskapssystemet." },
  { t: "Vi er i gang.", d: "Vi kontrollerer åpningsbalansen og overtar løpende bokføring, MVA og lønn fra den avtalte datoen." },
];

const REASONS = [
  "De får sent eller ikke svar på spørsmål.",
  "Fakturaene varierer fra måned til måned og er vanskelige å forstå.",
  "De får tall, men ingen råd om hva tallene betyr.",
  "Det er ny kontaktperson hver gang.",
  "Frister blir nådd i siste liten.",
  "Det mangler faglig kvalitet og rådgivning.",
];

const FAQ = [
  {
    q: "Kan jeg bytte regnskapsfører midt i året?",
    a: "Ja. Vi avtaler en dato vi tar over fra, og forrige regnskapsfører avslutter arbeidet frem til den datoen. Det er ingen grunn til å vente til nytt år.",
  },
  {
    q: "Hvor lang oppsigelsestid har jeg hos nåværende regnskapsfører?",
    a: "Det står i oppdragsavtalen din. Den er ofte mellom én og tre måneder. Vi kan begynne forberedelsene i oppsigelsestiden, så overgangen blir sømløs.",
  },
  {
    q: "Må jeg selv si fra til forrige regnskapsfører?",
    a: "Du sier opp avtalen din selv. Etter det tar vi kontakten med forrige regnskapsfører og ordner overleveringen.",
  },
  {
    q: "Hva skjer med regnskapet og historikken?",
    a: "Eier selskapet lisensen i regnskapssystemet, blir alt liggende der og vi får tilgang. Eier forrige regnskapsfører lisensen, flyttes regnskapet over til selskapets egen lisens eller eksporteres. Bilag og dokumentasjon skal oppbevares uansett, så ingenting går tapt.",
  },
  {
    q: "Må jeg bytte regnskapsprogram?",
    a: "Nei, ikke nødvendigvis. Vi jobber i Fiken, Tripletex, Conta og andre vanlige systemer. Vi kan anbefale det som passer for din drift og størrelse.",
  },
  {
    q: "Hva skjer med frister mens vi bytter?",
    a: "Vi avtaler hvem som har ansvaret for hver periode. Forrige regnskapsfører leverer det som gjelder perioden før overtakelsen, og vi tar alt fra overtakelsesdatoen. Vi går gjennom fristene sammen med deg ved oppstart.",
  },
  {
    q: "Koster det noe å bytte?",
    a: "Det er ingen ekstrakostnad for å bytte. Forrige regnskapsfører kan ta betalt for arbeid som gjenstår frem til overtakelsen, i tråd med avtalen du har med dem. Ønsker du bistand med opprydning vurderes dette individuelt og avklares på forhånd.",
  },
  {
    q: "Hvem har ansvaret for regnskapet?",
    a: "Daglig leder og styret har det formelle ansvaret for at regnskapet er riktig. Vi gjør jobben, følger opp fristene og sier fra om noe må rettes.",
  },
];

const BytteRegnskapsforer = () => {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Slik bytter du regnskapsfører",
    step: STEPS.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.t.replace(/\.$/, ""), text: s.d })),
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Hjem", item: "https://avargo.no/" },
      { "@type": "ListItem", position: 2, name: "Bytte regnskapsfører", item: URL },
    ],
  };

  return (
    <>
      <Helmet>
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <link rel="canonical" href={URL} />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:url" content={URL} />
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(howToJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Overskrift og ingress */}
        <section className="relative overflow-hidden border-b border-border/10 pt-12 md:pt-20 pb-16 md:pb-24">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />
          <div className="container mx-auto px-5 md:px-6 relative">
            <nav className="flex items-center gap-2 text-[12px] text-foreground/40 mb-6" aria-label="Brødsmuler">
              <Link to="/" className="hover:text-foreground/70">Hjem</Link>
              <span>/</span>
              <span className="text-foreground/60">Bytte regnskapsfører</span>
            </nav>
            <div className="max-w-3xl">
              <p className="text-[11px] tracking-[0.3em] uppercase text-primary/70 mb-4">Bytte regnskapsfører</p>
              <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-light leading-[1.05] text-foreground mb-6">
                Bytt regnskapsfører <span className="text-primary">uten styr</span>
              </h1>
              <p className="text-lg md:text-xl text-foreground/70 font-light leading-relaxed max-w-2xl mb-10">
                Er du misfornøyd med svartid, pris eller oppfølging, er det enklere å bytte enn mange tror. Vi tar kontakt med din nåværende regnskapsfører, henter det vi trenger og tar over fra en avtalt dato. Du fortsetter i regnskapssystemet du allerede bruker.
              </p>
              <Link to="/kontakt" className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-primary text-primary-foreground text-[14px] font-medium hover:scale-[1.02] transition-transform">
                Få et fastpristilbud
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* Slik går byttet til */}
        <section className="py-16 md:py-24 border-b border-border/10">
          <div className="container mx-auto px-5 md:px-6">
            <div className="max-w-3xl">
              <h2 className="font-serif text-3xl md:text-5xl font-light text-foreground mb-10">Slik går byttet til</h2>
              <ol className="space-y-4">
                {STEPS.map((s, i) => (
                  <li key={s.t} className="flex gap-5 p-5 rounded-2xl border border-border/15 bg-card/20">
                    <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[14px] font-medium shrink-0">
                      {i + 1}
                    </span>
                    <p className="text-foreground/70 font-light leading-relaxed">
                      <span className="font-medium text-foreground">{s.t}</span> {s.d}
                    </p>
                  </li>
                ))}
              </ol>
              <p className="mt-6 text-foreground/65 font-light">De fleste bytter tar 2–4 uker fra første samtale til vi er i gang.</p>
            </div>
          </div>
        </section>

        {/* System og pris */}
        <section className="py-16 md:py-24 border-b border-border/10">
          <div className="container mx-auto px-5 md:px-6">
            <div className="grid md:grid-cols-2 gap-12 max-w-5xl">
              <div>
                <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground mb-6">Du beholder systemet ditt</h2>
                <p className="text-foreground/65 font-light text-lg leading-relaxed">
                  Vi jobber i blant annet Fiken, Tripletex, Conta og andre skybaserte regnskapssystemer. Bruker du et annet program, finner vi en løsning sammen.
                </p>
              </div>
              <div>
                <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground mb-6">Hva koster det?</h2>
                <p className="text-foreground/65 font-light text-lg leading-relaxed mb-6">
                  Du får fast månedspris, slik at du vet hva regnskapet koster hver måned. Prisen avhenger av selskapsform, omsetning, antall bilag og om du har ansatte. For et lite AS starter prisen på 1 950 kr per måned eks. mva. Bruk kalkulatoren for et estimat for ditt selskap.
                </p>
                <Link to="/priser" className="group inline-flex items-center gap-2 px-6 py-3 rounded-full border border-primary/30 text-primary text-[14px] font-medium hover:bg-primary/5 transition-colors">
                  Se hva det koster for deg
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Grunner og målgruppe */}
        <section className="py-16 md:py-24 border-b border-border/10">
          <div className="container mx-auto px-5 md:px-6">
            <div className="grid md:grid-cols-2 gap-12 max-w-5xl">
              <div>
                <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground mb-6">Typiske grunner til at bedrifter bytter</h2>
                <ul className="space-y-3">
                  {REASONS.map((r) => (
                    <li key={r} className="flex gap-3 text-foreground/75 font-light leading-relaxed">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground mb-6">Hvem vi passer for</h2>
                <p className="text-foreground/65 font-light text-lg leading-relaxed">
                  Vi hjelper små og mellomstore bedrifter innen helse, konsulentvirksomhet, skjønnhet, velvære og andre tjenester, både AS og enkeltpersonforetak. Kontoret ligger i Lillestrøm, og vi møter kunder i Oslo og omegn etter avtale. Det meste av samarbeidet skjer digitalt.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Spørsmål og svar */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-5 md:px-6">
            <div className="max-w-3xl mx-auto">
              <p className="text-[11px] tracking-[0.3em] uppercase text-primary/70 mb-4">Vanlige spørsmål</p>
              <h2 className="font-serif text-3xl md:text-5xl font-light text-foreground mb-12">Spørsmål og svar om å bytte</h2>
              <div className="space-y-4">
                {FAQ.map((f) => (
                  <details key={f.q} className="group rounded-2xl border border-border/15 bg-card/30 p-6">
                    <summary className="cursor-pointer flex items-center justify-between gap-4 font-serif text-lg text-foreground">
                      {f.q}
                      <ArrowRight className="w-4 h-4 text-primary group-open:rotate-90 transition-transform shrink-0" />
                    </summary>
                    <p className="mt-4 text-foreground/65 font-light leading-relaxed">{f.a}</p>
                  </details>
                ))}
              </div>
              <div className="mt-12 text-center">
                <Link to="/kontakt" className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-primary text-primary-foreground text-[14px] font-medium hover:scale-[1.02] transition-transform">
                  Få et fastpristilbud
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default BytteRegnskapsforer;
