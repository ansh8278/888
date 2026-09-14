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
  echo "script  : version 5 (webpack build)"
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
  echo "node    : $(node -v)   npm: $(npm -v)"
  echo "glibc   : $(ldd --version 2>/dev/null | head -1 | grep -oE '[0-9]+\.[0-9]+$' || echo unknown)  (database needs 2.18, images 2.28)"

  echo; echo "---- 1/4 npm install ----  (started $(date +%H:%M), silent until done — can take 10-20 min here)"
  # Clean slate. Earlier runs on this slow host overlapped and left npm's
  # half-extracted folders everywhere; patching around them failed twice.
  # Killing any stray install and reinstalling from empty is the reliable fix.
  # (~/.npm keeps the downloaded packages, so this is faster than the first time.)
  pkill -u "$(id -un)" -f 'npm (install|ci)' 2>/dev/null && { echo "stopped a stray npm install from an earlier run"; sleep 3; }
  VENV_MODULES="$(dirname "$(dirname "$ACTIVATE")")/lib/node_modules"
  if [ -d "$VENV_MODULES" ]; then
    echo "clearing $VENV_MODULES for a fresh install"
    find "$VENV_MODULES" -mindepth 1 -maxdepth 1 -exec rm -rf {} + 2>/dev/null
  fi
  npm install --omit=dev --no-audit --no-fund 2>&1 || { echo "FAILED at npm install"; exit 1; }
  echo "npm install finished $(date +%H:%M)"

  echo; echo "---- 2/4 build ----  (started $(date +%H:%M))"
  # --webpack: this host's system libraries are older than Next's native
  # compiler needs (GLIBC 2.30), so the fast Turbopack path cannot load.
  # Webpack uses a portable fallback. Slower, but it works here.
  NODE_OPTIONS=--max-old-space-size=2048 npx next build --webpack 2>&1 || { echo "FAILED at build (if it says 'heap out of memory' or 'Killed', use Plan B in DEPLOY-CPANEL.md)"; exit 1; }
  echo "build finished $(date +%H:%M)"

  echo; echo "---- 3/4 migrate ----"
  npx payload migrate 2>&1 || { echo "FAILED at migrate"; exit 1; }

  echo; echo "---- 4/4 seed (first run only) ----"
  if [ -f "$APP_DIR/.seeded" ]; then
    echo "already seeded — skipping so your content is not overwritten"
  else
    npm run seed 2>&1 && touch "$APP_DIR/.seeded" || { echo "FAILED at seed"; exit 1; }
  fi

  # Tell Passenger to reload the app.
  mkdir -p "$APP_DIR/tmp" && touch "$APP_DIR/tmp/restart.txt"

  echo; echo "DONE. Now open the site. If it shows an error, restart it in cPanel > Node.js."
} >> "$LOG" 2>&1
