import { useState, useEffect, useRef } from "react";
import { ArrowRight, Check, Shield, Search, Building2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";

const inputClass = "w-full bg-card/40 backdrop-blur-xl border border-border/20 rounded-2xl px-4 md:px-5 py-3.5 md:py-4 text-sm text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-primary/30 focus:shadow-lg focus:shadow-primary/5 transition-all duration-500 font-light";
const readonlyInputClass = "w-full bg-card/20 backdrop-blur-xl border border-border/10 rounded-2xl px-4 md:px-5 py-3.5 md:py-4 text-sm text-foreground/80 font-light cursor-default focus:outline-none";
const labelClass = "text-[10px] tracking-[0.25em] uppercase text-muted-foreground block mb-2";

type BrregEnhet = {
  organisasjonsnummer: string;
  navn: string;
  naeringskode1?: { kode: string; beskrivelse: string };
  forretningsadresse?: { poststed?: string };
  institusjonellSektorkode?: { beskrivelse: string };
  epostadresse?: string;
  telefon?: string;
  mobil?: string;
};

type RolleGruppe = {
  type: { kode: string; beskrivelse: string };
  roller: { type: { beskrivelse: string }; person?: { navn: { fornavn?: string; mellomnavn?: string; etternavn?: string } } }[];
};

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [companySearch, setCompanySearch] = useState("");
  const [searchResults, setSearchResults] = useState<BrregEnhet[]>([]);
  const [searching, setSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<BrregEnhet | null>(null);
  const [dagligLeder, setDagligLeder] = useState("");
  const [loadingRoles, setLoadingRoles] = useState(false);

  // Editable form fields
  const [selskapsnavn, setSelskapsnavn] = useState("");
  const [orgnummer, setOrgnummer] = useState("");
  const [naering, setNaering] = useState("");
  const [kontaktperson, setKontaktperson] = useState("");
  const [telefon, setTelefon] = useState("");
  const [epost, setEpost] = useState("");
  const [bransje, setBransje] = useState("");
  const [omsetning, setOmsetning] = useState("");
  const [frustrasjon, setFrustrasjon] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  // Search Brreg API
  useEffect(() => {
    if (companySearch.length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    searchTimeout.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(
          `https://data.brreg.no/enhetsregisteret/api/enheter?navn=${encodeURIComponent(companySearch)}&size=8&fraAntallAnsatte=0`
        );
        const data = await res.json();
        const enheter: BrregEnhet[] = data._embedded?.enheter || [];
        setSearchResults(enheter);
        setShowDropdown(enheter.length > 0);
      } catch {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 350);

    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [companySearch]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const fetchRoles = async (orgnr: string) => {
    setLoadingRoles(true);
    try {
      const res = await fetch(`https://data.brreg.no/enhetsregisteret/api/enheter/${orgnr}/roller`);
      const data = await res.json();
      const rollegrupper: RolleGruppe[] = data?.rollegrupper || [];
      const dagligLederGruppe = rollegrupper.find(
        (rg) => rg.type?.kode === "DAGL" || rg.type?.beskrivelse?.toLowerCase().includes("daglig leder")
      );
      if (dagligLederGruppe?.roller?.[0]?.person?.navn) {
        const n = dagligLederGruppe.roller[0].person.navn;
        const parts = [n.fornavn, n.mellomnavn, n.etternavn].filter(Boolean);
        const fullName = parts.join(" ");
        setDagligLeder(fullName);
        setKontaktperson(fullName);
      } else {
        setDagligLeder("");
      }
    } catch {
      setDagligLeder("");
    } finally {
      setLoadingRoles(false);
    }
  };

  const mapBransje = (beskrivelse: string): string => {
    const desc = beskrivelse.toLowerCase();
    if (desc.includes("tech") || desc.includes("program") || desc.includes("data") || desc.includes("it-")) return "Tech & SaaS";
    if (desc.includes("eiendom") || desc.includes("utleie")) return "Eiendom & Utvikling";
    if (desc.includes("holding") || desc.includes("invest")) return "Holding & Investering";
    if (desc.includes("konsulent") || desc.includes("rådgiv")) return "Consulting & Rådgivning";
    if (desc.includes("landbruk") || desc.includes("jord")) return "Landbruk";
    if (desc.includes("handel") || desc.includes("butikk") || desc.includes("salg")) return "Varehandel";
    if (desc.includes("bygg") || desc.includes("anlegg") || desc.includes("entre")) return "Bygg & Anlegg";
    if (desc.includes("netthandel") || desc.includes("e-handel") || desc.includes("nettbutikk")) return "Nettbutikk & E-commerce";
    if (desc.includes("helse") || desc.includes("lege") || desc.includes("tann") || desc.includes("velv")) return "Helse & Velvære";
    return "Annet";
  };

  const selectCompany = (enhet: BrregEnhet) => {
    setSelectedCompany(enhet);
    setCompanySearch(enhet.navn);
    setShowDropdown(false);

    // Fill editable fields
    setSelskapsnavn(enhet.navn);
    setOrgnummer(enhet.organisasjonsnummer);
    setNaering(enhet.naeringskode1 ? `${enhet.naeringskode1.kode} — ${enhet.naeringskode1.beskrivelse}` : "");

    // Fill e-post and telefon if available from Brreg
    if (enhet.epostadresse) setEpost(enhet.epostadresse);
    if (enhet.telefon) setTelefon(enhet.telefon);
    else if (enhet.mobil) setTelefon(enhet.mobil);

    // Map bransje
    if (enhet.naeringskode1?.beskrivelse) {
      setBransje(mapBransje(enhet.naeringskode1.beskrivelse));
    }

    // Fetch daglig leder
    fetchRoles(enhet.organisasjonsnummer);
  };

  const clearCompany = () => {
    setSelectedCompany(null);
    setCompanySearch("");
    setSelskapsnavn("");
    setOrgnummer("");
    setNaering("");
    setDagligLeder("");
    setKontaktperson("");
    setTelefon("");
    setEpost("");
    setBransje("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="py-24 md:py-40 relative">
      <div className="absolute inset-0 ambient-glow opacity-40" />
      <div className="container mx-auto px-4 md:px-6 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 md:gap-24 max-w-5xl mx-auto">
          {/* Left */}
          <AnimatedSection>
            <p className="text-xs tracking-[0.4em] uppercase text-secondary mb-5 md:mb-6">Søknad</p>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl mb-6 md:mb-8 leading-snug">
              De fleste betaler for mye og får for lite.{" "}
              <span className="italic text-gradient-rose">Du trenger ikke være en av dem.</span>
            </h1>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-5 md:mb-6 font-light">
              Vi tar ikke inn alle. Ikke fordi vi er arrogante — men fordi vi gir hver klient en dedikert regnskapsfører som investerer seg i ditt selskap. Det fungerer bare når vi har kapasitet til å gjøre det skikkelig.
            </p>
            <p className="text-sm text-primary/70 italic font-light mb-8 md:mb-10">
              Fyll ut skjemaet. Vi kontakter deg innen 24 timer med en uforpliktende vurdering.
            </p>

            <div className="space-y-3 md:space-y-4 mb-8 md:mb-10">
              {[
                "Dedikert regnskapsfører fra dag én",
                "AI-drevet innsikt inkludert",
                "Alt i én fast pris — ingen overraskelser",
                "Spesialisert i din bransje",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm text-foreground/60 font-light">
                  <Check size={14} className="text-secondary shrink-0" strokeWidth={2} />
                  {item}
                </div>
              ))}
            </div>

            <div className="space-y-3 text-sm text-muted-foreground/50 font-light">
              <div className="flex items-center gap-3">
                <div className="w-1 h-1 rounded-full bg-primary/40" />
                <span>Oslo, Norge</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1 h-1 rounded-full bg-primary/40" />
                <span>post@avargo.no</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1 h-1 rounded-full bg-primary/40" />
                <span>+47 22 00 00 00</span>
              </div>
            </div>
          </AnimatedSection>

          {/* Right - Form */}
          <AnimatedSection delay={0.2}>
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="flex items-center justify-center h-full min-h-[400px]"
              >
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Shield size={24} className="text-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-heading text-3xl mb-4">Søknad mottatt</h3>
                  <p className="text-muted-foreground font-light leading-relaxed mb-4">
                    Vi gjennomgår søknaden din og kontakter deg innen 24 timer.
                  </p>
                  <p className="text-sm text-primary/70 italic font-light">
                    I mellomtiden taper din nåværende regnskapsfører deg penger. Bare så du vet.
                  </p>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                {/* Company Search */}
                <div ref={dropdownRef} className="relative">
                  <label className={labelClass}>Søk opp selskap</label>
                  <div className="relative">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40" />
                    <input
                      type="text"
                      value={companySearch}
                      onChange={(e) => {
                        setCompanySearch(e.target.value);
                        if (selectedCompany) clearCompany();
                      }}
                      className={`${inputClass} pl-11`}
                      placeholder="Skriv selskapets navn..."
                    />
                    {searching && (
                      <Loader2 size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 animate-spin" />
                    )}
                  </div>

                  {showDropdown && (
                    <div className="absolute z-50 w-full mt-2 bg-card/95 backdrop-blur-xl border border-border/30 rounded-2xl overflow-hidden shadow-2xl max-h-80 overflow-y-auto">
                      {searchResults.map((enhet) => (
                        <button
                          key={enhet.organisasjonsnummer}
                          type="button"
                          onClick={() => selectCompany(enhet)}
                          className="w-full text-left px-4 py-3 hover:bg-primary/5 transition-colors border-b border-border/10 last:border-0"
                        >
                          <div className="flex items-center gap-3">
                            <Building2 size={14} className="text-primary/50 shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-foreground">{enhet.navn}</p>
                              <p className="text-xs text-muted-foreground/60">
                                Org.nr: {enhet.organisasjonsnummer}
                                {enhet.forretningsadresse?.poststed && ` · ${enhet.forretningsadresse.poststed}`}
                                {enhet.naeringskode1?.beskrivelse && ` · ${enhet.naeringskode1.beskrivelse}`}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Fetched company fields — all editable */}
                {selectedCompany && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4 bg-primary/5 border border-primary/10 rounded-2xl p-4"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs tracking-[0.2em] uppercase text-primary/70 font-medium">Hentet fra Brønnøysund</p>
                      <button
                        type="button"
                        onClick={clearCompany}
                        className="text-xs text-muted-foreground/50 hover:text-foreground transition-colors"
                      >
                        Nullstill
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Selskapsnavn</label>
                        <input
                          type="text"
                          value={selskapsnavn}
                          onChange={(e) => setSelskapsnavn(e.target.value)}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Org.nummer</label>
                        <input
                          type="text"
                          value={orgnummer}
                          onChange={(e) => setOrgnummer(e.target.value)}
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>Daglig leder</label>
                      {loadingRoles ? (
                        <div className="flex items-center gap-2 py-3.5 px-4 text-muted-foreground/50 text-sm">
                          <Loader2 size={14} className="animate-spin" /> Henter fra Brønnøysund...
                        </div>
                      ) : (
                        <input
                          type="text"
                          value={kontaktperson}
                          onChange={(e) => setKontaktperson(e.target.value)}
                          className={inputClass}
                          placeholder="Daglig leder ikke funnet — skriv inn manuelt"
                        />
                      )}
                    </div>

                    {naering && (
                      <div>
                        <label className={labelClass}>Næringsområde</label>
                        <input
                          type="text"
                          value={naering}
                          onChange={(e) => setNaering(e.target.value)}
                          className={inputClass}
                        />
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Manual company name if not searched */}
                {!selectedCompany && (
                  <div>
                    <label className={labelClass}>Selskap</label>
                    <input
                      required
                      type="text"
                      value={selskapsnavn}
                      onChange={(e) => setSelskapsnavn(e.target.value)}
                      className={inputClass}
                      placeholder="Selskapets navn (eller søk ovenfor)"
                    />
                  </div>
                )}

                {/* Contact info — pre-filled from Brreg if available, always editable */}
                <div>
                  <label className={labelClass}>Kontaktperson</label>
                  <input
                    required
                    type="text"
                    value={kontaktperson}
                    onChange={(e) => setKontaktperson(e.target.value)}
                    className={inputClass}
                    placeholder="Ditt fulle navn"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>
                      E-post
                      {selectedCompany?.epostadresse && (
                        <span className="ml-2 text-primary/50 normal-case tracking-normal">· hentet</span>
                      )}
                    </label>
                    <input
                      required
                      type="email"
                      value={epost}
                      onChange={(e) => setEpost(e.target.value)}
                      className={inputClass}
                      placeholder="din@epost.no"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      Telefon
                      {(selectedCompany?.telefon || selectedCompany?.mobil) && (
                        <span className="ml-2 text-primary/50 normal-case tracking-normal">· hentet</span>
                      )}
                    </label>
                    <input
                      required
                      type="tel"
                      value={telefon}
                      onChange={(e) => setTelefon(e.target.value)}
                      className={inputClass}
                      placeholder="+47 000 00 000"
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Bransje</label>
                  <select
                    required
                    value={bransje}
                    onChange={(e) => setBransje(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Velg bransje</option>
                    <option>Tech & SaaS</option>
                    <option>Eiendom & Utvikling</option>
                    <option>Holding & Investering</option>
                    <option>Consulting & Rådgivning</option>
                    <option>Landbruk</option>
                    <option>Varehandel</option>
                    <option>Bygg & Anlegg</option>
                    <option>Nettbutikk & E-commerce</option>
                    <option>Helse & Velvære</option>
                    <option>Annet</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Omsetningsmål neste 12 mnd</label>
                  <select
                    required
                    value={omsetning}
                    onChange={(e) => setOmsetning(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Velg ambisjonsnivå</option>
                    <option>Under 5 millioner</option>
                    <option>5–10 millioner</option>
                    <option>10–50 millioner</option>
                    <option>50–100 millioner</option>
                    <option>Over 100 millioner</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Hva frustrerer deg mest med dagens regnskap?</label>
                  <textarea
                    required
                    rows={3}
                    value={frustrasjon}
                    onChange={(e) => setFrustrasjon(e.target.value)}
                    className={`${inputClass} resize-none`}
                    placeholder="Venter for lenge? Betaler for mye skatt? Føler du mangler kontroll?"
                  />
                </div>

                <button
                  type="submit"
                  className="group w-full flex items-center justify-center gap-3 py-4 bg-primary text-primary-foreground text-sm font-medium tracking-wider rounded-full glow-rose hover:scale-[1.01] transition-all duration-500 mt-2"
                >
                  Send søknad
                  <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                </button>
                <p className="text-xs text-muted-foreground/40 text-center font-light">
                  Helt uforpliktende. Vi kontakter deg innen 24 timer.
                </p>
              </form>
            )}
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default Contact;
