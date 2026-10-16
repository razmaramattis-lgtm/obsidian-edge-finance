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
      className="fixed inset-x-2 bottom-2 z-[100] mx-auto max-w-xl rounded-xl border border-border bg-card px-4 py-3 text-card-foreground shadow-2xl sm:bottom-5 sm:p-5"
    >
      <h2 id="cookie-title" className="sr-only">Informasjonskapsler</h2>
      <p className="text-[13px] leading-snug text-muted-foreground sm:text-sm">
        Vi vil bruke informasjonskapsler fra Google Ads for å måle hvilke annonser som gir henvendelser. Det skjer bare hvis du godtar,
        og du kan endre valget nederst på siden.{" "}
        <Link to="/personvern" className="underline underline-offset-2">Personvern</Link>
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:flex sm:justify-end">
        <Button variant="outline" size="sm" onClick={() => choose("denied")}>Avslå</Button>
        <Button size="sm" onClick={() => choose("granted")}>Godta</Button>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
