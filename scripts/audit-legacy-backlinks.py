#!/usr/bin/env python3
"""Audit a public backlink export against Vercel redirects and built HTML."""

from __future__ import annotations

import argparse
import csv
import json
import re
from collections import Counter
from pathlib import Path
from urllib.parse import urlparse


def read_export(path: Path) -> list[dict[str, str]]:
    raw = path.read_bytes()
    encoding = "utf-16" if raw.startswith((b"\xff\xfe", b"\xfe\xff")) else "utf-8-sig"
    text = raw.decode(encoding)
    delimiter = "\t" if text.partition("\n")[0].count("\t") > 1 else ","
    return list(csv.DictReader(text.splitlines(), delimiter=delimiter))


def route_pattern(source: str) -> re.Pattern[str]:
    tokens: list[str] = []

    def remember(match: re.Match[str]) -> str:
        name, star = match.group(1), match.group(2)
        tokens.append(name)
        return f"__PARAM_{len(tokens) - 1}_{'STAR' if star else 'ONE'}__"

    marked = re.sub(r":([A-Za-z][A-Za-z0-9_]*)(\*)?", remember, source)
    pattern = re.escape(marked)
    for index, _name in enumerate(tokens):
        pattern = pattern.replace(re.escape(f"__PARAM_{index}_STAR__"), f"(?P<p{index}>.*)")
        pattern = pattern.replace(re.escape(f"__PARAM_{index}_ONE__"), f"(?P<p{index}>[^/]+)")
    return re.compile(f"^{pattern}$")


def resolve_path(path: str, redirects: list[dict]) -> tuple[str, list[str]]:
    chain = [path]
    for _ in range(12):
        matched = False
        for rule in redirects:
            if rule.get("has") or rule.get("missing"):
                continue
            match = route_pattern(rule["source"]).match(path)
            if not match:
                continue
            destination = rule["destination"]
            names = re.findall(r":([A-Za-z][A-Za-z0-9_]*)(\*)?", rule["source"])
            for index, (name, star) in enumerate(names):
                destination = destination.replace(f":{name}{'*' if star else ''}", match.group(f"p{index}"))
            path = urlparse(destination).path
            chain.append(path)
            matched = True
            break
        if not matched:
            return path, chain
        if path in chain[:-1]:
            raise ValueError(f"Redirect loop: {' -> '.join(chain)}")
    raise ValueError(f"Redirect chain exceeds 12 hops: {' -> '.join(chain)}")


def apex_host_configured(
    source_host: str, source_path: str, path_hops: int, redirects: list[dict]
) -> bool:
    """Confirm www URLs cannot finish on the duplicate hostname."""
    if source_host.lower() != "www.temporary123.com":
        return True
    if path_hops:
        for rule in redirects:
            if rule.get("has") or rule.get("missing"):
                continue
            if route_pattern(rule["source"]).match(source_path):
                return urlparse(rule["destination"]).hostname == "temporary123.com"
        return False
    return any(
        rule.get("destination", "").startswith("https://temporary123.com/")
        and rule.get("source") == source_path
        and any(
            condition.get("type") == "host"
            and condition.get("value") == "www.temporary123.com"
            for condition in rule.get("has", [])
        )
        for rule in redirects
    )


def html_file(dist: Path, path: str) -> Path:
    if path == "/":
        return dist / "index.html"
    return dist / path.lstrip("/") / "index.html"


def meta_value(html: str, name: str) -> str:
    match = re.search(
        rf'<meta\s+name=["\']{re.escape(name)}["\']\s+content=["\']([^"\']*)',
        html,
        flags=re.IGNORECASE,
    )
    return match.group(1) if match else ""


def canonical_value(html: str) -> str:
    match = re.search(
        r'<link\s+rel=["\']canonical["\']\s+href=["\']([^"\']*)',
        html,
        flags=re.IGNORECASE,
    )
    return match.group(1) if match else ""


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    parser.add_argument("--repo", type=Path, default=Path.cwd())
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()

    rows = read_export(args.source)
    config = json.loads((args.repo / "vercel.json").read_text(encoding="utf-8"))
    redirects = config["redirects"]
    sitemap = (args.repo / "dist/sitemap.xml").read_text(encoding="utf-8")
    results: list[dict[str, str | int | bool]] = []

    for row in rows:
        source_url = row["Page URL"].strip()
        parsed = urlparse(source_url)
        source_path = parsed.path or "/"
        final_path, chain = resolve_path(source_path, redirects)
        page_file = html_file(args.repo / "dist", final_path)
        exists = page_file.is_file()
        html = page_file.read_text(encoding="utf-8") if exists else ""
        canonical = canonical_value(html)
        expected = f"https://temporary123.com{final_path}"
        robots = meta_value(html, "robots")
        sitemap_member = f"<loc>{expected}</loc>" in sitemap
        host_configured = apex_host_configured(
            parsed.hostname or "", source_path, len(chain) - 1, redirects
        )
        passed = (
            exists
            and robots.lower() == "index,follow"
            and canonical == expected
            and sitemap_member
            and host_configured
            and len(chain) <= 2
        )
        results.append(
            {
                "source_url": source_url,
                "source_host": parsed.hostname or "",
                "source_path": source_path,
                "historical_http_code": row.get("Page HTTP code", ""),
                "referring_domains": row.get("Referring domains", ""),
                "dofollow_links": row.get("Dofollow", ""),
                "route_kind": "redirect" if len(chain) > 1 else "direct",
                "path_redirect_hops": len(chain) - 1,
                "final_path": final_path,
                "local_html": exists,
                "robots": robots,
                "canonical": canonical,
                "sitemap_member": sitemap_member,
                "apex_host_configured": host_configured,
                "pass": passed,
            }
        )

    unique_paths = {str(row["source_path"]) for row in results}
    failed = [row for row in results if not row["pass"]]
    targets = Counter(str(row["final_path"]) for row in results)
    summary = {
        "source_rows": len(results),
        "unique_source_urls": len({str(row["source_url"]) for row in results}),
        "unique_source_paths": len(unique_paths),
        "duplicate_host_or_protocol_rows": len(results) - len(unique_paths),
        "direct_rows": sum(row["route_kind"] == "direct" for row in results),
        "redirect_rows": sum(row["route_kind"] == "redirect" for row in results),
        "unique_canonical_targets": len(targets),
        "apex_host_configured_rows": sum(
            bool(row["apex_host_configured"]) for row in results
        ),
        "passing_rows": len(results) - len(failed),
        "failing_rows": len(failed),
        "target_row_counts": dict(targets.most_common()),
    }
    args.output.mkdir(parents=True, exist_ok=True)
    with (args.output / "results.csv").open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(results[0]))
        writer.writeheader()
        writer.writerows(results)
    (args.output / "summary.json").write_text(
        json.dumps(summary, indent=2) + "\n", encoding="utf-8"
    )
    print(json.dumps(summary, indent=2))
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
