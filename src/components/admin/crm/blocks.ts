/* Byggeklosser for e-postmaler – lagres som JSON og kompileres til e-postvennlig HTML. */

export type BlockType = "heading" | "text" | "bullets" | "button" | "image" | "divider" | "spacer" | "highlight";

export interface EmailBlock {
  id: string;
  type: BlockType;
  text?: string;
  items?: string[];
  url?: string;
  align?: "left" | "center" | "right";
  size?: "sm" | "md" | "lg";
  src?: string;
  alt?: string;
}

export interface EmailDesign {
  accent: string;
  font: string;
  textColor: string;
  bgColor: string;
}

export const DEFAULT_DESIGN: EmailDesign = {
  accent: "#1b5e4b",
  font: "Arial, Helvetica, sans-serif",
  textColor: "#232d2a",
  bgColor: "#ffffff",
};

export const FONT_OPTIONS = [
  { value: "Arial, Helvetica, sans-serif", label: "Arial (sikrest)" },
  { value: "Georgia, 'Times New Roman', serif", label: "Georgia (serif)" },
  { value: "'Trebuchet MS', Verdana, sans-serif", label: "Trebuchet" },
  { value: "Verdana, Geneva, sans-serif", label: "Verdana" },
];

export const ACCENT_PRESETS = ["#1b5e4b", "#30a684", "#60d1b1", "#232d2a", "#b4763a"];

export const MERGE_FIELDS: { key: string; label: string; sample: string }[] = [
  { key: "firma", label: "Firmanavn", sample: "Eksempel AS" },
  { key: "navn", label: "Navn (kontakt/firma)", sample: "Ola Nordmann" },
  { key: "kontaktperson", label: "Kontaktperson", sample: "Ola Nordmann" },
  { key: "fornavn", label: "Fornavn (daglig leder)", sample: "Ola" },
  { key: "hilsen", label: "Hilsen (Hei, Ola Nordmann)", sample: "Hei, Ola Nordmann" },
  { key: "leder", label: "Daglig leder / eier", sample: "Ola Nordmann" },
  { key: "orgnr", label: "Org.nr", sample: "999 888 777" },
  { key: "kommune", label: "Kommune", sample: "Kongsvinger" },
  { key: "poststed", label: "Poststed", sample: "Kongsvinger" },
  { key: "bransje", label: "Bransje", sample: "Bygg og anlegg" },
  { key: "selskapsform", label: "Selskapsform", sample: "AS" },
  { key: "ansatte", label: "Antall ansatte", sample: "4" },
  { key: "regnskapsforer", label: "Dagens regnskapsfører", sample: "Regnskap Nord AS" },
  { key: "registrert", label: "Registrert dato", sample: "01.01.2026" },
];

export const BLOCK_LABELS: Record<BlockType, string> = {
  heading: "Overskrift",
  text: "Tekst",
  bullets: "Punktliste",
  button: "Knapp",
  image: "Bilde",
  highlight: "Uthevet boks",
  divider: "Skillelinje",
  spacer: "Luft",
};

const uid = () => Math.random().toString(36).slice(2, 10);

export const newBlock = (type: BlockType): EmailBlock => {
  const base = { id: uid(), type, align: "left" as const };
  switch (type) {
    case "heading": return { ...base, type, text: "Ny overskrift", size: "lg" };
    case "text": return { ...base, type, text: "Skriv teksten din her. Bruk flettefelt som {{ firma }} for å gjøre e-posten personlig." };
    case "bullets": return { ...base, type, items: ["Første punkt", "Andre punkt", "Tredje punkt"] };
    case "button": return { ...base, type, text: "Book et møte", url: "https://avargo.no/book-mote", align: "left" };
    case "image": return { ...base, type, src: "", alt: "Bilde" };
    case "highlight": return { ...base, type, text: "Fast pris fra 1 490 kr/mnd – ingen bindingstid." };
    case "spacer": return { ...base, type, size: "md" };
    default: return { ...base, type };
  }
};

const esc = (v: unknown) =>
  String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Tillater flettefelt i escapet tekst og gjør linjeskift til <br>. */
const inline = (v: string) => esc(v).replace(/\r?\n/g, "<br>");

const HEADING_SIZE: Record<string, string> = { sm: "17px", md: "20px", lg: "24px" };
const SPACER_SIZE: Record<string, string> = { sm: "8px", md: "20px", lg: "40px" };

export function renderBlocks(blocks: EmailBlock[], design: EmailDesign = DEFAULT_DESIGN): string {
  const d = { ...DEFAULT_DESIGN, ...design };
  return (blocks || [])
    .map((b) => {
      const align = b.align || "left";
      switch (b.type) {
        case "heading":
          return `<h2 style="margin:0 0 14px;font-family:${d.font};font-size:${HEADING_SIZE[b.size || "lg"]};line-height:1.3;color:${d.textColor};text-align:${align};font-weight:700;">${inline(b.text || "")}</h2>`;
        case "text":
          return `<p style="margin:0 0 16px;font-family:${d.font};font-size:15px;line-height:1.7;color:${d.textColor};text-align:${align};">${inline(b.text || "")}</p>`;
        case "bullets":
          return `<ul style="margin:0 0 16px;padding-left:20px;font-family:${d.font};font-size:15px;line-height:1.7;color:${d.textColor};">${(b.items || [])
            .filter((i) => i.trim())
            .map((i) => `<li style="margin:0 0 6px;">${inline(i)}</li>`)
            .join("")}</ul>`;
        case "button":
          return `<div style="margin:0 0 20px;text-align:${align};"><a href="${esc(b.url || "#")}" style="display:inline-block;background:${d.accent};color:#ffffff;font-family:${d.font};font-size:15px;font-weight:700;text-decoration:none;padding:13px 26px;border-radius:999px;">${inline(b.text || "Klikk her")}</a></div>`;
        case "image":
          return b.src
            ? `<div style="margin:0 0 18px;text-align:${align};"><img src="${esc(b.src)}" alt="${esc(b.alt || "")}" width="552" style="max-width:100%;height:auto;display:inline-block;border:0;border-radius:12px;" /></div>`
            : "";
        case "highlight":
          return `<div style="margin:0 0 18px;padding:16px 18px;background:#dff5ef;border-left:4px solid ${d.accent};border-radius:10px;font-family:${d.font};font-size:15px;line-height:1.7;color:${d.textColor};text-align:${align};">${inline(b.text || "")}</div>`;
        case "divider":
          return `<hr style="border:0;border-top:1px solid #dff5ef;margin:22px 0;" />`;
        case "spacer":
          return `<div style="height:${SPACER_SIZE[b.size || "md"]};line-height:${SPACER_SIZE[b.size || "md"]};font-size:0;">&nbsp;</div>`;
        default:
          return "";
      }
    })
    .join("\n");
}

export const sampleData = (): Record<string, string> =>
  Object.fromEntries(MERGE_FIELDS.map((f) => [f.key, f.sample]));

export function fillMergeFields(html: string, data: Record<string, string> = sampleData()) {
  return html.replace(/\{\{\s*([a-zA-ZæøåÆØÅ_]+)\s*\}\}/g, (m, key) => data[String(key).toLowerCase()] ?? m);
}

/** Fallback: gjør eksisterende HTML-maler om til blokker slik at de kan redigeres visuelt. */
export function htmlToBlocks(html: string): EmailBlock[] {
  if (!html?.trim()) return [newBlock("heading"), newBlock("text")];
  const chunks = html
    .replace(/<br\s*\/?>/gi, "\n")
    .split(/<\/(?:p|h1|h2|h3|div|ul)>/i)
    .map((c) => c.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim())
    .filter(Boolean);
  if (!chunks.length) return [newBlock("text")];
  return chunks.map((c, i) => ({ ...newBlock(i === 0 ? "heading" : "text"), text: c }));
}
