import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
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
    // Read until we get a complete response (line starting with "NNN " not "NNN-")
    while (true) {
      const n = await conn.read(buf);
      if (!n) break;
      result += decoder.decode(buf.subarray(0, n));
      const lines = result.trim().split("\r\n");
      const lastLine = lines[lines.length - 1];
      // SMTP multi-line responses use "NNN-" continuation, final line uses "NNN "
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
    // Read server greeting
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
      `From: ${opts.from}`,
      `To: ${opts.to}`,
      `Subject: ${opts.subject}`,
      `MIME-Version: 1.0`,
      `Content-Type: text/html; charset=UTF-8`,
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
    } = body;

    // Save to database
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error: dbError } = await supabase
      .from("contact_submissions")
      .insert({
        company_name, org_number, contact_person, email, phone,
        industry, industry_code, revenue_target, message, package: pkg,
      });

    if (dbError) console.error("DB error:", dbError);

    // Send email
    const smtpUser = Deno.env.get("SMTP_USER");
    const smtpPass = Deno.env.get("SMTP_PASS");

    let emailSent = false;

    if (smtpUser && smtpPass) {
      try {
        const htmlBody = `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
            <h2 style="color:#1a1a1a;border-bottom:2px solid #e5e5e5;padding-bottom:10px;">Ny henvendelse fra kontaktskjemaet</h2>
            ${pkg ? `<div style="background:#f0f4ff;padding:10px 15px;border-radius:8px;margin-bottom:20px;"><strong>Valgt pakke:</strong> ${pkg}</div>` : ""}
            <table style="width:100%;border-collapse:collapse;">
              <tr style="border-bottom:1px solid #eee;"><td style="padding:10px 0;color:#666;width:160px;"><strong>Selskapsnavn</strong></td><td style="padding:10px 0;">${company_name || "—"}</td></tr>
              <tr style="border-bottom:1px solid #eee;"><td style="padding:10px 0;color:#666;"><strong>Org.nummer</strong></td><td style="padding:10px 0;">${org_number || "—"}</td></tr>
              <tr style="border-bottom:1px solid #eee;"><td style="padding:10px 0;color:#666;"><strong>Kontaktperson</strong></td><td style="padding:10px 0;">${contact_person || "—"}</td></tr>
              <tr style="border-bottom:1px solid #eee;"><td style="padding:10px 0;color:#666;"><strong>E-post</strong></td><td style="padding:10px 0;"><a href="mailto:${email}">${email || "—"}</a></td></tr>
              <tr style="border-bottom:1px solid #eee;"><td style="padding:10px 0;color:#666;"><strong>Telefon</strong></td><td style="padding:10px 0;"><a href="tel:${phone}">${phone || "—"}</a></td></tr>
              <tr style="border-bottom:1px solid #eee;"><td style="padding:10px 0;color:#666;"><strong>Bransje</strong></td><td style="padding:10px 0;">${industry || "—"}</td></tr>
              <tr style="border-bottom:1px solid #eee;"><td style="padding:10px 0;color:#666;"><strong>Næringskode</strong></td><td style="padding:10px 0;">${industry_code || "—"}</td></tr>
              <tr style="border-bottom:1px solid #eee;"><td style="padding:10px 0;color:#666;"><strong>Omsetningsmål</strong></td><td style="padding:10px 0;">${revenue_target || "—"}</td></tr>
            </table>
            ${message ? `<div style="margin-top:20px;"><strong style="color:#666;">Hva er viktigst for kunden:</strong><div style="background:#f9f9f9;padding:15px;border-radius:8px;margin-top:8px;line-height:1.6;">${message}</div></div>` : ""}
            <div style="margin-top:30px;padding-top:15px;border-top:1px solid #eee;font-size:12px;color:#999;">Sendt fra kontaktskjemaet på avargo.no</div>
          </div>`;

        await sendEmail({
          hostname: "smtp.domeneshop.no",
          port: 465,
          username: smtpUser,
          password: smtpPass,
          from: "kontakt@avargo.no",
          to: "kontakt@avargo.no",
          subject: `Ny henvendelse: ${company_name || contact_person || "Ukjent"}`,
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
