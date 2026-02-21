import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Edit2, GraduationCap, ChevronDown, ChevronRight, Search } from "lucide-react";

interface Course {
  id: string;
  name: string;
  description: string | null;
  category: string;
  active: boolean | null;
  sort_order: number | null;
}

const CATEGORIES = [
  "Bokføring", "MVA", "Skatt & Skattelov", "Årsregnskap", "Lønn & Personal",
  "HR & Personal", "HMS", "Markedsføring", "AI & Automatisering",
  "Integrasjon & Teknologi", "Nettside & Web", "Nettbutikk & E-handel",
  "Selskapsrett", "Analyse & Rapportering", "Ledelse & Strategi",
];

const emptyForm = { name: "", description: "", category: CATEGORIES[0] };

const CoursesPanel = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Course | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set(CATEGORIES));

  const fetchCourses = async () => {
    const { data } = await supabase.from("courses").select("*").order("category").order("sort_order");
    setCourses((data as Course[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchCourses(); }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    if (editing) {
      await supabase.from("courses").update({ name: form.name, description: form.description, category: form.category }).eq("id", editing.id);
    } else {
      await supabase.from("courses").insert([{ name: form.name, description: form.description, category: form.category }]);
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
    setForm({ name: c.name, description: c.description || "", category: c.category });
    setShowForm(true);
  };

  const toggleCat = (cat: string) => {
    setExpandedCats(prev => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });
  };

  const grouped = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = courses.filter(c => c.category === cat && c.name.toLowerCase().includes(search.toLowerCase()));
    return acc;
  }, {} as Record<string, Course[]>);

  // Include categories with courses not in the predefined list
  const otherCourses = courses.filter(c => !CATEGORIES.includes(c.category) && c.name.toLowerCase().includes(search.toLowerCase()));

  const inputCls = "w-full h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40";

  if (loading) return <div className="text-muted-foreground text-sm">Laster kurs…</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <p className="text-sm text-muted-foreground">{courses.length} kurs totalt</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditing(null); setForm(emptyForm); }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm glow-rose hover:opacity-90"
        >
          <Plus size={14} /> Nytt kurs
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Søk etter kurs…"
          className="w-full h-9 rounded-xl border border-border/30 bg-muted/30 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>

      {showForm && (
        <form onSubmit={save} className="glass rounded-2xl p-5 border border-border/20 space-y-3">
          <h3 className="font-medium text-sm mb-1">{editing ? "Rediger kurs" : "Nytt kurs"}</h3>
          <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Kursnavn *" required className={inputCls} />
          <textarea
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            placeholder="Beskrivelse av kurset…"
            rows={3}
            className="w-full rounded-xl border border-border/30 bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
          />
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className={inputCls}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <div className="flex gap-2">
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
              <button
                onClick={() => toggleCat(cat)}
                className="w-full flex items-center gap-3 px-5 py-3.5 text-left hover:bg-muted/30 transition-colors"
              >
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
                        <p className="text-sm font-medium">{course.name}</p>
                        {course.description && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{course.description}</p>}
                      </div>
                      <div className="flex gap-1.5 shrink-0 pt-0.5">
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
