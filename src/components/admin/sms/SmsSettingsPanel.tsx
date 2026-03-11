import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Save } from "lucide-react";

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
      await supabase.from("sms_settings").update({ value, updated_at: new Date().toISOString() }).eq("key", key);
    }
    setSaving(false);
    toast.success("Innstillinger lagret");
  };

  const update = (key: string, value: string) => setSettings(prev => ({ ...prev, [key]: value }));

  return (
    <div className="max-w-lg space-y-6">
      <Card className="border-border/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">SMS Gateway-innstillinger</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Gateway Server URL</Label>
            <Input value={settings.gateway_server_url || ""} onChange={e => update("gateway_server_url", e.target.value)} placeholder="https://..." />
            <p className="text-xs text-muted-foreground">URL til SMS-gateway-tjeneren (brukes av Android-apper)</p>
          </div>

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

          <Button onClick={handleSave} disabled={saving} className="gap-2">
            <Save size={14} />
            {saving ? "Lagrer..." : "Lagre innstillinger"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SmsSettingsPanel;
