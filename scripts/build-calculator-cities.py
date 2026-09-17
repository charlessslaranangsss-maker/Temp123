"""Build the calculator's state/city choices from the supplied city CSV.

Usage: python scripts/build-calculator-cities.py <source.csv>
"""

import csv
import json
import sys
from pathlib import Path


def main() -> None:
    source = Path(sys.argv[1])
    by_state: dict[str, dict[str, str]] = {}
    with source.open(encoding="utf-8-sig", newline="") as stream:
        for row in csv.DictReader(stream):
            state = row["region_name"].strip()
            city = row["city_name"].strip()
            if state and city:
                by_state.setdefault(state, {}).setdefault(city.casefold(), city)

    result = {
        state: sorted(cities.values(), key=str.casefold)
        for state, cities in sorted(by_state.items())
    }
    target = Path(__file__).resolve().parents[1] / "src" / "calculatorCities.json"
    target.write_text(json.dumps(result, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
    print(f"{len(result)} states, {sum(map(len, result.values()))} unique state-city pairs -> {target}")


if __name__ == "__main__":
    main()
