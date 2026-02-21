import { useState, useEffect, useCallback, useRef } from "react";
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
  Download, Building2, Wand2, Calculator
} from "lucide-react";
import HrGenerator from "@/components/kunde/HrGenerator";
import AnsettelsesKalkulator from "@/components/kunde/AnsettelsesKalkulator";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, BarChart, Bar
} from "recharts";

type Panel = "overview" | "documents" | "handbook" | "hr-generator" | "calculator" | "booking" | "partners";

interface NavItem {
  id: Panel;
  label: string;
  icon: React.ElementType;
  group?: string;
}

const navItems: NavItem[] = [
  { id: "overview", label: "Oversikt", icon: LayoutDashboard },
  { id: "documents", label: "Dokumenter", icon: FileText },
  { id: "hr-generator", label: "HR-generator", icon: Wand2, group: "HR og personal" },
  { id: "handbook", label: "Personalhåndbok", icon: BookOpen, group: "HR og personal" },
  { id: "calculator", label: "Ansettelseskalkulator", icon: Calculator, group: "HR og personal" },
  { id: "booking", label: "Book rådgiver", icon: CalendarDays },
  { id: "partners", label: "Fordelsavtaler", icon: Handshake },
];

const KundeDashboard = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [activePanel, setActivePanel] = useState<Panel>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-medium">
            {profile?.name?.charAt(0).toUpperCase()}
          </div>
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
      case "handbook": return <HandbookPanel />;
      case "hr-generator": return <HrGenerator onComplete={() => setActivePanel("handbook")} />;
      case "calculator": return <AnsettelsesKalkulator />;
      case "booking": return <BookingPanel />;
      case "partners": return <PartnersPanel />;
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

// ========== DOCUMENTS PANEL ==========
const DocumentsPanel = () => {
  const [docs, setDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("Alle");

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("customer_documents")
        .select("*")
        .order("created_at", { ascending: false });
      setDocs(data || []);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <div className="text-muted-foreground text-sm">Laster…</div>;

  const categories = ["Alle", ...Array.from(new Set(docs.map(d => d.category || "Generelt")))];
  const filtered = activeCategory === "Alle" ? docs : docs.filter(d => (d.category || "Generelt") === activeCategory);

  return (
    <div className="space-y-4">
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
      <p className="text-sm text-muted-foreground">{filtered.length} dokumenter</p>
      {filtered.length === 0 && (
        <div className="glass rounded-2xl p-8 border border-border/20 text-center">
          <FileText size={32} className="text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Ingen dokumenter i denne kategorien.</p>
        </div>
      )}
      {filtered.map(doc => (
        <div key={doc.id} className="glass rounded-2xl px-5 py-4 border border-border/20 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">{doc.title}</p>
              {doc.category && doc.category !== "Generelt" && (
                <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-medium">{doc.category}</span>
              )}
            </div>
            {doc.description && <p className="text-xs text-muted-foreground mt-0.5">{doc.description}</p>}
            <p className="text-[10px] text-muted-foreground mt-1">{new Date(doc.created_at).toLocaleDateString("no-NO")}</p>
          </div>
          {doc.file_url && (
            <button
              onClick={async () => {
                const { data } = await supabase.storage.from("internal-docs").createSignedUrl(doc.file_url, 3600);
                if (data?.signedUrl) window.open(data.signedUrl, "_blank");
              }}
              className="text-muted-foreground hover:text-primary"
            >
              <Download size={16} />
            </button>
          )}
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

  // Strip HTML for plain-text search
  const stripHtml = (html: string) => (html || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ");

  // Find chapters matching search
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

  // Highlight editable placeholders like [Bedriftsnavn], [Daglig leder] etc.
  const renderContentWithEditableFields = (html: string) => {
    if (!html) return "<p class='text-muted-foreground italic'>Ingen innhold ennå.</p>";
    return html.replace(
      /\[([^\]]+)\]/g,
      '<span class="editable-field" data-field="$1" role="button" tabindex="0" title="Klikk for å fylle inn">[$1]</span>'
    );
  };

  // Handle inline field click — replace [placeholder] with user value directly in content
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

  // Highlight search matches in rendered content
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
      {/* Header with search */}
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

      {/* Search results */}
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
        {/* Table of contents sidebar */}
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

        {/* Article content area — blog-style */}
        <div className="flex-1 min-w-0">
          {/* Mobile chapter selector */}
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
            {/* Chapter header — newspaper/blog style */}
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

            {/* Chapter body */}
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

            {/* Prev / Next navigation — blog style */}
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
      const { data: comp } = await supabase
        .from("customer_companies")
        .select("*")
        .limit(1)
        .maybeSingle();
      setCompany(comp);

      // Check for existing advisor request
      if (comp) {
        const { data: reqData } = await supabase
          .from("advisor_requests")
          .select("*")
          .eq("company_id", comp.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
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

      if (profile) {
        setForm(f => ({ ...f, name: profile.name || "", email: profile.email || "" }));
      }
      if (comp) {
        setForm(f => ({ ...f, company_name: comp.company_name || "" }));
      }

      setLoading(false);
    };
    load();
  }, [profile]);

  const sendAdvisorRequest = async () => {
    if (!company) return;
    setSendingRequest(true);
    const { error } = await supabase.from("advisor_requests").insert({
      company_id: company.id,
      message: requestMessage || null,
    });
    if (error) {
      toast.error("Kunne ikke sende forespørsel");
    } else {
      setAdvisorRequest({ status: "pending", message: requestMessage });
      toast.success("Forespørsel sendt til Avargo!");
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

    await supabase.from("bookings").insert({
      advisor_id: selectedSlot.advisorId,
      booking_date: dateStr,
      booking_time: selectedSlot.time + ":00",
      customer_name: form.name,
      customer_email: form.email,
      customer_phone: form.phone,
      company_name: form.company_name,
      message: form.message || null,
      teams_link: advisor?.teams_link || null,
    });

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
      {/* Advisor info / request section */}
      {hasAdvisors ? (
        <div className="glass rounded-2xl p-5 border border-border/20">
          <p className="text-sm text-muted-foreground mb-1">Dine rådgivere</p>
          <div className="flex gap-3">
            {advisors.map(a => (
              <div key={a.id} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-medium">
                  {a.name?.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium">{a.name}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {company.primary_advisor_id === a.id ? "Oppdragsansvarlig" : "Reserve"}
                  </p>
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
            <div className="px-4 py-2 rounded-xl bg-amber-500/10 text-amber-600 text-xs">
              ⏳ Forespørsel sendt – venter på svar fra Avargo
            </div>
          ) : advisorRequest?.status === "approved" ? (
            <div className="px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-600 text-xs">
              ✓ Forespørsel godkjent – rådgiver blir tildelt
            </div>
          ) : (
            <div className="space-y-2">
              <input
                value={requestMessage}
                onChange={e => setRequestMessage(e.target.value)}
                placeholder="Melding til Avargo (valgfritt)"
                className="w-full h-9 rounded-xl border border-border/30 bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              <button onClick={sendAdvisorRequest} disabled={sendingRequest}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm hover:opacity-90 disabled:opacity-50">
                {sendingRequest ? "Sender…" : "Be om rådgiver"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Calendar & booking - always shown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-5 border border-border/20">
          <h3 className="font-heading text-base mb-3">Velg dato</h3>
          {hasAdvisors ? (
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={d => { setSelectedDate(d); setSelectedSlot(null); }}
              disabled={isDayDisabled}
              className="p-3 pointer-events-auto"
            />
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
                    <button
                      key={i}
                      onClick={() => setSelectedSlot({ time: s.time, advisorId: s.advisorId })}
                      className={`px-3 py-2 rounded-xl text-sm border transition-colors ${
                        selectedSlot?.time === s.time && selectedSlot?.advisorId === s.advisorId
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border/30 hover:border-primary/40"
                      }`}
                    >
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
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Navn *" required
                  className="w-full h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="E-post *" type="email" required
                  className="w-full h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Telefon *" required
                  className="w-full h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                <input value={form.company_name} onChange={e => setForm({ ...form, company_name: e.target.value })} placeholder="Bedrift *" required
                  className="w-full h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
              </div>
              <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Beskjed (valgfritt)" rows={2}
                className="w-full rounded-xl border border-border/30 bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none" />
              <button type="submit" disabled={submitting}
                className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 disabled:opacity-50">
                {submitting ? "Sender…" : "Bekreft booking"}
              </button>
            </form>
          )}

          {!hasAdvisors && !selectedDate && (
            <div className="glass rounded-2xl p-5 border border-border/20 text-center">
              <p className="text-sm text-muted-foreground">Booking av tid krever at du har en tildelt rådgiver. Send en forespørsel ovenfor.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ========== PARTNERS PANEL ==========
const PartnersPanel = () => {
  const [partners, setPartners] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [company, setCompany] = useState<any>(null);
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
        const { data: reqs } = await supabase
          .from("partnership_requests")
          .select("*")
          .eq("company_id", compRes.data.id);
        setRequests(reqs || []);
      }
      setLoading(false);
    };
    load();
  }, []);

  const sendRequest = async (agreementId: string) => {
    if (!company) return;
    const { error } = await supabase.from("partnership_requests").insert({
      agreement_id: agreementId,
      company_id: company.id,
      message: message || null,
    });
    if (error) {
      if (error.code === "23505") {
        toast.info("Du har allerede sendt en forespørsel for denne avtalen");
      } else {
        toast.error("Kunne ikke sende forespørsel");
      }
      setRequestingId(null);
      return;
    }
    setRequests([...requests, { agreement_id: agreementId, company_id: company.id, status: "pending" }]);
    setRequestingId(null);
    setMessage("");
    toast.success("Forespørsel sendt til Avargo!");
  };

  const getRequestStatus = (agreementId: string) => {
    return requests.find(r => r.agreement_id === agreementId);
  };

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
                {p.website && (
                  <a href={p.website} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline mt-1 inline-block">Besøk nettside →</a>
                )}

                {/* Request status / button */}
                <div className="mt-3">
                  {req ? (
                    <span className={`text-xs px-3 py-1 rounded-full ${
                      req.status === "pending" ? "bg-amber-500/10 text-amber-600" :
                      req.status === "approved" ? "bg-emerald-500/10 text-emerald-600" :
                      "bg-destructive/10 text-destructive"
                    }`}>
                      {req.status === "pending" ? "⏳ Forespørsel sendt" :
                       req.status === "approved" ? "✓ Godkjent" : "✕ Avslått"}
                    </span>
                  ) : requestingId === p.id ? (
                    <div className="space-y-2">
                      <input
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        placeholder="Melding til Avargo (valgfritt)"
                        className="w-full h-9 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                      />
                      <div className="flex gap-2">
                        <button onClick={() => sendRequest(p.id)}
                          className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs hover:opacity-90">
                          Send forespørsel
                        </button>
                        <button onClick={() => { setRequestingId(null); setMessage(""); }}
                          className="px-3 py-1.5 rounded-lg text-xs border border-border/30 hover:bg-muted/50">
                          Avbryt
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => setRequestingId(p.id)}
                      className="px-3 py-1.5 border border-primary/30 text-primary rounded-lg text-xs hover:bg-primary/5 transition-colors">
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

export default KundeDashboard;
