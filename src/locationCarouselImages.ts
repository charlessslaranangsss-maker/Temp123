import manifest from "../content/verified-equipment-images.json" with { type: "json" };
import type { ServiceHeroImage } from "./serviceHeroImages";
import { galleryViewRank } from "./galleryImageOrder";
import { equipmentPhotoPolicy, photoCoverage } from "./equipmentPhotoPolicy";

export type EquipmentFamily =
  | "mobile-kitchen"
  | "kitchen-modular"
  | "dishwashing"
  | "dishwashing-modular"
  | "refrigerated-trailer"
  | "refrigerated-container"
  | "refrigeration-unspecified"
  | "laundry-trailer"
  | "laundry-container"
  | "laundry-unspecified"
  | "shower-trailer"
  | "shower-container"
  | "restroom-trailer"
  | "shower-restroom-combination"
  | "ada-combination"
  | "sleeper-trailer"
  | "sleeper-container"
  | "contractor-accommodation"
  | "vip-accommodation"
  | "office-sleeper-hygiene-trailer"
  | "handwashing-trailer"
  | "water-tank"
  | "ambiguous"
  | "unspecified";

export type VerifiedLocationImage = ServiceHeroImage & {
  family: string;
  model: string;
  sha256: string;
  fullSrc: string;
  thumbnail: string;
  reviewId: string;
};

const normalize = (title: string) =>
  title
    .toLowerCase()
    .normalize("NFKC")
    .replace(/[–—-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/** Only the exact visible title participates. Body copy and city names never select photos. */
export function detectEquipmentFamily(title: string): EquipmentFamily {
  const s = normalize(title);
  const families: EquipmentFamily[] = [];
  const container = /\bcontainer(?:s|ized)?\b/.test(s);
  const trailer = /\btrailer(?:s)?\b/.test(s);
  if (container && trailer) return "ambiguous";
  // A named multifunctional unit is not a standalone sleeper or hygiene trailer.
  if (
    trailer &&
    /\boffice\b/.test(s) &&
    /\bsleeper\b/.test(s) &&
    /\bshower\b/.test(s) &&
    /\brestroom\b/.test(s)
  ) {
    if (/\b(?:kitchen|laundry|ada|container)\b|\bdishwash|\brefrigerat/.test(s))
      return "ambiguous";
    return "office-sleeper-hygiene-trailer";
  }
  if (/\bkitchen\b/.test(s))
    families.push(
      /\bmodular\b|\bbuilding\b/.test(s) ? "kitchen-modular" : "mobile-kitchen",
    );
  if (/\bdishwash\w*|\bdish\s+trailer/.test(s))
    families.push(
      /\bmodular\b/.test(s) ? "dishwashing-modular" : "dishwashing",
    );
  if (/\brefrigerat\w*|\bcold storage\b|\breefer\b/.test(s))
    families.push(
      container
        ? "refrigerated-container"
        : trailer
          ? "refrigerated-trailer"
          : "refrigeration-unspecified",
    );
  if (/\blaundry\b/.test(s))
    families.push(
      container
        ? "laundry-container"
        : trailer
          ? "laundry-trailer"
          : "laundry-unspecified",
    );
  const shower = /\bshower(?:s)?\b/.test(s);
  const restroom = /\brestroom(?:s)?\b/.test(s);
  const combination = /\bcombination\b|\bcombo\b/.test(s);
  const ada = /\bada\b/.test(s);
  if (ada && (combination || shower || restroom))
    families.push("ada-combination");
  else if (combination && (shower || restroom))
    families.push("shower-restroom-combination");
  else {
    if (shower)
      families.push(container ? "shower-container" : "shower-trailer");
    if (restroom) families.push("restroom-trailer");
  }
  const sleep = /\bsleep\w*|\bbunk\s*bed\w*|\bberth\w*/.test(s);
  const accommodation = /\baccommodation\w*/.test(s);
  if ((sleep || accommodation) && /\bvip\b/.test(s))
    families.push("vip-accommodation");
  else if ((sleep || accommodation) && /\bcontractor\b/.test(s))
    families.push("contractor-accommodation");
  else if (sleep)
    families.push(container ? "sleeper-container" : "sleeper-trailer");
  if (/\bhand\s*wash\w*/.test(s) && !(shower && /\bwith\b/.test(s)))
    families.push("handwashing-trailer");
  if (/\bwater\s+(?:storage\s+)?tank\w*/.test(s)) families.push("water-tank");
  return families.length === 1
    ? families[0]
    : families.length
      ? "ambiguous"
      : "unspecified";
}

function resolveSingleLocationGallery(headline: string) {
  const family = detectEquipmentFamily(headline);
  const s = normalize(headline);
  const lengths = [...s.matchAll(/\b(\d+)\s*(?:ft|feet|foot)\b/g)].map((m) =>
    Number(m[1]),
  );
  const range = /\b\d+\s+(?:to\s+)?\d+\s*(?:ft|feet|foot)\b/.test(s);
  const stalls = s.match(/\b(\d+)\s*stalls?\b/);
  const sleeperFourRoom =
    family === "sleeper-trailer" && /\b(?:4|four)\s*rooms?\b/.test(s);
  const sleeperTwoStall =
    family === "sleeper-trailer" && /\b(?:2|two)\s*stalls?\b/.test(s);
  const otherCounts =
    /\b\d+\s*(?:washers?|dryers?|beds?|people|sinks?|rooms?|gallons?|litres?|liters?)\b/.test(
      s,
    );
  const requestedTrailer = /\btrailers?\b/.test(s);
  const empty = (reason: string) => ({
    headline,
    family,
    modelId: null as string | null,
    images: [] as VerifiedLocationImage[],
    reason,
  });
  if (family === "ambiguous")
    return empty(
      "The title names conflicting equipment families or form factors; no mixed gallery is permitted.",
    );
  if (family === "unspecified" || family.endsWith("unspecified"))
    return empty(
      "The title does not identify a single equipment family and form factor.",
    );
  if (range || new Set(lengths).size > 1)
    return empty(
      "A size range or multiple sizes requires an explicitly verified model mapping.",
    );
  if (otherCounts && !sleeperFourRoom)
    return empty(
      "The explicit configuration/count requires additional verified model evidence.",
    );
  let models = manifest.models.filter((m) => m.family === family);
  if (lengths.length) models = models.filter((m) => m.lengthFt === lengths[0]);
  if (stalls) models = models.filter((m) => m.stalls === Number(stalls[1]));
  if (sleeperFourRoom)
    models = models.filter((m) => m.id === "sleeper-four-room");
  if (sleeperTwoStall)
    models = models.filter((m) => m.id === "april-two-stall-sleeper");
  if (
    requestedTrailer &&
    (family === "water-tank" ||
      (["contractor-accommodation", "vip-accommodation"].includes(family) &&
        lengths[0] !== 20))
  )
    return empty(
      "A matching wheeled trailer configuration is not verified for this title.",
    );
  if (family === "mobile-kitchen") {
    const allElectric = /\ball\s+electric\b/.test(s);
    const bulk = /\bbulk\b/.test(s),
      combo = /\bcombination\b|\bcombo\b/.test(s);
    if (allElectric && (bulk || combo))
      return empty(
        "No all-electric bulk or combination-kitchen configuration is established.",
      );
    const configuration = allElectric
      ? "all-electric"
      : bulk && combo
        ? "bulk-combination"
        : bulk
          ? "bulk"
          : combo
            ? "combination"
            : "standard";
    models = models.filter((m) => m.configuration === configuration);
  }
  if (family === "dishwashing") {
    if (/\bhigh\s+temp\w*/.test(s))
      models = models.filter(
        (m) => m.configuration === "high-temperature-conveyor",
      );
    else if (/\blow\s+temp\w*/.test(s))
      models = models.filter((m) => m.configuration === "low-temperature");
    if (/\bconveyor\b/.test(s))
      models = models.filter((m) => m.configuration.includes("conveyor"));
  }
  // Never fill a missing view with another model, even if the family matches.
  const model = [...models]
    .sort((a, b) => a.priority - b.priority || a.id.localeCompare(b.id))
    .find(
      (m) =>
        photoCoverage(
          manifest.images.filter(
            (i) => i.model === m.id && i.status === "approved",
          ),
        ).usable,
    );
  if (!model)
    return empty(
      "No matching verified photography exists for the title's equipment/configuration.",
    );
  const unique = new Set<string>();
  const selected = manifest.images
    .filter(
      (i) =>
        i.model === model.id &&
        i.family === family &&
        i.status === "approved" &&
        !(
          requestedTrailer &&
          ["contractor-accommodation", "vip-accommodation"].includes(family) &&
          i.view === "exterior"
        ),
    )
    .filter((i) => {
      if (unique.has(i.sha256)) return false;
      unique.add(i.sha256);
      return true;
    })
    .sort(
      (a, b) =>
        galleryViewRank(a.view) - galleryViewRank(b.view) ||
        Number("displayOrder" in a ? a.displayOrder : 99) -
          Number("displayOrder" in b ? b.displayOrder : 99) ||
        a.id.localeCompare(b.id),
    );
  const images: VerifiedLocationImage[] = selected.map((image, index) => ({
    id: "verified-" + image.id.replace(/\./g, "-"),
    reviewId: image.id,
    src: image.src,
    srcSet: image.srcSet || image.src,
    sizes:
      "(max-width: 700px) calc(100vw - 36px), (max-width: 1100px) 48vw, 680px",
    width: image.width,
    height: image.height,
    alt: image.alt,
    view: image.view as "interior" | "exterior",
    sortOrder: index + 1,
    sourceUrl: image.original,
    fullSrc: image.original,
    thumbnail: image.thumbnail || image.src,
    family: image.family,
    model: image.model,
    sha256: image.sha256,
  }));
  return { headline, family, modelId: model.id, images, reason: "" };
}

export type LocationGalleryGroup = ReturnType<
  typeof resolveSingleLocationGallery
>;

/**
 * Broad location headings describe multiple services. Charles delegated their
 * image treatment: show explicit named options in separate carousels rather
 * than rewriting an H1 or pretending several families are one physical unit.
 */
export function resolveLocationGallery(headline: string) {
  const single = resolveSingleLocationGallery(headline);
  const title = normalize(headline);
  const context =
    single.family === "kitchen-modular" && !single.images.length
      ? "kitchen-alternatives"
      : single.family === "ada-combination" && !/\b\d+\s*(?:ft|stalls?)\b/.test(title)
        ? "ada-reference"
      : single.family === "sleeper-trailer" &&
          !/\b\d+\s*(?:ft|stalls?|rooms?)\b|\b(?:two|four)\s*(?:stalls?|rooms?)\b/.test(title)
        ? "sleeper-options"
      : single.family === "shower-trailer" &&
          !/\b\d+\s*(?:ft|stalls?)\b/.test(title)
        ? "shower-reference"
      : single.family === "laundry-unspecified"
      ? "laundry"
      : single.family === "unspecified" && /\bman\s+camp\b/.test(title)
        ? "man-camp"
        : single.family === "unspecified" &&
            (/\bfacility rental locations$/.test(title) ||
              title === "usa temporary facilities rental service areas")
          ? "directory"
          : null;
  if (!context)
    return {
      ...single,
      context: null,
      groups: single.images.length ? [single] : [],
    };
  const optionTitles = context === "kitchen-alternatives"
    ? ["38 ft Mobile Kitchen Trailer", "24 ft Mobile Kitchen Trailer"]
    : context === "ada-reference"
      ? ["ADA Shower and Restroom Combination Trailer", "22 ft Shower-Restroom Combination Trailer"]
    : context === "sleeper-options"
      ? ["Two-Stall Sleeper Trailer", "Four-Room Sleeper Trailer"]
    : context === "shower-reference"
      ? ["20 ft Shower Trailer"]
    : equipmentPhotoPolicy.delegatedSelection.contextGalleries[context];
  const groups = optionTitles
    .map(resolveSingleLocationGallery)
    .filter((group) => group.images.length > 0);
  return {
    ...single,
    context,
    reason: groups.length ? "" : single.reason,
    images: groups.flatMap((group) => group.images),
    groups,
  };
}

/** Compatibility API; location is intentionally not used for image selection or alt text. */
export function locationCarouselImages(
  _location: string,
  headline: string,
): VerifiedLocationImage[] {
  return resolveLocationGallery(headline).images;
}
