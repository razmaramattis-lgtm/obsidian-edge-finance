import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

type CompanyType = "as" | "enk" | "arbeidsgiver";
type Category = "mva" | "skatt" | "arbeidsgiver" | "tredjepartsopplysninger" | "saravgift" | "regnskap";

interface DeadlineTemplate {
  day: number;
  months: number[]; // empty = every month
  title: string;
  url: string;
  description?: string;
  types: CompanyType[];
  category: Category;
}

// Comprehensive deadlines from Skatteetaten
// https://www.skatteetaten.no/bedrift-og-organisasjon/starte-og-drive/frister-gebyrer-og-tilleggsskatt/frister-og-oppgaver/
const TEMPLATES: DeadlineTemplate[] = [
  // === ARBEIDSGIVER ===
  {
    day: 5, months: [],
    title: "A-melding – frist for levering",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/arbeidsgiver/a-meldingen/",
    description: "Rapporter lønn, arbeidsgiveravgift og forskuddstrekk for forrige måned",
    types: ["arbeidsgiver"], category: "arbeidsgiver",
  },
  {
    day: 15, months: [0, 2, 4, 6, 8, 10],
    title: "Arbeidsgiveravgift og finansskatt – frist for betaling",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/arbeidsgiver/a-meldingen/frister-og-betaling-i-a-meldingen/",
    description: "Betal arbeidsgiveravgift for forrige termin",
    types: ["arbeidsgiver"], category: "arbeidsgiver",
  },
  {
    day: 15, months: [0, 2, 4, 6, 8, 10],
    title: "Forskuddstrekk – frist for betaling",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/arbeidsgiver/forskuddstrekk/",
    description: "Betal forskuddstrekk for forrige termin",
    types: ["arbeidsgiver"], category: "arbeidsgiver",
  },

  // === MVA ===
  {
    day: 10, months: [1, 3, 5, 7, 9, 11],
    title: "Mva-melding – frist for levering og betaling",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/avgifter/mva/mva-melding/",
    description: "Lever mva-melding og betal skyldig merverdiavgift",
    types: ["as", "enk"], category: "mva",
  },
  {
    day: 10, months: [1, 4, 7, 10],
    title: "Mva-melding for omvendt avgiftsplikt – frist for levering",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/avgifter/mva/mva-melding/",
    description: "Lever mva-melding for omvendt avgiftsplikt",
    types: ["as", "enk"], category: "mva",
  },
  {
    day: 10, months: [2],
    title: "Mva-melding for små virksomheter med årstermin – frist for levering og betaling",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/avgifter/mva/mva-melding/",
    description: "Små virksomheter kan søke om å rapportere mva en gang i året",
    types: ["as", "enk"], category: "mva",
  },
  {
    day: 10, months: [3],
    title: "Mva-melding for primærnæring – frist for levering og betaling",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/avgifter/mva/mva-melding/",
    description: "Lever mva-melding for primærnæring",
    types: ["enk"], category: "mva",
  },
  {
    day: 10, months: [1, 5, 7, 9, 11],
    title: "Merverdiavgift kompensasjonsmelding – frist for levering",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/avgifter/mva/kompensasjonsmelding/",
    description: "Skattemelding for merverdiavgiftskompensasjon",
    types: ["as"], category: "mva",
  },
  {
    day: 20, months: [3, 6, 9, 0],
    title: "Mva-melding for VOEC – frist for levering og betaling",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/avgifter/mva/utland/e-handel-voec/mva-melding/",
    description: "Mva-melding for VOEC-registrerte virksomheter",
    types: ["as"], category: "mva",
  },

  // === SKATT ===
  {
    day: 15, months: [2, 5, 8, 11],
    title: "Forskuddsskatt for enkeltpersonforetak – frist for betaling",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/skatt/forskuddsskatt/forskuddsskatt-for-enkeltpersonforetak/",
    description: "Betal forskuddsskatt for inneværende termin",
    types: ["enk"], category: "skatt",
  },
  {
    day: 15, months: [1, 3, 8, 10],
    title: "Forskuddsskatt for aksjeselskap – frist for betaling",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/skatt/forskuddsskatt/forskuddsskatt-for-aksjeselskap-og-andre/",
    description: "Betal forskuddsskatt for aksjeselskap",
    types: ["as"], category: "skatt",
  },
  {
    day: 31, months: [4],
    title: "Skattemelding for personlig næringsdrivende – frist for levering",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/skatt/skattemelding-naringsdrivende/enk/",
    description: "Lever skattemeldingen for enkeltpersonforetak",
    types: ["enk"], category: "skatt",
  },
  {
    day: 31, months: [4],
    title: "Skattemelding for aksjeselskaper – frist for levering",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/skatt/skattemelding-naringsdrivende/selskap/",
    description: "Lever skattemeldingen for aksjeselskap (RF-1028)",
    types: ["as"], category: "skatt",
  },
  {
    day: 31, months: [4],
    title: "Selskapsmelding for SDF – frist for levering",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/skatt/skattemelding-naringsdrivende/selskap/",
    description: "Selskapsmelding for selskap med deltakerfastsetting",
    types: ["as"], category: "skatt",
  },
  {
    day: 31, months: [4],
    title: "Skatteoppgjøret – frist for å unngå rentetillegg på restskatt",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/skatt/skatteoppgjor/restskatt/",
    description: "Betal restskatt innen fristen for å unngå rentetillegg",
    types: ["as", "enk"], category: "skatt",
  },

  // === REGNSKAP ===
  {
    day: 31, months: [0],
    title: "Aksjonærregisteroppgave – frist for levering",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/skatt/aksjonarregisteroppgaven/",
    description: "Rapporter endringer i aksjekapital, utbytte og aksjonærer",
    types: ["as"], category: "regnskap",
  },
  {
    day: 31, months: [6],
    title: "Årsregnskap – frist for innsending til Regnskapsregisteret",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/starte-og-drive/arsregnskap/",
    description: "Send inn godkjent årsregnskap til Brønnøysundregistrene",
    types: ["as"], category: "regnskap",
  },
  {
    day: 30, months: [3],
    title: "Utsatt leveringsfrist – frist for regnskapsfører/revisor å søke",
    url: "https://www.skatteetaten.no/skjema/utsatt-frist-for-levering-av-skattemeldingen-for-klienter/",
    description: "Regnskapsfører og revisor kan søke om utsatt frist for sine klienter",
    types: ["as", "enk"], category: "regnskap",
  },

  // === SÆRAVGIFT ===
  {
    day: 18, months: [],
    title: "Særavgiftsmelding – leveringsfrist",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/avgifter/saravgifter/rapportere/saravgiftsmelding/",
    description: "Fristen for å rapportere og betale særavgift (18. hver måned eller påfølgende virkedag)",
    types: ["as", "enk"], category: "saravgift",
  },

  // === TREDJEPARTSOPPLYSNINGER ===
  {
    day: 15, months: [1],
    title: "Tredjepartsopplysninger – frist for å sende årsoppgave til skattepliktige",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/rapportering-og-bransjer/tredjepartsopplysninger/",
    description: "Send årsoppgave til den skattepliktige innen fristen",
    types: ["as"], category: "tredjepartsopplysninger",
  },
  {
    day: 10, months: [1],
    title: "Aksjesparekonto – frist for levering av tredjepartsopplysninger",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/rapportering-og-bransjer/tredjepartsopplysninger/bank-finans-og-forsikring/aksjesparekonto/",
    description: "Rapporter tredjepartsopplysninger for aksjesparekonto",
    types: ["as"], category: "tredjepartsopplysninger",
  },
  {
    day: 10, months: [1],
    title: "Finansprodukter – frist for levering av tredjepartsopplysninger",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/rapportering-og-bransjer/tredjepartsopplysninger/bank-finans-og-forsikring/finansprodukter/",
    description: "Rapporter tredjepartsopplysninger for finansprodukter",
    types: ["as"], category: "tredjepartsopplysninger",
  },
  {
    day: 10, months: [1],
    title: "Verdipapirfond – frist for levering av tredjepartsopplysninger",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/rapportering-og-bransjer/tredjepartsopplysninger/bank-finans-og-forsikring/verdipapirfond/",
    description: "Rapporter tredjepartsopplysninger for verdipapirfond",
    types: ["as"], category: "tredjepartsopplysninger",
  },
  {
    day: 9, months: [1],
    title: "Skattepliktig kundeutbytte – frist for levering av tredjepartsopplysninger",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/rapportering-og-bransjer/tredjepartsopplysninger/bank-finans-og-forsikring/skattepliktig-kundeutbytte/",
    description: "Rapporter skattepliktig kundeutbytte",
    types: ["as"], category: "tredjepartsopplysninger",
  },
  {
    day: 10, months: [1],
    title: "Internasjonal rapportering CRS/FATCA – frist for levering",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/rapportering-og-bransjer/tredjepartsopplysninger/bank-finans-og-forsikring/internasjonal-rapportering/",
    description: "Rapporter internasjonal rapportering CRS/FATCA",
    types: ["as"], category: "tredjepartsopplysninger",
  },
  {
    day: 10, months: [1],
    title: "Fondskonto – frist for levering av tredjepartsopplysninger",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/rapportering-og-bransjer/tredjepartsopplysninger/bank-finans-og-forsikring/fondskonto/",
    description: "Rapporter tredjepartsopplysninger for fondskonto",
    types: ["as"], category: "tredjepartsopplysninger",
  },
  {
    day: 15, months: [1],
    title: "Betalinger til selvstendig næringsdrivende – tredjepartsopplysninger",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/rapportering-og-bransjer/tredjepartsopplysninger/andre-bransjer/betalinger-til-s-n/",
    description: "Rapporter betalinger til selvstendig næringsdrivende",
    types: ["as"], category: "tredjepartsopplysninger",
  },
  {
    day: 20, months: [1],
    title: "VPS – frist for rapportering av transaksjonsoppgaver",
    url: "https://www.skatteetaten.no/bedrift-og-organisasjon/rapportering-og-bransjer/tredjepartsopplysninger/bank-finans-og-forsikring/finansielle-instrumenter/",
    description: "VPS rapportering av transaksjonsoppgaver",
    types: ["as"], category: "tredjepartsopplysninger",
  },
];

function generateDeadlines(monthsAhead: number = 12) {
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
    category: Category;
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
        category: tmpl.category,
        ...(tmpl.description ? { description: tmpl.description } : {}),
      });
    }
  }

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
    const filterTypes: string[] = body.types || [];
    const filterCategories: string[] = body.categories || [];
    const allDeadlines = body.all === true;

    let deadlines = generateDeadlines(allDeadlines ? 12 : 6);

    if (filterTypes.length > 0) {
      deadlines = deadlines.filter(d =>
        d.types.some((t: string) => filterTypes.includes(t))
      );
    }

    if (filterCategories.length > 0) {
      deadlines = deadlines.filter(d => filterCategories.includes(d.category));
    }

    return new Response(JSON.stringify({
      deadlines: allDeadlines ? deadlines : deadlines.slice(0, limit),
      total: deadlines.length,
      availableTypes: ["as", "enk", "arbeidsgiver"],
      availableCategories: ["mva", "skatt", "arbeidsgiver", "tredjepartsopplysninger", "saravgift", "regnskap"],
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
