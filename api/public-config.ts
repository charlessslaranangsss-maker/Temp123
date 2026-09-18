import type { VercelRequest, VercelResponse } from "../server/types.js";
import { secure } from "../server/http.js";
import { publicClientConfig } from "../server/publicConfig.js";

export default function handler(req: VercelRequest, res: VercelResponse) {
  secure(res);
  res.setHeader("Allow", "GET, HEAD");
  if (req.method !== "GET" && req.method !== "HEAD")
    return res.status(405).json({ error: "Use GET." });

  try {
    const config = publicClientConfig();
    if (req.method === "HEAD") return res.status(204).end();
    return res.status(200).json(config);
  } catch {
    console.error(JSON.stringify({ event: "public_config_unavailable" }));
    return res.status(503).json({
      error: "Online inquiries are temporarily unavailable.",
    });
  }
}
