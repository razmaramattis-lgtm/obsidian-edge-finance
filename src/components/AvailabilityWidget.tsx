import { motion } from "framer-motion";

const AvailabilityWidget = () => {
  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-6 right-6 z-40 max-w-[240px]"
    >
      <div className="glass rounded-2xl px-5 py-4 shadow-2xl shadow-background/60">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
          <span className="text-[10px] tracking-[0.2em] uppercase text-secondary/80">
            Begrenset
          </span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed font-light">
          <span className="text-foreground font-normal">2 plasser</span> igjen i Oslo denne måneden.
        </p>
      </div>
    </motion.div>
  );
};

export default AvailabilityWidget;
