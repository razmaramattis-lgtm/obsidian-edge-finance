import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Send, Mail } from "lucide-react";

const EmailSendPanel = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [templates, setTemplates] = useState<any[]>([]);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    supabase.from("email_templates").select("*").order("name").then(({ data }) => setTemplates(data || []));
  }, []);

  const handleTemplateSelect = (id: string) => {
    setTemplateId(id);
    if (id === "none") return;
    const t = templates.find(t => t.id === id);
    if (t) { setSubject(t.subject); setBody(t.content); }
  };

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
    }
  };

  return (
    <div className="max-w-lg space-y-5">
      <div className="rounded-md bg-muted/50 p-3 flex items-center gap-2 text-xs text-muted-foreground">
        <Mail size={14} className="text-primary shrink-0" />
        Sendes fra <strong className="text-foreground">kontakt@avargo.no</strong> via SMTP
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Mottaker e-post</Label>
          <Input placeholder="navn@eksempel.no" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Navn (valgfri)</Label>
          <Input placeholder="Ola Nordmann" value={name} onChange={e => setName(e.target.value)} />
        </div>
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
