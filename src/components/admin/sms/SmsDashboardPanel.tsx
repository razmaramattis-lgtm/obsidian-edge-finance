import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Clock, AlertTriangle, Smartphone, TrendingUp, RefreshCw, CheckCircle2, XCircle, Wifi, WifiOff, Loader2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const statusBadge = (status: string) => {
  const map: Record<string, { label: string; cls: string }> = {
    sent: { label: "Sendt", cls: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" },
    queued: { label: "I kø", cls: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400" },
    sending: { label: "Sender", cls: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" },
    failed: { label: "Feilet", cls: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
    online: { label: "Online", cls: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" },
    offline: { label: "Offline", cls: "bg-muted text-muted-foreground" },
  };
  const m = map[status] || { label: status, cls: "bg-muted text-muted-foreground" };
  return <Badge className={`text-[10px] ${m.cls}`}>{m.label}</Badge>;
};

const fmtDate = (d: string) => new Date(d).toLocaleString("nb-NO", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

const SmsDashboardPanel = () => {
  const [stats, setStats] = useState({ sentToday: 0, sentTotal: 0, queued: 0, failed: 0, devices: 0, successRate: 0 });
  const [recentSent, setRecentSent] = useState<any[]>([]);
  const [queuedMessages, setQueuedMessages] = useState<any[]>([]);
  const [devices, setDevices] = useState<any[]>([]);
  const [dailyVolume, setDailyVolume] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("overview");

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const today = new Date().toISOString().split("T")[0];

    const [sentTodayRes, queuedRes, failedRes, devicesOnlineRes, totalRes, sentTotalRes] = await Promise.all([
      supabase.from("sms_messages").select("*", { count: "exact", head: true }).eq("status", "sent").gte("sent_at", today),
      supabase.from("sms_messages").select("*", { count: "exact", head: true }).eq("status", "queued"),
      supabase.from("sms_messages").select("*", { count: "exact", head: true }).eq("status", "failed"),
      supabase.from("sms_devices").select("*", { count: "exact", head: true }).eq("status", "online"),
      supabase.from("sms_messages").select("*", { count: "exact", head: true }).in("status", ["sent", "failed"]),
      supabase.from("sms_messages").select("*", { count: "exact", head: true }).eq("status", "sent"),
    ]);

    const sent = sentTodayRes.count || 0;
    const total = totalRes.count || 0;

    setStats({
      sentToday: sent,
      sentTotal: sentTotalRes.count || 0,
      queued: queuedRes.count || 0,
      failed: failedRes.count || 0,
      devices: devicesOnlineRes.count || 0,
      successRate: total > 0 ? Math.round(((sentTotalRes.count || 0) / total) * 100) : 100,
    });

    // Recent sent
    const { data: sentData } = await supabase
      .from("sms_messages")
      .select("id, phone, message, status, sent_at, created_at, sms_devices(device_name)")
      .eq("status", "sent")
      .order("sent_at", { ascending: false })
      .limit(20);
    setRecentSent(sentData || []);

    // Queued
    const { data: queueData } = await supabase
      .from("sms_messages")
      .select("id, phone, message, status, created_at, sms_devices(device_name)")
      .in("status", ["queued", "sending"])
      .order("created_at", { ascending: true })
      .limit(50);
    setQueuedMessages(queueData || []);

    // Devices
    const { data: devData } = await supabase
      .from("sms_devices")
      .select("*")
      .order("status", { ascending: true });
    setDevices(devData || []);

    // Daily volume (last 7 days)
    const days: any[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const nextDate = new Date(d.getTime() + 86400000).toISOString().split("T")[0];
      const { count } = await supabase.from("sms_messages").select("*", { count: "exact", head: true }).gte("created_at", dateStr).lt("created_at", nextDate);
      days.push({ date: d.toLocaleDateString("nb-NO", { weekday: "short", day: "numeric" }), count: count || 0 });
    }
    setDailyVolume(days);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // Auto-refresh every 15s
  useEffect(() => {
    const interval = setInterval(fetchAll, 15000);
    return () => clearInterval(interval);
  }, [fetchAll]);

  const statCards = [
    { label: "Sendt i dag", value: stats.sentToday, icon: MessageSquare, color: "text-emerald-500" },
    { label: "Totalt sendt", value: stats.sentTotal, icon: CheckCircle2, color: "text-emerald-600" },
    { label: "I kø", value: stats.queued, icon: Clock, color: "text-amber-500" },
    { label: "Feilet", value: stats.failed, icon: AlertTriangle, color: "text-destructive" },
    { label: "Enheter online", value: stats.devices, icon: Smartphone, color: "text-blue-500" },
    { label: "Suksessrate", value: `${stats.successRate}%`, icon: TrendingUp, color: "text-primary" },
  ];

  return (
    <div className="space-y-4">
      {/* Header with refresh */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">Oppdateres automatisk hvert 15. sekund</p>
        <Button variant="ghost" size="sm" onClick={fetchAll} disabled={loading} className="h-8 gap-1.5">
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
          <span className="hidden sm:inline text-xs">Oppdater</span>
        </Button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
        {statCards.map(c => (
          <Card key={c.label} className="border-border/20">
            <CardContent className="p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <c.icon size={14} className={c.color} />
                <span className="text-[10px] text-muted-foreground">{c.label}</span>
              </div>
              <p className="text-xl font-semibold">{c.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabbed sections */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="h-9">
          <TabsTrigger value="overview" className="text-xs gap-1.5">
            <TrendingUp size={13} /> Oversikt
          </TabsTrigger>
          <TabsTrigger value="sent" className="text-xs gap-1.5">
            <CheckCircle2 size={13} /> Sendt ({recentSent.length})
          </TabsTrigger>
          <TabsTrigger value="queue" className="text-xs gap-1.5">
            <Clock size={13} /> Kø ({queuedMessages.length})
          </TabsTrigger>
          <TabsTrigger value="devices" className="text-xs gap-1.5">
            <Smartphone size={13} /> Enheter ({devices.length})
          </TabsTrigger>
        </TabsList>

        {/* Overview tab */}
        <TabsContent value="overview" className="mt-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-border/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Daglig meldingsvolum (7 dager)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={dailyVolume}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Quick queue preview */}
            <Card className="border-border/20">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium">Køstatus</CardTitle>
                {queuedMessages.length > 0 && (
                  <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-300">
                    <Loader2 size={10} className="animate-spin mr-1" /> {queuedMessages.length} venter
                  </Badge>
                )}
              </CardHeader>
              <CardContent>
                {queuedMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                    <CheckCircle2 size={28} className="mb-2 text-emerald-500" />
                    <p className="text-sm font-medium">Ingen meldinger i kø</p>
                    <p className="text-xs">Alt er sendt!</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {queuedMessages.slice(0, 5).map(m => (
                      <div key={m.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/40 text-xs">
                        <div className="min-w-0">
                          <span className="font-mono">{m.phone}</span>
                          <p className="text-muted-foreground truncate max-w-[200px]">{m.message}</p>
                        </div>
                        {statusBadge(m.status)}
                      </div>
                    ))}
                    {queuedMessages.length > 5 && (
                      <button onClick={() => setTab("queue")} className="text-xs text-primary hover:underline w-full text-center py-1">
                        + {queuedMessages.length - 5} flere i kø →
                      </button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Sent messages tab */}
        <TabsContent value="sent" className="mt-4">
          <Card className="border-border/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Siste sendte meldinger</CardTitle>
            </CardHeader>
            <CardContent>
              {recentSent.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">Ingen sendte meldinger ennå</p>
              ) : (
                <>
                  {/* Mobile cards */}
                  <div className="md:hidden space-y-2">
                    {recentSent.map(m => (
                      <div key={m.id} className="p-3 rounded-lg bg-muted/30 border border-border/10 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-medium">{m.phone}</span>
                          {statusBadge(m.status)}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">{m.message}</p>
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                          <span>{m.sms_devices?.device_name || "—"}</span>
                          <span>{fmtDate(m.sent_at || m.created_at)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Desktop table */}
                  <div className="hidden md:block">
                    <ScrollArea className="w-full">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[120px]">Telefon</TableHead>
                            <TableHead>Melding</TableHead>
                            <TableHead className="w-[80px]">Status</TableHead>
                            <TableHead className="w-[120px]">Enhet</TableHead>
                            <TableHead className="w-[140px]">Sendt</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {recentSent.map(m => (
                            <TableRow key={m.id}>
                              <TableCell className="font-mono text-xs">{m.phone}</TableCell>
                              <TableCell className="max-w-xs truncate text-sm">{m.message}</TableCell>
                              <TableCell>{statusBadge(m.status)}</TableCell>
                              <TableCell className="text-xs text-muted-foreground">{m.sms_devices?.device_name || "—"}</TableCell>
                              <TableCell className="text-xs text-muted-foreground">{fmtDate(m.sent_at || m.created_at)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Queue tab */}
        <TabsContent value="queue" className="mt-4">
          <Card className="border-border/20">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">Meldinger i kø</CardTitle>
              {queuedMessages.length > 0 && (
                <Badge variant="outline" className="text-[10px]">{queuedMessages.length} meldinger</Badge>
              )}
            </CardHeader>
            <CardContent>
              {queuedMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <CheckCircle2 size={32} className="mb-3 text-emerald-500" />
                  <p className="text-sm font-medium">Køen er tom</p>
                  <p className="text-xs">Alle meldinger er behandlet</p>
                </div>
              ) : (
                <>
                  {/* Mobile cards */}
                  <div className="md:hidden space-y-2">
                    {queuedMessages.map(m => (
                      <div key={m.id} className="p-3 rounded-lg bg-amber-50/50 dark:bg-amber-900/10 border border-amber-200/30 dark:border-amber-800/20 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-medium">{m.phone}</span>
                          {statusBadge(m.status)}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">{m.message}</p>
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                          <span>{m.sms_devices?.device_name || "Ikke tildelt"}</span>
                          <span>Lagt i kø {fmtDate(m.created_at)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Desktop table */}
                  <div className="hidden md:block">
                    <ScrollArea className="w-full">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[40px]">#</TableHead>
                            <TableHead className="w-[120px]">Telefon</TableHead>
                            <TableHead>Melding</TableHead>
                            <TableHead className="w-[80px]">Status</TableHead>
                            <TableHead className="w-[120px]">Enhet</TableHead>
                            <TableHead className="w-[140px]">Lagt i kø</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {queuedMessages.map((m, i) => (
                            <TableRow key={m.id}>
                              <TableCell className="text-xs text-muted-foreground">{i + 1}</TableCell>
                              <TableCell className="font-mono text-xs">{m.phone}</TableCell>
                              <TableCell className="max-w-xs truncate text-sm">{m.message}</TableCell>
                              <TableCell>{statusBadge(m.status)}</TableCell>
                              <TableCell className="text-xs text-muted-foreground">{m.sms_devices?.device_name || "—"}</TableCell>
                              <TableCell className="text-xs text-muted-foreground">{fmtDate(m.created_at)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Devices tab */}
        <TabsContent value="devices" className="mt-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {devices.length === 0 ? (
              <Card className="border-border/20 col-span-full">
                <CardContent className="py-12 text-center text-muted-foreground">
                  <Smartphone size={28} className="mx-auto mb-3 opacity-40" />
                  <p className="text-sm font-medium">Ingen enheter registrert</p>
                  <p className="text-xs">Gå til /gateway på en Android-enhet for å koble til</p>
                </CardContent>
              </Card>
            ) : devices.map(d => (
              <Card key={d.id} className={`border-border/20 ${d.status === "online" ? "ring-1 ring-emerald-500/20" : ""}`}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {d.status === "online" ? (
                        <Wifi size={16} className="text-emerald-500" />
                      ) : (
                        <WifiOff size={16} className="text-muted-foreground" />
                      )}
                      <span className="text-sm font-medium">{d.device_name}</span>
                    </div>
                    {statusBadge(d.status)}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded bg-muted/40">
                      <p className="text-muted-foreground text-[10px]">Sendt i dag</p>
                      <p className="font-semibold">{d.messages_sent_today || 0}</p>
                    </div>
                    <div className="p-2 rounded bg-muted/40">
                      <p className="text-muted-foreground text-[10px]">Maks/dag</p>
                      <p className="font-semibold">{d.daily_limit || "∞"}</p>
                    </div>
                  </div>
                  {d.phone_number && (
                    <p className="text-xs text-muted-foreground font-mono">{d.phone_number}</p>
                  )}
                  <p className="text-[10px] text-muted-foreground">
                    Sist sett: {d.last_seen_at ? fmtDate(d.last_seen_at) : "Aldri"}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SmsDashboardPanel;
