import ServicePageTemplate from "@/components/ServicePageTemplate";

const Chatbot = () => (
  <ServicePageTemplate
    meta={{
      title: "AI-chatbot & kundeservice | Avargo",
      description: "Intelligente chatboter som svarer kundene dine døgnet rundt, kvalifiserer leads og avlaster teamet ditt.",
      canonical: "https://avargo.no/tjenester/chatbot",
    }}
    category="IT & Utvikling"
    heroTitle={<>Kundeservice som <span className="italic text-gradient-rose">aldri sover.</span></>}
    heroSubtitle="Intelligente chatboter som svarer kundene dine døgnet rundt, kvalifiserer leads og avlaster teamet ditt — uten at kvaliteten lider."
    deliverables={[
      "Skreddersydd AI-chatbot",
      "Trent på din bedrifts data",
      "Automatisk leadoppfølging",
      "Integrasjon med CRM & e-post",
      "Kunnskapsbase & selvbetjening",
      "Flerspråklig støtte",
      "Rapportering & innsikt",
      "Løpende optimalisering",
    ]}
    whyItems={[
      { num: "01", title: "24/7 tilgjengelighet.", desc: "Kundene dine får svar umiddelbart — uansett tid på døgnet. Ingen ventetid, ingen ubesvarte henvendelser." },
      { num: "02", title: "Kvalifiserer leads.", desc: "Chatboten identifiserer og kvalifiserer potensielle kunder automatisk, slik at salgsteamet kan fokusere på de beste mulighetene." },
      { num: "03", title: "Avlaster teamet.", desc: "Rutinespørsmål håndteres automatisk. Teamet ditt frigjøres til å jobbe med det som krever menneskelig innsikt." },
      { num: "04", title: "Lærer og forbedres.", desc: "Chatboten blir smartere over tid. Den lærer av samtaler og tilpasser seg kundenes behov." },
    ]}
    relatedServices={[
      { label: "Skreddersydde nettsider", href: "/tjenester/nettsider" },
      { label: "AI & automatisering", href: "/tjenester/ai-automatisering" },
      { label: "Interne systemer", href: "/tjenester/internsystemer" },
    ]}
    ctaTitle="Klar for smartere kundeservice?"
    ctaSubtitle="Vi bygger en chatbot som kjenner bedriften din ut og inn."
  />
);

export default Chatbot;
