import { createHmac } from "node:crypto";
import { Timestamp, type Firestore } from "firebase-admin/firestore";
import { Resend } from "resend";
import { firebase, required, requiredSecret } from "./firebase";
import { processDelivery } from "./delivery";
import site from "../site.json";
import { HttpError } from "./contact";
import type { Lead } from "./schema";
export const digest = (text: string) =>
  createHmac("sha256", requiredSecret("RATE_LIMIT_SECRET"))
    .update(text)
    .digest("hex");
export async function rateLimit(db: Firestore, ip: string, now = Date.now()) {
  const window = Math.floor(now / 900000);
  const refs = [
    db.doc(`rateLimits/${digest(ip)}-${window}`),
    db.doc(`rateLimits/global-${window}`),
  ];
  try {
    await db.runTransaction(async (tx) => {
      const snapshots = await tx.getAll(...refs);
      const caps = [5, 100];
      snapshots.forEach((s, i) => {
        if ((s.data()?.count || 0) >= caps[i])
          throw new HttpError(
            429,
            "Too many inquiries. Please try again later.",
            Math.ceil(((window + 1) * 900000 - now) / 1000),
          );
      });
      snapshots.forEach((s, i) =>
        tx.set(refs[i], {
          count: (s.data()?.count || 0) + 1,
          expiresAt: Timestamp.fromMillis(now + 86400000),
        }),
      );
    });
  } catch (e) {
    if (e instanceof HttpError) throw e;
    throw new HttpError(
      503,
      "Inquiries are temporarily unavailable. Please retry later.",
    );
  }
}
export async function saveLead(db: Firestore, key: string, data: Lead) {
  const id = digest(`inquiry:${key}`),
    ref = db.doc(`leads/${id}`),
    payloadHash = digest(JSON.stringify(data));
  await db.runTransaction(async (tx) => {
    const existing = await tx.get(ref);
    if (existing.exists) {
      if (existing.data()?.payloadHash !== payloadHash)
        throw new HttpError(
          409,
          "This request identifier was already used. Refresh the form.",
        );
      return;
    }
    const now = Timestamp.now();
    tx.create(ref, {
      ...data,
      payloadHash,
      createdAt: now,
      expiresAt: Timestamp.fromMillis(now.toMillis() + 90 * 86400000),
      emailStatus: "queued",
    });
    tx.create(db.doc(`outbox/${id}`), {
      leadId: id,
      status: "queued",
      createdAt: now,
      expiresAt: Timestamp.fromMillis(now.toMillis() + 90 * 86400000),
    });
  });
  return id;
}
export async function deliverLead(id: string) {
  const { db } = firebase();
  return processDelivery(id, {
    db,
    createMessage: (data, id) => ({
      from: required("RESEND_FROM"),
      to: [required("LEADS_TO_EMAIL")],
      replyTo: String(data.email),
      subject: `${site.brand} project inquiry`,
      text: [
        `New ${site.brand} project inquiry`,
        `Reference: ${id}`,
        `Name: ${data.name}`,
        `Email: ${data.email}`,
        `Phone: ${data.phone || "Not provided"}`,
        `Location: ${data.location}`,
        `Service: ${data.service}`,
        "",
        String(data.message),
      ].join("\n"),
    }),
    send: async (message, key) => {
      const result = await new Resend(required("RESEND_API_KEY")).emails.send(
        message,
        { idempotencyKey: key },
      );
      if (result.error || !result.data) throw new Error("Provider send failed");
      return result.data.id;
    },
  });
}
export function dependencies() {
  const { db, appCheck } = firebase();
  return {
    enabled: process.env.CONTACT_ENABLED === "true",
    origins: required("ALLOWED_ORIGINS")
      .split(",")
      .map((v) => v.trim()),
    verify: async (token: string) => {
      const verified = await appCheck.verifyToken(token);
      if (verified.appId !== required("FIREBASE_APP_ID"))
        throw new Error("Wrong application");
    },
    limit: (ip: string) => rateLimit(db, ip),
    save: (key: string, data: Lead) => saveLead(db, key, data),
    deliver: async (id: string) => {
      await deliverLead(id);
    },
  };
}
