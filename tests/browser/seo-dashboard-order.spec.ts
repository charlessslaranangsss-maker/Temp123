import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";

test("shows indexing and authority metrics before the overview", async ({ page }) => {
  const css = readFileSync("src/seo-dashboard.css", "utf8");
  await page.setContent(`
    <style>${css}</style>
    <main class="seo-main">
      <section id="overview" class="seo-section seo-order-overview">Overview</section>
      <section id="indexing" class="seo-section seo-order-indexing">Priority URL indexing status</section>
      <section id="domain-authority" class="seo-section seo-order-domain-authority">Authority metrics by website</section>
    </main>
  `);

  const indexing = page.locator("#indexing");
  const authority = page.locator("#domain-authority");
  const overview = page.locator("#overview");

  await expect(indexing).toContainText("Priority URL indexing status");
  await expect(authority).toContainText("Authority metrics by website");

  const indexingBox = await indexing.boundingBox();
  const authorityBox = await authority.boundingBox();
  const overviewBox = await overview.boundingBox();

  expect(indexingBox).not.toBeNull();
  expect(authorityBox).not.toBeNull();
  expect(overviewBox).not.toBeNull();
  expect(indexingBox!.y).toBeLessThan(authorityBox!.y);
  expect(authorityBox!.y).toBeLessThan(overviewBox!.y);
});
