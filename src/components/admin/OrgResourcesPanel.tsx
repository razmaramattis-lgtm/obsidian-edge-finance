import { useState } from "react";
import { Building2, Archive, BookOpen, AlertTriangle, FileText, FileCheck, Shield, FolderOpen } from "lucide-react";
import DataCenterPanel from "./DataCenterPanel";
import ArchivePanel from "./ArchivePanel";
import ResourcesPanel from "./ResourcesPanel";
import AccountEntriesPanel from "./AccountEntriesPanel";
import AccountFeedbackPanel from "./AccountFeedbackPanel";
import GlossaryPanel from "./GlossaryPanel";
import DocumentTemplatesPanel from "./DocumentTemplatesPanel";
import HmsPanel from "./HmsPanel";

const TABS = [
  { id: "datacenter", label: "Datasenter", icon: Building2 },
  { id: "archive", label: "Arkiv & Skjemaer", icon: Archive },
  { id: "resources", label: "Maler", icon: BookOpen },
  { id: "account_entries", label: "Kontohjelp", icon: BookOpen },
  { id: "account_feedback", label: "Kontohjelp-meldinger", icon: AlertTriangle },
  { id: "glossary", label: "Regnskapsord", icon: FileText },
  { id: "doc_templates", label: "Dokumentmaler", icon: FileCheck },
  { id: "hms", label: "HMS-bok", icon: Shield },
] as const;

type TabId = (typeof TABS)[number]["id"];

interface OrgResourcesPanelProps {
  onStatusChange?: () => void;
  initialSearch?: string;
  initialTab?: string;
}

const OrgResourcesPanel = ({ onStatusChange, initialSearch, initialTab }: OrgResourcesPanelProps) => {
  const [tab, setTab] = useState<TabId>((initialTab as TabId) || "datacenter");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <FolderOpen size={18} className="text-primary" strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-sm font-medium">Organisasjonsressurser</p>
          <p className="text-[10px] text-muted-foreground">Datasenter, arkiv, maler, kontohjelp, regnskapsord, dokumentmaler og HMS</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 p-1 rounded-xl bg-muted/40 border border-border/20">
        {TABS.map(t => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 h-9 px-3 rounded-lg text-xs font-medium transition-all ${active ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
              <Icon size={13} />
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === "datacenter" && <DataCenterPanel />}
      {tab === "archive" && <ArchivePanel />}
      {tab === "resources" && <ResourcesPanel />}
      {tab === "account_entries" && <AccountEntriesPanel initialSearch={initialSearch} />}
      {tab === "account_feedback" && <AccountFeedbackPanel onStatusChange={onStatusChange} />}
      {tab === "glossary" && <GlossaryPanel />}
      {tab === "doc_templates" && <DocumentTemplatesPanel />}
      {tab === "hms" && <HmsPanel />}
    </div>
  );
};

export default OrgResourcesPanel;
