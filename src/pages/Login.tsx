import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, AlertCircle, ArrowLeft, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
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
    setError("");
    setLoading(true);
    const { error: signInError } = await signIn(email, password);
    if (signInError) {
      setError("Ugyldig e-post eller passord. Prøv igjen.");
      setLoading(false);
      return;
    }

    // Fetch profile to determine role-based redirect
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("Noe gikk galt. Prøv igjen.");
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle();

    if (profile?.role === "customer") {
      navigate("/kunde/dashboard");
    } else if (profile?.role === "admin" || profile?.role === "employee") {
      navigate("/admin/dashboard");
    } else {
      navigate("/");
    }
    setLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setForgotLoading(true);
    setError("");
    try {
      const { error: fnError } = await supabase.functions.invoke("reset-password", {
        body: { email: forgotEmail.trim() },
      });
      if (fnError) throw fnError;
      setForgotSent(true);
    } catch {
      setError("Kunne ikke sende tilbakestilling. Prøv igjen.");
    }
    setForgotLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        <div className="glass rounded-3xl p-8 md:p-10 border border-border/20 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
              <Lock size={22} className="text-primary" strokeWidth={1.5} />
            </div>
            <h1 className="font-heading text-3xl md:text-4xl text-center mb-1">Logg inn</h1>
            <p className="text-sm text-muted-foreground text-center">
              {showForgot ? "Tilbakestill passordet ditt" : "For kunder og ansatte i Avargo"}
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm mb-4">
              <AlertCircle size={15} className="shrink-0" />
              {error}
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
                <button type="button" onClick={() => { setShowForgot(false); setForgotSent(false); setForgotEmail(""); setError(""); }}
                  className="text-sm text-primary hover:underline cursor-pointer relative z-10">
                  Tilbake til innlogging
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs tracking-wider uppercase text-muted-foreground">E-post</label>
                  <input
                    type="email" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)}
                    placeholder="din@epost.no" required
                    className="h-11 w-full rounded-xl border border-border/30 bg-muted/30 px-4 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                  />
                </div>
                <button type="submit" disabled={forgotLoading}
                  className="mt-2 h-11 rounded-xl bg-primary text-primary-foreground text-sm font-medium tracking-wide hover:opacity-90 transition-all disabled:opacity-50 glow-rose">
                  {forgotLoading ? "Sender…" : "Send midlertidig passord"}
                </button>
                <button type="button" onClick={() => { setShowForgot(false); setError(""); }}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer relative z-10">
                  Tilbake til innlogging
                </button>
              </form>
            )
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs tracking-wider uppercase text-muted-foreground">E-post</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="din@epost.no" required
                  className="h-11 w-full rounded-xl border border-border/30 bg-muted/30 px-4 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs tracking-wider uppercase text-muted-foreground">Passord</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} value={password}
                    onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required
                    className="h-11 w-full rounded-xl border border-border/30 bg-muted/30 px-4 pr-10 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="mt-2 h-11 rounded-xl bg-primary text-primary-foreground text-sm font-medium tracking-wide hover:opacity-90 transition-all disabled:opacity-50 glow-rose">
                {loading ? "Logger inn…" : "Logg inn"}
              </button>
              <button type="button" onClick={() => { setShowForgot(true); setError(""); }}
                className="text-xs text-muted-foreground hover:text-primary transition-colors">
                Glemt passord?
              </button>
            </form>
          )}

          <div className="flex flex-col items-center gap-3 mt-6">
            <p className="text-xs text-muted-foreground/60">
              Kontakt din regnskapsfører for tilgang
            </p>
            <button type="button" onClick={() => window.history.length > 1 ? navigate(-1) : navigate("/")}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer relative z-10">
              <ArrowLeft size={13} /> Gå tilbake
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
