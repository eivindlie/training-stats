# training-stats

**This project is archived — see [`INVESTIGATION.md`](./INVESTIGATION.md).** Strava now requires a paid subscription for API access and Garmin has no personal-use API path, so this app is retired rather than fixed. The rest of this file is kept as-is for historical accuracy; don't pick this project back up or continue the rewrite described below without checking `INVESTIGATION.md` first.

A small personal app showing stats the owner cares about from Strava. Being rewritten from Create React App + Firebase (Hosting + Cloud Functions) to Next.js on Vercel — the Firebase backend is dead (it depends on `functions.config()`, an API Firebase has removed, and on a Node 14 functions runtime Firebase no longer supports).

## `old/`

`old/` holds the previous CRA/Firebase implementation, kept only as a reference while the rewrite is in progress — the stat calculations, auth flow, and styling it contains are correct and worth diffing against. It is **not live code**: don't run it, don't fix bugs in it, don't add tests to it. Delete the whole directory once the Next.js app under the repo root reproduces its behavior and the migration is verified end-to-end.

## Priorities for the new code

- **Simple.** This is a small personal app, not a product. Don't add a state management library, a database, a session store, or config for scale it will never see. Prefer the platform default (Next.js Server Components, plain `fetch`, file-system routing) over pulling in a library.
- **Readable.** Explicit over clever. Small, single-purpose functions. Use the domain vocabulary Strava's API already establishes (`IActivity`, `IAthlete`, etc.) rather than inventing new names for the same concepts.
- **Maintainable.** Keep `lib/strava/*` framework-agnostic (no Next.js-specific imports beyond `cookies()`/`headers()`) so its logic reads and tests in isolation from routing/rendering concerns.
- **Well-tested.** Tests live next to the source they cover (`foo.ts` + `foo.test.ts`). Prioritize coverage on the logic most likely to break silently: token refresh/expiry handling in `lib/strava/auth.ts`, the OAuth route handlers, and the activity-stat calculations — these are exactly the places where a bug wouldn't show up until a real Strava session hits it.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
