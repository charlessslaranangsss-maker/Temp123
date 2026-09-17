import { commercialUseCases, locationRentalIntents } from "./rentalHeadlines";
import { captionDetailBatchA } from "./serviceAreaCaptionBatchA";
import { captionDetailBatchB } from "./serviceAreaCaptionBatchB";
import { captionDetailBatchC } from "./serviceAreaCaptionBatchC";

/** Visible sales copy for an approved equipment reference on a location page. */
export function serviceAreaGalleryCaption(
  pageHeadline: string,
  equipmentHeadline: string,
  modelId: string | null,
): string | undefined {
  if (!modelId) return undefined;
  const product =
    captionDetailBatchA(modelId) ??
    captionDetailBatchB(modelId) ??
    captionDetailBatchC(modelId);
  if (!product) return undefined;
  const useCase = commercialUseCases.find((value) =>
    pageHeadline.includes(` ${value} `),
  );
  const isDirectory = !useCase && pageHeadline.endsWith(" Facility Rental Locations");
  if (!useCase && !isDirectory) return undefined;
  const location = isDirectory
    ? pageHeadline.slice(0, -" Facility Rental Locations".length)
    : pageHeadline.slice(0, pageHeadline.indexOf(` ${useCase} `));
  if (!location || !equipmentHeadline) return undefined;
  const isSingleProduct = equipmentHeadline === pageHeadline;
  const rentalIntent = [...locationRentalIntents]
    .sort((a, b) => b.length - a.length)
    .find((value) => pageHeadline.endsWith(` ${value}`));
  if (!rentalIntent && !isDirectory) return undefined;
  const equipment = isSingleProduct
    ? pageHeadline
        .slice(location.length + useCase!.length + 2, -rentalIntent!.length)
        .trim()
    : equipmentHeadline;

  return `${location} ${useCase ?? "Commercial Project and Base Camp"} ${equipment} Rental or Lease. Discuss weekly rental, monthly rental, or yearly rental and lease options for ${product.benefit}. ${product.detail} Call us now at +1 (800) 443-5212, available 24/7.`;
}
