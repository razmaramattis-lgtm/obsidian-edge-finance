import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Trash2, Edit2, Save, X } from "lucide-react";

const SmsTemplatesPanel = () => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", content: "" });
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", content: "" });

  useEffect(() => { fetch(); }, []);

  const fetch = async () => {
    const { data } = await supabase.from("sms_templates").select("*").order("name");
    setTemplates(data || []);
  };

  const handleAdd = async () => {
    if (!form.name.trim() || !form.content.trim()) { toast.error("Navn og innhold er påkrevd"); return; }
    await supabase.from("sms_templates").insert({ name: form.name.trim(), content: form.content.trim() });
    setForm({ name: "", content: "" });
    setOpen(false);
    fetch();
    toast.success("Mal opprettet");
  };

  const handleSaveEdit = async (id: string) => {
    await supabase.from("sms_templates").update({ name: editForm.name, content: editForm.content }).eq("id", id);
    setEditId(null);
    fetch();
    toast.success("Oppdatert");
  };

  const handleDelete = async (id: string) => {
    await supabase.from("sms_templates").delete().eq("id", id);
    fetch();
    toast.success("Slettet");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">SMS-maler</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5"><Plus size={14} /> Ny mal</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Ny SMS-mal</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Navn</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
              <div>
                <Label>Innhold</Label>
                <Textarea rows={4} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} placeholder="Hei {{name}}, din time er i morgen." />
                <p className="text-xs text-muted-foreground mt-1">Bruk {"{{variabel}}"} for dynamisk innhold</p>
              </div>
              <Button onClick={handleAdd} className="w-full">Opprett mal</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Navn</TableHead>
            <TableHead>Innhold</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {templates.length === 0 ? (
            <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground py-8">Ingen maler</TableCell></TableRow>
          ) : templates.map(t => (
            <TableRow key={t.id}>
              {editId === t.id ? (
                <>
                  <TableCell><Input value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} className="h-8" /></TableCell>
                  <TableCell><Input value={editForm.content} onChange={e => setEditForm(f => ({ ...f, content: e.target.value }))} className="h-8" /></TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" onClick={() => handleSaveEdit(t.id)}><Save size={14} /></Button>
                      <Button size="icon" variant="ghost" onClick={() => setEditId(null)}><X size={14} /></Button>
                    </div>
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell className="font-medium">{t.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-md truncate">{t.content}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" onClick={() => { setEditId(t.id); setEditForm({ name: t.name, content: t.content }); }}><Edit2 size={14} /></Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDelete(t.id)} className="text-destructive"><Trash2 size={14} /></Button>
                    </div>
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SmsTemplatesPanel;
