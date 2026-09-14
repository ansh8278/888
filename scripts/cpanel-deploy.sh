#!/bin/bash
# One-shot deploy for cPanel accounts WITHOUT Terminal access.
#
# Run it from cPanel > Cron Jobs (see DEPLOY-CPANEL.md), then read the log:
#   /home/<user>/888/deploy.log
#
# It installs the libraries, builds the site, creates the database, and seeds
# the starter content — the same steps the cPanel buttons would do, minus the
# URL check that keeps failing before the app can run.

set -u
APP_DIR="${APP_DIR:-$HOME/888}"
LOG="$APP_DIR/deploy.log"

# cPanel's Node lives in a "virtual environment"; this is its standard path.
ACTIVATE=$(ls -d "$HOME"/nodevenv/888/*/bin/activate 2>/dev/null | head -1)

{
  echo "==================== $(date) ===================="
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

  echo; echo "---- 1/4 npm install ----"
  npm install --omit=dev --no-audit --no-fund 2>&1 || { echo "FAILED at npm install"; exit 1; }

  echo; echo "---- 2/4 build ----"
  # 1.5 GB ceiling: enough for this site, low enough for shared hosting.
  NODE_OPTIONS=--max-old-space-size=1536 npx next build 2>&1 || { echo "FAILED at build (if it says 'heap out of memory' or 'Killed', use Plan B in DEPLOY-CPANEL.md)"; exit 1; }

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
