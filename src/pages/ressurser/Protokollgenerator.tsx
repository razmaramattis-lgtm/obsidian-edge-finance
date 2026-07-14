import { useState, useMemo, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { PDFViewer, pdf } from "@react-pdf/renderer";
import {
  ArrowLeft, ArrowRight, FileText, Search, Plus, Trash2, Check,
  ChevronRight, Download, Building2, Users, Calendar, ClipboardCheck,
  Sparkles, SkipForward,
} from "lucide-react";
import {
  emptyProfile, emptyDocument, documentTypes, sakModuler,
  type CompanyProfile, type DocumentState, type DocumentType, type SakModulId,
} from "@/lib/protokoll/types";
import { ProtokollDocument } from "@/lib/protokoll/pdf";
import { toast } from "sonner";

// ============================================================
// Steg-definisjoner per dokumenttype
// ============================================================

type Steg = { id: string; tittel: string };

const stegPerType: Record<DocumentType, Steg[]> = {
  styremoteprotokoll: [
    { id: "profil", tittel: "Selskapsprofil" },
    { id: "mote", tittel: "Møteinfo" },
    { id: "styre", tittel: "Styremedlemmer" },
    { id: "regnskap", tittel: "Regnskap" },
    { id: "saker", tittel: "Saker" },
    { id: "signatur", tittel: "Signatur" },
  ],
  innkalling_styremote: [
    { id: "profil", tittel: "Selskapsprofil" },
    { id: "mote", tittel: "Møteinfo" },
    { id: "saker", tittel: "Saker" },
    { id: "signatur", tittel: "Signatur" },
  ],
  gf_forenklet: [
    { id: "profil", tittel: "Selskapsprofil" },
    { id: "aksjonaerer", tittel: "Aksjonærer" },
    { id: "mote", tittel: "Møteinfo" },
    { id: "regnskap", tittel: "Regnskap" },
    { id: "vedtak", tittel: "Vedtak" },
    { id: "saker", tittel: "Ekstra saker" },
    { id: "signatur", tittel: "Signatur" },
  ],
  gf_alminnelige_regler: [
    { id: "profil", tittel: "Selskapsprofil" },
    { id: "aksjonaerer", tittel: "Aksjonærer" },
    { id: "mote", tittel: "Møteinfo" },
    { id: "regnskap", tittel: "Regnskap" },
    { id: "vedtak", tittel: "Vedtak" },
    { id: "saker", tittel: "Ekstra saker" },
    { id: "signatur", tittel: "Signatur" },
  ],
  innkalling_gf: [
    { id: "profil", tittel: "Selskapsprofil" },
    { id: "mote", tittel: "Møteinfo" },
    { id: "saker", tittel: "Saker" },
    { id: "signatur", tittel: "Signatur" },
  ],
};

// ============================================================
// LocalStorage-nøkler (autosave)
// ============================================================

const LS_PROFILE = "avargo.protokoll.profile";
const LS_DOCS = "avargo.protokoll.docs";
const LS_ACTIVE = "avargo.protokoll.active";

// ============================================================
// Brreg-oppslag
// ============================================================

async function slaOppOrgnr(orgnr: string) {
  const clean = orgnr.replace(/\s/g, "");
  const res = await fetch(`https://data.brreg.no/enhetsregisteret/api/enheter/${clean}`);
  if (!res.ok) throw new Error("Fant ikke selskapet");
  return await res.json();
}

type BrregTreff = {
  organisasjonsnummer: string;
  navn: string;
  forretningsadresse?: { adresse?: string[]; postnummer?: string; poststed?: string };
  organisasjonsform?: { kode?: string; beskrivelse?: string };
};

async function sokBrreg(q: string): Promise<BrregTreff[]> {
  const clean = q.trim();
  if (!clean) return [];
  const isOrgnr = /^\d[\d\s]{7,}$/.test(clean);
  const url = isOrgnr
    ? `https://data.brreg.no/enhetsregisteret/api/enheter?organisasjonsnummer=${clean.replace(/\s/g, "")}`
    : `https://data.brreg.no/enhetsregisteret/api/enheter?navn=${encodeURIComponent(clean)}&size=8`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  return (data?._embedded?.enheter as BrregTreff[]) || [];
}


// ============================================================
// UI-hjelpere
// ============================================================

const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-1.5">{children}</label>
);

const Input = ({ value, onChange, ...rest }: React.InputHTMLAttributes<HTMLInputElement> & { onChange: (v: string) => void }) => (
  <input
    {...rest}
    value={value ?? ""}
    onChange={(e) => onChange(e.target.value)}
    className="w-full h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
  />
);

const NumInput = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => (
  <input
    type="number"
    value={value || ""}
    onChange={(e) => onChange(Number(e.target.value) || 0)}
    className="w-full h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
  />
);

const Textarea = ({ value, onChange, rows = 3 }: { value: string; onChange: (v: string) => void; rows?: number }) => (
  <textarea
    rows={rows}
    value={value ?? ""}
    onChange={(e) => onChange(e.target.value)}
    className="w-full rounded-xl border border-border/30 bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
  />
);

const Toggle = ({ value, onChange, options }: { value: boolean | string; onChange: (v: boolean | string) => void; options: { v: boolean | string; l: string }[] }) => (
  <div className="inline-flex rounded-xl border border-border/30 bg-muted/20 p-1">
    {options.map(o => (
      <button
        key={String(o.v)}
        type="button"
        onClick={() => onChange(o.v)}
        className={`px-4 py-1.5 rounded-lg text-xs transition-all ${
          value === o.v ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        {o.l}
      </button>
    ))}
  </div>
);

// ============================================================
// Hovedkomponent
// ============================================================

const Protokollgenerator = () => {
  const [profile, setProfile] = useState<CompanyProfile>(emptyProfile());
  const [docs, setDocs] = useState<DocumentState[]>([]);
  const [activeDocIdx, setActiveDocIdx] = useState<number>(0);
  const [stegIdx, setStegIdx] = useState(0);
  const [phase, setPhase] = useState<"velg" | "utfyll" | "ferdig">("velg");
  // (Brreg-søk håndteres nå inne i StegProfil)


  // Autosave — load
  useEffect(() => {
    try {
      const p = localStorage.getItem(LS_PROFILE);
      const d = localStorage.getItem(LS_DOCS);
      const a = localStorage.getItem(LS_ACTIVE);
      if (p) setProfile(JSON.parse(p));
      if (d) {
        const parsed = JSON.parse(d) as DocumentState[];
        setDocs(parsed);
        if (parsed.length > 0) setPhase("utfyll");
      }
      if (a) setActiveDocIdx(Number(a));
    } catch { /* ignore */ }
  }, []);

  // Autosave — persist
  useEffect(() => {
    const t = setTimeout(() => {
      localStorage.setItem(LS_PROFILE, JSON.stringify(profile));
      localStorage.setItem(LS_DOCS, JSON.stringify(docs));
      localStorage.setItem(LS_ACTIVE, String(activeDocIdx));
    }, 400);
    return () => clearTimeout(t);
  }, [profile, docs, activeDocIdx]);

  const activeDoc = docs[activeDocIdx];
  const steg = activeDoc ? stegPerType[activeDoc.type] : [];
  const currentSteg = steg[stegIdx];

  // -------- Handlers --------

  const oppdaterProfile = (updater: (p: CompanyProfile) => CompanyProfile) => setProfile(updater);
  const oppdaterDoc = (updater: (d: DocumentState) => DocumentState) => {
    setDocs(prev => prev.map((d, i) => (i === activeDocIdx ? updater(d) : d)));
  };

  const toggleDocType = (type: DocumentType) => {
    setDocs(prev => {
      const exists = prev.findIndex(d => d.type === type);
      if (exists >= 0) return prev.filter((_, i) => i !== exists);
      return [...prev, emptyDocument(type)];
    });
  };

  const startUtfylling = () => {
    if (docs.length === 0) {
      toast.error("Velg minst ett dokument");
      return;
    }
    setPhase("utfyll");
    setActiveDocIdx(0);
    setStegIdx(0);
  };

  const nesteSteg = () => {
    if (stegIdx < steg.length - 1) setStegIdx(stegIdx + 1);
    else {
      // Neste dokument, eller ferdig
      if (activeDocIdx < docs.length - 1) {
        setActiveDocIdx(activeDocIdx + 1);
        setStegIdx(0);
      } else {
        setPhase("ferdig");
      }
    }
  };

  const forrigeSteg = () => {
    if (stegIdx > 0) setStegIdx(stegIdx - 1);
    else if (activeDocIdx > 0) {
      const prev = docs[activeDocIdx - 1];
      setActiveDocIdx(activeDocIdx - 1);
      setStegIdx(stegPerType[prev.type].length - 1);
    }
  };

  // Steg som kan hoppes over (kun for å komme raskt til fritt valg av saker)
  const canSkipCurrent = currentSteg?.id === "vedtak" || currentSteg?.id === "regnskap";

  // ---- Live PDF change tracker ------------------------------------------
  // Sporer hvilke sak-moduler og hovedområder som er oppdatert siden forrige render.
  const prevSnapshotRef = useRef<{ profile: string; saker: Record<string, string>; answers: string } | null>(null);
  const [changeTick, setChangeTick] = useState(0);
  const [lastChangeLabel, setLastChangeLabel] = useState<string>("");
  const [changedSaker, setChangedSaker] = useState<Set<string>>(new Set());
  const changedProfileRef = useRef(false);
  const [profilePulseTick, setProfilePulseTick] = useState(0);

  useEffect(() => {
    if (!activeDoc) return;
    const profileHash = JSON.stringify(profile);
    const answersHash = JSON.stringify(activeDoc.answers);
    const sakerHash: Record<string, string> = {};
    activeDoc.sub_sections.forEach(s => { sakerHash[`${s.id}-${activeDoc.sub_sections.indexOf(s)}`] = JSON.stringify(s.data); });

    const prev = prevSnapshotRef.current;
    if (prev) {
      const newChanged = new Set<string>();
      let label = "";
      if (prev.profile !== profileHash) { label = "Selskapsprofil"; setProfilePulseTick(t => t + 1); }
      if (prev.answers !== answersHash) label = label || "Dokumentvalg";
      activeDoc.sub_sections.forEach((s, idx) => {
        const key = `${s.id}-${idx}`;
        if (prev.saker[key] !== sakerHash[key]) {
          newChanged.add(s.id);
          const def = sakModuler.find(m => m.id === s.id);
          label = def?.tittel || label;
        }
      });
      // Sjekk om sak lagt til/fjernet
      const prevIds = Object.keys(prev.saker);
      const currIds = Object.keys(sakerHash);
      if (prevIds.length !== currIds.length) label = label || "Sakslisten";

      if (label) {
        setLastChangeLabel(label);
        setChangedSaker(newChanged);
        setChangeTick(t => t + 1);
      }
    }
    prevSnapshotRef.current = { profile: profileHash, saker: sakerHash, answers: answersHash };
  }, [profile, activeDoc]);

  // Fjern sak-pulse etter 1.4s
  useEffect(() => {
    if (changedSaker.size === 0) return;
    const t = setTimeout(() => setChangedSaker(new Set()), 1400);
    return () => clearTimeout(t);
  }, [changeTick]);

  const applyBrreg = (data: {
    navn?: string; organisasjonsnummer?: string;
    forretningsadresse?: { adresse?: string[]; postnummer?: string; poststed?: string };
    stiftelsesdato?: string;
  }) => {
    oppdaterProfile(p => ({
      ...p,
      selskap: {
        ...p.selskap,
        navn: data.navn || p.selskap.navn,
        orgnummer: data.organisasjonsnummer || p.selskap.orgnummer,
        adresse: data.forretningsadresse?.adresse?.join(", ") || p.selskap.adresse,
        postnummer: data.forretningsadresse?.postnummer || p.selskap.postnummer,
        poststed: data.forretningsadresse?.poststed || p.selskap.poststed,
        stiftelsesdato: data.stiftelsesdato || p.selskap.stiftelsesdato,
      },
    }));
    toast.success("Selskapsdata hentet fra Brønnøysund");
  };


  const resetAll = () => {
    if (!confirm("Vil du starte på nytt? Alle data slettes.")) return;
    localStorage.removeItem(LS_PROFILE);
    localStorage.removeItem(LS_DOCS);
    localStorage.removeItem(LS_ACTIVE);
    setProfile(emptyProfile());
    setDocs([]);
    setActiveDocIdx(0);
    setStegIdx(0);
    setPhase("velg");
  };

  // ============================================================
  // Steg-innhold
  // ============================================================

  const renderSteg = () => {
    if (!activeDoc || !currentSteg) return null;
    switch (currentSteg.id) {
      case "profil": return <StegProfil profile={profile} update={oppdaterProfile} applyBrreg={applyBrreg} />;
      case "styre": return <StegStyre profile={profile} update={oppdaterProfile} />;
      case "aksjonaerer": return <StegAksjonaerer profile={profile} update={oppdaterProfile} />;
      case "mote": return <StegMote profile={profile} update={oppdaterProfile} doc={activeDoc} updateDoc={oppdaterDoc} />;
      case "regnskap": return <StegRegnskap profile={profile} update={oppdaterProfile} doc={activeDoc} updateDoc={oppdaterDoc} />;
      case "vedtak": return <StegVedtak doc={activeDoc} updateDoc={oppdaterDoc} />;
      case "saker": return <StegSaker doc={activeDoc} updateDoc={oppdaterDoc} />;
      case "signatur": return <StegSignatur doc={activeDoc} updateDoc={oppdaterDoc} profile={profile} update={oppdaterProfile} />;
    }
    return null;
  };

  // ============================================================
  // Render
  // ============================================================

  return (
    <>
      <Helmet>
        <title>Protokollgenerator — Styreprotokoll og generalforsamling | Avargo</title>
        <meta name="description" content="Gratis verktøy for å lage juridisk korrekte styreprotokoller, innkallinger og generalforsamlingsprotokoller. Automatisk oppslag i Brønnøysund og PDF-nedlasting." />
        <link rel="canonical" href="https://avargo.no/ressurser/protokollgenerator" />
      </Helmet>

      {/* Hero */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 ambient-glow opacity-20" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-4xl">
            <Link to="/ressurser" className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors mb-6">
              <ArrowLeft size={14} /> Tilbake til ressurser
            </Link>
            <p className="text-[10px] tracking-[0.45em] uppercase text-secondary mb-5">Avargo · Verktøy</p>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-7xl leading-[1.05] mb-6">
              Protokoll- og <span className="italic text-gradient-rose">generalforsamlingsgenerator.</span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground font-light leading-relaxed max-w-2xl">
              Bygg juridisk korrekte styreprotokoller, innkallinger og generalforsamlingsprotokoller på minutter.
              Fyll ut én selskapsprofil — vi bruker den på tvers av alle dokumentene i pakken.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6"><div className="line-accent" /></div>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          {phase === "velg" && (
            <VelgDokumenter docs={docs} toggle={toggleDocType} start={startUtfylling} />
          )}

          {phase === "utfyll" && activeDoc && (
            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_1fr] gap-6">
              {/* Sidemeny */}
              <aside className="glass rounded-2xl border border-border/20 p-5 h-fit lg:sticky lg:top-24">
                <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-3">Din pakke</p>
                <div className="space-y-1 mb-6">
                  {docs.map((d, i) => {
                    const dt = documentTypes.find(t => t.id === d.type);
                    const total = stegPerType[d.type].length;
                    const done = i < activeDocIdx ? total : (i === activeDocIdx ? stegIdx : 0);
                    return (
                      <button
                        key={i}
                        onClick={() => { setActiveDocIdx(i); setStegIdx(0); }}
                        className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all ${
                          i === activeDocIdx ? "bg-primary/10 text-primary border border-primary/20" : "hover:bg-muted/30 border border-transparent"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="line-clamp-1">{dt?.navn}</span>
                          <span className="text-[10px] opacity-60 shrink-0">{done}/{total}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <div className="border-t border-border/20 pt-4 space-y-2">
                  <button onClick={() => setPhase("velg")} className="w-full text-left text-xs text-muted-foreground hover:text-primary transition-colors">
                    Endre valg
                  </button>
                  <button onClick={() => setPhase("ferdig")} className="w-full text-left text-xs text-muted-foreground hover:text-primary transition-colors">
                    Gå til ferdigstilling →
                  </button>
                  <button onClick={resetAll} className="w-full text-left text-xs text-destructive/70 hover:text-destructive transition-colors">
                    Start på nytt
                  </button>
                </div>
              </aside>

              {/* Skjema */}
              <div className="glass rounded-2xl border border-border/20 p-6 md:p-8">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[10px] tracking-[0.3em] uppercase text-primary">
                    Steg {stegIdx + 1} av {steg.length}
                  </p>
                  <p className="text-[10px] text-muted-foreground/60">✓ Autolagres</p>
                </div>
                <h2 className="font-heading text-2xl md:text-3xl mb-6">{currentSteg?.tittel}</h2>
                <div className="space-y-5">{renderSteg()}</div>

                <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/20 gap-2">
                  <button
                    onClick={forrigeSteg}
                    disabled={activeDocIdx === 0 && stegIdx === 0}
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ArrowLeft size={14} /> Forrige
                  </button>
                  <div className="flex items-center gap-3">
                    {canSkipCurrent && (
                      <button
                        onClick={nesteSteg}
                        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                        title="Hopp over dette steget — du kan f.eks. gå rett til å velge kun konsernbidrag eller kun daglig leder."
                      >
                        <SkipForward size={12} /> Hopp over
                      </button>
                    )}
                    <button
                      onClick={nesteSteg}
                      className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm hover:bg-primary/90 transition-all"
                    >
                      {stegIdx === steg.length - 1 && activeDocIdx === docs.length - 1 ? "Til ferdigstilling" : "Neste"}
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Live preview med endringsindikator */}
              <LivePreviewPanel
                profile={profile}
                doc={activeDoc}
                changeTick={changeTick}
                lastChangeLabel={lastChangeLabel}
                changedSaker={changedSaker}
                profilePulseTick={profilePulseTick}
              />
            </div>
          )}

          {phase === "ferdig" && (
            <Ferdigstilling docs={docs} profile={profile} tilbake={() => setPhase("utfyll")} reset={resetAll} />
          )}
        </div>
      </section>

      {/* Footer credit */}
      <section className="py-10 border-t border-border/10">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <p className="text-xs text-muted-foreground/60">
            Protokoll- og generalforsamlingsgenerator er produsert av <span className="text-foreground font-medium">Avargo</span>.
          </p>
        </div>
      </section>
    </>
  );
};

// ============================================================
// Fase 1: Velg dokumenter
// ============================================================

const VelgDokumenter = ({ docs, toggle, start }: { docs: DocumentState[]; toggle: (t: DocumentType) => void; start: () => void }) => (
  <div className="max-w-4xl mx-auto">
    <div className="text-center mb-10">
      <p className="text-[10px] tracking-[0.3em] uppercase text-secondary mb-3">Steg 1</p>
      <h2 className="font-heading text-3xl md:text-4xl mb-3">Hvilke dokumenter trenger du?</h2>
      <p className="text-sm text-muted-foreground font-light">Kryss av alle du vil generere i denne pakken — vi deler selskapsprofilen på tvers.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
      {documentTypes.map(t => {
        const selected = docs.some(d => d.type === t.id);
        return (
          <button
            key={t.id}
            onClick={() => toggle(t.id)}
            className={`text-left p-6 rounded-2xl border transition-all ${
              selected ? "border-primary bg-primary/5" : "border-border/20 glass hover:border-primary/30"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                selected ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
              }`}>
                {selected ? <Check size={18} /> : <FileText size={18} />}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-base mb-1">{t.navn}</h3>
                <p className="text-xs text-muted-foreground font-light leading-relaxed">{t.kort}</p>
              </div>
            </div>
          </button>
        );
      })}
    </div>

    <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground">
        <span className="text-foreground font-medium">{docs.length}</span> av {documentTypes.length} dokumenter valgt
      </p>
      <button
        onClick={start}
        disabled={docs.length === 0}
        className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl text-sm hover:bg-primary/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Til utfylling <ArrowRight size={14} />
      </button>
    </div>
  </div>
);

// ============================================================
// Steg: Selskapsprofil
// ============================================================

const StegProfil = ({ profile, update, applyBrreg }: {
  profile: CompanyProfile;
  update: (u: (p: CompanyProfile) => CompanyProfile) => void;
  applyBrreg: (data: BrregTreff & { stiftelsesdato?: string }) => void;
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<BrregTreff[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) { setResults([]); return; }
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const treff = await sokBrreg(q);
        setResults(treff);
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [query]);

  const velg = async (t: BrregTreff) => {
    setOpen(false);
    setQuery("");
    try {
      // Hent full enhet for stiftelsesdato osv.
      const full = await slaOppOrgnr(t.organisasjonsnummer);
      applyBrreg(full);
    } catch {
      applyBrreg(t);
    }
  };

  return (
    <>
      <div>
        <Label>Slå opp selskap i Brønnøysund</Label>
        <div className="relative">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={e => { setQuery(e.target.value); setOpen(true); }}
              onFocus={() => results.length > 0 && setOpen(true)}
              onBlur={() => setTimeout(() => setOpen(false), 150)}
              placeholder="Søk på firmanavn eller 9-sifret org.nr"
              className="w-full h-10 rounded-xl border border-border/30 bg-muted/30 pl-9 pr-24 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            {loading && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">Søker…</span>
            )}
          </div>
          {open && query.trim().length >= 2 && (
            <div className="absolute left-0 right-0 top-full mt-1 z-20 max-h-72 overflow-auto rounded-xl border border-border/30 bg-card shadow-lg">
              {results.length === 0 && !loading && (
                <div className="px-4 py-3 text-xs text-muted-foreground">Ingen treff — prøv annet navn eller skriv inn manuelt.</div>
              )}
              {results.map(t => (
                <button
                  key={t.organisasjonsnummer}
                  type="button"
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => velg(t)}
                  className="w-full text-left px-4 py-2.5 hover:bg-muted/40 border-b border-border/20 last:border-b-0"
                >
                  <div className="text-sm font-medium truncate">{t.navn}</div>
                  <div className="text-[11px] text-muted-foreground truncate">
                    Org.nr {t.organisasjonsnummer}
                    {t.forretningsadresse?.poststed ? ` · ${t.forretningsadresse.postnummer ?? ""} ${t.forretningsadresse.poststed}` : ""}
                    {t.organisasjonsform?.kode ? ` · ${t.organisasjonsform.kode}` : ""}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        <p className="text-[11px] text-muted-foreground/70 mt-1.5">Skriv minst 2 tegn — vi henter selskapsdata direkte fra Brønnøysundregistrene.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Selskapsnavn</Label>
          <Input value={profile.selskap.navn} onChange={v => update(p => ({ ...p, selskap: { ...p.selskap, navn: v } }))} />
        </div>
        <div>
          <Label>Org.nr</Label>
          <Input value={profile.selskap.orgnummer} onChange={v => update(p => ({ ...p, selskap: { ...p.selskap, orgnummer: v } }))} />
        </div>
        <div className="md:col-span-2">
          <Label>Adresse</Label>
          <Input value={profile.selskap.adresse} onChange={v => update(p => ({ ...p, selskap: { ...p.selskap, adresse: v } }))} />
        </div>
        <div>
          <Label>Postnummer</Label>
          <Input value={profile.selskap.postnummer} onChange={v => update(p => ({ ...p, selskap: { ...p.selskap, postnummer: v } }))} />
        </div>
        <div>
          <Label>Poststed</Label>
          <Input value={profile.selskap.poststed} onChange={v => update(p => ({ ...p, selskap: { ...p.selskap, poststed: v } }))} />
        </div>
      </div>
    </>
  );
};


// ============================================================
// Steg: Styremedlemmer
// ============================================================

const StegStyre = ({ profile, update }: { profile: CompanyProfile; update: (u: (p: CompanyProfile) => CompanyProfile) => void }) => {
  const add = () => update(p => ({ ...p, styre: { ...p.styre, styremedlemmer: [...p.styre.styremedlemmer, { navn: "", rolle: "medlem", deltok: true }] } }));
  const remove = (i: number) => update(p => ({ ...p, styre: { ...p.styre, styremedlemmer: p.styre.styremedlemmer.filter((_, idx) => idx !== i) } }));
  const set = (i: number, k: string, v: string | boolean) => update(p => ({
    ...p,
    styre: { ...p.styre, styremedlemmer: p.styre.styremedlemmer.map((m, idx) => idx === i ? { ...m, [k]: v } : m) },
  }));

  return (
    <>
      <div>
        <Label>Styrets leder</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Input value={profile.styre.styreleder.navn} onChange={v => update(p => ({ ...p, styre: { ...p.styre, styreleder: { ...p.styre.styreleder, navn: v } } }))} placeholder="Navn" />
          <Input value={profile.styre.styreleder.epost || ""} onChange={v => update(p => ({ ...p, styre: { ...p.styre, styreleder: { ...p.styre.styreleder, epost: v } } }))} placeholder="E-post" />
          <Input value={profile.styre.styreleder.telefon || ""} onChange={v => update(p => ({ ...p, styre: { ...p.styre, styreleder: { ...p.styre.styreleder, telefon: v } } }))} placeholder="Telefon" />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Øvrige styremedlemmer</Label>
          <button onClick={add} className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline">
            <Plus size={12} /> Legg til
          </button>
        </div>
        <div className="space-y-2">
          {profile.styre.styremedlemmer.length === 0 && <p className="text-xs text-muted-foreground italic">Ingen lagt til ennå.</p>}
          {profile.styre.styremedlemmer.map((m, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_120px_auto] gap-2 items-center">
              <Input value={m.navn} onChange={v => set(i, "navn", v)} placeholder="Navn" />
              <Input value={m.rolle || "medlem"} onChange={v => set(i, "rolle", v)} placeholder="Rolle" />
              <Toggle value={m.deltok !== false} onChange={v => set(i, "deltok", v as boolean)} options={[{ v: true, l: "Deltok" }, { v: false, l: "Nei" }]} />
              <button onClick={() => remove(i)} className="text-muted-foreground hover:text-destructive transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

// ============================================================
// Steg: Aksjonærer
// ============================================================

const StegAksjonaerer = ({ profile, update }: { profile: CompanyProfile; update: (u: (p: CompanyProfile) => CompanyProfile) => void }) => {
  const add = () => update(p => ({ ...p, aksjonaerer: [...p.aksjonaerer, { navn: "", antall_aksjer: 0, representant_fullmektig: "" }] }));
  const remove = (i: number) => update(p => ({ ...p, aksjonaerer: p.aksjonaerer.filter((_, idx) => idx !== i) }));
  const set = (i: number, k: string, v: string | number) => update(p => ({
    ...p,
    aksjonaerer: p.aksjonaerer.map((a, idx) => idx === i ? { ...a, [k]: v } : a),
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <Label>Aksjonærer</Label>
        <button onClick={add} className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline">
          <Plus size={12} /> Legg til aksjonær
        </button>
      </div>
      <div className="space-y-2">
        {profile.aksjonaerer.length === 0 && <p className="text-xs text-muted-foreground italic">Ingen lagt til ennå.</p>}
        {profile.aksjonaerer.map((a, i) => (
          <div key={i} className="grid grid-cols-[1.5fr_100px_1.5fr_auto] gap-2 items-center">
            <Input value={a.navn} onChange={v => set(i, "navn", v)} placeholder="Navn" />
            <NumInput value={a.antall_aksjer} onChange={v => set(i, "antall_aksjer", v)} />
            <Input value={a.representant_fullmektig || ""} onChange={v => set(i, "representant_fullmektig", v)} placeholder="Representant/fullmektig" />
            <button onClick={() => remove(i)} className="text-muted-foreground hover:text-destructive transition-colors">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================
// Steg: Møteinfo
// ============================================================

const StegMote = ({ profile, update, doc, updateDoc }: {
  profile: CompanyProfile; update: (u: (p: CompanyProfile) => CompanyProfile) => void;
  doc: DocumentState; updateDoc: (u: (d: DocumentState) => DocumentState) => void;
}) => (
  <>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <Label>Dato</Label>
        <Input type="date" value={profile.moteinfo.dato} onChange={v => update(p => ({ ...p, moteinfo: { ...p.moteinfo, dato: v } }))} />
      </div>
      <div>
        <Label>Klokkeslett</Label>
        <Input type="time" value={profile.moteinfo.klokkeslett} onChange={v => update(p => ({ ...p, moteinfo: { ...p.moteinfo, klokkeslett: v } }))} />
      </div>
      <div>
        <Label>Møte nr.</Label>
        <Input value={profile.moteinfo.motenr} onChange={v => update(p => ({ ...p, moteinfo: { ...p.moteinfo, motenr: v } }))} placeholder="1/2026" />
      </div>
      <div className="md:col-span-3">
        <Label>Sted eller møteform</Label>
        <Input value={profile.moteinfo.sted_eller_moteform} onChange={v => update(p => ({ ...p, moteinfo: { ...p.moteinfo, sted_eller_moteform: v } }))} placeholder="F.eks. Selskapets kontor eller Teams-møte" />
      </div>
    </div>

    {(doc.type === "styremoteprotokoll" || doc.type === "innkalling_styremote") && (
      <div className="space-y-3 pt-4 border-t border-border/20">
        <ToggleRow label="Har selskapet årsberetning?" value={profile.regnskap.har_arsberetning} onChange={v => update(p => ({ ...p, regnskap: { ...p.regnskap, har_arsberetning: v } }))} />
        <ToggleRow label="Skal styret behandle revisors rapport?" value={!!doc.answers.revisors_rapport} onChange={v => updateDoc(d => ({ ...d, answers: { ...d.answers, revisors_rapport: v } }))} />
        <ToggleRow label="Skal styret gjennomføre lovpålagt møte med revisor?" value={!!doc.answers.lovpalagt_revisormote} onChange={v => updateDoc(d => ({ ...d, answers: { ...d.answers, lovpalagt_revisormote: v } }))} />
        <ToggleRow label="Innkalling til generalforsamling?" value={doc.answers.innkalling_gf !== false} onChange={v => updateDoc(d => ({ ...d, answers: { ...d.answers, innkalling_gf: v } }))} />
      </div>
    )}

    {doc.type === "gf_alminnelige_regler" && (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border/20">
        <div>
          <Label>Møteleder</Label>
          <Input value={(doc.answers.moteleder as string) || ""} onChange={v => updateDoc(d => ({ ...d, answers: { ...d.answers, moteleder: v } }))} />
        </div>
        <div>
          <Label>Protokollfører</Label>
          <Input value={(doc.answers.protokollforer as string) || ""} onChange={v => updateDoc(d => ({ ...d, answers: { ...d.answers, protokollforer: v } }))} />
        </div>
        <div className="md:col-span-2">
          <ToggleRow label="Ble innkallingsfristen overholdt?" value={!!doc.answers.innkallingsfrist_ok} onChange={v => updateDoc(d => ({ ...d, answers: { ...d.answers, innkallingsfrist_ok: v } }))} />
        </div>
      </div>
    )}
  </>
);

const ToggleRow = ({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) => (
  <div className="flex items-center justify-between gap-4">
    <span className="text-sm">{label}</span>
    <Toggle value={value} onChange={v => onChange(v as boolean)} options={[{ v: true, l: "Ja" }, { v: false, l: "Nei" }]} />
  </div>
);

// ============================================================
// Steg: Regnskap
// ============================================================

const StegRegnskap = ({ profile, update, doc, updateDoc }: {
  profile: CompanyProfile; update: (u: (p: CompanyProfile) => CompanyProfile) => void;
  doc: DocumentState; updateDoc: (u: (d: DocumentState) => DocumentState) => void;
}) => (
  <>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label>Regnskapsår</Label>
        <Input value={profile.regnskap.arstall} onChange={v => update(p => ({ ...p, regnskap: { ...p.regnskap, arstall: v } }))} />
      </div>
      <div>
        <Label>Årets resultat (kr)</Label>
        <NumInput value={profile.regnskap.arets_resultat} onChange={v => update(p => ({ ...p, regnskap: { ...p.regnskap, arets_resultat: v } }))} />
      </div>
      <div>
        <Label>Utbytte (kr)</Label>
        <NumInput value={profile.regnskap.utbytte} onChange={v => update(p => ({ ...p, regnskap: { ...p.regnskap, utbytte: v } }))} />
      </div>
      <div>
        <Label>Overføring til annen egenkapital (kr)</Label>
        <NumInput value={profile.regnskap.overforing_annen_egenkapital} onChange={v => update(p => ({ ...p, regnskap: { ...p.regnskap, overforing_annen_egenkapital: v } }))} />
      </div>
    </div>

    {doc.type === "styremoteprotokoll" && (
      <div className="pt-4 border-t border-border/20 space-y-3">
        <Label>Disponering av resultat</Label>
        <Toggle
          value={(doc.answers.disponering_type as string) || "standard"}
          onChange={v => updateDoc(d => ({ ...d, answers: { ...d.answers, disponering_type: v } }))}
          options={[{ v: "standard", l: "Standardtekst" }, { v: "fritekst", l: "Fritekst" }]}
        />
        {doc.answers.disponering_type === "fritekst" && (
          <Textarea value={(doc.answers.fritekst_disponering as string) || ""} onChange={v => updateDoc(d => ({ ...d, answers: { ...d.answers, fritekst_disponering: v } }))} rows={4} />
        )}
      </div>
    )}
  </>
);

// ============================================================
// Steg: Vedtak (GF)
// ============================================================

const StegVedtak = ({ doc, updateDoc }: { doc: DocumentState; updateDoc: (u: (d: DocumentState) => DocumentState) => void }) => (
  <>
    <div>
      <Label>Vedtak — disponering av årsresultat</Label>
      <Textarea rows={4} value={(doc.answers.disponering_vedtak as string) || ""} onChange={v => updateDoc(d => ({ ...d, answers: { ...d.answers, disponering_vedtak: v } }))} />
    </div>
    <ToggleRow label="Skal det godkjennes godtgjørelse til styret?" value={!!doc.answers.godtgjorelse_styret_bool} onChange={v => updateDoc(d => ({ ...d, answers: { ...d.answers, godtgjorelse_styret_bool: v } }))} />
    {doc.answers.godtgjorelse_styret_bool && (
      <div>
        <Label>Vedtak — godtgjørelse styret</Label>
        <Textarea rows={2} value={(doc.answers.godtgjorelse_styret_vedtak as string) || ""} onChange={v => updateDoc(d => ({ ...d, answers: { ...d.answers, godtgjorelse_styret_vedtak: v } }))} />
      </div>
    )}
    <ToggleRow label="Skal det godkjennes godtgjørelse til revisor?" value={!!doc.answers.godtgjorelse_revisor_bool} onChange={v => updateDoc(d => ({ ...d, answers: { ...d.answers, godtgjorelse_revisor_bool: v } }))} />

    <div>
      <Label>Valg av styret</Label>
      <Toggle
        value={(doc.answers.valg_styret as string) || "nei"}
        onChange={v => updateDoc(d => ({ ...d, answers: { ...d.answers, valg_styret: v } }))}
        options={[{ v: "nei", l: "Nei" }, { v: "gjenvalg", l: "Gjenvalg" }, { v: "nytt", l: "Nytt styre" }]}
      />
    </div>
    {doc.answers.valg_styret === "nytt" && (
      <div>
        <Label>Nye styremedlemmer (fritekst — én per linje)</Label>
        <Textarea rows={3} value={(doc.answers.nye_styremedlemmer as string) || ""} onChange={v => updateDoc(d => ({ ...d, answers: { ...d.answers, nye_styremedlemmer: v } }))} />
      </div>
    )}
  </>
);

// ============================================================
// Steg: Saker (sak-moduler)
// ============================================================

const StegSaker = ({ doc, updateDoc }: { doc: DocumentState; updateDoc: (u: (d: DocumentState) => DocumentState) => void }) => {
  const toggle = (id: SakModulId) => {
    const exists = doc.sub_sections.findIndex(s => s.id === id);
    if (exists >= 0) {
      updateDoc(d => ({ ...d, sub_sections: d.sub_sections.filter((_, i) => i !== exists) }));
    } else {
      updateDoc(d => ({ ...d, sub_sections: [...d.sub_sections, { id, data: {} }] }));
    }
  };
  const onlyThis = (id: SakModulId) => {
    updateDoc(d => ({ ...d, sub_sections: [{ id, data: d.sub_sections.find(s => s.id === id)?.data || {} }] }));
    toast.success(`Nå har dokumentet kun én sak: ${sakModuler.find(m => m.id === id)?.tittel}`);
  };
  const clearAll = () => updateDoc(d => ({ ...d, sub_sections: [] }));
  const setField = (idx: number, key: string, value: string | number | boolean) => {
    updateDoc(d => ({ ...d, sub_sections: d.sub_sections.map((s, i) => i === idx ? { ...s, data: { ...s.data, [key]: value } } : s) }));
  };

  return (
    <>
      <div className="-mt-2 mb-2 rounded-xl border border-primary/20 bg-primary/5 p-3 flex items-start gap-2.5">
        <Sparkles size={14} className="text-primary shrink-0 mt-0.5" />
        <div className="text-xs text-muted-foreground leading-relaxed">
          <span className="text-foreground font-medium">Kun én sak?</span> Trenger du f.eks. <em>bare konsernbidrag</em> eller <em>bare valg av daglig leder</em>? Hak av kun den saken — eller bruk <span className="text-primary">Kun denne</span>-snarveien på hvert kort.
          {doc.sub_sections.length > 0 && (
            <button onClick={clearAll} className="ml-2 text-destructive/80 hover:text-destructive underline underline-offset-2">Fjern alle valg</button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {sakModuler.map(m => {
          const selected = doc.sub_sections.some(s => s.id === m.id);
          return (
            <div
              key={m.id}
              className={`text-left p-3 rounded-xl border transition-all ${
                selected ? "border-primary bg-primary/5" : "border-border/20 hover:border-primary/30"
              }`}
            >
              <button onClick={() => toggle(m.id)} className="w-full text-left">
                <div className="flex items-start gap-2">
                  <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5 ${
                    selected ? "bg-primary text-primary-foreground" : "border border-border/40"
                  }`}>
                    {selected && <Check size={12} />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{m.tittel}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{m.beskrivelse}</p>
                  </div>
                </div>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onlyThis(m.id); }}
                className="mt-2 ml-7 text-[10px] tracking-wide uppercase text-primary/80 hover:text-primary transition-colors"
              >
                Kun denne →
              </button>
            </div>
          );
        })}
      </div>

      {doc.sub_sections.length > 0 && (
        <div className="pt-6 border-t border-border/20 space-y-6">
          {doc.sub_sections.map((s, i) => {
            const def = sakModuler.find(m => m.id === s.id)!;
            return (
              <div key={i}>
                <p className="text-[10px] tracking-[0.3em] uppercase text-primary mb-3">Sak {i + 1} · {def.tittel}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {def.felt.map(f => (
                    <div key={f.key} className={f.type === "textarea" ? "md:col-span-2" : ""}>
                      <Label>{f.label}</Label>
                      {f.type === "text" && <Input value={(s.data[f.key] as string) || ""} onChange={v => setField(i, f.key, v)} />}
                      {f.type === "date" && <Input type="date" value={(s.data[f.key] as string) || ""} onChange={v => setField(i, f.key, v)} />}
                      {f.type === "number" && <NumInput value={(s.data[f.key] as number) || 0} onChange={v => setField(i, f.key, v)} />}
                      {f.type === "textarea" && <Textarea value={(s.data[f.key] as string) || ""} onChange={v => setField(i, f.key, v)} />}
                      {f.type === "bool" && <Toggle value={!!s.data[f.key]} onChange={v => setField(i, f.key, v as boolean)} options={[{ v: true, l: "Ja" }, { v: false, l: "Nei" }]} />}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

// ============================================================
// Live preview-panel med endringsindikator
// ============================================================

const LivePreviewPanel = ({ profile, doc, changeTick, lastChangeLabel, changedSaker, profilePulseTick }: {
  profile: CompanyProfile;
  doc: DocumentState;
  changeTick: number;
  lastChangeLabel: string;
  changedSaker: Set<string>;
  profilePulseTick: number;
}) => {
  const [showBadge, setShowBadge] = useState(false);
  useEffect(() => {
    if (changeTick === 0) return;
    setShowBadge(true);
    const t = setTimeout(() => setShowBadge(false), 1800);
    return () => clearTimeout(t);
  }, [changeTick]);

  return (
    <div className="hidden lg:flex flex-col h-[80vh] rounded-2xl overflow-hidden border border-border/20 bg-white">
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-neutral-950 text-white/90 border-b border-white/10">
        <div className="flex items-center gap-2 min-w-0">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className={`absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 ${showBadge ? "animate-ping" : ""}`} />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          <p className="text-[10px] tracking-[0.3em] uppercase">Live PDF</p>
          <AnimatePresence>
            {showBadge && lastChangeLabel && (
              <motion.span
                key={changeTick}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="text-[10px] px-2 py-0.5 rounded-full bg-primary text-primary-foreground truncate max-w-[220px]"
              >
                Oppdatert: {lastChangeLabel}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <motion.span
          key={profilePulseTick}
          initial={{ scale: 1 }}
          animate={{ scale: profilePulseTick > 0 ? [1, 1.08, 1] : 1 }}
          transition={{ duration: 0.5 }}
          className="text-[10px] text-white/50 truncate"
        >
          {profile.selskap.navn || "Selskapsprofil ikke satt"}
        </motion.span>
      </div>

      {doc.sub_sections.length > 0 && (
        <div className="flex flex-wrap gap-1.5 px-3 py-2 bg-neutral-100 border-b border-border/20">
          {doc.sub_sections.map((s, idx) => {
            const def = sakModuler.find(m => m.id === s.id);
            const pulsing = changedSaker.has(s.id);
            return (
              <span
                key={`${s.id}-${idx}`}
                className={`text-[10px] px-2 py-1 rounded-full border transition-all ${
                  pulsing
                    ? "bg-primary text-primary-foreground border-primary ring-2 ring-primary/40 animate-pulse"
                    : "bg-white border-border/40 text-neutral-700"
                }`}
              >
                {idx + 1}. {def?.tittel}
              </span>
            );
          })}
        </div>
      )}

      <div className="flex-1 min-h-0">
        <PDFViewer width="100%" height="100%" showToolbar={false}>
          <ProtokollDocument profile={profile} doc={doc} />
        </PDFViewer>
      </div>
    </div>
  );
};

// ============================================================
// Steg: Signatur
// ============================================================

const StegSignatur = ({ doc, updateDoc, profile, update }: {
  doc: DocumentState; updateDoc: (u: (d: DocumentState) => DocumentState) => void;
  profile: CompanyProfile; update: (u: (p: CompanyProfile) => CompanyProfile) => void;
}) => (
  <>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label>Sted for signatur</Label>
        <Input value={(doc.answers.signatur_sted as string) || ""} onChange={v => updateDoc(d => ({ ...d, answers: { ...d.answers, signatur_sted: v } }))} />
      </div>
      <div>
        <Label>Dato for signatur</Label>
        <Input type="date" value={(doc.answers.signatur_dato as string) || profile.moteinfo.dato} onChange={v => updateDoc(d => ({ ...d, answers: { ...d.answers, signatur_dato: v } }))} />
      </div>
    </div>

    <div>
      <Label>Signaturmetode</Label>
      <Toggle
        value={(doc.answers.signatur_metode as string) || "papir"}
        onChange={v => updateDoc(d => ({ ...d, answers: { ...d.answers, signatur_metode: v } }))}
        options={[{ v: "papir", l: "Papirsignatur" }, { v: "elektronisk", l: "Elektronisk" }]}
      />
    </div>

    {doc.type === "gf_forenklet" && (
      <div>
        <Label>Signatar (den som signerer protokollen)</Label>
        <Input value={(doc.answers.signatar as string) || ""} onChange={v => updateDoc(d => ({ ...d, answers: { ...d.answers, signatar: v } }))} />
      </div>
    )}

    {doc.type === "gf_alminnelige_regler" && (
      <div>
        <Label>Medunderskriver</Label>
        <Input value={(doc.answers.medunderskriver as string) || ""} onChange={v => updateDoc(d => ({ ...d, answers: { ...d.answers, medunderskriver: v } }))} />
      </div>
    )}

    {doc.type === "innkalling_gf" && (
      <div>
        <Label>Frist for påmelding/fullmakt</Label>
        <Input type="date" value={(doc.answers.paameldingsfrist as string) || ""} onChange={v => updateDoc(d => ({ ...d, answers: { ...d.answers, paameldingsfrist: v } }))} />
      </div>
    )}

    {doc.type === "styremoteprotokoll" && (
      <div>
        <Label>Resultat fra avstemminger (fritekst)</Label>
        <Textarea value={(doc.answers.avstemmingsresultat as string) || ""} onChange={v => updateDoc(d => ({ ...d, answers: { ...d.answers, avstemmingsresultat: v } }))} />
      </div>
    )}
  </>
);

// ============================================================
// Ferdigstilling
// ============================================================

const Ferdigstilling = ({ docs, profile, tilbake, reset }: {
  docs: DocumentState[]; profile: CompanyProfile; tilbake: () => void; reset: () => void;
}) => (
  <div className="max-w-3xl mx-auto">
    <div className="text-center mb-10">
      <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
        <ClipboardCheck size={26} className="text-primary" />
      </div>
      <h2 className="font-heading text-3xl md:text-4xl mb-3">Pakken er klar</h2>
      <p className="text-sm text-muted-foreground">Last ned dokumentene som PDF — signer på papir eller elektronisk.</p>
    </div>

    <div className="space-y-3 mb-10">
      {docs.map((d, i) => {
        const dt = documentTypes.find(t => t.id === d.type);
        const filename = `${(dt?.navn || "dokument").toLowerCase().replace(/\s+/g, "-")}-${profile.selskap.orgnummer || "utkast"}.pdf`;
        return (
          <div key={i} className="glass rounded-2xl border border-border/20 p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <FileText size={18} className="text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{dt?.navn}</p>
                <p className="text-xs text-muted-foreground truncate">{profile.selskap.navn || "Utkast"}</p>
              </div>
            </div>
            <DownloadButton doc={d} profile={profile} filename={filename} />
          </div>
        );
      })}
    </div>


    <div className="flex items-center justify-between">
      <button onClick={tilbake} className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2">
        <ArrowLeft size={14} /> Tilbake til utfylling
      </button>
      <button onClick={reset} className="text-sm text-destructive/80 hover:text-destructive transition-colors">
        Start ny pakke
      </button>
    </div>
  </div>
);

export default Protokollgenerator;
