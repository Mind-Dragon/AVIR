#!/usr/bin/env bash
# deploy.sh — Deploy AVIR to the avir-website Vercel project.
#
# Usage:
#   ./scripts/deploy.sh          # preview deployment
#   ./scripts/deploy.sh --prod   # production deployment
#
# This script ensures that every deploy targets the one canonical
# Vercel project (avir-website / prj_UcrrOU0xcRAZSYQXmDKTdHVk5Lgk)
# and never creates a stray project.

set -euo pipefail

EXPECTED_PROJECT_ID="prj_UcrrOU0xcRAZSYQXmDKTdHVk5Lgk"
EXPECTED_ORG_ID="team_PNMrVw3EwgwliM1U2nxDQ6Kg"
PROJECT_JSON=".vercel/project.json"

# ── Verify project link ──────────────────────────────────────────────
if [ ! -f "$PROJECT_JSON" ]; then
  echo "ERROR: $PROJECT_JSON not found."
  echo "Run:  vercel link  and select the avir-website project in the fogonekun-9144 team."
  exit 1
fi

CURRENT_PROJECT_ID=$(node -e "console.log(require('./$PROJECT_JSON').projectId)")
CURRENT_ORG_ID=$(node -e "console.log(require('./$PROJECT_JSON').orgId)")

if [ "$CURRENT_PROJECT_ID" != "$EXPECTED_PROJECT_ID" ]; then
  echo "ERROR: .vercel/project.json points to project '$CURRENT_PROJECT_ID'."
  echo "Expected: $EXPECTED_PROJECT_ID (avir-website)."
  echo "Re-run:  vercel link  and choose avir-website in fogonekun-9144."
  exit 1
fi

if [ "$CURRENT_ORG_ID" != "$EXPECTED_ORG_ID" ]; then
  echo "ERROR: .vercel/project.json points to org '$CURRENT_ORG_ID'."
  echo "Expected: $EXPECTED_ORG_ID (fogonekun-9144)."
  echo "Re-run:  vercel link  and choose the fogonekun-9144 team."
  exit 1
fi

echo "✓ Verified: deploying to avir-website (prj_UcrrOU0xcRAZSYQXmDKTdHVk5Lgk)"

# ── Deploy ────────────────────────────────────────────────────────────
if [ "${1:-}" = "--prod" ]; then
  echo "Deploying to production…"
  npx vercel --prod --yes
else
  echo "Creating preview deployment…"
  npx vercel --yes
fi
