import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";
import { getAppCheck } from "firebase-admin/app-check";
import { getFirestore } from "firebase-admin/firestore";
export function required(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing server setting: ${name}`);
  return v;
}
export function requiredSecret(name: string) {
  const value = required(name);
  if (Buffer.byteLength(value) < 32)
    throw new Error(`Server setting ${name} must contain at least 32 bytes`);
  return value;
}
function firebasePrivateKey() {
  const encoded = process.env.FIREBASE_PRIVATE_KEY_BASE64?.trim();
  if (encoded) {
    const decoded = Buffer.from(encoded, "base64").toString("utf8");
    if (
      !decoded.includes("-----BEGIN PRIVATE KEY-----") ||
      !decoded.includes("-----END PRIVATE KEY-----")
    )
      throw new Error("FIREBASE_PRIVATE_KEY_BASE64 is not a complete PEM key.");
    return decoded;
  }
  const value = required("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n");
  if (
    !value.includes("-----BEGIN PRIVATE KEY-----") ||
    !value.includes("-----END PRIVATE KEY-----")
  )
    throw new Error("FIREBASE_PRIVATE_KEY is not a complete PEM key.");
  return value;
}
export function firebase() {
  if (
    process.env.FIREBASE_DATABASE_EMULATOR_HOST ||
    process.env.FIRESTORE_EMULATOR_HOST ||
    process.env.FIREBASE_AUTH_EMULATOR_HOST
  )
    throw new Error("Deployed backend refuses emulator configuration.");
  const app =
    getApps().find((app) => app.name === "temporary123-server") ||
    initializeApp(
      {
        databaseURL: required("FIREBASE_DATABASE_URL"),
        credential: cert({
          projectId: required("FIREBASE_PROJECT_ID"),
          clientEmail: required("FIREBASE_CLIENT_EMAIL"),
          privateKey: firebasePrivateKey(),
        }),
      },
      "temporary123-server",
    );
  return {
    db: getDatabase(app),
    firestore: getFirestore(app),
    appCheck: getAppCheck(app),
  };
}
