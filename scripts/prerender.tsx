import { readFile, writeFile, mkdir } from "node:fs/promises";
import { renderToString } from "react-dom/server";
import { Site, type SourcePage } from "../src/Site";
import { readdir } from "node:fs/promises";
import { gunzipSync } from "node:zlib";
import { routes, pageInfo } from "../src/content";
import site from "../site.json" with { type: "json" };
import { releaseErrors } from "./release";
import { load } from "cheerio";
// Vercel preview builds must never inherit production indexing settings.
const release =
  site.mode === "production" &&
  (!process.env.VERCEL_ENV || process.env.VERCEL_ENV === "production");
if (release) {
  const errors = releaseErrors();
  if (errors.length) throw new Error(errors.join("; "));
}
const source = await readFile("dist/index.html", "utf8");
const pages: SourcePage[] = [];
const index = JSON.parse(
  await readFile("content/route-index.json", "utf8"),
) as { path: string; file: string; title: string }[];
let media: Record<string, { local?: string }> = {};
try {
  media = JSON.parse(await readFile("content/media-map.json", "utf8"));
} catch {}
for (const entry of index) {
  const page = JSON.parse(
    gunzipSync(await readFile("content/pages/" + entry.file)).toString(),
  ) as SourcePage;
  page.path = entry.path;
  pages.push(page);
}
const coreRoutes = [
  "/",
  "/services/",
  "/industries/",
  "/service-areas/",
  "/planning/",
  "/contact-us/",
  "/privacy/",
  "/equipment-rental/",
];
const allRoutes = [...new Set([...coreRoutes, ...pages.map((p) => p.path)])];
const renderContent = (page: SourcePage) => {
  let html = page.html.replace(
    /<h2>Complete List of States and Cities of United States[\s\S]*/,
    '<p><a href="/service-areas/">Explore our location directory →</a></p>',
  );
  html = html.replace(/<img\b[^>]*src="([^"]+)"[^>]*>/g, (tag, url) =>
    media[url]?.local ? tag.replace(url, media[url].local!) : "",
  );
  html = html.replace(/href="(\/[^"#?]*)([^\"]*)"/g, (match, p, suffix) =>
    allRoutes.includes(p)
      ? match
      : `href="https://temporary123.com${p}${suffix}"`,
  );
  return (
    html ||
    "<p>Explore Temporary 123 equipment and project services, or call (800) 443-5212 to speak with our team.</p>"
  );
};
const esc = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
for (const path of [...allRoutes, "/404/"]) {
  const page = pages.find((p) => p.path === path);
  const info = coreRoutes.includes(path)
    ? pageInfo(path)
    : page
      ? {
          title: page.title + " | Temporary 123",
          description: page.description,
        }
      : path === "/contact-us/"
        ? {
            title: "Contact Temporary 123 | Talk to a Specialist",
            description:
              "Call Temporary 123 at (800) 443-5212 for mobile kitchens, temporary facilities and project support.",
          }
        : path === "/equipment-rental/"
          ? {
              title: "Equipment Rental | Temporary 123",
              description:
                "Explore Temporary 123 mobile kitchens, restroom and shower trailers, workforce and site facilities.",
            }
          : pageInfo(path);
  const canonical =
    release && path !== "/404/"
      ? `${site.origin.replace(/\/$/, "")}${path}`
      : "";
  if (!info.description.trim()) {
    info.description = `Explore ${page?.title || "Temporary 123 facilities"}. Call Temporary 123 at 800-443-5212 to discuss your site, rental dates and equipment requirements.`;
  }
  const structured = canonical
    ? `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": "Organization", name: site.brand, url: site.origin, telephone: site.phoneE164 }).replace(/</g, "\\u003c")}</script>`
    : "";
  const head =
    structured +
    `<meta name="description" content="${esc(info.description)}"><meta property="og:title" content="${esc(info.title)}"><meta property="og:description" content="${esc(info.description)}"><meta property="og:type" content="website">` +
    `<meta property="og:site_name" content="${esc(site.brand)}"><meta name="twitter:card" content="summary_large_image">` +
    (canonical
      ? `<link rel="canonical" href="${esc(canonical)}"><meta property="og:url" content="${esc(canonical)}"><meta property="og:image" content="${esc(site.origin.replace(/\/$/, "") + "/social-card.png")}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="${esc(site.brand)} temporary facility planning">`
      : "");
  const rawHtml = source
    .replace(/<title>.*?<\/title>/, `<title>${esc(info.title)}</title>`)
    .replace(
      /<meta name="robots" content="[^"]*"\s*\/?\s*>/,
      `<meta name="robots" content="${canonical ? "index,follow" : "noindex,nofollow"}"/>`,
    )
    .replace("<!--page-head-->", head)
    .replace(
      "<!--app-html-->",
      renderToString(
        <Site
          path={path}
          page={page ? { ...page, html: renderContent(page) } : undefined}
          catalog={pages.map((p) => ({ path: p.path, title: p.title }))}
        />,
      ),
    );
  // Editorial punctuation preference applies to rendered copy, never URLs,
  // script contents or the archived source records.
  const $ = load(rawHtml);
  const cleanCopy = (value: string) =>
    value.replace(/\s*—\s*/g, ", ").replace(/\*/g, "");
  $("body, title")
    .find("*")
    .addBack()
    .contents()
    .each((_, node) => {
      if (
        node.type === "text" &&
        node.parent?.type !== "script" &&
        node.parent?.type !== "style"
      )
        node.data = cleanCopy(node.data);
    });
  $("[alt], [title], [aria-label]").each((_, element) => {
    for (const name of ["alt", "title", "aria-label"]) {
      const value = $(element).attr(name);
      if (value) $(element).attr(name, cleanCopy(value));
    }
  });
  $(
    "meta[name='description'], meta[property='og:title'], meta[property='og:description']",
  ).each((_, element) => {
    $(element).attr("content", cleanCopy($(element).attr("content") || ""));
  });
  const html = $.html();
  const file = path === "/404/" ? "dist/404.html" : `dist${path}index.html`;
  await mkdir(file.substring(0, file.lastIndexOf("/")), { recursive: true });
  await writeFile(file, html);
}
await writeFile(
  "dist/robots.txt",
  release
    ? `User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${site.origin.replace(/\/$/, "")}/sitemap.xml\n`
    : "User-agent: *\nAllow: /\n# Draft HTML carries noindex. Protect private previews at the host.\n",
);
await writeFile(
  "dist/sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${release ? routes.map((p) => `<url><loc>${esc(site.origin.replace(/\/$/, "") + p)}</loc></url>`).join("") : ""}</urlset>`,
);
console.log(
  `Static HTML generated for ${allRoutes.length} pages + 404 (${release ? "production" : "draft/noindex"}).`,
);
