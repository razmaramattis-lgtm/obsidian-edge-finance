import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Inline ekspresskjema for hero/trafikktung side.
 * Felter: navn, firma, e-post, telefon og kort melding — alt over én knapp.
 */
const HeroQuickContact = ({ source = "hero" }: { source?: string }) => {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
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
          company_name: company.trim().slice(0, 160) || null,
          email: email.trim().toLowerCase().slice(0, 255),
          phone: phone.trim().slice(0, 40) || null,
          source: `${source}:${typeof window !== "undefined" ? window.location.pathname : ""}`,
          referrer: typeof document !== "undefined" ? document.referrer.slice(0, 500) : null,
          message: message.trim().slice(0, 600) || "Sendt fra ekspresskjema – ingen detaljer oppgitt.",
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
      <div className="rounded-2xl border border-primary/30 bg-primary/5 backdrop-blur p-6 md:p-8">
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

  const inputCls =
    "w-full px-3.5 py-3 text-sm rounded-xl bg-background/60 border border-border/30 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary/60 transition-colors";

  return (
    <form
      onSubmit={submit}
      className="rounded-3xl border border-border/30 bg-card/50 backdrop-blur-xl p-6 md:p-7"
    >
      <p className="text-[11px] tracking-[0.3em] uppercase text-primary/80 mb-1.5 font-medium">
        Be oss ringe deg
      </p>
      <p className="text-xs text-muted-foreground mb-5 font-light">
        Svar innen 24 timer. Ingen binding.
      </p>

      <div className="space-y-2.5">
        <div className="grid grid-cols-2 gap-2.5">
          <input
            required
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={120}
            placeholder="Navn *"
            className={inputCls}
          />
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            maxLength={160}
            placeholder="Firma"
            className={inputCls}
          />
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={255}
            placeholder="E-post *"
            className={inputCls}
          />
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            maxLength={40}
            placeholder="Telefon"
            className={inputCls}
          />
        </div>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={600}
          rows={3}
          placeholder="Melding"
          className={`${inputCls} min-h-24 resize-none`}
        />
        <button
          type="submit"
          disabled={busy || !name || !email}
          className="group w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:scale-[1.01] transition-transform disabled:opacity-50 disabled:hover:scale-100 mt-1"
        >
          {busy ? "Sender..." : "Send forespørsel"}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {err && <p className="mt-3 text-xs text-destructive">{err}</p>}
      <p className="mt-4 text-[11px] text-foreground/45 font-light text-center">
        Tar 20 sekunder · Ingen binding · Svar innen 24 timer
      </p>
    </form>
  );
};

export default HeroQuickContact;
