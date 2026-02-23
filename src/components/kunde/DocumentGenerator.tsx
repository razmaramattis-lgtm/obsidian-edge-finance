import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save, Download, ChevronDown, ChevronRight, FileText,
  CheckCircle2, AlertCircle, Eye, EyeOff, PanelLeftClose, PanelLeft, Info, ImagePlus, X
} from "lucide-react";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import DOMPurify from "dompurify";
import type { GeneratorConfig } from "./generators/types";

interface Props {
  config: GeneratorConfig;
}

const DocumentGenerator = ({ config }: Props) => {
  const { profile } = useAuth();
  const [form, setForm] = useState<Record<string, any>>(config.defaultValues);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [activeSection, setActiveSection] = useState<string>(config.sections[0]?.id || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const docRef = useRef<HTMLDivElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const groups: Record<string, boolean> = {};
    config.fieldGroups.forEach((g, i) => { groups[g.title] = i < 3; });
    setExpandedGroups(groups);
  }, [config]);

  useEffect(() => {
    const loadCompany = async () => {
      const { data } = await supabase
        .from("customer_companies")
        .select("id, company_name, org_number, industry, logo_url")
        .limit(1)
        .maybeSingle();
      if (data) {
        setCompanyId(data.id);
        setForm(prev => ({
          ...prev,
          companyName: prev.companyName || data.company_name || "",
          orgNumber: prev.orgNumber || data.org_number || "",
          industry: prev.industry || data.industry || "",
        }));
        // Auto-load company logo from settings
        if (data.logo_url && !logoDataUrl) {
          setLogoDataUrl(data.logo_url);
        }
      }
    };
    loadCompany();
  }, []);

  const updateField = useCallback((id: string, value: any) => {
    setForm(prev => ({ ...prev, [id]: value }));
    setSaved(false);
  }, []);

  const toggleGroup = useCallback((title: string) => {
    setExpandedGroups(prev => ({ ...prev, [title]: !prev[title] }));
  }, []);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Velg en bildefil (PNG, JPG, SVG)");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Logo må være under 2 MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setLogoDataUrl(reader.result as string);
      toast.success("Logo lastet opp");
    };
    reader.readAsDataURL(file);
    if (logoInputRef.current) logoInputRef.current.value = "";
  };

  const buildFullHtml = useCallback(() => {
    const date = new Date().toLocaleDateString("nb-NO", { year: "numeric", month: "long", day: "numeric" });
    let html = `<div style="text-align:center;margin-bottom:2.5em;padding-bottom:1.5em;border-bottom:2px solid #333;">`;
    if (logoDataUrl) {
      html += `<div style="margin-bottom:16px;"><img src="${logoDataUrl}" alt="Logo" style="max-height:80px;max-width:200px;margin:0 auto;display:block;object-fit:contain;" /></div>`;
    }
    html += `<h1 style="font-size:24px;font-weight:bold;color:#000;margin-bottom:8px;font-family:'Georgia',serif;">${config.title}</h1>
      <p style="font-size:13px;color:#555;margin:4px 0;">${form.companyName || "[Bedriftsnavn]"}</p>
      ${form.orgNumber ? `<p style="font-size:11px;color:#888;">Org.nr. ${form.orgNumber}</p>` : ""}
      <p style="font-size:11px;color:#888;margin-top:8px;">${date}</p>
    </div>`;
    html += `<div style="margin-bottom:2em;padding-bottom:1.5em;border-bottom:1px solid #ddd;">
      <h2 style="font-size:16px;font-weight:bold;color:#000;margin-bottom:12px;">Innholdsfortegnelse</h2>
      <ol style="padding-left:1.5em;color:#333;font-size:12px;line-height:2.2;">
        ${config.sections.map(s => `<li>${s.title}</li>`).join("")}
      </ol>
    </div>`;
    config.sections.forEach((section, i) => {
      html += `<div style="${i > 0 ? 'page-break-before:always;' : ''}">${section.content(form)}</div>`;
      if (i < config.sections.length - 1) html += `<hr style="margin:2em 0;border:none;border-top:1px solid #ddd;" />`;
    });
    html += `<div style="margin-top:3em;padding-top:1em;border-top:2px solid #333;text-align:center;font-size:10px;color:#888;">
      <p>${config.title} — ${form.companyName || "[Bedriftsnavn]"} — Konfidensielt</p>
    </div>`;
    return html;
  }, [config, form]);

  const handleSave = async () => {
    if (!companyId) {
      toast.error("Ingen bedrift funnet");
      return;
    }
    setSaving(true);
    try {
      const fullHtml = buildFullHtml();
      const docTitle = config.title;

      // Upsert one single document entry
      const { data: existingDoc } = await supabase
        .from("customer_documents")
        .select("id")
        .eq("company_id", companyId)
        .eq("title", docTitle)
        .eq("category", config.documentCategory)
        .maybeSingle();

      if (existingDoc) {
        await supabase.from("customer_documents").update({
          description: `Komplett ${config.title}`,
          file_name: `${docTitle}.html`,
          updated_at: new Date().toISOString(),
        }).eq("id", existingDoc.id);
      } else {
        await supabase.from("customer_documents").insert({
          company_id: companyId,
          title: docTitle,
          description: `Komplett ${config.title}`,
          category: config.documentCategory,
          file_name: `${docTitle}.html`,
          visibility: "private",
        });
      }

      // Save full combined content as one handbook chapter
      const { data: existingChapter } = await supabase
        .from("customer_handbook_chapters")
        .select("id")
        .eq("company_id", companyId)
        .eq("title", docTitle)
        .maybeSingle();

      if (existingChapter) {
        await supabase.from("customer_handbook_chapters")
          .update({ content: fullHtml })
          .eq("id", existingChapter.id);
      } else {
        await supabase.from("customer_handbook_chapters").insert({
          company_id: companyId,
          title: docTitle,
          content: fullHtml,
          sort_order: 0,
        });
      }

      // Auto-publish each section as individual chapters to HMS-håndbok (with HTML)
      const prefix = `${config.title}`;
      
      // Delete old HMS chapters for this generator
      const { data: oldHmsDocs } = await supabase
        .from("hms_documents")
        .select("id, title")
        .like("title", `${prefix}:%`);
      
      // Also delete legacy single-entry
      const { data: legacyDoc } = await supabase
        .from("hms_documents")
        .select("id")
        .eq("title", prefix)
        .maybeSingle();
      
      const idsToDelete = [
        ...(oldHmsDocs?.map(d => d.id) || []),
        ...(legacyDoc ? [legacyDoc.id] : []),
      ];
      if (idsToDelete.length > 0) {
        await supabase.from("hms_documents").delete().in("id", idsToDelete);
      }

      // Get current max sort_order
      const { data: maxDoc } = await supabase
        .from("hms_documents")
        .select("sort_order")
        .order("sort_order", { ascending: false })
        .limit(1)
        .maybeSingle();
      let nextOrder = (maxDoc?.sort_order || 0) + 1;

      // Insert each section as a separate HMS chapter (keep HTML for rich rendering)
      for (const section of config.sections) {
        const sectionHtml = section.content(form);
        await supabase.from("hms_documents").insert({
          title: `${prefix}: ${section.title}`,
          content: sectionHtml,
          sort_order: nextOrder,
        });
        nextOrder++;
      }

      // Generate a real PDF and upload to storage
      const hrDocTitle = config.title;
      const hrCategory = config.documentCategory || "Personalhåndbok";
      let uploadedFileUrl = "";
      try {
        const html2pdf = (await import("html2pdf.js")).default;
        const container = document.createElement("div");
        container.style.cssText = "position:absolute;left:-9999px;top:0;width:794px;background:#fff;color:#000;z-index:-1;padding:20px;font-family:'Georgia',serif;font-size:13px;line-height:1.8;";
        container.innerHTML = fullHtml;
        container.querySelectorAll("*").forEach((el) => {
          const htmlEl = el as HTMLElement;
          htmlEl.style.backgroundColor = "transparent";
          htmlEl.style.color = htmlEl.style.color || "#1a1a1a";
        });
        container.style.backgroundColor = "#ffffff";
        document.body.appendChild(container);

        // Allow DOM to fully render before capturing
        await new Promise(r => setTimeout(r, 500));

        const pdfBlob: Blob = await html2pdf()
          .set({
            margin: [15, 18, 15, 18],
            filename: `${hrDocTitle}.pdf`,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2, backgroundColor: "#ffffff", useCORS: true, logging: false, windowWidth: 794 },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
            pagebreak: { mode: ["avoid-all", "css", "legacy"] },
          })
          .from(container)
          .output("blob");

        document.body.removeChild(container);

        // Upload PDF to storage
        const storagePath = `hr/${Date.now()}-${hrDocTitle.replace(/[^a-zA-ZæøåÆØÅ0-9]/g, "_")}.pdf`;
        const { data: uploadData } = await supabase.storage
          .from("internal-docs")
          .upload(storagePath, pdfBlob, { contentType: "application/pdf", upsert: false });
        if (uploadData) {
          uploadedFileUrl = storagePath;
        }
      } catch (pdfErr) {
        console.error("PDF upload error:", pdfErr);
      }

      // Save to HR-dokumenter (internal_resources) for the admin HR panel
      const { data: existingHrDoc } = await supabase
        .from("internal_resources")
        .select("id")
        .eq("title", hrDocTitle)
        .eq("category", hrCategory)
        .maybeSingle();

      const hrPayload: Record<string, string> = {
        description: `Generert ${new Date().toLocaleDateString("nb-NO")}`,
        file_name: `${hrDocTitle}.pdf`,
      };
      if (uploadedFileUrl) {
        hrPayload.file_url = uploadedFileUrl;
      }

      if (existingHrDoc) {
        await supabase.from("internal_resources")
          .update({ ...hrPayload, updated_at: new Date().toISOString() })
          .eq("id", existingHrDoc.id);
      } else {
        await supabase.from("internal_resources").insert({
          title: hrDocTitle,
          category: hrCategory,
          ...hrPayload,
        });
      }

      setSaved(true);
      toast.success(`${config.title} lagret og publisert til HMS-håndbok`);
    } catch (e) {
      toast.error("Kunne ikke lagre");
    }
    setSaving(false);
  };

  const handleDownloadPdf = async () => {
    setDownloading(true);
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const filename = `${config.title} - ${form.companyName || "Bedrift"}.pdf`;

      // Build clean HTML with all inline styles (same as handleSave)
      const fullHtml = buildFullHtml();
      const container = document.createElement("div");
      container.style.cssText = "position:absolute;left:-9999px;top:0;width:794px;background:#fff;color:#000;z-index:-1;padding:20px;font-family:'Georgia',serif;font-size:13px;line-height:1.8;";
      container.innerHTML = fullHtml;
      container.style.backgroundColor = "#ffffff";
      document.body.appendChild(container);

      // Allow DOM to fully render before capturing
      await new Promise(r => setTimeout(r, 500));

      await html2pdf()
        .set({
          margin: [15, 18, 15, 18],
          filename,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: {
            scale: 2,
            backgroundColor: "#ffffff",
            useCORS: true,
            logging: false,
            windowWidth: 794,
          },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
          pagebreak: { mode: ["avoid-all", "css", "legacy"] },
        })
        .from(container)
        .save();

      document.body.removeChild(container);
      toast.success("PDF lastet ned");
    } catch (err) {
      console.error("PDF error:", err);
      toast.error("Kunne ikke generere PDF — prøv igjen");
    }
    setDownloading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)]">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 pb-4 border-b border-border/10 mb-4 flex-wrap">
        <div>
          <h2 className="font-heading text-xl">{config.title}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{config.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs rounded-xl border border-border/20 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showForm ? <PanelLeftClose size={14} /> : <PanelLeft size={14} />}
            {showForm ? "Skjul skjema" : "Vis skjema"}
          </button>
          
          {/* Logo upload */}
          <input
            ref={logoInputRef}
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="hidden"
          />
          <button
            onClick={() => logoInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs rounded-xl border border-border/20 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ImagePlus size={14} />
            {logoDataUrl ? "Bytt logo" : "Last opp logo"}
          </button>
          {logoDataUrl && (
            <button
              onClick={() => { setLogoDataUrl(null); toast.info("Logo fjernet"); }}
              className="inline-flex items-center gap-1.5 px-2 py-2 text-xs rounded-xl border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors"
              title="Fjern logo"
            >
              <X size={14} />
            </button>
          )}
          
          <button
            onClick={handleDownloadPdf}
            disabled={downloading}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs rounded-xl border border-border/20 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          >
            {downloading ? <span className="animate-spin">⏳</span> : <Download size={14} />}
            {downloading ? "Genererer…" : "Last ned PDF"}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? (
              <span className="animate-spin">⏳</span>
            ) : saved ? (
              <CheckCircle2 size={14} />
            ) : (
              <Save size={14} />
            )}
            {saving ? "Lagrer…" : saved ? "Lagret & publisert" : "Lagre & publiser"}
          </button>
        </div>
      </div>

      {/* Split view */}
      <div className="flex-1 flex gap-4 overflow-hidden">
        {/* Form panel */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "35%", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-y-auto shrink-0 pr-3 space-y-2"
            >
              {config.fieldGroups.map(group => (
                <div key={group.title} className="glass rounded-xl border border-border/10">
                  <button
                    onClick={() => toggleGroup(group.title)}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium hover:bg-muted/30 transition-colors rounded-xl"
                  >
                    <span>{group.title}</span>
                    {expandedGroups[group.title] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </button>
                  <AnimatePresence>
                    {expandedGroups[group.title] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 space-y-3">
                          {group.description && (
                            <p className="text-[10px] text-muted-foreground/60">{group.description}</p>
                          )}
                          {group.fields.map(field => (
                            <div key={field.id} className="relative">
                              <div className="flex items-center gap-1.5 mb-1">
                                <label className="text-[11px] font-medium text-muted-foreground">
                                  {field.label}
                                </label>
                                {field.helpText && field.type !== "checkbox" && (
                                  <TooltipProvider delayDuration={100}>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <button
                                          type="button"
                                          className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-muted/40 hover:bg-primary/20 text-muted-foreground/60 hover:text-primary transition-colors shrink-0"
                                        >
                                          <Info size={10} />
                                        </button>
                                      </TooltipTrigger>
                                      <TooltipContent 
                                        side="bottom" 
                                        align="start"
                                        sideOffset={4}
                                        className="max-w-[calc(100%-2rem)] w-[320px] text-xs leading-relaxed p-3 z-50"
                                      >
                                        {field.helpText}
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                )}
                              </div>
                              {field.type === "text" && (
                                <input
                                  value={form[field.id] ?? ""}
                                  onChange={e => updateField(field.id, e.target.value)}
                                  placeholder={field.placeholder}
                                  className="w-full h-8 rounded-lg border border-border/30 bg-muted/20 px-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary/40"
                                />
                              )}
                              {field.type === "number" && (
                                <input
                                  type="number"
                                  value={form[field.id] ?? ""}
                                  onChange={e => updateField(field.id, e.target.value)}
                                  placeholder={field.placeholder}
                                  className="w-full h-8 rounded-lg border border-border/30 bg-muted/20 px-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary/40"
                                />
                              )}
                              {field.type === "textarea" && (
                                <textarea
                                  value={form[field.id] ?? ""}
                                  onChange={e => updateField(field.id, e.target.value)}
                                  placeholder={field.placeholder}
                                  rows={3}
                                  className="w-full rounded-lg border border-border/30 bg-muted/20 px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary/40 resize-none"
                                />
                              )}
                              {field.type === "select" && (
                                <select
                                  value={form[field.id] ?? ""}
                                  onChange={e => updateField(field.id, e.target.value)}
                                  className="w-full h-8 rounded-lg border border-border/30 bg-muted/20 px-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary/40"
                                >
                                  {field.options?.map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                  ))}
                                </select>
                              )}
                              {field.type === "checkbox" && (
                                <label className="flex items-start gap-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={!!form[field.id]}
                                    onChange={e => updateField(field.id, e.target.checked)}
                                    className="rounded border-border/30 mt-0.5"
                                  />
                                  <span className="text-xs text-muted-foreground flex-1">{field.helpText || "Ja"}</span>
                                  {field.helpText && (
                                    <TooltipProvider delayDuration={100}>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <button
                                            type="button"
                                            className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-muted/40 hover:bg-primary/20 text-muted-foreground/60 hover:text-primary transition-colors shrink-0"
                                          >
                                            <Info size={10} />
                                          </button>
                                        </TooltipTrigger>
                                        <TooltipContent 
                                          side="bottom" 
                                          align="start"
                                          sideOffset={4}
                                          className="max-w-[calc(100%-2rem)] w-[320px] text-xs leading-relaxed p-3 z-50"
                                        >
                                          {field.helpText}
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  )}
                                </label>
                              )}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Document preview */}
        <div className="flex-1 overflow-y-auto">
          {/* Section nav */}
          <div className="flex flex-wrap gap-1.5 mb-4 sticky top-0 z-10 bg-background/80 backdrop-blur py-2">
            {config.sections.map(s => (
              <button
                key={s.id}
                onClick={() => {
                  setActiveSection(s.id);
                  document.getElementById(`section-${s.id}`)?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`text-[10px] tracking-wide px-2.5 py-1 rounded-lg border transition-colors ${
                  activeSection === s.id
                    ? "bg-primary/10 text-primary border-primary/30"
                    : "border-border/20 text-muted-foreground hover:border-primary/20"
                }`}
              >
                {s.title}
              </button>
            ))}
          </div>

          {/* Document content — styled for proper PDF output */}
          <div
            ref={docRef}
            className="rounded-2xl border border-border/10 p-6 md:p-8 lg:p-10"
            style={{ backgroundColor: "#ffffff", color: "#000000" }}
          >
            <div
              className="max-w-none"
              style={{
                fontFamily: "'Georgia', 'Times New Roman', serif",
                fontSize: "13px",
                lineHeight: "1.7",
                color: "#1a1a1a",
              }}
            >
              {/* Document title page */}
              <div style={{ textAlign: "center", marginBottom: "2.5em", paddingBottom: "1.5em", borderBottom: "2px solid #333" }}>
                {logoDataUrl && (
                  <div style={{ marginBottom: "16px" }}>
                    <img
                      src={logoDataUrl}
                      alt="Bedriftslogo"
                      style={{ maxHeight: "80px", maxWidth: "200px", margin: "0 auto", display: "block", objectFit: "contain" }}
                    />
                  </div>
                )}
                <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#000", marginBottom: "8px", fontFamily: "'Georgia', serif" }}>
                  {config.title}
                </h1>
                <p style={{ fontSize: "13px", color: "#555", margin: "4px 0" }}>
                  {form.companyName || "[Bedriftsnavn]"}
                </p>
                {form.orgNumber && (
                  <p style={{ fontSize: "11px", color: "#888" }}>Org.nr. {form.orgNumber}</p>
                )}
                <p style={{ fontSize: "11px", color: "#888", marginTop: "8px" }}>
                  {new Date().toLocaleDateString("nb-NO", { year: "numeric", month: "long", day: "numeric" })}
                </p>
              </div>

              {/* Table of contents with hyperlinks */}
              <div style={{ marginBottom: "2em", paddingBottom: "1.5em", borderBottom: "1px solid #ddd" }}>
                <h2 style={{ fontSize: "16px", fontWeight: "bold", color: "#000", marginBottom: "12px" }}>Innholdsfortegnelse</h2>
                <ol style={{ paddingLeft: "1.5em", color: "#333", fontSize: "12px", lineHeight: "2.2" }}>
                  {config.sections.map((s, i) => (
                    <li key={s.id}>
                      <a
                        href={`#pdf-section-${s.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          document.getElementById(`section-${s.id}`)?.scrollIntoView({ behavior: "smooth" });
                          setActiveSection(s.id);
                        }}
                        style={{
                          color: "#1a56db",
                          textDecoration: "underline",
                          textUnderlineOffset: "2px",
                          cursor: "pointer",
                        }}
                      >
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Sections */}
              {config.sections.map((section, i) => (
                <div
                  key={section.id}
                  id={`section-${section.id}`}
                  style={{ pageBreakBefore: i > 0 ? "always" : undefined }}
                >
                  {/* Anchor for PDF internal links */}
                  <a id={`pdf-section-${section.id}`} style={{ display: "block", height: 0, visibility: "hidden" }} />
                  <div
                    className="pdf-content"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(section.content(form)),
                    }}
                  />
                  {i < config.sections.length - 1 && (
                    <hr style={{ margin: "2em 0", border: "none", borderTop: "1px solid #ddd" }} />
                  )}
                </div>
              ))}

              {/* Footer */}
              <div style={{ marginTop: "3em", paddingTop: "1em", borderTop: "2px solid #333", textAlign: "center", fontSize: "10px", color: "#888" }}>
                <p>{config.title} — {form.companyName || "[Bedriftsnavn]"} — Konfidensielt</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PDF-specific styles */}
      <style>{`
        .pdf-content h2 {
          font-size: 18px;
          font-weight: bold;
          color: #000;
          margin: 1.5em 0 0.5em 0;
          padding-bottom: 4px;
          border-bottom: 1px solid #e0e0e0;
          font-family: 'Georgia', serif;
        }
        .pdf-content h3 {
          font-size: 14px;
          font-weight: bold;
          color: #1a1a1a;
          margin: 1.2em 0 0.4em 0;
          font-family: 'Georgia', serif;
        }
        .pdf-content p {
          font-size: 13px;
          color: #333;
          line-height: 1.7;
          margin: 0.5em 0;
        }
        .pdf-content ul, .pdf-content ol {
          font-size: 13px;
          color: #333;
          line-height: 1.7;
          padding-left: 1.5em;
          margin: 0.5em 0;
        }
        .pdf-content li {
          margin-bottom: 4px;
        }
        .pdf-content strong {
          color: #000;
        }
        .pdf-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1em 0;
          font-size: 12px;
        }
        .pdf-content table td, .pdf-content table th {
          padding: 6px 8px;
          border-bottom: 1px solid #e0e0e0;
          color: #333;
        }
        .pdf-content table tr:first-child td {
          font-weight: bold;
          color: #000;
          border-bottom: 2px solid #ccc;
        }
        .pdf-content em {
          color: #666;
        }
        .pdf-content .merge-field {
          background: #f0f0f0;
          color: #666;
          padding: 1px 6px;
          border-radius: 3px;
          font-size: 12px;
          font-weight: 500;
          border: 1px dashed #ccc;
        }
        .pdf-content hr {
          margin: 2em 0;
          border: none;
          border-top: 1px solid #ddd;
        }
      `}</style>
    </div>
  );
};

export default DocumentGenerator;
