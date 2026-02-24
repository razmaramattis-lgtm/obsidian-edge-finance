import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const DOMAIN = "https://avargo.no";

const sections = ["regnskap", "hr", "markedsforing", "it"];
const tjenesteSlugs = [
  "regnskapsforer","ai-innsikt","cfo","hr-og-lonn","nettsider","seo","meta-annonser",
  "google-ads","nettbutikk","ai-automatisering","kurs","1-1-regnskap","lonn",
  "arsregnskap","fakturering","skatteplanlegging","dashboard","ansettelse",
  "personalhandbok","arbeidsrett","chatbot","internsystemer","hr-kurs","bedriftskurs",
];
const bransjeSlugs = [
  "tech-saas","eiendom","holding","consulting","landbruk","varehandel","bygg-anlegg",
  "nettbutikk","helse","restaurant","frisor","handverkere","transport","industri",
  "renhold","kultur","sport","utdanning","juridisk","arkitektur","markedsforing",
  "bemanning","reiseliv","bil","energi",
];

const staticPages = [
  { loc: "/", priority: "1.0", changefreq: "weekly" },
  { loc: "/tjenester", priority: "0.9", changefreq: "monthly" },
  { loc: "/bransjer", priority: "0.9", changefreq: "monthly" },
  { loc: "/priser", priority: "0.9", changefreq: "monthly" },
  { loc: "/metoden", priority: "0.8", changefreq: "monthly" },
  { loc: "/om-oss", priority: "0.7", changefreq: "monthly" },
  { loc: "/kontakt", priority: "0.8", changefreq: "monthly" },
  { loc: "/faq", priority: "0.8", changefreq: "monthly" },
  { loc: "/nyheter", priority: "0.8", changefreq: "weekly" },
  { loc: "/ressurser", priority: "0.8", changefreq: "weekly" },
  { loc: "/ressurser/skattekalender", priority: "0.8", changefreq: "weekly" },
  { loc: "/ressurser/kontohjelp", priority: "0.7", changefreq: "monthly" },
  { loc: "/ressurser/regnskapsord", priority: "0.7", changefreq: "monthly" },
  { loc: "/personvern", priority: "0.3", changefreq: "yearly" },
  { loc: "/vilkar", priority: "0.3", changefreq: "yearly" },
  // Legacy tjenester
  ...tjenesteSlugs.map(s => ({ loc: `/tjenester/${s}`, priority: "0.7", changefreq: "monthly" })),
  // Legacy bransjer
  ...bransjeSlugs.map(s => ({ loc: `/bransjer/${s}`, priority: "0.7", changefreq: "monthly" })),
  // Section pages
  ...sections.flatMap(sec => [
    { loc: `/${sec}`, priority: "0.9", changefreq: "weekly" },
    { loc: `/${sec}/tjenester`, priority: "0.8", changefreq: "monthly" },
    { loc: `/${sec}/bransjer`, priority: "0.8", changefreq: "monthly" },
    { loc: `/${sec}/priser`, priority: "0.8", changefreq: "monthly" },
    { loc: `/${sec}/kontakt`, priority: "0.7", changefreq: "monthly" },
    { loc: `/${sec}/om-oss`, priority: "0.6", changefreq: "monthly" },
    { loc: `/${sec}/metoden`, priority: "0.7", changefreq: "monthly" },
    { loc: `/${sec}/faq`, priority: "0.7", changefreq: "monthly" },
    { loc: `/${sec}/nyheter`, priority: "0.7", changefreq: "weekly" },
    { loc: `/${sec}/ressurser`, priority: "0.7", changefreq: "weekly" },
    { loc: `/${sec}/ressurser/skattekalender`, priority: "0.7", changefreq: "weekly" },
    { loc: `/${sec}/ressurser/kontohjelp`, priority: "0.6", changefreq: "monthly" },
    { loc: `/${sec}/regnskapsord`, priority: "0.6", changefreq: "monthly" },
    ...tjenesteSlugs.map(t => ({ loc: `/${sec}/tjenester/${t}`, priority: "0.6", changefreq: "monthly" })),
  ]),
  // Regnskap bransje sub-pages
  ...bransjeSlugs.map(s => ({ loc: `/regnskap/bransjer/${s}`, priority: "0.6", changefreq: "monthly" })),
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
