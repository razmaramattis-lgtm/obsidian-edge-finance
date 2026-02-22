import ServicePageTemplate from "@/components/ServicePageTemplate";

const Arbeidsrett = () => (
  <ServicePageTemplate
    meta={{
      title: "Arbeidsrett & HMS | Avargo",
      description: "Vi sørger for at du oppfyller kravene i arbeidsmiljøloven — HMS-dokumentasjon, internkontroll og rådgivning i personalsaker.",
      canonical: "https://avargo.no/tjenester/arbeidsrett",
    }}
    category="HR & Personal"
    heroTitle={<>Trygg som <span className="italic text-gradient-rose">arbeidsgiver.</span></>}
    heroSubtitle="Arbeidsmiljøloven stiller krav. Vi sørger for at du oppfyller dem — fra HMS-dokumentasjon og internkontroll til rådgivning i vanskelige personalsaker."
    deliverables={[
      "HMS-dokumentasjon & internkontroll",
      "Risikovurdering av arbeidsmiljø",
      "Oppfølging av sykefravær",
      "Sluttavtaler & oppsigelser",
      "Rådgivning i personalsaker",
      "Verneombud & AMU-støtte",
      "Varslingshåndtering",
      "Arbeidstidsordninger & unntak",
    ]}
    whyItems={[
      { num: "01", title: "Lovpålagt — men viktig.", desc: "HMS og internkontroll er ikke bare et krav. Det er en investering i arbeidsmiljøet og de ansattes trivsel." },
      { num: "02", title: "Trygghet i vanskelige saker.", desc: "Personalsaker kan være krevende. Vi gir deg juridisk trygghet og praktisk veiledning — uansett situasjon." },
      { num: "03", title: "Forebygg fremfor å reparere.", desc: "Gode rutiner og dokumentasjon forebygger konflikter og reduserer risikoen for kostbare feilsteg." },
      { num: "04", title: "Alltid oppdatert.", desc: "Regelverket endres. Vi holder deg oppdatert og sørger for at dokumentasjonen din alltid er i tråd med gjeldende lov." },
    ]}
    relatedServices={[
      { label: "Lønn & HR-administrasjon", href: "/tjenester/hr-og-lonn" },
      { label: "Personalhåndbok", href: "/tjenester/personalhandbok" },
      { label: "Ansettelse & rekruttering", href: "/tjenester/ansettelse" },
    ]}
    ctaTitle="Oppfyller du kravene?"
    ctaSubtitle="Vi hjelper deg med å bygge en trygg arbeidsplass."
  />
);

export default Arbeidsrett;
