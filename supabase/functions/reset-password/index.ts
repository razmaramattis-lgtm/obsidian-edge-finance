import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function sendEmail(opts: {
  hostname: string; port: number; username: string; password: string;
  from: string; to: string; subject: string; html: string;
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
    return await readResponse();
  }

  try {
    await readResponse();
    await send("EHLO localhost");
    const authResp = await send("AUTH LOGIN");
    if (!authResp.startsWith("334")) throw new Error("AUTH LOGIN failed");
    const userResp = await send(btoa(opts.username));
    if (!userResp.startsWith("334")) throw new Error("AUTH user failed");
    const passResp = await send(btoa(opts.password));
    if (!passResp.startsWith("235")) throw new Error("AUTH pass failed");
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
      ``,
      opts.html,
      `.`,
    ].join("\r\n");
    const sendResp = await send(message);
    if (sendResp.startsWith("5")) throw new Error("SMTP rejected: " + sendResp.trim());
    await send("QUIT");
  } finally {
    try { conn.close(); } catch { /* ignore */ }
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();
    if (!email || typeof email !== "string") {
      return new Response(
        JSON.stringify({ success: false, error: "E-post er påkrevd" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: userData, error: userError } = await supabase.auth.admin.listUsers();
    if (userError) throw userError;

    const user = userData.users.find(
      (u) => u.email?.toLowerCase() === normalizedEmail
    );

    if (!user) {
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
      type: "recovery",
      email: normalizedEmail,
    });

    if (linkError || !linkData.properties?.action_link) {
      throw new Error(linkError?.message || "Kunne ikke generere sikker tilbakestillingslenke");
    }

    const smtpUser = Deno.env.get("SMTP_USER");
    const smtpPass = Deno.env.get("SMTP_PASS");

    if (smtpUser && smtpPass) {
      const wrappedLink = `https://avargo.no/auth/bekreft?to=${encodeURIComponent(linkData.properties.action_link)}`;
      const htmlBody = `
        <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:520px;margin:0 auto;background:#ffffff;">
          <div style="background:linear-gradient(135deg,#1a1a2e,#16213e);padding:28px 32px;border-radius:12px 12px 0 0;">
            <h1 style="color:#ffffff;margin:0;font-size:20px;font-weight:600;">🔐 Sikker tilbakestilling</h1>
          </div>
          <div style="padding:28px 32px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;">
            <p style="color:#334155;font-size:14px;line-height:1.7;margin:0 0 20px;">Hei! Du har bedt om å tilbakestille passordet ditt hos Avargo. Av sikkerhetsgrunner sender vi ikke passord på e-post.</p>
            <div style="text-align:center;margin:24px 0;">
              <a href="${wrappedLink}" style="display:inline-block;background:#0f172a;color:#ffffff;text-decoration:none;padding:14px 24px;border-radius:10px;font-weight:600;">Åpne sikker lenke</a>
            </div>
            <p style="color:#64748b;font-size:13px;line-height:1.6;margin:0 0 12px;">Du blir bedt om å bekrefte ett ekstra klikk før du videresendes. Dette beskytter lenken mot automatiske skannere i Outlook/Gmail som ellers kan «brenne» den før du rekker å bruke den.</p>
            <p style="color:#64748b;font-size:13px;line-height:1.6;margin:0;">Lenken kan kun brukes én gang. Hvis du ikke ba om dette, kan du se bort fra e-posten.</p>
            <div style="margin-top:24px;padding-top:16px;border-top:1px solid #e2e8f0;text-align:center;">
              <p style="font-size:12px;color:#94a3b8;margin:0;">Sendt fra <strong>Avargo</strong> · kontakt@avargo.no til ${escapeHtml(normalizedEmail)}</p>
            </div>
          </div>
        </div>`;

      await sendEmail({
        hostname: "smtp.domeneshop.no",
        port: 465,
        username: smtpUser,
        password: smtpPass,
        from: "kontakt@avargo.no",
        to: normalizedEmail,
        subject: "Avargo — Sikker tilbakestilling",
        html: htmlBody,
      });
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Reset password error:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Kunne ikke tilbakestille passordet" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
