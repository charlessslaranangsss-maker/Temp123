import calculatorCities from "./calculatorCities.json" with { type: "json" };
import {
  deliveryStartingPrice,
  equipmentPrices,
  trailerLengths,
} from "./calculatorData";
import site from "../site.json" with { type: "json" };

const money = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

const states = Object.entries(calculatorCities).sort(([a], [b]) => a.localeCompare(b));

export function RentalCalculator() {
  return (
    <div className="calculator-page">
      <section className="calculator-hero">
        <div className="wrap calculator-hero-grid">
          <div>
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <a href="/">Home</a><span>/</span><span aria-current="page">Rental calculator</span>
            </nav>
            <span className="eyebrow">NATIONWIDE PROJECT PLANNING</span>
            <h1>Nationwide Temporary Facility Rental and Delivery Calculator</h1>
            <p data-h1-intro>
              Calculate a preliminary equipment and delivery starting estimate
              for your selected temporary facility and trailer length. Enter the
              project state, city and dates for planning; final rental-period
              pricing, transport charges and availability require a separate quote.
            </p>
          </div>
          <aside className="calculator-callout" aria-label="Estimate notice">
            <strong>Planning estimate—not a final quote</strong>
            <p>
              Dates do not change the estimate because rental-period pricing was
              not provided. Availability, site access and final scope must be confirmed.
            </p>
          </aside>
        </div>
      </section>

      <CalculatorWorkspace />

      <section className="calculator-prices" aria-labelledby="price-guide-title">
        <div className="wrap section">
          <div className="home-section-heading">
            <div><span className="eyebrow">PUBLISHED STARTING PRICES</span><h2 id="price-guide-title">A transparent planning baseline.</h2></div>
            <p>These figures are starting points in U.S. dollars and require a project-specific quote.</p>
          </div>
          <div className="calculator-tables">
            <div className="price-table-wrap">
              <h3>Facility and equipment</h3>
              <table>
                <thead><tr><th>Equipment</th><th>Starting price</th></tr></thead>
                <tbody>{equipmentPrices.map((item) => (
                  <tr key={item.id}><td><strong>{item.name}</strong><small>{item.details}</small></td><td>{money(item.startingPrice)}{"perPerson" in item ? " per person" : ""}</td></tr>
                ))}</tbody>
              </table>
            </div>
            <div className="price-table-wrap">
              <h3>Trailer delivery</h3>
              <table>
                <thead><tr><th>Trailer length</th><th>Starting delivery</th></tr></thead>
                <tbody>{trailerLengths.map((length) => (
                  <tr key={length}><td>{length} ft</td><td>{money(deliveryStartingPrice(length))}</td></tr>
                ))}</tbody>
              </table>
            </div>
          </div>
          <p className="calculator-disclaimer">
            Estimates exclude final rental duration, taxes, permits, utilities,
            site preparation, setup, servicing, mileage adjustments and other
            project-specific charges unless confirmed in writing.
          </p>
        </div>
      </section>

      <section className="wrap section calculator-locations" aria-labelledby="calculator-locations-title">
        <div className="home-section-heading">
          <div><span className="eyebrow">READABLE NATIONAL COVERAGE</span><h2 id="calculator-locations-title">Temporary facility rental by state and city.</h2></div>
          <p>Browse the city and state names served by the calculator. These are planning references, not automatically generated city landing pages.</p>
        </div>
        <div className="calculator-state-list">
          {states.map(([state, cities]) => (
            <details key={state}>
              <summary>{state}<span>{cities.length.toLocaleString("en-US")} locations</span></summary>
              <p>
                Temporary facility rental, trailer leasing and delivery planning in {state}:{" "}
                {cities.map((city, index) => (
                  <span key={city}>{index ? ", " : ""}{city}</span>
                ))}.
              </p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}

export function CalculatorWorkspace({ homepage = false }: { homepage?: boolean }) {
  const titleId = homepage ? "home-calculator-title" : "estimate-title";
  return (
    <section
      className={`wrap section calculator-workspace${homepage ? " calculator-workspace-home" : ""}`}
      aria-labelledby={titleId}
    >
        <div className="calculator-form-card">
          <span className="eyebrow">STARTING ESTIMATE</span>
          <h2 id={titleId}>
            {homepage
              ? "Nationwide temporary facility rental calculator."
              : "Tell us what your site needs."}
          </h2>
          {homepage && (
            <p className="calculator-home-intro">
              Combine published equipment and trailer-delivery starting prices,
              then call our team for a project-specific quote.
            </p>
          )}
          <form id="rental-calculator-form">
            <div className="calculator-fields">
              <label>
                State
                <select name="state" autoComplete="address-level1" required defaultValue="">
                  <option value="" disabled>Choose a state</option>
                  {Object.keys(calculatorCities).map((state) => (
                    <option value={state} key={state}>{state}</option>
                  ))}
                </select>
              </label>
              <label>
                City
                <select
                  name="city"
                  autoComplete="address-level2"
                  required
                  defaultValue=""
                  disabled
                >
                  <option value="" disabled>Choose a state first</option>
                </select>
              </label>
              <label>
                ZIP code <span className="field-optional">(optional)</span>
                <input
                  name="zipCode"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  maxLength={10}
                  pattern="[0-9]{5}(-[0-9]{4})?"
                  title="Enter a 5-digit ZIP code or ZIP+4."
                  placeholder="e.g. 98362"
                />
              </label>
              <label className="calculator-wide">
                Equipment type
                <select name="equipment" required defaultValue="">
                  <option value="" disabled>Choose equipment</option>
                  {equipmentPrices.map((item) => (
                    <option value={item.id} key={item.id}>{item.name}</option>
                  ))}
                </select>
              </label>
              <label>
                Trailer length
                <select name="length" required defaultValue="20">
                  {trailerLengths.map((length) => (
                    <option value={length} key={length}>{length} ft</option>
                  ))}
                </select>
              </label>
              <label>
                Number of people
                <input name="people" type="number" min="1" step="1" required defaultValue="1" />
              </label>
              <label>
                Rental start date
                <input name="startDate" type="date" required />
              </label>
              <label>
                Rental end date
                <input name="endDate" type="date" required />
              </label>
            </div>
            <button className="button calculator-calculate" type="button" data-calculator-calculate>
              Calculate Starting Estimate <span aria-hidden="true">→</span>
            </button>
            <p className="calculator-submit-status" data-calculator-status role="status" aria-live="polite" />

            <fieldset className="calculator-quote-section">
              <legend>Optional: request an exact quote</legend>
              <p>
                Your estimate does not send your information. Complete this section
                only if you want our team to contact you about availability and final pricing.
              </p>
              <div className="calculator-fields">
                <label>
                  Name
                  <input name="name" autoComplete="name" required minLength={2} maxLength={100} />
                </label>
                <label>
                  Phone
                  <input name="phone" type="tel" autoComplete="tel" required minLength={7} maxLength={30} pattern="[+()0-9 .-]+" />
                </label>
                <label className="calculator-wide">
                  Email
                  <input name="email" type="email" autoComplete="email" required maxLength={254} />
                </label>
                <label className="calculator-wide">
                  Industry
                  <select name="industry" required defaultValue="">
                    <option value="" disabled>Choose an industry</option>
                    <option value="construction">Construction and workforce</option>
                    <option value="government">Government and public services</option>
                    <option value="food-service">Food service and hospitality</option>
                    <option value="emergency-response">Emergency and disaster response</option>
                    <option value="other">Other</option>
                  </select>
                </label>
                <label className="calculator-wide">
                  Project details <span className="field-optional">(optional)</span>
                  <textarea name="projectDetails" rows={3} maxLength={1500} placeholder="Site access, utilities, occupancy or other requirements" />
                </label>
              </div>
              <div className="honeypot" aria-hidden="true">
                <label>Company website<input name="website" tabIndex={-1} autoComplete="off" /></label>
              </div>
              <label className="calculator-consent">
                <input type="checkbox" name="consent" required />
                <span>
                  I agree that {site.brand} may use these details to prepare and respond to my quote request. <a href="/privacy/">Read the Privacy Notice.</a>
                </span>
              </label>
              <p className="calculator-privacy">
                Quote-request details are securely saved only when you select Request Exact Quote.
              </p>
              {!site.inquiriesEnabled && (
                <p className="calculator-submit-status" role="status">
                  Online exact-quote requests are not enabled yet. Your estimate remains available;
                  call {site.phoneDisplay} for confirmed pricing and availability.
                </p>
              )}
              <button
                className="button button-secondary"
                type="submit"
                data-calculator-submit
                disabled={!site.inquiriesEnabled}
              >
                Request Exact Quote <span aria-hidden="true">↗</span>
              </button>
              <p className="calculator-submit-status" data-calculator-submit-status role="status" aria-live="polite" />
            </fieldset>
          </form>
        </div>
        <div className="calculator-result-card" aria-live="polite" aria-atomic="true">
          <span className="eyebrow">PRELIMINARY TOTAL</span>
          <p className="calculator-total" data-estimate-total>Choose your equipment</p>
          <dl>
            <div><dt>Equipment starting price</dt><dd data-equipment-price>—</dd></div>
            <div><dt>Starting delivery (trailer-size based)</dt><dd data-delivery-price>—</dd></div>
          </dl>
          <p data-estimate-message>
            Complete the fields to calculate the published starting prices. Your city is used
            for project planning; final route, mileage, toll, ferry and site-access charges require
            confirmation. Call us for discounts!
          </p>
          <a className="calculator-phone" href={`tel:${site.phoneE164}`}>
            Call {site.phoneDisplay} to request a quote ↗
          </a>
          {homepage && (
            <a className="calculator-details-link" href="/rental-calculator/">
              View full pricing and nationwide city coverage ↗
            </a>
          )}
        </div>
      </section>
  );
}
