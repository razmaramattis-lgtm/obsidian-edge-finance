import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router-dom";
import { ArrowRight, Check, Shield, Search, Building2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";

const inputClass = "w-full bg-card/80 backdrop-blur-xl border border-border/40 rounded-2xl px-4 md:px-5 py-3.5 md:py-4 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary/50 focus:shadow-lg focus:shadow-primary/10 transition-all duration-500 font-light";
const labelClass = "text-[11px] tracking-[0.25em] uppercase text-foreground/60 block mb-2 font-medium";

type BrregEnhet = {
  organisasjonsnummer: string;
  navn: string;
  naeringskode1?: { kode: string; beskrivelse: string };
  forretningsadresse?: { poststed?: string };
  epostadresse?: string;
  telefon?: string;
  mobil?: string;
};

type RolleGruppe = {
  type: { kode: string; beskrivelse: string };
  roller: { type: { beskrivelse: string }; person?: { navn: { fornavn?: string; mellomnavn?: string; etternavn?: string } } }[];
};

const Contact = () => {
  const [searchParams] = useSearchParams();
  const [submitted, setSubmitted] = useState(false);
  const [companySearch, setCompanySearch] = useState("");
  const [searchResults, setSearchResults] = useState<BrregEnhet[]>([]);
  const [searching, setSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loadingRoles, setLoadingRoles] = useState(false);

  const [selskapsnavn, setSelskapsnavn] = useState("");
  const [orgnummer, setOrgnummer] = useState("");
  const [naering, setNaering] = useState("");
  const [kontaktperson, setKontaktperson] = useState("");
  const [telefon, setTelefon] = useState("");
  const [epost, setEpost] = useState("");
  const [bransje, setBransje] = useState("");
  const [omsetning, setOmsetning] = useState("");
  const [frustrasjon, setFrustrasjon] = useState("");
  const [valgtPakke, setValgtPakke] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  // Pre-fill package from URL
  useEffect(() => {
    const pakke = searchParams.get("pakke");
    if (pakke) setValgtPakke(pakke);
  }, [searchParams]);

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
        setSearchResults(data._embedded?.enheter || []);
        setShowDropdown((data._embedded?.enheter || []).length > 0);
      } catch {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 350);
    return () => { if (searchTimeout.current) clearTimeout(searchTimeout.current); };
  }, [companySearch]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setShowDropdown(false);
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
      const dagl = rollegrupper.find((rg) => rg.type?.kode === "DAGL");
      if (dagl?.roller?.[0]?.person?.navn) {
        const n = dagl.roller[0].person.navn;
        setKontaktperson([n.fornavn, n.mellomnavn, n.etternavn].filter(Boolean).join(" "));
      }
    } catch { /* ignore */ }
    finally { setLoadingRoles(false); }
  };

  const mapBransje = (desc: string): string => {
    const d = desc.toLowerCase();
    if (d.includes("program") || d.includes("data") || d.includes("it-") || d.includes("teknologi")) return "Tech & SaaS";
    if (d.includes("eiendom") || d.includes("utleie av eigen")) return "Eiendom & Utvikling";
    if (d.includes("holding") || d.includes("invest") || d.includes("egeninvestering")) return "Holding & Investering";
    if (d.includes("konsulent") || d.includes("rådgiv") || d.includes("bedriftsrådgivning")) return "Consulting & Rådgivning";
    if (d.includes("landbruk") || d.includes("jord") || d.includes("fiske") || d.includes("skogbruk")) return "Landbruk";
    if (d.includes("detaljhandel") || d.includes("butikk") || d.includes("engroshandel")) return "Varehandel";
    if (d.includes("bygg") || d.includes("anlegg") || d.includes("oppføring")) return "Bygg & Anlegg";
    if (d.includes("netthandel") || d.includes("nettbutikk") || d.includes("postordre")) return "Nettbutikk & E-commerce";
    if (d.includes("helse") || d.includes("lege") || d.includes("tann") || d.includes("fysioterapi") || d.includes("velvære") || d.includes("pleie")) return "Helse & Velvære";
    if (d.includes("restaurant") || d.includes("servering") || d.includes("drikke") || d.includes("kafe") || d.includes("bar") || d.includes("catering")) return "Restaurant & Uteliv";
    if (d.includes("frisør") || d.includes("skjønnhet") || d.includes("hudpleie") || d.includes("salong")) return "Frisør & Skjønnhet";
    if (d.includes("rørlegg") || d.includes("elektriker") || d.includes("maler") || d.includes("snekker") || d.includes("murer") || d.includes("taktek") || d.includes("vvs")) return "Håndverkere & Fagfolk";
    if (d.includes("transport") || d.includes("logistikk") || d.includes("spedisjon") || d.includes("frakt") || d.includes("lasting")) return "Transport & Logistikk";
    if (d.includes("industri") || d.includes("produksjon") || d.includes("tilvirkning") || d.includes("bearbeiding")) return "Industri & Produksjon";
    if (d.includes("renhold") || d.includes("rengjøring") || d.includes("vaktmester") || d.includes("facility")) return "Renhold & Facility";
    if (d.includes("film") || d.includes("musikk") || d.includes("kunst") || d.includes("medie") || d.includes("forlag") || d.includes("underholdning") || d.includes("teater")) return "Kultur, Media & Underholdning";
    if (d.includes("sport") || d.includes("trening") || d.includes("fritid") || d.includes("idrett")) return "Sport & Fritid";
    if (d.includes("undervisning") || d.includes("opplæring") || d.includes("kurs") || d.includes("utdanning")) return "Utdanning & Kurs";
    if (d.includes("advokat") || d.includes("juridisk") || d.includes("rettslig")) return "Juridisk & Advokat";
    if (d.includes("arkitekt") || d.includes("design") || d.includes("interiør")) return "Arkitektur & Design";
    if (d.includes("reklame") || d.includes("markedsføring") || d.includes("annonsering") || d.includes("kommunikasjon")) return "Markedsføring & Reklame";
    if (d.includes("bemanning") || d.includes("rekruttering") || d.includes("arbeidskraft") || d.includes("vikar")) return "Bemanning & Rekruttering";
    if (d.includes("reise") || d.includes("turisme") || d.includes("overnatting") || d.includes("hotell")) return "Reiseliv & Turisme";
    if (d.includes("motorvogn") || d.includes("bilverksted") || d.includes("bilpleie") || d.includes("kjøretøy")) return "Bil & Verksted";
    if (d.includes("energi") || d.includes("kraft") || d.includes("miljø") || d.includes("avfall") || d.includes("gjenvinning")) return "Energi & Miljø";
    return "Annet";
  };

  const selectCompany = (enhet: BrregEnhet) => {
    setCompanySearch(enhet.navn);
    setSelskapsnavn(enhet.navn);
    setOrgnummer(enhet.organisasjonsnummer);
    setNaering(enhet.naeringskode1 ? `${enhet.naeringskode1.kode} — ${enhet.naeringskode1.beskrivelse}` : "");
    if (enhet.epostadresse) setEpost(enhet.epostadresse);
    if (enhet.telefon) setTelefon(enhet.telefon);
    else if (enhet.mobil) setTelefon(enhet.mobil);
    if (enhet.naeringskode1?.beskrivelse) setBransje(mapBransje(enhet.naeringskode1.beskrivelse));
    setShowDropdown(false);
    fetchRoles(enhet.organisasjonsnummer);
  };

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("contact-submit", {
        body: {
          company_name: selskapsnavn,
          org_number: orgnummer,
          contact_person: kontaktperson,
          email: epost,
          phone: telefon,
          industry: bransje,
          industry_code: naering,
          revenue_target: omsetning,
          message: frustrasjon,
          package: valgtPakke,
        },
      });
      if (error) throw error;
      setSubmitted(true);
    } catch (err) {
      console.error("Submit error:", err);
      alert("Noe gikk galt. Vennligst prøv igjen.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
    <Helmet>
      <title>Kontakt Avargo | Få tilbud på regnskapstjenester</title>
      <meta name="description" content="Ta kontakt med Avargo for et uforpliktende tilbud på regnskap, rådgivning og skatteoptimalisering. Vi svarer innen 24 timer." />
      <link rel="canonical" href="https://avargo.no/kontakt" />
    </Helmet>
    <section className="py-24 md:py-40 relative">
      <div className="absolute inset-0 ambient-glow opacity-40" />
      <div className="container mx-auto px-4 md:px-6 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 md:gap-24 max-w-5xl mx-auto">
          {/* Left */}
          <AnimatedSection>
            <p className="text-xs tracking-[0.4em] uppercase text-secondary mb-5 md:mb-6">Kom i gang</p>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl mb-6 md:mb-8 leading-snug">
              Fortell oss om selskapet ditt.{" "}
              <span className="italic text-gradient-rose">Vi tar det derfra.</span>
            </h1>
            <p className="text-foreground/70 text-base md:text-lg leading-relaxed mb-5 md:mb-6 font-light">
              Vi gir hver kunde en dedikert regnskapsfører som investerer seg i selskapet ditt. Fyll ut skjemaet, så kontakter vi deg innen 24 timer med et tilpasset forslag.
            </p>
            <p className="text-sm text-primary italic font-light mb-8 md:mb-10">
              Helt uforpliktende. Ingen binding. Bare en god samtale om hva du trenger.
            </p>
            <div className="space-y-3 md:space-y-4 mb-8 md:mb-10">
              {["Dedikert regnskapsfører fra dag én", "AI-drevet innsikt inkludert", "Alt i én fast pris — ingen overraskelser", "Tilpasset din bransje"].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm text-foreground/70 font-light">
                  <Check size={14} className="text-secondary shrink-0" strokeWidth={2} />
                  {item}
                </div>
              ))}
            </div>
            <div className="space-y-3 text-sm text-foreground/60 font-light">
              <div className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-primary/50" /><span>Oslo, Norge</span></div>
              <div className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-primary/50" /><span>post@avargo.no</span></div>
              <div className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-primary/50" /><span>+47 22 00 00 00</span></div>
            </div>
          </AnimatedSection>

          {/* Right - Form */}
          <AnimatedSection delay={0.2}>
            {submitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="flex items-center justify-center h-full min-h-[400px]">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-8 rounded-full bg-primary/15 flex items-center justify-center">
                    <Shield size={24} className="text-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-heading text-3xl mb-4">Mottatt!</h3>
                  <p className="text-foreground/60 font-light leading-relaxed mb-4">Vi gjennomgår informasjonen din og kontakter deg innen 24 timer med et tilpasset forslag.</p>
                  <p className="text-sm text-primary italic font-light">Takk for at du vurderer Avargo.</p>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                {/* Package indicator */}
                {valgtPakke && (
                  <div className="px-4 py-3 rounded-2xl bg-primary/10 border border-primary/20 text-sm text-primary">
                    Valgt pakke: <strong>{valgtPakke}</strong>
                  </div>
                )}

                {/* Company Search */}
                <div ref={dropdownRef} className="relative">
                  <label className={labelClass}>Søk opp selskap</label>
                  <div className="relative">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" />
                    <input
                      type="text"
                      value={companySearch}
                      onChange={(e) => setCompanySearch(e.target.value)}
                      className={`${inputClass} pl-11`}
                      placeholder="Skriv selskapets navn..."
                    />
                    {searching && <Loader2 size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40 animate-spin" />}
                  </div>
                  {showDropdown && (
                    <div className="absolute z-50 w-full mt-2 bg-card/98 backdrop-blur-xl border border-border/40 rounded-2xl overflow-hidden shadow-2xl max-h-80 overflow-y-auto">
                      {searchResults.map((enhet) => (
                        <button key={enhet.organisasjonsnummer} type="button" onClick={() => selectCompany(enhet)} className="w-full text-left px-4 py-3 hover:bg-primary/8 transition-colors border-b border-border/15 last:border-0">
                          <div className="flex items-center gap-3">
                            <Building2 size={14} className="text-primary/60 shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-foreground">{enhet.navn}</p>
                              <p className="text-xs text-foreground/50">
                                Org.nr: {enhet.organisasjonsnummer}
                                {enhet.forretningsadresse?.poststed && ` · ${enhet.forretningsadresse.poststed}`}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Selskapsnavn</label>
                    <input required type="text" value={selskapsnavn} onChange={(e) => setSelskapsnavn(e.target.value)} className={inputClass} placeholder="Selskapets navn" />
                  </div>
                  <div>
                    <label className={labelClass}>Org.nummer</label>
                    <input type="text" value={orgnummer} onChange={(e) => setOrgnummer(e.target.value)} className={inputClass} placeholder="9 siffer" />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>
                    Kontaktperson
                    {loadingRoles && <Loader2 size={10} className="inline ml-2 animate-spin" />}
                  </label>
                  <input required type="text" value={kontaktperson} onChange={(e) => setKontaktperson(e.target.value)} className={inputClass} placeholder="Ditt fulle navn" />
                </div>

                {naering && (
                  <div>
                    <label className={labelClass}>Næringsområde</label>
                    <input type="text" value={naering} onChange={(e) => setNaering(e.target.value)} className={inputClass} />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>E-post</label>
                    <input required type="email" value={epost} onChange={(e) => setEpost(e.target.value)} className={inputClass} placeholder="din@epost.no" />
                  </div>
                  <div>
                    <label className={labelClass}>Telefon</label>
                    <input required type="tel" value={telefon} onChange={(e) => setTelefon(e.target.value)} className={inputClass} placeholder="+47 000 00 000" />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Bransje</label>
                  <select required value={bransje} onChange={(e) => setBransje(e.target.value)} className={inputClass}>
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
                    <option>Restaurant & Uteliv</option>
                    <option>Frisør & Skjønnhet</option>
                    <option>Håndverkere & Fagfolk</option>
                    <option>Transport & Logistikk</option>
                    <option>Industri & Produksjon</option>
                    <option>Renhold & Facility</option>
                    <option>Kultur, Media & Underholdning</option>
                    <option>Sport & Fritid</option>
                    <option>Utdanning & Kurs</option>
                    <option>Juridisk & Advokat</option>
                    <option>Arkitektur & Design</option>
                    <option>Markedsføring & Reklame</option>
                    <option>Bemanning & Rekruttering</option>
                    <option>Reiseliv & Turisme</option>
                    <option>Bil & Verksted</option>
                    <option>Energi & Miljø</option>
                    <option>Annet</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Omsetningsmål neste 12 mnd</label>
                  <select required value={omsetning} onChange={(e) => setOmsetning(e.target.value)} className={inputClass}>
                    <option value="">Velg omsetningsnivå</option>
                    <option>Under 1 million</option>
                    <option>1–5 millioner</option>
                    <option>5–10 millioner</option>
                    <option>10–50 millioner</option>
                    <option>Over 50 millioner</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Hva er viktigst for deg i en regnskapsfører?</label>
                  <textarea required rows={3} value={frustrasjon} onChange={(e) => setFrustrasjon(e.target.value)} className={`${inputClass} resize-none`} placeholder="F.eks. god oppfølging, lave kostnader, noen som forstår bransjen min..." />
                </div>

                <button type="submit" disabled={submitting} className="group w-full flex items-center justify-center gap-3 py-4 bg-primary text-primary-foreground text-sm font-medium tracking-wider rounded-full glow-rose hover:scale-[1.01] transition-all duration-500 mt-2 disabled:opacity-60 disabled:cursor-not-allowed">
                  {submitting ? (
                    <><Loader2 size={15} className="animate-spin" /> Sender...</>
                  ) : (
                    <>Send henvendelse <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" /></>
                  )}
                </button>
                <p className="text-xs text-foreground/40 text-center font-light">Helt uforpliktende. Vi kontakter deg innen 24 timer.</p>
              </form>
            )}
          </AnimatedSection>
        </div>
      </div>
    </section>
    </>
  );
};

export default Contact;
