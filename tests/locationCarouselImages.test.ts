import { describe, expect, it } from "vitest";
import { locationCarouselImages } from "../src/locationCarouselImages";

describe("locationCarouselImages", () => {
  it("keeps every interior/detail image before exterior images", () => {
    const images = locationCarouselImages(
      "Port Angeles, Washington",
      "Port Angeles, Washington Industrial Basecamp Shower Trailer Rental",
    );
    const firstExterior = images.findIndex(
      (image) => image.view === "exterior",
    );

    expect(images.length).toBeGreaterThan(1);
    expect(firstExterior).toBeGreaterThan(0);
    expect(
      images
        .slice(0, firstExterior)
        .every((image) => ["interior", "detail"].includes(image.view)),
    ).toBe(true);
  });

  it("uses kitchen imagery for kitchen-specific location pages", () => {
    const images = locationCarouselImages(
      "Texas",
      "Texas Commercial Mobile Kitchen Trailer Rental",
    );

    expect(images).not.toHaveLength(0);
    expect(
      images.every((image) => image.alt.toLowerCase().includes("kitchen")),
    ).toBe(true);
  });

  it("does not mix shower-restroom combination imagery into shower-only pages", () => {
    const images = locationCarouselImages(
      "Texas",
      "Texas Commercial Shower Trailer Rental",
    );

    expect(images).not.toHaveLength(0);
    expect(
      images.every((image) =>
        !image.alt.toLowerCase().includes("restroom combination"),
      ),
    ).toBe(true);
  });

  it("does not mix shower-only imagery into combination pages", () => {
    const images = locationCarouselImages(
      "Texas",
      "Texas Commercial Shower and Restroom Combination Trailer Rental",
    );

    expect(images).not.toHaveLength(0);
    expect(
      images.every((image) => {
        const alt = image.alt.toLowerCase();
        return !alt.includes("shower container") &&
          !alt.includes("handwashing sinks");
      }),
    ).toBe(true);
  });

  it("describes images as planning references without claiming local photography", () => {
    const images = locationCarouselImages(
      "Olympic Peninsula, Washington",
      "Olympic Peninsula, Washington Temporary Basecamp Facilities Rental",
    );

    expect(
      images.every((image) =>
        image.alt.includes("verified equipment reference"),
      ),
    ).toBe(true);
    expect(
      images.every((image) =>
        image.alt.includes("Olympic Peninsula, Washington"),
      ),
    ).toBe(true);
  });

  it("uses bunk-bed sleeper imagery for shared mobile sleeper location pages", () => {
    const images = locationCarouselImages(
      "Tacoma, Washington",
      "Tacoma, Washington Mobile Sleeper Bunk-Bed Trailer Rental",
    );

    expect(images.length).toBeGreaterThan(1);
    images.forEach(({ alt }) => {
      expect(alt.toLowerCase()).toMatch(/sleeper|bunk-bed/);
      expect(alt.toLowerCase()).not.toMatch(/kitchen|shower|restroom|refrigerat|dishwash/);
    });
  });

  it("keeps VIP and contractor sleeper variants separate", () => {
    const vip = locationCarouselImages(
      "Tacoma, Washington",
      "Tacoma, Washington VIP Mobile Sleeper Trailer Rental",
    );
    const contractor = locationCarouselImages(
      "Tacoma, Washington",
      "Tacoma, Washington Contractor Mobile Sleeper Trailer Rental",
    );

    expect(vip).toHaveLength(1);
    expect(vip[0].alt.toLowerCase()).toMatch(/vip|private/);
    expect(vip[0].alt.toLowerCase()).not.toMatch(/shared|contractor|bunk/);
    expect(contractor.length).toBeGreaterThan(0);
    contractor.forEach(({ alt }) =>
      expect(alt.toLowerCase()).toContain("contractor"),
    );
  });
});
