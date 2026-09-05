# Training stats

**Archived.** This project is retired — see [`INVESTIGATION.md`](./INVESTIGATION.md) for why (Strava now requires a paid subscription for API access; Garmin has no personal-use API). Kept for reference only, not maintained.

A simple app for showing the stats I care about from Strava. Built with Next.js, deployed on Vercel.

## Development

```
npm install
npm run dev
```

Requires a Strava API application ([strava.com/settings/api](https://www.strava.com/settings/api)) with its **Authorization Callback Domain** set to `localhost`, and its client id/secret in `.env.local` (see `.env.example`):

```
STRAVA_CLIENT_ID=<client id>
STRAVA_CLIENT_SECRET=<client secret>
```

Production uses a separate Strava application, registered against the production domain — Strava only allows one callback domain per app.

## Testing

```
npm test
```

## `old/`

`old/` holds the previous Create React App + Firebase implementation, kept only as a reference during the rewrite to Next.js. It is not live code — see `CLAUDE.md`.

&copy; Eivind Lie Andreassen
