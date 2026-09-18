import { resolveLocationGallery } from "./locationCarouselImages";
import { ServiceHeroCarousel } from "./ServiceHeroCarousel";
import { referenceCaptionForModel } from "./equipmentPhotoPolicy";
import site from "../site.json" with { type: "json" };

type EquipmentCard = {
  name: string;
  path: string;
  image: string;
  smallImage?: string;
  imageAlt?: string;
  category: string;
  text: string;
  detail: string;
  tags: string[];
  secondaryName?: string;
  secondaryPath?: string;
};

export const equipment: EquipmentCard[] = [
  {
    name: "Mobile Kitchens",
    path: "/equipment-rental/mobile-kitchen-trailers/",
    image: "/images/catalog/mobile-kitchen-trailers-960.webp",
    smallImage: "/images/catalog/mobile-kitchen-trailers-480.webp",
    category: "Food service",
    text: "Rent a commercial mobile kitchen and keep meal production moving through renovations, emergencies and remote projects.",
    detail:
      "Rent the kitchen capacity your team needs without waiting for a permanent build. Share your meal volume, menu and equipment requirements so our team can help match cooking space, preparation areas and utility needs.",
    tags: ["Meal production", "Commercial kitchens", "24/7 support"],
  },
  {
    name: "Dishwashing",
    path: "/portable-dishwashing-trailer-rental/",
    image: "/images/service-heroes/38ft-high-temp-dish/01-960.webp",
    smallImage: "/images/service-heroes/38ft-high-temp-dish/01-480.webp",
    imageAlt: "Commercial dishwashing machine inside a mobile dishwashing trailer",
    category: "Food sanitation",
    text: "Rent a dishwashing trailer and keep high-volume food service sanitary, organized and moving.",
    detail:
      "Rent dedicated warewashing capacity that supports your operation from the first service to final cleanup. Share your volume and schedule so we can discuss wash capacity, utilities, wastewater and placement.",
    tags: ["Warewashing", "Sanitation", "Food service"],
  },
  {
    name: "Refrigeration",
    path: "/equipment-rental/refrigeration/",
    image: "/images/catalog/refrigeration-trailers-960.webp",
    smallImage: "/images/catalog/refrigeration-trailers-480.webp",
    category: "Cold storage",
    text: "Rent temperature-controlled cold storage for ingredients, prepared food and critical supplies.",
    detail:
      "Rent refrigeration sized around what you store and how often supplies move. Tell us the required temperature range and delivery schedule so we can review unit size, power and site access.",
    tags: ["Cold storage", "Food safety", "Temperature control"],
  },
  {
    name: "Shower",
    path: "/equipment-rental/shower-trailer/",
    image: "/images/catalog/shower-trailer-960.webp",
    smallImage: "/images/catalog/shower-trailer-480.webp",
    imageAlt: "Private shower-only stall inside a shower trailer",
    category: "Hygiene facilities",
    text: "Rent a 22 ft shower trailer with 10 stalls or a 20 ft shower container with 5 stalls for construction crews, man camps and emergency base camps.",
    detail:
      "Shower-only options include a 22 ft trailer with 10 stalls and a 20 ft container with 5 stalls. Share occupancy and peak-use periods so we can review the available unit, privacy, hot water, wastewater, delivery method and placement requirements.",
    tags: ["22 ft: 10 stalls", "20 ft: 5 stalls", "Emergency 24/7"],
  },
  {
    name: "Restroom",
    path: "/equipment-rental/restroom-trailers/",
    image: "/images/catalog/restroom-trailers-960.webp",
    smallImage: "/images/catalog/restroom-trailers-480.webp",
    imageAlt: "Shower and restroom combination unit shown as a reference; restroom-only configuration not pictured",
    category: "Site amenities",
    text: "Plan temporary restroom facilities for crews, guests and active field operations. Confirm the available restroom-only configuration before booking.",
    detail:
      "For a restroom-only request, confirm the available unit, stall count, accessibility and floor plan with the rental team. Matching restroom-only photography is pending; separate shower/restroom combination trailers are listed in their own equipment category.",
    tags: ["Restrooms", "Accessibility", "Site support"],
  },
  {
    name: "Shower and Restroom Combination Trailers",
    path: "/services/shower-restroom-combination-trailers/",
    image: "/images/catalog/restroom-trailers-960.webp",
    smallImage: "/images/catalog/restroom-trailers-480.webp",
    imageAlt: "Shower and restroom combination trailer reference, not a shower-only unit",
    category: "Combined hygiene facilities",
    text: "Rent luxury shower and restroom combination trailers with clearly listed stall capacities for temporary sites and crew accommodation.",
    detail:
      "Choose a 13 ft trailer with 3 stalls, a 22 ft trailer with 6 stalls, or a 30 ft trailer with 8 stalls. Accessible options include 3 stalls plus 1 ADA stall and 8 stalls plus 1 ADA stall. Confirm the available floor plan, water heating, drainage and servicing before delivery.",
    tags: ["13 ft: 3 stalls", "22 ft: 6 stalls", "30 ft: 8 stalls"],
  },
  {
    name: "Sleeper",
    path: "/equipment-rental/mobile-sleep-trailers/",
    image: "/images/catalog/mobile-sleep-trailers-960.webp",
    smallImage: "/images/catalog/mobile-sleep-trailers-480.webp",
    category: "Workforce housing",
    text: "Rent sleeper and bunkhouse trailers that give remote crews a practical place to rest between shifts.",
    detail:
      "Rent sleeping capacity around crew size, shift patterns and privacy needs. We can help coordinate sleeper units with the kitchens, showers, restrooms and laundry your site requires.",
    tags: ["Crew lodging", "Remote sites", "Base camps"],
  },
  {
    name: "Laundry",
    path: "/equipment-rental/laundry-trailers/",
    image: "/images/service-heroes/30ft-laundry-trailer/01-960.webp",
    smallImage: "/images/service-heroes/30ft-laundry-trailer/01-480.webp",
    imageAlt: "Rows of washers and dryers inside a mobile laundry trailer",
    category: "Workforce support",
    text: "Rent mobile laundry capacity for base camps, response teams and extended projects.",
    detail:
      "Rent laundry capacity that keeps workwear and daily essentials moving through the week. Share crew size and volume so we can discuss machines, water, power, drainage and service access.",
    tags: ["Laundry", "Base camps", "Long-term rentals"],
  },
  {
    name: "Handwashing Trailers",
    path: "/equipment-rental/handwashing-stations/",
    image: "/images/service-heroes/handwashing-sink-trailer/01-960.webp",
    smallImage: "/images/service-heroes/handwashing-sink-trailer/01-480.webp",
    imageAlt: "Portable handwashing trailer with multiple sinks under an open service canopy",
    category: "Hygiene facilities",
    text: "Rent handwashing trailers that put convenient hygiene access where people need it most.",
    detail:
      "Rent handwashing access around your occupancy and active work zones. We can help plan station placement, water supply, drainage and service frequency for a smoother setup.",
    tags: ["Hand hygiene", "Site safety", "Portable facilities"],
  },
];

const cardTitles: Record<string, string> = {
  "Mobile Kitchens": "24 ft Mobile Kitchen Trailer", "Dishwashing": "Dishwashing Trailer",
  "Refrigeration": "20 ft Refrigerated Trailer", "Shower": "20 ft Shower Trailer",
  "Restroom": "ADA Shower and Restroom Combination Trailer", "Shower and Restroom Combination Trailers": "Shower and Restroom Combination Trailer",
  "Sleeper": "Two-Stall Sleeper Trailer", "Laundry": "30 ft Laundry Trailer", "Handwashing Trailers": "Handwashing Sink Trailer"
};
function cardGallery(name: string) { return resolveLocationGallery(cardTitles[name] || name); }
export function equipmentGalleryForPath(path: string) {
  const item = equipment.find((entry) => entry.path === path);
  return cardGallery(item?.name || "Unknown equipment");
}
for (const item of equipment) {
  const photo = cardGallery(item.name).images[0];
  item.image = photo?.src || "";
  item.smallImage = photo?.thumbnail;
  item.imageAlt = photo?.alt || "Verified restroom-only photography coming soon";
}

export function EquipmentImage({
  image,
  smallImage,
  alt,
  priority = false,
}: {
  image: string;
  smallImage?: string;
  alt: string;
  priority?: boolean;
}) {
  const source = image.startsWith("/") ? image : `/images/${image}.webp`;
  const sourceSet = smallImage
    ? `${smallImage} 480w, ${source} 960w`
    : image.startsWith("/")
      ? undefined
      : `/images/${image}-480.webp 480w, ${source} 850w`;
  return (
    <img
      src={source}
      srcSet={sourceSet}
      sizes="(max-width: 600px) calc(100vw - 36px), (max-width: 1023px) calc(50vw - 36px), 620px"
      alt={alt}
      width="850"
      height="650"
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
    />
  );
}

const homepagePhotos = [
  [
    "Mobile kitchen trailers",
    "/images/kitchen-wide.webp",
    "Exterior of a white mobile kitchen trailer with service windows",
  ],
  [
    "Dishwashing trailers",
    "/media/cc7bd709e3c4c4a3698b1f00.webp",
    "Stainless steel sinks and washing equipment inside a portable dishwashing facility",
  ],
  [
    "Refrigeration trailers",
    "/images/catalog/refrigeration-trailers-960.webp",
    "Refrigerated trailer interior with insulated walls and cooling equipment",
  ],
  [
    "Shower trailers",
    "/images/catalog/shower-trailer-960.webp",
    "Private shower stall inside a shower trailer with overhead and handheld shower heads, ventilation and storage hooks",
  ],
  [
    "Restroom trailers",
    "/images/catalog/restroom-trailers-960.webp",
    "Representative ADA shower and restroom combination trailer shown as a restroom facilities preview",
  ],
  [
    "Shower & restroom combinations",
    "/media/3ce3bc9f066f86f54836e1b3.webp",
    "Shower and restroom combination trailer with separate entrances, steps and an access ramp",
  ],
  [
    "Sleeper / Bunkbed Trailers",
    "/images/catalog/mobile-sleep-trailers-960.webp",
    "White sleeper trailer with individual entrances and access steps",
  ],
  [
    "Laundry trailers",
    "/media/26e57177286bf38e7705fd10.png",
    "Stacked washers and dryers inside a mobile laundry facility",
  ],
  [
    "Handwashing trailers",
    "/media/fb803de06002fc35d0c4d28f.png",
    "Mobile handwashing trailer with sinks, mirrors and a raised canopy",
  ],
];
const homepageEquipment: EquipmentCard[] = equipment.map((item, index) => ({
  ...item,
  name: homepagePhotos[index][0],
  // Preserve Charles's explicitly approved shower thumbnail; other cards use
  // the same current category mapping as Services, never a legacy mixed unit.
  image:
    index === 3
      ? homepagePhotos[index][1]
      : index === 4
        ? "/images/location-verified/5ecedc2b7190aeb0b3f7-960.webp"
        : item.image,
  smallImage:
    index === 3
      ? "/images/catalog/shower-trailer-480.webp"
      : index === 4
        ? "/images/location-verified/5ecedc2b7190aeb0b3f7-480.webp"
        : item.smallImage,
  imageAlt:
    index === 3
      ? homepagePhotos[index][2]
      : index === 4
        ? "Toilet interior in a shower and restroom combination trailer; restroom-only unit not pictured"
        : item.imageAlt,
}));

export function Cards({
  editorial = false,
  homepage = false,
}: {
  editorial?: boolean;
  homepage?: boolean;
}) {
  return (
    <div
      id={homepage ? "home-rental-grid" : undefined}
      className={`equipment-grid${editorial ? " equipment-editorial" : ""}${homepage ? " home-equipment" : ""}`}
    >
      {(homepage ? homepageEquipment : equipment).map((e, i) => (
        <article
          className="equipment-card"
          key={e.path}
          data-card
          data-rental-group={
            homepage
              ? i < 3
                ? "kitchen"
                : i === 6 || i === 7
                  ? "workforce"
                  : "sanitation"
              : undefined
          }
        >
          <a
            href={e.path}
            className="image-box"
            tabIndex={-1}
            aria-hidden={homepage ? undefined : true}
          >
            {e.image ? (
              <EquipmentImage
                image={e.image}
                smallImage={e.smallImage}
                alt={e.imageAlt || `${e.name} equipment from Temporary123`}
              />
            ) : (
              <div
                className="verified-image-pending"
                role="img"
                aria-label={e.imageAlt}
              >
                <span>Verified equipment photo pending</span>
              </div>
            )}
            <span className="category-label">{e.category}</span>
            <span className="image-arrow" aria-hidden="true">
              ↗
            </span>
          </a>
          <div className="card-copy">
            {(editorial || homepage) && (
              <span className="service-index" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
            )}
            <h3>
              <a href={e.path}>{e.name}</a>
            </h3>
            {homepage && i === 4 && <span className="representative-photo-note">Photo shows a shower + restroom combination unit</span>}
            <p>{e.text}</p>
            {e.secondaryName && e.secondaryPath && (
              <a className="related-card-service" href={e.secondaryPath}>
                {e.secondaryName} <span aria-hidden="true">↗</span>
              </a>
            )}
            <ul className="equipment-tags" aria-label="Facility uses">
              {e.tags.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <div className="card-actions">
              <a
                href={e.path}
                aria-label={homepage ? `View rental: ${e.name}` : undefined}
              >
                {homepage ? "View rental" : "Explore facilities"}{" "}
                <span aria-hidden="true">↗</span>
              </a>
              <button
                type="button"
                className="quick-view"
                data-open-dialog={`equipment-${i}`}
                hidden
                aria-label={`Quick view: ${e.name}`}
                aria-haspopup="dialog"
              >
                Quick view <span aria-hidden="true">+</span>
              </button>
            </div>
          </div>
          <dialog
            id={`equipment-${i}`}
            className="equipment-dialog"
            aria-labelledby={`equipment-title-${i}`}
          >
            <button
              className="dialog-close"
              data-close-dialog
              type="button"
              aria-label="Close quick view"
              autoFocus
            >
              Close <span aria-hidden="true">×</span>
            </button>
            <div className="dialog-grid">
              {equipmentGalleryForPath(e.path).images.length ? <ServiceHeroCarousel images={equipmentGalleryForPath(e.path).images} label={e.name} lightboxLabel={equipmentGalleryForPath(e.path).groups[0]?.headline || e.name} caption={referenceCaptionForModel(equipmentGalleryForPath(e.path).modelId)} deferLoading /> : <div className="verified-photo-pending"><strong>Verified photography coming soon</strong><p>Matching equipment photographs are not yet verified.</p></div>}
              <div className="dialog-copy">
                <span className="eyebrow">{e.category}</span>
                <h2 id={`equipment-title-${i}`}>{e.name}</h2>
                <p>{e.detail}</p>
                <ul className="dialog-benefits" aria-label="Rental benefits">
                  {e.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
                {e.secondaryName && e.secondaryPath && (
                  <a className="text-link" href={e.secondaryPath}>
                    {e.secondaryName} →
                  </a>
                )}
                <p className="small">
                  Ask about short-term rental availability or longer-term lease
                  arrangements. Final availability and configuration are
                  confirmed with your project proposal.
                </p>
                <a
                  className="button dialog-call-now"
                  href={`tel:${site.phoneE164}`}
                  aria-label={`Call now, rental specialist available 24/7 at ${site.phoneDisplay}`}
                >
                  <span className="dialog-call-label">
                    <strong>Call Now</strong>
                    <small>Rental specialist · 24/7</small>
                  </span>
                  <span className="dialog-call-number">
                    {site.phoneDisplay}
                  </span>{" "}
                  <span aria-hidden="true">↗</span>
                </a>
                <a className="text-link" href={e.path}>
                  View equipment details →
                </a>
              </div>
            </div>
          </dialog>
        </article>
      ))}
    </div>
  );
}
