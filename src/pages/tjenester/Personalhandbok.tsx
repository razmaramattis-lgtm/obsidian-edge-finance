import ServicePageTemplate from "@/components/ServicePageTemplate";

const Personalhandbok = () => (
  <ServicePageTemplate
    meta={{
      title: "Personalhåndbok & reglementer | Avargo",
      description: "En komplett og oppdatert personalhåndbok tilpasset din bedrift. Arbeidsreglement, varslingsrutiner og permisjonsregler — alt på plass.",
      canonical: "https://avargo.no/tjenester/personalhandbok",
    }}
    category="HR & Personal"
    heroTitle={<>Dokumentasjonen <span className="italic text-gradient-rose">på plass.</span></>}
    heroSubtitle="En komplett og oppdatert personalhåndbok som dekker alt fra arbeidsreglement til feriepolitikk. Vi sørger for at din bedrift har dokumentasjonen på plass."
    deliverables={[
      "Tilpasset personalhåndbok",
      "Arbeidsreglement",
      "Varslingsrutiner",
      "Etiske retningslinjer",
      "Permisjonsregler & fravær",
      "IT- og sikkerhetspolicy",
      "Feriepolitikk & retningslinjer",
      "Løpende oppdatering ved lovendringer",
    ]}
    whyItems={[
      { num: "01", title: "Tilpasset din bedrift.", desc: "Ingen generiske maler. Personalhåndboken tilpasses din bransje, kultur og størrelse — slik at den faktisk brukes." },
      { num: "02", title: "Juridisk dekning.", desc: "Alle dokumenter er utarbeidet i tråd med arbeidsmiljøloven og oppdateres ved lovendringer." },
      { num: "03", title: "Forebygger konflikter.", desc: "Klare regler og forventninger forebygger misforståelser og konflikter. Det er billigere å forebygge enn å reparere." },
      { num: "04", title: "Digital og tilgjengelig.", desc: "Håndboken leveres digitalt og er lett tilgjengelig for alle ansatte. Alltid oppdatert, alltid tilgjengelig." },
    ]}
    relatedServices={[
      { label: "Lønn & HR-administrasjon", href: "/tjenester/hr-og-lonn" },
      { label: "Ansettelse & rekruttering", href: "/tjenester/ansettelse" },
      { label: "Arbeidsrett & HMS", href: "/tjenester/arbeidsrett" },
    ]}
    ctaTitle="Har du dokumentasjonen på plass?"
    ctaSubtitle="Vi hjelper deg med å bygge en solid grunnmur for personalarbeidet."
  />
);

export default Personalhandbok;
