import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const AvailabilityWidget = () => {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-6 right-6 z-40 max-w-[260px]"
    >
      <div className="bg-card/90 backdrop-blur-xl border border-border/30 rounded-2xl px-5 py-4 shadow-lg shadow-background/50">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={12} className="text-primary" />
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-primary/80">
            Begrenset kapasitet
          </span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Vi har <span className="text-foreground font-medium">2 plasser</span> igjen i Oslo denne måneden — for å gi deg den oppmerksomheten du fortjener.
        </p>
      </div>
    </motion.div>
  );
};

export default AvailabilityWidget;
