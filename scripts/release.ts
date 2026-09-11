import site from "../site.json" with { type: "json" };
import { readFileSync } from "node:fs";
export function releaseErrors() {
  const errors: string[] = [];
  const status = JSON.parse(
    readFileSync(
      new URL("../content/migration-status.json", import.meta.url),
      "utf8",
    ),
  );
  if (!status.complete)
    errors.push(
      `Source migration incomplete: ${status.recovered} of ${status.expected} pages recovered`,
    );
  try {
    const url = new URL(site.origin);
    if (
      url.protocol !== "https:" ||
      url.pathname !== "/" ||
      url.search ||
      url.hash ||
      url.username ||
      url.password ||
      url.hostname.endsWith(".invalid") ||
      url.hostname.includes("localhost")
    )
      errors.push("origin must be a real HTTPS origin");
  } catch {
    errors.push("production origin missing");
  }
  if (!/^\+[1-9]\d{7,14}$/.test(site.phoneE164) || !site.phoneDisplay)
    errors.push("approved phone missing");
  const migration = JSON.parse(
    readFileSync(
      new URL("../audit/backlink-reconciliation.json", import.meta.url),
      "utf8",
    ),
  );
  if (
    migration.some(
      (row: { migrationStatus: string }) =>
        row.migrationStatus === "needs_source_recovery",
    )
  )
    errors.push("Backlink target recovery is incomplete");
  try {
    const evidence = JSON.parse(
      readFileSync(
        new URL("../security/security-evidence.json", import.meta.url),
        "utf8",
      ),
    );
    if (
      site.inquiriesEnabled &&
      evidence.controls.some(
        (c: { status: string }) =>
          !["pass", "not_applicable"].includes(c.status),
      )
    )
      errors.push("security evidence contains unresolved release controls");
  } catch {
    errors.push("complete security evidence is required");
  }
  return errors;
}
if (process.argv[1]?.endsWith("release.ts")) {
  const errors = releaseErrors();
  if (errors.length) {
    console.error(
      "Release blocked:\n" + errors.map((e) => `- ${e}`).join("\n"),
    );
    process.exitCode = 1;
  } else
    console.log(
      "Editorial configuration checks passed. Complete staging security/deployment evidence before release.",
    );
}
