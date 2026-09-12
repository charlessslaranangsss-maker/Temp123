import site from "../site.json" with { type: "json" };
import { Cards, EquipmentImage } from "./Equipment";

const projectSteps = [
  [
    "Tell us what you need",
    "Share your location, rental dates and the number of people you need to support. For kitchens, tell us about your menu and meal volume.",
    "01",
    "Your project brief",
  ],
  [
    "Build the right setup",
    "Work through equipment, vehicle access, power, water and wastewater with a specialist. Plan the facilities around your operation.",
    "02",
    "Equipment + site planning",
  ],
  [
    "Coordinate the details",
    "Confirm availability, delivery, installation and servicing in your proposal, so you know what needs to happen before arrival.",
    "03",
    "Delivery + ongoing support",
  ],
];

export function Home() {
  return (
    <div className="homepage">
      <section className="rental-hero" aria-labelledby="rental-title">
        <div className="wrap rental-hero-grid">
          <div className="rental-hero-copy">
            <span className="eyebrow">
              <span className="hero-rule" aria-hidden="true" /> NATIONWIDE
              EQUIPMENT RENTALS
            </span>
            <h1 id="rental-title">
              Mobile kitchens &amp;
              <br />
              temporary facilities.
              <br />
              <em>Keep moving.</em>
            </h1>
            <p>
              Keep your team working, your kitchen serving and your project on
              track. Rent the facilities you need for renovations, remote sites
              and emergency response.
            </p>
            <div className="rental-hero-actions">
              <a className="button home-primary" href="/contact-us/">
                Contact us <span aria-hidden="true">↗</span>
              </a>
              <a className="home-secondary" href="#equipment">
                Explore rental services <span aria-hidden="true">↓</span>
              </a>
            </div>
            <div className="hero-support">
              <span aria-hidden="true">24/7</span>
              <p>
                A real conversation.
                <br />
                <a href={`tel:${site.phoneE164}`}>{site.phoneDisplay}</a>
              </p>
            </div>
          </div>
          <figure className="rental-hero-photo">
            <EquipmentImage
              image="kitchen"
              alt="Stainless steel cooking line and preparation space inside a mobile kitchen"
              priority
            />
            <div className="photo-corner" aria-hidden="true">
              BUILT FOR
              <br />
              THE WORK AHEAD.
            </div>
            <figcaption>
              <span>
                <small>FACILITIES THAT WORK AS HARD AS YOU DO</small>Mobile
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
          <div className="hero-service-strip" aria-label="Main rental services">
            {[
              [
                "01",
                "Mobile kitchens",
                "/equipment-rental/mobile-kitchen-trailers/",
              ],
              [
                "02",
                "Restrooms & showers",
                "/services/shower-restroom-combination-trailers/",
              ],
              ["03", "Refrigeration", "/equipment-rental/refrigeration/"],
              ["04", "Workforce facilities", "/man-camps-for-rent/"],
            ].map(([number, name, href]) => (
              <a href={href} key={href}>
                <small>{number}</small>
                <span>{name}</span>
                <b aria-hidden="true">↗</b>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section
        className="wrap home-services"
        id="equipment"
        aria-labelledby="equipment-title"
      >
        <div className="home-section-heading">
          <div>
            <span className="eyebrow">
              THE EQUIPMENT. THE SUPPORT. THE SOLUTION.
            </span>
            <h2 id="equipment-title">
              Your site. <em>Fully supported.</em>
            </h2>
          </div>
          <p>
            From one trailer to a complete temporary setup, find the rental
            services that keep your people and operations moving.
          </p>
        </div>
        <Cards homepage />
        <div className="home-service-help">
          <p>
            <strong>Several facilities. One conversation.</strong> Tell us what
            your project needs.
          </p>
          <a href="/contact-us/">
            Plan your rental <span aria-hidden="true">↗</span>
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
              <span className="eyebrow">FROM FIRST CALL TO SITE SETUP</span>
              <h2 id="planning-title">
                A clear plan.
                <br />
                <em>A smoother project.</em>
              </h2>
            </div>
            <p>
              You know your operation. We help connect the equipment, site
              requirements and delivery details.
            </p>
          </div>
          <ol className="rental-process-steps">
            {projectSteps.map(([title, description, number, label]) => (
              <li key={number} data-step>
                <div className="process-step-top">
                  <span>{number}</span>
                  <i aria-hidden="true" />
                </div>
                <small>{label}</small>
                <h3>{title}</h3>
                <p>{description}</p>
              </li>
            ))}
          </ol>
          <div className="process-contact">
            <span>Let’s work through your requirements.</span>
            <a href={`tel:${site.phoneE164}`}>
              Call {site.phoneDisplay} <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>

      <section
        className="wrap home-industries"
        aria-labelledby="industries-title"
      >
        <div className="home-industry-intro">
          <span className="eyebrow">WHEREVER THE WORK TAKES YOU</span>
          <h2 id="industries-title">
            Different projects.
            <br />
            <em>The same commitment.</em>
          </h2>
          <p>
            Planned downtime or an unexpected challenge. Start with the support
            your team needs.
          </p>
          <a className="home-inline-link" href="/service-areas/">
            Explore our service areas <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div className="home-industry-links">
          {[
            [
              "01",
              "Construction & workforce",
              "Kitchens, sleeping accommodation and daily essentials for teams working away from home.",
              "/man-camps-for-rent/",
            ],
            [
              "02",
              "Food service & hospitality",
              "Keep food preparation and service going during renovations, events and temporary closures.",
              "/food-services-2/",
            ],
            [
              "03",
              "Government & public services",
              "Temporary facilities planned around your operational and procurement requirements.",
              "/government/",
            ],
            [
              "04",
              "Emergency & disaster response",
              "Discuss urgent equipment, site and workforce needs with our team, 24 hours a day.",
              "/disaster-relief-man-camp-workforce-rentals/",
            ],
          ].map(([number, name, description, href]) => (
            <a href={href} key={href}>
              <small>{number}</small>
              <div>
                <h3>{name}</h3>
                <p>{description}</p>
              </div>
              <span aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </section>

      <section className="faq-section home-faq" aria-labelledby="faq-title">
        <div className="wrap faq-grid">
          <div>
            <span className="eyebrow">PLAN WITH CONFIDENCE</span>
            <h2 id="faq-title">
              Temporary facility
              <br />
              <em>rental questions.</em>
            </h2>
            <p>
              Need help with your specific site?
              <br />
              <a href="/contact-us/">Talk to a rental specialist ↗</a>
            </p>
          </div>
          <div className="faq-list">
            {[
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
            ].map(([question, answer]) => (
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
