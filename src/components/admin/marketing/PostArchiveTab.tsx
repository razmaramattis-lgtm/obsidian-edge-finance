import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Linkedin, Facebook, Instagram, Megaphone, FolderOpen, Clock,
  RefreshCw, Eye, CalendarDays, AlertCircle, Sparkles, Search,
} from "lucide-react";
import { toast } from "sonner";
import { format, differenceInDays, addDays } from "date-fns";
import { nb } from "date-fns/locale";
import PostPreviewDialog from "./PostPreviewDialog";

interface Post {
  id: string;
  title: string;
  platform: string;
  content: string;
  hashtags: string[] | null;
  status: string;
  created_at: string;
  ai_generated: boolean | null;
  image_url: string | null;
  image_prompt: string | null;
  scheduled_at: string | null;
  repost_at: string | null;
  repost_interval_days: number | null;
  last_reposted_at: string | null;
  repost_count: number | null;
}

const PLATFORM_ICONS: Record<string, React.ElementType> = {
  linkedin: Linkedin, facebook: Facebook, instagram: Instagram,
  google_ads: Megaphone, meta_ads: Megaphone, tiktok: Megaphone,
};

const PLATFORM_LABELS: Record<string, string> = {
  linkedin: "LinkedIn", facebook: "Facebook", instagram: "Instagram",
  google_ads: "Google Ads", meta_ads: "Meta Ads", tiktok: "TikTok",
};

const PLATFORM_COLORS: Record<string, string> = {
  linkedin: "border-blue-500/30 bg-blue-500/5",
  facebook: "border-indigo-500/30 bg-indigo-500/5",
  instagram: "border-pink-500/30 bg-pink-500/5",
  google_ads: "border-amber-500/30 bg-amber-500/5",
  meta_ads: "border-cyan-500/30 bg-cyan-500/5",
  tiktok: "border-fuchsia-500/30 bg-fuchsia-500/5",
};

const PostArchiveTab = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterPlatform, setFilterPlatform] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [previewPost, setPreviewPost] = useState<Post | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("marketing_posts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    setPosts((data as Post[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  // Group posts by platform, then by month
  const grouped = useMemo(() => {
    let filtered = posts;
    if (filterPlatform !== "all") filtered = filtered.filter(p => p.platform === filterPlatform);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p => p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q));
    }

    const byPlatform: Record<string, Record<string, Post[]>> = {};
    for (const p of filtered) {
      if (!byPlatform[p.platform]) byPlatform[p.platform] = {};
      const monthKey = format(new Date(p.created_at), "yyyy-MM");
      if (!byPlatform[p.platform][monthKey]) byPlatform[p.platform][monthKey] = [];
      byPlatform[p.platform][monthKey].push(p);
    }
    return byPlatform;
  }, [posts, filterPlatform, searchQuery]);

  // Posts due for repost
  const repostDue = useMemo(() => {
    const now = new Date();
    return posts.filter(p => {
      if (p.status !== "published") return false;
      const interval = p.repost_interval_days || 60;
      const lastDate = p.last_reposted_at ? new Date(p.last_reposted_at) : new Date(p.created_at);
      return differenceInDays(now, lastDate) >= interval;
    });
  }, [posts]);

  const handleSetRepostInterval = async (id: string, days: number) => {
    const now = new Date();
    await supabase.from("marketing_posts").update({
      repost_interval_days: days,
      repost_at: addDays(now, days).toISOString(),
    }).eq("id", id);
    toast.success(`Påminnelse satt til ${days} dager`);
    fetchPosts();
  };

  const handleMarkReposted = async (id: string) => {
    const post = posts.find(p => p.id === id);
    const interval = post?.repost_interval_days || 60;
    const now = new Date();
    await supabase.from("marketing_posts").update({
      last_reposted_at: now.toISOString(),
      repost_at: addDays(now, interval).toISOString(),
      repost_count: (post?.repost_count || 0) + 1,
    }).eq("id", id);
    toast.success("Markert som gjenpublisert!");
    fetchPosts();
  };

  const platformOrder = ["linkedin", "facebook", "instagram", "tiktok", "google_ads", "meta_ads"];
  const sortedPlatforms = Object.keys(grouped).sort((a, b) => platformOrder.indexOf(a) - platformOrder.indexOf(b));
  const totalPosts = Object.values(grouped).reduce((sum, months) => sum + Object.values(months).reduce((s, arr) => s + arr.length, 0), 0);

  return (
    <div className="space-y-6">
      {/* Repost reminders */}
      {repostDue.length > 0 && (
        <Card className="p-4 border-amber-500/30 bg-amber-500/5">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle size={16} className="text-amber-600" />
            <h3 className="text-sm font-heading text-amber-700">{repostDue.length} innlegg klare for gjenpublisering</h3>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {repostDue.map(p => {
              const Icon = PLATFORM_ICONS[p.platform] || Megaphone;
              const lastDate = p.last_reposted_at || p.created_at;
              const daysSince = differenceInDays(new Date(), new Date(lastDate));
              return (
                <div key={p.id} className="flex items-center gap-3 bg-background/50 rounded-lg p-2">
                  <Icon size={14} className="text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{p.title}</p>
                    <p className="text-[10px] text-muted-foreground">{PLATFORM_LABELS[p.platform]} · {daysSince} dager siden sist · Gjenpublisert {p.repost_count || 0}x</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button size="sm" variant="outline" className="text-[10px] h-7" onClick={() => setPreviewPost(p)}>
                      <Eye size={10} className="mr-1" /> Vis
                    </Button>
                    <Button size="sm" className="text-[10px] h-7" onClick={() => handleMarkReposted(p.id)}>
                      <RefreshCw size={10} className="mr-1" /> Gjenpublisert
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <FolderOpen size={16} className="text-primary" />
          <h3 className="font-heading text-sm">Innleggsarkiv</h3>
          <Badge variant="outline" className="text-[10px]">{totalPosts} innlegg</Badge>
        </div>
        <div className="flex-1" />
        <div className="relative w-48">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Søk..."
            className="h-8 text-xs pl-7"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={filterPlatform} onValueChange={setFilterPlatform}>
          <SelectTrigger className="w-36 h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle plattformer</SelectItem>
            {Object.entries(PLATFORM_LABELS).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Platform folders */}
      {loading ? (
        <p className="text-sm text-muted-foreground">Laster arkiv...</p>
      ) : sortedPlatforms.length === 0 ? (
        <Card className="p-8 text-center">
          <FolderOpen size={32} className="mx-auto mb-3 text-muted-foreground/30" />
          <p className="text-muted-foreground text-sm">Ingen innlegg i arkivet enda.</p>
        </Card>
      ) : (
        <div className="space-y-6">
          {sortedPlatforms.map(platform => {
            const Icon = PLATFORM_ICONS[platform] || Megaphone;
            const months = grouped[platform];
            const monthKeys = Object.keys(months).sort((a, b) => b.localeCompare(a));
            const totalInPlatform = monthKeys.reduce((s, k) => s + months[k].length, 0);

            return (
              <Card key={platform} className={`p-4 ${PLATFORM_COLORS[platform] || ""}`}>
                <div className="flex items-center gap-2 mb-4">
                  <Icon size={18} className="text-primary" />
                  <h3 className="font-heading text-base">{PLATFORM_LABELS[platform]}</h3>
                  <Badge variant="outline" className="text-[10px]">{totalInPlatform} innlegg</Badge>
                </div>

                <div className="space-y-4">
                  {monthKeys.map(monthKey => {
                    const monthPosts = months[monthKey];
                    const monthLabel = format(new Date(monthKey + "-01"), "MMMM yyyy", { locale: nb });

                    return (
                      <div key={monthKey}>
                        <div className="flex items-center gap-2 mb-2">
                          <CalendarDays size={12} className="text-muted-foreground" />
                          <span className="text-xs font-medium capitalize">{monthLabel}</span>
                          <span className="text-[10px] text-muted-foreground">({monthPosts.length})</span>
                        </div>
                        <div className="grid gap-2 pl-5">
                          {monthPosts.map(p => {
                            const daysSinceCreated = differenceInDays(new Date(), new Date(p.created_at));
                            const interval = p.repost_interval_days || 60;
                            const lastDate = p.last_reposted_at || p.created_at;
                            const daysUntilRepost = interval - differenceInDays(new Date(), new Date(lastDate));
                            const isRepostDue = daysUntilRepost <= 0 && p.status === "published";

                            return (
                              <div key={p.id} className={`flex items-center gap-3 bg-background/60 rounded-lg p-2.5 border ${isRepostDue ? "border-amber-500/40" : "border-transparent"}`}>
                                {p.image_url && (
                                  <div className="w-10 h-10 rounded overflow-hidden shrink-0 bg-muted">
                                    <img src={p.image_url} alt="" className="w-full h-full object-cover" />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5 mb-0.5">
                                    <span className="text-xs font-medium truncate">{p.title}</span>
                                    {p.ai_generated && <Sparkles size={10} className="text-primary shrink-0" />}
                                  </div>
                                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                    <span>{format(new Date(p.created_at), "d. MMM yyyy", { locale: nb })}</span>
                                    <Badge className={`text-[9px] px-1 py-0 ${p.status === "published" ? "bg-green-500/10 text-green-600" : "bg-muted text-muted-foreground"}`}>{p.status}</Badge>
                                    {p.status === "published" && (
                                      <span className={`flex items-center gap-0.5 ${isRepostDue ? "text-amber-600 font-medium" : ""}`}>
                                        <Clock size={9} />
                                        {isRepostDue ? "Klar for repost!" : `Repost om ${daysUntilRepost}d`}
                                      </span>
                                    )}
                                    {(p.repost_count || 0) > 0 && (
                                      <span>Gjenpublisert {p.repost_count}x</span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-1 shrink-0">
                                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setPreviewPost(p)} title="Forhåndsvis">
                                    <Eye size={12} />
                                  </Button>
                                  {p.status === "published" && (
                                    <>
                                      <Select
                                        value={String(p.repost_interval_days || 60)}
                                        onValueChange={(v) => handleSetRepostInterval(p.id, parseInt(v))}
                                      >
                                        <SelectTrigger className="h-7 w-16 text-[10px]">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="30">30d</SelectItem>
                                          <SelectItem value="60">60d</SelectItem>
                                          <SelectItem value="90">90d</SelectItem>
                                        </SelectContent>
                                      </Select>
                                      {isRepostDue && (
                                        <Button size="sm" className="h-7 text-[10px]" onClick={() => handleMarkReposted(p.id)}>
                                          <RefreshCw size={10} className="mr-1" /> Repost
                                        </Button>
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <PostPreviewDialog post={previewPost} open={!!previewPost} onOpenChange={(o) => !o && setPreviewPost(null)} />
    </div>
  );
};

export default PostArchiveTab;
