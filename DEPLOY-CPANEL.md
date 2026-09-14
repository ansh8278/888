# Deploying to cPanel

This works **only if your cPanel has "Setup Node.js App"** (under *Software*).
Plain PHP hosting cannot run this site. Step 0 checks that before you spend
any time.

The site needs: Node 20.9+, ~2 GB of memory to build, and a writable home
directory (the database and uploaded images live there).

---

## Step 0 — Check the server can run it (2 minutes)

1. cPanel → **Terminal** (under *Advanced*). If Terminal is missing, open
   *Setup Node.js App*, and if that is missing too, stop here: this plan
   cannot run the site.
2. Upload `scripts/cpanel-check.sh` via *File Manager* to your home directory.
3. In Terminal:
   ```
   sh cpanel-check.sh
   ```
4. Every line must say `[OK]`. A `[FAIL]` means it will not work on this plan.
   A `[WARN]` about memory means Step 4 might fail — Plan B below covers it.

## Step 1 — Package the site on your computer

```
cd web
npm run package:cpanel
```

That makes `888-site.zip` (about 0.4 MB). It contains the code only —
no secrets, no database, no images, no `node_modules`.

## Step 2 — Upload and unzip

1. cPanel → **File Manager** → go to your home directory
   (e.g. `/home/yourname`), **not** `public_html`.
2. Create a folder `888` and open it.
3. **Upload** `888-site.zip`, then right-click → **Extract**.
4. Delete the zip afterwards.

## Step 3 — Create the Node app

cPanel → **Setup Node.js App** → **Create Application**:

| Field | Value |
|---|---|
| Node.js version | the newest offered, **20.9 or higher** |
| Application mode | Production |
| Application root | `888` |
| Application URL | your domain (or a subdomain while testing) |
| Application startup file | `app.js` |

Click **Create**. Then, in the same screen, add the **environment variables**
(there is an *Add Variable* button). Copy them from your local `.env`:

```
PAYLOAD_SECRET         (the long random string from your .env)
DATABASE_URI           file:./888.db
NEXT_PUBLIC_SITE_URL   https://yourdomain.com     ← your real domain, https
NOTIFY_EMAIL           where lead alerts go
SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASSWORD / SMTP_FROM / SMTP_FROM_NAME
SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD
```

**Save** the variables. Then click **Run NPM Install** — this installs the
Linux versions of the libraries. It can take a few minutes. It must finish
without errors.

## No Terminal? Use a cron job instead (Steps 4–6 in one go)

Some plans hide Terminal, and the *Run NPM Install* button refuses to run
until the app's URL answers — which it cannot before the libraries exist.
A cron job runs the same commands without either.

1. Upload `scripts/cpanel-deploy.sh` into the `888` folder (it is already
   there if you used the zip).
2. cPanel → **Cron Jobs** → *Add New Cron Job*:
   - Common Settings: **Once Per Minute** (`* * * * *`)
   - Command:
     ```
     bash /home/YOURUSER/888/scripts/cpanel-deploy.sh
     ```
     (replace `YOURUSER`; the exact home path is shown in File Manager)
3. Click *Add New Cron Job*. **Then delete the cron job straight away** —
   one run is enough, and the script writes a marker so a repeat cannot
   wipe your content anyway.
4. Wait 5–10 minutes, then open `888/deploy.log` in File Manager
   (right-click → View). The last line should say `DONE`.
5. cPanel → Node.js → **Restart**, then open the site.

If the log ends in `FAILED at build`, the server is short of memory — use
Plan B below.

## Step 4 — Build

Back in **Terminal**, the *Setup Node.js App* screen shows a line like
`source /home/yourname/nodevenv/888/20/bin/activate`. Copy and run it, then:

```
cd ~/888
npm run build
```

This takes 2–5 minutes and prints `✓ Generating static pages (68/68)`.

**If it dies with "heap out of memory" or is killed** — the server does not
have enough memory to build. Use **Plan B** below.

## Step 5 — Create the database and the first admin

Still in Terminal, in the same folder:

```
npx payload migrate
npm run seed
```

`migrate` builds an empty database. `seed` fills it with the starter content
and creates the admin login from `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`.
If you left the password blank it is printed **once** — write it down.

## Step 6 — Start it

**Setup Node.js App** → your app → **Restart**.

Open your domain. You should see the site; `/admin` should show the login.
Log in, then **Site settings → put in your real phone number, licence and
addresses.**

## Step 7 — Test the form

Submit the booking form once with your own details. You should get the alert
email, and the lead should appear on the admin dashboard. Then delete it.

---

## After any code change

```
npm run package:cpanel          # on your computer
```
Upload and extract over the old files (keep `888.db` and `media/` — the zip
does not contain them, so extracting will not touch them). Then in Terminal:

```
cd ~/888 && npm run build && npx payload migrate
```
and **Restart** the app.

## Backups

The database and images are in `~/888/888.db` and `~/888/media/`. In Terminal:

```
cd ~/888 && npm run backup
```

To run it every night, cPanel → **Cron Jobs**, add:

```
0 3 * * *   cd ~/888 && /home/yourname/nodevenv/888/20/bin/node scripts/backup.mjs
```
(use the real path from your *Setup Node.js App* screen). Download the
`backups/` folder occasionally — a backup on the same disk does not survive
losing the disk.

---

## Plan B — build on your computer, upload the result

Use this if `npm run build` runs out of memory on the server. The built files
are the same on any machine; only `node_modules` must come from the server.

On your computer:
```
cd web
NEXT_PUBLIC_SITE_URL=https://yourdomain.com npm run build
zip -r 888-build.zip .next -x ".next/cache/*"
```
Upload `888-build.zip` into `~/888` and extract it (it creates `.next/`).
Then do Step 5 and Step 6 as normal. Skip Step 4.

`NEXT_PUBLIC_SITE_URL` must be set **before** this build — it is baked into
the sitemap and links.

---

## When it does not work

| Symptom | Cause |
|---|---|
| "Setup Node.js App" is not in cPanel | Plan does not support Node. Ask your host, or use a Node host (Railway, ~$5/mo) and keep the domain at GoDaddy. |
| Only Node 16/18 offered | Too old. Ask the host to enable a newer version. |
| `npm install` fails on `sharp` or `libsql` | The server is missing build tools. Ask the host, or switch to Plan B and also copy `node_modules` from a Linux machine. |
| Build killed / out of memory | Plan B. |
| Site loads but images 404 | `media/` is missing — upload it from your computer into `~/888/media/`. |
| `/admin` gives a database error | Step 5 was skipped — run `npx payload migrate`. |
| Emails not sending | Check the SMTP variables in *Setup Node.js App*, then `npm run email:check` in Terminal. |
