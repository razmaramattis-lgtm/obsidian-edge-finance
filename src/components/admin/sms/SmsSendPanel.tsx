import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Send } from "lucide-react";

const SmsSendPanel = () => {
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [templateId, setTemplateId] = useState<string>("");
  const [templates, setTemplates] = useState<any[]>([]);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    supabase.from("sms_templates").select("*").order("name").then(({ data }) => setTemplates(data || []));
  }, []);

  const handleTemplateSelect = (id: string) => {
    setTemplateId(id);
    if (id === "none") return;
    const t = templates.find(t => t.id === id);
    if (t) setMessage(t.content);
  };

  const handleSend = async () => {
    if (!phone.trim() || !message.trim()) {
      toast.error("Telefonnummer og melding er påkrevd");
      return;
    }
    setSending(true);
    const { error } = await supabase.from("sms_messages").insert({
      phone: phone.trim(),
      message: message.trim(),
      status: "queued",
    });
    setSending(false);
    if (error) {
      toast.error("Kunne ikke legge til i kø: " + error.message);
    } else {
      toast.success("SMS lagt i kø for sending");
      setPhone("");
      setMessage("");
      setTemplateId("");
    }
  };

  return (
    <div className="max-w-lg space-y-5">
      <div className="space-y-2">
        <Label>Telefonnummer</Label>
        <Input placeholder="+47 XXX XX XXX" value={phone} onChange={e => setPhone(e.target.value)} />
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

      <Button onClick={handleSend} disabled={sending} className="gap-2">
        <Send size={14} />
        {sending ? "Sender..." : "Send SMS"}
      </Button>
    </div>
  );
};

export default SmsSendPanel;
