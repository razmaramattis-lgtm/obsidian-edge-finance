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
import SendPacingControl, { DEFAULT_PACING, SendPacing } from "./SendPacingControl";
import SendProgressPanel from "./SendProgressPanel";

const EmailBulkPanel = () => {
  const [emails, setEmails] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [groupId, setGroupId] = useState("");
  const [groups, setGroups] = useState<any[]>([]);
  const [sending, setSending] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pacing, setPacing] = useState<SendPacing>(DEFAULT_PACING);

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

  const triggerSend = async () => {
    try {
      for (let i = 0; i < 20; i++) {
        const { data } = await supabase.functions.invoke("send-bulk-email", {
          body: { minDelayMinutes: pacing.min, maxDelayMinutes: pacing.max },
        });
        if (!data || (data as any).remaining === 0 || (data as any).processed === 0) break;
      }
    } catch { /* silent */ }
  };

  const handleSend = async () => {
    if (!subject.trim() || !body.trim()) { toast.error("Emne og innhold er påkrevd"); return; }

    let emailList = parseEmails(emails);

    if (groupId && groupId !== "none") {
      const { data } = await supabase
        .from("sms_contact_group_members")
        .select("contact_id, sms_contacts(phone, name)")
        .eq("group_id", groupId);
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

    // Trigger immediate sending
    triggerSend();

    setSending(false);
    toast.success(
      pacing.max === 0
        ? `${emailList.length} e-poster sendes nå`
        : `${emailList.length} e-poster lagt i kø – sendes med ${pacing.min}–${pacing.max} min mellomrom`
    );
    setEmails(""); setSubject(""); setBody(""); setGroupId(""); setProgress(0);
  };

  return (
    <div className="max-w-2xl space-y-5">
      <SendProgressPanel />

      <div className="rounded-md bg-muted/50 p-3 flex items-center gap-2 text-xs text-muted-foreground">
        <Mail size={14} className="text-primary shrink-0" />
        Sendes fra <strong className="text-foreground">kontakt@avargo.no</strong>
      </div>

      <div className="space-y-2">
        <Label>E-postadresser (én per linje)</Label>
        <Textarea rows={6} placeholder={"ola@eksempel.no\nkari@firma.no\n..."} value={emails} onChange={e => setEmails(e.target.value)} />
        <div className="flex items-center gap-3">
          <p className="text-xs text-muted-foreground">{parseEmails(emails).length} adresser</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Importer fra CSV-fil</Label>
        <label className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border/60 bg-muted/30 p-6 cursor-pointer hover:bg-muted/50 transition-colors">
          <Upload size={20} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Klikk for å laste opp CSV / TXT</span>
          <span className="text-[10px] text-muted-foreground">E-postadresser hentes automatisk fra filen</span>
          <input type="file" accept=".csv,.txt,.xlsx" className="hidden" onChange={handleFileUpload} />
        </label>
      </div>

      <SendPacingControl value={pacing} onChange={setPacing} recipients={parseEmails(emails).length} />

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
