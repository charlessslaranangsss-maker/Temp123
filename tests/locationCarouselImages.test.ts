import { describe, expect, it } from "vitest";
import { createHash } from "node:crypto";
import fs from "node:fs";
import {
  detectEquipmentFamily,
  resolveLocationGallery,
  locationCarouselImages,
} from "../src/locationCarouselImages";
import manifest from "../content/verified-equipment-images.json" with { type: "json" };

describe("exact-title equipment classification", () => {
  it.each([
    ["Texas Mobile Kitchen Trailer Rental", "mobile-kitchen"],
    [
      "Colorado Construction Project Kitchen Emergency Trailer Rental",
      "mobile-kitchen",
    ],
    ["Commercial Kitchen Modular Building For Rent", "kitchen-modular"],
    ["Dishwashing Trailer Rental", "dishwashing"],
    ["Refrigerated Trailer Rental", "refrigerated-trailer"],
    ["Refrigerated Container Rental", "refrigerated-container"],
    ["Laundry Trailer Rental", "laundry-trailer"],
    ["Laundry Container Rental", "laundry-container"],
    ["Laundry Temporary Facilities Rental", "laundry-unspecified"],
    ["Emergency Shower Trailer Rental", "shower-trailer"],
    ["20 ft Shower Trailer with Handwashing Sinks", "shower-trailer"],
    ["Shower Container Rental", "shower-container"],
    ["Restroom Trailer Rental", "restroom-trailer"],
    ["Shower-Restroom Combination Rental", "shower-restroom-combination"],
    ["ADA Combination Rental", "ada-combination"],
    ["ADA Shower and Restroom Combination Trailer Leasing", "ada-combination"],
    ["Sleeper/Bunkbed Trailer Rental", "sleeper-trailer"],
    [
      "Tacoma Workforce Housing Sleeper Bunk-Bed Facility Leasing",
      "sleeper-trailer",
    ],
    ["Sleeper Container Rental", "sleeper-container"],
    ["Contractor Accommodation Rental", "contractor-accommodation"],
    ["VIP Accommodation Rental", "vip-accommodation"],
    ["Handwashing Sink Trailer Rental", "handwashing-trailer"],
    ["Water Tank Rental", "water-tank"],
    ["Mobile Kitchen and Dishwashing Trailer Rental", "ambiguous"],
    ["Shower and Restroom Trailer Rentals", "ambiguous"],
    ["Refrigerated Trailers and Containers", "ambiguous"],
    ["Man Camp Temporary Facilities Rental", "unspecified"],
    ["USA Temporary Facilities Rental Service Areas", "unspecified"],
    ["Pacific Coast Facility Rental Locations", "unspecified"],
  ])("%s identifies %s without using body copy", (title, family) => {
    expect(detectEquipmentFamily(title)).toBe(family);
  });
  it.each([
    "Restroom Trailer Rental",
    "3-Stall 1-ADA Combination Rental",
    "22 ft 10-Stall Shower Trailer Rental",
    "26 ft Mobile Kitchen Rental",
    "24 ft Laundry Trailer Rental",
    "26 ft Laundry Trailer Rental",
    "12 ft Refrigerated Trailer Rental",
    "12 ft Refrigerated Container Rental",
    "24 ft VIP Accommodation Rental",
    "VIP Sleeper Trailer Rental",
    "Contractor Sleeper Trailer Rental",
    "22 ft 8-Stall Shower-Restroom Combination Trailer",
    "22-26 ft Dishwashing Trailer",
    "Unknown Temporary Facilities Rental",
    "Mobile Kitchen and Dishwashing Trailer Rental",
  ])("withholds unverified configuration: %s", (title) => {
    const result = resolveLocationGallery(title);
    expect(result.images).toHaveLength(0);
    expect(result.reason.length).toBeGreaterThan(0);
  });
  it("labels verified mobile kitchen photos as alternatives to a modular building", () => {
    const result = resolveLocationGallery("Commercial Kitchen Modular Building Rental");
    expect(result.context).toBe("kitchen-alternatives");
    expect(result.groups).toHaveLength(2);
    expect(result.groups.every((group) => group.images.length > 0)).toBe(true);
    expect(result.groups[0].modelId).toBe("model-14");
    expect(result.groups[0].images.every((image) => image.view === "interior")).toBe(true);
  });
  it("shows separately labelled ADA, combination, sleeper and shower references", () => {
    expect(resolveLocationGallery("ADA Shower and Restroom Combination Trailer").groups.map((group) => group.modelId)).toEqual(["client-labelled-ada-reference", "model-10"]);
    expect(resolveLocationGallery("Workforce Housing Sleeper Bunk-Bed Facility Leasing").groups.map((group) => group.modelId)).toEqual(["april-two-stall-sleeper", "sleeper-four-room"]);
    expect(resolveLocationGallery("Emergency Basecamp Shower Trailer Rental").groups.map((group) => group.modelId)).toEqual(["model-21"]);
  });
  it.each([
    ["24 ft Mobile Kitchen Trailer", "model-12"],
    ["28 ft Mobile Kitchen Trailer", "model-13"],
    ["40 ft Mobile Kitchen Trailer", "model-18"],
    ["40 ft Bulk Kitchen Trailer", "model-16"],
    ["40 ft Combination Kitchen Trailer", "model-17"],
    ["40 ft Bulk Combination Kitchen Trailer", "model-15"],
    ["22 ft 6-Stall Shower-Restroom Combination Trailer", "model-10"],
    ["13 ft 3-Stall Shower-Restroom Combination Trailer", "model-09"],
    ["20 ft 5-Stall Shower Trailer", "model-21"],
    ["20 ft 5-Stall Shower Container", "model-20"],
    ["20 ft Laundry Container", "model-06"],
    ["40 ft Refrigerated Container", "reefer-catalog"],
    ["20 ft Refrigerated Trailer", "model-19"],
    ["20 ft Refrigerated Container", "april-20ft-refrigerated-container"],
    ["2-Stall Sleeper Trailer", "april-two-stall-sleeper"],
    ["Four-Room Sleeper Trailer", "sleeper-four-room"],
    ["38 ft High Temperature Conveyor Dishwashing Trailer", "model-03"],
    ["38 ft Low Temperature Dishwashing Trailer", "model-04"],
  ])("selects one exact model for %s", (title, model) => {
    const result = resolveLocationGallery(title);
    expect(result.modelId).toBe(model);
    expect(result.images.length).toBeGreaterThan(0);
    expect(new Set(result.images.map((i) => i.model))).toEqual(
      new Set([model]),
    );
  });
  it("never mixes configurations for a generic kitchen title", () => {
    const images = locationCarouselImages(
      "Texas",
      "Mobile Kitchen Trailer Rental",
    );
    expect(images).toHaveLength(5);
    expect(new Set(images.map((i) => i.model))).toEqual(new Set(["model-12"]));
    expect(images.map((i) => i.view)).toEqual([
      "interior",
      "interior",
      "interior",
      "interior",
      "exterior",
    ]);
  });
  it("uses the visually reviewed view, not the misleading filename", () => {
    const images = resolveLocationGallery(
      "Shower-Restroom Combination Trailer Rental",
    ).images;
    expect(images.map((i) => i.reviewId)).toEqual([
      "10.05",
      "10.07",
      "10.01",
      "10.02",
      "10.06",
    ]);
    expect(images[0].fullSrc).toContain("entry-steps");
    expect(images[0].view).toBe("interior");
  });
  it("does not call exterior handwashing fixtures interior views", () => {
    const images = resolveLocationGallery("20 ft Shower Trailer").images;
    expect(images.find((i) => i.reviewId === "21.04")?.view).toBe("exterior");
    expect(images.find((i) => i.reviewId === "21.08")?.view).toBe("exterior");
  });
  it("never uses container-on-flatbed images for sleeper trailers", () => {
    const images = resolveLocationGallery("Sleeper Trailer Rental").images;
    expect(images.map((i) => i.reviewId)).toEqual(["24.01", "24.08", "23.09"]);
    expect(images.slice(0, 2).every((i) => i.view === "interior")).toBe(true);
    expect(
      resolveLocationGallery("Four-Room Sleeper Trailer").images.map(
        (i) => i.reviewId,
      ),
    ).toEqual(["23.09"]);
  });
  it("is deterministic and does not append invented location claims to alt text", () => {
    const title = "Alabama Emergency Basecamp Shower Trailer Rental";
    expect(locationCarouselImages("Alabama", title)).toEqual(
      locationCarouselImages("Tokyo", title),
    );
    expect(
      locationCarouselImages("Alabama", title).some((i) =>
        i.alt.includes("Alabama"),
      ),
    ).toBe(false);
  });
});

describe("reviewed image integrity", () => {
  it("records every reviewed source and verifies its exact bytes", () => {
    expect(manifest.images).toHaveLength(156); // 154 existing uses + 2 newly reviewed original files.
    for (const image of manifest.images) {
      expect(image.reviewedVisually).toBe(true);
      const bytes = fs.readFileSync("public" + image.original);
      expect(createHash("sha256").update(bytes).digest("hex"), image.id).toBe(
        image.sha256,
      );
      if (image.status === "withheld")
        expect(image.reason.length).toBeGreaterThan(0);
      else {
        expect(image.alt.length).toBeGreaterThan(10);
        expect(fs.existsSync("public" + image.src), image.id).toBe(true);
        expect(["interior", "exterior"]).toContain(image.view);
      }
    }
  }, 20000);
  it("has no duplicate approved image bytes within a model", () => {
    for (const model of manifest.models) {
      const rows = manifest.images.filter(
        (i) => i.status === "approved" && i.model === model.id,
      );
      expect(new Set(rows.map((i) => i.sha256)).size).toBe(rows.length);
    }
  });
});
