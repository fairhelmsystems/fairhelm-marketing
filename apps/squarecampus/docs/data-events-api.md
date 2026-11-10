# Data & Events API pricing and throughput

Owner decision dated 9 November 2026. This replaces the earlier Data & Events addendum in full and supplements the original Pricing Studio brief. The implementation here covers marketing, configuration, exact estimates, recommendation and regression checks. Backend items below are specifications for a separate workstream.

## Commercial and release state

The canonical policy is `packages/squarecampus-content/src/pricing-policy.json`, version `2026-11-10.2`. The owner's subsequent decisions approve plan-specific annual API fees and request limits (RPM; Enterprise doubled to 4,000 on 2026-11-10) and confirm readiness for activation. They supersede v2's single unconfigured fee and unknown request limits. The calculator maximum is 50,00,000 students.

| Dimension | Current state |
| --- | --- |
| Release | Available for activation, explicitly confirmed by the owner |
| Eligible plans | Starter, Growth and Enterprise |
| Catalogue | Same supported read-only resources, event-history queries and WebSocket subscriptions |
| Price | `annualDataEventsApiPaise` maps Starter to ₹2,500, Growth to ₹5,000 and Enterprise to ₹10,000 per year |
| Throughput | Starter 250, Growth 500 and Enterprise 4,000 external API requests per sliding 60-second window |
| Aggregation | One billed institution across keys, campuses, clients and replicas |
| Stream/query bounds | Unconfigured |
| Replay retention | Unconfigured, independent of audit/business retention |
| Mid-term, renewal and cancellation terms | Require approved billing policy |
| Included exports | Authorized supported datasets and retained audit records |
| Native workflow/app traffic | Independent of API purchase and external throughput |
| SSO | Optional on every plan, with activation included in Enterprise |

External throttling has no automatic overage fee, forced upgrade, AIC debit or communication-credit debit. Internal module communication, required payment/messaging callbacks, standard apps and branded apps continue through native platform controls. External access expiry affects the integration entitlement. Core workflows, retained audit records and included exports have their own authorization and lifecycle rules.

## Estimator behavior

The public checkbox selects the optional annual Data & Events API for the estimate. Its fee and displayed throughput follow the selected platform plan. The owner confirmed activation readiness. The calculator remains an estimate and does not execute an activation or purchase. TPM is interpreted as external API transactions/requests per minute, using the existing sliding-window contract. Stream messages, expensive-query bounds and replay retention require separate configured policies.

Configured arithmetic uses exact integer paise.

```text
recurring subtotal = annual licence + selected annual SSO + selected annual API
purchase-year subtotal = recurring subtotal + newly purchased combined branding
comparable renewal subtotal = recurring subtotal
```

At 1,200 students on Enterprise with API and SSO, the purchase-year fixed subtotal and comparable renewal are both ₹4,10,000, including the ₹10,000 annual Enterprise API fee; white-label apps are included in Enterprise. On Growth, new branding adds ₹25,000 once. The first branding purchase can occur in a later subscription year. Existing valid branding adds zero setup cost on ordinary renewal or a platform-plan change. Formal quotes must derive paid entitlement from trusted billing records.

The public policy owns the approved plan-specific annual fees and limits. The shared golden fixtures retain a separately labelled synthetic uniform fee and limits to exercise configurable arithmetic. Tests also cover the approved public fees and exact purchase/renewal results for all plans. A missing plan fee still produces an explicit incomplete subtotal and suppresses a total-price recommendation. Selected unknown API price keeps tax-inclusive totals unknown, even when a test tax policy is supplied.

Selecting API access alone does not require an upgrade. Plan-specific API fees participate in total-cost ranking alongside configured usage charges. The engine accepts an optional declared peak request count and rolling-window duration. It compares that peak against approved limits for the same window. A different window is unassessed because averaging cannot establish burst fit. Missing limits produce an incomplete-capacity state. No fitting plan produces `unmet_api_capacity` and a null recommendation. A known-suitable alternative is distinguished from alternatives whose limits are unconfigured.

Optional SSO and branded apps require Growth or Enterprise. Eligibility is checked before API-capacity and cost comparisons. A manually selected incompatible Starter combination remains editable but cannot produce a shareable or printable quote. Previously purchased branding carries its one-time charge history while still requiring an eligible plan.

The public peak field is offered only when all three approved limits share a known window. Manual selection retains its plan and shows insufficient/unassessed capacity. Re-enabling automatic comparison reevaluates the same inputs. The selected plan’s annual API fee is applied once to purchase-year and renewal calculations. Different fees may change the lowest-cost plan when comparing configured usage costs. AIC, communication and custom-service uncertainty remains visible independently.

Shared links encode validated aggregate inputs and the current policy version. Earlier versions show a stale-estimate notice. Historical quotes retain their original records and policy version.

## Backend interfaces and invariants

### Read-only resources

Reuse existing application services and authorization. Version approved resources, bound filters and cursor pagination, and state consistency semantics. Restrict fields and campus scope at query time, including aggregates. Internal database schemas and arbitrary query execution remain behind the service boundary.

### Durable history and live subscriptions

Publish a curated external event schema with stable IDs, types, schema versions, occurrence time, resource ID/version and authorization context. Reuse an atomic event capture mechanism such as a transactional outbox. Core transaction commit and internal event processing are independent of external acknowledgements.

History supports polling after an opaque cursor. WebSocket delivery uses the same catalogue and permission semantics, with bounded buffers, heartbeat, resumable checkpoints and controlled reconnect. Document at-least-once recovery and the actual ordering scope. Consumers deduplicate and checkpoint after successful processing. A socket transports events from durable history.

Bind cursors to tenant, consumer and compatible filters. Recheck current permissions for reads and deliveries. Snapshot-to-history and polling-to-live handoffs need tested watermarks and reconciliation under concurrent changes. Expired cursors return `CURSOR_EXPIRED` with explicit resynchronization. Resynchronization restores available current state, subject to retention. Define missing/global campus scope and deletion events.

### Identity and entitlement

Use school-admin-controlled integration identities, independent of paid SSO. Derive tenant and active entitlement server-side. Apply campus/resource/action/field permissions, rotation and revocation, including already-open sockets. Validate browser origins, subscription messages and frame sizes. Use a supported machine-client or browser authentication flow with redacted credentials. First-party quota exemptions require server-verifiable identity. Logs contain operational identifiers and bounded diagnostics.

### Sliding-window admission

For an approved limit R over duration W, count admitted external requests in `(t - W, t]`. Admit the next request only when `count + 1 <= R`. Admission, pruning and recording are atomic in one authoritative shared limiter. Use collision-safe request identities, a trusted clock and bounded TTL/state. Approximate windows require an approved error bound.

Shared history survives key rotation, reconnects, deployments and plan changes. Different-window transitions retain enough history or use an approved conservative transition. Denied requests use independent abuse controls and do not prolong the admitted-request window. Define which admitted operations count and how retries/backend failures affect capacity. Limit failures use an explicit bounded degradation policy. An unavailable limiter has a distinct service-unavailable response.

Actual exhausted HTTP capacity returns non-cacheable 429 with the structured rate-limit code, real limit/window context and `Retry-After` based on the earliest viable retry across all blocking constraints. It is an opportunity to retry. Entitlement failures and service failures use their own responses.

### Streaming and expensive work

Enforce separately configured limits after WebSocket upgrade for connections, control messages, subscriptions, events/bytes, replay work, buffered/unacknowledged data and expensive queries. Coordinate replay/live scheduling and isolate slow consumers. Apply query complexity, page size, response bytes, timeouts and concurrency bounds. Use resumable throttle/control messages and closes after upgrade. Preserve the last durable processed checkpoint when throttling or disconnecting.

## Dependency-ordered backend acceptance backlog

1. **Verify existing contracts and policy ownership.** Locate actual resource/event APIs, integration identity, entitlement, outbox and shared-limiter facilities. Verify the owner-approved release status, catalogue and 250/500/2,000-request sliding 60-second windows against implementation. Confirm counting rules, stream bounds, replay retention and billing timing. Keep existing security-review gates.
2. **Implement identity and resource scoping.** Test tenant/campus/field isolation, aggregate leakage, credential rotation/revocation, purchase expiry and spoofed first-party identities. Verify standard/branded apps, exports and native provider callbacks remain independent.
3. **Establish durable synchronization.** Test commit/rollback/restart capture, deduplication, deletion events, snapshot/history handoff, polling/live transitions, opaque cursor integrity and explicit expiry/resync. Isolate external backlogs from internal processing.
4. **Enforce shared rolling-window admission.** Test the exact cutoff, equal timestamps, concurrent final-slot admission across replicas/keys, collision-safe request IDs, pruning/TTL, denied-attempt recovery, realistic Retry-After, policy transitions and limiter outages.
5. **Bound live streaming and queries.** Test slow consumers, bounded buffers, reconnect storms, replay scheduling, post-upgrade throttling, expiration/revocation of live sessions, payload/egress/concurrency bounds and durable checkpoints.
6. **Connect trusted billing entitlements.** Recompute quotes server-side, reject stale policies and ignore submitted totals. Test the selected plan’s annual API fee per institutional service period and idempotent branding purchases across renewals/plan changes. Apply approved mid-term/cancellation terms.

These acceptance items await execution in the owning backend repositories. This change runs estimator, content and browser tests only.

## Incremental UI corrections and verification

The selected plan uses Base UI's actual `data-pressed` state with contrasting fill and text. The same treatment serves the product calculator and shared toggle consumers. Starter, Growth and Enterprise have distinct Lucide line icons, reused in the selector and comparison cards.

Enrolment is a formatted number button beside the slider. Clicking it opens the integer editor and selects its value. Enter commits and returns keyboard focus to the number button. Clicking elsewhere commits without moving focus away from the clicked control. Invalid quantities retain their validation state. The normal range has 100, 2,500, 5,000 and 10,000 landmarks. Typing 105,000 expands the maximum to 200,000 and uses compact tick labels. Slider dragging preserves that scale. Restored estimates derive it from the saved count.

Verification commands used for this correction follow.

```sh
bun run test
bun run check-types
bun run lint
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s tests -p 'test_*release*.py'
NEXT_PUBLIC_CONTACT_ENDPOINT=/api/contact NEXT_PUBLIC_FAIRHELM_CONTACT_ENABLED=true bun run build
bun run --cwd tools/quality test:browser tests/pricing-studio.spec.ts tests/contact-human-check.spec.ts --project=phone-390 --project=desktop-1440
```

SquareCampus has 131 passing tests, including 27 API and interaction cases for API pricing, capacity, larger slider ranges and the 50-lakh maximum. Workspace tests and type checks pass. Lint passes with existing warnings. The release suite passes 34 tests. All five applications build, with 22 social-preview checks, 87 canonical pages, and 10,870 links/assets in the 145-page export graph passing.

All twenty-six browser cases pass on phone and desktop. Coverage includes light/dark plan highlights, icons, inline enrolment editing, Enter and blur, exact slider values above 10,000, shared count restoration, the inclusive 50-lakh ceiling, plan-specific API totals, print disclosure, manual capacity warnings, automatic selection at each published threshold, all five usage sliders, exact shared quantities, visible slab cards above 1,000 students, highlighted assumptions, Growth-only add-on eligibility, incompatible manual/shared selections and the existing contact retry flow. Public API fees and throughput boundaries have direct regression coverage. Synthetic fixtures additionally cover unknown prices, unknown limits and uniform-fee arithmetic. Backend quota and streaming acceptance remains in the ordered backlog above.

The preceding v2 default-page captures measured approximately 2.50 screens at 390×844 and 2.70 screens at 320×844. Version .4 also passes horizontal-overflow checks at 320 and 390 pixels with API options expanded. The 50,00,000-student maximum uses compact tick labels. Counts above that ceiling retain an error and suppress the estimate. Pricing and shared-link validation use the same canonical maximum.

Local logs and screenshots are under `/tmp/squarecampus-pricing-studio/`. Version .4 uses the `api-approved-` log prefix and `api-approved-phone.png` capture. Earlier captures use the `api-v2/` directory. The active browser preview is `http://localhost:3100/pricing/`.

## Engineering references

- Atomic event capture uses the transaction boundary described by the outbox pattern. [AWS guidance](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html)
- Authentication, authorization, message validation and connection lifecycle need explicit WebSocket handling. [OWASP guidance](https://cheatsheetseries.owasp.org/cheatsheets/WebSocket_Security_Cheat_Sheet.html)
- Shared sliding-window admission requires atomic coordination. [Redis guidance](https://redis.io/docs/latest/develop/use-cases/rate-limiter/java-lettuce/)
- HTTP quota exhaustion is represented by 429. [RFC 6585 section 4](https://www.rfc-editor.org/rfc/rfc6585.html#section-4)
- Established WebSocket protections extend beyond the HTTP handshake. [Kestrel guidance](https://learn.microsoft.com/aspnet/core/fundamentals/servers/kestrel/security-considerations)
