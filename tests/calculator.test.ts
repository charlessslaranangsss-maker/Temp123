import { describe, expect, it } from "vitest";
import {
  calculatorDuration,
  calculatorService,
  calculateStartingEstimate,
  deliveryStartingPrice,
  equipmentStartingPrice,
} from "../src/calculatorData";

describe("rental calculator pricing", () => {
  it("uses the published delivery increments", () => {
    expect(deliveryStartingPrice(20)).toBe(995);
    expect(deliveryStartingPrice(25)).toBe(1495);
    expect(deliveryStartingPrice(40)).toBe(2995);
  });

  it("keeps sleeper equipment choices independently priced", () => {
    expect(equipmentStartingPrice("sleeper-bunkbed-trailer", 8)).toBe(4995);
    expect(equipmentStartingPrice("sleeper-modular-container", 8)).toBe(2495);
  });

  it("calculates man camp pricing per person", () => {
    expect(equipmentStartingPrice("man-camp", 35)).toBe(7000);
    expect(calculateStartingEstimate("man-camp", 20, 35)).toEqual({
      equipment: 7000,
      delivery: 995,
      total: 7995,
    });
  });

  it("rejects unsupported lengths and invalid occupancy", () => {
    expect(() => deliveryStartingPrice(22)).toThrow(RangeError);
    expect(() => equipmentStartingPrice("man-camp", 0)).toThrow(RangeError);
  });

  it("maps equipment and dates to the existing inquiry schema", () => {
    expect(calculatorService("mobile-kitchen")).toBe("mobile-kitchens");
    expect(calculatorService("shower-trailer")).toBe(
      "restroom-shower-trailers",
    );
    expect(calculatorService("man-camp")).toBe("workforce-housing");
    expect(calculatorDuration("2026-10-01", "2026-10-15")).toBe(
      "under-1-month",
    );
    expect(calculatorDuration("2026-10-01", "2027-04-01")).toBe(
      "6-plus-months",
    );
    expect(() => calculatorDuration("2026-10-15", "2026-10-01")).toThrow(
      RangeError,
    );
  });
});
