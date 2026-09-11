import { test, expect } from "@playwright/test";
import { routes } from "../../src/content";
test("facility tabs support keyboard selection", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("tab", { name: "Kitchen", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(
    page.getByRole("tab", { name: "Welfare", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("tabpanel")).toContainText("Comfort belongs");
});
test("planning checklist updates its accessible progress", async ({ page }) => {
  await page.goto("/planning/");
  await page.getByRole("checkbox", { name: /People & purpose/ }).check();
  await page.getByRole("checkbox", { name: /Location & access/ }).check();
  await expect(page.getByRole("status")).toHaveText(
    "2 of 4 planning areas ready",
  );
});
test("reduced motion disables hero animation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  expect(
    await page
      .locator("h1")
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("none");
});
for (const width of [320, 390, 768, 1280])
  test(`home at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("Keep your");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: `test-results/home-${width}.png`,
      fullPage: true,
    });
  });
test("all routes have initial HTML, unique titles and valid internal destinations", async ({
  request,
}) => {
  const titles = new Set();
  for (const path of routes) {
    const response = await request.get(path);
    expect(response.status()).toBe(200);
    const html = await response.text();
    expect(html).toContain("<h1>");
    expect(html).toContain("noindex,nofollow");
    const title = html.match(/<title>(.*?)<\/title>/)![1];
    expect(titles.has(title)).toBe(false);
    titles.add(title);
    for (const match of html.matchAll(/href="(\/[^"#?]*)"/g)) {
      const href = match[1];
      if (href.startsWith("/assets/") || href === "/favicon.svg") continue;
      expect(routes).toContain(href);
    }
  }
  expect((await request.get("/not-a-real-page/")).status()).toBe(404);
});
test("mobile menu handles keyboard close", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Menu" }).click();
  await expect(page.locator("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator("dialog")).not.toBeVisible();
  await expect(page.getByRole("button", { name: "Menu" })).toBeFocused();
});
test("contact preview reports unavailable and never fakes submission", async ({
  page,
}) => {
  await page.goto("/contact/");
  await page.getByLabel("Your name").fill("Test Person");
  await page.getByLabel("Email address").fill("test@example.com");
  await page.getByLabel("Project location").fill("Test city");
  await page
    .getByLabel("What are you planning?")
    .selectOption("mobile-kitchens");
  await page
    .getByLabel("Project details")
    .fill("Synthetic project details for a test only.");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Send project inquiry" }).click();
  await expect(page.getByRole("alert")).toContainText("not enabled");
});
test("service and contact layouts fit mobile and desktop without runtime errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const width of [390, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of [
      "/services/mobile-kitchens/",
      "/contact/",
      "/industries/",
      "/planning/",
    ]) {
      await page.goto(path);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await page.screenshot({
        path: `test-results/${path.split("/").filter(Boolean).pop()}-${width}.png`,
        fullPage: true,
      });
    }
  }
  expect(errors).toEqual([]);
});
