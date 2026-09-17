import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { load } from "cheerio";
import {
  resolveLocationGallery,
  detectEquipmentFamily,
} from "../src/locationCarouselImages.ts";
import { alignedLocationIntro } from "../src/alignedIntroductions.ts";
import { stateGuides } from "../src/stateGuides.ts";
import { stateRentalHeadline } from "../src/rentalHeadlines.ts";
import { catalog } from "../src/EquipmentCatalog.tsx";
import { catalogPhotoCoverage } from "../src/catalogImageCoverage.ts";
import { imagesForServicePath } from "../src/serviceHeroImages.ts";
import { equipment, equipmentGalleryForPath } from "../src/Equipment.tsx";
const build = process.env.ALIGNMENT_DIST || "dist";
const origin = process.env.ALIGNMENT_URL || "http://127.0.0.1:4211";
const output = "audit/all-page-alignment-final-2026-09-16";
fs.mkdirSync(output, { recursive: true });
const baseline = JSON.parse(
  fs.readFileSync("work/qa/all-page-alignment-20260916/before.json", "utf8"),
);
const old = new Map(baseline.rows.map((row) => [row.url, row]));
const registry = JSON.parse(
  fs.readFileSync("audit/build-registry.json", "utf8"),
).pages;
const manifest = JSON.parse(
  fs.readFileSync("content/verified-equipment-images.json", "utf8"),
);
const details = JSON.parse(
  fs.readFileSync("content/service-details.json", "utf8"),
);
const byId = new Map(manifest.images.map((image) => [image.id, image]));
const normalized = (value) =>
  String(value || "")
    .replace(/\s+/g, " ")
    .trim();
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const hash = (file) =>
  crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const rows = [],
  modalRows = [],
  assets = new Set(),
  problems = [];
const check = (condition, message, errors) => {
  if (!condition) errors.push(message);
};
function topic(title, intro, errors) {
  const family = detectEquipmentFamily(title);
  if (family === "mobile-kitchen") {
    check(
      /kitchen|cooking|food.preparation/i.test(intro),
      "Kitchen introduction lacks kitchen purpose",
      errors,
    );
    check(
      !/shower|restroom|sleep|laundry/i.test(intro),
      "Kitchen introduction promotes unrelated equipment",
      errors,
    );
  }
  if (family === "laundry-unspecified") {
    check(
      /30 ft laundry trailer/i.test(intro) &&
        /20 ft laundry container/i.test(intro),
      "Broad laundry intro does not distinguish both products",
      errors,
    );
    check(
      !/kitchen|shower|sleep/i.test(intro),
      "Laundry introduction promotes unrelated equipment",
      errors,
    );
  }
  if (family === "sleeper-trailer")
    check(
      /sleep|bunk|bed/i.test(intro),
      "Sleeper intro lacks sleeping purpose",
      errors,
    );
  if (family === "kitchen-modular")
    check(
      /modular|building/i.test(intro),
      "Modular intro omits form factor",
      errors,
    );
  if (family === "shower-trailer")
    check(
      /shower|washing/i.test(intro),
      "Shower intro lacks washing purpose",
      errors,
    );
  return family;
}
function inspectPhotos($, scope, errors) {
  const sets = [];
  scope.find("[data-service-carousel]").each((_, figure) => {
    const carousel = $(figure),
      slides = carousel.find("[data-carousel-slide]");
    const originals = [],
      families = new Set(),
      models = new Set();
    let outside = false;
    slides.each((_, element) => {
      const slide = $(element),
        image = slide.find("img").first(),
        view = slide.attr("data-image-view");
      const full = image.attr("data-carousel-full-src") || image.attr("src");
      originals.push(full);
      if (view === "exterior") outside = true;
      if (outside && (view === "interior" || view === "detail"))
        errors.push("Interior appears after exterior");
      if (slide.attr("data-image-family"))
        families.add(slide.attr("data-image-family"));
      if (slide.attr("data-image-model"))
        models.add(slide.attr("data-image-model"));
      const id = slide.attr("data-image-review-id");
      if (id) {
        const expected = byId.get(id);
        check(
          expected?.status === "approved",
          "Unapproved image " + id,
          errors,
        );
        if (expected) {
          check(full === expected.original, "Wrong original " + id, errors);
          check(
            image.attr("data-carousel-alt") === expected.alt,
            "Wrong image alt " + id,
            errors,
          );
        }
      }
      check(
        Boolean(image.attr("data-carousel-alt")),
        "Missing image description",
        errors,
      );
    });
    check(
      new Set(originals).size === originals.length,
      "Duplicate original within carousel",
      errors,
    );
    check(
      families.size <= 1 && models.size <= 1,
      "Mixed family/model in one carousel",
      errors,
    );
    sets.push({
      label: carousel.attr("aria-label"),
      model: [...models],
      family: [...families],
      files: originals,
    });
  });
  scope.find("img").each((_, element) => {
    const image = $(element);
    for (const file of [
      image.attr("src"),
      image.attr("data-carousel-full-src"),
      ...(image.attr("srcset") || "")
        .split(",")
        .map((part) => part.trim().split(/\s+/)[0]),
    ]) {
      if (!file || !file.startsWith("/")) continue;
      const clean = decodeURIComponent(file.split("?")[0]);
      assets.add(clean);
      check(
        fs.existsSync(path.join(build, clean.slice(1))),
        "Missing image " + clean,
        errors,
      );
    }
  });
  return sets;
}
for (const entry of registry) {
  const route = entry.path,
    errors = [],
    file = path.join(build, route.slice(1), "index.html");
  if (!fs.existsSync(file)) {
    problems.push("Missing route " + route);
    continue;
  }
  const $ = load(fs.readFileSync(file, "utf8")),
    main = $("main");
  const h1 = normalized(main.find("h1").text()),
    intro = normalized(main.find("[data-h1-intro]").first().text());
  check(main.find("h1").length === 1, "Expected one H1", errors);
  check(
    intro.length >= 60,
    "Missing or insufficient immediate H1 description",
    errors,
  );
  check(
    main.find("[data-h1-intro]").length === 1,
    "Unexpected H1 description count",
    errors,
  );
  const previous = old.get(route);
  check(previous && normalized(previous.h1) === h1, "H1 changed", errors);
  check(previous?.title === $("title").text(), "Page title changed", errors);
  check(
    same(
      previous?.headMeta,
      $("head meta")
        .map((_, el) => $(el).attr())
        .get(),
    ),
    "Head metadata changed",
    errors,
  );
  check(
    (previous?.canon || null) ===
      ($("link[rel=canonical]").attr("href") || null),
    "Canonical changed",
    errors,
  );
  const family = topic(h1, intro, errors);
  const navigation = route === "/service-areas/" || route.endsWith("/cities/");
  if (navigation) {
    check(
      main.find("[data-location-gallery]").length === 0,
      "Unrequested navigation gallery",
      errors,
    );
    check(
      main.find("[data-verified-photo-pending]").length === 0,
      "Navigation photo placeholder",
      errors,
    );
  }
  if (route.startsWith("/service-areas/") && !navigation) {
    const gallery = resolveLocationGallery(h1),
      rendered = main.find("[data-location-gallery]");
    check(rendered.length === 1, "Missing existing location gallery", errors);
    check(
      same(
        rendered
          .find("[data-carousel-slide]")
          .map((_, e) => $(e).attr("data-image-review-id"))
          .get(),
        gallery.images.map((i) => i.reviewId),
      ),
      "Location gallery differs from manifest",
      errors,
    );
  }
  if (details[route])
    check(
      main.find("[data-carousel-slide]").length ===
        (imagesForServicePath(route) || []).length,
      "Service page omits or adds reviewed images",
      errors,
    );
  const galleries = inspectPhotos($, main, errors);
  rows.push({
    kind: "page",
    url: route,
    h1,
    intro,
    beforeIntro: normalized(previous?.intro),
    introChanged: intro !== normalized(previous?.intro),
    family,
    navigationWithoutImages: navigation,
    galleryCount: galleries.length,
    slideCount: galleries.reduce((n, g) => n + g.files.length, 0),
    galleries,
    photographyPending:
      main.find(
        "[data-verified-photo-pending], [data-catalog-photo-pending], .service-hero-unverified",
      ).length > 0,
    sourceArticle: main.find(".source-content").length > 0,
    httpStatus: null,
    errors,
  });
}
for (const [kind, route] of [
  ["full-map", "/service-areas/"],
  ["compact-map", "/"],
]) {
  const $ = load(
    fs.readFileSync(path.join(build, route.slice(1), "index.html"), "utf8"),
  );
  const content = load($("#map-state-guides").html() || "");
  for (const state of Object.keys(stateGuides).sort()) {
    const errors = [],
      title = stateRentalHeadline(state);
    const guide = content("[data-state-guide]").filter(
      (_, el) => content(el).attr("data-state-guide") === state,
    );
    const intro = normalized(guide.find("[data-guide-intro]").text());
    check(
      intro === normalized(alignedLocationIntro(title, state)),
      "State intro mismatch",
      errors,
    );
    topic(title, intro, errors);
    const template = $("template[data-state-gallery-template]").filter(
      (_, el) => $(el).attr("data-state-gallery-template") === state,
    );
    check(template.length === 1, "State template missing or duplicate", errors);
    const doc = load(template.html() || ""),
      gallery = resolveLocationGallery(title);
    check(
      same(
        doc("[data-carousel-slide]")
          .map((_, e) => doc(e).attr("data-image-review-id"))
          .get(),
        gallery.images.map((i) => i.reviewId),
      ),
      "State images mismatch",
      errors,
    );
    const galleries = inspectPhotos(doc, doc("body"), errors);
    modalRows.push({
      kind,
      url: route + "#state=" + encodeURIComponent(state),
      state,
      h1: title,
      intro,
      family: gallery.family,
      galleries,
      errors,
    });
  }
}
check(
  same(
    registry.map((r) => r.path).sort(),
    baseline.rows.map((r) => r.url).sort(),
  ),
  "URL universe changed",
  problems,
);
for (const [file, expected] of Object.entries(baseline.hashes))
  if (file.startsWith("content/pages/"))
    check(hash(file) === expected, "Source archive changed " + file, problems);
const catalogue = catalog.items.map((item) => {
  const p = catalogPhotoCoverage(item);
  return {
    id: item.id,
    url: item.path,
    title: item.name,
    status: p.status,
    files: p.images.map((i) => i.fullSrc),
    imageCount: p.images.length,
    caption: p.caption,
  };
});
check(
  catalogue.every((row) => row.status !== "unreviewed"),
  "Unreviewed catalogue card",
  problems,
);
const services = Object.entries(details).map(([url, item]) => ({
  url,
  title: item.name,
  files: (imagesForServicePath(url) || []).map((i) => i.fullSrc),
  imageCount: (imagesForServicePath(url) || []).length,
  status: imagesForServicePath(url)?.length
    ? "reviewed"
    : "held-exact-configuration",
}));
const cards = equipment.map((item) => ({
  url: item.path,
  title: item.name,
  imageCount: equipmentGalleryForPath(item.path).images.length,
  files: equipmentGalleryForPath(item.path).images.map((i) => i.fullSrc),
}));
let next = 0;
await Promise.all(
  Array.from({ length: 4 }, async () => {
    while (next < rows.length) {
      const row = rows[next++];
      try {
        const response = await fetch(origin + row.url, {
          redirect: "manual",
          signal: AbortSignal.timeout(30000),
        });
        row.httpStatus = response.status;
        const $ = load(await response.text());
        check(response.status === 200, "HTTP " + response.status, row.errors);
        check(
          normalized($("main [data-h1-intro]").first().text()) === row.intro,
          "Served intro does not match build",
          row.errors,
        );
      } catch (e) {
        row.errors.push("HTTP error " + e.message);
      }
    }
  }),
);
for (const file of assets) {
  try {
    const r = await fetch(origin + encodeURI(file), {
      method: "HEAD",
      signal: AbortSignal.timeout(15000),
    });
    check(r.status === 200, "Asset HTTP " + r.status + " " + file, problems);
  } catch (e) {
    problems.push("Asset error " + file);
  }
}
const all = [...rows, ...modalRows];
for (const row of all) row.staticResult = row.errors.length ? "FAIL" : "PASS";
const summary = {
  at: new Date().toISOString(),
  environment: "Local isolated build; not live deployment",
  origin,
  pages: rows.length,
  serviceAreaPages: rows.filter((r) => r.url.startsWith("/service-areas/"))
    .length,
  modalPresentations: modalRows.length,
  changedIntroductions: rows.filter((r) => r.introChanged).length,
  unchangedReviewedIntroductions: rows.filter((r) => !r.introChanged).length,
  intentionalNoPhotoNavigation: rows.filter((r) => r.navigationWithoutImages)
    .length,
  catalogueEntries: catalogue.length,
  catalogueWithOneReference: catalogue.filter((r) => r.imageCount === 1).length,
  catalogueWithMultipleImages: catalogue.filter((r) => r.imageCount > 1).length,
  catalogueHeld: catalogue.filter((r) => !r.imageCount).length,
  serviceEntries: services.length,
  serviceEntriesHeld: services.filter((r) => !r.imageCount).length,
  serviceCards: cards.length,
  assetsChecked: assets.size,
  pass: all.filter((r) => !r.errors.length).length,
  fail: all.filter((r) => r.errors.length).length,
  problems,
  browserAcceptance:
    "Recorded separately; static PASS is not browser or live QA",
};
fs.writeFileSync(
  output + "/audit.json",
  JSON.stringify(
    { summary, rows, modalRows, catalogue, services, cards },
    null,
    2,
  ),
);
const csv = (v) =>
  '"' +
  String(typeof v === "object" ? JSON.stringify(v) : (v ?? "")).replaceAll(
    '"',
    '""',
  ) +
  '"';
const cols = [
  "kind",
  "url",
  "h1",
  "intro",
  "beforeIntro",
  "introChanged",
  "family",
  "navigationWithoutImages",
  "galleryCount",
  "slideCount",
  "photographyPending",
  "httpStatus",
  "staticResult",
  "errors",
];
fs.writeFileSync(
  output + "/all-pages-and-modals.csv",
  [
    cols.join(","),
    ...all.map((row) => cols.map((c) => csv(row[c])).join(",")),
  ].join("\n"),
);
fs.writeFileSync(output + "/summary.json", JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));
process.exitCode = summary.fail || problems.length ? 1 : 0;
