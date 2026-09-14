#!/bin/bash
# One-shot deploy for cPanel accounts WITHOUT Terminal access.
#
# Run it from cPanel > Cron Jobs (see DEPLOY-CPANEL.md), then read the log:
#   /home/<user>/888/deploy.log
#
# It installs the libraries, builds the site, creates the database, and seeds
# the starter content — the same steps the cPanel buttons would do, minus the
# URL check that keeps failing before the app can run.

# No `set -u`: cPanel's activate script reads a variable it never sets
# (CL_VIRTUAL_ENV) and strict mode aborts on it.
APP_DIR="${APP_DIR:-$HOME/888}"
LOG="$APP_DIR/deploy.log"

# cPanel's Node lives in a "virtual environment"; this is its standard path.
ACTIVATE=$(ls -d "$HOME"/nodevenv/888/*/bin/activate 2>/dev/null | head -1)

# Once a deploy has fully succeeded, do nothing — so the cron job can be left
# running every minute without harm. Delete .deploy-done to deploy again.
[ -f "$APP_DIR/.deploy-done" ] && exit 0

# Never run two deploys at once: a second npm install collides with the
# first one's half-extracted folders (ENOTEMPTY on rename).
LOCK="$APP_DIR/.deploy.lock"
if [ -f "$LOCK" ] && [ "$(find "$LOCK" -mmin -90 2>/dev/null)" ]; then
  echo "$(date): another deploy is still running (lock is under 90 min old) — skipping" >> "$LOG"
  exit 0
fi
touch "$LOCK"
trap 'rm -f "$LOCK"' EXIT

{
  echo "==================== $(date) ===================="
  echo "script  : version 12 (publishes starter content)"
  echo "app dir : $APP_DIR"

  if [ -z "$ACTIVATE" ]; then
    echo "FAILED: cannot find $HOME/nodevenv/888/*/bin/activate"
    echo "Create the app in cPanel > Node.js first (Application root: 888)."
    exit 1
  fi
  echo "node env: $ACTIVATE"
  # shellcheck disable=SC1090
  source "$ACTIVATE"
  cd "$APP_DIR" || { echo "FAILED: cannot cd to $APP_DIR"; exit 1; }

  # cPanel's Node.js env vars only reach the app via Passenger, not cron. The
  # build bakes in NEXT_PUBLIC_*, and migrate/seed need the secret and
  # database path, so load them from .env in the app folder.
  # Read line by line instead of sourcing: a value like "888 Lock & Key"
  # would otherwise be run as commands.
  if [ -f "$APP_DIR/.env" ]; then
    while IFS= read -r line || [ -n "$line" ]; do
      line=${line%$'\r'}
      case "$line" in ''|'#'*) continue;; esac
      export "$line"
    done < "$APP_DIR/.env"
    echo "env     : loaded from .env (site url: ${NEXT_PUBLIC_SITE_URL:-unset}, base path: ${NEXT_PUBLIC_BASE_PATH:-none})"
  else
    echo "WARNING : no .env in $APP_DIR — build will use localhost URLs and seed may fail"
  fi
  echo "node    : $(node -v)   npm: $(npm -v)"
  echo "glibc   : $(ldd --version 2>/dev/null | head -1 | grep -oE '[0-9]+\.[0-9]+$' || echo unknown)  (database needs 2.18, images 2.28)"

  echo; echo "---- 1/4 npm install ----"
  if [ -f "$APP_DIR/node_modules/.package-lock.json" ] && [ -d "$APP_DIR/node_modules/next" ] && [ -d "$APP_DIR/node_modules/payload" ]; then
    echo "already installed — skipping (delete node_modules/.package-lock.json to force a reinstall)"
  else
  echo "(started $(date +%H:%M), silent until done — can take 10-20 min here)"
  # Clean slate. Earlier runs on this slow host overlapped and left npm's
  # half-extracted folders everywhere; patching around them failed twice.
  # Killing any stray install and reinstalling from empty is the reliable fix.
  # (~/.npm keeps the downloaded packages, so this is faster than the first time.)
  pkill -u "$(id -un)" -f 'npm (install|ci)' 2>/dev/null && { echo "stopped a stray npm install from an earlier run"; sleep 3; }
  # cPanel normally makes 888/node_modules a link into the Node environment,
  # but after the earlier crashes it may be a real folder full of torn
  # packages (an empty version = "Invalid Version:"). Wipe whichever it is.
  VENV_MODULES="$(dirname "$(dirname "$ACTIVATE")")/lib/node_modules"
  wipe_modules() {
    echo "node_modules is: $(ls -ld "$APP_DIR/node_modules" 2>&1)"
    if [ -d "$APP_DIR/node_modules" ] && [ ! -L "$APP_DIR/node_modules" ]; then
      rm -rf "$APP_DIR/node_modules"
      mkdir -p "$VENV_MODULES" && ln -s "$VENV_MODULES" "$APP_DIR/node_modules"
      echo "replaced the real folder with a link to $VENV_MODULES"
    fi
    mkdir -p "$VENV_MODULES"
    find "$VENV_MODULES" -mindepth 1 -maxdepth 1 -exec rm -rf {} +
    echo "cleared $VENV_MODULES — $(ls -A "$VENV_MODULES" | wc -l) items left (must be 0)"
  }
  wipe_modules

  # npm's resolver crashes on this host ("Invalid Version:") even from a
  # clean slate. `npm ci` skips the resolver: it installs exactly what
  # package-lock.json lists, which is what worked on the very first run.
  if [ ! -f "$APP_DIR/package-lock.json" ]; then
    echo "FAILED: package-lock.json is missing. Upload it from Desktop/888/web into $APP_DIR and run again."
    exit 1
  fi
  if grep -q '"version": ""' "$APP_DIR/package-lock.json"; then
    echo "FAILED: package-lock.json on the server is damaged. Upload a fresh copy from Desktop/888/web (Overwrite) and run again."
    exit 1
  fi
  echo "package-lock.json: $(wc -c < "$APP_DIR/package-lock.json") bytes"
  if ! npm ci --omit=dev --no-audit --no-fund 2>&1; then
    echo "FAILED at npm ci. npm settings on this server:"
    npm config list 2>&1 | grep -v '^;' | head -20
    echo "npm's own log:"
    tail -n 40 "$(ls -t "$HOME"/.npm/_logs/*-debug-0.log 2>/dev/null | head -1)" 2>/dev/null
    exit 1
  fi
  echo "npm ci finished $(date +%H:%M)"
  fi

  echo; echo "---- 2/4 build ----"
  # Plan B: the build was uploaded from a computer (this host kills it for
  # memory). A .next folder with a BUILD_ID is a finished build — use it.
  if [ -f "$APP_DIR/.next/BUILD_ID" ]; then
    echo "using uploaded build $(cat "$APP_DIR/.next/BUILD_ID") — skipping (delete .next to build here instead)"
  else
  echo "(started $(date +%H:%M))"
  # --webpack: this host's system libraries are older than Next's native
  # compiler needs (GLIBC 2.30), so the fast Turbopack path cannot load.
  # Webpack uses a portable fallback. Slower, but it works here.
  NODE_OPTIONS=--max-old-space-size=2048 npx next build --webpack 2>&1 || { echo "FAILED at build (if it says 'heap out of memory' or 'Killed', use Plan B in DEPLOY-CPANEL.md)"; exit 1; }
  echo "build finished $(date +%H:%M)"
  fi

  echo; echo "---- 3/4 migrate ----"
  npx payload migrate 2>&1 || { echo "FAILED at migrate"; exit 1; }

  echo; echo "---- 4/4 seed (first run only) ----"
  if [ -f "$APP_DIR/.seeded" ]; then
    echo "already seeded — skipping so your content is not overwritten"
  else
    npm run seed 2>&1 && touch "$APP_DIR/.seeded" || { echo "FAILED at seed"; exit 1; }
  fi
  # Starter content seeded by older versions was left as drafts, which the
  # site hides. Publish everything once; later drafts made in admin are left alone.
  if [ ! -f "$APP_DIR/.published" ]; then
    echo "publishing all content (one time)"
    npm run versions:backfill 2>&1 && touch "$APP_DIR/.published" || { echo "FAILED at publish"; exit 1; }
  fi

  # Tell Passenger to reload the app.
  mkdir -p "$APP_DIR/tmp" && touch "$APP_DIR/tmp/restart.txt"

  touch "$APP_DIR/.deploy-done"
  echo; echo "DONE. Now open the site. If it shows an error, restart it in cPanel > Node.js."
  echo "(This script will not run again until $APP_DIR/.deploy-done is deleted.)"
} >> "$LOG" 2>&1
