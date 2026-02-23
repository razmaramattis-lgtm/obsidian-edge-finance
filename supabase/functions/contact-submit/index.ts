import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SECTION_LABELS: Record<string, string> = {
  regnskap: "Regnskap",
  hr: "Personal (HR)",
  markedsforing: "Markedsføring",
  it: "IT & Utvikling",
};

// Minimal SMTP client using Deno TLS
async function sendEmail(opts: {
  hostname: string;
  port: number;
  username: string;
  password: string;
  from: string;
  to: string;
  subject: string;
  html: string;
}) {
  const conn = await Deno.connectTls({ hostname: opts.hostname, port: opts.port });
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  async function readResponse(): Promise<string> {
    let result = "";
    const buf = new Uint8Array(4096);
    while (true) {
      const n = await conn.read(buf);
      if (!n) break;
      result += decoder.decode(buf.subarray(0, n));
      const lines = result.trim().split("\r\n");
      const lastLine = lines[lines.length - 1];
      if (/^\d{3} /.test(lastLine) || !/^\d{3}/.test(lastLine)) break;
    }
    return result;
  }

  async function send(cmd: string): Promise<string> {
    await conn.write(encoder.encode(cmd + "\r\n"));
    const resp = await readResponse();
    console.log(`SMTP > ${cmd.startsWith("AUTH") || cmd === btoa(opts.password) ? "[REDACTED]" : cmd}`);
    console.log(`SMTP < ${resp.trim()}`);
    return resp;
  }

  try {
    const greeting = await readResponse();
    console.log("SMTP greeting:", greeting.trim());

    await send("EHLO localhost");
    
    const authResp = await send("AUTH LOGIN");
    if (!authResp.startsWith("334")) throw new Error("AUTH LOGIN failed: " + authResp);
    
    const userResp = await send(btoa(opts.username));
    if (!userResp.startsWith("334")) throw new Error("AUTH username failed: " + userResp);
    
    const passResp = await send(btoa(opts.password));
    if (!passResp.startsWith("235")) throw new Error("AUTH password failed: " + passResp);

    await send(`MAIL FROM:<${opts.from}>`);
    await send(`RCPT TO:<${opts.to}>`);
    await send("DATA");

    const message = [
      `From: Avargo <${opts.from}>`,
      `Reply-To: kontakt@avargo.no`,
      `To: ${opts.to}`,
      `Subject: ${opts.subject}`,
      `MIME-Version: 1.0`,
      `Content-Type: text/html; charset=UTF-8`,
      `List-Unsubscribe: <mailto:kontakt@avargo.no?subject=Unsubscribe>`,
      `List-Unsubscribe-Post: List-Unsubscribe=One-Click`,
      ``,
      opts.html,
      `.`,
    ].join("\r\n");

    const result = await send(message);
    await send("QUIT");
    return result;
  } finally {
    try { conn.close(); } catch { /* ignore */ }
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const {
      company_name, org_number, contact_person, email, phone,
      industry, industry_code, revenue_target, message, package: pkg,
      section,
    } = body;

    const sectionLabel = section ? SECTION_LABELS[section] || section : null;

    // Save to database
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error: dbError } = await supabase
      .from("contact_submissions")
      .insert({
        company_name, org_number, contact_person, email, phone,
        industry, industry_code, revenue_target, message, package: pkg,
        section: section || null,
      });

    if (dbError) console.error("DB error:", dbError);

    // Send email
    const smtpUser = Deno.env.get("SMTP_USER");
    const smtpPass = Deno.env.get("SMTP_PASS");

    let emailSent = false;

    if (smtpUser && smtpPass) {
      try {
        const now = new Date().toLocaleDateString("nb-NO", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
        
        const sectionBadge = sectionLabel
          ? `<div style="display:inline-block;background:#f0fdf4;color:#166534;padding:6px 14px;border-radius:20px;font-size:13px;font-weight:600;margin-bottom:12px;margin-right:8px;">📍 ${sectionLabel}</div>`
          : "";

        const htmlBody = `
          <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:640px;margin:0 auto;background:#ffffff;">
            <!-- Header -->
            <div style="background:linear-gradient(135deg,#1a1a2e,#16213e);padding:28px 32px;border-radius:12px 12px 0 0;">
              <h1 style="color:#ffffff;margin:0;font-size:20px;font-weight:600;letter-spacing:-0.3px;">📬 Ny henvendelse</h1>
              <p style="color:#94a3b8;margin:6px 0 0;font-size:13px;">${now}${sectionLabel ? ` · Avdeling: ${sectionLabel}` : ""}</p>
            </div>

            <div style="padding:28px 32px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;">
              <!-- Section + Pakke badges -->
              ${sectionBadge}
              ${pkg ? `<div style="display:inline-block;background:#eef2ff;color:#4338ca;padding:6px 14px;border-radius:20px;font-size:13px;font-weight:600;margin-bottom:20px;">🏷️ ${pkg}</div>` : ""}

              <!-- Selskapsinfo -->
              <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:20px;margin-bottom:20px;">
                <h2 style="margin:0 0 14px;font-size:15px;color:#475569;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">🏢 Selskap</h2>
                <div style="font-size:18px;font-weight:700;color:#0f172a;margin-bottom:4px;">${company_name || "Ikke oppgitt"}</div>
                ${org_number ? `<div style="font-size:13px;color:#64748b;">Org.nr: ${org_number}</div>` : ""}
                ${industry ? `<div style="margin-top:8px;"><span style="display:inline-block;background:#f1f5f9;color:#475569;padding:3px 10px;border-radius:12px;font-size:12px;">${industry}</span></div>` : ""}
                ${industry_code ? `<div style="margin-top:4px;font-size:12px;color:#94a3b8;">Næringskode: ${industry_code}</div>` : ""}
              </div>

              <!-- Kontaktinfo -->
              <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:20px;margin-bottom:20px;">
                <h2 style="margin:0 0 14px;font-size:15px;color:#475569;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">👤 Kontaktperson</h2>
                <div style="font-size:16px;font-weight:600;color:#0f172a;margin-bottom:10px;">${contact_person || "Ikke oppgitt"}</div>
                <table style="border-collapse:collapse;">
                  ${email ? `<tr><td style="padding:4px 12px 4px 0;color:#64748b;font-size:13px;">📧</td><td style="padding:4px 0;"><a href="mailto:${email}" style="color:#2563eb;text-decoration:none;font-size:14px;">${email}</a></td></tr>` : ""}
                  ${phone ? `<tr><td style="padding:4px 12px 4px 0;color:#64748b;font-size:13px;">📱</td><td style="padding:4px 0;"><a href="tel:${phone}" style="color:#2563eb;text-decoration:none;font-size:14px;">${phone}</a></td></tr>` : ""}
                </table>
              </div>

              <!-- Omsetningsmål -->
              ${revenue_target ? `
              <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:16px 20px;margin-bottom:20px;">
                <span style="font-size:13px;color:#92400e;font-weight:600;">💰 Omsetningsmål:</span>
                <span style="font-size:14px;color:#78350f;margin-left:6px;">${revenue_target}</span>
              </div>` : ""}

              <!-- Melding -->
              ${message ? `
              <div style="margin-bottom:20px;">
                <h2 style="margin:0 0 10px;font-size:15px;color:#475569;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">💬 Melding fra kunden</h2>
                <div style="background:#f0fdf4;border-left:4px solid #22c55e;padding:16px 20px;border-radius:0 10px 10px 0;font-size:14px;line-height:1.7;color:#1e293b;">${message}</div>
              </div>` : ""}

              <!-- Footer -->
              <div style="margin-top:28px;padding-top:16px;border-top:1px solid #e2e8f0;text-align:center;">
                <p style="font-size:12px;color:#94a3b8;margin:0;">Sendt fra kontaktskjemaet på <strong>avargo.no</strong>${sectionLabel ? ` · Avdeling: ${sectionLabel}` : ""}</p>
              </div>
            </div>
          </div>`;

        await sendEmail({
          hostname: "smtp.domeneshop.no",
          port: 465,
          username: smtpUser,
          password: smtpPass,
          from: "kontakt@avargo.no",
          to: "kontakt@avargo.no",
          subject: `${sectionLabel ? `[${sectionLabel}] ` : ""}Ny henvendelse: ${company_name || contact_person || "Ukjent"}`,
          html: htmlBody,
        });
        emailSent = true;
      } catch (emailErr) {
        console.error("Email error:", emailErr);
      }
    }

    return new Response(
      JSON.stringify({ success: true, email_sent: emailSent }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in contact-submit:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
