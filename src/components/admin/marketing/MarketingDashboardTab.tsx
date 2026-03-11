import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import {
  PenTool, CheckSquare, Calendar, BarChart3, Megaphone, Brain, Search,
  TrendingUp, FileText, Clock, ThumbsUp, Eye,
} from "lucide-react";

interface Props {
  onNavigate: (tab: string) => void;
}

const MarketingDashboardTab = ({ onNavigate }: Props) => {
  const [stats, setStats] = useState({
    totalPosts: 0,
    pendingApproval: 0,
    scheduledPosts: 0,
    publishedPosts: 0,
    activeCampaigns: 0,
    totalInsights: 0,
    crawledPages: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const [posts, pending, scheduled, published, campaigns, insights, crawled] = await Promise.all([
        supabase.from("marketing_posts").select("*", { count: "exact", head: true }),
        supabase.from("marketing_posts").select("*", { count: "exact", head: true }).eq("status", "pending_approval"),
        supabase.from("marketing_posts").select("*", { count: "exact", head: true }).eq("status", "scheduled"),
        supabase.from("marketing_posts").select("*", { count: "exact", head: true }).eq("status", "published"),
        supabase.from("marketing_campaigns").select("*", { count: "exact", head: true }).eq("status", "active"),
        supabase.from("marketing_ai_insights").select("*", { count: "exact", head: true }).eq("active", true),
        supabase.from("marketing_content_analyses").select("*", { count: "exact", head: true }),
      ]);
      setStats({
        totalPosts: posts.count || 0,
        pendingApproval: pending.count || 0,
        scheduledPosts: scheduled.count || 0,
        publishedPosts: published.count || 0,
        activeCampaigns: campaigns.count || 0,
        totalInsights: insights.count || 0,
        crawledPages: crawled.count || 0,
      });
    };
    fetchStats();
  }, []);

  const cards = [
    { label: "Crawlede sider", value: stats.crawledPages, icon: Search, tab: "analyzer", color: "text-blue-500" },
    { label: "Totalt innlegg", value: stats.totalPosts, icon: FileText, tab: "generator", color: "text-emerald-500" },
    { label: "Venter godkjenning", value: stats.pendingApproval, icon: CheckSquare, tab: "approval", color: "text-amber-500" },
    { label: "Planlagt", value: stats.scheduledPosts, icon: Calendar, tab: "scheduler", color: "text-violet-500" },
    { label: "Publisert", value: stats.publishedPosts, icon: ThumbsUp, tab: "performance", color: "text-green-500" },
    { label: "Aktive kampanjer", value: stats.activeCampaigns, icon: Megaphone, tab: "ads", color: "text-rose-500" },
    { label: "AI-innsikter", value: stats.totalInsights, icon: Brain, tab: "brain", color: "text-primary" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Card
            key={c.label}
            className="p-4 cursor-pointer hover:border-primary/30 transition-all group"
            onClick={() => onNavigate(c.tab)}
          >
            <div className="flex items-center gap-3 mb-2">
              <c.icon size={16} className={c.color} />
              <span className="text-xs text-muted-foreground">{c.label}</span>
            </div>
            <p className="font-heading text-2xl">{c.value}</p>
          </Card>
        ))}
      </div>

      <Card className="p-6 border-dashed border-2 border-border/30">
        <div className="flex items-center gap-3 mb-3">
          <TrendingUp size={18} className="text-primary" />
          <h3 className="font-heading text-lg">Workflow</h3>
        </div>
        <div className="flex items-center gap-2 flex-wrap text-sm text-muted-foreground">
          <span className="px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-500">1. Crawling</span>
          <span>→</span>
          <span className="px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500">2. Analyse</span>
          <span>→</span>
          <span className="px-3 py-1.5 rounded-full bg-violet-500/10 text-violet-500">3. Generering</span>
          <span>→</span>
          <span className="px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-500">4. Godkjenning</span>
          <span>→</span>
          <span className="px-3 py-1.5 rounded-full bg-green-500/10 text-green-500">5. Publisering</span>
          <span>→</span>
          <span className="px-3 py-1.5 rounded-full bg-rose-500/10 text-rose-500">6. Sporing</span>
          <span>→</span>
          <span className="px-3 py-1.5 rounded-full bg-primary/10 text-primary">7. AI Læring</span>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-heading text-lg mb-3">Kom i gang</h3>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            <strong>Steg 1:</strong> Bruk <button onClick={() => onNavigate("analyzer")} className="text-primary underline">Content Analyzer</button> til å crawle avargo.no og samle innhold.
          </p>
          <p>
            <strong>Steg 2:</strong> La <button onClick={() => onNavigate("generator")} className="text-primary underline">Post Generator</button> lage innlegg basert på analysert innhold.
          </p>
          <p>
            <strong>Steg 3:</strong> Godkjenn innlegg i <button onClick={() => onNavigate("approval")} className="text-primary underline">Approval Queue</button> før publisering.
          </p>
          <p>
            <strong>Steg 4:</strong> Koble til SoMe-kontoer for automatisk publisering og sporing (kommer senere).
          </p>
        </div>
      </Card>
    </div>
  );
};

export default MarketingDashboardTab;
