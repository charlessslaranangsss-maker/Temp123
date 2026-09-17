import type { VercelRequest, VercelResponse } from "../server/types.js";
import { readLatestDiagnostics, runDiagnostics } from "../server/seo-diagnostics.js";

export const config = { maxDuration: 300 };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Cache-Control", "private, no-store");
  if (req.method !== "GET") return res.status(405).json({ error: "Use GET." });
  const url = new URL(req.url || "/api/seo-diagnostics", "https://temporary123.com");
  if (url.searchParams.get("run") === "1") {
    const secret = process.env.CRON_SECRET;
    if (!secret || req.headers.authorization !== `Bearer ${secret}`) return res.status(401).json({ error: "Scheduled diagnostics authorization failed." });
    try { return res.status(200).json(await runDiagnostics()); }
    catch { return res.status(503).json({ error: "Diagnostics run failed." }); }
  }
  const latest = await readLatestDiagnostics();
  // This dashboard is public. Do not expose internal document IDs, failed URLs,
  // provider errors, collection names, or database paths from the stored run.
  const publicLatest = latest ? {
    generatedAt: latest.generatedAt,
    frequencyHours: latest.frequencyHours,
    origin: latest.origin,
    locationHealth: { ...latest.locationHealth, samples: [] },
    contentCompleteness: { ...latest.contentCompleteness, source: "Configured content database", error: undefined },
    firestoreHealth: { ...latest.firestoreHealth, collection: "cities", samples: [], error: undefined },
    hosting404s: { ...latest.hosting404s, urls: [], error: undefined },
    googleIndexing: { ...latest.googleIndexing, error: undefined },
  } : null;
  return res.status(200).json({ latest: publicLatest, schedule: "Every 12 hours", configured: Boolean(process.env.CRON_SECRET) });
}
