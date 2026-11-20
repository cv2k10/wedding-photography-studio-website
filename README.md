# Wedding Photography Studio

A server-rendered React site served by Hono on Cloudflare Workers. Cloudflare D1 stores packages, portfolio items, testimonials, photographers, and bookings. Wrangler serves the compiled Tailwind stylesheet as a Worker asset. Neither Next.js nor a PostgreSQL server is required.

## Local development

Use Node.js 22 or later.

```sh
npm ci
npm run db:local
npm run seed:local  # optional: fill empty catalog tables with demo content
cp .dev.vars.example .dev.vars  # optional: set ADMIN_PASSWORD to enable /admin
npm run dev
```

Wrangler listens at `http://localhost:8787`. Local D1 data persists under `.wrangler/`. The demo seed does not add bookings or overwrite existing catalog data. Restart the dev server after changing `.dev.vars`; rerun `npm run css` after editing Tailwind classes while the server is running.

`POST /api/bookings` accepts JSON; `/booking` provides a browser form. `GET /api/health` checks that the bookings table is accessible. `/admin` requires `ADMIN_PASSWORD` and lets the studio review bookings and change their status.

## Cloudflare deployment

1. Authenticate with `npx wrangler login`, then run `npx wrangler d1 create wedding-studio`.
2. Replace the zero UUID in `wrangler.jsonc` with the D1 database ID Wrangler returns. Keep the binding named `DB`.
3. Apply migrations and deploy:

   ```sh
   npm run db:remote
   npm run deploy
   npx wrangler secret put ADMIN_PASSWORD
   ```

   Use a strong, unique admin password. Admin access is disabled until the secret is set. For a public deployment, consider protecting `/admin` with Cloudflare Access or rate limiting at the edge.
4. For a demo deployment only, optionally run `npx wrangler d1 execute DB --remote --file seeds/demo.sql`.

The migrations create an empty D1 schema. **They do not copy existing PostgreSQL data.** For an existing production site, export and import its data separately before switching traffic. Preserve row IDs and booking-to-package references; serialize feature arrays as JSON text, booleans as `0`/`1`, dates as `YYYY-MM-DD`, and timestamps as UTC ISO strings. Import packages before bookings and verify row counts and foreign keys.

## Checks

- `npm run typecheck` — TypeScript validation.
- `npm run build` — compile CSS and bundle the Worker in Wrangler dry-run mode.
- `npm test` — smoke-test a running **disposable local** instance; creates test bookings. Set `TEST_ADMIN_PASSWORD` to the local instance’s password to also test the admin flow. Default endpoint is `http://localhost:8787` (`TEST_BASE_URL` can point to another local instance).
- `npm run db:generate` — create a SQLite migration after updating `src/db/schema.ts`.
- `npm run seed:generate` — regenerate `seeds/demo.sql` after editing the example content.

## GitHub Actions deployment

The **Cloudflare deployment** workflow in `.github/workflows/cloudflare.yml` runs type checks, a Worker dry run, and smoke tests against local D1 before applying remote migrations and deploying. It runs on pushes to `main` and the initial migration branch, and can be triggered manually from the Actions tab once it is on the default branch.

Under **Settings → Secrets and variables → Actions**, configure:

| Name | Type | Value |
| --- | --- | --- |
| `CLOUDFLARE_API_TOKEN` | Secret | Cloudflare API token scoped to the deployment account, with Workers Scripts: Edit and D1: Edit permissions, plus permission to list accounts for automatic discovery. |
| `CLOUDFLARE_ACCOUNT_ID` | Variable or secret | Optional account ID override. Required if the token can see more than one account. |
| `CLOUDFLARE_D1_DATABASE_ID` | Variable | Optional D1 database ID override. Without it the workflow reuses or creates `wedding-studio`. |

The workflow never seeds remote demo data or changes the Worker’s `ADMIN_PASSWORD` secret. Set that secret separately in Cloudflare.
