import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Camera, X, Check } from "lucide-react";
import { uploadFile } from "./helpers";

const COVER_TEMPLATES = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
  "linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)",
  "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
  "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
  "linear-gradient(135deg, #0c3483 0%, #a2b6df 100%)",
  "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
  "linear-gradient(135deg, #2b5876 0%, #4e4376 100%)",
];

interface Props {
  groupId: string;
  currentCover: string | null;
  currentAvatar: string | null;
  groupName: string;
  onUpdate: () => void;
  onClose: () => void;
}

const GroupCoverPicker = ({ groupId, currentCover, currentAvatar, groupName, onUpdate, onClose }: Props) => {
  const [selectedCover, setSelectedCover] = useState(currentCover || "");
  const [avatarPreview, setAvatarPreview] = useState(currentAvatar || "");
  const [uploading, setUploading] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const uploadImage = async (file: File, type: "cover" | "avatar") => {
    setUploading(true);
    const result = await uploadFile(supabase, "workspace-uploads", `groups/${groupId}/${type}`, file);
    if (result) {
      if (type === "cover") setSelectedCover(result.url);
      else setAvatarPreview(result.url);
    }
    setUploading(false);
  };

  const save = async () => {
    setUploading(true);
    await supabase.from("workspace_groups").update({
      cover_url: selectedCover || null,
      avatar_url: avatarPreview || null,
    } as any).eq("id", groupId);
    setUploading(false);
    onUpdate();
    onClose();
  };

  const isGradient = (v: string) => v.startsWith("linear-gradient");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div className="w-full max-w-lg bg-card border border-border/30 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
        <div className="px-5 py-4 border-b border-border/15 flex items-center justify-between">
          <h3 className="text-sm font-semibold" style={{ fontFamily: "Outfit, sans-serif" }}>Tilpass gruppe</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all"><X size={16} /></button>
        </div>

        <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Cover preview */}
          <div>
            <p className="text-xs font-medium mb-2">Bakgrunnsbilde</p>
            <div
              className="h-32 rounded-xl overflow-hidden relative border border-border/20"
              style={isGradient(selectedCover) ? { background: selectedCover } : selectedCover ? { backgroundImage: `url(${selectedCover})`, backgroundSize: "cover", backgroundPosition: "center" } : { background: "hsl(var(--muted)/0.3)" }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              {/* Avatar overlay */}
              <div className="absolute bottom-3 left-4 flex items-end gap-3">
                <div
                  className="w-14 h-14 rounded-xl border-2 border-background overflow-hidden bg-muted/40 cursor-pointer hover:ring-2 hover:ring-primary/40 transition-all relative group/avatar"
                  onClick={() => avatarInputRef.current?.click()}
                >
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg bg-gradient-to-br from-primary to-primary/60">
                      {groupName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center transition-all">
                    <Camera size={16} className="text-white" />
                  </div>
                </div>
                <span className="text-white text-sm font-semibold drop-shadow-md mb-1">{groupName}</span>
              </div>
            </div>
          </div>

          {/* Template covers */}
          <div>
            <p className="text-xs font-medium mb-2">Velg en mal</p>
            <div className="grid grid-cols-4 gap-2">
              {COVER_TEMPLATES.map((tmpl, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedCover(tmpl)}
                  className={`h-14 rounded-xl transition-all hover:scale-105 ${selectedCover === tmpl ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : "hover:ring-1 hover:ring-border"}`}
                  style={{ background: tmpl }}
                />
              ))}
            </div>
          </div>

          {/* Custom upload */}
          <div>
            <p className="text-xs font-medium mb-2">Eller last opp eget bilde</p>
            <div className="flex gap-2">
              <button onClick={() => coverInputRef.current?.click()} className="flex-1 py-3 rounded-xl border-2 border-dashed border-border/30 hover:border-primary/30 text-muted-foreground hover:text-primary text-xs flex items-center justify-center gap-2 transition-all">
                <Camera size={14} /> Bakgrunnsbilde
              </button>
              <button onClick={() => avatarInputRef.current?.click()} className="flex-1 py-3 rounded-xl border-2 border-dashed border-border/30 hover:border-primary/30 text-muted-foreground hover:text-primary text-xs flex items-center justify-center gap-2 transition-all">
                <Camera size={14} /> Gruppebilde
              </button>
            </div>
          </div>

          {selectedCover && !isGradient(selectedCover) && currentCover !== selectedCover && (
            <button onClick={() => setSelectedCover("")} className="text-[10px] text-muted-foreground hover:text-destructive transition-all">
              Fjern bakgrunnsbilde
            </button>
          )}
        </div>

        <div className="px-5 py-4 border-t border-border/15 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-xs text-muted-foreground hover:bg-muted/40 transition-all">Avbryt</button>
          <button onClick={save} disabled={uploading} className="px-5 py-2 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-xs font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-1.5">
            <Check size={12} /> Lagre
          </button>
        </div>

        <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && uploadImage(e.target.files[0], "cover")} />
        <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && uploadImage(e.target.files[0], "avatar")} />
      </div>
    </div>
  );
};

export default GroupCoverPicker;
