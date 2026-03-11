import { useState } from "react";
import { Smartphone, Mail, Megaphone } from "lucide-react";

// SMS sub-panels
import SmsDashboardPanel from "./sms/SmsDashboardPanel";
import SmsSendPanel from "./sms/SmsSendPanel";
import SmsBulkPanel from "./sms/SmsBulkPanel";
import SmsCampaignsPanel from "./sms/SmsCampaignsPanel";
import SmsContactsPanel from "./sms/SmsContactsPanel";
import SmsDevicesPanel from "./sms/SmsDevicesPanel";
import SmsTemplatesPanel from "./sms/SmsTemplatesPanel";
import SmsHistoryPanel from "./sms/SmsHistoryPanel";
import SmsSettingsPanel from "./sms/SmsSettingsPanel";

// Email sub-panels
import EmailDashboardPanel from "./email/EmailDashboardPanel";
import EmailSendPanel from "./email/EmailSendPanel";
import EmailBulkPanel from "./email/EmailBulkPanel";
import EmailCampaignsPanel from "./email/EmailCampaignsPanel";
import EmailTemplatesPanel from "./email/EmailTemplatesPanel";
import EmailHistoryPanel from "./email/EmailHistoryPanel";
import EmailContactsPanel from "./email/EmailContactsPanel";

import {
  LayoutDashboard, Send, Users as UsersIcon, FileText, Clock, Settings, Layers,
} from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

type Channel = "sms" | "email";

const SMS_TABS = [
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

const EMAIL_TABS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "send", label: "Send e-post", icon: Send },
  { id: "bulk", label: "Masseutsendelse", icon: Layers },
  { id: "campaigns", label: "Kampanjer", icon: Megaphone },
  { id: "contacts", label: "Kontakter", icon: UsersIcon },
  { id: "templates", label: "Maler", icon: FileText },
  { id: "history", label: "Historikk", icon: Clock },
] as const;

type SmsTab = (typeof SMS_TABS)[number]["id"];
type EmailTab = (typeof EMAIL_TABS)[number]["id"];

const SmsCenterPanel = () => {
  const [channel, setChannel] = useState<Channel>("sms");
  const [smsTab, setSmsTab] = useState<SmsTab>("dashboard");
  const [emailTab, setEmailTab] = useState<EmailTab>("dashboard");

  const tabs = channel === "sms" ? SMS_TABS : EMAIL_TABS;
  const activeTab = channel === "sms" ? smsTab : emailTab;
  const setActiveTab = channel === "sms"
    ? (id: string) => setSmsTab(id as SmsTab)
    : (id: string) => setEmailTab(id as EmailTab);

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header with channel switcher */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
          <Megaphone size={18} className="text-primary" strokeWidth={1.5} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">Markedsføring</p>
          <p className="text-[10px] text-muted-foreground truncate">SMS og e-postutsendelse fra plattformen</p>
        </div>
      </div>

      {/* Channel tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-muted/40 border border-border/20 w-fit">
        <button
          onClick={() => setChannel("sms")}
          className={`flex items-center gap-1.5 h-9 px-4 rounded-lg text-xs font-medium transition-all ${
            channel === "sms" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Smartphone size={13} />
          SMS
        </button>
        <button
          onClick={() => setChannel("email")}
          className={`flex items-center gap-1.5 h-9 px-4 rounded-lg text-xs font-medium transition-all ${
            channel === "email" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Mail size={13} />
          E-post
        </button>
      </div>

      {/* Sub-tabs - horizontal scroll on mobile */}
      <ScrollArea className="w-full">
        <div className="flex gap-1 p-1 rounded-xl bg-muted/40 border border-border/20 w-max min-w-full">
          {tabs.map(t => {
            const Icon = t.icon;
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-1.5 h-9 px-3 rounded-lg text-xs font-medium transition-all whitespace-nowrap shrink-0 ${
                  active ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon size={13} />
                <span className="hidden sm:inline">{t.label}</span>
                <span className="sm:hidden">{t.label.split(" ")[0]}</span>
              </button>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* SMS panels */}
      {channel === "sms" && (
        <>
          {smsTab === "dashboard" && <SmsDashboardPanel />}
          {smsTab === "send" && <SmsSendPanel />}
          {smsTab === "bulk" && <SmsBulkPanel />}
          {smsTab === "campaigns" && <SmsCampaignsPanel />}
          {smsTab === "contacts" && <SmsContactsPanel />}
          {smsTab === "devices" && <SmsDevicesPanel />}
          {smsTab === "templates" && <SmsTemplatesPanel />}
          {smsTab === "history" && <SmsHistoryPanel />}
          {smsTab === "settings" && <SmsSettingsPanel />}
        </>
      )}

      {/* Email panels */}
      {channel === "email" && (
        <>
          {emailTab === "dashboard" && <EmailDashboardPanel />}
          {emailTab === "send" && <EmailSendPanel />}
          {emailTab === "bulk" && <EmailBulkPanel />}
          {emailTab === "campaigns" && <EmailCampaignsPanel />}
          {emailTab === "contacts" && <EmailContactsPanel />}
          {emailTab === "templates" && <EmailTemplatesPanel />}
          {emailTab === "history" && <EmailHistoryPanel />}
        </>
      )}
    </div>
  );
};

export default SmsCenterPanel;
