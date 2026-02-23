import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Edit2, ExternalLink, Eye, ArrowLeft, CheckCircle2, ChevronRight, Phone, ArrowRight, X } from "lucide-react";

const SECTION_OPTIONS = [
  { value: "", label: "Alle / Delt" },
  { value: "regnskap", label: "Regnskap" },
  { value: "hr", label: "Personal (HR)" },
  { value: "markedsforing", label: "Markedsføring" },
  { value: "it", label: "IT & Utvikling" },
];

const CATEGORY_OPTIONS = ["Regnskap & Økonomi", "HR & Personal", "Markedsføring & Vekst", "IT & Utvikling", "Kurs & Opplæring"];

interface Service {
  id: string;
  title: string;
  slug: string | null;
  description: string | null;
  group_name: string | null;
  href: string | null;
  active: boolean;
  sort_order: number | null;
  icon: string | null;
  meta_title: string | null;
  meta_description: string | null;
  category: string | null;
  hero_title: string | null;
  hero_subtitle: string | null;
  deliverables: string[] | null;
  why_items: any[] | null;
  related_services: any[] | null;
  cta_title: string | null;
  cta_subtitle: string | null;
  body_content: string | null;
  section: string | null;
  hero_image_url: string | null;
}

const emptyForm = {
  title: "", slug: "", description: "", group_name: "Regnskap & Økonomi", href: "", active: true, sort_order: 0, icon: "",
  meta_title: "", meta_description: "", category: "Regnskap & Økonomi", hero_title: "", hero_subtitle: "",
  deliverables: "", why_items: "[]", related_services: "[]", cta_title: "", cta_subtitle: "", body_content: "", section: "", hero_image_url: "",
};

/** Parse hero title: text before ** is normal, text inside ** is accent */
function parseHeroTitle(raw: string) {
  const match = raw.match(/^(.*?)\*\*(.*?)\*\*(.*)$/);
  if (!match) return { main: raw, accent: "" };
  return { main: match[1].trim(), accent: match[2].trim() };
}

/** Mini preview renderer */
const ServicePreview = ({ svc }: { svc: Service }) => {
  const hero = parseHeroTitle(svc.hero_title || svc.title);
  const deliverables = svc.deliverables || [];
  const whyItems = (svc.why_items as any[]) || [];
  const relatedServices = (svc.related_services as any[]) || [];

  return (
    <div className="bg-background rounded-2xl border border-border/30 overflow-hidden max-h-[70vh] overflow-y-auto text-foreground">
      {/* Hero */}
      <div className="py-16 px-8 relative">
        <div className="absolute inset-0 ambient-glow opacity-20" />
        <div className="relative max-w-3xl">
          <p className="text-[9px] tracking-[0.4em] uppercase text-primary mb-3">{svc.category}</p>
          <h1 className="font-heading text-3xl md:text-5xl leading-tight mb-4">
            {hero.main}{" "}
            {hero.accent && <span className="italic text-gradient-rose">{hero.accent}</span>}
          </h1>
          <p className="text-sm text-muted-foreground font-light leading-relaxed max-w-xl mb-6">{svc.hero_subtitle}</p>
          <div className="flex gap-3">
            <span className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground text-xs font-medium rounded-full">
              Kom i gang <ArrowRight size={12} />
            </span>
            <span className="inline-flex items-center gap-2 px-6 py-2.5 text-xs text-foreground/50 rounded-full border border-border/20">Se priser</span>
          </div>
        </div>
      </div>

      {/* Deliverables */}
      {deliverables.length > 0 && (
        <div className="px-8 py-10 border-t border-border/10">
          <p className="text-[9px] tracking-[0.4em] uppercase text-muted-foreground/60 mb-3">Hva er inkludert</p>
          <div className="grid grid-cols-2 gap-2">
            {deliverables.map((d, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-foreground/70">
                <CheckCircle2 size={11} className="text-primary mt-0.5 shrink-0" strokeWidth={1.5} />
                {d}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Why items */}
      {whyItems.length > 0 && (
        <div className="px-8 py-10 border-t border-border/10">
          <p className="text-[9px] tracking-[0.4em] uppercase text-muted-foreground/60 mb-4">Hvorfor Avargo</p>
          <div className="grid grid-cols-2 gap-3">
            {whyItems.map((w: any, i: number) => (
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
      {relatedServices.length > 0 && (
        <div className="px-8 py-6 border-t border-border/10">
          <p className="text-[9px] tracking-[0.4em] uppercase text-muted-foreground/60 mb-3">Relaterte tjenester</p>
          <div className="flex flex-wrap gap-2">
            {relatedServices.map((s: any, i: number) => (
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
        <h2 className="font-heading text-xl mb-2">{svc.cta_title || "La oss snakke."}</h2>
        <p className="text-xs text-muted-foreground mb-4">{svc.cta_subtitle || "En samtale er nok."}</p>
        <span className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground text-xs font-medium rounded-full">
          Book en gjennomgang <ArrowRight size={12} />
        </span>
      </div>
    </div>
  );
};

const ServicesPanel = () => {
  const [items, setItems] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [previewItem, setPreviewItem] = useState<Service | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [filterSection, setFilterSection] = useState("all");
  const [formTab, setFormTab] = useState<"edit" | "preview">("edit");

  const fetchItems = async () => {
    const { data } = await supabase.from("services").select("*").order("sort_order");
    setItems((data as Service[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const save = async () => {
    const deliverables = form.deliverables.split("\n").filter(Boolean);
    let whyItems: any[] = [];
    let relatedServices: any[] = [];
    try { whyItems = JSON.parse(form.why_items); } catch {}
    try { relatedServices = JSON.parse(form.related_services); } catch {}

    const payload = {
      title: form.title, slug: form.slug || null, description: form.description || null,
      group_name: form.group_name, href: form.href || `/tjenester/${form.slug}`, active: form.active,
      sort_order: Number(form.sort_order), icon: form.icon || null,
      meta_title: form.meta_title || null, meta_description: form.meta_description || null,
      category: form.category || null, hero_title: form.hero_title || null,
      hero_subtitle: form.hero_subtitle || null, deliverables, why_items: whyItems,
      related_services: relatedServices, cta_title: form.cta_title || null,
      cta_subtitle: form.cta_subtitle || null, body_content: form.body_content || null,
      section: form.section || null, hero_image_url: form.hero_image_url || null,
    };

    if (editing) {
      await supabase.from("services").update(payload as any).eq("id", editing.id);
    } else {
      await supabase.from("services").insert([payload] as any);
    }
    setShowForm(false); setEditing(null); setForm(emptyForm);
    fetchItems();
  };

  const del = async (id: string) => {
    if (!confirm("Slett tjeneste?")) return;
    await supabase.from("services").delete().eq("id", id);
    fetchItems();
  };

  const startEdit = (item: Service) => {
    document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' });
    setEditing(item);
    setForm({
      title: item.title, slug: item.slug || "", description: item.description || "",
      group_name: item.group_name || "Regnskap & Økonomi", href: item.href || "", active: item.active,
      sort_order: item.sort_order || 0, icon: item.icon || "",
      meta_title: item.meta_title || "", meta_description: item.meta_description || "",
      category: item.category || "Regnskap & Økonomi", hero_title: item.hero_title || "",
      hero_subtitle: item.hero_subtitle || "",
      deliverables: (item.deliverables || []).join("\n"),
      why_items: JSON.stringify(item.why_items || [], null, 2),
      related_services: JSON.stringify(item.related_services || [], null, 2),
      cta_title: item.cta_title || "", cta_subtitle: item.cta_subtitle || "",
      body_content: item.body_content || "", section: item.section || "",
      hero_image_url: item.hero_image_url || "",
    });
    setShowForm(true); setFormTab("edit");
  };

  const getFormAsService = (): Service => {
    let whyItems: any[] = [];
    let relatedServices: any[] = [];
    try { whyItems = JSON.parse(form.why_items); } catch {}
    try { relatedServices = JSON.parse(form.related_services); } catch {}
    return {
      id: editing?.id || "", title: form.title, slug: form.slug, description: form.description,
      group_name: form.group_name, href: form.href, active: form.active, sort_order: form.sort_order,
      icon: form.icon, meta_title: form.meta_title, meta_description: form.meta_description,
      category: form.category, hero_title: form.hero_title, hero_subtitle: form.hero_subtitle,
      deliverables: form.deliverables.split("\n").filter(Boolean), why_items: whyItems,
      related_services: relatedServices, cta_title: form.cta_title, cta_subtitle: form.cta_subtitle,
      body_content: form.body_content, section: form.section, hero_image_url: form.hero_image_url,
    };
  };

  const filteredItems = filterSection === "all" ? items
    : filterSection === "shared" ? items.filter(i => !i.section)
    : items.filter(i => i.section === filterSection);

  const groups = [...new Set(filteredItems.map(i => i.group_name || "Annet"))];

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
          <button onClick={() => { startEdit(previewItem); setPreviewItem(null); }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded-lg hover:opacity-90">
            <Edit2 size={11} /> Rediger
          </button>
        </div>
        <ServicePreview svc={previewItem} />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <p className="text-muted-foreground text-sm">{items.length} tjenester · Klikk for forhåndsvisning</p>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm(emptyForm); setFormTab("edit"); }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm glow-rose hover:opacity-90">
          <Plus size={14} /> Ny tjeneste
        </button>
      </div>

      {/* Section filter */}
      <div className="flex gap-1.5 flex-wrap">
        <button onClick={() => setFilterSection("all")} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterSection === "all" ? "bg-primary text-primary-foreground" : "bg-muted/40 text-muted-foreground hover:text-foreground"}`}>Alle</button>
        <button onClick={() => setFilterSection("shared")} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterSection === "shared" ? "bg-primary text-primary-foreground" : "bg-muted/40 text-muted-foreground hover:text-foreground"}`}>Delt</button>
        {SECTION_OPTIONS.filter(s => s.value).map(s => (
          <button key={s.value} onClick={() => setFilterSection(s.value)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterSection === s.value ? "bg-primary text-primary-foreground" : "bg-muted/40 text-muted-foreground hover:text-foreground"}`}>{s.label}</button>
        ))}
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
              <ServicePreview svc={getFormAsService()} />
            </div>
          ) : (
            <div className="p-5 space-y-3">
              <h3 className="font-medium text-sm">{editing ? "Rediger tjeneste" : "Ny tjeneste"}</h3>

              <div className="grid grid-cols-2 gap-3">
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Tittel"
                  className="h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="Slug (url-vennlig)"
                  className="h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value, group_name: e.target.value })}
                  className="h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
                  {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select value={form.section} onChange={e => setForm({ ...form, section: e.target.value })}
                  className="h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
                  {SECTION_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Hero-tittel (bruk **tekst** for uthevet)</label>
                <input value={form.hero_title} onChange={e => setForm({ ...form, hero_title: e.target.value })} placeholder="Din dedikerte **regnskapsfører.**"
                  className="w-full h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
              </div>

              <textarea value={form.hero_subtitle} onChange={e => setForm({ ...form, hero_subtitle: e.target.value })} placeholder="Hero-undertekst" rows={2}
                className="w-full rounded-xl border border-border/30 bg-muted/30 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none" />

              <div className="grid grid-cols-2 gap-3">
                <input value={form.meta_title} onChange={e => setForm({ ...form, meta_title: e.target.value })} placeholder="Meta-tittel (SEO)"
                  className="h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                <input value={form.meta_description} onChange={e => setForm({ ...form, meta_description: e.target.value })} placeholder="Meta-beskrivelse (SEO)"
                  className="h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Leveranser / inkludert (én per linje)</label>
                <textarea value={form.deliverables} onChange={e => setForm({ ...form, deliverables: e.target.value })} rows={4}
                  className="w-full rounded-xl border border-border/30 bg-muted/30 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none font-mono text-xs" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Hvorfor-punkter (JSON)</label>
                <textarea value={form.why_items} onChange={e => setForm({ ...form, why_items: e.target.value })} rows={6}
                  className="w-full rounded-xl border border-border/30 bg-muted/30 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none font-mono text-xs" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Relaterte tjenester (JSON)</label>
                <textarea value={form.related_services} onChange={e => setForm({ ...form, related_services: e.target.value })} rows={3}
                  className="w-full rounded-xl border border-border/30 bg-muted/30 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none font-mono text-xs" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input value={form.cta_title} onChange={e => setForm({ ...form, cta_title: e.target.value })} placeholder="CTA-tittel"
                  className="h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                <input value={form.cta_subtitle} onChange={e => setForm({ ...form, cta_subtitle: e.target.value })} placeholder="CTA-undertekst"
                  className="h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Ekstra innhold (valgfritt)</label>
                <textarea value={form.body_content} onChange={e => setForm({ ...form, body_content: e.target.value })} rows={4}
                  className="w-full rounded-xl border border-border/30 bg-muted/30 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none" />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <input value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} placeholder="Ikon (Lucide-navn)"
                  className="h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                <input value={form.hero_image_url} onChange={e => setForm({ ...form, hero_image_url: e.target.value })} placeholder="Bilde-URL (valgfritt)"
                  className="h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                <input value={form.sort_order} onChange={e => setForm({ ...form, sort_order: Number(e.target.value) })} type="number" placeholder="Sortering"
                  className="h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
              </div>

              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} />
                Aktiv (synlig på nettsiden)
              </label>

              <div className="flex gap-2">
                <button onClick={save} className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm hover:opacity-90">Lagre</button>
                <button onClick={() => { setShowForm(false); setEditing(null); }} className="px-4 py-2 rounded-xl text-sm border border-border/30 hover:bg-muted/50">Avbryt</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Services list */}
      {groups.map(group => (
        <div key={group}>
          <p className="text-[9px] tracking-[0.35em] uppercase text-muted-foreground/40 mb-2">{group}</p>
          <div className="space-y-2">
            {filteredItems.filter(i => (i.group_name || "Annet") === group).map(item => (
              <div key={item.id} className="glass rounded-2xl px-5 py-4 border border-border/20 flex items-center justify-between gap-4 cursor-pointer hover:border-primary/20 transition-colors"
                onClick={() => setPreviewItem(item)}>
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${item.active ? "bg-primary" : "bg-muted-foreground/30"}`} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{item.title}</p>
                    <p className="text-xs text-muted-foreground truncate">/tjenester/{item.slug || "–"}</p>
                  </div>
                  {item.section && <span className="text-[8px] tracking-widest uppercase text-muted-foreground/50 border border-border/20 px-1.5 py-0.5 rounded-full shrink-0">{SECTION_OPTIONS.find(s => s.value === item.section)?.label || item.section}</span>}
                </div>
                <div className="flex gap-2 shrink-0" onClick={e => e.stopPropagation()}>
                  <button onClick={() => setPreviewItem(item)} className="text-muted-foreground hover:text-primary"><Eye size={14} /></button>
                  <button onClick={() => startEdit(item)} className="text-muted-foreground hover:text-foreground"><Edit2 size={14} /></button>
                  <button onClick={() => del(item.id)} className="text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServicesPanel;
