import { captionDetailBatchA } from "./serviceAreaCaptionBatchA";
import { captionDetailBatchB } from "./serviceAreaCaptionBatchB";
import { captionDetailBatchC } from "./serviceAreaCaptionBatchC";

/** Customer-facing copy for a dedicated service page that previously used the
 * generic reviewed-photo fallback. Image-specific disclosures remain owned by
 * servicePhotoCaption and take precedence in ServiceDetail. */
export function dedicatedServiceGalleryCaption(
  equipmentName: string,
  modelId: string | null,
): string | undefined {
  if (!modelId) return undefined;
  const product =
    captionDetailBatchA(modelId) ??
    captionDetailBatchB(modelId) ??
    captionDetailBatchC(modelId);
  if (!product) return undefined;

  const equipment = equipmentName.replace(/^(\d+)ft\b/i, "$1 ft");
  return `Commercial Project and Base Camp ${equipment} Rental or Lease. Discuss weekly rental, monthly rental, or yearly rental and lease options for ${product.benefit}. ${product.detail} Call us now at +1 (800) 443-5212, available 24/7.`;
}
