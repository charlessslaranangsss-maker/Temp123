import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { gunzipSync } from "node:zlib";
import { load } from "cheerio";
import { resolveLocationGallery } from "../src/locationCarouselImages";
import { stateGuides } from "../src/stateGuides";
import { stateRentalHeadline } from "../src/rentalHeadlines";
import manifest from "../content/verified-equipment-images.json" with { type: "json" };
import { describeGalleryAudit } from "./gallery-audit-description";
import { referenceCaptionForModel } from "../src/equipmentPhotoPolicy";

const build = process.env.SERVICE_AREA_AUDIT_DIST || "dist";
const baseURL = process.env.SERVICE_AREA_AUDIT_URL;
const baseline = JSON.parse(
  gunzipSync(
    fs.readFileSync("audit/service-area-images-baseline-2026-09-16.json.gz"),
  ).toString("utf8"),
);
const baselineByPath = new Map<string, any>(
  baseline.rows.map((row: any) => [row.path, row]),
);
const registry = JSON.parse(
  fs.readFileSync(
    path
      .join(build, "../audit/build-registry.json")
      .replace(/dist[\\/]\.\.[\\/]/, ""),
    "utf8",
  ),
);
const registered: string[] = registry.pages.map((row: any) => row.path);
const routes = registered.filter((p) => p.startsWith("/service-areas/")).sort();
const states = Object.keys(stateGuides).sort();
const normalize = (text: string) => text.replace(/\s+/g, " ").trim();
const issues: string[] = [];
const rows: any[] = [];
const brokenImages: string[] = [];
const usedAssets = new Set<string>();
const renderedRoutes: string[] = [];
function enumerateRendered(folder: string) {
  for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
    const file = path.join(folder, entry.name);
    if (entry.isDirectory()) enumerateRendered(file);
    else if (entry.name === "index.html")
      renderedRoutes.push(
        "/" +
          path.relative(build, path.dirname(file)).split(path.sep).join("/") +
          "/",
      );
  }
}
enumerateRendered(path.join(build, "service-areas"));
if (JSON.stringify(renderedRoutes.sort()) !== JSON.stringify(routes))
  issues.push(
    "Rendered service-area files and route registry do not reconcile.",
  );
const same = (a: unknown, b: unknown) =>
  JSON.stringify(a) === JSON.stringify(b);
const check = (condition: boolean, message: string, errors: string[]) => {
  if (!condition) errors.push(message);
};

function originalMismatch(family: string, hadImages: boolean) {
  if (!hadImages) return "";
  const descriptions: Record<string, string> = {
    "mobile-kitchen":
      "Previous gallery pooled standard, bulk and combination kitchens of different sizes.",
    "kitchen-modular":
      "Previous gallery supplied kitchen trailers for a modular-building title.",
    "shower-trailer":
      "Previous shower gallery mixed shower containers with shower trailers.",
    "shower-restroom-combination":
      "Previous gallery combined different sizes/stall configurations.",
    "ada-combination":
      "Previous gallery used non-ADA combination units for an ADA title.",
    "laundry-unspecified":
      "Previous laundry gallery mixed trailer and container form factors.",
    "sleeper-trailer":
      "Previous multi-image sleeper gallery lacked reliable image-to-configuration association.",
    unspecified:
      "Previous fallback displayed mixed equipment despite an unspecified title.",
  };
  return (
    descriptions[family] ||
    "Previous image-to-title association required verification."
  );
}

function inspectGallery(
  $: ReturnType<typeof load>,
  gallery: any,
  title: string,
  errors: string[],
) {
  const expected = resolveLocationGallery(title);
  check(
    gallery.length === 1,
    "Expected exactly one title-driven gallery or pending state.",
    errors,
  );
  check(
    normalize(gallery.attr("data-gallery-title") || "") === normalize(title),
    "Gallery title does not equal the exact H1/modal title.",
    errors,
  );
  check(
    gallery.attr("data-equipment-family") === expected.family,
    "Equipment family mismatch.",
    errors,
  );
  check(
    (gallery.attr("data-equipment-model") || "") === (expected.modelId || ""),
    "Model/configuration mismatch.",
    errors,
  );
  const slides = gallery.find("[data-carousel-slide]");
  const ids = slides
    .toArray()
    .map((el: any) => $(el).attr("data-image-review-id"));
  check(
    same(
      ids,
      expected.images.map((i) => i.reviewId),
    ),
    "Assigned images or deterministic order differ from the verified manifest.",
    errors,
  );
  const groups = gallery.find("[data-gallery-group]");
  check(
    gallery.attr("data-gallery-presentation") ===
      (expected.context ? "separate-options" : "single-model"),
    "Gallery presentation does not describe its grouping.",
    errors,
  );
  check(
    groups.length === expected.groups.length,
    "Wrong number of labelled equipment groups.",
    errors,
  );
  expected.groups.forEach((group, index) => {
    const element = groups.eq(index);
    check(
      element.attr("data-group-title") === group.headline,
      "Group title mismatch.",
      errors,
    );
    check(
      element.attr("data-group-family") === group.family,
      "Group family mismatch.",
      errors,
    );
    check(
      element.attr("data-group-model") === group.modelId,
      "Group model mismatch.",
      errors,
    );
    if (expected.context)
      check(
        normalize(element.find("h3").text()) === normalize(group.headline),
        "Equipment option needs a visible heading.",
        errors,
      );
    check(
      element.find("[data-service-carousel]").length === 1,
      "Each option needs one isolated carousel.",
      errors,
    );
    const groupSlides = element.find("[data-carousel-slide]");
    if (expected.context === "laundry") {
      check(
        element
          .find("[data-service-carousel]")
          .attr("data-carousel-lightbox-label") === group.headline,
        "Laundry full-image viewer must retain the product title.",
        errors,
      );
      check(
        normalize(element.find("[data-carousel-caption]").text()) ===
          normalize(referenceCaptionForModel(group.modelId)),
        "Laundry option needs its product-specific reference caption.",
        errors,
      );
    }
    check(
      groupSlides.length === group.images.length,
      "Wrong group slide count.",
      errors,
    );
    const hashes = new Set<string>();
    let exteriorSeen = false;
    groupSlides.each((position: number, node: any) => {
      const slide = $(node),
        image = slide.find("img"),
        approved = group.images[position];
      if (!approved) {
        errors.push("Unexpected image.");
        return;
      }
      const view = slide.attr("data-image-view");
      if (view === "exterior") exteriorSeen = true;
      if (view === "interior" && exteriorSeen)
        errors.push("Interior follows exterior in the same carousel.");
      check(
        slide.attr("data-image-family") === group.family,
        "Mixed families in carousel.",
        errors,
      );
      check(
        slide.attr("data-image-model") === group.modelId,
        "Mixed models in carousel.",
        errors,
      );
      check(
        !hashes.has(approved.sha256),
        "Duplicate image bytes within carousel.",
        errors,
      );
      hashes.add(approved.sha256);
      check(
        image.attr("src") === approved.src,
        "Actual src differs from approved file.",
        errors,
      );
      check(
        image.attr("srcset") === approved.srcSet,
        "Responsive srcset mismatch.",
        errors,
      );
      check(
        image.attr("data-carousel-full-src") === approved.fullSrc,
        "Lightbox original mismatch.",
        errors,
      );
      check(
        image.attr("data-carousel-alt") === approved.alt,
        "Image label mismatch.",
        errors,
      );
      check(
        image.attr("alt") === (position === 0 ? approved.alt : ""),
        "Static active image alt mismatch.",
        errors,
      );
    });
  });
  for (const image of expected.images) {
    usedAssets.add(image.src);
    usedAssets.add(image.fullSrc);
    usedAssets.add(image.thumbnail);
    check(
      fs.existsSync(path.join(build, image.src.slice(1))),
      "Broken rendered image path: " + image.src,
      errors,
    );
    check(
      fs.existsSync(path.join(build, image.fullSrc.slice(1))),
      "Broken full-size path: " + image.fullSrc,
      errors,
    );
  }
  if (expected.images.length) {
    check(
      gallery.find("[data-verified-photo-pending]").length === 0,
      "Unexpected placeholder with approved images.",
      errors,
    );
    check(
      gallery.find("[data-carousel-zoom]").length === expected.images.length,
      "Full-image controls missing.",
      errors,
    );
    check(
      gallery
        .find("[data-service-carousel]")
        .toArray()
        .every((e: any) => $(e).attr("data-carousel-autoplay") === "true"),
      "Autoplay declaration missing.",
      errors,
    );
  } else {
    check(
      gallery.find("[data-verified-photo-pending]").length === 1,
      "Required pending-photography state missing.",
      errors,
    );
    check(
      gallery.text().includes("Verified photography coming soon"),
      "Required pending text missing.",
      errors,
    );
    check(
      gallery.find("img").length === 0,
      "Unverified fallback still includes an image.",
      errors,
    );
  }
  return expected;
}

for (const route of routes) {
  const errors: string[] = [];
  const file = path.join(build, route.slice(1), "index.html");
  if (!fs.existsSync(file)) {
    issues.push("Missing generated route " + route);
    continue;
  }
  const $ = load(fs.readFileSync(file, "utf8"));
  const h1 = $("main h1").text();
  const previous = baselineByPath.get(route);
  check($("main h1").length === 1, "Page does not retain one H1.", errors);
  check(previous?.h1 === h1, "H1 changed from baseline.", errors);
  check(
    previous?.title === $("title").text(),
    "Document title changed.",
    errors,
  );
  check(
    same(
      previous?.meta,
      $("head meta")
        .toArray()
        .map((e) => $(e).attr()),
    ),
    "Head metadata changed.",
    errors,
  );
  check(
    previous?.canonical === ($("link[rel=canonical]").attr("href") || null),
    "Canonical changed.",
    errors,
  );
  const gallery = $("main [data-location-gallery]").filter(
    (_, el) => $(el).parents("template,dialog").length === 0,
  );
  // Charles's layout correction: these navigation pages never had a photo slot.
  // Deliberate absence is not missing photography and must not trigger a new gallery.
  const photographyApplicable =
    route !== "/service-areas/" && !route.endsWith("/cities/");
  if (!photographyApplicable) {
    check(
      gallery.length === 0,
      "Unrequested gallery added to a navigation page.",
      errors,
    );
    check(
      $("main [data-verified-photo-pending]").filter(
        (_, el) => $(el).parents("template,dialog").length === 0,
      ).length === 0,
      "A navigation page without a photo slot must not show a missing-photo placeholder.",
      errors,
    );
  }
  const expected = photographyApplicable
    ? inspectGallery($, gallery, h1, errors)
    : {
        ...resolveLocationGallery(h1),
        images: [],
        groups: [],
        modelId: null,
        reason: "",
      };
  const outside = $("main img").filter(
    (_, el) =>
      $(el).parents("template,dialog,[data-location-gallery]").length === 0,
  );
  check(
    outside.length === 0,
    "An image remains outside the title-driven gallery.",
    errors,
  );
  const mismatch = originalMismatch(
    expected.family,
    Boolean(previous?.images?.length) && route !== "/service-areas/",
  );
  rows.push({
    kind: "page",
    url: route,
    intendedProductionURL: "https://temporary123.com" + route,
    exactTitle: h1,
    photographyApplicable,
    family: expected.family,
    model: expected.modelId,
    ...describeGalleryAudit(expected, photographyApplicable),
    assignedFiles: expected.images.map((i) => i.fullSrc),
    renderedFiles: expected.images.map((i) => i.src),
    reviewIds: expected.images.map((i) => i.reviewId),
    interiorCount: expected.images.filter((i) => i.view === "interior").length,
    exteriorCount: expected.images.filter((i) => i.view === "exterior").length,
    mismatchesFound: mismatch,
    missingVerifiedPhotography:
      photographyApplicable && expected.images.length === 0,
    missingReason: expected.reason,
    errors,
    staticResult: errors.length ? "FAIL" : "PASS",
    httpStatus: null,
    runtimeResult: "Representative browser checks recorded separately",
    liveResult: "NOT DEPLOYED / UNVERIFIED",
  });
}
for (const [context, route] of [
  ["full-map", "/service-areas/"],
  ["compact-map", "/"],
] as const) {
  const $ = load(
    fs.readFileSync(path.join(build, route.slice(1), "index.html"), "utf8"),
  );
  const templates = $("template[data-state-gallery-template]");
  check(
    templates.length === 50,
    context + ": expected 50 exact state templates.",
    issues,
  );
  const names = new Set(
    $("[data-state]")
      .toArray()
      .map((e) => $(e).attr("data-state")),
  );
  check(
    names.size === 50,
    context + ": map does not enumerate 50 unique states.",
    issues,
  );
  for (const state of states) {
    const title = stateRentalHeadline(state);
    const errors: string[] = [];
    const template = templates.filter(
      (_, el) => $(el).attr("data-state-gallery-template") === state,
    );
    check(
      template.length === 1,
      "State gallery template missing or duplicated.",
      errors,
    );
    // HTML template content is an inert fragment, not a normal descendant tree.
    const templateDocument = load(template.html() || "");
    const expected = inspectGallery(
      templateDocument,
      templateDocument("[data-location-gallery]"),
      title,
      errors,
    );
    rows.push({
      kind: context,
      url: route + "#state-modal=" + encodeURIComponent(state),
      state,
      exactTitle: title,
      family: expected.family,
      model: expected.modelId,
      ...describeGalleryAudit(expected),
      assignedFiles: expected.images.map((i) => i.fullSrc),
      renderedFiles: expected.images.map((i) => i.src),
      reviewIds: expected.images.map((i) => i.reviewId),
      interiorCount: expected.images.filter((i) => i.view === "interior")
        .length,
      exteriorCount: expected.images.filter((i) => i.view === "exterior")
        .length,
      mismatchesFound:
        context === "full-map"
          ? "Previous modal kept a fixed mixed-equipment gallery regardless of title."
          : "Compact modal previously had no title-driven equipment gallery.",
      correctionsMade:
        describeGalleryAudit(expected).correctionsMade +
        " Exact-title SSR template shared with dedicated pages; destroy/recreate and reset each gallery on opening; no previous-state image retention.",
      missingVerifiedPhotography: expected.images.length === 0,
      missingReason: expected.reason,
      errors,
      staticResult: errors.length ? "FAIL" : "PASS",
      httpStatus: null,
      runtimeResult: "NOT RUN",
      liveResult: "NOT DEPLOYED / UNVERIFIED",
    });
  }
}

// Check the route universe, deployment gates and original image bytes independently.
check(
  same([...registered].sort(), baseline.rows.map((r: any) => r.path).sort()),
  "Registered URL set changed.",
  issues,
);
check(
  fs.readFileSync(path.join(build, "robots.txt"), "utf8") === baseline.robots,
  "robots.txt changed.",
  issues,
);
check(
  fs.readFileSync(path.join(build, "sitemap.xml"), "utf8") === baseline.sitemap,
  "Official sitemap changed.",
  issues,
);
check(
  createHash("sha256")
    .update(fs.readFileSync("public/sitemap-review.xml"))
    .digest("hex") === baseline.reviewSitemapHash,
  "Review sitemap changed.",
  issues,
);
for (const image of manifest.images) {
  const p = "public" + image.original;
  if (!fs.existsSync(p)) {
    brokenImages.push(p);
    continue;
  }
  check(
    createHash("sha256").update(fs.readFileSync(p)).digest("hex") ===
      image.sha256,
    "Reviewed source changed: " + image.id,
    issues,
  );
}

if (baseURL) {
  const queue = rows.filter((r) => r.kind === "page");
  let next = 0;
  await Promise.all(
    Array.from({ length: 4 }, async () => {
      while (next < queue.length) {
        const row = queue[next++];
        try {
          const response = await fetch(baseURL + row.url, {
            redirect: "manual",
            signal: AbortSignal.timeout(20000),
          });
          row.httpStatus = response.status;
          const $ = load(await response.text());
          if (response.status !== 200)
            row.errors.push("HTTP " + response.status);
          if ($("main h1").text() !== row.exactTitle)
            row.errors.push("Served H1 differs from audited build.");
        } catch (error) {
          row.errors.push("HTTP check failed: " + String(error));
        }
      }
    }),
  );
  for (const src of usedAssets) {
    try {
      const response = await fetch(baseURL + encodeURI(src), {
        method: "HEAD",
        signal: AbortSignal.timeout(20000),
      });
      if (response.status !== 200)
        brokenImages.push(src + " HTTP " + response.status);
    } catch (error) {
      brokenImages.push(src + ": " + String(error));
    }
  }
}
const browserFile = "work/qa/service-area-images/browser-evidence.json";
if (fs.existsSync(browserFile)) {
  const browser = JSON.parse(fs.readFileSync(browserFile, "utf8"));
  const fingerprint = createHash("sha256")
    .update(fs.readFileSync(path.join(build, "service-areas/index.html")))
    .update(fs.readFileSync("public/service-hero-carousel.js"))
    .update(fs.readFileSync("content/verified-equipment-images.json"))
    .digest("hex");
  check(
    browser.buildFingerprint === fingerprint,
    "Browser evidence does not match this exact build/image manifest.",
    issues,
  );
  check(
    browser.checks?.length === 7 &&
      browser.checks.every((c: any) => c.result === "PASS"),
    "One or more required browser acceptance checks failed or did not run.",
    issues,
  );
  check(
    !browser.consoleErrors?.length && !browser.failedRequests?.length,
    "Browser console or same-origin network errors remain.",
    issues,
  );
  for (const row of rows.filter((r) => r.kind !== "page")) {
    const evidence = browser.modals?.find(
      (r: any) =>
        r.kind === row.kind &&
        r.state === row.state &&
        r.exactTitle === row.exactTitle,
    );
    row.runtimeResult = evidence?.result || "NOT RUN";
    if (evidence?.errors?.length) row.errors.push(...evidence.errors);
  }
}
for (const row of rows)
  row.finalResult =
    row.errors.length ||
    issues.length ||
    brokenImages.length ||
    (!baseURL && row.kind === "page") ||
    (row.kind !== "page" && row.runtimeResult !== "PASS")
      ? "FAIL"
      : "PASS";
const summary = {
  auditedAt: new Date().toISOString(),
  environment: "Local isolated production build; not a deployment",
  build,
  baseURL: baseURL || null,
  registeredPages: registered.length,
  serviceAreaPages: routes.length,
  uniqueStates: states.length,
  modalPresentations: rows.filter((r) => r.kind !== "page").length,
  imagesClassified: new Set(manifest.images.map((i) => i.original)).size,
  imageUseRecords: manifest.images.length,
  sourceImages: new Set(
    manifest.images
      .filter((i) => i.group !== "supplemental-catalog")
      .map((i) => i.original),
  ).size,
  supplementalCatalogImages: new Set(
    manifest.images
      .filter((i) => i.group === "supplemental-catalog")
      .map((i) => i.original),
  ).size,
  approvedImages: manifest.images.filter((i) => i.status === "approved").length,
  withheldImages: manifest.images.filter((i) => i.status !== "approved").length,
  pagesWithPhotos: rows.filter(
    (r) => r.kind === "page" && r.assignedFiles.length > 0,
  ).length,
  pagesWithoutImageSection: rows.filter(
    (r) => r.kind === "page" && r.photographyApplicable === false,
  ).length,
  pagesMissingPhotography: rows.filter(
    (r) => r.kind === "page" && r.missingVerifiedPhotography,
  ).length,
  statesMissingPhotography: rows.filter(
    (r) => r.kind === "full-map" && r.missingVerifiedPhotography,
  ).length,
  unsafePageMappingsCorrected: rows.filter(
    (r) => r.kind === "page" && r.mismatchesFound,
  ).length,
  pass: rows.filter((r) => r.finalResult === "PASS").length,
  fail: rows.filter((r) => r.finalResult === "FAIL").length,
  issues,
  brokenImages,
  semantics:
    "PASS means correct verified mapping or truthful pending state, not that missing photography exists. Live deployment verification is separate.",
  imageSchemaNote:
    "Prerender automatically updates image structured-data references to the corrected first visible image. Non-image head metadata, H1s, canonicals, robots and sitemap are compared to baseline.",
};
const prefix =
  process.env.SERVICE_AREA_AUDIT_OUTPUT ||
  "audit/service-area-images-2026-09-16";
fs.writeFileSync(
  prefix + ".json",
  JSON.stringify({ summary, rows }, null, 2) + "\n",
);
const columns = [
  "kind",
  "url",
  "exactTitle",
  "photographyApplicable",
  "family",
  "model",
  "presentation",
  "groupCount",
  "imageGroups",
  "assignedFiles",
  "interiorCount",
  "exteriorCount",
  "mismatchesFound",
  "correctionsMade",
  "missingVerifiedPhotography",
  "missingReason",
  "staticResult",
  "httpStatus",
  "runtimeResult",
  "finalResult",
  "errors",
  "liveResult",
];
const csv = (value: unknown) =>
  '"' +
  String(Array.isArray(value) ? value.join(" | ") : (value ?? "")).replaceAll(
    '"',
    '""',
  ) +
  '"';
fs.writeFileSync(
  prefix + ".csv",
  [
    columns.join(","),
    ...rows.map((r) =>
      columns
        .map((c) => csv(c === "imageGroups" ? JSON.stringify(r[c]) : r[c]))
        .join(","),
    ),
  ].join("\n") + "\n",
);
fs.writeFileSync(
  prefix + "-summary.json",
  JSON.stringify(summary, null, 2) + "\n",
);
console.log(JSON.stringify(summary, null, 2));
process.exitCode = summary.fail || issues.length || brokenImages.length ? 1 : 0;
