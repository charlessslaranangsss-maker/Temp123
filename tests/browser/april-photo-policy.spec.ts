import { test, expect } from "@playwright/test";

test("20ft trailer uses every approved Drive photo in order and opens full images", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/20ft-refrigeration-trailers/");
  const gallery = page.locator("main [data-service-carousel]");
  await expect(gallery).toHaveCount(1);
  const ids = await gallery
    .locator("[data-carousel-slide]")
    .evaluateAll((nodes) =>
      nodes.map((n) => (n as HTMLElement).dataset.imageReviewId),
    );
  expect(ids).toEqual(["19.02", "19.05", "19.01", "19.03", "19.04"]);
  for (let i = 0; i < ids.length; i++) {
    await gallery.locator('[data-carousel-select="' + i + '"]').click();
    const image = gallery.locator(
      '[data-carousel-slide][data-active="true"] img',
    );
    expect(
      await image.evaluate(async (el: HTMLImageElement) => {
        await el.decode();
        return el.naturalWidth > 0;
      }),
    ).toBe(true);
    const full = await image.getAttribute("data-carousel-full-src");
    await gallery
      .locator('[data-carousel-slide][data-active="true"] [data-carousel-zoom]')
      .click();
    const box = page.locator("dialog.service-image-lightbox");
    await expect(box.locator("[data-lightbox-image]")).toHaveAttribute(
      "src",
      full!,
    );
    await expect(box.locator("[data-lightbox-image]")).toHaveCSS(
      "object-fit",
      "contain",
    );
    await page.keyboard.press("Escape");
    await expect(box).not.toBeVisible();
  }
});

test("20ft container is inside-only on existing hub, with no invented standalone route", async ({
  page,
}) => {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(
      "/equipment-rental/refrigeration/#20ft-refrigerated-container",
    );
    const section = page.locator('[id="20ft-refrigerated-container"]');
    await expect(
      section.getByRole("heading", {
        name: "20 ft Refrigerated Container",
        exact: true,
      }),
    ).toBeVisible();
    const gallery = section.locator("[data-location-gallery]");
    await expect(gallery).toHaveAttribute(
      "data-photo-coverage",
      "interior-only",
    );
    await expect(gallery.locator("[data-carousel-slide]")).toHaveCount(1);
    await expect(gallery.locator('[data-image-view="exterior"]')).toHaveCount(
      0,
    );
    await expect(gallery.locator("[data-verified-photo-pending]")).toHaveCount(
      0,
    );
    await expect(gallery.locator("[data-carousel-next]")).toHaveCount(0);
    await gallery.locator("[data-carousel-zoom]").click();
    const box = page.locator("dialog.service-image-lightbox");
    await expect(box).toBeVisible();
    expect(
      await box
        .locator("[data-lightbox-image]")
        .evaluate(async (el: HTMLImageElement) => {
          await el.decode();
          return el.naturalWidth > 0;
        }),
    ).toBe(true);
    await page.keyboard.press("Escape");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      ),
    ).toBeLessThanOrEqual(1);
    await expect(page.locator("main h1")).toHaveCount(1);
  }
});

test("existing sleeper location page uses the approved two-stall interior set only", async ({
  page,
}) => {
  await page.goto("/service-areas/washington/puget-sound/tacoma/");
  const gallery = page.locator("main [data-location-gallery]").first();
  await expect(gallery).toHaveAttribute(
    "data-equipment-model",
    "april-two-stall-sleeper",
  );
  await expect(gallery).toHaveAttribute("data-photo-coverage", "interior-only");
  await expect(gallery.locator("[data-carousel-slide]")).toHaveCount(2);
  await expect(gallery.locator('[data-image-view="exterior"]')).toHaveCount(0);
  await expect(gallery).toContainText("two-stall sleeper option");
});
