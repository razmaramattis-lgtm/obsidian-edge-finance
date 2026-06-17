export type GlossaryCategory = "regnskap" | "hr" | "marked" | "it";

export const GLOSSARY_CATEGORIES: {
  key: GlossaryCategory;
  label: string;
  short: string;
  // tailwind classes (safe, used in source so JIT picks them up)
  chip: string;
  chipActive: string;
  dot: string;
  badge: string;
  ring: string;
}[] = [
  {
    key: "regnskap",
    label: "Regnskap",
    short: "Regnskap",
    chip: "border-rose-500/20 text-rose-300 hover:bg-rose-500/10",
    chipActive: "bg-rose-500/15 border-rose-500/40 text-rose-200",
    dot: "bg-rose-400",
    badge: "bg-rose-500/10 text-rose-300 border-rose-500/20",
    ring: "ring-rose-500/30",
  },
  {
    key: "hr",
    label: "HR & Personal",
    short: "HR",
    chip: "border-amber-500/20 text-amber-300 hover:bg-amber-500/10",
    chipActive: "bg-amber-500/15 border-amber-500/40 text-amber-200",
    dot: "bg-amber-400",
    badge: "bg-amber-500/10 text-amber-300 border-amber-500/20",
    ring: "ring-amber-500/30",
  },
  {
    key: "marked",
    label: "Marked",
    short: "Marked",
    chip: "border-violet-500/20 text-violet-300 hover:bg-violet-500/10",
    chipActive: "bg-violet-500/15 border-violet-500/40 text-violet-200",
    dot: "bg-violet-400",
    badge: "bg-violet-500/10 text-violet-300 border-violet-500/20",
    ring: "ring-violet-500/30",
  },
  {
    key: "it",
    label: "IT",
    short: "IT",
    chip: "border-cyan-500/20 text-cyan-300 hover:bg-cyan-500/10",
    chipActive: "bg-cyan-500/15 border-cyan-500/40 text-cyan-200",
    dot: "bg-cyan-400",
    badge: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
    ring: "ring-cyan-500/30",
  },
];

export const getCategory = (key?: string | null) =>
  GLOSSARY_CATEGORIES.find((c) => c.key === key) ?? GLOSSARY_CATEGORIES[0];
