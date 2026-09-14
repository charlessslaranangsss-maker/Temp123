import { industryGuideByPath } from "../src/IndustryDetail";
import { statePageByPath } from "../src/StateDetail";
import { pageSchema } from "./structured-data";
import imageDimensions from "../content/image-dimensions.json";
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
  routesForIndexingBatch,
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
import { cityPageByPath, reviewedCityPages } from "../src/cityDirectory";
import { cityHeadline } from "../src/CityDetail";
import { cityEditorial } from "../src/cityEditorial";
import { stateGuides } from "../src/stateGuides";
import vercel from "../vercel.json" with { type: "json" };
// Vercel preview builds must never inherit production indexing settings.
const domainReady =
  site.domainRoutingReady || process.env.PUBLIC_DOMAIN_READY === "true";
const release =
  productionBuild(site.mode, process.env.VERCEL_ENV) && domainReady;
const indexingScope = site.indexingScope as IndexingScope;
if (release && indexingScope === "full") {
  const errors = releaseErrors();
  if (errors.length) throw new Error(errors.join("; "));
}
const source = await readFile("dist/index.html", "utf8");
const fontAsset = (await readdir("dist/assets")).find((name) =>
  /^manrope-latin-wght-normal-.*\.woff2$/.test(name),
);
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
    ...regionPages.map((item) => `${item.path}cities/`),
    ...reviewedCityPages.map((item) => item.path),
    ...Object.keys(statePageByPath),
  ]),
].filter((path) => !redirectedRoutes.has(path));
const editorialNoindex = new Set([
  "/26ft-military-bulk-kitchen/",
  "/4000-correctional-facilities-series/",
  "/government/hospitals/",
  "/modular-kitchen-facilities/",
  "/video/",
  ...regionPages.map((item) => `${item.path}cities/`),
]);
// Publish parents before their regions and include the priority service destinations.
const orderedIndexingRoutes = [
  ...new Set([
    "/",
    "/service-areas/",
    ...allRoutes.filter(
      (path) =>
        !path.startsWith("/service-areas/") &&
        routeInIndexingScope(path, indexingScope),
    ),
    ...Object.entries(stateGuides).flatMap(([name]) => [
      Object.entries(statePageByPath).find(([, state]) => state === name)![0],
      ...regionPages
        .filter((region) => region.state === name)
        .flatMap((region) => [
          region.path,
          ...reviewedCityPages
            .filter((city) => city.regionPath === region.path)
            .map((city) => city.path),
        ]),
    ]),
    ...allRoutes,
  ]),
];
const scopedIndexingRoutes = orderedIndexingRoutes.filter(
  (path) =>
    allRoutes.includes(path) &&
    !editorialNoindex.has(path) &&
    routeInIndexingScope(path, indexingScope),
);
const indexableRoutes = routesForIndexingBatch(
  scopedIndexingRoutes,
  site.activeIndexingBatch,
  site.indexingBatchSize,
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
  return `Explore ${subject} from Temporary123. Call ${site.phoneDisplay} to discuss site requirements, equipment availability and delivery.`;
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
for (const path of [...allRoutes, "/404/"]) {
  const page = pages.find((p) => p.path === path);
  const catalogItem = catalog.items.find((item) => item.path === path);
  const serviceOption = serviceOptions.find((item) => item.href === path);
  const serviceCategory = serviceCategories.find((item) => item.href === path);
  const detail = modelDetails[path as keyof typeof modelDetails];
  const region = regionPageByPath[path];
  const city = cityPageByPath[path];
  const directoryRegion = path.endsWith("/cities/")
    ? regionPageByPath[path.slice(0, -7)]
    : undefined;
  const stateName = statePageByPath[path];
  const industry = industryGuideByPath[path];
  const info = industry
    ? {
        title: `${industry.title}: Temporary Facilities to Rent or Lease | Temporary123`,
        description: industry.description,
      }
    : detail
      ? {
          title: detail.name + " Rental | Temporary123",
          description: detail.intro.split(". ")[0] + ".",
        }
      : city
        ? {
            title: `${cityHeadline(city)} | Temporary123`,
            description: compact(`${cityEditorial[city.geoid].intro} Emergency 24/7.`, 155),
          }
        : directoryRegion
          ? {
              title: `${directoryRegion.region}, ${directoryRegion.state} City Rental Directory | Temporary123`,
              description: `Browse ${directoryRegion.region}, ${directoryRegion.state} cities and communities for Temporary Facilities Rental planning. Find reviewed city guides and regional services.`,
            }
      : region
        ? {
            title: `${region.index % 2 ? "Trailer Rental" : "Facilities Rental"} in ${region.region}, ${region.state}: Temporary Facilities to Rent or Lease | Temporary123`,
            description: `Rental Services in ${region.region}, ${region.state}. Rent or lease Temporary Facilities: kitchens, shower and restroom combinations, showers and sleeper trailers. Emergency 24/7.`,
          }
        : stateName
          ? {
              title: `Rental Services in ${stateName}: Temporary Facilities to Rent or Lease | Temporary123`,
              description: `Rental Services in ${stateName}. Rent or lease Temporary Facilities: mobile kitchens, shower and restroom combinations, showers and sleeper trailers. Emergency 24/7.`,
            }
          : coreRoutes.includes(path)
            ? pageInfo(path)
            : page
              ? {
                  title: page.title + " | Temporary123",
                  description: sourceDescription(page),
                }
              : path === "/contact-us/"
                ? {
                    title: "Contact Temporary123 | Talk to a Specialist",
                    description: `Call Temporary123 at ${site.phoneDisplay} for mobile kitchens, temporary facilities and project support.`,
                  }
                : path === "/equipment-rental/"
                  ? {
                      title: "Equipment Rental | Temporary123",
                      description:
                        "Explore Temporary123 mobile kitchens, restroom and shower trailers, workforce and site facilities.",
                    }
                  : catalogItem
                    ? {
                        title: `${catalogItem.name} | Temporary123`,
                        description: catalogItem.summary,
                      }
                    : serviceOption
                      ? {
                          title: `${serviceOption.name} Rental | Temporary123`,
                          description: serviceOption.description,
                        }
                      : serviceCategory
                        ? {
                            title: `${serviceCategory.name} Rental | Temporary123`,
                            description: serviceCategory.description,
                          }
                        : pageInfo(path);
  const canonical =
    canonicalFor(path, indexableRoutes.includes(path), release) || "";
  if (!info.description.trim()) {
    info.description = `Explore ${page?.title || "Temporary123 facilities"}. Call Temporary123 at ${site.phoneDisplay} to discuss your site, rental dates and equipment requirements.`;
  }
  const head =
    (fontAsset
      ? `<link rel="preload" href="/assets/${fontAsset}" as="font" type="font/woff2" crossorigin>`
      : "") +
    `<meta name="description" content="${esc(info.description)}"><meta property="og:title" content="${esc(info.title)}"><meta property="og:description" content="${esc(info.description)}"><meta property="og:type" content="website">` +
    `<meta property="og:site_name" content="${esc(site.brand)}"><meta property="og:locale" content="en_US"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(info.title)}"><meta name="twitter:description" content="${esc(info.description)}">` +
    (canonical
      ? `<link rel="canonical" href="${esc(canonical)}"><meta property="og:url" content="${esc(canonical)}"><meta property="og:image" content="${esc(region ? new URL(region.image, site.origin).href : site.origin.replace(/\/$/, "") + "/social-card.png")}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="${esc(region?.imageAlt || site.brand + " temporary facility planning")}">`
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
  // Internal-link labels are navigation elements, so retain a consistent,
  // professional sentence-case opening across both authored and recovered copy.
  $("a[href^='/']").each((_, anchor) => {
    const firstText = $(anchor)
      .contents()
      .toArray()
      .find(
        (node) =>
          node.type === "text" &&
          "data" in node &&
          typeof node.data === "string" &&
          node.data.trim().length > 0,
      );
    if (firstText && "data" in firstText && typeof firstText.data === "string")
      firstText.data = firstText.data.replace(
        /^(\s*)([a-z])/,
        (_match: string, space: string, letter: string) =>
          `${space}${letter.toUpperCase()}`,
      );
  });
  $(
    "meta[name='description'], meta[property='og:title'], meta[property='og:description']",
  ).each((_, element) => {
    $(element).attr("content", cleanCopy($(element).attr("content") || ""));
  });
  // Match schema to final, visible HTML rather than constructing a parallel breadcrumb tree.
  if (path !== "/404/") {
    const h1 = $("h1").first();
    if (path !== "/" && !$("nav.breadcrumb").length) {
      const nav = $(
        '<nav class="breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><span aria-current="page"></span></nav>',
      );
      nav.find('[aria-current="page"]').text(h1.text().trim());
      h1.before(nav);
    }
    const breadcrumb = $("nav.breadcrumb").first();
    if (breadcrumb.length && !breadcrumb.find('[aria-current="page"]').length) {
      breadcrumb.append("<span>/</span>");
      breadcrumb.append(
        $('<span aria-current="page"></span>').text(
          region?.region || stateName || h1.text().trim(),
        ),
      );
    }
    $("main img").each((_, image) => {
      const img = $(image);
      const src = img.attr("src") || "";
      const size = imageDimensions[src as keyof typeof imageDimensions];
      if (size)
        img.attr({ width: String(size.width), height: String(size.height) });
      const alt = img.attr("alt") || "";
      if (
        /^(?:\d+|collage[ -]*\d*|Final.*|Dishwashing\d+|.*\.(png|jpg|webp))$/i.test(
          alt,
        )
      )
        img.attr(
          "alt",
          `${h1.text().trim()}: Temporary123 equipment reference`,
        );
    });
    const crumbs = breadcrumb
      .find('a[href], [aria-current="page"]')
      .toArray()
      .map((el) => ({
        name: $(el).text().trim(),
        item: new URL($(el).attr("href") || path, site.origin).href,
      }));
    const hero = $("main img").first();
    const schema = pageSchema({
      path,
      title: h1.text().trim(),
      description: cleanCopy(info.description),
      crumbs,
      service: Boolean(
        industry ||
        city ||
        region ||
        stateName ||
        serviceCategory ||
        serviceOption ||
        catalogItem ||
        detail,
      ),
      area: city
        ? { name: city.name, state: city.state }
        : region
        ? { name: region.region, state: region.state }
        : stateName
          ? { name: stateName }
          : undefined,
      image: hero.length
        ? {
            src: hero.attr("src")!,
            alt: hero.attr("alt") || "",
            width: Number(hero.attr("width")) || undefined,
            height: Number(hero.attr("height")) || undefined,
          }
        : undefined,
    });
    $("head").append(
      $('<script type="application/ld+json"></script>').text(
        JSON.stringify(schema).replace(/</g, "\\u003c"),
      ),
    );
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
  indexable: release && indexableRoutes.includes(path),
  modified:
    coreRoutes.includes(path) || modelDetails[path as keyof typeof modelDetails]
      ? undefined
      : pages.find((page) => page.path === path)?.modified,
}));
await writeFile("dist/sitemap.xml", sitemapXml(registry, release));
// Review artifact only. Never serve the future sitemap while domain routing is pending.
await writeFile(
  "audit/draft-sitemap.xml",
  sitemapXml(
    registry.map((row) => ({
      ...row,
      indexable: indexableRoutes.includes(row.path),
    })),
    true,
  ),
);
await writeFile(
  "audit/build-registry.json",
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      mode: release ? "production" : "preview",
      indexingScope,
      indexingBatchSize: site.indexingBatchSize,
      activeIndexingBatch: site.activeIndexingBatch,
      eligibleIndexingRoutes: scopedIndexingRoutes.length,
      activeIndexingRoutes: release ? indexableRoutes.length : 0,
      domainRoutingReady: domainReady,
      pages: registry,
      unresolvedSourceLinks: [...unresolvedSourceLinks].sort(),
      restoredAssets,
    },
    null,
    2,
  ) + "\n",
);
const rolloutStart = new Date(`${site.indexingStartDate}T00:00:00Z`);
const rolloutBatches = Array.from(
  { length: Math.ceil(scopedIndexingRoutes.length / site.indexingBatchSize) },
  (_, index) => {
    const date = new Date(rolloutStart);
    date.setUTCDate(date.getUTCDate() + index);
    return {
      batch: index + 1,
      plannedDate: date.toISOString().slice(0, 10),
      active: index + 1 <= site.activeIndexingBatch,
      routes: scopedIndexingRoutes.slice(
        index * site.indexingBatchSize,
        (index + 1) * site.indexingBatchSize,
      ),
    };
  },
);
await writeFile(
  "audit/indexing-rollout.json",
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      origin: site.origin,
      indexingScope,
      batchSize: site.indexingBatchSize,
      activeBatch: site.activeIndexingBatch,
      totalRoutes: scopedIndexingRoutes.length,
      totalBatches: rolloutBatches.length,
      batches: rolloutBatches,
    },
    null,
    2,
  ) + "\n",
);
console.log(
  `Static HTML generated for ${allRoutes.length} pages + 404 (${release ? "production" : "draft/noindex"}).`,
);
