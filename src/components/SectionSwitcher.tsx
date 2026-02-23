import { Link, useLocation } from "react-router-dom";
import { SECTION_LIST, useSection } from "@/contexts/SectionContext";

const SectionSwitcher = () => {
  const { section } = useSection();
  const location = useLocation();
  const isHub = !section && (location.pathname === "/" || location.pathname === "");

  return (
    <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
      {/* "Alt" option — links to the hub */}
      <Link
        to="/"
        className={`shrink-0 px-3.5 py-1.5 text-[11px] tracking-widest uppercase rounded-full transition-all duration-300 border ${
          isHub
            ? "font-medium border-primary/30 bg-primary/15 text-primary"
            : "text-foreground/40 border-transparent hover:text-foreground/70 hover:bg-muted/30"
        }`}
      >
        Alt
      </Link>

      {SECTION_LIST.map((s) => {
        const isActive = section?.id === s.id;
        const accentStyle = isActive
          ? {
              backgroundColor: `hsl(${s.accent.h} ${s.accent.s}% ${s.accent.l}% / 0.15)`,
              color: `hsl(${s.accent.h} ${s.accent.s}% ${s.accent.l}%)`,
              borderColor: `hsl(${s.accent.h} ${s.accent.s}% ${s.accent.l}% / 0.3)`,
            }
          : {};

        return (
          <Link
            key={s.id}
            to={s.basePath}
            style={accentStyle}
            className={`shrink-0 px-3.5 py-1.5 text-[11px] tracking-widest uppercase rounded-full transition-all duration-300 border ${
              isActive
                ? "font-medium border-current/30"
                : "text-foreground/40 border-transparent hover:text-foreground/70 hover:bg-muted/30"
            }`}
          >
            {s.shortName}
          </Link>
        );
      })}
    </div>
  );
};

export default SectionSwitcher;
