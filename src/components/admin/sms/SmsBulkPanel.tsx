import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Send, Upload } from "lucide-react";

const SmsBulkPanel = () => {
  const [phones, setPhones] = useState("");
  const [message, setMessage] = useState("");
  const [groupId, setGroupId] = useState("");
  const [groups, setGroups] = useState<any[]>([]);
  const [sending, setSending] = useState(false);
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    supabase.from("sms_contact_groups").select("*").order("name").then(({ data }) => setGroups(data || []));
  }, []);

  const parsePhones = (text: string): string[] => {
    return text.split(/[\n,;]+/).map(p => p.trim()).filter(p => p.length >= 8);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const csv = ev.target?.result as string;
      // Extract phone numbers from CSV (first column or any column with phone-like data)
      const lines = csv.split("\n").slice(1); // skip header
      const numbers = lines.map(line => {
        const cols = line.split(/[,;\t]/);
        const phoneCol = cols.find(c => /^\+?\d[\d\s-]{7,}$/.test(c.trim()));
        return phoneCol?.trim() || "";
      }).filter(Boolean);
      setPhones(prev => prev ? prev + "\n" + numbers.join("\n") : numbers.join("\n"));
      toast.success(`${numbers.length} numre importert fra CSV`);
    };
    reader.readAsText(file);
  };

  const handleSend = async () => {
    if (!message.trim()) {
      toast.error("Melding er påkrevd");
      return;
    }

    let phoneList = parsePhones(phones);

    // If group selected, fetch group contacts
    if (groupId && groupId !== "none") {
      const { data } = await supabase
        .from("sms_contact_group_members")
        .select("contact_id, sms_contacts(phone)")
        .eq("group_id", groupId);
      const groupPhones = data?.map((d: any) => d.sms_contacts?.phone).filter(Boolean) || [];
      phoneList = [...new Set([...phoneList, ...groupPhones])];
    }

    if (phoneList.length === 0) {
      toast.error("Ingen telefonnumre å sende til");
      return;
    }

    setSending(true);
    setTotal(phoneList.length);
    setProgress(0);

    // Insert in batches of 50
    const batchSize = 50;
    let inserted = 0;
    for (let i = 0; i < phoneList.length; i += batchSize) {
      const batch = phoneList.slice(i, i + batchSize).map(phone => ({
        phone,
        message: message.trim(),
        status: "queued" as const,
      }));
      await supabase.from("sms_messages").insert(batch);
      inserted += batch.length;
      setProgress(Math.round((inserted / phoneList.length) * 100));
    }

    setSending(false);
    toast.success(`${phoneList.length} SMS-er lagt i kø`);
    setPhones("");
    setMessage("");
    setGroupId("");
    setProgress(0);
  };

  return (
    <div className="max-w-2xl space-y-5">
      <div className="space-y-2">
        <Label>Telefonnumre (ett per linje)</Label>
        <Textarea rows={6} placeholder={"+4712345678\n+4798765432\n..."} value={phones} onChange={e => setPhones(e.target.value)} />
        <div className="flex items-center gap-3">
          <p className="text-xs text-muted-foreground">{parsePhones(phones).length} numre</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Importer fra CSV-fil</Label>
        <label className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border/60 bg-muted/30 p-6 cursor-pointer hover:bg-muted/50 transition-colors">
          <Upload size={20} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Klikk for å laste opp CSV / TXT</span>
          <span className="text-[10px] text-muted-foreground">Telefonnumre hentes automatisk fra filen</span>
          <input type="file" accept=".csv,.txt,.xlsx" className="hidden" onChange={handleFileUpload} />
        </label>
      </div>

      <div className="space-y-2">
        <Label>Kontaktgruppe (valgfri)</Label>
        <Select value={groupId} onValueChange={setGroupId}>
          <SelectTrigger><SelectValue placeholder="Velg gruppe..." /></SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Ingen gruppe</SelectItem>
            {groups.map(g => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Melding</Label>
        <Textarea rows={4} placeholder="Skriv melding..." value={message} onChange={e => setMessage(e.target.value)} />
        <p className="text-xs text-muted-foreground">{message.length} tegn</p>
      </div>

      {sending && <Progress value={progress} className="h-2" />}

      <Button onClick={handleSend} disabled={sending} className="gap-2">
        <Send size={14} />
        {sending ? `Legger i kø (${progress}%)...` : "Send til alle"}
      </Button>
    </div>
  );
};

export default SmsBulkPanel;
