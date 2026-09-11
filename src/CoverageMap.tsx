import states from "./usStates.json" with { type: "json" };
import { serviceCategories } from "./serviceMenu";
import site from "../site.json" with { type: "json" };
const callouts = [
  "Vermont",
  "New Hampshire",
  "Massachusetts",
  "Rhode Island",
  "Connecticut",
  "New Jersey",
  "Delaware",
  "Maryland",
];
function Geography({ id }: { id: string }) {
  return (
    <svg
      className="usa-geography"
      viewBox="-25 -15 1190 690"
      role="group"
      aria-label="Geographic map of all 50 US states, each labeled with its full name"
    >
      <defs>
        <linearGradient id={id} x2="0.8" y2="1">
          <stop stopColor="#b6e7df" />
          <stop offset="1" stopColor="#62b5c8" />
        </linearGradient>
      </defs>
      <g className="map-depth" transform="translate(0 9)" aria-hidden="true">
        {states.map((s) => (
          <path key={s.id} d={s.d} />
        ))}
      </g>
      <g className="map-land" fill={`url(#${id})`}>
        {states.map((s) => (
          <path
            key={s.id}
            d={s.d}
            role="button"
            tabIndex={0}
            data-state={s.name}
            aria-label={`Explore services in ${s.name}`}
            aria-haspopup="dialog"
            aria-controls="state-services-dialog"
          >
            <title>{s.name}</title>
          </path>
        ))}
      </g>
      <g className="map-labels">
        {states.map((s) => {
          const index = callouts.indexOf(s.name),
            external = index >= 0;
          const x = external ? 1015 : s.name === "Mississippi" ? s.x - 4 : s.x;
          const y = external
            ? 130 + index * 42
            : s.name === "Michigan"
              ? s.y + 23
              : s.y;
          const words = external ? [s.name] : s.name.split(" ");
          return (
            <g key={s.id}>
              {external && (
                <path
                  className="map-leader"
                  d={`M${s.x},${s.y}L990,${y - 5}H1005`}
                />
              )}
              <text
                x={x}
                className={
                  ["Hawaii"].includes(s.name)
                    ? "map-island-label"
                    : s.name === "Mississippi"
                      ? "map-narrow-label"
                      : undefined
                }
                y={y - (words.length - 1) * 7}
                textAnchor={external ? "start" : "middle"}
              >
                {words.map((w, i) => (
                  <tspan x={x} dy={i ? 15 : 0} key={i}>
                    {w}
                  </tspan>
                ))}
              </text>
            </g>
          );
        })}
      </g>
      <text className="map-ocean" x="990" y="520">
        ATLANTIC OCEAN
      </text>
      <text className="map-ocean" x="270" y="657">
        ALASKA AND HAWAII SHOWN AS INSETS
      </text>
    </svg>
  );
}
export function CoverageMap() {
  return (
    <figure className="coverage-map" aria-labelledby="coverage-map-title">
      <div className="coverage-map-topline">
        <span id="coverage-map-title">Top 50 States in USA Organic States</span>
      </div>
      <div className="coverage-map-stage">
        <Geography id="map-surface" />
      </div>
      <div className="map-tools">
        <button type="button" data-expand-map>
          Explore full map ↗
        </button>
        <a
          href="https://www.google.com/maps/place/United+States/"
          target="_blank"
          rel="noopener"
        >
          Open Google Maps ↗
        </a>
      </div>
      <label className="map-state-picker">
        Search your state
        <select data-state-picker defaultValue="">
          <option value="" disabled>
            Search your state
          </option>
          {[...states]
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((s) => (
              <option key={s.id} value={s.name}>
                {s.name}
              </option>
            ))}
        </select>
      </label>
      <figcaption>
        Nationwide coverage includes Alaska and Hawaii. Availability and
        delivery timing depend on your project. Geographic boundaries: U.S.
        Census Bureau.
      </figcaption>
      <dialog className="map-dialog" aria-label="USA service coverage map">
        <div className="map-dialog-heading">
          <strong>All 50 states. One point of contact.</strong>
          <button type="button" data-close-map aria-label="Close coverage map">
            Close ×
          </button>
        </div>
        <p>
          Scroll across the map on smaller screens to read every state name.
        </p>
        <div
          className="map-large-scroll"
          tabIndex={0}
          role="region"
          aria-label="Scrollable full-size state map"
        >
          <Geography id="large-map-surface" />
        </div>
      </dialog>
      <dialog
        id="state-services-dialog"
        className="state-services-dialog"
        aria-labelledby="state-services-title"
        aria-describedby="state-services-intro"
      >
        <div className="state-services-heading">
          <p className="eyebrow">Temporary facilities. Nationwide support.</p>
          <button
            type="button"
            data-close-state
            aria-label="Close state services"
          >
            ×
          </button>
        </div>
        <h2 id="state-services-title">
          Services in <span data-state-name>your state</span>
        </h2>
        <p id="state-services-intro">
          Explore rental options for your project in{" "}
          <span data-state-name>your state</span>. Our team can confirm
          availability, delivery and the right configuration for your site.
        </p>
        <ul className="state-service-list">
          {serviceCategories.map((service, index) => (
            <li key={service.href}>
              <a href={service.href}>
                <span className="state-service-number" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{service.name}</span>
                <span aria-hidden="true">↗</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="state-services-cta">
          <div>
            <h3>Plan your rental with us.</h3>
            <p>Share your location, dates and facility needs.</p>
          </div>
          <a className="button" href="/contact-us/" data-state-contact>
            Contact Us <span aria-hidden="true">↗</span>
          </a>
        </div>
        <p className="state-services-call">
          Prefer to call?{" "}
          <a href={`tel:${site.phoneE164}`}>{site.phoneDisplay}</a>
          <span>Available 24/7</span>
        </p>
      </dialog>
    </figure>
  );
}
