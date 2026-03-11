import { useState } from "react";
import { Download, X, Share, Plus } from "lucide-react";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import { motion, AnimatePresence } from "framer-motion";

const DISMISSED_KEY = "avargo-install-dismissed";

export const InstallPromptBanner = () => {
  const { canInstall, isInstalled, isIos, install } = useInstallPrompt();
  const [dismissed, setDismissed] = useState(() => {
    try { return sessionStorage.getItem(DISMISSED_KEY) === "1"; } catch { return false; }
  });
  const [showIosGuide, setShowIosGuide] = useState(false);

  if (isInstalled || dismissed) return null;
  if (!canInstall && !isIos) return null;

  const handleDismiss = () => {
    setDismissed(true);
    try { sessionStorage.setItem(DISMISSED_KEY, "1"); } catch {}
  };

  const handleInstall = async () => {
    if (isIos) {
      setShowIosGuide(true);
      return;
    }
    const success = await install();
    if (success) handleDismiss();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:max-w-sm z-[60]"
      >
        <div className="bg-card border border-border/30 rounded-2xl p-4 shadow-2xl backdrop-blur-xl">
          {showIosGuide ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">Installer Avargo</h3>
                <button onClick={handleDismiss} className="text-muted-foreground hover:text-foreground p-1">
                  <X size={16} />
                </button>
              </div>
              <div className="space-y-2.5 text-[13px] text-muted-foreground">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-primary">1</span>
                  </div>
                  <p>Trykk på <Share size={14} className="inline text-primary" /> Del-knappen i Safari</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-primary">2</span>
                  </div>
                  <p>Velg <Plus size={14} className="inline text-primary" /> «Legg til på Hjem-skjerm»</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                <Download size={18} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">Last ned Avargo-appen</p>
                <p className="text-xs text-muted-foreground mt-0.5">Raskere tilgang, varsler og offline-støtte</p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={handleInstall}
                  className="px-3.5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
                >
                  Installer
                </button>
                <button
                  onClick={handleDismiss}
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
