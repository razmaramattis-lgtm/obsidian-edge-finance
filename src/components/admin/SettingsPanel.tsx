import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Key, User, Check, Camera, Phone, Mail, Briefcase, Sparkles, Save, CalendarDays, Clock, Trash2, Plus, Video, Power, Users, UserPlus, GripVertical, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Link2, Download, Copy, RefreshCw, ExternalLink, AlertCircle, CheckCircle2, Loader2, HelpCircle, X, Smartphone, Share, MoreVertical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmployeesPanel from "@/components/admin/EmployeesPanel";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isSameDay, isSameMonth, addYears, subYears } from "date-fns";
import { nb } from "date-fns/locale";

/* ─────────── Availability sub-panel ─────────── */

const DAYS = ["Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag", "Søndag"];
const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Des"];

interface AvailabilitySlot {
  id?: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  active: boolean;
}

interface BlockedDate {
  id: string;
  blocked_date: string;
  reason: string | null;
}

interface Booking {
  id: string;
  booking_date: string;
  booking_time: string;
  customer_name: string;
  company_name: string;
  status: string;
}

const AvailabilityTab = () => {
  const { profile, session } = useAuth();
  const [bookingActive, setBookingActive] = useState(false);
  const [teamsLink, setTeamsLink] = useState("");
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [viewMode, setViewMode] = useState<"week" | "month" | "year">("week");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [currentYear, setCurrentYear] = useState(new Date());
  const [copiedLink, setCopiedLink] = useState(false);
  const [newBlockReason, setNewBlockReason] = useState("");
  const [showReasonFor, setShowReasonFor] = useState<string | null>(null);
  const [showTeamsGuide, setShowTeamsGuide] = useState(false);
  const [calendarFeedUrl, setCalendarFeedUrl] = useState("");
  // Outlook sync
  const [outlookCalUrl, setOutlookCalUrl] = useState("");
  const [syncingOutlook, setSyncingOutlook] = useState(false);
  const [syncResult, setSyncResult] = useState<{ added: number; removed: number } | null>(null);
  const [syncError, setSyncError] = useState("");
  const [showOutlookWizard, setShowOutlookWizard] = useState(false);

  useEffect(() => {
    if (!profile) {
      setCalendarFeedUrl("");
      return;
    }
    loadData();
  }, [profile]);

  useEffect(() => {
    if (!profile || !session?.access_token) {
      setCalendarFeedUrl("");
      return;
    }
    loadCalendarFeedUrl();
  }, [profile?.id, session?.access_token]);

  const loadData = async () => {
    if (!profile) return;
    const { data: prof } = await supabase.from("profiles").select("booking_active, teams_link, outlook_calendar_url").eq("id", profile.id).single();
    if (prof) { setBookingActive((prof as any).booking_active ?? false); setTeamsLink((prof as any).teams_link ?? ""); setOutlookCalUrl((prof as any).outlook_calendar_url ?? ""); }

    const { data: avail } = await supabase.from("advisor_availability").select("*").eq("profile_id", profile.id).order("day_of_week");
    if (avail && avail.length > 0) {
      setAvailability(avail.map(a => ({ id: a.id, day_of_week: a.day_of_week, start_time: a.start_time, end_time: a.end_time, active: a.active })));
    } else {
      // Default: Mon-Fri 09-17, one slot per day
      setAvailability([1, 2, 3, 4, 5, 6, 7].map(d => ({ day_of_week: d, start_time: "09:00", end_time: "17:00", active: d <= 5 })));
    }

    const { data: blocked } = await supabase.from("advisor_blocked_dates").select("*").eq("profile_id", profile.id).order("blocked_date");
    setBlockedDates((blocked as BlockedDate[]) || []);

    const { data: bk } = await supabase.from("bookings").select("id, booking_date, booking_time, customer_name, company_name, status").eq("advisor_id", profile.id).order("booking_date");
    setBookings((bk as Booking[]) || []);
  };

  const loadCalendarFeedUrl = async () => {
    if (!profile || !session?.access_token) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/calendar-feed?action=get_token&profile_id=${profile.id}`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Kunne ikke generere sikker kalenderlenke");
      }

      const data = await response.json();
      setCalendarFeedUrl(data.feedUrl ?? "");
    } catch {
      setCalendarFeedUrl("");
    }
  };

  const saveAll = async () => {
    if (!profile) return;
    setSaving(true);
    await supabase.from("profiles").update({ booking_active: bookingActive, teams_link: teamsLink || null } as any).eq("id", profile.id);
    
    // Delete old availability and re-insert all
    await supabase.from("advisor_availability").delete().eq("profile_id", profile.id);
    const rows = availability.map(slot => ({
      profile_id: profile.id,
      day_of_week: slot.day_of_week,
      start_time: slot.start_time,
      end_time: slot.end_time,
      active: slot.active,
    }));
    if (rows.length > 0) {
      const { data } = await supabase.from("advisor_availability").insert(rows).select();
      if (data) {
        setAvailability(data.map(a => ({ id: a.id, day_of_week: a.day_of_week, start_time: a.start_time, end_time: a.end_time, active: a.active })));
      }
    }
    
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000);
  };

  const toggleBlockDate = async (dateStr: string) => {
    const existing = blockedDates.find(bd => bd.blocked_date === dateStr);
    if (existing) {
      await supabase.from("advisor_blocked_dates").delete().eq("id", existing.id);
      setBlockedDates(prev => prev.filter(d => d.id !== existing.id));
    } else {
      setShowReasonFor(dateStr);
    }
  };

  const confirmBlock = async () => {
    if (!profile || !showReasonFor) return;
    await supabase.from("advisor_blocked_dates").insert({ profile_id: profile.id, blocked_date: showReasonFor, reason: newBlockReason || null });
    setShowReasonFor(null);
    setNewBlockReason("");
    loadData();
  };

  const removeBlockedDate = async (id: string) => {
    await supabase.from("advisor_blocked_dates").delete().eq("id", id);
    setBlockedDates(prev => prev.filter(d => d.id !== id));
  };

  // Group slots by day
  const slotsByDay = useMemo(() => {
    const grouped: Record<number, AvailabilitySlot[]> = {};
    for (let d = 1; d <= 7; d++) grouped[d] = [];
    availability.forEach(s => {
      if (!grouped[s.day_of_week]) grouped[s.day_of_week] = [];
      grouped[s.day_of_week].push(s);
    });
    return grouped;
  }, [availability]);

  const toggleDay = (dayIndex: number) => {
    const daySlots = slotsByDay[dayIndex];
    if (daySlots.length === 0) {
      // Add default slot
      setAvailability(prev => [...prev, { day_of_week: dayIndex, start_time: "09:00", end_time: "17:00", active: true }]);
    } else {
      const allActive = daySlots.every(s => s.active);
      setAvailability(prev => prev.map(a => a.day_of_week === dayIndex ? { ...a, active: !allActive } : a));
    }
  };

  const updateSlotTime = (dayIndex: number, slotIndex: number, field: "start_time" | "end_time", value: string) => {
    let count = 0;
    setAvailability(prev => prev.map(a => {
      if (a.day_of_week === dayIndex) {
        if (count === slotIndex) { count++; return { ...a, [field]: value }; }
        count++;
      }
      return a;
    }));
  };

  const addSlotToDay = (dayIndex: number) => {
    const daySlots = slotsByDay[dayIndex];
    const lastEnd = daySlots.length > 0 ? daySlots[daySlots.length - 1].end_time : "09:00";
    // Calculate a reasonable start time (1h after last end)
    const h = parseInt(lastEnd.slice(0, 2));
    const m = lastEnd.slice(3, 5);
    const newStart = `${String(Math.min(h + 1, 23)).padStart(2, "0")}:${m}`;
    const newEnd = `${String(Math.min(h + 2, 23)).padStart(2, "0")}:${m}`;
    setAvailability(prev => [...prev, { day_of_week: dayIndex, start_time: newStart, end_time: newEnd, active: true }]);
  };

  const removeSlotFromDay = (dayIndex: number, slotIndex: number) => {
    let count = 0;
    setAvailability(prev => prev.filter(a => {
      if (a.day_of_week === dayIndex) {
        if (count === slotIndex) { count++; return false; }
        count++;
      }
      return true;
    }));
  };

  const outlookSubscribeUrl = calendarFeedUrl ? `webcal://${calendarFeedUrl.replace(/^https?:\/\//, "")}` : "";

  const copyFeedLink = () => {
    if (!calendarFeedUrl) return;
    navigator.clipboard.writeText(calendarFeedUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const syncOutlookCalendar = async () => {
    if (!profile) return;
    setSyncingOutlook(true); setSyncError(""); setSyncResult(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sync-outlook-calendar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile_id: profile.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Synkronisering feilet");
      setSyncResult({ added: data.added, removed: data.removed });
      loadData();
    } catch (err: any) {
      setSyncError(err.message || "Kunne ikke synkronisere");
    } finally { setSyncingOutlook(false); }
  };

  const saveAndSyncOutlook = async () => {
    if (!profile) return;
    await supabase.from("profiles").update({ outlook_calendar_url: outlookCalUrl || null } as any).eq("id", profile.id);
    await syncOutlookCalendar();
  };

  const removeOutlookSync = async () => {
    if (!profile) return;
    setOutlookCalUrl("");
    await supabase.from("profiles").update({ outlook_calendar_url: null } as any).eq("id", profile.id);
    setSyncResult(null);
  };

  const downloadBookingIcs = (bookingId: string) => {
    if (!calendarFeedUrl) return;
    const token = new URL(calendarFeedUrl).searchParams.get("token");
    if (!token) return;

    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/calendar-feed?action=download_booking&booking_id=${bookingId}&token=${encodeURIComponent(token)}`;
    window.open(url, "_blank");
  };

  const monthDays = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start, end });
    const firstDayOfWeek = (getDay(start) + 6) % 7;
    return { days, offset: firstDayOfWeek };
  }, [currentMonth]);

  const isDateBlocked = (date: Date) => blockedDates.some(bd => bd.blocked_date === format(date, "yyyy-MM-dd"));
  const getBookingsForDate = (date: Date) => bookings.filter(b => b.booking_date === format(date, "yyyy-MM-dd"));
  const isDayAvailable = (date: Date) => {
    const dow = getDay(date) === 0 ? 7 : getDay(date);
    return availability.some(a => a.day_of_week === dow && a.active);
  };

  const yearMonths = useMemo(() => {
    const y = currentYear.getFullYear();
    return Array.from({ length: 12 }, (_, i) => new Date(y, i, 1));
  }, [currentYear]);

  const getMonthBlockedCount = (m: Date) => blockedDates.filter(bd => bd.blocked_date.startsWith(format(m, "yyyy-MM"))).length;
  const getMonthBookingCount = (m: Date) => bookings.filter(b => b.booking_date.startsWith(format(m, "yyyy-MM"))).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <p className="text-xs text-muted-foreground">Styr når kunder kan booke deg for 1-1 møter</p>
        <button onClick={saveAll} disabled={saving} className="h-9 px-5 rounded-xl bg-primary text-primary-foreground text-xs font-medium flex items-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all">
          <Save size={13} /> {saving ? "Lagrer…" : saved ? "Lagret ✓" : "Lagre alt"}
        </button>
      </div>

      {/* Toggle & Teams */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass rounded-2xl border border-border/20 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2"><Power size={14} className={bookingActive ? "text-green-500" : "text-muted-foreground"} /><span className="text-sm font-medium">Tilgjengelig for booking</span></div>
            <button onClick={() => setBookingActive(!bookingActive)} className={`w-12 h-7 rounded-full transition-all duration-300 relative ${bookingActive ? "bg-green-500" : "bg-muted"}`}>
              <motion.div className="w-5 h-5 bg-white rounded-full absolute top-1 shadow-sm" animate={{ left: bookingActive ? 26 : 4 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} />
            </button>
          </div>
          <p className="text-xs text-muted-foreground">{bookingActive ? "Du er synlig i bookingkalenderen." : "Du er skjult fra bookingkalenderen."}</p>
        </div>
        <div className="glass rounded-2xl border border-border/20 p-5">
          <div className="flex items-center gap-2 mb-3"><Video size={14} className="text-primary" /><span className="text-sm font-medium">Microsoft Teams-lenke</span></div>
          <input value={teamsLink} onChange={e => setTeamsLink(e.target.value)} placeholder="https://teams.microsoft.com/l/meetup-join/…" className="w-full h-9 rounded-xl border border-border/30 bg-muted/30 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30" />
          <p className="text-[10px] text-muted-foreground mt-2">Sendes automatisk til kunder ved bekreftet booking.</p>
          <button onClick={() => setShowTeamsGuide(true)} className="mt-3 h-8 px-4 rounded-xl bg-primary/10 text-primary text-[11px] font-medium hover:bg-primary/20 border border-primary/20 flex items-center gap-1.5 transition-all">
            <HelpCircle size={12} /> Se veileder
          </button>
        </div>
      </div>

      {/* View mode tabs */}
      <div className="flex items-center gap-1 bg-muted/30 border border-border/20 rounded-xl p-1 w-fit">
        {(["week", "month", "year"] as const).map(mode => (
          <button key={mode} onClick={() => setViewMode(mode)} className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${viewMode === mode ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            {mode === "week" ? "Ukeplan" : mode === "month" ? "Måned" : "Årsplan"}
          </button>
        ))}
      </div>

      {/* WEEK VIEW */}
      {viewMode === "week" && (
        <div className="glass rounded-2xl border border-border/20 p-5">
          <div className="flex items-center gap-2 mb-4"><Clock size={14} className="text-primary" /><span className="text-sm font-medium">Ukeplan — faste tider</span></div>
          <p className="text-[11px] text-muted-foreground mb-4">Du kan legge til flere tidsrom per dag, f.eks. 08:00–10:00 og 11:00–12:00.</p>
          <div className="space-y-3">
            {DAYS.map((dayName, i) => {
              const dayIndex = i + 1;
              const daySlots = slotsByDay[dayIndex] || [];
              const isActive = daySlots.some(s => s.active);
              return (
                <div key={dayIndex} className={`rounded-xl border transition-all ${isActive ? "border-primary/20 bg-primary/5" : "border-border/10 bg-muted/20 opacity-60"}`}>
                  <div className="flex items-center gap-3 p-3">
                    <button onClick={() => toggleDay(dayIndex)} className={`w-10 h-10 rounded-xl text-xs font-medium flex items-center justify-center transition-all shrink-0 ${isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                      {dayName.slice(0, 2)}
                    </button>
                    <span className="text-xs w-20 shrink-0 font-medium">{dayName}</span>
                    <div className="flex-1 space-y-2">
                      {!isActive && <span className="text-xs text-muted-foreground italic">Ikke tilgjengelig</span>}
                      {daySlots.map((slot, si) => slot.active && (
                        <div key={si} className="flex items-center gap-2">
                          <input type="time" value={slot.start_time} onChange={e => updateSlotTime(dayIndex, si, "start_time", e.target.value)} className="h-9 rounded-xl border border-border/30 bg-background px-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/40" />
                          <span className="text-xs text-muted-foreground">til</span>
                          <input type="time" value={slot.end_time} onChange={e => updateSlotTime(dayIndex, si, "end_time", e.target.value)} className="h-9 rounded-xl border border-border/30 bg-background px-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/40" />
                          {daySlots.filter(s => s.active).length > 1 && (
                            <button onClick={() => removeSlotFromDay(dayIndex, si)} className="text-muted-foreground hover:text-destructive transition-colors shrink-0" title="Fjern tidsrom">
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    {isActive && (
                      <button onClick={() => addSlotToDay(dayIndex)} className="shrink-0 w-8 h-8 rounded-lg border border-dashed border-border/30 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all" title="Legg til tidsrom">
                        <Plus size={12} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MONTH VIEW */}
      {viewMode === "month" && (
        <div className="glass rounded-2xl border border-border/20 p-5">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="w-8 h-8 rounded-lg border border-border/20 flex items-center justify-center hover:bg-muted/50 transition-colors"><ChevronLeft size={14} /></button>
            <span className="text-sm font-medium capitalize">{format(currentMonth, "MMMM yyyy", { locale: nb })}</span>
            <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="w-8 h-8 rounded-lg border border-border/20 flex items-center justify-center hover:bg-muted/50 transition-colors"><ChevronRight size={14} /></button>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAYS.map(d => <div key={d} className="text-center text-[10px] text-muted-foreground font-medium py-1">{d.slice(0, 2)}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: monthDays.offset }).map((_, i) => <div key={`empty-${i}`} />)}
            {monthDays.days.map(day => {
              const ds = format(day, "yyyy-MM-dd");
              const blocked = isDateBlocked(day);
              const dayBookings = getBookingsForDate(day);
              const available = isDayAvailable(day);
              const isPast = day < new Date(new Date().setHours(0, 0, 0, 0));
              const isToday = isSameDay(day, new Date());

              return (
                <button
                  key={ds}
                  onClick={() => !isPast && toggleBlockDate(ds)}
                  disabled={isPast}
                  className={`relative aspect-square rounded-xl text-xs font-medium flex flex-col items-center justify-center transition-all border ${
                    blocked ? "bg-destructive/10 border-destructive/30 text-destructive" :
                    isToday ? "border-primary/40 bg-primary/10 text-primary" :
                    !available ? "bg-muted/30 border-border/10 text-muted-foreground" :
                    "border-border/10 hover:border-primary/20 hover:bg-primary/5 text-foreground"
                  } ${isPast ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <span>{day.getDate()}</span>
                  {dayBookings.length > 0 && (
                    <div className="flex gap-0.5 mt-0.5">
                      {dayBookings.slice(0, 3).map((_, i) => <div key={i} className="w-1 h-1 rounded-full bg-primary" />)}
                    </div>
                  )}
                  {blocked && <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-destructive" />}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-4 mt-4 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-primary" /> Booking</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-destructive" /> Blokkert</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded bg-muted/50 border border-border/20" /> Ikke tilgj.</span>
          </div>
          <p className="text-[10px] text-muted-foreground mt-2">Klikk på en dato for å blokkere/fjerne blokkering.</p>
        </div>
      )}

      {/* YEAR VIEW */}
      {viewMode === "year" && (
        <div className="glass rounded-2xl border border-border/20 p-5">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setCurrentYear(subYears(currentYear, 1))} className="w-8 h-8 rounded-lg border border-border/20 flex items-center justify-center hover:bg-muted/50 transition-colors"><ChevronLeft size={14} /></button>
            <span className="text-sm font-medium">{currentYear.getFullYear()}</span>
            <button onClick={() => setCurrentYear(addYears(currentYear, 1))} className="w-8 h-8 rounded-lg border border-border/20 flex items-center justify-center hover:bg-muted/50 transition-colors"><ChevronRight size={14} /></button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {yearMonths.map((m, mi) => {
              const mStart = startOfMonth(m);
              const mEnd = endOfMonth(m);
              const mDays = eachDayOfInterval({ start: mStart, end: mEnd });
              const mOffset = (getDay(mStart) + 6) % 7;
              const isCurrent = isSameMonth(m, new Date());
              return (
                <div key={mi} className={`rounded-xl border p-3 transition-all ${isCurrent ? "border-primary/30 bg-primary/5" : "border-border/20"}`}>
                  <p className="text-xs font-semibold mb-2 text-center">{MONTHS_SHORT[mi]}</p>
                  <div className="grid grid-cols-7 gap-px">
                    {["M","T","O","T","F","L","S"].map((d, di) => <div key={di} className="text-center text-[8px] text-muted-foreground py-0.5">{d}</div>)}
                    {Array.from({ length: mOffset }).map((_, i) => <div key={`e-${i}`} />)}
                    {mDays.map(day => {
                      const ds = format(day, "yyyy-MM-dd");
                      const blocked = isDateBlocked(day);
                      const hasBooking = getBookingsForDate(day).length > 0;
                      const available = isDayAvailable(day);
                      const isPast = day < new Date(new Date().setHours(0, 0, 0, 0));
                      const isToday = isSameDay(day, new Date());
                      return (
                        <button key={ds} onClick={() => !isPast && toggleBlockDate(ds)} disabled={isPast}
                          className={`aspect-square rounded text-[9px] flex items-center justify-center transition-all ${
                            blocked ? "bg-destructive/20 text-destructive font-bold" :
                            isToday ? "bg-primary/20 text-primary font-bold" :
                            hasBooking ? "bg-primary/10 text-primary" :
                            !available ? "text-muted-foreground/40" :
                            "text-foreground hover:bg-primary/10"
                          } ${isPast ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`}
                        >
                          {day.getDate()}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-4 mt-4 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-primary" /> Booking</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-destructive" /> Blokkert</span>
            <span>Klikk på en dag for å blokkere/fjerne.</span>
          </div>
        </div>
      )}

      {/* Blocked dates list */}
      {blockedDates.length > 0 && (
        <div className="glass rounded-2xl border border-border/20 p-5">
          <div className="flex items-center gap-2 mb-3"><CalendarDays size={14} className="text-destructive" /><span className="text-sm font-medium">Blokkerte datoer ({blockedDates.length})</span></div>
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {blockedDates.map(bd => (
              <div key={bd.id} className="flex items-center justify-between py-2 px-3 rounded-xl bg-destructive/5 border border-destructive/10">
                <div>
                  <span className="text-xs font-medium">{new Date(bd.blocked_date).toLocaleDateString("nb-NO", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}</span>
                  {bd.reason && <span className="text-[11px] text-muted-foreground ml-2">— {bd.reason}</span>}
                </div>
                <button onClick={() => removeBlockedDate(bd.id)} className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={12} /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Block date reason modal */}
      {showReasonFor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowReasonFor(null)}>
          <div className="bg-background rounded-2xl border border-border/20 p-6 w-full max-w-sm space-y-4 shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-sm font-medium">Blokker {new Date(showReasonFor).toLocaleDateString("nb-NO", { weekday: "long", day: "numeric", month: "long" })}</h3>
            <input value={newBlockReason} onChange={e => setNewBlockReason(e.target.value)} placeholder="Grunn (valgfritt)" className="w-full h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" autoFocus />
            <div className="flex gap-2">
              <button onClick={confirmBlock} className="flex-1 h-10 rounded-xl bg-destructive text-destructive-foreground text-sm font-medium hover:opacity-90 transition-all">Blokker dato</button>
              <button onClick={() => setShowReasonFor(null)} className="h-10 px-4 rounded-xl border border-border/30 text-sm hover:bg-muted/50 transition-all">Avbryt</button>
            </div>
          </div>
        </div>
      )}

      {/* Upcoming bookings */}
      {bookings.filter(b => b.booking_date >= format(new Date(), "yyyy-MM-dd")).length > 0 && (
        <div className="glass rounded-2xl border border-border/20 p-5">
          <div className="flex items-center gap-2 mb-3"><CalendarIcon size={14} className="text-primary" /><span className="text-sm font-medium">Kommende bookinger</span></div>
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {bookings.filter(b => b.booking_date >= format(new Date(), "yyyy-MM-dd")).slice(0, 10).map(b => (
              <div key={b.id} className="flex items-center justify-between py-2 px-3 rounded-xl bg-primary/5 border border-primary/10">
                <div>
                  <span className="text-xs font-medium">{new Date(b.booking_date).toLocaleDateString("nb-NO", { weekday: "short", day: "numeric", month: "short" })} kl. {b.booking_time.slice(0, 5)}</span>
                  <span className="text-[11px] text-muted-foreground ml-2">— {b.customer_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full ${b.status === "confirmed" ? "bg-green-500/10 text-green-600 border border-green-500/20" : "bg-muted text-muted-foreground border border-border/20"}`}>{b.status === "confirmed" ? "Bekreftet" : b.status === "pending" ? "Venter" : b.status}</span>
                  <button onClick={() => downloadBookingIcs(b.id)} title="Last ned .ics" className="text-muted-foreground hover:text-primary transition-colors"><Download size={12} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── STEG-FOR-STEG KALENDEROPPSETT ── */}
      <div className="glass rounded-2xl border border-border/20 p-5 space-y-5">
        <div className="flex items-center gap-2 mb-1"><CalendarIcon size={16} className="text-primary" /><span className="text-sm font-semibold">Kalenderoppsett — steg for steg</span></div>
        <p className="text-xs text-muted-foreground">To enkle oppsett gjør at kalenderen din alltid er oppdatert — ingen teknisk kunnskap kreves.</p>

        {/* ── DEL 1: Bookinger → Outlook ── */}
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">1</div>
            <div>
              <p className="text-sm font-semibold">Bookinger → Din kalender</p>
              <p className="text-[11px] text-muted-foreground">Alle bekreftede bookinger og blokkerte datoer vises automatisk i Outlook.</p>
            </div>
          </div>

          <div className="rounded-xl bg-background/80 border border-border/20 p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-medium"><span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">1</span> Kopier kalender-URL-en under</div>
            <div className="flex gap-2">
              <input readOnly value={calendarFeedUrl} className="flex-1 h-9 rounded-xl border border-border/30 bg-muted/30 px-3 text-[11px] text-muted-foreground select-all focus:outline-none" onClick={e => (e.target as HTMLInputElement).select()} />
              <button onClick={copyFeedLink} className="h-9 px-4 rounded-xl bg-primary text-primary-foreground text-[11px] font-medium flex items-center gap-1.5 hover:opacity-90 transition-all shrink-0">
                {copiedLink ? <><Check size={12} /> Kopiert!</> : <><Copy size={12} /> Kopier</>}
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs font-medium mt-2"><span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">2</span> Åpne Outlook på nett</div>
            <p className="text-[11px] text-muted-foreground ml-7">Gå til <strong>outlook.office.com</strong> → logg inn med din jobbkonto.</p>

            <div className="flex items-center gap-2 text-xs font-medium"><span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">3</span> Legg til kalenderen</div>
            <div className="ml-7 space-y-1">
              <p className="text-[11px] text-muted-foreground">Klikk <strong>«Legg til kalender»</strong> i venstre panel.</p>
              <p className="text-[11px] text-muted-foreground">Velg <strong>«Abonner fra nett»</strong>.</p>
              <p className="text-[11px] text-muted-foreground">Lim inn URL-en du kopierte, og gi den navnet <strong>«Avargo Bookinger»</strong>.</p>
            </div>

            <div className="flex items-center gap-2 text-xs font-medium"><span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">4</span> Ferdig! ✅</div>
            <p className="text-[11px] text-muted-foreground ml-7">Bookingene dine oppdateres automatisk i Outlook. Nye bookinger vises innen noen minutter.</p>
          </div>

          <div className="flex gap-2">
            <button onClick={() => window.open(outlookSubscribeUrl)} className="h-9 px-4 rounded-xl border border-border/20 text-xs font-medium flex items-center gap-2 hover:bg-primary/5 transition-all">
              <CalendarIcon size={13} /> Åpne direkte i Outlook
            </button>
            <button onClick={() => downloadBookingIcs(bookings.find(b => b.status === "confirmed")?.id || "")} disabled={!bookings.some(b => b.status === "confirmed")} className="h-9 px-4 rounded-xl border border-border/20 text-xs font-medium flex items-center gap-2 hover:bg-primary/5 transition-all disabled:opacity-40">
              <Download size={13} /> Last ned .ics (test)
            </button>
          </div>
        </div>

        {/* ── DEL 2: Outlook → Tilgjengelighet ── */}
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">2</div>
            <div>
              <p className="text-sm font-semibold">Din kalender → Tilgjengelighet</p>
              <p className="text-[11px] text-muted-foreground">Opptatte dager i Outlook blokkerer automatisk bookinger for deg.</p>
            </div>
          </div>

          {syncResult && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/20">
              <CheckCircle2 size={14} className="text-green-600 shrink-0" />
              <p className="text-xs text-green-700">Synkronisert! {syncResult.added} datoer blokkert, {syncResult.removed} fjernet.</p>
            </div>
          )}
          {syncError && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 border border-destructive/20">
              <AlertCircle size={14} className="text-destructive shrink-0" />
              <p className="text-xs text-destructive">{syncError}</p>
            </div>
          )}

          <div className="rounded-xl bg-background/80 border border-border/20 p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-medium"><span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">1</span> Publiser kalenderen din i Outlook</div>
            <div className="ml-7 space-y-1">
              <p className="text-[11px] text-muted-foreground">Gå til <strong>outlook.office.com</strong> → <strong>Innstillinger</strong> (⚙️) → <strong>Vis alle Outlook-innstillinger</strong>.</p>
              <p className="text-[11px] text-muted-foreground">Velg <strong>Kalender</strong> → <strong>Delte kalendere</strong>.</p>
              <p className="text-[11px] text-muted-foreground">Under «Publiser en kalender»: velg din kalender, velg <strong>«Kan vise alle detaljer»</strong>.</p>
              <p className="text-[11px] text-muted-foreground">Klikk <strong>Publiser</strong>.</p>
            </div>

            <div className="flex items-center gap-2 text-xs font-medium"><span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">2</span> Kopier ICS-lenken</div>
            <p className="text-[11px] text-muted-foreground ml-7">Det vises to lenker — kopier den som slutter på <strong>.ics</strong> (ikke HTML-lenken).</p>

            <div className="flex items-center gap-2 text-xs font-medium"><span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">3</span> Lim inn URL-en her og klikk «Lagre og synk»</div>
            <div className="ml-7 flex gap-2 mt-1">
              <input
                value={outlookCalUrl}
                onChange={e => setOutlookCalUrl(e.target.value)}
                placeholder="https://outlook.office365.com/owa/calendar/…/reachcalendar.ics"
                className="flex-1 h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <button onClick={saveAndSyncOutlook} disabled={syncingOutlook || !outlookCalUrl} className="h-10 px-5 rounded-xl bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 disabled:opacity-50 transition-all whitespace-nowrap flex items-center gap-2">
                {syncingOutlook ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
                {syncingOutlook ? "Synkroniserer…" : "Lagre og synk"}
              </button>
            </div>

            {outlookCalUrl && (
              <>
                <div className="flex items-center gap-2 text-xs font-medium"><span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">4</span> Ferdig! ✅</div>
                <p className="text-[11px] text-muted-foreground ml-7">Opptatte dager fra Outlook er nå blokkert (merket med 📅). Klikk «Synk nå» når som helst for å oppdatere.</p>
              </>
            )}
          </div>

          {outlookCalUrl && (
            <div className="flex items-center justify-between">
              <button onClick={syncOutlookCalendar} disabled={syncingOutlook} className="h-9 px-4 rounded-xl bg-primary text-primary-foreground text-[11px] font-medium flex items-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all">
                {syncingOutlook ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
                {syncingOutlook ? "Synkroniserer…" : "Synk nå"}
              </button>
              <button onClick={removeOutlookSync} className="text-[11px] text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1">
                <Trash2 size={10} /> Fjern synkronisering
              </button>
            </div>
          )}

          <div className="rounded-xl bg-muted/20 border border-border/10 p-3">
            <p className="text-[10px] text-muted-foreground">💡 Manuelt blokkerte datoer påvirkes aldri av synkroniseringen. Kun automatisk importerte datoer (📅) oppdateres.</p>
          </div>
        </div>
      </div>

      {/* Teams guide modal */}
      <AnimatePresence>
        {showTeamsGuide && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setShowTeamsGuide(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="relative w-full max-w-lg max-h-[80vh] overflow-y-auto rounded-2xl border border-border/30 bg-background shadow-2xl p-6"
              onClick={e => e.stopPropagation()}
            >
              <button onClick={() => setShowTeamsGuide(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors">
                <X size={16} />
              </button>
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2"><Video size={14} className="text-primary" /> Koble opp Microsoft Teams</h3>
              <div className="space-y-4 text-xs text-muted-foreground">
                <div>
                  <p className="font-medium text-foreground mb-1 flex items-center gap-1"><ChevronRight size={12} className="text-primary" /> Steg 1 — Opprett et fast møterom</p>
                  <ol className="list-decimal list-inside space-y-1 ml-4">
                    <li>Åpne <strong>Microsoft Teams</strong> (desktop eller web).</li>
                    <li>Gå til <strong>Kalender</strong> i venstremenyen.</li>
                    <li>Klikk <strong>«Nytt møte»</strong> øverst til høyre.</li>
                    <li>Fyll inn tittel, f.eks. <em>«1-1 Regnskap – [Ditt navn]»</em>.</li>
                    <li>Du trenger <strong>ikke</strong> legge til deltakere eller velge tidspunkt.</li>
                    <li>Klikk <strong>«Lagre»</strong>.</li>
                  </ol>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-1 flex items-center gap-1"><ChevronRight size={12} className="text-primary" /> Steg 2 — Kopier møtelenken</p>
                  <ol className="list-decimal list-inside space-y-1 ml-4">
                    <li>Åpne møtet du nettopp opprettet.</li>
                    <li>Finn <strong>«Bli med i Teams-møte»</strong>-lenken.</li>
                    <li>Høyreklikk og velg <strong>«Kopier lenkeadresse»</strong>.</li>
                    <li>Lenken ser slik ut: <code className="bg-muted px-1.5 py-0.5 rounded text-[10px] break-all">https://teams.microsoft.com/l/meetup-join/...</code></li>
                  </ol>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-1 flex items-center gap-1"><ChevronRight size={12} className="text-primary" /> Steg 3 — Lim inn lenken</p>
                  <ol className="list-decimal list-inside space-y-1 ml-4">
                    <li>Lim inn lenken i <strong>«Microsoft Teams-lenke»</strong>-feltet.</li>
                    <li>Klikk <strong>«Lagre alt»</strong>.</li>
                    <li>Lenken sendes automatisk til kunder ved bekreftet booking.</li>
                  </ol>
                </div>
                <div className="rounded-xl bg-primary/10 border border-primary/20 p-3">
                  <p className="font-medium text-foreground mb-1">💡 Tips</p>
                  <ul className="list-disc list-inside space-y-1 ml-1">
                    <li>Bruk én fast møtelenke — du trenger ikke nytt møte per booking.</li>
                    <li>Kunder mottar lenken i bekreftelses-e-post med ICS-fil.</li>
                    <li>Du kan endre lenken når som helst.</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─────────── Profile tab ─────────── */

interface Specialty {
  id?: string;
  name: string;
  description: string;
  sort_order: number;
  isNew?: boolean;
}

const ProfileTab = () => {
  const { profile } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Specialties
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [newSpecName, setNewSpecName] = useState("");
  const [newSpecDesc, setNewSpecDesc] = useState("");
  const [expandedSpec, setExpandedSpec] = useState<string | null>(null);

  // Password
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [pwSuccess, setPwSuccess] = useState("");
  const [pwError, setPwError] = useState("");

  useEffect(() => {
    if (!profile) return;
    loadProfile();
    loadSpecialties();
  }, [profile]);

  const loadProfile = async () => {
    if (!profile) return;
    const { data } = await supabase.from("profiles").select("*").eq("id", profile.id).single();
    if (data) {
      setName(data.name || "");
      setEmail(data.email || "");
      setPhone((data as any).phone || "");
      setTitle((data as any).title || "");
      setBio((data as any).bio || "");
      setAvatarUrl((data as any).avatar_url || "");
    }
  };

  const loadSpecialties = async () => {
    if (!profile) return;
    const { data } = await supabase.from("profile_specialties").select("*").eq("profile_id", profile.id).order("sort_order");
    if (data) setSpecialties(data.map(s => ({ id: s.id, name: s.name, description: s.description || "", sort_order: s.sort_order ?? 0 })));
  };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    await supabase.from("profiles").update({
      name, phone, title, bio, avatar_url: avatarUrl || null
    } as any).eq("id", profile.id);
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000);
  };

  const addSpecialty = async () => {
    if (!profile || !newSpecName.trim()) return;
    const { data } = await supabase.from("profile_specialties").insert({
      profile_id: profile.id,
      name: newSpecName.trim(),
      description: newSpecDesc.trim() || null,
      sort_order: specialties.length,
    }).select().single();
    if (data) {
      setSpecialties(prev => [...prev, { id: data.id, name: data.name, description: data.description || "", sort_order: data.sort_order ?? 0 }]);
      setNewSpecName("");
      setNewSpecDesc("");
    }
  };

  const updateSpecialty = async (id: string, updates: Partial<Specialty>) => {
    setSpecialties(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    await supabase.from("profile_specialties").update({
      name: updates.name,
      description: updates.description || null,
    } as any).eq("id", id);
  };

  const removeSpecialty = async (id: string) => {
    await supabase.from("profile_specialties").delete().eq("id", id);
    setSpecialties(prev => prev.filter(s => s.id !== id));
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) { setPwError("Passordene stemmer ikke overens."); return; }
    if (newPassword.length < 6) { setPwError("Passord må være minst 6 tegn."); return; }
    setPwLoading(true); setPwError(""); setPwSuccess("");
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) { setPwError("Kunne ikke oppdatere passordet."); }
    else { setPwSuccess("Passordet er oppdatert!"); setNewPassword(""); setConfirmPassword(""); }
    setPwLoading(false);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    const ext = file.name.split(".").pop();
    const path = `avatars/${profile.user_id}.${ext}`;
    
    const { error } = await supabase.storage.from("archive-files").upload(path, file, { upsert: true });
    if (!error) {
      const { data: urlData } = supabase.storage.from("archive-files").getPublicUrl(path);
      setAvatarUrl(urlData.publicUrl);
    }
  };

  const inputClass = "w-full h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all";

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Avatar & basic info */}
      <div className="glass rounded-2xl border border-border/20 p-6">
        <div className="flex items-start gap-5">
          <div className="relative group">
            <Avatar className="w-20 h-20 border-2 border-border/20">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback className="text-2xl font-medium bg-primary/10 text-primary">
                {name?.charAt(0)?.toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
            <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
              <Camera size={18} className="text-white" />
              <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
            </label>
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-lg">{name || "Ukjent"}</h3>
            <p className="text-sm text-muted-foreground">{email}</p>
            <span className="inline-block mt-1 text-[10px] tracking-widest uppercase text-primary border border-primary/30 px-2.5 py-0.5 rounded-full">
              {profile?.role === "admin" ? "Administrator" : "Ansatt"}
            </span>
          </div>
        </div>
      </div>

      {/* Profile details */}
      <form onSubmit={saveProfile} className="glass rounded-2xl border border-border/20 p-6 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <User size={15} className="text-primary" strokeWidth={1.5} />
            <h3 className="font-medium text-sm">Profilinformasjon</h3>
          </div>
          <button type="submit" disabled={saving} className="h-9 px-5 rounded-xl bg-primary text-primary-foreground text-xs font-medium flex items-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all">
            <Save size={13} /> {saving ? "Lagrer…" : saved ? "Lagret ✓" : "Lagre"}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1.5"><User size={12} /> Fullt navn</label>
            <input value={name} onChange={e => setName(e.target.value)} className={inputClass} placeholder="Ola Nordmann" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1.5"><Mail size={12} /> E-post</label>
            <input value={email} disabled className={`${inputClass} opacity-60 cursor-not-allowed`} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1.5"><Phone size={12} /> Telefon</label>
            <input value={phone} onChange={e => setPhone(e.target.value)} className={inputClass} placeholder="+47 000 00 000" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1.5"><Briefcase size={12} /> Stillingstittel</label>
            <input value={title} onChange={e => setTitle(e.target.value)} className={inputClass} placeholder="Regnskapsfører" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs text-muted-foreground mb-1.5">Kort bio</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} className="w-full rounded-xl border border-border/30 bg-muted/30 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all resize-none" placeholder="Fortell litt om deg selv og din erfaring…" />
          </div>
        </div>
      </form>

      {/* Specialties list */}
      <div className="glass rounded-2xl border border-border/20 p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={15} className="text-primary" strokeWidth={1.5} />
          <h3 className="font-medium text-sm">Spesialfelt</h3>
        </div>
        <p className="text-xs text-muted-foreground -mt-2">Legg til dine kompetanseområder med en dypere beskrivelse.</p>

        {specialties.length > 0 && (
          <div className="space-y-2">
            {specialties.map(spec => (
              <div key={spec.id} className="rounded-xl border border-border/20 bg-muted/10 overflow-hidden">
                <div
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted/20 transition-colors"
                  onClick={() => setExpandedSpec(expandedSpec === spec.id ? null : (spec.id || null))}
                >
                  <Sparkles size={13} className="text-primary shrink-0" />
                  <span className="text-sm font-medium flex-1">{spec.name}</span>
                  <button
                    onClick={e => { e.stopPropagation(); removeSpecialty(spec.id!); }}
                    className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                  >
                    <Trash2 size={12} />
                  </button>
                  {expandedSpec === spec.id ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
                </div>
                {expandedSpec === spec.id && (
                  <div className="px-4 pb-4 pt-1 border-t border-border/10 space-y-2">
                    <input
                      value={spec.name}
                      onChange={e => setSpecialties(prev => prev.map(s => s.id === spec.id ? { ...s, name: e.target.value } : s))}
                      onBlur={() => updateSpecialty(spec.id!, { name: spec.name, description: spec.description })}
                      className="w-full h-9 rounded-lg border border-border/30 bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/40"
                      placeholder="Navn på spesialfelt"
                    />
                    <textarea
                      value={spec.description}
                      onChange={e => setSpecialties(prev => prev.map(s => s.id === spec.id ? { ...s, description: e.target.value } : s))}
                      onBlur={() => updateSpecialty(spec.id!, { name: spec.name, description: spec.description })}
                      rows={3}
                      className="w-full rounded-lg border border-border/30 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/40 resize-none"
                      placeholder="Beskriv din kompetanse innen dette feltet…"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2 items-start">
          <div className="flex-1 space-y-2">
            <input
              value={newSpecName}
              onChange={e => setNewSpecName(e.target.value)}
              placeholder="Nytt spesialfelt, f.eks. «Skatteplanlegging»"
              className="w-full h-9 rounded-xl border border-border/30 bg-muted/30 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/40"
            />
            <textarea
              value={newSpecDesc}
              onChange={e => setNewSpecDesc(e.target.value)}
              placeholder="Beskrivelse (valgfritt) — hva innebærer dette spesialfeltet for deg?"
              rows={2}
              className="w-full rounded-xl border border-border/30 bg-muted/30 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary/40 resize-none"
            />
          </div>
          <button
            type="button"
            onClick={addSpecialty}
            disabled={!newSpecName.trim()}
            className="h-9 px-4 rounded-xl bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 disabled:opacity-50 flex items-center gap-1.5 transition-all shrink-0"
          >
            <Plus size={12} /> Legg til
          </button>
        </div>
      </div>

      {/* Password */}
      <div className="glass rounded-2xl border border-border/20 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Key size={15} className="text-primary" strokeWidth={1.5} />
          <h3 className="font-medium text-sm">Endre passord</h3>
        </div>
        <form onSubmit={changePassword} className="space-y-3 max-w-sm">
          <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Nytt passord" required className={inputClass} />
          <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Bekreft nytt passord" required className={inputClass} />
          {pwError && <p className="text-destructive text-xs">{pwError}</p>}
          {pwSuccess && <div className="flex items-center gap-2 text-xs text-primary"><Check size={13} /> {pwSuccess}</div>}
          <button type="submit" disabled={pwLoading} className="w-full h-10 rounded-xl bg-primary text-primary-foreground text-sm hover:opacity-90 disabled:opacity-50 transition-all">
            {pwLoading ? "Oppdaterer…" : "Oppdater passord"}
          </button>
        </form>
      </div>
    </div>
  );
};

/* ─────────── Main Settings Panel with tabs ─────────── */

interface SettingsPanelProps {
  defaultTab?: string;
}




const SettingsPanel = ({ defaultTab = "profile" }: SettingsPanelProps) => {
  const { isAdmin } = useAuth();

  return (
    <Tabs defaultValue={defaultTab} className="space-y-6">
      <TabsList className="bg-muted/30 border border-border/20 rounded-xl p-1 h-auto flex-wrap">
        <TabsTrigger value="profile" className="rounded-lg text-xs gap-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
          <User size={13} /> Min profil
        </TabsTrigger>
        <TabsTrigger value="availability" className="rounded-lg text-xs gap-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
          <CalendarDays size={13} /> Min tilgjengelighet
        </TabsTrigger>
        {isAdmin && (
          <TabsTrigger value="employees" className="rounded-lg text-xs gap-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Users size={13} /> Ansatte
          </TabsTrigger>
        )}
        <TabsTrigger value="app" className="rounded-lg text-xs gap-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
          <Smartphone size={13} /> Last ned app
        </TabsTrigger>
      </TabsList>

      <TabsContent value="profile"><ProfileTab /></TabsContent>
      <TabsContent value="availability"><AvailabilityTab /></TabsContent>
      {isAdmin && <TabsContent value="employees"><EmployeesPanel /></TabsContent>}
      <TabsContent value="app"><AppInstallTab /></TabsContent>
    </Tabs>
  );
};

/* ─────────── App Install Tab ─────────── */

const AppInstallTab = () => {
  const [copied, setCopied] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [installStatus, setInstallStatus] = useState<"idle" | "installing" | "installed">("idle");
  const appUrl = window.location.origin;

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);

    // Check if already installed
    const matchMedia = window.matchMedia?.("(display-mode: standalone)");
    if (matchMedia?.matches || (window.navigator as any).standalone) {
      setInstallStatus("installed");
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    setInstallStatus("installing");
    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    if (result.outcome === "accepted") {
      setInstallStatus("installed");
    } else {
      setInstallStatus("idle");
    }
    setDeferredPrompt(null);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const canAutoInstall = !!deferredPrompt;

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="rounded-2xl border border-border/20 bg-card/60 p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
            <Smartphone size={24} className="text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Installer Avargo-appen</h3>
            <p className="text-sm text-muted-foreground">Tilgjengelig for iPhone og Android</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Avargo kan installeres som en app direkte fra nettleseren — ingen App Store eller Google Play nødvendig.
        </p>
      </div>

      {/* Auto-install button (Android/Chrome) */}
      <div className="rounded-2xl border border-border/20 bg-card/60 p-5 space-y-3">
        <h4 className="text-sm font-semibold flex items-center gap-2"><Download size={14} /> Installer direkte</h4>
        {installStatus === "installed" ? (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-primary/10 text-sm text-primary font-medium">
            <CheckCircle2 size={16} /> Appen er allerede installert!
          </div>
        ) : canAutoInstall ? (
          <button
            onClick={handleInstall}
            disabled={installStatus === "installing"}
            className="w-full px-4 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {installStatus === "installing" ? (
              <><Loader2 size={16} className="animate-spin" /> Installerer…</>
            ) : (
              <><Download size={16} /> Installer Avargo-appen nå</>
            )}
          </button>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground leading-relaxed">
              {isIOS
                ? "Automatisk installasjon støttes ikke i Safari. Følg instruksjonene nedenfor."
                : "Åpne denne siden i Chrome på mobilen for å få automatisk installasjonsknapp. Du kan også følge instruksjonene nedenfor."}
            </p>
          </div>
        )}
      </div>

      {/* Copy link */}
      <div className="rounded-2xl border border-border/20 bg-card/60 p-5 space-y-3">
        <h4 className="text-sm font-semibold flex items-center gap-2"><Link2 size={14} /> Del installasjonslenke</h4>
        <div className="flex items-center gap-2">
          <div className="flex-1 px-4 py-2.5 rounded-xl bg-muted/30 border border-border/20 text-sm text-muted-foreground truncate font-mono">
            {appUrl}
          </div>
          <button onClick={copyLink} className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95 flex items-center gap-2 shrink-0">
            {copied ? <><CheckCircle2 size={14} /> Kopiert!</> : <><Copy size={14} /> Kopier</>}
          </button>
        </div>
        <p className="text-xs text-muted-foreground">Send denne lenken til ansatte og kunder for enkel installasjon.</p>
      </div>

      {/* iPhone instructions */}
      <div className="rounded-2xl border border-border/20 bg-card/60 p-5 space-y-4">
        <h4 className="text-sm font-semibold flex items-center gap-2">
          <span className="text-lg">🍎</span> iPhone (Safari)
        </h4>
        <ol className="space-y-3 text-sm text-muted-foreground">
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
            <span>Åpne <strong className="text-foreground">{appUrl}</strong> i <strong className="text-foreground">Safari</strong></span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
            <span>Trykk på <strong className="text-foreground">Del-knappen</strong> <Share size={14} className="inline text-primary" /> nederst</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
            <span>Velg <strong className="text-foreground">«Legg til på Hjem-skjerm»</strong></span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">4</span>
            <span>Trykk <strong className="text-foreground">«Legg til»</strong> — ferdig!</span>
          </li>
        </ol>
      </div>

      {/* Android instructions */}
      <div className="rounded-2xl border border-border/20 bg-card/60 p-5 space-y-4">
        <h4 className="text-sm font-semibold flex items-center gap-2">
          <span className="text-lg">🤖</span> Android / Samsung (Chrome)
        </h4>
        <ol className="space-y-3 text-sm text-muted-foreground">
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
            <span>Åpne <strong className="text-foreground">{appUrl}</strong> i <strong className="text-foreground">Chrome</strong></span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
            <span>Trykk <strong className="text-foreground">tre-prikk-menyen</strong> <MoreVertical size={14} className="inline text-primary" /> øverst til høyre</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
            <span>Velg <strong className="text-foreground">«Installer app»</strong></span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">4</span>
            <span>Bekreft — ferdig!</span>
          </li>
        </ol>
      </div>

      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-start gap-3">
        <AlertCircle size={16} className="text-primary shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          <strong className="text-foreground">Tips:</strong> Appen oppdateres automatisk. Brukerne vil alltid ha siste versjon.
        </p>
      </div>
    </div>
  );
};

export default SettingsPanel;
