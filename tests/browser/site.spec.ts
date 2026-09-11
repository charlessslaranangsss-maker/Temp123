import { test, expect } from "@playwright/test";
for (const width of [320, 390, 768, 1280])
  test(`homepage layout and photos at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("Keep your");
    await expect(page).toHaveTitle(/Temporary 123/);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    expect(
      await page
        .locator(".hero-visual img")
        .evaluate((i: HTMLImageElement) => i.complete && i.naturalWidth > 0),
    ).toBe(true);
    await page.screenshot({
      path: `test-results/temporary123-${width}.png`,
      fullPage: true,
    });
  });
test("mobile menu supports keyboard and Escape", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.locator(".mobile-nav summary").focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).not.toBeVisible();
});
test("reduced motion removes entry animations", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  expect(
    await page
      .locator(".hero-copy")
      .evaluate((e) => getComputedStyle(e).animationName),
  ).toBe("none");
});
test("catalog filters recovered locations without loading React", async ({
  page,
}) => {
  await page.goto("/service-areas/");
  await page.getByRole("searchbox").fill("kitchen");
  await expect(page.getByRole("status")).toContainText("matching pages");
  const visible = page.locator(".catalog-list a:visible");
  expect(await visible.count()).toBeGreaterThan(0);
  for (const label of await visible.allTextContents())
    expect(label.toLowerCase()).toContain("kitchen");
});
test("contact provides a working phone action while online intake is disabled", async ({
  page,
}) => {
  await page.goto("/contact-us/");
  await expect(
    page
      .getByRole("link", { name: "Call (800) 443-5212", exact: false })
      .first(),
  ).toHaveAttribute("href", "tel:+18004435212");
  await expect(page.locator("form")).toHaveCount(0);
});
test("initial HTML and unknown-route status work without JavaScript", async ({
  request,
}) => {
  const home = await request.get("/");
  expect(home.status()).toBe(200);
  const html = await home.text();
  expect(html).toContain("Keep your");
  expect(html).not.toContain("April");
  const missing = await request.get("/missing-synthetic-test-page/");
  expect(missing.status()).toBe(404);
});
