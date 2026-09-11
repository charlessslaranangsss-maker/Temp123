import { randomUUID } from "node:crypto";
import { Timestamp, type Firestore } from "firebase-admin/firestore";
import type { Resend } from "resend";
export type Mail = Parameters<Resend["emails"]["send"]>[0];
export type DeliveryDeps = {
  db: Firestore;
  send: (message: Mail, key: string) => Promise<string>;
  createMessage: (data: Record<string, unknown>, id: string) => Mail;
  now?: () => number;
};
/** Transaction return values survive retries; never capture a claim in mutable outer state. */
export async function processDelivery(
  id: string,
  { db, send, createMessage, now = Date.now }: DeliveryDeps,
) {
  const outbox = db.doc(`outbox/${id}`),
    leadRef = db.doc(`leads/${id}`);
  const leaseId = randomUUID();
  const message = await db.runTransaction(async (tx) => {
    const out = await tx.get(outbox);
    if (!out.exists || out.data()?.status !== "queued") return null;
    const current = out.data()!,
      time = now();
    if (current.leaseUntil?.toMillis() > time) return null;
    if (time - current.createdAt.toMillis() >= 23 * 3600000) {
      tx.update(outbox, { status: "manual_review" });
      return null;
    }
    const lead = await tx.get(leadRef);
    if (!lead.exists) {
      tx.update(outbox, { status: "manual_review" });
      return null;
    }
    const payload = (current.message ||
      createMessage(lead.data()!, id)) as Mail;
    tx.update(outbox, {
      message: payload,
      leaseId,
      leaseUntil: Timestamp.fromMillis(time + 60000),
    });
    return payload;
  });
  if (!message) return false;
  try {
    const emailId = await send(message, `april/${id}`);
    await db.runTransaction(async (tx) => {
      const current = await tx.get(outbox);
      if (current.data()?.leaseId !== leaseId) return;
      tx.update(outbox, { status: "sent", emailId });
      tx.update(leadRef, { emailStatus: "sent" });
    });
    return true;
  } catch {
    await db.runTransaction(async (tx) => {
      const current = await tx.get(outbox);
      if (
        current.data()?.leaseId === leaseId &&
        current.data()?.status === "queued"
      )
        tx.update(outbox, { leaseUntil: Timestamp.fromMillis(0) });
    });
    throw new Error("Delivery pending");
  }
}
