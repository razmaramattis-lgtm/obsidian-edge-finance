import { useState, useEffect, useRef } from "react";
import { motion, Reorder } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useAdminNotifications } from "@/hooks/useAdminNotifications";
import {
  LayoutDashboard, FileText, Briefcase, Building2, DollarSign,
  BookOpen, Archive, Shield, FolderOpen, Handshake,
  Users, MessageSquare, Settings, LogOut, ChevronRight, Menu, X, Sparkles, GraduationCap, CalendarDays, Inbox, UserPlus, FileCheck, Bell, GripVertical, RotateCcw, ArrowRight, Check, Trash2
} from "lucide-react";

// Sub-panels
import EmployeesPanel from "@/components/admin/EmployeesPanel";
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
import BookingsPanel from "@/components/admin/BookingsPanel";
import DataCenterPanel from "@/components/admin/DataCenterPanel";
import MyBookingSettingsPanel from "@/components/admin/MyBookingSettingsPanel";
import CustomersPanel from "@/components/admin/CustomersPanel";
import PartnerRequestsPanel from "@/components/admin/PartnerRequestsPanel";
import AdvisorRequestsPanel from "@/components/admin/AdvisorRequestsPanel";
import EmployeeInvitationsPanel from "@/components/admin/EmployeeInvitationsPanel";
import DocumentTemplatesPanel from "@/components/admin/DocumentTemplatesPanel";
import BenefitApplicationsPanel from "@/components/admin/BenefitApplicationsPanel";

type Panel = "overview" | "employees" | "chat" | "blog" | "services" | "industries" | "pricing"
  | "archive" | "resources" | "hms" | "internal" | "collab" | "settings" | "hr" | "knowledge" | "courses" | "bookings" | "datacenter" | "mybooking" | "customers" | "partner_requests" | "advisor_requests" | "employee_invitations" | "doc_templates" | "benefit_applications";

interface NavItem {
  id: Panel;
  label: string;
  icon: React.ElementType;
  adminOnly?: boolean;
  group: string;
}

const DEFAULT_NAV_ITEMS: NavItem[] = [
  { id: "overview", label: "Oversikt", icon: LayoutDashboard, group: "Hoved" },
  { id: "knowledge", label: "Oppslagsverk", icon: Sparkles, group: "Hoved" },
  { id: "datacenter", label: "Datasenter", icon: Building2, adminOnly: true, group: "Hoved" },
  { id: "blog", label: "Blogg & Nyheter", icon: FileText, adminOnly: true, group: "Nettside" },
  { id: "services", label: "Tjenester", icon: Briefcase, adminOnly: true, group: "Nettside" },
  { id: "industries", label: "Bransjer", icon: Building2, adminOnly: true, group: "Nettside" },
  { id: "pricing", label: "Priser", icon: DollarSign, adminOnly: true, group: "Nettside" },
  { id: "courses", label: "Kurs", icon: GraduationCap, adminOnly: true, group: "Nettside" },
  { id: "bookings", label: "1-1 Bookinger", icon: CalendarDays, adminOnly: true, group: "Nettside" },
  { id: "customers", label: "Kundearkiv", icon: Users, adminOnly: true, group: "Kunder" },
  { id: "partner_requests", label: "Avtaleforespørsler", icon: Inbox, adminOnly: true, group: "Kunder" },
  { id: "advisor_requests", label: "Rådgiverforespørsler", icon: Users, adminOnly: true, group: "Kunder" },
  { id: "employee_invitations", label: "Ansattinvitasjoner", icon: UserPlus, adminOnly: true, group: "Kunder" },
  { id: "benefit_applications", label: "Fordelsavtale-søknader", icon: Handshake, adminOnly: true, group: "Kunder" },
  { id: "doc_templates", label: "Dokumentmaler", icon: FileCheck, adminOnly: true, group: "Nettside" },
  { id: "archive", label: "Arkiv & Skjemaer", icon: Archive, adminOnly: true, group: "Ressurser" },
  { id: "resources", label: "Maler", icon: BookOpen, adminOnly: true, group: "Ressurser" },
  { id: "hr", label: "HR & Personal", icon: Shield, adminOnly: true, group: "Ressurser" },
  { id: "hms", label: "HMS-bok", icon: Shield, group: "Internt" },
  { id: "internal", label: "Interne ressurser", icon: FolderOpen, group: "Internt" },
  { id: "collab", label: "Samarbeidsavtaler", icon: Handshake, group: "Internt" },
  { id: "chat", label: "Chat", icon: MessageSquare, group: "Internt" },
  { id: "mybooking", label: "Min tilgjengelighet", icon: CalendarDays, group: "Internt" },
  { id: "employees", label: "Ansatte", icon: Users, adminOnly: true, group: "Admin" },
  { id: "settings", label: "Innstillinger", icon: Settings, group: "Admin" },
];

const NAV_ORDER_KEY = "admin-sidebar-order";
const DISMISSED_KEY = "admin-dismissed-notifications";

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

function loadDismissed(): string[] {
  try {
    const raw = localStorage.getItem(DISMISSED_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return [];
}

function saveDismissed(ids: string[]) {
  localStorage.setItem(DISMISSED_KEY, JSON.stringify(ids));
}

const AdminDashboard = () => {
  const { profile, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activePanel, setActivePanel] = useState<Panel>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingSidebar, setEditingSidebar] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [dismissedNotifications, setDismissedNotifications] = useState<string[]>(loadDismissed);
  const bellRef = useRef<HTMLDivElement>(null);
  const notifications = useAdminNotifications();

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

  // Notification items
  const notificationItems = [
    { key: "partner_requests", count: notifications.partnerRequests, label: "Avtaleforespørsler", icon: Inbox, panel: "partner_requests" as Panel },
    { key: "advisor_requests", count: notifications.advisorRequests, label: "Rådgiverforespørsler", icon: Users, panel: "advisor_requests" as Panel },
    { key: "employee_invitations", count: notifications.employeeInvitations, label: "Ansattinvitasjoner", icon: UserPlus, panel: "employee_invitations" as Panel },
    { key: "benefit_applications", count: notifications.benefitApplications, label: "Fordelsavtale-søknader", icon: Handshake, panel: "benefit_applications" as Panel },
    { key: "bookings", count: notifications.pendingBookings, label: "Ventende bookinger", icon: CalendarDays, panel: "bookings" as Panel },
    { key: "contact_submissions", count: notifications.contactSubmissions, label: "Nye henvendelser", icon: FileText, panel: "overview" as Panel },
  ];

  const activeNotifications = notificationItems.filter(n => n.count > 0 && !dismissedNotifications.includes(n.key));
  const activeTotal = activeNotifications.reduce((sum, n) => sum + n.count, 0);

  const dismissNotification = (key: string) => {
    const next = [...dismissedNotifications, key];
    setDismissedNotifications(next);
    saveDismissed(next);
  };

  const clearAllDismissed = () => {
    setDismissedNotifications([]);
    saveDismissed([]);
  };

  // Map panel IDs to notification counts
  const badgeMap: Partial<Record<Panel, number>> = {
    partner_requests: notifications.partnerRequests,
    advisor_requests: notifications.advisorRequests,
    employee_invitations: notifications.employeeInvitations,
    benefit_applications: notifications.benefitApplications,
    bookings: notifications.pendingBookings,
  };

  const visibleItems = orderedNavItems.filter(item => !item.adminOnly || isAdmin);
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
      case "employees": return <EmployeesPanel />;
      case "chat": return <ChatPanel />;
      case "blog": return <BlogPanel />;
      case "services": return <ServicesPanel />;
      case "industries": return <IndustriesPanel />;
      case "pricing": return <PricingPanel />;
      case "archive": return <ArchivePanel />;
      case "resources": return <ResourcesPanel />;
      case "hr": return <HrPanel />;
      case "hms": return <HmsPanel />;
      case "internal": return <InternalResourcesPanel />;
      case "collab": return <CollabPanel />;
      case "knowledge": return <KnowledgeBasePanel />;
      case "datacenter": return <DataCenterPanel />;
      case "courses": return <CoursesPanel />;
      case "bookings": return <BookingsPanel onStatusChange={refreshNotifications} />;
      case "mybooking": return <MyBookingSettingsPanel />;
      case "customers": return <CustomersPanel />;
      case "partner_requests": return <PartnerRequestsPanel onStatusChange={refreshNotifications} />;
      case "advisor_requests": return <AdvisorRequestsPanel onStatusChange={refreshNotifications} />;
      case "employee_invitations": return <EmployeeInvitationsPanel onStatusChange={refreshNotifications} />;
      case "doc_templates": return <DocumentTemplatesPanel />;
      case "benefit_applications": return <BenefitApplicationsPanel onStatusChange={refreshNotifications} />;
      case "settings": return <SettingsPanel />;
      default: return <OverviewPanel isAdmin={isAdmin} onNavigate={setActivePanel} notifications={notifications} />;
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-border/10 flex items-center justify-between">
        <div>
          <span className="font-heading text-2xl text-primary">Avargo</span>
          <p className="text-xs text-muted-foreground mt-0.5">Internpanel</p>
        </div>
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

      <nav className="flex-1 overflow-y-auto p-3 space-y-4">
        {groups.map(group => {
          const groupItems = visibleItems.filter(i => i.group === group);

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
                        <span className="font-light flex-1">{item.label}</span>
                      </div>
                    </Reorder.Item>
                  ))}
                </Reorder.Group>
              </div>
            );
          }

          return (
            <div key={group}>
              <p className="text-[9px] tracking-[0.35em] uppercase text-muted-foreground/40 px-2 mb-1">{group}</p>
              {groupItems.map(item => (
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
                  <span className="font-light flex-1">{item.label}</span>
                  {(badgeMap[item.id] || 0) > 0 && (
                    <span className="ml-auto mr-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold px-1">
                      {badgeMap[item.id]}
                    </span>
                  )}
                  {activePanel === item.id && <ChevronRight size={12} className="ml-auto" />}
                </button>
              ))}
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
          <h1 className="font-heading text-lg flex-1">
            {visibleItems.find(i => i.id === activePanel)?.label ?? "Oversikt"}
          </h1>

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
                  <h3 className="text-sm font-medium">Varsler</h3>
                  {dismissedNotifications.length > 0 && (
                    <button onClick={clearAllDismissed} className="text-[10px] text-primary hover:underline">
                      Vis alle igjen
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {activeNotifications.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                      <Bell size={20} className="mx-auto text-muted-foreground/30 mb-2" />
                      <p className="text-xs text-muted-foreground">Ingen aktive varsler</p>
                    </div>
                  ) : (
                    activeNotifications.map(item => (
                      <div
                        key={item.key}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors group border-b border-border/5 last:border-0"
                      >
                        <button
                          onClick={() => { setActivePanel(item.panel); setBellOpen(false); }}
                          className="flex items-center gap-3 flex-1 min-w-0 text-left"
                        >
                          <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0">
                            <item.icon size={14} className="text-destructive" strokeWidth={1.5} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate">{item.label}</p>
                            <p className="text-[10px] text-muted-foreground">{item.count} venter</p>
                          </div>
                          <ArrowRight size={11} className="text-muted-foreground/30 group-hover:text-primary shrink-0" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); dismissNotification(item.key); }}
                          className="shrink-0 p-1.5 rounded-lg text-muted-foreground/30 hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
                          title="Fjern varsel"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        <div className="p-4 md:p-6 lg:p-8">
          {renderPanel()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
