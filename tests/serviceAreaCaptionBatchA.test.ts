import { describe, expect, it } from "vitest";
import manifest from "../content/verified-equipment-images.json" with { type: "json" };
import { captionDetailBatchA } from "../src/serviceAreaCaptionBatchA";

describe("service-area gallery copy batch A", () => {
  it("covers each assigned verified model with concise product details", () => {
    for (let number = 1; number <= 11; number += 1) {
      const id = `model-${String(number).padStart(2, "0")}`;
      expect(manifest.models.some((model) => model.id === id)).toBe(true);
      const copy = captionDetailBatchA(id);
      expect(copy?.benefit.length).toBeGreaterThan(20);
      expect(copy?.detail).toMatch(/\.$/);
      expect(copy?.detail).not.toMatch(/deployment in|reference photos|guaranteed/i);
    }
  });

  it("preserves the distinct laundry and shower/restroom form factors", () => {
    expect(captionDetailBatchA("model-06")?.detail).toContain("container, not a trailer");
    expect(captionDetailBatchA("model-08")?.detail).toContain("trailer, not the 20 ft container");
    expect(captionDetailBatchA("model-09")?.detail).toContain("13 ft three-stall");
    expect(captionDetailBatchA("model-10")?.detail).toContain("22 ft six-stall");
  });

  it("does not invent copy for models assigned elsewhere", () => {
    expect(captionDetailBatchA("model-12")).toBeUndefined();
  });
});
