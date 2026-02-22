import ServicePageTemplate from "@/components/ServicePageTemplate";

const Internsystemer = () => (
  <ServicePageTemplate
    meta={{
      title: "Interne systemer & integrasjoner | Avargo",
      description: "Skreddersydde internsystemer som erstatter manuelle prosesser med smarte løsninger. Dashboards, automatisering og API-integrasjoner.",
      canonical: "https://avargo.no/tjenester/internsystemer",
    }}
    category="IT & Utvikling"
    heroTitle={<>Systemer som <span className="italic text-gradient-rose">jobber for deg.</span></>}
    heroSubtitle="Skreddersydde internsystemer som erstatter manuelle prosesser med smarte løsninger. Vi bygger det du trenger — ingenting mer, ingenting mindre."
    deliverables={[
      "Dashboards & rapporteringsverktøy",
      "Prosessautomatisering",
      "API-integrasjoner & dataflyt",
      "Brukeradministrasjon & tilgangsstyring",
      "CRM & kundehåndtering",
      "Prosjektstyringsverktøy",
      "Dokumenthåndtering",
      "Løpende vedlikehold & support",
    ]}
    whyItems={[
      { num: "01", title: "Skreddersydd.", desc: "Ingen hyllevare som nesten passer. Vi bygger nøyaktig det du trenger — tilpasset dine prosesser og arbeidsflyt." },
      { num: "02", title: "Eliminerer manuelt arbeid.", desc: "Alt som kan automatiseres, bør automatiseres. Vi fjerner flaskehalsene i hverdagen din." },
      { num: "03", title: "Skalerer med deg.", desc: "Systemene vi bygger vokser med bedriften din. Ingen begrensninger, ingen dyre oppgraderinger." },
      { num: "04", title: "Integrert med alt.", desc: "Vi kobler systemene dine sammen — regnskap, CRM, e-post, kalender. Én kilde til sannhet." },
    ]}
    relatedServices={[
      { label: "AI & automatisering", href: "/tjenester/ai-automatisering" },
      { label: "Skreddersydde nettsider", href: "/tjenester/nettsider" },
      { label: "AI-chatbot", href: "/tjenester/chatbot" },
    ]}
    ctaTitle="Klar for smartere prosesser?"
    ctaSubtitle="Vi bygger systemet som gjør hverdagen enklere."
  />
);

export default Internsystemer;
