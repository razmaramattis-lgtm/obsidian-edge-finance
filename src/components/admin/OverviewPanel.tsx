import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  FileText, Briefcase, DollarSign, Archive, Shield,
  FolderOpen, Handshake, MessageSquare, Eye, EyeOff,
  Clock, TrendingUp, PenLine, ArrowRight, Building2,
  Inbox, Users, UserPlus, CalendarDays, Mail, AlertCircle
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
  | "archive" | "resources" | "hms" | "internal" | "collab" | "settings" | "hr" | "knowledge" | "courses" | "bookings" | "datacenter" | "mybooking" | "customers" | "partner_requests" | "advisor_requests" | "employee_invitations" | "doc_templates" | "benefit_applications";

const OverviewPanel = ({ isAdmin, onNavigate, notifications }: { isAdmin: boolean; onNavigate: (p: Panel) => void; notifications: AdminNotifications }) => {
  const { profile } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [quickTitle, setQuickTitle] = useState("");
  const [quickExcerpt, setQuickExcerpt] = useState("");
  const [saving, setSaving] = useState(false);

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
    // Refresh stats
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
    { icon: FileText, label: "Innlegg", value: stats?.totalPosts ?? "–", sub: `${stats?.publishedPosts ?? 0} publisert · ${stats?.draftPosts ?? 0} utkast`, color: "text-primary" },
    { icon: Briefcase, label: "Tjenester", value: stats?.totalServices ?? "–", sub: "aktive tjenester", color: "text-secondary" },
    { icon: Building2, label: "Bransjer", value: stats?.totalIndustries ?? "–", sub: "bransjekategorier", color: "text-accent" },
    { icon: Archive, label: "Arkivfiler", value: stats?.totalArchiveFiles ?? "–", sub: "nedlastbare filer", color: "text-primary" },
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

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="font-heading text-2xl md:text-3xl mb-1">
          {getGreeting()}, <span className="text-primary">{profile?.name}</span> 👋
        </h2>
        <p className="text-sm text-muted-foreground font-light">
          Her er en oversikt over hva som skjer.
        </p>
      </motion.div>

      {/* Notification Queue */}
      {isAdmin && notifications.total > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass rounded-2xl p-5 border border-destructive/20 bg-destructive/[0.03]"
        >
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle size={15} className="text-destructive" strokeWidth={1.5} />
            <h3 className="font-medium text-sm">Venter på behandling</h3>
            <span className="ml-auto min-w-[22px] h-[22px] flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold px-1.5">
              {notifications.total}
            </span>
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
                  onClick={() => onNavigate(item.panel)}
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
      )}
      {/* Stats Cards */}
      {statCards.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {statCards.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="glass rounded-2xl p-4 border border-border/20"
            >
              <div className="flex items-center justify-between mb-3">
                <stat.icon size={16} className={stat.color} strokeWidth={1.5} />
                <TrendingUp size={12} className="text-muted-foreground/40" />
              </div>
              <p className="font-heading text-2xl mb-0.5">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground font-light">{stat.sub}</p>
            </motion.div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Draft */}
        {isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
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
        )}

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className={`glass rounded-2xl p-5 border border-border/20 ${isAdmin ? "lg:col-span-2" : "lg:col-span-3"}`}
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
              <div key={post.id} className="flex items-center justify-between py-2 border-b border-border/10 last:border-0">
                <div className="flex items-center gap-2 min-w-0">
                  {post.published ? <Eye size={12} className="text-primary shrink-0" /> : <EyeOff size={12} className="text-muted-foreground shrink-0" />}
                  <p className="text-sm truncate">{post.title}</p>
                </div>
                <span className="text-[10px] text-muted-foreground shrink-0 ml-3">{formatDate(post.created_at)}</span>
              </div>
            ))}
            {(!stats || stats.recentPosts.length === 0) && (
              <p className="text-xs text-muted-foreground text-center py-4">Ingen innlegg ennå</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Tax Deadlines */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <TaxDeadlineWidget limit={5} compact />
      </motion.div>

      {/* Quick Navigation */}
      <div>
        <p className="text-[9px] tracking-[0.35em] uppercase text-muted-foreground/40 mb-3">Hurtignavigasjon</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {quickLinks.map((card, i) => (
            <motion.button
              key={card.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.04 }}
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
    </div>
  );
};

export default OverviewPanel;
