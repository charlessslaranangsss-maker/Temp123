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
    await expect(supportBar.locator("a")).toHaveCSS(
      "color",
      "rgb(179, 13, 27)",
    );
    await expect(page.locator(".utility-status i")).toHaveCSS(
      "background-color",
      "rgb(47, 212, 119)",
    );
    expect(
      await page
        .locator(".utility-status i")
        .evaluate(
          (element) => getComputedStyle(element, "::after").animationName,
        ),
    ).toBe("live-status-blink");
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
    await expect(phone.locator("strong")).toHaveCSS(
      "color",
      "rgb(179, 13, 27)",
    );
    await expect(phone.locator("strong")).toHaveText("+1 (800) 443 - 5212");
    const displayedPhoneNumbers = await page
      .locator('a[href="tel:+18004435212"]')
      .allTextContents();
    for (const text of displayedPhoneNumbers)
      expect(text.replace(/\s+/g, " ")).toContain("+1 (800) 443 - 5212");
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
  await page.locator(".mobile-nav > summary").focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toBeVisible();
  await page.locator(".mobile-services > summary").click();
  const kitchenCategory = page.locator(".mobile-service-category").first();
  await kitchenCategory.locator("> summary").click();
  await expect(
    kitchenCategory.getByRole("link", { name: "24ft Mobile Kitchen Trailer" }),
  ).toBeVisible();
  await page.screenshot({ path: "test-results/services-menu-mobile.png" });
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).not.toBeVisible();
});

test("desktop services menu exposes clear rental categories", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  const trigger = page.locator(".services-trigger");
  await expect(trigger).toContainText("Services");
  await trigger.click();
  const menu = page.getByRole("group", { name: "Services menu" });
  await expect(menu).toBeVisible();
  await expect(menu.locator(".service-category")).toHaveCount(9);
  await expect(
    menu.getByRole("button", { name: "Restroom Trailers", exact: true }),
  ).toHaveAttribute("href", "/equipment-rental/restroom-trailers/");
  await menu
    .getByRole("button", { name: "Restroom Trailers", exact: true })
    .click();
  await expect(
    menu.getByRole("link", { name: "30ft Restroom Trailer" }),
  ).toBeVisible();
  await expect(
    menu.getByRole("button", {
      name: "Mobile Sleeper Trailers and Containers",
      exact: true,
    }),
  ).toBeVisible();
  await page.screenshot({ path: "test-results/services-menu-desktop.png" });
});

test("every service model in the desktop menu resolves locally", async ({
  page,
  request,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  await page.locator(".services-trigger").focus();
  const hrefs = await page
    .locator(".service-category-link, .service-submenu-links a")
    .evaluateAll((links) => [
      ...new Set(
        links.map((link) => link.getAttribute("href")).filter(Boolean),
      ),
    ]);
  expect(hrefs.length).toBeGreaterThan(30);
  for (const href of hrefs) {
    const response = await request.get(href as string);
    expect(response.status(), href as string).toBe(200);
  }
});

test("service model pages provide unique planning content", async ({
  page,
}) => {
  await page.goto("/services/shower-restroom-combination-trailers/20ft/");
  await expect(page.locator("h1")).toHaveText(
    "20ft Restroom and Shower Trailer",
  );
  await expect(page).toHaveTitle(
    "20ft Restroom and Shower Trailer Rental | Temporary 123",
  );
  await expect(page.getByText("PLAN BEFORE DELIVERY")).toBeVisible();
});

for (const width of [390, 1440])
  test(`location hero presents nationwide coverage at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/service-areas/");
    await expect(page.locator(".location-hero h1")).toContainText(
      "across the USA",
    );
    await expect(
      page.locator(".coverage-map-stage .map-land path"),
    ).toHaveCount(50);
    await expect(page.locator(".coverage-map")).toContainText("50 states");
    await expect(page.locator("#catalog-search")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: `test-results/location-coverage-${width}.png`,
      fullPage: false,
    });
  });

test("desktop navigation follows the requested order", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(
    page.locator(
      ".header > nav > a, .header > nav > .services-nav > .services-trigger",
    ),
  ).toHaveText([
    "Home",
    "Services ⌄",
    "Location",
    "About Us",
    "Blog",
    "Contact Us",
  ]);
});

test("Contact Us opens an in-page project drawer", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  const trigger = page.locator('.header > nav a[href="/contact-us/"]');
  await trigger.click();
  await expect(page).toHaveURL(/\/$/);
  const drawer = page.getByRole("dialog", { name: "Contact Us" });
  await expect(drawer).toBeVisible();
  await expect(drawer.locator('input[name="name"]')).toBeVisible();
  await expect(drawer.locator('input[name="startDate"]')).toBeVisible();
  await expect(drawer.locator('select[name="service"]')).toBeVisible();
  await page.waitForTimeout(350);
  await page.screenshot({ path: "test-results/contact-drawer-desktop.png" });
  await drawer.getByRole("button", { name: "Close contact form" }).click();
  await expect(drawer).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test("mobile Contact Us tab opens the drawer without navigating", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/equipment-rental/");
  await page.locator(".contact-rail").click();
  await expect(page).toHaveURL(/\/equipment-rental\/$/);
  const drawer = page.getByRole("dialog", { name: "Contact Us" });
  await expect(drawer).toBeVisible();
  await expect(drawer.getByRole("link", { name: /Call:/ })).toContainText(
    "+1 (800) 443 - 5212",
  );
  expect(
    await drawer.evaluate(
      (element) => element.scrollWidth <= document.documentElement.clientWidth,
    ),
  ).toBe(true);
  await page.waitForTimeout(350);
  await page.screenshot({ path: "test-results/contact-drawer-mobile.png" });
  await page.keyboard.press("Escape");
  await expect(drawer).not.toBeVisible();
});

test("equipment quick view contains focus and restores its trigger", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const trigger = page.getByRole("button", {
    name: "Quick view: Mobile Kitchen Trailers",
    exact: true,
  });
  await trigger.click();
  const dialog = page.getByRole("dialog", {
    name: "Mobile Kitchen Trailers",
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

test("homepage shows all eight requested service cards", async ({ page }) => {
  await page.goto("/");
  const cards = page.locator(".equipment-card");
  await expect(cards).toHaveCount(8);
  await expect(cards.locator("h3")).toHaveText([
    "Mobile Kitchen Trailers",
    "Dishwashing Trailers",
    "Refrigeration Trailers",
    "Handwashing Trailers",
    "Mobile Sleeper Trailer and Container",
    "Restroom Trailers",
    "Shower Trailers",
    "Laundry Trailers",
  ]);
  await expect(
    cards.getByRole("link", {
      name: "Shower and Restroom Combination Trailers",
    }),
  ).toBeVisible();
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
      "/blog/",
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
  await expect(page.locator(".catalog-list a")).toHaveCount(558);
  await expect(page.getByRole("link", { name: "About Us" })).toHaveCount(1);
  await expect(page.locator(".catalog-list").getByText("About Us")).toHaveCount(
    0,
  );
  await expect(page.locator(".catalog-list").getByText("Blog")).toHaveCount(0);
  await expect(
    page.locator(".catalog-list").getByText("Equipment Rental"),
  ).toHaveCount(0);
  await page.getByRole("searchbox").fill("kitchen");
  await expect(page.getByRole("status")).toContainText("matching pages");
  const visible = page.locator(".catalog-list a:visible");
  expect(await visible.count()).toBeGreaterThan(0);
  for (const label of await visible.allTextContents())
    expect(label.toLowerCase()).toContain("kitchen");
});
test("About Us and Blog provide dedicated search-focused content", async ({
  page,
}) => {
  await page.goto("/about-us/");
  await expect(page.locator("h1")).toContainText("Temporary facilities");
  await expect(page.locator(".about-service-grid article")).toHaveCount(4);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    /mobile kitchens.*workforce housing/i,
  );
  await page.goto("/blog/");
  await expect(page.locator("h1")).toContainText("Field notes");
  await expect(page.locator(".blog-grid article")).toHaveCount(3);
  await expect(page.locator(".blog-grid")).toContainText(
    "mobile kitchen trailer rental",
  );
});
test("Services keeps recovered service resources organized and reachable", async ({
  page,
}) => {
  await page.goto("/services/");
  const library = page.locator(".service-library");
  await expect(library).toBeVisible();
  await library.locator("summary").click();
  await expect(library.locator(".service-library-links a")).toHaveCount(44);
  await expect(library).toContainText("Base Camps for Rent");
});
test("contact keeps the phone fallback while online intake is disabled", async ({
  page,
}) => {
  await page.goto("/contact-us/");
  await expect(
    page
      .getByRole("link", {
        name: "Call +1 (800) 443 - 5212",
        exact: false,
      })
      .first(),
  ).toHaveAttribute("href", "tel:+18004435212");
  await expect(page.locator("#contact-drawer form")).toHaveCount(1);
  await expect(
    page.locator('#contact-drawer button[type="submit"]'),
  ).toBeDisabled();
  await expect(page.locator("#contact-drawer")).not.toBeVisible();
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
