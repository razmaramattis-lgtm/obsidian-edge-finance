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
      `From: Avargo <${opts.from}>`,
      `Reply-To: ${opts.from}`,
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

function buildOfferEmail(opts: {
  firstName: string;
  positionTitle: string | null;
  startDate: string;
  salary: string;
  workLocation: string;
  senderName: string;
  senderTitle: string | null;
  senderEmail: string;
  senderPhone: string | null;
}) {
  const positionLine = opts.positionTitle
    ? `<p style="margin:0 0 18px 0;font-size:15px;line-height:1.7;color:#3a3a3a;">Vi er veldig glade for &#229; kunne tilby deg stillingen som <strong>${opts.positionTitle}</strong> hos Avargo!</p>`
    : `<p style="margin:0 0 18px 0;font-size:15px;line-height:1.7;color:#3a3a3a;">Vi er veldig glade for &#229; kunne tilby deg en stilling hos Avargo!</p>`;

  const sigName = opts.senderName || "Rekruttering";
  const sigTitle = opts.senderTitle ? `<br/>${opts.senderTitle}` : "";
  const sigPhone = opts.senderPhone ? `<br/>Tlf: ${opts.senderPhone}` : "";

  return `<!DOCTYPE html>
<html lang="no">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:40px 20px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06);">

        <tr>
          <td style="background-color:#1a1a1a;padding:32px 40px;text-align:center;">
            <img src="https://obsidian-edge-finance.lovable.app/logo.png" alt="Avargo" width="120" style="display:inline-block;" />
          </td>
        </tr>

        <tr>
          <td style="padding:40px 40px 20px 40px;">
            <p style="margin:0 0 24px 0;font-size:20px;font-weight:600;color:#1a1a1a;">Hei, ${opts.firstName} &#127881;</p>

            ${positionLine}

            <p style="margin:0 0 18px 0;font-size:15px;line-height:1.7;color:#3a3a3a;">Gjennom prosessen har du vist at du har de egenskapene og den kompetansen vi ser etter, og vi er overbevist om at du vil bli en fantastisk del av teamet v&#229;rt. Vi gleder oss enormt til &#229; ha deg med p&#229; laget!</p>

            <div style="background:#ecfdf5;border-left:4px solid #10b981;padding:20px 24px;border-radius:0 12px 12px 0;margin:28px 0;">
              <p style="font-size:13px;color:#065f46;margin:0 0 14px 0;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">Detaljer om tilbudet</p>
              <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;">
                <tr>
                  <td style="padding:6px 0;font-size:14px;color:#374151;font-weight:600;width:140px;">&#128197; Tiltredelse:</td>
                  <td style="padding:6px 0;font-size:14px;color:#374151;">${opts.startDate}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:14px;color:#374151;font-weight:600;">&#128176; L&#248;nn:</td>
                  <td style="padding:6px 0;font-size:14px;color:#374151;">${opts.salary}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:14px;color:#374151;font-weight:600;">&#128205; Arbeidssted:</td>
                  <td style="padding:6px 0;font-size:14px;color:#374151;">${opts.workLocation}</td>
                </tr>
              </table>
            </div>

            <p style="margin:0 0 18px 0;font-size:15px;line-height:1.7;color:#3a3a3a;">For at vi skal kunne forberede alt til din oppstart, ber vi deg vennligst sende oss f&#248;lgende informasjon:</p>

            <div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:18px 24px;border-radius:0 12px 12px 0;margin:24px 0;">
              <p style="font-size:13px;color:#92400e;margin:0 0 12px 0;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">Vi trenger f&#248;lgende fra deg</p>
              <ul style="margin:0;padding:0 0 0 18px;font-size:14px;color:#374151;line-height:2;">
                <li>Fullt personnummer (11 siffer)</li>
                <li>Kontonummer for l&#248;nnsutbetaling</li>
                <li>Skattekortet ditt (leveres til Skatteetaten)</li>
                <li>Eventuelle allergier eller hensyn vi b&#248;r vite om</li>
                <li>N&#230;rmeste p&#229;r&#248;rende (navn og telefonnummer)</li>
              </ul>
            </div>

            <p style="margin:0 0 18px 0;font-size:15px;line-height:1.7;color:#3a3a3a;">Vennligst send informasjonen til <a href="mailto:${opts.senderEmail}" style="color:#1a1a1a;font-weight:600;">${opts.senderEmail}</a> s&#229; snart som mulig.</p>

            <p style="margin:0 0 18px 0;font-size:15px;line-height:1.7;color:#3a3a3a;">Har du sp&#248;rsm&#229;l om tilbudet eller noe annet, er det bare &#229; ta kontakt. Vi er her for deg!</p>

            <p style="margin:0 0 18px 0;font-size:15px;line-height:1.7;color:#3a3a3a;">Vi gleder oss til &#229; &#248;nske deg velkommen hos Avargo! &#129309;</p>

            <p style="margin:28px 0 0 0;font-size:15px;line-height:1.7;color:#3a3a3a;">
              Varm hilsen<br/>
              <strong>${sigName}</strong>${sigTitle}<br/>
              <a href="mailto:${opts.senderEmail}" style="color:#1a1a1a;text-decoration:none;">${opts.senderEmail}</a>${sigPhone}<br/>
              Avargo
            </p>
          </td>
        </tr>

        <tr>
          <td style="padding:0 40px;">
            <hr style="border:none;border-top:1px solid #e4e4e7;margin:20px 0;" />
          </td>
        </tr>

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
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      applicant_name,
      applicant_email,
      position_title,
      start_date,
      salary,
      work_location,
      sender_name,
      sender_title,
      sender_email,
      sender_phone,
    } = await req.json();

    if (!applicant_email || !applicant_name) {
      return new Response(JSON.stringify({ error: "Mangler navn eller e-post" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const smtpUser = Deno.env.get("SMTP_USER")!;
    const smtpPass = Deno.env.get("SMTP_PASS")!;
    const fromEmail = "kontakt@avargo.no";
    const firstName = applicant_name.split(" ")[0];

    await sendEmail({
      hostname: "smtp.domeneshop.no",
      port: 465,
      username: smtpUser,
      password: smtpPass,
      from: fromEmail,
      to: applicant_email,
      subject: position_title
        ? `Jobbtilbud – ${position_title} hos Avargo`
        : `Jobbtilbud fra Avargo`,
      html: buildOfferEmail({
        firstName,
        positionTitle: position_title || null,
        startDate: start_date || "Etter avtale",
        salary: salary || "Etter avtale",
        workLocation: work_location || "Etter avtale",
        senderName: sender_name || "Rekruttering",
        senderTitle: sender_title || null,
        senderEmail: sender_email || "kontakt@avargo.no",
        senderPhone: sender_phone || null,
      }),
    });

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Job offer email error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
