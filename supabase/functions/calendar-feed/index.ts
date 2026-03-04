import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const encoder = new TextEncoder();

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function icsDate(d: Date) {
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
}

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function signProfileToken(profileId: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(`calendar-feed:${profileId}`));
  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

async function createAuthedClient(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return { error: jsonResponse({ error: "Unauthorized" }, 401) };
  }

  const jwt = authHeader.replace("Bearer ", "").trim();
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const publishableKey = Deno.env.get("SUPABASE_ANON_KEY") ?? Deno.env.get("SUPABASE_PUBLISHABLE_KEY");

  if (!publishableKey) {
    return { error: jsonResponse({ error: "Server misconfiguration" }, 500) };
  }

  const client = createClient(supabaseUrl, publishableKey, {
    global: {
      headers: {
        Authorization: authHeader,
      },
    },
  });

  const { data: userData, error: userError } = await client.auth.getUser(jwt);
  if (userError || !userData.user) {
    return { error: jsonResponse({ error: "Unauthorized" }, 401) };
  }

  return { client, user: userData.user };
}

async function requireCalendarToken(profileId: string, token: string | null) {
  const secret = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!secret || !token) return false;
  const expected = await signProfileToken(profileId, secret);
  return safeEqual(expected, token);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const url = new URL(req.url);
  const profileId = url.searchParams.get("profile_id");
  const action = url.searchParams.get("action");
  const bookingId = url.searchParams.get("booking_id");
  const token = url.searchParams.get("token");

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const sb = createClient(supabaseUrl, serviceKey);

  try {
    if (action === "get_token" && profileId) {
      const auth = await createAuthedClient(req);
      if (auth.error) return auth.error;

      const { data: employeeOrAdmin, error: roleError } = await auth.client.rpc("is_employee_or_admin");
      if (roleError || !employeeOrAdmin) {
        return jsonResponse({ error: "Forbidden" }, 403);
      }

      const [{ data: currentProfileId }, { data: isAdmin }] = await Promise.all([
        auth.client.rpc("current_profile_id"),
        auth.client.rpc("is_admin"),
      ]);

      if (!isAdmin && currentProfileId !== profileId) {
        return jsonResponse({ error: "Forbidden" }, 403);
      }

      const signedToken = await signProfileToken(profileId, serviceKey);
      const feedUrl = `${supabaseUrl}/functions/v1/calendar-feed?action=feed&profile_id=${profileId}&token=${signedToken}`;

      return jsonResponse({
        token: signedToken,
        feedUrl,
        outlookSubscribeUrl: `webcal://${feedUrl.replace(/^https?:\/\//, "")}`,
      });
    }

    if (action === "download_booking" && bookingId) {
      const { data: booking, error } = await sb
        .from("bookings")
        .select("*, profiles:advisor_id(name, teams_link)")
        .eq("id", bookingId)
        .single();

      if (error || !booking) {
        return new Response("Not found", { status: 404, headers: corsHeaders });
      }

      const allowed = await requireCalendarToken(booking.advisor_id, token);
      if (!allowed) {
        return new Response("Unauthorized", { status: 401, headers: corsHeaders });
      }

      const [year, month, day] = booking.booking_date.split("-").map(Number);
      const [hours, minutes] = booking.booking_time.split(":").map(Number);
      const start = new Date(Date.UTC(year, month - 1, day, hours - 1, minutes));
      const end = new Date(start.getTime() + 30 * 60 * 1000);
      const teamsLink = (booking as { profiles?: { teams_link?: string | null } }).profiles?.teams_link || "";

      const ics = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Avargo//Booking//NO",
        "BEGIN:VEVENT",
        `DTSTART:${icsDate(start)}`,
        `DTEND:${icsDate(end)}`,
        `SUMMARY:Rådgivning – ${booking.customer_name}`,
        `DESCRIPTION:Kunde: ${booking.customer_name}\\nBedrift: ${booking.company_name}\\nE-post: ${booking.customer_email}\\nTelefon: ${booking.customer_phone}${booking.message ? "\\nMelding: " + booking.message : ""}${teamsLink ? "\\n\\nTeams-møte: " + teamsLink : ""}`,
        teamsLink ? `LOCATION:${teamsLink}` : "LOCATION:Teams-møte",
        `UID:booking-${booking.id}@avargo`,
        "STATUS:CONFIRMED",
        "END:VEVENT",
        "END:VCALENDAR",
      ].join("\r\n");

      return new Response(ics, {
        headers: {
          ...corsHeaders,
          "Content-Type": "text/calendar; charset=utf-8",
          "Content-Disposition": `attachment; filename="booking-${booking.id}.ics"`,
        },
      });
    }

    if (action === "feed" && profileId) {
      const allowed = await requireCalendarToken(profileId, token);
      if (!allowed) {
        return new Response("Unauthorized", { status: 401, headers: corsHeaders });
      }

      const { data: bookings, error: bookingsError } = await sb
        .from("bookings")
        .select("*")
        .eq("advisor_id", profileId)
        .eq("status", "confirmed")
        .order("booking_date");

      if (bookingsError) {
        throw bookingsError;
      }

      const events = (bookings || []).map((booking) => {
        const [year, month, day] = booking.booking_date.split("-").map(Number);
        const [hours, minutes] = booking.booking_time.split(":").map(Number);
        const start = new Date(Date.UTC(year, month - 1, day, hours - 1, minutes));
        const end = new Date(start.getTime() + 30 * 60 * 1000);
        return [
          "BEGIN:VEVENT",
          `DTSTART:${icsDate(start)}`,
          `DTEND:${icsDate(end)}`,
          `SUMMARY:Rådgivning – ${booking.customer_name}`,
          `DESCRIPTION:Bedrift: ${booking.company_name}\\nE-post: ${booking.customer_email}`,
          `UID:booking-${booking.id}@avargo`,
          "END:VEVENT",
        ].join("\r\n");
      });

      const { data: blocked, error: blockedError } = await sb
        .from("advisor_blocked_dates")
        .select("*")
        .eq("profile_id", profileId);

      if (blockedError) {
        throw blockedError;
      }

      const blockedEvents = (blocked || []).map((blockedDate) => {
        const [year, month, day] = blockedDate.blocked_date.split("-").map(Number);
        return [
          "BEGIN:VEVENT",
          `DTSTART;VALUE=DATE:${year}${pad(month)}${pad(day)}`,
          `DTEND;VALUE=DATE:${year}${pad(month)}${pad(day + 1)}`,
          `SUMMARY:Blokkert – ${blockedDate.reason || "Ikke tilgjengelig"}`,
          `UID:blocked-${blockedDate.id}@avargo`,
          "TRANSP:OPAQUE",
          "END:VEVENT",
        ].join("\r\n");
      });

      const ics = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Avargo//Kalender//NO",
        "X-WR-CALNAME:Avargo Bookinger",
        "METHOD:PUBLISH",
        ...events,
        ...blockedEvents,
        "END:VCALENDAR",
      ].join("\r\n");

      return new Response(ics, {
        headers: { ...corsHeaders, "Content-Type": "text/calendar; charset=utf-8" },
      });
    }

    return jsonResponse({ error: "Missing parameters" }, 400);
  } catch (error) {
    console.error("calendar-feed error:", error);
    return jsonResponse({ error: error instanceof Error ? error.message : "Unexpected error" }, 500);
  }
});
