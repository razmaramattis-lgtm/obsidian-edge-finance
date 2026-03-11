import { useState, useEffect, useRef } from "react";
import { motion, Reorder } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useAdminNotifications } from "@/hooks/useAdminNotifications";
import { useBrowserNotifications } from "@/hooks/useBrowserNotifications";
import { usePushSubscription } from "@/hooks/usePushSubscription";
import { supabase } from "@/integrations/supabase/client";
import {
  LayoutDashboard, FileText, Briefcase, Building2, DollarSign,
  BookOpen, Archive, Shield, FolderOpen, Handshake,
  Users, MessageSquare, Settings, LogOut, ChevronRight, ChevronDown, Menu, X, Sparkles, GraduationCap, CalendarDays, Inbox, UserPlus, FileCheck, Bell, GripVertical, RotateCcw, ArrowRight, Check, Trash2, AlertTriangle, ExternalLink, Mail, Smartphone, Megaphone
} from "lucide-react";

// Sub-panels
// EmployeesPanel is now inside SettingsPanel
import ChatPanel from "@/components/admin/ChatPanel";
import BlogPanel from "@/components/admin/BlogPanel";
import ServicesPanel from "@/components/admin/ServicesPanel";
import IndustriesPanel from "@/components/admin/IndustriesPanel";
import PricingPanel from "@/components/admin/PricingPanel";
import ArchivePanel from "@/components/admin/ArchivePanel";
import ResourcesPanel from "@/components/admin/ResourcesPanel";
import HmsPanel from "@/components/admin/HmsPanel";
import InternalResourcesPanel from "@/components/admin/InternalResourcesPanel";
import CollabPanel from "@/components/admin/CollabPanel";
import SettingsPanel from "@/components/admin/SettingsPanel";
import HrPanel from "@/components/admin/HrPanel";
import OverviewPanel from "@/components/admin/OverviewPanel";
import KnowledgeBasePanel from "@/components/admin/KnowledgeBasePanel";
import CoursesPanel from "@/components/admin/CoursesPanel";
import PageChangesPanel from "@/components/admin/PageChangesPanel";
import OrgResourcesPanel from "@/components/admin/OrgResourcesPanel";
import BookingsPanel from "@/components/admin/BookingsPanel";
import DataCenterPanel from "@/components/admin/DataCenterPanel";
// MyBookingSettingsPanel is now inside SettingsPanel
import CustomersPanel from "@/components/admin/CustomersPanel";
import PartnerRequestsPanel from "@/components/admin/PartnerRequestsPanel";
import AdvisorRequestsPanel from "@/components/admin/AdvisorRequestsPanel";
import EmployeeInvitationsPanel from "@/components/admin/EmployeeInvitationsPanel";
import DocumentTemplatesPanel from "@/components/admin/DocumentTemplatesPanel";
import BenefitApplicationsPanel from "@/components/admin/BenefitApplicationsPanel";
import AccountEntriesPanel from "@/components/admin/AccountEntriesPanel";
import GlossaryPanel from "@/components/admin/GlossaryPanel";
import AccountFeedbackPanel from "@/components/admin/AccountFeedbackPanel";
import PendingTasksPanel from "@/components/admin/PendingTasksPanel";
import ContactSubmissionsPanel from "@/components/admin/ContactSubmissionsPanel";
import JobListingsPanel from "@/components/admin/JobListingsPanel";
import SmsCenterPanel from "@/components/admin/SmsCenterPanel";
import AuditLogPanel from "@/components/admin/AuditLogPanel";
import MarketingPanel from "@/components/admin/MarketingPanel";

type Panel = "overview" | "chat" | "blog" | "services" | "industries" | "pricing"
  | "archive" | "resources" | "hms" | "internal" | "collab" | "settings" | "hr" | "knowledge" | "courses" | "bookings" | "datacenter" | "customers" | "partner_requests" | "advisor_requests" | "employee_invitations" | "doc_templates" | "benefit_applications" | "account_entries" | "glossary" | "account_feedback" | "pending_tasks" | "contact_submissions" | "page_changes" | "org_resources" | "job_listings" | "sms_center" | "audit_log" | "marketing";

interface NavItem {
  id: Panel;
  label: string;
  icon: React.ElementType;
  adminOnly?: boolean;
  group: string;
  employeeHidden?: boolean; // hidden from employees unless granted
}

const DEFAULT_NAV_ITEMS: NavItem[] = [
  // Hoved
  { id: "overview", label: "Oversikt", icon: LayoutDashboard, group: "Hoved" },
  { id: "chat", label: "Workspace", icon: MessageSquare, group: "Hoved" },
  { id: "knowledge", label: "Oppslagsverk", icon: Sparkles, group: "Hoved" },
  { id: "customers", label: "Kundearkiv", icon: Users, adminOnly: true, employeeHidden: true, group: "Hoved" },
  { id: "collab", label: "Samarbeidsavtaler", icon: Handshake, employeeHidden: true, group: "Hoved" },
  { id: "bookings", label: "1-1 Bookinger", icon: CalendarDays, adminOnly: true, employeeHidden: true, group: "Hoved" },
  { id: "hms", label: "HMS-assistent", icon: Shield, group: "Hoved" },

  // Kunder
  { id: "contact_submissions", label: "Henvendelser", icon: Mail, adminOnly: true, employeeHidden: true, group: "Kunder" },
  { id: "employee_invitations", label: "Ansattinvitasjoner", icon: UserPlus, adminOnly: true, employeeHidden: true, group: "Kunder" },
  { id: "advisor_requests", label: "Rådgiverforespørsler", icon: Users, adminOnly: true, employeeHidden: true, group: "Kunder" },

  // Avtaler
  { id: "partner_requests", label: "Avtaleforespørsler", icon: Inbox, adminOnly: true, employeeHidden: true, group: "Avtaler" },
  { id: "benefit_applications", label: "Fordelsavtale-søknader", icon: Handshake, adminOnly: true, employeeHidden: true, group: "Avtaler" },

  // Innhold
  { id: "blog", label: "Blogg & Nyheter", icon: FileText, adminOnly: true, employeeHidden: true, group: "Innhold" },
  { id: "page_changes", label: "Sideendringer", icon: Briefcase, adminOnly: true, employeeHidden: true, group: "Innhold" },
  { id: "org_resources", label: "Organisasjonsressurser", icon: FolderOpen, adminOnly: true, employeeHidden: true, group: "Innhold" },

  // Internt
  { id: "hr", label: "HR & Personal", icon: Shield, adminOnly: true, employeeHidden: true, group: "Internt" },
  { id: "job_listings", label: "Stillinger", icon: Briefcase, adminOnly: true, employeeHidden: true, group: "Internt" },
  { id: "internal", label: "Interne ressurser", icon: FolderOpen, employeeHidden: true, group: "Internt" },

  // Markedsføring
  { id: "sms_center", label: "Markedsføring", icon: Megaphone, adminOnly: true, employeeHidden: true, group: "Markedsføring" },

  // Admin
  { id: "audit_log", label: "Revisjonslogg", icon: Shield, adminOnly: true, employeeHidden: true, group: "Admin" },
  { id: "settings", label: "Innstillinger", icon: Settings, group: "Admin" },
];

const NAV_ORDER_KEY = "admin-sidebar-order";


function loadNavOrder(): Panel[] | null {
  try {
    const raw = localStorage.getItem(NAV_ORDER_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return null;
}

function saveNavOrder(order: Panel[]) {
  localStorage.setItem(NAV_ORDER_KEY, JSON.stringify(order));
}


const AdminDashboard = () => {
  const { profile, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activePanel, setActivePanel] = useState<Panel>(() => {
    const p = searchParams.get("panel");
    return (p && DEFAULT_NAV_ITEMS.some(i => i.id === p)) ? p as Panel : "overview";
  });
  const [panelContext, setPanelContext] = useState<Record<string, string> | null>(() => {
    const tab = searchParams.get("tab");
    return tab ? { tab } : null;
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingSidebar, setEditingSidebar] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const [bellOpen, setBellOpen] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);
  const notifications = useAdminNotifications();
  const [wsUnread, setWsUnread] = useState(0);
  const [grantedPanels, setGrantedPanels] = useState<Set<string>>(new Set());

  // Enable native browser/phone push notifications
  useBrowserNotifications(profile?.id);
  usePushSubscription(profile?.id);

  // Sync URL params when panel changes
  useEffect(() => {
    const params: Record<string, string> = {};
    if (activePanel !== "overview") params.panel = activePanel;
    if (panelContext?.tab) params.tab = panelContext.tab;
    setSearchParams(params, { replace: true });
  }, [activePanel, panelContext, setSearchParams]);

  // Fetch workspace notification count
  useEffect(() => {
    if (!profile?.id) return;
    const fetchWsCount = async () => {
      const { count } = await supabase.from("workspace_notifications").select("*", { count: "exact", head: true }).eq("recipient_id", profile.id).eq("read", false);
      setWsUnread(count || 0);
    };
    fetchWsCount();
    const ch = supabase.channel("admin-ws-badge").on("postgres_changes", { event: "*", schema: "public", table: "workspace_notifications" }, () => fetchWsCount()).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [profile?.id]);

  // Fetch employee panel access
  useEffect(() => {
    if (!profile?.id || isAdmin) return;
    const fetchAccess = async () => {
      const { data } = await supabase.from("employee_panel_access").select("panel_key").eq("profile_id", profile.id);
      if (data) setGrantedPanels(new Set(data.map((r: any) => r.panel_key)));
    };
    fetchAccess();
  }, [profile?.id, isAdmin]);

  // Build ordered nav items
  const [navOrder, setNavOrder] = useState<Panel[]>(() => {
    const saved = loadNavOrder();
    if (saved) return saved;
    return DEFAULT_NAV_ITEMS.map(i => i.id);
  });

  const navItemMap = new Map(DEFAULT_NAV_ITEMS.map(i => [i.id, i]));

  const orderedNavItems: NavItem[] = (() => {
    const ordered: NavItem[] = [];
    for (const id of navOrder) {
      const item = navItemMap.get(id);
      if (item) ordered.push(item);
    }
    // Add any new items not in saved order
    for (const item of DEFAULT_NAV_ITEMS) {
      if (!navOrder.includes(item.id)) ordered.push(item);
    }
    return ordered;
  })();

  // Close bell dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setBellOpen(false);
      }
    };
    if (bellOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [bellOpen]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  // Active total from hook
  const activeTotal = notifications.total;

  // Map panel IDs to notification counts
  const badgeMap: Partial<Record<Panel, number>> = {
    partner_requests: notifications.partnerRequests,
    advisor_requests: notifications.advisorRequests,
    employee_invitations: notifications.employeeInvitations,
    benefit_applications: notifications.benefitApplications,
    bookings: notifications.pendingBookings,
    contact_submissions: notifications.contactSubmissions,
    overview: notifications.contactSubmissions,
    account_feedback: notifications.accountFeedback,
    org_resources: notifications.accountFeedback,
    job_listings: (notifications.jobApplications || 0) + (notifications.openApplications || 0),
    chat: wsUnread,
  };

  const visibleItems = orderedNavItems.filter(item => {
    if (isAdmin) return true;
    // Employee: hide items marked employeeHidden unless granted
    if (item.employeeHidden) return grantedPanels.has(item.id);
    // Also hide adminOnly items not explicitly granted
    if (item.adminOnly) return grantedPanels.has(item.id);
    return true;
  });
  const groups = [...new Set(visibleItems.map(i => i.group))];

  const refreshNotifications = notifications.refresh;

  // Reorder within a group
  const reorderGroup = (group: string, newGroupItems: NavItem[]) => {
    const newOrder: Panel[] = [];
    for (const g of groups) {
      if (g === group) {
        newGroupItems.forEach(i => newOrder.push(i.id));
      } else {
        visibleItems.filter(i => i.group === g).forEach(i => newOrder.push(i.id));
      }
    }
    // Add hidden items
    for (const item of DEFAULT_NAV_ITEMS) {
      if (!newOrder.includes(item.id)) newOrder.push(item.id);
    }
    setNavOrder(newOrder);
    saveNavOrder(newOrder);
  };

  const resetNavOrder = () => {
    const defaultOrder = DEFAULT_NAV_ITEMS.map(i => i.id);
    setNavOrder(defaultOrder);
    saveNavOrder(defaultOrder);
    setEditingSidebar(false);
  };

  const renderPanel = () => {
    switch (activePanel) {
      case "chat": navigate("/workspace"); return null;
      case "blog": return <BlogPanel />;
      case "services": return <ServicesPanel />;
      case "industries": return <IndustriesPanel />;
      case "pricing": return <PricingPanel />;
      case "page_changes": return <PageChangesPanel />;
      case "archive": return <ArchivePanel />;
      case "resources": return <ResourcesPanel />;
      case "hr": return <HrPanel />;
      case "hms": return <HrPanel />;
      case "internal": return <InternalResourcesPanel />;
      case "collab": return <CollabPanel />;
      case "knowledge": return <KnowledgeBasePanel />;
      case "datacenter": return <DataCenterPanel />;
      case "courses": return <CoursesPanel />;
      case "bookings": return <BookingsPanel onStatusChange={refreshNotifications} />;
      case "customers": return <CustomersPanel />;
      case "partner_requests": return <PartnerRequestsPanel onStatusChange={refreshNotifications} />;
      case "advisor_requests": return <AdvisorRequestsPanel onStatusChange={refreshNotifications} />;
      case "employee_invitations": return <EmployeeInvitationsPanel onStatusChange={refreshNotifications} />;
      case "doc_templates": return <DocumentTemplatesPanel />;
      case "benefit_applications": return <BenefitApplicationsPanel onStatusChange={refreshNotifications} />;
      case "account_entries": return <AccountEntriesPanel initialSearch={panelContext?.search} />;
      case "glossary": return <GlossaryPanel />;
      case "contact_submissions": return <ContactSubmissionsPanel onStatusChange={refreshNotifications} />;
      case "account_feedback": return <AccountFeedbackPanel onStatusChange={refreshNotifications} />;
      case "pending_tasks": return <PendingTasksPanel onStatusChange={refreshNotifications} onNavigate={(p, ctx) => { setPanelContext(ctx || null); setActivePanel(p as Panel); }} />;
      case "job_listings": return <JobListingsPanel />;
      case "org_resources": return <OrgResourcesPanel onStatusChange={refreshNotifications} initialSearch={panelContext?.search} initialTab={panelContext?.tab} badgeCounts={{ account_feedback: notifications.accountFeedback }} />;
      case "sms_center": return <SmsCenterPanel />;
      case "audit_log": return <AuditLogPanel />;
      case "settings": return <SettingsPanel />;
      default: return <OverviewPanel isAdmin={isAdmin} onNavigate={setActivePanel} notifications={notifications} />;
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-border/10 flex items-center justify-between">
        <Link to="/" className="group">
          <span className="font-heading text-2xl text-primary">Avargo</span>
          <p className="text-xs text-muted-foreground mt-0.5 group-hover:text-primary transition-colors">Se nettside →</p>
        </Link>
        <button
          onClick={() => setEditingSidebar(!editingSidebar)}
          className={`p-1.5 rounded-lg transition-all ${editingSidebar ? "bg-primary text-primary-foreground" : "text-muted-foreground/40 hover:text-muted-foreground"}`}
          title="Endre rekkefølge"
        >
          {editingSidebar ? <Check size={13} /> : <GripVertical size={13} />}
        </button>
      </div>

      {editingSidebar && (
        <div className="px-3 py-2 border-b border-border/10 flex items-center justify-between">
          <p className="text-[9px] tracking-wider uppercase text-muted-foreground/60">Dra for å omorganisere</p>
          <button onClick={resetNavOrder} className="text-[9px] text-muted-foreground hover:text-foreground flex items-center gap-1">
            <RotateCcw size={9} /> Tilbakestill
          </button>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {groups.map(group => {
          const groupItems = visibleItems.filter(i => i.group === group);
          const isCollapsed = collapsedGroups[group] ?? false;
          const hasActiveItem = groupItems.some(i => i.id === activePanel);
          const groupBadgeCount = groupItems.reduce((sum, i) => sum + (badgeMap[i.id] || 0), 0);

          if (editingSidebar) {
            return (
              <div key={group}>
                <p className="text-[9px] tracking-[0.35em] uppercase text-muted-foreground/40 px-2 mb-1">{group}</p>
                <Reorder.Group
                  axis="y"
                  values={groupItems}
                  onReorder={(newItems) => reorderGroup(group, newItems)}
                  className="space-y-0.5"
                >
                  {groupItems.map(item => (
                    <Reorder.Item key={item.id} value={item} className="cursor-grab active:cursor-grabbing">
                      <div className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground bg-muted/20 border border-border/10">
                        <GripVertical size={13} className="text-muted-foreground/40 shrink-0" />
                        <item.icon size={15} strokeWidth={1.5} className="shrink-0" />
                        <span className="font-light flex-1 text-left">{item.label}</span>
                      </div>
                    </Reorder.Item>
                  ))}
                </Reorder.Group>
              </div>
            );
          }

          return (
            <div key={group}>
              <button
                onClick={() => setCollapsedGroups(prev => {
                  const isCurrentlyCollapsed = prev[group] ?? false;
                  // Collapse all groups, then toggle the clicked one
                  const allCollapsed: Record<string, boolean> = {};
                  groups.forEach(g => { allCollapsed[g] = true; });
                  if (isCurrentlyCollapsed) {
                    allCollapsed[group] = false; // open this one
                  }
                  return allCollapsed;
                })}
                className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-[10px] tracking-[0.3em] uppercase text-muted-foreground/50 hover:text-muted-foreground transition-colors"
              >
                <ChevronDown
                  size={12}
                  className={`shrink-0 transition-transform duration-200 ${isCollapsed ? "-rotate-90" : ""}`}
                />
                <span className="flex-1 text-left">{group}</span>
                {isCollapsed && groupBadgeCount > 0 && (
                  <span className="min-w-[16px] h-[16px] flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[8px] font-bold px-1">
                    {groupBadgeCount}
                  </span>
                )}
                {isCollapsed && hasActiveItem && (
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                )}
              </button>
              {!isCollapsed && (
                <div className="space-y-0.5 mt-0.5">
                  {groupItems.map(item => (
                    <button
                      key={item.id}
                      onClick={() => {
                        // If org_resources has badge from account_feedback, auto-open that tab
                        if (item.id === "org_resources" && (badgeMap["account_feedback"] || 0) > 0) {
                          setPanelContext({ tab: "account_feedback" });
                        } else {
                          setPanelContext(null);
                        }
                        setActivePanel(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 text-left ${
                        activePanel === item.id
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                    >
                      <item.icon size={15} strokeWidth={1.5} className="shrink-0" />
                      <span className="font-light flex-1 text-left">{item.label}</span>
                      {(badgeMap[item.id] || 0) > 0 && (
                        <span className="ml-auto mr-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold px-1">
                          {badgeMap[item.id]}
                        </span>
                      )}
                      {activePanel === item.id && <ChevronRight size={12} className="ml-auto" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border/10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-medium">
            {profile?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate">{profile?.name}</p>
            <p className="text-[10px] text-muted-foreground capitalize">{profile?.role}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
        >
          <LogOut size={13} strokeWidth={1.5} />
          Logg ut
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <aside className="hidden md:flex flex-col w-60 border-r border-border/10 bg-background/60 backdrop-blur shrink-0">
        <SidebarContent />
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-background border-r border-border/10 flex flex-col">
            <SidebarContent />
          </aside>
        </div>
      )}

      <main className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-10 flex items-center gap-3 px-4 md:px-6 h-14 border-b border-border/10 bg-background/80 backdrop-blur">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-muted-foreground hover:text-foreground"
          >
            <Menu size={20} />
          </button>
          <Link to="/" className="font-heading text-lg flex-1 hover:text-primary transition-colors">
            {visibleItems.find(i => i.id === activePanel)?.label ?? "Oversikt"}
          </Link>

          <Link
            to="/karriere"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-all"
          >
            <Briefcase size={14} strokeWidth={1.5} />
            <span>Karriere</span>
          </Link>

          <Link
            to="/"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
          >
            <ExternalLink size={14} strokeWidth={1.5} />
            <span>Se nettside</span>
          </Link>

          {/* Bell notification dropdown */}
          <div ref={bellRef} className="relative">
            <button
              onClick={() => setBellOpen(!bellOpen)}
              className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
            >
              <Bell size={15} strokeWidth={1.5} />
              {activeTotal > 0 && (
                <span className="min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold px-1">
                  {activeTotal}
                </span>
              )}
            </button>

            {bellOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-border/20 bg-background shadow-2xl z-50 overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-border/10 flex items-center justify-between">
                  <h3 className="text-sm font-medium">Varsler ({activeTotal})</h3>
                  {activeTotal > 0 && (
                    <button
                      onClick={() => { setActivePanel("pending_tasks"); setBellOpen(false); }}
                      className="text-[10px] text-primary hover:underline"
                    >
                      Åpne alle →
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-border/5">
                  {notifications.items.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                      <Bell size={20} className="mx-auto text-muted-foreground/30 mb-2" />
                      <p className="text-xs text-muted-foreground">Ingen ventende oppgaver</p>
                    </div>
                  ) : (
                    notifications.items.slice(0, 8).map(item => (
                      <button
                        key={item.id}
                        onClick={() => {
                          const target = (item.category === "job_applications" || item.category === "open_applications") ? "job_listings" : "pending_tasks";
                          setActivePanel(target as Panel);
                          setBellOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors text-left"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{item.sublabel}</p>
                          <p className="text-[10px] text-muted-foreground">{item.label}</p>
                        </div>
                        <ArrowRight size={11} className="text-muted-foreground/30 shrink-0" />
                      </button>
                    ))
                  )}
                  {notifications.items.length > 8 && (
                    <button
                      onClick={() => { setActivePanel("pending_tasks"); setBellOpen(false); }}
                      className="w-full px-4 py-3 text-center text-[11px] text-primary hover:bg-muted/20 transition-colors"
                    >
                      + {notifications.items.length - 8} flere...
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        <div className="p-4 md:p-6 lg:p-8 text-left">
          {renderPanel()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
