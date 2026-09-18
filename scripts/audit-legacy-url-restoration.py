"""Verify the backlink migration map against the generated production build."""

from __future__ import annotations

import csv
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
AUDIT = ROOT / "audit" / "legacy-url-restoration-2026-09-18"


def html_file(path: str) -> Path:
    return ROOT / "dist" / (path.strip("/") or ".") / "index.html"


with (AUDIT / "migration-map.csv").open(encoding="utf-8-sig", newline="") as handle:
    rows = list(csv.DictReader(handle))

records = json.loads((ROOT / "content" / "legacy-authority-pages.json").read_text(encoding="utf-8"))["pages"]
registry = json.loads((ROOT / "audit" / "build-registry.json").read_text(encoding="utf-8"))
sitemap = (ROOT / "dist" / "sitemap.xml").read_text(encoding="utf-8")
policy = (ROOT / "scripts" / "seo-policy.ts").read_text(encoding="utf-8")
release_block = policy.split("export const authorityReleaseRoutes = [", 1)[1].split("] as const", 1)[0]
pilot = set(re.findall(r'^\s*"([^"]+)",\s*$', release_block, re.MULTILINE))

unique_paths = sorted({row["source_path"] for row in rows})
html_paths = [path for path in unique_paths if not Path(path).suffix]
asset_paths = [path for path in unique_paths if Path(path).suffix]
restored_paths = {record["path"] for record in records}
errors: list[str] = []

for path in html_paths:
    file = html_file(path)
    if not file.exists():
        errors.append(f"missing HTML {path}")
        continue
    html = file.read_text(encoding="utf-8")
    canonical = f'<link rel="canonical" href="https://temporary123.com{path}">'
    if path in pilot:
        if canonical not in html:
            errors.append(f"missing self canonical {path}")
        if not re.search(r'<meta name="robots" content="index,follow"\s*/?>', html):
            errors.append(f"bad pilot robots {path}")
        if f"<loc>https://temporary123.com{path}</loc>" not in sitemap:
            errors.append(f"pilot absent from sitemap {path}")
    else:
        if canonical in html:
            errors.append(f"staged canonical {path}")
        if not re.search(r'<meta name="robots" content="noindex,follow"\s*/?>', html):
            errors.append(f"bad staged robots {path}")
        if f"<loc>https://temporary123.com{path}</loc>" in sitemap:
            errors.append(f"staged path in sitemap {path}")

for record in records:
    parent = html_file(record["parentPath"])
    if not parent.exists():
        errors.append(f'missing parent HTML {record["parentPath"]}')
        continue
    parent_html = parent.read_text(encoding="utf-8")
    if f'href="{record["path"]}"' not in parent_html:
        errors.append(f'missing parent link {record["path"]}')

result = {
    "sourceRows": len(rows),
    "uniquePaths": len(unique_paths),
    "preservedHtmlUniquePaths": len(html_paths),
    "assetRedirectUniquePaths": len(asset_paths),
    "newlyRestoredHtmlPaths": len(restored_paths),
    "pilotIndexablePaths": len(set(html_paths) & pilot),
    "stagedNoindexHtmlPaths": len(set(html_paths) - pilot),
    "generatedRoutes": len(registry["pages"]),
    "errors": errors,
}
(AUDIT / "build-verification.json").write_text(
    json.dumps(result, indent=2) + "\n", encoding="utf-8"
)
print(json.dumps(result, indent=2))
raise SystemExit(1 if errors else 0)
