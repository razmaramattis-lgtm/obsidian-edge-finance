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
  samarbeid: "Samarbeid",
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

function asString(value: unknown, max = 5000) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function optionalString(value: unknown, max = 5000) {
  const str = asString(value, max);
  return str || null;
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isIsoDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function isTime(value: string) {
  return /^\d{2}:\d{2}(:\d{2})?$/.test(value);
}

async function insertBooking(supabase: ReturnType<typeof createClient>, body: Record<string, unknown>) {
  const advisor_id = asString(body.advisor_id, 64);
  const booking_date = asString(body.booking_date, 10);
  const booking_time = asString(body.booking_time, 8);
  const customer_name = asString(body.customer_name, 120);
  const customer_email = asString(body.customer_email, 255).toLowerCase();
  const customer_phone = asString(body.customer_phone, 40);
  const company_name = asString(body.company_name, 160);
  const message = optionalString(body.message, 2000);
  const section = optionalString(body.section, 80);
  const teams_link = optionalString(body.teams_link, 500);

  if (!advisor_id || !isIsoDate(booking_date) || !isTime(booking_time) || !customer_name || !company_name || !customer_phone || !isEmail(customer_email)) {
    throw new Error("Ugyldig bookingdata.");
  }

  const [{ data: advisor, error: advisorError }, { data: existing }] = await Promise.all([
    supabase.from("profiles").select("id, booking_active, teams_link").eq("id", advisor_id).maybeSingle(),
    supabase.from("bookings").select("id").eq("advisor_id", advisor_id).eq("booking_date", booking_date).eq("booking_time", booking_time).neq("status", "cancelled").limit(1),
  ]);

  if (advisorError || !advisor || !(advisor as any).booking_active) {
    throw new Error("Rådgiver er ikke tilgjengelig for booking.");
  }

  if ((existing || []).length > 0) {
    throw new Error("Tidspunktet er ikke lenger ledig.");
  }

  const { error } = await supabase.from("bookings").insert({
    advisor_id,
    booking_date,
    booking_time,
    customer_name,
    customer_email,
    customer_phone,
    company_name,
    message,
    section,
    teams_link: teams_link || (advisor as any).teams_link || null,
  });

  if (error) throw error;
  return { success: true };
}

async function insertAccountFeedback(supabase: ReturnType<typeof createClient>, body: Record<string, unknown>) {
  const search_term = asString(body.search_term, 160);
  const top_result_account = optionalString(body.top_result_account, 40);
  const top_result_name = optionalString(body.top_result_name, 160);
  const message = optionalString(body.message, 1000);
  if (!search_term) throw new Error("Søkeord er påkrevd.");
  const { error } = await supabase.from("account_feedback").insert({ search_term, top_result_account, top_result_name, message });
  if (error) throw error;
  return { success: true };
}

async function insertJobApplication(supabase: ReturnType<typeof createClient>, body: Record<string, unknown>) {
  const payload = {
    job_listing_id: asString(body.job_listing_id, 64),
    full_name: asString(body.full_name, 160),
    email: asString(body.email, 255).toLowerCase(),
    phone: asString(body.phone, 40),
    date_of_birth: optionalString(body.date_of_birth, 20),
    address: optionalString(body.address, 160),
    city: optionalString(body.city, 120),
    postal_code: optionalString(body.postal_code, 20),
    message: optionalString(body.message, 4000),
    cv_url: optionalString(body.cv_url, 1000),
    cv_file_name: optionalString(body.cv_file_name, 255),
  };

  if (!payload.job_listing_id || !payload.full_name || !payload.phone || !isEmail(payload.email)) {
    throw new Error("Ugyldig søknadsdata.");
  }

  const { error } = await supabase.from("job_applications").insert(payload);
  if (error) throw error;
  return { success: true };
}

async function insertOpenApplication(supabase: ReturnType<typeof createClient>, body: Record<string, unknown>) {
  const payload = {
    full_name: asString(body.full_name, 160),
    email: asString(body.email, 255).toLowerCase(),
    phone: asString(body.phone, 40),
    linkedin_url: optionalString(body.linkedin_url, 500),
    portfolio_url: optionalString(body.portfolio_url, 500),
    preferred_category: optionalString(body.preferred_category, 120),
    message: optionalString(body.message, 4000),
    cv_url: optionalString(body.cv_url, 1000),
    cv_file_name: optionalString(body.cv_file_name, 255),
  };

  if (!payload.full_name || !payload.phone || !isEmail(payload.email)) {
    throw new Error("Ugyldig søknadsdata.");
  }

  const { error } = await supabase.from("open_applications").insert(payload);
  if (error) throw error;
  return { success: true };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const action = asString(body?.action, 80) || "contact_submission";
    const {
      company_name, org_number, contact_person, email, phone,
      industry, industry_code, revenue_target, message, package: pkg,
      section,
    } = body;

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    if (action === "booking") {
      const result = await insertBooking(supabase, body);
      return new Response(JSON.stringify(result), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "account_feedback") {
      const result = await insertAccountFeedback(supabase, body);
      return new Response(JSON.stringify(result), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "job_application") {
      const result = await insertJobApplication(supabase, body);
      return new Response(JSON.stringify(result), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "open_application") {
      const result = await insertOpenApplication(supabase, body);
      return new Response(JSON.stringify(result), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const safeEmail = asString(email, 255).toLowerCase();
    const safeCompany = optionalString(company_name, 160);
    const safeOrg = optionalString(org_number, 40);
    const safeContact = optionalString(contact_person, 120);
    const safePhone = optionalString(phone, 40);
    const safeIndustry = optionalString(industry, 120);
    const safeIndustryCode = optionalString(industry_code, 40);
    const safeRevenue = optionalString(revenue_target, 120);
    const safeMessage = optionalString(message, 5000);
    const safePackage = optionalString(pkg, 120);
    const safeSection = optionalString(section, 80);

    if ((safeEmail && !isEmail(safeEmail)) || (!safeCompany && !safeContact && !safeEmail)) {
      throw new Error("Ugyldig skjema.");
    }

    const sectionLabel = safeSection ? SECTION_LABELS[safeSection] || safeSection : null;

    const { error: dbError } = await supabase
      .from("contact_submissions")
      .insert({
        company_name: safeCompany, org_number: safeOrg, contact_person: safeContact, email: safeEmail || null, phone: safePhone,
        industry: safeIndustry, industry_code: safeIndustryCode, revenue_target: safeRevenue, message: safeMessage, package: safePackage,
        section: safeSection,
      });

    if (dbError) console.error("DB error:", dbError);

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
            <div style="background:linear-gradient(135deg,#1a1a2e,#16213e);padding:28px 32px;border-radius:12px 12px 0 0;">
              <h1 style="color:#ffffff;margin:0;font-size:20px;font-weight:600;letter-spacing:-0.3px;">📬 Ny henvendelse</h1>
              <p style="color:#94a3b8;margin:6px 0 0;font-size:13px;">${now}${sectionLabel ? ` · Avdeling: ${sectionLabel}` : ""}</p>
            </div>
            <div style="padding:28px 32px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;">
              ${sectionBadge}
              ${safePackage ? `<div style="display:inline-block;background:#eef2ff;color:#4338ca;padding:6px 14px;border-radius:20px;font-size:13px;font-weight:600;margin-bottom:20px;">🏷️ ${safePackage}</div>` : ""}
              <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:20px;margin-bottom:20px;">
                <h2 style="margin:0 0 14px;font-size:15px;color:#475569;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">🏢 Selskap</h2>
                <div style="font-size:18px;font-weight:700;color:#0f172a;margin-bottom:4px;">${safeCompany || "Ikke oppgitt"}</div>
                ${safeOrg ? `<div style="font-size:13px;color:#64748b;">Org.nr: ${safeOrg}</div>` : ""}
                ${safeIndustry ? `<div style="margin-top:8px;"><span style="display:inline-block;background:#f1f5f9;color:#475569;padding:3px 10px;border-radius:12px;font-size:12px;">${safeIndustry}</span></div>` : ""}
                ${safeIndustryCode ? `<div style="margin-top:4px;font-size:12px;color:#94a3b8;">Næringskode: ${safeIndustryCode}</div>` : ""}
              </div>
              <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:20px;margin-bottom:20px;">
                <h2 style="margin:0 0 14px;font-size:15px;color:#475569;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">👤 Kontaktperson</h2>
                <div style="font-size:16px;font-weight:600;color:#0f172a;margin-bottom:10px;">${safeContact || "Ikke oppgitt"}</div>
                <table style="border-collapse:collapse;">
                  ${safeEmail ? `<tr><td style="padding:4px 12px 4px 0;color:#64748b;font-size:13px;">📧</td><td style="padding:4px 0;"><a href="mailto:${safeEmail}" style="color:#2563eb;text-decoration:none;font-size:14px;">${safeEmail}</a></td></tr>` : ""}
                  ${safePhone ? `<tr><td style="padding:4px 12px 4px 0;color:#64748b;font-size:13px;">📱</td><td style="padding:4px 0;"><a href="tel:${safePhone}" style="color:#2563eb;text-decoration:none;font-size:14px;">${safePhone}</a></td></tr>` : ""}
                </table>
              </div>
              ${safeRevenue ? `<div style="background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:16px 20px;margin-bottom:20px;"><span style="font-size:13px;color:#92400e;font-weight:600;">💰 Omsetningsmål:</span><span style="font-size:14px;color:#78350f;margin-left:6px;">${safeRevenue}</span></div>` : ""}
              ${safeMessage ? `<div style="margin-bottom:20px;"><h2 style="margin:0 0 10px;font-size:15px;color:#475569;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">💬 Melding fra kunden</h2><div style="background:#f0fdf4;border-left:4px solid #22c55e;padding:16px 20px;border-radius:0 10px 10px 0;font-size:14px;line-height:1.7;color:#1e293b;white-space:pre-wrap;">${safeMessage}</div></div>` : ""}
              <div style="margin-top:28px;padding-top:16px;border-top:1px solid #e2e8f0;text-align:center;"><p style="font-size:12px;color:#94a3b8;margin:0;">Sendt fra kontaktskjemaet på <strong>avargo.no</strong>${sectionLabel ? ` · Avdeling: ${sectionLabel}` : ""}</p></div>
            </div>
          </div>`;

        await sendEmail({
          hostname: "smtp.domeneshop.no",
          port: 465,
          username: smtpUser,
          password: smtpPass,
          from: "kontakt@avargo.no",
          to: "kontakt@avargo.no",
          subject: `${sectionLabel ? `[${sectionLabel}] ` : ""}Ny henvendelse: ${safeCompany || safeContact || "Ukjent"}`,
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
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Ukjent feil" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
