import { describe, expect, it } from "vitest";
import { createElement, Fragment } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { load } from "cheerio";
import { resolveLocationGallery } from "../src/locationCarouselImages";
import { LocationImageCarousel } from "../src/LocationImageCarousel";
import {
  imagesForServicePath,
  servicePhotoCaption,
} from "../src/serviceHeroImages";
import { referenceCaptionForModel } from "../src/equipmentPhotoPolicy";

describe("Charles delegated photo selection", () => {
  it.each([
    ["USA Temporary Facilities Rental Service Areas", "directory", 3],
    ["Central Alabama, Alabama Facility Rental Locations", "directory", 3],
    [
      "Texas Remote Operations Man Camp Temporary Facilities Rental",
      "man-camp",
      3,
    ],
    [
      "Iowa Workforce Camp Laundry Temporary Facilities Long-Term Rental",
      "laundry",
      2,
    ],
  ])("separates the equipment options for %s", (title, context, count) => {
    const result = resolveLocationGallery(String(title));
    expect(result.context).toBe(context);
    expect(result.groups).toHaveLength(Number(count));
    const $ = load(
      renderToStaticMarkup(
        createElement(LocationImageCarousel, { headline: String(title) }),
      ),
    );
    expect($("[data-verified-photo-pending]")).toHaveLength(0);
    expect($("[data-gallery-group]")).toHaveLength(Number(count));
    result.groups.forEach((group, index) => {
      const node = $("[data-gallery-group]").eq(index);
      expect(node.find("h3").text()).toBe(group.headline);
      expect(node.find("[data-service-carousel]")).toHaveLength(1);
      expect(new Set(group.images.map((i) => i.family))).toEqual(
        new Set([group.family]),
      );
      expect(new Set(group.images.map((i) => i.model))).toEqual(
        new Set([group.modelId]),
      );
      expect(new Set(group.images.map((i) => i.sha256)).size).toBe(
        group.images.length,
      );
      expect(group.images.map((i) => i.view)).toEqual(
        [...group.images]
          .sort(
            (a, b) =>
              Number(a.view === "exterior") - Number(b.view === "exterior"),
          )
          .map((i) => i.view),
      );
    });
  });
  it("does not make an arbitrary fallback for an unknown or conflicting title", () => {
    for (const title of [
      "Unknown equipment",
      "Kitchen and Dishwashing Trailer",
      "24 ft Laundry Trailer",
      "40 ft All Electric Kitchen",
    ])
      expect(resolveLocationGallery(title).images, title).toHaveLength(0);
  });
  it("uses the client-labelled ADA reference only generically, not for exact variants", () => {
    const generic = resolveLocationGallery(
      "ADA Shower and Restroom Combination Trailer",
    );
    expect(generic.groups.map((group) => group.modelId)).toEqual(["client-labelled-ada-reference", "model-10"]);
    expect(generic.groups[0].images.map((i) => i.reviewId)).toEqual(["catalog-restroom"]);
    expect(referenceCaptionForModel(generic.modelId)).toContain("not shown");
    for (const title of [
      "3 Stalls + 1 ADA Combination Trailer",
      "8 Stalls + 1 ADA Combination Trailer",
      "22 ft ADA Combination Trailer",
    ])
      expect(resolveLocationGallery(title).images).toHaveLength(0);
  });
  it("uses the named laundry interior and discloses the 24ft reference difference", () => {
    expect(
      imagesForServicePath("/services/laundry-trailers/30ft/")?.map(
        (i) => i.reviewId,
      ),
    ).toEqual(["08.01"]);
    const reference = imagesForServicePath(
      "/services/laundry-trailers/24ft/",
    );
    expect(reference).toHaveLength(1);
    expect(reference?.[0].alt).toContain(
      "26 to 27 ft commercial laundry trailer",
    );
    expect(
      servicePhotoCaption("/services/laundry-trailers/24ft/"),
    ).toContain("does not establish the separate 24 ft layout");
  });
  it("keeps contractor and VIP interior references separate and does not infer a chassis", () => {
    const contractor = imagesForServicePath(
      "/services/mobile-sleeper-trailers/20ft-contractor/",
    )!;
    const vip = imagesForServicePath(
      "/services/mobile-sleeper-trailers/20ft-vip/",
    )!;
    expect(contractor.map((i) => i.reviewId)).toEqual(["22.01", "22.04"]);
    expect(vip.map((i) => i.reviewId)).toEqual(["23.07"]);
    expect([...contractor, ...vip].every((i) => i.view === "interior")).toBe(
      true,
    );
  });
  it("starts the location kitchen carousel with the wide interior", () => {
    expect(
      resolveLocationGallery("Mobile Kitchen Trailer").images[0].reviewId,
    ).toBe("12.05");
  });
  it("uses distinct control IDs when the same equipment is rendered twice", () => {
    const $ = load(
      renderToStaticMarkup(
        createElement(
          Fragment,
          null,
          createElement(LocationImageCarousel, {
            headline: "Mobile Kitchen Trailer",
          }),
          createElement(LocationImageCarousel, {
            headline: "Mobile Kitchen Trailer",
          }),
        ),
      ),
    );
    const ids = $(".service-carousel-viewport")
      .toArray()
      .map((el) => $(el).attr("id"));
    expect(ids).toHaveLength(2);
    expect(new Set(ids).size).toBe(2);
    $("[aria-controls]").each((_, el) =>
      expect(ids).toContain($(el).attr("aria-controls")),
    );
  });
});
