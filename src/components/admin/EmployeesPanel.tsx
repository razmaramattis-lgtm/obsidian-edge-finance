import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, UserPlus, ChevronLeft, Shield, ShieldOff, User, Mail, Phone, Briefcase, Sparkles, X, UserX, UserCheck, Check, Key } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Employee {
  id: string;
  user_id: string;
  name: string;
  email: string;
  role: "admin" | "employee";
  phone: string | null;
  title: string | null;
  specialty: string | null;
  bio: string | null;
  avatar_url: string | null;
  booking_active: boolean;
  teams_link: string | null;
  created_at: string;
  active: boolean;
}

const GRANTABLE_PANELS = [
  { key: "customers", label: "Kundearkiv", group: "Hoved" },
  { key: "collab", label: "Samarbeidsavtaler", group: "Hoved" },
  { key: "bookings", label: "1-1 Bookinger", group: "Hoved" },
  { key: "contact_submissions", label: "Henvendelser", group: "Kunder" },
  { key: "employee_invitations", label: "Ansattinvitasjoner", group: "Kunder" },
  { key: "advisor_requests", label: "Rådgiverforespørsler", group: "Kunder" },
  { key: "partner_requests", label: "Avtaleforespørsler", group: "Avtaler" },
  { key: "benefit_applications", label: "Fordelsavtale-søknader", group: "Avtaler" },
  { key: "blog", label: "Blogg & Nyheter", group: "Innhold" },
  { key: "page_changes", label: "Sideendringer", group: "Innhold" },
  { key: "org_resources", label: "Organisasjonsressurser", group: "Innhold" },
  { key: "hr", label: "HR & Personal", group: "Internt" },
  { key: "internal", label: "Interne ressurser", group: "Internt" },
];

const EmployeesPanel = () => {
  const { profile: currentProfile } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [empSpecialties, setEmpSpecialties] = useState<{id: string; name: string; description: string | null}[]>([]);
  const [empPanels, setEmpPanels] = useState<string[]>([]);
  const [savingPanel, setSavingPanel] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<"admin" | "employee">("employee");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);
  const [deleting, setDeleting] = useState(false);
  const fetchEmployees = async () => {
    const { data } = await supabase.from("profiles").select("*").order("created_at");
    setEmployees((data as Employee[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchEmployees(); }, []);

  const addEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    setError("");
    try {
      const session = (await supabase.auth.getSession()).data.session;
      if (!session) { setError("Ikke innlogget."); setAdding(false); return; }
      const res = await supabase.functions.invoke("create-employee", {
        body: { email: newEmail, password: newPassword, name: newName, role: newRole },
      });
      if (res.error || res.data?.error) {
        setError(res.data?.error || "Noe gikk galt.");
      } else {
        setShowAdd(false);
        setNewName(""); setNewEmail(""); setNewPassword(""); setNewRole("employee");
        fetchEmployees();
      }
    } catch {
      setError("Noe gikk galt. Prøv igjen.");
    }
    setAdding(false);
  };

  const deleteEmployee = async (emp: Employee) => {
    setDeleting(true);
    try {
      const res = await supabase.functions.invoke("delete-user", {
        body: { userId: emp.user_id },
      });
      if (res.error || res.data?.error) {
        alert(res.data?.error || "Kunne ikke slette brukeren.");
      } else {
        if (selectedEmployee?.id === emp.id) setSelectedEmployee(null);
        fetchEmployees();
      }
    } catch {
      alert("Noe gikk galt ved sletting.");
    }
    setDeleting(false);
    setDeleteTarget(null);
  };

  const toggleActive = async (emp: Employee) => {
    const newActive = !emp.active;
    await supabase.from("profiles").update({ active: newActive } as any).eq("id", emp.id);
    setEmployees(prev => prev.map(e => e.id === emp.id ? { ...e, active: newActive } : e));
    if (selectedEmployee?.id === emp.id) setSelectedEmployee(prev => prev ? { ...prev, active: newActive } : null);
  };

  const toggleRole = async (emp: Employee) => {
    if (emp.id === currentProfile?.id) return;
    const newRole = emp.role === "admin" ? "employee" : "admin";
    await supabase.from("profiles").update({ role: newRole } as any).eq("id", emp.id);
    setEmployees(prev => prev.map(e => e.id === emp.id ? { ...e, role: newRole } : e));
    if (selectedEmployee?.id === emp.id) setSelectedEmployee(prev => prev ? { ...prev, role: newRole } : null);
  };

  const loadSpecialties = async (profileId: string) => {
    const { data } = await supabase.from("profile_specialties").select("*").eq("profile_id", profileId).order("sort_order");
    setEmpSpecialties((data || []) as any);
  };

  const loadPanelAccess = async (profileId: string) => {
    const { data } = await supabase.from("employee_panel_access").select("panel_key").eq("profile_id", profileId);
    setEmpPanels((data || []).map((d: any) => d.panel_key));
  };

  const togglePanelAccess = async (empId: string, panelKey: string) => {
    setSavingPanel(true);
    const has = empPanels.includes(panelKey);
    if (has) {
      await supabase.from("employee_panel_access").delete().eq("profile_id", empId).eq("panel_key", panelKey);
      setEmpPanels(prev => prev.filter(p => p !== panelKey));
    } else {
      await supabase.from("employee_panel_access").insert({ profile_id: empId, panel_key: panelKey, granted_by: currentProfile?.id });
      setEmpPanels(prev => [...prev, panelKey]);
    }
    setSavingPanel(false);
  };

  const selectEmployee = (emp: Employee) => {
    setSelectedEmployee(emp);
    loadSpecialties(emp.id);
    loadPanelAccess(emp.id);
  };

  const filtered = employees.filter(e => {
    if (!search) return true;
    const q = search.toLowerCase();
    return e.name.toLowerCase().includes(q) || e.email.toLowerCase().includes(q) || (e.title || "").toLowerCase().includes(q);
  });

  if (loading) return <div className="text-muted-foreground text-sm">Laster ansatte…</div>;

  // ── Employee detail view ──
  if (selectedEmployee) {
    const emp = selectedEmployee;
    return (
      <div className="space-y-6">
        <button onClick={() => setSelectedEmployee(null)} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft size={14} /> Tilbake til ansattliste
        </button>

        <div className="glass rounded-2xl border border-border/20 p-6">
          <div className="flex items-start gap-5">
            <Avatar className="w-20 h-20 border-2 border-border/20">
              <AvatarImage src={emp.avatar_url || ""} />
              <AvatarFallback className="text-2xl font-medium bg-primary/10 text-primary">
                {emp.name?.charAt(0)?.toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-medium text-lg">{emp.name}</h3>
              <p className="text-sm text-muted-foreground">{emp.email}</p>
              {emp.title && <p className="text-xs text-muted-foreground mt-0.5">{emp.title}</p>}
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-[10px] tracking-widest uppercase px-2.5 py-0.5 rounded-full border ${emp.role === "admin" ? "border-primary/30 text-primary bg-primary/10" : "border-border/30 text-muted-foreground"}`}>
                  {emp.role === "admin" ? "Administrator" : "Ansatt"}
                </span>
                {!emp.active && (
                  <span className="text-[10px] tracking-widest uppercase px-2.5 py-0.5 rounded-full border border-destructive/30 text-destructive bg-destructive/10">
                    Inaktiv
                  </span>
                )}
                {emp.booking_active && (
                  <span className="text-[10px] tracking-widest uppercase px-2.5 py-0.5 rounded-full border border-green-500/30 text-green-600 bg-green-500/10">
                    Tilgjengelig for booking
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {emp.id !== currentProfile?.id && (
                <>
                  <button
                    onClick={() => toggleActive(emp)}
                    className={`h-9 px-4 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${
                      emp.active
                        ? "bg-muted text-muted-foreground hover:bg-muted/80 border border-border/30"
                        : "bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20"
                    }`}
                  >
                    {emp.active ? <><UserX size={13} /> Sett inaktiv</> : <><UserCheck size={13} /> Aktiver</>}
                  </button>
                  <button
                    onClick={() => toggleRole(emp)}
                    className={`h-9 px-4 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${
                      emp.role === "admin"
                        ? "bg-muted text-muted-foreground hover:bg-muted/80 border border-border/30"
                        : "bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20"
                    }`}
                  >
                    {emp.role === "admin" ? <><ShieldOff size={13} /> Gjør til ansatt</> : <><Shield size={13} /> Gjør til admin</>}
                  </button>
                </>
              )}
              <button onClick={() => setDeleteTarget(emp)} className="h-9 px-4 rounded-xl text-xs font-medium flex items-center gap-1.5 bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20 transition-all">
                <Trash2 size={13} /> Slett
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass rounded-2xl border border-border/20 p-5 space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-2"><User size={14} className="text-primary" /> Kontaktinformasjon</h4>
            <div className="space-y-2">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">E-post</p>
                <p className="text-sm">{emp.email}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Telefon</p>
                <p className="text-sm">{emp.phone || "Ikke angitt"}</p>
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl border border-border/20 p-5 space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-2"><Briefcase size={14} className="text-primary" /> Stilling & kompetanse</h4>
            <div className="space-y-2">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Stillingstittel</p>
                <p className="text-sm">{emp.title || "Ikke angitt"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Specialties */}
        {empSpecialties.length > 0 && (
          <div className="glass rounded-2xl border border-border/20 p-5 space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-2"><Sparkles size={14} className="text-primary" /> Spesialfelt</h4>
            <div className="space-y-2">
              {empSpecialties.map(spec => (
                <div key={spec.id} className="rounded-xl border border-border/10 bg-muted/10 p-3">
                  <p className="text-sm font-medium">{spec.name}</p>
                  {spec.description && <p className="text-xs text-muted-foreground mt-1">{spec.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {emp.bio && (
          <div className="glass rounded-2xl border border-border/20 p-5">
            <h4 className="text-sm font-medium mb-2">Biografi</h4>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{emp.bio}</p>
          </div>
        )}

        {emp.teams_link && (
          <div className="glass rounded-2xl border border-border/20 p-5">
            <h4 className="text-sm font-medium mb-2">Teams-lenke</h4>
            <a href={emp.teams_link} target="_blank" rel="noopener noreferrer" className="text-sm text-primary underline break-all">{emp.teams_link}</a>
          </div>
        )}

        {/* Panel Access */}
        {emp.id !== currentProfile?.id && (
          <div className="glass rounded-2xl border border-border/20 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Key size={14} className="text-primary" />
              <h4 className="text-sm font-medium">Paneltilganger</h4>
              <span className="text-[10px] text-muted-foreground ml-auto">{empPanels.length} tilganger</span>
            </div>
            <p className="text-xs text-muted-foreground">Velg hvilke paneler denne ansatte skal ha tilgang til i admin-dashbordet.</p>
            <div className="space-y-3">
              {[...new Set(GRANTABLE_PANELS.map(p => p.group))].map(group => (
                <div key={group}>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5">{group}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {GRANTABLE_PANELS.filter(p => p.group === group).map(panel => {
                      const active = empPanels.includes(panel.key);
                      return (
                        <button
                          key={panel.key}
                          onClick={() => togglePanelAccess(emp.id, panel.key)}
                          disabled={savingPanel}
                          className={`px-2.5 py-1 rounded-lg text-[11px] border transition-all ${active ? "bg-primary/15 border-primary/30 text-primary" : "bg-muted/20 border-border/15 text-muted-foreground hover:border-primary/20 hover:text-foreground"}`}
                        >
                          {active && <Check size={10} className="inline mr-1" />}
                          {panel.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="glass rounded-2xl border border-border/20 p-5">
          <p className="text-[10px] text-muted-foreground">Opprettet: {new Date(emp.created_at).toLocaleDateString("nb-NO", { day: "numeric", month: "long", year: "numeric" })}</p>
        </div>
      </div>
    );
  }

  // ── List view ──
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1">
          <p className="text-muted-foreground text-sm shrink-0">{employees.length} ansatte</p>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Søk etter navn, e-post…"
            className="flex-1 max-w-xs h-9 rounded-xl border border-border/30 bg-muted/30 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm glow-rose hover:opacity-90 transition-all"
        >
          <UserPlus size={14} />
          Legg til ansatt
        </button>
      </div>

      {showAdd && (
        <form onSubmit={addEmployee} className="glass rounded-2xl p-5 border border-border/20 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-sm">Ny ansatt</h3>
            <button type="button" onClick={() => setShowAdd(false)} className="text-muted-foreground hover:text-foreground"><X size={14} /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Fullt navn" required
              className="h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
            <input value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="E-post" type="email" required
              className="h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
            <input value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Midlertidig passord" type="password" required
              className="h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
            <select value={newRole} onChange={e => setNewRole(e.target.value as "admin" | "employee")}
              className="h-10 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
              <option value="employee">Ansatt</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
          {error && <p className="text-destructive text-xs">{error}</p>}
          <div className="flex gap-2">
            <button type="submit" disabled={adding} className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm hover:opacity-90 disabled:opacity-50">
              {adding ? "Legger til…" : "Legg til"}
            </button>
            <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 rounded-xl text-sm border border-border/30 hover:bg-muted/50">
              Avbryt
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {filtered.map(emp => (
          <div
            key={emp.id}
            onClick={() => selectEmployee(emp)}
            className="glass rounded-2xl px-5 py-4 border border-border/20 flex items-center justify-between cursor-pointer hover:border-primary/20 hover:bg-primary/[0.02] transition-all"
          >
            <div className="flex items-center gap-3">
              <Avatar className="w-9 h-9 border border-border/20">
                <AvatarImage src={emp.avatar_url || ""} />
                <AvatarFallback className="text-xs font-medium bg-primary/10 text-primary">
                  {emp.name?.charAt(0)?.toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{emp.name}</p>
                <p className="text-xs text-muted-foreground">{emp.email}{emp.title ? ` · ${emp.title}` : ""}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {!emp.active && (
                <span className="text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-full border border-destructive/30 text-destructive bg-destructive/10">
                  Inaktiv
                </span>
              )}
              <span className={`text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-full border ${emp.role === "admin" ? "border-primary/30 text-primary bg-primary/10" : "border-border/30 text-muted-foreground"}`}>
                {emp.role === "admin" ? "Admin" : "Ansatt"}
              </span>
              <button
                onClick={e => { e.stopPropagation(); setDeleteTarget(emp); }}
                className="text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-center text-sm text-muted-foreground py-8">Ingen ansatte funnet</p>}
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={open => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Slett bruker permanent?</AlertDialogTitle>
            <AlertDialogDescription>
              Dette vil permanent slette <strong>{deleteTarget?.name}</strong> ({deleteTarget?.email}) fra systemet.
              Brukeren mister all tilgang og e-postadressen kan brukes på nytt.
              Denne handlingen kan ikke angres.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Avbryt</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTarget && deleteEmployee(deleteTarget)}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Sletter…" : "Slett permanent"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EmployeesPanel;