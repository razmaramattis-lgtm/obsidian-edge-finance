import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Key, Check, Building2, Plus, Trash2, Save, Upload, User, Users, Globe, Calendar, Search, Loader2
} from "lucide-react";

const inputCls = "w-full h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40";
const labelCls = "text-xs text-muted-foreground mb-1 block";

const CustomerSettingsPanel = () => {
  const { profile } = useAuth();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [pwSuccess, setPwSuccess] = useState("");
  const [pwError, setPwError] = useState("");

  // Company
  const [company, setCompany] = useState<any>(null);
  const [companyForm, setCompanyForm] = useState<any>({});
  const [savingCompany, setSavingCompany] = useState(false);
  const [loadingCompany, setLoadingCompany] = useState(true);
  const logoRef = useRef<HTMLInputElement>(null);

  // Owners
  const [owners, setOwners] = useState<any[]>([]);
  const [ownerForm, setOwnerForm] = useState({ name: "", email: "", phone: "", ownership_percent: "", role: "Eier" });
  const [showOwnerForm, setShowOwnerForm] = useState(false);

  // Board
  const [board, setBoard] = useState<any[]>([]);
  const [boardForm, setBoardForm] = useState({ name: "", email: "", phone: "", position: "Styremedlem" });
  const [showBoardForm, setShowBoardForm] = useState(false);

  // Contacts
  const [contacts, setContacts] = useState<any[]>([]);
  const [contactForm, setContactForm] = useState({ name: "", email: "", phone: "", role: "Kontaktperson", is_primary: false });
  const [showContactForm, setShowContactForm] = useState(false);

  // Brreg search
  const [brregQuery, setBrregQuery] = useState("");
  const [brregResults, setBrregResults] = useState<any[]>([]);
  const [brregLoading, setBrregLoading] = useState(false);
  const [showBrregDropdown, setShowBrregDropdown] = useState(false);
  const brregRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (brregRef.current && !brregRef.current.contains(e.target as Node)) setShowBrregDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

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
        setShowBrregDropdown(true);
      } catch { setBrregResults([]); }
      setBrregLoading(false);
    }, 400);
    return () => clearTimeout(timeout);
  }, [brregQuery]);

  const mapCompanyType = (code: string | undefined) => {
    const map: Record<string, string> = { AS: "AS", ENK: "ENK", ANS: "ANS", DA: "DA", NUF: "NUF" };
    return map[code || ""] || "Annet";
  };

  const selectBrregCompany = async (enhet: any) => {
    setShowBrregDropdown(false);
    setBrregQuery("");

    // Fetch roller for revisor
    let revisor = "";
    try {
      const rolleRes = await fetch(`https://data.brreg.no/enhetsregisteret/api/enheter/${enhet.organisasjonsnummer}/roller`);
      if (rolleRes.ok) {
        const rolleData = await rolleRes.json();
        const revisorGruppe = (rolleData?.rollegrupper || []).find((g: any) => g?.type?.kode === "REVI");
        if (revisorGruppe?.roller?.[0]?.person?.navn) {
          const n = revisorGruppe.roller[0].person.navn;
          revisor = [n.fornavn, n.mellomnavn, n.etternavn].filter(Boolean).join(" ");
        }
      }
    } catch {}

    const addr = enhet.forretningsadresse || enhet.postadresse || {};
    setCompanyForm((f: any) => ({
      ...f,
      company_name: enhet.navn || f.company_name,
      org_number: enhet.organisasjonsnummer || f.org_number,
      company_type: mapCompanyType(enhet.organisasjonsform?.kode),
      industry: enhet.naeringskode1?.beskrivelse || f.industry,
      address: addr.adresse?.[0] || f.address,
      postal_code: addr.postnummer || f.postal_code,
      city: addr.poststed || f.city,
      country: addr.land || "Norge",
      website: enhet.hjemmeside || f.website,
      contact_phone: enhet.telefon || f.contact_phone,
      founding_date: enhet.stiftelsesdato || f.founding_date,
      auditor: revisor || f.auditor,
    }));
    toast.success("Bedriftsinformasjon hentet fra Brønnøysundregistrene");
  };

  const load = useCallback(async () => {
    const { data: comp } = await supabase.from("customer_companies").select("*").limit(1).maybeSingle();
    if (comp) {
      setCompany(comp);
      setCompanyForm({
        company_name: comp.company_name || "",
        org_number: comp.org_number || "",
        industry: comp.industry || "",
        contact_phone: comp.contact_phone || "",
        address: (comp as any).address || "",
        postal_code: (comp as any).postal_code || "",
        city: (comp as any).city || "",
        country: (comp as any).country || "Norge",
        website: (comp as any).website || "",
        company_type: (comp as any).company_type || "AS",
        share_capital: (comp as any).share_capital || "",
        founding_date: (comp as any).founding_date || "",
        fiscal_year_end: (comp as any).fiscal_year_end || "31.12",
        auditor: (comp as any).auditor || "",
        description: (comp as any).description || "",
        logo_url: (comp as any).logo_url || "",
      });

      const [ownRes, boardRes, contactRes] = await Promise.all([
        supabase.from("company_owners").select("*").eq("company_id", comp.id).order("created_at"),
        supabase.from("company_board_members").select("*").eq("company_id", comp.id).order("created_at"),
        supabase.from("company_contacts").select("*").eq("company_id", comp.id).order("created_at"),
      ]);
      setOwners(ownRes.data || []);
      setBoard(boardRes.data || []);
      setContacts(contactRes.data || []);
    }
    setLoadingCompany(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const saveCompany = async () => {
    if (!company) return;
    setSavingCompany(true);
    const { error } = await supabase.from("customer_companies").update({
      company_name: companyForm.company_name,
      org_number: companyForm.org_number || null,
      industry: companyForm.industry || null,
      contact_phone: companyForm.contact_phone || null,
      address: companyForm.address || null,
      postal_code: companyForm.postal_code || null,
      city: companyForm.city || null,
      country: companyForm.country || null,
      website: companyForm.website || null,
      company_type: companyForm.company_type || null,
      share_capital: companyForm.share_capital ? Number(companyForm.share_capital) : null,
      founding_date: companyForm.founding_date || null,
      fiscal_year_end: companyForm.fiscal_year_end || null,
      auditor: companyForm.auditor || null,
      description: companyForm.description || null,
    } as any).eq("id", company.id);
    if (error) toast.error("Kunne ikke lagre"); else toast.success("Bedriftsinformasjon lagret");
    setSavingCompany(false);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !company) return;
    if (!file.type.startsWith("image/")) { toast.error("Kun bilder tillatt"); return; }
    if (file.size > 2 * 1024 * 1024) { toast.error("Maks 2MB"); return; }
    const path = `logos/${company.id}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("archive-files").upload(path, file);
    if (error) { toast.error("Opplasting feilet"); return; }
    const { data: url } = supabase.storage.from("archive-files").getPublicUrl(path);
    await supabase.from("customer_companies").update({ logo_url: url.publicUrl } as any).eq("id", company.id);
    setCompanyForm((f: any) => ({ ...f, logo_url: url.publicUrl }));
    toast.success("Logo oppdatert");
  };

  const addOwner = async () => {
    if (!company || !ownerForm.name.trim()) return;
    await supabase.from("company_owners").insert({
      company_id: company.id,
      name: ownerForm.name.trim(),
      email: ownerForm.email || null,
      phone: ownerForm.phone || null,
      ownership_percent: Number(ownerForm.ownership_percent) || 0,
      role: ownerForm.role || "Eier",
    });
    setOwnerForm({ name: "", email: "", phone: "", ownership_percent: "", role: "Eier" });
    setShowOwnerForm(false);
    load();
    toast.success("Eier lagt til");
  };

  const deleteOwner = async (id: string) => {
    if (!confirm("Fjerne denne eieren?")) return;
    await supabase.from("company_owners").delete().eq("id", id);
    load();
  };

  const addBoard = async () => {
    if (!company || !boardForm.name.trim()) return;
    await supabase.from("company_board_members").insert({
      company_id: company.id,
      name: boardForm.name.trim(),
      email: boardForm.email || null,
      phone: boardForm.phone || null,
      position: boardForm.position || "Styremedlem",
    });
    setBoardForm({ name: "", email: "", phone: "", position: "Styremedlem" });
    setShowBoardForm(false);
    load();
    toast.success("Styremedlem lagt til");
  };

  const deleteBoard = async (id: string) => {
    if (!confirm("Fjerne dette styremedlemmet?")) return;
    await supabase.from("company_board_members").delete().eq("id", id);
    load();
  };

  const addContact = async () => {
    if (!company || !contactForm.name.trim()) return;
    await supabase.from("company_contacts").insert({
      company_id: company.id,
      name: contactForm.name.trim(),
      email: contactForm.email || null,
      phone: contactForm.phone || null,
      role: contactForm.role || "Kontaktperson",
      is_primary: contactForm.is_primary,
    });
    setContactForm({ name: "", email: "", phone: "", role: "Kontaktperson", is_primary: false });
    setShowContactForm(false);
    load();
    toast.success("Kontaktperson lagt til");
  };

  const deleteContact = async (id: string) => {
    if (!confirm("Fjerne denne kontaktpersonen?")) return;
    await supabase.from("company_contacts").delete().eq("id", id);
    load();
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) { setPwError("Passordene stemmer ikke overens."); return; }
    if (newPassword.length < 6) { setPwError("Passord må være minst 6 tegn."); return; }
    setPwLoading(true); setPwError(""); setPwSuccess("");
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) setPwError("Kunne ikke oppdatere passordet.");
    else { setPwSuccess("Passordet er oppdatert!"); setNewPassword(""); setConfirmPassword(""); }
    setPwLoading(false);
  };

  if (loadingCompany) return <div className="text-muted-foreground text-sm">Laster…</div>;

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Profile */}
      <div className="glass rounded-2xl p-5 border border-border/20">
        <div className="flex items-center gap-3">
          {companyForm.logo_url ? (
            <img src={companyForm.logo_url} alt="Logo" className="w-12 h-12 rounded-xl object-contain border border-border/20" />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-medium text-lg">
              {profile?.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex-1">
            <p className="font-medium">{profile?.name}</p>
            <p className="text-xs text-muted-foreground">{profile?.email}</p>
          </div>
          <div>
            <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
            <button onClick={() => logoRef.current?.click()} className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-border/30 rounded-xl hover:bg-muted/50 transition-colors">
              <Upload size={13} /> Logo
            </button>
          </div>
        </div>
      </div>

      {/* Company info */}
      {company && (
        <div className="glass rounded-2xl p-5 border border-border/20 space-y-4">
          <div className="flex items-center gap-2">
            <Building2 size={16} className="text-primary" strokeWidth={1.5} />
            <h3 className="font-medium">Bedriftsinformasjon</h3>
          </div>

          {/* Brreg search */}
          <div ref={brregRef} className="relative">
            <label className={labelCls}>Hent fra Brønnøysundregistrene</label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={brregQuery}
                onChange={e => setBrregQuery(e.target.value)}
                placeholder="Søk på firmanavn eller org.nr…"
                className={`${inputCls} pl-9`}
              />
              {brregLoading && <Loader2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground animate-spin" />}
            </div>
            {showBrregDropdown && brregResults.length > 0 && (
              <div className="absolute z-50 mt-1 w-full bg-background border border-border/30 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                {brregResults.map((e: any) => (
                  <button
                    key={e.organisasjonsnummer}
                    onClick={() => selectBrregCompany(e)}
                    className="w-full text-left px-3 py-2 hover:bg-muted/50 transition-colors border-b border-border/10 last:border-0"
                  >
                    <p className="text-sm font-medium">{e.navn}</p>
                    <p className="text-xs text-muted-foreground">Org.nr: {e.organisasjonsnummer} · {e.organisasjonsform?.beskrivelse}</p>
                  </button>
                ))}
              </div>
            )}
            {showBrregDropdown && brregResults.length === 0 && !brregLoading && brregQuery.length >= 2 && (
              <div className="absolute z-50 mt-1 w-full bg-background border border-border/30 rounded-xl shadow-lg p-3 text-xs text-muted-foreground">
                Ingen treff
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div><label className={labelCls}>Bedriftsnavn</label><input value={companyForm.company_name} onChange={e => setCompanyForm((f: any) => ({ ...f, company_name: e.target.value }))} className={inputCls} /></div>
            <div><label className={labelCls}>Org.nr</label><input value={companyForm.org_number} onChange={e => setCompanyForm((f: any) => ({ ...f, org_number: e.target.value }))} className={inputCls} /></div>
            <div><label className={labelCls}>Selskapsform</label>
              <select value={companyForm.company_type} onChange={e => setCompanyForm((f: any) => ({ ...f, company_type: e.target.value }))} className={inputCls}>
                <option value="AS">AS</option><option value="ENK">ENK</option><option value="ANS">ANS</option><option value="DA">DA</option><option value="NUF">NUF</option><option value="Annet">Annet</option>
              </select>
            </div>
            <div><label className={labelCls}>Bransje</label><input value={companyForm.industry} onChange={e => setCompanyForm((f: any) => ({ ...f, industry: e.target.value }))} className={inputCls} /></div>
            <div><label className={labelCls}>Adresse</label><input value={companyForm.address} onChange={e => setCompanyForm((f: any) => ({ ...f, address: e.target.value }))} className={inputCls} /></div>
            <div className="grid grid-cols-2 gap-2">
              <div><label className={labelCls}>Postnr.</label><input value={companyForm.postal_code} onChange={e => setCompanyForm((f: any) => ({ ...f, postal_code: e.target.value }))} className={inputCls} /></div>
              <div><label className={labelCls}>Sted</label><input value={companyForm.city} onChange={e => setCompanyForm((f: any) => ({ ...f, city: e.target.value }))} className={inputCls} /></div>
            </div>
            <div><label className={labelCls}>Nettside</label><input value={companyForm.website} onChange={e => setCompanyForm((f: any) => ({ ...f, website: e.target.value }))} placeholder="https://" className={inputCls} /></div>
            <div><label className={labelCls}>Telefon</label><input value={companyForm.contact_phone} onChange={e => setCompanyForm((f: any) => ({ ...f, contact_phone: e.target.value }))} className={inputCls} /></div>
            <div><label className={labelCls}>Aksjekapital</label><input type="number" value={companyForm.share_capital} onChange={e => setCompanyForm((f: any) => ({ ...f, share_capital: e.target.value }))} className={inputCls} /></div>
            <div><label className={labelCls}>Stiftelsesdato</label><input type="date" value={companyForm.founding_date} onChange={e => setCompanyForm((f: any) => ({ ...f, founding_date: e.target.value }))} className={inputCls} /></div>
            <div><label className={labelCls}>Regnskapsår slutt</label><input value={companyForm.fiscal_year_end} onChange={e => setCompanyForm((f: any) => ({ ...f, fiscal_year_end: e.target.value }))} placeholder="31.12" className={inputCls} /></div>
            <div><label className={labelCls}>Revisor</label><input value={companyForm.auditor} onChange={e => setCompanyForm((f: any) => ({ ...f, auditor: e.target.value }))} className={inputCls} /></div>
          </div>
          <div><label className={labelCls}>Beskrivelse</label>
            <textarea value={companyForm.description} onChange={e => setCompanyForm((f: any) => ({ ...f, description: e.target.value }))} rows={3} className="w-full rounded-xl border border-border/30 bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none" />
          </div>
          <button onClick={saveCompany} disabled={savingCompany} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm hover:opacity-90 disabled:opacity-50">
            <Save size={14} /> {savingCompany ? "Lagrer…" : "Lagre bedriftsinformasjon"}
          </button>
        </div>
      )}

      {/* Owners */}
      {company && (
        <div className="glass rounded-2xl p-5 border border-border/20 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><User size={16} className="text-primary" strokeWidth={1.5} /><h3 className="font-medium">Eiere</h3></div>
            <button onClick={() => setShowOwnerForm(true)} className="flex items-center gap-1 px-3 py-1.5 text-xs border border-border/30 rounded-xl hover:bg-muted/50"><Plus size={13} /> Legg til</button>
          </div>
          {showOwnerForm && (
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 p-3 rounded-xl bg-muted/20 border border-border/10">
              <input value={ownerForm.name} onChange={e => setOwnerForm(f => ({ ...f, name: e.target.value }))} placeholder="Navn *" className={inputCls} />
              <input value={ownerForm.email} onChange={e => setOwnerForm(f => ({ ...f, email: e.target.value }))} placeholder="E-post" className={inputCls} />
              <input value={ownerForm.phone} onChange={e => setOwnerForm(f => ({ ...f, phone: e.target.value }))} placeholder="Telefon" className={inputCls} />
              <input type="number" value={ownerForm.ownership_percent} onChange={e => setOwnerForm(f => ({ ...f, ownership_percent: e.target.value }))} placeholder="Eierandel %" className={inputCls} />
              <div className="flex gap-1">
                <button onClick={addOwner} className="px-3 py-2 bg-primary text-primary-foreground rounded-xl text-xs hover:opacity-90">Legg til</button>
                <button onClick={() => setShowOwnerForm(false)} className="px-3 py-2 rounded-xl text-xs border border-border/30 hover:bg-muted/50">Avbryt</button>
              </div>
            </div>
          )}
          {owners.length === 0 && !showOwnerForm && <p className="text-xs text-muted-foreground">Ingen eiere registrert.</p>}
          {owners.map(o => (
            <div key={o.id} className="flex items-center justify-between py-2 border-b border-border/10 last:border-0">
              <div>
                <p className="text-sm font-medium">{o.name} <span className="text-xs text-muted-foreground">({o.ownership_percent}%)</span></p>
                {o.email && <p className="text-xs text-muted-foreground">{o.email}</p>}
              </div>
              <button onClick={() => deleteOwner(o.id)} className="p-1.5 text-muted-foreground hover:text-destructive"><Trash2 size={13} /></button>
            </div>
          ))}
        </div>
      )}

      {/* Board */}
      {company && (
        <div className="glass rounded-2xl p-5 border border-border/20 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><Users size={16} className="text-primary" strokeWidth={1.5} /><h3 className="font-medium">Styremedlemmer</h3></div>
            <button onClick={() => setShowBoardForm(true)} className="flex items-center gap-1 px-3 py-1.5 text-xs border border-border/30 rounded-xl hover:bg-muted/50"><Plus size={13} /> Legg til</button>
          </div>
          {showBoardForm && (
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 p-3 rounded-xl bg-muted/20 border border-border/10">
              <input value={boardForm.name} onChange={e => setBoardForm(f => ({ ...f, name: e.target.value }))} placeholder="Navn *" className={inputCls} />
              <input value={boardForm.email} onChange={e => setBoardForm(f => ({ ...f, email: e.target.value }))} placeholder="E-post" className={inputCls} />
              <input value={boardForm.phone} onChange={e => setBoardForm(f => ({ ...f, phone: e.target.value }))} placeholder="Telefon" className={inputCls} />
              <select value={boardForm.position} onChange={e => setBoardForm(f => ({ ...f, position: e.target.value }))} className={inputCls}>
                <option>Styreleder</option><option>Nestleder</option><option>Styremedlem</option><option>Varamedlem</option>
              </select>
              <div className="flex gap-1">
                <button onClick={addBoard} className="px-3 py-2 bg-primary text-primary-foreground rounded-xl text-xs hover:opacity-90">Legg til</button>
                <button onClick={() => setShowBoardForm(false)} className="px-3 py-2 rounded-xl text-xs border border-border/30 hover:bg-muted/50">Avbryt</button>
              </div>
            </div>
          )}
          {board.length === 0 && !showBoardForm && <p className="text-xs text-muted-foreground">Ingen styremedlemmer registrert.</p>}
          {board.map(b => (
            <div key={b.id} className="flex items-center justify-between py-2 border-b border-border/10 last:border-0">
              <div>
                <p className="text-sm font-medium">{b.name} <span className="text-xs text-primary">({b.position})</span></p>
                {b.email && <p className="text-xs text-muted-foreground">{b.email}</p>}
              </div>
              <button onClick={() => deleteBoard(b.id)} className="p-1.5 text-muted-foreground hover:text-destructive"><Trash2 size={13} /></button>
            </div>
          ))}
        </div>
      )}

      {/* Contacts */}
      {company && (
        <div className="glass rounded-2xl p-5 border border-border/20 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><User size={16} className="text-primary" strokeWidth={1.5} /><h3 className="font-medium">Kontaktpersoner</h3></div>
            <button onClick={() => setShowContactForm(true)} className="flex items-center gap-1 px-3 py-1.5 text-xs border border-border/30 rounded-xl hover:bg-muted/50"><Plus size={13} /> Legg til</button>
          </div>
          {showContactForm && (
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 p-3 rounded-xl bg-muted/20 border border-border/10">
              <input value={contactForm.name} onChange={e => setContactForm(f => ({ ...f, name: e.target.value }))} placeholder="Navn *" className={inputCls} />
              <input value={contactForm.email} onChange={e => setContactForm(f => ({ ...f, email: e.target.value }))} placeholder="E-post" className={inputCls} />
              <input value={contactForm.phone} onChange={e => setContactForm(f => ({ ...f, phone: e.target.value }))} placeholder="Telefon" className={inputCls} />
              <input value={contactForm.role} onChange={e => setContactForm(f => ({ ...f, role: e.target.value }))} placeholder="Rolle" className={inputCls} />
              <div className="flex gap-1">
                <button onClick={addContact} className="px-3 py-2 bg-primary text-primary-foreground rounded-xl text-xs hover:opacity-90">Legg til</button>
                <button onClick={() => setShowContactForm(false)} className="px-3 py-2 rounded-xl text-xs border border-border/30 hover:bg-muted/50">Avbryt</button>
              </div>
            </div>
          )}
          {contacts.length === 0 && !showContactForm && <p className="text-xs text-muted-foreground">Ingen kontaktpersoner registrert.</p>}
          {contacts.map(c => (
            <div key={c.id} className="flex items-center justify-between py-2 border-b border-border/10 last:border-0">
              <div>
                <p className="text-sm font-medium">{c.name} <span className="text-xs text-muted-foreground">({c.role})</span></p>
                {c.email && <p className="text-xs text-muted-foreground">{c.email}{c.phone ? ` · ${c.phone}` : ""}</p>}
              </div>
              <button onClick={() => deleteContact(c.id)} className="p-1.5 text-muted-foreground hover:text-destructive"><Trash2 size={13} /></button>
            </div>
          ))}
        </div>
      )}

      {/* Password */}
      <div className="glass rounded-2xl p-5 border border-border/20">
        <div className="flex items-center gap-2 mb-5">
          <Key size={16} className="text-primary" strokeWidth={1.5} />
          <h3 className="font-medium">Endre passord</h3>
        </div>
        <form onSubmit={changePassword} className="space-y-3 max-w-md">
          <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Nytt passord" required className={inputCls} />
          <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Bekreft nytt passord" required className={inputCls} />
          {pwError && <p className="text-destructive text-xs">{pwError}</p>}
          {pwSuccess && <div className="flex items-center gap-2 text-xs text-primary"><Check size={13} /> {pwSuccess}</div>}
          <button type="submit" disabled={pwLoading} className="w-full max-w-md h-10 rounded-xl bg-primary text-primary-foreground text-sm hover:opacity-90 disabled:opacity-50 transition-all">
            {pwLoading ? "Oppdaterer…" : "Oppdater passord"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomerSettingsPanel;
