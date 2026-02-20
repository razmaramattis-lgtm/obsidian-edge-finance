import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Key, User, Check } from "lucide-react";

const SettingsPanel = () => {
  const { profile } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) { setError("Passordene stemmer ikke overens."); return; }
    if (newPassword.length < 6) { setError("Passord må være minst 6 tegn."); return; }
    setLoading(true); setError(""); setSuccess("");

    const { error: err } = await supabase.auth.updateUser({ password: newPassword });
    if (err) {
      setError("Kunne ikke oppdatere passordet. Prøv å logge ut og inn igjen.");
    } else {
      setSuccess("Passordet er oppdatert!");
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 max-w-md">
      <div className="glass rounded-2xl p-5 border border-border/20">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
            {profile?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium">{profile?.name}</p>
            <p className="text-xs text-muted-foreground">{profile?.email}</p>
            <span className="text-[10px] tracking-widest uppercase text-primary border border-primary/30 px-2 py-0.5 rounded-full">{profile?.role}</span>
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-5 border border-border/20">
        <div className="flex items-center gap-2 mb-5">
          <Key size={16} className="text-primary" strokeWidth={1.5} />
          <h3 className="font-medium">Endre passord</h3>
        </div>
        <form onSubmit={changePassword} className="space-y-3">
          <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Nytt passord" required
            className="w-full h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
          <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Bekreft nytt passord" required
            className="w-full h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
          {error && <p className="text-destructive text-xs">{error}</p>}
          {success && (
            <div className="flex items-center gap-2 text-xs text-primary">
              <Check size={13} /> {success}
            </div>
          )}
          <button type="submit" disabled={loading}
            className="w-full h-10 rounded-xl bg-primary text-primary-foreground text-sm hover:opacity-90 disabled:opacity-50 transition-all">
            {loading ? "Oppdaterer…" : "Oppdater passord"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SettingsPanel;
