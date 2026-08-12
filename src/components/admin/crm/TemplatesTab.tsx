import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Save, Trash2, Eye, Loader2, FileText } from "lucide-react";
import { toast } from "sonner";
import { CATEGORIES, categoryMeta, type CrmTemplate } from "./types";

const VARIABLES = ["firma", "navn", "orgnr", "kommune", "bransje", "regnskapsforer", "registrert"];

const blank = (): CrmTemplate => ({
  id: "", name: "", category: "ny_bedrift", subject: "", body_html: "", reason: "", is_default: false, active: true,
});

const TemplatesTab = () => {
  const [templates, setTemplates] = useState<CrmTemplate[]>([]);
  const [editing, setEditing] = useState<CrmTemplate | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await supabase.from("crm_email_templates").select("*").order("category").order("name");
    setTemplates((data as CrmTemplate[]) || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    if (!editing.name.trim() || !editing.subject.trim()) return toast.error("Navn og emne må fylles ut");
    setSaving(true);
    const payload = {
      name: editing.name, category: editing.category, subject: editing.subject,
      body_html: editing.body_html, reason: editing.reason, is_default: editing.is_default, active: editing.active,
    };
    const { error } = editing.id
      ? await supabase.from("crm_email_templates").update(payload).eq("id", editing.id)
      : await supabase.from("crm_email_templates").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Mal lagret");
    setEditing(null);
    load();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("crm_email_templates").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Mal slettet");
    load();
  };

  const renderPreview = (t: CrmTemplate) => {
    const sample: Record<string, string> = {
      firma: "Eksempel AS", navn: "Ola Nordmann", orgnr: "999888777", kommune: "Kongsvinger",
      bransje: "Bygg og anlegg", regnskapsforer: "Regnskap Nord AS", registrert: "01.01.2026",
    };
    let html = t.body_html;
    Object.entries(sample).forEach(([k, v]) => { html = html.replace(new RegExp(`{{\\s*${k}\\s*}}`, "g"), v); });
    setPreview(html);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Maler brukes både til manuell utsending og autopilot.</p>
        <Button onClick={() => setEditing(blank())}><Plus size={14} className="mr-2" />Ny mal</Button>
      </div>

      {loading ? (
        <Card className="p-8 text-center"><Loader2 className="animate-spin mx-auto" size={18} /></Card>
      ) : templates.length === 0 ? (
        <Card className="p-10 text-center">
          <FileText size={28} className="mx-auto mb-3 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">Ingen maler enda.</p>
        </Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {templates.map((t) => (
            <Card key={t.id} className="p-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{t.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{t.subject}</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <Badge variant="outline" className={`text-[10px] ${categoryMeta(t.category).color}`}>{categoryMeta(t.category).label}</Badge>
                  {!t.active && <Badge variant="secondary" className="text-[10px]">Inaktiv</Badge>}
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <Button size="sm" variant="outline" onClick={() => setEditing(t)}>Rediger</Button>
                <Button size="sm" variant="ghost" onClick={() => renderPreview(t)}><Eye size={14} /></Button>
                <Button size="sm" variant="ghost" className="text-destructive ml-auto" onClick={() => remove(t.id)}><Trash2 size={14} /></Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing?.id ? "Rediger mal" : "Ny mal"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-xs">Navn</Label><Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></div>
                <div>
                  <Label className="text-xs">Kategori</Label>
                  <Select value={editing.category} onValueChange={(v) => setEditing({ ...editing, category: v })}>
                    <SelectTrigger aria-label="Kategori"><SelectValue /></SelectTrigger>
                    <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground">{categoryMeta(editing.category).hint}</p>
              <div><Label className="text-xs">Emne</Label><Input value={editing.subject} onChange={(e) => setEditing({ ...editing, subject: e.target.value })} /></div>
              <div>
                <Label className="text-xs">Innhold (HTML)</Label>
                <Textarea rows={12} className="font-mono text-xs" value={editing.body_html} onChange={(e) => setEditing({ ...editing, body_html: e.target.value })} />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {VARIABLES.map((v) => (
                    <button key={v} type="button" className="px-2 py-0.5 rounded-full border border-border text-[10px] text-muted-foreground hover:border-primary/40"
                      onClick={() => setEditing({ ...editing, body_html: editing.body_html + `{{ ${v} }}` })}>{`{{ ${v} }}`}</button>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-xs">Hvorfor mottar de e-posten (vises i bunnteksten)</Label>
                <Textarea rows={2} value={editing.reason || ""} onChange={(e) => setEditing({ ...editing, reason: e.target.value })}
                  placeholder="Du mottar denne e-posten fordi selskapet ditt er registrert i Enhetsregisteret …" />
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-xs"><Switch checked={editing.active} onCheckedChange={(v) => setEditing({ ...editing, active: v })} />Aktiv</label>
                <label className="flex items-center gap-2 text-xs"><Switch checked={editing.is_default} onCheckedChange={(v) => setEditing({ ...editing, is_default: v })} />Standard for kategorien</label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Avbryt</Button>
            <Button onClick={save} disabled={saving}>{saving ? <Loader2 size={14} className="mr-2 animate-spin" /> : <Save size={14} className="mr-2" />}Lagre</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!preview} onOpenChange={(o) => !o && setPreview(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Forhåndsvisning</DialogTitle></DialogHeader>
          <div className="rounded-xl border border-border bg-white p-4 text-black" dangerouslySetInnerHTML={{ __html: preview || "" }} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TemplatesTab;
