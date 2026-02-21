import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Plus, Trash2, Edit2, Download, Upload, Building2, User,
  ChevronRight, DollarSign, FileText, Eye, X
} from "lucide-react";
import { toast } from "sonner";

interface CustomerCompany {
  id: string;
  profile_id: string;
  company_name: string;
  org_number: string | null;
  industry: string | null;
  contact_phone: string | null;
  created_at: string;
  primary_advisor_id: string | null;
  backup_advisor_id: string | null;
  profile?: { name: string; email: string };
}

interface Financial {
  id: string;
  company_id: string;
  period: string;
  revenue: number;
  costs: number;
  result: number;
  equity: number;
  assets: number;
  liabilities: number;
  notes: string | null;
  admin_action_plan: string | null;
}

const inputCls = "w-full h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40";

const CustomersPanel = () => {
  const { session } = useAuth();
  const [companies, setCompanies] = useState<CustomerCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<CustomerCompany | null>(null);
  const [createForm, setCreateForm] = useState({ email: "", password: "", name: "", company_name: "", org_number: "", industry: "", contact_phone: "" });
  const [creating, setCreating] = useState(false);

  const fetchCompanies = async () => {
    const { data } = await supabase
      .from("customer_companies")
      .select("*, profile:profiles!customer_companies_profile_id_fkey(name, email)")
      .order("created_at", { ascending: false });
    setCompanies((data as any[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchCompanies(); }, []);

  const createCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await supabase.functions.invoke("create-employee", {
        body: { email: createForm.email, password: createForm.password, name: createForm.name, role: "customer" },
      });
      if (res.error || res.data?.error) throw new Error(res.data?.error || "Feil ved opprettelse");

      // Create company record
      const { data: profileData } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", res.data.userId)
        .single();

      if (profileData) {
        await supabase.from("customer_companies").insert({
          profile_id: profileData.id,
          company_name: createForm.company_name,
          org_number: createForm.org_number || null,
          industry: createForm.industry || null,
          contact_phone: createForm.contact_phone || null,
        });
      }

      toast.success("Kunde opprettet");
      setShowCreateForm(false);
      setCreateForm({ email: "", password: "", name: "", company_name: "", org_number: "", industry: "", contact_phone: "" });
      fetchCompanies();
    } catch (err: any) {
      toast.error(err.message);
    }
    setCreating(false);
  };

  if (loading) return <div className="text-muted-foreground text-sm">Laster…</div>;

  if (selectedCompany) {
    return <CustomerDetail company={selectedCompany} onBack={() => { setSelectedCompany(null); fetchCompanies(); }} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{companies.length} kunder</p>
        <button onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm hover:opacity-90">
          <Plus size={14} /> Ny kunde
        </button>
      </div>

      {showCreateForm && (
        <form onSubmit={createCustomer} className="glass rounded-2xl p-5 border border-border/20 space-y-3">
          <h3 className="font-medium text-sm">Opprett ny kunde</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input value={createForm.name} onChange={e => setCreateForm({ ...createForm, name: e.target.value })} placeholder="Kontaktperson *" required className={inputCls} />
            <input value={createForm.email} onChange={e => setCreateForm({ ...createForm, email: e.target.value })} placeholder="E-post *" type="email" required className={inputCls} />
            <input value={createForm.password} onChange={e => setCreateForm({ ...createForm, password: e.target.value })} placeholder="Passord *" type="password" required minLength={6} className={inputCls} />
            <input value={createForm.company_name} onChange={e => setCreateForm({ ...createForm, company_name: e.target.value })} placeholder="Firmanavn *" required className={inputCls} />
            <input value={createForm.org_number} onChange={e => setCreateForm({ ...createForm, org_number: e.target.value })} placeholder="Org.nr" className={inputCls} />
            <input value={createForm.industry} onChange={e => setCreateForm({ ...createForm, industry: e.target.value })} placeholder="Bransje" className={inputCls} />
            <input value={createForm.contact_phone} onChange={e => setCreateForm({ ...createForm, contact_phone: e.target.value })} placeholder="Telefon" className={inputCls} />
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={creating} className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm hover:opacity-90 disabled:opacity-50">
              {creating ? "Oppretter…" : "Opprett kunde"}
            </button>
            <button type="button" onClick={() => setShowCreateForm(false)} className="px-4 py-2 rounded-xl text-sm border border-border/30 hover:bg-muted/50">Avbryt</button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {companies.map(c => (
          <button
            key={c.id}
            onClick={() => setSelectedCompany(c)}
            className="w-full glass rounded-2xl px-5 py-4 border border-border/20 flex items-center justify-between text-left hover:border-primary/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Building2 size={16} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">{c.company_name}</p>
                <p className="text-xs text-muted-foreground">{(c as any).profile?.name} · {(c as any).profile?.email}</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-muted-foreground" />
          </button>
        ))}
      </div>
    </div>
  );
};

// ========== CUSTOMER DETAIL ==========
const CustomerDetail = ({ company, onBack }: { company: CustomerCompany; onBack: () => void }) => {
  const [tab, setTab] = useState<"financials" | "documents">("financials");
  const [financials, setFinancials] = useState<Financial[]>([]);
  const [docs, setDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFinForm, setShowFinForm] = useState(false);
  const [showDocForm, setShowDocForm] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [finForm, setFinForm] = useState({ period: "", revenue: "", costs: "", result: "", equity: "", assets: "", liabilities: "", notes: "", admin_action_plan: "" });
  const [docForm, setDocForm] = useState({ title: "", description: "", visibility: "private" });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [advisors, setAdvisors] = useState<{ id: string; name: string }[]>([]);
  const [primaryAdvisor, setPrimaryAdvisor] = useState(company.primary_advisor_id || "");
  const [backupAdvisor, setBackupAdvisor] = useState(company.backup_advisor_id || "");
  const [handbookInitialized, setHandbookInitialized] = useState(false);

  const load = async () => {
    const [finRes, docRes, advRes, hbRes] = await Promise.all([
      supabase.from("customer_financials").select("*").eq("company_id", company.id).order("period"),
      supabase.from("customer_documents").select("*").eq("company_id", company.id).order("created_at", { ascending: false }),
      supabase.from("profiles").select("id, name").in("role", ["admin", "employee"]),
      supabase.from("customer_handbook_chapters").select("id").eq("company_id", company.id).limit(1),
    ]);
    setFinancials((finRes.data as Financial[]) || []);
    setDocs(docRes.data || []);
    setAdvisors((advRes.data as any[]) || []);
    setHandbookInitialized((hbRes.data?.length || 0) > 0);
    setLoading(false);
  };

  useEffect(() => { load(); }, [company.id]);

  const saveAdvisors = async (field: "primary_advisor_id" | "backup_advisor_id", value: string) => {
    const val = value || null;
    await supabase.from("customer_companies").update({ [field]: val }).eq("id", company.id);
    toast.success("Rådgiver oppdatert");
  };

  const initHandbook = async () => {
    const { data: chapters } = await supabase.from("hr_handbook").select("*").order("sort_order");
    if (!chapters?.length) { toast.error("Ingen kapitler i malen"); return; }
    const rows = chapters.map(ch => ({
      company_id: company.id,
      source_chapter_id: ch.id,
      title: ch.title,
      content: ch.content,
      sort_order: ch.sort_order,
      customized: false,
    }));
    await supabase.from("customer_handbook_chapters").insert(rows);
    toast.success("Personalhåndbok opprettet fra mal");
    setHandbookInitialized(true);
  };

  const saveFinancial = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await supabase.from("customer_financials").insert({
      company_id: company.id,
      period: finForm.period,
      revenue: parseFloat(finForm.revenue) || 0,
      costs: parseFloat(finForm.costs) || 0,
      result: parseFloat(finForm.result) || 0,
      equity: parseFloat(finForm.equity) || 0,
      assets: parseFloat(finForm.assets) || 0,
      liabilities: parseFloat(finForm.liabilities) || 0,
      notes: finForm.notes || null,
      admin_action_plan: finForm.admin_action_plan || null,
    });
    toast.success("Periode lagret");
    setShowFinForm(false);
    setFinForm({ period: "", revenue: "", costs: "", result: "", equity: "", assets: "", liabilities: "", notes: "", admin_action_plan: "" });
    load();
    setSaving(false);
  };

  const saveDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    let fileData: any = {};
    if (selectedFile) {
      const path = `customer-docs/${company.id}/${Date.now()}-${selectedFile.name}`;
      const { data } = await supabase.storage.from("internal-docs").upload(path, selectedFile);
      if (data) fileData = { file_url: path, file_name: selectedFile.name, file_size: `${(selectedFile.size / 1024).toFixed(0)} KB` };
    }
    await supabase.from("customer_documents").insert({
      company_id: company.id,
      title: docForm.title,
      description: docForm.description || null,
      visibility: docForm.visibility,
      ...fileData,
    });
    toast.success("Dokument lagret");
    setShowDocForm(false);
    setDocForm({ title: "", description: "", visibility: "private" });
    setSelectedFile(null);
    load();
    setSaving(false);
  };

  const delFinancial = async (id: string) => {
    if (!confirm("Slett denne perioden?")) return;
    await supabase.from("customer_financials").delete().eq("id", id);
    load();
  };

  const delDoc = async (id: string) => {
    if (!confirm("Slett dette dokumentet?")) return;
    await supabase.from("customer_documents").delete().eq("id", id);
    load();
  };

  if (loading) return <div className="text-muted-foreground text-sm">Laster…</div>;

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
        ← Tilbake til kundeliste
      </button>

      <div className="glass rounded-2xl p-5 border border-border/20">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Building2 size={20} className="text-primary" />
          </div>
          <div>
            <h2 className="font-heading text-lg">{company.company_name}</h2>
            <p className="text-xs text-muted-foreground">{(company as any).profile?.name} · {(company as any).profile?.email}</p>
            {company.org_number && <p className="text-xs text-muted-foreground">Org.nr: {company.org_number}</p>}
          </div>
        </div>
      </div>

      {/* Advisor assignment */}
      <div className="glass rounded-2xl p-5 border border-border/20 space-y-3">
        <h3 className="font-medium text-sm">Tildelte rådgivere</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Oppdragsansvarlig</label>
            <select value={primaryAdvisor} onChange={e => { setPrimaryAdvisor(e.target.value); saveAdvisors("primary_advisor_id", e.target.value); }} className={inputCls}>
              <option value="">— Velg —</option>
              {advisors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Reserve</label>
            <select value={backupAdvisor} onChange={e => { setBackupAdvisor(e.target.value); saveAdvisors("backup_advisor_id", e.target.value); }} className={inputCls}>
              <option value="">— Velg —</option>
              {advisors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Handbook init */}
      {!handbookInitialized && (
        <div className="glass rounded-2xl p-5 border border-border/20 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Personalhåndbok</p>
            <p className="text-xs text-muted-foreground">Opprett kundens personalhåndbok fra Avargo-malen</p>
          </div>
          <button onClick={initHandbook} className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm hover:opacity-90">
            Opprett fra mal
          </button>
        </div>
      )}
      {handbookInitialized && (
        <div className="glass rounded-2xl px-5 py-3 border border-emerald-500/20 bg-emerald-500/5">
          <p className="text-xs text-emerald-600">✓ Personalhåndbok er opprettet – kunden kan nå redigere den i sin portal</p>
        </div>
      )}

      <div className="flex gap-2">
        <button onClick={() => setTab("financials")}
          className={`px-4 py-2 rounded-xl text-sm transition-colors ${tab === "financials" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/50"}`}>
          <DollarSign size={14} className="inline mr-1" /> Økonomi
        </button>
        <button onClick={() => setTab("documents")}
          className={`px-4 py-2 rounded-xl text-sm transition-colors ${tab === "documents" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/50"}`}>
          <FileText size={14} className="inline mr-1" /> Dokumenter
        </button>
      </div>

      {tab === "financials" && (
        <div className="space-y-4">
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowUploadForm(true)}
              className="flex items-center gap-2 px-4 py-2 border border-primary/30 text-primary rounded-xl text-sm hover:bg-primary/5">
              <Upload size={14} /> Last opp fil (PDF/Excel)
            </button>
            <button onClick={() => setShowFinForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm hover:opacity-90">
              <Plus size={14} /> Manuell registrering
            </button>
          </div>

          {showUploadForm && (
            <FinancialUploadForm
              companyId={company.id}
              onComplete={() => { setShowUploadForm(false); load(); }}
              onCancel={() => setShowUploadForm(false)}
            />
          )}

          {showFinForm && (
            <form onSubmit={saveFinancial} className="glass rounded-2xl p-5 border border-border/20 space-y-3">
              <h3 className="font-medium text-sm">Manuell registrering av månedsdata</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Måned *</label>
                  <input value={finForm.period} onChange={e => setFinForm({ ...finForm, period: e.target.value })} type="month" required className={inputCls} />
                </div>
                <input value={finForm.revenue} onChange={e => setFinForm({ ...finForm, revenue: e.target.value })} placeholder="Inntekter" type="number" className={inputCls} />
                <input value={finForm.costs} onChange={e => setFinForm({ ...finForm, costs: e.target.value })} placeholder="Kostnader" type="number" className={inputCls} />
                <input value={finForm.result} onChange={e => setFinForm({ ...finForm, result: e.target.value })} placeholder="Resultat" type="number" className={inputCls} />
                <input value={finForm.equity} onChange={e => setFinForm({ ...finForm, equity: e.target.value })} placeholder="Egenkapital" type="number" className={inputCls} />
                <input value={finForm.assets} onChange={e => setFinForm({ ...finForm, assets: e.target.value })} placeholder="Eiendeler" type="number" className={inputCls} />
                <input value={finForm.liabilities} onChange={e => setFinForm({ ...finForm, liabilities: e.target.value })} placeholder="Gjeld" type="number" className={inputCls} />
              </div>
              <textarea value={finForm.notes} onChange={e => setFinForm({ ...finForm, notes: e.target.value })} placeholder="Notat" rows={2}
                className="w-full rounded-xl border border-border/30 bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none" />
              <textarea value={finForm.admin_action_plan} onChange={e => setFinForm({ ...finForm, admin_action_plan: e.target.value })} placeholder="Tiltaksplan (synlig for kunden)" rows={3}
                className="w-full rounded-xl border border-border/30 bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none" />
              <div className="flex gap-2">
                <button type="submit" disabled={saving} className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm hover:opacity-90 disabled:opacity-50">Lagre</button>
                <button type="button" onClick={() => setShowFinForm(false)} className="px-4 py-2 rounded-xl text-sm border border-border/30 hover:bg-muted/50">Avbryt</button>
              </div>
            </form>
          )}

          {financials.map(f => (
            <div key={f.id} className="glass rounded-2xl px-5 py-4 border border-border/20">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold">{f.period}</p>
                <button onClick={() => delFinancial(f.id)} className="text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
              </div>
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div><span className="text-muted-foreground">Inntekter:</span> <span className="font-medium">{Number(f.revenue).toLocaleString("no-NO")} kr</span></div>
                <div><span className="text-muted-foreground">Kostnader:</span> <span className="font-medium">{Number(f.costs).toLocaleString("no-NO")} kr</span></div>
                <div><span className="text-muted-foreground">Resultat:</span> <span className={`font-medium ${Number(f.result) >= 0 ? "text-emerald-500" : "text-destructive"}`}>{Number(f.result).toLocaleString("no-NO")} kr</span></div>
              </div>
              {f.admin_action_plan && <p className="text-xs text-primary mt-2">Tiltaksplan: {f.admin_action_plan}</p>}
            </div>
          ))}
        </div>
      )}

      {tab === "documents" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => setShowDocForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm hover:opacity-90">
              <Upload size={14} /> Last opp dokument
            </button>
          </div>

          {showDocForm && (
            <form onSubmit={saveDocument} className="glass rounded-2xl p-5 border border-border/20 space-y-3">
              <h3 className="font-medium text-sm">Last opp dokument til kunde</h3>
              <input value={docForm.title} onChange={e => setDocForm({ ...docForm, title: e.target.value })} placeholder="Dokumenttittel *" required className={inputCls} />
              <input value={docForm.description} onChange={e => setDocForm({ ...docForm, description: e.target.value })} placeholder="Beskrivelse (valgfritt)" className={inputCls} />
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Synlighet</label>
                <select value={docForm.visibility} onChange={e => setDocForm({ ...docForm, visibility: e.target.value })} className={inputCls}>
                  <option value="private">Kun denne kunden + Avargo</option>
                  <option value="all_customers">Alle kunder</option>
                </select>
              </div>
              <div onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-border/30 rounded-xl p-4 text-center cursor-pointer hover:border-primary/40 transition-colors">
                <p className="text-xs text-muted-foreground">{selectedFile ? selectedFile.name : "Klikk for å velge fil"}</p>
                <input ref={fileRef} type="file" className="hidden" onChange={e => setSelectedFile(e.target.files?.[0] || null)} />
              </div>
              <div className="flex gap-2">
                <button type="submit" disabled={saving} className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm hover:opacity-90 disabled:opacity-50">Lagre</button>
                <button type="button" onClick={() => { setShowDocForm(false); setSelectedFile(null); }} className="px-4 py-2 rounded-xl text-sm border border-border/30 hover:bg-muted/50">Avbryt</button>
              </div>
            </form>
          )}

          {docs.map(doc => (
            <div key={doc.id} className="glass rounded-2xl px-5 py-4 border border-border/20 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{doc.title}</p>
                {doc.description && <p className="text-xs text-muted-foreground">{doc.description}</p>}
                <div className="flex gap-2 mt-1">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${doc.visibility === "private" ? "bg-orange-500/10 text-orange-500" : "bg-emerald-500/10 text-emerald-500"}`}>
                    {doc.visibility === "private" ? "Kun denne kunden" : "Alle kunder"}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                {doc.file_url && (
                  <button onClick={async () => {
                    const { data } = await supabase.storage.from("internal-docs").createSignedUrl(doc.file_url, 3600);
                    if (data?.signedUrl) window.open(data.signedUrl, "_blank");
                  }} className="text-muted-foreground hover:text-primary"><Download size={14} /></button>
                )}
                <button onClick={() => delDoc(doc.id)} className="text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ========== FINANCIAL UPLOAD FORM ==========
const FinancialUploadForm = ({ companyId, onComplete, onCancel }: { companyId: string; onComplete: () => void; onCancel: () => void }) => {
  const { session } = useAuth();
  const [period, setPeriod] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [parsed, setParsed] = useState<any>(null);
  const [notes, setNotes] = useState("");
  const [actionPlan, setActionPlan] = useState("");
  const [saving, setSaving] = useState(false);
  const uploadRef = useRef<HTMLInputElement>(null);

  const parseFile = async () => {
    if (!file || !period) { toast.error("Velg måned og fil"); return; }
    setParsing(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("company_id", companyId);
      formData.append("period", period);

      const res = await supabase.functions.invoke("parse-financials", {
        body: formData,
      });

      if (res.error || res.data?.error) throw new Error(res.data?.error || "Parsing feilet");
      setParsed(res.data);
      toast.success("Tall hentet fra filen!");
    } catch (err: any) {
      toast.error(err.message || "Kunne ikke lese filen");
    }
    setParsing(false);
  };

  const saveToDb = async () => {
    if (!parsed) return;
    setSaving(true);
    const { error } = await supabase.from("customer_financials").insert({
      company_id: companyId,
      period,
      revenue: parsed.data.revenue,
      costs: parsed.data.costs,
      result: parsed.data.result,
      equity: parsed.data.equity,
      assets: parsed.data.assets,
      liabilities: parsed.data.liabilities,
      notes: notes || null,
      admin_action_plan: actionPlan || null,
    });
    if (error) { toast.error("Lagring feilet"); setSaving(false); return; }
    toast.success(`Økonomidata for ${period} lagret`);
    setSaving(false);
    onComplete();
  };

  return (
    <div className="glass rounded-2xl p-5 border border-primary/20 space-y-4">
      <h3 className="font-medium text-sm flex items-center gap-2">
        <Upload size={14} className="text-primary" /> Last opp saldobalanse (PDF / Excel / CSV)
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Måned *</label>
          <input type="month" value={period} onChange={e => setPeriod(e.target.value)} required className={inputCls} />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Fil *</label>
          <div onClick={() => uploadRef.current?.click()}
            className="h-10 border border-dashed border-border/30 rounded-xl px-3 flex items-center cursor-pointer hover:border-primary/40 transition-colors">
            <p className="text-sm text-muted-foreground truncate">{file ? file.name : "Velg PDF, Excel eller CSV…"}</p>
            <input ref={uploadRef} type="file" accept=".pdf,.xlsx,.xls,.csv,.txt" className="hidden"
              onChange={e => { setFile(e.target.files?.[0] || null); setParsed(null); }} />
          </div>
        </div>
      </div>

      {!parsed && (
        <div className="flex gap-2">
          <button onClick={parseFile} disabled={parsing || !file || !period}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm hover:opacity-90 disabled:opacity-50">
            {parsing ? "Analyserer fil…" : "Analyser fil med AI"}
          </button>
          <button onClick={onCancel} className="px-4 py-2 rounded-xl text-sm border border-border/30 hover:bg-muted/50">Avbryt</button>
        </div>
      )}

      {parsed && (
        <div className="space-y-3">
          <p className="text-xs text-emerald-500 font-medium">✓ Tall hentet fra {parsed.file_name}</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Inntekter", key: "revenue" },
              { label: "Kostnader", key: "costs" },
              { label: "Resultat", key: "result" },
              { label: "Egenkapital", key: "equity" },
              { label: "Eiendeler", key: "assets" },
              { label: "Gjeld", key: "liabilities" },
            ].map(f => (
              <div key={f.key} className="glass rounded-xl p-3 border border-border/10">
                <p className="text-[10px] text-muted-foreground">{f.label}</p>
                <p className="text-sm font-heading">{Number(parsed.data[f.key]).toLocaleString("no-NO")} kr</p>
              </div>
            ))}
          </div>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notat (valgfritt)" rows={2}
            className="w-full rounded-xl border border-border/30 bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none" />
          <textarea value={actionPlan} onChange={e => setActionPlan(e.target.value)} placeholder="Tiltaksplan (synlig for kunden)" rows={3}
            className="w-full rounded-xl border border-border/30 bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none" />
          <div className="flex gap-2">
            <button onClick={saveToDb} disabled={saving}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm hover:opacity-90 disabled:opacity-50">
              {saving ? "Lagrer…" : "Lagre til kundens økonomi"}
            </button>
            <button onClick={() => setParsed(null)} className="px-4 py-2 rounded-xl text-sm border border-border/30 hover:bg-muted/50">Analyser på nytt</button>
            <button onClick={onCancel} className="px-4 py-2 rounded-xl text-sm border border-border/30 hover:bg-muted/50">Avbryt</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersPanel;
