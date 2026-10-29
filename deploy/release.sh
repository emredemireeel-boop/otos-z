#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
: "${PM2_APP:?Set PM2_APP to the existing OtoSoz PM2 application name}"
port="${SEO_PREVIEW_PORT:-3011}"
candidate=".next-candidate-$(date -u +%Y%m%d%H%M%S)"
export OTOSOZ_DIST_DIR="$candidate"
export OTOSOZ_TSCONFIG=".tsconfig-release.json"
if [[ -z "${GOOGLE_APPLICATION_CREDENTIALS:-}" && -r /etc/otosoz/firebase-admin.json ]]; then
    export GOOGLE_APPLICATION_CREDENTIALS=/etc/otosoz/firebase-admin.json
fi
preview_pid=""
cleanup() { if [[ -n "$preview_pid" ]]; then kill "$preview_pid" 2>/dev/null || true; wait "$preview_pid" 2>/dev/null || true; fi; }
trap cleanup EXIT
npm ci
node scripts/seo-release-config.mjs
npx next typegen
npx tsc --noEmit --project "$OTOSOZ_TSCONFIG"
npm run build
node node_modules/next/dist/bin/next start -H 127.0.0.1 --port "$port" > /tmp/otosoz-seo-preview.log 2>&1 &
preview_pid=$!
for ((i=0; i<60; i++)); do if curl -fsS "http://127.0.0.1:$port/robots.txt" > /dev/null; then break; fi; sleep 1; done
# A failure leaves the currently running PM2 build untouched.
npm run seo:check -- --base "http://127.0.0.1:$port" --output docs/seo/ci/deploy
cleanup
preview_pid=""
pm2 restart "$PM2_APP" --update-env
pm2 save
printf 'Activated build %s. Previous build directories remain available for rollback.\n' "$candidate"
