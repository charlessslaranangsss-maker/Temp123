import site from "../site.json" with { type: "json" };
import { stateGuides } from "./stateGuides";
import states from "./usStates.json" with { type: "json" };

export const regionSlug = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const regionPath = (state: string, region: string) =>
  `/service-areas/${regionSlug(state)}/${regionSlug(region)}/`;

const stateCities: Record<string, [string, string]> = {
  Alabama: ["Birmingham", "Montgomery"],
  Alaska: ["Anchorage", "Fairbanks"],
  Arizona: ["Phoenix", "Tucson"],
  Arkansas: ["Little Rock", "Fayetteville"],
  California: ["Los Angeles", "San Francisco"],
  Colorado: ["Denver", "Colorado Springs"],
  Connecticut: ["Hartford", "New Haven"],
  Delaware: ["Wilmington", "Dover"],
  Florida: ["Miami", "Orlando"],
  Georgia: ["Atlanta", "Savannah"],
  Hawaii: ["Honolulu", "Hilo"],
  Idaho: ["Boise", "Idaho Falls"],
  Illinois: ["Chicago", "Springfield"],
  Indiana: ["Indianapolis", "Fort Wayne"],
  Iowa: ["Des Moines", "Cedar Rapids"],
  Kansas: ["Wichita", "Topeka"],
  Kentucky: ["Louisville", "Lexington"],
  Louisiana: ["New Orleans", "Baton Rouge"],
  Maine: ["Portland", "Bangor"],
  Maryland: ["Baltimore", "Annapolis"],
  Massachusetts: ["Boston", "Worcester"],
  Michigan: ["Detroit", "Grand Rapids"],
  Minnesota: ["Minneapolis", "Saint Paul"],
  Mississippi: ["Jackson", "Gulfport"],
  Missouri: ["Kansas City", "St. Louis"],
  Montana: ["Billings", "Helena"],
  Nebraska: ["Omaha", "Lincoln"],
  Nevada: ["Las Vegas", "Reno"],
  "New Hampshire": ["Manchester", "Concord"],
  "New Jersey": ["Newark", "Jersey City"],
  "New Mexico": ["Albuquerque", "Santa Fe"],
  "New York": ["New York City", "Buffalo"],
  "North Carolina": ["Charlotte", "Raleigh"],
  "North Dakota": ["Fargo", "Bismarck"],
  Ohio: ["Columbus", "Cleveland"],
  Oklahoma: ["Oklahoma City", "Tulsa"],
  Oregon: ["Portland", "Salem"],
  Pennsylvania: ["Philadelphia", "Pittsburgh"],
  "Rhode Island": ["Providence", "Newport"],
  "South Carolina": ["Charleston", "Columbia"],
  "South Dakota": ["Sioux Falls", "Rapid City"],
  Tennessee: ["Nashville", "Memphis"],
  Texas: ["Houston", "Dallas"],
  Utah: ["Salt Lake City", "Provo"],
  Vermont: ["Burlington", "Montpelier"],
  Virginia: ["Virginia Beach", "Richmond"],
  Washington: ["Seattle", "Spokane"],
  "West Virginia": ["Charleston", "Huntington"],
  Wisconsin: ["Milwaukee", "Madison"],
  Wyoming: ["Cheyenne", "Casper"],
};

const regionPhotos = [
  [
    "/images/catalog/mobile-kitchen-trailers-960.webp",
    "Mobile commercial kitchen trailer prepared for a temporary site",
  ],
  [
    "/images/catalog/temporary-shower-trailers-960.webp",
    "Temporary shower trailer ready for regional deployment",
  ],
  [
    "/images/catalog/restroom-trailers-960.webp",
    "Restroom trailer for a temporary facilities rental project",
  ],
  [
    "/images/catalog/bunkhouse-trailers-960.webp",
    "Sleeper and bunkbed trailers for a remote project crew",
  ],
  [
    "/images/catalog/laundry-trailers-960.webp",
    "Mobile laundry trailer supporting a temporary work site",
  ],
  [
    "/images/catalog/mobile-crew-camps-960.webp",
    "Mobile crew camp facilities arranged for site operations",
  ],
  [
    "/images/catalog/dining-structure-rental-960.webp",
    "Temporary dining structure rental for a project site",
  ],
  [
    "/images/catalog/mobile-office-trailers-960.webp",
    "Mobile office trailer supporting temporary site operations",
  ],
  [
    "/images/catalog/generator-trailers-960.webp",
    "Generator trailer supporting temporary facilities on site",
  ],
  [
    "/images/catalog/handwashing-stations-960.webp",
    "Handwashing station for a temporary facilities setup",
  ],
  [
    "/images/catalog/mobile-sleep-trailers-960.webp",
    "Mobile sleeper trailers ready for a regional crew",
  ],
  [
    "/images/catalog/classroom-trailers-960.webp",
    "Classroom trailer for temporary facilities planning",
  ],
  [
    "/images/catalog/breakroom-trailer-960.webp",
    "Breakroom trailer for a temporary work site",
  ],
  [
    "/images/catalog/mobile-command-trailers-960.webp",
    "Command center trailer for regional site operations",
  ],
  [
    "/images/catalog/modular-buildings-960.webp",
    "Modular building for a temporary facilities rental",
  ],
  [
    "/images/catalog/tent-rentals-960.webp",
    "Temporary tent rental supporting a project site",
  ],
] as const;

const introTemplates = [
  (state: string, region: string) =>
    `Teams planning work in ${region}, ${state} can arrange temporary facilities around the site's access, occupancy and schedule. Rent mobile kitchens, shower and restroom combination trailers, and sleeper or bunkbed trailers when the project needs a reliable basecamp.`,
  (state: string, region: string) =>
    `A ${region} project in ${state} may need a temporary facility plan that connects food service, hygiene and crew support. Compare short-term rental options with a longer lease, then confirm delivery access and utility requirements for the exact site.`,
  (state: string, region: string) =>
    `For work across ${region}, ${state}, Temporary 123 helps project teams plan rental facilities before mobilization. The conversation can cover mobile commercial kitchens, shower trailers, combination units and sleeper or bunkbed rentals for short or extended assignments.`,
  (state: string, region: string) =>
    `Project managers in ${region}, ${state} can use a temporary facilities rental plan to keep crews supported during construction, renovation or remote work. Review the site route, equipment footprint and servicing plan before choosing a rent or lease arrangement.`,
  (state: string, region: string) =>
    `When a site is located in ${region}, ${state}, a coordinated temporary facility rental keeps the next phase moving. Discuss kitchen capacity, shower and restroom combinations, sleeper or bunkbed trailers and the delivery sequence with our team.`,
  (state: string, region: string) =>
    `A clear rental brief for ${region}, ${state} should name the work area, crew size and operating dates. Temporary 123 can help compare mobile kitchen, hygiene and sleeper trailer options for a short-term rent or a longer lease.`,
] as const;

const detailTemplates = [
  (state: string, region: string) =>
    `In ${region}, the local access plan is the starting point. Share the nearest approach, turning space and service connections so a temporary facility rental can be positioned safely in ${state}.`,
  (state: string, region: string) =>
    `For ${region} sites, match the facility mix to the people who use it each day. A rent or lease plan can combine food preparation, showers, restrooms and crew sleeping space without separating the servicing route.`,
  (state: string, region: string) =>
    `The ${region} work pattern may change between setup and peak operations. Confirm the dates, occupancy and utility plan before reserving a temporary facilities rental in ${state}.`,
  (state: string, region: string) =>
    `A practical ${region} brief should show where deliveries arrive and where the temporary units will sit. That detail helps our team review a short-term rent or longer lease for the ${state} project.`,
  (state: string, region: string) =>
    `For a ${region} deployment, keep the kitchen, hygiene and sleeping routes easy to service. We can discuss a temporary facility rental that fits the working footprint and the project timeline in ${state}.`,
  (state: string, region: string) =>
    `Before equipment moves to ${region}, confirm the receiving contact, ground conditions and return route. These details support a transparent rent or lease conversation for temporary facilities in ${state}.`,
] as const;

const factTemplates = [
  (state: string, region: string, fact: string) =>
    `${fact} This regional guide helps teams connect that state context with a ${region} rental plan.`,
  (state: string, region: string, fact: string) =>
    `${fact} Use the ${region} location name when requesting a temporary facility rent or lease in ${state}.`,
  (state: string, region: string, fact: string) =>
    `${fact} The regional context is useful when arranging delivery for a ${region} temporary facilities rental.`,
  (state: string, region: string, fact: string) =>
    `${fact} Include ${region} in the project brief so the right rental and servicing discussion can begin.`,
] as const;

export type RegionGuide = {
  state: string;
  region: string;
  path: string;
  index: number;
  layout: number;
  image: string;
  imageAlt: string;
  gallery: { image: string; imageAlt: string }[];
  intro: string;
  detail: string;
  fact: string;
  cities: [string, string];
  statePath: string;
  stateX: number;
  stateY: number;
  regionPhoto: string;
  regionPhotoAlt: string;
};

export const regionPages: RegionGuide[] = Object.entries(stateGuides).flatMap(
  ([state, guide]) =>
    guide.regions.map((region, regionIndex) => {
      const index = regionIndex;
      const cities = stateCities[state] || [state, state];
      const stateShape = states.find((item) => item.name === state)!;
      const photo =
        regionPhotos[
          (Object.keys(stateGuides).indexOf(state) * 3 + index) %
            regionPhotos.length
        ];
      return {
        state,
        region,
        path: regionPath(state, region),
        index,
        layout: (Object.keys(stateGuides).indexOf(state) + index) % 6,
        image: guide.gallery[index % guide.gallery.length].image,
        imageAlt: guide.gallery[index % guide.gallery.length].imageAlt,
        gallery: guide.gallery,
        intro: `${introTemplates[index % introTemplates.length](state, region)} Cities covered in this regional guide include ${cities[0]} and ${cities[1]}.`,
        detail: `${detailTemplates[index % detailTemplates.length](state, region)} Teams in ${cities[0]} and ${cities[1]} can use the same planning brief when the project spans more than one city.`,
        fact: factTemplates[index % factTemplates.length](
          state,
          region,
          guide.fact,
        ),
        cities,
        statePath: stateShape.d,
        stateX: stateShape.x,
        stateY: stateShape.y,
        regionPhoto: photo[0],
        regionPhotoAlt: `${photo[1]} in ${region}, ${state}`,
      };
    }),
);

export const regionPageByPath = Object.fromEntries(
  regionPages.map((page) => [page.path, page]),
) as Record<string, RegionGuide | undefined>;

export function RegionDetail({ guide }: { guide: RegionGuide }) {
  const nearbyRegions = regionPages.filter(
    (page) => page.state === guide.state && page.path !== guide.path,
  );
  return (
    <article className={`region-page region-layout-${guide.layout}`}>
      <section className="region-hero">
        <div className="wrap section region-hero-grid">
          <div className="region-hero-copy">
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <a href="/">Home</a>
              <span>/</span>
              <a href="/service-areas/">Service Areas</a>
              <span>/</span>
              <a href={`/service-areas/#planning-${regionSlug(guide.state)}`}>
                {guide.state}
              </a>
            </nav>
            <span className="eyebrow">
              TEMPORARY FACILITIES · {guide.state.toUpperCase()}
            </span>
            <p className="region-kicker">Regional rental guide</p>
            <h1>
              Temporary facilities in {guide.region}, {guide.state}
            </h1>
            <p className="region-intro">{guide.intro}</p>
            <a className="button" href={`tel:${site.phoneE164}`}>
              Call now <strong>{site.phoneDisplay}</strong>{" "}
              <span aria-hidden="true">↗</span>
            </a>
          </div>
          <figure className="region-hero-visual">
            <img
              src={guide.image}
              alt={guide.imageAlt}
              width="960"
              height="640"
              fetchPriority="high"
            />
            <figcaption>
              <span>{guide.region}</span>
              <strong>Plan the right site setup</strong>
            </figcaption>
          </figure>
        </div>
      </section>
      <section className="wrap section region-content-grid">
        <div className="region-copy-panel">
          <span className="eyebrow">PLAN FOR THIS REGION</span>
          <h2>Rental support for {guide.region}</h2>
          <p>{guide.detail}</p>
          <p>{guide.fact}</p>
          <p className="region-cities">
            <strong>City coverage:</strong> {guide.cities[0]} and{" "}
            {guide.cities[1]}.
          </p>
          <a className="region-inline-call" href={`tel:${site.phoneE164}`}>
            Speak with the rental team {site.phoneDisplay} ↗
          </a>
        </div>
        <aside className="region-services-panel">
          <span className="eyebrow">AVAILABLE SERVICES</span>
          <h2>Build your temporary facilities plan</h2>
          <ul>
            <li>Mobile commercial kitchen rental</li>
            <li>Shower and restroom combination rental</li>
            <li>Sleeper and bunkbed trailer lease</li>
            <li>Dishwashing, refrigeration and handwashing support</li>
          </ul>
        </aside>
      </section>
      <section className="wrap section region-gallery-section">
        <div className="region-section-heading">
          <span className="eyebrow">EQUIPMENT REFERENCES</span>
          <h2>See the options before you call.</h2>
          <p>
            Representative Temporary 123 equipment views for planning a{" "}
            {guide.region} rental.
          </p>
        </div>
        <div className="region-gallery">
          {guide.gallery.map((item, index) => (
            <figure key={item.image}>
              <img
                src={item.image}
                alt={item.imageAlt}
                width="960"
                height="640"
                loading={index ? "lazy" : undefined}
              />
              <figcaption>{item.imageAlt}</figcaption>
            </figure>
          ))}
        </div>
      </section>
      <section
        className="wrap section region-faq"
        aria-labelledby="region-faq-title"
      >
        <span className="eyebrow">QUICK ANSWER</span>
        <h2 id="region-faq-title">What can you rent in {guide.region}?</h2>
        <p>
          Temporary 123 can discuss a rental or lease for mobile commercial
          kitchens, shower and restroom combination trailers, sleeper or bunkbed
          trailers, and supporting temporary facilities in {guide.region},{" "}
          {guide.state}.
        </p>
      </section>
      <nav
        className="wrap section region-nearby"
        aria-label={`Other ${guide.state} travel regions`}
      >
        <span className="eyebrow">
          MORE {guide.state.toUpperCase()} COVERAGE
        </span>
        <h2>Explore nearby travel regions</h2>
        <div className="region-nearby-links">
          {nearbyRegions.map((page) => (
            <a href={page.path} key={page.path}>
              {page.region}
              <span aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </nav>
      <section className="region-map-strip" aria-labelledby="region-map-title">
        <div className="wrap region-map-grid">
          <div className="region-map-copy">
            <span className="eyebrow">REGIONAL COVERAGE</span>
            <h2 id="region-map-title">{guide.region} travel area</h2>
            <p>
              This regional view highlights the {guide.state} service area for
              planning a temporary facilities rental. City coverage includes{" "}
              {guide.cities[0]} and {guide.cities[1]}.
            </p>
          </div>
          <figure className="region-map-visual">
            <img
              src={guide.regionPhoto}
              alt={guide.regionPhotoAlt}
              width="960"
              height="640"
              loading="lazy"
            />
            <span className="region-map-badge">
              {guide.state} <span aria-hidden="true">|</span> {guide.region}
            </span>
            <figcaption>
              <strong>{guide.state}</strong>
              <span>{guide.region}</span>
            </figcaption>
          </figure>
        </div>
      </section>
      <section className="region-next-step">
        <div className="wrap">
          <h2>Ready to plan your {guide.region} site?</h2>
          <p>
            Call for availability, delivery planning and a temporary facilities
            rental or lease quote.
          </p>
          <a className="button" href={`tel:${site.phoneE164}`}>
            Call now {site.phoneDisplay} <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>
    </article>
  );
}
