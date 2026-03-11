import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Send, Upload, Mail } from "lucide-react";

const EmailBulkPanel = () => {
  const [emails, setEmails] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [groupId, setGroupId] = useState("");
  const [groups, setGroups] = useState<any[]>([]);
  const [sending, setSending] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    supabase.from("sms_contact_groups").select("*").order("name").then(({ data }) => setGroups(data || []));
  }, []);

  const parseEmails = (text: string): string[] =>
    text.split(/[\n,;]+/).map(e => e.trim()).filter(e => e.includes("@"));

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const csv = ev.target?.result as string;
      const lines = csv.split("\n").slice(1);
      const addrs = lines.map(line => {
        const cols = line.split(/[,;\t]/);
        return cols.find(c => c.trim().includes("@"))?.trim() || "";
      }).filter(Boolean);
      setEmails(prev => prev ? prev + "\n" + addrs.join("\n") : addrs.join("\n"));
      toast.success(`${addrs.length} e-poster importert fra CSV`);
    };
    reader.readAsText(file);
  };

  const handleSend = async () => {
    if (!subject.trim() || !body.trim()) { toast.error("Emne og innhold er påkrevd"); return; }

    let emailList = parseEmails(emails);

    // Fetch group contacts with email (from sms_contacts which may have email-like phone or we use contacts)
    if (groupId && groupId !== "none") {
      const { data } = await supabase
        .from("sms_contact_group_members")
        .select("contact_id, sms_contacts(phone, name)")
        .eq("group_id", groupId);
      // Use phone field if it's an email, otherwise skip
      const groupEmails = data?.map((d: any) => d.sms_contacts?.phone).filter((p: string) => p?.includes("@")) || [];
      emailList = [...new Set([...emailList, ...groupEmails])];
    }

    if (emailList.length === 0) { toast.error("Ingen e-postadresser å sende til"); return; }

    setSending(true);
    setProgress(0);
    const batchSize = 50;
    let inserted = 0;
    for (let i = 0; i < emailList.length; i += batchSize) {
      const batch = emailList.slice(i, i + batchSize).map(addr => ({
        recipient_email: addr,
        subject: subject.trim(),
        body: body.trim(),
        status: "queued" as const,
      }));
      await supabase.from("email_messages").insert(batch);
      inserted += batch.length;
      setProgress(Math.round((inserted / emailList.length) * 100));
    }

    setSending(false);
    toast.success(`${emailList.length} e-poster lagt i kø`);
    setEmails(""); setSubject(""); setBody(""); setGroupId(""); setProgress(0);
  };

  return (
    <div className="max-w-2xl space-y-5">
      <div className="rounded-md bg-muted/50 p-3 flex items-center gap-2 text-xs text-muted-foreground">
        <Mail size={14} className="text-primary shrink-0" />
        Sendes fra <strong className="text-foreground">kontakt@avargo.no</strong>
      </div>

      <div className="space-y-2">
        <Label>E-postadresser (én per linje)</Label>
        <Textarea rows={6} placeholder={"ola@eksempel.no\nkari@firma.no\n..."} value={emails} onChange={e => setEmails(e.target.value)} />
        <div className="flex items-center gap-3">
          <p className="text-xs text-muted-foreground">{parseEmails(emails).length} adresser</p>
          <label className="cursor-pointer text-xs text-primary hover:underline flex items-center gap-1">
            <Upload size={12} /> Last opp CSV
            <input type="file" accept=".csv,.txt" className="hidden" onChange={handleFileUpload} />
          </label>
        </div>
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
        <Label>Emne</Label>
        <Input placeholder="Emnefeltet..." value={subject} onChange={e => setSubject(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label>Innhold</Label>
        <Textarea rows={6} placeholder="Skriv e-postinnhold..." value={body} onChange={e => setBody(e.target.value)} />
      </div>

      {sending && <Progress value={progress} className="h-2" />}

      <Button onClick={handleSend} disabled={sending} className="gap-2">
        <Send size={14} />
        {sending ? `Legger i kø (${progress}%)...` : "Send til alle"}
      </Button>
    </div>
  );
};

export default EmailBulkPanel;
