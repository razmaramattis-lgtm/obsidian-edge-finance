import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Timer } from "lucide-react";

export interface SendPacing {
  min: number;
  max: number;
}

export const DEFAULT_PACING: SendPacing = { min: 5, max: 10 };

const PRESETS: { label: string; value: SendPacing }[] = [
  { label: "Umiddelbart", value: { min: 0, max: 0 } },
  { label: "1–3 min", value: { min: 1, max: 3 } },
  { label: "5–10 min", value: { min: 5, max: 10 } },
  { label: "15–30 min", value: { min: 15, max: 30 } },
];

interface Props {
  value: SendPacing;
  onChange: (v: SendPacing) => void;
  recipients?: number;
  className?: string;
}

export function estimatedSpreadMinutes(pacing: SendPacing, recipients: number) {
  if (recipients <= 1) return 0;
  const avg = (Math.max(0, pacing.min) + Math.max(pacing.min, pacing.max)) / 2;
  return Math.round(avg * (recipients - 1));
}

const SendPacingControl = ({ value, onChange, recipients = 0, className = "" }: Props) => {
  const spread = estimatedSpreadMinutes(value, recipients);
  const spreadText =
    spread <= 0
      ? "Alle sendes med én gang"
      : spread < 90
        ? `≈ ${spread} min total utsendingstid`
        : `≈ ${(spread / 60).toFixed(1)} timer total utsendingstid`;

  return (
    <div className={`rounded-xl border border-border/40 bg-muted/30 p-3 space-y-3 ${className}`}>
      <div className="flex items-center gap-2 text-xs font-medium">
        <Timer size={14} className="text-primary shrink-0" />
        Utsendingstempo
        <span className="ml-auto font-normal text-muted-foreground">{spreadText}</span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {PRESETS.map((p) => {
          const active = p.value.min === value.min && p.value.max === value.max;
          return (
            <Button
              key={p.label}
              type="button"
              size="sm"
              variant={active ? "default" : "outline"}
              className="h-7 rounded-full px-3 text-[11px]"
              onClick={() => onChange(p.value)}
            >
              {p.label}
            </Button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-[11px] text-muted-foreground">Min. pause (min)</Label>
          <Input
            type="number"
            min={0}
            max={720}
            className="h-8"
            value={value.min}
            onChange={(e) => {
              const min = Math.max(0, Number(e.target.value) || 0);
              onChange({ min, max: Math.max(min, value.max) });
            }}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-[11px] text-muted-foreground">Maks. pause (min)</Label>
          <Input
            type="number"
            min={0}
            max={720}
            className="h-8"
            value={value.max}
            onChange={(e) => {
              const max = Math.max(0, Number(e.target.value) || 0);
              onChange({ min: Math.min(value.min, max), max });
            }}
          />
        </div>
      </div>

      <p className="text-[11px] text-muted-foreground">
        Systemet venter et tilfeldig antall minutter innenfor intervallet mellom hver e-post, slik at utsendelsen ser naturlig ut og
        unngår spamfiltre.
      </p>
    </div>
  );
};

export default SendPacingControl;
