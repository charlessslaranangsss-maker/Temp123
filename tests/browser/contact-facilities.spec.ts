import { expect, test } from "@playwright/test";

const requestedFacilities = [
  ["mobile-kitchens", "Mobile Kitchen Trailers"],
  ["dishwashing", "Dishwashing Trailers"],
  ["refrigeration", "Refrigeration Trailers"],
  ["restroom-shower-trailers", "Restroom & Shower Trailers"],
  ["sleeper", "Sleeper Trailers"],
  ["laundry", "Laundry Trailers"],
  ["sink", "Sink Trailers"],
  ["workforce-housing", "Workforce housing"],
  ["temporary-facilities", "Temporary facilities"],
  ["multiple", "Several facilities / help deciding"],
] as const;

test("Contact Us offers every requested facility", async ({ page }) => {
  await page.goto("/contact-us/");
  await page.locator(".contact-rail").click();
  const drawer = page.getByRole("dialog", { name: "Request availability" });
  await expect(drawer).toBeVisible();
  const select = drawer.locator('select[name="service"]');

  for (const [value, label] of requestedFacilities) {
    await expect(select.locator(`option[value="${value}"]`)).toHaveText(label);
    await select.selectOption(value);
    await expect(select).toHaveValue(value);
  }
});
