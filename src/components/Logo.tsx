import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  variant?: "full" | "icon";
  theme?: "light" | "dark";
  "aria-label"?: string;
};

export const Logo = ({
  className,
  variant = "full",
  theme = "light",
  "aria-label": ariaLabel = "Avargo",
}: LogoProps) => {
  // Public paths so the logo works in both local dev and production.
  const src = theme === "dark" ? "/logo-cream.png" : "/logo.png";
  return (
    <img
      src={src}
      alt={ariaLabel}
      className={cn("shrink-0 h-auto w-auto object-contain", className)}
      style={{ maxHeight: "100%" }}
    />
  );
};

export default Logo;
