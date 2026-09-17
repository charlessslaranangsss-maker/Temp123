import type { CatalogItem } from "./EquipmentCatalog";
import type { ServiceHeroImage } from "./serviceHeroImages";
import { resolveLocationGallery } from "./locationCarouselImages";
import { referenceCaptionForModel } from "./equipmentPhotoPolicy";

const titles: Record<string, string> = {
  "laundry-trailers": "30 ft Laundry Trailer",
  "handwashing-stations": "Handwashing Sink Trailer",
  "mobile-sleep-trailers": "Two-Stall Sleeper Trailer",
  "bunkhouse-trailers": "Two-Stall Sleeper Trailer",
  "refrigeration-trailers": "20 ft Refrigerated Trailer",
  "mobile-kitchen-trailers": "24 ft Mobile Kitchen Trailer",
  "refrigerated-containers": "40 ft Refrigerated Container",
};
const held: Record<string, string> = {
  "restroom-trailers":
    "The previous image showed a shower/restroom combination, not a restroom-only trailer. Matching restroom-only photography is pending.",
  "temporary-shower-trailers":
    "The catalogue names the 22 ft, ten-stall model. Existing five-stall or combination-unit photographs do not verify that exact configuration.",
  "shower-trailer":
    "The catalogue names the 22 ft, ten-stall model. Its exact photography is pending; a generic shower interior does not establish the model.",
  "stair-rentals":
    "The previous image showed a ramp and deck rather than a clearly identified stair rental. Matching stair photography is pending.",
  "dining-structure-rental":
    "The previous image showed a kitchen fleet, not a dining structure. Matching dining-space photography is pending.",
};
const reviewed: Record<
  string,
  { alt: string; caption: string; view: ServiceHeroImage["view"] }
> = {
  "classroom-trailers": {
    alt: "Classroom trailer floor-plan reference showing desks and a teaching area",
    caption:
      "Classroom layout reference, not a photograph. Confirm the actual room dimensions, seating and access.",
    view: "plan",
  },
  "mobile-office-trailers": {
    alt: "Office trailer exterior with entry steps and a visible desk area",
    caption:
      "Office-trailer reference. Confirm the actual workspace layout, dimensions and equipment.",
    view: "exterior",
  },
  "military-command-center-trailers": {
    alt: "Command-center trailer floor-plan reference with office, conference and workstation areas",
    caption:
      "Command-center layout reference, not a photograph. Communications equipment and actual dimensions require confirmation.",
    view: "plan",
  },
  "mobile-command-trailers": {
    alt: "Mobile command and office trailer exterior with desks visible through an open door",
    caption:
      "Command and office trailer reference. Confirm the operational equipment and actual layout.",
    view: "exterior",
  },
  "mobile-crew-camps": {
    alt: "Crew camp site-plan reference identifying separate accommodation and support facilities",
    caption:
      "Illustrative camp layout, not a deployment photograph. Each building or trailer is a separate product.",
    view: "plan",
  },
  "security-camera-trailers": {
    alt: "Security camera trailer with solar panels and mounted cameras",
    caption:
      "Camera-trailer reference. Coverage, power autonomy and monitoring equipment must be confirmed for the actual unit.",
    view: "exterior",
  },
  "tent-rentals": {
    alt: "Interior of an empty temporary framed tent structure",
    caption:
      "Temporary tent-structure interior reference. Confirm footprint, intended use and installation requirements.",
    view: "interior",
  },
  "ramp-rentals": {
    alt: "Raised access ramp and deck with railings beside temporary units",
    caption:
      "Ramp and deck reference. Dimensions, slope and suitability for the specific access requirement must be confirmed.",
    view: "exterior",
  },
  "wastewater-freshwater-container": {
    alt: "White water-storage tank beside temporary units",
    caption:
      "Water-storage reference. Confirm the actual tank, intended water use, capacity and servicing; potable or wastewater suitability is not established visually.",
    view: "exterior",
  },
  "modular-buildings": {
    alt: "Structural assembly work at a temporary building site",
    caption:
      "Building-assembly reference, not a completed modular interior. Confirm the actual building system and layout.",
    view: "exterior",
  },
  "fencing-barricades-trash-receptacles": {
    alt: "Catalogue reference showing plastic and concrete barricades",
    caption:
      "Barricade reference; fencing and receptacles are not pictured. Confirm the specific site-control equipment required.",
    view: "exterior",
  },
  "generator-trailers": {
    alt: "Towable enclosed generators parked in an equipment yard",
    caption:
      "Generator-trailer reference. Confirm output, electrical connections, fuel and servicing for the selected unit.",
    view: "exterior",
  },
  "breakroom-trailer": {
    alt: "Breakroom trailer floor-plan reference with seating and counter areas",
    caption:
      "Breakroom layout reference, not a photograph. Confirm the available seating, furnishings and dimensions.",
    view: "plan",
  },
};

export function catalogPhotoCoverage(item: CatalogItem): {
  images: ServiceHeroImage[];
  caption: string;
  status: string;
} {
  if (held[item.id])
    return { images: [], caption: held[item.id], status: "held" };
  if (titles[item.id]) {
    const gallery = resolveLocationGallery(titles[item.id]);
    return {
      images: gallery.images,
      caption: referenceCaptionForModel(gallery.modelId),
      status: gallery.images.length ? "verified-reference" : "held",
    };
  }
  const review = reviewed[item.id];
  if (!review)
    return {
      images: [],
      caption: "Matching equipment imagery awaits review.",
      status: "unreviewed",
    };
  return {
    images: [
      {
        id: "catalog-reviewed-" + item.id,
        src: item.large,
        srcSet:
          item.small +
          " " +
          item.smallWidth +
          "w" +
          (item.largeWidth > item.smallWidth
            ? ", " + item.large + " " + item.largeWidth + "w"
            : ""),
        sizes: "(max-width: 700px) calc(100vw - 40px), 680px",
        width: item.width,
        height: item.height,
        fullSrc: item.image,
        sourceUrl: item.source,
        alt: review.alt,
        view: review.view,
        sortOrder: 1,
      },
    ],
    caption: review.caption,
    status:
      review.view === "plan" ? "reviewed-layout" : "reviewed-catalog-reference",
  };
}
