import site from "../site.json" with { type: "json" };
import { Cards, EquipmentImage } from "./Equipment";

export function Home() {
  return (
    <>
      <section className="home-masthead">
        <div className="wrap">
          <div className="masthead-top">
            <div>
              <span className="eyebrow">
                TEMPORARY FACILITIES. NATIONWIDE SUPPORT.
              </span>
              <h1>
                Keep your
                <br />
                operations <em>moving.</em>
              </h1>
            </div>
            <div className="masthead-intro">
              <p>
                Mobile kitchens, restroom and shower trailers, and workforce
                facilities for the people counting on you.
              </p>
              <a href="#equipment" className="masthead-explore">
                Find your facilities <span aria-hidden="true">↓</span>
              </a>
            </div>
          </div>
          <div className="masthead-stage">
            <figure className="masthead-photo">
              <EquipmentImage
                image="kitchen"
                alt="Mobile kitchen interior with commercial cooking and preparation equipment"
                priority
              />
              <figcaption>
                <span>Mobile Kitchens</span>
                <a
                  href="/equipment-rental/mobile-kitchen-trailers/"
                  aria-label="Explore mobile kitchens"
                >
                  Explore <span aria-hidden="true">↗</span>
                </a>
              </figcaption>
            </figure>
            <aside className="masthead-project">
              <span className="eyebrow">THE WORK GOES ON</span>
              <h2>
                A renovation.
                <br />A remote site.
                <br />
                <em>A way forward.</em>
              </h2>
              <p>
                Tell us where, when and what your team needs. We’ll help you
                work through the facilities and the details.
              </p>
              <a className="button" href="/contact-us/">
                Plan your rental <span aria-hidden="true">↗</span>
              </a>
              <a className="masthead-phone" href={`tel:${site.phoneE164}`}>
                <small>Talk to our team, 24/7</small>
                <strong>{site.phoneDisplay}</strong>
              </a>
            </aside>
          </div>
        </div>
      </section>
      <section className="wrap section equipment-section" id="equipment">
        <div className="section-heading">
          <div>
            <span className="eyebrow">FIND YOUR FACILITIES</span>
            <h2>
              Space for the work.
              <br />
              <em>Support for the people.</em>
            </h2>
          </div>
          <p>
            A kitchen renovation. A remote job site. An unexpected closure.
            Explore the facilities that help your team carry on.
          </p>
        </div>
        <Cards editorial />
      </section>
      <section className="process section" id="planning">
        <div className="wrap process-grid">
          <div className="process-intro">
            <span className="eyebrow">FROM FIRST CALL TO SITE PLAN</span>
            <h2>
              Let's work through
              <br />
              the details.
            </h2>
            <p>
              You know your operation. We help you work out the facilities,
              access and utilities it needs.
            </p>
            <div className="process-note">
              <span>START WITH A CONVERSATION</span>
              <a href={`tel:${site.phoneE164}`}>{site.phoneDisplay}</a>
            </div>
          </div>
          <ol className="process-steps">
            {[
              [
                "Tell us what you need",
                "Share your location, start date and how many people you need to support. A planned renovation and an urgent response call for different arrangements.",
                "Location · Dates · People",
              ],
              [
                "Work through your site",
                "Discuss equipment, delivery access, power, water and wastewater. We will help you identify what needs to be in place.",
                "Equipment · Access · Utilities",
              ],
              [
                "Confirm the arrangements",
                "Review availability, delivery, setup and servicing in your proposal. Agree on the details before the equipment arrives.",
                "Proposal · Delivery · Setup",
              ],
            ].map(([t, d, n], i) => (
              <li key={t} data-step>
                <span className="step-number">0{i + 1}</span>
                <div>
                  <h3>{t}</h3>
                  <p>{d}</p>
                  <span className="step-note">{n}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="wrap section industry-section">
        <div className="industry-intro">
          <span className="eyebrow">BUILT AROUND YOUR PROJECT</span>
          <h2>
            What brings
            <br />
            you here?
          </h2>
          <p>
            Find a starting point for your team, your site and your schedule.
          </p>
          <a className="text-link" href="/service-areas/">
            Explore services & locations →
          </a>
        </div>
        <div className="industry-links">
          {[
            [
              "Construction & workforce",
              "Facilities for crews working away from home.",
              "/man-camps-for-rent/",
            ],
            [
              "Government & public services",
              "Temporary spaces that support ongoing operations.",
              "/government/",
            ],
            [
              "Food service & hospitality",
              "Keep food preparation going while your needs change.",
              "/food-services-2/",
            ],
            [
              "Emergency & disaster response",
              "Discuss urgent facility and workforce requirements.",
              "/disaster-relief-man-camp-workforce-rentals/",
            ],
          ].map(([n, d, p]) => (
            <a href={p} key={p}>
              <div>
                <h3>{n}</h3>
                <p>{d}</p>
              </div>
              <span aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </section>
      <section className="faq-section">
        <div className="wrap faq-grid">
          <div>
            <span className="eyebrow">BEFORE YOU CALL</span>
            <h2>
              A few useful
              <br />
              things to know.
            </h2>
            <p>
              Have a specific question?
              <br />
              <a href={`tel:${site.phoneE164}`}>Call {site.phoneDisplay} ↗</a>
            </p>
          </div>
          <div className="faq-list">
            {[
              [
                "What information do you need for a quote?",
                "Your project location, preferred dates, expected rental duration and the number of people using the facilities are a good start. For a kitchen, include your menu and meal volume.",
              ],
              [
                "Can you help with an urgent requirement?",
                `Call our team on ${site.phoneDisplay} and explain what is happening at your site. We can discuss current availability and the delivery arrangements your project needs.`,
              ],
              [
                "What should I check at the site?",
                "Look at vehicle access, space for the equipment and available power, water and wastewater connections. Share any restrictions so they can be considered in your proposal.",
              ],
              [
                "Can I arrange several types of facility together?",
                "Yes. Discuss your kitchen, restroom, shower and workforce requirements in the same conversation so the facilities can be planned around your operation.",
              ],
            ].map(([q, a]) => (
              <details className="faq-item" key={q}>
                <summary>
                  {q}
                  <span aria-hidden="true">+</span>
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
