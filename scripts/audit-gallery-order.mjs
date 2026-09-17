// Independent rendered-output audit. It does not import the gallery resolver or sort helper.
// Visual decisions are pinned to actual image bytes, not inferred from filenames.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { load } from "cheerio";
const build = path.resolve(process.argv[2] || "dist");
const previous = path.resolve(
  process.argv[3] || ".temp/owner-image-rollout-20260916/dist",
);
const out = path.resolve(
  process.argv[4] || "audit/image-order-followup-2026-09-16",
);
const origin = process.env.GALLERY_ORDER_BASE_URL;
fs.mkdirSync(out, { recursive: true });
const read = (p) => fs.readFileSync(p, "utf8");
const json = (p) => JSON.parse(read(p));
const sha = (b) => crypto.createHash("sha256").update(b).digest("hex");
const clean = (s) => (s || "").replace(/\s+/g, " ").trim();
const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const review = json(path.join(out, "visual-view-review.json"));
const reviews = new Map(review.images.map((i) => [i.src, i]));
const registry = json(path.join(build, "../audit/build-registry.json"));
const oldRegistry = json(path.join(previous, "../audit/build-registry.json"));
const manifest = json(
  path.join(build, "../content/verified-equipment-images.json"),
);
const oldManifest = json(
  path.join(previous, "../content/verified-equipment-images.json"),
);
const allRoutes = registry.pages.map((p) => p.path).sort();
const errors = [],
  presentations = [],
  galleries = [],
  assets = new Map(),
  pageEvidence = [];
const check = (condition, message, target = errors) => {
  if (!condition) target.push(message);
};
check(
  equal(allRoutes, oldRegistry.pages.map((p) => p.path).sort()),
  "Registered routes changed",
);
const byId = (images) => [...images].sort((a, b) => a.id.localeCompare(b.id));
check(
  equal(byId(manifest.images), byId(oldManifest.images)),
  "Image identities, views, approvals or held cases changed in manifest",
);
check(
  equal(manifest.models, oldManifest.models),
  "Equipment models/categories changed",
);
check(
  read(path.join(build, "../content/equipment-photo-policy.json")) ===
    read(path.join(previous, "../content/equipment-photo-policy.json")),
  "Approval/caption policy changed",
);
function validateAsset(src) {
  if (!src || assets.has(src)) return;
  const file = path.join(build, decodeURI(src).slice(1)),
    old = path.join(previous, decodeURI(src).slice(1));
  check(fs.existsSync(file), "Broken assigned path: " + src);
  if (!fs.existsSync(file)) return;
  const bytes = fs.readFileSync(file),
    hash = sha(bytes);
  check(
    fs.existsSync(old) && sha(fs.readFileSync(old)) === hash,
    "Image bytes changed: " + src,
  );
  assets.set(src, { src, bytes: bytes.length, sha256: hash, httpStatus: null });
}
function identity(slide) {
  return JSON.stringify([
    slide.original,
    slide.src,
    slide.srcSet,
    slide.alt,
    slide.reviewId,
    slide.family,
    slide.model,
  ]);
}
function extracted($, el) {
  const c = $(el);
  return {
    label: c.attr("aria-label") || "",
    caption: clean(c.find("[data-carousel-caption]").text()),
    slides: c
      .find("[data-carousel-slide]")
      .toArray()
      .map((s) => {
        const n = $(s),
          i = n.find("img").first();
        return {
          original: i.attr("data-carousel-full-src") || i.attr("src"),
          src: i.attr("src"),
          srcSet: i.attr("srcset") || "",
          alt: i.attr("data-carousel-alt") || "",
          reviewId: n.attr("data-image-review-id") || "",
          family: n.attr("data-image-family") || "",
          model: n.attr("data-image-model") || "",
          declaredView: n.attr("data-image-view"),
        };
      }),
  };
}
function liveSignature($, root) {
  return root
    .find("[data-service-carousel]")
    .filter((_, e) => !$(e).parents("template").length)
    .toArray()
    .map((e) => extracted($, e));
}
function inspect($, root, old$, oldRoot, info) {
  const targets = root
    .find("[data-service-carousel]")
    .filter((_, e) => !$(e).parents("template").length);
  const oldTargets = oldRoot
    .find("[data-service-carousel]")
    .filter((_, e) => !old$(e).parents("template").length);
  const localErrors = [];
  check(
    targets.length === oldTargets.length,
    "Gallery count changed",
    localErrors,
  );
  const pending = root
    .find("[data-verified-photo-pending],.service-hero-unverified")
    .filter((_, e) => !$(e).parents("template").length)
    .toArray()
    .map((e) => clean($(e).text()));
  const oldPending = oldRoot
    .find("[data-verified-photo-pending],.service-hero-unverified")
    .filter((_, e) => !old$(e).parents("template").length)
    .toArray()
    .map((e) => clean(old$(e).text()));
  check(equal(pending, oldPending), "Held fallback changed", localErrors);
  const row = { ...info, groups: [], pending, errors: localErrors };
  targets.each((index, el) => {
    const actual = extracted($, el),
      old = oldTargets[index] ? extracted(old$, oldTargets[index]) : null;
    const g = {
      ...info,
      gallery: index + 1,
      label: actual.label,
      caption: actual.caption,
      slides: [],
      errors: [],
      interiorCount: 0,
      exteriorCount: 0,
      planCount: 0,
    };
    check(
      old && old.label === actual.label && old.caption === actual.caption,
      "Gallery caption/label changed",
      g.errors,
    );
    check(
      old &&
        equal(
          actual.slides.map(identity).sort(),
          old.slides.map(identity).sort(),
        ),
      "Image identity/category/alt or selection changed",
      g.errors,
    );
    let firstExterior = null,
      lastInterior = null;
    const used = new Set();
    actual.slides.forEach((s, i) => {
      const r = reviews.get(s.original);
      check(!!r, "No independent visual review: " + s.original, g.errors);
      validateAsset(s.original);
      validateAsset(s.src);
      for (const part of s.srcSet.split(",")) {
        const src = part.trim().split(/\s+/)[0];
        if (src) validateAsset(src);
      }
      const physical = r?.visualView || "unreviewed";
      check(
        assets.get(s.original)?.sha256 === r?.sha256,
        "Visual review hash mismatch: " + s.original,
        g.errors,
      );
      check(
        (s.declaredView === "detail" ? "interior" : s.declaredView) ===
          physical,
        "Incorrect view label: " + s.original,
        g.errors,
      );
      if (physical === "interior") {
        lastInterior = i + 1;
        g.interiorCount++;
        check(
          firstExterior === null,
          "INTERIOR follows EXTERIOR: " + s.original,
          g.errors,
        );
      }
      if (physical === "exterior") {
        firstExterior ??= i + 1;
        g.exteriorCount++;
      }
      if (physical === "plan") g.planCount++;
      const hash = assets.get(s.original)?.sha256;
      check(
        !used.has(hash),
        "Duplicate image bytes in same carousel",
        g.errors,
      );
      used.add(hash);
      g.slides.push({
        position: i + 1,
        ...s,
        visualView: physical,
        reviewKey: r?.key,
        visualBasis: r?.basis,
        sha256: hash,
      });
    });
    const thumbs = $(el).find("[data-carousel-select]");
    if (actual.slides.length > 1) {
      check(
        thumbs.length === actual.slides.length,
        "Thumbnail count mismatch",
        g.errors,
      );
      thumbs.each((i, t) => {
        check(
          $(t).find("img").attr("src") === actual.slides[i]?.src,
          "Thumbnail order mismatch",
          g.errors,
        );
        check(
          $(t).attr("data-carousel-view") === actual.slides[i]?.declaredView,
          "Thumbnail view mismatch",
          g.errors,
        );
      });
    }
    g.lastInteriorPosition = lastInterior;
    g.firstExteriorPosition = firstExterior;
    g.orderChanged = old
      ? !equal(
          actual.slides.map((s) => s.original),
          old.slides.map((s) => s.original),
        )
      : null;
    g.viewLabelsChanged = old
      ? actual.slides
          .filter(
            (s) =>
              old.slides.find((o) => o.original === s.original)
                ?.declaredView !== s.declaredView,
          )
          .map((s) => s.original)
      : [];
    g.status = g.errors.length ? "FAIL" : "PASS";
    galleries.push(g);
    row.groups.push(g);
  });
  row.status =
    row.errors.length || row.groups.some((g) => g.status === "FAIL")
      ? "FAIL"
      : pending.length && !targets.length
        ? "HELD_CORRECTLY"
        : "PASS";
  presentations.push(row);
  return liveSignature($, root);
}
for (const route of allRoutes) {
  const file = path.join(build, route.slice(1), "index.html"),
    old = path.join(previous, route.slice(1), "index.html");
  const $ = load(read(file)),
    o = load(read(old));
  const head = (d) => ({
    h1: d("main h1").text(),
    title: d("head title").text(),
    metas: d("head meta")
      .toArray()
      .map((e) => d.html(e)),
    canonicals: d('link[rel="canonical"]')
      .toArray()
      .map((e) => d.html(e)),
  });
  check(equal(head($), head(o)), "H1/title/meta/canonical changed: " + route);
  const signature = inspect($, $("main"), o, o("main"), {
    kind: "page",
    route,
    title: $("main h1").text(),
  });
  pageEvidence.push({ route, httpStatus: null, signature });
  if (["/", "/service-areas/"].includes(route)) {
    const templates = $("template[data-state-gallery-template]"),
      oldTemplates = o("template[data-state-gallery-template]");
    check(
      templates.length === 50 && oldTemplates.length === 50,
      "Expected 50 state templates: " + route,
    );
    templates.each((_, el) => {
      const state = $(el).attr("data-state-gallery-template"),
        oldEl = oldTemplates
          .filter((_, t) => o(t).attr("data-state-gallery-template") === state)
          .first();
      const d = load($(el).html() || ""),
        p = load(oldEl.html() || "");
      inspect(d, d("body"), p, p("body"), {
        kind: route === "/" ? "homepage-modal" : "service-area-modal",
        route,
        state,
        title: d("[data-location-gallery]").attr("data-gallery-title"),
      });
    });
  }
}
for (const name of ["robots.txt", "sitemap.xml", "sitemap-review.xml"]) {
  const a = path.join(build, name),
    b = path.join(previous, name);
  check(fs.existsSync(a) === fs.existsSync(b), "Existence changed: " + name);
  if (fs.existsSync(a))
    check(
      sha(fs.readFileSync(a)) === sha(fs.readFileSync(b)),
      "Indexing artifact changed: " + name,
    );
}
async function pool(items, fn) {
  let next = 0;
  await Promise.all(
    Array.from({ length: 4 }, async () => {
      while (next < items.length) await fn(items[next++]);
    }),
  );
}
if (origin) {
  const u = new URL(origin);
  if (!["127.0.0.1", "localhost"].includes(u.hostname))
    throw Error(
      "This revision audit is local-only; live QA is a separate task.",
    );
  await pool(pageEvidence, async (row) => {
    try {
      const res = await fetch(origin + row.route, {
        redirect: "manual",
        signal: AbortSignal.timeout(20000),
      });
      row.httpStatus = res.status;
      check(res.status === 200, "HTTP " + res.status + ": " + row.route);
      const $ = load(await res.text());
      check(
        equal(liveSignature($, $("main")), row.signature),
        "Served gallery differs from frozen output: " + row.route,
      );
    } catch (e) {
      errors.push("HTTP " + row.route + ": " + e.message);
    }
  });
  await pool([...assets.values()], async (row) => {
    try {
      const res = await fetch(origin + encodeURI(row.src), {
        signal: AbortSignal.timeout(20000),
      });
      row.httpStatus = res.status;
      check(res.status === 200, "Asset HTTP " + res.status + ": " + row.src);
      check(
        sha(Buffer.from(await res.arrayBuffer())) === row.sha256,
        "Served asset hash differs: " + row.src,
      );
    } catch (e) {
      errors.push("Asset HTTP " + row.src + ": " + e.message);
    }
  });
}
const sa = presentations.filter(
  (p) => p.kind !== "page" || p.route.startsWith("/service-areas/"),
);
const summary = {
  at: new Date().toISOString(),
  environment: "Frozen local build only; no deployment",
  build,
  previous,
  origin: origin || null,
  registeredRoutes: allRoutes.length,
  serviceAreaPresentations: sa.length,
  allGalleryInstances: galleries.length,
  serviceAreaGalleryInstances: sa.reduce((n, p) => n + p.groups.length, 0),
  allSlideInstances: galleries.reduce((n, g) => n + g.slides.length, 0),
  serviceAreaSlideInstances: sa.reduce(
    (n, p) => n + p.groups.reduce((m, g) => m + g.slides.length, 0),
    0,
  ),
  distinctReviewedFullImagePaths: reviews.size,
  assignedAssetPaths: assets.size,
  heldServiceAreaPages: sa.filter(
    (p) => p.kind === "page" && p.status === "HELD_CORRECTLY",
  ).length,
  heldModalPresentations: sa.filter(
    (p) => p.kind !== "page" && p.status === "HELD_CORRECTLY",
  ).length,
  changedOrderGalleries: galleries.filter((g) => g.orderChanged).length,
  correctedViewLabelGalleries: galleries.filter(
    (g) => g.viewLabelsChanged.length,
  ).length,
  galleryFailures: galleries.filter((g) => g.errors.length).length,
  presentationFailures: presentations.filter((p) => p.status === "FAIL").length,
  errors,
  manifestSha256: sha(
    read(path.join(build, "../content/verified-equipment-images.json")),
  ),
  policySha256: sha(
    read(path.join(build, "../content/equipment-photo-policy.json")),
  ),
};
summary.result =
  errors.length || summary.galleryFailures || summary.presentationFailures
    ? "FAIL"
    : "PASS";
const csv = (v) =>
  '"' +
  String(typeof v === "object" ? JSON.stringify(v) : (v ?? "")).replaceAll(
    '"',
    '""',
  ) +
  '"';
function writeCsv(name, cols, rows) {
  fs.writeFileSync(
    path.join(out, name),
    [
      cols.map(csv).join(","),
      ...rows.map((r) => cols.map((c) => csv(r[c])).join(",")),
    ].join("\n") + "\n",
  );
}
writeCsv(
  "route-modal-inventory.csv",
  ["kind", "route", "state", "title", "status", "groups", "pending", "errors"],
  sa,
);
writeCsv(
  "all-assigned-gallery-order.csv",
  [
    "kind",
    "route",
    "state",
    "gallery",
    "label",
    "interiorCount",
    "exteriorCount",
    "planCount",
    "lastInteriorPosition",
    "firstExteriorPosition",
    "orderChanged",
    "viewLabelsChanged",
    "status",
    "slides",
    "errors",
  ],
  galleries,
);
writeCsv(
  "assigned-slide-order.csv",
  [
    "kind",
    "route",
    "state",
    "gallery",
    "position",
    "original",
    "reviewId",
    "visualView",
    "declaredView",
    "visualBasis",
    "sha256",
  ],
  galleries.flatMap((g) =>
    g.slides.map((s) => ({
      kind: g.kind,
      route: g.route,
      state: g.state,
      gallery: g.gallery,
      ...s,
    })),
  ),
);
writeCsv(
  "other-carousel-routes.csv",
  ["kind", "route", "title", "status", "groups", "errors"],
  presentations.filter(
    (p) =>
      p.kind === "page" &&
      !p.route.startsWith("/service-areas/") &&
      p.groups.length,
  ),
);
writeCsv(
  "held-images.csv",
  ["id", "family", "model", "view", "original", "reason"],
  manifest.images.filter((i) => i.status !== "approved"),
);
fs.writeFileSync(
  path.join(out, "inventory.json"),
  JSON.stringify(
    {
      summary,
      presentations,
      galleries,
      assets: [...assets.values()],
      pageEvidence: pageEvidence.map(({ signature, ...r }) => r),
    },
    null,
    2,
  ),
);
fs.writeFileSync(
  path.join(out, "summary.json"),
  JSON.stringify(summary, null, 2),
);
console.log(JSON.stringify(summary, null, 2));
process.exitCode = summary.result === "PASS" ? 0 : 1;
