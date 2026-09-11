import { readFile, writeFile, mkdir } from "node:fs/promises";
import { renderToString } from "react-dom/server";
import { App } from "../src/App";
import { routes, pageInfo } from "../src/content";
import site from "../site.json";
import { releaseErrors } from "./release";
// Vercel preview builds must never inherit production indexing settings.
const release =
  site.mode === "production" &&
  (!process.env.VERCEL_ENV || process.env.VERCEL_ENV === "production");
if (release) {
  const errors = releaseErrors();
  if (errors.length) throw new Error(errors.join("; "));
}
const source = await readFile("dist/index.html", "utf8");
const esc = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
for (const path of [...routes, "/404/"]) {
  const info = pageInfo(path);
  const canonical =
    release && path !== "/404/"
      ? `${site.origin.replace(/\/$/, "")}${path}`
      : "";
  const structured = canonical
    ? `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": "Organization", name: site.brand, url: site.origin, telephone: site.phoneE164 }).replace(/</g, "\\u003c")}</script>`
    : "";
  const head =
    structured +
    `<meta name="description" content="${esc(info.description)}"><meta property="og:title" content="${esc(info.title)}"><meta property="og:description" content="${esc(info.description)}"><meta property="og:type" content="website">` +
    `<meta property="og:site_name" content="${esc(site.brand)}"><meta name="twitter:card" content="summary_large_image">` +
    (canonical
      ? `<link rel="canonical" href="${esc(canonical)}"><meta property="og:url" content="${esc(canonical)}"><meta property="og:image" content="${esc(site.origin.replace(/\/$/, '') + '/social-card.png')}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="${esc(site.brand)} temporary facility planning">`
      : "");
  const html = source
    .replace(/<title>.*?<\/title>/, `<title>${esc(info.title)}</title>`)
    .replace(
      /<meta name="robots" content="[^"]*"\s*\/?\s*>/,
      `<meta name="robots" content="${canonical ? "index,follow" : "noindex,nofollow"}"/>`,
    )
    .replace("<!--page-head-->", head)
    .replace("<!--app-html-->", renderToString(<App path={path} />));
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
  `Static HTML generated for ${routes.length} pages + 404 (${release ? "production" : "draft/noindex"}).`,
);
