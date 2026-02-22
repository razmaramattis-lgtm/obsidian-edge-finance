import ServicePageTemplate from "@/components/ServicePageTemplate";

const Arsregnskap = () => (
  <ServicePageTemplate
    meta={{
      title: "Årsregnskap & skattemelding | Avargo",
      description: "Vi tar ansvar for årsoppgjøret fra start til slutt — årsregnskap, noter, skattemelding for selskap og eier. Alt levert innen fristen.",
      canonical: "https://avargo.no/tjenester/arsregnskap",
    }}
    category="Regnskap & Økonomi"
    heroTitle={<>Årsoppgjør uten <span className="italic text-gradient-rose">stress.</span></>}
    heroSubtitle="Vi tar ansvar for årsoppgjøret fra start til slutt — slik at du kan fokusere på driften. Alt leveres innen fristen, uten overraskelser."
    deliverables={[
      "Komplett årsregnskap",
      "Noter til regnskapet",
      "Skattemelding for selskap",
      "Skattemelding for eiere",
      "Aksjonærregisteroppgave",
      "Ligningspapirer & dokumentasjon",
      "Avstemming av balanseposter",
      "Revisjonstøtte ved behov",
    ]}
    whyItems={[
      { num: "01", title: "Ingen overraskelser.", desc: "Vi forbereder årsoppgjøret løpende gjennom året — ikke i panikk den siste uken. Resultatet: et regnskap som er klart i god tid." },
      { num: "02", title: "Skatteoptimalisert.", desc: "Årsoppgjøret er ikke bare et pliktløp — det er en mulighet til å sikre at du betaler riktig skatt. Vi utnytter alle lovlige fradrag." },
      { num: "03", title: "Eier-fokusert.", desc: "Vi tar også skattemeldingen for deg som eier. Utbytte, formue og personlige fradrag — alt er ivaretatt." },
      { num: "04", title: "Alt dokumentert.", desc: "Myndighetene kan be om dokumentasjon. Vi sørger for at alt er ryddig, sporbart og lett tilgjengelig." },
    ]}
    relatedServices={[
      { label: "Dedikert regnskapsfører", href: "/tjenester/regnskapsforer" },
      { label: "Skatteplanlegging", href: "/tjenester/skatteplanlegging" },
      { label: "CFO-as-a-Service", href: "/tjenester/cfo" },
    ]}
    ctaTitle="Klar for årsoppgjøret?"
    ctaSubtitle="Vi tar alt fra start til slutt — du slipper å løfte en finger."
  />
);

export default Arsregnskap;
