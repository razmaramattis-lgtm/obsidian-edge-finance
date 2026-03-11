import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Eye, ThumbsUp, MessageSquare, Share2, MousePointer, Video, AlertTriangle } from "lucide-react";

interface Metric {
  id: string;
  source: string;
  source_type: string;
  date: string;
  impressions: number;
  reach: number;
  likes: number;
  comments: number;
  shares: number;
  clicks: number;
  video_views: number;
  engagement_rate: number;
}

const PerformanceTrackerTab = () => {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("marketing_performance")
        .select("*")
        .order("date", { ascending: false })
        .limit(50);
      setMetrics((data as Metric[]) || []);
      setLoading(false);
    };
    fetch();
  }, []);

  const totals = metrics.reduce(
    (acc, m) => ({
      impressions: acc.impressions + (m.impressions || 0),
      reach: acc.reach + (m.reach || 0),
      likes: acc.likes + (m.likes || 0),
      comments: acc.comments + (m.comments || 0),
      shares: acc.shares + (m.shares || 0),
      clicks: acc.clicks + (m.clicks || 0),
    }),
    { impressions: 0, reach: 0, likes: 0, comments: 0, shares: 0, clicks: 0 }
  );

  const summaryCards = [
    { label: "Visninger", value: totals.impressions, icon: Eye },
    { label: "Rekkevidde", value: totals.reach, icon: BarChart3 },
    { label: "Likes", value: totals.likes, icon: ThumbsUp },
    { label: "Kommentarer", value: totals.comments, icon: MessageSquare },
    { label: "Delinger", value: totals.shares, icon: Share2 },
    { label: "Klikk", value: totals.clicks, icon: MousePointer },
  ];

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-amber-500/5 border-amber-500/20">
        <div className="flex items-center gap-2 text-amber-600 text-sm">
          <AlertTriangle size={14} />
          <span>To-veis API-integrasjon er ikke aktiv enda. Data må legges inn manuelt eller kobles til via API.</span>
        </div>
      </Card>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {summaryCards.map((c) => (
          <Card key={c.label} className="p-3 text-center">
            <c.icon size={16} className="mx-auto mb-1 text-primary" />
            <p className="font-heading text-xl">{c.value.toLocaleString("nb-NO")}</p>
            <p className="text-[10px] text-muted-foreground">{c.label}</p>
          </Card>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Laster...</p>
      ) : metrics.length === 0 ? (
        <Card className="p-8 text-center">
          <BarChart3 size={32} className="mx-auto mb-3 text-muted-foreground/30" />
          <p className="text-muted-foreground">Ingen performance-data enda. Koble til SoMe-APIer for automatisk datahenting.</p>
        </Card>
      ) : (
        <div className="space-y-2">
          {metrics.map((m) => (
            <Card key={m.id} className="p-3 flex items-center gap-4">
              <Badge variant="outline" className="text-[10px] shrink-0">{m.source}</Badge>
              <Badge variant="secondary" className="text-[10px]">{m.source_type}</Badge>
              <span className="text-xs text-muted-foreground">{m.date}</span>
              <span className="text-xs">👁 {m.impressions}</span>
              <span className="text-xs">👍 {m.likes}</span>
              <span className="text-xs">💬 {m.comments}</span>
              <span className="text-xs">🔗 {m.clicks}</span>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PerformanceTrackerTab;
