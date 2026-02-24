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

function buildInterviewEmail(opts: {
  firstName: string;
  positionTitle: string | null;
  senderName: string;
  senderEmail: string;
  senderPhone: string | null;
  senderTitle: string | null;
  interviewDate: string | null;
  interviewTime: string | null;
  interviewType: string | null;
  teamsLink: string | null;
  interviewLocation: string | null;
}) {
  const positionText = opts.positionTitle
    ? `stillingen som <strong>${opts.positionTitle}</strong>`
    : "en stilling hos oss";

  const hasSpecificTime = opts.interviewDate || opts.interviewTime;
  const isDigital = opts.interviewType === "digital";
  const isPhysical = opts.interviewType === "fysisk";

  // Build interview details section
  let detailsSection = "";
  if (hasSpecificTime || opts.interviewType) {
    const rows: string[] = [];
    if (opts.interviewDate) {
      rows.push(`<tr>
        <td style="padding:6px 0;font-size:14px;color:#374151;font-weight:600;width:120px;">&#128197; Dato:</td>
        <td style="padding:6px 0;font-size:14px;color:#374151;">${opts.interviewDate}</td>
      </tr>`);
    }
    if (opts.interviewTime) {
      rows.push(`<tr>
        <td style="padding:6px 0;font-size:14px;color:#374151;font-weight:600;">&#128339; Klokkeslett:</td>
        <td style="padding:6px 0;font-size:14px;color:#374151;">${opts.interviewTime}</td>
      </tr>`);
    }
    if (opts.interviewType) {
      const typeLabel = isDigital ? "Digitalt (Teams/Video)" : isPhysical ? "Fysisk m&#248;te" : opts.interviewType;
      rows.push(`<tr>
        <td style="padding:6px 0;font-size:14px;color:#374151;font-weight:600;">&#128188; Type:</td>
        <td style="padding:6px 0;font-size:14px;color:#374151;">${typeLabel}</td>
      </tr>`);
    }
    if (isPhysical && opts.interviewLocation) {
      rows.push(`<tr>
        <td style="padding:6px 0;font-size:14px;color:#374151;font-weight:600;">&#128205; Sted:</td>
        <td style="padding:6px 0;font-size:14px;color:#374151;">${opts.interviewLocation}</td>
      </tr>`);
    }

    detailsSection = `<div style="background:#eff6ff;border-left:4px solid #3b82f6;padding:20px 24px;border-radius:0 12px 12px 0;margin:24px 0;">
      <p style="font-size:13px;color:#1e40af;margin:0 0 14px 0;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">Detaljer for intervjuet</p>
      <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;">
        ${rows.join("")}
      </table>
    </div>`;
  }

  // Teams link button
  let teamsSection = "";
  if (isDigital && opts.teamsLink) {
    teamsSection = `<div style="text-align:center;margin:24px 0;">
      <a href="${opts.teamsLink}" style="display:inline-block;background-color:#5b5fc7;color:#ffffff;font-size:14px;font-weight:600;padding:14px 32px;border-radius:10px;text-decoration:none;letter-spacing:0.3px;">
        &#128421; Koble til via Teams
      </a>
      <p style="margin:8px 0 0;font-size:12px;color:#a1a1aa;">Klikk p&#229; knappen for &#229; bli med i m&#248;tet</p>
    </div>`;
  }

  // "Neste steg" section - only show if no specific time is set
  let nextStepSection = "";
  if (!hasSpecificTime) {
    nextStepSection = `<div style="background:#f0fdf4;border-left:4px solid #22c55e;padding:16px 20px;border-radius:0 10px 10px 0;margin:24px 0;">
      <p style="font-size:14px;color:#15803d;margin:0 0 4px 0;font-weight:600;">Neste steg</p>
      <p style="font-size:14px;color:#166534;margin:0;line-height:1.6;">
        Vi ber deg vennligst om &#229; svare p&#229; denne e-posten med noen datoer og tidspunkter som passer for deg de kommende ukene, s&#229; finner vi et tidspunkt som fungerer for begge parter.
      </p>
    </div>`;
  } else {
    nextStepSection = `<div style="background:#f0fdf4;border-left:4px solid #22c55e;padding:16px 20px;border-radius:0 10px 10px 0;margin:24px 0;">
      <p style="font-size:14px;color:#15803d;margin:0 0 4px 0;font-weight:600;">Bekreft gjerne</p>
      <p style="font-size:14px;color:#166534;margin:0;line-height:1.6;">
        Vennligst bekreft at tidspunktet passer ved &#229; svare p&#229; denne e-posten. Skulle det ikke passe, er det bare &#229; gi beskjed s&#229; finner vi en alternativ l&#248;sning.
      </p>
    </div>`;
  }

  const contactRows = [
    `<tr>
      <td style="padding:6px 12px 6px 0;color:#71717a;font-size:13px;font-weight:600;white-space:nowrap;">Navn</td>
      <td style="padding:6px 0;font-size:14px;color:#1a1a1a;font-weight:600;">${opts.senderName}</td>
    </tr>`,
    opts.senderTitle ? `<tr>
      <td style="padding:6px 12px 6px 0;color:#71717a;font-size:13px;font-weight:600;white-space:nowrap;">Stilling</td>
      <td style="padding:6px 0;font-size:14px;color:#1a1a1a;">${opts.senderTitle}</td>
    </tr>` : "",
    `<tr>
      <td style="padding:6px 12px 6px 0;color:#71717a;font-size:13px;font-weight:600;white-space:nowrap;">E-post</td>
      <td style="padding:6px 0;font-size:14px;color:#1a1a1a;"><a href="mailto:${opts.senderEmail}" style="color:#1a1a1a;text-decoration:underline;">${opts.senderEmail}</a></td>
    </tr>`,
    opts.senderPhone ? `<tr>
      <td style="padding:6px 12px 6px 0;color:#71717a;font-size:13px;font-weight:600;white-space:nowrap;">Telefon</td>
      <td style="padding:6px 0;font-size:14px;color:#1a1a1a;"><a href="tel:${opts.senderPhone}" style="color:#1a1a1a;text-decoration:underline;">${opts.senderPhone}</a></td>
    </tr>` : "",
  ].filter(Boolean).join("");

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
            <p style="margin:0 0 24px 0;font-size:20px;font-weight:600;color:#1a1a1a;">Hei, ${opts.firstName}</p>

            <p style="margin:0 0 18px 0;font-size:15px;line-height:1.7;color:#3a3a3a;">Tusen takk for din s&#248;knad til ${positionText}. Vi har g&#229;tt gjennom s&#248;knaden din med stor interesse, og vi vil gjerne invitere deg til et intervju.</p>

            <p style="margin:0 0 18px 0;font-size:15px;line-height:1.7;color:#3a3a3a;">Vi gleder oss til &#229; bli bedre kjent med deg og h&#248;re mer om din bakgrunn og dine ambisjoner. Intervjuet vil v&#230;re en uformell samtale der vi &#248;nsker &#229; l&#230;re mer om deg, samtidig som du f&#229;r muligheten til &#229; stille sp&#248;rsm&#229;l om Avargo og rollen.</p>

            ${detailsSection}

            ${teamsSection}

            ${nextStepSection}

            <div style="text-align:center;margin:28px 0;">
              <a href="https://www.avargo.no/karriere/intervjutips" style="display:inline-block;background-color:#1a1a1a;color:#ffffff;font-size:14px;font-weight:600;padding:14px 32px;border-radius:10px;text-decoration:none;letter-spacing:0.3px;">
                &#128218; Les v&#229;re intervjutips
              </a>
              <p style="margin:10px 0 0;font-size:12px;color:#a1a1aa;">Tips og r&#229;d for &#229; f&#248;le deg trygg og forberedt</p>
            </div>

            <div style="background:#f8fafc;border:1px solid #e4e4e7;border-radius:10px;padding:20px;margin:24px 0;">
              <p style="margin:0 0 14px;font-size:13px;color:#71717a;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">Din kontaktperson</p>
              <table style="border-collapse:collapse;width:100%;">
                ${contactRows}
              </table>
            </div>

            <p style="margin:0 0 18px 0;font-size:15px;line-height:1.7;color:#3a3a3a;">Ikke n&#248;l med &#229; ta kontakt dersom du har sp&#248;rsm&#229;l i forkant av intervjuet. Vi ser frem til &#229; h&#248;re fra deg.</p>

            <p style="margin:28px 0 0 0;font-size:15px;line-height:1.7;color:#3a3a3a;">
              Med vennlig hilsen<br/>
              <strong>${opts.senderName}</strong>${opts.senderTitle ? `<br/>${opts.senderTitle}` : ""}<br/>
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
      sender_name,
      sender_email,
      sender_phone,
      sender_title,
      interview_date,
      interview_time,
      interview_type,
      teams_link,
      interview_location,
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
      subject: `Innkalling til intervju hos Avargo`,
      html: buildInterviewEmail({
        firstName,
        positionTitle: position_title || null,
        senderName: sender_name || "Rekruttering",
        senderEmail: sender_email || fromEmail,
        senderPhone: sender_phone || null,
        senderTitle: sender_title || null,
        interviewDate: interview_date || null,
        interviewTime: interview_time || null,
        interviewType: interview_type || null,
        teamsLink: teams_link || null,
        interviewLocation: interview_location || null,
      }),
    });

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Interview invitation email error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
