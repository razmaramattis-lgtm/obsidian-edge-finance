import { useEffect, useMemo, useState } from "react";
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
import { Plus, Save, Trash2, Eye, Loader2, FileText, Copy, LibraryBig, Code2, LayoutTemplate } from "lucide-react";
import { toast } from "sonner";
import { TEMPLATE_CATEGORIES, categoryMeta, type CrmTemplate } from "./types";
import BlockEditor from "./BlockEditor";
import {
  DEFAULT_DESIGN, renderBlocks, fillMergeFields, htmlToBlocks, newBlock,
  type EmailBlock, type EmailDesign,
} from "./blocks";
import { TEMPLATE_LIBRARY } from "./templateLibrary";

interface EditorTemplate extends CrmTemplate {
  blocks: EmailBlock[];
  design: EmailDesign;
  preheader: string;
}

const blank = (): EditorTemplate => ({
  id: "", name: "", category: "ny_bedrift", subject: "", body_html: "", reason: "",
  is_default: false, active: true,
  blocks: [newBlock("heading"), newBlock("text"), newBlock("button")],
  design: { ...DEFAULT_DESIGN },
  preheader: "",
});

const toEditor = (t: any): EditorTemplate => ({
  ...(t as CrmTemplate),
  blocks: Array.isArray(t.blocks) && t.blocks.length ? (t.blocks as EmailBlock[]) : htmlToBlocks(t.body_html || ""),
  design: { ...DEFAULT_DESIGN, ...((t.design as EmailDesign) || {}) },
  preheader: t.preheader || "",
});

const TemplatesTab = () => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [editing, setEditing] = useState<EditorTemplate | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [mode, setMode] = useState<"blokker" | "html">("blokker");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [libOpen, setLibOpen] = useState(false);
  const [installing, setInstalling] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("crm_email_templates").select("*").order("category").order("name");
    setTemplates(data || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const existingNames = useMemo(() => new Set(templates.map((t) => t.name)), [templates]);

  const save = async () => {
    if (!editing) return;
    if (!editing.name.trim() || !editing.subject.trim()) return toast.error("Navn og emne må fylles ut");
    setSaving(true);
    const body_html = mode === "html" ? editing.body_html : renderBlocks(editing.blocks, editing.design);
    const payload: any = {
      name: editing.name, category: editing.category, subject: editing.subject,
      body_html, reason: editing.reason, is_default: editing.is_default, active: editing.active,
      blocks: mode === "html" ? null : editing.blocks, design: editing.design, preheader: editing.preheader || null,
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

  const duplicate = async (t: any) => {
    const { id, created_at, updated_at, ...rest } = t;
    const { error } = await supabase.from("crm_email_templates").insert({ ...rest, name: `${t.name} (kopi)`, is_default: false });
    if (error) return toast.error(error.message);
    toast.success("Mal kopiert");
    load();
  };

  const installLibrary = async (only?: string) => {
    setInstalling(true);
    const rows = TEMPLATE_LIBRARY
      .filter((t) => (only ? t.name === only : true))
      .filter((t) => !existingNames.has(t.name))
      .map((t) => ({
        name: t.name, category: t.category, subject: t.subject, reason: t.reason,
        preheader: t.preheader, blocks: t.blocks as any, design: DEFAULT_DESIGN as any,
        body_html: renderBlocks(t.blocks, DEFAULT_DESIGN), is_default: false, active: true,
      }));
    if (!rows.length) { setInstalling(false); return toast.info("Alle malene finnes allerede"); }
    const { error } = await supabase.from("crm_email_templates").insert(rows as any);
    setInstalling(false);
    if (error) return toast.error(error.message);
    toast.success(`${rows.length} mal${rows.length === 1 ? "" : "er"} lagt til`);
    load();
  };

  const showPreview = (t: any) => {
    const e = toEditor(t);
    setPreview(fillMergeFields(e.blocks?.length ? renderBlocks(e.blocks, e.design) : t.body_html));
  };

  const livePreview = editing
    ? fillMergeFields(mode === "html" ? editing.body_html : renderBlocks(editing.blocks, editing.design))
    : "";

  const missingCount = TEMPLATE_LIBRARY.filter((t) => !existingNames.has(t.name)).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <p className="text-sm text-muted-foreground">Maler brukes både til manuell utsending og autopilot.</p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setLibOpen(true)}>
            <LibraryBig size={14} className="mr-2" />Bibliotek{missingCount ? ` (${missingCount} nye)` : ""}
          </Button>
          <Button onClick={() => { setMode("blokker"); setEditing(blank()); }}><Plus size={14} className="mr-2" />Ny mal</Button>
        </div>
      </div>

      {loading ? (
        <Card className="p-8 text-center"><Loader2 className="animate-spin mx-auto" size={18} /></Card>
      ) : templates.length === 0 ? (
        <Card className="p-10 text-center space-y-3">
          <FileText size={28} className="mx-auto text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">Ingen maler enda – start med biblioteket.</p>
          <Button onClick={() => installLibrary()} disabled={installing}>
            {installing ? <Loader2 size={14} className="mr-2 animate-spin" /> : <LibraryBig size={14} className="mr-2" />}
            Legg til {TEMPLATE_LIBRARY.length} ferdige maler
          </Button>
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
                  {t.is_default && <Badge variant="secondary" className="text-[10px]">Standard</Badge>}
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <Button size="sm" variant="outline" onClick={() => { const e = toEditor(t); setMode(e.blocks.length ? "blokker" : "html"); setEditing(e); }}>Rediger</Button>
                <Button size="sm" variant="ghost" onClick={() => showPreview(t)} aria-label="Forhåndsvis"><Eye size={14} /></Button>
                <Button size="sm" variant="ghost" onClick={() => duplicate(t)} aria-label="Dupliser"><Copy size={14} /></Button>
                <Button size="sm" variant="ghost" className="text-destructive ml-auto" onClick={() => remove(t.id)} aria-label="Slett"><Trash2 size={14} /></Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* editor */}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-6xl max-h-[92vh] overflow-hidden flex flex-col">
          <DialogHeader><DialogTitle>{editing?.id ? "Rediger mal" : "Ny mal"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="grid gap-4 lg:grid-cols-[1.15fr_1fr] flex-1 min-h-0 overflow-hidden">
              {/* venstre: innstillinger + editor */}
              <div className="overflow-y-auto pr-1 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div><Label className="text-xs">Navn</Label><Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></div>
                  <div>
                    <Label className="text-xs">Kategori</Label>
                    <Select value={editing.category} onValueChange={(v) => setEditing({ ...editing, category: v })}>
                      <SelectTrigger aria-label="Kategori"><SelectValue /></SelectTrigger>
                      <SelectContent>{TEMPLATE_CATEGORIES.map((c) => <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground">{categoryMeta(editing.category).hint}</p>
                <div><Label className="text-xs">Emne</Label><Input value={editing.subject} onChange={(e) => setEditing({ ...editing, subject: e.target.value })} placeholder="Bruk gjerne {{ firma }} i emnet" /></div>
                <div><Label className="text-xs">Forhåndsvisningstekst (vises i innboksen)</Label><Input value={editing.preheader} onChange={(e) => setEditing({ ...editing, preheader: e.target.value })} /></div>

                <div className="flex items-center gap-1.5">
                  <Button size="sm" variant={mode === "blokker" ? "default" : "outline"} className="h-7 text-[11px]" onClick={() => setMode("blokker")}>
                    <LayoutTemplate size={12} className="mr-1.5" />Byggeklosser
                  </Button>
                  <Button size="sm" variant={mode === "html" ? "default" : "outline"} className="h-7 text-[11px]"
                    onClick={() => setMode("html")}>
                    <Code2 size={12} className="mr-1.5" />HTML
                  </Button>
                  {mode === "html" && (
                    <Button size="sm" variant="ghost" className="h-7 text-[11px]"
                      onClick={() => { setEditing({ ...editing, blocks: htmlToBlocks(editing.body_html) }); setMode("blokker"); }}>
                      Konverter til blokker
                    </Button>
                  )}
                </div>

                {mode === "blokker" ? (
                  <BlockEditor
                    blocks={editing.blocks}
                    design={editing.design}
                    onBlocksChange={(b) => setEditing({ ...editing, blocks: b })}
                    onDesignChange={(d) => setEditing({ ...editing, design: d })}
                  />
                ) : (
                  <Textarea rows={16} className="font-mono text-xs"
                    value={editing.body_html || renderBlocks(editing.blocks, editing.design)}
                    onChange={(e) => setEditing({ ...editing, body_html: e.target.value })} aria-label="HTML" />
                )}

                <div>
                  <Label className="text-xs">Hvorfor mottar de e-posten (vises i bunnteksten)</Label>
                  <Textarea rows={2} value={editing.reason || ""} onChange={(e) => setEditing({ ...editing, reason: e.target.value })}
                    placeholder="Du mottar denne e-posten fordi selskapet ditt er registrert i Enhetsregisteret …" />
                </div>
                <div className="flex items-center gap-6 pb-2">
                  <label className="flex items-center gap-2 text-xs"><Switch checked={editing.active} onCheckedChange={(v) => setEditing({ ...editing, active: v })} />Aktiv</label>
                  <label className="flex items-center gap-2 text-xs"><Switch checked={editing.is_default} onCheckedChange={(v) => setEditing({ ...editing, is_default: v })} />Standard for kategorien</label>
                </div>
              </div>

              {/* høyre: live preview */}
              <div className="overflow-y-auto rounded-xl border border-border bg-muted/30 p-3">
                <p className="text-[11px] text-muted-foreground mb-2">Live forhåndsvisning med eksempeldata</p>
                <div className="rounded-lg bg-white p-5 text-black shadow-sm">
                  <p className="text-[11px] text-neutral-500 mb-3 border-b border-neutral-200 pb-2">
                    <b>{fillMergeFields(editing.subject || "(uten emne)")}</b>
                    {editing.preheader ? <><br />{fillMergeFields(editing.preheader)}</> : null}
                  </p>
                  <div dangerouslySetInnerHTML={{ __html: livePreview }} />
                  <p className="text-[12px] text-neutral-500 mt-6 pt-3 border-t border-neutral-200">
                    Hilsen<br /><b>Avargo Regnskap AS</b><br />tlf. 98 64 23 91 · kontakt@avargo.no
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Avbryt</Button>
            <Button onClick={save} disabled={saving}>{saving ? <Loader2 size={14} className="mr-2 animate-spin" /> : <Save size={14} className="mr-2" />}Lagre</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* bibliotek */}
      <Dialog open={libOpen} onOpenChange={setLibOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Malbibliotek</DialogTitle></DialogHeader>
          <p className="text-xs text-muted-foreground">
            Ferdige maler du kan bygge videre på. Alt kan endres etterpå – tekst, farger, knapper og flettefelt.
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {TEMPLATE_LIBRARY.map((t) => {
              const installed = existingNames.has(t.name);
              return (
                <div key={t.name} className="rounded-xl border border-border p-3 space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-medium">{t.name}</p>
                    <Badge variant="outline" className={`text-[9px] shrink-0 ${categoryMeta(t.category).color}`}>{categoryMeta(t.category).label}</Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground line-clamp-2">{t.subject}</p>
                  <Button size="sm" variant={installed ? "ghost" : "outline"} className="h-7 text-[11px]" disabled={installed || installing}
                    onClick={() => installLibrary(t.name)}>
                    {installed ? "Allerede lagt til" : "Legg til"}
                  </Button>
                </div>
              );
            })}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLibOpen(false)}>Lukk</Button>
            <Button onClick={() => installLibrary()} disabled={installing || missingCount === 0}>
              {installing ? <Loader2 size={14} className="mr-2 animate-spin" /> : <LibraryBig size={14} className="mr-2" />}
              Legg til alle som mangler ({missingCount})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* forhåndsvisning */}
      <Dialog open={!!preview} onOpenChange={(o) => !o && setPreview(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Forhåndsvisning</DialogTitle></DialogHeader>
          <div className="rounded-xl border border-border bg-white p-5 text-black" dangerouslySetInnerHTML={{ __html: preview || "" }} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TemplatesTab;
