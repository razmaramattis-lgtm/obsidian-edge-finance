import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import DOMPurify from "dompurify";
import { FileText, Search, Download, Save, ChevronRight, Share2 } from "lucide-react";

const CustomerDocGeneratorPanel = () => {
  const { profile } = useAuth();
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [company, setCompany] = useState<any>(null);
  const [owners, setOwners] = useState<any[]>([]);
  const [board, setBoard] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [mergeValues, setMergeValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const docRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    const [tplRes, compRes] = await Promise.all([
      supabase.from("document_templates").select("*").eq("active", true).order("sort_order"),
      supabase.from("customer_companies").select("*").limit(1).maybeSingle(),
    ]);
    setTemplates(tplRes.data || []);
    if (compRes.data) {
      setCompany(compRes.data);
      const [ownRes, boardRes, contactRes] = await Promise.all([
        supabase.from("company_owners").select("*").eq("company_id", compRes.data.id).order("ownership_percent", { ascending: false }),
        supabase.from("company_board_members").select("*").eq("company_id", compRes.data.id),
        supabase.from("company_contacts").select("*").eq("company_id", compRes.data.id),
      ]);
      setOwners(ownRes.data || []);
      setBoard(boardRes.data || []);
      setContacts(contactRes.data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  // Build auto-fill map from company data
  const buildAutoFill = useCallback(() => {
    if (!company) return {};
    const map: Record<string, string> = {
      bedriftsnavn: company.company_name || "",
      firmanavn: company.company_name || "",
      selskapsnavn: company.company_name || "",
      organisasjonsnummer: company.org_number || "",
      "org.nr": company.org_number || "",
      orgnr: company.org_number || "",
      adresse: (company as any).address || "",
      postnummer: (company as any).postal_code || "",
      poststed: (company as any).city || "",
      sted: (company as any).city || "",
      land: (company as any).country || "",
      nettside: (company as any).website || "",
      telefon: company.contact_phone || "",
      selskapsform: (company as any).company_type || "",
      aksjekapital: (company as any).share_capital ? String((company as any).share_capital) : "",
      stiftelsesdato: (company as any).founding_date || "",
      revisor: (company as any).auditor || "",
      bransje: company.industry || "",
      dato: new Date().toLocaleDateString("no-NO"),
      "dagens dato": new Date().toLocaleDateString("no-NO"),
      år: String(new Date().getFullYear()),
    };
    // Owner info
    if (owners.length > 0) {
      map["eier"] = owners[0].name;
      map["eiernavn"] = owners[0].name;
      map["eier e-post"] = owners[0].email || "";
      map["eierandel"] = `${owners[0].ownership_percent}%`;
      map["alle eiere"] = owners.map(o => `${o.name} (${o.ownership_percent}%)`).join(", ");
    }
    // Board
    const styreleder = board.find(b => b.position === "Styreleder");
    if (styreleder) { map["styreleder"] = styreleder.name; map["styreleder e-post"] = styreleder.email || ""; }
    if (board.length > 0) map["styremedlemmer"] = board.map(b => `${b.name} (${b.position})`).join(", ");
    // Contact
    const primary = contacts.find(c => c.is_primary);
    if (primary) { map["kontaktperson"] = primary.name; map["kontakt e-post"] = primary.email || ""; map["kontakt telefon"] = primary.phone || ""; }
    else if (contacts.length > 0) { map["kontaktperson"] = contacts[0].name; }
    // Profile
    if (profile) { map["brukernavn"] = profile.name; map["bruker e-post"] = profile.email; }
    return map;
  }, [company, owners, board, contacts, profile]);

  const selectTemplate = (tpl: any) => {
    setSelectedTemplate(tpl);
    const autoFill = buildAutoFill();
    // Extract merge fields from content: {{field_name}}
    const fieldMatches = (tpl.content || "").match(/\{\{([^}]+)\}\}/g) || [];
    const fields = [...new Set(fieldMatches.map((m: string) => m.replace(/\{\{|\}\}/g, "").trim()))];
    const values: Record<string, string> = {};
    fields.forEach((f: string) => {
      const key = f.toLowerCase();
      values[f] = autoFill[key] || "";
    });
    setMergeValues(values);
  };

  const getRenderedContent = () => {
    if (!selectedTemplate) return "";
    let html = selectedTemplate.content || "";
    Object.entries(mergeValues).forEach(([key, value]) => {
      const regex = new RegExp(`\\{\\{\\s*${key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\}\\}`, "gi");
      html = html.replace(regex, value || `<span class="merge-field">[${key}]</span>`);
    });
    return html;
  };

  const handleSave = async (shareWithAdmin = false) => {
    if (!selectedTemplate || !company) return;
    setSaving(true);
    const html = getRenderedContent();
    const { error } = await supabase.from("customer_documents").upsert({
      company_id: company.id,
      title: selectedTemplate.title,
      description: selectedTemplate.description || null,
      category: selectedTemplate.category || "Dokumentgenerator",
      visibility: shareWithAdmin ? "shared" : "private",
    } as any, { onConflict: "company_id,title" });

    // Also save as handbook chapter for viewing
    await supabase.from("customer_handbook_chapters").upsert({
      company_id: company.id,
      title: selectedTemplate.title,
      content: html,
      customized: true,
      sort_order: 999,
    } as any, { onConflict: "company_id,title" });

    if (error) toast.error("Kunne ikke lagre"); else toast.success(shareWithAdmin ? "Lagret og delt med regnskapsfører" : "Dokument lagret i dokumentsenteret");
    setSaving(false);
  };

  const handleDownloadPdf = async () => {
    if (!selectedTemplate) return;
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const container = document.createElement("div");
      container.style.cssText = "width:210mm;padding:20mm;font-family:'Georgia','Times New Roman',serif;font-size:13px;line-height:1.7;color:#1a1a1a;";
      let logoHtml = "";
      if (company?.logo_url) {
        logoHtml = `<div style="text-align:center;margin-bottom:16px;"><img src="${company.logo_url}" alt="Logo" style="max-height:80px;max-width:200px;object-fit:contain;" /></div>`;
      }
      container.innerHTML = logoHtml + getRenderedContent();
      await html2pdf().set({
        margin: [15, 18, 15, 18],
        filename: `${selectedTemplate.title.replace(/\s+/g, "-")}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: "#ffffff" },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      }).from(container).save();
      toast.success("PDF lastet ned");
    } catch { toast.error("Kunne ikke generere PDF"); }
  };

  if (loading) return <div className="text-muted-foreground text-sm">Laster…</div>;

  // Template list view
  if (!selectedTemplate) {
    const filtered = search.trim()
      ? templates.filter(t => t.title.toLowerCase().includes(search.toLowerCase()) || (t.category || "").toLowerCase().includes(search.toLowerCase()))
      : templates;
    const categories = [...new Set(templates.map(t => t.category || "Generelt"))];

    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-heading text-xl">Dokumentgenerator</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Velg en mal og fyll inn informasjon. Bedriftsinformasjon hentes automatisk fra innstillingene.</p>
        </div>
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Søk i maler…"
            className="w-full h-10 rounded-xl border border-border/30 bg-muted/30 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
        </div>
        {filtered.length === 0 ? (
          <div className="glass rounded-2xl p-8 border border-border/20 text-center">
            <FileText size={32} className="text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Ingen dokumentmaler tilgjengelig ennå. Admin legger til maler med flettefelt.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {categories.map(cat => {
              const catTemplates = filtered.filter(t => (t.category || "Generelt") === cat);
              if (catTemplates.length === 0) return null;
              return (
                <div key={cat}>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/50 mt-4 mb-2 px-1">{cat}</p>
                  {catTemplates.map(tpl => (
                    <button key={tpl.id} onClick={() => selectTemplate(tpl)}
                      className="w-full glass rounded-2xl px-5 py-4 border border-border/20 flex items-center justify-between text-left hover:border-primary/30 transition-colors mb-2">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          <FileText size={16} className="text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{tpl.title}</p>
                          {tpl.description && <p className="text-xs text-muted-foreground mt-0.5">{tpl.description}</p>}
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-muted-foreground" />
                    </button>
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Template fill view
  const mergeFields = Object.keys(mergeValues);

  return (
    <div className="space-y-6">
      <button onClick={() => setSelectedTemplate(null)} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">← Tilbake til maler</button>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: merge fields */}
        <div className="w-full lg:w-80 shrink-0 space-y-4">
          <div className="glass rounded-2xl p-5 border border-border/20">
            <h3 className="font-medium text-sm mb-3">{selectedTemplate.title}</h3>
            {selectedTemplate.description && <p className="text-xs text-muted-foreground mb-4">{selectedTemplate.description}</p>}
            <p className="text-[10px] text-muted-foreground mb-3">Fyll inn feltene under. Informasjon hentes automatisk fra bedriftsinnstillinger.</p>
            <div className="space-y-3">
              {mergeFields.map(field => (
                <div key={field}>
                  <label className="text-xs text-muted-foreground mb-1 block">{field}</label>
                  <input
                    value={mergeValues[field]}
                    onChange={e => setMergeValues(v => ({ ...v, [field]: e.target.value }))}
                    className="w-full h-9 rounded-lg border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    placeholder={field}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <button onClick={() => handleSave(false)} disabled={saving} className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm hover:opacity-90 disabled:opacity-50">
              <Save size={14} /> {saving ? "Lagrer…" : "Lagre i dokumentsenteret"}
            </button>
            <button onClick={() => handleSave(true)} disabled={saving} className="flex items-center justify-center gap-2 px-4 py-2.5 border border-primary/30 text-primary rounded-xl text-sm hover:bg-primary/5 disabled:opacity-50">
              <Share2 size={14} /> Lagre og del med regnskapsfører
            </button>
            <button onClick={handleDownloadPdf} className="flex items-center justify-center gap-2 px-4 py-2.5 border border-border/30 rounded-xl text-sm hover:bg-muted/50">
              <Download size={14} /> Last ned PDF
            </button>
          </div>
        </div>

        {/* Right: preview */}
        <div className="flex-1 min-w-0">
          <div ref={docRef} className="glass rounded-2xl p-8 border border-border/20 bg-white min-h-[600px]">
            {company?.logo_url && (
              <div style={{ textAlign: "center", marginBottom: "16px" }}>
                <img src={company.logo_url} alt="Logo" style={{ maxHeight: "80px", maxWidth: "200px", margin: "0 auto", display: "block", objectFit: "contain" }} />
              </div>
            )}
            <div className="pdf-content" style={{ fontFamily: "'Georgia','Times New Roman',serif", fontSize: "13px", lineHeight: "1.7", color: "#1a1a1a" }}
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(getRenderedContent()) }} />
          </div>
        </div>
      </div>

      <style>{`
        .pdf-content h1 { font-size:22px;font-weight:bold;color:#000;margin:1em 0 0.5em;font-family:'Georgia',serif; }
        .pdf-content h2 { font-size:18px;font-weight:bold;color:#000;margin:1.5em 0 0.5em;padding-bottom:4px;border-bottom:1px solid #e0e0e0;font-family:'Georgia',serif; }
        .pdf-content h3 { font-size:14px;font-weight:bold;color:#1a1a1a;margin:1.2em 0 0.4em;font-family:'Georgia',serif; }
        .pdf-content p { font-size:13px;color:#333;line-height:1.7;margin:0.5em 0; }
        .pdf-content ul,.pdf-content ol { font-size:13px;color:#333;line-height:1.7;padding-left:1.5em;margin:0.5em 0; }
        .pdf-content li { margin-bottom:4px; }
        .pdf-content table { width:100%;border-collapse:collapse;margin:1em 0;font-size:12px; }
        .pdf-content table td,.pdf-content table th { padding:6px 8px;border-bottom:1px solid #e0e0e0;color:#333; }
        .pdf-content .merge-field { background:#fff3cd;color:#856404;padding:1px 6px;border-radius:3px;font-size:12px;font-weight:500;border:1px dashed #ffc107; }
      `}</style>
    </div>
  );
};

export default CustomerDocGeneratorPanel;
