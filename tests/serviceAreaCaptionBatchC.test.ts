import { describe, expect, it } from "vitest";
import { captionDetailBatchC } from "../src/serviceAreaCaptionBatchC";

describe("service-area caption batch C", () => {
  it("keeps shared refrigerated-container interior evidence distinct from a trailer exterior", () => {
    const copy = captionDetailBatchC("april-20ft-refrigerated-container");
    expect(copy?.benefit).toContain("20 ft container-based cold storage");
    expect(copy?.detail).toContain("shared refrigeration reference");
    expect(copy?.detail).not.toMatch(/trailer exterior/i);
  });

  it("avoids claiming that the generic ADA catalogue image proves accessibility", () => {
    const copy = captionDetailBatchC("client-labelled-ada-reference");
    expect(copy?.detail).toContain("ask our team");
    expect(copy?.detail).not.toMatch(
      /ADA compliant|wheelchair accessible|meets ADA/i,
    );
  });

  it("keeps the two multifunctional models' benefits distinct", () => {
    const kitchen = captionDetailBatchC("new-38ft-all-electric-kitchen");
    const camp = captionDetailBatchC("new-office-sleeper-shower-restroom");
    expect(kitchen?.benefit).toContain("meal preparation");
    expect(camp?.benefit).toContain("site office");
    expect(kitchen?.detail).not.toEqual(camp?.detail);
  });

  it("returns no invented copy for an unassigned model", () => {
    expect(captionDetailBatchC("model-01")).toBeUndefined();
  });
});
