import { describe, expect, it } from "vitest";
import { readableFragmentText } from "../scripts/prerender-text";

describe("prerender breadcrumb text", () => {
  it("keeps words separated across heading line breaks", () => {
    expect(
      readableFragmentText("The right facilities<br />start here."),
    ).toBe("The right facilities start here.");
  });

  it("normalizes authored whitespace without changing words", () => {
    expect(readableFragmentText("  Mobile <em>kitchen</em>   trailers ")).toBe(
      "Mobile kitchen trailers",
    );
  });
});
