import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const statusColors: Record<string, string> = {
  queued: "bg-muted text-muted-foreground",
  sending: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  sent: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  failed: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

const SmsHistoryPanel = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [devices, setDevices] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [deviceFilter, setDeviceFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    supabase.from("sms_devices").select("id, device_name").then(({ data }) => setDevices(data || []));
  }, []);

  useEffect(() => { fetchMessages(); }, [statusFilter, deviceFilter, dateFrom, dateTo]);

  const fetchMessages = async () => {
    let q = supabase.from("sms_messages").select("*, sms_devices(device_name)").order("created_at", { ascending: false }).limit(200);
    if (statusFilter !== "all") q = q.eq("status", statusFilter);
    if (deviceFilter !== "all") q = q.eq("device_id", deviceFilter);
    if (dateFrom) q = q.gte("created_at", dateFrom);
    if (dateTo) q = q.lte("created_at", dateTo + "T23:59:59");
    const { data } = await q;
    setMessages(data || []);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle statuser</SelectItem>
            <SelectItem value="queued">I kø</SelectItem>
            <SelectItem value="sending">Sender</SelectItem>
            <SelectItem value="sent">Sendt</SelectItem>
            <SelectItem value="failed">Feilet</SelectItem>
          </SelectContent>
        </Select>
        <Select value={deviceFilter} onValueChange={setDeviceFilter}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Enhet" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle enheter</SelectItem>
            {devices.map(d => <SelectItem key={d.id} value={d.id}>{d.device_name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Input type="date" className="w-36" value={dateFrom} onChange={e => setDateFrom(e.target.value)} placeholder="Fra dato" />
        <Input type="date" className="w-36" value={dateTo} onChange={e => setDateTo(e.target.value)} placeholder="Til dato" />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Telefon</TableHead>
            <TableHead>Melding</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Enhet</TableHead>
            <TableHead>Tidspunkt</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {messages.length === 0 ? (
            <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Ingen meldinger</TableCell></TableRow>
          ) : messages.map(m => (
            <TableRow key={m.id}>
              <TableCell className="font-mono text-xs">{m.phone}</TableCell>
              <TableCell className="max-w-xs truncate text-sm">{m.message}</TableCell>
              <TableCell><Badge className={statusColors[m.status]}>{m.status}</Badge></TableCell>
              <TableCell className="text-xs text-muted-foreground">{m.sms_devices?.device_name || "—"}</TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {new Date(m.created_at).toLocaleString("nb-NO", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SmsHistoryPanel;
