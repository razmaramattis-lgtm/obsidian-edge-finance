import { Helmet } from "react-helmet-async";
import AnimatedSection from "@/components/AnimatedSection";
import { Shield, Lock, Eye, FileCheck, Server, Users, AlertTriangle, CheckCircle2 } from "lucide-react";

const controls = [
  {
    annex: "A.5",
    title: "Informasjonssikkerhetspolicyer",
    description: "Dokumenterte sikkerhetspolicyer med årlig gjennomgang og godkjenning av ledelsen.",
    icon: FileCheck,
  },
  {
    annex: "A.6",
    title: "Organisering av informasjonssikkerhet",
    description: "Definerte roller, ansvar og segregering av oppgaver for å sikre uavhengig kontroll.",
    icon: Users,
  },
  {
    annex: "A.8",
    title: "Tilgangskontroll",
    description: "Rollebasert tilgangsstyring (RBAC) med Row-Level Security. Alle tilganger logges automatisk.",
    icon: Lock,
  },
  {
    annex: "A.10",
    title: "Kryptografi",
    description: "All data krypteres i transit (TLS 1.3) og i hvile (AES-256). JWT-basert autentisering.",
    icon: Shield,
  },
  {
    annex: "A.12",
    title: "Driftsikkerhet",
    description: "Automatisk revisjonslogging av alle endringer i sensitive data med full sporbarhet.",
    icon: Eye,
  },
  {
    annex: "A.14",
    title: "Systemsikkerhet",
    description: "Input-validering, parameteriserte spørringer, CORS-policyer og XSS-beskyttelse.",
    icon: Server,
  },
  {
    annex: "A.16",
    title: "Hendelseshåndtering",
    description: "Automatiske varsler ved sikkerhetsrelevante hendelser med eskaleringsrutiner.",
    icon: AlertTriangle,
  },
  {
    annex: "A.18",
    title: "Samsvar",
    description: "GDPR-kompatibel behandling, personvernerklæring og databehandleravtaler.",
    icon: CheckCircle2,
  },
];

const Sikkerhet = () => (
  <>
    <Helmet>
      <title>Informasjonssikkerhet – ISO 27001 | Avargo</title>
      <meta name="description" content="Avargo følger ISO/IEC 27001-standarden for informasjonssikkerhet. Les om våre sikkerhetskontroller og tiltak." />
      <link rel="canonical" href="https://avargo.no/sikkerhet" />
    </Helmet>

    <section className="py-24 md:py-40">
      <div className="container mx-auto px-4 md:px-6">
        <AnimatedSection>
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-5">
              <Shield size={16} className="text-primary" />
              <p className="text-[10px] tracking-[0.4em] uppercase text-secondary">ISO/IEC 27001</p>
            </div>
            <h1 className="font-heading text-4xl md:text-6xl mb-4">Informasjonssikkerhet</h1>
            <p className="text-muted-foreground font-light max-w-2xl mb-4">
              Avargo er bygget med informasjonssikkerhet som grunnpilar. Vårt ISMS (Information Security Management System) 
              er utformet i henhold til ISO/IEC 27001:2022-standarden.
            </p>
            <p className="text-xs text-muted-foreground/60 mb-16">Sist oppdatert: mars 2026</p>

            {/* Trust banner */}
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 mb-16">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Shield size={24} className="text-primary" />
                </div>
                <div>
                  <h2 className="font-heading text-lg mb-1">Sikkerhetsforpliktelse</h2>
                  <p className="text-sm text-muted-foreground font-light">
                    Vi forplikter oss til kontinuerlig forbedring av informasjonssikkerheten gjennom systematisk risikostyring, 
                    regelmessige revisjoner og opplæring av alle ansatte.
                  </p>
                </div>
              </div>
            </div>

            {/* Controls grid */}
            <h2 className="font-heading text-2xl md:text-3xl mb-8">Sikkerhetskontroller (Annex A)</h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-16">
              {controls.map(c => (
                <div key={c.annex} className="rounded-xl border border-border/10 bg-muted/10 p-5 hover:bg-muted/20 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <c.icon size={16} className="text-primary" />
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground font-mono">{c.annex}</span>
                      <h3 className="text-sm font-medium">{c.title}</h3>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground font-light leading-relaxed">{c.description}</p>
                </div>
              ))}
            </div>

            {/* Technical measures */}
            <h2 className="font-heading text-2xl md:text-3xl mb-6">Tekniske sikkerhetstiltak</h2>
            <div className="space-y-4 mb-16">
              {[
                { title: "Kryptering", items: ["TLS 1.3 for all dataoverføring", "AES-256 for data i hvile", "Bcrypt-hashing av passord", "JWT-tokens med begrenset levetid"] },
                { title: "Tilgangskontroll", items: ["Rollebasert tilgangsstyring (admin, ansatt, kunde)", "Row-Level Security på databasenivå", "Automatisk sesjonsutløp", "CORS-policyer for API-tilgang"] },
                { title: "Logging & overvåking", items: ["Automatisk revisjonslogg for alle sensitive operasjoner", "Sporbarhet med aktør, tidspunkt og endring", "CSV-eksport for ekstern revisjon", "Sanntidsvarsler ved kritiske hendelser"] },
                { title: "Databeskyttelse", items: ["Input-validering med Zod-skjemaer", "Parameteriserte databasespørringer", "XSS-beskyttelse via sanitisering", "GDPR-kompatibel databehandling"] },
              ].map(section => (
                <div key={section.title} className="rounded-xl border border-border/10 p-5">
                  <h3 className="text-sm font-medium mb-3">{section.title}</h3>
                  <ul className="grid sm:grid-cols-2 gap-2">
                    {section.items.map(item => (
                      <li key={item} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 size={12} className="text-primary mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Contact */}
            <div className="rounded-xl border border-border/10 bg-muted/10 p-6 text-center">
              <h2 className="font-heading text-xl mb-2">Sikkerhetshenvendelser</h2>
              <p className="text-sm text-muted-foreground mb-3">
                For spørsmål om informasjonssikkerhet eller rapportering av sårbarheter:
              </p>
              <a href="mailto:kontakt@avargo.no" className="text-primary text-sm hover:underline">
                kontakt@avargo.no
              </a>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  </>
);

export default Sikkerhet;
