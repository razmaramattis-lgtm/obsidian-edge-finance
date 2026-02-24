import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Edit2, Eye, EyeOff, Search, X, Briefcase, Users, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import RichTextEditor from "./RichTextEditor";

interface JobListing {
  id: string;
  title: string;
  slug: string;
  category: string;
  location: string;
  employment_type: string;
  work_hours: string;
  work_language: string;
  work_location: string;
  num_positions: number;
  start_date: string;
  deadline: string | null;
  intro: string | null;
  description: string | null;
  qualifications: string | null;
  tasks: string | null;
  we_offer: string | null;
  about_company: string | null;
  contact_name: string | null;
  contact_title: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  published: boolean;
  active: boolean;
  created_at: string;
}

interface JobApplication {
  id: string;
  job_listing_id: string;
  full_name: string;
  email: string;
  phone: string;
  message: string | null;
  cv_file_name: string | null;
  status: string;
  admin_note: string | null;
  created_at: string;
}

const CATEGORIES = ["Regnskap", "Personal", "Marked", "IT"];

const emptyForm = {
  title: "", slug: "", category: "Regnskap", location: "Skien",
  employment_type: "Fast, heltid 100%", work_hours: "Dagtid, ukedager",
  work_language: "Norsk eller engelsk", work_location: "Hybridkontor",
  num_positions: 1, start_date: "Etter avtale", deadline: "",
  intro: "", description: "", qualifications: "", tasks: "", we_offer: "",
  about_company: "", contact_name: "Emil Follaug", contact_title: "Daglig leder",
  contact_email: "Emil@avargo.no", contact_phone: "464 25 354",
  published: false, active: true,
};

const JobListingsPanel = () => {
  const [listings, setListings] = useState<JobListing[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<JobListing | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [viewApps, setViewApps] = useState<string | null>(null);

  const fetchAll = async () => {
    const [{ data: jobs }, { data: apps }] = await Promise.all([
      supabase.from("job_listings").select("*").order("created_at", { ascending: false }),
      supabase.from("job_applications").select("*").order("created_at", { ascending: false }),
    ]);
    setListings((jobs as JobListing[]) || []);
    setApplications((apps as JobApplication[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const slugify = (t: string) => t.toLowerCase().replace(/[^a-z0-9æøå]+/g, "-").replace(/^-|-$/g, "");

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const slug = form.slug || slugify(form.title);
    const payload = { ...form, slug, deadline: form.deadline || null };
    
    if (editing) {
      const { error } = await supabase.from("job_listings").update(payload).eq("id", editing.id);
      if (error) toast.error("Kunne ikke lagre"); else toast.success("Stilling oppdatert");
    } else {
      const { error } = await supabase.from("job_listings").insert([payload]);
      if (error) toast.error(error.message); else toast.success("Stilling opprettet");
    }
    setShowForm(false); setEditing(null); setForm(emptyForm);
    fetchAll(); setSaving(false);
  };

  const del = async (id: string) => {
    if (!confirm("Slett denne stillingsannonsen?")) return;
    await supabase.from("job_listings").delete().eq("id", id);
    toast.success("Slettet"); fetchAll();
  };

  const togglePublish = async (job: JobListing) => {
    await supabase.from("job_listings").update({ published: !job.published }).eq("id", job.id);
    fetchAll();
  };

  const updateAppStatus = async (appId: string, status: string) => {
    await supabase.from("job_applications").update({ status }).eq("id", appId);
    fetchAll();
  };

  const filtered = listings.filter(j =>
    j.title.toLowerCase().includes(search.toLowerCase()) ||
    j.category.toLowerCase().includes(search.toLowerCase()) ||
    j.location.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="text-muted-foreground text-sm">Laster…</div>;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-xs">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Søk i stillinger…"
            className="w-full h-9 pl-8 pr-3 rounded-xl border border-border/20 bg-muted/20 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">{listings.length} stillinger</span>
          <button onClick={() => { setShowForm(true); setEditing(null); setForm(emptyForm); }}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-xs hover:opacity-90">
            <Plus size={13} /> Ny stillingsannonse
          </button>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={save} className="glass rounded-2xl p-5 border border-border/20 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-sm">{editing ? "Rediger" : "Ny"} stillingsannonse</h3>
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="text-muted-foreground hover:text-foreground"><X size={16} /></button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value, slug: slugify(e.target.value) })} placeholder="Stillingstittel *" required
              className="w-full h-9 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
            <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="URL-slug"
              className="w-full h-9 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
              className="w-full h-9 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
            <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Sted"
              className="w-full h-9 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
            <input value={form.employment_type} onChange={e => setForm({ ...form, employment_type: e.target.value })} placeholder="Type ansettelse"
              className="w-full h-9 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
            <input value={form.work_location} onChange={e => setForm({ ...form, work_location: e.target.value })} placeholder="Arbeidssted"
              className="w-full h-9 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
            <input value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} placeholder="Oppstart"
              className="w-full h-9 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
            <input value={form.deadline || ""} onChange={e => setForm({ ...form, deadline: e.target.value })} placeholder="Søknadsfrist (valgfritt)"
              className="w-full h-9 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
            <input value={form.work_hours} onChange={e => setForm({ ...form, work_hours: e.target.value })} placeholder="Arbeidstid"
              className="w-full h-9 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
            <input type="number" value={form.num_positions} onChange={e => setForm({ ...form, num_positions: parseInt(e.target.value) || 1 })} placeholder="Antall stillinger"
              className="w-full h-9 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Intro / kort beskrivelse</label>
              <textarea value={form.intro || ""} onChange={e => setForm({ ...form, intro: e.target.value })} rows={2}
                className="w-full rounded-xl border border-border/30 bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Hva vi ser etter (rik tekst)</label>
              <RichTextEditor content={form.description || ""} onChange={v => setForm({ ...form, description: v })} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Arbeidsoppgaver (rik tekst)</label>
              <RichTextEditor content={form.tasks || ""} onChange={v => setForm({ ...form, tasks: v })} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Kvalifikasjoner (rik tekst)</label>
              <RichTextEditor content={form.qualifications || ""} onChange={v => setForm({ ...form, qualifications: v })} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Vi tilbyr (rik tekst)</label>
              <RichTextEditor content={form.we_offer || ""} onChange={v => setForm({ ...form, we_offer: v })} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Om bedriften (rik tekst)</label>
              <RichTextEditor content={form.about_company || ""} onChange={v => setForm({ ...form, about_company: v })} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input value={form.contact_name || ""} onChange={e => setForm({ ...form, contact_name: e.target.value })} placeholder="Kontaktperson"
              className="w-full h-9 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
            <input value={form.contact_title || ""} onChange={e => setForm({ ...form, contact_title: e.target.value })} placeholder="Tittel kontaktperson"
              className="w-full h-9 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
            <input value={form.contact_email || ""} onChange={e => setForm({ ...form, contact_email: e.target.value })} placeholder="E-post kontaktperson"
              className="w-full h-9 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
            <input value={form.contact_phone || ""} onChange={e => setForm({ ...form, contact_phone: e.target.value })} placeholder="Telefon kontaktperson"
              className="w-full h-9 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-xs">
              <input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} className="rounded" />
              Publisert
            </label>
          </div>

          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-xs hover:opacity-90 disabled:opacity-50">
              {saving ? "Lagrer…" : "Lagre"}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="px-4 py-2 rounded-xl text-xs border border-border/30 hover:bg-muted/50">Avbryt</button>
          </div>
        </form>
      )}

      {/* Listings */}
      <div className="space-y-2">
        {filtered.map(job => {
          const appCount = applications.filter(a => a.job_listing_id === job.id).length;
          return (
            <div key={job.id} className="glass rounded-2xl border border-border/20 overflow-hidden">
              <div className="px-5 py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <Briefcase size={16} className="text-primary shrink-0" strokeWidth={1.5} />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">{job.title}</p>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${job.published ? "bg-green-500/10 text-green-600" : "bg-muted text-muted-foreground"}`}>
                        {job.published ? "Publisert" : "Utkast"}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate">{job.category} · {job.location} · {job.employment_type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {appCount > 0 && (
                    <button onClick={() => setViewApps(viewApps === job.id ? null : job.id)}
                      className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                      <Users size={11} /> {appCount} {viewApps === job.id ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                    </button>
                  )}
                  <button onClick={() => togglePublish(job)} className="text-muted-foreground hover:text-primary transition-colors" title={job.published ? "Avpubliser" : "Publiser"}>
                    {job.published ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                  <button onClick={() => {
                    setEditing(job);
                    setForm({
                      title: job.title, slug: job.slug, category: job.category, location: job.location,
                      employment_type: job.employment_type, work_hours: job.work_hours, work_language: job.work_language,
                      work_location: job.work_location, num_positions: job.num_positions, start_date: job.start_date,
                      deadline: job.deadline || "", intro: job.intro || "", description: job.description || "",
                      qualifications: job.qualifications || "", tasks: job.tasks || "", we_offer: job.we_offer || "",
                      about_company: job.about_company || "", contact_name: job.contact_name || "",
                      contact_title: job.contact_title || "", contact_email: job.contact_email || "",
                      contact_phone: job.contact_phone || "", published: job.published, active: job.active,
                    });
                    setShowForm(true);
                  }} className="text-muted-foreground hover:text-foreground transition-colors"><Edit2 size={13} /></button>
                  <button onClick={() => del(job.id)} className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={13} /></button>
                </div>
              </div>

              {/* Applications accordion */}
              {viewApps === job.id && (
                <div className="border-t border-border/10 px-5 py-3 space-y-2 bg-muted/10">
                  <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground/60">Søknader</p>
                  {applications.filter(a => a.job_listing_id === job.id).map(app => (
                    <div key={app.id} className="flex items-center justify-between gap-3 py-2 border-b border-border/10 last:border-0">
                      <div className="min-w-0">
                        <p className="text-xs font-medium">{app.full_name}</p>
                        <p className="text-[10px] text-muted-foreground">{app.email} · {app.phone}</p>
                        {app.message && <p className="text-[10px] text-muted-foreground/80 mt-0.5 line-clamp-2">{app.message}</p>}
                      </div>
                      <select value={app.status} onChange={e => updateAppStatus(app.id, e.target.value)}
                        className="h-7 rounded-lg border border-border/30 bg-muted/30 px-2 text-[10px] focus:outline-none">
                        <option value="ny">Ny</option>
                        <option value="under_vurdering">Under vurdering</option>
                        <option value="intervju">Til intervju</option>
                        <option value="tilbud">Tilbud sendt</option>
                        <option value="ansatt">Ansatt</option>
                        <option value="avslått">Avslått</option>
                      </select>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">Ingen stillingsannonser funnet</p>
        )}
      </div>
    </div>
  );
};

export default JobListingsPanel;
