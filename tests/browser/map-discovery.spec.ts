import { test, expect } from "@playwright/test";

for (const width of [390, 1440]) {
  test(`both maps and homepage preview at ${width}`, async ({
    page,
    browser,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ["/", "/service-areas/"]) {
      await page.goto(route);
      await expect(
        page.locator(".coverage-map-stage [data-state]"),
      ).toHaveCount(50);
      await expect(page.locator(".map-location-state")).toHaveCount(50);
      await expect(page.locator("[data-directory-city]")).toHaveCount(5);
      await page.locator("[data-state-picker]").selectOption("Texas");
      const dialog = page.locator("#state-services-dialog");
      await expect(dialog).toBeVisible();
      await expect(dialog.locator("[data-state-page]")).toHaveAttribute(
        "href",
        "/service-areas/texas/",
      );
      if (route === "/") {
        await expect(dialog.locator(".state-dialog-seasonal")).toHaveCount(0);
        await dialog.screenshot({
          path: `test-results/home-map-preview-${width}.png`,
        });
      } else
        await expect(dialog.locator(".state-dialog-seasonal")).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(dialog).not.toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
    const context = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width, height: 900 },
    });
    const plain = await context.newPage();
    for (const route of ["/", "/service-areas/"]) {
      await plain.goto(new URL(route, page.url()).href);
      await expect(plain.locator(".map-location-state")).toHaveCount(50);
      await plain
        .getByText("Regions and cities in Washington", { exact: true })
        .click();
      await expect(
        plain.locator("[data-directory-city]").first(),
      ).toBeVisible();
      await plain.locator("[data-directory-city]").first().click();
      await expect(plain.locator("h1")).toContainText("Washington");
    }
    await context.close();
  });
}
