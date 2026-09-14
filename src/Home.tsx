import site from "../site.json" with { type: "json" };
import { Cards, EquipmentImage } from "./Equipment";
import { FacilityIcon } from "./FacilityIcon";

const rentalGroups = [
  [
    "kitchen",
    "Mobile Commercial Kitchen",
    "Commercial kitchen rentals.",
    "/equipment-rental/mobile-kitchen-trailers/",
  ],
  [
    "shower",
    "Shower",
    "Mobile shower trailer rentals.",
    "/equipment-rental/shower-trailer/",
  ],
  [
    "shower",
    "Shower & Restroom Combination",
    "Private hygiene facilities.",
    "/services/shower-restroom-combination-trailers/",
  ],
  [
    "living",
    "Sleeper/Bunkbed Trailers",
    "Crew support facilities.",
    "/equipment-rental/mobile-sleep-trailers/",
  ],
];
const steps = [
  [
    "phone",
    "Tell us about your project",
    "Share your location, dates and the people you need to support. We’ll work through the right facilities with you.",
    "01",
  ],
  [
    "pin",
    "Plan the right setup",
    "Connect equipment choices with site access, power, water and wastewater requirements.",
    "02",
  ],
  [
    "truck",
    "Bring the details together",
    "Confirm availability, delivery, setup and ongoing servicing in your project proposal.",
    "03",
  ],
];
const faqs = [
  [
    "What information do you need for a rental quote?",
    "Your project location, preferred dates, expected rental duration and the number of people using the facilities are a good start. For a kitchen, include your menu and meal volume.",
  ],
  [
    "Can I rent several types of facility together?",
    "Yes. Discuss your kitchen, refrigeration, restroom, shower and workforce requirements in one conversation so the facilities can be planned around your operation.",
  ],
  [
    "What utilities and site access should I check?",
    "Check vehicle access, space for the equipment and available power, water and wastewater connections. Share site restrictions with your specialist so they can be considered in your proposal.",
  ],
  [
    "Can you help with an urgent requirement?",
    `Call ${site.phoneDisplay} and explain what is happening at your site. Our team can discuss current availability and the delivery arrangements your project needs.`,
  ],
];

export function Home() {
  return (
    <div className="homepage">
      <section className="rental-hero" aria-labelledby="rental-title">
        <div className="hero-orbit" aria-hidden="true" />
        <div className="wrap rental-hero-grid">
          <div className="rental-hero-copy">
            <span className="hero-kicker">
              <span aria-hidden="true" /> Nationwide equipment rentals
            </span>
            <h1 id="rental-title">
              Temporary Facilities Rental
              <br />
              <em>Rent or Lease Nationwide</em>
            </h1>
            <p>
              Rent or lease mobile commercial kitchens, shower and restroom
              combination trailers, shower trailers, and sleeper or bunkbed
              trailers. Supporting Temporary Facilities rental options include
              laundry, dishwashing, refrigeration, restrooms and handwashing.
              Emergency 24/7.
            </p>
            <div className="rental-hero-actions">
              <a className="button home-primary" href="/contact-us/">
                Contact us <span aria-hidden="true">↗</span>
              </a>
              <a className="home-secondary" href="#equipment">
                Find your rental <span aria-hidden="true">↓</span>
              </a>
            </div>
            <a
              className="hero-support"
              href={`tel:${site.phoneE164}`}
              aria-label={`24/7. A real conversation. Call ${site.phoneDisplay}`}
            >
              <span className="hero-support-icon">
                <FacilityIcon kind="phone" />
              </span>
              <span className="hero-support-copy">
                <small>
                  <i aria-hidden="true" />
                  24/7 · A real conversation
                </small>
                <strong>{site.phoneDisplay}</strong>
              </span>
              <span className="support-arrow" aria-hidden="true">
                ↗
              </span>
            </a>
          </div>
          <div className="rental-hero-visual">
            <div className="hero-photo-label">
              <FacilityIcon kind="pin" />
              <span>
                YOUR PROJECT.
                <br />
                <strong>Our next destination.</strong>
              </span>
            </div>
            <figure className="rental-hero-photo">
              <EquipmentImage
                image="kitchen"
                alt="Stainless steel cooking line and preparation space inside a mobile kitchen"
                priority
              />
              <figcaption>
                <span>
                  <small>REAL EQUIPMENT. REAL POSSIBILITIES.</small>Mobile
                  kitchen rentals
                </span>
                <a
                  href="/equipment-rental/mobile-kitchen-trailers/"
                  aria-label="Explore mobile kitchen rentals"
                >
                  ↗
                </a>
              </figcaption>
            </figure>
            <div
              className="hero-logistics"
              aria-label="Equipment, site planning and delivery coordination"
            >
              <div className="logistics-copy">
                <span>MORE THAN A TRAILER.</span>
                <strong>A plan that fits.</strong>
              </div>
              <div className="logistics-flow">
                <span>
                  <FacilityIcon kind="kitchen" />
                  <small>Equipment</small>
                </span>
                <i aria-hidden="true" />
                <span>
                  <FacilityIcon kind="pin" />
                  <small>Site planning</small>
                </span>
                <i aria-hidden="true" />
                <span>
                  <FacilityIcon kind="truck" />
                  <small>Delivery</small>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div
          className="wrap hero-service-strip"
          aria-label="Main rental services"
        >
          {rentalGroups.map(([icon, title, text, href]) => (
            <a href={href} key={href}>
              <span className="service-shortcut-icon">
                <FacilityIcon kind={icon} />
              </span>
              <span>
                <strong>{title}</strong>
                <small>{text}</small>
              </span>
              <b aria-hidden="true">↗</b>
            </a>
          ))}
        </div>
      </section>

      <section
        className="wrap home-services"
        id="equipment"
        aria-labelledby="equipment-title"
      >
        <div className="home-section-heading">
          <div>
            <span className="eyebrow">FIND YOUR FACILITY</span>
            <h2 id="equipment-title">
              Big plans.
              <br />
              <em>Emergency equipment rentals.</em>
            </h2>
          </div>
          <p>
            From one trailer to a complete temporary setup. Explore the
            facilities that keep your people comfortable and your operation
            working.
          </p>
        </div>
        <div
          className="rental-filters"
          role="group"
          aria-label="Filter rental services"
          hidden
        >
          {[
            ["all", "All facilities", "9"],
            ["kitchen", "Kitchens & cold storage", "3"],
            ["sanitation", "Restrooms & hygiene", "4"],
            ["workforce", "Workforce living", "2"],
          ].map(([value, label, count]) => (
            <button
              type="button"
              data-rental-filter={value}
              aria-pressed={value === "all"}
              aria-controls="home-rental-grid"
              key={value}
            >
              {label}
              <span>{count}</span>
            </button>
          ))}
        </div>
        <p
          className="sr-only"
          data-rental-status
          role="status"
          aria-live="polite"
        >
          Showing all 9 facilities
        </p>
        <Cards homepage />
        <div className="home-service-help">
          <span className="service-help-icon">
            <FacilityIcon kind="phone" />
          </span>
          <p>
            <strong>Not sure which facilities you need?</strong>Let’s build your
            rental plan together.
          </p>
          <a className="button" href="/contact-us/">
            Talk to a specialist <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>

      <section
        className="home-process"
        id="planning"
        aria-labelledby="planning-title"
      >
        <div className="wrap">
          <div className="home-section-heading">
            <div>
              <span className="eyebrow">FROM FIRST CALL TO YOUR SITE</span>
              <h2 id="planning-title">
                Less to coordinate.
                <br />
                <em>More room to focus.</em>
              </h2>
            </div>
            <p>
              Keep your attention on the work ahead. We help connect the
              facilities, site requirements and delivery details.
            </p>
          </div>
          <ol className="rental-process-steps">
            {steps.map(([icon, title, description, number]) => (
              <li key={number} data-step>
                <div className="process-step-top">
                  <span>
                    <FacilityIcon kind={icon} />
                  </span>
                  <i aria-hidden="true" />
                  <b>{number}</b>
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
              </li>
            ))}
          </ol>
          <div className="process-contact">
            <span>
              <i aria-hidden="true" />A real team. Ready to talk through your
              project.
            </span>
            <a href={`tel:${site.phoneE164}`}>
              <FacilityIcon kind="phone" />
              Call {site.phoneDisplay}
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>

      <section
        className="wrap home-industries"
        aria-labelledby="industries-title"
      >
        <div className="home-industry-intro">
          <span className="eyebrow">BUILT AROUND YOUR OPERATION</span>
          <h2 id="industries-title">
            Rental services for
            <br />
            <em>your operation.</em>
          </h2>
          <p>
            Rent or lease Temporary Facilities for construction, hospitality,
            public services and emergency base camps. Start with kitchens,
            combination trailers, showers and sleeper accommodation.
          </p>
          <a className="home-inline-link" href="/service-areas/">
            Explore service areas <span aria-hidden="true">↗</span>
          </a>
          <div className="home-coverage-mark" aria-hidden="true">
            <FacilityIcon kind="pin" />
            <div>
              <strong>Nationwide reach.</strong>
              <span>Project by project. Site by site.</span>
            </div>
          </div>
        </div>
        <div className="home-industry-links">
          {[
            [
              "living",
              "Construction & workforce",
              "Rent kitchens, shower and restroom combinations, showers and sleeper trailers for base camps and man camps.",
              "/man-camps-for-rent/",
            ],
            [
              "kitchen",
              "Food service & hospitality",
              "Kitchen rental and supporting hygiene and accommodation facilities for renovations, events and service interruptions.",
              "/food-services-2/",
            ],
            [
              "pin",
              "Government & public services",
              "Lease temporary kitchens, combination facilities, showers and sleeper trailers for public-service operations.",
              "/government/",
            ],
            [
              "truck",
              "Emergency & disaster response",
              "Emergency 24/7: rent kitchens, hygiene facilities and sleeper trailers for response teams and base camps.",
              "/disaster-relief-man-camp-workforce-rentals/",
            ],
          ].map(([icon, title, description, href]) => (
            <a href={href} key={href}>
              <span className="industry-icon">
                <FacilityIcon kind={icon} />
              </span>
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
              <span className="industry-arrow" aria-hidden="true">
                ↗
              </span>
            </a>
          ))}
        </div>
      </section>

      <section className="faq-section home-faq" aria-labelledby="faq-title">
        <div className="wrap faq-grid">
          <div>
            <span className="eyebrow">GOOD QUESTIONS. CLEAR ANSWERS.</span>
            <h2 id="faq-title">
              Let’s make
              <br />
              <em>planning simpler.</em>
            </h2>
            <p>
              Have something specific in mind?
              <br />
              <a href="/contact-us/">Talk to a Rental Specialist ↗</a>
            </p>
          </div>
          <div className="faq-list">
            {faqs.map(([question, answer]) => (
              <details className="faq-item" key={question}>
                <summary>
                  {question}
                  <span aria-hidden="true">+</span>
                </summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
