# SquareCampus Pricing Studio

The owner’s Pricing Studio brief dated 9 November 2026 supplies the annual rates and standard add-ons. This implementation is a static marketing estimator with an editable handoff into the existing demo enquiry. It has no invoice authority.

## Commercial source and stable identifiers

The canonical public policy is `packages/squarecampus-content/src/pricing-policy.json`, version `2026-11-10.2`. The browser and static `/pricing-policy.json` response import the same file. Amounts use integer paise. `pricing-fixtures.json` supplies shared golden examples for a future Java implementation. The Data & Events API v2 delta is documented in `data-events-api.md` and supersedes the earlier API addendum. The owner's subsequent calculator maximum is 50,00,000 students. Version .4 adds approved plan-specific API fees, 60-second sliding-window limits and owner-confirmed activation readiness.

The public plan names are Starter, Growth and Enterprise. The stable identifiers remain `starter`, `pro` and `enterprise`. Historical `pro` records need no migration for this display-name change.

Every generally available module and feature has equal subscription-plan eligibility. Campus count, core governance, analytics and API interest do not require an upgrade. Entra SSO is optional on every plan and included in the Enterprise licence. White-label apps are included in Enterprise and cost ₹25,000 once on Growth. A declared API peak can affect suitability when approved sliding-window limits establish capacity. Permissions, institutional scope, tenant isolation, consent, approvals and usage controls still apply. Preview or unavailable capabilities require explicit confirmation.

Standard implementation and support remain included. Best-effort migration against usable source exports remains included on Growth and Enterprise and separately quoted on Starter. A migration requirement therefore needs a scoped comparison before its total cost can be ranked. The calculator’s custom-service checkbox makes this uncertainty explicit.

### Annual student rates

| Slab | Starter | Growth | Enterprise |
| --- | --- | --- | --- |
| First 1,000 | ₹175 | ₹225 | ₹350 |
| Students 1,001–5,000 | ₹150 | ₹190 | ₹250 |
| Students beyond 5,000 | ₹110 | ₹150 | ₹200 |

The owner’s follow-up sets a minimum of 100 enrolled students per billed subscription. Inputs below that minimum are rejected. At the minimum, annual licences are ₹17,500 Starter, ₹22,500 Growth and ₹35,000 Enterprise, before GST and optional services. All figures are per student per year and exclude applicable GST. Only students within a slab receive its rate. Student counts aggregate within the same billed institutional subscription. Aggregation across unrelated subscriptions or legal entities requires an agreed policy.

Data & Events API access costs ₹2,500/year on Starter at 250 requests per rolling minute, ₹5,000/year on Growth at 500, and ₹10,000/year on Enterprise at 4,000. The selected fee recurs in purchase-year and comparable renewal totals. API access alone cannot require a plan upgrade, while a declared peak above a plan’s throughput can affect suitability.

Microsoft Entra SSO integration and maintenance costs ₹2,500 each year on Starter and Growth. Enterprise includes optional SSO in its licence, with the same price whether the customer activates it or not. The institution supplies its own Entra tenant and Microsoft licences. White-label Android and iOS branding costs ₹25,000 once on Growth and is included in Enterprise. Previously purchased branding is not charged again. Renewal excludes new one-time branding and assumes unchanged enrolment, plan, rates, services and tax treatment.

Standard apps for staff, parents and students have no additional app licence fee. Staff accounts have no separate per-staff licence charge. Subscription-backed functionality requires an active subscription. Fairhelm Systems owns the publisher accounts for standard and white-label mobile apps. Store fees and white-label maintenance scope require confirmation before purchase.

### Unresolved fields

| Field | Implementation treatment |
| --- | --- |
| Growth 1,500 / Enterprise 4,000 monthly AIC | Confirmed flat tenant pools. Starter includes none |
| Starter zero included AIC | Proposed default, with generally available AEGIS eligibility and future paid usage |
| Per-staff multiplication | Disabled |
| Customer operation tariff map | Unconfigured, a versioned accepted quote is required |
| Purchased AIC | Custom whole-credit quantities from 1,000 AIC, using graduated catalogue `2026-11-09.v4` |
| AIC rollover | Included expires monthly and purchased carries forward |
| Purchased validity, cancellation, refunds and transfer | Unconfigured, monthly carry-forward does not imply lifetime validity |
| WhatsApp category and destination weights | Empty public tariff map, positive demand produces an incomplete estimate |
| Additional capacity or service-depth limits | No invented quantities |
| Domestic GST estimate | Owner-approved 18%, rounded half-up per line in integer paise. Final invoice treatment follows verified billing details |
| Mobile-app publisher | Fairhelm Systems owns the publisher accounts for standard and white-label apps |
| App-store fees and maintenance | Scope confirmation required before purchase |

The approved pilot and founding-programme wording is retained, including their distinct durations and commercial treatment.

## Calculation contract

`calculateLicence` validates an integer student count of at least 100, computes each progressive slab and sums exact paise. `calculateFixedEstimate` adds annual SSO and newly purchased branding separately. It returns first-year and renewal fixed subtotals. A supplied unsupported pricing version fails.

The input’s owner-approved enrolment maximum is 5,000,000 (50 lakh). Monthly usage inputs support up to 1,000,000,000 units and AIC accepts three decimal places. These bounds protect arithmetic and usable input handling. The slider starts at 100–10,000 students, with a formatted number label to its right. Clicking the label opens the integer editor. Enter or clicking outside commits the edit. A larger typed count expands the maximum and tick labels to a rounded ceiling within the 50-lakh bound. For example, 105,000 uses a 200,000 maximum. The scale stays fixed during dragging and is recomputed by a numeric-field edit or shared-estimate restoration.

Effective per-student and monthly-equivalent prices are rounded only for display using integer arithmetic. They never reconstruct totals. Monthly equivalents refer to the licence and remain billed annually. No monthly billing option or discount percentage is implied.

`taxPaise` uses integer paise and half-up per-line rounding. The owner approved an 18% domestic GST estimate. The public calculator shows the estimated tax and tax-inclusive purchase-year and renewal amounts separately. The underlying pure function still accepts an explicit null tax policy to represent an unconfigured tax calculation. Final invoice classification, place of supply and CGST/SGST or IGST split require verified billing details.

### Communication forecast

The monthly included communication pool is three credits per enrolled student on Starter, six on Growth and nine on Enterprise. One credit is three subcredits. A recipient email consumes one subcredit, and a billable SMS recipient segment consumes three. Long or Unicode SMS may have several segments. WhatsApp weights are supplied per approved category and destination version.

`projectCommunication` consumes the monthly grant before purchased subcredits. Unused included grant expires at the next contractual monthly reset. Purchased subcredits carry forward across forecast months. Whole-credit purchases cost 25 paise each and retain their unused subcredits. The calculator begins with no purchased balance and repeats the entered demand for twelve months. It does not assume an institution’s actual wallet balance.

For 100 enrolled students and 301 recipient emails in each of three months, the forecast buys one credit for 25 paise in month one. The remaining purchased subcredits cover the shortfalls in months two and three. Independently rounding monthly top-ups would overstate the cost.

At 1,000 students, the same shared pool can cover 3,000 recipient emails when used entirely for email. The brief’s mixed example of 100 SMS recipient segments, 100 one-credit WhatsApp messages and 900 recipient emails consumes 500 credits, conditional on that WhatsApp tariff being approved. The one-credit WhatsApp weight exists only as a synthetic test fixture in this checkout.

Missing WhatsApp weights return an incomplete result. A positive unpriced quantity cannot become a free message or default one-credit message. Paid automatic overage requires administrator opt-in and a spend cap. Essential authentication and recovery messages require a separately defined policy so wallet depletion cannot accidentally prevent sign-in.

### AEGIS AI Credit allocation and consumption

Catalogue `2026-11-09.v4` replaces the fixed packs with customer-chosen whole-credit quantities, starting at 1,000 AIC. Each purchase is priced progressively. The first 5,000 AIC cost ₹5 each, the next 5,000 ₹4 each, credits 10,001–50,000 ₹3 each, 50,001–1,00,000 ₹2 each, 1,00,001–2,50,000 ₹1.50 each and subsequent credits ₹1 each. Only credits inside a band receive its rate. A 10,000-AIC purchase costs ₹45,000 before GST. The inherited flat monthly pools are 0, 150 and 250 AIC on Starter, Growth and Enterprise. Their allocation interpretation remains a working policy. Included credits expire each monthly cycle and purchased credits carry forward. No staff multiplier or annual pregrant is introduced.

`aic-packs.ts` owns graduated purchase arithmetic and monthly forecasts. A chosen prepaid quantity contributes once to the purchase-year estimate and funds its forecast. A separate hypothetical purchase covers any remaining deficit, rounded upward to whole credits and the minimum purchase. Renewal does not automatically repeat either purchase. The forecast assumes unchanged monthly demand, zero opening paid balance before chosen credits and no purchased expiry within the planning horizon.

`aic-cost.ts` separates accepted operation charges from internal provider telemetry. Customer charges use the accepted, scoped, versioned quote, capped at 10 AIC for a supported operation. Unknown tariffs produce an unconfigured result. Denied, failed, reopened and unapproved partial work produces no proposed debit. Provider costs retain exact rational arithmetic, cache accounting and versioned exchange conversion, without calculating customer credits from provider cost.

The historical fixed-pack catalogue and its backend work are retained in `aic-catalogue-v3.md` and are superseded by the v4 purchase rules above. The marketing estimator has no ledger or inference side effects. Reservation, grant/reset idempotency, concurrent overspend, cross-reset release, tenant authorization and exactly-once settlement need verification in the owning backend.

## Recommendation and interaction

The deterministic comparison uses the same enrolment, selected add-ons and entered workload for all plans. It ranks comparable first-year totals, then recurring fixed commitment, then stable Starter/Growth/Enterprise order. No plan gains a feature-fit advantage from governance, campuses, SSO or branding.

Without workload it returns `lowest_subscription`. Complete priced workload yields `estimated_lowest_total`. Missing relevant tariffs yield `incomplete_usage_pricing`, with a known fixed-subscription comparison. Custom service requirements yield `custom_service_quote_required`. Unknown fees cannot become zero-cost services or automatically disqualify Starter.

Plan selection is manual. Enrolment, add-ons and usage edits preserve the selected plan, including when it needs a capacity or eligibility correction. The automatic selector was removed on 10 November 2026. Legacy auto links retain their recorded plan and show a recovery notice. Plan/status changes are announced politely after 400ms. Price-only slider ticks do not trigger repeated announcements.

Synthetic test tariffs make each plan genuinely cheapest in a separate scenario. These are test-only examples. No marketing preference is injected into the ranking.

## Enquiry, sharing and printing

The existing `/demo/` intake receives validated inputs and a recomputed editable summary in its existing message field. Its existing consent, human check, request payload and endpoint remain responsible for the submission. The calculator itself does not submit an enquiry.

Shared URLs contain pricing version, aggregate counts, stable manually selected plan identifier and add-on flags. Unknown totals, school identities and staff values are ignored by the decoder and excluded by the encoder. Duplicate, invalid and stale values fail restoration. Stale links show a notice and current default inputs. School names, emails, prompts and student data are never encoded.

No formal quote API exists here. A future quote endpoint must validate inputs and pricing version and recompute amounts on the server. Client totals, recommendation labels, tax amounts and wallet balances cannot become authoritative through submission.

Copy-link success appears only after the clipboard call succeeds. Clipboard failure shows an actual copyable URL. Browser print/save-PDF is the export mechanism. The print view includes the selected plan, fixed amounts, assumptions, allowances and usage state.

No approved calculator analytics sink or consent-controlled event dispatcher exists in this checkout. This implementation adds no new tracking provider. Engagement instrumentation remains an integration gap.

## Mobile reading budget

The owner’s mobile target is approximately 2.5 screens for the default page. Pricing, Home, Platform, Enterprise, AEGIS and the school-management-system hub use the shared `SectionShell.mobileDisclosure` and native `ResponsiveDisclosure` for secondary content. The content exists once in the DOM, remains in the Markdown/source context and can be expanded with keyboard controls. Deep links open their relevant disclosure. Explicitly expanded views can be longer.

Pricing keeps enrolment, manual plan choice and a compact fixed subtotal in the default phone view. Optional services, full line items, detailed comparisons and commercial FAQs expand on demand. The full panel follows controls in document flow and has no inner scrolling container. Desktop content is inline. Company disclosures remain visible in the footer, whose mobile spacing and optional contact/social area are compacted.

## Verification record

The local production-export preview is `http://localhost:3100/pricing/`. The working branch is `codex/pricing-studio`. Existing uncommitted Enterprise positioning work was preserved before this change, with a patch at `/tmp/squarecampus-pricing-studio/enterprise-positioning-before-pricing.patch`.

### Changed implementation surfaces

| Area | Primary files |
| --- | --- |
| Canonical policy, arithmetic and Java parity fixtures | `packages/squarecampus-content/src/pricing-policy.json`, `pricing.ts`, `pricing-fixtures.json`, `aic-cost.ts` |
| Calculator state, validation, sharing and enquiry summary | `apps/squarecampus/src/lib/pricing-estimate.ts` |
| Page and live calculator | `apps/squarecampus/src/app/(company)/pricing/page.tsx`, `apps/squarecampus/src/components/pricing/pricing-studio.tsx` |
| Public machine-readable policy | `apps/squarecampus/src/app/pricing-policy.json/route.ts` |
| Existing enquiry integration | `apps/squarecampus/src/components/site/contact-form.tsx` |
| Shared mobile disclosure and section composition | `packages/ui/src/components/responsive-disclosure.tsx`, `section-shell.tsx`, `packages/ui/src/styles.css` |
| Shared navy, near-black and print palette | `packages/ui/src/tokens.css` |
| Product layout and print styling | `apps/squarecampus/src/app/globals.css` |
| Regression coverage | `apps/squarecampus/tests/pricing-calculator.test.ts`, `markdown-quality.test.ts` |

Commercial content, FAQs, comparisons, plan presentation, metadata, machine-readable alternatives and the pricing social card were reconciled with the same policy. Home, Platform, Enterprise, AEGIS and the school-management-system hub received the shared phone disclosure treatment.

### Automated checks

The final application build used the existing contact configuration for the local, intercepted browser tests.

```sh
bun install --frozen-lockfile
bun run check:workspace
bun run check-types
bun run test
bun run lint
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s tests -p 'test_*release*.py'
NEXT_PUBLIC_CONTACT_ENDPOINT=/api/contact NEXT_PUBLIC_FAIRHELM_CONTACT_ENABLED=true bun run build
bun run --cwd tools/quality test:browser tests/contact-human-check.spec.ts --project=phone-390 --project=desktop-1440
```

Workspace boundaries, types and workspace tests passed. SquareCampus has 104 passing tests. The release/security suite passed 34 tests. All five apps built, with 22 social-preview checks passing, 87 canonical HTML pages checked, and the 145-page export graph validating 10,870 owned links and assets. Lint passed with existing warnings.

All four contact retry browser cases passed using local synthetic challenge and enquiry responses. The initial Fairhelm cases required its existing contact-enabled build flag. The successful rerun used the explicit environment shown above.

The Hallmark screen audit recorded zero Floor failures, zero open Reflex findings and zero warnings. Four rendered waivers, three Finish answers and one dismissal remain recorded. The compact hero, dense opening rhythm and concise closing action have explicit waivers. The screen-budget notes and waiver-count note are retained. A fresh-context finish reviewer returned `ship` with zero findings. The print correction received a separate browser check after this screen audit.

Detailed logs are under `/tmp/squarecampus-pricing-studio/`, including `tests-current.log`, `types-current.log`, `lint-current.log`, `release-current.log`, `build-current.log`, `contact-browser-current.log`, `hallmark-current.log` and `browser-current.json`.

### Observed browser behavior

The browser rejected 99 students and disabled estimate sharing. At 100 students, Starter displayed ₹17,500. Manual Enterprise at 1,200 students with annual SSO and new branding displayed ₹4,27,500 for the first year and ₹4,02,500 at renewal. The copied versioned URL restored the manual plan and both add-ons. A stale `2026-11-09` link displayed the unsupported-version notice.

The actual demo entry point received the recomputed amounts in its editable message field. Keyboard Space changed the recommendation checkbox. Missing AIC/WhatsApp tariffs retained incomplete usage states. Light-mode controls and the navy action treatment were inspected. The final preview logged zero browser warnings or errors.

Seven widths from 320 to 1,440 CSS pixels passed the horizontal-overflow check, with one H1 and one main landmark. The 200% reflow equivalent used a 720×450 CSS-pixel viewport at 2× scale. Native browser zoom itself was outside that check.

Print media now exposes the full estimate from a closed phone disclosure, including progressive slabs, renewal, allowances, assumptions and policy version. Its paper is white with dark text. This was checked in the browser with the phone disclosure still closed.

### Default mobile page heights

Measured at 390×844 CSS pixels with secondary disclosures closed.

| Page | Height | Screens |
| --- | --- | --- |
| Home | 1,944px | 2.30 |
| Pricing | 2,105px | 2.49 |
| Platform | 2,102px | 2.49 |
| Enterprise | 1,784px | 2.11 |
| AEGIS | 1,968px | 2.33 |
| School management system hub | 2,109px | 2.50 |

At 360×844, Pricing measured 2,122px or 2.51 screens. At 320×844 it measured 2,279px or 2.70 screens. Expanding details increases the page length. Reviewed company disclosures remain visible.

### Representative captures

| View | Local artifact |
| --- | --- |
| Before, desktop | `/tmp/squarecampus-pricing-studio/before/screen-pricing-desktop.png` |
| Before, phone | `/tmp/squarecampus-pricing-studio/before/screen-pricing-phone.png` |
| After, desktop with 100 students | `/tmp/squarecampus-pricing-studio/after/pricing-desktop.png` |
| After, phone with 100 students | `/tmp/squarecampus-pricing-studio/after/pricing-phone.png` |
| After, complete phone page with 100 students | `/tmp/squarecampus-pricing-studio/after/pricing-phone-full.png` |
| Print from closed phone breakdown | `/tmp/squarecampus-pricing-studio/print-estimate-phone.png` |

The pricing workbench uses real controls and supplied prices. It has zero image placeholders. AIC validity and operation tariffs, WhatsApp tariffs, final invoice tax treatment, app-store fees and maintenance scope are the remaining commercial inputs for complete usage and purchase terms. Product-ledger enforcement, an authoritative quote API and consent-controlled calculator analytics remain integration work in their owning systems.

## Quantity sliders and visible slab cards

All six numeric controls share the same native-slider and click-to-edit number component. API peak requests, monthly AIC, SMS segments, recipient emails and WhatsApp messages begin unset. Moving a slider or entering a value opts that forecast in. Clearing the number restores the unset state. AIC retains three decimal places. Whole-number validation, the existing quantity limits and the 50-lakh student ceiling apply to both editing and restored estimates.

Monthly quantity sliders start at 0–10,000. The API peak slider starts at 0–4,000 requests per rolling minute, derived from twice the largest approved plan limit. These are presentation ranges. Typing a larger supported value expands the range, and dragging keeps the current range stable. Enter returns focus to the number label, while clicking elsewhere commits without taking focus away from that control.

The progressive slab section appears only above 1,000 students. It displays two cards from 1,001 through 5,000 and three above 5,000. Each card shows the active student range, quantity, annual unit rate and exact subtotal. Desktop cards sit side by side and phone cards stack. The section has no disclosure control. Estimate assumptions are visible bullet points with highlighted annual, monthly-equivalent and one-time branding amounts. The print view retains the cards, bullets and readable text contrast.

The completed correction passes 128 SquareCampus tests, 22 phone/desktop browser cases, workspace type checks and lint with existing warnings. All five applications build and the export checks pass. Evidence is stored under `/tmp/squarecampus-pricing-studio/` with the `sliders-cards-` prefix.

## Growth eligibility for SSO and branded apps

The owner's subsequent decision restricts optional Entra SSO and white-label Android/iOS apps to Growth and Enterprise. Version `2026-11-09.5` records both eligible-plan lists in the canonical policy. API access remains optional on all three plans. Core module, campus, export and security eligibility is unchanged.

Automatic recommendation filters out plans that cannot supply selected add-ons, then evaluates approved API capacity and comparable costs. Each choice independently moves the base recommendation from Starter to Growth. A qualifying API peak can require Enterprise. AIC inputs produce a conditional pack forecast using the inherited allocation. Communication inputs expose incomplete states when required tariffs are unknown.

Manual selection preserves every input. A Starter combination with either restricted service is explicitly ineligible, cannot be shared, printed or forwarded as an enquiry, and displays an eligibility warning in place of the quote. Existing links that specify such a combination show the same correction. Prior-version links retain the standard stale-version notice. Paid branding remains one-time on eligible plans, including ordinary renewal and Growth/Enterprise changes.

The eligibility correction passes 131 SquareCampus tests and 26 phone/desktop browser cases. Workspace types, lint and all five application builds pass. Logs and the current mobile capture use the `eligibility-` prefix under `/tmp/squarecampus-pricing-studio/`.

## Catalogue v3 update

Policy `2026-11-09.6` incorporates AIC catalogue `2026-11-09.v3`. The owner explicitly waived the missing CODEX_PROMPT.md and external validator/fixture bundle. Repository regression cases use the supplied Markdown worked examples and an independent full-range comparison for the bounded pack-cover algorithm. Current SSO/branding eligibility and the owner-approved plan-specific API price/limits take precedence over the attachment’s older non-AIC defaults.

## Publisher, tax and estimate presentation update

Policy `2026-11-09.7` records the owner's confirmation that Fairhelm Systems owns publisher accounts for both standard and white-label mobile apps. App-store fees and maintenance scope remain subject to confirmation.

The owner approved an estimated 18% domestic GST calculation. The calculator displays the tax and tax-inclusive purchase-year and comparable renewal amounts separately from the base prices. Existing half-up per-line rounding uses integer paise. For the 1,200-student Enterprise example with SSO, new branding and one 10,000-AIC pack, the purchase-year subtotal is ₹4,57,500, estimated GST is ₹82,350 and the GST-inclusive estimate is ₹5,39,850. Comparable renewal including estimated GST is ₹4,74,950. Final invoice classification and the CGST/SGST or IGST split depend on verified billing details.

Official IT-services guidance states the 18% rate. The IGST Act describes domestic place-of-supply and inter-state versus intra-state treatment. Reviewed on 9 November 2026. [IT-services GST FAQ](https://comtax.wb.gov.in/GST/GST_FAQ/FAQ_on_IT_&_IT_Enabled_Services_under_GST.pdf), [IGST Act](https://cbic-gst.gov.in/hindi/IGST-bill-e.html).

AIC selection, monthly demand and the pack-aware forecast now occupy a separate calculator section. Explicit pack selections still enter the purchase-year amount once. Suggested additional packs receive their own GST estimate and never automatically become a purchase. The subscription card has a subtle token-based grid and a bold plan name with its existing plan icon.

The detailed allowance explanation and estimate assumptions open in the shared, keyboard-accessible bottom sheet. A single copy component supplies both the sheet and the printable document. Its static printable copy preserves the assumptions when the sheet is closed. The sheet supports Escape, a close control and focus restoration. Its layout is bounded on desktop.

Malformed share links restore independently valid fields and recompute prices using the current policy. Conflicting duplicate values are discarded. Invalid quantities return to a safe field default, unknown packs are ignored, and safe pack selections survive. Older links restore usable selections with a current-price notice. URL-provided totals and entitlements carry no invoice authority.

The shared outline button has a visible hover fill and border. Print/save uses native document printing with A4 margins, page numbers, selectable text, repeating table headings and row-break protection. Print-only content includes the complete assumptions and AIC projection while empty usage placeholders and interactive overlays are omitted. Desktop and phone browser checks exercise the same printed document layout.

The assumptions trigger uses an underlined link-style button, as requested. Its shared sheet copy also supplies the print view. The verified sample PDF has two A4 pages, with the full subscription estimate and assumptions on page one and the AIC projection on page two. Text extraction confirms the purchase-year subtotal, estimated GST, tax-inclusive purchase and renewal totals, and closing AIC balance. Each page was rendered and visually inspected for clipping and contrast.

The final refinement passes 143 SquareCampus tests, all workspace test tasks, workspace types and lint. Browser coverage passes 37 cases with one intentional desktop skip for the reference-phone height test. All five apps build and the export checks pass. Hallmark uses the previously recorded design waivers. Logs, screenshots and `squarecampus-estimate.pdf` are under `/tmp/squarecampus-pricing-studio/`; refinement logs use the `refinement-` prefix. The 390×844 default page measures 2,109px, or 2.499 screens.

Refinement code also touches `packages/ui/src/components/button.tsx` for visible outline hover states, `packages/ui/src/components/bottom-sheet.tsx` for a bounded sheet and printable overlay hooks, and `apps/squarecampus/src/components/pricing/estimate-assumptions.tsx` for the shared assumptions content. The pricing policy, model, form-state parser, pricing UI, commercial copy, tests and styles listed above contain the remaining changes.

## Custom AIC, optional Enterprise SSO and access popover

The owner's follow-up approved current volume rates with graduated bands, replacing fixed packages. Policy `2026-11-09.8` records that decision and all-plan optional Entra SSO. Enterprise activation adds zero to purchase and renewal totals. Starter and Growth add ₹2,500/year when SSO is selected. Customers supply their Entra tenant and Microsoft licences.

Current share links use `prepaidAicCredits`. Legacy `pack_aic_*` selections convert into their aggregate whole-credit quantity and are recomputed under current prices, with a restoration notice. Conflicting new and legacy quantities are reset. Submitted totals have no invoice authority.

The feature-access explanation uses the shared native `InfoPopover`. Its content remains in exported HTML and Markdown. Click, touch, keyboard, Escape, light-dismiss and the close button use browser popover behaviour. CSS anchor positioning attaches it to its trigger where supported. The fallback is a viewport-centred popover. Opening it does not change the calculator's document position or page height.

The previous GHE pricing page was reviewed from `origin/main`. Its institutional-fit emphasis informs the current plan descriptions. Enterprise is highlighted with its largest AI allowance, included white-label apps and included optional SSO. Common feature eligibility remains explicit, and automatic recommendations retain cost-based ranking.


## Prepaid AIC and analytical walkthrough, 10 November 2026

Prepaid selection uses an Add prepaid AIC checkbox in place of the API peak input. Selecting it opens a whole-credit quantity at 1,000 with a native minimum of 1,000. Clearing it removes the purchase. Typed positive amounts below 1,000 become 1,000 when editing commits. An empty selected quantity also becomes 1,000. Invalid, negative and unsafe inputs retain field validation. The custom-quote and previously purchased branding controls are removed. Legacy API-peak and custom-quote selections are cleared with a recovery notice. Existing branding ownership in older saved estimates retains its once-only charging behavior. Annual licence prices remain visible when an unrelated usage field is invalid.

Monthly AIC burn inputs and forecasts are removed from the marketing calculator. Saved monthly-burn fields are ignored with a recovery notice and excluded from new shared links. Prepaid quantity and the underlying milli-AIC accounting remain independent.

The three illustrative scenarios are authored sample data in `src/content/aic-walkthrough.ts`. They calculate attendance with exact ratio comparisons, financial reconciliation in integer paise and policy-aware cohort matches with null marks preserved. The walkthrough reuses the shared Base UI bottom sheet. A single reducer owns scenario, stage, approval and safeguard state. One cancellable timer advances a visible, playing scene. Reduced motion uses manual navigation. Hidden tabs pause playback and closing the sheet unmounts the player.

Approval precedes substantive retrieval. Unknown scenario tariffs stay as quote placeholders. The separate 2-AIC explanation illustrates an accepted quote without assigning a scenario tariff. Sample answers are inspectable independently of playback and remain in static HTML and generated Markdown. Access denial, unapproved scope, missing policies, platform failure and a valid zero-match answer have explicit demonstration boundaries. All sample logic runs locally.

The approved communication grant update is policy `2026-11-10.1`. Fixed estimates and per-plan communication projections use the same canonical 3/6/9 multipliers, and the comparison table and public copy share those values.

The standalone published student-rate table is removed. The public versioned pricing policy remains linked, the live annual and active-slab calculations remain visible, and the existing `#model` and `#volume` anchors are retained on the plan comparison and policy link. Native fragment-expanded disclosures intentionally allow the browser-managed open attribute during hydration.


## Final owner direction, 10 November 2026

The monthly AIC burn input, top-up forecast, monthly projection and forecast assumptions are removed from the pricing page. An AIC purchase is solely the selected whole prepaid quantity, charged once using the existing graduated bands and minimum of 1,000. Saved monthly-burn fields are ignored with a recovery notice and excluded from new shared estimates. The analytical walkthroughs remain.

Growth includes a shared tenant-wide pool of 1,500 AIC per month and Enterprise 4,000 AIC per month (raised from 2,500 on 2026-11-10). Starter includes no AIC and the public page says so. Included grants expire monthly and purchased balances carry forward. The policy-wide all-allowances-approved flag remains false while Starter’s grant is proposed, with the status explicitly identifying the confirmed Growth and Enterprise pools.

The standalone student-rate table and its former component are removed. The public policy remains linked, active student slabs stay on the estimate, and the existing pricing anchors are preserved. Communication grants remain 3/6/9 credits per enrolled student for Starter/Growth/Enterprise.


## Final verification of the 10 November refinement

All 147 SquareCampus unit checks, all workspace unit suites and 12 type tasks passed. All five independent app builds passed, including claims, content, machine-readable, social, legal and migration gates. The exported graph covers 87 canonical pages and 10,873 owned links/assets with zero failures.

Production-preview browser coverage passed 35 focused cases across 360, 390, 768, 1024 and 1440px. The broader pricing regressions passed 55 cases across phone and desktop, with one expected phone-only viewport skip. A separate 320px check verified all three scenario controls’ visible and accessible names and zero horizontal overflow. Scope approval, failure/retry, hidden-tab pause, rapid scenario switching, reduced motion, focus return, no-script evidence, sharing and print behavior were exercised.

The rendered Hallmark sweep reported zero Floor failures and zero warnings, with the pre-existing recorded waiver retained. Fresh-context finish review found a label-in-name mismatch in compact scenario controls. Using full visible scenario names resolved it, with accessible-name equality and 320px overflow checks confirming the fix. Default Starter captures were corrected after a nested query-containment issue was fixed and focus/scroll were cleared for screenshots.

The production-edge preview is available at `http://localhost:3100/pricing/`. Existing lint warnings are retained. The scenario operation tariffs remain unapproved, so their quote placeholders are intentional.

## 2026-11-10 pricing page revision

Policy `2026-11-10.2` supersedes `2026-11-10.1` on the owner's direction. Enterprise now includes white-label Android and iOS apps (`addOns.whiteLabelIncludedPlans`), so the calculator adds no branding charge on Enterprise; Growth still pays ₹25,000 once. The Enterprise monthly AIC pool is 4,000 and its Data & Events API limit is 4,000 RPM (RPM replaces TPM in public copy). Custom AEGIS dashboards are an optional Enterprise service, scoped and quoted, and are not described as a shipped feature.

Renewal rates are sent in writing at least 30 days before the renewal date and confirmed on a renewal order form. On-premises deployment is removed from public copy; private deployment on AWS or in a private cloud stays a scoped service, and running inside the institution's own cloud account is not offered. Draft wording ("proposed", "pending", "require confirmation") is removed from the public page. The pricing page now shows what the Enterprise premium buys in rupees at 1,200 students (`enterprise-value.tsx`), derived from the rate card and valued at list rates. At that enrolment Enterprise costs ₹1,37,000 more than Growth and includes ₹1,43,300 of first-year list-rate value and ₹1,18,300 of recurring list-rate value, conditional on using the additional pools. The first-year figure includes ₹25,000 of one-time branding value. Optional API fees are quoted separately.

Future generally available standard features are included in every plan at the existing licence entitlement. PTM is an illustrative future feature. Its release carries no feature fee, compulsory upgrade or feature-based licence repricing. The versioned `featureAccess` policy and shared FAQs encode this rule. Contracted-term rates and the minimum 30-day renewal notice are separately represented in `renewal`.
