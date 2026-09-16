# Phase 1 Page-to-Asset Mapping

Date: 2026-09-15  
Scope: source-backed mapping only; no component, public-asset, route, publish, or deployment change

## Outcome

The inventory maps 54 current service/equipment routes and 9 homepage category cards in `audit/phase1-page-image-map.csv`. Every route is marked for an exact-equipment carousel. Homepage cards remain single thumbnails unless product direction changes, but their thumbnail must still belong to the linked equipment family.

The current site is not ready to claim exact trailer imagery across these pages. Most model pages have one static representative image, and the same image is reused across multiple lengths or configurations. An image may enter a carousel only after the separate Drive inventory confirms its equipment family, model/length, stall count, ADA configuration, and form factor.

## Confirmed high-priority mapping defects

1. The homepage **Shower trailers** card uses `/images/catalog/temporary-shower-trailers-960.webp`. The image itself is labeled “Shower and Restroom Facilities — ADA Room,” so it is a combination-unit image, not a shower-only image.
2. The homepage **Restroom trailers** card uses `/media/ce44e887e6e1812d2195e955.webp`. It belongs to the same “Shower and Restroom Facilities — ADA Room” series, so it is not evidence of a restroom-only trailer.
3. `/equipment-rental/shower-trailer/`, `/services/shower-trailers/22ft-10-stall/`, and `/services/shower-containers/20ft-5-stall/` use the same combination ADA-room image. The container page additionally has a trailer/container form-factor mismatch.
4. The restroom category page and all four restroom model pages use imagery labeled as a shower-and-restroom ADA facility. These need confirmed restroom-only assets or must be reclassified to the truthful combination product.
5. `/equipment-rental/refrigerated-containers/` is resolved by `service-details.json` before the catalog item. That override displays the generic refrigeration-trailer image even though the catalog has a refrigerated-container asset.
6. `/remote-containerized-military-berthing-solution-for-rent/` uses a generic mobile-sleeper trailer image rather than a confirmed containerized sleeper image.

## Reuse that must not be treated as exact-model evidence

- Seven mobile-kitchen model pages reuse one mobile-kitchen image.
- Four dishwashing model pages reuse one dishwashing image.
- Four restroom model pages reuse one restroom/combination image.
- Two laundry model pages reuse one laundry layout.
- Three sleeper model pages reuse one sleeper image.
- Five shower-and-restroom combination model pages reuse one ADA-room image despite different lengths, stall counts, and accessibility configurations.
- Shower-only trailer and shower-container pages reuse combination-unit imagery.

Representative family imagery is acceptable only when the page and caption explicitly say it is representative. It does not satisfy the new exact-model carousel requirement.

## Expected Drive-folder mapping rule

The CSV names the expected folder taxonomy for each page. Final folder IDs and asset lists must be reconciled against the separately owned `docs/phase1/DRIVE_ASSET_INVENTORY.md`; this task did not inspect or modify that active task's artifact.

Required matching keys, in descending order, are:

1. Equipment family: kitchen, dishwashing, refrigeration, shower-only, restroom-only, shower/restroom combination, sleeper, laundry, or handwashing.
2. Form factor: trailer, container, modular unit, station, plan, or supporting equipment.
3. Exact published length or model.
4. Capacity/configuration, including stalls, shared/contractor/VIP, conveyor, bulk/combination, and ADA status.
5. View: interior, exterior, floor plan, or visible feature.

If any key is unknown, quarantine the asset as `unverified`; do not fill the gap with a neighboring size, category, or visually similar unit.

## Stable image data contract

Each route should receive deterministic structured data rather than filename guessing:

```ts
type EquipmentImageAsset = {
  id: string;
  src: string;
  srcSet?: string;
  width: number;
  height: number;
  alt: string;
  family: string;
  formFactor: "trailer" | "container" | "modular" | "station" | "plan" | "other";
  model?: string;
  lengthFt?: number;
  capacity?: string;
  ada?: boolean;
  view: "interior" | "exterior" | "plan" | "detail";
  sourceFolderId: string;
  sourceFileId: string;
  verification: "confirmed" | "unverified";
  sortOrder: number;
};
```

Route records should reference an ordered array of asset IDs. Sort confirmed assets as: first interior, second exterior, then remaining exact-unit views. If either the interior or exterior is unavailable, keep the known exact images and record the missing view; never substitute a different model.

## Alt-text rule

Write one concise description of what is actually visible, with the exact model only when the asset identity is confirmed. Examples:

- `Interior cooking line in the 28 ft mobile kitchen trailer`
- `Exterior of the 22 ft shower trailer with ten private stall doors`
- `Floor plan for the 24 ft mobile laundry trailer`

Do not repeat “rental,” city names, or keyword variants in every image. Decorative UI icons use empty alt text; informative equipment images do not.

## Carousel acceptance criteria

- Render the initial image and meaningful alt text in server-generated HTML so essential image context does not depend on interaction.
- Use a native button for previous/next controls, visible focus, accessible names, and arrow-key operation when focus is in the carousel.
- Announce slide position without repeatedly interrupting screen-reader users; thumbnails expose the target image name and selected state.
- Support touch swipe without preventing normal vertical page scrolling.
- Preserve a stable aspect ratio at phone, tablet, laptop, and wide-screen sizes; do not crop away equipment identity.
- Do not auto-rotate. If motion is later added, honor `prefers-reduced-motion` and provide a pause control.
- Eager-load only the first above-the-fold image. Lazy-load later slides, provide width/height, responsive `srcset`/`sizes`, and avoid downloading all full-resolution images on initial render.
- Keep links and controls usable without JavaScript where practical; the first image and caption remain visible as progressive enhancement.

## Implementation gate

Do not implement the carousels until the Drive inventory supplies confirmed file-to-model matches. The CSV can then be joined on the expected folder/model fields, after which the high-priority homepage Shower and Restroom thumbnails should be corrected first and all 54 route heroes migrated from static figures to validated ordered image arrays.
