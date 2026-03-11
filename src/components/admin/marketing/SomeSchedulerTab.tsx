import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Linkedin, Facebook, Instagram, Megaphone, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

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
    const scheduledAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // +24h default
    await supabase.from("marketing_posts").update({
      status: "scheduled",
      scheduled_at: scheduledAt,
    }).eq("id", id);
    toast.success("Planlagt for publisering");
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
              <Card key={p.id} className="p-3 flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate">{p.title}</span>
                    <Badge variant="outline" className="text-[10px]">{PLATFORM_LABELS[p.platform]}</Badge>
                  </div>
                </div>
                <Button size="sm" onClick={() => handleSchedule(p.id)} className="gap-1 shrink-0">
                  <Calendar size={14} /> Planlegg
                </Button>
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
                      <Clock size={10} /> {new Date(p.scheduled_at).toLocaleString("nb-NO")}
                    </p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SomeSchedulerTab;
