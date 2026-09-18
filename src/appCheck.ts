interface PublicClientConfig {
  firebase: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    appId: string;
  };
  recaptchaEnterpriseSiteKey: string;
}

let configPromise: Promise<PublicClientConfig> | undefined;
let check: import("firebase/app-check").AppCheck | undefined;

function stringField(value: unknown, name: string) {
  if (typeof value !== "string" || !value.trim())
    throw new Error(`Missing public configuration: ${name}`);
  return value;
}

async function loadConfig(): Promise<PublicClientConfig> {
  const response = await fetch("/api/public-config.json", {
    method: "GET",
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error("Public configuration is unavailable.");
  const value: unknown = await response.json();
  if (!value || typeof value !== "object")
    throw new Error("Public configuration is invalid.");
  const candidate = value as Partial<PublicClientConfig>;
  if (!candidate.firebase || typeof candidate.firebase !== "object")
    throw new Error("Public Firebase configuration is invalid.");
  return {
    firebase: {
      apiKey: stringField(candidate.firebase.apiKey, "apiKey"),
      authDomain: stringField(candidate.firebase.authDomain, "authDomain"),
      projectId: stringField(candidate.firebase.projectId, "projectId"),
      appId: stringField(candidate.firebase.appId, "appId"),
    },
    recaptchaEnterpriseSiteKey: stringField(
      candidate.recaptchaEnterpriseSiteKey,
      "recaptchaEnterpriseSiteKey",
    ),
  };
}

export async function appCheckToken() {
  try {
    const config = await (configPromise ||= loadConfig());
    const [
      { initializeApp, getApps },
      { initializeAppCheck, ReCaptchaEnterpriseProvider, getToken },
    ] = await Promise.all([
      import("firebase/app"),
      import("firebase/app-check"),
    ]);
    const app =
      getApps().find((candidate) => candidate.name === "temporary123-public") ||
      initializeApp(config.firebase, "temporary123-public");
    check ||= initializeAppCheck(app, {
      provider: new ReCaptchaEnterpriseProvider(
        config.recaptchaEnterpriseSiteKey,
      ),
      isTokenAutoRefreshEnabled: false,
    });
    return (await getToken(check)).token;
  } catch (error) {
    const detail =
      error && typeof error === "object"
        ? {
            code: "code" in error ? String(error.code) : undefined,
            message:
              "message" in error ? String(error.message) : "Unknown error",
          }
        : { message: String(error) };
    console.error("app_check_token_failed", detail);
    configPromise = undefined;
    throw new Error(
      "We could not verify the form. Please check your connection and try again.",
    );
  }
}
