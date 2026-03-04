import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

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
      `To: ${opts.to}`,
      `Subject: ${opts.subject}`,
      `MIME-Version: 1.0`,
      `Content-Type: text/html; charset=UTF-8`,
      ``,
      opts.html,
      `.`,
    ].join("\r\n");

    await send(message);
    await send("QUIT");
  } finally {
    try { conn.close(); } catch { /* ignore */ }
  }
}

function buildSetPasswordEmail(name: string, email: string, actionLink: string, role: string, approverName?: string, approverTitle?: string) {
  const isCustomer = role === "customer";
  const portalName = isCustomer ? "kundeportalen" : "admin-portalen";
  const firstName = name.split(" ")[0];
  const sigName = approverName || "Teamet i Avargo";
  const sigTitle = approverTitle ? `<br/>${escapeHtml(approverTitle)}` : "";

  return `<!DOCTYPE html>
<html lang="no">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:40px 20px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06);">
        <tr><td style="background-color:#1a1a1a;padding:32px 40px;text-align:center;"><img src="https://obsidian-edge-finance.lovable.app/logo.png" alt="Avargo" width="120" style="display:inline-block;" /></td></tr>
        <tr>
          <td style="padding:40px 40px 20px 40px;">
            <p style="margin:0 0 24px 0;font-size:20px;font-weight:600;color:#1a1a1a;">Velkommen til Avargo, ${escapeHtml(firstName)}</p>
            <p style="margin:0 0 18px 0;font-size:15px;line-height:1.7;color:#3a3a3a;">Kontoen din er klar. Av sikkerhetsgrunner sender vi ikke passord på e-post.</p>
            <p style="margin:0 0 18px 0;font-size:15px;line-height:1.7;color:#3a3a3a;">Bruk knappen under for å åpne ${portalName} og velge ditt eget passord via en sikker lenke.</p>
            <div style="background:#f8fafc;border:1px solid #e4e4e7;border-radius:10px;padding:24px;margin:24px 0;">
              <p style="margin:0 0 16px;font-size:13px;color:#71717a;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">Din konto</p>
              <table style="border-collapse:collapse;width:100%;">
                <tr>
                  <td style="padding:8px 12px 8px 0;color:#71717a;font-size:13px;font-weight:600;white-space:nowrap;">Brukernavn (e-post)</td>
                  <td style="padding:8px 0;font-size:14px;color:#1a1a1a;font-weight:600;">${escapeHtml(email)}</td>
                </tr>
              </table>
            </div>
            <div style="background:#fef9c3;border-left:4px solid #eab308;padding:14px 18px;border-radius:0 10px 10px 0;margin-bottom:24px;">
              <p style="font-size:13px;color:#854d0e;margin:0;line-height:1.6;"><strong>Viktig:</strong> Lenken bør brukes med én gang og passordet velges av deg personlig.</p>
            </div>
            <div style="text-align:center;margin-bottom:24px;">
              <a href="${actionLink}" style="display:inline-block;background-color:#1a1a1a;color:#ffffff;padding:14px 32px;border-radius:10px;text-decoration:none;font-size:14px;font-weight:600;">Åpne sikker innlogging</a>
            </div>
            <p style="margin:28px 0 0 0;font-size:15px;line-height:1.7;color:#3a3a3a;">Med vennlig hilsen<br/><strong>${escapeHtml(sigName)}</strong>${sigTitle}<br/>Avargo</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function generateRandomPassword(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => (b % 36).toString(36)).join("") + "A9!";
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const { email, name, role, approver_name, approver_title } = await req.json();

    if (!email || !name) {
      return new Response(JSON.stringify({ error: "E-post og navn er påkrevd." }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const normalizedEmail = normalizeEmail(email);
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const authHeader = req.headers.get('Authorization');

    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: "Ikke autorisert." }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const adminClient = createClient(supabaseUrl, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });
    const authClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await authClient.auth.getClaims(token);
    const callerUserId = claimsData?.claims?.sub;

    if (claimsError || !callerUserId) {
      return new Response(JSON.stringify({ error: "Ugyldig token." }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { data: isAdmin, error: adminCheckError } = await adminClient.rpc('is_admin', { uid: callerUserId });
    if (adminCheckError || !isAdmin) {
      return new Response(JSON.stringify({ error: "Kun administrator kan opprette brukere." }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { data: createdUser, error: createError } = await adminClient.auth.admin.createUser({
      email: normalizedEmail,
      password: generateRandomPassword(),
      email_confirm: true,
    });

    if (createError || !createdUser.user?.id) {
      return new Response(JSON.stringify({ error: createError?.message || "Kunne ikke opprette bruker." }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const newUserId = createdUser.user.id;
    const { error: profileError } = await adminClient.from('profiles').insert({
      user_id: newUserId,
      name,
      email: normalizedEmail,
      role: role || 'employee',
    });

    if (profileError) {
      await adminClient.auth.admin.deleteUser(newUserId);
      throw profileError;
    }

    const { data: linkData, error: linkError } = await adminClient.auth.admin.generateLink({
      type: 'recovery',
      email: normalizedEmail,
    });

    if (linkError || !linkData.properties?.action_link) {
      throw new Error(linkError?.message || 'Kunne ikke generere sikker innloggingslenke.');
    }

    const smtpUser = Deno.env.get("SMTP_USER");
    const smtpPass = Deno.env.get("SMTP_PASS");
    if (smtpUser && smtpPass) {
      try {
        await sendEmail({
          hostname: "smtp.domeneshop.no",
          port: 465,
          username: smtpUser,
          password: smtpPass,
          from: "kontakt@avargo.no",
          to: normalizedEmail,
          subject: `Velkommen til Avargo, ${name}!`,
          html: buildSetPasswordEmail(name, normalizedEmail, linkData.properties.action_link, role || "employee", approver_name, approver_title),
        });
      } catch (emailErr) {
        console.error("Failed to send welcome email:", emailErr);
      }
    }

    return new Response(JSON.stringify({ success: true, userId: newUserId }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
