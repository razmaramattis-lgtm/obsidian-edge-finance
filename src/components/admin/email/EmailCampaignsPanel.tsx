import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Play, Trash2, Upload } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const statusColors: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  scheduled: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  sending: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  completed: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
};

const EmailCampaignsPanel = () => {
  const { profile } = useAuth();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", subject: "", message: "", emails: "", scheduledAt: "" });

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    const { data } = await supabase.from("email_campaigns").select("*").order("created_at", { ascending: false });
    setCampaigns(data || []);
  };

  const parseEmails = (text: string) => text.split(/[\n,;]+/).map(e => e.trim()).filter(e => e.includes("@"));

  const handleCreate = async () => {
    if (!form.name.trim() || !form.subject.trim() || !form.message.trim()) {
      toast.error("Navn, emne og melding er påkrevd"); return;
    }
    const emailList = parseEmails(form.emails);

    const { data: campaign, error } = await supabase.from("email_campaigns").insert({
      name: form.name.trim(),
      subject: form.subject.trim(),
      message: form.message.trim(),
      status: form.scheduledAt ? "scheduled" : "draft",
      scheduled_at: form.scheduledAt || null,
      total_recipients: emailList.length,
      created_by: profile?.id,
    }).select().single();

    if (error || !campaign) { toast.error("Feil: " + (error?.message || "Ukjent")); return; }

    if (emailList.length > 0) {
      await supabase.from("email_campaign_contacts").insert(
        emailList.map(email => ({ campaign_id: campaign.id, email }))
      );
    }

    toast.success("E-postkampanje opprettet");
    setForm({ name: "", subject: "", message: "", emails: "", scheduledAt: "" });
    setOpen(false);
    fetchAll();
  };

  const handleStart = async (id: string) => {
    const { data: campaign } = await supabase.from("email_campaigns").select("*").eq("id", id).single();
    if (!campaign) return;
    const { data: contacts } = await supabase.from("email_campaign_contacts").select("email, name").eq("campaign_id", id);
    if (!contacts || contacts.length === 0) { toast.error("Ingen mottakere"); return; }

    const msgs = contacts.map(c => ({
      recipient_email: c.email,
      recipient_name: c.name || null,
      subject: campaign.subject,
      body: campaign.message,
      campaign_id: id,
      status: "queued" as const,
    }));

    await supabase.from("email_messages").insert(msgs);
    await supabase.from("email_campaigns").update({ status: "sending" }).eq("id", id);
    toast.success(`${msgs.length} e-poster lagt i kø`);
    fetchAll();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("email_campaigns").delete().eq("id", id);
    toast.success("Kampanje slettet");
    fetchAll();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">E-postkampanjer</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5"><Plus size={14} /> Ny kampanje</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Ny e-postkampanje</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Kampanjenavn</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
              <div><Label>Emne</Label><Input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} /></div>
              <div><Label>Mottakere (én e-post per linje)</Label><Textarea rows={4} value={form.emails} onChange={e => setForm(f => ({ ...f, emails: e.target.value }))} placeholder={"ola@eksempel.no\nkari@firma.no"} /><p className="text-xs text-muted-foreground mt-1">{parseEmails(form.emails).length} mottakere</p></div>
              <div><Label>Melding</Label><Textarea rows={4} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} /></div>
              <div><Label>Planlegg sending (valgfri)</Label><Input type="datetime-local" value={form.scheduledAt} onChange={e => setForm(f => ({ ...f, scheduledAt: e.target.value }))} /></div>
              <Button onClick={handleCreate} className="w-full">Opprett kampanje</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Navn</TableHead>
            <TableHead>Emne</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Mottakere</TableHead>
            <TableHead>Sendt</TableHead>
            <TableHead>Feilet</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {campaigns.length === 0 ? (
            <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">Ingen kampanjer</TableCell></TableRow>
          ) : campaigns.map(c => (
            <TableRow key={c.id}>
              <TableCell className="font-medium">{c.name}</TableCell>
              <TableCell className="text-sm text-muted-foreground max-w-[150px] truncate">{c.subject}</TableCell>
              <TableCell><Badge className={statusColors[c.status]}>{c.status}</Badge></TableCell>
              <TableCell>{c.total_recipients}</TableCell>
              <TableCell>{c.sent_count}</TableCell>
              <TableCell>{c.failed_count}</TableCell>
              <TableCell>
                <div className="flex gap-1">
                  {(c.status === "draft" || c.status === "scheduled") && (
                    <Button size="icon" variant="ghost" onClick={() => handleStart(c.id)} title="Start sending"><Play size={14} /></Button>
                  )}
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(c.id)} className="text-destructive"><Trash2 size={14} /></Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default EmailCampaignsPanel;
