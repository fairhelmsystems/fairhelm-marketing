---
policy_version: "2026-11-10.1"
as_of: "2026-11-10"
currency: INR
billing_period: annual
deployment: standard_managed_cloud
canonical_policy: packages/squarecampus-content/src/pricing-policy.json
---

# SquareCampus backend pricing handoff

Import policy `2026-11-10.1` as a versioned record. Store its version on every quote, purchase and subscription. The tables below use the canonical JSON field names and stable plan IDs. Earlier pricing briefs are historical references. The linked policy and current commercial facts define this handoff. [Canonical policy](../../../packages/squarecampus-content/src/pricing-policy.json) [Commercial facts](../../../packages/squarecampus-content/src/commercial.ts)

## 1. Units and plan identity

- Store INR amounts as integer **paise**, where `100 paise = ₹1`.
- Store AIC as integer **milli-AIC**, where `1000 milli-AIC = 1 AIC`.
- Store communication balances as integer **subcredits**, where `3 subcredits = 1 communication credit`.
- Stable IDs are `starter`, `pro` and `enterprise`. The public name of `pro` is **Growth**.
- Standard subscriptions are billed annually. The minimum is 100 enrolled students. The estimator supports up to 5000000 students and enforces safe-integer arithmetic.
- Every plan includes generally available core modules, multi-campus eligibility, baseline security, standard apps and supported self-service exports. Staff accounts have no separate per-staff licence fee. Permissions and release availability apply.

## 2. Annual student licence

`studentSlabs[].ratesPaise` is the annual rate for each student inside that slab. Apply **graduated marginal slabs** within the billed subscription.

| Student positions | `upTo` | `starter` paise/student/year | `pro` paise/student/year | `enterprise` paise/student/year |
| --- | --- | --- | --- | --- |
| 1–1000 | 1000 | 17500 | 22500 | 35000 |
| 1001–5000 | 5000 | 15000 | 19000 | 25000 |
| 5001 onward | null | 11000 | 15000 | 20000 |

```text
annualLicencePaise = sum(studentsInsideSlab × ratePaiseForPlan)
```

At 1200 students, annual licences are ₹205000 on Starter, ₹263000 on Growth and ₹400000 on Enterprise, excluding GST. Growth in enrolment follows the agreed true-up. Reductions are normally considered at renewal.

## 3. Optional services

All monetary values in this table are integer paise.

| Canonical field | Billing | `starter` | `pro` | `enterprise` |
| --- | --- | --- | --- | --- |
| `addOns.entraSsoAnnualPaise` | Annual, selected optionally | 250000 | 250000 | 0 |
| `addOns.annualDataEventsApiPaise` | Annual, selected optionally | 250000 | 500000 | 1000000 |
| `addOns.whiteLabelAndroidAndIosOncePaise` | Combined Android + iOS setup, once | Ineligible | 2500000 | 2500000 |

Microsoft Entra SSO is optional on every plan. Enterprise has the same price with activation selected or declined. Customers supply their Entra tenant and Microsoft licences. Technical onboarding applies.

Standard mobile apps have no additional app licence fee. White-label setup is charged once, with prior ownership derived from trusted billing history. Branding survives ordinary renewals and plan changes. Fairhelm owns the publisher accounts. Store fees and maintenance terms require confirmation.

### Data & Events API limits

| Stable plan ID | `slidingWindows.requests` | `windowSeconds` |
| --- | --- | --- |
| `starter` | 250 | 60 |
| `pro` | 500 | 60 |
| `enterprise` | 2000 | 60 |

Use one rolling/sliding window per billed institution across keys, campuses, clients and replicas. The supported catalogue is the same on every plan, subject to authorization. `automaticOverageCharges = false`. Native workflows, first-party apps and authorized self-service exports operate independently of this external API add-on.

## 4. Monthly communication wallet

`communication.monthlyCreditsPerStudent` defines the shared institution-wide grant.

| Plan ID | Credits per enrolled student/month | At 1200 students | Ledger subcredits at 1200 students |
| --- | --- | --- | --- |
| `starter` | 3 | 3600 | 10800 |
| `pro` | 6 | 7200 | 21600 |
| `enterprise` | 9 | 10800 | 32400 |

| Consumption or purchase | Canonical value |
| --- | --- |
| One billable SMS recipient segment | `smsRecipientSegmentSubcredits = 3` |
| One recipient email | `recipientEmailSubcredits = 1` |
| One additional purchased communication credit | `purchasedCreditPaise = 25` |
| WhatsApp category/destination weights | `whatsappWeightsSubcredits = {}`, unconfigured |

Count each recipient and each billable SMS segment. Included balances reset at the contractual monthly boundary with `includedRollover = false`. Purchased balances carry forward. One communication credit funds one SMS recipient segment or three recipient emails. Central email transport uses platform sender configuration. Fee payments use the institution’s own payment-gateway account and its provider charges.

## 5. Monthly AIC pool and prepaid AIC

| Plan ID | Included AIC/month | `monthlyIncludedMilliAic` | Approval |
| --- | --- | --- | --- |
| `starter` | 0 | 0 | Proposed |
| `pro` | 1500 | 1500000 | Confirmed |
| `enterprise` | 2500 | 2500000 | Confirmed |

These are shared tenant-wide monthly pools. `staffMultiplierEnabled = false`. Included AIC expires monthly and is consumed before purchased AIC. Purchased AIC carries forward. The legacy global `aic.allowancesApproved` flag is false while Starter’s allocation is proposed. The accompanying `allowanceStatus` identifies the confirmed Growth and Enterprise pools. Preserve these per-plan approval states during ingestion.

A prepaid purchase is a **one-time whole-AIC quantity** available on every plan. Zero represents an omitted purchase. A selected purchase has a minimum of **1000 AIC**. Its charge is independent of a monthly burn forecast or assumed consumption schedule. Renewal excludes an automatic repeat purchase.

### Graduated purchase bands

Each `unitPricePaise` applies only to credits inside its band in the same purchase.

| Credit positions in one purchase | `volumeBands.upTo` | `unitPricePaise` per AIC |
| --- | --- | --- |
| 1–5000 | 5000 | 500 |
| 5001–10000 | 10000 | 400 |
| 10001–50000 | 50000 | 300 |
| 50001–100000 | 100000 | 200 |
| 100001–250000 | 250000 | 150 |
| 250001 onward | null | 100 |

Examples before GST are **1000 AIC for ₹5000**, **10000 AIC for ₹45000** and **250000 AIC for ₹490000**.

### Operation charging

One accepted analytical objective has a versioned, scoped quote before execution. The quote covers access checks, retrieval, analysis, table, chart, summary and first render as one operation. The general guide is approximately 1–3 AIC for routine supported operations, with a maximum of 10 AIC for a supported operation. Exact operation tariffs require configuration.

- Persist `quoteId`, `tariffVersion`, `scopeFingerprint` and positive `chargeMilliAic`, capped at 10000.
- Reserve the accepted amount before substantive execution and settle it once after a validated completed answer. A valid zero-match answer can complete under its accepted quote.
- Access denials, platform failures, unapproved partial work, reopening and sorting an existing answer have zero additional AIC charge. Release reservations on failure and use idempotent retry/settlement records.
- A new analysis or changed scope receives a fresh quote. Internal model calls and repairs stay within the accepted charge. Provider costs are accounted separately.
- SMS, email and WhatsApp consumption uses the separate communication wallet.
- The three website walkthroughs contain authored sample data and null scenario tariffs. The conditional 2-AIC explanation illustrates an accepted quote.

## 6. Tax, purchase year and renewal

Domestic estimates use `tax.basisPoints = 1800`, representing 18% GST. Prices exclude GST. Apply `half_up_per_line` rounding to integer paise.

```text
recurringFixedPaise = annualLicencePaise + selectedSsoAnnualPaise + selectedApiAnnualPaise
purchaseYearPaise = recurringFixedPaise + newBrandingPaise + selectedPrepaidAicPaise
renewalPaise = recurringFixedPaise
taxForLinePaise = floor((linePaise × 1800 + 5000) / 10000)
```

Sum the separately rounded tax lines. Recompute prices server-side under the selected policy version. Invoices follow verified billing details and the applicable CGST/SGST or IGST treatment. The invoicing entity is **FAIRHELM SYSTEMS (OPC) PRIVATE LIMITED**, GSTIN **29AAHCF1819L1ZA**.

A 1200-student Enterprise purchase with API, optional SSO, new white-label setup and 10000 prepaid AIC totals **₹480000 before GST**, **₹86400 estimated GST**, and **₹566400 including GST**. Comparable renewal is **₹410000 before GST** and **₹483800 including estimated GST**.

## 7. Programme exceptions and pending configuration

| Item | Backend treatment |
| --- | --- |
| Standard implementation and support | Included on every plan |
| Best-effort migration | Included on Growth/Enterprise against usable source exports. Starter migration has separately agreed fees |
| Selected launch pilot | Approved, scoped 90-day complimentary subscription/onboarding/reasonable support. Eligibility and consumption boundaries are recorded before activation |
| Founding Institutional Partner | Two positions, one school and one university. Protected 40% Enterprise commercial discount and waived standard white-label charge follow the executed agreement |
| Founding pilot | Paid, scoped 60–90-day engagement with written fees and conversion terms |
| Bespoke services, custom SLA, specialized deployment | Require an approved commercial record with explicit scope and price |

The founding agreement defines discount basis, duration and other privileges. Programme admission and benefits require their approved agreement records. The standard calculator uses the published plan rates and optional-service fees.

Retain the following unconfigured values as `null` or the canonical empty map, with activation dependent on their required approved terms.

- AIC `operationTariffVersion`, `operationTariffs`, `purchasedExpiryPolicy`, `cancellationRefundTransferPolicy` and `checkoutStatus`.
- API `streamAndQueryLimits`, `replayRetention` and `midTermAndRenewalTerms`.
- WhatsApp category/destination weights.
- White-label `storeFeeScope` and `maintenanceScope`.

Use an idempotent upsert keyed by policy version and stable plan/service/band identity. Preserve the policy used by existing signed commercial records. Validate current quantities, eligibility, prior paid branding and quote acceptance from trusted backend records before activating entitlements or debiting either wallet.
