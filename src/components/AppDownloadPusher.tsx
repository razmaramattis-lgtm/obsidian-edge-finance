import { useState } from "react";
import { Download, Smartphone, Wifi, Bell, X, Share, Plus, Zap } from "lucide-react";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import { motion, AnimatePresence } from "framer-motion";

const PUSHER_DISMISSED_KEY = "avargo-pusher-dismissed";

export const AppDownloadPusher = () => {
  const { canInstall, isInstalled, isIos, install } = useInstallPrompt();
  const [dismissed, setDismissed] = useState(() => {
    try {
      return localStorage.getItem(PUSHER_DISMISSED_KEY) === "1";
    } catch {
      return false;
    }
  });
  const [installing, setInstalling] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);

  if (isInstalled || dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem(PUSHER_DISMISSED_KEY, "1");
    } catch {}
  };

  const handleInstall = async () => {
    if (isIos) {
      setShowIosGuide(true);
      return;
    }
    setInstalling(true);
    const success = await install();
    if (success) handleDismiss();
    setInstalling(false);
  };

  const features = [
    { icon: Zap, label: "Raskere tilgang" },
    { icon: Bell, label: "Push-varsler" },
    { icon: Wifi, label: "Offline-støtte" },
  ];

  return (
    <AnimatePresence>
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative overflow-hidden rounded-2xl border border-border/40 bg-card mx-auto max-w-5xl"
      >
        {/* Dismiss */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          aria-label="Lukk"
        >
          <X size={16} />
        </button>

        {/* Glow effect */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative p-6 md:p-10 flex flex-col md:flex-row items-center gap-8">
          {/* Phone mockup */}
          <div className="shrink-0 relative">
            <div className="w-28 h-48 md:w-32 md:h-56 rounded-[1.5rem] border-2 border-border/60 bg-background/80 backdrop-blur-sm flex items-center justify-center shadow-2xl">
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1.5 rounded-full bg-border/60" />
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <img src="/logo.png" alt="Avargo" className="w-8 h-8 object-contain" />
                </div>
                <span className="text-[10px] font-medium text-muted-foreground">Avargo</span>
              </div>
            </div>
            {/* Floating notification badge */}
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center shadow-lg"
            >
              3
            </motion.div>
          </div>

          {/* Content */}
          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-foreground">
                Last ned Avargo-appen
              </h3>
              <p className="text-sm text-muted-foreground mt-1.5 max-w-md">
                Installer appen direkte fra nettleseren — ingen app-butikk nødvendig. Få tilgang til alt på sekunder.
              </p>
            </div>

            {/* Feature pills */}
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              {features.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/60 text-xs font-medium text-foreground"
                >
                  <Icon size={13} className="text-primary" />
                  {label}
                </div>
              ))}
            </div>

            {/* iOS guide or install button */}
            {showIosGuide ? (
              <div className="space-y-2 text-left bg-muted/40 rounded-xl p-4 max-w-sm">
                <p className="text-sm font-semibold text-foreground">Slik installerer du på iPhone:</p>
                <div className="flex items-center gap-3 text-[13px] text-muted-foreground">
                  <div className="w-6 h-6 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold text-primary">1</span>
                  </div>
                  <p>Trykk på <Share size={13} className="inline text-primary" /> Del-knappen i Safari</p>
                </div>
                <div className="flex items-center gap-3 text-[13px] text-muted-foreground">
                  <div className="w-6 h-6 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold text-primary">2</span>
                  </div>
                  <p>Velg <Plus size={13} className="inline text-primary" /> «Legg til på Hjem-skjerm»</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <button
                  onClick={handleInstall}
                  disabled={installing}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60 shadow-lg shadow-primary/20"
                >
                  <Download size={16} />
                  {installing ? "Installerer…" : isIos ? "Vis instruksjoner" : "Installer nå"}
                </button>
                <button
                  onClick={handleDismiss}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                >
                  Ikke nå
                </button>
              </div>
            )}
          </div>

          {/* Large phone icon for desktop */}
          <div className="hidden lg:flex shrink-0">
            <Smartphone size={80} className="text-border/30" strokeWidth={1} />
          </div>
        </div>
      </motion.section>
    </AnimatePresence>
  );
};
