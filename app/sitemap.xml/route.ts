export async function GET() {
    const baseUrl = "https://app.losguayacos.com";

    const pages = [
        {
            url: "/",
            changefreq: "weekly",
            priority: 1.0,
        },
        {
            url: "/menu",
            changefreq: "daily",
            priority: 0.9,
        },
        {
            url: "/new_order",
            changefreq: "weekly",
            priority: 0.9,
        },
        {
            url: "/orders",
            changefreq: "weekly",
            priority: 0.8,
        },
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages
      .map(
          (page) => `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
  `
      )
      .join("")}
</urlset>`;

    return new Response(sitemap, {
        headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
    });
}
