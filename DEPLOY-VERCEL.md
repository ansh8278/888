# Deploying to Vercel

Vercel has no permanent disk, so two things move off the server:

| On cPanel / locally | On Vercel |
|---|---|
| `888.db` file | **Turso** — the same SQLite database, hosted (free tier) |
| `media/` folder | **Vercel Blob** — file storage (free tier) |

Both are switched on by environment variables; nothing else changes.

## 1. Database — Turso (5 min)

1. Sign up at https://turso.tech → **Create Database** → name `888`, pick a
   region near your customers.
2. Copy the **URL** (`libsql://888-xxxx.turso.io`).
3. **Create Token** (read & write, no expiry) → copy it. Shown once.

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
DATABASE_URI            libsql://888-xxxx.turso.io
DATABASE_AUTH_TOKEN     the Turso token
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
- **Backups:** Turso dashboard has point-in-time restore; Blob files are
  kept by Vercel.

## Notes

- Vercel's free (Hobby) plan is for non-commercial use; a business site
  should be on Pro (~$20/month).
- Gmail SMTP works from Vercel (unlike shared hosting) — keep the App Password
  in the environment variables, never in code.
