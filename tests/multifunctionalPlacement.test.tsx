import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { load } from "cheerio";
import additions from "../content/equipment-photo-additions.json" with { type: "json" };
import { resolveLocationGallery } from "../src/locationCarouselImages";
import { LocationImageCarousel } from "../src/LocationImageCarousel";
import { equipmentPhotoPolicy } from "../src/equipmentPhotoPolicy";
import { describeGalleryAudit } from "../scripts/gallery-audit-description";
import { stateGuides } from "../src/stateGuides";
import { regionPages } from "../src/regionGuides";
import { reviewedCityPages } from "../src/cityDirectory";
import { cityHeadline } from "../src/CityDetail";
import {
  stateRentalHeadline,
  regionRentalHeadline,
} from "../src/rentalHeadlines";

const titles = [
  ...Object.keys(stateGuides).map(stateRentalHeadline),
  ...regionPages.map((g) => regionRentalHeadline(g.region, g.state, g.index)),
  ...reviewedCityPages.map(cityHeadline),
].filter((title) => /\bMan Camp Temporary Facilities\b/.test(title));

describe("Authorized multifunctional placements in existing man-camp photo groups", () => {
  it("replaces exactly two existing selections without adding a fourth group", () => {
    expect(
      equipmentPhotoPolicy.delegatedSelection.contextGalleries["man-camp"],
    ).toEqual([
      "Office, Sleeper and Shower & Restroom Trailer",
      "38ft All Electric Kitchen",
      "20 ft Shower Trailer",
    ]);
    expect(titles).toHaveLength(42);
  });

  it.each(titles)(
    "displays new files in isolated, accurately labelled groups: %s",
    (title) => {
      const gallery = resolveLocationGallery(title);
      const $ = load(
        renderToStaticMarkup(
          createElement(LocationImageCarousel, { headline: title }),
        ),
      );
      expect(gallery.context).toBe("man-camp");
      expect(gallery.groups).toHaveLength(3);
      expect($("[data-gallery-group]")).toHaveLength(3);
      expect($("h1")).toHaveLength(0);
      expect($(".location-gallery-context").text()).toContain(
        "separate products",
      );
      for (const model of additions.models) {
        const image = additions.images.find((i) => i.model === model.id)!;
        const group = gallery.groups.find((g) => g.modelId === model.id)!;
        expect(group.images.map((i) => i.reviewId)).toEqual([image.id]);
        const node = $('[data-group-model="' + model.id + '"]');
        expect(node.find("h3").text()).toBe(model.name);
        expect(node.find("[data-carousel-slide]")).toHaveLength(1);
        expect(node.find("[data-carousel-slide]").attr("data-image-view")).toBe(
          "exterior",
        );
        expect(
          node.find("[data-carousel-slide] img").attr("data-carousel-full-src"),
        ).toBe(image.original);
        expect(node.find("[data-carousel-slide] img").attr("alt")).toBe(
          image.alt,
        );
        expect(
          node
            .find("[data-service-carousel]")
            .attr("data-carousel-lightbox-label"),
        ).toBe(model.name);
        expect(node.find("[data-carousel-caption]").text()).toBe(model.caption);
      }
      expect(gallery.groups[2].modelId).toBe("model-21");
      const report = describeGalleryAudit(gallery);
      expect(report.presentation).toBe("separate-options");
      expect(report.groupCount).toBe(3);
      expect(report.correctionsMade).not.toContain("single verified");
      expect(report.imageGroups.map((g) => g.exactTitle)).toEqual(
        equipmentPhotoPolicy.delegatedSelection.contextGalleries["man-camp"],
      );
    },
  );
});
