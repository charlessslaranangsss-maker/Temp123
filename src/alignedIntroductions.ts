import { detectEquipmentFamily } from "./locationCarouselImages";
import overrides from "../content/aligned-page-introductions.json" with { type: "json" };

/** Visible lead copy only; original metadata and source archives remain separate. */
export function alignedPageIntro(
  path: string,
  headline: string,
  fallback = "",
): string {
  const exact = overrides[path as keyof typeof overrides];
  if (exact) return exact;
  const family = detectEquipmentFamily(headline);
  const subject = headline
    .replace(
      /\s+(?:long-term |short-term )?(?:rental|rentals|leasing|for rent)$/i,
      "",
    )
    .trim();
  const purpose: Record<string, string> = {
    "mobile-kitchen":
      "provides temporary cooking and food-preparation space. Match the cooking line and preparation layout to your menu, meal volume and service schedule, then confirm power, water, drainage and trailer access for the available unit.",
    "kitchen-modular":
      "provides a building-based approach to temporary food preparation and cooking. Plan the modular footprint, appliance layout, utility connections and installation requirements; a kitchen trailer is a different form factor.",
    dishwashing:
      "provides dedicated space for washing serviceware and kitchen utensils. Match the washing process and throughput to your operation, then confirm loading space, hot-water supply, power and drainage.",
    "refrigerated-trailer":
      "provides trailer-based refrigerated storage for temperature-sensitive supplies. Confirm temperature requirements, usable volume, loading access, electrical supply and trailer delivery space.",
    "refrigerated-container":
      "provides container-based refrigerated storage. Review usable space, loading access, temperature requirements, power and container placement separately from a towable trailer.",
    "laundry-trailer":
      "provides trailer-based washing and drying space for crew laundry. Match machine capacity and washing schedules to the laundry volume, then confirm power, water, drainage and service access.",
    "laundry-container":
      "provides container-based washing and drying space. Confirm the machine layout, laundry volume, utilities and container placement rather than assuming a towable chassis.",
    "shower-trailer":
      "provides shower-only washing facilities for temporary sites and interrupted permanent washrooms. Confirm the available stall layout, peak use, hot-water supply, drainage and servicing. Shower/restroom combinations are separate products.",
    "shower-container":
      "provides washing facilities in a container-based unit. Review the shower layout, hot-water supply, drainage and container access; its delivery method differs from a shower trailer.",
    "shower-restroom-combination":
      "combines shower and toilet facilities in the named trailer option. Confirm the stall arrangement, privacy, water heating, wastewater capacity and service access for the actual unit.",
    "ada-combination":
      "is an accessible shower-and-restroom combination option for project planning. Confirm the actual accessible room, access route, ramp, floor plan and dimensions; catalogue imagery alone does not verify those features.",
    "restroom-trailer":
      "is for temporary toilet and handwashing access. Confirm the restroom-only configuration, stall count, accessibility, water and wastewater servicing. A combination-unit reference does not establish a restroom-only model.",
    "sleeper-trailer":
      "provides temporary crew sleeping space between shifts. Review bed layout, privacy, ventilation, occupancy and placement; interior reference images do not establish an unlisted trailer length.",
    "sleeper-container":
      "provides container-based crew accommodation. Confirm the bunk layout, privacy, ventilation, occupancy and container lifting or placement requirements.",
    "contractor-accommodation":
      "provides contractor sleeping accommodation for extended assignments. Confirm the bunk layout, occupancy, ventilation and delivery form factor; an interior view does not establish the chassis.",
    "vip-accommodation":
      "provides private-room accommodation rather than communal bunk sleeping. Confirm the room layout, furnishings, utilities and actual delivery configuration before booking.",
    "handwashing-trailer":
      "provides handwashing access at temporary work areas. Confirm sink access, expected users, water supply, drainage and servicing for the selected unit.",
    "water-tank":
      "supports temporary water storage. Confirm the intended use, capacity, connections and servicing; potable-water suitability is not established by an exterior image.",
    "office-sleeper-hygiene-trailer":
      "combines office, sleeping, shower and toilet functions in a multifunctional reference. Confirm room separation, occupancy, utilities and actual dimensions before booking.",
  };
  return purpose[family]
    ? "The " + subject + " rental option " + purpose[family]
    : fallback;
}

export function alignedLocationIntro(
  headline: string,
  location: string,
  cities: readonly string[] = [],
): string {
  const family = detectEquipmentFamily(headline);
  const use = /workforce camp/i.test(headline)
    ? "workforce camps"
    : /workforce housing/i.test(headline)
      ? "crews working away from home"
      : /construction project/i.test(headline)
        ? "construction projects"
        : /institutional facility/i.test(headline)
          ? "institutional operations"
          : /accessible commercial site/i.test(headline)
            ? "commercial sites with accessibility requirements"
            : /industrial basecamp/i.test(headline)
              ? "industrial basecamps"
              : /emergency basecamp/i.test(headline)
                ? "emergency basecamps"
                : /commercial food service/i.test(headline)
                  ? "commercial food-service operations"
                  : "your operation";
  const mode = /long-term/i.test(headline)
    ? "long-term rental"
    : /short-term/i.test(headline)
      ? "short-term rental"
      : /leasing/i.test(headline)
        ? "leasing"
        : "rental";
  const subjects: Record<string, [string, string]> = {
    "mobile-kitchen": [
      /kitchen emergency trailer/i.test(headline)
        ? "emergency commercial kitchen trailer"
        : "commercial kitchen trailer",
      "Plan cooking and preparation space around your menu, meal volume and service schedule. Confirm the cooking line, power, potable water, drainage and trailer access.",
    ],
    "kitchen-modular": [
      "commercial kitchen modular building",
      "Plan the cooking and preparation building around the menu, workflow, installation footprint and utilities. Confirm the modular layout; kitchen-trailer photographs are not a substitute for building imagery.",
    ],
    "laundry-unspecified": [
      "temporary laundry facilities",
      "Compare the separately labelled 30 ft laundry trailer and 20 ft laundry container interiors. Match washing and drying requirements to crew size, laundry volume, utilities and the appropriate delivery method.",
    ],
    "laundry-trailer": [
      "laundry trailer",
      "Plan trailer-based washing and drying capacity around crew size and laundry volume. Confirm the machines, washing schedules, power, water, drainage and delivery footprint.",
    ],
    "laundry-container": [
      "laundry container",
      "Plan container-based washing and drying space around crew size and laundry volume. Confirm machine layout, utility connections and container placement.",
    ],
    "shower-trailer": [
      "shower-only trailer",
      "Plan private washing facilities around peak use, hot-water supply, water connections, wastewater and servicing access. The gallery identifies its reference unit; confirm the actual available shower-only layout.",
    ],
    "shower-restroom-combination": [
      "shower and restroom combination trailer",
      "Plan shower and toilet access together, with privacy, stall layout, water heating and wastewater servicing. Match the required combination configuration to its identified equipment reference.",
    ],
    "ada-combination": [
      "ADA shower and restroom combination trailer",
      "Review accessible washing and toilet facilities, the access route, ramp and room layout. The catalogue reference does not show the accessible room or ramp; confirm those features and the actual configuration before booking.",
    ],
    "sleeper-trailer": [
      "sleeper and bunk-bed facilities",
      "Plan sleeping space around occupancy, shifts, privacy and ventilation. Bunk-room photos are references; confirm the available layout, trailer dimensions and delivery access.",
    ],
    dishwashing: [
      "dishwashing trailer",
      "Plan dedicated warewashing around serviceware volume, washing equipment, loading space, hot water and drainage. Confirm the washing process and throughput.",
    ],
    "refrigerated-trailer": [
      "refrigerated trailer",
      "Plan cold storage around temperature requirements, inventory volume and loading frequency. Confirm power, door access and the trailer delivery footprint.",
    ],
    "refrigerated-container": [
      "refrigerated container",
      "Plan container-based cold storage around temperature, usable volume, loading access and power. Confirm container handling and placement separately from trailer delivery.",
    ],
    "restroom-trailer": [
      "restroom-only trailer",
      "Plan toilet and handwashing access around users, accessibility and servicing frequency. Confirm the available restroom-only unit, water and wastewater arrangements.",
    ],
  };
  let result: string;
  if (/\bman camp\b/i.test(headline)) {
    result =
      "Plan " + mode + " of man-camp temporary facilities in " +
      location +
      " for remote operations. Compare the separately labelled office/sleeper/shower-restroom trailer, 38 ft all-electric kitchen reference and shower-only trailer. Coordinate accommodation, food preparation, hygiene, utilities and delivery while confirming each product's actual layout.";
  } else if (subjects[family]) {
    const [subject, details] = subjects[family];
    const rentalPhrase = subject.endsWith("facilities")
      ? `${mode} of ${subject}`
      : `${subject} ${mode}`;
    result =
      "Arrange " +
      rentalPhrase +
      " in " +
      location +
      " for " +
      use +
      ". " +
      details;
  } else {
    result =
      "Explore rental locations in " +
      location +
      ". Choose a listed city or regional guide to review the relevant equipment, site requirements and rental planning information.";
  }
  if (cities.length)
    result +=
      " For sites near " +
      cities.slice(0, 2).join(" or ") +
      ", provide the exact delivery address and access details.";
  return result;
}

// Equipment-specific answers where the legacy regional summary omitted the primary family.
export function locationRentalPlanningAnswer(headline: string): string | undefined {
  const briefs: Record<string, string> = {
    "kitchen-modular": "Discuss rental of a commercial kitchen modular building for food-service operations. Review the building layout, cooking and preparation workflow, installation footprint and utility connections. A kitchen trailer is a separate equipment option, not a specification for the modular building.",
    "ada-combination": "Discuss rental or leasing of an accessible shower and restroom combination trailer. Review both washing and toilet needs, the accessible room, approach route, ramp, utilities and servicing. Confirm the actual accessible configuration rather than relying on a standard combination trailer reference.",
    "laundry-unspecified": "Discuss long-term rental of temporary laundry facilities for a workforce camp. Match washing and drying capacity to crew numbers and laundry volume, then confirm power, water, drainage and placement. Compare the separately identified trailer and container options for the required site layout.",
  };
  return briefs[detectEquipmentFamily(headline)];
}

