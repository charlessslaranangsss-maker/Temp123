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
    text: "Commercial kitchen space for renovations, planned projects and emergency food service.",
    detail:
      "Tell us how many meals you serve, your menu and the equipment your team uses. We can discuss kitchen space, preparation areas and utility requirements.",
    tags: ["Meal production", "Commercial kitchens", "24/7 support"],
  },
  {
    name: "Dishwashing",
    path: "/portable-dishwashing-trailer-rental/",
    image: "/media/4723f18940a45f69bd1c8483.webp",
    category: "Food sanitation",
    text: "Portable dishwashing capacity for temporary kitchens and high-volume operations.",
    detail:
      "Share your service volume, operating schedule and sanitation workflow. We can discuss wash capacity, utilities, wastewater and placement requirements.",
    tags: ["Warewashing", "Sanitation", "Food service"],
  },
  {
    name: "Refrigeration",
    path: "/equipment-rental/refrigeration/",
    image: "/images/catalog/refrigeration-trailers-960.webp",
    smallImage: "/images/catalog/refrigeration-trailers-480.webp",
    category: "Cold storage",
    text: "Temporary refrigerated storage for ingredients, prepared food and critical supplies.",
    detail:
      "Tell us what you need to store, the required temperature range and your delivery schedule. We can review unit size, power and site access.",
    tags: ["Cold storage", "Food safety", "Temperature control"],
  },
  {
    name: "Shower",
    path: "/equipment-rental/shower-trailer/",
    image: "/images/catalog/temporary-shower-trailers-960.webp",
    smallImage: "/images/catalog/temporary-shower-trailers-480.webp",
    category: "Hygiene facilities",
    text: "Private mobile shower facilities planned around occupancy and daily servicing.",
    detail:
      "Tell us how many people need showers and when shifts change. We can review shower capacity, hot water, wastewater and placement requirements.",
    tags: ["Showers", "Crew welfare", "Daily servicing"],
  },
  {
    name: "Restroom",
    path: "/equipment-rental/restroom-trailers/",
    image: "/images/catalog/restroom-trailers-960.webp",
    smallImage: "/images/catalog/restroom-trailers-480.webp",
    category: "Site amenities",
    text: "Clean temporary restroom facilities for crews, guests and field operations.",
    detail:
      "Share the number of people on site, accessibility needs and rental duration. We can review restroom capacity, water connections and servicing.",
    tags: ["Restrooms", "Accessibility", "Site support"],
  },
  {
    name: "Shower and Restroom Combination Trailers",
    path: "/services/shower-restroom-combination-trailers/",
    image: "/images/catalog/temporary-shower-trailers-960.webp",
    smallImage: "/images/catalog/temporary-shower-trailers-480.webp",
    category: "Combined hygiene facilities",
    text: "Restroom and shower facilities together for temporary sites and crew accommodation.",
    detail:
      "Compare the number of toilets and showers, privacy needs and peak use periods. Confirm the floor plan, water heating, drainage and servicing before delivery.",
    tags: ["Combined facilities", "Private showers", "Site support"],
  },
  {
    name: "Sleeper",
    path: "/equipment-rental/mobile-sleep-trailers/",
    image: "/images/catalog/mobile-sleep-trailers-960.webp",
    smallImage: "/images/catalog/mobile-sleep-trailers-480.webp",
    category: "Workforce housing",
    text: "Temporary sleeping accommodations for remote crews and extended operations.",
    detail:
      "Start with crew size, shift patterns, privacy needs and rental duration. We can help coordinate sleeping units with the support facilities your site requires.",
    tags: ["Crew lodging", "Remote sites", "Base camps"],
  },
  {
    name: "Laundry",
    path: "/equipment-rental/laundry-trailers/",
    image: "/images/catalog/laundry-trailers-960.webp",
    smallImage: "/images/catalog/laundry-trailers-480.webp",
    category: "Workforce support",
    text: "Mobile laundry capacity for base camps, response teams and long-term projects.",
    detail:
      "Share your crew size, laundry volume and operating schedule. We can discuss machine capacity, water, power, drainage and service access.",
    tags: ["Laundry", "Base camps", "Long-term rentals"],
  },
  {
    name: "Handwashing Trailers",
    path: "/equipment-rental/handwashing-stations/",
    image: "/images/catalog/handwashing-stations-960.webp",
    smallImage: "/images/catalog/handwashing-stations-480.webp",
    category: "Hygiene facilities",
    text: "Portable handwashing access for food service, events and active work sites.",
    detail:
      "Share your expected occupancy and work zones. We can discuss station placement, water supply, drainage and service frequency.",
    tags: ["Hand hygiene", "Site safety", "Portable facilities"],
  },
];

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
    "/images/catalog/temporary-shower-trailers-960.webp",
    "Private shower enclosure with a handheld shower and adjacent washbasin",
  ],
  [
    "Restroom trailers",
    "/media/ce44e887e6e1812d2195e955.webp",
    "Mobile restroom interior with a toilet and yellow grab rails",
  ],
  [
    "Shower & restroom combinations",
    "/media/3ce3bc9f066f86f54836e1b3.webp",
    "Shower and restroom combination trailer with separate entrances, steps and an access ramp",
  ],
  [
    "Sleeper trailers",
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
  image: homepagePhotos[index][1],
  smallImage: undefined,
  imageAlt: homepagePhotos[index][2],
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
      className={`equipment-grid${editorial ? " equipment-editorial" : ""}${homepage ? " home-equipment" : ""}`}
    >
      {(homepage ? homepageEquipment : equipment).map((e, i) => (
        <article className="equipment-card" key={e.path} data-card>
          <a
            href={e.path}
            className="image-box"
            tabIndex={-1}
            aria-hidden={homepage ? undefined : true}
          >
            <EquipmentImage
              image={e.image}
              smallImage={e.smallImage}
              alt={e.imageAlt || `${e.name} equipment from Temporary 123`}
            />
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
              <a href={e.path}>
                Explore facilities <span aria-hidden="true">↗</span>
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
              {!homepage && (
                <EquipmentImage
                  image={e.image}
                  smallImage={e.smallImage}
                  alt={e.name}
                />
              )}
              <div className="dialog-copy">
                <span className="eyebrow">{e.category}</span>
                <h2 id={`equipment-title-${i}`}>{e.name}</h2>
                <p>{e.detail}</p>
                {e.secondaryName && e.secondaryPath && (
                  <a className="text-link" href={e.secondaryPath}>
                    {e.secondaryName} →
                  </a>
                )}
                <p className="small">
                  Availability and configurations are confirmed with your
                  project proposal.
                </p>
                <a className="button" href={`tel:${site.phoneE164}`}>
                  Call {site.phoneDisplay} <span aria-hidden="true">↗</span>
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
