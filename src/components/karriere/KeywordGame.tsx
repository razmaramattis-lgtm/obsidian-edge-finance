import { useState, useRef, useCallback, useEffect } from "react";
import { motion, useAnimation, PanInfo } from "framer-motion";

interface KeywordGameProps {
  keywords: string[];
}

// Generate initial scattered positions for keywords
const generatePositions = (count: number) => {
  const positions: { x: number; y: number; rotation: number; scale: number }[] = [];
  const cols = Math.ceil(Math.sqrt(count));
  
  for (let i = 0; i < count; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const cellW = 100 / cols;
    const cellH = 100 / Math.ceil(count / cols);
    
    positions.push({
      x: cellW * col + cellW * 0.2 + Math.random() * cellW * 0.6,
      y: cellH * row + cellH * 0.2 + Math.random() * cellH * 0.6,
      rotation: (Math.random() - 0.5) * 25,
      scale: 0.9 + Math.random() * 0.2,
    });
  }
  return positions;
};

const COLORS = [
  { bg: "hsl(var(--primary) / 0.15)", border: "hsl(var(--primary) / 0.3)", text: "hsl(var(--primary))" },
  { bg: "hsl(45 80% 60% / 0.12)", border: "hsl(45 80% 60% / 0.25)", text: "hsl(45 80% 60%)" },
  { bg: "hsl(175 60% 45% / 0.12)", border: "hsl(175 60% 45% / 0.25)", text: "hsl(175 60% 45%)" },
  { bg: "hsl(270 50% 60% / 0.12)", border: "hsl(270 50% 60% / 0.25)", text: "hsl(270 50% 60%)" },
];

const DraggableKeyword = ({ 
  word, 
  index, 
  initialPos 
}: { 
  word: string; 
  index: number; 
  initialPos: { x: number; y: number; rotation: number; scale: number };
}) => {
  const controls = useAnimation();
  const color = COLORS[index % COLORS.length];
  const [isDragging, setIsDragging] = useState(false);
  const velocityRef = useRef({ x: 0, y: 0 });

  const handleDragEnd = useCallback((_: any, info: PanInfo) => {
    setIsDragging(false);
    velocityRef.current = { x: info.velocity.x, y: info.velocity.y };
    
    // "Throw" effect - animate with velocity then settle
    const throwX = info.velocity.x * 0.3;
    const throwY = info.velocity.y * 0.3;
    
    controls.start({
      x: info.point.x + throwX - window.innerWidth / 2,
      y: info.point.y + throwY - window.innerHeight / 2,
      rotate: initialPos.rotation + (info.velocity.x * 0.05),
      transition: { type: "spring", damping: 15, stiffness: 100, mass: 0.8 },
    });
  }, [controls, initialPos.rotation]);

  return (
    <motion.div
      drag
      dragMomentum={false}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      animate={controls}
      initial={{ 
        opacity: 0, 
        scale: 0.3,
        rotate: initialPos.rotation,
      }}
      whileInView={{
        opacity: 1,
        scale: initialPos.scale,
        transition: { delay: index * 0.06, duration: 0.5, ease: "backOut" },
      }}
      whileHover={{ scale: initialPos.scale * 1.1 }}
      whileDrag={{ scale: 1.15, zIndex: 50 }}
      style={{
        position: "absolute",
        left: `${initialPos.x}%`,
        top: `${initialPos.y}%`,
        cursor: isDragging ? "grabbing" : "grab",
        userSelect: "none",
        touchAction: "none",
      }}
      className="transform -translate-x-1/2 -translate-y-1/2"
    >
      <div
        className="px-4 py-2 rounded-full border backdrop-blur-sm whitespace-nowrap text-sm font-medium shadow-lg transition-shadow duration-200"
        style={{
          backgroundColor: color.bg,
          borderColor: color.border,
          color: color.text,
          boxShadow: isDragging 
            ? `0 12px 40px -8px ${color.border}` 
            : `0 4px 16px -4px ${color.border}`,
        }}
      >
        {word}
      </div>
    </motion.div>
  );
};

const KeywordGame = ({ keywords }: KeywordGameProps) => {
  const [positions] = useState(() => generatePositions(keywords.length));
  const containerRef = useRef<HTMLDivElement>(null);

  if (!keywords.length) return null;

  const rows = Math.ceil(keywords.length / Math.ceil(Math.sqrt(keywords.length)));
  const minHeight = Math.max(200, rows * 80 + 40);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-12"
    >
      <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
        <span className="text-lg">✨</span> Høydepunkter
      </h2>
      <p className="text-sm text-muted-foreground mb-4 font-light">
        Dra og kast ordene rundt — dette er hva som definerer stillingen.
      </p>
      <div
        ref={containerRef}
        className="relative rounded-2xl border border-border/15 bg-muted/5 overflow-hidden"
        style={{ minHeight: `${minHeight}px` }}
      >
        {/* Subtle ambient background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/3 w-24 h-24 rounded-full bg-secondary/10 blur-2xl" />
        </div>
        
        {keywords.map((word, i) => (
          <DraggableKeyword
            key={`${word}-${i}`}
            word={word}
            index={i}
            initialPos={positions[i]}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default KeywordGame;
