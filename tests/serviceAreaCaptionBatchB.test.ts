import { describe, expect, it } from "vitest";
import { captionDetailBatchB } from "../src/serviceAreaCaptionBatchB";

describe("service-area gallery caption details for models 12–22", () => {
  it("covers each assigned verified model with distinct customer copy", () => {
    const ids = Array.from({ length: 11 }, (_, index) => `model-${index + 12}`);
    const copy = ids.map((id) => captionDetailBatchB(id));

    expect(copy.every(Boolean)).toBe(true);
    expect(new Set(copy.map((item) => item?.benefit)).size).toBe(ids.length);
    expect(new Set(copy.map((item) => item?.detail)).size).toBe(ids.length);
    for (const item of copy) {
      expect(item?.benefit).toMatch(/^[a-z]/);
      expect(item?.detail).toMatch(/^[A-Z].*\.$/);
    }
  });

  it("keeps the shower container and trailer identities separate", () => {
    expect(captionDetailBatchB("model-20")?.detail).toContain(
      "container, not a shower trailer",
    );
    expect(captionDetailBatchB("model-21")?.detail).toContain(
      "separate from the 22 ft shower model",
    );
  });

  it("does not claim an unassigned model", () => {
    expect(captionDetailBatchB("model-23")).toBeUndefined();
  });
});
