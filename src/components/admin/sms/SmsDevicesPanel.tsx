import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Trash2, RefreshCw, Smartphone, Wifi, WifiOff, Copy, Server, QrCode, ExternalLink } from "lucide-react";
import { timeAgo } from "@/components/workspace/helpers";

const GATEWAY_URL = `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/sms-device-api`;
const APP_URL = typeof window !== "undefined" ? window.location.origin : "";

const SmsDevicesPanel = () => {
  const [devices, setDevices] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [qrDevice, setQrDevice] = useState<any>(null);
  const [form, setForm] = useState({ device_name: "", phone_number: "" });

  useEffect(() => { fetchDevices(); }, []);

  const fetchDevices = async () => {
    const { data } = await supabase.from("sms_devices").select("*").order("created_at", { ascending: false });
    setDevices(data || []);
  };

  const handleAdd = async () => {
    if (!form.device_name.trim() || !form.phone_number.trim()) { toast.error("Alle felt er påkrevd"); return; }
    const { error } = await supabase.from("sms_devices").insert({
      device_name: form.device_name.trim(),
      phone_number: form.phone_number.trim(),
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Enhet lagt til");
    setForm({ device_name: "", phone_number: "" });
    setOpen(false);
    fetchDevices();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("sms_devices").delete().eq("id", id);
    fetchDevices();
    toast.success("Enhet slettet");
  };

  const handleRegenKey = async (id: string) => {
    // Generate new key
    const newKey = Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, "0")).join("");
    await supabase.from("sms_devices").update({ api_key: newKey }).eq("id", id);
    fetchDevices();
    toast.success("API-nøkkel regenerert");
  };

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success("API-nøkkel kopiert");
  };

  const getSetupUrl = (device: any) => {
    const params = new URLSearchParams({
      key: device.api_key,
      url: GATEWAY_URL,
      name: device.device_name,
    });
    return `${APP_URL}/gateway?${params.toString()}`;
  };

  const copySetupLink = (device: any) => {
    navigator.clipboard.writeText(getSetupUrl(device));
    toast.success("Oppsettslenke kopiert – åpne denne på telefonen");
  };

  const getQrUrl = (device: any) => {
    const setupUrl = getSetupUrl(device);
    return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(setupUrl)}`;
  };

  return (
    <div className="space-y-4">
      <Card className="border-border/20 bg-muted/30">
        <CardContent className="p-3 flex items-start gap-3">
          <Server size={16} className="text-primary mt-0.5 shrink-0" />
          <div className="text-xs space-y-1">
            <p className="font-medium">Innebygd gateway-server aktiv</p>
            <p className="text-muted-foreground">Android-enheter kobler til: <code className="bg-background px-1 py-0.5 rounded text-[10px] break-all">{GATEWAY_URL}</code></p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Gateway-enheter</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5"><Plus size={14} /> Ny enhet</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Legg til SMS-gateway</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Enhetsnavn</Label><Input placeholder="Samsung Galaxy S21" value={form.device_name} onChange={e => setForm(f => ({ ...f, device_name: e.target.value }))} /></div>
              <div><Label>Telefonnummer</Label><Input placeholder="+47..." value={form.phone_number} onChange={e => setForm(f => ({ ...f, phone_number: e.target.value }))} /></div>
              <Button onClick={handleAdd} className="w-full">Legg til enhet</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Enhet</TableHead>
            <TableHead>Nummer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Sendt i dag</TableHead>
            <TableHead>Sist sett</TableHead>
            <TableHead>API-nøkkel</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {devices.length === 0 ? (
            <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">Ingen enheter</TableCell></TableRow>
          ) : devices.map(d => (
            <TableRow key={d.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Smartphone size={14} className="text-muted-foreground" />
                  <span className="font-medium">{d.device_name}</span>
                </div>
              </TableCell>
              <TableCell className="font-mono text-xs">{d.phone_number}</TableCell>
              <TableCell>
                <Badge variant="secondary" className={`gap-1 ${d.status === "online" ? "text-emerald-600" : "text-muted-foreground"}`}>
                  {d.status === "online" ? <Wifi size={10} /> : <WifiOff size={10} />}
                  {d.status}
                </Badge>
              </TableCell>
              <TableCell>{d.messages_sent_today}</TableCell>
              <TableCell className="text-xs text-muted-foreground">{d.last_seen ? timeAgo(d.last_seen) : "Aldri"}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <code className="text-[10px] bg-muted px-1.5 py-0.5 rounded max-w-[100px] truncate">{d.api_key}</code>
                  <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => copyKey(d.api_key)}><Copy size={10} /></Button>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => setQrDevice(d)} title="QR-kode oppsett"><QrCode size={14} /></Button>
                  <Button size="icon" variant="ghost" onClick={() => copySetupLink(d)} title="Kopier oppsettslenke"><ExternalLink size={14} /></Button>
                  <Button size="icon" variant="ghost" onClick={() => handleRegenKey(d.id)} title="Regenerer nøkkel"><RefreshCw size={14} /></Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(d.id)} className="text-destructive"><Trash2 size={14} /></Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* QR Code Dialog */}
      <Dialog open={!!qrDevice} onOpenChange={(o) => !o && setQrDevice(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-sm">Koble {qrDevice?.device_name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-center">
            <p className="text-xs text-muted-foreground">Skann QR-koden med telefonen for å sette opp gateway-appen automatisk.</p>
            {qrDevice && (
              <img
                src={getQrUrl(qrDevice)}
                alt="QR-kode for oppsett"
                className="w-48 h-48 mx-auto rounded-lg border border-border/20"
              />
            )}
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full gap-1.5" onClick={() => qrDevice && copySetupLink(qrDevice)}>
                <Copy size={12} /> Kopier oppsettslenke
              </Button>
              <p className="text-[10px] text-muted-foreground">Eller send lenken direkte til telefonen via SMS/chat</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SmsDevicesPanel;
