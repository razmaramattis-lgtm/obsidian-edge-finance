import { useState, useEffect, useCallback } from "react";
import { motion, Reorder } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  FileText, Briefcase, DollarSign, Archive, Shield,
  FolderOpen, Handshake, MessageSquare, Eye, EyeOff,
  Clock, TrendingUp, PenLine, ArrowRight, Building2,
  Inbox, Users, UserPlus, CalendarDays, Mail, AlertCircle,
  Settings2, GripVertical, EyeIcon, EyeOffIcon, RotateCcw
} from "lucide-react";
import TaxDeadlineWidget from "@/components/TaxDeadlineWidget";
import type { AdminNotifications } from "@/hooks/useAdminNotifications";

interface Stats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalServices: number;
  totalIndustries: number;
  totalArchiveFiles: number;
  recentPosts: { id: string; title: string; published: boolean; created_at: string }[];
}

type Panel = "overview" | "employees" | "chat" | "blog" | "services" | "industries" | "pricing"
  | "archive" | "resources" | "hms" | "internal" | "collab" | "settings" | "hr" | "knowledge" | "courses" | "bookings" | "datacenter" | "mybooking" | "customers" | "partner_requests" | "advisor_requests" | "employee_invitations" | "doc_templates" | "benefit_applications" | "pending_tasks";

type WidgetId = "notifications" | "stats" | "quickdraft" | "recentposts" | "taxdeadlines" | "quicknav";

interface WidgetConfig {
  id: WidgetId;
  label: string;
  visible: boolean;
  adminOnly?: boolean;
}

const DEFAULT_WIDGETS: WidgetConfig[] = [
  { id: "notifications", label: "Ventende oppgaver", visible: true, adminOnly: true },
  { id: "stats", label: "Statistikk", visible: true, adminOnly: true },
  { id: "quickdraft", label: "Hurtiginnlegg", visible: true, adminOnly: true },
  { id: "recentposts", label: "Siste innlegg", visible: true },
  { id: "taxdeadlines", label: "Skattefrister", visible: true },
  { id: "quicknav", label: "Hurtignavigasjon", visible: true },
];

const STORAGE_KEY = "admin-dashboard-widgets";

function loadWidgets(): WidgetConfig[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved: WidgetConfig[] = JSON.parse(raw);
      // merge with defaults in case new widgets added
      const ids = new Set(saved.map(w => w.id));
      const merged = [...saved];
      for (const d of DEFAULT_WIDGETS) {
        if (!ids.has(d.id)) merged.push(d);
      }
      return merged.map(w => ({ ...w, label: DEFAULT_WIDGETS.find(d => d.id === w.id)?.label ?? w.label, adminOnly: DEFAULT_WIDGETS.find(d => d.id === w.id)?.adminOnly }));
    }
  } catch { /* ignore */ }
  return DEFAULT_WIDGETS;
}

function saveWidgets(widgets: WidgetConfig[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(widgets));
}

const OverviewPanel = ({ isAdmin, onNavigate, notifications }: { isAdmin: boolean; onNavigate: (p: Panel) => void; notifications: AdminNotifications }) => {
  const { profile } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [quickTitle, setQuickTitle] = useState("");
  const [quickExcerpt, setQuickExcerpt] = useState("");
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [widgets, setWidgets] = useState<WidgetConfig[]>(loadWidgets);

  const visibleWidgets = widgets.filter(w => w.visible && (!w.adminOnly || isAdmin));
  const allWidgets = widgets.filter(w => !w.adminOnly || isAdmin);

  useEffect(() => {
    const fetchStats = async () => {
      const [posts, services, industries, archiveFiles] = await Promise.all([
        supabase.from("blog_posts").select("id,title,published,created_at").order("created_at", { ascending: false }).limit(5),
        supabase.from("services").select("id", { count: "exact", head: true }),
        supabase.from("industries").select("id", { count: "exact", head: true }),
        supabase.from("archive_files").select("id", { count: "exact", head: true }),
      ]);
      const allPosts = (posts.data || []) as { id: string; title: string; published: boolean; created_at: string }[];
      setStats({
        totalPosts: allPosts.length,
        publishedPosts: allPosts.filter(p => p.published).length,
        draftPosts: allPosts.filter(p => !p.published).length,
        totalServices: services.count || 0,
        totalIndustries: industries.count || 0,
        totalArchiveFiles: archiveFiles.count || 0,
        recentPosts: allPosts.slice(0, 5),
      });
    };
    fetchStats();
  }, []);

  const updateWidgets = useCallback((next: WidgetConfig[]) => {
    setWidgets(next);
    saveWidgets(next);
  }, []);

  const toggleWidget = (id: WidgetId) => {
    updateWidgets(widgets.map(w => w.id === id ? { ...w, visible: !w.visible } : w));
  };

  const resetWidgets = () => {
    updateWidgets(DEFAULT_WIDGETS);
  };

  const saveQuickDraft = async () => {
    if (!quickTitle.trim()) return;
    setSaving(true);
    const slug = quickTitle.toLowerCase().replace(/[^a-z0-9æøåÆØÅ\s-]/gi, "").replace(/\s+/g, "-");
    await supabase.from("blog_posts").insert([{
      title: quickTitle, slug, excerpt: quickExcerpt, published: false, category: "Nyheter"
    }]);
    setQuickTitle("");
    setQuickExcerpt("");
    setSaving(false);
    const { data } = await supabase.from("blog_posts").select("id,title,published,created_at").order("created_at", { ascending: false }).limit(5);
    if (data && stats) {
      setStats({ ...stats, recentPosts: data as any, totalPosts: stats.totalPosts + 1, draftPosts: stats.draftPosts + 1 });
    }
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString("nb-NO", { day: "numeric", month: "short" });

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 6) return "God natt";
    if (h < 12) return "God morgen";
    if (h < 18) return "God ettermiddag";
    return "God kveld";
  };

  const statCards = isAdmin ? [
    { icon: FileText, label: "Innlegg", value: stats?.totalPosts ?? "–", sub: `${stats?.publishedPosts ?? 0} publisert · ${stats?.draftPosts ?? 0} utkast`, color: "text-primary", panel: "blog" as Panel },
    { icon: Briefcase, label: "Tjenester", value: stats?.totalServices ?? "–", sub: "aktive tjenester", color: "text-secondary", panel: "services" as Panel },
    { icon: Building2, label: "Bransjer", value: stats?.totalIndustries ?? "–", sub: "bransjekategorier", color: "text-accent", panel: "industries" as Panel },
    { icon: Archive, label: "Arkivfiler", value: stats?.totalArchiveFiles ?? "–", sub: "nedlastbare filer", color: "text-primary", panel: "archive" as Panel },
  ] : [];

  const quickLinks = [
    { id: "blog" as Panel, icon: FileText, label: "Blogg & Nyheter", desc: "Skriv og publiser artikler", admin: true },
    { id: "services" as Panel, icon: Briefcase, label: "Tjenester", desc: "Administrer tjenester", admin: true },
    { id: "pricing" as Panel, icon: DollarSign, label: "Priser", desc: "Oppdater prisplaner", admin: true },
    { id: "archive" as Panel, icon: Archive, label: "Arkiv", desc: "Last opp filer", admin: true },
    { id: "hms" as Panel, icon: Shield, label: "HMS-bok", desc: "HMS-dokumentasjon", admin: false },
    { id: "internal" as Panel, icon: FolderOpen, label: "Interne ressurser", desc: "Delte ressurser", admin: false },
    { id: "collab" as Panel, icon: Handshake, label: "Samarbeidsavtaler", desc: "Avtaledokumenter", admin: false },
    { id: "chat" as Panel, icon: MessageSquare, label: "Chat", desc: "Intern kommunikasjon", admin: false },
  ].filter(c => !c.admin || isAdmin);

  // Render individual widgets
  const renderWidget = (id: WidgetId) => {
    switch (id) {
      case "notifications":
        if (!isAdmin || notifications.total === 0) return null;
        return (
          <motion.div
            key={id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-5 border border-destructive/20 bg-destructive/[0.03]"
          >
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle size={15} className="text-destructive" strokeWidth={1.5} />
              <h3 className="font-medium text-sm">Venter på behandling</h3>
              <span className="ml-auto min-w-[22px] h-[22px] flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold px-1.5">
                {notifications.total}
              </span>
              <button onClick={() => onNavigate("pending_tasks")} className="text-[10px] text-primary hover:underline ml-2">
                Åpne alle →
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {[
                { count: notifications.partnerRequests, label: "Avtaleforespørsler", icon: Inbox, panel: "partner_requests" as Panel },
                { count: notifications.advisorRequests, label: "Rådgiverforespørsler", icon: Users, panel: "advisor_requests" as Panel },
                { count: notifications.employeeInvitations, label: "Ansattinvitasjoner", icon: UserPlus, panel: "employee_invitations" as Panel },
                { count: notifications.benefitApplications, label: "Fordelsavtale-søknader", icon: Handshake, panel: "benefit_applications" as Panel },
                { count: notifications.pendingBookings, label: "Ventende bookinger", icon: CalendarDays, panel: "bookings" as Panel },
                { count: notifications.contactSubmissions, label: "Nye henvendelser", icon: Mail, panel: "overview" as Panel },
              ]
                .filter(item => item.count > 0)
                .map(item => (
                  <button
                    key={item.label}
                    onClick={() => onNavigate("pending_tasks")}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-background/60 border border-border/20 hover:border-primary/30 transition-all text-left group"
                  >
                    <item.icon size={14} className="text-muted-foreground group-hover:text-primary shrink-0" strokeWidth={1.5} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{item.label}</p>
                    </div>
                    <span className="min-w-[20px] h-[20px] flex items-center justify-center rounded-full bg-destructive/10 text-destructive text-[10px] font-bold px-1">
                      {item.count}
                    </span>
                    <ArrowRight size={11} className="text-muted-foreground/40 group-hover:text-primary shrink-0" />
                  </button>
                ))}
            </div>
          </motion.div>
        );

      case "stats":
        if (statCards.length === 0) return null;
        return (
          <div key={id} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {statCards.map((stat, i) => (
              <motion.button
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => onNavigate(stat.panel)}
                className="glass rounded-2xl p-4 border border-border/20 hover:border-primary/30 transition-all text-left group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <stat.icon size={16} className={stat.color} strokeWidth={1.5} />
                  <ArrowRight size={12} className="text-muted-foreground/20 group-hover:text-primary transition-colors" />
                </div>
                <p className="font-heading text-2xl mb-0.5">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground font-light">{stat.sub}</p>
              </motion.button>
            ))}
          </div>
        );

      case "quickdraft":
        if (!isAdmin) return null;
        return (
          <motion.div
            key={id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-5 border border-border/20"
          >
            <div className="flex items-center gap-2 mb-4">
              <PenLine size={15} className="text-primary" strokeWidth={1.5} />
              <h3 className="font-medium text-sm">Hurtiginnlegg</h3>
            </div>
            <div className="space-y-3">
              <input
                value={quickTitle}
                onChange={e => setQuickTitle(e.target.value)}
                placeholder="Tittel på innlegg…"
                className="w-full h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              <textarea
                value={quickExcerpt}
                onChange={e => setQuickExcerpt(e.target.value)}
                placeholder="Kort sammendrag (valgfritt)…"
                rows={3}
                className="w-full rounded-xl border border-border/30 bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
              />
              <button
                onClick={saveQuickDraft}
                disabled={!quickTitle.trim() || saving}
                className="w-full h-9 rounded-xl bg-primary text-primary-foreground text-sm hover:opacity-90 disabled:opacity-50 transition-all"
              >
                {saving ? "Lagrer…" : "Lagre som utkast"}
              </button>
            </div>
          </motion.div>
        );

      case "recentposts":
        return (
          <motion.div
            key={id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-5 border border-border/20"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock size={15} className="text-primary" strokeWidth={1.5} />
                <h3 className="font-medium text-sm">Siste innlegg</h3>
              </div>
              {isAdmin && (
                <button onClick={() => onNavigate("blog")} className="text-xs text-primary hover:underline flex items-center gap-1">
                  Se alle <ArrowRight size={11} />
                </button>
              )}
            </div>
            <div className="space-y-2">
              {stats?.recentPosts.map(post => (
                <button
                  key={post.id}
                  onClick={() => onNavigate("blog")}
                  className="w-full flex items-center justify-between py-2 border-b border-border/10 last:border-0 hover:bg-muted/20 rounded-lg px-2 -mx-2 transition-colors text-left group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {post.published ? <Eye size={12} className="text-primary shrink-0" /> : <EyeOff size={12} className="text-muted-foreground shrink-0" />}
                    <p className="text-sm truncate group-hover:text-primary transition-colors">{post.title}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <span className="text-[10px] text-muted-foreground">{formatDate(post.created_at)}</span>
                    <ArrowRight size={10} className="text-muted-foreground/20 group-hover:text-primary transition-colors" />
                  </div>
                </button>
              ))}
              {(!stats || stats.recentPosts.length === 0) && (
                <p className="text-xs text-muted-foreground text-center py-4">Ingen innlegg ennå</p>
              )}
            </div>
          </motion.div>
        );

      case "taxdeadlines":
        return (
          <motion.div key={id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <TaxDeadlineWidget limit={5} compact />
          </motion.div>
        );

      case "quicknav":
        return (
          <div key={id}>
            <p className="text-[9px] tracking-[0.35em] uppercase text-muted-foreground/40 mb-3">Hurtignavigasjon</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {quickLinks.map((card, i) => (
                <motion.button
                  key={card.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => onNavigate(card.id)}
                  className="glass rounded-2xl p-4 text-left card-lift group border border-border/20 hover:border-primary/30 transition-all"
                >
                  <card.icon size={16} className="text-primary mb-2" strokeWidth={1.5} />
                  <p className="font-medium text-xs mb-0.5">{card.label}</p>
                  <p className="text-[10px] text-muted-foreground font-light">{card.desc}</p>
                </motion.button>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Determine layout: quickdraft + recentposts side by side if both visible
  const bothDraftAndRecent = visibleWidgets.some(w => w.id === "quickdraft") && visibleWidgets.some(w => w.id === "recentposts");

  return (
    <div className="space-y-6">
      {/* Header row */}
      <div className="flex items-start justify-between gap-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h2 className="font-heading text-2xl md:text-3xl mb-1">
            {getGreeting()}, <span className="text-primary">{profile?.name}</span> 👋
          </h2>
          <p className="text-sm text-muted-foreground font-light">
            Her er en oversikt over hva som skjer.
          </p>
        </motion.div>

        <button
          onClick={() => setEditMode(!editMode)}
          className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs transition-all border ${
            editMode
              ? "bg-primary text-primary-foreground border-primary"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50 border-border/20"
          }`}
        >
          <Settings2 size={13} strokeWidth={1.5} />
          {editMode ? "Ferdig" : "Tilpass"}
        </button>
      </div>

      {/* Edit mode panel */}
      {editMode && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="glass rounded-2xl p-5 border border-primary/20 bg-primary/[0.02]"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-sm">Tilpass dashbordet</h3>
            <button
              onClick={resetWidgets}
              className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
            >
              <RotateCcw size={11} />
              Tilbakestill
            </button>
          </div>
          <p className="text-xs text-muted-foreground mb-4">Velg hvilke moduler som skal vises. Dra for å endre rekkefølge.</p>

          <Reorder.Group
            axis="y"
            values={allWidgets}
            onReorder={(newOrder) => {
              // rebuild full list preserving items not in allWidgets (adminOnly hidden for non-admin)
              const hiddenIds = widgets.filter(w => w.adminOnly && !isAdmin).map(w => w.id);
              const hidden = widgets.filter(w => hiddenIds.includes(w.id));
              updateWidgets([...newOrder, ...hidden]);
            }}
            className="space-y-1.5"
          >
            {allWidgets.map(w => (
              <Reorder.Item key={w.id} value={w} className="cursor-grab active:cursor-grabbing">
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-background/60 border border-border/20 hover:border-primary/20 transition-all">
                  <GripVertical size={13} className="text-muted-foreground/40 shrink-0" />
                  <span className="text-sm flex-1">{w.label}</span>
                  <button
                    onClick={() => toggleWidget(w.id)}
                    className={`shrink-0 p-1 rounded-lg transition-colors ${w.visible ? "text-primary" : "text-muted-foreground/40"}`}
                  >
                    {w.visible ? <EyeIcon size={14} /> : <EyeOffIcon size={14} />}
                  </button>
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </motion.div>
      )}

      {/* Render visible widgets in order */}
      {visibleWidgets.map(w => {
        // Handle the combined quickdraft + recentposts layout
        if (w.id === "quickdraft" && bothDraftAndRecent) {
          // Find if recentposts comes after quickdraft or before
          const qIdx = visibleWidgets.findIndex(v => v.id === "quickdraft");
          const rIdx = visibleWidgets.findIndex(v => v.id === "recentposts");
          if (qIdx < rIdx) {
            return (
              <div key="draft-recent-combo" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>{renderWidget("quickdraft")}</div>
                <div className="lg:col-span-2">{renderWidget("recentposts")}</div>
              </div>
            );
          }
          return renderWidget(w.id);
        }
        if (w.id === "recentposts" && bothDraftAndRecent) {
          const qIdx = visibleWidgets.findIndex(v => v.id === "quickdraft");
          const rIdx = visibleWidgets.findIndex(v => v.id === "recentposts");
          if (rIdx < qIdx) {
            return (
              <div key="recent-draft-combo" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">{renderWidget("recentposts")}</div>
                <div>{renderWidget("quickdraft")}</div>
              </div>
            );
          }
          // Already rendered in combo above
          return null;
        }

        return renderWidget(w.id);
      })}
    </div>
  );
};

export default OverviewPanel;
