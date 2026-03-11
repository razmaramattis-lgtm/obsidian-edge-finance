import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SPLASH_SHOWN_KEY = "avargo-splash-shown";

export const SplashScreen = () => {
  const [visible, setVisible] = useState(() => {
    try { return !localStorage.getItem(SPLASH_SHOWN_KEY); } catch { return false; }
  });

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => {
      setVisible(false);
      try { localStorage.setItem(SPLASH_SHOWN_KEY, "1"); } catch {}
    }, 2400);
    return () => clearTimeout(timer);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-background flex flex-col items-center justify-center gap-6"
        >
          {/* Ambient glow */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-20"
              style={{ background: "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)" }}
            />
          </div>

          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
          >
            <img src="/logo.png" alt="Avargo" className="w-20 h-20 rounded-2xl" />
          </motion.div>

          {/* Brand name */}
          <motion.h1
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="font-heading text-3xl tracking-wide text-primary"
          >
            Avargo
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="text-sm text-muted-foreground font-light tracking-wide"
          >
            Din digitale regnskapsfører
          </motion.p>

          {/* Loading bar */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3, duration: 2, ease: "easeInOut" }}
            className="w-32 h-0.5 bg-primary/60 rounded-full origin-left mt-4"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
