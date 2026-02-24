import { useState, useEffect, useCallback, useRef } from "react";
import DOMPurify from "dompurify";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Calendar } from "@/components/ui/calendar";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  LayoutDashboard, FileText, BookOpen, CalendarDays,
  Handshake, LogOut, Menu, ChevronRight, TrendingUp,
  TrendingDown, DollarSign, ArrowUpRight, ArrowDownRight,
  Download, Building2, Calculator, Trash2, Eye, MoreVertical,
  Scale, AlertTriangle, ShieldCheck, Lock, Heart,
  CheckSquare, Square, Key, Check, Settings, Mail, UserPlus, Users,
  FolderOpen, Sparkles, Send, Search
} from "lucide-react";
import AnsettelsesKalkulator from "@/components/kunde/AnsettelsesKalkulator";
import DocumentGenerator from "@/components/kunde/DocumentGenerator";
import CustomerSettingsPanel from "@/components/kunde/CustomerSettingsPanel";
import BenefitApplicationPanel from "@/components/kunde/BenefitApplicationPanel";
import CustomerDocGeneratorPanel from "@/components/kunde/CustomerDocGeneratorPanel";
import MalerPanel from "@/components/kunde/MalerPanel";
import { personalhandbokConfig } from "@/components/kunde/generators/personalhandbok";
import { arbeidsreglementConfig } from "@/components/kunde/generators/arbeidsreglement";
import { varslingsrutinerConfig } from "@/components/kunde/generators/varslingsrutiner";
import { gdprConfig } from "@/components/kunde/generators/gdpr";
import { digitalSikkerhetConfig } from "@/components/kunde/generators/digital-sikkerhet";
import { psykososialtConfig } from "@/components/kunde/generators/psykososialt";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, BarChart, Bar
} from "recharts";

type Panel = "overview" | "documents" | "booking" | "partners" | "benefit_apply"
  | "personalhandbok" | "arbeidsreglement" | "varslingsrutiner" | "gdpr" | "digital-sikkerhet" | "psykososialt"
  | "calculator" | "doc_generator" | "maler" | "settings" | "employees" | "regnskapsord";

interface NavItem {
  id: Panel;
  label: string;
  icon: React.ElementType;
  group?: string;
}

const navItems: NavItem[] = [
  { id: "overview", label: "Oversikt", icon: LayoutDashboard },
  { id: "documents", label: "Dokumenter", icon: FileText },
  { id: "booking", label: "Book rådgiver", icon: CalendarDays },
  { id: "partners", label: "Fordelsavtaler", icon: Handshake },
  { id: "benefit_apply", label: "Søk om fordelsavtale", icon: Send },
  { id: "doc_generator", label: "Dokumentgenerator", icon: Sparkles, group: "Dokumenter" },
  { id: "maler", label: "Maler og avstemminger", icon: FolderOpen, group: "Dokumenter" },
  { id: "personalhandbok", label: "Personalhåndbok", icon: BookOpen, group: "HR og personal" },
  { id: "arbeidsreglement", label: "Arbeidsreglement", icon: Scale, group: "HR og personal" },
  { id: "varslingsrutiner", label: "Varslingsrutiner", icon: AlertTriangle, group: "HR og personal" },
  { id: "gdpr", label: "GDPR & Personvern", icon: ShieldCheck, group: "HR og personal" },
  { id: "digital-sikkerhet", label: "Digital Sikkerhet", icon: Lock, group: "HR og personal" },
  { id: "psykososialt", label: "Psykososialt Arbeidsmiljø", icon: Heart, group: "HR og personal" },
  { id: "calculator", label: "Ansettelseskalkulator", icon: Calculator, group: "HR og personal" },
  { id: "regnskapsord", label: "Regnskapsordbok", icon: BookOpen, group: "Ressurser" },
  { id: "employees", label: "Ansatte", icon: Users, group: "Administrasjon" },
  { id: "settings", label: "Innstillinger", icon: Settings, group: "Konto" },
];

const KundeDashboard = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [activePanel, setActivePanel] = useState<Panel>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogo = async () => {
      const { data } = await supabase.from("customer_companies").select("logo_url").limit(1).maybeSingle();
      if (data?.logo_url) setCompanyLogo(data.logo_url);
    };
    fetchLogo();
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-border/10">
        <span className="font-heading text-2xl text-primary">Avargo</span>
        <p className="text-xs text-muted-foreground mt-0.5">Kundeportal</p>
      </div>
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {(() => {
          let lastGroup: string | undefined = undefined;
          return navItems.map(item => {
            const showGroupLabel = item.group && item.group !== lastGroup;
            lastGroup = item.group;
            return (
              <div key={item.id}>
                {showGroupLabel && (
                  <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/50 mt-4 mb-1 px-3">{item.group}</p>
                )}
                <button
                  onClick={() => { setActivePanel(item.id); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                    activePanel === item.id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <item.icon size={15} strokeWidth={1.5} className="shrink-0" />
                  <span className="font-light">{item.label}</span>
                  {activePanel === item.id && <ChevronRight size={12} className="ml-auto" />}
                </button>
              </div>
            );
          });
        })()}
      </nav>
      <div className="p-4 border-t border-border/10">
        <div className="flex items-center gap-3 mb-3">
          {companyLogo ? (
            <img src={companyLogo} alt="Logo" className="w-8 h-8 rounded-full object-contain border border-border/20" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-medium">
              {profile?.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate">{profile?.name}</p>
            <p className="text-[10px] text-muted-foreground">Kunde</p>
          </div>
        </div>
        <button onClick={handleSignOut}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all">
          <LogOut size={13} strokeWidth={1.5} /> Logg ut
        </button>
      </div>
    </div>
  );

  const renderPanel = () => {
    switch (activePanel) {
      case "documents": return <DocumentsPanel />;
      case "personalhandbok": return <DocumentGenerator config={personalhandbokConfig} />;
      case "arbeidsreglement": return <DocumentGenerator config={arbeidsreglementConfig} />;
      case "varslingsrutiner": return <DocumentGenerator config={varslingsrutinerConfig} />;
      case "gdpr": return <DocumentGenerator config={gdprConfig} />;
      case "digital-sikkerhet": return <DocumentGenerator config={digitalSikkerhetConfig} />;
      case "psykososialt": return <DocumentGenerator config={psykososialtConfig} />;
      case "calculator": return <AnsettelsesKalkulator />;
      case "settings": return <CustomerSettingsPanel />;
      case "employees": return <EmployeesPanel />;
      case "booking": return <BookingPanel />;
      case "partners": return <PartnersPanel />;
      case "benefit_apply": return <BenefitApplicationPanel />;
      case "doc_generator": return <CustomerDocGeneratorPanel />;
      case "maler": return <MalerPanel />;
      case "regnskapsord": return <RegnskapsordPanel />;
      default: return <OverviewPanel />;
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <aside className="hidden md:flex flex-col w-60 border-r border-border/10 bg-background/60 backdrop-blur shrink-0">
        <Sidebar />
      </aside>
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-background border-r border-border/10 flex flex-col">
            <Sidebar />
          </aside>
        </div>
      )}
      <main className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-10 flex items-center gap-3 px-4 md:px-6 h-14 border-b border-border/10 bg-background/80 backdrop-blur">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden text-muted-foreground hover:text-foreground">
            <Menu size={20} />
          </button>
          {companyLogo && <img src={companyLogo} alt="Logo" className="w-6 h-6 rounded-lg object-contain border border-border/20" />}
          <h1 className="font-heading text-lg">{navItems.find(i => i.id === activePanel)?.label ?? "Oversikt"}</h1>
        </div>
        <div className="p-4 md:p-6 lg:p-8">{renderPanel()}</div>
      </main>
    </div>
  );
};

// ========== OVERVIEW PANEL ==========
const OverviewPanel = () => {
  const { profile } = useAuth();
  const [company, setCompany] = useState<any>(null);
  const [financials, setFinancials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: comp } = await supabase
        .from("customer_companies")
        .select("*")
        .limit(1)
        .maybeSingle();
      setCompany(comp);

      if (comp) {
        const { data: fin } = await supabase
          .from("customer_financials")
          .select("*")
          .eq("company_id", comp.id)
          .order("period", { ascending: true });
        setFinancials(fin || []);
      }
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <div className="text-muted-foreground text-sm">Laster…</div>;

  const latest = financials.length > 0 ? financials[financials.length - 1] : null;
  const prev = financials.length > 1 ? financials[financials.length - 2] : null;
  const revenueChange = prev && latest ? ((Number(latest.revenue) - Number(prev.revenue)) / Math.max(Number(prev.revenue), 1)) * 100 : 0;
  const costChange = prev && latest ? ((Number(latest.costs) - Number(prev.costs)) / Math.max(Number(prev.costs), 1)) * 100 : 0;
  const resultMargin = latest ? (Number(latest.result) / Math.max(Number(latest.revenue), 1)) * 100 : 0;

  const greeting = new Date().getHours() < 12 ? "God morgen" : new Date().getHours() < 17 ? "God ettermiddag" : "God kveld";

  const statCards = [
    {
      label: "Inntekter",
      value: latest ? `${Number(latest.revenue).toLocaleString("no-NO")} kr` : "—",
      change: revenueChange,
      icon: TrendingUp,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Kostnader",
      value: latest ? `${Number(latest.costs).toLocaleString("no-NO")} kr` : "—",
      change: costChange,
      icon: TrendingDown,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
    {
      label: "Resultat",
      value: latest ? `${Number(latest.result).toLocaleString("no-NO")} kr` : "—",
      change: resultMargin,
      icon: DollarSign,
      color: Number(latest?.result || 0) >= 0 ? "text-emerald-500" : "text-destructive",
      bg: Number(latest?.result || 0) >= 0 ? "bg-emerald-500/10" : "bg-destructive/10",
    },
  ];

  const chartData = financials.map(f => ({
    period: f.period,
    Inntekter: Number(f.revenue),
    Kostnader: Number(f.costs),
    Resultat: Number(f.result),
  }));

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="font-heading text-2xl">{greeting}, {profile?.name?.split(" ")[0]}</h2>
        {company && <p className="text-muted-foreground text-sm mt-1">{company.company_name}</p>}
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-2xl p-5 border border-border/20"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground">{card.label}</span>
              <div className={`w-8 h-8 rounded-xl ${card.bg} flex items-center justify-center`}>
                <card.icon size={16} className={card.color} />
              </div>
            </div>
            <p className="text-xl font-heading">{card.value}</p>
            {card.change !== 0 && (
              <div className={`flex items-center gap-1 mt-1 text-xs ${card.change >= 0 ? "text-emerald-500" : "text-destructive"}`}>
                {card.change >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {Math.abs(card.change).toFixed(1)}% fra forrige
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {chartData.length > 1 && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-6 border border-border/20">
          <h3 className="font-heading text-base mb-4">Økonomi over tid</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border)/0.2)" />
                <XAxis dataKey="period" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border)/0.3)", borderRadius: 12, fontSize: 12 }}
                  formatter={(v: number) => [`${v.toLocaleString("no-NO")} kr`]}
                />
                <Area type="monotone" dataKey="Inntekter" stroke="hsl(var(--primary))" fill="url(#revGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="Kostnader" stroke="#f97316" fill="transparent" strokeWidth={1.5} strokeDasharray="5 5" />
                <Area type="monotone" dataKey="Resultat" stroke="#10b981" fill="transparent" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {latest?.admin_action_plan && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="glass rounded-2xl p-6 border border-primary/20 bg-primary/5">
          <h3 className="font-heading text-base mb-2 flex items-center gap-2">
            <TrendingUp size={16} className="text-primary" /> Tiltaksplan fra rådgiver
          </h3>
          <p className="text-sm text-foreground/80 whitespace-pre-line">{latest.admin_action_plan}</p>
        </motion.div>
      )}

      {(!financials.length) && (
        <div className="glass rounded-2xl p-8 border border-border/20 text-center">
          <DollarSign size={32} className="text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Ingen økonomiske data ennå. Din rådgiver vil legge til data her.</p>
        </div>
      )}
    </div>
  );
};

// ========== DOCUMENT VIEWER ==========
const DocumentViewer = ({ doc, onClose }: { doc: any; onClose: () => void }) => {
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [loadingContent, setLoadingContent] = useState(false);
  const isHr = doc.category?.startsWith("HR");

  useEffect(() => {
    if (!isHr) return;
    const fetchContent = async () => {
      setLoadingContent(true);
      const { data: company } = await supabase.from("customer_companies").select("id").limit(1).maybeSingle();
      if (!company) { setLoadingContent(false); return; }
      const { data: chapter } = await supabase
        .from("customer_handbook_chapters")
        .select("content")
        .eq("company_id", company.id)
        .eq("title", doc.title)
        .maybeSingle();
      if (chapter?.content) setHtmlContent(chapter.content);
      setLoadingContent(false);
    };
    fetchContent();
  }, [doc.title, isHr]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white border border-border/30 rounded-2xl p-8 shadow-xl mx-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-lg text-black">{doc.title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black text-sm">✕</button>
        </div>
        {isHr && loadingContent && <p className="text-sm text-gray-500">Laster dokument…</p>}
        {isHr && htmlContent && (
          <div
            className="pdf-content"
            style={{ fontFamily: "'Georgia', 'Times New Roman', serif", fontSize: "13px", lineHeight: "1.7", color: "#1a1a1a" }}
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(htmlContent) }}
          />
        )}
        {isHr && !loadingContent && !htmlContent && (
          <p className="text-sm text-gray-500">Ingen innhold lagret ennå. Gå til generatoren og klikk «Lagre alle» for å generere dokumentet.</p>
        )}
        {!isHr && (
          <div>
            {doc.description && <p className="text-sm text-gray-600 mb-4">{doc.description}</p>}
            <p className="text-xs text-gray-500">
              Opprettet: {new Date(doc.created_at).toLocaleDateString("no-NO")} · 
              Oppdatert: {new Date(doc.updated_at).toLocaleDateString("no-NO")}
            </p>
            <p className="text-xs text-gray-500 mt-1">Kategori: {doc.category || "Generelt"}</p>
          </div>
        )}
      </div>
      <style>{`
        .pdf-content h2 { font-size:18px;font-weight:bold;color:#000;margin:1.5em 0 0.5em 0;padding-bottom:4px;border-bottom:1px solid #e0e0e0;font-family:'Georgia',serif; }
        .pdf-content h3 { font-size:14px;font-weight:bold;color:#1a1a1a;margin:1.2em 0 0.4em 0;font-family:'Georgia',serif; }
        .pdf-content p { font-size:13px;color:#333;line-height:1.7;margin:0.5em 0; }
        .pdf-content ul,.pdf-content ol { font-size:13px;color:#333;line-height:1.7;padding-left:1.5em;margin:0.5em 0; }
        .pdf-content li { margin-bottom:4px; }
        .pdf-content strong { color:#000; }
        .pdf-content table { width:100%;border-collapse:collapse;margin:1em 0;font-size:12px; }
        .pdf-content table td,.pdf-content table th { padding:6px 8px;border-bottom:1px solid #e0e0e0;color:#333; }
        .pdf-content table tr:first-child td { font-weight:bold;color:#000;border-bottom:2px solid #ccc; }
        .pdf-content .merge-field { background:#f0f0f0;color:#666;padding:1px 6px;border-radius:3px;font-size:12px;font-weight:500;border:1px dashed #ccc; }
        .pdf-content hr { margin:2em 0;border:none;border-top:1px solid #ddd; }
      `}</style>
    </div>
  );
};

// ========== DOCUMENTS PANEL ==========
const DocumentsPanel = () => {
  const [docs, setDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("Alle");
  const [openDoc, setOpenDoc] = useState<any>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const bulkDeleteDocs = async () => {
    if (selected.size === 0) return;
    if (!confirm(`Slett ${selected.size} valgte dokumenter?`)) return;
    setBulkDeleting(true);
    for (const id of selected) {
      await supabase.from("customer_documents").delete().eq("id", id);
    }
    toast.success(`${selected.size} dokumenter slettet`);
    setSelected(new Set());
    load();
    setBulkDeleting(false);
  };

  const [sendingEmail, setSendingEmail] = useState<string | null>(null);

  const handleSendEmail = async (doc: any) => {
    setSendingEmail(doc.id);
    try {
      const { data: company } = await supabase.from("customer_companies").select("id").limit(1).maybeSingle();
      let docHtml = "";
      if (doc.category?.startsWith("HR") && company) {
        const { data: chapter } = await supabase
          .from("customer_handbook_chapters")
          .select("content")
          .eq("company_id", company.id)
          .eq("title", doc.title)
          .maybeSingle();
        docHtml = chapter?.content || `<p>${doc.description || doc.title}</p>`;
      } else {
        docHtml = `<p>${doc.description || doc.title}</p><p>Kategori: ${doc.category || "Generelt"}</p>`;
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("email, name")
        .limit(1)
        .maybeSingle();

      if (!profileData?.email) { toast.error("Ingen e-post funnet"); setSendingEmail(null); return; }

      await supabase.functions.invoke("notify", {
        body: {
          type: "send_document",
          data: {
            recipient_email: profileData.email,
            recipient_name: profileData.name,
            document_title: doc.title,
            document_html: docHtml,
          },
        },
      });
      toast.success(`Dokument sendt til ${profileData.email}`);
    } catch {
      toast.error("Kunne ikke sende dokument");
    }
    setSendingEmail(null);
  };

  const toggleSelect = (id: string) => {
    setSelected(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  };

  const toggleAll = () => {
    setSelected(selected.size === filtered.length ? new Set() : new Set(filtered.map(d => d.id)));
  };

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("customer_documents")
      .select("*")
      .order("created_at", { ascending: false });
    setDocs(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (doc: any) => {
    if (!confirm(`Slette "${doc.title}"?`)) return;
    const { error } = await supabase.from("customer_documents").delete().eq("id", doc.id);
    if (error) { toast.error("Kunne ikke slette dokumentet"); return; }
    toast.success("Dokument slettet");
    setDocs(prev => prev.filter(d => d.id !== doc.id));
    setOpenMenu(null);
  };

  const handleDownloadFile = async (doc: any) => {
    if (!doc.file_url) return;
    const { data } = await supabase.storage.from("internal-docs").createSignedUrl(doc.file_url, 3600);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank");
    setOpenMenu(null);
  };

  const handleDownloadPdf = async (doc: any) => {
    const { data: company } = await supabase.from("customer_companies").select("id").limit(1).maybeSingle();
    if (!company) return;
    const { data: chapter } = await supabase
      .from("customer_handbook_chapters")
      .select("content")
      .eq("company_id", company.id)
      .eq("title", doc.title)
      .maybeSingle();
    if (!chapter?.content) { toast.error("Ingen innhold funnet — lagre dokumentet først"); return; }

    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const container = document.createElement("div");
      container.style.cssText = "width:210mm;padding:20mm;font-family:'Georgia','Times New Roman',serif;font-size:13px;line-height:1.7;color:#1a1a1a;";
      container.innerHTML = chapter.content;

      await html2pdf().set({
        margin: [15, 18, 15, 18],
        filename: `${doc.title.replace(/\s+/g, "-")}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: "#ffffff" },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ["css", "legacy"] },
      }).from(container).save();
      toast.success("PDF lastet ned!");
    } catch { toast.error("Kunne ikke generere PDF"); }
    setOpenMenu(null);
  };

  if (loading) return <div className="text-muted-foreground text-sm">Laster…</div>;

  const categories = ["Alle", ...Array.from(new Set(docs.map(d => d.category || "Generelt")))];
  const filtered = activeCategory === "Alle" ? docs : docs.filter(d => (d.category || "Generelt") === activeCategory);
  const isHrDoc = (doc: any) => doc.category?.startsWith("HR");

  return (
    <div className="space-y-4">
      {openDoc && <DocumentViewer doc={openDoc} onClose={() => setOpenDoc(null)} />}

      <div className="flex items-center gap-2 flex-wrap">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
              activeCategory === cat
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <p className="text-sm text-muted-foreground">{filtered.length} dokumenter</p>
        {selected.size > 0 && (
          <button onClick={bulkDeleteDocs} disabled={bulkDeleting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors disabled:opacity-50">
            <Trash2 size={13} /> Slett {selected.size} valgte
          </button>
        )}
        {filtered.length > 0 && (
          <button onClick={toggleAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs border border-border/30 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
            {selected.size === filtered.length ? <CheckSquare size={13} /> : <Square size={13} />}
            {selected.size === filtered.length ? "Fjern alle" : "Velg alle"}
          </button>
        )}
      </div>
      {filtered.map(doc => (
        <div key={doc.id} className={`glass rounded-2xl px-5 py-4 border flex items-center justify-between transition-colors ${
          selected.has(doc.id) ? "border-primary/40 bg-primary/5" : "border-border/20"
        }`}>
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button onClick={() => toggleSelect(doc.id)} className="text-muted-foreground hover:text-primary transition-colors shrink-0">
              {selected.has(doc.id) ? <CheckSquare size={15} className="text-primary" /> : <Square size={15} />}
            </button>
            <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium truncate">{doc.title}</p>
              {doc.category && doc.category !== "Generelt" && (
                <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-medium shrink-0">{doc.category}</span>
              )}
            </div>
            {doc.description && <p className="text-xs text-muted-foreground mt-0.5 truncate">{doc.description}</p>}
            <p className="text-[10px] text-muted-foreground mt-1">{new Date(doc.created_at).toLocaleDateString("no-NO")}</p>
          </div>
          </div>
          <div className="flex items-center gap-1 ml-3 shrink-0">
            <button onClick={() => setOpenDoc(doc)} className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all" title="Åpne">
              <Eye size={15} />
            </button>
            {doc.file_url && (
              <button onClick={() => handleDownloadFile(doc)} className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all" title="Last ned fil">
                <Download size={15} />
              </button>
            )}
            {isHrDoc(doc) && (
              <button onClick={() => handleDownloadPdf(doc)} className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all" title="Last ned PDF">
                <Download size={15} />
              </button>
            )}
            <button
              onClick={() => handleSendEmail(doc)}
              disabled={sendingEmail === doc.id}
              className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all disabled:opacity-50"
              title="Send på e-post"
            >
              {sendingEmail === doc.id ? <span className="animate-spin text-xs">⏳</span> : <Mail size={15} />}
            </button>
            <button onClick={() => handleDelete(doc)} className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all" title="Slett">
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

// ========== HANDBOOK PANEL ==========
const HandbookPanel = () => {
  const [chapters, setChapters] = useState<any[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isTemplate, setIsTemplate] = useState(false);
  const [search, setSearch] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      const { data: custChapters } = await supabase
        .from("customer_handbook_chapters")
        .select("*")
        .order("sort_order");

      if (custChapters && custChapters.length > 0) {
        setChapters(custChapters);
        setIsTemplate(false);
      } else {
        const { data: templateChapters } = await supabase
          .from("hr_handbook")
          .select("*")
          .order("sort_order");
        setChapters(templateChapters || []);
        setIsTemplate(true);
      }
      setLoading(false);
    };
    load();
  }, []);

  const initAndEdit = async (chapterIdx: number) => {
    const { data: company } = await supabase
      .from("customer_companies")
      .select("id")
      .limit(1)
      .maybeSingle();
    if (!company) { toast.error("Ingen bedrift funnet"); return; }

    setSaving(true);
    const rows = chapters.map(ch => ({
      company_id: company.id,
      source_chapter_id: ch.id,
      title: ch.title,
      content: ch.content,
      sort_order: ch.sort_order,
      customized: false,
    }));
    const { data: inserted } = await supabase
      .from("customer_handbook_chapters")
      .insert(rows)
      .select();

    if (inserted && inserted.length > 0) {
      setChapters(inserted);
      setIsTemplate(false);
      setActiveIdx(chapterIdx);
      setEditContent(inserted[chapterIdx]?.content || "");
      setEditing(true);
    }
    setSaving(false);
  };

  const saveContent = async () => {
    const ch = chapters[activeIdx];
    if (!ch) return;
    setSaving(true);
    await supabase.from("customer_handbook_chapters")
      .update({ content: editContent, customized: true })
      .eq("id", ch.id);
    const updated = [...chapters];
    updated[activeIdx] = { ...ch, content: editContent, customized: true };
    setChapters(updated);
    setEditing(false);
    setSaving(false);
    toast.success("Kapittel lagret");
  };

  const stripHtml = (html: string) => (html || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ");

  const matchingIndices = search.trim()
    ? chapters
        .map((ch, i) => {
          const q = search.toLowerCase();
          const inTitle = (ch.title || "").toLowerCase().includes(q);
          const inContent = stripHtml(ch.content || "").toLowerCase().includes(q);
          return inTitle || inContent ? i : -1;
        })
        .filter(i => i >= 0)
    : [];

  const renderContentWithEditableFields = (html: string) => {
    if (!html) return "<p class='text-muted-foreground italic'>Ingen innhold ennå.</p>";
    return html.replace(
      /\[([^\]]+)\]/g,
      '<span class="editable-field" data-field="$1" role="button" tabindex="0" title="Klikk for å fylle inn">[$1]</span>'
    );
  };

  const handleFieldClick = useCallback(async (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (!target.classList.contains("editable-field")) return;
    if (isTemplate) {
      await initAndEdit(activeIdx);
      return;
    }

    const fieldName = target.getAttribute("data-field") || "";
    const currentText = target.textContent || "";
    const isOriginal = currentText.startsWith("[") && currentText.endsWith("]");
    
    const input = document.createElement("input");
    input.type = "text";
    input.value = isOriginal ? "" : currentText;
    input.placeholder = fieldName;
    input.className = "inline-field-input";
    input.style.cssText = `
      display: inline-block;
      min-width: 120px;
      width: ${Math.max(120, fieldName.length * 10)}px;
      padding: 2px 8px;
      border-radius: 6px;
      border: 2px solid hsl(var(--primary));
      background: hsl(var(--primary) / 0.08);
      color: hsl(var(--foreground));
      font-size: inherit;
      font-family: inherit;
      font-weight: 500;
      outline: none;
    `;

    const saveField = async () => {
      const newValue = input.value.trim();
      if (!newValue) {
        const span = document.createElement("span");
        span.className = "editable-field";
        span.setAttribute("data-field", fieldName);
        span.setAttribute("role", "button");
        span.setAttribute("tabindex", "0");
        span.setAttribute("title", "Klikk for å fylle inn");
        span.textContent = `[${fieldName}]`;
        input.replaceWith(span);
        return;
      }

      const span = document.createElement("span");
      span.className = "editable-field editable-field--filled";
      span.setAttribute("data-field", fieldName);
      span.setAttribute("role", "button");
      span.setAttribute("tabindex", "0");
      span.setAttribute("title", `Klikk for å endre (${fieldName})`);
      span.textContent = newValue;
      input.replaceWith(span);

      if (contentRef.current) {
        const newHtml = contentRef.current.innerHTML;
        const ch = chapters[activeIdx];
        if (!ch) return;
        await supabase.from("customer_handbook_chapters")
          .update({ content: newHtml, customized: true })
          .eq("id", ch.id);
        const updated = [...chapters];
        updated[activeIdx] = { ...ch, content: newHtml, customized: true };
        setChapters(updated);
        toast.success(`«${fieldName}» oppdatert`);
      }
    };

    input.addEventListener("blur", saveField);
    input.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter") { ev.preventDefault(); input.blur(); }
      if (ev.key === "Escape") { input.value = ""; input.blur(); }
    });

    target.replaceWith(input);
    input.focus();
    input.select();
  }, [isTemplate, activeIdx, chapters]);

  const highlightSearch = (html: string) => {
    if (!search.trim()) return html;
    const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return html.replace(
      new RegExp(`(${escaped})`, 'gi'),
      '<mark class="bg-primary/20 text-foreground rounded px-0.5">$1</mark>'
    );
  };

  if (loading) return <div className="text-muted-foreground text-sm">Laster…</div>;

  if (chapters.length === 0) {
    return (
      <div className="glass rounded-2xl p-8 border border-border/20 text-center">
        <BookOpen size={32} className="text-muted-foreground/30 mx-auto mb-3" />
        <h3 className="font-heading text-base mb-1">Personalhåndbok</h3>
        <p className="text-sm text-muted-foreground">Ingen standard personalhåndbok er tilgjengelig ennå.</p>
      </div>
    );
  }

  const active = chapters[activeIdx];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl md:text-3xl">Personalhåndbok</h2>
          <p className="text-xs text-muted-foreground mt-1">
            {isTemplate ? "Standardmal fra Avargo — klikk «Rediger» for å tilpasse." : `${chapters.filter(c => c.customized).length} av ${chapters.length} kapitler tilpasset`}
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Søk i håndboken…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-10 rounded-xl border border-border/30 bg-muted/30 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-muted-foreground/50"
          />
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
        </div>
      </div>

      {search.trim() && (
        <div className="glass rounded-2xl p-4 border border-border/20 space-y-2">
          <p className="text-xs text-muted-foreground">{matchingIndices.length} treff for «{search}»</p>
          {matchingIndices.length === 0 && (
            <p className="text-sm text-muted-foreground/60 italic">Ingen kapitler inneholder søkeordet.</p>
          )}
          {matchingIndices.map(i => (
            <button
              key={chapters[i].id}
              onClick={() => { setActiveIdx(i); setEditing(false); setSearch(""); }}
              className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-muted/50 transition-colors"
            >
              <p className="text-sm font-medium">{chapters[i].title}</p>
              <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{stripHtml(chapters[i].content || "").slice(0, 120)}…</p>
            </button>
          ))}
        </div>
      )}

      {isTemplate && (
        <div className="rounded-2xl px-5 py-3 border border-amber-500/20 bg-amber-500/5">
          <p className="text-xs text-amber-600">Du ser standardmalen fra Avargo. Klikk «Rediger» på et kapittel for å opprette din egen tilpassede versjon. Felter markert med <span className="editable-field-preview">[klammeparentes]</span> bør tilpasses til din bedrift.</p>
        </div>
      )}

      <div className="flex gap-8">
        <div className="w-56 shrink-0 hidden md:block">
          <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground/60 mb-3 px-3">Innhold</p>
          <nav className="space-y-0.5">
            {chapters.map((ch, i) => (
              <button
                key={ch.id}
                onClick={() => { setActiveIdx(i); setEditing(false); }}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all duration-200 ${
                  i === activeIdx
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50 font-light"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground/40 w-4 text-right shrink-0">{i + 1}</span>
                  <span className="line-clamp-1">{ch.title}</span>
                </span>
                {ch.customized && <span className="ml-6 text-[9px] text-primary">Tilpasset</span>}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1 min-w-0">
          <select
            className="md:hidden w-full h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm mb-4"
            value={activeIdx}
            onChange={e => { setActiveIdx(Number(e.target.value)); setEditing(false); }}
          >
            {chapters.map((ch, i) => (
              <option key={ch.id} value={i}>{i + 1}. {ch.title}</option>
            ))}
          </select>

          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="mb-8 pb-6 border-b border-border/20">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[11px] tracking-[0.3em] uppercase font-semibold text-primary">
                  Kapittel {activeIdx + 1}
                </span>
                {active.customized && (
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-primary/10 text-primary">Tilpasset</span>
                )}
              </div>

              <h1 className="font-heading text-[2rem] sm:text-[2.5rem] md:text-[2.8rem] leading-[1.1] tracking-tight mb-4">
                {active.title}
              </h1>

              <div className="flex items-center gap-4">
                {!editing ? (
                  <button
                    onClick={() => {
                      if (isTemplate) {
                        initAndEdit(activeIdx);
                      } else {
                        setEditing(true);
                        setEditContent(active.content || "");
                      }
                    }}
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs rounded-xl border border-border/30 hover:bg-muted/50 text-muted-foreground hover:text-foreground disabled:opacity-50 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                    {saving ? "Oppretter…" : "Rediger kapittel"}
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={saveContent} disabled={saving}
                      className="px-4 py-2 text-xs rounded-xl bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-colors">
                      {saving ? "Lagrer…" : "Lagre endringer"}
                    </button>
                    <button onClick={() => setEditing(false)}
                      className="px-4 py-2 text-xs rounded-xl border border-border/30 hover:bg-muted/50 transition-colors">
                      Avbryt
                    </button>
                  </div>
                )}
              </div>
            </div>

            {editing ? (
              <textarea
                value={editContent}
                onChange={e => setEditContent(e.target.value)}
                className="w-full min-h-[500px] rounded-2xl border border-border/30 bg-muted/20 px-6 py-5 text-sm leading-relaxed font-mono focus:outline-none focus:ring-2 focus:ring-primary/40 resize-y"
                placeholder="Skriv innholdet her. Bruk [Bedriftsnavn], [Daglig leder] osv. som plassholdere kunden kan fylle inn."
              />
            ) : (
              <div
                ref={contentRef}
                onClick={handleFieldClick}
                className="article-content handbook-content"
                dangerouslySetInnerHTML={{
                  __html: highlightSearch(renderContentWithEditableFields(active.content || ""))
                }}
              />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12 pt-8 border-t border-border/20">
              {activeIdx > 0 ? (
                <button
                  onClick={() => { setActiveIdx(activeIdx - 1); setEditing(false); }}
                  className="group glass rounded-2xl p-5 border border-border/20 hover:border-primary/30 transition-all text-left"
                >
                  <span className="text-[10px] tracking-widest uppercase text-muted-foreground/60">← Forrige kapittel</span>
                  <p className="text-sm font-medium mt-1 group-hover:text-primary transition-colors line-clamp-2 font-heading text-base">
                    {chapters[activeIdx - 1].title}
                  </p>
                </button>
              ) : <div />}
              {activeIdx < chapters.length - 1 ? (
                <button
                  onClick={() => { setActiveIdx(activeIdx + 1); setEditing(false); }}
                  className="group glass rounded-2xl p-5 border border-border/20 hover:border-primary/30 transition-all text-right"
                >
                  <span className="text-[10px] tracking-widest uppercase text-muted-foreground/60">Neste kapittel →</span>
                  <p className="text-sm font-medium mt-1 group-hover:text-primary transition-colors line-clamp-2 font-heading text-base">
                    {chapters[activeIdx + 1].title}
                  </p>
                </button>
              ) : <div />}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// ========== BOOKING PANEL ==========
const BookingPanel = () => {
  const [company, setCompany] = useState<any>(null);
  const [advisors, setAdvisors] = useState<any[]>([]);
  const [availability, setAvailability] = useState<any[]>([]);
  const [blockedDates, setBlockedDates] = useState<any[]>([]);
  const [existingBookings, setExistingBookings] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedSlot, setSelectedSlot] = useState<{ time: string; advisorId: string } | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", company_name: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [advisorRequest, setAdvisorRequest] = useState<any>(null);
  const [requestMessage, setRequestMessage] = useState("");
  const [sendingRequest, setSendingRequest] = useState(false);
  const { profile } = useAuth();

  const hasAdvisors = company?.primary_advisor_id || company?.backup_advisor_id;

  useEffect(() => {
    const load = async () => {
      const { data: comp } = await supabase.from("customer_companies").select("*").limit(1).maybeSingle();
      setCompany(comp);
      if (comp) {
        const { data: reqData } = await supabase.from("advisor_requests").select("*").eq("company_id", comp.id).order("created_at", { ascending: false }).limit(1).maybeSingle();
        setAdvisorRequest(reqData);
      }
      if (comp?.primary_advisor_id || comp?.backup_advisor_id) {
        const advisorIds = [comp.primary_advisor_id, comp.backup_advisor_id].filter(Boolean);
        const [advRes, availRes, blockedRes, bookRes] = await Promise.all([
          supabase.from("profiles").select("id, name, teams_link").in("id", advisorIds),
          supabase.from("advisor_availability").select("*").in("profile_id", advisorIds).eq("active", true),
          supabase.from("advisor_blocked_dates").select("*").in("profile_id", advisorIds),
          supabase.from("bookings").select("*").in("advisor_id", advisorIds).neq("status", "cancelled"),
        ]);
        setAdvisors(advRes.data || []);
        setAvailability(availRes.data || []);
        setBlockedDates(blockedRes.data || []);
        setExistingBookings(bookRes.data || []);
      }
      if (profile) setForm(f => ({ ...f, name: profile.name || "", email: profile.email || "" }));
      if (comp) setForm(f => ({ ...f, company_name: comp.company_name || "" }));
      setLoading(false);
    };
    load();
  }, [profile]);

  const sendAdvisorRequest = async () => {
    if (!company) return;
    setSendingRequest(true);
    const { error } = await supabase.from("advisor_requests").insert({ company_id: company.id, message: requestMessage || null });
    if (error) toast.error("Kunne ikke sende forespørsel");
    else {
      setAdvisorRequest({ status: "pending", message: requestMessage });
      toast.success("Forespørsel sendt til Avargo!");
      // Send email to assigned advisor
      supabase.functions.invoke("notify", {
        body: {
          type: "advisor_request",
          data: {
            company_name: company.company_name,
            company_id: company.id,
            message: requestMessage || null,
            customer_name: profile?.name,
          },
        },
      }).catch(err => console.warn("advisor_request notify failed:", err));
    }
    setSendingRequest(false);
  };

  const generateSlots = (start: string, end: string) => {
    const slots: string[] = [];
    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);
    let mins = sh * 60 + sm;
    const endMins = eh * 60 + em;
    while (mins + 30 <= endMins) {
      slots.push(`${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`);
      mins += 30;
    }
    return slots;
  };

  const getAvailableSlots = (date: Date) => {
    const dayOfWeek = date.getDay();
    const dateStr = date.toISOString().split("T")[0];
    const slots: { time: string; advisorId: string; advisorName: string }[] = [];
    for (const adv of advisors) {
      if (blockedDates.some(b => b.profile_id === adv.id && b.blocked_date === dateStr)) continue;
      const dayAvail = availability.filter(a => a.profile_id === adv.id && a.day_of_week === dayOfWeek);
      for (const a of dayAvail) {
        const timeSlots = generateSlots(a.start_time, a.end_time);
        for (const time of timeSlots) {
          const booked = existingBookings.some(b => b.advisor_id === adv.id && b.booking_date === dateStr && b.booking_time === time + ":00");
          if (!booked) slots.push({ time, advisorId: adv.id, advisorName: adv.name });
        }
      }
    }
    return slots.sort((a, b) => a.time.localeCompare(b.time));
  };

  const isDayDisabled = (date: Date) => {
    if (date < new Date(new Date().toDateString())) return true;
    return getAvailableSlots(date).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot || !selectedDate) return;
    setSubmitting(true);
    const dateStr = selectedDate.toISOString().split("T")[0];
    const advisor = advisors.find(a => a.id === selectedSlot.advisorId);
    const { error } = await supabase.from("bookings").insert({
      advisor_id: selectedSlot.advisorId, booking_date: dateStr, booking_time: selectedSlot.time + ":00",
      customer_name: form.name, customer_email: form.email, customer_phone: form.phone,
      company_name: form.company_name, message: form.message || null, teams_link: advisor?.teams_link || null,
    });
    if (!error) {
      try {
        await supabase.functions.invoke("notify", {
          body: { type: "booking_notification", data: {
            advisor_id: selectedSlot.advisorId, customer_name: form.name, customer_email: form.email,
            customer_phone: form.phone, company_name: form.company_name, booking_date: dateStr,
            booking_time: selectedSlot.time, message: form.message || null,
          }},
        });
      } catch (e) { console.error("Notification error:", e); }
    }
    setSuccess(true);
    setSubmitting(false);
  };

  if (loading) return <div className="text-muted-foreground text-sm">Laster…</div>;

  if (success) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-2xl p-8 border border-primary/20 bg-primary/5 text-center">
        <CalendarDays size={32} className="text-primary mx-auto mb-3" />
        <h3 className="font-heading text-lg mb-1">Booking mottatt!</h3>
        <p className="text-sm text-muted-foreground">Vi bekrefter timen din på e-post.</p>
      </motion.div>
    );
  }

  const slotsForDate = selectedDate ? getAvailableSlots(selectedDate) : [];

  return (
    <div className="space-y-6">
      {hasAdvisors ? (
        <div className="glass rounded-2xl p-5 border border-border/20">
          <p className="text-sm text-muted-foreground mb-1">Dine rådgivere</p>
          <div className="flex gap-3">
            {advisors.map(a => (
              <div key={a.id} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-medium">{a.name?.charAt(0)}</div>
                <div>
                  <p className="text-sm font-medium">{a.name}</p>
                  <p className="text-[10px] text-muted-foreground">{company.primary_advisor_id === a.id ? "Oppdragsansvarlig" : "Reserve"}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="glass rounded-2xl p-6 border border-amber-500/20 bg-amber-500/5 space-y-3">
          <div className="flex items-start gap-3">
            <CalendarDays size={24} className="text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-heading text-base mb-1">Ingen rådgiver tildelt</h3>
              <p className="text-sm text-muted-foreground">Du har ikke fått tildelt en rådgiver ennå. Send en forespørsel til Avargo, så tildeler vi deg en rådgiver.</p>
            </div>
          </div>
          {advisorRequest?.status === "pending" ? (
            <div className="px-4 py-2 rounded-xl bg-amber-500/10 text-amber-600 text-xs">⏳ Forespørsel sendt – venter på svar fra Avargo</div>
          ) : advisorRequest?.status === "approved" ? (
            <div className="px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-600 text-xs">✓ Forespørsel godkjent – rådgiver blir tildelt</div>
          ) : (
            <div className="space-y-2">
              <input value={requestMessage} onChange={e => setRequestMessage(e.target.value)} placeholder="Melding til Avargo (valgfritt)"
                className="w-full h-9 rounded-xl border border-border/30 bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
              <button onClick={sendAdvisorRequest} disabled={sendingRequest} className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm hover:opacity-90 disabled:opacity-50">
                {sendingRequest ? "Sender…" : "Be om rådgiver"}
              </button>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-5 border border-border/20">
          <h3 className="font-heading text-base mb-3">Velg dato</h3>
          {hasAdvisors ? (
            <Calendar mode="single" selected={selectedDate} onSelect={d => { setSelectedDate(d); setSelectedSlot(null); }} disabled={isDayDisabled} className="p-3 pointer-events-auto" />
          ) : (
            <div className="text-center py-8">
              <CalendarDays size={28} className="text-muted-foreground/20 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Kalenderen blir tilgjengelig når du har en rådgiver.</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {selectedDate && hasAdvisors && (
            <div className="glass rounded-2xl p-5 border border-border/20">
              <h3 className="font-heading text-base mb-3">
                Ledige tider {selectedDate.toLocaleDateString("no-NO", { weekday: "long", day: "numeric", month: "long" })}
              </h3>
              {slotsForDate.length === 0 ? (
                <p className="text-sm text-muted-foreground">Ingen ledige tider denne dagen.</p>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {slotsForDate.map((s, i) => (
                    <button key={i} onClick={() => setSelectedSlot({ time: s.time, advisorId: s.advisorId })}
                      className={`px-3 py-2 rounded-xl text-sm border transition-colors ${
                        selectedSlot?.time === s.time && selectedSlot?.advisorId === s.advisorId
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border/30 hover:border-primary/40"
                      }`}>
                      <span className="font-medium">{s.time}</span>
                      <span className="block text-[10px] opacity-70">{s.advisorName}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {selectedSlot && (
            <form onSubmit={handleSubmit} className="glass rounded-2xl p-5 border border-border/20 space-y-3">
              <h3 className="font-heading text-base">Bekreft booking</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Navn *" required className="w-full h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="E-post *" type="email" required className="w-full h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Telefon *" required className="w-full h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                <input value={form.company_name} onChange={e => setForm({ ...form, company_name: e.target.value })} placeholder="Bedrift *" required className="w-full h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
              </div>
              <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Beskjed (valgfritt)" rows={2}
                className="w-full rounded-xl border border-border/30 bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none" />
              <button type="submit" disabled={submitting} className="w-full h-10 bg-primary text-primary-foreground rounded-xl text-sm hover:opacity-90 disabled:opacity-50 transition-all">
                {submitting ? "Sender…" : "Bekreft booking"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

// ========== PARTNERS PANEL ==========
const PartnersPanel = () => {
  const [partners, setPartners] = useState<any[]>([]);
  const [company, setCompany] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [requestingId, setRequestingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      const [partRes, compRes] = await Promise.all([
        supabase.from("collaboration_agreements").select("*").neq("target_audience", "admin_only").order("created_at", { ascending: false }),
        supabase.from("customer_companies").select("*").limit(1).maybeSingle(),
      ]);
      setPartners(partRes.data || []);
      setCompany(compRes.data);
      if (compRes.data) {
        const { data: reqs } = await supabase.from("partnership_requests").select("*").eq("company_id", compRes.data.id);
        setRequests(reqs || []);
      }
      setLoading(false);
    };
    load();
  }, []);

  const sendRequest = async (agreementId: string) => {
    if (!company) return;
    const { error } = await supabase.from("partnership_requests").insert({ agreement_id: agreementId, company_id: company.id, message: message || null });
    if (error) {
      if (error.code === "23505") toast.info("Du har allerede sendt en forespørsel for denne avtalen");
      else toast.error("Kunne ikke sende forespørsel");
      setRequestingId(null);
      return;
    }
    setRequests([...requests, { agreement_id: agreementId, company_id: company.id, status: "pending" }]);
    setRequestingId(null);
    setMessage("");
    toast.success("Forespørsel sendt til Avargo!");
  };

  const getRequestStatus = (agreementId: string) => requests.find(r => r.agreement_id === agreementId);

  if (loading) return <div className="text-muted-foreground text-sm">Laster…</div>;

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{partners.length} fordelsavtaler tilgjengelig</p>
      {partners.map(p => {
        const req = getRequestStatus(p.id);
        return (
          <div key={p.id} className="glass rounded-2xl px-5 py-4 border border-border/20">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg border border-border/10 bg-muted/20 flex items-center justify-center shrink-0">
                <Building2 size={16} className="text-muted-foreground/40" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{p.title}</p>
                {p.company && <p className="text-xs text-muted-foreground">{p.company}</p>}
                {p.description && <p className="text-xs mt-1 text-foreground/80">{p.description}</p>}
                {p.offering && <p className="text-xs mt-1">{p.offering}</p>}
                {p.price && <p className="text-xs text-primary font-medium mt-1">{p.price}</p>}
                {p.website && <a href={p.website} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline mt-1 inline-block">Besøk nettside →</a>}
                <div className="mt-3">
                  {req ? (
                    <span className={`text-xs px-3 py-1 rounded-full ${
                      req.status === "pending" ? "bg-amber-500/10 text-amber-600" :
                      req.status === "approved" ? "bg-emerald-500/10 text-emerald-600" :
                      "bg-destructive/10 text-destructive"
                    }`}>
                      {req.status === "pending" ? "⏳ Forespørsel sendt" : req.status === "approved" ? "✓ Godkjent" : "✕ Avslått"}
                    </span>
                  ) : requestingId === p.id ? (
                    <div className="space-y-2">
                      <input value={message} onChange={e => setMessage(e.target.value)} placeholder="Melding til Avargo (valgfritt)"
                        className="w-full h-9 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                      <div className="flex gap-2">
                        <button onClick={() => sendRequest(p.id)} className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs hover:opacity-90">Send forespørsel</button>
                        <button onClick={() => { setRequestingId(null); setMessage(""); }} className="px-3 py-1.5 rounded-lg text-xs border border-border/30 hover:bg-muted/50">Avbryt</button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => setRequestingId(p.id)} className="px-3 py-1.5 border border-primary/30 text-primary rounded-lg text-xs hover:bg-primary/5 transition-colors">
                      Jeg ønsker denne avtalen
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ========== EMPLOYEES PANEL ==========
const EmployeesPanel = () => {
  const { profile } = useAuth();
  const [invitations, setInvitations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", role: "ansatt" });
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    const { data } = await supabase.from("customer_employee_invitations").select("*").order("created_at", { ascending: false });
    setInvitations(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) return;
    setSubmitting(true);
    const { data: company } = await supabase.from("customer_companies").select("id, company_name").limit(1).maybeSingle();
    if (!company) { toast.error("Ingen bedrift funnet"); setSubmitting(false); return; }
    const { error } = await supabase.from("customer_employee_invitations").insert({
      company_id: company.id, invited_by: profile!.id,
      employee_name: formData.name.trim(), employee_email: formData.email.trim(), role: formData.role,
    });
    if (error) { toast.error("Kunne ikke sende invitasjon"); }
    else {
      try {
        await supabase.functions.invoke("notify", {
          body: { type: "employee_invitation", data: {
            company_name: company.company_name, employee_name: formData.name.trim(),
            employee_email: formData.email.trim(), invited_by_name: profile?.name || "Ukjent",
          }},
        });
      } catch (e) { console.error("Notification error:", e); }
      toast.success("Invitasjon sendt — venter på godkjenning fra admin");
      setFormData({ name: "", email: "", role: "ansatt" });
      setShowForm(false);
      load();
    }
    setSubmitting(false);
  };

  if (loading) return <div className="text-muted-foreground text-sm">Laster…</div>;

  const statusLabel = (s: string) => {
    if (s === "pending") return { text: "Venter på godkjenning", color: "text-amber-600 bg-amber-500/10" };
    if (s === "approved") return { text: "Godkjent", color: "text-emerald-600 bg-emerald-500/10" };
    if (s === "rejected") return { text: "Avslått", color: "text-destructive bg-destructive/10" };
    return { text: s, color: "text-muted-foreground bg-muted/30" };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-xl">Ansatte</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Legg til ansatte i portalen. Alle invitasjoner må godkjennes av admin.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="inline-flex items-center gap-1.5 px-4 py-2 text-xs rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
          <UserPlus size={14} /> Legg til ansatt
        </button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-5 border border-border/20">
          <form onSubmit={handleInvite} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Navn</label>
                <input value={formData.name} onChange={e => setFormData(f => ({ ...f, name: e.target.value }))} placeholder="Fullt navn" required
                  className="w-full h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">E-post</label>
                <input type="email" value={formData.email} onChange={e => setFormData(f => ({ ...f, email: e.target.value }))} placeholder="ansatt@bedrift.no" required
                  className="w-full h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button type="submit" disabled={submitting} className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm hover:opacity-90 disabled:opacity-50 transition-all">
                {submitting ? "Sender…" : "Send invitasjon"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-border/30 rounded-xl text-sm hover:bg-muted/50 transition-colors">Avbryt</button>
            </div>
            <p className="text-[10px] text-muted-foreground">Invitasjonen sendes til admin for godkjenning. Den ansatte får tilgang først etter at admin har godkjent.</p>
          </form>
        </motion.div>
      )}

      {invitations.length === 0 ? (
        <div className="glass rounded-2xl p-8 border border-border/20 text-center">
          <Users size={32} className="text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Ingen ansatte lagt til ennå.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {invitations.map(inv => {
            const status = statusLabel(inv.status);
            return (
              <div key={inv.id} className="glass rounded-2xl px-5 py-4 border border-border/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-medium">
                    {inv.employee_name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{inv.employee_name}</p>
                    <p className="text-xs text-muted-foreground">{inv.employee_email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-medium ${status.color}`}>{status.text}</span>
                  <span className="text-[10px] text-muted-foreground">{new Date(inv.created_at).toLocaleDateString("no-NO")}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ========== REGNSKAPSORD PANEL ==========
const RegnskapsordPanel = () => {
  const [terms, setTerms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("glossary_terms")
        .select("*")
        .eq("active", true)
        .order("term", { ascending: true });
      setTerms(data || []);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = terms.filter(t => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return t.term.toLowerCase().includes(q) || (t.description || "").toLowerCase().includes(q);
  });

  const grouped = filtered.reduce((acc, t) => {
    const letter = t.term.charAt(0).toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(t);
    return acc;
  }, {} as Record<string, any[]>);

  const letters = Object.keys(grouped).sort((a, b) => a.localeCompare(b, "nb"));

  if (loading) return <div className="text-muted-foreground text-sm">Laster ordbok…</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl mb-1">Regnskapsordbok</h2>
        <p className="text-sm text-muted-foreground">Søk etter begreper og finn klare forklaringer.</p>
      </div>

      <div className="relative max-w-md">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Søk etter et regnskapsbegrep…"
          className="w-full h-10 pl-9 pr-3 rounded-xl border border-border/30 bg-muted/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
      </div>

      <div className="flex flex-wrap gap-1">
        {letters.map(l => (
          <a key={l} href={`#glossary-${l}`} className="w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium hover:bg-primary/10 hover:text-primary transition-colors">
            {l}
          </a>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">{filtered.length} begreper</p>

      {letters.length === 0 ? (
        <p className="text-muted-foreground text-sm py-8 text-center">Ingen treff.</p>
      ) : (
        <div className="space-y-6">
          {letters.map(letter => (
            <div key={letter} id={`glossary-${letter}`}>
              <h3 className="text-xl font-bold text-primary mb-2">{letter}</h3>
              <div className="space-y-2">
                {grouped[letter].map((item: any) => (
                  <div key={item.id} className="glass rounded-2xl px-5 py-4 border border-border/20">
                    <p className="text-sm font-medium">{item.term}</p>
                    {item.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-3">{item.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default KundeDashboard;
