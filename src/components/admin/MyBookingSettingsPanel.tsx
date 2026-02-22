import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { CalendarDays, Clock, Save, Trash2, Plus, Video, Power, HelpCircle, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const DAYS = ["Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag", "Søndag"];

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

const MyBookingSettingsPanel = () => {
  const { profile } = useAuth();
  const [bookingActive, setBookingActive] = useState(false);
  const [teamsLink, setTeamsLink] = useState("");
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [newBlockDate, setNewBlockDate] = useState("");
  const [newBlockReason, setNewBlockReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showTeamsGuide, setShowTeamsGuide] = useState(false);

  useEffect(() => {
    if (!profile) return;
    loadData();
  }, [profile]);

  const loadData = async () => {
    if (!profile) return;
    const { data: prof } = await supabase.from("profiles").select("booking_active, teams_link").eq("id", profile.id).single();
    if (prof) {
      setBookingActive((prof as any).booking_active ?? false);
      setTeamsLink((prof as any).teams_link ?? "");
    }

    const { data: avail } = await supabase.from("advisor_availability").select("*").eq("profile_id", profile.id).order("day_of_week");
    if (avail && avail.length > 0) {
      setAvailability(avail.map(a => ({ id: a.id, day_of_week: a.day_of_week, start_time: a.start_time, end_time: a.end_time, active: a.active })));
    } else {
      setAvailability([1, 2, 3, 4, 5].map(d => ({ day_of_week: d, start_time: "09:00", end_time: "17:00", active: true })));
    }

    const { data: blocked } = await supabase.from("advisor_blocked_dates").select("*").eq("profile_id", profile.id).order("blocked_date");
    setBlockedDates((blocked as BlockedDate[]) || []);
  };

  const saveAll = async () => {
    if (!profile) return;
    setSaving(true);
    await supabase.from("profiles").update({ booking_active: bookingActive, teams_link: teamsLink || null } as any).eq("id", profile.id);
    
    // Delete old and re-insert all
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

  const addBlockedDate = async () => {
    if (!profile || !newBlockDate) return;
    await supabase.from("advisor_blocked_dates").insert({ profile_id: profile.id, blocked_date: newBlockDate, reason: newBlockReason || null });
    setNewBlockDate(""); setNewBlockReason("");
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
      // No slots exist for this day — add a default one
      setAvailability(prev => [...prev, { day_of_week: dayIndex, start_time: "09:00", end_time: "17:00", active: true }]);
    } else {
      const anyActive = daySlots.some(s => s.active);
      if (anyActive) {
        // Turn day OFF — remove all slots for this day
        setAvailability(prev => prev.filter(a => a.day_of_week !== dayIndex));
      } else {
        // Turn day back ON — re-enable all slots
        setAvailability(prev => prev.map(a => a.day_of_week === dayIndex ? { ...a, active: true } : a));
      }
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <CalendarDays size={18} className="text-primary" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-sm font-medium">Min tilgjengelighet</p>
            <p className="text-[10px] text-muted-foreground">Styr når kunder kan booke deg for 1-1 møter</p>
          </div>
        </div>
        <button onClick={saveAll} disabled={saving}
          className="h-9 px-5 rounded-xl bg-primary text-primary-foreground text-xs font-medium flex items-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all">
          <Save size={13} />
          {saving ? "Lagrer…" : saved ? "Lagret ✓" : "Lagre alt"}
        </button>
      </div>

      {/* Active toggle + Teams link */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass rounded-2xl border border-border/20 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Power size={14} className={bookingActive ? "text-green-500" : "text-muted-foreground"} />
              <span className="text-sm font-medium">Tilgjengelig for booking</span>
            </div>
            <button onClick={() => setBookingActive(!bookingActive)}
              className={`w-12 h-7 rounded-full transition-all duration-300 relative ${bookingActive ? "bg-green-500" : "bg-muted"}`}>
              <motion.div className="w-5 h-5 bg-white rounded-full absolute top-1 shadow-sm" animate={{ left: bookingActive ? 26 : 4 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} />
            </button>
          </div>
          <p className="text-xs text-muted-foreground">{bookingActive ? "Du er synlig i bookingkalenderen." : "Du er skjult fra bookingkalenderen."}</p>
        </div>
        <div className="glass rounded-2xl border border-border/20 p-5">
          <div className="flex items-center gap-2 mb-3"><Video size={14} className="text-primary" /><span className="text-sm font-medium">Microsoft Teams-lenke</span></div>
          <input value={teamsLink} onChange={e => setTeamsLink(e.target.value)} placeholder="https://teams.microsoft.com/l/meetup-join/…"
            className="w-full h-9 rounded-xl border border-border/30 bg-muted/30 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30" />
          <p className="text-[10px] text-muted-foreground mt-2">Din faste Teams-møtelenke som sendes til kunder ved bekreftet booking.</p>
          <button onClick={() => setShowTeamsGuide(prev => !prev)} className="mt-3 text-[11px] text-primary hover:underline flex items-center gap-1">
            <HelpCircle size={12} /> {showTeamsGuide ? "Skjul brukermanual" : "Hvordan koble opp Teams?"}
          </button>
        </div>
      </div>

      {/* Teams setup guide */}
      {showTeamsGuide && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
          className="glass rounded-2xl border border-primary/20 p-5 bg-primary/5">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><Video size={14} className="text-primary" /> Brukermanual: Koble opp Microsoft Teams</h3>
          <div className="space-y-4 text-xs text-muted-foreground">
            <div>
              <p className="font-medium text-foreground mb-1 flex items-center gap-1"><ChevronRight size={12} className="text-primary" /> Steg 1 — Opprett et fast møterom i Teams</p>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li>Åpne <strong>Microsoft Teams</strong> (desktop eller web).</li>
                <li>Gå til <strong>Kalender</strong> i venstremenyen.</li>
                <li>Klikk <strong>«Nytt møte»</strong> øverst til høyre.</li>
                <li>Fyll inn tittel, f.eks. <em>«1-1 Regnskap – [Ditt navn]»</em>.</li>
                <li>Du trenger <strong>ikke</strong> legge til deltakere eller velge tidspunkt — dette er en gjenbrukbar lenke.</li>
                <li>Klikk <strong>«Lagre»</strong> for å opprette møtet.</li>
              </ol>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1 flex items-center gap-1"><ChevronRight size={12} className="text-primary" /> Steg 2 — Kopier møtelenken</p>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li>Åpne møtet du nettopp opprettet fra kalenderen.</li>
                <li>Finn feltet <strong>«Microsoft Teams-møte»</strong> eller <strong>«Bli med i Teams-møte»</strong>.</li>
                <li>Høyreklikk på lenken og velg <strong>«Kopier lenkeadresse»</strong>.</li>
                <li>Lenken ser typisk slik ut: <code className="bg-muted px-1.5 py-0.5 rounded text-[10px] break-all">https://teams.microsoft.com/l/meetup-join/...</code></li>
              </ol>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1 flex items-center gap-1"><ChevronRight size={12} className="text-primary" /> Steg 3 — Lim inn lenken her</p>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li>Lim inn den kopierte lenken i feltet <strong>«Microsoft Teams-lenke»</strong> over.</li>
                <li>Klikk <strong>«Lagre alt»</strong> øverst til høyre.</li>
                <li>Lenken blir nå automatisk sendt til kunder når en booking bekreftes.</li>
              </ol>
            </div>
            <div className="rounded-xl bg-primary/10 border border-primary/20 p-3 mt-2">
              <p className="font-medium text-foreground mb-1">💡 Tips</p>
              <ul className="list-disc list-inside space-y-1 ml-1">
                <li>Bruk én fast møtelenke — du trenger ikke opprette nytt møte for hver booking.</li>
                <li>Kunder mottar lenken automatisk i sin bekreftelses-e-post med ICS-kalenderfil.</li>
                <li>Du kan endre lenken når som helst ved å oppdatere feltet og lagre på nytt.</li>
                <li>Sørg for at «Tilgjengelig for booking» er slått <strong>på</strong> for å være synlig i bookingkalenderen.</li>
              </ul>
            </div>
          </div>
        </motion.div>
      )}

      {/* Weekly schedule with multiple slots */}
      <div className="glass rounded-2xl border border-border/20 p-5">
        <div className="flex items-center gap-2 mb-2"><Clock size={14} className="text-primary" /><span className="text-sm font-medium">Ukeplan</span></div>
        <p className="text-[11px] text-muted-foreground mb-4">Du kan legge til flere tidsrom per dag, f.eks. 08:00–10:00 og 11:00–12:00.</p>
        <div className="space-y-3">
          {DAYS.map((dayName, i) => {
            const dayIndex = i + 1;
            const daySlots = slotsByDay[dayIndex] || [];
            const isActive = daySlots.some(s => s.active);
            return (
              <div key={dayIndex} className={`rounded-xl border transition-all ${isActive ? "border-primary/20 bg-primary/5" : "border-border/10 bg-muted/20 opacity-60"}`}>
                <div className="flex items-center gap-3 p-3">
                  <button onClick={() => toggleDay(dayIndex)}
                    className={`w-8 h-8 rounded-lg text-xs font-medium flex items-center justify-center transition-all shrink-0 ${isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                    {dayName.slice(0, 2)}
                  </button>
                  <span className="text-xs w-16 shrink-0">{dayName}</span>
                  <div className="flex-1 space-y-2">
                    {!isActive && <span className="text-xs text-muted-foreground italic">Ikke tilgjengelig</span>}
                    {daySlots.map((slot, si) => slot.active && (
                      <div key={si} className="flex items-center gap-2">
                        <input type="time" value={slot.start_time} onChange={e => updateSlotTime(dayIndex, si, "start_time", e.target.value)}
                          className="h-8 rounded-lg border border-border/30 bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary/40" />
                        <span className="text-xs text-muted-foreground">—</span>
                        <input type="time" value={slot.end_time} onChange={e => updateSlotTime(dayIndex, si, "end_time", e.target.value)}
                          className="h-8 rounded-lg border border-border/30 bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary/40" />
                        {daySlots.filter(s => s.active).length > 1 && (
                          <button onClick={() => removeSlotFromDay(dayIndex, si)} className="text-muted-foreground hover:text-destructive transition-colors shrink-0">
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

      {/* Blocked dates */}
      <div className="glass rounded-2xl border border-border/20 p-5">
        <div className="flex items-center gap-2 mb-4"><CalendarDays size={14} className="text-destructive" /><span className="text-sm font-medium">Blokkerte datoer</span></div>
        <div className="flex gap-2 mb-4">
          <input type="date" value={newBlockDate} onChange={e => setNewBlockDate(e.target.value)}
            className="h-9 rounded-xl border border-border/30 bg-muted/30 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/40" />
          <input value={newBlockReason} onChange={e => setNewBlockReason(e.target.value)} placeholder="Grunn (valgfritt)"
            className="flex-1 h-9 rounded-xl border border-border/30 bg-muted/30 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/40" />
          <button onClick={addBlockedDate} disabled={!newBlockDate}
            className="h-9 px-4 rounded-xl bg-destructive/10 text-destructive text-xs font-medium hover:bg-destructive/20 disabled:opacity-50 flex items-center gap-1.5 transition-all">
            <Plus size={12} /> Blokker
          </button>
        </div>
        {blockedDates.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4">Ingen blokkerte datoer</p>
        ) : (
          <div className="space-y-1.5">
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
        )}
      </div>
    </div>
  );
};

export default MyBookingSettingsPanel;
