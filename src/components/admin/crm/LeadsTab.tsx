import { useEffect, useMemo, useRef, useState } from "react";
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
  CheckCircle2, Send, Loader2, Trash2, ExternalLink, Radar, Lock, SlidersHorizontal, X,
  FolderOpen, FolderPlus, UserRound, Eye, ChevronLeft, ChevronRight, Sparkles, TrendingUp,
  Bookmark, BookmarkPlus, History as HistoryIcon,
} from "lucide-react";
import { toast } from "sonner";
import SendPacingControl, { DEFAULT_PACING, SendPacing } from "@/components/admin/email/SendPacingControl";
import { CATEGORIES, STATUSES, categoryMeta, INDUSTRY_GROUPS, ORG_FORMS, EMPLOYEE_BANDS, type CrmLead, type CrmTemplate } from "./types";
import { buildLeadEmail } from "./emailPreview";
import { Highlight as Hl, matchReasons } from "./Highlight";
import ImportStatusPanel from "./ImportStatusPanel";
import SendProgressPanel from "../email/SendProgressPanel";


const PAGE_SIZE = 50;

// Kolonner listen faktisk trenger – utelater tunge felt (raw, financials, roles, owners)
const LIST_COLUMNS =
  "id,orgnr,name,org_form,org_form_text,industry_code,industry_text,municipality,municipality_number,postal_code,postal_area,address,registered_at,employees,website,email,email_verified,phone,contact_name,ceo_name,has_accountant,accountant_name,has_auditor,category,status,notes,last_emailed_at,email_count,unsubscribed,contacted_at,email_source,enriched_at,enrich_status,manual_lock,fiscal_year,revenue,net_result";


const nok = (v: number | null | undefined) =>
  typeof v === "number" ? new Intl.NumberFormat("nb-NO", { maximumFractionDigits: 0 }).format(v) + " kr" : "–";

// Felt som kan velges i CSV-eksporten (kun kolonner listespørringen henter)
const EXPORT_FIELDS: { key: string; label: string; group: string; get: (l: CrmLead) => string | number }[] = [
  { key: "orgnr", label: "Orgnr", group: "Selskap", get: (l) => l.orgnr || "" },
  { key: "name", label: "Navn", group: "Selskap", get: (l) => l.name || "" },
  { key: "org_form", label: "Selskapsform", group: "Selskap", get: (l) => l.org_form || "" },
  { key: "industry_code", label: "Næringskode", group: "Selskap", get: (l) => l.industry_code || "" },
  { key: "industry_text", label: "Bransje", group: "Selskap", get: (l) => l.industry_text || "" },
  { key: "registered_at", label: "Registrert", group: "Selskap", get: (l) => l.registered_at || "" },
  { key: "employees", label: "Ansatte", group: "Selskap", get: (l) => l.employees ?? "" },
  { key: "website", label: "Nettside", group: "Kontakt", get: (l) => l.website || "" },
  { key: "email", label: "E-post", group: "Kontakt", get: (l) => l.email || "" },
  { key: "email_verified", label: "E-post verifisert", group: "Kontakt", get: (l) => (l.email_verified ? "ja" : "nei") },
  { key: "phone", label: "Telefon", group: "Kontakt", get: (l) => l.phone || "" },
  { key: "contact_name", label: "Kontaktperson", group: "Kontakt", get: (l) => l.contact_name || "" },
  { key: "ceo_name", label: "Daglig leder", group: "Kontakt", get: (l) => l.ceo_name || "" },
  { key: "address", label: "Adresse", group: "Adresse", get: (l) => l.address || "" },
  { key: "postal_code", label: "Postnr", group: "Adresse", get: (l) => l.postal_code || "" },
  { key: "postal_area", label: "Poststed", group: "Adresse", get: (l) => l.postal_area || "" },
  { key: "municipality", label: "Kommune", group: "Adresse", get: (l) => l.municipality || "" },
  { key: "municipality_number", label: "Kommunenr", group: "Adresse", get: (l) => l.municipality_number || "" },
  { key: "has_accountant", label: "Har regnskapsfører", group: "Status", get: (l) => (l.has_accountant ? "ja" : "nei") },
  { key: "accountant_name", label: "Regnskapsfører", group: "Status", get: (l) => l.accountant_name || "" },
  { key: "category", label: "Kategori", group: "Status", get: (l) => categoryMeta(l.category).label },
  { key: "status", label: "Status", group: "Status", get: (l) => l.status || "" },
  { key: "email_count", label: "Antall e-poster sendt", group: "Status", get: (l) => l.email_count ?? 0 },
  { key: "last_emailed_at", label: "Sist kontaktet", group: "Status", get: (l) => l.last_emailed_at || "" },
  { key: "unsubscribed", label: "Avmeldt", group: "Status", get: (l) => (l.unsubscribed ? "ja" : "nei") },
  { key: "notes", label: "Notater", group: "Status", get: (l) => l.notes || "" },
  { key: "fiscal_year", label: "Regnskapsår", group: "Økonomi", get: (l) => l.fiscal_year ?? "" },
  { key: "revenue", label: "Driftsinntekter", group: "Økonomi", get: (l) => l.revenue ?? "" },
  { key: "net_result", label: "Årsresultat", group: "Økonomi", get: (l) => l.net_result ?? "" },
];
const DEFAULT_EXPORT_FIELDS = ["orgnr", "name", "org_form", "industry_text", "municipality", "employees", "email", "phone", "contact_name", "accountant_name", "category", "status"];



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

  // ── avanserte filtre ──
  const [showFilters, setShowFilters] = useState(false);
  const [orgFormFilter, setOrgFormFilter] = useState<string[]>([]);
  const [municipalityMulti, setMunicipalityMulti] = useState<string[]>([]);
  const [municipalitySearch, setMunicipalitySearch] = useState("");
  const [industryGroups, setIndustryGroups] = useState<string[]>([]);
  const [industryText, setIndustryText] = useState("");
  const [employeeBands, setEmployeeBands] = useState<string[]>([]);
  const [hasEmail, setHasEmail] = useState("alle"); // alle | ja | nei | verifisert | uverifisert
  const [orgnrFilter, setOrgnrFilter] = useState("");
  const [empMin, setEmpMin] = useState("");
  const [empMax, setEmpMax] = useState("");
  const [hasPhone, setHasPhone] = useState("alle");
  const [hasWebsite, setHasWebsite] = useState("alle");
  const [accountantFilter, setAccountantFilter] = useState("alle"); // alle | ja | nei
  const [accountantName, setAccountantName] = useState("");
  const [unsubFilter, setUnsubFilter] = useState("alle"); // alle | aktive | avmeldte

  // ── lagrede visninger og nylige søk ──
  const [savedViews, setSavedViews] = useState<any[]>([]);
  const [saveViewOpen, setSaveViewOpen] = useState(false);
  const [saveViewName, setSaveViewName] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("crm_recent_searches") || "[]"); } catch { return []; }
  });




  const [selected, setSelected] = useState<string[]>([]);
  const [exportOpen, setExportOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportScope, setExportScope] = useState<"side" | "valgte" | "treff">("treff");
  const [exportLimit, setExportLimit] = useState("5000");
  const [exportFields, setExportFields] = useState<string[]>(DEFAULT_EXPORT_FIELDS);
  const [detail, setDetail] = useState<CrmLead | null>(null);

  const [syncOpen, setSyncOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [enriching, setEnriching] = useState(false);
  const [fullEnriching, setFullEnriching] = useState(false);

  const [syncFrom, setSyncFrom] = useState(() => new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10));
  const [syncTo, setSyncTo] = useState(() => new Date().toISOString().slice(0, 10));
  const [syncKommuner, setSyncKommuner] = useState<string[]>([]);
  const [syncOrgForms, setSyncOrgForms] = useState<string[]>(["AS", "ENK"]);
  const [syncIndustryGroups, setSyncIndustryGroups] = useState<string[]>([]);
  const [syncIndustryCodes, setSyncIndustryCodes] = useState("");
  const [syncFolderTarget, setSyncFolderTarget] = useState("ingen"); // ingen | <folderId> | __ny
  const [syncFolderName, setSyncFolderName] = useState("");

  const [importState, setImportState] = useState<any>(null);
  const [bulkBusy, setBulkBusy] = useState(false);

  const [templates, setTemplates] = useState<CrmTemplate[]>([]);
  const [mailOpen, setMailOpen] = useState(false);
  const [mailTemplate, setMailTemplate] = useState("");
  const [testEmail, setTestEmail] = useState("");
  const [pacing, setPacing] = useState<SendPacing>(DEFAULT_PACING);
  const [sending, setSending] = useState(false);
  const [previewIdx, setPreviewIdx] = useState(0);


  // ── mapper ──
  const [folders, setFolders] = useState<{ id: string; name: string; description: string | null; count?: number }[]>([]);
  const [activeFolder, setActiveFolder] = useState("alle");
  const [folderDialog, setFolderDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderDesc, setNewFolderDesc] = useState("");
  const [rolesBusy, setRolesBusy] = useState(false);

  const fetchFolders = async () => {
    const { data } = await supabase.from("crm_lead_folders").select("id, name, description").order("name");
    const list = (data as any[]) || [];
    const withCounts = await Promise.all(
      list.map(async (f) => {
        const { count } = await supabase
          .from("crm_lead_folder_members")
          .select("lead_id", { count: "exact", head: true })
          .eq("folder_id", f.id);
        return { ...f, count: count || 0 };
      }),
    );
    setFolders(withCounts);
  };

  const createFolder = async () => {
    if (!newFolderName.trim()) return;
    const { data, error } = await supabase
      .from("crm_lead_folders")
      .insert({ name: newFolderName.trim(), description: newFolderDesc.trim() || null })
      .select("id, name, description")
      .single();
    if (error) return toast.error(error.message);
    // legg til de valgte selskapene med én gang, hvis noen er valgt
    if (selected.length && data) {
      await supabase.from("crm_lead_folder_members").upsert(
        selected.map((lead_id) => ({ folder_id: (data as any).id, lead_id })),
        { onConflict: "folder_id,lead_id", ignoreDuplicates: true },
      );
    }
    toast.success(`Mappen «${newFolderName.trim()}» er opprettet`);
    setNewFolderName(""); setNewFolderDesc(""); setFolderDialog(false);
    fetchFolders();
  };

  const deleteFolder = async (id: string) => {
    const { error } = await supabase.from("crm_lead_folders").delete().eq("id", id);
    if (error) return toast.error(error.message);
    if (activeFolder === id) setActiveFolder("alle");
    toast.success("Mappe slettet");
    fetchFolders();
  };

  const addSelectedToFolder = async (folderId: string) => {
    if (!selected.length) return;
    const { error } = await supabase.from("crm_lead_folder_members").upsert(
      selected.map((lead_id) => ({ folder_id: folderId, lead_id })),
      { onConflict: "folder_id,lead_id", ignoreDuplicates: true },
    );
    if (error) return toast.error(error.message);
    toast.success(`${selected.length} lagt i mappen`);
    setSelected([]);
    fetchFolders();
  };

  const removeSelectedFromFolder = async () => {
    if (!selected.length || activeFolder === "alle") return;
    const { error } = await supabase
      .from("crm_lead_folder_members")
      .delete()
      .eq("folder_id", activeFolder)
      .in("lead_id", selected);
    if (error) return toast.error(error.message);
    toast.success("Fjernet fra mappen");
    setSelected([]);
    fetchFolders();
    fetchLeads();
  };

  const runRoles = async () => {
    setRolesBusy(true);
    toast.info("Henter daglig leder fra Brønnøysund …");
    try {
      const { data, error } = await supabase.functions.invoke("crm-fetch-roles", {
        body: selected.length ? { leadIds: selected } : { limit: 100 },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      toast.success(`Sjekket ${(data as any).processed} selskaper – fant ${(data as any).found} navn`);
      fetchLeads();
    } catch (e: any) {
      toast.error(e.message || "Kunne ikke hente roller");
    } finally {
      setRolesBusy(false);
    }
  };

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
    // Rask indeksbasert uthenting – leser ikke gjennom 300 000+ rader
    const { data, error } = await supabase.rpc("crm_municipalities" as any);
    if (!error && data) {
      setMunicipalities(((data as any[]) || []).map((r: any) => (typeof r === "string" ? r : r.municipality)).filter(Boolean));
      return;
    }
    const { data: fb } = await supabase.from("crm_leads").select("municipality").not("municipality", "is", null).limit(5000);
    setMunicipalities(Array.from(new Set(((fb as any[]) || []).map((r) => r.municipality).filter(Boolean))).sort());
  };


  const fetchTemplates = async () => {
    const { data } = await supabase.from("crm_email_templates").select("*").eq("active", true).order("name");
    setTemplates((data as CrmTemplate[]) || []);
  };

  // Åpner kundekortet med lettvekts-raden først, og etterfyller de tunge feltene
  const openDetail = async (l: CrmLead) => {
    setDetail(l);
    const { data } = await supabase.from("crm_leads").select("*").eq("id", l.id).maybeSingle();
    if (data) setDetail((d) => (d && d.id === (data as any).id ? (data as any) : d));
  };

  // Henter id-ene i valgt mappe (null = ingen mappebegrensning)
  const resolveFolderIds = async (): Promise<string[] | null> => {
    if (activeFolder === "alle") return null;
    const { data: mem } = await supabase
      .from("crm_lead_folder_members").select("lead_id").eq("folder_id", activeFolder).limit(5000);
    return ((mem as any[]) || []).map((m) => m.lead_id);
  };

  // Bygger spørringen med alle aktive filtre – brukes både av listen og CSV-eksporten
  const applyLeadFilters = (q: any, folderIds: string[] | null) => {
    if (folderIds) q = q.in("id", folderIds);
    const term = search.trim();
    if (term) {
      const esc = term.replace(/[%,()]/g, " ").trim();
      const digits = esc.replace(/\s/g, "");
      // Ett samlet trigram-indeksert søkefelt = millisekundsøk i hele registeret
      q = /^\d{6,9}$/.test(digits)
        ? q.like("orgnr", `${digits}%`)
        : q.ilike("search_text", `%${esc}%`);
    }


    if (category !== "alle") q = q.eq("category", category);
    if (status !== "alle") q = q.eq("status", status);
    if (municipality !== "alle") q = q.eq("municipality", municipality);
    if (municipalityMulti.length) q = q.in("municipality", municipalityMulti);
    if (orgFormFilter.length) q = q.in("org_form", orgFormFilter);
    if (industryGroups.length) {
      const prefixes = INDUSTRY_GROUPS.filter((g) => industryGroups.includes(g.id)).flatMap((g) => g.prefixes);
      q = q.or(prefixes.map((p) => `industry_code.like.${p}%`).join(","));
    }
    if (industryText.trim()) q = q.ilike("industry_text", `%${industryText.trim()}%`);
    if (employeeBands.length) {
      const parts = EMPLOYEE_BANDS.filter((b) => employeeBands.includes(b.id)).map((b) =>
        b.max === null ? `employees.gte.${b.min}` : `and(employees.gte.${b.min},employees.lte.${b.max})`
      );
      q = q.or(parts.join(","));
    }
    if (hasEmail === "ja") q = q.not("email", "is", null);
    if (hasEmail === "nei") q = q.is("email", null);
    if (hasEmail === "verifisert") q = q.not("email", "is", null).eq("email_verified", true);
    if (hasEmail === "uverifisert") q = q.not("email", "is", null).eq("email_verified", false);
    if (orgnrFilter.replace(/\D/g, "")) q = q.like("orgnr", `${orgnrFilter.replace(/\D/g, "")}%`);
    if (empMin.trim()) q = q.gte("employees", Number(empMin));
    if (empMax.trim()) q = q.lte("employees", Number(empMax));
    if (hasPhone === "ja") q = q.not("phone", "is", null);
    if (hasPhone === "nei") q = q.is("phone", null);
    if (hasWebsite === "ja") q = q.not("website", "is", null);
    if (hasWebsite === "nei") q = q.is("website", null);
    if (accountantFilter === "ja") q = q.eq("has_accountant", true);
    if (accountantFilter === "nei") q = q.eq("has_accountant", false);
    if (accountantName.trim()) q = q.ilike("accountant_name", `%${accountantName.trim()}%`);
    if (unsubFilter === "aktive") q = q.eq("unsubscribed", false);
    if (unsubFilter === "avmeldte") q = q.eq("unsubscribed", true);
    if (fromDate) q = q.gte("registered_at", fromDate);
    if (toDate) q = q.lte("registered_at", toDate);
    if (contactFilter === "med_epost") q = q.not("email", "is", null);
    if (contactFilter === "uten_epost") q = q.is("email", null);
    if (contactFilter === "kontaktet") q = q.gt("email_count", 0);
    if (contactFilter === "ikke_kontaktet") q = q.eq("email_count", 0);
    return q;
  };

  const fetchSeq = useRef(0);

  const fetchLeads = async () => {
    const seq = ++fetchSeq.current;
    setLoading(true);
    const folderIds = await resolveFolderIds();
    if (folderIds && !folderIds.length) { setLeads([]); setTotal(0); setLoading(false); return; }
    // Henter kun kolonnene listen viser (uten tunge jsonb-felt) – detaljkortet laster resten.
    // Antall telles kun på første side (estimat), resten av sidene gjenbruker tallet = mye raskere bla.
    const withCount = page === 0;
    const q = applyLeadFilters(
      supabase.from("crm_leads").select(LIST_COLUMNS, withCount ? { count: "estimated" } : undefined),
      folderIds,
    );
    const { data, count, error } = await q
      .order("registered_at", { ascending: false, nullsFirst: false })
      .range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1);
    if (seq !== fetchSeq.current) return; // eldre svar – ignorer
    if (error) {
      toast.error("Kunne ikke hente selskaper: " + error.message);
      setLeads([]); setTotal(0); setLoading(false); return;
    }
    setLeads(((data as unknown) as CrmLead[]) || []);
    if (withCount) setTotal(count || 0);
    setLoading(false);
  };



  const activeFilterCount =
    orgFormFilter.length + municipalityMulti.length + industryGroups.length + employeeBands.length +
    (industryText.trim() ? 1 : 0) + (accountantName.trim() ? 1 : 0) +
    [hasEmail, hasPhone, hasWebsite, accountantFilter, unsubFilter].filter((v) => v !== "alle").length +
    (orgnrFilter.trim() ? 1 : 0) + (empMin.trim() ? 1 : 0) + (empMax.trim() ? 1 : 0) +
    (fromDate ? 1 : 0) + (toDate ? 1 : 0);

  const resetFilters = () => {
    setOrgFormFilter([]); setMunicipalityMulti([]); setMunicipalitySearch(""); setIndustryGroups([]);
    setIndustryText(""); setEmployeeBands([]); setHasEmail("alle"); setHasPhone("alle");
    setHasWebsite("alle"); setAccountantFilter("alle"); setAccountantName("");
    setUnsubFilter("alle"); setFromDate(""); setToDate(""); setMunicipality("alle");
    setOrgnrFilter(""); setEmpMin(""); setEmpMax("");
  };

  const toggleIn = (setter: (fn: (s: string[]) => string[]) => void, v: string) =>
    setter((s) => (s.includes(v) ? s.filter((x) => x !== v) : [...s, v]));

  // ── lagrede visninger ──
  const currentFilters = () => ({
    search, category, status, municipality, fromDate, toDate, contactFilter,
    orgFormFilter, municipalityMulti, industryGroups, industryText, employeeBands,
    hasEmail, hasPhone, hasWebsite, accountantFilter, accountantName, unsubFilter,
    orgnrFilter, empMin, empMax, activeFolder,
  });

  const fetchSavedViews = async () => {
    const { data } = await supabase.from("crm_saved_views" as any)
      .select("id,name,filters,last_used_at,created_at")
      .order("last_used_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })
      .limit(30);
    setSavedViews((data as any[]) || []);
  };

  const saveView = async () => {
    const name = saveViewName.trim();
    if (!name) return;
    const { data: u } = await supabase.auth.getUser();
    const { error } = await supabase.from("crm_saved_views" as any)
      .insert({ name, filters: currentFilters(), created_by: u?.user?.id ?? null } as any);
    if (error) { toast.error("Kunne ikke lagre visningen"); return; }
    toast.success(`Visningen «${name}» er lagret`);
    setSaveViewName(""); setSaveViewOpen(false);
    fetchSavedViews();
  };

  const applyView = async (view: any) => {
    const f = (view?.filters || {}) as Record<string, any>;
    setSearch(f.search ?? ""); setCategory(f.category ?? "alle"); setStatus(f.status ?? "alle");
    setMunicipality(f.municipality ?? "alle"); setFromDate(f.fromDate ?? ""); setToDate(f.toDate ?? "");
    setContactFilter(f.contactFilter ?? "alle"); setOrgFormFilter(f.orgFormFilter ?? []);
    setMunicipalityMulti(f.municipalityMulti ?? []); setIndustryGroups(f.industryGroups ?? []);
    setIndustryText(f.industryText ?? ""); setEmployeeBands(f.employeeBands ?? []);
    setHasEmail(f.hasEmail ?? "alle"); setHasPhone(f.hasPhone ?? "alle"); setHasWebsite(f.hasWebsite ?? "alle");
    setAccountantFilter(f.accountantFilter ?? "alle"); setAccountantName(f.accountantName ?? "");
    setUnsubFilter(f.unsubFilter ?? "alle"); setOrgnrFilter(f.orgnrFilter ?? "");
    setEmpMin(f.empMin ?? ""); setEmpMax(f.empMax ?? ""); setActiveFolder(f.activeFolder ?? "alle");
    setPage(0);
    await supabase.from("crm_saved_views" as any).update({ last_used_at: new Date().toISOString() } as any).eq("id", view.id);
    fetchSavedViews();
  };

  const deleteView = async (id: string) => {
    await supabase.from("crm_saved_views" as any).delete().eq("id", id);
    setSavedViews((v) => v.filter((x) => x.id !== id));
  };

  // ── nylige søk ──
  const pushRecentSearch = (term: string) => {
    const t = term.trim();
    if (t.length < 2) return;
    setRecentSearches((prev) => {
      const next = [t, ...prev.filter((p) => p.toLowerCase() !== t.toLowerCase())].slice(0, 8);
      localStorage.setItem("crm_recent_searches", JSON.stringify(next));
      return next;
    });
  };

  const clearRecentSearches = () => {
    localStorage.removeItem("crm_recent_searches");
    setRecentSearches([]);
  };

  useEffect(() => {
    fetchMunicipalities(); fetchTemplates(); fetchImportState(); fetchFolders(); fetchSavedViews();
    const t = setInterval(fetchImportState, 20000);
    return () => clearInterval(t);
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchLeads(); }, [page]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setPage(0);
    const t = setTimeout(() => { pushRecentSearch(search); fetchLeads(); }, 400);
    return () => clearTimeout(t);
  },
    [search, category, status, municipality, fromDate, toDate, contactFilter, orgFormFilter, municipalityMulti,
     industryGroups, industryText, employeeBands, hasEmail, hasPhone, hasWebsite, accountantFilter, accountantName,
     unsubFilter, activeFolder, orgnrFilter, empMin, empMax]);


  const allSelected = leads.length > 0 && selected.length === leads.length;
  const toggleAll = () => setSelected(allSelected ? [] : leads.map((l) => l.id));
  const toggle = (id: string) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const syncPrefixes = () => {
    const fromGroups = INDUSTRY_GROUPS.filter((g) => syncIndustryGroups.includes(g.id)).flatMap((g) => g.prefixes);
    const manual = syncIndustryCodes.split(",").map((v) => v.trim()).filter(Boolean);
    return Array.from(new Set([...fromGroups, ...manual]));
  };

  const putOrgnrsInFolder = async (orgnrs: string[]) => {
    if (!orgnrs.length || syncFolderTarget === "ingen") return;
    let folderId = syncFolderTarget;
    if (syncFolderTarget === "__ny") {
      const name = syncFolderName.trim();
      if (!name) return;
      const { data, error } = await supabase
        .from("crm_lead_folders").insert({ name }).select("id").single();
      if (error) { toast.error(error.message); return; }
      folderId = (data as any).id;
    }
    let added = 0;
    for (let i = 0; i < orgnrs.length; i += 500) {
      const chunk = orgnrs.slice(i, i + 500);
      const { data: rows } = await supabase.from("crm_leads").select("id").in("orgnr", chunk);
      const members = ((rows as any[]) || []).map((r) => ({ folder_id: folderId, lead_id: r.id }));
      if (!members.length) continue;
      const { error } = await supabase
        .from("crm_lead_folder_members").upsert(members, { onConflict: "folder_id,lead_id", ignoreDuplicates: true });
      if (error) { toast.error(error.message); return; }
      added += members.length;
    }
    toast.success(`${added} selskaper lagt i mappen`);
    setSyncFolderName("");
    fetchFolders();
  };

  const runSync = async (backfill = false) => {
    setSyncing(true);
    try {
      const industryPrefixes = syncPrefixes();
      const { data, error } = await supabase.functions.invoke("crm-brreg-sync", {
        body: backfill
          ? { mode: "backfill", windowDays: 90, maxPages: 30, municipalities: syncKommuner, orgForms: syncOrgForms, industryPrefixes }
          : { mode: "manual", from: syncFrom, to: syncTo, municipalities: syncKommuner, orgForms: syncOrgForms, industryPrefixes },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast.success(`Hentet ${data.fetched} selskaper – ${data.inserted} nye, ${data.updated} oppdatert${backfill ? ` (${data.from} – ${data.to})` : ""}`);
      await putOrgnrsInFolder((data?.orgnrs as string[]) || []);
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

  const runFullEnrich = async () => {
    setFullEnriching(true);
    toast.info("Henter eiere, regnskapstall og selskapsinfo …");
    try {
      const { data, error } = await supabase.functions.invoke("crm-enrich-company", {
        body: selected.length ? { leadIds: selected } : { limit: 25 },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast.success(`${data.processed} selskaper oppdatert – ${data.withFinancials} med regnskapstall`);
      fetchLeads();
    } catch (e: any) {
      toast.error(e.message || "Berikelse feilet");
    } finally {
      setFullEnriching(false);
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

  // Kjører eksporten med valgt omfang og valgte felter
  const runExport = async () => {
    const fields = EXPORT_FIELDS.filter((f) => exportFields.includes(f.key));
    if (!fields.length) { toast.error("Velg minst ett felt"); return; }
    setExporting(true);
    try {
      let rows: CrmLead[] = [];
      if (exportScope === "valgte") {
        rows = leads.filter((l) => selected.includes(l.id));
      } else if (exportScope === "side") {
        rows = leads;
      } else {
        const folderIds = await resolveFolderIds();
        if (folderIds && !folderIds.length) { toast.error("Ingen treff å eksportere"); setExporting(false); return; }
        const max = Math.max(1, Math.min(Number(exportLimit) || 5000, 50000));
        const CHUNK = 1000;
        for (let from = 0; from < max; from += CHUNK) {
          const q = applyLeadFilters(supabase.from("crm_leads").select(LIST_COLUMNS), folderIds);
          const { data, error } = await q
            .order("registered_at", { ascending: false, nullsFirst: false })
            .range(from, Math.min(from + CHUNK, max) - 1);
          if (error) throw error;
          const batch = ((data as unknown) as CrmLead[]) || [];
          rows = rows.concat(batch);
          if (batch.length < CHUNK) break;
        }
      }
      if (!rows.length) { toast.error("Ingen rader å eksportere"); setExporting(false); return; }

      const csv = [fields.map((f) => f.label), ...rows.map((l) => fields.map((f) => f.get(l)))]
        .map((r) => r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(";")).join("\n");
      const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `avargo-leads-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(a.href);
      toast.success(`Eksporterte ${rows.length} rader`);
      setExportOpen(false);
    } catch (e: any) {
      toast.error(e?.message || "Kunne ikke eksportere");
    } finally {
      setExporting(false);
    }
  };


  const withEmail = useMemo(() => selected.filter((id) => leads.find((l) => l.id === id)?.email).length, [selected, leads]);

  // Mottakerne som faktisk får e-post – i samme rekkefølge som de sendes ut.
  const mailRecipients = useMemo(
    () => leads.filter((l) => selected.includes(l.id) && !!l.email && !l.unsubscribed),
    [leads, selected],
  );
  const previewLead = mailRecipients[Math.min(previewIdx, Math.max(0, mailRecipients.length - 1))] || null;
  const previewTemplate = templates.find((t) => t.id === mailTemplate) || null;
  const previewMail = useMemo(
    () => buildLeadEmail(previewTemplate, previewLead),
    [previewTemplate, previewLead],
  );


  const quickFilters = [
    { id: "alle", label: "Alle" },
    { id: "uten_epost", label: "Mangler e-post" },
    { id: "med_epost", label: "Har e-post" },
    { id: "ikke_kontaktet", label: "Ikke kontaktet" },
    { id: "kontaktet", label: "Kontaktet" },
  ];

  return (
    <div className={fullscreen ? "h-full flex flex-col gap-3" : "space-y-3"}>
      <ImportStatusPanel onChanged={() => { fetchImportState(); fetchLeads(); }} />
      <SendProgressPanel />
      {/* toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Søk i hele databasen: firma, org.nr, e-post, kontaktperson eller kommune" className="pl-9 h-9" aria-label="Søk i leads" />
        </div>
        <Button size="sm" onClick={() => setSyncOpen(true)}><RefreshCw size={14} className="mr-1.5" />Hent nye</Button>
        <Button size="sm" variant="outline" onClick={runEnrich} disabled={enriching}>
          {enriching ? <Loader2 size={14} className="mr-1.5 animate-spin" /> : <Radar size={14} className="mr-1.5" />}
          Finn e-post
        </Button>
        <Button size="sm" variant="outline" onClick={runRoles} disabled={rolesBusy}>
          {rolesBusy ? <Loader2 size={14} className="mr-1.5 animate-spin" /> : <UserRound size={14} className="mr-1.5" />}
          Hent daglig leder
        </Button>
        <Button size="sm" variant="outline" onClick={runFullEnrich} disabled={fullEnriching}>
          {fullEnriching ? <Loader2 size={14} className="mr-1.5 animate-spin" /> : <Sparkles size={14} className="mr-1.5" />}
          Full selskapsinfo
        </Button>

        <Button size="sm" variant="outline" onClick={() => setExportOpen(true)}><Download size={14} className="mr-1.5" />Eksporter CSV</Button>
      </div>

      {/* lagrede visninger og nylige søk */}
      <div className="flex flex-wrap items-center gap-1.5">
        <Bookmark size={13} className="text-muted-foreground" />
        <span className="text-[11px] text-muted-foreground">Lagrede visninger:</span>
        {savedViews.length === 0 && <span className="text-[11px] text-muted-foreground/70">ingen enda</span>}
        {savedViews.map((v) => (
          <span key={v.id} className="group inline-flex items-center">
            <button type="button" onClick={() => applyView(v)} title="Bruk denne visningen"
              className="px-2.5 py-1 rounded-full text-[11px] border border-border text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors">
              {v.name}
            </button>
            <button type="button" onClick={() => deleteView(v.id)} aria-label={`Slett visningen ${v.name}`}
              className="ml-0.5 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity">
              <X size={11} />
            </button>
          </span>
        ))}
        <Button size="sm" variant="ghost" className="h-7 text-[11px]" onClick={() => setSaveViewOpen(true)}>
          <BookmarkPlus size={13} className="mr-1" />Lagre dagens filter
        </Button>

        {recentSearches.length > 0 && (
          <>
            <span className="w-px h-4 bg-border mx-1" />
            <HistoryIcon size={13} className="text-muted-foreground" />
            <span className="text-[11px] text-muted-foreground">Nylige søk:</span>
            {recentSearches.map((t) => (
              <button key={t} type="button" onClick={() => setSearch(t)}
                className="px-2.5 py-1 rounded-full text-[11px] border border-border/70 bg-muted/40 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors">
                {t}
              </button>
            ))}
            <Button size="sm" variant="ghost" className="h-7 text-[11px] text-muted-foreground" onClick={clearRecentSearches}>
              Tøm
            </Button>
          </>
        )}
      </div>



      {/* mapper */}
      <div className="flex flex-wrap items-center gap-1.5">
        <FolderOpen size={13} className="text-muted-foreground" />
        {/* Rullegardin for rask bytting når det er mange mapper */}
        <Select value={activeFolder} onValueChange={setActiveFolder}>
          <SelectTrigger className="h-7 w-[190px] text-[11px]" aria-label="Velg mappe">
            <SelectValue placeholder="Velg mappe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="alle">Alle selskaper</SelectItem>
            {folders.map((f) => (
              <SelectItem key={f.id} value={f.id}>
                {f.name}{typeof f.count === "number" ? ` (${f.count})` : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <button type="button" onClick={() => setActiveFolder("alle")}
          className={`px-2.5 py-1 rounded-full text-[11px] border transition-colors ${activeFolder === "alle" ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:border-primary/40"}`}>
          Alle selskaper
        </button>

        {folders.map((f) => (
          <span key={f.id} className="group inline-flex items-center">
            <button type="button" onClick={() => setActiveFolder(f.id)}
              className={`px-2.5 py-1 rounded-full text-[11px] border transition-colors ${activeFolder === f.id ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>
              {f.name}{typeof f.count === "number" ? ` (${f.count})` : ""}
            </button>
            <button type="button" onClick={() => deleteFolder(f.id)} aria-label={`Slett mappen ${f.name}`}
              className="ml-0.5 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity">
              <X size={11} />
            </button>
          </span>
        ))}
        <Button size="sm" variant="ghost" className="h-7 text-[11px]" onClick={() => setFolderDialog(true)}>
          <FolderPlus size={13} className="mr-1" />Ny mappe
        </Button>
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
        <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="w-[135px] h-8 text-xs" aria-label="Registrert fra" />
        <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="w-[135px] h-8 text-xs" aria-label="Registrert til" />
        <Button size="sm" variant={showFilters ? "default" : "outline"} className="h-8 text-xs" onClick={() => setShowFilters((v) => !v)}>
          <SlidersHorizontal size={13} className="mr-1.5" />Filter{activeFilterCount ? ` (${activeFilterCount})` : ""}
        </Button>
        {activeFilterCount > 0 && (
          <Button size="sm" variant="ghost" className="h-8 text-xs text-muted-foreground" onClick={resetFilters}>
            <X size={13} className="mr-1" />Nullstill
          </Button>
        )}
      </div>

      {/* avansert filterpanel */}
      {showFilters && (
        <Card className="p-3 space-y-3">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {/* Selskapsform */}
            <div>
              <Label className="text-[11px] text-muted-foreground">Selskapsform</Label>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {ORG_FORMS.map((f) => (
                  <button key={f} type="button" onClick={() => toggleIn(setOrgFormFilter, f)}
                    className={`px-2.5 py-1 rounded-full text-[11px] border transition-colors ${orgFormFilter.includes(f) ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Ansatte */}
            <div>
              <Label className="text-[11px] text-muted-foreground">Antall ansatte</Label>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {EMPLOYEE_BANDS.map((b) => (
                  <button key={b.id} type="button" onClick={() => toggleIn(setEmployeeBands, b.id)}
                    className={`px-2.5 py-1 rounded-full text-[11px] border transition-colors ${employeeBands.includes(b.id) ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>
                    {b.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Input type="number" min={0} value={empMin} onChange={(e) => setEmpMin(e.target.value)}
                  placeholder="Fra" className="h-8 text-xs" aria-label="Ansatte fra" />
                <span className="text-[11px] text-muted-foreground">–</span>
                <Input type="number" min={0} value={empMax} onChange={(e) => setEmpMax(e.target.value)}
                  placeholder="Til" className="h-8 text-xs" aria-label="Ansatte til" />
              </div>
            </div>

            {/* Org.nr */}
            <div>
              <Label className="text-[11px] text-muted-foreground">Org.nr</Label>
              <Input value={orgnrFilter} onChange={(e) => setOrgnrFilter(e.target.value)}
                placeholder="Hele eller starten av org.nr (f.eks. 938)" className="h-8 text-xs mt-1.5" aria-label="Org.nr" />
            </div>

            {/* Kontaktinfo */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-[11px] text-muted-foreground">E-poststatus</Label>
                <Select value={hasEmail} onValueChange={setHasEmail}>
                  <SelectTrigger className="h-8 text-xs mt-1.5" aria-label="E-poststatus"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alle">Alle</SelectItem>
                    <SelectItem value="ja">Har e-post</SelectItem>
                    <SelectItem value="nei">Mangler e-post</SelectItem>
                    <SelectItem value="verifisert">Verifisert e-post</SelectItem>
                    <SelectItem value="uverifisert">Uverifisert e-post</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-[11px] text-muted-foreground">Telefon</Label>
                <Select value={hasPhone} onValueChange={setHasPhone}>
                  <SelectTrigger className="h-8 text-xs mt-1.5" aria-label="Har telefon"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alle">Alle</SelectItem>
                    <SelectItem value="ja">Har telefon</SelectItem>
                    <SelectItem value="nei">Mangler telefon</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-[11px] text-muted-foreground">Nettside</Label>
                <Select value={hasWebsite} onValueChange={setHasWebsite}>
                  <SelectTrigger className="h-8 text-xs mt-1.5" aria-label="Har nettside"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alle">Alle</SelectItem>
                    <SelectItem value="ja">Har nettside</SelectItem>
                    <SelectItem value="nei">Mangler nettside</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-[11px] text-muted-foreground">Nyhetsbrev</Label>
                <Select value={unsubFilter} onValueChange={setUnsubFilter}>
                  <SelectTrigger className="h-8 text-xs mt-1.5" aria-label="Avmeldt"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alle">Alle</SelectItem>
                    <SelectItem value="aktive">Kan kontaktes</SelectItem>
                    <SelectItem value="avmeldte">Avmeldt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Regnskapsfører */}
            <div>
              <Label className="text-[11px] text-muted-foreground">Regnskapsfører</Label>
              <Select value={accountantFilter} onValueChange={setAccountantFilter}>
                <SelectTrigger className="h-8 text-xs mt-1.5" aria-label="Regnskapsfører"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="alle">Alle</SelectItem>
                  <SelectItem value="ja">Har regnskapsfører</SelectItem>
                  <SelectItem value="nei">Uten regnskapsfører</SelectItem>
                </SelectContent>
              </Select>
              <Input value={accountantName} onChange={(e) => setAccountantName(e.target.value)}
                placeholder="Søk på byrånavn" className="h-8 text-xs mt-2" aria-label="Søk regnskapsfører" />
            </div>

            {/* Næring */}
            <div className="xl:col-span-2">
              <Label className="text-[11px] text-muted-foreground">Type næring</Label>
              <Input value={industryText} onChange={(e) => setIndustryText(e.target.value)}
                placeholder="Søk i næringstekst (f.eks. frisør, bygg, transport)" className="h-8 text-xs mt-1.5" aria-label="Søk næring" />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {INDUSTRY_GROUPS.map((g) => (
                  <button key={g.id} type="button" onClick={() => toggleIn(setIndustryGroups, g.id)}
                    className={`px-2.5 py-1 rounded-full text-[11px] border transition-colors ${industryGroups.includes(g.id) ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Kommune */}
            <div>
              <Label className="text-[11px] text-muted-foreground">
                Kommune {municipalityMulti.length ? `(${municipalityMulti.length} valgt)` : ""}
              </Label>
              <Input value={municipalitySearch} onChange={(e) => setMunicipalitySearch(e.target.value)}
                placeholder="Søk kommune" className="h-8 text-xs mt-1.5" aria-label="Søk kommune" />
              <div className="mt-2 max-h-40 overflow-y-auto rounded-lg border border-border/60 p-2 flex flex-wrap gap-1.5">
                {municipalities
                  .filter((m) => m.toLowerCase().includes(municipalitySearch.toLowerCase()))
                  .slice(0, 200)
                  .map((m) => (
                    <button key={m} type="button" onClick={() => toggleIn(setMunicipalityMulti, m)}
                      className={`px-2.5 py-1 rounded-full text-[11px] border transition-colors ${municipalityMulti.includes(m) ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>
                      {m}
                    </button>
                  ))}
                {municipalities.length === 0 && <span className="text-[11px] text-muted-foreground">Ingen kommuner enda</span>}
              </div>
            </div>
          </div>
        </Card>
      )}


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
          <Select onValueChange={(v) => (v === "__ny" ? setFolderDialog(true) : addSelectedToFolder(v))}>
            <SelectTrigger className="w-[150px] h-8 text-xs" aria-label="Legg i mappe"><SelectValue placeholder="Legg i mappe" /></SelectTrigger>
            <SelectContent>
              {folders.map((f) => <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>)}
              <SelectItem value="__ny">+ Ny mappe …</SelectItem>
            </SelectContent>
          </Select>
          {activeFolder !== "alle" && (
            <Button size="sm" variant="outline" onClick={removeSelectedFromFolder}>Fjern fra mappe</Button>
          )}
          <Button size="sm" variant="outline" onClick={() => setSelected([])}>Nullstill</Button>
          <Button size="sm" variant="ghost" className="text-destructive" onClick={removeSelected} aria-label="Slett valgte"><Trash2 size={14} /></Button>
        </div>
      )}

      {/* dense list */}
      <Card className={`overflow-hidden ${fullscreen ? "flex-1 min-h-0 flex flex-col" : ""}`}>
        <div className="grid grid-cols-[28px_minmax(0,2fr)_minmax(0,1.6fr)_110px_90px_130px] items-center gap-2 px-3 py-2 border-b border-border/50 bg-muted/40 text-[10px] uppercase tracking-wide text-muted-foreground">
          <Checkbox checked={allSelected} onCheckedChange={toggleAll} aria-label="Velg alle" />
          <span>Selskap ({total > 1000 ? `ca. ${total.toLocaleString("nb-NO")}` : total})</span>
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
                const reasons = matchReasons(l, search);
                return (
                  <div key={l.id} className="grid grid-cols-[28px_minmax(0,2fr)_minmax(0,1.6fr)_110px_90px_130px] items-center gap-2 px-3 py-1.5 hover:bg-muted/30 transition-colors text-xs">
                    <Checkbox checked={selected.includes(l.id)} onCheckedChange={() => toggle(l.id)} aria-label={`Velg ${l.name}`} />
                    <button className="min-w-0 text-left" onClick={() => openDetail(l)}>
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="font-medium truncate"><Hl text={l.name} term={search} /></span>
                        {l.manual_lock && <Lock size={10} className="text-muted-foreground shrink-0" />}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground truncate">
                        <span><Hl text={l.orgnr} term={search} /></span>
                        {l.org_form && <span>{l.org_form}</span>}
                        {l.municipality && <span className="flex items-center gap-0.5"><MapPin size={9} /><Hl text={l.municipality} term={search} /></span>}
                        {l.registered_at && <span className="flex items-center gap-0.5"><Calendar size={9} />{l.registered_at}</span>}
                      </div>
                      {!!reasons.length && (
                        <div className="flex flex-wrap items-center gap-1 mt-0.5">
                          <span className="text-[9px] text-muted-foreground">Treff i:</span>
                          {reasons.map((r) => (
                            <span key={r} className="text-[9px] px-1.5 py-px rounded-full bg-primary/10 text-primary">{r}</span>
                          ))}
                        </div>
                      )}
                    </button>
                    <div className="min-w-0 text-[10px]">
                      {l.email ? (
                        <a href={`mailto:${l.email}`} className="text-primary truncate block"><Hl text={l.email} term={search} /></a>
                      ) : (
                        <span className="text-muted-foreground/60">ingen e-post{l.enrich_status ? ` · ${l.enrich_status}` : ""}</span>
                      )}
                      <span className="text-muted-foreground truncate block">
                        <Hl text={[l.phone, l.contact_name].filter(Boolean).join(" · ") || "—"} term={search} />
                      </span>
                      <span className={`truncate block ${l.has_accountant ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                        {l.has_accountant ? <>Regnskapsfører: <Hl text={l.accountant_name || "ukjent"} term={search} /></> : "Ingen regnskapsfører registrert"}
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

      {/* eksport */}
      <Dialog open={exportOpen} onOpenChange={setExportOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Eksporter til CSV</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Hva skal eksporteres?</Label>
                <Select value={exportScope} onValueChange={(v) => setExportScope(v as any)}>
                  <SelectTrigger className="mt-1.5 h-9 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="treff">Alle treff i dagens filter</SelectItem>
                    <SelectItem value="side">Denne siden ({leads.length})</SelectItem>
                    <SelectItem value="valgte">Kun valgte ({selected.length})</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {exportScope === "treff" && (
                <div>
                  <Label className="text-xs">Maks antall rader</Label>
                  <Input type="number" min={1} max={50000} value={exportLimit}
                    onChange={(e) => setExportLimit(e.target.value)} className="mt-1.5 h-9 text-sm" />
                  <p className="text-[11px] text-muted-foreground mt-1">Ca. {total.toLocaleString("nb-NO")} treff i filteret nå.</p>
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs">Felter ({exportFields.length} valgt)</Label>
                <div className="flex gap-1.5">
                  <Button size="sm" variant="ghost" className="h-7 text-[11px]"
                    onClick={() => setExportFields(EXPORT_FIELDS.map((f) => f.key))}>Velg alle</Button>
                  <Button size="sm" variant="ghost" className="h-7 text-[11px]"
                    onClick={() => setExportFields(DEFAULT_EXPORT_FIELDS)}>Standard</Button>
                  <Button size="sm" variant="ghost" className="h-7 text-[11px]"
                    onClick={() => setExportFields([])}>Tøm</Button>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
                {Array.from(new Set(EXPORT_FIELDS.map((f) => f.group))).map((group) => (
                  <div key={group}>
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1.5">{group}</p>
                    <div className="space-y-1.5">
                      {EXPORT_FIELDS.filter((f) => f.group === group).map((f) => (
                        <label key={f.key} className="flex items-center gap-2 text-xs cursor-pointer">
                          <Checkbox
                            checked={exportFields.includes(f.key)}
                            onCheckedChange={() =>
                              setExportFields((prev) => prev.includes(f.key) ? prev.filter((k) => k !== f.key) : [...prev, f.key])
                            }
                          />
                          {f.label}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setExportOpen(false)}>Avbryt</Button>
            <Button onClick={runExport} disabled={exporting || !exportFields.length}>
              {exporting ? "Eksporterer …" : "Last ned CSV"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* lagre visning */}
      <Dialog open={saveViewOpen} onOpenChange={setSaveViewOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Lagre søkevisning</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Navn på visningen</Label>
              <Input value={saveViewName} onChange={(e) => setSaveViewName(e.target.value)}
                placeholder="F.eks. AS uten regnskapsfører i Kongsvinger" className="mt-1.5 h-9 text-sm" />
            </div>
            <p className="text-[11px] text-muted-foreground">
              Lagrer søkeord, kategori, status, mappe og alle aktive filtre slik de står nå ({activeFilterCount} aktive filtre).
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveViewOpen(false)}>Avbryt</Button>
            <Button onClick={saveView} disabled={!saveViewName.trim()}>Lagre visning</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ny mappe */}
      <Dialog open={folderDialog} onOpenChange={setFolderDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Ny mappe</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Navn</Label>
              <Input value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="F.eks. Potensielle kunder Kongsvinger" className="mt-1.5 h-9 text-sm" />
            </div>
            <div>
              <Label className="text-xs">Beskrivelse (valgfritt)</Label>
              <Textarea value={newFolderDesc} onChange={(e) => setNewFolderDesc(e.target.value)}
                placeholder="Hva samler du i denne mappen?" className="mt-1.5 text-sm" rows={2} />
            </div>
            {selected.length > 0 && (
              <p className="text-[11px] text-muted-foreground">{selected.length} valgte selskaper legges rett i mappen.</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFolderDialog(false)}>Avbryt</Button>
            <Button onClick={createFolder} disabled={!newFolderName.trim()}>Opprett mappe</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
            <div>
              <Label className="text-xs">Næringsområder (tomt = alle bransjer)</Label>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {INDUSTRY_GROUPS.map((g) => (
                  <button key={g.id} type="button"
                    onClick={() => setSyncIndustryGroups((s) => s.includes(g.id) ? s.filter((x) => x !== g.id) : [...s, g.id])}
                    className={`px-2.5 py-1 rounded-full text-[11px] border transition-colors ${syncIndustryGroups.includes(g.id) ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>
                    {g.label}
                  </button>
                ))}
              </div>
              <Input className="mt-2" placeholder="Egne næringskoder, komma-separert (f.eks. 43.32, 56.10)"
                value={syncIndustryCodes} onChange={(e) => setSyncIndustryCodes(e.target.value)} />
            </div>

            <div>
              <Label className="text-xs">Legg resultatet i mappe</Label>
              <Select value={syncFolderTarget} onValueChange={setSyncFolderTarget}>
                <SelectTrigger className="mt-2 h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ingen">Ingen mappe</SelectItem>
                  {folders.map((f) => <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>)}
                  <SelectItem value="__ny">+ Ny mappe …</SelectItem>
                </SelectContent>
              </Select>
              {syncFolderTarget === "__ny" && (
                <Input className="mt-2" placeholder="Navn på ny mappe (f.eks. Bygg og anlegg Kongsvinger)"
                  value={syncFolderName} onChange={(e) => setSyncFolderName(e.target.value)} />
              )}
            </div>

            <p className="text-[11px] text-muted-foreground">
              Alle selskaper blir liggende permanent i basen. Kontaktinfo du har fylt inn selv, kategori og kontaktstatus blir aldri overskrevet av nye henteoperasjoner.
            </p>

            <div className="rounded-xl border border-border p-3 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold">Full import – alle AS og ENK i Norge</p>
                  <p className="text-[11px] text-muted-foreground">
                    Laster ned hele Enhetsregisteret fra oppstart til i dag (kommune, navn, telefon, e-post, næring m.m.) og fortsetter automatisk hvert 5. minutt til den er ferdig.
                  </p>
                </div>
                <Button size="sm" variant={importState?.status === "running" ? "outline" : "default"} disabled={bulkBusy}
                  onClick={() => bulkImport(importState?.status === "running" ? "stop" : "start")}>
                  {bulkBusy ? <Loader2 size={14} className="mr-2 animate-spin" /> : <Download size={14} className="mr-2" />}
                  {importState?.status === "running" ? "Pause" : "Start full import"}
                </Button>
              </div>
              {importState && (
                <p className="text-[11px] text-muted-foreground">
                  Status: <b className="text-foreground">{importState.status}</b> · {Number(importState.processed || 0).toLocaleString("nb-NO")} enheter lest · {Number(importState.imported || 0).toLocaleString("nb-NO")} nye lagret
                  {importState.error_message ? ` · Feil: ${importState.error_message}` : ""}
                </p>
              )}
            </div>
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Send e-post til {selected.length} selskaper</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-xs">Mal</Label>
              <Select value={mailTemplate} onValueChange={(v) => { setMailTemplate(v); setPreviewIdx(0); }}>
                <SelectTrigger aria-label="Velg mal"><SelectValue placeholder="Velg mal" /></SelectTrigger>
                <SelectContent>
                  {templates.map((t) => <SelectItem key={t.id} value={t.id}>{t.name} · {categoryMeta(t.category).label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Forhåndsvisning av den faktiske e-posten første mottaker får */}
            {mailTemplate && (
              <div className="rounded-xl border border-border/40 overflow-hidden">
                <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 border-b border-border/30 text-xs">
                  <Eye size={13} className="text-primary shrink-0" />
                  <span className="font-medium shrink-0">Forhåndsvisning</span>
                  {mailRecipients.length > 0 ? (
                    <>
                      <span className="truncate text-muted-foreground">
                        {previewLead?.name} · {previewLead?.email}
                      </span>
                      <div className="ml-auto flex items-center gap-1 shrink-0">
                        <span className="text-muted-foreground">{Math.min(previewIdx + 1, mailRecipients.length)}/{mailRecipients.length}</span>
                        <Button size="icon" variant="ghost" className="h-6 w-6" aria-label="Forrige mottaker"
                          disabled={previewIdx <= 0} onClick={() => setPreviewIdx((i) => Math.max(0, i - 1))}>
                          <ChevronLeft size={13} />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-6 w-6" aria-label="Neste mottaker"
                          disabled={previewIdx >= mailRecipients.length - 1} onClick={() => setPreviewIdx((i) => Math.min(mailRecipients.length - 1, i + 1))}>
                          <ChevronRight size={13} />
                        </Button>
                      </div>
                    </>
                  ) : (
                    <span className="text-muted-foreground">Ingen av de valgte selskapene har e-postadresse</span>
                  )}
                </div>
                <div className="px-3 py-2 border-b border-border/30 text-xs">
                  <span className="text-muted-foreground">Emne: </span>
                  <span className="font-medium">{previewMail.subject || "(tomt emne)"}</span>
                </div>
                <iframe
                  title="E-post forhåndsvisning"
                  srcDoc={previewMail.html}
                  className="w-full h-[360px] bg-white"
                  sandbox=""
                />
              </div>
            )}

            <SendPacingControl value={pacing} onChange={setPacing} recipients={mailRecipients.length} />

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
                  body: {
                    mode: "manual",
                    leadIds: selected,
                    templateId: mailTemplate,
                    testEmail: testEmail || undefined,
                    minDelayMinutes: pacing.min,
                    maxDelayMinutes: pacing.max,
                  },
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
              <SheetHeader><SheetTitle className="pr-6"><Hl text={detail.name} term={search} /></SheetTitle></SheetHeader>
              <div className="space-y-4 mt-4 text-sm">
                {!!search.trim() && !!matchReasons(detail, search).length && (
                  <div className="flex flex-wrap items-center gap-1.5 rounded-lg bg-primary/5 border border-primary/20 px-2.5 py-1.5">
                    <Search size={11} className="text-primary" />
                    <span className="text-[11px] text-muted-foreground">Treff på «{search.trim()}» i:</span>
                    {matchReasons(detail, search).map((r) => (
                      <span key={r} className="text-[10px] px-1.5 py-px rounded-full bg-primary/10 text-primary">{r}</span>
                    ))}
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className={categoryMeta(detail.category).color}>{categoryMeta(detail.category).label}</Badge>
                  {detail.org_form_text && <Badge variant="secondary">{detail.org_form_text}</Badge>}
                  {detail.email_source && <Badge variant="outline" className="text-[10px]">Kilde: {detail.email_source}</Badge>}
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <span>Org.nr</span><span className="text-foreground"><Hl text={detail.orgnr} term={search} /></span>
                  <span>Registrert</span><span className="text-foreground">{detail.registered_at || "–"}</span>
                  <span>Bransje</span><span className="text-foreground"><Hl text={detail.industry_text || "–"} term={search} /></span>
                  <span>Adresse</span><span className="text-foreground"><Hl text={[detail.address, detail.postal_code, detail.postal_area].filter(Boolean).join(", ") || "–"} term={search} /></span>
                  <span>Ansatte</span><span className="text-foreground flex items-center gap-1"><Users size={11} />{detail.employees ?? "–"}</span>
                  <span>Daglig leder</span><span className="text-foreground"><Hl text={detail.ceo_name || "–"} term={search} /></span>
                  <span>Styreleder</span><span className="text-foreground">{detail.chair_name || "–"}</span>
                  <span>Eiere / innehaver</span><span className="text-foreground">{detail.owners?.map((o) => o.name).join(", ") || "–"}</span>
                  <span>Regnskapsfører</span><span className="text-foreground"><Hl text={detail.accountant_name || "Ingen registrert"} term={search} /></span>

                  <span>Revisor</span><span className="text-foreground">{detail.has_auditor ? "Ja" : "Nei"}</span>
                  <span>E-post sendt</span><span className="text-foreground">{detail.email_count || 0}{detail.last_emailed_at ? ` · sist ${detail.last_emailed_at.slice(0, 10)}` : ""}</span>
                  <span>Nettsøk</span><span className="text-foreground">{detail.scan_status || detail.enrich_status || "ikke kjørt"}</span>
                </div>

                <Button size="sm" variant="outline" className="w-full" disabled={fullEnriching}
                  onClick={async () => {
                    setFullEnriching(true);
                    try {
                      const { data, error } = await supabase.functions.invoke("crm-enrich-company", { body: { leadIds: [detail.id] } });
                      if (error) throw error;
                      if (data?.error) throw new Error(data.error);
                      const { data: fresh } = await supabase.from("crm_leads").select("*").eq("id", detail.id).maybeSingle();
                      if (fresh) { setDetail(fresh as any); setLeads((ls) => ls.map((l) => (l.id === fresh.id ? (fresh as any) : l))); }
                      toast.success("Kundekortet er oppdatert");
                    } catch (e: any) { toast.error(e.message || "Kunne ikke hente selskapsinfo"); }
                    finally { setFullEnriching(false); }
                  }}>
                  {fullEnriching ? <Loader2 size={14} className="mr-1.5 animate-spin" /> : <Sparkles size={14} className="mr-1.5" />}
                  Hent full selskapsinfo (eier, regnskap, nett)
                </Button>

                {detail.company_summary && (
                  <p className="text-xs text-muted-foreground leading-relaxed border-l-2 border-primary/40 pl-3">{detail.company_summary}</p>
                )}

                {/* Regnskapstall */}
                <div>
                  <Label className="text-xs flex items-center gap-1.5"><TrendingUp size={12} />Regnskap{detail.fiscal_year ? ` ${detail.fiscal_year}` : ""}</Label>
                  {detail.fiscal_year ? (
                    <>
                      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mt-1.5">
                        <span>Driftsinntekter</span><span className="text-foreground">{nok(detail.revenue)}</span>
                        <span>Driftsresultat</span><span className="text-foreground">{nok(detail.operating_result)}</span>
                        <span>Resultat før skatt</span><span className="text-foreground">{nok(detail.profit_before_tax)}</span>
                        <span>Årsresultat</span><span className={`font-medium ${(detail.net_result ?? 0) < 0 ? "text-destructive" : "text-foreground"}`}>{nok(detail.net_result)}</span>
                        <span>Egenkapital</span><span className="text-foreground">{nok(detail.equity)}</span>
                        <span>Sum eiendeler</span><span className="text-foreground">{nok(detail.total_assets)}</span>
                        <span>Sum gjeld</span><span className="text-foreground">{nok(detail.total_debt)}</span>
                      </div>
                      {!!detail.financials?.length && detail.financials.length > 1 && (
                        <div className="mt-2 text-[11px] text-muted-foreground space-y-0.5">
                          {detail.financials.slice(1).map((f) => (
                            <div key={f.year} className="flex justify-between gap-2">
                              <span>{f.year}</span>
                              <span>Oms. {nok(f.revenue)} · Res. {nok(f.net_result)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-xs text-muted-foreground mt-1">
                      {detail.financials_fetched_at ? "Ingen regnskap publisert (typisk ENK eller nystartet)" : "Ikke hentet enda"}
                    </p>
                  )}
                </div>

                {detail.website && (
                  <a href={detail.website.startsWith("http") ? detail.website : `https://${detail.website}`} target="_blank" rel="noopener"
                    className="flex items-center gap-2 text-xs text-primary"><Globe size={12} />{detail.website}<ExternalLink size={10} /></a>
                )}
                {detail.social_links && (
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(detail.social_links).map(([k, v]) => (
                      <a key={k} href={v} target="_blank" rel="noopener" className="text-[10px] px-2 py-1 rounded-full border text-primary capitalize">{k}</a>
                    ))}
                  </div>
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
