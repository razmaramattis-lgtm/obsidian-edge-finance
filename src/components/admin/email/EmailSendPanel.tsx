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
import { Send, Mail, Users, Search, X, UserPlus } from "lucide-react";

const EmailSendPanel = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [templates, setTemplates] = useState<any[]>([]);
  const [sending, setSending] = useState(false);
  const [progress, setProgress] = useState(0);

  const [contacts, setContacts] = useState<any[]>([]);
  const [contactSearch, setContactSearch] = useState("");
  const [showContacts, setShowContacts] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    Promise.all([
      supabase.from("email_templates").select("*").order("name"),
      supabase.from("email_contacts").select("*").order("name"),
    ]).then(([tRes, cRes]) => {
      setTemplates(tRes.data || []);
      setContacts(cRes.data || []);
    });
  }, []);

  const handleTemplateSelect = (id: string) => {
    setTemplateId(id);
    if (id === "none") return;
    const t = templates.find(t => t.id === id);
    if (t) { setSubject(t.subject); setBody(t.content); }
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
      c.name?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q)
    );
  }, [contacts, contactSearch]);

  const allRecipients = useMemo(() => {
    const fromContacts = selectedContacts.map(c => ({ email: c.email, name: c.name }));
    const manual = email.trim() ? [{ email: email.trim(), name: name.trim() || null }] : [];
    const seen = new Set<string>();
    return [...fromContacts, ...manual].filter(r => {
      if (seen.has(r.email)) return false;
      seen.add(r.email);
      return true;
    });
  }, [selectedContacts, email, name]);

  const handleSend = async () => {
    if (!subject.trim() || !body.trim()) { toast.error("Emne og innhold er påkrevd"); return; }
    if (allRecipients.length === 0) { toast.error("Ingen mottakere valgt"); return; }

    setSending(true);
    setProgress(0);

    const rows = allRecipients.map(r => ({
      recipient_email: r.email,
      recipient_name: r.name,
      subject: subject.trim(),
      body: body.trim(),
      status: "queued" as const,
    }));

    const batchSize = 50;
    let done = 0;
    for (let i = 0; i < rows.length; i += batchSize) {
      await supabase.from("email_messages").insert(rows.slice(i, i + batchSize));
      done += Math.min(batchSize, rows.length - i);
      setProgress(Math.round((done / rows.length) * 100));
    }

    setSending(false);
    toast.success(`${allRecipients.length} e-post(er) lagt i kø`);
    setEmail(""); setName(""); setSubject(""); setBody(""); setTemplateId("");
    clearSelection();
    setProgress(0);
  };

  return (
    <div className="max-w-lg space-y-5">
      <div className="rounded-md bg-muted/50 p-3 flex items-center gap-2 text-xs text-muted-foreground">
        <Mail size={14} className="text-primary shrink-0" />
        Sendes fra <strong className="text-foreground">kontakt@avargo.no</strong> via SMTP
      </div>

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
                <p className="text-xs text-muted-foreground text-center py-4">
                  {contacts.length === 0 ? "Ingen kontakter ennå – legg til under «Kontakter»-fanen" : "Ingen treff"}
                </p>
              ) : (
                <div className="p-1 space-y-0.5">
                  {filteredContacts.map(c => (
                    <label key={c.id} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors">
                      <Checkbox checked={selectedIds.has(c.id)} onCheckedChange={() => toggleContact(c.id)} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{c.name}</p>
                        <p className="text-xs text-muted-foreground">{c.email}</p>
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

        {/* Manual email */}
        <div className="grid grid-cols-2 gap-3">
          <Input placeholder="Eller skriv e-post manuelt" value={email} onChange={e => setEmail(e.target.value)} className="text-sm" />
          <Input placeholder="Navn (valgfri)" value={name} onChange={e => setName(e.target.value)} className="text-sm" />
        </div>
        <p className="text-xs text-muted-foreground">{allRecipients.length} mottaker{allRecipients.length !== 1 ? "e" : ""} totalt</p>
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
        <Label>Emne</Label>
        <Input placeholder="Emnefeltet..." value={subject} onChange={e => setSubject(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label>Innhold</Label>
        <Textarea rows={6} placeholder="Skriv e-postinnhold her... HTML støttes." value={body} onChange={e => setBody(e.target.value)} />
      </div>

      {sending && <Progress value={progress} className="h-2" />}

      <Button onClick={handleSend} disabled={sending || allRecipients.length === 0} className="gap-2">
        <Send size={14} />
        {sending ? `Legger i kø (${progress}%)...` : `Send til ${allRecipients.length} mottaker${allRecipients.length !== 1 ? "e" : ""}`}
      </Button>
    </div>
  );
};

export default EmailSendPanel;
