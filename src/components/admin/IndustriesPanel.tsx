import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Edit2, ChevronDown, ChevronUp } from "lucide-react";

interface Industry {
  id: string;
  title: string;
  description: string;
  href: string;
  active: boolean;
  tagline: string;
  intro: string;
  body: string;
  deliverables: string[];
  cta_headline: string;
}

const emptyForm = {
  title: "", description: "", href: "", active: true,
  tagline: "", intro: "", body: "", deliverables: [] as string[], cta_headline: "",
};

const inputCls = "w-full h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40";
const textareaCls = "w-full rounded-xl border border-border/30 bg-muted/30 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none";

const IndustriesPanel = () => {
  const [items, setItems] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Industry | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deliverablesText, setDeliverablesText] = useState("");
  const [showContent, setShowContent] = useState(false);

  const fetchData = async () => {
    const { data } = await supabase.from("industries").select("*").order("sort_order");
    setItems((data as Industry[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const openNew = () => {
    setShowForm(true);
    setEditing(null);
    setForm(emptyForm);
    setDeliverablesText("");
    setShowContent(false);
  };

  const openEdit = (item: Industry) => {
    document.querySelector("main")?.scrollTo({ top: 0, behavior: "smooth" });
    setEditing(item);
    setForm({
      title: item.title,
      description: item.description || "",
      href: item.href || "",
      active: item.active,
      tagline: item.tagline || "",
      intro: item.intro || "",
      body: item.body || "",
      deliverables: item.deliverables || [],
      cta_headline: item.cta_headline || "",
    });
    setDeliverablesText((item.deliverables || []).join("\n"));
    setShowContent(false);
    setShowForm(true);
  };

  const save = async () => {
    const payload = {
      ...form,
      deliverables: deliverablesText.split("\n").map(s => s.trim()).filter(Boolean),
    };
    if (editing) {
      await supabase.from("industries").update(payload).eq("id", editing.id);
    } else {
      await supabase.from("industries").insert([payload]);
    }
    setShowForm(false);
    setEditing(null);
    setForm(emptyForm);
    setDeliverablesText("");
    fetchData();
  };

  const del = async (id: string) => {
    if (!confirm("Slett bransje?")) return;
    await supabase.from("industries").delete().eq("id", id);
    fetchData();
  };

  if (loading) return <div className="text-muted-foreground text-sm">Laster…</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">{items.length} bransjer</p>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm glow-rose hover:opacity-90">
          <Plus size={14} /> Ny bransje
        </button>
      </div>

      {showForm && (
        <div className="glass rounded-2xl p-5 border border-border/20 space-y-3">
          <h3 className="font-medium text-sm">{editing ? "Rediger bransje" : "Ny bransje"}</h3>
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Bransjenavn" className={inputCls} />
          <input value={form.href} onChange={e => setForm({ ...form, href: e.target.value })} placeholder="/bransjer/navn" className={inputCls} />
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Kort beskrivelse (brukes i oversikten)" rows={2} className={textareaCls} />

          <button
            type="button"
            onClick={() => setShowContent(!showContent)}
            className="flex items-center gap-2 text-sm text-primary hover:underline mt-2"
          >
            {showContent ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {showContent ? "Skjul sideinnhold" : "Rediger sideinnhold (tekst & leveranser)"}
          </button>

          {showContent && (
            <div className="space-y-3 border-t border-border/20 pt-4">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Sideinnhold</p>
              <input value={form.tagline} onChange={e => setForm({ ...form, tagline: e.target.value })} placeholder="Tagline (overskrift på siden)" className={inputCls} />
              <textarea value={form.intro} onChange={e => setForm({ ...form, intro: e.target.value })} placeholder="Intro-tekst (vises under overskriften)" rows={3} className={textareaCls} />
              <textarea value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} placeholder="Brødtekst (hoveddelen av siden)" rows={4} className={textareaCls} />
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Hva vi dekker (én per linje)</label>
                <textarea value={deliverablesText} onChange={e => setDeliverablesText(e.target.value)} placeholder={"Bokføring\nMVA-rapportering\nÅrsregnskap"} rows={6} className={textareaCls} />
              </div>
              <input value={form.cta_headline} onChange={e => setForm({ ...form, cta_headline: e.target.value })} placeholder="CTA-overskrift (nederst på siden)" className={inputCls} />
            </div>
          )}

          <div className="flex gap-2">
            <button onClick={save} className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm hover:opacity-90">Lagre</button>
            <button onClick={() => { setShowForm(false); setEditing(null); }} className="px-4 py-2 rounded-xl text-sm border border-border/30 hover:bg-muted/50">Avbryt</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {items.map(item => (
          <div key={item.id} className="glass rounded-2xl px-5 py-4 border border-border/20 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">{item.title}</p>
              {item.href && <p className="text-xs text-muted-foreground">{item.href}</p>}
            </div>
            <div className="flex gap-2">
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
