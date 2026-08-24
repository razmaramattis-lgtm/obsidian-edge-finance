import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Mail, Zap, History, Sparkles, Maximize2, Minimize2 } from "lucide-react";
import LeadsTab from "./crm/LeadsTab";
import TemplatesTab from "./crm/TemplatesTab";
import AutopilotTab from "./crm/AutopilotTab";
import LogTab from "./crm/LogTab";
import WipeDatabaseButton from "./crm/WipeDatabaseButton";

const CrmPanel = () => {
  const [fullscreen, setFullscreen] = useState(false);
  const [stats, setStats] = useState({ total: 0, withEmail: 0, contacted: 0, nye: 0 });
  const [reloadKey, setReloadKey] = useState(0);

  const loadStats = useCallback(async () => {
    // Eksakt telling av ~590 000 rader gir timeout, og PostgREST-estimatet blir
    // feil (RLS-funksjonen gjør at planleggeren gjetter 1/3 av tabellen).
    // Derfor leses ferdig utregnede tall fra crm_stats_cache (oppdateres hvert 10. min).
    const { data } = await supabase.from("crm_stats_cache").select("key,value");
    const m = Object.fromEntries(((data as { key: string; value: number }[]) || []).map((r) => [r.key, Number(r.value)]));
    setStats({
      total: m.total || 0,
      withEmail: m.with_email || 0,
      contacted: m.contacted || 0,
      nye: m.new_business || 0,
    });
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats, reloadKey]);

  const handleWiped = useCallback(() => {
    loadStats();
    setReloadKey((k) => k + 1);
  }, [loadStats]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setFullscreen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const body = (
    <div className={fullscreen ? "h-full flex flex-col" : "space-y-4"}>
      <div className="flex items-center gap-3 flex-wrap">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setFullscreen((f) => !f)}
          className="shrink-0 rounded-full"
          aria-label={fullscreen ? "Avslutt fullskjerm" : "Fullskjerm"}
        >
          {fullscreen ? <Minimize2 size={14} className="mr-1.5" /> : <Maximize2 size={14} className="mr-1.5" />}
          {fullscreen ? "Lukk fullskjerm" : "Fullskjerm"}
        </Button>
        <h1 className="text-base font-semibold flex items-center gap-2">
          <Sparkles size={16} className="text-primary" />CRM
        </h1>
        <div className="flex items-center gap-4 text-[11px] text-muted-foreground ml-auto">
          <span><b className="text-foreground text-sm">{stats.total.toLocaleString("nb-NO")}</b> selskaper</span>
          <span><b className="text-foreground text-sm">{stats.withEmail.toLocaleString("nb-NO")}</b> med e-post</span>
          <span><b className="text-foreground text-sm">{stats.contacted.toLocaleString("nb-NO")}</b> kontaktet</span>
          <span><b className="text-foreground text-sm">{stats.nye.toLocaleString("nb-NO")}</b> nyetablerte</span>
          <WipeDatabaseButton onWiped={handleWiped} />
        </div>
      </div>

      <Tabs defaultValue="leads" className={fullscreen ? "flex-1 min-h-0 flex flex-col mt-3" : ""}>
        <TabsList>
          <TabsTrigger value="leads"><Building2 size={14} className="mr-1.5" />Selskaper</TabsTrigger>
          <TabsTrigger value="templates"><Mail size={14} className="mr-1.5" />Maler</TabsTrigger>
          <TabsTrigger value="autopilot"><Zap size={14} className="mr-1.5" />Autopilot</TabsTrigger>
          <TabsTrigger value="log"><History size={14} className="mr-1.5" />Logg</TabsTrigger>
        </TabsList>
        <TabsContent value="leads" className={fullscreen ? "flex-1 min-h-0 overflow-hidden mt-3" : "mt-4"}>
          <LeadsTab fullscreen={fullscreen} key={reloadKey} />
        </TabsContent>
        <TabsContent value="templates" className={fullscreen ? "flex-1 min-h-0 overflow-y-auto mt-3" : "mt-4"}><TemplatesTab /></TabsContent>
        <TabsContent value="autopilot" className={fullscreen ? "flex-1 min-h-0 overflow-y-auto mt-3" : "mt-4"}><AutopilotTab /></TabsContent>
        <TabsContent value="log" className={fullscreen ? "flex-1 min-h-0 overflow-y-auto mt-3" : "mt-4"}><LogTab /></TabsContent>
      </Tabs>
    </div>
  );

  if (fullscreen) {
    return <div className="fixed inset-0 z-[100] bg-background p-4 overflow-hidden">{body}</div>;
  }
  return body;
};

export default CrmPanel;
