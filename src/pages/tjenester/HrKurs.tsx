import ServicePageTemplate from "@/components/ServicePageTemplate";

const HrKurs = () => (
  <ServicePageTemplate
    meta={{
      title: "HR & arbeidsgiveransvar — kurs | Avargo",
      description: "Kurs i arbeidsrett, lønnsprosesser og personalledelse. Forstå regelverket og ta bedre beslutninger som arbeidsgiver.",
      canonical: "https://avargo.no/tjenester/hr-kurs",
    }}
    category="Kurs & Opplæring"
    heroTitle={<>Bli en bedre <span className="italic text-gradient-rose">arbeidsgiver.</span></>}
    heroSubtitle="Kurs i arbeidsrett, lønnsprosesser og personalledelse. For deg som vil forstå regelverket og ta bedre beslutninger som arbeidsgiver."
    deliverables={[
      "Arbeidsmiljøloven i praksis",
      "Lønn & feriepenger",
      "Onboarding & offboarding",
      "Personalhåndbok & reglement",
      "Sykefraværsoppfølging",
      "Oppsigelse & sluttavtaler",
      "Kursmateriale inkludert",
      "Kursbevis / sertifisering",
    ]}
    whyItems={[
      { num: "01", title: "Praktisk fokus.", desc: "Ikke teori i vakuum. Vi bruker reelle eksempler og caser fra norsk arbeidsliv — slik at du kan bruke kunnskapen med én gang." },
      { num: "02", title: "Oppdatert regelverk.", desc: "Arbeidsretten endres. Vi sørger for at du alltid lærer gjeldende regler og praksis." },
      { num: "03", title: "Tilpasset ditt nivå.", desc: "Enten du er fersk leder eller erfaren HR-ansvarlig — kurset tilpasses ditt utgangspunkt." },
      { num: "04", title: "Sertifisert.", desc: "Du får kursbevis som dokumenterer gjennomføring. Verdifullt for deg og for bedriften." },
    ]}
    relatedServices={[
      { label: "Regnskapskurs", href: "/tjenester/kurs" },
      { label: "Skreddersydde bedriftskurs", href: "/tjenester/bedriftskurs" },
      { label: "Lønn & HR-administrasjon", href: "/tjenester/hr-og-lonn" },
    ]}
    ctaTitle="Klar for å lære?"
    ctaSubtitle="Praktiske kurs som gjør deg tryggere som arbeidsgiver."
  />
);

export default HrKurs;
