import { expect, test } from "@playwright/test";
import cities from "../../src/calculatorCities.json" with { type: "json" };

for (const route of ["/", "/rental-calculator/"]) {
  test(`state-filtered city dropdown on ${route}`, async ({ page }) => {
    test.setTimeout(120000);
    await page.goto(route);
    const form = page.locator("#rental-calculator-form");
    const state = form.locator('select[name="state"]');
    const city = form.locator('select[name="city"]');
    await expect(city).toBeDisabled();
    await expect(form.locator('input[name="city"]')).toHaveCount(0);
    for (const [name, expected] of Object.entries(cities)) {
      await state.selectOption(name);
      await expect(city).toBeEnabled();
      expect(await city.locator("option").evaluateAll(options =>
        options.map(option => (option as HTMLOptionElement).value).filter(Boolean)
      )).toEqual(expected);
    }
    await state.selectOption("Washington");
    await city.selectOption("Port Angeles");
    await state.selectOption("Alaska");
    await expect(city).toHaveValue("");
    await city.selectOption("Anchorage");
    await expect(city).toHaveValue("Anchorage");
  });
}
