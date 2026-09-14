# Deploying to Vercel

Vercel has no permanent disk, so two things move off the server:

| On cPanel / locally | On Vercel |
|---|---|
| `888.db` file (SQLite) | **Supabase** — a hosted Postgres database (free tier) |
| `media/` folder | **Vercel Blob** — file storage (free tier) |

Both are switched on by environment variables. The app picks the database
engine from the connection string (`file:` → SQLite, `postgres://` →
Postgres); each engine has its own migrations folder (`src/migrations`,
`src/migrations-pg`).

## 1. Database — Supabase (5 min)

1. Sign up at https://supabase.com → **New project** → name `888`, choose a
   strong database password (save it), pick a region near your customers.
2. When it is ready: top bar **Connect** → *Connection string* → method
   **Session pooler** (not Direct, not Transaction) → copy the URI. It looks
   like `postgresql://postgres.xxxx:[YOUR-PASSWORD]@aws-0-region.pooler.supabase.com:5432/postgres`.
3. Replace `[YOUR-PASSWORD]` with the password you chose. That is your
   `DATABASE_URI`.

## 2. Vercel project (10 min)

```
npm i -g vercel
cd web
vercel login
vercel            # answer: set up new project, name 888, defaults for the rest
```

Then in the Vercel dashboard → the project → **Settings → Environment Variables**,
add (Production):

```
PAYLOAD_SECRET          a long random string (openssl rand -hex 32)
DATABASE_URI            the Supabase connection string from step 1
NEXT_PUBLIC_SITE_URL    https://<project>.vercel.app   (later: your real domain)
NOTIFY_EMAIL            where lead alerts go
SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASSWORD / SMTP_FROM / SMTP_FROM_NAME
SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD
```

**Storage → Create → Blob** → connect it to the project. That adds
`BLOB_READ_WRITE_TOKEN` automatically.

Do **not** set `NEXT_PUBLIC_BASE_PATH` — the site lives at the root on Vercel.

## 3. Deploy

```
vercel --prod
```

The build runs the database migrations first (`vercel-build` in package.json),
then builds the site. The URL is printed at the end.

## 4. Starter content (once)

From your computer, pointing at the hosted database and blob store:

```
cd web
vercel env pull .env.vercel
set -a; . ./.env.vercel; set +a
npm run seed
```

Then open `https://<project>.vercel.app/admin` and log in with
`SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`. Delete `.env.vercel` afterwards.

## Later

- **Code change:** `vercel --prod` again.
- **Own domain:** Vercel → Settings → Domains → add it, follow the DNS
  instructions, then change `NEXT_PUBLIC_SITE_URL` and redeploy.
- **Backups:** Supabase → Database → Backups (daily on the free tier);
  Blob files are kept by Vercel.
- **Changing fields later:** after editing a collection, run
  `DATABASE_URI=<supabase uri> npm run migrate:create -- <name>` locally and
  commit the new file in `src/migrations-pg/`; the next deploy applies it.

## Notes

- Vercel's free (Hobby) plan is for non-commercial use; a business site
  should be on Pro (~$20/month).
- Gmail SMTP works from Vercel (unlike shared hosting) — keep the App Password
  in the environment variables, never in code.
