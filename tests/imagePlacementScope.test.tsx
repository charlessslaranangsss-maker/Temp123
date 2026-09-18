import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { load } from "cheerio";
import { Site } from "../src/Site";
import { CityDirectoryPage } from "../src/CityDirectoryPage";
import { regionPages } from "../src/regionGuides";
import { ApprovedEquipmentPhotoOptions } from "../src/ApprovedEquipmentPhotoOptions";

describe("Charles scope correction: change existing imagery, not the page layout", () => {
  it("keeps the Service Areas hero map-focused, retaining all 50 modal templates", () => {
    const $ = load(
      renderToStaticMarkup(createElement(Site, { path: "/service-areas/" })),
    );
    expect($(".location-hero-copy h1").text()).toBe(
      "USA Temporary Facilities Rental Service Areas",
    );
    expect($(".location-hero-copy [data-location-gallery]")).toHaveLength(0);
    expect($(".location-hero-copy img")).toHaveLength(0);
    expect($(".location-hero-copy [data-verified-photo-pending]")).toHaveLength(
      0,
    );
    expect($("#service-area-map")).toHaveLength(1);
    expect($("template[data-state-gallery-template]")).toHaveLength(50);
    expect($("#state-services-dialog")).toHaveLength(1);
  });
  it("adds labelled equipment galleries to all 246 city directories without changing heading or search", () => {
    expect(regionPages).toHaveLength(246);
    for (const guide of regionPages) {
      const $ = load(
        renderToStaticMarkup(createElement(CityDirectoryPage, { guide })),
      );
      expect($("[data-location-gallery]"), guide.path).toHaveLength(1);
      expect($("[data-gallery-group]"), guide.path).toHaveLength(3);
      expect($("[data-carousel-caption]"), guide.path).toHaveLength(3);
      expect($("img[data-carousel-alt]"), guide.path).toHaveLength(13);
      expect($("[data-product-tabs]"), guide.path).toHaveLength(1);
      expect($("[data-verified-photo-pending]"), guide.path).toHaveLength(0);
      expect($("h1")).toHaveLength(1);
      expect($("#city-directory-search")).toHaveLength(1);
      expect($(".city-directory-source")).toHaveLength(1);
    }
  }, 30000);
  it.each([
    "Mobile Kitchens",
    "Dishwashing",
    "Shower",
    "Restroom",
    "Shower and Restroom Combination Trailers",
    "Sleeper",
    "Handwashing Trailers",
  ])("does not inject an unrequested photo section for %s", (category) => {
    expect(
      renderToStaticMarkup(
        createElement(ApprovedEquipmentPhotoOptions, { category }),
      ),
    ).toBe("");
  });
  it("places the two requested laundry options on the existing laundry hub", () => {
    const $ = load(
      renderToStaticMarkup(
        createElement(ApprovedEquipmentPhotoOptions, { category: "Laundry" }),
      ),
    );
    expect($("#20ft-laundry-container [data-carousel-slide]")).toHaveLength(3);
    expect($("#26ft-27ft-laundry-trailer [data-carousel-slide]")).toHaveLength(
      1,
    );
    expect(
      $("#20ft-laundry-container [data-image-view='exterior']"),
    ).toHaveLength(0);
    expect(
      $("#26ft-27ft-laundry-trailer [data-image-view='exterior']"),
    ).toHaveLength(0);
    expect($.text()).toContain("Confirm the washer and dryer count");
  });
  it("preserves April's specifically requested 20ft container inside-only reference", () => {
    const $ = load(
      renderToStaticMarkup(
        createElement(ApprovedEquipmentPhotoOptions, {
          category: "Refrigeration",
        }),
      ),
    );
    expect($("[data-carousel-slide]")).toHaveLength(1);
    expect($("[data-image-review-id='april-container-19-02']")).toHaveLength(1);
    expect($("[data-image-view='exterior']")).toHaveLength(0);
  });
});
