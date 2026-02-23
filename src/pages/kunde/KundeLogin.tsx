import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, AlertCircle, Lock, ArrowLeft, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const KundeLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await signIn(email, password);
    if (error) {
      setError("Feil e-post eller passord.");
      setLoading(false);
    } else {
      navigate("/kunde/dashboard");
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setForgotLoading(true);
    setError("");
    try {
      const { error } = await supabase.functions.invoke("reset-password", {
        body: { email: forgotEmail.trim() },
      });
      if (error) throw error;
      setForgotSent(true);
    } catch {
      setError("Kunne ikke sende tilbakestilling. Prøv igjen.");
    }
    setForgotLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md mx-4"
      >
        <div className="glass rounded-3xl p-8 border border-border/20 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Lock size={24} className="text-primary" />
            </div>
            <h1 className="font-heading text-2xl mb-1">Kundeportal</h1>
            <p className="text-sm text-muted-foreground">
              {showForgot ? "Tilbakestill passordet ditt" : "Logg inn med din tildelte konto"}
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-destructive/10 text-destructive rounded-xl px-4 py-3 text-sm mb-4">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          {showForgot ? (
            forgotSent ? (
              <div className="text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Check size={24} className="text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Hvis e-posten er registrert, har vi sendt et midlertidig passord til <strong>{forgotEmail}</strong>.
                </p>
                <button onClick={() => { setShowForgot(false); setForgotSent(false); setForgotEmail(""); }}
                  className="text-sm text-primary hover:underline">
                  Tilbake til innlogging
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">E-post</label>
                  <input type="email" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)}
                    required placeholder="din@epost.no"
                    className="w-full h-11 rounded-xl border border-border/30 bg-muted/30 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <button type="submit" disabled={forgotLoading}
                  className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50">
                  {forgotLoading ? "Sender…" : "Send midlertidig passord"}
                </button>
                <button type="button" onClick={() => { setShowForgot(false); setError(""); }}
                  className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Tilbake til innlogging
                </button>
              </form>
            )
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">E-post</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  required placeholder="din@epost.no"
                  className="w-full h-11 rounded-xl border border-border/30 bg-muted/30 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Passord</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} value={password}
                    onChange={e => setPassword(e.target.value)} required placeholder="••••••••"
                    className="w-full h-11 rounded-xl border border-border/30 bg-muted/30 px-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50">
                {loading ? "Logger inn…" : "Logg inn"}
              </button>
              <button type="button" onClick={() => { setShowForgot(true); setError(""); }}
                className="w-full text-xs text-muted-foreground hover:text-primary transition-colors">
                Glemt passord?
              </button>
            </form>
          )}

          <div className="flex flex-col items-center gap-3 mt-6">
            <p className="text-xs text-muted-foreground">
              Kontakt din regnskapsfører for tilgang
            </p>
            <button type="button" onClick={() => window.history.length > 1 ? navigate(-1) : navigate("/")}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft size={13} /> Gå tilbake
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default KundeLogin;
