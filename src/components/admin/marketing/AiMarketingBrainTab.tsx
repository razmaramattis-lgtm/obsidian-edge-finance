import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import {
  Brain, Lightbulb, TrendingUp, Sparkles, Calendar, Target, Rocket,
  RefreshCw, ChevronRight, FileText, Megaphone, Clock, Zap, BarChart3,
} from "lucide-react";
import { toast } from "sonner";

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

interface StrategyPlan {
  id: string;
  title: string;
  description: string | null;
  start_date: string;
  end_date: string;
  platforms: string[];
  goals: any;
  weekly_posts: any[];
  weekly_campaigns: any[];
  status: string;
  created_at: string;
}

const TYPE_LABELS: Record<string, string> = {
  tone: "Tonalitet", cta: "CTA", hashtag: "Hashtags",
  timing: "Timing", budget: "Budsjett", audience: "Målgruppe",
};

const useElapsedTimer = (active: boolean) => {
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef<number>(0);
  useEffect(() => {
    if (!active) { setElapsed(0); return; }
    startRef.current = Date.now();
    const iv = setInterval(() => setElapsed(Math.floor((Date.now() - startRef.current) / 1000)), 1000);
    return () => clearInterval(iv);
  }, [active]);
  return elapsed;
};

const formatTimer = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s.toString().padStart(2, "0")}s` : `${s}s`;
};

const AiMarketingBrainTab = () => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [plans, setPlans] = useState<StrategyPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPlanner, setShowPlanner] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState("");
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null);
  const [executingAll, setExecutingAll] = useState(false);
  const [executeProgress, setExecuteProgress] = useState({ current: 0, total: 0 });

  const scanElapsed = useElapsedTimer(scanning);
  const strategyElapsed = useElapsedTimer(generating);
  const executeElapsed = useElapsedTimer(executingAll);

  const [planForm, setPlanForm] = useState({
    duration: "3",
    goals: "",
    instructions: "",
    budget: "",
    linkedin: true, facebook: true, instagram: true,
    google_ads: true, meta_ads: true, tiktok: false,
  });

  const fetchData = async () => {
    setLoading(true);
    const [insightsRes, plansRes] = await Promise.all([
      supabase.from("marketing_ai_insights").select("*").eq("active", true).order("confidence", { ascending: false }).limit(50),
      supabase.from("marketing_strategy_plans").select("*").order("created_at", { ascending: false }).limit(10),
    ]);
    setInsights((insightsRes.data as Insight[]) || []);
    setPlans((plansRes.data as StrategyPlan[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleFullScan = async () => {
    setScanning(true);
    setScanProgress("Skanner alle Avargo-sider i bakgrunnen...");
    toast.info("🚀 Full skanning startet. Du kan bytte fane.", { duration: 5000 });
    try {
      const { data, error } = await supabase.functions.invoke("marketing-scan-site", { body: {} });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setScanProgress(`✅ ${data.scanned} av ${data.total} sider skannet!`);
      toast.success(`✅ Skanning ferdig: ${data.scanned} sider analysert`, { duration: 8000 });
    } catch (e: any) {
      toast.error(e.message || "Feil ved skanning");
      setScanProgress("");
    } finally {
      setScanning(false);
    }
  };

  const handleGenerateStrategy = async () => {
    setGenerating(true);
    toast.info("🧠 Genererer strategi...", { duration: 3000 });
    try {
      const platforms = Object.entries(planForm)
        .filter(([k, v]) => v === true && k !== "duration")
        .map(([k]) => k);

      const { data, error } = await supabase.functions.invoke("marketing-plan-strategy", {
        body: {
          duration_months: parseInt(planForm.duration),
          platforms,
          goals: planForm.goals,
          custom_instructions: planForm.instructions,
          budget: planForm.budget || null,
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast.success("✅ Strategi generert!", { duration: 5000 });
      setShowPlanner(false);
      fetchData();
    } catch (e: any) {
      toast.error(e.message || "Feil ved strategigenerering");
    } finally {
      setGenerating(false);
    }
  };

  const handleExecuteWeek = async (plan: StrategyPlan, weekIndex: number) => {
    const week = plan.weekly_posts[weekIndex];
    if (!week?.posts?.length) { toast.error("Ingen innlegg i denne uken"); return; }

    setGenerating(true);
    let success = 0;
    for (const post of week.posts) {
      try {
        const { data, error } = await supabase.functions.invoke("marketing-generate-content", {
          body: {
            platform: post.platform,
            topic: post.topic || post.brief,
            tone: post.tone || "Profesjonell",
            include_image: post.content_type !== "text",
            strategy_plan_id: plan.id,
          },
        });
        if (!error && !data?.error) success++;
      } catch { /* continue */ }
    }
    toast.success(`${success} av ${week.posts.length} innlegg generert!`);
    setGenerating(false);
  };

  // Execute ALL weeks from the strategy plan
  const handleExecuteAllWeeks = async (plan: StrategyPlan) => {
    if (!plan.weekly_posts?.length) { toast.error("Ingen uker i planen"); return; }
    setExecutingAll(true);
    const totalWeeks = plan.weekly_posts.length;
    let totalSuccess = 0;
    let totalPosts = 0;

    for (let wi = 0; wi < totalWeeks; wi++) {
      const week = plan.weekly_posts[wi];
      const posts = week?.posts || [];
      totalPosts += posts.length;
      setExecuteProgress({ current: wi + 1, total: totalWeeks });

      for (const post of posts) {
        try {
          // Calculate scheduled date based on week number and day
          const startDate = new Date(plan.start_date);
          const dayOffset = (wi * 7) + dayNameToOffset(post.day);
          const scheduledDate = new Date(startDate);
          scheduledDate.setDate(scheduledDate.getDate() + dayOffset);
          scheduledDate.setHours(10, 0, 0, 0);

          const { data, error } = await supabase.functions.invoke("marketing-generate-content", {
            body: {
              platform: post.platform,
              topic: post.topic || post.brief,
              tone: post.tone || "Profesjonell",
              include_image: post.content_type !== "text",
              strategy_plan_id: plan.id,
              scheduled_at: scheduledDate.toISOString(),
            },
          });
          if (!error && !data?.error) totalSuccess++;
        } catch { /* continue */ }
      }

      // Small delay between weeks to avoid rate limits
      if (wi < totalWeeks - 1) {
        await new Promise(r => setTimeout(r, 2000));
      }
    }

    toast.success(`🎉 Ferdig! ${totalSuccess} av ${totalPosts} innlegg generert for ${totalWeeks} uker. Alle ligger i godkjenningskøen.`, { duration: 10000 });
    setExecutingAll(false);
    setExecuteProgress({ current: 0, total: 0 });

    // Activate the plan
    await supabase.from("marketing_strategy_plans").update({ status: "active" }).eq("id", plan.id);
    fetchData();
  };

  const handleActivatePlan = async (id: string) => {
    await supabase.from("marketing_strategy_plans").update({ status: "active" }).eq("id", id);
    toast.success("Strategi aktivert!");
    fetchData();
  };

  return (
    <div className="space-y-6">
      {/* Hero */}
      <Card className="p-5 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Brain size={18} className="text-primary" />
              <h3 className="font-heading text-lg">AI Marketing Brain</h3>
              <Badge className="bg-primary/10 text-primary text-[10px]">Super AI</Badge>
            </div>
            <p className="text-xs text-muted-foreground max-w-lg">
              Skanner avargo.no, genererer innhold og bilder, og planlegger strategier med faktisk innleggsgenerering for alle ukene.
            </p>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <Button onClick={handleFullScan} disabled={scanning} variant="outline" className="gap-2">
              {scanning ? <RefreshCw size={14} className="animate-spin" /> : <Rocket size={14} />}
              {scanning ? "Skanner..." : "Skann avargo.no"}
            </Button>
            {scanning && (
              <span className="text-xs font-mono text-primary font-medium flex items-center gap-1.5">
                <Clock size={12} /> {formatTimer(scanElapsed)}
                <span className="text-muted-foreground font-sans">· ~{Math.max(1, Math.ceil((90 - scanElapsed) / 60))} min igjen</span>
              </span>
            )}
            <Button onClick={() => setShowPlanner(!showPlanner)} className="gap-2">
              <Target size={14} /> Lag strategi
            </Button>
          </div>
        </div>
        {scanProgress && !scanning && <p className="text-xs text-primary mt-3 font-medium">{scanProgress}</p>}
        {scanning && (
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs text-primary font-medium">Analyserer innhold med AI...</p>
              <span className="text-[10px] text-muted-foreground">Estimert: ~90 sek</span>
            </div>
            <Progress value={Math.min(95, (scanElapsed / 90) * 100)} className="h-1.5" />
          </div>
        )}
      </Card>

      {/* Executing all weeks progress */}
      {executingAll && (
        <Card className="p-5 border-primary/20 bg-primary/5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RefreshCw size={16} className="text-primary animate-spin" />
              <h3 className="font-heading text-base">Genererer alle innlegg fra strategi...</h3>
            </div>
            <span className="text-sm font-mono text-primary font-semibold flex items-center gap-1.5">
              <Clock size={14} /> {formatTimer(executeElapsed)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Uke {executeProgress.current} av {executeProgress.total} – Innleggene sendes til godkjenningskøen med planlagte datoer.
            {executeProgress.total > 0 && executeProgress.current > 0 && (
              <span className="ml-2 text-primary">
                · Estimert: ~{formatTimer(Math.round((executeElapsed / executeProgress.current) * (executeProgress.total - executeProgress.current)))} igjen
              </span>
            )}
          </p>
          <Progress value={(executeProgress.current / executeProgress.total) * 100} className="h-2" />
        </Card>
      )}

      {/* Strategy Planner Form */}
      {showPlanner && (
        <Card className="p-5 space-y-4 border-primary/20">
          <h3 className="font-heading text-base flex items-center gap-2">
            <Calendar size={16} className="text-primary" /> Strategiplanlegger
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium mb-1 block">Varighet</label>
              <Select value={planForm.duration} onValueChange={(v) => setPlanForm(f => ({ ...f, duration: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 måned</SelectItem>
                  <SelectItem value="2">2 måneder</SelectItem>
                  <SelectItem value="3">3 måneder</SelectItem>
                  <SelectItem value="6">6 måneder</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Mål</label>
              <Input placeholder="F.eks. Generere 100 leads" value={planForm.goals} onChange={(e) => setPlanForm(f => ({ ...f, goals: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Totalbudsjett (NOK)</label>
              <Input type="number" placeholder="F.eks. 50000" value={planForm.budget} onChange={(e) => setPlanForm(f => ({ ...f, budget: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium mb-2 block">Plattformer</label>
            <div className="flex flex-wrap gap-3">
              {[
                { id: "linkedin", label: "LinkedIn" }, { id: "facebook", label: "Facebook" },
                { id: "instagram", label: "Instagram" }, { id: "google_ads", label: "Google Ads" },
                { id: "meta_ads", label: "Meta Ads" }, { id: "tiktok", label: "TikTok" },
              ].map(p => (
                <label key={p.id} className="flex items-center gap-2 text-xs">
                  <Switch checked={(planForm as any)[p.id]} onCheckedChange={(v) => setPlanForm(f => ({ ...f, [p.id]: v }))} />
                  {p.label}
                </label>
              ))}
            </div>
          </div>
          <Textarea placeholder="Ekstra instrukser (valgfritt)..." rows={2} value={planForm.instructions} onChange={(e) => setPlanForm(f => ({ ...f, instructions: e.target.value }))} />
          <div className="flex gap-2 items-center flex-wrap">
            <Button onClick={handleGenerateStrategy} disabled={generating} className="gap-2">
              {generating ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
              {generating ? "Genererer..." : "Generer AI-strategi"}
            </Button>
            {generating && (
              <span className="text-xs font-mono text-primary font-medium flex items-center gap-1.5">
                <Clock size={12} /> {formatTimer(strategyElapsed)}
                <span className="text-muted-foreground font-sans">· ~{Math.max(1, Math.ceil((30 - strategyElapsed) / 60))} min igjen</span>
              </span>
            )}
            <Button onClick={() => setShowPlanner(false)} variant="ghost">Avbryt</Button>
          </div>
        </Card>
      )}

      {/* Strategy Plans */}
      {plans.length > 0 && (
        <div>
          <h3 className="font-heading text-lg mb-3 flex items-center gap-2">
            <Target size={16} className="text-primary" /> Strategiplaner
          </h3>
          <div className="space-y-3">
            {plans.map((plan) => {
              const isExpanded = expandedPlan === plan.id;
              const goals = plan.goals as any;
              return (
                <Card key={plan.id} className={`overflow-hidden transition-all ${isExpanded ? "ring-1 ring-primary/20" : ""}`}>
                  <div className="p-4 cursor-pointer hover:bg-muted/30 transition-colors" onClick={() => setExpandedPlan(isExpanded ? null : plan.id)}>
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-heading">{plan.title}</span>
                          <Badge className={plan.status === "active" ? "bg-green-500/10 text-green-600" : "bg-muted text-muted-foreground"} variant="outline">
                            {plan.status === "active" ? "Aktiv" : plan.status === "draft" ? "Utkast" : plan.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar size={10} /> {new Date(plan.start_date).toLocaleDateString("nb-NO")} – {new Date(plan.end_date).toLocaleDateString("nb-NO")}
                          </span>
                          <span>{plan.platforms.length} plattformer</span>
                          <span>{plan.weekly_posts?.length || 0} uker</span>
                        </div>
                      </div>
                      <ChevronRight size={16} className={`text-muted-foreground transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t p-4 space-y-4 bg-muted/5">
                      {plan.description && <p className="text-sm text-muted-foreground">{plan.description}</p>}

                      {goals?.kpi_targets && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {Object.entries(goals.kpi_targets).map(([k, v]) => (
                            <Card key={k} className="p-3 text-center">
                              <p className="font-heading text-lg">{String(v)}</p>
                              <p className="text-[10px] text-muted-foreground">{k.replace(/_/g, " ")}</p>
                            </Card>
                          ))}
                        </div>
                      )}

                      {goals?.content_pillars && (
                        <div>
                          <h4 className="text-xs font-medium mb-2">Innholdspilarer</h4>
                          <div className="flex gap-2 flex-wrap">
                            {goals.content_pillars.map((p: any, i: number) => (
                              <Badge key={i} variant="outline" className="text-xs">{p.pillar}: {p.frequency}</Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {plan.weekly_posts?.length > 0 && (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-xs font-medium">Ukeplan ({plan.weekly_posts.length} uker)</h4>
                            <Button
                              size="sm"
                              onClick={(e) => { e.stopPropagation(); handleExecuteAllWeeks(plan); }}
                              disabled={generating || executingAll}
                              className="gap-1.5"
                            >
                              <Rocket size={12} />
                              Generer alle {plan.weekly_posts.reduce((s: number, w: any) => s + (w.posts?.length || 0), 0)} innlegg
                            </Button>
                          </div>
                          <div className="space-y-2 max-h-60 overflow-y-auto">
                            {plan.weekly_posts.slice(0, 12).map((week: any, i: number) => (
                              <Card key={i} className="p-3">
                                <div className="flex items-center justify-between gap-2">
                                  <div>
                                    <span className="text-xs font-medium">Uke {week.week || i + 1}: {week.theme}</span>
                                    <div className="flex gap-1 mt-1 flex-wrap">
                                      {(week.posts || []).slice(0, 4).map((post: any, j: number) => (
                                        <Badge key={j} variant="secondary" className="text-[10px]">
                                          {post.platform} · {post.day || post.content_type || "innlegg"}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                  <Button
                                    size="sm" variant="outline"
                                    onClick={(e) => { e.stopPropagation(); handleExecuteWeek(plan, i); }}
                                    disabled={generating || executingAll}
                                    className="text-xs gap-1 shrink-0"
                                  >
                                    <Zap size={12} /> Generer
                                  </Button>
                                </div>
                              </Card>
                            ))}
                          </div>
                        </div>
                      )}

                      {plan.weekly_campaigns?.length > 0 && (
                        <div>
                          <h4 className="text-xs font-medium mb-2">Kampanjer</h4>
                          <div className="space-y-2">
                            {plan.weekly_campaigns.map((c: any, i: number) => (
                              <Card key={i} className="p-3 flex items-center gap-3">
                                <Megaphone size={14} className="text-primary shrink-0" />
                                <div className="flex-1">
                                  <span className="text-xs font-medium">{c.name}</span>
                                  <div className="flex gap-2 text-[10px] text-muted-foreground mt-0.5">
                                    <span>{c.platform}</span>
                                    <span>Uke {c.week_start}–{c.week_end}</span>
                                    <span>{c.budget_suggestion}</span>
                                  </div>
                                </div>
                              </Card>
                            ))}
                          </div>
                        </div>
                      )}

                      {plan.status === "draft" && (
                        <div className="flex gap-2">
                          <Button onClick={() => handleExecuteAllWeeks(plan)} disabled={executingAll} className="gap-2">
                            <Rocket size={14} /> Aktiver & generer alt
                          </Button>
                          <Button onClick={() => handleActivatePlan(plan.id)} variant="outline" className="gap-2">
                            <Zap size={14} /> Bare aktiver
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Capabilities & Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="p-4">
          <h3 className="font-heading text-lg mb-2 flex items-center gap-2">
            <Zap size={16} className="text-primary" /> Kapabiliteter
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Rocket size={12} className="text-green-500" /> Skanner alle 40+ sider på avargo.no</li>
            <li className="flex items-center gap-2"><FileText size={12} className="text-blue-500" /> Genererer skreddersydde innlegg per plattform</li>
            <li className="flex items-center gap-2"><Sparkles size={12} className="text-violet-500" /> AI-genererte bilder med Nano Banana 2</li>
            <li className="flex items-center gap-2"><Target size={12} className="text-amber-500" /> 3-mnd strategiplanlegging med full innholdsgenering</li>
            <li className="flex items-center gap-2"><BarChart3 size={12} className="text-emerald-500" /> Kampanjeoptimalisering for Google/Meta</li>
            <li className="flex items-center gap-2"><Brain size={12} className="text-primary" /> Lærer og optimaliserer over tid</li>
          </ul>
        </Card>
        <Card className="p-4">
          <h3 className="font-heading text-lg mb-2 flex items-center gap-2">
            <Lightbulb size={16} className="text-amber-500" /> Status
          </h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p><strong>Aktive innsikter:</strong> {insights.length}</p>
            <p><strong>Strategiplaner:</strong> {plans.length}</p>
            <p><strong>Data-kilder:</strong> Crawlet innhold, innlegg, kampanjer</p>
          </div>
        </Card>
      </div>

      {/* Active Insights */}
      {loading ? (
        <p className="text-sm text-muted-foreground">Laster...</p>
      ) : insights.length === 0 ? (
        <Card className="p-8 text-center">
          <Brain size={32} className="mx-auto mb-3 text-muted-foreground/30" />
          <p className="text-muted-foreground">Skann avargo.no og generer innlegg for å bygge AI-innsikter.</p>
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

function dayNameToOffset(day: string): number {
  const map: Record<string, number> = {
    mandag: 0, tirsdag: 1, onsdag: 2, torsdag: 3, fredag: 4, lørdag: 5, søndag: 6,
    monday: 0, tuesday: 1, wednesday: 2, thursday: 3, friday: 4, saturday: 5, sunday: 6,
  };
  return map[(day || "").toLowerCase()] ?? 0;
}

export default AiMarketingBrainTab;
