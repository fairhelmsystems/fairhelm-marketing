#!/usr/bin/env bash
# Regression check: forbidden marketing claims must never re-enter the site.
#
# Runs as part of `bun run build` (and standalone via `bun run check:claims`).
# Scans src/ — everything that ships as visible copy, metadata, JSON-LD, or
# crawler-facing text (/llms.txt is generated from src/content/llms.ts).
#
# If a claim on this list gains real evidence, record it in
# docs/marketing-claims-register.md FIRST, then relax the pattern here.
set -euo pipefail

cd "$(dirname "$0")/.."

# The OG card generator is included: its copy is baked into the PNGs in public/og.
TARGETS=(src scripts/og-cards/generate.mjs ../../packages/squarecampus-content/src ../../packages/ui/src)

# Pattern | description
PATTERNS=(
  "500\+|invented customer count (500+)"
  "[0-9]+\+ (schools|institutions|campuses) (trust|use|chose|choose)|invented adoption count"
  "Trusted by [0-9]|invented adoption count"
  "India.s #1|unsupported #1 ranking"
  "#1 school|unsupported #1 ranking"
  "India.s leading|unsupported 'leading' ranking"
  "only you hold the keys|unverified key-ownership claim"
  "[Bb]ank[- ]grade|unverified 'bank-grade' security claim"
  "99\.9|unverified uptime/SLA figure"
  "actual measured|unverified live metric"
  "No incidents reported|fabricated live status"
  "All replicas synchronized|fabricated live status"
  "verified monthly|unverified audit-cadence claim"
  "tested quarterly|unverified test-cadence claim"
  "RTO [0-9]|unverified recovery objective"
  "RPO [0-9]|unverified recovery objective"
  # Commercial doctrine (see docs/marketing-claims-register.md, content/commercial.ts)
  "[Nn]o prices are published|stale pricing-availability wording (the model is published; figures by proposal)"
  "[Nn]o figures are published|stale pricing-availability wording"
  "[Nn]o prices, rates|stale pricing-availability wording"
  "student \+ staff|stale headcount basis (licence is on active enrolled students)"
  "[Hh]eadcount-based|stale headcount basis (licence is on student-volume bands)"
  "[Ii]mplementation and training included|stale bundling phrase (use commercialScope.implementation)"
  "[Pp]remium implementation|[Pp]riority implementation|[Pp]remium support|stale paid-implementation wording (implementation and support are included in every plan)"
  "nothing is lost in the (switch|migration|move)|[Zz]ero data loss|complete migration guaranteed|guaranteed (full|complete) migration|overclaimed migration (it is best effort; gaps are flagged before go-live)"
  "gateway charges are passed through|metered third-party usage|stale usage wording (monthly allowance, prepaid top-ups; gateway fees are not billed by SquareCampus)"
  "(small|first|initial) cohort|stale Founding Partner wording (two positions, ever)"
  "one approved (institutional )?tenant|stale Entra wording (SSO can be quoted across plans)"
  "price protection for the (agreed|initial)|stale Founding Partner wording (no protection duration is published)"
  "[Ll]ifetime (pricing|discount|protection)|forbidden Founding Partner wording"
  "Enterprise-only|stale identity tier wording"
  "SSO-ready|vague identity capability wording"
  # Retention and exit (see /data-retention/ and docs/marketing-claims-register.md)
  "within 30 days of request|unsupported export deadline"
  "consent management, data retention controls|unimplemented capabilities described as available"
  "[Cc]omplete exports? in standard formats|unsupported export commitment (terms are agreed in the order form)"
  "ensuring GDPR|GDPR compliance claim without assessment"
  "[Rr]etention schedule is under legal review|implies an engaged legal review that is not established"
  # Hosting (the platform is on Microsoft Azure in India; see docs/marketing-claims-register.md)
  "AWS Mumbai|stale hosting claim (the platform is hosted on Microsoft Azure in India)"
  "ap-south-1|stale hosting region"
  "[Mm]ulti-AZ|unevidenced availability claim (offer documentation instead)"
  "our AWS|stale hosting claim (AWS is for Enterprise private deployments)"
  # Capability and availability (audit 2026-09-29; content/commercial.ts › availability,
  # deploymentOptions, integrationScope). Languages, apps, integrations and BYOC are
  # confirmed per institution in the proposal, never asserted site-wide.
  "[Tt]en (Indian )?languages|unsupported language count (languages are confirmed in the proposal)"
  "BYOC[^.]*coming soon|BYOC availability is 'not offered today' (content/commercial.ts)"
  "early-access list|no BYOC early-access list exists"
  "iOS and Android|app-store availability is not established"
  "[Pp]re-built integrations?|no pre-built connector catalogue exists (integrations are scoped)"
  "webhooks for real-time|unimplemented integration capability"
  "API (&|and) WebSocket|WebSocket connectors are not offered"
  "LIVE ·|an illustration must not look like live telemetry"
  "Questions audited|numeric assurance shown on an illustration"
  "Records copied out|numeric assurance shown on an illustration"
  "(behaves|run|runs) in production|implies production usage that is not evidenced"
  "without drama, outages|unsupported reliability promise"
  "automated backups, redundant|unevidenced backup/redundancy claim"
  "[Qq]ueue reminder circular|AEGIS depicted taking an action (it is read-only)"
  "positioned as a School|internal positioning commentary in public copy"
  "There is no free trial|blanket trial prohibition omits the selected launch pilot"
  "A pilot is a paid, scoped 60|blanket paid-pilot policy omits the complimentary programme"
  "Optional from Pro|Starter may request a separately quoted Entra enhancement"
)

FAILED=0
for entry in "${PATTERNS[@]}"; do
  pattern="${entry%%|*}"
  reason="${entry##*|}"
  if matches=$(grep -rInE "$pattern" "${TARGETS[@]}" 2>/dev/null); then
    echo "FORBIDDEN CLAIM ($reason):"
    echo "$matches" | sed 's/^/  /'
    FAILED=1
  fi
done

if [[ "$FAILED" -eq 1 ]]; then
  echo ""
  echo "check-claims: forbidden marketing claims found. See docs/marketing-claims-register.md."
  exit 1
fi

echo "check-claims: OK — no forbidden claims found."
