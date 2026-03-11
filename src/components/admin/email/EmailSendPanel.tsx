import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Send, Mail, Users, Search, X } from "lucide-react";

const EmailSendPanel = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [templates, setTemplates] = useState<any[]>([]);
  const [sending, setSending] = useState(false);

  // Contact picker
  const [contacts, setContacts] = useState<any[]>([]);
  const [contactSearch, setContactSearch] = useState("");
  const [showContacts, setShowContacts] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any>(null);

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

  const pickContact = (c: any) => {
    setEmail(c.email);
    setName(c.name);
    setSelectedContact(c);
    setShowContacts(false);
    setContactSearch("");
  };

  const clearContact = () => {
    setSelectedContact(null);
    setEmail("");
    setName("");
  };

  const filteredContacts = contacts.filter(c =>
    c.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
    c.email.toLowerCase().includes(contactSearch.toLowerCase())
  );

  const handleSend = async () => {
    if (!email.trim() || !subject.trim() || !body.trim()) {
      toast.error("E-post, emne og innhold er påkrevd");
      return;
    }
    setSending(true);
    const { error } = await supabase.from("email_messages").insert({
      recipient_email: email.trim(),
      recipient_name: name.trim() || null,
      subject: subject.trim(),
      body: body.trim(),
      status: "queued",
    });
    setSending(false);
    if (error) {
      toast.error("Feil: " + error.message);
    } else {
      toast.success("E-post lagt i kø for sending");
      setEmail(""); setName(""); setSubject(""); setBody(""); setTemplateId("");
      setSelectedContact(null);
    }
  };

  return (
    <div className="max-w-lg space-y-5">
      <div className="rounded-md bg-muted/50 p-3 flex items-center gap-2 text-xs text-muted-foreground">
        <Mail size={14} className="text-primary shrink-0" />
        Sendes fra <strong className="text-foreground">kontakt@avargo.no</strong> via SMTP
      </div>

      {/* Email + contact picker */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Mottaker</Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 gap-1.5 text-xs text-primary"
            onClick={() => setShowContacts(!showContacts)}
          >
            <Users size={13} />
            {showContacts ? "Skjul kontakter" : "Velg kontakt"}
          </Button>
        </div>

        {selectedContact ? (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 border border-border/20">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{selectedContact.name}</p>
              <p className="text-xs text-muted-foreground">{selectedContact.email}</p>
            </div>
            <Button size="icon" variant="ghost" className="h-7 w-7 shrink-0" onClick={clearContact}>
              <X size={14} />
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="navn@eksempel.no" value={email} onChange={e => setEmail(e.target.value)} />
            <Input placeholder="Navn (valgfri)" value={name} onChange={e => setName(e.target.value)} />
          </div>
        )}

        {showContacts && (
          <div className="border border-border/20 rounded-lg bg-background shadow-sm">
            <div className="p-2 border-b border-border/10">
              <div className="relative">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Søk kontakter..."
                  value={contactSearch}
                  onChange={e => setContactSearch(e.target.value)}
                  className="h-8 pl-8 text-xs"
                />
              </div>
            </div>
            <ScrollArea className="max-h-[200px]">
              {filteredContacts.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">
                  {contacts.length === 0 ? "Ingen kontakter ennå – legg til under «Kontakter»-fanen" : "Ingen treff"}
                </p>
              ) : (
                <div className="p-1">
                  {filteredContacts.map(c => (
                    <button
                      key={c.id}
                      onClick={() => pickContact(c)}
                      className="w-full text-left px-3 py-2 rounded-md hover:bg-muted/50 transition-colors flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm font-medium">{c.name}</p>
                        <p className="text-xs text-muted-foreground">{c.email}</p>
                      </div>
                      {c.tags?.length > 0 && (
                        <div className="flex gap-1">
                          {c.tags.slice(0, 2).map((t: string) => (
                            <Badge key={t} variant="secondary" className="text-[9px]">{t}</Badge>
                          ))}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        )}
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

      <Button onClick={handleSend} disabled={sending} className="gap-2">
        <Send size={14} />
        {sending ? "Legger i kø..." : "Send e-post"}
      </Button>
    </div>
  );
};

export default EmailSendPanel;
