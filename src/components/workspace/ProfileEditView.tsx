import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Camera, Save, X, Plus, Briefcase, Building2, Star, Heart } from "lucide-react";
import UserAvatar from "./UserAvatar";
import type { Profile } from "./types";
import { roleLabel } from "./helpers";
import { toast } from "sonner";

interface ProfileEditViewProps {
  profile: Profile;
  onUpdated?: () => void;
}

const ProfileEditView = ({ profile, onUpdated }: ProfileEditViewProps) => {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(profile.title || "");
  const [department, setDepartment] = useState(profile.department || "");
  const [specialty, setSpecialty] = useState(profile.specialty || "");
  const [interests, setInterests] = useState<string[]>(profile.interests || []);
  const [newInterest, setNewInterest] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const uploadAvatar = async (file: File) => {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `avatars/${profile.id}-${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("workspace-uploads").upload(path, file);
      if (error) throw error;
      const { data } = supabase.storage.from("workspace-uploads").getPublicUrl(path);
      await supabase.from("profiles").update({ avatar_url: data.publicUrl }).eq("id", profile.id);
      toast.success("Profilbilde oppdatert");
      onUpdated?.();
    } catch {
      toast.error("Kunne ikke laste opp bilde");
    }
    setUploading(false);
  };

  const save = async () => {
    setSaving(true);
    await supabase.from("profiles").update({
      title: title.trim() || null,
      department: department.trim() || null,
      specialty: specialty.trim() || null,
      interests,
    }).eq("id", profile.id);
    toast.success("Profil oppdatert");
    setSaving(false);
    setEditing(false);
    onUpdated?.();
  };

  const addInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      setInterests([...interests, newInterest.trim()]);
      setNewInterest("");
    }
  };

  const removeInterest = (i: number) => {
    setInterests(interests.filter((_, idx) => idx !== i));
  };

  return (
    <div className="rounded-2xl border border-border/15 bg-card/60 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold" style={{ fontFamily: "Outfit, sans-serif" }}>Profilinformasjon</h3>
        {!editing ? (
          <button onClick={() => setEditing(true)} className="px-4 py-2 rounded-xl bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-all">Rediger</button>
        ) : (
          <div className="flex gap-2">
            <button onClick={() => setEditing(false)} className="px-3 py-2 rounded-xl bg-muted/50 text-muted-foreground text-xs">Avbryt</button>
            <button onClick={save} disabled={saving} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold disabled:opacity-50 flex items-center gap-1.5"><Save size={12} /> Lagre</button>
          </div>
        )}
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="relative group">
          <div className="w-20 h-20">
            <UserAvatar name={profile.name} avatarUrl={profile.avatar_url} size="xl" />
          </div>
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-all"
          >
            {uploading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Camera size={20} />}
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) uploadAvatar(f); }} />
        </div>
        <div>
          <p className="font-semibold">{profile.name}</p>
          <p className="text-xs text-muted-foreground">{profile.email}</p>
          <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium">{roleLabel(profile.role)}</span>
        </div>
      </div>

      {editing ? (
        <div className="space-y-4">
          <div>
            <label className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-1.5"><Briefcase size={10} /> Rolle / Tittel</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="F.eks. Regnskapsfører, Daglig leder" className="w-full h-10 rounded-xl border border-border/20 bg-muted/20 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/20" />
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-1.5"><Building2 size={10} /> Avdeling</label>
            <input value={department} onChange={e => setDepartment(e.target.value)} placeholder="F.eks. Regnskap, Teknologi, Salg" className="w-full h-10 rounded-xl border border-border/20 bg-muted/20 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/20" />
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-1.5"><Star size={10} /> Spesialisering</label>
            <input value={specialty} onChange={e => setSpecialty(e.target.value)} placeholder="F.eks. Skatt, MVA, Lønn" className="w-full h-10 rounded-xl border border-border/20 bg-muted/20 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/20" />
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-1.5"><Heart size={10} /> Interesser</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {interests.map((interest, i) => (
                <span key={i} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent/10 text-accent text-xs">
                  {interest}
                  <button onClick={() => removeInterest(i)} className="hover:text-destructive transition-colors"><X size={10} /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={newInterest} onChange={e => setNewInterest(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addInterest())} placeholder="Legg til interesse…" className="flex-1 h-9 rounded-xl border border-border/20 bg-muted/20 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/20" />
              <button onClick={addInterest} disabled={!newInterest.trim()} className="px-3 h-9 rounded-xl bg-accent/10 text-accent text-xs font-medium disabled:opacity-30"><Plus size={12} /></button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1"><Briefcase size={9} /> Rolle / Tittel</p>
            <p className="text-sm font-medium mt-0.5">{profile.title || <span className="text-muted-foreground/50 italic">Ikke angitt</span>}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1"><Building2 size={9} /> Avdeling</p>
            <p className="text-sm font-medium mt-0.5">{profile.department || <span className="text-muted-foreground/50 italic">Ikke angitt</span>}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1"><Star size={9} /> Spesialisering</p>
            <p className="text-sm font-medium mt-0.5">{profile.specialty || <span className="text-muted-foreground/50 italic">Ikke angitt</span>}</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1"><Heart size={9} /> Interesser</p>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {(profile.interests && profile.interests.length > 0) ? profile.interests.map((interest, i) => (
                <span key={i} className="px-2.5 py-1 rounded-full bg-accent/10 text-accent text-xs">{interest}</span>
              )) : <span className="text-sm text-muted-foreground/50 italic">Ingen interesser lagt til</span>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileEditView;
