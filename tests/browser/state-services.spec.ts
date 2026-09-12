import { test, expect } from "@playwright/test";
import { stateGuides } from "../../src/stateGuides";

const names = [
  "Mobile Kitchens",
  "Dishwashing",
  "Refrigeration",
  "Shower",
  "Restroom",
  "Shower and Restroom Combination Trailers",
  "Sleeper",
  "Laundry",
  "Handwashing Trailers",
];

test("every state guide uses natural rental, rent and lease language", () => {
  expect(Object.keys(stateGuides)).toHaveLength(50);
  for (const [name, guide] of Object.entries(stateGuides)) {
    expect(guide.intro, name).toMatch(/\brental\b/i);
    expect(guide.intro, name).toMatch(/\brent\b/i);
    expect(guide.intro, name).toMatch(/\blease\b/i);
    expect(guide.intro, name).toContain(`${name}, USA`);
    expect(guide.intro, name).toContain("United States");
  }
});

test("state click opens localized service choices and a direct call action", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/service-areas/");
  expect(
    await page
      .locator("#services-panel .service-category-link")
      .evaluateAll((items) =>
        items.map((item) => item.firstChild?.textContent?.trim()),
      ),
  ).toEqual(names);
  const state = page.locator('.coverage-map-stage [data-state="California"]');
  await state.click();
  const modal = page.getByRole("dialog", {
    name: "Services in California, USA",
    exact: true,
  });
  await expect(modal).toBeVisible();
  await expect(
    modal.locator(".state-service-list a > span:nth-child(2)"),
  ).toHaveText(names);
  await expect(
    modal.getByRole("link", { name: "Dishwashing", exact: false }),
  ).toHaveAttribute("href", "/portable-dishwashing-trailer-rental/");
  await expect(modal.locator("#state-services-intro")).toContainText(
    "temporary facility rental options",
  );
  await expect(modal.locator("#state-services-intro")).toContainText(
    "Rent short-term",
  );
  await expect(modal.locator("#state-services-intro")).toContainText(
    "longer lease",
  );
  await expect(
    modal.getByRole("link", { name: "Call now", exact: false }),
  ).toHaveAttribute("href", "tel:+18004435212");
  const countryReferences = (
    (await modal.innerText()).match(/\b(?:USA|United States)\b/g) || []
  ).length;
  expect(countryReferences).toBeGreaterThanOrEqual(4);
  expect(countryReferences).toBeLessThanOrEqual(7);
  await page.screenshot({ path: "test-results/state-services-desktop.png" });
  await page.keyboard.press("Escape");
  await expect(state).toBeFocused();
  await state.press("Enter");
  await expect(modal).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(state).toBeFocused();
});

test("mobile state selection and expanded map support keyboard, calling and dismissal", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/service-areas/");
  await page.locator("[data-state-picker]").selectOption("New Hampshire");
  let modal = page.getByRole("dialog", {
    name: "Services in New Hampshire, USA",
    exact: true,
  });
  await expect(modal).toBeVisible();
  expect(await modal.evaluate((e) => e.scrollWidth <= e.clientWidth)).toBe(
    true,
  );
  await expect(
    modal.getByRole("link", { name: "Call now", exact: false }),
  ).toHaveAttribute("href", "tel:+18004435212");
  await page.screenshot({ path: "test-results/state-services-mobile.png" });
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Explore full map" }).click();
  const state = page.locator('.map-dialog [data-state="Texas"]');
  await state.focus();
  await state.press("Space");
  modal = page.getByRole("dialog", {
    name: "Services in Texas, USA",
    exact: true,
  });
  await expect(modal).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(state).toBeFocused();
  await state.press("Enter");
  await expect(
    modal.getByRole("link", { name: "Call now", exact: false }),
  ).toHaveAttribute("href", "tel:+18004435212");
  await page.keyboard.press("Escape");
  await page.keyboard.press("Escape");
  await expect(page.locator(".map-dialog")).not.toBeVisible();
  await expect(page.locator("[data-expand-map]")).toBeFocused();
});
