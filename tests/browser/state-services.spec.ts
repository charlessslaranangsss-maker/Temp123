import { test, expect } from "@playwright/test";

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

test("state click opens service choices and carries the state into the contact drawer", async ({
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
  const modal = page.getByRole("dialog", { name: "Services in California" });
  await expect(modal).toBeVisible();
  await expect(
    modal.locator(".state-service-list a > span:nth-child(2)"),
  ).toHaveText(names);
  await expect(
    modal.getByRole("link", { name: "Dishwashing", exact: false }),
  ).toHaveAttribute("href", "/portable-dishwashing-trailer-rental/");
  await page.screenshot({ path: "test-results/state-services-desktop.png" });
  await modal.getByRole("link", { name: "Contact Us" }).click();
  const form = page.locator("#contact-drawer");
  await expect(form).toBeVisible();
  await expect(modal).not.toBeVisible();
  await expect(form.locator('input[name="location"]')).toHaveValue(
    "California",
  );
  await expect(page).toHaveURL(/\/service-areas\/$/);
  await page.keyboard.press("Escape");
  await expect(state).toBeFocused();
  await state.press("Enter");
  await expect(modal).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(state).toBeFocused();
});

test("mobile state selection and expanded map support keyboard, contact and dismissal", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/service-areas/");
  await page.locator("[data-state-picker]").selectOption("New Hampshire");
  let modal = page.getByRole("dialog", { name: "Services in New Hampshire" });
  await expect(modal).toBeVisible();
  expect(await modal.evaluate((e) => e.scrollWidth <= e.clientWidth)).toBe(
    true,
  );
  await page.screenshot({ path: "test-results/state-services-mobile.png" });
  await modal.getByRole("link", { name: "Contact Us" }).click();
  await expect(
    page.locator('#contact-drawer input[name="location"]'),
  ).toHaveValue("New Hampshire");
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Explore full map" }).click();
  const state = page.locator('.map-dialog [data-state="Texas"]');
  await state.focus();
  await state.press("Space");
  modal = page.getByRole("dialog", { name: "Services in Texas" });
  await expect(modal).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(state).toBeFocused();
  await state.press("Enter");
  await modal.getByRole("link", { name: "Contact Us" }).click();
  await expect(
    page.locator('#contact-drawer input[name="location"]'),
  ).toHaveValue("Texas");
  await expect(page.locator(".map-dialog")).not.toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator("[data-expand-map]")).toBeFocused();
});
