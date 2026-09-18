import type { ServiceHeroImage } from "./serviceHeroImages";

type PhotoRow = readonly [
  view: ServiceHeroImage["view"],
  width: number,
  height: number,
  driveFileId: string,
  alt: string,
];

const sizes =
  "(max-width: 700px) calc(100vw - 40px), (max-width: 1100px) 48vw, 680px";

function suppliedSet(
  slug: string,
  rows: readonly PhotoRow[],
): ServiceHeroImage[] {
  return rows.map(([view, width, height, driveFileId, alt], index) => {
    const position = String(index + 1).padStart(2, "0");
    const root = `/images/catalog-supplied/${slug}/${position}`;
    return {
      id: `catalog-supplied-${slug}-${position}`,
      src: `${root}-960.webp`,
      srcSet: `${root}-480.webp 480w, ${root}-960.webp 960w`,
      sizes,
      width,
      height,
      fullSrc: `${root}-960.webp`,
      thumbnail: `${root}-480.webp`,
      sourceUrl: `https://drive.google.com/file/d/${driveFileId}/view`,
      alt,
      view,
      sortOrder: index + 1,
    };
  });
}

const additions: Readonly<Record<string, readonly ServiceHeroImage[]>> = {
  "restroom-trailers": suppliedSet("restroom-trailers", [
    [
      "interior",
      960,
      1277,
      "1WvQ5qESJZT13ciuw6Xpb9vjzV2X8Gdn9",
      "Toilet and wall-mounted sink inside a commercial mobile restroom trailer",
    ],
    [
      "interior",
      960,
      733,
      "1r5-6USyN0FBE0vOtHLJoMCIh4BklsQYQ",
      "Sink counter and mirrors inside a commercial mobile restroom trailer",
    ],
    [
      "interior",
      960,
      1277,
      "1wEwo4WrwxIMkUwS9--yN9ad12T-XIue6",
      "Urinal and sink inside a temporary restroom trailer",
    ],
  ]),
  "dining-structure-rental": suppliedSet("dining-structures", [
    [
      "interior",
      960,
      734,
      "1fDISx3RRLV-SfcY-JSbHwEXoiWhhf9Ft",
      "Illustrative interior layout of a temporary dining structure",
    ],
    [
      "interior",
      960,
      734,
      "1AoukW7CRJHk4pejD9y-Bp7Rus7aPAa5l",
      "Illustrative temporary dining hall furnished with tables and chairs",
    ],
    [
      "interior",
      960,
      734,
      "1EnGtFvkr81BaO8dU9pFGeYqSbzV6b5G8",
      "Illustrative dining structure layout with tables and serving space",
    ],
  ]),
  "stair-rentals": suppliedSet("stair-rentals", [
    [
      "exterior",
      960,
      733,
      "13j1JqwwYXVliz2omKXvFwZo8eCJCHJlU",
      "Representative wood entry stairs with handrails at a mobile trailer",
    ],
    [
      "exterior",
      960,
      734,
      "1tzQt1kcwVaikdPlwH60yUj8Pldt-4Qof",
      "Representative temporary wood stair steps and landing at a mobile trailer entrance",
    ],
  ]),
};

const captions: Readonly<Record<string, string>> = {
  "restroom-trailers":
    "Supplied restroom-only trailer interior photos. Confirm stall count, accessibility, utilities and the available rental or lease configuration with your quote.",
  "dining-structure-rental":
    "Supplied illustrative dining-hall layouts. Confirm the structure, seating plan, utilities, furnishings and available rental or lease system with your quote.",
  "stair-rentals":
    "Supplied representative temporary-trailer stair visuals. Confirm stair height, landing, railings and the available rental or lease system with your quote.",
};

export function catalogPhotoAdditions(id: string): readonly ServiceHeroImage[] {
  return additions[id] ?? [];
}

export function catalogPhotoAdditionCaption(id: string): string {
  return captions[id] ?? "";
}
