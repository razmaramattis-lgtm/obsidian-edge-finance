import ServicePageTemplate from "@/components/ServicePageTemplate";

const Fakturering = () => (
  <ServicePageTemplate
    meta={{
      title: "Fakturering & innkreving | Avargo",
      description: "Vi sørger for at fakturaene går ut i tide, purringer følges opp og pengene kommer inn. Slippe å jage betalinger.",
      canonical: "https://avargo.no/tjenester/fakturering",
    }}
    category="Regnskap & Økonomi"
    heroTitle={<>Pengene skal <span className="italic text-gradient-rose">komme inn.</span></>}
    heroSubtitle="Vi sørger for at fakturaene går ut i tide, purringer følges opp og pengene faktisk kommer inn. Slik at du slipper å bruke tid på å jage betalinger."
    deliverables={[
      "Utgående fakturering",
      "Automatiske purringer",
      "Inkassovarsler ved behov",
      "Aldersfordeling & oppfølging",
      "Integrasjon med regnskapssystem",
      "Rapportering på utestående",
      "Kundeoppfølging ved forfall",
      "Kredittvurdering av nye kunder",
    ]}
    whyItems={[
      { num: "01", title: "Slipper å jage penger.", desc: "Vi tar ansvar for hele innkrevingsprosessen — fra faktura til betaling. Du fokuserer på å levere, vi sørger for at pengene kommer." },
      { num: "02", title: "Bedre likviditet.", desc: "Raskere betaling betyr bedre likviditet. Vi optimaliserer betalingsflyt og følger opp systematisk." },
      { num: "03", title: "Profesjonell håndtering.", desc: "Purringer og inkassovarsler håndteres profesjonelt. Kundeforholdet bevares, samtidig som kravene ivaretas." },
      { num: "04", title: "Full oversikt.", desc: "Du vet alltid hvor mye som er utestående, hva som er forfalt og hvilke kunder som trenger oppfølging." },
    ]}
    relatedServices={[
      { label: "Dedikert regnskapsfører", href: "/tjenester/regnskapsforer" },
      { label: "Lønn & lønnskjøring", href: "/tjenester/lonn" },
      { label: "CFO-as-a-Service", href: "/tjenester/cfo" },
    ]}
    ctaTitle="Slutt å jage betalinger."
    ctaSubtitle="Vi tar innkrevingen — du tar kundene."
  />
);

export default Fakturering;
