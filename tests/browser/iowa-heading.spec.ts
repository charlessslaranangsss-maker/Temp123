import { test, expect } from "@playwright/test";

test("Iowa planning heading is state-specific", async ({ page }) => {
  await page.goto("/service-areas/");
  await page.locator("[data-state-picker]").selectOption("Iowa");
  await expect(page.locator("#state-seasonal-title")).toHaveText(
    "Trailer, or Modular Facilities, or Mobile, or Trailer, or Emergency.",
  );
  await page.keyboard.press("Escape");
  await page.locator("[data-state-picker]").selectOption("Texas");
  await expect(page.locator("#state-seasonal-title")).toHaveText(
    "Rental Planning Conditions in Texas",
  );
});
