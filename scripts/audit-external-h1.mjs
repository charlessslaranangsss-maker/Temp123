import * as cheerio from "cheerio";

const urls = process.argv.slice(2);

const inspect = async (requestedUrl) => {
  try {
    const response = await fetch(requestedUrl, {
      redirect: "follow",
      signal: AbortSignal.timeout(20_000),
      headers: { "user-agent": "Temporary123 audit/1.0" },
    });
    const html = await response.text();
    const $ = cheerio.load(html);

    return {
      requestedUrl,
      finalUrl: response.url,
      status: response.status,
      h1Count: $("h1").length,
      h1s: $("h1")
        .map((_, element) => $(element).text().replace(/\s+/g, " ").trim())
        .get()
        .filter(Boolean),
      canonical: $('link[rel="canonical"]').attr("href") ?? "",
      metaRobots: $('meta[name="robots"]').attr("content") ?? "",
      xRobotsTag: response.headers.get("x-robots-tag") ?? "",
    };
  } catch (error) {
    return {
      requestedUrl,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

const results = await Promise.all(urls.map(inspect));
process.stdout.write(`${JSON.stringify(results, null, 2)}\n`);
