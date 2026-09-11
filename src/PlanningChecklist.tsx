import { useState } from "react";
const items = [
  ["People & purpose", "Occupancy, daily activities and operating hours"],
  ["Location & access", "Site address, delivery route and restrictions"],
  ["Utilities & services", "Known power, water, drainage and servicing"],
  ["Dates & responsibilities", "Start date, duration and the site contact"],
];
export function PlanningChecklist() {
  const [ready, setReady] = useState<string[]>([]);
  return (
    <section className="wrap brief-builder" aria-labelledby="brief-heading">
      <div>
        <p className="eyebrow">YOUR WORKING CHECKLIST</p>
        <h2 id="brief-heading">
          Turn the unknowns
          <br />
          into a next step.
        </h2>
        <p>
          Check the details you already know. Bring the remaining questions to
          your project conversation.
        </p>
        <p className="check-progress" role="status">
          {ready.length} of 4 planning areas ready
        </p>
        <div
          className={`brief-progress progress-${ready.length}`}
          aria-hidden="true"
        >
          <span />
        </div>
      </div>
      <div className="brief-checks">
        {items.map(([title, note]) => (
          <label key={title}>
            <input
              type="checkbox"
              checked={ready.includes(title)}
              onChange={(e) =>
                setReady(
                  e.target.checked
                    ? [...ready, title]
                    : ready.filter((v) => v !== title),
                )
              }
            />
            <span>
              <strong>{title}</strong>
              <span>{note}</span>
            </span>
          </label>
        ))}
        <a className="text-link" href="/contact/">
          Bring your brief to the conversation <span aria-hidden="true">↗</span>
        </a>
        <p className="check-note">
          Your checklist stays on this page. Nothing is sent or stored.
        </p>
      </div>
    </section>
  );
}
