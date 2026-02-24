import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

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
    if (!authResp.startsWith("334")) throw new Error("AUTH LOGIN failed: " + authResp);
    const userResp = await send(btoa(opts.username));
    if (!userResp.startsWith("334")) throw new Error("AUTH user failed: " + userResp);
    const passResp = await send(btoa(opts.password));
    if (!passResp.startsWith("235")) throw new Error("AUTH pass failed: " + passResp);
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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing auth");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!);
    const { data: { user }, error: authError } = await anonClient.auth.getUser(authHeader.replace("Bearer ", ""));
    if (authError || !user) throw new Error("Unauthorized");

    const { recipientId, senderName, messagePreview } = await req.json();
    if (!recipientId) throw new Error("Missing recipientId");

    const { data: recipient } = await supabase
      .from("profiles")
      .select("email, name, last_seen_at")
      .eq("id", recipientId)
      .single();

    if (!recipient || !recipient.email) {
      return new Response(JSON.stringify({ sent: false, reason: "no_email" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const TWO_MINUTES = 2 * 60 * 1000;
    const lastSeen = recipient.last_seen_at ? new Date(recipient.last_seen_at).getTime() : 0;
    const isOnline = (Date.now() - lastSeen) < TWO_MINUTES;

    if (isOnline) {
      return new Response(JSON.stringify({ sent: false, reason: "online" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const smtpUser = Deno.env.get("SMTP_USER");
    const smtpPass = Deno.env.get("SMTP_PASS");

    if (!smtpUser || !smtpPass) {
      return new Response(JSON.stringify({ sent: false, reason: "no_smtp" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const preview = (messagePreview || "").substring(0, 100);

    const htmlBody = `
      <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:520px;margin:0 auto;background:#ffffff;">
        <div style="background:linear-gradient(135deg,#1a1a2e,#16213e);padding:28px 32px;border-radius:12px 12px 0 0;">
          <h1 style="color:#ffffff;margin:0;font-size:20px;font-weight:600;">💬 Ny melding fra ${senderName || "en kollega"}</h1>
        </div>
        <div style="padding:28px 32px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;">
          <p style="color:#334155;font-size:14px;line-height:1.7;margin:0 0 20px;">
            Hei ${recipient.name}! Du har mottatt en ny melding mens du var frakoblet.
          </p>
          ${preview ? `<div style="background:#f1f5f9;border-left:4px solid #6366f1;border-radius:8px;padding:16px;margin-bottom:20px;">
            <p style="font-size:13px;color:#475569;margin:0;font-style:italic;">"${preview}"</p>
          </div>` : ""}
          <a href="https://obsidian-edge-finance.lovable.app/workspace" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-size:14px;font-weight:600;">
            Åpne Workspace
          </a>
          <div style="margin-top:24px;padding-top:16px;border-top:1px solid #e2e8f0;text-align:center;">
            <p style="font-size:12px;color:#94a3b8;margin:0;">Sendt fra <strong>Avargo</strong> · kontakt@avargo.no</p>
          </div>
        </div>
      </div>`;

    await sendEmail({
      hostname: "smtp.domeneshop.no",
      port: 465,
      username: smtpUser,
      password: smtpPass,
      from: "kontakt@avargo.no",
      to: recipient.email,
      subject: `Ny melding fra ${senderName || "en kollega"} — Avargo`,
      html: htmlBody,
    });

    return new Response(JSON.stringify({ sent: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("notify-dm-email error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
