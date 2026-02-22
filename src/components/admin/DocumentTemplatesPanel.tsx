import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2, Edit2, Eye, FileText, Save } from "lucide-react";
import RichTextEditor from "./RichTextEditor";

const inputCls = "w-full h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40";

const DocumentTemplatesPanel = () => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", description: "", category: "Generelt", content: "", active: true, sort_order: 0 });
  const [saving, setSaving] = useState(false);
  const [previewId, setPreviewId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data } = await supabase.from("document_templates").select("*").order("sort_order").order("created_at");
    setTemplates(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) { toast.error("Tittel og innhold er påkrevd"); return; }
    setSaving(true);

    // Extract merge fields from content
    const fieldMatches = form.content.match(/\{\{([^}]+)\}\}/g) || [];
    const mergeFields = [...new Set(fieldMatches.map(m => m.replace(/\{\{|\}\}/g, "").trim()))];

    const payload = {
      title: form.title.trim(),
      description: form.description || null,
      category: form.category || "Generelt",
      content: form.content,
      merge_fields: mergeFields,
      active: form.active,
      sort_order: form.sort_order,
    };

    if (editId) {
      await supabase.from("document_templates").update(payload as any).eq("id", editId);
    } else {
      await supabase.from("document_templates").insert(payload as any);
    }
    toast.success(editId ? "Mal oppdatert" : "Mal opprettet");
    setShowForm(false);
    setEditId(null);
    setForm({ title: "", description: "", category: "Generelt", content: "", active: true, sort_order: 0 });
    load();
    setSaving(false);
  };

  const startEdit = (tpl: any) => {
    document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' });
    setEditId(tpl.id);
    setForm({
      title: tpl.title,
      description: tpl.description || "",
      category: tpl.category || "Generelt",
      content: tpl.content || "",
      active: tpl.active !== false,
      sort_order: tpl.sort_order || 0,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Slett denne malen?")) return;
    await supabase.from("document_templates").delete().eq("id", id);
    toast.success("Mal slettet");
    load();
  };

  if (loading) return <div className="text-muted-foreground text-sm">Laster…</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{templates.length} dokumentmaler</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Bruk {"{{flettefelt}}"} i innholdet. F.eks. {"{{Bedriftsnavn}}"}, {"{{Org.nr}}"}, {"{{Dato}}"}, {"{{Eier}}"}, {"{{Styreleder}}"}.</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditId(null); setForm({ title: "", description: "", category: "Generelt", content: "", active: true, sort_order: 0 }); }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm hover:opacity-90">
          <Plus size={14} /> Ny mal
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSave} className="glass rounded-2xl p-5 border border-border/20 space-y-4">
          <h3 className="font-medium text-sm">{editId ? "Rediger mal" : "Opprett ny dokumentmal"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div><label className="text-xs text-muted-foreground mb-1 block">Tittel *</label><input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required className={inputCls} placeholder="F.eks. Styreprotokoll" /></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Kategori</label><input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className={inputCls} placeholder="Generelt" /></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Sortering</label><input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: Number(e.target.value) }))} className={inputCls} /></div>
          </div>
          <div><label className="text-xs text-muted-foreground mb-1 block">Beskrivelse</label>
            <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className={inputCls} placeholder="Kort beskrivelse av malen" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Innhold (bruk {"{{Flettefelt}}"} for automatisk utfylling)</label>
            <RichTextEditor content={form.content} onChange={html => setForm(f => ({ ...f, content: html }))} placeholder="Skriv malinnholdet her. Bruk {{Bedriftsnavn}}, {{Dato}} osv." />
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} className="rounded" /> Aktiv
            </label>
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm hover:opacity-90 disabled:opacity-50">
              <Save size={14} /> {saving ? "Lagrer…" : editId ? "Oppdater" : "Opprett mal"}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setEditId(null); }} className="px-4 py-2 rounded-xl text-sm border border-border/30 hover:bg-muted/50">Avbryt</button>
          </div>
        </form>
      )}

      {/* Preview */}
      {previewId && (() => {
        const tpl = templates.find(t => t.id === previewId);
        if (!tpl) return null;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" onClick={() => setPreviewId(null)}>
            <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white border border-border/30 rounded-2xl p-8 shadow-xl mx-4" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading text-lg text-black">{tpl.title}</h2>
                <button onClick={() => setPreviewId(null)} className="text-gray-500 hover:text-black text-sm">✕</button>
              </div>
              <div style={{ fontFamily: "'Georgia',serif", fontSize: "13px", lineHeight: "1.7", color: "#1a1a1a" }}
                dangerouslySetInnerHTML={{ __html: tpl.content }} />
            </div>
          </div>
        );
      })()}

      <div className="space-y-2">
        {templates.map(tpl => (
          <div key={tpl.id} className="glass rounded-2xl px-5 py-4 border border-border/20 flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <FileText size={16} className="text-primary" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium truncate">{tpl.title}</p>
                  {!tpl.active && <span className="text-[10px] px-2 py-0.5 rounded-md bg-muted/50 text-muted-foreground">Inaktiv</span>}
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-primary/10 text-primary">{tpl.category}</span>
                </div>
                {tpl.description && <p className="text-xs text-muted-foreground mt-0.5 truncate">{tpl.description}</p>}
                {tpl.merge_fields && (tpl.merge_fields as string[]).length > 0 && (
                  <p className="text-[10px] text-muted-foreground mt-1">Flettefelt: {(tpl.merge_fields as string[]).join(", ")}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button onClick={() => setPreviewId(tpl.id)} className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5" title="Forhåndsvis"><Eye size={15} /></button>
              <button onClick={() => startEdit(tpl)} className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5" title="Rediger"><Edit2 size={15} /></button>
              <button onClick={() => handleDelete(tpl.id)} className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/5" title="Slett"><Trash2 size={15} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentTemplatesPanel;
