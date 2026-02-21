import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard, FileText, Briefcase, Building2, DollarSign,
  BookOpen, Archive, Shield, FolderOpen, Handshake,
  Users, MessageSquare, Settings, LogOut, ChevronRight, Menu, X, Sparkles, GraduationCap, CalendarDays
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

type Panel = "overview" | "employees" | "chat" | "blog" | "services" | "industries" | "pricing"
  | "archive" | "resources" | "hms" | "internal" | "collab" | "settings" | "hr" | "knowledge" | "courses" | "bookings" | "datacenter" | "mybooking" | "customers";

const navItems: { id: Panel; label: string; icon: React.ElementType; adminOnly?: boolean; group?: string }[] = [
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

const AdminDashboard = () => {
  const { profile, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activePanel, setActivePanel] = useState<Panel>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const visibleItems = navItems.filter(item => !item.adminOnly || isAdmin);
  const groups = [...new Set(visibleItems.map(i => i.group))];

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
      case "bookings": return <BookingsPanel />;
      case "mybooking": return <MyBookingSettingsPanel />;
      case "customers": return <CustomersPanel />;
      case "settings": return <SettingsPanel />;
      default: return <OverviewPanel isAdmin={isAdmin} onNavigate={setActivePanel} />;
    }
  };

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-border/10">
        <span className="font-heading text-2xl text-primary">Avargo</span>
        <p className="text-xs text-muted-foreground mt-0.5">Internpanel</p>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-4">
        {groups.map(group => (
          <div key={group}>
            <p className="text-[9px] tracking-[0.35em] uppercase text-muted-foreground/40 px-2 mb-1">{group}</p>
            {visibleItems.filter(i => i.group === group).map(item => (
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
          </div>
        ))}
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
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-muted-foreground hover:text-foreground"
          >
            <Menu size={20} />
          </button>
          <h1 className="font-heading text-lg">
            {visibleItems.find(i => i.id === activePanel)?.label ?? "Oversikt"}
          </h1>
        </div>

        <div className="p-4 md:p-6 lg:p-8">
          {renderPanel()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
