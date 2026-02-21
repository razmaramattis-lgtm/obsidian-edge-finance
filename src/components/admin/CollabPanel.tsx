import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Edit2, Download, Building2, Phone, Mail, User } from "lucide-react";

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
}

const emptyForm = { title: "", company: "", contact_name: "", phone: "", email: "", offering: "", description: "", partner: "" };

const CollabPanel = () => {
  const [items, setItems] = useState<Agreement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Agreement | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchItems = async () => {
    const { data } = await supabase.from("collaboration_agreements").select("*").order("created_at", { ascending: false });
    setItems((data as Agreement[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    let fileData: { file_url?: string; file_name?: string } = {};

    if (selectedFile) {
      const path = `collab/${Date.now()}-${selectedFile.name}`;
      const { data: ud } = await supabase.storage.from("internal-docs").upload(path, selectedFile);
      if (ud) {
        fileData = { file_url: path, file_name: selectedFile.name };
      }
    }

    if (editing) {
      await supabase.from("collaboration_agreements").update({ ...form, ...fileData }).eq("id", editing.id);
    } else {
      await supabase.from("collaboration_agreements").insert([{ ...form, ...fileData }]);
    }
    setShowForm(false); setEditing(null); setSelectedFile(null);
    setForm(emptyForm);
    fetchItems();
    setUploading(false);
  };

  const del = async (id: string) => {
    if (!confirm("Slett samarbeidsavtale?")) return;
    await supabase.from("collaboration_agreements").delete().eq("id", id);
    fetchItems();
  };

  const startEdit = (item: Agreement) => {
    setEditing(item);
    setForm({
      title: item.title || "",
      company: item.company || "",
      contact_name: item.contact_name || "",
      phone: item.phone || "",
      email: item.email || "",
      offering: item.offering || "",
      description: item.description || "",
      partner: item.partner || "",
    });
    setShowForm(true);
  };

  if (loading) return <div className="text-muted-foreground text-sm">Laster…</div>;

  const inputCls = "w-full h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{items.length} samarbeidsavtaler</p>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm(emptyForm); }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm glow-rose hover:opacity-90">
          <Plus size={14} /> Ny avtale
        </button>
      </div>

      {showForm && (
        <form onSubmit={save} className="glass rounded-2xl p-5 border border-border/20 space-y-3">
          <h3 className="font-medium text-sm mb-1">{editing ? "Rediger avtale" : "Ny samarbeidsavtale"}</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} placeholder="Firma *" required className={inputCls} />
            <input value={form.contact_name} onChange={e => setForm({ ...form, contact_name: e.target.value })} placeholder="Kontaktperson" className={inputCls} />
            <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Telefon" type="tel" className={inputCls} />
            <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="E-post" type="email" className={inputCls} />
          </div>

          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Avtalenavn" required className={inputCls} />
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
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="px-4 py-2 rounded-xl text-sm border border-border/30 hover:bg-muted/50">Avbryt</button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {items.map(item => (
          <div key={item.id} className="glass rounded-2xl px-5 py-4 border border-border/20 space-y-2">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">{item.title}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-xs text-muted-foreground">
                  {item.company && <span className="flex items-center gap-1"><Building2 size={12} /> {item.company}</span>}
                  {item.contact_name && <span className="flex items-center gap-1"><User size={12} /> {item.contact_name}</span>}
                  {item.phone && <a href={`tel:${item.phone}`} className="flex items-center gap-1 hover:text-primary"><Phone size={12} /> {item.phone}</a>}
                  {item.email && <a href={`mailto:${item.email}`} className="flex items-center gap-1 hover:text-primary"><Mail size={12} /> {item.email}</a>}
                </div>
                {item.offering && <p className="text-xs mt-2 text-foreground/80"><span className="text-muted-foreground">Tilbyr:</span> {item.offering}</p>}
                {item.description && <p className="text-xs text-muted-foreground mt-1 italic">{item.description}</p>}
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

export default CollabPanel;
