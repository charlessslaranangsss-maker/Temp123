import { describe, expect, it } from "vitest";
import {
  matchesLocationRentalHeadline,
  regionRentalHeadline,
  rentalCategoryHeadline,
  rentalHubHeadline,
  rentalProductHeadline,
  stateRentalHeadline,
} from "../src/rentalHeadlines";
import { cityHeadline } from "../src/CityDetail";
import { reviewedCityPages } from "../src/cityDirectory";

describe("Boss-approved Temporary123 H1 plan", () => {
  it("keeps location before the commercial use case, equipment, and rental intent", () => {
    expect(stateRentalHeadline("Alabama")).toBe(
      "Alabama Emergency Basecamp Shower Trailer Rental",
    );
    expect(stateRentalHeadline("California")).toBe(
      "California Institutional Facility Shower and Restroom Combination Trailer For Rent",
    );
    expect(stateRentalHeadline("Colorado")).toBe(
      "Colorado Construction Project Kitchen Emergency Trailer Rental",
    );
    expect(stateRentalHeadline("Texas")).toBe(
      "Texas Remote Operations Man Camp Temporary Facilities Rental",
    );
  });

  it("selects region topics deterministically", () => {
    const first = regionRentalHeadline("Olympic Peninsula", "Washington", 0);
    expect(first).toBe(
      regionRentalHeadline("Olympic Peninsula", "Washington", 0),
    );
    expect(
      matchesLocationRentalHeadline(first, "Olympic Peninsula, Washington"),
    ).toBe(true);
  });

  it("rejects missing or out-of-order formula components", () => {
    expect(
      matchesLocationRentalHeadline(
        "Port Angeles, Washington Industrial Basecamp Shower Trailer Rental",
        "Port Angeles, Washington",
      ),
    ).toBe(true);
    expect(
      matchesLocationRentalHeadline(
        "Industrial Basecamp Shower Trailer Rental in Port Angeles, Washington",
        "Port Angeles, Washington",
      ),
    ).toBe(false);
    expect(
      matchesLocationRentalHeadline(
        "Port Angeles, Washington Shower Trailer Rental",
        "Port Angeles, Washington",
      ),
    ).toBe(false);
    expect(
      matchesLocationRentalHeadline(
        "Port Angeles, Washington Industrial Basecamp Rental Shower Trailer",
        "Port Angeles, Washington",
      ),
    ).toBe(false);
  });

  it("uses the three reviewed city focus decisions and preserves held cities", () => {
    const byName = Object.fromEntries(
      reviewedCityPages.map((city) => [city.name, city]),
    );
    expect(cityHeadline(byName["Port Angeles"])).toBe(
      "Port Angeles, Washington Industrial Basecamp Commercial Kitchen Trailer Rental",
    );
    expect(cityHeadline(byName.Tacoma)).toBe(
      "Tacoma, Washington Workforce Housing Sleeper Bunk-Bed Facility Leasing",
    );
    expect(cityHeadline(byName.Olympia)).toBe(
      "Olympia, Washington Institutional Facility Shower and Restroom Combination Trailer For Rent",
    );
    expect(cityHeadline(byName.Seattle)).toBe(
      "Seattle, Washington Construction Project Kitchen Emergency Trailer Rental",
    );
    expect(cityHeadline(byName.Sequim)).toBe(
      "Sequim, Washington Remote Operations Man Camp Temporary Facilities Rental",
    );
  });

  it("normalizes approved category and model headings", () => {
    expect(rentalHubHeadline("/equipment-rental/")).toBe(
      "Nationwide Temporary Facility and Equipment Rental",
    );
    expect(rentalCategoryHeadline("Mobile Kitchens")).toBe(
      "Kitchen Trailer Rental",
    );
    expect(
      rentalCategoryHeadline("Shower and Restroom Combination Trailers"),
    ).toBe("Shower and Restroom Combination Trailer Rental");
    expect(
      rentalProductHeadline(
        "Luxury Shower and Restroom Combination Trailer, 3 Stalls + 1 ADA",
      ),
    ).toBe("ADA Shower and Restroom Combination Trailer Rental");
    expect(
      rentalProductHeadline(
        "22 ft Luxury Shower and Restroom Combination Trailer, 6 Stalls",
      ),
    ).toBe("22 ft 6-Stall Shower and Restroom Combination Trailer Rental");
    expect(rentalProductHeadline("22 ft Shower Trailer, 10 Stalls")).toBe(
      "22 ft 10-Stall Shower Trailer Rental",
    );
  });
});
