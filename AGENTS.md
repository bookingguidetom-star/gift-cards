# Setup notes for AI agents / developers

## What this repo runs on

Vite + React + TypeScript single-page app (hash router) that reads and writes its
catalog through **Supabase's PostgREST data API** via `@supabase/supabase-js`.
It uses no Supabase Auth, Storage or Edge Functions, and it calls no paid API:
`WeatherForecast` fetches Open-Meteo directly from the browser, no key required.
There are **no external credentials** to configure.

## Sandbox stack (`docker-compose.base44.yml`)

- `db` — `postgres:16-alpine`, data in the `db-data` volume.
- `migrate` — one-shot `postgres:16-alpine` job running `docker/apply-migrations.sh`,
  which creates the Supabase roles (`anon`, `authenticated`, `service_role`,
  `authenticator`), then applies `supabase/migrations/*` in filename order inside
  a transaction each, recording filenames in `public._base44_migrations`. Restarting
  the stack only applies new files, so keep that ledger table intact.
- `api` — PostgREST 12 (`docker/postgrest/Dockerfile`), anon role `anon`, listening on 3000
  inside the network and published on host port 8000 for direct inspection.
  It uses the public Supabase *local-development* JWT pair (`iss: supabase-demo`)
  — dev-only values, not real credentials.
- `web` — `node:22-bookworm-slim`, repo bind-mounted at `/app`, `npm ci` on startup into
  the `web-node-modules` volume, then `vite --host 0.0.0.0`. Host port 3000.

### The `/rest/v1` proxy is the non-obvious part

`@supabase/supabase-js` always requests `<url>/rest/v1/<table>`, while PostgREST serves
tables at `/<table>` with no path prefix. In the sandbox, `vite.config.ts` enables a dev
proxy that rewrites `/rest/v1` → `http://api:3000` **only when `BASE44_PREVIEW_MODE === "1"`**.
That keeps the browser on a single origin (no CORS, and `VITE_SUPABASE_URL` is simply the
preview origin). With the flag unset — normal local dev or a real deployment — the proxy is
absent and `VITE_SUPABASE_URL` must point at a real Supabase project.

`docker/postgrest/Dockerfile` wraps the distroless PostgREST binary in Alpine purely so
Compose has a shell (`wget`) for the healthcheck.

### Seed migrations were repaired

Migrations `20261027145457`–`20261028071000` (hotels, taxi services) hardcoded city UUIDs
from the author's original database, and `20261030050000` selected a non-existent
`v.image_url`. Neither could apply to a fresh database. The UUID literals now resolve via
`(SELECT id FROM cities WHERE slug = '…')`, and the coastal activity seed uses the city's
image (`c.image_url`). Do not reintroduce hardcoded city ids.

## Verifying it works

```bash
docker compose -f docker-compose.base44.yml up -d --build
docker compose -f docker-compose.base44.yml ps          # db/api/web all healthy
KEY=<the anon key from docker-compose.base44.yml>
curl -s -H "apikey: $KEY" 'http://localhost:3000/rest/v1/cities?select=slug' | head -c 200
```

Expected catalog: **32 cities**, ~330 venues, a seeded `venue_events` calendar.
If the web container restarts, `npm ci` re-runs (about a minute) before Vite serves.

Checks (the sandbox host has no Node, so run them in the container):

```bash
docker compose -f docker-compose.base44.yml exec -T web npm run typecheck
docker compose -f docker-compose.base44.yml exec -T web npm run lint
```
