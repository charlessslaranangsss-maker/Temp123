# Temporary123 Collaboration Rules

These rules apply to every Codex task and developer working in this repository.

## Before starting work

1. Read `PROJECT_STATUS.md`.
2. Read `docs/BOSS_REQUIREMENTS.md` for approved business and SEO requirements.
3. Check `docs/PAGE_ASSIGNMENTS.md` before editing a page or shared component.
4. Run `git status --short` and treat every existing change as another person's work unless ownership is documented.
5. Add or update your assignment in `docs/PAGE_ASSIGNMENTS.md` before making material changes.

## While working

- Do not overwrite, discard, reset, or reformat unrelated changes.
- Do not edit a file marked as actively owned by another task without coordinating first.
- Keep valuable existing URLs and slugs unchanged unless an approved redirect plan exists.
- Keep location content specific to the equipment, facility type, rental intent, and real local deployment context.
- Use commercial and institutional imagery only: prisons, hospitals, nursing homes, man camps, hotels/hospitality sites, military sites, and industrial facilities. Do not use residential or small-business settings.
- Use keyword-relevant, truthful image alt text. Do not keyword-stuff.
- Do not publish thousands of pages at once. Follow the controlled SEO rollout recorded in `docs/BOSS_REQUIREMENTS.md`.
- Never claim a deployment, fix, indexing result, or test passed without direct evidence.

## Before finishing a task

1. Test the affected behavior at the appropriate level.
2. Update `PROJECT_STATUS.md` with what changed, test evidence, deployment state, and remaining work.
3. Update your row in `docs/PAGE_ASSIGNMENTS.md`.
4. Append detailed verification to `docs/TEST_RESULTS.md` when the work changes production behavior, routing, forms, SEO output, or deployment.
5. Record durable decisions in `docs/DECISIONS.md`.
6. Report any unverified boundary explicitly.

## Shared-file caution

The following files affect many pages and require coordination before editing:

- `src/Home.tsx`
- `src/Site.tsx`
- `src/content.ts`
- `src/cityEditorial.ts`
- `src/main.tsx`
- `scripts/prerender.tsx`
- `vercel.json`
- `package.json`

Separate Codex chats do not share conversation history. The files above and the coordination documents in this repository are the shared source of truth.
