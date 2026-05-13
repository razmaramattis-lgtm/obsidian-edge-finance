import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, CheckCircle2, MapPin } from "lucide-react";

interface CityContactFormProps {
  cityName: string;
  citySlug: string;
}

const REVENUE_OPTIONS = [
  "Under 1 mill",
  "1–3 mill",
  "3–10 mill",
  "10–25 mill",
  "25 mill+",
];

const BOTTLENECK_OPTIONS = [
  "Bilag og fakturering tar for mye tid",
  "Lønn og HR er rotete",
  "Mangler oversikt over økonomien",
  "Skatt og MVA føles uoversiktlig",
  "Nåværende regnskapsfører svarer for sent",
  "Trenger strategisk rådgivning",
  "Annet",
];

const CityContactForm = ({ cityName, citySlug }: CityContactFormProps) => {
  const [companyName, setCompanyName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [revenueTarget, setRevenueTarget] = useState("");
  const [bottleneck, setBottleneck] = useState("");
  const [extra, setExtra] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactPerson.trim() || !email.trim() || !revenueTarget || !bottleneck) return;
    setSubmitting(true);
    try {
      const message = [
        `By: ${cityName}`,
        `Største flaskehals: ${bottleneck}`,
        extra.trim() ? `\nUtdyping: ${extra.trim()}` : "",
      ]
        .filter(Boolean)
        .join("\n");

      const { error } = await supabase.functions.invoke("contact-submit", {
        body: {
          company_name: companyName || null,
          contact_person: contactPerson,
          email,
          phone: phone || null,
          revenue_target: revenueTarget,
          message,
          section: "regnskap",
          source: `regnskapsforer-i/${citySlug}`,
        },
      });
      if (error) throw error;
      setSubmitted(true);
    } catch (err) {
      console.error("City contact submit error:", err);
      alert("Noe gikk galt. Prøv igjen, eller send e-post til kontakt@avargo.no.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-3xl border border-primary/20 bg-primary/5 p-8 md:p-10 text-center">
        <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-7 h-7 text-primary" />
        </div>
        <h3 className="font-serif text-2xl md:text-3xl font-light text-foreground mb-3">
          Takk! Vi tar kontakt innen 24 timer.
        </h3>
        <p className="text-foreground/65 font-light">
          Vi går gjennom situasjonen din i {cityName} og sender et tilpasset tilbud direkte til {email}.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-border/20 bg-card/40 backdrop-blur p-6 md:p-10"
    >
      <div className="flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase text-primary/80 mb-3">
        <MapPin className="w-3 h-3" />
        Tilpasset {cityName}
      </div>
      <h3 className="font-serif text-2xl md:text-3xl font-light text-foreground mb-2">
        Få tilbud for din bedrift i {cityName}
      </h3>
      <p className="text-foreground/60 font-light text-[14px] mb-8">
        Fortell oss kort om omsetningsmål og største flaskehals — så får du et treffsikkert tilbud innen 24 timer.
      </p>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <Field label="Kontaktperson *">
          <input
            required
            type="text"
            value={contactPerson}
            onChange={(e) => setContactPerson(e.target.value)}
            maxLength={120}
            className="w-full px-4 py-3 rounded-xl bg-background border border-border/30 text-foreground text-[14px] focus:outline-none focus:border-primary/60 transition-colors"
            placeholder="Ola Nordmann"
          />
        </Field>
        <Field label="Bedriftsnavn">
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            maxLength={160}
            className="w-full px-4 py-3 rounded-xl bg-background border border-border/30 text-foreground text-[14px] focus:outline-none focus:border-primary/60 transition-colors"
            placeholder={`Min Bedrift AS, ${cityName}`}
          />
        </Field>
        <Field label="E-post *">
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={255}
            className="w-full px-4 py-3 rounded-xl bg-background border border-border/30 text-foreground text-[14px] focus:outline-none focus:border-primary/60 transition-colors"
            placeholder="navn@bedrift.no"
          />
        </Field>
        <Field label="Telefon">
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            maxLength={40}
            className="w-full px-4 py-3 rounded-xl bg-background border border-border/30 text-foreground text-[14px] focus:outline-none focus:border-primary/60 transition-colors"
            placeholder="+47 ..."
          />
        </Field>
      </div>

      <Field label="Omsetningsmål neste 12 mnd *">
        <div className="flex flex-wrap gap-2 mt-1">
          {REVENUE_OPTIONS.map((opt) => (
            <button
              type="button"
              key={opt}
              onClick={() => setRevenueTarget(opt)}
              className={`px-4 py-2 rounded-full border text-[13px] transition-colors ${
                revenueTarget === opt
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border/25 bg-muted/20 text-foreground/70 hover:border-primary/40"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </Field>

      <div className="mt-5">
        <Field label="Største flaskehals akkurat nå *">
          <div className="flex flex-wrap gap-2 mt-1">
            {BOTTLENECK_OPTIONS.map((opt) => (
              <button
                type="button"
                key={opt}
                onClick={() => setBottleneck(opt)}
                className={`px-4 py-2 rounded-full border text-[13px] transition-colors ${
                  bottleneck === opt
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border/25 bg-muted/20 text-foreground/70 hover:border-primary/40"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </Field>
      </div>

      <div className="mt-5">
        <Field label="Utdyp gjerne (valgfritt)">
          <textarea
            value={extra}
            onChange={(e) => setExtra(e.target.value)}
            maxLength={1000}
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-background border border-border/30 text-foreground text-[14px] focus:outline-none focus:border-primary/60 transition-colors resize-none"
            placeholder={`F.eks. "Vi er 4 ansatte i ${cityName}, omsetter 6 mill og bruker for mye tid på lønn."`}
          />
        </Field>
      </div>

      <button
        type="submit"
        disabled={submitting || !contactPerson || !email || !revenueTarget || !bottleneck}
        className="mt-8 w-full md:w-auto group inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-primary text-primary-foreground text-[14px] font-medium hover:scale-[1.01] transition-transform disabled:opacity-50 disabled:hover:scale-100"
      >
        {submitting ? "Sender …" : `Send forespørsel for ${cityName}`}
        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
      </button>
      <p className="mt-4 text-[12px] text-foreground/45">
        Svar innen 24 timer · Uforpliktende · Ingen automatisert salgssekvens
      </p>
    </form>
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="block">
    <span className="block text-[12px] tracking-wider uppercase text-foreground/55 mb-2">{label}</span>
    {children}
  </label>
);

export default CityContactForm;
