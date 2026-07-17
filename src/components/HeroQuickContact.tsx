import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLang } from "@/contexts/LanguageContext";

/**
 * Inline ekspresskjema for hero/trafikktung side.
 * Felter: navn, firma, e-post, telefon og kort melding — alt over én knapp.
 */
const HeroQuickContact = ({ source = "hero" }: { source?: string }) => {
  const { t } = useLang();
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
      setErr(t("form.error"));
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
            <p className="text-sm font-medium text-foreground mb-1">{t("form.done")}</p>
            <p className="text-xs text-foreground/60 font-light">
              {t("form.done.sub.a")} {email}. {t("form.done.sub.b")} <a href="/kontakt" className="text-primary hover:underline">{t("form.done.sub.link")}</a>.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const inputCls =
    "w-full px-3.5 py-3 text-sm rounded-xl bg-muted border border-primary/20 text-foreground placeholder:text-foreground/55 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors";

  return (
    <form
      onSubmit={submit}
      className="rounded-3xl border border-primary/25 bg-card shadow-xl shadow-primary/10 p-6 md:p-7"
    >
      <p className="text-[11px] tracking-[0.3em] uppercase text-primary mb-2 font-semibold">
        {t("form.eyebrow")}
      </p>
      <p className="text-xs text-foreground/70 mb-5 font-light">
        {t("form.sub")}
      </p>

      <div className="space-y-2.5">
        <div className="grid grid-cols-2 gap-2.5">
          <input
            required
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={120}
            placeholder={t("form.name")}
            aria-label={t("form.name")}
            className={inputCls}
          />
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            maxLength={160}
            placeholder={t("form.company")}
            aria-label={t("form.company")}
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
            placeholder={t("form.email")}
            aria-label={t("form.email")}
            className={inputCls}
          />
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            maxLength={40}
            placeholder={t("form.phone")}
            aria-label={t("form.phone")}
            className={inputCls}
          />
        </div>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={600}
          rows={3}
          placeholder={t("form.message")}
          aria-label={t("form.message")}
          className={`${inputCls} min-h-24 resize-none`}
        />
        <button
          type="submit"
          disabled={busy || !name || !email}
          className="group w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold tracking-wide shadow-lg shadow-primary/30 hover:brightness-110 hover:scale-[1.01] transition-all disabled:opacity-50 disabled:hover:scale-100 mt-2"
        >
          {busy ? t("form.sending") : t("form.submit")}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {err && <p className="mt-3 text-xs text-destructive">{err}</p>}
      <p className="mt-4 text-[11px] text-foreground/60 font-light text-center">
        {t("form.footer")}
      </p>
    </form>
  );
};

export default HeroQuickContact;
