import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    const params = new URLSearchParams({ key: device.api_key, url: GATEWAY_URL, name: device.device_name });
    return `${APP_URL}/gateway?${params.toString()}`;
  };

  const copySetupLink = (device: any) => {
    navigator.clipboard.writeText(getSetupUrl(device));
    toast.success("Oppsettslenke kopiert – åpne denne på telefonen");
  };

  const getQrUrl = (device: any) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(getSetupUrl(device))}`;
  };

  return (
    <div className="space-y-4">
      <Card className="border-border/20 bg-muted/30">
        <CardContent className="p-3 flex items-start gap-3">
          <Server size={16} className="text-primary mt-0.5 shrink-0" />
          <div className="text-xs space-y-1 min-w-0">
            <p className="font-medium">Innebygd gateway-server aktiv</p>
            <p className="text-muted-foreground break-all">Android-enheter kobler til: <code className="bg-background px-1 py-0.5 rounded text-[10px] break-all">{GATEWAY_URL}</code></p>
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

      {/* Mobile: card layout, Desktop: keep cards too for consistency */}
      {devices.length === 0 ? (
        <Card className="border-border/20">
          <CardContent className="py-8 text-center text-muted-foreground text-sm">Ingen enheter</CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {devices.map(d => (
            <Card key={d.id} className="border-border/20">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Smartphone size={16} className="text-muted-foreground shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{d.device_name}</p>
                      <p className="text-xs text-muted-foreground font-mono">{d.phone_number}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className={`gap-1 shrink-0 ${d.status === "online" ? "text-emerald-600" : "text-muted-foreground"}`}>
                    {d.status === "online" ? <Wifi size={10} /> : <WifiOff size={10} />}
                    {d.status}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Sendt i dag: <strong className="text-foreground">{d.messages_sent_today}</strong></span>
                  <span>Sist sett: {d.last_seen ? timeAgo(d.last_seen) : "Aldri"}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <code className="text-[10px] bg-muted px-1.5 py-0.5 rounded flex-1 min-w-0 truncate">{d.api_key}</code>
                  <Button size="icon" variant="ghost" className="h-7 w-7 shrink-0" onClick={() => copyKey(d.api_key)}><Copy size={12} /></Button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1 border-t border-border/20">
                  <Button size="sm" variant="outline" className="gap-1.5 h-8 text-xs" onClick={() => setQrDevice(d)}>
                    <QrCode size={12} /> QR-oppsett
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1.5 h-8 text-xs" onClick={() => copySetupLink(d)}>
                    <ExternalLink size={12} /> Kopier lenke
                  </Button>
                  <Button size="sm" variant="ghost" className="gap-1.5 h-8 text-xs" onClick={() => handleRegenKey(d.id)}>
                    <RefreshCw size={12} /> Ny nøkkel
                  </Button>
                  <Button size="sm" variant="ghost" className="gap-1.5 h-8 text-xs text-destructive" onClick={() => handleDelete(d.id)}>
                    <Trash2 size={12} /> Slett
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* QR Code Dialog */}
      <Dialog open={!!qrDevice} onOpenChange={(o) => !o && setQrDevice(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-sm">Koble {qrDevice?.device_name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-center">
            <p className="text-xs text-muted-foreground">Skann QR-koden med telefonen for å sette opp gateway-appen automatisk.</p>
            {qrDevice && (
              <img src={getQrUrl(qrDevice)} alt="QR-kode for oppsett" className="w-48 h-48 mx-auto rounded-lg border border-border/20" />
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
