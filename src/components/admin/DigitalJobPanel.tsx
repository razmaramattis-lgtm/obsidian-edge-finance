import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Video, Clock, DollarSign, Users, Wifi, WifiOff,
  Loader2, Check, X, TrendingUp, BarChart3, Plus, Settings, Key, Eye, EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { nb } from "date-fns/locale";

type Tab = "overview" | "sessions" | "advisors" | "settings";

interface Session {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  description: string | null;
  status: string;
  price_per_minute: number;
  started_at: string | null;
  ended_at: string | null;
  duration_minutes: number | null;
  total_amount: number | null;
  payment_status: string;
  created_at: string;
  category_id: string;
}

interface OnlineStatus {
  id: string;
  profile_id: string;
  category_id: string;
  is_online: boolean;
  price_per_minute: number;
}

interface Category {
  id: string;
  name: string;
}

const DigitalJobPanel = () => {
  const { profile } = useAuth();
  const [tab, setTab] = useState<Tab>("overview");
  const [sessions, setSessions] = useState<Session[]>([]);
  const [onlineStatuses, setOnlineStatuses] = useState<OnlineStatus[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingCategory, setAddingCategory] = useState(false);
  const [selectedCatId, setSelectedCatId] = useState("");
  const [newPrice, setNewPrice] = useState("30");
  const [stripeKey, setStripeKey] = useState("");
  const [stripeKeySaved, setStripeKeySaved] = useState(false);
  const [showStripeKey, setShowStripeKey] = useState(false);
  const [savingStripeKey, setSavingStripeKey] = useState(false);

  useEffect(() => {
    loadAll();
    const ch1 = supabase.channel("dj-sessions").on("postgres_changes", { event: "*", schema: "public", table: "advisory_sessions" }, () => loadSessions()).subscribe();
    const ch2 = supabase.channel("dj-online").on("postgres_changes", { event: "*", schema: "public", table: "advisor_online_status" }, () => loadOnline()).subscribe();
    return () => { supabase.removeChannel(ch1); supabase.removeChannel(ch2); };
  }, []);

  const loadAll = async () => {
    await Promise.all([loadSessions(), loadOnline(), loadCategories(), loadStripeKey()]);
    setLoading(false);
  };

  const loadSessions = async () => {
    const { data } = await supabase.from("advisory_sessions").select("*").order("created_at", { ascending: false }).limit(100);
    if (data) setSessions(data as any);
  };

  const loadOnline = async () => {
    const { data } = await supabase.from("advisor_online_status").select("*");
    if (data) setOnlineStatuses(data as any);
  };

  const loadCategories = async () => {
    const { data } = await supabase.from("advisory_categories").select("id, name").order("sort_order");
    if (data) setCategories(data);
  };

  const loadStripeKey = async () => {
    const { data } = await supabase.from("app_settings" as any).select("value").eq("key", "stripe_secret_key").maybeSingle();
    if (data && (data as any).value) {
      setStripeKey((data as any).value);
      setStripeKeySaved(true);
    }
  };

  const saveStripeKey = async () => {
    if (!stripeKey.startsWith("sk_")) {
      toast.error("Ugyldig Stripe-nøkkel. Må starte med sk_");
      return;
    }
    setSavingStripeKey(true);
    const { error } = await supabase.from("app_settings" as any).upsert(
      { key: "stripe_secret_key", value: stripeKey, updated_at: new Date().toISOString() } as any,
      { onConflict: "key" }
    );
    setSavingStripeKey(false);
    if (error) {
      toast.error("Kunne ikke lagre nøkkelen");
    } else {
      setStripeKeySaved(true);
      toast.success("Stripe API-nøkkel lagret");
    }
  };

  const updateSessionStatus = async (id: string, status: string) => {
    const updates: any = { status };
    if (status === "active") updates.started_at = new Date().toISOString();
    if (status === "completed" || status === "cancelled") updates.ended_at = new Date().toISOString();
    await supabase.from("advisory_sessions").update(updates).eq("id", id);
    toast.success(`Sesjon ${status === "active" ? "startet" : status === "completed" ? "fullført" : "avbrutt"}`);
  };

  const toggleOnline = async (statusId: string, currentlyOnline: boolean) => {
    const { error } = await supabase
      .from("advisor_online_status")
      .update({ is_online: !currentlyOnline, updated_at: new Date().toISOString() } as any)
      .eq("id", statusId);
    if (error) {
      toast.error("Kunne ikke oppdatere status");
    } else {
      toast.success(!currentlyOnline ? "Du er nå online" : "Du er nå offline");
    }
  };

  const registerForCategory = async () => {
    if (!profile?.id || !selectedCatId) return;
    const price = parseFloat(newPrice);
    if (isNaN(price) || price <= 0) { toast.error("Ugyldig pris"); return; }

    const { error } = await supabase.from("advisor_online_status").insert({
      profile_id: profile.id,
      category_id: selectedCatId,
      is_online: false,
      price_per_minute: price,
    } as any);

    if (error) {
      if (error.code === "23505") toast.error("Du er allerede registrert for denne kategorien");
      else toast.error("Kunne ikke registrere");
    } else {
      toast.success("Registrert for kategori");
      setAddingCategory(false);
      setSelectedCatId("");
      setNewPrice("30");
    }
  };

  const updatePrice = async (statusId: string, price: string) => {
    const p = parseFloat(price);
    if (isNaN(p) || p <= 0) return;
    await supabase.from("advisor_online_status").update({ price_per_minute: p } as any).eq("id", statusId);
    toast.success("Pris oppdatert");
  };

  const catName = (id: string) => categories.find((c) => c.id === id)?.name || "Ukjent";

  const myStatuses = onlineStatuses.filter((o) => o.profile_id === profile?.id);
  const pendingSessions = sessions.filter((s) => s.status === "pending");
  const activeSessions = sessions.filter((s) => s.status === "active");
  const completedSessions = sessions.filter((s) => s.status === "completed");
  const totalRevenue = completedSessions.reduce((sum, s) => sum + (s.total_amount || 0), 0);
  const totalMinutes = completedSessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0);
  const onlineCount = new Set(onlineStatuses.filter((o) => o.is_online).map((o) => o.profile_id)).size;

  const myCatsIds = new Set(myStatuses.map((s) => s.category_id));
  const availableCategories = categories.filter((c) => !myCatsIds.has(c.id));

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "overview", label: "Oversikt", icon: BarChart3 },
    { id: "sessions", label: "Sesjoner", icon: Video },
    { id: "advisors", label: "Rådgivere", icon: Users },
    { id: "settings", label: "Innstillinger", icon: Settings },
  ];

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 size={20} className="animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-xl">Digital jobb</h2>
          <p className="text-xs text-muted-foreground">Hurtigrådgivning, videosamtaler og inntektssporing</p>
        </div>
        <div className="flex items-center gap-2">
          {onlineCount > 0 ? (
            <Badge variant="outline" className="text-green-600 border-green-500/30 bg-green-500/10">
              <Wifi size={10} className="mr-1" /> {onlineCount} online
            </Badge>
          ) : (
            <Badge variant="outline" className="text-muted-foreground">
              <WifiOff size={10} className="mr-1" /> Ingen online
            </Badge>
          )}
        </div>
      </div>

      {/* My status card */}
      <Card className="p-4 border-primary/20 bg-primary/5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-heading flex items-center gap-2">
            <Wifi size={14} className="text-primary" /> Min tilgjengelighet
          </h3>
          {availableCategories.length > 0 && (
            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setAddingCategory(!addingCategory)}>
              <Plus size={12} className="mr-1" /> Legg til kategori
            </Button>
          )}
        </div>

        {myStatuses.length === 0 && !addingCategory ? (
          <div className="text-center py-6">
            <p className="text-xs text-muted-foreground mb-2">Du er ikke registrert for noen kategorier ennå</p>
            {availableCategories.length > 0 && (
              <Button variant="outline" size="sm" className="text-xs" onClick={() => setAddingCategory(true)}>
                <Plus size={12} className="mr-1" /> Registrer deg
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {myStatuses.map((s) => (
              <div key={s.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-background">
                <div className="flex items-center gap-3 min-w-0">
                  <Switch checked={s.is_online} onCheckedChange={() => toggleOnline(s.id, s.is_online)} />
                  <div className="min-w-0">
                    <p className="text-xs font-medium">{catName(s.category_id)}</p>
                    <p className={`text-[10px] font-medium ${s.is_online ? "text-green-600" : "text-muted-foreground"}`}>
                      {s.is_online ? "Online — mottar kunder" : "Offline"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Input
                    type="number"
                    defaultValue={s.price_per_minute}
                    className="w-20 h-7 text-xs text-right"
                    min={1}
                    onBlur={(e) => updatePrice(s.id, e.target.value)}
                  />
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">kr/min</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {addingCategory && (
          <div className="mt-3 p-3 rounded-xl bg-background border border-border space-y-3">
            <div className="space-y-1.5">
              <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Kategori</label>
              <select
                value={selectedCatId}
                onChange={(e) => setSelectedCatId(e.target.value)}
                className="w-full h-8 text-xs rounded-lg border border-input bg-background px-3"
              >
                <option value="">Velg kategori...</option>
                {availableCategories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Pris per minutt (kr)</label>
              <Input type="number" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} className="h-8 text-xs" min={1} />
            </div>
            <div className="flex gap-2">
              <Button size="sm" className="h-7 text-xs flex-1" onClick={registerForCategory} disabled={!selectedCatId}>
                Registrer
              </Button>
              <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setAddingCategory(false)}>
                Avbryt
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted/30 rounded-xl p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium transition-all ${
              tab === t.id ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === "overview" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Ventende", value: pendingSessions.length, icon: Clock, accent: "text-amber-500" },
              { label: "Aktive nå", value: activeSessions.length, icon: Video, accent: "text-green-500" },
              { label: "Fullførte", value: completedSessions.length, icon: Check, accent: "text-primary" },
              { label: "Total omsetning", value: `${totalRevenue.toLocaleString("nb-NO")} kr`, icon: DollarSign, accent: "text-emerald-500" },
            ].map((s) => (
              <Card key={s.label} className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <s.icon size={14} className={s.accent} />
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.label}</span>
                </div>
                <p className="font-heading text-2xl">{s.value}</p>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={14} className="text-primary" />
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Totalt minutter</span>
              </div>
              <p className="font-heading text-2xl">{Math.round(totalMinutes)}</p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users size={14} className="text-primary" />
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Rådgivere online</span>
              </div>
              <p className="font-heading text-2xl">{onlineCount} / {onlineStatuses.length}</p>
            </Card>
          </div>

          {pendingSessions.length > 0 && (
            <Card className="p-4 border-amber-500/20">
              <h3 className="text-sm font-heading mb-3 flex items-center gap-2">
                <Clock size={14} className="text-amber-500" /> Ventende forespørsler
              </h3>
              <div className="space-y-2">
                {pendingSessions.slice(0, 5).map((s) => (
                  <div key={s.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-muted/20">
                    <div className="min-w-0">
                      <p className="text-xs font-medium truncate">{s.customer_name}</p>
                      <p className="text-[10px] text-muted-foreground">{catName(s.category_id)} · {s.price_per_minute} kr/min</p>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      <button onClick={() => updateSessionStatus(s.id, "active")} className="p-1.5 rounded-lg bg-green-500/10 text-green-600 hover:bg-green-500/20 transition-colors">
                        <Check size={12} />
                      </button>
                      <button onClick={() => updateSessionStatus(s.id, "cancelled")} className="p-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors">
                        <X size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Sessions */}
      {tab === "sessions" && (
        <div className="space-y-2">
          {sessions.length === 0 ? (
            <div className="text-center py-16"><Video size={32} className="mx-auto text-muted-foreground/30 mb-3" /><p className="text-sm text-muted-foreground">Ingen sesjoner ennå</p></div>
          ) : sessions.map((s) => (
            <Card key={s.id} className="p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium truncate">{s.customer_name}</p>
                    <Badge variant="outline" className={`text-[10px] ${
                      s.status === "pending" ? "text-amber-600 border-amber-500/30" :
                      s.status === "active" ? "text-green-600 border-green-500/30" :
                      s.status === "completed" ? "text-primary border-primary/30" :
                      "text-muted-foreground"
                    }`}>
                      {s.status === "pending" ? "Venter" : s.status === "active" ? "Aktiv" : s.status === "completed" ? "Fullført" : "Avbrutt"}
                    </Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    {catName(s.category_id)} · {s.customer_email}
                    {s.duration_minutes ? ` · ${Math.round(s.duration_minutes)} min` : ""}
                    {s.total_amount ? ` · ${s.total_amount} kr` : ""}
                  </p>
                  {s.description && <p className="text-[10px] text-foreground/50 mt-1 line-clamp-1">{s.description}</p>}
                  <p className="text-[10px] text-muted-foreground/50 mt-1">{format(new Date(s.created_at), "d. MMM yyyy HH:mm", { locale: nb })}</p>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  {s.status === "pending" && (
                    <>
                      <button onClick={() => updateSessionStatus(s.id, "active")} className="p-1.5 rounded-lg bg-green-500/10 text-green-600 hover:bg-green-500/20"><Check size={12} /></button>
                      <button onClick={() => updateSessionStatus(s.id, "cancelled")} className="p-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20"><X size={12} /></button>
                    </>
                  )}
                  {s.status === "active" && (
                    <button onClick={() => updateSessionStatus(s.id, "completed")} className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-[11px] font-medium hover:bg-primary/20">Avslutt</button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Advisors */}
      {tab === "advisors" && (
        <div className="space-y-2">
          {onlineStatuses.length === 0 ? (
            <div className="text-center py-16"><Users size={32} className="mx-auto text-muted-foreground/30 mb-3" /><p className="text-sm text-muted-foreground">Ingen rådgivere registrert for hurtigrådgivning</p></div>
          ) : onlineStatuses.map((o) => (
            <Card key={o.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${o.is_online ? "bg-green-500 animate-pulse" : "bg-muted-foreground/30"}`} />
                  <div>
                    <p className="text-xs font-medium">{catName(o.category_id)}</p>
                    <p className="text-[10px] text-muted-foreground">{o.price_per_minute} kr/min · {o.is_online ? "Online" : "Offline"}</p>
                  </div>
                </div>
                {o.profile_id === profile?.id && (
                  <Switch checked={o.is_online} onCheckedChange={() => toggleOnline(o.id, o.is_online)} />
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DigitalJobPanel;
