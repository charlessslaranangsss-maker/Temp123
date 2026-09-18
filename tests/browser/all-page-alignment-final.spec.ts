import { test, expect, type Page, type Locator } from "@playwright/test";
import fs from "node:fs";
import { stateGuides } from "../../src/stateGuides";
import { stateRentalHeadline } from "../../src/rentalHeadlines";
import { resolveLocationGallery } from "../../src/locationCarouselImages";
import { alignedLocationIntro } from "../../src/alignedIntroductions";
import { equipment, equipmentGalleryForPath } from "../../src/Equipment";
import { catalog } from "../../src/EquipmentCatalog";
import { catalogPhotoCoverage } from "../../src/catalogImageCoverage";
import { imagesForServicePath } from "../../src/serviceHeroImages";
import details from "../../content/service-details.json" with { type: "json" };

test.describe.configure({ mode: "serial" });
const folder = "work/qa/all-page-final-20260916";
const evidence: any = {
  at: new Date().toISOString(),
  origin: process.env.PLAYWRIGHT_BASE_URL,
  checks: [],
  modals: [],
  pages: [],
  quickViews: [],
  consoleErrors: [],
  networkErrors: [],
  fullImages: 0,
};
test.beforeAll(() => fs.mkdirSync(folder, { recursive: true }));
test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() =>
    localStorage.setItem(
      "temporary123:emergency-dismissed-until-v1",
      String(Date.now() + 86400000),
    ),
  );
  page.on("pageerror", (e) => evidence.consoleErrors.push(e.message));
  page.on("response", (r) => {
    if (
      r.status() >= 400 &&
      r
        .url()
        .startsWith(process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4211")
    )
      evidence.networkErrors.push({ url: r.url(), status: r.status() });
  });
});
test.afterEach(async ({}, info) => {
  evidence.checks.push({
    name: info.title,
    result: info.status === info.expectedStatus ? "PASS" : "FAIL",
    errors: info.errors.map((e) => e.message),
  });
  fs.writeFileSync(
    folder + "/browser-evidence.json",
    JSON.stringify(evidence, null, 2),
  );
});

async function fullImage(page: Page, carousel: Locator, expected?: any) {
  const trigger = carousel.locator('[data-active="true"] [data-carousel-zoom]');
  await trigger.click();
  const box = page.locator("dialog.service-image-lightbox"),
    image = box.locator("[data-lightbox-image]");
  await expect(box).toBeVisible();
  await expect(image).toHaveCSS("object-fit", "contain");
  const active = carousel.locator('[data-active="true"] img');
  await expect(image).toHaveAttribute(
    "src",
    expected?.fullSrc || (await active.getAttribute("data-carousel-full-src"))!,
  );
  await expect(image).toHaveAttribute(
    "alt",
    expected?.alt || (await active.getAttribute("data-carousel-alt"))!,
  );
  await image.evaluate(async (el: HTMLImageElement) => {
    await el.decode();
    if (!el.naturalWidth) throw Error("Original did not decode");
  });
  if (await carousel.getAttribute("data-carousel-lightbox-label"))
    await expect(box.locator("[data-lightbox-title]")).toHaveText(
      (await carousel.getAttribute("data-carousel-lightbox-label"))!,
    );
  evidence.fullImages++;
  await page.keyboard.press("Escape");
  await expect(box).not.toBeVisible();
}

async function checkGallery(page: Page, root: Locator, title: string) {
  const expected = resolveLocationGallery(title);
  await expect(root).toHaveAttribute("data-gallery-title", title);
  await expect(root.locator(".location-gallery-context")).toHaveCount(0);
  await expect(root.locator("[data-gallery-group]")).toHaveCount(
    expected.groups.length,
  );
  if (!expected.images.length) {
    await expect(root.locator("[data-verified-photo-pending]")).toBeVisible();
    return;
  }
  if (expected.groups.length > 1) {
    await expect(root).toHaveAttribute("data-product-tabs-ready", "true");
    await expect(root.locator("[role=tab]")).toHaveCount(
      expected.groups.length,
    );
  }
  for (let index = 0; index < expected.groups.length; index++) {
    if (expected.groups.length > 1)
      await root.locator("[data-product-tab]").nth(index).click();
    const group = root.locator("[data-gallery-group]").nth(index),
      wanted = expected.groups[index],
      carousel = group.locator("[data-service-carousel]");
    await expect(group).toBeVisible();
    await expect(carousel).toHaveAttribute("data-carousel-ready", "true");
    await expect(carousel).toHaveAttribute("data-carousel-index", "0");
    expect(
      await carousel
        .locator("[data-carousel-slide]")
        .evaluateAll((nodes) =>
          nodes.map((n) => n.getAttribute("data-image-review-id")),
        ),
    ).toEqual(wanted.images.map((i) => i.reviewId));
    if (expected.groups.length > 1) {
      await expect(root.locator("[data-gallery-group]:visible")).toHaveCount(1);
      await expect(group.locator("h3")).toHaveText(wanted.headline);
    }
    for (let i = 0; i < wanted.images.length; i++) {
      const image = carousel.locator("[data-carousel-slide] img").nth(i);
      await expect(image).toHaveAttribute("src", wanted.images[i].src);
      await image.evaluate(async (el: HTMLImageElement) => {
        el.loading = "eager";
        await el.decode();
      });
    }
    await fullImage(page, carousel, wanted.images[0]);
    if (wanted.images.length > 1) {
      await carousel.locator("[data-carousel-next]").click();
      await expect(carousel).toHaveAttribute("data-carousel-index", "1");
    }
  }
  if (expected.groups.length > 1) {
    await root.locator("[data-product-tab]").first().click();
    await expect(
      root
        .locator("[data-gallery-group]")
        .first()
        .locator("[data-service-carousel]"),
    ).toHaveAttribute("data-carousel-index", "0");
  }
}

for (const [kind, route, width] of [
  ["full-map", "/service-areas/", 1440],
  ["compact-map", process.env.PLAYWRIGHT_BASE_URL ? "/" : "/index.html", 390],
] as const) {
  test(
    "all 50 state modals: aligned introductions, product tabs and full images in " +
      kind,
    async ({ page }) => {
      test.setTimeout(360000);
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(route);
      for (const state of Object.keys(stateGuides).sort()) {
        await page.locator("[data-state-picker]").selectOption(state);
        const dialog = page.locator("#state-services-dialog"),
          title = stateRentalHeadline(state);
        await expect(dialog).toBeVisible();
        await expect(dialog.locator("[data-state-headline]")).toHaveText(title);
        await expect(dialog.locator("#state-services-intro")).toHaveText(
          alignedLocationIntro(title, state),
        );
        await checkGallery(
          page,
          dialog.locator("[data-location-gallery]"),
          title,
        );
        const ids = await page
          .locator("[id]")
          .evaluateAll((nodes) => nodes.map((n) => n.id));
        expect(new Set(ids).size).toBe(ids.length);
        await dialog.locator("[data-close-state]").click();
        await expect(dialog.locator("img")).toHaveCount(0);
        await expect(
          page.locator("dialog.service-image-lightbox"),
        ).not.toBeVisible();
        evidence.modals.push({ kind, state, title, result: "PASS" });
      }
    },
  );
}

test("dedicated pages present large isolated product galleries on desktop and mobile", async ({
  page,
}) => {
  test.setTimeout(180000);
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of [
      "/service-areas/arizona/southern-arizona/",
      "/service-areas/texas/",
      "/service-areas/california/",
      "/service-areas/alaska/",
      "/service-areas/arkansas/",
      "/service-areas/washington/olympic-peninsula/port-angeles/",
      "/service-areas/washington/puget-sound/tacoma/",
    ]) {
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      const title = (await page.locator("main h1").textContent())!;
      await expect(page.locator("main [data-h1-intro]")).not.toBeEmpty();
      await checkGallery(
        page,
        page.locator("main [data-location-gallery]"),
        title,
      );
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth - innerWidth,
        ),
      ).toBeLessThanOrEqual(1);
      if (route.includes("southern-arizona")) {
        await page.locator("[data-location-gallery]").scrollIntoViewIfNeeded();
        await page.screenshot({
          path: folder + "/laundry-tabs-" + width + ".png",
        });
      }
      evidence.pages.push({ route, width, result: "PASS" });
    }
  }
});

test("all registered model and catalogue galleries use complete reviewed image sets, including single-image cases", async ({
  page,
}) => {
  test.setTimeout(300000);
  const paths = new Set([
    ...Object.keys(details),
    ...catalog.items.map((i) => i.path),
  ]);
  const routes = JSON.parse(
    fs.readFileSync("audit/build-registry.json", "utf8"),
  ).pages.map((r: any) => r.path);
  for (const route of paths) {
    if (!routes.includes(route)) continue;
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator("main h1")).toHaveCount(1);
    await expect(page.locator("main [data-h1-intro]")).not.toBeEmpty();
    const carousels = page.locator("main [data-service-carousel]");
    for (const carousel of await carousels.all()) {
      if (!(await carousel.isVisible())) continue;
      await fullImage(page, carousel);
      const count = await carousel.locator("[data-carousel-slide]").count();
      if (count === 1) {
        await expect(carousel.locator("[data-carousel-next]")).toHaveCount(0);
        await expect(carousel.locator("[data-carousel-toggle]")).toHaveCount(0);
      } else {
        await carousel.locator("[data-carousel-next]").click();
        await fullImage(page, carousel);
      }
    }
    evidence.pages.push({ route, width: 1280, result: "PASS" });
  }
});

test("Services, equipment directory and homepage quick views expose complete matching sets and reset on reopening", async ({
  page,
}) => {
  test.setTimeout(240000);
  await page.setViewportSize({ width: 390, height: 900 });
  for (const route of ["/services/", "/equipment-rental/", "/"]) {
    await page.goto(route);
    for (let index = 0; index < equipment.length; index++) {
      const wanted = equipmentGalleryForPath(equipment[index].path),
        button = page.locator('[data-open-dialog="equipment-' + index + '"]');
      await button.click();
      const dialog = page.locator("#equipment-" + index),
        carousel = dialog.locator("[data-service-carousel]");
      await expect(dialog).toBeVisible();
      await expect(dialog.locator("[data-carousel-slide]")).toHaveCount(
        wanted.images.length,
      );
      if (wanted.images.length) {
        await expect(carousel).toHaveAttribute("data-carousel-index", "0");
        await fullImage(page, carousel);
        if (wanted.images.length > 1)
          await carousel.locator("[data-carousel-next]").click();
      }
      await dialog.locator("[data-close-dialog]").click();
      await button.click();
      if (wanted.images.length)
        await expect(carousel).toHaveAttribute("data-carousel-index", "0");
      await dialog.locator("[data-close-dialog]").click();
      evidence.quickViews.push({
        route,
        product: equipment[index].name,
        images: wanted.images.length,
        result: "PASS",
      });
    }
  }
});

test("keyboard selection, reduced motion and no-JavaScript fallback retain clear product identity", async ({
  page,
  browser,
}) => {
  await page.goto("/service-areas/arizona/southern-arizona/");
  const root = page.locator("main [data-location-gallery]"),
    tabs = root.locator("[role=tab]");
  await tabs.first().focus();
  await page.keyboard.press("ArrowRight");
  await expect(tabs.nth(1)).toBeFocused();
  await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
  const selected = root.locator("[data-gallery-group]").nth(1);
  await expect(selected.locator("[data-service-carousel]")).toHaveAttribute(
    "data-carousel-running",
    "false",
  );
  await page.keyboard.press("Home");
  await expect(tabs.first()).toBeFocused();
  await expect(tabs.first()).toHaveAttribute("aria-selected", "true");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await tabs.nth(1).click();
  await expect(selected.locator("[data-service-carousel]")).toHaveAttribute(
    "data-carousel-running",
    "false",
  );
  const context = await browser.newContext({ javaScriptEnabled: false }),
    nojs = await context.newPage();
  await nojs.goto(
    (process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4211") +
      "/service-areas/arizona/southern-arizona/",
  );
  await expect(nojs.locator("[data-product-tabs]")).toBeHidden();
  await expect(nojs.locator("[data-gallery-group]:visible")).toHaveCount(2);
  await context.close();
  expect(evidence.consoleErrors).toEqual([]);
  expect(evidence.networkErrors).toEqual([]);
});
