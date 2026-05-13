import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useSection } from "@/contexts/SectionContext";

/**
 * Sticky bottom CTA visible only on mobile content pages.
 * Goal: increase conversions from passive readers → contact form.
 * Hidden on: contact, login, admin, kunde, workspace, karriere/apply,
 * and after the user has scrolled near the footer.
 */
const HIDDEN_PREFIXES = [
  "/kontakt",
  "/logg-inn",
  "/admin",
  "/kunde",
  "/workspace",
  "/karriere/soknad",
  "/samarbeid/soknad",
];

const StickyMobileCta = () => {
  const location = useLocation();
  const { section, isInSection } = useSection();
  const [visible, setVisible] = useState(false);

  const path = location.pathname;
  const hidden = HIDDEN_PREFIXES.some((p) => path.startsWith(p) || path.endsWith(p));

  useEffect(() => {
    if (hidden) return;
    const onScroll = () => {
      // Show after the user has scrolled a bit (~half a viewport)
      const scrolled = window.scrollY > Math.min(400, window.innerHeight * 0.4);
      // Hide near footer to avoid covering it
      const nearBottom =
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 220;
      setVisible(scrolled && !nearBottom);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [hidden, path]);

  if (hidden) return null;

  const target = isInSection && section ? `${section.basePath}/kontakt` : "/kontakt";

  return (
    <div
      className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 transition-all duration-500 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
      }`}
      style={{
        background:
          "linear-gradient(to top, hsl(var(--background)) 60%, hsl(var(--background) / 0))",
      }}
    >
      <Link
        to={target}
        className="group flex items-center justify-between gap-3 w-full px-5 py-3.5 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25"
      >
        <span className="flex flex-col leading-tight">
          <span className="text-[14px] font-medium">Få et uforpliktende tilbud</span>
          <span className="text-[11px] opacity-75 font-light">Tar 30 sek · Svar innen 24 t</span>
        </span>
        <ArrowRight
          size={16}
          className="shrink-0 group-hover:translate-x-1 transition-transform"
        />
      </Link>
    </div>
  );
};

export default StickyMobileCta;
