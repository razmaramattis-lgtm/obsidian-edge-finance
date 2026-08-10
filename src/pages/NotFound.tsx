import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <>
      <Helmet>
        <title>Siden finnes ikke (404) | Avargo</title>
        <meta
          name="description"
          content="Vi fant ikke siden du leter etter. Gå tilbake til forsiden, eller se tjenester, priser og ressurser fra Avargo regnskap."
        />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://avargo.no/" />
      </Helmet>
      <div className="flex min-h-screen items-center justify-center bg-muted px-4">
        <div className="text-center max-w-md">
          <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-4">Feil 404</p>
          <h1 className="mb-4 font-heading text-4xl md:text-5xl">Siden finnes ikke</h1>
          <p className="mb-8 text-muted-foreground">
            Lenken kan være utdatert eller feilskrevet. Prøv en av sidene under.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link to="/" className="rounded-full bg-primary px-6 py-3 text-primary-foreground">
              Til forsiden
            </Link>
            <Link to="/tjenester" className="rounded-full border border-border px-6 py-3">
              Tjenester
            </Link>
            <Link to="/priser" className="rounded-full border border-border px-6 py-3">
              Priser
            </Link>
            <Link to="/kontakt" className="rounded-full border border-border px-6 py-3">
              Kontakt
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
