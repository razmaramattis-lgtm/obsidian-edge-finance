import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save, Download, ChevronDown, ChevronRight, FileText,
  CheckCircle2, AlertCircle, Eye, EyeOff, PanelLeftClose, PanelLeft, Info
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
  const docRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize all groups as expanded
    const groups: Record<string, boolean> = {};
    config.fieldGroups.forEach((g, i) => { groups[g.title] = i < 3; });
    setExpandedGroups(groups);
  }, [config]);

  useEffect(() => {
    const loadCompany = async () => {
      const { data } = await supabase
        .from("customer_companies")
        .select("id, company_name, org_number, industry")
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

  const handleSave = async () => {
    if (!companyId) {
      toast.error("Ingen bedrift funnet");
      return;
    }
    setSaving(true);
    try {
      for (const section of config.sections) {
        const { title, content } = section;
        const html = content(form);
        const { error } = await supabase.from("customer_documents").upsert(
          {
            company_id: companyId,
            title,
            description: `${config.title} — ${title}`,
            category: config.documentCategory,
            file_name: `${title}.html`,
            visibility: "private",
          },
          { onConflict: "company_id,title" }
        );
        // If upsert by unique fails, try insert
        if (error) {
          await supabase.from("customer_documents").insert({
            company_id: companyId,
            title,
            description: `Generert fra ${config.title}`,
            category: config.documentCategory,
            file_name: `${title}.html`,
            visibility: "private",
          });
        }
      }
      // Save chapters
      for (const section of config.sections) {
        const html = section.content(form);
        // Check if chapter exists
        const { data: existing } = await supabase
          .from("customer_handbook_chapters")
          .select("id")
          .eq("company_id", companyId)
          .eq("title", section.title)
          .maybeSingle();

        if (existing) {
          await supabase
            .from("customer_handbook_chapters")
            .update({ content: html })
            .eq("id", existing.id);
        } else {
          await supabase.from("customer_handbook_chapters").insert({
            company_id: companyId,
            title: section.title,
            content: html,
            sort_order: config.sections.indexOf(section),
          });
        }
      }

      setSaved(true);
      toast.success(`${config.title} lagret`);
    } catch (e) {
      toast.error("Kunne ikke lagre");
    }
    setSaving(false);
  };

  const handleDownloadPdf = async () => {
    if (!docRef.current) return;
    const html2pdf = (await import("html2pdf.js")).default;
    const element = docRef.current;
    html2pdf()
      .set({
        margin: [15, 15, 15, 15],
        filename: `${config.title}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(element)
      .save();
  };

  const fullDocument = useMemo(() => {
    return config.sections.map(s => s.content(form)).join('<hr style="margin:2em 0;border:none;border-top:1px solid #e5e7eb;" />');
  }, [config.sections, form]);

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
          <button
            onClick={handleDownloadPdf}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs rounded-xl border border-border/20 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Download size={14} /> Last ned PDF
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
            {saving ? "Lagrer…" : saved ? "Lagret" : "Lagre alle"}
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
                            <div key={field.id}>
                              <div className="flex items-center gap-1.5 mb-1">
                                <label className="text-[11px] font-medium text-muted-foreground">
                                  {field.label}
                                </label>
                                {field.helpText && field.type !== "checkbox" && (
                                  <TooltipProvider delayDuration={200}>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <button
                                          type="button"
                                          className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-muted/40 hover:bg-primary/20 text-muted-foreground/60 hover:text-primary transition-colors shrink-0"
                                        >
                                          <Info size={10} />
                                        </button>
                                      </TooltipTrigger>
                                      <TooltipContent side="right" className="max-w-[260px] text-xs leading-relaxed">
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
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={!!form[field.id]}
                                    onChange={e => updateField(field.id, e.target.checked)}
                                    className="rounded border-border/30"
                                  />
                                  <span className="text-xs text-muted-foreground">{field.helpText || "Ja"}</span>
                                  {field.helpText && (
                                    <TooltipProvider delayDuration={200}>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <button
                                            type="button"
                                            className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-muted/40 hover:bg-primary/20 text-muted-foreground/60 hover:text-primary transition-colors shrink-0"
                                          >
                                            <Info size={10} />
                                          </button>
                                        </TooltipTrigger>
                                        <TooltipContent side="right" className="max-w-[260px] text-xs leading-relaxed">
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

          {/* Document content */}
          <div
            ref={docRef}
            className="glass rounded-2xl border border-border/10 p-6 md:p-8 lg:p-10"
          >
            <div className="prose prose-sm max-w-none dark:prose-invert
              [&_h2]:font-heading [&_h2]:text-xl [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-foreground
              [&_h3]:font-heading [&_h3]:text-base [&_h3]:mt-5 [&_h3]:mb-2 [&_h3]:text-foreground/90
              [&_p]:text-sm [&_p]:text-muted-foreground [&_p]:leading-relaxed
              [&_ul]:text-sm [&_ul]:text-muted-foreground [&_ol]:text-sm [&_ol]:text-muted-foreground
              [&_li]:mb-1
              [&_.merge-field]:bg-primary/10 [&_.merge-field]:text-primary [&_.merge-field]:px-1.5 [&_.merge-field]:py-0.5 [&_.merge-field]:rounded [&_.merge-field]:font-medium [&_.merge-field]:text-xs
              [&_.editable-field]:bg-secondary/10 [&_.editable-field]:text-secondary [&_.editable-field]:px-1.5 [&_.editable-field]:py-0.5 [&_.editable-field]:rounded [&_.editable-field]:font-medium
              [&_hr]:my-8 [&_hr]:border-border/20
              [&_strong]:text-foreground
            ">
              {config.sections.map((section, i) => (
                <div key={section.id} id={`section-${section.id}`}>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(section.content(form)),
                    }}
                  />
                  {i < config.sections.length - 1 && <hr />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentGenerator;
