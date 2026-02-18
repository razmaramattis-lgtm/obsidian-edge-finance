import { motion } from "framer-motion";
import { Clock } from "lucide-react";

const AvailabilityWidget = () => {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 4, duration: 0.8, ease: "easeOut" }}
      className="fixed bottom-6 right-6 z-40 max-w-[260px]"
    >
      <div className="bg-card/95 backdrop-blur-xl border border-border/40 rounded-md px-4 py-3 shadow-lg shadow-background/50">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-primary/80">
            Begrenset kapasitet
          </span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Kun <span className="text-foreground font-medium">2 plasser</span> tilgjengelig i Oslo denne måneden.
        </p>
      </div>
    </motion.div>
  );
};

export default AvailabilityWidget;
