import { readFile, writeFile, mkdir } from "node:fs/promises";
import { renderToString } from "react-dom/server";
import { Site, isLocationPagePath, type SourcePage } from "../src/Site";
import { readdir } from "node:fs/promises";
import { gunzipSync } from "node:zlib";
import { pageInfo } from "../src/content";
import site from "../site.json" with { type: "json" };
import { releaseErrors } from "./release";
import { load } from "cheerio";
import { catalog } from "../src/EquipmentCatalog";
import { serviceCategories, serviceOptions } from "../src/serviceMenu";
import vercel from "../vercel.json" with { type: "json" };
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
  "/about-us/",
  "/blog/",
  "/contact-us/",
  "/privacy/",
  "/equipment-rental/",
];
const redirectDestinations = new Map(
  vercel.redirects.map((rule) => [rule.source, rule.destination]),
);
const redirectedRoutes = new Set(redirectDestinations.keys());
const allRoutes = [
  ...new Set([
    ...coreRoutes,
    ...pages.map((p) => p.path),
    ...catalog.items.map((item) => item.path),
    ...serviceCategories.map((item) => item.href),
    ...serviceOptions.map((item) => item.href),
  ]),
].filter((path) => !redirectedRoutes.has(path));
const editorialNoindex = new Set([
  "/26ft-military-bulk-kitchen/",
  "/4000-correctional-facilities-series/",
  "/government/hospitals/",
  "/modular-kitchen-facilities/",
  "/video/",
]);
const indexableRoutes = allRoutes.filter(
  (path) => !redirectedRoutes.has(path) && !editorialNoindex.has(path),
);
const compact = (value: string, maximum: number) => {
  const clean = value.replace(/\s+/g, " ").trim();
  if (clean.length <= maximum) return clean;
  const shortened = clean.slice(0, maximum + 1).replace(/\s+\S*$/, "");
  return shortened || clean.slice(0, maximum);
};
const sourceDescription = (page: SourcePage) => {
  const inherited = page.description.replace(/\s+/g, " ").trim();
  const unusable =
    inherited.length < 50 ||
    /^(previous|next)(\s+(previous|next))?/i.test(inherited) ||
    /complete list of states and cities|forminator_form|other related services|contact us today/i.test(
      inherited,
    ) ||
    (inherited.length >= 155 && !/[.!?]$/.test(inherited));
  if (!unusable) return inherited;
  const subject = compact(page.title.split("|")[0], 65);
  return `Explore ${subject} from Temporary 123. Call ${site.phoneDisplay} to discuss site requirements, equipment availability and delivery.`;
};
const renderContent = (page: SourcePage) => {
  let html = page.html.replace(
    /<h2>Complete List of States and Cities of United States[\s\S]*/,
    '<p><a href="/service-areas/">Explore our location directory →</a></p>',
  );
  html = html.replace(/<img\b[^>]*src="([^"]+)"[^>]*>/g, (tag, url) =>
    media[url]?.local ? tag.replace(url, media[url].local!) : "",
  );
  html = html.replace(/href="(\/[^"#?]*)([^\"]*)"/g, (match, p, suffix) =>
    catalog.items.some((item) => item.legacyPath === p)
      ? `href="${catalog.items.find((item) => item.legacyPath === p)!.path}${suffix}"`
      : redirectDestinations.has(p)
        ? `href="${redirectDestinations.get(p)}${suffix}"`
        : allRoutes.includes(p)
          ? match
          : `href="https://temporary123.com${p}${suffix}"`,
  );
  return (
    html ||
    `<p>Explore Temporary 123 equipment and project services, or call ${site.phoneDisplay} to speak with our team.</p>`
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
  const catalogItem = catalog.items.find((item) => item.path === path);
  const serviceOption = serviceOptions.find((item) => item.href === path);
  const serviceCategory = serviceCategories.find((item) => item.href === path);
  const info = coreRoutes.includes(path)
    ? pageInfo(path)
    : page
      ? {
          title: page.title + " | Temporary 123",
          description: sourceDescription(page),
        }
      : path === "/contact-us/"
        ? {
            title: "Contact Temporary 123 | Talk to a Specialist",
            description: `Call Temporary 123 at ${site.phoneDisplay} for mobile kitchens, temporary facilities and project support.`,
          }
        : path === "/equipment-rental/"
          ? {
              title: "Equipment Rental | Temporary 123",
              description:
                "Explore Temporary 123 mobile kitchens, restroom and shower trailers, workforce and site facilities.",
            }
          : catalogItem
            ? {
                title: `${catalogItem.name} | Temporary 123`,
                description: catalogItem.summary,
              }
            : serviceOption
              ? {
                  title: `${serviceOption.name} Rental | Temporary 123`,
                  description: serviceOption.description,
                }
              : serviceCategory
                ? {
                    title: `${serviceCategory.name} Rental | Temporary 123`,
                    description: serviceCategory.description,
                  }
                : pageInfo(path);
  const canonical =
    release && path !== "/404/" && indexableRoutes.includes(path)
      ? `${site.origin.replace(/\/$/, "")}${path}`
      : "";
  if (!info.description.trim()) {
    info.description = `Explore ${page?.title || "Temporary 123 facilities"}. Call Temporary 123 at ${site.phoneDisplay} to discuss your site, rental dates and equipment requirements.`;
  }
  const schema = canonical
    ? path === "/"
      ? {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": `${site.origin}#organization`,
              name: site.brand,
              url: site.origin,
              telephone: site.phoneE164,
              logo: `${site.origin.replace(/\/$/, "")}/images/logo.webp`,
            },
            {
              "@type": "WebSite",
              "@id": `${site.origin}#website`,
              name: site.brand,
              url: site.origin,
              publisher: { "@id": `${site.origin}#organization` },
            },
          ],
        }
      : {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: site.origin,
            },
            ...(catalogItem || serviceOption || serviceCategory
              ? [
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: "Services",
                    item: `${site.origin.replace(/\/$/, "")}/equipment-rental/`,
                  },
                ]
              : []),
            {
              "@type": "ListItem",
              position: catalogItem || serviceOption || serviceCategory ? 3 : 2,
              name:
                page?.title ||
                catalogItem?.name ||
                serviceOption?.name ||
                serviceCategory?.name ||
                info.title,
              item: canonical,
            },
          ],
        }
    : null;
  const structured = schema
    ? `<script type="application/ld+json">${JSON.stringify(schema).replace(/</g, "\\u003c")}</script>`
    : "";
  const head =
    structured +
    `<meta name="description" content="${esc(info.description)}"><meta property="og:title" content="${esc(info.title)}"><meta property="og:description" content="${esc(info.description)}"><meta property="og:type" content="website">` +
    `<meta property="og:site_name" content="${esc(site.brand)}"><meta property="og:locale" content="en_US"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(info.title)}"><meta name="twitter:description" content="${esc(info.description)}">` +
    (canonical
      ? `<link rel="canonical" href="${esc(canonical)}"><meta property="og:url" content="${esc(canonical)}"><meta property="og:image" content="${esc(site.origin.replace(/\/$/, "") + "/social-card.png")}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="${esc(site.brand)} temporary facility planning">`
      : "");
  const rawHtml = source
    .replace(/<title>.*?<\/title>/, `<title>${esc(info.title)}</title>`)
    .replace(
      /<meta name="robots" content="[^"]*"\s*\/?\s*>/,
      `<meta name="robots" content="${canonical ? "index,follow" : path === "/404/" ? "noindex,nofollow" : "noindex,follow"}"/>`,
    )
    .replace("<!--page-head-->", head)
    .replace(
      "<!--app-html-->",
      renderToString(
        <Site
          path={path}
          page={page ? { ...page, html: renderContent(page) } : undefined}
          catalog={pages
            .filter(
              (p) =>
                !redirectedRoutes.has(p.path) && isLocationPagePath(p.path),
            )
            .map((p) => ({ path: p.path, title: p.title }))}
          serviceCatalog={pages
            .filter(
              (p) =>
                !redirectedRoutes.has(p.path) &&
                !isLocationPagePath(p.path) &&
                !coreRoutes.includes(p.path) &&
                !catalog.items.some((item) => item.path === p.path),
            )
            .map((p) => ({ path: p.path, title: p.title }))}
        />,
      ),
    );
  // Editorial punctuation preference applies to rendered copy, never URLs,
  // script contents or the archived source records.
  const $ = load(rawHtml);
  const cleanCopy = (value: string) =>
    value
      .replace(/\s*—\s*/g, ", ")
      .replace(/\*/g, "")
      .replace(
        /(?:\+?1[\s.-]*)?\(?800\)?[\s.-]*443[\s.-]*5212/g,
        site.phoneDisplay,
      );
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
    : "User-agent: *\nAllow: /\nDisallow: /api/\n# Revision HTML carries noindex while the primary domain remains elsewhere.\n",
);
await writeFile(
  "dist/sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${release ? indexableRoutes.map((p) => `<url><loc>${esc(site.origin.replace(/\/$/, "") + p)}</loc></url>`).join("") : ""}</urlset>`,
);
console.log(
  `Static HTML generated for ${allRoutes.length} pages + 404 (${release ? "production" : "draft/noindex"}).`,
);
