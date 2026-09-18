import { describe, expect, it } from "vitest";
import { publicClientConfig } from "../server/publicConfig";

describe("public client configuration", () => {
  it("returns only browser-safe Firebase and App Check values", () => {
    const config = publicClientConfig({
      FIREBASE_WEB_API_KEY: "public-web-key",
      FIREBASE_PROJECT_ID: "temporary-test",
      FIREBASE_APP_ID: "1:test:web:test",
      RECAPTCHA_ENTERPRISE_SITE_KEY: "public-site-key",
      FIREBASE_PRIVATE_KEY: "must-not-leak",
      RESEND_API_KEY: "must-not-leak",
    });
    expect(config).toEqual({
      firebase: {
        apiKey: "public-web-key",
        authDomain: "temporary-test.firebaseapp.com",
        projectId: "temporary-test",
        appId: "1:test:web:test",
      },
      recaptchaEnterpriseSiteKey: "public-site-key",
    });
    expect(JSON.stringify(config)).not.toContain("must-not-leak");
  });

  it.each([
    "FIREBASE_WEB_API_KEY",
    "FIREBASE_PROJECT_ID",
    "FIREBASE_APP_ID",
    "RECAPTCHA_ENTERPRISE_SITE_KEY",
  ])("rejects a missing %s", (name) => {
    const env: NodeJS.ProcessEnv = {
      FIREBASE_WEB_API_KEY: "public-web-key",
      FIREBASE_PROJECT_ID: "temporary-test",
      FIREBASE_APP_ID: "1:test:web:test",
      RECAPTCHA_ENTERPRISE_SITE_KEY: "public-site-key",
    };
    delete env[name];
    expect(() => publicClientConfig(env)).toThrow(
      `Missing server setting: ${name}`,
    );
  });
});
