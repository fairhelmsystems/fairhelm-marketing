# AIC commercial catalogue v3

This is the historical fixed-pack catalogue. The owner superseded its purchase and SSO rules with policy `2026-11-09.8` and graduated catalogue `2026-11-09.v4`. Current rules are recorded in `pricing-studio.md`.

The adopted AIC catalogue is `2026-11-09.v3`. The combined public pricing policy is `2026-11-09.7`. This is a local pricing, catalogue and UI implementation. Actual purchases, wallet changes and deployment are outside this update.

## Source precedence

The supplied v3 Markdown and JSON replace earlier AIC pack prices, rollover assumptions, customer cost-conversion formulas and linear forecasts. The owner waived the missing CODEX_PROMPT.md and separate Python-validator/golden-fixture bundle. The repository tests use the worked examples in the supplied Markdown.

The user's later commercial decisions govern non-AIC fields. Optional Entra SSO and white-label apps remain eligible on Growth and Enterprise; Enterprise includes white-label apps. API fees remain ₹2,500/₹5,000/₹10,000 yearly and request limits are 250/500/4,000 per sliding 60-second window. The attachment's older all-plan SSO/branding and unconfigured uniform API fields were excluded from the merge.

## Public catalogue

| Pack | AIC | Unit price | Prepaid price excluding GST |
| --- | ---: | ---: | ---: |
| aic_1000 | 1,000 | ₹5 | ₹5,000 |
| aic_5000 | 5,000 | ₹4 | ₹20,000 |
| aic_10000 | 10,000 | ₹3 | ₹30,000 |
| aic_50000 | 50,000 | ₹2 | ₹1,00,000 |
| aic_100000 | 1,00,000 | ₹1.50 | ₹1,50,000 |
| aic_250000 | 2,50,000 | ₹1 | ₹2,50,000 |

All packs have equal plan eligibility and support repeated purchases. Pricing applies to the chosen pack in that transaction. The largest pack is a purchase option, without imposing a maximum wallet balance. Purchase quantities are whole numbers, money is integer paise and balances use milli-AIC.

## Quote and forecast arithmetic

Selected prepaid packs add once to the purchase-year amount. The fixed subscription and comparable renewal remain separate. At 1,200 students on Enterprise with SSO, included branding and one 10,000-AIC pack, the fixed purchase-year subtotal is ₹4,00,000, the amount with the selected pack is ₹4,45,000 and comparable renewal is ₹4,00,000. These figures exclude GST and other usage.

The monthly projection consumes included grants first, expires unused included amounts and carries purchased balance. Its public assumptions are constant declared demand for 12 months, zero opening purchased balance before selected packs, and no purchased expiry within the horizon. The inherited 0/150/250 flat plan grants are explicitly conditional. Manual packs fund the projection before further pack purchases are suggested, preventing duplicate purchase cost.

The forecast suggests a minimum-cost pack cover purchased upfront. That schedule is a planning assumption and supplies no purchasing consent. An authenticated implementation must substitute verified balances, lot validity and the approved billing-cycle anchor.

### Exact bounded pack-cover algorithm

All pack sizes are multiples of 1,000 AIC. For a smaller size d and largest size L, L/gcd(L,d) smaller packs can be replaced by an exact number of largest packs at strictly lower cost. Therefore an optimum has a bounded total from smaller packs. The implementation computes that bound from the catalogue, removes only bulk packs guaranteed to occur in an optimum, and uses exact dynamic programming over the remaining bounded range.

The cover compares spend, then unused credits, then purchase count and stable catalogue order. It does not use a greedy largest-pack approximation. Tests compare the result against an independent full-range dynamic program, including needs beyond the bounded table.

Worked examples include 1,001 AIC for ₹10,000, 6,000 for ₹25,000, 9,000 for ₹30,000, and 2,50,001 for ₹2,55,000. At 1,000 students and 400 AIC/month, annual AIC purchase suggestions are ₹20,000/₹15,000/₹10,000. Resulting subscription-plus-AIC spending is ₹1,95,000/₹2,40,000/₹3,60,000, so Starter wins that scenario.

## Quoted operation charges

`calculateOperationAic` produces a charge proposal from an accepted quote ID, tariff version, scope fingerprint and milli-AIC amount. Supported quotes are positive and capped at 10 AIC. A valid completed zero-match result is chargeable. Authorization denial, platform failure, reopening and unapproved partial work propose zero. An absent accepted quote returns an explicit unconfigured result.

`calculateProviderCost` retains exact internal telemetry and FX/cache accounting. Its output does not calculate customer credits. Provider retries and costs cannot silently reprice an accepted operation.

## Unresolved configuration

- Exact workflow-to-tariff map and operation tariff version.
- Final interpretation of the inherited flat included allocations and Starter's zero grant (now stated publicly as no included AIC).
- Purchased-credit validity, cancellation, refunds and transfers.
- Actual checkout release status and purchasing integration.
- Internal model/operation budgets, approved Foundry deployment allowlist and measured quality routing.
- WhatsApp category/destination tariffs, final invoice tax treatment and mid-term commercial rules.
- External API stream/query bounds and replay retention.

## Backend acceptance backlog

1. Reconcile existing catalogue, quote, billing entitlement, purchase and wallet APIs. Preserve historical rate-card versions, paid lots and quotes. Activate a new checkout only after its validity and cancellation terms are approved.
2. Implement or verify authorized purchase handling with immutable pack price/version snapshots and idempotent purchase credits. Accept only server-owned catalogue prices. Require explicit administrator authorization for any auto-purchase and spending cap.
3. Verify monthly grants against the approved cycle and timezone. Grant/reset must be idempotent. Included credits expire and purchased lots survive. Plan changes must not issue duplicate grants.
4. Reserve quoted AIC atomically against the tenant's included balance first and then deterministic purchased lots. Concurrent requests must not spend the same balance. Bind reservations to the original grant and lots across reset boundaries.
5. Bind scope, authorization and quote acceptance to the operation. Validate the exact approved tariff and cap server-side. Recheck Neo4j RBAC and downstream tenant/campus/field scopes at each tool boundary. Changed objectives require a fresh quote.
6. Settle once after validation and delivery of a completed result. Deduplicate client/network retries by operation ID. Release failed, denied or unapproved partial work to its original lots. Releasing an expired included reservation must not create a new spendable grant.
7. Bound the existing Microsoft Foundry, RefRAG and ClickHouse execution path by calls, tokens, reasoning, scans, time and repair attempts. Keep actual provider costs and budgets private. Validate constrained presentation schemas and approved SSR components.

The marketing tests do not execute distributed ledger concurrency, actual grant jobs, production RBAC, Foundry requests or provider-margin evaluations. Those acceptance cases belong to the owning repositories.

## Verification

Repository cases cover the six prices, pack combinations, exact cover and ties, very large needs, monthly expiry/carry, manual-pack reuse, quoted charges, invalid input and shared links. Browser checks cover mobile/desktop selection, print, restored packs, validation and the supplied annual example. Final command results and screenshots are recorded with the `v3-` prefix under `/tmp/squarecampus-pricing-studio/`.

### Final results

- SquareCampus tests passed, 140/140. The workspace test run also passed all six test tasks.
- Workspace type checks passed, 12/12 tasks. Lint passed, 9/9 tasks, with existing warnings.
- All five applications built. Export validation checked 87 canonical pages and 10,872 owned links/assets with zero failures. Workspace dependency-boundary and diff-whitespace checks passed.
- The final browser run passed 33 cases with one intentional skip. The phone-only height check is skipped for the desktop project. Coverage includes both themes, plan selection, add-on eligibility, the 50-lakh limit, all six packs, share restoration, invalid quantities, print, the golden example and local contact-verification retry fixtures.
- Hallmark rendered five views and reported zero failures, zero warnings and zero open reflex findings. Existing recorded waivers and craft notes remain.

The first local build lacked a contact endpoint. Email-draft mode built successfully, but the additional contact-verification browser cases require the fixture-compatible intake configuration. Final builds and browser checks used the repository CI pattern, `NEXT_PUBLIC_CONTACT_ENDPOINT=/api/contact`, plus `NEXT_PUBLIC_FAIRHELM_CONTACT_ENABLED=true`. Browser routes intercepted the synthetic form requests. These values apply to the local build only.

The closed pricing page measures 2,108px at 390×844, or 2.498 screens. At 360×844 it measures 2,125px, or 2.518 screens. At 320×844 it measures 2,282px, or 2.704 screens. All three widths have zero horizontal overflow. Phone disclosure targets retain at least 44px height. Expanded packs and forecasts increase page length.

Rendered captures are `v3-phone.png`, `v3-phone-packs.png`, `v3-phone-estimate.png`, `v3-packs.png`, `v3-desktop.png` and `v3-print.png`. `v3-visual-qa.json` records the measurements, verified golden totals and zero runtime page errors. Command logs use the `v3-final-` prefix.

### Implementation files

Paths below are relative to the workspace root.

- `packages/squarecampus-content/src/pricing-policy.json` owns the combined policy and pack catalogue. `pricing-fixtures.json` carries the updated reference cases.
- `packages/squarecampus-content/src/aic-packs.ts`, `pricing.ts` and `aic-cost.ts` own pack purchases, exact cover, monthly projections, plan comparisons and accepted-operation charges. `commercial.ts` owns the shared public explanations.
- `apps/squarecampus/src/lib/pricing-estimate.ts` owns validated form state, explicit pack selections and share/enquiry serialization.
- `apps/squarecampus/src/components/pricing/aic-pack-picker.tsx`, `pricing-studio.tsx`, `src/app/(company)/pricing/page.tsx` and `src/app/globals.css` present the catalogue, totals, forecast and compact phone layout.
- `apps/squarecampus/tests/aic-catalogue-v3.test.ts` and the existing pricing/commercial tests exercise the public model. `tools/quality/tests/pricing-studio.spec.ts` verifies the rendered interactions and reference phone height.
- This document and `apps/squarecampus/docs/pricing-studio.md` record commercial precedence, assumptions and follow-up boundaries.
