import { test, expect, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { stateGuides } from "../../src/stateGuides";
import { stateRentalHeadline } from "../../src/rentalHeadlines";
import { resolveLocationGallery } from "../../src/locationCarouselImages";

test.describe.configure({ mode: "serial" });
const evidence: any = {
  createdAt: new Date().toISOString(),
  modals: [],
  checks: [],
  consoleErrors: [],
  failedRequests: [],
  externalRequests: [],
};
const folder = "work/qa/service-area-images";
const states = Object.keys(stateGuides).sort();
const auditOrigin = new URL(
  process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4197",
).origin;
test.beforeAll(() => {
  fs.mkdirSync(folder, { recursive: true });
  const build = process.env.SERVICE_AREA_AUDIT_DIST || "dist";
  evidence.buildFingerprint = createHash("sha256")
    .update(fs.readFileSync(path.join(build, "service-areas/index.html")))
    .update(fs.readFileSync("public/service-hero-carousel.js"))
    .update(fs.readFileSync("content/verified-equipment-images.json"))
    .digest("hex");
});
test.beforeEach(async ({ page }) => {
  page.on("pageerror", (error) => evidence.consoleErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") evidence.consoleErrors.push(message.text());
  });
  page.on("requestfailed", (request) => {
    const error = request.failure()?.errorText || "Unknown network failure";
    if (error.includes("ERR_ABORTED")) return;
    const row = { url: request.url(), error };
    if (new URL(request.url()).origin === auditOrigin)
      evidence.failedRequests.push(row);
    else evidence.externalRequests.push(row);
  });
  page.on("response", (response) => {
    if (
      response.status() >= 400 &&
      new URL(response.url()).origin === auditOrigin
    )
      evidence.failedRequests.push({
        url: response.url(),
        status: response.status(),
      });
  });
  page.on("request", (request) => {
    if (request.method() === "POST" && request.url().includes("/api/contact"))
      evidence.failedRequests.push({ error: "Unexpected inquiry submission" });
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

async function assertState(page: Page, state: string, kind: string) {
  const title = stateRentalHeadline(state),
    expected = resolveLocationGallery(title);
  const dialog = page.locator("#state-services-dialog");
  const gallery = dialog.locator("[data-location-gallery]");
  await expect(dialog).toBeVisible();
  await expect(dialog.locator("[data-state-headline]")).toHaveText(title);
  await expect(gallery).toHaveAttribute("data-gallery-title", title);
  await expect(gallery).toHaveAttribute(
    "data-equipment-family",
    expected.family,
  );
  await expect(gallery).toHaveAttribute(
    "data-equipment-model",
    expected.modelId || "",
  );
  const ids = await gallery
    .locator("[data-carousel-slide]")
    .evaluateAll((nodes) =>
      nodes.map((n) => (n as HTMLElement).dataset.imageReviewId),
    );
  expect(ids).toEqual(expected.images.map((i) => i.reviewId));
  if (expected.images.length) {
    await expect(gallery.locator("[data-gallery-group]")).toHaveCount(
      expected.groups.length,
    );
    for (let index = 0; index < expected.groups.length; index++) {
      const wanted = expected.groups[index];
      const group = gallery.locator("[data-gallery-group]").nth(index);
      const carousel = group.locator("[data-service-carousel]");
      await expect(group).toHaveAttribute("data-group-family", wanted.family);
      await expect(group).toHaveAttribute("data-group-model", wanted.modelId!);
      await expect(carousel).toHaveAttribute("data-carousel-ready", "true");
      await expect(carousel).toHaveAttribute("data-carousel-index", "0");
      if (expected.context)
        await expect(group.locator("h3")).toHaveText(wanted.headline);
      for (let position = 0; position < wanted.images.length; position++) {
        const image = group.locator("[data-carousel-slide] img").nth(position);
        await expect(image).toHaveAttribute("src", wanted.images[position].src);
        await expect(image).toHaveAttribute(
          "data-carousel-full-src",
          wanted.images[position].fullSrc,
        );
        expect(
          await image.evaluate(async (el: HTMLImageElement) => {
            el.loading = "eager";
            await el.decode();
            return el.naturalWidth > 0;
          }),
        ).toBe(true);
      }
      if (wanted.images.length > 1) {
        await carousel.locator("[data-carousel-next]").click();
        await expect(carousel).toHaveAttribute("data-carousel-index", "1");
      }
    }
  } else {
    await expect(
      gallery.locator("[data-verified-photo-pending]"),
    ).toBeVisible();
    await expect(gallery.locator("img")).toHaveCount(0);
  }
  evidence.modals.push({
    kind,
    state,
    exactTitle: title,
    family: expected.family,
    reviewIds: ids,
    result: "PASS",
    errors: [],
  });
  await dialog.locator("[data-close-state]").click();
  await expect(dialog).not.toBeVisible();
  await expect(dialog.locator("img")).toHaveCount(0);
}

test("all 50 full-map state modals: exact title, loaded images, reset and cleanup", async ({
  page,
}) => {
  test.setTimeout(180000);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/service-areas/");
  expect(
    await page.locator("template[data-state-gallery-template]").count(),
  ).toBe(50);
  for (const state of states) {
    const control = page.locator('[data-state="' + state + '"]').first();
    await control.focus();
    await control.press("Enter");
    await assertState(page, state, "full-map");
  }
  // Reopening a previously advanced gallery starts at its first approved image.
  await page.locator('[data-state="California"]').first().focus();
  await page.locator('[data-state="California"]').first().press("Enter");
  await expect(
    page.locator("#state-services-dialog [data-service-carousel]"),
  ).toHaveAttribute("data-carousel-index", "0");
  await page
    .locator("#state-services-dialog [data-location-gallery]")
    .scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await page.screenshot({
    path: folder + "/desktop-state-gallery.png",
    fullPage: false,
  });
  await page.locator("#state-services-dialog [data-close-state]").click();
});

test("all 50 compact homepage modals use the same mapping on mobile", async ({
  page,
}) => {
  test.setTimeout(180000);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  for (const state of [...states].reverse()) {
    await page.locator("[data-state-picker]").selectOption(state);
    await assertState(page, state, "compact-map");
  }
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    ),
  ).toBeLessThanOrEqual(1);
});

test("state switching clears mismatched and missing galleries, including while already open", async ({
  page,
}) => {
  await page.goto("/service-areas/");
  for (const state of [
    "California",
    "Alabama",
    "Texas",
    "Colorado",
    "California",
  ]) {
    await page
      .locator('[data-state="' + state + '"]')
      .first()
      .dispatchEvent("click");
    const gallery = page.locator(
      "#state-services-dialog [data-location-gallery]",
    );
    const expected = resolveLocationGallery(stateRentalHeadline(state));
    await expect(gallery).toHaveAttribute(
      "data-equipment-family",
      expected.family,
    );
    expect(
      await gallery
        .locator("[data-carousel-slide]")
        .evaluateAll((nodes) =>
          nodes.map((n) => (n as HTMLElement).dataset.imageReviewId),
        ),
    ).toEqual(expected.images.map((i) => i.reviewId));
    if (expected.images.length) {
      for (const carousel of await gallery
        .locator("[data-service-carousel]")
        .all())
        await expect(carousel).toHaveAttribute("data-carousel-index", "0");
    } else await expect(gallery.locator("img")).toHaveCount(0);
  }
});

test("centered uncropped lightbox works above a state dialog with keyboard and outside close", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/service-areas/");
  await page.locator("[data-expand-map]").click();
  const expandedState = page
    .locator('.map-dialog [data-state="California"]')
    .first();
  await expandedState.focus();
  await expandedState.press("Enter");
  await expect(page.locator(".map-dialog")).toBeVisible();
  const gallery = page.locator(
    "#state-services-dialog [data-service-carousel]",
  );
  await gallery
    .locator('[data-carousel-slide][data-active="true"] [data-carousel-zoom]')
    .click();
  const box = page.locator("dialog.service-image-lightbox");
  await expect(box).toBeVisible();
  await expect(page.locator("#state-services-dialog")).toBeVisible();
  const image = box.locator("[data-lightbox-image]");
  await image.evaluate(async (el: HTMLImageElement) => el.decode());
  expect(await image.evaluate((el) => getComputedStyle(el).objectFit)).toBe(
    "contain",
  );
  await expect(image).toHaveAttribute(
    "src",
    resolveLocationGallery(stateRentalHeadline("California")).images[0].fullSrc,
  );
  await expect(gallery).toHaveAttribute("data-carousel-running", "false");
  await box.locator("[data-lightbox-next]").click();
  await expect(box.locator("[data-lightbox-position]")).toHaveText("2 of 5");
  await page.keyboard.press("ArrowRight");
  await expect(box.locator("[data-lightbox-position]")).toHaveText("3 of 5");
  await page.keyboard.press("ArrowLeft");
  await page.keyboard.press("Home");
  await expect(box.locator("[data-lightbox-position]")).toHaveText("1 of 5");
  for (let i = 0; i < 7; i++) {
    await page.keyboard.press("Tab");
    expect(
      await box.evaluate((el) => el.contains(document.activeElement)),
    ).toBe(true);
  }
  const bounds = await box
    .locator(".service-image-lightbox-dialog")
    .boundingBox();
  expect(Math.abs(bounds!.x + bounds!.width / 2 - 720)).toBeLessThan(2);
  expect(Math.abs(bounds!.y + bounds!.height / 2 - 500)).toBeLessThan(2);
  await page.screenshot({ path: folder + "/desktop-lightbox.png" });
  await page.keyboard.press("Escape");
  await expect(box).not.toBeVisible();
  await expect(page.locator("#state-services-dialog")).toBeVisible();
  await gallery
    .locator('[data-carousel-slide][data-active="true"] [data-carousel-zoom]')
    .click();
  await page.mouse.click(2, 2);
  await expect(box).not.toBeVisible();
  await gallery
    .locator('[data-carousel-slide][data-active="true"] [data-carousel-zoom]')
    .click();
  await box.locator("[data-lightbox-close]").click();
  await expect(box).not.toBeVisible();
});

test("mobile lightbox, thumbnails, autoplay interaction pause and reduced motion", async ({
  page,
}) => {
  test.setTimeout(90000);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/service-areas/");
  await page.locator("[data-state-picker]").selectOption("Alabama");
  const gallery = page.locator(
    "#state-services-dialog [data-service-carousel]",
  );
  await gallery.scrollIntoViewIfNeeded();
  await expect(gallery.locator("[data-carousel-caption]")).toHaveCSS(
    "position",
    "static",
  );
  await gallery.locator('[data-carousel-select="2"]').click();
  await expect(gallery).toHaveAttribute("data-carousel-index", "2");
  await gallery
    .locator('[data-carousel-slide][data-active="true"] [data-carousel-zoom]')
    .click();
  const box = page.locator("dialog.service-image-lightbox");
  await expect(box).toBeVisible();
  const image = box.locator("[data-lightbox-image]");
  await image.evaluate(async (el: HTMLImageElement) => el.decode());
  expect(await image.evaluate((el) => getComputedStyle(el).objectFit)).toBe(
    "contain",
  );
  const bounds = await box
    .locator(".service-image-lightbox-dialog")
    .boundingBox();
  expect(bounds!.x).toBeGreaterThanOrEqual(0);
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(391);
  await page.screenshot({ path: folder + "/mobile-lightbox.png" });
  await box.locator("[data-lightbox-previous]").click();
  await box.locator("[data-lightbox-close]").click();
  // Accelerate only this test instance; production markup retains its 5.5s interval.
  await gallery.evaluate((el) => {
    el.dispatchEvent(new Event("service-carousel:destroy", { bubbles: true }));
    (el as HTMLElement).dataset.carouselInterval = "180";
    el.dispatchEvent(new Event("service-carousel:mount", { bubbles: true }));
    (document.activeElement as HTMLElement)?.blur();
  });
  await page.mouse.move(0, 0);
  await expect
    .poll(async () => gallery.getAttribute("data-carousel-index"), {
      timeout: 4000,
    })
    .not.toBe("0");
  await gallery.locator("[data-carousel-next]").click();
  const paused = await gallery.getAttribute("data-carousel-index");
  await page.mouse.move(0, 0);
  await page.waitForTimeout(500);
  await expect(gallery).toHaveAttribute("data-carousel-index", paused!);
  await expect(gallery).toHaveAttribute("data-carousel-running", "false");
  await gallery.locator("[data-carousel-toggle]").click();
  await gallery.evaluate(() => {
    (document.activeElement as HTMLElement)?.blur();
  });
  await page.mouse.move(0, 0);
  await expect(gallery).toHaveAttribute("data-carousel-running", "true");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(gallery).toHaveAttribute("data-carousel-running", "false");
  await expect(gallery.locator("[data-carousel-toggle]")).toBeDisabled();
  const reducedIndex = await gallery.getAttribute("data-carousel-index");
  await page.waitForTimeout(500);
  await expect(gallery).toHaveAttribute("data-carousel-index", reducedIndex!);
  await gallery.locator("[data-carousel-next]").click();
  await expect(gallery).not.toHaveAttribute(
    "data-carousel-index",
    reducedIndex!,
  );
});

test("representative dedicated state, region, city and directory layouts are contained and correctly mapped", async ({
  page,
}) => {
  test.setTimeout(120000);
  const registry = JSON.parse(
    fs.readFileSync(
      path.join(
        process.env.SERVICE_AREA_AUDIT_DIST || "dist",
        "../audit/build-registry.json",
      ),
      "utf8",
    ),
  );
  const region = registry.pages.find((r: any) =>
    /^\/service-areas\/alabama\/[^/]+\/$/.test(r.path),
  ).path;
  const routes = [
    "/service-areas/alabama/",
    "/service-areas/california/",
    "/service-areas/texas/",
    region,
    region + "cities/",
    "/service-areas/washington/olympic-peninsula/port-angeles/",
  ];
  for (const width of [1440, 390])
    for (const route of routes) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(route);
      const h1 = await page.locator("main h1").innerText();
      if (route.endsWith("/cities/")) {
        await expect(page.locator("main [data-location-gallery]")).toHaveCount(0);
        await expect(page.locator("main [data-verified-photo-pending]")).toHaveCount(0);
        continue;
      }
      const gallery = page.locator("main [data-location-gallery]").first();
      await expect(gallery).toHaveAttribute("data-gallery-title", h1);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth - window.innerWidth,
        ),
      ).toBeLessThanOrEqual(1);
      const images = gallery.locator("[data-carousel-slide] img");
      if (await images.count())
        expect(
          await images.first().evaluate(async (el: HTMLImageElement) => {
            await el.decode();
            return el.naturalWidth > 0;
          }),
        ).toBe(true);
      else
        await expect(
          gallery.locator("[data-verified-photo-pending]"),
        ).toBeVisible();
    }
  await page.screenshot({
    path: folder + "/mobile-dedicated-page.png",
    fullPage: false,
  });
});

test("no browser exceptions, unexpected inquiry sends or failed same-origin assets", () => {
  expect(evidence.consoleErrors).toEqual([]);
  expect(evidence.failedRequests).toEqual([]);
});
