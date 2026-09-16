import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { authorityTop25 } from "../src/authorityTop25";
import { domainAuthoritySites, SeoDashboard } from "../src/SeoDashboard";

describe("owner-visible SEO dashboard evidence", () => {
  it("keeps the imported Top 25 exact and unique", () => {
    expect(authorityTop25).toHaveLength(25);
    expect(new Set(authorityTop25.map((row) => row.exactUrl)).size).toBe(25);
    expect(authorityTop25.map((row) => row.rank)).toEqual(
      Array.from({ length: 25 }, (_, index) => index + 1),
    );
    for (const row of authorityTop25) {
      expect(row.exactPath).toBe(new URL(row.exactUrl).pathname);
      expect(row.metricsEvidence).toBe("Imported");
      expect(row.newTitle).toBe("Not recorded or approved");
      expect(row.internalLinkStatus).toContain("Unknown");
    }
  });

  it("does not treat a broad preview replacement as exact restoration", () => {
    expect(
      authorityTop25.filter((row) => row.exactSlugStatus === "Preserved"),
    ).toHaveLength(1);
    expect(
      authorityTop25.filter((row) => row.restorationStatus === "Not restored"),
    ).toHaveLength(24);
  });

  it("keeps Google and domain-authority evidence explicitly unverified", () => {
    expect(
      authorityTop25.every(
        (row) =>
          row.googleIndexStatus === "Unknown" &&
          row.googleVerificationStatus === "Not connected" &&
          row.searchConsoleSubmission === "Not recorded",
      ),
    ).toBe(true);
    expect(domainAuthoritySites[0]).toMatchObject({
      metric: "DA",
      score: "32",
      scoreEvidence: "Manual",
      checkedAt: "Unknown",
      searchConsole: "Not connected",
    });
  });

  it("renders the required owner-facing registers and evidence boundary", () => {
    const html = renderToStaticMarkup(<SeoDashboard />);
    expect(html).toContain("PROTECTED URL / AUTHORITY REGISTER");
    expect(html).toContain("Priority URL indexing status");
    expect(html).toContain("PORTFOLIO / SITE-TYPE READINESS");
    expect(html).toContain(
      "read-only preview route, not an authenticated owner portal",
    );
    expect(html).toContain("Zero verified is not the same as zero indexed");
    expect(html).toContain("DO NOT MIX DA AND DR");
    expect(html).toContain("Current generated pages");
    expect(html).toContain(">651<");
    expect(html).toContain("Check Ahrefs DR");
    expect(html).toContain("Check Moz DA");
    expect(html).toContain('aria-label="Migration readiness"');
    expect(html).toContain("<progress");
    expect(html).not.toContain("style=");
    expect(html).toContain("Stored evidence loaded. Run live checks when ready.");
    expect(html).toContain(">Refresh now</button>");
    expect(html).not.toContain("disabled=\"\"");
  });

  it("prioritizes indexing and website authority in the dashboard navigation", () => {
    const html = renderToStaticMarkup(<SeoDashboard />);
    const nav = html.slice(
      html.indexOf('aria-label="Dashboard sections"'),
      html.indexOf("</nav>"),
    );

    expect(nav.indexOf('href="#indexing"')).toBeLessThan(
      nav.indexOf('href="#domain-authority"'),
    );
    expect(nav.indexOf('href="#domain-authority"')).toBeLessThan(
      nav.indexOf('href="#overview"'),
    );
    expect(html).toContain('id="indexing" class="seo-section seo-order-indexing"');
    expect(html).toContain(
      'id="domain-authority" class="seo-section seo-order-domain-authority"',
    );
  });
});
