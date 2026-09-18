import { catalogPhotoCoverage } from "./catalogImageCoverage";
import { ServiceHeroCarousel } from "./ServiceHeroCarousel";
import { alignedPageIntro } from "./alignedIntroductions";
import catalog from "../content/equipment-catalog.json" with { type: "json" };
import site from "../site.json" with { type: "json" };
import { rentalProductHeadline } from "./rentalHeadlines";
export type CatalogItem = (typeof catalog.items)[number];

function CatalogImage({ item }: { item: CatalogItem }) {
  const photo = catalogPhotoCoverage(item), image = photo.images[0];
  if (!image) return <div className="verified-photo-pending" data-catalog-photo-pending><strong>Verified photography coming soon</strong><p>{photo.caption}</p></div>;
  return <img src={image.src} srcSet={image.srcSet} sizes="(max-width: 700px) calc(100vw - 40px), 480px" width={image.width} height={image.height} alt={image.alt} loading="lazy" decoding="async" />;
}

export function EquipmentCatalog() {
  return (
    <section
      className="catalog-section"
      id="all-equipment"
      aria-labelledby="catalog-heading"
    >
      <div className="catalog-heading">
        <div>
          <span className="eyebrow">THE EQUIPMENT DIRECTORY</span>
          <h2 id="catalog-heading">
            Find the right fit
            <br />
            for your site.
          </h2>
        </div>
        <p>
          Browse all 25 equipment entries. Open a layout for a closer look, or
          view the equipment page to plan your next step.
        </p>
      </div>
      <div className="equipment-filter" hidden>
        <label htmlFor="equipment-search">Find equipment</label>
        <input
          id="equipment-search"
          type="search"
          placeholder="Try laundry, power or accommodation"
        />
        <p id="equipment-search-status" role="status">
          25 equipment entries
        </p>
      </div>
      <nav className="catalog-groups" aria-label="Browse equipment groups">
        {catalog.groups.map((group) => (
          <a href={`#group-${group.id}`} key={group.id} data-catalog-jump>
            {group.name}
            <span>
              {catalog.items.filter((i) => i.group === group.id).length}
            </span>
          </a>
        ))}
      </nav>
      {catalog.groups.map((group) => (
        <section
          className="catalog-group"
          id={`group-${group.id}`}
          key={group.id}
          data-catalog-group
          aria-labelledby={`heading-${group.id}`}
        >
          <div className="catalog-group-heading">
            <h3 id={`heading-${group.id}`}>{group.name}</h3>
            <p>{group.description}</p>
          </div>
          <div className="catalog-grid">
            {catalog.items
              .filter((item) => item.group === group.id)
              .map((item) => (
                <article
                  className="catalog-card"
                  key={item.id}
                  data-catalog-card
                  data-search={`${item.name} ${item.summary}`}
                >
                  <a
                    className="catalog-media"
                    href={catalogPhotoCoverage(item).images[0]?.fullSrc || item.path}
                    target="_blank"
                    rel="noopener"
                    aria-label={"View " + item.name + " reference or equipment details"}
                  >
                    <CatalogImage item={item} />
                    <span>
                      {catalogPhotoCoverage(item).status === "held" ? "View equipment" : catalogPhotoCoverage(item).status === "reviewed-layout" ? "View layout" : "View image"} ↗
                    </span>
                  </a>
                  <div className="catalog-card-copy">
                    <h4>
                      <a href={item.path}>{item.name}</a>
                    </h4>
                    <p>{item.summary}</p>
                    {catalogPhotoCoverage(item).status ===
                      "reviewed-representative" && (
                      <p className="catalog-photo-disclosure">
                        {catalogPhotoCoverage(item).caption}
                      </p>
                    )}
                    <a className="catalog-detail-link" href={item.path}>
                      View equipment <span aria-hidden="true">↗</span>
                    </a>
                  </div>
                </article>
              ))}
          </div>
        </section>
      ))}
      <div className="catalog-empty" hidden>
        <h3>No equipment matches that search.</h3>
        <p>Try a broader term or clear your search to see all equipment.</p>
        <button type="button" id="clear-equipment-search" className="button">
          Show all equipment
        </button>
      </div>
      <aside className="catalog-help">
        <div>
          <h3>Several facilities. One conversation.</h3>
          <p>
            Share your site, dates and requirements. We can help you work
            through the combination of equipment you need.
          </p>
        </div>
        <a className="button" href={`tel:${site.phoneE164}`}>
          Call {site.phoneDisplay}
          <span aria-hidden="true">↗</span>
        </a>
      </aside>
    </section>
  );
}

export function EquipmentBrief({ item }: { item: CatalogItem }) {
  const photo = catalogPhotoCoverage(item);
  const related = catalog.items
    .filter(
      (candidate) => candidate.group === item.group && candidate.id !== item.id,
    )
    .slice(0, 3);
  return (
    <section className="wrap section equipment-brief">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <a href="/">Home</a>
        <span>/</span>
        <a href="/equipment-rental/#all-equipment">Equipment rental</a>
      </nav>
      <div className="brief-intro">
        <div>
          <span className="eyebrow">TEMPORARY123 EQUIPMENT</span>
          <h1>{rentalProductHeadline(item.name)}</h1>
          <p data-h1-intro>{alignedPageIntro(item.path, item.name, item.summary)}</p>
          <a className="button" href={`tel:${site.phoneE164}`}>
            Call {site.phoneDisplay}
            <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div className="brief-image" data-catalog-gallery={item.id}>
          {photo.images.length ? <ServiceHeroCarousel images={photo.images} label={item.name} lightboxLabel={item.name} caption={photo.caption} /> : <div className="verified-photo-pending" data-catalog-photo-pending><strong>Verified photography coming soon</strong><p>{photo.caption}</p></div>}
        </div>
      </div>
      <div className="brief-planning">
        <div>
          <h2>
            Plan the details
            <br />
            before delivery.
          </h2>
          <p>
            Availability, equipment configuration and delivery arrangements are
            confirmed in your project proposal.
          </p>
        </div>
        <dl>
          <div>
            <dt>Your operation</dt>
            <dd>
              Explain how the equipment will be used and how many people it will
              support.
            </dd>
          </div>
          <div>
            <dt>Your site</dt>
            <dd>
              Share the location, available space, access restrictions and
              utility connections.
            </dd>
          </div>
          <div>
            <dt>Your schedule</dt>
            <dd>
              Include your preferred delivery date, expected rental duration and
              removal requirements.
            </dd>
          </div>
        </dl>
      </div>
      {related.length > 0 && (
        <section className="brief-related" aria-labelledby="related-equipment">
          <span className="eyebrow">RELATED EQUIPMENT</span>
          <h2 id="related-equipment">Continue planning your site.</h2>
          <div>
            {related.map((candidate) => (
              <a href={candidate.path} key={candidate.id}>
                {candidate.name}
                <span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        </section>
      )}
      <a className="text-link" href="/equipment-rental/#all-equipment">
        ← Browse all equipment
      </a>
    </section>
  );
}

export { catalog };
