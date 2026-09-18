import { expect, test } from "@playwright/test";
import fs from "node:fs";
const folder = "work/qa/owner-image-rollout";
test.beforeAll(() => fs.mkdirSync(folder, {recursive:true}));
test("labelled broad options remain separate on desktop/mobile and inside the state dialog", async ({ page }) => {
  test.setTimeout(120000);
  await page.emulateMedia({reducedMotion:"reduce"});
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  for (const width of [1440, 390]) {
    await page.setViewportSize({width,height:900});
    for (const route of ["/service-areas/", "/service-areas/texas/", "/service-areas/alabama/central-alabama/", "/service-areas/alabama/central-alabama/cities/"]) {
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      if (route === "/service-areas/" || route.endsWith("/cities/")) {
        await expect(page.locator("main [data-location-gallery]")).toHaveCount(0);
        await expect(page.locator("main [data-verified-photo-pending]")).toHaveCount(0);
        continue;
      }
      const gallery = page.locator("main [data-location-gallery]").first();
      await expect(gallery).toHaveAttribute("data-gallery-presentation", "separate-options");
      for (const group of await gallery.locator("[data-gallery-group]").all()) {
        await group.scrollIntoViewIfNeeded();
        await expect(group.locator("h3")).toBeVisible();
        const carousel = group.locator("[data-service-carousel]");
        const models = await carousel.locator("[data-carousel-slide]").evaluateAll(nodes => nodes.map(n => n.getAttribute("data-image-model")));
        expect(new Set(models).size).toBe(1);
        await carousel.locator('[data-active="true"] [data-carousel-zoom]').click();
        const box = page.locator("dialog.service-image-lightbox");
        await expect(box).toBeVisible();
        await expect(box.locator("[data-lightbox-image]")).toHaveCSS("object-fit", "contain");
        await page.keyboard.press("Escape");
        await expect(box).not.toBeVisible();
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth-window.innerWidth)).toBeLessThanOrEqual(1);
      if (route.endsWith("central-alabama/")) await page.screenshot({path:folder+"/laundry-options-"+width+".png",fullPage:false});
    }
    await page.goto("/service-areas/");
    await page.locator("[data-state-picker]").selectOption("Texas");
    const dialog = page.locator("#state-services-dialog");
    await expect(dialog.locator("[data-gallery-group]")).toHaveCount(3);
    const ids = await page.locator(".service-carousel-viewport").evaluateAll(nodes => nodes.map(n=>n.id));
    expect(new Set(ids).size).toBe(ids.length);
    const last = dialog.locator("[data-gallery-group]").last();
    await last.scrollIntoViewIfNeeded();
    await last.locator('[data-active="true"] [data-carousel-zoom]').click();
    const box = page.locator("dialog.service-image-lightbox");
    await expect(box).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeVisible();
    await dialog.locator("[data-close-state]").click();
    await expect(dialog.locator("img")).toHaveCount(0);
  }
  expect(errors).toEqual([]);
});

test("new named references appear on their matching service pages without changing specifications", async ({ page }) => {
  await page.emulateMedia({reducedMotion:"reduce"});
  for (const [route, ids] of [
    ["/services/laundry-trailers/30ft/", ["08.01"]],
    ["/services/mobile-sleeper-trailers/20ft-contractor/", ["22.01","22.04"]],
    ["/services/mobile-sleeper-trailers/20ft-vip/", ["23.07"]],
    ["/equipment-rental/refrigerated-containers/", ["catalog-reefer"]],
  ] as const) {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    const carousel = page.locator("main [data-service-carousel]").first();
    await expect(carousel).toBeVisible();
    expect(await carousel.locator("[data-carousel-slide]").evaluateAll(nodes => nodes.map(n=>n.getAttribute("data-image-review-id")))).toEqual([...ids]);
    expect(await carousel.locator("[data-carousel-slide] img").first().evaluate(async (el:HTMLImageElement)=>{await el.decode();return el.naturalWidth>0;})).toBe(true);
  }
});

test("generic ADA catalogue reference remains disclosed on specific ADA variants", async ({ page }) => {
  await page.goto("/service-areas/alaska/");
  await expect(page.locator('[data-image-review-id="catalog-restroom"]')).toBeVisible();
  await expect(page.locator("[data-carousel-caption]").first()).toContainText("catalogue shows a combined unit");
  for (const [route, layout] of [["/services/shower-restroom-combination-trailers/3-stall-1-ada/", "three-stall-plus-one-ADA"], ["/services/shower-restroom-combination-trailers/8-stall-1-ada/", "eight-stall-plus-one-ADA"]] as const) {
    await page.goto(route);
    const carousel = page.locator("main [data-service-carousel]").first();
    await expect(carousel).toBeVisible();
    await expect(page.locator(".service-hero-unverified")).toHaveCount(0);
    await expect(carousel.locator("[data-carousel-caption]").first()).toContainText("do not establish");
    await expect(carousel.locator("[data-carousel-caption]").first()).toContainText(layout);
    await expect(carousel.locator('[data-image-review-id="catalog-restroom"]')).toHaveCount(1);
  }
});
