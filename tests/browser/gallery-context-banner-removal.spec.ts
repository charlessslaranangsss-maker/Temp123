import { expect, test } from "@playwright/test";
import { resolveLocationGallery } from "../../src/locationCarouselImages";

const examples = [
  ["/service-areas/alabama/", "shower-reference"],
  ["/service-areas/alabama/central-alabama/", "laundry"],
  ["/service-areas/alabama/gulf-coast/", "kitchen-alternatives"],
  ["/service-areas/alabama/north-alabama/", "ada-reference"],
  ["/service-areas/alaska/arctic/", "sleeper-options"],
  ["/service-areas/arkansas/delta/", "man-camp"],
] as const;

test("all grouped-gallery contexts omit the review banner on desktop and mobile", async ({
  page,
}) => {
  test.setTimeout(180000);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript(() =>
    localStorage.setItem(
      "temporary123:emergency-dismissed-until-v1",
      String(Date.now() + 86400000),
    ),
  );

  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    for (const [route, context] of examples) {
      const response = await page.goto(route);
      expect(response?.status(), route).toBe(200);
      const gallery = page.locator("main [data-location-gallery]").first();
      await expect(gallery, route).toBeVisible();
      const title = (await gallery.getAttribute("data-gallery-title"))!;
      const expected = resolveLocationGallery(title);
      expect(expected.context, route).toBe(context);
      await expect(
        gallery.locator(".location-gallery-context"),
        route,
      ).toHaveCount(0);
      await expect(gallery.locator("[data-gallery-group]"), route).toHaveCount(
        expected.groups.length,
      );
      await expect(
        gallery.locator(".location-gallery-option-title"),
        route,
      ).toHaveCount(expected.groups.length);
      await expect(
        gallery.locator("[data-carousel-caption]"),
        route,
      ).toHaveCount(expected.groups.length);
      expect(
        await gallery.locator("img").count(),
        route,
      ).toBeGreaterThanOrEqual(
        expected.groups.reduce(
          (total, group) => total + group.images.length,
          0,
        ),
      );
    }
  }
  expect(errors).toEqual([]);
});
