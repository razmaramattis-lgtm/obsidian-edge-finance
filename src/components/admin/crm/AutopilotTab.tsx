import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Save, Zap, Send } from "lucide-react";
import { toast } from "sonner";
import { CATEGORIES, categoryMeta, type CrmTemplate } from "./types";

interface Settings {
  id: string;
  sync_enabled: boolean;
  autopilot_enabled: boolean;
  daily_email_limit: number;
  send_hour: number;
  municipalities: string[] | null;
  org_forms: string[] | null;
  industry_codes: string[] | null;
  categories: string[] | null;
  template_map: Record<string, string> | null;
  min_days_between_emails: number;
}

const AutopilotTab = () => {
  const [s, setS] = useState<Settings | null>(null);
  const [templates, setTemplates] = useState<CrmTemplate[]>([]);
  const [saving, setSaving] = useState(false);
  const [running, setRunning] = useState(false);

  const load = async () => {
    const [{ data: settings }, { data: tpl }] = await Promise.all([
      supabase.from("crm_automation_settings").select("*").limit(1).maybeSingle(),
      supabase.from("crm_email_templates").select("*").eq("active", true).order("name"),
    ]);
    setS((settings as unknown) as Settings);
    setTemplates((tpl as CrmTemplate[]) || []);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!s) return;
    setSaving(true);
    const { error } = await supabase.from("crm_automation_settings").update({
      sync_enabled: s.sync_enabled,
      autopilot_enabled: s.autopilot_enabled,
      daily_email_limit: s.daily_email_limit,
      send_hour: s.send_hour,
      municipalities: s.municipalities,
      org_forms: s.org_forms,
      categories: s.categories,
      template_map: s.template_map,
      min_days_between_emails: s.min_days_between_emails,
    } as any).eq("id", s.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Innstillinger lagret");
  };

  const runNow = async (fn: "crm-brreg-sync" | "crm-send-email") => {
    setRunning(true);
    try {
      const { data, error } = await supabase.functions.invoke(fn, { body: { mode: "auto" } });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast.success(fn === "crm-brreg-sync"
        ? `Synk ferdig – ${data.inserted} nye selskaper`
        : `Autopilot kjørt – ${data.sent} e-post sendt`);
    } catch (e: any) {
      toast.error(e.message || "Kjøringen feilet");
    } finally {
      setRunning(false);
    }
  };

  if (!s) return <Card className="p-8 text-center"><Loader2 className="animate-spin mx-auto" size={18} /></Card>;

  const toggleList = (key: "categories" | "org_forms", value: string) => {
    const cur = s[key] || [];
    setS({ ...s, [key]: cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value] });
  };

  return (
    <div className="space-y-4">
      <Card className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Daglig innhenting fra Brønnøysund</p>
            <p className="text-xs text-muted-foreground">Henter nye selskaper hver natt og oppdaterer eksisterende leads.</p>
          </div>
          <Switch checked={s.sync_enabled} onCheckedChange={(v) => setS({ ...s, sync_enabled: v })} />
        </div>
        <div className="flex items-center justify-between border-t border-border/50 pt-4">
          <div>
            <p className="text-sm font-medium flex items-center gap-2"><Zap size={14} className="text-primary" />Autopilot for e-post</p>
            <p className="text-xs text-muted-foreground">Sender automatisk riktig mal til nye leads basert på kategori.</p>
          </div>
          <Switch checked={s.autopilot_enabled} onCheckedChange={(v) => setS({ ...s, autopilot_enabled: v })} />
        </div>
      </Card>

      <Card className="p-5 space-y-4">
        <p className="text-sm font-medium">Regler</p>
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <Label className="text-xs">Maks e-post per dag</Label>
            <Input type="number" min={1} max={500} value={s.daily_email_limit} onChange={(e) => setS({ ...s, daily_email_limit: Number(e.target.value) })} />
          </div>
          <div>
            <Label className="text-xs">Sendetidspunkt (time)</Label>
            <Input type="number" min={0} max={23} value={s.send_hour} onChange={(e) => setS({ ...s, send_hour: Number(e.target.value) })} />
          </div>
          <div>
            <Label className="text-xs">Min. dager mellom e-post</Label>
            <Input type="number" min={0} value={s.min_days_between_emails} onChange={(e) => setS({ ...s, min_days_between_emails: Number(e.target.value) })} />
          </div>
        </div>

        <div>
          <Label className="text-xs">Kategorier som skal med i autopilot</Label>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {CATEGORIES.filter((c) => c.id !== "ukjent").map((c) => (
              <button key={c.id} type="button" onClick={() => toggleList("categories", c.id)}
                className={`px-2.5 py-1 rounded-full text-[11px] border transition-colors ${(s.categories || []).includes(c.id) ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-xs">Kommunenummer (tomt = hele landet)</Label>
          <Input className="mt-1.5" value={(s.municipalities || []).join(",")}
            onChange={(e) => setS({ ...s, municipalities: e.target.value.split(",").map((v) => v.trim()).filter(Boolean) })}
            placeholder="3401,3415,3228" />
        </div>

        <div>
          <Label className="text-xs">Organisasjonsformer</Label>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {["AS", "ENK", "ANS", "DA", "NUF", "SA"].map((f) => (
              <button key={f} type="button" onClick={() => toggleList("org_forms", f)}
                className={`px-2.5 py-1 rounded-full text-[11px] border transition-colors ${(s.org_forms || []).includes(f) ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>
                {f}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Card className="p-5 space-y-3">
        <p className="text-sm font-medium">Mal per kategori</p>
        {CATEGORIES.filter((c) => c.id !== "ukjent").map((c) => (
          <div key={c.id} className="flex items-center gap-3">
            <Badge variant="outline" className={`text-[10px] w-[190px] justify-center ${c.color}`}>{c.label}</Badge>
            <Select value={(s.template_map || {})[c.id] || ""} onValueChange={(v) => setS({ ...s, template_map: { ...(s.template_map || {}), [c.id]: v } })}>
              <SelectTrigger className="flex-1" aria-label={`Mal for ${c.label}`}><SelectValue placeholder="Velg mal" /></SelectTrigger>
              <SelectContent>
                {templates.filter((t) => t.category === c.id || t.category === "alle").map((t) => (
                  <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
        <p className="text-[11px] text-muted-foreground">{CATEGORIES.map((c) => c.hint).slice(0, 3).join(" · ")}</p>
      </Card>

      <div className="flex flex-wrap gap-2">
        <Button onClick={save} disabled={saving}>{saving ? <Loader2 size={14} className="mr-2 animate-spin" /> : <Save size={14} className="mr-2" />}Lagre</Button>
        <Button variant="outline" onClick={() => runNow("crm-brreg-sync")} disabled={running}><Zap size={14} className="mr-2" />Kjør synk nå</Button>
        <Button variant="outline" onClick={() => runNow("crm-send-email")} disabled={running}><Send size={14} className="mr-2" />Kjør autopilot nå</Button>
      </div>
    </div>
  );
};

export default AutopilotTab;
