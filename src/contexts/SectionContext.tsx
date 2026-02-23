import { createContext, useContext, useMemo } from "react";
import { useLocation } from "react-router-dom";

export type SectionId = "regnskap" | "hr" | "markedsforing" | "it";

export interface SectionConfig {
  id: SectionId;
  name: string;
  shortName: string;
  basePath: string;
  accent: { h: number; s: number; l: number };
  accentGlow: { h: number; s: number; l: number };
  tagline: string;
  description: string;
}

export const SECTIONS: Record<SectionId, SectionConfig> = {
  regnskap: {
    id: "regnskap",
    name: "Regnskap & Økonomi",
    shortName: "Regnskap",
    basePath: "/regnskap",
    accent: { h: 15, s: 55, l: 65 },
    accentGlow: { h: 15, s: 65, l: 75 },
    tagline: "Trygghet i tallene",
    description: "Dedikert regnskapsfører, skatteoptimalisering og full økonomisk oversikt for din bedrift.",
  },
  hr: {
    id: "hr",
    name: "HR & Personal",
    shortName: "HR",
    basePath: "/hr",
    accent: { h: 35, s: 75, l: 55 },
    accentGlow: { h: 35, s: 85, l: 65 },
    tagline: "Menneskene først",
    description: "Lønn, arbeidsrett, personalhåndbok og rekruttering — vi tar hele HR-byrden.",
  },
  markedsforing: {
    id: "markedsforing",
    name: "Markedsføring & Vekst",
    shortName: "Markedsføring",
    basePath: "/markedsforing",
    accent: { h: 265, s: 55, l: 65 },
    accentGlow: { h: 265, s: 65, l: 75 },
    tagline: "Synlighet som selger",
    description: "SEO, annonsering, nettbutikk og innholdsstrategi som gir målbare resultater.",
  },
  it: {
    id: "it",
    name: "IT & Utvikling",
    shortName: "IT",
    basePath: "/it",
    accent: { h: 190, s: 55, l: 55 },
    accentGlow: { h: 190, s: 65, l: 65 },
    tagline: "Teknologi som forenkler",
    description: "Nettsider, chatboter, interne systemer og AI-automatisering for smartere drift.",
  },
};

export const SECTION_LIST = Object.values(SECTIONS);

interface SectionContextValue {
  section: SectionConfig | null;
  isInSection: boolean;
}

const SectionContext = createContext<SectionContextValue>({
  section: null,
  isInSection: false,
});

export const useSection = () => useContext(SectionContext);

export const SectionProvider = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  const value = useMemo(() => {
    const path = location.pathname;
    for (const s of SECTION_LIST) {
      if (path === s.basePath || path.startsWith(s.basePath + "/")) {
        return { section: s, isInSection: true };
      }
    }
    return { section: null, isInSection: false };
  }, [location.pathname]);

  return (
    <SectionContext.Provider value={value}>
      {children}
    </SectionContext.Provider>
  );
};
