import { test, expect } from "@playwright/test";
for (const width of [320, 390, 768, 1024, 1280, 1440])
  test(`homepage layout and photos at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("Keep your");
    await expect(page).toHaveTitle(/Temporary 123/);
    await expect(page.locator(".brand")).toContainText("Temporary123");
    const supportBar = page.locator(".utility");
    await expect(supportBar).toBeVisible();
    await expect(supportBar).toContainText("Live agents available 24/7");
    await expect(supportBar.locator("a")).toHaveAttribute(
      "href",
      "tel:+18004435212",
    );
    const contactRail = page.locator(".contact-rail");
    await expect(contactRail).toBeVisible();
    await expect(contactRail).toHaveAttribute("href", "/contact-us/");
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const phone = page.locator(
      width < 1024 ? ".mobile-call" : ".header-contact",
    );
    await expect(phone).toHaveAttribute("href", "tel:+18004435212");
    await expect(phone).toBeInViewport({ ratio: 1 });
    await page.locator(".faq-section").scrollIntoViewIfNeeded();
    await expect(phone).toBeInViewport({ ratio: 1 });
    for (const photo of await page.locator(".image-box img").all()) {
      await photo.scrollIntoViewIfNeeded();
      await expect(photo).toHaveJSProperty("complete", true);
      expect(
        await photo.evaluate((i: HTMLImageElement) => i.naturalWidth),
      ).toBeGreaterThan(0);
    }
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
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

test("equipment quick view contains focus and restores its trigger", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const trigger = page.getByRole("button", {
    name: "Quick view: Mobile kitchens",
    exact: true,
  });
  await trigger.click();
  const dialog = page.getByRole("dialog", {
    name: "Mobile kitchens",
    exact: true,
  });
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByRole("button", { name: "Close quick view" }),
  ).toBeFocused();
  for (let i = 0; i < 5; i++) {
    await page.keyboard.press("Tab");
    expect(
      await dialog.evaluate((e) => e.contains(document.activeElement)),
    ).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await expect(page.locator(".mobile-call")).toBeInViewport({ ratio: 1 });
  await trigger.click();
  await dialog.getByRole("button", { name: "Close quick view" }).click();
  await expect(trigger).toBeFocused();
});

test("FAQ and equipment navigation work without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto("http://localhost:4173/");
  await page.locator(".faq-item summary").first().click();
  await expect(page.locator(".faq-item p").first()).toBeVisible();
  await expect(page.locator(".quick-view:visible")).toHaveCount(0);
  await page.locator(".card-actions a").first().click();
  await expect(page).toHaveURL(/mobile-kitchen-trailers/);
  await context.close();
});

for (const width of [320, 768, 1024, 1440]) {
  test(`shared templates stay within viewport at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const path of [
      "/contact-us/",
      "/equipment-rental/",
      "/equipment-rental/mobile-kitchen-trailers/",
      "/service-areas/",
      "/planning/",
      "/about-us/",
    ]) {
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        path,
      ).toBe(true);
      await expect(page.locator("h1")).toHaveCount(1);
    }
  });
}
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
