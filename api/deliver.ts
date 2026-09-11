import { timingSafeEqual } from "node:crypto";
import type { VercelRequest, VercelResponse } from "../server/types";
import { firebase, requiredSecret } from "../server/firebase";
import { deliverLead } from "../server/store";
import { HttpError } from "../server/contact";
import { secure, fail } from "../server/http";
export const config = { maxDuration: 60 };
export default async function handler(req: VercelRequest, res: VercelResponse) {
  secure(res);
  try {
    if (req.method !== "POST") throw new HttpError(405, "Use POST.");
    const expected = Buffer.from(`Bearer ${requiredSecret("CRON_SECRET")}`);
    const auth = req.headers.authorization;
    const received = Buffer.from(typeof auth === "string" ? auth : "");
    if (
      received.length !== expected.length ||
      !timingSafeEqual(received, expected)
    )
      throw new HttpError(401, "Unauthorized.");
    const { db } = firebase();
    const docs = await db
      .collection("outbox")
      .where("status", "==", "queued")
      .limit(5)
      .get();
    let delivered = 0;
    for (const doc of docs.docs) if (await deliverLead(doc.id)) delivered++;
    return res.status(200).json({ examined: docs.size, delivered });
  } catch (e) {
    return fail(res, e);
  }
}
