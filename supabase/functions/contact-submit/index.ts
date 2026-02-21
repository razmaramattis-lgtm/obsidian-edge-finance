import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const {
      company_name,
      org_number,
      contact_person,
      email,
      phone,
      industry,
      industry_code,
      revenue_target,
      message,
      package: pkg,
    } = body;

    // Save to database
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error: dbError } = await supabase
      .from("contact_submissions")
      .insert({
        company_name,
        org_number,
        contact_person,
        email,
        phone,
        industry,
        industry_code,
        revenue_target,
        message,
        package: pkg,
      });

    if (dbError) {
      console.error("DB error:", dbError);
    }

    // Send email via SMTP
    const smtpUser = Deno.env.get("SMTP_USER");
    const smtpPass = Deno.env.get("SMTP_PASS");

    if (!smtpUser || !smtpPass) {
      console.error("SMTP credentials not configured");
      return new Response(
        JSON.stringify({ success: true, email_sent: false, reason: "SMTP not configured" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const client = new SmtpClient();

    await client.connectTLS({
      hostname: "smtp.domeneshop.no",
      port: 465,
      username: smtpUser,
      password: smtpPass,
    });

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #1a1a1a; border-bottom: 2px solid #e5e5e5; padding-bottom: 10px;">
          Ny henvendelse fra kontaktskjemaet
        </h2>
        
        ${pkg ? `<div style="background: #f0f4ff; padding: 10px 15px; border-radius: 8px; margin-bottom: 20px;">
          <strong>Valgt pakke:</strong> ${pkg}
        </div>` : ""}

        <table style="width: 100%; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px 0; color: #666; width: 160px;"><strong>Selskapsnavn</strong></td>
            <td style="padding: 10px 0;">${company_name || "—"}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px 0; color: #666;"><strong>Org.nummer</strong></td>
            <td style="padding: 10px 0;">${org_number || "—"}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px 0; color: #666;"><strong>Kontaktperson</strong></td>
            <td style="padding: 10px 0;">${contact_person || "—"}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px 0; color: #666;"><strong>E-post</strong></td>
            <td style="padding: 10px 0;"><a href="mailto:${email}">${email || "—"}</a></td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px 0; color: #666;"><strong>Telefon</strong></td>
            <td style="padding: 10px 0;"><a href="tel:${phone}">${phone || "—"}</a></td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px 0; color: #666;"><strong>Bransje</strong></td>
            <td style="padding: 10px 0;">${industry || "—"}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px 0; color: #666;"><strong>Næringskode</strong></td>
            <td style="padding: 10px 0;">${industry_code || "—"}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px 0; color: #666;"><strong>Omsetningsmål</strong></td>
            <td style="padding: 10px 0;">${revenue_target || "—"}</td>
          </tr>
        </table>

        ${message ? `
        <div style="margin-top: 20px;">
          <strong style="color: #666;">Hva er viktigst for kunden:</strong>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin-top: 8px; line-height: 1.6;">
            ${message}
          </div>
        </div>` : ""}

        <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #eee; font-size: 12px; color: #999;">
          Sendt fra kontaktskjemaet på avargo.no · ${new Date().toLocaleString("nb-NO", { timeZone: "Europe/Oslo" })}
        </div>
      </div>
    `;

    await client.send({
      from: "kontakt@avargo.no",
      to: "kontakt@avargo.no",
      subject: `Ny henvendelse: ${company_name || contact_person || "Ukjent"}`,
      content: "text/html",
      html: htmlBody,
    });

    await client.close();

    return new Response(
      JSON.stringify({ success: true, email_sent: true }),
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
