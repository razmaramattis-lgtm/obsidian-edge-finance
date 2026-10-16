import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { SITE_URL as SITE, canonicalFor } from "@/lib/seo";

const DEFAULT_DESCRIPTION =
  "Autorisert regnskapsbyrå for små og mellomstore bedrifter. Regnskap, HR, lønn og rådgivning til fast månedspris — svar innen 24 timer.";
const DEFAULT_IMAGE = `${SITE}/og-avargo.jpg`;


/**
 * Default head tags for every public page.
 *
 * Each page's own <Helmet> is rendered further down the tree and overrides
 * these, so a page only needs to set what is specific to it. The defaults
 * replace the static tags in index.html (marked data-rh), so every page ends
 * up with exactly one description, one canonical and one og:url, and the
 * canonical always points at the page itself unless the page says otherwise.
 */
const SeoDefaults = () => {
  const { pathname } = useLocation();
  const url = canonicalFor(pathname);
  return (
    <Helmet>
      <meta name="description" content={DEFAULT_DESCRIPTION} />
      <link rel="canonical" href={url} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Avargo" />
      <meta property="og:locale" content="nb_NO" />
      <meta property="og:description" content={DEFAULT_DESCRIPTION} />
      <meta property="og:image" content={DEFAULT_IMAGE} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={DEFAULT_IMAGE} />
      <meta name="twitter:description" content={DEFAULT_DESCRIPTION} />
    </Helmet>
  );
};

export default SeoDefaults;
