const states = [
  ["WA", "Washington", 1, 1],
  ["MT", "Montana", 3, 1],
  ["ND", "North Dakota", 5, 1],
  ["MN", "Minnesota", 6, 1],
  ["WI", "Wisconsin", 7, 1],
  ["MI", "Michigan", 8, 1],
  ["VT", "Vermont", 11, 1],
  ["NH", "New Hampshire", 12, 1],
  ["ME", "Maine", 13, 1],
  ["OR", "Oregon", 1, 2],
  ["ID", "Idaho", 2, 2],
  ["WY", "Wyoming", 3, 2],
  ["SD", "South Dakota", 5, 2],
  ["IA", "Iowa", 6, 2],
  ["IL", "Illinois", 7, 2],
  ["IN", "Indiana", 8, 2],
  ["OH", "Ohio", 9, 2],
  ["PA", "Pennsylvania", 10, 2],
  ["NY", "New York", 11, 2],
  ["MA", "Massachusetts", 13, 2],
  ["CA", "California", 1, 3],
  ["NV", "Nevada", 2, 3],
  ["UT", "Utah", 3, 3],
  ["CO", "Colorado", 4, 3],
  ["NE", "Nebraska", 5, 3],
  ["MO", "Missouri", 6, 3],
  ["KY", "Kentucky", 7, 3],
  ["WV", "West Virginia", 8, 3],
  ["VA", "Virginia", 9, 3],
  ["MD", "Maryland", 10, 3],
  ["NJ", "New Jersey", 11, 3],
  ["CT", "Connecticut", 12, 3],
  ["RI", "Rhode Island", 13, 3],
  ["AZ", "Arizona", 2, 4],
  ["NM", "New Mexico", 3, 4],
  ["KS", "Kansas", 5, 4],
  ["AR", "Arkansas", 6, 4],
  ["TN", "Tennessee", 7, 4],
  ["NC", "North Carolina", 9, 4],
  ["DE", "Delaware", 11, 4],
  ["OK", "Oklahoma", 5, 5],
  ["LA", "Louisiana", 6, 5],
  ["MS", "Mississippi", 7, 5],
  ["AL", "Alabama", 8, 5],
  ["GA", "Georgia", 9, 5],
  ["SC", "South Carolina", 10, 5],
  ["TX", "Texas", 5, 6],
  ["FL", "Florida", 10, 6],
  ["AK", "Alaska", 1, 7],
  ["HI", "Hawaii", 3, 7],
] as const;

export function CoverageMap() {
  return (
    <figure className="coverage-map" aria-labelledby="coverage-map-title">
      <div className="coverage-map-topline">
        <span id="coverage-map-title">USA service coverage</span>
        <strong>50 states</strong>
      </div>
      <div className="coverage-map-stage">
        <div className="coverage-map-glow" aria-hidden="true" />
        <ul aria-label="Temporary 123 service coverage in all 50 states">
          {states.map(([code, name, column, row]) => (
            <li
              key={code}
              title={name}
              aria-label={name}
              style={
                {
                  "--state-column": column,
                  "--state-row": row,
                } as React.CSSProperties
              }
            >
              {code}
            </li>
          ))}
        </ul>
      </div>
      <figcaption>
        Published coverage includes the continental United States, Alaska and
        Hawaii. Equipment availability and delivery timing vary by project.
      </figcaption>
    </figure>
  );
}
