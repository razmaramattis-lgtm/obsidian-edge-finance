import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Plus, Play, Trash2, Upload } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const statusColors: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  scheduled: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  sending: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  completed: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
};

const SmsCampaignsPanel = () => {
  const { profile } = useAuth();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", message: "", groupId: "", scheduledAt: "", phones: "" });

  const parsePhones = (text: string): string[] =>
    text.split(/[\n,;]+/).map(p => p.trim()).filter(p => p.length >= 8);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const csv = ev.target?.result as string;
      const lines = csv.split("\n").slice(1);
      const numbers = lines.map(line => {
        const cols = line.split(/[,;\t]/);
        return cols.find(c => /^\+?\d[\d\s-]{7,}$/.test(c.trim()))?.trim() || "";
      }).filter(Boolean);
      setForm(f => ({ ...f, phones: f.phones ? f.phones + "\n" + numbers.join("\n") : numbers.join("\n") }));
      toast.success(`${numbers.length} numre importert fra CSV`);
    };
    reader.readAsText(file);
  };

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    const [campRes, groupRes] = await Promise.all([
      supabase.from("sms_campaigns").select("*").order("created_at", { ascending: false }),
      supabase.from("sms_contact_groups").select("*").order("name"),
    ]);
    setCampaigns(campRes.data || []);
    setGroups(groupRes.data || []);
  };

  const handleCreate = async () => {
    if (!form.name.trim() || !form.message.trim()) {
      toast.error("Navn og melding er påkrevd");
      return;
    }
    let phones: string[] = parsePhones(form.phones);
    if (form.groupId && form.groupId !== "none") {
      const { data } = await supabase
        .from("sms_contact_group_members")
        .select("contact_id, sms_contacts(phone)")
        .eq("group_id", form.groupId);
      const groupPhones = data?.map((d: any) => d.sms_contacts?.phone).filter(Boolean) || [];
      phones = [...new Set([...phones, ...groupPhones])];
    }
    const { data: campaign, error } = await supabase.from("sms_campaigns").insert({
      name: form.name.trim(),
      message: form.message.trim(),
      status: form.scheduledAt ? "scheduled" : "draft",
      scheduled_at: form.scheduledAt || null,
      total_recipients: phones.length,
      created_by: profile?.id,
    }).select().single();
    if (error || !campaign) { toast.error("Feil: " + (error?.message || "Ukjent")); return; }
    if (phones.length > 0) {
      await supabase.from("sms_campaign_contacts").insert(phones.map(phone => ({ campaign_id: campaign.id, phone })));
    }
    toast.success("Kampanje opprettet");
    setForm({ name: "", message: "", groupId: "", scheduledAt: "", phones: "" });
    setOpen(false);
    fetchAll();
  };

  const handleStart = async (id: string) => {
    const { data: campaign } = await supabase.from("sms_campaigns").select("*").eq("id", id).single();
    if (!campaign) return;
    const { data: contacts } = await supabase.from("sms_campaign_contacts").select("phone").eq("campaign_id", id);
    if (!contacts || contacts.length === 0) { toast.error("Ingen kontakter i kampanjen"); return; }
    const msgs = contacts.map(c => ({ phone: c.phone, message: campaign.message, campaign_id: id, status: "queued" as const }));
    await supabase.from("sms_messages").insert(msgs);
    await supabase.from("sms_campaigns").update({ status: "sending" }).eq("id", id);
    toast.success(`${msgs.length} meldinger lagt i kø`);
    fetchAll();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("sms_campaigns").delete().eq("id", id);
    toast.success("Kampanje slettet");
    fetchAll();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Kampanjer</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5"><Plus size={14} /> Ny kampanje</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Ny kampanje</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Kampanjenavn</Label>
                <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Telefonnumre (valgfri, ett per linje)</Label>
                <Textarea rows={3} placeholder={"+4712345678\n+4798765432"} value={form.phones} onChange={e => setForm(f => ({ ...f, phones: e.target.value }))} />
                <p className="text-xs text-muted-foreground">{parsePhones(form.phones).length} numre</p>
                <label className="flex flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-border/60 bg-muted/30 p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                  <Upload size={16} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Last opp CSV / TXT</span>
                  <input type="file" accept=".csv,.txt" className="hidden" onChange={handleFileUpload} />
                </label>
              </div>
              <div className="space-y-2">
                <Label>Kontaktgruppe (valgfri)</Label>
                <Select value={form.groupId} onValueChange={v => setForm(f => ({ ...f, groupId: v }))}>
                  <SelectTrigger><SelectValue placeholder="Velg gruppe..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Ingen</SelectItem>
                    {groups.map(g => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Melding</Label>
                <Textarea rows={4} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Planlegg sending (valgfri)</Label>
                <Input type="datetime-local" value={form.scheduledAt} onChange={e => setForm(f => ({ ...f, scheduledAt: e.target.value }))} />
              </div>
              <Button onClick={handleCreate} className="w-full">Opprett kampanje</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Mobile: card layout */}
      <div className="md:hidden space-y-2">
        {campaigns.length === 0 ? (
          <Card className="border-border/20">
            <CardContent className="py-8 text-center text-muted-foreground text-sm">Ingen kampanjer</CardContent>
          </Card>
        ) : campaigns.map(c => (
          <Card key={c.id} className="border-border/20">
            <CardContent className="p-3 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium truncate">{c.name}</p>
                <Badge className={`text-[10px] shrink-0 ${statusColors[c.status]}`}>{c.status}</Badge>
              </div>
              <div className="flex gap-3 text-xs text-muted-foreground">
                <span>Mottakere: {c.total_recipients}</span>
                <span>Sendt: {c.sent_count}</span>
                <span>Feilet: {c.failed_count}</span>
              </div>
              <div className="flex gap-1.5 pt-1">
                {(c.status === "draft" || c.status === "scheduled") && (
                  <Button size="sm" variant="outline" className="gap-1 h-7 text-xs" onClick={() => handleStart(c.id)}>
                    <Play size={12} /> Start
                  </Button>
                )}
                <Button size="sm" variant="ghost" className="gap-1 h-7 text-xs text-destructive" onClick={() => handleDelete(c.id)}>
                  <Trash2 size={12} /> Slett
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Navn</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Mottakere</TableHead>
              <TableHead>Sendt</TableHead>
              <TableHead>Feilet</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Ingen kampanjer</TableCell></TableRow>
            ) : campaigns.map(c => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.name}</TableCell>
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
    </div>
  );
};

export default SmsCampaignsPanel;
