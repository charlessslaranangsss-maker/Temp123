import { expect, test } from "@playwright/test";

const fixture = `
  <figure data-service-carousel tabindex="0" aria-roledescription="carousel">
    <div class="service-carousel-viewport">
      <div data-carousel-slide data-active="true"><button data-carousel-zoom><img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3C/svg%3E" alt="Interior" data-carousel-alt="Interior"></button></div>
      <div data-carousel-slide data-active="false" aria-hidden="true"><button data-carousel-zoom><img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3C/svg%3E" alt="" data-carousel-alt="Exterior"></button></div>
      <div data-carousel-slide data-active="false" aria-hidden="true"><button data-carousel-zoom><img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3C/svg%3E" alt="" data-carousel-alt="Detail"></button></div>
    </div>
    <button data-carousel-previous>Previous</button>
    <small data-carousel-behavior>Auto-advances.</small>
    <span class="service-carousel-status" aria-live="off"><span data-carousel-position>1</span></span>
    <button data-carousel-toggle>Pause</button>
    <button data-carousel-next>Next</button>
    <button data-carousel-select="0" aria-pressed="true">1</button>
    <button data-carousel-select="1" aria-pressed="false">2</button>
    <button data-carousel-select="2" aria-pressed="false">3</button>
  </figure>`;

test.beforeEach(async ({ page }) => {
  await page.setContent(fixture);
  await page.addStyleTag({ path: "src/service-hero-carousel.css" });
  await page.addScriptTag({ path: "public/service-hero-carousel.js" });
});

test("auto-advances and pauses while the carousel is being browsed", async ({
  page,
}) => {
  await page.locator("[data-service-carousel]").evaluate((carousel) => {
    carousel.setAttribute("data-carousel-autoplay", "true");
    carousel.setAttribute("data-carousel-interval", "120");
    delete (carousel as HTMLElement).dataset.carouselReady;
  });
  await page.addScriptTag({ path: "public/service-hero-carousel.js" });

  await expect(page.locator("[data-carousel-position]")).toHaveText("2", {
    timeout: 1000,
  });
  await page.locator("[data-service-carousel]").hover();
  const pausedPosition = await page
    .locator("[data-carousel-position]")
    .textContent();
  await page.waitForTimeout(300);
  await expect(page.locator("[data-carousel-position]")).toHaveText(
    pausedPosition || "",
  );
});

test("manual navigation persistently pauses until Play is chosen", async ({
  page,
}) => {
  await page.locator("[data-service-carousel]").evaluate((carousel) => {
    carousel.setAttribute("data-carousel-autoplay", "true");
    carousel.setAttribute("data-carousel-interval", "120");
    delete (carousel as HTMLElement).dataset.carouselReady;
  });
  await page.addScriptTag({ path: "public/service-hero-carousel.js" });

  const carousel = page.locator("[data-service-carousel]");
  await carousel.locator("[data-carousel-next]").click();
  await expect(carousel.locator("[data-carousel-toggle]")).toHaveText("Play");
  await expect(carousel.locator("[data-carousel-position]")).toHaveText("2");
  await page.waitForTimeout(350);
  await expect(carousel.locator("[data-carousel-position]")).toHaveText("2");
  await expect(carousel.locator(".service-carousel-status")).toHaveAttribute(
    "aria-live",
    "polite",
  );

  await carousel.locator("[data-carousel-toggle]").click();
  await expect(carousel.locator("[data-carousel-toggle]")).toHaveText("Pause");
  // Autoplay resumes only after pointer and keyboard interaction ends.
  await carousel.evaluate(() =>
    (document.activeElement as HTMLElement)?.blur(),
  );
  await page.mouse.move(0, 0);
  await expect(carousel.locator("[data-carousel-position]")).not.toHaveText(
    "2",
    { timeout: 1000 },
  );
});

test("disables automatic rotation for reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setContent(
    fixture.replace(
      "data-service-carousel",
      'data-service-carousel data-carousel-autoplay="true" data-carousel-interval="120"',
    ),
  );
  await page.addScriptTag({ path: "public/service-hero-carousel.js" });

  await expect(page.locator("[data-carousel-toggle]")).toBeDisabled();
  await expect(page.locator("[data-carousel-toggle]")).toHaveText("Motion off");
  await page.waitForTimeout(350);
  await expect(page.locator("[data-carousel-position]")).toHaveText("1");
});

test("supports buttons and keyboard without exposing inactive image text", async ({
  page,
}) => {
  const carousel = page.locator("[data-service-carousel]");
  await carousel.locator("[data-carousel-next]").click();
  await expect(carousel.locator("[data-carousel-position]")).toHaveText("2");
  await expect(
    carousel.locator("[data-carousel-slide]").nth(1),
  ).not.toHaveAttribute("aria-hidden");
  await expect(carousel.locator("img").nth(1)).toHaveAttribute(
    "alt",
    "Exterior",
  );
  await expect(carousel.locator("img").nth(0)).toHaveAttribute("alt", "");

  await carousel.focus();
  await page.keyboard.press("End");
  await expect(carousel.locator("[data-carousel-position]")).toHaveText("3");
  await page.keyboard.press("Home");
  await expect(carousel.locator("[data-carousel-position]")).toHaveText("1");
  await page.keyboard.press("ArrowLeft");
  await expect(carousel.locator("[data-carousel-position]")).toHaveText("3");
});

test("supports horizontal swipe and ignores a mostly vertical gesture", async ({
  page,
}) => {
  const viewport = page.locator(".service-carousel-viewport");
  await viewport.dispatchEvent("pointerdown", {
    isPrimary: true,
    clientX: 160,
    clientY: 80,
  });
  await viewport.dispatchEvent("pointerup", {
    isPrimary: true,
    clientX: 70,
    clientY: 85,
  });
  await expect(page.locator("[data-carousel-position]")).toHaveText("2");

  await viewport.dispatchEvent("pointerdown", {
    isPrimary: true,
    clientX: 70,
    clientY: 40,
  });
  await viewport.dispatchEvent("pointerup", {
    isPrimary: true,
    clientX: 60,
    clientY: 130,
  });
  await expect(page.locator("[data-carousel-position]")).toHaveText("2");
});

test("opens the complete image in a centered modal and restores focus on close", async ({
  page,
}) => {
  const trigger = page.locator("[data-carousel-zoom]").first();
  await trigger.click();

  const lightbox = page.locator("[data-service-image-lightbox]");
  const dialog = lightbox.locator(".service-image-lightbox-dialog");
  const image = lightbox.locator("[data-lightbox-image]");
  await expect(lightbox).toBeVisible();
  await expect(dialog).toBeFocused();
  await expect(image).toHaveAttribute("alt", "Interior");
  await expect(image).toHaveCSS("object-fit", "contain");

  const viewport = page.viewportSize();
  const box = await dialog.boundingBox();
  expect(viewport).not.toBeNull();
  expect(box).not.toBeNull();
  expect(Math.abs(box!.x + box!.width / 2 - viewport!.width / 2)).toBeLessThan(
    8,
  );
  expect(
    Math.abs(box!.y + box!.height / 2 - viewport!.height / 2),
  ).toBeLessThan(8);

  await page.keyboard.press("Escape");
  await expect(lightbox).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("opens full images from service and service-area carousels", async ({
  page,
}) => {
  for (const route of [
    "/services/mobile-kitchen-trailers/24ft/",
    "/service-areas/washington/olympic-peninsula/port-angeles/",
  ]) {
    await page.goto(route);
    const trigger = page
      .locator('[data-carousel-slide][data-active="true"] [data-carousel-zoom]')
      .first();
    await expect(trigger).toBeVisible();
    await trigger.click();

    const lightbox = page.locator("[data-service-image-lightbox]");
    const image = lightbox.locator("[data-lightbox-image]");
    await expect(lightbox).toBeVisible();
    await expect
      .poll(() =>
        image.evaluate((node) => (node as HTMLImageElement).naturalWidth),
      )
      .toBeGreaterThan(0);
    await expect(image).toHaveCSS("object-fit", "contain");

    await page.keyboard.press("Escape");
    await expect(lightbox).toBeHidden();
  }
});

test("renders verified route images in deterministic order and keeps controls usable", async ({
  page,
}) => {
  await page.goto("/services/mobile-kitchen-trailers/24ft/");

  const carousel = page.locator("[data-service-carousel]");
  await expect(carousel).toBeVisible();
  await expect
    .poll(() =>
      carousel
        .locator("img")
        .first()
        .evaluate((image) => (image as HTMLImageElement).naturalWidth),
    )
    .toBeGreaterThan(0);
  await expect(carousel.locator("[data-carousel-position]")).toHaveText("1");
  await expect(carousel.locator("img").first()).toHaveAttribute(
    "alt",
    /interior/i,
  );
  await expect(carousel).toHaveAttribute("data-carousel-autoplay", "true");
  expect(
    await carousel
      .locator(".service-carousel-slide img")
      .first()
      .evaluate((image) => getComputedStyle(image).objectFit),
  ).toBe("cover");

  await expect(carousel.locator("[data-carousel-position]")).not.toHaveText(
    "1",
    { timeout: 6500 },
  );
  await carousel.locator('[data-carousel-select="0"]').click();
  await expect(carousel.locator("[data-carousel-position]")).toHaveText("1");
  await expect(carousel.locator("[data-carousel-toggle]")).toHaveText("Play");

  await carousel.locator("[data-carousel-next]").click();
  await expect(carousel.locator("[data-carousel-position]")).toHaveText("2");
  await expect(carousel.locator("img").nth(1)).toHaveAttribute(
    "alt",
    /interior/i,
  );

  const views = await carousel
    .locator("[data-carousel-select]")
    .evaluateAll((buttons) =>
      buttons.map((button) => button.getAttribute("data-carousel-view")),
    );
  expect(views).toEqual([
    "interior",
    "interior",
    "detail",
    "detail",
    "exterior",
  ]);
});

test("uses the truthful non-photo fallback when an exact model is not verified", async ({
  page,
}) => {
  await page.goto("/services/mobile-kitchen-trailers/26ft-bulk/");

  await expect(page.locator(".service-hero-unverified")).toContainText(
    "Exact equipment photography is pending verification.",
  );
  await expect(page.locator("[data-service-carousel]")).toHaveCount(0);
});

test("uses the approved shower photo and truthfully labels the restroom preview", async ({
  page,
}) => {
  await page.goto("/");

  const showerCard = page.locator(".equipment-card", {
    has: page.getByRole("heading", { name: "Shower trailers", exact: true }),
  });
  const showerImage = showerCard.locator(".image-box img");
  await expect(showerImage).toBeVisible();
  await expect(showerImage).toHaveAttribute(
    "src",
    "/images/catalog/shower-trailer-960.webp",
  );
  await expect(showerImage).toHaveAttribute("alt", /private shower stall/i);
  await expect
    .poll(() =>
      showerImage.evaluate((node) => (node as HTMLImageElement).naturalWidth),
    )
    .toBeGreaterThan(0);

  const restroomCard = page.locator(".equipment-card", {
    has: page.getByRole("heading", { name: "Restroom trailers", exact: true }),
  });
  const restroomImage = restroomCard.locator(".image-box img");
  await expect(restroomImage).toBeVisible();
  await expect(restroomImage).toHaveAttribute(
    "src",
    "/images/location-verified/5ecedc2b7190aeb0b3f7-960.webp",
  );
  await expect(restroomImage).toHaveAttribute(
    "alt",
    /toilet interior in a shower and restroom combination trailer; restroom-only unit not pictured/i,
  );
  await expect(restroomCard.locator(".representative-photo-note")).toHaveText(
    "Photo shows a shower + restroom combination unit",
  );
  await expect
    .poll(() =>
      restroomImage.evaluate((node) => (node as HTMLImageElement).naturalWidth),
    )
    .toBeGreaterThan(0);
});

test("keeps the carousel inside the viewport on desktop and mobile", async ({
  page,
}) => {
  for (const viewport of [
    { width: 1440, height: 1000 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto(
      "/services/shower-restroom-combination-trailers/22ft-6-stall/",
    );

    const box = await page.locator("[data-service-carousel]").boundingBox();
    await expect
      .poll(() =>
        page
          .locator("[data-service-carousel] img")
          .first()
          .evaluate((image) => (image as HTMLImageElement).naturalWidth),
      )
      .toBeGreaterThan(0);
    expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(viewport.width + 1);
    await expect(page.locator("[data-carousel-next]")).toBeVisible();
  }
});

test("extends the service hero background across the viewport", async ({
  page,
}) => {
  for (const viewport of [
    { width: 1440, height: 1000 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/services/mobile-kitchen-trailers/24ft/");

    const section = page.locator(".model-hero-section");
    const sectionBox = await section.boundingBox();
    const contentBox = await section.locator(":scope > .wrap").boundingBox();
    const carousel = section.locator("[data-service-carousel]");
    const carouselBox = await carousel.boundingBox();
    const mediaBox = await carousel
      .locator(".service-carousel-viewport")
      .boundingBox();

    expect(sectionBox).not.toBeNull();
    expect(sectionBox!.x).toBeLessThanOrEqual(1);
    expect(sectionBox!.width).toBeGreaterThanOrEqual(viewport.width - 1);
    expect(contentBox).not.toBeNull();
    expect(contentBox!.width).toBeLessThanOrEqual(viewport.width);
    expect(carouselBox).not.toBeNull();
    expect(mediaBox).not.toBeNull();
    expect(Math.abs(mediaBox!.x - carouselBox!.x)).toBeLessThanOrEqual(1);
    expect(
      Math.abs(
        mediaBox!.x + mediaBox!.width - (carouselBox!.x + carouselBox!.width),
      ),
    ).toBeLessThanOrEqual(1);
    await expect(carousel).toHaveCSS("padding-left", "0px");
    await expect(carousel).toHaveCSS("padding-right", "0px");
    await expect(carousel).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    await expect(section).toHaveCSS("background-color", "rgb(237, 241, 236)");
  }
});
