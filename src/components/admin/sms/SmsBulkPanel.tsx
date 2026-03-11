import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Send, Upload, Users, Search, UserPlus, X, CheckCircle2 } from "lucide-react";

const SmsBulkPanel = () => {
  const [phones, setPhones] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);

  // Contacts & groups from DB
  const [contacts, setContacts] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [contactSearch, setContactSearch] = useState("");
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(new Set());
  const [selectedGroups, setSelectedGroups] = useState<Set<string>>(new Set());
  const [showContactPicker, setShowContactPicker] = useState(false);

  useEffect(() => {
    Promise.all([
      supabase.from("sms_contacts").select("*").order("name"),
      supabase.from("sms_contact_groups").select("*").order("name"),
    ]).then(([cRes, gRes]) => {
      setContacts(cRes.data || []);
      setGroups(gRes.data || []);
    });
  }, []);

  const filteredContacts = useMemo(() => {
    if (!contactSearch.trim()) return contacts;
    const q = contactSearch.toLowerCase();
    return contacts.filter(c =>
      c.name?.toLowerCase().includes(q) || c.phone?.includes(q) || c.tags?.some((t: string) => t.toLowerCase().includes(q))
    );
  }, [contacts, contactSearch]);

  const toggleContact = (id: string) => {
    setSelectedContacts(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleGroup = async (groupId: string) => {
    const isSelected = selectedGroups.has(groupId);
    // Fetch members for this group
    const { data } = await supabase
      .from("sms_contact_group_members")
      .select("contact_id")
      .eq("group_id", groupId);
    const memberIds = data?.map(d => d.contact_id) || [];

    setSelectedGroups(prev => {
      const next = new Set(prev);
      isSelected ? next.delete(groupId) : next.add(groupId);
      return next;
    });

    setSelectedContacts(prev => {
      const next = new Set(prev);
      if (isSelected) {
        memberIds.forEach(id => next.delete(id));
      } else {
        memberIds.forEach(id => next.add(id));
      }
      return next;
    });
  };

  const selectAll = () => {
    setSelectedContacts(new Set(contacts.map(c => c.id)));
  };

  const clearSelection = () => {
    setSelectedContacts(new Set());
    setSelectedGroups(new Set());
  };

  const selectedContactObjects = useMemo(() =>
    contacts.filter(c => selectedContacts.has(c.id)),
    [contacts, selectedContacts]
  );

  const parseManualPhones = (text: string): string[] => {
    return text.split(/[\n,;]+/).map(p => p.trim()).filter(p => p.length >= 8);
  };

  const allRecipientPhones = useMemo(() => {
    const fromContacts = selectedContactObjects.map(c => c.phone).filter(Boolean);
    const fromManual = parseManualPhones(phones);
    return [...new Set([...fromContacts, ...fromManual])];
  }, [selectedContactObjects, phones]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const csv = ev.target?.result as string;
      const lines = csv.split("\n").slice(1);
      const numbers = lines.map(line => {
        const cols = line.split(/[,;\t]/);
        const phoneCol = cols.find(c => /^\+?\d[\d\s-]{7,}$/.test(c.trim()));
        return phoneCol?.trim() || "";
      }).filter(Boolean);
      setPhones(prev => prev ? prev + "\n" + numbers.join("\n") : numbers.join("\n"));
      toast.success(`${numbers.length} numre importert fra fil`);
    };
    reader.readAsText(file);
  };

  const handleSend = async () => {
    if (!message.trim()) { toast.error("Melding er påkrevd"); return; }
    if (allRecipientPhones.length === 0) { toast.error("Ingen mottakere valgt"); return; }

    setSending(true);
    setTotal(allRecipientPhones.length);
    setProgress(0);

    const batchSize = 50;
    let inserted = 0;
    for (let i = 0; i < allRecipientPhones.length; i += batchSize) {
      const batch = allRecipientPhones.slice(i, i + batchSize).map(phone => ({
        phone,
        message: message.trim(),
        status: "queued" as const,
      }));
      await supabase.from("sms_messages").insert(batch);
      inserted += batch.length;
      setProgress(Math.round((inserted / allRecipientPhones.length) * 100));
    }

    setSending(false);
    toast.success(`${allRecipientPhones.length} SMS-er lagt i kø`);
    setPhones("");
    setMessage("");
    clearSelection();
    setProgress(0);
  };

  return (
    <div className="space-y-5">
      {/* Recipients summary */}
      <Card className="border-border/30 bg-muted/20">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-primary" />
              <Label className="text-sm font-semibold">Mottakere</Label>
              <Badge variant="secondary" className="text-xs">{allRecipientPhones.length} totalt</Badge>
            </div>
            <Button size="sm" variant={showContactPicker ? "default" : "outline"} className="gap-1.5 h-8" onClick={() => setShowContactPicker(!showContactPicker)}>
              <UserPlus size={14} />
              <span className="hidden sm:inline">{showContactPicker ? "Skjul kontakter" : "Velg kontakter"}</span>
              <span className="sm:hidden">{showContactPicker ? "Skjul" : "Kontakter"}</span>
            </Button>
          </div>

          {/* Selected contacts chips */}
          {selectedContactObjects.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {selectedContactObjects.slice(0, 20).map(c => (
                <Badge key={c.id} variant="outline" className="gap-1 text-xs pr-1 cursor-pointer hover:bg-destructive/10" onClick={() => toggleContact(c.id)}>
                  {c.name} <X size={10} />
                </Badge>
              ))}
              {selectedContactObjects.length > 20 && (
                <Badge variant="secondary" className="text-xs">+{selectedContactObjects.length - 20} til</Badge>
              )}
              <Button size="sm" variant="ghost" className="h-5 text-[10px] text-destructive px-1.5" onClick={clearSelection}>Fjern alle</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contact picker */}
      {showContactPicker && (
        <Card className="border-border/30">
          <CardContent className="p-4 space-y-3">
            {/* Groups quick-select */}
            {groups.length > 0 && (
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Grupper</Label>
                <div className="flex flex-wrap gap-1.5">
                  {groups.map(g => (
                    <Badge
                      key={g.id}
                      variant={selectedGroups.has(g.id) ? "default" : "outline"}
                      className="cursor-pointer text-xs transition-colors"
                      onClick={() => toggleGroup(g.id)}
                    >
                      <Users size={10} className="mr-1" />
                      {g.name}
                      {selectedGroups.has(g.id) && <CheckCircle2 size={10} className="ml-1" />}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Search + select all */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Søk kontakter..."
                  value={contactSearch}
                  onChange={e => setContactSearch(e.target.value)}
                  className="pl-8 h-8 text-sm"
                />
              </div>
              <Button size="sm" variant="outline" className="h-8 text-xs shrink-0" onClick={selectAll}>Velg alle</Button>
            </div>

            {/* Contact list */}
            <ScrollArea className="max-h-60">
              <div className="space-y-0.5">
                {filteredContacts.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">Ingen kontakter funnet</p>
                ) : filteredContacts.map(c => (
                  <label
                    key={c.id}
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <Checkbox
                      checked={selectedContacts.has(c.id)}
                      onCheckedChange={() => toggleContact(c.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{c.name}</p>
                      <p className="text-[11px] font-mono text-muted-foreground">{c.phone}</p>
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
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Manual phones */}
      <div className="space-y-2">
        <Label>Ekstra numre manuelt (valgfritt)</Label>
        <Textarea rows={3} placeholder={"+4712345678\n+4798765432"} value={phones} onChange={e => setPhones(e.target.value)} />
        <div className="flex items-center gap-3">
          <p className="text-xs text-muted-foreground">{parseManualPhones(phones).length} manuelle numre</p>
          <label className="cursor-pointer">
            <Button size="sm" variant="outline" className="gap-1.5 h-7 text-xs" asChild>
              <span><Upload size={12} /> CSV</span>
            </Button>
            <input type="file" accept=".csv,.txt" className="hidden" onChange={handleFileUpload} />
          </label>
        </div>
      </div>

      {/* Message */}
      <div className="space-y-2">
        <Label>Melding</Label>
        <Textarea rows={4} placeholder="Skriv melding..." value={message} onChange={e => setMessage(e.target.value)} />
        <p className="text-xs text-muted-foreground">{message.length} tegn</p>
      </div>

      {sending && <Progress value={progress} className="h-2" />}

      <Button onClick={handleSend} disabled={sending || allRecipientPhones.length === 0} className="gap-2">
        <Send size={14} />
        {sending ? `Legger i kø (${progress}%)...` : `Send til ${allRecipientPhones.length} mottakere`}
      </Button>
    </div>
  );
};

export default SmsBulkPanel;
