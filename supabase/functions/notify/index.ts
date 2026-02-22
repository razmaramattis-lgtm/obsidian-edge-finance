import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
  icsAttachment?: string;
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
    return resp;
  }

  try {
    await readResponse();
    await send("EHLO localhost");
    const authResp = await send("AUTH LOGIN");
    if (!authResp.startsWith("334")) throw new Error("AUTH LOGIN failed");
    const userResp = await send(btoa(opts.username));
    if (!userResp.startsWith("334")) throw new Error("AUTH username failed");
    const passResp = await send(btoa(opts.password));
    if (!passResp.startsWith("235")) throw new Error("AUTH password failed");
    await send(`MAIL FROM:<${opts.from}>`);
    await send(`RCPT TO:<${opts.to}>`);
    await send("DATA");

    let message: string;
    if (opts.icsAttachment) {
      const boundary = "----=_AvargoMail_" + Date.now();
      message = [
        `From: Avargo <${opts.from}>`,
        `To: ${opts.to}`,
        `Subject: ${opts.subject}`,
        `MIME-Version: 1.0`,
        `Content-Type: multipart/mixed; boundary="${boundary}"`,
        ``,
        `--${boundary}`,
        `Content-Type: text/html; charset=UTF-8`,
        `Content-Transfer-Encoding: 7bit`,
        ``,
        opts.html,
        ``,
        `--${boundary}`,
        `Content-Type: text/calendar; charset=UTF-8; method=REQUEST`,
        `Content-Transfer-Encoding: 7bit`,
        `Content-Disposition: attachment; filename="meeting.ics"`,
        ``,
        opts.icsAttachment,
        ``,
        `--${boundary}--`,
        `.`,
      ].join("\r\n");
    } else {
      message = [
        `From: Avargo <${opts.from}>`,
        `To: ${opts.to}`,
        `Subject: ${opts.subject}`,
        `MIME-Version: 1.0`,
        `Content-Type: text/html; charset=UTF-8`,
        ``,
        opts.html,
        `.`,
      ].join("\r\n");
    }

    await send(message);
    await send("QUIT");
  } finally {
    try { conn.close(); } catch { /* ignore */ }
  }
}

function generateICS(opts: {
  date: string;
  time: string;
  durationMinutes: number;
  summary: string;
  description: string;
  location?: string;
  organizerEmail: string;
  organizerName: string;
  attendeeEmail: string;
  attendeeName: string;
  teamsLink?: string;
  uid: string;
}): string {
  // Parse date "2026-03-15" and time "09:00"
  const d = opts.date.replace(/-/g, "");
  const t = (opts.time.slice(0, 5)).replace(":", "") + "00";
  const startHour = parseInt(opts.time.slice(0, 2));
  const startMin = parseInt(opts.time.slice(3, 5));
  const endMin = startMin + opts.durationMinutes;
  const endHour = startHour + Math.floor(endMin / 60);
  const endMinFinal = endMin % 60;
  const endT = String(endHour).padStart(2, "0") + String(endMinFinal).padStart(2, "0") + "00";
  const now = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Avargo//Booking//NO",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:${opts.uid}`,
    `DTSTAMP:${now}`,
    `DTSTART:${d}T${t}`,
    `DTEND:${d}T${endT}`,
    `SUMMARY:${opts.summary}`,
    `DESCRIPTION:${opts.description}${opts.teamsLink ? "\\n\\nTeams-møte: " + opts.teamsLink : ""}`,
    `ORGANIZER;CN=${opts.organizerName}:mailto:${opts.organizerEmail}`,
    `ATTENDEE;CN=${opts.attendeeName};RSVP=TRUE:mailto:${opts.attendeeEmail}`,
  ];
  if (opts.teamsLink) {
    lines.push(`LOCATION:${opts.teamsLink}`);
    lines.push(`URL:${opts.teamsLink}`);
    lines.push(`X-MICROSOFT-CDO-BUSYSTATUS:BUSY`);
  }
  lines.push("STATUS:CONFIRMED");
  lines.push("END:VEVENT");
  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

function wrapHtml(title: string, body: string) {
  const now = new Date().toLocaleDateString("nb-NO", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
  return `<div style="font-family:'Segoe UI',Arial,sans-serif;max-width:640px;margin:0 auto;background:#fff;">
    <div style="background:linear-gradient(135deg,#1a1a2e,#16213e);padding:28px 32px;border-radius:12px 12px 0 0;">
      <h1 style="color:#fff;margin:0;font-size:20px;font-weight:600;">${title}</h1>
      <p style="color:#94a3b8;margin:6px 0 0;font-size:13px;">${now}</p>
    </div>
    <div style="padding:28px 32px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;">
      ${body}
      <div style="margin-top:28px;padding-top:16px;border-top:1px solid #e2e8f0;text-align:center;">
        <p style="font-size:12px;color:#94a3b8;margin:0;">Sendt fra <strong>Avargo</strong></p>
      </div>
    </div>
  </div>`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, data } = await req.json();
    const smtpUser = Deno.env.get("SMTP_USER");
    const smtpPass = Deno.env.get("SMTP_PASS");
    if (!smtpUser || !smtpPass) throw new Error("SMTP not configured");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const smtpOpts = {
      hostname: "smtp.domeneshop.no",
      port: 465,
      username: smtpUser,
      password: smtpPass,
      from: "kontakt@avargo.no",
    };

    if (type === "booking_notification") {
      // Send email to the advisor about the booking
      const { advisor_id, customer_name, customer_email, customer_phone, company_name, booking_date, booking_time, message } = data;

      // Get advisor email
      const { data: advisor } = await supabase
        .from("profiles")
        .select("email, name")
        .eq("id", advisor_id)
        .single();

      if (!advisor?.email) throw new Error("Advisor not found");

      const body = `
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:20px;margin-bottom:20px;">
          <h2 style="margin:0 0 14px;font-size:15px;color:#475569;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">📅 Bookingdetaljer</h2>
          <table style="border-collapse:collapse;width:100%;">
            <tr><td style="padding:6px 12px 6px 0;color:#64748b;font-size:13px;font-weight:600;">Dato</td><td style="padding:6px 0;font-size:14px;color:#0f172a;">${booking_date}</td></tr>
            <tr><td style="padding:6px 12px 6px 0;color:#64748b;font-size:13px;font-weight:600;">Tidspunkt</td><td style="padding:6px 0;font-size:14px;color:#0f172a;">${booking_time}</td></tr>
            <tr><td style="padding:6px 12px 6px 0;color:#64748b;font-size:13px;font-weight:600;">Kunde</td><td style="padding:6px 0;font-size:14px;color:#0f172a;">${customer_name}</td></tr>
            <tr><td style="padding:6px 12px 6px 0;color:#64748b;font-size:13px;font-weight:600;">Selskap</td><td style="padding:6px 0;font-size:14px;color:#0f172a;">${company_name}</td></tr>
            <tr><td style="padding:6px 12px 6px 0;color:#64748b;font-size:13px;font-weight:600;">E-post</td><td style="padding:6px 0;font-size:14px;"><a href="mailto:${customer_email}" style="color:#2563eb;">${customer_email}</a></td></tr>
            ${customer_phone ? `<tr><td style="padding:6px 12px 6px 0;color:#64748b;font-size:13px;font-weight:600;">Telefon</td><td style="padding:6px 0;font-size:14px;color:#0f172a;">${customer_phone}</td></tr>` : ""}
          </table>
        </div>
        ${message ? `<div style="background:#f0fdf4;border-left:4px solid #22c55e;padding:16px 20px;border-radius:0 10px 10px 0;font-size:14px;line-height:1.7;color:#1e293b;margin-bottom:20px;"><strong>Melding:</strong><br/>${message}</div>` : ""}
      `;

      // Send to advisor
      await sendEmail({
        ...smtpOpts,
        to: advisor.email,
        subject: `Ny booking: ${customer_name} — ${booking_date} kl. ${booking_time}`,
        html: wrapHtml("📅 Ny booking mottatt", body),
      });

      // Also send to kontakt@avargo.no
      await sendEmail({
        ...smtpOpts,
        to: "kontakt@avargo.no",
        subject: `Ny booking: ${customer_name} → ${advisor.name} — ${booking_date}`,
        html: wrapHtml("📅 Ny booking mottatt", body),
      });
    }

    if (type === "booking_confirmed") {
      const { advisor_id, advisor_name, customer_name, customer_email, customer_phone, company_name, booking_date, booking_time, message, teams_link } = data;

      // Get advisor email
      const { data: advisor } = await supabase
        .from("profiles")
        .select("email, name")
        .eq("id", advisor_id)
        .single();

      const formattedDate = new Date(booking_date).toLocaleDateString("nb-NO", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
      const formattedTime = booking_time?.slice(0, 5) || booking_time;

      // ── Email to CUSTOMER ──
      const customerBody = `
        <div style="margin-bottom:20px;">
          <p style="font-size:14px;color:#0f172a;">Hei ${customer_name} 👋</p>
          <p style="font-size:14px;color:#475569;line-height:1.7;">
            Din booking er nå <strong style="color:#22c55e;">bekreftet</strong>! Her er møtedetaljene dine:
          </p>
        </div>
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:20px;margin-bottom:20px;">
          <table style="border-collapse:collapse;width:100%;">
            <tr><td style="padding:8px 12px 8px 0;color:#64748b;font-size:13px;font-weight:600;">📅 Dato</td><td style="padding:8px 0;font-size:14px;color:#0f172a;font-weight:600;">${formattedDate}</td></tr>
            <tr><td style="padding:8px 12px 8px 0;color:#64748b;font-size:13px;font-weight:600;">🕐 Tidspunkt</td><td style="padding:8px 0;font-size:14px;color:#0f172a;font-weight:600;">kl. ${formattedTime}</td></tr>
            <tr><td style="padding:8px 12px 8px 0;color:#64748b;font-size:13px;font-weight:600;">👤 Rådgiver</td><td style="padding:8px 0;font-size:14px;color:#0f172a;">${advisor_name || advisor?.name || "Din rådgiver"}</td></tr>
            <tr><td style="padding:8px 12px 8px 0;color:#64748b;font-size:13px;font-weight:600;">⏱️ Varighet</td><td style="padding:8px 0;font-size:14px;color:#0f172a;">30 minutter</td></tr>
          </table>
        </div>
        ${teams_link ? `
        <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:10px;padding:20px;margin-bottom:20px;text-align:center;">
          <p style="font-size:13px;color:#64748b;margin:0 0 12px;">Møtet gjennomføres via Microsoft Teams:</p>
          <a href="${teams_link}" style="display:inline-block;background:linear-gradient(135deg,#5b5fc7,#7b83eb);color:#fff;padding:14px 28px;border-radius:10px;text-decoration:none;font-size:14px;font-weight:600;">
            📹 Bli med i Teams-møtet
          </a>
          <p style="font-size:11px;color:#94a3b8;margin:12px 0 0;">Klikk på knappen ovenfor når møtet starter. Du trenger ikke laste ned Teams.</p>
        </div>` : ""}
        <p style="font-size:13px;color:#94a3b8;line-height:1.6;">Vi gleder oss til møtet! Ta gjerne kontakt på <a href="mailto:firmapost@avargo.no" style="color:#2563eb;">firmapost@avargo.no</a> hvis du har spørsmål.</p>
      `;

      // Generate ICS calendar event
      const meetingUid = `booking-${Date.now()}@avargo.no`;
      const icsForCustomer = generateICS({
        date: booking_date,
        time: formattedTime,
        durationMinutes: 30,
        summary: `Møte med ${advisor_name || advisor?.name || "Avargo"}`,
        description: `Rådgivningsmøte med ${advisor_name || advisor?.name || "Avargo"} for ${company_name}.`,
        organizerEmail: advisor?.email || "kontakt@avargo.no",
        organizerName: advisor_name || advisor?.name || "Avargo",
        attendeeEmail: customer_email,
        attendeeName: customer_name,
        teamsLink: teams_link,
        uid: meetingUid,
      });

      const icsForAdvisor = generateICS({
        date: booking_date,
        time: formattedTime,
        durationMinutes: 30,
        summary: `Møte: ${customer_name} — ${company_name}`,
        description: `Rådgivningsmøte med ${customer_name} (${company_name}).\\nE-post: ${customer_email}${customer_phone ? "\\nTlf: " + customer_phone : ""}`,
        organizerEmail: advisor?.email || "kontakt@avargo.no",
        organizerName: advisor?.name || "Avargo",
        attendeeEmail: customer_email,
        attendeeName: customer_name,
        teamsLink: teams_link,
        uid: meetingUid,
      });

      await sendEmail({
        ...smtpOpts,
        to: customer_email,
        subject: `✅ Booking bekreftet: ${formattedDate} kl. ${formattedTime} — Avargo`,
        html: wrapHtml("✅ Din booking er bekreftet!", customerBody),
        icsAttachment: icsForCustomer,
      });

      // ── Email to ADVISOR ──
      if (advisor?.email) {
        const advisorBody = `
          <div style="margin-bottom:20px;">
            <p style="font-size:14px;color:#0f172a;">Hei ${advisor.name} 👋</p>
            <p style="font-size:14px;color:#475569;line-height:1.7;">
              Du har bekreftet en booking. Kunden har fått tilsendt møtedetaljene og Teams-lenken.
            </p>
          </div>
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:20px;margin-bottom:20px;">
            <table style="border-collapse:collapse;width:100%;">
              <tr><td style="padding:8px 12px 8px 0;color:#64748b;font-size:13px;font-weight:600;">📅 Dato</td><td style="padding:8px 0;font-size:14px;color:#0f172a;">${formattedDate}</td></tr>
              <tr><td style="padding:8px 12px 8px 0;color:#64748b;font-size:13px;font-weight:600;">🕐 Tidspunkt</td><td style="padding:8px 0;font-size:14px;color:#0f172a;">kl. ${formattedTime}</td></tr>
              <tr><td style="padding:8px 12px 8px 0;color:#64748b;font-size:13px;font-weight:600;">👤 Kunde</td><td style="padding:8px 0;font-size:14px;color:#0f172a;">${customer_name}</td></tr>
              <tr><td style="padding:8px 12px 8px 0;color:#64748b;font-size:13px;font-weight:600;">🏢 Selskap</td><td style="padding:8px 0;font-size:14px;color:#0f172a;">${company_name}</td></tr>
              <tr><td style="padding:8px 12px 8px 0;color:#64748b;font-size:13px;font-weight:600;">📧 E-post</td><td style="padding:8px 0;font-size:14px;"><a href="mailto:${customer_email}" style="color:#2563eb;">${customer_email}</a></td></tr>
              ${customer_phone ? `<tr><td style="padding:8px 12px 8px 0;color:#64748b;font-size:13px;font-weight:600;">📞 Telefon</td><td style="padding:8px 0;font-size:14px;color:#0f172a;">${customer_phone}</td></tr>` : ""}
            </table>
          </div>
          ${teams_link ? `<p style="font-size:13px;color:#475569;">Teams-møte: <a href="${teams_link}" style="color:#2563eb;">${teams_link}</a></p>` : ""}
        `;

        await sendEmail({
          ...smtpOpts,
          to: advisor.email,
          subject: `✅ Booking bekreftet: ${customer_name} — ${formattedDate} kl. ${formattedTime}`,
          html: wrapHtml("✅ Booking bekreftet", advisorBody),
          icsAttachment: icsForAdvisor,
        });
      }
    }

    if (type === "send_document") {
      const { recipient_email, recipient_name, document_title, document_html } = data;

      const body = `
        <div style="margin-bottom:20px;">
          <p style="font-size:14px;color:#0f172a;">Hei${recipient_name ? ` ${recipient_name}` : ""},</p>
          <p style="font-size:14px;color:#475569;">Her er dokumentet <strong>${document_title}</strong> du har bedt om.</p>
        </div>
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:20px;margin-bottom:20px;font-family:'Georgia',serif;font-size:13px;line-height:1.7;color:#1a1a1a;">
          ${document_html}
        </div>
      `;

      await sendEmail({
        ...smtpOpts,
        to: recipient_email,
        subject: `Dokument: ${document_title} — Avargo`,
        html: wrapHtml(`📄 ${document_title}`, body),
      });
    }

    if (type === "employee_invitation") {
      const { company_name, employee_name, employee_email, invited_by_name } = data;

      const body = `
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:20px;margin-bottom:20px;">
          <h2 style="margin:0 0 14px;font-size:15px;color:#475569;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">👤 Ny ansattinvitasjon</h2>
          <table style="border-collapse:collapse;width:100%;">
            <tr><td style="padding:6px 12px 6px 0;color:#64748b;font-size:13px;font-weight:600;">Selskap</td><td style="padding:6px 0;font-size:14px;color:#0f172a;">${company_name}</td></tr>
            <tr><td style="padding:6px 12px 6px 0;color:#64748b;font-size:13px;font-weight:600;">Ansatt</td><td style="padding:6px 0;font-size:14px;color:#0f172a;">${employee_name}</td></tr>
            <tr><td style="padding:6px 12px 6px 0;color:#64748b;font-size:13px;font-weight:600;">E-post</td><td style="padding:6px 0;font-size:14px;"><a href="mailto:${employee_email}" style="color:#2563eb;">${employee_email}</a></td></tr>
            <tr><td style="padding:6px 12px 6px 0;color:#64748b;font-size:13px;font-weight:600;">Invitert av</td><td style="padding:6px 0;font-size:14px;color:#0f172a;">${invited_by_name}</td></tr>
          </table>
        </div>
        <p style="font-size:14px;color:#475569;">Denne invitasjonen krever godkjenning fra admin før brukeren får tilgang.</p>
      `;

      await sendEmail({
        ...smtpOpts,
        to: "kontakt@avargo.no",
        subject: `Ny ansattinvitasjon: ${employee_name} — ${company_name}`,
        html: wrapHtml("👤 Godkjenning påkrevd: Ny ansatt", body),
      });
    }

    if (type === "admin_update") {
      const { customer_email, customer_name, company_name, admin_name, action_type, action_detail } = data;

      const actionLabels: Record<string, string> = {
        financial: "📊 Økonomidata",
        document: "📄 Dokument",
        handbook: "📘 Personalhåndbok",
      };

      const label = actionLabels[action_type] || "📝 Oppdatering";

      const body = `
        <div style="margin-bottom:20px;">
          <p style="font-size:14px;color:#0f172a;">Hei ${customer_name} 👋</p>
          <p style="font-size:14px;color:#475569;line-height:1.7;">
            Din regnskapsfører <strong>${admin_name}</strong> har lagt til noe nytt på kontoen til <strong>${company_name}</strong>:
          </p>
        </div>
        <div style="background:#f0f9ff;border-left:4px solid #2563eb;padding:16px 20px;border-radius:0 10px 10px 0;margin-bottom:20px;">
          <p style="font-size:13px;color:#64748b;margin:0 0 4px;font-weight:600;">${label}</p>
          <p style="font-size:14px;color:#0f172a;margin:0;line-height:1.6;">${action_detail}</p>
        </div>
        <div style="margin-bottom:20px;">
          <p style="font-size:14px;color:#475569;line-height:1.7;">
            Logg inn på kundeportalen for å se oppdateringen:
          </p>
          <a href="https://obsidian-edge-finance.lovable.app/kunde/logg-inn" 
             style="display:inline-block;margin-top:10px;background:linear-gradient(135deg,#1a1a2e,#16213e);color:#fff;padding:12px 24px;border-radius:10px;text-decoration:none;font-size:14px;font-weight:600;">
            Gå til kundeportalen →
          </a>
        </div>
        <p style="font-size:13px;color:#94a3b8;line-height:1.6;">Vi jobber alltid for at du skal ha full oversikt. Ta kontakt dersom du har spørsmål! 😊</p>
      `;

      await sendEmail({
        ...smtpOpts,
        to: customer_email,
        subject: `${label}: Ny oppdatering fra ${admin_name} — ${company_name}`,
        html: wrapHtml(`${label} — Oppdatering fra din regnskapsfører`, body),
      });
    }

    if (type === "account_feedback") {
      const { search_term, top_result_account, top_result_name, message } = data;

      const body = `
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:20px;margin-bottom:20px;">
          <h2 style="margin:0 0 14px;font-size:15px;color:#475569;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">🔍 Kontohjelp-tilbakemelding</h2>
          <table style="border-collapse:collapse;width:100%;">
            <tr><td style="padding:6px 12px 6px 0;color:#64748b;font-size:13px;font-weight:600;">Søkeord</td><td style="padding:6px 0;font-size:14px;color:#0f172a;font-weight:600;">«${search_term}»</td></tr>
            ${top_result_account ? `<tr><td style="padding:6px 12px 6px 0;color:#64748b;font-size:13px;font-weight:600;">Beste treff</td><td style="padding:6px 0;font-size:14px;color:#0f172a;">${top_result_account} – ${top_result_name || "Ukjent"}</td></tr>` : `<tr><td style="padding:6px 12px 6px 0;color:#64748b;font-size:13px;font-weight:600;">Beste treff</td><td style="padding:6px 0;font-size:14px;color:#ef4444;">Ingen treff funnet</td></tr>`}
          </table>
        </div>
        ${message ? `<div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:16px 20px;border-radius:0 10px 10px 0;font-size:14px;line-height:1.7;color:#1e293b;margin-bottom:20px;"><strong>Brukerens kommentar:</strong><br/>${message}</div>` : ""}
        <p style="font-size:14px;color:#475569;">En bruker rapporterer at søkeordet «<strong>${search_term}</strong>» ikke ga riktig resultat i kontoplanen. Vurder å oppdatere tags eller beskrivelser.</p>
      `;

      await sendEmail({
        ...smtpOpts,
        to: "kontakt@avargo.no",
        subject: `Kontohjelp: Manglende treff for «${search_term}»`,
        html: wrapHtml("🔍 Kontohjelp-tilbakemelding", body),
      });
    }
    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Notify error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
