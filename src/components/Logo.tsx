import { cn } from "@/lib/utils";
import creamLogoAsset from "@/assets/avargo-logo-krem-1000px.png.asset.json";
import forestLogoAsset from "@/assets/avargo-logo-forest-1000px.png.asset.json";

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
  const src = theme === "dark" ? creamLogoAsset.url : forestLogoAsset.url;
  return (
    <img
      src={src}
      alt={ariaLabel}
      className={cn("shrink-0 h-auto w-auto object-contain", className)}
      style={{
        // Keep the wordmark readable on very small sizes
        maxHeight: "100%",
      }}
    />
  );
};

export default Logo;
