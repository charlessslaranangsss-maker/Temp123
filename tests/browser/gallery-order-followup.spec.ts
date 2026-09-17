import { test, expect, type Locator } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { load } from "cheerio";
import reviews from "../../audit/image-order-followup-2026-09-16/visual-view-review.json" with { type: "json" };

test.describe.configure({ mode: "serial" });
const viewBySrc = new Map(reviews.images.map((i) => [i.src, i.visualView]));
const evidence = {
  gallerySequences: [] as any[],
  modals: [] as any[],
  errors: [] as string[],
};
const targetOrigin = new URL(
  process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4203",
).origin;
test.beforeEach(async ({ page }) => {
  page.on("pageerror", (e) => evidence.errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") evidence.errors.push(m.text());
  });
  page.on("response", (r) => {
    if (new URL(r.url()).origin === targetOrigin && r.status() >= 400)
      evidence.errors.push(r.status() + " " + r.url());
  });
  page.on("request", (r) => {
    if (r.method() === "POST")
      evidence.errors.push("Unexpected POST " + r.url());
  });
});
test.afterEach(() => {
  fs.mkdirSync("work/qa", { recursive: true });
  fs.writeFileSync(
    "work/qa/gallery-order-followup-browser.json",
    JSON.stringify(evidence, null, 2),
  );
});
async function verifyOrder(carousel: Locator) {
  const rows = await carousel
    .locator("[data-carousel-slide]")
    .evaluateAll((nodes) =>
      nodes.map((n) => {
        const im = n.querySelector("img")!;
        return {
          src:
            im.getAttribute("data-carousel-full-src") ||
            im.getAttribute("src")!,
          view: n.getAttribute("data-image-view"),
          display: im.getAttribute("src"),
        };
      }),
    );
  let exterior = false;
  for (const row of rows) {
    const physical = viewBySrc.get(row.src);
    expect(physical, row.src).toBeTruthy();
    expect(row.view === "detail" ? "interior" : row.view).toBe(physical);
    if (physical === "exterior") exterior = true;
    if (physical === "interior")
      expect(exterior, row.src + " follows an exterior").toBe(false);
  }
  if (rows.length > 1) {
    expect(
      await carousel
        .locator("[data-carousel-select] img")
        .evaluateAll((nodes) => nodes.map((n) => n.getAttribute("src"))),
    ).toEqual(rows.map((r) => r.display));
  }
  return rows;
}
test("every unique assigned carousel sequence has correct physical order through the full-image lightbox", async ({
  page,
}) => {
  test.setTimeout(300000);
  const registry = JSON.parse(
    fs.readFileSync("audit/build-registry.json", "utf8"),
  );
  const choices = new Map<string, { route: string; index: number }>();
  for (const p of registry.pages) {
    const $ = load(
      fs.readFileSync(path.join("dist", p.path.slice(1), "index.html"), "utf8"),
    );
    $("main [data-service-carousel]")
      .filter((_, e) => !$(e).parents("template").length)
      .each((index, e) => {
        const signature = $(e)
          .find("[data-carousel-slide] img")
          .toArray()
          .map((n) => $(n).attr("data-carousel-full-src") || $(n).attr("src"))
          .join("|");
        if (!choices.has(signature))
          choices.set(signature, { route: p.path, index });
      });
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const choice of choices.values()) {
    await page.goto(choice.route);
    const carousel = page
      .locator("main [data-service-carousel]")
      .nth(choice.index);
    await expect(carousel).toHaveAttribute("data-carousel-index", "0");
    const rows = await verifyOrder(carousel);
    await carousel
      .locator('[data-carousel-slide][data-active="true"] [data-carousel-zoom]')
      .click();
    const box = page.locator("dialog.service-image-lightbox");
    await expect(box).toBeVisible();
    for (let i = 0; i < rows.length; i++) {
      const img = box.locator("[data-lightbox-image]");
      await expect(img).toHaveAttribute("src", rows[i].src);
      await img.evaluate(async (n: HTMLImageElement) => n.decode());
      expect(await img.evaluate((n) => getComputedStyle(n).objectFit)).toBe(
        "contain",
      );
      if (i + 1 < rows.length) await page.keyboard.press("ArrowRight");
    }
    await page.keyboard.press("Escape");
    await expect(box).not.toBeVisible();
    evidence.gallerySequences.push({ ...choice, slides: rows, result: "PASS" });
  }
});
test("all 100 state modal presentations satisfy the independent physical-view ordering check", async ({
  page,
}) => {
  test.setTimeout(240000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const host of ["/service-areas/", "/"]) {
    await page.setViewportSize({
      width: host === "/" ? 390 : 1440,
      height: 900,
    });
    await page.goto(host);
    const states = await page
      .locator("template[data-state-gallery-template]")
      .evaluateAll((nodes) =>
        nodes.map((n) => n.getAttribute("data-state-gallery-template")!),
      );
    expect(states.length).toBe(50);
    for (const state of states) {
      if (host === "/")
        await page.locator("[data-state-picker]").selectOption(state);
      else
        await page
          .locator('[data-state="' + state + '"]')
          .first()
          .dispatchEvent("click");
      const dialog = page.locator("#state-services-dialog");
      await expect(dialog).toBeVisible();
      const carousels = dialog.locator("[data-service-carousel]");
      const groups = [];
      for (let i = 0; i < (await carousels.count()); i++) {
        const c = carousels.nth(i);
        await expect(c).toHaveAttribute("data-carousel-index", "0");
        groups.push(await verifyOrder(c));
      }
      if (!groups.length)
        await expect(
          dialog.locator("[data-verified-photo-pending]"),
        ).toBeVisible();
      await dialog.locator("[data-close-state]").click();
      await expect(dialog.locator("img")).toHaveCount(0);
      evidence.modals.push({ host, state, groups, result: "PASS" });
    }
  }
});
test("order follow-up had no browser exceptions, same-origin failures or writes", () => {
  expect(evidence.errors).toEqual([]);
  expect(evidence.modals.length).toBe(100);
});
