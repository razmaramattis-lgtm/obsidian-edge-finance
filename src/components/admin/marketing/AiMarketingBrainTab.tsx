import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Lightbulb, TrendingUp, AlertTriangle } from "lucide-react";

interface Insight {
  id: string;
  insight_type: string;
  platform: string | null;
  recommendation: string;
  confidence: number;
  based_on_posts: number;
  active: boolean;
  created_at: string;
}

const TYPE_LABELS: Record<string, string> = {
  tone: "Tonalitet",
  cta: "CTA",
  hashtag: "Hashtags",
  timing: "Timing",
  budget: "Budsjett",
  audience: "Målgruppe",
};

const AiMarketingBrainTab = () => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("marketing_ai_insights")
        .select("*")
        .eq("active", true)
        .order("confidence", { ascending: false })
        .limit(50);
      setInsights((data as Insight[]) || []);
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-primary/5 border-primary/20">
        <div className="flex items-center gap-2 text-sm">
          <Brain size={14} className="text-primary" />
          <span>AI Marketing Brain lærer fra alle publiserte innlegg og kampanjer. Jo mer data, jo bedre anbefalinger.</span>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="p-4">
          <h3 className="font-heading text-lg mb-2 flex items-center gap-2">
            <TrendingUp size={16} className="text-primary" /> Kapabiliteter
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Analyserer hva som gir best engasjement per kanal</li>
            <li>• Foreslår optimal posting-tid</li>
            <li>• Optimaliserer tonalitet og CTA</li>
            <li>• Identifiserer beste hashtags</li>
            <li>• Foreslår budsjett-allokering for annonser</li>
            <li>• Genererer 30-60 dagers innholdsplan</li>
          </ul>
        </Card>

        <Card className="p-4">
          <h3 className="font-heading text-lg mb-2 flex items-center gap-2">
            <Lightbulb size={16} className="text-amber-500" /> Status
          </h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p><strong>Aktive innsikter:</strong> {insights.length}</p>
            <p><strong>Data-kilder:</strong> Innlegg, kampanjer, performance-data</p>
            <p className="text-xs mt-3 text-amber-600">
              AI Brain aktiveres automatisk når det finnes nok data fra publiserte innlegg og kampanjer.
            </p>
          </div>
        </Card>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Laster...</p>
      ) : insights.length === 0 ? (
        <Card className="p-8 text-center">
          <Brain size={32} className="mx-auto mb-3 text-muted-foreground/30" />
          <p className="text-muted-foreground">Ingen AI-innsikter enda. Publiser innlegg og kjør kampanjer for å bygge opp data.</p>
        </Card>
      ) : (
        <div>
          <h3 className="font-heading text-lg mb-3">Aktive innsikter</h3>
          <div className="space-y-3">
            {insights.map((i) => (
              <Card key={i.id} className="p-4">
                <div className="flex items-start gap-3">
                  <Lightbulb size={16} className="text-amber-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-[10px]">{TYPE_LABELS[i.insight_type] || i.insight_type}</Badge>
                      {i.platform && <Badge variant="secondary" className="text-[10px]">{i.platform}</Badge>}
                      <span className="text-[10px] text-muted-foreground">Konfidens: {Math.round((i.confidence || 0) * 100)}%</span>
                    </div>
                    <p className="text-sm">{i.recommendation}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">Basert på {i.based_on_posts} innlegg</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AiMarketingBrainTab;
