import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function pad(n: number) { return n.toString().padStart(2, "0"); }
function icsDate(d: Date) {
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const url = new URL(req.url);
  const profileId = url.searchParams.get("profile_id");
  const action = url.searchParams.get("action"); // "feed" or "download_booking"
  const bookingId = url.searchParams.get("booking_id");

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const sb = createClient(supabaseUrl, serviceKey);

  // Download single booking as .ics
  if (action === "download_booking" && bookingId) {
    const { data: booking } = await sb.from("bookings").select("*, profiles:advisor_id(name, teams_link)").eq("id", bookingId).single();
    if (!booking) return new Response("Not found", { status: 404, headers: corsHeaders });

    const dateStr = booking.booking_date;
    const timeStr = booking.booking_time;
    const [y, m, d] = dateStr.split("-").map(Number);
    const [h, mi] = timeStr.split(":").map(Number);
    const start = new Date(Date.UTC(y, m - 1, d, h - 1, mi)); // CET→UTC approx
    const end = new Date(start.getTime() + 30 * 60 * 1000);
    const teamsLink = (booking as any).profiles?.teams_link || "";

    const ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Avargo//Booking//NO",
      "BEGIN:VEVENT",
      `DTSTART:${icsDate(start)}`,
      `DTEND:${icsDate(end)}`,
      `SUMMARY:Rådgivning – ${booking.customer_name}`,
      `DESCRIPTION:Kunde: ${booking.customer_name}\\nBedrift: ${booking.company_name}\\nE-post: ${booking.customer_email}\\nTelefon: ${booking.customer_phone}${booking.message ? "\\nMelding: " + booking.message : ""}${teamsLink ? "\\n\\nTeams-møte: " + teamsLink : ""}`,
      teamsLink ? `LOCATION:${teamsLink}` : "LOCATION:Teams-møte",
      `UID:booking-${booking.id}@avargo`,
      `STATUS:CONFIRMED`,
      "END:VEVENT", "END:VCALENDAR"
    ].join("\r\n");

    return new Response(ics, {
      headers: { ...corsHeaders, "Content-Type": "text/calendar; charset=utf-8", "Content-Disposition": `attachment; filename="booking-${booking.id}.ics"` },
    });
  }

  // Calendar feed for all confirmed bookings for an advisor
  if (action === "feed" && profileId) {
    const { data: bookings } = await sb.from("bookings").select("*").eq("advisor_id", profileId).eq("status", "confirmed").order("booking_date");

    const events = (bookings || []).map(b => {
      const [y, m, d] = b.booking_date.split("-").map(Number);
      const [h, mi] = b.booking_time.split(":").map(Number);
      const start = new Date(Date.UTC(y, m - 1, d, h - 1, mi));
      const end = new Date(start.getTime() + 30 * 60 * 1000);
      return [
        "BEGIN:VEVENT",
        `DTSTART:${icsDate(start)}`,
        `DTEND:${icsDate(end)}`,
        `SUMMARY:Rådgivning – ${b.customer_name}`,
        `DESCRIPTION:Bedrift: ${b.company_name}\\nE-post: ${b.customer_email}`,
        `UID:booking-${b.id}@avargo`,
        "END:VEVENT"
      ].join("\r\n");
    });

    // Also add blocked dates as all-day events
    const { data: blocked } = await sb.from("advisor_blocked_dates").select("*").eq("profile_id", profileId);
    const blockedEvents = (blocked || []).map(bd => {
      const [y, m, d] = bd.blocked_date.split("-").map(Number);
      return [
        "BEGIN:VEVENT",
        `DTSTART;VALUE=DATE:${y}${pad(m)}${pad(d)}`,
        `DTEND;VALUE=DATE:${y}${pad(m)}${pad(d + 1)}`,
        `SUMMARY:Blokkert – ${bd.reason || "Ikke tilgjengelig"}`,
        `UID:blocked-${bd.id}@avargo`,
        "TRANSP:OPAQUE",
        "END:VEVENT"
      ].join("\r\n");
    });

    const ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Avargo//Kalender//NO",
      "X-WR-CALNAME:Avargo Bookinger",
      "METHOD:PUBLISH",
      ...events, ...blockedEvents,
      "END:VCALENDAR"
    ].join("\r\n");

    return new Response(ics, {
      headers: { ...corsHeaders, "Content-Type": "text/calendar; charset=utf-8" },
    });
  }

  return new Response(JSON.stringify({ error: "Missing parameters" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
});