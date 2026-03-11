import { useState } from "react";
import { LayoutDashboard, Send, Users as UsersIcon, Smartphone, FileText, Clock, Settings, Megaphone, Layers } from "lucide-react";
import SmsDashboardPanel from "./sms/SmsDashboardPanel";
import SmsSendPanel from "./sms/SmsSendPanel";
import SmsBulkPanel from "./sms/SmsBulkPanel";
import SmsCampaignsPanel from "./sms/SmsCampaignsPanel";
import SmsContactsPanel from "./sms/SmsContactsPanel";
import SmsDevicesPanel from "./sms/SmsDevicesPanel";
import SmsTemplatesPanel from "./sms/SmsTemplatesPanel";
import SmsHistoryPanel from "./sms/SmsHistoryPanel";
import SmsSettingsPanel from "./sms/SmsSettingsPanel";

const TABS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "send", label: "Send SMS", icon: Send },
  { id: "bulk", label: "Bulk SMS", icon: Layers },
  { id: "campaigns", label: "Kampanjer", icon: Megaphone },
  { id: "contacts", label: "Kontakter", icon: UsersIcon },
  { id: "devices", label: "Enheter", icon: Smartphone },
  { id: "templates", label: "Maler", icon: FileText },
  { id: "history", label: "Historikk", icon: Clock },
  { id: "settings", label: "Innstillinger", icon: Settings },
] as const;

type TabId = (typeof TABS)[number]["id"];

const SmsCenterPanel = () => {
  const [tab, setTab] = useState<TabId>("dashboard");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Send size={18} className="text-primary" strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-sm font-medium">SMS Center</p>
          <p className="text-[10px] text-muted-foreground">Send og administrer SMS via Android gateway-enheter</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 p-1 rounded-xl bg-muted/40 border border-border/20">
        {TABS.map(t => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 h-9 px-3 rounded-lg text-xs font-medium transition-all ${
                active ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon size={13} />
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === "dashboard" && <SmsDashboardPanel />}
      {tab === "send" && <SmsSendPanel />}
      {tab === "bulk" && <SmsBulkPanel />}
      {tab === "campaigns" && <SmsCampaignsPanel />}
      {tab === "contacts" && <SmsContactsPanel />}
      {tab === "devices" && <SmsDevicesPanel />}
      {tab === "templates" && <SmsTemplatesPanel />}
      {tab === "history" && <SmsHistoryPanel />}
      {tab === "settings" && <SmsSettingsPanel />}
    </div>
  );
};

export default SmsCenterPanel;
