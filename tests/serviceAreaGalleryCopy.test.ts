import { describe, expect, it } from "vitest";
import { serviceAreaGalleryCaption } from "../src/serviceAreaGalleryCopy";

describe("service-area gallery captions", () => {
  it("uses location, commercial use and the pictured equipment once", () => {
    expect(
      serviceAreaGalleryCaption(
        "Alabama Emergency Basecamp Shower Trailer Rental",
        "Alabama Emergency Basecamp Shower Trailer Rental",
        "model-21",
      ),
    ).toMatch(/^Alabama Emergency Basecamp Shower Trailer Rental or Lease\./);
  });

  it("keeps separate broad-page equipment groups distinct", () => {
    const headline =
      "Texas Remote Operations Man Camp Temporary Facilities Rental";
    expect(
      serviceAreaGalleryCaption(headline, "38ft All Electric Kitchen", "new-38ft-all-electric-kitchen"),
    ).toMatch(/^Texas Remote Operations 38ft All Electric Kitchen Rental or Lease\./);
    expect(serviceAreaGalleryCaption(headline, "20 ft Shower Trailer", "model-21")).toMatch(
      /^Texas Remote Operations 20 ft Shower Trailer Rental or Lease\./,
    );
  });

  it("does not invent a location for a non-location image slot", () => {
    expect(
      serviceAreaGalleryCaption(
        "20 ft Refrigerated Container",
        "20 ft Refrigerated Container",
        "april-20ft-refrigerated-container",
      ),
    ).toBeUndefined();
  });

  it("keeps the approved leasing intent", () => {
    expect(
      serviceAreaGalleryCaption(
        "Florida Accessible Commercial Site ADA Shower and Restroom Combination Trailer Leasing",
        "Florida Accessible Commercial Site ADA Shower and Restroom Combination Trailer Leasing",
        "client-labelled-ada-reference",
      ),
    ).toMatch(
      /^Florida Accessible Commercial Site ADA Shower and Restroom Combination Trailer Rental or Lease\./,
    );
  });

  it("uses a product benefit, rental terms, and the approved direct call to action", () => {
    const caption = serviceAreaGalleryCaption(
      "Texas Remote Operations Man Camp Temporary Facilities Rental",
      "20 ft Shower Trailer",
      "model-21",
    );
    expect(caption).toContain("Discuss weekly rental, monthly rental, or yearly rental and lease options");
    expect(caption).toContain("Call us now at +1 (800) 443-5212, available 24/7.");
    expect(caption).not.toContain("These equipment reference photos can help plan your site");
  });

  it("writes a location-specific caption for a city directory product tab", () => {
    expect(serviceAreaGalleryCaption(
      "Ozarks, Arkansas Facility Rental Locations",
      "24 ft Mobile Kitchen Trailer",
      "model-12",
    )).toMatch(/^Ozarks, Arkansas Commercial Project and Base Camp 24 ft Mobile Kitchen Trailer Rental or Lease\./);
  });
});
