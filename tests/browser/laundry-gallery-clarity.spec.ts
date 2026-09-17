import fs from "node:fs";
import { test, expect, type Page, type Locator } from "@playwright/test";
const baseline = JSON.parse(
  fs.readFileSync(
    "audit/image-placement-revert-2026-09-16/acceptance.json",
    "utf8",
  ),
);
const flagged = baseline.rows.filter(
  (row: any) => row.family === "laundry-unspecified",
);
const folder = "work/qa/laundry-clarity-20260916";
const records: any[] = [];
test.describe.configure({ mode: "serial" });
test.beforeAll(() => fs.mkdirSync(folder, { recursive: true }));
test.afterEach(() =>
  fs.writeFileSync(
    folder + "/laundry-browser.json",
    JSON.stringify({ records }, null, 2),
  ),
);

async function checkProducts(
  page: Page,
  gallery: Locator,
  row: any,
  width: number,
) {
  await expect(gallery).toHaveAttribute("data-gallery-title", row.exactTitle);
  await expect(gallery).toHaveAttribute(
    "data-gallery-presentation",
    "separate-options",
  );
  await expect(gallery.locator(".location-gallery-context")).toContainText(
    "do not show one combined unit",
  );
  const expected = [
    {
      title: "30 ft Laundry Trailer",
      family: "laundry-trailer",
      model: "model-08",
      ids: ["08.01"],
      token: "trailer",
      count: 1,
    },
    {
      title: "20 ft Laundry Container",
      family: "laundry-container",
      model: "model-06",
      ids: ["06.01", "06.02", "06.03"],
      token: "container",
      count: 3,
    },
  ];
  await expect(gallery.locator("[data-gallery-group]")).toHaveCount(2);
  const actualFiles: string[] = [];
  for (let groupIndex = 0; groupIndex < 2; groupIndex++) {
    const wanted = expected[groupIndex],
      group = gallery.locator("[data-gallery-group]").nth(groupIndex);
    await expect(group.locator("h3")).toHaveText(wanted.title);
    await expect(group).toHaveAttribute("data-group-family", wanted.family);
    await expect(group).toHaveAttribute("data-group-model", wanted.model);
    const carousel = group.locator("[data-service-carousel]");
    await expect(carousel).toHaveAttribute("data-carousel-index", "0");
    const slides = await carousel
      .locator("[data-carousel-slide]")
      .evaluateAll((nodes) =>
        nodes.map((node) => {
          const image = node.querySelector("img")!;
          return {
            id: node.getAttribute("data-image-review-id"),
            full: image.getAttribute("data-carousel-full-src")!,
            alt: image.getAttribute("data-carousel-alt")!,
          };
        }),
      );
    expect(slides.map((image) => image.id)).toEqual(wanted.ids);
    const reference = await carousel
      .locator("[data-carousel-caption]")
      .innerText();
    expect(reference.toLowerCase()).toContain(
      wanted.title.toLowerCase() + " option",
    );
    await carousel.locator('[data-active="true"] [data-carousel-zoom]').click();
    const box = page.locator("dialog.service-image-lightbox");
    await expect(box).toBeVisible();
    await expect(box).toHaveAttribute(
      "aria-label",
      wanted.title + " full image",
    );
    await expect(box.locator("[data-lightbox-title]")).toHaveText(wanted.title);
    await expect(box.locator("[data-lightbox-reference]")).toHaveText(
      reference,
    );
    for (let position = 0; position < slides.length; position++) {
      const image = box.locator("[data-lightbox-image]");
      await expect(image).toHaveAttribute("src", slides[position].full);
      await expect(image).toHaveAttribute("alt", slides[position].alt);
      expect(slides[position].alt.toLowerCase()).toContain(wanted.token);
      await expect(image).toHaveCSS("object-fit", "contain");
      expect(
        await image.evaluate(async (el: HTMLImageElement) => {
          await el.decode();
          return el.naturalWidth > 0;
        }),
      ).toBe(true);
      await expect(box.locator("[data-lightbox-caption]")).toHaveText(
        slides[position].alt,
      );
      await expect(box.locator("[data-lightbox-position]")).toHaveText(
        position + 1 + " of " + slides.length,
      );
      actualFiles.push(slides[position].full);
      if (position + 1 < slides.length) await page.keyboard.press("ArrowRight");
    }
    if (slides.length > 1) {
      await page.keyboard.press("ArrowRight");
      await expect(box.locator("[data-lightbox-image]")).toHaveAttribute(
        "src",
        slides[0].full,
      );
      await page.keyboard.press("ArrowLeft");
      await expect(box.locator("[data-lightbox-image]")).toHaveAttribute(
        "src",
        slides[slides.length - 1].full,
      );
    } else await expect(box.locator("[data-lightbox-next]")).toBeHidden();
    if (row.url === "/service-areas/alabama/central-alabama/") {
      await page.screenshot({
        path: folder + "/lightbox-" + wanted.token + "-" + width + ".png",
      });
    }
    const bounds = await box
      .locator(".service-image-lightbox-dialog")
      .boundingBox();
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width + 1);
    await page.keyboard.press("Escape");
    await expect(box).not.toBeVisible();
    await expect(box.locator("[data-lightbox-title]")).toHaveText("");
    await expect(box.locator("[data-lightbox-reference]")).toHaveText("");
  }
  expect(actualFiles).toEqual(row.assignedFiles);
  records.push({
    kind: row.kind,
    url: row.url,
    state: row.state || null,
    exactTitle: row.exactTitle,
    width,
    files: actualFiles,
    fullImagesChecked: actualFiles.length,
    result: "PASS",
  });
}

for (const width of [1440, 390])
  test(
    "all 50 laundry records keep product identity through full-image viewing at " +
      width +
      "px",
    async ({ page }) => {
      test.setTimeout(300000);
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: "reduce" });
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("response", (response) => {
        if (
          response.status() >= 400 &&
          response.url().startsWith("http://127.0.0.1")
        )
          errors.push(response.status() + " " + response.url());
      });
      page.on("request", (request) => {
        if (
          request.method() === "POST" &&
          request.url().includes("/api/contact")
        )
          errors.push("Unexpected inquiry");
      });
      let host = "";
      for (const row of flagged) {
        const url =
          row.kind === "page"
            ? row.url
            : row.kind === "full-map"
              ? "/service-areas/"
              : "/";
        if (host !== url) {
          expect((await page.goto(url))?.status()).toBe(200);
          host = url;
        }
        let gallery: Locator;
        if (row.kind === "page") {
          await expect(page.locator("main h1")).toHaveText(row.exactTitle);
          gallery = page.locator("main [data-location-gallery]").first();
        } else {
          await page.locator("[data-state-picker]").selectOption(row.state);
          const dialog = page.locator("#state-services-dialog");
          await expect(dialog).toBeVisible();
          await expect(dialog.locator("[data-state-headline]")).toHaveText(
            row.exactTitle,
          );
          gallery = dialog.locator("[data-location-gallery]");
        }
        await checkProducts(page, gallery, row, width);
        if (row.kind !== "page") {
          const dialog = page.locator("#state-services-dialog");
          await dialog.locator("[data-close-state]").click();
          await expect(dialog.locator("img")).toHaveCount(0);
        }
      }
      expect(errors).toEqual([]);
    },
  );

test("switching from laundry to a different state does not retain laundry lightbox labels", async ({
  page,
}) => {
  await page.goto("/service-areas/");
  await page.locator("[data-state-picker]").selectOption("Indiana");
  const dialog = page.locator("#state-services-dialog");
  await dialog
    .locator(
      '[data-group-family="laundry-container"] [data-active="true"] [data-carousel-zoom]',
    )
    .click();
  const box = page.locator("dialog.service-image-lightbox");
  await expect(box.locator("[data-lightbox-title]")).toHaveText(
    "20 ft Laundry Container",
  );
  await page.keyboard.press("Escape");
  await dialog.locator("[data-close-state]").click();
  await page.locator("[data-state-picker]").selectOption("California");
  await dialog
    .locator('[data-active="true"] [data-carousel-zoom]')
    .first()
    .click();
  await expect(box.locator("[data-lightbox-title]")).toBeHidden();
  await expect(box.locator("[data-lightbox-reference]")).toHaveText("");
  await expect(box).toHaveAttribute("aria-label", "Full equipment image");
  await box.locator("[data-lightbox-close]").click();
});
