import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { CalendarDays, Plus, Trash2, Clock, CheckCircle2, XCircle, Users, Video } from "lucide-react";
import { format, addDays, startOfWeek } from "date-fns";
import { nb } from "date-fns/locale";

const DAY_NAMES = ["Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag", "Søndag"];

interface Advisor { id: string; name: string; email: string; profile_id: string; }
interface Availability { id: string; profile_id: string; day_of_week: number; start_time: string; end_time: string; active: boolean; }
interface BlockedDate { id: string; profile_id: string; blocked_date: string; reason: string | null; }
interface Booking {
  id: string; advisor_id: string; customer_name: string; customer_email: string;
  customer_phone: string; company_name: string; message: string | null;
  booking_date: string; booking_time: string; status: string; teams_link: string | null;
  created_at: string;
}

const BookingsPanel = ({ onStatusChange }: { onStatusChange?: () => void }) => {
  const [tab, setTab] = useState<"bookings" | "availability" | "blocked">("bookings");
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [blocked, setBlocked] = useState<BlockedDate[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAdvisor, setSelectedAdvisor] = useState<string>("");
  const [teamsLinkInput, setTeamsLinkInput] = useState<Record<string, string>>({});

  // New blocked date form
  const [blockDate, setBlockDate] = useState("");
  const [blockReason, setBlockReason] = useState("");
  const [blockAdvisor, setBlockAdvisor] = useState("");

  const fetchAll = async () => {
    const [{ data: profiles }, { data: avail }, { data: blk }, { data: bk }] = await Promise.all([
      supabase.from("profiles").select("id, name, email"),
      supabase.from("advisor_availability").select("*").order("day_of_week"),
      supabase.from("advisor_blocked_dates").select("*").order("blocked_date"),
      supabase.from("bookings").select("*").order("booking_date", { ascending: false }),
    ]);
    const advisorList = (profiles || []).map(p => ({ ...p, profile_id: p.id }));
    setAdvisors(advisorList);
    setAvailability((avail as Availability[]) || []);
    setBlocked((blk as BlockedDate[]) || []);
    setBookings((bk as Booking[]) || []);
    if (!selectedAdvisor && advisorList.length) setSelectedAdvisor(advisorList[0].id);
    if (!blockAdvisor && advisorList.length) setBlockAdvisor(advisorList[0].id);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const toggleDay = async (advisorId: string, day: number) => {
    const existing = availability.find(a => a.profile_id === advisorId && a.day_of_week === day);
    if (existing) {
      await supabase.from("advisor_availability").update({ active: !existing.active }).eq("id", existing.id);
    } else {
      await supabase.from("advisor_availability").insert({ profile_id: advisorId, day_of_week: day, start_time: "09:00", end_time: "17:00", active: true });
    }
    fetchAll();
  };

  const updateTime = async (id: string, field: "start_time" | "end_time", value: string) => {
    await supabase.from("advisor_availability").update({ [field]: value }).eq("id", id);
    fetchAll();
  };

  const addBlockedDate = async () => {
    if (!blockDate || !blockAdvisor) return;
    await supabase.from("advisor_blocked_dates").insert({ profile_id: blockAdvisor, blocked_date: blockDate, reason: blockReason || null });
    setBlockDate(""); setBlockReason("");
    fetchAll();
  };

  const removeBlocked = async (id: string) => {
    await supabase.from("advisor_blocked_dates").delete().eq("id", id);
    fetchAll();
  };

  const updateBookingStatus = async (id: string, status: string) => {
    if (status === "cancelled") {
      await supabase.from("bookings").delete().eq("id", id);
      toast.success("Booking slettet");
      fetchAll();
      return;
    }
    await supabase.from("bookings").update({ status }).eq("id", id);

    // Send confirmation emails when booking is confirmed
    if (status === "confirmed") {
      const booking = bookings.find(b => b.id === id);
      if (booking) {
        // Get advisor's Teams link from profile
        const { data: advisorProfile } = await supabase.from("profiles").select("name, teams_link").eq("id", booking.advisor_id).single();
        const teamsLink = (advisorProfile as any)?.teams_link || booking.teams_link || "";

        try {
          await supabase.functions.invoke("notify", {
            body: {
              type: "booking_confirmed",
              data: {
                advisor_id: booking.advisor_id,
                advisor_name: advisorProfile?.name || "",
                customer_name: booking.customer_name,
                customer_email: booking.customer_email,
                customer_phone: booking.customer_phone,
                company_name: booking.company_name,
                booking_date: booking.booking_date,
                booking_time: booking.booking_time,
                message: booking.message,
                teams_link: teamsLink,
              },
            },
          });
        } catch (e) {
          console.error("Failed to send confirmation email:", e);
        }
      }
    }

    fetchAll();
    onStatusChange?.();
  };

  const saveTeamsLink = async (bookingId: string) => {
    const link = teamsLinkInput[bookingId];
    if (!link) return;
    await supabase.from("bookings").update({ teams_link: link }).eq("id", bookingId);
    setTeamsLinkInput(prev => ({ ...prev, [bookingId]: "" }));
    fetchAll();
  };

  if (loading) return <div className="text-muted-foreground text-sm">Laster…</div>;

  const tabs = [
    { id: "bookings" as const, label: "Bookinger", count: bookings.filter(b => b.status === "pending").length },
    { id: "availability" as const, label: "Tilgjengelighet" },
    { id: "blocked" as const, label: "Blokkerte dager" },
  ];

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-border/20 pb-2">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-t-xl text-sm transition-all ${tab === t.id ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground"}`}>
            {t.label}
            {t.count ? <span className="ml-1.5 px-1.5 py-0.5 bg-primary text-primary-foreground text-[10px] rounded-full">{t.count}</span> : null}
          </button>
        ))}
      </div>

      {/* Bookings tab */}
      {tab === "bookings" && (
        <div className="space-y-3">
          {bookings.length === 0 && <p className="text-sm text-muted-foreground">Ingen bookinger ennå.</p>}
          {bookings.map(b => {
            const advisor = advisors.find(a => a.id === b.advisor_id);
            return (
              <div key={b.id} className="glass rounded-2xl p-5 border border-border/20 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-sm">{b.company_name}</p>
                    <p className="text-xs text-muted-foreground">{b.customer_name} · {b.customer_email} · {b.customer_phone}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    b.status === "confirmed" ? "bg-green-500/10 text-green-500" :
                    b.status === "cancelled" ? "bg-destructive/10 text-destructive" :
                    "bg-yellow-500/10 text-yellow-600"
                  }`}>{b.status === "pending" ? "Venter" : b.status === "confirmed" ? "Bekreftet" : "Kansellert"}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><CalendarDays size={12} /> {b.booking_date}</span>
                  <span className="flex items-center gap-1"><Clock size={12} /> {b.booking_time?.slice(0, 5)}</span>
                  <span className="flex items-center gap-1"><Users size={12} /> {advisor?.name || "Ukjent"}</span>
                </div>
                {b.message && <p className="text-xs text-muted-foreground bg-muted/30 rounded-xl p-3">{b.message}</p>}
                
                {/* Teams link */}
                <div className="flex items-center gap-2">
                  {b.teams_link ? (
                    <a href={b.teams_link} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1">
                      <Video size={12} /> Teams-lenke
                    </a>
                  ) : (
                    <div className="flex gap-2 flex-1">
                      <input value={teamsLinkInput[b.id] || ""} onChange={e => setTeamsLinkInput(prev => ({ ...prev, [b.id]: e.target.value }))}
                        placeholder="Lim inn Teams-lenke…" className="flex-1 h-8 rounded-lg border border-border/30 bg-muted/30 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/40" />
                      <button onClick={() => saveTeamsLink(b.id)} className="px-3 h-8 bg-primary/10 text-primary rounded-lg text-xs hover:bg-primary/20">Lagre</button>
                    </div>
                  )}
                </div>

                {b.status === "pending" && (
                  <div className="flex gap-2">
                    <button onClick={() => updateBookingStatus(b.id, "confirmed")} className="flex items-center gap-1 px-3 py-1.5 bg-green-500/10 text-green-600 rounded-xl text-xs hover:bg-green-500/20">
                      <CheckCircle2 size={12} /> Bekreft
                    </button>
                    <button onClick={() => updateBookingStatus(b.id, "cancelled")} className="flex items-center gap-1 px-3 py-1.5 bg-destructive/10 text-destructive rounded-xl text-xs hover:bg-destructive/20">
                      <XCircle size={12} /> Avslå
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Availability tab */}
      {tab === "availability" && (
        <div className="space-y-6">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Velg rådgiver</label>
            <select value={selectedAdvisor} onChange={e => setSelectedAdvisor(e.target.value)}
              className="w-full max-w-xs h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
              {advisors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
          <div className="grid gap-3">
            {DAY_NAMES.map((name, i) => {
              const av = availability.find(a => a.profile_id === selectedAdvisor && a.day_of_week === i);
              return (
                <div key={i} className="glass rounded-2xl px-5 py-4 border border-border/20 flex items-center gap-4 flex-wrap">
                  <button onClick={() => toggleDay(selectedAdvisor, i)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-all ${av?.active ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground"}`}>
                    {name.slice(0, 2)}
                  </button>
                  <span className="text-sm font-medium w-20">{name}</span>
                  {av?.active ? (
                    <div className="flex items-center gap-2 text-xs">
                      <input type="time" value={av.start_time?.slice(0, 5)} onChange={e => updateTime(av.id, "start_time", e.target.value)}
                        className="h-8 rounded-lg border border-border/30 bg-muted/30 px-2 text-xs focus:outline-none" />
                      <span className="text-muted-foreground">–</span>
                      <input type="time" value={av.end_time?.slice(0, 5)} onChange={e => updateTime(av.id, "end_time", e.target.value)}
                        className="h-8 rounded-lg border border-border/30 bg-muted/30 px-2 text-xs focus:outline-none" />
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">Ikke tilgjengelig</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Blocked dates tab */}
      {tab === "blocked" && (
        <div className="space-y-4">
          <div className="glass rounded-2xl p-5 border border-border/20 space-y-3">
            <h3 className="font-medium text-sm">Legg til blokkert dato</h3>
            <div className="flex gap-3 flex-wrap">
              <select value={blockAdvisor} onChange={e => setBlockAdvisor(e.target.value)}
                className="h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
                {advisors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
              <input type="date" value={blockDate} onChange={e => setBlockDate(e.target.value)}
                className="h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
              <input value={blockReason} onChange={e => setBlockReason(e.target.value)} placeholder="Grunn (valgfritt)"
                className="h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 flex-1 min-w-[150px]" />
              <button onClick={addBlockedDate} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm hover:opacity-90">
                <Plus size={14} /> Blokker
              </button>
            </div>
          </div>
          <div className="space-y-2">
            {blocked.length === 0 && <p className="text-sm text-muted-foreground">Ingen blokkerte datoer.</p>}
            {blocked.map(b => {
              const advisor = advisors.find(a => a.id === b.profile_id);
              return (
                <div key={b.id} className="glass rounded-2xl px-5 py-3 border border-border/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CalendarDays size={14} className="text-destructive" />
                    <span className="text-sm">{b.blocked_date}</span>
                    <span className="text-xs text-muted-foreground">({advisor?.name})</span>
                    {b.reason && <span className="text-xs text-muted-foreground">– {b.reason}</span>}
                  </div>
                  <button onClick={() => removeBlocked(b.id)} className="text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsPanel;
