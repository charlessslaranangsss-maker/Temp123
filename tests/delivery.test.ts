import { beforeAll, afterAll, it, expect, vi } from "vitest";
import { initializeApp, deleteApp } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import {
  processDelivery,
  type DeliveryDeps,
  type Mail,
} from "../server/delivery";
const projectId = "demo-april";
const app = initializeApp({ projectId }, "delivery-tests");
const db = getFirestore(app);
beforeAll(() => {
  if (process.env.FIRESTORE_EMULATOR_HOST !== "127.0.0.1:8080")
    throw Error("Refusing non-emulator target");
});
afterAll(() => deleteApp(app));
const mail: Mail = {
  from: "test@example.com",
  to: ["inbox@example.com"],
  subject: "Synthetic test",
  text: "No real email is sent.",
};
async function seed(id: string, age = 0) {
  const batch = db.batch();
  batch.set(db.doc(`leads/${id}`), { emailStatus: "queued" });
  batch.set(db.doc(`outbox/${id}`), {
    status: "queued",
    createdAt: Timestamp.fromMillis(Date.now() - age),
  });
  await batch.commit();
}
function deps(): DeliveryDeps {
  return {
    db,
    createMessage: () => mail,
    send: vi.fn(async () => "synthetic-provider-id"),
  };
}
it("only one concurrent worker owns and sends an outbox job", async () => {
  const id = "delivery-concurrent";
  await seed(id);
  const d = deps();
  const results = await Promise.all([
    processDelivery(id, d),
    processDelivery(id, d),
    processDelivery(id, d),
  ]);
  expect(results.filter(Boolean)).toHaveLength(1);
  expect(d.send).toHaveBeenCalledTimes(1);
  expect((await db.doc(`leads/${id}`).get()).data()?.emailStatus).toBe("sent");
}, 30000);
it("persists the original payload and reuses the provider key after an ambiguous send failure", async () => {
  const id = "delivery-retry";
  await seed(id);
  const first = deps();
  first.send = vi.fn(async () => {
    throw Error("timeout");
  });
  await expect(processDelivery(id, first)).rejects.toThrow("Delivery pending");
  expect((await db.doc(`outbox/${id}`).get()).data()?.status).toBe("queued");
  const second = deps();
  second.createMessage = () => ({ ...mail, subject: "Changed configuration" });
  expect(await processDelivery(id, second)).toBe(true);
  expect(second.send).toHaveBeenCalledWith(mail, `april/${id}`);
});
it("stops old retries before provider deduplication expires", async () => {
  const id = "delivery-expired";
  await seed(id, 23 * 3600000 + 1000);
  const d = deps();
  expect(await processDelivery(id, d)).toBe(false);
  expect(d.send).not.toHaveBeenCalled();
  expect((await db.doc(`outbox/${id}`).get()).data()?.status).toBe(
    "manual_review",
  );
});
it("does not send a job with a missing lead", async () => {
  const id = "delivery-orphan";
  await db
    .doc(`outbox/${id}`)
    .set({ status: "queued", createdAt: Timestamp.now() });
  const d = deps();
  expect(await processDelivery(id, d)).toBe(false);
  expect(d.send).not.toHaveBeenCalled();
});
it("does not clear a newer lease after an older sender fails", async () => {
  const id = "delivery-lease";
  await seed(id);
  const d = deps();
  d.send = async () => {
    await db.doc(`outbox/${id}`).update({
      leaseId: "newer-worker",
      leaseUntil: Timestamp.fromMillis(Date.now() + 60000),
    });
    throw Error("old timeout");
  };
  await expect(processDelivery(id, d)).rejects.toThrow();
  const out = (await db.doc(`outbox/${id}`).get()).data()!;
  expect(out.leaseId).toBe("newer-worker");
  expect(out.leaseUntil.toMillis()).toBeGreaterThan(Date.now());
});
