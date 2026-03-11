import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Clock, AlertTriangle, Smartphone, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const SmsDashboardPanel = () => {
  const [stats, setStats] = useState({ sentToday: 0, queued: 0, failed: 0, devices: 0, successRate: 0 });
  const [dailyVolume, setDailyVolume] = useState<any[]>([]);
  const [deviceActivity, setDeviceActivity] = useState<any[]>([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const today = new Date().toISOString().split("T")[0];

    const [sentRes, queuedRes, failedRes, devicesRes, totalRes] = await Promise.all([
      supabase.from("sms_messages").select("*", { count: "exact", head: true }).eq("status", "sent").gte("sent_at", today),
      supabase.from("sms_messages").select("*", { count: "exact", head: true }).eq("status", "queued"),
      supabase.from("sms_messages").select("*", { count: "exact", head: true }).eq("status", "failed"),
      supabase.from("sms_devices").select("*", { count: "exact", head: true }).eq("status", "online"),
      supabase.from("sms_messages").select("*", { count: "exact", head: true }).in("status", ["sent", "failed"]),
    ]);

    const sent = sentRes.count || 0;
    const total = totalRes.count || 0;

    setStats({
      sentToday: sent,
      queued: queuedRes.count || 0,
      failed: failedRes.count || 0,
      devices: devicesRes.count || 0,
      successRate: total > 0 ? Math.round((sent / total) * 100) : 100,
    });

    // Daily volume (last 7 days)
    const days: any[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const { count } = await supabase.from("sms_messages").select("*", { count: "exact", head: true }).gte("created_at", dateStr).lt("created_at", new Date(d.getTime() + 86400000).toISOString().split("T")[0]);
      days.push({ date: d.toLocaleDateString("nb-NO", { weekday: "short" }), count: count || 0 });
    }
    setDailyVolume(days);

    // Device activity
    const { data: devs } = await supabase.from("sms_devices").select("device_name, messages_sent_today, status");
    setDeviceActivity(devs?.map(d => ({ name: d.device_name, sent: d.messages_sent_today, status: d.status })) || []);
  };

  const cards = [
    { label: "Sendt i dag", value: stats.sentToday, icon: MessageSquare, color: "text-emerald-500" },
    { label: "I kø", value: stats.queued, icon: Clock, color: "text-amber-500" },
    { label: "Feilet", value: stats.failed, icon: AlertTriangle, color: "text-destructive" },
    { label: "Enheter online", value: stats.devices, icon: Smartphone, color: "text-blue-500" },
    { label: "Suksessrate", value: `${stats.successRate}%`, icon: TrendingUp, color: "text-primary" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {cards.map(c => (
          <Card key={c.label} className="border-border/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <c.icon size={16} className={c.color} />
                <span className="text-xs text-muted-foreground">{c.label}</span>
              </div>
              <p className="text-2xl font-semibold">{c.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="border-border/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Daglig meldingsvolum</CardTitle>
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

        <Card className="border-border/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Enhetsaktivitet</CardTitle>
          </CardHeader>
          <CardContent>
            {deviceActivity.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">Ingen enheter registrert</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={deviceActivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="sent" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SmsDashboardPanel;
