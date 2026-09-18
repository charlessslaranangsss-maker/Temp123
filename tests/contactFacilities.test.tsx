import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { load } from "cheerio";
import { describe, expect, it } from "vitest";
import { leadSchema } from "../server/schema";
import { QuoteForm } from "../src/QuoteForm";

const requestedFacilities = [
  ["dishwashing", "Dishwashing"],
  ["refrigeration", "Refrigeration"],
  ["sleeper", "Sleeper"],
  ["laundry", "Laundry"],
  ["sink", "Sink"],
] as const;

const validLead = {
  name: "Test Person",
  email: "test@example.com",
  phone: "+1 555 010 2000",
  startDate: "2026-10-01",
  location: "Test site",
  duration: "1-3-months",
  industry: "construction",
  message: "A synthetic project inquiry for tests.",
  consent: true,
  website: "",
  page: "/contact/",
};

describe("Contact Us facility options", () => {
  it("renders every requested facility in the selector", () => {
    const $ = load(renderToStaticMarkup(createElement(QuoteForm)));
    const select = $('select[name="service"]');

    for (const [value, label] of requestedFacilities) {
      const option = select.find(`option[value="${value}"]`);
      expect(option, value).toHaveLength(1);
      expect(option.text().trim(), value).toBe(label);
    }
  });

  it.each(requestedFacilities)("accepts %s at the server boundary", (service) => {
    expect(leadSchema.safeParse({ ...validLead, service }).success).toBe(true);
  });
});
