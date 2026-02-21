import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Building2, Clock, Home, Sparkles, Wallet, LayoutGrid, FileCheck,
  ChevronRight, ChevronLeft, Check, Loader2, ShieldAlert, Users, Download
} from "lucide-react";

/* ───────── Types ───────── */
type StepId = "bedrift" | "arbeidstid" | "hjemmekontor" | "ferie" | "moderne" | "lonn" | "krav2026" | "moduler" | "generer";

interface StepDef {
  id: StepId;
  label: string;
  icon: React.ElementType;
}

const STEPS: StepDef[] = [
  { id: "bedrift",       label: "Bedrift",       icon: Building2 },
  { id: "arbeidstid",    label: "Arbeidstid",    icon: Clock },
  { id: "hjemmekontor",  label: "Hjemmekontor",  icon: Home },
  { id: "ferie",         label: "Ferie & fravær", icon: Users },
  { id: "moderne",       label: "Moderne",       icon: Sparkles },
  { id: "lonn",          label: "Lønn",          icon: Wallet },
  { id: "krav2026",      label: "2026-krav",     icon: ShieldAlert },
  { id: "moduler",       label: "Moduler",       icon: LayoutGrid },
  { id: "generer",       label: "Generer",       icon: FileCheck },
];

/* ───────── Form data ───────── */
interface FormData {
  // Bedrift
  companyName: string;
  orgNumber: string;
  employeeCount: string;
  industry: string;
  contactEmail: string;
  address: string;
  ceoName: string;
  hrContactName: string;
  hrContactEmail: string;
  // Arbeidstid
  normalHours: string;
  flexTime: boolean;
  coreHoursStart: string;
  coreHoursEnd: string;
  overtimePolicy: string;
  lunchDuration: string;
  lunchPaid: boolean;
  // Hjemmekontor
  homeOfficeAllowed: boolean;
  homeOfficeDays: string;
  homeOfficeEquipment: boolean;
  homeOfficeAvailability: string;
  homeOfficeInternetStipend: boolean;
  // Ferie & fravær
  vacationDays: string;
  vacationPayMonth: string;
  vacationPayRate: string;
  vacationDeadline: string;
  probationPeriod: string;
  probationNotice: string;
  noticePeriod: string;
  sickSelfDays: string;
  sickSelfTimes: string;
  parentalLeaveExtra: boolean;
  parentalLeaveWeeks: string;
  childCareDays: string;
  welfareLeave: boolean;
  // Moderne
  dressCode: string;
  socialMediaPolicy: string;
  sustainabilityFocus: boolean;
  diversityStatement: boolean;
  whistleblowerChannel: string;
  conflictPolicy: string;
  // Lønn
  salaryFrequency: string;
  salaryPayDay: string;
  salaryNegotiationMonth: string;
  pensionScheme: string;
  pensionPercent: string;
  insuranceYrkesskadeforsikring: boolean;
  insuranceGruppeliv: boolean;
  insuranceReise: boolean;
  insuranceHelse: boolean;
  insuranceTannhelse: boolean;
  insuranceUforhet: boolean;
  bonusScheme: string;
  otherBenefits: string;
  trainingBudget: boolean;
  trainingBudgetAmount: string;
  travelPolicy: string;
  phoneAllowance: boolean;
  phoneAllowanceAmount: string;
  lunchAllowance: boolean;
  fitnessAllowance: boolean;
  fitnessAllowanceAmount: string;
  // 2026-krav
  psychosocialPolicy: boolean;
  riskAssessmentFrequency: string;
  employeeSurvey: boolean;
  surveyFrequency: string;
  actionPlanEnabled: boolean;
  actionPlanResponsible: string;
  // Moduler
  modules: string[];
}

const INITIAL_FORM: FormData = {
  companyName: "",
  orgNumber: "",
  employeeCount: "",
  industry: "",
  contactEmail: "",
  address: "",
  ceoName: "",
  hrContactName: "",
  hrContactEmail: "",
  normalHours: "37.5",
  flexTime: true,
  coreHoursStart: "09:00",
  coreHoursEnd: "15:00",
  overtimePolicy: "compensation",
  lunchDuration: "30",
  lunchPaid: true,
  homeOfficeAllowed: true,
  homeOfficeDays: "2",
  homeOfficeEquipment: true,
  homeOfficeAvailability: "Ansatte skal være tilgjengelige i kjernetiden.",
  homeOfficeInternetStipend: false,
  vacationDays: "25",
  vacationPayMonth: "juni",
  vacationPayRate: "12",
  vacationDeadline: "1. mars",
  probationPeriod: "6",
  probationNotice: "14",
  noticePeriod: "3",
  sickSelfDays: "3",
  sickSelfTimes: "4",
  parentalLeaveExtra: false,
  parentalLeaveWeeks: "0",
  childCareDays: "10",
  welfareLeave: true,
  dressCode: "casual",
  socialMediaPolicy: "ansvarlig",
  sustainabilityFocus: true,
  diversityStatement: true,
  whistleblowerChannel: "daglig leder",
  conflictPolicy: "mediation",
  salaryFrequency: "monthly",
  salaryPayDay: "25",
  salaryNegotiationMonth: "april",
  pensionScheme: "obligatorisk",
  pensionPercent: "2",
  insuranceYrkesskadeforsikring: true,
  insuranceGruppeliv: false,
  insuranceReise: false,
  insuranceHelse: false,
  insuranceTannhelse: false,
  insuranceUforhet: false,
  bonusScheme: "none",
  otherBenefits: "",
  trainingBudget: false,
  trainingBudgetAmount: "10000",
  travelPolicy: "state-rates",
  phoneAllowance: false,
  phoneAllowanceAmount: "500",
  lunchAllowance: false,
  fitnessAllowance: false,
  fitnessAllowanceAmount: "500",
  psychosocialPolicy: true,
  riskAssessmentFrequency: "annual",
  employeeSurvey: true,
  surveyFrequency: "annual",
  actionPlanEnabled: true,
  actionPlanResponsible: "",
  modules: [
    "formaal", "ansettelse", "arbeidstid", "ferie", "sykdom",
    "hjemmekontor", "lonn", "pensjon", "hms", "psykososialt", "risikovurdering",
    "kartlegging", "handlingsplan", "personvern", "varsling",
    "arbeidsreglement", "internkontroll", "gdpr", "digitalt", "avslutning"
  ],
};

const ALL_MODULES = [
  // — Personalhåndbok —
  { id: "formaal",      label: "Formål og omfang",               group: "Personalhåndbok" },
  { id: "ansettelse",   label: "Ansettelse og prøvetid",         group: "Personalhåndbok" },
  { id: "arbeidstid",   label: "Arbeidstid og fleksibilitet",    group: "Personalhåndbok" },
  { id: "ferie",        label: "Ferie og fridager",              group: "Personalhåndbok" },
  { id: "sykdom",       label: "Sykdom og fravær",               group: "Personalhåndbok" },
  { id: "foreldreperm", label: "Foreldrepermisjon",               group: "Personalhåndbok" },
  { id: "hjemmekontor", label: "Hjemmekontor",                   group: "Personalhåndbok" },
  { id: "lonn",         label: "Lønn og godtgjørelser",          group: "Personalhåndbok" },
  { id: "pensjon",      label: "Pensjon og forsikring",          group: "Personalhåndbok" },
  { id: "kompetanse",   label: "Kompetanseutvikling",            group: "Personalhåndbok" },
  { id: "reise",        label: "Reise og utlegg",                group: "Personalhåndbok" },
  { id: "kleskode",     label: "Kleskode",                       group: "Personalhåndbok" },
  { id: "sosiale",      label: "Sosiale medier",                 group: "Personalhåndbok" },
  { id: "konflikter",   label: "Konflikthåndtering",             group: "Personalhåndbok" },
  { id: "avslutning",   label: "Oppsigelse og avslutning",       group: "Personalhåndbok" },
  { id: "baerekraft",   label: "Bærekraft og samfunnsansvar",    group: "Personalhåndbok" },
  // — Arbeidsreglement —
  { id: "arbeidsreglement", label: "Arbeidsreglement",           group: "Arbeidsreglement" },
  // — Varslingsrutiner —
  { id: "varsling",     label: "Varslingsrutiner",               group: "Varslingsrutiner" },
  // — HMS & Internkontroll —
  { id: "hms",          label: "HMS og arbeidsmiljø",            group: "HMS & Internkontroll" },
  { id: "internkontroll", label: "Internkontroll (IK)",          group: "HMS & Internkontroll" },
  { id: "psykososialt", label: "Psykososialt arbeidsmiljø (2026)", group: "HMS & Internkontroll" },
  { id: "risikovurdering", label: "Risikovurdering (2026)",      group: "HMS & Internkontroll" },
  { id: "kartlegging",  label: "Kartlegging (2026)",             group: "HMS & Internkontroll" },
  { id: "handlingsplan", label: "Handlingsplaner (2026)",        group: "HMS & Internkontroll" },
  // — GDPR —
  { id: "personvern",   label: "Personvern og IT",               group: "GDPR-compliance" },
  { id: "gdpr",         label: "GDPR-compliance",                group: "GDPR-compliance" },
  { id: "databehandler", label: "Databehandleravtaler",          group: "GDPR-compliance" },
  // — DIGIS-tillegg —
  { id: "digitalt",     label: "Digital arbeidsplass",           group: "DIGIS-tillegg" },
  { id: "airetningslinjer", label: "AI og automatisering",       group: "DIGIS-tillegg" },
  { id: "hybridarbeid", label: "Hybridarbeid og fleksibilitet",  group: "DIGIS-tillegg" },
];

const INDUSTRIES = [
  "Teknologi / Software",
  "Konsulent / Rådgivning",
  "Bygg og anlegg",
  "Restaurant og servering",
  "Helse og omsorg",
  "Eiendom",
  "Transport og logistikk",
  "Varehandel",
  "Frisør og skjønnhet",
  "Annen",
];

/* ───────── Component ───────── */
interface HrGeneratorProps {
  onComplete?: () => void;
}

const HrGenerator = ({ onComplete }: HrGeneratorProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [generating, setGenerating] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [generatedChapters, setGeneratedChapters] = useState<{ title: string; content: string }[] | null>(null);

  // Pre-fill from customer_companies
  useEffect(() => {
    const prefill = async () => {
      const { data: comp } = await supabase
        .from("customer_companies")
        .select("*")
        .limit(1)
        .maybeSingle();
      if (comp) {
        setForm(prev => ({
          ...prev,
          companyName: comp.company_name || "",
          orgNumber: comp.org_number || "",
          industry: comp.industry || "",
          contactEmail: "",
        }));
      }
    };
    prefill();
  }, []);

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const toggleModule = (id: string) =>
    setForm(prev => ({
      ...prev,
      modules: prev.modules.includes(id)
        ? prev.modules.filter(m => m !== id)
        : [...prev.modules, id],
    }));

  const canProceed = () => {
    if (currentStep === 0) return form.companyName.trim() && form.employeeCount.trim() && form.industry;
    return true;
  };

  const next = () => { if (currentStep < STEPS.length - 1) setCurrentStep(s => s + 1); };
  const prev = () => { if (currentStep > 0) setCurrentStep(s => s - 1); };

  /* ───────── Generate handbook ───────── */
  const generateHandbook = async () => {
    setGenerating(true);
    try {
      const { data: company } = await supabase
        .from("customer_companies")
        .select("id")
        .limit(1)
        .maybeSingle();
      if (!company) { toast.error("Ingen bedrift funnet"); setGenerating(false); return; }

      // Delete existing chapters
      await supabase.from("customer_handbook_chapters").delete().eq("company_id", company.id);

      // Build chapters from selected modules
      const chapterContents = buildChapterContents(form);
      const rows = chapterContents.map((ch, i) => ({
        company_id: company.id,
        title: ch.title,
        content: ch.content,
        sort_order: i,
        customized: true,
      }));

      const { error } = await supabase.from("customer_handbook_chapters").insert(rows);
      if (error) throw error;

      // Save or update document reference under category "HR"
      const docTitle = `Personalhåndbok – ${form.companyName || "Bedrift"}`;
      const moduleGroups = [...new Set(ALL_MODULES.filter(m => form.modules.includes(m.id)).map(m => m.group))];
      const description = `Generert ${new Date().toLocaleDateString("no-NO")}. Inneholder: ${moduleGroups.join(", ")}.`;

      // Check if an HR document already exists for this company
      const { data: existingDoc } = await supabase
        .from("customer_documents")
        .select("id")
        .eq("company_id", company.id)
        .eq("category", "HR")
        .limit(1)
        .maybeSingle();

      if (existingDoc) {
        await supabase.from("customer_documents").update({
          title: docTitle,
          description,
          updated_at: new Date().toISOString(),
        }).eq("id", existingDoc.id);
      } else {
        await supabase.from("customer_documents").insert({
          company_id: company.id,
          title: docTitle,
          description,
          category: "HR",
          visibility: "private",
        });
      }

      setGeneratedChapters(chapterContents);
      toast.success("Personalhåndbok generert og lagret i Dokumenter!");
      onComplete?.();
    } catch (err) {
      console.error(err);
      toast.error("Noe gikk galt under genereringen.");
    }
    setGenerating(false);
  };

  /* ───────── Download PDF ───────── */
  const downloadPdf = async () => {
    const chapters = generatedChapters || buildChapterContents(form);
    if (chapters.length === 0) { toast.error("Ingen kapitler å eksportere."); return; }
    setDownloadingPdf(true);

    try {
      const html2pdf = (await import("html2pdf.js")).default;

      const container = document.createElement("div");
      container.style.cssText = "width:210mm;padding:20mm;font-family:'Segoe UI',Arial,sans-serif;font-size:12pt;line-height:1.6;color:#1a1a2e;";

      // Cover page
      container.innerHTML = `
        <div style="text-align:center;padding:60mm 0 40mm;">
          <h1 style="font-size:28pt;margin-bottom:8mm;color:#1a1a2e;">${form.companyName || "Bedrift"}</h1>
          <h2 style="font-size:16pt;color:#666;font-weight:normal;margin-bottom:4mm;">Personalhåndbok</h2>
          ${form.orgNumber ? `<p style="color:#999;font-size:10pt;">Org.nr: ${form.orgNumber}</p>` : ""}
          <p style="color:#999;font-size:10pt;margin-top:8mm;">Generert: ${new Date().toLocaleDateString("no-NO")}</p>
        </div>
        <div style="page-break-after:always;"></div>
        <h2 style="font-size:16pt;margin-bottom:6mm;color:#1a1a2e;">Innholdsfortegnelse</h2>
        <ol style="font-size:11pt;line-height:2;color:#333;">
          ${chapters.map((ch, i) => `<li>${ch.title}</li>`).join("")}
        </ol>
        <div style="page-break-after:always;"></div>
      `;

      // Chapters
      chapters.forEach((ch, i) => {
        const cleaned = ch.content
          .replace(/class="editable-field"/g, '')
          .replace(/data-field="[^"]*"/g, '')
          .replace(/style="color:#0d9488;[^"]*"/g, 'style="color:#0d9488;"');

        container.innerHTML += `
          <div style="${i > 0 ? 'page-break-before:always;' : ''}">
            ${cleaned}
          </div>
        `;
      });

      // Footer
      container.innerHTML += `
        <div style="page-break-before:always;text-align:center;padding-top:60mm;">
          <p style="color:#999;font-size:10pt;">Dokumentet er generert via Avargo HR-generator.</p>
          <p style="color:#999;font-size:10pt;">${form.companyName} — ${new Date().toLocaleDateString("no-NO")}</p>
        </div>
      `;

      await html2pdf().set({
        margin: 0,
        filename: `Personalhandbok-${form.companyName.replace(/\s+/g, "-") || "bedrift"}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ["css", "legacy"], before: ".page-break" },
      }).from(container).save();

      toast.success("PDF lastet ned!");
    } catch (err) {
      console.error(err);
      toast.error("Kunne ikke generere PDF.");
    }
    setDownloadingPdf(false);
  };

  /* ───────── Render step content ───────── */
  const renderStep = () => {
    switch (STEPS[currentStep].id) {
      case "bedrift": return <StepBedrift form={form} update={update} />;
      case "arbeidstid": return <StepArbeidstid form={form} update={update} />;
      case "hjemmekontor": return <StepHjemmekontor form={form} update={update} />;
      case "ferie": return <StepFerie form={form} update={update} />;
      case "moderne": return <StepModerne form={form} update={update} />;
      case "lonn": return <StepLonn form={form} update={update} />;
      case "krav2026": return <StepKrav2026 form={form} update={update} />;
      case "moduler": return <StepModuler form={form} toggleModule={toggleModule} />;
      case "generer": return <StepGenerer form={form} />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Stepper */}
      <div className="flex items-center justify-between">
        {STEPS.map((step, i) => {
          const done = i < currentStep;
          const active = i === currentStep;
          return (
            <div key={step.id} className="flex items-center flex-1 last:flex-initial">
              <button
                onClick={() => setCurrentStep(i)}
                className="flex flex-col items-center gap-1.5 group"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                  active
                    ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                    : done
                      ? "bg-primary/20 text-primary"
                      : "bg-muted/50 text-muted-foreground"
                }`}>
                  {done ? <Check size={16} /> : i + 1}
                </div>
                <span className={`text-[10px] hidden sm:block transition-colors ${
                  active ? "text-primary font-medium" : "text-muted-foreground"
                }`}>
                  {step.label}
                </span>
              </button>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-px mx-2 transition-colors duration-300 ${
                  i < currentStep ? "bg-primary/40" : "bg-border/30"
                }`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="glass rounded-2xl border border-border/20 p-6 md:p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            {(() => { const Icon = STEPS[currentStep].icon; return <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><Icon size={18} className="text-primary" /></div>; })()}
            <div>
              <h2 className="font-heading text-xl">{STEPS[currentStep].label}</h2>
              <p className="text-xs text-muted-foreground">{stepDescription(currentStep)}</p>
            </div>
          </div>
          {renderStep()}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={prev}
          disabled={currentStep === 0}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 disabled:opacity-30 disabled:pointer-events-none transition-all"
        >
          <ChevronLeft size={16} /> Tilbake
        </button>
        <div className="flex items-center gap-3">
          {currentStep === STEPS.length - 1 && generatedChapters && (
            <button
              onClick={downloadPdf}
              disabled={downloadingPdf}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm border border-primary/30 text-primary hover:bg-primary/5 transition-all disabled:opacity-40"
            >
              {downloadingPdf ? <><Loader2 size={16} className="animate-spin" /> Laster…</> : <><Download size={16} /> Last ned PDF</>}
            </button>
          )}
          {currentStep < STEPS.length - 1 ? (
            <button
              onClick={next}
              disabled={!canProceed()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:pointer-events-none transition-all"
            >
              Neste <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={generateHandbook}
              disabled={generating || form.modules.length === 0}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:pointer-events-none transition-all"
            >
              {generating ? <><Loader2 size={16} className="animate-spin" /> Genererer…</> : <><FileCheck size={16} /> Generer håndbok</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* ───────── Step descriptions ───────── */
function stepDescription(step: number) {
  const descs = [
    "Grunnleggende informasjon om din bedrift",
    "Definer arbeidstid, fleksibilitet og overtid",
    "Retningslinjer for hjemmekontor",
    "Ferie, permisjoner og fraværsregler",
    "Kleskode, sosiale medier og bærekraft",
    "Lønn, pensjon, forsikring og goder",
    "Nye 2026-krav: psykososialt arbeidsmiljø og risikovurdering",
    "Velg hvilke kapitler som skal inkluderes",
    "Se over og generer din personalhåndbok",
  ];
  return descs[step] || "";
}

/* ───────── Shared field components ───────── */
const FieldLabel = ({ children, required }: { children: React.ReactNode; required?: boolean }) => (
  <label className="block text-sm font-light mb-1.5">
    {children}{required && <span className="text-primary ml-0.5">*</span>}
  </label>
);

const FieldInput = ({ value, onChange, placeholder, type = "text", ...rest }: React.InputHTMLAttributes<HTMLInputElement> & { value: string; onChange: (v: string) => void }) => (
  <input
    type={type}
    value={value}
    onChange={e => onChange(e.target.value)}
    placeholder={placeholder}
    className="w-full h-10 rounded-xl border border-border/30 bg-muted/20 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-muted-foreground/40"
    {...rest}
  />
);

const FieldSelect = ({ value, onChange, options, placeholder }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; placeholder?: string }) => (
  <select
    value={value}
    onChange={e => onChange(e.target.value)}
    className="w-full h-10 rounded-xl border border-border/30 bg-muted/20 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 appearance-none"
  >
    {placeholder && <option value="">{placeholder}</option>}
    {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
  </select>
);

const FieldToggle = ({ label, checked, onChange, description }: { label: string; checked: boolean; onChange: (v: boolean) => void; description?: string }) => (
  <label className="flex items-start gap-3 cursor-pointer group py-2">
    <div className={`w-10 h-6 rounded-full flex items-center shrink-0 transition-colors mt-0.5 ${checked ? "bg-primary" : "bg-muted"}`}
      onClick={(e) => { e.preventDefault(); onChange(!checked); }}>
      <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${checked ? "translate-x-5" : "translate-x-1"}`} />
    </div>
    <div onClick={(e) => { e.preventDefault(); onChange(!checked); }}>
      <span className="text-sm">{label}</span>
      {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
    </div>
  </label>
);

/* ───────── Step 1: Bedrift ───────── */
const StepBedrift = ({ form, update }: { form: FormData; update: <K extends keyof FormData>(k: K, v: FormData[K]) => void }) => (
  <div className="space-y-5">
    <div>
      <FieldLabel required>Selskapsnavn</FieldLabel>
      <FieldInput value={form.companyName} onChange={v => update("companyName", v)} placeholder="Søk etter selskap…" />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <FieldLabel>Org.nummer</FieldLabel>
        <FieldInput value={form.orgNumber} onChange={v => update("orgNumber", v)} placeholder="123 456 789" />
      </div>
      <div>
        <FieldLabel required>Antall ansatte</FieldLabel>
        <FieldInput value={form.employeeCount} onChange={v => update("employeeCount", v)} placeholder="15" type="number" />
      </div>
    </div>
    <div>
      <FieldLabel required>Bransje</FieldLabel>
      <FieldSelect
        value={form.industry}
        onChange={v => update("industry", v)}
        placeholder="Velg bransje"
        options={INDUSTRIES.map(i => ({ value: i, label: i }))}
      />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <FieldLabel>E-postadresse</FieldLabel>
        <FieldInput value={form.contactEmail} onChange={v => update("contactEmail", v)} placeholder="post@bedrift.no" type="email" />
      </div>
      <div>
        <FieldLabel>Adresse</FieldLabel>
        <FieldInput value={form.address} onChange={v => update("address", v)} placeholder="Gateadresse, by" />
      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <FieldLabel>Daglig leder</FieldLabel>
        <FieldInput value={form.ceoName} onChange={v => update("ceoName", v)} placeholder="Fullt navn" />
      </div>
      <div>
        <FieldLabel>HR-kontakt</FieldLabel>
        <FieldInput value={form.hrContactName} onChange={v => update("hrContactName", v)} placeholder="Navn" />
      </div>
    </div>
    <div>
      <FieldLabel>HR-kontakt e-post</FieldLabel>
      <FieldInput value={form.hrContactEmail} onChange={v => update("hrContactEmail", v)} placeholder="hr@bedrift.no" type="email" />
    </div>
  </div>
);

/* ───────── Step 2: Arbeidstid ───────── */
const StepArbeidstid = ({ form, update }: { form: FormData; update: <K extends keyof FormData>(k: K, v: FormData[K]) => void }) => (
  <div className="space-y-5">
    <div>
      <FieldLabel required>Normal arbeidstid (timer/uke)</FieldLabel>
      <FieldInput value={form.normalHours} onChange={v => update("normalHours", v)} placeholder="37.5" type="number" />
    </div>
    <FieldToggle
      label="Fleksitid"
      checked={form.flexTime}
      onChange={v => update("flexTime", v)}
      description="Tillater ansatte å tilpasse start- og sluttid innenfor kjernetiden."
    />
    {form.flexTime && (
      <div className="grid grid-cols-2 gap-4 pl-13">
        <div>
          <FieldLabel>Kjernetid start</FieldLabel>
          <FieldInput value={form.coreHoursStart} onChange={v => update("coreHoursStart", v)} type="time" />
        </div>
        <div>
          <FieldLabel>Kjernetid slutt</FieldLabel>
          <FieldInput value={form.coreHoursEnd} onChange={v => update("coreHoursEnd", v)} type="time" />
        </div>
      </div>
    )}
    <div>
      <FieldLabel>Overtidspolicy</FieldLabel>
      <FieldSelect
        value={form.overtimePolicy}
        onChange={v => update("overtimePolicy", v)}
        options={[
          { value: "compensation", label: "Overtidsbetaling i henhold til lov" },
          { value: "timeoff", label: "Avspasering time for time" },
          { value: "both", label: "Valgfritt: betaling eller avspasering" },
        ]}
      />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <FieldLabel>Lunsjpause (minutter)</FieldLabel>
        <FieldSelect
          value={form.lunchDuration}
          onChange={v => update("lunchDuration", v)}
          options={[
            { value: "20", label: "20 minutter" },
            { value: "30", label: "30 minutter" },
            { value: "45", label: "45 minutter" },
            { value: "60", label: "60 minutter" },
          ]}
        />
      </div>
      <div className="flex items-end">
        <FieldToggle
          label="Betalt lunsj"
          checked={form.lunchPaid}
          onChange={v => update("lunchPaid", v)}
        />
      </div>
    </div>
  </div>
);

/* ───────── Step 3: Hjemmekontor ───────── */
const StepHjemmekontor = ({ form, update }: { form: FormData; update: <K extends keyof FormData>(k: K, v: FormData[K]) => void }) => (
  <div className="space-y-5">
    <FieldToggle
      label="Tillat hjemmekontor"
      checked={form.homeOfficeAllowed}
      onChange={v => update("homeOfficeAllowed", v)}
      description="Ansatte kan jobbe fra hjemmekontor etter avtale."
    />
    {form.homeOfficeAllowed && (
      <>
        <div>
          <FieldLabel>Antall dager med hjemmekontor per uke</FieldLabel>
          <FieldSelect
            value={form.homeOfficeDays}
            onChange={v => update("homeOfficeDays", v)}
            options={[
              { value: "1", label: "1 dag" },
              { value: "2", label: "2 dager" },
              { value: "3", label: "3 dager" },
              { value: "4", label: "4 dager" },
              { value: "5", label: "Fullt fjernarbeid" },
              { value: "flexible", label: "Fleksibelt etter avtale" },
            ]}
          />
        </div>
        <FieldToggle
          label="Utstyr til hjemmekontor"
          checked={form.homeOfficeEquipment}
          onChange={v => update("homeOfficeEquipment", v)}
          description="Bedriften dekker nødvendig utstyr (skjerm, tastatur, stol etc.)"
        />
        <FieldToggle
          label="Internett-stipend"
          checked={form.homeOfficeInternetStipend}
          onChange={v => update("homeOfficeInternetStipend", v)}
          description="Bedriften bidrar til dekning av internett-kostnader hjemme."
        />
        <div>
          <FieldLabel>Tilgjengelighet</FieldLabel>
          <FieldInput value={form.homeOfficeAvailability} onChange={v => update("homeOfficeAvailability", v)} placeholder="Krav til tilgjengelighet på hjemmekontor" />
        </div>
      </>
    )}
  </div>
);

/* ───────── Step 4: Ferie & fravær ───────── */
const StepFerie = ({ form, update }: { form: FormData; update: <K extends keyof FormData>(k: K, v: FormData[K]) => void }) => (
  <div className="space-y-5">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <FieldLabel>Feriedager per år</FieldLabel>
        <FieldSelect
          value={form.vacationDays}
          onChange={v => update("vacationDays", v)}
          options={[
            { value: "25", label: "25 virkedager (lovpålagt)" },
            { value: "27", label: "27 virkedager" },
            { value: "30", label: "30 virkedager" },
          ]}
        />
      </div>
      <div>
        <FieldLabel>Feriepengeutbetaling</FieldLabel>
        <FieldSelect
          value={form.vacationPayMonth}
          onChange={v => update("vacationPayMonth", v)}
          options={[
            { value: "juni", label: "Juni" },
            { value: "mai", label: "Mai" },
            { value: "juli", label: "Juli" },
          ]}
        />
      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <FieldLabel>Feriepenge-sats (%)</FieldLabel>
        <FieldSelect
          value={form.vacationPayRate}
          onChange={v => update("vacationPayRate", v)}
          options={[
            { value: "10.2", label: "10,2% (standard)" },
            { value: "12", label: "12% (5 ukers ferie)" },
          ]}
        />
      </div>
      <div>
        <FieldLabel>Frist ferieønske</FieldLabel>
        <FieldInput value={form.vacationDeadline} onChange={v => update("vacationDeadline", v)} placeholder="1. mars" />
      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <FieldLabel>Prøvetid (måneder)</FieldLabel>
        <FieldSelect
          value={form.probationPeriod}
          onChange={v => update("probationPeriod", v)}
          options={[
            { value: "3", label: "3 måneder" },
            { value: "6", label: "6 måneder (standard)" },
          ]}
        />
      </div>
      <div>
        <FieldLabel>Oppsigelsestid i prøvetid (dager)</FieldLabel>
        <FieldSelect
          value={form.probationNotice}
          onChange={v => update("probationNotice", v)}
          options={[
            { value: "14", label: "14 dager" },
            { value: "30", label: "1 måned" },
          ]}
        />
      </div>
    </div>
    <div>
      <FieldLabel>Oppsigelsestid (måneder)</FieldLabel>
      <FieldSelect
        value={form.noticePeriod}
        onChange={v => update("noticePeriod", v)}
        options={[
          { value: "1", label: "1 måned" },
          { value: "2", label: "2 måneder" },
          { value: "3", label: "3 måneder (standard)" },
          { value: "6", label: "6 måneder" },
        ]}
      />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <FieldLabel>Egenmeldingsdager (sammenhengende)</FieldLabel>
        <FieldSelect
          value={form.sickSelfDays}
          onChange={v => update("sickSelfDays", v)}
          options={[
            { value: "3", label: "3 dager" },
            { value: "5", label: "5 dager" },
            { value: "8", label: "8 dager (IA-avtale)" },
          ]}
        />
      </div>
      <div>
        <FieldLabel>Maks egenmeldinger per 12 mnd</FieldLabel>
        <FieldSelect
          value={form.sickSelfTimes}
          onChange={v => update("sickSelfTimes", v)}
          options={[
            { value: "4", label: "4 ganger" },
            { value: "6", label: "6 ganger" },
            { value: "12", label: "12 ganger (utvidet)" },
          ]}
        />
      </div>
    </div>
    <FieldToggle
      label="Utvidet foreldrepermisjon"
      checked={form.parentalLeaveExtra}
      onChange={v => update("parentalLeaveExtra", v)}
      description="Bedriften tilbyr ekstra lønn/permisjon utover folketrygdens dekning."
    />
    {form.parentalLeaveExtra && (
      <div className="pl-13">
        <FieldLabel>Ekstra uker med full lønn</FieldLabel>
        <FieldInput value={form.parentalLeaveWeeks} onChange={v => update("parentalLeaveWeeks", v)} placeholder="2" type="number" />
      </div>
    )}
    <div>
      <FieldLabel>Omsorgsdager (barn under 12 år)</FieldLabel>
      <FieldSelect
        value={form.childCareDays}
        onChange={v => update("childCareDays", v)}
        options={[
          { value: "10", label: "10 dager (standard)" },
          { value: "15", label: "15 dager" },
          { value: "20", label: "20 dager (aleneforelder)" },
        ]}
      />
    </div>
    <FieldToggle
      label="Velferdspermisjon"
      checked={form.welfareLeave}
      onChange={v => update("welfareLeave", v)}
      description="Korte permisjoner ved spesielle anledninger (flytting, legebesøk, begravelse etc.)"
    />
  </div>
);

/* ───────── Step 5: Moderne ───────── */
const StepModerne = ({ form, update }: { form: FormData; update: <K extends keyof FormData>(k: K, v: FormData[K]) => void }) => (
  <div className="space-y-5">
    <div>
      <FieldLabel>Kleskode</FieldLabel>
      <FieldSelect
        value={form.dressCode}
        onChange={v => update("dressCode", v)}
        options={[
          { value: "formal", label: "Formell (dress/drakt)" },
          { value: "business-casual", label: "Business casual" },
          { value: "casual", label: "Uformell / avslappet" },
          { value: "none", label: "Ingen spesielle krav" },
        ]}
      />
    </div>
    <div>
      <FieldLabel>Sosiale medier</FieldLabel>
      <FieldSelect
        value={form.socialMediaPolicy}
        onChange={v => update("socialMediaPolicy", v)}
        options={[
          { value: "strict", label: "Streng – ingen firmarelatert innhold uten godkjenning" },
          { value: "ansvarlig", label: "Ansvarlig bruk – vis godt skjønn" },
          { value: "oppmuntret", label: "Oppmuntret – ambassadørprogram" },
        ]}
      />
    </div>
    <div>
      <FieldLabel>Varslingskanal</FieldLabel>
      <FieldInput value={form.whistleblowerChannel} onChange={v => update("whistleblowerChannel", v)} placeholder="Daglig leder, ekstern tjeneste, etc." />
    </div>
    <div>
      <FieldLabel>Konflikthåndtering</FieldLabel>
      <FieldSelect
        value={form.conflictPolicy}
        onChange={v => update("conflictPolicy", v)}
        options={[
          { value: "mediation", label: "Mekling via HR/leder" },
          { value: "external", label: "Ekstern mekler/BHT" },
          { value: "committee", label: "Internt konflikthåndteringsutvalg" },
        ]}
      />
    </div>
    <FieldToggle
      label="Bærekraft og miljø"
      checked={form.sustainabilityFocus}
      onChange={v => update("sustainabilityFocus", v)}
      description="Inkluder kapittel om bedriftens bærekraftmål og miljøpolicy."
    />
    <FieldToggle
      label="Mangfold og inkludering"
      checked={form.diversityStatement}
      onChange={v => update("diversityStatement", v)}
      description="Inkluder erklæring om mangfold, likestilling og inkludering."
    />
  </div>
);

/* ───────── Step 6: Lønn ───────── */
const StepLonn = ({ form, update }: { form: FormData; update: <K extends keyof FormData>(k: K, v: FormData[K]) => void }) => (
  <div className="space-y-5">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <FieldLabel>Lønnsutbetaling</FieldLabel>
        <FieldSelect
          value={form.salaryFrequency}
          onChange={v => update("salaryFrequency", v)}
          options={[
            { value: "monthly", label: "Månedlig" },
            { value: "biweekly", label: "Annenhver uke" },
          ]}
        />
      </div>
      <div>
        <FieldLabel>Utbetalingsdato</FieldLabel>
        <FieldSelect
          value={form.salaryPayDay}
          onChange={v => update("salaryPayDay", v)}
          options={[
            { value: "15", label: "Den 15. hver måned" },
            { value: "20", label: "Den 20. hver måned" },
            { value: "25", label: "Den 25. hver måned" },
            { value: "last", label: "Siste virkedag i måneden" },
            { value: "custom", label: "Annen dato" },
          ]}
        />
      </div>
    </div>
    <div>
      <FieldLabel>Lønnsforhandlingsmåned</FieldLabel>
      <FieldSelect
        value={form.salaryNegotiationMonth}
        onChange={v => update("salaryNegotiationMonth", v)}
        options={[
          { value: "mars", label: "Mars" },
          { value: "april", label: "April" },
          { value: "mai", label: "Mai" },
          { value: "juni", label: "Juni" },
        ]}
      />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <FieldLabel>Pensjonsordning</FieldLabel>
        <FieldSelect
          value={form.pensionScheme}
          onChange={v => update("pensionScheme", v)}
          options={[
            { value: "obligatorisk", label: "OTP – minstekrav" },
            { value: "utvidet", label: "Utvidet pensjonsordning" },
            { value: "innskudd", label: "Innskuddsbasert med høyere sparing" },
          ]}
        />
      </div>
      <div>
        <FieldLabel>Pensjonsprosent</FieldLabel>
        <FieldSelect
          value={form.pensionPercent}
          onChange={v => update("pensionPercent", v)}
          options={[
            { value: "2", label: "2% (lovpålagt minimum)" },
            { value: "3", label: "3%" },
            { value: "4", label: "4%" },
            { value: "5", label: "5%" },
            { value: "5.5", label: "5,5%" },
            { value: "6", label: "6%" },
            { value: "7", label: "7% (maks innskudd)" },
          ]}
        />
      </div>
    </div>

    {/* Forsikringer */}
    <div>
      <FieldLabel>Forsikringer inkludert</FieldLabel>
      <p className="text-xs text-muted-foreground mb-3">Velg hvilke forsikringer bedriften tilbyr ansatte.</p>
      <div className="space-y-1 pl-1">
        <FieldToggle label="Yrkesskadeforsikring" checked={form.insuranceYrkesskadeforsikring} onChange={v => update("insuranceYrkesskadeforsikring", v)} description="Lovpålagt forsikring for alle ansatte." />
        <FieldToggle label="Gruppelivsforsikring" checked={form.insuranceGruppeliv} onChange={v => update("insuranceGruppeliv", v)} description="Utbetaling til etterlatte ved dødsfall." />
        <FieldToggle label="Reiseforsikring" checked={form.insuranceReise} onChange={v => update("insuranceReise", v)} description="Dekker tjenestereiser og eventuelt privatreiser." />
        <FieldToggle label="Helseforsikring" checked={form.insuranceHelse} onChange={v => update("insuranceHelse", v)} description="Behandlingsgaranti og raskere tilgang til spesialist." />
        <FieldToggle label="Tannhelseforsikring" checked={form.insuranceTannhelse} onChange={v => update("insuranceTannhelse", v)} description="Dekker tannbehandling utover det offentlige." />
        <FieldToggle label="Uføreforsikring" checked={form.insuranceUforhet} onChange={v => update("insuranceUforhet", v)} description="Ekstra utbetaling ved varig arbeidsuførhet." />
      </div>
    </div>

    <div>
      <FieldLabel>Bonusordning</FieldLabel>
      <FieldSelect
        value={form.bonusScheme}
        onChange={v => update("bonusScheme", v)}
        options={[
          { value: "none", label: "Ingen bonusordning" },
          { value: "annual", label: "Årlig resultatbonus" },
          { value: "quarterly", label: "Kvartalsvis bonus" },
          { value: "discretionary", label: "Skjønnsmessig bonus" },
        ]}
      />
    </div>

    {/* Goder */}
    <div>
      <FieldLabel>Goder og tilskudd</FieldLabel>
      <div className="space-y-1 pl-1">
        <FieldToggle label="Kompetansebudsjett" checked={form.trainingBudget} onChange={v => update("trainingBudget", v)} description="Årlig budsjett til kurs og sertifiseringer." />
        {form.trainingBudget && (
          <div className="pl-13">
            <FieldInput value={form.trainingBudgetAmount} onChange={v => update("trainingBudgetAmount", v)} placeholder="10000" type="number" />
            <p className="text-[10px] text-muted-foreground mt-1">Kr per ansatt per år</p>
          </div>
        )}
        <FieldToggle label="Telefonordning" checked={form.phoneAllowance} onChange={v => update("phoneAllowance", v)} description="Bedriften dekker mobiltelefon/-abonnement." />
        {form.phoneAllowance && (
          <div className="pl-13">
            <FieldInput value={form.phoneAllowanceAmount} onChange={v => update("phoneAllowanceAmount", v)} placeholder="500" type="number" />
            <p className="text-[10px] text-muted-foreground mt-1">Kr per måned</p>
          </div>
        )}
        <FieldToggle label="Lunsjtilskudd" checked={form.lunchAllowance} onChange={v => update("lunchAllowance", v)} description="Bedriften subsidierer eller dekker lunsj." />
        <FieldToggle label="Treningsstøtte" checked={form.fitnessAllowance} onChange={v => update("fitnessAllowance", v)} description="Støtte til treningsmedlemskap eller aktiviteter." />
        {form.fitnessAllowance && (
          <div className="pl-13">
            <FieldInput value={form.fitnessAllowanceAmount} onChange={v => update("fitnessAllowanceAmount", v)} placeholder="500" type="number" />
            <p className="text-[10px] text-muted-foreground mt-1">Kr per måned</p>
          </div>
        )}
      </div>
    </div>

    <div>
      <FieldLabel>Reise- og utleggspolicy</FieldLabel>
      <FieldSelect
        value={form.travelPolicy}
        onChange={v => update("travelPolicy", v)}
        options={[
          { value: "state-rates", label: "Statens satser (standard)" },
          { value: "actual-costs", label: "Faktiske kostnader mot kvittering" },
          { value: "fixed-allowance", label: "Fast diettsats" },
        ]}
      />
    </div>

    <div>
      <FieldLabel>Andre goder (fritekst)</FieldLabel>
      <FieldInput value={form.otherBenefits} onChange={v => update("otherBenefits", v)} placeholder="F.eks. aksjeopsjoner, firmahytte, velferdsordninger…" />
    </div>
  </div>
);

/* ───────── Step 7: 2026-krav ───────── */
const StepKrav2026 = ({ form, update }: { form: FormData; update: <K extends keyof FormData>(k: K, v: FormData[K]) => void }) => (
  <div className="space-y-5">
    <div className="rounded-xl border border-secondary/20 bg-secondary/5 p-4 mb-2">
      <p className="text-sm text-foreground/80 font-medium mb-1">🆕 Nye krav fra 2026</p>
      <p className="text-xs text-muted-foreground">Fra 2026 stilles det strengere krav til systematisk arbeid med psykososialt arbeidsmiljø, risikovurdering, kartlegging og handlingsplaner.</p>
    </div>
    <FieldToggle
      label="Psykososialt arbeidsmiljø"
      checked={form.psychosocialPolicy}
      onChange={v => update("psychosocialPolicy", v)}
      description="Inkluder retningslinjer for forebygging av mobbing, trakassering og psykiske belastninger."
    />
    <div>
      <FieldLabel>Risikovurdering — hyppighet</FieldLabel>
      <FieldSelect
        value={form.riskAssessmentFrequency}
        onChange={v => update("riskAssessmentFrequency", v)}
        options={[
          { value: "annual", label: "Årlig" },
          { value: "biannual", label: "Halvårlig" },
          { value: "quarterly", label: "Kvartalsvis" },
          { value: "continuous", label: "Kontinuerlig / ved endringer" },
        ]}
      />
    </div>
    <FieldToggle
      label="Medarbeiderundersøkelser"
      checked={form.employeeSurvey}
      onChange={v => update("employeeSurvey", v)}
      description="Gjennomfør regelmessige undersøkelser for å kartlegge arbeidsmiljø."
    />
    {form.employeeSurvey && (
      <div className="pl-13">
        <FieldLabel>Hyppighet</FieldLabel>
        <FieldSelect
          value={form.surveyFrequency}
          onChange={v => update("surveyFrequency", v)}
          options={[
            { value: "annual", label: "Årlig" },
            { value: "biannual", label: "Halvårlig" },
            { value: "quarterly", label: "Kvartalsvis" },
          ]}
        />
      </div>
    )}
    <FieldToggle
      label="Handlingsplaner"
      checked={form.actionPlanEnabled}
      onChange={v => update("actionPlanEnabled", v)}
      description="Utarbeid handlingsplaner med tiltak, ansvarlige og frister."
    />
    {form.actionPlanEnabled && (
      <div className="pl-13">
        <FieldLabel>Ansvarlig for oppfølging</FieldLabel>
        <FieldInput value={form.actionPlanResponsible} onChange={v => update("actionPlanResponsible", v)} placeholder="HR-leder, daglig leder, verneombud" />
      </div>
    )}
  </div>
);

/* ───────── Step 8: Moduler ───────── */
const MODULE_GROUPS = [...new Set(ALL_MODULES.map(m => m.group))];

const StepModuler = ({ form, toggleModule }: { form: FormData; toggleModule: (id: string) => void }) => {
  const toggleGroup = (group: string) => {
    const groupMods = ALL_MODULES.filter(m => m.group === group);
    const allSelected = groupMods.every(m => form.modules.includes(m.id));
    groupMods.forEach(m => {
      const isSelected = form.modules.includes(m.id);
      if (allSelected ? isSelected : !isSelected) toggleModule(m.id);
    });
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">Velg hvilke dokumenter og kapitler som skal genereres.</p>
      {MODULE_GROUPS.map(group => {
        const groupMods = ALL_MODULES.filter(m => m.group === group);
        const selectedCount = groupMods.filter(m => form.modules.includes(m.id)).length;
        return (
          <div key={group}>
            <button onClick={() => toggleGroup(group)} className="flex items-center gap-2 mb-2 group/g">
              <div className={`w-4 h-4 rounded flex items-center justify-center text-[10px] transition-colors ${
                selectedCount === groupMods.length ? "bg-primary text-primary-foreground" : selectedCount > 0 ? "bg-primary/40 text-primary-foreground" : "bg-muted/50"
              }`}>
                {selectedCount === groupMods.length && <Check size={10} />}
                {selectedCount > 0 && selectedCount < groupMods.length && <span>–</span>}
              </div>
              <span className="text-xs tracking-[0.15em] uppercase text-muted-foreground/70 group-hover/g:text-foreground transition-colors">{group}</span>
              <span className="text-[10px] text-muted-foreground/40">{selectedCount}/{groupMods.length}</span>
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {groupMods.map(mod => {
                const selected = form.modules.includes(mod.id);
                return (
                  <button
                    key={mod.id}
                    onClick={() => toggleModule(mod.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-left transition-all duration-200 border ${
                      selected
                        ? "border-primary/30 bg-primary/5 text-foreground"
                        : "border-border/20 bg-muted/10 text-muted-foreground hover:border-border/40 hover:bg-muted/20"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                      selected ? "bg-primary text-primary-foreground" : "bg-muted/50"
                    }`}>
                      {selected && <Check size={12} />}
                    </div>
                    {mod.label}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
      <p className="text-xs text-muted-foreground">{form.modules.length} av {ALL_MODULES.length} seksjoner valgt</p>
    </div>
  );
};

/* ───────── Step 9: Generer ───────── */
const StepGenerer = ({ form }: { form: FormData }) => {
  const selectedInsurances = [
    form.insuranceYrkesskadeforsikring && "Yrkesskade",
    form.insuranceGruppeliv && "Gruppeliv",
    form.insuranceReise && "Reise",
    form.insuranceHelse && "Helse",
    form.insuranceTannhelse && "Tannhelse",
    form.insuranceUforhet && "Uførhet",
  ].filter(Boolean);

  const payDayLabel = form.salaryPayDay === "last" ? "Siste virkedag" : form.salaryPayDay === "custom" ? "Annen dato" : `Den ${form.salaryPayDay}.`;

  const benefits = [
    form.trainingBudget && `Kompetanse: ${Number(form.trainingBudgetAmount).toLocaleString("no-NO")} kr/år`,
    form.phoneAllowance && `Telefon: ${form.phoneAllowanceAmount} kr/mnd`,
    form.lunchAllowance && "Lunsjtilskudd",
    form.fitnessAllowance && `Trening: ${form.fitnessAllowanceAmount} kr/mnd`,
    form.otherBenefits,
  ].filter(Boolean);

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">Se over valgene dine. Etter generering kan du laste ned PDF-filen.</p>

      <div className="space-y-4">
        <SummarySection title="Bedrift">
          <SummaryRow label="Selskap" value={form.companyName} />
          <SummaryRow label="Org.nr" value={form.orgNumber || "—"} />
          <SummaryRow label="Ansatte" value={form.employeeCount} />
          <SummaryRow label="Bransje" value={form.industry} />
          {form.ceoName && <SummaryRow label="Daglig leder" value={form.ceoName} />}
          {form.hrContactName && <SummaryRow label="HR-kontakt" value={form.hrContactName} />}
        </SummarySection>

        <SummarySection title="Arbeidstid">
          <SummaryRow label="Normal uke" value={`${form.normalHours} timer`} />
          <SummaryRow label="Fleksitid" value={form.flexTime ? `Ja (${form.coreHoursStart}–${form.coreHoursEnd})` : "Nei"} />
          <SummaryRow label="Overtid" value={form.overtimePolicy === "compensation" ? "Betaling" : form.overtimePolicy === "timeoff" ? "Avspasering" : "Valgfritt"} />
          <SummaryRow label="Lunsj" value={`${form.lunchDuration} min${form.lunchPaid ? " (betalt)" : ""}`} />
        </SummarySection>

        <SummarySection title="Ferie & fravær">
          <SummaryRow label="Feriedager" value={`${form.vacationDays} dager`} />
          <SummaryRow label="Prøvetid" value={`${form.probationPeriod} mnd`} />
          <SummaryRow label="Oppsigelsestid" value={`${form.noticePeriod} mnd`} />
          <SummaryRow label="Egenmelding" value={`${form.sickSelfDays} dager, ${form.sickSelfTimes}x/år`} />
          {form.parentalLeaveExtra && <SummaryRow label="Ekstra foreldreperm" value={`${form.parentalLeaveWeeks} uker`} />}
        </SummarySection>

        <SummarySection title="Hjemmekontor">
          <SummaryRow label="Tillatt" value={form.homeOfficeAllowed ? "Ja" : "Nei"} />
          {form.homeOfficeAllowed && <>
            <SummaryRow label="Dager/uke" value={form.homeOfficeDays === "flexible" ? "Fleksibelt" : form.homeOfficeDays} />
            <SummaryRow label="Utstyr dekkes" value={form.homeOfficeEquipment ? "Ja" : "Nei"} />
            {form.homeOfficeInternetStipend && <SummaryRow label="Internett-stipend" value="Ja" />}
          </>}
        </SummarySection>

        <SummarySection title="Lønn & goder">
          <SummaryRow label="Utbetaling" value={form.salaryFrequency === "monthly" ? "Månedlig" : "Annenhver uke"} />
          <SummaryRow label="Dato" value={payDayLabel} />
          <SummaryRow label="Pensjon" value={`${form.pensionScheme} (${form.pensionPercent}%)`} />
          <SummaryRow label="Forsikringer" value={selectedInsurances.length > 0 ? selectedInsurances.join(", ") : "Ingen valgt"} />
          {benefits.length > 0 && <SummaryRow label="Goder" value={benefits.join(", ")} />}
        </SummarySection>

        <SummarySection title="2026-krav">
          <SummaryRow label="Psykososialt" value={form.psychosocialPolicy ? "Inkludert" : "Ikke inkludert"} />
          <SummaryRow label="Risikovurdering" value={form.riskAssessmentFrequency === "quarterly" ? "Kvartalsvis" : form.riskAssessmentFrequency === "biannual" ? "Halvårlig" : form.riskAssessmentFrequency === "continuous" ? "Kontinuerlig" : "Årlig"} />
          <SummaryRow label="Kartlegging" value={form.employeeSurvey ? "Ja" : "Nei"} />
          <SummaryRow label="Handlingsplaner" value={form.actionPlanEnabled ? "Ja" : "Nei"} />
        </SummarySection>

        {MODULE_GROUPS.map(group => {
          const selected = ALL_MODULES.filter(m => m.group === group && form.modules.includes(m.id));
          if (selected.length === 0) return null;
          return (
            <SummarySection key={group} title={group}>
              <p className="text-sm text-muted-foreground">
                {selected.map(m => m.label).join(" · ")}
              </p>
            </SummarySection>
          );
        })}
      </div>
    </div>
  );
};

const SummarySection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="rounded-xl border border-border/20 bg-muted/10 p-4">
    <h4 className="text-xs tracking-[0.15em] uppercase text-muted-foreground/70 mb-2">{title}</h4>
    <div className="space-y-1">{children}</div>
  </div>
);

const SummaryRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-light">{value}</span>
  </div>
);

/* ───────── Content Builder ───────── */
function buildChapterContents(form: FormData) {
  const company = form.companyName || "[Bedriftsnavn]";
  const chapters: { title: string; content: string }[] = [];

  const payDayText = form.salaryPayDay === "last" ? "siste virkedag i måneden" : form.salaryPayDay === "custom" ? "avtalt dato" : `den ${form.salaryPayDay}. hver måned`;

  const selectedInsurances: string[] = [];
  if (form.insuranceYrkesskadeforsikring) selectedInsurances.push("Yrkesskadeforsikring (lovpålagt)");
  if (form.insuranceGruppeliv) selectedInsurances.push("Gruppelivsforsikring");
  if (form.insuranceReise) selectedInsurances.push("Reiseforsikring for tjenestereiser");
  if (form.insuranceHelse) selectedInsurances.push("Helseforsikring med behandlingsgaranti");
  if (form.insuranceTannhelse) selectedInsurances.push("Tannhelseforsikring");
  if (form.insuranceUforhet) selectedInsurances.push("Uføreforsikring");

  const benefitsList: string[] = [];
  if (form.trainingBudget) benefitsList.push(`Kompetansebudsjett: ${Number(form.trainingBudgetAmount).toLocaleString("no-NO")} kr per ansatt per år`);
  if (form.phoneAllowance) benefitsList.push(`Telefonordning: ${form.phoneAllowanceAmount} kr per måned`);
  if (form.lunchAllowance) benefitsList.push("Lunsjtilskudd");
  if (form.fitnessAllowance) benefitsList.push(`Treningsstøtte: ${form.fitnessAllowanceAmount} kr per måned`);

  const moduleMap: Record<string, () => { title: string; content: string }> = {
    formaal: () => ({
      title: "Formål og omfang",
      content: `<h2>Formål og omfang</h2><p>Denne personalhåndboken gjelder for alle ansatte i <span class="editable-field" data-field="Bedriftsnavn">${company}</span>. Håndboken er ment som en veiledning for arbeidsforholdet og inneholder retningslinjer, rettigheter og plikter.</p><p>Håndboken erstatter ikke lover, forskrifter eller individuelle arbeidsavtaler, men utfyller disse. Ved motstrid mellom håndboken og gjeldende lovgivning, vil loven ha forrang.</p><p>Alle ansatte er ansvarlige for å gjøre seg kjent med innholdet i denne håndboken.</p>${form.hrContactName ? `<p><strong>HR-kontakt:</strong> ${form.hrContactName}${form.hrContactEmail ? ` (${form.hrContactEmail})` : ""}</p>` : ""}`,
    }),
    ansettelse: () => ({
      title: "Ansettelse og prøvetid",
      content: `<h2>Ansettelse og prøvetid</h2><p>Alle ansettelser i <span class="editable-field" data-field="Bedriftsnavn">${company}</span> skjer i henhold til arbeidsmiljøloven. Nye ansatte mottar en skriftlig arbeidsavtale senest innen <span class="editable-field" data-field="Frist arbeidsavtale">7 dager</span> etter arbeidsforholdets start.</p><h3>Prøvetid</h3><p>Prøvetiden er normalt <span class="editable-field" data-field="Prøvetid">${form.probationPeriod} måneder</span>. I prøvetiden gjelder en gjensidig oppsigelsestid på <span class="editable-field" data-field="Oppsigelsestid prøvetid">${form.probationNotice} dager</span>.</p><h3>Taushetsplikt</h3><p>Alle ansatte har taushetsplikt om bedriftens interne forhold, forretningshemmeligheter og kundeforhold, både under og etter ansettelsesforholdet.</p>`,
    }),
    arbeidstid: () => ({
      title: "Arbeidstid og fleksibilitet",
      content: `<h2>Arbeidstid og fleksibilitet</h2><p>Normal arbeidstid i <span class="editable-field" data-field="Bedriftsnavn">${company}</span> er <span class="editable-field" data-field="Arbeidstid">${form.normalHours} timer</span> per uke, fordelt på mandag til fredag.</p><h3>Lunsj</h3><p>Lunsjpausen er ${form.lunchDuration} minutter${form.lunchPaid ? " og er betalt" : ""}.</p>${form.flexTime ? `<h3>Fleksitid</h3><p>Bedriften tilbyr fleksitid. Kjernetiden er fra <span class="editable-field" data-field="Kjernetid start">${form.coreHoursStart}</span> til <span class="editable-field" data-field="Kjernetid slutt">${form.coreHoursEnd}</span>. Utover kjernetiden kan arbeidstiden tilpasses etter avtale med nærmeste leder.</p>` : ""}<h3>Overtid</h3><p>${form.overtimePolicy === "compensation" ? "Overtidsarbeid kompenseres i henhold til arbeidsmiljølovens bestemmelser med tillegg på 40%." : form.overtimePolicy === "timeoff" ? "Overtid avspaseres time for time etter avtale med leder." : "Ansatte kan velge mellom overtidsbetaling og avspasering, etter avtale med leder."}</p><p>Alt overtidsarbeid skal være forhåndsgodkjent av nærmeste leder.</p>`,
    }),
    ferie: () => ({
      title: "Ferie og fridager",
      content: `<h2>Ferie og fridager</h2><p>Ansatte i <span class="editable-field" data-field="Bedriftsnavn">${company}</span> har rett til <span class="editable-field" data-field="Feriedager">${form.vacationDays} virkedager</span> ferie per år i henhold til ferieloven.</p><h3>Feriepenger</h3><p>Feriepenger utbetales i <span class="editable-field" data-field="Feriepenger-måned">${form.vacationPayMonth}</span> og beregnes med <span class="editable-field" data-field="Feriepenger-sats">${form.vacationPayRate}%</span> av feriepengegrunnlaget fra foregående år.</p><h3>Offentlige fridager</h3><p>Alle offentlige helligdager er fridager med full lønn.</p><h3>Planlegging</h3><p>Hovedferieperioden (3 uker sammenhengende) kan tas ut i perioden 1. juni til 30. september. Ferieønsker skal meldes til leder innen <span class="editable-field" data-field="Frist ferieønske">${form.vacationDeadline}</span>.</p>`,
    }),
    sykdom: () => ({
      title: "Sykdom og fravær",
      content: `<h2>Sykdom og fravær</h2><p>Ved sykdom skal <span class="editable-field" data-field="Bedriftsnavn">${company}</span> varsles så snart som mulig, og senest innen arbeidstidens start.</p><h3>Egenmelding</h3><p>Ansatte med minst 2 måneders ansettelse kan benytte egenmelding inntil <span class="editable-field" data-field="Egenmeldingsdager">${form.sickSelfDays} kalenderdager</span> sammenhengende, inntil <span class="editable-field" data-field="Egenmeldinger per år">${form.sickSelfTimes} ganger</span> i løpet av 12 måneder.</p><h3>Sykemelding</h3><p>Ved fravær utover egenmeldingsperioden kreves sykemelding fra lege. Bedriften utbetaler sykepenger i arbeidsgiverperioden (16 dager), deretter overtar NAV.</p><h3>Barn sykdom</h3><p>Ansatte med omsorg for barn under 12 år har rett til inntil <span class="editable-field" data-field="Omsorgsdager">${form.childCareDays} dager</span> omsorgspermisjon per kalenderår.</p>${form.welfareLeave ? "<h3>Velferdspermisjon</h3><p>Bedriften innvilger korte permisjoner ved spesielle anledninger som flytting, legebesøk, dødsfall og begravelse i nær familie. Lengde avtales med nærmeste leder.</p>" : ""}`,
    }),
    foreldreperm: () => ({
      title: "Foreldrepermisjon",
      content: `<h2>Foreldrepermisjon</h2><p>Ansatte i <span class="editable-field" data-field="Bedriftsnavn">${company}</span> har rett til foreldrepermisjon i henhold til arbeidsmiljølovens bestemmelser.</p><h3>Lovfestet rett</h3><p>Foreldre har rett til inntil 12 måneders permisjon i forbindelse med fødsel eller adopsjon. Foreldrepenger utbetales via NAV basert på opptjening.</p>${form.parentalLeaveExtra ? `<h3>Utvidet ordning</h3><p>${company} tilbyr i tillegg <span class="editable-field" data-field="Ekstra foreldreperm">${form.parentalLeaveWeeks} uker</span> med full lønn utover folketrygdens dekning, for å støtte ansatte i en viktig livsfase.</p>` : ""}<h3>Tilrettelegging</h3><ul><li>Gravide ansatte har rett til tilrettelegging av arbeidsoppgaver og arbeidssted.</li><li>Ammefri innvilges i henhold til arbeidsmiljøloven § 12-8.</li><li>Gradert permisjon og fleksibel oppstart etter permisjon kan avtales med leder.</li></ul>`,
    }),
    hjemmekontor: () => ({
      title: "Hjemmekontor",
      content: form.homeOfficeAllowed
        ? `<h2>Hjemmekontor</h2><p><span class="editable-field" data-field="Bedriftsnavn">${company}</span> tilbyr mulighet for hjemmekontor inntil <span class="editable-field" data-field="Hjemmekontor dager">${form.homeOfficeDays === "flexible" ? "et fleksibelt antall" : form.homeOfficeDays}</span> dager per uke, etter avtale med nærmeste leder.</p><h3>Krav og forventninger</h3><ul><li>Arbeidstid og tilgjengelighet gjelder som normalt: ${form.homeOfficeAvailability}</li><li>Ansatte skal ha en egnet arbeidsplass hjemme.</li>${form.homeOfficeEquipment ? "<li>Bedriften dekker nødvendig utstyr som skjerm, tastatur og kontorstoI.</li>" : ""}${form.homeOfficeInternetStipend ? "<li>Bedriften bidrar til dekning av internett-kostnader.</li>" : ""}<li>Sensitiv informasjon skal behandles med samme aktsomhet som på kontoret.</li></ul><h3>Avtale</h3><p>Fast hjemmekontorordning krever skriftlig avtale i henhold til forskrift om hjemmearbeid.</p>`
        : `<h2>Hjemmekontor</h2><p><span class="editable-field" data-field="Bedriftsnavn">${company}</span> har per i dag ikke en fast hjemmekontorordning. Behov for hjemmekontor vurderes individuelt av nærmeste leder.</p>`,
    }),
    lonn: () => ({
      title: "Lønn og godtgjørelser",
      content: `<h2>Lønn og godtgjørelser</h2><p>Lønn i <span class="editable-field" data-field="Bedriftsnavn">${company}</span> utbetales <span class="editable-field" data-field="Lønnsutbetaling">${form.salaryFrequency === "monthly" ? `månedlig, ${payDayText}` : "annenhver uke"}</span>.</p><h3>Lønnsfastsettelse</h3><p>Lønn fastsettes individuelt basert på stilling, kompetanse, erfaring og ansvar. Årlige lønnsforhandlinger gjennomføres normalt i <span class="editable-field" data-field="Lønnsforhandling-måned">${form.salaryNegotiationMonth}</span>.</p>${form.bonusScheme !== "none" ? `<h3>Bonus</h3><p>${form.bonusScheme === "annual" ? "Bedriften har en årlig resultatbasert bonusordning." : form.bonusScheme === "quarterly" ? "Bedriften har en kvartalsvis bonusordning knyttet til avdelingsmål." : "Bonus vurderes skjønnsmessig basert på individuelle prestasjoner."}</p>` : ""}${benefitsList.length > 0 ? `<h3>Goder og tilskudd</h3><ul>${benefitsList.map(b => `<li>${b}</li>`).join("")}</ul>` : ""}<h3>Reisegodtgjørelse</h3><p>${form.travelPolicy === "state-rates" ? "Reiseutgifter dekkes etter statens satser." : form.travelPolicy === "actual-costs" ? "Reiseutgifter dekkes etter faktiske kostnader mot kvittering." : "Reiseutgifter dekkes med fast diettsats."} Reiser skal forhåndsgodkjennes av leder.</p>${form.otherBenefits ? `<h3>Andre goder</h3><p>${form.otherBenefits}</p>` : ""}`,
    }),
    pensjon: () => ({
      title: "Pensjon og forsikring",
      content: `<h2>Pensjon og forsikring</h2><h3>Pensjonsordning</h3><p><span class="editable-field" data-field="Bedriftsnavn">${company}</span> har ${form.pensionScheme === "obligatorisk" ? `obligatorisk tjenestepensjon (OTP) med <span class="editable-field" data-field="Pensjonsprosent">${form.pensionPercent}%</span> av lønn` : form.pensionScheme === "utvidet" ? `utvidet pensjonsordning med <span class="editable-field" data-field="Pensjonsprosent">${form.pensionPercent}%</span> av lønn` : `innskuddsbasert pensjon med <span class="editable-field" data-field="Pensjonsprosent">${form.pensionPercent}%</span> sparesats`}. Pensjonsordningen gjelder for alle ansatte over 20 år med stilling over 20%.</p>${selectedInsurances.length > 0 ? `<h3>Forsikringer</h3><ul>${selectedInsurances.map(ins => `<li>${ins}</li>`).join("")}</ul>` : "<h3>Forsikringer</h3><p>Lovpålagt yrkesskadeforsikring er inkludert. Ta kontakt med HR for informasjon om eventuelle tilleggsforsikringer.</p>"}`,
    }),
    kompetanse: () => ({
      title: "Kompetanseutvikling",
      content: `<h2>Kompetanseutvikling</h2><p><span class="editable-field" data-field="Bedriftsnavn">${company}</span> legger stor vekt på faglig og personlig utvikling for alle ansatte.</p><h3>Muligheter</h3><ul><li>Årlige utviklingssamtaler med nærmeste leder</li><li>Tilgang til relevante kurs og konferanser</li><li>Intern kompetansedeling gjennom faglunsjer og workshops</li></ul>${form.trainingBudget ? `<h3>Kompetansebudsjett</h3><p>Hver ansatt har et årlig kompetansebudsjett på <span class="editable-field" data-field="Kompetansebudsjett">${Number(form.trainingBudgetAmount).toLocaleString("no-NO")} kr</span> som kan benyttes til relevante kurs, sertifiseringer og utdanning.</p>` : `<h3>Støtteordning</h3><p>Ansatte kan søke om støtte til relevante kurs, sertifiseringer og utdanning. Søknader vurderes av leder og godkjennes av <span class="editable-field" data-field="Godkjenner kompetanse">HR/daglig leder</span>.</p>`}`,
    }),
    reise: () => ({
      title: "Reise og utlegg",
      content: `<h2>Reise og utlegg</h2><p>Retningslinjer for tjenestereiser og utlegg i <span class="editable-field" data-field="Bedriftsnavn">${company}</span>.</p><h3>Tjenestereiser</h3><ul><li>Alle tjenestereiser skal forhåndsgodkjennes av nærmeste leder.</li><li>Reiser bestilles etter prinsippet om rimeligste hensiktsmessige alternativ.</li><li>${form.travelPolicy === "state-rates" ? "Diett og kjøregodtgjørelse dekkes etter statens satser." : form.travelPolicy === "actual-costs" ? "Alle utgifter dekkes mot kvittering." : "Fast diettsats benyttes for kost og losji."}</li></ul><h3>Utlegg</h3><ul><li>Utlegg på vegne av bedriften skal dokumenteres med kvittering.</li><li>Utleggsrapport leveres innen 14 dager etter utlegget.</li><li>Bedriftskort kan benyttes der dette er tildelt.</li></ul>`,
    }),
    konflikter: () => ({
      title: "Konflikthåndtering",
      content: `<h2>Konflikthåndtering</h2><p><span class="editable-field" data-field="Bedriftsnavn">${company}</span> ønsker et arbeidsmiljø fritt for uløste konflikter som påvirker trivsel og produktivitet.</p><h3>Fremgangsmåte</h3><ol><li><strong>Direkte dialog</strong> — Partene oppfordres til å løse konflikten seg imellom.</li><li><strong>Lederinvolvering</strong> — Dersom direkte dialog ikke fører frem, involveres nærmeste leder.</li><li><strong>${form.conflictPolicy === "external" ? "Ekstern mekler/BHT" : form.conflictPolicy === "committee" ? "Konflikthåndteringsutvalg" : "HR-mekling"}</strong> — ${form.conflictPolicy === "external" ? "Ved behov benyttes ekstern mekler eller bedriftshelsetjenesten." : form.conflictPolicy === "committee" ? "Saken kan løftes til bedriftens konflikthåndteringsutvalg." : "HR bistår med mekling og tilrettelegging."}</li></ol><h3>Dokumentasjon</h3><p>Alle formelle konfliktsaker dokumenteres skriftlig og oppbevares konfidensielt av HR.</p>`,
    }),
    hms: () => ({
      title: "HMS og arbeidsmiljø",
      content: `<h2>HMS og arbeidsmiljø</h2><p><span class="editable-field" data-field="Bedriftsnavn">${company}</span> er forpliktet til å sikre et trygt og godt arbeidsmiljø for alle ansatte, i henhold til arbeidsmiljøloven og internkontrollforskriften.</p><h3>Ansvar</h3><ul><li><strong>Arbeidsgiver</strong> har det overordnede ansvaret for HMS-arbeidet.</li><li><strong>Verneombud</strong> skal ivareta arbeidstakernes interesser i HMS-saker.</li><li><strong>Alle ansatte</strong> har plikt til å melde fra om farlige forhold.</li></ul><h3>Forebygging</h3><p>Det gjennomføres årlige vernerunder og risikovurderinger. Alle arbeidsulykker og nestenulykker skal rapporteres umiddelbart.</p>`,
    }),
    psykososialt: () => ({
      title: "Psykososialt arbeidsmiljø (2026-krav)",
      content: `<h2>Psykososialt arbeidsmiljø</h2><p class="text-sm italic" style="color:#0d9488;margin-bottom:1em;">🆕 Nytt krav fra 2026 — arbeidsmiljøloven § 4-3</p><p><span class="editable-field" data-field="Bedriftsnavn">${company}</span> skal sikre at det psykososiale arbeidsmiljøet er fullt forsvarlig, og aktivt forebygge mobbing, trakassering, diskriminering og andre psykiske belastninger.</p><h3>Forebygging</h3><ul><li>Alle ansatte skal behandle hverandre med respekt og bidra til et inkluderende arbeidsmiljø.</li><li>Ledere har et særskilt ansvar for å følge opp det psykososiale arbeidsmiljøet.</li><li>Det skal gjennomføres regelmessige samtaler mellom leder og ansatt om trivsel og arbeidsbelastning.</li></ul><h3>Håndtering</h3><p>Ved konflikter, mobbing eller trakassering skal saken meldes til nærmeste leder, verneombud eller <span class="editable-field" data-field="Varslingskanal psykososialt">${form.whistleblowerChannel}</span>.</p><h3>Oppfølging</h3><p>Bedriften skal dokumentere tiltak og evaluere effekten minst <span class="editable-field" data-field="Evaluering psykososialt">${form.riskAssessmentFrequency === "quarterly" ? "kvartalsvis" : form.riskAssessmentFrequency === "biannual" ? "halvårlig" : "årlig"}</span>.</p>`,
    }),
    risikovurdering: () => ({
      title: "Risikovurdering (2026-krav)",
      content: `<h2>Risikovurdering</h2><p class="text-sm italic" style="color:#0d9488;margin-bottom:1em;">🆕 Nytt krav fra 2026 — internkontrollforskriften § 5</p><p><span class="editable-field" data-field="Bedriftsnavn">${company}</span> skal gjennomføre systematiske risikovurderinger som dekker både fysiske og psykososiale risikofaktorer.</p><h3>Hyppighet</h3><p>Risikovurderinger gjennomføres <span class="editable-field" data-field="Risikovurdering hyppighet">${form.riskAssessmentFrequency === "quarterly" ? "kvartalsvis" : form.riskAssessmentFrequency === "biannual" ? "halvårlig" : form.riskAssessmentFrequency === "continuous" ? "kontinuerlig og ved vesentlige endringer" : "årlig"}</span>.</p><h3>Metode</h3><ul><li>Identifisere farekilder og risikoforhold</li><li>Vurdere sannsynlighet og konsekvens</li><li>Prioritere og iverksette tiltak</li><li>Dokumentere vurderinger og beslutninger</li></ul><h3>Ansvar</h3><p>${form.ceoName || "Daglig leder"} har det overordnede ansvaret. Verneombud og ansatte skal medvirke. Resultatene skal dokumenteres og være tilgjengelige for Arbeidstilsynet.</p>`,
    }),
    kartlegging: () => ({
      title: "Kartlegging av arbeidsmiljø (2026-krav)",
      content: `<h2>Kartlegging av arbeidsmiljø</h2><p class="text-sm italic" style="color:#0d9488;margin-bottom:1em;">🆕 Nytt krav fra 2026 — arbeidsmiljøloven § 3-1</p><p><span class="editable-field" data-field="Bedriftsnavn">${company}</span> skal gjennomføre regelmessige kartlegginger av arbeidsmiljøet.</p>${form.employeeSurvey ? `<h3>Medarbeiderundersøkelser</h3><p>Det gjennomføres medarbeiderundersøkelser <span class="editable-field" data-field="Kartlegging hyppighet">${form.surveyFrequency === "quarterly" ? "kvartalsvis" : form.surveyFrequency === "biannual" ? "halvårlig" : "årlig"}</span>. Undersøkelsene er anonyme og dekker:</p><ul><li>Psykososialt arbeidsmiljø og trivsel</li><li>Arbeidsbelastning og stressnivå</li><li>Fysisk arbeidsmiljø</li><li>Ledelse og kommunikasjon</li><li>Muligheter for faglig utvikling</li></ul>` : "<h3>Andre kartleggingsmetoder</h3><p>Kartlegging gjennomføres gjennom vernerunder, medarbeidersamtaler og observasjon.</p>"}<h3>Oppfølging</h3><p>Resultater presenteres for ansatte og danner grunnlag for handlingsplaner og tiltak.</p>`,
    }),
    handlingsplan: () => ({
      title: "Handlingsplaner (2026-krav)",
      content: `<h2>Handlingsplaner</h2><p class="text-sm italic" style="color:#0d9488;margin-bottom:1em;">🆕 Nytt krav fra 2026 — internkontrollforskriften § 5</p><p><span class="editable-field" data-field="Bedriftsnavn">${company}</span> skal utarbeide konkrete handlingsplaner basert på risikovurderinger og kartlegging.</p><h3>Innhold</h3><ul><li><strong>Identifisert risiko</strong> — hva er problemet?</li><li><strong>Konkrete tiltak</strong> — hva skal gjøres?</li><li><strong>Ansvarlig:</strong> <span class="editable-field" data-field="Handlingsplan ansvarlig">${form.actionPlanResponsible || form.ceoName || "daglig leder"}</span></li><li><strong>Tidsfrist</strong> — når skal tiltaket være gjennomført?</li><li><strong>Evaluering</strong> — hvordan måles effekten?</li></ul><h3>Dokumentasjon</h3><p>Alle handlingsplaner dokumenteres og oppbevares tilgjengelig for ansatte og Arbeidstilsynet.</p>`,
    }),
    personvern: () => ({
      title: "Personvern og IT",
      content: `<h2>Personvern og IT</h2><p><span class="editable-field" data-field="Bedriftsnavn">${company}</span> behandler personopplysninger i henhold til personopplysningsloven og GDPR.</p><h3>IT-bruk</h3><ul><li>Bedriftens IT-utstyr og systemer skal primært brukes til arbeidsformål.</li><li>Passord skal være sterke og unike, og skal ikke deles med andre.</li><li>All programvare skal godkjennes av IT-ansvarlig.</li></ul><h3>Lagring av personopplysninger</h3><p>Kun nødvendige personopplysninger lagres, og de slettes når formålet er oppfylt. Ansatte har rett til innsyn i egne personopplysninger.</p>`,
    }),
    sosiale: () => ({
      title: "Sosiale medier",
      content: `<h2>Sosiale medier</h2><p>Ansatte i <span class="editable-field" data-field="Bedriftsnavn">${company}</span> ${form.socialMediaPolicy === "strict" ? "skal ikke publisere firmarelatert innhold på sosiale medier uten forhåndsgodkjenning" : form.socialMediaPolicy === "oppmuntret" ? "oppfordres til å dele positive bedriftsopplevelser som del av ambassadørprogrammet" : "forventes å utvise godt skjønn ved omtale av bedriften på sosiale medier"}.</p><h3>Retningslinjer</h3><ul><li>Ikke del konfidensielt materiale, interne diskusjoner eller kundeinformasjon.</li><li>Vær tydelig på at meninger er dine egne.</li><li>Vis respekt for kollegaer, kunder og samarbeidspartnere.</li></ul>`,
    }),
    kleskode: () => ({
      title: "Kleskode",
      content: `<h2>Kleskode</h2><p><span class="editable-field" data-field="Bedriftsnavn">${company}</span> har ${form.dressCode === "formal" ? "en formell kleskode. Ansatte forventes å kle seg i dress/drakt" : form.dressCode === "business-casual" ? "en business casual kleskode. Ansatte forventes å kle seg pent, men behagelig" : form.dressCode === "casual" ? "en uformell kleskode. Ansatte kan kle seg avslappet, men ryddig" : "ingen spesifikke krav til kleskode, men forventer passende antrekk"}.</p><p>Ved kundemøter og representasjon forventes et profesjonelt antrekk.</p>`,
    }),
    varsling: () => ({
      title: "Varsling og etikk",
      content: `<h2>Varsling og etikk</h2><p>Ansatte i <span class="editable-field" data-field="Bedriftsnavn">${company}</span> har rett og plikt til å varsle om kritikkverdige forhold, jf. arbeidsmiljøloven kapittel 2A.</p><h3>Hva kan varsles om?</h3><ul><li>Brudd på lover og regler</li><li>Korrupsjon, underslag eller økonomisk kriminalitet</li><li>Trakassering, mobbing eller diskriminering</li><li>Fare for liv og helse</li></ul><h3>Varslingskanal</h3><p>Varsling kan gjøres til nærmeste leder, verneombud eller direkte til <span class="editable-field" data-field="Varslingskanal">${form.whistleblowerChannel}</span>. Varsler behandles konfidensielt, og det er forbudt å gjengjelde.</p>`,
    }),
    // (konflikter already defined above)
    avslutning: () => ({
      title: "Oppsigelse og avslutning",
      content: `<h2>Oppsigelse og avslutning</h2><p>Oppsigelse av arbeidsforhold i <span class="editable-field" data-field="Bedriftsnavn">${company}</span> følger arbeidsmiljølovens bestemmelser.</p><h3>Oppsigelsestid</h3><p>Den gjensidige oppsigelsestiden er <span class="editable-field" data-field="Oppsigelsestid">${form.noticePeriod} måneder</span> med mindre annet er avtalt.</p><h3>Sluttrutiner</h3><ul><li>Tilbakelevering av utstyr, nøkler og tilgangskortet</li><li>Deaktivering av IT-tilganger</li><li>Sluttoppgjør inkludert eventuelle feriepenger</li><li>Sluttsamtale med leder</li></ul><h3>Attest</h3><p>Alle ansatte har rett til en skriftlig sluttattest.</p>`,
    }),
    baerekraft: () => ({
      title: "Bærekraft og samfunnsansvar",
      content: `<h2>Bærekraft og samfunnsansvar</h2><p><span class="editable-field" data-field="Bedriftsnavn">${company}</span> tar bærekraft og samfunnsansvar på alvor.</p><h3>Miljø</h3><ul><li>Kildesortering og resirkulering på arbeidsplassen</li><li>Redusert papirbruk gjennom digitalisering</li><li>Miljøvennlige reisealternativer</li></ul><h3>Sosialt ansvar</h3><p>Vi støtter likestilling, mangfold og inkludering. ${form.diversityStatement ? "Vi er forpliktet til å skape en arbeidsplass fri for diskriminering." : ""}</p>`,
    }),
    arbeidsreglement: () => ({
      title: "Arbeidsreglement",
      content: `<h2>Arbeidsreglement</h2><p>Dette arbeidsreglementet gjelder for alle ansatte i <span class="editable-field" data-field="Bedriftsnavn">${company}</span> og er fastsatt i henhold til arbeidsmiljøloven kapittel 14.</p><h3>Ordensregler</h3><ul><li>Alle ansatte plikter å overholde fastsatt arbeidstid og melde fra ved fravær.</li><li>Bedriftens utstyr og eiendeler skal behandles med forsiktighet.</li><li>Alkohol og rusmidler skal ikke inntas eller medbringes på arbeidsplassen.</li><li>Røyking er kun tillatt på anviste steder.</li></ul><h3>Adgangskontroll</h3><p>Adgangskort/nøkler er personlige og skal ikke lånes bort.</p><h3>Sanksjoner</h3><p>Brudd kan medføre advarsel. Gjentatte eller grove brudd kan gi grunnlag for oppsigelse.</p>`,
    }),
    internkontroll: () => ({
      title: "Internkontroll (IK-HMS)",
      content: `<h2>Internkontroll — HMS</h2><p><span class="editable-field" data-field="Bedriftsnavn">${company}</span> har et systematisk internkontrollsystem i henhold til internkontrollforskriften.</p><h3>Organisering</h3><ul><li><strong>Daglig leder:</strong> ${form.ceoName || "[Navn]"}</li><li><strong>Verneombud:</strong> <span class="editable-field" data-field="Verneombud">[Navn]</span></li><li><strong>HMS-ansvarlig:</strong> <span class="editable-field" data-field="HMS-ansvarlig">[Navn]</span></li></ul><h3>IK-systemets innhold</h3><ol><li>Mål for HMS-arbeidet</li><li>Oversikt over organisasjon og ansvarsforhold</li><li>Kartlegging av farer og risikovurdering</li><li>Handlingsplaner med tiltak og tidsfrister</li><li>Rutiner for avvikshåndtering</li><li>Systematisk overvåking og gjennomgang</li><li>Dokumentasjon og arkivering</li></ol>`,
    }),
    gdpr: () => ({
      title: "GDPR-compliance",
      content: `<h2>GDPR-compliance</h2><p><span class="editable-field" data-field="Bedriftsnavn">${company}</span> behandler personopplysninger i samsvar med GDPR og personopplysningsloven.</p><h3>Behandlingsansvarlig</h3><p>Behandlingsansvarlig er ${company} ved ${form.ceoName || "daglig leder"}.</p><h3>Behandlingsgrunnlag</h3><ul><li>Oppfyllelse av arbeidsavtale (art. 6(1)(b))</li><li>Rettslig forpliktelse (art. 6(1)(c))</li><li>Berettiget interesse (art. 6(1)(f))</li><li>Samtykke (art. 6(1)(a))</li></ul><h3>Ansattes rettigheter</h3><ul><li>Innsyn, retting, sletting, dataportabilitet, innsigelse</li></ul><h3>Sikkerhetsbrudd</h3><p>Datatilsynet varsles innen 72 timer ved brudd som utgjør risiko for de registrerte.</p>`,
    }),
    databehandler: () => ({
      title: "Databehandleravtaler",
      content: `<h2>Databehandleravtaler</h2><p><span class="editable-field" data-field="Bedriftsnavn">${company}</span> har inngått databehandleravtaler med alle tredjeparter som behandler personopplysninger på vegne av selskapet (GDPR art. 28).</p><h3>Kategorier</h3><ul><li>Regnskapssystem og lønnsleverandør</li><li>Skylagring og IT-infrastruktur</li><li>Rekrutteringsverktøy og HR-system</li><li>E-post og kommunikasjonsplattformer</li></ul><h3>Krav</h3><ul><li>Skriftlig avtale før behandling starter</li><li>Tilfredsstillende sikkerhetstiltak</li><li>Overføring utenfor EØS krever tilleggsgarantier</li></ul>`,
    }),
    digitalt: () => ({
      title: "Digital arbeidsplass",
      content: `<h2>Digital arbeidsplass — DIGIS-tillegg</h2><p><span class="editable-field" data-field="Bedriftsnavn">${company}</span> legger til rette for en moderne, digital arbeidsplass.</p><h3>Digitale verktøy</h3><ul><li><span class="editable-field" data-field="Kommunikasjonsverktøy">Microsoft Teams / Slack</span> for kommunikasjon</li><li><span class="editable-field" data-field="Prosjektverktøy">Asana / Trello / Jira</span> for prosjektstyring</li><li><span class="editable-field" data-field="Skylagring">OneDrive / Google Drive</span> for dokumentlagring</li></ul><h3>Cybersikkerhet</h3><ul><li>Totrinnsverifisering (2FA) påkrevd</li><li>Passord minimum <span class="editable-field" data-field="Passordlengde">12 tegn</span></li><li>Ikke bruk offentlige Wi-Fi uten VPN</li></ul>`,
    }),
    airetningslinjer: () => ({
      title: "AI og automatisering",
      content: `<h2>AI og automatisering</h2><p><span class="editable-field" data-field="Bedriftsnavn">${company}</span> anerkjenner verdien av AI og ønsker ansvarlig bruk.</p><h3>Retningslinjer</h3><ul><li>AI-verktøy kan brukes til tekstproduksjon, analyse og idéutvikling.</li><li>Konfidensiell informasjon skal <strong>ikke</strong> deles med eksterne AI-verktøy uten godkjenning.</li><li>AI-generert innhold skal kvalitetssikres før publisering.</li><li>Ansatte skal være transparente om bruk av AI.</li></ul><h3>Godkjente verktøy</h3><p><span class="editable-field" data-field="Godkjente AI-verktøy">Microsoft Copilot, ChatGPT Enterprise</span>.</p>`,
    }),
    hybridarbeid: () => ({
      title: "Hybridarbeid og fleksibilitet",
      content: `<h2>Hybridarbeid og fleksibilitet</h2><p><span class="editable-field" data-field="Bedriftsnavn">${company}</span> praktiserer en hybrid arbeidsmodell.</p><h3>Prinsipper</h3><ul><li>Hybridarbeid skal ikke gå på bekostning av samarbeid eller produktivitet.</li><li>Ledere og team avtaler felles kontordager.</li><li>Kjernetid gjelder uansett lokasjon: ${form.coreHoursStart}–${form.coreHoursEnd}</li></ul><h3>Evaluering</h3><p>Hybridmodellen evalueres <span class="editable-field" data-field="Evaluering hybrid">halvårlig</span>.</p>`,
    }),
  };

  for (const modId of form.modules) {
    const builder = moduleMap[modId];
    if (builder) chapters.push(builder());
  }

  return chapters;
}

export default HrGenerator;
