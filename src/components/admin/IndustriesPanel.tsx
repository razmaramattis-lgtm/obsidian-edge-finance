import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Edit2, Eye, ArrowLeft, CheckCircle2, ChevronRight, Phone, ArrowRight } from "lucide-react";

interface Industry {
  id: string;
  title: string;
  description: string | null;
  href: string | null;
  active: boolean;
  tagline: string | null;
  intro: string | null;
  body: string | null;
  deliverables: string[] | null;
  challenges: any[] | null;
  why_avargo: any[] | null;
  related_slugs: any[] | null;
  cta_headline: string | null;
  icon: string | null;
  meta_title: string | null;
  meta_description: string | null;
  sort_order: number | null;
}

const emptyForm = {
  title: "", description: "", href: "", active: true, tagline: "", intro: "", body: "",
  deliverables: "", challenges: "[]", why_avargo: "[]", related_slugs: "[]",
  cta_headline: "", icon: "", meta_title: "", meta_description: "", sort_order: 0,
};

const inputCls = "w-full h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40";
const textareaCls = "w-full rounded-xl border border-border/30 bg-muted/30 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none";

/** Mini preview renderer — mirrors BransjePage layout */
const IndustryPreview = ({ item }: { item: Industry }) => {
  const deliverables = item.deliverables || [];
  const challenges = (item.challenges as any[]) || [];
  const whyAvargo = (item.why_avargo as any[]) || [];
  const relatedSlugs = (item.related_slugs as any[]) || [];

  return (
    <div className="bg-background rounded-2xl border border-border/30 overflow-hidden max-h-[70vh] overflow-y-auto text-foreground">
      {/* Hero */}
      <div className="py-16 px-8 relative">
        <div className="absolute inset-0 ambient-glow opacity-20" />
        <div className="relative max-w-3xl">
          <p className="text-[9px] tracking-[0.4em] uppercase text-primary mb-3">{item.title}</p>
          <h1 className="font-heading text-3xl md:text-5xl leading-tight mb-4">
            {(item.tagline || "").split(" ").slice(0, Math.ceil((item.tagline || "").split(" ").length / 2)).join(" ")}{" "}
            <span className="italic text-gradient-rose">
              {(item.tagline || "").split(" ").slice(Math.ceil((item.tagline || "").split(" ").length / 2)).join(" ")}
            </span>
          </h1>
          <p className="text-sm text-muted-foreground font-light leading-relaxed max-w-xl mb-6">{item.intro}</p>
          <div className="flex gap-3">
            <span className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground text-xs font-medium rounded-full">
              Snakk med en ekspert <ArrowRight size={12} />
            </span>
            <span className="inline-flex items-center gap-2 px-6 py-2.5 text-xs text-foreground/50 rounded-full border border-border/20">Se priser</span>
          </div>
        </div>
      </div>

      {/* Body + Deliverables */}
      {(item.body || deliverables.length > 0) && (
        <div className="px-8 py-10 border-t border-border/10">
          <div className="grid grid-cols-2 gap-8">
            {item.body && (
              <div>
                <p className="text-[9px] tracking-[0.4em] uppercase text-primary mb-3">Hverdagen din</p>
                <h2 className="font-heading text-xl mb-3">Vi forstår <span className="italic text-gradient-rose">din bransje.</span></h2>
                <p className="text-xs text-muted-foreground font-light leading-relaxed">{item.body}</p>
              </div>
            )}
            {deliverables.length > 0 && (
              <div>
                <p className="text-[9px] tracking-[0.4em] uppercase text-primary mb-3">Hva vi dekker for deg</p>
                <ul className="flex flex-col gap-2">
                  {deliverables.map((d, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-foreground/70">
                      <CheckCircle2 size={11} className="text-primary mt-0.5 shrink-0" strokeWidth={1.5} />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Challenges */}
      {challenges.length > 0 && (
        <div className="px-8 py-10 border-t border-border/10">
          <p className="text-[9px] tracking-[0.4em] uppercase text-muted-foreground/60 mb-4">Utfordringene vi løser</p>
          <div className="grid grid-cols-2 gap-3">
            {challenges.map((c: any, i: number) => (
              <div key={i} className="p-4 glass rounded-xl">
                <h3 className="font-heading text-sm mb-1">{c.title}</h3>
                <p className="text-[10px] text-muted-foreground font-light leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Why Avargo */}
      {whyAvargo.length > 0 && (
        <div className="px-8 py-10 border-t border-border/10">
          <p className="text-[9px] tracking-[0.4em] uppercase text-muted-foreground/60 mb-4">Hvorfor Avargo</p>
          <div className="grid grid-cols-3 gap-3">
            {whyAvargo.map((w: any, i: number) => (
              <div key={i} className="p-4 glass rounded-xl">
                <span className="font-heading text-2xl text-primary/10">{w.num}</span>
                <h3 className="font-heading text-sm mt-2 mb-1">{w.title}</h3>
                <p className="text-[10px] text-muted-foreground font-light leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related */}
      {relatedSlugs.length > 0 && (
        <div className="px-8 py-6 border-t border-border/10">
          <p className="text-[9px] tracking-[0.4em] uppercase text-muted-foreground/60 mb-3">Relaterte bransjer</p>
          <div className="flex flex-wrap gap-2">
            {relatedSlugs.map((s: any, i: number) => (
              <span key={i} className="inline-flex items-center gap-1 px-3 py-1.5 text-[10px] text-muted-foreground border border-border/20 rounded-full">
                {s.label} <ChevronRight size={9} className="text-primary/40" />
              </span>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="px-8 py-10 border-t border-border/10 text-center">
        <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
          <Phone size={14} className="text-primary" strokeWidth={1.5} />
        </div>
        <h2 className="font-heading text-xl mb-2">{item.cta_headline || "La oss snakke."}</h2>
        <p className="text-xs text-muted-foreground mb-4">En samtale er nok. Vi setter deg i kontakt med en ekspert som kjenner din bransje.</p>
        <span className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground text-xs font-medium rounded-full">
          Book en gjennomgang <ArrowRight size={12} />
        </span>
      </div>
    </div>
  );
};

const IndustriesPanel = () => {
  const [items, setItems] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Industry | null>(null);
  const [previewItem, setPreviewItem] = useState<Industry | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [formTab, setFormTab] = useState<"edit" | "preview">("edit");

  const fetchData = async () => {
    const { data } = await supabase.from("industries").select("*").order("sort_order");
    setItems((data as Industry[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const openNew = () => {
    setShowForm(true); setEditing(null); setForm(emptyForm); setFormTab("edit");
  };

  const openEdit = (item: Industry) => {
    document.querySelector("main")?.scrollTo({ top: 0, behavior: "smooth" });
    setEditing(item);
    setForm({
      title: item.title, description: item.description || "", href: item.href || "",
      active: item.active, tagline: item.tagline || "", intro: item.intro || "",
      body: item.body || "", deliverables: (item.deliverables || []).join("\n"),
      challenges: JSON.stringify(item.challenges || [], null, 2),
      why_avargo: JSON.stringify(item.why_avargo || [], null, 2),
      related_slugs: JSON.stringify(item.related_slugs || [], null, 2),
      cta_headline: item.cta_headline || "", icon: item.icon || "",
      meta_title: item.meta_title || "", meta_description: item.meta_description || "",
      sort_order: item.sort_order || 0,
    });
    setShowForm(true); setFormTab("edit");
  };

  const getFormAsIndustry = (): Industry => {
    let challenges: any[] = [], why_avargo: any[] = [], related_slugs: any[] = [];
    try { challenges = JSON.parse(form.challenges); } catch {}
    try { why_avargo = JSON.parse(form.why_avargo); } catch {}
    try { related_slugs = JSON.parse(form.related_slugs); } catch {}
    return {
      id: editing?.id || "", title: form.title, description: form.description, href: form.href,
      active: form.active, tagline: form.tagline, intro: form.intro, body: form.body,
      deliverables: form.deliverables.split("\n").filter(Boolean), challenges, why_avargo,
      related_slugs, cta_headline: form.cta_headline, icon: form.icon,
      meta_title: form.meta_title, meta_description: form.meta_description, sort_order: form.sort_order,
    };
  };

  const save = async () => {
    let challenges: any[] = [], why_avargo: any[] = [], related_slugs: any[] = [];
    try { challenges = JSON.parse(form.challenges); } catch {}
    try { why_avargo = JSON.parse(form.why_avargo); } catch {}
    try { related_slugs = JSON.parse(form.related_slugs); } catch {}

    const payload = {
      title: form.title, description: form.description || null, href: form.href || null,
      active: form.active, tagline: form.tagline || null, intro: form.intro || null,
      body: form.body || null, deliverables: form.deliverables.split("\n").filter(Boolean),
      challenges, why_avargo, related_slugs, cta_headline: form.cta_headline || null,
      icon: form.icon || null, meta_title: form.meta_title || null,
      meta_description: form.meta_description || null, sort_order: Number(form.sort_order),
    };

    if (editing) {
      await supabase.from("industries").update(payload as any).eq("id", editing.id);
    } else {
      await supabase.from("industries").insert([payload] as any);
    }
    setShowForm(false); setEditing(null); setForm(emptyForm);
    fetchData();
  };

  const del = async (id: string) => {
    if (!confirm("Slett bransje?")) return;
    await supabase.from("industries").delete().eq("id", id);
    fetchData();
  };

  if (loading) return <div className="text-muted-foreground text-sm">Laster…</div>;

  // Full-screen preview
  if (previewItem) {
    return (
      <div className="space-y-4">
        <button onClick={() => setPreviewItem(null)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft size={14} /> Tilbake til oversikt
        </button>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-sm">{previewItem.title} — Forhåndsvisning</h3>
          <button onClick={() => { openEdit(previewItem); setPreviewItem(null); }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded-lg hover:opacity-90">
            <Edit2 size={11} /> Rediger
          </button>
        </div>
        <IndustryPreview item={previewItem} />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">{items.length} bransjer · Klikk for forhåndsvisning</p>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm glow-rose hover:opacity-90">
          <Plus size={14} /> Ny bransje
        </button>
      </div>

      {/* Edit/Create form */}
      {showForm && (
        <div className="glass rounded-2xl border border-border/20 overflow-hidden">
          <div className="flex border-b border-border/20">
            <button onClick={() => setFormTab("edit")} className={`flex-1 px-4 py-2.5 text-xs font-medium transition-all ${formTab === "edit" ? "bg-background text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              <Edit2 size={11} className="inline mr-1.5" /> Rediger
            </button>
            <button onClick={() => setFormTab("preview")} className={`flex-1 px-4 py-2.5 text-xs font-medium transition-all ${formTab === "preview" ? "bg-background text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              <Eye size={11} className="inline mr-1.5" /> Forhåndsvisning
            </button>
          </div>

          {formTab === "preview" ? (
            <div className="p-4">
              <IndustryPreview item={getFormAsIndustry()} />
            </div>
          ) : (
            <div className="p-5 space-y-3">
              <h3 className="font-medium text-sm">{editing ? "Rediger bransje" : "Ny bransje"}</h3>

              <div className="grid grid-cols-2 gap-3">
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Bransjenavn" className={inputCls} />
                <input value={form.href} onChange={e => setForm({ ...form, href: e.target.value })} placeholder="/bransjer/navn" className={inputCls} />
              </div>

              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Kort beskrivelse (brukes i oversikten)" rows={2} className={textareaCls} />

              <input value={form.tagline} onChange={e => setForm({ ...form, tagline: e.target.value })} placeholder="Tagline (overskrift på siden)" className={inputCls} />

              <textarea value={form.intro} onChange={e => setForm({ ...form, intro: e.target.value })} placeholder="Intro-tekst (vises under overskriften)" rows={3} className={textareaCls} />

              <textarea value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} placeholder="Brødtekst (hoveddelen av siden)" rows={4} className={textareaCls} />

              <div className="space-y-1">
                <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Hva vi dekker (én per linje)</label>
                <textarea value={form.deliverables} onChange={e => setForm({ ...form, deliverables: e.target.value })} rows={5} className={`${textareaCls} font-mono text-xs`} />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Utfordringer (JSON)</label>
                <textarea value={form.challenges} onChange={e => setForm({ ...form, challenges: e.target.value })} rows={6} className={`${textareaCls} font-mono text-xs`} />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Hvorfor Avargo (JSON)</label>
                <textarea value={form.why_avargo} onChange={e => setForm({ ...form, why_avargo: e.target.value })} rows={6} className={`${textareaCls} font-mono text-xs`} />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Relaterte bransjer (JSON)</label>
                <textarea value={form.related_slugs} onChange={e => setForm({ ...form, related_slugs: e.target.value })} rows={3} className={`${textareaCls} font-mono text-xs`} />
              </div>

              <input value={form.cta_headline} onChange={e => setForm({ ...form, cta_headline: e.target.value })} placeholder="CTA-overskrift" className={inputCls} />

              <div className="grid grid-cols-2 gap-3">
                <input value={form.meta_title} onChange={e => setForm({ ...form, meta_title: e.target.value })} placeholder="Meta-tittel (SEO)" className={inputCls} />
                <input value={form.meta_description} onChange={e => setForm({ ...form, meta_description: e.target.value })} placeholder="Meta-beskrivelse (SEO)" className={inputCls} />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <input value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} placeholder="Ikon (Lucide-navn)" className={inputCls} />
                <input value={form.sort_order} onChange={e => setForm({ ...form, sort_order: Number(e.target.value) })} type="number" placeholder="Sortering" className={inputCls} />
                <label className="flex items-center gap-2 text-sm cursor-pointer h-10">
                  <input type="checkbox" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} />
                  Aktiv
                </label>
              </div>

              <div className="flex gap-2">
                <button onClick={save} className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm hover:opacity-90">Lagre</button>
                <button onClick={() => { setShowForm(false); setEditing(null); }} className="px-4 py-2 rounded-xl text-sm border border-border/30 hover:bg-muted/50">Avbryt</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Industries list */}
      <div className="space-y-2">
        {items.map(item => (
          <div key={item.id} className="glass rounded-2xl px-5 py-4 border border-border/20 flex items-center justify-between gap-4 cursor-pointer hover:border-primary/20 transition-colors"
            onClick={() => setPreviewItem(item)}>
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-2 h-2 rounded-full shrink-0 ${item.active ? "bg-primary" : "bg-muted-foreground/30"}`} />
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{item.title}</p>
                <p className="text-xs text-muted-foreground truncate">{item.href || "–"}</p>
              </div>
            </div>
            <div className="flex gap-2 shrink-0" onClick={e => e.stopPropagation()}>
              <button onClick={() => setPreviewItem(item)} className="text-muted-foreground hover:text-primary"><Eye size={14} /></button>
              <button onClick={() => openEdit(item)} className="text-muted-foreground hover:text-foreground"><Edit2 size={14} /></button>
              <button onClick={() => del(item.id)} className="text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IndustriesPanel;
