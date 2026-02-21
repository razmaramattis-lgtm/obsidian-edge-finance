import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CalendarClock, ExternalLink, AlertTriangle, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type CompanyType = "as" | "enk" | "arbeidsgiver";

const TYPE_LABELS: Record<CompanyType, string> = {
  as: "AS",
  enk: "ENK",
  arbeidsgiver: "Arbeidsgiver",
};

interface Deadline {
  date: string;
  day: number;
  month: string;
  year: number;
  title: string;
  url: string;
  types?: CompanyType[];
}

interface TaxDeadlineWidgetProps {
  limit?: number;
  compact?: boolean;
  showHeader?: boolean;
  className?: string;
}

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("nb-NO", { day: "numeric", month: "short" });
};

const daysUntil = (dateStr: string) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(dateStr + "T00:00:00");
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
};

const TaxDeadlineWidget = ({
  limit = 5,
  compact = false,
  showHeader = true,
  className = "",
}: TaxDeadlineWidgetProps) => {
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTypes, setActiveTypes] = useState<CompanyType[]>([]);

  const toggleType = (type: CompanyType) => {
    setActiveTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const fetchDeadlines = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("tax-deadlines", {
        body: { limit: limit + 10, filterRelevant: true, types: activeTypes },
      });
      if (fnError) throw new Error(fnError.message);
      setDeadlines((data?.deadlines || []).slice(0, limit));
    } catch (e) {
      setError("Kunne ikke hente frister");
      console.error("Tax deadlines error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeadlines();
  }, [limit, activeTypes]);

  if (loading) {
    return (
      <div className={`glass rounded-2xl p-5 border border-border/20 ${className}`}>
        <div className="flex items-center gap-2 mb-4">
          <CalendarClock size={15} className="text-primary animate-pulse" strokeWidth={1.5} />
          <span className="text-sm text-muted-foreground">Henter frister…</span>
        </div>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-10 bg-muted/30 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`glass rounded-2xl p-5 border border-border/20 ${className}`}>
        <div className="flex items-center gap-2 text-muted-foreground">
          <AlertTriangle size={14} />
          <span className="text-xs">{error}</span>
          <button onClick={fetchDeadlines} className="ml-auto text-primary hover:text-primary/80">
            <RefreshCw size={13} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`glass rounded-2xl border border-border/20 ${compact ? "p-4" : "p-5"} ${className}`}>
      {showHeader && (
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CalendarClock size={15} className="text-primary" strokeWidth={1.5} />
            <h3 className={compact ? "font-medium text-xs" : "font-medium text-sm"}>
              Skattefrister
            </h3>
          </div>
          <a
            href="https://www.skatteetaten.no/bedrift-og-organisasjon/starte-og-drive/frister-gebyrer-og-tilleggsskatt/frister-og-oppgaver/"
            target="_blank"
            rel="noreferrer"
            className="text-[9px] tracking-wider uppercase text-muted-foreground/60 hover:text-primary transition-colors flex items-center gap-1"
          >
            Skatteetaten <ExternalLink size={9} />
          </a>
        </div>
      )}

      {/* Filter toggles */}
      <div className="flex gap-1.5 mb-3 flex-wrap">
        {(Object.keys(TYPE_LABELS) as CompanyType[]).map(type => {
          const isActive = activeTypes.length === 0 || activeTypes.includes(type);
          return (
            <button
              key={type}
              onClick={() => toggleType(type)}
              className={`text-[10px] px-2.5 py-1 rounded-full border transition-all ${
                activeTypes.includes(type)
                  ? "bg-primary/15 border-primary/30 text-primary font-medium"
                  : activeTypes.length === 0
                  ? "bg-muted/30 border-border/20 text-muted-foreground hover:border-primary/20"
                  : "bg-muted/20 border-border/10 text-muted-foreground/40 hover:border-border/30"
              }`}
            >
              {TYPE_LABELS[type]}
            </button>
          );
        })}
        {activeTypes.length > 0 && (
          <button
            onClick={() => setActiveTypes([])}
            className="text-[10px] px-2 py-1 text-muted-foreground/50 hover:text-primary transition-colors"
          >
            Vis alle
          </button>
        )}
      </div>

      {deadlines.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-4">Ingen kommende frister funnet</p>
      ) : (
        <div className="space-y-1.5">
          {deadlines.map((d, i) => {
            const days = daysUntil(d.date);
            const isUrgent = days <= 7;
            const isSoon = days <= 14;

            return (
              <motion.a
                key={`${d.date}-${i}`}
                href={d.url}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 group hover:bg-muted/40 transition-all ${
                  isUrgent ? "border border-destructive/20 bg-destructive/5" : ""
                }`}
              >
                {/* Date badge */}
                <div className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center shrink-0 text-center ${
                  isUrgent
                    ? "bg-destructive/15 text-destructive"
                    : isSoon
                    ? "bg-primary/15 text-primary"
                    : "bg-muted/50 text-muted-foreground"
                }`}>
                  <span className="text-sm font-bold leading-none">{d.day}</span>
                  <span className="text-[8px] uppercase tracking-wider leading-none mt-0.5">
                    {d.month.substring(0, 3)}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className={`text-xs leading-snug group-hover:text-primary transition-colors ${
                    compact ? "line-clamp-1" : "line-clamp-2"
                  }`}>
                    {d.title}
                  </p>
                  <p className={`text-[10px] mt-0.5 ${
                    isUrgent
                      ? "text-destructive font-medium"
                      : "text-muted-foreground/60"
                  }`}>
                    {days === 0
                      ? "I dag!"
                      : days === 1
                      ? "I morgen"
                      : `om ${days} dager`}
                  </p>
                </div>

                <ExternalLink size={11} className="text-muted-foreground/30 group-hover:text-primary shrink-0 transition-colors" />
              </motion.a>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TaxDeadlineWidget;
