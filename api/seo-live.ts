import type { VercelRequest, VercelResponse } from "../server/types.js";
import { createLiveSeoSnapshot } from "../server/seo-live.js";

export const config = { maxDuration: 30 };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Content-Security-Policy", "default-src 'none'; frame-ancestors 'none'");
  res.setHeader("Referrer-Policy", "no-referrer");
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Use GET." });
  }

  try {
    const snapshot = await createLiveSeoSnapshot();
    res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
    return res.status(200).json(snapshot);
  } catch {
    console.error(JSON.stringify({ event: "seo_live_snapshot_failed" }));
    res.setHeader("Cache-Control", "private, no-store");
    return res.status(503).json({
      error: "Live SEO checks are temporarily unavailable.",
    });
  }
}
