import { readFile, writeFile, mkdir } from "node:fs/promises";
import { renderToString } from "react-dom/server";
import { Site, isLocationPagePath, type SourcePage } from "../src/Site";
import { readdir } from "node:fs/promises";
import { gunzipSync } from "node:zlib";
import { pageInfo } from "../src/content";
import site from "../site.json" with { type: "json" };
import { releaseErrors } from "./release";
import {
  canonicalFor,
  productionBuild,
  routeInIndexingScope,
  sitemapXml,
  type IndexingScope,
} from "./seo-policy";
import { renderSourceContent } from "./source-content";
import { preserveMedia } from "./preserve-media";
import { load } from "cheerio";
import { catalog } from "../src/EquipmentCatalog";
import modelDetails from "../content/service-details.json" with { type: "json" };
import { serviceCategories, serviceOptions } from "../src/serviceMenu";
import { regionPages, regionPageByPath } from "../src/regionGuides";
import { stateGuides } from "../src/stateGuides";
import vercel from "../vercel.json" with { type: "json" };
// Vercel preview builds must never inherit production indexing settings.
const release = productionBuild(site.mode, process.env.VERCEL_ENV);
const indexingScope = site.indexingScope as IndexingScope;
if (release && indexingScope === "full") {
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
  if (page.path === "/gsa-schedule/") page.title = "GSA Schedule";
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
    ...regionPages.map((item) => item.path),
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
  (path) =>
    !redirectedRoutes.has(path) &&
    !editorialNoindex.has(path) &&
    routeInIndexingScope(path, indexingScope),
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
const unresolvedSourceLinks = new Set<string>();
const dimensions: Record<string, { width: number; height: number }> = {};
for (const entry of Object.values(media)) {
  if (!entry.local?.endsWith(".png")) continue;
  try {
    const bytes = await readFile("public" + entry.local);
    if (
      bytes
        .subarray(0, 8)
        .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
    )
      dimensions[entry.local] = {
        width: bytes.readUInt32BE(16),
        height: bytes.readUInt32BE(20),
      };
  } catch {}
}
const renderContent = (page: SourcePage) =>
  renderSourceContent(page.html, {
    origin: site.origin,
    routes: new Set(allRoutes),
    redirects: redirectDestinations,
    media,
    unresolved: unresolvedSourceLinks,
    dimensions,
  });
const esc = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
const organizationSchema = {
  "@type": "Organization",
  "@id": `${site.origin}#organization`,
  name: site.brand,
  url: site.origin,
  telephone: site.phoneE164,
  logo: `${site.origin.replace(/\/$/, "")}/images/logo.webp`,
  areaServed: Object.keys(stateGuides).map((name) => ({
    "@type": "AdministrativeArea",
    name: `${name}, USA`,
  })),
  knowsAbout: [
    "Mobile commercial kitchen rentals",
    "Shower and restroom combination trailers",
    "Sleeper and bunkbed trailer rentals",
    "Temporary facilities",
  ],
};
for (const path of [...allRoutes, "/404/"]) {
  const page = pages.find((p) => p.path === path);
  const catalogItem = catalog.items.find((item) => item.path === path);
  const serviceOption = serviceOptions.find((item) => item.href === path);
  const serviceCategory = serviceCategories.find((item) => item.href === path);
  const detail = modelDetails[path as keyof typeof modelDetails];
  const region = regionPageByPath[path];
  const info = detail
    ? {
        title: detail.name + " Rental | Temporary 123",
        description: detail.intro.split(". ")[0] + ".",
      }
    : region
      ? {
          title: `Temporary Facilities in ${region.region}, ${region.state} | Temporary 123`,
          description: region.intro,
        }
      : coreRoutes.includes(path)
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
    canonicalFor(path, indexableRoutes.includes(path), release) || "";
  if (!info.description.trim()) {
    info.description = `Explore ${page?.title || "Temporary 123 facilities"}. Call Temporary 123 at ${site.phoneDisplay} to discuss your site, rental dates and equipment requirements.`;
  }
  const schema = canonical
    ? path === "/"
      ? {
          "@context": "https://schema.org",
          "@graph": [
            organizationSchema,
            {
              "@type": "WebSite",
              "@id": `${site.origin}#website`,
              name: site.brand,
              url: site.origin,
              publisher: { "@id": `${site.origin}#organization` },
            },
          ],
        }
      : region
        ? {
            "@context": "https://schema.org",
            "@graph": [
              organizationSchema,
              {
                "@type": "WebPage",
                name: info.title,
                url: canonical,
                description: info.description,
                about: {
                  "@type": "Place",
                  name: `${region.region}, ${region.state}, USA`,
                },
              },
              {
                "@type": "Service",
                name: `Temporary facility rentals in ${region.region}, ${region.state}`,
                serviceType: "Temporary facility rental",
                areaServed: {
                  "@type": "AdministrativeArea",
                  name: `${region.region}, ${region.state}`,
                },
                provider: {
                  "@type": "Organization",
                  name: site.brand,
                  telephone: site.phoneE164,
                },
                description: `Rent or lease temporary facilities in ${region.region}, ${region.state}, including mobile kitchens, shower and restroom combinations, and sleeper or bunkbed trailers.`,
              },
              {
                "@type": "FAQPage",
                mainEntity: [
                  {
                    "@type": "Question",
                    name: `What temporary facilities can I rent in ${region.region}?`,
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: `Temporary 123 can discuss rental or lease options for mobile commercial kitchens, shower and restroom combination trailers, sleeper or bunkbed trailers, and supporting temporary facilities in ${region.region}, ${region.state}.`,
                    },
                  },
                ],
              },
            ],
          }
        : {
            "@context": "https://schema.org",
            "@graph": [
              organizationSchema,
              {
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
                    position:
                      catalogItem || serviceOption || serviceCategory ? 3 : 2,
                    name:
                      page?.title ||
                      catalogItem?.name ||
                      serviceOption?.name ||
                      serviceCategory?.name ||
                      info.title,
                    item: canonical,
                  },
                ],
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
  if (
    schema &&
    path !== "/" &&
    !region &&
    !(schema as { "@graph"?: unknown })["@graph"]
  ) {
    const crumbs = $("nav.breadcrumb a[href]")
      .toArray()
      .map((el) => ({
        name: $(el).text().trim(),
        item: new URL($(el).attr("href")!, site.origin).href,
      }))
      .filter((crumb) => crumb.item !== canonical);
    if (crumbs.length) {
      const breadcrumb = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          ...crumbs,
          { name: $("h1").first().text().trim(), item: canonical },
        ].map((crumb, i) => ({
          "@type": "ListItem",
          position: i + 1,
          ...crumb,
        })),
      };
      $("script[type='application/ld+json']").text(
        JSON.stringify(breadcrumb).replace(/</g, "\\u003c"),
      );
    }
  }
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
const restoredAssets = await preserveMedia(media);
const registry = allRoutes.map((path) => ({
  path,
  indexable: indexableRoutes.includes(path),
  modified:
    coreRoutes.includes(path) || modelDetails[path as keyof typeof modelDetails]
      ? undefined
      : pages.find((page) => page.path === path)?.modified,
}));
await writeFile("dist/sitemap.xml", sitemapXml(registry, release));
await writeFile(
  "audit/build-registry.json",
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      mode: release ? "production" : "preview",
      indexingScope,
      pages: registry,
      unresolvedSourceLinks: [...unresolvedSourceLinks].sort(),
      restoredAssets,
    },
    null,
    2,
  ) + "\n",
);
console.log(
  `Static HTML generated for ${allRoutes.length} pages + 404 (${release ? "production" : "draft/noindex"}).`,
);
