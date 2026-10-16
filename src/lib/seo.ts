export const SITE_URL = "https://avargo.no";

/** The address search engines should treat as the one version of this page. */
export const canonicalFor = (pathname: string) => {
  const clean = pathname.replace(/\/+$/, "");
  return `${SITE_URL}${clean || "/"}`;
};
