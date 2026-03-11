import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Clock, AlertTriangle, Rocket, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface Post {
  id: string;
  title: string;
  platform: string;
  content: string;
  status: string;
  scheduled_at: string | null;
}

const PLATFORM_LABELS: Record<string, string> = {
  linkedin: "LinkedIn", facebook: "Facebook", instagram: "Instagram",
  google_ads: "Google Ads", meta_ads: "Meta Ads",
};

const SomeSchedulerTab = () => {
  const [approved, setApproved] = useState<Post[]>([]);
  const [scheduled, setScheduled] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  // Per-post scheduling state
  const [schedulingId, setSchedulingId] = useState<string | null>(null);
  const [scheduleDate, setScheduleDate] = useState<Date | undefined>(undefined);
  const [scheduleTime, setScheduleTime] = useState("10:00");

  const fetchPosts = async () => {
    setLoading(true);
    const [a, s] = await Promise.all([
      supabase.from("marketing_posts").select("*").eq("status", "approved").order("created_at"),
      supabase.from("marketing_posts").select("*").eq("status", "scheduled").order("scheduled_at"),
    ]);
    setApproved((a.data as Post[]) || []);
    setScheduled((s.data as Post[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleSchedule = async (id: string) => {
    if (!scheduleDate) {
      // Open picker for this post
      setSchedulingId(id);
      setScheduleDate(new Date(Date.now() + 24 * 60 * 60 * 1000));
      return;
    }
    const dt = new Date(scheduleDate);
    const [h, m] = scheduleTime.split(":").map(Number);
    dt.setHours(h, m, 0, 0);
    await supabase.from("marketing_posts").update({
      status: "scheduled",
      scheduled_at: dt.toISOString(),
    }).eq("id", id);
    toast.success(`Planlagt for ${format(dt, "d. MMM yyyy HH:mm", { locale: nb })}`);
    setSchedulingId(null);
    setScheduleDate(undefined);
    fetchPosts();
  };

  const handleUnschedule = async (id: string) => {
    await supabase.from("marketing_posts").update({ status: "approved", scheduled_at: null }).eq("id", id);
    toast.success("Avplanlagt");
    fetchPosts();
  };

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-amber-500/5 border-amber-500/20">
        <div className="flex items-center gap-2 text-amber-600 text-sm">
          <AlertTriangle size={14} />
          <span>SoMe API-integrasjoner er ikke koblet til enda. Planlagte innlegg vil bli markert, men ikke publisert automatisk.</span>
        </div>
      </Card>

      <div>
        <h3 className="font-heading text-lg mb-3">Godkjente – klare for planlegging</h3>
        {loading ? (
          <p className="text-sm text-muted-foreground">Laster...</p>
        ) : approved.length === 0 ? (
          <p className="text-sm text-muted-foreground">Ingen godkjente innlegg venter.</p>
        ) : (
          <div className="space-y-2">
            {approved.map((p) => (
              <Card key={p.id} className="p-3 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium truncate">{p.title}</span>
                      <Badge variant="outline" className="text-[10px]">{PLATFORM_LABELS[p.platform]}</Badge>
                    </div>
                  </div>
                  {schedulingId !== p.id && (
                    <Button size="sm" onClick={() => { setSchedulingId(p.id); setScheduleDate(new Date(Date.now() + 24 * 60 * 60 * 1000)); }} className="gap-1 shrink-0">
                      <CalendarIcon size={14} /> Planlegg
                    </Button>
                  )}
                </div>

                {schedulingId === p.id && (
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 space-y-3">
                    <p className="text-xs text-muted-foreground">Velg dato og tidspunkt for publisering:</p>
                    <div className="flex flex-wrap gap-3 items-start">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className={cn("w-[180px] justify-start text-left text-sm", !scheduleDate && "text-muted-foreground")}>
                            <CalendarIcon size={14} className="mr-2" />
                            {scheduleDate ? format(scheduleDate, "d. MMM yyyy", { locale: nb }) : "Velg dato"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={scheduleDate} onSelect={setScheduleDate} disabled={(d) => d < new Date()} initialFocus className={cn("p-3 pointer-events-auto")} />
                        </PopoverContent>
                      </Popover>
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-muted-foreground" />
                        <Input type="time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} className="w-28 text-sm" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleSchedule(p.id)} disabled={!scheduleDate} className="gap-1.5">
                        <Rocket size={14} /> Lanser
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => { setSchedulingId(null); setScheduleDate(undefined); }}>Avbryt</Button>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="font-heading text-lg mb-3">Planlagte innlegg</h3>
        {scheduled.length === 0 ? (
          <p className="text-sm text-muted-foreground">Ingen planlagte innlegg.</p>
        ) : (
          <div className="space-y-2">
            {scheduled.map((p) => (
              <Card key={p.id} className="p-3 flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate">{p.title}</span>
                    <Badge variant="outline" className="text-[10px]">{PLATFORM_LABELS[p.platform]}</Badge>
                  </div>
                  {p.scheduled_at && (
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1">
                      <Clock size={10} /> {format(new Date(p.scheduled_at), "d. MMM yyyy HH:mm", { locale: nb })}
                    </p>
                  )}
                </div>
                <Button size="sm" variant="ghost" onClick={() => handleUnschedule(p.id)} className="gap-1 text-destructive hover:text-destructive shrink-0">
                  <Trash2 size={12} /> Avplanlegg
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SomeSchedulerTab;
