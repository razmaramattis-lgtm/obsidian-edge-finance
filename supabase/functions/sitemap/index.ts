import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const DOMAIN = "https://avargo.no";

const staticPages = [
  { loc: "/", priority: "1.0", changefreq: "weekly" },
  { loc: "/tjenester", priority: "0.9", changefreq: "monthly" },
  { loc: "/tjenester/regnskapsforer", priority: "0.8", changefreq: "monthly" },
  { loc: "/tjenester/ai-innsikt", priority: "0.7", changefreq: "monthly" },
  { loc: "/tjenester/cfo", priority: "0.7", changefreq: "monthly" },
  { loc: "/tjenester/hr-og-lonn", priority: "0.7", changefreq: "monthly" },
  { loc: "/tjenester/nettsider", priority: "0.7", changefreq: "monthly" },
  { loc: "/tjenester/seo", priority: "0.7", changefreq: "monthly" },
  { loc: "/tjenester/meta-annonser", priority: "0.7", changefreq: "monthly" },
  { loc: "/tjenester/google-ads", priority: "0.7", changefreq: "monthly" },
  { loc: "/tjenester/nettbutikk", priority: "0.7", changefreq: "monthly" },
  { loc: "/tjenester/ai-automatisering", priority: "0.7", changefreq: "monthly" },
  { loc: "/tjenester/kurs", priority: "0.7", changefreq: "monthly" },
  { loc: "/tjenester/1-1-regnskap", priority: "0.7", changefreq: "monthly" },
  { loc: "/bransjer", priority: "0.9", changefreq: "monthly" },
  { loc: "/bransjer/tech-saas", priority: "0.7", changefreq: "monthly" },
  { loc: "/bransjer/eiendom", priority: "0.7", changefreq: "monthly" },
  { loc: "/bransjer/holding", priority: "0.7", changefreq: "monthly" },
  { loc: "/bransjer/consulting", priority: "0.7", changefreq: "monthly" },
  { loc: "/bransjer/landbruk", priority: "0.7", changefreq: "monthly" },
  { loc: "/bransjer/varehandel", priority: "0.7", changefreq: "monthly" },
  { loc: "/bransjer/bygg-anlegg", priority: "0.7", changefreq: "monthly" },
  { loc: "/bransjer/nettbutikk", priority: "0.7", changefreq: "monthly" },
  { loc: "/bransjer/helse", priority: "0.7", changefreq: "monthly" },
  { loc: "/bransjer/restaurant", priority: "0.7", changefreq: "monthly" },
  { loc: "/bransjer/frisor", priority: "0.7", changefreq: "monthly" },
  { loc: "/bransjer/handverkere", priority: "0.7", changefreq: "monthly" },
  { loc: "/bransjer/transport", priority: "0.7", changefreq: "monthly" },
  { loc: "/bransjer/industri", priority: "0.7", changefreq: "monthly" },
  { loc: "/bransjer/renhold", priority: "0.7", changefreq: "monthly" },
  { loc: "/bransjer/kultur", priority: "0.7", changefreq: "monthly" },
  { loc: "/bransjer/sport", priority: "0.7", changefreq: "monthly" },
  { loc: "/bransjer/utdanning", priority: "0.7", changefreq: "monthly" },
  { loc: "/bransjer/juridisk", priority: "0.7", changefreq: "monthly" },
  { loc: "/bransjer/arkitektur", priority: "0.7", changefreq: "monthly" },
  { loc: "/bransjer/markedsforing", priority: "0.7", changefreq: "monthly" },
  { loc: "/bransjer/bemanning", priority: "0.7", changefreq: "monthly" },
  { loc: "/bransjer/reiseliv", priority: "0.7", changefreq: "monthly" },
  { loc: "/bransjer/bil", priority: "0.7", changefreq: "monthly" },
  { loc: "/bransjer/energi", priority: "0.7", changefreq: "monthly" },
  { loc: "/metoden", priority: "0.8", changefreq: "monthly" },
  { loc: "/priser", priority: "0.9", changefreq: "monthly" },
  { loc: "/ressurser", priority: "0.8", changefreq: "weekly" },
  { loc: "/ressurser/skattekalender", priority: "0.8", changefreq: "weekly" },
  { loc: "/ressurser/kontohjelp", priority: "0.7", changefreq: "monthly" },
  { loc: "/ressurser/regnskapsord", priority: "0.7", changefreq: "monthly" },
  { loc: "/nyheter", priority: "0.8", changefreq: "weekly" },
  { loc: "/om-oss", priority: "0.7", changefreq: "monthly" },
  { loc: "/kontakt", priority: "0.8", changefreq: "monthly" },
  { loc: "/faq", priority: "0.8", changefreq: "monthly" },
  { loc: "/tjenester/lonn", priority: "0.7", changefreq: "monthly" },
  { loc: "/tjenester/arsregnskap", priority: "0.7", changefreq: "monthly" },
  { loc: "/tjenester/fakturering", priority: "0.7", changefreq: "monthly" },
  { loc: "/tjenester/skatteplanlegging", priority: "0.7", changefreq: "monthly" },
  { loc: "/tjenester/hr-og-lonn", priority: "0.7", changefreq: "monthly" },
  { loc: "/tjenester/ansettelse", priority: "0.7", changefreq: "monthly" },
  { loc: "/tjenester/personalhandbok", priority: "0.7", changefreq: "monthly" },
  { loc: "/tjenester/arbeidsrett", priority: "0.7", changefreq: "monthly" },
  { loc: "/tjenester/chatbot", priority: "0.7", changefreq: "monthly" },
  { loc: "/tjenester/internsystemer", priority: "0.7", changefreq: "monthly" },
  { loc: "/tjenester/dashboard", priority: "0.7", changefreq: "monthly" },
  { loc: "/tjenester/hr-kurs", priority: "0.7", changefreq: "monthly" },
  { loc: "/tjenester/bedriftskurs", priority: "0.7", changefreq: "monthly" },
];

serve(async () => {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Fetch published blog posts
    const { data: posts } = await supabase
      .from("blog_posts")
      .select("slug, updated_at")
      .eq("published", true)
      .order("created_at", { ascending: false });

    // Fetch active courses
    const { data: courses } = await supabase
      .from("courses")
      .select("slug, updated_at")
      .eq("active", true);

    const today = new Date().toISOString().split("T")[0];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // Static pages
    for (const page of staticPages) {
      xml += `
  <url>
    <loc>${DOMAIN}${page.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
    }

    // Blog posts
    if (posts) {
      for (const post of posts) {
        if (!post.slug) continue;
        const lastmod = post.updated_at ? post.updated_at.split("T")[0] : today;
        xml += `
  <url>
    <loc>${DOMAIN}/nyhet/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
      }
    }

    // Courses
    if (courses) {
      for (const course of courses) {
        if (!course.slug) continue;
        const lastmod = course.updated_at ? course.updated_at.split("T")[0] : today;
        xml += `
  <url>
    <loc>${DOMAIN}/tjenester/kurs/${course.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
      }
    }

    xml += `
</urlset>`;

    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Sitemap error:", error);
    return new Response("Error generating sitemap", { status: 500 });
  }
});
