import ServicePageTemplate from "@/components/ServicePageTemplate";

const Dashboard = () => (
  <ServicePageTemplate
    meta={{
      title: "Avargo Dashboard — ditt ressurspanel | Avargo",
      description: "Avargo Dashboard gir deg full oversikt over økonomien, rapporter og direkte kommunikasjon med rådgiver — alt på ett sted. Lanseres august 2026.",
      canonical: "https://avargo.no/tjenester/dashboard",
    }}
    category="Regnskap & Økonomi"
    heroTitle={<>Full oversikt. <span className="italic text-gradient-rose">Ett sted.</span></>}
    heroSubtitle="Et kommende ressurspanel på Avargo.no som gir deg full oversikt over økonomien, rapporter og direkte kommunikasjon med regnskapsføreren — alt på ett sted. Lanseres august 2026."
    deliverables={[
      "Sanntidsoversikt over økonomi",
      "Rapporter & nøkkeltall",
      "Direkte kommunikasjon med rådgiver",
      "Dokumentdeling & signering",
      "Varsler & påminnelser",
      "Historikk & arkiv",
      "Mobiltilpasset grensesnitt",
      "Sikker innlogging & tilgangsstyring",
    ]}
    whyItems={[
      { num: "01", title: "Alt samlet.", desc: "Slutt på å lete i e-post, Dropbox og regnskapssystem. Alt du trenger er samlet på ett sted — tilgjengelig døgnet rundt." },
      { num: "02", title: "Direkte linje.", desc: "Kommuniser direkte med regnskapsføreren din uten å vente på svar i en felles innboks. Personlig og effektivt." },
      { num: "03", title: "Innsikt i sanntid.", desc: "Se hvordan selskapet presterer — ikke i etterkant, men nå. Nøkkeltall, trender og rapporter oppdateres løpende." },
      { num: "04", title: "Bygget for deg.", desc: "Dashboardet er designet for bedriftseiere som vil ha kontroll uten å måtte bli regnskapseksperter selv." },
    ]}
    relatedServices={[
      { label: "Dedikert regnskapsfører", href: "/tjenester/regnskapsforer" },
      { label: "1-1 Regnskap", href: "/tjenester/1-1-regnskap" },
      { label: "CFO-as-a-Service", href: "/tjenester/cfo" },
    ]}
    ctaTitle="Dashboardet lanseres august 2026."
    ctaSubtitle="Bli kunde i dag og vær blant de første som får tilgang."
  />
);

export default Dashboard;
