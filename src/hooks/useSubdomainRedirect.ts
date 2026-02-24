import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { SECTION_LIST, type SectionId } from "@/contexts/SectionContext";

/**
 * Maps subdomains to section IDs.
 * regnskap.avargo.no → regnskap
 * personal.avargo.no → hr
 * marked.avargo.no → markedsforing
 * it.avargo.no → it
 */
const SUBDOMAIN_MAP: Record<string, SectionId> = {
  regnskap: "regnskap",
  personal: "hr",
  marked: "markedsforing",
  it: "it",
};

/** Returns the section ID detected from the current hostname, or null. */
export function getSubdomainSection(): SectionId | null {
  const hostname = window.location.hostname;
  // Extract first subdomain part: "regnskap" from "regnskap.avargo.no"
  const parts = hostname.split(".");
  if (parts.length >= 3) {
    const sub = parts[0].toLowerCase();
    if (sub in SUBDOMAIN_MAP) {
      return SUBDOMAIN_MAP[sub];
    }
  }
  return null;
}

/**
 * Hook that redirects to the correct section path when accessed via subdomain.
 * E.g. regnskap.avargo.no/ → /regnskap
 *      regnskap.avargo.no/tjenester → /regnskap/tjenester
 */
export function useSubdomainRedirect() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const sectionId = getSubdomainSection();
    if (!sectionId) return;

    const section = SECTION_LIST.find((s) => s.id === sectionId);
    if (!section) return;

    const path = location.pathname;

    // Already on the correct section path
    if (path === section.basePath || path.startsWith(section.basePath + "/")) {
      return;
    }

    // On root → redirect to section home
    if (path === "/" || path === "") {
      navigate(section.basePath, { replace: true });
      return;
    }

    // On a non-section path like /tjenester → prepend section
    // But skip admin/kunde/shared routes
    const skipPrefixes = ["/admin", "/kunde", "/personvern", "/vilkar", "/karriere"];
    if (skipPrefixes.some((p) => path.startsWith(p))) {
      return;
    }

    // Prepend section basePath: /tjenester → /regnskap/tjenester
    navigate(section.basePath + path, { replace: true });
  }, [location.pathname]);
}
