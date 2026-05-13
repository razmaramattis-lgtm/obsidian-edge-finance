import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { X, ArrowRight, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const STORAGE_KEY = "avargo_exit_intent_v1";
const HIDDEN_PREFIXES = [
  "/kontakt",
  "/logg-inn",
  "/admin",
  "/kunde",
  "/workspace",
  "/karriere/soknad",
  "/samarbeid/soknad",
];

/**
 * Exit-intent popup som vises når musen forlater toppen av vinduet
 * (typisk ved bytte av tab eller for å lukke). Vises bare én gang per
 * besøk og minst én uke mellom hver visning. Skjules på sider hvor
 * brukeren allerede er i en konverteringsflyt.
 */
const ExitIntentDialog = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const hidden = HIDDEN_PREFIXES.some(
    (p) => location.pathname.startsWith(p) || location.pathname.endsWith(p)
  );

  useEffect(() => {
    if (hidden) return;
    if (typeof window === "undefined") return;

    // Throttle: én gang per uke
    try {
      const last = Number(localStorage.getItem(STORAGE_KEY) || "0");
      if (Date.now() - last < 1000 * 60 * 60 * 24 * 7) return;
    } catch { /* ignore */ }

    let armed = false;
    const armTimer = window.setTimeout(() => {
      armed = true;
    }, 8000); // arm etter 8 sek så det ikke fyrer umiddelbart

    const onLeave = (e: MouseEvent) => {
      if (!armed) return;
      // Mus ut over toppen av viewporten
      if (e.clientY <= 0) {
        setOpen(true);
        try { localStorage.setItem(STORAGE_KEY, String(Date.now())); } catch { /* ignore */ }
        document.removeEventListener("mouseout", onLeave);
      }
    };

    document.addEventListener("mouseout", onLeave);
    return () => {
      clearTimeout(armTimer);
      document.removeEventListener("mouseout", onLeave);
    };
  }, [hidden, location.pathname]);

  if (hidden) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setBusy(true);
    try {
      await supabase.functions.invoke("contact-submit", {
        body: {
          email: email.trim().toLowerCase().slice(0, 255),
          contact_person: "Exit-intent (kun e-post)",
          source: `exit-intent:${location.pathname}`,
          referrer: typeof document !== "undefined" ? document.referrer.slice(0, 500) : null,
          message: "Forespørsel om prisliste / ringeavtale via exit-intent.",
        },
      });
      setDone(true);
    } catch (err) {
      console.error(err);
    } finally {
      setBusy(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl border border-border/30 bg-card/95 backdrop-blur-xl p-6 md:p-8 shadow-2xl shadow-primary/10">
        <button
          onClick={() => setOpen(false)}
          aria-label="Lukk"
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-foreground/50 hover:text-foreground hover:bg-muted/40 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {done ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/15 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-serif text-2xl mb-2">Takk!</h3>
            <p className="text-sm text-foreground/60 font-light">
              Vi sender prisoversikten til {email} og tar kontakt innen 24 timer.
            </p>
          </div>
        ) : (
          <>
            <p className="text-[11px] tracking-[0.3em] uppercase text-primary/80 mb-3 font-medium">
              Før du går
            </p>
            <h3 className="font-serif text-2xl md:text-3xl font-light text-foreground mb-2 leading-tight">
              Vil du heller få prisene på e-post?
            </h3>
            <p className="text-sm text-foreground/60 font-light mb-5">
              Vi sender en oversikt over pakker og hva som er inkludert — og ringer kun hvis du selv ber om det.
            </p>
            <form onSubmit={submit} className="space-y-3">
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={255}
                placeholder="din@epost.no"
                className="w-full px-4 py-3 rounded-xl bg-background border border-border/30 text-foreground text-sm focus:outline-none focus:border-primary/60 transition-colors"
                autoFocus
              />
              <button
                type="submit"
                disabled={busy || !email}
                className="group w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:scale-[1.01] transition-transform disabled:opacity-50 disabled:hover:scale-100"
              >
                {busy ? "Sender …" : "Send meg prisoversikten"}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <p className="text-[11px] text-foreground/45 text-center font-light">
                Ingen binding · Vi spammer ikke · Avmeld når som helst
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ExitIntentDialog;
