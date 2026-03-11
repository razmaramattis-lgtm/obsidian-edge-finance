import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Globe, Clock, RefreshCw, Trash2 } from "lucide-react";
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
      // For now, create a placeholder entry — real crawling will use Firecrawl + AI later
      const { error } = await supabase.from("marketing_content_analyses").insert({
        url: crawlUrl.trim(),
        title: "Venter på analyse...",
        content_summary: "Crawling er planlagt. Koble til Content Analyzer-backend for automatisk analyse.",
        keywords: [],
        themes: [],
        tone: "Ikke analysert enda",
      });
      if (error) throw error;
      toast.success("Oppføring opprettet — klar for crawling");
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

  return (
    <div className="space-y-6">
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
      </div>

      <p className="text-xs text-muted-foreground">
        Content Analyzer crawler nettsiden din, analyserer tone, nøkkelbudskap og temaer. Dataen brukes av Post Generator og AI Brain.
      </p>

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
            <Card key={a.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Globe size={12} className="text-primary shrink-0" />
                    <a href={a.url} target="_blank" rel="noopener" className="text-sm font-medium truncate hover:text-primary transition-colors">{a.url}</a>
                  </div>
                  {a.title && <p className="text-sm font-medium mb-1">{a.title}</p>}
                  {a.content_summary && <p className="text-xs text-muted-foreground line-clamp-2">{a.content_summary}</p>}
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {a.tone && <Badge variant="outline" className="text-[10px]">{a.tone}</Badge>}
                    {a.keywords?.slice(0, 5).map((k) => (
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

export default ContentAnalyzerTab;
