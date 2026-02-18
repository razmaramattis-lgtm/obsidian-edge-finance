import { motion } from "framer-motion";
import { Clock } from "lucide-react";

const AvailabilityWidget = () => {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 3, duration: 0.6 }}
      className="fixed bottom-6 right-6 z-40 max-w-xs"
    >
      <div className="bg-card border border-gold-subtle rounded px-4 py-3 glow-gold animate-pulse-gold">
        <div className="flex items-center gap-2 mb-1">
          <Clock size={14} className="text-primary" />
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Begrenset kapasitet
          </span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Vi har kun kapasitet til <span className="text-foreground font-semibold">2 nye klienter</span> i Oslo denne måneden for å sikre kvalitet.
        </p>
      </div>
    </motion.div>
  );
};

export default AvailabilityWidget;
