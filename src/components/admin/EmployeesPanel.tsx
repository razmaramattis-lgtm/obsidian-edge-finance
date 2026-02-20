import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Edit2, Check, X, UserPlus } from "lucide-react";

interface Employee {
  id: string;
  user_id: string;
  name: string;
  email: string;
  role: "admin" | "employee";
  created_at: string;
}

const EmployeesPanel = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<"admin" | "employee">("employee");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

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

  const deleteEmployee = async (id: string) => {
    if (!confirm("Er du sikker på at du vil slette denne ansatte?")) return;
    await supabase.from("profiles").delete().eq("id", id);
    fetchEmployees();
  };

  if (loading) return <div className="text-muted-foreground text-sm">Laster ansatte…</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">{employees.length} ansatte registrert</p>
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
          <h3 className="font-medium text-sm mb-4">Ny ansatt</h3>
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
        {employees.map(emp => (
          <div key={emp.id} className="glass rounded-2xl px-5 py-4 border border-border/20 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{emp.name}</p>
              <p className="text-xs text-muted-foreground">{emp.email}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-full border ${emp.role === "admin" ? "border-primary/30 text-primary bg-primary/10" : "border-border/30 text-muted-foreground"}`}>
                {emp.role === "admin" ? "Admin" : "Ansatt"}
              </span>
              <button onClick={() => deleteEmployee(emp.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeesPanel;
