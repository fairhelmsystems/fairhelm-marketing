#!/bin/bash

set -euo pipefail

PASS_COUNT=0
FAIL_COUNT=0

run_step() {
  local label="$1"
  shift

  echo "==> ${label}"
  if "$@"; then
    echo "PASS: ${label}"
    PASS_COUNT=$((PASS_COUNT + 1))
  else
    echo "FAIL: ${label}"
    FAIL_COUNT=$((FAIL_COUNT + 1))
  fi
  echo ""
}

run_pm() {
  local cmd="$1"
  shift

  if command -v bun >/dev/null 2>&1; then
    bun run "$cmd"
  elif command -v npm >/dev/null 2>&1; then
    npm run "$cmd"
  else
    echo "No package manager found (bun/npm)."
    return 1
  fi
}

echo "Security check starting..."

run_step "Lint" run_pm lint
run_step "Typecheck" run_pm check-types
run_step "Build" run_pm build

if command -v bun >/dev/null 2>&1; then
  run_step "Dependency audit" bun audit
elif command -v npm >/dev/null 2>&1; then
  run_step "Dependency audit" npm audit --production
else
  echo "SKIP: Dependency audit (no package manager found)"
fi

echo "Security check complete. Passed: ${PASS_COUNT}, Failed: ${FAIL_COUNT}"

if [ "$FAIL_COUNT" -ne 0 ]; then
  exit 1
fi
