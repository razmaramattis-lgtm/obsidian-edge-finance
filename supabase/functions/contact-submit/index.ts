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
      section, source, referrer,
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
    const safeSource = optionalString(source, 500);
    const safeReferrer = optionalString(referrer, 500);

    if ((safeEmail && !isEmail(safeEmail)) || (!safeCompany && !safeContact && !safeEmail)) {
      throw new Error("Ugyldig skjema.");
    }

    const sectionLabel = safeSection ? SECTION_LABELS[safeSection] || safeSection : null;

    // Retry the insert on transient backend errors so leads are never lost
    let dbError: unknown = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      const { error } = await supabase
        .from("contact_submissions")
        .insert({
          company_name: safeCompany, org_number: safeOrg, contact_person: safeContact, email: safeEmail || null, phone: safePhone,
          industry: safeIndustry, industry_code: safeIndustryCode, revenue_target: safeRevenue, message: safeMessage, package: safePackage,
          section: safeSection, source: safeSource, referrer: safeReferrer,
        });
      dbError = error;
      if (!error) break;
      await new Promise((r) => setTimeout(r, 800 * (attempt + 1)));
    }

    if (dbError) {
      console.error("DB error:", dbError);
      throw new Error("Vi klarte ikke å lagre henvendelsen akkurat nå. Prøv igjen om litt, eller ring 98 64 23 91.");
    }

    const emailPayload = {
      templateName: "admin-contact-notification",
      recipientEmail: "kontakt@avargo.no",
      idempotencyKey: `contact-${crypto.randomUUID()}`,
      templateData: {
        company_name: safeCompany,
        org_number: safeOrg,
        contact_person: safeContact,
        email: safeEmail || null,
        phone: safePhone,
        industry: safeIndustry,
        revenue_target: safeRevenue,
        message: safeMessage,
        section_label: sectionLabel,
        package_name: safePackage,
        source: safeSource,
      },
    };

    // The visitor should not have to wait for email rendering and queueing.
    // Once the inquiry is safely stored, enqueue its notification in the
    // background and return success to the form immediately.
    const enqueueNotification = async () => {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const { error: emailErr } = await supabase.functions.invoke("send-transactional-email", {
            body: emailPayload,
          });
          if (!emailErr) return;
          console.error("Email invoke error:", emailErr);
        } catch (emailErr) {
          console.error("Email error:", emailErr);
        }
        if (attempt === 0) await new Promise((r) => setTimeout(r, 1200));
      }
    };

    const edgeRuntime = (globalThis as typeof globalThis & {
      EdgeRuntime?: { waitUntil(promise: Promise<unknown>): void };
    }).EdgeRuntime;
    if (edgeRuntime) {
      edgeRuntime.waitUntil(enqueueNotification());
    } else {
      // Local-runtime fallback; production uses waitUntil above.
      void enqueueNotification();
    }
    return new Response(
      JSON.stringify({ success: true, email_queued: true }),
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
