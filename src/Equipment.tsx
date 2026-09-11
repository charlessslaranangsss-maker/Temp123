import site from "../site.json" with { type: "json" };

export const equipment = [
  {
    name: "Mobile kitchens",
    path: "/equipment-rental/mobile-kitchen-trailers/",
    image: "kitchen",
    category: "Food service",
    text: "Keep cooking during a renovation, at an event or on a remote site.",
    detail:
      "Tell us how many meals you serve, your menu and the equipment your team uses. We can discuss kitchen space, preparation areas and utility requirements.",
    tags: ["Cooking", "Preparation", "Food service"],
  },
  {
    name: "Restroom & shower trailers",
    path: "/equipment-rental/restroom-trailers/",
    image: "facility",
    category: "Site amenities",
    text: "Give your crew or guests a comfortable place to freshen up.",
    detail:
      "Share the number of people on site and how long you need the facilities. Ask our team about restroom and shower options, water connections and servicing.",
    tags: ["Restrooms", "Showers", "Site support"],
  },
  {
    name: "Workforce & base camps",
    path: "/man-camps-for-rent/",
    image: "housing",
    category: "Crew accommodation",
    text: "Plan sleeping, dining and support facilities around your workforce.",
    detail:
      "Start with your crew size, location and project schedule. We can work through accommodation and the supporting facilities your site needs.",
    tags: ["Accommodation", "Dining", "Crew facilities"],
  },
  {
    name: "Temporary facilities",
    path: "/equipment-rental/",
    image: "interior",
    category: "Project support",
    text: "Bring the right combination of spaces together for your project.",
    detail:
      "Talk through your operation with our team. Confirm equipment availability, site access, delivery and utility arrangements as part of your proposal.",
    tags: ["Equipment", "Site planning", "Coordination"],
  },
];

export function EquipmentImage({
  image,
  alt,
  priority = false,
}: {
  image: string;
  alt: string;
  priority?: boolean;
}) {
  return (
    <img
      src={`/images/${image}.webp`}
      srcSet={`/images/${image}-480.webp 480w, /images/${image}.webp 850w`}
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

export function Cards() {
  return (
    <div className="equipment-grid">
      {equipment.map((e, i) => (
        <article className="equipment-card" key={e.path} data-card>
          <a
            href={e.path}
            className="image-box"
            tabIndex={-1}
            aria-hidden="true"
          >
            <EquipmentImage
              image={e.image}
              alt={`${e.name} equipment from Temporary 123`}
            />
            <span className="category-label">{e.category}</span>
            <span className="image-arrow" aria-hidden="true">
              ↗
            </span>
          </a>
          <div className="card-copy">
            <h3>
              <a href={e.path}>{e.name}</a>
            </h3>
            <p>{e.text}</p>
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
              <EquipmentImage image={e.image} alt={e.name} />
              <div className="dialog-copy">
                <span className="eyebrow">{e.category}</span>
                <h2 id={`equipment-title-${i}`}>{e.name}</h2>
                <p>{e.detail}</p>
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
