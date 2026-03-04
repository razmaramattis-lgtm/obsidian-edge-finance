import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { asHtml2PdfOptions } from "@/lib/html2pdf";
import {
  Plus, Trash2, Download, Upload, FileText, Edit2, Search,
  X, Shield, Scale, AlertTriangle, ShieldCheck, Lock, Heart, Calculator, BookOpen, Briefcase
} from "lucide-react";
import HmsPanel from "./HmsPanel";
import JobListingsPanel from "./JobListingsPanel";
import DocumentGenerator from "@/components/kunde/DocumentGenerator";
import AnsettelsesKalkulator from "@/components/kunde/AnsettelsesKalkulator";
import { personalhandbokConfig } from "@/components/kunde/generators/personalhandbok";
import { arbeidsreglementConfig } from "@/components/kunde/generators/arbeidsreglement";
import { varslingsrutinerConfig } from "@/components/kunde/generators/varslingsrutiner";
import { gdprConfig } from "@/components/kunde/generators/gdpr";
import { digitalSikkerhetConfig } from "@/components/kunde/generators/digital-sikkerhet";
import { psykososialtConfig } from "@/components/kunde/generators/psykososialt";

// ── Types ──
interface HrResource {
  id: string;
  title: string;
  description: string;
  category: string;
  file_url: string;
  file_name: string;
}

// ── Constants ──
const DOC_CATS = ["Ansettelse", "Kontrakter", "Personalhåndbok", "Rutiner", "Opplæring", "HR-Personalhåndbok", "HR-Arbeidsreglement", "HR-Varslingsrutiner", "HR-GDPR", "HR-DIGIS", "HR-Psykososialt", "Annet"];

type Tab = "hms" | "documents" | "job-listings" | "personalhandbok" | "arbeidsreglement" | "varslingsrutiner" | "gdpr" | "digital-sikkerhet" | "psykososialt" | "calculator";

const HR_TABS: { id: Tab; label: string; icon: React.ElementType; group: string }[] = [
  { id: "hms", label: "HMS-håndbok", icon: Shield, group: "Håndbøker" },
  { id: "documents", label: "HR-dokumenter", icon: FileText, group: "Håndbøker" },
  { id: "job-listings", label: "Stillingsannonser", icon: Briefcase, group: "Rekruttering" },
  { id: "personalhandbok", label: "Personalhåndbok", icon: BookOpen, group: "Generatorer" },
  { id: "arbeidsreglement", label: "Arbeidsreglement", icon: Scale, group: "Generatorer" },
  { id: "varslingsrutiner", label: "Varslingsrutiner", icon: AlertTriangle, group: "Generatorer" },
  { id: "gdpr", label: "GDPR & Personvern", icon: ShieldCheck, group: "Generatorer" },
  { id: "digital-sikkerhet", label: "Digital Sikkerhet", icon: Lock, group: "Generatorer" },
  { id: "psykososialt", label: "Psykososialt Arbeidsmiljø", icon: Heart, group: "Generatorer" },
  { id: "calculator", label: "Ansettelseskalkulator", icon: Calculator, group: "Verktøy" },
];

const HrPanel = () => {
  const { isAdmin } = useAuth();
  const [tab, setTab] = useState<Tab>("hms");

  const groups = [...new Set(HR_TABS.map(t => t.group))];

  const renderTab = () => {
    switch (tab) {
      case "hms": return <HmsPanel />;
      case "documents": return <DocumentsTab isAdmin={isAdmin} />;
      case "job-listings": return <JobListingsPanel />;
      case "personalhandbok": return <DocumentGenerator config={personalhandbokConfig} />;
      case "arbeidsreglement": return <DocumentGenerator config={arbeidsreglementConfig} />;
      case "varslingsrutiner": return <DocumentGenerator config={varslingsrutinerConfig} />;
      case "gdpr": return <DocumentGenerator config={gdprConfig} />;
      case "digital-sikkerhet": return <DocumentGenerator config={digitalSikkerhetConfig} />;
      case "psykososialt": return <DocumentGenerator config={psykososialtConfig} />;
      case "calculator": return <AnsettelsesKalkulator />;
      default: return null;
    }
  };

  return (
    <div className="space-y-5">
      {/* Header – horizontal */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Shield size={18} className="text-primary" strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-sm font-medium">HR & Personal</p>
          <p className="text-[10px] text-muted-foreground">HMS-håndbok, dokumentgeneratorer og verktøy</p>
        </div>
      </div>

      {/* Categories listed vertically, items within each wrap horizontally */}
      <div className="space-y-3">
        {groups.map(group => (
          <div key={group} className="glass rounded-xl border border-border/10 p-3">
            <p className="text-[9px] tracking-[0.3em] uppercase text-muted-foreground/50 mb-2 px-1">{group}</p>
            <div className="flex flex-wrap gap-1.5">
              {HR_TABS.filter(t => t.group === group).map(t => {
                const Icon = t.icon;
                const active = tab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all whitespace-nowrap ${
                      active ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                    }`}
                  >
                    <Icon size={12} />
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Content */}
      {renderTab()}
    </div>
  );
};

// HandbookTab removed – content now flows through generators into HMS-håndbok

// ══════════════════════════════════════
//  HR Documents Tab (unchanged)
// ══════════════════════════════════════
const DocumentsTab = ({ isAdmin }: { isAdmin: boolean }) => {
  const [items, setItems] = useState<HrResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<HrResource | null>(null);
  const [form, setForm] = useState({ title: "", description: "", category: "Ansettelse" });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchItems = async () => {
    const { data: all } = await supabase.from("internal_resources").select("*").order("created_at", { ascending: false });
    setItems((all as HrResource[])?.filter(r => DOC_CATS.includes(r.category)) || []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    let fileData: { file_url?: string; file_name?: string } = {};
    if (selectedFile) {
      const path = `hr/${Date.now()}-${selectedFile.name}`;
      const { data: ud } = await supabase.storage.from("internal-docs").upload(path, selectedFile);
      if (ud) fileData = { file_url: path, file_name: selectedFile.name };
    }
    if (editing) {
      await supabase.from("internal_resources").update({ ...form, ...fileData }).eq("id", editing.id);
    } else {
      await supabase.from("internal_resources").insert([{ ...form, ...fileData }]);
    }
    setShowForm(false); setEditing(null); setSelectedFile(null);
    setForm({ title: "", description: "", category: "Ansettelse" });
    fetchItems(); setUploading(false);
  };

  const del = async (id: string) => {
    if (!confirm("Slett HR-dokument?")) return;
    await supabase.from("internal_resources").delete().eq("id", id);
    fetchItems();
  };

  const filtered = items.filter(i =>
    i.title.toLowerCase().includes(search.toLowerCase()) ||
    (i.description || "").toLowerCase().includes(search.toLowerCase()) ||
    i.category.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = DOC_CATS.reduce((acc, cat) => {
    acc[cat] = filtered.filter(i => i.category === cat);
    return acc;
  }, {} as Record<string, HrResource[]>);

  if (loading) return <div className="text-muted-foreground text-sm">Laster…</div>;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-xs">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Søk i dokumenter…"
            className="w-full h-9 pl-8 pr-3 rounded-xl border border-border/20 bg-muted/20 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">{items.length} dokumenter</span>
          {isAdmin && (
            <button onClick={() => { setShowForm(true); setEditing(null); setForm({ title: "", description: "", category: "Ansettelse" }); }}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-xs hover:opacity-90">
              <Upload size={13} /> Last opp
            </button>
          )}
        </div>
      </div>

      {showForm && isAdmin && (
        <form onSubmit={save} className="glass rounded-2xl p-5 border border-border/20 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-sm">{editing ? "Rediger" : "Nytt"} HR-dokument</h3>
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="text-muted-foreground hover:text-foreground">
              <X size={16} />
            </button>
          </div>
          <div onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-border/30 rounded-xl p-6 text-center cursor-pointer hover:border-primary/40 transition-colors">
            <FileText size={24} className="mx-auto text-muted-foreground mb-2" strokeWidth={1.5} />
            <p className="text-xs text-muted-foreground">{selectedFile ? selectedFile.name : "Klikk for å velge fil"}</p>
            <input ref={fileRef} type="file" className="hidden" onChange={e => setSelectedFile(e.target.files?.[0] || null)} />
          </div>
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Tittel" required
            className="w-full h-9 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
            className="w-full h-9 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
            {DOC_CATS.map(c => <option key={c}>{c}</option>)}
          </select>
          <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Beskrivelse (valgfritt)"
            className="w-full h-9 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
          <div className="flex gap-2">
            <button type="submit" disabled={uploading || (!selectedFile && !editing)} className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-xs hover:opacity-90 disabled:opacity-50">
              {uploading ? "Lagrer…" : "Lagre"}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="px-4 py-2 rounded-xl text-xs border border-border/30 hover:bg-muted/50">Avbryt</button>
          </div>
        </form>
      )}

      <div className="space-y-5">
        {DOC_CATS.filter(cat => grouped[cat]?.length > 0).map(cat => (
          <div key={cat}>
            <h3 className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground/60 mb-2">{cat}</h3>
            <div className="space-y-1.5">
              {grouped[cat].map(item => (
                <div key={item.id} className="glass rounded-2xl px-5 py-3 border border-border/20 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText size={16} className="text-primary shrink-0" strokeWidth={1.5} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{item.title}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{item.file_name}{item.description ? ` · ${item.description}` : ""}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {item.file_url ? (
                      <button onClick={async () => {
                        const { data } = await supabase.storage.from("internal-docs").createSignedUrl(item.file_url, 3600);
                        if (data?.signedUrl) window.open(data.signedUrl, "_blank");
                      }} className="text-muted-foreground hover:text-primary transition-colors" title="Last ned fil">
                        <Download size={13} />
                      </button>
                    ) : (
                      <button onClick={async () => {
                        // Generate PDF from HMS chapters for this generator
                        try {
                          const prefix = `${item.title}:`;
                          const { data: chapters } = await supabase
                            .from("hms_documents")
                            .select("title, content")
                            .like("title", `${prefix}%`)
                            .order("sort_order");
                          
                          if (!chapters || chapters.length === 0) {
                            const { toast } = await import("sonner");
                            toast.error("Ingen kapitler funnet for dette dokumentet");
                            return;
                          }

                          const html2pdf = (await import("html2pdf.js")).default;
                          const container = document.createElement("div");
                          container.style.cssText = "font-family:'Georgia',serif;font-size:13px;line-height:1.8;color:#1a1a1a;";
                          
                          // Title page
                          container.innerHTML = `
                            <div style="text-align:center;margin-bottom:2.5em;padding-bottom:1.5em;border-bottom:2px solid #333;">
                              <h1 style="font-size:24px;font-weight:bold;color:#000;margin-bottom:8px;">${item.title}</h1>
                              <p style="font-size:11px;color:#888;margin-top:8px;">${new Date().toLocaleDateString("nb-NO", { year: "numeric", month: "long", day: "numeric" })}</p>
                            </div>
                            <div style="margin-bottom:2em;padding-bottom:1.5em;border-bottom:1px solid #ddd;">
                              <h2 style="font-size:16px;font-weight:bold;color:#000;margin-bottom:12px;">Innholdsfortegnelse</h2>
                              <ol style="padding-left:1.5em;color:#333;font-size:12px;line-height:2.2;">
                                ${chapters.map(c => `<li>${c.title.replace(`${prefix} `, "")}</li>`).join("")}
                              </ol>
                            </div>
                          `;
                          
                          chapters.forEach((ch, i) => {
                            const chTitle = ch.title.replace(`${prefix} `, "");
                            container.innerHTML += `
                              <div style="${i > 0 ? 'page-break-before:always;' : ''}">
                                <h2 style="font-size:18px;font-weight:bold;color:#000;margin-bottom:12px;">${chTitle}</h2>
                                ${ch.content || ""}
                              </div>
                              ${i < chapters.length - 1 ? '<hr style="margin:2em 0;border:none;border-top:1px solid #ddd;" />' : ""}
                            `;
                          });

                          container.innerHTML += `<div style="margin-top:3em;padding-top:1em;border-top:2px solid #333;text-align:center;font-size:10px;color:#888;"><p>${item.title} — Konfidensielt</p></div>`;

                          container.style.cssText += "position:absolute;left:-9999px;top:0;width:794px;background:#fff;z-index:-1;padding:20px;";
                          document.body.appendChild(container);
                          
                          await html2pdf().set(asHtml2PdfOptions({
                            margin: [15, 18, 15, 18],
                            filename: `${item.title}.pdf`,
                            image: { type: "jpeg", quality: 0.98 },
                            html2canvas: { scale: 2, backgroundColor: "#ffffff", useCORS: true, logging: false, windowWidth: 794 },
                            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
                            pagebreak: { mode: ["avoid-all", "css", "legacy"] },
                          })).from(container).save();
                          
                          document.body.removeChild(container);
                        } catch {
                          const { toast } = await import("sonner");
                          toast.error("Kunne ikke generere PDF");
                        }
                      }} className="text-muted-foreground hover:text-primary transition-colors" title="Last ned PDF">
                        <Download size={13} />
                      </button>
                    )}
                    {isAdmin && (
                      <>
                        <button onClick={() => { setEditing(item); setForm({ title: item.title, description: item.description || "", category: item.category }); setShowForm(true); }}
                          className="text-muted-foreground hover:text-foreground transition-colors"><Edit2 size={13} /></button>
                        <button onClick={() => del(item.id)} className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={13} /></button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">Ingen dokumenter funnet</p>
        )}
      </div>
    </div>
  );
};

export default HrPanel;
