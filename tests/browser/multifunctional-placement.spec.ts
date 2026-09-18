import { test, expect, type Page, type Locator } from "@playwright/test";
import fs from "node:fs";
import additions from "../../content/equipment-photo-additions.json" with { type: "json" };

type Target = { kind: string; url: string; state?: string; title: string };
const qa = "work/qa/multifunctional-placement-20260916";
const targets: Target[] = JSON.parse(
  fs.readFileSync(qa + "/affected-before.json", "utf8"),
);
const evidence: {
  records: unknown[];
  errors: string[];
  failedRequests: string[];
} = { records: [], errors: [], failedRequests: [] };
const origin = new URL(
  process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4209",
).origin;
test.describe.configure({ mode: "serial" });
test.beforeEach(async ({ page }) => {
  page.on("pageerror", (e) => evidence.errors.push(e.message));
  page.on("console", (msg) => {
    if (msg.type() === "error") evidence.errors.push(msg.text());
  });
  page.on("response", (res) => {
    if (res.status() >= 400 && new URL(res.url()).origin === origin)
      evidence.failedRequests.push(res.status() + " " + res.url());
  });
  page.on("requestfailed", (req) => {
    if (
      new URL(req.url()).origin === origin &&
      !req.failure()?.errorText.includes("ERR_ABORTED")
    )
      evidence.failedRequests.push(req.url());
  });
  await page.route("**/api/contact*", (route) => {
    evidence.errors.push("Unexpected contact request");
    return route.abort();
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
});
test.afterEach(async () =>
  fs.writeFileSync(
    qa + "/placement-browser.json",
    JSON.stringify(evidence, null, 2),
  ),
);

async function checkNewProducts(
  page: Page,
  gallery: Locator,
  row: Target,
  width: number,
) {
  await expect(gallery).toHaveAttribute("data-gallery-title", row.title);
  await expect(gallery).toHaveAttribute(
    "data-gallery-presentation",
    "separate-options",
  );
  await expect(gallery.locator("[data-gallery-group]")).toHaveCount(3);
  await expect(gallery.locator(".location-gallery-context")).toHaveCount(0);
  for (const model of additions.models) {
    const image = additions.images.find((i) => i.model === model.id)!;
    const group = gallery.locator('[data-group-model="' + model.id + '"]');
    await expect(group.locator("h3")).toHaveText(model.name);
    await expect(group.locator("[data-carousel-slide]")).toHaveCount(1);
    await expect(group.locator("[data-carousel-slide]")).toHaveAttribute(
      "data-image-family",
      model.family,
    );
    await expect(group.locator("[data-carousel-slide]")).toHaveAttribute(
      "data-image-view",
      "exterior",
    );
    await expect(group.locator("[data-carousel-caption]")).toHaveText(
      model.caption,
    );
    await group
      .locator("[data-carousel-slide] img")
      .evaluate((im: HTMLImageElement) => im.decode());
    await group.locator("[data-carousel-zoom]").click();
    const box = page.locator("dialog.service-image-lightbox");
    await expect(box).toBeVisible();
    await expect(box.locator("[data-lightbox-title]")).toHaveText(model.name);
    await expect(box).toHaveAttribute("aria-label", model.name + " full image");
    await expect(box.locator("[data-lightbox-reference]")).toHaveText(
      model.caption,
    );
    await expect(box.locator("[data-lightbox-image]")).toHaveAttribute(
      "alt",
      image.alt,
    );
    await expect(box.locator("[data-lightbox-image]")).toHaveAttribute(
      "src",
      image.original,
    );
    await expect(box.locator("[data-lightbox-image]")).toHaveCSS(
      "object-fit",
      "contain",
    );
    expect(
      await box
        .locator("[data-lightbox-image]")
        .evaluate(async (im: HTMLImageElement) => {
          await im.decode();
          return [im.naturalWidth, im.naturalHeight];
        }),
    ).toEqual([1434, 1097]);
    await expect(box.locator("[data-lightbox-next]")).toBeHidden();
    if (row.kind === "page" && row.url === "/service-areas/texas/")
      await page.screenshot({
        path: qa + "/texas-full-" + image.id + "-" + width + ".png",
      });
    if (model.id === "new-38ft-all-electric-kitchen")
      await page.keyboard.press("Escape");
    else await box.locator("[data-lightbox-close]").click();
    await expect(box).not.toBeVisible();
    await expect(box.locator("[data-lightbox-title]")).toHaveText("");
  }
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth - innerWidth,
    ),
  ).toBeLessThanOrEqual(1);
  evidence.records.push({
    ...row,
    width,
    fullImagesChecked: 2,
    result: "PASS",
  });
}

for (const width of [1440, 390]) {
  test(
    "actual man-camp pages and state modals show both new product photographs at " +
      width +
      "px",
    async ({ page }) => {
      test.setTimeout(240000);
      await page.setViewportSize({ width, height: 1000 });
      expect(targets.filter((r) => r.kind === "page")).toHaveLength(42);
      expect(targets.filter((r) => r.kind !== "page")).toHaveLength(14);
      for (const row of targets.filter((r) => r.kind === "page")) {
        const response = await page.goto(row.url);
        expect(response?.status()).toBe(200);
        await expect(page.locator("main h1")).toHaveText(row.title);
        await checkNewProducts(
          page,
          page.locator("main [data-location-gallery]").first(),
          row,
          width,
        );
        if (row.url === "/service-areas/texas/") {
          await page
            .locator("main [data-location-gallery]")
            .first()
            .scrollIntoViewIfNeeded();
          await page.screenshot({
            path: qa + "/texas-gallery-" + width + ".png",
          });
        }
      }
      for (const kind of ["full-map", "compact-map"]) {
        const selected = targets.filter((r) => r.kind === kind);
        await page.goto(selected[0].url);
        if (kind === "full-map")
          await expect(
            page.locator(".location-hero-copy [data-location-gallery]"),
          ).toHaveCount(0);
        for (const row of selected) {
          await page.locator("[data-state-picker]").selectOption(row.state!);
          const dialog = page.locator("#state-services-dialog");
          await expect(dialog).toBeVisible();
          await expect(dialog.locator("[data-state-headline]")).toHaveText(
            row.title,
          );
          await checkNewProducts(
            page,
            dialog.locator("[data-location-gallery]"),
            row,
            width,
          );
          await dialog.locator("[data-close-state]").click();
          await expect(dialog.locator("img")).toHaveCount(0);
        }
        // Follow a multifunctional state with a hygiene-only state: no stale images/labels.
        await page.locator("[data-state-picker]").selectOption("California");
        const dialog = page.locator("#state-services-dialog");
        await expect(
          dialog.locator(
            '[data-image-review-id="26.01"], [data-image-review-id="27.01"]',
          ),
        ).toHaveCount(0);
        await dialog.locator("[data-close-state]").click();
      }
      expect(evidence.errors).toEqual([]);
      expect(evidence.failedRequests).toEqual([]);
    },
  );
}
