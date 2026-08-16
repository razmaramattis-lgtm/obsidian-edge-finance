import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Type, AlignLeft, List, MousePointerClick, Image as ImageIcon, Minus, MoveVertical,
  Sparkles, ArrowUp, ArrowDown, Copy, Trash2, GripVertical,
} from "lucide-react";
import {
  BLOCK_LABELS, MERGE_FIELDS, ACCENT_PRESETS, FONT_OPTIONS, newBlock,
  type BlockType, type EmailBlock, type EmailDesign,
} from "./blocks";

const PALETTE: { type: BlockType; icon: typeof Type }[] = [
  { type: "heading", icon: Type },
  { type: "text", icon: AlignLeft },
  { type: "bullets", icon: List },
  { type: "button", icon: MousePointerClick },
  { type: "highlight", icon: Sparkles },
  { type: "image", icon: ImageIcon },
  { type: "divider", icon: Minus },
  { type: "spacer", icon: MoveVertical },
];

interface Props {
  blocks: EmailBlock[];
  design: EmailDesign;
  onBlocksChange: (b: EmailBlock[]) => void;
  onDesignChange: (d: EmailDesign) => void;
}

const BlockEditor = ({ blocks, design, onBlocksChange, onDesignChange }: Props) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const fieldRefs = useRef<Record<string, HTMLTextAreaElement | HTMLInputElement | null>>({});
  const lastFocused = useRef<string | null>(null);

  const update = (id: string, patch: Partial<EmailBlock>) =>
    onBlocksChange(blocks.map((b) => (b.id === id ? { ...b, ...patch } : b)));

  const move = (index: number, dir: -1 | 1) => {
    const next = [...blocks];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onBlocksChange(next);
  };

  const duplicate = (b: EmailBlock) => {
    const i = blocks.findIndex((x) => x.id === b.id);
    const copy = { ...b, id: Math.random().toString(36).slice(2, 10) };
    onBlocksChange([...blocks.slice(0, i + 1), copy, ...blocks.slice(i + 1)]);
  };

  const remove = (id: string) => onBlocksChange(blocks.filter((b) => b.id !== id));

  const add = (type: BlockType) => {
    const b = newBlock(type);
    const i = activeId ? blocks.findIndex((x) => x.id === activeId) : blocks.length - 1;
    onBlocksChange([...blocks.slice(0, i + 1), b, ...blocks.slice(i + 1)]);
    setActiveId(b.id);
  };

  /** Setter inn {{ felt }} der markøren står i sist brukte tekstfelt. */
  const insertMerge = (key: string) => {
    const token = `{{ ${key} }}`;
    const refKey = lastFocused.current;
    const el = refKey ? fieldRefs.current[refKey] : null;
    if (!el || !refKey) return;
    const [blockId, kind, idxStr] = refKey.split("::");
    const start = el.selectionStart ?? el.value.length;
    const end = el.selectionEnd ?? start;
    const value = el.value.slice(0, start) + token + el.value.slice(end);
    const block = blocks.find((b) => b.id === blockId);
    if (!block) return;
    if (kind === "item") {
      const items = [...(block.items || [])];
      items[Number(idxStr)] = value;
      update(blockId, { items });
    } else {
      update(blockId, { [kind]: value } as Partial<EmailBlock>);
    }
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + token.length, start + token.length);
    });
  };

  const bindField = (key: string) => ({
    ref: (el: HTMLTextAreaElement | HTMLInputElement | null) => { fieldRefs.current[key] = el; },
    onFocus: () => { lastFocused.current = key; },
  });

  return (
    <div className="space-y-3">
      {/* design */}
      <div className="rounded-xl border border-border p-3 grid gap-3 sm:grid-cols-3">
        <div>
          <Label className="text-[11px] text-muted-foreground">Farge</Label>
          <div className="flex items-center gap-1.5 mt-1.5">
            {ACCENT_PRESETS.map((c) => (
              <button key={c} type="button" onClick={() => onDesignChange({ ...design, accent: c })}
                aria-label={`Farge ${c}`}
                className={`h-6 w-6 rounded-full border-2 transition ${design.accent === c ? "border-foreground scale-110" : "border-transparent"}`}
                style={{ background: c }} />
            ))}
            <input type="color" value={design.accent} aria-label="Egen farge"
              onChange={(e) => onDesignChange({ ...design, accent: e.target.value })}
              className="h-6 w-8 rounded border border-border bg-transparent" />
          </div>
        </div>
        <div>
          <Label className="text-[11px] text-muted-foreground">Skrift</Label>
          <Select value={design.font} onValueChange={(v) => onDesignChange({ ...design, font: v })}>
            <SelectTrigger className="h-8 text-xs mt-1.5" aria-label="Skrifttype"><SelectValue /></SelectTrigger>
            <SelectContent>{FONT_OPTIONS.map((f) => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-[11px] text-muted-foreground">Tekstfarge</Label>
          <div className="flex items-center gap-2 mt-1.5">
            <input type="color" value={design.textColor} aria-label="Tekstfarge"
              onChange={(e) => onDesignChange({ ...design, textColor: e.target.value })}
              className="h-8 w-12 rounded border border-border bg-transparent" />
            <span className="text-[11px] text-muted-foreground">{design.textColor}</span>
          </div>
        </div>
      </div>

      {/* merge fields */}
      <div className="rounded-xl border border-border p-3">
        <Label className="text-[11px] text-muted-foreground">Flettefelt – klikk i et tekstfelt, så på feltet du vil sette inn</Label>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {MERGE_FIELDS.map((f) => (
            <button key={f.key} type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => insertMerge(f.key)}
              className="px-2.5 py-1 rounded-full border border-border text-[11px] text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors">
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* blocks */}
      <div className="space-y-2">
        {blocks.map((b, i) => (
          <div key={b.id} onClick={() => setActiveId(b.id)}
            className={`rounded-xl border p-3 transition-colors ${activeId === b.id ? "border-primary/50 bg-primary/[0.03]" : "border-border"}`}>
            <div className="flex items-center gap-2 mb-2">
              <GripVertical size={13} className="text-muted-foreground/50" />
              <span className="text-[11px] font-medium">{BLOCK_LABELS[b.type]}</span>
              <div className="flex-1" />
              {(b.type === "heading" || b.type === "text" || b.type === "button" || b.type === "image" || b.type === "highlight") && (
                <Select value={b.align || "left"} onValueChange={(v) => update(b.id, { align: v as EmailBlock["align"] })}>
                  <SelectTrigger className="h-7 w-[104px] text-[11px]" aria-label="Justering"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Venstre</SelectItem>
                    <SelectItem value="center">Midtstilt</SelectItem>
                    <SelectItem value="right">Høyre</SelectItem>
                  </SelectContent>
                </Select>
              )}
              {(b.type === "heading" || b.type === "spacer") && (
                <Select value={b.size || (b.type === "heading" ? "lg" : "md")} onValueChange={(v) => update(b.id, { size: v as EmailBlock["size"] })}>
                  <SelectTrigger className="h-7 w-[92px] text-[11px]" aria-label="Størrelse"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sm">Liten</SelectItem>
                    <SelectItem value="md">Medium</SelectItem>
                    <SelectItem value="lg">Stor</SelectItem>
                  </SelectContent>
                </Select>
              )}
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => move(i, -1)} aria-label="Flytt opp"><ArrowUp size={13} /></Button>
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => move(i, 1)} aria-label="Flytt ned"><ArrowDown size={13} /></Button>
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => duplicate(b)} aria-label="Dupliser"><Copy size={13} /></Button>
              <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => remove(b.id)} aria-label="Slett blokk"><Trash2 size={13} /></Button>
            </div>

            {b.type === "heading" && (
              <Input value={b.text || ""} {...bindField(`${b.id}::text`)} className="h-9 text-sm"
                onChange={(e) => update(b.id, { text: e.target.value })} aria-label="Overskriftstekst" />
            )}

            {(b.type === "text" || b.type === "highlight") && (
              <Textarea rows={b.type === "text" ? 4 : 2} value={b.text || ""} {...bindField(`${b.id}::text`)}
                onChange={(e) => update(b.id, { text: e.target.value })} className="text-sm" aria-label="Tekst" />
            )}

            {b.type === "bullets" && (
              <div className="space-y-1.5">
                {(b.items || []).map((it, idx) => (
                  <div key={idx} className="flex gap-1.5">
                    <Input value={it} {...bindField(`${b.id}::item::${idx}`)} className="h-8 text-xs"
                      aria-label={`Punkt ${idx + 1}`}
                      onChange={(e) => {
                        const items = [...(b.items || [])]; items[idx] = e.target.value; update(b.id, { items });
                      }} />
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive shrink-0" aria-label="Fjern punkt"
                      onClick={() => update(b.id, { items: (b.items || []).filter((_, x) => x !== idx) })}><Trash2 size={12} /></Button>
                  </div>
                ))}
                <Button size="sm" variant="outline" className="h-7 text-[11px]"
                  onClick={() => update(b.id, { items: [...(b.items || []), "Nytt punkt"] })}>Legg til punkt</Button>
              </div>
            )}

            {b.type === "button" && (
              <div className="grid gap-2 sm:grid-cols-2">
                <Input value={b.text || ""} {...bindField(`${b.id}::text`)} placeholder="Knappetekst" className="h-8 text-xs"
                  onChange={(e) => update(b.id, { text: e.target.value })} aria-label="Knappetekst" />
                <Input value={b.url || ""} {...bindField(`${b.id}::url`)} placeholder="https://avargo.no/..." className="h-8 text-xs"
                  onChange={(e) => update(b.id, { url: e.target.value })} aria-label="Lenke" />
              </div>
            )}

            {b.type === "image" && (
              <div className="grid gap-2 sm:grid-cols-2">
                <Input value={b.src || ""} placeholder="Bilde-URL (https://…)" className="h-8 text-xs"
                  onChange={(e) => update(b.id, { src: e.target.value })} aria-label="Bilde-URL" />
                <Input value={b.alt || ""} placeholder="Alt-tekst" className="h-8 text-xs"
                  onChange={(e) => update(b.id, { alt: e.target.value })} aria-label="Alt-tekst" />
              </div>
            )}

            {(b.type === "divider" || b.type === "spacer") && (
              <p className="text-[11px] text-muted-foreground">Ingen innstillinger utover dette.</p>
            )}
          </div>
        ))}
      </div>

      {/* palette */}
      <div className="rounded-xl border border-dashed border-border p-3">
        <Label className="text-[11px] text-muted-foreground">Legg til blokk</Label>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {PALETTE.map(({ type, icon: Icon }) => (
            <button key={type} type="button" onClick={() => add(type)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-[11px] hover:border-primary/50 hover:bg-primary/5 transition-colors">
              <Icon size={12} />{BLOCK_LABELS[type]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlockEditor;
