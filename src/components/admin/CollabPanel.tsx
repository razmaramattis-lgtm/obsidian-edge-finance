import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Edit2, Download, Building2, Phone, Mail, User, Globe, ImagePlus, X, CheckSquare, Square } from "lucide-react";
import { toast } from "sonner";

interface Agreement {
  id: string;
  title: string;
  description: string;
  partner: string;
  company: string;
  contact_name: string;
  phone: string;
  email: string;
  offering: string;
  file_url: string;
  file_name: string;
  logo_url: string | null;
  website: string | null;
  price: string | null;
  target_audience: string;
}

const emptyForm = { title: "", company: "", contact_name: "", phone: "", email: "", offering: "", description: "", partner: "", website: "", price: "", target_audience: "all" };

const CollabPanel = () => {
  const [items, setItems] = useState<Agreement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Agreement | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedLogo, setSelectedLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const logoRef = useRef<HTMLInputElement>(null);

  const fetchItems = async () => {
    const { data } = await supabase.from("collaboration_agreements").select("*").order("created_at", { ascending: false });
    setItems((data as Agreement[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const handleLogoSelect = (file: File | null) => {
    setSelectedLogo(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = e => setLogoPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setLogoPreview(null);
    }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    let fileData: { file_url?: string; file_name?: string } = {};
    let logoData: { logo_url?: string } = {};
    if (selectedFile) {
      const path = `collab/${Date.now()}-${selectedFile.name}`;
      const { data: ud } = await supabase.storage.from("internal-docs").upload(path, selectedFile);
      if (ud) fileData = { file_url: path, file_name: selectedFile.name };
    }
    if (selectedLogo) {
      const path = `collab/logos/${Date.now()}-${selectedLogo.name}`;
      const { data: ud } = await supabase.storage.from("internal-docs").upload(path, selectedLogo);
      if (ud) logoData = { logo_url: path };
    }
    const payload = { ...form, ...fileData, ...logoData };
    if (editing) {
      await supabase.from("collaboration_agreements").update(payload).eq("id", editing.id);
    } else {
      await supabase.from("collaboration_agreements").insert([payload]);
    }
    setShowForm(false); setEditing(null); setSelectedFile(null); setSelectedLogo(null); setLogoPreview(null);
    setForm(emptyForm);
    fetchItems();
    setUploading(false);
  };

  const del = async (id: string) => {
    if (!confirm("Slett samarbeidsavtale?")) return;
    await supabase.from("collaboration_agreements").delete().eq("id", id);
    fetchItems();
  };

  const bulkDelete = async () => {
    if (selected.size === 0) return;
    if (!confirm(`Slett ${selected.size} valgte avtaler?`)) return;
    setBulkDeleting(true);
    for (const id of selected) {
      await supabase.from("collaboration_agreements").delete().eq("id", id);
    }
    toast.success(`${selected.size} avtaler slettet`);
    setSelected(new Set());
    fetchItems();
    setBulkDeleting(false);
  };

  const toggleSelect = (id: string) => {
    setSelected(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  };

  const toggleAll = () => {
    setSelected(selected.size === items.length ? new Set() : new Set(items.map(i => i.id)));
  };

  const startEdit = (item: Agreement) => {
    document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' });
    setEditing(item);
    setForm({
      title: item.title || "", company: item.company || "", contact_name: item.contact_name || "",
      phone: item.phone || "", email: item.email || "", offering: item.offering || "",
      description: item.description || "", partner: item.partner || "",
      website: item.website || "", price: item.price || "", target_audience: item.target_audience || "all",
    });
    if (item.logo_url) {
      const { data } = supabase.storage.from("internal-docs").getPublicUrl(item.logo_url);
      setLogoPreview(data?.publicUrl || null);
    } else {
      setLogoPreview(null);
    }
    setShowForm(true);
  };

  if (loading) return <div className="text-muted-foreground text-sm">Laster…</div>;

  const inputCls = "w-full h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <p className="text-sm text-muted-foreground">{items.length} samarbeidsavtaler</p>
          {selected.size > 0 && (
            <button onClick={bulkDelete} disabled={bulkDeleting}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors disabled:opacity-50">
              <Trash2 size={13} /> Slett {selected.size} valgte
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          {items.length > 0 && (
            <button onClick={toggleAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs border border-border/30 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
              {selected.size === items.length ? <CheckSquare size={13} /> : <Square size={13} />}
              {selected.size === items.length ? "Fjern alle" : "Velg alle"}
            </button>
          )}
          <button onClick={() => { setShowForm(true); setEditing(null); setForm(emptyForm); setLogoPreview(null); setSelectedLogo(null); }}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm glow-rose hover:opacity-90">
            <Plus size={14} /> Ny avtale
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={save} className="glass rounded-2xl p-5 border border-border/20 space-y-3">
          <h3 className="font-medium text-sm mb-1">{editing ? "Rediger avtale" : "Ny samarbeidsavtale"}</h3>
          <div className="flex items-center gap-4">
            <div onClick={() => logoRef.current?.click()}
              className="w-16 h-16 rounded-xl border-2 border-dashed border-border/30 flex items-center justify-center cursor-pointer hover:border-primary/40 transition-colors overflow-hidden shrink-0 bg-muted/20">
              {logoPreview ? (
                <img src={logoPreview} alt="Logo" className="w-full h-full object-contain" />
              ) : (
                <ImagePlus size={20} className="text-muted-foreground" />
              )}
              <input ref={logoRef} type="file" className="hidden" accept="image/*" onChange={e => handleLogoSelect(e.target.files?.[0] || null)} />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium">Logo / bilde</p>
              <p className="text-[11px] text-muted-foreground">Klikk for å laste opp partnerlogo</p>
              {logoPreview && (
                <button type="button" onClick={() => { setSelectedLogo(null); setLogoPreview(null); }} className="text-[11px] text-destructive hover:underline mt-0.5">Fjern</button>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} placeholder="Firma *" required className={inputCls} />
            <input value={form.contact_name} onChange={e => setForm({ ...form, contact_name: e.target.value })} placeholder="Kontaktperson" className={inputCls} />
            <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Telefon" type="tel" className={inputCls} />
            <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="E-post" type="email" className={inputCls} />
            <input value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} placeholder="Nettside (f.eks. https://firma.no)" type="url" className={inputCls} />
          </div>
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Avtalenavn" required className={inputCls} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="Pris (valgfritt, f.eks. '20% rabatt')" className={inputCls} />
            <select value={form.target_audience} onChange={e => setForm({ ...form, target_audience: e.target.value })} className={inputCls}>
              <option value="all">Synlig for kunder og admin</option>
              <option value="admin_only">Kun synlig for admin/ansatte</option>
            </select>
          </div>
          <textarea value={form.offering} onChange={e => setForm({ ...form, offering: e.target.value })} placeholder="Hva tilbyr de? (tjenester, rabatter, produkter…)" rows={3}
            className="w-full rounded-xl border border-border/30 bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none" />
          <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Intern merknad (valgfritt)" className={inputCls} />
          <div onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-border/30 rounded-xl p-4 text-center cursor-pointer hover:border-primary/40 transition-colors">
            <p className="text-xs text-muted-foreground">{selectedFile ? selectedFile.name : "Last opp avtaledokument (PDF, Word…)"}</p>
            <input ref={fileRef} type="file" className="hidden" onChange={e => setSelectedFile(e.target.files?.[0] || null)} accept=".pdf,.doc,.docx" />
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={uploading} className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm hover:opacity-90 disabled:opacity-50">
              {uploading ? "Lagrer…" : "Lagre"}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); setLogoPreview(null); setSelectedLogo(null); }} className="px-4 py-2 rounded-xl text-sm border border-border/30 hover:bg-muted/50">Avbryt</button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {items.map(item => (
          <div key={item.id} className={`glass rounded-2xl px-5 py-4 border space-y-2 transition-colors ${
            selected.has(item.id) ? "border-primary/40 bg-primary/5" : "border-border/20"
          }`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-3 flex-1 min-w-0">
                <button onClick={() => toggleSelect(item.id)} className="text-muted-foreground hover:text-primary transition-colors shrink-0 mt-1">
                  {selected.has(item.id) ? <CheckSquare size={16} className="text-primary" /> : <Square size={16} />}
                </button>
                {item.logo_url ? (
                  <div className="w-10 h-10 rounded-lg border border-border/20 overflow-hidden shrink-0 bg-muted/20 flex items-center justify-center">
                    <LogoImage path={item.logo_url} />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-lg border border-border/10 bg-muted/20 flex items-center justify-center shrink-0">
                    <Building2 size={16} className="text-muted-foreground/40" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">{item.title}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-xs text-muted-foreground">
                    {item.company && <span className="flex items-center gap-1"><Building2 size={12} /> {item.company}</span>}
                    {item.contact_name && <span className="flex items-center gap-1"><User size={12} /> {item.contact_name}</span>}
                    {item.phone && <a href={`tel:${item.phone}`} className="flex items-center gap-1 hover:text-primary"><Phone size={12} /> {item.phone}</a>}
                    {item.email && <a href={`mailto:${item.email}`} className="flex items-center gap-1 hover:text-primary"><Mail size={12} /> {item.email}</a>}
                    {item.website && <a href={item.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary"><Globe size={12} /> Nettside</a>}
                  </div>
                  {item.offering && <p className="text-xs mt-2 text-foreground/80"><span className="text-muted-foreground">Tilbyr:</span> {item.offering}</p>}
                  {item.price && <p className="text-xs mt-1 text-primary font-medium">Pris: {item.price}</p>}
                  <div className="flex gap-2 mt-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${item.target_audience === "admin_only" ? "bg-orange-500/10 text-orange-500" : "bg-emerald-500/10 text-emerald-500"}`}>
                      {item.target_audience === "admin_only" ? "Kun admin/ansatte" : "Alle (inkl. kunder)"}
                    </span>
                  </div>
                  {item.description && <p className="text-xs text-muted-foreground mt-1 italic">{item.description}</p>}
                </div>
              </div>
              <div className="flex gap-2 shrink-0 pt-0.5">
                {item.file_url && <button onClick={async () => { const { data } = await supabase.storage.from("internal-docs").createSignedUrl(item.file_url, 3600); if (data?.signedUrl) window.open(data.signedUrl, "_blank"); }} className="text-muted-foreground hover:text-primary"><Download size={14} /></button>}
                <button onClick={() => startEdit(item)} className="text-muted-foreground hover:text-foreground"><Edit2 size={14} /></button>
                <button onClick={() => del(item.id)} className="text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const LogoImage = ({ path }: { path: string }) => {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    supabase.storage.from("internal-docs").createSignedUrl(path, 3600).then(({ data }) => {
      if (data?.signedUrl) setUrl(data.signedUrl);
    });
  }, [path]);
  if (!url) return <Building2 size={16} className="text-muted-foreground/40" />;
  return <img src={url} alt="Logo" className="w-full h-full object-contain" />;
};

export default CollabPanel;
