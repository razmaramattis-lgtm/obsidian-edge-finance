import { useState } from "react";
import { Briefcase, Building2, DollarSign, GraduationCap } from "lucide-react";
import ServicesPanel from "./ServicesPanel";
import IndustriesPanel from "./IndustriesPanel";
import PricingPanel from "./PricingPanel";
import CoursesPanel from "./CoursesPanel";

const TABS = [
  { id: "services", label: "Tjenester", icon: Briefcase },
  { id: "industries", label: "Bransjer", icon: Building2 },
  { id: "pricing", label: "Priser", icon: DollarSign },
  { id: "courses", label: "Kurs", icon: GraduationCap },
] as const;

type TabId = (typeof TABS)[number]["id"];

const PageChangesPanel = () => {
  const [tab, setTab] = useState<TabId>("services");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Briefcase size={18} className="text-primary" strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-sm font-medium">Sideendringer</p>
          <p className="text-[10px] text-muted-foreground">Rediger tjenester, bransjer, priser og kurs på nettsiden</p>
        </div>
      </div>

      <div className="flex gap-1 p-1 rounded-xl bg-muted/40 border border-border/20">
        {TABS.map(t => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 h-9 rounded-lg text-xs font-medium transition-all ${active ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
              <Icon size={13} />
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === "services" && <ServicesPanel />}
      {tab === "industries" && <IndustriesPanel />}
      {tab === "pricing" && <PricingPanel />}
      {tab === "courses" && <CoursesPanel />}
    </div>
  );
};

export default PageChangesPanel;
