import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Save, X, Plus, Briefcase, Building2, Star, Heart, FileText, Calculator, Pencil, Phone } from "lucide-react";
import type { Profile } from "./types";
import { toast } from "sonner";

interface ProfileEditViewProps {
  profile: Profile;
  onUpdated?: () => void;
}

const ACCOUNTING_SYSTEMS = [
  "Tripletex", "Fiken", "Visma eAccounting", "Visma Business", "PowerOffice Go",
  "Xledger", "24SevenOffice", "Duett", "SpareBank 1 Regnskap", "DNB Regnskap",
  "Uni Economy", "SAP", "Annet",
];

const ProfileEditView = ({ profile, onUpdated }: ProfileEditViewProps) => {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(profile.title || "");
  const [department, setDepartment] = useState(profile.department || "");
  const [bio, setBio] = useState(profile.bio || "");
  const [phone, setPhone] = useState(profile.phone || "");

  // Tags-based specialty
  const [specialtyTags, setSpecialtyTags] = useState<string[]>(
    profile.specialty ? profile.specialty.split(",").map(s => s.trim()).filter(Boolean) : []
  );
  const [newSpecialty, setNewSpecialty] = useState("");

  const [interests, setInterests] = useState<string[]>(profile.interests || []);
  const [newInterest, setNewInterest] = useState("");

  const [accountingSystems, setAccountingSystems] = useState<string[]>(profile.preferred_accounting_systems || []);

  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    await supabase.from("profiles").update({
      title: title.trim() || null,
      department: department.trim() || null,
      phone: phone.trim() || null,
      specialty: specialtyTags.join(", ") || null,
      interests,
      bio: bio.trim() || null,
      preferred_accounting_systems: accountingSystems,
    }).eq("id", profile.id);
    toast.success("Profil oppdatert");
    setSaving(false);
    setEditing(false);
    onUpdated?.();
  };

  const addTag = (list: string[], setList: (v: string[]) => void, value: string, setValue: (v: string) => void) => {
    const v = value.trim();
    if (v && !list.includes(v)) {
      setList([...list, v]);
      setValue("");
    }
  };

  const removeTag = (list: string[], setList: (v: string[]) => void, idx: number) => {
    setList(list.filter((_, i) => i !== idx));
  };

  const toggleSystem = (sys: string) => {
    setAccountingSystems(prev =>
      prev.includes(sys) ? prev.filter(s => s !== sys) : [...prev, sys]
    );
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold" style={{ fontFamily: "Outfit, sans-serif" }}>Profilinformasjon</h3>
        {!editing ? (
          <button onClick={() => setEditing(true)} className="px-4 py-2 rounded-xl bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-all flex items-center gap-1.5">
            <Pencil size={11} /> Rediger
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={() => setEditing(false)} className="px-3 py-2 rounded-xl bg-muted/50 text-muted-foreground text-xs">Avbryt</button>
            <button onClick={save} disabled={saving} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold disabled:opacity-50 flex items-center gap-1.5"><Save size={12} /> Lagre</button>
          </div>
        )}
      </div>

      {editing ? (
        <div className="space-y-5">
          {/* Title & Department */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-1.5"><Briefcase size={10} /> Rolle / Tittel</label>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="F.eks. Regnskapsfører" className="w-full h-10 rounded-xl border border-border/20 bg-muted/20 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/20" />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-1.5"><Building2 size={10} /> Avdeling</label>
              <input value={department} onChange={e => setDepartment(e.target.value)} placeholder="F.eks. Regnskap, Teknologi" className="w-full h-10 rounded-xl border border-border/20 bg-muted/20 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/20" />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-1.5"><Phone size={10} /> Telefon</label>
              <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="F.eks. 912 34 567" className="w-full h-10 rounded-xl border border-border/20 bg-muted/20 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/20" />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-1.5"><FileText size={10} /> Om meg</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Skriv litt om deg selv…" rows={4} className="w-full rounded-xl border border-border/20 bg-muted/20 px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/20 resize-none" />
          </div>

          {/* Specialty tags */}
          <div>
            <label className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-1.5"><Star size={10} /> Spesialisering</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {specialtyTags.map((tag, i) => (
                <span key={i} className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  {tag}
                  <button onClick={() => removeTag(specialtyTags, setSpecialtyTags, i)} className="hover:text-destructive transition-colors"><X size={10} /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={newSpecialty} onChange={e => setNewSpecialty(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTag(specialtyTags, setSpecialtyTags, newSpecialty, setNewSpecialty))} placeholder="Legg til spesialisering…" className="flex-1 h-9 rounded-xl border border-border/20 bg-muted/20 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/20" />
              <button onClick={() => addTag(specialtyTags, setSpecialtyTags, newSpecialty, setNewSpecialty)} disabled={!newSpecialty.trim()} className="px-3 h-9 rounded-xl bg-primary/10 text-primary text-xs font-medium disabled:opacity-30"><Plus size={12} /></button>
            </div>
          </div>

          {/* Interest tags */}
          <div>
            <label className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-1.5"><Heart size={10} /> Interesser</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {interests.map((tag, i) => (
                <span key={i} className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-medium">
                  {tag}
                  <button onClick={() => removeTag(interests, setInterests, i)} className="hover:text-destructive transition-colors"><X size={10} /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={newInterest} onChange={e => setNewInterest(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTag(interests, setInterests, newInterest, setNewInterest))} placeholder="Legg til interesse…" className="flex-1 h-9 rounded-xl border border-border/20 bg-muted/20 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/20" />
              <button onClick={() => addTag(interests, setInterests, newInterest, setNewInterest)} disabled={!newInterest.trim()} className="px-3 h-9 rounded-xl bg-accent/10 text-accent text-xs font-medium disabled:opacity-30"><Plus size={12} /></button>
            </div>
          </div>

          {/* Preferred accounting systems */}
          <div>
            <label className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-1.5"><Calculator size={10} /> Foretrukne regnskapssystemer</label>
            <div className="flex flex-wrap gap-1.5">
              {ACCOUNTING_SYSTEMS.map(sys => (
                <button
                  key={sys}
                  type="button"
                  onClick={() => toggleSystem(sys)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                    accountingSystems.includes(sys)
                      ? "bg-secondary/15 text-secondary border-secondary/30"
                      : "bg-muted/20 text-muted-foreground border-border/20 hover:bg-muted/40 hover:text-foreground"
                  }`}
                >
                  {sys}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Info grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-2xl border border-border/15 bg-card/60 p-5">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1"><Briefcase size={9} /> Rolle / Tittel</p>
              <p className="text-sm font-medium mt-0.5">{profile.title || <span className="text-muted-foreground/50 italic">Ikke angitt</span>}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1"><Building2 size={9} /> Avdeling</p>
              <p className="text-sm font-medium mt-0.5">{profile.department || <span className="text-muted-foreground/50 italic">Ikke angitt</span>}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1"><Phone size={9} /> Telefon</p>
              <p className="text-sm font-medium mt-0.5">{profile.phone || <span className="text-muted-foreground/50 italic">Ikke angitt</span>}</p>
            </div>
          </div>

          {/* Bio */}
          <div className="rounded-2xl border border-border/15 bg-card/60 p-5">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1 mb-2"><FileText size={9} /> Om meg</p>
            {profile.bio ? (
              <p className="text-sm leading-relaxed">{profile.bio}</p>
            ) : (
              <p className="text-sm text-muted-foreground/50 italic">Ingen beskrivelse lagt til</p>
            )}
          </div>

          {/* Specialty tags */}
          <div className="rounded-2xl border border-border/15 bg-card/60 p-5">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1 mb-2"><Star size={9} /> Spesialisering</p>
            <div className="flex flex-wrap gap-1.5">
              {(profile.specialty ? profile.specialty.split(",").map(s => s.trim()).filter(Boolean) : []).length > 0
                ? profile.specialty!.split(",").map(s => s.trim()).filter(Boolean).map((tag, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">{tag}</span>
                  ))
                : <span className="text-sm text-muted-foreground/50 italic">Ingen spesialisering lagt til</span>
              }
            </div>
          </div>

          {/* Interest tags */}
          <div className="rounded-2xl border border-border/15 bg-card/60 p-5">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1 mb-2"><Heart size={9} /> Interesser</p>
            <div className="flex flex-wrap gap-1.5">
              {(profile.interests && profile.interests.length > 0) ? profile.interests.map((tag, i) => (
                <span key={i} className="px-3 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-medium">{tag}</span>
              )) : <span className="text-sm text-muted-foreground/50 italic">Ingen interesser lagt til</span>}
            </div>
          </div>

          {/* Accounting systems */}
          <div className="rounded-2xl border border-border/15 bg-card/60 p-5">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1 mb-2"><Calculator size={9} /> Foretrukne regnskapssystemer</p>
            <div className="flex flex-wrap gap-1.5">
              {(profile.preferred_accounting_systems && profile.preferred_accounting_systems.length > 0)
                ? profile.preferred_accounting_systems.map((sys, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-full bg-secondary/15 text-secondary text-xs font-medium">{sys}</span>
                  ))
                : <span className="text-sm text-muted-foreground/50 italic">Ingen systemer valgt</span>
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileEditView;
