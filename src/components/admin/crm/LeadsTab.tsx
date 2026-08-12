import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  Search, RefreshCw, Download, Mail, Building2, Phone, Globe, MapPin, Users, Calendar,
  CheckCircle2, Send, Loader2, Trash2, ExternalLink, Radar, Lock,
} from "lucide-react";
import { toast } from "sonner";
import { CATEGORIES, STATUSES, categoryMeta, type CrmLead, type CrmTemplate } from "./types";

const PAGE_SIZE = 50;

const KOMMUNE_PRESETS = [
  { label: "Kongsvinger", nr: "3401" },
  { label: "Nord-Odal", nr: "3414" },
  { label: "Sør-Odal", nr: "3415" },
  { label: "Nes (Årnes)", nr: "3228" },
  { label: "Ullensaker (Jessheim)", nr: "3209" },
  { label: "Skien", nr: "4003" },
  { label: "Hamar", nr: "3403" },
  { label: "Elverum", nr: "3420" },
  { label: "Lillehammer", nr: "3405" },
  { label: "Gjøvik", nr: "3407" },
];

const LeadsTab = ({ fullscreen = false }: { fullscreen?: boolean }) => {
  const [leads, setLeads] = useState<CrmLead[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("alle");
  const [status, setStatus] = useState("alle");
  const [municipality, setMunicipality] = useState("alle");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [contactFilter, setContactFilter] = useState("alle"); // alle | med_epost | uten_epost | kontaktet | ikke_kontaktet
  const [municipalities, setMunicipalities] = useState<string[]>([]);

  const [selected, setSelected] = useState<string[]>([]);
  const [detail, setDetail] = useState<CrmLead | null>(null);

  const [syncOpen, setSyncOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [enriching, setEnriching] = useState(false);
  const [syncFrom, setSyncFrom] = useState(() => new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10));
  const [syncTo, setSyncTo] = useState(() => new Date().toISOString().slice(0, 10));
  const [syncKommuner, setSyncKommuner] = useState<string[]>([]);
  const [syncOrgForms, setSyncOrgForms] = useState<string[]>(["AS", "ENK"]);

  const [importState, setImportState] = useState<any>(null);
  const [bulkBusy, setBulkBusy] = useState(false);

  const [templates, setTemplates] = useState<CrmTemplate[]>([]);
  const [mailOpen, setMailOpen] = useState(false);
  const [mailTemplate, setMailTemplate] = useState("");
  const [testEmail, setTestEmail] = useState("");
  const [sending, setSending] = useState(false);

  const fetchImportState = async () => {
    const { data } = await supabase.from("crm_import_state" as any).select("*").eq("id", 1).maybeSingle();
    setImportState(data);
  };

  const bulkImport = async (action: "start" | "stop") => {
    setBulkBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke("crm-brreg-bulk-import", { body: { action } });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      toast.success(action === "start"
        ? `Full import startet – ${(data as any)?.imported ?? 0} nye selskaper hittil. Fortsetter automatisk hvert 5. minutt.`
        : "Full import satt på pause");
      fetchImportState();
      fetchLeads();
    } catch (e: any) {
      toast.error(e.message || "Kunne ikke starte full import");
    } finally {
      setBulkBusy(false);
    }
  };


  const fetchMunicipalities = async () => {
    const { data } = await supabase.from("crm_leads").select("municipality").not("municipality", "is", null).limit(2000);
    const set = new Set((data || []).map((r: any) => r.municipality).filter(Boolean));
    setMunicipalities(Array.from(set).sort());
  };

  const fetchTemplates = async () => {
    const { data } = await supabase.from("crm_email_templates").select("*").eq("active", true).order("name");
    setTemplates((data as CrmTemplate[]) || []);
  };

  const fetchLeads = async () => {
    setLoading(true);
    let q = supabase.from("crm_leads").select("*", { count: "exact" });
    if (search.trim()) q = q.or(`name.ilike.%${search.trim()}%,orgnr.ilike.%${search.trim()}%`);
    if (category !== "alle") q = q.eq("category", category);
    if (status !== "alle") q = q.eq("status", status);
    if (municipality !== "alle") q = q.eq("municipality", municipality);
    if (fromDate) q = q.gte("registered_at", fromDate);
    if (toDate) q = q.lte("registered_at", toDate);
    if (contactFilter === "med_epost") q = q.not("email", "is", null);
    if (contactFilter === "uten_epost") q = q.is("email", null);
    if (contactFilter === "kontaktet") q = q.gt("email_count", 0);
    if (contactFilter === "ikke_kontaktet") q = q.eq("email_count", 0);
    const { data, count } = await q
      .order("registered_at", { ascending: false, nullsFirst: false })
      .range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1);
    setLeads(((data as unknown) as CrmLead[]) || []);
    setTotal(count || 0);
    setLoading(false);
  };

  useEffect(() => { fetchMunicipalities(); fetchTemplates(); }, []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchLeads(); }, [page]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { setPage(0); const t = setTimeout(fetchLeads, 250); return () => clearTimeout(t); },
    [search, category, status, municipality, fromDate, toDate, contactFilter]);

  const allSelected = leads.length > 0 && selected.length === leads.length;
  const toggleAll = () => setSelected(allSelected ? [] : leads.map((l) => l.id));
  const toggle = (id: string) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const runSync = async (backfill = false) => {
    setSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke("crm-brreg-sync", {
        body: backfill
          ? { mode: "backfill", windowDays: 90, maxPages: 30, municipalities: syncKommuner, orgForms: syncOrgForms }
          : { mode: "manual", from: syncFrom, to: syncTo, municipalities: syncKommuner, orgForms: syncOrgForms },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast.success(`Hentet ${data.fetched} selskaper – ${data.inserted} nye, ${data.updated} oppdatert${backfill ? ` (${data.from} – ${data.to})` : ""}`);
      setSyncOpen(false);
      fetchLeads();
      fetchMunicipalities();
    } catch (e: any) {
      toast.error(e.message || "Kunne ikke hente fra Brønnøysund");
    } finally {
      setSyncing(false);
    }
  };


  const runEnrich = async () => {
    setEnriching(true);
    toast.info("Søker på nettet etter kontaktinfo …");
    try {
      const { data, error } = await supabase.functions.invoke("crm-enrich-contacts", {
        body: selected.length ? { leadIds: selected } : { limit: 25 },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast.success(`Sjekket ${data.processed} selskaper – fant ${data.found} e-postadresser`);
      fetchLeads();
    } catch (e: any) {
      toast.error(e.message || "Nettsøk feilet");
    } finally {
      setEnriching(false);
    }
  };

  const updateLead = async (id: string, patch: Partial<CrmLead>) => {
    const { error } = await supabase.from("crm_leads").update(patch as any).eq("id", id);
    if (error) return toast.error(error.message);
    setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, ...patch } as CrmLead : l)));
    setDetail((d) => (d && d.id === id ? { ...d, ...patch } as CrmLead : d));
  };

  const bulkUpdate = async (patch: Partial<CrmLead>) => {
    if (!selected.length) return;
    const { error } = await supabase.from("crm_leads").update(patch as any).in("id", selected);
    if (error) return toast.error(error.message);
    toast.success(`${selected.length} oppdatert`);
    setSelected([]);
    fetchLeads();
  };

  const removeSelected = async () => {
    if (!selected.length) return;
    const { error } = await supabase.from("crm_leads").delete().in("id", selected);
    if (error) return toast.error(error.message);
    toast.success(`${selected.length} slettet`);
    setSelected([]);
    fetchLeads();
  };

  const exportCsv = () => {
    const rows = leads.map((l) => [
      l.orgnr, l.name, l.org_form || "", l.industry_text || "", l.municipality || "",
      l.registered_at || "", l.employees ?? "", l.email || "", l.phone || "", l.contact_name || "",
      l.accountant_name || "", categoryMeta(l.category).label, l.status,
    ]);
    const header = ["Orgnr", "Navn", "Form", "Bransje", "Kommune", "Registrert", "Ansatte", "E-post", "Telefon", "Kontakt", "Regnskapsfører", "Kategori", "Status"];
    const csv = [header, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(";")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `avargo-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const withEmail = useMemo(() => selected.filter((id) => leads.find((l) => l.id === id)?.email).length, [selected, leads]);

  const quickFilters = [
    { id: "alle", label: "Alle" },
    { id: "uten_epost", label: "Mangler e-post" },
    { id: "med_epost", label: "Har e-post" },
    { id: "ikke_kontaktet", label: "Ikke kontaktet" },
    { id: "kontaktet", label: "Kontaktet" },
  ];

  return (
    <div className={fullscreen ? "h-full flex flex-col gap-3" : "space-y-3"}>
      {/* toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Søk firma eller org.nr" className="pl-9 h-9" aria-label="Søk i leads" />
        </div>
        <Button size="sm" onClick={() => setSyncOpen(true)}><RefreshCw size={14} className="mr-1.5" />Hent nye</Button>
        <Button size="sm" variant="outline" onClick={runEnrich} disabled={enriching}>
          {enriching ? <Loader2 size={14} className="mr-1.5 animate-spin" /> : <Radar size={14} className="mr-1.5" />}
          Finn e-post
        </Button>
        <Button size="sm" variant="outline" onClick={exportCsv}><Download size={14} className="mr-1.5" />CSV</Button>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {quickFilters.map((f) => (
          <button key={f.id} type="button" onClick={() => setContactFilter(f.id)}
            className={`px-2.5 py-1 rounded-full text-[11px] border transition-colors ${contactFilter === f.id ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>
            {f.label}
          </button>
        ))}
        <span className="w-px h-4 bg-border mx-1" />
        <button type="button" onClick={() => setCategory("alle")}
          className={`px-2.5 py-1 rounded-full text-[11px] border transition-colors ${category === "alle" ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:border-primary/40"}`}>
          Alle kategorier
        </button>
        {CATEGORIES.map((c) => (
          <button key={c.id} type="button" onClick={() => setCategory(c.id)}
            className={`px-2.5 py-1 rounded-full text-[11px] border transition-colors ${category === c.id ? "bg-foreground text-background border-foreground" : `${c.color} hover:opacity-80`}`}>
            {c.label}
          </button>
        ))}
        <span className="w-px h-4 bg-border mx-1" />
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[130px] h-8 text-xs" aria-label="Status"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="alle">Alle statuser</SelectItem>
            {STATUSES.map((s) => <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={municipality} onValueChange={setMunicipality}>
          <SelectTrigger className="w-[150px] h-8 text-xs" aria-label="Kommune"><SelectValue placeholder="Kommune" /></SelectTrigger>
          <SelectContent className="max-h-72">
            <SelectItem value="alle">Alle kommuner</SelectItem>
            {municipalities.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
          </SelectContent>
        </Select>
        <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="w-[135px] h-8 text-xs" aria-label="Registrert fra" />
        <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="w-[135px] h-8 text-xs" aria-label="Registrert til" />
      </div>

      {/* selection bar */}
      {selected.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-3 py-2">
          <span className="text-xs">{selected.length} valgt · {withEmail} med e-post</span>
          <div className="flex-1" />
          <Button size="sm" onClick={() => setMailOpen(true)}><Mail size={14} className="mr-1.5" />Send e-post</Button>
          <Select onValueChange={(v) => bulkUpdate({ status: v })}>
            <SelectTrigger className="w-[140px] h-8 text-xs" aria-label="Sett status"><SelectValue placeholder="Sett status" /></SelectTrigger>
            <SelectContent>{STATUSES.map((s) => <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>)}</SelectContent>
          </Select>
          <Select onValueChange={(v) => bulkUpdate({ category: v })}>
            <SelectTrigger className="w-[150px] h-8 text-xs" aria-label="Sett kategori"><SelectValue placeholder="Sett kategori" /></SelectTrigger>
            <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>)}</SelectContent>
          </Select>
          <Button size="sm" variant="outline" onClick={() => setSelected([])}>Nullstill</Button>
          <Button size="sm" variant="ghost" className="text-destructive" onClick={removeSelected} aria-label="Slett valgte"><Trash2 size={14} /></Button>
        </div>
      )}

      {/* dense list */}
      <Card className={`overflow-hidden ${fullscreen ? "flex-1 min-h-0 flex flex-col" : ""}`}>
        <div className="grid grid-cols-[28px_minmax(0,2fr)_minmax(0,1.6fr)_110px_90px_130px] items-center gap-2 px-3 py-2 border-b border-border/50 bg-muted/40 text-[10px] uppercase tracking-wide text-muted-foreground">
          <Checkbox checked={allSelected} onCheckedChange={toggleAll} aria-label="Velg alle" />
          <span>Selskap ({total})</span>
          <span>Kontakt</span>
          <span>Kategori</span>
          <span>Kontaktet</span>
          <span>Status</span>
        </div>
        <div className={fullscreen ? "flex-1 min-h-0 overflow-y-auto" : ""}>
          {loading ? (
            <div className="p-8 text-center text-sm text-muted-foreground"><Loader2 className="animate-spin mx-auto mb-2" size={18} />Laster…</div>
          ) : leads.length === 0 ? (
            <div className="p-10 text-center">
              <Building2 size={28} className="mx-auto mb-3 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">Ingen selskaper her. Trykk «Hent nye» for å hente fra Brønnøysund.</p>
            </div>
          ) : (
            <div className="divide-y divide-border/40">
              {leads.map((l) => {
                const meta = categoryMeta(l.category);
                return (
                  <div key={l.id} className="grid grid-cols-[28px_minmax(0,2fr)_minmax(0,1.6fr)_110px_90px_130px] items-center gap-2 px-3 py-1.5 hover:bg-muted/30 transition-colors text-xs">
                    <Checkbox checked={selected.includes(l.id)} onCheckedChange={() => toggle(l.id)} aria-label={`Velg ${l.name}`} />
                    <button className="min-w-0 text-left" onClick={() => setDetail(l)}>
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="font-medium truncate">{l.name}</span>
                        {l.manual_lock && <Lock size={10} className="text-muted-foreground shrink-0" />}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground truncate">
                        <span>{l.orgnr}</span>
                        {l.org_form && <span>{l.org_form}</span>}
                        {l.municipality && <span className="flex items-center gap-0.5"><MapPin size={9} />{l.municipality}</span>}
                        {l.registered_at && <span className="flex items-center gap-0.5"><Calendar size={9} />{l.registered_at}</span>}
                      </div>
                    </button>
                    <div className="min-w-0 text-[10px]">
                      {l.email ? (
                        <a href={`mailto:${l.email}`} className="text-primary truncate block">{l.email}</a>
                      ) : (
                        <span className="text-muted-foreground/60">ingen e-post{l.enrich_status ? ` · ${l.enrich_status}` : ""}</span>
                      )}
                      <span className="text-muted-foreground truncate block">{[l.phone, l.contact_name].filter(Boolean).join(" · ") || "—"}</span>
                      <span className={`truncate block ${l.has_accountant ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                        {l.has_accountant ? `Regnskapsfører: ${l.accountant_name || "ukjent"}` : "Ingen regnskapsfører registrert"}
                      </span>
                    </div>
                    <Badge variant="outline" className={`text-[9px] justify-center ${meta.color}`}>{meta.label.split(" ")[0]}</Badge>
                    <span className="text-[10px] text-muted-foreground">
                      {l.email_count > 0
                        ? <span className="text-primary flex items-center gap-1"><CheckCircle2 size={10} />{l.email_count}x</span>
                        : l.unsubscribed ? "avmeldt" : "—"}
                    </span>
                    <Select value={l.status} onValueChange={(v) => updateLead(l.id, { status: v })}>
                      <SelectTrigger className="h-7 text-[11px]" aria-label={`Status for ${l.name}`}><SelectValue /></SelectTrigger>
                      <SelectContent>{STATUSES.map((s) => <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {total > PAGE_SIZE && (
          <div className="flex items-center justify-between px-3 py-2 border-t border-border/50">
            <Button size="sm" variant="outline" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>Forrige</Button>
            <span className="text-[11px] text-muted-foreground">Side {page + 1} av {Math.ceil(total / PAGE_SIZE)}</span>
            <Button size="sm" variant="outline" disabled={(page + 1) * PAGE_SIZE >= total} onClick={() => setPage((p) => p + 1)}>Neste</Button>
          </div>
        )}
      </Card>

      {/* sync dialog */}
      <Dialog open={syncOpen} onOpenChange={setSyncOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Hent selskaper fra Brønnøysund</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Registrert fra</Label><Input type="date" value={syncFrom} onChange={(e) => setSyncFrom(e.target.value)} /></div>
              <div><Label className="text-xs">Registrert til</Label><Input type="date" value={syncTo} onChange={(e) => setSyncTo(e.target.value)} /></div>
            </div>
            <div>
              <Label className="text-xs">Kommuner (tomt = hele landet)</Label>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {KOMMUNE_PRESETS.map((k) => (
                  <button key={k.nr} type="button"
                    onClick={() => setSyncKommuner((s) => s.includes(k.nr) ? s.filter((x) => x !== k.nr) : [...s, k.nr])}
                    className={`px-2.5 py-1 rounded-full text-[11px] border transition-colors ${syncKommuner.includes(k.nr) ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>
                    {k.label}
                  </button>
                ))}
              </div>
              <Input className="mt-2" placeholder="Egne kommunenummer, komma-separert (f.eks. 3401,3415)"
                value={syncKommuner.join(",")} onChange={(e) => setSyncKommuner(e.target.value.split(",").map((v) => v.trim()).filter(Boolean))} />
            </div>
            <div>
              <Label className="text-xs">Organisasjonsformer</Label>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {["AS", "ENK", "ANS", "DA", "NUF", "SA"].map((f) => (
                  <button key={f} type="button"
                    onClick={() => setSyncOrgForms((s) => s.includes(f) ? s.filter((x) => x !== f) : [...s, f])}
                    className={`px-2.5 py-1 rounded-full text-[11px] border transition-colors ${syncOrgForms.includes(f) ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Alle selskaper blir liggende permanent i basen. Kontaktinfo du har fylt inn selv, kategori og kontaktstatus blir aldri overskrevet av nye henteoperasjoner.
            </p>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setSyncOpen(false)}>Avbryt</Button>
            <Button variant="secondary" onClick={() => runSync(true)} disabled={syncing} title="Fortsetter bakover i tid fra det eldste selskapet du har – gir alltid nye selskaper">
              {syncing ? <Loader2 size={14} className="mr-2 animate-spin" /> : <RefreshCw size={14} className="mr-2" />}Hent flere (eldre)
            </Button>
            <Button onClick={() => runSync(false)} disabled={syncing}>
              {syncing ? <Loader2 size={14} className="mr-2 animate-spin" /> : <RefreshCw size={14} className="mr-2" />}Hent
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* send email dialog */}
      <Dialog open={mailOpen} onOpenChange={setMailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Send e-post til {selected.length} selskaper</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-xs">Mal</Label>
              <Select value={mailTemplate} onValueChange={setMailTemplate}>
                <SelectTrigger aria-label="Velg mal"><SelectValue placeholder="Velg mal" /></SelectTrigger>
                <SelectContent>
                  {templates.map((t) => <SelectItem key={t.id} value={t.id}>{t.name} · {categoryMeta(t.category).label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Testadresse (valgfritt – sender alt hit i stedet)</Label>
              <Input value={testEmail} onChange={(e) => setTestEmail(e.target.value)} placeholder="kontakt@avargo.no" />
            </div>
            <p className="text-[11px] text-muted-foreground">
              Kun mottakere med e-postadresse får e-post. Avmeldte og blokkerte adresser hoppes over automatisk.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMailOpen(false)}>Avbryt</Button>
            <Button onClick={async () => {
              if (!mailTemplate) return toast.error("Velg en mal");
              setSending(true);
              try {
                const { data, error } = await supabase.functions.invoke("crm-send-email", {
                  body: { mode: "manual", leadIds: selected, templateId: mailTemplate, testEmail: testEmail || undefined },
                });
                if (error) throw error;
                if (data?.error) throw new Error(data.error);
                toast.success(`${data.sent} e-post lagt i kø · ${data.skipped} hoppet over · ${data.failed} feilet`);
                setMailOpen(false); setSelected([]); setTestEmail(""); fetchLeads();
              } catch (e: any) {
                toast.error(e.message || "Utsending feilet");
              } finally { setSending(false); }
            }} disabled={sending}>
              {sending ? <Loader2 size={14} className="mr-2 animate-spin" /> : <Send size={14} className="mr-2" />}Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* detail sheet */}
      <Sheet open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          {detail && (
            <>
              <SheetHeader><SheetTitle className="pr-6">{detail.name}</SheetTitle></SheetHeader>
              <div className="space-y-4 mt-4 text-sm">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className={categoryMeta(detail.category).color}>{categoryMeta(detail.category).label}</Badge>
                  {detail.org_form_text && <Badge variant="secondary">{detail.org_form_text}</Badge>}
                  {detail.email_source && <Badge variant="outline" className="text-[10px]">Kilde: {detail.email_source}</Badge>}
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <span>Org.nr</span><span className="text-foreground">{detail.orgnr}</span>
                  <span>Registrert</span><span className="text-foreground">{detail.registered_at || "–"}</span>
                  <span>Bransje</span><span className="text-foreground">{detail.industry_text || "–"}</span>
                  <span>Adresse</span><span className="text-foreground">{[detail.address, detail.postal_code, detail.postal_area].filter(Boolean).join(", ") || "–"}</span>
                  <span>Ansatte</span><span className="text-foreground flex items-center gap-1"><Users size={11} />{detail.employees ?? "–"}</span>
                  <span>Regnskapsfører</span><span className="text-foreground">{detail.accountant_name || "Ingen registrert"}</span>
                  <span>Revisor</span><span className="text-foreground">{detail.has_auditor ? "Ja" : "Nei"}</span>
                  <span>E-post sendt</span><span className="text-foreground">{detail.email_count || 0}{detail.last_emailed_at ? ` · sist ${detail.last_emailed_at.slice(0, 10)}` : ""}</span>
                  <span>Nettsøk</span><span className="text-foreground">{detail.enrich_status || "ikke kjørt"}</span>
                </div>
                {detail.website && (
                  <a href={detail.website.startsWith("http") ? detail.website : `https://${detail.website}`} target="_blank" rel="noopener"
                    className="flex items-center gap-2 text-xs text-primary"><Globe size={12} />{detail.website}<ExternalLink size={10} /></a>
                )}
                {!!detail.roles?.length && (
                  <div>
                    <Label className="text-xs">Roller</Label>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {detail.roles.map((r, i) => <Badge key={i} variant="outline" className="text-[10px]">{r.type}: {r.name}</Badge>)}
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <div><Label className="text-xs">Kontaktperson</Label><Input value={detail.contact_name || ""} onChange={(e) => setDetail({ ...detail, contact_name: e.target.value })} onBlur={(e) => updateLead(detail.id, { contact_name: e.target.value })} /></div>
                  <div><Label className="text-xs">E-post</Label><Input value={detail.email || ""} onChange={(e) => setDetail({ ...detail, email: e.target.value })} onBlur={(e) => updateLead(detail.id, { email: e.target.value || null, email_verified: true, email_source: "manuell" })} /></div>
                  <div><Label className="text-xs">Telefon</Label><Input value={detail.phone || ""} onChange={(e) => setDetail({ ...detail, phone: e.target.value })} onBlur={(e) => updateLead(detail.id, { phone: e.target.value || null })} /></div>
                  <div><Label className="text-xs">Notater</Label><Textarea rows={4} value={detail.notes || ""} onChange={(e) => setDetail({ ...detail, notes: e.target.value })} onBlur={(e) => updateLead(detail.id, { notes: e.target.value })} /></div>
                  <div>
                    <Label className="text-xs">Kategori</Label>
                    <Select value={detail.category} onValueChange={(v) => updateLead(detail.id, { category: v })}>
                      <SelectTrigger aria-label="Kategori"><SelectValue /></SelectTrigger>
                      <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <label className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2">
                    <span className="text-xs">Lås kontaktinfo (beskytt mot ny synk)</span>
                    <Switch checked={!!detail.manual_lock} onCheckedChange={(v) => updateLead(detail.id, { manual_lock: v })} />
                  </label>
                </div>
                <a href={`https://virksomhet.brreg.no/nb/oppslag/enheter/${detail.orgnr}`} target="_blank" rel="noopener"
                  className="inline-flex items-center gap-1.5 text-xs text-primary">Se i Brønnøysundregistrene <ExternalLink size={10} /></a>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default LeadsTab;
