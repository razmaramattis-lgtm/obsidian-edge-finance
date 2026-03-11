import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  PenTool, CheckSquare, Calendar, BarChart3, Megaphone, Brain, Search,
  TrendingUp, FileText, ThumbsUp, Eye, Plug, ArrowRight, Zap,
  Sparkles, Target, Users,
} from "lucide-react";

import linkedinLogo from "@/assets/platforms/linkedin.png";
import facebookLogo from "@/assets/platforms/facebook.png";
import instagramLogo from "@/assets/platforms/instagram.png";
import googleAdsLogo from "@/assets/platforms/google-ads.png";
import metaAdsLogo from "@/assets/platforms/meta-ads.png";
import tiktokLogo from "@/assets/platforms/tiktok.png";

interface Props {
  onNavigate: (tab: string) => void;
}

const PLATFORM_LOGOS: Record<string, string> = {
  linkedin: linkedinLogo,
  facebook: facebookLogo,
  instagram: instagramLogo,
  google_ads: googleAdsLogo,
  meta_ads: metaAdsLogo,
  tiktok: tiktokLogo,
};

const MarketingDashboardTab = ({ onNavigate }: Props) => {
  const [stats, setStats] = useState({
    totalPosts: 0,
    pendingApproval: 0,
    scheduledPosts: 0,
    publishedPosts: 0,
    activeCampaigns: 0,
    totalInsights: 0,
    crawledPages: 0,
    connectedPlatforms: 0,
    totalPlatforms: 6,
  });
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      const [posts, pending, scheduled, published, campaigns, insights, crawled, integrations] = await Promise.all([
        supabase.from("marketing_posts").select("*", { count: "exact", head: true }),
        supabase.from("marketing_posts").select("*", { count: "exact", head: true }).eq("status", "pending_approval"),
        supabase.from("marketing_posts").select("*", { count: "exact", head: true }).eq("status", "scheduled"),
        supabase.from("marketing_posts").select("*", { count: "exact", head: true }).eq("status", "published"),
        supabase.from("marketing_campaigns").select("*", { count: "exact", head: true }).eq("status", "active"),
        supabase.from("marketing_ai_insights").select("*", { count: "exact", head: true }).eq("active", true),
        supabase.from("marketing_content_analyses").select("*", { count: "exact", head: true }),
        supabase.from("marketing_integrations").select("platform").eq("connected", true),
      ]);
      const connected = (integrations.data || []).map((i: any) => i.platform);
      setConnectedPlatforms(connected);
      setStats({
        totalPosts: posts.count || 0,
        pendingApproval: pending.count || 0,
        scheduledPosts: scheduled.count || 0,
        publishedPosts: published.count || 0,
        activeCampaigns: campaigns.count || 0,
        totalInsights: insights.count || 0,
        crawledPages: crawled.count || 0,
        connectedPlatforms: connected.length,
        totalPlatforms: 6,
      });
    };
    fetchStats();
  }, []);

  const workflowProgress = Math.round(
    ((stats.crawledPages > 0 ? 1 : 0) +
      (stats.totalPosts > 0 ? 1 : 0) +
      (stats.publishedPosts > 0 ? 1 : 0) +
      (stats.connectedPlatforms > 0 ? 1 : 0) +
      (stats.activeCampaigns > 0 ? 1 : 0)) / 5 * 100
  );

  const kpiCards = [
    { label: "Crawlede sider", value: stats.crawledPages, icon: Search, tab: "analyzer", accent: "from-blue-500/20 to-blue-600/5" },
    { label: "Totalt innlegg", value: stats.totalPosts, icon: FileText, tab: "generator", accent: "from-emerald-500/20 to-emerald-600/5" },
    { label: "Venter godkjenning", value: stats.pendingApproval, icon: CheckSquare, tab: "approval", accent: "from-amber-500/20 to-amber-600/5" },
    { label: "Planlagt", value: stats.scheduledPosts, icon: Calendar, tab: "scheduler", accent: "from-violet-500/20 to-violet-600/5" },
    { label: "Publisert", value: stats.publishedPosts, icon: ThumbsUp, tab: "performance", accent: "from-green-500/20 to-green-600/5" },
    { label: "Kampanjer", value: stats.activeCampaigns, icon: Megaphone, tab: "ads", accent: "from-rose-500/20 to-rose-600/5" },
    { label: "AI-innsikter", value: stats.totalInsights, icon: Brain, tab: "brain", accent: "from-primary/20 to-primary/5" },
    { label: "Integrasjoner", value: `${stats.connectedPlatforms}/${stats.totalPlatforms}`, icon: Plug, tab: "integrations", accent: "from-cyan-500/20 to-cyan-600/5" },
  ];

  const workflowSteps = [
    { num: 1, label: "Crawling", icon: Search, tab: "analyzer", done: stats.crawledPages > 0 },
    { num: 2, label: "Analyse", icon: Sparkles, tab: "analyzer", done: stats.crawledPages > 0 },
    { num: 3, label: "Generering", icon: PenTool, tab: "generator", done: stats.totalPosts > 0 },
    { num: 4, label: "Godkjenning", icon: CheckSquare, tab: "approval", done: stats.pendingApproval === 0 && stats.totalPosts > 0 },
    { num: 5, label: "Publisering", icon: Calendar, tab: "scheduler", done: stats.publishedPosts > 0 },
    { num: 6, label: "Sporing", icon: BarChart3, tab: "performance", done: stats.publishedPosts > 0 },
    { num: 7, label: "AI Læring", icon: Brain, tab: "brain", done: stats.totalInsights > 0 },
  ];

  return (
    <div className="space-y-6">
      {/* hero row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* progress card */}
        <Card className="p-5 lg:col-span-2 bg-gradient-to-br from-primary/5 to-transparent">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap size={18} className="text-primary" />
              <h3 className="font-heading text-lg">Markedsføringsmotor</h3>
            </div>
            <Badge variant="outline" className="text-xs">{workflowProgress}% aktiv</Badge>
          </div>
          <Progress value={workflowProgress} className="h-2 mb-4" />
          <div className="flex items-center gap-1 flex-wrap">
            {workflowSteps.map((step, i) => (
              <div key={step.num} className="flex items-center gap-1">
                <button
                  onClick={() => onNavigate(step.tab)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all hover:scale-105 ${
                    step.done
                      ? "bg-green-500/10 text-green-600"
                      : "bg-muted/50 text-muted-foreground"
                  }`}
                >
                  <step.icon size={12} />
                  {step.label}
                </button>
                {i < workflowSteps.length - 1 && (
                  <ArrowRight size={10} className="text-muted-foreground/30 mx-0.5" />
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* connected platforms */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Plug size={16} className="text-primary" />
            <h3 className="font-heading text-sm">Tilkoblede plattformer</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(PLATFORM_LOGOS).map(([id, logo]) => {
              const isConnected = connectedPlatforms.includes(id);
              return (
                <button
                  key={id}
                  onClick={() => onNavigate("integrations")}
                  className={`w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center transition-all hover:scale-110 ${
                    isConnected ? "bg-muted/50 ring-2 ring-green-500/30" : "bg-muted/30 opacity-40 grayscale"
                  }`}
                  title={id}
                >
                  <img src={logo} alt={id} className="w-7 h-7 object-contain" />
                </button>
              );
            })}
          </div>
          {connectedPlatforms.length === 0 && (
            <p className="text-[10px] text-muted-foreground mt-2">Ingen plattformer tilkoblet enda</p>
          )}
        </Card>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {kpiCards.map((c) => (
          <Card
            key={c.label}
            className={`p-4 cursor-pointer hover:border-primary/30 transition-all group bg-gradient-to-br ${c.accent}`}
            onClick={() => onNavigate(c.tab)}
          >
            <div className="flex items-center justify-between mb-2">
              <c.icon size={16} className="text-primary" />
              <ArrowRight size={12} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="font-heading text-2xl">{typeof c.value === "number" ? c.value : c.value}</p>
            <p className="text-[10px] text-muted-foreground">{c.label}</p>
          </Card>
        ))}
      </div>

      {/* quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card
          className="p-4 cursor-pointer hover:border-primary/30 transition-all group"
          onClick={() => onNavigate("analyzer")}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Search size={18} className="text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-heading">Crawl avargo.no</p>
              <p className="text-[10px] text-muted-foreground">Analyser innholdet ditt med AI</p>
            </div>
          </div>
        </Card>
        <Card
          className="p-4 cursor-pointer hover:border-primary/30 transition-all group"
          onClick={() => onNavigate("generator")}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <PenTool size={18} className="text-emerald-500" />
            </div>
            <div>
              <p className="text-sm font-heading">Lag innlegg</p>
              <p className="text-[10px] text-muted-foreground">AI-genererte SoMe-poster</p>
            </div>
          </div>
        </Card>
        <Card
          className="p-4 cursor-pointer hover:border-primary/30 transition-all group"
          onClick={() => onNavigate("integrations")}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
              <Plug size={18} className="text-cyan-500" />
            </div>
            <div>
              <p className="text-sm font-heading">Koble til plattformer</p>
              <p className="text-[10px] text-muted-foreground">LinkedIn, Facebook, Instagram ++</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MarketingDashboardTab;
