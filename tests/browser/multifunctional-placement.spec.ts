import { test, expect, type Page, type Locator } from "@playwright/test";
import fs from "node:fs";
import additions from "../../content/equipment-photo-additions.json" with { type: "json" };

type Target = { kind: string; url: string; state?: string; title: string };
const qa = "work/qa/multifunctional-placement-20260916";
const pageUrls = [
  "/service-areas/arkansas/delta/",
  "/service-areas/california/north-coast/",
  "/service-areas/connecticut/connecticut-shoreline/",
  "/service-areas/florida/north-florida/",
  "/service-areas/georgia/north-georgia/",
  "/service-areas/idaho/southwest-idaho/",
  "/service-areas/iowa/northwest-iowa/",
  "/service-areas/kansas/south-central-kansas/",
  "/service-areas/maine/western-lakes-and-mountains/",
  "/service-areas/maryland/central-maryland/",
  "/service-areas/massachusetts/berkshires/",
  "/service-areas/michigan/southeast-michigan/",
  "/service-areas/minnesota/southern-minnesota/",
  "/service-areas/mississippi/hills/",
  "/service-areas/montana/yellowstone-country/",
  "/service-areas/nebraska/sandhills/",
  "/service-areas/nevada/reno-tahoe/",
  "/service-areas/new-hampshire/dartmouth-lake-sunapee/",
  "/service-areas/new-jersey/skylands/",
  "/service-areas/new-mexico/southeast-new-mexico/",
  "/service-areas/new-york/capital-region/",
  "/service-areas/north-carolina/charlotte-region/",
  "/service-areas/ohio/northwest-ohio/",
  "/service-areas/oklahoma/kiamichi-country/",
  "/service-areas/oregon/eastern-oregon/",
  "/service-areas/south-carolina/pee-dee/",
  "/service-areas/tennessee/cumberland-plateau/",
  "/service-areas/texas/gulf-coast/",
  "/service-areas/utah/central-utah/",
  "/service-areas/vermont/southern-vermont/",
  "/service-areas/virginia/hampton-roads/",
  "/service-areas/washington/olympic-peninsula/",
  "/service-areas/west-virginia/northern-panhandle/",
  "/service-areas/wyoming/southeast-wyoming/",
  "/service-areas/washington/olympic-peninsula/sequim/",
  "/service-areas/georgia/",
  "/service-areas/iowa/",
  "/service-areas/massachusetts/",
  "/service-areas/new-jersey/",
  "/service-areas/texas/",
  "/service-areas/washington/",
  "/service-areas/west-virginia/",
] as const;
const modalStates = [
  "Georgia",
  "Iowa",
  "Massachusetts",
  "New Jersey",
  "Texas",
  "Washington",
  "West Virginia",
] as const;
const targets: Target[] = [
  ...pageUrls.map((url) => ({ kind: "page", url, title: "" })),
  ...modalStates.flatMap((state) => [
    { kind: "full-map", url: "/service-areas/", state, title: "" },
    { kind: "compact-map", url: "/", state, title: "" },
  ]),
];
fs.mkdirSync(qa, { recursive: true });
const evidence: {
  records: unknown[];
  errors: string[];
  failedRequests: string[];
} = { records: [], errors: [], failedRequests: [] };
const origin = new URL(
  process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4209",
).origin;
test.describe.configure({ mode: "serial" });
test.beforeEach(async ({ page }) => {
  page.on("pageerror", (e) => evidence.errors.push(e.message));
  page.on("console", (msg) => {
    if (msg.type() === "error") evidence.errors.push(msg.text());
  });
  page.on("response", (res) => {
    if (res.status() >= 400 && new URL(res.url()).origin === origin)
      evidence.failedRequests.push(res.status() + " " + res.url());
  });
  page.on("requestfailed", (req) => {
    if (
      new URL(req.url()).origin === origin &&
      !req.failure()?.errorText.includes("ERR_ABORTED")
    )
      evidence.failedRequests.push(req.url());
  });
  await page.route("**/api/contact*", (route) => {
    evidence.errors.push("Unexpected contact request");
    return route.abort();
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
});
test.afterEach(async () =>
  fs.writeFileSync(
    qa + "/placement-browser.json",
    JSON.stringify(evidence, null, 2),
  ),
);

async function checkNewProducts(
  page: Page,
  gallery: Locator,
  row: Target,
  width: number,
) {
  await expect(gallery).toHaveAttribute("data-gallery-title", row.title);
  await expect(gallery).toHaveAttribute(
    "data-gallery-presentation",
    "separate-options",
  );
  await expect(gallery.locator("[data-gallery-group]")).toHaveCount(3);
  await expect(gallery.locator(".location-gallery-context")).toHaveCount(0);
  for (const model of additions.models) {
    const image = additions.images.find((i) => i.model === model.id)!;
    const group = gallery.locator('[data-group-model="' + model.id + '"]');
    const groupId = await group.getAttribute("id");
    expect(groupId).toBeTruthy();
    await gallery.locator('[aria-controls="' + groupId + '"]').click();
    await expect(group).toBeVisible();
    await group.scrollIntoViewIfNeeded();
    await expect(group.locator("h3")).toHaveText(model.name);
    await expect(group.locator("[data-carousel-slide]")).toHaveCount(1);
    await expect(group.locator("[data-carousel-slide]")).toHaveAttribute(
      "data-image-family",
      model.family,
    );
    await expect(group.locator("[data-carousel-slide]")).toHaveAttribute(
      "data-image-view",
      "exterior",
    );
    const caption = (
      await group.locator("[data-carousel-caption]").innerText()
    ).trim();
    const normalizedCaption = caption
      .toLowerCase()
      .replace(/(\d+)\s*ft/g, "$1 ft")
      .replace(/&/g, "and");
    const modelTerms = model.name
      .toLowerCase()
      .replace(/(\d+)\s*ft/g, "$1 ft")
      .replace(/&/g, "and")
      .match(/[a-z0-9]+/g) ?? [];
    for (const term of modelTerms) expect(normalizedCaption).toContain(term);
    expect(caption).toContain("Rental or Lease");
    expect(caption).toContain(
      "weekly rental, monthly rental, or yearly rental",
    );
    expect(caption).toMatch(
      /Call us now at (?:\+1\s*)?(?:\(800\)|800)[\s-]*443[\s-]*5212/i,
    );
    const thumbnail = group.locator("[data-carousel-slide] img");
    await expect
      .poll(
        () =>
          thumbnail.evaluate(
            (im: HTMLImageElement) =>
              im.complete && im.naturalWidth > 0 && im.naturalHeight > 0,
          ),
        { timeout: 15_000 },
      )
      .toBe(true);
    await group.locator("[data-carousel-zoom]").click();
    const box = page.locator("dialog.service-image-lightbox");
    await expect(box).toBeVisible();
    await expect(box.locator("[data-lightbox-title]")).toHaveText(model.name);
    await expect(box).toHaveAttribute("aria-label", model.name + " full image");
    await expect(box.locator("[data-lightbox-reference]")).toHaveText(caption);
    await expect(box.locator("[data-lightbox-image]")).toHaveAttribute(
      "alt",
      image.alt,
    );
    await expect(box.locator("[data-lightbox-image]")).toHaveAttribute(
      "src",
      image.original,
    );
    await expect(box.locator("[data-lightbox-image]")).toHaveCSS(
      "object-fit",
      "contain",
    );
    const fullImage = box.locator("[data-lightbox-image]");
    await expect
      .poll(
        () =>
          fullImage.evaluate((im: HTMLImageElement) => [
            im.complete,
            im.naturalWidth,
            im.naturalHeight,
          ]),
        { timeout: 15_000 },
      )
      .toEqual([true, 1434, 1097]);
    await expect(box.locator("[data-lightbox-next]")).toBeHidden();
    if (row.kind === "page" && row.url === "/service-areas/texas/")
      await page.screenshot({
        path: qa + "/texas-full-" + image.id + "-" + width + ".png",
      });
    if (model.id === "new-38ft-all-electric-kitchen")
      await page.keyboard.press("Escape");
    else await box.locator("[data-lightbox-close]").click();
    await expect(box).not.toBeVisible();
    await expect(box.locator("[data-lightbox-title]")).toHaveText("");
  }
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth - innerWidth,
    ),
  ).toBeLessThanOrEqual(1);
  evidence.records.push({
    ...row,
    width,
    fullImagesChecked: 2,
    result: "PASS",
  });
}

for (const width of [1440, 390]) {
  test(
    "actual man-camp pages and state modals show both new product photographs at " +
      width +
      "px",
    async ({ page }) => {
      test.setTimeout(900000);
      await page.setViewportSize({ width, height: 1000 });
      expect(targets.filter((r) => r.kind === "page")).toHaveLength(42);
      expect(targets.filter((r) => r.kind !== "page")).toHaveLength(14);
      for (const row of targets.filter((r) => r.kind === "page")) {
        const response = await page.goto(row.url, {
          waitUntil: "domcontentloaded",
        });
        expect(response?.status()).toBe(200);
        const title = (await page.locator("main h1").innerText()).trim();
        expect(title).not.toBe("");
        await checkNewProducts(
          page,
          page.locator("main [data-location-gallery]").first(),
          { ...row, title },
          width,
        );
        if (row.url === "/service-areas/texas/") {
          await page
            .locator("main [data-location-gallery]")
            .first()
            .scrollIntoViewIfNeeded();
          await page.screenshot({
            path: qa + "/texas-gallery-" + width + ".png",
          });
        }
      }
      for (const kind of ["full-map", "compact-map"]) {
        const selected = targets.filter((r) => r.kind === kind);
        await page.goto(selected[0].url, { waitUntil: "domcontentloaded" });
        if (kind === "full-map")
          await expect(
            page.locator(".location-hero-copy [data-location-gallery]"),
          ).toHaveCount(0);
        for (const row of selected) {
          await page.locator("[data-state-picker]").selectOption(row.state!);
          const dialog = page.locator("#state-services-dialog");
          await expect(dialog).toBeVisible();
          const title = (
            await dialog.locator("[data-state-headline]").innerText()
          ).trim();
          expect(title).not.toBe("");
          await checkNewProducts(
            page,
            dialog.locator("[data-location-gallery]"),
            { ...row, title },
            width,
          );
          await dialog.locator("[data-close-state]").click();
          await expect(dialog.locator("img")).toHaveCount(0);
        }
        // Follow a multifunctional state with a hygiene-only state: no stale images/labels.
        await page.locator("[data-state-picker]").selectOption("California");
        const dialog = page.locator("#state-services-dialog");
        await expect(
          dialog.locator(
            '[data-image-review-id="26.01"], [data-image-review-id="27.01"]',
          ),
        ).toHaveCount(0);
        await dialog.locator("[data-close-state]").click();
      }
      expect(evidence.errors).toEqual([]);
      expect(evidence.failedRequests).toEqual([]);
    },
  );
}
