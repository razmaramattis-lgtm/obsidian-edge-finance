import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router-dom";
import { ArrowRight, Check, Shield, Search, Building2, Loader2, BarChart3, ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";
import { useSection } from "@/contexts/SectionContext";
import { sectionPageCopy } from "@/config/sectionContent";

const inputClass = "w-full bg-card/80 backdrop-blur-xl border border-border/40 rounded-2xl px-4 md:px-5 py-3.5 md:py-4 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary/50 focus:shadow-lg focus:shadow-primary/10 transition-all duration-500 font-light";
const labelClass = "text-[11px] tracking-[0.25em] uppercase text-foreground/60 block mb-2 font-medium";
const readonlyClass = "w-full bg-card/40 border border-border/20 rounded-2xl px-4 md:px-5 py-3.5 md:py-4 text-sm text-foreground/50 cursor-default font-light";

type BrregEnhet = {
  organisasjonsnummer: string;
  navn: string;
  naeringskode1?: { kode: string; beskrivelse: string };
  forretningsadresse?: { adresse?: string[]; postnummer?: string; poststed?: string };
  postadresse?: { adresse?: string[]; postnummer?: string; poststed?: string };
  epostadresse?: string;
  telefon?: string;
  mobil?: string;
  hjemmeside?: string;
  antallAnsatte?: number;
  stiftelsesdato?: string;
  registreringsdatoEnhetsregisteret?: string;
  organisasjonsform?: { beskrivelse?: string };
};

type RolleGruppe = {
  type: { kode: string; beskrivelse: string };
  roller: { type: { beskrivelse: string }; person?: { navn: { fornavn?: string; mellomnavn?: string; etternavn?: string } } }[];
};

function formatNOK(val: number | null | undefined): string {
  if (val == null) return "";
  const num = Math.round(Number(val));
  if (isNaN(num)) return "";
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1).replace(".", ",")} MNOK`;
  if (num >= 1_000) return `${Math.round(num / 1_000)} TNOK`;
  return `${num} NOK`;
}

interface FetchedFinancials {
  regnskapsaar: string;
  sumDriftsinntekter: string;
  sumDriftskostnader: string;
  driftsresultat: string;
  aarsresultat: string;
  sumEiendeler: string;
  sumEgenkapital: string;
  sumGjeld: string;
}

const Contact = () => {
  const [searchParams] = useSearchParams();
  const { section, isInSection } = useSection();
  const contactCopy = isInSection && section ? sectionPageCopy[section.id].kontakt : null;
  const [submitted, setSubmitted] = useState(false);
  const [companySearch, setCompanySearch] = useState("");
  const [searchResults, setSearchResults] = useState<BrregEnhet[]>([]);
  const [searching, setSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [fetched, setFetched] = useState(false);

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

  // Extra fetched fields
  const [orgForm, setOrgForm] = useState("");
  const [address, setAddress] = useState("");
  const [stiftelsesdato, setStiftelsesdato] = useState("");
  const [dagligLeder, setDagligLeder] = useState("");
  const [styreleder, setStyreleder] = useState("");
  const [numEmployees, setNumEmployees] = useState("");
  const [financials, setFinancials] = useState<FetchedFinancials | null>(null);
  const [showFinancials, setShowFinancials] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

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
        const isOrgNr = /^\d{9}$/.test(companySearch.trim());
        const url = isOrgNr
          ? `https://data.brreg.no/enhetsregisteret/api/enheter/${companySearch.trim()}`
          : `https://data.brreg.no/enhetsregisteret/api/enheter?navn=${encodeURIComponent(companySearch)}&size=8&fraAntallAnsatte=0`;
        const res = await fetch(url);
        if (!res.ok) { setSearchResults([]); setSearching(false); return; }
        const data = await res.json();
        if (isOrgNr) {
          setSearchResults(data?.organisasjonsnummer ? [data] : []);
          setShowDropdown(!!data?.organisasjonsnummer);
        } else {
          setSearchResults(data._embedded?.enheter || []);
          setShowDropdown((data._embedded?.enheter || []).length > 0);
        }
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

  const selectCompany = async (enhet: BrregEnhet) => {
    setCompanySearch(enhet.navn);
    setSelskapsnavn(enhet.navn);
    setOrgnummer(enhet.organisasjonsnummer);
    setNaering(enhet.naeringskode1 ? `${enhet.naeringskode1.kode} — ${enhet.naeringskode1.beskrivelse}` : "");
    if (enhet.epostadresse) setEpost(enhet.epostadresse);
    if (enhet.telefon) setTelefon(enhet.telefon);
    else if (enhet.mobil) setTelefon(enhet.mobil);
    if (enhet.naeringskode1?.beskrivelse) setBransje(mapBransje(enhet.naeringskode1.beskrivelse));
    setShowDropdown(false);

    // Set extra fields from enhet
    setOrgForm(enhet.organisasjonsform?.beskrivelse || "");
    setNumEmployees(enhet.antallAnsatte?.toString() || "");
    setStiftelsesdato(enhet.stiftelsesdato || enhet.registreringsdatoEnhetsregisteret || "");
    const addr = enhet.forretningsadresse || enhet.postadresse;
    setAddress(addr ? `${(addr.adresse || []).join(", ")}, ${addr.postnummer || ""} ${addr.poststed || ""}`.trim() : "");

    setLoadingRoles(true);

    // Fetch roller + regnskap in parallel
    const [rolleResult, regnskapResult] = await Promise.allSettled([
      fetch(`https://data.brreg.no/enhetsregisteret/api/enheter/${enhet.organisasjonsnummer}/roller`).then(r => r.ok ? r.json() : null),
      fetch(`https://data.brreg.no/regnskapsregisteret/regnskap/${enhet.organisasjonsnummer}`, {
        headers: { Accept: "application/json" },
      }).then(r => r.ok ? r.json() : null),
    ]);

    // Extract daglig leder + styreleder
    let dl = "";
    let sl = "";
    try {
      const rolleData = rolleResult.status === "fulfilled" ? rolleResult.value : null;
      const groups: RolleGruppe[] = rolleData?.rollegrupper || [];
      for (const g of groups) {
        if (g.type?.kode === "DAGL") {
          const n = g.roller?.[0]?.person?.navn;
          if (n) dl = [n.fornavn, n.mellomnavn, n.etternavn].filter(Boolean).join(" ");
        }
        if (g.type?.kode === "LEDE") {
          const n = g.roller?.[0]?.person?.navn;
          if (n) sl = [n.fornavn, n.mellomnavn, n.etternavn].filter(Boolean).join(" ");
        }
      }
    } catch { /* ignore */ }

    if (dl) setKontaktperson(dl);
    setDagligLeder(dl);
    setStyreleder(sl);

    // Extract financial data
    let fin: FetchedFinancials | null = null;
    try {
      const regnskapData = regnskapResult.status === "fulfilled" ? regnskapResult.value : null;
      const entries = Array.isArray(regnskapData) ? regnskapData : [];
      const selskap = entries.find((r: any) => r.regnskapstype === "SELSKAP") || entries[0];
      if (selskap) {
        const dr = selskap?.resultatregnskapResultat?.driftsresultat;
        const ek = selskap?.egenkapitalGjeld;
        const bal = selskap?.eiendeler;

        const sumDriftsinntekter = dr?.driftsinntekter?.sumDriftsinntekter;
        const sumDriftskostnader = dr?.driftskostnad?.sumDriftskostnad;
        const driftsresultat = dr?.driftsresultat;
        const aarsresultat = selskap?.resultatregnskapResultat?.totalresultat
          ?? selskap?.resultatregnskapResultat?.aarsresultat;
        const sumEiendeler = bal?.sumEiendeler;
        const sumEK = ek?.egenkapital?.sumEgenkapital;
        const sumGjeld = ek?.gjeldOversikt?.sumGjeld ?? ek?.gjeld?.sumGjeld;

        const regnskapsaar = selskap?.regnskapsperiode?.tilDato?.substring(0, 4)
          || selskap?.regnskapsperiode?.fraDato?.substring(0, 4)
          || "";

        fin = {
          regnskapsaar,
          sumDriftsinntekter: formatNOK(sumDriftsinntekter),
          sumDriftskostnader: formatNOK(sumDriftskostnader),
          driftsresultat: formatNOK(driftsresultat),
          aarsresultat: formatNOK(aarsresultat),
          sumEiendeler: formatNOK(sumEiendeler),
          sumEgenkapital: formatNOK(sumEK),
          sumGjeld: formatNOK(sumGjeld),
        };

        // Update employees from regnskap if enhetsreg didn't have it
        if (!enhet.antallAnsatte && selskap?.virksomhet?.antallAnsatte) {
          setNumEmployees(selskap.virksomhet.antallAnsatte.toString());
        }
      }
    } catch { /* ignore */ }

    setFinancials(fin);
    setFetched(true);
    setLoadingRoles(false);
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
          section: isInSection && section ? section.id : null,
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

  const finRows = financials ? [
    { label: "Driftsinntekter", value: financials.sumDriftsinntekter },
    { label: "Driftskostnader", value: financials.sumDriftskostnader },
    { label: "Driftsresultat", value: financials.driftsresultat },
    { label: "Årsresultat", value: financials.aarsresultat },
    { label: "Sum eiendeler", value: financials.sumEiendeler },
    { label: "Egenkapital", value: financials.sumEgenkapital },
    { label: "Gjeld", value: financials.sumGjeld },
  ].filter(r => r.value) : [];

  return (
    <>
    <Helmet>
      <title>{contactCopy ? `Kontakt — ${section!.name} | Avargo` : "Kontakt Avargo | Få tilbud på regnskapstjenester"}</title>
      <meta name="description" content={contactCopy?.sub || "Ta kontakt med Avargo for et uforpliktende tilbud. Vi svarer innen 24 timer."} />
      <link rel="canonical" href={`https://avargo.no${isInSection && section ? section.basePath : ""}/kontakt`} />
    </Helmet>
    <section className="py-24 md:py-40 relative">
      <div className="absolute inset-0 ambient-glow opacity-40" />
      <div className="container mx-auto px-4 md:px-6 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 md:gap-24 max-w-5xl mx-auto">
          {/* Left */}
          <AnimatedSection>
            <p className="text-xs tracking-[0.4em] uppercase text-secondary mb-5 md:mb-6">{contactCopy?.tag || "Uforpliktende henvendelse"}</p>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl mb-6 md:mb-8 leading-snug">
              {contactCopy?.headline || "Fortell oss om selskapet ditt."}{" "}
              <span className="italic text-gradient-rose">Vi tar det derfra.</span>
            </h1>
            <p className="text-foreground/70 text-base md:text-lg leading-relaxed mb-5 md:mb-6 font-light">
              {contactCopy?.sub || "Du får en dedikert, statsautorisert regnskapsfører som investerer seg i selskapet ditt. Fyll ut skjemaet, så tar vi kontakt innen 24 timer med et tilpasset forslag — helt uforpliktende."}
            </p>
            <p className="text-sm text-primary italic font-light mb-8 md:mb-10">
              {contactCopy?.italic || "Ingen binding. Ingen forpliktelser. Bare en samtale om hva du faktisk trenger."}
            </p>
            <div className="space-y-3 md:space-y-4 mb-8 md:mb-10">
              {(contactCopy?.bullets || ["Statsautorisert regnskapsfører fra dag én", "Alt inkludert i én fast pris", "Tilpasset din bransje og ditt selskap", "Svar innen 24 timer — alltid"]).map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm text-foreground/70 font-light">
                  <Check size={14} className="text-secondary shrink-0" strokeWidth={2} />
                  {item}
                </div>
              ))}
            </div>
            <div className="space-y-3 text-sm text-foreground/60 font-light">
              <div className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-primary/50" /><span>Oscars gate 2B, 3714 Skien</span></div>
              <div className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-primary/50" /><span>Åpent man–fre 08:00–16:00</span></div>
              
              <div className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-primary/50" /><a href="mailto:kontakt@avargo.no" className="hover:text-foreground transition-colors">kontakt@avargo.no</a></div>
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
                      placeholder="Skriv selskapets navn eller org.nr…"
                    />
                    {(searching || loadingRoles) && <Loader2 size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40 animate-spin" />}
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
                    <label className={labelClass}>Selskapsnavn <span className="text-foreground/30 normal-case tracking-normal">(valgfritt)</span></label>
                    <input type="text" value={selskapsnavn} onChange={(e) => setSelskapsnavn(e.target.value)} className={inputClass} placeholder="Selskapets navn" />
                  </div>
                  <div>
                    <label className={labelClass}>Org.nummer <span className="text-foreground/30 normal-case tracking-normal">(valgfritt)</span></label>
                    <input type="text" value={orgnummer} onChange={(e) => setOrgnummer(e.target.value)} className={inputClass} placeholder="9 siffer" />
                  </div>
                </div>

                {/* Fetched company details — hidden until Brreg lookup */}
                <AnimatePresence>
                  {fetched && (orgForm || address || stiftelsesdato || styreleder || numEmployees) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="rounded-2xl border border-border/20 bg-card/30 p-4 space-y-3">
                        <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/30 font-medium">Hentet fra Brønnøysund</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {orgForm && (
                            <div>
                              <label className={labelClass}>Organisasjonsform</label>
                              <input value={orgForm} readOnly tabIndex={-1} className={readonlyClass} />
                            </div>
                          )}
                          {stiftelsesdato && (
                            <div>
                              <label className={labelClass}>Stiftelsesdato</label>
                              <input value={stiftelsesdato} readOnly tabIndex={-1} className={readonlyClass} />
                            </div>
                          )}
                        </div>
                        {address && (
                          <div>
                            <label className={labelClass}>Adresse</label>
                            <input value={address} readOnly tabIndex={-1} className={readonlyClass} />
                          </div>
                        )}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {dagligLeder && (
                            <div>
                              <label className={labelClass}>Daglig leder</label>
                              <input value={dagligLeder} readOnly tabIndex={-1} className={readonlyClass} />
                            </div>
                          )}
                          {styreleder && (
                            <div>
                              <label className={labelClass}>Styreleder</label>
                              <input value={styreleder} readOnly tabIndex={-1} className={readonlyClass} />
                            </div>
                          )}
                        </div>
                        {numEmployees && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className={labelClass}>Antall ansatte</label>
                              <input value={numEmployees} readOnly tabIndex={-1} className={readonlyClass} />
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Financials panel — hidden until Brreg lookup */}
                <AnimatePresence>
                  {fetched && finRows.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="rounded-2xl border border-border/20 bg-card/30 overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setShowFinancials(v => !v)}
                          className="w-full flex items-center justify-between px-4 py-3 text-xs text-foreground/50 hover:text-foreground/70 transition-colors"
                        >
                          <span className="flex items-center gap-2">
                            <BarChart3 size={13} className="text-primary/60" />
                            <span className="uppercase tracking-[0.3em] font-medium text-[10px]">
                              Regnskap {financials?.regnskapsaar || "siste år"}
                            </span>
                          </span>
                          {showFinancials ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                        <AnimatePresence>
                          {showFinancials && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="px-4 pb-4 space-y-1">
                                {finRows.map(r => (
                                  <div key={r.label} className="flex items-center justify-between text-sm py-1.5 border-b border-border/10 last:border-0">
                                    <span className="text-foreground/40 font-light">{r.label}</span>
                                    <span className="text-foreground/70 font-medium">{r.value}</span>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div>
                  <label className={labelClass}>Navn</label>
                  <input required type="text" value={kontaktperson} onChange={(e) => setKontaktperson(e.target.value)} className={inputClass} placeholder="Ditt navn" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>E-post</label>
                    <input required type="email" value={epost} onChange={(e) => setEpost(e.target.value)} className={inputClass} placeholder="din@epost.no" />
                  </div>
                  <div>
                    <label className={labelClass}>Telefon <span className="text-foreground/30 normal-case tracking-normal">(valgfritt)</span></label>
                    <input type="tel" value={telefon} onChange={(e) => setTelefon(e.target.value)} className={inputClass} placeholder="+47 000 00 000" />
                  </div>
                </div>

                {/* Optional details — collapsed by default to reduce friction */}
                <div className="rounded-2xl border border-border/20 bg-card/20 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setShowDetails(v => !v)}
                    className="w-full flex items-center justify-between px-4 py-3 text-xs text-foreground/50 hover:text-foreground/80 transition-colors"
                  >
                    <span className="uppercase tracking-[0.25em] font-medium text-[11px]">
                      Vil du at vi forbereder oss? Legg til detaljer (valgfritt)
                    </span>
                    {showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                  <AnimatePresence>
                    {showDetails && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-5 space-y-4">
                          {naering && (
                            <div>
                              <label className={labelClass}>Næringsområde</label>
                              <input type="text" value={naering} onChange={(e) => setNaering(e.target.value)} className={inputClass} />
                            </div>
                          )}
                          <div>
                            <label className={labelClass}>Bransje</label>
                            <select value={bransje} onChange={(e) => setBransje(e.target.value)} className={inputClass}>
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
                            <select value={omsetning} onChange={(e) => setOmsetning(e.target.value)} className={inputClass}>
                              <option value="">Velg omsetningsnivå</option>
                              <option>Under 1 million</option>
                              <option>1–5 millioner</option>
                              <option>5–10 millioner</option>
                              <option>10–50 millioner</option>
                              <option>Over 50 millioner</option>
                            </select>
                          </div>
                          <div>
                            <label className={labelClass}>Hva er viktigst for deg?</label>
                            <textarea rows={3} value={frustrasjon} onChange={(e) => setFrustrasjon(e.target.value)} className={`${inputClass} resize-none`} placeholder="F.eks. god oppfølging, lave kostnader, noen som forstår bransjen min..." />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button type="submit" disabled={submitting} className="group w-full flex items-center justify-center gap-3 py-4 bg-primary text-primary-foreground text-sm font-medium tracking-wider rounded-full glow-rose hover:scale-[1.01] transition-all duration-500 mt-2 disabled:opacity-60 disabled:cursor-not-allowed">
                  {submitting ? (
                    <><Loader2 size={15} className="animate-spin" /> Sender...</>
                  ) : (
                    <>Få et uforpliktende tilbud <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" /></>
                  )}
                </button>
                <p className="text-xs text-foreground/40 text-center font-light">
                  Tar 30 sekunder · Ingen binding · Vi svarer innen 24 timer
                </p>
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
