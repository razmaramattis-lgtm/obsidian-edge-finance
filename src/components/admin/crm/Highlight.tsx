import { type ReactNode } from "react";
import type { CrmLead } from "./types";

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Uthever søketreff i en tekst slik at man ser hvorfor raden matcher */
export function Highlight({ text, term }: { text: ReactNode; term: string }) {
  const value = typeof text === "string" || typeof text === "number" ? String(text) : null;
  const q = term.trim();
  if (!value || !q) return <>{text}</>;

  // Org.nr søkes uten mellomrom
  const digits = q.replace(/\s/g, "");
  const needle = /^\d{6,9}$/.test(digits) ? digits : q;
  let parts: string[];
  try {
    parts = value.split(new RegExp(`(${escapeRegex(needle)})`, "ig"));
  } catch {
    return <>{value}</>;
  }
  if (parts.length === 1) return <>{value}</>;

  return (
    <>
      {parts.map((p, i) =>
        p.toLowerCase() === needle.toLowerCase() ? (
          <mark key={i} className="bg-primary/25 text-foreground rounded-[3px] px-0.5">{p}</mark>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

const MATCH_FIELDS: { key: keyof CrmLead; label: string }[] = [
  { key: "name", label: "navn" },
  { key: "orgnr", label: "org.nr" },
  { key: "email", label: "e-post" },
  { key: "contact_name", label: "kontaktperson" },
  { key: "municipality", label: "kommune" },
];

/** Hvilke felter i raden som faktisk inneholder søkeordet */
export function matchReasons(lead: CrmLead, term: string): string[] {
  const q = term.trim().toLowerCase();
  if (!q) return [];
  const digits = q.replace(/\s/g, "");
  const needle = /^\d{6,9}$/.test(digits) ? digits : q;
  return MATCH_FIELDS.filter((f) => String((lead as any)[f.key] || "").toLowerCase().includes(needle)).map((f) => f.label);
}
