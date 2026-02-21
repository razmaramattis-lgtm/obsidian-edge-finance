import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import {
  LayoutDashboard, FileText, BookOpen, CalendarDays,
  Handshake, LogOut, Menu, ChevronRight, TrendingUp,
  TrendingDown, DollarSign, ArrowUpRight, ArrowDownRight,
  Download, Building2
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, BarChart, Bar
} from "recharts";

type Panel = "overview" | "documents" | "handbook" | "booking" | "partners";

const navItems: { id: Panel; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Oversikt", icon: LayoutDashboard },
  { id: "documents", label: "Dokumenter", icon: FileText },
  { id: "handbook", label: "Personalhåndbok", icon: BookOpen },
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
        {navItems.map(item => (
          <button
            key={item.id}
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
        ))}
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

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{docs.length} dokumenter</p>
      {docs.length === 0 && (
        <div className="glass rounded-2xl p-8 border border-border/20 text-center">
          <FileText size={32} className="text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Ingen dokumenter ennå.</p>
        </div>
      )}
      {docs.map(doc => (
        <div key={doc.id} className="glass rounded-2xl px-5 py-4 border border-border/20 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">{doc.title}</p>
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

// ========== HANDBOOK PANEL (placeholder) ==========
const HandbookPanel = () => (
  <div className="glass rounded-2xl p-8 border border-border/20 text-center">
    <BookOpen size={32} className="text-muted-foreground/30 mx-auto mb-3" />
    <h3 className="font-heading text-base mb-1">Personalhåndbok</h3>
    <p className="text-sm text-muted-foreground">Din personalhåndbok vil bli tilgjengelig her snart.</p>
  </div>
);

// ========== BOOKING PANEL (placeholder) ==========
const BookingPanel = () => (
  <div className="glass rounded-2xl p-8 border border-border/20 text-center">
    <CalendarDays size={32} className="text-muted-foreground/30 mx-auto mb-3" />
    <h3 className="font-heading text-base mb-1">Book rådgiver</h3>
    <p className="text-sm text-muted-foreground">Booking-funksjonalitet kommer snart.</p>
  </div>
);

// ========== PARTNERS PANEL ==========
const PartnersPanel = () => {
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("collaboration_agreements")
        .select("*")
        .neq("target_audience", "admin_only")
        .order("created_at", { ascending: false });
      setPartners(data || []);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <div className="text-muted-foreground text-sm">Laster…</div>;

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{partners.length} fordelsavtaler</p>
      {partners.map(p => (
        <div key={p.id} className="glass rounded-2xl px-5 py-4 border border-border/20">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg border border-border/10 bg-muted/20 flex items-center justify-center shrink-0">
              <Building2 size={16} className="text-muted-foreground/40" />
            </div>
            <div>
              <p className="text-sm font-semibold">{p.title}</p>
              {p.company && <p className="text-xs text-muted-foreground">{p.company}</p>}
              {p.offering && <p className="text-xs mt-1">{p.offering}</p>}
              {p.price && <p className="text-xs text-primary font-medium mt-1">{p.price}</p>}
              {p.website && (
                <a href={p.website} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline mt-1 inline-block">Besøk nettside →</a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KundeDashboard;
