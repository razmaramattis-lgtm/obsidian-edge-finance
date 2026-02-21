import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

type CompanyType = "as" | "enk" | "arbeidsgiver";

interface DeadlineTemplate {
  day: number;
  months: number[];
  title: string;
  url: string;
  description?: string;
  types: CompanyType[]; // which company types this applies to
}

// Standard recurring deadlines from Skatteetaten for næringsdrivende
// Source: https://www.skatteetaten.no/bedrift-og-organisasjon/starte-og-drive/frister-gebyrer-og-tilleggsskatt/frister-og-oppgaver/
const TEMPLATES: DeadlineTemplate[] = [
  {
    day: 5, months: [],
    title: "A-melding – frist for levering",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/arbeidsgiver/a-meldingen/",
    description: "Rapporter lønn, arbeidsgiveravgift og forskuddstrekk for forrige måned",
    types: ["arbeidsgiver"],
  },
  {
    day: 10, months: [1, 3, 5, 7, 9, 11],
    title: "Mva-melding – frist for levering og betaling",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/avgifter/mva/mva-melding/",
    description: "Lever mva-melding og betal skyldig merverdiavgift",
    types: ["as", "enk"],
  },
  {
    day: 15, months: [2, 5, 8, 11],
    title: "Forskuddsskatt – frist for betaling",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/skatt/forskuddsskatt/",
    description: "Betal forskuddsskatt for inneværende termin",
    types: ["enk"],
  },
  {
    day: 15, months: [2, 5, 8, 11],
    title: "Forskuddsskatt AS – frist for betaling",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/skatt/forskuddsskatt/",
    description: "Betal forskuddsskatt for aksjeselskap",
    types: ["as"],
  },
  {
    day: 18, months: [],
    title: "Særavgiftsmelding – leveringsfrist",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/avgifter/saravgifter/rapportere/saravgiftsmelding/",
    description: "Fristen for å rapportere og betale særavgift",
    types: ["as", "enk"],
  },
  {
    day: 31, months: [4],
    title: "Skattemelding for næringsdrivende – frist for levering",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/skatt/skattemelding-naering/",
    description: "Lever skattemeldingen for enkeltpersonforetak",
    types: ["enk"],
  },
  {
    day: 31, months: [0],
    title: "Aksjonærregisteroppgave – frist for levering",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/skatt/aksjonarregisteroppgaven/",
    description: "Rapporter endringer i aksjekapital, utbytte og aksjonærer",
    types: ["as"],
  },
  {
    day: 31, months: [6],
    title: "Årsregnskap – frist for innsending til Regnskapsregisteret",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/starte-og-drive/arsregnskap/",
    description: "Send inn godkjent årsregnskap til Brønnøysundregistrene",
    types: ["as"],
  },
  {
    day: 31, months: [4],
    title: "Skattemelding for aksjeselskap – frist for levering",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/skatt/skattemelding-naering/",
    description: "Lever skattemeldingen for aksjeselskap (RF-1028)",
    types: ["as"],
  },
  {
    day: 15, months: [0, 2, 4, 6, 8, 10],
    title: "Arbeidsgiveravgift – frist for betaling",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/arbeidsgiver/arbeidsgiveravgift/",
    description: "Betal arbeidsgiveravgift for forrige termin",
    types: ["arbeidsgiver"],
  },
  {
    day: 15, months: [0, 2, 4, 6, 8, 10],
    title: "Forskuddstrekk – frist for betaling",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/arbeidsgiver/forskuddstrekk/",
    description: "Betal forskuddstrekk for forrige termin",
    types: ["arbeidsgiver"],
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
    types: CompanyType[];
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
        types: tmpl.types,
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
    const filterTypes: string[] = body.types || []; // e.g. ["as","arbeidsgiver"]

    let deadlines = generateDeadlines(12);

    if (filterTypes.length > 0) {
      deadlines = deadlines.filter(d => 
        d.types.some((t: string) => filterTypes.includes(t))
      );
    }

    return new Response(JSON.stringify({
      deadlines: deadlines.slice(0, limit),
      total: deadlines.length,
      availableTypes: ["as", "enk", "arbeidsgiver"],
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
