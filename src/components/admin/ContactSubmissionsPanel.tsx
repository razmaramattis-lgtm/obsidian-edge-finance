import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Phone, Building2, User, Package, TrendingUp, MapPin, MessageSquare, Check, Archive, ChevronDown, ChevronUp, Loader2, Search, Clock, CheckCircle, ArchiveIcon } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { nb } from "date-fns/locale";

interface Submission {
  id: string;
  company_name: string | null;
  org_number: string | null;
  contact_person: string | null;
  email: string | null;
  phone: string | null;
  industry: string | null;
  industry_code: string | null;
  revenue_target: string | null;
  message: string | null;
  package: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  new: { label: "Ny", color: "bg-destructive/10 text-destructive", icon: Clock },
  contacted: { label: "Kontaktet", color: "bg-primary/10 text-primary", icon: CheckCircle },
  archived: { label: "Arkivert", color: "bg-muted text-muted-foreground", icon: ArchiveIcon },
};

const ContactSubmissionsPanel = ({ onStatusChange }: { onStatusChange?: () => void }) => {
  const [items, setItems] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "new" | "contacted" | "archived">("all");

  const load = async () => {
    const { data } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });
    setItems((data as Submission[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("contact_submissions").update({ status }).eq("id", id);
    toast.success(status === "contacted" ? "Markert som kontaktet" : "Arkivert");
    await load();
    onStatusChange?.();
  };

  const filtered = items.filter(s => {
    if (filter !== "all" && s.status !== filter) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return [s.company_name, s.contact_person, s.email, s.phone, s.message, s.package, s.industry]
      .some(f => f?.toLowerCase().includes(q));
  });

  const newCount = items.filter(s => s.status === "new").length;
  const contactedCount = items.filter(s => s.status === "contacted").length;
  const archivedCount = items.filter(s => s.status === "archived").length;

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 size={20} className="animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-lg">Henvendelser</h2>
        <p className="text-xs text-muted-foreground">Alle innkommende henvendelser fra kontaktskjemaet</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Nye", count: newCount, color: "text-destructive", filterKey: "new" as const },
          { label: "Kontaktet", count: contactedCount, color: "text-primary", filterKey: "contacted" as const },
          { label: "Arkivert", count: archivedCount, color: "text-muted-foreground", filterKey: "archived" as const },
        ].map(s => (
          <button
            key={s.filterKey}
            onClick={() => setFilter(filter === s.filterKey ? "all" : s.filterKey)}
            className={`glass rounded-xl p-4 text-left border transition-colors ${filter === s.filterKey ? "border-primary/30 bg-primary/5" : "border-border/20 hover:border-border/40"}`}
          >
            <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">{s.label}</p>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Søk etter selskap, kontaktperson, e-post..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-muted/30 border border-border/20 text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/30"
        />
      </div>

      {/* List */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-10">Ingen henvendelser funnet.</p>
        )}
        {filtered.map(s => {
          const expanded = expandedId === s.id;
          const cfg = statusConfig[s.status] || statusConfig.new;
          const StatusIcon = cfg.icon;
          const dateStr = format(new Date(s.created_at), "d. MMMM yyyy 'kl.' HH:mm", { locale: nb });

          return (
            <div key={s.id} className="glass rounded-xl border border-border/20 overflow-hidden">
              {/* Header */}
              <button
                onClick={() => setExpandedId(expanded ? null : s.id)}
                className="w-full flex items-center gap-3 px-5 py-3.5 text-left hover:bg-muted/20 transition-colors"
              >
                {expanded ? <ChevronUp size={13} className="text-muted-foreground/50 shrink-0" /> : <ChevronDown size={13} className="text-muted-foreground/50 shrink-0" />}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">{s.contact_person || s.company_name || s.email || "Ukjent"}</p>
                    {s.package && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/20 text-accent-foreground font-medium">{s.package}</span>
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {s.company_name && s.contact_person ? `${s.company_name} · ` : ""}{dateStr}
                  </p>
                </div>
                <span className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded-full font-medium shrink-0 ${cfg.color}`}>
                  <StatusIcon size={10} />
                  {cfg.label}
                </span>
              </button>

              {/* Detail */}
              {expanded && (
                <div className="px-5 pb-5 border-t border-border/10 bg-muted/10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
                    {s.contact_person && (
                      <div className="flex items-start gap-2">
                        <User size={13} className="text-muted-foreground mt-0.5 shrink-0" />
                        <div>
                          <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">Kontaktperson</p>
                          <p className="text-sm">{s.contact_person}</p>
                        </div>
                      </div>
                    )}
                    {s.company_name && (
                      <div className="flex items-start gap-2">
                        <Building2 size={13} className="text-muted-foreground mt-0.5 shrink-0" />
                        <div>
                          <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">Selskap</p>
                          <p className="text-sm">{s.company_name}{s.org_number ? ` (${s.org_number})` : ""}</p>
                        </div>
                      </div>
                    )}
                    {s.email && (
                      <div className="flex items-start gap-2">
                        <Mail size={13} className="text-muted-foreground mt-0.5 shrink-0" />
                        <div>
                          <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">E-post</p>
                          <a href={`mailto:${s.email}`} className="text-sm text-primary hover:underline">{s.email}</a>
                        </div>
                      </div>
                    )}
                    {s.phone && (
                      <div className="flex items-start gap-2">
                        <Phone size={13} className="text-muted-foreground mt-0.5 shrink-0" />
                        <div>
                          <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">Telefon</p>
                          <a href={`tel:${s.phone}`} className="text-sm text-primary hover:underline">{s.phone}</a>
                        </div>
                      </div>
                    )}
                    {s.industry && (
                      <div className="flex items-start gap-2">
                        <MapPin size={13} className="text-muted-foreground mt-0.5 shrink-0" />
                        <div>
                          <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">Bransje</p>
                          <p className="text-sm">{s.industry}{s.industry_code ? ` (${s.industry_code})` : ""}</p>
                        </div>
                      </div>
                    )}
                    {s.package && (
                      <div className="flex items-start gap-2">
                        <Package size={13} className="text-muted-foreground mt-0.5 shrink-0" />
                        <div>
                          <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">Valgt pakke</p>
                          <p className="text-sm">{s.package}</p>
                        </div>
                      </div>
                    )}
                    {s.revenue_target && (
                      <div className="flex items-start gap-2">
                        <TrendingUp size={13} className="text-muted-foreground mt-0.5 shrink-0" />
                        <div>
                          <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">Omsetningsmål</p>
                          <p className="text-sm">{s.revenue_target}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {s.message && (
                    <div className="flex items-start gap-2 py-3 border-t border-border/10">
                      <MessageSquare size={13} className="text-muted-foreground mt-0.5 shrink-0" />
                      <div className="flex-1">
                        <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wider mb-1">Melding</p>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{s.message}</p>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-3 border-t border-border/10">
                    {s.status === "new" && (
                      <>
                        <button
                          onClick={() => updateStatus(s.id, "contacted")}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                        >
                          <Check size={11} />
                          Marker som kontaktet
                        </button>
                        <button
                          onClick={() => updateStatus(s.id, "archived")}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        >
                          <Archive size={11} />
                          Arkiver
                        </button>
                      </>
                    )}
                    {s.status === "contacted" && (
                      <button
                        onClick={() => updateStatus(s.id, "archived")}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      >
                        <Archive size={11} />
                        Arkiver
                      </button>
                    )}
                    {s.status === "archived" && (
                      <button
                        onClick={() => updateStatus(s.id, "new")}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      >
                        <Clock size={11} />
                        Gjenåpne
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ContactSubmissionsPanel;