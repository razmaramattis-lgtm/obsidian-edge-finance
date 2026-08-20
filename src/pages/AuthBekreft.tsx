import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Check, Eye, EyeOff, Lock, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const REQUEST_TIMEOUT_MS = 15_000;

const AuthBekreft = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    const checkRecoverySession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!active) return;
      setReady(Boolean(session));
      if (!session) {
        setError("Lenken er ugyldig eller utløpt. Be om en ny tilbakestillings-e-post.");
      }
    };

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      if (event === "PASSWORD_RECOVERY" || session) {
        setReady(true);
        setError("");
      }
    });

    void checkRecoverySession();
    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Passordet må inneholde minst 8 tegn.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passordene er ikke like.");
      return;
    }

    setLoading(true);
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    try {
      const timeout = new Promise<never>((_, reject) => {
        timeoutId = setTimeout(
          () => reject(new Error("Tjenesten bruker for lang tid. Prøv igjen om litt.")),
          REQUEST_TIMEOUT_MS,
        );
      });
      const { error: updateError } = await Promise.race([
        supabase.auth.updateUser({ password }),
        timeout,
      ]);
      if (updateError) throw updateError;
      setSuccess(true);
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Kunne ikke lagre passordet.");
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md glass rounded-3xl p-8 border border-border/20 text-center">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
          {success ? <Check size={26} className="text-primary" /> : <ShieldCheck size={26} className="text-primary" />}
        </div>

        {success ? (
          <>
            <h1 className="font-heading text-2xl mb-2">Passordet er oppdatert</h1>
            <p className="text-sm text-muted-foreground mb-6">Du kan nå logge inn med det nye passordet.</p>
            <button
              type="button"
              onClick={() => navigate("/logg-inn", { replace: true })}
              className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
            >
              Gå til innlogging
            </button>
          </>
        ) : (
          <>
            <h1 className="font-heading text-2xl mb-2">Velg nytt passord</h1>
            <p className="text-sm text-muted-foreground mb-6">Skriv inn det nye passordet ditt to ganger.</p>

            {error && (
              <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm text-left mb-4">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {ready && (
              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Nytt passord</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      minLength={8}
                      required
                      autoComplete="new-password"
                      className="w-full h-11 rounded-xl border border-border/30 bg-muted/30 px-4 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      aria-label={showPassword ? "Skjul passord" : "Vis passord"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Gjenta nytt passord</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    minLength={8}
                    required
                    autoComplete="new-password"
                    className="w-full h-11 rounded-xl border border-border/30 bg-muted/30 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50 inline-flex items-center justify-center gap-2"
                >
                  <Lock size={16} />
                  {loading ? "Lagrer…" : "Lagre nytt passord"}
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AuthBekreft;