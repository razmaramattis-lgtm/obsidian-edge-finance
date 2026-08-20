/* Bygger nøyaktig samme e-post-HTML som edge-funksjonen crm-send-email sender ut,
   slik at forhåndsvisningen i CRM viser den faktiske e-posten kunden mottar. */
import { renderBlocks, DEFAULT_DESIGN, type EmailBlock, type EmailDesign } from "./blocks";
import type { CrmLead, CrmTemplate } from "./types";

const esc = (v: unknown) =>
  String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export const DEFAULT_REASON =
  "Du får denne e-posten fordi selskapet ditt er registrert i Brønnøysundregistrene med offentlig tilgjengelig kontaktinformasjon, og vi tror regnskapstjenestene våre kan være relevante for dere.";

export function leadMergeData(lead: Partial<CrmLead> | null): Record<string, string> {
  const l = lead || {};
  const contact = (l.contact_name || "") as string;
  return {
    firma: esc(l.name),
    navn: esc(contact || l.name),
    kontaktperson: esc(contact),
    leder: esc(contact),
    fornavn: esc(contact.trim().split(/\s+/)[0] || ""),
    hilsen: contact ? `Hei, ${esc(contact)}` : "Hei",
    orgnr: esc(l.orgnr),
    kommune: esc(l.municipality || ""),
    bransje: esc(l.industry_text || ""),
    regnskapsforer: esc(l.accountant_name || ""),
    registrert: esc(l.registered_at || ""),
    poststed: esc(l.postal_area || l.municipality || ""),
    selskapsform: esc(l.org_form_text || l.org_form || "selskap"),
    ansatte: esc(l.employees ?? ""),
  };
}

const fill = (html: string, data: Record<string, string>) =>
  html.replace(/\{\{\s*([a-zA-ZæøåÆØÅ_]+)\s*\}\}/g, (m, key) => data[String(key).toLowerCase()] ?? m);

function wrap(bodyHtml: string, reason: string, preheader: string) {
  return `<!DOCTYPE html><html lang="nb"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:Arial,Helvetica,sans-serif;color:#232d2a;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preheader)}</div>
  <div style="max-width:600px;margin:0 auto;padding:32px 24px;">
    <img src="https://avargo.no/logo.png" alt="Avargo Regnskap AS" width="150" style="display:block;border:0;margin-bottom:24px;" />
    <div style="font-size:15px;line-height:1.7;">${bodyHtml}</div>
    <p style="font-size:15px;line-height:1.7;margin:28px 0 0;color:#232d2a;">Hilsen<br><strong>Avargo Regnskap AS</strong><br>tlf. 98 64 23 91<br><a href="mailto:kontakt@avargo.no" style="color:#1b5e4b;text-decoration:none;">kontakt@avargo.no</a></p>
    <p style="font-size:12px;color:#6b7a75;margin:14px 0 0;">Du kan svare direkte på denne e-posten – den går rett til kontakt@avargo.no.</p>
    <div style="margin-top:32px;padding-top:20px;border-top:1px solid #dff5ef;font-size:12px;line-height:1.6;color:#6b7a75;">
      <p style="margin:0 0 8px;"><strong>Hvorfor får du denne e-posten?</strong><br>${esc(reason)}</p>
      <p style="margin:0 0 8px;">Avargo Regnskap AS · Org.nr 938 076 669 · tlf. 98 64 23 91 · <a href="mailto:kontakt@avargo.no" style="color:#1b5e4b;">kontakt@avargo.no</a></p>
      <p style="margin:0;"><a href="#" style="color:#6b7a75;">Meld av videre henvendelser</a> · <a href="https://avargo.no" style="color:#6b7a75;">avargo.no</a></p>
    </div>
  </div>
</body></html>`;
}

export function buildLeadEmail(template: any | CrmTemplate | null, lead: Partial<CrmLead> | null) {
  if (!template) return { subject: "", html: "" };
  const data = leadMergeData(lead);
  const blocks = (Array.isArray((template as any).blocks) ? (template as any).blocks : null) as EmailBlock[] | null;
  const design = { ...DEFAULT_DESIGN, ...(((template as any).design as EmailDesign) || {}) };
  const body = blocks?.length ? renderBlocks(blocks, design) : (template.body_html || "");
  return {
    subject: fill(template.subject || "", data),
    html: wrap(fill(body, data), template.reason || DEFAULT_REASON, fill((template as any).preheader || "", data)),
  };
}
