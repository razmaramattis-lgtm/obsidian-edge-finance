import { Users, Building2, Lock, Clock, Sparkles } from "lucide-react";

/**
 * SocialProofBar
 *
 * Bevisst IKKE basert på antall kunder/henvendelser (for tidlig fase).
 * Bruker reelle, etterprøvbare bedrifts-fakta som styrker tillit uten
 * å antyde fake testimonials.
 */
const SocialProofBar = () => {
  const items = [
    { icon: Users, value: "8", label: "rådgivere", sub: "i teamet" },
    { icon: Building2, value: "4", label: "fagavdelinger", sub: "Regnskap · HR · Marked · IT" },
    { icon: Lock, value: "Kryptert", label: "datalagring", sub: "i Norge/EU" },
    { icon: Clock, value: "24t", label: "responstid", sub: "garantert svar" },
    { icon: Sparkles, value: "0 kr", label: "binding", sub: "ingen oppstartskostnad" },
  ];

  return (
    <div className="rounded-2xl glass border border-border/20 px-4 md:px-6 py-4 md:py-5">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-2">
        {items.map((it, i) => {
          const Icon = it.icon;
          return (
            <div key={i} className="flex flex-col md:items-center md:text-center gap-1">
              <div className="flex items-center gap-2 md:flex-col md:gap-1">
                <Icon size={14} className="text-primary md:hidden" strokeWidth={1.8} />
                <Icon size={16} className="text-primary hidden md:block" strokeWidth={1.5} />
                <span className="font-heading text-xl md:text-2xl text-foreground/90">{it.value}</span>
              </div>
              <p className="text-[11px] md:text-xs text-foreground/70 font-medium leading-tight">{it.label}</p>
              <p className="text-[10px] text-foreground/40 font-light leading-tight">{it.sub}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SocialProofBar;
