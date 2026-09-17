import { LocationImageCarousel } from "./LocationImageCarousel";

/** Only April's specifically requested 20ft-container reference; no generic category additions. */
export function ApprovedEquipmentPhotoOptions({
  category,
}: {
  category: string;
}) {
  if (category !== "Refrigeration") return null;
  return (
    <section
      className="approved-equipment-photo-option"
      id="20ft-refrigerated-container"
      aria-labelledby="20ft-container-heading"
    >
      <div>
        <span className="eyebrow">REFRIGERATED CONTAINER OPTION</span>
        <h2 id="20ft-container-heading">20 ft Refrigerated Container</h2>
        <p>
          Interior reference for the 20 ft container option. Confirm the
          available unit, power requirements and loading access with your quote.
        </p>
        <p>
          No container exterior is pictured.{" "}
          <a href="/20ft-refrigeration-trailers/">
            Compare the 20 ft refrigerated trailer
          </a>
          .
        </p>
      </div>
      <LocationImageCarousel headline="20 ft Refrigerated Container" />
    </section>
  );
}
