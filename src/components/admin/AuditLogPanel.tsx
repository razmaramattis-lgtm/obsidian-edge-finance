import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Shield, Search, Download, ChevronLeft, ChevronRight, Clock, User, Database } from "lucide-react";
import { format } from "date-fns";
import { nb } from "date-fns/locale";

interface AuditEntry {
  id: string;
  created_at: string;
  actor_id: string | null;
  actor_email: string | null;
  action: string;
  resource_type: string;
  resource_id: string | null;
  details: Record<string, unknown> | null;
  ip_address: string | null;
  actor?: { name: string; email: string } | null;
}

const ACTION_LABELS: Record<string, { label: string; color: string }> = {
  create: { label: "Opprettet", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  update: { label: "Endret", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  delete: { label: "Slettet", color: "bg-red-500/10 text-red-400 border-red-500/20" },
  login: { label: "Innlogging", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  logout: { label: "Utlogging", color: "bg-slate-500/10 text-slate-400 border-slate-500/20" },
  export: { label: "Eksport", color: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
};

const RESOURCE_LABELS: Record<string, string> = {
  profiles: "Brukerprofil",
  customer_companies: "Kundeselskap",
  customer_documents: "Kundedokument",
  customer_financials: "Kundeøkonomi",
  employee_panel_access: "Paneltilgang",
  bookings: "Booking",
  dm_messages: "Direktemelding",
};

const PAGE_SIZE = 25;

const AuditLogPanel = () => {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [resourceFilter, setResourceFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchEntries = async () => {
    setLoading(true);
    let query = supabase
      .from("audit_log")
      .select("*, actor:profiles!audit_log_actor_id_fkey(name, email)", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

    if (actionFilter !== "all") query = query.eq("action", actionFilter);
    if (resourceFilter !== "all") query = query.eq("resource_type", resourceFilter);
    if (search) query = query.or(`resource_id.ilike.%${search}%,actor_email.ilike.%${search}%`);

    const { data, count } = await query;
    setEntries((data as unknown as AuditEntry[]) || []);
    setTotal(count || 0);
    setLoading(false);
  };

  useEffect(() => { fetchEntries(); }, [page, actionFilter, resourceFilter]);
  useEffect(() => { const t = setTimeout(fetchEntries, 300); return () => clearTimeout(t); }, [search]);

  const exportCsv = () => {
    const headers = ["Tidspunkt", "Bruker", "Handling", "Ressurs", "Ressurs-ID"];
    const rows = entries.map(e => [
      format(new Date(e.created_at), "yyyy-MM-dd HH:mm:ss"),
      e.actor?.name || e.actor_email || "System",
      e.action,
      e.resource_type,
      e.resource_id || "",
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-log-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Shield size={20} className="text-primary shrink-0" />
          <h2 className="text-xl font-heading">Revisjonslogg</h2>
          <Badge variant="outline" className="text-[10px]">ISO 27001</Badge>
        </div>
        <button
          onClick={exportCsv}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs bg-muted/50 hover:bg-muted transition-colors"
        >
          <Download size={13} />
          Eksporter CSV
        </button>
      </div>

      <p className="text-xs text-muted-foreground">
        Automatisk logging av alle endringer i sensitive data. Oppfyller ISO 27001 Annex A.8 (tilgangskontroll) og A.12 (driftsikkerhet).
      </p>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Søk etter bruker eller ressurs-ID..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(0); }}
            className="pl-9 text-sm"
          />
        </div>
        <Select value={actionFilter} onValueChange={v => { setActionFilter(v); setPage(0); }}>
          <SelectTrigger className="w-36 text-sm"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle handlinger</SelectItem>
            <SelectItem value="create">Opprettet</SelectItem>
            <SelectItem value="update">Endret</SelectItem>
            <SelectItem value="delete">Slettet</SelectItem>
            <SelectItem value="login">Innlogging</SelectItem>
            <SelectItem value="export">Eksport</SelectItem>
          </SelectContent>
        </Select>
        <Select value={resourceFilter} onValueChange={v => { setResourceFilter(v); setPage(0); }}>
          <SelectTrigger className="w-44 text-sm"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle ressurser</SelectItem>
            {Object.entries(RESOURCE_LABELS).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Totalt", value: total, icon: Database },
          { label: "Opprettelser", value: entries.filter(e => e.action === "create").length, icon: Shield },
          { label: "Endringer", value: entries.filter(e => e.action === "update").length, icon: Clock },
          { label: "Slettinger", value: entries.filter(e => e.action === "delete").length, icon: User },
        ].map(s => (
          <div key={s.label} className="rounded-xl border border-border/10 bg-muted/20 p-3">
            <div className="flex items-center gap-2 mb-1">
              <s.icon size={13} className="text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.label}</span>
            </div>
            <p className="text-lg font-heading">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/10 bg-muted/20">
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Tidspunkt</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Bruker</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Handling</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Ressurs</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/5">
              {loading ? (
                <tr><td colSpan={5} className="px-4 py-12 text-center text-muted-foreground text-xs">Laster...</td></tr>
              ) : entries.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-12 text-center text-muted-foreground text-xs">Ingen hendelser funnet</td></tr>
              ) : entries.map(entry => (
                <>
                  <tr
                    key={entry.id}
                    onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                    className="hover:bg-muted/10 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {format(new Date(entry.created_at), "dd. MMM yyyy HH:mm:ss", { locale: nb })}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {entry.actor?.name || entry.actor_email || <span className="text-muted-foreground">System</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium border ${ACTION_LABELS[entry.action]?.color || "bg-muted text-muted-foreground"}`}>
                        {ACTION_LABELS[entry.action]?.label || entry.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {RESOURCE_LABELS[entry.resource_type] || entry.resource_type}
                    </td>
                    <td className="px-4 py-3 text-[10px] text-muted-foreground font-mono truncate max-w-[120px]">
                      {entry.resource_id?.slice(0, 8)}...
                    </td>
                  </tr>
                  {expandedId === entry.id && (
                    <tr key={`${entry.id}-detail`}>
                      <td colSpan={5} className="px-4 py-3 bg-muted/5">
                        <pre className="text-[10px] text-muted-foreground overflow-x-auto max-h-48 whitespace-pre-wrap font-mono">
                          {JSON.stringify(entry.details, null, 2)}
                        </pre>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Viser {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, total)} av {total}
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="p-1.5 rounded-lg hover:bg-muted/50 disabled:opacity-30 transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="p-1.5 rounded-lg hover:bg-muted/50 disabled:opacity-30 transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLogPanel;
