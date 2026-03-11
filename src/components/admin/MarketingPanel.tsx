import { useState } from "react";
import {
  LayoutDashboard, Search, PenTool, CheckSquare, Calendar, BarChart3,
  Megaphone, Brain, Smartphone, Mail, Plug,
} from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import MarketingDashboardTab from "./marketing/MarketingDashboardTab";
import ContentAnalyzerTab from "./marketing/ContentAnalyzerTab";
import PostGeneratorTab from "./marketing/PostGeneratorTab";
import ApprovalQueueTab from "./marketing/ApprovalQueueTab";
import SomeSchedulerTab from "./marketing/SomeSchedulerTab";
import PerformanceTrackerTab from "./marketing/PerformanceTrackerTab";
import AdManagerTab from "./marketing/AdManagerTab";
import AiMarketingBrainTab from "./marketing/AiMarketingBrainTab";
import IntegrationsTab from "./marketing/IntegrationsTab";

const TABS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "integrations", label: "Integrasjoner", icon: Plug },
  { id: "analyzer", label: "Content Analyzer", icon: Search },
  { id: "generator", label: "Post Generator", icon: PenTool },
  { id: "approval", label: "Godkjenning", icon: CheckSquare },
  { id: "scheduler", label: "SoMe Scheduler", icon: Calendar },
  { id: "performance", label: "Performance", icon: BarChart3 },
  { id: "ads", label: "Ad Manager", icon: Megaphone },
  { id: "brain", label: "AI Brain", icon: Brain },
] as const;

type TabId = (typeof TABS)[number]["id"];

const MarketingPanel = () => {
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");

  const renderTab = () => {
    switch (activeTab) {
      case "dashboard": return <MarketingDashboardTab onNavigate={(t) => setActiveTab(t as TabId)} />;
      case "integrations": return <IntegrationsTab />;
      case "generator": return <PostGeneratorTab />;
      case "approval": return <ApprovalQueueTab />;
      case "scheduler": return <SomeSchedulerTab />;
      case "performance": return <PerformanceTrackerTab />;
      case "ads": return <AdManagerTab />;
      case "brain": return <AiMarketingBrainTab />;
      default: return null;
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Megaphone size={20} className="text-primary" />
        <h2 className="font-heading text-2xl">Markedsføring & SoMe</h2>
      </div>

      <ScrollArea className="w-full mb-6">
        <div className="flex gap-1 pb-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {renderTab()}
    </div>
  );
};

export default MarketingPanel;
