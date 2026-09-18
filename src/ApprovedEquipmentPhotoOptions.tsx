import { LocationImageCarousel } from "./LocationImageCarousel";
import { ServiceHeroCarousel } from "./ServiceHeroCarousel";
import { imagesForServicePath } from "./serviceHeroImages";

export function ApprovedEquipmentPhotoOptions({
  category,
}: {
  category: string;
}) {
  if (category === "Refrigeration") {
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
            available unit, power requirements and loading access with your
            quote.
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

  if (category !== "Laundry") return null;

  const containerImages =
    imagesForServicePath("/media-library/20ft-laundry-container/") ?? [];
  const trailerImages =
    imagesForServicePath("/media-library/26-27ft-laundry-trailer/") ?? [];

  return (
    <>
      <section
        className="approved-equipment-photo-option"
        id="20ft-laundry-container"
        aria-labelledby="20ft-laundry-container-heading"
      >
        <div>
          <span className="eyebrow">LAUNDRY CONTAINER OPTION</span>
          <h2 id="20ft-laundry-container-heading">20ft Laundry Container</h2>
          <p>
            Reviewed interior references for a 20 ft laundry container used at
            temporary commercial and institutional facilities.
          </p>
          <p>
            No exterior is pictured. Confirm the available unit, interior
            layout, utility connections and rental or lease terms with your
            quote.
          </p>
        </div>
        <ServiceHeroCarousel
          images={containerImages}
          label="20 ft laundry container"
          caption="20 ft laundry container interior references from the reviewed client collection. No exterior is pictured; confirm the available unit and layout with your quote."
        />
      </section>
      <section
        className="approved-equipment-photo-option"
        id="26ft-27ft-laundry-trailer"
        aria-labelledby="26ft-27ft-laundry-trailer-heading"
      >
        <div>
          <span className="eyebrow">LAUNDRY TRAILER OPTION</span>
          <h2 id="26ft-27ft-laundry-trailer-heading">
            26ft-27ft Laundry Trailer (8 Washer/Dryer)
          </h2>
          <p>
            Reviewed interior reference from the client-named 26–27 ft
            commercial laundry-trailer collection.
          </p>
          <p>
            One interior is pictured and no exterior is available. Confirm the
            washer and dryer count, exact length, floor plan, available unit and
            rental or lease terms with your quote.
          </p>
        </div>
        <ServiceHeroCarousel
          images={trailerImages}
          label="26 to 27 ft laundry trailer"
          caption="Representative commercial laundry-trailer interior from the reviewed 26–27 ft collection. Confirm its machine count, exact length and available unit with your quote."
        />
      </section>
    </>
  );
}
