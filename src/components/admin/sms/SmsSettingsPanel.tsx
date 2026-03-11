import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Save, Copy, Server, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const GATEWAY_URL = `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/sms-device-api`;

const SmsSettingsPanel = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("sms_settings").select("*").then(({ data }) => {
      const map: Record<string, string> = {};
      data?.forEach(s => { map[s.key] = s.value; });
      setSettings(map);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    for (const [key, value] of Object.entries(settings)) {
      if (key === "gateway_server_url") continue;
      await supabase.from("sms_settings").update({ value, updated_at: new Date().toISOString() }).eq("key", key);
    }
    setSaving(false);
    toast.success("Innstillinger lagret");
  };

  const update = (key: string, value: string) => setSettings(prev => ({ ...prev, [key]: value }));

  const copyUrl = () => {
    navigator.clipboard.writeText(GATEWAY_URL);
    toast.success("Gateway-URL kopiert");
  };

  return (
    <div className="max-w-2xl space-y-6">
      <Card className="border-border/20 bg-emerald-500/5">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Server size={16} className="text-emerald-500" />
            <CardTitle className="text-sm font-medium">Innebygd Gateway-server</CardTitle>
            <Badge variant="secondary" className="text-emerald-600 gap-1 text-[10px]">
              <CheckCircle size={10} /> Aktiv
            </Badge>
          </div>
          <CardDescription className="text-xs">
            Plattformen har en innebygd SMS gateway-server. Android-enhetene kobler seg direkte til denne – ingen ekstern server nødvendig.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Gateway-URL (bruk denne i Android-appen)</Label>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs bg-muted px-3 py-2 rounded-md font-mono break-all select-all min-w-0">
                {GATEWAY_URL}
              </code>
              <Button size="icon" variant="outline" className="shrink-0" onClick={copyUrl}>
                <Copy size={14} />
              </Button>
            </div>
          </div>

          <div className="rounded-md bg-muted/50 p-3 space-y-2">
            <p className="text-xs font-medium">API-endepunkter for Android-app:</p>
            <div className="grid gap-1.5 text-[11px] font-mono text-muted-foreground">
              <div className="flex items-start gap-2">
                <Badge variant="outline" className="text-[10px] shrink-0">GET</Badge>
                <span className="break-all">/pending — Hent ventende meldinger</span>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="outline" className="text-[10px] shrink-0">POST</Badge>
                <span className="break-all">/sent — Rapporter sendt/feilet</span>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="outline" className="text-[10px] shrink-0">POST</Badge>
                <span className="break-all">/heartbeat — Enhetsstatus</span>
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2 break-all">
              Autentiser med headeren <code className="bg-background px-1 py-0.5 rounded">x-api-key: DIN_ENHET_API_NØKKEL</code>
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Sendeinnstillinger</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Meldingsforsinkelse (ms)</Label>
            <Input type="number" value={settings.message_delay_ms || "2500"} onChange={e => update("message_delay_ms", e.target.value)} />
            <p className="text-xs text-muted-foreground">Tid mellom hver SMS per enhet (standard 2500ms = 1 SMS per 2.5 sek)</p>
          </div>

          <div className="space-y-2">
            <Label>Maks meldinger per enhet per dag</Label>
            <Input type="number" value={settings.max_messages_per_device || "500"} onChange={e => update("max_messages_per_device", e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Antall forsøk ved feil</Label>
            <Input type="number" value={settings.retry_attempts || "3"} onChange={e => update("retry_attempts", e.target.value)} />
          </div>

          <Button onClick={handleSave} disabled={saving} className="gap-2 w-full sm:w-auto">
            <Save size={14} />
            {saving ? "Lagrer..." : "Lagre innstillinger"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SmsSettingsPanel;
