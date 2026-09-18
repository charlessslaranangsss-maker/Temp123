export interface PublicClientConfig {
  firebase: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    appId: string;
  };
  recaptchaEnterpriseSiteKey: string;
}

export function publicClientConfig(
  env: NodeJS.ProcessEnv = process.env,
): PublicClientConfig {
  const projectId = requiredFrom(env, "FIREBASE_PROJECT_ID");
  return {
    firebase: {
      apiKey: requiredFrom(env, "FIREBASE_WEB_API_KEY"),
      authDomain:
        env.FIREBASE_AUTH_DOMAIN?.trim() || `${projectId}.firebaseapp.com`,
      projectId,
      appId: requiredFrom(env, "FIREBASE_APP_ID"),
    },
    recaptchaEnterpriseSiteKey: requiredFrom(
      env,
      "RECAPTCHA_ENTERPRISE_SITE_KEY",
    ),
  };
}

function requiredFrom(env: NodeJS.ProcessEnv, name: string) {
  const value = env[name]?.trim();
  if (!value) throw new Error(`Missing server setting: ${name}`);
  return value;
}
