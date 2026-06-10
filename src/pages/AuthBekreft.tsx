import { useMemo, useState } from "react";
import { Lock, ShieldCheck } from "lucide-react";

const AuthBekreft = () => {
  const [loading, setLoading] = useState(false);

  const target = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get("to");
    if (!raw) return null;
    try {
      const decoded = decodeURIComponent(raw);
      // Only allow Supabase verify URLs
      const url = new URL(decoded);
      if (!/supabase\.co$/.test(url.hostname)) return null;
      return decoded;
    } catch {
      return null;
    }
  }, []);

  const handleContinue = () => {
    if (!target) return;
    setLoading(true);
    window.location.href = target;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md glass rounded-3xl p-8 border border-border/20 text-center">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
          <ShieldCheck size={26} className="text-primary" />
        </div>
        <h1 className="font-heading text-2xl mb-2">Bekreft tilbakestilling</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Klikk på knappen under for å fortsette til sikker tilbakestilling av passord. Vi bruker dette ekstra steget for å beskytte lenken mot automatiske skannere i e-postsystemer.
        </p>

        {target ? (
          <button
            onClick={handleContinue}
            disabled={loading}
            className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50 inline-flex items-center justify-center gap-2"
          >
            <Lock size={16} />
            {loading ? "Åpner…" : "Fortsett til sikker tilbakestilling"}
          </button>
        ) : (
          <p className="text-sm text-destructive">
            Lenken er ugyldig eller utløpt. Be om en ny tilbakestillings-e-post.
          </p>
        )}

        <p className="text-xs text-muted-foreground mt-6">
          Av sikkerhetsgrunner kan lenken kun brukes én gang.
        </p>
      </div>
    </div>
  );
};

export default AuthBekreft;
