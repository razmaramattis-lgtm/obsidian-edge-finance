import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Key, User, Check, Camera, Phone, Mail, Briefcase, Sparkles, Save, CalendarDays, Clock, Trash2, Plus, Video, Power, Users, UserPlus } from "lucide-react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmployeesPanel from "@/components/admin/EmployeesPanel";

/* ─────────── Availability sub-panel (moved from MyBookingSettingsPanel) ─────────── */

const DAYS = ["Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag", "Søndag"];

interface Availability {
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

const AvailabilityTab = () => {
  const { profile } = useAuth();
  const [bookingActive, setBookingActive] = useState(false);
  const [teamsLink, setTeamsLink] = useState("");
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [newBlockDate, setNewBlockDate] = useState("");
  const [newBlockReason, setNewBlockReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { if (profile) loadData(); }, [profile]);

  const loadData = async () => {
    if (!profile) return;
    const { data: prof } = await supabase.from("profiles").select("booking_active, teams_link").eq("id", profile.id).single();
    if (prof) { setBookingActive((prof as any).booking_active ?? false); setTeamsLink((prof as any).teams_link ?? ""); }

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
    for (const slot of availability) {
      if (slot.id) {
        await supabase.from("advisor_availability").update({ start_time: slot.start_time, end_time: slot.end_time, active: slot.active }).eq("id", slot.id);
      } else {
        const { data } = await supabase.from("advisor_availability").insert({ profile_id: profile.id, day_of_week: slot.day_of_week, start_time: slot.start_time, end_time: slot.end_time, active: slot.active }).select().single();
        if (data) slot.id = data.id;
      }
    }
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000);
  };

  const addBlockedDate = async () => {
    if (!profile || !newBlockDate) return;
    await supabase.from("advisor_blocked_dates").insert({ profile_id: profile.id, blocked_date: newBlockDate, reason: newBlockReason || null });
    setNewBlockDate(""); setNewBlockReason(""); loadData();
  };

  const removeBlockedDate = async (id: string) => {
    await supabase.from("advisor_blocked_dates").delete().eq("id", id);
    setBlockedDates(prev => prev.filter(d => d.id !== id));
  };

  const toggleDay = (dayIndex: number) => setAvailability(prev => prev.map(a => a.day_of_week === dayIndex ? { ...a, active: !a.active } : a));
  const updateTime = (dayIndex: number, field: "start_time" | "end_time", value: string) => setAvailability(prev => prev.map(a => a.day_of_week === dayIndex ? { ...a, [field]: value } : a));
  const addDay = (dayIndex: number) => {
    if (availability.some(a => a.day_of_week === dayIndex)) return;
    setAvailability(prev => [...prev, { day_of_week: dayIndex, start_time: "09:00", end_time: "17:00", active: true }].sort((a, b) => a.day_of_week - b.day_of_week));
  };
  const missingDays = [1, 2, 3, 4, 5, 6, 7].filter(d => !availability.some(a => a.day_of_week === d));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">Styr når kunder kan booke deg for 1-1 møter</p>
        <button onClick={saveAll} disabled={saving} className="h-9 px-5 rounded-xl bg-primary text-primary-foreground text-xs font-medium flex items-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all">
          <Save size={13} /> {saving ? "Lagrer…" : saved ? "Lagret ✓" : "Lagre alt"}
        </button>
      </div>

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
        </div>
      </div>

      <div className="glass rounded-2xl border border-border/20 p-5">
        <div className="flex items-center gap-2 mb-4"><Clock size={14} className="text-primary" /><span className="text-sm font-medium">Ukeplan</span></div>
        <div className="space-y-2">
          {availability.map(slot => (
            <div key={slot.day_of_week} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${slot.active ? "border-primary/20 bg-primary/5" : "border-border/10 bg-muted/20 opacity-60"}`}>
              <button onClick={() => toggleDay(slot.day_of_week)} className={`w-8 h-8 rounded-lg text-xs font-medium flex items-center justify-center transition-all ${slot.active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                {DAYS[slot.day_of_week - 1]?.slice(0, 2)}
              </button>
              <span className="text-xs w-16 shrink-0">{DAYS[slot.day_of_week - 1]}</span>
              {slot.active ? (
                <div className="flex items-center gap-2 flex-1">
                  <input type="time" value={slot.start_time} onChange={e => updateTime(slot.day_of_week, "start_time", e.target.value)} className="h-8 rounded-lg border border-border/30 bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary/40" />
                  <span className="text-xs text-muted-foreground">—</span>
                  <input type="time" value={slot.end_time} onChange={e => updateTime(slot.day_of_week, "end_time", e.target.value)} className="h-8 rounded-lg border border-border/30 bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary/40" />
                </div>
              ) : <span className="text-xs text-muted-foreground italic flex-1">Ikke tilgjengelig</span>}
            </div>
          ))}
        </div>
        {missingDays.length > 0 && (
          <div className="mt-3 flex gap-2 flex-wrap">
            {missingDays.map(d => (
              <button key={d} onClick={() => addDay(d)} className="h-7 px-3 rounded-lg border border-dashed border-border/30 text-[11px] text-muted-foreground hover:text-foreground hover:border-primary/30 flex items-center gap-1 transition-all">
                <Plus size={10} /> {DAYS[d - 1]}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="glass rounded-2xl border border-border/20 p-5">
        <div className="flex items-center gap-2 mb-4"><CalendarDays size={14} className="text-destructive" /><span className="text-sm font-medium">Blokkerte datoer</span></div>
        <div className="flex gap-2 mb-4">
          <input type="date" value={newBlockDate} onChange={e => setNewBlockDate(e.target.value)} className="h-9 rounded-xl border border-border/30 bg-muted/30 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/40" />
          <input value={newBlockReason} onChange={e => setNewBlockReason(e.target.value)} placeholder="Grunn (valgfritt)" className="flex-1 h-9 rounded-xl border border-border/30 bg-muted/30 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/40" />
          <button onClick={addBlockedDate} disabled={!newBlockDate} className="h-9 px-4 rounded-xl bg-destructive/10 text-destructive text-xs font-medium hover:bg-destructive/20 disabled:opacity-50 flex items-center gap-1.5 transition-all"><Plus size={12} /> Blokker</button>
        </div>
        {blockedDates.length === 0 ? <p className="text-xs text-muted-foreground text-center py-4">Ingen blokkerte datoer</p> : (
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

/* ─────────── Profile tab ─────────── */

const ProfileTab = () => {
  const { profile } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [title, setTitle] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Password
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [pwSuccess, setPwSuccess] = useState("");
  const [pwError, setPwError] = useState("");

  useEffect(() => {
    if (!profile) return;
    loadProfile();
  }, [profile]);

  const loadProfile = async () => {
    if (!profile) return;
    const { data } = await supabase.from("profiles").select("*").eq("id", profile.id).single();
    if (data) {
      setName(data.name || "");
      setEmail(data.email || "");
      setPhone((data as any).phone || "");
      setTitle((data as any).title || "");
      setSpecialty((data as any).specialty || "");
      setBio((data as any).bio || "");
      setAvatarUrl((data as any).avatar_url || "");
    }
  };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    await supabase.from("profiles").update({
      name, phone, title, specialty, bio, avatar_url: avatarUrl || null
    } as any).eq("id", profile.id);
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000);
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
            <label className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1.5"><Sparkles size={12} /> Spesialfelt</label>
            <input value={specialty} onChange={e => setSpecialty(e.target.value)} className={inputClass} placeholder="Skatteplanlegging, MVA, lønn…" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs text-muted-foreground mb-1.5">Kort bio</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} className="w-full rounded-xl border border-border/30 bg-muted/30 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all resize-none" placeholder="Fortell litt om deg selv og din erfaring…" />
          </div>
        </div>
      </form>

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
      </TabsList>

      <TabsContent value="profile"><ProfileTab /></TabsContent>
      <TabsContent value="availability"><AvailabilityTab /></TabsContent>
      {isAdmin && <TabsContent value="employees"><EmployeesPanel /></TabsContent>}
    </Tabs>
  );
};

export default SettingsPanel;
