#!/bin/sh
# Run this in the cPanel Terminal BEFORE uploading the site.
# It tells you in ten seconds whether this server can run the app at all.
#
#   sh cpanel-check.sh

echo ""
echo "888 Lock & Key — cPanel pre-flight"
echo "==================================="

pass=0; fail=0
ok()   { echo "  [OK]   $1"; pass=$((pass+1)); }
bad()  { echo "  [FAIL] $1"; fail=$((fail+1)); }
warn() { echo "  [WARN] $1"; }

# 1. Node present and new enough (Next 16 refuses to run below 20.9)
if command -v node >/dev/null 2>&1; then
  v=$(node -v | sed 's/^v//')
  major=$(echo "$v" | cut -d. -f1); minor=$(echo "$v" | cut -d. -f2)
  if [ "$major" -gt 20 ] || { [ "$major" -eq 20 ] && [ "$minor" -ge 9 ]; }; then
    ok "Node $v (need 20.9 or newer)"
  else
    bad "Node $v is too old — need 20.9 or newer. In cPanel > Setup Node.js App, pick a newer version."
  fi
else
  bad "Node is not on this account. Look for 'Setup Node.js App' in cPanel > Software. If it is not there, this hosting plan cannot run the site."
fi

# 2. npm
command -v npm >/dev/null 2>&1 && ok "npm $(npm -v)" || bad "npm missing"

# 3. Memory available to processes (the build needs ~2 GB)
if command -v ulimit >/dev/null 2>&1; then
  lim=$(ulimit -v 2>/dev/null)
  if [ "$lim" = "unlimited" ]; then
    ok "no per-process memory cap"
  elif [ -n "$lim" ] && [ "$lim" -lt 2000000 ]; then
    warn "process memory capped at $((lim/1024)) MB — 'npm run build' may run out of memory here. Plan B is to build on your computer and upload the result."
  else
    ok "process memory cap $((lim/1024)) MB"
  fi
fi
if [ -r /proc/meminfo ]; then
  avail=$(awk '/MemAvailable/ {printf "%d", $2/1024}' /proc/meminfo)
  [ "$avail" -ge 2000 ] && ok "${avail} MB memory available" || warn "only ${avail} MB memory available — the build needs ~2 GB"
fi

# 4. Platform — native modules (sharp, libsql) ship binaries for linux x64
arch=$(uname -m); os=$(uname -s)
[ "$os" = "Linux" ] && ok "Linux" || bad "not Linux ($os)"
case "$arch" in x86_64|aarch64) ok "CPU $arch";; *) warn "CPU $arch — native modules may need compiling";; esac

# 5. Can we write files here? (SQLite database + uploads live on this disk)
touch .cpanel-write-test 2>/dev/null && { rm -f .cpanel-write-test; ok "home directory is writable"; } || bad "cannot write to this directory"

# 6. Outbound network — needed for npm install and for sending email
if command -v curl >/dev/null 2>&1; then
  curl -s -o /dev/null --max-time 8 https://registry.npmjs.org/ && ok "can reach npm registry" || bad "cannot reach npm registry (npm install will fail)"
fi

echo ""
echo "  $pass passed, $fail failed"
if [ "$fail" -gt 0 ]; then
  echo "  A FAIL above means this plan cannot run the site as-is."
else
  echo "  Looks viable. Follow DEPLOY-CPANEL.md."
fi
echo ""
