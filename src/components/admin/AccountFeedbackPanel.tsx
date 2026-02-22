import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Search, Trash2, Check, AlertTriangle, ChevronDown, ChevronUp,
  Edit2, Save, X, Tag, Plus, Loader2
} from "lucide-react";

interface AccountData {
  id: string;
  account_number: string;
  name: string;
  description: string | null;
  examples: string[] | null;
  tags: string[];
  slug: string;
}

const AccountFeedbackPanel = ({ onStatusChange }: { onStatusChange?: () => void }) => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [accountData, setAccountData] = useState<Record<string, AccountData>>({});
  const [editingAccountId, setEditingAccountId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{
    description: string;
    examples: string[];
    tags: string[];
  }>({ description: "", examples: [], tags: [] });
  const [tagInput, setTagInput] = useState("");
  const [exampleInput, setExampleInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [adminNote, setAdminNote] = useState<Record<string, string>>({});

  const load = async () => {
    const { data } = await supabase
      .from("account_feedback" as any)
      .select("*")
      .order("created_at", { ascending: false });
    setItems((data as any[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const fetchAccount = async (accountNumber: string) => {
    if (accountData[accountNumber]) return;
    const { data } = await supabase
      .from("account_entries")
      .select("id, account_number, name, description, examples, tags, slug")
      .eq("account_number", accountNumber)
      .single();
    if (data) {
      setAccountData(prev => ({ ...prev, [accountNumber]: data as AccountData }));
    }
  };

  const toggleExpand = async (id: string, accountNumber?: string) => {
    if (expandedId === id) {
      setExpandedId(null);
      setEditingAccountId(null);
    } else {
      setExpandedId(id);
      setEditingAccountId(null);
      if (accountNumber) await fetchAccount(accountNumber);
    }
  };

  const startEditing = (acc: AccountData) => {
    setEditingAccountId(acc.id);
    setEditForm({
      description: acc.description || "",
      examples: acc.examples || [],
      tags: acc.tags || [],
    });
    setTagInput("");
    setExampleInput("");
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !editForm.tags.includes(tag)) {
      setEditForm(prev => ({ ...prev, tags: [...prev.tags, tag] }));
    }
    setTagInput("");
  };

  const removeTag = (tag: string) =>
    setEditForm(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));

  const addExample = () => {
    const ex = exampleInput.trim();
    if (ex && !editForm.examples.includes(ex)) {
      setEditForm(prev => ({ ...prev, examples: [...prev.examples, ex] }));
    }
    setExampleInput("");
  };

  const removeExample = (ex: string) =>
    setEditForm(prev => ({ ...prev, examples: prev.examples.filter(e => e !== ex) }));

  const saveAccountChanges = async (accountNumber: string, feedbackId: string) => {
    setSaving(true);
    const acc = accountData[accountNumber];
    if (!acc) { setSaving(false); return; }

    const { error } = await supabase
      .from("account_entries")
      .update({
        description: editForm.description,
        examples: editForm.examples,
        tags: editForm.tags,
      })
      .eq("id", acc.id);

    if (error) {
      toast.error("Kunne ikke lagre endringer");
      setSaving(false);
      return;
    }

    // Update local cache
    setAccountData(prev => ({
      ...prev,
      [accountNumber]: { ...acc, description: editForm.description, examples: editForm.examples, tags: editForm.tags },
    }));

    // Mark feedback as handled with optional admin note
    const note = adminNote[feedbackId] || "";
    await supabase.from("account_feedback" as any)
      .update({ status: "handled", admin_note: note || `Konto ${accountNumber} oppdatert` } as any)
      .eq("id", feedbackId);

    toast.success(`Konto ${accountNumber} oppdatert og melding behandlet`);
    setEditingAccountId(null);
    setSaving(false);
    load();
    onStatusChange?.();
  };

  const markHandled = async (id: string) => {
    const note = adminNote[id] || "";
    await supabase.from("account_feedback" as any)
      .update({ status: "handled", admin_note: note || null } as any)
      .eq("id", id);
    toast.success("Markert som behandlet");
    load();
    onStatusChange?.();
  };

  const del = async (id: string) => {
    await supabase.from("account_feedback" as any).delete().eq("id", id);
    toast.success("Slettet");
    load();
    onStatusChange?.();
  };

  if (loading) return <div className="text-muted-foreground text-sm">Laster…</div>;

  const pending = items.filter(i => i.status === "new");
  const handled = items.filter(i => i.status !== "new");

  const renderAccountEditor = (item: any) => {
    const acc = accountData[item.top_result_account];
    if (!acc) return <Loader2 size={14} className="animate-spin text-muted-foreground my-3" />;

    const isEditing = editingAccountId === acc.id;

    return (
      <div className="mt-3 space-y-3 rounded-xl border border-border/20 bg-muted/10 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono bg-primary/10 text-primary px-1.5 py-0.5 rounded">{acc.account_number}</span>
            <span className="text-sm font-medium">{acc.name}</span>
          </div>
          {!isEditing ? (
            <button
              onClick={() => startEditing(acc)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-xl text-xs hover:bg-primary/20 transition-colors"
            >
              <Edit2 size={12} /> Rediger konto
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => saveAccountChanges(acc.account_number, item.id)}
                disabled={saving}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-xl text-xs hover:opacity-90 disabled:opacity-50"
              >
                {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                Lagre og behandle
              </button>
              <button
                onClick={() => setEditingAccountId(null)}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-border/30 rounded-xl text-xs hover:bg-muted/50"
              >
                <X size={12} /> Avbryt
              </button>
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-3">
            {/* Description */}
            <div>
              <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Beskrivelse</label>
              <textarea
                value={editForm.description}
                onChange={e => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                rows={6}
                className="w-full mt-1 rounded-xl border border-border/30 bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            {/* Examples */}
            <div>
              <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Eksempler ({editForm.examples.length})</label>
              <div className="flex gap-2 mt-1">
                <input
                  value={exampleInput}
                  onChange={e => setExampleInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addExample(); } }}
                  placeholder="Skriv et eksempel…"
                  className="flex-1 h-8 rounded-xl border border-border/30 bg-muted/30 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                <button type="button" onClick={addExample} className="px-2.5 py-1 rounded-xl text-[10px] bg-primary/10 text-primary hover:bg-primary/20">
                  <Plus size={12} />
                </button>
              </div>
              {editForm.examples.length > 0 && (
                <div className="space-y-1 mt-1.5">
                  {editForm.examples.map((ex, i) => (
                    <div key={i} className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-muted/30 border border-border/10 text-xs">
                      <span className="text-[9px] text-muted-foreground/50 shrink-0">{i + 1}.</span>
                      <span className="flex-1 text-muted-foreground">{ex}</span>
                      <button onClick={() => removeExample(ex)} className="text-muted-foreground/40 hover:text-destructive shrink-0">
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tags */}
            <div>
              <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <Tag size={10} /> Tags ({editForm.tags.length})
              </label>
              <div className="flex gap-2 mt-1">
                <input
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                  placeholder="Skriv en tag…"
                  className="flex-1 h-8 rounded-xl border border-border/30 bg-muted/30 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                <button type="button" onClick={addTag} className="px-2.5 py-1 rounded-xl text-[10px] bg-primary/10 text-primary hover:bg-primary/20">
                  <Plus size={12} />
                </button>
              </div>
              {editForm.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {editForm.tags.map(tag => (
                    <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-primary/10 text-primary text-[10px]">
                      {tag}
                      <button onClick={() => removeTag(tag)} className="hover:text-destructive"><X size={9} /></button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Admin note */}
            <div>
              <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Notat (valgfritt)</label>
              <input
                value={adminNote[item.id] || ""}
                onChange={e => setAdminNote(prev => ({ ...prev, [item.id]: e.target.value }))}
                placeholder="Hva ble gjort…"
                className="w-full mt-1 h-8 rounded-xl border border-border/30 bg-muted/30 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-2 text-xs">
            <div>
              <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">Beskrivelse</p>
              <p className="text-muted-foreground line-clamp-3">{acc.description || "Ingen beskrivelse"}</p>
            </div>
            <div className="flex gap-4">
              <div>
                <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">Eksempler</p>
                <p className="text-muted-foreground">{(acc.examples || []).length} stk</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">Tags</p>
                <p className="text-muted-foreground">{(acc.tags || []).length} stk</p>
              </div>
            </div>
            {(acc.tags || []).length > 0 && (
              <div className="flex flex-wrap gap-1">
                {acc.tags.slice(0, 8).map(t => (
                  <span key={t} className="text-[9px] px-1.5 py-0.5 rounded bg-muted/50 text-muted-foreground/60">{t}</span>
                ))}
                {acc.tags.length > 8 && <span className="text-[9px] text-muted-foreground/40">+{acc.tags.length - 8}</span>}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        {items.length} tilbakemeldinger ({pending.length} ubehandlet)
      </p>

      {pending.length === 0 && handled.length === 0 && (
        <div className="glass rounded-2xl p-8 border border-border/20 text-center">
          <AlertTriangle size={32} className="text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Ingen tilbakemeldinger ennå.</p>
        </div>
      )}

      {pending.length > 0 && (
        <div>
          <h3 className="font-heading text-base mb-3 flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-500" />
            Ubehandlet ({pending.length})
          </h3>
          <div className="space-y-2">
            {pending.map(item => (
              <div key={item.id} className="glass rounded-2xl border border-primary/20 overflow-hidden">
                <div
                  className="flex items-start justify-between gap-3 p-5 cursor-pointer hover:bg-muted/10 transition-colors"
                  onClick={() => toggleExpand(item.id, item.top_result_account)}
                >
                  <div className="flex-1 space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Search size={13} className="text-primary shrink-0" />
                      <p className="text-sm font-medium">Søkeord: «{item.search_term}»</p>
                      {expandedId === item.id ? <ChevronUp size={13} className="text-muted-foreground/50" /> : <ChevronDown size={13} className="text-muted-foreground/50" />}
                    </div>
                    {item.top_result_account && (
                      <p className="text-xs text-muted-foreground">
                        Konto: <span className="font-mono text-foreground/80">{item.top_result_account}</span> – {item.top_result_name}
                      </p>
                    )}
                    {item.message && !expandedId && (
                      <p className="text-xs text-foreground/80 line-clamp-1">«{item.message}»</p>
                    )}
                    <p className="text-[10px] text-muted-foreground">
                      {new Date(item.created_at).toLocaleDateString("no-NO", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium shrink-0 text-amber-600 bg-amber-500/10">
                    Ny
                  </span>
                </div>

                {expandedId === item.id && (
                  <div className="px-5 pb-5 space-y-3 border-t border-border/10">
                    {/* Full message */}
                    {item.message && (
                      <div className="mt-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
                        <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wider mb-1">Melding fra bruker</p>
                        <p className="text-sm text-foreground">{item.message}</p>
                      </div>
                    )}

                    {/* Account editor */}
                    {item.top_result_account && renderAccountEditor(item)}

                    {/* Action buttons */}
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => markHandled(item.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-600 rounded-xl text-xs hover:bg-emerald-500/20"
                      >
                        <Check size={13} /> Behandlet uten endring
                      </button>
                      <button
                        onClick={() => del(item.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-destructive/10 text-destructive rounded-xl text-xs hover:bg-destructive/20"
                      >
                        <Trash2 size={13} /> Slett
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {handled.length > 0 && (
        <div>
          <h3 className="font-heading text-base mb-3 text-muted-foreground">Behandlet ({handled.length})</h3>
          <div className="space-y-2">
            {handled.map(item => (
              <div key={item.id} className="glass rounded-2xl px-5 py-3 border border-border/20 flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-sm truncate">«{item.search_term}»</p>
                  <div className="flex items-center gap-2">
                    {item.top_result_account && (
                      <p className="text-[10px] text-muted-foreground">{item.top_result_account} – {item.top_result_name}</p>
                    )}
                    {item.admin_note && (
                      <p className="text-[10px] text-primary/60 truncate">• {item.admin_note}</p>
                    )}
                  </div>
                </div>
                <button onClick={() => del(item.id)} className="text-muted-foreground/40 hover:text-destructive transition-colors shrink-0">
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountFeedbackPanel;
