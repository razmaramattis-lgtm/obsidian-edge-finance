import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { Building2, User, Mail, Phone, Globe, Hash, Users, TrendingUp, Send, Sparkles, CheckCircle2, Search, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import heroImg from "@/assets/samarbeid-hero.jpg";

const INTEREST_TYPES = [
  { value: "full_sale", label: "Fullt oppkjøp" },
  { value: "partnership", label: "Samarbeidsavtale" },
  { value: "partial", label: "Delvis oppkjøp" },
  { value: "both", label: "Åpen for alt" },
];

const SamarbeidSoknad = () => {
  const [form, setForm] = useState({
    org_number: "", company_name: "", contact_name: "",
    contact_email: "", contact_phone: "", website: "",
    num_employees: "", annual_revenue: "", interest_type: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Brreg search state
  const [brregQuery, setBrregQuery] = useState("");
  const [brregResults, setBrregResults] = useState<any[]>([]);
  const [brregLoading, setBrregLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const set = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }));

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setShowDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Brreg search with debounce
  useEffect(() => {
    if (brregQuery.length < 2) { setBrregResults([]); return; }
    const timeout = setTimeout(async () => {
      setBrregLoading(true);
      try {
        const isOrgNr = /^\d{9}$/.test(brregQuery.trim());
        const url = isOrgNr
          ? `https://data.brreg.no/enhetsregisteret/api/enheter/${brregQuery.trim()}`
          : `https://data.brreg.no/enhetsregisteret/api/enheter?navn=${encodeURIComponent(brregQuery)}&size=8`;
        const res = await fetch(url);
        if (!res.ok) { setBrregResults([]); setBrregLoading(false); return; }
        const data = await res.json();
        if (isOrgNr) {
          setBrregResults(data?.organisasjonsnummer ? [data] : []);
        } else {
          setBrregResults(data?._embedded?.enheter || []);
        }
        setShowDropdown(true);
      } catch { setBrregResults([]); }
      setBrregLoading(false);
    }, 400);
    return () => clearTimeout(timeout);
  }, [brregQuery]);

  const selectCompany = async (enhet: any) => {
    setShowDropdown(false);
    setBrregQuery("");

    const orgNr = enhet.organisasjonsnummer;

    // Fetch roller + regnskap in parallel
    const [rolleResult, regnskapResult] = await Promise.allSettled([
      fetch(`https://data.brreg.no/enhetsregisteret/api/enheter/${orgNr}/roller`).then(r => r.ok ? r.json() : null),
      fetch(`https://data.brreg.no/regnskapsregisteret/regnskap/${orgNr}`, {
        headers: { Accept: "application/json" },
      }).then(r => r.ok ? r.json() : null),
    ]);

    // Extract daglig leder
    let dagligLeder = "";
    try {
      const rolleData = rolleResult.status === "fulfilled" ? rolleResult.value : null;
      const groups = rolleData?.rollegrupper || [];
      for (const g of groups) {
        if (g.type?.kode === "DAGL") {
          const person = g.roller?.[0]?.person;
          if (person) dagligLeder = `${person.navn?.fornavn || ""} ${person.navn?.etternavn || ""}`.trim();
        }
      }
    } catch { /* ignore */ }

    // Extract financial data (latest SELSKAP regnskap)
    let annualRevenue = "";
    let numEmployees = enhet.antallAnsatte?.toString() || "";
    try {
      const regnskapData = regnskapResult.status === "fulfilled" ? regnskapResult.value : null;
      // Response is an array — find latest SELSKAP entry
      const entries = Array.isArray(regnskapData) ? regnskapData : [];
      const selskap = entries.find((r: any) => r.regnskapstype === "SELSKAP") || entries[0];
      if (selskap) {
        const driftsinntekter = selskap?.resultatregnskapResultat?.driftsresultat?.driftsinntekter?.sumDriftsinntekter;
        if (driftsinntekter != null) {
          const num = Math.round(Number(driftsinntekter));
          if (num >= 1_000_000) {
            annualRevenue = `${(num / 1_000_000).toFixed(1).replace(".", ",")} MNOK`;
          } else if (num >= 1_000) {
            annualRevenue = `${Math.round(num / 1_000)} TNOK`;
          } else {
            annualRevenue = `${num} NOK`;
          }
        }
        // Also grab employees from regnskap if enhetsreg didn't have it
        if (!numEmployees && selskap?.virksomhet?.antallAnsatte) {
          numEmployees = selskap.virksomhet.antallAnsatte.toString();
        }
      }
    } catch { /* ignore */ }

    const webRaw = enhet.hjemmeside || "";

    setForm(prev => ({
      ...prev,
      org_number: orgNr || "",
      company_name: enhet.navn || "",
      contact_name: dagligLeder || prev.contact_name,
      website: webRaw || prev.website,
      num_employees: numEmployees || prev.num_employees,
      annual_revenue: annualRevenue || prev.annual_revenue,
    }));
  };

  const inputClass = "w-full h-11 pl-10 pr-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.org_number.trim() || !form.company_name.trim() || !form.contact_name.trim() || !form.contact_email.trim() || !form.contact_phone.trim()) return;
    setSubmitting(true);

    const { error } = await supabase.from("samarbeid_applications").insert([{
      org_number: form.org_number.trim(),
      company_name: form.company_name.trim(),
      contact_name: form.contact_name.trim(),
      contact_email: form.contact_email.trim(),
      contact_phone: form.contact_phone.trim(),
      website: form.website.trim() || null,
      num_employees: form.num_employees ? parseInt(form.num_employees) : null,
      annual_revenue: form.annual_revenue.trim() || null,
      interest_type: form.interest_type || "partnership",
      message: form.message.trim() || null,
    }]);

    if (error) {
      const { toast } = await import("sonner");
      toast.error("Noe gikk galt. Prøv igjen.");
    } else {
      setSubmitted(true);
    }
    setSubmitting(false);
  };

  return (
    <>
      <Helmet>
        <title>Søknad | Avargo Samarbeid</title>
        <meta name="description" content="Send en uforpliktende søknad om samarbeid med Avargo. Fortell oss om selskapet ditt og hva du er interessert i." />
      </Helmet>

      <section className="relative min-h-[700px] overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>

        <div className="container mx-auto px-4 relative z-10 py-20 md:py-28">
          <div className="grid lg:grid-cols-[1fr_480px] gap-12 lg:gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-medium mb-6 backdrop-blur-sm">
                <Sparkles size={13} /> Uforpliktende søknad
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-5 leading-tight">
                Fortell oss om<br />selskapet ditt
              </h1>
              <p className="text-lg text-white/70 max-w-md leading-relaxed mb-8">
                Alle henvendelser behandles konfidensielt. Vi tar kontakt innen 48 timer for en uforpliktende samtale.
              </p>
              <div className="space-y-3">
                {[
                  "100 % konfidensielt — ingen info deles videre",
                  "Uforpliktende — du bestemmer tempoet",
                  "Svar innen 48 timer",
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-3 text-white/80">
                    <CheckCircle2 size={16} className="text-primary shrink-0" />
                    <span className="text-sm">{text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }}>
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className="rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl p-8 text-center">
                    <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-5">
                      <Sparkles size={32} className="text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Søknaden er mottatt!</h3>
                    <p className="text-sm text-white/60 max-w-xs mx-auto">Takk for interessen. Vi gjennomgår henvendelsen din og tar kontakt innen 48 timer for en konfidensiell samtale.</p>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={handleSubmit}
                    className="rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl p-6 md:p-8 space-y-4">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-0.5">Samarbeidssøknad</h3>
                      <p className="text-xs text-white/50">Fyll ut informasjonen under — alt er konfidensielt.</p>
                    </div>

                    {/* Brreg search */}
                    <div ref={dropdownRef} className="relative">
                      <p className="text-xs text-white/50 mb-1.5">Søk i Brønnøysundregistrene</p>
                      <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                        <input
                          value={brregQuery}
                          onChange={e => setBrregQuery(e.target.value)}
                          placeholder="Søk på firmanavn eller org.nr…"
                          className={inputClass}
                        />
                        {brregLoading && <Loader2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 animate-spin" />}
                      </div>
                      {showDropdown && brregResults.length > 0 && (
                        <div className="absolute z-50 left-0 right-0 mt-1 rounded-xl border border-white/10 bg-black/90 backdrop-blur-xl max-h-60 overflow-y-auto shadow-2xl">
                          {brregResults.map((enhet) => (
                            <button
                              key={enhet.organisasjonsnummer}
                              type="button"
                              onClick={() => selectCompany(enhet)}
                              className="w-full text-left px-4 py-2.5 hover:bg-white/10 transition-colors border-b border-white/5 last:border-0"
                            >
                              <span className="text-sm font-medium text-white">{enhet.navn}</span>
                              <span className="block text-xs text-white/40">{enhet.organisasjonsnummer} · {enhet.organisasjonsform?.beskrivelse || ""}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="relative">
                        <Hash size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                        <input value={form.org_number} onChange={e => set("org_number", e.target.value)} required
                          placeholder="Org.nummer *" maxLength={20} className={inputClass} />
                      </div>
                      <div className="relative">
                        <Building2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                        <input value={form.company_name} onChange={e => set("company_name", e.target.value)} required
                          placeholder="Selskapsnavn *" maxLength={200} className={inputClass} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="relative">
                        <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                        <input value={form.contact_name} onChange={e => set("contact_name", e.target.value)} required
                          placeholder="Kontaktperson *" maxLength={100} className={inputClass} />
                      </div>
                      <div className="relative">
                        <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                        <input type="email" value={form.contact_email} onChange={e => set("contact_email", e.target.value)} required
                          placeholder="E-post *" maxLength={255} className={inputClass} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="relative">
                        <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                        <input type="tel" value={form.contact_phone} onChange={e => set("contact_phone", e.target.value)} required
                          placeholder="Telefon *" maxLength={20} className={inputClass} />
                      </div>
                      <div className="relative">
                        <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                        <input value={form.website} onChange={e => set("website", e.target.value)}
                          placeholder="Nettside (valgfritt)" maxLength={500} className={inputClass} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="relative">
                        <Users size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                        <input type="number" value={form.num_employees} onChange={e => set("num_employees", e.target.value)}
                          placeholder="Antall ansatte" min={1} className={inputClass} />
                      </div>
                      <div className="relative">
                        <TrendingUp size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                        <input value={form.annual_revenue} onChange={e => set("annual_revenue", e.target.value)}
                          placeholder="Årlig omsetning (ca.)" maxLength={50} className={inputClass} />
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-white/50 mb-2">Hva er du interessert i?</p>
                      <div className="flex flex-wrap gap-2">
                        {INTEREST_TYPES.map(t => (
                          <button key={t.value} type="button" onClick={() => set("interest_type", form.interest_type === t.value ? "" : t.value)}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                              form.interest_type === t.value
                                ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                                : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white"
                            }`}>{t.label}</button>
                        ))}
                      </div>
                    </div>

                    <textarea value={form.message} onChange={e => set("message", e.target.value)}
                      placeholder="Fortell gjerne litt om selskapet, situasjonen og hva du tenker…"
                      rows={3} maxLength={5000}
                      className="w-full rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />

                    <button type="submit" disabled={submitting}
                      className="w-full h-12 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/30">
                      {submitting ? "Sender…" : <><Send size={15} /> Send søknad</>}
                    </button>

                    <p className="text-[10px] text-white/30 text-center">All informasjon behandles konfidensielt i henhold til vår personvernpolicy.</p>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SamarbeidSoknad;
