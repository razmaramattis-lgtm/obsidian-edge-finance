import ServicePageTemplate from "@/components/ServicePageTemplate";

const Bedriftskurs = () => (
  <ServicePageTemplate
    meta={{
      title: "Skreddersydde bedriftskurs | Avargo",
      description: "Vi skreddersyr kursopplegg til ditt team — økonomiforståelse, compliance eller digitale verktøy. Levert fysisk eller digitalt.",
      canonical: "https://avargo.no/tjenester/bedriftskurs",
    }}
    category="Kurs & Opplæring"
    heroTitle={<>Kurs tilpasset <span className="italic text-gradient-rose">ditt team.</span></>}
    heroSubtitle="Vi skreddersyr kursopplegg til ditt team — enten det handler om økonomiforståelse, compliance eller digitale verktøy. Levert fysisk eller digitalt."
    deliverables={[
      "Tilpasset innhold & varighet",
      "Workshop-format",
      "Oppfølging & materiell",
      "Sertifisering & dokumentasjon",
      "Fysisk eller digital levering",
      "Inntil 20 deltakere per kurs",
      "Evaluering & tilbakemelding",
      "Tilgang til kursplattform",
    ]}
    whyItems={[
      { num: "01", title: "Helt skreddersydd.", desc: "Vi lager kurset fra grunnen av basert på ditt teams behov, bransje og kompetansenivå. Ingen standard-presentasjoner." },
      { num: "02", title: "Praktisk og interaktivt.", desc: "Workshop-format med øvelser, diskusjoner og caser. Deltakerne lærer ved å gjøre — ikke bare ved å høre." },
      { num: "03", title: "Fleksibel levering.", desc: "Fysisk på ditt kontor, digitalt via Teams, eller hybrid. Vi tilpasser oss din hverdag." },
      { num: "04", title: "Oppfølging inkludert.", desc: "Kurset slutter ikke når dagen er over. Vi følger opp med materiell og spørsmålsrunder i etterkant." },
    ]}
    relatedServices={[
      { label: "Alle kurs", href: "/akademi" },
      { label: "HR & arbeidsgiveransvar", href: "/akademi/hr-kurs" },
      { label: "Lønn & HR-administrasjon", href: "/tjenester/hr-og-lonn" },
    ]}
    ctaTitle="Hva trenger teamet ditt?"
    ctaSubtitle="Vi designer kurset sammen — helt tilpasset dere."
  />
);

export default Bedriftskurs;
