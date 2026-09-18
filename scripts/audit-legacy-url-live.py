"""Verify the legacy backlink migration against the live Temporary123 site."""

from __future__ import annotations

import csv
import json
import re
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from urllib.parse import urlparse

import requests

ROOT = Path(__file__).resolve().parents[1]
AUDIT = ROOT / "audit" / "legacy-url-restoration-2026-09-18"
BASE = "https://temporary123.com"
TIMEOUT = 30


def fetch(url: str) -> requests.Response:
    return requests.get(
        url,
        timeout=TIMEOUT,
        allow_redirects=True,
        headers={"User-Agent": "Temporary123-Legacy-URL-QA/1.0"},
    )


def meta_content(html: str, name: str) -> str:
    match = re.search(
        rf'<meta\s+[^>]*name=["\']{re.escape(name)}["\'][^>]*>', html, re.I
    )
    if not match:
        return ""
    content = re.search(r'content=["\']([^"\']*)["\']', match.group(0), re.I)
    return content.group(1) if content else ""


def canonical_href(html: str) -> str:
    for tag in re.findall(r"<link\s+[^>]*>", html, re.I):
        if re.search(r'rel=["\'][^"\']*canonical[^"\']*["\']', tag, re.I):
            href = re.search(r'href=["\']([^"\']+)["\']', tag, re.I)
            return href.group(1) if href else ""
    return ""


with (AUDIT / "migration-map.csv").open(encoding="utf-8-sig", newline="") as handle:
    rows = list(csv.DictReader(handle))

records = json.loads(
    (ROOT / "content" / "legacy-authority-pages.json").read_text(encoding="utf-8")
)["pages"]
unique_paths = sorted({row["source_path"] for row in rows})
html_paths = {path for path in unique_paths if not Path(path).suffix}
asset_paths = set(unique_paths) - html_paths

sitemap_response = fetch(f"{BASE}/sitemap.xml")
sitemap = sitemap_response.text
errors: list[str] = []
if sitemap_response.status_code != 200:
    errors.append(f"sitemap status {sitemap_response.status_code}")


def check_row(index_and_row: tuple[int, dict[str, str]]) -> dict[str, object]:
    index, row = index_and_row
    source_url = row["source_url"]
    expected_path = row["source_path"]
    result: dict[str, object] = {
        "row": index + 1,
        "source_url": source_url,
        "source_path": expected_path,
        "release_state": row["release_state"],
    }
    try:
        response = fetch(source_url)
        history = [
            {"status": item.status_code, "url": item.url, "location": item.headers.get("location", "")}
            for item in response.history
        ]
        final = urlparse(response.url)
        result.update(
            {
                "status": response.status_code,
                "final_url": response.url,
                "redirect_count": len(history),
                "redirect_chain": history,
            }
        )
        if row["decision"] == "redirect_asset":
            expected = f"{BASE}/food-services-2/"
            ok = response.status_code == 200 and response.url == expected and bool(history)
            result.update({"expected_final": expected, "passed": ok})
            if not ok:
                result["error"] = "historical asset did not redirect to /food-services-2/"
            return result

        expected = f"{BASE}{expected_path}"
        robots = meta_content(response.text, "robots")
        canonical = canonical_href(response.text)
        in_sitemap = f"<loc>{expected}</loc>" in sitemap
        release = row["release_state"]
        metadata_ok = (
            robots == "index,follow" and canonical == expected and in_sitemap
            if release == "index"
            else robots == "noindex,follow" and not canonical and not in_sitemap
        )
        exact_ok = (
            response.status_code == 200
            and final.scheme == "https"
            and final.netloc == "temporary123.com"
            and final.path == expected_path
        )
        result.update(
            {
                "robots": robots,
                "canonical": canonical,
                "in_sitemap": in_sitemap,
                "exact_path_passed": exact_ok,
                "metadata_passed": metadata_ok,
                "passed": exact_ok and metadata_ok,
            }
        )
        if not exact_ok:
            result["error"] = "source URL did not finish at the exact HTTPS apex path with HTTP 200"
        elif not metadata_ok:
            result["error"] = "robots, canonical, or sitemap state differs from the release policy"
        return result
    except Exception as exc:  # live audit must retain the exact failed row
        result.update({"passed": False, "error": f"{type(exc).__name__}: {exc}"})
        return result


row_results: list[dict[str, object]] = []
with ThreadPoolExecutor(max_workers=8) as pool:
    futures = [pool.submit(check_row, item) for item in enumerate(rows)]
    for future in as_completed(futures):
        row_results.append(future.result())
row_results.sort(key=lambda item: int(item["row"]))

for result in row_results:
    if not result["passed"]:
        errors.append(f'row {result["row"]}: {result.get("error", "failed")}')


def check_parent(record: dict[str, object]) -> dict[str, object]:
    parent_path = str(record["parentPath"])
    child_path = str(record["path"])
    try:
        response = fetch(f"{BASE}{parent_path}")
        linked = bool(
            re.search(
                rf'href=["\']{re.escape(child_path)}["\']', response.text, re.I
            )
        )
        return {
            "parent_path": parent_path,
            "child_path": child_path,
            "status": response.status_code,
            "linked": linked,
            "passed": response.status_code == 200 and linked,
        }
    except Exception as exc:
        return {
            "parent_path": parent_path,
            "child_path": child_path,
            "passed": False,
            "error": f"{type(exc).__name__}: {exc}",
        }


parent_results: list[dict[str, object]] = []
with ThreadPoolExecutor(max_workers=8) as pool:
    futures = [pool.submit(check_parent, record) for record in records]
    for future in as_completed(futures):
        parent_results.append(future.result())
parent_results.sort(key=lambda item: (str(item["parent_path"]), str(item["child_path"])))

for result in parent_results:
    if not result["passed"]:
        errors.append(
            f'parent {result["parent_path"]} missing live link to {result["child_path"]}'
        )

unique_html_results = {
    str(result["source_path"]): result
    for result in row_results
    if str(result["source_path"]) in html_paths
}
pilot = [result for result in unique_html_results.values() if result["release_state"] == "index"]
staged = [result for result in unique_html_results.values() if result["release_state"] == "staged_noindex"]

summary = {
    "baseUrl": BASE,
    "sourceRows": len(rows),
    "sourceRowsPassed": sum(bool(result["passed"]) for result in row_results),
    "uniquePaths": len(unique_paths),
    "preservedHtmlUniquePaths": len(html_paths),
    "preservedHtmlUniquePathsPassed": sum(bool(result["passed"]) for result in unique_html_results.values()),
    "pilotIndexablePaths": len(pilot),
    "pilotIndexablePathsPassed": sum(bool(result["passed"]) for result in pilot),
    "stagedNoindexHtmlPaths": len(staged),
    "stagedNoindexHtmlPathsPassed": sum(bool(result["passed"]) for result in staged),
    "assetRedirectUniquePaths": len(asset_paths),
    "assetRedirectRowsPassed": sum(
        bool(result["passed"])
        for result in row_results
        if str(result["source_path"]) in asset_paths
    ),
    "parentLinks": len(parent_results),
    "parentLinksPassed": sum(bool(result["passed"]) for result in parent_results),
    "sitemapStatus": sitemap_response.status_code,
    "errors": errors,
}

(AUDIT / "live-results.json").write_text(
    json.dumps({"summary": summary, "rows": row_results, "parentLinks": parent_results}, indent=2) + "\n",
    encoding="utf-8",
)
(AUDIT / "live-verification.json").write_text(
    json.dumps(summary, indent=2) + "\n", encoding="utf-8"
)

with (AUDIT / "live-results.csv").open("w", encoding="utf-8", newline="") as handle:
    fieldnames = [
        "row",
        "source_url",
        "source_path",
        "release_state",
        "status",
        "final_url",
        "redirect_count",
        "robots",
        "canonical",
        "in_sitemap",
        "exact_path_passed",
        "metadata_passed",
        "passed",
        "error",
    ]
    writer = csv.DictWriter(handle, fieldnames=fieldnames, extrasaction="ignore")
    writer.writeheader()
    writer.writerows(row_results)

print(json.dumps(summary, indent=2))
raise SystemExit(1 if errors else 0)
