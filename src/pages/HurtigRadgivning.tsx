import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import AnimatedSection from "@/components/AnimatedSection";
import AdvisoryVideoCall from "@/components/AdvisoryVideoCall";
import {
  Video, Wifi, WifiOff, Loader2, ArrowRight, Zap, ChevronRight,
  Clock, Shield, Users, Calculator, PiggyBank, Landmark, Megaphone, Code,
  Briefcase, ArrowLeft,
} from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  Calculator, PiggyBank, Users, Landmark, Megaphone, Code, Briefcase,
};

interface Category {
  id: string;
  name: string;
  description: string | null;
  icon: string;
}

interface OnlineAdvisor {
  profile_id: string;
  category_id: string;
  is_online: boolean;
  price_per_minute: number;
}

const HurtigRadgivning = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [onlineAdvisors, setOnlineAdvisors] = useState<OnlineAdvisor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [step, setStep] = useState<"category" | "info" | "waiting">("category");
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [showVideoCall, setShowVideoCall] = useState(false);

  // Form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    loadData();
    const channel = supabase
      .channel("advisor-online-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "advisor_online_status" }, () => loadOnline())
      .subscribe();
    return () => { channel.unsubscribe(); };
  }, []);

  useEffect(() => {
    if (categories.length === 0) return;
    const interval = setInterval(() => setHighlightIndex((prev) => (prev + 1) % categories.length), 2500);
    return () => clearInterval(interval);
  }, [categories.length]);

  const loadData = async () => {
    const [{ data: cats }, { data: online }] = await Promise.all([
      supabase.from("advisory_categories").select("id, name, description, icon").order("sort_order"),
      supabase.from("advisor_online_status").select("profile_id, category_id, is_online, price_per_minute").eq("is_online", true),
    ]);
    if (cats) setCategories(cats);
    if (online) setOnlineAdvisors(online);
    setLoading(false);
  };

  const loadOnline = async () => {
    const { data } = await supabase.from("advisor_online_status").select("profile_id, category_id, is_online, price_per_minute").eq("is_online", true);
    if (data) setOnlineAdvisors(data);
  };

  const getOnlineCount = (catId: string) => onlineAdvisors.filter((a) => a.category_id === catId).length;
  const getMinPrice = (catId: string) => {
    const advisors = onlineAdvisors.filter((a) => a.category_id === catId);
    if (advisors.length === 0) return null;
    return Math.min(...advisors.map((a) => a.price_per_minute));
  };

  const selectedCatName = categories.find((c) => c.id === selectedCategory)?.name || "";
  const minPriceForSelected = selectedCategory ? getMinPrice(selectedCategory) : null;

  const requestSession = async () => {
    if (!name || !email || !description.trim()) {
      toast.error("Fyll ut navn, e-post og beskrivelse");
      return;
    }
    setRequesting(true);

    const { data, error } = await supabase
      .from("advisory_sessions")
      .insert({
        customer_name: name,
        customer_email: email,
        customer_phone: phone || null,
        category_id: selectedCategory,
        description: description.trim(),
        status: "pending",
        price_per_minute: minPriceForSelected || 30,
      } as any)
      .select("id")
      .single();

    if (error) {
      toast.error("Kunne ikke sende forespørsel");
      setRequesting(false);
      return;
    }

    setStep("waiting");
    setActiveSessionId(data.id);

    // Listen for acceptance
    const channel = supabase
      .channel(`advisory-session-${data.id}`)
      .on("postgres_changes", {
        event: "UPDATE", schema: "public", table: "advisory_sessions", filter: `id=eq.${data.id}`,
      }, (payload: any) => {
        const updated = payload.new;
        if (updated.status === "active") {
          toast.success("En rådgiver er klar! Videosamtalen starter nå.");
          setShowVideoCall(true);
          channel.unsubscribe();
        } else if (updated.status === "cancelled") {
          toast.error("Ingen tilgjengelige rådgivere akkurat nå. Prøv igjen senere.");
          setStep("category");
          setRequesting(false);
          setActiveSessionId(null);
          channel.unsubscribe();
        }
      })
      .subscribe();

    // 15 min timeout
    setTimeout(() => {
      supabase.from("advisory_sessions").update({ status: "cancelled" } as any).eq("id", data.id).eq("status", "pending");
      toast.error("Forespørselen ble tidsavbrutt");
      setStep("category");
      setRequesting(false);
      setActiveSessionId(null);
      channel.unsubscribe();
    }, 15 * 60 * 1000);
  };

  const handleVideoCallEnd = () => {
    setShowVideoCall(false);
    setActiveSessionId(null);
    setStep("category");
    setRequesting(false);
    toast("Samtalen er avsluttet");
  };

  return (
    <>
      {/* Video Call Overlay */}
      {showVideoCall && activeSessionId && (
        <AdvisoryVideoCall
          sessionId={activeSessionId}
          categoryName={selectedCatName}
          pricePerMinute={minPriceForSelected || 30}
          onEnd={handleVideoCallEnd}
        />
      )}

      <Helmet>
        <title>Hurtig rådgivning | Avargo</title>
        <meta name="description" content="Få profesjonell rådgivning via video med en av våre eksperter. Betal kun for minuttene du bruker." />
      </Helmet>

      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 ambient-glow opacity-60" />
        <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
          <AnimatedSection>
            <div className="inline-flex p-3 bg-primary/10 rounded-2xl mb-6">
              <Zap size={28} className="text-primary" />
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-7xl leading-tight mb-4">
              Hurtig <span className="italic text-gradient-rose">rådgivning</span>
            </h1>
            <p className="text-foreground/70 text-base md:text-lg font-light max-w-lg mx-auto mb-3">
              Snakk med en ekspert via video — betal kun for minuttene du bruker.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-foreground/50">
              <span className="flex items-center gap-1.5"><Clock size={14} /> Ingen ventetid</span>
              <span className="flex items-center gap-1.5"><Shield size={14} /> Ingen binding</span>
              <span className="flex items-center gap-1.5"><Video size={14} /> Videosamtale</span>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Main content */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-lg">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={32} className="text-primary animate-spin" />
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {/* Step 1: Category */}
              {step === "category" && (
                <motion.div key="category" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-3">
                  <p className="text-xs tracking-widest uppercase text-foreground/50 mb-4">Velg fagområde</p>
                  {categories.map((cat, index) => {
                    const online = getOnlineCount(cat.id);
                    const minPrice = getMinPrice(cat.id);
                    const isHighlighted = index === highlightIndex;
                    const IconComp = ICON_MAP[cat.icon] || Briefcase;
                    return (
                      <motion.button
                        key={cat.id}
                        onClick={() => { setSelectedCategory(cat.id); setStep("info"); }}
                        disabled={online === 0}
                        className={`w-full glass rounded-2xl p-5 text-left flex items-center justify-between transition-all border ${
                          isHighlighted && online > 0 ? "border-primary/40 shadow-lg shadow-primary/5 bg-primary/5" : "border-border/30 hover:border-primary/20"
                        } ${online === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                        whileTap={online > 0 ? { scale: 0.98 } : undefined}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
                            isHighlighted && online > 0 ? "bg-primary/15" : "bg-muted/50"
                          }`}>
                            <IconComp size={20} className={isHighlighted && online > 0 ? "text-primary" : "text-muted-foreground"} />
                          </div>
                          <div>
                            <p className="text-sm font-heading text-foreground">{cat.name}</p>
                            <div className="flex items-center gap-3 mt-1">
                              {online > 0 ? (
                                <>
                                  <span className="flex items-center gap-1"><Wifi size={10} className="text-green-500" /><span className="text-[10px] text-green-600 font-medium">{online} online</span></span>
                                  {minPrice && <span className="text-[10px] text-foreground/40">fra {minPrice} kr/min</span>}
                                </>
                              ) : (
                                <span className="flex items-center gap-1"><WifiOff size={10} className="text-muted-foreground" /><span className="text-[10px] text-muted-foreground">Ingen online nå</span></span>
                              )}
                            </div>
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-muted-foreground" />
                      </motion.button>
                    );
                  })}
                </motion.div>
              )}

              {/* Step 2: Customer info */}
              {step === "info" && (
                <motion.div key="info" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
                  <button onClick={() => setStep("category")} className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                    <ArrowLeft size={12} /> Tilbake
                  </button>

                  <div className="glass rounded-2xl p-6 border border-border/30">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                        <Video size={18} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-heading">{selectedCatName}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {getOnlineCount(selectedCategory)} rådgiver(e) online
                          {minPriceForSelected && ` · fra ${minPriceForSelected} kr/min`}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Textarea
                        placeholder="Beskriv kort hva du trenger hjelp med *"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="bg-muted/30 border-border/50 min-h-[80px] resize-none"
                        maxLength={500}
                      />
                      <p className="text-[10px] text-muted-foreground text-right">{description.length}/500</p>
                      <Input placeholder="Fullt navn *" value={name} onChange={(e) => setName(e.target.value)} className="bg-muted/30 border-border/50 h-11" />
                      <Input type="email" placeholder="E-post *" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-muted/30 border-border/50 h-11" />
                      <Input type="tel" placeholder="Telefon (valgfritt)" value={phone} onChange={(e) => setPhone(e.target.value)} className="bg-muted/30 border-border/50 h-11" />
                    </div>

                    <button
                      onClick={requestSession}
                      disabled={!name || !email || !description.trim() || requesting}
                      className="w-full mt-5 flex items-center justify-center gap-2 py-3.5 bg-primary text-primary-foreground text-sm font-medium tracking-wider rounded-full glow-rose hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none"
                    >
                      {requesting ? <Loader2 size={16} className="animate-spin" /> : <Video size={16} />}
                      Start videorådgivning
                      <ArrowRight size={14} />
                    </button>
                  </div>

                  {/* Price info */}
                  <div className="glass rounded-2xl p-4 border border-primary/20 text-center">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Pris</p>
                    <p className="font-heading text-2xl text-gradient-rose">
                      {minPriceForSelected ? `${minPriceForSelected} kr/min` : "Variabel"}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">Rundes opp til nærmeste minutt · Faktureres etter avsluttet samtale</p>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Waiting */}
              {step === "waiting" && (
                <motion.div key="waiting" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
                  <div className="glass rounded-2xl p-10 text-center border border-primary/20">
                    <Loader2 size={48} className="text-primary animate-spin mx-auto mb-5" />
                    <h3 className="font-heading text-xl mb-2">Kobler deg til en rådgiver...</h3>
                    <p className="text-sm text-muted-foreground mb-1">{selectedCatName}</p>
                    <p className="text-xs text-muted-foreground mb-6">En tilgjengelig rådgiver vil svare deg snart. Maks ventetid er 15 minutter.</p>
                    <button
                      onClick={() => { setStep("category"); setRequesting(false); toast("Forespørsel avbrutt"); }}
                      className="px-6 py-2.5 text-sm border border-border/50 rounded-full hover:bg-muted/30 transition-colors"
                    >
                      Avbryt
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 md:py-32 border-t border-border/15">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection>
            <div className="text-center mb-14">
              <p className="text-xs tracking-[0.4em] uppercase text-secondary mb-5">Slik fungerer det</p>
              <h2 className="font-heading text-3xl md:text-5xl">
                Tre enkle steg.{" "}<span className="italic text-gradient-rose">Ingen overraskelser.</span>
              </h2>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { num: "01", title: "Velg fagområde", desc: "Velg hvilken type rådgivning du trenger — regnskap, skatt, HR eller noe annet.", icon: Briefcase },
              { num: "02", title: "Start samtalen", desc: "Fyll inn kontaktinfo og bli koblet til en rådgiver via video innen minutter.", icon: Video },
              { num: "03", title: "Betal per minutt", desc: "Du betaler kun for tiden du bruker. Ingen faste kostnader eller binding.", icon: Clock },
            ].map((s) => (
              <AnimatedSection key={s.num} delay={Number(s.num) * 0.1}>
                <div className="glass rounded-3xl p-8 h-full relative overflow-hidden group card-lift">
                  <div className="absolute -top-6 -right-6 w-20 h-20 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
                  <span className="font-heading text-5xl text-primary/10 mb-4 block">{s.num}</span>
                  <div className="p-2.5 bg-primary/10 rounded-xl inline-block mb-4">
                    <s.icon size={18} className="text-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-heading text-lg mb-2">{s.title}</h3>
                  <p className="text-sm text-foreground/60 font-light leading-relaxed">{s.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default HurtigRadgivning;
