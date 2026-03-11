import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Plus, Trash2, Upload, Users, Edit2, Save, X } from "lucide-react";

const SmsContactsPanel = () => {
  const [contacts, setContacts] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [openContact, setOpenContact] = useState(false);
  const [openGroup, setOpenGroup] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", tags: "" });
  const [groupForm, setGroupForm] = useState({ name: "", description: "" });
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", phone: "", tags: "" });
  const [search, setSearch] = useState("");

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    const [cRes, gRes] = await Promise.all([
      supabase.from("sms_contacts").select("*").order("name"),
      supabase.from("sms_contact_groups").select("*").order("name"),
    ]);
    setContacts(cRes.data || []);
    setGroups(gRes.data || []);
  };

  const handleAdd = async () => {
    if (!form.name.trim() || !form.phone.trim()) { toast.error("Navn og telefon er påkrevd"); return; }
    const { error } = await supabase.from("sms_contacts").insert({
      name: form.name.trim(), phone: form.phone.trim(),
      tags: form.tags ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Kontakt lagt til");
    setForm({ name: "", phone: "", tags: "" });
    setOpenContact(false);
    fetchAll();
  };

  const handleSaveEdit = async (id: string) => {
    await supabase.from("sms_contacts").update({
      name: editForm.name, phone: editForm.phone,
      tags: editForm.tags ? editForm.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
    }).eq("id", id);
    setEditId(null);
    fetchAll();
    toast.success("Oppdatert");
  };

  const handleDelete = async (id: string) => {
    await supabase.from("sms_contacts").delete().eq("id", id);
    fetchAll();
    toast.success("Slettet");
  };

  const handleAddGroup = async () => {
    if (!groupForm.name.trim()) { toast.error("Gruppenavn er påkrevd"); return; }
    await supabase.from("sms_contact_groups").insert({ name: groupForm.name.trim(), description: groupForm.description.trim() || null });
    setGroupForm({ name: "", description: "" });
    setOpenGroup(false);
    fetchAll();
    toast.success("Gruppe opprettet");
  };

  const handleDeleteGroup = async (id: string) => {
    await supabase.from("sms_contact_groups").delete().eq("id", id);
    fetchAll();
    toast.success("Gruppe slettet");
  };

  const handleCsvImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const csv = ev.target?.result as string;
      const lines = csv.split("\n").slice(1).filter(l => l.trim());
      const rows = lines.map(line => {
        const cols = line.split(/[,;\t]/);
        return { name: cols[0]?.trim() || "Ukjent", phone: cols[1]?.trim() || "", tags: [] as string[] };
      }).filter(r => r.phone.length >= 8);
      if (rows.length > 0) {
        await supabase.from("sms_contacts").insert(rows);
        fetchAll();
        toast.success(`${rows.length} kontakter importert`);
      } else {
        toast.error("Ingen gyldige kontakter funnet i CSV");
      }
    };
    reader.readAsText(file);
  };

  const filtered = contacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search)
  );

  return (
    <div className="space-y-4">
      <Tabs defaultValue="contacts">
        <TabsList>
          <TabsTrigger value="contacts">Kontakter</TabsTrigger>
          <TabsTrigger value="groups">Grupper</TabsTrigger>
        </TabsList>

        <TabsContent value="contacts" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <Input placeholder="Søk kontakter..." value={search} onChange={e => setSearch(e.target.value)} className="w-full sm:max-w-xs" />
            <div className="flex gap-2">
              <Dialog open={openContact} onOpenChange={setOpenContact}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-1.5"><Plus size={14} /> Ny kontakt</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Ny kontakt</DialogTitle></DialogHeader>
                  <div className="space-y-3">
                    <div><Label>Navn</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
                    <div><Label>Telefon</Label><Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+47..." /></div>
                    <div><Label>Tags (kommaseparert)</Label><Input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="kunde, vip" /></div>
                    <Button onClick={handleAdd} className="w-full">Legg til</Button>
                  </div>
                </DialogContent>
              </Dialog>
              <label className="cursor-pointer">
                <Button size="sm" variant="outline" className="gap-1.5" asChild>
                  <span><Upload size={14} /> CSV</span>
                </Button>
                <input type="file" accept=".csv,.txt" className="hidden" onChange={handleCsvImport} />
              </label>
            </div>
          </div>

          {/* Mobile: card layout */}
          <div className="md:hidden space-y-2">
            {filtered.length === 0 ? (
              <Card className="border-border/20">
                <CardContent className="py-8 text-center text-muted-foreground text-sm">Ingen kontakter</CardContent>
              </Card>
            ) : filtered.map(c => (
              <Card key={c.id} className="border-border/20">
                <CardContent className="p-3">
                  {editId === c.id ? (
                    <div className="space-y-2">
                      <Input value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} className="h-8" placeholder="Navn" />
                      <Input value={editForm.phone} onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))} className="h-8" placeholder="Telefon" />
                      <Input value={editForm.tags} onChange={e => setEditForm(f => ({ ...f, tags: e.target.value }))} className="h-8" placeholder="Tags" />
                      <div className="flex gap-1.5">
                        <Button size="sm" className="gap-1 h-7 text-xs" onClick={() => handleSaveEdit(c.id)}><Save size={12} /> Lagre</Button>
                        <Button size="sm" variant="ghost" className="gap-1 h-7 text-xs" onClick={() => setEditId(null)}><X size={12} /> Avbryt</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{c.name}</p>
                        <div className="flex gap-1">
                          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => { setEditId(c.id); setEditForm({ name: c.name, phone: c.phone, tags: c.tags?.join(", ") || "" }); }}>
                            <Edit2 size={12} />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => handleDelete(c.id)}><Trash2 size={12} /></Button>
                        </div>
                      </div>
                      <p className="text-xs font-mono text-muted-foreground">{c.phone}</p>
                      {c.tags?.length > 0 && (
                        <div className="flex gap-1 flex-wrap">
                          {c.tags.map((t: string) => <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>)}
                        </div>
                      )}
                    </div>
                  )}
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
                  <TableHead>Telefon</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">Ingen kontakter</TableCell></TableRow>
                ) : filtered.map(c => (
                  <TableRow key={c.id}>
                    {editId === c.id ? (
                      <>
                        <TableCell><Input value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} className="h-8" /></TableCell>
                        <TableCell><Input value={editForm.phone} onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))} className="h-8" /></TableCell>
                        <TableCell><Input value={editForm.tags} onChange={e => setEditForm(f => ({ ...f, tags: e.target.value }))} className="h-8" /></TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="icon" variant="ghost" onClick={() => handleSaveEdit(c.id)}><Save size={14} /></Button>
                            <Button size="icon" variant="ghost" onClick={() => setEditId(null)}><X size={14} /></Button>
                          </div>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell>{c.name}</TableCell>
                        <TableCell className="font-mono text-xs">{c.phone}</TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            {c.tags?.map((t: string) => <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="icon" variant="ghost" onClick={() => { setEditId(c.id); setEditForm({ name: c.name, phone: c.phone, tags: c.tags?.join(", ") || "" }); }}><Edit2 size={14} /></Button>
                            <Button size="icon" variant="ghost" onClick={() => handleDelete(c.id)} className="text-destructive"><Trash2 size={14} /></Button>
                          </div>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="groups" className="space-y-4">
          <Dialog open={openGroup} onOpenChange={setOpenGroup}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1.5"><Users size={14} /> Ny gruppe</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Ny kontaktgruppe</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div><Label>Gruppenavn</Label><Input value={groupForm.name} onChange={e => setGroupForm(f => ({ ...f, name: e.target.value }))} /></div>
                <div><Label>Beskrivelse</Label><Input value={groupForm.description} onChange={e => setGroupForm(f => ({ ...f, description: e.target.value }))} /></div>
                <Button onClick={handleAddGroup} className="w-full">Opprett</Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Mobile: card layout */}
          <div className="md:hidden space-y-2">
            {groups.length === 0 ? (
              <Card className="border-border/20">
                <CardContent className="py-8 text-center text-muted-foreground text-sm">Ingen grupper</CardContent>
              </Card>
            ) : groups.map(g => (
              <Card key={g.id} className="border-border/20">
                <CardContent className="p-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{g.name}</p>
                    <p className="text-xs text-muted-foreground">{g.description || "Ingen beskrivelse"}</p>
                  </div>
                  <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive shrink-0" onClick={() => handleDeleteGroup(g.id)}><Trash2 size={12} /></Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Desktop: table */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Gruppe</TableHead>
                  <TableHead>Beskrivelse</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groups.length === 0 ? (
                  <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground py-8">Ingen grupper</TableCell></TableRow>
                ) : groups.map(g => (
                  <TableRow key={g.id}>
                    <TableCell className="font-medium">{g.name}</TableCell>
                    <TableCell className="text-muted-foreground">{g.description || "—"}</TableCell>
                    <TableCell>
                      <Button size="icon" variant="ghost" onClick={() => handleDeleteGroup(g.id)} className="text-destructive"><Trash2 size={14} /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SmsContactsPanel;
