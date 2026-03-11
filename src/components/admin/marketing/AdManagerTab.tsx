import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Megaphone, Plus, Trash2, TrendingUp, MousePointer, DollarSign, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface Campaign {
  id: string;
  name: string;
  platform: string;
  status: string;
  budget: number | null;
  headline: string | null;
  description: string | null;
  cta: string | null;
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  ctr: number;
  cpc: number;
  start_date: string | null;
  end_date: string | null;
}

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  active: "bg-green-500/10 text-green-600",
  paused: "bg-amber-500/10 text-amber-600",
  completed: "bg-blue-500/10 text-blue-600",
};

const AdManagerTab = () => {
  const { profile } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", platform: "google_ads", headline: "", description: "", cta: "", budget: "" });

  const fetchCampaigns = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("marketing_campaigns")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    setCampaigns((data as Campaign[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchCampaigns(); }, []);

  const handleCreate = async () => {
    if (!form.name.trim()) { toast.error("Navn er påkrevd"); return; }
    const { error } = await supabase.from("marketing_campaigns").insert({
      name: form.name.trim(),
      platform: form.platform,
      headline: form.headline || null,
      description: form.description || null,
      cta: form.cta || null,
      budget: form.budget ? parseFloat(form.budget) : null,
      created_by: profile?.id,
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Kampanje opprettet");
    setForm({ name: "", platform: "google_ads", headline: "", description: "", cta: "", budget: "" });
    setShowForm(false);
    fetchCampaigns();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("marketing_campaigns").delete().eq("id", id);
    toast.success("Slettet");
    fetchCampaigns();
  };

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-amber-500/5 border-amber-500/20">
        <div className="flex items-center gap-2 text-amber-600 text-sm">
          <AlertTriangle size={14} />
          <span>Google Ads og Meta Ads API er ikke koblet til. Kampanjer kan opprettes, men ikke publiseres automatisk enda.</span>
        </div>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">Opprett og administrer kampanjer for Google Ads og Meta Ads.</p>
        <Button onClick={() => setShowForm(!showForm)} size="sm">
          <Plus size={14} className="mr-2" /> Ny kampanje
        </Button>
      </div>

      {showForm && (
        <Card className="p-4 space-y-3">
          <Input placeholder="Kampanjenavn" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} />
          <Select value={form.platform} onValueChange={(v) => setForm(f => ({ ...f, platform: v }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="google_ads">Google Ads</SelectItem>
              <SelectItem value="meta_ads">Meta Ads</SelectItem>
            </SelectContent>
          </Select>
          <Input placeholder="Overskrift" value={form.headline} onChange={(e) => setForm(f => ({ ...f, headline: e.target.value }))} />
          <Textarea placeholder="Beskrivelse" rows={3} value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} />
          <Input placeholder="CTA" value={form.cta} onChange={(e) => setForm(f => ({ ...f, cta: e.target.value }))} />
          <Input placeholder="Budsjett (NOK)" type="number" value={form.budget} onChange={(e) => setForm(f => ({ ...f, budget: e.target.value }))} />
          <div className="flex gap-2">
            <Button onClick={handleCreate} size="sm">Opprett</Button>
            <Button onClick={() => setShowForm(false)} variant="ghost" size="sm">Avbryt</Button>
          </div>
        </Card>
      )}

      {loading ? (
        <p className="text-sm text-muted-foreground">Laster...</p>
      ) : campaigns.length === 0 ? (
        <Card className="p-8 text-center">
          <Megaphone size={32} className="mx-auto mb-3 text-muted-foreground/30" />
          <p className="text-muted-foreground">Ingen kampanjer enda.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {campaigns.map((c) => (
            <Card key={c.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">{c.name}</span>
                    <Badge variant="outline" className="text-[10px]">{c.platform === "google_ads" ? "Google Ads" : "Meta Ads"}</Badge>
                    <Badge className={`text-[10px] ${STATUS_COLORS[c.status] || ""}`}>{c.status}</Badge>
                  </div>
                  {c.headline && <p className="text-xs text-muted-foreground mb-1">{c.headline}</p>}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                    <span className="flex items-center gap-1"><TrendingUp size={10} /> {c.impressions} visninger</span>
                    <span className="flex items-center gap-1"><MousePointer size={10} /> {c.clicks} klikk</span>
                    <span className="flex items-center gap-1"><DollarSign size={10} /> {c.spend} kr brukt</span>
                    {c.budget && <span>Budsjett: {c.budget} kr</span>}
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(c.id)} className="text-muted-foreground hover:text-destructive">
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

export default AdManagerTab;
