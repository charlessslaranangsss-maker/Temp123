import { describe, expect, it } from "vitest";
import fs from "node:fs";
import { createHash } from "node:crypto";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { load } from "cheerio";
import additions from "../content/equipment-photo-additions.json" with { type: "json" };
import manifest from "../content/verified-equipment-images.json" with { type: "json" };
import { resolveLocationGallery } from "../src/locationCarouselImages";
import { LocationImageCarousel } from "../src/LocationImageCarousel";
import { imagesForServicePath } from "../src/serviceHeroImages";
import { referenceCaptionForModel } from "../src/equipmentPhotoPolicy";

describe("Two explicitly supplied multifunctional photo sources", () => {
  it("registers every downloaded source as one exterior, with exact original bytes", () => {
    expect(additions.images).toHaveLength(2);
    for (const row of additions.images) {
      const bytes = fs.readFileSync("public" + row.original);
      expect(bytes.length).toBe(row.bytes);
      expect(createHash("sha256").update(bytes).digest("hex")).toBe(row.sha256);
      const use = manifest.images.find((i) => i.id === row.id)!;
      expect(use.view).toBe("exterior");
      expect(use.reviewedVisually).toBe(true);
      expect(fs.existsSync("public" + use.src)).toBe(true);
      expect(fs.existsSync("public" + use.thumbnail)).toBe(true);
    }
  });
  it.each([
    ["38ft All Electric Kitchen", "26.01"],
    ["38-foot All-Electric Kitchen Trailer Rental", "26.01"],
    ["Multifunctional Trailer (38ft All Electric Kitchen)", "26.01"],
    ["Office, Sleeper and Shower & Restroom Trailer", "27.01"],
  ])("keeps the specific supplied title isolated: %s", (title, id) => {
    const result = resolveLocationGallery(title);
    expect(result.images.map((i) => i.reviewId)).toEqual([id]);
    expect(result.context).toBeNull();
    expect(result.groups).toHaveLength(1);
  });
  it.each([
    "40 ft All Electric Kitchen",
    "38 ft All Electric Bulk Kitchen",
    "38 ft All Electric Kitchen Modular Building",
    "20 ft Office, Sleeper and Shower & Restroom Trailer",
    "ADA Office, Sleeper and Shower & Restroom Trailer",
  ])("does not infer an unsupported configuration: %s", (title) => {
    expect(resolveLocationGallery(title).images).toHaveLength(0);
  });
  it.each([
    "38 ft Mobile Kitchen Trailer",
    "Mobile Kitchen Trailer",
    "Sleeper Trailer",
    "Shower Trailer",
    "Restroom Trailer",
    "Shower and Restroom Combination Trailer",
    "20 ft VIP Sleeper Trailer",
    "20 ft Contractor Sleeper Trailer",
  ])("does not substitute the new multifunctional sources into %s", (title) => {
    expect(
      resolveLocationGallery(title).images.some((i) =>
        additions.images.some((a) => a.id === i.reviewId),
      ),
    ).toBe(false);
  });
  it("keeps the existing standard 38ft route unchanged", () => {
    expect(resolveLocationGallery("38 ft Mobile Kitchen Trailer").modelId).toBe(
      "model-14",
    );
    const images = imagesForServicePath(
      "/services/mobile-kitchen-trailers/38ft/",
    )!;
    expect(images).toHaveLength(2);
    expect(
      images.some((i) => additions.images.some((a) => a.id === i.reviewId)),
    ).toBe(false);
  });
  it("renders each prepared reference with truthful caption and original full-image source", () => {
    for (const model of additions.models) {
      const $ = load(
        renderToStaticMarkup(
          createElement(LocationImageCarousel, { headline: model.name }),
        ),
      );
      const expected = additions.images.find((i) => i.model === model.id)!;
      expect($("[data-carousel-slide]")).toHaveLength(1);
      expect($("[data-image-view]").attr("data-image-view")).toBe("exterior");
      expect(
        $("[data-carousel-slide] img").attr("data-carousel-full-src"),
      ).toBe(expected.original);
      expect($("[data-carousel-slide] img").attr("alt")).toBe(expected.alt);
      expect($("[data-carousel-caption]").text()).toBe(
        referenceCaptionForModel(model.id),
      );
      expect($("[data-service-carousel]").attr("data-carousel-lightbox-label")).toBe(model.name);
      expect(
        $("[data-service-carousel]").attr("data-carousel-lightbox-label"),
      ).toBe(model.name);
      expect($("[data-carousel-next]")).toHaveLength(0);
      expect($("[data-carousel-zoom]")).toHaveLength(1);
    }
  });
});
