import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Calculator } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const PricingCalculator = lazy(() => import("@/components/PricingCalculator"));
const SHOWN_KEY = "avargo_pricing_popup_shown";
const START_KEY = "avargo_pricing_popup_started";

const PricingCalculatorDialog = () => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const shown = useRef(false);

  useEffect(() => {
    let started = Date.now();
    try {
      if (sessionStorage.getItem(SHOWN_KEY)) return;
      const stored = Number(sessionStorage.getItem(START_KEY));
      if (stored > 0) started = stored;
      else sessionStorage.setItem(START_KEY, String(started));
    } catch { /* Session memory still prevents repeat prompts. */ }
    if (shown.current) return;

    const check = () => {
      if (shown.current || Date.now() - started < 30_000 || document.visibilityState !== "visible") return;
      // Never stack on consent, booking, contact, or other dialogs.
      if (document.querySelector('[role="dialog"], [role="alertdialog"], [data-avargo-overlay]')) return;
      shown.current = true;
      try { sessionStorage.setItem(SHOWN_KEY, "1"); } catch { /* Ignore unavailable storage. */ }
      setOpen(true);
    };
    const timer = window.setInterval(check, 500);
    return () => window.clearInterval(timer);
  }, [pathname]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="z-[110] max-h-[90dvh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto overscroll-contain rounded-lg p-5 sm:p-8">
        <DialogHeader className="pr-6 text-left">
          <DialogTitle className="flex items-center gap-2 font-heading text-xl sm:text-2xl">
            <Calculator className="h-5 w-5 shrink-0 text-primary" /> Din fastpris hos Avargo
          </DialogTitle>
          <DialogDescription>Få et prisestimat tilpasset bedriften din.</DialogDescription>
        </DialogHeader>
        <Suspense fallback={<p className="py-10 text-center text-sm text-muted-foreground">Laster kalkulator …</p>}>
          {open && <PricingCalculator embedded />}
        </Suspense>
      </DialogContent>
    </Dialog>
  );
};

export default PricingCalculatorDialog;