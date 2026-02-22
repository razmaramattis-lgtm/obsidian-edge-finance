import ServicePageTemplate from "@/components/ServicePageTemplate";

const Skatteplanlegging = () => (
  <ServicePageTemplate
    meta={{
      title: "Skatteplanlegging & rådgivning | Avargo",
      description: "Proaktiv skatterådgivning som sikrer at du betaler riktig skatt. Lønn vs. utbytte, fradragsoptimalisering og selskapsstrukturering.",
      canonical: "https://avargo.no/tjenester/skatteplanlegging",
    }}
    category="Regnskap & Økonomi"
    heroTitle={<>Betal riktig skatt — <span className="italic text-gradient-rose">ikke for mye.</span></>}
    heroSubtitle="Proaktiv rådgivning som sikrer at du betaler riktig skatt — verken for mye eller for lite. Vi planlegger gjennom hele året, ikke bare ved årsslutt."
    deliverables={[
      "Lønn vs. utbytte-vurdering",
      "Fradragsoptimalisering",
      "Selskapsstrukturering",
      "Formuesplanlegging",
      "Skatteoptimalisering ved investering",
      "Planlegging av utbyttepolitikk",
      "Generasjonsskifte & eierbytte",
      "Løpende skatterådgivning",
    ]}
    whyItems={[
      { num: "01", title: "Proaktiv, ikke reaktiv.", desc: "Vi venter ikke til årsoppgjøret. Skatteplanlegging skjer løpende — slik at du tar de riktige beslutningene i sanntid." },
      { num: "02", title: "Helhetlig perspektiv.", desc: "Vi ser selskapet og deg som eier under ett. Lønn, utbytte, formue og investeringer optimaliseres samlet." },
      { num: "03", title: "Lovlig minimering.", desc: "Det handler ikke om å unngå skatt — men om å betale det som er riktig. Vi utnytter alle lovlige muligheter." },
      { num: "04", title: "Langsiktig strategi.", desc: "God skatteplanlegging handler om å tenke langsiktig. Vi lager en plan som varer — ikke en quick fix." },
    ]}
    relatedServices={[
      { label: "Dedikert regnskapsfører", href: "/tjenester/regnskapsforer" },
      { label: "CFO-as-a-Service", href: "/tjenester/cfo" },
      { label: "Årsregnskap & skattemelding", href: "/tjenester/arsregnskap" },
    ]}
    ctaTitle="Smartere skattestrategi."
    ctaSubtitle="La oss se på mulighetene dine — helt uforpliktende."
  />
);

export default Skatteplanlegging;
