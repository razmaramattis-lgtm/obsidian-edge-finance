import { describe, it, expect } from "vitest";
import { isValidElement, type ReactElement, type ReactNode } from "react";
import { ProtokollDocument } from "./pdf";
import { emptyProfile, emptyDocument, type CompanyProfile, type DocumentType } from "./types";

/**
 * Går rekursivt gjennom et React-element-tre og samler all tekst.
 * Kjører også `render`-prop på @react-pdf sine <Text> for å fange dynamisk
 * innhold som sidetall.
 */
function collectText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(collectText).join(" ");
  if (isValidElement(node)) {
    const el = node as ReactElement<{ children?: ReactNode; render?: (info: { pageNumber: number; totalPages: number }) => ReactNode }>;
    // Funksjonelle komponenter: kall funksjonen for å hente ut JSX
    if (typeof el.type === "function") {
      const rendered = (el.type as (p: unknown) => ReactNode)(el.props);
      return collectText(rendered);
    }
    let out = "";
    if (typeof el.props?.render === "function") {
      out += " " + collectText(el.props.render({ pageNumber: 1, totalPages: 1 }));
    }
    if (el.props?.children !== undefined) out += " " + collectText(el.props.children);
    return out;
  }
  return "";
}

function build(type: DocumentType, patch?: (p: CompanyProfile) => CompanyProfile): { profile: CompanyProfile; doc: ReturnType<typeof emptyDocument> } {
  let profile = emptyProfile();
  profile.selskap.navn = "Testselskap AS";
  profile.selskap.orgnummer = "999888777";
  if (patch) profile = patch(profile);
  return { profile, doc: emptyDocument(type) };
}

describe("ProtokollDocument (regresjon)", () => {
  it("gjengir Avargo-fotnoten på styremøteprotokoll", () => {
    const { profile, doc } = build("styremoteprotokoll");
    const text = collectText(ProtokollDocument({ profile, doc }));
    expect(text).toContain("Protokoll- og generalforsamlingsgenerator er produsert av Avargo.");
  });

  it("gjengir Avargo-fotnoten på generalforsamling (forenklet)", () => {
    const { profile, doc } = build("gf_forenklet");
    const text = collectText(ProtokollDocument({ profile, doc }));
    expect(text).toContain("Protokoll- og generalforsamlingsgenerator er produsert av Avargo.");
  });

  it("gjengir Avargo-fotnoten på generalforsamling (alminnelig)", () => {
    const { profile, doc } = build("gf_alminnelige_regler");
    const text = collectText(ProtokollDocument({ profile, doc }));
    expect(text).toContain("Protokoll- og generalforsamlingsgenerator er produsert av Avargo.");
  });

  it("bruker nyeste props hver gang komponenten instansieres (styremøte)", () => {
    const first = build("styremoteprotokoll", p => ({ ...p, selskap: { ...p.selskap, navn: "Alfa AS", orgnummer: "111111111" } }));
    const t1 = collectText(ProtokollDocument({ profile: first.profile, doc: first.doc }));
    expect(t1).toContain("Alfa AS");
    expect(t1).toContain("111111111");

    const second = build("styremoteprotokoll", p => ({ ...p, selskap: { ...p.selskap, navn: "Beta AS", orgnummer: "222222222" } }));
    const t2 = collectText(ProtokollDocument({ profile: second.profile, doc: second.doc }));
    expect(t2).toContain("Beta AS");
    expect(t2).toContain("222222222");
    expect(t2).not.toContain("Alfa AS");
    expect(t2).not.toContain("111111111");
  });

  it("bruker nyeste props hver gang komponenten instansieres (generalforsamling)", () => {
    const a = build("gf_alminnelige_regler", p => ({ ...p, selskap: { ...p.selskap, navn: "Gamma AS" } }));
    const b = build("gf_alminnelige_regler", p => ({ ...p, selskap: { ...p.selskap, navn: "Delta AS" } }));
    expect(collectText(ProtokollDocument({ profile: a.profile, doc: a.doc }))).toContain("Gamma AS");
    const t = collectText(ProtokollDocument({ profile: b.profile, doc: b.doc }));
    expect(t).toContain("Delta AS");
    expect(t).not.toContain("Gamma AS");
  });

  it("reflekterer endringer i regnskapstall i generalforsamlingsprotokoll", () => {
    const { profile, doc } = build("gf_alminnelige_regler");
    profile.regnskap.arets_resultat = 123456;
    profile.regnskap.utbytte = 50000;
    const text = collectText(ProtokollDocument({ profile, doc }));
    // nb-NO-formatering bruker non-breaking space; sjekk kun sifrene
    expect(text.replace(/\s/g, "")).toContain("123456");
    expect(text.replace(/\s/g, "")).toContain("50000");
  });
});
