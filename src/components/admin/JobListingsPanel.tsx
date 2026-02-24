import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Edit2, Eye, EyeOff, Search, X, Briefcase, Users, ChevronDown, ChevronUp, ImagePlus, Loader2, FileText, Inbox } from "lucide-react";
import { toast } from "sonner";
import RichTextEditor from "./RichTextEditor";

interface JobListing {
  id: string; title: string; slug: string; category: string; location: string;
  employment_type: string; work_hours: string; work_language: string; work_location: string;
  num_positions: number; start_date: string; deadline: string | null;
  intro: string | null; description: string | null; qualifications: string | null;
  tasks: string | null; we_offer: string | null; about_company: string | null;
  contact_name: string | null; contact_title: string | null; contact_email: string | null;
  contact_phone: string | null; published: boolean; active: boolean; created_at: string;
  images: string[] | null; highlights: string[] | null;
}

interface JobApplication {
  id: string; job_listing_id: string; full_name: string; email: string; phone: string;
  message: string | null; cv_file_name: string | null; cv_url: string | null;
  status: string; admin_note: string | null; created_at: string;
}

interface OpenApplication {
  id: string; full_name: string; email: string; phone: string;
  linkedin_url: string | null; portfolio_url: string | null;
  preferred_category: string | null; message: string | null;
  cv_file_name: string | null; cv_url: string | null;
  status: string; created_at: string;
}

const CATEGORIES = ["Regnskap", "Personal", "Marked", "IT"];
const WORK_LOCATIONS = [
  { value: "Hybridkontor", label: "🏠 Hybrid (kontor + hjemme)" },
  { value: "På kontoret", label: "🏢 På kontoret" },
  { value: "Remote / hjemmekontor", label: "🌐 Remote / hjemmekontor" },
];

const ABOUT_AVARGO = `<p>Avargo er et moderne rådgivningsselskap som leverer tjenester innen regnskap, HR, marked og IT. Vi kombinerer faglig tyngde med teknologisk innovasjon for å gi våre kunder innsikt, trygghet og vekst.</p><p>Hos oss jobber du i et tverrfaglig miljø med høy kompetanse, uten overtid, og med bransjens beste vilkår.</p>`;

const WE_OFFER = `<ul><li>Konkurransedyktig lønn og gode pensjonsvilkår</li><li>Fleksibel arbeidstid uten overtid</li><li>Moderne kontorer og teknologi</li><li>Kontinuerlig faglig utvikling og kursing</li><li>Et inkluderende og sosialt arbeidsmiljø</li><li>Gode forsikringsordninger</li></ul>`;

// Templates per category with work_location dynamic text
const TEMPLATES: Record<string, { title: string; intro: string; description: string; tasks: string; qualifications: string }> = {
  Regnskap: {
    title: "Regnskapsfører",
    intro: "Vi søker en engasjert regnskapsfører som ønsker å jobbe med varierte kunder i et moderne og teknologidrevet miljø. Hos oss får du faglig utvikling, gode vilkår og et sterkt team rundt deg.",
    description: "<p>Vi ser etter en grundig og løsningsorientert regnskapsfører som trives med kundeansvar og ønsker å jobbe i et dynamisk fagmiljø. Du vil ha ansvar for en egen kundeportefølje og jobbe tett med våre rådgivere.</p>",
    tasks: "<ul><li>Løpende bokføring og avstemming for kundeportefølje</li><li>Utarbeidelse av årsregnskap og ligningspapirer</li><li>MVA-oppgaver og skattemeldinger</li><li>Rådgivning innen regnskap og økonomi</li><li>Lønn og personaladministrasjon</li></ul>",
    qualifications: "<ul><li>Regnskapsfører (statsautorisert er et pluss)</li><li>Minimum 2 års relevant erfaring</li><li>God kjennskap til norske regnskapsregler</li><li>Erfaring med Tripletex, Fiken eller tilsvarende</li><li>Gode kommunikasjonsevner på norsk</li></ul>",
  },
  Personal: {
    title: "HR-rådgiver",
    intro: "Vi søker en dyktig HR-rådgiver som vil hjelpe våre kunder med alt innen personalledelse, arbeidsrett og organisasjonsutvikling.",
    description: "<p>Som HR-rådgiver hos Avargo vil du jobbe tett med kunder innen personaladministrasjon, arbeidsrett og organisasjonsutvikling. Du får en variert hverdag med høy grad av selvstendighet.</p>",
    tasks: "<ul><li>Rådgivning innen arbeidsrett og ansettelsesprosesser</li><li>Utarbeidelse av personalhåndbøker og policyer</li><li>Oppfølging av arbeidsmiljø og HMS</li><li>Støtte i omstillings- og endringsprosesser</li><li>Kurs og opplæring for kunders ledere</li></ul>",
    qualifications: "<ul><li>Utdanning innen HR, juss eller lignende</li><li>Erfaring fra HR-rådgivning eller personalledelse</li><li>God kjennskap til norsk arbeidsrett</li><li>Evne til å bygge relasjoner og gi trygg veiledning</li></ul>",
  },
  Marked: {
    title: "Markedsfører",
    intro: "Vi søker en kreativ og analytisk markedsfører som vil hjelpe våre kunder med digital synlighet, annonsering og merkevarebygging.",
    description: "<p>Du vil jobbe med strategi, innholdsproduksjon og digital markedsføring for en rekke kunder. Hos oss får du frihet til å teste nye kanaler og metoder.</p>",
    tasks: "<ul><li>Planlegge og gjennomføre digitale kampanjer</li><li>Innholdsproduksjon for sosiale medier og nettsider</li><li>SEO-optimalisering og Google Ads</li><li>Analysere resultater og optimalisere</li><li>Rådgivning innen merkevare og posisjonering</li></ul>",
    qualifications: "<ul><li>Utdanning innen markedsføring eller kommunikasjon</li><li>Erfaring med digitale kanaler og annonsering</li><li>Gode skriftlige ferdigheter på norsk</li><li>Analytisk og kreativ tilnærming</li></ul>",
  },
  IT: {
    title: "IT-rådgiver / Utvikler",
    intro: "Vi søker en teknisk dyktig IT-rådgiver eller utvikler som vil bygge og vedlikeholde moderne løsninger for våre kunder og interne systemer.",
    description: "<p>Du vil jobbe med utvikling, integrasjoner og teknisk rådgivning i et tverrfaglig team. Vi bruker moderne teknologi og verdsetter innovasjon og kvalitet.</p>",
    tasks: "<ul><li>Utvikling og vedlikehold av nettsider og webapplikasjoner</li><li>Integrering av systemer og API-er</li><li>Teknisk rådgivning og behovsanalyse</li><li>Automatisering av prosesser</li><li>Bidra til intern produktutvikling</li></ul>",
    qualifications: "<ul><li>Relevant utdanning innen IT eller informatikk</li><li>Erfaring med React, TypeScript eller lignende</li><li>Kjennskap til skyløsninger og databaser</li><li>Evne til å forstå forretningsbehov og oversette til tekniske løsninger</li></ul>",
  },
};

const emptyForm = {
  title: "", slug: "", category: "Regnskap", location: "Skien",
  employment_type: "Fast, heltid 100%", work_hours: "Dagtid, ukedager",
  work_language: "Norsk eller engelsk", work_location: "Hybridkontor",
  num_positions: 1, start_date: "Etter avtale", deadline: "",
  intro: "", description: "", qualifications: "", tasks: "", we_offer: WE_OFFER,
  about_company: ABOUT_AVARGO, contact_name: "Emil Follaug", contact_title: "Daglig leder",
  contact_email: "Emil@avargo.no", contact_phone: "464 25 354",
  published: false, active: true, images: [] as string[], highlights: [] as string[],
};

const JobListingsPanel = () => {
  const [listings, setListings] = useState<JobListing[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [openApps, setOpenApps] = useState<OpenApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<JobListing | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [viewApps, setViewApps] = useState<string | null>(null);
  const [showOpenApps, setShowOpenApps] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<"listings" | "open">("listings");
  const imgInputRef = useRef<HTMLInputElement>(null);

  const fetchAll = async () => {
    const [{ data: jobs }, { data: apps }, { data: opens }] = await Promise.all([
      supabase.from("job_listings").select("*").order("created_at", { ascending: false }),
      supabase.from("job_applications").select("*").order("created_at", { ascending: false }),
      supabase.from("open_applications").select("*").order("created_at", { ascending: false }),
    ]);
    setListings((jobs as JobListing[]) || []);
    setApplications((apps as JobApplication[]) || []);
    setOpenApps((opens as OpenApplication[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const slugify = (t: string) => t.toLowerCase().replace(/[^a-z0-9æøå]+/g, "-").replace(/^-|-$/g, "");

  const applyTemplate = (category: string) => {
    const tpl = TEMPLATES[category];
    if (!tpl) return;
    const workLocText = WORK_LOCATIONS.find(w => w.value === form.work_location)?.label.replace(/^[^ ]+ /, '') || form.work_location;
    setForm(prev => ({
      ...prev,
      category,
      title: tpl.title,
      slug: slugify(tpl.title + "-" + prev.location),
      intro: tpl.intro.replace(/\{work_location\}/g, workLocText),
      description: tpl.description.replace(/\{work_location\}/g, workLocText),
      tasks: tpl.tasks,
      qualifications: tpl.qualifications,
      we_offer: WE_OFFER,
      about_company: ABOUT_AVARGO,
    }));
  };

  const updateWorkLocation = (wl: string) => {
    setForm(prev => ({ ...prev, work_location: wl }));
  };

  const uploadImage = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) { toast.error("Maks 5 MB per bilde"); return; }
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `job-images/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("workspace-uploads").upload(path, file);
    if (error) { toast.error("Kunne ikke laste opp bilde"); setUploading(false); return; }
    const { data } = supabase.storage.from("workspace-uploads").getPublicUrl(path);
    setForm(prev => ({ ...prev, images: [...prev.images, data.publicUrl] }));
    setUploading(false);
  };

  const removeImage = (idx: number) => {
    setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  };

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

  const inputCls = "w-full h-9 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40";

  if (loading) return <div className="text-muted-foreground text-sm">Laster…</div>;

  const updateOpenAppStatus = async (appId: string, status: string) => {
    await supabase.from("open_applications").update({ status }).eq("id", appId);
    fetchAll();
  };

  return (
    <div className="space-y-5">
      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border/10 pb-2">
        <button onClick={() => setActiveTab("listings")}
          className={`px-4 py-2 rounded-t-xl text-xs font-medium transition-all ${activeTab === "listings" ? "bg-primary/10 text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}>
          <Briefcase size={12} className="inline mr-1.5" />Stillingsannonser ({listings.length})
        </button>
        <button onClick={() => setActiveTab("open")}
          className={`px-4 py-2 rounded-t-xl text-xs font-medium transition-all ${activeTab === "open" ? "bg-primary/10 text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}>
          <Inbox size={12} className="inline mr-1.5" />Åpne søknader ({openApps.length})
        </button>
      </div>

      {activeTab === "open" ? (
        /* Open Applications Tab */
        <div className="space-y-2">
          {openApps.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Ingen åpne søknader mottatt ennå</p>
          ) : openApps.map(app => (
            <div key={app.id} className="glass rounded-2xl border border-border/20 px-5 py-3">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{app.full_name}</p>
                    {app.preferred_category && (
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">{app.preferred_category}</span>
                    )}
                    {app.message?.startsWith("[AVARGO FRI]") && (
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-secondary/10 text-secondary">Avargo Fri</span>
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground">{app.email} · {app.phone} · {new Date(app.created_at).toLocaleDateString("nb-NO")}</p>
                  {app.linkedin_url && <a href={app.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-primary hover:underline">LinkedIn</a>}
                  {app.portfolio_url && <a href={app.portfolio_url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-primary hover:underline ml-3">Portefølje</a>}
                  {app.cv_file_name && (
                    <a href={app.cv_url || "#"} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[10px] text-primary hover:underline ml-3">
                      <FileText size={10} /> {app.cv_file_name}
                    </a>
                  )}
                  {app.message && <p className="text-[10px] text-muted-foreground/80 mt-1 line-clamp-2">{app.message}</p>}
                </div>
                <select value={app.status} onChange={e => updateOpenAppStatus(app.id, e.target.value)}
                  className="h-7 rounded-lg border border-border/30 bg-muted/30 px-2 text-[10px] focus:outline-none shrink-0">
                  <option value="ny">Ny</option>
                  <option value="kontaktet">Kontaktet</option>
                  <option value="under_vurdering">Under vurdering</option>
                  <option value="intervju">Til intervju</option>
                  <option value="tilbud">Tilbud</option>
                  <option value="ansatt">Ansatt</option>
                  <option value="avslått">Avslått</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      ) : (
      <>

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
        <form onSubmit={save} className="glass rounded-2xl p-5 border border-border/20 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-sm">{editing ? "Rediger" : "Ny"} stillingsannonse</h3>
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="text-muted-foreground hover:text-foreground"><X size={16} /></button>
          </div>

          {/* Quick template selector */}
          {!editing && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Velg mal for rask utfylling:</p>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(cat => (
                  <button key={cat} type="button" onClick={() => applyTemplate(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-medium transition-all border ${
                      form.category === cat && form.title === TEMPLATES[cat]?.title
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted/30 text-muted-foreground border-border/30 hover:bg-muted/50 hover:text-foreground"
                    }`}>
                    📝 {cat}-mal
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Basic fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-muted-foreground mb-1 block">Stillingstittel *</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value, slug: slugify(e.target.value + "-" + form.location) })} required className={inputCls} />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground mb-1 block">URL-slug</label>
              <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground mb-1 block">Kategori</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className={inputCls}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground mb-1 block">Sted / kontor</label>
              <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground mb-1 block">Type ansettelse</label>
              <input value={form.employment_type} onChange={e => setForm({ ...form, employment_type: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground mb-1 block">Arbeidssted</label>
              <select value={form.work_location} onChange={e => updateWorkLocation(e.target.value)} className={inputCls}>
                {WORK_LOCATIONS.map(wl => <option key={wl.value} value={wl.value}>{wl.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground mb-1 block">Oppstart</label>
              <input value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground mb-1 block">Søknadsfrist</label>
              <input value={form.deadline || ""} onChange={e => setForm({ ...form, deadline: e.target.value })} placeholder="Valgfritt" className={inputCls} />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground mb-1 block">Arbeidstid</label>
              <input value={form.work_hours} onChange={e => setForm({ ...form, work_hours: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground mb-1 block">Antall stillinger</label>
              <input type="number" value={form.num_positions} onChange={e => setForm({ ...form, num_positions: parseInt(e.target.value) || 1 })} className={inputCls} />
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="text-[10px] text-muted-foreground mb-2 block">Bilder til annonsen</label>
            <input ref={imgInputRef} type="file" accept="image/*" multiple className="hidden" onChange={e => {
              const files = e.target.files;
              if (files) Array.from(files).forEach(f => uploadImage(f));
              e.target.value = "";
            }} />
            <div className="flex flex-wrap gap-3">
              {form.images.map((url, i) => (
                <div key={i} className="relative group w-24 h-24 rounded-xl overflow-hidden border border-border/20">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImage(i)}
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Trash2 size={16} className="text-white" />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => imgInputRef.current?.click()} disabled={uploading}
                className="w-24 h-24 rounded-xl border-2 border-dashed border-border/30 hover:border-primary/40 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary transition-all">
                {uploading ? <Loader2 size={18} className="animate-spin" /> : <><ImagePlus size={18} /><span className="text-[9px]">Legg til</span></>}
              </button>
            </div>
          </div>

          {/* Highlights / Keywords */}
          <div>
            <label className="text-[10px] text-muted-foreground mb-1 block">Høydepunkter / nøkkelord (vises som interaktivt spill)</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.highlights.map((h, i) => (
                <span key={i} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs border border-primary/20">
                  {h}
                  <button type="button" onClick={() => setForm(prev => ({ ...prev, highlights: prev.highlights.filter((_, idx) => idx !== i) }))}
                    className="hover:text-destructive transition-colors"><X size={12} /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="F.eks. Teknologidrevet, Fleksibel arbeidstid…"
                className="flex-1 h-9 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const val = (e.target as HTMLInputElement).value.trim();
                    if (val && !form.highlights.includes(val)) {
                      setForm(prev => ({ ...prev, highlights: [...prev.highlights, val] }));
                      (e.target as HTMLInputElement).value = "";
                    }
                  }
                }}
              />
              <button type="button" className="h-9 px-3 rounded-xl bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
                onClick={() => {
                  const input = document.querySelector<HTMLInputElement>('input[placeholder*="Teknologidrevet"]');
                  if (input) {
                    const val = input.value.trim();
                    if (val && !form.highlights.includes(val)) {
                      setForm(prev => ({ ...prev, highlights: [...prev.highlights, val] }));
                      input.value = "";
                    }
                  }
                }}>Legg til</button>
            </div>
            <p className="text-[9px] text-muted-foreground/60 mt-1">Trykk Enter eller «Legg til» for hvert nøkkelord</p>
          </div>

          {/* Rich text sections */}
          <div className="space-y-4">
            <div>
              <label className="text-[10px] text-muted-foreground mb-1 block">Intro / kort beskrivelse</label>
              <textarea value={form.intro || ""} onChange={e => setForm({ ...form, intro: e.target.value })} rows={2}
                className="w-full rounded-xl border border-border/30 bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground mb-1 block">Hva vi ser etter</label>
              <RichTextEditor content={form.description || ""} onChange={v => setForm({ ...form, description: v })} />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground mb-1 block">Arbeidsoppgaver</label>
              <RichTextEditor content={form.tasks || ""} onChange={v => setForm({ ...form, tasks: v })} />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground mb-1 block">Kvalifikasjoner</label>
              <RichTextEditor content={form.qualifications || ""} onChange={v => setForm({ ...form, qualifications: v })} />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground mb-1 block">Vi tilbyr</label>
              <RichTextEditor content={form.we_offer || ""} onChange={v => setForm({ ...form, we_offer: v })} />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground mb-1 block">Om bedriften</label>
              <RichTextEditor content={form.about_company || ""} onChange={v => setForm({ ...form, about_company: v })} />
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="text-[10px] text-muted-foreground mb-2">Kontaktperson</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input value={form.contact_name || ""} onChange={e => setForm({ ...form, contact_name: e.target.value })} placeholder="Navn" className={inputCls} />
              <input value={form.contact_title || ""} onChange={e => setForm({ ...form, contact_title: e.target.value })} placeholder="Tittel" className={inputCls} />
              <input value={form.contact_email || ""} onChange={e => setForm({ ...form, contact_email: e.target.value })} placeholder="E-post" className={inputCls} />
              <input value={form.contact_phone || ""} onChange={e => setForm({ ...form, contact_phone: e.target.value })} placeholder="Telefon" className={inputCls} />
            </div>
          </div>

          {/* Publish + save */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs">
              <input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} className="rounded" />
              Publiser umiddelbart
            </label>
            <div className="flex gap-2">
              <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="px-4 py-2 rounded-xl text-xs border border-border/30 hover:bg-muted/50">Avbryt</button>
              <button type="submit" disabled={saving} className="px-5 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-medium hover:opacity-90 disabled:opacity-50">
                {saving ? "Lagrer…" : editing ? "Oppdater" : "Opprett stilling"}
              </button>
            </div>
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
                    <p className="text-[11px] text-muted-foreground truncate">{job.category} · {job.location} · {job.work_location}</p>
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
                      images: job.images || [], highlights: job.highlights || [],
                    });
                    setShowForm(true);
                  }} className="text-muted-foreground hover:text-foreground transition-colors"><Edit2 size={13} /></button>
                  <button onClick={() => del(job.id)} className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={13} /></button>
                </div>
              </div>

              {viewApps === job.id && (
                <div className="border-t border-border/10 px-5 py-3 space-y-2 bg-muted/10">
                  <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground/60">Søknader</p>
                  {applications.filter(a => a.job_listing_id === job.id).map(app => (
                    <div key={app.id} className="flex items-center justify-between gap-3 py-2 border-b border-border/10 last:border-0">
                      <div className="min-w-0">
                        <p className="text-xs font-medium">{app.full_name}</p>
                        <p className="text-[10px] text-muted-foreground">{app.email} · {app.phone}</p>
                        {app.cv_file_name && (
                          <a href={app.cv_url || "#"} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] text-primary hover:underline mt-0.5">
                            <FileText size={10} /> {app.cv_file_name}
                          </a>
                        )}
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
      </>
      )}
    </div>
  );
};

export default JobListingsPanel;
