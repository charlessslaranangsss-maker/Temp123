import site from "../site.json" with { type: "json" };
import { regionMedia } from "./regionMedia";
import { stateGuides } from "./stateGuides";
import { regionCities } from "./regionCities";
import { regionLocationPhoto, type LocationPhoto } from "./locationPhotos";
import {
  buildRegionSeasonalDemand,
  type SeasonalDemand,
} from "./seasonalDemand";

export const regionSlug = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const regionPath = (state: string, region: string) =>
  `/service-areas/${regionSlug(state)}/${regionSlug(region)}/`;

const introTemplates = [
  (state: string, region: string) =>
    `Teams planning work in ${region}, ${state} can arrange temporary facilities around the site's access, occupancy and schedule. Rent mobile kitchens, shower and restroom combination trailers, and sleeper or bunkbed trailers when the project needs a reliable base camp.`,
  (state: string, region: string) =>
    `A ${region} project in ${state} may need a temporary facility plan that connects food service, hygiene and crew support. Compare short-term rental options with a longer lease, then confirm delivery access and utility requirements for the exact site.`,
  (state: string, region: string) =>
    `For work across ${region}, ${state}, Temporary123 helps project teams plan rental facilities before mobilization. The conversation can cover mobile commercial kitchens, 22 ft 10-stall shower trailers, combination units and sleeper or bunkbed rentals for short or extended assignments.`,
  (state: string, region: string) =>
    `Project managers in ${region}, ${state} can use a temporary facilities rental plan to keep crews supported during construction, renovation or remote work. Review the site route, equipment footprint and servicing plan before choosing a rent or lease arrangement.`,
  (state: string, region: string) =>
    `When a site is located in ${region}, ${state}, a coordinated temporary facility rental keeps the next phase moving. Discuss kitchen capacity, shower and restroom combinations, sleeper or bunkbed trailers and the delivery sequence with our team.`,
  (state: string, region: string) =>
    `A clear rental brief for ${region}, ${state} should name the work area, crew size and operating dates. Temporary123 can help compare mobile kitchen, hygiene and sleeper trailer options for a short-term rent or a longer lease.`,
] as const;

const formatCityList = (cities: string[]) => {
  if (cities.length < 2) return cities[0] || "the surrounding area";
  if (cities.length === 2) return `${cities[0]} and ${cities[1]}`;
  return `${cities.slice(0, -1).join(", ")}, and ${cities.at(-1)}`;
};

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

const regionStateEntries = Object.entries(stateGuides);

const buildRegionVisuals = (
  globalIndex: number,
  state: string,
  region: string,
  cities: string[],
) => {
  const poolSize = regionMedia.length;
  const round = Math.floor(globalIndex / poolSize);
  const candidates = [
    globalIndex % poolSize,
    (globalIndex * 7 + 29 + round * 13) % poolSize,
    (globalIndex * 17 + 61 + round * 23) % poolSize,
    (globalIndex * 31 + 89 + round * 37) % poolSize,
  ];
  const indexes: number[] = [];
  candidates.forEach((candidate) => {
    let index = candidate;
    while (indexes.includes(index)) index = (index + 1) % poolSize;
    indexes.push(index);
  });
  const captions = [
    `Temporary facilities equipment prepared for projects in ${region}.`,
    `Rental equipment reference for sites near ${cities[0]}.`,
    `Base camp facility option for temporary work near ${cities[1] || cities[0]}.`,
    `Mobile support equipment available for rent or lease in ${state}.`,
  ];
  return indexes.map((index, visualIndex) => {
    const media = regionMedia[index];
    return {
      image: media.image,
      imageAlt: `${media.label} for a temporary facilities rental in ${region}, ${state}`,
      caption: captions[visualIndex],
    };
  });
};

export type RegionGuide = {
  state: string;
  region: string;
  path: string;
  index: number;
  layout: number;
  image: string;
  imageAlt: string;
  gallery: { image: string; imageAlt: string; caption: string }[];
  intro: string;
  detail: string;
  fact: string;
  cities: string[];
  locationPhoto?: LocationPhoto;
  seasonal: SeasonalDemand;
};

export const regionPages: RegionGuide[] = regionStateEntries.flatMap(
  ([state, guide], stateIndex) => {
    const stateOffset = regionStateEntries
      .slice(0, stateIndex)
      .reduce((total, [, item]) => total + item.regions.length, 0);
    return guide.regions.map((region, regionIndex) => {
      const index = regionIndex;
      const cities = regionCities(state, regionIndex);
      const visuals = buildRegionVisuals(
        stateOffset + regionIndex,
        state,
        region,
        cities,
      );
      const path = regionPath(state, region);
      const locationPhoto = regionLocationPhoto(path);
      return {
        state,
        region,
        path,
        index,
        layout: (Object.keys(stateGuides).indexOf(state) + index) % 6,
        image: locationPhoto?.image || visuals[0].image,
        imageAlt: locationPhoto?.imageAlt || visuals[0].imageAlt,
        locationPhoto,
        gallery: visuals.slice(1, 2),
        intro: `${introTemplates[index % introTemplates.length](state, region)} Cities in this distinct travel region include ${formatCityList(cities)}.`,
        detail: detailTemplates[index % detailTemplates.length](state, region),
        fact: factTemplates[index % factTemplates.length](
          state,
          region,
          guide.fact,
        ),
        cities,
        seasonal: buildRegionSeasonalDemand(state, region, regionIndex, cities),
      };
    });
  },
);

export const regionPageByPath = Object.fromEntries(
  regionPages.map((page) => [page.path, page]),
) as Record<string, RegionGuide | undefined>;

export function RegionDetail({ guide }: { guide: RegionGuide }) {
  const nearbyRegions = regionPages.filter(
    (page) => page.state === guide.state && page.path !== guide.path,
  );
  const mapQuery = encodeURIComponent(
    `${guide.cities[0]}, ${guide.state}, United States`,
  );
  const googleMapsEmbedUrl = `https://www.google.com/maps/?q=${mapQuery}&output=embed&z=7`;
  const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
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
            <p className="region-emergency">Emergency support 24/7</p>
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
              {guide.locationPhoto ? (
                <small>
                  Photo: {guide.locationPhoto.author},{" "}
                  <a href={guide.locationPhoto.sourceUrl}>
                    {guide.locationPhoto.license}
                  </a>
                </small>
              ) : null}
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
            <strong>City coverage:</strong> {formatCityList(guide.cities)}.
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
            <li>22 ft shower trailer rental with 10 stalls</li>
            <li>Sleeper and bunkbed trailer lease</li>
            <li>Dishwashing, refrigeration and handwashing support</li>
          </ul>
        </aside>
      </section>
      <section
        className="wrap section region-seasonal"
        aria-labelledby="region-seasonal-title"
      >
        <div className="region-seasonal-heading">
          <span className="eyebrow">LOCAL AND SEASONAL INFORMATION</span>
          <h2 id="region-seasonal-title">
            When temporary facilities may be needed in {guide.region}
          </h2>
          <p className="region-seasonal-route">
            <strong>Local orientation:</strong> {guide.seasonal.corridors[0]}{" "}
            near {guide.seasonal.landmarks[0]}, with city references for{" "}
            {formatCityList(guide.cities)}.
          </p>
        </div>
        <div className="region-seasonal-copy">
          {guide.seasonal.summary.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <aside className="region-demand-card">
          <span>Estimated seasonal facility demand</span>
          <strong>
            Code {guide.seasonal.code} · {guide.seasonal.label}
          </strong>
          <p>{guide.seasonal.basis}</p>
        </aside>
        <aside className="region-delivery-card">
          <span>Estimated delivery planning timeline</span>
          <strong>{guide.seasonal.delivery.window}</strong>
          <p>{guide.seasonal.delivery.note}</p>
          <a href={`tel:${site.phoneE164}`}>
            Emergency support 24/7 · {site.phoneDisplay}
          </a>
        </aside>
        <nav
          className="region-seasonal-sources"
          aria-label="Planning information sources"
        >
          <span>Planning references:</span>
          {guide.seasonal.sources.map((source) => (
            <a
              href={source.href}
              key={source.href}
              target="_blank"
              rel="external noreferrer"
            >
              {source.label}
            </a>
          ))}
        </nav>
      </section>
      <section className="wrap section region-gallery-section">
        <div className="region-section-heading">
          <div>
            <span className="eyebrow">EQUIPMENT REFERENCES</span>
            <h2>One equipment reference for the work ahead.</h2>
          </div>
          <p>
            One Temporary123 equipment view supports the location photograph
            while keeping this {guide.region} guide direct and easy to scan.
          </p>
        </div>
        <div className="region-gallery">
          {guide.gallery.map((item, index) => (
            <figure key={item.image}>
              <div className="region-gallery-image">
                <img
                  src={item.image}
                  alt={item.imageAlt}
                  width="960"
                  height="640"
                  loading="lazy"
                />
                <span aria-hidden="true">0{index + 1}</span>
              </div>
              <figcaption>{item.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>
      <section className="region-answer" aria-labelledby="region-faq-title">
        <div className="wrap section region-answer-card">
          <div className="region-answer-heading">
            <span className="eyebrow">QUICK ANSWER</span>
            <h2 id="region-faq-title">What can you rent in {guide.region}?</h2>
          </div>
          <div className="region-answer-body">
            <p>
              Temporary123 provides temporary facility rentals and lease options
              for projects in {guide.region}, {guide.state}. Available equipment
              supports food service, hygiene and crew accommodation.
            </p>
            <ul
              aria-label={`Temporary facilities available in ${guide.region}`}
            >
              <li>Mobile commercial kitchen rentals</li>
              <li>Shower and restroom combination trailers</li>
              <li>22 ft shower trailer rentals with 10 stalls</li>
              <li>Sleeper and bunkbed trailer rentals</li>
              <li>Dishwashing trailer rentals</li>
              <li>Refrigeration trailer rentals</li>
              <li>Restroom trailer rentals</li>
              <li>Laundry trailer rentals</li>
              <li>Handwashing trailer rentals</li>
            </ul>
            <a className="region-answer-call" href={`tel:${site.phoneE164}`}>
              Call a specialist 24/7 <strong>{site.phoneDisplay}</strong>
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
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
              {formatCityList(guide.cities)}.
            </p>
          </div>
          <figure className="region-map-visual">
            <iframe
              src={googleMapsEmbedUrl}
              title={`Google Map of ${guide.region}, ${guide.state}`}
              width="960"
              height="430"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <figcaption>
              <span>
                <strong>{guide.region}</strong>
                <small>{guide.state}, United States</small>
              </span>
              <a
                href={googleMapsLink}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open ${guide.region}, ${guide.state} in Google Maps`}
              >
                Open in Google Maps <span aria-hidden="true">↗</span>
              </a>
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
