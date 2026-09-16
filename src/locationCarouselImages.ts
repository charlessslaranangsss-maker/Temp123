import {
  imagesForServicePath,
  orderedServiceHeroImages,
  type ServiceHeroImage,
} from "./serviceHeroImages";

const familyRoutes = {
  sleeperShared: ["/services/mobile-sleeper-trailers/20ft-shared/"],
  sleeperContractor: ["/services/mobile-sleeper-trailers/20ft-contractor/"],
  sleeperVip: ["/services/mobile-sleeper-trailers/20ft-vip/"],
  sleeperContainerized: ["/remote-containerized-military-berthing-solution-for-rent/"],
  kitchen: [
    "/services/mobile-kitchen-trailers/24ft/",
    "/services/mobile-kitchen-trailers/28ft/",
    "/services/mobile-kitchen-trailers/38ft/",
    "/services/mobile-kitchen-trailers/40ft/",
    "/services/mobile-kitchen-trailers/40ft-combination/",
    "/media-library/40ft-bulk-kitchen/",
    "/services/mobile-kitchen-trailers/40ft-bulk-combination/",
  ],
  dishwashing: [
    "/media-library/22-26ft-low-temp-dish/",
    "/media-library/38ft-low-temp-dish/",
    "/services/dishwashing-trailers/38ft-conveyor/",
  ],
  refrigeration: ["/20ft-refrigeration-trailers/"],
  laundry: [
    "/media-library/30ft-laundry-trailer/",
    "/media-library/26-27ft-laundry-trailer/",
    "/media-library/20ft-laundry-container/",
  ],
  showerRestroomCombination: [
    "/services/shower-restroom-combination-trailers/13ft-3-stall/",
    "/services/shower-restroom-combination-trailers/22ft-6-stall/",
    "/services/shower-restroom-combination-trailers/30ft-8-stall/",
  ],
  showerOnly: [
    "/services/shower-containers/20ft-5-stall/",
    "/media-library/20ft-shower-trailer-sink/",
  ],
  handwashing: ["/equipment-rental/handwashing-stations/"],
  water: ["/media-library/water-tank/"],
  basecamp: [
    "/services/mobile-kitchen-trailers/24ft/",
    "/services/shower-restroom-combination-trailers/22ft-6-stall/",
    "/20ft-refrigeration-trailers/",
  ],
} as const;

function routesForHeadline(headline: string): readonly string[] {
  const normalized = headline.toLowerCase();

  const isSleeper =
    normalized.includes("sleep") ||
    normalized.includes("bunk") ||
    normalized.includes("berth");
  if (isSleeper && normalized.includes("vip")) return familyRoutes.sleeperVip;
  if (isSleeper && normalized.includes("contractor")) {
    return familyRoutes.sleeperContractor;
  }
  if (normalized.includes("containerized") || normalized.includes("berthing")) {
    return familyRoutes.sleeperContainerized;
  }
  if (isSleeper) return familyRoutes.sleeperShared;
  if (normalized.includes("dishwash") || normalized.includes("dish trailer"))
    return familyRoutes.dishwashing;
  if (normalized.includes("laundry")) return familyRoutes.laundry;
  if (normalized.includes("handwash") || normalized.includes("hand wash"))
    return familyRoutes.handwashing;
  if (normalized.includes("water tank") || normalized.includes("water storage"))
    return familyRoutes.water;
  if (normalized.includes("kitchen")) return familyRoutes.kitchen;
  if (normalized.includes("refrigerat")) return familyRoutes.refrigeration;
  if (
    normalized.includes("combination") ||
    (normalized.includes("shower") && normalized.includes("restroom"))
  )
    return familyRoutes.showerRestroomCombination;
  if (normalized.includes("shower")) return familyRoutes.showerOnly;
  if (normalized.includes("restroom"))
    return familyRoutes.showerRestroomCombination;
  return familyRoutes.basecamp;
}

/**
 * Uses only the verified, Drive-derived equipment library. Location wording is
 * deliberately framed as a planning reference; it never claims the equipment
 * was photographed in the named city, region or state.
 */
export function locationCarouselImages(
  location: string,
  headline: string,
): ServiceHeroImage[] {
  const unique = new Map<string, ServiceHeroImage>();

  for (const route of routesForHeadline(headline)) {
    for (const image of imagesForServicePath(route) ?? []) {
      if (!unique.has(image.src)) unique.set(image.src, image);
    }
  }

  const ordered = orderedServiceHeroImages([...unique.values()]);
  const selected = routesForHeadline(headline) === familyRoutes.basecamp
    ? ordered.slice(0, 10)
    : ordered;

  return selected
    .map((image, index) => ({
      ...image,
      id: `location-${index + 1}-${image.id}`,
      alt: `${image.alt}; verified equipment reference for temporary facility rental planning in ${location}`,
      sortOrder: index + 1,
    }));
}
