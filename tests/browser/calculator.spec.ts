import { expect, test } from "@playwright/test";

test("homepage calculator produces the published starting estimate", async ({
  page,
}) => {
  await page.goto("/");
  const calculator = page.locator("#rental-calculator-form");
  await expect(calculator).toBeVisible();
  await calculator.getByLabel("State").selectOption("Washington");
  await calculator.getByLabel("City").fill("Port Angeles");
  await calculator.getByLabel("ZIP code (optional)").fill("98362");
  await calculator.getByLabel("Equipment type").selectOption("mobile-kitchen");
  await calculator.getByLabel("Trailer length").selectOption("25");
  await calculator.getByLabel("Number of people").fill("20");
  await calculator.getByLabel("Rental start date").fill("2026-10-01");
  await calculator.getByLabel("Rental end date").fill("2026-10-15");
  let contactRequests = 0;
  page.on("request", (request) => {
    if (new URL(request.url()).pathname === "/api/contact") contactRequests++;
  });
  await calculator
    .getByRole("button", { name: /Calculate Starting Estimate/ })
    .click();
  await expect(page.locator("[data-equipment-price]")).toHaveText("$4,995");
  await expect(page.locator("[data-delivery-price]")).toHaveText("$1,495");
  await expect(page.locator("[data-estimate-total]")).toHaveText("$6,490");
  await expect(page.locator("[data-calculator-status]")).toContainText(
    "No contact information was sent",
  );
  await expect(calculator.getByLabel("Name")).toHaveValue("");
  expect(contactRequests).toBe(0);
});

test("calculator requires contact consent before a quote request", async ({
  page,
}) => {
  await page.goto("/rental-calculator/");
  const calculator = page.locator("#rental-calculator-form");
  await expect(calculator.getByLabel("Name")).toHaveAttribute("required", "");
  await expect(calculator.getByLabel("Phone")).toHaveAttribute("required", "");
  await expect(calculator.getByLabel("Email")).toHaveAttribute("required", "");
  await expect(calculator.getByLabel(/I agree that Temporary123/)).toHaveAttribute(
    "required",
    "",
  );
  await expect(
    calculator.getByRole("button", {
      name: /Calculate Starting Estimate/,
    }),
  ).toBeVisible();
  await expect(
    calculator.getByRole("button", { name: /Request Exact Quote/ }),
  ).toBeDisabled();
  await expect(calculator).toContainText(
    "Online exact-quote requests are not enabled yet",
  );
});

test("calculator separates state, city and ZIP code with browser validation", async ({
  page,
}) => {
  await page.goto("/rental-calculator/");
  const calculator = page.locator("#rental-calculator-form");
  await expect(calculator.locator('select[name="state"]')).toBeVisible();
  await expect(calculator.locator('input[name="city"]')).toBeVisible();
  const zipCode = calculator.locator('input[name="zipCode"]');
  await expect(zipCode).toBeVisible();
  await expect(
    calculator.locator('select[name="state"] option[value="Washington"]'),
  ).toHaveCount(1);
  await zipCode.fill("9836");
  expect(await zipCode.evaluate((input: HTMLInputElement) => input.checkValidity())).toBe(false);
  await zipCode.fill("98362");
  expect(await zipCode.evaluate((input: HTMLInputElement) => input.checkValidity())).toBe(true);
});

test("calculator page keeps cities in static HTML and fits a phone viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const response = await page.goto("/rental-calculator/");
  expect(response?.status()).toBe(200);
  await expect(page.locator("h1")).toHaveText(
    "Nationwide Temporary Facility Rental and Delivery Calculator",
  );
  await expect(
    page.locator(".price-table-wrap strong", { hasText: "Sleeper/Bunkbed Trailer" }),
  ).toBeVisible();
  await expect(
    page.locator(".price-table-wrap strong", { hasText: "Sleeper Modular Container" }),
  ).toBeVisible();
  const html = (await response!.text()).replace(/<!--.*?-->/g, "");
  expect(html).toContain("Port Angeles");
  expect(html).toContain("Temporary facility rental, trailer leasing and delivery planning in Washington");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
