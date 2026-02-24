import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

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
    if (!authResp.startsWith("334")) throw new Error("AUTH LOGIN failed: " + authResp);
    const userResp = await send(btoa(opts.username));
    if (!userResp.startsWith("334")) throw new Error("AUTH user failed: " + userResp);
    const passResp = await send(btoa(opts.password));
    if (!passResp.startsWith("235")) throw new Error("AUTH pass failed: " + passResp);
    await send(`MAIL FROM:<${opts.from}>`);
    await send(`RCPT TO:<${opts.to}>`);
    await send("DATA");

    const message = [
      `From: Avargo Rekruttering <${opts.from}>`,
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
    if (sendResp.startsWith("5")) throw new Error("SMTP send rejected: " + sendResp.trim());
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
    const { applicant_name, applicant_email, position_title } = await req.json();

    if (!applicant_email || !applicant_name) {
      return new Response(JSON.stringify({ error: "Mangler navn eller e-post" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const smtpHost = "smtp.domeneshop.no";
    const smtpPort = 465;
    const smtpUser = Deno.env.get("SMTP_USER")!;
    const smtpPass = Deno.env.get("SMTP_PASS")!;
    const fromEmail = "kontakt@avargo.no";

    const firstName = applicant_name.split(" ")[0];
    const positionLine = position_title
      ? `<p style="margin:0 0 18px 0;font-size:15px;line-height:1.7;color:#3a3a3a;">Vi har n&#229; gjennomg&#229;tt alle s&#248;knadene vi har mottatt til stillingen som <strong>${position_title}</strong>, og vi har dessverre valgt &#229; g&#229; videre med andre kandidater denne gangen.</p>`
      : `<p style="margin:0 0 18px 0;font-size:15px;line-height:1.7;color:#3a3a3a;">Vi har n&#229; gjennomg&#229;tt alle s&#248;knadene vi har mottatt, og vi har dessverre valgt &#229; g&#229; videre med andre kandidater denne gangen.</p>`;

    const html = `<!DOCTYPE html>
<html lang="no">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:40px 20px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06);">

        <!-- Header -->
        <tr>
          <td style="background-color:#1a1a1a;padding:32px 40px;text-align:center;">
            <img src="https://obsidian-edge-finance.lovable.app/logo.png" alt="Avargo" width="120" style="display:inline-block;" />
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px 40px 20px 40px;">
            <p style="margin:0 0 24px 0;font-size:20px;font-weight:600;color:#1a1a1a;">Hei, ${firstName}</p>

            <p style="margin:0 0 18px 0;font-size:15px;line-height:1.7;color:#3a3a3a;">Tusen takk for at du tok deg tid til &#229; s&#248;ke hos oss. Vi setter stor pris p&#229; interessen din for Avargo, og det var hyggelig &#229; f&#229; lese s&#248;knaden din.</p>

            ${positionLine}

            <p style="margin:0 0 18px 0;font-size:15px;line-height:1.7;color:#3a3a3a;">Dette betyr p&#229; ingen m&#229;te at kompetansen din ikke er verdifull. Konkurransen var sterk, og det var mange kvalifiserte s&#248;kere. Vi h&#229;per virkelig at du vil vurdere &#229; s&#248;ke hos oss igjen ved en senere anledning, enten p&#229; en konkret stilling eller som en &#229;pen s&#248;knad.</p>

            <p style="margin:0 0 18px 0;font-size:15px;line-height:1.7;color:#3a3a3a;">Vi &#248;nsker deg alt godt videre, og h&#229;per veiene v&#229;re krysses igjen.</p>

            <p style="margin:28px 0 0 0;font-size:15px;line-height:1.7;color:#3a3a3a;">
              Med vennlig hilsen<br/>
              <strong>Rekruttering</strong><br/>
              Avargo
            </p>
          </td>
        </tr>

        <!-- Divider -->
        <tr>
          <td style="padding:0 40px;">
            <hr style="border:none;border-top:1px solid #e4e4e7;margin:20px 0;" />
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:10px 40px 36px 40px;text-align:center;">
            <p style="margin:0 0 8px 0;font-size:13px;color:#71717a;">
              <a href="https://www.avargo.no" style="color:#1a1a1a;text-decoration:none;font-weight:600;">www.avargo.no</a>
            </p>
            <p style="margin:0 0 6px 0;font-size:12px;color:#a1a1aa;">Oscars gate 2B, 3714 Skien</p>
            <p style="margin:0;font-size:12px;color:#a1a1aa;">kontakt@avargo.no</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

    await sendEmail({
      hostname: smtpHost,
      port: smtpPort,
      username: smtpUser,
      password: smtpPass,
      from: fromEmail,
      to: applicant_email,
      subject: "Tilbakemelding p\u00e5 din s\u00f8knad hos Avargo",
      html,
    });

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Rejection email error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
