import { describe, expect, it } from "vitest";
import { olympicPeninsulaGalleryCaption } from "../src/olympicPeninsulaGalleryCopy";

const headline =
  "Olympic Peninsula, Washington Remote Operations Man Camp Temporary Facilities Rental";

describe("Olympic Peninsula gallery review copy", () => {
  it("keeps three product identities and inquiry terms separate", () => {
    const groups = [
      [
        "new-office-sleeper-shower-restroom",
        "Commercial Base Camp Office, Sleeper, Shower & Restroom Trailer",
      ],
      ["new-38ft-all-electric-kitchen", "Commercial Base Camp 38 ft All Electric Kitchen"],
      ["model-21", "Industrial Base Camp 20 ft Five Stall Shower Trailer"],
    ] as const;
    for (const [id, equipment] of groups) {
      const caption = olympicPeninsulaGalleryCaption(headline, id);
      expect(caption).toContain(
        `Olympic Peninsula, Washington ${equipment} Rental or Lease`,
      );
      expect(caption).toMatch(/weekly rental, monthly rental, or yearly rental and lease options/);
      expect(caption).toContain("Call us now at 800-443-5212 — available 24/7.");
    }
  });

  it("gives each equipment group its own supported customer use", () => {
    expect(
      olympicPeninsulaGalleryCaption(
        headline,
        "new-office-sleeper-shower-restroom",
      ),
    ).toContain("a temporary site office and crew accommodations");
    expect(olympicPeninsulaGalleryCaption(headline, "new-office-sleeper-shower-restroom")).toContain("Plan sleeping, showers, and restrooms together");
    expect(
      olympicPeninsulaGalleryCaption(headline, "new-38ft-all-electric-kitchen"),
    ).toContain("on-site crew meal preparation");
    expect(olympicPeninsulaGalleryCaption(headline, "new-38ft-all-electric-kitchen")).toContain("electrical supply and meal-service needs");
    expect(olympicPeninsulaGalleryCaption(headline, "model-21")).toContain("private crew showers and external handwashing sinks");
    expect(olympicPeninsulaGalleryCaption(headline, "model-21")).toContain("not the separate 22 ft shower trailer");
  });

  it("does not change other pages or unknown models", () => {
    expect(
      olympicPeninsulaGalleryCaption(headline, "model-08"),
    ).toBeUndefined();
    expect(
      olympicPeninsulaGalleryCaption(
        "Texas Remote Operations Man Camp Temporary Facilities Rental",
        "model-21",
      ),
    ).toBeUndefined();
  });
});
