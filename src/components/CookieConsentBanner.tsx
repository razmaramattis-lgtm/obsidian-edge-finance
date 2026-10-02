import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { STORAGE_KEY, isConsentRequiredRegion, saveConsentChoice, installLeadTracking } from "@/lib/adsTracking";

export const openCookieSettings = () => window.dispatchEvent(new Event("avargo-open-cookie-settings"));

const CookieConsentBanner = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    installLeadTracking();
    if (localStorage.getItem(STORAGE_KEY) === null) {
      isConsentRequiredRegion().then((req) => {
        if (req && localStorage.getItem(STORAGE_KEY) === null) setOpen(true);
      });
    }
    const show = () => setOpen(true);
    const hideIfChosen = () => { if (localStorage.getItem(STORAGE_KEY) !== null) setOpen(false); };
    window.addEventListener("avargo-open-cookie-settings", show);
    window.addEventListener("avargo-consent-changed", hideIfChosen);
    return () => {
      window.removeEventListener("avargo-open-cookie-settings", show);
      window.removeEventListener("avargo-consent-changed", hideIfChosen);
    };
  }, []);

  if (!open) return null;

  const choose = (d: "granted" | "denied") => { saveConsentChoice(d); setOpen(false); };

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-title"
      className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-xl rounded-xl border border-border bg-card p-5 text-card-foreground shadow-2xl sm:bottom-5"
    >
      <h2 id="cookie-title" className="font-heading text-base font-semibold">Informasjonskapsler</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Vil du la oss bruke informasjonskapsler fra Google Ads for å måle hvilke annonser som fører til at noen tar kontakt?
        Ingenting brukes til dette uten ditt samtykke, og du kan endre valget når som helst via «Cookie-innstillinger» nederst på siden.{" "}
        <Link to="/personvern" className="underline underline-offset-2">Les mer i personvernerklæringen</Link>.
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
        <Button variant="outline" onClick={() => choose("denied")}>Avslå</Button>
        <Button onClick={() => choose("granted")}>Godta</Button>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
