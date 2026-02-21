import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Edit2, GraduationCap, ChevronDown, ChevronRight, Search, ExternalLink, X } from "lucide-react";
import RichTextEditor from "./RichTextEditor";

interface Course {
  id: string;
  name: string;
  description: string | null;
  long_description: string | null;
  category: string;
  active: boolean | null;
  sort_order: number | null;
  slug: string | null;
  highlights: string[] | null;
  target_audience: string | null;
  duration: string | null;
  meta_title: string | null;
  meta_description: string | null;
}

const CATEGORIES = [
  "Bokføring", "MVA", "Skatt & Skattelov", "Årsregnskap", "Lønn & Personal",
  "HR & Personal", "HMS", "Markedsføring", "AI & Automatisering",
  "Integrasjon & Teknologi", "Nettside & Web", "Nettbutikk & E-handel",
  "Selskapsrett", "Analyse & Rapportering", "Ledelse & Strategi",
];

const generateSlug = (name: string) =>
  name.toLowerCase()
    .replace(/æ/g, "ae").replace(/ø/g, "o").replace(/å/g, "a")
    .replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();

const emptyForm = {
  name: "", description: "", category: CATEGORIES[0], slug: "",
  long_description: "", highlights: [] as string[], target_audience: "",
  duration: "2-3 timer", meta_title: "", meta_description: "",
};

const CoursesPanel = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Course | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set(CATEGORIES));
  const [newHighlight, setNewHighlight] = useState("");

  const fetchCourses = async () => {
    const { data } = await supabase.from("courses").select("*").order("category").order("sort_order");
    setCourses((data as Course[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchCourses(); }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      name: form.name,
      description: form.description,
      category: form.category,
      slug: form.slug || generateSlug(form.name),
      long_description: form.long_description || null,
      highlights: form.highlights.length > 0 ? form.highlights : null,
      target_audience: form.target_audience || null,
      duration: form.duration || null,
      meta_title: form.meta_title || null,
      meta_description: form.meta_description || null,
    };
    if (editing) {
      await supabase.from("courses").update(payload).eq("id", editing.id);
    } else {
      await supabase.from("courses").insert([payload]);
    }
    setShowForm(false);
    setEditing(null);
    setForm(emptyForm);
    fetchCourses();
    setSaving(false);
  };

  const del = async (id: string) => {
    if (!confirm("Slett dette kurset?")) return;
    await supabase.from("courses").delete().eq("id", id);
    fetchCourses();
  };

  const startEdit = (c: Course) => {
    setEditing(c);
    setForm({
      name: c.name,
      description: c.description || "",
      category: c.category,
      slug: c.slug || "",
      long_description: c.long_description || "",
      highlights: Array.isArray(c.highlights) ? c.highlights : [],
      target_audience: c.target_audience || "",
      duration: c.duration || "2-3 timer",
      meta_title: c.meta_title || "",
      meta_description: c.meta_description || "",
    });
    setShowForm(true);
  };

  const toggleCat = (cat: string) => {
    setExpandedCats(prev => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });
  };

  const addHighlight = () => {
    if (!newHighlight.trim()) return;
    setForm({ ...form, highlights: [...form.highlights, newHighlight.trim()] });
    setNewHighlight("");
  };

  const removeHighlight = (i: number) => {
    setForm({ ...form, highlights: form.highlights.filter((_, idx) => idx !== i) });
  };

  const grouped = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = courses.filter(c => c.category === cat && c.name.toLowerCase().includes(search.toLowerCase()));
    return acc;
  }, {} as Record<string, Course[]>);

  const otherCourses = courses.filter(c => !CATEGORIES.includes(c.category) && c.name.toLowerCase().includes(search.toLowerCase()));
  const inputCls = "w-full h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40";
  const labelCls = "text-xs font-medium text-muted-foreground mb-1 block";

  if (loading) return <div className="text-muted-foreground text-sm">Laster kurs…</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p className="text-sm text-muted-foreground">{courses.length} kurs totalt</p>
        <button
          onClick={() => { setShowForm(true); setEditing(null); setForm(emptyForm); }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm glow-rose hover:opacity-90"
        >
          <Plus size={14} /> Nytt kurs
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Søk etter kurs…"
          className="w-full h-9 rounded-xl border border-border/30 bg-muted/30 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
      </div>

      {showForm && (
        <form onSubmit={save} className="glass rounded-2xl p-5 border border-border/20 space-y-4">
          <h3 className="font-medium text-sm mb-1">{editing ? "Rediger kurs" : "Nytt kurs"}</h3>

          {/* Grunnleggende */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Kursnavn *</label>
              <input value={form.name} onChange={e => {
                setForm({ ...form, name: e.target.value, slug: form.slug || generateSlug(e.target.value) });
              }} required className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>URL-slug</label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground whitespace-nowrap">/tjenester/kurs/</span>
                <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder={generateSlug(form.name)} className={inputCls} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Kategori</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className={inputCls}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Varighet</label>
              <input value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} placeholder="2-3 timer" className={inputCls} />
            </div>
          </div>

          {/* Kort beskrivelse */}
          <div>
            <label className={labelCls}>Kort beskrivelse (vises i liste)</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2}
              className="w-full rounded-xl border border-border/30 bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none" />
          </div>

          {/* Hva vi kan gjøre for deg – highlights */}
          <div>
            <label className={labelCls}>Hva vi kan gjøre for deg (punktliste)</label>
            <div className="space-y-2 mb-2">
              {form.highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2 glass rounded-xl px-3 py-2 border border-border/10">
                  <span className="text-sm flex-1">{h}</span>
                  <button type="button" onClick={() => removeHighlight(i)} className="text-muted-foreground hover:text-destructive"><X size={14} /></button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={newHighlight} onChange={e => setNewHighlight(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addHighlight(); } }}
                placeholder="Legg til punkt…" className={inputCls} />
              <button type="button" onClick={addHighlight} className="px-3 py-2 bg-primary/10 text-primary rounded-xl text-sm hover:bg-primary/20 whitespace-nowrap">
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Omfattende beskrivelse */}
          <div>
            <label className={labelCls}>Omfattende kursbeskrivelse (vises på kurssiden)</label>
            <RichTextEditor content={form.long_description} onChange={val => setForm({ ...form, long_description: val })} />
          </div>

          {/* Målgruppe */}
          <div>
            <label className={labelCls}>Hvem passer kurset for (rich text)</label>
            <RichTextEditor content={form.target_audience} onChange={val => setForm({ ...form, target_audience: val })} />
          </div>

          {/* SEO */}
          <details className="group">
            <summary className="text-xs font-medium text-muted-foreground cursor-pointer hover:text-foreground flex items-center gap-2">
              <ChevronRight size={12} className="group-open:rotate-90 transition-transform" /> SEO-innstillinger
            </summary>
            <div className="mt-3 space-y-3 pl-4">
              <div>
                <label className={labelCls}>Meta-tittel</label>
                <input value={form.meta_title} onChange={e => setForm({ ...form, meta_title: e.target.value })} placeholder={form.name} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Meta-beskrivelse</label>
                <textarea value={form.meta_description} onChange={e => setForm({ ...form, meta_description: e.target.value })} rows={2}
                  className="w-full rounded-xl border border-border/30 bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none" />
              </div>
            </div>
          </details>

          <div className="flex gap-2 pt-2">
            <button type="submit" disabled={saving} className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm hover:opacity-90 disabled:opacity-50">
              {saving ? "Lagrer…" : "Lagre"}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="px-4 py-2 rounded-xl text-sm border border-border/30 hover:bg-muted/50">Avbryt</button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {CATEGORIES.map(cat => {
          const items = grouped[cat];
          if (!items || items.length === 0) return null;
          const isOpen = expandedCats.has(cat);
          return (
            <div key={cat} className="glass rounded-2xl border border-border/20 overflow-hidden">
              <button onClick={() => toggleCat(cat)}
                className="w-full flex items-center gap-3 px-5 py-3.5 text-left hover:bg-muted/30 transition-colors">
                {isOpen ? <ChevronDown size={14} className="text-primary shrink-0" /> : <ChevronRight size={14} className="text-muted-foreground shrink-0" />}
                <GraduationCap size={14} className="text-primary shrink-0" />
                <span className="text-sm font-medium flex-1">{cat}</span>
                <span className="text-[10px] tracking-widest uppercase text-muted-foreground px-2 py-0.5 rounded-full border border-border/20">{items.length} kurs</span>
              </button>
              {isOpen && (
                <div className="border-t border-border/10">
                  {items.map(course => (
                    <div key={course.id} className="flex items-start gap-3 px-5 py-3 border-b border-border/5 last:border-0 hover:bg-muted/20 transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{course.name}</p>
                          {course.long_description && <span className="text-[9px] px-1.5 py-0.5 rounded bg-primary/10 text-primary">Innhold</span>}
                        </div>
                        {course.description && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{course.description}</p>}
                        {course.slug && <p className="text-[10px] text-muted-foreground/50 mt-0.5">/tjenester/kurs/{course.slug}</p>}
                      </div>
                      <div className="flex gap-1.5 shrink-0 pt-0.5">
                        {course.slug && (
                          <a href={`/tjenester/kurs/${course.slug}`} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary p-1">
                            <ExternalLink size={13} />
                          </a>
                        )}
                        <button onClick={() => startEdit(course)} className="text-muted-foreground hover:text-foreground p-1"><Edit2 size={13} /></button>
                        <button onClick={() => del(course.id)} className="text-muted-foreground hover:text-destructive p-1"><Trash2 size={13} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {otherCourses.length > 0 && (
          <div className="glass rounded-2xl border border-border/20 overflow-hidden">
            <div className="px-5 py-3.5">
              <span className="text-sm font-medium">Andre kategorier</span>
            </div>
            <div className="border-t border-border/10">
              {otherCourses.map(course => (
                <div key={course.id} className="flex items-start gap-3 px-5 py-3 border-b border-border/5 last:border-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{course.name}</p>
                    <p className="text-[10px] text-muted-foreground">{course.category}</p>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <button onClick={() => startEdit(course)} className="text-muted-foreground hover:text-foreground p-1"><Edit2 size={13} /></button>
                    <button onClick={() => del(course.id)} className="text-muted-foreground hover:text-destructive p-1"><Trash2 size={13} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPanel;
