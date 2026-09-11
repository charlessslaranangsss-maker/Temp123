# April temporary facilities — Temp123

Reviewed React/TypeScript/Vite site with 11 statically rendered pages, accessible interactions, Firebase-backed inquiry handlers and a retry-safe delivery queue.

**Status:** code pushed and locally verified. Vercel project creation and Firestore database creation are blocked by account permissions. Live inquiries and search indexing remain disabled.

Read [the review and handoff](docs/REVIEW-AND-HANDOFF.md) for the changes, tests, backlink decisions and precise remaining work. Earlier audit files are historical source material; current verification is under `security/`.

## Run with Node 24

```sh
npm ci
npm run build
npm run preview
```

Open http://localhost:4173. The static preview does not execute live APIs.

## Verify

```sh
npm test
npm run test:rules
npx playwright install chromium
npm run test:e2e
npm run check:secrets
npm run check:release
npm run check:security
```

Rules tests require Java 21 and use `demo-april` only. Release/security checks intentionally reject the incomplete live configuration. Normal CI tests build, APIs, rules, browser behavior, dependencies and secrets.

Firebase target: `temporary-123-87345`. Vercel team: `temporary-124` (display name Temporary 123). The public brand remains April as supplied; `site.json` owns the main identity settings. See `.env.example` for variable names; never commit real credentials. Original uploaded prompts/workbooks remain local and are excluded from the public repository.
