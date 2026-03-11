import { useState } from "react";
import {
  LayoutDashboard, Search, PenTool, CheckSquare, Calendar, BarChart3,
  Megaphone, Brain, Plug, FolderOpen, Video, Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import MarketingDashboardTab from "./marketing/MarketingDashboardTab";
import ContentAnalyzerTab from "./marketing/ContentAnalyzerTab";
import PostGeneratorTab from "./marketing/PostGeneratorTab";
import PostArchiveTab from "./marketing/PostArchiveTab";
import ApprovalQueueTab from "./marketing/ApprovalQueueTab";
import SomeSchedulerTab from "./marketing/SomeSchedulerTab";
import PerformanceTrackerTab from "./marketing/PerformanceTrackerTab";
import AdManagerTab from "./marketing/AdManagerTab";
import AiMarketingBrainTab from "./marketing/AiMarketingBrainTab";
import IntegrationsTab from "./marketing/IntegrationsTab";
import VideoStudioTab from "./marketing/VideoStudioTab";

const SECTIONS = [
  {
    label: "Oversikt",
    tabs: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Innhold",
    tabs: [
      { id: "analyzer", label: "Analyse & Skanning", icon: Search },
      { id: "generator", label: "Innleggsgenerator", icon: PenTool },
      { id: "archive", label: "Arkiv", icon: FolderOpen },
      { id: "video", label: "Video Studio", icon: Video },
    ],
  },
  {
    label: "Flyt & Publisering",
    tabs: [
      { id: "approval", label: "Godkjenning", icon: CheckSquare },
      { id: "scheduler", label: "Planlegging", icon: Calendar },
    ],
  },
  {
    label: "Annonser & Ytelse",
    tabs: [
      { id: "ads", label: "Ad Manager", icon: Megaphone },
      { id: "performance", label: "Resultater", icon: BarChart3 },
    ],
  },
  {
    label: "AI & System",
    tabs: [
      { id: "brain", label: "AI Brain", icon: Brain },
      { id: "integrations", label: "Integrasjoner", icon: Plug },
    ],
  },
] as const;

type TabId = (typeof SECTIONS)[number]["tabs"][number]["id"];

const MarketingPanel = () => {
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  const renderTab = () => {
    switch (activeTab) {
      case "dashboard": return <MarketingDashboardTab onNavigate={(t) => setActiveTab(t)} />;
      case "integrations": return <IntegrationsTab />;
      case "analyzer": return <ContentAnalyzerTab />;
      case "generator": return <PostGeneratorTab />;
      case "archive": return <PostArchiveTab />;
      case "approval": return <ApprovalQueueTab />;
      case "scheduler": return <SomeSchedulerTab />;
      case "performance": return <PerformanceTrackerTab />;
      case "ads": return <AdManagerTab />;
      case "video": return <VideoStudioTab />;
      case "brain": return <AiMarketingBrainTab />;
      default: return null;
    }
  };

  return (
    <div className="flex gap-6">
      {/* Sidebar navigation */}
      <nav className="w-52 shrink-0 hidden lg:block">
        <div className="sticky top-4 space-y-4">
          <div className="flex items-center gap-2 mb-2 px-1">
            <Sparkles size={16} className="text-primary" />
            <span className="font-heading text-sm">Markedsføring</span>
          </div>
          {SECTIONS.map((section) => (
            <div key={section.label}>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-medium px-2 mb-1.5">
                {section.label}
              </p>
              <div className="space-y-0.5">
                {section.tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all ${
                        isActive
                          ? "bg-primary text-primary-foreground font-medium"
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      }`}
                    >
                      <tab.icon size={14} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </nav>

      {/* Mobile navigation */}
      <div className="lg:hidden w-full">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={16} className="text-primary" />
          <span className="font-heading text-sm">Markedsføring</span>
        </div>
        <div className="flex gap-1 overflow-x-auto pb-3 mb-4 scrollbar-none">
          {SECTIONS.flatMap(s => [...s.tabs]).map((tab) => {
            const isActive = activeTab === tab.id;
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all shrink-0 ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted/50"
                }`}
              >
                <TabIcon size={12} />
                {tab.label}
              </button>
            );
          })}
        </div>
        {renderTab()}
      </div>

      {/* Desktop content */}
      <div className="flex-1 min-w-0 hidden lg:block">
        {renderTab()}
      </div>
    </div>
  );
};

export default MarketingPanel;
