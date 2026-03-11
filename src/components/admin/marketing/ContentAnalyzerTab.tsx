import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Globe, Clock, RefreshCw, Trash2, Sparkles, FileText, Tag, Palette } from "lucide-react";
import { toast } from "sonner";

interface Analysis {
  id: string;
  url: string;
  title: string | null;
  content_summary: string | null;
  keywords: string[] | null;
  tone: string | null;
  themes: string[] | null;
  crawled_at: string;
}

const ContentAnalyzerTab = () => {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [crawlUrl, setCrawlUrl] = useState("https://avargo.no");
  const [crawling, setCrawling] = useState(false);

  const fetchAnalyses = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("marketing_content_analyses")
      .select("*")
      .order("crawled_at", { ascending: false })
      .limit(50);
    setAnalyses((data as Analysis[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchAnalyses(); }, []);

  const handleCrawl = async () => {
    if (!crawlUrl.trim()) return;
    setCrawling(true);
    try {
      const { data, error } = await supabase.functions.invoke("content-analyzer", {
        body: { url: crawlUrl.trim() },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast.success("Analyse fullført!");
      fetchAnalyses();
    } catch (e: any) {
      toast.error(e.message || "Feil ved crawling");
    } finally {
      setCrawling(false);
    }
  };

  const handleDelete = async (id: string) => {
    await supabase.from("marketing_content_analyses").delete().eq("id", id);
    toast.success("Slettet");
    fetchAnalyses();
  };

  const handleCrawlMultiple = async () => {
    setCrawling(true);
    try {
      const { data, error } = await supabase.functions.invoke("marketing-scan-site", {
        body: {},
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast.success(`${data.scanned} av ${data.total} sider analysert med AI!`);
    } catch (e: any) {
      toast.error(e.message || "Feil ved fullstendig skanning");
    } finally {
      setCrawling(false);
      fetchAnalyses();
    }
  };

  return (
    <div className="space-y-6">
      {/* crawl controls */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={16} className="text-primary" />
          <h3 className="font-heading text-sm">AI-drevet innholdsanalyse</h3>
        </div>
        <p className="text-xs text-muted-foreground">
          Analyserer nettsiden din med AI for å identifisere tone, nøkkelord og temaer. Dataen brukes av Post Generator og AI Brain.
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <Input
              value={crawlUrl}
              onChange={(e) => setCrawlUrl(e.target.value)}
              placeholder="https://avargo.no"
            />
          </div>
          <Button onClick={handleCrawl} disabled={crawling}>
            {crawling ? <RefreshCw size={14} className="animate-spin mr-2" /> : <Search size={14} className="mr-2" />}
            Crawl & Analyser
          </Button>
          <Button onClick={handleCrawlMultiple} disabled={crawling} variant="outline">
            <Globe size={14} className="mr-2" />
            Crawl hele avargo.no
          </Button>
        </div>
      </Card>

      {/* stats row */}
      {analyses.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <MiniStat icon={<Globe size={14} className="text-primary" />} label="Sider crawlet" value={analyses.length} />
          <MiniStat icon={<Tag size={14} className="text-primary" />} label="Nøkkelord funnet" value={analyses.reduce((s, a) => s + (a.keywords?.length || 0), 0)} />
          <MiniStat icon={<FileText size={14} className="text-primary" />} label="Temaer" value={new Set(analyses.flatMap((a) => a.themes || [])).size} />
          <MiniStat icon={<Palette size={14} className="text-primary" />} label="Tonefall" value={new Set(analyses.map((a) => a.tone).filter(Boolean)).size} />
        </div>
      )}

      {/* results */}
      {loading ? (
        <p className="text-sm text-muted-foreground">Laster...</p>
      ) : analyses.length === 0 ? (
        <Card className="p-8 text-center">
          <Globe size={32} className="mx-auto mb-3 text-muted-foreground/30" />
          <p className="text-muted-foreground">Ingen analyser enda. Crawl avargo.no for å komme i gang.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {analyses.map((a) => (
            <Card key={a.id} className="p-4 hover:border-primary/20 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Globe size={12} className="text-primary shrink-0" />
                    <a href={a.url} target="_blank" rel="noopener" className="text-sm font-medium truncate hover:text-primary transition-colors">{a.url}</a>
                  </div>
                  {a.title && <p className="text-sm font-heading mb-1">{a.title}</p>}
                  {a.content_summary && (
                    <p className="text-xs text-muted-foreground line-clamp-3 mb-2">{a.content_summary}</p>
                  )}
                  <div className="flex items-center gap-2 flex-wrap">
                    {a.tone && (
                      <Badge className="text-[10px] bg-primary/10 text-primary border-primary/20">
                        <Palette size={8} className="mr-1" /> {a.tone}
                      </Badge>
                    )}
                    {a.themes?.slice(0, 3).map((t) => (
                      <Badge key={t} variant="outline" className="text-[10px]">{t}</Badge>
                    ))}
                    {a.keywords?.slice(0, 4).map((k) => (
                      <Badge key={k} variant="secondary" className="text-[10px]">{k}</Badge>
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground/50 mt-2 flex items-center gap-1">
                    <Clock size={10} /> {new Date(a.crawled_at).toLocaleString("nb-NO")}
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(a.id)} className="shrink-0 text-muted-foreground hover:text-destructive">
                  <Trash2 size={14} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

const MiniStat = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) => (
  <Card className="p-3 text-center">
    <div className="flex justify-center mb-1">{icon}</div>
    <p className="font-heading text-xl">{value}</p>
    <p className="text-[10px] text-muted-foreground">{label}</p>
  </Card>
);

export default ContentAnalyzerTab;
