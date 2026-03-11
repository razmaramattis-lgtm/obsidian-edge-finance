import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Send, Users, Search, X, UserPlus } from "lucide-react";

const SmsSendPanel = () => {
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [templateId, setTemplateId] = useState<string>("");
  const [templates, setTemplates] = useState<any[]>([]);
  const [sending, setSending] = useState(false);
  const [progress, setProgress] = useState(0);

  const [contacts, setContacts] = useState<any[]>([]);
  const [contactSearch, setContactSearch] = useState("");
  const [showContacts, setShowContacts] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    Promise.all([
      supabase.from("sms_templates").select("*").order("name"),
      supabase.from("sms_contacts").select("*").order("name"),
    ]).then(([tRes, cRes]) => {
      setTemplates(tRes.data || []);
      setContacts(cRes.data || []);
    });
  }, []);

  const handleTemplateSelect = (id: string) => {
    setTemplateId(id);
    if (id === "none") return;
    const t = templates.find(t => t.id === id);
    if (t) setMessage(t.content);
  };

  const toggleContact = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectAll = () => setSelectedIds(new Set(filteredContacts.map(c => c.id)));
  const clearSelection = () => setSelectedIds(new Set());

  const selectedContacts = useMemo(() => contacts.filter(c => selectedIds.has(c.id)), [contacts, selectedIds]);

  const filteredContacts = useMemo(() => {
    if (!contactSearch.trim()) return contacts;
    const q = contactSearch.toLowerCase();
    return contacts.filter(c =>
      c.name?.toLowerCase().includes(q) || c.phone?.includes(q)
    );
  }, [contacts, contactSearch]);

  const allPhones = useMemo(() => {
    const fromContacts = selectedContacts.map(c => c.phone).filter(Boolean);
    const manual = phone.trim() ? [phone.trim()] : [];
    return [...new Set([...fromContacts, ...manual])];
  }, [selectedContacts, phone]);

  const handleSend = async () => {
    if (!message.trim()) { toast.error("Melding er påkrevd"); return; }
    if (allPhones.length === 0) { toast.error("Ingen mottakere valgt"); return; }

    setSending(true);
    setProgress(0);

    const rows = allPhones.map(p => ({ phone: p, message: message.trim(), status: "queued" as const }));
    const batchSize = 50;
    let done = 0;
    for (let i = 0; i < rows.length; i += batchSize) {
      await supabase.from("sms_messages").insert(rows.slice(i, i + batchSize));
      done += Math.min(batchSize, rows.length - i);
      setProgress(Math.round((done / rows.length) * 100));
    }

    setSending(false);
    toast.success(`${allPhones.length} SMS lagt i kø`);
    setPhone(""); setMessage(""); setTemplateId("");
    clearSelection();
    setProgress(0);
  };

  return (
    <div className="max-w-lg space-y-5">
      {/* Recipients */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Mottakere</Label>
          <Button type="button" variant="ghost" size="sm" className="h-7 gap-1.5 text-xs text-primary" onClick={() => setShowContacts(!showContacts)}>
            <UserPlus size={13} />
            {showContacts ? "Skjul kontakter" : "Velg kontakter"}
          </Button>
        </div>

        {/* Selected chips */}
        {selectedContacts.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {selectedContacts.slice(0, 15).map(c => (
              <Badge key={c.id} variant="outline" className="gap-1 text-xs pr-1 cursor-pointer hover:bg-destructive/10" onClick={() => toggleContact(c.id)}>
                {c.name} <X size={10} />
              </Badge>
            ))}
            {selectedContacts.length > 15 && (
              <Badge variant="secondary" className="text-xs">+{selectedContacts.length - 15} til</Badge>
            )}
            <Button size="sm" variant="ghost" className="h-5 text-[10px] text-destructive px-1.5" onClick={clearSelection}>Fjern alle</Button>
          </div>
        )}

        {/* Contact picker */}
        {showContacts && (
          <div className="border border-border/20 rounded-lg bg-background shadow-sm">
            <div className="p-2 border-b border-border/10 flex items-center gap-2">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Søk kontakter..." value={contactSearch} onChange={e => setContactSearch(e.target.value)} className="h-8 pl-8 text-xs" />
              </div>
              <Button size="sm" variant="outline" className="h-8 text-xs shrink-0" onClick={selectAll}>Velg alle</Button>
            </div>
            <ScrollArea className="max-h-[220px]">
              {filteredContacts.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">Ingen kontakter funnet</p>
              ) : (
                <div className="p-1 space-y-0.5">
                  {filteredContacts.map(c => (
                    <label key={c.id} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors">
                      <Checkbox checked={selectedIds.has(c.id)} onCheckedChange={() => toggleContact(c.id)} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{c.name}</p>
                        <p className="text-xs font-mono text-muted-foreground">{c.phone}</p>
                      </div>
                      {c.tags?.length > 0 && (
                        <div className="hidden sm:flex gap-1">
                          {c.tags.slice(0, 2).map((t: string) => (
                            <Badge key={t} variant="secondary" className="text-[9px]">{t}</Badge>
                          ))}
                        </div>
                      )}
                    </label>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        )}

        {/* Manual phone */}
        <Input placeholder="Eller skriv nummer manuelt: +47 XXX XX XXX" value={phone} onChange={e => setPhone(e.target.value)} className="text-sm" />
        <p className="text-xs text-muted-foreground">{allPhones.length} mottaker{allPhones.length !== 1 ? "e" : ""} totalt</p>
      </div>

      <div className="space-y-2">
        <Label>Mal (valgfri)</Label>
        <Select value={templateId} onValueChange={handleTemplateSelect}>
          <SelectTrigger><SelectValue placeholder="Velg mal..." /></SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Ingen mal</SelectItem>
            {templates.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Melding</Label>
        <Textarea rows={4} placeholder="Skriv din SMS-melding her..." value={message} onChange={e => setMessage(e.target.value)} />
        <p className="text-xs text-muted-foreground">{message.length} tegn · {Math.ceil(message.length / 160) || 1} SMS</p>
      </div>

      {sending && <Progress value={progress} className="h-2" />}

      <Button onClick={handleSend} disabled={sending || allPhones.length === 0} className="gap-2">
        <Send size={14} />
        {sending ? `Legger i kø (${progress}%)...` : `Send til ${allPhones.length} mottaker${allPhones.length !== 1 ? "e" : ""}`}
      </Button>
    </div>
  );
};

export default SmsSendPanel;
