export function FacilityArt() {
  return (
    <svg viewBox="0 0 660 520" role="img" aria-labelledby="facility-title">
      <title id="facility-title">
        Concept illustration of a temporary kitchen facility, not an actual
        fleet unit
      </title>
      <defs>
        <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
          <path
            d="M32 0H0V32"
            fill="none"
            stroke="currentColor"
            strokeOpacity=".1"
          />
        </pattern>
      </defs>
      <rect width="660" height="520" fill="url(#grid)" />
      <g stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
        <path d="M60 375 430 490 622 372 248 260Z" className="art-ground" />
        <path d="M102 218 446 316 588 233 245 139Z" className="art-roof" />
        <path d="M102 218V365L446 465V316Z" className="art-front" />
        <path d="M446 316V465L588 381V233Z" className="art-side" />
        <path d="M126 256 276 300V359L126 315Z" className="art-window" />
        <path d="M296 307 377 331V389L296 366Z" className="art-window" />
        <path d="M476 330 550 287V399L476 442Z" className="art-door" />
        <path
          d="M192 275V334M232 287V346M336 319V378M115 346 432 438M463 440 570 378"
          fill="none"
        />
        <path d="M488 435 533 449 570 427 526 413Z" className="art-roof" />
        <path d="M499 451 540 464 580 441 540 429" className="art-side" />
        <path d="M200 179V133L250 108 290 120V165" className="art-roof" />
        <path d="M200 133 240 145 290 120M240 145V190" fill="none" />
        <path
          d="M103 388 81 382M432 485 457 492M80 397 437 500"
          fill="none"
          strokeDasharray="5 5"
        />
      </g>
      <g fill="currentColor" fontFamily="monospace" fontSize="11">
        <text x="65" y="77">
          FACILITY STUDY / A—01
        </text>
        <text x="65" y="97">
          MODULAR THINKING. PRACTICAL SPACE.
        </text>
        <text x="64" y="464">
          CONCEPT ILLUSTRATION
        </text>
      </g>
      <circle cx="552" cy="100" r="32" fill="none" stroke="currentColor" />
      <path
        d="M552 120V80M542 91 552 80 562 91"
        stroke="currentColor"
        fill="none"
      />
    </svg>
  );
}
