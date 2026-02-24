import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { useSection, SECTIONS } from "@/contexts/SectionContext";

const SEGMENT_LABELS: Record<string, string> = {
  tjenester: "Tjenester",
  bransjer: "Bransjer",
  priser: "Priser",
  kontakt: "Kontakt",
  "om-oss": "Om oss",
  metoden: "Metoden",
  ressurser: "Ressurser",
  kurs: "Kurs",
  regnskapsforer: "Dedikert regnskapsfører",
  lonn: "Lønn & lønnskjøring",
  arsregnskap: "Årsregnskap & skattemelding",
  cfo: "CFO-as-a-Service",
  fakturering: "Fakturering & innkreving",
  skatteplanlegging: "Skatteplanlegging",
  "1-1-regnskap": "1-1 Regnskap",
  dashboard: "Avargo Dashboard",
  "hr-og-lonn": "Lønn & HR-administrasjon",
  ansettelse: "Ansettelse & rekruttering",
  personalhandbok: "Personalhåndbok",
  arbeidsrett: "Arbeidsrett & HMS",
  seo: "SEO & søkbarhet",
  "meta-annonser": "Meta-annonser",
  "google-ads": "Google Ads",
  nettbutikk: "Nettbutikk & e-handel",
  nettsider: "Skreddersydde nettsider",
  chatbot: "AI-chatbot",
  internsystemer: "Interne systemer",
  "ai-automatisering": "AI & automatisering",
  "tech-saas": "Tech & SaaS",
  eiendom: "Eiendom & Utvikling",
  holding: "Holding & Investering",
  consulting: "Consulting & Rådgivning",
  landbruk: "Landbruk",
  "bygg-anlegg": "Bygg & Anlegg",
  restaurant: "Restaurant & Uteliv",
  frisor: "Frisør & Skjønnhet",
  handverkere: "Håndverkere & Fagfolk",
  helse: "Helse & Velvære",
  kontohjelp: "Kontohjelp",
  skattekalender: "Skattekalender",
  regnskap: "Regnskap",
  hr: "Personal",
  markedsforing: "Markedsføring",
  it: "IT",
};

const HIDDEN_ROUTES = ["/", "/admin", "/kunde", "/karriere", "/personvern", "/vilkar"];

const Breadcrumbs = () => {
  const location = useLocation();
  const { section, isInSection } = useSection();
  const path = location.pathname;

  // Don't show breadcrumbs on home, admin, kunde, etc.
  if (HIDDEN_ROUTES.some(r => path === r || (r !== "/" && path.startsWith(r + "/")))) return null;
  // Don't show on section home pages
  if (isInSection && section && path === section.basePath) return null;
  // Don't show on hub root
  if (path === "/") return null;

  const segments = path.split("/").filter(Boolean);
  if (segments.length <= 1 && !isInSection) return null;

  const crumbs: { label: string; href: string }[] = [];

  // Add Avargo root
  crumbs.push({ label: "Avargo", href: "/" });

  // If in section, add section crumb
  if (isInSection && section) {
    crumbs.push({ label: section.shortName, href: section.basePath });
    // Add remaining segments after section prefix
    const sectionPrefix = section.basePath.replace("/", "");
    const remaining = segments.filter(s => s !== sectionPrefix);
    let buildPath = section.basePath;
    remaining.forEach((seg) => {
      buildPath += `/${seg}`;
      const label = SEGMENT_LABELS[seg] || seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, " ");
      crumbs.push({ label, href: buildPath });
    });
  } else {
    let buildPath = "";
    segments.forEach((seg) => {
      buildPath += `/${seg}`;
      const label = SEGMENT_LABELS[seg] || seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, " ");
      crumbs.push({ label, href: buildPath });
    });
  }

  if (crumbs.length <= 1) return null;

  return (
    <div className="border-b border-border/10 bg-background/50 backdrop-blur-xl">
      <div className="container mx-auto px-4 md:px-6">
        <nav className="flex items-center gap-1.5 py-2.5 overflow-x-auto scrollbar-none" aria-label="Breadcrumb">
          {crumbs.map((crumb, i) => {
            const isLast = i === crumbs.length - 1;
            return (
              <span key={crumb.href} className="flex items-center gap-1.5 shrink-0">
                {i > 0 && <ChevronRight size={10} className="text-foreground/25" />}
                {i === 0 ? (
                  <Link to={crumb.href} className="text-foreground/40 hover:text-foreground/70 transition-colors">
                    <Home size={12} />
                  </Link>
                ) : isLast ? (
                  <span className="text-[11px] text-foreground/70 font-medium tracking-wide">{crumb.label}</span>
                ) : (
                  <Link to={crumb.href} className="text-[11px] text-foreground/40 hover:text-foreground/70 transition-colors tracking-wide">
                    {crumb.label}
                  </Link>
                )}
              </span>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Breadcrumbs;
