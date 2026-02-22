import ServicePageTemplate from "@/components/ServicePageTemplate";

const Ansettelse = () => (
  <ServicePageTemplate
    meta={{
      title: "Ansettelse & rekruttering | Avargo",
      description: "Vi hjelper deg med hele ansettelsesprosessen — fra utlysning til onboarding. Finn riktig person uten å bruke mer tid enn nødvendig.",
      canonical: "https://avargo.no/tjenester/ansettelse",
    }}
    category="HR & Personal"
    heroTitle={<>Finn riktig person — <span className="italic text-gradient-rose">raskere.</span></>}
    heroSubtitle="Vi hjelper deg med hele prosessen — fra utlysning og utvelgelse til arbeidskontrakt og onboarding. Slik at du finner riktig person uten å bruke mer tid enn nødvendig."
    deliverables={[
      "Stillingsutlysning & kravspesifikasjon",
      "Screening & utvelgelse",
      "Arbeidskontrakter & betingelser",
      "Strukturert onboarding",
      "Prøvetidsoppfølging",
      "Referansesjekk",
      "Lønnsforhandling & rådgivning",
      "Arbeidsrettslig veiledning",
    ]}
    whyItems={[
      { num: "01", title: "Hele prosessen.", desc: "Fra du bestemmer deg for å ansette til personen er fullt onboardet. Vi tar ansvar for hvert steg i mellom." },
      { num: "02", title: "Juridisk trygghet.", desc: "Arbeidskontrakter, prøvetidsvilkår og betingelser som er i tråd med gjeldende lovverk. Ingen løse tråder." },
      { num: "03", title: "Strukturert onboarding.", desc: "En god start betyr mer enn de fleste tror. Vi sørger for at nye ansatte føler seg velkomne og produktive fra dag én." },
      { num: "04", title: "Spart tid.", desc: "Rekruttering tar tid. Vi tar den tunge jobben slik at du kan fokusere på det du er best på." },
    ]}
    relatedServices={[
      { label: "Lønn & HR-administrasjon", href: "/tjenester/hr-og-lonn" },
      { label: "Personalhåndbok", href: "/tjenester/personalhandbok" },
      { label: "Arbeidsrett & HMS", href: "/tjenester/arbeidsrett" },
    ]}
    ctaTitle="Klar for å ansette?"
    ctaSubtitle="Vi gjør prosessen enklere og tryggere."
  />
);

export default Ansettelse;
