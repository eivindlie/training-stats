# Why this project is archived

A record of what we found while trying to revive this app, kept because it's exactly the kind of context that's expensive to reconstruct later and cheap to write down now.

## Timeline

1. **The original app** (Create React App + Firebase Hosting/Cloud Functions) stopped working. Root cause: the Firebase Functions backend read the Strava client id/secret via `functions.config()`, an API Firebase has removed, and ran on a Node 14 functions runtime Firebase no longer supports.
2. **Rewrote it as Next.js on Vercel** — cookie-based OAuth (httpOnly `sa_access_token`/`sa_refresh_token`/`sa_expires_at`), automatic token refresh via `proxy.ts`, Server Components fetching Strava directly. This is the code that now sits at the repo root (`app/`, `components/`, `lib/`, `proxy.ts`) — it builds, lints, and passes 31 tests.
3. **Hit a second, unrelated wall while testing it live**: every Strava API call failed with `403 {"message":"Forbidden","errors":[{"resource":"Application","field":"Status","code":"Inactive"}]}`. Turned out Strava now requires the owner of a "Standard Tier" API application to hold an active Strava subscription (Summit, ~$12/mo) as of 30 June 2026 — without one, the application itself is deactivated regardless of how correct the OAuth flow is. This most likely explains why the *original* app stopped working too, independent of the Firebase issues.
4. **Considered Garmin Connect** as an alternative data source, since that's where the data actually originates (a Garmin watch). Garmin's Developer Program requires applying as a registered legal entity (company, university, hospital, or research institution) — personal-use applications are explicitly rejected, with no hobbyist tier. Unofficial scraping libraries (`python-garminconnect` and similar) exist, but require storing a real Garmin password in a script, violate Garmin's terms of service, and break periodically due to Garmin's anti-scraping TLS fingerprinting (this happened as recently as March 2026).
5. **Landed on [intervals.icu](https://www.intervals.icu/)** as the realistic path forward:
   - Free personal API key (Settings → Developer Settings), no subscription gate — plus full OAuth2 with granular scopes if a multi-user app is ever wanted.
   - Automatic Garmin sync built in and free; activities appear within ~5 minutes of a watch sync.
   - Exposes real per-second streams (heart rate, watts, cadence, GPS) via `/activity/{id}/streams.json` — same underlying granularity as Garmin/Strava, since it parses the same FIT files.
   - Also already has a built-in "Activity Totals" view (count/distance/time/elevation per sport, over any period) — which may cover the original motivation for this app entirely, with zero code.
   - Caveats found: intervals.icu Ltd is UK-registered (not EU/EEA) — relevant only if that matters to you. Kayaking isn't a first-class activity type there (lands under "Other"/"Rowing"). Nordic-ski activities synced from Garmin Connect can occasionally get miscategorized as "Backcountry Ski" instead of "NordicSki".

## Decision

- This app (a Strava stats page) is retired. The Firebase project has been torn down.
- The likely next direction is an **MCP server against intervals.icu's API**, for AI-assisted training analysis, rather than another stats webpage. The OAuth patterns built here (cookie-based session handling, automatic refresh) are directly reusable for that.
- The repo is kept — archived, not deleted. `old/` holds the original CRA/Firebase implementation; the repo root holds the complete, tested Next.js/Vercel rewrite. Both are reference material only, not living code.
