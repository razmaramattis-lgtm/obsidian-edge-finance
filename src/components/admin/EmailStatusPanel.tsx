import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Mail, RefreshCw, AlertTriangle, CheckCircle2, Clock, Ban, Search } from "lucide-react";

type LogRow = {
  id: string;
  message_id: string | null;
  template_name: string | null;
  recipient_email: string | null;
  status: string;
  error_message: string | null;
  metadata: any;
  created_at: string;
};

type Range = "24h" | "7d" | "30d" | "all";

const RANGE_MS: Record<Range, number | null> = {
  "24h": 24 * 3600 * 1000,
  "7d": 7 * 24 * 3600 * 1000,
  "30d": 30 * 24 * 3600 * 1000,
  all: null,
};

const statusStyles: Record<string, { label: string; className: string; icon: any }> = {
  sent: { label: "Sendt", className: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30", icon: CheckCircle2 },
  pending: { label: "I kø", className: "bg-amber-500/15 text-amber-700 border-amber-500/30", icon: Clock },
  dlq: { label: "Feilet", className: "bg-red-500/15 text-red-700 border-red-500/30", icon: AlertTriangle },
  failed: { label: "Feilet", className: "bg-red-500/15 text-red-700 border-red-500/30", icon: AlertTriangle },
  bounced: { label: "Bounced", className: "bg-red-500/15 text-red-700 border-red-500/30", icon: AlertTriangle },
  complained: { label: "Spam-klage", className: "bg-orange-500/15 text-orange-700 border-orange-500/30", icon: AlertTriangle },
  suppressed: { label: "Blokkert", className: "bg-zinc-500/15 text-zinc-700 border-zinc-500/30", icon: Ban },
};

const StatusBadge = ({ status }: { status: string }) => {
  const s = statusStyles[status] || { label: status, className: "bg-muted text-foreground border-border", icon: Mail };
  const Icon = s.icon;
  return (
    <Badge variant="outline" className={`gap-1 ${s.className}`}>
      <Icon className="w-3 h-3" /> {s.label}
    </Badge>
  );
};

const PAGE_SIZE = 50;

const EmailStatusPanel = () => {
  const [rows, setRows] = useState<LogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<Range>("7d");
  const [template, setTemplate] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  const fetchRows = async () => {
    setLoading(true);
    let query = supabase
      .from("email_send_log")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(2000);

    const ms = RANGE_MS[range];
    if (ms) query = query.gte("created_at", new Date(Date.now() - ms).toISOString());

    const { data, error } = await query;
    if (error) {
      console.error(error);
      setRows([]);
    } else {
      // Deduplicate by message_id → keep newest per email
      const seen = new Set<string>();
      const deduped: LogRow[] = [];
      for (const r of (data || []) as LogRow[]) {
        const key = r.message_id || r.id;
        if (seen.has(key)) continue;
        seen.add(key);
        deduped.push(r);
      }
      setRows(deduped);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range]);

  const templates = useMemo(() => {
    const s = new Set<string>();
    rows.forEach(r => r.template_name && s.add(r.template_name));
    return Array.from(s).sort();
  }, [rows]);

  const filtered = useMemo(() => {
    return rows.filter(r => {
      if (template !== "all" && r.template_name !== template) return false;
      if (status !== "all") {
        if (status === "failed" && !["dlq", "failed", "bounced"].includes(r.status)) return false;
        if (status !== "failed" && r.status !== status) return false;
      }
      if (search && !(r.recipient_email || "").toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [rows, template, status, search]);

  const stats = useMemo(() => {
    const s = { total: filtered.length, sent: 0, pending: 0, failed: 0, suppressed: 0 };
    filtered.forEach(r => {
      if (r.status === "sent") s.sent++;
      else if (r.status === "pending") s.pending++;
      else if (["dlq", "failed", "bounced"].includes(r.status)) s.failed++;
      else if (r.status === "suppressed" || r.status === "complained") s.suppressed++;
    });
    return s;
  }, [filtered]);

  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  const templateLabel = (name: string | null) => {
    if (!name) return "—";
    const map: Record<string, string> = {
      "contact-confirmation": "Kontaktbekreftelse",
      "password-reset": "Glemt passord",
      "bulk-email": "Masseutsendelse",
      "signup": "Registrering",
      "magiclink": "Magic link",
      "recovery": "Passord-recovery",
      "invite": "Invitasjon",
      "email_change": "E-postbytte",
      "reauthentication": "Reautentisering",
    };
    return map[name] || name;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-semibold">E-poststatus</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Status per e-post for masseutsendelser, glemt passord og alle andre systemmailer.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: "Totalt", value: stats.total, color: "text-foreground", Icon: Mail },
          { label: "Sendt", value: stats.sent, color: "text-emerald-600", Icon: CheckCircle2 },
          { label: "I kø", value: stats.pending, color: "text-amber-600", Icon: Clock },
          { label: "Feilet", value: stats.failed, color: "text-red-600", Icon: AlertTriangle },
          { label: "Blokkert", value: stats.suppressed, color: "text-zinc-600", Icon: Ban },
        ].map(c => (
          <Card key={c.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{c.label}</span>
                <c.Icon className={`w-4 h-4 ${c.color}`} />
              </div>
              <div className={`text-2xl font-semibold mt-2 ${c.color}`}>{c.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4 flex flex-wrap gap-3 items-center">
          <Select value={range} onValueChange={(v) => { setRange(v as Range); setPage(0); }}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Siste 24 timer</SelectItem>
              <SelectItem value="7d">Siste 7 dager</SelectItem>
              <SelectItem value="30d">Siste 30 dager</SelectItem>
              <SelectItem value="all">Alt</SelectItem>
            </SelectContent>
          </Select>

          <Select value={template} onValueChange={(v) => { setTemplate(v); setPage(0); }}>
            <SelectTrigger className="w-52"><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle typer</SelectItem>
              {templates.map(t => <SelectItem key={t} value={t}>{templateLabel(t)}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={(v) => { setStatus(v); setPage(0); }}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle statuser</SelectItem>
              <SelectItem value="sent">Sendt</SelectItem>
              <SelectItem value="pending">I kø</SelectItem>
              <SelectItem value="failed">Feilet</SelectItem>
              <SelectItem value="suppressed">Blokkert</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Søk e-post..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              className="pl-9"
            />
          </div>

          <Button variant="outline" size="sm" onClick={fetchRows} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} /> Oppdater
          </Button>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="text-left px-4 py-3">Type</th>
                  <th className="text-left px-4 py-3">Mottaker</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Tid</th>
                  <th className="text-left px-4 py-3">Detaljer</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">Laster...</td></tr>
                ) : paged.length === 0 ? (
                  <tr><td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">Ingen e-poster funnet</td></tr>
                ) : paged.map(r => (
                  <tr key={r.id} className="border-t border-border/60 hover:bg-muted/30">
                    <td className="px-4 py-3">{templateLabel(r.template_name)}</td>
                    <td className="px-4 py-3 font-mono text-xs">{r.recipient_email || "—"}</td>
                    <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(r.created_at).toLocaleString("nb-NO")}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground max-w-md truncate" title={r.error_message || ""}>
                      {r.error_message || (r.status === "sent" ? "Levert til mottakers server" : "")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-border/60 text-xs">
              <span className="text-muted-foreground">
                Side {page + 1} av {totalPages} · {filtered.length} e-poster
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Forrige</Button>
                <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>Neste</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailStatusPanel;
