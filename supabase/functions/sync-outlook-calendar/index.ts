import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Simple ICS parser – extracts VEVENT busy times
function parseICS(icsText: string): Array<{ start: string; end: string; summary: string }> {
  const events: Array<{ start: string; end: string; summary: string }> = [];
  const lines = icsText.replace(/\r\n /g, "").split(/\r?\n/);
  let inEvent = false;
  let current: { start?: string; end?: string; summary?: string } = {};

  for (const line of lines) {
    if (line === "BEGIN:VEVENT") { inEvent = true; current = {}; }
    else if (line === "END:VEVENT") {
      inEvent = false;
      if (current.start) events.push({ start: current.start, end: current.end || current.start, summary: current.summary || "Opptatt" });
    } else if (inEvent) {
      if (line.startsWith("DTSTART")) {
        const val = line.split(":").pop() || "";
        current.start = parseICSDate(val);
      } else if (line.startsWith("DTEND")) {
        const val = line.split(":").pop() || "";
        current.end = parseICSDate(val);
      } else if (line.startsWith("SUMMARY:")) {
        current.summary = line.slice(8);
      }
    }
  }
  return events;
}

function parseICSDate(val: string): string {
  // Handle VALUE=DATE format (all-day): 20260301
  if (/^\d{8}$/.test(val)) {
    return `${val.slice(0, 4)}-${val.slice(4, 6)}-${val.slice(6, 8)}`;
  }
  // Handle datetime: 20260301T090000Z or 20260301T090000
  const m = val.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})/);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  return val;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const sb = createClient(supabaseUrl, serviceKey);

  try {
    const { profile_id } = await req.json();
    if (!profile_id) return new Response(JSON.stringify({ error: "Missing profile_id" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    // Get the profile's outlook_calendar_url
    const { data: profile } = await sb.from("profiles").select("outlook_calendar_url").eq("id", profile_id).single();
    if (!profile?.outlook_calendar_url) {
      return new Response(JSON.stringify({ error: "No calendar URL configured" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Fetch the ICS feed
    const icsRes = await fetch(profile.outlook_calendar_url);
    if (!icsRes.ok) {
      return new Response(JSON.stringify({ error: "Could not fetch calendar", status: icsRes.status }), { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const icsText = await icsRes.text();
    const events = parseICS(icsText);

    // Get unique dates from events that are today or future
    const today = new Date().toISOString().slice(0, 10);
    const futureDates = new Set<string>();
    for (const ev of events) {
      const date = ev.start.slice(0, 10);
      if (date >= today) futureDates.add(date);
      // If multi-day, add in-between dates
      if (ev.end && ev.end.slice(0, 10) > ev.start.slice(0, 10)) {
        const s = new Date(ev.start.slice(0, 10));
        const e = new Date(ev.end.slice(0, 10));
        for (let d = new Date(s); d < e; d.setDate(d.getDate() + 1)) {
          const ds = d.toISOString().slice(0, 10);
          if (ds >= today) futureDates.add(ds);
        }
      }
    }

    // Get existing blocked dates for this profile (auto-synced ones)
    const { data: existingBlocked } = await sb.from("advisor_blocked_dates").select("id, blocked_date, reason").eq("profile_id", profile_id);
    const autoBlocked = (existingBlocked || []).filter(b => b.reason?.startsWith("📅 "));

    // Remove auto-blocked dates that are no longer in the calendar
    const toRemove = autoBlocked.filter(b => !futureDates.has(b.blocked_date));
    if (toRemove.length > 0) {
      await sb.from("advisor_blocked_dates").delete().in("id", toRemove.map(b => b.id));
    }

    // Add new blocked dates
    const existingDates = new Set((existingBlocked || []).map(b => b.blocked_date));
    const toAdd = [...futureDates].filter(d => !existingDates.has(d));

    if (toAdd.length > 0) {
      const rows = toAdd.map(d => {
        const ev = events.find(e => e.start.slice(0, 10) === d);
        return { profile_id, blocked_date: d, reason: `📅 ${ev?.summary || "Outlook-kalender"}` };
      });
      await sb.from("advisor_blocked_dates").insert(rows);
    }

    return new Response(JSON.stringify({
      synced: true,
      added: toAdd.length,
      removed: toRemove.length,
      total_events: events.length,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });

  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
