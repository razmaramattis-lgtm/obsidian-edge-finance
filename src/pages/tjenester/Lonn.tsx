import ServicePageTemplate from "@/components/ServicePageTemplate";

const Lonn = () => (
  <ServicePageTemplate
    meta={{
      title: "Lønn & lønnskjøring | Avargo",
      description: "Presis lønnskjøring, feriepenger, sykepenger og rapportering til myndighetene. Vi kjører lønn til rett tid — hver eneste måned.",
      canonical: "https://avargo.no/tjenester/lonn",
    }}
    category="Regnskap & Økonomi"
    heroTitle={<>Lønn som alltid <span className="italic text-gradient-rose">stemmer.</span></>}
    heroSubtitle="Vi kjører lønn presist og til rett tid — hver eneste måned. Feriepenger, sykepenger, reiseregninger og rapportering til myndighetene er inkludert."
    deliverables={[
      "Lønnskjøring hver måned",
      "A-melding til Skatteetaten",
      "Feriepenger & feriepengeberegning",
      "Sykepenger & refusjoner fra NAV",
      "Reiseregninger & utlegg",
      "Rapportering til NAV & Skatteetaten",
      "Årsavslutning & lønnsoppsummering",
      "Rådgivning om lønnsinnberetning",
    ]}
    whyItems={[
      { num: "01", title: "Alltid til rett tid.", desc: "Lønn er det siste du vil at skal bli forsinket. Vi kjører lønnen på avtalt dato, hver eneste måned — uten unntak." },
      { num: "02", title: "Alt inkludert.", desc: "Feriepenger, sykepenger, reiseregninger og rapportering. Du slipper å tenke på detaljene — vi har kontroll." },
      { num: "03", title: "Regelverk i endring.", desc: "Skatteregler og rapporteringskrav endres stadig. Vi holder oss oppdatert, slik at du slipper." },
      { num: "04", title: "Integrert med regnskapet.", desc: "Lønn er en del av det totale bildet. Hos oss er lønnskjøring og regnskap tett koblet — ingen manuelle overføringer." },
    ]}
    relatedServices={[
      { label: "Dedikert regnskapsfører", href: "/tjenester/regnskapsforer" },
      { label: "HR & personaladministrasjon", href: "/tjenester/hr-og-lonn" },
      { label: "Årsregnskap & skattemelding", href: "/tjenester/arsregnskap" },
    ]}
    ctaTitle="Lønn uten bekymringer."
    ctaSubtitle="Vi tar ansvar for at alt stemmer — hver måned."
  />
);

export default Lonn;
