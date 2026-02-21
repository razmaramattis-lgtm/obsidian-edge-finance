import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface DeadlineTemplate {
  day: number;       // day of month
  months: number[];  // 0-indexed months when this applies (empty = every month)
  title: string;
  url: string;
  description?: string;
}

// Standard recurring deadlines from Skatteetaten for næringsdrivende
// Source: https://www.skatteetaten.no/bedrift-og-organisasjon/starte-og-drive/frister-gebyrer-og-tilleggsskatt/frister-og-oppgaver/
const TEMPLATES: DeadlineTemplate[] = [
  // A-melding - 5. every month (for previous month)
  {
    day: 5,
    months: [],
    title: "A-melding – frist for levering",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/arbeidsgiver/a-meldingen/",
    description: "Rapporter lønn, arbeidsgiveravgift og forskuddstrekk for forrige måned",
  },
  // MVA-melding - 10. in feb (4.kv), apr (1.kv), jul (2.kv), okt (3.kv) for alminnelig
  // Simplified: every 10th for bi-monthly/quarterly reporting
  {
    day: 10,
    months: [1, 3, 5, 7, 9, 11], // feb, apr, jun, aug, okt, des
    title: "Mva-melding – frist for levering og betaling",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/avgifter/mva/mva-melding/",
    description: "Lever mva-melding og betal skyldig merverdiavgift",
  },
  // Forskuddsskatt - 15. mars, juni, sept, des
  {
    day: 15,
    months: [2, 5, 8, 11], // mar, jun, sep, des
    title: "Forskuddsskatt – frist for betaling",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/skatt/forskuddsskatt/",
    description: "Betal forskuddsskatt for inneværende termin",
  },
  // Særavgiftsmelding - 18. every month
  {
    day: 18,
    months: [],
    title: "Særavgiftsmelding – leveringsfrist",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/avgifter/saravgifter/rapportere/saravgiftsmelding/",
    description: "Fristen for å rapportere og betale særavgift",
  },
  // Skattemelding for næringsdrivende (ENK) - 31. mai
  {
    day: 31,
    months: [4], // mai
    title: "Skattemelding for næringsdrivende – frist for levering",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/skatt/skattemelding-naering/",
    description: "Lever skattemeldingen for enkeltpersonforetak og selskap",
  },
  // Aksjonærregisteroppgave - 31. januar
  {
    day: 31,
    months: [0], // jan
    title: "Aksjonærregisteroppgave – frist for levering",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/skatt/aksjonarregisteroppgaven/",
    description: "Rapporter endringer i aksjekapital, utbytte og aksjonærer",
  },
  // Årsregnskap - 31. juli (for forrige år)
  {
    day: 31,
    months: [6], // juli
    title: "Årsregnskap – frist for innsending til Regnskapsregisteret",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/starte-og-drive/arsregnskap/",
    description: "Send inn godkjent årsregnskap til Brønnøysundregistrene",
  },
  // Skattemelding AS - 31. mai
  {
    day: 31,
    months: [4], // mai
    title: "Skattemelding for aksjeselskap – frist for levering",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/skatt/skattemelding-naering/",
    description: "Lever skattemeldingen for aksjeselskap (RF-1028)",
  },
  // Arbeidsgiveravgift terminoppgave - tied to a-melding, just emphasize quarterly
  {
    day: 15,
    months: [0, 2, 4, 6, 8, 10], // jan, mar, mai, jul, sep, nov
    title: "Arbeidsgiveravgift – frist for betaling",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/arbeidsgiver/arbeidsgiveravgift/",
    description: "Betal arbeidsgiveravgift for forrige termin",
  },
  // Forskuddstrekk betaling - 15. every other month
  {
    day: 15,
    months: [0, 2, 4, 6, 8, 10],
    title: "Forskuddstrekk – frist for betaling",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/arbeidsgiver/forskuddstrekk/",
    description: "Betal forskuddstrekk for forrige termin",
  },
];

function generateDeadlines(monthsAhead: number = 6) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const deadlines: {
    date: string;
    day: number;
    month: string;
    year: number;
    title: string;
    url: string;
    description?: string;
  }[] = [];

  const monthNames = [
    "januar", "februar", "mars", "april", "mai", "juni",
    "juli", "august", "september", "oktober", "november", "desember",
  ];

  for (let offset = 0; offset <= monthsAhead; offset++) {
    const targetDate = new Date(today.getFullYear(), today.getMonth() + offset, 1);
    const m = targetDate.getMonth();
    const y = targetDate.getFullYear();

    for (const tmpl of TEMPLATES) {
      if (tmpl.months.length > 0 && !tmpl.months.includes(m)) continue;

      // Handle months with fewer days
      const lastDay = new Date(y, m + 1, 0).getDate();
      const day = Math.min(tmpl.day, lastDay);
      const d = new Date(y, m, day);

      if (d < today) continue;

      deadlines.push({
        date: d.toISOString().split("T")[0],
        day,
        month: monthNames[m],
        year: y,
        title: tmpl.title,
        url: tmpl.url,
        ...(tmpl.description ? { description: tmpl.description } : {}),
      });
    }
  }

  // Sort and deduplicate (same date + title)
  deadlines.sort((a, b) => a.date.localeCompare(b.date) || a.title.localeCompare(b.title));
  const seen = new Set<string>();
  return deadlines.filter(d => {
    const key = `${d.date}|${d.title}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const limit = body.limit || 10;

    const deadlines = generateDeadlines(12);

    return new Response(JSON.stringify({
      deadlines: deadlines.slice(0, limit),
      total: deadlines.length,
      lastUpdated: new Date().toISOString(),
      source: "skatteetaten.no",
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({
      error: e instanceof Error ? e.message : "Unknown error",
      deadlines: [],
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
