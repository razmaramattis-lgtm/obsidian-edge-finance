import { useSection } from "@/contexts/SectionContext";

/**
 * Injects CSS custom property overrides for the active section's accent color.
 * Wraps children in a div that overrides --primary, --ring, --rose, --rose-glow.
 */
const SectionTheme = ({ children }: { children: React.ReactNode }) => {
  const { section, isInSection } = useSection();

  if (!isInSection || !section) {
    return <>{children}</>;
  }

  const { accent, accentGlow } = section;
  const style = {
    "--primary": `${accent.h} ${accent.s}% ${accent.l}%`,
    "--ring": `${accent.h} ${accent.s}% ${accent.l}%`,
    "--rose": `${accent.h} ${accent.s}% ${accent.l}%`,
    "--rose-glow": `${accentGlow.h} ${accentGlow.s}% ${accentGlow.l}%`,
  } as React.CSSProperties;

  return <div style={style}>{children}</div>;
};

export default SectionTheme;
