import type { VercelRequest, VercelResponse } from "../server/types";
import { submit, HttpError } from "../server/contact";
import { dependencies } from "../server/store";
import { body, headers, secure, fail } from "../server/http";
export const config = { maxDuration: 30 };
export default async function handler(req: VercelRequest, res: VercelResponse) {
  secure(res);
  try {
    if (req.method !== "POST") throw new HttpError(405, "Use POST.");
    if (process.env.CONTACT_ENABLED !== "true")
      throw new HttpError(503, "Inquiries are not enabled yet.");
    const result = await submit(
      { method: req.method, headers: headers(req), body: await body(req) },
      dependencies(),
    );
    return res.status(result.status).json(result.body);
  } catch (e) {
    return fail(res, e);
  }
}
