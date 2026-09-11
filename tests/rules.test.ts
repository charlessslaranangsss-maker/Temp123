import { beforeAll, afterAll, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import {
  initializeTestEnvironment,
  assertFails,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { initializeApp, deleteApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { rateLimit, saveLead } from "../server/store";
let env: RulesTestEnvironment;
const projectId = "demo-april";
const admin = initializeApp({ projectId }, "test");
beforeAll(async () => {
  if (process.env.FIRESTORE_EMULATOR_HOST !== "127.0.0.1:8080")
    throw Error("Refusing non-emulator target");
  process.env.RATE_LIMIT_SECRET = "synthetic-emulator-secret-only-32-bytes";
  env = await initializeTestEnvironment({
    projectId,
    firestore: {
      host: "127.0.0.1",
      port: 8080,
      rules: readFileSync("firestore.rules", "utf8"),
    },
  });
  await env.clearFirestore();
});
afterAll(async () => {
  await env?.cleanup();
  await deleteApp(admin);
});
it.each(["anonymous", "owner", "other"])(
  "denies all private operations for %s",
  async (actor) => {
    const db = (
      actor === "anonymous"
        ? env.unauthenticatedContext()
        : env.authenticatedContext(actor)
    ).firestore();
    for (const path of [
      "leads/test",
      "outbox/test",
      "rateLimits/test",
      "unknown/test",
    ]) {
      await assertFails(getDoc(doc(db, path)));
      await assertFails(setDoc(doc(db, path), { role: "admin" }));
      await assertFails(deleteDoc(doc(db, path)));
      await assertFails(getDocs(collection(db, path.split("/")[0])));
    }
  },
);
it("shares atomic rate budgets across concurrent callers", async () => {
  const db = getFirestore(admin);
  const results = await Promise.allSettled(
    Array.from({ length: 10 }, () => rateLimit(db, "192.0.2.22", 900001)),
  );
  expect(results.filter((r) => r.status === "fulfilled")).toHaveLength(5);
  await expect(rateLimit(db, "192.0.2.22", 1800001)).resolves.toBeUndefined();
  await expect(rateLimit(db, "192.0.2.23", 900001)).resolves.toBeUndefined();
}, 30000);
it("deduplicates concurrent stored inquiries and rejects changed payload", async () => {
  const db = getFirestore(admin);
  const lead = {
    name: "Test User",
    email: "test@example.com",
    phone: "",
    location: "Test",
    service: "mobile-kitchens" as const,
    message: "Synthetic inquiry content only.",
    consent: true as const,
    website: "",
    page: "/contact/" as const,
  };
  const ids = await Promise.all([
    saveLead(db, "test-key", lead),
    saveLead(db, "test-key", lead),
  ]);
  expect(ids[0]).toBe(ids[1]);
  const docs = await db
    .collection("leads")
    .where("email", "==", lead.email)
    .get();
  expect(docs.size).toBe(1);
  await expect(
    saveLead(db, "test-key", { ...lead, name: "Changed" }),
  ).rejects.toMatchObject({ status: 409 });
});
