import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Mail, Zap, History, Sparkles } from "lucide-react";
import LeadsTab from "./crm/LeadsTab";
import TemplatesTab from "./crm/TemplatesTab";
import AutopilotTab from "./crm/AutopilotTab";
import LogTab from "./crm/LogTab";
import { CATEGORIES, categoryMeta } from "./crm/types";

const CrmPanel = () => {
  const [stats, setStats] = useState<{ total: number; byCategory: Record<string, number>; emailed: number; withEmail: number }>({
    total: 0, byCategory: {}, emailed: 0, withEmail: 0,
  });

  useEffect(() => {
    (async () => {
      const [{ count: total }, { data: cats }, { count: emailed }, { count: withEmail }] = await Promise.all([
        supabase.from("crm_leads").select("id", { count: "exact", head: true }),
        supabase.from("crm_leads").select("category").limit(5000),
        supabase.from("crm_leads").select("id", { count: "exact", head: true }).gt("email_count", 0),
        supabase.from("crm_leads").select("id", { count: "exact", head: true }).not("email", "is", null),
      ]);
      const byCategory: Record<string, number> = {};
      (cats || []).forEach((r: any) => { byCategory[r.category] = (byCategory[r.category] || 0) + 1; });
      setStats({ total: total || 0, byCategory, emailed: emailed || 0, withEmail: withEmail || 0 });
    })();
  }, []);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold flex items-center gap-2"><Sparkles size={18} className="text-primary" />CRM – bedriftsregister</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Henter selskaper fra Brønnøysundregistrene, kategoriserer dem og sender ut målrettede e-poster – manuelt eller på autopilot.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Selskaper i basen</p>
          <p className="text-2xl font-semibold">{stats.total}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Med e-postadresse</p>
          <p className="text-2xl font-semibold">{stats.withEmail}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Kontaktet</p>
          <p className="text-2xl font-semibold">{stats.emailed}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground mb-1.5">Fordeling</p>
          <div className="space-y-1">
            {CATEGORIES.filter((c) => stats.byCategory[c.id]).map((c) => (
              <div key={c.id} className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground truncate">{categoryMeta(c.id).label}</span>
                <span className="font-medium">{stats.byCategory[c.id]}</span>
              </div>
            ))}
            {!Object.keys(stats.byCategory).length && <p className="text-[11px] text-muted-foreground">Ingen data</p>}
          </div>
        </Card>
      </div>

      <Tabs defaultValue="leads">
        <TabsList>
          <TabsTrigger value="leads"><Building2 size={14} className="mr-1.5" />Selskaper</TabsTrigger>
          <TabsTrigger value="templates"><Mail size={14} className="mr-1.5" />Maler</TabsTrigger>
          <TabsTrigger value="autopilot"><Zap size={14} className="mr-1.5" />Autopilot</TabsTrigger>
          <TabsTrigger value="log"><History size={14} className="mr-1.5" />Logg</TabsTrigger>
        </TabsList>
        <TabsContent value="leads" className="mt-4"><LeadsTab /></TabsContent>
        <TabsContent value="templates" className="mt-4"><TemplatesTab /></TabsContent>
        <TabsContent value="autopilot" className="mt-4"><AutopilotTab /></TabsContent>
        <TabsContent value="log" className="mt-4"><LogTab /></TabsContent>
      </Tabs>
    </div>
  );
};

export default CrmPanel;
