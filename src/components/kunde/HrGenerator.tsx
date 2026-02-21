import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Building2, Clock, Home, Sparkles, Wallet, LayoutGrid, FileCheck,
  ChevronRight, ChevronLeft, Check, Loader2
} from "lucide-react";

/* ───────── Types ───────── */
type StepId = "bedrift" | "arbeidstid" | "hjemmekontor" | "moderne" | "lonn" | "moduler" | "generer";

interface StepDef {
  id: StepId;
  label: string;
  icon: React.ElementType;
}

const STEPS: StepDef[] = [
  { id: "bedrift",       label: "Bedrift",       icon: Building2 },
  { id: "arbeidstid",    label: "Arbeidstid",    icon: Clock },
  { id: "hjemmekontor",  label: "Hjemmekontor",  icon: Home },
  { id: "moderne",       label: "Moderne",       icon: Sparkles },
  { id: "lonn",          label: "Lønn",          icon: Wallet },
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
  // Arbeidstid
  normalHours: string;
  flexTime: boolean;
  coreHoursStart: string;
  coreHoursEnd: string;
  overtimePolicy: string;
  // Hjemmekontor
  homeOfficeAllowed: boolean;
  homeOfficeDays: string;
  homeOfficeEquipment: boolean;
  homeOfficeAvailability: string;
  // Moderne
  dressCode: string;
  socialMediaPolicy: string;
  sustainabilityFocus: boolean;
  diversityStatement: boolean;
  // Lønn
  salaryFrequency: string;
  pensionScheme: string;
  insuranceIncluded: boolean;
  bonusScheme: string;
  otherBenefits: string;
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
  normalHours: "37.5",
  flexTime: true,
  coreHoursStart: "09:00",
  coreHoursEnd: "15:00",
  overtimePolicy: "compensation",
  homeOfficeAllowed: true,
  homeOfficeDays: "2",
  homeOfficeEquipment: true,
  homeOfficeAvailability: "Ansatte skal være tilgjengelige i kjernetiden.",
  dressCode: "casual",
  socialMediaPolicy: "ansvarlig",
  sustainabilityFocus: true,
  diversityStatement: true,
  salaryFrequency: "monthly",
  pensionScheme: "obligatorisk",
  insuranceIncluded: true,
  bonusScheme: "none",
  otherBenefits: "",
  modules: [
    "formaal", "ansettelse", "arbeidstid", "ferie", "sykdom",
    "hjemmekontor", "lonn", "hms", "personvern", "avslutning"
  ],
};

const ALL_MODULES = [
  { id: "formaal",      label: "Formål og omfang" },
  { id: "ansettelse",   label: "Ansettelse og prøvetid" },
  { id: "arbeidstid",   label: "Arbeidstid og fleksibilitet" },
  { id: "ferie",        label: "Ferie og fridager" },
  { id: "sykdom",       label: "Sykdom og fravær" },
  { id: "hjemmekontor", label: "Hjemmekontor" },
  { id: "lonn",         label: "Lønn og godtgjørelser" },
  { id: "pensjon",      label: "Pensjon og forsikring" },
  { id: "hms",          label: "HMS og arbeidsmiljø" },
  { id: "personvern",   label: "Personvern og IT" },
  { id: "sosiale",      label: "Sosiale medier" },
  { id: "kleskode",     label: "Kleskode" },
  { id: "varsling",     label: "Varsling og etikk" },
  { id: "kompetanse",   label: "Kompetanseutvikling" },
  { id: "avslutning",   label: "Oppsigelse og avslutning" },
  { id: "baerekraft",   label: "Bærekraft og samfunnsansvar" },
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

      toast.success("Personalhåndbok generert!");
      onComplete?.();
    } catch (err) {
      console.error(err);
      toast.error("Noe gikk galt under genereringen.");
    }
    setGenerating(false);
  };

  /* ───────── Render step content ───────── */
  const renderStep = () => {
    switch (STEPS[currentStep].id) {
      case "bedrift": return <StepBedrift form={form} update={update} />;
      case "arbeidstid": return <StepArbeidstid form={form} update={update} />;
      case "hjemmekontor": return <StepHjemmekontor form={form} update={update} />;
      case "moderne": return <StepModerne form={form} update={update} />;
      case "lonn": return <StepLonn form={form} update={update} />;
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
                onClick={() => i <= currentStep && setCurrentStep(i)}
                className="flex flex-col items-center gap-1.5 group"
                disabled={i > currentStep}
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
  );
};

/* ───────── Step descriptions ───────── */
function stepDescription(step: number) {
  const descs = [
    "Grunnleggende informasjon om din bedrift",
    "Definer arbeidstid, fleksibilitet og overtid",
    "Retningslinjer for hjemmekontor",
    "Kleskode, sosiale medier og bærekraft",
    "Lønn, pensjon, forsikring og goder",
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
    <div className={`w-10 h-6 rounded-full flex items-center shrink-0 transition-colors mt-0.5 ${checked ? "bg-primary" : "bg-muted"}`}>
      <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${checked ? "translate-x-5" : "translate-x-1"}`} />
    </div>
    <div>
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
        <div>
          <FieldLabel>Tilgjengelighet</FieldLabel>
          <FieldInput value={form.homeOfficeAvailability} onChange={v => update("homeOfficeAvailability", v)} placeholder="Krav til tilgjengelighet på hjemmekontor" />
        </div>
      </>
    )}
  </div>
);

/* ───────── Step 4: Moderne ───────── */
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

/* ───────── Step 5: Lønn ───────── */
const StepLonn = ({ form, update }: { form: FormData; update: <K extends keyof FormData>(k: K, v: FormData[K]) => void }) => (
  <div className="space-y-5">
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
      <FieldLabel>Pensjonsordning</FieldLabel>
      <FieldSelect
        value={form.pensionScheme}
        onChange={v => update("pensionScheme", v)}
        options={[
          { value: "obligatorisk", label: "Obligatorisk tjenestepensjon (OTP) – minstekrav" },
          { value: "utvidet", label: "Utvidet pensjonsordning (inntil 7%)" },
          { value: "innskudd", label: "Innskuddsbasert med høyere sparing" },
        ]}
      />
    </div>
    <FieldToggle
      label="Forsikringer inkludert"
      checked={form.insuranceIncluded}
      onChange={v => update("insuranceIncluded", v)}
      description="Yrkesskadeforsikring, gruppelivsforsikring og helseforsikring."
    />
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
    <div>
      <FieldLabel>Andre goder</FieldLabel>
      <FieldInput value={form.otherBenefits} onChange={v => update("otherBenefits", v)} placeholder="F.eks. treningsstøtte, lunsj, telefon…" />
    </div>
  </div>
);

/* ───────── Step 6: Moduler ───────── */
const StepModuler = ({ form, toggleModule }: { form: FormData; toggleModule: (id: string) => void }) => (
  <div className="space-y-4">
    <p className="text-sm text-muted-foreground">Velg hvilke kapitler som skal inngå i din personalhåndbok. Du kan alltid legge til eller fjerne kapitler senere.</p>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {ALL_MODULES.map(mod => {
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
    <p className="text-xs text-muted-foreground">{form.modules.length} av {ALL_MODULES.length} kapitler valgt</p>
  </div>
);

/* ───────── Step 7: Generer ───────── */
const StepGenerer = ({ form }: { form: FormData }) => (
  <div className="space-y-6">
    <p className="text-sm text-muted-foreground">Se over valgene dine før du genererer personalhåndboken. Du kan gå tilbake og endre om nødvendig.</p>

    <div className="space-y-4">
      <SummarySection title="Bedrift">
        <SummaryRow label="Selskap" value={form.companyName} />
        <SummaryRow label="Org.nr" value={form.orgNumber || "—"} />
        <SummaryRow label="Ansatte" value={form.employeeCount} />
        <SummaryRow label="Bransje" value={form.industry} />
      </SummarySection>

      <SummarySection title="Arbeidstid">
        <SummaryRow label="Normal uke" value={`${form.normalHours} timer`} />
        <SummaryRow label="Fleksitid" value={form.flexTime ? `Ja (${form.coreHoursStart}–${form.coreHoursEnd})` : "Nei"} />
        <SummaryRow label="Overtid" value={form.overtimePolicy === "compensation" ? "Betaling" : form.overtimePolicy === "timeoff" ? "Avspasering" : "Valgfritt"} />
      </SummarySection>

      <SummarySection title="Hjemmekontor">
        <SummaryRow label="Tillatt" value={form.homeOfficeAllowed ? "Ja" : "Nei"} />
        {form.homeOfficeAllowed && <>
          <SummaryRow label="Dager/uke" value={form.homeOfficeDays === "flexible" ? "Fleksibelt" : form.homeOfficeDays} />
          <SummaryRow label="Utstyr dekkes" value={form.homeOfficeEquipment ? "Ja" : "Nei"} />
        </>}
      </SummarySection>

      <SummarySection title="Lønn & goder">
        <SummaryRow label="Utbetaling" value={form.salaryFrequency === "monthly" ? "Månedlig" : "Annenhver uke"} />
        <SummaryRow label="Pensjon" value={form.pensionScheme} />
        <SummaryRow label="Forsikring" value={form.insuranceIncluded ? "Inkludert" : "Ikke inkludert"} />
      </SummarySection>

      <SummarySection title="Moduler">
        <p className="text-sm text-muted-foreground">
          {form.modules.map(m => ALL_MODULES.find(a => a.id === m)?.label).filter(Boolean).join(" · ")}
        </p>
      </SummarySection>
    </div>
  </div>
);

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

  const moduleMap: Record<string, () => { title: string; content: string }> = {
    formaal: () => ({
      title: "Formål og omfang",
      content: `<h2>Formål og omfang</h2><p>Denne personalhåndboken gjelder for alle ansatte i <span class="editable-field" data-field="Bedriftsnavn">${company}</span>. Håndboken er ment som en veiledning for arbeidsforholdet og inneholder retningslinjer, rettigheter og plikter.</p><p>Håndboken erstatter ikke lover, forskrifter eller individuelle arbeidsavtaler, men utfyller disse. Ved motstrid mellom håndboken og gjeldende lovgivning, vil loven ha forrang.</p><p>Alle ansatte er ansvarlige for å gjøre seg kjent med innholdet i denne håndboken.</p>`,
    }),
    ansettelse: () => ({
      title: "Ansettelse og prøvetid",
      content: `<h2>Ansettelse og prøvetid</h2><p>Alle ansettelser i <span class="editable-field" data-field="Bedriftsnavn">${company}</span> skjer i henhold til arbeidsmiljøloven. Nye ansatte mottar en skriftlig arbeidsavtale senest innen <span class="editable-field" data-field="Frist arbeidsavtale">7 dager</span> etter arbeidsforholdets start.</p><h3>Prøvetid</h3><p>Prøvetiden er normalt <span class="editable-field" data-field="Prøvetid">6 måneder</span>. I prøvetiden gjelder en gjensidig oppsigelsestid på <span class="editable-field" data-field="Oppsigelsestid prøvetid">14 dager</span>.</p><h3>Taushetsplikt</h3><p>Alle ansatte har taushetsplikt om bedriftens interne forhold, forretningshemmeligheter og kundeforhold, både under og etter ansettelsesforholdet.</p>`,
    }),
    arbeidstid: () => ({
      title: "Arbeidstid og fleksibilitet",
      content: `<h2>Arbeidstid og fleksibilitet</h2><p>Normal arbeidstid i <span class="editable-field" data-field="Bedriftsnavn">${company}</span> er <span class="editable-field" data-field="Arbeidstid">${form.normalHours} timer</span> per uke, fordelt på mandag til fredag.</p>${form.flexTime ? `<h3>Fleksitid</h3><p>Bedriften tilbyr fleksitid. Kjernetiden er fra <span class="editable-field" data-field="Kjernetid start">${form.coreHoursStart}</span> til <span class="editable-field" data-field="Kjernetid slutt">${form.coreHoursEnd}</span>. Utover kjernetiden kan arbeidstiden tilpasses etter avtale med nærmeste leder.</p>` : ""}<h3>Overtid</h3><p>${form.overtimePolicy === "compensation" ? "Overtidsarbeid kompenseres i henhold til arbeidsmiljølovens bestemmelser med tillegg på 40%." : form.overtimePolicy === "timeoff" ? "Overtid avspaseres time for time etter avtale med leder." : "Ansatte kan velge mellom overtidsbetaling og avspasering, etter avtale med leder."}</p><p>Alt overtidsarbeid skal være forhåndsgodkjent av nærmeste leder.</p>`,
    }),
    ferie: () => ({
      title: "Ferie og fridager",
      content: `<h2>Ferie og fridager</h2><p>Ansatte i <span class="editable-field" data-field="Bedriftsnavn">${company}</span> har rett til <span class="editable-field" data-field="Feriedager">25 virkedager</span> ferie per år i henhold til ferieloven.</p><h3>Feriepenger</h3><p>Feriepenger utbetales i <span class="editable-field" data-field="Feriepenger-måned">juni</span> og beregnes med <span class="editable-field" data-field="Feriepenger-sats">12%</span> av feriepengegrunnlaget fra foregående år.</p><h3>Offentlige fridager</h3><p>Alle offentlige helligdager er fridager med full lønn.</p><h3>Planlegging</h3><p>Hovedferieperioden (3 uker sammenhengende) kan tas ut i perioden 1. juni til 30. september. Ferieønsker skal meldes til leder innen <span class="editable-field" data-field="Frist ferieønske">1. mars</span>.</p>`,
    }),
    sykdom: () => ({
      title: "Sykdom og fravær",
      content: `<h2>Sykdom og fravær</h2><p>Ved sykdom skal <span class="editable-field" data-field="Bedriftsnavn">${company}</span> varsles så snart som mulig, og senest innen arbeidstidens start.</p><h3>Egenmelding</h3><p>Ansatte med minst 2 måneders ansettelse kan benytte egenmelding inntil <span class="editable-field" data-field="Egenmeldingsdager">3 kalenderdager</span> sammenhengende, inntil <span class="editable-field" data-field="Egenmeldinger per år">4 ganger</span> i løpet av 12 måneder.</p><h3>Sykemelding</h3><p>Ved fravær utover egenmeldingsperioden kreves sykemelding fra lege. Bedriften utbetaler sykepenger i arbeidsgiverperioden (16 dager), deretter overtar NAV.</p><h3>Barn sykdom</h3><p>Ansatte med omsorg for barn under 12 år har rett til inntil 10 dager omsorgspermisjon per kalenderår.</p>`,
    }),
    hjemmekontor: () => ({
      title: "Hjemmekontor",
      content: form.homeOfficeAllowed
        ? `<h2>Hjemmekontor</h2><p><span class="editable-field" data-field="Bedriftsnavn">${company}</span> tilbyr mulighet for hjemmekontor inntil <span class="editable-field" data-field="Hjemmekontor dager">${form.homeOfficeDays === "flexible" ? "et fleksibelt antall" : form.homeOfficeDays}</span> dager per uke, etter avtale med nærmeste leder.</p><h3>Krav og forventninger</h3><ul><li>Arbeidstid og tilgjengelighet gjelder som normalt: ${form.homeOfficeAvailability}</li><li>Ansatte skal ha en egnet arbeidsplass hjemme.</li>${form.homeOfficeEquipment ? "<li>Bedriften dekker nødvendig utstyr som skjerm, tastatur og kontorstoI.</li>" : ""}<li>Sensitiv informasjon skal behandles med samme aktsomhet som på kontoret.</li></ul><h3>Avtale</h3><p>Fast hjemmekontorordning krever skriftlig avtale i henhold til forskrift om hjemmearbeid.</p>`
        : `<h2>Hjemmekontor</h2><p><span class="editable-field" data-field="Bedriftsnavn">${company}</span> har per i dag ikke en fast hjemmekontorordning. Behov for hjemmekontor vurderes individuelt av nærmeste leder.</p>`,
    }),
    lonn: () => ({
      title: "Lønn og godtgjørelser",
      content: `<h2>Lønn og godtgjørelser</h2><p>Lønn i <span class="editable-field" data-field="Bedriftsnavn">${company}</span> utbetales <span class="editable-field" data-field="Lønnsutbetaling">${form.salaryFrequency === "monthly" ? "månedlig, den siste virkedagen i måneden" : "annenhver uke"}</span>.</p><h3>Lønnsfastsettelse</h3><p>Lønn fastsettes individuelt basert på stilling, kompetanse, erfaring og ansvar. Årlige lønnsforhandlinger gjennomføres normalt i <span class="editable-field" data-field="Lønnsforhandling-måned">april/mai</span>.</p>${form.bonusScheme !== "none" ? `<h3>Bonus</h3><p>${form.bonusScheme === "annual" ? "Bedriften har en årlig resultatbasert bonusordning." : form.bonusScheme === "quarterly" ? "Bedriften har en kvartalsvis bonusordning knyttet til avdelingsmål." : "Bonus vurderes skjønnsmessig basert på individuelle prestasjoner."}</p>` : ""}<h3>Reisegodtgjørelse</h3><p>Reiseutgifter i forbindelse med jobb dekkes etter gjeldende satser. Reiser skal forhåndsgodkjennes av leder.</p>${form.otherBenefits ? `<h3>Andre goder</h3><p>${form.otherBenefits}</p>` : ""}`,
    }),
    pensjon: () => ({
      title: "Pensjon og forsikring",
      content: `<h2>Pensjon og forsikring</h2><h3>Pensjonsordning</h3><p><span class="editable-field" data-field="Bedriftsnavn">${company}</span> har ${form.pensionScheme === "obligatorisk" ? "obligatorisk tjenestepensjon (OTP) med minimum 2% av lønn" : form.pensionScheme === "utvidet" ? "utvidet pensjonsordning med inntil 7% av lønn" : "innskuddsbasert pensjon med høyere sparesats"}. Pensjonsordningen gjelder for alle ansatte over 20 år med stilling over 20%.</p>${form.insuranceIncluded ? `<h3>Forsikringer</h3><ul><li>Yrkesskadeforsikring (lovpålagt)</li><li>Gruppelivsforsikring</li><li>Reiseforsikring for tjenestereiser</li><li>Helseforsikring med behandlingsgaranti</li></ul>` : "<h3>Forsikringer</h3><p>Lovpålagt yrkesskadeforsikring er inkludert. Ta kontakt med HR for informasjon om eventuelle tilleggsforsikringer.</p>"}`,
    }),
    hms: () => ({
      title: "HMS og arbeidsmiljø",
      content: `<h2>HMS og arbeidsmiljø</h2><p><span class="editable-field" data-field="Bedriftsnavn">${company}</span> er forpliktet til å sikre et trygt og godt arbeidsmiljø for alle ansatte, i henhold til arbeidsmiljøloven og internkontrollforskriften.</p><h3>Ansvar</h3><ul><li><strong>Arbeidsgiver</strong> har det overordnede ansvaret for HMS-arbeidet.</li><li><strong>Verneombud</strong> skal ivareta arbeidstakernes interesser i HMS-saker.</li><li><strong>Alle ansatte</strong> har plikt til å melde fra om farlige forhold.</li></ul><h3>Forebygging</h3><p>Det gjennomføres årlige vernerunder og risikovurderinger. Alle arbeidsulykker og nestenulykker skal rapporteres umiddelbart.</p>`,
    }),
    personvern: () => ({
      title: "Personvern og IT",
      content: `<h2>Personvern og IT</h2><p><span class="editable-field" data-field="Bedriftsnavn">${company}</span> behandler personopplysninger i henhold til personopplysningsloven og GDPR.</p><h3>IT-bruk</h3><ul><li>Bedriftens IT-utstyr og systemer skal primært brukes til arbeidsformål.</li><li>Passord skal være sterke og unike, og skal ikke deles med andre.</li><li>All programvare skal godkjennes av IT-ansvarlig.</li></ul><h3>Lagring av personopplysninger</h3><p>Kun nødvendige personopplysninger lagres, og de slettes når formålet er oppfylt. Ansatte har rett til innsyn i egne personopplysninger.</p>`,
    }),
    sosiale: () => ({
      title: "Sosiale medier",
      content: `<h2>Sosiale medier</h2><p>Ansatte i <span class="editable-field" data-field="Bedriftsnavn">${company}</span> ${form.socialMediaPolicy === "strict" ? "skal ikke publisere firmarelatert innhold på sosiale medier uten forhåndsgodkjenning fra kommunikasjonsansvarlig" : form.socialMediaPolicy === "oppmuntret" ? "oppfordres til å dele positive bedriftsopplevelser på sosiale medier som del av vårt ambassadørprogram" : "forventes å utvise godt skjønn ved omtale av bedriften på sosiale medier"}.</p><h3>Retningslinjer</h3><ul><li>Ikke del konfidensielt materiale, interne diskusjoner eller kundeinformasjon.</li><li>Vær tydelig på at meninger er dine egne og ikke nødvendigvis bedriftens.</li><li>Vis respekt for kollegaer, kunder og samarbeidspartnere.</li></ul>`,
    }),
    kleskode: () => ({
      title: "Kleskode",
      content: `<h2>Kleskode</h2><p><span class="editable-field" data-field="Bedriftsnavn">${company}</span> har ${form.dressCode === "formal" ? "en formell kleskode. Ansatte forventes å kle seg i dress/drakt eller tilsvarende" : form.dressCode === "business-casual" ? "en business casual kleskode. Ansatte forventes å kle seg pent, men behagelig" : form.dressCode === "casual" ? "en uformell kleskode. Ansatte kan kle seg avslappet, men ryddig" : "ingen spesifikke krav til kleskode, men forventer at ansatte kler seg passende for arbeidsoppgavene"}.</p><p>Ved kundemøter og representasjon forventes et profesjonelt antrekk.</p>`,
    }),
    varsling: () => ({
      title: "Varsling og etikk",
      content: `<h2>Varsling og etikk</h2><p>Ansatte i <span class="editable-field" data-field="Bedriftsnavn">${company}</span> har rett og plikt til å varsle om kritikkverdige forhold på arbeidsplassen, jf. arbeidsmiljøloven kapittel 2A.</p><h3>Hva kan varsles om?</h3><ul><li>Brudd på lover og regler</li><li>Korrupsjon, underslag eller økonomisk kriminalitet</li><li>Trakassering, mobbing eller diskriminering</li><li>Fare for liv og helse</li></ul><h3>Varslingskanal</h3><p>Varsling kan gjøres til nærmeste leder, verneombud eller direkte til <span class="editable-field" data-field="Varslingskanal">daglig leder</span>. Varsler behandles konfidensielt, og det er forbudt å gjengjelde mot den som varsler.</p>`,
    }),
    kompetanse: () => ({
      title: "Kompetanseutvikling",
      content: `<h2>Kompetanseutvikling</h2><p><span class="editable-field" data-field="Bedriftsnavn">${company}</span> legger stor vekt på faglig og personlig utvikling for alle ansatte.</p><h3>Muligheter</h3><ul><li>Årlige utviklingssamtaler med nærmeste leder</li><li>Tilgang til relevante kurs og konferanser</li><li>Intern kompetansedeling gjennom faglunsjer og workshops</li></ul><h3>Støtteordning</h3><p>Ansatte kan søke om støtte til relevante kurs, sertifiseringer og utdanning. Søknader vurderes av leder og godkjennes av <span class="editable-field" data-field="Godkjenner kompetanse">HR/daglig leder</span>.</p>`,
    }),
    avslutning: () => ({
      title: "Oppsigelse og avslutning",
      content: `<h2>Oppsigelse og avslutning</h2><p>Oppsigelse av arbeidsforhold i <span class="editable-field" data-field="Bedriftsnavn">${company}</span> følger arbeidsmiljølovens bestemmelser.</p><h3>Oppsigelsestid</h3><p>Den gjensidige oppsigelsestiden er <span class="editable-field" data-field="Oppsigelsestid">3 måneder</span> med mindre annet er avtalt i arbeidsavtalen.</p><h3>Sluttrutiner</h3><ul><li>Tilbakelevering av utstyr, nøkler og tilgangskortet</li><li>Deaktivering av IT-tilganger</li><li>Sluttoppgjør inkludert eventuelle feriepenger</li><li>Sluttsamtale med leder</li></ul><h3>Attest</h3><p>Alle ansatte har rett til en skriftlig sluttattest som bekrefter ansettelsesperioden og arbeidsoppgavene.</p>`,
    }),
    baerekraft: () => ({
      title: "Bærekraft og samfunnsansvar",
      content: `<h2>Bærekraft og samfunnsansvar</h2><p><span class="editable-field" data-field="Bedriftsnavn">${company}</span> tar bærekraft og samfunnsansvar på alvor. Vi jobber aktivt for å redusere vårt miljøavtrykk og bidra positivt til samfunnet.</p><h3>Miljø</h3><ul><li>Kildesortering og resirkulering på arbeidsplassen</li><li>Redusert papirbruk gjennom digitalisering</li><li>Miljøvennlige reisealternativer</li></ul><h3>Sosialt ansvar</h3><p>Vi støtter likestilling, mangfold og inkludering i alle deler av virksomheten. ${form.diversityStatement ? "Vi er forpliktet til å skape en arbeidsplass fri for diskriminering, der alle ansatte behandles med respekt og verdighet." : ""}</p>`,
    }),
  };

  for (const modId of form.modules) {
    const builder = moduleMap[modId];
    if (builder) chapters.push(builder());
  }

  return chapters;
}

export default HrGenerator;
