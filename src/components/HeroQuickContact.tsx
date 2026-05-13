import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Inline 2-felts ekspresskjema for hero/trafikktung side.
 * Mål: drastisk redusere friksjon — bare navn + e-post,
 * ingen pakkevalg, ingen Brreg-oppslag.
 */
const HeroQuickContact = ({ source = "hero" }: { source?: string }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setBusy(true);
    setErr(null);
    try {
      const { error } = await supabase.functions.invoke("contact-submit", {
        body: {
          contact_person: name.trim().slice(0, 120),
          email: email.trim().toLowerCase().slice(0, 255),
          source: `${source}:${typeof window !== "undefined" ? window.location.pathname : ""}`,
          referrer: typeof document !== "undefined" ? document.referrer.slice(0, 500) : null,
          message: "Sendt fra ekspresskjema – ingen detaljer oppgitt.",
        },
      });
      if (error) throw error;
      setDone(true);
    } catch (e2) {
      console.error(e2);
      setErr("Noe gikk galt. Prøv på nytt eller send e-post til kontakt@avargo.no");
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <div className="rounded-2xl border border-primary/30 bg-primary/5 backdrop-blur p-5 md:p-6 max-w-lg">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground mb-1">Takk! Vi tar kontakt innen 24 timer.</p>
            <p className="text-xs text-foreground/60 font-light">
              Bekreftelse er sendt til {email}. Vil du allerede nå dele mer? <a href="/kontakt" className="text-primary hover:underline">Fyll ut detaljer</a>.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-border/30 bg-card/40 backdrop-blur-xl p-4 md:p-5 max-w-lg"
    >
      <p className="text-[11px] tracking-[0.3em] uppercase text-primary/80 mb-3 font-medium">
        Eller — be oss ringe deg
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2">
        <input
          required
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={120}
          placeholder="Navn"
          className="px-3.5 py-2.5 text-sm rounded-xl bg-background border border-border/30 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary/60 transition-colors"
        />
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          maxLength={255}
          placeholder="E-post"
          className="px-3.5 py-2.5 text-sm rounded-xl bg-background border border-border/30 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary/60 transition-colors"
        />
        <button
          type="submit"
          disabled={busy || !name || !email}
          className="group inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:hover:scale-100"
        >
          {busy ? "..." : "Send"}
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
      {err && <p className="mt-2 text-xs text-destructive">{err}</p>}
      <p className="mt-3 text-[11px] text-foreground/45 font-light">
        Tar 10 sekunder · Ingen binding · Svar innen 24 timer
      </p>
    </form>
  );
};

export default HeroQuickContact;
